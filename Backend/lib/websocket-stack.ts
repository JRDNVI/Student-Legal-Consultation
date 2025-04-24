import * as cdk from "aws-cdk-lib";
import * as lambdanode from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";

type AppApiProps = {
  userPoolId: string;
  userPoolClientId: string;
};

export class WebSocketAPI extends Construct {
  public readonly messagesTable : dynamodb.Table;

  constructor(scope: Construct, id: string, props: AppApiProps) {
    super(scope, id);

    const region = cdk.Stack.of(this).region;
    const account = cdk.Stack.of(this).account;

    const connectionsTable = new dynamodb.Table(this, "WebSocketConnections", {
      partitionKey: { name: "connectionId", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    connectionsTable.addGlobalSecondaryIndex({
      indexName: "email-index",
      partitionKey: { name: "email", type: dynamodb.AttributeType.STRING },
      projectionType: dynamodb.ProjectionType.ALL,
    });
    

    const messagesTable = new dynamodb.Table(this, "WebSocketMessages", {
      partitionKey: { name: "chatId", type: dynamodb.AttributeType.STRING },
      sortKey: { name: "timestamp", type: dynamodb.AttributeType.STRING },
      billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
    });

    this.messagesTable = messagesTable
 

    const commonLambdaProps = {
      architecture: lambda.Architecture.ARM_64,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "handler",
      environment: {
        CONNECTION_TABLE: connectionsTable.tableName,
        MESSAGE_TABLE: messagesTable.tableName,
        REGION: region,
      },
    };

    const connectFn = new lambdanode.NodejsFunction(this, "WebSocketConnectFn", {
      ...commonLambdaProps,
      entry: `${__dirname}/../lambdas/websocket/connect.ts`,
    });

    const disconnectFn = new lambdanode.NodejsFunction(this, "WebSocketDisconnectFn", {
      ...commonLambdaProps,
      entry: `${__dirname}/../lambdas/websocket/disconnect.ts`,
    });

    const authorizerFn = new lambdanode.NodejsFunction(this, "WebsocketAuthFn", {
      ...commonLambdaProps,
      entry: `${__dirname}/../lambdas/auth/websocket-authorizer.ts`,
      environment: {
        ...commonLambdaProps.environment,
        USER_POOL_ID: props.userPoolId,
      }
    })

    const webSocketApi = new apigwv2.CfnApi(this, "WebSocketApi", {
      name: "MyWebSocketApi",
      protocolType: "WEBSOCKET",
      routeSelectionExpression: "$request.body.action",
    });

    const sendMessageFn = new lambdanode.NodejsFunction(this, "WebSocketSendMessageFn", {
      ...commonLambdaProps,
      entry: `${__dirname}/../lambdas/websocket/sendMessage.ts`,
      environment: {
        ...commonLambdaProps.environment,
        DOMAIN_NAME: `${webSocketApi.ref}.execute-api.${region}.amazonaws.com`,
        STAGE: 'prod',
      },
    });
    const requestAuthorizer = new apigwv2.CfnAuthorizer(this, "WebSocketRequestAuthorizer", {
      apiId: webSocketApi.ref,
      name: "WebSocketLambdaRequestAuthorizer",
      authorizerType: "REQUEST",
      authorizerUri: `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${authorizerFn.functionArn}/invocations`,
      identitySource: ["route.request.querystring.token"], 
    });
    

    const connectIntegration = new apigwv2.CfnIntegration(this, "ConnectIntegration", {
      apiId: webSocketApi.ref,
      integrationType: "AWS_PROXY",
      integrationUri: `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${connectFn.functionArn}/invocations`,
    });

    const disconnectIntegration = new apigwv2.CfnIntegration(this, "DisconnectIntegration", {
      apiId: webSocketApi.ref,
      integrationType: "AWS_PROXY",
      integrationUri: `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${disconnectFn.functionArn}/invocations`,
    });

    const sendMessageIntegration = new apigwv2.CfnIntegration(this, "SendMessageIntegration", {
      apiId: webSocketApi.ref,
      integrationType: "AWS_PROXY",
      integrationUri: `arn:aws:apigateway:${region}:lambda:path/2015-03-31/functions/${sendMessageFn.functionArn}/invocations`,
    });

    new apigwv2.CfnRoute(this, "ConnectRoute", {
      apiId: webSocketApi.ref,
      routeKey: "$connect",
      target: `integrations/${connectIntegration.ref}`,
      authorizationType: "CUSTOM",
      authorizerId: requestAuthorizer.ref,
    });

    new apigwv2.CfnRoute(this, "DisconnectRoute", {
      apiId: webSocketApi.ref,
      routeKey: "$disconnect",
      target: `integrations/${disconnectIntegration.ref}`,
    });

    new apigwv2.CfnRoute(this, "SendMessageRoute", {
      apiId: webSocketApi.ref,
      routeKey: "sendMessage",
      target: `integrations/${sendMessageIntegration.ref}`,
      authorizationType: "NONE", 
    });


    const stage = new apigwv2.CfnStage(this, "WebSocketStage", {
      apiId: webSocketApi.ref,
      stageName: "prod",
      autoDeploy: true,
    });

    connectionsTable.grantReadWriteData(connectFn);
    connectionsTable.grantReadWriteData(disconnectFn);
    connectionsTable.grantReadWriteData(sendMessageFn)
    messagesTable.grantReadWriteData(sendMessageFn);

    [connectFn, disconnectFn, sendMessageFn, authorizerFn].forEach(fn => {
      fn.grantInvoke(new iam.ServicePrincipal("apigateway.amazonaws.com"));
    });

    sendMessageFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["execute-api:ManageConnections"],
        resources: [
          `arn:aws:execute-api:${region}:${account}:${webSocketApi.ref}/${stage.stageName}/POST/@connections/*`,
        ],
      })
    );

    sendMessageFn.addToRolePolicy(
      new iam.PolicyStatement({
        actions: ["dynamodb:Query"],
        resources: [
          connectionsTable.tableArn + "/index/email-index", 
        ],
      })
    );
    
    new cdk.CfnOutput(this, "WebSocketEndpoint", {
      value: `wss://${webSocketApi.ref}.execute-api.${region}.amazonaws.com/${stage.stageName}`,
    });

  }
}

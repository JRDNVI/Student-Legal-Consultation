import * as cdk from "aws-cdk-lib";
import * as lambdanode from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as apigwv2 from "aws-cdk-lib/aws-apigatewayv2";
import * as integrations from "aws-cdk-lib/aws-apigatewayv2-integrations";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as iam from "aws-cdk-lib/aws-iam";


type AppApiProps = {
    userPoolId: string;
    userPoolClientId: string;
};

export class WebSocketAPI extends Construct {

    constructor(scope: Construct, id: string, props: AppApiProps) {
        super(scope, id);

        const connectionsTable = new dynamodb.Table(this, "WebSocketConnections", {
            partitionKey: { name: "connectionId", type: dynamodb.AttributeType.STRING },
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        });

        const messagesTable = new dynamodb.Table(this, "WebSocketMessages", {
            partitionKey: { name: "chatId", type: dynamodb.AttributeType.STRING },
            sortKey: { name: "timestamp", type: dynamodb.AttributeType.STRING },
            removalPolicy: cdk.RemovalPolicy.DESTROY,
            billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
        });

        const appCommonFnProps = {
            architecture: lambda.Architecture.ARM_64,
            timeout: cdk.Duration.seconds(10),
            memorySize: 128,
            runtime: lambda.Runtime.NODEJS_18_X,
            handler: "handler",
            environment: {
                CONNECTION_TABLE: connectionsTable.tableName,
                MESSAGE_TABLE: messagesTable.tableName,
                USER_POOL_ID: props.userPoolId,
                CLIENT_ID: props.userPoolClientId,
                REGION: cdk.Aws.REGION
            },
        };

        // Define Lambda functions
        const connectFn = new lambdanode.NodejsFunction(this, "WebSocketConnectFn", {
            ...appCommonFnProps,
            entry: `${__dirname}/../lambdas/websocket/connect.ts`,
        });

        const disconnectFn = new lambdanode.NodejsFunction(this, "WebSocketDisconnectFn", {
            ...appCommonFnProps,
            entry: `${__dirname}/../lambdas/websocket/disconnect.ts`,
        });

        const sendMessageFn = new lambdanode.NodejsFunction(this, "WebSocketSendMessageFn", {
            ...appCommonFnProps,
            entry: `${__dirname}/../lambdas/websocket/sendMessage.ts`,
        });

        // Grant sendMessage Lambda permission to manage WebSocket connections
        sendMessageFn.addToRolePolicy(new iam.PolicyStatement({
            actions: ["execute-api:ManageConnections"],
            resources: ["*"]
        }));

        // Create WebSocket API
        const webSocketApi = new apigwv2.WebSocketApi(this, "WebSocketAPI", {
            connectRouteOptions: { integration: new integrations.WebSocketLambdaIntegration("ConnectIntegration", connectFn) },
            disconnectRouteOptions: { integration: new integrations.WebSocketLambdaIntegration("DisconnectIntegration", disconnectFn) },
            defaultRouteOptions: { integration: new integrations.WebSocketLambdaIntegration("SendMessageIntegration", sendMessageFn) },
        });

        connectionsTable.grantReadWriteData(connectFn);
        connectionsTable.grantReadWriteData(disconnectFn);
        connectionsTable.grantReadWriteData(sendMessageFn);

        messagesTable.grantReadWriteData(sendMessageFn);

        // Deploy WebSocket API
        const stage = new apigwv2.WebSocketStage(this, "WebSocketStage", {
            webSocketApi,
            stageName: "prod",
            autoDeploy: true,
        });

        // Output WebSocket URL
        new cdk.CfnOutput(this, "WebSocketEndpoint", {
            value: stage.url,
        });
    }
}
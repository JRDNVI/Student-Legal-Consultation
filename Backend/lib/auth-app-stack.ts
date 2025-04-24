import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import { StringAttribute, UserPool } from "aws-cdk-lib/aws-cognito";
import { AuthApi } from './auth-api'
import { AppApi } from './app-stack'
import { WebSocketAPI } from "./websocket-stack";

// Finished

// This stack is called a monolithic stack, which means it contains all the core resources 
// needed for the application in one deployable unit. It creates a user pool for authentication and 
// passes the user pool ID and client ID to two separate constructs: AuthApi and AppApi, which are:
// 
// 1. AuthApi - handles authentication-related Lambda and API Gateway functionality.
//              This construct allow needs access to the RDS database, so it is passed the
//              database host and secret from the AppApi construct.
//
// 2. AppApi  - provisions the application’s backend resources like RDS, VPC, S3 and business logic
// 
// Each construct is modular and encapsulated, but everything is deployed together under 
// this single CDK stack (AuthAppStack).

export class AuthAppStack extends cdk.Stack {

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const userPool = new UserPool(this, "UserPool", {
      signInAliases: { username: true, email: true },
      selfSignUpEnabled: true,
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      customAttributes: {
        role: new StringAttribute(), 
      },
    });

    const userPoolId = userPool.userPoolId;

    const appClient = userPool.addClient("AppClient", {
      authFlows: { userPassword: true },
    });

    const userPoolClientId = appClient.userPoolClientId;

   const websocketAPI = new WebSocketAPI(this, 'WebSocket', {
      userPoolId: userPoolId,
      userPoolClientId: userPoolClientId
    })

    const appApi = new AppApi(this, 'AppApi', {
      userPoolId: userPoolId,
      userPoolClientId: userPoolClientId,
      messageTable: websocketAPI.messagesTable
    });

    new AuthApi(this, 'AuthServiceApi', {
      userPoolId: userPoolId,
      userPoolClientId: userPoolClientId,
      dbHost: appApi.dbEndpoint,
      dbSecret: appApi.dbSecret,
    });
  } 
}
  

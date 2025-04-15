import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import * as apig from "aws-cdk-lib/aws-apigateway";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as node from "aws-cdk-lib/aws-lambda-nodejs";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";


// This stack creates an API Gateway with multiple routes for authentication and user management.
//
//   Routes handled:
//   - POST /auth/signup          → User registration (Cognito) + User Role (Student, Client, etc)
//   - POST /auth/confirm_signup  → Account confirmation + DB user addded
//   - POST /auth/signin          → User login
//   - GET  /auth/signout         → User logout
//   
//   Each route is mapped to a separate Lambda function, 
//   with shared environment variables and access to my MySQL RDS via Secrets Manager.
//   
//   CORS is enabled for http://localhost:3000. (Needs to be changed)

type AuthApiProps = {
  userPoolId: string;
  userPoolClientId: string;
  dbHost: string;
  dbSecret: secretsmanager.ISecret
};

export class AuthApi extends Construct {
  private auth: apig.IResource;
  private userPoolId: string;
  private userPoolClientId: string;
  private dbHost: string;
  private dbSecret: secretsmanager.ISecret;

  constructor(scope: Construct, id: string, props: AuthApiProps) {
    super(scope, id);

    ({ userPoolId: this.userPoolId, userPoolClientId: this.userPoolClientId, dbHost: this.dbHost, dbSecret: this.dbSecret } = props);

    const api = new apig.RestApi(this, "AuthServiceApi", {
      description: "Authentication Service RestApi",
      endpointTypes: [apig.EndpointType.REGIONAL],
      defaultCorsPreflightOptions: {
        allowOrigins: ['http://localhost:3000'],
        allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
        allowHeaders: ['Content-Type', 'Authorization'],
      },
    });

    this.auth = api.root.addResource("auth");

    this.addAuthRoute(
        "signup", 
        "POST", 
        "SignupFn", 
        "signup.ts"
    );

    this.addAuthRoute(
      "confirm_signup",
      "POST",
      "ConfirmFn",
      "confirm-signup.ts"
    );

    this.addAuthRoute(
        "signout", 
        "GET", 
        "SignoutFn", 
        "signout.ts"
    );
    
    this.addAuthRoute(
        "signin", 
        "POST", 
        "SigninFn", 
        "signin.ts"
    );
  }

  private addAuthRoute(
    resourceName: string,
    method: string,
    fnName: string,
    fnEntry: string
  ): void {
    const commonFnProps = {
      architecture: lambda.Architecture.ARM_64,
      timeout: cdk.Duration.seconds(10),
      memorySize: 128,
      runtime: lambda.Runtime.NODEJS_18_X,
      handler: "handler",
      environment: {
        DB_HOST: this.dbHost,
        DB_SECRET: this.dbSecret.secretName, // Pass string instead of object
        USER_POOL_ID: this.userPoolId,
        CLIENT_ID: this.userPoolClientId,
        REGION: cdk.Aws.REGION,
      },
    };

    const resource = this.auth.addResource(resourceName);

    const fn = new node.NodejsFunction(this, fnName, {
      ...commonFnProps,
      entry: `${__dirname}/../lambdas/auth/${fnEntry}`,
    });

    this.dbSecret.grantRead(fn)

    if (fnName === "ConfirmFn") {
      fn.addToRolePolicy(
        new cdk.aws_iam.PolicyStatement({
          actions: ["cognito-idp:AdminGetUser"],
          resources: [
            `arn:aws:cognito-idp:${cdk.Aws.REGION}:${cdk.Aws.ACCOUNT_ID}:userpool/${this.userPoolId}`,
          ],
        })
      );
    }

    resource.addMethod(method, new apig.LambdaIntegration(fn));
  }
}
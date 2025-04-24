import * as cdk from "aws-cdk-lib";
import * as lambdanode from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import { Construct } from "constructs";
import * as rds from "aws-cdk-lib/aws-rds";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as apig from "aws-cdk-lib/aws-apigateway";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
// Unfinished

type AppApiProps = {
    userPoolId: string;
    userPoolClientId: string;
    messageTable: dynamodb.ITable
  };
  
  export class AppApi extends Construct {
    public readonly dbEndpoint: string;
    public readonly dbSecret: secretsmanager.ISecret;

    constructor(scope: Construct, id: string, props: AppApiProps) {
        super(scope, id);

        //                                     RDS DATABASE 
        // Currrent implementation uses my default VPC, which only contains public subnets.
        // Meaning that the RDS instance is publicly accessible, which is not standered practice.
        // But for to keep the price low, I will use the default VPC. The Secuirty Group is set 
        // to allow all inbound traffic from anywhere, which is not secure. But for the sake of simplicity, 
        // I will use this configuration for now. The database password is stored in AWS Secrets Manager, 
        // which can be reterived when needed.

        const vpc = ec2.Vpc.fromLookup(this, 'ExistingVpc', {
          isDefault: true, 
        });

        const dbSecurityGroup = new ec2.SecurityGroup(this, "DBSecurityGroup", {
          vpc,
          allowAllOutbound: true,
          description: "Allow all inbound traffic to RDS",
        });
    
        dbSecurityGroup.addIngressRule(
          ec2.Peer.anyIpv4(),
          ec2.Port.tcp(3306),
          "Allow MySQL from anywhere"
        );
        
        const dbCredentialsSecret = new secretsmanager.Secret(this, "DBCredentials", {
          secretName: "fyp-db-credentials",
          generateSecretString: {
            secretStringTemplate: JSON.stringify({ username: "admin" }),
            generateStringKey: "password",
            excludePunctuation: true,
          },
        });
    
        const dbInstance = new rds.DatabaseInstance(this, "FYPDatabase", {
          engine: rds.DatabaseInstanceEngine.mysql({
          version: rds.MysqlEngineVersion.VER_8_0,
        }),
        instanceType: ec2.InstanceType.of(
          ec2.InstanceClass.T3,
          ec2.InstanceSize.MICRO
        ),
        vpc,
        credentials: rds.Credentials.fromSecret(dbCredentialsSecret),
        databaseName: "fypdb",
        allocatedStorage: 20,
        vpcSubnets: {
          subnetType: ec2.SubnetType.PUBLIC,
        },
        securityGroups: [dbSecurityGroup],
        publiclyAccessible: true,        
        removalPolicy: cdk.RemovalPolicy.DESTROY,
        deletionProtection: false,
      });

      this.dbEndpoint = dbInstance.dbInstanceEndpointAddress;
      this.dbSecret = dbCredentialsSecret;

      
      const appCommonFnProps = {
        architecture: lambda.Architecture.ARM_64,
        timeout: cdk.Duration.seconds(10),
        memorySize: 128,
        runtime: lambda.Runtime.NODEJS_18_X,
        handler: "handler",
        environment: {
          DB_ENDPOINT: dbInstance.dbInstanceEndpointAddress,
          DB_SECRET: "fyp-db-credentials",
          USER_POOL_ID: props.userPoolId,
          CLIENT_ID: props.userPoolClientId,
          REGION: cdk.Aws.REGION,
        },
      };

      // Lmabda functions for Education Side of PWA

      const authorizerFn = new lambdanode.NodejsFunction(this, "AuthorizerFn", {
        ...appCommonFnProps,
        entry: `${__dirname}/../lambdas/auth/authorizer.ts`,
      });

      const getUserDataFn = new lambdanode.NodejsFunction(this, "GetStudentDataFn", {
        ...appCommonFnProps,
        entry: `${__dirname}/../lambdas/userCRUD/getUserData.ts`,
      });
      
      const addUserDataFn = new lambdanode.NodejsFunction(this, "AddStudentDataFn", {
        ...appCommonFnProps,
        entry: `${__dirname}/../lambdas/userCRUD/addUserData.ts`,
      });
      
      const updateUserDataFn = new lambdanode.NodejsFunction(this, "UpdateStudentDataFn", {
        ...appCommonFnProps,
        entry: `${__dirname}/../lambdas/userCRUD/updateUserData.ts`,
      });

      const deleteUserDataFn = new lambdanode.NodejsFunction(this, "DeleteStudentDataFn", {
        ...appCommonFnProps, 
        entry: `${__dirname}/../lambdas/userCRUD/deleteUserData.ts`,
      });

      const matchStudentFn = new lambdanode.NodejsFunction(this, "MatchStudentFn", {
        ...appCommonFnProps,
        entry: `${__dirname}/../lambdas/matchingAlgo/match-student.ts`,
      });

      const matchClientFn = new lambdanode.NodejsFunction(this, "MatchClientFn",  {
        ...appCommonFnProps,
        entry: `${__dirname}/../lambdas/matchingAlgo/legal-matching.ts`
      });

      const getHistoryFn = new lambdanode.NodejsFunction(this, "GetChatHistory", {
        ...appCommonFnProps,
        entry: `${__dirname}/../lambdas/UserCRUD/getChatHistory.ts`,
        environment: {
          ...appCommonFnProps.environment,
          MESSAGE_TABLE: props.messageTable.tableName
        }
      })


      const requestAuthorizer = new apig.RequestAuthorizer(
        this,
        "RequestAuthorizer",
        {
          identitySources: [apig.IdentitySource.header("Authorization")],
          handler: authorizerFn,
          resultsCacheTtl: cdk.Duration.minutes(0),
        }
      );

      const appApi = new apig.RestApi(this, "RestAPI", {
        description: "Stdent Legal Consultation API",
        deployOptions: {
          stageName: "dev",
        },
        defaultCorsPreflightOptions: {
          allowHeaders: ["Content-Type", "X-Amz-Date", "Authorization"],
          allowMethods: ["OPTIONS", "GET", "POST", "PUT", "PATCH", "DELETE"],
          allowCredentials: true,
          allowOrigins: ["*"],
        },
      });

      dbCredentialsSecret.grantRead(getUserDataFn);
      dbCredentialsSecret.grantRead(addUserDataFn);
      dbCredentialsSecret.grantRead(updateUserDataFn);
      dbCredentialsSecret.grantRead(deleteUserDataFn);
      dbCredentialsSecret.grantRead(matchStudentFn);
      dbCredentialsSecret.grantRead(matchClientFn)
      props.messageTable.grantReadWriteData(getHistoryFn)

      const educationEndpoint = appApi.root.addResource("education");

      educationEndpoint.addMethod("GET", new apig.LambdaIntegration(getUserDataFn, { proxy: true }), {
        authorizer: requestAuthorizer,
        authorizationType: apig.AuthorizationType.CUSTOM,
    });
       
      const matchStudentEndpoint = educationEndpoint.addResource("match-student")

      matchStudentEndpoint.addMethod("GET", new apig.LambdaIntegration(matchStudentFn, { proxy: true }), {
        authorizer: requestAuthorizer,
        authorizationType: apig.AuthorizationType.CUSTOM,
    });

      educationEndpoint.addMethod("POST", new apig.LambdaIntegration(addUserDataFn, { proxy: true }), {
        authorizer: requestAuthorizer,
        authorizationType: apig.AuthorizationType.CUSTOM,
    });

    educationEndpoint.addMethod("PUT", new apig.LambdaIntegration(updateUserDataFn, { proxy: true }), {
      authorizer: requestAuthorizer,
      authorizationType: apig.AuthorizationType.CUSTOM,
    });

    const chatHistoryEndpoint = educationEndpoint.addResource("chat-history");

    chatHistoryEndpoint.addMethod("GET", new apig.LambdaIntegration(getHistoryFn, { proxy: true }), {
      authorizer: requestAuthorizer,
      authorizationType: apig.AuthorizationType.CUSTOM,
    });


    educationEndpoint.addMethod("DELETE", new apig.LambdaIntegration(deleteUserDataFn, { proxy: true }), {
      authorizer: requestAuthorizer,
      authorizationType: apig.AuthorizationType.CUSTOM,
    });

    const matchClientEndpoint = educationEndpoint.addResource("match-client")


    matchClientEndpoint.addMethod("GET", new apig.LambdaIntegration(matchClientFn, { proxy: true }), {
      authorizer: requestAuthorizer,
      authorizationType: apig.AuthorizationType.CUSTOM,
    });


      new cdk.CfnOutput(this, "DBEndpoint", {
        value: dbInstance.dbInstanceEndpointAddress,
      });
    }
  }
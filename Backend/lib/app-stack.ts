import * as cdk from "aws-cdk-lib";
import * as lambdanode from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as custom from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";
import * as rds from "aws-cdk-lib/aws-rds";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import * as apig from "aws-cdk-lib/aws-apigateway";
import * as iam from "aws-cdk-lib/aws-iam";

type AppApiProps = {
    userPoolId: string;
    userPoolClientId: string;
  };
  
  export class AppApi extends Construct {
    constructor(scope: Construct, id: string, props: AppApiProps) {
        super(scope, id);

        ////////////////////////////// RDS DATABASE //////////////////////////////////////
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

      /////////////////////////////////////////////////////////////////////////
    

      new cdk.CfnOutput(this, "DBEndpoint", {
        value: dbInstance.dbInstanceEndpointAddress,
      });
    }
  }
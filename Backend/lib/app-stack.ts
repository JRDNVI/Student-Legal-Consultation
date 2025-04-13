import * as cdk from "aws-cdk-lib";
import * as lambdanode from "aws-cdk-lib/aws-lambda-nodejs";
import * as lambda from "aws-cdk-lib/aws-lambda";
import * as dynamodb from "aws-cdk-lib/aws-dynamodb";
import * as custom from "aws-cdk-lib/custom-resources";
import { Construct } from "constructs";
import * as apig from "aws-cdk-lib/aws-apigateway";
import * as iam from "aws-cdk-lib/aws-iam";


type AppApiProps = {
    userPoolId: string;
    userPoolClientId: string;
  };
  
  export class AppApi extends Construct {
    constructor(scope: Construct, id: string, props: AppApiProps) {
        super(scope, id);
    }
  }
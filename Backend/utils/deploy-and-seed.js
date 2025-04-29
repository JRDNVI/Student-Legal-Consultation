import { execSync } from 'child_process';
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import { CloudFormationClient, DescribeStacksCommand } from "@aws-sdk/client-cloudformation";
import mysql from 'mysql2/promise';
import fs from 'fs/promises';

// This script deploys the CDK stack, fetches the database endpoint and credentials from AWS Secrets Manager,
// and then applies the SQL schema to the database and seeds the database.

const secretName = "fyp-db-credentials";
const region = "eu-west-1";
const stackName = "Auth-App-API";
const sqlFilePath = [
  "./utils/FYP_Schema_Init.sql",
  "./utils/education-seed-data.sql",
  "./utils/legal-seed-data.sql",
  // "./utils/drop-database.sql"
]

// //Deploy CDK stack
console.log("Deploying CDK stack");
execSync('cdk deploy --require-approval never', { stdio: 'inherit' });

//Get DB endpoint from CloudFormation
//https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/cloudformation/command/DescribeStacksCommand/
console.log("Fetching DB endpoint");
const Client = new CloudFormationClient({ region });
const Command = new DescribeStacksCommand({ StackName: stackName });
const Response = await Client.send(Command);
const outputs = Response.Stacks[0].Outputs;
const dbEndpoint = outputs.find(o => o.OutputKey.startsWith("AppApiDB")).OutputValue;

//Get DB credentials from Secrets Manager
//https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/client/secrets-manager/
console.log("Fetching DB credentials");
const smClient = new SecretsManagerClient({ region });
const smCommand = new GetSecretValueCommand({ SecretId: secretName });
const smResponse = await smClient.send(smCommand);
const { username, password } = JSON.parse(smResponse.SecretString);

let sql = "";

for (const file of sqlFilePath) {
  const fileContent = await fs.readFile(file, "utf-8");
  sql += "\n" + fileContent;
}


console.log("Connecting to database and executing schema");
const connection = await mysql.createConnection({
  host: dbEndpoint,
  user: username,
  password: password,
  database: 'fypdb',
  port: 3306,
  multipleStatements: true, //Allow multiple statements in one query (.sql file)
});

await connection.query(sql);
await connection.end();

console.log("Schema applied successfully!");
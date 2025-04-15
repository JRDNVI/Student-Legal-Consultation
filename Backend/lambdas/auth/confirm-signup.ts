import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  ConfirmSignUpCommand,
  ConfirmSignUpCommandInput,
  AdminGetUserCommand
} from "@aws-sdk/client-cognito-identity-provider";
import { ConfirmSignUpBody } from "../../shared/types";
import mysql from "mysql2/promise";
import {SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

const client = new CognitoIdentityProviderClient({ region: process.env.REGION });

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    console.log("[EVENT]",JSON.stringify(event));
    const body = event.body ? JSON.parse(event.body) : undefined;

    
    const confirmSignUpBody = body as ConfirmSignUpBody;

    const params: ConfirmSignUpCommandInput = {
      ClientId: process.env.CLIENT_ID!,
      Username: confirmSignUpBody.username,
      ConfirmationCode: confirmSignUpBody.code,
    };

    const command = new ConfirmSignUpCommand(params);
    await client.send(command);

    const getUserRes = await client.send(
      new AdminGetUserCommand({
        UserPoolId: process.env.USER_POOL_ID!,
        Username: confirmSignUpBody.username,
      })
    );
    
    const role = getUserRes.UserAttributes?.find(attr => attr.Name === "custom:role")?.Value;
    const cognitoId = getUserRes.UserAttributes?.find(attr => attr.Name === "sub")?.Value;
    const email = getUserRes.UserAttributes?.find(attr => attr.Name === "email")?.Value;

    console.log("Secert Name", process.env.SECRET_NAME);
    console.log("HOst", process.env.DB_HOST);

    const smClient = new SecretsManagerClient({ region: "eu-west-1" }); 
    const smCommand = new GetSecretValueCommand({ SecretId: "fyp-db-credentials" });
    const smResponse = await smClient.send(smCommand);

    if (!smResponse.SecretString) {
      return {
        statusCode: 500,
        body: JSON.stringify({ error: "Failed to retrieve DB credentials" }),
      };
    }
    const { username, password } = JSON.parse(smResponse.SecretString);

    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: username,
      password: password,
      database: "fypdb",
      port: 3306,
    });
    
    switch (role) {
      case "student":
        await connection.execute(
          `INSERT INTO students (cognito_id, email) VALUES (?, ?)`,
          [cognitoId, email]
        );
        break;
    
      case "solicitor":
        await connection.execute(
          `INSERT INTO solicitors (cognito_id, email) VALUES (?, ?)`,
          [cognitoId, email]
        );
        break;
    
      case "client":
        await connection.execute(
          `INSERT INTO clients (cognito_id, email) VALUES (?, ?)`,
          [cognitoId, email]
        );
        break;
    
      case "mentor":
        await connection.execute(
          `INSERT INTO mentors (cognito_id, email) VALUES (?, ?)`,
          [cognitoId, email]
        );
        break;
    
      default:
        return {
          statusCode: 400,
          body: JSON.stringify({ error: "Invalid user role specified." }),
        };
    }

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `User ${confirmSignUpBody.username} successfully confirmed`,
        confirmed: true,
      }),
    };
  } catch (err) {
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: err,
      }),
    };
  }
};
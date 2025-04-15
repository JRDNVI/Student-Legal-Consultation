import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import mysql from "mysql2/promise";

export const handler: APIGatewayProxyHandlerV2 = async (event: any) => {
  const claims = event.requestContext?.authorizer?.jwt?.claims;

  if (!claims) {
    return {
      statusCode: 401,
      body: JSON.stringify({ error: "Unauthorized" }),
    };
  }

  const userId = claims.sub;
  const email = claims.email;

  const secretClient = new SecretsManagerClient({ region: "eu-west-1" });

  const secretResponse = await secretClient.send(
    new GetSecretValueCommand({
      SecretId: process.env.SECRET_NAME,
    })
  );

  if (!secretResponse.SecretString) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Failed to retrieve DB credentials" }),
    };
  }

  const { username, password } = JSON.parse(secretResponse.SecretString);

  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST, 
      user: username,
      password: password,
      database: "fypdb",
      port: 3306,
    });

    const [rows] = await connection.execute(
      "SELECT * FROM students WHERE cognito_id = ?",
      [userId]
    );

    await connection.end();

    return {
      statusCode: 200,
      body: JSON.stringify({ student: rows[0] || null }),
    };
  } catch (err: any) {
    console.error(err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: "Database error", detail: err.message }),
    };
  }
};

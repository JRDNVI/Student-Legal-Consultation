import { APIGatewayProxyEventV2WithRequestContext } from "aws-lambda";
import { DynamoDBClient, PutItemCommand } from "@aws-sdk/client-dynamodb";

const ddb = new DynamoDBClient({ region: process.env.REGION });
const CONNECTION_TABLE = process.env.CONNECTION_TABLE!;

export const handler = async (event: APIGatewayProxyEventV2WithRequestContext<any>) => {
  const connectionId = event.requestContext.connectionId;

  const authorizerContext = event.requestContext.authorizer as any;
  const userId = authorizerContext?.sub;
  const role = authorizerContext?.role;
  const email = authorizerContext?.email;

  if (!connectionId || !userId) {
    return {
      statusCode: 400,
      body: "Missing connection or user ID",
    };
  }

  try {
    await ddb.send(
      new PutItemCommand({
        TableName: CONNECTION_TABLE,
        Item: {
          connectionId: { S: connectionId },
          userId: { S: userId },
          role: { S: role },
          email: { S: email },
          connectedAt: { S: new Date().toISOString() },
        },
      })
    );

    return {
      statusCode: 200,
      body: "Connected",
    };
  } catch (err) {
    console.error("Error writing to DB", err);
    return {
      statusCode: 500,
      body: "Internal server error",
    };
  }
};

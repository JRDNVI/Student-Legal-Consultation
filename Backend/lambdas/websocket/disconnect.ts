import { APIGatewayProxyEvent } from "aws-lambda";
import { DynamoDBClient, DeleteItemCommand } from "@aws-sdk/client-dynamodb";

const db = new DynamoDBClient({});
const CONNECTIONS_TABLE = process.env.CONNECTION_TABLE!;

export const handler = async (event: APIGatewayProxyEvent) => {
  const connectionId = event.requestContext.connectionId;

  if (!connectionId) {
    console.error("Missing connection ID in request context");
    return {
      statusCode: 400,
      body: "Bad Request: Missing connection ID",
    };
  }

  try {
    await db.send(
      new DeleteItemCommand({
        TableName: CONNECTIONS_TABLE,
        Key: {
          connectionId: { S: connectionId },
        },
      })
    );

    return {
      statusCode: 200,
      body: "Disconnected",
    };
  } catch (err) {
    console.error("Error disconnecting:", err);
    return {
      statusCode: 500,
      body: "Internal Server Error",
    };
  }
};

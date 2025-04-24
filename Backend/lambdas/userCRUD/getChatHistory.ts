import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DynamoDBClient, ScanCommand } from "@aws-sdk/client-dynamodb";
import { corsHeaders, returnStatus } from "../utils";

const ddb = new DynamoDBClient({ region: process.env.REGION });
const MESSAGE_TABLE = process.env.MESSAGE_TABLE!;

export const handler: APIGatewayProxyHandlerV2 = async (event: any) => {
  const userEmail = event.requestContext?.authorizer?.email;

  if (!userEmail) {
    return returnStatus( 403, "Unauthorized" );
  }

  try {
    const result = await ddb.send(
      new ScanCommand({
        TableName: MESSAGE_TABLE,
      })
    );

    const grouped: Record<string, { sender: string; recipient: string; message: string; timestamp: string }[]> = {};

    for (const item of result.Items ?? []) {
      const sender = item.senderEmail.S!;
      const recipient = item.recipientEmail.S!;
      const timestamp = item.timestamp.S!;
      const message = item.message.S!;

      const partner = sender === userEmail ? recipient : sender;

      if (!grouped[partner]) grouped[partner] = [];

      grouped[partner].push({
        sender,
        recipient,
        message,
        timestamp,
      });
    }

    for (const conv of Object.values(grouped)) {
      conv.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    }

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify(grouped),
    };
  } catch (err) {
    console.error("getFullConversationHistory error", err);
    return returnStatus(500, "Internal server error")
   
  }
};

import { APIGatewayProxyEventV2WithRequestContext } from "aws-lambda";
import { DynamoDBClient, QueryCommand, PutItemCommand } from "@aws-sdk/client-dynamodb";
import {ApiGatewayManagementApiClient,PostToConnectionCommand } from "@aws-sdk/client-apigatewaymanagementapi";


const ddb = new DynamoDBClient({ region: process.env.REGION });
const apiClient = new ApiGatewayManagementApiClient({
  region: process.env.REGION!,
  endpoint: `https://${process.env.DOMAIN_NAME}/${process.env.STAGE}`,
});

export const handler = async (event: APIGatewayProxyEventV2WithRequestContext<any>)=> {

  const body = JSON.parse(event.body || "{}");
  const { recipientEmail, senderEmail, message } = body;

  console.log("BODY:", body)

  if (!recipientEmail || !message || !senderEmail) {
    return {
      statusCode: 400,
      body: "Missing Email or messge",
    };
  }

  // Getting the connectiopn ID of the recipient
  try {
    const recipientResult = await ddb.send(
      new QueryCommand({
        TableName: process.env.CONNECTION_TABLE!,
        IndexName: "email-index",
        KeyConditionExpression: "email = :e",
        ExpressionAttributeValues: {
          ":e": { S: recipientEmail },
        },
      })
    );

    if (!recipientResult.Items || recipientResult.Items.length === 0) {
      return {
        statusCode: 404,
        body: "Recipient not connected",
      };
    }

    const recipient = recipientResult.Items[0];
    const recipientConnectionId = recipient.connectionId.S!;

    const timestamp = new Date().toISOString();

    // Thought I would need this to fetch all messages but I didn't
    const chatId = [senderEmail, recipientEmail].sort().join("--"); 

    // Add the message and other details to message table
    await ddb.send(
      new PutItemCommand({
        TableName: process.env.MESSAGE_TABLE!,
        Item: {
          chatId: { S: chatId },
          timestamp: { S: timestamp },
          senderEmail: { S: senderEmail },
          recipientEmail: { S: recipientEmail },
          message: { S: message },
        },
      })
    );

    //Send the message to the recipient
    await apiClient.send(
      new PostToConnectionCommand({
        ConnectionId: recipientConnectionId,
        Data: Buffer.from(JSON.stringify({
          sender: senderEmail,
          recipient: recipientEmail,
          message,
          timestamp
        })),
      })
    );
    

    return { statusCode: 200, body: "Message sent" };
  } catch (err) {
    console.error("sendMessage error", err);
    return { statusCode: 500, body: "Internal server error" };
  }
};

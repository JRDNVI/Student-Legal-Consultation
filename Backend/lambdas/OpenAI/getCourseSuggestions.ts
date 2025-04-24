import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import axios from "axios";
import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { corsHeaders } from "../utils";


export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  const body = JSON.parse(event.body || "{}");
  const description = body.description;

  if (!description) {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Missing student description" }),
    };
  }

  try {

    const secretName = "prod/openai";
    const client = new SecretsManagerClient({ region: process.env.REGION });
    const command = new GetSecretValueCommand({ SecretId: secretName });
    const secret = await client.send(command);
    const apiKey = JSON.parse(secret.SecretString!).OPENAI_API_KEY;
    console.log(apiKey)



    const prompt = {
      role: "system",
      content:
        "You are an academic advisor. Based on the student's self-description, return 5 suitable university-level courses in Ireland as a JSON array. Each course should have the following fields: 'title' and 'reason'. Return a JSON object and nothing else.",
    };

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          prompt,
          { role: "user", content: description }
        ],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: response.data.choices[0].message.content,
    };

  } catch (err) {
    console.error("Error:", err);
    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: "Something went wrong" }),
    };
  }
};

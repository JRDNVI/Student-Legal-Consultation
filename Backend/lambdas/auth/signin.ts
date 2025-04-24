import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { SignInBody } from "../../shared/types";
import {
  CognitoIdentityProviderClient,
  InitiateAuthCommand,
  InitiateAuthCommandInput,
} from "@aws-sdk/client-cognito-identity-provider";
import { corsHeaders } from "../utils";

const client = new CognitoIdentityProviderClient({
  region: process.env.REGION,
});

export const handler: APIGatewayProxyHandlerV2 = async (event) => {
  try {
    console.log("[EVENT]", JSON.stringify(event));
    const body = event.body ? JSON.parse(event.body) : undefined;

    const signInBody = body as SignInBody;

    const params: InitiateAuthCommandInput = {
      ClientId: process.env.CLIENT_ID!,
      AuthFlow: "USER_PASSWORD_AUTH",
      AuthParameters: {
        USERNAME: signInBody.username,
        PASSWORD: signInBody.password,
      },
    };

    const command = new InitiateAuthCommand(params);
    const { AuthenticationResult } = await client.send(command);
    console.log("Auth", AuthenticationResult);
    if (!AuthenticationResult) {
      return {
        statusCode: 400,
        headers: corsHeaders,
        body: JSON.stringify({
          message: "User signin failed",
        }),
      };
    }
    const token = AuthenticationResult.IdToken;

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        message: "Auth successfull",
        token: token,
      }),
    };
  } catch (err) {
    console.error(err);

    return {
      statusCode: 500,
      headers: corsHeaders,
      body: JSON.stringify({
        message: err,
      }),
    };
  }
};
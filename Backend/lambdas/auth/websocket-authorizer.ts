import { APIGatewayAuthorizerResult, APIGatewayRequestAuthorizerEvent } from "aws-lambda";
import { verifyWebSocketToken } from "../utils";

export const handler = async (event: APIGatewayRequestAuthorizerEvent) => {
  const token = event.queryStringParameters?.token;

  if (!token) {
    console.warn("Missing token");
    return deny("unauthorised", event.methodArn);
  }

  const verifiedJwt = await verifyWebSocketToken(
    token,
    process.env.USER_POOL_ID!,
    process.env.REGION!
  );

  if (!verifiedJwt) {
    console.warn("Invalid token");
    return deny("unauthorized", event.methodArn);
  }

  return {
    principalId: verifiedJwt.sub,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Effect: "Allow",
          Action: "execute-api:Invoke",
          Resource: [event.methodArn],
        },
      ],
    },
    context: {
      sub: verifiedJwt.sub,
      email: verifiedJwt.email,
      role: verifiedJwt["custom:role"] || "",
    },
  };
};

const deny = (principalId: string, methodArn: string): APIGatewayAuthorizerResult => ({
  principalId,
  policyDocument: {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: "Deny",
        Action: "execute-api:Invoke",
        Resource: [methodArn],
      },
    ],
  },
  context: {},
});
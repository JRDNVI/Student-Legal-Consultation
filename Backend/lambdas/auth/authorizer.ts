import { APIGatewayRequestAuthorizerHandler } from "aws-lambda";
import { createPolicy, verifyToken } from "../utils";

// This lambda is based of distributed systems - CA1 
// It has been modified to use bear tokens instead of cookies.
// This was done to make it easier to use with the frontend and to
// make it more secure.

export const handler: APIGatewayRequestAuthorizerHandler = async (event) => {
  console.log("[EVENT]", event);

  const authHeader = event.headers?.authorization || event.headers?.Authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return {
      principalId: "",
      policyDocument: createPolicy(event, "Deny"),
    };
  }

  // Extracting the actual token (removing the Bearer prefix)
  const token = authHeader.split(" ")[1];

  const verifiedJwt = await verifyToken(
    token,
    process.env.USER_POOL_ID,
    process.env.REGION!
  );

  return {
    principalId: verifiedJwt?.sub ?? "",
    policyDocument: createPolicy(event, verifiedJwt ? "Allow" : "Deny"),
    context: verifiedJwt
      ? {
        sub: verifiedJwt.sub,
        email: verifiedJwt.email,
        role: verifiedJwt["custom:role"] || "",
      }
      : {},
  };
};

import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  getDbCredentials,
  getDbConnection,
  returnStatus
} from "../utils";

export const handler: APIGatewayProxyHandlerV2 = async (event: any) => {
    try {

        

        return returnStatus(200, "Success");
    } catch {
        return returnStatus(500, "Internal Server Error");
    }
}
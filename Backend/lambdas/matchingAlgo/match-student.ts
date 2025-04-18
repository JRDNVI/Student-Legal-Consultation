import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  getTableAccessByRoleAndType,
  getDbCredentials, 
  getDbConnection, 
  returnStatus 
} from "../utils";

export const hander : APIGatewayProxyHandlerV2 = async (event: any) => {
    try {
        const body = JSON.parse(event.body || "{}");
        const userId = event.requestContext?.authorizer?.sub || event.pathParameters?.id;
        const role = event.requestContext?.authorizer?.role || event.pathParameters?.role;

        const { username, password } = await getDbCredentials();
        const connection = await getDbConnection(username, password, process.env.DB_ENDPOINT!);

        const accessMeta = getTableAccessByRoleAndType(role, "get");

        return returnStatus(200, "Success", { accessMeta });
    } catch (err : any) {
        return returnStatus(500, "Error", { detail: err.message });
    }
}
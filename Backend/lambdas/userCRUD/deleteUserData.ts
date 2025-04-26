import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  getTableAccessByRoleAndType,
  getDbCredentials,
  getDbConnection,
  returnStatus
} from "../utils";

// This Lambda is used to delete a row from an allowed table 
// based on the authenticated user's role (student, mentor, client, solicitor).
//
// - Validates the table and where clause fields against role-specific permissions
// - Deletes row(s) from the specified table if all checks pass, also cascading 
//   deletes if foreign keys are present.
// - Supports both education and legal roles via dynamic access control

export const handler: APIGatewayProxyHandlerV2 = async (event: any) => {
  try {

    const { username, password } = await getDbCredentials();
    const connection = await getDbConnection(username, password, process.env.DB_ENDPOINT!);
    const body = JSON.parse(event.body || "{}");
    console.log("Body", body);
    console.log("[EVENT]", JSON.stringify(event));

    const deletes = body.multiDelete && Array.isArray(body.payload) ? body.payload : [body];
    const role = event.requestContext?.authorizer?.role;
    const allowedTables = getTableAccessByRoleAndType(role, "delete");

    if (!allowedTables) {
      return returnStatus(403, "Invalid or unauthorized role");
    }

    for (const deleteItem of deletes) {
      const { tableName, where } = deleteItem;

      if (!tableName || !where || typeof where !== "object") {
        console.log("[ERROR] Invalid delete item format", deleteItem);
        return returnStatus(400, "Missing or invalid tableName or where clause");
      }

      const allowedCols = allowedTables[tableName];
      if (!allowedCols) return returnStatus(400, "Table not allowed");

      const whereKeys = Object.keys(where);
      if (!whereKeys.every((key) => allowedCols.includes(key))) {
        return returnStatus(400, "One or more invalid fields for this table");
      }

      const whereClause = whereKeys.map((key) => `${key} = ?`).join(" AND ");
      const whereValues = whereKeys.map((key) => where[key]);
      const sql = `DELETE FROM ${tableName} WHERE ${whereClause}`;


      await connection.execute(sql, whereValues);
    }
    await connection.end();

    return returnStatus(200, `Delete completed.`);
  } catch (err: any) {
    return returnStatus(500, "Database error", { detail: err.message });
  }
};

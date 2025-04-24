import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { 
  getTableAccessByRoleAndType, 
  getDbCredentials, 
  getDbConnection, 
  returnStatus 
} from "../utils";

// This Lambda is used to update rows in a list of allowed tables
// based on the user's role and permissions.

export const handler: APIGatewayProxyHandlerV2 = async (event: any) => {
  try {
    const body = JSON.parse(event.body || "{}");

    // Updated to take multiple updates 
    // Don't think this works (Problem mightn't be here(probably not))
    const updates = body.multiInsert && Array.isArray(body.payload) ? body.payload : [body];

    const role = event.requestContext?.authorizer?.role;
    const allowedTables = getTableAccessByRoleAndType(role, "add");

    if (!allowedTables) {
      return returnStatus(403, "Invalid or unauthorized role");
    }

    const { username, password } = await getDbCredentials();
    const connection = await getDbConnection(username, password, process.env.DB_ENDPOINT!);

    for (const update of updates) {
      const { tableName, data, where } = update;

      if (!tableName || !where || typeof where !== "object") {
        return returnStatus(400, "Missing or invalid tableName or where clause");
      }

      const allowedCols = allowedTables[tableName];
      if (!allowedCols) return returnStatus(400, `Table not allowed: ${tableName}`);

      const updateKeys = Object.keys(data);
      if (!updateKeys.every((key) => allowedCols.includes(key))) {
        return returnStatus(400, `One or more invalid fields for table ${tableName}`);
      }

      const setClause = updateKeys.map((key) => `${key} = ?`).join(", ");
      const setValues = updateKeys.map((key) => data[key]);

      const whereKeys = Object.keys(where);
      const whereClause = whereKeys.map((key) => `${key} = ?`).join(" AND ");
      const whereValues = whereKeys.map((key) => where[key]);

      const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;
      await connection.execute(sql, [...setValues, ...whereValues]);
    }

    await connection.end();
    return returnStatus(200, `Updates completed.`);
  } catch (err: any) {
    console.error(err);
    return returnStatus(500, "Database error", { detail: err.message });
  }
};

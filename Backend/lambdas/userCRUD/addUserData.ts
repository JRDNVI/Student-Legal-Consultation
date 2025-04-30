import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  getDbConnection,
  getDbCredentials,
  returnStatus,
  getTableAccessByRoleAndType
} from "../utils";

// This Lambda handles inserting data into multiple allowed tables based on user role.
// It supports both single-table and multi-table inserts using the `multiInsert` flag.

export const handler: APIGatewayProxyHandlerV2 = async (event: any) => {
  try {
    const body = JSON.parse(event.body || "{}");
    console.log("[EVENT]", event);
    const role = event.requestContext?.authorizer?.role;
    const allowedTables = getTableAccessByRoleAndType(role, "add");

    if (!allowedTables) {
      return returnStatus(403, "Invalid or unauthorized role");
    }

    const { multiInsert, payload, tableName, data } = body;

    const entries = multiInsert ? payload : [{ tableName, data }];

    if (!entries || !Array.isArray(entries) || entries.length === 0) {
      return returnStatus(400, "Missing or invalid data");
    }

    const { username, password } = await getDbCredentials();
    const connection = await getDbConnection(username, password, process.env.DB_ENDPOINT!);

    for (const entry of entries) {
      const { tableName, data } = entry;

      if (!tableName || !data || typeof data !== "object") {
        return returnStatus(400, `Invalid entry format for ${tableName}`);
      }

      const allowedCols = allowedTables[tableName];
      if (!allowedCols) return returnStatus(400, `Table '${tableName}' not allowed for this role`);

      const keys = Object.keys(data);
      if (!keys.every((key) => allowedCols.includes(key))) {
        return returnStatus(400, `Invalid fields in table '${tableName}'`);
      }

      const cols = keys.join(", ");
      const placeholders = keys.map(() => "?").join(", ");
      const values = keys.map((k) => data[k]);
      const sql = `INSERT INTO ${tableName} (${cols}) VALUES (${placeholders})`;

      console.log("[SQL]", sql, values);


      const test = await connection.execute(sql, values);
      console.log("[RESULT]", test);
    }

    await connection.end();
    return returnStatus(200, multiInsert ? "Batch insert successful" : `Added to ${tableName}`, {
      inserted: multiInsert ? entries.map((e) => e.tableName) : [tableName]
    });
  } catch (err: any) {
    return returnStatus(500, "Database error", { detail: err.message });
  }
};

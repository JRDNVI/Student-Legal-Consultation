import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { 
  getDbConnection, 
  getDbCredentials, 
  returnStatus, 
  getTableAccessByRoleAndType 
} from "../utils"; 


//  This lamdba is used to insert a new row into an list of allowed tables.
//  This is based on the authenticated user's role (student, mentor, client, solicitor).
//  which is passed in the event. The authorizer is accessed get the role of the user. 
//  Below is a summary of the functionality:
//
//  - Validates the table and fields against role-specific permissions.
//  - Inserts data into the specified table if all checks pass.
//  - Supports both education and legal roles for inserts.
 
export const handler: APIGatewayProxyHandlerV2 = async (event: any) => {

  try {
    const body = JSON.parse(event.body || "{}");
    console.log("[EVENT]", event);
    const { tableName, data } = body;

    if (!tableName || !data || typeof data !== "object") {
      return returnStatus(400, "Missing or invalid data/tableName");
    }

    const role = event.requestContext?.authorizer?.role;
    const allowedTables = getTableAccessByRoleAndType(role, "add");
    
    if (!allowedTables) {
        return returnStatus(403, "Invalid or unauthorized role");
    }

    const allowedCols = allowedTables[tableName];
    if (!allowedCols) return returnStatus(400, "Table not allowed");
       
    const keys = Object.keys(data);
    if (!keys.every((key) => allowedCols.includes(key))) {
      return returnStatus(400, "One or more invalid fields for this table");
    }

    const cols = keys.join(", ");
    const placeholders = keys.map(() => "?").join(", ");
    const values = keys.map((k) => data[k]);
    const sql = `INSERT INTO ${tableName} (${cols}) VALUES (${placeholders})`;

    const { username, password } = await getDbCredentials();
    const connection = await getDbConnection(username, password, process.env.DB_ENDPOINT!);
    await connection.execute(sql, values);
    await connection.end();

    return returnStatus(200, `Added to ${tableName}`, { data });
  } catch (err: any) {
    return returnStatus(500, "Database error", { detail: err.message });
  }
};

import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { getTableAccessByRoleAndType, getDbCredentials, getDbConnection, returnStatus } from "../utils";

// This Lambda is used to update a row in an list of allowed tables
// again, based on the user's role.
//
// - Validates the table and update fields against role permissions.
// - Creates and excutes a dynamic and parameterised UPDATE query.


export const handler: APIGatewayProxyHandlerV2 = async (event: any) => {
  try {
    const body = JSON.parse(event.body || "{}");
    const { tableName, data, where } = body;

    if (!tableName || !where || typeof where !== "object") {
      return returnStatus(400, "Missing or invalid tableName or where clause");
    }

    const role = event.requestContext?.authorizer?.role;
    const allowedTables = getTableAccessByRoleAndType(role, "add");
        
    if (!allowedTables) {
        return returnStatus(403, "Invalid or unauthorized role");
    }

    const allowedCols = allowedTables[tableName];

    if (!allowedCols) return returnStatus(400, "Table not allowed");
    
    const updateKeys = Object.keys(data);
    if (!updateKeys.every((key) => allowedCols.includes(key))) {
      return returnStatus(400, "One or more invalid fields for this table");
    }

    const setClause = updateKeys.map((key) => `${key} = ?`).join(", ");
    const setValues = updateKeys.map((key) => data[key]);


    const whereKeys = Object.keys(where);
    const whereClause = whereKeys.map((key) => `${key} = ?`).join(" AND ");
    const whereValues = whereKeys.map((key) => where[key]);
    const sql = `UPDATE ${tableName} SET ${setClause} WHERE ${whereClause}`;


    const { username, password } = await getDbCredentials();
    const connection = await getDbConnection(username, password, process.env.DB_ENDPOINT!);
    const [result] = await connection.execute(sql, [...setValues, ...whereValues]);
    await connection.end();


    return returnStatus(200, `Updated ${tableName}`, { result });
  } catch (err: any) {
    console.error(err);
    return returnStatus(500, "Database error", { detail: err.message });
  }
};

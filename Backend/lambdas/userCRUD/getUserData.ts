import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  getDbCredentials,
  getDbConnection,
  getTableAccessByRoleAndType,
  extendedRoleTableJoins,
  returnStatus,
  corsHeaders
} from "../utils";

// Lambda handler to retrieve user-specific data from allowed tables 
// based on the authenticated user's role (student, mentor, client, solicitor).
//
// - Identifies the user's ID via their Cognito ID which is saved in the DB
// - gets the list of allowed tables and filtering column using the user's role
// - Queries each table for rows matching the user's ID (e.g. student_id, solicitor_id)
// - Returns both the users data and all related data (Currenrtly if the ID of the user isn't present 
//   in the table it won't return the data) Needs to be fixed.


export const handler: APIGatewayProxyHandlerV2 = async (event: any) => {
  try {
    const { username, password } = await getDbCredentials();
    const connection = await getDbConnection(username, password, process.env.DB_ENDPOINT!);

    // || is used for testing using postman
    const userId = event.requestContext?.authorizer?.sub || event.pathParameters?.id;
    const role = event.requestContext?.authorizer?.role || event.pathParameters?.role;

    const accessMeta = getTableAccessByRoleAndType(role, "get");

    if (!accessMeta) {
      return returnStatus(403, "Unauthorized or unsupported role");
    }

    const { tables, column: idColumn } = accessMeta;
    console.log(accessMeta)

    const table = tables[0]
    console.log(table)

    if (!table) {
      return returnStatus(400, "Unable to resolve base user table");
    }

    console.log(table)

    const [rows] = await connection.execute(
      `SELECT ${idColumn} FROM ${table} WHERE cognito_id = ?`,
      [userId]
    );

    console.log(rows[0])

    const identifier = rows[0]?.[idColumn];
    if (!identifier) {
      return returnStatus(404, "User not found");
    }

    const results: Record<string, any> = {};

    // Loop through all tables and get the data for using the user's ID
    // Modified to show availabile meetings set by a students mentor and if 
    // they have accepted the meeting
    for (const tableName of tables) {
      let query, params;
      if (role === "student" && tableName === "meetings") {
          query = `SELECT * FROM ${tableName} WHERE (student_id IS NULL AND status = 'available') OR student_id = ?`;
          params = [identifier];
      } else {
        query = `SELECT * FROM ${tableName} WHERE ${idColumn} = ?`;
        params = [identifier];
      }
    
      const [data] = await connection.execute(query, params);
      results[tableName] = data;
    }

    // This for loop is used to retrieve extra data from that tables that do 
    // not conatin the users ID. In utils, extendedRoleTableJoins lists the tables
    // that are joined to the base table and the join conditions. 
    const extraJoins = extendedRoleTableJoins[role] || [];
    for (const { table, join, baseTable, param } of extraJoins) {
    const sql = `SELECT ${table}.* FROM ${table} ${join} WHERE ${baseTable}.${param} = ?`
    const [joinedData] = await connection.execute<any[]>(sql, [identifier]);
    results[table] = [...(results[table] || []), ...joinedData];
}

    await connection.end();

    return {
      statusCode: 200,
      headers: corsHeaders,
      body: JSON.stringify({
        user: rows[0] || null,
        relatedData: results
      }),
    };
  } catch (err: any) {
    console.error(err);
    return returnStatus(500, "Database error", { detail: err.message });
  }
};

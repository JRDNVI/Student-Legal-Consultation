import {
    APIGatewayRequestAuthorizerEvent,
    APIGatewayAuthorizerEvent,
    PolicyDocument,
    APIGatewayProxyEvent,
    StatementEffect,
  } from "aws-lambda";

import axios from "axios"
import jwt from 'jsonwebtoken'
import jwkToPem from "jwk-to-pem";
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";
import mysql from "mysql2/promise";



export type CookieMap = { [key: string]: string } | undefined;
export type JwtToken = { sub: string; email: string } | null;
export type Jwk = {
  keys: {
    alg: string;
    e: string;
    kid: string;
    kty: string;
    n: string;
    use: string;
  }[];
};

export const parseCookies = (
  event: APIGatewayRequestAuthorizerEvent | APIGatewayProxyEvent
) => {
  if (!event.headers || !event.headers.Cookie) {
    return undefined;
  }

  const cookiesStr = event.headers.Cookie;
  const cookiesArr = cookiesStr.split(";");

  const cookieMap: CookieMap = {};

  for (let cookie of cookiesArr) {
    const cookieSplit = cookie.trim().split("=");
    cookieMap[cookieSplit[0]] = cookieSplit[1];
  }
  return cookieMap;
};

export const verifyToken = async (
  token: string,
  userPoolId: string | undefined,
  region: string
): Promise<JwtToken> => {
  try {
    const url = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
    const { data }: { data: Jwk } = await axios.get(url);
    const pem = jwkToPem(data.keys[0] as jwkToPem.RSA);

    return jwt.verify(token, pem, { algorithms: ["RS256"] }) as JwtToken;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const createPolicy = (
  event: APIGatewayAuthorizerEvent,
  effect: StatementEffect
): PolicyDocument => {
  return {
    Version: "2012-10-17",
    Statement: [
      {
        Effect: effect,
        Action: "execute-api:Invoke",
        Resource: [event.methodArn],
      },
    ],
  };
};


// Education data tables and their allowed columns for add and delete operations
export const allowedTablesAdd: Record<string, string[]> = {
    students: ["cognito_id", "name", "email", "profile_info"],
    mentors: ["cognito_id", "name", "email", "profile_info"],
    meetings: ["student_id", "mentor_id", "timeslot", "status"],
    tasks_student: ["student_id", "mentor_id", "title", "deadline", "completed"],
    assignments: ["title", "description", "status", "grade", "due_date", "mentor_id", "student_id"],
    student_documents: ["assignment_id", "filename", "url", "uploaded_at"],
    appointments: ["subject", "date", "status", "student_id"],
    student_calendar: ["name", "student_id"],
    student_event: ["title", "description", "type", "creation_date", "due_date", "calendar_id"]
  };

  export const allowedTablesDelete: Record<string, string[]> = {
    students: ["student_id"],
    mentors: ["mentor_id"],
    meetings: ["meeting_id"],
    tasks_student: ["task_id"],
    assignments: ["assignment_id"],
    student_documents: ["document_id"],
    appointments: ["appointment_id"],
    student_calendar: ["calendar_id"],
    student_event: ["event_id"],
  };

  export const getEducationDataTable: Record<string, { tables: string[]; column: string }> = {
    student: {
      tables: [
        "students",
        "meetings",
        "tasks_student",
        "assignments",
        "appointments",
        "student_calendar",
      ],
      column: "student_id",
    },
    mentor: {
      tables: [
        "meetings",
        "tasks_student",
        "assignments"
      ],
      column: "mentor_id",
    }
  };

  // Legal data tables and their allowed columns for add and delete operations
  export const allowedLegalTablesAdd: Record<string, string[]> = {
    solicitors: ["cognito_id", "name", "email", "password", "specialty", "availability", "experience_years"],
    clients: ["cognito_id", "name", "email", "password", "legal_needs", "budget"],
    cases: ["client_id", "solicitor_id", "status", "created_at", "total_billing"],
    tasks: ["case_id", "title", "due_date", "completed"],
    documents: ["case_id", "filename", "url", "uploaded_at"],
    messages: ["case_id", "sender_id", "recipient_id", "timestamp", "content"],
    calendar: ["name", "solicitor_id"],
    event: ["title", "description", "type", "creation_date", "due_date", "calendar_id"],
    solicitor_cases: ["solicitor_id", "case_id"],
    billing: ["case_id", "amount_due", "amount_paid", "billing_status", "billing_date"],
    notes: ["case_id", "note_name", "note_type", "creation_date", "content"]
  };

  export const allowedLegalTablesDelete: Record<string, string[]> = {
    solicitors: ["solicitor_id"],
    clients: ["client_id"],
    cases: ["case_id"],
    tasks: ["task_id"],
    documents: ["document_id"],
    messages: ["message_id"],
    calendar: ["calendar_id"],
    event: ["event_id"],
    billing: ["billing_id"],
    notes: ["note_id"]
  };

  export const getLegalDataTable: Record<string, { tables: string[]; column: string }> = {
    solicitor: {
      tables: [
        "solicitors",
        "cases",
        "calendar",
      ],
      column: "solicitor_id",
    },
    client: {
      tables: [
        "clients",
        "cases",
      ],
      column: "client_id",
    }
  };

  // Helper functions for lambdas
  type OperationType = "get" | "add" | "delete";

  export const getTableAccessByRoleAndType = (
    role: string,
    operation: OperationType
  ): Record<string, any> | null => {
    const isEducation = role === "student" || role === "mentor";
    const isLegal = role === "client" || role === "solicitor";
  
    if (operation === "get") {
      if (isEducation) return getEducationDataTable[role];
      if (isLegal) return getLegalDataTable[role];
    }
  
    if (operation === "add") {
      if (isEducation) return allowedTablesAdd;
      if (isLegal) return allowedLegalTablesAdd;
    }
  
    if (operation === "delete") {
      if (isEducation) return allowedTablesDelete;
      if (isLegal) return allowedLegalTablesDelete;
    }
  
    return null;
  };

  export const getDbConnection = async (username, password, endpoint) => {
    return mysql.createConnection({
      host: endpoint,
      user: username,
      password,
      database: "fypdb",
      port: 3306,
    });
  };
  
  export const getDbCredentials = async () => {
    const smClient = new SecretsManagerClient({ region: "eu-west-1" });
    const smCommand = new GetSecretValueCommand({ SecretId: "fyp-db-credentials" });
  
    const secret = await smClient.send(smCommand);
  
    if (!secret.SecretString) {
      throw new Error("Failed to retrieve DB credentials");
    }
  
    const { username, password } = JSON.parse(secret.SecretString);
    return { username, password };
  };

  export const corsHeaders = {
    "Access-Control-Allow-Origin": "http://localhost:3000", //This will change
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "OPTIONS,POST",
  };

  export const returnStatus = (
    statusCode: number,
    message: string,
    extraData?: Record<string, any>
  ) => {
    return {
      statusCode,
      headers: corsHeaders,
      body: JSON.stringify({
        message,
        ...(extraData || {}),
      }),
    };
  };
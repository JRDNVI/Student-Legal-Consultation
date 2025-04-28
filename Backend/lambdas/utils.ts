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



type JwtTokens = {
  sub: string;
  email?: string;
  [key: string]: any;
};

let cachedJwks: Record<string, string> = {};

export const verifyWebSocketToken = async (
  token: string,
  userPoolId: string,
  region: string
): Promise<JwtTokens | null> => {
  try {
    const decoded = jwt.decode(token, { complete: true }) as jwt.Jwt | null;
    if (!decoded || typeof decoded === "string" || !decoded.header.kid) {
      throw new Error("Invalid JWT format");
    }

    const kid = decoded.header.kid;

    // If we haven't cached this kid yet, fetch all JWKs
    if (!cachedJwks[kid]) {
      const jwksUrl = `https://cognito-idp.${region}.amazonaws.com/${userPoolId}/.well-known/jwks.json`;
      const { data } = await axios.get(jwksUrl);

      for (const key of data.keys) {
        const pem = jwkToPem(key);
        cachedJwks[key.kid] = pem;
      }
    }

    const pem = cachedJwks[kid];
    if (!pem) {
      throw new Error("Unable to find matching key for JWT");
    }

    // Verify token with proper key and issuer
    const verified = jwt.verify(token, pem, {
      algorithms: ["RS256"],
      issuer: `https://cognito-idp.${region}.amazonaws.com/${userPoolId}`,
    });

    return verified as JwtTokens;
  } catch (err) {
    console.error("JWT verification failed:", err);
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
  students: ["cognito_id", "name", "email", "profile_info", "onboarded", "mentor_id"],
  student_preferences: ["preference_id", "student_id", "area_of_study", "communication_style", "language", "mentor_rating"],
  student_interests: ["student_id", "interest"],
  student_availability: ["student_id", "day", "time_slot"],
  student_suggested_course: ["student_id", "title", "reason"],
  tasks_student: ["task_id", "student_id", "mentor_id", "filename", "s3_key", "uploaded_at", "title", "deadline", "completed"],
  assignments: ["title", "description", "status", "grade", "due_date", "mentor_id", "student_id"],
  student_documents: ["document_id", "assignment_id", "filename", "s3_key", "uploaded_at"],

  mentors: ["cognito_id", "name", "email", "availability", "skills", "onboarded"],
  mentor_skills: ["mentor_id", "skill"],
  mentor_expertise: ["mentor_id", "area_of_expertise", "topic_area"],
  mentor_communication_styles: ["mentor_id", "style"],
  mentor_languages: ["mentor_id", "language"],
  mentor_availability: ["mentor_id", "day", "time_slot"],
  meetings: ["student_id", "mentor_id", "timeslot", "status"],
  appointments: ["subject", "date", "status", "student_id"],

};


export const allowedTablesDelete: Record<string, string[]> = {
  mentors: ["mentor_id", "cognito_id", "name", "email", "availability", "skills", "onboarded"],
  mentor_skills: ["id", "mentor_id", "skill"],
  mentor_expertise: ["id", "mentor_id", "topic_area", "area_of_expertise"],
  mentor_communication_styles: ["id", "mentor_id", "style"],
  mentor_languages: ["id", "mentor_id", "language"],
  mentor_availability: ["id", "mentor_id", "day", "time_slot"],

  students: ["student_id", "cognito_id", "name", "email", "profile_info", "mentor_id", "onboarded"],
  student_preferences: ["preference_id", "student_id", "area_of_study", "communication_style", "language", "mentor_rating"],
  student_interests: ["interest_id", "student_id", "interest"],
  student_availability: ["availability_id", "student_id", "day", "time_slot"],
  meetings: ["meeting_id", "student_id", "mentor_id", "status", "timeslot"],
  tasks_student: ["task_id", "student_id", "mentor_id", "filename", "s3_key", "uploaded_at", "title", "deadline", "completed"],
  assignments: ["assignment_id", "student_id", "mentor_id", "title", "deadline", "status"],
  student_documents: ["document_id", "assignment_id", "filename", "s3_url", "uploaded_at"],
  appointments: ["appointment_id", "student_id", "mentor_id", "scheduled_time", "status"],

};

export const getEducationDataTable: Record<string, { tables: string[]; column: string }> = {
  student: {
    tables: [
      "students",
      "student_preferences",
      "student_interests",
      "student_availability",
      "meetings",
      "tasks_student",
      "assignments",
      "appointments",
      "student_suggested_course",
    ],
    column: "student_id",
  },
  mentor: {
    tables: [
      "mentors",
      "students",
      "mentor_skills",
      "mentor_expertise",
      "mentor_communication_styles",
      "mentor_languages",
      "mentor_availability",
      "meetings",
      "tasks_student",
      "assignments"
    ],
    column: "mentor_id",
  }
};


// Legal data tables and their allowed columns for add and update operations
export const allowedLegalTablesAdd: Record<string, string[]> = {
  solicitors: ["cognito_id", "name", "email", "hourly_rate", "experience_years", "onboarded"],
  solicitor_languages: ["solicitor_id", "language"],
  solicitor_communication_styles: ["solicitor_id", "style"],
  solicitor_specialisations: ["solicitor_id", "specialization"],
  solicitor_availability: ["solicitor_id", "day_of_week", "time_slot"],

  clients: ["cognito_id", "name", "language", "communcation_style", "budget", "onboarded"],
  client_legal_needs: ["client_id", "legal_topic"],

  cases: ["client_id", "solicitor_id", "status", "created_at", "total_billing"],
  tasks: ["case_id", "title", "due_date", "completed", "recipient"],
  case_documents: ["case_id", "filename", "s3_url", "uploaded_at"],
  event: ["title", "description", "type", "creation_date", "due_date", "calendar_id"],
  solicitor_cases: ["solicitor_id", "case_id"],
  billing: ["case_id", "amount_due", "amount_paid", "billing_status", "billing_date"],
  notes: ["case_id", "note_name", "note_type", "creation_date", "content"],
};

export const allowedLegalTablesDelete: Record<string, string[]> = {
  solicitors: ["solicitor_id"],
  solicitor_languages: ["id"],
  solicitor_communication_styles: ["id"],
  solicitor_specialisations: ["id"],
  solicitor_availability: ["id"],

  clients: ["client_id"],
  client_legal_needs: ["id"],

  cases: ["case_id"],
  tasks: ["task_id"],
  case_documents: ["document_id"],
  messages: ["message_id"],
  calendar: ["calendar_id"],
  event: ["event_id"],
  billing: ["billing_id"],
  notes: ["note_id"]
}

export const getLegalDataTable: Record<string, { tables: string[]; column: string }> = {
  solicitor: {
    tables: [
      "solicitors",
      "cases",
      "solicitor_languages",
      "solicitor_communication_styles",
      "solicitor_specialisations",
      "solicitor_availability",
      "clients",

    ],
    column: "solicitor_id",
  },
  client: {
    tables: [
      "clients",
      "cases",
      "client_legal_needs",

    ],
    column: "client_id",
  }
};


// Created a mapping for different roles to their tables that contains data related to them, but doesn't contain the user ID.
export const extendedRoleTableJoins: Record<string, { table: string; join: string; param: string; baseTable: string }[]> = {
  student: [
    {
      table: "mentors",
      join: "JOIN students ON mentors.mentor_id = students.mentor_id",
      param: "student_id",
      baseTable: "students"
    },
    {
      table: "student_documents",
      join: "JOIN assignments ON student_documents.assignment_id = assignments.assignment_id",
      param: "student_id",
      baseTable: "assignments"
    },
    {
      table: "mentor_skills",
      join: "JOIN mentors ON mentor_skills.mentor_id = mentors.mentor_id JOIN students ON mentors.mentor_id = students.mentor_id",
      param: "student_id",
      baseTable: "students",
    },
    {
      table: "mentor_expertise",
      join: "JOIN mentors ON mentor_expertise.mentor_id = mentors.mentor_id JOIN students ON mentors.mentor_id = students.mentor_id",
      param: "student_id",
      baseTable: "students",
    },
    {
      table: "mentor_languages",
      join: "JOIN mentors ON mentor_languages.mentor_id = mentors.mentor_id JOIN students ON mentors.mentor_id = students.mentor_id",
      param: "student_id",
      baseTable: "students",
    },
    {
      table: "mentor_communication_styles",
      join: "JOIN mentors ON mentor_communication_styles.mentor_id = mentors.mentor_id JOIN students ON mentors.mentor_id = students.mentor_id",
      param: "student_id",
      baseTable: "students",
    }
  ],

  client: [
    {
      table: "solicitors",
      join: "JOIN clients ON solicitors.solicitor_id = clients.solicitor_id",
      param: "client_id",
      baseTable: "clients"
    },
    {
      table: "billing",
      join: "JOIN cases ON billing.case_id = cases.case_id",
      param: "client_id",
      baseTable: "cases"
    },
    {
      table: "tasks",
      join: "JOIN cases ON tasks.case_id = cases.case_id",
      param: "client_id",
      baseTable: "cases"
    },
    {
      table: "case_documents",
      join: "JOIN cases ON case_documents.case_id = cases.case_id",
      param: "client_id",
      baseTable: "cases"
    },
    {
      table: "notes",
      join: "JOIN cases ON notes.case_id = cases.case_id",
      param: "client_id",
      baseTable: "cases"
    },
  ],

  solicitor: [
    {
      table: "tasks",
      join: "JOIN cases ON tasks.case_id = cases.case_id",
      param: "solicitor_id",
      baseTable: "cases"
    },
    {
      table: "case_documents",
      join: "JOIN cases ON case_documents.case_id = cases.case_id",
      param: "client_id",
      baseTable: "cases"
    },
    {
      table: "notes",
      join: "JOIN cases ON notes.case_id = cases.case_id",
      param: "solicitor_id",
      baseTable: "cases"
    },
    {
      table: "billing",
      join: "JOIN cases ON billing.case_id = cases.case_id",
      param: "solicitor_id",
      baseTable: "cases"
    }
  ]
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
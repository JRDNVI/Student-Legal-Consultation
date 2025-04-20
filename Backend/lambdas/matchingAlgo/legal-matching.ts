import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  getDbCredentials,
  getDbConnection,
  returnStatus
} from "../utils";

// Matching Algo for clients functions the same as students matching but with different weights and calculations
// Currently this implementation is basic it will change 
// I had to add ? : []; at the end of every .map becuase I was getting an 500 internal error that I couldn't solve.
// 

export const handler: APIGatewayProxyHandlerV2 = async (event: any) => {
  try {
    const { username, password } = await getDbCredentials();
    const connection = await getDbConnection(username, password, process.env.DB_ENDPOINT!);

    const userId = event.requestContext?.authorizer?.sub || event.pathParameters?.id;
    const role = event.requestContext?.authorizer?.role || event.pathParameters?.role;

    if (role !== "client") return returnStatus(403, "Only clients can request matching");

    const [clientRow]: any[] = await connection.execute(
      `SELECT client_id FROM clients WHERE cognito_id = ?`,
      [userId]
    );

    console.log("USERID:", userId)

    const client_id = clientRow?.[0]?.client_id;
    if (!client_id) return returnStatus(404, "Client not found");

    const clientData: any = {};
    const tablesToQuery = ["clients", "client_legal_needs"];
    for (const table of tablesToQuery) {
      const [rows] = await connection.execute(`SELECT * FROM ${table} WHERE client_id = ?`, [client_id]);
      clientData[table] = rows;
    }

    const solicitorTables = [
      "solicitors",
      "solicitor_specialisations",
      "solicitor_languages",
      "solicitor_communication_styles",
      "solicitor_availability"
    ];

    const solicitorsMap: Record<number, any> = {};
    for (const table of solicitorTables) {
      const [rows]: any[] = await connection.execute(`SELECT * FROM ${table}`);
      for (const row of rows) {
        const solicitorId = row.solicitor_id;
        if (!solicitorsMap[solicitorId]) solicitorsMap[solicitorId] = {};
        if (!solicitorsMap[solicitorId][table]) solicitorsMap[solicitorId][table] = [];
        solicitorsMap[solicitorId][table].push(row);
      }
    }

    const WEIGHTS = {
      specialization: 4,
      language: 2,
      communication_style: 2,
      budget_fit: 3,
      availability: 1,
      experience: 2
    };

    const matches: {
      solicitor_id: string;
      profile: any;
      score: number;
      explanation: Record<string, any>;
    }[] = [];

    const clientNeeds = Array.isArray(clientData.client_legal_needs)
      ? clientData.client_legal_needs.map((n: any) => n.legal_topic)
      : [];

    const clientLang = clientData.clients?.[0]?.language || "";
    const clientStyle = clientData.clients?.[0]?.communcation_style || "";
    const clientBudget = parseFloat(clientData.clients?.[0]?.budget || "0");

    for (const [solicitorId, solicitorData] of Object.entries(solicitorsMap)) {
      let score = 0;
      const explanation: Record<string, any> = {};

      const specialisations = Array.isArray(solicitorData.solicitor_specialisations)
        ? solicitorData.solicitor_specialisations
        : [];

      const specMatched = specialisations.some((s: any) => clientNeeds.includes(s.specialization));
      if (specMatched) {
        score += WEIGHTS.specialization;
      }

      explanation.specialization = {
        matched: specMatched,
        clientNeeds,
        solicitorSpecialisations: specialisations.map((s: any) => s.specialization)
      };

      const langs = Array.isArray(solicitorData.solicitor_languages)
        ? solicitorData.solicitor_languages.map((l: any) => l.language)
        : [];

      const langMatch = langs.includes(clientLang);
      if (langMatch) score += WEIGHTS.language;
      explanation.language = { matched: langMatch, clientLang, solicitorLanguages: langs };

      const styles = Array.isArray(solicitorData.solicitor_communication_styles)
        ? solicitorData.solicitor_communication_styles.map((s: any) => s.style)
        : [];

      const styleMatch = styles.includes(clientStyle);
      if (styleMatch) score += WEIGHTS.communication_style;
      explanation.communication_style = { matched: styleMatch, clientStyle, solicitorStyles: styles };

      const hourlyRate = parseFloat(solicitorData.solicitors?.[0]?.hourly_rate || "0");
      const budgetFit = hourlyRate <= clientBudget;
      if (budgetFit) score += WEIGHTS.budget_fit;
      explanation.budget_fit = { matched: budgetFit, clientBudget, solicitorRate: hourlyRate };

      const availability = Array.isArray(solicitorData.solicitor_availability)
        ? solicitorData.solicitor_availability
        : [];

      const available = availability.length > 0;
      if (available) score += WEIGHTS.availability;
      explanation.availability = { hasAvailability: available, slots: availability };

      const years = solicitorData.solicitors?.[0]?.experience_years || 0;
      const expScore = Math.min(years, 10) * (WEIGHTS.experience / 10);
      score += expScore;
      explanation.experience = { years, score: expScore };

      matches.push({
        solicitor_id: solicitorId,
        profile: solicitorData.solicitors?.[0],
        score,
        explanation
      });
    }

    matches.sort((a, b) => b.score - a.score);
    await connection.end();

    return returnStatus(200, "Matching complete", { client_id, matches });

  } catch (err: any) {
    console.error(" Matching Error:", err);
    return returnStatus(500, "Error", { detail: err.message });
  }
};

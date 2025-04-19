import { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  getDbCredentials,
  getDbConnection,
  returnStatus
} from "../utils";

export const handler: APIGatewayProxyHandlerV2 = async (event: any) => {
  const educationMatchingTables: Record<string, { tables: string[]; column: string }> = {
    student: {
      tables: ["students", "student_preferences", "student_interests", "student_availability"],
      column: "student_id"
    },
    mentor: {
      tables: [
        "mentors",
        "mentor_skills",
        "mentor_expertise",
        "mentor_communication_styles",
        "mentor_languages",
        "mentor_availability"
      ],
      column: "mentor_id"
    }
  };

  try {
    const { username, password } = await getDbCredentials();
    const connection = await getDbConnection(username, password, process.env.DB_ENDPOINT!);

    // Here for testing will be removed later 
    const userId = event.requestContext?.authorizer?.sub || event.pathParameters?.id;
    const role = event.requestContext?.authorizer?.role || event.pathParameters?.role;

    if (role !== "student") return returnStatus(403, "Only students can request matching");

    const [studentRow] = await connection.execute(
      `SELECT student_id FROM students WHERE cognito_id = ?`,
      [userId]
    );
    const student_id = studentRow[0]?.student_id;
    if (!student_id) return returnStatus(404, "Student not found");


    // Get the students data that will be used for matching
    const studentData: any = {};
    for (const table of educationMatchingTables.student.tables) {
      const [rows] = await connection.execute(`SELECT * FROM ${table} WHERE student_id = ?`, [student_id]);
      studentData[table] = rows;
    }

    // Get all mentors data for the same reason as above.
    const mentorsMap: Record<number, any> = {};
    for (const table of educationMatchingTables.mentor.tables) {
      const [rows]: any[] = await connection.execute(`SELECT * FROM ${table}`);
      for (const row of rows as any[]) {
        const mentorId = row.mentor_id;
        if (!mentorsMap[mentorId]) mentorsMap[mentorId] = {};
        if (!mentorsMap[mentorId][table]) mentorsMap[mentorId][table] = [];
        mentorsMap[mentorId][table].push(row);
      }
    }

    // I set weights to different areas the higher the weight 
    // the more importance.
    const WEIGHTS = {
      language: 2,
      availability: 3,
      area_of_study: 4,
      communication_style: 1,
      expertise: 2,
      interest_overlap: 2,
      topic_area_fallback: 2
    };

    const matches: {
      mentor_id: string;
      mentor_profile: any;
      score: number;
      explanation: Record<string, any>;
    }[] = [];

    // Below is where the matching is done. If thier is an exact match the weight is added 
    // to the score. The code works by looping through each mentor and comparing different aspects 
    // of that mentor to the student. Basically .conatins. an "explanation" is also built up which is 
    // used in the frontend to inform the student what matchs with each mentor."
    for (const [mentorId, mentorData] of Object.entries(mentorsMap)) {
      let score = 0;
      const explanation: Record<string, any> = {};

      const studentLangs = studentData.student_preferences?.[0]?.language?.split(",") || [];
      const mentorLangs = mentorData.mentor_languages?.map((l: any) => l.language) || [];
      const langMatch = studentLangs.some(lang => mentorLangs.includes(lang));
      explanation.language = { matched: langMatch, studentLangs, mentorLangs };
      if (langMatch) score += WEIGHTS.language;

      const studentAvail = studentData.student_availability?.map((a: any) => `${a.day}`) || [];
      const mentorAvail = mentorData.mentor_availability?.map((a: any) => `${a.day}`) || [];
      const availOverlap = studentAvail.some(slot => mentorAvail.includes(slot));
      explanation.availability = {
        matched: availOverlap,
        overlap: availOverlap,
        studentAvail,
        mentorAvail
      };
      if (availOverlap) score += WEIGHTS.availability;

      const studentStudy = studentData.student_preferences?.[0]?.area_of_study;
      const mentorExpertise = mentorData.mentor_expertise?.map((e: any) => e.area_of_expertise) || [];
      const mentorTopics = mentorData.mentor_expertise?.map((e: any) => e.topic_area) || [];

      if (mentorExpertise.includes(studentStudy)) {
        score += WEIGHTS.area_of_study;
        explanation.area_of_study = {
          matched: true,
          type: "exact",
          studentStudy,
          mentorExpertise,
          mentorTopics
        };
      } else if (mentorTopics.includes(studentStudy)) {
        score += WEIGHTS.topic_area_fallback;
        explanation.area_of_study = {
          matched: true,
          type: "topic",
          studentStudy,
          mentorExpertise,
          mentorTopics
        };
      } else {
        explanation.area_of_study = {
          matched: false,
          type: null,
          studentStudy,
          mentorExpertise,
          mentorTopics
        };
      }

      const studentStyle = studentData.student_preferences?.[0]?.communication_style;
      const mentorStyles = mentorData.mentor_communication_styles?.map((s: any) => s.style) || [];
      const styleMatch = mentorStyles.includes(studentStyle);
      explanation.communication_style = {
        matched: styleMatch,
        studentStyle,
        mentorStyles
      };
      if (styleMatch) score += WEIGHTS.communication_style;

      const studentInterests = studentData.student_interests?.map((i: any) => i.interest) || [];
      const mentorSkills = mentorData.mentor_skills?.map((s: any) => s.skill) || [];
      const overlap = studentInterests.filter(i => mentorSkills.includes(i));
      explanation.interest_overlap = {
        matched: overlap.length > 0,
        matchedCount: overlap.length,
        matchedN: overlap,
        studentInterests,
        mentorSkills
      };
      score += overlap.length * WEIGHTS.interest_overlap;

      matches.push({
        mentor_id: mentorId,
        mentor_profile: mentorData.mentors?.[0],
        score,
        explanation
      });
    }

    matches.sort((a, b) => b.score - a.score);

    await connection.end();
    return returnStatus(200, "Matching complete", { student_id, matches });

  } catch (err: any) {
    console.error(err);
    return returnStatus(500, "Error", { detail: err.message });
  }
};

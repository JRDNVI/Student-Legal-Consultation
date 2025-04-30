import { FaHome, FaUserGraduate, FaTasks, FaCalendarAlt, FaBriefcase, FaGavel, FaPersonBooth, FaUserFriends, FaMoneyBill } from "react-icons/fa";

export const fieldMap = {
  student: {
    assignments: ["title", "status", "due_date"],
    tasks: ["title", "completed", "deadline"],
    meetings: ["timeslot", "status"],
    courses: ["title", "reason"]
  },
  mentor: {
    tasks: ["title", "deadline", "completed"],
    meetings: ["timeslot", "status"],
  },
  solicitor: {
    cases: ["status", "total_billing", "created_at"],
    tasks: ["title", "due_date", "completed"],
    notes: ["note_name", "note_type", "creation_date"],
    billing: ["billing_status", "amount_due", "billing_date"],
  },
  client: {
    cases: ["status", "total_billing", "created_at"],
    tasks: ["title", "due_date", "completed"],
    notes: ["note_name", "note_type", "creation_date"],
    billing: ["billing_status", "amount_due", "billing_date"],
  },
};

export const renderExplanation = (key, value) => {
  switch (key) {
    case "area_of_study":
      return (
        <p>
          Area of Study Match: <strong>{value.studentStudy}</strong> → Mentor Expertise:{" "}
          <strong>{value.mentorExpertise.join(", ")}</strong>
          {value.mentorTopics?.length > 0 && (
            <>
              <br />
              Mentor Topic Areas: <strong>{value.mentorTopics.join(", ")}</strong>
            </>
          )}
          {value.type && (
            <>
              <br />
              Matched on: <span className="italic">{value.type}</span>
            </>
          )}
        </p>
      );

    case "availability":
      return (
        <p>
          Days Available — Student: <strong>{value.studentAvail.join(", ")}</strong>, Mentor:{" "}
          <strong>{value.mentorAvail.join(", ")}</strong>
        </p>
      );

    case "language":
      return (
        <p>
          Preferred Languages — Student: <strong>{value.studentLangs.join(", ")}</strong>, Mentor:{" "}
          <strong>{value.mentorLangs.join(", ")}</strong>
        </p>
      );

    case "interest_overlap":
      return (
        <p>
          Common Interests:{" "}
          {value.matchedCount > 0 ? (
            <strong>{value.matchedN.join(", ")}</strong>
          ) : (
            <span className="italic text-gray-500">None</span>
          )}
        </p>
      );

    case "communication_style":
      return (
        <p>
          Communication Style — Student: <strong>{value.studentStyle}</strong>, Mentor:{" "}
          <strong>{value.mentorStyles.join(", ")}</strong>
        </p>
      );

    default:
      return null;
  }
};


export const userFields = {
  mentor: [
    { label: "Name", key: "mentor_name", source: "mentors", subKey: "name" },
    { label: "Email", key: "mentor_email", source: "mentors", subKey: "email" },
    { label: "Skills", key: "mentor_skills", isArray: true, subKey: "skill" },
    { label: "Expertise", key: "mentor_expertise", isArray: true, subKey: "area_of_expertise", uniqueKey: "aoe" },
    { label: "Topic Area", key: "mentor_expertise", isArray: true, subKey: "topic_area", uniqueKey: "ta" },
    { label: "Communication Styles", key: "mentor_communication_styles", isArray: true, subKey: "style" },
    { label: "Languages", key: "mentor_languages", isArray: true, subKey: "language" }
  ],
  student: [

    { label: "Interests", key: "student_interests", source: "student_interests", isArray: true, subKey: "interest", uniqueKey: "interests" },
    { label: "Area of Study", key: "student_preferences", source: "student_preferences", isObject: true, subKey: "area_of_study", uniqueKey: "aos" },
    { label: "Language", key: "student_preferences", source: "student_preferences", isObject: true, subKey: "language", uniqueKey: "lang" },
    { label: "Communication Style", key: "student_preferences", source: "student_preferences", isObject: true, subKey: "communication_style", uniqueKey: "comm" },

  ],
  client: [
    { label: "Language", key: "client_language", source: "clients", subKey: "language" },
    { label: "Communication Style", key: "client_communication_style", source: "clients", subKey: "communcation_style" },
    { label: "Budget", key: "client_budget", source: "clients", subKey: "budget", uniqueKey: "budget" },
    { label: "Legal Needs", key: "client_legal_needs", source: "client_legal_needs", isArray: true, subKey: "legal_topic" }
  ],

  solicitor: [
    { label: "Hourly Rate (€)", key: "hourly_rate", source: "solicitors", subKey: "hourly_rate", },
    { label: "Experience (Years)", key: "experience", source: "solicitors", subKey: "experience_years" },
    { label: "Languages", key: "solicitor_languages", isArray: true, subKey: "language" },
    { label: "Communication Styles", key: "solicitor_communication_styles", isArray: true, subKey: "style" },
    { label: "Specialisations", key: "solicitor_specialisations", isArray: true, subKey: "specialization" },
    { label: "Availability", key: "solicitor_availability", isArray: true, subKey: "day_of_week" }
  ]

}

export const tableIdMap = {
  student_interests: "interest_id",
  student_availability: "availability_id",
  student_preferences: "preference_id",

  mentor_skills: "id",
  mentor_expertise: "id",
  mentor_communication_styles: "id",
  mentor_languages: "id",
  mentor_availability: "id",

  clients: "client_id",
  client_legal_needs: "id",

  solicitors: "solicitor_id",
  solicitor_languages: "id",
  solicitor_communication_styles: "id",
  solicitor_specialisations: "id",
  solicitor_availability: "id",

  cases: "case_id",
  tasks: "task_id",
  messages: "message_id",
  notes: "note_id",
  documents: "document_id"
};


export const pathMap = {
  "/dashboard": "Dashboard",
  "/assignments": "Assignments",
  "/student-meetings": "Meetings",
  "/mentor": "Mentor",
  "/mentor-profile": "Mentor Profile",
  "/student-profile": "Student Profile",
  "/mentees": "Student Tasks",
  "/mentor-meetings": "Mentor Meetings",
  "/cases": "Cases",
  "/appointments": "Appointments",
  "/court-schedule": "Court Schedule",
  "/calendar": "Calendar",
  "/client-cases": "Your Case",
  "/client-profile": "Client Profile",
  "/billing": "Billing",
  "/solicitor-profile": "Solicitor Profile",
  "/solicitor-calendar": "Solicitor Calendar",
  "/client-billing": "Client Billing",
  "cases/:caseId": "Case Details",
};

export const items = {
  student: [
    { icon: <FaHome />, label: "Dashboard", path: "/dashboard" },
    { icon: <FaUserGraduate />, label: "Assignments", path: "/assignments" },
    { icon: <FaCalendarAlt />, label: "Meetings", path: "/student-meetings" },
    { icon: <FaPersonBooth />, label: "Mentor", path: "/mentor" },
    { icon: <FaUserFriends />, label: "Profile", path: "/student-profile" },
  ],
  mentor: [
    { icon: <FaHome />, label: "Dashboard", path: "/dashboard" },
    { icon: <FaTasks />, label: "Student Tasks", path: "/mentees" },
    { icon: <FaCalendarAlt />, label: "Mentor Meetings", path: "/mentor-meetings" },
    { icon: <FaUserFriends />, label: "Profile", path: "/mentor-profile" },
  ],
  client: [
    { icon: <FaHome />, label: "Dashboard", path: "/dashboard" },
    { icon: <FaBriefcase />, label: "My Cases", path: "/client-cases" },
    { icon: <FaMoneyBill />, label: "Billing", path: "/client-billing" },
    { icon: <FaUserFriends />, label: "Profile", path: "/client-profile" },
  ],
  solicitor: [
    { icon: <FaHome />, label: "Dashboard", path: "/dashboard" },
    { icon: <FaBriefcase />, label: "All Cases", path: "/cases" },
    { icon: <FaMoneyBill />, label: "Billing", path: "/billing" },
    { icon: <FaCalendarAlt />, label: "Calendar", path: "/solicitor-calendar" },
    { icon: <FaUserFriends />, label: "Profile", path: "/solicitor-profile" }
  ],
};
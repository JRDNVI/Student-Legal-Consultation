import { FaHome, FaUserGraduate, FaTasks, FaCalendarAlt, FaBriefcase, FaGavel, FaPersonBooth, FaUserFriends } from "react-icons/fa";

export const fieldMap = {
  student: {
    assignments: ["title", "status", "due_date"],
    tasks: ["title", "completed", "deadline"],
    meetings: ["timeslot", "status"],
    courses: ["title", "reason"]
  },
  mentor: {
    tasks: ["title", "deadline", "completed"],
    //assignments: ["title", "status", "due_date"],SS
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
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Availability", key: "availability" },
    { label: "Skills", key: "mentor_skills", isArray: true, subKey: "skill" },
    { label: "Expertise", key: "mentor_expertise", isArray: true, format: (item) => `${item.topic_area} → ${item.area_of_expertise}` },
    { label: "Communication Styles", key: "mentor_communication_styles", isArray: true, subKey: "style" },
    { label: "Languages", key: "mentor_languages", isArray: true, subKey: "language" }
  ],
  student: [
    { label: "Name", key: "name" },
    { label: "Email", key: "email" },
    { label: "Interests", key: "student_interests", isArray: true, subKey: "interest" },
    { label: "Availability", key: "student_availability", isArray: true, format: (item) => `${item.day} (${item.time_slot})` },
    { label: "Preferences", key: "student_preferences", isArray: true, format: (item) => `${item.area_of_study}, ${item.language}, ${item.communication_style}` }
  ],
}

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
    { icon: <FaBriefcase />, label: "My Cases", path: "/cases" },
    { icon: <FaCalendarAlt />, label: "Appointments", path: "/appointments" },
  ],
  solicitor: [
    { icon: <FaHome />, label: "Dashboard", path: "/dashboard" },
    { icon: <FaBriefcase />, label: "All Cases", path: "/cases" },
    { icon: <FaGavel />, label: "Court Schedule", path: "/court-schedule" },
    { icon: <FaCalendarAlt />, label: "Calendar", path: "/calendar" },
  ],
};
import React from "react";
import { useNavigate } from "react-router-dom";
import { appApi } from "../../api/api";

const explanationOrder = [
  "area_of_study",
  "availability",
  "language",
  "communication_style",
  "interest_overlap"
];

const renderExplanation = (key, value) => {
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

const MentorCard = ({  match, studentId }) => {
  const { mentor_profile, mentor_id, score, explanation } = match;
  const navigate = useNavigate();

  const handleSelectMentor = async () => {

    try {
      const payload = {
        tableName: "students",
        data: {
          mentor_id: mentor_id
        },
        where: {
          student_id: studentId,
        }
      };

      const response = await appApi.put("education/", payload);
      if(response.status === 200) {
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Failed to update student:", err);
    }
  };

  return (
    <div className="border border-gray-200 p-4 rounded mb-4 bg-white shadow-md transition hover:shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800">{mentor_profile.name}</h2>
      <p className="text-sm text-gray-600">📧 {mentor_profile.email}</p>
      <p className="text-sm text-purple-700 font-medium mt-1">Match Score: {score}</p>

      <details className="mt-4 cursor-pointer text-sm">
        <summary className="text-blue-600 font-medium">See match details</summary>
        <div className="mt-2 space-y-3">
          {explanationOrder.map((key) => {
            const value = explanation[key];
            if (!value) return null;

            return (
              <div key={key} className="bg-gray-50 p-3 rounded border">
                <div className="flex justify-between items-center mb-1">
                  <span className="capitalize font-semibold">
                    {key.replace(/_/g, " ")}
                  </span>
                  <span
                    className={
                      value.matched
                        ? "text-green-600 font-medium"
                        : "text-red-500 font-medium"
                    }
                  >
                    {value.matched ? "✓ Match" : "✗ No Match"}
                  </span>
                </div>
                <div className="text-gray-700 text-xs">
                  {renderExplanation(key, value)}
                </div>
              </div>
            );
          })}
        </div>
      </details>

      <button
        onClick={handleSelectMentor}
        className="mt-4 bg-green-600 text-white text-sm px-4 py-2 rounded hover:bg-green-700"
      >
        Choose Mentor
      </button>
    </div>
  );
};

export default MentorCard;

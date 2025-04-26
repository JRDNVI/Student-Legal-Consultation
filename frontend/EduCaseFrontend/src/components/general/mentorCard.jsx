import React from "react";
import { useNavigate } from "react-router-dom";
import { appApi } from "../../api/api";
import { renderExplanation } from "../../util/appMapping";

const explanationOrder = [
  "area_of_study",
  "availability",
  "language",
  "communication_style",
  "interest_overlap"
];

const MentorCard = ({ match, studentId, showCourseForm }) => {
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

      await appApi.put("education/", payload);
      if (showCourseForm) {
        navigate("/onboarding", { state: { continueToCourses: true, studentId } });
      } else {
        const updateUser = await appApi.put("education/", {
          tableName: "students",
          data: {
            onboarded: true,
          },
          where: { student_id: studentId },
        });
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Failed to update student:", err);
    }
  };

  return (
    <div className="border border-gray-200 p-4 rounded mb-4 bg-white shadow-md transition hover:shadow-lg">
      <h2 className="text-xl font-semibold text-gray-800">{mentor_profile?.name ?? "Bob Booby"}</h2>
      <p className="text-sm text-gray-600">📧 {mentor_profile?.email ?? "bob@bob.gmail"}</p>
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

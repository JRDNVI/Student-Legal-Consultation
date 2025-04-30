import React from "react";
import { appApi } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

// Used to display solicitors to the client after the matching is complete.
// They can select one solicitor and the solicitor will have the option to 
// accpet the case.

const SolicitorCard = ({ match, clientId }) => {
  const { user } = useAuth();
  const { profile, score, explanation } = match;
  const Navigate = useNavigate()

  const handleRequestSolicitor = async () => {
    try {
      await appApi.post("education/", {
        tableName: "cases",
        data: {
          client_id: clientId,
          solicitor_id: profile?.solicitor_id,
          status: "Requested",
          created_at: new Date().toISOString(),
          total_billing: 0
        }
      });

      await appApi.put("education/", {
        tableName: "clients",
        data: {
          solicitor_id: profile?.solicitor_id,
        },
        where: {
          client_id: clientId
        }
      });

      console.log(profile)

      await appApi.put("education/", {
        tableName: "clients",
        data: {
          onboarded: 1
        },
        where: {
          cognito_id: user.sub
        }
      });
      alert("Solicitor requested successfully!");
      Navigate("/dashboard")
    } catch (err) {
      console.error("Failed to request solicitor:", err);
      alert("Failed to request solicitor.");
    }
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 mb-4 border border-gray-200">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-purple-700">{profile?.name || "Unnamed Solicitor"}</h2>
          <p className="text-gray-600">{profile?.email}</p>
          <p className="text-sm text-gray-500 mt-1">
            <span className="font-medium">Experience:</span> {profile?.experience_years || 0} years
          </p>
          <p className="text-sm text-gray-500">
            <span className="font-medium">Hourly Rate:</span> €{profile?.hourly_rate || "N/A"}
          </p>
        </div>

        <div className="text-right">
          <p className="text-lg font-semibold text-purple-600">Score: {score}</p>
          <button
            onClick={handleRequestSolicitor}
            className="mt-2 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 text-sm"
          >
            Request Solicitor
          </button>
        </div>
      </div>

      <div className="mt-4">
        <h3 className="text-md font-semibold text-gray-700 mb-2">Why this match?</h3>
        <ul className="list-disc pl-5 text-sm text-gray-700 space-y-1">
          {explanation.specialization?.matched && (
            <li>✅ Matches your legal needs</li>
          )}
          {explanation.language?.matched && (
            <li>✅ Speaks your preferred language</li>
          )}
          {explanation.communication_style?.matched && (
            <li>✅ Preferred communication style matches</li>
          )}
          {explanation.budget_fit?.matched && (
            <li>✅ Within your budget (Rate: €{explanation.budget_fit.solicitorRate})</li>
          )}
          {explanation.availability?.hasAvailability && (
            <li>✅ Has available time slots</li>
          )}
          {explanation.experience?.years > 0 && (
            <li>✅ {explanation.experience.years} years of experience</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default SolicitorCard;

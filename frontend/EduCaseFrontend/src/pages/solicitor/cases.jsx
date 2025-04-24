import React from "react";
import useDashboardData from "../../hooks/useDashboardData";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/general/LoadingSpinner";
import { useNavigate } from "react-router-dom";
import { appApi } from "../../api/api";

const CaseListPage = () => {
  const { user } = useAuth();
  const { data, loading, refetch } = useDashboardData(user);
  const role = user["custom:role"];
  const Navigate = useNavigate();

  if (loading) return <LoadingSpinner />;
  if (!data?.cases?.length) {
    return (
      <div className="flex">
        <Sidebar role={role} />
        <main className="flex-1 p-10 bg-gray-100 min-h-screen">
          <h1 className="text-2xl font-bold text-purple-700 mb-6">Your Legal Cases</h1>
          <p className="text-gray-600">No legal cases found.</p>
        </main>
      </div>
    );
  }

  const ongoingCases = data.cases.filter((c) => c.status === "Ongoing");
  const requestedCases = data.cases.filter((c) => c.status === "Requested");

  const handleStatusUpdate = async (caseId, newStatus) => {
    try {
      await appApi.put("education/", {
        tableName: "cases",
        data: { status: newStatus },
        where: { case_id: caseId }
      });
      await refetch();
    } catch (err) {
      console.error(" Error updating case status:", err.response?.data || err.message);
    }
  };

  const renderCaseCard = (c, isClickable = false, withActions = false) => (
    
    <div
      key={c.case_id}
      className={`bg-white shadow-md rounded-xl p-6 border border-gray-200 transition ${
        isClickable ? "hover:shadow-lg cursor-pointer" : ""
      }`}
      onClick={() => isClickable && Navigate(`/cases/${c.case_id}`)}
    >
      <p><span className="font-semibold">📂 Case ID:</span> {c.case_id}</p>
      <p><span className="font-semibold">🧑‍⚖️ Solicitor ID:</span> {c.solicitor_id}</p>
      <p><span className="font-semibold">📅 Created:</span> {new Date(c.created_at).toLocaleDateString()}</p>
      <p><span className="font-semibold">📌 Status:</span> {c.status}</p>
      <p><span className="font-semibold">💰 Billing:</span> €{c.total_billing}</p>

      {withActions && (
        <div className="flex gap-4 mt-4">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStatusUpdate(c.case_id, "Ongoing");
            }}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm"
          >
            ✅ Accept
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleStatusUpdate(c.case_id, "Declined");
            }}
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
          >
            ❌ Decline
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex">
      <main className="flex-1 p-10 bg-gray-100 min-h-screen space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-purple-700 mb-4">Active Cases</h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {ongoingCases.map((c) => renderCaseCard(c, true))}
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-purple-700 mb-4">Pending Requests</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {requestedCases.map((c) => renderCaseCard(c, false, true))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default CaseListPage;

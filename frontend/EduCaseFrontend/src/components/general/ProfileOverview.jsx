import React from "react";
import { useNavigate } from "react-router-dom";
import { userFields } from "../../util/appMapping";
import { FaPlus } from "react-icons/fa";


const ProfileOverview = ({ role, data, onEdit }) => {
  const navigate = useNavigate();
  const fields = userFields[role] || [];
  console.log("Profile Overview Data:", data);

  const userDetails = data?.[role + "s"][0]
  return (
    <main className="flex-1 min-h-screen">
      <div className=" mx-auto space-y-8">
        <div className="flex justify-between items-center">
        </div>
        <div className="relative bg-white p-6 rounded-xl shadow-lg flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={data?.profile_picture || "https://api.dicebear.com/6.x/initials/svg?seed=User&backgroundColor=b6e3f4"}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-purple-200"
          />

          <div className="flex-1 text-center sm:text-left">
            <h2 className="text-2xl font-bold text-gray-800 mb-1">
              {userDetails.name || "Unnamed User"}
            </h2>
            <p className="text-sm text-gray-600">{userDetails.email}</p>
            <p className="text-sm text-gray-700 mt-2">
              {data?.description || "This user has not added a profile description yet."}
            </p>
          </div>
          <button
            onClick={onEdit}
            className="absolute top-4 right-4 bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            <FaPlus />
          </button>
        </div>


        <div className="bg-white p-6 rounded-xl shadow space-y-4">
          <h2 className="text-xl font-semibold text-gray-800">Details</h2>
          <div className="flex flex-wrap gap-x-40 gap-y-8">

            {fields.map((field) => {
              let value;

              if (field.source) {
                value = data[field.source]?.[0]?.[field.subKey];
              } else if (field.isArray) {
                value = (data[field.key] || []).map(item => item[field.subKey] ?? item);
              } else {
                value = data[field.key];
              }

              if (!value || (Array.isArray(value) && value.length === 0)) return null;

              return (
                <div key={field.uniqueKey || field.key}>
                  <h3 className="text-md font-semibold text-gray-700 mb-2">{field.label}</h3>
                  {field.isArray ? (
                    <div className="flex flex-wrap gap-2 text-sm text-gray-700">
                      {Array.isArray(value) ? value.map((item, idx) => (
                        <span
                          key={idx}
                          className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs"
                        >
                          {field.format ? field.format(item) : item[field.subKey] || item}
                        </span>
                      )) : (
                        <span>{value}</span>
                      )}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-700">{value}</p>
                  )}
                </div>
              );
            })}

          </div>
        </div>

        {role === "mentor" && data.students?.length > 0 && (
          <div className="bg-white p-6 rounded-xl shadow">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">👩‍🎓 Mentees</h3>
            <ul className="space-y-2 text-sm text-gray-700">
              {data.students.map((student, index) => (
                <li key={index} className="border-b pb-2">
                  <p><span className="font-medium">Name:</span> {student.name || "Unnamed Student"}</p>
                  <p><span className="font-medium">Email:</span> {student.email}</p>
                </li>
              ))}
            </ul>
          </div>
        )}
        {data.cases?.length > 0 && (
          <>
            {role === "solicitor" && data.cases.some(c => c.status === "Ongoing") && (
              <div className="bg-white p-6 rounded-xl shadow">
                <h2 className="text-xl font-semibold text-purple-700">Current Clients</h2>
                <ul className="space-y-4">
                  {data.cases
                    .filter(c => c.status === "Ongoing")
                    .map((clientCase) => {
                      const client = (data.clients || []).find(cl => cl.client_id === clientCase.client_id);

                      return (
                        <li
                          key={clientCase.case_id}
                          onClick={() => navigate(`/cases/${clientCase.case_id}`)}
                          className="border p-4 rounded-lg hover:bg-gray-50 transition flex justify-between items-center cursor-pointer"
                        >
                          <div>
                            <p className="font-semibold text-gray-800">{client?.name || "Unknown Client"}</p>
                            <p className="text-sm text-gray-600">{client?.email || "No Email Available"}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Case Status: {clientCase.status}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500 text-right">
                            <p>Billing: €{clientCase.total_billing || "0.00"}</p>
                            <p className="mt-1">Created: {new Date(clientCase.created_at).toLocaleDateString()}</p>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              </div>
            )}
            {role === "solicitor" && data.cases.some(c => c.status !== "Ongoing") && (
              <div className="bg-white p-6 rounded-xl shadow space-y-4 mt-8">
                <h2 className="text-xl font-semibold text-purple-700">Case History</h2>
                <ul className="space-y-4">
                  {data.cases
                    .filter(c => c.status !== "Ongoing")
                    .map((clientCase) => {
                      const client = (data.clients || []).find(cl => cl.client_id === clientCase.client_id);

                      return (
                        <li
                          key={clientCase.case_id}
                          onClick={() => navigate(`/cases/${clientCase.case_id}`)}
                          className="border p-4 rounded-lg hover:bg-gray-50 transition flex justify-between items-center cursor-pointer"
                        >
                          <div>
                            <p className="font-semibold text-gray-800">{client?.name || "Unknown Client"}</p>
                            <p className="text-sm text-gray-600">{client?.email || "No Email Available"}</p>
                            <p className="text-sm text-gray-500 mt-1">
                              Case Status: {clientCase.status}
                            </p>
                          </div>
                          <div className="text-sm text-gray-500 text-right">
                            <p>Billing: €{clientCase.total_billing || "0.00"}</p>
                            <p className="mt-1">Created: {new Date(clientCase.created_at).toLocaleDateString()}</p>
                          </div>
                        </li>
                      );
                    })}
                </ul>
              </div>
            )}
            {role === "client" && (
              <div className="bg-white p-6 rounded-xl shadow space-y-4 mt-8">
                <h2 className="text-xl font-semibold text-purple-700">Your Solicitor & Case</h2>
                <div className="border p-4 rounded-lg hover:bg-gray-50 transition rounded-xl">
                  {(() => {
                    const client = data.clients?.[0];
                    const solicitor = (data.solicitors || []).find(sol => sol.solicitor_id === client?.solicitor_id);
                    const clientCase = (data.cases || []).find(c => c.client_id === client?.client_id);

                    if (!solicitor) {
                      return <p className="text-gray-500">No Solicitor Assigned Yet.</p>;
                    }

                    return (
                      <>
                        <div className="flex justify-between items-center">
                          <div>
                            <p className="font-semibold text-gray-800">{solicitor.name}</p>
                            <p className="text-sm text-gray-600">{solicitor.email}</p>
                          </div>
                          <div className="flex gap-2">
                            {clientCase && (
                              <button
                                onClick={() => navigate(`/cases/${clientCase.case_id}`)}
                                className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
                              >
                                View Case
                              </button>
                            )}
                            <button
                              onClick={() => navigate(`/solicitors/${solicitor.solicitor_id}`)}
                              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                            >
                              View Solicitor
                            </button>
                          </div>
                        </div>

                        {clientCase ? (
                          <div className="mt-4 text-sm text-gray-700 space-y-1">
                            <p><span className="font-semibold">Status:</span> {clientCase.status}</p>
                            <p><span className="font-semibold">Billing:</span> €{clientCase.total_billing || "0.00"}</p>
                            <p><span className="font-semibold">Created:</span> {new Date(clientCase.created_at).toLocaleDateString()}</p>
                          </div>
                        ) : (
                          <p className="mt-4 text-gray-500">No case assigned yet.</p>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            )}

          </>
        )}

      </div>
    </main>
  );
};

export default ProfileOverview;

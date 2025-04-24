import React from "react";
import { useNavigate } from "react-router-dom";
import { userFields } from "../../util/appMapping";


const ProfileOverview = ({ role, data, onEdit }) => {
  const navigate = useNavigate();
  const fields = userFields[role] || [];

  return (
      <main className="flex-1 p-8 min-h-screen">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-purple-700 capitalize">{role} Profile</h1>
            <button
              onClick={onEdit}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Edit Profile
            </button>
          </div>

      
          <div className="bg-white p-6 rounded-xl shadow-lg flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <img
              src={data?.profile_picture || "https://api.dicebear.com/6.x/initials/svg?seed=User&backgroundColor=b6e3f4"}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-purple-200"
            />
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{data?.name || "Unnamed User"}</h2>
              <p className="text-sm text-gray-600">{data?.email}</p>
              <p className="text-sm text-gray-700 mt-2">
                {data?.description || "This user has not added a profile description yet."}
              </p>
            </div>
          </div>

        
          <div className="bg-white p-6 rounded-xl shadow space-y-4">
            <h2 className="text-xl font-semibold text-gray-800">Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {fields.map((field) => {
                const value = data[field.key];
                if (!value || (Array.isArray(value) && value.length === 0)) return null;

                return (
                  <div key={field.key}>
                    <h3 className="text-md font-semibold text-gray-700 mb-2">{field.label}</h3>
                    {field.isArray ? (
                      <ul className="list-disc pl-5 text-sm text-gray-700">
                        {value.map((item, idx) => (
                          <li key={idx}>
                            {field.format ? field.format(item) : item[field.subKey] || item}
                          </li>
                        ))}
                      </ul>
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
        </div>
      </main>
  );
};

export default ProfileOverview;

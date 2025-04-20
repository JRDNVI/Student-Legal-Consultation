import React from "react";
import { useAuth } from "../../context/AuthContext";
import useDashboardData from "../../hooks/useDashboardData";
import LoadingSpinner from "../../components/general/LoadingSpinner";
import Sidebar from "../../components/dashboard/sidebar";

const StudentMentorPage = () => {
  const { user } = useAuth();
  const { data, loading, refetch } = useDashboardData(user);
  const role = user["custom:role"];

  if (loading) return <LoadingSpinner title="Loading Mentor Page"/>;
  if (!data.mentors?.length) {
    return <p className="text-center text-gray-600 mt-10">No mentor assigned yet.</p>;
  }

  const mentor = data.mentors[0];

  return (
    <div className="flex">
      <Sidebar role={role} />
      <main className="flex-1 bg-gray-100 min-h-screen p-10 space-y-6">

        <section className="bg-white rounded-2xl shadow-lg p-6">
          <h1 className="text-3xl font-bold text-purple-700 mb-6">Your Mentor</h1>
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-200 space-y-3">
            <p className="text-lg"><span className="font-semibold">👩‍🏫 Name:</span> {mentor.name || "N/A"}</p>
            <p className="text-lg"><span className="font-semibold">📧 Email:</span> {mentor.email}</p>

            {[
              { title: "💡 Skills", items: data.mentor_skills, render: (s) => s.skill },
              { title: "🎯 Expertise", items: data.mentor_expertise, render: (e) => `${e.topic_area} → ${e.area_of_expertise}` },
              { title: "🗣 Communication Styles", items: data.mentor_communication_styles, render: (c) => c.style },
              { title: "🌐 Languages", items: data.mentor_languages, render: (l) => l.language }
            ].map(({ title, items, render }, idx) => (
              <div key={idx}>
                <h3 className="font-semibold text-gray-800 mt-4">{title}</h3>
                <ul className="list-disc pl-6 text-gray-700 text-sm">
                  {items.length > 0
                    ? items.map((item, i) => <li key={i}>{render(item)}</li>)
                    : <li className="italic">No data listed</li>}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-2xl shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">Your Tasks</h2>
          {data.tasks_student.length === 0 ? (
            <p className="text-gray-600 italic">You have no assigned tasks yet.</p>
          ) : (
            <ul className="space-y-4">
              {data.tasks_student.map((task) => (
                <li key={task.task_id} className="bg-white p-4 border border-gray-200 rounded-xl shadow-sm space-y-2">
                  <div className="flex justify-between items-center mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
                    <span className="text-sm px-2 py-1 bg-purple-100 text-purple-800 rounded">
                      {task.completed ? "Completed" : "Pending"}
                    </span>
                  </div>
                  {task.deadline && (
                    <p className="text-sm text-gray-500">
                      ⏰ Due: <span className="font-medium">{task.deadline.split("T")[0]}</span>
                    </p>
                  )}

                  <form onSubmit={null} className="flex justify-end items-center gap-2 mt-2">
                    <input type="file" name="file" className="text-sm border rounded p-1" required />
                    <button type="submit" className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 text-sm">
                      Upload
                    </button>
                  </form>
                </li>
              ))}
            </ul>
          )}
        </section>
      </main>
    </div>
  );
};

export default StudentMentorPage;

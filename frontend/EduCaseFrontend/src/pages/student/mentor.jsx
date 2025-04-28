import React, { useState } from "react";
import useDashboardData from "../../hooks/useDashboardData";
import LoadingSpinner from "../../components/general/LoadingSpinner";
import { useMessageHistory } from "../../hooks/messageHistory";
import { uploadFileAndGetS3Key } from "../../util/upload/uploadFiles";
import ViewFileButton from "../../components/general/ViewFileButton";

const StudentMentorPage = () => {
  const { data, loading } = useDashboardData();
  const { messages, loading: messagesLoading } = useMessageHistory();
  const currentUserEmail = data?.students?.[0]?.email;

  const [selectedFiles, setSelectedFiles] = useState({});

  if (loading || messagesLoading) return <LoadingSpinner title="Loading Mentor Page" />;
  if (!data.mentors?.length) {
    return <p className="text-center text-gray-600 mt-10">No mentor assigned yet.</p>;
  }

  const mentor = data.mentors[0];
  const mentorEmail = mentor.email;

  const messageList = Array.isArray(messages)
    ? messages
    : messages[mentorEmail] || [];

  const uploadFile = async (file, taskId) => {
    try {
      const s3Key = await uploadFileAndGetS3Key(
        "tasks_student",
        file,
        "student",
        data.students[0].student_id,
        taskId
      );
      console.log("File uploaded successfully. S3 Key:", s3Key);
    } catch (error) {
      console.error("Error uploading file:", error);
    }
  };

  return (
    <div className="flex flex-col bg-gray-50 min-h-screen p-6 gap-6">
      <div className="flex-1 flex flex-col gap-6">
        <section className="bg-white rounded-3xl shadow-md p-8">
          <div className="flex items-center gap-6 flex-wrap">
            <div className="flex-1 min-w-0">
              <p className="truncate"><span className="font-semibold">Name:</span> {mentor.name || "N/A"}</p>
              <p className="truncate"><span className="font-semibold">Email:</span> {mentor.email}</p>
            </div>
            <div className="w-24 h-24 flex-shrink-0">
              <img
                src={mentor.photoUrl || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(mentor.name || "Mentor")}`}
                alt="Mentor Profile"
                className="w-full h-full rounded-full object-cover border-2 border-purple-300 shadow"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
            {[
              { title: "Skills", items: data.mentor_skills, render: (s) => s.skill },
              { title: "Expertise", items: data.mentor_expertise, render: (e) => `${e.topic_area} → ${e.area_of_expertise}` },
              { title: "Communication Styles", items: data.mentor_communication_styles, render: (c) => c.style },
              { title: "Languages", items: data.mentor_languages, render: (l) => l.language }
            ].map(({ title, items, render }, idx) => (
              <div key={idx}>
                <h3 className="font-semibold text-gray-700 mb-2">{title}</h3>
                <ul className="list-disc list-inside text-gray-600 text-sm space-y-1">
                  {items.length > 0 ? (
                    items.map((item, i) => <li key={i}>{render(item)}</li>)
                  ) : (
                    <li className="italic text-gray-400">No data listed</li>
                  )}
                </ul>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-3xl shadow-md p-8 flex flex-col">
          <h2 className="text-2xl font-bold text-purple-700 mb-6">Your Tasks</h2>

          {data.tasks_student.length === 0 ? (
            <p className="text-gray-600 italic text-center py-10">You have no assigned tasks yet.</p>
          ) : (
            <div className={`flex-1 ${data.tasks_student.length > 2 ? "overflow-y-auto max-h-[300px]" : ""}`}>
              <ul className="space-y-6">
                {data.tasks_student.map((task) => (
                  <li
                    key={task.task_id}
                    className="bg-purple-50 border border-purple-200 p-6 rounded-2xl hover:shadow-lg transition"
                  >
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
                      <h3 className="text-lg font-bold text-gray-900">{task.title}</h3>
                      <span
                        className={`mt-2 md:mt-0 px-3 py-1 text-xs font-semibold rounded-full ${task.completed ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"}`}
                      >
                        {task.completed ? "Completed" : "Pending"}
                      </span>
                    </div>

                    {task.deadline && (
                      <p className="text-sm text-gray-500 mb-4">
                        ⏰ Due Date: <span className="font-medium">{task.deadline.split("T")[0]}</span>
                      </p>
                    )}

                    {task.filename ? (
                      <div className="mt-4 flex flex-col sm:flex-row sm:items-center gap-3">
                        <ViewFileButton s3Key={task.s3_key} filename={task.filename} />
                      </div>
                    ) : (
                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (selectedFiles[task.task_id]) {
                            uploadFile(selectedFiles[task.task_id], task.task_id);
                          }
                        }}
                        className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2"
                      >
                        <input
                          type="file"
                          name="file"
                          className="flex-1 text-sm border-gray-300 rounded-lg shadow-sm p-2 focus:outline-purple-500"
                          required
                          onChange={(e) => setSelectedFiles({ ...selectedFiles, [task.task_id]: e.target.files[0] })}
                        />
                        <button
                          type="submit"
                          className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-5 py-2 rounded-lg transition"
                        >
                          Upload
                        </button>
                      </form>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>
        <aside className="bg-white rounded-3xl shadow-md p-6 flex flex-col w-full h-[200px] overflow-y-auto">
          <h2 className="text-xl font-bold text-purple-700 mb-4">💬 Message History</h2>
          <div className="overflow-y-auto space-y-4">
            {messageList.length === 0 ? (
              <p className="text-gray-500 italic text-sm">No messages yet</p>
            ) : (
              messageList.map((msg, idx) => {
                const isSender = msg.sender === currentUserEmail;
                return (
                  <div
                    key={idx}
                    className={`text-sm p-3 rounded-lg max-w-[85%] break-words ${isSender ? "bg-purple-100 self-end text-right" : "bg-gray-100 self-start text-left"}`}
                  >
                    <p className="text-gray-800">{msg.message}</p>
                    <p className="text-gray-400 text-xs mt-1">{new Date(msg.timestamp).toLocaleString()}</p>
                  </div>
                );
              })
            )}
          </div>
        </aside>
      </div>


    </div>
  );
};

export default StudentMentorPage;

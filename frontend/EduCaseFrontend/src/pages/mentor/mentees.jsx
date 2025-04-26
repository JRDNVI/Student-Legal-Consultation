import React from "react";
import useDashboardData from "../../hooks/useDashboardData";
import LoadingSpinner from "../../components/general/LoadingSpinner";
import AddStudentTask from "../../components/forms/AddStudentTaskForm";
import dayjs from "dayjs";

const MentorTaskPage = () => {
  const { data, loading } = useDashboardData();

  if (loading) return <LoadingSpinner title="Add Student Task" />;

  const mentorId = data?.mentors?.[0]?.mentor_id;
  const students = data?.students || [];

  return (
    <div className="flex">
      <main className="flex-1">
        <AddStudentTask mentorId={mentorId} students={students} />
        <section className="bg-white shadow-md rounded-xl p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">Assigned Tasks</h2>

          {(data.tasks_student || [])
            .filter(task => task.mentor_id === mentorId)
            .length === 0 ? (
            <p className="text-gray-500">No tasks assigned yet.</p>
          ) : (
            <div className="space-y-4">
              {(data.tasks_student || [])
                .filter(task => task.mentor_id === mentorId)
                .map(task => (
                  <div
                    key={task.task_id}
                    className="border p-4 rounded-lg hover:bg-gray-50 transition flex justify-between items-center"
                  >
                    <div>
                      <p className="font-semibold text-purple-800">{task.title}</p>
                      {task.deadline && (
                        <p className="text-sm text-gray-600 mt-1">
                          Due: {dayjs(task.deadline).format("MMMM D, YYYY")}
                        </p>
                      )}
                      <p className="text-sm text-gray-500 mt-1">
                        Assigned to: {
                          (students.find(student => student.student_id === task.student_id)?.name) || "Unknown Student"
                        }
                      </p>
                    </div>
                    {task.completed ? (
                      <span className="text-green-500 font-medium">Completed</span>
                    ) : (
                      <span className="text-yellow-500 font-medium">Pending</span>
                    )}
                  </div>
                ))}
            </div>
          )}
        </section>
      </main>
    </div>

  );
};

export default MentorTaskPage;

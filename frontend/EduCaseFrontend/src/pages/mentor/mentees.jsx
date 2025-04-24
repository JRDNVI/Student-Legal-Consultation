import React from "react";
import { useAuth } from "../../context/AuthContext";
import useDashboardData from "../../hooks/useDashboardData";
import LoadingSpinner from "../../components/general/LoadingSpinner";
import AddStudentTask from "../../components/forms/AddStudentTaskForm";

const MentorTaskPage = () => {
  const { user } = useAuth();
  const { data, loading } = useDashboardData(user);

  if (loading) return <LoadingSpinner title="Add Student Task" />;

  const mentorId = data?.mentors?.[0]?.mentor_id;
  const students = data?.students || [];

  return (
    <div className="flex">
      <main className="flex-1 p-8 bg-gray-100 min-h-screen">
        <AddStudentTask mentorId={mentorId} students={students} />
      </main>
    </div>
  );
};

export default MentorTaskPage;

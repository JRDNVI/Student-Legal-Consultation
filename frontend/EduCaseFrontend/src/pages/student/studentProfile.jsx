import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import useDashboardData from "../../hooks/useDashboardData";
import LoadingSpinner from "../../components/general/LoadingSpinner";
import ProfileOverview from "../../components/general/ProfileOverview";
import Modal from "../../components/general/Modal";
import EditProfile from "../../components/forms/EditProfile";


const StudentProfilePage = () => {
  const { user } = useAuth();
  const role = user["custom:role"];
  const { data, loading, refetch } = useDashboardData();
  const [showEdit, setShowEdit] = useState(false);

  if (loading) return <LoadingSpinner title="Student Profile" />;

  const studentId = data?.students?.[0]?.student_id;

  console.log("Student ID:", studentId);
  const handleEditSubmit = async (formData) => {
    console.log("Student profile form submitted", formData);
    setShowEdit(false);
    refetch();
  };

  return (
    <>
      <ProfileOverview
        role={role}
        data={data}
        onEdit={() => setShowEdit(true)}
      />

      <Modal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Student Profile"
      >
        <EditProfile
          role={role}
          data={data}
          onCancel={() => setShowEdit(false)}
          onSubmit={handleEditSubmit}
          id={studentId}
        />
      </Modal>
    </>
  );
};

export default StudentProfilePage;

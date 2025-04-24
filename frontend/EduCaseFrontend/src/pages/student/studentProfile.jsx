import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import useDashboardData from "../../hooks/useDashboardData";
import LoadingSpinner from "../../components/general/LoadingSpinner";
import ProfileOverview from "../../components/general/ProfileOverview";
import Modal from "../../components/general/Modal";


const StudentProfilePage = () => {
  const { user } = useAuth();
  const role = user["custom:role"]; 
  const { data, loading, refetch } = useDashboardData(user);

  const [showEdit, setShowEdit] = useState(false);

  if (loading) return <LoadingSpinner title="Student Profile" />;

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
      </Modal>
    </>
  );
};

export default StudentProfilePage;

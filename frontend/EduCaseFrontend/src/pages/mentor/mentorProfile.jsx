import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import useDashboardData from "../../hooks/useDashboardData";
import ProfileOverview from "../../components/general/ProfileOverview";
import LoadingSpinner from "../../components/general/LoadingSpinner";
import Modal from "../../components/general/Modal"
import EditProfile from "../../components/forms/EditProfile";

const MentorProfilePage = () => {
  const { user } = useAuth();
  const { data, loading, refetch } = useDashboardData(user);
  const [showEdit, setShowEdit] = useState(false);

  if (loading) return <LoadingSpinner title="Profile" />;

  const memtorId = data?.mentors?.[0]?.mentor_id;

  // const initialData = {
  //   skills: data.mentor_skills?.map(s => s.skill) || [],
  //   expertise: data.mentor_expertise || [],
  //   communication_styles: data.mentor_communication_styles?.map(s => s.style) || [],
  //   languages: data.mentor_languages?.map(l => l.language) || [],
  //   availability: data.mentor_availability || []
  // };

  const handleEditSubmit = async (formData) => {
    console.log("Mentor profile form submitted", formData);
    setShowEdit(false);
    refetch();
  }

  return (
    <>
      <ProfileOverview
        role="mentor"
        data={data}
        onEdit={() => setShowEdit(true)}
      />

      <Modal
        isOpen={showEdit}
        onClose={() => setShowEdit(false)}
        title="Edit Student Profile"
      >
        <EditProfile
          role="mentor"
          data={data}
          onCancel={() => setShowEdit(false)}
          onSubmit={handleEditSubmit}
          id={memtorId}
        />
      </Modal>
    </>
  );
};

export default MentorProfilePage;

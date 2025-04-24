import React, {useState} from "react";
import { useAuth } from "../../context/AuthContext";
import useDashboardData from "../../hooks/useDashboardData";
import ProfileOverview from "../../components/general/ProfileOverview";
import LoadingSpinner from "../../components/general/LoadingSpinner";
import { appApi } from "../../api/api";
import MentorProfileDataForm from "../../components/forms/MentorProfileDataForm";
import { buildMentorPayload } from "../../util/mentor/payloadBuilder";
import Modal from "../../components/general/Modal"

const MentorProfilePage = () => {
    
    const { user } = useAuth();
    const role = user["custom:role"];
    const { data, loading, refetch } = useDashboardData(user);
    const [showEdit, setShowEdit] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
  
    if (loading) return <LoadingSpinner title="Profile" />;
  
    const initialData = {
        skills: data.mentor_skills?.map(s => s.skill) || [],
        expertise: data.mentor_expertise || [],
        communication_styles: data.mentor_communication_styles?.map(s => s.style) || [],
        languages: data.mentor_languages?.map(l => l.language) || [],
        availability: data.mentor_availability || []
      };
      
      const handleEditSubmit = async (formData) => {
        const mentorId = data?.mentors?.[0]?.mentor_id;
        if (!mentorId) return;
      
        const payload = buildMentorPayload(mentorId, formData, isEditing, initialData);
      
        try {
          const requestBody = { multiInsert: true, payload };
      
          if (isEditing) {
            await appApi.put("education/", requestBody);
          } else {
            await appApi.post("education/", requestBody);
          }
      
          setShowEdit(false);
          refetch();
        } catch (err) {
          console.error("Failed to submit profile data", err);
        }
      };
  
    return (
      <>
        <ProfileOverview role="mentor" data={data} onEdit={() => setShowEdit(true)} />
  
        <Modal isOpen={showEdit} onClose={() => setShowEdit(false)} title="Edit Profile">
        <div className="mb-4">
    <label className="inline-flex items-center space-x-2">
      <input
        type="checkbox"
        checked={isEditing}
        onChange={() => setIsEditing(prev => !prev)}
        className="form-checkbox text-purple-600"
      />
      <span className="text-sm text-gray-700">Update existing data</span>
    </label>
  </div>
          <MentorProfileDataForm
            role="mentor"
            initialData={{
              skills: data.mentor_skills?.map(s => s.skill) || [],
              expertise: data.mentor_expertise || [],
              communication_styles: data.mentor_communication_styles?.map(s => s.style) || [],
              languages: data.mentor_languages?.map(l => l.language) || [],
              availability: data.mentor_availability || []
            }}
            onSubmit={handleEditSubmit}
            onCancel={() => setShowEdit(false)}
          />
        </Modal>
      </>
    );
  };
  
  export default MentorProfilePage;

import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import useDashboardData from "../../../hooks/useDashboardData";
import { buildMentorPayload } from "../../../util/mentor/payloadBuilder";
import { appApi } from "../../../api/api";
import MentorProfileDataForm from "../../../components/forms/MentorProfileDataForm";

const MentorOnboarding = () => {
  const { user } = useAuth();
  const { data } = useDashboardData(user);
  const Navigate = useNavigate();

  const handleSubmit = async (formData) => {
    const mentorId = data?.mentors?.[0]?.mentor_id;
    if (!mentorId) {
      console.error("Mentor ID not found.");
      return;
    }

    const payload = buildMentorPayload(mentorId, formData);
    try {
      await appApi.post("education/", {
        multiInsert: true,
        payload,
      });
      Navigate("/dashboard");
    } catch (err) {
      console.error("Submission error:", err.response?.data || err.message);
    }
  };

  return (
    <MentorProfileDataForm
      role="mentor"
      initialData={{
        skills: [""],
        expertise: [{ topic_area: "", area_of_expertise: "" }],
        communication_styles: [""],
        languages: [""],
        availability: [{ day: "", time_slot: "" }],
      }}
      onSubmit={handleSubmit}
      onCancel={() => Navigate("/dashboard")}
    />
  );
};

export default MentorOnboarding;

import React, { useState } from "react";
import OnboardingForm from "../../../components/forms/StudentOnboarding";
import CourseSuitabilityForm from "../../../components/forms/CourseSuitablitiy";
import { useNavigate } from "react-router-dom";

export default function OnboardingPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    wantsMentor: true,
    wantsCourses: true,
    mentorData: {},
    courseData: {},
  });

  const navigate = useNavigate();

  const handleCheckboxChange = (field) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleNext = () => setStep((prev) => prev + 1);
  const handleBack = () => setStep((prev) => prev - 1);

  const handleMentorSubmit = async (mentorData) => {
    setFormData((prev) => ({ ...prev, mentorData }));
    if (formData.wantsCourses) {
      handleNext();
    } else {
      navigate("/dashboard");
    }
  };

  const handleCourseSubmit = async (courseData) => {
    setFormData((prev) => ({ ...prev, courseData }));
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl space-y-4">
        {step === 1 && (
          <>
            <h2 className="text-xl font-semibold mb-4">Welcome! What are you looking for?</h2>
            <div className="flex flex-col gap-3">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.wantsMentor}
                  onChange={() => handleCheckboxChange("wantsMentor")}
                />
                I want to be matched with a mentor
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={formData.wantsCourses}
                  onChange={() => handleCheckboxChange("wantsCourses")}
                />
                I want course recommendations
              </label>
            </div>
            <button
              className="mt-4 bg-blue-500 text-white px-4 py-2 rounded"
              onClick={handleNext}
            >
              Continue
            </button>
          </>
        )}

        {step === 2 && formData.wantsMentor && (
          <OnboardingForm
            both={formData.wantsCourses}
            onSubmit={handleMentorSubmit}
            onBack={handleBack}
          />
        )}

        {((step === 2 && !formData.wantsMentor) || (step === 3 && formData.wantsCourses)) && (
          <CourseSuitabilityForm
            onSubmit={handleCourseSubmit}
            onBack={formData.wantsMentor ? handleBack : null}
          />
        )}
      </div>
    </div>
  );
}

import React, { useState, useEffect } from "react";
import OnboardingForm from "../../../components/forms/StudentOnboarding";
import CourseSuitabilityForm from "../../../components/forms/CourseSuitablitiy";
import { useNavigate, useLocation } from "react-router-dom";
import useDashboardData from "../../../hooks/useDashboardData";
import Alert from "../../../components/general/Alert";

export default function OnboardingPage() {
  const { data, loading } = useDashboardData();
  const [alertMessage, setAlertMessage] = useState("");
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    wantsMentor: false,
    wantsCourses: false,
    wantsOrganizerOnly: false,
    mentorData: {},
    courseData: {},
  });

  const navigate = useNavigate();
  const location = useLocation();

  const handleCheckboxChange = (field) => {
    setFormData((prev) => ({ ...prev, [field]: !prev[field] }));
  };

  const handleNext = () => {
    if (formData.wantsOrganizerOnly && (formData.wantsMentor || formData.wantsCourses)) {
      setAlertMessage(
        "You selected both 'Organiser' and forms. Please pick either 'Organiser' or continue with the forms."
      );

      return;
    }

    if (formData.wantsOrganizerOnly) {
      navigate("/dashboard");
    } else {
      setStep((prev) => prev + 1);
    }
  }

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

  useEffect(() => {
    if (location.state?.continueToCourses) {
      setFormData((prev) => ({ ...prev, wantsCourses: true, wantsMentor: false }));
      setStep(3);
    }
  }, [location.state]);




  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-100 flex items-center justify-center p-6">
      <div className="bg-white rounded-3xl shadow-xl p-8 w-full max-w-2xl space-y-6">
        <Alert message={alertMessage} onClose={() => setAlertMessage("")} />
        {step === 1 && (
          <>
            <h2 className="text-3xl font-extrabold text-purple-700 mb-6 text-center">Welcome!</h2>
            <p className="text-center text-gray-600 mb-8">What would you like help with?</p>

            <div className="flex flex-col gap-4">
              <label className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border hover:border-purple-400 transition">
                <input
                  type="checkbox"
                  checked={formData.wantsMentor}
                  onChange={() => handleCheckboxChange("wantsMentor")}
                  className="h-5 w-5 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-800 font-medium">I want to be matched with a mentor</span>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border hover:border-purple-400 transition">
                <input
                  type="checkbox"
                  checked={formData.wantsCourses}
                  onChange={() => handleCheckboxChange("wantsCourses")}
                  className="h-5 w-5 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-800 font-medium">I want course recommendations</span>
              </label>

              <label className="flex items-center gap-3 p-4 rounded-xl bg-gray-50 border hover:border-purple-400 transition">
                <input
                  type="checkbox"
                  checked={formData.wantsOrganizerOnly}
                  onChange={() => handleCheckboxChange("wantsOrganizerOnly")}
                  className="h-5 w-5 text-purple-600 focus:ring-purple-500"
                />
                <span className="text-gray-800 font-medium">I just want to organise my work</span>
              </label>
            </div>

            <button
              className="mt-8 w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 rounded-xl transition"
              onClick={handleNext}
            >
              Continue
            </button>
          </>
        )}

        {step === 2 && formData.wantsMentor && (
          <OnboardingForm both={formData.wantsCourses} onSubmit={handleMentorSubmit} onBack={handleBack} />
        )}

        {((step === 2 && !formData.wantsMentor) || (step === 3 && formData.wantsCourses)) && (
          <CourseSuitabilityForm
            studentId={data?.students?.[0]?.student_id}
            onSubmit={handleCourseSubmit}
            onBack={formData.wantsMentor ? handleBack : null}
          />
        )}


      </div>
    </div>
  );
}

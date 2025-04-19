import React, { useState } from "react";
import OnboardingForm from "../../../components/forms/StudentOnboarding";

export default function OnboardingPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl">
        <OnboardingForm />
      </div>
    </div>
  );
}

import React from "react";
import ClientOnboardingForm from "../../../components/forms/ClientOnboardingForm";

export default function ClientOnboarding() {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-5">
      <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-2xl">
        <ClientOnboardingForm />
      </div>
    </div>
  )
}
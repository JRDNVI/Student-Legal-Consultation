import React from "react";

export default function LoadingSpinner({ title = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 space-y-4">
      <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-gray-600 font-medium text-sm">{title}</p>
    </div>
  );
}

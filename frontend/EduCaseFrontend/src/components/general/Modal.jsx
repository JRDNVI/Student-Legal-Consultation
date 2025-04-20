import React from "react";

export default function Modal({ isOpen, onClose, children, title }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-y-auto p-6 relative">
        <h2 className="text-xl font-bold mb-4">{title}</h2>
        <button className="absolute top-4 right-4 text-gray-500 hover:text-black" onClick={onClose}>✕</button>
        {children}
      </div>
    </div>
  );
}

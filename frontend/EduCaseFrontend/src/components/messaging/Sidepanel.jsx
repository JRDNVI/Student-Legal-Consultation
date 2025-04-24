import React from "react";
import { FaTimes } from "react-icons/fa";

export default function SidePanel({ isOpen, onClose, title, children }) {
  return (
    <div
      className={`fixed inset-0 z-50 flex transition-transform duration-300 
        ${isOpen ? "translate-x-0" : "translate-x-full"}`
      }
    >
      <div
        className="fixed inset-0 bg-black bg-opacity-20"
        onClick={onClose}
      />

      <div className="ml-auto w-full max-w-md bg-white h-full shadow-lg p-6 relative z-50">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            <FaTimes />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

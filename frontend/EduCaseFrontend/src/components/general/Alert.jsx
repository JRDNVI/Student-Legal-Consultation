import React from "react";

export default function Alert({ message, onClose }) {
    if (!message) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 shadow-lg w-80 text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Warning</h2>
                <p className="text-gray-600 mb-6">{message}</p>
                <button
                    onClick={onClose}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-md transition"
                >
                    OK
                </button>
            </div>
        </div>
    );
}

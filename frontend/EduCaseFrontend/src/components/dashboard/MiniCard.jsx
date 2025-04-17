import React from "react";

export default function MiniCard({ item, fields }) {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-200">
      {fields.map((field) => (
        item[field] !== undefined && (
          <p key={field} className="text-sm text-gray-700 truncate">
            <strong className="capitalize">{field.replace("_", " ")}:</strong>{" "}
            {typeof item[field] === "string" && item[field].includes("T") 
            ? item[field].slice(0, 10) 
            : String(item[field])}
          </p>
        )
      ))}
    </div>
  );
}

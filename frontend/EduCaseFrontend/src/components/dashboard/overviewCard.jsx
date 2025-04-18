import React from "react";
import MiniCard from "./MiniCard";

// The OverviewSection is a reusable component that displays different sections of the dashboard based on the user's role.

export default function OverviewSection({ title, data, icon, role }) {
  const fieldMap = {
    student: {
      assignments: ["title", "status", "due_date"],
      tasks: ["title", "completed", "deadline"],
      meetings: ["timeslot", "status"],
    },
    mentor: {
      tasks: ["title", "deadline", "completed"],
      assignments: ["title", "status", "due_date"],
      meetings: ["timeslot", "status"],
    },
    solicitor: {
      cases: ["status", "total_billing", "created_at"],
      tasks: ["title", "due_date", "completed"],
      notes: ["note_name", "note_type", "creation_date"],
      billing: ["billing_status", "amount_due", "billing_date"],
    },
    client: {
      cases: ["status", "total_billing", "created_at"],
      tasks: ["title", "due_date", "completed"],
      notes: ["note_name", "note_type", "creation_date"],
      billing: ["billing_status", "amount_due", "billing_date"],
    },
  };
  
  const lowerTitle = title.toLowerCase();
  const fieldsToShow = fieldMap[role]?.[lowerTitle] || [];

  return (
    <div className="bg-white rounded-xl shadow p-5 w-full overflow-x-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-gray-700 text-lg font-semibold">{title}</h3>
        <div className="text-purple-600 text-2xl">{icon}</div>
      </div>

      {data && data.length > 0 ? (
        <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-gray-300 snap-x snap-mandatory">
        {data.map((item, index) => (
          <div className="snap-start min-w-[250px]">
            <MiniCard key={index} item={item} fields={fieldsToShow} />
          </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-400 italic">No {title.toLowerCase()} available.</p>
      )}
    </div>
  );
}

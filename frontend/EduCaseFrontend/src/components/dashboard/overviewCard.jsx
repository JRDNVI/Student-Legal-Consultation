import React from "react";
import MiniCard from "./MiniCard";
import { fieldMap } from "../../util/appMapping";

// The OverviewSection is a reusable component that displays different sections of the dashboard based on the user's role.

export default function OverviewSection({ title, data, icon, role }) {
  
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
        {data
        .filter((item) => item.status !== "available") 
        .map((item, index) => (
          <div className="snap-start min-w-[250px]" key={index}>
            <MiniCard item={item} fields={fieldsToShow} />
          </div>
        ))}
        </div>
      ) : (
        <p className="text-gray-400 italic">No {title.toLowerCase()} available.</p>
      )}
    </div>
  );
}

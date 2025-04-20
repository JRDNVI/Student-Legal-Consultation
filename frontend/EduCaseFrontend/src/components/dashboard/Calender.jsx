import React, { useState } from "react";
import dayjs from "dayjs";

// This calender is based of this example https://medium.com/%40kapaak/custom-calendar-with-react-and-dayjs-dcdbba89e577
// Allowed the ability to click on a day, currently added for mentors to add meetings
export default function Calendar({ events = [], onDateClick }) {
  const [currentDate, setCurrentDate] = useState(dayjs());

  const startOfMonth = currentDate.startOf("month").startOf("week");
  const endOfMonth = currentDate.endOf("month").endOf("week");

  const days = [];
  let day = startOfMonth;

  while (day.isBefore(endOfMonth)) {
    for (let i = 0; i < 7; i++) {
      days.push(day);
      day = day.add(1, "day");
    }
  }

  const handlePrevMonth = () => setCurrentDate(currentDate.subtract(1, "month"));
  const handleNextMonth = () => setCurrentDate(currentDate.add(1, "month"));

  return (
    <div className="bg-white rounded-xl shadow p-5 w-full">
      <div className="flex justify-between items-center mb-4">
        <button onClick={handlePrevMonth}>←</button>
        <h2 className="font-bold text-lg">{currentDate.format("MMMM YYYY")}</h2>
        <button onClick={handleNextMonth}>→</button>
      </div>

      <div className="grid grid-cols-7 gap-2 text-sm text-center">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="font-semibold text-gray-500">{d}</div>
        ))}

        {days.map((date, index) => {
          const eventOnDay = events.filter((e) =>
            dayjs(e.date).isSame(date, "day")
          );

          return (
            <div
              key={index}
              onClick={() => onDateClick(date)}
              className={`relative flex flex-col items-start justify-start min-h-[50px] p-2 rounded-lg border border-gray-200 overflow-hidden ${
                date.isSame(dayjs(), "day")
                  ? "bg-purple-100 text-purple-700"
                  : "text-gray-700 bg-white"
              }`}
            >
              <div className="text-sm font-semibold">{date.date()}</div>

              {eventOnDay.length > 0 && (
                <div className="mt-1 space-y-1">
                  {eventOnDay.slice(0, 2).map((event, i) => (
                    <div
                      key={i}
                      className={`text-[10px] px-1 py-0.5 rounded-full truncate font-medium text-white ${
                        event.type === "assignment"
                          ? "bg-blue-500"
                          : "bg-purple-500"
                      }`}
                    >
                      {event.title}
                    </div>
                  ))}

                  {eventOnDay.length > 2 && (
                    <div className="text-[10px] text-gray-400">
                      +{eventOnDay.length - 2} more
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

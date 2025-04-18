import React from "react";
import { useAuth } from "../../context/AuthContext";
import { FaTasks, FaUserGraduate, FaCalendarAlt, FaBriefcase } from "react-icons/fa";
import Sidebar from "../../components/dashboard/sidebar";
import OverviewCard from "../../components/dashboard/OverviewCard";
import Calendar from "../../components/dashboard/Calender";
import LoadingSpinner from "../../components/general/LoadingSpinner";
import useDashboardData from "../../hooks/useDashboardData";

// The dashbaord page was designed to work with any role.
// The user data is fetched using useDashboardData hook, which is a  hook that fetches the data from the API.
// The data and role is then passed to the OverviewCard component, the role determines which data to show on the card. 
// The events are built by checking if a date is present in the data, if it is, it is added to the events array.


export default function Dashboard() {
  const { user } = useAuth();
  const role = user["custom:role"];

  const { data, loading, refetch } = useDashboardData(user);

  if (loading) return <LoadingSpinner title="Loading your dashboard..." />;

  const calendarSources = [
    { key: "assignments", emoji: "📘", dateField: "due_date" },
    { key: "meetings", emoji: "📅", dateField: "timeslot" },
    { key: "tasks", emoji: "✅", dateField: "due_date" },
    { key: "event", emoji: "⚖️", dateField: "due_date" },
  ];

  const calendarEvents = calendarSources.flatMap(({ key, emoji, dateField }) =>
    Array.isArray(data[key])
      ? data[key].map((item) => ({
          title: `${emoji} ${item.title || key}`,
          date: item[dateField]?.split("T")[0],
        }))
      : []
  );

  return (
    <div className="flex">
      <Sidebar role={role} />
      <main className="flex-1 bg-gray-100 p-10 space-y-6">
        <OverviewCard
          title="Assignments"
          data={data.assignments}
          icon={<FaUserGraduate />}
          role={role}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {(role === "student" || role === "mentor") && (
            <>
              <OverviewCard
                title="Tasks"
                data={data.tasks_student}
                icon={<FaTasks />}
                role={role}
              />
              <OverviewCard
                title="Meetings"
                data={data.meetings}
                icon={<FaCalendarAlt />}
                role={role}
              />
            </>
          )}

          {(role === "client" || role === "solicitor") && (
            <>
              <OverviewCard
                title="Cases"
                data={data.cases}
                icon={<FaBriefcase />}
                role={role}
              />
              <OverviewCard
                title="Tasks"
                data={data.tasks}
                icon={<FaTasks />}
                role={role}
              />
            </>
          )}
        </div>

        {calendarEvents.length > 0 && (
          <div className="w-full">
            <Calendar events={calendarEvents} />
          </div>
        )}
      </main>
    </div>
  );
}

import React, { useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { FaTasks, FaUserGraduate, FaCalendarAlt, FaBriefcase } from "react-icons/fa";
import OverviewCard from "../../components/dashboard/overviewCard";
import Calendar from "../../components/dashboard/Calender";
import LoadingSpinner from "../../components/general/LoadingSpinner";
import useDashboardData from "../../hooks/useDashboardData";
import { useMessageHistory } from "../../hooks/messageHistory";
import SuggestedCoursesCard from "../../components/general/SuggestedCourseCard";

// The dashbaord page was designed to work with any role.
// The user data is fetched using useDashboardData hook, which is a  hook that fetches the data from the API.
// The data and role is then passed to the OverviewCard component, the role determines which data to show on the card. 
// The events are built by checking if a date is present in the data, if it is, it is added to the events array.

export default function Dashboard() {
  const { user } = useAuth();
  const role = user["custom:role"];

  const { data, loading, refetch } = useDashboardData();
  const { messages, loading: messageLoading } = useMessageHistory()

  useEffect(() => {
    refetch();
  }, []);

  if (loading || messageLoading) return <LoadingSpinner title="Loading your dashboard..." />;
  console.log("Dashboard Data:", data);

  console.log(messages)

  const calendarSources = [
    { key: "assignments", emoji: "📘", dateField: "due_date" },
    { key: "meetings", emoji: "📅", dateField: "timeslot" },
    { key: "tasks", emoji: "✅", dateField: "due_date" },
    { key: "event", emoji: "⚖️", dateField: "due_date" },
  ];

  const calendarEvents = calendarSources.flatMap(({ key, emoji, dateField }) =>
    Array.isArray(data[key])
      ? data[key]
        .filter((item) => item.status !== "available")
        .map((item) => ({
          title: `${emoji} ${item.title || key}`,
          date: item[dateField]?.split("T")[0],
        }))
      : []
  );

  return (
    <main className="space-y-6">
      {role === "student" && (
        <OverviewCard
          title="Assignments"
          data={data.assignments}
          icon={<FaUserGraduate />}
          role={role}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
              data={
                role === "client"
                  ? data.tasks?.filter((task) => task.recipient === "Client")
                  : data.tasks
              }
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
      {role === "student" && (
        <div className="w-full">
          <SuggestedCoursesCard courses={data.student_suggested_course} />
        </div>
      )}
    </main>
  );

}  

import React from "react";
import { useAuth } from "../../context/AuthContext";
import useDashboardData from "../../hooks/useDashboardData";
import LoadingSpinner from "../../components/general/LoadingSpinner";
import { appApi } from "../../api/api";

const StudentMeetings = () => {
  const { user } = useAuth();
  const { data, loading, refetch } = useDashboardData(user);
  const allMeetings = data.meetings || [];
  const studentId = data.students?.[0]?.student_id;

  const availableMeetings = allMeetings.filter(
    (m) => !m.student_id && m.status?.toLowerCase() === "available"
  );

  const bookedMeetings = allMeetings.filter(
    (m) => m.student_id === studentId
  );

  const onClickHandle = async (meeting_id) => {
    const payload = {
      tableName: "meetings",
      data: {
        student_id: studentId,
        status: "Confirmed",
      },
      where: {
        meeting_id: meeting_id,
      },
    };

    try {
      await appApi.put("education/", payload);
      alert("Meeting booked!");
      refetch();
    } catch (error) {
      console.error("Error booking meeting:", error);
      alert("Failed to book meeting.");
    }
  };

  if (loading) return <LoadingSpinner title="Meetings" />;

  return (
    <main className="space-y-8">
      <section>
        <h1 className="text-2xl font-bold text-purple-700 mb-4">Available Meetings</h1>
        {availableMeetings.length > 0 ? (
          <div className="space-y-4">
            {availableMeetings.map((meeting) => (
              <div
                key={meeting.meeting_id}
                className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row justify-between"
              >
                <div>
                  <p><span className="font-semibold">Time:</span> {new Date(meeting.timeslot).toLocaleString()}</p>
                  <p><span className="font-semibold">Status:</span> {meeting.status}</p>
                </div>
                <button
                  onClick={() => onClickHandle(meeting.meeting_id)}
                  className="bg-purple-500 text-white px-4 py-2 rounded mt-2 md:mt-0 md:ml-4"
                >
                  Accept
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 italic">No available meetings right now.</p>
        )}
      </section>

      <section>
        <h1 className="text-2xl font-bold text-purple-700 mb-4">Your Meetings</h1>
        {bookedMeetings.length > 0 ? (
          <div className="space-y-4">
            {bookedMeetings.map((meeting) => (
              <div
                key={meeting.meeting_id}
                className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row justify-between items-start md:items-center"
              >
                <div>
                  <p><span className="font-semibold">Time:</span> {new Date(meeting.timeslot).toLocaleString()}</p>
                  <p><span className="font-semibold">Status:</span> {meeting.status}</p>
                </div>
                <button
                  onClick={async () => {
                    const payload = {
                      tableName: "meetings",
                      data: {
                        student_id: null,
                        status: "available",
                      },
                      where: {
                        meeting_id: meeting.meeting_id,
                      },
                    };

                    try {
                      await appApi.put("education/", payload);
                      alert("Meeting canceled.");
                      refetch();
                    } catch (error) {
                      console.error("Error canceling meeting:", error);
                      alert("Failed to cancel meeting.");
                    }
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded mt-2 md:mt-0 md:ml-4"
                >
                  Cancel
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600 italic">You haven't booked any meetings yet.</p>
        )}
      </section>

    </main>
  );
};

export default StudentMeetings;

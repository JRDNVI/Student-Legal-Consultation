import React, { useState, useEffect } from "react";
import Calendar from "../../components/dashboard/Calender";
import Modal from "../../components/general/Modal";
import { appApi } from "../../api/api";
import useDashboardData from "../../hooks/useDashboardData"
import LoadingSpinner from "../../components/general/LoadingSpinner";
import dayjs from "dayjs";


const MentorCalendarPage = () => {
  const { data, loading, refetch } = useDashboardData();
  const mentorId = data?.mentors?.[0]?.mentor_id;
  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState("");
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    refetch();
  }, []);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setShowModal(true);
  };


  const fullDateTime = selectedDate?.format("YYYY-MM-DD") + "T" + timeSlot;


  const meetingEvents = (data.meetings || [])
    .filter(m => m.mentor_id === mentorId && m.status === "available")
    .map(m => ({
      date: m.timeslot,
      title: "Available Slot",
      type: "meeting"
    }));


  const handleSubmit = async () => {
    try {
      await appApi.post("education/", {
        tableName: "meetings",
        data: {
          mentor_id: mentorId,
          timeslot: fullDateTime,
          status: "available"
        }
      });
      setShowModal(false);
      refetch();
    } catch (err) {
      console.error(err);
      alert("Error adding availability");
    }
  };

  const handleCancelMeeting = async (meetingId) => {
    try {
      await appApi.delete("education/", {
        data: { tableName: "meetings", where: { meeting_id: meetingId } }
      });
      refetch();
    } catch (err) {
      console.error("Error cancelling meeting:", err);
    }
  }


  if (loading) return <LoadingSpinner title="Loading Calendar" />;

  return (

    <main className="space-y-8 bg-gray-50 min-h-screen">
      <Calendar onDateClick={handleDateClick} events={meetingEvents} />

      <section className="bg-white shadow-md rounded-xl p-6">
        <h2 className="text-xl font-semibold mb-4 text-purple-700">Your Booked Meetings</h2>

        {(data.meetings || [])
          .filter(m => m.mentor_id === mentorId && m.status === "Confirmed")
          .map((meeting) => {
            const student = (data.students || []).find(s => s.student_id === meeting.student_id);

            return (
              <div
                key={meeting.meeting_id}
                className="flex justify-between items-center border p-4 rounded-lg hover:bg-gray-50 transition"
              >
                <div>
                  <p className="font-medium">{dayjs(meeting.timeslot).format("MMMM D, YYYY [at] h:mm A")}</p>
                  <p className="text-sm text-gray-600">
                    {student ? student.name : "Unknown Student"}
                  </p>
                </div>
                <button
                  onClick={() => handleCancelMeeting(meeting.meeting_id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              </div>
            );
          })}
      </section>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={`Set Availability for ${selectedDate?.format("MMM D, YYYY")}`}
      >
        <div className="space-y-4">
          <input
            type="text"
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            placeholder="e.g. 10:00 - 11:00"
            className="w-full border rounded p-2"
          />
          <button
            onClick={handleSubmit}
            className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
          >
            Save Slot
          </button>
        </div>
      </Modal>
    </main>

  );
};


export default MentorCalendarPage;

import React, { useState } from "react";
import Calendar from "../../components/dashboard/Calender";
import Modal from "../../components/general/Modal";
import { appApi } from "../../api/api";
import Sidebar from "../../components/dashboard/sidebar"; // ✅ Import Sidebar
import { useAuth } from "../../context/AuthContext";
import  useDashboardData  from "../../hooks/useDashboardData"

const MentorCalendarPage = () => {
  const { user } = useAuth();
  const { data, loading } = useDashboardData(user);
  const mentorId = data?.mentors?.[0]?.mentor_id; // Adjust based on how you store IDs

  const [selectedDate, setSelectedDate] = useState(null);
  const [timeSlot, setTimeSlot] = useState("");
  const [showModal, setShowModal] = useState(false);

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
      alert("Availability added!");
    } catch (err) {
      console.error(err);
      alert("Error adding availability");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar role="mentor" />

      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold text-purple-700 mb-4">
          Mentor Availability Calendar
        </h1>

        <Calendar onDateClick={handleDateClick} events={meetingEvents} />

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
    </div>
  );
};

export default MentorCalendarPage;

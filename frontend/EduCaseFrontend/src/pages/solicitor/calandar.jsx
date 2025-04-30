import React, { useState, useEffect } from "react";
import Calendar from "../../components/dashboard/Calender";
import Modal from "../../components/general/Modal";
import useDashboardData from "../../hooks/useDashboardData";
import LoadingSpinner from "../../components/general/LoadingSpinner";
import AddCaseEventForm from "../../components/forms/AddCaseEvent";
import EventCard from "../../components/general/EventCard";

const SolicitorCalendarPage = () => {
    const { data, loading, refetch } = useDashboardData();
    const solicitorId = data?.solicitors?.[0]?.solicitor_id;

    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedCaseId, setSelectedCaseId] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [eventTitle, setEventTitle] = useState("");
    const [eventDescription, setEventDescription] = useState("");
    const [eventType, setEventType] = useState("General");
    const [timeSlot, setTimeSlot] = useState("");

    useEffect(() => {
        refetch();
    }, []);

    const solicitorCases = (data.cases || []).filter(c => c.solicitor_id === solicitorId);

    const handleDateClick = (date) => {
        if (!selectedCaseId) return alert("Please select a case first.");
        setSelectedDate(date);
        setShowModal(true);
    };

    const caseEventList = (data.case_events || [])
        .filter(e => parseInt(e.case_id) === parseInt(selectedCaseId))
        .map(e => ({
            date: e.start_time,
            title: e.title,
            description: e.description,
            event_type: e.event_type,
            created_by: e.created_by,
        }))


    console.log("Case Event List:", caseEventList);

    const availabilityList = (data.meetings || [])
        .filter(m => m.solicitor_id === solicitorId && m.status === "available")
        .map(m => ({
            date: m.timeslot,
            title: "Available Slot",
            type: "meeting"
        }));

    const allCalendarEvents = [...availabilityList, ...caseEventList];

    if (loading) return <LoadingSpinner title="Loading Calendar" />;

    return (
        <main className="space-y-8 bg-gray-50 min-h-screen">
            <div className="bg-white p-4 rounded-xl shadow flex flex-col gap-2">
                <label className="font-semibold text-purple-700 text-sm">Select Case:</label>
                <select
                    value={selectedCaseId}
                    onChange={(e) => setSelectedCaseId(e.target.value)}
                    className="border p-2 rounded"
                >
                    <option value="">-- Select Case --</option>
                    {solicitorCases.map((c) => (
                        <option key={c.case_id} value={c.case_id}>
                            Case #{c.case_id}
                        </option>
                    ))}
                </select>
            </div>

            <div className="bg-white p-4 rounded-xl shadow">
                <Calendar onDateClick={handleDateClick} events={allCalendarEvents} />
            </div>

            <Modal
                isOpen={showModal}
                onClose={() => setShowModal(false)}
                title={`Add Event on ${selectedDate?.format("MMM D, YYYY")}`}
            >
                <AddCaseEventForm
                    selectedDate={selectedDate}
                    selectedCaseId={selectedCaseId}
                    onClose={() => setShowModal(false)}
                    onEventAdded={refetch}
                />
            </Modal>
            {selectedCaseId && (
                <section className="bg-white p-6 rounded-xl shadow space-y-4">
                    <h2 className="text-xl font-semibold text-purple-700 mb-2">📅 Events for Case #{selectedCaseId}</h2>
                    {caseEventList.length === 0 ? (
                        <p className="text-gray-500 italic">No events for this case yet.</p>
                    ) : (
                        caseEventList.map((event, index) => (
                            <EventCard key={index} event={event} />
                        ))
                    )}
                </section>
            )}
        </main>
    );
};

export default SolicitorCalendarPage;

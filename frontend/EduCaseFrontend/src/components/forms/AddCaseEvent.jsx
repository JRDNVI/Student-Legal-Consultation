import React, { useState } from "react";
import { appApi } from "../../api/api";

const AddCaseEventForm = ({
    selectedDate,
    selectedCaseId,
    onClose,
    onEventAdded
}) => {
    const [eventData, setEventData] = useState({
        title: "",
        description: "",
        type: "General",
        time: ""
    });

    const handleSubmit = async () => {
        if (!eventData.title || !selectedCaseId || !eventData.time) {
            alert("Please fill out all fields");
            return;
        }

        try {
            await appApi.post("education/", {
                tableName: "case_events",
                data: {
                    case_id: selectedCaseId,
                    title: eventData.title,
                    description: eventData.description,
                    start_time: selectedDate?.format("YYYY-MM-DD") + "T" + eventData.time,
                    event_type: eventData.type,
                    created_by: "solicitor",
                },
            });




            onClose();
            onEventAdded();
            setEventData("")
        } catch (err) {
            console.error(err);
            alert("Failed to add event");
        }
    };

    return (
        <div className="space-y-4">
            <input
                type="text"
                value={eventData.time}
                onChange={(e) => setEventData({ ...eventData, time: e.target.value })}
                placeholder="Time (e.g. 13:00)"
                className="w-full border rounded p-2"
            />

            <input
                type="text"
                value={eventData.title}
                onChange={(e) => setEventData({ ...eventData, title: e.target.value })}
                placeholder="Event Title"
                className="w-full border rounded p-2"
            />

            <textarea
                value={eventData.description}
                onChange={(e) => setEventData({ ...eventData, description: e.target.value })}
                placeholder="Event Description"
                className="w-full border rounded p-2"
            />

            <select
                value={eventData.type}
                onChange={(e) => setEventData({ ...eventData, type: e.target.value })}
                className="w-full border rounded p-2"
            >
                <option value="General">General</option>
                <option value="Hearing">Hearing</option>
                <option value="Filing Deadline">Filing Deadline</option>
                <option value="Client Meeting">Client Meeting</option>
            </select>

            <button
                onClick={handleSubmit}
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
            >
                Save Event
            </button>
        </div>
    );
};

export default AddCaseEventForm;

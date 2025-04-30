import React from "react";
import dayjs from "dayjs";

const EventCard = ({ event }) => {
    return (
        <div className="border rounded-lg p-4 shadow-sm bg-white hover:shadow-md transition">
            <h3 className="text-lg font-semibold text-purple-700">
                {event.title} <span className="text-sm text-gray-500">({event.event_type})</span>
            </h3>
            <p className="text-gray-600 mt-1">{event.description}</p>
            <p className="text-sm text-gray-500 mt-2">
                Created by: {event.created_by} |{" "}
                {dayjs(event.date).format("MMM D, YYYY [at] h:mm A")}
            </p>
        </div>
    );
};

export default EventCard;

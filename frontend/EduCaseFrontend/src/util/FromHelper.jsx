import Select from "react-select";

export const updateArrayField = (formSetter, field, index, value, key) => {
    formSetter(prev => {
        const updated = [...prev[field]];
        key ? updated[index][key] = value : updated[index] = value;
        return { ...prev, [field]: updated };
    });
};

export const addToArrayField = (formSetter, field, newItem) => {
    formSetter(prev => ({ ...prev, [field]: [...prev[field], newItem] }));
};

export const removeFromArrayField = (formSetter, field, index) => {
    formSetter(prev => {
        const updated = [...prev[field]];
        updated.splice(index, 1);
        return { ...prev, [field]: updated };
    });
};

export const handleChange = (formSetter) => (e) => {
    const { name, value } = e.target;
    formSetter(prev => ({ ...prev, [name]: value }));
};

export const AvailabilityInput = ({ availability, onChange, onAdd, onRemove }) => (
    <div className="mb-4">
        <label className="block mb-1 font-medium">Availability</label>
        {availability.map((slot, index) => (
            <div key={index} className="flex gap-2 items-center mb-2">
                <select
                    value={slot.day}
                    onChange={(e) => onChange(index, "day", e.target.value)}
                    className="border border-gray-300 rounded-xl p-2"
                >
                    <option value="">Day</option>
                    {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                        <option key={day} value={day}>{day}</option>
                    ))}
                </select>
                <input
                    type="text"
                    value={slot.time_slot}
                    onChange={(e) => onChange(index, "time_slot", e.target.value)}
                    placeholder="Time Slot (e.g., 10:00-12:00)"
                    className="flex-1 border border-gray-300 rounded-xl p-2"
                />
                <button
                    type="button"
                    onClick={() => onRemove(index)}
                    className="text-red-500 text-sm hover:underline"
                >
                    ✕
                </button>
            </div>
        ))}
        <button
            type="button"
            onClick={onAdd}
            className="text-sm text-blue-600 hover:underline"
        >
            + Add Availability
        </button>
    </div>
);


export const CommunicationStyle = ({ value, onChange, name }) => (
    <div className="mb-4">
        <label className="block mb-1 font-medium">Preferred Communication Style</label>
        <select
            name={name}
            value={value}
            onChange={onChange}
            required
            className="w-full p-2 border rounded-xl"
        >
            <option value="">Preferred Communication Style</option>
            <option value="Email">Email</option>
            <option value="Phone Call">Phone Call</option>
            <option value="Video Call">Video Call</option>
        </select>
    </div>
);

export const SubmitButton = () => (
    <div className="flex justify-end mt-6">
        <button
            type="submit"
            className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition"
        >
            Submit
        </button>
    </div>
);



export const TopicAreaSelector = ({ topicOptions, selectedTopicArea, selectedAreaOfStudy, setSelectedTopicArea, setSelectedAreaOfStudy }) => (
    <>
        <div className="mb-4">
            <label className="block mb-1 font-medium">Topic Area</label>
            <Select
                options={topicOptions.map(group => ({ value: group.label, label: group.label }))}
                value={selectedTopicArea}
                onChange={(selected) => {
                    setSelectedTopicArea(selected);
                    setSelectedAreaOfStudy(null);
                }}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder="Select a Topic Area"
            />
        </div>

        <div className="mb-4">
            <label className="block mb-1 font-medium">Area of Study</label>
            <Select
                options={
                    selectedTopicArea
                        ? topicOptions.find(group => group.label === selectedTopicArea.value)?.options || []
                        : []
                }
                value={selectedAreaOfStudy}
                onChange={(selected) => setSelectedAreaOfStudy(selected)}
                isDisabled={!selectedTopicArea}
                className="react-select-container"
                classNamePrefix="react-select"
                placeholder={selectedTopicArea ? "Select an Area of Study" : "Select a Topic First"}
            />
        </div>
    </>
);

export const buildMultiInsertPayload = (insertions) => {
    const payload = insertions.flatMap(({ tableName, items }) =>
        items
            .filter(item => item && Object.values(item).every(v => v !== ""))
            .map(item => ({
                tableName,
                data: item,
            }))
    );

    return { multiInsert: true, payload };
};




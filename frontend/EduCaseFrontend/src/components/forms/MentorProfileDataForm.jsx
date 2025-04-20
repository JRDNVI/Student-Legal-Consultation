import React, { useState, useEffect } from "react";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const expertiseOptions = {
  "Computer Science": ["AI", "Machine Learning", "Web Development"],
  "Cybersecurity": ["Pen Testing", "Network Security"],
};


// Doesn't work needs complete refactoring
// https://flowbite.com/docs/components/forms/ was used to design the form.
// Again used the site above and previous froms to make this. It was a mistake, need to rework. 
export default function MentorProfileDataForm({ role, initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({});

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const updateArrayField = (field, index, value, key) => {
    const updated = [...form[field]];
    if (key) updated[index][key] = value;
    else updated[index] = value;
    setForm(prev => ({ ...prev, [field]: updated }));
  };

  const addToArrayField = (field, newItem) => {
    setForm(prev => ({ ...prev, [field]: [...(prev[field] || []), newItem] }));
  };

  const removeFromArrayField = (field, index) => {
    const updated = [...form[field]];
    updated.splice(index, 1);
    setForm(prev => ({ ...prev, [field]: updated }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-8"
    >
      <h1 className="text-3xl font-bold text-purple-700">Edit Mentor Profile</h1>

      <div>
        <h2 className="text-xl font-semibold mb-2">🛠 Skills</h2>
        {(form.skills || []).map((skill, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={skill}
              onChange={(e) => updateArrayField("skills", index, e.target.value)}
              placeholder={`Skill ${index + 1}`}
              className="flex-1 border rounded-xl p-2"
            />
            {form.skills.length > 1 && (
              <button
                type="button"
                onClick={() => removeFromArrayField("skills", index)}
                className="text-red-500 text-sm hover:underline"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addToArrayField("skills", "")}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add Skill
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">🎯 Expertise</h2>
        {(form.expertise || []).map((item, index) => (
          <div key={index} className="flex flex-col md:flex-row gap-2 mb-2">
            <select
              value={item.topic_area}
              onChange={(e) => updateArrayField("expertise", index, e.target.value, "topic_area")}
              className="w-full border rounded-xl p-2"
            >
              <option value="">Select Topic Area</option>
              {Object.keys(expertiseOptions).map((area) => (
                <option key={area} value={area}>{area}</option>
              ))}
            </select>

            <select
              value={item.area_of_expertise}
              onChange={(e) => updateArrayField("expertise", index, e.target.value, "area_of_expertise")}
              className="w-full border rounded-xl p-2"
              disabled={!item.topic_area}
            >
              <option value="">Select Area of Expertise</option>
              {(expertiseOptions[item.topic_area] || []).map((exp) => (
                <option key={exp} value={exp}>{exp}</option>
              ))}
            </select>

            {form.expertise.length > 1 && (
              <button
                type="button"
                onClick={() => removeFromArrayField("expertise", index)}
                className="text-red-500 text-sm hover:underline"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addToArrayField("expertise", { topic_area: "", area_of_expertise: "" })}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add Expertise
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">🌐 Languages</h2>
        {(form.languages || []).map((lang, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={lang}
              onChange={(e) => updateArrayField("languages", index, e.target.value)}
              placeholder={`Language ${index + 1}`}
              className="flex-1 border rounded-xl p-2"
            />
            {form.languages.length > 1 && (
              <button
                type="button"
                onClick={() => removeFromArrayField("languages", index)}
                className="text-red-500 text-sm hover:underline"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addToArrayField("languages", "")}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add Language
        </button>
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">🗣 Communication Styles</h2>
        {(form.communication_styles || []).map((style, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <input
              type="text"
              value={style}
              onChange={(e) => updateArrayField("communication_styles", index, e.target.value)}
              placeholder={`Style ${index + 1}`}
              className="flex-1 border rounded-xl p-2"
            />
            {form.communication_styles.length > 1 && (
              <button
                type="button"
                onClick={() => removeFromArrayField("communication_styles", index)}
                className="text-red-500 text-sm hover:underline"
              >
                ✕
              </button>
            )}
          </div>
        ))}
        <button
          type="button"
          onClick={() => addToArrayField("communication_styles", "")}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add Style
        </button>
      </div>
    
      <div>
        <h2 className="text-xl font-semibold mb-2">📅 Availability</h2>
        {(form.availability || []).map((slot, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <select
              value={slot.day}
              onChange={(e) => updateArrayField("availability", index, e.target.value, "day")}
              className="border rounded-xl p-2"
            >
              <option value="">Day</option>
              {daysOfWeek.map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <input
              type="text"
              value={slot.time_slot}
              onChange={(e) =>
                updateArrayField("availability", index, e.target.value, "time_slot")
              }
              placeholder="Time Slot (e.g. 09:00-12:00)"
              className="flex-1 border rounded-xl p-2"
            />
            <button
              type="button"
              onClick={() => removeFromArrayField("availability", index)}
              className="text-red-500 text-sm hover:underline"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addToArrayField("availability", { day: "", time_slot: "" })}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add Availability
        </button>
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <button type="button" onClick={onCancel} className="text-gray-600">Cancel</button>
        <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition">Save</button>
      </div>
    </form>
  );
}

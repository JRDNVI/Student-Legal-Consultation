import React, { useState } from "react";
import { appApi } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import useDashboardData from "../../hooks/useDashboardData";
import { useNavigate } from "react-router-dom";

const topicOptions = {
  "Computer Science": ["AI", "Machine Learning", "Web Development", "Natural Language Processing"],
  "Software Engineering": ["DevOps", "Backend Development", "Frontend Development"],
  "Cybersecurity": ["Pen Testing", "Network Security"]
};

const StudentOnboarding = () => {
  const { user } = useAuth();
  const { data, loading, refetch } = useDashboardData(user);
  const [topicArea, setTopicArea] = useState("");
  const [form, setForm] = useState({
    area_of_study: "",
    communication_style: "",
    language: "",
    interests: [""],
    availability: []
  });
  const Navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateArrayField = (field, index, value, key) => {
    setForm((prev) => {
      const updated = [...prev[field]];
      if (key) {
        updated[index][key] = value;
      } else {
        updated[index] = value;
      }
      return { ...prev, [field]: updated };
    });
  };

  const addToArrayField = (field, newItem) => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], newItem] }));
  };

  const removeFromArrayField = (field, index) => {
    setForm((prev) => {
      const updated = [...prev[field]];
      updated.splice(index, 1);
      return { ...prev, [field]: updated };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const studentId = data.students[0].student_id;

    const payload = [
      {
        tableName: "student_preferences",
        data: {
          student_id: studentId,
          area_of_study: form.area_of_study,
          communication_style: form.communication_style,
          language: form.language
        }
      },
      ...form.interests
        .filter((i) => i.trim())
        .map((interest) => ({
          tableName: "student_interests",
          data: { student_id: studentId, interest }
        })),
      ...form.availability
        .filter(a => a.day && a.time_slot)
        .map((a) => ({
          tableName: "student_availability",
          data: { student_id: studentId, day: a.day, time_slot: a.time_slot }
        }))
    ];

    const requestBody = {
      multiInsert: true,
      payload
    };

    try {
      await appApi.post("education/", requestBody);
      Navigate("/meet-mentor");
    } catch (err) {
      console.error("❌ Error submitting onboarding form:", err.response?.data || err.message);
    }
  };

  // https://flowbite.com/docs/components/forms/ 
  // All Tailwind CSS was picked from the above site. 
  return (
    <form onSubmit={handleSubmit}
      className="bg-white shadow-xl rounded-2xl p-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold text-purple-700">Student Onboarding</h1>

      <div>
        <label className="block mb-1 font-medium">Topic Area</label>
        <select value={topicArea} onChange={(e) => {
            setTopicArea(e.target.value);
            setForm((prev) => ({ ...prev, area_of_study: "" }));
          }}
          className="w-full border border-gray-300 rounded-xl p-2"
          required>
            
          <option value="">Select a Topic</option>
          {Object.keys(topicOptions).map((topic) => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Area of Study</label>
        <select name="area_of_study" value={form.area_of_study} onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-2"
          required>

          <option value="">Select an Area</option>
          {(topicOptions[topicArea] || []).map((aos) => (
            <option key={aos} value={aos}>{aos}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Preferred Communication Style</label>
        <select name="communication_style" value={form.communication_style} onChange={handleChange}
          className="w-full border border-gray-300 rounded-xl p-2" required>
          <option value="">Select</option>
          <option value="Email">Email</option>
          <option value="Video Call">Video Call</option>
          <option value="Text">Text</option>
        </select>
      </div>

      <div>
        <label className="block mb-1 font-medium">Preferred Language(s)</label>
        <input name="language" value={form.language} onChange={handleChange} className="w-full border border-gray-300 rounded-xl p-2"
          placeholder="e.g., English, Spanish" required/>
      </div>

      <div>
        <label className="block mb-1 font-medium">Interests</label>
        {form.interests.map((interest, index) => (
          <div key={index} className="flex gap-2 items-center mb-2">
            <input value={interest} onChange={(e) => updateArrayField("interests", index, e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-2"
              placeholder={`Interest ${index + 1}`}/>
            {form.interests.length > 1 && (
              <button type="button" onClick={() => removeFromArrayField("interests", index)}
                className="text-red-500 text-sm hover:underline"> Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addToArrayField("interests", "")}
          className="text-sm text-blue-600 hover:underline"> + Add Another Interest
        </button>
      </div>

      <div>
        <label className="block mb-1 font-medium">Availability</label>
        {form.availability.map((entry, index) => (

          <div key={index} className="flex gap-2 items-center mb-2">
            <select value={entry.day} onChange={(e) => updateArrayField("availability", index, e.target.value, "day")}
              className="border border-gray-300 rounded-xl p-2">
              <option value="">Day</option>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>

            <input type="text" placeholder="Time Slot (e.g. 10:00-12:00)" value={entry.time_slot}
              onChange={(e) => updateArrayField("availability", index, e.target.value, "time_slot")}
              className="flex-1 border border-gray-300 rounded-xl p-2"/>

            <button type="button" onClick={() => removeFromArrayField("availability", index)}
              className="text-red-500 text-sm hover:underline"> ✕
            </button>
          </div>
        ))}

        <button
          type="button" onClick={() => addToArrayField("availability", { day: "", time_slot: "" })}
          className="text-sm text-blue-600 hover:underline"> + Add Availability
        </button>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700 transition">
          Submit
        </button>
      </div>
    </form>
  );
};

export default StudentOnboarding;
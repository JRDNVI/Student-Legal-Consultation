import React, { useState } from "react";
import { appApi } from "../../api/api";
import useDashboardData from "../../hooks/useDashboardData";
import { useNavigate } from "react-router-dom";
import { topicOptions } from "../../util/student/courseMappings";
import { SubmitButton, buildMultiInsertPayload, updateArrayField, TopicAreaSelector, addToArrayField, removeFromArrayField, handleChange, AvailabilityInput, CommunicationStyle } from "../../util/FromHelper";


const StudentOnboarding = ({ both }) => {
  const { data } = useDashboardData();
  const [selectedTopicArea, setSelectedTopicArea] = useState(null);
  const [selectedAreaOfStudy, setSelectedAreaOfStudy] = useState(null);

  const [form, setForm] = useState({
    name: "",
    area_of_study: "",
    communication_style: "",
    language: "",
    interests: [""],
    availability: []
  });

  const handleChangec = handleChange(setForm);
  const Navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const studentId = data.students[0].student_id;

    const requestBody = buildMultiInsertPayload([
      {
        tableName: "student_preferences",
        items: [{
          student_id: studentId,
          area_of_study: selectedAreaOfStudy?.value || "",
          communication_style: selectedTopicArea?.value || "",
          language: form.language,
        }],
      },
      {
        tableName: "student_interests",
        items: form.interests.map(interest => ({ student_id: studentId, interest })),
      },
      {
        tableName: "student_availability",
        items: form.availability.map(a => ({ student_id: studentId, day: a.day, time_slot: a.time_slot })),
      },
    ]);

    try {
      await appApi.post("education/", requestBody);
      await appApi.put("education/", {
        tableName: "students",
        data: {
          name: form.name,
        },
        where: {
          student_id: studentId
        },
      });
      Navigate("/meet-mentor", { state: { fullOnboarding: both } });
    } catch (err) {
      console.error("Error submitting onboarding form:", err.response?.data || err.message);
    }
  };

  // https://flowbite.com/docs/components/forms/ 
  // All Tailwind CSS was picked from the above site. 
  return (
    <form onSubmit={handleSubmit}>
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 shadow-sm mb-4">
        <h2 className="text-lg font-semibold text-purple-700 mb-1">Getting Started</h2>
        <p className="text-sm text-gray-600">
          Fill out your preferences so we can connect you with a mentor who suits your needs.
        </p>
      </div>
      <div className="mb-4">
        <label htmlFor="name" className="block mb-1 font-medium">Full Name</label>
        <input id="name" name="name" value={form.name} onChange={handleChangec} className="w-full border border-gray-300 rounded-xl p-2"
          placeholder="e.g., Jordan Coady" required />
      </div>

      <TopicAreaSelector
        topicOptions={topicOptions}
        selectedTopicArea={selectedTopicArea}
        selectedAreaOfStudy={selectedAreaOfStudy}
        setSelectedTopicArea={setSelectedTopicArea}
        setSelectedAreaOfStudy={setSelectedAreaOfStudy}
      />


      <div>
        <label className="block mb-1 font-medium">Preferred Language(s)</label>
        <input name="language" value={form.language} onChange={handleChangec} className="w-full border border-gray-300 rounded-xl p-2"
          placeholder="e.g., English, Spanish" required />
      </div>

      <div>
        <label className="block mb-1 font-medium">Interests</label>
        {form.interests.map((interest, index) => (
          <div key={index} className="flex gap-2 items-center mb-2">
            <input value={interest} onChange={(e) => updateArrayField(setForm, "interests", index, e.target.value)}
              className="w-full border border-gray-300 rounded-xl p-2"
              placeholder={`Interest ${index + 1}`} />
            {form.interests.length > 1 && (
              <button type="button" onClick={() => removeFromArrayField(setForm, "interests", index)}
                className="text-red-500 text-sm hover:underline"> Remove
              </button>
            )}
          </div>
        ))}

        <button type="button" onClick={() => addToArrayField(setForm, "interests", "")}
          className="text-sm text-blue-600 hover:underline"> + Add Another Interest
        </button>
      </div>

      <CommunicationStyle
        value={form.communication_style}
        name={"communication_style"}
        onChange={handleChangec}
      />

      <AvailabilityInput
        availability={form.availability}
        onChange={(index, field, value) => updateArrayField(setForm, "availability", index, value, field)}
        onAdd={() => addToArrayField(setForm, "availability", { day: "", time_slot: "" })}
        onRemove={(index) => removeFromArrayField(setForm, "availability", index)}
      />
      <SubmitButton />
    </form>

  );
};

export default StudentOnboarding;
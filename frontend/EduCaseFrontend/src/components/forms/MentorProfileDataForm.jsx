import React, { useState } from "react";
import { SubmitButton, updateArrayField, addToArrayField, removeFromArrayField, TopicAreaSelector, handleChange, AvailabilityInput, CommunicationStyle } from "../../util/FromHelper";
import { topicOptions } from "../../util/student/courseMappings";
import useDashboardData from "../../hooks/useDashboardData";
import { buildMultiInsertPayload } from "../../util/FromHelper";
import { appApi } from "../../api/api";
import { useNavigate } from "react-router-dom";

// Doesn't work needs complete refactoring
// https://flowbite.com/docs/components/forms/ was used to design the form.
// Again used the site above and previous froms to make this. It was a mistake, need to rework. 
export default function MentorProfileDataForm() {
  const { data } = useDashboardData();
  const [selectedTopicArea, setSelectedTopicArea] = useState(null);
  const [selectedAreaOfStudy, setSelectedAreaOfStudy] = useState(null);
  const Navigate = useNavigate();
  const [form, setForm] = useState({
    skills: [""],
    expertise: [{ topic_area: "", area_of_expertise: "" }],
    languages: [""],
    communication_styles: "",
    availability: [],
  });

  const handleChangec = handleChange(setForm);

  const handleSubmit = async (e) => {
    console.log("Form submitted:", form);
    e.preventDefault();

    const mentorId = data?.mentors?.[0]?.mentor_id;

    const requestBody = buildMultiInsertPayload([
      {
        tableName: "mentor_skills",
        items: form.skills.map(skill => ({ mentor_id: mentorId, skill })),
      },
      {
        tableName: "mentor_expertise",
        items: form.expertise.map(exp => ({
          mentor_id: mentorId,
          topic_area: exp.topic_area,
          area_of_expertise: exp.area_of_expertise,
        })),
      },
      {
        tableName: "mentor_languages",
        items: form.languages.map(language => ({ mentor_id: mentorId, language })),
      },
      {
        tableName: "mentor_communication_styles",
        items: form.communication_styles
          ? [{ mentor_id: mentorId, style: form.communication_styles }]
          : [],
      },
      {
        tableName: "mentor_availability",
        items: form.availability.map(a => ({ mentor_id: mentorId, day: a.day, time_slot: a.time_slot })),
      },
    ]);

    try {
      await appApi.post("education/", requestBody);
      await appApi.put("education/", {
        tableName: "mentors",
        data: { onboarded: 1 },
        where: { mentor_id: mentorId },
      });
      Navigate("/dashboard");
    } catch (err) {
      console.error("Error", err.response?.data || err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-2xl">
        <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 shadow-sm mb-4">
          <h2 className="text-lg font-semibold text-purple-700 mb-1">Getting Started</h2>
          <p className="text-sm text-gray-600">
            Fill out your profile details so we can connect you with students who suit your expertise.
          </p>
        </div>

        <TopicAreaSelector
          topicOptions={topicOptions}
          selectedTopicArea={selectedTopicArea}
          selectedAreaOfStudy={selectedAreaOfStudy}
          setSelectedTopicArea={(topic) => {
            setSelectedTopicArea(topic);
            setSelectedAreaOfStudy(null);
          }}
          setSelectedAreaOfStudy={(area) => {
            setSelectedAreaOfStudy(area);
            if (area) {
              addToArrayField(setForm, "expertise", {
                topic_area: selectedTopicArea?.value || "",
                area_of_expertise: area.value,
              });
            }
          }}
        />

        <div>
          <h2 className="text-xl font-semibold mb-2"> Skills</h2>
          {(form.skills || []).map((skill, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={skill}
                onChange={(e) => updateArrayField(setForm, "skills", index, e.target.value)}
                placeholder={`Skill ${index + 1}`}
                className="flex-1 border rounded-xl p-2"
              />
              {form.skills.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFromArrayField(setForm, "skills", index)}
                  className="text-red-500 text-sm hover:underline"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addToArrayField(setForm, "skills", "")}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add Skill
          </button>
        </div>
        <div>
          <label className="block mb-1 font-medium">Preferred Language(s)</label>
          {form.languages.map((language, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                value={language}
                onChange={(e) => updateArrayField(setForm, "languages", index, e.target.value)}
                placeholder={`Language ${index + 1}`}
                className="flex-1 border rounded-xl p-2"
                required
              />
              {form.languages.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeFromArrayField(setForm, "languages", index)}
                  className="text-red-500 text-sm hover:underline"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
          <button
            type="button"
            onClick={() => addToArrayField(setForm, "languages", "")}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add Language
          </button>
        </div>

        <div>
          <CommunicationStyle
            value={form.communication_styles}
            name={"communication_styles"}
            onChange={handleChangec}
          />
        </div>

        <div>
          <AvailabilityInput
            availability={form.availability}
            onChange={(index, field, value) => updateArrayField(setForm, "availability", index, value, field)}
            onAdd={() => addToArrayField(setForm, "availability", { day: "", time_slot: "" })}
            onRemove={(index) => removeFromArrayField(setForm, "availability", index)}
          />
        </div>

        <SubmitButton />
      </form>
    </div>
  );
}

import React, { useState } from "react";
import { appApi } from "../../../api/api";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useDashboardData from "../../../hooks/useDashboardData";

//When a solicitor first signs in they will have to complete this form so basic data needed
// for matching is added. Again the updateArray methods have to abstracted out. 
// I used past forms and Tailwind forms to create this. There is common code I can absract out.

const options = {
  communicationStyles: ["Email", "Phone Call", "Video Call", "Text"],
  specialisations: [
    "Family Law",
    "Immigration Law",
    "Employment Law",
    "Criminal Law",
    "Property Law",
    "Contract Law",
    "Human Rights Law"
  ]
};

const SolicitorOnboarding = () => {
  const { user } = useAuth();
  const { data } = useDashboardData(user)
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    experience_years: "",
    hourly_rate: "",
    languages: [""],
    communication_styles: [""],
    specialisations: [""],
    availability: []
  });

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const updateArrayField = (field, index, value, key) => {
    const updated = [...form[field]];
    key ? (updated[index][key] = value) : (updated[index] = value);
    setForm((prev) => ({ ...prev, [field]: updated }));
  };

  const addToArray = (field, newItem) =>
    setForm((prev) => ({ ...prev, [field]: [...prev[field], newItem] }));

  const removeFromArray = (field, index) =>
    setForm((prev) => {
      const updated = [...prev[field]];
      updated.splice(index, 1);
      return { ...prev, [field]: updated };
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const solicitorId = data?.solicitors?.[0].solicitor_id
    console.log(data)
    try {
      const { name, experience_years, hourly_rate } = form;

      const { data: solicitor } = await appApi.put("education/", {
        tableName: "solicitors",
        data: {
          name,
          experience_years,
          hourly_rate,
        }, 
        where: {
            cognito_id: user.sub
        }
      });


      const payload = [
        ...form.languages.map((language) => ({
          tableName: "solicitor_languages",
          data: { solicitor_id: solicitorId, language }
        })),
        ...form.communication_styles.map((style) => ({
          tableName: "solicitor_communication_styles",
          data: { solicitor_id: solicitorId, style }
        })),
        ...form.specialisations.map((specialization) => ({
          tableName: "solicitor_specialisations",
          data: { solicitor_id: solicitorId, specialization }
        })),
        ...form.availability
          .filter((a) => a.day && a.time_slot)
          .map((a) => ({
            tableName: "solicitor_availability",
            data: {
              solicitor_id: solicitorId,
              day_of_week: a.day,
              time_slot: a.time_slot
            }
          }))
      ];

      await appApi.post("education/", {
        multiInsert: true,
        payload
      });

      alert("Solicitor profile created successfully!");
      navigate("/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error submitting form");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white shadow rounded-xl space-y-4"
    >
      <h2 className="text-3xl font-bold text-purple-700">Solicitor Onboarding</h2>

      <input
        placeholder="Name"
        value={form.name}
        onChange={(e) => updateField("name", e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Years of Experience"
        value={form.experience_years}
        onChange={(e) => updateField("experience_years", e.target.value)}
        className="w-full p-2 border rounded"
        required
      />
      <input
        type="number"
        placeholder="Hourly Rate (€)"
        value={form.hourly_rate}
        onChange={(e) => updateField("hourly_rate", e.target.value)}
        className="w-full p-2 border rounded"
        required
      />

      {["languages", "communication_styles", "specialisations"].map((field) => (
        <div key={field}>
          <label className="font-semibold capitalize">{field.replace("_", " ")}</label>
          {form[field].map((val, index) => (
            <div key={index} className="flex gap-2 mb-2">
              {(field === "specialisations" || field === "communication_styles") ? (
                <select
                  value={val}
                  onChange={(e) => updateArrayField(field, index, e.target.value)}
                  className="w-full p-2 border rounded"
                >
                  <option value="">Select {field.slice(0, -1)}</option>
                  {options[
                    field === "specialisations" ? "specialisations" : "communicationStyles"
                  ].map((opt) => (
                    <option key={opt} value={opt}>{opt}</option>
                  ))}
                </select>
              ) : (
                <input
                  type="text"
                  value={val}
                  onChange={(e) => updateArrayField(field, index, e.target.value)}
                  placeholder={`Enter ${field.slice(0, -1)}`}
                  className="w-full p-2 border rounded"
                />
              )}
              <button
                type="button"
                onClick={() => removeFromArray(field, index)}
                className="text-red-500"
              >
                ✕
              </button>
            </div>
          ))}
          <button
            type="button"
            onClick={() => addToArray(field, "")}
            className="text-sm text-blue-600 hover:underline"
          >
            + Add {field.slice(0, -1)}
          </button>
        </div>
      ))}

      <div>
        <label className="font-semibold">Availability</label>
        {form.availability.map((slot, index) => (
          <div key={index} className="flex gap-2 items-center mb-2">
            <select
              value={slot.day}
              onChange={(e) => updateArrayField("availability", index, e.target.value, "day")}
              className="p-2 border rounded"
            >
              <option value="">Day</option>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Time slot (e.g. 10:00-12:00)"
              value={slot.time_slot}
              onChange={(e) => updateArrayField("availability", index, e.target.value, "time_slot")}
              className="flex-1 p-2 border rounded"
            />
            <button
              type="button"
              onClick={() => removeFromArray("availability", index)}
              className="text-red-500"
            >
              ✕
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => addToArray("availability", { day: "", time_slot: "" })}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add Availability
        </button>
      </div>

      <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700">
        Submit
      </button>
    </form>
  );
};

export default SolicitorOnboarding;

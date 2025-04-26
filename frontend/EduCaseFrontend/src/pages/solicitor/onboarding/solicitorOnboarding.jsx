import React, { useState } from "react";
import { appApi } from "../../../api/api";
import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import useDashboardData from "../../../hooks/useDashboardData";
import { SubmitButton, buildMultiInsertPayload, updateArrayField, addToArrayField, removeFromArrayField, AvailabilityInput } from "../../../util/FromHelper";
//When a solicitor first signs in they will have to complete this form so basic data needed
// for matching is added. Again the updateArray methods have to abstracted out. 
// I used past forms and Tailwind forms to create this. There is common code I can absract out.

const options = {
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
    languages: "",
    communication_styles: [""],
    specialisations: [""],
    availability: []
  });

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const solicitorId = data?.solicitors?.[0]?.solicitor_id;

    try {
      const { name, experience_years, hourly_rate } = form;

      await appApi.put("education/", {
        tableName: "solicitors",
        data: {
          name,
          experience_years,
          hourly_rate,
          onboarded: 1
        },
        where: {
          cognito_id: user.sub
        }
      });

      const requestBody = buildMultiInsertPayload([
        {
          tableName: "solicitor_languages",
          items: form.languages
            .split(",")
            .map(lang => lang.trim())
            .filter(lang => lang)
            .map(language => ({
              solicitor_id: solicitorId,
              language
            })),
        },

        {
          tableName: "solicitor_communication_styles",
          items: form.communication_styles
            .filter(style => style.trim())
            .map(style => ({ solicitor_id: solicitorId, style })),
        },
        {
          tableName: "solicitor_specialisations",
          items: form.specialisations
            .filter(spec => spec.trim())
            .map(specialization => ({ solicitor_id: solicitorId, specialization })),
        },
        {
          tableName: "solicitor_availability",
          items: form.availability
            .filter(a => a.day && a.time_slot)
            .map(a => ({
              solicitor_id: solicitorId,
              day_of_week: a.day,
              time_slot: a.time_slot
            })),
        }
      ]);

      await appApi.post("education/", requestBody);
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      alert("Error submitting form");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white shadow rounded-xl space-y-4">
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 shadow-sm mb-4">
        <h2 className="text-lg font-semibold text-purple-700 mb-1">Getting Started</h2>
        <p className="text-sm text-gray-600">
          Fill out your details so we can connect you with clients who suit your expertise.
        </p>
      </div>

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

      <div>
        <label className="block mb-1 font-medium">Preferred Language(s)</label>
        <input
          type="text"
          placeholder="e.g., English, Spanish"
          value={form.languages}
          onChange={(e) => updateField("languages", e.target.value)}
          className="w-full p-2 border rounded"
          required
        />
      </div>


      <div>
        <label className="font-semibold capitalize mb-2 block">Specialisations</label>
        {form.specialisations.map((val, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <select
              value={val}
              onChange={(e) => updateArrayField(setForm, "specialisations", index, e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="">Select Specialisation</option>
              {options.specialisations.map((opt) => (
                <option key={opt} value={opt}>
                  {opt}
                </option>
              ))}
            </select>

            <button
              type="button"
              onClick={() => removeFromArrayField(setForm, "specialisations", index)}
              className="text-red-500"
            >
              ✕
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => addToArrayField(setForm, "specialisations", "")}
          className="text-sm text-blue-600 hover:underline"
        >
          + Add Specialisation
        </button>
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
  );
};

export default SolicitorOnboarding;

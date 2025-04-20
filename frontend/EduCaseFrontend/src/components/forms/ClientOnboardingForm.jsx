import React, { useState } from "react";
import { appApi } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import useDashboardData from "../../hooks/useDashboardData";
import { useNavigate } from "react-router-dom";

const legalOptions = [
  "Family Law",
  "Immigration Law",
  "Employment Law",
  "Criminal Law",
  "Property Law",
  "Contract Law",
  "Human Rights Law"
];

//When a client first signs in they have to fill this form in so the matching algorithm 
// Has something to match to. Again I used the Tailwind forms page to build this and used pasted forms.
// It is very basic and will change. I need to abstract the updateFields methods as multiple forms are using 
// the same methods.

const ClientOnboarding = () => {
  const { user } = useAuth();
  const { data } = useDashboardData(user);
  const Navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    language: "",
    communication_style: "",
    budget: "",
    legal_needs: [""],
    availability: []
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const updateArrayField = (field, index, value, key) => {
    setForm((prev) => {
      const updated = [...prev[field]];
      if (key) updated[index][key] = value;
      else updated[index] = value;
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

    try {
      const { name, language, communication_style, budget } = form;
      console.log(user.sub)

      const { data: client } = await appApi.put("education/", {
        tableName: "clients",
        data: {
          name,
          language,
          communcation_style: communication_style,
          budget
        },
        where: {
            cognito_id: user.sub
        }
      });

      const clientId = client.insertId;

      const payload = [
        ...form.legal_needs
          .filter((need) => need.trim())
          .map((legal_topic) => ({
            tableName: "client_legal_needs",
            data: { client_id: clientId, legal_topic }
          })),
        ...form.availability
          .filter((a) => a.day && a.time_slot)
          .map((a) => ({
            tableName: "solicitor_availability",
            data: { solicitor_id: clientId, day_of_week: a.day, time_slot: a.time_slot }
          }))
      ];

      await appApi.post("education/", {
        multiInsert: true,
        payload
      });

      alert("Client onboarded successfully!");
      Navigate("/match-solicitor");
    } catch (err) {
      console.error(" Error:", err.response?.data || err.message);
      alert("Submission failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white shadow-xl rounded-2xl p-6 space-y-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-semibold text-purple-700">Client Onboarding</h1>

      <input name="name" value={form.name} onChange={handleChange} placeholder="Your Name" required className="w-full p-2 border rounded-xl" />

      <input name="language" value={form.language} onChange={handleChange} placeholder="Preferred Language(s)" required className="w-full p-2 border rounded-xl" />

      <select name="communication_style" value={form.communication_style} onChange={handleChange} required className="w-full p-2 border rounded-xl">
        <option value="">Preferred Communication Style</option>
        <option value="Email">Email</option>
        <option value="Phone Call">Phone Call</option>
        <option value="Video Call">Video Call</option>
      </select>

      <input name="budget" type="number" value={form.budget} onChange={handleChange} placeholder="Your Budget (€)" required className="w-full p-2 border rounded-xl" />

      <div>
        <label className="block font-medium mb-1">Legal Needs</label>
        {form.legal_needs.map((need, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <select value={need} onChange={(e) => updateArrayField("legal_needs", index, e.target.value)} className="w-full p-2 border rounded-xl">
              <option value="">Select Legal Area</option>
              {legalOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {form.legal_needs.length > 1 && (
              <button type="button" onClick={() => removeFromArrayField("legal_needs", index)} className="text-red-600 hover:underline">✕</button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addToArrayField("legal_needs", "")} className="text-sm text-blue-600 hover:underline">
          + Add Another Legal Need
        </button>
      </div>

      <div>
        <label className="block font-medium mb-1">Availability</label>
        {form.availability.map((slot, index) => (
          <div key={index} className="flex gap-2 mb-2 items-center">
            <select value={slot.day} onChange={(e) => updateArrayField("availability", index, e.target.value, "day")} className="border rounded-xl p-2">
              <option value="">Day</option>
              {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((d) => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
            <input type="text" placeholder="Time Slot (e.g., 10:00 - 12:00)" value={slot.time_slot}
              onChange={(e) => updateArrayField("availability", index, e.target.value, "time_slot")}
              className="flex-1 border rounded-xl p-2" />
            <button type="button" onClick={() => removeFromArrayField("availability", index)} className="text-red-600 hover:underline">✕</button>
          </div>
        ))}
        <button type="button" onClick={() => addToArrayField("availability", { day: "", time_slot: "" })} className="text-sm text-blue-600 hover:underline">
          + Add Availability
        </button>
      </div>

      <div className="flex justify-end">
        <button type="submit" className="bg-purple-600 text-white px-6 py-2 rounded-xl hover:bg-purple-700">
          Submit
        </button>
      </div>
    </form>
  );
};

export default ClientOnboarding;

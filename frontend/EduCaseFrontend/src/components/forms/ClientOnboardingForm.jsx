import React, { useState } from "react";
import { appApi } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import useDashboardData from "../../hooks/useDashboardData";
import { useNavigate } from "react-router-dom";
import { SubmitButton, buildMultiInsertPayload, updateArrayField, addToArrayField, removeFromArrayField, handleChange, CommunicationStyle } from "../../util/FromHelper";

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
  const { data } = useDashboardData();
  const { user } = useAuth();
  const Navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    language: "",
    communication_style: "",
    budget: "",
    legal_needs: [""],
    availability: []
  });

  const handleChangec = handleChange(setForm);

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

      const clientId = data.clients[0].client_id;

      const payload = buildMultiInsertPayload([
        {
          tableName: "client_legal_needs",
          items: form.legal_needs
            .filter(need => need.trim())
            .map(legal_topic => ({
              client_id: clientId,
              legal_topic,
            })),
        }
      ]);

      console.log("Payload:", payload);

      await appApi.post("education/", payload);

      alert("Client onboarded successfully!");
      Navigate("/match-solicitor");
    } catch (err) {
      console.error(" Error:", err.response?.data || err.message);
      alert("Submission failed.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 ">
      <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 shadow-sm mb-4">
        <h2 className="text-lg font-semibold text-purple-700 mb-1">Getting Started</h2>
        <p className="text-sm text-gray-600">
          Fill out your preferences so we can connect you with a mentor who suits your needs.
        </p>
      </div>

      <input name="name" value={form.name} onChange={handleChangec} placeholder="Your Name" required className="w-full p-2 border rounded-xl" />
      <input name="language" value={form.language} onChange={handleChangec} placeholder="Preferred Language(s)" required className="w-full p-2 border rounded-xl" />
      <input name="budget" type="number" value={form.budget} onChange={handleChangec} placeholder="Your Budget (€)" required className="w-full p-2 border rounded-xl" />

      <div>
        <label className="block font-medium mb-1">Legal Needs</label>
        {form.legal_needs.map((need, index) => (
          <div key={index} className="flex gap-2 mb-2">
            <select value={need} onChange={(e) => updateArrayField(setForm, "legal_needs", index, e.target.value)} className="w-full p-2 border rounded-xl">
              <option value="">Select Legal Area</option>
              {legalOptions.map((opt) => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {form.legal_needs.length > 1 && (
              <button type="button" onClick={() => removeFromArrayField(setForm, "legal_needs", index)} className="text-red-600 hover:underline">✕</button>
            )}
          </div>
        ))}
        <button type="button" onClick={() => addToArrayField(setForm, "legal_needs", "")} className="text-sm text-blue-600 hover:underline">
          + Add Another Legal Need
        </button>
      </div>
      <CommunicationStyle
        value={form.communication_style}
        name={"communication_style"}
        onChange={handleChangec}
      />

      <SubmitButton />
    </form>
  );
};

export default ClientOnboarding;
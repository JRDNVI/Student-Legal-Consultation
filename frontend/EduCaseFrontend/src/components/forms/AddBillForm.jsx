import React, { useState } from "react";
import { appApi } from "../../api/api";

const AddBillForm = ({ caseId, refetch }) => {
    const [amount, setAmount] = useState("");
    const [description, setDescription] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!amount || !description) return alert("Please fill out all fields");

        try {
            setSubmitting(true);
            await appApi.post("/education/", {
                tableName: "billing",
                data: {
                    case_id: caseId,
                    amount_due: parseFloat(amount),
                    amount_paid: 0,
                    billing_status: "Unpaid",
                    billing_date: new Date().toISOString().split("T")[0],
                },
            });
            setAmount("");
            setDescription("");
            refetch();
            alert("Bill added successfully");
        } catch (err) {
            alert("Failed to add bill");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-white p-4 rounded-xl shadow border">
            <h3 className="text-lg font-semibold text-purple-700">Add New Bill</h3>
            <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="Amount (€)"
                required
                className="w-full p-2 border rounded"
            />
            <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Description (optional)"
                className="w-full p-2 border rounded"
            />
            <button
                type="submit"
                className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                disabled={submitting}
            >
                {submitting ? "Adding..." : "Add Bill"}
            </button>
        </form>
    );
};

export default AddBillForm;

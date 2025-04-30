import React, { useState } from "react";
import {
    LineChart, Line, XAxis, YAxis, Tooltip,
    CartesianGrid, ResponsiveContainer
} from "recharts";
import useDashboardData from "../../hooks/useDashboardData";
import LoadingSpinner from "../../components/general/LoadingSpinner";
import AddBillForm from "../../components/forms/AddBillForm";

const BillingPage = () => {
    const { data, loading, refetch } = useDashboardData();
    const [selectedCaseId, setSelectedCaseId] = useState("");

    if (loading) return <LoadingSpinner title="Loading Billing Data" />;

    const billingData = (data.billing || [])
        .filter((b) => selectedCaseId === "" || b.case_id === parseInt(selectedCaseId))
        .map((entry) => ({
            date: new Date(entry.billing_date).toLocaleDateString(),
            amount: parseFloat(entry.amount_paid),
        }));

    const total = billingData.reduce((sum, b) => sum + b.amount, 0);

    const billingEntries = (data.billing || []).filter(
        (b) => selectedCaseId === "" || b.case_id === parseInt(selectedCaseId)
    );

    const chartData = billingEntries.map((entry) => ({
        date: new Date(entry.billing_date).toLocaleDateString(),
        paid: parseFloat(entry.amount_paid),
        due: parseFloat(entry.amount_due),
    }));

    const totalDue = billingEntries.reduce((sum, b) => sum + parseFloat(b.amount_due), 0);
    const totalPaid = billingEntries.reduce((sum, b) => sum + parseFloat(b.amount_paid), 0);


    return (
        <div className="p-6 bg-gray-50 min-h-screen space-y-6">
            <h1 className="text-2xl font-bold text-purple-700">Billing Overview</h1>

            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">Select Case</label>
                <select
                    value={selectedCaseId}
                    onChange={(e) => setSelectedCaseId(e.target.value)}
                    className="w-full sm:w-1/2 p-2 border rounded bg-white"
                >
                    <option value="">All Cases</option>
                    {data.cases.map((c) => {
                        const client = data.clients.find(cl => cl.client_id === c.client_id);
                        return (
                            <option key={c.case_id} value={c.case_id}>
                                Case #{c.case_id} - {client?.name || "Unknown Client"}
                            </option>
                        );
                    })}
                </select>
            </div>

            <p className="text-lg">
                <strong>Total Billed:</strong> €{totalDue.toFixed(2)}<br />
                <strong>Total Paid:</strong> €{totalPaid.toFixed(2)}
            </p>

            <div className="bg-white p-4 rounded-xl shadow-md">
                {billingData.length === 0 ? (
                    <p className="text-gray-500">No billing data available.</p>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="date" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="due" name="Amount Due" stroke="#eab308" strokeWidth={2} />
                            <Line type="monotone" dataKey="paid" name="Amount Paid" stroke="#6b21a8" strokeWidth={2} />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </div>

            <div className="bg-white p-6 rounded-xl shadow-md">
                <h2 className="text-xl font-semibold text-purple-700 mb-4">➕ Add a New Bill</h2>
                {selectedCaseId ? (
                    <AddBillForm caseId={parseInt(selectedCaseId)} refetch={refetch} />
                ) : (
                    <p className="text-gray-500 italic">Select a case to add a bill.</p>
                )}
            </div>
        </div>
    );
};

export default BillingPage;

import React, { useState } from "react";
import useDashboardData from "../../hooks/useDashboardData";
import LoadingSpinner from "../../components/general/LoadingSpinner";
import EditBill from "../../components/forms/EditBillForm";

const ClientBillingPage = () => {
    const { data, loading, refetch } = useDashboardData();
    const client = data?.clients?.[0];
    const [editingBill, setEditingBill] = useState(null);

    if (loading) return <LoadingSpinner title="Loading Billing Information" />;

    const clientCaseIds = (data?.cases || [])
        .filter((c) => c.client_id === client.client_id)
        .map((c) => c.case_id);

    const clientBills = (data?.billing || []).filter((b) =>
        clientCaseIds.includes(b.case_id)
    );

    const totalDue = clientBills.reduce((sum, b) => sum + parseFloat(b.amount_due), 0);
    const totalPaid = clientBills.reduce((sum, b) => sum + parseFloat(b.amount_paid), 0);

    return (
        <main className="min-h-screen bg-gray-50 space-y-6">
            <h1 className="text-2xl font-bold text-purple-700">Your Billing Summary</h1>

            <div className="bg-white p-4 rounded-xl shadow-md">
                <p className="text-lg"><strong>Total Due:</strong> €{totalDue.toFixed(2)}</p>
                <p className="text-lg"><strong>Total Paid:</strong> €{totalPaid.toFixed(2)}</p>
            </div>

            <section className="bg-white p-6 rounded-xl shadow-md space-y-4">
                <h2 className="text-xl font-semibold text-purple-700">Your Bills</h2>

                {clientBills.length === 0 ? (
                    <p className="text-gray-500">You have no billing records yet.</p>
                ) : (
                    clientBills.map((bill, i) => (
                        console.log("Bill:", bill),
                        <div
                            key={i}
                            className="border rounded-lg p-4 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center"
                        >


                            <div>
                                <p className="text-sm text-gray-500">Case ID: #{bill.case_id}</p>
                                <p className="font-medium text-lg">Amount Due: €{bill.amount_due}</p>
                                <p className="text-sm text-gray-600">Amount Paid: €{bill.amount_paid}</p>
                                <p className="text-sm text-gray-600">
                                    Billing Date: {new Date(bill.billing_date).toLocaleDateString()}
                                </p>
                            </div>
                            <span
                                className={`mt-2 md:mt-0 px-3 py-1 rounded-full text-sm font-semibold ${bill.billing_status === "Paid"
                                    ? "bg-green-100 text-green-700"
                                    : bill.billing_status === "Partially Paid"
                                        ? "bg-yellow-100 text-yellow-700"
                                        : "bg-red-100 text-red-700"
                                    }`}
                            >
                                {bill.billing_status}
                            </span>
                            <button
                                onClick={() => setEditingBill(bill)}
                                className="text-purple-600 underline text-sm"
                            >
                                Edit
                            </button>
                        </div>
                    ))
                )}
            </section>
            {editingBill && (
                <EditBill
                    bill={editingBill}
                    isOpen={!!editingBill}
                    onClose={() => setEditingBill(null)}
                    refetch={refetch}
                />
            )}
        </main>
    );
};

export default ClientBillingPage;

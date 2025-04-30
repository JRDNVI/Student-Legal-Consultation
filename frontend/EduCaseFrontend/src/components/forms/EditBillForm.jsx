import React, { useState } from "react";
import Modal from "../general/Modal";
import { appApi } from "../../api/api";

const EditBill = ({ bill, isOpen, onClose, refetch }) => {
    const [amountDue, setAmountDue] = useState(bill.amount_due);
    const [amountPaid, setAmountPaid] = useState(bill.amount_paid);
    const [billingStatus, setBillingStatus] = useState(bill.billing_status);
    const [submitting, setSubmitting] = useState(false);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setSubmitting(true);
        try {
            await appApi.put("/education/", {
                tableName: "billing",
                data: {
                    amount_due: parseFloat(amountDue),
                    amount_paid: parseFloat(amountPaid),
                    billing_status: billingStatus,
                },
                where: {
                    bill_id: bill.bill_id,
                },
            });
            refetch();
            onClose();
        } catch (err) {
            console.error("Failed to update bill", err);
            alert("Error updating bill");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Edit Bill">
            <form onSubmit={handleUpdate} className="space-y-4">
                <input
                    type="number"
                    value={amountDue}
                    onChange={(e) => setAmountDue(e.target.value)}
                    placeholder="Amount Due (€)"
                    className="w-full border p-2 rounded"
                    required
                />
                <input
                    type="number"
                    value={amountPaid}
                    onChange={(e) => setAmountPaid(e.target.value)}
                    placeholder="Amount Paid (€)"
                    className="w-full border p-2 rounded"
                    required
                />
                <select
                    value={billingStatus}
                    onChange={(e) => setBillingStatus(e.target.value)}
                    className="w-full border p-2 rounded"
                    required
                >
                    <option value="Unpaid">Unpaid</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Paid">Paid</option>
                </select>
                <button
                    type="submit"
                    disabled={submitting}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                >
                    {submitting ? "Saving..." : "Update Bill"}
                </button>
            </form>
        </Modal>
    );
};

export default EditBill;

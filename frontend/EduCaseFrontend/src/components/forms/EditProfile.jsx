import React, { useState } from "react";
import { appApi } from "../../api/api";
import { userFields, tableIdMap } from "../../util/appMapping";


const normalizeInitialData = (role, data) =>
    (userFields[role] || []).reduce((acc, field) => {
        const raw = data[field.source || field.key];
        if (field.isArray) acc[field.key] = raw || [];
        else if (field.isObject) acc[field.key] = raw?.[0] || {};
        else if (field.subKey) acc[field.key] = raw?.[0]?.[field.subKey] || "";
        else acc[field.key] = raw || "";
        return acc;
    }, {});

const EditProfile = ({ role, data, onCancel, onSubmit, id }) => {
    const [formData, setFormData] = useState(() => normalizeInitialData(role, data));
    const [deletedItems, setDeletedItems] = useState([]);

    const handleFieldChange = (key, subKey, value, index) => {
        setFormData((prev) => {
            if (typeof index === "number") {
                const updated = [...(prev[key] || [])];
                updated[index] = subKey ? { ...updated[index], [subKey]: value } : value;
                return { ...prev, [key]: updated };
            }
            if (subKey) {
                return { ...prev, [key]: { ...prev[key], [subKey]: value } };
            }
            return { ...prev, [key]: value };
        });
    };

    const removeItem = (key, index) => {
        const updated = [...(formData[key] || [])];
        const removed = updated.splice(index, 1)[0];
        if (removed) {
            const idField = removed.id || removed[`${key.slice(0, -1)}_id`];
            if (idField) {
                setDeletedItems((prev) => [...prev, { table: key, id: idField }]);
            }
        }
        setFormData((prev) => ({ ...prev, [key]: updated }));
    };

    const buildRequests = () => {
        const roleIdKey = `${role}_id`;
        console.log("Role ID Key:", roleIdKey);
        const mainTable = `${role}s`;
        const fields = userFields[role] || [];

        const mainData = {};
        const updates = [];
        const creates = [];
        const deletes = deletedItems.map((item) => ({
            tableName: item.table,
            where: { [tableIdMap[item.table]]: item.id },
        }));

        fields.forEach((field) => {
            const value = formData[field.key];
            if (field.isArray && value?.length) {
                value.forEach((item) => {
                    const base = { [roleIdKey]: id, ...(field.subKey ? { [field.subKey]: item[field.subKey] || item } : item) };
                    const itemId = item.id || item[`${field.key.slice(0, -1)}_id`];
                    if (itemId) {
                        updates.push({ tableName: field.key, data: base, where: { [tableIdMap[field.key]]: itemId } });
                    } else {
                        creates.push({ tableName: field.key, data: base });
                    }
                });
            } else if (field.isObject && value) {
                updates.push({ tableName: field.key, data: value, where: { [roleIdKey]: id } });
            } else if (!field.isArray && !field.isObject) {
                mainData[field.subKey || field.key] = value;
            }
        });

        updates.unshift({ tableName: mainTable, data: mainData, where: { [roleIdKey]: id } });

        return { updates, creates, deletes };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const { updates, creates, deletes } = buildRequests();
        const tasks = [];

        console.log("Submitting profile updates:", { updates, creates, deletes });

        if (updates.length) tasks.push(appApi.put("education/", { multiInsert: true, payload: updates }));
        if (deletes.length) tasks.push(appApi.delete("education/", { data: { multiDelete: true, payload: deletes } }));
        if (creates.length) tasks.push(appApi.post("education/", { multiInsert: true, payload: creates }));

        try {
            await Promise.all(tasks);
            onSubmit(formData);
        } catch (err) {
            console.error("Failed to update profile:", err);
            alert("Failed to save changes.");
        }
    };

    const fields = userFields[role] || [];
    const hiddenFields = ["email"];

    const renderInput = (field) => {
        const value = formData[field.key] || (field.isArray ? [] : "");

        if (field.isArray) {
            return (
                <div className="space-y-2">
                    {value.map((item, idx) => (
                        <div key={idx} className="flex gap-2 items-center">
                            <input
                                className="flex-1 border p-2 rounded"
                                value={field.subKey ? item[field.subKey] : item}
                                onChange={(e) => handleFieldChange(field.key, field.subKey, e.target.value, idx)}
                            />
                            <button
                                type="button"
                                onClick={() => removeItem(field.key, idx)}
                                className="text-red-500 text-sm"
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={() => handleFieldChange(field.key, null, field.subKey ? { [field.subKey]: "" } : "", value.length)}
                        className="text-blue-600 text-sm"
                    >
                        + Add
                    </button>
                </div>
            );
        }

        if (field.isObject) {
            return (
                <input
                    className="w-full border p-2 rounded"
                    value={value?.[field.subKey] || ""}
                    onChange={(e) => handleFieldChange(field.key, field.subKey, e.target.value)}
                />
            );
        }

        return (
            <input
                className="w-full border p-2 rounded"
                value={value}
                onChange={(e) => handleFieldChange(field.key, null, e.target.value)}
            />
        );
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {fields
                .filter((field) => !hiddenFields.includes(field.subKey))
                .map((field) => (
                    <div key={field.uniqueKey || field.key}>
                        <label className="block text-sm font-semibold mb-1">{field.label}</label>
                        {renderInput(field)}
                    </div>
                ))}

            <div className="flex justify-end space-x-2">
                <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded hover:bg-purple-700">
                    Save Changes
                </button>
            </div>
        </form>
    );
};

export default EditProfile;

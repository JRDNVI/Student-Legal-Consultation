import React, { useState } from "react";
import { appApi } from "../../api/api";

const AddTask = ({ tasks, caseId, refetch, closeModal }) => {
  const [newTask, setNewTask] = useState({
    title: "",
    due_date: "",
    recipient: ""
  });

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.due_date || !newTask.recipient) return;

    try {
      await appApi.post("education/", {
        tableName: "tasks",
        data: {
          case_id: caseId,
          title: newTask.title,
          due_date: newTask.due_date,
          recipient: newTask.recipient
        }
      });

      setNewTask({ title: "", due_date: "", recipient: "" });
      await refetch();
      if (closeModal) closeModal(); // ✅ Close the modal after successful submission
    } catch (err) {
      console.error("❌ Failed to add task:", err);
    }
  };

  return (
    <form onSubmit={handleAddTask} className="space-y-4">
      <input
        type="text"
        placeholder="Task Title"
        className="w-full border rounded p-2"
        value={newTask.title}
        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
        required
      />
      <input
        type="date"
        className="w-full border rounded p-2"
        value={newTask.due_date}
        onChange={(e) => setNewTask({ ...newTask, due_date: e.target.value })}
        required
      />
      <select
        className="w-full border rounded p-2"
        value={newTask.recipient}
        onChange={(e) => setNewTask({ ...newTask, recipient: e.target.value })}
        required
      >
        <option value="">Select Recipient</option>
        <option value="Client">Client</option>
        <option value="Solicitor">Solicitor</option>
      </select>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          ➕ Add Task
        </button>
      </div>
    </form>
  );
};

export default AddTask;

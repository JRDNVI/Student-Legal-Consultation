import React, { useState } from "react";
import { appApi } from "../../api/api";
import useDashboardData from "../../hooks/useDashboardData";

const AddStudentTask = ({ students = [], mentorId }) => {
  const { refetch } = useDashboardData();
  const [form, setForm] = useState({
    student_id: "",
    title: "",
    deadline: "",
    completed: false
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === "checkbox" ? checked : value;
    setForm((prev) => ({ ...prev, [name]: newValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await appApi.post("education/", {
        tableName: "tasks_student",
        data: {
          mentor_id: mentorId,
          ...form
        }
      });
      refetch();
    } catch (err) {
      console.error("Error adding task:", err);
      alert("Failed to add task.");
    }
  };

  return (

    <div className="space-y-4 bg-white p-6 rounded-xl shadow-lg">
      <h2 className="text-2xl font-bold text-purple-700">Assign Task to Student</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <select
          name="student_id"
          value={form.student_id}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        >
          <option value="">Select Student</option>
          {students.map((s) => (
            <option key={s.student_id} value={s.student_id}>
              {s.name || s.email}
            </option>
          ))}
        </select>

        <input
          type="text"
          name="title"
          placeholder="Task Title"
          value={form.title}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <input
          type="date"
          name="deadline"
          value={form.deadline}
          onChange={handleChange}
          className="w-full p-2 border rounded"
          required
        />

        <button
          type="submit"
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Add Task
        </button>
      </form>
    </div>

  );
};

export default AddStudentTask;

import React, { useState } from "react";
import { appApi } from "../../api/api";
import { useAuth } from "../../context/AuthContext";

const AddStudentTask = ({ students = [], mentorId }) => {
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
      alert("Task added!");
    } catch (err) {
      console.error("Error adding task:", err);
      alert("Failed to add task.");
    }
  };

  return (
    <div className="flex">
      <main className="flex-1 p-8 bg-gray-100 min-h-screen">
        <div className="max-w-xl mx-auto space-y-4 bg-white p-6 rounded-xl shadow-lg">
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

            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="completed"
                checked={form.completed}
                onChange={handleChange}
              />
              <span className="text-sm">Mark as Completed</span>
            </label>

            <button
              type="submit"
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Add Task
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default AddStudentTask;

import React, { useState } from "react";
import useDashboardData from "../../hooks/useDashboardData";
import { appApi } from "../../api/api";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/dashboard/sidebar";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import Model from "../../components/general/Modal";
import AssignmentForm from "../../components/forms/AssignmentForm";

// Not finshed - Really bad code

export default function AssignmentPage() {
  const { user } = useAuth();
  const { data, loading, refetch } = useDashboardData(user);
  const [isModalOpen, setModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const role = user["custom:role"];
  const assignments = data?.assignments || [];

  const openModal = (assignment = null) => {
    setEditingAssignment(assignment);
    setModalOpen(true);
  };

  const closeModal = () => {
    setEditingAssignment(null);
    setModalOpen(false);
  };

  const handleSave = async (formData) => {
    const { assignment_id, ...safeData } = formData; 
  
    const payload = {
      tableName: "assignments",
      data: editingAssignment
        ? safeData
        : { ...formData, student_id: data?.students?.[0]?.student_id },
      ...(editingAssignment && {
        where: { assignment_id: editingAssignment.assignment_id },
      }),
    };
  
    try {
      editingAssignment
        ? await appApi.put("education/", payload)
        : await appApi.post("education/", payload);
      closeModal();
      await refetch();
    } catch (err) {
      console.error("Failed to save assignment:", err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await appApi.delete("education/", {
        data: { tableName: "assignments", where: { assignment_id: id } },
      });
      await refetch();
    } catch (err) {
      console.error("Failed to delete assignment:", err);
    }
  };

  return (
    <div className="flex">
      <Sidebar role={role} />
      <main className="flex-1 p-6 space-y-6">
        <div className="flex justify-between items-center bg-white p-4 rounded shadow">
          <h1 className="text-2xl font-bold">Assignments</h1>
          <button
            className="bg-purple-600 text-white px-4 py-2 rounded flex items-center gap-2"
            onClick={() => openModal()}
          >
            <FaPlus /> Add Assignment
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {assignments.map((assignment) => (
            <div
              key={assignment.assignment_id}
              className="bg-white rounded-lg shadow p-4 relative"
            >
              <h2 className="text-lg font-bold mb-1">{assignment.title}</h2>
              <p className="text-sm text-gray-600 mb-2">
                {assignment.description}
              </p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>
                  <strong>Due:</strong> {assignment.due_date?.split("T")[0]}
                </p>
                <p>
                  <strong>Status:</strong> {assignment.status || "N/A"}
                </p>
                <p>
                  <strong>Grade:</strong>{" "}
                  {assignment.grade ?? "Not graded"}
                </p>
              </div>
              <div className="absolute top-2 right-2 flex gap-2 text-sm text-gray-500">
                <button
                  onClick={() => openModal(assignment)}
                  className="hover:text-blue-600"
                >
                  <FaEdit />
                </button>
                <button
                  onClick={() => handleDelete(assignment.assignment_id)}
                  className="hover:text-red-600"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>

        {isModalOpen && (
        <Model
            isOpen={isModalOpen}
            title={editingAssignment ? "Edit Assignment" : "Add Assignment"}
            onClose={closeModal}
            >
            <AssignmentForm
                initialData={editingAssignment}
                onSubmit={handleSave}
                onCancel={closeModal}
            />
        </Model>
        )}
      </main>
    </div>
  );
}

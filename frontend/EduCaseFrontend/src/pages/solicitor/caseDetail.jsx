import React, { useState } from "react";
import { useParams } from "react-router-dom";
import useDashboardData from "../../hooks/useDashboardData";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../../components/general/LoadingSpinner";
import Modal from "../../components/general/Modal";
import { appApi } from "../../api/api";
import AddTask from "../../components/forms/AddTask";
import Sidebar from "../../components/dashboard/sidebar";

const CaseDetailPage = () => {
  const { caseId } = useParams();
  const { user } = useAuth();
  const { data, loading, refetch } = useDashboardData(user);
  const role = user["custom:role"];

  const [selectedFile, setSelectedFile] = useState(null);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);

  if (loading) return <LoadingSpinner />;

  const legalCase = data?.cases?.find((c) => c.case_id === parseInt(caseId));
  const tasks = data?.tasks?.filter((t) => t.case_id === parseInt(caseId)) || [];
  const messages = data?.messages?.filter((m) => m.case_id === parseInt(caseId)) || [];
  const documents = data?.documents?.filter((d) => d.case_id === parseInt(caseId)) || [];

  const handleFileChange = (e) => setSelectedFile(e.target.files[0]);
  const handleFileUpload = async () => {
    if (!selectedFile) return;
    try {
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("case_id", caseId);
      await appApi.post("/education/upload-document", formData);
      refetch();
      alert("File uploaded successfully");
    } catch {
      alert("Failed to upload file");
    }
  };

  if (!legalCase) {
    return (
      <div className="flex">
        <Sidebar role={role} />
        <main className="flex-1 p-10 bg-gray-100 min-h-screen">
          <h1 className="text-2xl font-bold text-purple-700">Case Not Found</h1>
        </main>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar role={role} />

      <main className="flex-1 bg-gray-100 min-h-screen p-10 space-y-6">
        <section className="bg-white p-6 rounded-xl shadow border border-gray-200 space-y-2">
          <h1 className="text-3xl font-bold text-purple-700">Case Details</h1>
          <p>📂 <strong>Case ID:</strong> {legalCase.case_id}</p>
          <p>🧑 <strong>Client ID:</strong> {legalCase.client_id}</p>
          <p>👨‍⚖️ <strong>Solicitor ID:</strong> {legalCase.solicitor_id}</p>
          <p>📌 <strong>Status:</strong> {legalCase.status}</p>
          <p>📅 <strong>Created:</strong> {new Date(legalCase.created_at).toLocaleString()}</p>
          <p>💰 <strong>Total Billing:</strong> €{legalCase.total_billing}</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <section className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-purple-700">Tasks</h2>
              <button
                onClick={() => setIsTaskModalOpen(true)}
                className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 text-sm"
              >
                ➕ Add Task
              </button>
            </div>
            <div className="space-y-2 max-h-[210px] overflow-y-auto pr-2">
              {tasks.length === 0
                ? <p>No tasks.</p>
                : tasks.map((t) => (
                    <div key={t.task_id} className="p-3 border rounded shadow-sm bg-gray-50">
                      <p><strong>{t.title}</strong></p>
                      <p>Due: {new Date(t.due_date).toLocaleDateString()}</p>
                      <p>Status: {t.completed ? "✅ Completed" : "❌ Incomplete"}</p>
                      <p className="text-sm text-gray-500">For: {t.recipient}</p>
                    </div>
                  ))
              }
            </div>
          </section>

          <section className="bg-white p-6 rounded-xl shadow border border-gray-200">
            <h2 className="text-xl font-semibold text-purple-700 mb-4">Correspondence</h2>
            {messages.length === 0
              ? <p>No messages.</p>
              : (
                <ul className="space-y-2">
                  {messages.map((m) => (
                    <li key={m.message_id} className="p-3 border rounded shadow-sm">
                      <p>{m.content}</p>
                      <p className="text-sm text-gray-500">
                        Sent at: {new Date(m.timestamp).toLocaleString()}
                      </p>
                    </li>
                  ))}
                </ul>
              )
            }
          </section>
        </div>

        <section className="bg-white p-6 rounded-xl shadow border border-gray-200">
          <h2 className="text-xl font-semibold text-purple-700 mb-4">Documents</h2>
          {documents.length === 0
            ? <p>No documents uploaded.</p>
            : (
              <ul className="space-y-2">
                {documents.map((doc) => (
                  <li key={doc.document_id} className="p-3 border rounded shadow-sm">
                    <p><strong>{doc.filename}</strong></p>
                    <a
                      href={doc.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Document
                    </a>
                    <p className="text-sm text-gray-500">
                      Uploaded: {new Date(doc.uploaded_at).toLocaleString()}
                    </p>
                  </li>
                ))}
              </ul>
            )
          }

          <div className="mt-4 space-y-2">
            <input type="file" onChange={handleFileChange} className="block" />
            <button
              onClick={handleFileUpload}
              className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
            >
              Upload Document
            </button>
          </div>
        </section>
      </main>
      <Modal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        title="Add New Task"
      >
        <AddTask
          tasks={tasks}
          caseId={caseId}
          refetch={refetch}
          closeModal={() => setIsTaskModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default CaseDetailPage;

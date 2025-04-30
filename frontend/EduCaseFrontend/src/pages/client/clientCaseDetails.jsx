import React, { useState } from "react";
import useDashboardData from "../../hooks/useDashboardData";
import LoadingSpinner from "../../components/general/LoadingSpinner";
import ViewFileButton from "../../components/general/ViewFileButton";
import { uploadFileAndGetS3Key } from "../../util/upload/uploadFiles";

const ClientCasePage = () => {
    const { data, loading, refetch } = useDashboardData();
    const [selectedFiles, setSelectedFiles] = useState({});

    if (loading) return <LoadingSpinner title="Loading Your Cases..." />;

    const cases = data.cases || [];
    const caseDocuments = data.case_documents || [];
    const tasks = data.tasks || [];
    const events = data.case_events || [];
    const notes = data.notes || [];

    if (cases.length === 0) {
        return <p className="text-center text-gray-600 mt-10">You have no active cases.</p>;
    }

    const uploadFile = async (file, caseId) => {
        try {
            const s3Key = await uploadFileAndGetS3Key("case_documents", file, "client", caseId);
            console.log("File uploaded successfully. S3 Key:", s3Key);
            await refetch();
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div className="flex flex-col bg-gray-50 min-h-screen">
            {cases.map((caseItem) => {
                const clientTasks = tasks.filter(task => task.case_id === caseItem.case_id && task.recipient === "Client");
                const documents = caseDocuments.filter(doc => doc.case_id === caseItem.case_id);
                const clientEvents = events.filter(event => event.case_id === caseItem.case_id && event.event_type === "Client Meeting");
                const caseNotes = notes.filter(note => note.case_id === caseItem.case_id);
                const solicitor = data.solicitors?.find(s => s.solicitor_id === caseItem.solicitor_id);

                return (
                    <div key={caseItem.case_id} className="bg-white rounded-3xl shadow-md p-6 space-y-8">
                        <header className="flex justify-between flex-wrap items-start gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-purple-700">Case #{caseItem.case_id}</h2>
                                <p className="text-sm text-gray-600">Status: <span className="font-medium">{caseItem.status}</span></p>
                                <p className="text-sm text-gray-600">Created: {new Date(caseItem.created_at).toLocaleDateString()}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-600">Solicitor: <span className="font-medium">{solicitor?.name || "N/A"}</span></p>
                                <p className="text-sm text-gray-600">Email: {solicitor?.email || "N/A"}</p>
                            </div>
                        </header>

                        <section>
                            <h3 className="text-xl font-semibold mb-4">Your Tasks</h3>
                            {clientTasks.length > 0 ? (
                                <ul className="space-y-4">
                                    {clientTasks.map(task => (
                                        <li key={task.task_id} className="bg-purple-50 p-4 rounded-xl shadow-sm space-y-2">
                                            <div className="flex justify-between items-center">
                                                <span className="font-medium">{task.title}</span>
                                                <span className={`text-xs px-2 py-1 rounded-full ${task.completed ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                    {task.completed ? "Completed" : "Pending"}
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-500">Due: {task.due_date?.split("T")[0]}</p>
                                            <form onSubmit={(e) => {
                                                e.preventDefault();
                                                if (selectedFiles[task.task_id]) uploadFile(selectedFiles[task.task_id], task.task_id);
                                            }} className="flex gap-2 items-center">
                                                <input type="file" onChange={(e) => setSelectedFiles({ ...selectedFiles, [task.task_id]: e.target.files[0] })} className="text-sm p-2 border rounded flex-1" required />
                                                <button type="submit" className="bg-purple-600 text-white px-4 py-1 rounded hover:bg-purple-700 text-sm">Upload</button>
                                            </form>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 italic">No assigned tasks for you.</p>
                            )}
                        </section>

                        <section>
                            <h3 className="text-xl font-semibold mb-4">Uploaded Documents</h3>
                            {documents.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                    {documents.map((doc) => (
                                        <ViewFileButton key={doc.document_id} s3Key={doc.s3_url} filename={doc.filename} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No documents uploaded yet.</p>
                            )}
                        </section>

                        <section>
                            <h3 className="text-xl font-semibold mb-4">Client Meetings</h3>
                            {clientEvents.length > 0 ? (
                                <ul className="space-y-4">
                                    {clientEvents.map(event => (
                                        <li key={event.event_id} className="bg-blue-50 p-4 rounded-xl shadow-sm">
                                            <p className="font-medium">{event.title}</p>
                                            <p className="text-sm text-gray-600">{new Date(event.start_time).toLocaleString()}</p>
                                            <p className="text-sm text-gray-500">{event.description}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 italic">No client meetings scheduled.</p>
                            )}
                        </section>


                        <section>
                            <h3 className="text-xl font-semibold mb-4">Case Notes</h3>
                            {caseNotes.length > 0 ? (
                                <ul className="space-y-4">
                                    {caseNotes.map(note => (
                                        <li key={note.note_id} className="bg-gray-100 p-4 rounded-xl shadow-sm">
                                            <p className="font-semibold">{note.note_name} <span className="text-sm font-normal text-gray-500">({note.note_type})</span></p>
                                            <p className="text-sm text-gray-500">{new Date(note.creation_date).toLocaleDateString()}</p>
                                            <p className="text-sm mt-1">{note.content}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 italic">No notes available.</p>
                            )}
                        </section>
                    </div>
                );
            })}
        </div>
    );
};

export default ClientCasePage;

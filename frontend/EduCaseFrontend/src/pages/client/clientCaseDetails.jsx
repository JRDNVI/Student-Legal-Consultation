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
    const caseId = data?.cases?.[0]?.case_id;

    if (cases.length === 0) {
        return <p className="text-center text-gray-600 mt-10">You have no active cases.</p>;
    }

    const uploadFile = async (file, caseId) => {
        try {
            const s3Key = await uploadFileAndGetS3Key(
                "case_documents",
                file,
                "client",
                caseId
            );
            console.log("File uploaded successfully. S3 Key:", s3Key);
            await refetch();
        } catch (error) {
            console.error("Error uploading file:", error);
        }
    };

    return (
        <div className="flex flex-col bg-gray-50 min-h-screen p-6 gap-6">
            {cases.map((caseItem) => {
                const clientTasks = tasks.filter(
                    (task) => task.case_id === caseItem.case_id && task.recipient === "Client"
                );
                const solicitorTasks = tasks.filter(
                    (task) => task.case_id === caseItem.case_id && task.recipient === "Solicitor"
                );
                const documents = caseDocuments.filter((doc) => doc.case_id === caseItem.case_id);

                return (
                    <div key={caseItem.case_id} className="bg-white rounded-3xl shadow-md p-6">
                        <h2 className="text-2xl font-bold text-purple-700 mb-6">
                            Case #{caseItem.case_id} - {caseItem.status}
                        </h2>
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-4">Your Assigned Tasks</h3>
                            {clientTasks.length > 0 ? (
                                <ul className="space-y-6">
                                    {clientTasks.map((task) => (
                                        <li key={task.task_id} className="bg-purple-50 p-4 rounded-xl shadow-sm">
                                            <div className="flex flex-col md:flex-row md:justify-between">
                                                <p className="font-medium">{task.title}</p>
                                                <p className="text-sm text-gray-500">
                                                    Due: {task.due_date?.split("T")[0]} — {task.completed ? " Completed" : " Pending"}
                                                </p>
                                            </div>

                                            <form
                                                onSubmit={(e) => {
                                                    e.preventDefault();
                                                    if (selectedFiles[task.task_id]) {
                                                        uploadFile(selectedFiles[task.task_id], task.task_id);
                                                    }
                                                }}
                                                className="flex flex-col sm:flex-row items-center gap-3 mt-3"
                                            >
                                                <input
                                                    type="file"
                                                    name="file"
                                                    className="flex-1 text-sm border-gray-300 rounded-lg shadow-sm p-2 focus:outline-purple-500"
                                                    required
                                                    onChange={(e) =>
                                                        setSelectedFiles({
                                                            ...selectedFiles,
                                                            [task.task_id]: e.target.files[0],
                                                        })
                                                    }
                                                />
                                                <button
                                                    type="submit"
                                                    className="bg-purple-600 hover:bg-purple-700 text-white text-sm px-5 py-2 rounded-lg transition"
                                                >
                                                    Upload
                                                </button>
                                            </form>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 italic">No assigned tasks for you.</p>
                            )}
                        </div>
                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-4">Solicitor's Tasks</h3>
                            {solicitorTasks.length > 0 ? (
                                <ul className="space-y-6">
                                    {solicitorTasks.map((task) => (
                                        <li key={task.task_id} className="bg-gray-100 p-4 rounded-xl shadow-sm">
                                            <div className="flex flex-col md:flex-row md:justify-between">
                                                <p className="font-medium">{task.title}</p>
                                                <p className="text-sm text-gray-500">
                                                    Due: {task.due_date?.split("T")[0]} — {task.completed ? " Completed" : " Pending"}
                                                </p>
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500 italic">No tasks for solicitor yet.</p>
                            )}
                        </div>
                        <div>
                            <h3 className="text-xl font-semibold mb-4">Uploaded Documents</h3>
                            {documents.length > 0 ? (
                                <div className="flex flex-wrap gap-3">
                                    {documents.map((doc) => (
                                        <ViewFileButton key={doc.document_id} s3Key={doc.s3_url} filename={doc.filename} />
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-500 italic">No documents uploaded yet.</p>
                            )}
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default ClientCasePage;

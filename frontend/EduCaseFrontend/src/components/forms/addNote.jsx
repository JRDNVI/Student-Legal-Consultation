import React, { useState } from "react";
import Modal from "../../components/general/Modal";
import { appApi } from "../../api/api";
import { legalNoteTypes } from "../../util/solicitor/mapping";

const AddNoteSection = ({ notes, caseId, refetch }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newNote, setNewNote] = useState({
        note_name: "",
        note_type: "",
        content: "",
    });
    const [filterType, setFilterType] = useState("");

    const handleNoteSubmit = async () => {
        try {
            await appApi.post("education/", {
                tableName: "notes",
                data: {
                    case_id: caseId,
                    note_name: newNote.note_name,
                    note_type: newNote.note_type,
                    creation_date: new Date().toISOString().split("T")[0],
                    content: newNote.content,
                },
            });
            refetch();
            setIsModalOpen(false);
            setNewNote({ note_name: "", note_type: "", content: "" });
        } catch (err) {
            alert("Failed to add note.");
        }
    };

    const filteredNotes = filterType
        ? notes.filter((note) => note.note_type === filterType)
        : notes;

    return (
        <>
            <section className="bg-white p-6 rounded-xl shadow border border-gray-200">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-purple-700">Case Notes</h2>
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="bg-purple-600 text-white px-3 py-1 rounded hover:bg-purple-700 text-sm"
                    >
                        Add Note
                    </button>
                </div>

                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Filter by Category
                    </label>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="w-full p-2 border rounded text-sm"
                    >
                        <option value="">All Categories</option>
                        {legalNoteTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>
                </div>

                {filteredNotes.length === 0 ? (
                    <p>No notes{filterType ? ` in "${filterType}"` : ""}.</p>
                ) : (
                    <ul className="space-y-2">
                        {filteredNotes.map((note) => (
                            <li key={note.note_id} className="p-3 border rounded shadow-sm">
                                <p>
                                    <strong>{note.note_name}</strong>{" "}
                                    <span className="text-sm text-gray-500">
                                        ({note.note_type})
                                    </span>
                                </p>
                                <p className="text-gray-700">{note.content}</p>
                                <p className="text-sm text-gray-500">
                                    Created: {new Date(note.creation_date).toLocaleDateString()}
                                </p>
                            </li>
                        ))}
                    </ul>
                )}
            </section>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Add Case Note"
            >
                <form
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleNoteSubmit();
                    }}
                    className="space-y-4"
                >
                    <input
                        type="text"
                        placeholder="Note Title"
                        value={newNote.note_name}
                        onChange={(e) =>
                            setNewNote({ ...newNote, note_name: e.target.value })
                        }
                        required
                        className="w-full border rounded p-2"
                    />

                    <label className="block text-sm font-medium text-gray-700">
                        Note Category
                    </label>
                    <select
                        value={newNote.note_type}
                        onChange={(e) =>
                            setNewNote({ ...newNote, note_type: e.target.value })
                        }
                        required
                        className="w-full mt-1 p-2 border rounded bg-white text-sm"
                    >
                        <option value="">-- Select a category --</option>
                        {legalNoteTypes.map((type) => (
                            <option key={type} value={type}>
                                {type}
                            </option>
                        ))}
                    </select>

                    <textarea
                        placeholder="Note Content"
                        value={newNote.content}
                        onChange={(e) =>
                            setNewNote({ ...newNote, content: e.target.value })
                        }
                        required
                        rows="4"
                        className="w-full border rounded p-2"
                    ></textarea>

                    <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded"
                    >
                        Submit
                    </button>
                </form>
            </Modal>
        </>
    );
};

export default AddNoteSection;

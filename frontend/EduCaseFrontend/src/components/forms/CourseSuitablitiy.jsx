import { useState } from "react";
import Select from "react-select";
import {
    groupedPersonalityTraits,
    groupedWorkStyles,
} from "../../util/student/courseMappings";
import { appApi } from "../../api/api";
import { useNavigate } from "react-router-dom";

export default function CourseSuitabilityForm({ studentId }) {
    const Naviagte = useNavigate()
    const [formData, setFormData] = useState({
        personality: [],
        interests: "",
        workStyle: [],
        goals: "",
        selfDescription: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const openAiPayload = {
                description: summary.trim(),
            };

            const response = await appApi.post("education/match-courses", openAiPayload);

            if (response.status === 200) {
                const recommendedCourses = response.data.courses;

                console.log(" Submitted", recommendedCourses);

                const payload = recommendedCourses.map((course) => ({
                    tableName: "student_suggested_course",
                    data: {
                        student_id: studentId,
                        title: course.title,
                        reason: course.reason,
                    },
                }));

                const requestBody = {
                    multiInsert: true,
                    payload
                }

                await appApi.post("education/", requestBody)
                Naviagte("/dashboard")
            }
        } catch (err) {
            console.error("Error:", err);
        }
    }

    //https://react-select.com/home
    // Used "Select" to allow me to set mulitple values in one  field. ***Need to rework all other inputs using this
    // Used other forms as a guide. **need to absract common code. 
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <form onSubmit={handleSubmit} className="bg-white shadow-md rounded-lg p-8 w-full max-w-xl space-y-4">
                <h2 className="text-xl font-semibold text-center mb-4">Course Suitability Form</h2>

                <div className="mb-4">
                    <label htmlFor="personality" className="block font-medium mb-1">Personality Trait</label>
                    <Select
                        isMulti
                        name="personality"
                        options={groupedPersonalityTraits}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={(selectedOptions) => {
                            const values = selectedOptions.map((option) => option.value);
                            setFormData((prev) => ({ ...prev, personality: values }));
                        }}
                        value={groupedPersonalityTraits
                            .flatMap((group) => group.options)
                            .filter((opt) => formData.personality.includes(opt.value))
                        }
                    />
                </div>
                <div>
                    <label className="block font-medium">Interests</label>
                    <input
                        type="text"
                        name="interests"
                        value={formData.interests}
                        onChange={handleChange}
                        placeholder="e.g. Psychology, Art, Technology"
                        className="w-full p-2 border rounded"
                    />
                </div>

                <div className="mb-4">
                    <label className="block font-medium mb-1">Preferred Work Style</label>
                    <Select
                        isMulti
                        name="workStyle"
                        options={groupedWorkStyles}
                        className="basic-multi-select"
                        classNamePrefix="select"
                        onChange={(selectedOptions) => {
                            const values = selectedOptions.map((option) => option.value);
                            setFormData((prev) => ({ ...prev, workStyle: values }));
                        }}
                        value={groupedWorkStyles
                            .flatMap((group) => group.options)
                            .filter((opt) => formData.workStyle.includes(opt.value))
                        }
                    />
                </div>

                <div>
                    <label className="block font-medium">Career Goals</label>
                    <input
                        type="text"
                        name="goals"
                        value={formData.goals}
                        onChange={handleChange}
                        placeholder="e.g. Make Lots of Money"
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="selfDescription" className="block font-medium mb-1">
                        Self-Description
                    </label>
                    <textarea
                        id="selfDescription"
                        name="selfDescription"
                        value={formData.selfDescription}
                        onChange={(e) =>
                            setFormData((prev) => ({ ...prev, selfDescription: e.target.value }))
                        }
                        placeholder="Tell us more about yourself, your background, and what motivates you..."
                        className="w-full p-2 border rounded h-32 resize-none"
                    />
                </div>
                <button
                    type="submit"
                    className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700 w-full"
                >
                    Get Course Recommendations
                </button>
            </form>
        </div>
    );
}

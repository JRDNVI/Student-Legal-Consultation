const SuggestedCoursesCard = ({ courses }) => {

    return (
        <div className="bg-white shadow-lg rounded-lg p-6 mt-6 mx-auto">
            <h2 className="text-xl font-semibold text-purple-700 mb-4">Your Course Recommendations</h2>

            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {courses.map((course, index) => (
                    <div
                        key={course.course_id || index}
                        className="border border-gray-200 rounded-lg p-4 bg-purple-50 hover:bg-purple-100 transition"
                    >
                        <h3 className="text-lg font-semibold text-purple-800">{course.title}</h3>
                        <p className="text-sm text-gray-700 mt-1">{course.reason}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SuggestedCoursesCard;

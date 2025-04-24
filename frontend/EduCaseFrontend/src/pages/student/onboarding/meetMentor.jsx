import React, { useEffect, useState } from "react";
import { appApi } from "../../../api/api";
import { useAuth } from "../../../context/AuthContext";
import useDashboardData from "../../../hooks/useDashboardData";
import LoadingSpinner from "../../../components/general/LoadingSpinner";
import MentorCard from "../../../components/general/mentorCard";
import { useLocation } from "react-router-dom";

const MeetMentor = () => {
  const { user } = useAuth();
  const location = useLocation()
  const { fullOnboarding } = location.state || {};
  const { data, loading: dashboardLoading } = useDashboardData(user);
  const [matches, setMatches] = useState([]);
  const [matchLoading, setMatchLoading] = useState(true);
  const [error] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await appApi.get("education/match-student/");
        setMatches(res.data.matches);
      } catch (err) {
        console.error("Failed to fetch mentors:", err);
      } finally {
        setMatchLoading(false);
      }
    };

    fetchMatches();
  }, [user]);

  if (dashboardLoading || matchLoading) return <LoadingSpinner title="Loading Mentors" />;
  if (error) return <p className="text-red-500">{error}</p>;

  const studentId = data?.students?.[0]?.student_id;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Top Mentor Matches</h1>
      {matches.length === 0 ? (
        <p className="text-gray-600">No mentor matches found.</p>
      ) : (
        matches.slice(0, 3).map((match) => (
          <MentorCard match={match} studentId={studentId} showCourseForm={fullOnboarding} />
        ))
      )}
    </div>
  );
};

export default MeetMentor;

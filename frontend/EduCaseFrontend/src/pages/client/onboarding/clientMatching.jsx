import React, { useEffect, useState } from "react";
import { appApi } from "../../../api/api";
import { useAuth } from "../../../context/AuthContext";
import useDashboardData from "../../../hooks/useDashboardData";
import LoadingSpinner from "../../../components/general/LoadingSpinner";
import SolicitorCard from "../../../components/general/SolicitorCard"; 

const MeetSolicitor = () => {
  const { user } = useAuth();
  const { data, loading: dashboardLoading } = useDashboardData(user);
  const [matches, setMatches] = useState([]);
  const [matchLoading, setMatchLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const res = await appApi.get("education/match-client/");
        setMatches(res.data.matches);
      } catch (err) {
        console.error("Failed to fetch solicitors:", err);
        setError("Could not fetch solicitor matches.");
      } finally {
        setMatchLoading(false);
      }
    };

    fetchMatches();
  }, [user]);

  if (dashboardLoading || matchLoading) return <LoadingSpinner title="Matching Solicitors"/>;
  if (error) return <p className="text-red-500">{error}</p>;

  const clientId = data?.clients?.[0]?.client_id;

  return (
    <div className="max-w-3xl mx-auto mt-10 px-4">
      <h1 className="text-3xl font-bold text-purple-700 mb-6">Top Solicitor Matches</h1>
      {matches.length === 0 ? (
        <p className="text-gray-600">No solicitor matches found.</p>
      ) : (
        matches.slice(0, 3).map((match) => (
          <SolicitorCard key={match.solicitor_id} match={match} clientId={clientId} />
        ))
      )}
    </div>
  );
};

export default MeetSolicitor;

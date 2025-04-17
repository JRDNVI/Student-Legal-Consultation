import { useEffect, useState } from "react";
import { appApi } from "../api/api";
import { useAuth } from "../context/AuthContext";

// This hook fetches and manages the dashboard data for the user. 
// It checks if the data is already available in the context and fetches it if not.

export default function useDashboardData(user) {
  const { dashboardData, setDashboardData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [localData, setLocalData] = useState(dashboardData || {});

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await appApi.get("education/");
      setDashboardData(response.data.relatedData); 
      setLocalData(response.data.relatedData);    
    } catch (err) {
      console.error("Dashboard fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!dashboardData && user) {
      fetchData();
    }
  }, [user]);

  return { data: localData, loading, refetch: fetchData };
}

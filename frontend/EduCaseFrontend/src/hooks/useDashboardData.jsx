import { useEffect, useState } from "react";
import { appApi } from "../api/api";
import { useAuth } from "../context/AuthContext";

// This hook fetches and manages the dashboard data for the user. 
// It checks if the data is already available in the context and fetches it if not.

export default function useDashboardData() {
  const { dashboardData, setDashboardData } = useAuth();
  const [loading, setLoading] = useState(!dashboardData);
  const [localData, setLocalData] = useState(dashboardData || {});

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await appApi.get("education/");
      setDashboardData(response.data.relatedData);
      setLocalData(response.data.relatedData);
    } catch (err) {
      console.error("Dashboard fetch error, trying cache:", err);

      // Fallback to cache if the user is offline.
      try {
        const cache = await caches.open('dashboard-api-cache');
        const cachedResponse = await cache.match(
          'https://fted6gfo0m.execute-api.eu-west-1.amazonaws.com/dev/education/'
        );
        if (cachedResponse) {
          const cachedData = await cachedResponse.json();
          setLocalData(cachedData.relatedData || {});
        }
      } catch (cacheError) {
        console.error("Failed to load dashboard data from cache:", cacheError);
      }
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    if (!dashboardData) fetchData();
    else setLocalData(dashboardData);
  }, []);

  return { data: localData, loading, refetch: fetchData };
}

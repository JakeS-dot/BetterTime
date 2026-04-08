export const handleGetStats = async (
  range,
  start,
  end,
  setLoggedIn,
  setErrorToast,
) => {
  try {
    const fetchStats = async () => {
      const response = await fetch("http://localhost:5000/get_stats_data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ range, start, end }),
      });
      return response;
    };

    let response = await fetchStats();

    if (response.status === 401) {
      // attempt token refresh
      const refreshResp = await fetch("http://localhost:5000/refresh_token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
      });

      if (!refreshResp.ok) {
        setLoggedIn(false);
        setErrorToast("Session expired, please log in again");
        return null;
      }

      // retry stats request after refresh
      response = await fetchStats();
    }

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    setLoggedIn(true);
    return result;
  } catch (error) {
    setErrorToast(error.message);
    console.error("Error getting stats:", error);
    return null;
  }
};

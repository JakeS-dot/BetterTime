export const handleGetStats = async (
  range,
  start,
  end,
  setLoggedIn,
  setErrorToast,
) => {
  try {
    const response = await fetch("http://localhost:5000/get_stats_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({
        range,
        start,
        end,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();
    setLoggedIn(true)

    console.log("Dashboard data:", result);

    return result; // ← important
  } catch (error) {
    setErrorToast(error.message);
    console.error("Error getting stats:", error);
    return null;
  }
};

export const handleGetStats = async (
  token,
  range,
  start,
  end,
  setErrorToast
) => {
  try {
    const response = await fetch("http://127.0.0.1:5000/get_stats_data", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        token,
        range,
        start,
        end,
      }),
    });

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    const result = await response.json();

    console.log("Dashboard data:", result);

    return result; // ← important
  } catch (error) {
    setErrorToast(error.message);
    console.error("Error getting stats:", error);
    return null;
  }
};

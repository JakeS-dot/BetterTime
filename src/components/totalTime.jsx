export function getTotalTime(rawJson) {
  let totalSeconds = 0;

  try {
    if (typeof rawJson === "string") rawJson = JSON.parse(rawJson);

    const dailyTotals = rawJson?.data?.dailyTotals || [];
    dailyTotals.forEach((day) => {
      const projects = day?.projects || [];
      projects.forEach((project) => {
        totalSeconds += Math.round(project?.total_seconds || 0);
      });
    });
  } catch (error) {
    console.error("Error calculating total time:", error);
  }

  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);

  let parts = [];
  if (hours > 0) parts.push(`${hours} hrs`);
  if (minutes > 0) parts.push(`${minutes} min`);
  if (parts.length === 0) parts.push("0 mins"); // fallback if totalSeconds is 0

  return parts.join(" and ");
}

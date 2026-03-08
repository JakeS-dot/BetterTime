import { stringToNeonColor } from "../tools/stringToColor.jsx";

export const processData = (data) => {
  const processed = [];
  const colors = [];
  const uniqueProjects = new Set();
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    date.setDate(date.getDate() + 1); // increase by one because idk

    const options = {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    };
    let formatted = date.toLocaleDateString("en-US", options);

    formatted = formatted.replace(",", "");

    const day = date.getDate();
    const suffix = (d) => {
      if (d > 3 && d < 21) return "th";
      switch (d % 10) {
        case 1:
          return "st";
        case 2:
          return "nd";
        case 3:
          return "rd";
        default:
          return "th";
      }
    };
    formatted = formatted.replace(`${day}`, `${day}${suffix(day)}`);

    return formatted; // "Thu Mar 5th 2026"
  };

  try {
    if (typeof data === "string") {
      data = JSON.parse(data);
    }

    // First pass: Gather all unique project names

    // Source - https://stackoverflow.com/a/1112609
    // Posted by Your Friend Ken, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-03-08, License - CC BY-SA 4.0

    // Instead of iterating root object, use data.dailyTotals array
    if (Array.isArray(data.dailyTotals)) {
      for (let key = 0; key < data.dailyTotals.length; key++) {
        const current = data.dailyTotals[key];

        // Now dailyTotals[i].projects is the actual projects array
        if (current.projects && Array.isArray(current.projects)) {
          current.projects.forEach((project) => {
            if (!uniqueProjects.has(project.name)) {
              uniqueProjects.add(project.name);
              colors.push("#" + stringToNeonColor(project.name));
            }
          });
        }
      }

      // Second pass: build processed data for chart
      for (let key = 0; key < data.dailyTotals.length; key++) {
        const current = data.dailyTotals[key];
        let pageData = {
          name: current.range?.date
            ? formatDate(current.range.date)
            : "Unknown",
        };
        let comb = 0;

        // Initialize all unique projects with 0 seconds
        uniqueProjects.forEach((projectName) => {
          pageData[projectName] = 0;
        });

        // Populate data for the current day's projects
        if (current.projects && Array.isArray(current.projects)) {
          current.projects.forEach((project) => {
            const projectName = project.name;
            const totalSeconds = Math.round(project.total_seconds);
            pageData[projectName] = totalSeconds; // Update project time
            comb += totalSeconds;
          });
        }

        pageData["comb"] = Math.round(comb);
        processed.push(pageData);
      }
    }
  } catch (error) {
    console.error("Error:", error);
  }

  return [processed, colors];
};

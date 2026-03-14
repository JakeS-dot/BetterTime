import { stringToNeonColor } from "../../tools/stringToColor.jsx";

export const processData = (data) => {
  const processed = [];
  const colors = [];
  const uniqueProjects = new Set();

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
          name: current.range?.text
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

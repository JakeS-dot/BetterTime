import { stringToNeonColor } from "../tools/stringToColor.jsx";

export const processData = (data) => {
  const processed = [];
  const colors = [];
  const uniqueProjects = new Set();

  try {
    if (typeof data === "string") {
      data = JSON.parse(data);
    }

    // First pass: Gather all unique project names
    for (let key = 0; Object.prototype.hasOwnProperty.call(data, key); key++) {
      const current = data[key];

      if (current["projects"] && Array.isArray(current["projects"])) {
        current["projects"].forEach((project) => {
          if (!uniqueProjects.has(project["name"])) {
            uniqueProjects.add(project["name"]);
            colors.push("#" + stringToNeonColor(project["name"]));
          }
        });
      }
    }

    // Second pass: Process each day's data
    for (let key = 0; Object.prototype.hasOwnProperty.call(data, key); key++) {
      const current = data[key];
      let pageData = { name: current["date"] }; // Start with the date as the page name
      let comb = 0;

      // Initialize all unique projects with 0 seconds
      uniqueProjects.forEach((projectName) => {
        pageData[projectName] = 0;
      });

      // Populate data for the current day's projects
      if (current["projects"] && Array.isArray(current["projects"])) {
        current["projects"].forEach((project) => {
          const projectName = project["name"];
          const totalSeconds = Math.round(
            project["grand_total"]["total_seconds"],
          );
          pageData[projectName] = totalSeconds; // Update project time
          comb += totalSeconds;
        });
      }

      // Add the comb variable to the pageData object
      pageData["comb"] = Math.round(comb);

      // Push the pageData to the processed array
      processed.push(pageData);
    }
  } catch (error) {
    console.error("Error:", error);
  }
  return [processed, colors];
};

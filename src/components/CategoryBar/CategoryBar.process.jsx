import { getColorByCategory } from "../../tools/getColorByCategory.jsx";

export const processData = (data) => {
  const processed = [[], []];
  const colors = [];
  const uniqueCategories = new Set();

  try {
    if (typeof data === "string") {
      data = JSON.parse(data);
    }

    // First pass: Gather all unique catagorie names

    // Source - https://stackoverflow.com/a/1112609
    // Posted by Your Friend Ken, modified by community. See post 'Timeline' for change history
    // Retrieved 2026-03-08, License - CC BY-SA 4.0

    // Instead of iterating root object, use data.dailyTotals array
    if (Array.isArray(data.dailyTotals)) {
      for (let key = 0; key < data.dailyTotals.length; key++) {
        const current = data.dailyTotals[key];

        // Now dailyTotals[i].catagories is the actual projects array
        if (current.categories && Array.isArray(current.categories)) {
          current.categories.forEach((cata) => {
            if (!uniqueCategories.has(cata.name)) {
              uniqueCategories.add(cata.name);
              colors.push(getColorByCategory(cata.name));
            }
          });
        }
      }
      const combined = { name: "total" };

      data.dailyTotals.forEach((day) => {
        const pageData = {
          name: day.range?.text
        };

        uniqueCategories.forEach((catName) => {
          pageData[catName] = 0;

          if (!(catName in combined)) {
            combined[catName] = 0;
          }
        });

        if (Array.isArray(day.categories)) {
          day.categories.forEach((cat) => {
            const seconds = Math.round(cat.total_seconds);
            pageData[cat.name] = seconds;
            combined[cat.name] += seconds;
          });
        }

        processed[0].push(pageData);
      });

      // build horizontal data
      processed[1].push(combined);
    }

  } catch (error) {
    console.error("Error:", error);
  }

  return [processed, colors];
};


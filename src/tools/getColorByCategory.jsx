/*
    getColorByCategory: Returns a color based on the category from Wakatime
    @param {string} category: The category from Wakatime
    @returns {string} The color based on the category in hex
*/

function getColorByCategory(category) {
  const categoryColors = {
    Advising: "#ff45d4",
    Browsing: "#e59215",
    Building: "#e8ce3d",
    "Code Reviewing": "#34f5db",
    Coding: "#1f9aef",
    Communicating: "#6f2170",
    Debugging: "#c49af9",
    Designing: "#9061ca",
    Indexing: "#fff09d",
    Learning: "#38a2eb",
    "Manual Testing": "#34be61",
    Meeting: "#fd1464",
    Planning: "#ff4585",
    Researching: "#4cbfc0",
    "Running Tests": "#ec5756",
    Supporting: "#ed07a4",
    Translating: "#5a42cf",
    "Writing Docs": "#36e3ff",
    "Writing Tests": "#3cec76",
  };

  return categoryColors[category] || "#FFFFFF";
}

export { getColorByCategory };

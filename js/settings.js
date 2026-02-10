// Settings and data management

// Theme Management
const themeButtons = document.querySelectorAll(".theme-btn");
const htmlElement = document.documentElement;

// Load saved theme or default to light
const savedTheme = localStorage.getItem("theme") || "light";
applyTheme(savedTheme);

function applyTheme(theme) {
  htmlElement.setAttribute("data-theme", theme);

  // Update active button
  themeButtons.forEach((btn) => {
    if (btn.dataset.theme === theme) {
      btn.classList.add("active");
    } else {
      btn.classList.remove("active");
    }
  });

  // Save to localStorage
  localStorage.setItem("theme", theme);
}

// Theme toggle event listeners
themeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const theme = button.dataset.theme;
    applyTheme(theme);
  });
});

// Export data functionality
const exportBtn = document.getElementById("export-data-btn");

exportBtn.addEventListener("click", () => {
  // Gather all data from localStorage
  const data = {
    subjects: JSON.parse(localStorage.getItem("subjects") || "[]"),
    schedules: JSON.parse(localStorage.getItem("schedules") || "[]"),
    tasks: JSON.parse(localStorage.getItem("tasks") || "[]"),
    theme: localStorage.getItem("theme") || "light",
    exportDate: new Date().toISOString(),
  };

  // Convert to JSON string
  const jsonString = JSON.stringify(data, null, 2);

  // Create blob and download
  const blob = new Blob([jsonString], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `study-planner-data-${new Date().toISOString().split("T")[0]}.json`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);

  alert("Data exported successfully!");
});

// Reset data management
const resetBtn = document.getElementById("reset-data-btn");

resetBtn.addEventListener("click", () => {
  const confirmReset = confirm(
    "Are you sure you want to delete all subjects, schedules, and tasks?",
  );

  if (!confirmReset) return;

  // Clear localStorage
  localStorage.removeItem("subjects");
  localStorage.removeItem("schedules");
  localStorage.removeItem("tasks");

  // Clear arrays
  subjects = [];
  schedules = [];
  tasks = [];

  // Update UI
  renderSubjects();
  renderSchedules();
  renderTasks();
  updateDashboard();
  updateProgress();

  alert("All data has been reset successfully!");
});

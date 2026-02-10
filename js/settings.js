// Settings and data management
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

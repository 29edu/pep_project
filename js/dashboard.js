// Dashboard functionality
function updateDashboard() {
  const subjects = JSON.parse(localStorage.getItem("subjects") || "[]");
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  // Update subjects
  document.getElementById("total-subjects").innerText = subjects.length;

  document.getElementById("high-count").innerText = subjects.filter(
    (s) => s.priority === "High",
  ).length;

  document.getElementById("medium-count").innerText = subjects.filter(
    (s) => s.priority === "Medium",
  ).length;

  document.getElementById("low-count").innerText = subjects.filter(
    (s) => s.priority === "Low",
  ).length;

  // Update tasks statistics
  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;

  // Calculate overdue tasks
  const now = new Date();
  const overdueTasks = tasks.filter((task) => {
    const taskDeadline = new Date(task.deadline);
    return taskDeadline < now && !task.completed;
  }).length;

  document.getElementById("dashboard-total-tasks").innerText = totalTasks;
  document.getElementById("dashboard-completed-tasks").innerText =
    completedTasks;
  document.getElementById("dashboard-overdue-tasks").innerText = overdueTasks;
}

// Initialize dashboard on page load
updateDashboard();

// Dashboard functionality
function updateDashboard() {
  const subjects = JSON.parse(localStorage.getItem("subjects") || "[]");

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
}

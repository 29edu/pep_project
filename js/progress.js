// Progress tracking with Chart.js
let taskChart = null;

function initChart() {
  const ctx = document.getElementById("taskChart");
  if (!ctx) return;

  taskChart = new Chart(ctx, {
    type: "doughnut",
    data: {
      labels: ["Completed Tasks", "Pending Tasks"],
      datasets: [
        {
          data: [0, 0],
          backgroundColor: [
            "#10b981", // Green for completed
            "#ef4444", // Red for pending
          ],
          borderWidth: 2,
          borderColor: "#ffffff",
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            padding: 20,
            font: {
              size: 14,
              family: "Arial, Helvetica, sans-serif",
            },
            color: "#1f2937",
          },
        },
        tooltip: {
          backgroundColor: "#1f2937",
          padding: 12,
          titleFont: {
            size: 14,
          },
          bodyFont: {
            size: 13,
          },
          callbacks: {
            label: function (context) {
              const label = context.label || "";
              const value = context.parsed || 0;
              const total = context.dataset.data.reduce((a, b) => a + b, 0);
              const percentage =
                total > 0 ? Math.round((value / total) * 100) : 0;
              return `${label}: ${value} (${percentage}%)`;
            },
          },
        },
      },
    },
  });
}

function updateProgress() {
  const tasks = JSON.parse(localStorage.getItem("tasks") || "[]");

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter((t) => t.completed).length;
  const pendingTasks = totalTasks - completedTasks;
  const percentage =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  // Update text values
  document.getElementById("progress-value").innerText = percentage + "%";
  document.getElementById("completed-tasks").innerText = completedTasks;
  document.getElementById("total-tasks").innerText = totalTasks;

  // Update chart
  if (taskChart) {
    taskChart.data.datasets[0].data = [completedTasks, pendingTasks];
    taskChart.update();
  }
}

// Initialize chart when DOM is loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => {
    initChart();
    // Small delay to ensure all scripts are loaded
    setTimeout(updateProgress, 100);
  });
} else {
  initChart();
  setTimeout(updateProgress, 100);
}

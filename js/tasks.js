// Tasks management
const taskForm = document.getElementById("task-form");
const taskTitleInput = document.getElementById("task-title");
const taskDeadlineInput = document.getElementById("task-deadline");
const taskTypeSelect = document.getElementById("task-type");
const taskPrioritySelect = document.getElementById("task-priority");

let tasks = [];
let currentFilter = "all";

// Task filter navigation
const taskFilters = document.querySelectorAll(".task-filter");
const taskFilterSections = document.querySelectorAll(".task-filter-section");

// Set All Tasks as active by default
taskFilters.forEach((filter) => {
  filter.addEventListener("click", () => {
    // Remove active class from all filters and sections
    taskFilters.forEach((f) => f.classList.remove("active"));
    taskFilterSections.forEach((s) => s.classList.remove("active"));

    // Add active class to clicked filter
    filter.classList.add("active");

    // Show corresponding filter section
    const selectedFilter = filter.dataset.filter;
    currentFilter = selectedFilter;

    const filterSection = document.querySelector(
      `.task-filter-section[data-filter="${selectedFilter}"]`,
    );
    if (filterSection) {
      filterSection.classList.add("active");
    }
  });
});

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const task = {
    title: taskTitleInput.value,
    deadline: taskDeadlineInput.value,
    type: taskTypeSelect.value,
    priority: taskPrioritySelect.value,
    completed: false,
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  updateProgress();
  updateDashboard();

  taskForm.reset();
});

function renderTasks() {
  // Clear all filter lists
  const allFilterLists = document.querySelectorAll(".filtered-task-list");
  allFilterLists.forEach((list) => {
    list.innerHTML = "";
  });

  const now = new Date();

  // Categorize tasks
  const allTasks = tasks;
  const incompleteTasks = tasks.filter((task) => !task.completed);
  const completedTasks = tasks.filter((task) => task.completed);
  const overdueTasks = tasks.filter((task) => {
    const taskDeadline = new Date(task.deadline);
    return taskDeadline < now && !task.completed;
  });

  // Render helper function
  function renderTaskItem(task, taskIndex, listElement) {
    const li = document.createElement("li");
    const taskDeadline = new Date(task.deadline);
    const isOverdue = taskDeadline < now && !task.completed;
    const isUpcoming = taskDeadline - now < 24 * 60 * 60 * 1000; // Less than 24 hours

    const formattedDate = taskDeadline.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    li.innerHTML = `
            <input type="checkbox" class="task-check" ${task.completed ? "checked" : ""}>
            <div class="task-info">
              <div class="task-title${task.completed ? " completed" : ""}">${task.title}</div>
              <div class="task-meta">
                <span class="task-type-badge type-${task.type.toLowerCase()}">${task.type}</span>
                <span class="task-priority-badge priority-${task.priority ? task.priority.toLowerCase() : "medium"}">${task.priority || "Medium"}</span>
                <span class="task-deadline${isOverdue ? " overdue" : isUpcoming ? " upcoming" : ""}">${formattedDate}</span>
              </div>
            </div>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

    const checkbox = li.querySelector(".task-check");
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      localStorage.setItem("tasks", JSON.stringify(tasks));
      updateProgress();
      updateDashboard();
      renderTasks();
    });

    const editBtn = li.querySelector(".edit-btn");
    editBtn.addEventListener("click", () => {
      taskTitleInput.value = task.title;
      const date = new Date(task.deadline);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      taskDeadlineInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
      taskTypeSelect.value = task.type;
      taskPrioritySelect.value = task.priority || "Medium";

      tasks.splice(taskIndex, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
      updateProgress();
      updateDashboard();

      taskTitleInput.focus();
    });

    const deleteBtn = li.querySelector(".delete-btn");
    deleteBtn.addEventListener("click", () => {
      tasks.splice(taskIndex, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
      updateProgress();
      updateDashboard();
    });

    listElement.appendChild(li);
  }

  // Render all tasks
  const allTasksList = document.querySelector(
    '.filtered-task-list[data-filter="all"]',
  );
  allTasks.forEach((task, index) => {
    renderTaskItem(task, tasks.indexOf(task), allTasksList);
  });

  // Render incomplete tasks
  const incompleteTasksList = document.querySelector(
    '.filtered-task-list[data-filter="incomplete"]',
  );
  incompleteTasks.forEach((task) => {
    renderTaskItem(task, tasks.indexOf(task), incompleteTasksList);
  });

  // Render completed tasks
  const completedTasksList = document.querySelector(
    '.filtered-task-list[data-filter="completed"]',
  );
  completedTasks.forEach((task) => {
    renderTaskItem(task, tasks.indexOf(task), completedTasksList);
  });

  // Render overdue tasks
  const overdueTasksList = document.querySelector(
    '.filtered-task-list[data-filter="overdue"]',
  );
  overdueTasks.forEach((task) => {
    renderTaskItem(task, tasks.indexOf(task), overdueTasksList);
  });

  // Show empty message for empty lists
  allFilterLists.forEach((list) => {
    if (list.children.length === 0) {
      const emptyMessage = document.createElement("li");
      emptyMessage.style.textAlign = "center";
      emptyMessage.style.color = "#9ca3af";
      emptyMessage.style.fontStyle = "italic";
      emptyMessage.style.padding = "20px";
      emptyMessage.style.border = "none";
      emptyMessage.innerHTML = "No tasks in this category";
      list.appendChild(emptyMessage);
    }
  });

  // Update progress after rendering tasks
  updateProgress();
  updateDashboard();
}

const savedTasks = localStorage.getItem("tasks");

if (savedTasks) {
  tasks = JSON.parse(savedTasks);
  renderTasks();
}

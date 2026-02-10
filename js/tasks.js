// Tasks management
const taskForm = document.getElementById("task-form");
const taskTitleInput = document.getElementById("task-title");
const taskDeadlineInput = document.getElementById("task-deadline");
const taskTypeSelect = document.getElementById("task-type");
const taskList = document.getElementById("task-list");
const overdueTaskList = document.getElementById("overdue-task-list");
const overdueSection = document.getElementById("overdue-section");

let tasks = [];

taskForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const task = {
    title: taskTitleInput.value,
    deadline: taskDeadlineInput.value,
    type: taskTypeSelect.value,
    completed: false,
  };

  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  renderTasks();
  updateProgress();

  taskForm.reset();
});

function renderTasks() {
  taskList.innerHTML = "";
  overdueTaskList.innerHTML = "";
  console.log("renderTasks called", tasks);
  const now = new Date();

  const overdueTasks = [];
  const activeTasks = [];

  // Separate tasks into overdue and active
  tasks.forEach((task) => {
    const taskDeadline = new Date(task.deadline);
    if (taskDeadline < now && !task.completed) {
      overdueTasks.push(task);
    } else {
      activeTasks.push(task);
    }
  });

  // Update counts
  document.getElementById("overdue-count").innerText = overdueTasks.length;
  document.getElementById("active-count").innerText = activeTasks.length;

  // Show or hide overdue section
  if (overdueTasks.length > 0) {
    overdueSection.style.display = "block";
  } else {
    overdueSection.style.display = "none";
  }

  // Render overdue tasks
  overdueTasks.forEach((task, index) => {
    const taskIndex = tasks.indexOf(task);
    const li = document.createElement("li");
    const taskDeadline = new Date(task.deadline);
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
              <div class="task-title">${task.title}</div>
              <div class="task-meta">
                <span class="task-type-badge type-${task.type.toLowerCase()}">${task.type}</span>
                <span class="task-deadline overdue">${formattedDate}</span>
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
      renderTasks();
    });

    const editBtn = li.querySelector(".edit-btn");

    editBtn.addEventListener("click", () => {
      taskTitleInput.value = task.title;
      // Format datetime for datetime-local input (YYYY-MM-DDTHH:mm)
      const date = new Date(task.deadline);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      taskDeadlineInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
      taskTypeSelect.value = task.type;

      tasks.splice(taskIndex, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
      updateProgress();

      taskTitleInput.focus();
    });

    const deleteBtn = li.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", () => {
      tasks.splice(taskIndex, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
      updateProgress();
    });

    overdueTaskList.appendChild(li);
  });

  // Render active tasks
  activeTasks.forEach((task, index) => {
    const taskIndex = tasks.indexOf(task);
    const li = document.createElement("li");
    const taskDeadline = new Date(task.deadline);
    const now = new Date();
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
                <span class="task-deadline${isUpcoming ? " upcoming" : ""}">${formattedDate}</span>
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
      renderTasks();
    });

    const editBtn = li.querySelector(".edit-btn");

    editBtn.addEventListener("click", () => {
      taskTitleInput.value = task.title;
      // Format datetime for datetime-local input (YYYY-MM-DDTHH:mm)
      const date = new Date(task.deadline);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      taskDeadlineInput.value = `${year}-${month}-${day}T${hours}:${minutes}`;
      taskTypeSelect.value = task.type;

      tasks.splice(taskIndex, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
      updateProgress();

      taskTitleInput.focus();
    });

    const deleteBtn = li.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", () => {
      tasks.splice(taskIndex, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
      updateProgress();
    });

    taskList.appendChild(li);
  });

  // Show message if no active tasks
  if (activeTasks.length === 0) {
    const emptyMessage = document.createElement("li");
    emptyMessage.style.textAlign = "center";
    emptyMessage.style.color = "#9ca3af";
    emptyMessage.style.fontStyle = "italic";
    emptyMessage.style.padding = "20px";
    emptyMessage.style.border = "none";
    emptyMessage.innerHTML = "No active tasks. Add a task to get started! 📝";
    taskList.appendChild(emptyMessage);
  }

  // Update progress after rendering tasks
  updateProgress();
}

const savedTasks = localStorage.getItem("tasks");

if (savedTasks) {
  tasks = JSON.parse(savedTasks);
  renderTasks();
}

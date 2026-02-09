const navItems = document.querySelectorAll("nav ul li");
const sections = document.querySelectorAll("main section");

// Set Dashboard as active by default
navItems[0].classList.add("active");

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    console.log(item.innerText);
  });
});

navItems.forEach((item) => {
  item.addEventListener("click", () => {
    navItems.forEach((nav) => nav.classList.remove("active"));

    sections.forEach((section) => (section.style.display = "none"));

    item.classList.add("active");

    const sectionId = item.innerText.toLowerCase();

    document.getElementById(sectionId).style.display = "block";
  });
});

// Subjects
let subjects = []; // to hold subjects

const subjectForm = document.getElementById("subject-form");
const subjectNameInput = document.getElementById("subject-name");
const subjectPrioritySelect = document.getElementById("subject-priority");
const subjectList = document.getElementById("subject-list");

// submit form for subjects
subjectForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const subjectName = subjectNameInput.value;
  const subjectPriority = subjectPrioritySelect.value;

  const subject = {
    name: subjectName,
    priority: subjectPriority,
  };

  subjects.push(subject);

  localStorage.setItem("subjects", JSON.stringify(subjects));

  renderSubjects();

  subjectNameInput.value = "";
});

// Display the added subjects on the screen
function renderSubjects() {
  subjectList.innerHTML = "";

  subjects.forEach((sub, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
            <span>${sub.name} 
            <span class="priority-${sub.priority.toLowerCase()}">
                (${sub.priority})
            </span></span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

    const editBtn = li.querySelector(".edit-btn");

    editBtn.addEventListener("click", () => {
      subjectNameInput.value = sub.name;
      subjectPrioritySelect.value = sub.priority;

      subjects.splice(index, 1);
      localStorage.setItem("subjects", JSON.stringify(subjects));
      renderSubjects();

      subjectNameInput.focus();
    });

    const deleteBtn = li.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", () => {
      subjects.splice(index, 1);
      localStorage.setItem("subjects", JSON.stringify(subjects));
      renderSubjects();
    });

    subjectList.appendChild(li);
  });

  updateDashboard();
}

// loading data from local storage
const savedSubjects = localStorage.getItem("subjects");

if (savedSubjects) {
  subjects = JSON.parse(savedSubjects);
  renderSubjects();
}

// Dashboard
function updateDashboard() {
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

// Schedule
let schedules = [];

const scheduleForm = document.getElementById("schedule-form");
const scheduleSubjectInput = document.getElementById("schedule-subject");
const scheduleDaySelect = document.getElementById("schedule-day");
const startTimeInput = document.getElementById("start-time");
const endTimeInput = document.getElementById("end-time");
const scheduleList = document.getElementById("schedule-list");

scheduleForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const schedule = {
    subject: scheduleSubjectInput.value,
    day: scheduleDaySelect.value,
    startTime: startTimeInput.value,
    endTime: endTimeInput.value,
  };

  schedules.push(schedule);
  localStorage.setItem("schedules", JSON.stringify(schedules));
  renderSchedules();

  scheduleForm.reset();
});

function renderSchedules() {
  scheduleList.innerHTML = "";

  schedules.forEach((schedule, index) => {
    const li = document.createElement("li");

    li.innerHTML = `
            <span><strong>${schedule.day}</strong>: ${schedule.subject} 
            (${schedule.startTime} - ${schedule.endTime})</span>
            <button class="edit-btn">Edit</button>
            <button class="delete-btn">Delete</button>
        `;

    const editBtn = li.querySelector(".edit-btn");

    editBtn.addEventListener("click", () => {
      scheduleSubjectInput.value = schedule.subject;
      scheduleDaySelect.value = schedule.day;
      startTimeInput.value = schedule.startTime;
      endTimeInput.value = schedule.endTime;

      schedules.splice(index, 1);
      localStorage.setItem("schedules", JSON.stringify(schedules));
      renderSchedules();

      scheduleSubjectInput.focus();
    });

    const deleteBtn = li.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", () => {
      schedules.splice(index, 1);
      localStorage.setItem("schedules", JSON.stringify(schedules));
      renderSchedules();
    });

    scheduleList.appendChild(li);
  });
}

const savedSchedules = localStorage.getItem("schedules");

if (savedSchedules) {
  schedules = JSON.parse(savedSchedules);
  renderSchedules();
}

// Handling Tasks
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

      taskTitleInput.focus();
    });

    const deleteBtn = li.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", () => {
      tasks.splice(taskIndex, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
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

      taskTitleInput.focus();
    });

    const deleteBtn = li.querySelector(".delete-btn");

    deleteBtn.addEventListener("click", () => {
      tasks.splice(taskIndex, 1);
      localStorage.setItem("tasks", JSON.stringify(tasks));
      renderTasks();
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
}

const savedTasks = localStorage.getItem("tasks");

if (savedTasks) {
  tasks = JSON.parse(savedTasks);
  renderTasks();
}

// Progress
function updateProgress() {
  if (tasks.length === 0) return;

  const completedTasks = tasks.filter((t) => t.completed).length;
  const percentage = Math.round((completedTasks / tasks.length) * 100);

  document.getElementById("progress-value").innerText = percentage + "%";
}

// Setting
const resetBtn = document.getElementById("reset-data-btn");

resetBtn.addEventListener("click", () => {
  const confirmReset = confirm(
    "Are you sure you want to delete all subjects, schedules, and tasks?",
  );

  if (!confirmReset) return;

  // clear localStorage
  localStorage.removeItem("subjects");
  localStorage.removeItem("schedules");
  localStorage.removeItem("tasks");

  // clear arrays
  subjects = [];
  schedules = [];
  tasks = [];

  // update UI
  renderSubjects();
  renderSchedules();
  renderTasks();
  updateDashboard();

  alert("All data has been reset successfully!");
});

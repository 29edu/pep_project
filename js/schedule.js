// Schedule management
let schedules = [];

const scheduleForm = document.getElementById("schedule-form");
const scheduleSubjectInput = document.getElementById("schedule-subject");
const scheduleDaySelect = document.getElementById("schedule-day");
const startTimeInput = document.getElementById("start-time");
const endTimeInput = document.getElementById("end-time");

// Day navigation
const dayTabs = document.querySelectorAll(".day-tab");
const daySchedules = document.querySelectorAll(".day-schedule");

// Set Monday as active by default
let currentDay = "Monday";

// Day tab switching
dayTabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    // Remove active class from all tabs and schedules
    dayTabs.forEach((t) => t.classList.remove("active"));
    daySchedules.forEach((s) => s.classList.remove("active"));

    // Add active class to clicked tab
    tab.classList.add("active");

    // Show corresponding day schedule
    const selectedDay = tab.dataset.day;
    currentDay = selectedDay;

    const daySchedule = document.querySelector(
      `.day-schedule[data-day="${selectedDay}"]`,
    );
    if (daySchedule) {
      daySchedule.classList.add("active");
    }
  });
});

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
  // Clear all schedule lists
  const allScheduleLists = document.querySelectorAll(".schedule-list");
  allScheduleLists.forEach((list) => {
    list.innerHTML = "";
  });

  // Render schedules for each day
  schedules.forEach((schedule, index) => {
    const scheduleList = document.querySelector(
      `.schedule-list[data-day="${schedule.day}"]`,
    );
    if (!scheduleList) return;

    const li = document.createElement("li");

    li.innerHTML = `
            <span>${schedule.subject} 
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

  // Show empty message for days with no schedules
  allScheduleLists.forEach((list) => {
    if (list.children.length === 0) {
      const emptyMessage = document.createElement("li");
      emptyMessage.style.textAlign = "center";
      emptyMessage.style.color = "#9ca3af";
      emptyMessage.style.fontStyle = "italic";
      emptyMessage.style.padding = "20px";
      emptyMessage.style.border = "none";
      emptyMessage.innerHTML = "No classes scheduled for this day";
      list.appendChild(emptyMessage);
    }
  });
}

const savedSchedules = localStorage.getItem("schedules");

if (savedSchedules) {
  schedules = JSON.parse(savedSchedules);
  renderSchedules();
}

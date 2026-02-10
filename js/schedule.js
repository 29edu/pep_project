// Schedule management
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

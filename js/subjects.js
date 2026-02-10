// Subjects management
let subjects = [];

const subjectForm = document.getElementById("subject-form");
const subjectNameInput = document.getElementById("subject-name");
const subjectPrioritySelect = document.getElementById("subject-priority");
const subjectList = document.getElementById("subject-list");

// Submit form for subjects
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

// Loading data from local storage
const savedSubjects = localStorage.getItem("subjects");

if (savedSubjects) {
  subjects = JSON.parse(savedSubjects);
  renderSubjects();
}

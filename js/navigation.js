// Navigation functionality
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

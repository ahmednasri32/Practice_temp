const navLinks = document.querySelectorAll("header ul li a");
const toggleMenu = document.querySelector(".toggle-menu");
const nav = document.querySelector(".nav-links");
const sections = document.querySelectorAll("section");
const form = document.querySelector(".contact-form");
const successMsg = document.querySelector(".form-success");
const themeToggle = document.querySelector(".theme-toggle");
const body = document.body;
const icon = themeToggle.querySelector("i");

toggleMenu.addEventListener("click", (e) => {
  e.stopPropagation(); 
  nav.classList.toggle("open");
});

document.addEventListener("click", (e) => {
  if (
    !e.target.closest(".nav-links") &&
    !e.target.closest(".toggle-menu")
    ) {
    nav.classList.remove("open");
  }
});
navLinks.forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
  });
});
/*=====================
active Link on Scroll
======================*/
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute("id");

        navLinks.forEach(link => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    });
  },
  {
    root: null,
    threshold: 0.6, // 60% من القسم ظاهر
  }
);
sections.forEach(section => observer.observe(section));

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let isValid = true;
  successMsg.textContent = "";

  const fields = form.querySelectorAll("input, textarea");

  fields.forEach(field => {
    const error = field.nextElementSibling;

    if (!field.value.trim()) {
      error.textContent = "this field is required";
      isValid = false;
    } else {
      error.textContent = "";
    }
    if (field.type === "email" && field.value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        error.textContent = "Please enter a valid email";
        isValid = false
      }
    }
  });

  if (isValid) {
    successMsg.textContent = "Message sent successfully!";
    form.reset();
  }
});

/* تحميل الوضع المحفوظ */
if (localStorage.getItem("theme") === "dark") {
  body.classList.add("dark");
  icon.classList.replace("fa-moon", "fa-sun");
}

/* تبديل الوضع */
themeToggle.addEventListener("click", () => {
  body.classList.toggle("dark");

  const isDark = body.classList.contains("dark");
  icon.classList.toggle("fa-sun", isDark);
  icon.classList.toggle("fa-moon", !isDark);

  localStorage.setItem("theme", "light");
});

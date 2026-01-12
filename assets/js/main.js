document.addEventListener("DOMContentLoaded", () => {

  /* =====================
     Elements
  ===================== */
  const navLinks = document.querySelectorAll("header ul li a");
  const toggleMenu = document.querySelector(".toggle-menu");
  const nav = document.querySelector(".nav-links");
  const sections = document.querySelectorAll("section");
  const form = document.querySelector(".contact-form");
  const successMsg = document.querySelector(".form-success");
  const themeToggle = document.querySelector(".theme-toggle");
  const body = document.body;
  const icon = themeToggle.querySelector("i");
  const revealElements = document.querySelectorAll(".reveal");

  /* =====================
     Mobile Menu
  ===================== */
  toggleMenu.addEventListener("click", (e) => {
    e.stopPropagation();
    nav.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".nav-links") && !e.target.closest(".toggle-menu")) {
      nav.classList.remove("open");
    }
  });

  navLinks.forEach(link => {
    link.addEventListener("click", () => nav.classList.remove("open"));
  });

  /* =====================
     Active Link on Scroll
  ===================== */
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${id}`
          );
        });
      }
    });
  }, { threshold: 0.6 });

  sections.forEach(section => observer.observe(section));

  /* =====================
     Contact Form
  ===================== */
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    let isValid = true;
    successMsg.textContent = "";

    const fields = form.querySelectorAll("input, textarea");

    fields.forEach(field => {
      const error = field.nextElementSibling;
      if (!field.value.trim()) {
        error.textContent = "This field is required";
        isValid = false;
      } else {
        error.textContent = "";
      }
    });

    if (!isValid) return;

    emailjs.sendForm(
      "YOUR_SERVICE_ID",
      "YOUR_TEMPLATE_ID",
      form
    )
    .then(() => {
      successMsg.textContent = "Message sent successfully!";
      successMsg.className = "form-success error";
      form.reset();
    })
    .catch(() => {
      successMsg.textContent = "Something went wrong. Try again.";
      successMsg.className = "form-success error";
    });
  });

  /* =====================
     Dark Mode
  ===================== */
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  setTheme(savedTheme ? savedTheme === "dark" : prefersDark);

  themeToggle.addEventListener("click", () => {
    setTheme(!body.classList.contains("dark"));
  });

  function setTheme(isDark) {
    body.classList.toggle("dark", isDark);
    icon.classList.toggle("fa-sun", isDark);
    icon.classList.toggle("fa-moon", !isDark);
    localStorage.setItem("theme", isDark ? "dark" : "light");
    themeToggle.setAttribute("aria-pressed", isDark);
  }

  /* =====================
     Reveal Animation
  ===================== */
  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach(el => revealObserver.observe(el));

});

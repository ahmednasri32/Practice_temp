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
  toggleMenu.addEventListener("click", e => {
    e.stopPropagation();
    nav.classList.toggle("open");
  });

  document.addEventListener("click", e => {
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
          link.classList.toggle("active", link.getAttribute("href") === `#${id}`);
        });
      }
    });
  }, { threshold: 0.6 });

  sections.forEach(section => observer.observe(section));

  /* =====================
     Contact Form (FormSubmit)
  ===================== */
  function showMessage(text, type) {
    successMsg.textContent = text;
    successMsg.className = `form-success ${type} show`;

    // اختفاء الرسالة تلقائيًا بعد 5 ثواني
    setTimeout(() => {
      successMsg.classList.remove("show");
      // إعادة تعيين النص بعد الاختفاء
      successMsg.textContent = "";
    }, 5000);
  }

  form.addEventListener("submit", e => {
    e.preventDefault();

    showMessage("Sending...", "sending");

    let valid = true;
    form.querySelectorAll("input, textarea").forEach(field => {
      const error = field.nextElementSibling;
      if (!field.value.trim()) {
        error.textContent = "This field is required";
        valid = false;
      } else {
        error.textContent = "";
      }
    });

    if (!valid) {
      successMsg.textContent = "";
      successMsg.className = "form-success";
      return;
    }

    const formData = new FormData(form);
    fetch(form.action, {
      method: "POST",
      body: formData,
      headers: { "Accept": "application/json" }
    })
    .then(res => {
      if (res.ok) return res.json();
      else throw new Error("Network response was not ok");
    })
    .then(data => {
      showMessage("Message sent successfully!", "success");
      form.reset();
    })
    .catch(err => {
      showMessage("Something went wrong. Try again.", "error");
      console.error(err);
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
     Reveal Animations
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

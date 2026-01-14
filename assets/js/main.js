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
  const track = document.querySelector(".testimonial-track");
  const slides = document.querySelectorAll(".testimonial-card");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");

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

  // تحقق فوري أثناء الكتابة
form.querySelectorAll("input, textarea").forEach(field => {
  field.addEventListener("input", () => {
    const error = field.parentElement.querySelector(".error-msg");
    const checkIcon = field.parentElement.querySelector(".valid-icon");
    const value = field.value.trim();

    // 🔴 الحقل فارغ
    if (!value) {
      error.textContent = "This field is required";
      field.style.borderColor = "#dc2626";

      if (checkIcon) checkIcon.style.display = "none";
      return;
    }

    // ✉️ حقل الإيميل
    if (field.type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(value)) {
        error.textContent = "Please enter a valid email address";
        field.style.borderColor = "#dc2626";

        if (checkIcon) checkIcon.style.display = "none";
        return;
      }
    }

    // ✅ صحيح (لكل الحقول)
    error.textContent = "";
    field.style.borderColor = "#22c55e";

    if (checkIcon) {
      checkIcon.style.display = "block";
      checkIcon.style.animation = "none";
      checkIcon.offsetHeight; // force reflow
      checkIcon.style.animation = "pop 0.35s ease forwards";
    }
  });
});

  form.addEventListener("submit", e => {
    e.preventDefault();

    showMessage("Sending...", "sending");

    let valid = true;
    form.querySelectorAll("input, textarea").forEach(field => {
      const error = field.parentElement.querySelector(".error-msg");
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

      // 🔄 Reset validation UI
      form.querySelectorAll("input, textarea").forEach(field => {
        field.style.borderColor = "#ddd";

        const error = field.parentElement.querySelector(".error-msg");
        const checkIcon = field.parentElement.querySelector(".valid-icon");

        if (error) error.textContent = "";
        if (checkIcon) checkIcon.style.display = "none";
      });

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

  /* =====================
    Testimonials Slider (Stable)
  ===================== */
  if (track && slides.length > 0) {

    let index = 1;
    let isMoving = false;
    const intervalTime = 5000;

    const slidesArray = Array.from(slides);

    /* Clone first & last */
    const firstClone = slidesArray[0].cloneNode(true);
    const lastClone  = slidesArray[slidesArray.length - 1].cloneNode(true);

    track.appendChild(firstClone);
    track.insertBefore(lastClone, slidesArray[0]);

    const allSlides = document.querySelectorAll(".testimonial-card");

    /* Initial position */
    track.style.transition = "none";
    track.style.transform = "translateX(-100%)";

    function moveSlider() {
      isMoving = true;
      track.style.transition = "transform 0.6s ease";
      track.style.transform = `translateX(-${index * 100}%)`;
    }

    /* Next */
    nextBtn.addEventListener("click", () => {
      if (isMoving) return;
      index++;
      moveSlider();
      resetAutoSlide();
    });

    /* Prev */
    prevBtn.addEventListener("click", () => {
      if (isMoving) return;
      index--;
      moveSlider();
      resetAutoSlide();
    });

    /* Infinite fix */
    track.addEventListener("transitionend", () => {
      isMoving = false;

      if (allSlides[index] === firstClone) {
        track.style.transition = "none";
        index = 1;
        track.style.transform = "translateX(-100%)";
      }

      if (allSlides[index] === lastClone) {
        track.style.transition = "none";
        index = allSlides.length - 2;
        track.style.transform = `translateX(-${index * 100}%)`;
      }
    });

    /* Auto Slide */
    let autoSlide = setInterval(() => {
      index++;
      moveSlider();
    }, intervalTime);

    function resetAutoSlide() {
      clearInterval(autoSlide);
      autoSlide = setInterval(() => {
        index++;
        moveSlider();
      }, intervalTime);
    }
    /* =====================
        Swipe Support (Mobile)
      =====================*/
      let startX = 0;
      let endX = 0;
      const swipeThrehold = 50; // مسافة السحب المطلوبة
      track.addEventListener("touchstart", e => {
        startX = e.touches[0].clientX;
      });

      track.addEventListener("touchmove", e => {
        endX = e.touches[0].clientX;
      });
      track.addEventListener("touchend", () => {
        const diff = startX - endX;

        if (Math.abs(diff) > swipeThrehold && !isMoving) {
          if (diff > 0) {
            // Swipe Left → Next
            index++;
          } else {
            // Swipe Right → Prev
            index--;
          }
          moveSlider();
          resetAutoSlide();
        }

        startX = endX = 0;
      });
  }
});
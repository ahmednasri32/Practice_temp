const navLinks = document.querySelectorAll("header ul li a");

// Active عند الضغط
navLinks.forEach(link => {
  link.addEventListener("click", function () {
    navLinks.forEach(l => l.classList.remove("active"));
    this.classList.add("active");
  });
});

// 3️⃣ Toggle للـ menu في الجوال (اختياري)
const toggleMenu = document.querySelector(".toggle-menu");
const nav = document.querySelector(".nav-links");

toggleMenu.addEventListener("click", () => {
  nav.classList.toggle("open"); // تضيف class "show" لعرض القائمة
});
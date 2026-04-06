document.addEventListener("DOMContentLoaded", () => {

  /* ===============================
     ACTIVE NAV LINK
  =============================== */
  const currentPath = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav a").forEach(link => {
    if (link.getAttribute("href") === currentPath) {
      link.classList.add("active");
    }
  });


  /* ===============================
     HAMBURGER MENU
  =============================== */
  const hamburger = document.querySelector(".hamburger");
  const nav = document.querySelector(".nav");

  if (hamburger && nav) {
    hamburger.addEventListener("click", () => {
      nav.classList.toggle("active");
    });

    document.querySelectorAll(".nav a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("active");
      });
    });
  }


  /* ===============================
     REVEAL ON SCROLL
  =============================== */
  const revealItems = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
      }
    });
  }, { threshold: 0.2 });

  revealItems.forEach(el => revealObserver.observe(el));


  /* ===============================
     COUNTER ANIMATION
  =============================== */
  const counters = document.querySelectorAll("[data-count]");

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;

      const el = entry.target;
      const target = +el.dataset.count;
      let count = 0;

      const update = () => {
        count += Math.ceil(target / 50);
        if (count >= target) {
          el.textContent = target + "+";
        } else {
          el.textContent = count + "+";
          requestAnimationFrame(update);
        }
      };

      update();
      counterObserver.unobserve(el);
    });
  });

  counters.forEach(el => counterObserver.observe(el));


  /* ===============================
     HEADER SCROLL EFFECT
  =============================== */
  const header = document.querySelector(".header");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const current = window.scrollY;

    if (!header) return;

    header.classList.toggle("scrolled", current > 50);

    if (current > lastScroll && current > 150) {
      header.style.transform = "translateY(-100%)";
    } else {
      header.style.transform = "translateY(0)";
    }

    lastScroll = current;
  });


  /* ===============================
     PROGRESS BAR
  =============================== */
  const progressBar = document.getElementById("progress-bar");

  window.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const percent = (scrollTop / height) * 100;

    if (progressBar) progressBar.style.width = percent + "%";
  });


  /* ===============================
     HERO SLIDER (CLEAN VERSION)
  =============================== */
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");

  let currentSlide = 0;
  let sliderInterval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle("active", i === index);
      if (dots[i]) dots[i].classList.toggle("active", i === index);
    });
    currentSlide = index;
  }

  function nextSlide() {
    showSlide((currentSlide + 1) % slides.length);
  }

  function prevSlide() {
    showSlide((currentSlide - 1 + slides.length) % slides.length);
  }

  function startSlider() {
    sliderInterval = setInterval(nextSlide, 5000); // 5 seconds (GOOD speed)
  }

  function stopSlider() {
    clearInterval(sliderInterval);
  }

  if (slides.length > 0) {
    showSlide(0);
    startSlider();

    nextBtn?.addEventListener("click", nextSlide);
    prevBtn?.addEventListener("click", prevSlide);

    dots.forEach((dot, i) => {
      dot.addEventListener("click", () => showSlide(i));
    });

    const slider = document.querySelector(".hero-slider");
    slider?.addEventListener("mouseenter", stopSlider);
    slider?.addEventListener("mouseleave", startSlider);

    document.addEventListener("keydown", e => {
      if (e.key === "ArrowRight") nextSlide();
      if (e.key === "ArrowLeft") prevSlide();
    });
  }


  /* ===============================
     THEME TOGGLE
  =============================== */
  const toggle = document.querySelector(".theme-toggle");
  const icon = document.querySelector(".theme-icon");

  if (localStorage.getItem("theme") === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    if (icon) icon.textContent = "🌙";
  }

  toggle?.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";

    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      if (icon) icon.textContent = "☀️";
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      if (icon) icon.textContent = "🌙";
    }
  });


  /* ===============================
     CHATBOT
  =============================== */
  const chatInput = document.getElementById("chat-input");
  const chatBody = document.getElementById("chat-body");

  chatInput?.addEventListener("keypress", e => {
    if (e.key === "Enter") {
      const msg = chatInput.value.trim();
      if (!msg) return;

      chatBody.innerHTML += `<p><strong>You:</strong> ${msg}</p>`;

      let reply = "We will get back to you soon 😊";

      if (msg.toLowerCase().includes("donate")) {
        reply = "You can donate via the Support page 💙";
      }

      chatBody.innerHTML += `<p><strong>Bot:</strong> ${reply}</p>`;
      chatInput.value = "";
    }
  });


  /* ===============================
     FORM SAVE (LOCAL)
  =============================== */
  window.saveMessage = function(e) {
    e.preventDefault();

    const form = e.target;
    const data = {
      name: form[0].value,
      email: form[1].value,
      message: form[2].value
    };

    const messages = JSON.parse(localStorage.getItem("messages")) || [];
    messages.push(data);

    localStorage.setItem("messages", JSON.stringify(messages));

    alert("Message saved!");
    form.reset();
  };

});
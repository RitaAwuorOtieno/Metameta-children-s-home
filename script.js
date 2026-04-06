document.addEventListener('DOMContentLoaded', () => {

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
  const hamburger = document.querySelector('.hamburger');
  const nav = document.querySelector('.nav');

  if (hamburger && nav) {
    hamburger.addEventListener('click', () => {
      const isOpen = nav.classList.toggle('active');
      hamburger.setAttribute('aria-expanded', isOpen);
    });

    // Close on link click
    document.querySelectorAll(".nav a").forEach(link => {
      link.addEventListener('click', () => {
        nav.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });

    // Close on outside click
    document.addEventListener('click', (e) => {
      if (!nav.contains(e.target) && !hamburger.contains(e.target)) {
        nav.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });

    // Close on ESC
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        nav.classList.remove('active');
        hamburger.setAttribute('aria-expanded', 'false');
      }
    });
  }


  /* ===============================
     REVEAL ON SCROLL
  =============================== */
  const revealItems = document.querySelectorAll(".reveal");

  if (revealItems.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.2 });

    revealItems.forEach(el => observer.observe(el));
  }


  /* ===============================
     COUNTER ANIMATION
  =============================== */
  const counters = document.querySelectorAll("[data-count]");

  if (counters.length) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const el = entry.target;
        const target = +el.dataset.count;
        const suffix = el.dataset.suffix || "";
        let current = 0;
        const step = Math.ceil(target / 60);

        const update = () => {
          current += step;
          if (current >= target) {
            el.textContent = target.toLocaleString() + suffix;
          } else {
            el.textContent = current.toLocaleString() + suffix;
            requestAnimationFrame(update);
          }
        };

        update();
        obs.unobserve(el);
      });
    }, { threshold: 0.6 });

    counters.forEach(el => observer.observe(el));
  }


  /* ===============================
     HEADER SCROLL EFFECT
  =============================== */
  const header = document.querySelector('.header');
  let lastScroll = 0;

  window.addEventListener('scroll', () => {
    const current = window.scrollY;

    if (!header) return;

    header.classList.toggle('scrolled', current > 50);

    // Hide on scroll down
    if (current > lastScroll && current > 150) {
      header.style.transform = 'translateY(-100%)';
    } else {
      header.style.transform = 'translateY(0)';
    }

    lastScroll = current;
  });

  const menuBtn = document.querySelector(".menu-toggle");

if (menuBtn) {
  menuBtn.addEventListener("click", () => {
    nav.classList.toggle("active");
  });
}

window.addEventListener("scroll", () => {
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;

    const scrolled = (scrollTop / scrollHeight) * 100;

    document.getElementById("progress-bar").style.width = scrolled + "%";
});

function simulatePayment() {
  const status = document.getElementById("payment-status");
  status.textContent = "Processing payment...";

  setTimeout(() => {
    status.textContent = "✅ Payment request sent to your phone!";
  }, 2000);
}


  /* ===============================
     HERO SLIDER
  =============================== */
  const slides = document.querySelectorAll('.slide');
  const dots = document.querySelectorAll('.dot');
  const prevBtn = document.querySelector('.slider-prev');
  const nextBtn = document.querySelector('.slider-next');

  let currentSlide = 0;
  let interval;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
      if (dots[i]) dots[i].classList.toggle('active', i === index);
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
    interval = setInterval(nextSlide, 5000);
  }

  function stopSlider() {
    clearInterval(interval);
  }

  if (slides.length > 0) {
    showSlide(0);
    startSlider();

    nextBtn?.addEventListener('click', nextSlide);
    prevBtn?.addEventListener('click', prevSlide);

    dots.forEach((dot, i) => {
      dot.addEventListener('click', () => showSlide(i));
    });

    const slider = document.querySelector('.hero-slider');
    slider?.addEventListener('mouseenter', stopSlider);
    slider?.addEventListener('mouseleave', startSlider);

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight') nextSlide();
      if (e.key === 'ArrowLeft') prevSlide();
    });
  }


  /* ===============================
     THEME TOGGLE
  =============================== */
  const toggle = document.querySelector('.theme-toggle');
  const icon = document.querySelector('.theme-icon');

  const savedTheme = localStorage.getItem('theme');

  if (savedTheme === 'dark') {
    document.documentElement.setAttribute('data-theme', 'dark');
    if (icon) icon.textContent = '🌙';
  }

  toggle?.addEventListener('click', () => {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';

    if (isDark) {
      document.documentElement.removeAttribute('data-theme');
      if (icon) icon.textContent = '☀️';
      localStorage.setItem('theme', 'light');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
      if (icon) icon.textContent = '🌙';
      localStorage.setItem('theme', 'dark');
    }
  });


  /* ===============================
     SMOOTH SCROLL
  =============================== */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    });
  });

});

const chatInput = document.getElementById("chat-input");
const chatBody = document.getElementById("chat-body");

chatInput.addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    const msg = chatInput.value;
    chatBody.innerHTML += `<p><strong>You:</strong> ${msg}</p>`;

    let reply = "We will get back to you soon 😊";

    if (msg.toLowerCase().includes("donate")) {
      reply = "You can donate via the Support page 💙";
    }

    chatBody.innerHTML += `<p><strong>Bot:</strong> ${reply}</p>`;
    chatInput.value = "";
  }
});

function saveMessage(e) {
  e.preventDefault();

  const name = e.target[0].value;
  const email = e.target[1].value;
  const message = e.target[2].value;

  const data = { name, email, message };

  let messages = JSON.parse(localStorage.getItem("messages")) || [];
  messages.push(data);

  localStorage.setItem("messages", JSON.stringify(messages));

  alert("Message saved!");
}

const slides = document.querySelectorAll(".slide");
const dots = document.querySelectorAll(".dot");
const nextBtn = document.querySelector(".next");
const prevBtn = document.querySelector(".prev");

let current = 0;
let interval;

/* SHOW SLIDE */
function showSlide(index) {
  slides.forEach((slide, i) => {
    slide.classList.toggle("active", i === index);
    dots[i].classList.toggle("active", i === index);
  });
  current = index;
}

/* NEXT / PREV */
function nextSlide() {
  showSlide((current + 1) % slides.length);
}

function prevSlide() {
  showSlide((current - 1 + slides.length) % slides.length);
}

/* AUTO SLIDE */
function startSlider() {
  interval = setInterval(nextSlide, 1000);
}

function stopSlider() {
  clearInterval(interval);
}

/* EVENTS */
nextBtn?.addEventListener("click", nextSlide);
prevBtn?.addEventListener("click", prevSlide);

dots.forEach((dot, i) => {
  dot.addEventListener("click", () => showSlide(i));
});

/* PAUSE ON HOVER */
const slider = document.querySelector(".hero-slider");
slider?.addEventListener("mouseenter", stopSlider);
slider?.addEventListener("mouseleave", startSlider);

/* INIT */
showSlide(0);
startSlider();
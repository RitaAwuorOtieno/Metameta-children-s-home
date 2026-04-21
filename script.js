// ===============================
// FIREBASE INIT
// ===============================
const firebaseConfig = {
  apiKey: "AIzaSyDjZjgSoVNXjIKVui9ZG1K6nrqi6HEFK8g",
  authDomain: "metameta-82db5.firebaseapp.com",
  databaseURL: "https://metameta-82db5-default-rtdb.firebaseio.com",
  projectId: "metameta-82db5",
  storageBucket: "metameta-82db5.firebasestorage.app",
  messagingSenderId: "153087607234",
  appId: "1:153087607234:web:b0883c1c192fe06447965b"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Database reference
const db = firebase.database();


// ===============================
// RUN AFTER PAGE LOAD
// ===============================
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
     MOBILE MENU
  =============================== */
  const menuBtn = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav");

  // if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
  // }


  /* ===============================
     REVEAL ON SCROLL
  =============================== */
  const revealItems = document.querySelectorAll(".reveal");

  if (revealItems.length > 0) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("active");
        }
      });
    }, { threshold: 0.2 });

    revealItems.forEach(el => observer.observe(el));
  }


  /* ===============================
     COUNTER ANIMATION
  =============================== */
  const counters = document.querySelectorAll("[data-count]");

  if (counters.length > 0) {
    const observer = new IntersectionObserver(entries => {
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
        observer.unobserve(el);
      });
    });

    counters.forEach(el => observer.observe(el));
  }


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
    if (!progressBar) return;

    const scrollTop = document.documentElement.scrollTop;
    const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const percent = (scrollTop / height) * 100;

    progressBar.style.width = percent + "%";
  });


  /* ===============================
     HERO SLIDER
  =============================== */
  const slides = document.querySelectorAll(".slide");
  const dots = document.querySelectorAll(".dot");
  const nextBtn = document.querySelector(".next");
  const prevBtn = document.querySelector(".prev");

  let currentSlide = 0;
  let interval;

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
    interval = setInterval(nextSlide, 2000);
  }

  function stopSlider() {
    clearInterval(interval);
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
  }


  /* ===============================
     THEME TOGGLE (FIXED)
  =============================== */
  const toggle = document.querySelector(".theme-toggle");

  if (toggle) {
    const savedTheme = localStorage.getItem("theme");

    if (savedTheme === "dark") {
      document.body.classList.add("dark");
      toggle.textContent = "☀️";
    }

    toggle.addEventListener("click", () => {
      document.body.classList.toggle("dark");

      if (document.body.classList.contains("dark")) {
        localStorage.setItem("theme", "dark");
        toggle.textContent = "☀️";
      } else {
        localStorage.setItem("theme", "light");
        toggle.textContent = "🌙";
      }
    });
  }


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


  // ===============================
// SAVE FORM TO FIREBASE
// ===============================
window.saveMessage = function(e) {
  e.preventDefault();

  const form = e.target;

  const data = {
    name: form[0].value,
    email: form[1].value,
    message: form[2].value,
    date: new Date().toISOString()
  };

  // Push to Firebase
  db.ref("messages").push(data)
    .then(() => {
      alert("Message sent successfully 💙");
      form.reset();
    })
    .catch(err => {
      console.error(err);
      alert("Error sending message");
    });
};


/* ===============================
   LIGHTBOX
=============================== */
function openLightbox(img) {
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");

  if (lightbox && lightboxImg) {
    lightbox.style.display = "flex";
    lightboxImg.src = img.src;
  }
}

function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  if (lightbox) {
    lightbox.style.display = "none";
  }
}
});

function loginUser(email, password) {
  auth.signInWithEmailAndPassword(email, password)
    .then(userCredential => {
      alert("Login successful!");
      window.location.href = "profile.html";
    })
    .catch(error => {
      alert(error.message);
    });
}

function registerUser(email, password) {
  auth.createUserWithEmailAndPassword(email, password)
    .then(userCredential => {
      alert("Account created!");
      window.location.href = "profile.html";
    })
    .catch(error => {
      alert(error.message);
    });
}

function logoutUser() {
  auth.signOut().then(() => {
    alert("Logged out!");
    window.location.href = "index.html";
  });
}

/* ================= ADD EVENT ================= */
function addEvent() {
  const title = document.getElementById("event-title").value;
  const desc = document.getElementById("event-desc").value;
  const date = document.getElementById("event-date").value;

  const newEventRef = db.ref("events").push();

  newEventRef.set({
    title,
    description: desc,
    date
  });

  alert("Event added!");

  document.getElementById("event-title").value = "";
  document.getElementById("event-desc").value = "";
  document.getElementById("event-date").value = "";
}

/* ================= LOAD EVENTS (ADMIN VIEW) ================= */
function loadEvents() {
  const list = document.getElementById("event-list");

  db.ref("events").on("value", snapshot => {
    list.innerHTML = "";

    snapshot.forEach(child => {
      const data = child.val();

      list.innerHTML += `
        <div class="card">
          <h3>${data.title}</h3>
          <p>${data.description}</p>
          <small>${data.date}</small>
        </div>
      `;
    });
  });
}

/* AUTO RUN IF ON ADMIN PAGE */
if (document.getElementById("event-list")) {
  loadEvents();
}

function loadPublicEvents() {
  const container = document.getElementById("events-container");

  if (!container) return;

  db.ref("events").on("value", snapshot => {
    container.innerHTML = "";

    snapshot.forEach(child => {
      const e = child.val();

      container.innerHTML += `
        <div class="card reveal">
          <h3>${e.title}</h3>
          <p>${e.description}</p>
          <small>${e.date}</small>
        </div>
      `;
    });
  });
}

loadPublicEvents();

auth.onAuthStateChanged(user => {
  const adminLink = document.getElementById("admin-link");

  if (!adminLink) return;

  if (user) {
    // 🔐 CHANGE THIS EMAIL TO YOUR ADMIN EMAIL
    const adminEmail = "ritaawuor53@gmail.com";

    if (user.email === adminEmail) {
      adminLink.style.display = "inline-block";
    } else {
      adminLink.style.display = "none";
    }
  } else {
    adminLink.style.display = "none";
  }
});

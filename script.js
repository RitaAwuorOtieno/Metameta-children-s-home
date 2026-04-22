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

// ================= ADMIN CONFIG =================
const ADMIN_EMAIL = "ritaawuor53@gmail.com";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Services
const auth = firebase.auth();
const db = firebase.database();


// ===============================
// DOM READY
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  // ================= MOBILE MENU =================
  const menuBtn = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".nav-links");

  if (menuBtn && nav) {
    menuBtn.addEventListener("click", () => {
      nav.classList.toggle("active");
    });
  }

  // ================= REVEAL ON SCROLL =================
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

  // ================= COUNTERS =================
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

  // ================= HEADER SCROLL =================
  const header = document.querySelector(".navbar");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    const current = window.scrollY;

    if (header) {
      header.classList.toggle("scrolled", current > 50);

      if (current > lastScroll && current > 150) {
        header.style.transform = "translateY(-100%)";
      } else {
        header.style.transform = "translateY(0)";
      }

      lastScroll = current;
    }
  });

  // ================= CHATBOT =================
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

});


// ===============================
// SAVE MESSAGE TO FIREBASE
// ===============================
window.saveMessage = function (e) {
  e.preventDefault();

  const form = e.target;

  const data = {
    name: form[0].value,
    email: form[1].value,
    message: form[2].value,
    date: new Date().toISOString()
  };

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


// ===============================
// AUTH FUNCTIONS
// ===============================
function loginUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  const errorBox = document.getElementById("login-error");

  auth.signInWithEmailAndPassword(email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      if (user.email === ADMIN_EMAIL) {
        window.location.href = "admin.html";
      } else {
        window.location.href = "profile.html";
      }
    })
    .catch(err => {
      if (errorBox) {
        errorBox.textContent = err.message;
      } else {
        alert(err.message);
      }
    });
}

function signupUser() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Account created!");
      window.location.href = "index.html";
    })
    .catch(err => alert(err.message));
}

function logoutUser() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  });
}


// ===============================
// AUTH STATE (UI + SECURITY)
// ===============================
auth.onAuthStateChanged(user => {
  const loginBtn = document.querySelector(".login");
  const signupBtn = document.querySelector(".signup");
  const adminLink = document.getElementById("admin-link");

  if (user) {

    // PROFILE BUTTON
    if (loginBtn) {
      loginBtn.textContent = "Profile";
      loginBtn.onclick = () => window.location.href = "profile.html";
    }

    // LOGOUT BUTTON
    if (signupBtn) {
      signupBtn.textContent = "Logout";
      signupBtn.onclick = logoutUser;
    }

    // ADMIN LINK
    if (adminLink) {
      if (user.email === ADMIN_EMAIL) {
        adminLink.style.display = "inline-block";
      } else {
        adminLink.style.display = "none";
      }
    }

    // ADMIN PAGE PROTECTION
    if (window.location.pathname.includes("admin.html")) {
      if (user.email !== ADMIN_EMAIL) {
        alert("Access denied");
        window.location.href = "index.html";
      }
    }

  } else {

    // NOT LOGGED IN
    if (loginBtn) {
      loginBtn.textContent = "Login";
      loginBtn.onclick = () => window.location.href = "login.html";
    }

    if (signupBtn) {
      signupBtn.textContent = "Sign Up";
      signupBtn.onclick = () => window.location.href = "signup.html";
    }

    if (adminLink) {
      adminLink.style.display = "none";
    }

    // BLOCK ADMIN PAGE
    if (window.location.pathname.includes("admin.html")) {
      alert("Please login first");
      window.location.href = "login.html";
    }
  }
});


// ===============================
// SIMULATE MPESA PAYMENT
// ===============================
function simulatePayment() {
  const amount = document.getElementById("amount").value;
  const user = auth.currentUser;

  if (!user) {
    alert("Please login first");
    window.location.href = "login.html";
    return;
  }

  db.ref("donations").push({
    amount: amount,
    email: user.email,
    date: new Date().toLocaleString()
  });

  document.getElementById("payment-status").innerText =
    "Payment successful (simulated)";
}

// ================= LOAD MESSAGES =================
function loadMessages() {
  const container = document.getElementById("messages-list");
  if (!container) return;

  db.ref("messages").on("value", snapshot => {
    container.innerHTML = "";

    snapshot.forEach(child => {
      const msg = child.val();

      container.innerHTML += `
        <div class="card" style="margin-top:10px;">
          <strong>${msg.name}</strong><br>
          <small>${msg.email}</small>
          <p>${msg.message}</p>
        </div>
      `;
    });
  });
}


// ================= LOAD DONATIONS =================
function loadDonations() {
  const container = document.getElementById("donations-list");
  if (!container) return;

  db.ref("donations").on("value", snapshot => {
    container.innerHTML = "";

    snapshot.forEach(child => {
      const d = child.val();

      container.innerHTML += `
        <div class="card" style="margin-top:10px;">
          <strong>KES ${d.amount}</strong><br>
          <small>${d.email}</small><br>
          <small>${d.date}</small>
        </div>
      `;
    });
  });
}


// ================= AUTO LOAD ADMIN DATA =================
document.addEventListener("DOMContentLoaded", () => {
  loadEvents();
  loadMessages();
  loadDonations();
});


// ================= ADD EVENT =================
function addEvent() {
  const title = document.getElementById("event-title").value;
  const desc = document.getElementById("event-desc").value;
  const date = document.getElementById("event-date").value;
  const image = document.getElementById("event-image").value;

  if (!title || !desc || !date) {
    alert("Please fill all fields");
    return;
  }

  db.ref("events").push({
    title,
    description: desc,
    date,
    image: image || "images/default.jpg"
  })
  .then(() => {
    alert("Event added successfully");
    console.log("EVENT SAVED TO FIREBASE ✅");
  })
  .catch(err => {
    console.error("ERROR:", err);
  });
}

function loadPublicEvents() {
  const container = document.getElementById("events-container");

  if (!container) {
    console.log("❌ events-container not found");
    return;
  }

  db.ref("events").on("value", snapshot => {

    console.log("📡 RAW DATA:", snapshot.val());

    const data = snapshot.val();

    container.innerHTML = "";

    if (!data) {
      container.innerHTML = "<p>No events found</p>";
      return;
    }

    Object.entries(data).forEach(([id, e]) => {

      container.innerHTML += `
        <div class="card" style="margin-bottom:15px;">

          <img src="${e.image || 'images/home.jpeg'}"
               style="width:100%; height:180px; object-fit:cover; border-radius:10px;">

          <h3>${e.title || 'No title'}</h3>
          <p>${e.description || ''}</p>
          <small>${e.date || ''}</small>

        </div>
      `;
    });

    console.log("✅ EVENTS RENDERED SUCCESSFULLY");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadEvents();
});

function deleteEvent(id) {
  if (confirm("Are you sure you want to delete this event?")) {
    db.ref("events/" + id).remove()
      .then(() => alert("Event deleted"))
      .catch(err => alert(err.message));
  }
}

function editEvent(id, title, desc, date) {

  const newTitle = prompt("Edit title:", title);
  const newDesc = prompt("Edit description:", desc);
  const newDate = prompt("Edit date:", date);

  if (!newTitle || !newDesc || !newDate) return;

  db.ref("events/" + id).update({
    title: newTitle,
    description: newDesc,
    date: newDate
  })
  .then(() => alert("Event updated"))
  .catch(err => alert(err.message));
}

function loadPublicEvents() {
  const container = document.getElementById("events-container");

  if (!container) {
    console.log("events-container NOT FOUND on this page");
    return;
  }

  db.ref("events").on("value", snapshot => {
    container.innerHTML = "";

    if (!snapshot.exists()) {
      container.innerHTML = "<p>No events yet.</p>";
      return;
    }

    snapshot.forEach(child => {
      const e = child.val();

      container.innerHTML += `
        <div class="card reveal-zoom">

          <img src="${e.image || 'images/home.jpeg'}"
               style="width:100%; height:200px; object-fit:cover; border-radius:10px;">

          <h3>${e.title}</h3>
          <p>${e.description}</p>
          <small>${e.date}</small>

        </div>
      `;
    });

    console.log("Events loaded successfully ✔");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadPublicEvents();
});

// ===============================
// FIREBASE TEST FUNCTIONS (GLOBAL SAFE)
// ===============================

window.testEventWrite = function () {
  console.log("🧪 testEventWrite running...");

  db.ref("events").push({
    title: "Test Event",
    description: "This is a test event",
    date: "2026-01-01",
    image: "images/home.jpeg"
  })
  .then(() => console.log("✅ EVENT WRITE SUCCESS"))
  .catch(err => console.error("❌ ERROR:", err));
};


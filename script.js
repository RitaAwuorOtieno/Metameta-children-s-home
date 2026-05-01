// ===============================
// FIREBASE INITIALIZATION
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

// Admin Configuration
const ADMIN_EMAIL = "ritaawuor53@gmail.com";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase Services
const auth = firebase.auth();
const db = firebase.database();

// ===============================
// DOM CONTENT LOADED
// ===============================
document.addEventListener("DOMContentLoaded", () => {

  // ================= MOBILE MENU TOGGLE =================
  const menuToggle = document.getElementById("mobile-menu");
  const navLinks = document.getElementById("nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
    });
  }

  // ================= NAVBAR SCROLL EFFECT =================
  const navbar = document.querySelector(".navbar");
  let lastScroll = 0;

  window.addEventListener("scroll", () => {
    if (!navbar) return;

    // Add scrolled class
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Hide/show navbar on scroll
    const currentScroll = window.scrollY;
    if (currentScroll > lastScroll && currentScroll > 150) {
      navbar.style.transform = "translateY(-100%)";
    } else {
      navbar.style.transform = "translateY(0)";
    }
    lastScroll = currentScroll;
  });

  // ================= SCROLL REVEAL ANIMATION =================
  const revealElements = document.querySelectorAll(".reveal, .reveal-left, .reveal-right, .reveal-zoom, .stagger");
  
  const revealOnScroll = () => {
    revealElements.forEach(el => {
      const windowHeight = window.innerHeight;
      const elementTop = el.getBoundingClientRect().top;
      const elementVisible = 100;
      
      if (elementTop < windowHeight - elementVisible) {
        el.classList.add("active");
      }
    });
  };

  revealOnScroll();
  window.addEventListener("scroll", revealOnScroll);

  // ================= COUNTER ANIMATION =================
  const counters = document.querySelectorAll(".counter");
  
  const startCounter = (counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    let current = 0;
    const increment = target / 100;
    
    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.innerText = Math.ceil(current);
        setTimeout(updateCounter, 20);
      } else {
        counter.innerText = target;
      }
    };
    
    updateCounter();
  };
  
  // Use Intersection Observer for counters
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        startCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });
  
  counters.forEach(counter => counterObserver.observe(counter));

  // ================= TESTIMONIAL SLIDER =================
  let currentIndex = 0;
  const testimonials = document.querySelectorAll(".testimonial-box");
  
  if (testimonials.length > 0) {
    setInterval(() => {
      testimonials[currentIndex].classList.remove("active");
      currentIndex = (currentIndex + 1) % testimonials.length;
      testimonials[currentIndex].classList.add("active");
    }, 4000);
  }

  // ================= SCROLL PROGRESS BAR =================
  const scrollBar = document.getElementById("scroll-bar");
  
  window.addEventListener("scroll", () => {
    if (!scrollBar) return;
    
    const scrollTop = document.documentElement.scrollTop;
    const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollTop / scrollHeight) * 100;
    
    scrollBar.style.width = scrolled + "%";
  });

  // ================= ACTIVE LINK HIGHLIGHTING =================
  const highlightActiveLink = () => {
    const links = document.querySelectorAll(".nav a");
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    
    links.forEach(link => {
      const linkPage = link.getAttribute("href");
      if (linkPage === currentPage) {
        link.classList.add("active");
      } else {
        link.classList.remove("active");
      }
    });
  };
  
  highlightActiveLink();

  // ================= CHATBOT FUNCTIONALITY =================
  const chatInput = document.getElementById("chat-input");
  const chatBody = document.getElementById("chat-body");

  if (chatInput && chatBody) {
    chatInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        const msg = chatInput.value.trim();
        if (!msg) return;

        chatBody.innerHTML += `<p><strong>You:</strong> ${msg}</p>`;

        let reply = "Thank you for your message! We will get back to you soon 😊";

        if (msg.toLowerCase().includes("donate")) {
          reply = "Thank you for wanting to donate! You can donate via the Support page 💙";
        } else if (msg.toLowerCase().includes("volunteer")) {
          reply = "We'd love to have you volunteer! Please visit our Contact page to get started 🤝";
        } else if (msg.toLowerCase().includes("event")) {
          reply = "Check out our Events page for upcoming activities and programs 📅";
        }

        chatBody.innerHTML += `<p><strong>Bot:</strong> ${reply}</p>`;
        chatInput.value = "";
        
        // Auto-scroll to bottom
        chatBody.scrollTop = chatBody.scrollHeight;
      }
    });
  }

  // ================= LOAD DATA FOR ADMIN PAGE =================
  if (window.location.pathname.includes("admin.html")) {
    loadMessages();
    loadDonations();
    loadEventsForAdmin();
  }

  // ================= LOAD PUBLIC EVENTS =================
  if (document.getElementById("events-container")) {
    loadPublicEvents();
  }
});

// ===============================
// MESSAGE FUNCTIONS
// ===============================
window.saveMessage = function(e) {
  e.preventDefault();
  
  const name = e.target.querySelector("[name='name']")?.value;
  const email = e.target.querySelector("[name='email']")?.value;
  const message = e.target.querySelector("[name='message']")?.value;
  
  if (!name || !email || !message) {
    alert("Please fill in all fields");
    return;
  }
  
  const data = {
    name: name,
    email: email,
    message: message,
    date: new Date().toISOString()
  };
  
  db.ref("messages").push(data)
    .then(() => {
      alert("Message sent successfully! 💙 We'll get back to you soon.");
      e.target.reset();
    })
    .catch(err => {
      console.error("Error sending message:", err);
      alert("Error sending message. Please try again.");
    });
};

function loadMessages() {
  const container = document.getElementById("messages-list");
  if (!container) return;
  
  db.ref("messages").on("value", (snapshot) => {
    container.innerHTML = "";
    
    if (!snapshot.exists()) {
      container.innerHTML = "<p>No messages yet.</p>";
      return;
    }
    
    const messages = [];
    snapshot.forEach(child => {
      messages.push({ id: child.key, ...child.val() });
    });
    
    // Show latest messages first
    messages.reverse().forEach(msg => {
      container.innerHTML += `
        <div class="card" style="margin-top: 10px;">
          <strong>${escapeHtml(msg.name)}</strong><br>
          <small>${escapeHtml(msg.email)}</small><br>
          <small>${new Date(msg.date).toLocaleString()}</small>
          <p>${escapeHtml(msg.message)}</p>
        </div>
      `;
    });
  });
}

// ===============================
// DONATION FUNCTIONS
// ===============================
window.simulatePayment = function() {
  const amount = document.getElementById("amount")?.value;
  const user = auth.currentUser;
  const statusDiv = document.getElementById("payment-status");
  
  if (!user) {
    alert("Please login first to donate");
    window.location.href = "login.html";
    return;
  }
  
  if (!amount || amount <= 0) {
    alert("Please enter a valid amount");
    return;
  }
  
  db.ref("donations").push({
    amount: amount,
    email: user.email,
    userId: user.uid,
    date: new Date().toISOString()
  });
  
  if (statusDiv) {
    statusDiv.innerText = "✅ Donation recorded successfully! Thank you for your support!";
    statusDiv.style.color = "green";
  }
  
  document.getElementById("amount").value = "";
};

function loadDonations() {
  const container = document.getElementById("donations-list");
  if (!container) return;
  
  db.ref("donations").on("value", (snapshot) => {
    container.innerHTML = "";
    
    if (!snapshot.exists()) {
      container.innerHTML = "<p>No donations yet.</p>";
      return;
    }
    
    let total = 0;
    const donations = [];
    
    snapshot.forEach(child => {
      const donation = child.val();
      donations.push(donation);
      total += parseFloat(donation.amount) || 0;
    });
    
    // Add total at top
    container.innerHTML = `<div class="card" style="background: gold; margin-bottom: 20px;">
      <strong>💰 Total Donations: KES ${total.toLocaleString()}</strong>
    </div>`;
    
    // Show individual donations
    donations.reverse().forEach(d => {
      container.innerHTML += `
        <div class="card" style="margin-top: 10px;">
          <strong>KES ${parseFloat(d.amount).toLocaleString()}</strong><br>
          <small>${escapeHtml(d.email)}</small><br>
          <small>${new Date(d.date).toLocaleString()}</small>
        </div>
      `;
    });
  });
}

// ===============================
// EVENT FUNCTIONS
// ===============================
window.addEvent = function() {
  const title = document.getElementById("event-title")?.value;
  const desc = document.getElementById("event-desc")?.value;
  const date = document.getElementById("event-date")?.value;
  const image = document.getElementById("event-image")?.value;
  
  if (!title || !desc || !date) {
    alert("Please fill in all required fields");
    return;
  }
  
  db.ref("events").push({
    title: title,
    description: desc,
    date: date,
    image: image || "images/default-event.jpg",
    createdAt: new Date().toISOString()
  })
  .then(() => {
    alert("Event added successfully! ✅");
    document.getElementById("event-title").value = "";
    document.getElementById("event-desc").value = "";
    document.getElementById("event-date").value = "";
    document.getElementById("event-image").value = "";
    loadEventsForAdmin();
  })
  .catch(err => {
    console.error("Error adding event:", err);
    alert("Error adding event. Please try again.");
  });
};

function loadPublicEvents() {
  const container = document.getElementById("events-container");
  if (!container) return;
  
  db.ref("events").on("value", (snapshot) => {
    container.innerHTML = "";
    
    if (!snapshot.exists()) {
      container.innerHTML = "<p>No upcoming events at the moment. Check back soon!</p>";
      return;
    }
    
    const events = [];
    snapshot.forEach(child => {
      events.push({ id: child.key, ...child.val() });
    });
    
    // Show latest events first
    events.reverse().forEach(event => {
      container.innerHTML += `
        <div class="card reveal-zoom">
          <img src="${event.image || 'images/default-event.jpg'}" 
               alt="${escapeHtml(event.title)}"
               style="width:100%; height:200px; object-fit:cover; border-radius:10px;"
               onerror="this.src='images/home.jpeg'">
          <h3>${escapeHtml(event.title)}</h3>
          <p>${escapeHtml(event.description)}</p>
          <small>📅 ${formatDate(event.date)}</small>
        </div>
      `;
    });
  });
}

function loadEventsForAdmin() {
  const container = document.getElementById("admin-events-list");
  if (!container) return;
  
  db.ref("events").on("value", (snapshot) => {
    container.innerHTML = "";
    
    if (!snapshot.exists()) {
      container.innerHTML = "<p>No events yet. Create your first event above!</p>";
      return;
    }
    
    snapshot.forEach(child => {
      const event = child.val();
      const eventId = child.key;
      
      container.innerHTML += `
        <div class="card" style="margin-bottom: 15px;">
          <h3>${escapeHtml(event.title)}</h3>
          <p>${escapeHtml(event.description)}</p>
          <small>📅 ${formatDate(event.date)}</small>
          <div style="margin-top: 10px;">
            <button onclick="editEvent('${eventId}', '${escapeHtml(event.title)}', '${escapeHtml(event.description)}', '${event.date}')" 
                    class="btn-small">✏️ Edit</button>
            <button onclick="deleteEvent('${eventId}')" 
                    class="btn-small btn-danger">🗑️ Delete</button>
          </div>
        </div>
      `;
    });
  });
}

window.deleteEvent = function(id) {
  if (confirm("Are you sure you want to delete this event?")) {
    db.ref("events/" + id).remove()
      .then(() => {
        alert("Event deleted successfully ✅");
        loadEventsForAdmin();
      })
      .catch(err => {
        console.error("Error deleting event:", err);
        alert("Error deleting event. Please try again.");
      });
  }
};

window.editEvent = function(id, oldTitle, oldDesc, oldDate) {
  const newTitle = prompt("Edit title:", oldTitle);
  if (!newTitle) return;
  
  const newDesc = prompt("Edit description:", oldDesc);
  if (!newDesc) return;
  
  const newDate = prompt("Edit date (YYYY-MM-DD):", oldDate);
  if (!newDate) return;
  
  db.ref("events/" + id).update({
    title: newTitle,
    description: newDesc,
    date: newDate,
    updatedAt: new Date().toISOString()
  })
  .then(() => {
    alert("Event updated successfully! ✅");
    loadEventsForAdmin();
  })
  .catch(err => {
    console.error("Error updating event:", err);
    alert("Error updating event. Please try again.");
  });
};

// ===============================
// AUTHENTICATION FUNCTIONS
// ===============================
window.loginUser = function() {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;
  const errorBox = document.getElementById("login-error");
  
  if (!email || !password) {
    if (errorBox) errorBox.textContent = "Please enter email and password";
    return;
  }
  
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
      console.error("Login error:", err);
      if (errorBox) {
        errorBox.textContent = getAuthErrorMessage(err.code);
      } else {
        alert(getAuthErrorMessage(err.code));
      }
    });
};

window.signupUser = function() {
  const email = document.getElementById("email")?.value;
  const password = document.getElementById("password")?.value;
  const confirmPassword = document.getElementById("confirm-password")?.value;
  
  if (!email || !password) {
    alert("Please fill in all fields");
    return;
  }
  
  if (confirmPassword && password !== confirmPassword) {
    alert("Passwords do not match");
    return;
  }
  
  if (password.length < 6) {
    alert("Password should be at least 6 characters");
    return;
  }
  
  auth.createUserWithEmailAndPassword(email, password)
    .then(() => {
      alert("Account created successfully! 🎉 Please login.");
      window.location.href = "login.html";
    })
    .catch(err => {
      console.error("Signup error:", err);
      alert(getAuthErrorMessage(err.code));
    });
};

window.logoutUser = function() {
  auth.signOut().then(() => {
    window.location.href = "index.html";
  }).catch(err => {
    console.error("Logout error:", err);
    alert("Error logging out. Please try again.");
  });
};

// ===============================
// AUTH STATE HANDLER
// ===============================
auth.onAuthStateChanged((user) => {
  const loginBtn = document.querySelector(".nav-item.login a");
  const signupBtn = document.querySelector(".nav-item.signup a");
  const adminLink = document.getElementById("admin-link");
  
  if (user) {
    // User is logged in
    if (loginBtn) {
      loginBtn.textContent = "Profile";
      loginBtn.href = "profile.html";
    }
    
    if (signupBtn) {
      signupBtn.textContent = "Logout";
      signupBtn.href = "#";
      signupBtn.onclick = (e) => {
        e.preventDefault();
        logoutUser();
      };
    }
    
    // Show admin link for admin users
    if (adminLink && user.email === ADMIN_EMAIL) {
      adminLink.style.display = "inline-block";
    }
    
    // Protect admin page
    if (window.location.pathname.includes("admin.html") && user.email !== ADMIN_EMAIL) {
      alert("Access denied. Admin privileges required.");
      window.location.href = "index.html";
    }
  } else {
    // User is logged out
    if (loginBtn) {
      loginBtn.textContent = "Login";
      loginBtn.href = "login.html";
    }
    
    if (signupBtn) {
      signupBtn.textContent = "Sign Up";
      signupBtn.href = "signup.html";
      signupBtn.onclick = null;
    }
    
    if (adminLink) {
      adminLink.style.display = "none";
    }
    
    // Redirect from admin page if not logged in
    if (window.location.pathname.includes("admin.html")) {
      alert("Please login as admin to access this page");
      window.location.href = "login.html";
    }
  }
});

// ================= DARK MODE FUNCTIONALITY =================

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

// Set initial theme
if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
  document.documentElement.setAttribute('data-theme', 'dark');
} else {
  document.documentElement.setAttribute('data-theme', 'light');
}

// Theme toggle function
function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
  
  // Update toggle button icon
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    const icon = toggleBtn.querySelector('i');
    if (newTheme === 'dark') {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
  }
  
  // Optional: Show toast notification
  showThemeNotification(newTheme);
}

// Optional: Show notification when theme changes
function showThemeNotification(theme) {
  const notification = document.createElement('div');
  notification.textContent = theme === 'dark' ? '🌙 Dark mode enabled' : '☀️ Light mode enabled';
  notification.style.cssText = `
    position: fixed;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    background: var(--card-bg);
    color: var(--text);
    padding: 10px 20px;
    border-radius: 30px;
    font-size: 0.9rem;
    z-index: 10000;
    box-shadow: var(--shadow);
    animation: fadeOut 2s ease forwards;
  `;
  
  document.body.appendChild(notification);
  
  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// Add animation CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes fadeOut {
    0% { opacity: 1; transform: translateX(-50%) translateY(0); }
    70% { opacity: 1; transform: translateX(-50%) translateY(0); }
    100% { opacity: 0; transform: translateX(-50%) translateY(-20px); }
  }
`;
document.head.appendChild(style);

// Update toggle button icon on page load
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtn = document.getElementById('theme-toggle');
  if (toggleBtn) {
    const icon = toggleBtn.querySelector('i');
    const currentTheme = document.documentElement.getAttribute('data-theme');
    if (currentTheme === 'dark') {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
    
    toggleBtn.addEventListener('click', toggleTheme);
  }
});

// ===============================
// HELPER FUNCTIONS
// ===============================
function escapeHtml(str) {
  if (!str) return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDate(dateString) {
  if (!dateString) return "Date TBD";
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch {
    return dateString;
  }
}

function getAuthErrorMessage(errorCode) {
  const messages = {
    "auth/invalid-email": "Invalid email address format.",
    "auth/user-disabled": "This account has been disabled.",
    "auth/user-not-found": "No account found with this email.",
    "auth/wrong-password": "Incorrect password.",
    "auth/email-already-in-use": "An account already exists with this email.",
    "auth/weak-password": "Password should be at least 6 characters.",
    "auth/network-request-failed": "Network error. Please check your connection."
  };
  return messages[errorCode] || "An error occurred. Please try again.";
}

// ===============================
// TEST FUNCTION (for debugging)
// ===============================
window.testFirebase = function() {
  console.log("Testing Firebase connection...");
  
  db.ref("test").push({
    message: "Test connection",
    timestamp: new Date().toISOString()
  })
  .then(() => {
    console.log("✅ Firebase is working correctly!");
    alert("Firebase connection successful!");
  })
  .catch(err => {
    console.error("❌ Firebase error:", err);
    alert("Firebase connection failed. Check console for details.");
  });
};
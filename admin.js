// ================= FIREBASE CONFIG =================
const firebaseConfig = {
  apiKey: "AIzaSyDjZjgSoVNXjIKVui9ZG1K6nrqi6HEFK8g",
  authDomain: "metameta-82db5.firebaseapp.com",
  databaseURL: "https://metameta-82db5-default-rtdb.firebaseio.com",
  projectId: "metameta-82db5",
  storageBucket: "metameta-82db5.firebasestorage.app",
  messagingSenderId: "153087607234",
  appId: "1:153087607234:web:b0883c1c192fe06447965b"
};

// ================= INIT FIREBASE FIRST =================
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const db = firebase.database();

auth.onAuthStateChanged(user => {
  if (!user) {
    window.location.href = "login.html";
  } else {
    loadMessages(); // IMPORTANT
  }
});

// ================= DOM ELEMENTS =================
const container = document.getElementById("messages-container");
const stats = document.getElementById("stats");

// ================= LOAD MESSAGES =================
function loadMessages() {
  db.ref("messages").on("value", snapshot => {

    const data = snapshot.val();

    container.innerHTML = "";

    if (!data) {
      container.innerHTML = "<p>No messages yet 📭</p>";
      stats.innerHTML = "";
      return;
    }

    const messages = Object.entries(data).reverse();

    stats.innerHTML = `
      <div class="stats-box">
        <h3>Total Messages: ${messages.length}</h3>
      </div>
    `;

    messages.forEach(([id, msg]) => {

      const card = document.createElement("div");
      card.classList.add("admin-card");

      card.innerHTML = `
        <h3>👤 ${msg.name}</h3>
        <p><strong>📧 Email:</strong> ${msg.email}</p>
        <p><strong>💬 Message:</strong> ${msg.message}</p>
        <small>🕒 ${new Date(msg.date).toLocaleString()}</small>

        <button onclick="deleteMessage('${id}')" class="delete-btn">Delete</button>
      `;

      container.appendChild(card);
    });
  });
}

// ================= DELETE MESSAGE =================
function deleteMessage(id) {
  if (confirm("Delete this message?")) {
    db.ref("messages/" + id).remove();
  }
}

// ================= LOGOUT =================
function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "login.html";
  });
}

// ================= AUTH PROTECTION =================
const ADMIN_EMAIL = "ritaawuor53@gmail.com"; // 👈 CHANGE THIS

auth.onAuthStateChanged(user => {
  if (!user || user.email !== ADMIN_EMAIL) {
    window.location.href = "login.html";
  } else {
    loadMessages(); // only load if correct admin
  }
});
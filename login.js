// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyDjZjgSoVNXjIKVui9ZG1K6nrqi6HEFK8g",
  authDomain: "metameta-82db5.firebaseapp.com",
  databaseURL: "https://metameta-82db5-default-rtdb.firebaseio.com",
  projectId: "metameta-82db5",
  storageBucket: "metameta-82db5.firebasestorage.app",
  messagingSenderId: "153087607234",
  appId: "1:153087607234:web:b0883c1c192fe06447965b"
};

firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();

function login() {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  auth.signInWithEmailAndPassword(email, password)
    .then(() => {
      window.location.href = "admin.html";
    })
    .catch(err => {
      alert(err.message);
    });
}
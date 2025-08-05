// Firebase configuration (use the one you provided)
const firebaseConfig = {
  apiKey: "AIzaSyD_pamkX6XwR5F9qibxEVzwTU1_qx-pBOI",
  authDomain: "chat-6f52a.firebaseapp.com",
  projectId: "chat-6f52a",
  storageBucket: "chat-6f52a.firebasestorage.app",
  messagingSenderId: "669145097703",
  appId: "1:669145097703:web:56f42ba5623dfd8fd64942"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Get Firestore and Auth services
const db = firebase.firestore();
const auth = firebase.auth();

// DOM elements
const chatBox = document.getElementById('chat-box');
const messageInput = document.getElementById('message-input');
const sendBtn = document.getElementById('send-btn');

// Predefined users with passwords (both using the same password "amandamegh")
const predefinedUsers = {
  sinthy: "amandamegh",  // Password for sinthy
  megh: "amandamegh"     // Password for megh
};

let currentUser = null;  // Will hold the current user (either sinthy or megh)

// Sign in function
function signIn(username, password) {
  if (predefinedUsers[username] === password) {
    currentUser = username;
    alert(`Welcome, ${currentUser}!`);
    loadMessages();
  } else {
    alert("Incorrect username or password!");
  }
}

// Listen for message inputs and send them
sendBtn.addEventListener('click', () => {
  const message = messageInput.value.trim();
  if (message && currentUser) {
    db.collection("messages").add({
      user: currentUser,
      message: message,
      timestamp: firebase.firestore.FieldValue.serverTimestamp()
    });

    messageInput.value = "";  // Clear the input after sending
  } else {
    alert("Please log in first!");
  }
});

// Load messages from Firestore
function loadMessages() {
  db.collection("messages").orderBy("timestamp")
    .onSnapshot(snapshot => {
      chatBox.innerHTML = "";  // Clear the chat box before loading new messages
      snapshot.forEach(doc => {
        const data = doc.data();
        chatBox.innerHTML += `<p><strong>${data.user}:</strong> ${data.message}</p>`;
      });
      chatBox.scrollTop = chatBox.scrollHeight;  // Scroll to bottom
    });
}

// Initialize with login prompt
const username = prompt("Enter username (sinthy or megh):");
const password = prompt("Enter password:");
signIn(username, password);

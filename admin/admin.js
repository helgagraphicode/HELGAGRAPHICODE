// admin.js

import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-auth.js";
import { database } from '../js/firebase-config.js';

const loginForm = document.getElementById('loginForm');

// Event listener for login form submission
loginForm.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Firebase authentication
    const auth = getAuth();
    signInWithEmailAndPassword(auth, username, password)
        .then((userCredential) => {
            // Signed in
            const user = userCredential.user;
            console.log(`Logged in as ${user.email}`);

            // Redirect to home.html or admin.html after successful login
            window.location.href = 'home.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error(`Login error: ${errorCode} - ${errorMessage}`);
            alert('Invalid email or password. Please try again.');
        });
});

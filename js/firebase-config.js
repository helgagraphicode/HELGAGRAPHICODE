// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-app.js";
import { getDatabase } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-database.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/10.12.3/firebase-analytics.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD7_3UyHfuO-F4kltuYAKAj9-wWrM9Lw1A",
  authDomain: "helgagraphicode-81b2c.firebaseapp.com",
  databaseURL: "https://helgagraphicode-81b2c-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "helgagraphicode-81b2c",
  storageBucket: "helgagraphicode-81b2c.appspot.com",
  messagingSenderId: "412055103762",
  appId: "1:412055103762:web:1f48bde3463be8a8e5abcb",
  measurementId: "G-M2EZR7HZXB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const database = getDatabase(app);

export { database };

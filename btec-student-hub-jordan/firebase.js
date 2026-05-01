// firebase.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBk9zA6ICMJ0zWYqovZjWozPQ-HSGqq1rw",
  authDomain: "btec-hub-jordan.firebaseapp.com",
  projectId: "btec-hub-jordan",
  storageBucket: "btec-hub-jordan.firebasestorage.app",
  messagingSenderId: "701134346012",
  appId: "1:701134346012:web:bb54e2e5c4e21b16980cd9"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
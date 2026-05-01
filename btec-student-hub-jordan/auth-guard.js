import { auth } from "./firebase.js";
import { onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";

onAuthStateChanged(auth, (user) => {
  if (!user) {
    window.location.href = "login.html";
  }
});

window.logoutUser = function () {
  signOut(auth).then(() => {
    localStorage.clear();
    window.location.href = "login.html";
  });
};
import { auth } from "./firebase.js";

import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  sendPasswordResetEmail
} from "https://www.gstatic.com/firebasejs/12.12.1/firebase-auth.js";


// ✅ إنشاء حساب
window.register = function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("اكتب الإيميل وكلمة السر أولاً");
    return;
  }

  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      localStorage.setItem("btecStudentEmail", user.email);
      localStorage.setItem("btecStudentName", user.email.split("@")[0]);

      alert("تم إنشاء الحساب بنجاح ✅");
      window.location.href = "index.html";
    })
    .catch((error) => {
      alert("خطأ: " + error.message);
    });
};


// ✅ تسجيل دخول
window.login = function () {
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value.trim();

  if (!email || !password) {
    alert("اكتب الإيميل وكلمة السر أولاً");
    return;
  }

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;

      localStorage.setItem("btecStudentEmail", user.email);
      localStorage.setItem("btecStudentName", user.email.split("@")[0]);

      window.location.href = "index.html";
    })
    .catch((error) => {
      alert("خطأ: " + error.message);
    });
};


// ✅ نسيت كلمة السر
window.resetPassword = function () {
  const email = document.getElementById("email").value.trim();

  if (!email) {
    alert("اكتب الإيميل أولاً");
    return;
  }

  sendPasswordResetEmail(auth, email)
    .then(() => {
      alert("📩 تم إرسال رابط تغيير كلمة السر على الإيميل");
    })
    .catch((error) => {
      alert("خطأ: " + error.message);
    });
};
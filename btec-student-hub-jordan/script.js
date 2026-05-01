async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value;

  if (!message) return;

  const chatBox = document.getElementById("chatMessages");

  // رسالة المستخدم
  chatBox.innerHTML += `<div class="message user">${message}</div>`;

  input.value = "";

  // إرسال للسيرفر
  const response = await fetch("http://localhost:3000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  const data = await response.json();

  // رد AI
  chatBox.innerHTML += `<div class="message bot">${data.reply}</div>`;
}

async function readPdfFile() {
  const fileInput = document.getElementById("pdfFile");
  const textArea = document.getElementById("reportInput");
  const result = document.getElementById("resultBox");

  if (!fileInput.files.length) {
    result.innerHTML = "⚠️ اختر ملف PDF أولًا.";
    return;
  }

  const file = fileInput.files[0];

  result.innerHTML = "⏳ جاري قراءة الملف...";

  const reader = new FileReader();

  reader.onload = async function () {
    const typedArray = new Uint8Array(this.result);

    const pdf = await pdfjsLib.getDocument(typedArray).promise;

    let fullText = "";

    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();

      const text = content.items.map(item => item.str).join(" ");
      fullText += text + "\n";
    }

    textArea.value = fullText;
    result.innerHTML = "✅ تم استخراج النص، اضغط تحليل.";
  };

  reader.readAsArrayBuffer(file);
}
function analyzeReport() {
  const text = document.getElementById("reportInput").value.trim().toLowerCase();
  const result = document.getElementById("resultBox");

  if (text === "") {
    result.innerHTML = "⚠️ الرجاء لصق التقرير أو قراءة ملف PDF أولًا.";
    return;
  }

  let score = 0;
  let notes = [];
  let strengths = [];

  // Pass: شرح وفهم أساسي
  const hasIntro = text.includes("مقدمة") || text.includes("introduction");
  const hasExplanation = text.includes("شرح") || text.includes("explain") || text.includes("describe");
  const hasConclusion = text.includes("خاتمة") || text.includes("conclusion");
  const hasStructure = text.length > 500;

  if (hasIntro) { score += 1; strengths.push("عندك مقدمة."); }
  else notes.push("ناقص مقدمة واضحة.");

  if (hasExplanation) { score += 2; strengths.push("في شرح أو وصف للمطلوب."); }
  else notes.push("ناقص شرح أساسي للمطلوب.");

  if (hasConclusion) { score += 1; strengths.push("عندك خاتمة."); }
  else notes.push("ناقص خاتمة.");

  if (hasStructure) { score += 1; strengths.push("حجم التقرير جيد."); }
  else notes.push("التقرير قصير، زيد التفاصيل.");

  // Merit: تحليل ومقارنة
  const hasAnalysis = text.includes("تحليل") || text.includes("analyze") || text.includes("analysis");
  const hasCompare = text.includes("مقارنة") || text.includes("compare") || text.includes("comparison");
  const hasExamples = text.includes("مثال") || text.includes("example") || text.includes("على سبيل المثال");

  if (hasAnalysis) { score += 2; strengths.push("في تحليل."); }
  else notes.push("للوصول إلى Merit لازم تضيف تحليل واضح، مش شرح فقط.");

  if (hasCompare) { score += 2; strengths.push("في مقارنة."); }
  else notes.push("للوصول إلى Merit لازم تضيف مقارنة بين حلول أو خيارات.");

  if (hasExamples) { score += 1; strengths.push("في أمثلة."); }
  else notes.push("أضف أمثلة تدعم كلامك.");

  // Distinction: تقييم وتبرير ومراجع
  const hasEvaluation = text.includes("تقييم") || text.includes("evaluate") || text.includes("evaluation");
  const hasJustification = text.includes("تبرير") || text.includes("سبب") || text.includes("justify") || text.includes("because");
  const hasReferences = text.includes("مراجع") || text.includes("المراجع") || text.includes("references") || text.includes("https");

  if (hasEvaluation) { score += 2; strengths.push("في تقييم."); }
  else notes.push("للوصول إلى Distinction لازم تضيف تقييم للحلول أو النتائج.");

  if (hasJustification) { score += 2; strengths.push("في تبرير."); }
  else notes.push("للوصول إلى Distinction لازم تبرر قراراتك: لماذا هذا الحل أفضل؟");

  if (hasReferences) { score += 1; strengths.push("في مراجع أو مصادر."); }
  else notes.push("أضف مراجع أو مصادر لدعم التقرير.");

  let level = "";
  let nextStep = "";

  if (score >= 12 && hasEvaluation && hasJustification) {
    level = "Distinction / D 🔥";
    nextStep = "تقريرك قريب من مستوى Distinction. راجع اللغة، أضف أمثلة أكثر، وتأكد أن التقييم مرتبط بالسيناريو.";
  } else if (score >= 8 && hasAnalysis && hasCompare) {
    level = "Merit / M 👍";
    nextStep = "تقريرك Merit. عشان توصل Distinction لازم تضيف تقييم واضح وتبرير قوي لقراراتك.";
  } else if (score >= 4) {
    level = "Pass / P ✔";
    nextStep = "تقريرك Pass. عشان توصل Merit لازم تضيف تحليل ومقارنة وأمثلة.";
  } else {
    level = "Not Yet / يحتاج تحسين ❌";
    nextStep = "التقرير يحتاج أساسيات أكثر: مقدمة، شرح واضح، تفاصيل، وخاتمة.";
  }

  result.innerHTML = `
    <h3>المستوى التقديري: ${level}</h3>
    <h3>النقاط: ${score}/15</h3>

    <h4>نقاط القوة:</h4>
    <ul>
      ${strengths.length ? strengths.map(s => `<li>${s}</li>`).join("") : "<li>لم تظهر نقاط قوة كافية بعد.</li>"}
    </ul>

    <h4>النواقص:</h4>
    <ul>
      ${notes.map(n => `<li>${n}</li>`).join("")}
    </ul>

    <h4>كيف تطور مستواك؟</h4>
    <p>${nextStep}</p>

    <p>⚠️ هذا تقييم تدريبي يساعدك تتحسن، وليس علامة رسمية من المدرسة.</p>
  `;
}
function goToPage(page) {
  document.body.style.opacity = "0.5";

  setTimeout(() => {
    window.location.href = page;
  }, 200);
}
function logoutUser() {
  localStorage.removeItem("btecStudentName");
  window.location.href = "login.html";
}
const progressItems = [
  "grade10-assignment1",
  "grade10-assignment2",
  "grade10-assignment3",
  "grade10-assignment4",
  "grade10-assignment5",
  "grade11-apps",
  "grade11-games",
  "grade11-support",
  "tawjihi-cyber",
  "tawjihi-ai",
  "tawjihi-programming",
  "tawjihi-pm"
];
async function sendMessage() {
  const input = document.getElementById("userInput");
  const message = input.value.trim();

  if (!message) return;

  const chatBox = document.getElementById("chatMessages");

  chatBox.innerHTML += `<div class="message user">${message}</div>`;
chatBox.scrollTop = chatBox.scrollHeight; // 👈 هون
input.value = "";

  try {
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message })
    });

    const data = await response.json();

    chatBox.innerHTML += `<div class="message bot">${data.reply}</div>`;
    chatBox.scrollTop = chatBox.scrollHeight; // 👈 هون
  } catch (error) {
    chatBox.innerHTML += `<div class="message bot">❌ صار خطأ، تأكد السيرفر شغال</div>`;
  }
}

function quickAsk(text) {
  document.getElementById("userInput").value = text;
  sendMessage();
}

function markProgress(itemName) {
  localStorage.setItem(itemName, "done");

  let doneCount = 0;

  progressItems.forEach(item => {
    if (localStorage.getItem(item) === "done") {
      doneCount++;
    }
  });

  const progress = Math.round((doneCount / progressItems.length) * 100);
  localStorage.setItem("btecProgress", progress);
}

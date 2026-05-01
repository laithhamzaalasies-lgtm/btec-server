import express from "express";
import cors from "cors";

const app = express();

app.use(cors());
app.use(express.json());

function normalize(t = "") {
  return t
    .toLowerCase()
    .replace(/[أإآ]/g, "ا")
    .replace(/ة/g, "ه")
    .replace(/ى/g, "ي")
    .replace(/[^\w\s\u0600-\u06FF]/g, " ")
    .trim();
}

function makeTable(headers, rows) {
  return `
<table class="bot-table">
  <tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr>
  ${rows.map(row => `<tr>${row.map(c => `<td>${c}</td>`).join("")}</tr>`).join("")}
</table>`;
}

app.post("/chat", (req, res) => {
  const msg = normalize(req.body.message || "");

  let reply = "🤖 فهمت عليك، بس وضّحلي أكثر: هل سؤالك عن واجب، تقرير، سيناريو، Merit أو Distinction؟";

  if (msg.includes("السلام") || msg.includes("سلام") || msg.includes("مرحبا") || msg.includes("هلا")) {
    reply = "وعليكم السلام ورحمة الله 👋 أهلاً فيك في مساعد BTEC. اسألني عن الواجبات، التقارير، السيناريو، التحليل، Merit أو Distinction.";
  }

  else if (msg.includes("كيفك") || msg.includes("كيف الحال") || msg.includes("شو اخبارك") || msg.includes("اخبارك")) {
    reply = "الحمدلله تمام 😄 جاهز أساعدك في BTEC خطوة بخطوة. احكيلي شو المشكلة عندك.";
  }

  else if (msg.includes("مش فاهم") || msg.includes("ضايع") || msg.includes("ساعدني")) {
    reply = "ولا يهمك 👌 ابدأ بأبسط خطوة: اكتب اسم الصف واسم الواجب، وأنا أساعدك ترتب المطلوب خطوة بخطوة.";
  }

  else if (
  msg.includes("انسخ") ||
  msg.includes("نسخ") ||
  msg.includes("غش")
) {
  reply = "⚠️ لا تعتمد على النسخ. اشتغل بإيدك عشان تفهم وتجيب علامات أعلى.";
}

  else if (
  msg.includes("افضل") &&
  msg.includes("طريق") &&
  msg.includes("اشتغل")
) {
  reply = "🔥 أفضل طريقة تشتغل:\n1. اقرأ السيناريو\n2. افهم المطلوب\n3. اكتب نقاط\n4. اشتغل بإيدك\n5. أضف تحليل ومقارنة\n6. راجع قبل التسليم";
}

  else if (msg.includes("كيف") && msg.includes("اوصل") && msg.includes("merit")) {
    reply = "👍 للوصول إلى Merit لازم تضيف تحليل ومقارنة وأمثلة من السيناريو. لا تكتفي بالشرح فقط.";
  }

  else if (msg.includes("كيف") && msg.includes("اوصل") && msg.includes("distinction")) {
    reply = "🏆 للوصول إلى Distinction لازم تضيف تقييم، تبرير، تحليل عميق، وأمثلة مرتبطة بالسيناريو.";
  }

  else if (msg.includes("شو يعني pass") || msg.includes("pass") || msg.includes("باس")) {
    reply = "✔ Pass يعني إنك حققت الأساسيات المطلوبة: شرح واضح وفهم للسيناريو.";
  }

  else if (msg.includes("شو يعني merit") || msg.includes("merit") || msg.includes("ميرت")) {
    reply = "👍 Merit يعني مستوى أعلى من Pass. يحتاج تحليل ومقارنة، مش شرح فقط.";
  }

  else if (msg.includes("شو يعني distinction") || msg.includes("distinction") || msg.includes("امتياز")) {
    reply = "🏆 Distinction هي أعلى علامة في BTEC، وتحتاج تقييم وتبرير وتحليل قوي.";
  }

  else if (msg.includes("اصعب") && msg.includes("واجب")) {
    reply = `📊 <strong>مقارنة أصعب واجبات BTEC</strong>
${makeTable(
  ["الصف", "أصعب واجب", "ليش صعب؟", "النصيحة"],
  [
    ["العاشر", "Game Development", "منطق وبرمجة", "ابدأ بلعبة بسيطة"],
    ["الأول ثانوي", "Applications Development", "تخطيط وتطبيق وتحليل", "قسم المشروع لمراحل"],
    ["التوجيهي", "Cyber Security / Project Management", "تحليل وتقييم وتبرير", "اربط كلامك بالسيناريو"]
  ]
)}`;
  }

  else if (msg.includes("مستويات") || (msg.includes("pass") && msg.includes("merit"))) {
    reply = `🏆 <strong>مقارنة مستويات BTEC</strong>
${makeTable(
  ["المستوى", "المعنى", "المطلوب"],
  [
    ["Pass", "أساسي", "شرح وفهم"],
    ["Merit", "متوسط", "تحليل ومقارنة"],
    ["Distinction", "ممتاز", "تقييم وتبرير"]
  ]
)}`;
  }

  else if (msg.includes("كيف") && (msg.includes("ابدا") || msg.includes("ابدأ"))) {
    reply = "🚀 ابدأ بقراءة السيناريو، ثم حدد المطلوب، واكتب مقدمة، ثم شرح، ثم تحليل، ثم خاتمة.";
  }

  else if (msg.includes("مقدمه") || msg.includes("مقدمة")) {
    reply = "✍️ المقدمة القوية تشرح موضوع الواجب، هدف التقرير، وتربطه بالسيناريو بشكل مختصر.";
  }

  else if (msg.includes("خاتمه") || msg.includes("خاتمة")) {
    reply = "✅ الخاتمة تلخص أهم ما كتبت، وتذكر النتيجة أو الشيء الذي تعلمته، بدون معلومات جديدة كثيرة.";
  }

  else if (msg.includes("تحليل")) {
    reply = "🔍 التحليل يعني تشرح السبب والنتيجة: لماذا هذا الحل مناسب؟ ما ميزاته وعيوبه؟ وكيف يخدم السيناريو؟";
  }

  else if (msg.includes("مقارنه") || msg.includes("مقارنة")) {
    reply = "⚖️ المقارنة تكون بين خيارين: التشابه، الاختلاف، المميزات، العيوب، وأي خيار أفضل ولماذا.";
  }

  else if (msg.includes("تقرير") || msg.includes("ارتب")) {
    reply = "📝 ترتيب التقرير: غلاف، مقدمة، شرح السيناريو، محتوى، تحليل، مقارنة، تقييم، خاتمة، مراجع.";
  }

  else if (msg.includes("سيناريو") || msg.includes("scenario")) {
    reply = "📄 السيناريو هو القصة أو الحالة اللي ينبني عليها الواجب. منه تعرف العميل، المشكلة، المطلوب، والحل المناسب.";
  }

  else if (msg.includes("btec") || msg.includes("بيتك") || msg.includes("بتك")) {
    reply = "📘 BTEC نظام عملي يعتمد على المشاريع والتقارير بدل الحفظ فقط.";
  }

  res.json({ reply });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("✅ Server شغال على port " + PORT);
});;

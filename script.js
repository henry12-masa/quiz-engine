const quizzes = [
  { id: "jisei", name: "辞世の句", file: "data/jisei.js" },
  { id: "castle", name: "城クイズ", file: "data/castle.js" },
  { id: "chunibyo", name: "中二病歴史用語", file: "data/chunibyo.js" },
  { id: "heritage", name: "世界遺産", file: "data/heritage.js" },
  { id: "history", name: "歴史クイズ", file: "data/history.js" },
  { id: "ijin", name: "偉人クイズ", file: "data/ijin.js" },
  { id: "kamon", name: "家紋クイズ", file: "data/kamon.js" },
  { id: "meigen", name: "名言クイズ", file: "data/meigen.js" },
  { id: "sengoku", name: "戦国クイズ", file: "data/sengoku.js" }
];

let questions = [];
let currentIndex = 0;
let score = 0;
let answered = false;
let currentScript = null;

const menuEl = document.getElementById("menu");
const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const resultEl = document.getElementById("result");
const countEl = document.getElementById("count");
const scoreEl = document.getElementById("score");
const barEl = document.getElementById("bar");
const titleEl = document.getElementById("title");

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function buildMenu() {
  menuEl.innerHTML = "";

  quizzes.forEach(quiz => {
    const btn = document.createElement("button");
    btn.textContent = quiz.name;
    btn.onclick = () => loadQuiz(quiz);
    menuEl.appendChild(btn);
  });
}

function loadQuiz(quiz) {
  window.quizData = [];

  if (currentScript) {
    currentScript.remove();
  }

  titleEl.textContent = quiz.name;
  questionEl.textContent = "読み込み中...";
  choicesEl.innerHTML = "";
  resultEl.innerHTML = "";
  countEl.textContent = "読み込み中...";
  scoreEl.textContent = "スコア:0";

  const script = document.createElement("script");
  script.src = quiz.file;

  script.onload = () => {
    startQuiz();
  };

  script.onerror = () => {
    questionEl.textContent = `${quiz.name} のデータを読み込めませんでした。`;
  };

  document.body.appendChild(script);
  currentScript = script;
}

function normalizeQuestion(q) {
  if (q.person) {
    return {
      question: q.question || "この問題の答えは？",
      display: q.display || q.quote || "",
      answer: q.person,
      choices: null,
      explain: q.explain || q.e || ""
    };
  }

  return {
    question: q.q || q.question || "この問題の答えは？",
    display: q.display || "",
    answer: q.a || q.answer,
    choices: q.c || q.choices || null,
    explain: q.e || q.explain || ""
  };
}

function createChoices(q) {
  const nq = normalizeQuestion(q);

  if (nq.choices && Array.isArray(nq.choices)) {
    return shuffle(nq.choices);
  }

  const allAnswers = [
    ...new Set(window.quizData.map(item => normalizeQuestion(item).answer))
  ].filter(Boolean);

  const wrong = shuffle(
    allAnswers.filter(answer => answer !== nq.answer)
  ).slice(0, 3);

  return shuffle([nq.answer, ...wrong]);
}

function startQuiz() {
  if (!window.quizData || !Array.isArray(window.quizData) || window.quizData.length === 0) {
    questionEl.textContent = "問題データがありません。";
    return;
  }

  questions = shuffle(window.quizData);
  currentIndex = 0;
  score = 0;
  showQuestion();
}

function showQuestion() {
  answered = false;

  if (currentIndex >= questions.length) {
    questionEl.textContent = "終了！";
    choicesEl.innerHTML = "";
    resultEl.innerHTML = `スコア: ${score} / ${questions.length}`;
    countEl.textContent = `${questions.length} / ${questions.length}`;
    barEl.style.width = "100%";
    return;
  }

  const q = questions[currentIndex];
  const nq = normalizeQuestion(q);

  questionEl.textContent = nq.question;
  resultEl.innerHTML = nq.display ? `<div class="quote">${nq.display}</div>` : "";

  countEl.textContent = `${currentIndex + 1} / ${questions.length}`;
  scoreEl.textContent = `スコア:${score}`;
  barEl.style.width = `${((currentIndex + 1) / questions.length) * 100}%`;

  choicesEl.innerHTML = "";

  createChoices(q).forEach(choice => {
    const button = document.createElement("button");
    button.className = "choice-btn";
    button.textContent = choice;
    button.onclick = () => checkAnswer(choice, q);
    choicesEl.appendChild(button);
  });
}

function checkAnswer(choice, q) {
  if (answered) return;
  answered = true;

  const nq = normalizeQuestion(q);

  document.querySelectorAll(".choice-btn").forEach(btn => {
    btn.disabled = true;

    if (btn.textContent === nq.answer) {
      btn.style.background = "#4caf50";
      btn.style.color = "#fff";
    }

    if (btn.textContent === choice && choice !== nq.answer) {
      btn.style.background = "#f44336";
      btn.style.color = "#fff";
    }
  });

  if (choice === nq.answer) {
    score++;
    resultEl.innerHTML = `
      <div class="correct">正解！</div>
      <div class="explain">${nq.explain}</div>
    `;
  } else {
    resultEl.innerHTML = `
      <div class="wrong">不正解！</div>
      <div class="explain">正解: ${nq.answer}<br><br>${nq.explain}</div>
    `;
  }

  scoreEl.textContent = `スコア:${score}`;

  setTimeout(() => {
    currentIndex++;
    showQuestion();
  }, 1800);
}

buildMenu();
loadQuiz(quizzes[0]);

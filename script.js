let questions = [];
let currentIndex = 0;
let score = 0;
let answered = false;

const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const resultEl = document.getElementById("result");
const progressEl = document.getElementById("count");
const scoreEl = document.getElementById("score");

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function createChoices(correctPerson) {
  const allNames = [...new Set(window.quizData.map(q => q.person))];
  const wrong = shuffle(allNames.filter(name => name !== correctPerson)).slice(0, 3);
  return shuffle([correctPerson, ...wrong]);
}

function startQuiz() {
  questions = shuffle(window.quizData); // ← 全問読み込み
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
    progressEl.textContent = `${questions.length} / ${questions.length}`;
    return;
  }

  const q = questions[currentIndex];

  questionEl.textContent = q.question;
  resultEl.innerHTML = `<div class="quote">${q.display}</div>`;
  progressEl.textContent = `${currentIndex + 1} / ${questions.length}`;
  scoreEl.textContent = `正解: ${score}`;

  choicesEl.innerHTML = "";

  createChoices(q.person).forEach(choice => {
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

  document.querySelectorAll(".choice-btn").forEach(btn => {
    btn.disabled = true;

    if (btn.textContent === q.person) {
      btn.style.background = "#4caf50";
      btn.style.color = "#fff";
    }

    if (btn.textContent === choice && choice !== q.person) {
      btn.style.background = "#f44336";
      btn.style.color = "#fff";
    }
  });

  if (choice === q.person) {
    score++;
    resultEl.innerHTML = `
      <div class="correct">正解！</div>
      <div class="quote">${q.display}</div>
      <div class="explain">${q.explain}</div>
    `;
  } else {
    resultEl.innerHTML = `
      <div class="wrong">不正解！</div>
      <div class="quote">${q.display}</div>
      <div class="explain">正解: ${q.person}<br><br>${q.explain}</div>
    `;
  }

  scoreEl.textContent = `正解: ${score}`;

  setTimeout(() => {
    currentIndex++;
    showQuestion();
  }, 1800);
}

if (!window.quizData || !Array.isArray(window.quizData)) {
  questionEl.textContent = "問題データが読み込めませんでした。";
  choicesEl.innerHTML = "";
  resultEl.innerHTML = "";
} else {
  startQuiz();
}

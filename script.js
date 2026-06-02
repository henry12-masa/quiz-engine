const QUESTION_COUNT = 50;

let questions = [];
let currentIndex = 0;
let score = 0;
let answered = false;

const questionEl = document.getElementById("question");
const choicesEl = document.getElementById("choices");
const resultEl = document.getElementById("result");
const progressEl = document.getElementById("progress");
const scoreEl = document.getElementById("score");

function shuffle(array) {
  return [...array].sort(() => Math.random() - 0.5);
}

function createChoices(correctPerson) {
  const allNames = [...new Set(window.quizData.map(q => q.person))];

  const wrong = shuffle(
    allNames.filter(name => name !== correctPerson)
  ).slice(0, 3);

  return shuffle([correctPerson, ...wrong]);
}

function startQuiz() {
  questions = shuffle(window.quizData).slice(0, QUESTION_COUNT);

  currentIndex = 0;
  score = 0;

  showQuestion();
}

function showQuestion() {
  answered = false;

  if (currentIndex >= questions.length) {
    questionEl.textContent = "終了！";
    choicesEl.innerHTML = "";
    resultEl.innerHTML = `
      スコア: ${score} / ${questions.length}
    `;
    return;
  }

  const q = questions[currentIndex];

  questionEl.textContent = q.question;

  resultEl.innerHTML = `
    <div class="quote">
      ${q.display}
    </div>
  `;

  progressEl.textContent =
    `${currentIndex + 1} / ${questions.length}`;

  scoreEl.textContent =
    `正解: ${score}`;

  choicesEl.innerHTML = "";

  const choices = createChoices(q.person);

  choices.forEach(choice => {
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

  const buttons =
    document.querySelectorAll(".choice-btn");

  buttons.forEach(btn => {
    btn.disabled = true;

    if (btn.textContent === q.person) {
      btn.style.background = "#4caf50";
      btn.style.color = "#fff";
    }

    if (
      btn.textContent === choice &&
      choice !== q.person
    ) {
      btn.style.background = "#f44336";
      btn.style.color = "#fff";
    }
  });

  if (choice === q.person) {
    score++;

    resultEl.innerHTML = `
      <div class="correct">
        正解！
      </div>
      <div class="explain">
        ${q.explain}
      </div>
    `;
  } else {
    resultEl.innerHTML = `
      <div class="wrong">
        不正解！
      </div>
      <div class="explain">
        正解: ${q.person}<br><br>
        ${q.explain}
      </div>
    `;
  }

  scoreEl.textContent =
    `正解: ${score}`;

  setTimeout(() => {
    currentIndex++;
    showQuestion();
  }, 1800);
}

startQuiz();

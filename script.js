const type =
  new URLSearchParams(location.search).get("type") || "history";

const info = {
  history: { title: "歴史クイズ", desc: "歴史クイズに挑戦" },
  sengoku: { title: "戦国クイズ", desc: "戦国武将クイズに挑戦" },
  castle: { title: "城クイズ", desc: "城クイズに挑戦" },
  jisei: { title: "辞世の句クイズ", desc: "辞世の句クイズに挑戦" },
  kamon: { title: "家紋クイズ", desc: "家紋クイズに挑戦" },
  ijin: { title: "偉人クイズ", desc: "偉人クイズに挑戦" },
  meigen: { title: "名言クイズ", desc: "名言クイズに挑戦" },
  heritage: { title: "世界遺産クイズ", desc: "世界遺産クイズに挑戦" },
  chunibyo: { title: "中二病歴史クイズ", desc: "中二病歴史クイズに挑戦" },
  aiart: { title: "AI画像クイズ", desc: "AI画像クイズに挑戦" }
};

const menuNames = {
  history: "歴史",
  sengoku: "戦国",
  castle: "城",
  jisei: "辞世の句",
  kamon: "家紋",
  ijin: "偉人",
  meigen: "名言",
  heritage: "世界遺産",
  chunibyo: "中二病歴史",
  aiart: "AI画像"
};

const currentInfo = info[type] || info.history;

document.title = currentInfo.title;
document.querySelector('meta[name="description"]').content = currentInfo.desc;
document.getElementById("title").textContent = currentInfo.title;
document.getElementById("desc").textContent = currentInfo.desc;

document.getElementById("menu").innerHTML =
  Object.keys(menuNames).map(key => `
    <a href="/?type=${key}" class="${key === type ? "active" : ""}">
      ${menuNames[key]}
    </a>
  `).join("");

const dataScript = document.createElement("script");
dataScript.src = `data/${type}.js`;

dataScript.onload = () => {
  if (!window.quizData || !Array.isArray(window.quizData)) {
    showError("問題データがありません。");
    return;
  }

  startQuiz(window.quizData);
};

dataScript.onerror = () => {
  showError(`data/${type}.js が見つかりません。`);
};

document.body.appendChild(dataScript);

function showError(message) {
  document.getElementById("count").textContent = "エラー";
  document.getElementById("question").textContent = message;
  document.getElementById("choices").innerHTML = "";
}

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function escapeText(text) {
  return String(text)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function startQuiz(data) {
  let questions = shuffle([...data]).slice(0, 50);
  let current = 0;
  let score = 0;
  let locked = false;

  function showQuestion() {
    locked = false;
    document.getElementById("result").textContent = "";

    if (current >= questions.length) {
      showFinish();
      return;
    }

    const q = questions[current];

    document.getElementById("count").textContent =
      `${current + 1}/${questions.length}`;

    document.getElementById("score").textContent =
      `スコア:${score}`;

    document.getElementById("bar").style.width =
      `${(current / questions.length) * 100}%`;

    document.getElementById("question").textContent = q.q;

    document.getElementById("choices").innerHTML =
      shuffle([...q.c]).map(choice => `
        <button onclick="answer(this, '${escapeText(choice)}')">
          ${escapeText(choice)}
        </button>
      `).join("");
  }

  window.answer = function(btn, choice) {
    if (locked) return;
    locked = true;

    const q = questions[current];
    const buttons = document.querySelectorAll("#choices button");

    buttons.forEach(b => {
      b.disabled = true;

      if (b.textContent.trim() === q.a) {
        b.classList.add("correct");
      }
    });

    if (choice === q.a) {
      score++;
      btn.classList.add("correct");
      document.getElementById("result").textContent = "正解！";
    } else {
      btn.classList.add("wrong");
      document.getElementById("result").textContent =
        `不正解。正解は「${q.a}」`;
    }

    document.getElementById("score").textContent = `スコア:${score}`;

    setTimeout(() => {
      current++;
      showQuestion();
    }, 1000);
  };

  function showFinish() {
    document.getElementById("bar").style.width = "100%";
    document.getElementById("count").textContent = "終了";
    document.getElementById("question").textContent = "結果発表";

    document.getElementById("choices").innerHTML = `
      <div class="finish">
        <p>${questions.length}問中 ${score}問 正解！</p>
        <button onclick="location.reload()">もう一度挑戦する</button>
      </div>
    `;

    document.getElementById("result").textContent = "";
  }

  showQuestion();
}

const params = new URLSearchParams(location.search);
const type = params.get("type") || "history";

const quizInfo = {
  history: {
    title: "歴史クイズ",
    desc: "世界史・日本史の知識を試せる歴史クイズです。"
  },
  sengoku: {
    title: "戦国武将クイズ",
    desc: "戦国武将・合戦・逸話を当てるクイズです。"
  },
  castle: {
    title: "城クイズ",
    desc: "日本の城・世界の城に関するクイズです。"
  }
};

const quizData = {
  history: [
    { q: "ナポレオンが皇帝になった国は？", c: ["フランス", "イギリス", "ロシア", "ドイツ"], a: "フランス" },
    { q: "ピラミッドで有名な古代文明は？", c: ["エジプト文明", "インダス文明", "黄河文明", "メソポタミア文明"], a: "エジプト文明" },
    { q: "ローマ帝国の首都だった都市は？", c: ["ローマ", "パリ", "ロンドン", "ベルリン"], a: "ローマ" },
    { q: "アメリカ独立宣言が出された年は？", c: ["1776年", "1789年", "1600年", "1868年"], a: "1776年" },
    { q: "フランス革命が始まった年は？", c: ["1789年", "1776年", "1815年", "1914年"], a: "1789年" },
    { q: "徳川幕府を開いた人物は？", c: ["徳川家康", "織田信長", "豊臣秀吉", "足利尊氏"], a: "徳川家康" },
    { q: "明治維新が起きた時代は？", c: ["19世紀", "16世紀", "18世紀", "20世紀"], a: "19世紀" },
    { q: "源頼朝が開いた幕府は？", c: ["鎌倉幕府", "室町幕府", "江戸幕府", "明治政府"], a: "鎌倉幕府" },
    { q: "関ヶ原の戦いが起きた年は？", c: ["1600年", "1582年", "1615年", "1467年"], a: "1600年" },
    { q: "大化の改新で有名な人物は？", c: ["中大兄皇子", "徳川家康", "坂本龍馬", "聖徳太子"], a: "中大兄皇子" }
  ],

  sengoku: [
    { q: "独眼竜と呼ばれた武将は？", c: ["伊達政宗", "武田信玄", "上杉謙信", "毛利元就"], a: "伊達政宗" },
    { q: "本能寺の変で討たれた人物は？", c: ["織田信長", "豊臣秀吉", "徳川家康", "明智光秀"], a: "織田信長" },
    { q: "本能寺の変を起こした人物は？", c: ["明智光秀", "石田三成", "柴田勝家", "今川義元"], a: "明智光秀" },
    { q: "甲斐の虎と呼ばれた武将は？", c: ["武田信玄", "上杉謙信", "北条氏康", "島津義弘"], a: "武田信玄" },
    { q: "越後の龍と呼ばれた武将は？", c: ["上杉謙信", "伊達政宗", "毛利元就", "真田幸村"], a: "上杉謙信" },
    { q: "桶狭間の戦いで敗れた人物は？", c: ["今川義元", "織田信長", "徳川家康", "豊臣秀吉"], a: "今川義元" },
    { q: "三本の矢の逸話で有名な武将は？", c: ["毛利元就", "武田信玄", "島津義弘", "北条氏康"], a: "毛利元就" },
    { q: "豊臣秀吉の幼名は？", c: ["日吉丸", "竹千代", "梵天丸", "虎千代"], a: "日吉丸" },
    { q: "徳川家康の幼名は？", c: ["竹千代", "日吉丸", "牛若丸", "梵天丸"], a: "竹千代" },
    { q: "真田幸村の本名として知られる名は？", c: ["真田信繁", "真田昌幸", "真田信之", "真田幸隆"], a: "真田信繁" }
  ],

  castle: [
    { q: "姫路城がある都道府県は？", c: ["兵庫県", "大阪府", "京都府", "滋賀県"], a: "兵庫県" },
    { q: "別名『白鷺城』と呼ばれる城は？", c: ["姫路城", "大阪城", "松本城", "熊本城"], a: "姫路城" },
    { q: "黒い外観で有名な国宝の城は？", c: ["松本城", "姫路城", "名古屋城", "小田原城"], a: "松本城" },
    { q: "豊臣秀吉が築いたことで有名な城は？", c: ["大阪城", "江戸城", "会津若松城", "松江城"], a: "大阪城" },
    { q: "加藤清正ゆかりの城は？", c: ["熊本城", "姫路城", "松本城", "彦根城"], a: "熊本城" },
    { q: "徳川家康が入ったことで有名な城は？", c: ["江戸城", "大阪城", "安土城", "小谷城"], a: "江戸城" },
    { q: "井伊家ゆかりの城は？", c: ["彦根城", "熊本城", "松本城", "高知城"], a: "彦根城" },
    { q: "織田信長が築いた城は？", c: ["安土城", "江戸城", "熊本城", "高知城"], a: "安土城" },
    { q: "現存天守で有名な高知県の城は？", c: ["高知城", "松江城", "犬山城", "丸岡城"], a: "高知城" },
    { q: "犬山城がある県は？", c: ["愛知県", "岐阜県", "三重県", "静岡県"], a: "愛知県" }
  ]
};

const info = quizInfo[type] || quizInfo.history;
const allQuestions = quizData[type] || quizData.history;

document.title = info.title;
document.querySelector("meta[name='description']").setAttribute("content", info.desc);
document.getElementById("pageTitle").textContent = info.title;
document.getElementById("pageDesc").textContent = info.desc;

const quizList = document.getElementById("quizList");
quizList.innerHTML = Object.keys(quizInfo).map(key => `
  <a href="/?type=${key}" class="${key === type ? "active" : ""}">
    ${quizInfo[key].title}
  </a>
`).join("");

let questions = shuffle([...allQuestions]).slice(0, 50);
let current = 0;
let score = 0;
let answered = false;

function shuffle(array) {
  return array.sort(() => Math.random() - 0.5);
}

function showQuestion() {
  answered = false;

  if (current >= questions.length) {
    showFinish();
    return;
  }

  const q = questions[current];

  document.getElementById("counter").textContent = `${current + 1} / ${questions.length}`;
  document.getElementById("score").textContent = `スコア: ${score}`;
  document.getElementById("question").textContent = q.q;
  document.getElementById("result").textContent = "";

  const progress = ((current) / questions.length) * 100;
  document.getElementById("progressBar").style.width = `${progress}%`;

  document.getElementById("choices").innerHTML = shuffle([...q.c]).map(choice => `
    <button onclick="checkAnswer(this, '${choice.replace(/'/g, "\\'")}')">
      ${choice}
    </button>
  `).join("");
}

function checkAnswer(button, choice) {
  if (answered) return;
  answered = true;

  const q = questions[current];
  const buttons = document.querySelectorAll("#choices button");

  buttons.forEach(btn => {
    btn.disabled = true;
    if (btn.textContent.trim() === q.a) {
      btn.classList.add("correct");
    }
  });

  if (choice === q.a) {
    score++;
    button.classList.add("correct");
    document.getElementById("result").textContent = "正解！";
  } else {
    button.classList.add("wrong");
    document.getElementById("result").textContent = `不正解。正解は「${q.a}」`;
  }

  document.getElementById("score").textContent = `スコア: ${score}`;

  setTimeout(() => {
    current++;
    showQuestion();
  }, 1200);
}

function showFinish() {
  document.getElementById("progressBar").style.width = "100%";
  document.getElementById("counter").textContent = `終了`;
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
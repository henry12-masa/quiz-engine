const type =
  new URLSearchParams(location.search).get("type")
  || "history";

const quizData = {
  history: [
    {
      question: "ナポレオンが皇帝になった国は？",
      choices: ["フランス","イギリス","ロシア","ドイツ"],
      answer: "フランス"
    }
  ],

  sengoku: [
    {
      question: "独眼竜は？",
      choices: ["伊達政宗","織田信長","武田信玄","徳川家康"],
      answer: "伊達政宗"
    }
  ]
};

const questions = quizData[type];

document.getElementById("title").textContent =
  `${type} クイズ`;

const q = questions[0];

document.getElementById("quiz").innerHTML = `
<h2>${q.question}</h2>

${q.choices.map(choice => `
<button onclick="checkAnswer('${choice}')">
${choice}
</button>
`).join("")}
`;

function checkAnswer(choice) {
  alert(choice === q.answer ? "正解！" : "不正解！");
}
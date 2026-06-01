const type =
new URLSearchParams(location.search).get("type")
|| "history";

const info = {

history:{
title:"歴史クイズ",
desc:"歴史クイズ"
},

sengoku:{
title:"戦国クイズ",
desc:"戦国武将クイズ"
},

castle:{
title:"城クイズ",
desc:"城クイズ"
},

jisei:{
title:"辞世の句クイズ",
desc:"辞世の句クイズ"
},

kamon:{
title:"家紋クイズ",
desc:"家紋クイズ"
},

ijin:{
title:"偉人クイズ",
desc:"偉人クイズ"
},

meigen:{
title:"名言クイズ",
desc:"名言クイズ"
},

heritage:{
title:"世界遺産クイズ",
desc:"世界遺産クイズ"
},

chunibyo:{
title:"中二病歴史クイズ",
desc:"中二病歴史クイズ"
},

aiart:{
title:"AI画像クイズ",
desc:"AI画像クイズ"
}

};

document.title = info[type].title;

document.querySelector(
'meta[name="description"]'
).content = info[type].desc;

document.getElementById("title").textContent =
info[type].title;

document.getElementById("desc").textContent =
info[type].desc;

document.getElementById("menu").innerHTML = `
<a href="/?type=history">歴史</a>
<a href="/?type=sengoku">戦国</a>
<a href="/?type=castle">城</a>
<a href="/?type=jisei">辞世</a>
<a href="/?type=kamon">家紋</a>
<a href="/?type=ijin">偉人</a>
<a href="/?type=meigen">名言</a>
<a href="/?type=heritage">世界遺産</a>
<a href="/?type=chunibyo">中二病</a>
<a href="/?type=aiart">AI画像</a>
`;

const script =
document.createElement("script");

script.src = `data/${type}.js`;

script.onload = () => {

startQuiz(window.quizData);

};

document.body.appendChild(script);

function shuffle(arr){

return arr.sort(()=>Math.random()-0.5);

}

function startQuiz(data){

let questions =
shuffle([...data]).slice(0,50);

let current = 0;
let score = 0;
let lock = false;

function show(){

if(current >= questions.length){

document.getElementById("question")
.innerHTML =
`${questions.length}問中 ${score}問正解！`;

document.getElementById("choices")
.innerHTML =
`<button onclick="location.reload()">
もう一度遊ぶ
</button>`;

return;

}

const q = questions[current];

document.getElementById("count")
.textContent =
`${current+1}/${questions.length}`;

document.getElementById("score")
.textContent =
`スコア:${score}`;

document.getElementById("bar")
.style.width =
`${(current/questions.length)*100}%`;

document.getElementById("question")
.textContent = q.q;

document.getElementById("choices")
.innerHTML =
shuffle([...q.c])
.map(choice => `
<button onclick="answer(this,'${choice}')">
${choice}
</button>
`).join("");

}

window.answer = (btn,choice)=>{

if(lock) return;

lock = true;

const q = questions[current];

const buttons =
document.querySelectorAll("#choices button");

buttons.forEach(b=>{

b.disabled = true;

if(b.textContent === q.a){

b.classList.add("correct");

}

});

if(choice === q.a){

score++;

btn.classList.add("correct");

}else{

btn.classList.add("wrong");

}

setTimeout(()=>{

current++;

lock = false;

show();

},1000);

};

show();

}

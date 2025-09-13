const SAVE_KEY = "jw_kids_game";
let lang = "en";
let state = loadState();

function loadState() {
  try {
    const raw = localStorage.getItem(SAVE_KEY);
    return raw ? JSON.parse(raw) : { high:{Trivia:0,Verse:0,Service:0} };
  } catch { return { high:{Trivia:0,Verse:0,Service:0} }; }
}
function saveState() { localStorage.setItem(SAVE_KEY, JSON.stringify(state)); }

const t = {
  en: { trivia:"Trivia", verse:"Verse Match", service:"Service Scenarios", back:"Back", correct:"Correct!", wrong:"Wrong!", score:"Final Score", high:"New High Score!" },
  id: { trivia:"Trivia", verse:"Cocokkan Ayat", service:"Skenario Pelayanan", back:"Kembali", correct:"Benar!", wrong:"Salah!", score:"Skor Akhir", high:"Skor Tertinggi Baru!" }
};

const BANKS = {
  TRIVIA: [
    { en:{q:"Who built a big boat called the ark?", a:"Noah", c:["Noah","Moses","David","Peter"], img:"🛶"}, id:{q:"Siapa yang membangun bahtera besar?", a:"Nuh", c:["Nuh","Musa","Daud","Petrus"], img:"🛶"} },
    { en:{q:"Who was the first man?", a:"Adam", c:["Adam","Abraham","Jacob","Paul"], img:"👨"}, id:{q:"Siapa manusia pertama?", a:"Adam", c:["Adam","Abraham","Yakub","Paulus"], img:"👨"} },
    { en:{q:"Who killed the giant Goliath?", a:"David", c:["David","Moses","Joseph","Elijah"], img:"🏹"}, id:{q:"Siapa yang mengalahkan Goliat?", a:"Daud", c:["Daud","Musa","Yusuf","Eliya"], img:"🏹"} },
    { en:{q:"What did Jehovah create on the first day?", a:"Light", c:["Light","Animals","Trees","Birds"], img:"💡"}, id:{q:"Apa yang Yehuwa ciptakan pada hari pertama?", a:"Terang", c:["Terang","Binatang","Pohon","Burung"], img:"💡"} },
    { en:{q:"Who was swallowed by a big fish?", a:"Jonah", c:["Jonah","Noah","Elijah","Peter"], img:"🐟"}, id:{q:"Siapa yang ditelan ikan besar?", a:"Yunus", c:["Yunus","Nuh","Eliya","Petrus"], img:"🐟"} },
  ],
  VERSE: [
    { en:{ref:"Psalm 23:1", clue:"Jehovah is my Shepherd"}, id:{ref:"Mazmur 23:1", clue:"Yehuwa adalah Gembalaku"} },
    { en:{ref:"John 3:16", clue:"God loved the world"}, id:{ref:"Yohanes 3:16", clue:"Allah mengasihi dunia"} },
    { en:{ref:"Genesis 1:1", clue:"In the beginning God created..."}, id:{ref:"Kejadian 1:1", clue:"Pada mulanya Allah menciptakan..."} }
  ],
  SERVICE: [
    { en:{s:"Friend: Who made the animals?", opts:["Jehovah made them.","No one made them.","Aliens made them."], good:0}, id:{s:"Teman: Siapa yang membuat binatang?", opts:["Yehuwa yang membuatnya.","Tidak ada yang membuatnya.","Alien yang membuatnya."], good:0} },
    { en:{s:"Friend: Why do we pray?", opts:["To talk to Jehovah.","Because bored.","To wish for toys."], good:0}, id:{s:"Teman: Kenapa kita berdoa?", opts:["Untuk bicara dengan Yehuwa.","Karena bosan.","Untuk minta mainan."], good:0} }
  ]
};

function $(id){return document.querySelector(id);}

function showFeedback(msg, type){
  const fb = $("#feedback");
  fb.textContent = msg;
  fb.className = type; // applies .correct or .wrong
  setTimeout(()=>{ fb.textContent=""; fb.className=""; }, 1200);
}

function setLang(l){ lang=l; $("#langBtn").textContent=(lang==="en"?"🇮🇩 Indonesia":"🇺🇸 English"); renderHome(); renderScores();}
$("#langBtn").addEventListener("click",()=>setLang(lang==="en"?"id":"en"));

$("#btnTrivia").addEventListener("click",renderTrivia);
$("#btnVerse").addEventListener("click",renderVerse);
$("#btnService").addEventListener("click",renderService);

function renderHome(){ $("#playPanel").innerHTML=`<div id="feedback"></div><p>🎉 Choose a game!</p>`; }
function renderScores(){
  $("#scores").innerHTML=`Trivia: ${state.high.Trivia||0}<br>Verse: ${state.high.Verse||0}<br>Service: ${state.high.Service||0}`;
}

/* Trivia */
function renderTrivia(){
  const L=t[lang]; let qn=0,score=0;
  const questions=[...BANKS.TRIVIA]; $("#playPanel").innerHTML=`<div id="feedback"></div><div id="qbox"></div>`;
  step();
  function step(){
    if(qn>=questions.length) return finish();
    const q=questions[qn][lang];
    $("#qbox").innerHTML=`<div class="question">${q.img} ${q.q}</div>
      <div class="choices">${q.c.map(c=>`<button>${c}</button>`).join("")}</div>`;
    $("#qbox").querySelectorAll("button").forEach(b=>b.onclick=()=>{
      if(b.textContent===q.a){ b.classList.add("correct"); score++; showFeedback("✅ "+L.correct,"correct"); }
      else { b.classList.add("wrong"); showFeedback("❌ "+L.wrong+" — "+q.a,"wrong"); }
      qn++; setTimeout(step,1000);
    });
  }
  function finish(){ if(score>state.high.Trivia){state.high.Trivia=score;saveState();}
    $("#playPanel").innerHTML=`<h2>${L.score}: ${score}</h2><button id="backBtn">${L.back}</button>`;
    $("#backBtn").onclick=renderHome; renderScores();
  }
}

/* Verse */
function renderVerse(){
  const L=t[lang]; let qn=0,score=0;
  const qs=[...BANKS.VERSE];
  step();
  function step(){
    if(qn>=qs.length) return finish();
    const q=qs[qn][lang]; const choices=qs.map(x=>x[lang].ref);
    $("#playPanel").innerHTML=`<div id="feedback"></div><div class="question">${q.clue}</div>
      <div class="choices">${choices.map(c=>`<button>${c}</button>`).join("")}</div>`;
    $("#playPanel").querySelectorAll("button").forEach(b=>b.onclick=()=>{
      if(b.textContent===q.ref){score++; showFeedback("✅ "+L.correct,"correct");}
      else showFeedback("❌ "+L.wrong+" — "+q.ref,"wrong");
      qn++; setTimeout(step,1000);
    });
  }
  function finish(){ if(score>state.high.Verse){state.high.Verse=score;saveState();}
    $("#playPanel").innerHTML=`<h2>${L.score}: ${score}</h2><button id="backBtn">${L.back}</button>`;
    $("#backBtn").onclick=renderHome; renderScores();
  }
}

/* Service */
function renderService(){
  const L=t[lang]; let qn=0,score=0; const qs=[...BANKS.SERVICE];
  step();
  function step(){
    if(qn>=qs.length) return finish();
    const q=qs[qn][lang];
    $("#playPanel").innerHTML=`<div id="feedback"></div><div class="question">${q.s}</div>
      <div class="choices">${q.opts.map(c=>`<button>${c}</button>`).join("")}</div>`;
    $("#playPanel").querySelectorAll("button").forEach((b,i)=>b.onclick=()=>{
      if(i===q.good){score++; showFeedback("✅ "+L.correct,"correct");} 
      else showFeedback("❌ "+L.wrong,"wrong");
      qn++; setTimeout(step,1000);
    });
  }
  function finish(){ if(score>state.high.Service){state.high.Service=score;saveState();}
    $("#playPanel").innerHTML=`<h2>${L.score}: ${score}</h2><button id="backBtn">${L.back}</button>`;
    $("#backBtn").onclick=renderHome; renderScores();
  }
}

setLang("en");

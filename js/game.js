/* ==========================================================
   ゲーム本体ロジック（index.html から読み込み）
   ========================================================== */

const AGE_CATEGORIES = [
  { key: "elem_low",  label: "小学生（低学年）" },
  { key: "elem_high", label: "小学生（高学年）" },
  { key: "junior",    label: "中学生" },
  { key: "senior",    label: "高校生" },
  { key: "univ",      label: "大学生" },
  { key: "other",     label: "その他（実年齢）" },
];

const state = {
  name: "",
  ageCategoryKey: null,
  ageValue: null,
  duration: 60,
  timeLeft: 0,
  timerId: null,
  score: 0,
  correctCount: 0,
  mistakeCount: 0,
  currentItem: null,
  candidates: [],
  typed: "",
  playing: false,
};

const RARE_ITEM_CHANCE = 0.06; // レア問題が出る確率（6%）

function normalize(str) {
  return str.toLowerCase().replace(/[^a-z]/g, "");
}

function pickWord() {
  if (Math.random() < RARE_ITEM_CHANCE) {
    const rIdx = Math.floor(Math.random() * RARE_ITEMS.length);
    return RARE_ITEMS[rIdx];
  }
  const idx = Math.floor(Math.random() * SUSHI_ITEMS.length);
  return SUSHI_ITEMS[idx];
}

/* 当日のTOP10（10枠すべて表示。空き枠は「ー」） */
function renderLeaderboard(highlightId) {
  const d = new Date();
  document.querySelectorAll(".lb-date").forEach(el => {
    el.textContent = `${d.getMonth() + 1}/${d.getDate()}`;
  });
  const top = getTodayTop(10);
  document.querySelectorAll(".leaderboard-list").forEach(board => {
    board.innerHTML = "";
    for (let i = 0; i < 10; i++) {
      const r = top[i];
      const li = document.createElement("li");
      li.className = "lb-row" + (i < 3 ? ` lb-top${i + 1}` : "");
      if (r && highlightId && r.id === highlightId) li.classList.add("lb-me");
      li.innerHTML = r
        ? `<span class="lb-rank">${i + 1}</span>
           <span class="lb-name">${escapeHTML(r.name)}</span>
           <span class="lb-age">${escapeHTML(r.ageCategory)}</span>
           <span class="lb-score">${r.score.toLocaleString()}円</span>`
        : `<span class="lb-rank">${i + 1}</span>
           <span class="lb-name lb-vacant">ー</span>
           <span class="lb-age"></span>
           <span class="lb-score"></span>`;
      board.appendChild(li);
    }
  });
}

/* ---------- BGM ---------- */
const bgm = new Audio();
bgm.loop = true;
let bgmReady = false;

async function prepareBGM() {
  const rec = await loadBGM();
  if (rec && rec.blob) {
    bgm.src = URL.createObjectURL(rec.blob);
    bgmReady = true;
  }
}

function playBGM() {
  if (!bgmReady) return;
  bgm.volume = Number(getSettings().bgmVolume ?? 0.5);
  bgm.currentTime = 0;
  bgm.play().catch(err => console.warn("BGM再生不可:", err));
}

function stopBGM() {
  if (!bgmReady) return;
  bgm.pause();
  bgm.currentTime = 0;
}

function escapeHTML(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function renderAds() {
  ["left", "right"].forEach(side => {
    const arr = getAds(side);
    const col = document.getElementById(`ads-${side}`);
    col.innerHTML = "";
    arr.forEach((dataUrl, i) => {
      const div = document.createElement("div");
      div.className = "ad-slot" + (dataUrl ? "" : " empty");
      if (dataUrl) {
        const img = document.createElement("img");
        img.src = dataUrl;
        div.appendChild(img);
      } else {
        div.textContent = "広告";
      }
      col.appendChild(div);
    });
  });
}

function showScreen(id) {
  document.querySelectorAll(".screen").forEach(s => s.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

function initEntryScreen() {
  const settings = getSettings();
  state.duration = settings.duration;

  const ageGrid = document.getElementById("age-grid");
  ageGrid.innerHTML = "";
  AGE_CATEGORIES.forEach(cat => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "age-btn";
    btn.textContent = cat.label;
    btn.dataset.key = cat.key;
    btn.addEventListener("click", () => {
      document.querySelectorAll(".age-btn").forEach(b => b.classList.remove("selected"));
      btn.classList.add("selected");
      state.ageCategoryKey = cat.key;
      const ageValueField = document.getElementById("age-value-field");
      ageValueField.classList.toggle("hidden", cat.key !== "other");
      validateEntry();
    });
    ageGrid.appendChild(btn);
  });

  const durationNote = document.getElementById("duration-note");
  if (durationNote) durationNote.textContent = `制限時間：${state.duration}秒`;

  document.getElementById("player-name").addEventListener("input", validateEntry);
  document.getElementById("age-value").addEventListener("input", validateEntry);
  document.getElementById("start-btn").addEventListener("click", startGame);
}

function validateEntry() {
  const name = document.getElementById("player-name").value.trim();
  const startBtn = document.getElementById("start-btn");
  let ok = name.length > 0 && state.ageCategoryKey != null;
  if (state.ageCategoryKey === "other") {
    const v = document.getElementById("age-value").value;
    ok = ok && v !== "" && Number(v) > 0;
  }
  startBtn.disabled = !ok;
}

function startGame() {
  state.name = document.getElementById("player-name").value.trim().slice(0, 20);
  if (state.ageCategoryKey === "other") {
    state.ageValue = Number(document.getElementById("age-value").value);
  } else {
    state.ageValue = null;
  }
  state.score = 0;
  state.correctCount = 0;
  state.mistakeCount = 0;
  state.timeLeft = state.duration;
  state.playing = true;

  showScreen("screen-play");
  document.getElementById("hud-timer").textContent = state.timeLeft;
  document.getElementById("hud-yen").textContent = "0";
  playBGM();
  nextWord();

  state.timerId = setInterval(() => {
    state.timeLeft -= 1;
    document.getElementById("hud-timer").textContent = state.timeLeft;
    if (state.timeLeft <= 0) {
      endGame();
    }
  }, 1000);

  document.addEventListener("keydown", onKeyDown);
}

function nextWord() {
  state.currentItem = pickWord();
  state.candidates = state.currentItem.romaji.map(normalize);
  state.typed = "";
  document.getElementById("word-kana").textContent = state.currentItem.kana;
  document.getElementById("word-price").textContent = `${state.currentItem.price}円`;
  document.getElementById("word-card").classList.toggle("rare", !!state.currentItem.rare);
  const art = document.getElementById("word-art");
  art.innerHTML = sushiSVG(kindFor(state.currentItem), state.currentItem.rare ? "#c9971b" : PLATE_COLORS[state.correctCount % PLATE_COLORS.length]);
  art.classList.remove("arrive");
  void art.offsetWidth;
  art.classList.add("arrive");
  document.getElementById("trivia-box").textContent = "";
  document.getElementById("trivia-box").classList.remove("show");
  const box = document.getElementById("typing-box");
  box.textContent = "";
  box.classList.remove("error", "success");
}

function onKeyDown(e) {
  if (!state.playing) return;
  if (e.key === "Backspace") {
    if (state.typed.length > 0) {
      state.typed = state.typed.slice(0, -1);
      state.candidates = state.currentItem.romaji
        .map(normalize)
        .filter(c => c.startsWith(state.typed));
      updateTypingBox(false);
    }
    e.preventDefault();
    return;
  }
  if (!/^[a-zA-Z]$/.test(e.key)) return;

  const key = e.key.toLowerCase();
  const attempt = state.typed + key;
  const allVariants = state.currentItem.romaji.map(normalize);
  const nextCandidates = allVariants.filter(c => c.startsWith(attempt));

  if (nextCandidates.length > 0) {
    state.typed = attempt;
    state.candidates = nextCandidates;
    updateTypingBox(false);
    if (allVariants.includes(attempt)) {
      onWordComplete();
    }
  } else {
    state.mistakeCount += 1;
    updateTypingBox(true);
  }
  e.preventDefault();
}

function updateTypingBox(isError) {
  const box = document.getElementById("typing-box");
  box.textContent = state.typed;
  box.classList.toggle("error", isError);
  if (isError) {
    setTimeout(() => box.classList.remove("error"), 150);
  }
}

function onWordComplete() {
  state.score += state.currentItem.price;
  state.correctCount += 1;
  document.getElementById("hud-yen").textContent = state.score.toLocaleString();
  showComboToast(state.currentItem.rare ? `レア出現！ +${state.currentItem.price}円` : `+${state.currentItem.price}円`);
  const box = document.getElementById("typing-box");
  box.classList.add("success");
  flySushi(state.currentItem, document.getElementById("word-art"), document.getElementById("hud-yen"));

  const trivia = state.currentItem.trivia;
  const wait = trivia ? 2200 : 180;
  if (trivia) {
    const tbox = document.getElementById("trivia-box");
    tbox.textContent = `💡 ${trivia}`;
    tbox.classList.add("show");
  }
  setTimeout(() => {
    if (state.playing) nextWord();
  }, wait);
}

function showComboToast(text) {
  const el = document.getElementById("combo-toast");
  el.textContent = text;
  el.classList.remove("show");
  void el.offsetWidth; // reflow to restart animation
  el.classList.add("show");
}

function endGame() {
  state.playing = false;
  clearInterval(state.timerId);
  document.removeEventListener("keydown", onKeyDown);
  stopBGM();

  const ageLabel = AGE_CATEGORIES.find(c => c.key === state.ageCategoryKey)?.label || "";
  const now = new Date();
  const id = `${now.getTime()}-${Math.random().toString(36).slice(2, 7)}`;

  addResult({
    id,
    date: dateKey(now),
    timestamp: now.toLocaleString("ja-JP"),
    name: state.name,
    ageCategory: ageLabel,
    ageValue: state.ageValue,
    score: state.score,
    correctCount: state.correctCount,
    mistakeCount: state.mistakeCount,
  });

  document.getElementById("result-total").innerHTML = `${state.score.toLocaleString()}<span>円</span>`;
  document.getElementById("result-rank").textContent = getRank(state.score);
  document.getElementById("result-correct").textContent = state.correctCount;
  document.getElementById("result-mistake").textContent = state.mistakeCount;

  const todayRank = getTodayTop(10).findIndex(r => r.id === id);
  document.getElementById("result-today-rank").textContent =
    todayRank >= 0 ? `🎉 本日の${todayRank + 1}位にランクイン！` : "本日のTOP10入りまであと少し！";
  renderLeaderboard(id);

  showScreen("screen-result");
}

function resetToEntry() {
  document.getElementById("player-name").value = "";
  document.getElementById("age-value").value = "";
  document.getElementById("age-value-field").classList.add("hidden");
  document.querySelectorAll(".age-btn").forEach(b => b.classList.remove("selected"));
  state.ageCategoryKey = null;
  state.ageValue = null;
  state.duration = getSettings().duration;
  const durationNote = document.getElementById("duration-note");
  if (durationNote) durationNote.textContent = `制限時間：${state.duration}秒`;
  validateEntry();
  renderLeaderboard();
  showScreen("screen-entry");
}

document.addEventListener("DOMContentLoaded", () => {
  renderAds();
  initEntryScreen();
  renderLeaderboard();
  buildSushiLane(document.getElementById("sushi-lane"));
  prepareBGM();
  // 日付が変わった時のために1分ごとにランキングを更新
  setInterval(() => { if (!state.playing) renderLeaderboard(); }, 60000);
  document.getElementById("play-again-btn").addEventListener("click", resetToEntry);
  showScreen("screen-entry");
});

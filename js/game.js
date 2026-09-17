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
  typed: "",
  playing: false,
  luckyMode: false,
  rareUsed: false,
  rareAt: 0,
  rareCount: 0,
  hardCount: 0,
  lastKana: "",
};

/* レア問題の出方
   ・通常：1回のゲームで1問だけ。ゲーム時間の20〜70%のどこかでランダムに出現
   ・ラッキーモード：LUCKY_MODE_CHANCE の確率（10人に1人）で発動し、毎問 1/3 でレア */
const LUCKY_MODE_CHANCE = 0.1;
const LUCKY_RARE_CHANCE = 1 / 3;
const HARD_CHANCE = 1 / 10; // 難関問題：全体の約1/10

function randomFrom(list) {
  // 直前と同じ問題が続かないようにする
  let item;
  for (let tries = 0; tries < 5; tries++) {
    item = list[Math.floor(Math.random() * list.length)];
    if (item.kana !== state.lastKana) break;
  }
  return item;
}

function pickWord() {
  const elapsed = state.duration - state.timeLeft;
  let useRare = false;
  if (state.luckyMode) {
    useRare = Math.random() < LUCKY_RARE_CHANCE;
  } else if (!state.rareUsed && elapsed >= state.rareAt) {
    useRare = true;
    state.rareUsed = true;
  }
  let item;
  if (useRare) item = randomFrom(RARE_ITEMS);
  else if (Math.random() < HARD_CHANCE) item = randomFrom(HARD_ITEMS);
  else item = randomFrom([...SUSHI_ITEMS, ...PLACE_ITEMS]);
  state.lastKana = item.kana;
  return item;
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
  state.currentItem = null;
  state.lastKana = "";
  state.rareCount = 0;
  state.hardCount = 0;
  state.rareUsed = false;
  state.rareAt = Math.round(state.duration * (0.2 + Math.random() * 0.5));
  state.luckyMode = Math.random() < LUCKY_MODE_CHANCE;
  state.playing = true;
  document.getElementById("lucky-banner").classList.toggle("hidden", !state.luckyMode);

  showScreen("screen-play");
  document.getElementById("hud-timer").textContent = state.timeLeft;
  document.getElementById("hud-yen").textContent = "0";
  speak(state.luckyMode ? "ラッキーモード！レア問題が、出まくるぞ！" : "よーい、スタート！");
  setTimeout(() => { if (state.playing) nextWord(); }, state.luckyMode ? 2200 : 900);

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
  state.typed = "";
  if (state.currentItem.rare) state.rareCount += 1;
  if (state.currentItem.hard) state.hardCount += 1;
  document.getElementById("word-label").textContent = state.currentItem.label || "";
  document.getElementById("word-label").classList.toggle("hidden", !state.currentItem.label);
  document.getElementById("word-kana").textContent = state.currentItem.kana;
  document.getElementById("word-romaji").textContent = defaultRomaji(state.currentItem);
  document.getElementById("word-price").textContent = `${state.currentItem.price}円`;
  document.getElementById("word-card").classList.toggle("rare", !!state.currentItem.rare);
  document.getElementById("word-card").classList.toggle("place", !!state.currentItem.place);
  document.getElementById("word-card").classList.toggle("hard", !!state.currentItem.hard);
  const it = state.currentItem;
  speak(it.rare ? `レア問題！${it.kana}` : it.hard ? `難関問題！${it.kana}` : it.kana);
  const art = document.getElementById("word-art");
  art.classList.toggle("photo", !!state.currentItem.photo);
  if (state.currentItem.photo) art.innerHTML = `<img src="${state.currentItem.photo}" alt="">`;
  else art.innerHTML = sushiSVG(kindFor(state.currentItem), state.currentItem.rare ? "#c9971b" : state.currentItem.hard ? "#8e9aa6" : PLATE_COLORS[state.correctCount % PLATE_COLORS.length]);
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
  if (!state.playing || !state.currentItem) return;
  if (state.typed === null) return; // 正解直後の待ち時間
  if (e.key === "Backspace") {
    if (state.typed.length > 0) {
      state.typed = state.typed.slice(0, -1);
      updateTypingBox(false);
    }
    e.preventDefault();
    return;
  }
  if (!/^[a-zA-Z]$/.test(e.key)) return;

  const attempt = state.typed + e.key.toLowerCase();
  const m = matchTyping(state.currentItem, attempt);

  if (m.prefix) {
    state.typed = attempt;
    updateTypingBox(false);
    if (m.complete) {
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
  box.textContent = state.typed || "";
  box.classList.toggle("error", isError);
  if (isError) {
    setTimeout(() => box.classList.remove("error"), 150);
  }
}

function onWordComplete() {
  state.score += state.currentItem.price;
  state.correctCount += 1;
  document.getElementById("hud-yen").textContent = state.score.toLocaleString();
  const ci = state.currentItem;
  showComboToast(ci.rare ? `レア出現！ +${ci.price}円` : ci.hard ? `難関突破！ +${ci.price.toLocaleString()}円` : `+${ci.price}円`);
  const box = document.getElementById("typing-box");
  box.classList.add("success");
  flySushi(state.currentItem, document.getElementById("word-art"), document.getElementById("hud-yen"));
  state.typed = null; // 次の問題が出るまで入力を受け付けない

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
  speak("しゅーりょー！");
  document.getElementById("lucky-banner").classList.add("hidden");

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
    luckyMode: state.luckyMode,
    rareCount: state.rareCount,
    hardCount: state.hardCount,
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
  // 日付が変わった時のために1分ごとにランキングを更新
  setInterval(() => { if (!state.playing) renderLeaderboard(); }, 60000);
  document.getElementById("play-again-btn").addEventListener("click", resetToEntry);
  showScreen("screen-entry");
});

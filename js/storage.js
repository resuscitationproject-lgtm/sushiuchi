/* ==========================================================
   localStorage まわりの共通処理
   ・大会中は同じブラウザ（同じ端末）で使い続ける想定です
   ・端末やブラウザを変えるとデータは引き継がれません
   ========================================================== */

const STORAGE_KEYS = {
  results: "sushitypeing_results_v1",
  adsLeft: "sushitypeing_ads_left_v1",
  adsRight: "sushitypeing_ads_right_v1",
  settings: "sushitypeing_settings_v1",
};

const DEFAULT_SETTINGS = {
  duration: 60,          // 秒
  adminPassword: "itclub2026", // 必要に応じて admin.html 上で変更してください
  bgmVolume: 0.5,        // BGM音量（0〜1）
};

/* ---------- 日付（当日ランキング用） ---------- */
function dateKey(d = new Date()) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

// 古い記録（dateフィールドが無いもの）は "2026/11/21 13:23:00" 形式のtimestampから日付を取り出す
function resultDate(r) {
  if (r.date) return r.date;
  const m = String(r.timestamp || "").match(/(\d{4})\/(\d{1,2})\/(\d{1,2})/);
  if (!m) return "";
  return `${m[1]}-${m[2].padStart(2, "0")}-${m[3].padStart(2, "0")}`;
}

function getTodayTop(n = 10) {
  const today = dateKey();
  return getResults()
    .filter(r => resultDate(r) === today)
    .sort((a, b) => b.score - a.score)
    .slice(0, n);
}

/* ---------- BGM（音声ファイルは大きいので IndexedDB に保存） ---------- */
function idbOpen() {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open("sushitypeing_db", 1);
    req.onupgradeneeded = () => req.result.createObjectStore("files");
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

async function idbPut(key, value) {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readwrite");
    tx.objectStore("files").put(value, key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

async function idbGet(key) {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readonly");
    const req = tx.objectStore("files").get(key);
    req.onsuccess = () => resolve(req.result || null);
    req.onerror = () => reject(req.error);
  });
}

async function idbDelete(key) {
  const db = await idbOpen();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("files", "readwrite");
    tx.objectStore("files").delete(key);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

// { name: "ファイル名", blob: Blob } を保存
function saveBGM(file) { return idbPut("bgm", { name: file.name, blob: file }); }
async function loadBGM() { try { return await idbGet("bgm"); } catch (e) { console.warn(e); return null; } }
function deleteBGM() { return idbDelete("bgm"); }

function loadJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch (e) {
    console.warn("読み込み失敗:", key, e);
    return fallback;
  }
}

function saveJSON(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (e) {
    console.error("保存失敗（容量オーバーの可能性があります）:", key, e);
    return false;
  }
}

function getResults() {
  return loadJSON(STORAGE_KEYS.results, []);
}

function addResult(entry) {
  const list = getResults();
  list.push(entry);
  saveJSON(STORAGE_KEYS.results, list);
}

function clearResults() {
  saveJSON(STORAGE_KEYS.results, []);
}

function getAds(side) {
  const key = side === "left" ? STORAGE_KEYS.adsLeft : STORAGE_KEYS.adsRight;
  return loadJSON(key, new Array(6).fill(null));
}

function setAds(side, arr) {
  const key = side === "left" ? STORAGE_KEYS.adsLeft : STORAGE_KEYS.adsRight;
  return saveJSON(key, arr);
}

function getSettings() {
  return Object.assign({}, DEFAULT_SETTINGS, loadJSON(STORAGE_KEYS.settings, {}));
}

function saveSettings(s) {
  saveJSON(STORAGE_KEYS.settings, s);
}

function toCSV(results) {
  const header = ["日時", "ニックネーム", "年齢層", "実年齢", "スコア(円)", "正解数", "ミス数"];
  const rows = results.map(r => [
    r.timestamp,
    csvEscape(r.name),
    csvEscape(r.ageCategory),
    r.ageValue != null ? r.ageValue : "",
    r.score,
    r.correctCount,
    r.mistakeCount,
  ].join(","));
  return [header.join(","), ...rows].join("\r\n");
}

function csvEscape(v) {
  const s = String(v == null ? "" : v);
  if (/[",\r\n]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

function downloadCSV(filename, csvContent) {
  // Excelで文字化けしないようUTF-8 BOMを付与
  const blob = new Blob(["﻿" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/* 画像を縮小してdataURLに変換（localStorage容量対策：最大辺400pxに縮小） */
function resizeImageFile(file, maxSize = 400, quality = 0.82) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        const scale = Math.min(1, maxSize / Math.max(width, height));
        width = Math.round(width * scale);
        height = Math.round(height * scale);
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", quality));
      };
      img.onerror = reject;
      img.src = e.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

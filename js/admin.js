/* ==========================================================
   管理画面ロジック（admin.html から読み込み）
   注意：パスワードチェックはブラウザ内だけで完結する簡易的なものです。
   本格的なアクセス制限が必要な場合は別途サーバー側の対策をご検討ください。
   ========================================================== */

function checkLogin() {
  const pw = document.getElementById("admin-password").value;
  const settings = getSettings();
  if (pw === settings.adminPassword) {
    document.getElementById("login-box").classList.add("hidden");
    document.getElementById("admin-body").classList.remove("hidden");
    renderResults();
    renderUploadGrid("left");
    renderUploadGrid("right");
    document.getElementById("duration-input").value = settings.duration;
    refreshTTSControls();
  } else {
    document.getElementById("login-error").textContent = "パスワードが違います";
  }
}

function renderResults() {
  const results = getResults();
  const tbody = document.getElementById("results-tbody");
  tbody.innerHTML = "";
  results.slice().reverse().forEach(r => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${escapeHTML(r.timestamp)}</td>
      <td>${escapeHTML(r.name)}</td>
      <td>${escapeHTML(r.ageCategory)}</td>
      <td>${r.ageValue != null ? r.ageValue : "-"}</td>
      <td>${r.score.toLocaleString()}円</td>
      <td>${r.correctCount}</td>
      <td>${r.mistakeCount}</td>
    `;
    tbody.appendChild(tr);
  });
  document.getElementById("stat-count").textContent = `参加人数: ${results.length}人`;
  const top = results.reduce((m, r) => Math.max(m, r.score), 0);
  document.getElementById("stat-top").textContent = `最高記録: ${top.toLocaleString()}円`;
}

function escapeHTML(s) {
  return String(s == null ? "" : s).replace(/[&<>"']/g, c => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[c]));
}

function exportCSV() {
  const results = getResults();
  if (results.length === 0) {
    alert("まだ結果がありません。");
    return;
  }
  const csv = toCSV(results);
  const now = new Date();
  const stamp = now.toISOString().slice(0, 19).replace(/[:T]/g, "-");
  downloadCSV(`sushitypeing_results_${stamp}.csv`, csv);
}

function clearAllResults() {
  if (!confirm("すべての結果を削除します。よろしいですか？（元に戻せません）")) return;
  clearResults();
  renderResults();
}

function renderUploadGrid(side) {
  const grid = document.getElementById(`upload-grid-${side}`);
  grid.innerHTML = "";
  const ads = getAds(side);
  ads.forEach((dataUrl, i) => {
    const slot = document.createElement("div");
    slot.className = "upload-slot";

    if (dataUrl) {
      const img = document.createElement("img");
      img.src = dataUrl;
      slot.appendChild(img);
    } else {
      const ph = document.createElement("div");
      ph.className = "placeholder";
      ph.textContent = `枠 ${i + 1}`;
      slot.appendChild(ph);
    }

    const label = document.createElement("div");
    label.textContent = `${side === "left" ? "左" : "右"} ${i + 1}`;
    label.style.fontSize = "12px";
    label.style.marginBottom = "4px";
    slot.insertBefore(label, slot.firstChild);

    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.addEventListener("change", async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      try {
        const resized = await resizeImageFile(file);
        const arr = getAds(side);
        arr[i] = resized;
        setAds(side, arr);
        renderUploadGrid(side);
      } catch (err) {
        alert("画像の読み込みに失敗しました");
        console.error(err);
      }
    });
    slot.appendChild(input);

    if (dataUrl) {
      const removeBtn = document.createElement("button");
      removeBtn.className = "remove";
      removeBtn.textContent = "削除";
      removeBtn.addEventListener("click", () => {
        const arr = getAds(side);
        arr[i] = null;
        setAds(side, arr);
        renderUploadGrid(side);
      });
      slot.appendChild(removeBtn);
    }

    grid.appendChild(slot);
  });
}

function saveDuration() {
  const val = Number(document.getElementById("duration-input").value);
  if (!val || val <= 0) {
    alert("正しい秒数を入力してください");
    return;
  }
  const settings = getSettings();
  settings.duration = val;
  saveSettings(settings);
  alert("制限時間を保存しました");
}

function changePassword() {
  const newPw = document.getElementById("new-password").value.trim();
  if (!newPw) {
    alert("新しいパスワードを入力してください");
    return;
  }
  const settings = getSettings();
  settings.adminPassword = newPw;
  saveSettings(settings);
  document.getElementById("new-password").value = "";
  alert("パスワードを変更しました");
}

/* ---------- 読み上げ ---------- */
function refreshTTSControls() {
  const s = getSettings();
  document.getElementById("tts-enabled").checked = !!s.ttsEnabled;
  [["tts-pitch", "ttsPitch"], ["tts-rate", "ttsRate"], ["tts-volume", "ttsVolume"]].forEach(([id, key]) => {
    document.getElementById(id).value = s[key];
    document.getElementById(`${id}-label`).textContent = Number(s[key]).toFixed(1);
  });
  onVoicesReady(voices => {
    const sel = document.getElementById("tts-voice");
    const current = pickVoice(getSettings().ttsVoice);
    sel.innerHTML = voices.length
      ? voices.map(v => `<option value="${escapeHTML(v.name)}">${escapeHTML(v.name)}</option>`).join("")
      : `<option value="">日本語の音声が見つかりません</option>`;
    if (current) sel.value = current.name;
  });
}

function updateSetting(key, value) {
  const s = getSettings();
  s[key] = value;
  saveSettings(s);
}

function initTTSControls() {
  document.getElementById("tts-enabled").addEventListener("change", e => updateSetting("ttsEnabled", e.target.checked));
  document.getElementById("tts-voice").addEventListener("change", e => updateSetting("ttsVoice", e.target.value));
  [["tts-pitch", "ttsPitch"], ["tts-rate", "ttsRate"], ["tts-volume", "ttsVolume"]].forEach(([id, key]) => {
    document.getElementById(id).addEventListener("input", e => {
      updateSetting(key, Number(e.target.value));
      document.getElementById(`${id}-label`).textContent = Number(e.target.value).toFixed(1);
    });
  });
  document.getElementById("tts-test-btn").addEventListener("click", () => speak("ちゅうとろ", { force: true }));
  document.getElementById("tts-test-rare-btn").addEventListener("click", () => speak("レア問題！にれさとし", { force: true }));
}

document.addEventListener("DOMContentLoaded", () => {
  initTTSControls();
  document.getElementById("login-btn").addEventListener("click", checkLogin);
  document.getElementById("admin-password").addEventListener("keydown", (e) => {
    if (e.key === "Enter") checkLogin();
  });
  document.getElementById("export-csv-btn").addEventListener("click", exportCSV);
  document.getElementById("clear-results-btn").addEventListener("click", clearAllResults);
  document.getElementById("refresh-btn").addEventListener("click", renderResults);
  document.getElementById("save-duration-btn").addEventListener("click", saveDuration);
  document.getElementById("change-password-btn").addEventListener("click", changePassword);
});

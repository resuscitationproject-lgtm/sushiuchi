/* ==========================================================
   問題の読み上げ（ブラウザ標準の音声合成 Web Speech API）
   ・音声ファイル不要。パソコンに入っている日本語音声で読み上げます
   ・声の種類はパソコン／ブラウザによって変わります
     例）Mac：Otoya（男性）/ Kyoko（女性）
         Windows：Ichiro・Keita（男性）/ Haruka・Nanami（女性）
   ・声の高さ・速さを上げると、元気なアニメ風に近づきます
   ========================================================== */

const MALE_VOICE_HINTS = /otoya|hattori|ichiro|keita|daichi|naoki|takumi|male|男性/i;

function getJapaneseVoices() {
  if (!("speechSynthesis" in window)) return [];
  return speechSynthesis.getVoices().filter(v => /^ja/i.test(v.lang));
}

// 設定で選んだ声 → なければ男性っぽい声 → なければ日本語の先頭
function pickVoice(preferredName) {
  const voices = getJapaneseVoices();
  if (voices.length === 0) return null;
  return (
    voices.find(v => v.name === preferredName) ||
    voices.find(v => MALE_VOICE_HINTS.test(v.name)) ||
    voices[0]
  );
}

// 声の一覧は非同期で読み込まれるため、準備できたら callback を呼ぶ
function onVoicesReady(callback) {
  if (!("speechSynthesis" in window)) return callback([]);
  const voices = getJapaneseVoices();
  if (voices.length > 0) return callback(voices);
  speechSynthesis.addEventListener("voiceschanged", () => callback(getJapaneseVoices()), { once: true });
  // voiceschanged が来ないブラウザ向けの保険
  setTimeout(() => callback(getJapaneseVoices()), 1000);
}

function speak(text, { force = false } = {}) {
  if (!("speechSynthesis" in window)) return;
  const s = getSettings();
  if (!s.ttsEnabled && !force) return;
  speechSynthesis.cancel(); // 前の読み上げが残っていたら止める
  const u = new SpeechSynthesisUtterance(text);
  u.lang = "ja-JP";
  const voice = pickVoice(s.ttsVoice);
  if (voice) u.voice = voice;
  u.pitch = Number(s.ttsPitch);
  u.rate = Number(s.ttsRate);
  u.volume = Number(s.ttsVolume);
  speechSynthesis.speak(u);
}

function stopSpeaking() {
  if ("speechSynthesis" in window) speechSynthesis.cancel();
}

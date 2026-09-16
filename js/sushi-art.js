/* ==========================================================
   寿司イラスト（SVG）と回転寿司レーンのアニメーション
   すべてオリジナルの簡易イラストです。
   ========================================================== */

const PLATE_COLORS = ["#1f6fb2", "#f7c948", "#d9362b", "#2fa84f", "#8a5cc2"];

function sushiSVG(kind, plateColor) {
  const plate = `
    <ellipse cx="60" cy="64" rx="56" ry="14" fill="${plateColor}"/>
    <ellipse cx="60" cy="61" rx="46" ry="10" fill="#ffffff"/>`;
  const rice = `<rect x="30" y="38" width="60" height="22" rx="11" fill="#fbfaf4" stroke="#e6e1d0" stroke-width="1.5"/>`;
  let topping = "";
  switch (kind) {
    case "maguro":
      topping = `<path d="M24 42 Q60 18 96 40 Q98 48 90 48 L30 50 Q20 50 24 42 Z" fill="#d7263d"/>
                 <path d="M36 38 Q60 26 84 36" stroke="#f08090" stroke-width="2" fill="none"/>`;
      break;
    case "toro":
      topping = `<path d="M24 42 Q60 18 96 40 Q98 48 90 48 L30 50 Q20 50 24 42 Z" fill="#f39aa6"/>
                 <path d="M34 40 Q60 26 86 38 M40 44 Q60 34 80 42" stroke="#fff" stroke-width="2" fill="none" opacity=".8"/>`;
      break;
    case "salmon":
      topping = `<path d="M24 42 Q60 18 96 40 Q98 48 90 48 L30 50 Q20 50 24 42 Z" fill="#ff8c42"/>
                 <path d="M40 30 L34 48 M54 25 L48 48 M68 25 L62 48 M82 30 L76 47" stroke="#ffe3cc" stroke-width="2.5"/>`;
      break;
    case "tamago":
      topping = `<rect x="24" y="26" width="72" height="20" rx="4" fill="#ffd23f"/>
                 <rect x="52" y="24" width="16" height="36" fill="#1f2d24"/>`;
      break;
    case "ebi":
      topping = `<path d="M22 44 Q60 14 98 42 L92 50 L28 50 Z" fill="#fff2e6"/>
                 <path d="M34 36 L30 48 M48 29 L44 48 M62 27 L58 48 M76 30 L72 48" stroke="#ff6b3d" stroke-width="4"/>
                 <path d="M96 42 L108 34 L106 48 Z" fill="#ff6b3d"/>`;
      break;
    case "white": // いか・たい・ふく など白身
      topping = `<path d="M24 42 Q60 20 96 40 Q98 48 90 48 L30 50 Q20 50 24 42 Z" fill="#f4f7fb" stroke="#d8e2ec" stroke-width="1.5"/>
                 <path d="M40 38 Q60 30 80 38" stroke="#f3b6c0" stroke-width="2" fill="none"/>`;
      break;
    case "tako":
      topping = `<path d="M24 42 Q60 20 96 40 Q98 48 90 48 L30 50 Q20 50 24 42 Z" fill="#fbe9ea"/>
                 <path d="M24 42 Q60 22 96 40" stroke="#b5213a" stroke-width="6" fill="none"/>
                 <circle cx="44" cy="34" r="2.5" fill="#fff"/><circle cx="60" cy="30" r="2.5" fill="#fff"/><circle cx="76" cy="33" r="2.5" fill="#fff"/>`;
      break;
    case "gunkan": // いくら・うに
      return `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">${plate}
        <rect x="32" y="30" width="56" height="30" rx="6" fill="#1f2d24"/>
        <rect x="32" y="30" width="56" height="5" fill="#34463a"/>
        <circle cx="44" cy="28" r="6" fill="#ff5a1f"/><circle cx="56" cy="25" r="6" fill="#ff7a2f"/>
        <circle cx="68" cy="27" r="6" fill="#ff5a1f"/><circle cx="78" cy="29" r="5" fill="#ff7a2f"/>
        <circle cx="50" cy="31" r="5" fill="#ff8f4a"/><circle cx="64" cy="31" r="5" fill="#ff8f4a"/>
        <circle cx="54" cy="23" r="1.6" fill="#fff" opacity=".8"/><circle cx="66" cy="25" r="1.6" fill="#fff" opacity=".8"/>
      </svg>`;
    case "maki":
      return `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">${plate}
        <g transform="translate(42 44)"><circle r="15" fill="#1f2d24"/><circle r="11" fill="#fbfaf4"/><circle r="5" fill="#57b13f"/></g>
        <g transform="translate(78 44)"><circle r="15" fill="#1f2d24"/><circle r="11" fill="#fbfaf4"/><circle r="5" fill="#57b13f"/></g>
      </svg>`;
    case "rare":
      return `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="60" cy="64" rx="56" ry="14" fill="#c9971b"/>
        <ellipse cx="60" cy="61" rx="46" ry="10" fill="#ffe28a"/>
        ${rice}
        <path d="M24 42 Q60 18 96 40 Q98 48 90 48 L30 50 Q20 50 24 42 Z" fill="#f7c948"/>
        <path d="M60 6 L64 16 L75 17 L66 23 L69 34 L60 28 L51 34 L54 23 L45 17 L56 16 Z" fill="#fff4b8" stroke="#c9971b" stroke-width="1.5"/>
      </svg>`;
    default:
      topping = `<path d="M24 42 Q60 20 96 40 Q98 48 90 48 L30 50 Q20 50 24 42 Z" fill="#9fb8c9"/>`;
  }
  return `<svg viewBox="0 0 120 80" xmlns="http://www.w3.org/2000/svg">${plate}${rice}${topping}</svg>`;
}

/* ネタ名 → イラストの種類 */
const SUSHI_KIND = {
  "まぐろ": "maguro", "ちゅうとろ": "toro", "おおとろ": "toro", "かんぱち": "maguro",
  "はまち": "toro", "ぶり": "toro", "ひらまさ": "toro",
  "サーモン": "salmon", "たまご": "tamago", "えび": "ebi",
  "いか": "white", "たい": "white", "すずき": "white", "ふく": "white", "たちうお": "white",
  "ほたて": "white", "たいらぎ": "white", "あじ": "white", "しめさば": "white", "つぶがい": "white",
  "たこ": "tako", "あなご": "tamago",
  "いくら": "gunkan", "うに": "gunkan", "かにみそ": "gunkan", "コーンマヨ": "gunkan",
  "かっぱまき": "maki", "きゅうり": "maki",
};

function kindFor(item) {
  if (!item) return "maguro";
  if (item.rare) return "rare";
  return SUSHI_KIND[item.kana] || "maguro";
}

/* 回転寿司レーン：画面下を寿司が流れ続ける */
function buildSushiLane(el) {
  const kinds = ["maguro", "salmon", "tamago", "gunkan", "ebi", "maki", "tako", "white", "toro"];
  let html = "";
  // 2周分並べて translateX(-50%) でループさせる
  for (let loop = 0; loop < 2; loop++) {
    kinds.forEach((k, i) => {
      html += `<div class="lane-plate">${sushiSVG(k, PLATE_COLORS[i % PLATE_COLORS.length])}</div>`;
    });
  }
  el.innerHTML = `<div class="lane-track">${html}</div>`;
}

/* 正解時：寿司がポンッと跳ねて「円」表示へ飛んでいく */
function flySushi(item, fromEl, toEl) {
  if (!fromEl || !toEl) return;
  const a = fromEl.getBoundingClientRect();
  const b = toEl.getBoundingClientRect();
  const fly = document.createElement("div");
  fly.className = "fly-sushi";
  fly.innerHTML = sushiSVG(kindFor(item), item.rare ? "#c9971b" : PLATE_COLORS[Math.floor(Math.random() * PLATE_COLORS.length)]);
  fly.style.left = `${a.left + a.width / 2 - 45}px`;
  fly.style.top = `${a.top + a.height / 2 - 30}px`;
  fly.style.setProperty("--dx", `${b.left + b.width / 2 - (a.left + a.width / 2)}px`);
  fly.style.setProperty("--dy", `${b.top + b.height / 2 - (a.top + a.height / 2)}px`);
  document.body.appendChild(fly);
  setTimeout(() => fly.remove(), 900);
}

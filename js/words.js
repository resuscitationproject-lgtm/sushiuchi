/* ==========================================================
   寿司ネタ単語データ（寿司の都・北九州／関門海峡テーマ）
   kana   : 画面に表示する見出し（かな/カナ）
   romaji : （省略可）正解として受け付けるローマ字。省略すると kana から
            自動生成します（shi/si、chi/ti、tsu/tu、fu/hu、ji/zi、n/nn などの
            揺れはすべてOK）
            入力比較時は英字以外（ハイフン等）を除去して比較するため
            "sa-mon" のような表記も自動的に "samon" と同一視されます
   price  : 正解した時に加算される「円」
   trivia : （任意）正解時に表示するミニ豆知識。関門海峡・北九州にまつわる
            寿司ネタの学習効果をねらったコメントです
   ========================================================== */

const SUSHI_ITEMS = [
  { kana: "たまご",       romaji: ["tamago"],                 price: 100 },
  { kana: "きゅうり",     romaji: ["kyuuri", "kyuri"],         price: 90 },
  { kana: "サーモン",     romaji: ["samon", "sa-mon"],         price: 120 },
  { kana: "まぐろ",       romaji: ["maguro"],                  price: 150 },
  { kana: "えび",         romaji: ["ebi"],                     price: 130 },
  { kana: "いか",         romaji: ["ika"],                     price: 110 },
  {
    kana: "たこ", romaji: ["tako"], price: 140,
    trivia: "関門海峡は潮の流れが速く、身が締まったタコの好漁場として知られるよ！",
  },
  { kana: "はまち",       romaji: ["hamachi"],                 price: 160 },
  { kana: "あじ",         romaji: ["aji"],                     price: 150 },
  { kana: "ぶり",         romaji: ["buri"],                    price: 180 },
  { kana: "たい",         romaji: ["tai"],                     price: 190 },
  { kana: "すずき",       romaji: ["suzuki"],                  price: 170 },
  { kana: "しめさば",     romaji: ["shimesaba", "simesaba"],   price: 160 },
  { kana: "かっぱまき",   romaji: ["kappamaki"],               price: 100 },
  { kana: "コーンマヨ",   romaji: ["konmayo"],                 price: 100 },
  { kana: "ほたて",       romaji: ["hotate"],                  price: 220 },
  {
    kana: "あなご", romaji: ["anago"], price: 200,
    trivia: "関門海峡～瀬戸内にかけてはアナゴ漁が盛ん。北九州でも昔から親しまれる味だよ！",
  },
  { kana: "つぶがい",     romaji: ["tsubugai", "tubugai"],     price: 250 },
  { kana: "かんぱち",     romaji: ["kanpachi", "kampachi"],    price: 280 },
  { kana: "かにみそ",     romaji: ["kanimiso"],                price: 300 },
  { kana: "いくら",       romaji: ["ikura"],                   price: 380 },
  { kana: "ちゅうとろ",   romaji: ["chuutoro", "chutoro"],     price: 400 },
  { kana: "うに",         romaji: ["uni"],                     price: 500 },
  { kana: "おおとろ",     romaji: ["ootoro", "ohtoro"],        price: 600 },

  /* --- 関門海峡・北九州ゆかりのネタ（寿司の都 特別枠） --- */
  {
    kana: "ふく", romaji: ["fuku"], price: 350,
    trivia: "関門海峡をはさむ下関では「ふぐ」を「ふく」と呼ぶよ。「不遇」を避けて「福（ふく）」にかけた縁起の良い呼び方なんだ！",
  },
  {
    kana: "たちうお", romaji: ["tachiuo"], price: 260,
    trivia: "関門海峡の門司港はタチウオの好漁場。刀のように長く光る見た目からこの名前がついたよ。",
  },
  {
    kana: "ひらまさ", romaji: ["hiramasa"], price: 240,
    trivia: "関門海峡は潮流が速く、ヒラマサなどの回遊魚が身を鍛えられる漁場として有名だよ。",
  },
  {
    kana: "たいらぎ", romaji: ["tairagi"], price: 320,
    trivia: "タイラギは大きな二枚貝。関門海峡周辺でも水揚げされ、貝柱の甘みが人気だよ。",
  },

  /* --- 追加ネタ --- */
  { kana: "あまえび",     price: 200 },
  { kana: "えんがわ",     price: 260 },
  { kana: "ねぎとろ",     price: 220 },
  { kana: "いわし",       price: 130 },
  { kana: "さば",         price: 140 },
  { kana: "かずのこ",     price: 300 },
  { kana: "あかがい",     price: 280 },
  { kana: "とびっこ",     price: 160 },
  { kana: "びんちょう",   price: 150 },
  {
    kana: "ごまさば", price: 240,
    trivia: "ごまさばは、新鮮なサバをごまだれで食べる福岡の郷土料理だよ。",
  },
  {
    kana: "ぬかだき", price: 230,
    trivia: "ぬかだき（じんだ煮）は小倉の郷土料理。サバやイワシを、ぬか床（ぬかみそ）で炊くんだ。",
  },
];

/* ==========================================================
   北九州ならではの名所（寿司の都 観光枠）
   label : 画面に大きく出す漢字表記（入力は kana のローマ字）
   ========================================================== */
const PLACE_ITEMS = [
  {
    label: "小倉城", kana: "こくらじょう", price: 400, place: true,
    trivia: "小倉城は1602年に細川忠興（ほそかわただおき）が築いたお城。今は天守閣の中で歴史を学べるよ。",
  },
  {
    label: "門司港レトロ", kana: "もじこうれとろ", price: 450, place: true,
    trivia: "門司港は明治〜大正に国際貿易港として栄えた港町。当時の洋風の建物が今も残っているよ。",
  },
  {
    label: "若戸大橋", kana: "わかとおおはし", price: 450, place: true,
    trivia: "若戸大橋は1962年に開通した赤い吊り橋。開通当時は「東洋一」の長さの吊り橋だったよ。",
  },
  {
    label: "関門海峡", kana: "かんもんかいきょう", price: 500, place: true,
    trivia: "関門海峡は本州（山口県）と九州（福岡県）の間の海峡。いちばん狭い所は1kmもないんだ。",
  },
  {
    label: "関門トンネル", kana: "かんもんとんねる", price: 450, place: true,
    trivia: "関門トンネルの人道は約780m。海の下を歩いて、福岡県から山口県へ行けるよ！",
  },
  {
    label: "皿倉山", kana: "さらくらやま", price: 400, place: true,
    trivia: "皿倉山は夜景の名所。北九州市は「日本新三大夜景」に選ばれているよ。",
  },
  {
    label: "八幡製鐵所", kana: "やはたせいてつしょ", price: 500, place: true,
    trivia: "官営八幡製鐵所は1901年に操業開始。世界遺産「明治日本の産業革命遺産」のひとつだよ。",
  },
  {
    label: "旦過市場", kana: "たんがいちば", price: 350, place: true,
    trivia: "旦過市場は「北九州の台所」と呼ばれる市場。新鮮な魚やおかずのお店が並ぶよ。",
  },
  {
    label: "河内藤園", kana: "かわちふじえん", price: 400, place: true,
    trivia: "河内藤園は、藤の花のトンネルで有名。海外から見に来る人もいるほど人気だよ。",
  },
  {
    label: "平尾台", kana: "ひらおだい", price: 350, place: true,
    trivia: "平尾台は石灰岩の白い岩が広がるカルスト台地。日本三大カルストのひとつだよ。",
  },
  {
    label: "和布刈神社", kana: "めかりじんじゃ", price: 400, place: true,
    trivia: "和布刈神社は関門海峡のすぐそばの神社。旧暦の元日にワカメを刈る神事が行われるよ。",
  },
  {
    label: "到津の森公園", kana: "いとうづのもりこうえん", price: 450, place: true,
    trivia: "到津の森公園は、市民に支えられて続いている北九州の動物園だよ。",
  },
];

/* ランク表（合計円に応じたコメント。寿司打を参考にしたオリジナル） */
const RANKS = [
  { min: 0,    label: "見習い" },
  { min: 1000, label: "板前見習い" },
  { min: 2000, label: "一人前" },
  { min: 3500, label: "職人" },
  { min: 5000, label: "大将" },
  { min: 7000, label: "皆伝" },
];

function getRank(total) {
  let r = RANKS[0];
  for (const item of RANKS) {
    if (total >= item.min) r = item;
  }
  return r.label;
}

/* ==========================================================
   レア問題（出現率の低いお楽しみ枠）
   北九州ITクラブ／関係者にちなんだ小ネタです。
   ・通常：1回のゲームにつき1問だけ、ランダムなタイミングで出現
   ・ラッキーモード（約10人に1人）：毎問 1/3 の確率でレア問題が出現
   確率は game.js の LUCKY_MODE_CHANCE / LUCKY_RARE_CHANCE で調整できます。
   ========================================================== */
const RARE_ITEMS = [
  { kana: "にれさとし",   romaji: ["niresatoshi"], price: 777, rare: true, photo: "assets/photos/nire.jpg" },
  { kana: "はやしだ",     romaji: ["hayashida"],   price: 777, rare: true },
  { kana: "キャンドル",   romaji: ["kyandoru"],    price: 777, rare: true },
  { kana: "タイタニック", romaji: ["taitanikku"],  price: 777, rare: true, photo: "assets/photos/titanic.jpg", weight: 3 },
  { kana: "マツケンサンバ", price: 777, rare: true },
  { kana: "ちいかわ",     price: 777, rare: true },
];

/* ==========================================================
   難関問題（全体の約1/10で出現・1,500円）
   label  : 画面に大きく出す表記
   romaji : 英字のまま打つ言葉などは手書きで指定（かなのローマ字も受付）
   確率は game.js の HARD_CHANCE で調整できます。
   photo  : （任意）出題時にイラストの代わりに表示する写真（レア問題でも使えます）
   weight : （任意）出やすさ。省略時は1。3にすると他の問題の3倍出やすくなります
   ========================================================== */
const HARD_ITEMS = [
  { label: "BeWith", kana: "ビーウィズ", romaji: ["bewith"], price: 1500, hard: true, photo: "assets/photos/bewith.jpg" },
  { label: "チュッパチャップス", kana: "ちゅっぱちゃっぷす", price: 1500, hard: true },
  { label: "東京特許許可局", kana: "とうきょうとっきょきょかきょく", price: 1500, hard: true },
  { label: "Aぇグループ", kana: "ええぐるーぷ", price: 1500, hard: true, weight: 3 },
];

/* ==========================================================
   かな → ローマ字（入力ゆれを全部許容）
   ========================================================== */
const KANA_ROMAJI = {
  "あ":["a"],"い":["i"],"う":["u","wu"],"え":["e"],"お":["o"],
  "か":["ka","ca"],"き":["ki"],"く":["ku","cu"],"け":["ke"],"こ":["ko","co"],
  "さ":["sa"],"し":["shi","si","ci"],"す":["su"],"せ":["se","ce"],"そ":["so"],
  "た":["ta"],"ち":["chi","ti"],"つ":["tsu","tu"],"て":["te"],"と":["to"],
  "な":["na"],"に":["ni"],"ぬ":["nu"],"ね":["ne"],"の":["no"],
  "は":["ha"],"ひ":["hi"],"ふ":["fu","hu"],"へ":["he"],"ほ":["ho"],
  "ま":["ma"],"み":["mi"],"む":["mu"],"め":["me"],"も":["mo"],
  "や":["ya"],"ゆ":["yu"],"よ":["yo"],
  "ら":["ra"],"り":["ri"],"る":["ru"],"れ":["re"],"ろ":["ro"],
  "わ":["wa"],"を":["wo"],
  "が":["ga"],"ぎ":["gi"],"ぐ":["gu"],"げ":["ge"],"ご":["go"],
  "ざ":["za"],"じ":["ji","zi"],"ず":["zu"],"ぜ":["ze"],"ぞ":["zo"],
  "だ":["da"],"ぢ":["di"],"づ":["du","dzu"],"で":["de"],"ど":["do"],
  "ば":["ba"],"び":["bi"],"ぶ":["bu"],"べ":["be"],"ぼ":["bo"],
  "ぱ":["pa"],"ぴ":["pi"],"ぷ":["pu"],"ぺ":["pe"],"ぽ":["po"],
  "ゔ":["vu"],
  "ぁ":["xa","la"],"ぃ":["xi","li"],"ぅ":["xu","lu"],"ぇ":["xe","le"],"ぉ":["xo","lo"],
  "ゃ":["xya","lya"],"ゅ":["xyu","lyu"],"ょ":["xyo","lyo"],
  "きゃ":["kya"],"きゅ":["kyu"],"きょ":["kyo"],
  "しゃ":["sha","sya"],"しゅ":["shu","syu"],"しょ":["sho","syo"],"しぇ":["she","sye"],
  "ちゃ":["cha","tya","cya"],"ちゅ":["chu","tyu","cyu"],"ちょ":["cho","tyo","cyo"],"ちぇ":["che","tye"],
  "にゃ":["nya"],"にゅ":["nyu"],"にょ":["nyo"],
  "ひゃ":["hya"],"ひゅ":["hyu"],"ひょ":["hyo"],
  "みゃ":["mya"],"みゅ":["myu"],"みょ":["myo"],
  "りゃ":["rya"],"りゅ":["ryu"],"りょ":["ryo"],
  "ぎゃ":["gya"],"ぎゅ":["gyu"],"ぎょ":["gyo"],
  "じゃ":["ja","zya","jya"],"じゅ":["ju","zyu","jyu"],"じょ":["jo","zyo","jyo"],"じぇ":["je","zye"],
  "びゃ":["bya"],"びゅ":["byu"],"びょ":["byo"],
  "ぴゃ":["pya"],"ぴゅ":["pyu"],"ぴょ":["pyo"],
  "ふぁ":["fa"],"ふぃ":["fi"],"ふぇ":["fe"],"ふぉ":["fo"],
  "うぃ":["wi"],"うぇ":["we"],"てぃ":["thi"],"でぃ":["dhi"],
};

function toHiragana(str) {
  return str.replace(/[\u30a1-\u30f6]/g, ch => String.fromCharCode(ch.charCodeAt(0) - 0x60));
}

function kanaUnitOptions(kana) {
  const h = toHiragana(kana).replace(/[ー\s・！!？?]/g, "");
  // 「音のかたまり」に分解（「きゃ」など2文字の組み合わせを優先）
  const units = [];
  for (let i = 0; i < h.length; ) {
    const two = h.slice(i, i + 2);
    if (two.length === 2 && KANA_ROMAJI[two]) { units.push(two); i += 2; continue; }
    units.push(h[i]); i += 1;
  }
  return units.map((u, idx) => {
    const next = units[idx + 1];
    const nextOpts = next ? (KANA_ROMAJI[next] || [next]) : [];
    if (u === "っ") {
      const doubled = [...new Set(nextOpts.filter(r => /^[bcdfghjklmpqrstvwxyz]/.test(r)).map(r => r[0]))];
      return [...doubled, "xtu", "ltu", "xtsu", "ltsu"];
    }
    if (u === "ん") {
      if (!next) return ["nn", "n", "xn"];
      // 母音・や行の前は「nn」必須。な行の前は子ども向けに「n」1つでもOK
      const needsNN = nextOpts.some(r => /^[aiueoy]/.test(r));
      const mOK = nextOpts.some(r => /^[mbp]/.test(r)) ? ["m"] : [];
      return needsNN ? ["nn", "xn"] : ["n", "nn", "xn", ...mOK];
    }
    if (u.length === 2) { // 「き＋ゃ」の分割入力も許可
      const split = (KANA_ROMAJI[u[0]] || []).flatMap(a => (KANA_ROMAJI[u[1]] || []).map(b => a + b));
      return [...KANA_ROMAJI[u], ...split];
    }
    return KANA_ROMAJI[u] || [u];
  });
}

/* 入力途中の文字列 typed が、その問題の正しい打ち方の「途中」か「完成」かを判定 */
function matchTyping(item, typed) {
  if (!item._opts) {
    item._opts = kanaUnitOptions(item.kana);
    item._manual = (item.romaji || []).map(r => r.toLowerCase().replace(/[^a-z]/g, ""));
  }
  const opts = item._opts, n = opts.length, L = typed.length;
  let prefix = item._manual.some(r => r.startsWith(typed));
  let complete = item._manual.includes(typed);
  const memo = new Map();
  const walk = (i, p) => {
    const key = i * 1000 + p;
    if (memo.has(key)) return;
    memo.set(key, true);
    if (p === L) {
      prefix = true;
      if (i === n) complete = true;
      return;
    }
    if (i === n) return;
    for (const o of opts[i]) {
      const rest = typed.slice(p, p + o.length);
      if (p + o.length > L) {
        if (o.startsWith(typed.slice(p))) prefix = true;
      } else if (rest === o) {
        walk(i + 1, p + o.length);
      }
    }
  };
  walk(0, 0);
  return { prefix, complete };
}

/* 表示用：いちばん標準的なローマ字 */
function defaultRomaji(item) {
  if (item.romaji && item.romaji[0]) return item.romaji[0].replace(/[^a-z]/gi, "").toLowerCase();
  return kanaUnitOptions(item.kana).map(o => o[0]).join("");
}

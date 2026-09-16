/* ==========================================================
   寿司ネタ単語データ（寿司の都・北九州／関門海峡テーマ）
   kana   : 画面に表示する見出し（かな/カナ）
   romaji : 正解として受け付けるローマ字（複数表記OK）
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
   出現確率は RARE_ITEM_CHANCE（game.js）で調整できます。
   ========================================================== */
const RARE_ITEMS = [
  { kana: "にれさとし",   romaji: ["niresatoshi"], price: 777, rare: true },
  { kana: "はやしだ",     romaji: ["hayashida"],   price: 777, rare: true },
  { kana: "キャンドル",   romaji: ["kyandoru"],    price: 777, rare: true },
  { kana: "ビーウィズ",   romaji: ["biuizu", "biiuizu", "bi-uizu"], price: 777, rare: true },
  { kana: "タイタニック", romaji: ["taitanikku"],  price: 777, rare: true },
];

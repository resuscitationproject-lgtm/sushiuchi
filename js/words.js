/* ==========================================================
   寿司ネタ単語データ
   kana   : 画面に表示する見出し（かな/カナ）
   romaji : 正解として受け付けるローマ字（複数表記OK）
            入力比較時は英字以外（ハイフン等）を除去して比較するため
            "sa-mon" のような表記も自動的に "samon" と同一視されます
   price  : 正解した時に加算される「円」
   ========================================================== */

const SUSHI_ITEMS = [
  { kana: "たまご",       romaji: ["tamago"],                 price: 100 },
  { kana: "きゅうり",     romaji: ["kyuuri", "kyuri"],         price: 90 },
  { kana: "サーモン",     romaji: ["samon", "sa-mon"],         price: 120 },
  { kana: "まぐろ",       romaji: ["maguro"],                  price: 150 },
  { kana: "えび",         romaji: ["ebi"],                     price: 130 },
  { kana: "いか",         romaji: ["ika"],                     price: 110 },
  { kana: "たこ",         romaji: ["tako"],                    price: 140 },
  { kana: "はまち",       romaji: ["hamachi"],                 price: 160 },
  { kana: "あじ",         romaji: ["aji"],                     price: 150 },
  { kana: "ぶり",         romaji: ["buri"],                    price: 180 },
  { kana: "たい",         romaji: ["tai"],                     price: 190 },
  { kana: "すずき",       romaji: ["suzuki"],                  price: 170 },
  { kana: "しめさば",     romaji: ["shimesaba", "simesaba"],   price: 160 },
  { kana: "かっぱまき",   romaji: ["kappamaki"],               price: 100 },
  { kana: "コーンマヨ",   romaji: ["konmayo"],                 price: 100 },
  { kana: "ほたて",       romaji: ["hotate"],                  price: 220 },
  { kana: "あなご",       romaji: ["anago"],                   price: 200 },
  { kana: "つぶがい",     romaji: ["tsubugai", "tubugai"],     price: 250 },
  { kana: "かんぱち",     romaji: ["kanpachi", "kampachi"],    price: 280 },
  { kana: "かにみそ",     romaji: ["kanimiso"],                price: 300 },
  { kana: "いくら",       romaji: ["ikura"],                   price: 380 },
  { kana: "ちゅうとろ",   romaji: ["chuutoro", "chutoro"],     price: 400 },
  { kana: "うに",         romaji: ["uni"],                     price: 500 },
  { kana: "おおとろ",     romaji: ["ootoro", "ohtoro"],        price: 600 },
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

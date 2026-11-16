/**
 * stickers.js
 * v3.4.0 Famous Anime & Cartoon Parody Vector Stickers with Expressive Emotions & Actions
 * 100% Autonomous, Offline-capable Inline SVG Assets
 */

const STICKER_PACKS = {
  pokemon_friends: {
    id: "pokemon_friends",
    name: "⚡ 포켓몬 친구들",
    stickers: [
      {
        id: "pika_happy",
        name: "기분 최고!",
        text: "기분 최고야! ⚡",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <!-- Ears -->
          <polygon points="35,45 15,10 40,25" fill="#facc15" stroke="#ca8a04" stroke-width="2.5"/>
          <polygon points="15,10 24,18 20,25" fill="#1e293b"/>
          <polygon points="85,45 105,10 80,25" fill="#facc15" stroke="#ca8a04" stroke-width="2.5"/>
          <polygon points="105,10 96,18 100,25" fill="#1e293b"/>
          <!-- Head -->
          <circle cx="60" cy="65" r="40" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
          <!-- Red Cheeks (Electric pouches) -->
          <circle cx="34" cy="74" r="9" fill="#ef4444"/>
          <circle cx="86" cy="74" r="9" fill="#ef4444"/>
          <!-- Sparkly Happy Eyes -->
          <ellipse cx="44" cy="60" rx="5" ry="7" fill="#1e293b"/>
          <circle cx="42" cy="57" r="2.2" fill="#ffffff"/>
          <ellipse cx="76" cy="60" rx="5" ry="7" fill="#1e293b"/>
          <circle cx="74" cy="57" r="2.2" fill="#ffffff"/>
          <!-- Cute Nose -->
          <polygon points="60,67 58,70 62,70" fill="#1e293b"/>
          <!-- Open Laughing Mouth -->
          <path d="M 52 74 Q 60 84 68 74 Z" fill="#b91c1c"/>
          <path d="M 55 77 Q 60 74 65 77" fill="#f472b6"/>
          <!-- Lightning sparks -->
          <path d="M 10 70 L 22 75 L 16 82 L 26 86" stroke="#eab308" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M 110 70 L 98 75 L 104 82 L 94 86" stroke="#eab308" stroke-width="3" fill="none" stroke-linecap="round"/>
        </svg>`
      },
      {
        id: "pika_shock",
        name: "대박 충격!",
        text: "헉! 대박 충격! ⚡",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <polygon points="35,45 10,20 30,30" fill="#facc15" stroke="#ca8a04" stroke-width="2.5"/>
          <polygon points="10,20 18,25 15,30" fill="#1e293b"/>
          <polygon points="85,45 110,20 90,30" fill="#facc15" stroke="#ca8a04" stroke-width="2.5"/>
          <polygon points="110,20 102,25 105,30" fill="#1e293b"/>
          <circle cx="60" cy="65" r="40" fill="#fde047" stroke="#ca8a04" stroke-width="3"/>
          <circle cx="34" cy="74" r="9" fill="#ef4444"/>
          <circle cx="86" cy="74" r="9" fill="#ef4444"/>
          <!-- Shocked Wide White Eyes with tiny pupils -->
          <circle cx="44" cy="58" r="8" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
          <circle cx="44" cy="58" r="2.5" fill="#1e293b"/>
          <circle cx="76" cy="58" r="8" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
          <circle cx="76" cy="58" r="2.5" fill="#1e293b"/>
          <!-- Wavy mouth -->
          <ellipse cx="60" cy="78" rx="8" ry="12" fill="#1e293b"/>
          <!-- Blue shock lines on forehead -->
          <path d="M 50 36 L 50 48 M 60 34 L 60 48 M 70 36 L 70 48" stroke="#3b82f6" stroke-width="2.5" stroke-linecap="round"/>
        </svg>`
      },
      {
        id: "squirtle_sunglasses",
        name: "폼나게 멋짐",
        text: "멋짐 폭발! 😎",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <!-- Turtle Head -->
          <circle cx="60" cy="62" r="38" fill="#7dd3fc" stroke="#0284c7" stroke-width="3"/>
          <circle cx="38" cy="76" r="6" fill="#38bdf8" opacity="0.6"/>
          <circle cx="82" cy="76" r="6" fill="#38bdf8" opacity="0.6"/>
          <!-- Pointy Cool Sunglasses -->
          <polygon points="18,48 54,48 48,68 28,68" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
          <polygon points="66,48 102,48 92,68 72,68" fill="#1e293b" stroke="#0f172a" stroke-width="2"/>
          <line x1="52" y1="52" x2="68" y2="52" stroke="#1e293b" stroke-width="3"/>
          <!-- Sunglasses White Glare -->
          <polygon points="24,52 38,52 28,64 20,64" fill="#ffffff" opacity="0.6"/>
          <polygon points="72,52 86,52 76,64 68,64" fill="#ffffff" opacity="0.6"/>
          <!-- Smirk Grin -->
          <path d="M 50 78 Q 66 84 74 76" stroke="#0369a1" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <!-- Sparkle -->
          <path d="M 100 35 L 104 25 L 108 35 L 118 39 L 108 43 L 104 53 L 100 43 L 90 39 Z" fill="#facc15"/>
        </svg>`
      },
      {
        id: "psyduck_headache",
        name: "멘붕이야",
        text: "머리 쥐난다 으악! 🌀",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <!-- Duck Head -->
          <circle cx="60" cy="62" r="36" fill="#fef08a" stroke="#ca8a04" stroke-width="3"/>
          <!-- 3 Hairs -->
          <path d="M 60 26 L 60 12 M 56 26 L 50 14 M 64 26 L 70 14" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
          <!-- Huge Bill -->
          <ellipse cx="60" cy="74" rx="22" ry="12" fill="#fed7aa" stroke="#ea580c" stroke-width="2.5"/>
          <circle cx="56" cy="70" r="1.5" fill="#9a3412"/>
          <circle cx="64" cy="70" r="1.5" fill="#9a3412"/>
          <!-- Dazed Round Eyes -->
          <circle cx="44" cy="54" r="8" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
          <circle cx="44" cy="54" r="2" fill="#1e293b"/>
          <circle cx="76" cy="54" r="8" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
          <circle cx="76" cy="54" r="2" fill="#1e293b"/>
          <!-- Hands on Head -->
          <ellipse cx="26" cy="55" rx="9" ry="14" fill="#fef08a" stroke="#ca8a04" stroke-width="2.5" transform="rotate(-30 26 55)"/>
          <ellipse cx="94" cy="55" rx="9" ry="14" fill="#fef08a" stroke="#ca8a04" stroke-width="2.5" transform="rotate(30 94 55)"/>
          <!-- Headache Swirls -->
          <path d="M 22 28 Q 28 20 34 28 Q 28 36 22 28" stroke="#a855f7" stroke-width="2.5" fill="none"/>
          <path d="M 86 28 Q 92 20 98 28 Q 92 36 86 28" stroke="#a855f7" stroke-width="2.5" fill="none"/>
        </svg>`
      },
      {
        id: "charmander_fire",
        name: "불꽃 열정",
        text: "불타오른다 파이팅! 🔥",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="62" r="38" fill="#fb923c" stroke="#c2410c" stroke-width="3"/>
          <ellipse cx="60" cy="80" rx="20" ry="14" fill="#fef08a"/>
          <!-- Determined Blue Eyes -->
          <ellipse cx="44" cy="56" rx="6" ry="8" fill="#0284c7"/>
          <circle cx="42" cy="53" r="2.2" fill="#ffffff"/>
          <ellipse cx="76" cy="56" rx="6" ry="8" fill="#0284c7"/>
          <circle cx="74" cy="53" r="2.2" fill="#ffffff"/>
          <!-- Cute Fangs -->
          <path d="M 50 68 Q 60 76 70 68" stroke="#7c2d12" stroke-width="3" fill="none" stroke-linecap="round"/>
          <polygon points="53,68 56,73 58,68" fill="#ffffff"/>
          <polygon points="62,68 64,73 67,68" fill="#ffffff"/>
          <!-- Tail Flame on side -->
          <path d="M 98 55 C 115 40 115 15 95 25 C 95 10 80 20 85 45 Z" fill="#ef4444"/>
          <path d="M 96 48 C 105 38 105 25 93 30 C 93 20 84 28 88 42 Z" fill="#facc15"/>
        </svg>`
      },
      {
        id: "snorlax_sleep",
        name: "꿀잠 쿨쿨",
        text: "수고했어 쿨쿨~ 💤",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <!-- Ears -->
          <polygon points="35,45 25,18 45,30" fill="#0e7490"/>
          <polygon points="85,45 95,18 75,30" fill="#0e7490"/>
          <!-- Big Blue Head -->
          <circle cx="60" cy="65" r="42" fill="#0891b2" stroke="#155e75" stroke-width="3"/>
          <!-- Cream Face Mask -->
          <ellipse cx="60" cy="68" rx="28" ry="24" fill="#fef3c7"/>
          <!-- Sleeping Slits Eyes -->
          <line x1="40" y1="62" x2="52" y2="64" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
          <line x1="80" y1="62" x2="68" y2="64" stroke="#1e293b" stroke-width="3.5" stroke-linecap="round"/>
          <!-- Fangs pointing up -->
          <polygon points="48,74 51,68 54,74" fill="#ffffff"/>
          <polygon points="66,74 69,68 72,74" fill="#ffffff"/>
          <!-- Zzz -->
          <text x="86" y="30" font-family="sans-serif" font-weight="900" font-size="16" fill="#818cf8">Z</text>
          <text x="98" y="20" font-family="sans-serif" font-weight="900" font-size="12" fill="#a5b4fc">z</text>
        </svg>`
      }
    ]
  },
  shinchan_friends: {
    id: "shinchan_friends",
    name: "🖍️ 짱구와 친구들",
    stickers: [
      {
        id: "shin_dance",
        name: "부리부리 댄스",
        text: "부리부리 신나! 🍑",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <!-- Shinchan Cheeky Silhouette Face -->
          <ellipse cx="60" cy="60" rx="34" ry="28" fill="#fed7aa" stroke="#ea580c" stroke-width="3"/>
          <ellipse cx="38" cy="68" rx="14" ry="12" fill="#fed7aa"/>
          <!-- Thick Signature Eyebrows -->
          <ellipse cx="44" cy="46" rx="9" ry="4.5" fill="#1e293b" transform="rotate(15 44 46)"/>
          <ellipse cx="76" cy="46" rx="9" ry="4.5" fill="#1e293b" transform="rotate(-15 76 46)"/>
          <!-- Big Shiny Pupils -->
          <ellipse cx="46" cy="56" rx="5.5" ry="7" fill="#1e293b"/>
          <circle cx="44" cy="54" r="2" fill="#ffffff"/>
          <ellipse cx="74" cy="56" rx="5.5" ry="7" fill="#1e293b"/>
          <circle cx="72" cy="54" r="2" fill="#ffffff"/>
          <!-- Big Open Grin -->
          <path d="M 50 68 Q 60 80 72 68 Z" fill="#dc2626"/>
          <!-- Red Shirt Bottom -->
          <path d="M 35 88 C 35 88 45 80 60 80 C 75 80 85 88 85 88 L 90 108 L 30 108 Z" fill="#ef4444"/>
          <!-- Music notes -->
          <path d="M 18 35 L 26 30 L 26 45 M 26 30 L 34 26 L 34 40" stroke="#f43f5e" stroke-width="2.5" fill="none"/>
        </svg>`
      },
      {
        id: "shin_blush",
        name: "하트 반했어",
        text: "완전 예뻐요 좋아! 💖",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="60" cy="60" rx="34" ry="28" fill="#fed7aa" stroke="#ea580c" stroke-width="3"/>
          <!-- Thick Eyebrows drooping in love -->
          <ellipse cx="44" cy="48" rx="9" ry="4.5" fill="#1e293b" transform="rotate(-20 44 48)"/>
          <ellipse cx="76" cy="48" rx="9" ry="4.5" fill="#1e293b" transform="rotate(20 76 48)"/>
          <!-- Big Red Blushing Cheeks -->
          <ellipse cx="36" cy="66" rx="9" ry="6" fill="#f43f5e" opacity="0.75"/>
          <ellipse cx="84" cy="66" rx="9" ry="6" fill="#f43f5e" opacity="0.75"/>
          <!-- Giant Heart Eyes -->
          <path d="M 46 54 A 4 4 0 0 0 40 57 C 40 62 48 67 48 67 C 48 67 56 62 56 57 A 4 4 0 0 0 50 54 Z" fill="#e11d48"/>
          <path d="M 74 54 A 4 4 0 0 0 68 57 C 68 62 76 67 76 67 C 76 67 84 62 84 57 A 4 4 0 0 0 78 54 Z" fill="#e11d48"/>
          <!-- Wavy Lovestruck Mouth -->
          <path d="M 52 74 Q 60 70 68 74" stroke="#7c2d12" stroke-width="3" fill="none" stroke-linecap="round"/>
        </svg>`
      },
      {
        id: "shiro_cloud",
        name: "포근한 흰둥이",
        text: "포근포근 힐링~ ☁️",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <!-- White Fluffy Head -->
          <circle cx="60" cy="62" r="38" fill="#ffffff" stroke="#94a3b8" stroke-width="3"/>
          <!-- Fluffy Drooping Ears -->
          <ellipse cx="26" cy="62" rx="10" ry="18" fill="#ffffff" stroke="#94a3b8" stroke-width="2.5" transform="rotate(-15 26 62)"/>
          <ellipse cx="94" cy="62" rx="10" ry="18" fill="#ffffff" stroke="#94a3b8" stroke-width="2.5" transform="rotate(15 94 62)"/>
          <!-- Red Collar -->
          <path d="M 38 88 Q 60 98 82 88" stroke="#3b82f6" stroke-width="6" fill="none" stroke-linecap="round"/>
          <!-- Gentle Dot Eyes -->
          <ellipse cx="46" cy="56" rx="4.5" ry="6" fill="#1e293b"/>
          <ellipse cx="74" cy="56" rx="4.5" ry="6" fill="#1e293b"/>
          <!-- Black Oval Nose -->
          <ellipse cx="60" cy="66" rx="6.5" ry="4.5" fill="#1e293b"/>
          <!-- Sweet Smile -->
          <path d="M 54 74 Q 60 80 66 74" fill="none" stroke="#1e293b" stroke-width="2.5" stroke-linecap="round"/>
          <circle cx="36" cy="68" r="5" fill="#fca5a5" opacity="0.6"/>
          <circle cx="84" cy="68" r="5" fill="#fca5a5" opacity="0.6"/>
        </svg>`
      },
      {
        id: "shin_tears",
        name: "엉엉 도와줘",
        text: "액션가면 구해줘 😭",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="60" cy="60" rx="34" ry="28" fill="#fed7aa" stroke="#ea580c" stroke-width="3"/>
          <ellipse cx="44" cy="46" rx="9" ry="4.5" fill="#1e293b" transform="rotate(25 44 46)"/>
          <ellipse cx="76" cy="46" rx="9" ry="4.5" fill="#1e293b" transform="rotate(-25 76 46)"/>
          <!-- Crying Closed Eyes -->
          <path d="M 40 56 Q 46 50 52 56" stroke="#1e293b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M 68 56 Q 74 50 80 56" stroke="#1e293b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <!-- Waterfalls of Tears -->
          <path d="M 46 58 C 42 70 38 85 40 98" stroke="#38bdf8" stroke-width="5" fill="none" stroke-linecap="round"/>
          <path d="M 74 58 C 78 70 82 85 80 98" stroke="#38bdf8" stroke-width="5" fill="none" stroke-linecap="round"/>
          <!-- Wide Open Wailing Mouth -->
          <ellipse cx="60" cy="74" rx="14" ry="10" fill="#b91c1c"/>
          <path d="M 50 78 Q 60 74 70 78" stroke="#ffffff" stroke-width="2" fill="none"/>
        </svg>`
      }
    ]
  },
  healing_friends: {
    id: "healing_friends",
    name: "🦦 보노보노와 명작 친구들",
    stickers: [
      {
        id: "bono_sweat",
        name: "땀 삐질",
        text: "나 때릴 거야...? 💦",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <!-- Blue Otter Head -->
          <circle cx="60" cy="62" r="38" fill="#60a5fa" stroke="#2563eb" stroke-width="3"/>
          <!-- Tiny Ears -->
          <circle cx="28" cy="40" r="7" fill="#60a5fa" stroke="#2563eb" stroke-width="2"/>
          <circle cx="92" cy="40" r="7" fill="#60a5fa" stroke="#2563eb" stroke-width="2"/>
          <!-- White Whiskers Pad -->
          <ellipse cx="50" cy="66" rx="12" ry="10" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
          <ellipse cx="70" cy="66" rx="12" ry="10" fill="#ffffff" stroke="#94a3b8" stroke-width="2"/>
          <circle cx="60" cy="62" r="4.5" fill="#1e293b"/>
          <!-- Tiny Dot Eyes spaced far apart -->
          <circle cx="34" cy="56" r="3.5" fill="#1e293b"/>
          <circle cx="86" cy="56" r="3.5" fill="#1e293b"/>
          <!-- Pink Shell in hand -->
          <ellipse cx="60" cy="94" rx="16" ry="12" fill="#f472b6" stroke="#db2777" stroke-width="2.5"/>
          <line x1="60" y1="84" x2="60" y2="104" stroke="#db2777" stroke-width="1.5"/>
          <!-- Giant Sweat Drop -->
          <path d="M 88 32 C 88 32 98 42 98 48 A 6 6 0 0 1 86 48 C 86 42 88 32 88 32 Z" fill="#38bdf8"/>
        </svg>`
      },
      {
        id: "porori_acorn",
        name: "도토리 응원",
        text: "도토리 줄게 힘내! 🌰",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <!-- Pink Chipmunk Head -->
          <circle cx="60" cy="62" r="38" fill="#f472b6" stroke="#db2777" stroke-width="3"/>
          <circle cx="28" cy="38" r="8" fill="#f472b6" stroke="#db2777" stroke-width="2"/>
          <circle cx="92" cy="38" r="8" fill="#f472b6" stroke="#db2777" stroke-width="2"/>
          <!-- Round Eyes with Lashes -->
          <circle cx="44" cy="56" r="5" fill="#1e293b"/>
          <circle cx="42" cy="54" r="1.8" fill="#ffffff"/>
          <circle cx="76" cy="56" r="5" fill="#1e293b"/>
          <circle cx="74" cy="54" r="1.8" fill="#ffffff"/>
          <!-- White Cheeks -->
          <circle cx="52" cy="68" r="9" fill="#ffffff"/>
          <circle cx="68" cy="68" r="9" fill="#ffffff"/>
          <polygon points="60,65 57,68 63,68" fill="#1e293b"/>
          <!-- Acorn -->
          <ellipse cx="60" cy="92" rx="14" ry="12" fill="#b45309" stroke="#78350f" stroke-width="2"/>
          <path d="M 46 86 Q 60 78 74 86 Z" fill="#92400e"/>
        </svg>`
      },
      {
        id: "anpan_punch",
        name: "용기 백배",
        text: "용기 백배 호빵 펀치! 👊",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <!-- Baked Anpan Head -->
          <circle cx="60" cy="62" r="38" fill="#fed7aa" stroke="#c2410c" stroke-width="3"/>
          <!-- Big Red Nose & Cheeks -->
          <circle cx="60" cy="62" r="12" fill="#ef4444"/>
          <ellipse cx="58" cy="58" rx="3" ry="4" fill="#ffffff" opacity="0.6"/>
          <circle cx="36" cy="66" r="11" fill="#f97316"/>
          <ellipse cx="34" cy="63" rx="2.5" ry="3.5" fill="#ffffff" opacity="0.6"/>
          <circle cx="84" cy="66" r="11" fill="#f97316"/>
          <ellipse cx="82" cy="63" rx="2.5" ry="3.5" fill="#ffffff" opacity="0.6"/>
          <!-- Smiling Eyebrows & Eyes -->
          <path d="M 40 48 Q 48 42 56 48" stroke="#7c2d12" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path d="M 64 48 Q 72 42 80 48" stroke="#7c2d12" stroke-width="3" fill="none" stroke-linecap="round"/>
          <!-- Happy Grin -->
          <path d="M 50 78 Q 60 88 70 78" stroke="#7c2d12" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <!-- Fist -->
          <circle cx="98" cy="88" r="12" fill="#fde047" stroke="#ca8a04" stroke-width="2.5"/>
          <path d="M 94 80 L 102 96 M 102 80 L 94 96" stroke="#ea580c" stroke-width="2" stroke-linecap="round"/>
        </svg>`
      }
    ]
  },
  popular_emojis: {
    id: "popular_emojis",
    name: "😀 빅 이모티콘",
    stickers: [
      { id: "emoji_sparkle_heart", name: "하트", text: "💖", char: "💖" },
      { id: "emoji_fire", name: "불꽃", text: "🔥", char: "🔥" },
      { id: "emoji_rocket", name: "로켓", text: "🚀", char: "🚀" },
      { id: "emoji_crown", name: "왕관", text: "👑", char: "👑" },
      { id: "emoji_clover", name: "클로버", text: "🍀", char: "🍀" },
      { id: "emoji_party", name: "축하", text: "🎉", char: "🎉" },
      { id: "emoji_cake", name: "케이크", text: "🍰", char: "🍰" },
      { id: "emoji_clap", name: "박수", text: "👏", char: "👏" },
      { id: "emoji_smile", name: "스마일", text: "🥰", char: "🥰" },
      { id: "emoji_laugh", name: "웃음", text: "🤣", char: "🤣" },
      { id: "emoji_thinking", name: "생각", text: "🤔", char: "🤔" },
      { id: "emoji_star", name: "스타", text: "⭐", char: "⭐" }
    ]
  }
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = { STICKER_PACKS };
}

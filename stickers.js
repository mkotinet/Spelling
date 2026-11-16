/**
 * stickers.js
 * v3.3.0 High-Resolution Vector Sticker Packs for Haru Matchum
 * 100% Autonomous, Offline-capable Inline SVG Assets
 */

const STICKER_PACKS = {
  haru_friends: {
    id: "haru_friends",
    name: "🌸 하루 프렌즈",
    stickers: [
      {
        id: "haru_hi",
        name: "반가워요!",
        text: "안녕! 반가워~ 👋",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="65" r="42" fill="#fff7ed" stroke="#f97316" stroke-width="3.5"/>
          <!-- Ears -->
          <ellipse cx="28" cy="40" rx="14" ry="24" fill="#fb923c" transform="rotate(-25 28 40)"/>
          <ellipse cx="92" cy="40" rx="14" ry="24" fill="#fb923c" transform="rotate(25 92 40)"/>
          <!-- Cheeks -->
          <circle cx="38" cy="74" r="8" fill="#fda4af" opacity="0.6"/>
          <circle cx="82" cy="74" r="8" fill="#fda4af" opacity="0.6"/>
          <!-- Eyes -->
          <ellipse cx="45" cy="62" rx="4.5" ry="6.5" fill="#1e293b"/>
          <circle cx="43" cy="59" r="1.8" fill="#ffffff"/>
          <ellipse cx="75" cy="62" rx="4.5" ry="6.5" fill="#1e293b"/>
          <circle cx="73" cy="59" r="1.8" fill="#ffffff"/>
          <!-- Nose & Smile -->
          <ellipse cx="60" cy="71" rx="5" ry="3.8" fill="#475569"/>
          <path d="M 54 75 Q 60 82 66 75" fill="none" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
          <!-- Waving Hand -->
          <ellipse cx="102" cy="52" rx="9" ry="12" fill="#fff7ed" stroke="#f97316" stroke-width="2.5" transform="rotate(35 102 52)"/>
          <!-- Sparkle -->
          <path d="M 16 20 Q 18 12 20 20 Q 28 22 20 24 Q 18 32 16 24 Q 8 22 16 20" fill="#facc15"/>
        </svg>`
      },
      {
        id: "haru_cheer",
        name: "파이팅!",
        text: "오늘도 파이팅! 🚀",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="65" r="42" fill="#eff6ff" stroke="#3b82f6" stroke-width="3.5"/>
          <ellipse cx="28" cy="40" rx="14" ry="24" fill="#60a5fa" transform="rotate(-25 28 40)"/>
          <ellipse cx="92" cy="40" rx="14" ry="24" fill="#60a5fa" transform="rotate(25 92 40)"/>
          <!-- Headband -->
          <path d="M 22 52 Q 60 42 98 52" stroke="#ef4444" stroke-width="6" fill="none" stroke-linecap="round"/>
          <circle cx="38" cy="75" r="8" fill="#fca5a5" opacity="0.6"/>
          <circle cx="82" cy="75" r="8" fill="#fca5a5" opacity="0.6"/>
          <!-- Determined Eyes -->
          <path d="M 40 60 Q 46 54 52 62" stroke="#1e293b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M 68 62 Q 74 54 80 60" stroke="#1e293b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <ellipse cx="60" cy="70" rx="5" ry="3.5" fill="#475569"/>
          <!-- Open Mouth Grin -->
          <path d="M 52 75 Q 60 86 68 75 Z" fill="#ef4444"/>
          <!-- Fist -->
          <circle cx="100" cy="78" r="11" fill="#eff6ff" stroke="#3b82f6" stroke-width="2.5"/>
          <path d="M 96 73 L 104 83 M 104 73 L 96 83" stroke="#f59e0b" stroke-width="2.5" stroke-linecap="round"/>
        </svg>`
      },
      {
        id: "haru_love",
        name: "하트 뿅뿅",
        text: "완전 좋아! ❤️",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="65" r="42" fill="#fff1f2" stroke="#f43f5e" stroke-width="3.5"/>
          <ellipse cx="28" cy="40" rx="14" ry="24" fill="#fb7185" transform="rotate(-25 28 40)"/>
          <ellipse cx="92" cy="40" rx="14" ry="24" fill="#fb7185" transform="rotate(25 92 40)"/>
          <circle cx="36" cy="75" r="9" fill="#f43f5e" opacity="0.4"/>
          <circle cx="84" cy="75" r="9" fill="#f43f5e" opacity="0.4"/>
          <!-- Heart Eyes -->
          <path d="M 42 56 A 4.5 4.5 0 0 0 35 60 C 35 66 45 72 45 72 C 45 72 55 66 55 60 A 4.5 4.5 0 0 0 42 56 Z" fill="#e11d48"/>
          <path d="M 78 56 A 4.5 4.5 0 0 0 71 60 C 71 66 81 72 81 72 C 81 72 91 66 91 60 A 4.5 4.5 0 0 0 78 56 Z" fill="#e11d48"/>
          <ellipse cx="60" cy="72" rx="4.5" ry="3.5" fill="#475569"/>
          <path d="M 55 77 Q 60 83 65 77" fill="none" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
          <!-- Floating mini hearts -->
          <path d="M 20 25 A 3 3 0 0 0 15 28 C 15 32 22 36 22 36 C 22 36 29 32 29 28 A 3 3 0 0 0 20 25 Z" fill="#f43f5e"/>
          <path d="M 100 22 A 3 3 0 0 0 95 25 C 95 29 102 33 102 33 C 102 33 109 29 109 25 A 3 3 0 0 0 100 22 Z" fill="#f43f5e"/>
        </svg>`
      },
      {
        id: "haru_study",
        name: "열공 모드",
        text: "열공 모드 가동! 📖",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="65" r="42" fill="#f5f3ff" stroke="#8b5cf6" stroke-width="3.5"/>
          <ellipse cx="28" cy="40" rx="14" ry="24" fill="#a78bfa" transform="rotate(-25 28 40)"/>
          <ellipse cx="92" cy="40" rx="14" ry="24" fill="#a78bfa" transform="rotate(25 92 40)"/>
          <!-- Big Glasses -->
          <circle cx="44" cy="62" r="13" fill="#ffffff" stroke="#6d28d9" stroke-width="3.5"/>
          <circle cx="76" cy="62" r="13" fill="#ffffff" stroke="#6d28d9" stroke-width="3.5"/>
          <line x1="57" y1="62" x2="63" y2="62" stroke="#6d28d9" stroke-width="3.5"/>
          <!-- Smart Eyes -->
          <circle cx="44" cy="62" r="4.5" fill="#1e293b"/>
          <circle cx="42" cy="60" r="1.5" fill="#ffffff"/>
          <circle cx="76" cy="62" r="4.5" fill="#1e293b"/>
          <circle cx="74" cy="60" r="1.5" fill="#ffffff"/>
          <ellipse cx="60" cy="74" rx="4.5" ry="3.5" fill="#475569"/>
          <path d="M 56 79 Q 60 83 64 79" fill="none" stroke="#475569" stroke-width="2.5" stroke-linecap="round"/>
          <!-- Pencil -->
          <rect x="94" y="60" width="8" height="26" fill="#facc15" stroke="#ca8a04" stroke-width="2" transform="rotate(30 94 60)"/>
          <polygon points="94,86 98,96 102,86" fill="#f97316"/>
        </svg>`
      },
      {
        id: "haru_clap",
        name: "축하해!",
        text: "100점 대박 축하! 👏",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="65" r="42" fill="#fefce8" stroke="#eab308" stroke-width="3.5"/>
          <ellipse cx="28" cy="40" rx="14" ry="24" fill="#fde047" transform="rotate(-25 28 40)"/>
          <ellipse cx="92" cy="40" rx="14" ry="24" fill="#fde047" transform="rotate(25 92 40)"/>
          <!-- Party Hat -->
          <polygon points="60,10 44,40 76,40" fill="#ec4899" stroke="#be185d" stroke-width="2.5"/>
          <circle cx="60" cy="8" r="5" fill="#facc15"/>
          <circle cx="36" cy="75" r="8" fill="#fde047" opacity="0.6"/>
          <circle cx="84" cy="75" r="8" fill="#fde047" opacity="0.6"/>
          <!-- Joyful Eyes -->
          <path d="M 40 60 Q 46 66 52 60" stroke="#1e293b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M 68 60 Q 74 66 80 60" stroke="#1e293b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <ellipse cx="60" cy="71" rx="4.5" ry="3.5" fill="#475569"/>
          <path d="M 53 76 Q 60 86 67 76 Z" fill="#ef4444"/>
          <!-- Confetti -->
          <rect x="20" y="24" width="6" height="6" fill="#3b82f6" transform="rotate(45 20 24)"/>
          <rect x="98" y="26" width="6" height="6" fill="#10b981" transform="rotate(30 98 26)"/>
          <rect x="18" y="80" width="6" height="6" fill="#ec4899" transform="rotate(15 18 80)"/>
        </svg>`
      },
      {
        id: "haru_cry",
        name: "엉엉",
        text: "흑흑... 다음엔 만점! 💧",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="65" r="42" fill="#f0fdf4" stroke="#22c55e" stroke-width="3.5"/>
          <ellipse cx="28" cy="48" rx="14" ry="24" fill="#86efac" transform="rotate(-40 28 48)"/>
          <ellipse cx="92" cy="48" rx="14" ry="24" fill="#86efac" transform="rotate(40 92 48)"/>
          <!-- Sad Closed Eyes -->
          <path d="M 40 62 Q 46 56 52 62" stroke="#1e293b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M 68 62 Q 74 56 80 62" stroke="#1e293b" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <!-- Tears Streams -->
          <path d="M 46 64 C 44 75 42 85 45 92" stroke="#38bdf8" stroke-width="4.5" fill="none" stroke-linecap="round"/>
          <path d="M 74 64 C 76 75 78 85 75 92" stroke="#38bdf8" stroke-width="4.5" fill="none" stroke-linecap="round"/>
          <ellipse cx="60" cy="72" rx="4.5" ry="3.5" fill="#475569"/>
          <!-- Wavy Sad Mouth -->
          <path d="M 54 82 Q 60 76 66 82" stroke="#475569" stroke-width="3" fill="none" stroke-linecap="round"/>
        </svg>`
      },
      {
        id: "haru_heart",
        name: "고마워요",
        text: "정말 고마워! 💖",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="65" r="42" fill="#fff7ed" stroke="#f97316" stroke-width="3.5"/>
          <ellipse cx="28" cy="40" rx="14" ry="24" fill="#fdba74" transform="rotate(-25 28 40)"/>
          <ellipse cx="92" cy="40" rx="14" ry="24" fill="#fdba74" transform="rotate(25 92 40)"/>
          <circle cx="36" cy="74" r="8" fill="#fda4af" opacity="0.6"/>
          <circle cx="84" cy="74" r="8" fill="#fda4af" opacity="0.6"/>
          <!-- Big Heart in Arms -->
          <path d="M 60 56 A 14 14 0 0 0 44 65 C 44 80 60 96 60 96 C 60 96 76 80 76 65 A 14 14 0 0 0 60 56 Z" fill="#ec4899" stroke="#db2777" stroke-width="2.5"/>
          <!-- Happy Peeking Face -->
          <ellipse cx="48" cy="52" rx="3.5" ry="5" fill="#1e293b"/>
          <circle cx="47" cy="50" r="1.3" fill="#ffffff"/>
          <ellipse cx="72" cy="52" rx="3.5" ry="5" fill="#1e293b"/>
          <circle cx="71" cy="50" r="1.3" fill="#ffffff"/>
          <ellipse cx="60" cy="58" rx="4" ry="3" fill="#475569"/>
        </svg>`
      },
      {
        id: "haru_sleep",
        name: "잘자요",
        text: "오늘도 수고했어~ 💤",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="65" r="42" fill="#f8fafc" stroke="#94a3b8" stroke-width="3.5"/>
          <ellipse cx="28" cy="44" rx="14" ry="24" fill="#cbd5e1" transform="rotate(-30 28 44)"/>
          <ellipse cx="92" cy="44" rx="14" ry="24" fill="#cbd5e1" transform="rotate(30 92 44)"/>
          <circle cx="38" cy="75" r="7" fill="#fca5a5" opacity="0.5"/>
          <circle cx="82" cy="75" r="7" fill="#fca5a5" opacity="0.5"/>
          <!-- Sleeping Curve Eyes -->
          <path d="M 40 64 Q 46 70 52 64" stroke="#475569" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <path d="M 68 64 Q 74 70 80 64" stroke="#475569" stroke-width="3.5" fill="none" stroke-linecap="round"/>
          <ellipse cx="60" cy="73" rx="4" ry="3" fill="#475569"/>
          <!-- Drool Bubble -->
          <circle cx="68" cy="80" r="5" fill="#7dd3fc" opacity="0.8"/>
          <!-- Zzz Floating -->
          <text x="86" y="32" font-family="sans-serif" font-weight="900" font-size="16" fill="#818cf8">Z</text>
          <text x="98" y="22" font-family="sans-serif" font-weight="900" font-size="12" fill="#a5b4fc">z</text>
        </svg>`
      }
    ]
  },
  cheer_party: {
    id: "cheer_party",
    name: "🎉 축하 & 응원",
    stickers: [
      {
        id: "cheer_trophy",
        name: "1등 트로피",
        text: "최고야! 1등 트로피! 🏆",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <ellipse cx="60" cy="35" rx="26" ry="10" fill="#fde047"/>
          <path d="M 34 35 C 34 70 50 82 60 82 C 70 82 86 70 86 35 Z" fill="#facc15" stroke="#ca8a04" stroke-width="3"/>
          <path d="M 34 42 C 16 42 16 65 38 65" fill="none" stroke="#ca8a04" stroke-width="4" stroke-linecap="round"/>
          <path d="M 86 42 C 104 42 104 65 82 65" fill="none" stroke="#ca8a04" stroke-width="4" stroke-linecap="round"/>
          <rect x="54" y="82" width="12" height="15" fill="#eab308"/>
          <rect x="36" y="97" width="48" height="15" rx="4" fill="#92400e" stroke="#78350f" stroke-width="2"/>
          <text x="60" y="62" font-family="sans-serif" font-weight="900" font-size="22" fill="#92400e" text-anchor="middle">1</text>
          <circle cx="30" cy="20" r="3" fill="#facc15"/>
          <circle cx="90" cy="20" r="3" fill="#facc15"/>
        </svg>`
      },
      {
        id: "cheer_popper",
        name: "축하 폭죽",
        text: "와아아 축하해! 🎉",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <polygon points="20,105 35,65 75,105" fill="#f43f5e" stroke="#be123c" stroke-width="2.5"/>
          <polygon points="35,65 60,90 75,105" fill="#fbbf24"/>
          <!-- Confetti Streamers -->
          <path d="M 50 55 Q 70 30 95 35 Q 110 40 100 20" stroke="#8b5cf6" stroke-width="4" fill="none" stroke-linecap="round"/>
          <path d="M 35 45 Q 40 15 70 10 Q 85 5 80 2" stroke="#06b6d4" stroke-width="4" fill="none" stroke-linecap="round"/>
          <circle cx="65" cy="40" r="5" fill="#f59e0b"/>
          <circle cx="85" cy="55" r="4.5" fill="#ec4899"/>
          <circle cx="45" cy="25" r="4" fill="#10b981"/>
          <rect x="90" y="45" width="7" height="7" fill="#eab308" transform="rotate(25 90 45)"/>
        </svg>`
      },
      {
        id: "cheer_fire",
        name: "불꽃 열정",
        text: "열정 폭발! 🔥",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <path d="M 60 12 C 75 35 95 55 95 82 A 35 35 0 0 1 25 82 C 25 60 45 45 50 30 C 50 45 60 48 60 12 Z" fill="#ef4444"/>
          <path d="M 60 38 C 70 52 82 66 82 84 A 22 22 0 0 1 38 84 C 38 68 52 58 55 48 C 55 58 60 60 60 38 Z" fill="#f97316"/>
          <path d="M 60 60 C 66 70 72 78 72 88 A 12 12 0 0 1 48 88 C 48 78 56 72 58 66 Z" fill="#fde047"/>
        </svg>`
      },
      {
        id: "cheer_star",
        name: "빛나는 별",
        text: "넌 최고의 스타! ⭐",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <polygon points="60,10 74,45 112,45 81,68 93,105 60,82 27,105 39,68 8,45 46,45" fill="#facc15" stroke="#eab308" stroke-width="3"/>
          <circle cx="50" cy="52" r="3.5" fill="#1e293b"/>
          <circle cx="70" cy="52" r="3.5" fill="#1e293b"/>
          <path d="M 53 62 Q 60 68 67 62" fill="none" stroke="#1e293b" stroke-width="3" stroke-linecap="round"/>
          <circle cx="44" cy="58" r="4" fill="#fda4af" opacity="0.6"/>
          <circle cx="76" cy="58" r="4" fill="#fda4af" opacity="0.6"/>
        </svg>`
      }
    ]
  },
  tasty_desserts: {
    id: "tasty_desserts",
    name: "🍰 달콤 디저트",
    stickers: [
      {
        id: "dessert_cake",
        name: "딸기 케이크",
        text: "달콤한 당충전 타임! 🍰",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <polygon points="60,20 18,65 102,65" fill="#fff1f2"/>
          <polygon points="18,65 102,65 102,95 18,95" fill="#fed7aa"/>
          <line x1="18" y1="75" x2="102" y2="75" stroke="#fff1f2" stroke-width="6"/>
          <line x1="18" y1="85" x2="102" y2="85" stroke="#f43f5e" stroke-width="4"/>
          <!-- Strawberry on Top -->
          <circle cx="60" cy="30" r="12" fill="#ef4444"/>
          <polygon points="60,16 54,22 66,22" fill="#22c55e"/>
          <circle cx="56" cy="30" r="1.5" fill="#fde047"/>
          <circle cx="64" cy="32" r="1.5" fill="#fde047"/>
        </svg>`
      },
      {
        id: "dessert_donut",
        name: "딸기 도넛",
        text: "달콤 도넛 한입! 🍩",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <circle cx="60" cy="60" r="45" fill="#fed7aa" stroke="#f97316" stroke-width="2.5"/>
          <!-- Icing -->
          <circle cx="60" cy="60" r="38" fill="#f472b6"/>
          <!-- Center Hole -->
          <circle cx="60" cy="60" r="16" fill="#ffffff" stroke="#f97316" stroke-width="2.5"/>
          <!-- Sprinkles -->
          <rect x="42" y="32" width="6" height="3" rx="1.5" fill="#fde047" transform="rotate(30 42 32)"/>
          <rect x="74" y="35" width="6" height="3" rx="1.5" fill="#38bdf8" transform="rotate(-20 74 35)"/>
          <rect x="78" y="72" width="6" height="3" rx="1.5" fill="#4ade80" transform="rotate(45 78 72)"/>
          <rect x="36" y="70" width="6" height="3" rx="1.5" fill="#fde047" transform="rotate(-40 36 70)"/>
        </svg>`
      },
      {
        id: "dessert_icecream",
        name: "아이스크림",
        text: "시원달콤 아이스크림! 🍦",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <!-- Cone -->
          <polygon points="60,110 38,55 82,55" fill="#fed7aa" stroke="#ea580c" stroke-width="2.5"/>
          <line x1="44" y1="70" x2="72" y2="85" stroke="#ea580c" stroke-width="1.5"/>
          <line x1="76" y1="70" x2="48" y2="85" stroke="#ea580c" stroke-width="1.5"/>
          <!-- Icecream Swirl -->
          <circle cx="60" cy="50" r="24" fill="#bae6fd"/>
          <circle cx="60" cy="35" r="18" fill="#fbcfe8"/>
          <circle cx="60" cy="22" r="12" fill="#fef08a"/>
          <circle cx="60" cy="14" r="6" fill="#ef4444"/>
        </svg>`
      },
      {
        id: "dessert_boba",
        name: "버블티",
        text: "달콤 쫀득 버블티! 🧋",
        svg: `<svg viewBox="0 0 120 120" width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <!-- Straw -->
          <rect x="68" y="8" width="8" height="40" fill="#a855f7" transform="rotate(15 68 8)"/>
          <!-- Cup -->
          <polygon points="36,40 44,106 76,106 84,40" fill="#fff7ed" stroke="#78350f" stroke-width="3"/>
          <polygon points="38,50 44,104 76,104 82,50" fill="#fed7aa"/>
          <!-- Pearls -->
          <circle cx="52" cy="94" r="4.5" fill="#451a03"/>
          <circle cx="64" cy="96" r="4.5" fill="#451a03"/>
          <circle cx="58" cy="85" r="4.5" fill="#451a03"/>
          <circle cx="70" cy="86" r="4.5" fill="#451a03"/>
          <circle cx="48" cy="80" r="4.5" fill="#451a03"/>
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

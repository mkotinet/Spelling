const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME_BIN = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';

const OUT_DIR_ELEM = path.resolve(__dirname, '../public/stickers/elementary');
const OUT_DIR_MID = path.resolve(__dirname, '../public/stickers/middle');
const OUT_DIR_HIGH = path.resolve(__dirname, '../public/stickers/high');

const WWW_DIR_ELEM = path.resolve(__dirname, '../www/public/stickers/elementary');
const WWW_DIR_MID = path.resolve(__dirname, '../www/public/stickers/middle');
const WWW_DIR_HIGH = path.resolve(__dirname, '../www/public/stickers/high');

[OUT_DIR_ELEM, OUT_DIR_MID, OUT_DIR_HIGH, WWW_DIR_ELEM, WWW_DIR_MID, WWW_DIR_HIGH].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const BASE_TEST_PHOTOS = '/Users/kotinet/Documents/테스트사진';
const BRAIN_PHOTOS = '/Users/kotinet/.gemini/antigravity/brain/ac18336d-2471-4bbb-977a-339e0d205c66/.user_uploaded';

// --- ELEMENTARY GIRL (말랑콩떡 순수 애교 30종) ---
const ELEMENTARY_STICKERS = [
  {
    id: "elem_01",
    name: "안뇽! 나 왔어용",
    mainText: "안뇽! 나 왔어용 ♡",
    badge: "말랑콩떡 등장 🎒",
    src: `${BASE_TEST_PHOTOS}/1_짱구스타일/photo_01_짱구.jpg`,
    zoom: 1.25, posX: "50%", posY: "40%", bubblePos: "bottom",
    icons: ["✨", "🎒"],
    borderColor: "#ff9ebb", badgeColor: "#ff5c8a"
  },
  {
    id: "elem_02",
    name: "웅웅! 알겠습니당",
    mainText: "웅웅! 알겠습니당 🌸",
    badge: "착한 어린이 모드 👧",
    src: `${BASE_TEST_PHOTOS}/2_이웃집토토로스타일/photo_02_토토로.jpg`,
    zoom: 1.2, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["💖", "✨"],
    borderColor: "#ff9ebb", badgeColor: "#ff5c8a"
  },
  {
    id: "elem_03",
    name: "헤헤 신난다앙~",
    mainText: "헤헤 신난다앙~ 🎈",
    badge: "기분 최고조 쪼꼬미",
    src: `${BASE_TEST_PHOTOS}/1_짱구스타일/photo_02_짱구.jpg`,
    zoom: 1.35, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["⭐", "💖"],
    borderColor: "#ff9ebb", badgeColor: "#ff5c8a"
  },
  {
    id: "elem_04",
    name: "우와앙 대박!!",
    mainText: "우와앙 대박!! ✨",
    badge: "동공 반짝반짝 🤩",
    src: `${BASE_TEST_PHOTOS}/1_짱구스타일/photo_06_짱구.jpg`,
    zoom: 1.25, posX: "50%", posY: "38%", bubblePos: "bottom",
    icons: ["✨", "🎉"],
    borderColor: "#ff9ebb", badgeColor: "#ff5c8a"
  },
  {
    id: "elem_05",
    name: "꼬르륵... 배고파요",
    mainText: "꼬르륵... 배고파요 🍽️",
    badge: "배에서 꼬르륵 소리가!",
    src: `${BASE_TEST_PHOTOS}/1_짱구스타일/photo_05_짱구.jpg`,
    zoom: 1.3, posX: "50%", posY: "45%", bubblePos: "top",
    icons: ["🍙", "💧"],
    borderColor: "#f59e0b", badgeColor: "#d97706"
  },
  {
    id: "elem_06",
    name: "간식 주세용 (아~)",
    mainText: "간식 주세용 (아~) 🍟",
    badge: "입 벌리고 대기 중 😋",
    src: `${BASE_TEST_PHOTOS}/1_짱구스타일/photo_04_짱구.jpg`,
    zoom: 1.35, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["🍭", "✨"],
    borderColor: "#f59e0b", badgeColor: "#d97706"
  },
  {
    id: "elem_07",
    name: "고마워요 하트 뿅뿅!",
    mainText: "고마워요 하트 뿅뿅! ♡",
    badge: "사랑이 퐁퐁 💖",
    src: `${BASE_TEST_PHOTOS}/2_이웃집토토로스타일/photo_07_토토로.jpg`,
    zoom: 1.25, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["💖", "♡"],
    borderColor: "#ff9ebb", badgeColor: "#ff5c8a"
  },
  {
    id: "elem_08",
    name: "미안해용 봐주세용 힝",
    mainText: "미안해용 봐주세용 힝 🥺",
    badge: "한 번만 봐주세용 힝구",
    src: `${BASE_TEST_PHOTOS}/1_짱구스타일/photo_08_짱구.jpg`,
    zoom: 1.35, posX: "50%", posY: "38%", bubblePos: "top",
    icons: ["💧", "🌧️"],
    borderColor: "#94a3b8", badgeColor: "#64748b"
  },
  {
    id: "elem_09",
    name: "나랑 놀자아 심심해",
    mainText: "나랑 놀자아 심심해 🧸",
    badge: "심심함 1000% 발동",
    src: `${BASE_TEST_PHOTOS}/2_이웃집토토로스타일/photo_03_토토로.jpg`,
    zoom: 1.25, posX: "50%", posY: "40%", bubblePos: "bottom",
    icons: ["❓", "✨"],
    borderColor: "#ff9ebb", badgeColor: "#ff5c8a"
  },
  {
    id: "elem_10",
    name: "오늘도 화이팅! 아자뵤!",
    mainText: "오늘도 화이팅! 아자뵤! 💪",
    badge: "힘내라 얍! 아자아자",
    src: `${BASE_TEST_PHOTOS}/1_짱구스타일/photo_10_짱구.jpg`,
    zoom: 1.25, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["🔥", "✨"],
    borderColor: "#fb7185", badgeColor: "#e11d48"
  },
  {
    id: "elem_11",
    name: "잠시만 기둘려주세용",
    mainText: "잠시만 기둘려주세용 ⏳",
    badge: "1초만 기다려줘용 퐁당",
    src: `${BASE_TEST_PHOTOS}/2_이웃집토토로스타일/photo_01_토토로.jpg`,
    zoom: 1.2, posX: "50%", posY: "40%", bubblePos: "bottom",
    icons: ["🕒", "✨"],
    borderColor: "#ff9ebb", badgeColor: "#ff5c8a"
  },
  {
    id: "elem_12",
    name: "호다닥 달려가는 중!",
    mainText: "호다닥 달려가는 중! 🏃‍♀️",
    badge: "바람보다 빠르게 슝슝",
    src: `${BASE_TEST_PHOTOS}/2_이웃집토토로스타일/photo_09_토토로.jpg`,
    zoom: 1.25, posX: "50%", posY: "40%", bubblePos: "bottom",
    icons: ["💨", "✨"],
    borderColor: "#38bdf8", badgeColor: "#0284c7"
  },
  {
    id: "elem_13",
    name: "칭찬해 줘! 쓰담쓰담",
    mainText: "칭찬해 줘! 쓰담쓰담 👑",
    badge: "머리 쓰담쓰담 원츄 💖",
    src: `${BASE_TEST_PHOTOS}/2_이웃집토토로스타일/photo_02_토토로.jpg`,
    zoom: 1.3, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["💮", "✨"],
    borderColor: "#ff9ebb", badgeColor: "#ff5c8a"
  },
  {
    id: "elem_14",
    name: "힝구... 속상해쪄",
    mainText: "힝구... 속상해쪄 💧",
    badge: "시무룩 토라짐 모드",
    src: `${BASE_TEST_PHOTOS}/2_이웃집토토로스타일/photo_08_토토로.jpg`,
    zoom: 1.3, posX: "50%", posY: "40%", bubblePos: "top",
    icons: ["💧", "🥺"],
    borderColor: "#818cf8", badgeColor: "#4f46e5"
  },
  {
    id: "elem_15",
    name: "삐졌어! 흥칫뿡!",
    mainText: "삐졌어! 흥칫뿡! 😤",
    badge: "뒤돌아서 흥칫뿡!",
    src: `${BASE_TEST_PHOTOS}/1_짱구스타일/photo_08_짱구.jpg`,
    zoom: 1.4, posX: "50%", posY: "38%", bubblePos: "top",
    icons: ["💢", "😤"],
    borderColor: "#fb7185", badgeColor: "#e11d48"
  },
  {
    id: "elem_16",
    name: "눈물 똑똑... ㅠㅠ",
    mainText: "눈물 똑똑... ㅠㅠ 😭",
    badge: "눈물 퐁퐁 핑 도는 중",
    src: `${BASE_TEST_PHOTOS}/2_이웃집토토로스타일/photo_08_토토로.jpg`,
    zoom: 1.35, posX: "50%", posY: "35%", bubblePos: "top",
    icons: ["💧", "😭"],
    borderColor: "#60a5fa", badgeColor: "#2563eb"
  },
  {
    id: "elem_17",
    name: "깜짝이야! 심쿵해쪄",
    mainText: "깜짝이야! 심쿵해쪄 💓",
    badge: "심장이 콩닥콩닥 😲",
    src: `${BASE_TEST_PHOTOS}/2_이웃집토토로스타일/photo_06_토토로.jpg`,
    zoom: 1.3, posX: "50%", posY: "38%", bubblePos: "bottom",
    icons: ["💓", "✨"],
    borderColor: "#ff9ebb", badgeColor: "#ff5c8a"
  },
  {
    id: "elem_18",
    name: "몰라몰라 부끄러웡",
    mainText: "몰라몰라 부끄러웡 🙈",
    badge: "얼굴 빨개졌어용 //",
    src: `${BASE_TEST_PHOTOS}/1_짱구스타일/photo_07_짱구.jpg`,
    zoom: 1.35, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["💖", "🌸"],
    borderColor: "#ff9ebb", badgeColor: "#ff5c8a"
  },
  {
    id: "elem_19",
    name: "최고최고! 엄지 척!",
    mainText: "최고최고! 엄지 척! 👍",
    badge: "진짜 네가 제일 짱이야",
    src: `${BASE_TEST_PHOTOS}/1_짱구스타일/photo_10_짱구.jpg`,
    zoom: 1.25, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["👍", "⭐"],
    borderColor: "#fbbf24", badgeColor: "#d97706"
  },
  {
    id: "elem_20",
    name: "약속! 도장 꾸욱~",
    mainText: "약속! 도장 꾸욱~ 🤙",
    badge: "손가락 걸고 꼭꼭 약속",
    src: `${BASE_TEST_PHOTOS}/2_이웃집토토로스타일/photo_04_토토로.jpg`,
    zoom: 1.2, posX: "50%", posY: "40%", bubblePos: "bottom",
    icons: ["💮", "✨"],
    borderColor: "#ff9ebb", badgeColor: "#ff5c8a"
  },
  {
    id: "elem_21",
    name: "쿨쿨... 졸려요",
    mainText: "쿨쿨... 졸려요 💤",
    badge: "눈꺼풀이 천근만근",
    src: `${BRAIN_PHOTOS}/media_1794829448548_987be3d5.jpg`,
    zoom: 1.15, posX: "55%", posY: "45%", bubblePos: "top",
    icons: ["💤", "🌙"],
    borderColor: "#a5b4fc", badgeColor: "#6366f1"
  },
  {
    id: "elem_22",
    name: "이불 밖은 위험해!",
    mainText: "이불 밖은 위험해! 🍊",
    badge: "포근포근 이불 콕 귤까기",
    src: `${BRAIN_PHOTOS}/media_1794829448548_987be3d5.jpg`,
    zoom: 1.25, posX: "70%", posY: "40%", bubblePos: "bottom",
    icons: ["🍊", "❄️"],
    borderColor: "#f59e0b", badgeColor: "#d97706"
  },
  {
    id: "elem_23",
    name: "냠냠쩝쩝 마시쪙!",
    mainText: "냠냠쩝쩝 마시쪙! 🍦",
    badge: "볼 빵빵 꿀맛 간식 타임",
    src: `${BASE_TEST_PHOTOS}/1_짱구스타일/photo_07_짱구.jpg`,
    zoom: 1.35, posX: "50%", posY: "40%", bubblePos: "bottom",
    icons: ["🍦", "✨"],
    borderColor: "#fb7185", badgeColor: "#e11d48"
  },
  {
    id: "elem_24",
    name: "에구구 힘들다아",
    mainText: "에구구 힘들다아 🪫",
    badge: "에너지 방전 0% 끄응",
    src: `${BASE_TEST_PHOTOS}/1_짱구스타일/photo_01_짱구.jpg`,
    zoom: 1.2, posX: "50%", posY: "40%", bubblePos: "bottom",
    icons: ["💧", "🪫"],
    borderColor: "#94a3b8", badgeColor: "#64748b"
  },
  {
    id: "elem_25",
    name: "어쩌지? 발 동동",
    mainText: "어쩌지? 발 동동 👣",
    badge: "어떡하지 안절부절",
    src: `${BASE_TEST_PHOTOS}/1_짱구스타일/photo_03_짱구.jpg`,
    zoom: 1.25, posX: "50%", posY: "35%", bubblePos: "top",
    icons: ["❓", "💦"],
    borderColor: "#fb923c", badgeColor: "#c2410c"
  },
  {
    id: "elem_26",
    name: "궁금해! 알려줘잉",
    mainText: "궁금해! 알려줘잉 ❓",
    badge: "귀 쫑긋 눈 반짝반짝",
    src: `${BASE_TEST_PHOTOS}/2_이웃집토토로스타일/photo_01_토토로.jpg`,
    zoom: 1.25, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["❓", "✨"],
    borderColor: "#ff9ebb", badgeColor: "#ff5c8a"
  },
  {
    id: "elem_27",
    name: "내가 도와줄게용!",
    mainText: "내가 도와줄게용! 🦸‍♀️",
    badge: "척척박사 출동 완료",
    src: `${BASE_TEST_PHOTOS}/2_이웃집토토로스타일/photo_05_토토로.jpg`,
    zoom: 1.2, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["⭐", "💪"],
    borderColor: "#38bdf8", badgeColor: "#0284c7"
  },
  {
    id: "elem_28",
    name: "오늘 기분 째진다~!",
    mainText: "오늘 기분 째진다~! 🌈",
    badge: "하늘 위로 둥둥 날아가",
    src: `${BASE_TEST_PHOTOS}/1_짱구스타일/photo_06_짱구.jpg`,
    zoom: 1.3, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["🌈", "✨"],
    borderColor: "#ff9ebb", badgeColor: "#ff5c8a"
  },
  {
    id: "elem_29",
    name: "내일 또 만나용 안뇽!",
    mainText: "내일 또 만나용 안뇽! 👋",
    badge: "손 흔들흔들 빠빠이",
    src: `${BASE_TEST_PHOTOS}/1_짱구스타일/photo_09_짱구.jpg`,
    zoom: 1.25, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["👋", "💖"],
    borderColor: "#ff9ebb", badgeColor: "#ff5c8a"
  },
  {
    id: "elem_30",
    name: "코오~ 잘 자요 굿나잇!",
    mainText: "코오~ 잘 자요 굿나잇! 🌙",
    badge: "예쁜 꿈 꾸세용 퐁당",
    src: `${BASE_TEST_PHOTOS}/2_이웃집토토로스타일/photo_03_토토로.jpg`,
    zoom: 1.2, posX: "50%", posY: "40%", bubblePos: "bottom",
    icons: ["🌙", "⭐"],
    borderColor: "#a5b4fc", badgeColor: "#6366f1"
  }
];

// --- MIDDLE GIRL (통통 튀는 과즙미, 주접 & 리액션 30종) ---
const MIDDLE_STICKERS = [
  {
    id: "mid_01",
    name: "하이하이! 나 등장!",
    mainText: "하이하이! 나 등장! 🧋",
    badge: "과즙미 뿜뿜 주접 모드",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_01_인사이드아웃.jpg`,
    zoom: 1.25, posX: "50%", posY: "40%", bubblePos: "bottom",
    icons: ["✨", "🧋"],
    borderColor: "#c084fc", badgeColor: "#9333ea"
  },
  {
    id: "mid_02",
    name: "오키오키 접수 완료~",
    mainText: "오키오키 접수 완료~ 👌",
    badge: "센스만점 이해완료",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_02_인사이드아웃.jpg`,
    zoom: 1.3, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["👌", "✨"],
    borderColor: "#c084fc", badgeColor: "#9333ea"
  },
  {
    id: "mid_03",
    name: "완전 럭키비키잖앙!",
    mainText: "완전 럭키비키잖앙! 🍀",
    badge: "원영적 사고 풀가동",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_03_인사이드아웃.jpg`,
    zoom: 1.3, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["🍀", "✨"],
    borderColor: "#4ade80", badgeColor: "#16a34a"
  },
  {
    id: "mid_04",
    name: "헐 대박 완전 귀여워!!",
    mainText: "헐 대박 완전 귀여워!! 💖",
    badge: "심장 폭행 당함 큐트",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_04_인사이드아웃.jpg`,
    zoom: 1.25, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["💖", "✨"],
    borderColor: "#f472b6", badgeColor: "#db2777"
  },
  {
    id: "mid_05",
    name: "심장 아파... 큐트해",
    mainText: "심장 아파... 큐트해 💘",
    badge: "지구 뿌셔 아파트 뿌셔",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_07_인사이드아웃.jpg`,
    zoom: 1.3, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["💘", "💥"],
    borderColor: "#f472b6", badgeColor: "#db2777"
  },
  {
    id: "mid_06",
    name: "당 충전 시급함 (초코!)",
    mainText: "당 충전 시급함 (초코!) 🍫",
    badge: "초코 퐁듀에 빠질래",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_09_인사이드아웃.jpg`,
    zoom: 1.35, posX: "50%", posY: "40%", bubblePos: "bottom",
    icons: ["🍫", "⚡"],
    borderColor: "#d97706", badgeColor: "#b45309"
  },
  {
    id: "mid_07",
    name: "마라탕 먹으러 갈 파티원!",
    mainText: "마라탕 먹으러 갈 파티원! 🍜",
    badge: "꿔바로우도 필수 주문!",
    src: `${BRAIN_PHOTOS}/media_1794829448887_78d2dce8.jpg`,
    zoom: 1.25, posX: "50%", posY: "40%", bubblePos: "top",
    icons: ["🍜", "🔥"],
    borderColor: "#ef4444", badgeColor: "#b91c1c"
  },
  {
    id: "mid_08",
    name: "헤헤 넘 조아앙",
    mainText: "헤헤 넘 조아앙 😆",
    badge: "광대 승천 리액션",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_02_인사이드아웃.jpg`,
    zoom: 1.35, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["😆", "✨"],
    borderColor: "#c084fc", badgeColor: "#9333ea"
  },
  {
    id: "mid_09",
    name: "고마워! 복 받을 거양",
    mainText: "고마워! 복 받을 거양 👼",
    badge: "천사 강림 특급 감동",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_05_인사이드아웃.jpg`,
    zoom: 1.25, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["👼", "💖"],
    borderColor: "#c084fc", badgeColor: "#9333ea"
  },
  {
    id: "mid_10",
    name: "내가 잘못했어 싹싹~",
    mainText: "내가 잘못했어 싹싹~ 😭",
    badge: "무릎 꿇고 손이 발 되게",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_08_인사이드아웃.jpg`,
    zoom: 1.35, posX: "50%", posY: "35%", bubblePos: "top",
    icons: ["💧", "🙏"],
    borderColor: "#94a3b8", badgeColor: "#64748b"
  },
  {
    id: "mid_11",
    name: "빨리 와아 보고 시펑",
    mainText: "빨리 와아 보고 시펑 ⏰",
    badge: "현기증 난단 말이야",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_06_인사이드아웃.jpg`,
    zoom: 1.25, posX: "50%", posY: "40%", bubblePos: "bottom",
    icons: ["⏰", "🥺"],
    borderColor: "#f472b6", badgeColor: "#db2777"
  },
  {
    id: "mid_12",
    name: "지금 날아가는 중 슝=3",
    mainText: "지금 날아가는 중 슝=3 🚀",
    badge: "음속 돌파 광속 질주",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_10_인사이드아웃.jpg`,
    zoom: 1.2, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["🚀", "💨"],
    borderColor: "#38bdf8", badgeColor: "#0284c7"
  },
  {
    id: "mid_13",
    name: "기분 날아갈 것 같아!",
    mainText: "기분 날아갈 것 같아! 🛸",
    badge: "텐션 우주 뚫는 중",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_03_인사이드아웃.jpg`,
    zoom: 1.3, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["🛸", "✨"],
    borderColor: "#c084fc", badgeColor: "#9333ea"
  },
  {
    id: "mid_14",
    name: "나 건들면 물 거양! 크앙",
    mainText: "나 건들면 물 거양! 크앙 🐯",
    badge: "아기 맹수 분노 모드",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_08_인사이드아웃.jpg`,
    zoom: 1.35, posX: "50%", posY: "35%", bubblePos: "top",
    icons: ["🐯", "💢"],
    borderColor: "#ef4444", badgeColor: "#b91c1c"
  },
  {
    id: "mid_15",
    name: "우울해... 달래줘 ㅠㅠ",
    mainText: "우울해... 달래줘 ㅠㅠ 🍬",
    badge: "탕후루 사주면 풀림",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_08_인사이드아웃.jpg`,
    zoom: 1.35, posX: "50%", posY: "35%", bubblePos: "top",
    icons: ["💧", "🍬"],
    borderColor: "#60a5fa", badgeColor: "#2563eb"
  },
  {
    id: "mid_16",
    name: "삐빅! 과부하 왔습니당",
    mainText: "삐빅! 과부하 왔습니당 ⚡",
    badge: "두뇌 회로 정지 상태",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_01_인사이드아웃.jpg`,
    zoom: 1.3, posX: "50%", posY: "38%", bubblePos: "bottom",
    icons: ["⚡", "🤖"],
    borderColor: "#f59e0b", badgeColor: "#d97706"
  },
  {
    id: "mid_17",
    name: "두근두근 설레잖아~",
    mainText: "두근두근 설레잖아~ 💓",
    badge: "심장 BPM 180 돌파",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_07_인사이드아웃.jpg`,
    zoom: 1.35, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["💓", "✨"],
    borderColor: "#f472b6", badgeColor: "#db2777"
  },
  {
    id: "mid_18",
    name: "주머니에 쏙 넣고 싶당",
    mainText: "주머니에 쏙 넣고 싶당 🧸",
    badge: "포켓 속에 영구 소장",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_02_인사이드아웃.jpg`,
    zoom: 1.3, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["🧸", "💖"],
    borderColor: "#c084fc", badgeColor: "#9333ea"
  },
  {
    id: "mid_19",
    name: "박수 백만 번 짝짝짝!",
    mainText: "박수 백만 번 짝짝짝! 👏",
    badge: "기립 박수 무한 갈채",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_05_인사이드아웃.jpg`,
    zoom: 1.25, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["👏", "✨"],
    borderColor: "#fbbf24", badgeColor: "#d97706"
  },
  {
    id: "mid_20",
    name: "이건 비밀인데... (속닥)",
    mainText: "이건 비밀인데... (속닥) 🤫",
    badge: "너한테만 말해주는 거야",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_06_인사이드아웃.jpg`,
    zoom: 1.3, posX: "50%", posY: "38%", bubblePos: "bottom",
    icons: ["🤫", "✨"],
    borderColor: "#818cf8", badgeColor: "#4f46e5"
  },
  {
    id: "mid_21",
    name: "졸려서 눈 감긴다아...",
    mainText: "졸려서 눈 감긴다아... 😴",
    badge: "수면제 맞은 듯 기절",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_09_인사이드아웃.jpg`,
    zoom: 1.3, posX: "50%", posY: "38%", bubblePos: "top",
    icons: ["😴", "💤"],
    borderColor: "#a5b4fc", badgeColor: "#6366f1"
  },
  {
    id: "mid_22",
    name: "뒹굴뒹굴 껌딱지 모드",
    mainText: "뒹굴뒹굴 껌딱지 모드 🛋️",
    badge: "바닥과 한 몸 되기",
    src: `${BASE_TEST_PHOTOS}/1_짱구스타일/photo_07_짱구.jpg`,
    zoom: 1.2, posX: "50%", posY: "45%", bubblePos: "bottom",
    icons: ["🛋️", "✨"],
    borderColor: "#c084fc", badgeColor: "#9333ea"
  },
  {
    id: "mid_23",
    name: "입 터졌다! 냠냠",
    mainText: "입 터졌다! 냠냠 🍕",
    badge: "오늘만 칼로리 프리!",
    src: `${BRAIN_PHOTOS}/media_1794829448887_78d2dce8.jpg`,
    zoom: 1.25, posX: "50%", posY: "40%", bubblePos: "top",
    icons: ["🍕", "😋"],
    borderColor: "#f59e0b", badgeColor: "#d97706"
  },
  {
    id: "mid_24",
    name: "헉! 까먹었어 어떡해",
    mainText: "헉! 까먹었어 어떡해 😱",
    badge: "멘붕 그 자체 비상사태",
    src: `${BRAIN_PHOTOS}/media_1794829448880_789193d1.jpg`,
    zoom: 1.25, posX: "50%", posY: "40%", bubblePos: "top",
    icons: ["😱", "💥"],
    borderColor: "#ef4444", badgeColor: "#b91c1c"
  },
  {
    id: "mid_25",
    name: "나 잘했지? 우쭈쭈해줘",
    mainText: "나 잘했지? 우쭈쭈해줘 💮",
    badge: "특급 칭찬 도장 찍어줘",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_02_인사이드아웃.jpg`,
    zoom: 1.35, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["💮", "💖"],
    borderColor: "#c084fc", badgeColor: "#9333ea"
  },
  {
    id: "mid_26",
    name: "전적으로 믿으세용! (찡긋)",
    mainText: "전적으로 믿으세용! (찡긋) 😉",
    badge: "믿고 맡기는 특급 해결사",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_05_인사이드아웃.jpg`,
    zoom: 1.3, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["😉", "⭐"],
    borderColor: "#38bdf8", badgeColor: "#0284c7"
  },
  {
    id: "mid_27",
    name: "오늘 텐션 백만 볼트!",
    mainText: "오늘 텐션 백만 볼트! ⚡",
    badge: "에너지 충전 200%",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_03_인사이드아웃.jpg`,
    zoom: 1.35, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["⚡", "🔥"],
    borderColor: "#fbbf24", badgeColor: "#d97706"
  },
  {
    id: "mid_28",
    name: "아잉 부끄럽게 왜 이래~",
    mainText: "아잉 부끄럽게 왜 이래~ 🔥",
    badge: "얼굴 불타는 중 어머나",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_07_인사이드아웃.jpg`,
    zoom: 1.35, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["🔥", "🙈"],
    borderColor: "#f472b6", badgeColor: "#db2777"
  },
  {
    id: "mid_29",
    name: "빠빠이! 연락할게용",
    mainText: "빠빠이! 연락할게용 💌",
    badge: "디엠 바로바로 확인해",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_10_인사이드아웃.jpg`,
    zoom: 1.25, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["💌", "👋"],
    borderColor: "#c084fc", badgeColor: "#9333ea"
  },
  {
    id: "mid_30",
    name: "잘 자구 내 꿈 꿔~!",
    mainText: "잘 자구 내 꿈 꿔~! ⭐",
    badge: "꿈에서 만나 데이트하자",
    src: `${BASE_TEST_PHOTOS}/4_디즈니인사이드아웃스타일/photo_04_인사이드아웃.jpg`,
    zoom: 1.25, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["⭐", "🌙"],
    borderColor: "#818cf8", badgeColor: "#4f46e5"
  }
];

// --- HIGH SCHOOL GIRL (피곤해도 말랑 힐링 감성 30종) ---
const HIGH_STICKERS = [
  {
    id: "high_01",
    name: "안농~ 생존 신고!",
    mainText: "안농~ 생존 신고! 🌙",
    badge: "야자 끝나고 생존 완료",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_01_코코.jpg`,
    zoom: 1.25, posX: "50%", posY: "40%", bubblePos: "bottom",
    icons: ["🌙", "✨"],
    borderColor: "#818cf8", badgeColor: "#4f46e5"
  },
  {
    id: "high_02",
    name: "웅! 확인했어용",
    mainText: "웅! 확인했어용 📑",
    badge: "내용 확인 끄덕끄덕",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_02_코코.jpg`,
    zoom: 1.3, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["📑", "✨"],
    borderColor: "#818cf8", badgeColor: "#4f46e5"
  },
  {
    id: "high_03",
    name: "오예! 신난다아",
    mainText: "오예! 신난다아 🥳",
    badge: "피로가 싹 날아감",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_03_코코.jpg`,
    zoom: 1.3, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["🥳", "✨"],
    borderColor: "#38bdf8", badgeColor: "#0284c7"
  },
  {
    id: "high_04",
    name: "소확행 충전 중...",
    mainText: "소확행 충전 중... ☕",
    badge: "나만의 작은 힐링",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_04_코코.jpg`,
    zoom: 1.3, posX: "50%", posY: "38%", bubblePos: "bottom",
    icons: ["☕", "🌿"],
    borderColor: "#34d399", badgeColor: "#059669"
  },
  {
    id: "high_05",
    name: "꼬르륵... 밥 시간 언제야",
    mainText: "꼬르륵... 밥 시간 언제야 🍱",
    badge: "급식표 정독 완료!",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_05_코코.jpg`,
    zoom: 1.3, posX: "50%", posY: "40%", bubblePos: "top",
    icons: ["🍱", "💧"],
    borderColor: "#fb923c", badgeColor: "#c2410c"
  },
  {
    id: "high_06",
    name: "달달구리 수혈 필요해",
    mainText: "달달구리 수혈 필요해 🧁",
    badge: "마카롱 사주실 분 구함",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_06_코코.jpg`,
    zoom: 1.35, posX: "50%", posY: "38%", bubblePos: "bottom",
    icons: ["🧁", "✨"],
    borderColor: "#f472b6", badgeColor: "#db2777"
  },
  {
    id: "high_07",
    name: "너밖에 없다 감동이야 ㅠ",
    mainText: "너밖에 없다 감동이야 ㅠ 🥺",
    badge: "평생 친구 인정 탕탕",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_07_코코.jpg`,
    zoom: 1.3, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["🥺", "💖"],
    borderColor: "#818cf8", badgeColor: "#4f46e5"
  },
  {
    id: "high_08",
    name: "미안미안! 내가 다 잘못했엉",
    mainText: "미안미안! 내가 다 잘못했엉 🙇‍♀️",
    badge: "사죄의 절 올립니다",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_08_코코.jpg`,
    zoom: 1.35, posX: "50%", posY: "35%", bubblePos: "top",
    icons: ["🙇‍♀️", "💧"],
    borderColor: "#94a3b8", badgeColor: "#64748b"
  },
  {
    id: "high_09",
    name: "힐링이 필요해... 토닥토닥",
    mainText: "힐링이 필요해... 토닥토닥 🧸",
    badge: "따뜻한 위로 한 스푼",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_02_코코.jpg`,
    zoom: 1.3, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["🧸", "✨"],
    borderColor: "#818cf8", badgeColor: "#4f46e5"
  },
  {
    id: "high_10",
    name: "조금만 더 힘내자 아자!",
    mainText: "조금만 더 힘내자 아자! 🍀",
    badge: "우린 해낼 수 있어 힘내자",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_03_코코.jpg`,
    zoom: 1.3, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["🍀", "💪"],
    borderColor: "#4ade80", badgeColor: "#16a34a"
  },
  {
    id: "high_11",
    name: "총총총... 집 가는 길!",
    mainText: "총총총... 집 가는 길! 🎒",
    badge: "하교 발걸음 가볍게",
    src: `${BASE_TEST_PHOTOS}/2_이웃집토토로스타일/photo_01_토토로.jpg`,
    zoom: 1.2, posX: "50%", posY: "40%", bubblePos: "bottom",
    icons: ["🎒", "✨"],
    borderColor: "#818cf8", badgeColor: "#4f46e5"
  },
  {
    id: "high_12",
    name: "칼답 대기 중입니당",
    mainText: "칼답 대기 중입니당 ⚡",
    badge: "0.1초 만에 폭풍 답장",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_05_코코.jpg`,
    zoom: 1.3, posX: "50%", posY: "38%", bubblePos: "bottom",
    icons: ["⚡", "📱"],
    borderColor: "#38bdf8", badgeColor: "#0284c7"
  },
  {
    id: "high_13",
    name: "기분 몽글몽글해졌어",
    mainText: "기분 몽글몽글해졌어 ☁️",
    badge: "구름 위를 걷는 기분",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_07_코코.jpg`,
    zoom: 1.3, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["☁️", "💖"],
    borderColor: "#818cf8", badgeColor: "#4f46e5"
  },
  {
    id: "high_14",
    name: "나 지금 뾰루퉁함",
    mainText: "나 지금 뾰루퉁함 😤",
    badge: "건드리면 삐짐 모드",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_08_코코.jpg`,
    zoom: 1.35, posX: "50%", posY: "35%", bubblePos: "top",
    icons: ["😤", "💢"],
    borderColor: "#fb7185", badgeColor: "#e11d48"
  },
  {
    id: "high_15",
    name: "사르르 녹는다 녹아...",
    mainText: "사르르 녹는다 녹아... ♨️",
    badge: "따끈따끈 온수매트 힐링",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_02_코코.jpg`,
    zoom: 1.3, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["♨️", "✨"],
    borderColor: "#fbbf24", badgeColor: "#d97706"
  },
  {
    id: "high_16",
    name: "뇌 용량 초과! 삐빅-",
    mainText: "뇌 용량 초과! 삐빅- 🧠",
    badge: "공부 과부하 시스템 셧다운",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_06_코코.jpg`,
    zoom: 1.3, posX: "50%", posY: "38%", bubblePos: "bottom",
    icons: ["🧠", "⚡"],
    borderColor: "#ef4444", badgeColor: "#b91c1c"
  },
  {
    id: "high_17",
    name: "설레서 잠 안 와 어떡행",
    mainText: "설레서 잠 안 와 어떡행 💫",
    badge: "설렘 주의보 긴급 발령",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_07_코코.jpg`,
    zoom: 1.35, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["💫", "💓"],
    borderColor: "#f472b6", badgeColor: "#db2777"
  },
  {
    id: "high_18",
    name: "오늘 미모 열일하네!",
    mainText: "오늘 미모 열일하네! 🪞",
    badge: "거울 보고 심쿵 거울샷",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_03_코코.jpg`,
    zoom: 1.3, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["🪞", "✨"],
    borderColor: "#818cf8", badgeColor: "#4f46e5"
  },
  {
    id: "high_19",
    name: "무조건 찬성! 콜이야",
    mainText: "무조건 찬성! 콜이야 🤙",
    badge: "묻지도 따지지도 않고 콜",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_04_코코.jpg`,
    zoom: 1.25, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["🤙", "✨"],
    borderColor: "#34d399", badgeColor: "#059669"
  },
  {
    id: "high_20",
    name: "우리끼리만 아는 거당?",
    mainText: "우리끼리만 아는 거당? 🤫",
    badge: "쉿! 국가 1급 비밀",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_06_코코.jpg`,
    zoom: 1.35, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["🤫", "✨"],
    borderColor: "#818cf8", badgeColor: "#4f46e5"
  },
  {
    id: "high_21",
    name: "꾸벅꾸벅... 잠과의 사투",
    mainText: "꾸벅꾸벅... 잠과의 사투 😴",
    badge: "잠의 신과의 한판승부",
    src: `${BRAIN_PHOTOS}/media_1794829448548_987be3d5.jpg`,
    zoom: 1.25, posX: "70%", posY: "35%", bubblePos: "top",
    icons: ["😴", "💤"],
    borderColor: "#a5b4fc", badgeColor: "#6366f1"
  },
  {
    id: "high_22",
    name: "이불 속에서 꼼지락",
    mainText: "이불 속에서 꼼지락 ❄️",
    badge: "이불 밖은 차가운 빙하기",
    src: `${BRAIN_PHOTOS}/media_1794829448548_987be3d5.jpg`,
    zoom: 1.15, posX: "50%", posY: "50%", bubblePos: "top",
    icons: ["❄️", "🍊"],
    borderColor: "#f59e0b", badgeColor: "#d97706"
  },
  {
    id: "high_23",
    name: "맛있는 거 사주세용 헤헤",
    mainText: "맛있는 거 사주세용 헤헤 🍊",
    badge: "귤 드리고 고기 받기 신공",
    src: `${BRAIN_PHOTOS}/media_1794829448874_fc74f294.jpg`,
    zoom: 1.25, posX: "50%", posY: "40%", bubblePos: "top",
    icons: ["🍊", "😋"],
    borderColor: "#fb7185", badgeColor: "#f43f5e"
  },
  {
    id: "high_24",
    name: "동공 지진... 어떡하지",
    mainText: "동공 지진... 어떡하지 🌀",
    badge: "멘붕 카운트다운 진입",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_01_코코.jpg`,
    zoom: 1.35, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["🌀", "💦"],
    borderColor: "#ef4444", badgeColor: "#b91c1c"
  },
  {
    id: "high_25",
    name: "오늘 하루도 고생 많았어!",
    mainText: "오늘 하루도 고생 많았어! ✨",
    badge: "토닥토닥 너 진짜 최고였어",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_02_코코.jpg`,
    zoom: 1.3, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["✨", "🧸"],
    borderColor: "#818cf8", badgeColor: "#4f46e5"
  },
  {
    id: "high_26",
    name: "내 마음이야 받아랏 얍!",
    mainText: "내 마음이야 받아랏 얍! 💖",
    badge: "달달한 마음 가득 선물",
    src: `${BRAIN_PHOTOS}/media_1794829448874_fc74f294.jpg`,
    zoom: 1.3, posX: "60%", posY: "55%", bubblePos: "top",
    icons: ["💖", "🎁"],
    borderColor: "#fb7185", badgeColor: "#f43f5e"
  },
  {
    id: "high_27",
    name: "충전 완료! 삐리릿",
    mainText: "충전 완료! 삐리릿 🔋",
    badge: "에너지 풀충전 100% 완료",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_03_코코.jpg`,
    zoom: 1.3, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["🔋", "⚡"],
    borderColor: "#4ade80", badgeColor: "#16a34a"
  },
  {
    id: "high_28",
    name: "부끄러우니까 숨어야지 총총",
    mainText: "부끄러우니까 숨어야지 총총 🙈",
    badge: "벽 뒤로 쏙 숨기 시전",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_06_코코.jpg`,
    zoom: 1.3, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["🙈", "🌸"],
    borderColor: "#f472b6", badgeColor: "#db2777"
  },
  {
    id: "high_29",
    name: "내일 보자아 안뇽!",
    mainText: "내일 보자아 안뇽! 🌸",
    badge: "내일 등교길에 만나자",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_04_코코.jpg`,
    zoom: 1.25, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["🌸", "👋"],
    borderColor: "#818cf8", badgeColor: "#4f46e5"
  },
  {
    id: "high_30",
    name: "포근한 밤 보내 굿나잇!",
    mainText: "포근한 밤 보내 굿나잇! 🌙",
    badge: "포근한 이불 덮고 굿밤",
    src: `${BASE_TEST_PHOTOS}/3_디즈니코코스타일/photo_07_코코.jpg`,
    zoom: 1.3, posX: "50%", posY: "35%", bubblePos: "bottom",
    icons: ["🌙", "⭐"],
    borderColor: "#818cf8", badgeColor: "#4f46e5"
  }
];

function generateHtml(s) {
  const isTop = s.bubblePos === "top";
  const bubblePosCss = isTop ? "top: 20px;" : "bottom: 20px;";
  const tailPosCss = isTop 
    ? "bottom: -14px; left: 60px; border-width: 14px 14px 0 14px; border-color: rgba(255,255,255,0.98) transparent transparent transparent;" 
    : "top: -14px; right: 70px; border-width: 0 14px 14px 14px; border-color: transparent transparent rgba(255,255,255,0.98) transparent;";

  const icon1 = (s.icons && s.icons[0]) || "✨";
  const icon2 = (s.icons && s.icons[1]) || "💖";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { width: 512px; height: 512px; overflow: hidden; background: transparent; }
  .sticker-wrap {
    position: relative;
    width: 512px;
    height: 512px;
    border-radius: 48px;
    overflow: hidden;
    background: #111827;
    border: 7px solid ${s.borderColor};
    box-shadow: 0 16px 36px rgba(0,0,0,0.3);
  }
  .bg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: ${s.posX} ${s.posY};
    transform: scale(${s.zoom});
    transform-origin: ${s.posX} ${s.posY};
  }
  /* Cute Cheek Blush Lines (발그레한 핑크빛 볼터치와 빗금) */
  .blush-l {
    position: absolute;
    bottom: ${isTop ? "140px" : "180px"};
    left: 80px;
    width: 70px;
    height: 35px;
    background: radial-gradient(ellipse, rgba(255,100,160,0.65) 0%, rgba(255,100,160,0) 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  .blush-r {
    position: absolute;
    bottom: ${isTop ? "140px" : "180px"};
    right: 80px;
    width: 70px;
    height: 35px;
    background: radial-gradient(ellipse, rgba(255,100,160,0.65) 0%, rgba(255,100,160,0) 70%);
    border-radius: 50%;
    pointer-events: none;
  }
  /* Floating sparkle icons */
  .sparkle-icon {
    position: absolute;
    font-size: 30px;
    filter: drop-shadow(0 2px 8px rgba(0,0,0,0.3));
    z-index: 10;
  }
  /* Speech Bubble */
  .comic-bubble {
    position: absolute;
    ${bubblePosCss}
    left: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.98);
    border: 3.5px solid #1e293b;
    border-radius: 30px;
    padding: 13px 18px;
    text-align: center;
    box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
    backdrop-filter: blur(8px);
    z-index: 20;
  }
  .bubble-tail {
    position: absolute;
    ${tailPosCss}
    width: 0;
    height: 0;
    border-style: solid;
  }
  .main-text {
    font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Pretendard", "Noto Sans KR", sans-serif;
    font-size: 27px;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: -0.6px;
    line-height: 1.25;
    text-shadow: 0 1px 2px rgba(0,0,0,0.1);
  }
  .sub-badge {
    display: inline-block;
    margin-top: 5px;
    padding: 3px 12px;
    border-radius: 12px;
    background: ${s.badgeColor}18;
    color: ${s.badgeColor};
    font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Pretendard", "Noto Sans KR", sans-serif;
    font-size: 13.5px;
    font-weight: 800;
    letter-spacing: -0.2px;
    border: 1.5px solid ${s.badgeColor}40;
  }
</style>
</head>
<body>
  <div class="sticker-wrap">
    <img src="${s.src}" class="bg-img">
    <div class="blush-l"></div>
    <div class="blush-r"></div>
    <div class="sparkle-icon" style="top: ${isTop ? "160px" : "28px"}; left: 26px;">${icon1}</div>
    <div class="sparkle-icon" style="top: ${isTop ? "170px" : "36px"}; right: 30px;">${icon2}</div>
    <div class="comic-bubble">
      <div class="bubble-tail"></div>
      <div class="main-text">${s.mainText}</div>
      <div class="sub-badge">${s.badge}</div>
    </div>
  </div>
</body>
</html>`;
}

function renderBatch(stickers, publicDir, wwwDir, label) {
  console.log(`\n========================================`);
  console.log(`Starting generation of ${stickers.length} stickers for ${label}...`);
  console.log(`========================================`);

  for (let i = 0; i < stickers.length; i++) {
    const s = stickers[i];
    const html = generateHtml(s);
    const tmpHtml = `/tmp/render_${s.id}.html`;
    const outPngPublic = path.join(publicDir, `${s.id}.png`);
    const outPngWww = path.join(wwwDir, `${s.id}.png`);

    fs.writeFileSync(tmpHtml, html, 'utf8');
    const cmd = `"${CHROME_BIN}" --headless --disable-gpu --window-size=512,512 --screenshot="${outPngPublic}" "file://${tmpHtml}"`;
    execSync(cmd, { stdio: 'ignore' });

    fs.copyFileSync(outPngPublic, outPngWww);
    try { fs.unlinkSync(tmpHtml); } catch (e) {}

    console.log(`[${i + 1}/${stickers.length}] Rendered: ${s.id}.png - "${s.name}" (${s.badge})`);
  }
}

// Run batches if called directly
if (require.main === module) {
  renderBatch(ELEMENTARY_STICKERS, OUT_DIR_ELEM, WWW_DIR_ELEM, "초등학생 여자아이 (말랑콩떡)");
  renderBatch(MIDDLE_STICKERS, OUT_DIR_MID, WWW_DIR_MID, "중학생 여자아이 (과즙미 뿜뿜)");
  renderBatch(HIGH_STICKERS, OUT_DIR_HIGH, WWW_DIR_HIGH, "고등학생 여자아이 (말랑 힐링)");
  console.log('\nAll 90 stickers generated and synced to www/ successfully!');
}

module.exports = {
  ELEMENTARY_STICKERS,
  MIDDLE_STICKERS,
  HIGH_STICKERS
};


const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const CHROME_BIN = '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome';
const SRC_DIR = '/Users/kotinet/.gemini/antigravity/brain/ac18336d-2471-4bbb-977a-339e0d205c66/.user_uploaded';
const OUT_DIR_PUBLIC = path.resolve(__dirname, '../public/stickers/minchae');
const OUT_DIR_WWW = path.resolve(__dirname, '../www/public/stickers/minchae');

if (!fs.existsSync(OUT_DIR_PUBLIC)) fs.mkdirSync(OUT_DIR_PUBLIC, { recursive: true });
if (!fs.existsSync(OUT_DIR_WWW)) fs.mkdirSync(OUT_DIR_WWW, { recursive: true });

const STICKERS = [
  {
    id: "minchae_01",
    name: "이불 밖은 위험해",
    src: "media_1794829448548_987be3d5.jpg",
    zoom: 1.0,
    posX: "50%",
    posY: "50%",
    bubblePos: "bottom",
    mainText: "이불 밖은 위험해... Zzz",
    badge: "귤 까먹다 기절 🍊",
    borderColor: "#f472b6",
    badgeColor: "#ec4899"
  },
  {
    id: "minchae_02",
    name: "5분만 더 잘래",
    src: "media_1794829448548_987be3d5.jpg",
    zoom: 1.45,
    posX: "72%",
    posY: "36%",
    bubblePos: "bottom",
    mainText: "5분만 더 잘래... 😴",
    badge: "기상 거부 모드 가동",
    borderColor: "#818cf8",
    badgeColor: "#6366f1"
  },
  {
    id: "minchae_03",
    name: "귤 하나만 더",
    src: "media_1794829448548_987be3d5.jpg",
    zoom: 1.35,
    posX: "45%",
    posY: "65%",
    bubblePos: "top",
    mainText: "귤 하나만 더 까먹고... 🍊",
    badge: "겨울엔 이불 속 귤이지!",
    borderColor: "#fbbf24",
    badgeColor: "#f59e0b"
  },
  {
    id: "minchae_04",
    name: "꿈나라 퇴근",
    src: "media_1794829448548_987be3d5.jpg",
    zoom: 1.15,
    posX: "60%",
    posY: "40%",
    bubblePos: "bottom",
    mainText: "꿈나라로 퇴근 완료! 🌙",
    badge: "오늘 하루도 수고했어 토닥토닥",
    borderColor: "#60a5fa",
    badgeColor: "#3b82f6"
  },
  {
    id: "minchae_05",
    name: "옛다 너 하나 준다",
    src: "media_1794829448874_fc74f294.jpg",
    zoom: 1.0,
    posX: "50%",
    posY: "50%",
    bubblePos: "top",
    mainText: "옛다! 너 하나 준다 🍊",
    badge: "츤데레 민채의 특급 선물",
    borderColor: "#fb7185",
    badgeColor: "#f43f5e"
  },
  {
    id: "minchae_06",
    name: "달달한 뇌물",
    src: "media_1794829448874_fc74f294.jpg",
    zoom: 1.45,
    posX: "70%",
    posY: "78%",
    bubblePos: "top",
    mainText: "달달한 뇌물 투척! 💖",
    badge: "먹고 떨어져라~ 냠!",
    borderColor: "#f472b6",
    badgeColor: "#db2777"
  },
  {
    id: "minchae_07",
    name: "나 착하지 칭찬해줘",
    src: "media_1794829448874_fc74f294.jpg",
    zoom: 1.3,
    posX: "40%",
    posY: "32%",
    bubblePos: "bottom",
    mainText: "나 착하지? 칭찬해줘! ✨",
    badge: "생색 대마왕 민채 출동",
    borderColor: "#34d399",
    badgeColor: "#059669"
  },
  {
    id: "minchae_08",
    name: "간식은 내가 쏜다",
    src: "media_1794829448874_fc74f294.jpg",
    zoom: 1.15,
    posX: "50%",
    posY: "45%",
    bubblePos: "bottom",
    mainText: "오늘 간식은 내가 쏜다! 🍊",
    badge: "비장한 간식 타임",
    borderColor: "#f59e0b",
    badgeColor: "#d97706"
  },
  {
    id: "minchae_09",
    name: "으아아악 실화냐",
    src: "media_1794829448880_789193d1.jpg",
    zoom: 1.0,
    posX: "50%",
    posY: "50%",
    bubblePos: "bottom",
    mainText: "으아아악 실화냐?! 😱",
    badge: "충격과 공포의 멘붕 현장",
    borderColor: "#ef4444",
    badgeColor: "#dc2626"
  },
  {
    id: "minchae_10",
    name: "헉 대박 사건",
    src: "media_1794829448880_789193d1.jpg",
    zoom: 1.5,
    posX: "48%",
    posY: "45%",
    bubblePos: "top",
    mainText: "헉! 대박 사건!! 💥",
    badge: "동공 지진 100%",
    borderColor: "#f97316",
    badgeColor: "#ea580c"
  },
  {
    id: "minchae_11",
    name: "뭐라고 다시 말해봐",
    src: "media_1794829448880_789193d1.jpg",
    zoom: 1.25,
    posX: "50%",
    posY: "35%",
    bubblePos: "bottom",
    mainText: "뭐라고?! 다시 말해봐!! ⚡",
    badge: "현실 부정 중...",
    borderColor: "#eab308",
    badgeColor: "#ca8a04"
  },
  {
    id: "minchae_12",
    name: "내 멘탈 돌려줘",
    src: "media_1794829448880_789193d1.jpg",
    zoom: 1.35,
    posX: "50%",
    posY: "55%",
    bubblePos: "bottom",
    mainText: "내 멘탈 돌려줘어어—!! 😭",
    badge: "쿠구구궁 멘붕 폭발",
    borderColor: "#38bdf8",
    badgeColor: "#0284c7"
  },
  {
    id: "minchae_13",
    name: "면치기의 신",
    src: "media_1794829448887_78d2dce8.jpg",
    zoom: 1.0,
    posX: "50%",
    posY: "50%",
    bubblePos: "bottom",
    mainText: "호로록! 면치기의 신 🍜",
    badge: "끊기 금지! 원샷 흡입",
    borderColor: "#fb923c",
    badgeColor: "#ea580c"
  },
  {
    id: "minchae_14",
    name: "앗 뜨거 후후 불어먹자",
    src: "media_1794829448887_78d2dce8.jpg",
    zoom: 1.4,
    posX: "50%",
    posY: "42%",
    bubblePos: "top",
    mainText: "앗 뜨거! 후후 불어먹자 🥢",
    badge: "조심조심 뇸뇸",
    borderColor: "#f43f5e",
    badgeColor: "#e11d48"
  },
  {
    id: "minchae_15",
    name: "국물이 끝내줘요",
    src: "media_1794829448887_78d2dce8.jpg",
    zoom: 1.2,
    posX: "50%",
    posY: "35%",
    bubblePos: "bottom",
    mainText: "국물이 끝내줘요~ 캬! 🍲",
    badge: "속이 확 풀린다~",
    borderColor: "#10b981",
    badgeColor: "#059669"
  },
  {
    id: "minchae_16",
    name: "음 바로 이 맛이지",
    src: "media_1794829448893_647ac9e0.jpg",
    zoom: 1.0,
    posX: "50%",
    posY: "50%",
    bubblePos: "bottom",
    mainText: "음~ 바로 이 맛이지! 💖",
    badge: "천상의 맛 극락 체험",
    borderColor: "#ec4899",
    badgeColor: "#db2777"
  },
  {
    id: "minchae_17",
    name: "존맛탱 인정",
    src: "media_1794829448893_647ac9e0.jpg",
    zoom: 1.35,
    posX: "45%",
    posY: "40%",
    bubblePos: "bottom",
    mainText: "존맛탱 인정! 말리지 마 🔥",
    badge: "미식가 민채의 원픽",
    borderColor: "#ef4444",
    badgeColor: "#dc2626"
  },
  {
    id: "minchae_18",
    name: "행복은 가까이에",
    src: "media_1794829448893_647ac9e0.jpg",
    zoom: 1.2,
    posX: "55%",
    posY: "35%",
    bubblePos: "top",
    mainText: "행복은 맛있는 거 먹는 것! 😋",
    badge: "힐링 게이지 100% 충전",
    borderColor: "#f59e0b",
    badgeColor: "#d97706"
  },
  {
    id: "minchae_19",
    name: "오물오물 뇸뇸",
    src: "media_1794829448898_c229e0ca.jpg",
    zoom: 1.0,
    posX: "50%",
    posY: "50%",
    bubblePos: "bottom",
    mainText: "오물오물 뇸뇸 먹는 중 🥢",
    badge: "볼 빵빵 귀여움 한도초과",
    borderColor: "#a855f7",
    badgeColor: "#9333ea"
  },
  {
    id: "minchae_20",
    name: "먹을 땐 건드리지 마라",
    src: "media_1794829448898_c229e0ca.jpg",
    zoom: 1.35,
    posX: "50%",
    posY: "35%",
    bubblePos: "bottom",
    mainText: "먹을 땐 건드리지 마라! 쉿 🤫",
    badge: "식사 방해 절대 금지 모드",
    borderColor: "#8b5cf6",
    badgeColor: "#7c3aed"
  }
];

function generateHtml(s) {
  const imgSrc = path.join(SRC_DIR, s.src);
  const bubblePositionCss = s.bubblePos === 'top' 
    ? 'top: 22px;' 
    : 'bottom: 22px;';

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body {
    width: 512px;
    height: 512px;
    overflow: hidden;
    background: #000000;
  }
  .sticker-wrap {
    position: relative;
    width: 512px;
    height: 512px;
    border-radius: 40px;
    overflow: hidden;
    background: #111827;
    border: 5px solid ${s.borderColor};
    box-shadow: inset 0 0 20px rgba(0,0,0,0.5);
  }
  .bg-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: ${s.posX} ${s.posY};
    transform: scale(${s.zoom});
    transform-origin: ${s.posX} ${s.posY};
  }
  .comic-bubble {
    position: absolute;
    ${bubblePositionCss}
    left: 20px;
    right: 20px;
    background: rgba(255, 255, 255, 0.96);
    border: 3.5px solid #0f172a;
    border-radius: 26px;
    padding: 12px 18px;
    text-align: center;
    box-shadow: 0 12px 28px rgba(0, 0, 0, 0.45);
    backdrop-filter: blur(8px);
  }
  .dialogue-text {
    font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Pretendard", "Noto Sans KR", sans-serif;
    font-size: 26px;
    font-weight: 900;
    color: #0f172a;
    letter-spacing: -0.5px;
    line-height: 1.25;
    text-shadow: 0 1px 1px rgba(0,0,0,0.12);
  }
  .sub-tag {
    font-family: -apple-system, BlinkMacSystemFont, "Apple SD Gothic Neo", "Pretendard", "Noto Sans KR", sans-serif;
    font-size: 14px;
    font-weight: 800;
    color: ${s.badgeColor};
    margin-top: 5px;
    letter-spacing: -0.2px;
  }
</style>
</head>
<body>
  <div class="sticker-wrap">
    <img src="${imgSrc}" class="bg-img">
    <div class="comic-bubble">
      <div class="dialogue-text">${s.mainText}</div>
      <div class="sub-tag">${s.badge}</div>
    </div>
  </div>
</body>
</html>`;
}

console.log(`Starting generation of ${STICKERS.length} Minchae Jjanggu stickers...`);

for (let i = 0; i < STICKERS.length; i++) {
  const s = STICKERS[i];
  const htmlContent = generateHtml(s);
  const tmpHtmlPath = `/tmp/render_${s.id}.html`;
  const outPngPublic = path.join(OUT_DIR_PUBLIC, `${s.id}.png`);
  const outPngWww = path.join(OUT_DIR_WWW, `${s.id}.png`);

  fs.writeFileSync(tmpHtmlPath, htmlContent, 'utf8');

  const cmd = `"${CHROME_BIN}" --headless --disable-gpu --window-size=512,512 --screenshot="${outPngPublic}" "file://${tmpHtmlPath}"`;
  execSync(cmd, { stdio: 'ignore' });

  // Copy to www/
  fs.copyFileSync(outPngPublic, outPngWww);

  // Clean up tmp html
  try { fs.unlinkSync(tmpHtmlPath); } catch (e) {}

  console.log(`[${i + 1}/${STICKERS.length}] Rendered: ${s.id}.png - "${s.name}" (${s.mainText})`);
}

console.log('All 20 Minchae Jjanggu stickers generated successfully!');

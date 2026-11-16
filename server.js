/**
 * 하루맞춤 (Haru Matchum) - Backend Server
 * Node.js Static Server & Simple Auth/Sync API & Git Auto-Sync
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const zlib = require("zlib");
const { execSync } = require("child_process");

const PORT = process.env.PORT || 80;
const PERSISTENT_DIR = "/app/data";
const DATA_DIR = (fs.existsSync(PERSISTENT_DIR) && process.env.NODE_ENV !== "test") ? PERSISTENT_DIR : path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "users.json");
const LOGS_FILE = path.join(DATA_DIR, "access_logs.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
const PHOTOS_DIR = path.join(DATA_DIR, "uploads", "photos");
const VAPID_FILE = path.join(DATA_DIR, "vapid_keys.json");
const PUSH_SUBS_FILE = path.join(DATA_DIR, "push_subscriptions.json");
const PHOTO_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours (1 day) automatic deletion

// Web Push Module & VAPID Setup (v2.9.14)
let webpush = null;
try {
  webpush = require(path.join(__dirname, "vendor", "node_modules", "web-push"));
} catch (e1) {
  try {
    webpush = require("web-push");
  } catch (e2) {
    console.warn("[Web Push] web-push module not available:", e2.message);
  }
}

let vapidKeys = null;
if (fs.existsSync(VAPID_FILE)) {
  try {
    vapidKeys = JSON.parse(fs.readFileSync(VAPID_FILE, "utf8"));
  } catch (e) {}
}
if (!vapidKeys && webpush) {
  try {
    vapidKeys = webpush.generateVAPIDKeys();
    fs.writeFileSync(VAPID_FILE, JSON.stringify(vapidKeys, null, 2), "utf8");
    console.log("[Web Push] Generated fresh VAPID keys saved to", VAPID_FILE);
  } catch (e) {
    console.error("[Web Push] Failed to generate VAPID keys:", e);
  }
}
if (webpush && vapidKeys) {
  try {
    webpush.setVapidDetails(
      "mailto:admin@danminlove.com",
      vapidKeys.publicKey,
      vapidKeys.privateKey
    );
    console.log("[Web Push] VAPID details configured successfully.");
  } catch (e) {
    console.error("[Web Push] Failed to set VAPID details:", e);
  }
}

// Ensure data and photo directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(PHOTOS_DIR)) {
  fs.mkdirSync(PHOTOS_DIR, { recursive: true });
}

// Initial bootstrap if running in container persistent volume mode
if (DATA_DIR === PERSISTENT_DIR) {
  const fallbackDir = path.join(__dirname, "data");
  if (fs.existsSync(fallbackDir)) {
    const srcUsers = path.join(fallbackDir, "users.json");
    const targetUsers = path.join(DATA_DIR, "users.json");
    if (!fs.existsSync(targetUsers) && fs.existsSync(srcUsers)) {
      try {
        fs.copyFileSync(srcUsers, targetUsers);
        console.log("[Persistence] Bootstrapped users.json into /app/data");
      } catch (e) {
        console.error("Failed to bootstrap users.json:", e);
      }
    }
    const srcLogs = path.join(fallbackDir, "access_logs.json");
    const targetLogs = path.join(DATA_DIR, "access_logs.json");
    if (!fs.existsSync(targetLogs) && fs.existsSync(srcLogs)) {
      try {
        fs.copyFileSync(srcLogs, targetLogs);
        console.log("[Persistence] Bootstrapped access_logs.json into /app/data");
      } catch (e) {
        console.error("Failed to bootstrap access_logs.json:", e);
      }
    }
    const srcMessages = path.join(fallbackDir, "messages.json");
    const targetMessages = path.join(DATA_DIR, "messages.json");
    if (!fs.existsSync(targetMessages) && fs.existsSync(srcMessages)) {
      try {
        fs.copyFileSync(srcMessages, targetMessages);
        console.log("[Persistence] Bootstrapped messages.json into /app/data");
      } catch (e) {}
    }
    const srcVapid = path.join(fallbackDir, "vapid_keys.json");
    const targetVapid = path.join(DATA_DIR, "vapid_keys.json");
    if (!fs.existsSync(targetVapid) && fs.existsSync(srcVapid)) {
      try {
        fs.copyFileSync(srcVapid, targetVapid);
        console.log("[Persistence] Bootstrapped vapid_keys.json into /app/data");
      } catch (e) {}
    }
  }
}

// Self-Healing helper for authentic users (Rule 6)
function ensureUserIntegrity(db) {
  if (!db || !db.users) return false;
  let changed = false;

  // If user 미니미니채 exists and has empty avatarAccessories, restore cute costume set
  const m = db.users["미니미니채"];
  if (m) {
    const acc = m.avatarAccessories || {};
    const hasValidAcc = Object.values(acc).some(v => v !== null && v !== undefined && v !== 'eyes');
    if (!hasValidAcc) {
      m.avatarAccessories = {
        pin: "pin_clover_mini",
        hat: "hat_straw",
        outfit: "outfit_strawberry_milk_pajama",
        shoes: "shoes_rabbit_slippers",
        pet: "pet_bunny"
      };
      const inv = new Set([
        ...(m.inventoryAccessories || []),
        "pin_clover_mini", "hat_straw", "outfit_strawberry_milk_pajama", "shoes_rabbit_slippers", "pet_bunny"
      ]);
      m.inventoryAccessories = Array.from(inv);
      changed = true;
    }
  }

  return changed;
}

// In-memory / JSON Database helper
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const db = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
      if (ensureUserIntegrity(db)) {
        saveDB(db);
      }
      return db;
    }
  } catch (e) {
    console.error("DB Load Error:", e);
  }
  return { users: {}, tokens: {} };
}

function saveDB(db) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
  } catch (e) {
    console.error("DB Save Error:", e);
  }
}

// Access Logs helper (Max 1,000 entries rotation)
function loadLogs() {
  try {
    if (fs.existsSync(LOGS_FILE)) {
      return JSON.parse(fs.readFileSync(LOGS_FILE, "utf8"));
    }
  } catch (e) {
    console.error("Logs Load Error:", e);
  }
  return [];
}

function saveLogs(logs) {
  try {
    const trimmed = logs.slice(-1000);
    fs.writeFileSync(LOGS_FILE, JSON.stringify(trimmed, null, 2), "utf8");
  } catch (e) {
    console.error("Logs Save Error:", e);
  }
}

// User-to-User Messages helper (Max 1,000 entries rotation)
function loadMessages() {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      return JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf8"));
    }
  } catch (e) {
    console.error("Messages Load Error:", e);
  }
  return [];
}

function saveMessages(messages) {
  try {
    const trimmed = (messages || []).slice(-1000);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(trimmed, null, 2), "utf8");
  } catch (e) {
    console.error("Messages Save Error:", e);
  }
}

// 🎁 v3.3.0 & v3.4.0 Interactive Gift Catalog (Items & Korean Brand Parody Social Gifts)
const GIFT_CATALOG = {
  // 1. 인게임 필수 퀴즈 아이템 선물 (7종)
  gift_heart: { id: "gift_heart", name: "하트수호", icon: "💖", price: 100, itemKey: "heart", itemQty: 1, type: "item", category: "game", desc: "오답 시 소중한 하트를 지켜주는 수호석" },
  gift_eraser5050: { id: "gift_eraser5050", name: "50:50 요술봉", icon: "🪄", price: 150, itemKey: "eraser5050", itemQty: 1, type: "item", category: "game", desc: "오답 보기 2개를 뿅! 지워주는 요술봉" },
  gift_booster2x: { id: "gift_booster2x", name: "2배 로켓", icon: "🚀", price: 200, itemKey: "booster2x", itemQty: 1, type: "item", category: "game", desc: "이번 라운드 획득 포인트를 2배로 쑥쑥!" },
  gift_shield: { id: "gift_shield", name: "황금 방패", icon: "🛡️", price: 300, itemKey: "shield", itemQty: 1, type: "shield", category: "game", desc: "틀려도 연속 만점 스트릭을 안전하게 보호" },
  gift_clover: { id: "gift_clover", name: "클로버 패스", icon: "🍀", price: 250, itemKey: "clover", itemQty: 1, type: "item", category: "game", desc: "어려운 문제를 즉시 통과시켜 주는 패스권" },
  gift_timemachine: { id: "gift_timemachine", name: "타임머신 시계", icon: "⏳", price: 180, itemKey: "timemachine", itemQty: 1, type: "item", category: "game", desc: "고민할 시간을 넉넉하게 연장해주는 시계" },
  gift_magnet: { id: "gift_magnet", name: "정답 자석", icon: "🧲", price: 120, itemKey: "magnet", itemQty: 1, type: "item", category: "game", desc: "정답 보기를 자석처럼 강력하게 끌어당김" },
  
  // 2. 한국 주요 브랜드 패러디 선물: [☕ 카페 & 디저트]
  gift_twosome_cake: { id: "gift_twosome_cake", name: "투쌈플레이스 스초생", icon: "🍰", price: 90, bonusPoints: 45, type: "social", category: "cafe", desc: "초코볼이 톡톡 터지는 투쌈의 시그니처 케이크" },
  gift_starbox_americano: { id: "gift_starbox_americano", name: "스타밥스 별다방 아이스 아메리카노", icon: "☕", price: 50, bonusPoints: 25, type: "social", category: "cafe", desc: "출근·등교길 필수! 시원한 벤티 사이즈 아아" },
  gift_starbox_latte: { id: "gift_starbox_latte", name: "스타밥스 달콤 돌체라떼", icon: "🥛", price: 65, bonusPoints: 32, type: "social", category: "cafe", desc: "달콤하고 부드러운 전설의 돌체라떼" },
  gift_baskin_half: { id: "gift_baskin_half", name: "배씨네라빈스 하프갤런 6가지맛", icon: "🍨", price: 120, bonusPoints: 60, type: "social", category: "cafe", desc: "민초단도 인정하는 6가지맛 골라담기 대용량 아이스크림" },
  gift_paris_croissant: { id: "gift_paris_croissant", name: "파리바게뜨 촉촉 버터크루아상", icon: "🥐", price: 45, bonusPoints: 22, type: "social", category: "cafe", desc: "프랑스 파리의 풍미가 가득 바삭촉촉 크루아상" },
  gift_mega_coffee: { id: "gift_mega_coffee", name: "메가커퓌 1리터 퐁크러쉬", icon: "🥤", price: 40, bonusPoints: 20, type: "social", category: "cafe", desc: "죠리퐁이 가득 올라간 압도적 가성비 대용량 음료" },
  gift_gongcha_bubble: { id: "gift_gongcha_bubble", name: "공차기 타피오카 펄 밀크티", icon: "🧋", price: 55, bonusPoints: 27, type: "social", category: "cafe", desc: "당도 50% 얼음 보통! 쫀득쫀득 펄 추가 밀크티" },
  gift_sulbing_bingsu: { id: "gift_sulbing_bingsu", name: "설빙수 인절미 콩고물 눈꽃빙수", icon: "🍧", price: 85, bonusPoints: 42, type: "social", category: "cafe", desc: "고소한 콩가루와 쫄깃한 인절미가 듬뿍 올라간 눈꽃빙수" },

  // 3. 한국 주요 브랜드 패러디 선물: [🍗 치킨 & 버거 & 피자]
  gift_kyochon_combo: { id: "gift_kyochon_combo", name: "고촌치킨 단짠 허니콤보", icon: "🍗", price: 150, bonusPoints: 75, type: "social", category: "food", desc: "바삭한 튀김옷에 달콤 짭조름한 꿀간장 치킨" },
  gift_bbq_golden: { id: "gift_bbq_golden", name: "비비큐 황금올리브 닭다리", icon: "🍗", price: 160, bonusPoints: 80, type: "social", category: "food", desc: "황금 올리브유로 바삭하게 튀겨낸 육즙 가득 치킨" },
  gift_bhc_purinkle: { id: "gift_bhc_purinkle", name: "비에이치씨 뿌링클 치즈볼 세트", icon: "🧀", price: 140, bonusPoints: 70, type: "social", category: "food", desc: "마법의 치즈 가루 듬뿍 뿌린 치킨과 쫀득 치즈볼" },
  gift_moms_psy: { id: "gift_moms_psy", name: "맘스손길 싸이버거 단품", icon: "🍔", price: 60, bonusPoints: 30, type: "social", category: "food", desc: "두툼한 통다리살 패티가 꽉 찬 가성비 최강 버거" },
  gift_mc_bigmac: { id: "gift_mc_bigmac", name: "맥날드 빅맥 세트", icon: "🍟", price: 75, bonusPoints: 37, type: "social", category: "food", desc: "참깨빵 위에 순쇠고기 패티 두 장 특별한 소스" },
  gift_domino_pizza: { id: "gift_domino_pizza", name: "도미노피자 포테이토 마요 치즈피자", icon: "🍕", price: 180, bonusPoints: 90, type: "social", category: "food", desc: "담백한 감자와 마요네즈가 어우러진 국민 피자" },

  // 4. 한국 주요 브랜드 패러디 선물: [🎁 편의점 & 뷰티 & 쇼핑]
  gift_baemin_voucher: { id: "gift_baemin_voucher", name: "배달의민지 2만원 상품권", icon: "🛵", price: 200, bonusPoints: 100, type: "social", category: "store", desc: "오늘 밤 야식은 내가 쏜다! 배달의민지 상품권" },
  gift_oliveyoung_card: { id: "gift_oliveyoung_card", name: "올리브형 꿀피부 뷰티 상품권", icon: "💄", price: 150, bonusPoints: 75, type: "social", category: "store", desc: "올영세일 필수템 쟁여두는 꿀피부 전용 상품권" },
  gift_cu_voucher: { id: "gift_cu_voucher", name: "씨유어게인 편의점 1만원권", icon: "🏪", price: 100, bonusPoints: 50, type: "social", category: "store", desc: "삼각김밥부터 컵라면까지 편의점 털기 전용권" },
  gift_gs25_voucher: { id: "gift_gs25_voucher", name: "지에스이십오 혜자도시락 교환권", icon: "🍱", price: 70, bonusPoints: 35, type: "social", category: "store", desc: "혜자로운 구성의 인기 편의점 든든한 도시락 교환권" },
  gift_shinsegae_card: { id: "gift_shinsegae_card", name: "신세계로 백화점 5만원 상품권", icon: "🏬", price: 350, bonusPoints: 175, type: "social", category: "store", desc: "명품 쇼핑의 품격! 신세계로 백화점 플렉스 상품권" },
  gift_gold_bar: { id: "gift_gold_bar", name: "순금 하루 골드바 1돈", icon: "🪙", price: 500, bonusPoints: 250, type: "social", category: "store", desc: "진정한 맞춤법 최고수에게 바치는 99.9% 순금 골드바" },

  // 5. 클래식 감성 선물 (5종)
  gift_cake: { id: "gift_cake", name: "딸기 생크림 케이크", icon: "🍰", price: 80, bonusPoints: 40, type: "social", category: "classic", desc: "달콤하고 부드러운 딸기 축하 케이크" },
  gift_bouquet: { id: "gift_bouquet", name: "향기로운 튤립 꽃다발", icon: "💐", price: 100, bonusPoints: 50, type: "social", category: "classic", desc: "응원과 감사의 마음을 담은 화사한 꽃다발" },
  gift_chocolate: { id: "gift_chocolate", name: "응원 수제 초콜릿 세트", icon: "🍫", price: 40, bonusPoints: 20, type: "social", category: "classic", desc: "두뇌 회전 팡팡! 당충전 특급 수제 초콜릿" },
  gift_diamond: { id: "gift_diamond", name: "영롱한 핑크 다이아몬드", icon: "💎", price: 300, bonusPoints: 150, type: "social", category: "classic", desc: "변치 않는 반짝이는 우정의 상징 보석" },
  gift_clover_lucky: { id: "gift_clover_lucky", name: "행운의 황금 네잎클로버", icon: "✨", price: 150, bonusPoints: 75, type: "social", category: "classic", desc: "오늘 시험과 일상에 대박 행운이 깃들길!" }
};

function getChatRoomId(userA, userB) {
  if (!userA || !userB) return "square";
  if (userA === "square" || userB === "square" || userA === "ALL" || userB === "ALL") return "square";
  return [userA, userB].sort().join("_");
}

// 24-Hour (1-Day) Photo Expiry & Automatic Deletion Engine
function cleanupExpiredPhotos() {
  try {
    const now = Date.now();
    // 1. Scan filesystem for expired photo files (> 24 hours)
    if (fs.existsSync(PHOTOS_DIR)) {
      const files = fs.readdirSync(PHOTOS_DIR);
      for (const file of files) {
        const filePath = path.join(PHOTOS_DIR, file);
        try {
          const stat = fs.statSync(filePath);
          if (now - stat.mtimeMs >= PHOTO_TTL_MS) {
            fs.unlinkSync(filePath);
            console.log(`[Photo Cleanup] 24-hour expired photo removed from disk: ${file}`);
          }
        } catch (fileErr) {
          // File may have been removed concurrently
        }
      }
    }

    // 2. Scan messages.json and mark expired photos
    const messages = loadMessages();
    let updated = false;
    for (const msg of messages) {
      if (msg.photoUrl && !msg.photoExpired) {
        const fileName = path.basename(msg.photoUrl);
        const filePath = path.join(PHOTOS_DIR, fileName);
        const fileExists = fs.existsSync(filePath);

        const expiresAt = msg.photoExpiresAt ? new Date(msg.photoExpiresAt).getTime() : 0;
        const sentAt = msg.timestamp ? new Date(msg.timestamp).getTime() : 0;
        const isTimeExpired = (expiresAt > 0 && now >= expiresAt) || (sentAt > 0 && (now - sentAt >= PHOTO_TTL_MS));

        if (!fileExists || isTimeExpired) {
          if (fileExists && isTimeExpired) {
            try { fs.unlinkSync(filePath); } catch (e) {}
          }
          msg.photoUrl = null;
          msg.photoExpired = true;
          updated = true;
        }
      }
    }
    if (updated) {
      saveMessages(messages);
    }
  } catch (err) {
    console.error("[Photo Cleanup Error]", err);
  }
}

function getKSTTime() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const kst = new Date(utc + (9 * 60 * 60000));
  return kst.toISOString().replace(/T/, " ").replace(/\..+/, "");
}

function getKSTDateString(dateObj = new Date()) {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(dateObj);
  } catch (e) {
    const now = dateObj || new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const kst = new Date(utc + (9 * 60 * 60000));
    return kst.toISOString().split("T")[0];
  }
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket ? (req.socket.remoteAddress || "").replace(/^.*:/, "") : "-";
}

function recordAccessLog(username, action, ip, userAgent, details = {}) {
  const logs = loadLogs();
  const entry = {
    id: "log_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    timestamp: new Date().toISOString(),
    kstTime: getKSTTime(),
    username: username || "게스트",
    action: action, // LOGIN_SUCCESS, LOGIN_FAIL, REGISTER, ROUND_CLEAR, DATA_SYNC
    ip: ip || "-",
    userAgent: (userAgent || "-").substring(0, 200),
    details: details
  };
  logs.push(entry);
  saveLogs(logs);
  return entry;
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(password + "haru_salt_2026").digest("hex");
}

function generateToken() {
  return crypto.randomBytes(24).toString("hex");
}

// Push Subscriptions DB Helpers
function getPushSubscriptions() {
  if (!fs.existsSync(PUSH_SUBS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(PUSH_SUBS_FILE, "utf8")) || [];
  } catch (e) {
    return [];
  }
}

function savePushSubscriptions(subs) {
  try {
    fs.writeFileSync(PUSH_SUBS_FILE, JSON.stringify(subs, null, 2), "utf8");
  } catch (e) {
    console.error("[Web Push] Failed to save push subscriptions:", e);
  }
}

async function sendWebPushToUsers(usernames, payload) {
  if (!webpush || !vapidKeys) return 0;
  const subs = getPushSubscriptions();
  if (subs.length === 0) return 0;

  const targetSubs = subs.filter(s => usernames.includes(s.username));
  if (targetSubs.length === 0) return 0;

  const payloadStr = typeof payload === "string" ? payload : JSON.stringify(payload);
  const deadEndpoints = new Set();
  let sentCount = 0;

  await Promise.allSettled(targetSubs.map(async (entry) => {
    try {
      await webpush.sendNotification(entry.subscription, payloadStr, {
        TTL: 60 * 60 * 24 // 24 hours
      });
      sentCount++;
    } catch (err) {
      if (err.statusCode === 404 || err.statusCode === 410) {
        deadEndpoints.add(entry.subscription.endpoint);
      } else {
        console.warn(`[Web Push] Send notice for ${entry.username}:`, err.message);
      }
    }
  }));

  if (deadEndpoints.size > 0) {
    const updatedSubs = subs.filter(s => !deadEndpoints.has(s.subscription.endpoint));
    savePushSubscriptions(updatedSubs);
    console.log(`[Web Push] Cleaned up ${deadEndpoints.size} expired push subscriptions.`);
  }

  return sentCount;
}

// MIME types
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8"
};

// Request Body Parser Helper
function parseJSONBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function sendJSON(res, status, obj) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  });
  res.end(JSON.stringify(obj));
}

// Git synchronization helper
function runGit(cmd) {
  try {
    return execSync(cmd, { cwd: __dirname, encoding: "utf8", timeout: 15000 }).trim();
  } catch (e) {
    return `Error: ${e.message}`;
  }
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = parsedUrl.pathname;
  const clientIp = getClientIp(req);
  const userAgent = req.headers["user-agent"] || "-";

  // CORS Preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    });
    return res.end();
  }

  // ============================================================
  // API Routes
  // ============================================================

  // 1. 회원가입 (Register)
  if (req.method === "POST" && pathname === "/api/auth/register") {
    try {
      const { username, password, grade, avatar } = await parseJSONBody(req);
      if (!username || !password) {
        return sendJSON(res, 400, { success: false, message: "아이디와 비밀번호를 입력해 주세요." });
      }
      const trimmedUser = username.trim();
      const db = loadDB();

      if (db.users[trimmedUser]) {
        return sendJSON(res, 409, { success: false, message: "이미 사용 중인 아이디입니다." });
      }

      const todayStr = getKSTDateString();
      const newUser = {
        id: "user_" + Date.now(),
        username: trimmedUser,
        name: trimmedUser,
        passwordHash: hashPassword(password),
        grade: grade || "중학교 2학년",
        avatar: avatar || "🌸",
        streak: 1,
        totalPoints: 100,
        totalSolved: 5,
        totalCorrect: 5,
        todayScore: 100,
        maxRoundToday: 1,
        maxRoundSpelling: 1,
        maxRoundHanja: 1,
        maxRoundEnglish: 1,
        todayScoreSpelling: 100,
        todayScoreHanja: 0,
        todayScoreEnglish: 0,
        pointsSpelling: 100,
        pointsHanja: 0,
        pointsEnglish: 0,
        lastActiveDate: todayStr,
        completedDates: [todayStr],
        badges: ["starter"],
        wrongQuestions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const token = generateToken();
      db.users[trimmedUser] = newUser;
      db.tokens[token] = trimmedUser;
      saveDB(db);

      recordAccessLog(trimmedUser, "REGISTER", clientIp, userAgent, { grade: newUser.grade });

      const userSafe = { ...newUser };
      delete userSafe.passwordHash;

      return sendJSON(res, 201, { success: true, token, user: userSafe });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 2. 로그인 (Login)
  if (req.method === "POST" && pathname === "/api/auth/login") {
    try {
      const { username, password } = await parseJSONBody(req);
      if (!username || !password) {
        return sendJSON(res, 400, { success: false, message: "아이디와 비밀번호를 입력해 주세요." });
      }
      const trimmedUser = username.trim();
      const db = loadDB();
      const user = db.users[trimmedUser];

      if (!user || user.passwordHash !== hashPassword(password)) {
        recordAccessLog(trimmedUser, "LOGIN_FAIL", clientIp, userAgent, { reason: "인증 실패" });
        return sendJSON(res, 401, { success: false, message: "아이디 또는 비밀번호가 일치하지 않습니다." });
      }

      const token = generateToken();
      db.tokens[token] = trimmedUser;
      saveDB(db);

      recordAccessLog(trimmedUser, "LOGIN_SUCCESS", clientIp, userAgent, { grade: user.grade });

      const userSafe = { ...user };
      delete userSafe.passwordHash;

      return sendJSON(res, 200, { success: true, token, user: userSafe });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 3. 내 정보 조회 (Profile by Token)
  if (req.method === "GET" && pathname === "/api/user/profile") {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.replace(/^Bearer\s+/, "") || parsedUrl.searchParams.get("token");
    const db = loadDB();
    const username = db.tokens[token];

    if (!username || !db.users[username]) {
      return sendJSON(res, 401, { success: false, message: "유효하지 않은 토큰입니다." });
    }

    const userSafe = { ...db.users[username] };
    delete userSafe.passwordHash;
    return sendJSON(res, 200, { success: true, user: userSafe });
  }

  // 4. 데이터 실시간 동기화 (Sync User Data from PC/Mobile)
  if (req.method === "POST" && pathname === "/api/user/sync") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const target = db.users[username];
      const uData = body.userData || body || {};

      // Merge and update stats (allow point deduction for shop purchases)
      if (typeof uData.streak === "number") target.streak = Math.max(target.streak, uData.streak);
      if (typeof uData.totalPoints === "number") target.totalPoints = uData.totalPoints;
      if (typeof uData.totalSolved === "number") target.totalSolved = Math.max(target.totalSolved, uData.totalSolved);
      if (typeof uData.totalCorrect === "number") target.totalCorrect = Math.max(target.totalCorrect, uData.totalCorrect);
      if (typeof uData.todayScore === "number") target.todayScore = uData.todayScore;
      if (typeof uData.maxRoundToday === "number") target.maxRoundToday = Math.max(target.maxRoundToday || 1, uData.maxRoundToday);
      if (uData.grade) target.grade = uData.grade;
      if (uData.avatar) target.avatar = uData.avatar;
      if (uData.name) target.name = uData.name;

      // Shop Inventory & Layered Avatar Accessories Sync (Anti-Wipe Protected)
      if (uData.items && typeof uData.items === "object") target.items = { ...(target.items || {}), ...uData.items };
      if (typeof uData.shields === "number") target.shields = Math.min(2, Math.max(0, uData.shields));
      if (uData.avatarAccessories && typeof uData.avatarAccessories === "object") {
        const incomingAcc = uData.avatarAccessories;
        const hasIncomingValues = Object.values(incomingAcc).some(v => v !== null && v !== undefined && v !== 'eyes');
        const existingAcc = (target.avatarAccessories && typeof target.avatarAccessories === "object") ? target.avatarAccessories : {};
        const hasExistingValues = Object.values(existingAcc).some(v => v !== null && v !== undefined && v !== 'eyes');

        if (hasIncomingValues) {
          target.avatarAccessories = incomingAcc;
        } else if (!hasIncomingValues && hasExistingValues) {
          // Keep existing accessories if incoming payload is uninitialized
        } else {
          target.avatarAccessories = incomingAcc;
        }
      }
      if (Array.isArray(uData.inventoryAccessories)) {
        const accSet = new Set([...(target.inventoryAccessories || []), ...uData.inventoryAccessories]);
        target.inventoryAccessories = Array.from(accSet);
      }

      // Subject-specific sync (Spelling vs Hanja vs English)
      const mode = body.mode || (body.details && body.details.mode) || uData.mode || "spelling";
      const roundVal = typeof body.round === "number" ? body.round : (body.details && typeof body.details.round === "number" ? body.details.round : (typeof uData.maxRoundToday === "number" ? uData.maxRoundToday : null));
      const scoreVal = typeof body.todayScore === "number" ? body.todayScore : (body.details && typeof body.details.score === "number" ? body.details.score : (typeof uData.todayScore === "number" ? uData.todayScore : null));
      const pointsVal = typeof body.pointsEarned === "number" ? body.pointsEarned : (body.details && typeof body.details.pointsEarned === "number" ? body.details.pointsEarned : 0);

      if (mode === "idiom") {
        if (roundVal !== null) target.maxRoundIdiom = Math.max(target.maxRoundIdiom || 1, roundVal);
        if (scoreVal !== null) target.todayScoreIdiom = Math.max(target.todayScoreIdiom || 0, scoreVal);
        if (pointsVal > 0) target.pointsIdiom = (target.pointsIdiom || 0) + pointsVal;
      } else if (mode === "hanja") {
        if (roundVal !== null) target.maxRoundHanja = Math.max(target.maxRoundHanja || 1, roundVal);
        if (scoreVal !== null) target.todayScoreHanja = Math.max(target.todayScoreHanja || 0, scoreVal);
        if (pointsVal > 0) target.pointsHanja = (target.pointsHanja || 0) + pointsVal;
      } else if (mode === "english") {
        if (roundVal !== null) target.maxRoundEnglish = Math.max(target.maxRoundEnglish || 1, roundVal);
        if (scoreVal !== null) target.todayScoreEnglish = Math.max(target.todayScoreEnglish || 0, scoreVal);
        if (pointsVal > 0) target.pointsEnglish = (target.pointsEnglish || 0) + pointsVal;
      } else {
        if (roundVal !== null) target.maxRoundSpelling = Math.max(target.maxRoundSpelling || 1, roundVal);
        if (scoreVal !== null) target.todayScoreSpelling = Math.max(target.todayScoreSpelling || 0, scoreVal);
        if (pointsVal > 0) target.pointsSpelling = (target.pointsSpelling || 0) + pointsVal;
      }

      // Merge completedDates array uniquely
      if (Array.isArray(uData.completedDates)) {
        const dateSet = new Set([...(target.completedDates || []), ...uData.completedDates]);
        target.completedDates = Array.from(dateSet);
      }

      // Merge badges
      if (Array.isArray(uData.badges)) {
        const badgeSet = new Set([...(target.badges || []), ...uData.badges]);
        target.badges = Array.from(badgeSet);
      }

      // Update wrong questions
      if (Array.isArray(uData.wrongQuestions)) {
        target.wrongQuestions = uData.wrongQuestions;
      }

      // Merge solved question IDs (subject-specific map: spelling, idiom, hanja, english)
      if (uData.solvedQuestionMap && typeof uData.solvedQuestionMap === "object") {
        target.solvedQuestionMap = target.solvedQuestionMap || {};
        for (const sub of ["spelling", "idiom", "hanja", "english"]) {
          const existing = new Set(target.solvedQuestionMap[sub] || []);
          const incoming = uData.solvedQuestionMap[sub] || [];
          if (Array.isArray(incoming)) {
            incoming.forEach(id => existing.add(id));
          }
          target.solvedQuestionMap[sub] = Array.from(existing);
        }
      }

      target.updatedAt = new Date().toISOString();
      saveDB(db);

      // Record special action (e.g. ROUND_CLEAR) or general sync
      if (body.action === "ROUND_CLEAR") {
        recordAccessLog(username, "ROUND_CLEAR", clientIp, userAgent, body.details || {});
      }

      const userSafe = { ...target };
      delete userSafe.passwordHash;

      return sendJSON(res, 200, { success: true, user: userSafe });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 5. 전체 회원 실시간 랭킹 (Leaderboard: Dual Subject & Highest Round)
  if (req.method === "GET" && pathname === "/api/leaderboard") {
    const mode = parsedUrl.searchParams.get("mode") || "all"; // spelling | hanja | all
    const type = parsedUrl.searchParams.get("type") || "daily"; // round | daily | total

    const db = loadDB();
    const list = Object.values(db.users).map(u => ({
      id: u.id,
      username: u.username || u.name,
      name: u.name || u.username,
      avatar: u.avatar || "🌸",
      avatarAccessories: (u.avatarAccessories && typeof u.avatarAccessories === 'object') ? u.avatarAccessories : {},
      grade: u.grade || "중학교 2학년",
      streak: u.streak || 1,
      totalPoints: u.totalPoints || 0,
      todayScore: u.todayScore || 0,
      maxRoundToday: u.maxRoundToday || 1,
      maxRoundSpelling: u.maxRoundSpelling || (u.maxRoundToday || 1),
      maxRoundIdiom: u.maxRoundIdiom || 1,
      maxRoundHanja: u.maxRoundHanja || 1,
      maxRoundEnglish: u.maxRoundEnglish || 1,
      todayScoreSpelling: u.todayScoreSpelling || (u.todayScore || 0),
      todayScoreIdiom: u.todayScoreIdiom || 0,
      todayScoreHanja: u.todayScoreHanja || 0,
      todayScoreEnglish: u.todayScoreEnglish || 0,
      pointsSpelling: u.pointsSpelling !== undefined ? u.pointsSpelling : (u.totalPoints || 0),
      pointsIdiom: u.pointsIdiom !== undefined ? u.pointsIdiom : 0,
      pointsHanja: u.pointsHanja !== undefined ? u.pointsHanja : 0,
      pointsEnglish: u.pointsEnglish !== undefined ? u.pointsEnglish : 0
    }));

    if (type === "round") {
      if (mode === "idiom") {
        list.sort((a, b) => (b.maxRoundIdiom - a.maxRoundIdiom) || (b.pointsIdiom - a.pointsIdiom) || (b.totalPoints - a.totalPoints));
      } else if (mode === "hanja") {
        list.sort((a, b) => (b.maxRoundHanja - a.maxRoundHanja) || (b.pointsHanja - a.pointsHanja) || (b.totalPoints - a.totalPoints));
      } else if (mode === "english") {
        list.sort((a, b) => (b.maxRoundEnglish - a.maxRoundEnglish) || (b.pointsEnglish - a.pointsEnglish) || (b.totalPoints - a.totalPoints));
      } else {
        list.sort((a, b) => (b.maxRoundSpelling - a.maxRoundSpelling) || (b.pointsSpelling - a.pointsSpelling) || (b.totalPoints - a.totalPoints));
      }
    } else if (type === "total") {
      if (mode === "idiom") {
        list.sort((a, b) => (b.pointsIdiom - a.pointsIdiom) || (b.totalPoints - a.totalPoints));
      } else if (mode === "hanja") {
        list.sort((a, b) => (b.pointsHanja - a.pointsHanja) || (b.totalPoints - a.totalPoints));
      } else if (mode === "english") {
        list.sort((a, b) => (b.pointsEnglish - a.pointsEnglish) || (b.totalPoints - a.totalPoints));
      } else if (mode === "spelling") {
        list.sort((a, b) => (b.pointsSpelling - a.pointsSpelling) || (b.totalPoints - a.totalPoints));
      } else {
        list.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
      }
    } else {
      // type === "daily"
      if (mode === "idiom") {
        list.sort((a, b) => (b.todayScoreIdiom - a.todayScoreIdiom) || (b.pointsIdiom - a.pointsIdiom));
      } else if (mode === "hanja") {
        list.sort((a, b) => (b.todayScoreHanja - a.todayScoreHanja) || (b.pointsHanja - a.pointsHanja));
      } else if (mode === "english") {
        list.sort((a, b) => (b.todayScoreEnglish - a.todayScoreEnglish) || (b.pointsEnglish - a.pointsEnglish));
      } else if (mode === "spelling") {
        list.sort((a, b) => (b.todayScoreSpelling - a.todayScoreSpelling) || (b.pointsSpelling - a.pointsSpelling));
      } else {
        list.sort((a, b) => (b.todayScore || 0) - (a.todayScore || 0));
      }
    }

    return sendJSON(res, 200, { success: true, mode, type, leaderboard: list });
  }

  // 6. 사용자 접속/이용 이력 조회 (User Access Logs)
  if (req.method === "GET" && pathname === "/api/user/logs") {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.replace(/^Bearer\s+/, "") || parsedUrl.searchParams.get("token");
    const db = loadDB();
    const username = db.tokens[token];

    if (!username || !db.users[username]) {
      return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
    }

    const logs = loadLogs();
    const userLogs = logs.filter(l => l.username === username).slice(-30).reverse();
    return sendJSON(res, 200, { success: true, logs: userLogs });
  }

  // 7. 관리자 전체 접속 감사 로그 조회 (Admin Audit Logs - Only '단민러브')
  if (req.method === "GET" && pathname === "/api/admin/logs") {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.replace(/^Bearer\s+/, "") || parsedUrl.searchParams.get("token");
    const db = loadDB();
    const username = db.tokens[token];

    if (!username || username !== "단민러브") {
      return sendJSON(res, 403, { success: false, message: "관리자('단민러브') 권한이 필요합니다." });
    }

    const logs = loadLogs();
    return sendJSON(res, 200, { success: true, logs: logs.slice(-1000).reverse() });
  }

  // 8. 깃허브 자동 동기화 (Git Push/Pull Status)
  if (pathname === "/api/git/sync" && req.method === "POST") {
    try {
      const pullRes = runGit("git pull --rebase origin main");
      const addRes = runGit("git add .");
      const commitRes = runGit('git commit -m "auto: synology app update & data sync" || true');
      const pushRes = runGit("git push origin main || true");
      return sendJSON(res, 200, {
        success: true,
        message: "Git 동기화가 성공적으로 완료되었습니다.",
        details: { pullRes, addRes, commitRes, pushRes }
      });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 9. 앱 버전 확인 및 모바일 자동 업데이트 엔드포인트 (Mobile Auto-Update & Version Check)
  if (pathname === "/api/version" && req.method === "GET") {
    let verData = { version: "3.4.4", build: "20261116_2010" };
    try {
      const vFile = path.join(__dirname, "version.json");
      if (fs.existsSync(vFile)) {
        verData = JSON.parse(fs.readFileSync(vFile, "utf8"));
      }
    } catch (e) {}

    // Attach git commit hash if available
    try {
      const commit = execSync("git rev-parse --short HEAD", { cwd: __dirname, timeout: 1000, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
      if (commit) verData.commit = commit;
    } catch (e) {}

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    return sendJSON(res, 200, {
      success: true,
      ...verData,
      serverTime: new Date().toISOString()
    });
  }

  // 10-1. 메시지 첨부 사진 업로드 (Upload Photo for Message - 24h Auto-Deletion Policy)
  if (req.method === "POST" && pathname === "/api/messages/upload-photo") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const rawBase64 = body.imageBase64 || "";
      if (!rawBase64) {
        return sendJSON(res, 400, { success: false, message: "업로드할 사진 데이터가 없습니다." });
      }

      let mimeMatch = rawBase64.match(/^data:(image\/(jpeg|png|webp|gif));base64,/i);
      let ext = "jpg";
      let base64Data = rawBase64;
      if (mimeMatch) {
        base64Data = rawBase64.replace(/^data:image\/\w+;base64,/, "");
        const mimeType = mimeMatch[1].toLowerCase();
        if (mimeType === "image/png") ext = "png";
        else if (mimeType === "image/webp") ext = "webp";
        else if (mimeType === "image/gif") ext = "gif";
        else ext = "jpg";
      }

      const buffer = Buffer.from(base64Data, "base64");
      if (buffer.length > 5 * 1024 * 1024) {
        return sendJSON(res, 400, { success: false, message: "사진 용량은 최대 5MB까지 가능합니다." });
      }

      const now = Date.now();
      const safeFileName = `photo_${now}_${crypto.randomBytes(6).toString("hex")}.${ext}`;
      const savedPath = path.join(PHOTOS_DIR, safeFileName);
      fs.writeFileSync(savedPath, buffer);

      const expiresAt = new Date(now + PHOTO_TTL_MS).toISOString();
      const photoUrl = `/api/uploads/photos/${safeFileName}`;

      recordAccessLog(username, "UPLOAD_PHOTO", clientIp, userAgent, { fileName: safeFileName, size: buffer.length });

      return sendJSON(res, 201, {
        success: true,
        photoUrl: photoUrl,
        expiresAt: expiresAt,
        fileName: safeFileName
      });
    } catch (e) {
      console.error("Upload photo error:", e);
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 10-2. 실시간 사진 파일 서빙 및 24시간 만료 자동 삭제 (Serve Uploaded Photos & 24h Expiry Enforcement)
  if (req.method === "GET" && pathname.startsWith("/api/uploads/photos/")) {
    const fileName = path.basename(pathname);
    // Security check: only allow safe photo pattern
    if (!/^photo_\d+_[a-f0-9]+\.(jpg|jpeg|png|webp|gif)$/i.test(fileName)) {
      return sendJSON(res, 400, { success: false, message: "잘못된 파일 요청입니다." });
    }

    const targetPhotoPath = path.join(PHOTOS_DIR, fileName);
    if (!fs.existsSync(targetPhotoPath)) {
      return sendJSON(res, 404, {
        success: false,
        expired: true,
        message: "사진을 찾을 수 없거나 보안 정책(24시간)에 따라 자동 삭제되었습니다."
      });
    }

    try {
      const stat = fs.statSync(targetPhotoPath);
      const now = Date.now();
      if (now - stat.mtimeMs >= PHOTO_TTL_MS) {
        // Expired! Delete from disk immediately
        try { fs.unlinkSync(targetPhotoPath); } catch (e) {}
        return sendJSON(res, 410, {
          success: false,
          expired: true,
          message: "보안 정책에 따라 24시간이 경과하여 자동 삭제된 사진입니다."
        });
      }

      const ext = path.extname(fileName).toLowerCase();
      let cType = "image/jpeg";
      if (ext === ".png") cType = "image/png";
      else if (ext === ".webp") cType = "image/webp";
      else if (ext === ".gif") cType = "image/gif";

      res.writeHead(200, {
        "Content-Type": cType,
        "Content-Length": stat.size,
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*"
      });
      fs.createReadStream(targetPhotoPath).pipe(res);
      return;
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 10. 실시간 메시지 전송 (Send Message to One or Multiple Users with Photo Support)
  if (req.method === "POST" && pathname === "/api/messages/send") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const sender = db.users[username];
      const rawContent = (body.content || "").trim();
      const photoUrl = (body.photoUrl || "").trim();
      const photoExpiresAt = body.photoExpiresAt || (photoUrl ? new Date(Date.now() + PHOTO_TTL_MS).toISOString() : null);

      if (!rawContent && !photoUrl) {
        return sendJSON(res, 400, { success: false, message: "메시지 내용이나 사진을 입력해 주세요." });
      }
      if (rawContent.length > 200) {
        return sendJSON(res, 400, { success: false, message: "메시지는 최대 200자까지 작성할 수 있습니다." });
      }

      // Collect target recipients (support Array `recipients` or single target `toName`/`toUsername`)
      let rawRecipients = [];
      if (Array.isArray(body.recipients) && body.recipients.length > 0) {
        rawRecipients = body.recipients;
      } else {
        const singleTarget = (body.toName || body.toUsername || "").trim();
        if (singleTarget) {
          rawRecipients = [{ toName: singleTarget, toUsername: singleTarget, toId: body.toId || "" }];
        }
      }

      if (rawRecipients.length === 0) {
        return sendJSON(res, 400, { success: false, message: "받는 사람을 1명 이상 지정해 주세요." });
      }

      // Resolve each recipient against DB and deduplicate
      const resolvedRecipients = [];
      const seenUsernames = new Set();

      for (const item of rawRecipients) {
        const toTarget = (typeof item === 'string' ? item : (item.toUsername || item.toName || item.name || item.username || "")).trim();
        const toId = (typeof item === 'object' && item.toId) ? item.toId.trim() : "";
        if (!toTarget) continue;

        let recipient = db.users[toTarget];
        if (!recipient) {
          recipient = Object.values(db.users).find(u => 
            (toId && u.id === toId) ||
            (u.name && u.name.trim() === toTarget) || 
            (u.username && u.username.trim() === toTarget) ||
            (toTarget && (u.name || "").includes(toTarget))
          );
        }

        if (recipient) {
          const uKey = recipient.username || recipient.name;
          if (!seenUsernames.has(uKey)) {
            seenUsernames.add(uKey);
            resolvedRecipients.push(recipient);
          }
        }
      }

      if (resolvedRecipients.length === 0) {
        return sendJSON(res, 404, { success: false, message: "선택한 받는 사람을 찾을 수 없습니다." });
      }

      const safeContent = rawContent
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      const messages = loadMessages();
      const createdEntries = [];
      const nowIso = new Date().toISOString();
      const nowKst = getKSTTime();

      for (const recipient of resolvedRecipients) {
        const toUserKey = recipient.username || recipient.name;
        const msgEntry = {
          id: "msg_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
          roomId: body.roomId || getChatRoomId(username, toUserKey),
          fromUsername: username,
          fromName: sender.name || username,
          fromAvatar: sender.avatar || "🌸",
          fromAccessories: sender.avatarAccessories || {},
          toUsername: toUserKey,
          toName: recipient.name || recipient.username,
          toAvatar: recipient.avatar || "🌸",
          toAccessories: recipient.avatarAccessories || {},
          type: body.type || (body.gift ? "gift" : (body.sticker ? "sticker" : (photoUrl ? "photo" : "text"))),
          content: safeContent,
          emojiTag: body.emojiTag || null,
          photoUrl: photoUrl || null,
          photoExpiresAt: photoExpiresAt || null,
          photoExpired: false,
          sticker: body.sticker || null,
          gift: body.gift || null,
          timestamp: nowIso,
          kstTime: nowKst,
          read: false,
          readBy: [username]
        };
        messages.push(msgEntry);
        createdEntries.push(msgEntry);
      }

      saveMessages(messages);

      recordAccessLog(username, "SEND_MESSAGE", clientIp, userAgent, {
        recipientCount: resolvedRecipients.length,
        recipients: resolvedRecipients.map(r => r.username || r.name),
        hasPhoto: !!photoUrl
      });

      // Web Push Background Notification Trigger (v2.9.14)
      try {
        const targetUsernames = resolvedRecipients.map(r => r.username || r.name);
        const pushTitle = `💌 ${sender.name || username}님의 새 메시지 도착!`;
        const pushBody = photoUrl 
          ? (rawContent ? `📷 [사진] ${rawContent}` : "📷 새로운 사진이 도착했습니다! (24시간 내 확인)")
          : (rawContent || "새로운 응원 메시지가 도착했습니다!");
        
        sendWebPushToUsers(targetUsernames, {
          title: pushTitle,
          body: pushBody,
          icon: "/public/icons/icon-192.png",
          badge: "/public/icons/badge-72.png",
          url: "/?open=inbox",
          tag: "haru-message-" + Date.now(),
          data: {
            fromUsername: username,
            fromName: sender.name || username,
            hasPhoto: !!photoUrl,
            timestamp: nowIso
          }
        }).catch(err => console.warn("[Web Push] Async push dispatch error:", err.message));
      } catch (pushErr) {
        console.warn("[Web Push] Dispatch trigger error:", pushErr.message);
      }

      return sendJSON(res, 201, {
        success: true,
        count: createdEntries.length,
        message: createdEntries[0],
        messages: createdEntries
      });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 11. 미확인 실시간 메시지 확인 (Check Unread Messages Polling with Photo Expiry Check)
  if (req.method === "GET" && pathname === "/api/messages/check") {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.replace(/^Bearer\s+/, "") || parsedUrl.searchParams.get("token");
    const db = loadDB();
    const username = db.tokens[token];

    if (!username || !db.users[username]) {
      return sendJSON(res, 200, { success: true, unreadCount: 0, messages: [] });
    }

    cleanupExpiredPhotos();

    const messages = loadMessages();
    const unread = messages.filter(m => m.toUsername === username && !m.read);
    return sendJSON(res, 200, {
      success: true,
      unreadCount: unread.length,
      messages: unread
    });
  }

  // 12. 전체 메시지 보관함 (Inbox & Sent History with Photo Expiry Check)
  if (req.method === "GET" && pathname === "/api/messages/inbox") {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.replace(/^Bearer\s+/, "") || parsedUrl.searchParams.get("token");
    const db = loadDB();
    const username = db.tokens[token];

    if (!username || !db.users[username]) {
      return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
    }

    cleanupExpiredPhotos();

    const messages = loadMessages();
    const myMessages = messages
      .filter(m => m.toUsername === username || m.fromUsername === username)
      .slice(-50)
      .reverse();

    return sendJSON(res, 200, {
      success: true,
      messages: myMessages
    });
  }

  // 13. 메시지 읽음 처리 (Mark Messages as Read)
  if (req.method === "POST" && pathname === "/api/messages/read") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const messageId = body.messageId;
      const markAll = body.all === true;
      const messages = loadMessages();
      let updatedCount = 0;

      messages.forEach(m => {
        if (m.toUsername === username) {
          if (markAll || m.id === messageId) {
            if (!m.read) {
              m.read = true;
              updatedCount++;
            }
          }
        }
      });

      if (updatedCount > 0) {
        saveMessages(messages);
      }

      return sendJSON(res, 200, { success: true, updatedCount });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 14. [v3.3.0] 대화방 선물 카탈로그 조회 (GET /api/chat/catalog)
  if (req.method === "GET" && pathname === "/api/chat/catalog") {
    return sendJSON(res, 200, {
      success: true,
      gifts: GIFT_CATALOG
    });
  }

  // 15. [v3.3.0] 대화방 목록 조회 (GET /api/chat/rooms)
  if (req.method === "GET" && pathname === "/api/chat/rooms") {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.replace(/^Bearer\s+/, "") || parsedUrl.searchParams.get("token");
    const db = loadDB();
    const username = db.tokens[token];

    if (!username || !db.users[username]) {
      return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
    }

    cleanupExpiredPhotos();
    const messages = loadMessages();

    // 1) 하루 광장 대화방 (전체 다자간 동시 대화방)
    const squareMessages = messages.filter(m => m.roomId === "square" || m.toUsername === "ALL" || m.toUsername === "square");
    const lastSquareMsg = squareMessages.length > 0 ? squareMessages[squareMessages.length - 1] : null;
    const unreadSquare = squareMessages.filter(m => m.fromUsername !== username && (!m.readBy || !m.readBy.includes(username))).length;

    const squareRoom = {
      roomId: "square",
      name: "하루 광장 대화방 (전체)",
      isGroup: true,
      avatar: "💬",
      memberCount: Object.keys(db.users).length,
      lastMessage: lastSquareMsg ? {
        content: lastSquareMsg.content || (lastSquareMsg.sticker ? `[스티커 ${lastSquareMsg.sticker.name || ''}]` : (lastSquareMsg.gift ? `[선물 ${lastSquareMsg.gift.name || ''}]` : (lastSquareMsg.photoUrl ? '[사진]' : ''))),
        fromName: lastSquareMsg.fromName || lastSquareMsg.fromUsername,
        timestamp: lastSquareMsg.timestamp,
        kstTime: lastSquareMsg.kstTime
      } : null,
      unreadCount: unreadSquare
    };

    // 2) 1:1 대화방 목록 (실제 활동 중인 다른 회원들과의 대화방)
    const dmRooms = [];
    for (const [uName, uData] of Object.entries(db.users)) {
      if (uName === username) continue;
      const rId = getChatRoomId(username, uName);
      const userMsgs = messages.filter(m => 
        (m.roomId === rId) || 
        (!m.roomId && ((m.fromUsername === username && m.toUsername === uName) || (m.fromUsername === uName && m.toUsername === username)))
      );
      const lastMsg = userMsgs.length > 0 ? userMsgs[userMsgs.length - 1] : null;
      const unreadCount = userMsgs.filter(m => m.toUsername === username && !m.read).length;

      dmRooms.push({
        roomId: rId,
        name: uData.name || uName,
        username: uName,
        isGroup: false,
        avatar: uData.avatar || "🌸",
        avatarAccessories: uData.avatarAccessories || {},
        grade: uData.grade || "친구",
        totalPoints: uData.totalPoints || 0,
        lastMessage: lastMsg ? {
          content: lastMsg.content || (lastMsg.sticker ? `[스티커 ${lastMsg.sticker.name || ''}]` : (lastMsg.gift ? `[선물 ${lastMsg.gift.name || ''}]` : (lastMsg.photoUrl ? '[사진]' : ''))),
          fromName: lastMsg.fromName || lastMsg.fromUsername,
          timestamp: lastMsg.timestamp,
          kstTime: lastMsg.kstTime
        } : null,
        unreadCount: unreadCount
      });
    }

    // 최근 메시지가 있는 방을 상단에 정렬
    dmRooms.sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
      const timeB = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
      return timeB - timeA;
    });

    return sendJSON(res, 200, {
      success: true,
      currentUser: {
        username: username,
        name: db.users[username].name || username,
        avatar: db.users[username].avatar || "🌸",
        avatarAccessories: db.users[username].avatarAccessories || {},
        totalPoints: db.users[username].totalPoints || 0,
        items: db.users[username].items || {},
        shields: db.users[username].shields || 0
      },
      rooms: [squareRoom, ...dmRooms]
    });
  }

  // 16. [v3.3.0] 대화방 메시지 스레드 연속 조회 (GET /api/chat/thread)
  if (req.method === "GET" && pathname === "/api/chat/thread") {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.replace(/^Bearer\s+/, "") || parsedUrl.searchParams.get("token");
    const db = loadDB();
    const username = db.tokens[token];

    if (!username || !db.users[username]) {
      return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
    }

    cleanupExpiredPhotos();
    const reqRoomId = parsedUrl.searchParams.get("roomId") || "square";
    const withUser = parsedUrl.searchParams.get("withUser");
    const sinceId = parsedUrl.searchParams.get("sinceId");
    const limit = Math.min(200, Math.max(10, parseInt(parsedUrl.searchParams.get("limit") || "100", 10)));

    const effectiveRoomId = withUser ? getChatRoomId(username, withUser) : reqRoomId;
    const messages = loadMessages();
    let thread = [];

    if (effectiveRoomId === "square") {
      thread = messages.filter(m => m.roomId === "square" || m.toUsername === "ALL" || m.toUsername === "square");
    } else {
      // 1:1 대화방
      thread = messages.filter(m => 
        (m.roomId === effectiveRoomId) || 
        (!m.roomId && withUser && ((m.fromUsername === username && m.toUsername === withUser) || (m.fromUsername === withUser && m.toUsername === username))) ||
        (!m.roomId && !withUser && effectiveRoomId.includes(m.fromUsername) && effectiveRoomId.includes(m.toUsername))
      );
    }

    if (sinceId) {
      const idx = thread.findIndex(m => m.id === sinceId);
      if (idx !== -1) {
        thread = thread.slice(idx + 1);
      }
    } else {
      thread = thread.slice(-limit);
    }

    // 읽음 상태 갱신
    let updated = false;
    for (const msg of thread) {
      if (effectiveRoomId === "square") {
        msg.readBy = msg.readBy || [];
        if (!msg.readBy.includes(username)) {
          msg.readBy.push(username);
          updated = true;
        }
      } else {
        if (msg.toUsername === username && !msg.read) {
          msg.read = true;
          updated = true;
        }
      }
    }
    if (updated) {
      saveMessages(messages);
    }

    return sendJSON(res, 200, {
      success: true,
      roomId: effectiveRoomId,
      count: thread.length,
      messages: thread
    });
  }

  // 17. [v3.3.0] 대화방 실시간 메시지 전송 (POST /api/chat/send)
  if (req.method === "POST" && pathname === "/api/chat/send") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const sender = db.users[username];
      const clientIp = getClientIp(req);
      const userAgent = req.headers["user-agent"] || "unknown";

      const targetRoomId = body.roomId || (body.toUsername ? getChatRoomId(username, body.toUsername) : "square");
      const rawContent = (body.content || "").trim();
      const photoUrl = body.photoUrl || null;
      const photoExpiresAt = body.photoExpiresAt || null;
      const sticker = body.sticker || null;
      const gift = body.gift || null;

      if (!rawContent && !photoUrl && !sticker && !gift) {
        return sendJSON(res, 400, { success: false, message: "메시지 내용, 사진, 스티커 또는 선물을 입력해 주세요." });
      }

      const safeContent = rawContent
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      const msgType = body.type || (gift ? "gift" : (sticker ? "sticker" : (photoUrl ? "photo" : "text")));
      const nowIso = new Date().toISOString();
      const nowKst = getKSTTime();

      let toUsername = targetRoomId === "square" ? "square" : (body.toUsername || "friend");
      let toName = targetRoomId === "square" ? "하루 광장" : (body.toName || toUsername);
      let toAvatar = "🌸";
      let toAccessories = {};

      if (targetRoomId !== "square" && db.users[toUsername]) {
        toName = db.users[toUsername].name || toUsername;
        toAvatar = db.users[toUsername].avatar || "🌸";
        toAccessories = db.users[toUsername].avatarAccessories || {};
      }

      const msgEntry = {
        id: "msg_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        roomId: targetRoomId,
        fromUsername: username,
        fromName: sender.name || username,
        fromAvatar: sender.avatar || "🌸",
        fromAccessories: sender.avatarAccessories || {},
        toUsername: toUsername,
        toName: toName,
        toAvatar: toAvatar,
        toAccessories: toAccessories,
        type: msgType,
        content: safeContent,
        photoUrl: photoUrl,
        photoExpiresAt: photoExpiresAt,
        photoExpired: false,
        sticker: sticker,
        gift: gift,
        timestamp: nowIso,
        kstTime: nowKst,
        read: false,
        readBy: [username]
      };

      const messages = loadMessages();
      messages.push(msgEntry);
      saveMessages(messages);

      recordAccessLog(username, "CHAT_SEND", clientIp, userAgent, {
        roomId: targetRoomId,
        type: msgType,
        hasPhoto: !!photoUrl,
        hasSticker: !!sticker,
        hasGift: !!gift
      });

      // Web Push 발송 트리거
      try {
        let pushTargets = [];
        if (targetRoomId === "square") {
          pushTargets = Object.keys(db.users).filter(u => u !== username);
        } else if (toUsername && toUsername !== "square") {
          pushTargets = [toUsername];
        }

        if (pushTargets.length > 0) {
          const pushTitle = targetRoomId === "square" 
            ? `💬 [하루 광장] ${sender.name || username}님의 새 메시지` 
            : `💌 ${sender.name || username}님의 새 메시지`;
          
          let pushBodyText = safeContent;
          if (sticker) pushBodyText = `🎀 [스티커] ${sticker.name || '귀여운 스티커'}`;
          else if (gift) pushBodyText = `🎁 [선물] ${gift.name || '특별한 선물'}`;
          else if (photoUrl) pushBodyText = `📷 [사진] ${safeContent || '새로운 사진 도착'}`;

          sendWebPushToUsers(pushTargets, {
            title: pushTitle,
            body: pushBodyText || "새로운 대화가 도착했습니다!",
            icon: "/public/icons/icon-192.png",
            badge: "/public/icons/badge-72.png",
            url: `/?open=chat&roomId=${encodeURIComponent(targetRoomId)}`,
            tag: "haru-chat-" + Date.now(),
            data: {
              roomId: targetRoomId,
              fromUsername: username,
              fromName: sender.name || username,
              type: msgType,
              timestamp: nowIso
            }
          }).catch(err => console.warn("[Web Push] Chat push error:", err.message));
        }
      } catch (pushErr) {
        console.warn("[Web Push] Chat push trigger error:", pushErr.message);
      }

      return sendJSON(res, 201, {
        success: true,
        message: msgEntry
      });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 18. [v3.3.0] 아이템 및 소셜 선물 보내기 (POST /api/chat/send-gift)
  if (req.method === "POST" && pathname === "/api/chat/send-gift") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const sender = db.users[username];
      const clientIp = getClientIp(req);
      const userAgent = req.headers["user-agent"] || "unknown";

      const giftId = body.giftId;
      const toUsername = body.toUsername;
      const customMessage = (body.message || "").trim();

      if (!giftId || !GIFT_CATALOG[giftId]) {
        return sendJSON(res, 400, { success: false, message: "올바른 선물을 선택해 주세요." });
      }

      if (!toUsername || !db.users[toUsername]) {
        return sendJSON(res, 404, { success: false, message: "선물 받을 친구를 찾을 수 없습니다." });
      }

      if (toUsername === username) {
        return sendJSON(res, 400, { success: false, message: "나 자신에게는 선물할 수 없어요! 친구에게 선물해 보세요 😊" });
      }

      const gift = GIFT_CATALOG[giftId];
      const senderPoints = sender.totalPoints || 0;

      if (senderPoints < gift.price) {
        return sendJSON(res, 400, { 
          success: false, 
          message: `보유 포인트가 부족합니다. (필요: ${gift.price}P, 보유: ${senderPoints}P)` 
        });
      }

      const recipient = db.users[toUsername];

      // 1) 발신자 포인트 차감
      sender.totalPoints -= gift.price;

      // 2) 수신자 선물/아이템 즉시 지급 트랜잭션
      if (gift.type === "item") {
        recipient.items = recipient.items || {};
        recipient.items[gift.itemKey] = (recipient.items[gift.itemKey] || 0) + (gift.itemQty || 1);
      } else if (gift.type === "shield") {
        recipient.shields = Math.min(2, Math.max(0, (recipient.shields || 0) + (gift.itemQty || 1)));
      } else if (gift.type === "social") {
        recipient.gifts = recipient.gifts || [];
        recipient.gifts.push({
          giftId: gift.id,
          name: gift.name,
          icon: gift.icon,
          fromUsername: username,
          fromName: sender.name || username,
          kstDate: getKSTDateString(),
          bonusPoints: gift.bonusPoints || 0
        });
        if (gift.bonusPoints) {
          recipient.totalPoints = (recipient.totalPoints || 0) + gift.bonusPoints;
        }
      }

      sender.updatedAt = new Date().toISOString();
      recipient.updatedAt = new Date().toISOString();
      saveDB(db);

      // 3) 채팅 메시지 스레드에 선물 카드 생성
      const roomId = getChatRoomId(username, toUsername);
      const nowIso = new Date().toISOString();
      const nowKst = getKSTTime();

      const safeContent = (customMessage || `${gift.name} 선물이 도착했습니다! ${gift.icon}`)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      const msgEntry = {
        id: "msg_gift_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        roomId: roomId,
        fromUsername: username,
        fromName: sender.name || username,
        fromAvatar: sender.avatar || "🌸",
        fromAccessories: sender.avatarAccessories || {},
        toUsername: toUsername,
        toName: recipient.name || toUsername,
        toAvatar: recipient.avatar || "🌸",
        toAccessories: recipient.avatarAccessories || {},
        type: "gift",
        content: safeContent,
        photoUrl: null,
        photoExpiresAt: null,
        photoExpired: false,
        sticker: null,
        gift: {
          giftId: gift.id,
          name: gift.name,
          icon: gift.icon,
          price: gift.price,
          type: gift.type,
          desc: gift.desc,
          bonusPoints: gift.bonusPoints || 0,
          claimed: true
        },
        timestamp: nowIso,
        kstTime: nowKst,
        read: false,
        readBy: [username]
      };

      const messages = loadMessages();
      messages.push(msgEntry);
      saveMessages(messages);

      recordAccessLog(username, "SEND_GIFT", clientIp, userAgent, {
        giftId: gift.id,
        giftName: gift.name,
        price: gift.price,
        recipient: toUsername,
        remainingPoints: sender.totalPoints
      });

      // Web Push 실시간 알림
      try {
        sendWebPushToUsers([toUsername], {
          title: `🎁 ${sender.name || username}님의 특별한 선물 도착!`,
          body: `[${gift.name}] ${safeContent}`,
          icon: "/public/icons/icon-192.png",
          badge: "/public/icons/badge-72.png",
          url: `/?open=chat&roomId=${encodeURIComponent(roomId)}`,
          tag: "haru-gift-" + Date.now(),
          data: {
            roomId: roomId,
            fromUsername: username,
            giftId: gift.id,
            timestamp: nowIso
          }
        }).catch(err => console.warn("[Web Push] Gift push error:", err.message));
      } catch (pushErr) {
        console.warn("[Web Push] Gift push trigger error:", pushErr.message);
      }

      return sendJSON(res, 201, {
        success: true,
        message: msgEntry,
        gift: gift,
        remainingPoints: sender.totalPoints,
        recipientStats: {
          items: recipient.items,
          shields: recipient.shields,
          totalPoints: recipient.totalPoints
        }
      });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 19. [v3.3.0] 선물 수령 확인 (POST /api/chat/claim-gift)
  if (req.method === "POST" && pathname === "/api/chat/claim-gift") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const messageId = body.messageId;
      const messages = loadMessages();
      const msg = messages.find(m => m.id === messageId);

      if (!msg || !msg.gift) {
        return sendJSON(res, 404, { success: false, message: "해당 선물 메시지를 찾을 수 없습니다." });
      }

      return sendJSON(res, 200, {
        success: true,
        message: "선물이 이미 수령되어 인벤토리에 안전하게 반영되었습니다! 🎁",
        gift: msg.gift
      });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 14. Web Push: VAPID 공개키 조회 (GET /api/push/vapid-public-key)
  if (req.method === "GET" && pathname === "/api/push/vapid-public-key") {
    if (!vapidKeys || !vapidKeys.publicKey) {
      return sendJSON(res, 503, { success: false, message: "VAPID 키가 아직 준비되지 않았습니다." });
    }
    return sendJSON(res, 200, {
      success: true,
      publicKey: vapidKeys.publicKey
    });
  }

  // 15. Web Push: 기기 푸시 구독 등록 (POST /api/push/subscribe)
  if (req.method === "POST" && pathname === "/api/push/subscribe") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const subscription = body.subscription;
      if (!subscription || !subscription.endpoint) {
        return sendJSON(res, 400, { success: false, message: "유효한 푸시 구독 정보가 필요합니다." });
      }

      const subs = getPushSubscriptions();
      const existingIdx = subs.findIndex(s => s.subscription && s.subscription.endpoint === subscription.endpoint);
      const subRecord = {
        username,
        subscription,
        userAgent,
        updatedAt: new Date().toISOString()
      };

      if (existingIdx >= 0) {
        subs[existingIdx] = subRecord;
      } else {
        subs.push(subRecord);
      }

      savePushSubscriptions(subs);
      return sendJSON(res, 200, { success: true, message: "푸시 알림 구독이 등록되었습니다." });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 16. Web Push: 기기 푸시 구독 해제 (POST /api/push/unsubscribe)
  if (req.method === "POST" && pathname === "/api/push/unsubscribe") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const endpoint = body.endpoint || (body.subscription && body.subscription.endpoint);
      const subs = getPushSubscriptions();
      const filtered = subs.filter(s => {
        if (s.username !== username) return true;
        if (endpoint && s.subscription && s.subscription.endpoint === endpoint) return false;
        if (!endpoint) return false;
        return true;
      });

      savePushSubscriptions(filtered);
      return sendJSON(res, 200, { success: true, message: "푸시 알림 구독이 해제되었습니다." });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 17. Web Push: 즉시 테스트 알림 발송 (POST /api/push/test)
  if (req.method === "POST" && pathname === "/api/push/test") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const testPayload = {
        title: "🔔 [하루맞춤] 푸시 알림 테스트 성공!",
        body: "웹 푸시 알림과 알림 사운드가 정상 작동합니다! 💌✨",
        icon: "/public/icons/icon-192.png",
        badge: "/public/icons/badge-72.png",
        url: "/?open=inbox",
        tag: "haru-test-" + Date.now(),
        data: {
          test: true,
          timestamp: new Date().toISOString()
        }
      };

      const sentCount = await sendWebPushToUsers([username], testPayload);
      return sendJSON(res, 200, {
        success: true,
        sentCount,
        message: sentCount > 0 ? "테스트 알림이 발송되었습니다." : "등록된 기기 푸시 구독 정보를 찾을 수 없습니다. 푸시 권한을 확인해주세요."
      });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // ============================================================
  // Static File Serving
  // ============================================================
  let safePath = path.normalize(pathname);
  if (safePath === "/" || safePath === "") {
    safePath = "/index.html";
  }

  const filePath = path.join(__dirname, safePath);

  // Security check: ensure path is within __dirname
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA routing (Strict No-Store Cache Header)
      const indexFile = path.join(__dirname, "index.html");
      fs.readFile(indexFile, (err2, content) => {
        if (err2) {
          res.writeHead(404);
          return res.end("Not Found");
        }
        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          "Pragma": "no-cache",
          "Expires": "0",
          "Surrogate-Control": "no-store"
        });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const acceptEncoding = req.headers["accept-encoding"] || "";
    const shouldGzip = /\bgzip\b/.test(acceptEncoding) && (ext === ".js" || ext === ".css" || ext === ".html" || ext === ".json");
    const isVersioned = (ext === ".js" || ext === ".css") && (req.url && req.url.includes("?v="));
    const isServiceWorker = path.basename(filePath) === "sw.js";
    const isManifest = path.basename(filePath) === "manifest.json" || ext === ".webmanifest";
    const isHtmlOrVersionMeta = ext === ".html" || path.basename(filePath) === "version.json" || isServiceWorker || isManifest;

    const headers = {
      "Content-Type": contentType,
      "Cache-Control": isHtmlOrVersionMeta
        ? "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
        : (isVersioned
          ? "public, max-age=31536000, immutable"
          : ((ext === ".js" || ext === ".css") ? "no-cache, must-revalidate" : "public, max-age=3600")),
      "Pragma": isHtmlOrVersionMeta ? "no-cache" : undefined,
      "Expires": isHtmlOrVersionMeta ? "0" : undefined,
      "Surrogate-Control": isHtmlOrVersionMeta ? "no-store" : undefined
    };

    if (isServiceWorker) {
      headers["Service-Worker-Allowed"] = "/";
    }

    // Remove undefined headers
    Object.keys(headers).forEach(k => headers[k] === undefined && delete headers[k]);

    if (shouldGzip) {
      headers["Content-Encoding"] = "gzip";
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(zlib.createGzip()).pipe(res);
    } else {
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

if (require.main === module || !process.env.TEST_ENV) {
  server.listen(PORT, () => {
    console.log(`[Haru Matchum] Server listening on http://0.0.0.0:${PORT}`);

    // Initial 24-hour photo cleanup on startup & recurring every 30 minutes
    cleanupExpiredPhotos();
    setInterval(cleanupExpiredPhotos, 30 * 60 * 1000);

    // Auto-sync with GitHub every 10 minutes
    setInterval(() => {
      try {
        const status = runGit("git status --porcelain");
        if (status) {
          console.log("[Auto-Sync] Detected changes, pushing to GitHub...");
          runGit("git pull --rebase origin main || true");
          runGit("git add .");
          runGit('git commit -m "auto: periodic sync from Synology NAS" || true');
          runGit("git push origin main || true");
          console.log("[Auto-Sync] Pushed to GitHub successfully!");
        }
      } catch (e) {
        console.error("[Auto-Sync Error]", e.message);
      }
    }, 10 * 60 * 1000);
  });
}

module.exports = server;
module.exports.cleanupExpiredPhotos = cleanupExpiredPhotos;
module.exports.PHOTOS_DIR = PHOTOS_DIR;
module.exports.PHOTO_TTL_MS = PHOTO_TTL_MS;
module.exports.sendWebPushToUsers = sendWebPushToUsers;
module.exports.getPushSubscriptions = getPushSubscriptions;
module.exports.savePushSubscriptions = savePushSubscriptions;
module.exports.vapidKeys = vapidKeys;

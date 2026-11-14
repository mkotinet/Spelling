/**
 * 하루맞춤 (Haru Matchum) - Backend Server
 * Node.js Static Server & Simple Auth/Sync API & Git Auto-Sync
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const { execSync } = require("child_process");

const PORT = process.env.PORT || 80;
const PERSISTENT_DIR = "/app/data";
const DATA_DIR = (fs.existsSync(PERSISTENT_DIR) && process.env.NODE_ENV !== "test") ? PERSISTENT_DIR : path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "users.json");
const LOGS_FILE = path.join(DATA_DIR, "access_logs.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
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
  }
}

// In-memory / JSON Database helper
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
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

// MIME types
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
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

      // Merge and update stats
      if (typeof uData.streak === "number") target.streak = Math.max(target.streak, uData.streak);
      if (typeof uData.totalPoints === "number") target.totalPoints = Math.max(target.totalPoints, uData.totalPoints);
      if (typeof uData.totalSolved === "number") target.totalSolved = Math.max(target.totalSolved, uData.totalSolved);
      if (typeof uData.totalCorrect === "number") target.totalCorrect = Math.max(target.totalCorrect, uData.totalCorrect);
      if (typeof uData.todayScore === "number") target.todayScore = uData.todayScore;
      if (typeof uData.maxRoundToday === "number") target.maxRoundToday = Math.max(target.maxRoundToday || 1, uData.maxRoundToday);
      if (uData.grade) target.grade = uData.grade;
      if (uData.avatar) target.avatar = uData.avatar;
      if (uData.name) target.name = uData.name;

      // Subject-specific sync (Spelling vs Hanja vs English)
      const mode = body.mode || (body.details && body.details.mode) || uData.mode || "spelling";
      const roundVal = typeof body.round === "number" ? body.round : (body.details && typeof body.details.round === "number" ? body.details.round : (typeof uData.maxRoundToday === "number" ? uData.maxRoundToday : null));
      const scoreVal = typeof body.todayScore === "number" ? body.todayScore : (body.details && typeof body.details.score === "number" ? body.details.score : (typeof uData.todayScore === "number" ? uData.todayScore : null));
      const pointsVal = typeof body.pointsEarned === "number" ? body.pointsEarned : (body.details && typeof body.details.pointsEarned === "number" ? body.details.pointsEarned : 0);

      if (mode === "hanja") {
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
      name: u.name || u.username,
      avatar: u.avatar || "🌸",
      grade: u.grade || "중학교 2학년",
      streak: u.streak || 1,
      totalPoints: u.totalPoints || 0,
      todayScore: u.todayScore || 0,
      maxRoundToday: u.maxRoundToday || 1,
      maxRoundSpelling: u.maxRoundSpelling || (u.maxRoundToday || 1),
      maxRoundHanja: u.maxRoundHanja || 1,
      maxRoundEnglish: u.maxRoundEnglish || 1,
      todayScoreSpelling: u.todayScoreSpelling || (u.todayScore || 0),
      todayScoreHanja: u.todayScoreHanja || 0,
      todayScoreEnglish: u.todayScoreEnglish || 0,
      pointsSpelling: u.pointsSpelling || Math.round((u.totalPoints || 0) / 3),
      pointsHanja: u.pointsHanja || Math.round((u.totalPoints || 0) / 3),
      pointsEnglish: u.pointsEnglish || Math.round((u.totalPoints || 0) / 3)
    }));

    if (type === "round") {
      if (mode === "hanja") {
        list.sort((a, b) => (b.maxRoundHanja - a.maxRoundHanja) || (b.pointsHanja - a.pointsHanja) || (b.totalPoints - a.totalPoints));
      } else if (mode === "english") {
        list.sort((a, b) => (b.maxRoundEnglish - a.maxRoundEnglish) || (b.pointsEnglish - a.pointsEnglish) || (b.totalPoints - a.totalPoints));
      } else {
        list.sort((a, b) => (b.maxRoundSpelling - a.maxRoundSpelling) || (b.pointsSpelling - a.pointsSpelling) || (b.totalPoints - a.totalPoints));
      }
    } else if (type === "total") {
      if (mode === "hanja") {
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
      if (mode === "hanja") {
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
      // Fallback to index.html for SPA routing
      const indexFile = path.join(__dirname, "index.html");
      fs.readFile(indexFile, (err2, content) => {
        if (err2) {
          res.writeHead(404);
          return res.end("Not Found");
        }
        res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";

    res.writeHead(200, {
      "Content-Type": contentType,
      "Cache-Control": (ext === ".html" || ext === ".js" || ext === ".css") ? "no-cache, must-revalidate" : "public, max-age=3600"
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

if (require.main === module || !process.env.TEST_ENV) {
  server.listen(PORT, () => {
    console.log(`[Haru Matchum] Server listening on http://0.0.0.0:${PORT}`);

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

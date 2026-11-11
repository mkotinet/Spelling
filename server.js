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
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "users.json");

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
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

      const todayStr = new Date().toISOString().split("T")[0];
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
        return sendJSON(res, 401, { success: false, message: "아이디 또는 비밀번호가 일치하지 않습니다." });
      }

      const token = generateToken();
      db.tokens[token] = trimmedUser;
      saveDB(db);

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
      const uData = body.userData || {};

      // Merge and update stats
      if (typeof uData.streak === "number") target.streak = Math.max(target.streak, uData.streak);
      if (typeof uData.totalPoints === "number") target.totalPoints = Math.max(target.totalPoints, uData.totalPoints);
      if (typeof uData.totalSolved === "number") target.totalSolved = Math.max(target.totalSolved, uData.totalSolved);
      if (typeof uData.totalCorrect === "number") target.totalCorrect = Math.max(target.totalCorrect, uData.totalCorrect);
      if (typeof uData.todayScore === "number") target.todayScore = uData.todayScore;
      if (uData.grade) target.grade = uData.grade;
      if (uData.avatar) target.avatar = uData.avatar;
      if (uData.name) target.name = uData.name;

      // Merge completedDates array uniquely
      if (Array.isArray(uData.completedDates)) {
        const dateSet = new Set([...target.completedDates, ...uData.completedDates]);
        target.completedDates = Array.from(dateSet);
      }

      // Merge badges
      if (Array.isArray(uData.badges)) {
        const badgeSet = new Set([...target.badges, ...uData.badges]);
        target.badges = Array.from(badgeSet);
      }

      // Update wrong questions
      if (Array.isArray(uData.wrongQuestions)) {
        target.wrongQuestions = uData.wrongQuestions;
      }

      target.updatedAt = new Date().toISOString();
      saveDB(db);

      const userSafe = { ...target };
      delete userSafe.passwordHash;

      return sendJSON(res, 200, { success: true, user: userSafe });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 5. 전체 회원 실시간 랭킹 (Leaderboard)
  if (req.method === "GET" && pathname === "/api/leaderboard") {
    const db = loadDB();
    const list = Object.values(db.users).map(u => ({
      id: u.id,
      name: u.name || u.username,
      avatar: u.avatar || "🌸",
      grade: u.grade || "중학교 2학년",
      streak: u.streak || 1,
      totalPoints: u.totalPoints || 0,
      todayScore: u.todayScore || 0
    }));

    return sendJSON(res, 200, { success: true, leaderboard: list });
  }

  // 6. 깃허브 자동 동기화 (Git Push/Pull Status)
  if (pathname === "/api/git/sync" && req.method === "POST") {
    try {
      const pullRes = runGit("git pull origin main");
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
      "Cache-Control": ext === ".html" ? "no-cache" : "public, max-age=3600"
    });
    fs.createReadStream(filePath).pipe(res);
  });
});

server.listen(PORT, () => {
  console.log(`[Haru Matchum] Server listening on http://0.0.0.0:${PORT}`);
});

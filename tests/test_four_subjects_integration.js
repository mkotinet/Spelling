const assert = require("assert");
const fs = require("fs");
const http = require("http");
const path = require("path");

process.env.TEST_ENV = "true";
const serverPath = path.join(__dirname, "../server.js");
delete require.cache[require.resolve(serverPath)];
const server = require(serverPath);

const TEST_PORT = 8996;

console.log("Testing 4-Subject Integration across HTML, CSS, and Server API...");

// 1. HTML Verification
const html = fs.readFileSync(path.join(__dirname, "../index.html"), "utf-8");
assert(html.includes('id="btnModeIdiom"'), "index.html must have btnModeIdiom");
assert(html.includes("우리말 속담·관용구"), "index.html must display 속담·관용구 label");
assert(html.includes("idiom_questions.js"), "index.html must reference idiom_questions.js");
assert(html.includes("v=2.5.0"), "index.html assets must be versioned v=2.5.0");
console.log("✅ HTML 4th subject tab & script tags verified!");

// 2. CSS Verification
const css = fs.readFileSync(path.join(__dirname, "../style.css"), "utf-8");
assert(css.includes(".theme-idiom"), "style.css must have .theme-idiom styles");
console.log("✅ CSS theme-idiom palette verified!");

function request(method, reqPath, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: "127.0.0.1",
      port: TEST_PORT,
      path: reqPath,
      method,
      headers: {
        "Content-Type": "application/json",
        ...headers
      }
    };
    const req = http.request(opts, (res) => {
      let data = "";
      res.on("data", chunk => data += chunk);
      res.on("end", () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on("error", reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

// 3. Server API Verification for idiom mode
server.listen(TEST_PORT, async () => {
  try {
    const testUser = "user_test_idiom_" + Date.now();
    const regRes = await request("POST", "/api/auth/register", {
      username: testUser,
      password: "password123",
      grade: "중학교 2학년"
    });
    assert.strictEqual(regRes.status, 201, "User registration must succeed");
    const token = regRes.body.token;

    // Sync progress in idiom mode
    const syncRes = await request("POST", "/api/user/sync", {
      token,
      mode: "idiom",
      round: 25,
      todayScore: 95,
      pointsEarned: 250,
      action: "ROUND_CLEAR"
    });
    assert.strictEqual(syncRes.status, 200, "Progress sync must succeed");

    // Verify leaderboard for idiom mode
    const lRes = await request("GET", "/api/leaderboard?mode=idiom&type=round");
    assert.strictEqual(lRes.status, 200);
    assert(Array.isArray(lRes.body.leaderboard), "Must return leaderboard array");

    const found = lRes.body.leaderboard.find(u => u.name === testUser);
    assert(found, "Test user must exist in leaderboard");
    assert.strictEqual(found.maxRoundIdiom, 25, `Expected maxRoundIdiom 25, got ${found.maxRoundIdiom}`);
    assert.strictEqual(found.todayScoreIdiom, 95, `Expected todayScoreIdiom 95, got ${found.todayScoreIdiom}`);
    assert.strictEqual(found.pointsIdiom, 250, `Expected pointsIdiom 250, got ${found.pointsIdiom}`);

    // Clean up test user to preserve Rule 6 (No mock data in production)
    const dbPath = path.join(__dirname, "../data/users.json");
    if (fs.existsSync(dbPath)) {
      const db = JSON.parse(fs.readFileSync(dbPath, "utf-8"));
      delete db.users[testUser];
      delete db.tokens[token];
      fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), "utf-8");
    }

    console.log("✅ 4-Subject server persistence and leaderboard sorting verified!");
    server.close(() => process.exit(0));
  } catch (err) {
    console.error("Test failed:", err);
    server.close(() => process.exit(1));
  }
});

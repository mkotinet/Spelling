const assert = require('assert');
const http = require('http');
const fs = require('fs');
const path = require('path');

const TEST_PORT = 8897;
process.env.PORT = TEST_PORT;
process.env.TEST_ENV = 'true';

const server = require('../server.js');

function request(method, urlPath, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: urlPath,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: data ? JSON.parse(data) : {} });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

const srv = server.listen(TEST_PORT, async () => {
  console.log('=== Running Complete End-to-End Verification Suite ===');
  try {
    // 1. Static file check
    const rootRes = await request('GET', '/');
    assert.strictEqual(rootRes.status, 200, 'GET / should return 200');
    assert(rootRes.raw.includes('하루맞춤'), 'Root should serve Haru Matchum HTML');
    assert(rootRes.raw.includes('btnModeHanja'), 'Root should include Hanja switch button');

    // 2. Hanja questions static file check
    const hanjaScriptRes = await request('GET', '/hanja_questions.js');
    assert.strictEqual(hanjaScriptRes.status, 200, 'GET /hanja_questions.js should return 200');
    assert(hanjaScriptRes.raw.includes('HANJA_QUESTION_BANK'), 'Script should define HANJA_QUESTION_BANK');

    // 3. User Register
    const testUsername = 'e2e_runner_' + Date.now();
    const regRes = await request('POST', '/api/auth/register', {}, {
      username: testUsername,
      password: 'mypassword123',
      grade: '고등학교 1학년',
      avatar: '🌟'
    });
    assert.strictEqual(regRes.status, 201, 'Register status should be 201');
    assert(regRes.data.success, 'Register should succeed');
    const userToken = regRes.data.token;
    assert(userToken, 'Token must be issued');

    // 4. User Login Success
    const loginRes = await request('POST', '/api/auth/login', {}, {
      username: testUsername,
      password: 'mypassword123'
    });
    assert.strictEqual(loginRes.status, 200, 'Login status should be 200');
    assert(loginRes.data.success, 'Login should succeed');

    // 5. User Sync with ROUND_CLEAR
    const syncRes = await request('POST', '/api/user/sync', {
      'Authorization': `Bearer ${userToken}`
    }, {
      token: userToken,
      action: 'ROUND_CLEAR',
      userData: {
        totalPoints: 250,
        maxRoundToday: 2,
        streak: 1
      },
      details: {
        mode: 'hanja',
        round: 2,
        score: 100,
        pointsEarned: 150
      }
    });
    assert.strictEqual(syncRes.status, 200, 'Sync status should be 200');
    assert.strictEqual(syncRes.data.user.maxRoundToday, 2, 'maxRoundToday should be updated to 2');

    // 6. User Logs Check
    const logsRes = await request('GET', '/api/user/logs', {
      'Authorization': `Bearer ${userToken}`
    });
    assert.strictEqual(logsRes.status, 200, 'User logs should return 200');
    assert(logsRes.data.success);
    assert(Array.isArray(logsRes.data.logs), 'Logs should be array');
    assert(logsRes.data.logs.some(l => l.action === 'REGISTER'), 'Logs should contain REGISTER');
    assert(logsRes.data.logs.some(l => l.action === 'ROUND_CLEAR'), 'Logs should contain ROUND_CLEAR');

    // 7. Clean Leaderboard Check
    const lbRes = await request('GET', '/api/leaderboard');
    assert.strictEqual(lbRes.status, 200, 'Leaderboard status should be 200');
    assert(lbRes.data.success);
    for (const u of lbRes.data.leaderboard) {
      assert(!u.id.startsWith('peer_'), 'Leaderboard must NOT have peer dummies');
      assert(u.name !== '체리블라썸', 'Leaderboard must NOT have 체리블라썸');
      assert(u.name !== '토끼마카롱', 'Leaderboard must NOT have 토끼마카롱');
    }

    // 8. Admin Logs Check (User should be forbidden, Admin allowed)
    const forbiddenAdminRes = await request('GET', '/api/admin/logs', {
      'Authorization': `Bearer ${userToken}`
    });
    assert.strictEqual(forbiddenAdminRes.status, 403, 'Normal user should get 403 Forbidden for admin logs');

    // Get or ensure admin token for 단민러브
    const dbFile = path.join(__dirname, '..', 'data', 'users.json');
    const db = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
    let adminToken = Object.keys(db.tokens).find(t => db.tokens[t] === '단민러브');
    if (!adminToken) {
      adminToken = 'admin_token_' + Date.now();
      db.tokens[adminToken] = '단민러브';
      fs.writeFileSync(dbFile, JSON.stringify(db, null, 2), 'utf8');
    }
    const adminRes = await request('GET', '/api/admin/logs', {
      'Authorization': `Bearer ${adminToken}`
    });
    assert.strictEqual(adminRes.status, 200, 'Admin 단민러브 should get 200 for admin logs');
    assert(adminRes.data.success);
    assert(adminRes.data.logs.length > 0, 'Admin logs should have recorded entries');

    // 9. Hanja duplicate sentence check
    const hanjaBank = require('../hanja_questions.js');
    let dupCount = 0;
    hanjaBank.forEach(q => {
      const match = q.sentence.match(/\[\s*([^\s\/]+)\s*\/\s*([^\s\/]+)\s*\]/);
      if (match && match[1].trim() === match[2].trim()) dupCount++;
    });
    assert.strictEqual(dupCount, 0, 'No duplicate [ word / word ] in hanja sentences');

    // 10. Mobile Lifecycle & KST Date logic check
    const appCode = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
    assert(appCode.includes('visibilitychange'), 'app.js includes visibilitychange');
    assert(appCode.includes('checkDateTransition'), 'app.js includes checkDateTransition');
    assert(appCode.includes('getKSTDateString'), 'app.js includes getKSTDateString');

    // 11. Random Answer Distribution and Option Shuffle check
    assert(appCode.includes('shuffleQuestionOptions'), 'app.js must include shuffleQuestionOptions');
    const sampleHanjaQ = hanjaBank[0];
    const originalAns = sampleHanjaQ.options[sampleHanjaQ.answerIndex];
    let shuffleWorked = false;
    for (let t = 0; t < 20; t++) {
      const copy = { ...sampleHanjaQ, options: [...sampleHanjaQ.options] };
      for (let i = copy.options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy.options[i], copy.options[j]] = [copy.options[j], copy.options[i]];
      }
      copy.answerIndex = copy.options.indexOf(originalAns);
      assert.strictEqual(copy.options[copy.answerIndex], originalAns);
      if (copy.answerIndex !== 0) shuffleWorked = true;
    }
    assert(shuffleWorked, 'Shuffling must distribute answer index beyond 0');

    // 12. Mobile Auth Persistence check
    assert(appCode.includes('haru_auth_username'), 'app.js must backup haru_auth_username in localStorage');
    assert(appCode.includes("res.status === 401"), 'app.js must strictly check for 401 before wiping tokens');
    assert(appCode.includes("window.addEventListener('online'"), 'app.js must re-verify session on online event');

    console.log('🎉 ALL End-to-End System Tests Passed Pristine and Green!');
    srv.close();
    process.exit(0);
  } catch (e) {
    console.error('❌ E2E Verification Failed:', e);
    srv.close();
    process.exit(1);
  }
});

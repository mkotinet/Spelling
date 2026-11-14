/**
 * Test: Dual-Subject & Highest-Round Leaderboard API
 */
const assert = require('assert');
const http = require('http');
const path = require('path');
const fs = require('fs');

// Require server module
process.env.TEST_ENV = 'true';
const serverPath = path.join(__dirname, '../server.js');
delete require.cache[require.resolve(serverPath)];
const server = require(serverPath);

const TEST_PORT = 8991;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const opts = {
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    };
    const req = http.request(opts, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

const srv = server.listen(TEST_PORT, async () => {
  try {
    console.log('🧪 Testing Dual-Subject and Highest-Round Leaderboard API...');

    // 1. Register test users
    const u1 = 'player_spell_' + Date.now();
    const u2 = 'player_hanja_' + Date.now();

    const reg1 = await request('POST', '/api/auth/register', {
      username: u1,
      password: 'password123',
      grade: '중학교 2학년'
    });
    assert.strictEqual(reg1.status, 201);
    const token1 = reg1.body.token;

    const reg2 = await request('POST', '/api/auth/register', {
      username: u2,
      password: 'password123',
      grade: '고등학교 1학년'
    });
    assert.strictEqual(reg2.status, 201);
    const token2 = reg2.body.token;

    // 2. Sync subject-specific rounds and scores
    // Player 1 excels in spelling: round 5, 500P
    const sync1 = await request('POST', '/api/user/sync', {
      token: token1,
      mode: 'spelling',
      round: 5,
      todayScore: 100,
      pointsEarned: 350
    });
    assert.strictEqual(sync1.status, 200);

    // Player 2 excels in hanja: round 8, 800P
    const sync2 = await request('POST', '/api/user/sync', {
      token: token2,
      mode: 'hanja',
      round: 8,
      todayScore: 100,
      pointsEarned: 600
    });
    assert.strictEqual(sync2.status, 200);

    // 3. Test Leaderboard: Highest Round for Spelling
    const lbSpellRound = await request('GET', '/api/leaderboard?mode=spelling&type=round');
    assert.strictEqual(lbSpellRound.status, 200);
    assert(Array.isArray(lbSpellRound.body.leaderboard));
    const firstSpell = lbSpellRound.body.leaderboard.find(u => u.name === u1);
    assert(firstSpell, 'Player 1 must be present in spelling round leaderboard');
    assert.strictEqual(firstSpell.maxRoundSpelling, 5);

    // 4. Test Leaderboard: Highest Round for Hanja
    const lbHanjaRound = await request('GET', '/api/leaderboard?mode=hanja&type=round');
    assert.strictEqual(lbHanjaRound.status, 200);
    const firstHanja = lbHanjaRound.body.leaderboard.find(u => u.name === u2);
    assert(firstHanja, 'Player 2 must be present in hanja round leaderboard');
    assert.strictEqual(firstHanja.maxRoundHanja, 8);

    // 5. Verify ordering: player 2 should be above player 1 in Hanja round
    const idxP2 = lbHanjaRound.body.leaderboard.findIndex(u => u.name === u2);
    const idxP1 = lbHanjaRound.body.leaderboard.findIndex(u => u.name === u1);
    assert(idxP2 < idxP1, 'In Hanja round ranking, Player 2 (round 8) must rank higher than Player 1 (round 1)');

    console.log('✅ All Dual-Subject Leaderboard Tests Passed!');
    srv.close();
    process.exit(0);
  } catch (e) {
    console.error('❌ Test Failed:', e);
    srv.close();
    process.exit(1);
  }
});

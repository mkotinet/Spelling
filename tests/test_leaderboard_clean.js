const assert = require('assert');
const fs = require('fs');
const path = require('path');
const http = require('http');

const appJsPath = path.join(__dirname, '..', 'app.js');
const appJsContent = fs.readFileSync(appJsPath, 'utf8');

console.log('--- Running Clean Leaderboard & Peer Elimination Tests ---');

// 1. Static check: generatePeerRankings must be deleted from app.js
assert(!appJsContent.includes('generatePeerRankings'), 'generatePeerRankings should be completely removed from app.js');
assert(!appJsContent.includes('체리블라썸'), 'Dummy name 체리블라썸 should not be hardcoded in app.js');
assert(!appJsContent.includes('토끼마카롱'), 'Dummy name 토끼마카롱 should not be hardcoded in app.js');

// 2. Test server leaderboard endpoint
const TEST_PORT = 8898;
process.env.PORT = TEST_PORT;
process.env.TEST_ENV = 'true';
const server = require('../server.js');

const srv = server.listen(TEST_PORT, async () => {
  try {
    const res = await new Promise((resolve, reject) => {
      http.get(`http://127.0.0.1:${TEST_PORT}/api/leaderboard`, (resp) => {
        let data = '';
        resp.on('data', chunk => data += chunk);
        resp.on('end', () => resolve(JSON.parse(data)));
      }).on('error', reject);
    });

    assert(res.success, 'Leaderboard API should return success: true');
    assert(Array.isArray(res.leaderboard), 'Leaderboard should be an array');
    
    // Check no peer_ id exists
    for (const u of res.leaderboard) {
      assert(!u.id.startsWith('peer_'), `No user id should start with peer_: ${u.id}`);
      assert(u.name !== '체리블라썸', 'No dummy user should exist');
      assert('maxRoundToday' in u, 'maxRoundToday should be present in user data');
    }

    console.log('✅ Clean Leaderboard & Peer Elimination Tests Passed!');
    srv.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Test Failed:', err);
    srv.close();
    process.exit(1);
  }
});

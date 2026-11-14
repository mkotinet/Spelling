const assert = require('assert');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Test port
const TEST_PORT = 8899;
process.env.PORT = TEST_PORT;

// Require server
const serverPath = path.join(__dirname, '..', 'server.js');
const server = require(serverPath);

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

async function runTests() {
  console.log('--- Running Server Access Logs & Auth Tests ---');

  try {
    // 1. Test Login failure -> should log LOGIN_FAIL
    const failRes = await request('POST', '/api/auth/login', {}, {
      username: 'non_existent_user_123',
      password: 'wrong_password'
    });
    assert.strictEqual(failRes.status, 401, 'Should return 401 for wrong credentials');

    // 2. Test Login success for existing user '단민러브'
    // '단민러브' is in users.json. We can login or test user logs
    // Let's create a temp user first to be completely clean
    const tempUser = 'test_user_' + Date.now();
    const regRes = await request('POST', '/api/auth/register', {}, {
      username: tempUser,
      password: 'password123',
      grade: '중학교 1학년'
    });
    assert.strictEqual(regRes.status, 201, 'Register should succeed');
    const userToken = regRes.data.token;
    assert(userToken, 'Token should be returned');

    // Check data/access_logs.json exists
    const logsFile = path.join(__dirname, '..', 'data', 'access_logs.json');
    assert(fs.existsSync(logsFile), 'data/access_logs.json should exist');
    const logsData = JSON.parse(fs.readFileSync(logsFile, 'utf8'));
    assert(Array.isArray(logsData), 'Logs should be an array');
    const regLog = logsData.find(l => l.username === tempUser && l.action === 'REGISTER');
    assert(regLog, 'REGISTER action should be logged');
    assert(regLog.ip, 'IP should be recorded');
    assert(regLog.kstTime, 'kstTime should be recorded');

    // 3. User logs endpoint GET /api/user/logs
    const userLogsRes = await request('GET', '/api/user/logs', {
      'Authorization': `Bearer ${userToken}`
    });
    assert.strictEqual(userLogsRes.status, 200, 'User logs should return 200');
    assert.strictEqual(userLogsRes.data.success, true);
    assert(Array.isArray(userLogsRes.data.logs), 'Should return logs array');
    assert(userLogsRes.data.logs.some(l => l.username === tempUser), 'Should contain user log');

    // 4. Admin logs endpoint GET /api/admin/logs with normal user -> 403 Forbidden
    const adminForbiddenRes = await request('GET', '/api/admin/logs', {
      'Authorization': `Bearer ${userToken}`
    });
    assert.strictEqual(adminForbiddenRes.status, 403, 'Normal user should get 403 for admin logs');

    // 5. Admin logs endpoint GET /api/admin/logs with '단민러브' token
    // Let's find or create '단민러브' token
    const dbFile = path.join(__dirname, '..', 'data', 'users.json');
    const db = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
    // Find a token for 단민러브
    let adminToken = Object.keys(db.tokens).find(t => db.tokens[t] === '단민러브');
    if (!adminToken) {
      adminToken = 'admin_test_token_' + Date.now();
      db.tokens[adminToken] = '단민러브';
      fs.writeFileSync(dbFile, JSON.stringify(db, null, 2), 'utf8');
    }

    const adminAllowedRes = await request('GET', '/api/admin/logs', {
      'Authorization': `Bearer ${adminToken}`
    });
    assert.strictEqual(adminAllowedRes.status, 200, 'Admin should get 200 for admin logs');
    assert.strictEqual(adminAllowedRes.data.success, true);
    assert(Array.isArray(adminAllowedRes.data.logs), 'Should return logs array for admin');

    console.log('✅ ALL Server Access Logs & Auth Tests Passed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('❌ Test Failed:', err);
    process.exit(1);
  }
}

runTests();

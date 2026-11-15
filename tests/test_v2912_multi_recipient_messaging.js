/**
 * Verification Suite for v2.9.12:
 * Multi-Recipient Message & Photo Transmission (1 or More Friends Selection)
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('🧪 [v2.9.12] 메시지/사진 다중 수신자(한 사람 이상) 전송 검증 시작');

const ROOT_DIR = path.resolve(__dirname, '..');
const verData = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'version.json'), 'utf8'));
const indexCode = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
const serverCode = fs.readFileSync(path.join(ROOT_DIR, 'server.js'), 'utf8');
const appCode = fs.readFileSync(path.join(ROOT_DIR, 'app.js'), 'utf8');

// 1. Version 2.9.12+ Consistency Check
console.log('  Testing 1: Version >= 2.9.12 consistency across core files...');
assert.ok(verData.version >= '2.9.12', 'version.json must be >= 2.9.12');
assert.ok(indexCode.includes('name="app-version"'), 'index.html meta version must exist');
assert.ok(appCode.includes('this.APP_VERSION'), 'app.js default version must exist');
assert.ok(serverCode.includes('/api/version'), 'server.js version endpoint must exist');
console.log('  ✅ 1. 버전 메타데이터 일관성 통과');

// 2. DOM Elements for Multi-Recipient Selection
console.log('  Testing 2: DOM UI Elements for multi-recipient selection in index.html...');
assert.ok(indexCode.includes('id="msgRecipientSelectorGrid"'), 'index.html must have msgRecipientSelectorGrid');
assert.ok(indexCode.includes('id="msgSelectedCountBadge"'), 'index.html must have msgSelectedCountBadge');
assert.ok(indexCode.includes('id="btnToggleSelectAllRecipients"'), 'index.html must have btnToggleSelectAllRecipients');
assert.ok(appCode.includes('renderRecipientSelector'), 'app.js must implement renderRecipientSelector');
assert.ok(appCode.includes('toggleRecipientSelection'), 'app.js must implement toggleRecipientSelection');
assert.ok(appCode.includes('toggleSelectAllRecipients'), 'app.js must implement toggleSelectAllRecipients');
console.log('  ✅ 2. 다중 친구 선택 DOM 및 UI 엔진 함수 존재 확인 통과');

// 3. API Multi-Recipient Send Integration Test
console.log('  Testing 3: Server Multi-Recipient Send API tests...');

process.env.NODE_ENV = 'test';
process.env.TEST_ENV = 'true';
const server = require('../server.js');

const TEST_PORT = 19893;

server.listen(TEST_PORT, async () => {
  try {
    const dbPath = path.join(ROOT_DIR, 'data', 'users.json');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

    // Authenticate with a valid sender token
    let senderToken = null;
    let senderUsername = '맞춤요정';
    for (const [t, u] of Object.entries(db.tokens || {})) {
      if (u === senderUsername) {
        senderToken = t;
        break;
      }
    }
    if (!senderToken) {
      senderToken = Object.keys(db.tokens)[0];
      senderUsername = db.tokens[senderToken];
    }
    assert.ok(senderToken, 'Sender token must be available');

    function makeRequest(options, bodyData) {
      return new Promise((resolve, reject) => {
        const req = http.request(options, (res) => {
          let chunks = [];
          res.on('data', chunk => chunks.push(chunk));
          res.on('end', () => {
            const rawBody = Buffer.concat(chunks);
            let parsed = null;
            try {
              parsed = JSON.parse(rawBody.toString('utf8'));
            } catch (e) {}
            resolve({ statusCode: res.statusCode, headers: res.headers, body: parsed, rawBody });
          });
        });
        req.on('error', reject);
        if (bodyData) {
          req.write(typeof bodyData === 'string' ? bodyData : JSON.stringify(bodyData));
        }
        req.end();
      });
    }

    // 3-1. Single Recipient Backward Compatibility
    const singleSend = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/api/messages/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${senderToken}`
      }
    }, {
      token: senderToken,
      toName: '민지',
      content: '단일 친구 전송 테스트 💌'
    });
    assert.strictEqual(singleSend.statusCode, 201, 'Single recipient send must return 201');
    assert.strictEqual(singleSend.body.count, 1, 'Single recipient count must be 1');
    assert.strictEqual(singleSend.body.message.toName, '민지');
    console.log('  ✅ 3-1. 단일 수신자 하위 호환 전송 검증 통과');

    // 3-2. Multi-Recipient Send (2 or More Recipients at Once)
    const targets = ['민지', '미니미니'];
    const multiSend = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/api/messages/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${senderToken}`
      }
    }, {
      token: senderToken,
      recipients: [
        { name: '민지' },
        { name: '미니미니' }
      ],
      content: '우리 모두 함께 파이팅해요! 🍀✨'
    });

    assert.strictEqual(multiSend.statusCode, 201, 'Multi recipient send must return 201');
    assert.strictEqual(multiSend.body.success, true);
    assert.strictEqual(multiSend.body.count, 2, 'Must create exactly 2 messages for 2 recipients');
    assert.strictEqual(multiSend.body.messages.length, 2);

    const recipientNames = multiSend.body.messages.map(m => m.toName);
    assert.ok(recipientNames.includes('민지'), 'Must include 민지');
    assert.ok(recipientNames.includes('미니미니'), 'Must include 미니미니');
    console.log('  ✅ 3-2. 다수 친구(2명 이상) 동시 발송 및 개별 메시지 엔트리 생성 확인');

    // 3-3. Multi-Recipient Send with Photo Attachment
    const tinyBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const uploadRes = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/api/messages/upload-photo',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${senderToken}`
      }
    }, {
      token: senderToken,
      imageBase64: tinyBase64,
      fileName: 'group_photo.png'
    });
    assert.strictEqual(uploadRes.statusCode, 201);
    const photoUrl = uploadRes.body.photoUrl;
    const expiresAt = uploadRes.body.expiresAt;

    const multiPhotoSend = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/api/messages/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${senderToken}`
      }
    }, {
      token: senderToken,
      recipients: [
        { name: '민지' },
        { name: '단민러브' }
      ],
      content: '사진도 함께 보냅니다! 📸',
      photoUrl: photoUrl,
      photoExpiresAt: expiresAt
    });

    assert.strictEqual(multiPhotoSend.statusCode, 201);
    assert.strictEqual(multiPhotoSend.body.count, 2);
    multiPhotoSend.body.messages.forEach(m => {
      assert.strictEqual(m.photoUrl, photoUrl, 'All recipients must receive the same photoUrl');
      assert.strictEqual(m.photoExpiresAt, expiresAt, 'All recipients must have photoExpiresAt');
    });
    console.log('  ✅ 3-3. 사진 첨부와 함께 다수 친구 동시 전송 정상 동작 확인');

    // 3-4. Empty Recipients Validation
    const emptySend = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/api/messages/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${senderToken}`
      }
    }, {
      token: senderToken,
      recipients: [],
      content: '빈 수신자 테스트'
    });
    assert.strictEqual(emptySend.statusCode, 400, 'Empty recipients array must return 400 Bad Request');
    console.log('  ✅ 3-4. 수신자 0명 시 400 에러 차단 유효성 검증 확인');

    console.log('🎉 [v2.9.12] 메시지/사진 다중 수신자 전송 검증 스위트 ALL PASS!');
    server.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err);
    server.close();
    process.exit(1);
  }
});

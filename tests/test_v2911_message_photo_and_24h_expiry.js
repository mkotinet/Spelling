/**
 * Verification Suite for v2.9.11:
 * 1:1 Photo Messaging & 24-Hour (1-Day) Automatic Deletion Protection Engine
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('🧪 [v2.9.11] 메시지 사진 첨부 및 24시간 자동 삭제 검증 시작');

const ROOT_DIR = path.resolve(__dirname, '..');
const verData = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'version.json'), 'utf8'));
const indexCode = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
const serverCode = fs.readFileSync(path.join(ROOT_DIR, 'server.js'), 'utf8');
const appCode = fs.readFileSync(path.join(ROOT_DIR, 'app.js'), 'utf8');

// 1. Version 2.9.11 Consistency Check
console.log('  Testing 1: Version 2.9.11 consistency across files...');
assert.strictEqual(verData.version, '2.9.11', 'version.json must be 2.9.11');
assert.strictEqual(verData.build, '20261115_2130', 'version.json build must be 20261115_2130');
assert.ok(indexCode.includes('content="2.9.11"'), 'index.html meta version must be 2.9.11');
assert.ok(indexCode.includes('style.css?v=2.9.11'), 'index.html style.css cache-buster must be 2.9.11');
assert.ok(indexCode.includes('app.js?v=2.9.11'), 'index.html app.js cache-buster must be 2.9.11');
assert.ok(appCode.includes("this.APP_VERSION = metaVer || '2.9.11';"), 'app.js default version must be 2.9.11');
assert.ok(serverCode.includes('version: "2.9.11"'), 'server.js fallback version must be 2.9.11');
console.log('  ✅ 1. v2.9.11 버전 일관성 검증 통과');

// 2. DOM Elements & 24-Hour Expiry UI Notice Integrity
console.log('  Testing 2: DOM UI Elements & 24-hour expiry policy notices in index.html...');
assert.ok(indexCode.includes('id="msgPhotoInput"'), 'index.html must have msgPhotoInput file input');
assert.ok(indexCode.includes('id="btnTriggerPhotoUpload"'), 'index.html must have btnTriggerPhotoUpload button');
assert.ok(indexCode.includes('id="msgPhotoPreviewBox"'), 'index.html must have msgPhotoPreviewBox preview container');
assert.ok(indexCode.includes('id="msgPhotoPreviewImg"'), 'index.html must have msgPhotoPreviewImg');
assert.ok(indexCode.includes('id="btnRemovePhoto"'), 'index.html must have btnRemovePhoto delete button');
assert.ok(indexCode.includes('1일(24시간) 후 자동 삭제'), 'index.html must display 1-day auto-deletion policy notice');
assert.ok(indexCode.includes('id="incomingPhotoContainer"'), 'index.html must have incomingPhotoContainer');
assert.ok(indexCode.includes('id="incomingPhotoImg"'), 'index.html must have incomingPhotoImg');
assert.ok(indexCode.includes('id="incomingPhotoExpiredBox"'), 'index.html must have incomingPhotoExpiredBox');
assert.ok(indexCode.includes('id="modalPhotoLightbox"'), 'index.html must have modalPhotoLightbox fullscreen viewer');
assert.ok(indexCode.includes('id="lightboxTargetImg"'), 'index.html must have lightboxTargetImg');
console.log('  ✅ 2. DOM 요소 및 24시간 정책 안내 UI 검증 통과');

// 3. API & Server Logic Integration Tests
console.log('  Testing 3: Server Photo Upload, Serving, and 24h Expiry API tests...');

process.env.NODE_ENV = 'test';
process.env.TEST_ENV = 'true';
const server = require('../server.js');
const { cleanupExpiredPhotos, PHOTOS_DIR, PHOTO_TTL_MS } = require('../server.js');

const TEST_PORT = 19892;

server.listen(TEST_PORT, async () => {
  try {
    const dbPath = path.join(ROOT_DIR, 'data', 'users.json');
    const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
    
    // Find a valid user token
    let testToken = null;
    let testUsername = null;
    for (const [t, u] of Object.entries(db.tokens || {})) {
      if (db.users[u]) {
        testToken = t;
        testUsername = u;
        break;
      }
    }
    assert.ok(testToken, 'Test user token must be available in users.json');

    // Helper for HTTP requests
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

    // 3-1. Upload photo without auth token -> 401
    const unauthUpload = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/api/messages/upload-photo',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' }
    }, { imageBase64: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==' });
    assert.strictEqual(unauthUpload.statusCode, 401, 'Unauthorized upload must return 401');

    // 3-2. Upload valid Base64 photo -> 201 & check response
    const tinyPngBase64 = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';
    const uploadRes = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/api/messages/upload-photo',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`
      }
    }, {
      token: testToken,
      imageBase64: tinyPngBase64,
      fileName: 'test_friend_cheer.png'
    });

    assert.strictEqual(uploadRes.statusCode, 201, 'Upload photo must return 201 Created');
    assert.ok(uploadRes.body.success, 'Upload response must be success');
    assert.ok(uploadRes.body.photoUrl.startsWith('/api/uploads/photos/photo_'), 'photoUrl must have valid path');
    assert.ok(uploadRes.body.expiresAt, 'Response must have expiresAt timestamp');

    const createdFileName = uploadRes.body.fileName;
    const createdFilePath = path.join(PHOTOS_DIR, createdFileName);
    assert.ok(fs.existsSync(createdFilePath), 'File must be physically written to disk');
    console.log('  ✅ 3-1. 사진 업로드 및 디스크 파일 정상 기록 확인');

    // 3-3. Serve newly uploaded photo -> 200 OK & Content-Type
    const serveRes = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: uploadRes.body.photoUrl,
      method: 'GET'
    });
    assert.strictEqual(serveRes.statusCode, 200, 'Serving active photo must return 200 OK');
    assert.strictEqual(serveRes.headers['content-type'], 'image/png', 'Content-type must be image/png');
    assert.strictEqual(serveRes.rawBody.length > 0, true, 'Photo body must not be empty');
    console.log('  ✅ 3-2. 사진 스트리밍 서빙 및 MIME 타입 확인');

    // 3-4. Send message with photoUrl
    const recipient = Object.keys(db.users).find(u => u !== testUsername) || testUsername;
    const sendRes = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: '/api/messages/send',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${testToken}`
      }
    }, {
      token: testToken,
      toName: recipient,
      content: '사진도 함께 보냅니다! 24시간 뒤에 사라져요 ✨',
      photoUrl: uploadRes.body.photoUrl,
      photoExpiresAt: uploadRes.body.expiresAt
    });

    assert.strictEqual(sendRes.statusCode, 201, 'Send message with photo must return 201');
    assert.strictEqual(sendRes.body.message.photoUrl, uploadRes.body.photoUrl, 'Saved message must contain photoUrl');
    assert.strictEqual(sendRes.body.message.photoExpired, false, 'Initial photoExpired must be false');
    console.log('  ✅ 3-3. 사진 URL 및 만료 시각이 포함된 메시지 전송 및 저장 확인');

    // 3-5. Simulate 24-hour expiration by setting file mtime to 25 hours ago
    const pastTime = (Date.now() - (PHOTO_TTL_MS + 3600000)) / 1000;
    fs.utimesSync(createdFilePath, pastTime, pastTime);

    // Requesting the expired photo now must trigger instant deletion & 410 Gone
    const expiredServeRes = await makeRequest({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: uploadRes.body.photoUrl,
      method: 'GET'
    });
    assert.strictEqual(expiredServeRes.statusCode, 410, 'Expired photo request must return 410 Gone');
    assert.strictEqual(expiredServeRes.body.expired, true, 'Response must indicate expired=true');
    assert.strictEqual(fs.existsSync(createdFilePath), false, 'Expired file must be deleted from disk immediately');
    console.log('  ✅ 3-4. 24시간 경과 사진 파일 디스크 즉시 자동 삭제 및 410 Gone 반환 확인');

    // 3-6. Verify cleanupExpiredPhotos() clears message.photoUrl and marks photoExpired=true
    cleanupExpiredPhotos();
    const messagesPath = path.join(ROOT_DIR, 'data', 'messages.json');
    const messages = JSON.parse(fs.readFileSync(messagesPath, 'utf8'));
    const targetMsg = messages.find(m => m.id === sendRes.body.message.id);
    assert.ok(targetMsg, 'Sent message must exist in messages.json');
    assert.strictEqual(targetMsg.photoUrl, null, 'Expired message photoUrl must become null');
    assert.strictEqual(targetMsg.photoExpired, true, 'Expired message photoExpired must be true');
    console.log('  ✅ 3-5. cleanupExpiredPhotos 엔진의 messages.json 자동 만료 처리 확인');

    console.log('🎉 [v2.9.11] 메시지 사진 첨부 및 24시간 자동 삭제 검증 스위트 ALL PASS!');
    server.close();
    process.exit(0);
  } catch (err) {
    console.error('❌ Test failed:', err);
    server.close();
    process.exit(1);
  }
});

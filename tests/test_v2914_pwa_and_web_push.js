/**
 * Automated Verification Suite for v2.9.14
 * PWA Home Screen Shortcut (A2HS), Service Worker, Web Push (VAPID), Sound & Foreground Chime
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT_DIR = path.join(__dirname, '..');
process.env.TEST_ENV = 'true';
const server = require(path.join(ROOT_DIR, 'server.js'));

let port = 9124;
let baseUrl = `http://127.0.0.1:${port}`;

function httpRequest(method, endpoint, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(endpoint, baseUrl);
    const req = http.request({
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      headers: headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let json = null;
        try { json = JSON.parse(data); } catch (e) {}
        resolve({ status: res.statusCode, headers: res.headers, body: data, json });
      });
    });
    req.on('error', reject);
    if (body) {
      if (typeof body === 'object') {
        req.write(JSON.stringify(body));
      } else {
        req.write(body);
      }
    }
    req.end();
  });
}

async function runTests() {
  console.log('[Test v2.9.14] Starting PWA & Web Push Verification Suite...');

  // Start server
  await new Promise(resolve => server.listen(port, resolve));
  console.log(`[Test Server] Running on ${baseUrl}`);

  try {
    // 1. Verify manifest.json
    console.log('1. Testing manifest.json validity and PWA properties...');
    const manifestPath = path.join(ROOT_DIR, 'manifest.json');
    assert(fs.existsSync(manifestPath), 'manifest.json must exist');
    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    assert.strictEqual(manifest.display, 'standalone', 'PWA display mode must be standalone');
    assert(manifest.start_url && manifest.start_url.startsWith('/'), 'PWA start_url must start with /');
    assert(manifest.icons && manifest.icons.length >= 2, 'manifest must have at least 2 icon sizes');
    console.log('   -> manifest.json verified: display=standalone, icons count=' + manifest.icons.length);

    // 2. Verify icon files
    console.log('2. Testing PWA icon assets in public/icons/...');
    const requiredIcons = ['icon-192.png', 'icon-512.png', 'apple-touch-icon.png', 'badge-72.png', 'favicon.png'];
    for (const icon of requiredIcons) {
      const p = path.join(ROOT_DIR, 'public', 'icons', icon);
      assert(fs.existsSync(p), `Icon ${icon} must exist at ${p}`);
      assert(fs.statSync(p).size > 100, `Icon ${icon} must be non-empty`);
    }
    console.log('   -> All required PNG icons exist with valid sizes.');

    // 3. Verify sw.js
    console.log('3. Testing Service Worker file (sw.js)...');
    const swPath = path.join(ROOT_DIR, 'sw.js');
    assert(fs.existsSync(swPath), 'sw.js must exist');
    const swContent = fs.readFileSync(swPath, 'utf8');
    assert(/addEventListener\(['"]push['"]/.test(swContent), 'sw.js must handle push event');
    assert(/addEventListener\(['"]notificationclick['"]/.test(swContent), 'sw.js must handle notificationclick');
    assert(swContent.includes('showNotification'), 'sw.js must call showNotification');
    console.log('   -> sw.js contains push, notificationclick, showNotification listeners.');

    // 4. Test HTTP serving headers for sw.js and manifest.json
    console.log('4. Testing static serving headers for Service Worker and Web Manifest...');
    const swRes = await httpRequest('GET', '/sw.js');
    assert.strictEqual(swRes.status, 200, 'GET /sw.js must return 200');
    assert(swRes.headers['content-type'].includes('javascript'), 'sw.js content-type must be javascript');
    assert.strictEqual(swRes.headers['service-worker-allowed'], '/', 'Service-Worker-Allowed header must be /');
    assert(swRes.headers['cache-control'].includes('no-store'), 'sw.js cache-control must be no-store');

    const manifestRes = await httpRequest('GET', '/manifest.json');
    assert.strictEqual(manifestRes.status, 200, 'GET /manifest.json must return 200');
    assert(manifestRes.headers['content-type'].includes('json') || manifestRes.headers['content-type'].includes('manifest'), 'manifest content-type');
    assert(manifestRes.headers['cache-control'].includes('no-store'), 'manifest cache-control must be no-store');
    console.log('   -> sw.js and manifest.json served with optimal no-cache and Service-Worker-Allowed headers.');

    // 5. Test Web Push VAPID public key endpoint
    console.log('5. Testing GET /api/push/vapid-public-key...');
    const vapidRes = await httpRequest('GET', '/api/push/vapid-public-key');
    assert.strictEqual(vapidRes.status, 200, 'GET /api/push/vapid-public-key must return 200');
    assert(vapidRes.json && vapidRes.json.publicKey, 'Must return publicKey');
    assert(vapidRes.json.publicKey.length > 40, 'PublicKey must be valid base64url string');
    console.log('   -> VAPID Public Key endpoint returned valid public key:', vapidRes.json.publicKey.substring(0, 16) + '...');

    // 6. Test Push Subscription Registration (Auth required)
    console.log('6. Testing POST /api/push/subscribe & unsubscribe...');
    const unauthSub = await httpRequest('POST', '/api/push/subscribe', { 'Content-Type': 'application/json' }, { subscription: {} });
    assert.strictEqual(unauthSub.status, 401, 'Unauthenticated subscribe must return 401');

    // Load a test user token from DB
    const db = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data', 'users.json'), 'utf8'));
    const token = Object.keys(db.tokens)[0];
    const username = db.tokens[token];
    assert(token && username, 'DB must have an active user token');

    const mockSub = {
      endpoint: 'https://updates.push.services.mozilla.com/wpush/v2/mock_test_' + Date.now(),
      keys: {
        p256dh: 'BNcRdreALRFXTkOOUHK1EtK2wtaz5Ry4YfYCA_0QTpQtUbVlUls0VJXg7A8u-Ts1XbjhazAkj7I99e8QcYP7DkM',
        auth: 'tBHItJI5svbpez7KI4CCXg'
      }
    };

    const subRes = await httpRequest('POST', '/api/push/subscribe', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }, {
      token: token,
      subscription: mockSub
    });
    assert.strictEqual(subRes.status, 200, 'Subscribing with valid token must return 200');
    assert.strictEqual(subRes.json.success, true);

    const subsAfter = server.getPushSubscriptions();
    const foundSub = subsAfter.find(s => s.subscription.endpoint === mockSub.endpoint);
    assert(foundSub, 'Registered subscription must be saved in push subscriptions DB');
    assert.strictEqual(foundSub.username, username);
    console.log('   -> Push subscription registered and verified in DB.');

    // Test Push Unsubscribe
    const unsubRes = await httpRequest('POST', '/api/push/unsubscribe', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }, {
      token: token,
      endpoint: mockSub.endpoint
    });
    assert.strictEqual(unsubRes.status, 200, 'Unsubscribe must return 200');
    const subsAfterUnsub = server.getPushSubscriptions();
    const notFound = subsAfterUnsub.find(s => s.subscription.endpoint === mockSub.endpoint);
    assert(!notFound, 'Unsubscribed endpoint must be deleted');
    console.log('   -> Push subscription unregistered successfully.');

    // 7. Test Push Test Endpoint
    console.log('7. Testing POST /api/push/test endpoint...');
    const testPushRes = await httpRequest('POST', '/api/push/test', {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    }, { token });
    assert.strictEqual(testPushRes.status, 200, 'POST /api/push/test must return 200');
    console.log('   -> Push test endpoint responded 200.');

    // 8. Test Version Endpoint
    console.log('8. Testing version endpoint (/api/version)...');
    const verRes = await httpRequest('GET', '/api/version');
    assert.strictEqual(verRes.status, 200);
    assert.strictEqual(verRes.json.version, '3.2.0', 'Version must be 3.2.0');
    console.log('   -> Version is 3.2.0 as expected.');

    // 9. Verify users data integrity (Rule 6)
    console.log('9. Checking real users data integrity (Rule 6)...');
    const realUsers = ['맞춤요정', '민지', '미니미니', '단민러브'];
    for (const u of realUsers) {
      assert(db.users[u], `Real user ${u} must exist`);
    }
    console.log('   -> All 4 real users intact.');

    console.log('====================================================');
    console.log('ALL v2.9.14 PWA & WEB PUSH TESTS PASSED SUCCESSFULLY!');
    console.log('====================================================');
  } finally {
    server.close();
  }
}

if (require.main === module) {
  runTests().catch(err => {
    console.error('Test Suite Failed:', err);
    process.exit(1);
  });
}

module.exports = runTests;

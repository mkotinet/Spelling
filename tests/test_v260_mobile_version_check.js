/**
 * v2.6.0 Mobile Auto-Update & Version Check Test Suite
 * 검증 항목:
 * 1. HaruMatchumApp.prototype.isServerVersionNewer 시맨틱 버전 비교 로직 검증
 * 2. version.json 파일 정합성 (version 2.6.0, build)
 * 3. index.html 메타 태그 (<meta name="app-version">) 및 버전 뱃지 일치 여부
 * 4. server.js /api/version 엔드포인트 응답 및 Cache-Control no-store 헤더 검증
 * 5. app.js 내 라이프사이클 훅 (visibilitychange, pageshow, focus, online, interval) 연동 확인
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const http = require('http');

const ROOT_DIR = path.resolve(__dirname, '..');

console.log('🧪 Starting v2.6.0 Mobile Auto-Update & Version Check Tests...\n');

// 1. Semantic Version Comparison Unit Tests
console.log('1️⃣ Testing isServerVersionNewer semantic version comparison...');
// Load app.js (mock browser globals if needed)
global.document = {
  querySelector: () => ({ getAttribute: () => '2.6.0' }),
  querySelectorAll: () => [],
  addEventListener: () => {},
  getElementById: () => ({ addEventListener: () => {}, classList: { add: () => {} } })
};
global.window = {
  addEventListener: () => {},
  location: { href: 'http://localhost:3000', replace: () => {}, reload: () => {} }
};
global.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {} };
global.sessionStorage = { getItem: () => null, setItem: () => {} };

let HaruMatchumApp;
try {
  const appModule = require(path.join(ROOT_DIR, 'app.js'));
  HaruMatchumApp = appModule.HaruMatchumApp;
} catch (e) {
  // If app.js instantiation fails due to missing DOM, use prototype directly
}

const compare = HaruMatchumApp ? HaruMatchumApp.prototype.isServerVersionNewer : null;
assert(typeof compare === 'function', 'isServerVersionNewer must be a function on HaruMatchumApp prototype');

// Exact same version
assert.strictEqual(compare('2.6.0', '2.6.0'), false, 'Same version should return false');
assert.strictEqual(compare('v2.6.0', '2.6.0'), false, 'Same version with v prefix should return false');

// Older server version
assert.strictEqual(compare('2.5.2', '2.6.0'), false, 'Older server patch should return false');
assert.strictEqual(compare('1.9.9', '2.6.0'), false, 'Older server major should return false');
assert.strictEqual(compare('2.5.9', '2.6.0'), false, 'Older server minor should return false');

// Newer server version
assert.strictEqual(compare('2.6.1', '2.6.0'), true, 'Newer patch version should return true');
assert.strictEqual(compare('2.7.0', '2.6.0'), true, 'Newer minor version should return true');
assert.strictEqual(compare('3.0.0', '2.6.0'), true, 'Newer major version should return true');
assert.strictEqual(compare('v2.6.1', '2.6.0'), true, 'Newer version with v prefix should return true');
assert.strictEqual(compare('2.6.0.1', '2.6.0'), true, 'Sub-patch newer should return true');
assert.strictEqual(compare('2.10.0', '2.9.5'), true, 'Numeric 10 > 9 check should return true');

// Edge cases
assert.strictEqual(compare(null, '2.6.0'), false, 'Null server version should return false');
assert.strictEqual(compare('2.6.0', null), false, 'Null client version should return false');
assert.strictEqual(compare('', ''), false, 'Empty strings should return false');

console.log('  ✅ isServerVersionNewer unit tests passed!\n');

// 2. version.json Verification
console.log('2️⃣ Verifying version.json integrity...');
const versionJsonPath = path.join(ROOT_DIR, 'version.json');
assert(fs.existsSync(versionJsonPath), 'version.json must exist in project root');
const versionJson = JSON.parse(fs.readFileSync(versionJsonPath, 'utf8'));
assert.strictEqual(versionJson.version, '2.6.0', 'version.json version must be 2.6.0');
assert(versionJson.build, 'version.json must have build timestamp');
console.log(`  ✅ version.json verified: version=${versionJson.version}, build=${versionJson.build}\n`);

// 3. index.html Verification
console.log('3️⃣ Verifying index.html version metadata & cache-busting params...');
const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
assert(indexHtml.includes('<meta name="app-version" content="2.6.0">'), 'index.html must contain app-version meta tag');
assert(indexHtml.includes('v2.6.0'), 'index.html must display v2.6.0 in version badge');
assert(indexHtml.includes('app.js?v=2.6.0'), 'app.js script tag must use ?v=2.6.0 cache buster');
assert(indexHtml.includes('style.css?v=2.6.0'), 'style.css link tag must use ?v=2.6.0 cache buster');
assert(indexHtml.includes('questions.js?v=2.6.0'), 'questions.js must use ?v=2.6.0 cache buster');
console.log('  ✅ index.html version tags verified!\n');

// 4. app.js Lifecycle Hook Verification
console.log('4️⃣ Verifying app.js lifecycle hooks for version checks...');
const appJs = fs.readFileSync(path.join(ROOT_DIR, 'app.js'), 'utf8');
assert(appJs.includes('this.checkAppVersionUpdate()'), 'app.js must invoke checkAppVersionUpdate');
assert(appJs.includes("document.addEventListener('visibilitychange'"), 'app.js must listen to visibilitychange');
assert(appJs.includes("window.addEventListener('pageshow'"), 'app.js must listen to pageshow');
assert(appJs.includes("window.addEventListener('focus'"), 'app.js must listen to focus');
assert(appJs.includes("window.addEventListener('online'"), 'app.js must listen to online');
assert(appJs.includes("haru_auto_reload_to_"), 'app.js must have reload loop guard in checkAppVersionUpdate');
assert(appJs.includes("this.saveActiveQuizSession()"), 'app.js must preserve quiz session before reloading');
console.log('  ✅ app.js lifecycle hooks and loop guards verified!\n');

// 5. server.js /api/version Endpoint Live Test
console.log('5️⃣ Testing server.js /api/version endpoint...');
// Start server on a test port
const testPort = 39981;
const { spawn } = require('child_process');
const serverProc = spawn('node', [path.join(ROOT_DIR, 'server.js')], {
  env: { ...process.env, PORT: String(testPort) },
  stdio: 'pipe'
});

let serverStarted = false;
serverProc.stdout.on('data', (d) => {
  const str = d.toString();
  if (str.includes('Running at') || str.includes('포트')) {
    serverStarted = true;
  }
});

// Wait for server to bind
setTimeout(() => {
  const req = http.get(`http://127.0.0.1:${testPort}/api/version`, (res) => {
    assert.strictEqual(res.statusCode, 200, 'Status code must be 200');
    const cc = res.headers['cache-control'] || '';
    assert(cc.includes('no-store'), 'Cache-Control must include no-store');
    assert(cc.includes('no-cache'), 'Cache-Control must include no-cache');

    let body = '';
    res.on('data', (chunk) => body += chunk);
    res.on('end', () => {
      try {
        const json = JSON.parse(body);
        assert.strictEqual(json.success, true, 'API response success must be true');
        assert.strictEqual(json.version, '2.6.0', 'API response version must be 2.6.0');
        assert(json.serverTime, 'API response must have serverTime');
        console.log('  ✅ /api/version endpoint response:', JSON.stringify(json));
        console.log('  ✅ Cache-Control header:', cc);
        serverProc.kill();
        console.log('\n🎉 ALL v2.6.0 Mobile Version Check Tests Passed Successfully!\n');
        process.exit(0);
      } catch (err) {
        console.error('JSON parse error:', err);
        serverProc.kill();
        process.exit(1);
      }
    });
  });

  req.on('error', (err) => {
    console.error('HTTP request failed:', err);
    serverProc.kill();
    process.exit(1);
  });
}, 1000);

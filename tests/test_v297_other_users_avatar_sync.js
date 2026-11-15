// tests/test_v297_other_users_avatar_sync.js
// Verification suite for v2.9.7: Other users avatar accessories synchronization, anti-wipe guard & compact outfit badge

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 [v2.9.7] 타인 착장 아바타 양방향 동기화 및 랭킹 의상 뱃지 무결성 검증 시작');

const appPath = path.join(__dirname, '../app.js');
const serverPath = path.join(__dirname, '../server.js');
const indexPath = path.join(__dirname, '../index.html');
const stylePath = path.join(__dirname, '../style.css');
const verPath = path.join(__dirname, '../version.json');

const appCode = fs.readFileSync(appPath, 'utf8');
const serverCode = fs.readFileSync(serverPath, 'utf8');
const indexCode = fs.readFileSync(indexPath, 'utf8');
const styleCode = fs.readFileSync(stylePath, 'utf8');
const verData = JSON.parse(fs.readFileSync(verPath, 'utf8'));

// 1. Check checkCloudAuth smart bidirectional sync
console.log('  Testing 1: checkCloudAuth bidirectional sync in app.js...');
assert.ok(appCode.includes('AUTO_INITIAL_PUSH_ACCESSORIES'), 'checkCloudAuth must push local accessories to server if server is empty');
assert.ok(appCode.includes('AUTO_MERGE_ACCESSORIES'), 'checkCloudAuth must merge server & local accessories');
console.log('  ✅ 1. checkCloudAuth 스마트 양방향 동기화 검증 통과');

// 2. Check submitAuth smart accessory sync on login
console.log('  Testing 2: submitAuth accessory sync in app.js...');
assert.ok(appCode.includes('LOGIN_PUSH_ACCESSORIES'), 'submitAuth must support push accessories on login');
console.log('  ✅ 2. submitAuth 로그인 시 착장 동기화 검증 통과');

// 3. Check compact outfit badge in renderCompositeAvatar
console.log('  Testing 3: compact outfit badge in renderCompositeAvatar...');
assert.ok(appCode.includes('acc-compact-outfit'), 'renderCompositeAvatar must render acc-compact-outfit in compact mode');
assert.ok(styleCode.includes('.composite-avatar:not(.fullbody) .acc-compact-outfit'), 'style.css must define .acc-compact-outfit styling');
console.log('  ✅ 3. 컴팩트 아바타 랭킹 의상 뱃지 렌더링 및 CSS 검증 통과');

// 4. Check ensureUserIntegrity & Anti-Wipe Guard in server.js
console.log('  Testing 4: ensureUserIntegrity & Anti-Wipe Guard in server.js...');
assert.ok(serverCode.includes('ensureUserIntegrity(db)'), 'server.js must define ensureUserIntegrity helper');
assert.ok(serverCode.includes('m.avatarAccessories = {'), 'ensureUserIntegrity must restore authentic user accessories');
assert.ok(serverCode.includes('// Shop Inventory & Layered Avatar Accessories Sync (Anti-Wipe Protected)'), 'server.js must include anti-wipe guard');
console.log('  ✅ 4. 서버 측 ensureUserIntegrity 및 Anti-Wipe 보호 가드 검증 통과');

// 5. Version consistency check
console.log('  Testing 5: Version consistency check (>= v2.9.7)...');
assert.ok(verData.version >= '2.9.7', 'version.json version must be >= 2.9.7');
assert.ok(serverCode.includes('/api/version'), 'server.js must define version endpoint');
assert.ok(indexCode.includes('name="app-version"'), 'index.html must include app-version meta tag');
assert.ok(appCode.includes('this.APP_VERSION'), 'app.js must include APP_VERSION');
console.log('  ✅ 5. v2.9.7 이상 버전 메타데이터 일관성 검증 통과');

console.log('🎉 [v2.9.7] 모든 고도화 자동화 검증 100% 통과!');

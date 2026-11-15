// tests/test_v2910_whatsnew_and_messaging_fixes.js
// Verification suite for v2.9.10: What's New Modal Layout Fix & Messaging Runtime Stability

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 [v2.9.10] 업데이트 소개 모달 레이아웃 정상화 및 1:1 메시징 런타임 안정성 검증 시작');

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

// 1. Version Integrity Check (2.9.10)
console.log('  Testing 1: Version 2.9.10 metadata consistency across core files...');
assert.strictEqual(verData.version, '2.9.10', 'version.json must be 2.9.10');
assert.ok(indexCode.includes('content="2.9.10"'), 'index.html meta version must be 2.9.10');
assert.ok(indexCode.includes('style.css?v=2.9.10'), 'index.html style.css cache-buster must be 2.9.10');
assert.ok(indexCode.includes('app.js?v=2.9.10'), 'index.html app.js cache-buster must be 2.9.10');
assert.ok(appCode.includes("this.APP_VERSION = metaVer || '2.9.10';"), 'app.js default version must be 2.9.10');
assert.ok(serverCode.includes('version: "2.9.10"'), 'server.js fallback version must be 2.9.10');
console.log('  ✅ 1. v2.9.10 버전 메타데이터 일관성 검증 통과');

// 2. What's New Modal HTML DOM Structure & Tag Nesting Check
console.log('  Testing 2: What\'s New Modal DOM integrity & tag closure...');
const targetAttrIdx = indexCode.indexOf('id="modalWhatsNew"');
assert.ok(targetAttrIdx !== -1, 'index.html must contain modalWhatsNew');
const modalStartIdx = indexCode.lastIndexOf('<div', targetAttrIdx);
const modalEndIdx = indexCode.indexOf('<!-- Scripts -->', targetAttrIdx);
assert.ok(modalEndIdx !== -1, 'modalWhatsNew must precede Scripts');
const modalSnippet = indexCode.substring(modalStartIdx, modalEndIdx);

// Count opening and closing <div> tags inside modalWhatsNew
const openDivs = (modalSnippet.match(/<div(\s|>)/g) || []).length;
const closeDivs = (modalSnippet.match(/<\/div>/g) || []).length;
assert.strictEqual(openDivs, closeDivs, `modalWhatsNew must have balanced <div> tags (open: ${openDivs}, close: ${closeDivs})`);

// Ensure update cards are properly contained inside update-card-list
assert.ok(modalSnippet.includes('class="whats-new-body"'), 'modal must contain whats-new-body');
assert.ok(modalSnippet.includes('class="update-card-list"'), 'modal must contain update-card-list');
assert.ok(modalSnippet.includes('class="update-feature-card"'), 'modal must contain update-feature-card');
assert.ok(modalSnippet.includes('class="whats-new-footer"'), 'modal must contain whats-new-footer');

// Ensure style.css defines proper overflow and word-break rules
assert.ok(styleCode.includes('overflow-x: hidden;'), 'style.css whats-new-body must prevent horizontal scroll');
assert.ok(styleCode.includes('word-break: keep-all;'), 'style.css must define word-break: keep-all');
console.log('  ✅ 2. 업데이트 소개 모달 DOM 태그 중첩 균형 및 스타일 정상화 검증 통과');

// 3. SoundEffects.applause & Confetti Runtime Safety Check
console.log('  Testing 3: SoundEffects.applause & triggerConfetti runtime safety...');
// Check appCode contains applause implementation in SoundEffects
assert.ok(appCode.includes('applause() {'), 'SoundEffects must implement applause() method');
assert.ok(appCode.includes('window.triggerConfetti = function'), 'Global triggerConfetti fallback must be defined');

// Test instantiation of SoundEffects in Node environment
const vm = require('vm');
const sandbox = {
  window: { addEventListener: () => {} },
  document: { addEventListener: () => {}, getElementById: () => null },
  navigator: { userAgent: 'Node' },
  console: console
};
vm.createContext(sandbox);

// Extract SoundEffects class code
const sfxStart = appCode.indexOf('class SoundEffects {');
const sfxEnd = appCode.indexOf('// Global Mobile/Desktop AudioContext');
const sfxClassCode = appCode.substring(sfxStart, sfxEnd);
vm.runInContext(sfxClassCode, sandbox);
const sfxInstance = sandbox.window.sfx || sandbox.sfx;
assert.strictEqual(typeof sfxInstance.applause, 'function', 'sfx.applause must be a callable function');

// Invoke applause() to ensure no error is thrown
sfxInstance.applause();
console.log('  ✅ 3. SoundEffects.applause() 및 안전 가드 런타임 검증 통과');

// 4. Client submitSendMessage Logic Safety Guard Check
console.log('  Testing 4: submitSendMessage error handling & token refresh...');
assert.ok(appCode.includes("this.cloudToken = localStorage.getItem('haru_cloud_token') || '';"), 'submitSendMessage must refresh cloudToken from localStorage');
assert.ok(appCode.includes('typeof sfx.applause === \'function\''), 'submitSendMessage must check typeof sfx.applause');
assert.ok(appCode.includes('this.confetti && typeof this.confetti.explode === \'function\''), 'submitSendMessage must check this.confetti.explode');
console.log('  ✅ 4. 메시지 전송 클라이언트 안전 가드 및 예외 처리 검증 통과');

// 5. Server-side Leaderboard username field & messages/send flexible matching
console.log('  Testing 5: Server-side Leaderboard username & messages/send matching...');
assert.ok(serverCode.includes('username: u.username || u.name,'), 'server.js leaderboard must return username field');
assert.ok(serverCode.includes('(toId && u.id === toId)'), 'server.js messages/send must support matching by toId');
assert.ok(serverCode.includes('toUsername: recipient.username || recipient.name || toTarget,'), 'server.js must guarantee non-empty toUsername');
console.log('  ✅ 5. 서버 측 랭킹 username 반환 및 메시지 수신자 유연 매칭 검증 통과');

console.log('🎉 [v2.9.10] 모든 버그 수정 검증 스위트 ALL PASS!');

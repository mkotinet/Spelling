/**
 * Verification Suite for v2.9.13:
 * Emoji Picker Toggle & Close Action, Sticky Footer & Independent Scrollable Body
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 [v2.9.13] 이모지 팩 닫기/토글 버튼 & 전송 버튼 고정 최적화 검증 시작');

const ROOT_DIR = path.resolve(__dirname, '..');
const verData = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'version.json'), 'utf8'));
const indexCode = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
const serverCode = fs.readFileSync(path.join(ROOT_DIR, 'server.js'), 'utf8');
const appCode = fs.readFileSync(path.join(ROOT_DIR, 'app.js'), 'utf8');
const styleCode = fs.readFileSync(path.join(ROOT_DIR, 'style.css'), 'utf8');

// 1. Version 2.9.13 Consistency Check
console.log('  Testing 1: Version 2.9.13 consistency across core files...');
assert.strictEqual(verData.version, '2.9.13', 'version.json must be 2.9.13');
assert.strictEqual(verData.build, '20261115_2200', 'version.json build must be 20261115_2200');
assert.ok(indexCode.includes('content="2.9.13"'), 'index.html meta version must be 2.9.13');
assert.ok(indexCode.includes('style.css?v=2.9.13'), 'index.html style.css cache-buster must be 2.9.13');
assert.ok(indexCode.includes('app.js?v=2.9.13'), 'index.html app.js cache-buster must be 2.9.13');
assert.ok(appCode.includes("this.APP_VERSION = metaVer || '2.9.13';"), 'app.js default version must be 2.9.13');
assert.ok(serverCode.includes('version: "2.9.13"'), 'server.js fallback version must be 2.9.13');
console.log('  ✅ 1. v2.9.13 버전 메타데이터 일관성 통과');

// 2. DOM Elements for Emoji Picker Toggle & Sticky Footer
console.log('  Testing 2: DOM UI Elements for emoji toggle/close and sticky footer in index.html...');
assert.ok(indexCode.includes('id="btnToggleEmojiPicker"'), 'index.html must have btnToggleEmojiPicker');
assert.ok(indexCode.includes('id="btnToggleEmojiText"'), 'index.html must have btnToggleEmojiText');
assert.ok(indexCode.includes('id="btnCloseEmojiPicker"'), 'index.html must have btnCloseEmojiPicker');
assert.ok(indexCode.includes('id="emojiPickerContainer"'), 'index.html must have emojiPickerContainer');
assert.ok(indexCode.includes('id="messageModalScrollBody"'), 'index.html must have messageModalScrollBody');
assert.ok(indexCode.includes('class="message-modal-footer"'), 'index.html must have message-modal-footer');
assert.ok(indexCode.includes('id="btnSubmitSendMessage"'), 'index.html must have btnSubmitSendMessage');
assert.ok(indexCode.includes('id="btnCancelSendMessage"'), 'index.html must have btnCancelSendMessage');

// Ensure buttons are inside the message-modal-footer and NOT trapped inside the scroll body
const footerIndex = indexCode.indexOf('class="message-modal-footer"');
const submitBtnIndex = indexCode.indexOf('id="btnSubmitSendMessage"');
const scrollBodyIndex = indexCode.indexOf('id="messageModalScrollBody"');
assert.ok(footerIndex > scrollBodyIndex, 'message-modal-footer must be outside/after messageModalScrollBody');
assert.ok(submitBtnIndex > footerIndex, 'btnSubmitSendMessage must be placed inside message-modal-footer');
console.log('  ✅ 2. DOM 구조 분리 및 전송 버튼 하단 고정 구조 검증 통과');

// 3. CSS Layout & Overflow Rules
console.log('  Testing 3: CSS Layout & Overflow Rules in style.css...');
assert.ok(styleCode.includes('.message-modal-box {'), 'style.css must have .message-modal-box');
assert.ok(styleCode.includes('.message-modal-body {'), 'style.css must have .message-modal-body');
assert.ok(styleCode.includes('.message-modal-footer {'), 'style.css must have .message-modal-footer');
assert.ok(styleCode.includes('.btn-toggle-emoji {'), 'style.css must have .btn-toggle-emoji');
assert.ok(styleCode.includes('.btn-close-emoji-picker {'), 'style.css must have .btn-close-emoji-picker');
assert.ok(styleCode.includes('-webkit-overflow-scrolling: touch;'), 'style.css must support iOS smooth momentum scroll');
console.log('  ✅ 3. CSS 독립 스크롤바 및 고정 푸터 스타일링 통과');

// 4. JS Engine Methods in app.js
console.log('  Testing 4: JS Engine Methods in app.js...');
assert.ok(appCode.includes('toggleEmojiPicker(forceState)'), 'app.js must implement toggleEmojiPicker');
assert.ok(appCode.includes('this.btnToggleEmojiPicker'), 'app.js must bind btnToggleEmojiPicker');
assert.ok(appCode.includes('this.btnCloseEmojiPicker'), 'app.js must bind btnCloseEmojiPicker');
assert.ok(appCode.includes('this.toggleEmojiPicker(false);'), 'app.js must support closing emoji picker on demand');
console.log('  ✅ 4. JS 이모지 팩 닫기/토글 제어 로직 통과');

console.log('🎉 [v2.9.13] 이모지 팩 닫기/토글 및 전송 버튼 화면 고정 검증 스위트 ALL PASS!');
process.exit(0);

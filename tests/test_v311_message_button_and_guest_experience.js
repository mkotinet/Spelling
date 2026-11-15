const assert = require('assert');
const fs = require('fs');
const path = require('path');
const http = require('http');

console.log('🧪 [v3.1.1] Testing Message Button Responsiveness, Resilience & Guest Experience...');

const ROOT_DIR = path.resolve(__dirname, '..');
const appJsPath = path.join(ROOT_DIR, 'app.js');
const indexHtmlPath = path.join(ROOT_DIR, 'index.html');
const styleCssPath = path.join(ROOT_DIR, 'style.css');
const versionJsonPath = path.join(ROOT_DIR, 'version.json');

const appJs = fs.readFileSync(appJsPath, 'utf8');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
const styleCss = fs.readFileSync(styleCssPath, 'utf8');
const versionJson = JSON.parse(fs.readFileSync(versionJsonPath, 'utf8'));

// 1. Version check
assert.strictEqual(versionJson.version, '3.1.1', 'version.json must be 3.1.1');
console.log('  ✓ 1. Version 3.1.1 verified.');

// 2. HTML elements existence
assert(indexHtml.includes('id="btnNavInbox"'), 'index.html must have btnNavInbox in navigation tabs');
assert(indexHtml.includes('id="btnInboxComposeTop"'), 'index.html must have btnInboxComposeTop in inbox modal');
assert(indexHtml.includes('id="msgGuestNoticeBanner"'), 'index.html must have msgGuestNoticeBanner');
assert(indexHtml.includes('id="btnSendUserMessage"'), 'index.html must have btnSendUserMessage');
console.log('  ✓ 2. HTML Message Navigation and Modal elements verified.');

// 3. CSS styling verification
assert(styleCss.includes('.rank-msg-btn'), 'style.css must define .rank-msg-btn for instant messaging');
assert(styleCss.includes('.inbox-compose-top-btn'), 'style.css must define .inbox-compose-top-btn');
assert(styleCss.includes('.inbox-btn'), 'style.css must define .inbox-btn touch animations');
console.log('  ✓ 3. CSS Touch and Button Styles verified.');

// 4. app.js logic verification
assert(appJs.includes('window.haruApp = window.app;'), 'app.js must bind window.haruApp to window.app for backward compatibility');
assert(appJs.includes('renderGuestInbox'), 'app.js must provide renderGuestInbox for non-logged in users');
assert(appJs.includes('btnGuestInboxLogin'), 'renderGuestInbox must provide 3-sec quick login button');
assert(appJs.includes('btnGuestInboxCompose'), 'renderGuestInbox must provide compose button');
assert(appJs.includes('btnEmptyInboxCompose'), 'renderInboxList must provide compose button when inbox is empty');
assert(appJs.includes('btnInboxComposeTop'), 'app.js must bind btnInboxComposeTop');
assert(appJs.includes('btnNavInbox'), 'app.js must bind btnNavInbox');
assert(appJs.includes('pendingMessageToSend'), 'app.js must preserve pending message across login transitions');
assert(appJs.includes('this.currentZoomTargetUser = targetUser;'), 'openAvatarZoomModal must store targetUser');
console.log('  ✓ 4. JavaScript Controller & Event logic verified.');

// 5. Leaderboard quick cheer message button verification
assert(appJs.includes('rank-msg-btn'), 'renderLeaderboard must create .rank-msg-btn for each friend');
console.log('  ✓ 5. Leaderboard Instant Cheer button wiring verified.');

console.log('🎉 [v3.1.1] ALL Message Responsiveness & Guest UX Unit Tests PASSED Successfully!\n');

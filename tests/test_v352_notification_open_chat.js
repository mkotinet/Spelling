/**
 * tests/test_v352_notification_open_chat.js
 * Verification of Direct Chat Window on Notification Click (v3.5.2)
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('=== Starting v3.5.2 Notification Direct to Chat Window Verification ===');

// 1. Verify sw.js
const swPath = path.join(__dirname, '../sw.js');
const swCode = fs.readFileSync(swPath, 'utf8');

assert(swCode.includes("const CACHE_NAME = 'haru-pwa-v3.5.2';"), 'sw.js must bump CACHE_NAME to haru-pwa-v3.5.2');
assert(swCode.includes("open=chat"), 'sw.js must route to open=chat on push & notification click');
assert(swCode.includes("OPEN_CHAT"), 'sw.js must dispatch OPEN_CHAT message to client on notification click');
assert(swCode.includes("roomId: roomId"), 'sw.js must include roomId in notification data');
assert(swCode.includes("withUser: withUser"), 'sw.js must include withUser in notification data');
console.log('✅ 1. Service Worker (sw.js) push and notificationclick routing verified!');

// 2. Verify server.js push notification payloads
const serverPath = path.join(__dirname, '../server.js');
const serverCode = fs.readFileSync(serverPath, 'utf8');

assert(serverCode.includes('/?open=chat&withUser='), 'server.js /api/messages/send must target /?open=chat&withUser=');
assert(serverCode.includes('/?open=chat&roomId='), 'server.js /api/chat/send must target /?open=chat&roomId=');
assert(!serverCode.includes('url: "/?open=inbox"'), 'server.js must not retain old url: "/?open=inbox"');
console.log('✅ 2. Server Web Push payloads targeting direct chat window verified!');

// 3. Verify app.js client router and handlers
const appPath = path.join(__dirname, '../app.js');
const appCode = fs.readFileSync(appPath, 'utf8');

assert(appCode.includes('handleUrlNavigation()'), 'app.js must implement handleUrlNavigation()');
assert(appCode.includes("OPEN_CHAT"), 'app.js service worker listener must handle OPEN_CHAT');
assert(appCode.includes("replyToIncomingMessage()"), 'app.js must implement replyToIncomingMessage()');
assert(appCode.includes("this.enterChatRoom(null, senderUser);"), 'app.js replyToIncomingMessage must call enterChatRoom directly');
assert(appCode.includes("this.enterChatRoom(null, user);"), 'app.js rank-msg-btn must route to enterChatRoom directly');
console.log('✅ 3. Client (app.js) URL Navigation and direct chat triggers verified!');

// 4. Verify index.html and version.json
const indexPath = path.join(__dirname, '../index.html');
const indexHtml = fs.readFileSync(indexPath, 'utf8');
const versionPath = path.join(__dirname, '../version.json');
const versionJson = JSON.parse(fs.readFileSync(versionPath, 'utf8'));

assert(indexHtml.includes('content="3.5.2"'), 'index.html must specify app-version 3.5.2');
assert(indexHtml.includes('💬 새 대화 메시지 도착!'), 'index.html incoming message title must be 💬 새 대화 메시지 도착!');
assert(indexHtml.includes('💬 대화창으로 이동'), 'index.html reply button must be 💬 대화창으로 이동');
assert.strictEqual(versionJson.version, '3.5.2', 'version.json must be 3.5.2');
console.log('✅ 4. HTML markup and version.json metadata verified!');

console.log('🎉 All v3.5.2 Direct Chat Notification tests passed with flying colors!');

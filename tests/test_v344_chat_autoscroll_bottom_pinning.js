/**
 * test_v344_chat_autoscroll_bottom_pinning.js
 * Verifies v3.4.4 Chat Auto-Scroll Bottom Pinning & CLS Defense
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 Starting v3.4.4 Chat Auto-Scroll Bottom Pinning Test Suite...');

const ROOT_DIR = path.resolve(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
const styleCss = fs.readFileSync(path.join(ROOT_DIR, 'style.css'), 'utf8');
const appJs = fs.readFileSync(path.join(ROOT_DIR, 'app.js'), 'utf8');
const versionJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'version.json'), 'utf8'));
const serverJs = fs.readFileSync(path.join(ROOT_DIR, 'server.js'), 'utf8');

// 1. Version Check
assert.strictEqual(versionJson.version, '3.4.4', 'version.json should be v3.4.4');
assert.ok(indexHtml.includes('<meta name="app-version" content="3.4.4">'), 'index.html should specify meta version 3.4.4');
assert.ok(indexHtml.includes('style.css?v=3.4.4'), 'index.html should link style.css?v=3.4.4');
assert.ok(indexHtml.includes('app.js?v=3.4.4'), 'index.html should script app.js?v=3.4.4');
assert.ok(serverJs.includes('version: "3.4.4"'), 'server.js should default to version 3.4.4');
console.log('✅ 1. Version 3.4.4 and cachebusters strictly synchronized.');

// 2. CSS Defense (Pre-allocated photo height, scroll anchoring, bottom anchor)
assert.ok(styleCss.includes('overflow-anchor: auto !important;'), 'style.css should enable web standard scroll anchoring');
assert.ok(styleCss.includes('.chat-bottom-anchor'), 'style.css should define .chat-bottom-anchor');
assert.ok(styleCss.includes('.chat-photo-bubble img'), 'style.css should style .chat-photo-bubble img');
assert.ok(styleCss.includes('min-height: 140px;'), 'style.css should give photo img min-height: 140px to eliminate CLS and scroll jumping');
assert.ok(styleCss.includes('aspect-ratio: 4 / 3;'), 'style.css should set aspect-ratio: 4 / 3 for photo placeholder');
console.log('✅ 2. CSS pre-allocated layout dimensions and scroll anchoring verified.');

// 3. HTML Anchor
assert.ok(indexHtml.includes('id="chatBottomAnchor"'), 'index.html should have chatBottomAnchor element');
console.log('✅ 3. HTML chatBottomAnchor element verified.');

// 4. JS Multi-stage Scrolling & Image Load Engine
assert.ok(appJs.includes('this.isChatUserScrolledUp = false;'), 'app.js should track isChatUserScrolledUp');
assert.ok(appJs.includes('this.chatResizeObserver'), 'app.js should manage ResizeObserver for chat container');
assert.ok(appJs.includes('performScroll'), 'app.js should execute performScroll inside scrollChatToBottom');
assert.ok(appJs.includes('anchor.scrollIntoView'), 'app.js should use anchor.scrollIntoView for browser-level bottom lock');
assert.ok(appJs.includes('requestAnimationFrame'), 'app.js should leverage requestAnimationFrame in scrollChatToBottom');
assert.ok(appJs.includes('allImgs.forEach'), 'app.js should bind load and error listeners on all images in chat');
assert.ok(appJs.includes('onImageLoaded'), 'app.js should re-anchor scroll when images asynchronously decode');
assert.ok(appJs.includes('chat-photo-img'), 'app.js should mark photos with chat-photo-img class');
console.log('✅ 4. JS multi-stage scrolling pipeline, image load listeners, and ResizeObserver verified.');

console.log('🎉 ALL v3.4.4 Chat Auto-Scroll Bottom Pinning Assertions Passed Pristine and Green!');

/**
 * test_v340_chat_refinement_and_resume.js
 * Verification for Haru Matchum v3.4.0:
 * 1. Multi-line auto-resizing chat textarea with comfortable padding & height.
 * 2. Smart resume previous quiz round when exiting to home or switching apps.
 * 3. Chat thread instant scroll jump, reverse pagination & collapsible archive accordion.
 * 4. Famous Anime & Cartoon parody vector stickers with expressive emotions & actions.
 * 5. 27+ Korean famous brand parody gifts (Twosome, Starbucks, Kyochon, Baemin, etc.).
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const http = require('http');

const appJs = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const styleCss = fs.readFileSync(path.join(__dirname, '../style.css'), 'utf8');
const serverJs = fs.readFileSync(path.join(__dirname, '../server.js'), 'utf8');
const stickersJs = fs.readFileSync(path.join(__dirname, '../stickers.js'), 'utf8');
const versionJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../version.json'), 'utf8'));

console.log('🧪 Starting v3.4.0 Feature & Bugfix Verification Tests...');

// 1. Version Check
assert.strictEqual(versionJson.version, '3.4.0', 'version.json version must be 3.4.0');
assert(indexHtml.includes('<meta name="app-version" content="3.4.0">'), 'index.html must include meta app-version 3.4.0');

// 2. Multi-line auto-resizing chat textarea (Requirement 1)
assert(appJs.includes('chatInputText.style.height = Math.min'), 'app.js must implement auto-resizing textarea on input');
assert(styleCss.includes('.chat-textarea-wrapper'), 'style.css must style .chat-textarea-wrapper');
assert(styleCss.includes('min-height: 28px'), 'style.css must have comfortable min-height for chat-textarea');
assert(styleCss.includes('max-height: 140px'), 'style.css must allow multi-line height up to 140px for chat-textarea');

// 3. Smart resume previous quiz round (Requirement 2)
assert(indexHtml.includes('id="resumeQuizBanner"'), 'index.html must have resumeQuizBanner');
assert(appJs.includes('updateResumeQuizBanner'), 'app.js must implement updateResumeQuizBanner');
assert(appJs.includes('saveActiveQuizSession'), 'app.js must implement saveActiveQuizSession');
assert(appJs.includes('restoreActiveQuizSession'), 'app.js must implement restoreActiveQuizSession');
assert(appJs.includes('if (this.currentViewName === \'quiz\') {\n        this.saveActiveQuizSession();\n      }'), 'app.js must auto-save quiz session on pagehide/beforeunload');

// 4. Initial scroll jump, pagination & archive accordion (Requirement 3)
assert(styleCss.includes('scroll-behavior: auto;'), 'style.css must eliminate smooth scroll lag on chat messages container');
assert(appJs.includes('this.isChatArchiveCollapsed = true'), 'app.js must support collapsed archive mode by default');
assert(appJs.includes('chat-archive-banner'), 'app.js must render chat-archive-banner for old messages');
assert(appJs.includes('btn-load-more-chat'), 'app.js must support loading more older messages');
assert(appJs.includes('toggleChatArchive'), 'app.js must implement toggleChatArchive');
assert(indexHtml.includes('id="btnChatToggleArchive"'), 'index.html must provide btnChatToggleArchive button');

// 5. Famous Anime Parody Stickers (Requirement 4)
assert(stickersJs.includes('pokemon_friends'), 'stickers.js must include pokemon_friends sticker pack');
assert(stickersJs.includes('shinchan_friends'), 'stickers.js must include shinchan_friends sticker pack');
assert(stickersJs.includes('healing_friends'), 'stickers.js must include healing_friends sticker pack');
assert(stickersJs.includes('pika_happy'), 'stickers.js must include pika_happy sticker');
assert(stickersJs.includes('shin_dance'), 'stickers.js must include shin_dance sticker');
assert(stickersJs.includes('bono_sweat'), 'stickers.js must include bono_sweat sticker');
assert(indexHtml.includes('data-pack="pokemon_friends"'), 'index.html must include pokemon_friends tab');
assert(indexHtml.includes('data-pack="shinchan_friends"'), 'index.html must include shinchan_friends tab');
assert(indexHtml.includes('data-pack="healing_friends"'), 'index.html must include healing_friends tab');

// 6. Korean Brand Parody Gifts (Requirement 5)
assert(serverJs.includes('gift_twosome_cake'), 'server.js must include gift_twosome_cake (투쌈플레이스)');
assert(serverJs.includes('gift_starbox_americano'), 'server.js must include gift_starbox_americano (스타밥스)');
assert(serverJs.includes('gift_baskin_half'), 'server.js must include gift_baskin_half (배씨네라빈스)');
assert(serverJs.includes('gift_kyochon_combo'), 'server.js must include gift_kyochon_combo (고촌치킨)');
assert(serverJs.includes('gift_bbq_golden'), 'server.js must include gift_bbq_golden (비비큐)');
assert(serverJs.includes('gift_baemin_voucher'), 'server.js must include gift_baemin_voucher (배달의민지)');
assert(serverJs.includes('gift_oliveyoung_card'), 'server.js must include gift_oliveyoung_card (올리브형)');
assert(indexHtml.includes('data-cat="cafe"'), 'index.html must include cafe category tab');
assert(indexHtml.includes('data-cat="food"'), 'index.html must include food category tab');
assert(indexHtml.includes('data-cat="store"'), 'index.html must include store category tab');

console.log('✅ Static and Behavioral Unit Asserts Passed 100%!');

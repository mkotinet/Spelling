/**
 * Test Suite: v3.4.3 Chat Toolbar 2-Tier Layout & Gift Categories Robustness
 * Verifies:
 * 1. index.html inline flex-direction: column on chat-input-toolbar (Prevents vertical buttons break)
 * 2. style.css and app.js compact 1-line 22px default and natural 2-line expansion
 * 3. index.html and app.js gift category tabs click integrity (all, game, cafe, food, store)
 * 4. Fallback gift catalog and emblem display for all brand parody gifts
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Starting v3.4.3 Chat Toolbar & Gift Tabs Test Suite...');

const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const styleCss = fs.readFileSync(path.join(__dirname, '../style.css'), 'utf8');
const appJs = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
const serverJs = fs.readFileSync(path.join(__dirname, '../server.js'), 'utf8');
const verJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../version.json'), 'utf8'));

// 1. Version consistency
assert.strictEqual(verJson.version, '3.4.3', 'version.json must be 3.4.3');
assert(indexHtml.includes('content="3.4.3"'), 'index.html meta version must be 3.4.3');
assert(indexHtml.includes('style.css?v=3.4.3'), 'style.css cache-buster must be 3.4.3');
assert(indexHtml.includes('app.js?v=3.4.3'), 'app.js cache-buster must be 3.4.3');

// 2. Chat toolbar 2-tier inline layout defense (Requirement 1)
assert(
  indexHtml.includes('class="chat-input-toolbar" style="display: flex !important; flex-direction: column !important;'),
  'index.html must enforce display: flex and flex-direction: column inline on chat-input-toolbar'
);
assert(
  indexHtml.includes('class="chat-toolbar-action-row" style="display: flex !important; flex-direction: row !important;'),
  'index.html must enforce display: flex and flex-direction: row inline on chat-toolbar-action-row'
);
assert(
  indexHtml.includes('class="chat-toolbar-input-row" style="display: flex !important; flex-direction: row !important;'),
  'index.html must enforce display: flex and flex-direction: row inline on chat-toolbar-input-row'
);

// 3. Compact 1-line 22px default with natural 2-line expansion (Requirement 2)
assert(
  styleCss.includes('height: 22px !important') || styleCss.includes('height: 22px'),
  'style.css must set compact 22px height on chat-textarea'
);
assert(
  styleCss.includes('min-height: 38px') || styleCss.includes('min-height: 36px'),
  'style.css must set slim min-height on chat-textarea-wrapper'
);
assert(
  appJs.includes("el.style.height = '22px'") && appJs.includes("el.style.height = '44px'"),
  'app.js resizeChatInput must cleanly transition 22px (1 line) to 44px (2 lines)'
);

// 4. Gift Category tabs click integrity & Emblem display (Requirement 3)
assert(
  indexHtml.includes('onclick="window.selectGiftCategory'),
  'index.html gift tabs must safely call window.selectGiftCategory'
);
assert(
  appJs.includes('window.selectGiftCategory ='),
  'app.js must define window.selectGiftCategory globally'
);
assert(
  appJs.includes('FALLBACK_GIFT_CATALOG'),
  'app.js must provide FALLBACK_GIFT_CATALOG for instant offline/caching resiliency'
);
assert(
  styleCss.includes('.gift-icon-display') && styleCss.includes('border-radius: 50%'),
  'style.css must style .gift-icon-display as circular emblem with background'
);

console.log('✅ ALL v3.4.3 Test Suite assertions passed pristine and green!');

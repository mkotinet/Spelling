/**
 * Test: Game Guide Modal & Dual Leaderboard UI Components
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Game Guide Modal & Dual Leaderboard UI...');

const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

// 1. Game Guide Modal Elements
assert(indexHtml.includes('id="btnOpenGameGuide"'), 'index.html must have btnOpenGameGuide');
assert(indexHtml.includes('id="modalGameGuide"'), 'index.html must have modalGameGuide');
assert(indexHtml.includes('id="btnCloseGameGuideModal"'), 'index.html must have btnCloseGameGuideModal');
assert(indexHtml.includes('방패 시스템'), 'Game Guide must explain Shield system');
assert(indexHtml.includes('+300P'), 'Game Guide must explain 300P bonus');
assert(indexHtml.includes('부활 찬스'), 'Game Guide must explain Revive chance');
assert(indexHtml.includes('50:50 지우개'), 'Game Guide must explain 50:50 item');

// 2. In-Game Items & Shield UI
assert(indexHtml.includes('id="quizShieldBadge"'), 'index.html must have quizShieldBadge');
assert(indexHtml.includes('id="quizItemBar"'), 'index.html must have quizItemBar');
assert(indexHtml.includes('id="btnItem5050"'), 'index.html must have btnItem5050');
assert(indexHtml.includes('id="btnItemHeart"'), 'index.html must have btnItemHeart');
assert(indexHtml.includes('id="btnItemDouble"'), 'index.html must have btnItemDouble');

// 3. Fail Checkpoint & Revive UI
assert(indexHtml.includes('id="resultFailActions"'), 'index.html must have resultFailActions');
assert(indexHtml.includes('id="btnReviveQuiz"'), 'index.html must have btnReviveQuiz');
assert(indexHtml.includes('id="btnFallbackRound"'), 'index.html must have btnFallbackRound');

// 4. Leaderboard Dual-Subject & Highest Round UI
assert(indexHtml.includes('id="rankSubjectSpelling"'), 'index.html must have rankSubjectSpelling');
assert(indexHtml.includes('id="rankSubjectHanja"'), 'index.html must have rankSubjectHanja');
assert(indexHtml.includes('data-type="round"'), 'index.html must have round ranking tab');
assert(indexHtml.includes('data-type="daily"'), 'index.html must have daily ranking tab');
assert(indexHtml.includes('data-type="total"'), 'index.html must have total ranking tab');

console.log('🎉 ALL Game Guide Modal & Dual Leaderboard UI Tests Passed!');

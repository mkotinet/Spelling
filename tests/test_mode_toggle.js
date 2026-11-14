const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('--- Running UI Mode Switcher & Theme Tests ---');

const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
const styleCss = fs.readFileSync(path.join(__dirname, '..', 'style.css'), 'utf8');
const appJs = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

// 1. Verify HTML elements
assert(indexHtml.includes('id="btnModeSpelling"'), 'index.html should have btnModeSpelling');
assert(indexHtml.includes('id="btnModeHanja"'), 'index.html should have btnModeHanja');
assert(indexHtml.includes('id="expHanjaArea"'), 'index.html should have expHanjaArea');
assert(indexHtml.includes('id="quizRoundBadge"'), 'index.html should have quizRoundBadge');
assert(indexHtml.includes('id="btnNextRound"'), 'index.html should have btnNextRound');

// 2. Verify CSS theme rules
assert(styleCss.includes('.theme-hanja'), 'style.css should have .theme-hanja');
assert(styleCss.includes('.mode-switch-wrapper'), 'style.css should have .mode-switch-wrapper');
assert(styleCss.includes('.hanja-exp-card'), 'style.css should have .hanja-exp-card');

// 3. Verify app.js methods
assert(appJs.includes('setQuizSubject'), 'app.js should have setQuizSubject');
assert(appJs.includes('getActiveBank'), 'app.js should have getActiveBank');

console.log('✅ UI Mode Switcher & Theme Structure Tests Passed!');

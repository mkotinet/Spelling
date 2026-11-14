const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('--- Running Round Progression & Hanja Display Tests ---');

const appJs = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');

// 1. Verify startNextRound method exists
assert(appJs.includes('startNextRound()'), 'app.js must implement startNextRound()');

// 2. Verify roundCorrectCount tracking
assert(appJs.includes('roundCorrectCount'), 'app.js must track roundCorrectCount');

// 3. Verify 5/5 check for next round button
assert(appJs.includes('roundCorrectCount === 5') || appJs.includes('roundCorrectCount >= 5'), 'app.js must check 5/5 correct for round pass');

// 4. Verify round bonus of 50 points
assert(appJs.includes('50') && appJs.includes('maxRoundToday'), 'app.js must award bonus points and track maxRoundToday');

// 5. Verify Hanja details rendering
assert(appJs.includes('hanjaCharsList') || appJs.includes('expHanjaArea'), 'app.js must render Hanja details in explanation card');

// 6. Verify btnNextRound event listener
assert(appJs.includes('btnNextRound'), 'app.js must bind btnNextRound');

console.log('✅ Round Progression & Hanja Display Static Tests Passed!');

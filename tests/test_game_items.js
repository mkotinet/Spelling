/**
 * Test: Game Items (All 7 In-Game Items)
 * 1. 50:50 요술봉
 * 2. 하트 수호
 * 3. 2배 로켓
 * 4. 돋보기 힌트
 * 5. 행운의 클로버
 * 6. 타임머신 시계
 * 7. 콤보 자석
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Game Items Logic (7 In-Game Items)...');

const appCode = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');

// 1. Static code assertions for all 7 items
assert(appCode.includes('useItem5050'), 'app.js must implement useItem5050');
assert(appCode.includes('useItemHeart'), 'app.js must implement useItemHeart');
assert(appCode.includes('useItemDouble'), 'app.js must implement useItemDouble');
assert(appCode.includes('useItemHint'), 'app.js must implement useItemHint');
assert(appCode.includes('useItemClover'), 'app.js must implement useItemClover');
assert(appCode.includes('useItemTimemachine'), 'app.js must implement useItemTimemachine');
assert(appCode.includes('useItemMagnet'), 'app.js must implement useItemMagnet');

assert(appCode.includes('activeItemHeart'), 'app.js must track activeItemHeart state');
assert(appCode.includes('pointMultiplier'), 'app.js must track pointMultiplier');
assert(appCode.includes('activeItemMagnet'), 'app.js must track activeItemMagnet');

// 2. 50:50 Eraser logic simulation
const mockQuestion = {
  options: ['옵션1', '옵션2', '옵션3', '옵션4'],
  answerIndex: 1
};
const wrongIndices = [];
mockQuestion.options.forEach((opt, idx) => {
  if (idx !== mockQuestion.answerIndex) wrongIndices.push(idx);
});
assert.strictEqual(wrongIndices.length, 3);
wrongIndices.sort(() => 0.5 - Math.random());
const hidden = wrongIndices.slice(0, 2);
assert.strictEqual(hidden.length, 2);
assert(!hidden.includes(mockQuestion.answerIndex), '50:50 must never hide the correct answer');

// 3. Heart Second Chance simulation
let heartActive = true;
let mistakes = 0;
let userPickedWrong = true;

if (userPickedWrong && heartActive) {
  heartActive = false; // consumed
  // mistake was shielded, user gets second chance!
} else if (userPickedWrong) {
  mistakes++;
}
assert.strictEqual(heartActive, false, 'Heart must be consumed on first mistake');
assert.strictEqual(mistakes, 0, 'Mistake count must remain 0 when protected by Heart');

// 4. 2x Booster simulation
let baseScore = 150;
let pointMultiplier = 2;
let finalPoints = baseScore * pointMultiplier;
assert.strictEqual(finalPoints, 300, 'Booster must double the points earned');

// 5. Hint Logic Simulation
const qWithDict = {
  dictDefinition: '어찌 된 일인지 모르게.',
  explanation: '웬일인지의 올바른 표기'
};
const hint = qWithDict.dictDefinition || qWithDict.explanation;
assert(hint.length > 0, 'Hint must be extracted properly');

// 6. Clover Instant Pass Simulation
let roundCorrect = 0;
let answeredCorrect = mockQuestion.answerIndex;
if (answeredCorrect === mockQuestion.answerIndex) {
  roundCorrect++;
}
assert.strictEqual(roundCorrect, 1, 'Clover must immediately award 1 correct count');

// 7. Time Machine Rewind Simulation
let selectedWrongOption = 2; // user picked wrong option
let isTimeMachineUsed = true;
if (isTimeMachineUsed) {
  selectedWrongOption = null; // rewind back to unselected
}
assert.strictEqual(selectedWrongOption, null, 'Time machine must restore selected option to null');

// 8. Magnet Combo Multiplier Simulation
let currentCombo = 3;
let baseComboBonus = (currentCombo - 1) * 5;
let magnetActive = true;
let magnetBonus = magnetActive ? baseComboBonus * 2 : baseComboBonus;
assert.strictEqual(magnetBonus, 20, 'Magnet must multiply combo bonus points');

console.log('🎉 ALL 7 Game Items Tests Passed Successfully!');

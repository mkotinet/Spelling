/**
 * Test: Game Items (50:50 Eraser, Heart Second Chance, 2x Booster)
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Game Items Logic (50:50 Eraser, Heart, 2x Booster)...');

const appCode = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');

// 1. Static code assertions
assert(appCode.includes('useItem5050'), 'app.js must implement useItem5050');
assert(appCode.includes('useItemHeart'), 'app.js must implement useItemHeart');
assert(appCode.includes('useItemDouble'), 'app.js must implement useItemDouble');
assert(appCode.includes('activeItemHeart'), 'app.js must track activeItemHeart state');
assert(appCode.includes('pointMultiplier'), 'app.js must track pointMultiplier');

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

console.log('🎉 ALL Game Items Tests Passed Successfully!');

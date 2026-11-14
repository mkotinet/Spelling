const assert = require('assert');
const HANJA_QUESTION_BANK = require('../hanja_questions.js');

console.log('🧪 Testing Option Shuffle and Answer Distribution...');

// Function under test (same logic to be embedded in app.js)
function shuffleQuestionOptions(q) {
  const originalAnswerText = q.options[q.answerIndex];
  const shuffled = [...q.options];
  
  // Fisher-Yates shuffle
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  
  const newAnswerIndex = shuffled.indexOf(originalAnswerText);
  return {
    ...q,
    options: shuffled,
    answerIndex: newAnswerIndex
  };
}

// 1. Verify that before shuffle, answers are overwhelmingly index 0
const originalIndices = HANJA_QUESTION_BANK.map(q => q.answerIndex);
const zeroCount = originalIndices.filter(i => i === 0).length;
console.log(`Original bank: ${zeroCount} out of ${HANJA_QUESTION_BANK.length} have answerIndex 0`);

// 2. Test 100 iterations of a 4-choice question
const sampleQ = HANJA_QUESTION_BANK.find(q => q.options.length === 4);
const distribution = { 0: 0, 1: 0, 2: 0, 3: 0 };
const originalAnswer = sampleQ.options[sampleQ.answerIndex];

for (let i = 0; i < 1000; i++) {
  const shuffledQ = shuffleQuestionOptions(sampleQ);
  
  // Integrity check: Shuffled answer text MUST ALWAYS match original answer
  assert.strictEqual(
    shuffledQ.options[shuffledQ.answerIndex],
    originalAnswer,
    'Shuffled answer index must point to the exact same correct answer text!'
  );
  
  distribution[shuffledQ.answerIndex]++;
}

console.log('1000 trials answer index distribution (4 options):', distribution);

// Each position (0, 1, 2, 3) should get roughly 25% (at least 150 out of 1000)
for (let idx = 0; idx < 4; idx++) {
  assert(
    distribution[idx] > 150,
    `Index ${idx} should have appeared at least 150 times, got ${distribution[idx]}`
  );
}

// 3. Test a 5-question round: should NOT all have answerIndex 0
let allZeroRounds = 0;
for (let round = 0; round < 100; round++) {
  const roundQuestions = HANJA_QUESTION_BANK.slice(0, 5).map(q => shuffleQuestionOptions(q));
  const isAllZero = roundQuestions.every(q => q.answerIndex === 0);
  if (isAllZero) allZeroRounds++;
}

console.log(`Out of 100 rounds of 5 questions, all-zero rounds: ${allZeroRounds}`);
assert.strictEqual(allZeroRounds, 0, 'Should practically never have a round where all 5 answers are option 1 (index 0)');

console.log('✅ Option Shuffle and Answer Distribution Tests Passed!');

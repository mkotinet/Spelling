const assert = require('assert');
const HANJA_QUESTION_BANK = require('../hanja_questions.js');

console.log('🧪 Testing Hanja Question Sentences for Duplicate Phrasing Bug...');

let duplicateCount = 0;
const duplicateList = [];

HANJA_QUESTION_BANK.forEach(q => {
  // Check if [ X / X ] pattern exists where both sides are identical words
  const match = q.sentence.match(/\[\s*([^\s\/]+)\s*\/\s*([^\s\/]+)\s*\]/);
  if (match) {
    const left = match[1].trim();
    const right = match[2].trim();
    if (left === right) {
      duplicateCount++;
      duplicateList.push({ id: q.id, word: left, sentence: q.sentence });
    }
  }
});

console.log(`Found ${duplicateCount} questions with duplicate [ word / word ] patterns:`);
duplicateList.forEach(item => {
  console.log(` - [ID ${item.id}] "${item.sentence}" (Word: ${item.word})`);
});

assert.strictEqual(
  duplicateCount,
  0,
  `There should be NO duplicate [ word / word ] patterns in hanja sentences! Found: ${duplicateCount}`
);

console.log('✅ Hanja Duplicate Sentence Test Passed!');

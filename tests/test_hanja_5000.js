const assert = require("assert");
const { HANJA_QUESTION_BANK } = require("../hanja_questions.js");

console.log("Testing HANJA_QUESTION_BANK 5,000 questions...");
assert.strictEqual(HANJA_QUESTION_BANK.length, 5000, `Expected 5000 questions, got ${HANJA_QUESTION_BANK.length}`);

const levels = { "초등/기초": 0, "중등/필수": 0, "고등/심화": 0, "수능/기출": 0, "일반/실무": 0 };
const ids = new Set();

HANJA_QUESTION_BANK.forEach((q, idx) => {
  assert(q.id >= 10001 && q.id <= 15000, `Invalid ID ${q.id} at index ${idx}`);
  assert(!ids.has(q.id), `Duplicate ID ${q.id}`);
  ids.add(q.id);
  assert(levels[q.level] !== undefined, `Unknown level: ${q.level} at ID ${q.id}`);
  levels[q.level]++;
  assert.strictEqual(q.options.length, 4, `Question ${q.id} must have 4 options`);
  assert.strictEqual(new Set(q.options).size, 4, `Question ${q.id} has duplicate options: ${JSON.stringify(q.options)}`);
  assert(q.answerIndex >= 0 && q.answerIndex < 4, `Invalid answerIndex for ID ${q.id}`);
  assert(q.sentence.includes("[ (     ) ]"), `Sentence missing bracket blank at ID ${q.id}: ${q.sentence}`);
  assert(!q.sentence.includes(" / "), `Sentence contains slash comparison at ID ${q.id}: ${q.sentence}`);
  assert(q.hanjaWord && Array.isArray(q.hanjaChars) && q.hanjaChars.length > 0, `Missing hanjaChars at ID ${q.id}`);
  q.hanjaChars.forEach(c => {
    assert(c.char && c.sound && c.meaning, `Invalid char breakdown in question ${q.id}: ${JSON.stringify(c)}`);
  });
  assert(q.options[q.answerIndex].includes(q.hanjaWord), `options[answerIndex] must contain hanjaWord at ID ${q.id}: ${q.options[q.answerIndex]} vs ${q.hanjaWord}`);
});

assert.strictEqual(levels["초등/기초"], 1000, `Expected 1000 elementary questions, got ${levels["초등/기초"]}`);
assert.strictEqual(levels["중등/필수"], 1000, `Expected 1000 middle questions, got ${levels["중등/필수"]}`);
assert.strictEqual(levels["고등/심화"], 1000, `Expected 1000 high questions, got ${levels["고등/심화"]}`);
assert.strictEqual(levels["수능/기출"], 1000, `Expected 1000 csat questions, got ${levels["수능/기출"]}`);
assert.strictEqual(levels["일반/실무"], 1000, `Expected 1000 business questions, got ${levels["일반/실무"]}`);

console.log("✅ HANJA_QUESTION_BANK 5,000 questions passed all schema & distribution validations!");

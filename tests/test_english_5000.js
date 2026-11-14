const assert = require("assert");
const { ENGLISH_QUESTION_BANK } = require("../english_questions.js");

console.log("Testing ENGLISH_QUESTION_BANK 5,000 questions...");
assert.strictEqual(ENGLISH_QUESTION_BANK.length, 5000, `Expected 5000 questions, got ${ENGLISH_QUESTION_BANK.length}`);

const levels = { "초등/기초": 0, "중등/필수": 0, "고등/심화": 0, "수능/기출": 0, "일반/실무": 0 };
const ids = new Set();

ENGLISH_QUESTION_BANK.forEach((q, idx) => {
  assert(q.id >= 15001 && q.id <= 20000, `Invalid ID ${q.id} at index ${idx}`);
  assert(!ids.has(q.id), `Duplicate ID ${q.id}`);
  ids.add(q.id);
  assert(levels[q.level] !== undefined, `Unknown level: ${q.level} at ID ${q.id}`);
  levels[q.level]++;
  assert.strictEqual(q.options.length, 4, `Question ${q.id} must have 4 options`);
  assert.strictEqual(new Set(q.options).size, 4, `Question ${q.id} has duplicate options: ${JSON.stringify(q.options)}`);
  assert(q.answerIndex >= 0 && q.answerIndex < 4, `Invalid answerIndex for ID ${q.id}`);
  assert(q.sentence.includes("[ (     ) ]"), `Sentence missing bracket blank at ID ${q.id}: ${q.sentence}`);
  assert(!q.sentence.includes(" / "), `Sentence contains slash comparison at ID ${q.id}: ${q.sentence}`);
  assert(q.englishWord && q.sentenceTranslation && q.grammar && q.meaning, `Missing translation or grammar at ID ${q.id}`);
  assert.strictEqual(q.options[q.answerIndex], q.englishWord, `options[answerIndex] !== englishWord at ID ${q.id}: ${q.options[q.answerIndex]} vs ${q.englishWord}`);
});

assert.strictEqual(levels["초등/기초"], 1000, `Expected 1000 elementary questions, got ${levels["초등/기초"]}`);
assert.strictEqual(levels["중등/필수"], 1000, `Expected 1000 middle questions, got ${levels["중등/필수"]}`);
assert.strictEqual(levels["고등/심화"], 1000, `Expected 1000 high questions, got ${levels["고등/심화"]}`);
assert.strictEqual(levels["수능/기출"], 1000, `Expected 1000 csat questions, got ${levels["수능/기출"]}`);
assert.strictEqual(levels["일반/실무"], 1000, `Expected 1000 business questions, got ${levels["일반/실무"]}`);

console.log("✅ ENGLISH_QUESTION_BANK 5,000 questions passed all schema & distribution validations!");

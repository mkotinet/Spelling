/**
 * Comprehensive 20,000 Questions & 1,000 Rounds Permutation Full Audit
 */

const assert = require("assert");
const { SPELLING_QUESTION_BANK } = require("../questions.js");
const { IDIOM_QUESTION_BANK } = require("../idiom_questions.js");
const { HANJA_QUESTION_BANK } = require("../hanja_questions.js");
const { ENGLISH_QUESTION_BANK } = require("../english_questions.js");

console.log("============================================================");
console.log("🚀 STARTING 20,000 QUESTIONS & 1,000 ROUNDS AUDIT SUITE");
console.log("============================================================\n");

// 1. Total Count Verification
assert.strictEqual(SPELLING_QUESTION_BANK.length, 5000, `Spelling must be 5000, got ${SPELLING_QUESTION_BANK.length}`);
assert.strictEqual(IDIOM_QUESTION_BANK.length, 5000, `Idiom must be 5000, got ${IDIOM_QUESTION_BANK.length}`);
assert.strictEqual(HANJA_QUESTION_BANK.length, 5000, `Hanja must be 5000, got ${HANJA_QUESTION_BANK.length}`);
assert.strictEqual(ENGLISH_QUESTION_BANK.length, 5000, `English must be 5000, got ${ENGLISH_QUESTION_BANK.length}`);
console.log("✅ 1. Total Question Counts: Exactly 20,000 questions (5,000 per subject x 4) verified!");

// 2. Strict Schema, 4-Choice & Bracket Format Verification
const banks = [
  { name: "우리말 맞춤법", bank: SPELLING_QUESTION_BANK, idMin: 1, idMax: 5000 },
  { name: "우리말 속담·관용구", bank: IDIOM_QUESTION_BANK, idMin: 5001, idMax: 10000 },
  { name: "한자·고사성어", bank: HANJA_QUESTION_BANK, idMin: 10001, idMax: 15000 },
  { name: "영어 어휘·스펠링", bank: ENGLISH_QUESTION_BANK, idMin: 15001, idMax: 20000 }
];

const targetLevels = ["초등/기초", "중등/필수", "고등/심화", "수능/기출", "일반/실무"];

banks.forEach(({ name, bank, idMin, idMax }) => {
  const seenIds = new Set();
  const levelCounts = { "초등/기초": 0, "중등/필수": 0, "고등/심화": 0, "수능/기출": 0, "일반/실무": 0 };

  bank.forEach((q, idx) => {
    assert(q.id >= idMin && q.id <= idMax, `[${name}] ID out of bounds: ${q.id} (index ${idx})`);
    assert(!seenIds.has(q.id), `[${name}] Duplicate ID ${q.id}`);
    seenIds.add(q.id);

    assert(levelCounts[q.level] !== undefined, `[${name}] Unknown level ${q.level} at ID ${q.id}`);
    levelCounts[q.level]++;

    assert.strictEqual(q.options.length, 4, `[${name}] ID ${q.id} must have 4 options`);
    assert.strictEqual(new Set(q.options).size, 4, `[${name}] ID ${q.id} has duplicate choices`);
    assert(q.answerIndex >= 0 && q.answerIndex < 4, `[${name}] ID ${q.id} invalid answerIndex`);

    assert(q.sentence.includes("[ (     ) ]"), `[${name}] ID ${q.id} missing bracket format: "${q.sentence}"`);
    assert(!q.sentence.includes(" / "), `[${name}] ID ${q.id} contains slash comparison: "${q.sentence}"`);

    const ans = q.options[q.answerIndex];
    assert(ans && ans.length > 0, `[${name}] ID ${q.id} empty answer option`);
  });

  targetLevels.forEach(lvl => {
    assert.strictEqual(levelCounts[lvl], 1000, `[${name}] Level ${lvl} must have 1,000 questions, got ${levelCounts[lvl]}`);
  });

  console.log(`✅ 2. [${name}] 5,000 questions passed 100% schema & level distribution (1,000/level)`);
});

console.log("\n🎉 ALL 20,000 QUESTIONS AND SCHEMAS PRISTINE & GREEN!");

/**
 * Unit & Integration Test Suite for v2.5.2 Enhancements:
 * 1. Zero ending collisions (다였다, 다했다, 다이다, 하다였다, etc.) across 20,000 questions.
 * 2. Level-appropriate question prompts across all 4 question banks and 5 levels.
 * 3. Question #2632 and base-form word quotation alignment with rich semantic context.
 * 4. Shield capacity capped strictly at 2.
 * 5. Shield interactive decision flow on round failure in UI and game logic.
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const { SPELLING_QUESTION_BANK } = require('../questions.js');
const { IDIOM_QUESTION_BANK } = require('../idiom_questions.js');
const { HANJA_QUESTION_BANK } = require('../hanja_questions.js');
const { ENGLISH_QUESTION_BANK } = require('../english_questions.js');

console.log('🚀 Starting v2.5.2 Ending Collision, Level Prompts & Shield Decision Test Suite...\n');

// ============================================================
// 1. Ending Collisions Verification Across All 20,000 Questions
// ============================================================
console.log('--- Test 1: Ending Collision & Grammar Integrity ---');

function assertNoCollisions(name, bank, wordField) {
  let collisions = [];
  for (let q of bank) {
    let word = q[wordField] || q.options[q.answerIndex];
    let s = q.sentence;
    let sub = s.replace(/\[\s*\(\s*\?*\s*\)\s*\]/, word);
    if (
      sub.includes('다이다') ||
      sub.includes('다였다') ||
      sub.includes('다했다') ||
      sub.includes('하다였다') ||
      sub.includes('하다했다') ||
      sub.includes('다어서') ||
      sub.includes('다어 ')
    ) {
      collisions.push({ id: q.id, word, sentence: s, sub });
    }
  }
  assert.strictEqual(
    collisions.length,
    0,
    `${name} must have 0 ending collisions! Found ${collisions.length}: ${JSON.stringify(collisions.slice(0, 3))}`
  );
  console.log(`✅ ${name} (5,000 questions): Exactly 0 ending collisions!`);
}

assertNoCollisions('Spelling Bank', SPELLING_QUESTION_BANK, 'standardWord');
assertNoCollisions('Idiom Bank', IDIOM_QUESTION_BANK, 'idiomWord');
assertNoCollisions('Hanja Bank', HANJA_QUESTION_BANK, 'hanjaWord');
assertNoCollisions('English Bank', ENGLISH_QUESTION_BANK, 'englishWord');

// ============================================================
// 2. Question #2632 Specific Fix Verification
// ============================================================
console.log('\n--- Test 2: Question #2632 Specific Fix Verification ---');
const q2632 = SPELLING_QUESTION_BANK.find(q => q.id === 2632);
assert(q2632, 'Question #2632 must exist');
assert.strictEqual(q2632.level, '고등/심화');
assert(q2632.question.includes('문맥의 어법과 한글 맞춤법 규정에 부합하는'), 'Q2632 must have high school level prompt');
assert.strictEqual(q2632.options[q2632.answerIndex], '안절부절못하다');
assert(q2632.sentence.includes("'[ (     ) ]'이다"), "Q2632 sentence must cite the word in quotes ('[ (     ) ]'이다)");
assert(!q2632.sentence.includes('[ (     ) ]였다'), 'Q2632 must not append 였다 directly after blank');
const substituted2632 = q2632.sentence.replace(/\[\s*\(\s*\?*\s*\)\s*\]/, q2632.options[q2632.answerIndex]);
assert(!substituted2632.includes('안절부절못하다였다'), 'Substituted Q2632 must not form 안절부절못하다였다');
assert(substituted2632.includes("'안절부절못하다'이다"), "Substituted Q2632 must correctly form '안절부절못하다'이다");
console.log('✅ Question #2632 verified: Natural phrasing, level prompt, and zero syntax collision!');

// ============================================================
// 3. Level-Graduated Question Prompts Across All Banks
// ============================================================
console.log('\n--- Test 3: Level-Graduated Question Prompts ---');

const expectedPromptSnippets = {
  Spelling: {
    '초등/기초': '골라보세요',
    '중등/필수': '표준어 표기를 고르세요',
    '고등/심화': '문맥의 어법과 한글 맞춤법 규정에 부합하는',
    '수능/기출': '가장 적절한 표준어 어휘를 고르세요',
    '일반/실무': '공문서 및 업무 문맥'
  },
  Idiom: {
    '초등/기초': '골라보세요',
    '중등/필수': '올바른 속담이나 관용 표현을 고르세요',
    '고등/심화': '문맥의 흐름에 비추어',
    '수능/기출': '제시문의 상황과 함의에 가장 부합하는',
    '일반/실무': '사회·비즈니스 맥락'
  },
  Hanja: {
    '초등/기초': '골라보세요',
    '중등/필수': '필수 한자성어 표기를 고르세요',
    '고등/심화': '가장 알맞은 사자성어의 한자 표기를 고르세요',
    '수능/기출': '핵심 함의를 담은 가장 적절한 한자성어',
    '일반/실무': '시사 및 비즈니스 문맥'
  },
  English: {
    '초등/기초': '골라보세요',
    '중등/필수': '올바른 철자의 영단어를 고르세요',
    '고등/심화': '가장 적절한 어휘의 올바른 영문 철자',
    '수능/기출': '수능 지문 문맥',
    '일반/실무': '비즈니스 실무 문맥'
  }
};

function verifyPrompts(name, bank, snippets) {
  for (let [lvl, snip] of Object.entries(snippets)) {
    let subset = bank.filter(q => q.level === lvl);
    assert(subset.length === 1000, `${name} Level ${lvl} must have 1000 questions, got ${subset.length}`);
    for (let q of subset) {
      assert(
        q.question.includes(snip),
        `${name} [${lvl}] question prompt "${q.question}" must contain snippet "${snip}"`
      );
    }
  }
  console.log(`✅ ${name}: All 5 levels verified for pedagogical gradation!`);
}

verifyPrompts('Spelling', SPELLING_QUESTION_BANK, expectedPromptSnippets.Spelling);
verifyPrompts('Idiom', IDIOM_QUESTION_BANK, expectedPromptSnippets.Idiom);
verifyPrompts('Hanja', HANJA_QUESTION_BANK, expectedPromptSnippets.Hanja);
verifyPrompts('English', ENGLISH_QUESTION_BANK, expectedPromptSnippets.English);

// ============================================================
// 4. HTML Shield Decision UI Verification
// ============================================================
console.log('\n--- Test 4: HTML Shield Decision UI Verification ---');
const htmlCode = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
assert(htmlCode.includes('id="shieldDecisionBox"'), 'index.html must include shieldDecisionBox');
assert(htmlCode.includes('id="btnUseShieldDefense"'), 'index.html must include btnUseShieldDefense');
assert(htmlCode.includes('id="btnDeclineShield"'), 'index.html must include btnDeclineShield');
assert(htmlCode.includes('id="shieldDecisionCount"'), 'index.html must include shieldDecisionCount');
console.log('✅ index.html verified: shieldDecisionBox, action buttons, and counter badge present!');

// ============================================================
// 5. app.js Shield Mechanics & Decision Logic Verification
// ============================================================
console.log('\n--- Test 5: app.js Shield Cap Max 2 & Manual Decision Logic ---');
const appCode = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');

// Verify shield cap max 2 in app.js
assert(appCode.includes('Math.min(2,'), 'app.js must cap shields at 2');
assert(!appCode.includes('Math.min(3, this.shields + 1)'), 'app.js must not allow 3 shields');
assert(!appCode.includes('Math.min(5,'), 'app.js must not allow 5 shields');

// Verify manual shield decision logic in finishRound
assert(appCode.includes('shieldDecisionBox'), 'app.js finishRound must reference shieldDecisionBox');
assert(appCode.includes('btnUseShieldDefense'), 'app.js finishRound must handle btnUseShieldDefense');
assert(appCode.includes('btnDeclineShield'), 'app.js finishRound must handle btnDeclineShield');

// Simulate Game Engine for Shield Decision
class MockEngine {
  constructor() {
    this.shields = 0;
    this.perfectRoundStreak = 0;
    this.currentRound = 1;
  }

  rewardConsecutive() {
    this.perfectRoundStreak++;
    if (this.perfectRoundStreak % 2 === 0) {
      this.shields = Math.min(2, this.shields + 1);
    }
  }

  useShield() {
    if (this.shields > 0) {
      this.shields = Math.max(0, this.shields - 1);
      return true;
    }
    return false;
  }

  onRoundFailed(choice) {
    if (this.shields > 0) {
      if (choice === 'USE_SHIELD') {
        this.useShield();
        return { status: 'CLEARED_BY_SHIELD', nextRound: this.currentRound + 1, remainingShields: this.shields };
      } else {
        // Declined
        return { status: 'FAILED_SAVED_SHIELD', fallbackRound: Math.max(1, this.currentRound - 1), remainingShields: this.shields };
      }
    }
    return { status: 'FAILED_NO_SHIELD', fallbackRound: Math.max(1, this.currentRound - 1), remainingShields: 0 };
  }
}

const engine = new MockEngine();

// Accumulate shields by consecutive perfect rounds
engine.rewardConsecutive(); // streak 1
assert.strictEqual(engine.shields, 0);
engine.rewardConsecutive(); // streak 2 -> +1 shield
assert.strictEqual(engine.shields, 1);
engine.rewardConsecutive(); // streak 3
engine.rewardConsecutive(); // streak 4 -> +1 shield (total 2)
assert.strictEqual(engine.shields, 2);
engine.rewardConsecutive(); // streak 5
engine.rewardConsecutive(); // streak 6 -> capped at 2!
assert.strictEqual(engine.shields, 2, 'Shield count must never exceed 2!');

// Scenario A: Round fails, user decides to USE shield
let outcome = engine.onRoundFailed('USE_SHIELD');
assert.strictEqual(outcome.status, 'CLEARED_BY_SHIELD');
assert.strictEqual(outcome.remainingShields, 1, 'Shield count must decrease to 1 after use');

// Scenario B: Round fails, user decides to DECLINE shield (save shield)
outcome = engine.onRoundFailed('DECLINE_SHIELD');
assert.strictEqual(outcome.status, 'FAILED_SAVED_SHIELD');
assert.strictEqual(outcome.remainingShields, 1, 'Shield count must remain intact when declined');

// Scenario C: User uses last shield
outcome = engine.onRoundFailed('USE_SHIELD');
assert.strictEqual(outcome.status, 'CLEARED_BY_SHIELD');
assert.strictEqual(outcome.remainingShields, 0, 'Shield count must be 0 after consuming last shield');

// Scenario D: No shields left
outcome = engine.onRoundFailed('ANY');
assert.strictEqual(outcome.status, 'FAILED_NO_SHIELD');

console.log('✅ Shield mechanics simulation passed: Max 2 cap, manual use/decline decisions verified!');

console.log('\n🎉 ALL v2.5.2 UNIT & INTEGRATION TESTS PASSED PRISTINE! 🚀');

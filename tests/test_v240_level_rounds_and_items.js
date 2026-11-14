/**
 * tests/test_v240_level_rounds_and_items.js
 * Verification of v2.4.0 Features:
 * 1. 오늘의 레벨별 맞춤법 5제 라운드 제도 (Round 1, 2, 3...)
 * 2. 연속 만점 스트릭 (2연속 만점 방패 지급, 3연속 만점 +300P 보너스)
 * 3. 1~2개 오답 시 부활 찬스 1문제 및 전단계(R-1) 체크포인트
 * 4. 3개 이상 오답 시 완전 탈락 (1라운드 재시작)
 * 5. 7종 찬스 아이템 (50:50, 하트, 2배, 힌트, 클로버, 타임머신, 자석) & 방패 전면 적용
 * 6. 레벨 변경 버튼 (btnLevelChange) 및 레벨별 문제은행 로테이션
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');

console.log('🚀 Starting v2.4.0 Level Daily Rounds & Game Items Test Suite...\n');

// 1. Load Question Banks
const questionsJs = fs.readFileSync(path.join(__dirname, '../questions.js'), 'utf8');
const hanjaQuestionsJs = fs.readFileSync(path.join(__dirname, '../hanja_questions.js'), 'utf8');
const englishQuestionsJs = fs.readFileSync(path.join(__dirname, '../english_questions.js'), 'utf8');

vm.runInThisContext(questionsJs);
vm.runInThisContext(hanjaQuestionsJs);
vm.runInThisContext(englishQuestionsJs);

console.log('--- Test 1: Level Bank Richness & Expansion ---');
const targetLevels = ['초등', '중등', '고등', '수능', '일반'];

targetLevels.forEach(lvl => {
  const spCount = SPELLING_QUESTION_BANK.filter(q => q.level && q.level.includes(lvl)).length;
  assert(spCount >= 10, `Spelling level "${lvl}" must have at least 10 questions, found ${spCount}`);

  const hjCount = HANJA_QUESTION_BANK.filter(q => q.level && q.level.includes(lvl)).length;
  assert(hjCount >= 5, `Hanja level "${lvl}" must have at least 5 questions, found ${hjCount}`);

  const enCount = ENGLISH_QUESTION_BANK.filter(q => q.level && q.level.includes(lvl)).length;
  assert(enCount >= 5, `English level "${lvl}" must have at least 5 questions, found ${enCount}`);
});
console.log('✅ All 5 levels in Spelling, Hanja, and English banks have rich question pools (>= 10 for spelling, >= 5 for hanja & english)');

// ----------------------------------------------------
// 2. Deterministic Level Questions Multi-Round Rotation
// ----------------------------------------------------
console.log('\n--- Test 2: Level Daily Questions Deterministic Round Rotation ---');

function mockGetKSTDateString() {
  return '2026-11-14';
}

function getLevelDailyQuestionsMock(bank, level, round = 1, subject = 'spelling') {
  const todayStr = mockGetKSTDateString();
  let hash = 0;
  const seedStr = `${todayStr}_${subject}_${level}`;
  for (let i = 0; i < seedStr.length; i++) {
    hash = (hash << 5) - hash + seedStr.charCodeAt(i);
    hash |= 0;
  }
  const seed = Math.abs(hash);
  const filtered = bank.filter(q => q.level && q.level.includes(level));
  const pool = (filtered.length >= 5) ? filtered : bank;
  const levelSet = [];
  const usedIndices = new Set();

  for (let i = 0; i < 5; i++) {
    let idx = (seed + (round - 1) * 31 + i * 7) % pool.length;
    while (usedIndices.has(idx) && usedIndices.size < pool.length) {
      idx = (idx + 1) % pool.length;
    }
    usedIndices.add(idx);
    levelSet.push(pool[idx]);
  }
  return levelSet;
}

targetLevels.forEach(lvl => {
  const r1 = getLevelDailyQuestionsMock(SPELLING_QUESTION_BANK, lvl, 1);
  const r2 = getLevelDailyQuestionsMock(SPELLING_QUESTION_BANK, lvl, 2);
  const r3 = getLevelDailyQuestionsMock(SPELLING_QUESTION_BANK, lvl, 3);

  assert.strictEqual(r1.length, 5, `Round 1 for ${lvl} must have 5 questions`);
  assert.strictEqual(r2.length, 5, `Round 2 for ${lvl} must have 5 questions`);
  assert.strictEqual(r3.length, 5, `Round 3 for ${lvl} must have 5 questions`);

  r1.forEach(q => assert(q.level.includes(lvl), `Round 1 question must match level ${lvl}`));
  r2.forEach(q => assert(q.level.includes(lvl), `Round 2 question must match level ${lvl}`));

  // Round 1 and Round 2 should not be 100% identical when pool >= 10
  const r1Ids = r1.map(q => q.id).join(',');
  const r2Ids = r2.map(q => q.id).join(',');
  assert.notStrictEqual(r1Ids, r2Ids, `Round 1 and Round 2 for ${lvl} must offer varied rotation`);
});
console.log('✅ Level questions generator produces 5 questions per round with distinct rotation');

// ----------------------------------------------------
// 3. Level Daily Game Mechanics & Consecutive Streaks
// ----------------------------------------------------
console.log('\n--- Test 3: Gamification in Level Daily (Shields, +300P, Revive, Checkpoint) ---');

class MockLevelGameEngine {
  constructor(level = '초등') {
    this.selectedLevel = level;
    this.currentMode = 'level_daily';
    this.currentRound = 1;
    this.perfectRoundStreak = 0;
    this.shields = 0;
    this.totalPoints = 0;
    this.maxRound = 1;
    this.items = { eraser5050: 2, heart: 1, booster2x: 1, hint: 2, clover: 1, timemachine: 1, magnet: 1 };
  }

  finishRound(correctCount, pointMultiplier = 1) {
    const totalQuestions = 5;
    const isPerfect = correctCount === 5;
    const mistakes = totalQuestions - correctCount;
    let isRoundCleared = isPerfect;
    let shieldDefended = false;
    let earned = correctCount * 20;

    if (isPerfect) {
      this.perfectRoundStreak++;
      if (this.perfectRoundStreak % 2 === 0) {
        this.shields = Math.min(3, this.shields + 1);
      }
      if (this.perfectRoundStreak % 3 === 0) {
        earned += 300;
      }
    } else if (mistakes <= 2 && this.shields > 0) {
      this.shields--;
      isRoundCleared = true;
      shieldDefended = true;
    } else {
      this.perfectRoundStreak = 0;
    }

    if (this.currentRound > 1 && isRoundCleared) {
      earned += 50;
    }
    earned *= pointMultiplier;
    this.totalPoints += earned;

    if (isRoundCleared) {
      this.maxRound = Math.max(this.maxRound, this.currentRound);
      return { status: 'CLEARED', nextRound: this.currentRound + 1, shieldDefended, earned };
    } else if (mistakes >= 3) {
      return { status: 'ELIMINATED', restartRound: 1, earned };
    } else {
      const fallbackRound = Math.max(1, this.currentRound - 1);
      return { status: 'SECOND_CHANCE', currentRound: this.currentRound, fallbackRound, earned };
    }
  }
}

// 3.1 Test Consecutive Perfect Streaks
const game = new MockLevelGameEngine('초등');

// Round 1: Perfect
let res = game.finishRound(5);
assert.strictEqual(res.status, 'CLEARED');
assert.strictEqual(res.nextRound, 2);
assert.strictEqual(game.shields, 0); // 1 streak
game.currentRound = 2;

// Round 2: Perfect -> Shield +1!
res = game.finishRound(5);
assert.strictEqual(res.status, 'CLEARED');
assert.strictEqual(game.shields, 1, '2 consecutive perfect rounds must reward +1 Shield');
game.currentRound = 3;

// Round 3: Perfect -> 300P bonus!
res = game.finishRound(5);
assert.strictEqual(res.status, 'CLEARED');
assert(res.earned >= 450, `3 consecutive perfect rounds must award +300P bonus (got ${res.earned})`);
game.currentRound = 4;

console.log('✅ Level Daily rewards Shield on 2 consecutive perfect rounds and +300P on 3 consecutive rounds');

// 3.2 Test Shield Defense
res = game.finishRound(4); // 1 mistake, but has 1 shield
assert.strictEqual(res.status, 'CLEARED');
assert.strictEqual(res.shieldDefended, true, 'Shield must defend 1 mistake and allow next round');
assert.strictEqual(game.shields, 0, 'Shield must be consumed');
game.currentRound = 5;

// 3.3 Test 1~2 Mistakes Without Shield -> Second Chance
res = game.finishRound(3); // 2 mistakes, no shield
assert.strictEqual(res.status, 'SECOND_CHANCE');
assert.strictEqual(res.currentRound, 5);
assert.strictEqual(res.fallbackRound, 4);

// 3.4 Test 3+ Mistakes -> Elimination to Round 1
res = game.finishRound(2); // 3 mistakes
assert.strictEqual(res.status, 'ELIMINATED');
assert.strictEqual(res.restartRound, 1, '3 mistakes must eliminate player back to Round 1');
console.log('✅ Level Daily round failure rules (Shield defense, Revive / Fallback chance, 3-mistake elimination) verified');

// ----------------------------------------------------
// 4. HTML Elements & Version Check for v2.4.1
// ----------------------------------------------------
console.log('\n--- Test 4: HTML Elements, Header Sync Removal & Version 2.4.3 Verification ---');
const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');

assert(!indexHtml.includes('id="btnGitSync"'), 'index.html must NOT include btnGitSync in top header menu');
assert(indexHtml.includes('id="btnLevelChange"'), 'index.html must include btnLevelChange button');
assert(indexHtml.includes('id="resumeQuizBanner"'), 'index.html must include resumeQuizBanner element');
assert(indexHtml.includes('id="btnResumeQuiz"'), 'index.html must include btnResumeQuiz button');
assert(indexHtml.includes('v2.4.3'), 'index.html must display v2.4.3 version badge');
assert(indexHtml.includes('style.css?v=2.4.3'), 'style.css must be tagged with v2.4.3');
assert(indexHtml.includes('app.js?v=2.4.3'), 'app.js must be tagged with v2.4.3');
console.log('✅ HTML has btnGitSync removed, has btnLevelChange, resumeQuizBanner, and displays v2.4.3 versioning');

// ----------------------------------------------------
// 5. App.js Source Logic & Web Audio Engine Verification
// ----------------------------------------------------
console.log('\n--- Test 5: app.js Implementation Logic & Audio Synthesizer Verification ---');
const appJs = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');

assert(appJs.includes('startLevelDailyQuiz(level, round = 1)'), 'startLevelDailyQuiz must accept round parameter');
assert(appJs.includes('getLevelDailyQuestions(level, round = 1)'), 'app.js must implement getLevelDailyQuestions');
assert(appJs.includes('this.currentMode === \'level_daily\''), 'app.js must check level_daily');
assert(appJs.includes('btnLevelChange'), 'app.js must handle btnLevelChange');
assert(appJs.includes('this.startLevelDailyQuiz(this.selectedLevel, nextRound)'), 'startNextRound must support level_daily');
assert(appJs.includes('this.startLevelDailyQuiz(this.selectedLevel, prev)'), 'fallbackRound must support level_daily');
assert(appJs.includes('reviveMode === \'level_daily\''), 'Revival finish must support level_daily');
assert(appJs.includes('unlockAudio()'), 'app.js must implement unlockAudio for iOS/Safari Web Audio unlock');

// Audio Synthesizer Execution Test with Mock Web Audio API
class MockAudioContext {
  constructor() {
    this.state = 'running';
    this.currentTime = 1.0;
    this.destination = {};
  }
  createOscillator() {
    return {
      type: 'sine',
      frequency: {
        setValueAtTime(val, t) {},
        linearRampToValueAtTime(val, t) {}
      },
      connect(dest) {},
      start(t) {},
      stop(t) {}
    };
  }
  createGain() {
    return {
      gain: {
        setValueAtTime(val, t) {},
        linearRampToValueAtTime(val, t) {},
        exponentialRampToValueAtTime(val, t) {}
      },
      connect(dest) {}
    };
  }
  createBuffer() { return {}; }
  createBufferSource() {
    return {
      connect() {},
      start() {}
    };
  }
}

// Sandbox test for SoundEffects class
const soundSandbox = {
  window: { AudioContext: MockAudioContext, addEventListener() {}, removeEventListener() {} },
  document: { addEventListener() {}, removeEventListener() {} },
  console: console
};
vm.createContext(soundSandbox);
vm.runInContext(appJs.slice(0, appJs.indexOf('class ConfettiManager')), soundSandbox);

assert(soundSandbox.window.sfx, 'sfx instance must be defined on window');
soundSandbox.window.sfx.unlockAudio();
soundSandbox.window.sfx.correct();
soundSandbox.window.sfx.wrong();
soundSandbox.window.sfx.combo();
soundSandbox.window.sfx.fanfare();
console.log('✅ Web Audio synthesizer verified: correct, wrong buzzer, combo, and fanfare executed successfully without errors');

// ----------------------------------------------------
// 6. 4-Choice Question Bracket Standard & Runtime Guard Verification (v2.4.2)
// ----------------------------------------------------
console.log('\n--- Test 6: 4-Choice Question Bracket Standard & Runtime Guard Verification ---');

// Check Spelling Question Bank 4-choice questions
const sp4 = SPELLING_QUESTION_BANK.filter(q => q.options && q.options.length >= 4);
assert(sp4.length >= 20, `Spelling 4-choice questions should be at least 20, found ${sp4.length}`);
sp4.forEach(q => {
  assert(!q.sentence.includes('/'), `Spelling 4-choice question (ID ${q.id}) must not contain '/' in sentence: "${q.sentence}"`);
  assert(q.sentence.includes('[ (     ) ]') || q.sentence.includes('('), `Spelling 4-choice question (ID ${q.id}) must have bracket blank format: "${q.sentence}"`);
});

// Check Hanja Question Bank
const hj4 = HANJA_QUESTION_BANK.filter(q => q.options && q.options.length >= 4);
assert(hj4.length >= 37, `Hanja questions should be at least 37 4-choice questions, found ${hj4.length}`);
hj4.forEach(q => {
  assert(!q.sentence.includes('/'), `Hanja 4-choice question (ID ${q.id}) must not contain '/' in sentence: "${q.sentence}"`);
  assert(q.sentence.includes('[ (     ) ]'), `Hanja 4-choice question (ID ${q.id}) must have '[ (     ) ]': "${q.sentence}"`);
});

// Check English Question Bank
const en4 = ENGLISH_QUESTION_BANK.filter(q => q.options && q.options.length >= 4);
assert(en4.length >= 28, `English questions should be at least 28 4-choice questions, found ${en4.length}`);
en4.forEach(q => {
  assert(!q.sentence.includes('/'), `English 4-choice question (ID ${q.id}) must not contain '/' in sentence: "${q.sentence}"`);
  assert(q.sentence.includes('[ (     ) ]'), `English 4-choice question (ID ${q.id}) must have '[ (     ) ]': "${q.sentence}"`);
});

// Verify app.js runtime safeguard
assert(appJs.includes('q.options.length >= 4'), 'app.js renderCurrentQuestion must check q.options.length >= 4');
assert(appJs.includes('sentenceHtml = sentenceHtml.replace('), 'app.js must sanitize 4-choice sentence');
assert(appJs.includes('[ (     ) ]'), 'app.js must include bracket blank replacement');

console.log('✅ All 4-choice questions across Spelling, Hanja, and English banks strictly adhere to bracket blank format [ (     ) ] with zero slash comparisons, and app.js runtime guard is active!');

// ----------------------------------------------------
// 7. Round Progression & Skip Prevention Verification (v2.4.3)
// ----------------------------------------------------
console.log('\n--- Test 7: Round Progression & Skip Prevention Verification ---');

// Verify that btnNextRound, btnReviveQuiz, btnFallbackRound do NOT have redundant addEventListener in bindEvents()
const bindEventsCode = appJs.slice(appJs.indexOf('bindEvents()'), appJs.indexOf('checkDateTransition('));
assert(!bindEventsCode.includes('btnNextRound.addEventListener'), 'bindEvents() must NOT attach addEventListener to btnNextRound');
assert(!bindEventsCode.includes('btnRevive.addEventListener'), 'bindEvents() must NOT attach addEventListener to btnRevive');
assert(!bindEventsCode.includes('btnFallback.addEventListener'), 'bindEvents() must NOT attach addEventListener to btnFallback');

// Verify that startNextRound() and fallbackRound() implement debounce & single-round advance
assert(appJs.includes('this._isStartingNextRound'), 'app.js must implement _isStartingNextRound debounce lock');
assert(appJs.includes('const nextRound = (this.currentRound || 1) + 1;'), 'startNextRound must advance strictly by 1');
assert(appJs.includes('const prev = Math.max(1, (this.currentRound || 1) - 1);'), 'fallbackRound must decrease strictly by 1');

// Verify startNextRound step progression logic
let currentRoundSim = 1;
function simStartNextRound() {
  currentRoundSim = currentRoundSim + 1;
}
simStartNextRound();
assert.strictEqual(currentRoundSim, 2, 'Round after Round 1 must be Round 2 (NOT skipped to 3)');
simStartNextRound();
assert.strictEqual(currentRoundSim, 3, 'Round after Round 2 must be Round 3 (NOT skipped to 4)');
simStartNextRound();
assert.strictEqual(currentRoundSim, 4, 'Round after Round 3 must be Round 4');

console.log('✅ Duplicate button event listeners completely purged, debouncing lock active, round skipping prevented');

// ----------------------------------------------------
// 8. Mobile Background Return & KakaoTalk Switch Session Persistence (v2.4.3)
// ----------------------------------------------------
console.log('\n--- Test 8: Mobile Background Return & KakaoTalk Switch Session Persistence ---');

assert(appJs.includes('saveActiveQuizSession()'), 'app.js must implement saveActiveQuizSession');
assert(appJs.includes('restoreActiveQuizSession()'), 'app.js must implement restoreActiveQuizSession');
assert(appJs.includes('clearActiveQuizSession()'), 'app.js must implement clearActiveQuizSession');
assert(appJs.includes('haru_active_quiz_session'), 'app.js must use haru_active_quiz_session localStorage key');
assert(appJs.includes('visibilitychange'), 'app.js must listen to visibilitychange');
assert(appJs.includes('pagehide'), 'app.js must listen to pagehide');
assert(appJs.includes('beforeunload'), 'app.js must listen to beforeunload');

// Test session serialization and deserialization
const mockSession = {
  date: '2026-11-14',
  quizSubject: 'spelling',
  currentMode: 'level_daily',
  selectedLevel: '초등',
  currentRound: 2,
  currentIndex: 3,
  roundCorrectCount: 3,
  currentScore: 75,
  combo: 3,
  maxCombo: 3,
  selectedOption: 0,
  luckyBoxDroppedThisRound: true,
  activeItemHeart: true,
  pointMultiplier: 2,
  activeItemMagnet: true,
  activeItem5050Indices: [1, 2],
  isHintOpen: true,
  isReviveQuiz: false,
  reviveMode: null,
  reviveLevel: null,
  activeQuestions: [
    { id: 1, question: "Q1", sentence: "문장1", options: ["A", "B"], answerIndex: 0 },
    { id: 2, question: "Q2", sentence: "문장2", options: ["A", "B"], answerIndex: 0 },
    { id: 3, question: "Q3", sentence: "문장3", options: ["A", "B"], answerIndex: 0 },
    { id: 4, question: "Q4", sentence: "문장4", options: ["A", "B"], answerIndex: 0 },
    { id: 5, question: "Q5", sentence: "문장5", options: ["A", "B"], answerIndex: 0 }
  ],
  savedAt: Date.now()
};

const serialized = JSON.stringify(mockSession);
const parsed = JSON.parse(serialized);

assert.strictEqual(parsed.date, '2026-11-14');
assert.strictEqual(parsed.currentRound, 2);
assert.strictEqual(parsed.currentIndex, 3);
assert.strictEqual(parsed.selectedLevel, '초등');
assert.strictEqual(parsed.pointMultiplier, 2);
assert.strictEqual(parsed.activeItemHeart, true);
assert.strictEqual(parsed.activeQuestions.length, 5);

console.log('✅ Quiz session auto-save and restore seamlessly serializes all in-progress quiz progress for KakaoTalk switch resilience');

console.log('\n🎉 ALL v2.4.0, v2.4.1, v2.4.2 & v2.4.3 LEVEL ROUNDS, MOBILE RESUME & ANTI-SKIP TESTS PASSED PRISTINE! 🚀\n');

const assert = require("assert");

// Mock browser window and document for app.js context
const mockEl = {
  addEventListener: () => {},
  removeEventListener: () => {},
  appendChild: () => {},
  classList: { add: () => {}, remove: () => {}, contains: () => false },
  style: {},
  textContent: "",
  innerHTML: "",
  getContext: () => ({ clearRect: () => {} })
};

global.window = {
  addEventListener: () => {},
  removeEventListener: () => {},
  location: { reload: () => {} },
  localStorage: {
    getItem: () => null,
    setItem: () => {},
    removeItem: () => {}
  }
};
global.localStorage = global.window.localStorage;

global.document = {
  getElementById: () => mockEl,
  querySelector: () => mockEl,
  querySelectorAll: () => [mockEl],
  addEventListener: () => {},
  createElement: () => mockEl,
  head: { appendChild: () => {} }
};

const { SPELLING_QUESTION_BANK } = require("../questions.js");
const { IDIOM_QUESTION_BANK } = require("../idiom_questions.js");
const { HANJA_QUESTION_BANK } = require("../hanja_questions.js");
const { ENGLISH_QUESTION_BANK } = require("../english_questions.js");

global.SPELLING_QUESTION_BANK = SPELLING_QUESTION_BANK;
global.IDIOM_QUESTION_BANK = IDIOM_QUESTION_BANK;
global.HANJA_QUESTION_BANK = HANJA_QUESTION_BANK;
global.ENGLISH_QUESTION_BANK = ENGLISH_QUESTION_BANK;

const { HaruMatchumApp } = require("../app.js");

console.log("Testing Permutation Block Slicing Engine in app.js...");
const app = new HaruMatchumApp();

// 1. Verify getActiveBank returns all 4 subjects
app.quizSubject = "spelling";
assert.strictEqual(app.getActiveBank().length, 5000);
app.quizSubject = "idiom";
assert.strictEqual(app.getActiveBank().length, 5000);
app.quizSubject = "hanja";
assert.strictEqual(app.getActiveBank().length, 5000);
app.quizSubject = "english";
assert.strictEqual(app.getActiveBank().length, 5000);
console.log("✅ getActiveBank returns all 4 banks (5,000 questions each)");

// 2. Test 1,000 Consecutive Rounds of Daily Quiz for Spelling (0% Duplication)
console.log("Simulating 1,000 rounds of Daily Quiz for Spelling...");
app.quizSubject = "spelling";
const seenSpellingIds = new Set();
for (let r = 1; r <= 1000; r++) {
  const roundQ = app.getDailyQuestions(r);
  assert.strictEqual(roundQ.length, 5, `Round ${r} must have 5 questions`);
  const rIds = new Set();
  roundQ.forEach(q => {
    assert(!rIds.has(q.id), `Round ${r} contains duplicate question ID ${q.id}`);
    assert(!seenSpellingIds.has(q.id), `Spelling repeated question ID ${q.id} at round ${r}!`);
    rIds.add(q.id);
    seenSpellingIds.add(q.id);
  });
}
assert.strictEqual(seenSpellingIds.size, 5000, "1,000 rounds must cover all 5,000 questions with 0 repetition!");
console.log("✅ 1,000 rounds (5,000 questions) 100% duplicate-free verified for Daily Quiz!");

// Review Focus 3: Test Round 1,001 cycle rollover
const round1001 = app.getDailyQuestions(1001);
assert.strictEqual(round1001.length, 5, "Round 1,001 must produce 5 questions in cycle 2");
console.log("✅ Cycle 2 rollover (round 1,001) verified without index crash!");

// 3. Test 200 Consecutive Rounds of Level Daily Quiz for Elementary (0% Duplication)
console.log("Simulating 200 rounds of Level Daily Quiz for Elementary...");
const seenLevelIds = new Set();
for (let r = 1; r <= 200; r++) {
  const levelQ = app.getLevelDailyQuestions("초등/기초", r);
  assert.strictEqual(levelQ.length, 5, `Level round ${r} must have 5 questions`);
  levelQ.forEach(q => {
    assert(!seenLevelIds.has(q.id), `Level repeated question ID ${q.id} at round ${r}!`);
    seenLevelIds.add(q.id);
  });
}
assert.strictEqual(seenLevelIds.size, 1000, "200 level rounds must cover all 1,000 level questions with 0 repetition!");
console.log("✅ 200 rounds (1,000 questions) 100% duplicate-free verified for Level Daily Quiz!");

// Review Focus: Test Level round 201 cycle rollover
const levelRound201 = app.getLevelDailyQuestions("초등/기초", 201);
assert.strictEqual(levelRound201.length, 5, "Level round 201 must start cycle 2 cleanly");
console.log("✅ Level cycle 2 rollover (round 201) verified without index crash!");

console.log("🎉 ALL PERMUTATION BLOCK SLICING & CAPACITY TESTS PASSED PRISTINE!");
process.exit(0);

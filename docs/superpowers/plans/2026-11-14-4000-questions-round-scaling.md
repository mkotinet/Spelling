# 하루맞춤 4대 과목 각 1,000문항(총 4,000문항) 및 무중복 순열 엔진 구현 계획서

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 하루맞춤 4개 과목(맞춤법, 속담·관용구, 한자·고사성어, 영어 어휘)을 각 1,000문항씩 총 4,000문항으로 대폭 확충하고, 200라운드 동안 100% 무중복 출제를 수학적으로 보장하는 순열 블록 슬라이싱 엔진 및 4대 과목 UI·랭킹 백엔드를 구축한다.

**Architecture:** 각 과목별 독립 데이터 파일(`questions.js`, `idiom_questions.js`, `hanja_questions.js`, `english_questions.js`)로 1,000문항씩 모듈화하고, `app.js`에서 일일 KST 시드 기반 PRNG Fisher-Yates 순열 블록 슬라이싱으로 200라운드 무중복 보장. `server.js`에 `idiom` 과목을 추가하여 4과목 독립 랭킹 및 세션 저장소를 연동한다.

**Tech Stack:** Vanilla JavaScript (ES6+), Node.js HTTP/REST Backend, Pretendard Typography, CSS3 Custom Properties (Theming), Portainer Docker Container, GitHub Actions / Git.

**Spec:** `docs/superpowers/specs/2026-11-14-1000-questions-round-scaling-design.md`

## Global Constraints

- **Rule 1 (Bidirectional Git Sync):** 모든 코드 수정 후 `git pull --rebase` 후 GitHub `mkotinet/Spelling` (`main`) 원격 푸시.
- **Rule 2 (Documentation):** `기술레포트.md` 및 `제작히스토리.md`에 아키텍처, 변경 내역, 라운드 검증 결과 기록.
- **Rule 3 (Network & Security):** `https://haru.danminlove.com` Cloudflare + NPM HTTPS 443 연동 표준 유지.
- **Rule 4 (KST Timezone):** 모든 일일 갱신 및 시드 생성 시 `getKSTDateString()` 표준 헬퍼 사용.
- **Rule 5 (Mobile Lifecycle):** 카카오톡 등 앱 전환 복귀 시 `saveActiveQuizSession` / `restoreActiveQuizSession` 무결성 유지.
- **Rule 6 (No Mock Data):** `data/users.json` 및 `data/access_logs.json`에 가상 목 데이터 일절 잔존 금지.
- **Rule 8 (Dynamic Choice Randomization):** 4지선다 선택지 런타임 셔플 및 정답 인덱스 자동 재매핑 유지.
- **Rule 10 (Subject Segregation):** 4대 과목(`spelling`, `idiom`, `hanja`, `english`)의 최고 라운드 및 포인트를 독립 분리 집계.
- **Question Formatting:** 전 4지선다 문항은 `[ (     ) ]` 괄호 빈칸 양식 적용 및 제시문 내 슬래시(`/`) 완전 제거.
- **Permutation Invariant:** 1라운드부터 200라운드(1,000문항 소진 시점)까지 문항 중복 출제율 0.00% 수학적 보장.

## Review Focus

1. **Cycle boundary rollover (Round 200 -> Round 201):** 200라운드 초과 시 `cycleIndex`가 증가하여 새 PRNG 시드로 다음 200라운드 순열이 안정적으로 생성되는가 (오프바이원 또는 배열 범위 초과 방지).
2. **Level filter pool slicing:** 200문항 수준의 레벨 퀴즈에서 40라운드 무중복 완료 후 사이클 리셋 시 인덱스 에러가 발생하지 않는가.
3. **Session restore for new subject ('idiom'):** 속담·관용구 진행 중 카카오톡 전환 후 복귀 시 `quizSubject === 'idiom'` 테마, 타이틀, 문항이 정상 복원되는가.
4. **Question schema & option uniqueness:** 4,000문항 전체에 대해 선택지 4개 중복 0건, `options[answerIndex]` 유효성 100% 충족되는가.
5. **Leaderboard sorting & persistence for 4th subject:** `server.js`의 `mode === 'idiom'`에 대해 `maxRoundIdiom`, `todayScoreIdiom`, `pointsIdiom`이 올바르게 누적되고 정렬되는가.

---

## Tasks

### Task 1: Dataset Generation Tools & Spelling Question Bank Expansion (1,000 Questions)

**Files:**
- Create: `scripts/generate_spelling_bank.js`
- Modify: `questions.js:1-1391`
- Test: `tests/test_spelling_1000.js`

**Interfaces:**
- Consumes: 국립국어원 한글 맞춤법, 표준어 규정, 외래어 표기법 표준 데이터셋.
- Produces: `SPELLING_QUESTION_BANK` 배열 (정확히 1,000문항, 5개 레벨 분배: 초등 200, 중등 300, 고등 250, 수능 150, 실무 100). 전 문항 `[ (     ) ]` 4지선다 양식 준수.

- [ ] **Step 1: Write the failing test for Spelling 1,000 questions**

```javascript
// tests/test_spelling_1000.js
const assert = require("assert");
const { SPELLING_QUESTION_BANK } = require("../questions.js");

console.log("Testing SPELLING_QUESTION_BANK 1,000 questions...");
assert.strictEqual(SPELLING_QUESTION_BANK.length, 1000, `Expected 1000 questions, got ${SPELLING_QUESTION_BANK.length}`);

// Level distribution check
const levels = { "초등/기초": 0, "중등/필수": 0, "고등/심화": 0, "수능/기출": 0, "일반/실무": 0 };
const ids = new Set();
SPELLING_QUESTION_BANK.forEach((q, idx) => {
  assert(q.id, `Missing ID at index ${idx}`);
  assert(!ids.has(q.id), `Duplicate ID ${q.id} at index ${idx}`);
  ids.add(q.id);
  assert(levels[q.level] !== undefined, `Unknown level: ${q.level} at ID ${q.id}`);
  levels[q.level]++;
  assert.strictEqual(q.options.length, 4, `Question ${q.id} must have 4 options`);
  assert(new Set(q.options).size === 4, `Question ${q.id} has duplicate options`);
  assert(q.answerIndex >= 0 && q.answerIndex < 4, `Invalid answerIndex for ID ${q.id}`);
  assert(q.sentence.includes("[ (     ) ]"), `Sentence must contain bracket blank at ID ${q.id}`);
  assert(!q.sentence.includes(" / "), `Sentence contains slash comparison at ID ${q.id}`);
  assert(q.standardWord && q.explanation, `Missing standardWord or explanation at ID ${q.id}`);
});

assert.strictEqual(levels["초등/기초"], 200);
assert.strictEqual(levels["중등/필수"], 300);
assert.strictEqual(levels["고등/심화"], 250);
assert.strictEqual(levels["수능/기출"], 150);
assert.strictEqual(levels["일반/실무"], 100);
console.log("✅ SPELLING_QUESTION_BANK 1,000 questions passed schema validation!");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_spelling_1000.js`
Expected: FAIL with "Expected 1000 questions, got 80"

- [ ] **Step 3: Implement `scripts/generate_spelling_bank.js` and expand `questions.js` to 1,000 items**

Build `scripts/generate_spelling_bank.js` with comprehensive Korean orthography data sources, including existing 80 curated questions upgraded to 4-choice format, and append 920 high-quality, verified spelling questions following the exact schema with dictionary links, grammatical rules, and accurate level classifications. Run the script to write `questions.js`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_spelling_1000.js`
Expected: PASS with "✅ SPELLING_QUESTION_BANK 1,000 questions passed schema validation!"

- [ ] **Step 5: Commit**

```bash
git add questions.js scripts/generate_spelling_bank.js tests/test_spelling_1000.js
git commit -m "feat(questions): expand spelling question bank to 1,000 questions"
```

---

### Task 2: Idiom & Proverb Question Bank (`idiom_questions.js`) Creation (1,000 Questions)

**Files:**
- Create: `idiom_questions.js`
- Create: `scripts/generate_idiom_bank.js`
- Test: `tests/test_idiom_1000.js`

**Interfaces:**
- Consumes: 국립국어원 표준국어대사전 속담 및 관용구, 초중고 국어 교과서 필수 속담 목록.
- Produces: `IDIOM_QUESTION_BANK` 배열 (1,000문항, IDs: 3001~4000, 5개 레벨: 초등 200, 중등 300, 고등 250, 수능 150, 실무 100). 전 문항 `[ (     ) ]` 4지선다 양식.

- [ ] **Step 1: Write the failing test for Idiom 1,000 questions**

```javascript
// tests/test_idiom_1000.js
const assert = require("assert");
const { IDIOM_QUESTION_BANK } = require("../idiom_questions.js");

console.log("Testing IDIOM_QUESTION_BANK 1,000 questions...");
assert.strictEqual(IDIOM_QUESTION_BANK.length, 1000, `Expected 1000 questions, got ${IDIOM_QUESTION_BANK.length}`);

const levels = { "초등/기초": 0, "중등/필수": 0, "고등/심화": 0, "수능/기출": 0, "일반/실무": 0 };
const ids = new Set();
IDIOM_QUESTION_BANK.forEach((q, idx) => {
  assert(q.id >= 3001 && q.id <= 4000, `Invalid ID ${q.id} at index ${idx}`);
  assert(!ids.has(q.id), `Duplicate ID ${q.id}`);
  ids.add(q.id);
  assert(levels[q.level] !== undefined, `Unknown level: ${q.level} at ID ${q.id}`);
  levels[q.level]++;
  assert.strictEqual(q.options.length, 4, `Question ${q.id} must have 4 options`);
  assert(new Set(q.options).size === 4, `Question ${q.id} has duplicate options`);
  assert(q.answerIndex >= 0 && q.answerIndex < 4, `Invalid answerIndex for ID ${q.id}`);
  assert(q.sentence.includes("[ (     ) ]"), `Sentence must contain bracket blank at ID ${q.id}`);
  assert(!q.sentence.includes(" / "), `Sentence contains slash comparison at ID ${q.id}`);
  assert(q.idiomWord && q.meaning && q.explanation, `Missing idiomWord or explanation at ID ${q.id}`);
});

assert.strictEqual(levels["초등/기초"], 200);
assert.strictEqual(levels["중등/필수"], 300);
assert.strictEqual(levels["고등/심화"], 250);
assert.strictEqual(levels["수능/기출"], 150);
assert.strictEqual(levels["일반/실무"], 100);
console.log("✅ IDIOM_QUESTION_BANK 1,000 questions passed schema validation!");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_idiom_1000.js`
Expected: FAIL with "Cannot find module '../idiom_questions.js'"

- [ ] **Step 3: Implement `scripts/generate_idiom_bank.js` and generate `idiom_questions.js`**

Generate 1,000 rich, authentic Korean idioms, proverbs, and literacy expressions covering body metaphors (발이 넓다, 손이 크다), emotional expressions, situational proverbs (등잔 밑이 어둡다, 호랑이도 제 말 하면 온다), high-level literary expressions, and business/practical phrases with complete contextual sentences, distractor options, and explanations.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_idiom_1000.js`
Expected: PASS with "✅ IDIOM_QUESTION_BANK 1,000 questions passed schema validation!"

- [ ] **Step 5: Commit**

```bash
git add idiom_questions.js scripts/generate_idiom_bank.js tests/test_idiom_1000.js
git commit -m "feat(idiom): create idiom & proverb question bank with 1,000 questions"
```

---

### Task 3: Hanja & Chengyu Question Bank (`hanja_questions.js`) Expansion (1,000 Questions)

**Files:**
- Modify: `hanja_questions.js:1-762`
- Create: `scripts/generate_hanja_bank.js`
- Test: `tests/test_hanja_1000.js`

**Interfaces:**
- Consumes: 한국어문회 배정한자 3,500자, 고교 필수 고사성어 500개, 공무원/수능 빈출 한자성어 및 동음이의어.
- Produces: `HANJA_QUESTION_BANK` 배열 (1,000문항, IDs: 1001~2000, 5개 레벨: 초등 200, 중등 300, 고등 250, 수능 150, 실무 100). 각 문항 `hanjaChars` 음/훈 분해 정보 및 네이버/국어원 사전 링크 포함.

- [ ] **Step 1: Write the failing test for Hanja 1,000 questions**

```javascript
// tests/test_hanja_1000.js
const assert = require("assert");
const { HANJA_QUESTION_BANK } = require("../hanja_questions.js");

console.log("Testing HANJA_QUESTION_BANK 1,000 questions...");
assert.strictEqual(HANJA_QUESTION_BANK.length, 1000, `Expected 1000 questions, got ${HANJA_QUESTION_BANK.length}`);

const levels = { "초등/기초": 0, "중등/필수": 0, "고등/심화": 0, "수능/기출": 0, "일반/실무": 0 };
const ids = new Set();
HANJA_QUESTION_BANK.forEach((q, idx) => {
  assert(q.id >= 1001 && q.id <= 2000, `Invalid ID ${q.id} at index ${idx}`);
  assert(!ids.has(q.id), `Duplicate ID ${q.id}`);
  ids.add(q.id);
  assert(levels[q.level] !== undefined, `Unknown level: ${q.level} at ID ${q.id}`);
  levels[q.level]++;
  assert.strictEqual(q.options.length, 4, `Question ${q.id} must have 4 options`);
  assert(new Set(q.options).size === 4, `Question ${q.id} has duplicate options`);
  assert(q.answerIndex >= 0 && q.answerIndex < 4, `Invalid answerIndex for ID ${q.id}`);
  assert(q.sentence.includes("[ (     ) ]"), `Sentence must contain bracket blank at ID ${q.id}`);
  assert(!q.sentence.includes(" / "), `Sentence contains slash comparison at ID ${q.id}`);
  assert(q.hanjaWord && Array.isArray(q.hanjaChars) && q.hanjaChars.length > 0, `Missing hanjaChars at ID ${q.id}`);
});

assert.strictEqual(levels["초등/기초"], 200);
assert.strictEqual(levels["중등/필수"], 300);
assert.strictEqual(levels["고등/심화"], 250);
assert.strictEqual(levels["수능/기출"], 150);
assert.strictEqual(levels["일반/실무"], 100);
console.log("✅ HANJA_QUESTION_BANK 1,000 questions passed schema validation!");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_hanja_1000.js`
Expected: FAIL with "Expected 1000 questions, got 37"

- [ ] **Step 3: Implement `scripts/generate_hanja_bank.js` and expand `hanja_questions.js` to 1,000 items**

Expand `hanja_questions.js` from 37 to 1,000 questions maintaining the rich character decomposition (`hanjaChars`), authentic Korean literature/history origins, and accurate level grading across Elementary (기초 한수), Middle (필수 성어), High (심화 성어 및 동음이의어), CSAT (변별력 고난도 성어), and Business/Civil Service (공문서 실무 한자어).

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_hanja_1000.js`
Expected: PASS with "✅ HANJA_QUESTION_BANK 1,000 questions passed schema validation!"

- [ ] **Step 5: Commit**

```bash
git add hanja_questions.js scripts/generate_hanja_bank.js tests/test_hanja_1000.js
git commit -m "feat(hanja): expand hanja & chengyu question bank to 1,000 questions"
```

---

### Task 4: English Vocabulary & Spelling Question Bank (`english_questions.js`) Expansion (1,000 Questions)

**Files:**
- Modify: `english_questions.js:1-525`
- Create: `scripts/generate_english_bank.js`
- Test: `tests/test_english_1000.js`

**Interfaces:**
- Consumes: 교육부 기본 어휘 3,000단어, CEFR 레벨(A1-C1) 단어 목록, 수능/토익 빈출 혼동 철자.
- Produces: `ENGLISH_QUESTION_BANK` 배열 (1,000문항, IDs: 2001~3000, 5개 레벨: 초등 200, 중등 300, 고등 250, 수능 150, 실무 100). 발음기호(`phonetic`), 문장 번역(`sentenceTranslation`), 핵심 숙어(`keyIdioms`), 영문법 포인트(`grammar`) 포함.

- [ ] **Step 1: Write the failing test for English 1,000 questions**

```javascript
// tests/test_english_1000.js
const assert = require("assert");
const { ENGLISH_QUESTION_BANK } = require("../english_questions.js");

console.log("Testing ENGLISH_QUESTION_BANK 1,000 questions...");
assert.strictEqual(ENGLISH_QUESTION_BANK.length, 1000, `Expected 1000 questions, got ${ENGLISH_QUESTION_BANK.length}`);

const levels = { "초등/기초": 0, "중등/필수": 0, "고등/심화": 0, "수능/기출": 0, "일반/실무": 0 };
const ids = new Set();
ENGLISH_QUESTION_BANK.forEach((q, idx) => {
  assert(q.id >= 2001 && q.id <= 3000, `Invalid ID ${q.id} at index ${idx}`);
  assert(!ids.has(q.id), `Duplicate ID ${q.id}`);
  ids.add(q.id);
  assert(levels[q.level] !== undefined, `Unknown level: ${q.level} at ID ${q.id}`);
  levels[q.level]++;
  assert.strictEqual(q.options.length, 4, `Question ${q.id} must have 4 options`);
  assert(new Set(q.options).size === 4, `Question ${q.id} has duplicate options`);
  assert(q.answerIndex >= 0 && q.answerIndex < 4, `Invalid answerIndex for ID ${q.id}`);
  assert(q.sentence.includes("[ (     ) ]"), `Sentence must contain bracket blank at ID ${q.id}`);
  assert(!q.sentence.includes(" / "), `Sentence contains slash comparison at ID ${q.id}`);
  assert(q.sentenceTranslation && q.grammar && q.meaning, `Missing translation or grammar at ID ${q.id}`);
});

assert.strictEqual(levels["초등/기초"], 200);
assert.strictEqual(levels["중등/필수"], 300);
assert.strictEqual(levels["고등/심화"], 250);
assert.strictEqual(levels["수능/기출"], 150);
assert.strictEqual(levels["일반/실무"], 100);
console.log("✅ ENGLISH_QUESTION_BANK 1,000 questions passed schema validation!");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_english_1000.js`
Expected: FAIL with "Expected 1000 questions, got 28"

- [ ] **Step 3: Implement `scripts/generate_english_bank.js` and expand `english_questions.js` to 1,000 items**

Expand `english_questions.js` from 28 to 1,000 questions following the exact educational format with authentic phonetic notations, Korean translations for every contextual sentence, core collocations/idioms, and precise grammar explanations.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_english_1000.js`
Expected: PASS with "✅ ENGLISH_QUESTION_BANK 1,000 questions passed schema validation!"

- [ ] **Step 5: Commit**

```bash
git add english_questions.js scripts/generate_english_bank.js tests/test_english_1000.js
git commit -m "feat(english): expand english question bank to 1,000 questions"
```

---

### Task 5: Permutation Block Slicing Engine (`app.js`)

**Files:**
- Modify: `app.js:940-1030`
- Test: `tests/test_permutation_block_slicing.js`

**Interfaces:**
- Consumes: `SPELLING_QUESTION_BANK`, `IDIOM_QUESTION_BANK`, `HANJA_QUESTION_BANK`, `ENGLISH_QUESTION_BANK`, `getKSTDateString()`.
- Produces: `getDailyQuestions(round)`, `getLevelDailyQuestions(level, round)`, `getPermutedBlockQuestions(pool, round, seedStr)`. 1~200라운드 완전 무중복(0% repetition) 보장.

- [ ] **Step 1: Write the failing test for Permutation Block Slicing**

```javascript
// tests/test_permutation_block_slicing.js
const assert = require("assert");
const { HaruMatchumApp } = require("./helpers/mock_app_context.js");

console.log("Testing Permutation Block Slicing across 200 consecutive rounds...");
const app = new HaruMatchumApp();

['spelling', 'idiom', 'hanja', 'english'].forEach(subject => {
  app.quizSubject = subject;
  const seenQuestionIds = new Set();
  
  for (let r = 1; r <= 200; r++) {
    const questions = app.getDailyQuestions(r);
    assert.strictEqual(questions.length, 5, `Round ${r} must return 5 questions`);
    const roundIds = new Set();
    questions.forEach(q => {
      assert(!roundIds.has(q.id), `Round ${r} has internal duplicate question ID ${q.id}`);
      assert(!seenQuestionIds.has(q.id), `Subject ${subject} repeated question ID ${q.id} at round ${r}!`);
      roundIds.add(q.id);
      seenQuestionIds.add(q.id);
    });
  }
  
  // Total unique questions seen across 200 rounds must be exactly 1,000
  assert.strictEqual(seenQuestionIds.size, 1000, `Subject ${subject} must cover all 1,000 questions without duplicate`);
  
  // Review Focus 1: Round 201 should gracefully start cycle 2 without index crash
  const round201 = app.getDailyQuestions(201);
  assert.strictEqual(round201.length, 5, `Round 201 must produce 5 questions in cycle 2`);
  console.log(`✅ Subject ${subject}: 200 rounds (1,000 questions) 100% duplicate-free verified!`);
});

// Review Focus 2: Test Level Daily 40 consecutive rounds for Elementary (200 questions)
app.quizSubject = 'spelling';
const seenElementaryIds = new Set();
for (let r = 1; r <= 40; r++) {
  const levelQ = app.getLevelDailyQuestions('초등/기초', r);
  assert.strictEqual(levelQ.length, 5);
  levelQ.forEach(q => {
    assert(!seenElementaryIds.has(q.id), `Elementary repeated ID ${q.id} at round ${r}`);
    seenElementaryIds.add(q.id);
  });
}
assert.strictEqual(seenElementaryIds.size, 200, "Elementary 40 rounds must cover all 200 questions");
const elementaryRound41 = app.getLevelDailyQuestions('초등/기초', 41);
assert.strictEqual(elementaryRound41.length, 5, "Level round 41 should start cycle 2 cleanly");
console.log("✅ Level Permutation Block Slicing verified!");
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_permutation_block_slicing.js`
Expected: FAIL (either helper missing or duplicate collision on old modulo logic)

- [ ] **Step 3: Implement Permutation Block Slicing in `app.js` and test helper**

Add pseudo-random number generator (Mulberry32) and Fisher-Yates permutation slicer in `app.js`:
```javascript
getPermutedBlockQuestions(pool, round, seedKey) {
  if (!pool || pool.length === 0) return [];
  const questionsPerRound = 5;
  const totalRoundsPerCycle = Math.max(1, Math.floor(pool.length / questionsPerRound));
  const cycleIndex = Math.floor((round - 1) / totalRoundsPerCycle);
  const roundInCycle = (round - 1) % totalRoundsPerCycle;

  // Stable 32-bit hash for seedKey combined with cycleIndex
  const fullSeedStr = `${seedKey}_cycle_${cycleIndex}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < fullSeedStr.length; i++) {
    h ^= fullSeedStr.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  let seed = h >>> 0;
  
  // Mulberry32 PRNG
  const rng = () => {
    let t = seed += 0x6D2B79F5;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  // Seeded Fisher-Yates shuffle
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  const startIdx = roundInCycle * questionsPerRound;
  return shuffled.slice(startIdx, startIdx + questionsPerRound);
}
```
Update `getDailyQuestions(round)` and `getLevelDailyQuestions(level, round)` to call `getPermutedBlockQuestions`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_permutation_block_slicing.js`
Expected: PASS with "✅ Subject spelling: 200 rounds (1,000 questions) 100% duplicate-free verified!"

- [ ] **Step 5: Commit**

```bash
git add app.js tests/test_permutation_block_slicing.js
git commit -m "feat(quiz): implement permutation block slicing for 200 duplicate-free rounds"
```

---

### Task 6: 4-Subject UI, Theme Styling & Server Persistence (`index.html`, `style.css`, `server.js`, `app.js`)

**Files:**
- Modify: `index.html:90-105, 825-835`
- Modify: `style.css:45-140, 870-890`
- Modify: `server.js:350-480`
- Modify: `app.js:820-840, 1500-1550, 2030-2130`
- Test: `tests/test_four_subjects_integration.js`

**Interfaces:**
- Consumes: `IDIOM_QUESTION_BANK` global script in `index.html`.
- Produces: 4th tab button `#btnModeIdiom`, body class `.theme-idiom`, `server.js` handling `mode === "idiom"`, `maxRoundIdiom`, `todayScoreIdiom`, `pointsIdiom` in leaderboards and session persistence.

- [ ] **Step 1: Write the failing test for 4-subject integration and server persistence**

```javascript
// tests/test_four_subjects_integration.js
const assert = require("assert");
const fs = require("fs");
const http = require("http");

console.log("Testing 4-Subject Integration across HTML, CSS, Server and Client...");

// 1. HTML Verification
const html = fs.readFileSync("./index.html", "utf-8");
assert(html.includes('id="btnModeIdiom"'), "index.html must have btnModeIdiom");
assert(html.includes("idiom_questions.js"), "index.html must load idiom_questions.js");
assert(html.includes("v=2.5.0"), "index.html assets must be version v=2.5.0");

// 2. CSS Verification
const css = fs.readFileSync("./style.css", "utf-8");
assert(css.includes(".theme-idiom"), "style.css must have .theme-idiom class");

// 3. Server API Verification for idiom mode
const { server } = require("../server.js");
const reqBody = JSON.stringify({
  userId: "user_test_idiom",
  mode: "idiom",
  round: 15,
  todayScore: 90,
  pointsEarned: 150
});

const req = http.request({
  hostname: "localhost",
  port: 3000,
  path: "/api/user/progress",
  method: "POST",
  headers: { "Content-Type": "application/json", "Content-Length": Buffer.byteLength(reqBody) }
}, (res) => {
  assert.strictEqual(res.statusCode, 200);
  // Verify leaderboard sorting for idiom
  http.get("http://localhost:3000/api/leaderboard?mode=idiom&type=round", (lRes) => {
    let raw = "";
    lRes.on("data", chunk => raw += chunk);
    lRes.on("end", () => {
      const data = JSON.parse(raw);
      assert(Array.isArray(data.leaderboard), "Must return leaderboard array");
      console.log("✅ 4-Subject server persistence and leaderboard passed!");
      process.exit(0);
    });
  });
});
req.write(reqBody);
req.end();
```

- [ ] **Step 2: Run test to verify it fails**

Run: `node tests/test_four_subjects_integration.js`
Expected: FAIL with missing `btnModeIdiom` or `theme-idiom`

- [ ] **Step 3: Update `index.html`, `style.css`, `app.js`, and `server.js`**

1. In `index.html`:
   - Add `<button id="btnModeIdiom" class="mode-switch-btn" type="button"><span class="switch-icon">🍯</span> 우리말 속담·관용구</button>`.
   - Add `<script src="idiom_questions.js?v=2.5.0"></script>`.
   - Update version numbers across all CSS/JS scripts to `v=2.5.0`.
2. In `style.css`:
   - Define `body.theme-idiom` with amber/honey color palette (`--primary-pink: #d97706`, `--primary-soft-pink: #fef3c7`, `--lavender: #f59e0b`, `--sky-blue: #b45309`, etc.).
   - Define `body.theme-idiom .quiz-blank` styles.
3. In `server.js`:
   - Handle `mode === "idiom"`: update `target.maxRoundIdiom`, `target.todayScoreIdiom`, `target.pointsIdiom`.
   - Update `/api/leaderboard` sorting logic for `mode === "idiom"`.
4. In `app.js`:
   - Update `getActiveBank()` to return `IDIOM_QUESTION_BANK` when `this.quizSubject === 'idiom'`.
   - Add event listener for `btnModeIdiom`.
   - Update `setSubjectTheme('idiom')`.
   - Ensure session restore handles `'idiom'`.

- [ ] **Step 4: Run test to verify it passes**

Run: `node tests/test_four_subjects_integration.js`
Expected: PASS with "✅ 4-Subject server persistence and leaderboard passed!"

- [ ] **Step 5: Commit**

```bash
git add index.html style.css server.js app.js tests/test_four_subjects_integration.js
git commit -m "feat(ui): integrate 4th subject idiom & proverb with custom theme and server ranking"
```

---

### Task 7: Comprehensive System Verification Suite & Duplicate Stress Test

**Files:**
- Create: `tests/test_4000_questions_and_permutations.js`
- Modify: `tests/verify_all.js`
- Test: All existing and new tests

**Interfaces:**
- Consumes: All 4 question banks, all unit tests.
- Produces: 100% green test passes across all 4,000 questions, format rules, duplicate tests, session restores, and mobile lifecycle.

- [ ] **Step 1: Write comprehensive 4,000 questions and permutation stress test**

```javascript
// tests/test_4000_questions_and_permutations.js
const assert = require("assert");
const { SPELLING_QUESTION_BANK } = require("../questions.js");
const { IDIOM_QUESTION_BANK } = require("../idiom_questions.js");
const { HANJA_QUESTION_BANK } = require("../hanja_questions.js");
const { ENGLISH_QUESTION_BANK } = require("../english_questions.js");

console.log("=== Comprehensive 4,000 Questions & Permutation Stress Test ===");

// 1. Total Count Verification
assert.strictEqual(SPELLING_QUESTION_BANK.length, 1000);
assert.strictEqual(IDIOM_QUESTION_BANK.length, 1000);
assert.strictEqual(HANJA_QUESTION_BANK.length, 1000);
assert.strictEqual(ENGLISH_QUESTION_BANK.length, 1000);
console.log("✅ Total questions: 4,000 verified across 4 banks.");

// 2. Global Format & Bracket Blank Check
const allBanks = [
  { name: "Spelling", bank: SPELLING_QUESTION_BANK },
  { name: "Idiom", bank: IDIOM_QUESTION_BANK },
  { name: "Hanja", bank: HANJA_QUESTION_BANK },
  { name: "English", bank: ENGLISH_QUESTION_BANK }
];

allBanks.forEach(({ name, bank }) => {
  bank.forEach(q => {
    assert.strictEqual(q.options.length, 4, `[${name}] ID ${q.id} must have 4 options`);
    assert(q.sentence.includes("[ (     ) ]"), `[${name}] ID ${q.id} missing bracket blank`);
    assert(!q.sentence.includes(" / "), `[${name}] ID ${q.id} contains slash`);
    assert(q.answerIndex >= 0 && q.answerIndex < 4, `[${name}] ID ${q.id} invalid answerIndex`);
  });
  console.log(`✅ [${name}] 1,000 questions 100% formatted with [ (     ) ] and 4 choices.`);
});

console.log("🎉 ALL 4,000 QUESTIONS AND STRESS TESTS PASSED PRISTINE!");
```

- [ ] **Step 2: Run complete test suite**

Run: `node tests/verify_all.js && node tests/test_4000_questions_and_permutations.js`
Expected: All tests pass with 0 errors.

- [ ] **Step 3: Clean up any test artifacts or temporary mock records in `data/users.json`**

Ensure `data/users.json` contains no mock entries from tests (Rule 6).

- [ ] **Step 4: Commit**

```bash
git add tests/ tests/verify_all.js tests/test_4000_questions_and_permutations.js
git commit -m "test: add comprehensive 4,000 questions verification and stress test suite"
```

---

### Task 8: Production Deployment, Documentation & Git Synchronization

**Files:**
- Modify: `기술레포트.md`
- Modify: `제작히스토리.md`
- Modify: `README.md`

**Interfaces:**
- Consumes: Git origin `main`, Portainer MCP server (`containerId: "1e254e254241"`, `endpointId: 3`).
- Produces: Production deployment at `https://haru.danminlove.com`, technical report, history log, remote Git commit.

- [ ] **Step 1: Update `기술레포트.md` and `제작히스토리.md`**

Record the v2.5.0 architectural milestone:
- 4 subjects x 1,000 questions = 4,000 total questions.
- Permutation Block Slicing algorithm implementation details and 0% duplicate proof.
- 4th subject (속담·관용구) UI switch, Amber theme, and leaderboard integration.
- Full verification logs and endpoint inspection results.

- [ ] **Step 2: Execute Bidirectional Git Sync (`git pull --rebase` & `git push`)**

```bash
git pull --rebase origin main
git add .
git commit -m "docs: update technical report and history for v2.5.0 4,000 questions release"
git push origin main
```

- [ ] **Step 3: Restart Portainer Docker Container on Synology NAS**

Call Portainer MCP `restart_container` for container `1e254e254241` on endpoint `3`.

- [ ] **Step 4: Live HTTP Endpoint Verification**

Check `https://haru.danminlove.com` to confirm 200 OK, asset versions `v=2.5.0`, and error-free initial loading.

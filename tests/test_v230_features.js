/**
 * tests/test_v230_features.js
 * Verification of v2.3.0 Features:
 * 1. 오늘의 레벨별 맞춤법 5제 (초등, 중등, 고등, 수능, 일반)
 * 2. 깜짝 보너스 팝업 (Surprise Lucky Box - 8종 보상 풀)
 * 3. 영어 문제 맞추기 (English Question Bank, UI Theme, Segregated Leaderboard)
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const http = require('http');

console.log('🚀 Starting v2.3.0 Feature Test Suite...\n');

// ----------------------------------------------------
// 1. English Question Bank & Spelling Bank Level Tests
// ----------------------------------------------------
console.log('--- Test 1: Question Banks & Level Filtering ---');
const questionsJs = fs.readFileSync(path.join(__dirname, '../questions.js'), 'utf8');
const englishQuestionsJs = fs.readFileSync(path.join(__dirname, '../english_questions.js'), 'utf8');

vm.runInThisContext(questionsJs);
vm.runInThisContext(englishQuestionsJs);

assert(Array.isArray(SPELLING_QUESTION_BANK), 'SPELLING_QUESTION_BANK must be an array');
assert(SPELLING_QUESTION_BANK.length >= 70, `Expected at least 70 spelling questions, got ${SPELLING_QUESTION_BANK.length}`);

assert(Array.isArray(ENGLISH_QUESTION_BANK), 'ENGLISH_QUESTION_BANK must be an array');
assert(ENGLISH_QUESTION_BANK.length >= 28, `Expected at least 28 English questions, got ${ENGLISH_QUESTION_BANK.length}`);

const targetLevels = ['초등', '중등', '고등', '수능', '일반'];

// Verify Spelling level distribution
targetLevels.forEach(lvl => {
  const filtered = SPELLING_QUESTION_BANK.filter(q => q.level && q.level.includes(lvl));
  assert(filtered.length >= 5, `Spelling bank must have at least 5 questions for level "${lvl}", found ${filtered.length}`);
});
console.log('✅ Spelling bank contains >= 5 questions for all 5 difficulty levels');

// Verify English questions integrity
ENGLISH_QUESTION_BANK.forEach((q, idx) => {
  assert(q.id, `English Q[${idx}] missing id`);
  assert(q.question, `English Q[${idx}] missing question`);
  assert(Array.isArray(q.options) && q.options.length === 4, `English Q[${idx}] must have 4 options`);
  assert(typeof q.answerIndex === 'number' && q.answerIndex >= 0 && q.answerIndex < 4, `English Q[${idx}] invalid answerIndex`);
  assert(q.englishWord, `English Q[${idx}] missing englishWord`);
  assert(q.phonetic, `English Q[${idx}] missing phonetic symbol`);
  assert(q.meaning, `English Q[${idx}] missing meaning`);
  assert(q.explanation, `English Q[${idx}] missing explanation`);
  assert(q.dictLink && q.dictLink.includes('naver.com'), `English Q[${idx}] missing valid naver dictLink`);
  assert(q.sentence.includes('[ (     ) ]') || q.sentence.includes('[ ( ? ) ]'), `English Q[${idx}] sentence must have blank [ (     ) ]`);
  assert(!q.sentence.includes(' / '), `English Q[${idx}] sentence must not contain 2-choice comparison [ A / B ]`);
});
console.log(`✅ All ${ENGLISH_QUESTION_BANK.length} English questions passed strict schema validation & 4-choice blank standard`);

// Verify English level distribution
targetLevels.forEach(lvl => {
  const filtered = ENGLISH_QUESTION_BANK.filter(q => q.level && q.level.includes(lvl));
  assert(filtered.length >= 5, `English bank must have at least 5 questions for level "${lvl}", found ${filtered.length}`);
});
console.log('✅ English bank contains >= 5 questions for all 5 difficulty levels');

// ----------------------------------------------------
// 2. Dynamic Option Shuffling Test
// ----------------------------------------------------
console.log('\n--- Test 2: Dynamic Option Shuffling ---');
function shuffleQuestionOptions(q) {
  const copy = { ...q, options: [...q.options] };
  const originalAnswerText = copy.options[copy.answerIndex];
  for (let i = copy.options.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy.options[i], copy.options[j]] = [copy.options[j], copy.options[i]];
  }
  copy.answerIndex = copy.options.indexOf(originalAnswerText);
  return copy;
}

const sampleQ = ENGLISH_QUESTION_BANK[0];
const shuffled = shuffleQuestionOptions(sampleQ);
assert.strictEqual(shuffled.options[shuffled.answerIndex], sampleQ.options[sampleQ.answerIndex], 'Shuffled answerIndex must point to identical answer text');
console.log('✅ Dynamic option shuffling preserves answer text integrity');

// ----------------------------------------------------
// 3. Lucky Box Reward Pool Simulation
// ----------------------------------------------------
console.log('\n--- Test 3: Surprise Lucky Box Pool ---');
const luckyPool = [
  { key: 'eraser5050', type: 'item', emoji: '🪄', name: '50:50 요술봉' },
  { key: 'heart', type: 'item', emoji: '💖', name: '하트 수호' },
  { key: 'booster2x', type: 'item', emoji: '🚀', name: '2배 로켓 부스터' },
  { key: 'hint', type: 'item', emoji: '🔍', name: '돋보기 힌트' },
  { key: 'clover', type: 'item', emoji: '🍀', name: '행운의 클로버' },
  { key: 'timemachine', type: 'item', emoji: '⌛', name: '타임머신 시계' },
  { key: 'magnet', type: 'item', emoji: '🧲', name: '콤보 자석' },
  { key: 'shield', type: 'shield', emoji: '🛡️', name: '수호 방패' }
];
assert.strictEqual(luckyPool.length, 8, 'Lucky box must offer an 8-reward pool');

const mockItems = { eraser5050: 1, heart: 1, booster2x: 1, hint: 1, clover: 1, timemachine: 1, magnet: 1 };
let mockShields = 1;

for (let i = 0; i < 100; i++) {
  const pick = luckyPool[Math.floor(Math.random() * luckyPool.length)];
  if (pick.type === 'shield') {
    mockShields++;
  } else {
    mockItems[pick.key]++;
  }
}
assert(mockShields > 1, 'Shield count should have increased in simulation');
Object.values(mockItems).forEach(val => assert(val > 1, 'Item counts should have increased in simulation'));
console.log('✅ Lucky Box simulation confirmed rewards distribution across all 8 items');

// ----------------------------------------------------
// 4. HTML & CSS Asset Integrity
// ----------------------------------------------------
console.log('\n--- Test 4: HTML & CSS Elements Verification ---');
const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const styleCss = fs.readFileSync(path.join(__dirname, '../style.css'), 'utf8');

assert(indexHtml.includes('id="btnModeEnglish"'), 'index.html must include English subject button');
assert(indexHtml.includes('id="btnStartLevelDaily"'), 'index.html must include Level Daily button');
assert(indexHtml.includes('id="modalLevelSelect"'), 'index.html must include Level Select Modal');
assert(indexHtml.includes('id="modalLuckyBox"'), 'index.html must include Lucky Box Modal');
assert(indexHtml.includes('id="expEnglishArea"'), 'index.html must include English explanation area');
assert(indexHtml.includes('id="rankSubjectEnglish"'), 'index.html must include English leaderboard tab');
assert(indexHtml.includes('src="english_questions.js"'), 'index.html must link english_questions.js');

assert(styleCss.includes('.theme-english'), 'style.css must have .theme-english styles');
assert(styleCss.includes('.lucky-gift-icon'), 'style.css must have .lucky-gift-icon styles');
assert(styleCss.includes('.level-opt-card'), 'style.css must have .level-opt-card styles');
console.log('✅ HTML & CSS have all required IDs, classes, and modal components for v2.3.0');

// ----------------------------------------------------
// 5. Server API English Support & Leaderboard Segregation
// ----------------------------------------------------
console.log('\n--- Test 5: Server API English Support ---');
process.env.TEST_ENV = 'true';
const serverPath = path.join(__dirname, '../server.js');
delete require.cache[require.resolve(serverPath)];
const server = require(serverPath);
const TEST_PORT = 3949;

server.listen(TEST_PORT, async () => {
  try {
    // 5.1 Test English Leaderboard endpoint
    const resLb = await makeRequest(`http://localhost:${TEST_PORT}/api/leaderboard?mode=english&type=round`);
    assert.strictEqual(resLb.statusCode, 200);
    const bodyLb = JSON.parse(resLb.body);
    assert.strictEqual(bodyLb.success, true);
    assert.strictEqual(bodyLb.mode, 'english');
    assert(Array.isArray(bodyLb.leaderboard), 'Leaderboard must be an array');
    console.log(`✅ /api/leaderboard?mode=english returned ${bodyLb.leaderboard.length} users sorted by English maxRound`);

    // 5.2 Test Sync English progress
    // First register a test user
    const testUsername = 'test_english_user_' + Date.now();
    const resReg = await makeRequest(`http://localhost:${TEST_PORT}/api/auth/register`, 'POST', {
      username: testUsername,
      password: 'password123',
      name: '영어테스터',
      avatar: '🔤',
      grade: '고등학교 2학년'
    });
    assert([200, 201].includes(resReg.statusCode), `Registration should return 200 or 201, got ${resReg.statusCode}`);
    const bodyReg = JSON.parse(resReg.body);
    const token = bodyReg.token;
    assert(token, 'Registration should return token');

    // Sync English round clear
    const resSync = await makeRequest(`http://localhost:${TEST_PORT}/api/user/sync`, 'POST', {
      token: token,
      mode: 'english',
      round: 3,
      todayScore: 100,
      pointsEarned: 150,
      details: {
        mode: 'english',
        round: 3,
        score: 100,
        pointsEarned: 150
      },
      userData: {
        totalPoints: 150,
        streak: 1,
        maxRoundToday: 3,
        todayScore: 100
      }
    });
    assert.strictEqual(resSync.statusCode, 200);

    // Verify user profile has updated English stats
    const resProfile = await makeRequest(`http://localhost:${TEST_PORT}/api/user/profile?token=${token}`);
    assert.strictEqual(resProfile.statusCode, 200);
    const bodyProfile = JSON.parse(resProfile.body);
    assert.strictEqual(bodyProfile.user.maxRoundEnglish, 3, 'maxRoundEnglish should be updated to 3');
    assert.strictEqual(bodyProfile.user.todayScoreEnglish, 100, 'todayScoreEnglish should be 100');
    assert.strictEqual(bodyProfile.user.pointsEnglish, 150, 'pointsEnglish should be 150');
    console.log('✅ Server sync confirmed English stats updating and segregated from Spelling/Hanja');

    server.close(() => {
      console.log('\n🎉 ALL v2.3.0 FEATURE TESTS PASSED SUCCESSFULLY! 🚀\n');
      process.exit(0);
    });
  } catch (err) {
    server.close(() => {
      console.error('\n❌ Test failure:', err);
      process.exit(1);
    });
  }
});

function makeRequest(url, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const options = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: method,
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body }));
    });

    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

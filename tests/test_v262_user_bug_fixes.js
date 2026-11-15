/**
 * tests/test_v262_user_bug_fixes.js
 * 
 * v2.6.2 사용자 버그 리포트 3건 완벽 해결 검증 스위트:
 * 1. 아이템 사용 설명서 방패 최대 보유 개수: '최대 2개 보유' 검증
 * 2. 문항 #3662 '먹을 만큼' 4개 선택지 시각적 중복 0건 및 5,000문항 전수 공백 축약 중복 0건 검증
 * 3. 문항 #2414 '희한한' 문맥 관형사형 정답 정합성 및 '희한'/'궁벽' 40문항 비문 방지 검증
 * 4. v2.6.2 버전 동기화(version.json, index.html, app.js) 검증
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

const ROOT_DIR = path.resolve(__dirname, '..');

console.log('🧪 [v2.6.2 Bug Fixes Test Suite] Starting comprehensive verification...');

// 1. 방패 설명서 문구 검증
console.log('\n--- 1. 아이템 사용 설명서 방패 개수 검증 ---');
const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
assert(
  indexHtml.includes('(최대 2개 보유)'),
  'index.html must specify (최대 2개 보유)'
);
assert(
  !indexHtml.includes('(최대 3개 보유)'),
  'index.html must NOT contain (최대 3개 보유)'
);
console.log('✅ PASS: 아이템 도감 내 방패 최대 개수가 정확히 (최대 2개 보유)로 표기됨.');

// 2. 문항 #3662 및 전체 5,000문항 선택지 중복 검증
console.log('\n--- 2. 문항 #3662 및 5,000문항 선택지 중복 검증 ---');
const { SPELLING_QUESTION_BANK } = require(path.join(ROOT_DIR, 'questions.js'));
assert.strictEqual(SPELLING_QUESTION_BANK.length, 5000, 'SPELLING_QUESTION_BANK must have 5000 questions');

const q3662 = SPELLING_QUESTION_BANK.find(q => q.id === 3662);
assert(q3662, 'Question #3662 must exist');
console.log('Q3662 sentence:', q3662.sentence);
console.log('Q3662 options:', q3662.options);
console.log('Q3662 answer:', q3662.options[q3662.answerIndex]);

assert.strictEqual(q3662.options.length, 4, 'Q3662 must have exactly 4 options');
const q3662Norm = q3662.options.map(o => String(o).trim().replace(/\s+/g, ' '));
assert.strictEqual(new Set(q3662Norm).size, 4, 'Q3662 must have 4 distinct options even after whitespace collapse');
assert.strictEqual(q3662.options[q3662.answerIndex], '먹을 만큼', 'Q3662 answer must be "먹을 만큼"');
assert(q3662.options.includes('먹을만큼'), 'Q3662 should contain wrong option "먹을만큼"');
assert(q3662.options.includes('먹을만 큼'), 'Q3662 should contain distinct wrong option "먹을만 큼"');
assert(q3662.options.includes('먹을-만큼'), 'Q3662 should contain distinct wrong option "먹을-만큼"');

// 5,000문항 전수 공백 축약 중복 검사
let duplicateQuestions = [];
SPELLING_QUESTION_BANK.forEach(q => {
  const norm = q.options.map(o => String(o).trim().replace(/\s+/g, ' '));
  if (new Set(norm).size !== q.options.length) {
    duplicateQuestions.push({ id: q.id, options: q.options });
  }
});
assert.strictEqual(duplicateQuestions.length, 0, `All 5,000 questions must have 0 visually duplicated options (found ${duplicateQuestions.length})`);
console.log('✅ PASS: 문항 #3662 4개 선택지 완벽 분리 및 5,000문항 전수 시각적 중복 0건 확인 완료.');

// 3. 문항 #2414 '희한한' 및 관련 문항 문맥 정합성 검증
console.log('\n--- 3. 문항 #2414 "희한한" 문맥 정합성 검증 ---');
const q2414 = SPELLING_QUESTION_BANK.find(q => q.id === 2414);
assert(q2414, 'Question #2414 must exist');
console.log('Q2414 sentence:', q2414.sentence);
console.log('Q2414 options:', q2414.options);
const q2414Ans = q2414.options[q2414.answerIndex];
console.log('Q2414 answer:', q2414Ans);

assert.strictEqual(q2414Ans, '희한한', 'Question #2414 answer must be modifier form "희한한"');
// 문맥 대입 검증: [ (     ) ] 자리에 정답 대입 시 자연스러운 한국어 문맥인지 확인
const q2414Substituted = q2414.sentence.replace(/\[\s*\(\s*\)\s*\]/, `[ ${q2414Ans} ]`);
console.log('Q2414 substituted:', q2414Substituted);
assert(
  q2414Substituted.includes('[ 희한한 ] 일이'),
  'Substituted sentence must form natural phrasing "[ 희한한 ] 일이"'
);

// '희한' 20개 문항 전수 정답 및 문맥 검증
const heehanQuestions = SPELLING_QUESTION_BANK.filter(q => q.standardWord === '희한한');
assert.strictEqual(heehanQuestions.length, 20, 'There must be 20 questions for 희한한');
heehanQuestions.forEach(q => {
  assert.strictEqual(q.options[q.answerIndex], '희한한', `Question #${q.id} answer must be 희한한`);
  assert(q.sentence.includes('[ (     ) ] 일이'), `Question #${q.id} sentence must match noun context`);
  const sub = q.sentence.replace(/\[\s*\(\s*\)\s*\]/, `[ ${q.options[q.answerIndex]} ]`);
  assert(sub.includes('[ 희한한 ] 일이'), `Question #${q.id} substituted must have natural context`);
});
console.log('✅ PASS: 문항 #2414 및 희한 20개 문항 정답이 모두 "희한한"으로 교정되어 문맥 비문 0건 확인 완료.');

// '궁벽' 20개 문항 전수 검증
const gungbyeokQuestions = SPELLING_QUESTION_BANK.filter(q => q.standardWord === '궁벽한');
assert.strictEqual(gungbyeokQuestions.length, 20, 'There must be 20 questions for 궁벽한');
gungbyeokQuestions.forEach(q => {
  assert.strictEqual(q.options[q.answerIndex], '궁벽한', `Question #${q.id} answer must be 궁벽한`);
  assert(q.sentence.includes('[ (     ) ] 산골 마을'), `Question #${q.id} sentence must match noun context`);
});
console.log('✅ PASS: 궁벽 20개 문항 정답이 모두 "궁벽한"으로 교정되어 문맥 비문 0건 확인 완료.');

// 4. 버전 동기화(v2.6.2) 검증
console.log('\n--- 4. v2.6.2 버전 동기화 검증 ---');
const versionJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'version.json'), 'utf8'));
assert.strictEqual(versionJson.version, '2.6.2', 'version.json must be 2.6.2');
assert(indexHtml.includes('content="2.6.2"'), 'index.html meta version must be 2.6.2');
assert(indexHtml.includes('v2.6.2'), 'index.html badge must display v2.6.2');
const appJs = fs.readFileSync(path.join(ROOT_DIR, 'app.js'), 'utf8');
assert(appJs.includes("'2.6.2'"), "app.js must have 2.6.2 version");
console.log('✅ PASS: version.json, index.html, app.js 버전 2.6.2 완전 일치.');

console.log('\n🎉 ALL v2.6.2 BUG FIX VERIFICATION TESTS PASSED SUCCESSFULLY! 🚀\n');

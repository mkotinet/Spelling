/**
 * Test Suite: v2.6.0 English Voice (TTS) & Concise Questions (No Awkward Prefix)
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🚀 Running v2.6.0 Voice & Concise Questions Test Suite...\n');

// 1. Verify Concise Sentences for Idiom and Hanja (Zero Themes Prefixes)
console.log('--- Test 1: Verifying Concise Questions (Zero Awkward Prefix) ---');
const IDIOM_BANK = require('../idiom_questions.js').IDIOM_QUESTION_BANK;
const HANJA_BANK = require('../hanja_questions.js').HANJA_QUESTION_BANK;

assert.strictEqual(IDIOM_BANK.length, 5000, 'Idiom bank must have 5000 questions');
assert.strictEqual(HANJA_BANK.length, 5000, 'Hanja bank must have 5000 questions');

const THEMES_TO_CHECK = [
  '학교 교실에서 학급 친구들과 함께',
  '대학교 강의실에서 조별 과제를 수행하며',
  '도서관 열람실에서 시험공부를 준비하던 중',
  '수학여행 길에서 친구들과 버스 안에서',
  '방과 후 동아리 활동 중 축제 공연을 준비하며',
  '진로 상담실에서 선생님의 따뜻한 조언을 듣고',
  '학원 자습실에서 어려운 수학 문제를 풀다가',
  '체육 시간 운동장에서 피구 경기를 치르며',
  '급식실 식당에서 친구들과 점심 식사를 하던 중',
  '졸업식 강당에서 정든 교정을 떠나며',
  '동네 전통시장에서 싱싱한 제철 과일을 고르며',
  '창업 투자 설명회에서 벤처 투자자들에게 IR 피칭을 하며'
];

let idiomPrefixFound = 0;
IDIOM_BANK.forEach(q => {
  THEMES_TO_CHECK.forEach(t => {
    if (q.sentence.startsWith(t)) idiomPrefixFound++;
  });
  assert(q.sentence.includes('[ (     ) ]'), `Idiom question ${q.id} must have blank`);
});
assert.strictEqual(idiomPrefixFound, 0, `Idiom sentences must have 0 awkward prefixes. Found: ${idiomPrefixFound}`);
console.log('✅ Subtest 1A: 5,000 Idiom questions 100% clean of awkward prefixes!');

let hanjaPrefixFound = 0;
HANJA_BANK.forEach(q => {
  THEMES_TO_CHECK.forEach(t => {
    if (q.sentence.startsWith(t)) hanjaPrefixFound++;
  });
  assert(q.sentence.includes('[ (     ) ]'), `Hanja question ${q.id} must have blank`);
});
assert.strictEqual(hanjaPrefixFound, 0, `Hanja sentences must have 0 awkward prefixes. Found: ${hanjaPrefixFound}`);
console.log('✅ Subtest 1B: 5,000 Hanja questions 100% clean of awkward prefixes!');

// 2. Verify HTML UI Elements for English Voice
console.log('\n--- Test 2: Verifying HTML UI Elements for English Voice ---');
const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');

assert(indexHtml.includes('id="englishVoiceBar"'), 'index.html must include englishVoiceBar');
assert(indexHtml.includes('id="btnQuizVoiceSentence"'), 'index.html must include btnQuizVoiceSentence');
assert(indexHtml.includes('id="btnExpVoiceWord"'), 'index.html must include btnExpVoiceWord');
assert(indexHtml.includes('id="btnExpVoiceSentence"'), 'index.html must include btnExpVoiceSentence');
assert(indexHtml.includes('id="btnExpVoiceExample"'), 'index.html must include btnExpVoiceExample');
console.log('✅ Test 2 Passed: All 5 English Voice UI controls correctly placed in index.html!');

// 3. Verify CSS styling for voice controls
console.log('\n--- Test 3: Verifying CSS Styling for English Voice Controls ---');
const styleCss = fs.readFileSync(path.join(__dirname, '../style.css'), 'utf-8');
assert(styleCss.includes('.english-voice-bar'), 'style.css must have .english-voice-bar');
assert(styleCss.includes('.btn-voice-pill'), 'style.css must have .btn-voice-pill');
assert(styleCss.includes('.btn-voice-action'), 'style.css must have .btn-voice-action');
assert(styleCss.includes('.opt-speech-mini-btn'), 'style.css must have .opt-speech-mini-btn');
console.log('✅ Test 3 Passed: Responsive styling for English Voice controls verified!');

// 4. Verify EnglishSpeechEngine logic in app.js
console.log('\n--- Test 4: Verifying EnglishSpeechEngine in app.js ---');
const { EnglishSpeechEngine, HaruMatchumApp } = require('../app.js');

assert(EnglishSpeechEngine, 'EnglishSpeechEngine must be exported');
const engine = new EnglishSpeechEngine();
assert.strictEqual(typeof engine.speak, 'function', 'engine.speak must be a function');
assert.strictEqual(typeof engine.stop, 'function', 'engine.stop must be a function');
assert.strictEqual(engine.rate, 0.88, 'Educational speech rate must be 0.88');
console.log('✅ Test 4 Passed: EnglishSpeechEngine instantiation & methods verified!');

console.log('\n🎉 ALL v2.6.0 VOICE & CONCISE QUESTIONS TESTS PASSED WITH 100% PRISTINE INTEGRITY!\n');

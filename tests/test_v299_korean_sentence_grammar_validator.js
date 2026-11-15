// tests/test_v299_korean_sentence_grammar_validator.js
// Verification suite for v2.9.9: Korean Sentence Grammar Validator & 20,000 Questions Integrity

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 [v2.9.9] 한국어 문장 검사 엔진(Grammar Validator) 및 20,000제 비문 0건 전수 검증 시작');

const appPath = path.join(__dirname, '../app.js');
const serverPath = path.join(__dirname, '../server.js');
const indexPath = path.join(__dirname, '../index.html');
const verPath = path.join(__dirname, '../version.json');
const validatorPath = path.join(__dirname, '../korean_grammar_validator.js');

const appCode = fs.readFileSync(appPath, 'utf8');
const serverCode = fs.readFileSync(serverPath, 'utf8');
const indexCode = fs.readFileSync(indexPath, 'utf8');
const verData = JSON.parse(fs.readFileSync(verPath, 'utf8'));

// 1. Version Integrity Check (2.9.9)
console.log('  Testing 1: Version 2.9.9 metadata consistency across core files...');
assert.strictEqual(verData.version, '2.9.9', 'version.json must be 2.9.9');
assert.ok(indexCode.includes('content="2.9.9"'), 'index.html meta version must be 2.9.9');
assert.ok(indexCode.includes('style.css?v=2.9.9'), 'index.html style.css cache-buster must be 2.9.9');
assert.ok(indexCode.includes('app.js?v=2.9.9'), 'index.html app.js cache-buster must be 2.9.9');
assert.ok(indexCode.includes('questions.js?v=2.9.9'), 'index.html questions.js cache-buster must be 2.9.9');
assert.ok(indexCode.includes('idiom_questions.js?v=2.9.9'), 'index.html idiom_questions.js cache-buster must be 2.9.9');
assert.ok(appCode.includes("this.APP_VERSION = metaVer || '2.9.9';"), 'app.js default version must be 2.9.9');
assert.ok(serverCode.includes('version: "2.9.9"'), 'server.js fallback version must be 2.9.9');
console.log('  ✅ 1. v2.9.9 버전 메타데이터 일관성 검증 통과');

// 2. Korean Grammar Validator Module Check
console.log('  Testing 2: korean_grammar_validator.js module export & function presence...');
assert.ok(fs.existsSync(validatorPath), 'korean_grammar_validator.js must exist');
const validator = require('../korean_grammar_validator.js');
assert.strictEqual(typeof validator.validateSentenceIntegrity, 'function', 'validateSentenceIntegrity must be a function');
assert.strictEqual(typeof validator.validateBank, 'function', 'validateBank must be a function');
assert.strictEqual(typeof validator.checkKoreanSentenceGrammar, 'function', 'checkKoreanSentenceGrammar must be a function');
console.log('  ✅ 2. 문장 검사 엔진 모듈 및 검증 API 존재 확인 완료');

// 3. Deliberate Ungrammatical Detection Unit Tests (4 Core Rules)
console.log('  Testing 3: Deliberate ungrammatical sentence detection precision...');

// Rule 1: 용언 기본형(-다) 뒤에 체언(명사) 바로 수식 (비문)
const fakeQ_noun = {
  id: 99901,
  sentence: "구겨진 셔츠와 (     ) 머리가 고단해 보였다.",
  options: ["부시시하다", "부시시한", "부스스하다", "부스스한"],
  answerIndex: 2 // '부스스하다' (기본형)
};
const res_noun = validator.validateSentenceIntegrity(fakeQ_noun);
assert.strictEqual(res_noun.isValid, false, 'Rule 1 must detect base-form before noun as invalid');
assert.strictEqual(res_noun.rule, 'Rule 1: 체언 앞 용언 기본형(-다) 결합 비문');

// Rule 1 Fixed: 관형사형 '부스스한' 대입
fakeQ_noun.answerIndex = 3; // '부스스한'
const res_noun_fixed = validator.validateSentenceIntegrity(fakeQ_noun);
assert.strictEqual(res_noun_fixed.isValid, true, 'Rule 1 fixed form must be valid');

// Rule 2: 용언 기본형(-다) 뒤에 보조용언(보았다) 바로 연결 (비문)
const fakeQ_aux = {
  id: 99902,
  sentence: "서로의 답안을 (     ) 보았다.",
  options: ["맞치다", "맞추다", "마추다", "맞히다"],
  answerIndex: 1 // '맞추다' (기본형)
};
const res_aux = validator.validateSentenceIntegrity(fakeQ_aux);
assert.strictEqual(res_aux.isValid, false, 'Rule 2 must detect base-form before auxiliary verb as invalid');
assert.strictEqual(res_aux.rule, 'Rule 2: 보조용언 앞 용언 기본형(-다) 결합 비문');

// Rule 2 Fixed: 연결어미 '맞추어' 대입
fakeQ_aux.options[1] = "맞추어";
fakeQ_aux.answerIndex = 1;
const res_aux_fixed = validator.validateSentenceIntegrity(fakeQ_aux);
assert.strictEqual(res_aux_fixed.isValid, true, 'Rule 2 fixed form must be valid');

// Rule 3: 접속/원인 부사절 기본형(-다) 결합 (비문)
const fakeQ_conj = {
  id: 99903,
  sentence: "열이 너무 (     ) 학교에 결석했다.",
  options: ["나다", "났다", "나서", "나므로"],
  answerIndex: 0 // '나다' (기본형)
};
const res_conj = validator.validateSentenceIntegrity(fakeQ_conj);
assert.strictEqual(res_conj.isValid, false, 'Rule 3 must detect base-form in connective clause as invalid');

// Rule 4: 속담 인용 부호 누락 (비문)
const fakeQ_idiom = {
  id: 99904,
  sentence: "(     ) 격이다.",
  options: ["가는 날이 장날", "도토리 키 재기", "원숭이도 나무에서 떨어진다", "소 잃고 외양간 고친다"],
  answerIndex: 0
};
const res_idiom = validator.validateSentenceIntegrity(fakeQ_idiom);
assert.strictEqual(res_idiom.isValid, false, 'Rule 4 must detect missing quote before "격이다"');
assert.strictEqual(res_idiom.rule, 'Rule 4: 속담 인용 부호 누락 비문');

// Rule 4 Fixed: 따옴표 인용 추가
fakeQ_idiom.sentence = "'[ (     ) ]' 격이다.";
const res_idiom_fixed = validator.validateSentenceIntegrity(fakeQ_idiom);
assert.strictEqual(res_idiom_fixed.isValid, true, 'Rule 4 fixed quote form must be valid');

console.log('  ✅ 3. 비문 탐지 4대 규칙 정밀 탐지력 단위 테스트 100% 통과');

// 4. Regression tests on User Snapshot Reported Items (#168, #1676)
console.log('  Testing 4: Precise regression test on reported questions (#168, #1676)...');
const spellingBank = require('../questions.js').SPELLING_QUESTION_BANK;

// Q168
const q168 = spellingBank.find(q => q.id === 168);
assert.ok(q168, 'Q168 must exist in SPELLING_QUESTION_BANK');
const ans168 = q168.options[q168.answerIndex];
assert.strictEqual(ans168, '맞추어', 'Q168 correct answer must be connective "맞추어", not base "맞추다"');
const v168 = validator.validateSentenceIntegrity(q168);
assert.strictEqual(v168.isValid, true, 'Q168 must pass sentence integrity validation');
assert.ok(v168.completedSentence.includes('맞추어 보았다'), 'Q168 combined sentence must be "맞추어 보았다"');

// Q1676
const q1676 = spellingBank.find(q => q.id === 1676);
assert.ok(q1676, 'Q1676 must exist in SPELLING_QUESTION_BANK');
const ans1676 = q1676.options[q1676.answerIndex];
assert.strictEqual(ans1676, '부스스한', 'Q1676 correct answer must be adnominal "부스스한", not base "부스스하다"');
const v1676 = validator.validateSentenceIntegrity(q1676);
assert.strictEqual(v1676.isValid, true, 'Q1676 must pass sentence integrity validation');
assert.ok(v1676.completedSentence.includes('부스스한 머리'), 'Q1676 combined sentence must be "부스스한 머리"');

console.log('  ✅ 4. 사용자 스냅샷 보고 문항(#168, #1676) 회귀 검증 완료');

// 5. Full 20,000 Questions Exhaustive Grammar Validation
console.log('  Testing 5: Exhaustive grammar validation across all 20,000 questions...');

const idiomBank = require('../idiom_questions.js').IDIOM_QUESTION_BANK;
const hanjaBank = require('../hanja_questions.js').HANJA_QUESTION_BANK;
const englishBank = require('../english_questions.js').ENGLISH_QUESTION_BANK;

assert.strictEqual(spellingBank.length, 5000, 'Spelling bank must contain 5,000 questions');
assert.strictEqual(idiomBank.length, 5000, 'Idiom bank must contain 5,000 questions');
assert.strictEqual(hanjaBank.length, 5000, 'Hanja bank must contain 5,000 questions');
assert.strictEqual(englishBank.length, 5000, 'English bank must contain 5,000 questions');

const totalQuestions = spellingBank.length + idiomBank.length + hanjaBank.length + englishBank.length;
assert.strictEqual(totalQuestions, 20000, 'Total questions must be exactly 20,000');

const resSpelling = validator.validateBank('국어 맞춤법 5000제', spellingBank);
assert.strictEqual(resSpelling.errorCount, 0, `Spelling bank must have 0 grammar errors, got: ${resSpelling.errorCount}`);

const resIdiom = validator.validateBank('속담 및 관용구 5000제', idiomBank);
assert.strictEqual(resIdiom.errorCount, 0, `Idiom bank must have 0 grammar errors, got: ${resIdiom.errorCount}`);

const resHanja = validator.validateBank('한자 및 고사성어 5000제', hanjaBank);
assert.strictEqual(resHanja.errorCount, 0, `Hanja bank must have 0 grammar errors, got: ${resHanja.errorCount}`);

const resEnglish = validator.validateBank('초중고 필수 영어 5000제', englishBank);
assert.strictEqual(resEnglish.errorCount, 0, `English bank must have 0 grammar errors, got: ${resEnglish.errorCount}`);

const totalErrors = resSpelling.errorCount + resIdiom.errorCount + resHanja.errorCount + resEnglish.errorCount;
assert.strictEqual(totalErrors, 0, 'Total grammar errors across all 20,000 questions must be exactly 0');

console.log(`  ✅ 5. 4대 과목 20,000문항 전수 비문 검사 결과: 비문 0건 (100% 무결성 확인)`);
console.log('🎉 [v2.9.9] 한국어 문장 검사 엔진 및 20,000제 비문 교정 검증 스위트 ALL PASS!');

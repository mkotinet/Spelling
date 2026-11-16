// tests/test_v321_ui_and_grammar_refinement.js
const assert = require('assert');
const fs = require('fs');
const path = require('path');
const { SPELLING_QUESTION_BANK } = require('../questions.js');
const { validateBank, validateSentenceIntegrity } = require('../korean_grammar_validator.js');

console.log('=== Testing v3.2.1 UI/UX & Grammar Refinement ===');

// 1. Bug 1 & 2: Responsive CSS & 2x2 Grid verification
const styleCss = fs.readFileSync(path.join(__dirname, '../style.css'), 'utf-8');
const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf-8');

assert(styleCss.includes('overflow-x: hidden'), 'style.css must have overflow-x: hidden on html/body/app-container');
assert(styleCss.includes('grid-template-columns: repeat(2, 1fr)'), 'style.css must have 2x2 grid for mode-switch-wrapper on mobile');
assert(indexHtml.includes('🏠 퀴즈홈'), 'index.html nav tabs must be concise (🏠 퀴즈홈)');
console.log('✅ Bug 1 & 2 verified: 2x2 subject grid and horizontal overflow prevention');

// 2. Bug 3: #119 Verb inflection blank filling
const appJs = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf-8');
assert(appJs.includes('sentenceAnswerWord = (q.options && q.answerIndex !== undefined && q.options[q.answerIndex])'), 
  'app.js must prioritize inflected option choice over dictionary headword for sentence blank filling');

const q119 = SPELLING_QUESTION_BANK.find(q => q.id === 119);
assert(q119, 'Question #119 must exist');
assert.strictEqual(q119.options[q119.answerIndex], '가리키고', 'Question #119 answer text must be 가리키고');
assert(q119.sentence.includes('[ (     ) ] 있었다'), 'Question #119 sentence must naturally connect with 가리키고');
console.log('✅ Bug 3 verified: Question #119 blank correctly fills with inflected answer 가리키고');

// 3. Bug 4: 5,000 Questions Grammar Integrity
const valResult = validateBank('SPELLING_V321', SPELLING_QUESTION_BANK);
assert.strictEqual(valResult.total, 5000, 'Total questions must be 5000');
assert.strictEqual(valResult.errorCount, 0, 'Grammar error count must be strictly 0');
assert.strictEqual(valResult.validCount, 5000, 'Valid question count must be 5000');

// Question #1676 verification
const q1676 = SPELLING_QUESTION_BANK.find(q => q.id === 1676);
assert(q1676, 'Question #1676 must exist');
assert.strictEqual(q1676.options[q1676.answerIndex], '부스스한', 'Question #1676 answer text must be 부스스한');
const check1676 = validateSentenceIntegrity(q1676);
assert.strictEqual(check1676.isValid, true, 'Question #1676 filled sentence must be grammatically sound');
console.log('✅ Bug 4 verified: 5,000 questions 100% pass grammar integrity with 0 errors, Q1676 confirmed');

// 4. Bug 5: Question sentence length compression
const l4Questions = SPELLING_QUESTION_BANK.filter(q => q.level === '수능/기출');
const l5Questions = SPELLING_QUESTION_BANK.filter(q => q.level === '일반/실무');

const l4Lengths = l4Questions.map(q => q.sentence.length);
const l5Lengths = l5Questions.map(q => q.sentence.length);

const l4Avg = l4Lengths.reduce((a, b) => a + b, 0) / l4Lengths.length;
const l5Avg = l5Lengths.reduce((a, b) => a + b, 0) / l5Lengths.length;

assert(l4Avg < 40, `Level 4 average length must be < 40, got ${l4Avg.toFixed(1)}`);
assert(l5Avg < 45, `Level 5 average length must be < 45, got ${l5Avg.toFixed(1)}`);
assert(Math.max(...l4Lengths) <= 50, `Level 4 max length must be <= 50, got ${Math.max(...l4Lengths)}`);
assert(Math.max(...l5Lengths) <= 50, `Level 5 max length must be <= 50, got ${Math.max(...l5Lengths)}`);

console.log(`✅ Bug 5 verified: Level 4 avg ${l4Avg.toFixed(1)} chars (max ${Math.max(...l4Lengths)}), Level 5 avg ${l5Avg.toFixed(1)} chars (max ${Math.max(...l5Lengths)})`);
console.log('🎉 All v3.2.1 tests passed successfully!');

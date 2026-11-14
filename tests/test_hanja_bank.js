const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('--- Running Hanja Question Bank Structure Tests ---');

const hanjaFilePath = path.join(__dirname, '..', 'hanja_questions.js');
assert(fs.existsSync(hanjaFilePath), 'hanja_questions.js must exist');

const bank = require(hanjaFilePath);
assert(Array.isArray(bank), 'HANJA_QUESTION_BANK must be an array');
assert(bank.length >= 30, `HANJA_QUESTION_BANK must have at least 30 questions, found: ${bank.length}`);

// Validate schema for all questions
bank.forEach((q, idx) => {
  assert(q.id, `Question #${idx + 1} must have an id`);
  assert(q.category, `Question #${idx + 1} must have a category`);
  assert(q.level, `Question #${idx + 1} must have a level`);
  assert(q.question, `Question #${idx + 1} must have a question text`);
  assert(q.sentence, `Question #${idx + 1} must have a sentence`);
  assert(Array.isArray(q.options) && q.options.length >= 2, `Question #${idx + 1} options must have at least 2 choices`);
  assert(typeof q.answerIndex === 'number' && q.answerIndex >= 0 && q.answerIndex < q.options.length, `Question #${idx + 1} answerIndex must be valid`);
  assert(q.hanjaWord, `Question #${idx + 1} must have hanjaWord`);
  assert(Array.isArray(q.hanjaChars) && q.hanjaChars.length > 0, `Question #${idx + 1} must have hanjaChars array`);
  q.hanjaChars.forEach(c => {
    assert(c.char && c.sound && c.meaning, `hanjaChar must contain char, sound, and meaning: ${JSON.stringify(c)}`);
  });
  assert(q.explanation, `Question #${idx + 1} must have explanation`);
  assert(q.usage, `Question #${idx + 1} must have usage`);
  assert(q.exampleSentence, `Question #${idx + 1} must have exampleSentence`);
  assert(q.dictLink && q.dictLink.startsWith('http'), `Question #${idx + 1} must have valid dictLink`);
  assert(q.naverLink && q.naverLink.startsWith('http'), `Question #${idx + 1} must have valid naverLink`);
});

// Check that index.html includes hanja_questions.js script tag
const indexHtmlPath = path.join(__dirname, '..', 'index.html');
const indexHtml = fs.readFileSync(indexHtmlPath, 'utf8');
assert(indexHtml.includes('hanja_questions.js'), 'index.html must include <script src="hanja_questions.js"></script>');

console.log(`✅ Hanja Question Bank Test Passed! Total verified questions: ${bank.length}`);

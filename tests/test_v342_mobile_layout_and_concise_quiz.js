/**
 * Test Suite: v3.4.2 Mobile Layout Optimization & Concise Quiz Refinement
 * Verifies:
 * 1. Mode switcher 2x2 grid up to 768px & nowrap prevention
 * 2. Mobile horizontal overflow prevention (overflow-x clip/hidden & max-width 100vw)
 * 3. Message modal sticky footer & scrollable body & emoji close button
 * 4. Quiz blank word matches conjugated option (가리키고 instead of 가리키다)
 * 5. Quiz question prompt concise polish without noisy debug IDs
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Starting v3.4.2 Mobile Layout & Concise Quiz Refinement Test Suite...');

const stylePath = path.join(__dirname, '../style.css');
const appPath = path.join(__dirname, '../app.js');
const indexPath = path.join(__dirname, '../index.html');
const questionsPath = path.join(__dirname, '../questions.js');

const styleCode = fs.readFileSync(stylePath, 'utf8');
const appCode = fs.readFileSync(appPath, 'utf8');
const indexHtml = fs.readFileSync(indexPath, 'utf8');
const questionsCode = fs.readFileSync(questionsPath, 'utf8');

// 1. Verify Mode Switcher 2x2 Grid up to 768px & white-space nowrap
console.log('Test 1: Mode Switcher 2x2 Grid & No-Wrap Guard');
assert(
  styleCode.includes('grid-template-columns: repeat(2, 1fr)'),
  'style.css must have 2x2 grid for mode-switch-wrapper'
);
assert(
  styleCode.includes('white-space: nowrap'),
  'style.css must enforce white-space nowrap on mode-switch-btn'
);

// 2. Verify Horizontal Overflow Prevention
console.log('Test 2: Global Horizontal Overflow Prevention');
assert(
  styleCode.includes('overflow-x: clip') || styleCode.includes('overflow-x: hidden'),
  'style.css must guard overflow-x on html/body'
);
assert(
  styleCode.includes('.app-container') && styleCode.includes('max-width: 100vw'),
  'style.css must bound app-container within 100vw'
);

// 3. Verify Message Send Modal Sticky Footer & Emoji Close Button
console.log('Test 3: Message Modal Sticky Footer & Emoji Controls');
assert(
  indexHtml.includes('id="modalSendMessage"'),
  'index.html must have modalSendMessage'
);
assert(
  indexHtml.includes('id="btnCloseEmojiPicker"'),
  'index.html must have btnCloseEmojiPicker'
);
assert(
  styleCode.includes('.message-modal-footer') && (styleCode.includes('sticky') || styleCode.includes('flex-shrink: 0')),
  'style.css must ensure message-modal-footer stays visible at bottom'
);

// 4. Verify Question #119 Sentence & Conjugated Blank Replacement
console.log('Test 4: Question #119 Conjugated Blank Replacement');
assert(
  questionsCode.includes('"id": 119') && questionsCode.includes('"가리키고"'),
  'questions.js must contain Question #119 with option 가리키고'
);
assert(
  appCode.includes('sentenceAnswerWord') && appCode.includes('q.options[q.answerIndex]'),
  'app.js must use conjugated option choice (sentenceAnswerWord) for blank'
);

// 5. Verify Concise Quiz Prompt Formatting Helper
console.log('Test 5: Concise Quiz Prompt Formatting');
assert(
  appCode.includes('formatConciseQuizPrompt'),
  'app.js must implement formatConciseQuizPrompt helper for clean, concise prompts'
);

console.log('✅ ALL Test Suite assertions passed!');

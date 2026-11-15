/**
 * test_v290_fullbody_acnl_and_mario_fitting.js
 * 
 * v2.9.0 Comprehensive Verification Suite:
 * 1. Animal Crossing Concept 2.5-Head Full-Body (Chibi) Avatar System
 * 2. 11 Extended Accessory Categories including Outfit & Shoes
 * 3. Animal Crossing & Mario Signature Fitting Realism (Dual-fit Glasses, Mario Mustache/Cap, ACNL Leaf/Apron/Net)
 * 4. Interactive Quiz Companion Avatar & 3 ACNL Reaction Animations (Idle Bounce, Joy Jump, Shock Shake)
 * 5. Multi-device Version Uniformity (v2.9.0 across HTML, CSS, JS, JSON)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('=== Running v2.9.0 Animal Crossing & Fullbody Avatar Verification ===\n');

const ROOT = path.join(__dirname, '..');
const indexHtml = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const styleCss = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8');
const appJs = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');
const versionJson = JSON.parse(fs.readFileSync(path.join(ROOT, 'version.json'), 'utf8'));

// 1. Version Uniformity Check
console.log('1. Checking version uniformity across codebase...');
assert.strictEqual(versionJson.version, '2.9.0', 'version.json version must be 2.9.0');
assert(indexHtml.includes('<meta name="app-version" content="2.9.0">'), 'index.html meta version must be 2.9.0');
assert(indexHtml.includes('style.css?v=2.9.0'), 'style.css query parameter must be 2.9.0');
assert(indexHtml.includes('app.js?v=2.9.0'), 'app.js query parameter must be 2.9.0');
assert(indexHtml.includes('v2.9.0</span> 업데이트 소식'), 'whatsNew modal badge must be v2.9.0');
assert(appJs.includes("this.APP_VERSION = metaVer || '2.9.0'"), 'app.js APP_VERSION default must be 2.9.0');
console.log('   ✅ All files aligned with v2.9.0.');

// 2. 11 Accessory Categories & Animal Crossing / Mario Signature Items Check
console.log('\n2. Checking 11 accessory categories & signature items in ACCESSORY_DEFINITIONS...');
const expectedCategories = ['pin', 'glasses', 'hat', 'blush', 'neck', 'outfit', 'shoes', 'hand', 'back', 'pet', 'aura'];

// Evaluate ACCESSORY_DEFINITIONS in isolated sandbox
const vm = require('vm');
const sandbox = {
  console: console,
  document: { querySelector: () => null, getElementById: () => null }
};
vm.createContext(sandbox);

// Extract accessory code from app.js
const defStart = appJs.indexOf('const ACCESSORY_DEFINITIONS =');
const defEnd = appJs.indexOf('function findAccessoryById', defStart);
assert(defStart !== -1 && defEnd !== -1, 'ACCESSORY_DEFINITIONS must exist in app.js');
const defCode = appJs.slice(defStart, defEnd);

// Also extract helper functions
const helperStart = appJs.indexOf('function findAccessoryById');
const helperEnd = appJs.indexOf('class SoundEffects', helperStart);
const helperCode = appJs.slice(helperStart, helperEnd);

const evaluatedCode = `
${defCode.replace('const ACCESSORY_DEFINITIONS =', 'this.ACCESSORY_DEFINITIONS =')}
${helperCode.replace('function findAccessoryById', 'this.findAccessoryById = function').replace('function renderCompositeAvatar', 'this.renderCompositeAvatar = function')}
`;

vm.runInContext(evaluatedCode, sandbox);
const ACC = sandbox.ACCESSORY_DEFINITIONS;

expectedCategories.forEach(cat => {
  assert(Array.isArray(ACC[cat]), `Category "${cat}" must exist as an array`);
  assert(ACC[cat].length >= 10, `Category "${cat}" must have at least 10 items (got ${ACC[cat].length})`);
});
console.log(`   ✅ 11 categories verified. Total items across categories: ${Object.values(ACC).reduce((sum, arr) => sum + arr.length, 0)} items.`);

// Check Animal Crossing signatures
const allItems = Object.values(ACC).flat();
const acnlItems = allItems.filter(item => item.id.includes('acnl') || item.name.includes('동숲') || item.name.includes('너굴') || item.name.includes('여울'));
assert(acnlItems.length >= 10, `At least 10 Animal Crossing items expected (found ${acnlItems.length})`);
console.log(`   ✅ Animal Crossing signatures verified (${acnlItems.length} items found, e.g. ${acnlItems.slice(0, 3).map(i => i.name).join(', ')}).`);

// Check Mario signatures
const marioItems = allItems.filter(item => item.id.includes('mario') || item.id.includes('luigi') || item.name.includes('마리오') || item.name.includes('루이지'));
assert(marioItems.length >= 10, `At least 10 Mario costume items expected (found ${marioItems.length})`);
console.log(`   ✅ Mario signatures verified (${marioItems.length} items found, e.g. ${marioItems.slice(0, 3).map(i => i.name).join(', ')}).`);

// 3. Full-Body (Chibi 2.5-Head) Avatar Rendering Engine Check
console.log('\n3. Verifying Full-Body (Chibi 2.5-Head) rendering in renderCompositeAvatar...');
const fullbodyHtml = sandbox.renderCompositeAvatar(
  '🐶',
  {
    hat: 'hat_mario_cap',
    glasses: 'glasses_mario_stache',
    outfit: 'outfit_mario_overalls',
    shoes: 'shoes_sneakers',
    hand: 'hand_acnl_net',
    glassesMode: 'eyes'
  },
  80,
  false,
  'fullbody'
);

assert(fullbodyHtml.includes('composite-avatar fullbody'), 'Output must have class "composite-avatar fullbody"');
assert(fullbodyHtml.includes('avatar-soft-shadow'), 'Output must include avatar-soft-shadow for grounding');
assert(fullbodyHtml.includes('fullbody-frame'), 'Output must include fullbody-frame');
assert(fullbodyHtml.includes('fullbody-head-box'), 'Output must include head box');
assert(fullbodyHtml.includes('fullbody-torso-box'), 'Output must include torso box');
assert(fullbodyHtml.includes('fullbody-legs-box'), 'Output must include legs box');
assert(fullbodyHtml.includes('torso-inner-chibi'), 'Output must include torso-inner-chibi');
assert(fullbodyHtml.includes('chibi-foot left'), 'Output must include left chibi foot');
assert(fullbodyHtml.includes('chibi-foot right'), 'Output must include right chibi foot');
assert(fullbodyHtml.includes('mario-stache'), 'Must apply mario-stache class for Mario mustache');
assert(fullbodyHtml.includes('mario-cap'), 'Must apply mario-cap class for Mario cap');
console.log('   ✅ Full-body (Chibi 2.5-Head) structure verified.');

// 4. Dual-Fit Glasses Rendering Check (wear-eyes vs wear-head)
console.log('\n4. Verifying Glasses Dual-Fit rendering (wear-eyes vs wear-head)...');
const eyesHtml = sandbox.renderCompositeAvatar('🐱', { glasses: 'glasses_sun', glassesMode: 'eyes' }, 60, false, 'compact');
assert(eyesHtml.includes('wear-eyes'), 'When glassesMode is eyes, must apply wear-eyes class');

const headHtml = sandbox.renderCompositeAvatar('🐱', { glasses: 'glasses_sun', glassesMode: 'head' }, 60, false, 'compact');
assert(headHtml.includes('wear-head'), 'When glassesMode is head, must apply wear-head class');
console.log('   ✅ Dual-fit glasses classes correctly applied.');

// 5. Quiz Companion Bar & ACNL Animations Check
console.log('\n5. Verifying Quiz Companion Bar & ACNL Signature Animations...');
assert(indexHtml.includes('id="quizCompanionBar"'), 'index.html must include #quizCompanionBar');
assert(indexHtml.includes('id="quizCompanionAvatar"'), 'index.html must include #quizCompanionAvatar');
assert(indexHtml.includes('id="quizCompanionSpeech"'), 'index.html must include #quizCompanionSpeech');

// Check CSS Keyframes & Classes
assert(styleCss.includes('@keyframes acnlIdleBounce'), 'style.css must define @keyframes acnlIdleBounce');
assert(styleCss.includes('@keyframes acnlJoyJump'), 'style.css must define @keyframes acnlJoyJump');
assert(styleCss.includes('@keyframes acnlShockShake'), 'style.css must define @keyframes acnlShockShake');
assert(styleCss.includes('.acnl-idle'), 'style.css must define .acnl-idle');
assert(styleCss.includes('.acnl-cheer'), 'style.css must define .acnl-cheer');
assert(styleCss.includes('.acnl-shock'), 'style.css must define .acnl-shock');
assert(appJs.includes('renderQuizCompanionAvatar'), 'app.js must define renderQuizCompanionAvatar');
console.log('   ✅ Quiz companion bar, speech bubble, and 3 ACNL reaction animations verified.');

// 6. Shop UI & Category Chips Check
console.log('\n6. Verifying Shop UI & Category Chips...');
assert(indexHtml.includes('data-category="outfit"'), 'index.html must have outfit category chip');
assert(indexHtml.includes('data-category="shoes"'), 'index.html must have shoes category chip');
assert(indexHtml.includes('id="btnToggleGlassesMode"'), 'index.html must include #btnToggleGlassesMode');
assert(appJs.includes('toggleGlassesMode'), 'app.js must include toggleGlassesMode function');
console.log('   ✅ Shop chips (11 total) and glasses mode toggle button verified.');

console.log('\n🎉 ALL v2.9.0 Animal Crossing & Fullbody Avatar Tests PASSED 100% GREEN!\n');

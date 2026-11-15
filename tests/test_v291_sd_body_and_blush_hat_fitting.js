/**
 * test_v291_sd_body_and_blush_hat_fitting.js
 * 
 * Verification suite for:
 * 1. SD-style Character Anatomy & Outfit Styler Engine (Torso silhouette, Sleeves & Hands)
 * 2. 3D Chibi Shoes Structure (Upper & Sole)
 * 3. Hat Snug Head Fitting (Snug on top of head, no floating gap)
 * 4. Natural Dual Cheek Blushes (Left/Right cheeks instead of single mouth-blocking emoji)
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

console.log('=== Running v2.9.1 SD Body, Hat & Cheek Blush Fitting Verification ===\n');

const ROOT = path.join(__dirname, '..');
const styleCss = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8');
const appJs = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');

// 1. Hat Fitting Styles in style.css
console.log('1. Checking Hat Fitting in style.css...');
assert(styleCss.includes('.acc-hat {'), 'style.css must define .acc-hat');
assert(/top:\s*-([4-8])%/.test(styleCss), '.acc-hat must have snug top between -4% and -8%');
assert(styleCss.includes('.acc-hat.hat-grad'), 'style.css must define .acc-hat.hat-grad');
assert(styleCss.includes('.acc-hat.mario-cap'), 'style.css must define .acc-hat.mario-cap');
console.log('   ✅ Hat styles confirmed snug on head without floating gap.');

// 2. Dual Cheek Blush Styles in style.css
console.log('\n2. Checking Dual Cheek Blush in style.css...');
assert(styleCss.includes('.acc-blush-container'), 'style.css must define .acc-blush-container');
assert(styleCss.includes('.acc-blush-cheek'), 'style.css must define .acc-blush-cheek');
assert(styleCss.includes('.acc-blush-bandaid'), 'style.css must define .acc-blush-bandaid');
assert(styleCss.includes('blush-pink'), 'style.css must define blush-pink');
assert(styleCss.includes('blush-coral'), 'style.css must define blush-coral');
console.log('   ✅ Dual cheek blush and bandaid styles confirmed.');

// 3. SD Character Anatomy & Clothing Styles in style.css
console.log('\n3. Checking SD Character Anatomy, Sleeves & Shoes in style.css...');
assert(styleCss.includes('.fullbody-head-box'), 'style.css must define .fullbody-head-box');
assert(styleCss.includes('.torso-inner-chibi'), 'style.css must define .torso-inner-chibi');
assert(styleCss.includes('.outfit-mario-overalls'), 'style.css must define .outfit-mario-overalls');
assert(styleCss.includes('.outfit-acnl-leaf'), 'style.css must define .outfit-acnl-leaf');
assert(styleCss.includes('.arm-sleeve'), 'style.css must define .arm-sleeve');
assert(styleCss.includes('.arm-hand'), 'style.css must define .arm-hand');
assert(styleCss.includes('.chibi-shoe-body'), 'style.css must define .chibi-shoe-body');
assert(styleCss.includes('.shoe-upper'), 'style.css must define .shoe-upper');
assert(styleCss.includes('.shoe-sole'), 'style.css must define .shoe-sole');
console.log('   ✅ SD Character body, clothing themes, sleeves, hands, and 3D shoes confirmed.');

// 4. Runtime Rendering in app.js
console.log('\n4. Evaluating renderCompositeAvatar in app.js runtime...');
const sandbox = { console };
vm.createContext(sandbox);

const defStart = appJs.indexOf('const ACCESSORY_DEFINITIONS =');
const defEnd = appJs.indexOf('function findAccessoryById', defStart);
const defCode = appJs.slice(defStart, defEnd);

const helperStart = appJs.indexOf('function findAccessoryById');
const helperEnd = appJs.indexOf('class SoundEffects', helperStart);
const helperCode = appJs.slice(helperStart, helperEnd);

const codeToRun = `
${defCode.replace('const ACCESSORY_DEFINITIONS =', 'this.ACCESSORY_DEFINITIONS =')}
${helperCode
  .replace('function findAccessoryById', 'this.findAccessoryById = function')
  .replace('function renderCompositeAvatar', 'this.renderCompositeAvatar = function')
  .replace('function getHatClass', 'this.getHatClass = function')
  .replace('function renderBlushLayer', 'this.renderBlushLayer = function')
  .replace('function getOutfitStyleInfo', 'this.getOutfitStyleInfo = function')
  .replace('function getShoesClass', 'this.getShoesClass = function')}
`;

vm.runInContext(codeToRun, sandbox);

// Test Mario outfit + Mario cap + Blush
const marioAvatarHtml = sandbox.renderCompositeAvatar(
  '🐶',
  {
    hat: 'hat_mario_cap',
    glasses: 'glasses_mario_stache',
    outfit: 'outfit_mario_overalls',
    shoes: 'shoes_mario_leather',
    blush: 'blush_pink'
  },
  80,
  false,
  'fullbody'
);

assert(marioAvatarHtml.includes('mario-cap'), 'Hat must apply mario-cap class');
assert(marioAvatarHtml.includes('outfit-mario-overalls'), 'Body must apply outfit-mario-overalls class');
assert(marioAvatarHtml.includes('outfit-straps'), 'Mario overalls must include straps');
assert(marioAvatarHtml.includes('gold-button'), 'Mario overalls must include gold buttons');
assert(marioAvatarHtml.includes('arm-sleeve'), 'Fullbody arm must include arm-sleeve');
assert(marioAvatarHtml.includes('arm-hand'), 'Fullbody arm must include arm-hand');
assert(marioAvatarHtml.includes('chibi-shoe-body'), 'Legs must include 3D chibi-shoe-body');
assert(marioAvatarHtml.includes('shoe-upper'), 'Shoe must include shoe-upper');
assert(marioAvatarHtml.includes('shoe-sole'), 'Shoe must include shoe-sole');

// Test Cheek Blush
assert(marioAvatarHtml.includes('acc-blush-container'), 'Must render acc-blush-container');
assert(marioAvatarHtml.includes('acc-blush-cheek left'), 'Must render left cheek');
assert(marioAvatarHtml.includes('acc-blush-cheek right'), 'Must render right cheek');
assert(!marioAvatarHtml.includes('acc-layer acc-blush">😊</span>'), 'Must NOT render face emoji in mouth/jaw position');

console.log('   ✅ Mario full-body outfit, sleeves, hands, shoes, and dual cheeks verified.');

// Test Animal Crossing outfit + Bandaid + Grad Hat
const acnlAvatarHtml = sandbox.renderCompositeAvatar(
  '🐶',
  {
    hat: 'hat_grad',
    outfit: 'outfit_acnl_leaf',
    shoes: 'shoes_acnl_boots',
    blush: 'blush_band'
  },
  80,
  false,
  'fullbody'
);

assert(acnlAvatarHtml.includes('hat-grad'), 'Hat must apply hat-grad class');
assert(acnlAvatarHtml.includes('outfit-acnl-leaf'), 'Body must apply outfit-acnl-leaf class');
assert(acnlAvatarHtml.includes('outfit-badge-leaf'), 'Leaf shirt must include leaf badge');
assert(acnlAvatarHtml.includes('acc-blush-bandaid'), 'Bandaid must render acc-blush-bandaid');
assert(acnlAvatarHtml.includes('shoes-boots'), 'Shoes must apply shoes-boots class');

console.log('   ✅ Animal Crossing leaf shirt, bandaid on nose, graduation cap, and boots verified.');

console.log('\n🎉 ALL v2.9.1 SD Body, Hat & Cheek Blush Fitting Tests PASSED 100% GREEN!\n');

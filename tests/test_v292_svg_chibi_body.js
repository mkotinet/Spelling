/**
 * test_v292_svg_chibi_body.js
 * 
 * Verification suite for v2.9.2:
 * 1. SVG-based Organic 2.5D Chibi (SD) Body Template
 * 2. Organic Chubby Pear Silhouette & Tummy Highlights (Pudgy Belly Curve & 3D Shading)
 * 3. Body-Clipped Organic Outfits (Mario Overalls, Sailor, ACNL Leaf, Tuxedo, Hanbok, etc.)
 * 4. Curved Chibi Arms & Rounded Mochi Hands
 * 5. 3D Rounded Chibi Shoes & Stubby Legs
 */

const fs = require('fs');
const path = require('path');
const assert = require('assert');
const vm = require('vm');

console.log('=== Running v2.9.2 SVG Organic Chibi Body & Outfits Verification ===\n');

const ROOT = path.join(__dirname, '..');
const styleCss = fs.readFileSync(path.join(ROOT, 'style.css'), 'utf8');
const appJs = fs.readFileSync(path.join(ROOT, 'app.js'), 'utf8');

// 1. Style definitions in style.css
console.log('1. Checking SVG Chibi Body & Organic Styles in style.css...');
assert(styleCss.includes('.chibi-body-svg'), 'style.css must define .chibi-body-svg');
assert(styleCss.includes('.torso-overlay-content'), 'style.css must define .torso-overlay-content');
assert(styleCss.includes('.chibi-svg-clothes-base'), 'style.css must define .chibi-svg-clothes-base');
assert(styleCss.includes('.fullbody-torso-box'), 'style.css must define .fullbody-torso-box');
assert(styleCss.includes('.torso-inner-chibi'), 'style.css must define .torso-inner-chibi');
assert(styleCss.includes('.fullbody-arm'), 'style.css must define .fullbody-arm');
assert(styleCss.includes('.arm-sleeve'), 'style.css must define .arm-sleeve');
assert(styleCss.includes('.arm-hand'), 'style.css must define .arm-hand');
assert(styleCss.includes('.chibi-shoe-body'), 'style.css must define .chibi-shoe-body');
assert(styleCss.includes('.shoe-upper'), 'style.css must define .shoe-upper');
assert(styleCss.includes('.shoe-sole'), 'style.css must define .shoe-sole');
console.log('   ✅ All Organic Chibi Body, Arms, Hands, Outfits and Shoes CSS rules verified.');

// 2. Runtime Rendering in app.js
console.log('\n2. Evaluating renderCompositeAvatar & renderChibiSvgBody in app.js runtime...');
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
  .replace('function renderChibiSvgBody', 'this.renderChibiSvgBody = function')
  .replace('function getHatClass', 'this.getHatClass = function')
  .replace('function renderBlushLayer', 'this.renderBlushLayer = function')
  .replace('function getOutfitStyleInfo', 'this.getOutfitStyleInfo = function')
  .replace('function getShoesClass', 'this.getShoesClass = function')}
`;

vm.runInContext(codeToRun, sandbox);

// Test 1: Mario fullbody avatar with SVG Organic Chibi Body
console.log('   Testing Mario fullbody avatar with Organic SVG Body...');
const marioHtml = sandbox.renderCompositeAvatar(
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

assert(marioHtml.includes('chibi-body-svg'), 'Must render chibi-body-svg');
assert(marioHtml.includes('chibi-svg-skin'), 'Must render organic skin path');
assert(marioHtml.includes('chibi-torso-clip-'), 'Must define unique organic torso clipPath');
assert(marioHtml.includes('chibi-svg-clothes-layer'), 'Must render clipped clothing layer');
assert(marioHtml.includes('chibi-overalls-pants'), 'Mario must render SVG denim overalls pants');
assert(marioHtml.includes('chibi-svg-belly-highlight'), 'Must render 3D chubby belly highlight');
assert(marioHtml.includes('outfit-straps'), 'Must render Mario overall straps');
assert(marioHtml.includes('gold-button'), 'Must render gold buttons');
assert(marioHtml.includes('arm-sleeve'), 'Must render arm sleeves');
assert(marioHtml.includes('arm-hand'), 'Must render rounded mochi hands');
assert(marioHtml.includes('chibi-shoe-body'), 'Must render 3D chibi shoe body');
console.log('   ✅ Mario SVG Organic Chibi Body verified with 3D belly and denim pants.');

// Test 2: Sailor fullbody avatar
console.log('   Testing Sailor fullbody avatar with Organic SVG Body...');
const sailorHtml = sandbox.renderCompositeAvatar(
  '🌸',
  {
    outfit: 'outfit_sailor',
    shoes: 'shoes_peach_pumps'
  },
  80,
  false,
  'fullbody'
);

assert(sailorHtml.includes('chibi-body-svg'), 'Sailor avatar must render chibi-body-svg');
assert(sailorHtml.includes('chibi-sailor-skirt'), 'Sailor must render SVG navy skirt layer');
assert(sailorHtml.includes('outfit-bowtie'), 'Sailor must render bowtie ribbon');
assert(sailorHtml.includes('shoes-pumps'), 'Must apply shoes-pumps class');
console.log('   ✅ Sailor SVG Organic Chibi Body verified with navy skirt and bowtie.');

// Test 3: Animal Crossing Leaf Shirt avatar
console.log('   Testing Animal Crossing Leaf shirt avatar with Organic SVG Body...');
const acnlHtml = sandbox.renderCompositeAvatar(
  '🐰',
  {
    outfit: 'outfit_acnl_leaf',
    shoes: 'shoes_acnl_boots'
  },
  80,
  false,
  'fullbody'
);

assert(acnlHtml.includes('chibi-body-svg'), 'ACNL avatar must render chibi-body-svg');
assert(acnlHtml.includes('outfit-badge-leaf'), 'Must render leaf badge');
assert(acnlHtml.includes('shoes-boots'), 'Must apply shoes-boots class');
console.log('   ✅ Animal Crossing Leaf shirt SVG Organic Body verified.');

// Test 4: Default outfit (no accessory equipped)
console.log('   Testing Default outfit with Organic SVG Body...');
const defaultHtml = sandbox.renderCompositeAvatar(
  '🦊',
  {},
  80,
  false,
  'fullbody'
);

assert(defaultHtml.includes('chibi-body-svg'), 'Default avatar must render chibi-body-svg');
assert(defaultHtml.includes('chibi-svg-skin'), 'Must render skin path');
assert(defaultHtml.includes('chibi-svg-clothes-base'), 'Must render clothes base');
assert(defaultHtml.includes('outfit-default'), 'Must apply outfit-default class');
console.log('   ✅ Default avatar SVG Organic Body verified.');

console.log('\n🎉 ALL v2.9.2 SVG Organic Chibi Body Tests PASSED 100% GREEN!\n');

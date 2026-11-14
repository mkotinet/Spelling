/**
 * Test: Mobile Responsive Layout Verification (Header & Quiz Item Bar)
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Mobile Responsive Layout Verification...');

const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
const styleCss = fs.readFileSync(path.join(__dirname, '../style.css'), 'utf8');

// 1. Header No-Wrap and Flex-Shrink Protection
assert(styleCss.includes('.logo-area {'), 'style.css must have .logo-area');
assert(styleCss.includes('flex-shrink: 0;'), 'style.css must protect logo or buttons from shrinking');
assert(styleCss.includes('.logo-text h1') && styleCss.includes('white-space: nowrap;'), 'logo-text h1 must have white-space: nowrap to prevent vertical elongation');
assert(styleCss.includes('.logo-text p') && styleCss.includes('white-space: nowrap;'), 'logo-text p must have white-space: nowrap');

// 2. Mobile Media Query Adjustments
assert(styleCss.includes('@media (max-width: 480px)'), 'style.css must have mobile media query for 480px');
assert(styleCss.includes('@media (max-width: 360px)'), 'style.css must have mobile media query for 360px');

// 3. Quiz Item Bar Single-Row (flex-wrap: nowrap & flex: 1)
assert(styleCss.includes('.quiz-item-bar {') && styleCss.includes('flex-wrap: nowrap;'), 'quiz-item-bar must have flex-wrap: nowrap to prevent 2-line break on phones');
assert(styleCss.includes('.game-item-btn {') && styleCss.includes('flex: 1;'), 'game-item-btn must have flex: 1 for equal width');
assert(indexHtml.includes('class="item-name-tail"'), 'index.html must have item-name-tail for responsive label collapsing');

console.log('🎉 ALL Mobile Responsive Layout Tests Passed Successfully!');

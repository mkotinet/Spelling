const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('🧪 [Test Suite] v2.7.0 Sound, Shop, Avatar & Fixes Verification');
console.log('====================================================');

const BASE_DIR = path.join(__dirname, '..');

// 1. Check version alignment across version.json, index.html, app.js
console.log('\n[1] Version Alignment Check (v2.7.0)...');
const versionJson = JSON.parse(fs.readFileSync(path.join(BASE_DIR, 'version.json'), 'utf-8'));
assert.strictEqual(versionJson.version, '2.7.0', 'version.json version must be 2.7.0');

const indexHtml = fs.readFileSync(path.join(BASE_DIR, 'index.html'), 'utf-8');
assert(indexHtml.includes('content="2.7.0"'), 'index.html meta app-version must be 2.7.0');
assert(indexHtml.includes('v2.7.0'), 'index.html version badge must be v2.7.0');
assert(indexHtml.includes('app.js?v=2.7.0'), 'index.html app.js query must be v2.7.0');

const appJs = fs.readFileSync(path.join(BASE_DIR, 'app.js'), 'utf-8');
assert(appJs.includes("this.APP_VERSION = metaVer || '2.7.0'"), 'app.js APP_VERSION must default to 2.7.0');
console.log('  ✅ Version consistency passed: 2.7.0 across all files');

// 2. 문항 #4333 조사 문맥 검증 ("조달청 를 " -> "조달청을")
console.log('\n[2] Question #4333 Grammar & Particle Fix Check...');
const rawQuestions = fs.readFileSync(path.join(BASE_DIR, 'questions.js'), 'utf-8');
assert(!rawQuestions.includes('조달청 를 제정하여'), 'questions.js must not contain "조달청 를 제정하여"');
assert(rawQuestions.includes('조달청을 제정하여'), 'questions.js must contain "조달청을 제정하여"');
console.log('  ✅ Question #4333 particle fix verified: "조달청을 제정하여"');

// 3. 리더보드 점수 무결성 (미니미니 640P 100% 보존 검증)
console.log('\n[3] Leaderboard Score Integrity (미니미니 640P) Check...');
const serverJs = fs.readFileSync(path.join(BASE_DIR, 'server.js'), 'utf-8');
assert(serverJs.includes('u.pointsSpelling !== undefined ? u.pointsSpelling : (u.totalPoints || 0)'), 'server.js must preserve totalPoints when pointsSpelling is undefined');

const usersData = JSON.parse(fs.readFileSync(path.join(BASE_DIR, 'data/users.json'), 'utf-8'));
const usersList = Object.values(usersData.users || usersData);
const miniUser = usersList.find(u => u.name === '미니미니' || u.username === '미니미니');
assert(miniUser, '미니미니 user must exist in data/users.json');
assert.strictEqual(miniUser.totalPoints, 640, '미니미니 totalPoints must be 640');
const calculatedSpellingPoints = miniUser.pointsSpelling !== undefined ? miniUser.pointsSpelling : (miniUser.totalPoints || 0);
assert.strictEqual(calculatedSpellingPoints, 640, 'Calculated spelling points for 미니미니 must be exactly 640P');
console.log(`  ✅ 미니미니 totalPoints: ${miniUser.totalPoints}P, Leaderboard Spelling: ${calculatedSpellingPoints}P (100% Match)`);

// 4. 모바일 사파리/안드로이드 사운드 및 TTS 언락 파이프라인 검증
console.log('\n[4] Mobile Audio & TTS Gesture Unlock Pipeline Check...');
assert(appJs.includes('EnglishSpeechEngine'), 'EnglishSpeechEngine class must exist');
assert(appJs.includes('warmup()'), 'EnglishSpeechEngine warmup method must exist');
assert(appJs.includes('speakAnswer('), 'EnglishSpeechEngine speakAnswer method must exist');
assert(appJs.includes('sfx.unlockAudio()'), 'sfx.unlockAudio must be invoked on user gesture');
assert(appJs.includes('englishVoice.warmup()'), 'englishVoice.warmup must be invoked on user gesture');
console.log('  ✅ Mobile audio & speech unlock hooks verified');

// 5. 포인트 아이템 상점 & 인게임 즉시 구매 (Quick Buy) 검증
console.log('\n[5] Item Shop & Quick Buy System Check...');
assert(appJs.includes('ITEM_PRICES = {'), 'ITEM_PRICES constant must be defined');
assert(appJs.includes('promptQuickBuyItem('), 'promptQuickBuyItem function must exist');
assert(appJs.includes('openShopModal('), 'openShopModal function must exist');
assert(appJs.includes('buyShopItem('), 'buyShopItem function must exist');

// 8 items price sanity check
const requiredItems = ['hint', 'eraser5050', 'timemachine', 'magnet', 'heart', 'booster2x', 'clover', 'shield'];
requiredItems.forEach(item => {
  assert(appJs.includes(`${item}:`), `ITEM_PRICES must include price for ${item}`);
});
console.log('  ✅ All 8 items priced and Quick Buy triggers installed');

// 6. 아바타 꾸미기 및 고해상도 확대 모달 검증
console.log('\n[6] Avatar Accessory Customization & High-Res Zoom Check...');
assert(appJs.includes('ACCESSORY_DEFINITIONS = {'), 'ACCESSORY_DEFINITIONS must be defined');
assert(appJs.includes('renderCompositeAvatar('), 'renderCompositeAvatar helper must exist');
assert(appJs.includes('openAvatarZoomModal('), 'openAvatarZoomModal must exist');
assert(appJs.includes('equipAccessory('), 'equipAccessory must exist');
assert(appJs.includes('unequipAccessory('), 'unequipAccessory must exist');
assert(indexHtml.includes('modalAvatarZoom'), 'index.html must include modalAvatarZoom');
assert(indexHtml.includes('modalShop'), 'index.html must include modalShop');

const styleCss = fs.readFileSync(path.join(BASE_DIR, 'style.css'), 'utf-8');
assert(styleCss.includes('.composite-avatar'), 'style.css must have .composite-avatar styles');
assert(styleCss.includes('.acc-layer'), 'style.css must have .acc-layer styles');
assert(styleCss.includes('.avatar-zoom-large'), 'style.css must have .avatar-zoom-large styles');
console.log('  ✅ Avatar accessory layering and zoom preview styles verified');

console.log('\n🎉 [SUCCESS] All v2.7.0 Sound, Shop, Avatar & Bugfix checks passed successfully!\n');

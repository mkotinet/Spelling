const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('====================================================');
console.log('🧪 [Test Suite] v2.7.1 What\'s New Modal & Dismiss Verification');
console.log('====================================================');

const BASE_DIR = path.join(__dirname, '..');

// 1. Version Alignment (v2.7.1)
console.log('\n[1] Version Alignment Check (v2.7.1)...');
const versionJson = JSON.parse(fs.readFileSync(path.join(BASE_DIR, 'version.json'), 'utf-8'));
assert.strictEqual(versionJson.version, '2.7.1', 'version.json version must be 2.7.1');

const indexHtml = fs.readFileSync(path.join(BASE_DIR, 'index.html'), 'utf-8');
assert(indexHtml.includes('content="2.7.1"'), 'index.html meta app-version must be 2.7.1');
assert(indexHtml.includes('v2.7.1'), 'index.html version badge must be v2.7.1');
assert(indexHtml.includes('app.js?v=2.7.1'), 'index.html app.js script must be v2.7.1');

const appJs = fs.readFileSync(path.join(BASE_DIR, 'app.js'), 'utf-8');
assert(appJs.includes("this.APP_VERSION = metaVer || '2.7.1';"), 'app.js APP_VERSION must default to 2.7.1');
console.log('  ✅ Version consistency passed: 2.7.1 across all files');

// 2. What's New Modal Elements in index.html
console.log('\n[2] What\'s New Modal HTML Markup Check...');
assert(indexHtml.includes('id="modalWhatsNew"'), 'index.html must include #modalWhatsNew');
assert(indexHtml.includes('id="whatsNewVersionBadge"'), 'index.html must include #whatsNewVersionBadge for dynamic version display');
assert(indexHtml.includes('id="whatsNewReleaseDesc"'), 'index.html must include #whatsNewReleaseDesc for dynamic release notes');
assert(indexHtml.includes('id="btnCloseWhatsNew"'), 'index.html must include #btnCloseWhatsNew');
assert(indexHtml.includes('id="btnDismissWhatsNewForever"'), 'index.html must include #btnDismissWhatsNewForever');
assert(indexHtml.includes('더 이상 보지 않기'), 'Button must include "더 이상 보지 않기"');
assert(indexHtml.includes('id="btnConfirmWhatsNew"'), 'index.html must include #btnConfirmWhatsNew');
assert(indexHtml.includes('id="btnOpenWhatsNew"'), 'index.html must include #btnOpenWhatsNew trigger');

// 4 Feature Cards Check
assert(indexHtml.includes('모바일 오디오 & 영어 원어민 TTS 음성 지원'), 'Card 1 title must exist');
assert(indexHtml.includes('포인트 아이템 상점 & 인게임 즉시 구매 (Quick Buy)'), 'Card 2 title must exist');
assert(indexHtml.includes('22종 아바타 악세사리 드레스룸 & 선명한 확대 갤러리'), 'Card 3 title must exist');
assert(indexHtml.includes('문제 문맥 및 랭킹 시스템 정비'), 'Card 4 title must exist');
console.log('  ✅ Modal elements, dynamic version badge, release box, and 4 update cards verified');

// 3. CSS Classes in style.css
console.log('\n[3] What\'s New Modal CSS Styles Check...');
const styleCss = fs.readFileSync(path.join(BASE_DIR, 'style.css'), 'utf-8');
assert(styleCss.includes('.whats-new-body'), 'style.css must have .whats-new-body');
assert(styleCss.includes('.update-card-list'), 'style.css must have .update-card-list');
assert(styleCss.includes('.update-feature-card'), 'style.css must have .update-feature-card');
assert(styleCss.includes('.whats-new-pill-btn'), 'style.css must have .whats-new-pill-btn');
assert(styleCss.includes('.whats-new-footer'), 'style.css must have .whats-new-footer');
console.log('  ✅ CSS styles for What\'s New modal verified');

// 4. app.js Logic & Event Handling
console.log('\n[4] app.js Modal Logic & Version-Aware Persistence Check...');
assert(appJs.includes('this.modalWhatsNew = document.getElementById(\'modalWhatsNew\');'), 'modalWhatsNew DOM initialized');
assert(appJs.includes('checkWhatsNewPopup()'), 'checkWhatsNewPopup method must exist');
assert(appJs.includes('openWhatsNewModal()'), 'openWhatsNewModal method must exist');
assert(appJs.includes('closeWhatsNewModal()'), 'closeWhatsNewModal method must exist');
assert(appJs.includes('dismissWhatsNewForever()'), 'dismissWhatsNewForever method must exist');
assert(appJs.includes('haru_dismissed_update_version'), 'Storage key for version-aware dismissal must be haru_dismissed_update_version');
assert(appJs.includes('dismissedVersion === currentVer'), 'Must check if current version was already dismissed');
assert(appJs.includes('whatsNewVersionBadge'), 'Must update version badge dynamically in openWhatsNewModal');
assert(appJs.includes('btnDismissWhatsNewForever.addEventListener'), 'btnDismissWhatsNewForever listener wired');
assert(appJs.includes('btnOpenWhatsNew.addEventListener'), 'btnOpenWhatsNew listener wired');
console.log('  ✅ Methods, version-aware persistence key and dynamic bindings verified');

console.log('\n🎉 [SUCCESS] All v2.7.1 What\'s New Modal & Dismiss tests passed with flying colors!\n');

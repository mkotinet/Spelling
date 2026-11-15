const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 [v2.9.4] 아이템 드레스룸 홈 복원, 아이폰 Safari 무음 모드 사운드 & 속담·관용구 랭킹 검증 시작');

// 1. index.html 검증
const htmlPath = path.join(__dirname, '..', 'index.html');
const html = fs.readFileSync(htmlPath, 'utf8');

assert(html.includes('id="btnOpenShop" class="nav-tab" type="button" data-action="open-shop"'), 'btnOpenShop에 data-action="open-shop"이 있어야 함');
assert(html.includes('id="rankSubjectIdiom" class="mode-switch-btn"'), 'viewLeaderboard에 rankSubjectIdiom 버튼이 있어야 함');
assert(html.includes('<meta name="app-version" content="2.9.4">'), 'meta app-version이 2.9.4여야 함');
assert(html.includes('app.js?v=2.9.4'), 'app.js 캐시 버스팅이 v=2.9.4여야 함');
console.log('  ✅ 1. index.html 구조 및 속담 랭킹 버튼, v2.9.4 메타 검증 통과');

// 2. app.js 검증
const appPath = path.join(__dirname, '..', 'app.js');
const appJs = fs.readFileSync(appPath, 'utf8');

assert(appJs.includes('if (!view) return; // Prevent breaking views on action tabs like btnOpenShop'), 'nav-tab 클릭 시 view 없을 때 switchView 방어 확인');
assert(appJs.includes('switchView(viewName) {\n    if (!viewName || typeof viewName !== \'string\') return;'), 'switchView에 빈 값 방어 확인');
assert(appJs.includes('closeShopModal() {\n    if (this.modalShop) this.modalShop.classList.remove(\'active\');'), 'closeShopModal 기본 구조 확인');
assert(appJs.includes('const activeSection = document.querySelector(\'.view-section.active\');\n    if (!activeSection) {'), 'closeShopModal 뷰 복원 로직 확인');
assert(appJs.includes('const rankSubjIdiom = document.getElementById(\'rankSubjectIdiom\');'), 'rankSubjIdiom 이벤트 바인딩 확인');
assert(appJs.includes('if (currentSubject === \'idiom\')'), 'renderLeaderboard 내 idiom 분기 처리 확인');
assert(appJs.includes('this.APP_VERSION = metaVer || \'2.9.4\';'), 'APP_VERSION 2.9.4 확인');
console.log('  ✅ 2. app.js 네비게이션 방어, 뷰 복원 및 속담 랭킹 바인딩 검증 통과');

// 3. SoundEffects iOS Safari 무음 모드 & HTML5 Audio 풀 검증
assert(appJs.includes('initAudioPool()'), 'initAudioPool 메서드 존재 확인');
assert(appJs.includes('playHtmlAudio('), 'playHtmlAudio 메서드 존재 확인');
assert(appJs.includes('Math.max(rawNow, 0.04)'), 'Web Audio 0초 과거 스케줄링 방어 확인');
assert(appJs.includes('this.playHtmlAudio(\'correct\', 0.85);'), 'correct 사운드 HTML5 Audio 풀 연동 확인');
assert(appJs.includes('this.playHtmlAudio(\'wrong\', 0.85);'), 'wrong 사운드 HTML5 Audio 풀 연동 확인');
assert(appJs.includes('this.playHtmlAudio(\'fanfare\', 0.85);'), 'fanfare 사운드 HTML5 Audio 풀 연동 확인');
console.log('  ✅ 3. SoundEffects iOS Safari 무음 모드 하이브리드 엔진 검증 통과');

// 4. version.json 검증
const verPath = path.join(__dirname, '..', 'version.json');
const verData = JSON.parse(fs.readFileSync(verPath, 'utf8'));
assert.strictEqual(verData.version, '2.9.4', 'version.json 버전이 2.9.4여야 함');
console.log('  ✅ 4. version.json v2.9.4 검증 통과');

// 5. server.js /api/leaderboard?mode=idiom 검증
const http = require('http');
// Load server module in memory or test handler
const serverJs = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');
assert(serverJs.includes('mode === "idiom"'), 'server.js에 mode === "idiom" 정렬 로직이 포함되어 있어야 함');
assert(serverJs.includes('b.maxRoundIdiom - a.maxRoundIdiom'), 'server.js에 maxRoundIdiom 정렬 확인');
assert(serverJs.includes('b.pointsIdiom - a.pointsIdiom'), 'server.js에 pointsIdiom 정렬 확인');
assert(serverJs.includes('b.todayScoreIdiom - a.todayScoreIdiom'), 'server.js에 todayScoreIdiom 정렬 확인');
console.log('  ✅ 5. server.js 속담·관용구 랭킹 API 로직 검증 통과');

console.log('🎉 모든 v2.9.4 자동화 검증 100% 통과!');

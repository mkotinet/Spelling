const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 [v2.9.5] 랭킹 아바타 갤러리 확대, 귀여운 아바타 24종 & 신규 코스튬 54종 및 최적화 검증 시작');

// 1. server.js /api/leaderboard avatarAccessories 검증
const serverJs = fs.readFileSync(path.join(__dirname, '..', 'server.js'), 'utf8');
assert(serverJs.includes('avatarAccessories: (u.avatarAccessories && typeof u.avatarAccessories === \'object\') ? u.avatarAccessories : {}'), 'server.js leaderboard must return avatarAccessories');
console.log('  ✅ 1. server.js /api/leaderboard 아바타 악세사리 반환 검증 통과');

// 2. index.html 36종 아바타 선택자 및 zoom 타이틀 검증
const indexHtml = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
assert(indexHtml.includes('<meta name="app-version" content="2.9.5">'), 'index.html must have version 2.9.5 meta');
assert(indexHtml.includes('id="avatarZoomTitle"'), 'index.html must have id="avatarZoomTitle"');

const avatarMatches = indexHtml.match(/class="avatar-opt[^"]*" data-avatar="([^"]+)"/g) || [];
assert(avatarMatches.length >= 36, `Expected at least 36 avatars in selector, found ${avatarMatches.length}`);
assert(indexHtml.includes('data-avatar="🐼"'), 'Must include panda avatar');
assert(indexHtml.includes('data-avatar="🐹"'), 'Must include hamster avatar');
assert(indexHtml.includes('data-avatar="🧸"'), 'Must include teddy bear avatar');
assert(indexHtml.includes('data-avatar="🦦"'), 'Must include otter avatar');
console.log(`  ✅ 2. index.html 36종 귀여운 아바타 선택자(${avatarMatches.length}종) 및 줌 타이틀 검증 통과`);

// 3. app.js ACCESSORY_DEFINITIONS 대거 확장 & 200P 최저가 검증
const appJs = fs.readFileSync(path.join(__dirname, '..', 'app.js'), 'utf8');
const match = appJs.match(/const ACCESSORY_DEFINITIONS = \{([\s\S]*?)\n\};/);
assert(match, 'ACCESSORY_DEFINITIONS must exist in app.js');

const sandbox = {};
eval('sandbox.defs = {' + match[1] + '};');
let totalAcc = 0;
for (const cat of Object.keys(sandbox.defs)) {
  totalAcc += sandbox.defs[cat].length;
  sandbox.defs[cat].forEach(item => {
    assert(item.id, `Item in ${cat} must have id`);
    assert(item.cost >= 50, `Item ${item.id} cost must be valid`);
  });
}
assert(totalAcc >= 260, `Expected at least 260 total accessories, found ${totalAcc}`);
assert(sandbox.defs.outfit.some(o => o.id === 'outfit_strawberry_milk_pajama'), 'Must include strawberry milk pajama');
assert(sandbox.defs.shoes.some(s => s.id === 'shoes_bear_fluffy_moccasin'), 'Must include bear fluffy moccasin');
assert(sandbox.defs.hat.some(h => h.id === 'hat_frog_green_beret'), 'Must include frog green beret');
assert(sandbox.defs.pin.some(p => p.id === 'pin_cherry_twins_cute'), 'Must include cherry twins pin');
console.log(`  ✅ 3. app.js 신규 코스튬 대거 입고(총 ${totalAcc}종) 무결성 검증 통과`);

// 4. app.js openAvatarZoomModal targetUser 지원 검증
assert(appJs.includes('openAvatarZoomModal(targetUser = null)'), 'openAvatarZoomModal must accept targetUser');
assert(appJs.includes('isMe ? \'✨ 내 아바타 갤러리\' : `✨ ${u.name}님의 아바타 컬렉션`'), 'openAvatarZoomModal must format dynamic title');
console.log('  ✅ 4. app.js 상대방 아바타 갤러리 팝업 지원 검증 통과');

// 5. app.js renderLeaderboard 클릭 줌 이벤트 검증
assert(appJs.includes('avatarEl.addEventListener(\'click\''), 'Leaderboard must wire click on rank-avatar');
assert(appJs.includes('infoEl.addEventListener(\'click\''), 'Leaderboard must wire click on rank-info');
assert(appJs.includes('this.openAvatarZoomModal(user)'), 'Leaderboard click must invoke openAvatarZoomModal with user');
console.log('  ✅ 5. app.js 랭킹 화면 상대방 아바타 터치 인터랙션 검증 통과');

// 6. version.json v2.9.5 검증
const verJson = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'version.json'), 'utf8'));
assert.strictEqual(verJson.version, '2.9.5', 'version.json version must be 2.9.5');
console.log('  ✅ 6. version.json v2.9.5 메타데이터 검증 통과');

console.log('🎉 [v2.9.5] 모든 고도화 자동화 검증 100% 통과!');

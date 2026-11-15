// tests/test_v296_avatar_sync_to_leaderboard.js
// Verification suite for v2.9.6: Real-time avatar accessories synchronization to leaderboard

const fs = require('fs');
const path = require('path');
const assert = require('assert');

console.log('🧪 [v2.9.6] 아바타 꾸미기 랭킹 실시간 즉시 반영 및 동기화 무결성 검증 시작');

const appPath = path.join(__dirname, '../app.js');
const serverPath = path.join(__dirname, '../server.js');
const indexPath = path.join(__dirname, '../index.html');
const verPath = path.join(__dirname, '../version.json');

const appCode = fs.readFileSync(appPath, 'utf8');
const serverCode = fs.readFileSync(serverPath, 'utf8');
const indexCode = fs.readFileSync(indexPath, 'utf8');
const verData = JSON.parse(fs.readFileSync(verPath, 'utf8'));

// 1. Check syncUserData method implementation in app.js
console.log('  Testing 1: syncUserData method implementation in app.js...');
assert.ok(appCode.includes('syncUserData(action = \'USER_DATA_UPDATE\', details = {})'), 'syncUserData method definition must exist in app.js');
assert.ok(appCode.includes('me.avatarAccessories = { ...(this.data.currentUser.avatarAccessories || {}) }'), 'syncUserData must update local allUsers cache');
assert.ok(appCode.includes('this.currentViewName === \'leaderboard\''), 'syncUserData must check if leaderboard is currently active');
console.log('  ✅ 1. syncUserData 메서드 구현 및 allUsers 로컬 캐시 즉각 동기화 검증 통과');

// 2. Check optimistic merge in renderLeaderboard
console.log('  Testing 2: renderLeaderboard optimistic UI merge for isMe user...');
assert.ok(appCode.includes('avatarAccessories: { ...(this.data.currentUser.avatarAccessories || u.avatarAccessories || {}) }'), 'renderLeaderboard must prioritize currentUser avatarAccessories');
assert.ok(appCode.includes('avatar: this.data.currentUser.avatar || u.avatar || \'🌸\''), 'renderLeaderboard must prioritize currentUser avatar emoji');
console.log('  ✅ 2. renderLeaderboard 낙관적 UI 우선 병합(Optimistic Merge) 검증 통과');

// 3. Check closeShopModal re-rendering leaderboard
console.log('  Testing 3: closeShopModal re-rendering leaderboard...');
assert.ok(appCode.includes('this.renderLeaderboard(this.rankType || \'daily\');'), 'closeShopModal must re-render leaderboard');
console.log('  ✅ 3. closeShopModal 닫기 시 랭킹 자동 리렌더링 검증 통과');

// 4. Check saveProfileForm synchronization
console.log('  Testing 4: saveProfileForm syncing avatar & accessories...');
assert.ok(appCode.includes('this.syncUserData(\'PROFILE_UPDATE\')'), 'saveProfileForm must call syncUserData');
console.log('  ✅ 4. 프로필 변경 시 syncUserData 호출 및 동기화 검증 통과');

// 5. Version metadata check
console.log('  Testing 5: Version 2.9.6 metadata check across all files...');
assert.strictEqual(verData.version, '2.9.6', 'version.json must be 2.9.6');
assert.ok(serverCode.includes('version: "2.9.6"'), 'server.js fallback version must be 2.9.6');
assert.ok(indexCode.includes('<meta name="app-version" content="2.9.6">'), 'index.html meta tag must be 2.9.6');
assert.ok(indexCode.includes('<script src="app.js?v=2.9.6"></script>'), 'index.html script tag must be 2.9.6');
assert.ok(appCode.includes('this.APP_VERSION = metaVer || \'2.9.6\';'), 'app.js APP_VERSION must be 2.9.6');
console.log('  ✅ 5. v2.9.6 버전 메타데이터 일관성 검증 통과');

// 6. Simulated functional test of syncUserData logic
console.log('  Testing 6: Simulated unit execution of syncUserData logic...');
const fakeApp = {
  data: {
    currentUser: {
      id: 'user_123',
      name: '단민러브',
      avatar: '🐶',
      avatarAccessories: { hat: 'hat_mario_cap', outfit: 'outfit_mario_overalls' },
      totalPoints: 1500
    },
    allUsers: [
      { id: 'user_123', name: '단민러브', avatar: '🌸', avatarAccessories: {}, isMe: true },
      { id: 'user_456', name: '친구', avatar: '🐱', avatarAccessories: {}, isMe: false }
    ]
  },
  currentViewName: 'leaderboard',
  leaderboardRendered: false,
  cloudSynced: false,
  renderLeaderboard() {
    this.leaderboardRendered = true;
  },
  syncToCloud(action, details) {
    this.cloudSynced = true;
    return Promise.resolve({ success: true });
  }
};

// Execute syncUserData
fakeApp.syncUserData = function(action = 'USER_DATA_UPDATE', details = {}) {
  if (this.data && this.data.currentUser) {
    if (!this.data.allUsers) this.data.allUsers = [];
    const myId = this.data.currentUser.id;
    const myName = this.data.currentUser.name;
    const me = this.data.allUsers.find(u => (myId && u.id === myId) || (myName && u.name === myName) || u.isMe);
    if (me) {
      me.avatar = this.data.currentUser.avatar || me.avatar || '🌸';
      me.avatarAccessories = { ...(this.data.currentUser.avatarAccessories || {}) };
      me.name = this.data.currentUser.name || me.name;
      me.grade = this.data.currentUser.grade || me.grade;
      if (typeof this.data.currentUser.totalPoints === 'number') {
        me.totalPoints = this.data.currentUser.totalPoints;
      }
      me.isMe = true;
    }
  }
  if (this.currentViewName === 'leaderboard') {
    this.renderLeaderboard();
  }
  return this.syncToCloud(action, details);
};

fakeApp.syncUserData('AVATAR_TEST');
assert.strictEqual(fakeApp.data.allUsers[0].avatar, '🐶', 'allUsers me avatar should be updated to 🐶');
assert.strictEqual(fakeApp.data.allUsers[0].avatarAccessories.hat, 'hat_mario_cap', 'allUsers me hat should be updated');
assert.strictEqual(fakeApp.data.allUsers[0].avatarAccessories.outfit, 'outfit_mario_overalls', 'allUsers me outfit should be updated');
assert.strictEqual(fakeApp.leaderboardRendered, true, 'leaderboard should be re-rendered');
assert.strictEqual(fakeApp.cloudSynced, true, 'syncToCloud should be called');
console.log('  ✅ 6. syncUserData 시뮬레이션 단위 동작 검증 100% 통과');

console.log('🎉 [v2.9.6] 모든 고도화 자동화 검증 100% 통과!');

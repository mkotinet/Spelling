/**
 * tests/test_v350_gift_and_multichat.js
 * Verification for v3.5.0:
 * 1. Gift Sending Resilience (Case-insensitive user match, Object username handling, Room-aware gifts)
 * 2. Multi-User Group Chat Creation (POST /api/chat/create-group)
 * 3. Group Chat Invitation (POST /api/chat/invite & 1:1 room upgrade)
 * 4. Group Chat Thread & Message Delivery (POST /api/chat/send & GET /api/chat/thread)
 * 5. UI & Markup Verification (Buttons, Modals, Styling)
 */

const http = require('http');
const path = require('path');
const fs = require('fs');
const assert = require('assert');

// Set test environment
process.env.NODE_ENV = 'test';
process.env.PORT = '8991';

// Back up original users.json, messages.json, groups.json
const DATA_DIR = path.join(__dirname, '../data');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const MESSAGES_FILE = path.join(DATA_DIR, 'messages.json');
const GROUPS_FILE = path.join(DATA_DIR, 'groups.json');

const usersBackup = fs.readFileSync(USERS_FILE, 'utf8');
const messagesBackup = fs.readFileSync(MESSAGES_FILE, 'utf8');
const groupsBackup = fs.existsSync(GROUPS_FILE) ? fs.readFileSync(GROUPS_FILE, 'utf8') : null;

// Require server
let appServer = null;

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const payload = body ? JSON.stringify(body) : null;
    const reqHeaders = {
      ...headers,
      'Content-Type': 'application/json'
    };
    if (payload) {
      reqHeaders['Content-Length'] = Buffer.byteLength(payload);
    }

    const req = http.request({
      hostname: '127.0.0.1',
      port: 8991,
      path: path,
      method: method,
      headers: reqHeaders
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: JSON.parse(data) });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });

    req.on('error', reject);
    if (payload) req.write(payload);
    req.end();
  });
}

async function runTests() {
  console.log('🚀 Starting v3.5.0 Gift Resilience & Multi-User Group Chat Test Suite...');

  try {
    // 1. Verify markup & static code
    const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
    const appJs = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
    const styleCss = fs.readFileSync(path.join(__dirname, '../style.css'), 'utf8');
    const versionJson = JSON.parse(fs.readFileSync(path.join(__dirname, '../version.json'), 'utf8'));

    assert.strictEqual(versionJson.version, '3.5.0', 'version.json must be 3.5.0');
    assert(indexHtml.includes('content="3.5.0"'), 'index.html must have meta app-version 3.5.0');
    assert(indexHtml.includes('id="btnChatHeaderInvite"'), 'index.html must have btnChatHeaderInvite');
    assert(indexHtml.includes('id="btnOpenCreateGroup"'), 'index.html must have btnOpenCreateGroup');
    assert(indexHtml.includes('id="modalChatInviteFriends"'), 'index.html must have modalChatInviteFriends');

    assert(styleCss.includes('.btn-chat-invite-quick'), 'style.css must have .btn-chat-invite-quick');
    assert(styleCss.includes('.btn-create-group-pill'), 'style.css must have .btn-create-group-pill');
    assert(styleCss.includes('.chat-room-card.is-custom-group'), 'style.css must have .chat-room-card.is-custom-group');
    assert(styleCss.includes('.chat-invite-modal-box'), 'style.css must have .chat-invite-modal-box');

    assert(appJs.includes('openInviteFriendsModal'), 'app.js must implement openInviteFriendsModal');
    assert(appJs.includes('submitInviteFriends'), 'app.js must implement submitInviteFriends');
    assert(appJs.includes('currentSendGiftTargetUser'), 'app.js must track currentSendGiftTargetUser');

    console.log('✅ 1. Static Markup & Code Structure Verification Passed');

    // 2. Setup mock authentic users in test DB
    const db = JSON.parse(usersBackup);
    db.users['TestSender'] = {
      id: 'test_sender_id',
      username: 'TestSender',
      name: '발신자',
      totalPoints: 1000,
      avatar: '🐶',
      items: {},
      shields: 0
    };
    db.tokens['test_token_sender'] = 'TestSender';

    db.users['Ljh'] = {
      id: 'test_ljh_id',
      username: 'Ljh',
      name: 'Ljh',
      totalPoints: 500,
      avatar: '🍀',
      items: {},
      shields: 0
    };
    db.tokens['test_token_ljh'] = 'Ljh';

    db.users['TestFriend2'] = {
      id: 'test_f2_id',
      username: 'TestFriend2',
      name: '친구이',
      totalPoints: 300,
      avatar: '🌸',
      items: {},
      shields: 0
    };
    db.tokens['test_token_f2'] = 'TestFriend2';

    fs.writeFileSync(USERS_FILE, JSON.stringify(db, null, 2), 'utf8');

    // Start server instance
    delete require.cache[require.resolve('../server.js')];
    const serverModule = require('../server.js');

    // Wait 500ms for server to boot
    await new Promise(r => setTimeout(r, 600));

    // 3. Test Gift Sending with Case-Insensitive Username & Object Defense
    console.log('📦 Testing Gift Sending with Case-Insensitive Target...');
    // Target as lowercase "ljh", sender as TestSender
    const giftRes1 = await request('POST', '/api/chat/send-gift', {
      giftId: 'gift_starbox_americano', // 50P
      toUsername: 'ljh', // lowercase test
      message: '화이팅이야!'
    }, { 'Authorization': 'Bearer test_token_sender' });

    assert.strictEqual(giftRes1.status, 201, 'Gift send must succeed with status 201');
    assert.strictEqual(giftRes1.data.success, true, 'Gift send response must be success');
    assert.strictEqual(giftRes1.data.remainingPoints, 950, 'Sender points must decrease by 50P');
    assert.strictEqual(giftRes1.data.message.toUsername, 'Ljh', 'Recipient must resolve to authentic case Ljh');

    console.log('✅ 2. Gift Sending Case-Insensitive Match Passed');

    // 4. Test Gift Sending with Object Target (Defensive Check)
    console.log('📦 Testing Gift Sending with Object Target ({ username: "Ljh" })...');
    const giftRes2 = await request('POST', '/api/chat/send-gift', {
      giftId: 'gift_heart', // 100P
      toUsername: { username: 'Ljh', name: 'Ljh' }, // Object payload defense
      message: '하트 지켜줄게!'
    }, { 'Authorization': 'Bearer test_token_sender' });

    assert.strictEqual(giftRes2.status, 201, 'Object payload gift must succeed');
    assert.strictEqual(giftRes2.data.remainingPoints, 850, 'Sender points must decrease by 100P');

    console.log('✅ 3. Gift Sending Object Payload Defense Passed');

    // 5. Test Multi-User Group Creation (POST /api/chat/create-group)
    console.log('👥 Testing Multi-User Group Creation...');
    const createGroupRes = await request('POST', '/api/chat/create-group', {
      name: '우리말 열공방 ✨',
      members: ['Ljh', 'TestFriend2']
    }, { 'Authorization': 'Bearer test_token_sender' });

    assert.strictEqual(createGroupRes.status, 201, 'Create group must return 201');
    assert.strictEqual(createGroupRes.data.success, true, 'Create group must be success');
    const createdRoomId = createGroupRes.data.roomId;
    assert(createdRoomId.startsWith('group_'), 'Group roomId must start with group_');
    assert.strictEqual(createGroupRes.data.group.members.length, 3, 'Group members must be 3 (creator + 2 friends)');

    console.log('✅ 4. Multi-User Group Creation Passed (Room ID:', createdRoomId, ')');

    // 6. Test Group Thread & Message Send (POST /api/chat/send)
    console.log('💬 Testing Group Chat Message Send...');
    const sendMsgRes = await request('POST', '/api/chat/send', {
      roomId: createdRoomId,
      content: '친구들아 안녕! 그룹 대화방 시작이다 🚀'
    }, { 'Authorization': 'Bearer test_token_sender' });

    assert.strictEqual(sendMsgRes.status, 201, 'Group message send must return 201');
    assert.strictEqual(sendMsgRes.data.success, true, 'Group message send must be success');
    assert.strictEqual(sendMsgRes.data.message.roomId, createdRoomId, 'Message roomId must match');

    // Fetch thread for Ljh
    const threadRes = await request('GET', `/api/chat/thread?roomId=${encodeURIComponent(createdRoomId)}`, null, {
      'Authorization': 'Bearer test_token_ljh'
    });

    assert.strictEqual(threadRes.status, 200, 'Group thread must return 200');
    assert(threadRes.data.messages.length >= 2, 'Thread must contain system welcome message and user message');
    assert.strictEqual(threadRes.data.groupMeta.name, '우리말 열공방 ✨', 'Group meta name must match');

    console.log('✅ 5. Group Message Send & Thread Polling Passed');

    // 7. Test Friend Invitation (POST /api/chat/invite)
    console.log('👥 Testing Inviting Friend to Existing Group...');
    // Create another dummy user to invite
    const db2 = JSON.parse(fs.readFileSync(USERS_FILE, 'utf8'));
    db2.users['TestFriend3'] = {
      id: 'test_f3_id',
      username: 'TestFriend3',
      name: '새친구',
      totalPoints: 200,
      avatar: '🎀'
    };
    db2.tokens['test_token_f3'] = 'TestFriend3';
    fs.writeFileSync(USERS_FILE, JSON.stringify(db2, null, 2), 'utf8');

    const inviteRes = await request('POST', '/api/chat/invite', {
      roomId: createdRoomId,
      members: ['TestFriend3']
    }, { 'Authorization': 'Bearer test_token_sender' });

    assert.strictEqual(inviteRes.status, 201, 'Invite must return 201');
    assert.strictEqual(inviteRes.data.group.members.length, 4, 'Members count must be 4');
    assert(inviteRes.data.group.members.includes('TestFriend3'), 'New friend must be in group members');

    console.log('✅ 6. Group Friend Invitation Passed');

    // 8. Test 1:1 Chat Upgrade to Group (POST /api/chat/invite from 1:1 room)
    console.log('👥 Testing 1:1 Chat Upgrade to Group Room...');
    const dmRoomId = 'Ljh_TestSender';
    const upgradeRes = await request('POST', '/api/chat/invite', {
      roomId: dmRoomId,
      otherUser: 'Ljh',
      members: ['TestFriend2']
    }, { 'Authorization': 'Bearer test_token_sender' });

    assert.strictEqual(upgradeRes.status, 201, '1:1 upgrade must return 201');
    assert(upgradeRes.data.roomId.startsWith('group_'), 'Upgraded room must have group_ prefix');
    assert.strictEqual(upgradeRes.data.group.members.length, 3, 'Upgraded room must have 3 members');

    console.log('✅ 7. 1:1 Chat Upgrade to Multi-User Group Passed');

    // 9. Test Rooms List includes Group Rooms (GET /api/chat/rooms)
    console.log('📋 Testing Chat Rooms List with Groups...');
    const roomsRes = await request('GET', '/api/chat/rooms', null, {
      'Authorization': 'Bearer test_token_sender'
    });

    assert.strictEqual(roomsRes.status, 200, 'Rooms list must return 200');
    const customGroupRooms = roomsRes.data.rooms.filter(r => r.isCustomGroup);
    assert(customGroupRooms.length >= 2, 'Rooms list must include at least 2 custom group rooms');

    console.log('✅ 8. Chat Rooms List with Multi-User Groups Passed');

    console.log('\n🎉 ALL v3.5.0 Unit & Integration Tests Passed Successfully!');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    process.exitCode = 1;
  } finally {
    // Restore backup files
    fs.writeFileSync(USERS_FILE, usersBackup, 'utf8');
    fs.writeFileSync(MESSAGES_FILE, messagesBackup, 'utf8');
    if (groupsBackup !== null) {
      fs.writeFileSync(GROUPS_FILE, groupsBackup, 'utf8');
    } else if (fs.existsSync(GROUPS_FILE)) {
      fs.unlinkSync(GROUPS_FILE);
    }
    console.log('🧹 Cleaned up test data & restored original state.');
  }
}

runTests().then(() => {
  process.exit(process.exitCode || 0);
});

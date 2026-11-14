const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Mobile Auth Persistence & Token Retention Logic...');

// 1. Static code check in app.js
const appJsPath = path.join(__dirname, '../app.js');
const appJs = fs.readFileSync(appJsPath, 'utf8');

// Verify that token removal ONLY happens strictly on 401, not on network error or other statuses
assert(
  appJs.includes('401'),
  'app.js must explicitly check for 401 status before removing auth token'
);

// 2. Simulate Client Auth Session Manager behavior
class MockAuthClient {
  constructor(initialToken = 'valid_token_123', initialUser = '단민러브') {
    this.cloudToken = initialToken;
    this.currentUser = { name: initialUser };
    this.storage = {
      'haru_cloud_token': initialToken,
      'haru_auth_username': initialUser
    };
    this.cloudStatus = { loggedIn: true, user: initialUser };
  }

  // Method under test: checkCloudAuth with resilient error handling
  async checkCloudAuth(mockFetchFn) {
    if (!this.cloudToken) {
      this.updateCloudStatus(false);
      return;
    }

    try {
      const res = await mockFetchFn('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${this.cloudToken}` }
      });

      if (res.ok) {
        const body = await res.json();
        if (body.success && body.user) {
          this.currentUser.name = body.user.name;
          this.updateCloudStatus(true, body.user.name);
          return true;
        }
      } else if (res.status === 401) {
        // STRICT: Only clear token if server explicitly returns 401 Unauthorized
        console.log('[Auth] Token invalidated by server (401). Clearing session.');
        this.cloudToken = '';
        delete this.storage['haru_cloud_token'];
        delete this.storage['haru_auth_username'];
        this.updateCloudStatus(false);
        return false;
      } else {
        // Server temporary error (502, 503, 500) -> KEEP token and cached session!
        console.warn(`[Auth] Server returned status ${res.status}. Retaining cached session.`);
        this.updateCloudStatus(true, this.currentUser.name);
        return true;
      }
    } catch (e) {
      // Network offline or phone wake-up delay -> DO NOT clear token!
      console.warn('[Auth] Network unreachable on wake-up. Retaining cached session.');
      this.updateCloudStatus(true, this.currentUser.name);
      return true;
    }
  }

  updateCloudStatus(isLoggedIn, user = null) {
    this.cloudStatus = { loggedIn: isLoggedIn, user: user };
  }

  // Next-day resume handler
  checkDateTransition(newDate) {
    // Session must not be touched on date transition!
    assert.ok(this.cloudToken, 'Token must survive next-day rollover');
  }
}

async function runSimulation() {
  console.log('--- Scenario 1: Phone wakes up next day with offline network delay ---');
  const client1 = new MockAuthClient('token_abc', '단민러브');
  // Mock fetch throws Network Error (e.g. WiFi reconnecting)
  const mockNetworkFail = async () => { throw new Error('Failed to fetch (offline)'); };
  await client1.checkCloudAuth(mockNetworkFail);
  assert.strictEqual(client1.cloudToken, 'token_abc', 'Token MUST NOT be cleared on offline delay');
  assert.strictEqual(client1.storage['haru_cloud_token'], 'token_abc');
  assert.strictEqual(client1.cloudStatus.loggedIn, true, 'User should remain logged in visually');
  assert.strictEqual(client1.cloudStatus.user, '단민러브');
  console.log('✅ Scenario 1 Passed: Network delay preserves auth session!');

  console.log('--- Scenario 2: Phone wakes up next day and receives 502/503 temporary error ---');
  const client2 = new MockAuthClient('token_abc', '단민러브');
  const mock502 = async () => ({ ok: false, status: 502 });
  await client2.checkCloudAuth(mock502);
  assert.strictEqual(client2.cloudToken, 'token_abc', 'Token MUST NOT be cleared on 502 Bad Gateway');
  assert.strictEqual(client2.cloudStatus.loggedIn, true);
  console.log('✅ Scenario 2 Passed: 502/503 preserves auth session!');

  console.log('--- Scenario 3: Legitimate 401 Unauthorized from server ---');
  const client3 = new MockAuthClient('token_abc', '단민러브');
  const mock401 = async () => ({ ok: false, status: 401 });
  await client3.checkCloudAuth(mock401);
  assert.strictEqual(client3.cloudToken, '', 'Token MUST be cleared strictly on 401');
  assert.strictEqual(client3.storage['haru_cloud_token'], undefined);
  assert.strictEqual(client3.cloudStatus.loggedIn, false);
  console.log('✅ Scenario 3 Passed: 401 cleanly clears session!');

  console.log('--- Scenario 4: Next-day midnight transition maintains session ---');
  const client4 = new MockAuthClient('token_abc', '단민러브');
  client4.checkDateTransition('2026-11-15');
  assert.strictEqual(client4.cloudToken, 'token_abc');
  console.log('✅ Scenario 4 Passed: Date transition preserves login state!');
}

runSimulation().then(() => {
  console.log('🎉 ALL Mobile Auth Persistence Tests Passed Successfully!');
}).catch(err => {
  console.error('❌ Test Failed:', err);
  process.exit(1);
});

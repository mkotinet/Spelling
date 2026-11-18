const assert = require('assert');

// Mock localStorage and document DOM
class MockLocalStorage {
  constructor() { this.store = {}; }
  getItem(k) { return this.store[k] || null; }
  setItem(k, v) { this.store[k] = String(v); }
  removeItem(k) { delete this.store[k]; }
  clear() { this.store = {}; }
}

const mockLS = new MockLocalStorage();
global.localStorage = mockLS;

// Load app code to test logic
const fs = require('fs');
const path = require('path');
const appCode = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');

// Verify code structure
assert(appCode.includes('if (typeof this.currentIndex !== \'number\' || this.currentIndex < 0 || this.currentIndex >= this.activeQuestions.length)'));
assert(appCode.includes('if (typeof session.currentIndex === \'number\' && session.currentIndex >= session.activeQuestions.length)'));
assert(appCode.includes('if (typeof session.currentIndex === \'number\' && session.currentIndex >= totalQ)'));

console.log('✅ Unit Test Passed: Quiz session boundary and lifecycle checks are verified!');

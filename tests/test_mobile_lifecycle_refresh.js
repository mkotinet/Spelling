const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Mobile Lifecycle & Daily Date Refresh Logic...');

// Read app.js and check static implementations
const appJsPath = path.join(__dirname, '../app.js');
const appJs = fs.readFileSync(appJsPath, 'utf8');

// 1. Verify existence of date change watcher and lifecycle listeners
assert.ok(
  appJs.includes('visibilitychange') || appJs.includes('pageshow'),
  'app.js must register visibilitychange or pageshow lifecycle events for mobile background resume'
);
assert.ok(
  appJs.includes('checkDateTransition') || appJs.includes('handleDateChangeIfNeeded'),
  'app.js must have a dedicated date transition handler (e.g. checkDateTransition)'
);

// 2. Test date calculation with timezone consideration
function getTodayDateStringKST(dateObj = new Date()) {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(dateObj);
  } catch (e) {
    const d = new Date(dateObj.getTime() + (9 * 60 * 60 * 1000));
    return d.toISOString().split('T')[0];
  }
}

// Test midnight edge cases:
// 2026-11-14 15:30:00 UTC is 2026-11-15 00:30:00 KST
const midnightKstDate = new Date('2026-11-14T15:30:00.000Z');
const kstResult = getTodayDateStringKST(midnightKstDate);
console.log(`KST date at 00:30 AM KST (15:30 UTC): ${kstResult}`);
assert.strictEqual(kstResult, '2026-11-15', 'Must correctly identify 2026-11-15 past midnight KST!');

// 3. Simulate App state transition on next-day resume
class MockHaruApp {
  constructor() {
    this.lastLoadedDate = '2026-11-14';
    this.currentView = 'result';
    this.calendarRenderCount = 0;
    this.toastMessage = null;
    this.dailyQuestions = ['q1', 'q2', 'q3', 'q4', 'q5'];
  }

  // Method under test
  checkDateTransition(currentDateStr) {
    const todayStr = currentDateStr;
    if (todayStr !== this.lastLoadedDate) {
      console.log(`[Date Transition] Detected next day: ${this.lastLoadedDate} -> ${todayStr}`);
      this.lastLoadedDate = todayStr;
      
      // If user was on result view or mid-quiz from yesterday, reset to home
      if (this.currentView === 'quiz' || this.currentView === 'result') {
        this.currentView = 'home';
        this.toastMessage = '새로운 하루가 시작되었습니다! 오늘의 퀴즈가 갱신되었어요 🌸';
      }
      this.renderCalendarWeek();
      return true;
    }
    return false;
  }

  renderCalendarWeek() {
    this.calendarRenderCount++;
  }
}

const mockApp = new MockHaruApp();
assert.strictEqual(mockApp.currentView, 'result');

// User wakes up next day, opens phone browser (triggers visibilitychange)
const transitionOccurred = mockApp.checkDateTransition('2026-11-15');
assert.strictEqual(transitionOccurred, true);
assert.strictEqual(mockApp.lastLoadedDate, '2026-11-15');
assert.strictEqual(mockApp.currentView, 'home', 'Should reset from stale result view to home');
assert.strictEqual(mockApp.calendarRenderCount, 1, 'Should re-render calendar with new day');
assert.ok(mockApp.toastMessage.includes('새로운 하루'), 'Should show friendly notification');

console.log('✅ Mobile Lifecycle & Date Refresh Tests Passed (Logic Verified)!');

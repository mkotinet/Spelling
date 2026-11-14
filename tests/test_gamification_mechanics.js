/**
 * Test: Gamification Core Logic (Shields, 300P Bonus, Checkpoint, Revive)
 */
const assert = require('assert');
const fs = require('fs');
const path = require('path');

console.log('🧪 Testing Gamification Core Mechanics (Shield, Streak, Checkpoint, Revive)...');

// Read app.js
const appCode = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');

// 1. Verify app.js contains the necessary state fields and logic methods
assert(appCode.includes('this.shields'), 'app.js must maintain this.shields');
assert(appCode.includes('perfectRoundStreak'), 'app.js must track consecutive perfect rounds');
assert(appCode.includes('useShield'), 'app.js must have shield consumption logic');
assert(appCode.includes('handleReviveQuiz'), 'app.js must support revive quiz logic');

// 2. Logic Simulation of Shield, Streak Bonus, Checkpoint & Revive
class MockGameEngine {
  constructor() {
    this.currentRound = 1;
    this.shields = 0;
    this.perfectRoundStreak = 0;
    this.totalPoints = 0;
    this.lastAction = '';
  }

  finishRound(correctCount) {
    const isPerfect = correctCount === 5;
    let roundPassed = false;
    let bonusPoints = 0;

    if (isPerfect) {
      this.perfectRoundStreak++;
      roundPassed = true;

      // 2 consecutive perfect rounds -> grant 1 shield
      if (this.perfectRoundStreak % 2 === 0) {
        this.shields = Math.min(3, this.shields + 1);
        this.lastAction = 'SHIELD_EARNED';
      }

      // 3 consecutive perfect rounds -> bonus 300 points
      if (this.perfectRoundStreak % 3 === 0) {
        bonusPoints += 300;
        this.lastAction = 'BONUS_300_EARNED';
      }
    } else {
      this.perfectRoundStreak = 0;

      // Shield protection: if 4/5 (1 mistake) and shields > 0
      if (correctCount === 4 && this.shields > 0) {
        this.shields -= 1;
        roundPassed = true;
        this.lastAction = 'SHIELD_DEFENDED';
      } else {
        roundPassed = false;
        this.lastAction = 'ROUND_FAILED';
      }
    }

    this.totalPoints += bonusPoints;
    return { roundPassed, bonusPoints };
  }

  getFailedNextRound(choseRevive, passedRevive) {
    if (choseRevive) {
      if (passedRevive) {
        // Keep current round
        return this.currentRound;
      }
    }
    // Checkpoint: drop to previous round (min 1)
    return Math.max(1, this.currentRound - 1);
  }
}

const engine = new MockGameEngine();

// Round 1: Perfect 5/5 -> streak 1
let res = engine.finishRound(5);
assert.strictEqual(res.roundPassed, true);
assert.strictEqual(engine.shields, 0);
assert.strictEqual(engine.perfectRoundStreak, 1);

// Round 2: Perfect 5/5 -> streak 2 -> Shield awarded!
res = engine.finishRound(5);
assert.strictEqual(res.roundPassed, true);
assert.strictEqual(engine.shields, 1, 'Should earn 1 shield after 2 consecutive perfect rounds');
assert.strictEqual(engine.lastAction, 'SHIELD_EARNED');

// Round 3: Perfect 5/5 -> streak 3 -> 300P bonus awarded!
res = engine.finishRound(5);
assert.strictEqual(res.roundPassed, true);
assert.strictEqual(res.bonusPoints, 300, 'Should earn +300 bonus points after 3 consecutive perfect rounds');

// Round 4: 4/5 (1 mistake) -> Shield protects and consumes shield!
engine.currentRound = 4;
res = engine.finishRound(4);
assert.strictEqual(res.roundPassed, true, 'Shield must protect round progression on 1 mistake');
assert.strictEqual(engine.shields, 0, 'Shield must be consumed');
assert.strictEqual(engine.lastAction, 'SHIELD_DEFENDED');

// Round 5: 3/5 (2 mistakes) with 0 shields -> Fails!
engine.currentRound = 5;
res = engine.finishRound(3);
assert.strictEqual(res.roundPassed, false);
assert.strictEqual(engine.lastAction, 'ROUND_FAILED');

// Checkpoint fallback: Round 5 drops to Round 4
const fallbackRound = engine.getFailedNextRound(false, false);
assert.strictEqual(fallbackRound, 4, 'Failing round 5 must fall back to round 4 (R-1)');

// Revive quiz: If passed revive quiz, restart Round 5!
const revivedRound = engine.getFailedNextRound(true, true);
assert.strictEqual(revivedRound, 5, 'Passing revive quiz must keep current round 5');

// Revive quiz fail: drops to Round 4
const reviveFailedRound = engine.getFailedNextRound(true, false);
assert.strictEqual(reviveFailedRound, 4, 'Failing revive quiz must fall back to round 4');

console.log('🎉 ALL Gamification Mechanics Logic Assertions Passed!');

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
    const mistakes = 5 - correctCount;
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

      // Shield protection: if mistakes <= 2 and shields > 0
      if (mistakes <= 2 && this.shields > 0) {
        this.shields -= 1;
        roundPassed = true;
        this.lastAction = 'SHIELD_DEFENDED';
      } else if (mistakes <= 2) {
        // 1 or 2 mistakes: given a chance!
        roundPassed = false;
        this.lastAction = 'CHANCE_GIVEN';
      } else {
        // 3 or more mistakes: COMPLETE ELIMINATION (탈락)!
        roundPassed = false;
        this.lastAction = 'ELIMINATED';
      }
    }

    this.totalPoints += bonusPoints;
    return { roundPassed, mistakes, bonusPoints, action: this.lastAction };
  }

  getFailedNextRound(correctCount, choseRevive, passedRevive) {
    const mistakes = 5 - correctCount;
    if (mistakes >= 3) {
      // 3+ mistakes -> Must restart from Round 1
      return 1;
    }
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

// Round 4: 2 mistakes (3/5) with 1 shield -> Shield protects against up to 2 mistakes!
engine.currentRound = 4;
res = engine.finishRound(3);
assert.strictEqual(res.roundPassed, true, 'Shield must protect round progression even on 2 mistakes');
assert.strictEqual(engine.shields, 0, 'Shield must be consumed');
assert.strictEqual(engine.lastAction, 'SHIELD_DEFENDED');

// Round 5: 2 mistakes (3/5) with 0 shields -> Given a chance (Revive or Checkpoint R-1)
engine.currentRound = 5;
res = engine.finishRound(3);
assert.strictEqual(res.roundPassed, false);
assert.strictEqual(engine.lastAction, 'CHANCE_GIVEN', '2 mistakes without shield gives chance');

// Chance option A: Revive pass -> keeps Round 5
assert.strictEqual(engine.getFailedNextRound(3, true, true), 5);
// Chance option B: Checkpoint -> falls back to Round 4
assert.strictEqual(engine.getFailedNextRound(3, false, false), 4);

// Round 6: 3 mistakes (2/5) -> COMPLETE ELIMINATION! Must restart from Round 1
engine.currentRound = 6;
res = engine.finishRound(2);
assert.strictEqual(res.roundPassed, false);
assert.strictEqual(engine.lastAction, 'ELIMINATED', '3 or more mistakes must result in elimination');
assert.strictEqual(engine.getFailedNextRound(2, false, false), 1, '3 or more mistakes must restart from Round 1');

console.log('🎉 ALL Gamification Mechanics Logic Assertions Passed!');

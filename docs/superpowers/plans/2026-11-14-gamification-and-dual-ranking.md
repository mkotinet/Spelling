# Haru Matchum v2.2.0 Gamification & Dual-Subject Leaderboard Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform Haru Matchum (Spelling & Hanja Quiz) into an engaging arcade-style game with shields, streak bonuses, checkpoint fallbacks, revive chances, in-game items, a game guide modal, and dual-subject/highest-round leaderboards.

**Architecture:** Client-side state machine in `app.js` manages shields, combos, items, and revive branching. Node.js backend (`server.js`) stores subject-partitioned statistics (`maxRoundSpelling`, `maxRoundHanja`, `todayScoreSpelling`, `todayScoreHanja`, `pointsSpelling`, `pointsHanja`) and serves filtered rankings via `/api/leaderboard`. Responsive UI components in `index.html` and `style.css` present the Game Guide modal and dual-tab leaderboard.

**Tech Stack:** Vanilla JavaScript (ES6+), Node.js HTTP Server, CSS3 (Flexbox/Grid, Pastel & Emerald Themes), Docker Compose on Synology NAS Portainer.

**Spec:** User VOC 1~8 (Shield on 2 consecutive perfect rounds, 300P on 3 consecutive perfect rounds, checkpoint fallback to R-1 on fail, 1-question revive chance, items: 50:50 eraser / heart / 2x booster, game guide manual modal, dual-subject & highest-round leaderboards).

## Global Constraints
- Pure real user data only: No dummy mock peers in leaderboard.
- KST midnight rollover: Date calculations use `getKSTDateString()` (Asia/Seoul).
- Persistent Auth: Retain tokens and session on 5xx or offline; wipe only on explicit 401.
- Docker volume persistence: `/app/data` bootstrap preserved.
- Bidirectional Git sync with Synology Portainer container.

## Review Focus
1. Shield consumption: When 1 question is failed in a 5-question round and shield > 0, shield must be decremented by 1, and round marked as cleared.
2. Checkpoint fallback: Failing a round without shield drops player to `max(1, currentRound - 1)`, not round 1.
3. Revive quiz: If player chooses revive quiz and answers correctly, player immediately restarts the current failed round (not previous). If wrong, drops to `currentRound - 1`.
4. Leaderboard filtering: Sorting by `round`, `daily`, or `total` must strictly use the selected subject (`spelling` or `hanja`) without corrupting legacy data.
5. In-game item bounds: Items (50:50, heart, double) cannot be overused beyond inventory or re-applied within the same question/round.

---

### Task 1: Backend Data Model & Dual-Subject Leaderboard API

**Files:**
- Modify: `server.js:200-395`
- Test: `tests/test_dual_leaderboard.js`

- [ ] Write failing test `tests/test_dual_leaderboard.js` testing `/api/leaderboard?mode=spelling&type=round`, `/api/leaderboard?mode=hanja&type=round`, and `/api/user/sync` with subject-specific rounds and scores.
- [ ] Run test to verify it fails (`node tests/test_dual_leaderboard.js`).
- [ ] Implement subject-specific stats in `server.js`:
  - `maxRoundSpelling`, `maxRoundHanja` (default 1)
  - `todayScoreSpelling`, `todayScoreHanja` (default 0)
  - `pointsSpelling`, `pointsHanja` (default 0)
  - Update `/api/user/sync` to handle `mode` / `subject` when merging scores and rounds.
  - Update `/api/leaderboard` to filter and sort by `mode` (`spelling` | `hanja` | `all`) and `type` (`round` | `daily` | `total`).
- [ ] Run `tests/test_dual_leaderboard.js` and verify 100% green pass.
- [ ] Commit: `git commit -m "feat(api): implement dual-subject and highest-round leaderboard API"`

---

### Task 2: Gamification Core Logic (Shields, 300P Streak Bonus, Checkpoint & Revive)

**Files:**
- Modify: `app.js:260-310`, `app.js:750-930`
- Test: `tests/test_gamification_mechanics.js`

- [ ] Write failing test `tests/test_gamification_mechanics.js` verifying:
  - 2 consecutive perfect rounds awards 1 shield (`shields += 1`).
  - 1 wrong answer with shield > 0 uses shield and permits round progression.
  - 3 consecutive perfect rounds awards +300P bonus points.
  - Failing a round drops next round target to `currentRound - 1`.
  - Revive quiz pass keeps current round; revive quiz fail drops to `currentRound - 1`.
- [ ] Run test to verify failure (`node tests/test_gamification_mechanics.js`).
- [ ] Implement core game state in `app.js`:
  - Add `shields` (default 0, max 3), `perfectRoundStreak` (default 0), `isReviveQuiz` (boolean).
  - Update `finishQuiz()` to grant shield at streak 2, +300P at streak 3.
  - Implement shield protection check: if `roundCorrectCount === 4` and `shields > 0`, deduct 1 shield and set `isRoundCleared = true`.
  - Implement revive quiz trigger: show revive dialog when failed; load single random question.
- [ ] Run `tests/test_gamification_mechanics.js` and verify all tests pass.
- [ ] Commit: `git commit -m "feat(game): implement shields, streak bonus, checkpoints, and revive quiz"`

---

### Task 3: In-Game Items (50:50 Eraser, Heart Second Chance, 2x Booster)

**Files:**
- Modify: `app.js:630-790`, `index.html:150-180`, `style.css`
- Test: `tests/test_game_items.js`

- [ ] Write failing test `tests/test_game_items.js` testing item consumption and behavior:
  - 50:50 eraser hides 2 incorrect options.
  - Heart second chance allows 1 incorrect choice without registering a strike.
  - 2x booster doubles round clear points.
- [ ] Run test to verify failure (`node tests/test_game_items.js`).
- [ ] Add Item Action Bar above quiz options in `index.html` (`#quizItemBar`).
- [ ] Implement item activation methods in `app.js`:
  - `useItem5050()`: finds 2 wrong option indices and hides them (`visibility: hidden` or `display: none`).
  - `useItemHeart()`: shields the next wrong answer immediately on the question level.
  - `useItemDouble()`: sets `pointMultiplier = 2` for the round.
- [ ] Style item buttons and item badges in `style.css`.
- [ ] Run `tests/test_game_items.js` and verify green pass.
- [ ] Commit: `git commit -m "feat(game): implement 50:50 eraser, heart second chance, and 2x booster items"`

---

### Task 4: Game Guide Modal & Dual Leaderboard UI

**Files:**
- Modify: `index.html:45-70, 270-320`, `style.css`, `app.js:930-1010`
- Test: `tests/test_game_guide_and_ui.js`

- [ ] Write test `tests/test_game_guide_and_ui.js` verifying DOM elements for Game Guide Modal (`#modalGameGuide`, `#btnOpenGameGuide`) and Leaderboard subject switchers (`#rankSubjectSpelling`, `#rankSubjectHanja`) and type filters (`round`, `daily`, `total`).
- [ ] Add `[ 🎮 게임 가이드 ]` button in header and `#modalGameGuide` in `index.html`.
- [ ] Add Dual-Subject Switcher and 3 filter buttons (`👑 최고 라운드`, `🏆 오늘의 점수`, `💎 누적 명예의 전당`) in `#viewLeaderboard`.
- [ ] Update `renderLeaderboard()` in `app.js` to query `/api/leaderboard?mode=${subject}&type=${type}` and render rank badges with round markers.
- [ ] Style the Game Guide Modal and new ranking tabs in `style.css`.
- [ ] Run `tests/test_game_guide_and_ui.js` and verify pass.
- [ ] Commit: `git commit -m "feat(ui): add game guide modal and dual-subject highest-round leaderboard UI"`

---

### Task 5: End-to-End Integration, Docs, Docker Deployment & Live Verification

**Files:**
- Modify: `tests/verify_all.js`, `기술레포트.md`, `제작히스토리.md`, `AGENTS.md`, `GEMINI.md`
- Deployment: Synology Portainer container `1e254e254241`

- [ ] Update `tests/verify_all.js` to run the complete test suite including new tests.
- [ ] Run full test suite: `node tests/verify_all.js`.
- [ ] Update `기술레포트.md` with Section 3.9 (게이미피케이션 및 분리형 랭킹 아키텍처).
- [ ] Update `제작히스토리.md` with v2.2.0 entry.
- [ ] Update `AGENTS.md` and `GEMINI.md` with Rule 10 (게이미피케이션 상태 및 랭킹 무결성).
- [ ] Commit and push to GitHub `origin main`.
- [ ] Restart Portainer container on Synology NAS (`portainer` MCP tool).
- [ ] Verify live endpoints on [haru.danminlove.com](https://haru.danminlove.com).

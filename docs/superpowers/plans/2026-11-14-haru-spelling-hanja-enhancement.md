# 하루맞춤(Haru Matchum) 한자 퀴즈 및 시스템 고도화 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 국어 맞춤법 앱 `haru.danminlove.com`에 한자/고사성어 퀴즈 모드, 5문제 만점 시 무한 연속 라운드 시스템, 실제 유저 실시간 랭킹(더미 피어 제거), 접속/이용 감사 로그 및 관리자 권한 뷰를 추가하고 시놀로지 Portainer 및 GitHub에 동기화 배포한다.

**Architecture:** Node.js 순수 내장 모듈(`http`, `fs`, `crypto`) 기반의 경량 감사 로깅 및 사용자 관리 API, 프론트엔드에서는 모듈형 한자 문제은행(`hanja_questions.js`)과 상태 관리 기반의 모드 스위처, 5문항 100% 정답 기반 연속 라운드 제어 엔진, 국립국어원 OpenAPI 및 네이버 한자사전 딥링크 연동.

**Tech Stack:** HTML5, CSS3, Vanilla JavaScript (ES6+), Node.js (v20 Alpine), Docker / Portainer, Git / GitHub.

**Spec:** [docs/superpowers/specs/2026-11-14-haru-spelling-hanja-enhancement-design.md](file:///Users/kotinet/Documents/Spelling/docs/superpowers/specs/2026-11-14-haru-spelling-hanja-enhancement-design.md)

---

## Global Constraints
- Node.js 런타임 환경은 외부 무거운 npm 라이브러리 추가 없이 내장 모듈(`http`, `fs`, `path`, `crypto`, `child_process`)만 사용한다.
- 시놀로지 NAS Portainer 컨테이너 `spelling`과 GitHub `mkotinet/Spelling` 간 실시간 양방향 동기화 및 형상 최신 상태를 유지한다.
- 기존 사용자의 저장 데이터(`users.json`, 누적 포인트, 출석 스트릭, 뱃지)를 안전하게 마이그레이션 및 보존한다.
- 5문항 모두 정답(`correctCount === 5`) 시에만 100점 만점 통과 및 다음 라운드 버튼이 활성화된다.
- 전체 회원 접속 감사 로그 조회는 대표 관리자(`username === '단민러브'`)에게만 인가된다.
- `기술레포트.md`와 `제작히스토리.md`를 의무적으로 작성/갱신한다.

## Review Focus
1. **비회원/게스트 상태에서의 라운드 진행 및 로컬 저장소 안전성**: 로그인이 안 된 게스트 상태에서도 한자 모드 전환, 5문제 만점 시 2라운드 진입, 로컬 포인트 누적이 에러 없이 부드럽게 동작해야 함.
2. **더미 피어 캐시 완전 정제**: 기존 사용자의 브라우저 `localStorage`에 남아있는 `peer_1` ~ `peer_7` 데이터가 앱 시작 시 자동으로 소멸하고 실제 `/api/leaderboard` 데이터로 즉시 대체되어야 함.
3. **접속 감사 로그 크기 제어**: 감사 로그(`access_logs.json`)가 무제한 증가하지 않고 최근 1,000건으로 안전하게 순환(Rolling)되어 시놀로지 NAS 디스크 및 메모리를 보호해야 함.
4. **한자 음훈/용례 데이터 누락 방지**: 한자 문제 풀이 후 정답 해설 카드에 개별 한자의 음훈 리스트, 단어 용례(Usage), 실생활 예문, 사전 링크가 빠짐없이 완벽하게 렌더링되어야 함.
5. **Git 동기화 충돌 방지**: 시놀로지 컨테이너의 백그라운드 주기적 Git push 시 `git pull --rebase`를 수행하여 원격 최신 커밋과의 충돌을 원천 방지해야 함.

---

### Task 1: Server Authentication & Access Logging System (`server.js`)

**Files:**
- Modify: `server.js:10-290`
- Create: `tests/test_server_logs.js`

**Interfaces:**
- Consumes: HTTP requests to `/api/auth/login`, `/api/auth/register`, `/api/user/sync`
- Produces: 
  - `recordAccessLog(username, action, ip, userAgent, details)` in `server.js`
  - `GET /api/user/logs` (returns recent 30 logs for the authenticated token)
  - `GET /api/admin/logs` (returns recent 1000 logs if token belongs to `단민러브`)

- [ ] **Step 1: Write test for server access logs and endpoints**
  Create `tests/test_server_logs.js` using Node.js built-in `assert` to verify log file creation, log rotation under 1000 entries, and access control for `/api/user/logs` and `/api/admin/logs`.

- [ ] **Step 2: Run test to verify it fails**
  Run: `node tests/test_server_logs.js`
  Expected: FAIL with connection error or missing endpoint.

- [ ] **Step 3: Implement logging helpers and new endpoints in `server.js`**
  - Implement client IP extraction helper (`getClientIp(req)`).
  - Implement `recordAccessLog(username, action, ip, userAgent, details)` with automatic 1000-entry rotation and atomic write to `data/access_logs.json`.
  - Record `LOGIN_SUCCESS`, `LOGIN_FAIL`, `REGISTER` in existing auth handlers.
  - Add `GET /api/user/logs` returning user's recent logs.
  - Add `GET /api/admin/logs` returning full logs with admin authorization check (`username === '단민러브'`).
  - Enhance `runGit` auto-sync loop to run `git pull --rebase origin main` before pushing.

- [ ] **Step 4: Run test to verify it passes**
  Run: `node tests/test_server_logs.js`
  Expected: PASS all assertions.

- [ ] **Step 5: Commit**
  ```bash
  git add server.js tests/test_server_logs.js
  git commit -m "feat(server): add audit access logging, log rotation, and admin log endpoints"
  ```

---

### Task 2: Leaderboard Real User Filtering & Dummy Peer Elimination (`app.js`, `server.js`)

**Files:**
- Modify: `app.js:180-250, 695-730, 930-960`
- Modify: `server.js:265-280`
- Create: `tests/test_leaderboard_clean.js`

**Interfaces:**
- Consumes: `/api/leaderboard` from `server.js`
- Produces: Clean user list containing only authentic users, with `maxRoundToday` indicator.

- [ ] **Step 1: Write test for clean leaderboard and peer elimination**
  Create `tests/test_leaderboard_clean.js` ensuring no `peer_` IDs exist and only valid users are returned and sorted correctly.

- [ ] **Step 2: Run test to verify it fails**
  Run: `node tests/test_leaderboard_clean.js`
  Expected: FAIL or identify presence of dummy peers.

- [ ] **Step 3: Refactor `DataManager.load()` and `renderLeaderboard()` in `app.js`**
  - Delete `generatePeerRankings()` completely.
  - In `DataManager.load()`, filter out any item with `id.startsWith('peer_')` or simulated names (`체리블라썸`, etc.).
  - In `renderLeaderboard()`, fetch `/api/leaderboard` asynchronously from the server.
  - If offline or guest, display only current user without fake competitors.
  - Render `🔥 N라운드` badge if user's `maxRoundToday > 1`.
  - In `server.js`, include `maxRoundToday` in `/api/leaderboard` response.

- [ ] **Step 4: Run test to verify it passes**
  Run: `node tests/test_leaderboard_clean.js`
  Expected: PASS

- [ ] **Step 5: Commit**
  ```bash
  git add app.js server.js tests/test_leaderboard_clean.js
  git commit -m "feat(ranking): eliminate dummy peer accounts and connect real-time server leaderboard"
  ```

---

### Task 3: Hanja Question Bank & Dictionary Deep Linking (`hanja_questions.js`, `index.html`)

**Files:**
- Create: `hanja_questions.js`
- Modify: `index.html:120-140`
- Create: `tests/test_hanja_bank.js`

**Interfaces:**
- Consumes: None
- Produces: `HANJA_QUESTION_BANK` global array of questions with schema: `{ id, category, level, question, sentence, options, answerIndex, hanjaWord, hanjaChars: [{ char, sound, meaning }], explanation, usage, exampleSentence, dictLink, naverLink }`.

- [ ] **Step 1: Write test for Hanja question bank structure**
  Create `tests/test_hanja_bank.js` verifying at least 30 questions exist, with all required fields (`hanjaWord`, `hanjaChars`, `usage`, `exampleSentence`, `dictLink`, `naverLink`), valid `answerIndex` (0 to options.length - 1).

- [ ] **Step 2: Run test to verify it fails**
  Run: `node tests/test_hanja_bank.js`
  Expected: FAIL (`hanja_questions.js` does not exist).

- [ ] **Step 3: Create `hanja_questions.js` with 30+ curated questions and include in `index.html`**
  - Write 30+ high-quality questions covering:
    - 사자성어 (온고지신, 형설지공, 주마간산, 결초보은, 삼고초려, 백미, 과유불급, 타산지석 등)
    - 동음이의 한자어 (결제/결재, 개발/개발, 연도/년도, 보존/보존 등)
    - 일상 및 초·중·고 필수 한자어
  - Provide individual character breakdown (`hanjaChars`), practical usage, context sentences, and official dictionary links.
  - Add `<script src="hanja_questions.js"></script>` in `index.html`.

- [ ] **Step 4: Run test to verify it passes**
  Run: `node tests/test_hanja_bank.js`
  Expected: PASS with 30+ validated Hanja questions.

- [ ] **Step 5: Commit**
  ```bash
  git add hanja_questions.js index.html tests/test_hanja_bank.js
  git commit -m "feat(hanja): create comprehensive Hanja question bank with usage and dictionary links"
  ```

---

### Task 4: UI Mode Switcher & Dual Theme Support (`index.html`, `style.css`, `app.js`)

**Files:**
- Modify: `index.html:70-120`
- Modify: `style.css:100-300`
- Modify: `app.js:260-350`

**Interfaces:**
- Consumes: `HANJA_QUESTION_BANK`, `SPELLING_QUESTION_BANK`
- Produces: UI toggle switch `#quizModeToggle`, theme state `this.quizMode` ('spelling' | 'hanja').

- [ ] **Step 1: Add HTML markup for mode switcher in `index.html`**
  - Place `.mode-switch-wrapper` inside the header / top of Home view.
  - Buttons: `#btnModeSpelling` (🌸 우리말 맞춤법), `#btnModeHanja` (📜 한자·고사성어).
  - Add Hanja detail section in the explanation card `#expHanjaArea` (char breakdown, usage, example sentence, Naver Hanja link).

- [ ] **Step 2: Add CSS rules for mode switcher and Hanja theme in `style.css`**
  - Style `.mode-switch-wrapper` with pill switch animation and pastel theme styling.
  - Add `body.theme-hanja` overrides for emerald/antique gradients, badges, and card borders.
  - Style `.hanja-char-grid`, `.hanja-char-pill`, `.hanja-usage-box`.

- [ ] **Step 3: Connect mode toggle in `app.js`**
  - Add `this.quizMode = 'spelling'` in constructor.
  - Implement `setQuizMode(mode)`: updates `body` theme class, toggles active button, updates mascot speech and hero banner, sets question bank to `HANJA_QUESTION_BANK` or `SPELLING_QUESTION_BANK`.
  - Wire up click listeners for `#btnModeSpelling` and `#btnModeHanja`.

- [ ] **Step 4: Verify UI switching in browser or DOM structure**
  Verify DOM elements exist and classes switch properly via DOM checks.

- [ ] **Step 5: Commit**
  ```bash
  git add index.html style.css app.js
  git commit -m "feat(ui): add quiz mode switcher and Hanja theme styling"
  ```

---

### Task 5: 5-Question Round Progression & Endless Mode Mechanism (`app.js`, `index.html`, `style.css`)

**Files:**
- Modify: `app.js:460-690, 800-850`
- Modify: `index.html:150-200`
- Modify: `style.css:400-500`

**Interfaces:**
- Consumes: `this.activeQuestions`, `this.quizMode`, `roundCorrectCount`
- Produces:
  - `startNextRound()`: loads next 5 questions with non-overlapping index formula
  - `ROUND_CLEAR` server sync event with bonus +50P
  - Result view celebration button `#btnNextRound`

- [ ] **Step 1: Add Next Round UI in `index.html`**
  - In `#viewResult`, add `#btnNextRound` ("🎉 100점 만점 통과! 다음 라운드(새 5문제) 도전하기 🔥").
  - In Quiz header, add round badge `#quizRoundBadge` (e.g. "라운드 1", "라운드 2").

- [ ] **Step 2: Implement round progression logic in `app.js`**
  - Initialize `this.currentRound = 1`, `this.roundCorrectCount = 0`.
  - In `handleAnswer()`: if answer is correct, increment `this.roundCorrectCount++`.
  - In `finishQuiz()`:
    - Check if `this.roundCorrectCount === 5`.
    - If 5/5:
      - Show `#btnNextRound` with celebratory animation.
      - If `this.currentRound === 1`: award attendance, record `todayScore = 100`.
      - If `this.currentRound > 1`: award bonus `+50P` to `totalPoints`, update `maxRoundToday`.
      - Trigger background server log: action `ROUND_CLEAR` with details `{ mode, round: this.currentRound, score: 100 }`.
    - If not 5/5: hide `#btnNextRound`, offer review wrong questions and retry current round.
  - Implement `startNextRound()`: increment `this.currentRound++`, generate 5 new questions using `(seed + (this.currentRound - 1) * 31 + i * 7) % bank.length`, switch to quiz view.

- [ ] **Step 3: Update `renderCurrentQuestion()` to display Hanja breakdowns**
  - When in `hanja` mode, populate `#expHanjaArea` with `hanjaChars` badges, `usage`, `exampleSentence`, and Naver Hanja search link (`naverLink`).

- [ ] **Step 4: Commit**
  ```bash
  git add app.js index.html style.css
  git commit -m "feat(quiz): implement 5-question round progression and Hanja explanation details"
  ```

---

### Task 6: User Profile Access History & Admin Audit Log Viewer Modal (`index.html`, `style.css`, `app.js`)

**Files:**
- Modify: `index.html:200-260`
- Modify: `style.css:600-750`
- Modify: `app.js:850-1050`

**Interfaces:**
- Consumes: `GET /api/user/logs`, `GET /api/admin/logs`
- Produces:
  - User activity log table in profile modal
  - Admin audit modal `#modalAdminLogs` for user `단민러브`

- [ ] **Step 1: Add HTML for activity history and admin modal in `index.html`**
  - Inside `#modalProfile`, add section `#userActivityHistorySection` with a table or list of recent logins and actions.
  - Add `#btnOpenAdminLogs` visible only when username is `단민러브`.
  - Add `#modalAdminLogs` with log filters, search, and refresh button.

- [ ] **Step 2: Add CSS styling in `style.css`**
  - Style log tables, status badges (`LOGIN_SUCCESS` green, `LOGIN_FAIL` red, `ROUND_CLEAR` gold), timestamp formatting, and responsive table container.

- [ ] **Step 3: Implement client-side log fetching and rendering in `app.js`**
  - In `openProfileModal()`: if logged in with `this.cloudToken`, fetch `/api/user/logs` and render recent entries.
  - Check if `this.data.currentUser.name === '단민러브'` or `username === '단민러브'`: toggle `#btnOpenAdminLogs`.
  - Implement `openAdminLogsModal()`: fetch `/api/admin/logs` and render system-wide audit records with IP, User-Agent, and action details.

- [ ] **Step 4: Commit**
  ```bash
  git add index.html style.css app.js
  git commit -m "feat(logs): add user activity history tab and admin audit log viewer"
  ```

---

### Task 7: Comprehensive Integration Verification, GitHub Sync & Tech Documentation

**Files:**
- Create: `tests/verify_all.js`
- Create: `기술레포트.md`
- Create: `제작히스토리.md`
- Modify: `docker-compose.yml` (if needed)

**Interfaces:**
- Consumes: Entire application codebase
- Produces: Clean pass of all test suites, committed repository, Synology Portainer container refresh, technical reports.

- [ ] **Step 1: Write and run end-to-end integration test script `tests/verify_all.js`**
  Verify:
  - Server starts and responds to all endpoints.
  - Auth registration, login, token verification, log recording.
  - Clean leaderboard without any peer dummies.
  - Hanja bank integrity.
  - Run: `node tests/verify_all.js`
  - Expected: PASS all tests.

- [ ] **Step 2: Create `기술레포트.md` and `제작히스토리.md` in repository root**
  - Follow common guidelines: Architecture, RCA, feature specifications, endpoint validations, timeline, artifacts.

- [ ] **Step 3: Commit and Push to GitHub repository**
  - Push to `https://github.com/mkotinet/Spelling.git` (`origin main`).

- [ ] **Step 4: Restart and verify Synology NAS Portainer container `spelling`**
  - Use `portainer` MCP tool `restart_container` for container `1e254e254241`.
  - Inspect container logs to verify `git clone` or update and successful server startup on port 80/8089.

- [ ] **Step 5: Final verification and summary**
  - Verify live site accessibility and report results.

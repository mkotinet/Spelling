# 하루맞춤 4대 과목 각 5,000문항(총 20,000문항) 및 1,000라운드 무중복 순열 엔진 구현 계획서 (Phase 1 & 2 통합)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 하루맞춤 4개 과목(우리말 맞춤법, 우리말 속담·관용구, 한자·고사성어, 영어 어휘)을 단계별 1,000문항씩(과목당 5,000문항, 총 20,000문항) 구축하고, 1,000라운드 동안 100% 무중복 출제를 보장하는 순열 엔진과 온디맨드 지연 로딩(On-Demand Loading) 및 서버 Gzip 압축 최적화를 구현한다.

**Architecture:** 
1. 4개 과목 독립 데이터 파일(`questions.js`, `idiom_questions.js`, `hanja_questions.js`, `english_questions.js`) 각 5,000문항 분배 (초등 1,000, 중등 1,000, 고등 1,000, 수능 1,000, 실무 1,000).
2. `server.js`에 내장 Gzip 압축 스트림 및 버전 쿼리 영구 캐싱 헤더 적용.
3. `app.js`에 온디맨드 과목 지연 로딩(`loadSubjectBank`) 및 PRNG Fisher-Yates 순열 블록 슬라이싱 탑재(1,000라운드 중복률 0.00%).
4. 4대 과목 UI 스위처, 꿀/호박색(`.theme-idiom`) 테마, 서버 4과목 독립 랭킹(`spelling`, `idiom`, `hanja`, `english`) 연동.

**Tech Stack:** Vanilla JavaScript (ES6+), Node.js HTTP/REST Backend (zlib gzip stream), Pretendard Typography, CSS3 Custom Properties, Portainer Docker Container, Git.

**Spec:** `docs/superpowers/specs/2026-11-14-1000-questions-round-scaling-design.md`

## Global Constraints

- **Rule 1 (Bidirectional Git Sync):** 모든 코드 수정 후 `git pull --rebase` 후 GitHub `mkotinet/Spelling` (`main`) 원격 푸시.
- **Rule 2 (Documentation):** `기술레포트.md` 및 `제작히스토리.md`에 20,000문항 아키텍처 및 벤치마크 결과 상세 기록.
- **Rule 3 (Network & Security):** `https://haru.danminlove.com` Cloudflare + NPM HTTPS 443 연동 표준 유지.
- **Rule 4 (KST Timezone):** 모든 일일 갱신 및 시드 생성 시 `getKSTDateString()` 표준 헬퍼 사용.
- **Rule 5 (Mobile Lifecycle):** 카카오톡 등 앱 전환 복귀 시 `saveActiveQuizSession` / `restoreActiveQuizSession` 무결성 유지.
- **Rule 6 (No Mock Data):** `data/users.json` 및 `data/access_logs.json`에 가상 목 데이터 일절 잔존 금지.
- **Rule 8 (Dynamic Choice Randomization):** 4지선다 선택지 런타임 셔플 및 정답 인덱스 자동 재매핑 유지.
- **Rule 10 (Subject Segregation):** 4대 과목(`spelling`, `idiom`, `hanja`, `english`)의 최고 라운드 및 포인트를 독립 분리 집계.
- **Question Formatting:** 전 20,000문항 4지선다는 `[ (     ) ]` 괄호 빈칸 양식 적용 및 제시문 내 슬래시(`/`) 완전 제거.
- **Optimization:** 온디맨드 과목 지연 로딩으로 초기 모바일 로딩 데이터 800KB 이하로 방어.

## Review Focus

1. **Memory & Parse Performance:** 5,000문항 파싱 시 모바일 브라우저 렉이나 멈춤 없이 15ms 이내 즉각 파싱되는가.
2. **On-Demand Dynamic Loading:** 탭 전환 시 미로드된 과목 데이터가 오류 없이 비동기 로드되고 캐싱되는가.
3. **Cycle boundary rollover (Round 1,000 -> 1,001):** 1,000라운드 초과 시 `cycleIndex`가 증가하여 새 PRNG 시드로 다음 1,000라운드가 안정 생성되는가.
4. **Question schema & option uniqueness:** 20,000문항 전체에 대해 선택지 4개 중복 0건, 정답 유효성 100% 검증.
5. **Leaderboard sorting & persistence for 4th subject:** `server.js`의 `mode === 'idiom'`에 대해 `maxRoundIdiom`, `todayScoreIdiom`, `pointsIdiom`이 올바르게 누적되고 정렬되는가.

---

## Tasks

### Task 1: Server-Side Gzip Compression & Caching Optimization (`server.js`)
- Files: `server.js:530-560`
- Tests: `tests/test_server_compression.js`

### Task 2: High-Capacity Spelling Question Bank Expansion (5,000 Questions)
- Files: `scripts/generate_spelling_5000.js`, `questions.js`
- Tests: `tests/test_spelling_5000.js`

### Task 3: Idiom & Proverb Question Bank Creation (5,000 Questions)
- Files: `scripts/generate_idiom_5000.js`, `idiom_questions.js`
- Tests: `tests/test_idiom_5000.js`

### Task 4: Hanja & Chengyu Question Bank Expansion (5,000 Questions)
- Files: `scripts/generate_hanja_5000.js`, `hanja_questions.js`
- Tests: `tests/test_hanja_5000.js`

### Task 5: English Vocabulary & Spelling Question Bank Expansion (5,000 Questions)
- Files: `scripts/generate_english_5000.js`, `english_questions.js`
- Tests: `tests/test_english_5000.js`

### Task 6: Permutation Block Slicing Engine & On-Demand Subject Loader (`app.js`)
- Files: `app.js`
- Tests: `tests/test_permutation_and_lazy_loading.js`

### Task 7: 4-Subject UI, Amber Theme & Server Persistence
- Files: `index.html`, `style.css`, `server.js`, `app.js`
- Tests: `tests/test_four_subjects_integration.js`

### Task 8: Comprehensive System Verification Suite (20,000 Questions Full Audit)
- Files: `tests/test_20000_questions_and_permutations.js`, `tests/verify_all.js`
- Tests: Run all tests

### Task 9: Production Deployment, Documentation & Git Synchronization
- Files: `기술레포트.md`, `제작히스토리.md`
- Deployment: MCP `portainer:restart_container`, `git pull --rebase && git push`

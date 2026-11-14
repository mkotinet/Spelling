# Graph Report - Spelling  (2026-11-15)

## Corpus Check
- 75 files · ~2,446,687 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .css 1)

## Summary
- 778 nodes · 1217 edges · 51 communities (46 shown, 5 thin omitted)
- Extraction: 95% EXTRACTED · 5% INFERRED · 0% AMBIGUOUS · INFERRED: 65 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `09a35953`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- HaruMatchumApp
- test_20000_questions_and_permutations.js
- build_english_bank.py
- server.js
- 📋 국어 맞춤법 퀴즈 프로그램 '하루맞춤' 기술 리포트 (Technical Report)
- test_v240_level_rounds_and_items.js
- Review Focus
- 3. 핵심 변경 상세 및 원인 분석 (RCA)
- test_v253_random_and_unsolved_priority.js
- 📜 하루맞춤 (Haru Matchum) 개발 히스토리 및 변경 로그 (Changelog)
- test_v230_features.js
- generate_spelling_5000.js
- spelling
- generate_english_5000.js
- generate_hanja_5000.js
- generate_idiom_5000.js
- test_mobile_lifecycle_refresh.js
- Tasks
- Tasks
- 공통 운영 및 개발 지침 (Common Guidelines)
- ref_fs
- test_mobile_auth_persistence.js
- 하루맞춤 4대 과목 각 1,000문항(총 4,000문항) 구축 및 5,000문항(총 20,000문항) 확장 설계서
- test_gamification_mechanics.js
- ref_assert
- test_four_subjects_integration.js
- Architecture & Components
- ⏱️ 단계별 제작 및 고도화 타임라인
- test_v252_ending_and_shield_decision.js
- test_game_items.js
- test_server_logs.js
- Review Focus
- hanja_questions.js
- test_hanja_bank.js
- test_audit_logs_ui.js
- test_mode_toggle.js
- Proposed Changes
- test_permutation_and_lazy_loading.js
- test_v260_voice_and_concise_questions.js
- test_leaderboard_clean.js
- test_dual_leaderboard.js
- test_server_compression.js
- MockEngine
- QuestionSelectionHarness
- recordAccessLog
- verify_all.js
- idiom_questions.js
- ref_path
- MockAudioContext
- ConfettiManager
- MockLevelGameEngine

## God Nodes (most connected - your core abstractions)
1. `HaruMatchumApp` - 85 edges
2. `3. 핵심 변경 상세 및 원인 분석 (RCA)` - 18 edges
3. `⏱️ 단계별 제작 및 고도화 타임라인` - 13 edges
4. `server` - 13 edges
5. `공통 운영 및 개발 지침 (Common Guidelines)` - 11 edges
6. `SoundEffects` - 10 edges
7. `📋 국어 맞춤법 및 한자 퀴즈 프로그램 '하루맞춤' 기술레포트 (Technical Report v2.0)` - 10 edges
8. `Tasks` - 10 edges
9. `getKSTDateString()` - 9 edges
10. `spelling` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Task 1: Server Authentication & Access Logging System (`server.js`)` --references--> `runGit()`  [INFERRED]
  docs/superpowers/plans/2026-11-14-haru-spelling-hanja-enhancement.md → server.js
- `[2026-11-14] v2.3.0 레벨별 맞춤법 5제, 럭키 박스, 영어 어휘 퀴즈` --references--> `SoundEffects`  [INFERRED]
  제작히스토리.md → app.js
- `3.4 접속 감사 로그 및 보안 인가 체계` --references--> `getKSTTime()`  [INFERRED]
  기술레포트.md → server.js
- `3.4 접속 감사 로그 및 보안 인가 체계` --references--> `recordAccessLog()`  [INFERRED]
  기술레포트.md → server.js
- `[2026-11-14] v2.0.0 한자 퀴즈, 연속 라운드, 클린 랭킹, 감사 로깅 대규모 고도화` --references--> `getClientIp()`  [INFERRED]
  제작히스토리.md → server.js

## Import Cycles
- None detected.

## Communities (51 total, 5 thin omitted)

### Community 0 - "HaruMatchumApp"
Cohesion: 0.08
Nodes (7): getKSTDateString(), HaruMatchumApp, 1. Frontend Engine (`app.js`), Task 3: In-Game Items (50:50 Eraser, Heart Second Chance, 2x Booster), Task 5: 5-Question Round Progression & Endless Mode Mechanism (`app.js`, `index.html`, `style.css`), Task 6: User Profile Access History & Admin Audit Log Viewer Modal (`index.html`, `style.css`, `app.js`), 3.17 모바일 타 앱(카카오톡 등) 전환 복귀 시 퀴즈 세션 자동 보존 및 라운드 스킵 결함 해결 (v2.4.3)

### Community 1 - "test_20000_questions_and_permutations.js"
Cohesion: 0.24
Nodes (7): SPELLING_QUESTION_BANK, assert, banks, targetLevels, assert, ids, levels

### Community 2 - "build_english_bank.py"
Cohesion: 0.07
Nodes (8): build_english_bank(), get_hanja_level_data(), create_idiom_level_data(), build_level1_questions(), build_level2_questions(), build_level3_questions(), build_level4_questions(), build_level5_questions()

### Community 3 - "server.js"
Cohesion: 0.13
Nodes (19): Task 1: Server Authentication & Access Logging System (`server.js`), crypto, DB_FILE, { execSync }, fs, generateToken(), getKSTDateString(), hashPassword() (+11 more)

### Community 4 - "📋 국어 맞춤법 퀴즈 프로그램 '하루맞춤' 기술 리포트 (Technical Report)"
Cohesion: 0.06
Nodes (32): 1. 📜 한자(漢字) 및 고사성어 퀴즈 신규 모드, 2. 🔥 5문제 만점 시 무한 연속 라운드 시스템, 3. 👑 실제 활동 유저 기반 클린 실시간 랭킹, 4. 🔒 서버 접속 및 이용 이력 감사 로깅 (Security Audit), 5. 🏛️ 국립국어원 표준국어대사전 규정 준수, 🌐 GitHub Pages 활성화 방법, 🎀 v2.0 주요 특징 및 기능, 📄 기술 문서 (+24 more)

### Community 5 - "test_v240_level_rounds_and_items.js"
Cohesion: 0.09
Nodes (22): appJs, assert, bindEventsCode, en4, englishQuestionsJs, fs, game, getLevelDailyQuestionsMock() (+14 more)

### Community 6 - "Review Focus"
Cohesion: 0.05
Nodes (40): DataManager, Global Constraints, Review Focus, Task 2: Leaderboard Real User Filtering & Dummy Peer Elimination (`app.js`, `server.js`), Task 3: Hanja Question Bank & Dictionary Deep Linking (`hanja_questions.js`, `index.html`), Task 4: UI Mode Switcher & Dual Theme Support (`index.html`, `style.css`, `app.js`), Task 7: Comprehensive Integration Verification, GitHub Sync & Tech Documentation, 하루맞춤(Haru Matchum) 한자 퀴즈 및 시스템 고도화 Implementation Plan (+32 more)

### Community 7 - "3. 핵심 변경 상세 및 원인 분석 (RCA)"
Cohesion: 0.09
Nodes (22): 1.1 주요 고도화 요구사항, 1. 개요 및 고도화 배경, 2. 시스템 아키텍처 (v2.0.0), 4. 엔드포인트 및 단위 테스트 검증 결과, 5.1 4대 과목 각 5,000문항 (총 20,000문항) 구축, 5. 20,000문항 대규모 확장 및 경량화 최적화 아키텍처 (v2.5.0), 5.2 1,000라운드 완전 무중복 순열 블록 슬라이싱 (Permutation Block Slicing), 5.3 성능 최적화 및 경량화 보장 (+14 more)

### Community 8 - "test_v253_random_and_unsolved_priority.js"
Cohesion: 0.09
Nodes (21): answerPositions, assert, banks, expectedUsers, fs, harness, largePool, levels (+13 more)

### Community 9 - "📜 하루맞춤 (Haru Matchum) 개발 히스토리 및 변경 로그 (Changelog)"
Cohesion: 0.10
Nodes (19): 🌐 Nginx Proxy Manager (NPM) 도메인 라우팅 구축, Phase 1: 요구사항 분석 및 구조 설계, Phase 2: 국어원 문제은행 및 데이터베이스 구축 (`questions.js`), Phase 3: 인터랙티브 UI 및 테마 스타일링 (`style.css`), Phase 4: 게임 엔진 및 비즈니스 로직 구현 (`app.js`), Phase 5: 문서화 및 배포 준비, 📌 [v1.0.0] - 2026-11-11 (Official First Release), 📌 [v1.1.0] - 2026-11-11 (National Institute of Korean Language API Integration & Domain Connect) (+11 more)

### Community 10 - "test_v230_features.js"
Cohesion: 0.10
Nodes (15): assert, englishQuestionsJs, fs, http, indexHtml, luckyPool, mockItems, path (+7 more)

### Community 11 - "generate_spelling_5000.js"
Cohesion: 0.11
Nodes (15): ALL_SPELLING, BUSINESS_WORDS, CONTEXT_TEMPLATES, CSAT_WORDS, ELEMENTARY_WORDS, fs, HIGH_WORDS, MIDDLE_WORDS (+7 more)

### Community 12 - "spelling"
Cohesion: 0.12
Nodes (16): networks, npm_default, external, services, spelling, command, container_name, environment (+8 more)

### Community 13 - "generate_english_5000.js"
Cohesion: 0.12
Nodes (14): ALL_ENGLISH, BUSINESS_ENGLISH, CONTEXT_TEMPLATES_ENGLISH, CSAT_ENGLISH, ELEMENTARY_ENGLISH, fs, HIGH_ENGLISH, MIDDLE_ENGLISH (+6 more)

### Community 14 - "generate_hanja_5000.js"
Cohesion: 0.12
Nodes (14): ALL_HANJA, BUSINESS_HANJA, CONTEXT_TEMPLATES_HANJA, CSAT_HANJA, ELEMENTARY_HANJA, fs, HIGH_HANJA, MIDDLE_HANJA (+6 more)

### Community 15 - "generate_idiom_5000.js"
Cohesion: 0.12
Nodes (14): ALL_IDIOMS, BUSINESS_IDIOMS, CONTEXT_TEMPLATES_IDIOM, CSAT_IDIOMS, ELEMENTARY_IDIOMS, fs, HIGH_IDIOMS, MIDDLE_IDIOMS (+6 more)

### Community 16 - "test_mobile_lifecycle_refresh.js"
Cohesion: 0.14
Nodes (10): appJs, appJsPath, assert, fs, kstResult, midnightKstDate, mockApp, MockHaruApp (+2 more)

### Community 17 - "Tasks"
Cohesion: 0.14
Nodes (13): Global Constraints, Review Focus, Task 1: Server-Side Gzip Compression & Caching Optimization (`server.js`), Task 2: High-Capacity Spelling Question Bank Expansion (5,000 Questions), Task 3: Idiom & Proverb Question Bank Creation (5,000 Questions), Task 4: Hanja & Chengyu Question Bank Expansion (5,000 Questions), Task 5: English Vocabulary & Spelling Question Bank Expansion (5,000 Questions), Task 6: Permutation Block Slicing Engine & On-Demand Subject Loader (`app.js`) (+5 more)

### Community 18 - "Tasks"
Cohesion: 0.15
Nodes (12): Global Constraints, Review Focus, Task 1: Dataset Generation Tools & Spelling Question Bank Expansion (1,000 Questions), Task 2: Idiom & Proverb Question Bank (`idiom_questions.js`) Creation (1,000 Questions), Task 3: Hanja & Chengyu Question Bank (`hanja_questions.js`) Expansion (1,000 Questions), Task 4: English Vocabulary & Spelling Question Bank (`english_questions.js`) Expansion (1,000 Questions), Task 5: Permutation Block Slicing Engine (`app.js`), Task 6: 4-Subject UI, Theme Styling & Server Persistence (`index.html`, `style.css`, `server.js`, `app.js`) (+4 more)

### Community 19 - "공통 운영 및 개발 지침 (Common Guidelines)"
Cohesion: 0.17
Nodes (11): 10. 게이미피케이션 상태 동기화 및 랭킹 분리 무결성 원칙 (Gamification & Dual-Ranking Integrity), 1. 양방향 GitHub 형상 동기화 원칙 (Bidirectional Git Sync), 2. 기술레포트 및 히스토리 필수 반영 원칙 (Documentation Principle), 3. 네트워크 및 도메인 보안 연동 원칙, 4. 시간대(KST) 및 일일 갱신 기준 표준화 (Timezone & Midnight Rollover), 5. 모바일 웹앱 라이프사이클 및 백그라운드 복귀 보장 (Mobile Lifecycle), 6. 순수 실제 회원 기반 데이터 무결성 원칙 (No Mock Data in Production), 7. 보안 감사 로깅 및 관리자 인가 제어 (Audit Logging & RBAC) (+3 more)

### Community 20 - "ref_fs"
Cohesion: 0.33
Nodes (4): appJs, assert, fs, path

### Community 21 - "test_mobile_auth_persistence.js"
Cohesion: 0.23
Nodes (7): appJs, appJsPath, assert, fs, MockAuthClient, path, runSimulation()

### Community 22 - "하루맞춤 4대 과목 각 1,000문항(총 4,000문항) 구축 및 5,000문항(총 20,000문항) 확장 설계서"
Cohesion: 0.18
Nodes (10): 1. 개요 및 배경 (Context & Intent), 2. 4대 과목(종류) 정의 및 배정 구조, 3. 난이도별(5레벨) 문항 분배 (과목당 1,000문항 기준), 4.1 순열 블록 슬라이싱 (Permutation Block Slicing) 알고리즘, 4.2 데이터 모듈화 및 파일 구조, 4.3 4지선다 괄호 빈칸 및 스키마 표준 준수, 4.4 UI & 랭킹 연동, 4. 핵심 기술 사양 (Technical Specifications) (+2 more)

### Community 23 - "test_gamification_mechanics.js"
Cohesion: 0.18
Nodes (7): appCode, assert, engine, fs, MockGameEngine, path, res

### Community 24 - "ref_assert"
Cohesion: 0.33
Nodes (5): assert, fs, indexHtml, path, styleCss

### Community 25 - "test_four_subjects_integration.js"
Cohesion: 0.20
Nodes (8): assert, css, fs, html, http, path, server, serverPath

### Community 26 - "Architecture & Components"
Cohesion: 0.22
Nodes (8): 1. Backend (`server.js`), 2. English Question Bank (`english_questions.js`), 3. Level-Based Quiz Mode (`questions.js`, `hanja_questions.js`, `app.js`, `index.html`), 4. Surprise Lucky Box Item Drop (`app.js`, `index.html`, `style.css`), 5. UI & Theme Expansion (`index.html`, `style.css`), 6. Testing & Deployment, Architecture & Components, Implementation Plan: Level-Based Daily Quiz, Surprise Lucky Box, and English Subject Expansion

### Community 27 - "⏱️ 단계별 제작 및 고도화 타임라인"
Cohesion: 0.13
Nodes (13): SoundEffects, [2026-11-11] v1.3.0 클라우드 인증 및 시놀로지 NAS Portainer 이전, [2026-11-14] v2.1.0 ~ v2.2.3 게이미피케이션 및 모바일 UX 최적화, [2026-11-14] v2.1.0 사자성어 문장 괄호 빈칸 고도화 및 모바일 백그라운드 자정 자동 갱신, [2026-11-14] v2.1.1 정답 위치 동적 무작위화(Fisher-Yates 셔플) 및 8대 공통 지침 제정, [2026-11-14] v2.1.2 모바일 영구 로그인 세션 및 탄력적 인증 유지(Persistent Auth Session), [2026-11-14] v2.2.0 게이미피케이션(방패/보너스/부활/아이템) 및 맞춤법·한자 분리형 최고 라운드 랭킹 대규모 고도화, [2026-11-14] v2.2.1 2문제 기회/3문제 탈락 규칙 적용 및 귀여운 직관적 아이템 UI 고도화 (+5 more)

### Community 28 - "test_v252_ending_and_shield_decision.js"
Cohesion: 0.17
Nodes (11): appCode, assert, engine, expectedPromptSnippets, fs, htmlCode, outcome, path (+3 more)

### Community 29 - "test_game_items.js"
Cohesion: 0.22
Nodes (8): appCode, assert, fs, hidden, mockQuestion, path, qWithDict, wrongIndices

### Community 30 - "test_server_logs.js"
Cohesion: 0.28
Nodes (8): assert, fs, http, path, request(), runTests(), server, serverPath

### Community 31 - "Review Focus"
Cohesion: 0.25
Nodes (7): Global Constraints, Haru Matchum v2.2.0 Gamification & Dual-Subject Leaderboard Implementation Plan, Review Focus, Task 1: Backend Data Model & Dual-Subject Leaderboard API, Task 2: Gamification Core Logic (Shields, 300P Streak Bonus, Checkpoint & Revive), Task 4: Game Guide Modal & Dual Leaderboard UI, Task 5: End-to-End Integration, Docs, Docker Deployment & Live Verification

### Community 32 - "hanja_questions.js"
Cohesion: 0.15
Nodes (10): HANJA_QUESTION_BANK, assert, ids, levels, assert, duplicateList, assert, distribution (+2 more)

### Community 33 - "test_hanja_bank.js"
Cohesion: 0.25
Nodes (7): assert, bank, fs, hanjaFilePath, indexHtml, indexHtmlPath, path

### Community 34 - "test_audit_logs_ui.js"
Cohesion: 0.29
Nodes (6): appJs, assert, fs, indexHtml, path, styleCss

### Community 35 - "test_mode_toggle.js"
Cohesion: 0.29
Nodes (6): appJs, assert, fs, indexHtml, path, styleCss

### Community 36 - "Proposed Changes"
Cohesion: 0.40
Nodes (4): 2. Markup & Styling (`index.html`, `style.css`), 3. Tests & Verification, Implementation Plan: 4 New In-Game Items & Mobile-First Swipe Bar, Proposed Changes

### Community 37 - "test_permutation_and_lazy_loading.js"
Cohesion: 0.16
Nodes (11): ENGLISH_QUESTION_BANK, assert, ids, levels, app, assert, levelRound201, mockEl (+3 more)

### Community 38 - "test_v260_voice_and_concise_questions.js"
Cohesion: 0.14
Nodes (11): BADGE_DEFINITIONS, EnglishSpeechEngine, englishVoice, sfx, assert, engine, fs, indexHtml (+3 more)

### Community 39 - "test_leaderboard_clean.js"
Cohesion: 0.29
Nodes (7): appJsContent, appJsPath, assert, fs, http, path, srv

### Community 40 - "test_dual_leaderboard.js"
Cohesion: 0.28
Nodes (8): assert, fs, http, path, request(), server, serverPath, srv

### Community 41 - "test_server_compression.js"
Cohesion: 0.25
Nodes (6): assert, http, path, server, serverPath, zlib

### Community 44 - "recordAccessLog"
Cohesion: 0.38
Nodes (7): getClientIp(), getKSTTime(), loadLogs(), recordAccessLog(), saveLogs(), 3.4 접속 감사 로그 및 보안 인가 체계, [2026-11-14] v2.0.0 한자 퀴즈, 연속 라운드, 클린 랭킹, 감사 로깅 대규모 고도화

### Community 45 - "verify_all.js"
Cohesion: 0.32
Nodes (6): assert, fs, http, path, request(), srv

### Community 46 - "idiom_questions.js"
Cohesion: 0.40
Nodes (4): IDIOM_QUESTION_BANK, assert, ids, levels

### Community 47 - "ref_path"
Cohesion: 0.33
Nodes (4): assert, fs, indexHtml, path

## Knowledge Gaps
- **5 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `HaruMatchumApp` connect `HaruMatchumApp` to `test_permutation_and_lazy_loading.js`, `test_v260_voice_and_concise_questions.js`, `3. 핵심 변경 상세 및 원인 분석 (RCA)`?**
  _High betweenness centrality (0.223) - this node is a cross-community bridge._
- **Should `HaruMatchumApp` be split into smaller, more focused modules?**
  _Cohesion score 0.07545787545787545 - nodes in this community are weakly interconnected._
- **Why does `3. 핵심 변경 상세 및 원인 분석 (RCA)` connect `Review Focus` to `HaruMatchumApp`, `recordAccessLog`, `3. 핵심 변경 상세 및 원인 분석 (RCA)`?**
  _High betweenness centrality (0.111) - this node is a cross-community bridge._
- **Should `build_english_bank.py` be split into smaller, more focused modules?**
  _Cohesion score 0.06561085972850679 - nodes in this community are weakly interconnected._
- **Why does `📋 국어 맞춤법 및 한자 퀴즈 프로그램 '하루맞춤' 기술레포트 (Technical Report v2.0)` connect `3. 핵심 변경 상세 및 원인 분석 (RCA)` to `📋 국어 맞춤법 퀴즈 프로그램 '하루맞춤' 기술 리포트 (Technical Report)`, `Review Focus`?**
  _High betweenness centrality (0.091) - this node is a cross-community bridge._
- **Should `server.js` be split into smaller, more focused modules?**
  _Cohesion score 0.12554112554112554 - nodes in this community are weakly interconnected._
- **Should `📋 국어 맞춤법 퀴즈 프로그램 '하루맞춤' 기술 리포트 (Technical Report)` be split into smaller, more focused modules?**
  _Cohesion score 0.05555555555555555 - nodes in this community are weakly interconnected._
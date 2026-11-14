# Graph Report - Spelling  (2026-11-15)

## Corpus Check
- 78 files · ~2,451,903 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .css 1)

## Summary
- 818 nodes · 1276 edges · 50 communities (46 shown, 4 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 72 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `bd346bfe`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- HaruMatchumApp
- test_20000_questions_and_permutations.js
- build_english_bank.py
- server.js
- 📜 하루맞춤 (Haru Matchum) 개발 히스토리 및 변경 로그 (Changelog)
- test_v240_level_rounds_and_items.js
- 3. 핵심 변경 상세 및 원인 분석 (RCA)
- 3. 핵심 변경 상세 및 원인 분석 (RCA)
- test_v253_random_and_unsolved_priority.js
- test_v261_ending_collision_fix.js
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
- ref_path
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
- test_v260_mobile_version_check.js
- MockAudioContext
- MockLevelGameEngine
- app.js

## God Nodes (most connected - your core abstractions)
1. `HaruMatchumApp` - 87 edges
2. `3. 핵심 변경 상세 및 원인 분석 (RCA)` - 18 edges
3. `📋 국어 맞춤법 및 한자 퀴즈 프로그램 '하루맞춤' 기술레포트 (Technical Report v2.0)` - 13 edges
4. `⏱️ 단계별 제작 및 고도화 타임라인` - 13 edges
5. `server` - 13 edges
6. `공통 운영 및 개발 지침 (Common Guidelines)` - 11 edges
7. `SoundEffects` - 10 edges
8. `Tasks` - 10 edges
9. `EnglishSpeechEngine` - 9 edges
10. `getKSTDateString()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Task 1: Server Authentication & Access Logging System (`server.js`)` --references--> `runGit()`  [INFERRED]
  docs/superpowers/plans/2026-11-14-haru-spelling-hanja-enhancement.md → server.js
- `10.3 검증 결과 (Verification Evidence)` --references--> `EnglishSpeechEngine`  [INFERRED]
  기술레포트.md → app.js
- `10.2 해결 아키텍처 및 구현 명세` --references--> `EnglishSpeechEngine`  [INFERRED]
  기술레포트.md → app.js
- `[2026-11-14] v2.0.0 한자 퀴즈, 연속 라운드, 클린 랭킹, 감사 로깅 대규모 고도화` --references--> `getClientIp()`  [INFERRED]
  제작히스토리.md → server.js
- `[2026-11-14] v2.3.0 레벨별 맞춤법 5제, 럭키 박스, 영어 어휘 퀴즈` --references--> `SoundEffects`  [INFERRED]
  제작히스토리.md → app.js

## Import Cycles
- None detected.

## Communities (50 total, 4 thin omitted)

### Community 0 - "HaruMatchumApp"
Cohesion: 0.07
Nodes (8): getKSTDateString(), HaruMatchumApp, 1. Frontend Engine (`app.js`), Task 3: In-Game Items (50:50 Eraser, Heart Second Chance, 2x Booster), Task 5: 5-Question Round Progression & Endless Mode Mechanism (`app.js`, `index.html`, `style.css`), Task 6: User Profile Access History & Admin Audit Log Viewer Modal (`index.html`, `style.css`, `app.js`), 10.2 해결 아키텍처 및 구현 명세, 3.17 모바일 타 앱(카카오톡 등) 전환 복귀 시 퀴즈 세션 자동 보존 및 라운드 스킵 결함 해결 (v2.4.3)

### Community 1 - "test_20000_questions_and_permutations.js"
Cohesion: 0.24
Nodes (7): SPELLING_QUESTION_BANK, assert, banks, targetLevels, assert, ids, levels

### Community 2 - "build_english_bank.py"
Cohesion: 0.07
Nodes (8): build_english_bank(), get_hanja_level_data(), create_idiom_level_data(), build_level1_questions(), build_level2_questions(), build_level3_questions(), build_level4_questions(), build_level5_questions()

### Community 3 - "server.js"
Cohesion: 0.13
Nodes (20): crypto, DB_FILE, { execSync }, fs, generateToken(), getClientIp(), getKSTDateString(), hashPassword() (+12 more)

### Community 4 - "📜 하루맞춤 (Haru Matchum) 개발 히스토리 및 변경 로그 (Changelog)"
Cohesion: 0.10
Nodes (19): 🌐 Nginx Proxy Manager (NPM) 도메인 라우팅 구축, Phase 1: 요구사항 분석 및 구조 설계, Phase 2: 국어원 문제은행 및 데이터베이스 구축 (`questions.js`), Phase 3: 인터랙티브 UI 및 테마 스타일링 (`style.css`), Phase 4: 게임 엔진 및 비즈니스 로직 구현 (`app.js`), Phase 5: 문서화 및 배포 준비, 📌 [v1.0.0] - 2026-11-11 (Official First Release), 📌 [v1.1.0] - 2026-11-11 (National Institute of Korean Language API Integration & Domain Connect) (+11 more)

### Community 5 - "test_v240_level_rounds_and_items.js"
Cohesion: 0.09
Nodes (22): appJs, assert, bindEventsCode, en4, englishQuestionsJs, fs, game, getLevelDailyQuestionsMock() (+14 more)

### Community 6 - "3. 핵심 변경 상세 및 원인 분석 (RCA)"
Cohesion: 0.05
Nodes (41): DataManager, Global Constraints, Review Focus, Task 1: Server Authentication & Access Logging System (`server.js`), Task 2: Leaderboard Real User Filtering & Dummy Peer Elimination (`app.js`, `server.js`), Task 3: Hanja Question Bank & Dictionary Deep Linking (`hanja_questions.js`, `index.html`), Task 4: UI Mode Switcher & Dual Theme Support (`index.html`, `style.css`, `app.js`), Task 7: Comprehensive Integration Verification, GitHub Sync & Tech Documentation (+33 more)

### Community 7 - "3. 핵심 변경 상세 및 원인 분석 (RCA)"
Cohesion: 0.06
Nodes (33): 10.1 버그 진단 및 원인 분석 (RCA - /diagnosing-superpowers), 10.3 검증 결과 (Verification Evidence), 10. 퀴즈 질문 맥락 불일치 완전 해소(간결화) 및 영어 퀴즈 네이티브 음성(TTS) 엔진 탑재 (v2.6.0), 11.1 문제 진단 및 필요성 (Problem & Needs), 11.2 해결 아키텍처 및 구현 명세 (Architecture & Implementation), 11.3 검증 결과 (Verification Evidence), 11. 모바일 구버전 자동 감지 및 스마트 백그라운드 자동 새로고침 엔진 탑재 (v2.6.0), 12.1 문제점 진단 및 근본 원인 분석 (RCA - /diagnosing-superpowers) (+25 more)

### Community 8 - "test_v253_random_and_unsolved_priority.js"
Cohesion: 0.09
Nodes (21): answerPositions, assert, banks, expectedUsers, fs, harness, largePool, levels (+13 more)

### Community 9 - "test_v261_ending_collision_fix.js"
Cohesion: 0.14
Nodes (12): appJsCode, assert, collisionSamples, fs, healed, indexHtml, path, q4694 (+4 more)

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

### Community 20 - "ref_path"
Cohesion: 0.18
Nodes (8): assert, fs, indexHtml, path, appJs, assert, fs, path

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
Cohesion: 0.04
Nodes (43): 1. 📜 한자(漢字) 및 고사성어 퀴즈 신규 모드, 2. 🔥 5문제 만점 시 무한 연속 라운드 시스템, 3. 👑 실제 활동 유저 기반 클린 실시간 랭킹, 4. 🔒 서버 접속 및 이용 이력 감사 로깅 (Security Audit), 5. 🏛️ 국립국어원 표준국어대사전 규정 준수, 🌐 GitHub Pages 활성화 방법, 🎀 v2.0 주요 특징 및 기능, 📄 기술 문서 (+35 more)

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
Cohesion: 0.16
Nodes (11): IDIOM_QUESTION_BANK, assert, ids, levels, assert, engine, fs, indexHtml (+3 more)

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
Cohesion: 0.60
Nodes (5): getKSTTime(), recordAccessLog(), saveLogs(), 3.4 접속 감사 로그 및 보안 인가 체계, [2026-11-14] v2.0.0 한자 퀴즈, 연속 라운드, 클린 랭킹, 감사 로깅 대규모 고도화

### Community 45 - "verify_all.js"
Cohesion: 0.32
Nodes (6): assert, fs, http, path, request(), srv

### Community 46 - "test_v260_mobile_version_check.js"
Cohesion: 0.15
Nodes (11): appJs, assert, fs, http, indexHtml, path, ROOT_DIR, serverProc (+3 more)

### Community 49 - "app.js"
Cohesion: 0.16
Nodes (7): BADGE_DEFINITIONS, ConfettiManager, EnglishSpeechEngine, englishVoice, sfx, SoundEffects, [2026-11-14] v2.3.0 레벨별 맞춤법 5제, 럭키 박스, 영어 어휘 퀴즈

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `HaruMatchumApp` connect `HaruMatchumApp` to `app.js`, `test_permutation_and_lazy_loading.js`, `test_v260_voice_and_concise_questions.js`, `3. 핵심 변경 상세 및 원인 분석 (RCA)`?**
  _High betweenness centrality (0.211) - this node is a cross-community bridge._
- **Should `HaruMatchumApp` be split into smaller, more focused modules?**
  _Cohesion score 0.06942983378918578 - nodes in this community are weakly interconnected._
- **Why does `📋 국어 맞춤법 및 한자 퀴즈 프로그램 '하루맞춤' 기술레포트 (Technical Report v2.0)` connect `3. 핵심 변경 상세 및 원인 분석 (RCA)` to `⏱️ 단계별 제작 및 고도화 타임라인`, `3. 핵심 변경 상세 및 원인 분석 (RCA)`?**
  _High betweenness centrality (0.104) - this node is a cross-community bridge._
- **Should `build_english_bank.py` be split into smaller, more focused modules?**
  _Cohesion score 0.06561085972850679 - nodes in this community are weakly interconnected._
- **Why does `3. 핵심 변경 상세 및 원인 분석 (RCA)` connect `3. 핵심 변경 상세 및 원인 분석 (RCA)` to `HaruMatchumApp`, `recordAccessLog`, `3. 핵심 변경 상세 및 원인 분석 (RCA)`?**
  _High betweenness centrality (0.078) - this node is a cross-community bridge._
- **Should `server.js` be split into smaller, more focused modules?**
  _Cohesion score 0.1341991341991342 - nodes in this community are weakly interconnected._
- **Should `📜 하루맞춤 (Haru Matchum) 개발 히스토리 및 변경 로그 (Changelog)` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
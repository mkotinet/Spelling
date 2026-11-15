# Graph Report - Spelling  (2026-11-15)

## Corpus Check
- 80 files · ~2,454,265 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .css 1)

## Summary
- 848 nodes · 1308 edges · 46 communities (42 shown, 4 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 72 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `76b55489`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- HaruMatchumApp
- test_20000_questions_and_permutations.js
- build_english_bank.py
- server.js
- 📋 국어 맞춤법 퀴즈 프로그램 '하루맞춤' 기술 리포트 (Technical Report)
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
- test_v262_user_bug_fixes.js
- Architecture & Components
- ⏱️ 단계별 제작 및 고도화 타임라인
- test_v252_ending_and_shield_decision.js
- test_game_items.js
- 공통 운영 및 개발 지침 (Common Guidelines)
- Review Focus
- hanja_questions.js
- test_hanja_bank.js
- test_audit_logs_ui.js
- test_mode_toggle.js
- Proposed Changes
- test_permutation_and_lazy_loading.js
- test_v260_voice_and_concise_questions.js
- MockEngine
- QuestionSelectionHarness
- verify_all.js
- test_v260_mobile_version_check.js
- MockAudioContext
- MockLevelGameEngine
- app.js

## God Nodes (most connected - your core abstractions)
1. `HaruMatchumApp` - 87 edges
2. `3. 핵심 변경 상세 및 원인 분석 (RCA)` - 18 edges
3. `⏱️ 단계별 제작 및 고도화 타임라인` - 13 edges
4. `server` - 13 edges
5. `📋 국어 맞춤법 및 한자 퀴즈 프로그램 '하루맞춤' 기술레포트 (Technical Report v2.0)` - 13 edges
6. `공통 운영 및 개발 지침 (Common Guidelines)` - 12 edges
7. `공통 운영 및 개발 지침 (Common Guidelines)` - 12 edges
8. `SoundEffects` - 10 edges
9. `Tasks` - 10 edges
10. `EnglishSpeechEngine` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Task 1: Server Authentication & Access Logging System (`server.js`)` --references--> `runGit()`  [INFERRED]
  docs/superpowers/plans/2026-11-14-haru-spelling-hanja-enhancement.md → server.js
- `10.3 검증 결과 (Verification Evidence)` --references--> `EnglishSpeechEngine`  [INFERRED]
  기술레포트.md → app.js
- `[2026-11-14] v2.3.0 레벨별 맞춤법 5제, 럭키 박스, 영어 어휘 퀴즈` --references--> `EnglishSpeechEngine`  [INFERRED]
  제작히스토리.md → app.js
- `[2026-11-14] v2.3.0 레벨별 맞춤법 5제, 럭키 박스, 영어 어휘 퀴즈` --references--> `SoundEffects`  [INFERRED]
  제작히스토리.md → app.js
- `10.2 해결 아키텍처 및 구현 명세` --references--> `EnglishSpeechEngine`  [INFERRED]
  기술레포트.md → app.js

## Import Cycles
- None detected.

## Communities (46 total, 4 thin omitted)

### Community 0 - "HaruMatchumApp"
Cohesion: 0.07
Nodes (9): getKSTDateString(), HaruMatchumApp, SoundEffects, 1. Frontend Engine (`app.js`), Task 3: In-Game Items (50:50 Eraser, Heart Second Chance, 2x Booster), Task 5: 5-Question Round Progression & Endless Mode Mechanism (`app.js`, `index.html`, `style.css`), Task 6: User Profile Access History & Admin Audit Log Viewer Modal (`index.html`, `style.css`, `app.js`), 3.17 모바일 타 앱(카카오톡 등) 전환 복귀 시 퀴즈 세션 자동 보존 및 라운드 스킵 결함 해결 (v2.4.3) (+1 more)

### Community 1 - "test_20000_questions_and_permutations.js"
Cohesion: 0.24
Nodes (7): ENGLISH_QUESTION_BANK, assert, banks, targetLevels, assert, ids, levels

### Community 2 - "build_english_bank.py"
Cohesion: 0.07
Nodes (8): build_english_bank(), get_hanja_level_data(), create_idiom_level_data(), build_level1_questions(), build_level2_questions(), build_level3_questions(), build_level4_questions(), build_level5_questions()

### Community 3 - "server.js"
Cohesion: 0.07
Nodes (39): Task 1: Server Authentication & Access Logging System (`server.js`), crypto, DB_FILE, { execSync }, fs, generateToken(), getClientIp(), getKSTDateString() (+31 more)

### Community 4 - "📋 국어 맞춤법 퀴즈 프로그램 '하루맞춤' 기술 리포트 (Technical Report)"
Cohesion: 0.11
Nodes (18): 1.1 배경, 1.2 핵심 개발 목표, 1. 프로젝트 개요 및 배경, 2. 시스템 아키텍처 (System Architecture v1.3.0), 3.1 사용자 경험 설계, 3.2 백엔드 RESTful API 엔드포인트 명세, 3.3 데이터 스키마 (`data/users.json`), 3. 간편 회원가입 및 멀티 디바이스 동기화 메커니즘 (+10 more)

### Community 5 - "test_v240_level_rounds_and_items.js"
Cohesion: 0.09
Nodes (22): appJs, assert, bindEventsCode, en4, englishQuestionsJs, fs, game, getLevelDailyQuestionsMock() (+14 more)

### Community 6 - "3. 핵심 변경 상세 및 원인 분석 (RCA)"
Cohesion: 0.05
Nodes (40): DataManager, Global Constraints, Review Focus, Task 2: Leaderboard Real User Filtering & Dummy Peer Elimination (`app.js`, `server.js`), Task 3: Hanja Question Bank & Dictionary Deep Linking (`hanja_questions.js`, `index.html`), Task 4: UI Mode Switcher & Dual Theme Support (`index.html`, `style.css`, `app.js`), Task 7: Comprehensive Integration Verification, GitHub Sync & Tech Documentation, 하루맞춤(Haru Matchum) 한자 퀴즈 및 시스템 고도화 Implementation Plan (+32 more)

### Community 7 - "3. 핵심 변경 상세 및 원인 분석 (RCA)"
Cohesion: 0.06
Nodes (30): 11.1 문제 진단 및 필요성 (Problem & Needs), 11.2 해결 아키텍처 및 구현 명세 (Architecture & Implementation), 11.3 검증 결과 (Verification Evidence), 11. 모바일 구버전 자동 감지 및 스마트 백그라운드 자동 새로고침 엔진 탑재 (v2.6.0), 12.1 문제점 진단 및 근본 원인 분석 (RCA - /diagnosing-superpowers), 12.2 해결 아키텍처 및 구현 명세 (Architecture & Implementation), 12.3 검증 결과 (Verification Evidence), 12. 속담 및 관용구 종결어미 중복 충돌 전면 해소 및 런타임 자가 치유 가드 탑재 (v2.6.1) (+22 more)

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
Cohesion: 0.15
Nodes (12): 10. 게이미피케이션 상태 동기화 및 랭킹 분리 무결성 원칙 (Gamification & Dual-Ranking Integrity), 11. Graphify 지식 그래프 연동 원칙 (Knowledge Graph Architecture), 1. 양방향 GitHub 형상 동기화 원칙 (Bidirectional Git Sync), 2. 기술레포트 및 히스토리 필수 반영 원칙 (Documentation Principle), 3. 네트워크 및 도메인 보안 연동 원칙, 4. 시간대(KST) 및 일일 갱신 기준 표준화 (Timezone & Midnight Rollover), 5. 모바일 웹앱 라이프사이클 및 백그라운드 복귀 보장 (Mobile Lifecycle), 6. 순수 실제 회원 기반 데이터 무결성 원칙 (No Mock Data in Production) (+4 more)

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

### Community 25 - "test_v262_user_bug_fixes.js"
Cohesion: 0.12
Nodes (15): appJs, assert, duplicateQuestions, fs, gungbyeokQuestions, heehanQuestions, indexHtml, path (+7 more)

### Community 26 - "Architecture & Components"
Cohesion: 0.22
Nodes (8): 1. Backend (`server.js`), 2. English Question Bank (`english_questions.js`), 3. Level-Based Quiz Mode (`questions.js`, `hanja_questions.js`, `app.js`, `index.html`), 4. Surprise Lucky Box Item Drop (`app.js`, `index.html`, `style.css`), 5. UI & Theme Expansion (`index.html`, `style.css`), 6. Testing & Deployment, Architecture & Components, Implementation Plan: Level-Based Daily Quiz, Surprise Lucky Box, and English Subject Expansion

### Community 27 - "⏱️ 단계별 제작 및 고도화 타임라인"
Cohesion: 0.04
Nodes (44): 🌐 Nginx Proxy Manager (NPM) 도메인 라우팅 구축, Phase 1: 요구사항 분석 및 구조 설계, Phase 2: 국어원 문제은행 및 데이터베이스 구축 (`questions.js`), Phase 3: 인터랙티브 UI 및 테마 스타일링 (`style.css`), Phase 4: 게임 엔진 및 비즈니스 로직 구현 (`app.js`), Phase 5: 문서화 및 배포 준비, 📌 [v1.0.0] - 2026-11-11 (Official First Release), 📌 [v1.1.0] - 2026-11-11 (National Institute of Korean Language API Integration & Domain Connect) (+36 more)

### Community 28 - "test_v252_ending_and_shield_decision.js"
Cohesion: 0.17
Nodes (11): appCode, assert, engine, expectedPromptSnippets, fs, htmlCode, outcome, path (+3 more)

### Community 29 - "test_game_items.js"
Cohesion: 0.22
Nodes (8): appCode, assert, fs, hidden, mockQuestion, path, qWithDict, wrongIndices

### Community 30 - "공통 운영 및 개발 지침 (Common Guidelines)"
Cohesion: 0.15
Nodes (12): 10. 게이미피케이션 상태 동기화 및 랭킹 분리 무결성 원칙 (Gamification & Dual-Ranking Integrity), 11. Graphify 지식 그래프 연동 원칙 (Knowledge Graph Architecture), 1. 양방향 GitHub 형상 동기화 원칙 (Bidirectional Git Sync), 2. 기술레포트 및 히스토리 필수 반영 원칙 (Documentation Principle), 3. 네트워크 및 도메인 보안 연동 원칙, 4. 시간대(KST) 및 일일 갱신 기준 표준화 (Timezone & Midnight Rollover), 5. 모바일 웹앱 라이프사이클 및 백그라운드 복귀 보장 (Mobile Lifecycle), 6. 순수 실제 회원 기반 데이터 무결성 원칙 (No Mock Data in Production) (+4 more)

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
Nodes (11): SPELLING_QUESTION_BANK, app, assert, levelRound201, mockEl, round1001, seenLevelIds, seenSpellingIds (+3 more)

### Community 38 - "test_v260_voice_and_concise_questions.js"
Cohesion: 0.16
Nodes (11): IDIOM_QUESTION_BANK, assert, ids, levels, assert, engine, fs, indexHtml (+3 more)

### Community 45 - "verify_all.js"
Cohesion: 0.38
Nodes (6): assert, fs, http, path, request(), srv

### Community 46 - "test_v260_mobile_version_check.js"
Cohesion: 0.05
Nodes (35): assert, fs, http, path, request(), server, serverPath, srv (+27 more)

### Community 49 - "app.js"
Cohesion: 0.17
Nodes (9): BADGE_DEFINITIONS, ConfettiManager, EnglishSpeechEngine, englishVoice, sfx, 10.1 버그 진단 및 원인 분석 (RCA - /diagnosing-superpowers), 10.2 해결 아키텍처 및 구현 명세, 10.3 검증 결과 (Verification Evidence) (+1 more)

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `HaruMatchumApp` connect `HaruMatchumApp` to `app.js`, `test_permutation_and_lazy_loading.js`, `test_v260_voice_and_concise_questions.js`, `3. 핵심 변경 상세 및 원인 분석 (RCA)`?**
  _High betweenness centrality (0.203) - this node is a cross-community bridge._
- **Should `HaruMatchumApp` be split into smaller, more focused modules?**
  _Cohesion score 0.06567675613934894 - nodes in this community are weakly interconnected._
- **Why does `📋 국어 맞춤법 및 한자 퀴즈 프로그램 '하루맞춤' 기술레포트 (Technical Report v2.0)` connect `3. 핵심 변경 상세 및 원인 분석 (RCA)` to `app.js`, `⏱️ 단계별 제작 및 고도화 타임라인`, `3. 핵심 변경 상세 및 원인 분석 (RCA)`?**
  _High betweenness centrality (0.099) - this node is a cross-community bridge._
- **Should `build_english_bank.py` be split into smaller, more focused modules?**
  _Cohesion score 0.06561085972850679 - nodes in this community are weakly interconnected._
- **Why does `3. 핵심 변경 상세 및 원인 분석 (RCA)` connect `3. 핵심 변경 상세 및 원인 분석 (RCA)` to `HaruMatchumApp`, `server.js`, `3. 핵심 변경 상세 및 원인 분석 (RCA)`?**
  _High betweenness centrality (0.074) - this node is a cross-community bridge._
- **Should `server.js` be split into smaller, more focused modules?**
  _Cohesion score 0.06553911205073996 - nodes in this community are weakly interconnected._
- **Should `📋 국어 맞춤법 퀴즈 프로그램 '하루맞춤' 기술 리포트 (Technical Report)` be split into smaller, more focused modules?**
  _Cohesion score 0.1111111111111111 - nodes in this community are weakly interconnected._
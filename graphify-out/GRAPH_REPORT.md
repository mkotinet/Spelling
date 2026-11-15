# Graph Report - Spelling  (2026-11-15)

## Corpus Check
- 83 files · ~2,466,237 words
- Verdict: corpus is large enough that graph structure adds value.
- Unclassified: 3 file(s) not represented in the graph (top: (none) 2, .css 1)

## Summary
- 932 nodes · 1496 edges · 65 communities (61 shown, 4 thin omitted)
- Extraction: 94% EXTRACTED · 6% INFERRED · 0% AMBIGUOUS · INFERRED: 90 edges (avg confidence: 0.91)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `2ce06618`
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
- EnglishSpeechEngine
- test_v253_random_and_unsolved_priority.js
- test_v261_ending_collision_fix.js
- test_v230_features.js
- generate_spelling_5000.js
- spelling
- generate_english_5000.js
- generate_hanja_5000.js
- test_v280_shop_preview_and_grammar_polish.js
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
- test_random_answer_distribution.js
- test_hanja_bank.js
- test_audit_logs_ui.js
- test_mode_toggle.js
- Proposed Changes
- test_permutation_and_lazy_loading.js
- test_v260_voice_and_concise_questions.js
- test_v270_sound_shop_and_avatar.js
- test_four_subjects_integration.js
- test_dual_leaderboard.js
- MockEngine
- QuestionSelectionHarness
- test_server_logs.js
- verify_all.js
- test_v260_mobile_version_check.js
- 📋 국어 맞춤법 및 한자 퀴즈 프로그램 '하루맞춤' 기술레포트 (Technical Report v2.0)
- 5. 상세 구현 명세 (Detailed Specifications)
- test_server_compression.js
- 9. 매번 랜덤한 출제 순서 보장 및 미풀이 문제 최우선 선별 엔진 고도화 (v2.5.3)
- 11. 모바일 구버전 자동 감지 및 스마트 백그라운드 자동 새로고침 엔진 탑재 (v2.6.0)
- 12. 속담 및 관용구 종결어미 중복 충돌 전면 해소 및 런타임 자가 치유 가드 탑재 (v2.6.1)
- test_v271_whats_new_modal.js
- 13. v2.6.2 사용자 제보 3대 버그 완전 해결 (방패 설명 오기, 선택지 중복 0건 전수 정규화, 관형사형 정답 정합성 교정)
- 14. [2026-11-15] v2.7.0 모바일 음성/TTS 언락, 문항 #4333 조사 정비, 랭킹 점수 정합성, 포인트 상점 & 22종 아바타 악세사리 꾸미기 및 고해상도 확대 갤러리 구축
- 5. 20,000문항 대규모 확장 및 경량화 최적화 아키텍처 (v2.5.0)
- 7. 20,000문항 문맥 연관성 및 의미적 추론성 전면 고도화 (v2.5.1)
- 8. 종결어미 충돌 해소, 레벨별 발문 차등화 및 방패 의사결정 시스템 고도화 (v2.5.2)
- test_leaderboard_clean.js
- recordAccessLog
- idiom_questions.js
- MockAudioContext
- 15. [2026-11-15] v2.7.1 업데이트 안내 팝업(What's New) 모달 및 '더 이상 보지 않기' 영구 저장 마이너 업데이트
- MockLevelGameEngine

## God Nodes (most connected - your core abstractions)
1. `HaruMatchumApp` - 107 edges
2. `3. 핵심 변경 상세 및 원인 분석 (RCA)` - 18 edges
3. `📋 국어 맞춤법 및 한자 퀴즈 프로그램 '하루맞춤' 기술레포트 (Technical Report v2.0)` - 16 edges
4. `⏱️ 단계별 제작 및 고도화 타임라인` - 13 edges
5. `server` - 13 edges
6. `EnglishSpeechEngine` - 12 edges
7. `공통 운영 및 개발 지침 (Common Guidelines)` - 12 edges
8. `공통 운영 및 개발 지침 (Common Guidelines)` - 12 edges
9. `SoundEffects` - 10 edges
10. `Tasks` - 10 edges

## Surprising Connections (you probably didn't know these)
- `Task 1: Server Authentication & Access Logging System (`server.js`)` --references--> `runGit()`  [INFERRED]
  docs/superpowers/plans/2026-11-14-haru-spelling-hanja-enhancement.md → server.js
- `10.3 검증 결과 (Verification Evidence)` --references--> `EnglishSpeechEngine`  [INFERRED]
  기술레포트.md → app.js
- `14.2 해결 아키텍처 및 구현 명세 (Architecture & Implementation)` --references--> `EnglishSpeechEngine`  [INFERRED]
  기술레포트.md → app.js
- `[2026-11-14] v2.3.0 레벨별 맞춤법 5제, 럭키 박스, 영어 어휘 퀴즈` --references--> `EnglishSpeechEngine`  [INFERRED]
  제작히스토리.md → app.js
- `14.2 해결 아키텍처 및 구현 명세 (Architecture & Implementation)` --references--> `renderCompositeAvatar()`  [INFERRED]
  기술레포트.md → app.js

## Import Cycles
- None detected.

## Communities (65 total, 4 thin omitted)

### Community 0 - "HaruMatchumApp"
Cohesion: 0.05
Nodes (12): findAccessoryById(), getKSTDateString(), HaruMatchumApp, renderCompositeAvatar(), SoundEffects, Task 6: 4-Subject UI, Theme Styling & Server Persistence (`index.html`, `style.css`, `server.js`, `app.js`), 1. Frontend Engine (`app.js`), Task 3: In-Game Items (50:50 Eraser, Heart Second Chance, 2x Booster) (+4 more)

### Community 1 - "test_20000_questions_and_permutations.js"
Cohesion: 0.24
Nodes (7): ENGLISH_QUESTION_BANK, assert, banks, targetLevels, assert, ids, levels

### Community 2 - "build_english_bank.py"
Cohesion: 0.07
Nodes (8): build_english_bank(), get_hanja_level_data(), create_idiom_level_data(), build_level1_questions(), build_level2_questions(), build_level3_questions(), build_level4_questions(), build_level5_questions()

### Community 3 - "server.js"
Cohesion: 0.13
Nodes (19): Task 1: Server Authentication & Access Logging System (`server.js`), crypto, DB_FILE, { execSync }, fs, generateToken(), getKSTDateString(), hashPassword() (+11 more)

### Community 4 - "📜 하루맞춤 (Haru Matchum) 개발 히스토리 및 변경 로그 (Changelog)"
Cohesion: 0.10
Nodes (19): 🌐 Nginx Proxy Manager (NPM) 도메인 라우팅 구축, Phase 1: 요구사항 분석 및 구조 설계, Phase 2: 국어원 문제은행 및 데이터베이스 구축 (`questions.js`), Phase 3: 인터랙티브 UI 및 테마 스타일링 (`style.css`), Phase 4: 게임 엔진 및 비즈니스 로직 구현 (`app.js`), Phase 5: 문서화 및 배포 준비, 📌 [v1.0.0] - 2026-11-11 (Official First Release), 📌 [v1.1.0] - 2026-11-11 (National Institute of Korean Language API Integration & Domain Connect) (+11 more)

### Community 5 - "test_v240_level_rounds_and_items.js"
Cohesion: 0.09
Nodes (22): appJs, assert, bindEventsCode, en4, englishQuestionsJs, fs, game, getLevelDailyQuestionsMock() (+14 more)

### Community 6 - "3. 핵심 변경 상세 및 원인 분석 (RCA)"
Cohesion: 0.06
Nodes (31): ACCESSORY_DEFINITIONS, BADGE_DEFINITIONS, ConfettiManager, DataManager, englishVoice, ITEM_PRICES, sfx, Global Constraints (+23 more)

### Community 7 - "EnglishSpeechEngine"
Cohesion: 0.38
Nodes (5): EnglishSpeechEngine, 10.1 버그 진단 및 원인 분석 (RCA - /diagnosing-superpowers), 10.2 해결 아키텍처 및 구현 명세, 10.3 검증 결과 (Verification Evidence), 10. 퀴즈 질문 맥락 불일치 완전 해소(간결화) 및 영어 퀴즈 네이티브 음성(TTS) 엔진 탑재 (v2.6.0)

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
Cohesion: 0.06
Nodes (28): ALL_HANJA, BUSINESS_HANJA, CONTEXT_TEMPLATES_HANJA, CSAT_HANJA, ELEMENTARY_HANJA, fs, HIGH_HANJA, MIDDLE_HANJA (+20 more)

### Community 15 - "test_v280_shop_preview_and_grammar_polish.js"
Cohesion: 0.10
Nodes (19): allBanks, appJs, assert, css, defMatch, expectedCategories, fs, funcMatch (+11 more)

### Community 16 - "test_mobile_lifecycle_refresh.js"
Cohesion: 0.14
Nodes (10): appJs, appJsPath, assert, fs, kstResult, midnightKstDate, mockApp, MockHaruApp (+2 more)

### Community 17 - "Tasks"
Cohesion: 0.14
Nodes (13): Global Constraints, Review Focus, Task 1: Server-Side Gzip Compression & Caching Optimization (`server.js`), Task 2: High-Capacity Spelling Question Bank Expansion (5,000 Questions), Task 3: Idiom & Proverb Question Bank Creation (5,000 Questions), Task 4: Hanja & Chengyu Question Bank Expansion (5,000 Questions), Task 5: English Vocabulary & Spelling Question Bank Expansion (5,000 Questions), Task 6: Permutation Block Slicing Engine & On-Demand Subject Loader (`app.js`) (+5 more)

### Community 18 - "Tasks"
Cohesion: 0.17
Nodes (11): Global Constraints, Review Focus, Task 1: Dataset Generation Tools & Spelling Question Bank Expansion (1,000 Questions), Task 2: Idiom & Proverb Question Bank (`idiom_questions.js`) Creation (1,000 Questions), Task 3: Hanja & Chengyu Question Bank (`hanja_questions.js`) Expansion (1,000 Questions), Task 4: English Vocabulary & Spelling Question Bank (`english_questions.js`) Expansion (1,000 Questions), Task 5: Permutation Block Slicing Engine (`app.js`), Task 7: Comprehensive System Verification Suite & Duplicate Stress Test (+3 more)

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
Cohesion: 0.20
Nodes (7): assert, duplicateList, assert, fs, indexHtml, path, styleCss

### Community 25 - "test_v262_user_bug_fixes.js"
Cohesion: 0.12
Nodes (15): appJs, assert, duplicateQuestions, fs, gungbyeokQuestions, heehanQuestions, indexHtml, path (+7 more)

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

### Community 30 - "공통 운영 및 개발 지침 (Common Guidelines)"
Cohesion: 0.15
Nodes (12): 10. 게이미피케이션 상태 동기화 및 랭킹 분리 무결성 원칙 (Gamification & Dual-Ranking Integrity), 11. Graphify 지식 그래프 연동 원칙 (Knowledge Graph Architecture), 1. 양방향 GitHub 형상 동기화 원칙 (Bidirectional Git Sync), 2. 기술레포트 및 히스토리 필수 반영 원칙 (Documentation Principle), 3. 네트워크 및 도메인 보안 연동 원칙, 4. 시간대(KST) 및 일일 갱신 기준 표준화 (Timezone & Midnight Rollover), 5. 모바일 웹앱 라이프사이클 및 백그라운드 복귀 보장 (Mobile Lifecycle), 6. 순수 실제 회원 기반 데이터 무결성 원칙 (No Mock Data in Production) (+4 more)

### Community 31 - "Review Focus"
Cohesion: 0.25
Nodes (7): Global Constraints, Haru Matchum v2.2.0 Gamification & Dual-Subject Leaderboard Implementation Plan, Review Focus, Task 1: Backend Data Model & Dual-Subject Leaderboard API, Task 2: Gamification Core Logic (Shields, 300P Streak Bonus, Checkpoint & Revive), Task 4: Game Guide Modal & Dual Leaderboard UI, Task 5: End-to-End Integration, Docs, Docker Deployment & Live Verification

### Community 32 - "test_random_answer_distribution.js"
Cohesion: 0.33
Nodes (4): assert, distribution, originalIndices, sampleQ

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
Nodes (11): HANJA_QUESTION_BANK, assert, ids, levels, assert, engine, fs, indexHtml (+3 more)

### Community 39 - "test_v270_sound_shop_and_avatar.js"
Cohesion: 0.13
Nodes (14): appJs, assert, BASE_DIR, fs, indexHtml, miniUser, path, rawQuestions (+6 more)

### Community 40 - "test_four_subjects_integration.js"
Cohesion: 0.20
Nodes (8): assert, css, fs, html, http, path, server, serverPath

### Community 41 - "test_dual_leaderboard.js"
Cohesion: 0.28
Nodes (8): assert, fs, http, path, request(), server, serverPath, srv

### Community 44 - "test_server_logs.js"
Cohesion: 0.28
Nodes (8): assert, fs, http, path, request(), runTests(), server, serverPath

### Community 45 - "verify_all.js"
Cohesion: 0.32
Nodes (6): assert, fs, http, path, request(), srv

### Community 46 - "test_v260_mobile_version_check.js"
Cohesion: 0.15
Nodes (11): appJs, assert, fs, http, indexHtml, path, ROOT_DIR, serverProc (+3 more)

### Community 47 - "📋 국어 맞춤법 및 한자 퀴즈 프로그램 '하루맞춤' 기술레포트 (Technical Report v2.0)"
Cohesion: 0.33
Nodes (6): 1.1 주요 고도화 요구사항, 1. 개요 및 고도화 배경, 2. 시스템 아키텍처 (v2.0.0), 4. 엔드포인트 및 단위 테스트 검증 결과, 6. 결론 및 운영 제언, 📋 국어 맞춤법 및 한자 퀴즈 프로그램 '하루맞춤' 기술레포트 (Technical Report v2.0)

### Community 48 - "5. 상세 구현 명세 (Detailed Specifications)"
Cohesion: 0.12
Nodes (15): 1. 개요 (Intent & The Why), 2.1 목표 (Goals), 2.2 비목표 (Non-Goals), 2.3 안티골 (Anti-Goals), 2. 목표 (Goals), 비목표 (Non-Goals), 안티골 (Anti-Goals), 3. 제약 사항 (Constraints), 4. 접근 방식 검토 (Approaches Considered), 5.1 UI/UX: 퀴즈 모드 전환 탭 스위치 (+7 more)

### Community 49 - "test_server_compression.js"
Cohesion: 0.25
Nodes (6): assert, http, path, server, serverPath, zlib

### Community 50 - "9. 매번 랜덤한 출제 순서 보장 및 미풀이 문제 최우선 선별 엔진 고도화 (v2.5.3)"
Cohesion: 0.40
Nodes (4): 9.1 문제 진단 및 원인 분석 (RCA - Diagnosing Superpowers), 9.2 해결 아키텍처 및 구현 명세, 9.3 검증 결과 (Verification Evidence), 9. 매번 랜덤한 출제 순서 보장 및 미풀이 문제 최우선 선별 엔진 고도화 (v2.5.3)

### Community 51 - "11. 모바일 구버전 자동 감지 및 스마트 백그라운드 자동 새로고침 엔진 탑재 (v2.6.0)"
Cohesion: 0.50
Nodes (4): 11.1 문제 진단 및 필요성 (Problem & Needs), 11.2 해결 아키텍처 및 구현 명세 (Architecture & Implementation), 11.3 검증 결과 (Verification Evidence), 11. 모바일 구버전 자동 감지 및 스마트 백그라운드 자동 새로고침 엔진 탑재 (v2.6.0)

### Community 52 - "12. 속담 및 관용구 종결어미 중복 충돌 전면 해소 및 런타임 자가 치유 가드 탑재 (v2.6.1)"
Cohesion: 0.50
Nodes (4): 12.1 문제점 진단 및 근본 원인 분석 (RCA - /diagnosing-superpowers), 12.2 해결 아키텍처 및 구현 명세 (Architecture & Implementation), 12.3 검증 결과 (Verification Evidence), 12. 속담 및 관용구 종결어미 중복 충돌 전면 해소 및 런타임 자가 치유 가드 탑재 (v2.6.1)

### Community 53 - "test_v271_whats_new_modal.js"
Cohesion: 0.22
Nodes (8): appJs, assert, BASE_DIR, fs, indexHtml, path, styleCss, versionJson

### Community 54 - "13. v2.6.2 사용자 제보 3대 버그 완전 해결 (방패 설명 오기, 선택지 중복 0건 전수 정규화, 관형사형 정답 정합성 교정)"
Cohesion: 0.50
Nodes (4): 13.1 장애 및 결함 원인 분석 (RCA: Root Cause Analysis), 13.2 해결 아키텍처 및 구현 명세 (Architecture & Implementation), 13.3 검증 결과 (Verification Evidence), 13. v2.6.2 사용자 제보 3대 버그 완전 해결 (방패 설명 오기, 선택지 중복 0건 전수 정규화, 관형사형 정답 정합성 교정)

### Community 55 - "14. [2026-11-15] v2.7.0 모바일 음성/TTS 언락, 문항 #4333 조사 정비, 랭킹 점수 정합성, 포인트 상점 & 22종 아바타 악세사리 꾸미기 및 고해상도 확대 갤러리 구축"
Cohesion: 0.50
Nodes (4): 14.1 장애 및 결함 원인 분석 (RCA: Root Cause Analysis), 14. [2026-11-15] v2.7.0 모바일 음성/TTS 언락, 문항 #4333 조사 정비, 랭킹 점수 정합성, 포인트 상점 & 22종 아바타 악세사리 꾸미기 및 고해상도 확대 갤러리 구축, 14.2 해결 아키텍처 및 구현 명세 (Architecture & Implementation), 14.3 검증 결과 (Verification Evidence)

### Community 56 - "5. 20,000문항 대규모 확장 및 경량화 최적화 아키텍처 (v2.5.0)"
Cohesion: 0.50
Nodes (4): 5.1 4대 과목 각 5,000문항 (총 20,000문항) 구축, 5. 20,000문항 대규모 확장 및 경량화 최적화 아키텍처 (v2.5.0), 5.2 1,000라운드 완전 무중복 순열 블록 슬라이싱 (Permutation Block Slicing), 5.3 성능 최적화 및 경량화 보장

### Community 57 - "7. 20,000문항 문맥 연관성 및 의미적 추론성 전면 고도화 (v2.5.1)"
Cohesion: 0.50
Nodes (4): 7.1 문제점 진단 (RCA: Root Cause Analysis), 7. 20,000문항 문맥 연관성 및 의미적 추론성 전면 고도화 (v2.5.1), 7.2 해결 아키텍처 및 고도화 명세, 7.3 검증 결과 (Verification Evidence)

### Community 58 - "8. 종결어미 충돌 해소, 레벨별 발문 차등화 및 방패 의사결정 시스템 고도화 (v2.5.2)"
Cohesion: 0.50
Nodes (4): 8.1 문제점 진단 (RCA: Root Cause Analysis), 8.2 해결 아키텍처 및 구현 명세, 8.3 검증 결과 (Verification Evidence), 8. 종결어미 충돌 해소, 레벨별 발문 차등화 및 방패 의사결정 시스템 고도화 (v2.5.2)

### Community 59 - "test_leaderboard_clean.js"
Cohesion: 0.29
Nodes (7): appJsContent, appJsPath, assert, fs, http, path, srv

### Community 60 - "recordAccessLog"
Cohesion: 0.38
Nodes (7): getClientIp(), getKSTTime(), loadLogs(), recordAccessLog(), saveLogs(), 3.4 접속 감사 로그 및 보안 인가 체계, [2026-11-14] v2.0.0 한자 퀴즈, 연속 라운드, 클린 랭킹, 감사 로깅 대규모 고도화

### Community 61 - "idiom_questions.js"
Cohesion: 0.40
Nodes (4): IDIOM_QUESTION_BANK, assert, ids, levels

### Community 63 - "15. [2026-11-15] v2.7.1 업데이트 안내 팝업(What's New) 모달 및 '더 이상 보지 않기' 영구 저장 마이너 업데이트"
Cohesion: 0.50
Nodes (4): 15.1 요구사항 및 배경 (Context & Requirement), 15. [2026-11-15] v2.7.1 업데이트 안내 팝업(What's New) 모달 및 '더 이상 보지 않기' 영구 저장 마이너 업데이트, 15.2 해결 아키텍처 및 구현 명세 (Architecture & Implementation), 15.3 검증 결과 (Verification Evidence)

## Knowledge Gaps
- **4 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `HaruMatchumApp` connect `HaruMatchumApp` to `test_v260_voice_and_concise_questions.js`, `9. 매번 랜덤한 출제 순서 보장 및 미풀이 문제 최우선 선별 엔진 고도화 (v2.5.3)`, `test_permutation_and_lazy_loading.js`, `3. 핵심 변경 상세 및 원인 분석 (RCA)`?**
  _High betweenness centrality (0.221) - this node is a cross-community bridge._
- **Should `HaruMatchumApp` be split into smaller, more focused modules?**
  _Cohesion score 0.054625984251968504 - nodes in this community are weakly interconnected._
- **Why does `📋 국어 맞춤법 및 한자 퀴즈 프로그램 '하루맞춤' 기술레포트 (Technical Report v2.0)` connect `📋 국어 맞춤법 및 한자 퀴즈 프로그램 '하루맞춤' 기술레포트 (Technical Report v2.0)` to `3. 핵심 변경 상세 및 원인 분석 (RCA)`, `EnglishSpeechEngine`, `9. 매번 랜덤한 출제 순서 보장 및 미풀이 문제 최우선 선별 엔진 고도화 (v2.5.3)`, `11. 모바일 구버전 자동 감지 및 스마트 백그라운드 자동 새로고침 엔진 탑재 (v2.6.0)`, `12. 속담 및 관용구 종결어미 중복 충돌 전면 해소 및 런타임 자가 치유 가드 탑재 (v2.6.1)`, `13. v2.6.2 사용자 제보 3대 버그 완전 해결 (방패 설명 오기, 선택지 중복 0건 전수 정규화, 관형사형 정답 정합성 교정)`, `14. [2026-11-15] v2.7.0 모바일 음성/TTS 언락, 문항 #4333 조사 정비, 랭킹 점수 정합성, 포인트 상점 & 22종 아바타 악세사리 꾸미기 및 고해상도 확대 갤러리 구축`, `5. 20,000문항 대규모 확장 및 경량화 최적화 아키텍처 (v2.5.0)`, `7. 20,000문항 문맥 연관성 및 의미적 추론성 전면 고도화 (v2.5.1)`, `8. 종결어미 충돌 해소, 레벨별 발문 차등화 및 방패 의사결정 시스템 고도화 (v2.5.2)`, `⏱️ 단계별 제작 및 고도화 타임라인`, `15. [2026-11-15] v2.7.1 업데이트 안내 팝업(What's New) 모달 및 '더 이상 보지 않기' 영구 저장 마이너 업데이트`?**
  _High betweenness centrality (0.105) - this node is a cross-community bridge._
- **Should `build_english_bank.py` be split into smaller, more focused modules?**
  _Cohesion score 0.06561085972850679 - nodes in this community are weakly interconnected._
- **Why does `EnglishSpeechEngine` connect `EnglishSpeechEngine` to `HaruMatchumApp`, `test_v260_voice_and_concise_questions.js`, `3. 핵심 변경 상세 및 원인 분석 (RCA)`, `14. [2026-11-15] v2.7.0 모바일 음성/TTS 언락, 문항 #4333 조사 정비, 랭킹 점수 정합성, 포인트 상점 & 22종 아바타 악세사리 꾸미기 및 고해상도 확대 갤러리 구축`?**
  _High betweenness centrality (0.076) - this node is a cross-community bridge._
- **Should `server.js` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._
- **Should `📜 하루맞춤 (Haru Matchum) 개발 히스토리 및 변경 로그 (Changelog)` be split into smaller, more focused modules?**
  _Cohesion score 0.1 - nodes in this community are weakly interconnected._
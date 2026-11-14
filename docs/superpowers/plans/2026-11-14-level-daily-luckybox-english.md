# Implementation Plan: Level-Based Daily Quiz, Surprise Lucky Box, and English Subject Expansion

- **Goal**:
  1. Add '오늘의 레벨별 맞춤법 5제' with 5 difficulty levels (초등, 중등, 고등, 수능, 일반).
  2. Add Surprise Lucky Box bonus popup during quizzes with random in-game item rewards.
  3. Expand to English subject (`ENGLISH_QUESTION_BANK`) with spelling/vocabulary quizzes, theme, and independent rankings.
- **Target Repository**: `mkotinet/Spelling`
- **Target Domain**: `haru.danminlove.com`

---

## Architecture & Components

### 1. Backend (`server.js`)
- **User Schema**: Add `maxRoundEnglish: 1`, `todayScoreEnglish: 0`, `pointsEnglish: 0` to user profile defaults.
- **REST APIs**:
  - `/api/leaderboard`: Support `mode=english` with sorting by `maxRoundEnglish`, `todayScoreEnglish`, `pointsEnglish`.
  - `/api/user/sync`: Allow syncing English metrics.

### 2. English Question Bank (`english_questions.js`)
- Comprehensive question bank of confusing English spellings & vocabulary.
- Categorized into 5 levels: `초등/기초`, `중등/기본`, `고등/실전`, `수능/빈출`, `일반/상식`.
- Full schema: `id`, `category`, `level`, `question`, `sentence`, `options`, `answerIndex`, `englishWord`, `phonetic`, `meaning`, `explanation`, `exampleSentence`, `dictLink`.

### 3. Level-Based Quiz Mode (`questions.js`, `hanja_questions.js`, `app.js`, `index.html`)
- Enrich existing question banks with `수능` and `일반` tags.
- Home screen: Add card `#btnStartLevelDaily` titled **"오늘의 레벨별 맞춤법 5제"**.
- Level Select Modal `#modalLevelSelect`: 5 choices (`초등문제`, `중등문제`, `고등문제`, `수능문제`, `일반문제`).
- Filter question bank by selected level to generate 5-question set.

### 4. Surprise Lucky Box Item Drop (`app.js`, `index.html`, `style.css`)
- In `handleOptionSelect`: When answer is correct, roll probability (25~30% chance or on streak) to trigger `#modalLuckyBox`.
- Animated gift box (`🎁`) popup.
- Clicking "상자 열기" gives 1 random item from the 8-item pool (`50:50 요술봉`, `하트 수호`, `2배 로켓`, `돋보기 힌트`, `행운 클로버`, `타임머신`, `콤보 자석`, `수호 방패`).
- Increment item inventory, save to `localStorage`, trigger fanfare & confetti.

### 5. UI & Theme Expansion (`index.html`, `style.css`)
- Add `[ 🔤 영어 어휘·스펠링 ]` to `#btnModeEnglish` in header switcher.
- Add `body.theme-english` with stylish royal indigo palette.
- English explanation card `#expEnglishArea` in quiz results.
- Add `[ 🔤 영어 단어 ]` tab to leaderboard.

### 6. Testing & Deployment
- `tests/test_english_mode.js`: Validate English bank, REST API, level filtering.
- `tests/test_lucky_box.js`: Validate lucky box trigger and item distribution.
- `tests/test_level_quiz.js`: Validate 5-level filtering.
- Update `기술레포트.md` and `제작히스토리.md`.
- Git commit & push, and Synology Portainer container restart.

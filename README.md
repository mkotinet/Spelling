# ✨ 하루맞춤 (Haru Matchum)

> **매일 5분! 초·중·고등학생을 위한 반짝이는 국어 맞춤법 데일리 퀴즈 & 랭킹 챌린지 웹 애플리케이션**

[![GitHub Pages](https://img.shields.io/badge/GitHub%20Pages-Live%20Demo-ff69b4?style=for-the-badge&logo=github)](https://mkotinet.github.io/Spelling/)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 🌸 서비스 소개

**하루맞춤(Haru Matchum)**은 일상과 시험에서 가장 자주 헷갈리는 한국어 맞춤법을 매일 5문제씩 재미있는 퀴즈로 풀고, 출석 도장을 모으며 친구들과 랭킹을 겨루는 하이틴 감성의 웹 애플리케이션입니다.

- **웹 주소(GitHub Pages)**: [https://mkotinet.github.io/Spelling/](https://mkotinet.github.io/Spelling/)
- **공식 저장소**: [mkotinet/Spelling](https://github.com/mkotinet/Spelling)

---

## 🎀 주요 특징 및 기능

### 1. 🏛️ 국립국어원 표준국어대사전 & 한글 맞춤법 규정 기반
- 국립국어원 표준국어대사전 표제어 및 한글 맞춤법 제1항~제57항 규정을 충실히 반영한 **엄선 60제 문제은행** 기본 탑재.
- 정답/오답 확인 시 국립국어원 규정(사이시옷, 준말, 두음법칙 등) 상세 해설 제공.
- 표준국어대사전 실시간 사전 단어 조회 및 오픈 API 인증키 연동 지원.

### 2. 📅 매일매일 새로운 데일리 퀴즈 & 출석 다이어리
- 날짜 시드(Date Seed) 알고리즘으로 매일 자동으로 변경되는 **오늘의 맞춤법 5제**.
- 연속 출석일수(Streak)를 기록하고, 요일별로 벚꽃/연필 도장이 찍히는 **출석 다이어리**.

### 3. 🍓 초·중·고등학생 여학생 취향 저격 하이틴 파스텔 디자인
- 부드러운 핑크, 라벤더, 스카이블루 그러데이션과 아기자기한 이모지 스티커.
- 귀여운 마스코트 토끼 **'맞춤이'**가 사용자를 응원하는 반응형 말풍선.
- 브라우저 Web Audio API 기반의 무지연 고음질 차임벨/효과음 및 축하 컨페티(꽃가루) 애니메이션.

### 4. 👑 아이디 생성 및 실시간 회원 랭킹 시스템
- 나만의 닉네임, 학년(초·중·고), 아바타(🐰, 🌸, 🍒, 🐱 등) 프로필 생성 및 자유로운 변경.
- **오늘의 랭킹(일간)** 및 **누적 명예의 전당**을 통해 또래 친구들과 선의의 경쟁.
- 5연속 정답 시 발동하는 콤보 부스터 보너스 점수 시스템.

### 5. 🎯 무한 연습 & 오답노트 복습
- 언제든 자유롭게 5문제씩 풀어볼 수 있는 **무한 연습 모드**.
- 헷갈려서 틀렸던 문제만 자동으로 저장되어 다시 풀어볼 수 있는 **오답노트 복습 모드**.

### 6. 🎀 6종 스티커 뱃지 컬렉션
- '첫 발걸음', '3일 연속 열공', '일주일 완주왕', '퍼펙트 만점러', '콤보 마스터', '사전 탐험가' 뱃지 획득 가능.

---

## 💻 기술 스택

- **Frontend**: Semantic HTML5, Modern CSS3 (CSS Variables, Flexbox, CSS Grid, Glassmorphism), Vanilla JavaScript (ES6+)
- **Audio Engine**: Web Audio API (합성 오실레이터 기반 사운드 재생, 외부 mp3 파일 없이 즉시 로드)
- **Visual FX**: HTML5 2D Canvas 기반 Confetti(꽃가루 폭죽) 파티클 시스템
- **Persistence**: Browser `localStorage` (무설치, 무서버 영구 보관)
- **Deployment**: GitHub Pages (정적 웹 호스팅)

---

## 🚀 빠른 시작 (로컬 실행)

별도의 패키지 설치나 빌드 과정 없이 웹 브라우저에서 바로 실행할 수 있습니다.

```bash
# 1. 저장소 복제
git clone https://github.com/mkotinet/Spelling.git

# 2. 디렉토리 이동
cd Spelling

# 3. 브라우저로 index.html 열기 (macOS)
open index.html

# 또는 파이썬 간단 서버 실행
python3 -m http.server 8080
# 브라우저에서 http://localhost:8080 접속
```

---

## 🌐 GitHub Pages 활성화 방법

GitHub 저장소에서 웹 서비스를 활성화하는 단계입니다:
1. 저장소 상단의 **Settings** 메뉴로 이동합니다.
2. 좌측 메뉴에서 **Pages**를 클릭합니다.
3. **Build and deployment > Branch** 항목에서 `main` 브랜치 및 `/ (root)` 폴더를 선택하고 **Save**를 누릅니다.
4. 약 1분 후 `https://mkotinet.github.io/Spelling/` 주소로 사이트가 배포됩니다.

---

## 📄 기술 문서
- [기술 보고서 (TECH_REPORT.md)](./TECH_REPORT.md)
- [개발 히스토리 및 변경 로그 (HISTORY.md)](./HISTORY.md)

# ✨ 하루맞춤 (Haru Matchum) v2.0

> **매일 5분! 초·중·고등학생과 우리말을 사랑하는 모두를 위한 반짝이는 국어 맞춤법 & 한자 퀴즈 챌린지 웹 애플리케이션**

[![Service URL](https://img.shields.io/badge/Service-haru.danminlove.com-2ec4b6?style=for-the-badge&logo=cloudflare)](https://haru.danminlove.com)
[![GitHub](https://img.shields.io/badge/GitHub-Spelling-ff69b4?style=for-the-badge&logo=github)](https://github.com/mkotinet/Spelling)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 🌸 서비스 소개

**하루맞춤(Haru Matchum)**은 일상과 시험에서 가장 자주 헷갈리는 한국어 맞춤법과 필수 한자·고사성어를 재미있는 퀴즈로 풀고, 출석 도장과 포인트를 모으며 친구들과 랭킹을 겨루는 하이틴 감성의 웹 애플리케이션입니다.

- **공식 서비스 도메인**: [https://haru.danminlove.com](https://haru.danminlove.com)
- **공식 저장소**: [mkotinet/Spelling](https://github.com/mkotinet/Spelling)
- **기술문서**: [기술레포트.md](기술레포트.md) | [제작히스토리.md](제작히스토리.md)

---

## 🎀 v2.0 주요 특징 및 기능

### 1. 📜 한자(漢字) 및 고사성어 퀴즈 신규 모드
- 메인 화면 상단 원클릭 전환 탭: `[🌸 우리말 맞춤법]` ⇄ `[📜 한자·고사성어]`
- 사자성어, 동음이의 한자어(결제/결재, 개발/계발 등), 필수 한자 32제 전용 문제은행.
- 개별 한자의 **음과 훈(音訓), 단어 용례(Usage), 실생활 예문(Examples)** 제공.
- 국립국어원 표준국어대사전 및 **네이버 한자사전 딥링크(1클릭 검색)** 연동.

### 2. 🔥 5문제 만점 시 무한 연속 라운드 시스템
- 기본 5문제를 모두 맞히면(5/5) 결과 화면에 **"🎉 100점 만점 통과! 다음 라운드(새 5문제) 도전하기 🔥"** 버튼 활성화!
- 라운드를 돌파할 때마다 보너스 포인트(+50P) 및 랭킹 카드에 `🔥 N라운드 돌파` 뱃지 갱신.

### 3. 👑 실제 활동 유저 기반 클린 실시간 랭킹
- 기존 시뮬레이션 더미 피어 계정(`체리블라썸`, `토끼마카롱` 등)을 전면 제거.
- 시놀로지 NAS 서버 DB에 등록된 실제 회원들만 실시간 집계되어 공정한 명예의 전당 운영.

### 4. 🔒 서버 접속 및 이용 이력 감사 로깅 (Security Audit)
- 로그인 성공/실패, 회원가입, 라운드 클리어 시각(KST), 접속 IP, User-Agent 서버(`data/access_logs.json`) 안전 기록.
- 프로필 모달 내 **"📋 내 최근 접속/이용 이력"** 조회 제공.
- 대표 관리자(`단민러브`) 계정 전용 **"👑 전체 회원 접속 감사 로그"** 뷰어 제공.

### 5. 🏛️ 국립국어원 표준국어대사전 규정 준수
- 한글 맞춤법 제1항~제57항 규정을 충실히 반영한 60제 맞춤법 문제은행 및 상세 해설.

---

## 💻 기술 스택

- **Backend**: Node.js v20 (Alpine Linux Docker 컨테이너), 순수 내장 모듈(`http`, `fs`, `crypto`)
- **Frontend**: Semantic HTML5, Modern CSS3 (Variables, Glassmorphism, Theme Switching), Vanilla JavaScript (ES6+)
- **Audio & FX**: Web Audio API (합성 오실레이터 사운드), HTML5 2D Canvas Confetti 파티클
- **Infrastructure**: Synology NAS Portainer, Nginx Proxy Manager (NPM, SSL 443), Cloudflare DNS
- **Version Control**: Git / GitHub 양방향 자동 동기화 (`mkotinet/Spelling`)

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

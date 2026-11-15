# ✨ 하루맞춤 (Haru Matchum) v3.0

> **매일 5분! 초·중·고등학생과 우리말을 사랑하는 모두를 위한 반짝이는 국어 맞춤법 & 한자 퀴즈 챌린지 - iOS / Android / Web 하이브리드 앱**

[![Service URL](https://img.shields.io/badge/Service-haru.danminlove.com-2ec4b6?style=for-the-badge&logo=cloudflare)](https://haru.danminlove.com)
[![GitHub](https://img.shields.io/badge/GitHub-spelling__app-ff69b4?style=for-the-badge&logo=github)](https://github.com/mkotinet/spelling_app)
[![Platforms](https://img.shields.io/badge/Platforms-iOS%20%7C%20Android%20%7C%20Web-blue?style=for-the-badge)](MOBILE_BUILD_GUIDE.md)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](LICENSE)

---

## 🌸 서비스 소개

**하루맞춤(Haru Matchum)**은 일상과 시험에서 가장 자주 헷갈리는 한국어 맞춤법과 필수 한자·고사성어, 속담, 영어를 재미있는 퀴즈로 풀고, 출석 도장과 포인트를 모으며 친구들과 랭킹을 겨루는 하이틴 감성의 유니버설 애플리케이션입니다.

- **공식 서비스 도메인**: [https://haru.danminlove.com](https://haru.danminlove.com)
- **공식 GitHub 저장소**: [mkotinet/spelling_app](https://github.com/mkotinet/spelling_app)
- **모바일 빌드 가이드**: [MOBILE_BUILD_GUIDE.md](MOBILE_BUILD_GUIDE.md)
- **기술문서**: [기술레포트.md](기술레포트.md) | [제작히스토리.md](제작히스토리.md)

---

## 📱 v3.0 주요 특징 (iOS & Android Universal Mobile Edition)

### 1. 🍎 아이폰(iOS) & 🤖 안드로이드(Android) 하이브리드 앱 공식 지원
- **HTML 웹과 100% 동일한 기능 & 동일 로그인 계정 연동**:
  - 모바일 네이티브 환경(Capacitor 6+)과 웹 브라우저가 동일한 백엔드 REST API(`https://haru.danminlove.com`)를 완벽히 공유.
  - 웹에서 가입/이용하던 실제 회원 계정(`users.json`), 포인트, 스트릭, 인벤토리, 친구 메시지가 모바일 앱에서도 즉시 100% 동일하게 연동됩니다.

### 2. 🛡️ 사전 검증된 모바일 설치 및 런타임 보안 무결성
- **iOS 설치 차단 및 권한 누락 크래시 원천 방지**:
  - `NSAppTransportSecurity` 구성을 통해 웹뷰 및 API 연결 보장.
  - 사진 첨부 관련 필수 권한 설명(`NSPhotoLibraryUsageDescription`, `NSCameraUsageDescription`)을 정중한 한글 사유로 사전 탑재하여 iOS 권한 호출 즉시 강제 종료(Crash)되는 결함을 사전에 완전 해결.
  - `WKAllowsInlineMediaPlayback = true`로 퀴즈 효과음 무중단 인라인 재생.
- **Android 설치 거부 및 네트워크 차단 원천 방지**:
  - 미서명 APK 설치 오류(`INSTALL_PARSE_FAILED_NO_CERTIFICATES`)를 방지하기 위해 릴리즈 Keystore 및 자동 서명 빌드 스크립트(`scripts/build_signed_apk.sh`) 탑재.
  - `network_security_config.xml` 및 `android:usesCleartextTraffic="true"`로 Android 9+ Cleartext 및 SSL 차단 원천 예방.

### 3. 🎨 모바일 최적화 Safe Area & 반응형 디자인
- iPhone 상단 노치 / 다이내믹 아일랜드 및 하단 홈 바 영역을 위한 `viewport-fit=cover` 및 `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)` 스타일 완벽 적용.

### 4. 📚 4대 과목 20,000문항 및 1:1 실시간 응원 메시징
- **4대 과목**: 우리말 맞춤법(5,000제), 한자·고사성어(5,000제), 속담·관용구(5,000제), 영단어·회화(5,000제).
- 한국어 문장 검사 엔진(`korean_grammar_validator.js`)을 통한 20,000문항 비문 0건 달성.
- 다중 친구 동시 응원 메시지 및 사진 첨부, 24시간 자동 만료 엔진.

---

## 🛠️ 모바일 앱 빌드 및 빠른 시작

```bash
# 1. 의존성 설치
npm install

# 2. 웹 자산 동기화
npm run mobile:sync

# 3. iOS Xcode 프로젝트 열기
npm run mobile:open:ios

# 4. Android Studio 프로젝트 열기 또는 서명된 APK 빌드
npm run mobile:build:apk
```

자세한 빌드 및 설치 방법은 [모바일 빌드 가이드 (MOBILE_BUILD_GUIDE.md)](MOBILE_BUILD_GUIDE.md)를 참고해 주세요.

---

## 📄 기술 문서
- [기술 보고서 (기술레포트.md)](기술레포트.md)
- [개발 히스토리 및 변경 로그 (제작히스토리.md)](제작히스토리.md)
- [모바일 빌드 & 설치 가이드 (MOBILE_BUILD_GUIDE.md)](MOBILE_BUILD_GUIDE.md)

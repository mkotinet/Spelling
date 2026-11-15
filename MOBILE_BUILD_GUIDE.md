# 📱 하루맞춤(Haru Matchum) 모바일 앱(iOS & Android) 빌드 및 설치 완벽 가이드

본 문서는 **국어 맞춤법 및 한자 퀴즈 '하루맞춤'**의 모바일 하이브리드 앱(iOS / Android)을 구축, 빌드하고 실제 스마트폰에 설치하는 전 과정을 안내합니다.

---

## 🎯 1. 핵심 아키텍처 및 보장 원칙

1. **HTML 웹과 100% 동일한 기능 & 동일 로그인 계정 연동**:
   - 모바일 네이티브 앱(iOS WKWebView / Android WebView)과 웹 브라우저(`https://haru.danminlove.com`)가 동일한 Node.js 백엔드 API를 실시간 공유합니다.
   - 투명 API 브릿지(`getApiUrl`)가 모바일 환경을 자동 감지하여 원격 실서버와 안전하게 통신하므로, **웹에서 가입한 아이디와 비밀번호, 포인트, 뱃지, 출석 스트릭, 친구 메시지가 모바일 앱에서도 실시간 100% 동일하게 연동**됩니다.
2. **사전 검증된 보안 무결성 (설치 차단 및 런타임 크래시 원천 방지)**:
   - iOS의 App Transport Security(ATS), 필수 권한 목적 설명문구(`*UsageDescription`) 누락 크래시를 사전 방지했습니다.
   - Android의 평문 트래픽(Cleartext Traffic) 차단, 미서명 APK 설치 오류(`INSTALL_PARSE_FAILED_NO_CERTIFICATES`), Google Play Protect 경고 문제를 Keystore 자동 서명 및 `network_security_config.xml`로 사전 해결했습니다.

---

## 🛠️ 2. 사전 준비 및 프로젝트 구성

프로젝트 루트(`/Users/kotinet/Documents/spelling_app`)에서 다음 명령어를 통해 정적 자산을 동기화합니다:

```bash
# 1. 의존성 설치 (최초 1회)
npm install

# 2. 웹 자산 최신화 및 iOS/Android 플랫폼 동기화
npm run mobile:sync
```

---

## 🍎 3. 아이폰 (iOS) 빌드 및 설치 가이드

### 3.1 사전 해결된 iOS 보안 문제
* **App Transport Security (ATS) 차단 방지**:
  - `haru.danminlove.com` 및 `danminlove.com` 도메인에 대한 안전한 HTTPS 통신 및 웹뷰 내부 자원 로드를 허용하도록 `Info.plist` 내 `NSAppTransportSecurity` 구성을 완료했습니다.
* **권한 누락으로 인한 앱 강제 크래시(Crash) 방지**:
  - iOS는 사진 첨부 기능 호출 시 `Info.plist`에 권한 사유가 없으면 앱을 즉시 강제 종료(SIGABRT)합니다. 이를 방지하기 위해 다음 항목을 한글로 정중히 사전 탑재했습니다:
    - `NSPhotoLibraryUsageDescription`: "친구들에게 응원 메시지를 보낼 때 사진을 첨부하기 위해 사진 보관함 접근 권한이 필요합니다."
    - `NSCameraUsageDescription`: "친구들에게 보낼 응원 사진을 직접 촬영하여 첨부하기 위해 카메라 접근 권한이 필요합니다."
    - `NSPhotoLibraryAddUsageDescription`: "퀴즈 만점 인증서 및 결과 카드를 사진 보관함에 저장하기 위해 권한이 필요합니다."
* **Web Audio 인라인 재생**:
  - `WKAllowsInlineMediaPlayback = true` 설정을 적용하여 퀴즈 정답/오답 효과음이 끊김 없이 재생됩니다.
* **아이폰 노치 및 다이내믹 아일랜드 대응**:
  - `viewport-fit=cover` 및 `env(safe-area-inset-top)`, `env(safe-area-inset-bottom)`을 적용하여 상/하단 시스템 영역과 겹치지 않습니다.

### 3.2 내 아이폰에 무료로 직접 설치하는 방법 (Sideloading)
1. **Xcode 프로젝트 열기**:
   ```bash
   npm run mobile:open:ios
   # 또는 open ios/App/App.xcworkspace
   ```
2. **Apple ID 서명 설정 (Signing & Capabilities)**:
   - Xcode 좌측 네비게이터에서 맨 위 **App** 프로젝트 선택 ➔ **Signing & Capabilities** 탭 클릭.
   - **Automatically manage signing** 체크.
   - **Team** 드롭다운에서 본인의 무료 Apple ID 계정(Personal Team) 선택.
   - *(Bundle Identifier: `com.danminlove.haru`)*
3. **아이폰 연결 및 설치**:
   - 케이블(또는 동일 Wi-Fi 무선 연결)로 아이폰을 맥북에 연결.
   - Xcode 상단 실행 기기 목록에서 본인의 아이폰 선택 ➔ **▶ (Run / Cmd+R)** 버튼 클릭.
   - 빌드가 완료되면 아이폰 홈 화면에 **'하루맞춤'** 앱이 자동 설치 및 실행됩니다.
4. **아이폰 신뢰 설정 (최초 1회)**:
   - 아이폰 **설정 ➔ 일반 ➔ VPN 및 기기 관리**로 이동.
   - 본인의 Apple ID 개발자 앱 항목을 터치하고 **'신뢰함'**을 승인하면 즉시 정상 실행됩니다.

---

## 🤖 4. 안드로이드 (Android) 빌드 및 설치 가이드

### 4.1 사전 해결된 Android 보안 문제
* **미서명 APK 설치 오류 원천 해결 (`INSTALL_PARSE_FAILED_NO_CERTIFICATES`)**:
  - Android OS는 서명되지 않은 APK의 설치를 거부합니다.
  - 전용 릴리즈 서명 Keystore(`android/app/release-key.jks`) 및 자동 생성/서명 스크립트를 구현하여 **v1 + v2 듀얼 서명된 완제품 APK**를 생성합니다.
* **Cleartext Traffic 차단 및 SSL 보안 정책 해결**:
  - Android 9(Pie) 이상에서 발생하는 네트워크 차단을 방지하기 위해 `android:usesCleartextTraffic="true"` 및 `network_security_config.xml`을 구성하여 원격 API 및 도메인을 공식 신뢰하도록 설정했습니다.
* **최신 Android 13/14+ 권한 완벽 호환**:
  - 사진 접근 권한을 버전별로 분기하여 `READ_MEDIA_IMAGES`(Android 13+)와 `READ_EXTERNAL_STORAGE`(Android 12 이하)를 동시 지원합니다.
  - 네트워크 상태 감지(`ACCESS_NETWORK_STATE`) 및 햅틱 진동(`VIBRATE`) 권한을 포함했습니다.

### 4.2 원클릭 서명 APK 빌드 및 스마트폰 설치
1. **서명된 정규 릴리즈 APK 원클릭 생성**:
   ```bash
   npm run mobile:build:apk
   ```
   - 스크립트가 실행되면 Keystore 검증, 웹 자산 동기화, Gradle 릴리즈 서명 빌드가 전자동 수행됩니다.
   - 생성 완료 파일:
     `android/app/build/outputs/apk/release/app-release.apk`
2. **Android Studio에서 열기 (선택 사항)**:
   ```bash
   npm run mobile:open:android
   ```
3. **스마트폰에 직접 설치하는 방법**:
   - **방법 A (카카오톡/이메일/클라우드 전송)**:
     생성된 `app-release.apk` 파일을 스마트폰으로 전송 후 터치하여 설치.
     *(Play Protect 경고 팝업 발생 시 "세부정보 보기 ➔ 무시하고 설치" 선택)*
   - **방법 B (USB 연결 및 adb 설치)**:
     ```bash
     adb install android/app/build/outputs/apk/release/app-release.apk
     ```

---

## ⚡ 5. 자주 쓰는 핵심 명령어 모음

| 명령어 | 설명 |
| :--- | :--- |
| `npm run start` | 로컬 개발 서버 실행 (`localhost:8089`) |
| `npm test` | 마스터 E2E 34개 테스트 및 시스템 무결성 전수 검증 |
| `npm run mobile:prepare` | 웹 정적 자산을 `www/` 폴더로 빌드/동기화 |
| `npm run mobile:sync` | 웹 자산 동기화 후 iOS 및 Android 네이티브 프로젝트에 즉시 반영 |
| `npm run mobile:open:ios` | iOS Xcode 프로젝트를 열고 실행 준비 |
| `npm run mobile:open:android`| Android Studio 프로젝트를 열고 실행 준비 |
| `npm run mobile:build:apk` | 서명된 정규 릴리즈 Android APK 빌드 |

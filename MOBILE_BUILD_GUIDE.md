# 📱 하루맞춤(Haru Matchum) 모바일 앱(iOS & Android) 바이너리 릴리즈 & 설치 완벽 가이드

본 문서는 **국어 맞춤법 및 한자 퀴즈 '하루맞춤'**의 아이폰(`.ipa`) 및 안드로이드(`.apk`) 정식 설치 바이너리 다운로드 및 스마트폰 설치 전 과정을 안내합니다.

---

## 🎯 1. 릴리즈 바이너리 직접 다운로드 (GitHub Releases v3.1.0)

GitHub 공식 Releases 페이지에서 미리 빌드된 완제품 설치 파일을 즉시 다운로드할 수 있습니다:

* 🌟 **공식 릴리즈 다운로드**: [https://github.com/mkotinet/spell_app/releases/tag/v3.1.0](https://github.com/mkotinet/spell_app/releases/tag/v3.1.0)
* 🤖 **안드로이드 설치 파일**: [`HaruMatchum-v3.1.0-release.apk`](https://github.com/mkotinet/spell_app/releases/download/v3.1.0/HaruMatchum-v3.1.0-release.apk) (6.30 MB, 정식 AXML 컴파일 및 v2/v3 전자서명 완료)
* 🍎 **아이폰 설치 파일**: [`HaruMatchum-v3.1.0.ipa`](https://github.com/mkotinet/spell_app/releases/download/v3.1.0/HaruMatchum-v3.1.0.ipa) (3.23 MB, 64-bit arm64 Mach-O & Web Bundle)

---

## 🤖 2. 안드로이드(.apk) 스마트폰 설치 방법 ('패키지 파싱 오류' 완벽 해결)

> [!NOTE]
> 최신 Android OS(Android 11 ~ 15)에서 텍스트 기반 Manifest로 인해 발생하던 **"패키지를 파싱하는 데 문제가 발생했습니다"** 오류를 근본 해결하였습니다. Android SDK `aapt2`를 통해 이진 AXML 매직 넘버(`0x00080003`)로 정식 컴파일하고, `zipalign` 4바이트 정렬 및 `apksigner` APK Signature Scheme v2 & v3 서명을 완료하여 모든 안드로이드 폰에서 오류 없이 즉시 설치됩니다.

1. **APK 파일 다운로드**:
   - 스마트폰 브라우저에서 [`HaruMatchum-v3.1.0-release.apk`](https://github.com/mkotinet/spell_app/releases/download/v3.1.0/HaruMatchum-v3.1.0-release.apk) 링크를 터치하여 다운로드합니다.
2. **설치 실행**:
   - 스마트폰의 **'내 파일'** 앱(또는 다운로드 완료 알림창)에서 다운로드된 `.apk` 파일을 터치합니다.
   - "보안상의 이유로 이 출처의 알 수 없는 앱을 설치할 수 없습니다"라는 안내가 뜨면 **[설정] ➔ [이 출처의 앱 허용]**을 켭니다.
   - Google Play 프로텍트 팝업 시 **"세부정보 보기 ➔ 무시하고 설치"**를 터치합니다.
3. **실행 및 로그인**:
   - 홈 화면의 **'하루맞춤'** 아이콘을 터치하여 실행합니다.
   - 기존 웹 서비스([haru.danminlove.com](https://haru.danminlove.com))의 아이디와 비밀번호로 로그인하면 20,000문항, 포인트, 출석 스트릭, 상점 아이템, 랭킹이 100% 실시간 연동됩니다.

---

## 🍎 3. 아이폰(.ipa) 및 iOS 즉시 설치 방법 (추천 순위별 3대 솔루션)

Apple의 iOS 보안 정책(App Store 외부 다운로드 제약)상, 일반 웹 브라우저에서 `.ipa`를 다운로드하여 직접 탭하는 방식은 지원되지 않습니다. 따라서 아래 **3가지 실체적 솔루션** 중 가장 편한 방법을 선택하여 바로 설치 및 이용할 수 있습니다.

### 🌟 [방법 1] PC 없이 10초 만에 홈 화면 네이티브 앱 추가 (가장 추천! 0초 설치)
'하루맞춤'은 웹 표준 PWA(Progressive Web App)를 완벽 지원하므로, 인증서 만료나 복잡한 PC 연결 없이 **iPhone Safari에서 원터치로 풀스크린 네이티브 앱**을 설치할 수 있습니다.

1. 아이폰 Safari 브라우저에서 **`https://haru.danminlove.com`** 접속.
2. 하단 중앙의 **[공유] 아이콘** (네모 상자 위로 화살표 모양 ⎋) 터치.
3. 메뉴를 아래로 스크롤하여 **[홈 화면에 추가]** (+ 모양) 선택.
4. 우측 상단의 **[추가]** 터치.
5. **결과**:
   - 아이폰 홈 화면에 '하루맞춤' 고해상도 앱 아이콘이 생성됩니다.
   - 실행 시 Safari 주소창이나 하단 툴바 없이 **100% 전체화면 네이티브 독립 앱(Standalone)**으로 구동됩니다.
   - 백엔드 4인 회원 계정, KST 출석체크, 진동 피드백, 20,000문항 오프라인 캐시가 완벽하게 동작합니다.

---

### 💻 [방법 2] Sideloadly 이용 (PC/Mac 연결 1분 설치 - IPA 직접 설치)
다운로드받은 `HaruMatchum-v3.1.0.ipa` 바이너리를 실제 아이폰 네이티브 앱으로 기기에 직접 주입하는 가장 안전하고 쉬운 방법입니다.

1. PC 또는 Mac에서 무료 프로그램 **[Sideloadly](https://sideloadly.io/)** 다운로드 및 실행.
2. 아이폰을 라이트닝/C타입 케이블로 컴퓨터에 연결 (아이폰 화면에서 "이 컴퓨터를 신뢰" 승인).
3. GitHub Releases에서 다운로드한 **`HaruMatchum-v3.1.0.ipa`**를 Sideloadly 창 안으로 드래그 앤 드롭.
4. 본인의 무료 **Apple ID(이메일)**를 입력하고 **[Start]** 버튼 클릭.
5. 30초~1분 후 아이폰 홈 화면에 '하루맞춤' 앱이 자동 설치됩니다!
6. **최초 1회 실행 승인**:
   - 아이폰 **[설정] ➔ [일반] ➔ [VPN 및 기기 관리]** 이동.
   - [개발자 앱] 항목의 본인 Apple ID를 탭한 후 **[신뢰함]**을 승인하면 즉시 실행됩니다.

---

### 📲 [방법 3] Scarlet / TrollStore 이용 (PC 없이 아이폰 단독 IPA 설치)
* **Scarlet (무PC 사이드로딩)**:
  1. 아이폰 Safari에서 [usescarlet.com](https://usescarlet.com) 접속 후 'Install'을 눌러 Scarlet 앱 설치.
  2. 아이폰 **[설정] ➔ [일반] ➔ [VPN 및 기기 관리]**에서 Scarlet 인증서 신뢰 승인.
  3. Scarlet 앱을 열고 우측 상단 설치 아이콘 터치 ➔ 다운로드한 `HaruMatchum-v3.1.0.ipa` 선택 시 즉시 아이폰에 설치 완료!
* **TrollStore (iOS 14.0 ~ 16.6.1 및 17.0 지원 기기)**:
  - 파일 앱에서 `HaruMatchum-v3.1.0.ipa`를 길게 눌러 [공유] ➔ [TrollStore로 열기] 선택 시 서명 제한 없이 즉시 영구 설치.

---

## 🛠️ 4. 로컬에서 바이너리 직접 빌드 및 재생성

언제든지 소스코드를 수정한 후 아래 단 한 줄의 명령어로 최신 `.apk`와 `.ipa` 바이너리를 다시 생성할 수 있습니다:

```bash
cd /Users/kotinet/Documents/spelling_app

# 웹 자산 최신화 동기화
npm run mobile:sync

# .apk 및 .ipa 바이너리 원클릭 빌드 (releases/ 폴더에 생성)
npm run mobile:package
```

---

## 📄 기술 문서
- [기술 보고서 (기술레포트.md)](기술레포트.md)
- [개발 히스토리 및 변경 로그 (제작히스토리.md)](제작히스토리.md)

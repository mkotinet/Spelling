# 📱 하루맞춤(Haru Matchum) 모바일 앱(iOS & Android) 바이너리 릴리즈 & 설치 완벽 가이드

본 문서는 **국어 맞춤법 및 한자 퀴즈 '하루맞춤'**의 아이폰(`.ipa`) 및 안드로이드(`.apk`) 정식 설치 바이너리 다운로드 및 스마트폰 설치 전 과정을 안내합니다.

---

## 🎯 1. 릴리즈 바이너리 직접 다운로드 (GitHub Releases v3.1.0)

GitHub 공식 Releases 페이지에서 미리 빌드된 완제품 설치 파일을 즉시 다운로드할 수 있습니다:

* 🌟 **공식 릴리즈 다운로드**: [https://github.com/mkotinet/spell_app/releases/tag/v3.1.0](https://github.com/mkotinet/spell_app/releases/tag/v3.1.0)
* 🤖 **안드로이드 설치 파일**: [`HaruMatchum-v3.1.0-release.apk`](https://github.com/mkotinet/spell_app/releases/download/v3.1.0/HaruMatchum-v3.1.0-release.apk) (3.40 MB)
* 🍎 **아이폰 설치 파일**: [`HaruMatchum-v3.1.0.ipa`](https://github.com/mkotinet/spell_app/releases/download/v3.1.0/HaruMatchum-v3.1.0.ipa) (3.23 MB)

---

## 🤖 2. 안드로이드(.apk) 스마트폰 설치 방법

1. **APK 파일 다운로드 및 전송**:
   - 스마트폰 브라우저에서 직접 다운로드하거나, PC에서 다운로드 후 카카오톡/이메일/USB로 스마트폰에 전송합니다.
2. **설치 실행**:
   - 스마트폰의 **'내 파일'** 앱 또는 다운로드 알림창에서 `HaruMatchum-v3.1.0-release.apk`를 터치합니다.
   - **'이 출처의 앱 허용'** (설치 권한 승인)을 선택합니다.
   - Google Play Protect 팝업이 노출될 경우 **"세부정보 보기 ➔ 무시하고 설치"**를 터치합니다.
3. **실행 및 로그인**:
   - 설치 완료 후 홈 화면의 **'하루맞춤'** 아이콘을 터치하여 실행합니다.
   - 기존 웹 서비스([haru.danminlove.com](https://haru.danminlove.com))에서 사용하던 아이디와 비밀번호로 로그인하면 모든 포인트, 연속 스트릭, 랭킹이 100% 동일하게 연동됩니다.

---

## 🍎 3. 아이폰(.ipa) 설치 방법

1. **사이드로딩 도구(Sideloadly / AltStore / TrollStore)를 통한 설치**:
   - **Sideloadly 사용 시**:
     1. PC/Mac에서 [Sideloadly](https://sideloadly.io/) 실행.
     2. 아이폰을 케이블로 연결.
     3. `HaruMatchum-v3.1.0.ipa` 파일을 드래그하여 올리고, 본인의 Apple ID 입력 후 **Start** 클릭.
     4. 아이폰 홈 화면에 하루맞춤 앱이 자동 설치됩니다.
   - **TrollStore 사용 시**:
     - 파일 앱에서 `HaruMatchum-v3.1.0.ipa`를 공유하여 TrollStore로 열면 즉시 영구 설치됩니다.
2. **최초 1회 개발자 신뢰 승인**:
   - 아이폰 **설정 ➔ 일반 ➔ VPN 및 기기 관리**로 이동.
   - 본인의 Apple ID 계정을 터치하고 **'신뢰함'**을 승인하면 정상 실행됩니다.

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

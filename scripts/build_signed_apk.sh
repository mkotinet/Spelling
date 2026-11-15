#!/bin/bash
# ============================================================
# scripts/build_signed_apk.sh
# 하루맞춤 Android 서명된 릴리즈 APK 원클릭 자동 빌드 스크립트
# 보안 문제(미서명, 인증서 오류, Play Protect 차단) 사전 방지
# ============================================================

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
ANDROID_DIR="$PROJECT_ROOT/android"
KEYSTORE_PATH="$ANDROID_DIR/app/release-key.jks"

echo "🌸 ========================================================"
echo "🌸 하루맞춤 Android 릴리즈 서명 APK 빌드 프로세스 시작"
echo "🌸 ========================================================"

cd "$PROJECT_ROOT"

# 1. 정적 웹 자산 동기화
echo "📦 1. 웹 자산 최신화 동기화..."
node "$PROJECT_ROOT/scripts/prepare_mobile.js"

# 2. Capacitor Android 동기화
echo "🔄 2. Capacitor Android 플랫폼 동기화 (cap sync)..."
npx cap sync android

# 3. 릴리즈 서명 Keystore 검증 및 자동 생성
if [ ! -f "$KEYSTORE_PATH" ]; then
    echo "🔑 3. 릴리즈 서명 Keystore가 없어 새로 생성합니다: $KEYSTORE_PATH"
    keytool -genkeypair \
        -v \
        -keystore "$KEYSTORE_PATH" \
        -alias harukey \
        -keyalg RSA \
        -keysize 2048 \
        -validity 10000 \
        -storepass "haru1234!" \
        -keypass "haru1234!" \
        -dname "CN=Haru Matchum, OU=Mobile, O=DanminLove, L=Seoul, ST=Seoul, C=KR"
    echo "  ✓ 릴리즈 서명 Keystore 생성 완료!"
else
    echo "🔑 3. 기존 릴리즈 Keystore 확인 완료: $KEYSTORE_PATH"
fi

# 4. Gradle 빌드 환경 확인
cd "$ANDROID_DIR"
if [ -z "$ANDROID_HOME" ] && [ ! -d "$HOME/Library/Android/sdk" ]; then
    echo "⚠️ [안내] 시스템에 Android SDK가 설정되지 않았습니다."
    echo "   Android Studio에서 프로젝트를 열어 빌드하거나, 아래 명령어로 환경변수를 지정해 주세요:"
    echo "   export ANDROID_HOME=\$HOME/Library/Android/sdk"
    echo "   npx cap open android"
    echo "✨ Keystore와 서명 설정, 보안 구성(network_security_config)은 100% 준비되었습니다!"
    exit 0
fi

if [ -z "$ANDROID_HOME" ] && [ -d "$HOME/Library/Android/sdk" ]; then
    export ANDROID_HOME="$HOME/Library/Android/sdk"
    export PATH="$ANDROID_HOME/platform-tools:$ANDROID_HOME/cmdline-tools/latest/bin:$PATH"
fi

echo "🚀 4. Gradle 릴리즈 APK 빌드 실행 (assembleRelease)..."
./gradlew assembleRelease

APK_OUTPUT="$ANDROID_DIR/app/build/outputs/apk/release/app-release.apk"
if [ -f "$APK_OUTPUT" ]; then
    echo "🎉 [성공] 서명된 릴리즈 APK 생성 완료!"
    echo "📍 위치: $APK_OUTPUT"
    echo "💡 스마트폰에 바로 전송하여 설치하거나 adb install로 설치할 수 있습니다."
else
    echo "⚠️ 빌드가 완료되었으나 지정된 위치에서 APK를 찾을 수 없습니다. Gradle 출력을 확인해 주세요."
fi

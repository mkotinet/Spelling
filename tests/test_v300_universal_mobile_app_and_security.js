/**
 * tests/test_v300_universal_mobile_app_and_security.js
 * 하루맞춤 v3.0.0 하이브리드 모바일 앱(iOS/Android) 및 보안 검증 단위/통합 테스트
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

console.log('🧪 [Test v3.0.0] 하이브리드 모바일 앱 & 보안 무결성 검증 시작...');

// 1. Web & Mobile API Transparency Check (getApiUrl)
const appJs = fs.readFileSync(path.join(ROOT_DIR, 'app.js'), 'utf8');
assert(appJs.includes('HARU_PROD_API_BASE'), 'app.js must declare HARU_PROD_API_BASE');
assert(appJs.includes('function getApiUrl('), 'app.js must implement getApiUrl');
assert(appJs.includes('window.fetch = function'), 'app.js must provide transparent window.fetch wrapper for mobile API routing');
console.log('  ✓ 1. Web & Mobile 투명 API 라우팅 브릿지 검증 통과');

// 2. Android Security & Installation Pre-validation
const androidManifest = fs.readFileSync(path.join(ROOT_DIR, 'android/app/src/main/AndroidManifest.xml'), 'utf8');
assert(androidManifest.includes('android:usesCleartextTraffic="true"'), 'AndroidManifest must allow cleartext traffic for local dev');
assert(androidManifest.includes('android:networkSecurityConfig="@xml/network_security_config"'), 'AndroidManifest must specify networkSecurityConfig');
assert(androidManifest.includes('android.permission.INTERNET'), 'AndroidManifest must declare INTERNET');
assert(androidManifest.includes('android.permission.ACCESS_NETWORK_STATE'), 'AndroidManifest must declare ACCESS_NETWORK_STATE');
assert(androidManifest.includes('android.permission.VIBRATE'), 'AndroidManifest must declare VIBRATE');
assert(androidManifest.includes('android.permission.READ_MEDIA_IMAGES'), 'AndroidManifest must declare READ_MEDIA_IMAGES (Android 13+)');

const netSecXml = fs.readFileSync(path.join(ROOT_DIR, 'android/app/src/main/res/xml/network_security_config.xml'), 'utf8');
assert(netSecXml.includes('haru.danminlove.com'), 'network_security_config must trust haru.danminlove.com');
assert(netSecXml.includes('danminlove.com'), 'network_security_config must trust danminlove.com');
assert(netSecXml.includes('emojihub.yurace.pro'), 'network_security_config must trust emojihub.yurace.pro');

const buildGradle = fs.readFileSync(path.join(ROOT_DIR, 'android/app/build.gradle'), 'utf8');
assert(buildGradle.includes('signingConfigs'), 'build.gradle must configure signingConfigs for release APK');
console.log('  ✓ 2. Android 설치 보안 & 서명 구성 검증 통과 (Network Security, Cleartext, Permissions, Keystore Signing)');

// 3. iOS Security & Crash Prevention Check
const iosPlist = fs.readFileSync(path.join(ROOT_DIR, 'ios/App/App/Info.plist'), 'utf8');
assert(iosPlist.includes('NSAppTransportSecurity'), 'Info.plist must include NSAppTransportSecurity');
assert(iosPlist.includes('NSAllowsArbitraryLoadsInWebContent'), 'Info.plist must allow arbitrary loads in web content');
assert(iosPlist.includes('NSPhotoLibraryUsageDescription'), 'Info.plist must define NSPhotoLibraryUsageDescription (Crash Prevention)');
assert(iosPlist.includes('NSCameraUsageDescription'), 'Info.plist must define NSCameraUsageDescription (Crash Prevention)');
assert(iosPlist.includes('NSPhotoLibraryAddUsageDescription'), 'Info.plist must define NSPhotoLibraryAddUsageDescription');
assert(iosPlist.includes('WKAllowsInlineMediaPlayback'), 'Info.plist must permit inline media/audio playback');
console.log('  ✓ 3. iOS 설치 보안 & 권한 크래시 방지 검증 통과 (ATS, Privacy Usage Descriptions, Inline Audio)');

// 4. Safe Area UI & Viewport Check
const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
assert(indexHtml.includes('viewport-fit=cover'), 'index.html must include viewport-fit=cover for notch/dynamic island');

const styleCss = fs.readFileSync(path.join(ROOT_DIR, 'style.css'), 'utf8');
assert(styleCss.includes('env(safe-area-inset-top'), 'style.css must support safe-area-inset-top');
assert(styleCss.includes('env(safe-area-inset-bottom'), 'style.css must support safe-area-inset-bottom');
console.log('  ✓ 4. 모바일 UI 반응형 Safe Area & Viewport 최적화 검증 통과');

// 5. Capacitor Config & Build Automation Scripts
const capConfig = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'capacitor.config.json'), 'utf8'));
assert.strictEqual(capConfig.appId, 'com.danminlove.haru', 'appId must be com.danminlove.haru');
assert.strictEqual(capConfig.appName, '하루맞춤', 'appName must be 하루맞춤');
assert(fs.existsSync(path.join(ROOT_DIR, 'scripts/prepare_mobile.js')), 'prepare_mobile.js must exist');
assert(fs.existsSync(path.join(ROOT_DIR, 'scripts/build_signed_apk.sh')), 'build_signed_apk.sh must exist');
console.log('  ✓ 5. Capacitor 설정 및 빌드 자동화 스크립트 검증 통과');

// 6. Real DB User Integrity (Rule 6)
const usersData = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'data/users.json'), 'utf8'));
const usernames = Object.keys(usersData.users || {});
assert.strictEqual(usernames.length, 4, `Must have exactly 4 authentic users, found ${usernames.length}`);
['맞춤요정', '민지', '미니미니', '단민러브'].forEach(name => {
  assert(usersData.users[name], `Authentic user ${name} must be preserved`);
});
console.log('  ✓ 6. 실제 회원 4인 무결성 100% 보존 확인 통과 (Rule 6)');

console.log('🎉 [Test v3.0.0] ALL 6 Mobile & Security Test Suites PASSED Successfully!');

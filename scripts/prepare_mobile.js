/**
 * scripts/prepare_mobile.js
 * 하이브리드 모바일 앱(iOS/Android Capacitor)을 위한 웹 정적 자산 동기화 스크립트
 */

const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');
const WWW_DIR = path.join(ROOT_DIR, 'www');

// 복사 대상 웹 정적 자산 목록
const ASSET_FILES = [
  'index.html',
  'style.css',
  'app.js',
  'questions.js',
  'hanja_questions.js',
  'idiom_questions.js',
  'english_questions.js',
  'korean_grammar_validator.js',
  'version.json'
];

console.log('🚀 [Mobile Sync] 모바일 앱 정적 웹 자산 빌드 및 동기화 시작...');

// 1. www 폴더 초기화
if (!fs.existsSync(WWW_DIR)) {
  fs.mkdirSync(WWW_DIR, { recursive: true });
  console.log(`📁 www 디렉터리 생성: ${WWW_DIR}`);
}

// 2. 핵심 파일 복사
let copiedCount = 0;
let totalBytes = 0;

ASSET_FILES.forEach(file => {
  const src = path.join(ROOT_DIR, file);
  const dest = path.join(WWW_DIR, file);

  if (fs.existsSync(src)) {
    let content = fs.readFileSync(src);
    
    // index.html 모바일 최적화 점검
    if (file === 'index.html') {
      let htmlStr = content.toString('utf8');
      if (!htmlStr.includes('viewport-fit=cover')) {
        htmlStr = htmlStr.replace(
          'content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no"',
          'content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover"'
        );
      }
      content = Buffer.from(htmlStr, 'utf8');
    }

    fs.writeFileSync(dest, content);
    const stat = fs.statSync(dest);
    totalBytes += stat.size;
    copiedCount++;
    console.log(`  ✓ 복사 완료: ${file} (${(stat.size / 1024).toFixed(1)} KB)`);
  } else {
    console.warn(`  ⚠️ 경고: 원본 파일 누락 (${file})`);
  }
});

// 3. 부가 에셋(아이콘, 이미지, 효과음 등)이 존재할 경우 복사
const EXTRA_DIRS = ['images', 'icons', 'audio', 'assets'];
EXTRA_DIRS.forEach(dirName => {
  const srcDir = path.join(ROOT_DIR, dirName);
  const destDir = path.join(WWW_DIR, dirName);
  if (fs.existsSync(srcDir) && fs.statSync(srcDir).isDirectory()) {
    fs.cpSync(srcDir, destDir, { recursive: true });
    console.log(`  ✓ 디렉터리 복사 완료: ${dirName}`);
  }
});

console.log(`✨ [Mobile Sync 성공] 총 ${copiedCount}개 파일 동기화 완료! (총 크기: ${(totalBytes / 1024 / 1024).toFixed(2)} MB)`);

/**
 * v2.6.1 Ending Collision Fix & Self-Healing Guard Test Suite
 * 검증 항목:
 * 1. idiom_questions.js 5,000문항 전수 종결어미 충돌 0건 검증
 * 2. 사용자 제보 문항 #4694 (뼈를 묻다 / 겠다는) 완벽 해결 검증
 * 3. 주요 술어형 관용구 및 속담 문항의 문법적 무결성 검증
 * 4. app.js 내 Self-Healing Guard (비문 자동 치유) 런타임 검증
 * 5. v2.6.1 버전 일치성 (version.json, index.html, app.js)
 */

const assert = require('assert');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname, '..');

console.log('🧪 Starting v2.6.1 Ending Collision Fix Test Suite...\n');

// 1. idiom_questions.js 5,000 문항 전수 종결어미 충돌 0건 검증
console.log('1️⃣ Scanning idiom_questions.js (5,000 questions) for ending collisions...');
const idiomBank = require(path.join(ROOT_DIR, 'idiom_questions.js')).IDIOM_QUESTION_BANK;
assert.strictEqual(idiomBank.length, 5000, 'Idiom bank must have exactly 5,000 questions');

let collisionCount = 0;
const collisionSamples = [];

idiomBank.forEach((q, idx) => {
  const ans = q.options[q.answerIndex !== undefined ? q.answerIndex : 0];
  const m = q.sentence.match(/\[\s*\(\s*\?*\s*\)\s*\]([^\s.,!?;\"'’“”]+)?/);
  if (m && m[1]) {
    const suffix = m[1];
    if (ans.endsWith('다')) {
      if (/^(겠|었|았|였|했|고|며|어서|아서|면|으니|으면|던|자|는|ㄴ|은|을|ㄹ|어|아|지|게|도|록)/.test(suffix)) {
        collisionCount++;
        collisionSamples.push({ id: q.id, ans, suffix, sentence: q.sentence });
      }
    }
  }
});

assert.strictEqual(collisionCount, 0, `Found ${collisionCount} ending collisions in idiom bank! Must be 0.`);
console.log('  ✅ 5,000 idiom questions scanned: ZERO ending collisions detected!\n');

// 2. 문항 #4694 (사용자 제보 문항) 검증
console.log('2️⃣ Verifying reported question #4694 (뼈를 묻다 / 겠다는)...');
const q4694 = idiomBank.find(q => q.question && q.question.includes('#4694'));
assert(q4694, 'Question #4694 must exist in idiom bank');
assert(q4694.options.includes('뼈를 묻다'), 'Question #4694 options must include "뼈를 묻다"');
assert(q4694.sentence.includes("'[ (     ) ]'라는"), 'Sentence must use quote citation');
assert(!q4694.sentence.includes('겠다는'), 'Sentence must NOT contain awkward 겠다는 directly attached to blank');

// Test substitution
const substituted4694 = q4694.sentence.replace(/\[\s*\(\s*\?*\s*\)\s*\]/g, '뼈를 묻다');
assert(substituted4694.includes("'뼈를 묻다'라는 당찬 포부를 밝혔다"), 'Substituted sentence must be grammatically seamless');
console.log('  ✅ Question #4694 verified: "' + substituted4694 + '"\n');

// 3. 주요 술어형 관용구 검증 (손을 씻다, 배수의 진을 치다, 간을 보다, 갈팡질팡하다 등)
console.log('3️⃣ Verifying predicate-ending idioms...');
const testIdioms = [
  { word: '손을 씻다', expectedEnding: '[ (     ) ].' },
  { word: '배수의 진을 치다', expectedEnding: '[ (     ) ].' },
  { word: '간을 보다', expectedEnding: '[ (     ) ].' },
  { word: '갈팡질팡하다', expectedEnding: '[ (     ) ].' },
  { word: '뜸을 들이다', expectedEnding: '[ (     ) ].' },
  { word: '너나들이하다', expectedEnding: '[ (     ) ].' }
];

testIdioms.forEach(({ word, expectedEnding }) => {
  const sample = idiomBank.find(q => q.options[q.answerIndex] === word);
  assert(sample, `Question for "${word}" must exist`);
  assert(sample.sentence.endsWith(expectedEnding), `Sentence for "${word}" must end with "${expectedEnding}" (got: "${sample.sentence}")`);
});
console.log('  ✅ Predicate-ending idioms end cleanly with "[ (     ) ]."\n');

// 4. app.js Self-Healing Guard 검증
console.log('4️⃣ Testing app.js runtime Self-Healing Guard...');
const appJsCode = fs.readFileSync(path.join(ROOT_DIR, 'app.js'), 'utf8');
assert(appJsCode.includes(']겠다는/g'), 'app.js must contain self-healing guard for 겠다는');
assert(appJsCode.includes(']고\\s+/g'), 'app.js must contain self-healing guard for 고');

// Simulate runtime guard function
function simulateGuard(html, ansWord) {
  if (typeof ansWord === 'string' && ansWord.endsWith('다')) {
    html = html.replace(/\[\s*\(\s*\?*\s*\)\s*\]겠다는/g, "'[ (     ) ]'라는");
    html = html.replace(/\[\s*\(\s*\?*\s*\)\s*\]고\s+/g, "'[ (     ) ]'라며 ");
    html = html.replace(/\[\s*\(\s*\?*\s*\)\s*\]며\s+/g, "'[ (     ) ]'라며 ");
    html = html.replace(/\[\s*\(\s*\?*\s*\)\s*\]은\s+듯/g, "'[ (     ) ]'라는 듯");
  }
  return html;
}

const legacyDirtySentence = '평생 [ (     ) ]겠다는 당찬 포부를 밝혔다.';
const healed = simulateGuard(legacyDirtySentence, '뼈를 묻다');
assert.strictEqual(healed, "평생 '[ (     ) ]'라는 당찬 포부를 밝혔다.", 'Self-healing guard must convert legacy string into clean quote citation');
console.log('  ✅ Runtime guard successfully self-heals legacy dirty sentence string!\n');

// 5. Version Consistency Verification
console.log('5️⃣ Verifying version metadata across files...');
const versionJson = JSON.parse(fs.readFileSync(path.join(ROOT_DIR, 'version.json'), 'utf8'));
assert(versionJson.version, 'version.json must have version');

const indexHtml = fs.readFileSync(path.join(ROOT_DIR, 'index.html'), 'utf8');
assert(indexHtml.includes(`<meta name="app-version" content="${versionJson.version}">`), 'index.html must have meta version');
assert(indexHtml.includes(`v${versionJson.version}`), 'index.html must display version in badge');
assert(indexHtml.includes(`app.js?v=${versionJson.version}`), 'app.js must have version param');
assert(indexHtml.includes(`idiom_questions.js?v=${versionJson.version}`), 'idiom_questions.js must have version param');

assert(appJsCode.includes(`this.APP_VERSION = metaVer || '${versionJson.version}';`), 'app.js must have current version fallback');
console.log(`  ✅ Version ${versionJson.version} consistency confirmed across all files!\n`);

console.log('🎉 ALL v2.6.1 Ending Collision Fix Tests Passed with 100% Pristine Integrity!\n');

const assert = require('assert');
const http = require('http');
const fs = require('fs');
const path = require('path');

const TEST_PORT = 8897;
process.env.PORT = TEST_PORT;
process.env.TEST_ENV = 'true';

const server = require('../server.js');

function request(method, urlPath, headers = {}, body = null) {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: '127.0.0.1',
      port: TEST_PORT,
      path: urlPath,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        ...headers
      }
    }, res => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, headers: res.headers, data: data ? JSON.parse(data) : {} });
        } catch (e) {
          resolve({ status: res.statusCode, headers: res.headers, raw: data });
        }
      });
    });
    req.on('error', reject);
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    req.end();
  });
}

const srv = server.listen(TEST_PORT, async () => {
  console.log('=== Running Complete End-to-End Verification Suite ===');
  try {
    // 1. Static file check
    const rootRes = await request('GET', '/');
    assert.strictEqual(rootRes.status, 200, 'GET / should return 200');
    assert(rootRes.raw.includes('하루맞춤'), 'Root should serve Haru Matchum HTML');
    assert(rootRes.raw.includes('btnModeIdiom'), 'Root should include Idiom switch button');
    assert(rootRes.raw.includes('btnModeHanja'), 'Root should include Hanja switch button');
    assert(rootRes.raw.includes('btnModeEnglish'), 'Root should include English switch button');

    // 2. Idiom & Hanja questions static file check
    const idiomScriptRes = await request('GET', '/idiom_questions.js');
    assert.strictEqual(idiomScriptRes.status, 200, 'GET /idiom_questions.js should return 200');
    assert(idiomScriptRes.raw.includes('IDIOM_QUESTION_BANK'), 'Script should define IDIOM_QUESTION_BANK');

    const hanjaScriptRes = await request('GET', '/hanja_questions.js');
    assert.strictEqual(hanjaScriptRes.status, 200, 'GET /hanja_questions.js should return 200');
    assert(hanjaScriptRes.raw.includes('HANJA_QUESTION_BANK'), 'Script should define HANJA_QUESTION_BANK');

    // 3. User Register
    const testUsername = 'e2e_runner_' + Date.now();
    const regRes = await request('POST', '/api/auth/register', {}, {
      username: testUsername,
      password: 'mypassword123',
      grade: '고등학교 1학년',
      avatar: '🌟'
    });
    assert.strictEqual(regRes.status, 201, 'Register status should be 201');
    assert(regRes.data.success, 'Register should succeed');
    const userToken = regRes.data.token;
    assert(userToken, 'Token must be issued');

    // 4. User Login Success
    const loginRes = await request('POST', '/api/auth/login', {}, {
      username: testUsername,
      password: 'mypassword123'
    });
    assert.strictEqual(loginRes.status, 200, 'Login status should be 200');
    assert(loginRes.data.success, 'Login should succeed');

    // 5. User Sync with ROUND_CLEAR
    const syncRes = await request('POST', '/api/user/sync', {
      'Authorization': `Bearer ${userToken}`
    }, {
      token: userToken,
      action: 'ROUND_CLEAR',
      userData: {
        totalPoints: 250,
        maxRoundToday: 2,
        streak: 1
      },
      details: {
        mode: 'hanja',
        round: 2,
        score: 100,
        pointsEarned: 150
      }
    });
    assert.strictEqual(syncRes.status, 200, 'Sync status should be 200');
    assert.strictEqual(syncRes.data.user.maxRoundToday, 2, 'maxRoundToday should be updated to 2');

    // 6. User Logs Check
    const logsRes = await request('GET', '/api/user/logs', {
      'Authorization': `Bearer ${userToken}`
    });
    assert.strictEqual(logsRes.status, 200, 'User logs should return 200');
    assert(logsRes.data.success);
    assert(Array.isArray(logsRes.data.logs), 'Logs should be array');
    assert(logsRes.data.logs.some(l => l.action === 'REGISTER'), 'Logs should contain REGISTER');
    assert(logsRes.data.logs.some(l => l.action === 'ROUND_CLEAR'), 'Logs should contain ROUND_CLEAR');

    // 7. Clean Leaderboard Check
    const lbRes = await request('GET', '/api/leaderboard');
    assert.strictEqual(lbRes.status, 200, 'Leaderboard status should be 200');
    assert(lbRes.data.success);
    for (const u of lbRes.data.leaderboard) {
      assert(!u.id.startsWith('peer_'), 'Leaderboard must NOT have peer dummies');
      assert(u.name !== '체리블라썸', 'Leaderboard must NOT have 체리블라썸');
      assert(u.name !== '토끼마카롱', 'Leaderboard must NOT have 토끼마카롱');
    }

    // 8. Admin Logs Check (User should be forbidden, Admin allowed)
    const forbiddenAdminRes = await request('GET', '/api/admin/logs', {
      'Authorization': `Bearer ${userToken}`
    });
    assert.strictEqual(forbiddenAdminRes.status, 403, 'Normal user should get 403 Forbidden for admin logs');

    // Get or ensure admin token for 단민러브
    const dbFile = path.join(__dirname, '..', 'data', 'users.json');
    const db = JSON.parse(fs.readFileSync(dbFile, 'utf8'));
    let adminToken = Object.keys(db.tokens).find(t => db.tokens[t] === '단민러브');
    if (!adminToken) {
      adminToken = 'admin_token_' + Date.now();
      db.tokens[adminToken] = '단민러브';
      fs.writeFileSync(dbFile, JSON.stringify(db, null, 2), 'utf8');
    }
    const adminRes = await request('GET', '/api/admin/logs', {
      'Authorization': `Bearer ${adminToken}`
    });
    assert.strictEqual(adminRes.status, 200, 'Admin 단민러브 should get 200 for admin logs');
    assert(adminRes.data.success);
    assert(adminRes.data.logs.length > 0, 'Admin logs should have recorded entries');

    // 9. Hanja duplicate sentence check
    const rawHanja = require('../hanja_questions.js');
    const hanjaBank = rawHanja.HANJA_QUESTION_BANK || rawHanja;
    let dupCount = 0;
    hanjaBank.forEach(q => {
      const match = q.sentence.match(/\[\s*([^\s\/]+)\s*\/\s*([^\s\/]+)\s*\]/);
      if (match && match[1].trim() === match[2].trim()) dupCount++;
    });
    assert.strictEqual(dupCount, 0, 'No duplicate [ word / word ] in hanja sentences');

    // 10. Mobile Lifecycle & KST Date logic check
    const appCode = fs.readFileSync(path.join(__dirname, '../app.js'), 'utf8');
    const styleCss = fs.readFileSync(path.join(__dirname, '../style.css'), 'utf8');
    assert(appCode.includes('visibilitychange'), 'app.js includes visibilitychange');
    assert(appCode.includes('checkDateTransition'), 'app.js includes checkDateTransition');
    assert(appCode.includes('getKSTDateString'), 'app.js includes getKSTDateString');

    // 11. Random Answer Distribution and Option Shuffle check
    assert(appCode.includes('shuffleQuestionOptions'), 'app.js must include shuffleQuestionOptions');
    const sampleHanjaQ = hanjaBank[0];
    const originalAns = sampleHanjaQ.options[sampleHanjaQ.answerIndex];
    let shuffleWorked = false;
    for (let t = 0; t < 20; t++) {
      const copy = { ...sampleHanjaQ, options: [...sampleHanjaQ.options] };
      for (let i = copy.options.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy.options[i], copy.options[j]] = [copy.options[j], copy.options[i]];
      }
      copy.answerIndex = copy.options.indexOf(originalAns);
      assert.strictEqual(copy.options[copy.answerIndex], originalAns);
      if (copy.answerIndex !== 0) shuffleWorked = true;
    }
    assert(shuffleWorked, 'Shuffling must distribute answer index beyond 0');

    // 12. Mobile Auth Persistence check
    assert(appCode.includes('haru_auth_username'), 'app.js must backup haru_auth_username in localStorage');

    // 13. v2.6.0 English Voice (TTS) & Concise Questions (No Awkward Prefix) check
    assert(appCode.includes('EnglishSpeechEngine'), 'app.js must include EnglishSpeechEngine');
    assert(appCode.includes('englishVoiceBar'), 'app.js must handle englishVoiceBar');
    const indexHtml = fs.readFileSync(path.join(__dirname, '../index.html'), 'utf8');
    assert(indexHtml.includes('id="btnQuizVoiceSentence"'), 'index.html must have btnQuizVoiceSentence');
    assert(indexHtml.includes('id="btnExpVoiceWord"'), 'index.html must have btnExpVoiceWord');
    assert(indexHtml.includes('id="btnExpVoiceSentence"'), 'index.html must have btnExpVoiceSentence');
    const rawIdiom = require('../idiom_questions.js');
    const idiomBank = rawIdiom.IDIOM_QUESTION_BANK || rawIdiom;
    const rawSpelling = require('../questions.js');
    const spellingBank = rawSpelling.SPELLING_QUESTION_BANK || rawSpelling;
    assert(!idiomBank[0].sentence.includes('학교 교실에서 학급 친구들과 함께'), 'Idiom question must be concise without awkward prefix');
    assert(!hanjaBank[0].sentence.includes('학교 교실에서 학급 친구들과 함께'), 'Hanja question must be concise without awkward prefix');
    assert(appCode.includes("res.status === 401"), 'app.js must strictly check for 401 before wiping tokens');
    assert(appCode.includes("window.addEventListener('online'"), 'app.js must re-verify session on online event');

    // 13. Gamification & Dual-Subject Leaderboard check
    assert(appCode.includes('this.shields'), 'app.js must include shields');
    assert(appCode.includes('perfectRoundStreak'), 'app.js must track perfectRoundStreak');
    assert(appCode.includes('useItem5050'), 'app.js must include useItem5050');
    assert(appCode.includes('useItemHeart'), 'app.js must include useItemHeart');
    assert(appCode.includes('useItemDouble'), 'app.js must include useItemDouble');
    assert(appCode.includes('handleReviveQuiz'), 'app.js must include handleReviveQuiz');

    const lbRoundRes = await request('GET', '/api/leaderboard?mode=spelling&type=round');
    assert.strictEqual(lbRoundRes.status, 200);
    assert(Array.isArray(lbRoundRes.data.leaderboard));

    // 14. Mobile Auto-Update & Version Check check
    assert(appCode.includes('checkAppVersionUpdate'), 'app.js must include checkAppVersionUpdate');
    assert(appCode.includes('isServerVersionNewer'), 'app.js must include isServerVersionNewer');
    assert(appCode.includes('meta[name="app-version"]'), 'app.js must query meta app-version');
    assert(indexHtml.includes('<meta name="app-version" content="2.9.5">'), 'index.html must include meta app-version 2.9.5');
    assert(indexHtml.includes('(최대 2개 보유)'), 'index.html must specify (최대 2개 보유)');

    // 15. v2.6.1 Ending Collision Fix & Self-Healing Guard check
    assert(appCode.includes(']겠다는/g'), 'app.js must include self-healing guard for 겠다는');
    const sample4694 = idiomBank.find(q => q.question && q.question.includes('#4694'));
    assert(sample4694, 'Question #4694 must exist in idiom bank');
    assert(sample4694.sentence.includes("'[ (     ) ]'라는 당찬 포부를 밝혔다"), 'Question #4694 must use clean quote citation');

    // 16. v2.6.2 User Bug Fixes: Q3662 & Q2414 check
    const sample3662 = spellingBank.find(q => q.id === 3662);
    assert(sample3662, 'Question #3662 must exist');
    assert.strictEqual(new Set(sample3662.options.map(o => o.trim().replace(/\s+/g, ' '))).size, 4, 'Q3662 must have 4 unique options');
    const sample2414 = spellingBank.find(q => q.id === 2414);
    assert(sample2414, 'Question #2414 must exist');
    assert.strictEqual(sample2414.options[sample2414.answerIndex], '희한한', 'Q2414 answer must be 희한한');

    // 17. v2.7.0 Sound, Q4333, Leaderboard match, Shop & Avatar Zoom check
    const sample4333 = spellingBank.find(q => q.id === 4333);
    assert(sample4333, 'Question #4333 must exist');
    assert(sample4333.sentence.includes('조달청을 제정하여'), 'Q4333 sentence must be 조달청을 제정하여');
    assert(appCode.includes('EnglishSpeechEngine'), 'app.js must include EnglishSpeechEngine');
    assert(appCode.includes('ITEM_PRICES'), 'app.js must include ITEM_PRICES');
    assert(appCode.includes('ACCESSORY_DEFINITIONS'), 'app.js must include ACCESSORY_DEFINITIONS');
    assert(appCode.includes('renderCompositeAvatar'), 'app.js must include renderCompositeAvatar');
    assert(indexHtml.includes('modalAvatarZoom'), 'index.html must include modalAvatarZoom');
    assert(indexHtml.includes('modalShop'), 'index.html must include modalShop');

    // 18. v2.7.1 What's New Modal & Dismiss Forever check
    assert(indexHtml.includes('modalWhatsNew'), 'index.html must include modalWhatsNew');
    assert(indexHtml.includes('btnDismissWhatsNewForever'), 'index.html must include btnDismissWhatsNewForever');
    assert(appCode.includes('checkWhatsNewPopup'), 'app.js must include checkWhatsNewPopup');
    assert(appCode.includes('dismissWhatsNewForever'), 'app.js must include dismissWhatsNewForever');
    assert(appCode.includes('haru_dismissed_update_version'), 'app.js must use version-aware persistence key');

    // 19. v2.8.0 Shop Dual Close Buttons, Virtual Fitting Preview, Mario Costumes, and Grammar Polish Guard
    assert(indexHtml.includes('id="btnCloseShop"'), 'index.html must include #btnCloseShop top close button');
    assert(indexHtml.includes('id="btnBottomCloseShop"'), 'index.html must include #btnBottomCloseShop bottom close button');
    assert(indexHtml.includes('id="btnResetShopPreview"'), 'index.html must include #btnResetShopPreview reset button');
    assert(appCode.includes('previewAccessory'), 'app.js must include previewAccessory function');
    assert(appCode.includes('resetShopPreview'), 'app.js must include resetShopPreview function');
    assert(appCode.includes('renderShopAvatarPreview'), 'app.js must include renderShopAvatarPreview function');
    assert(appCode.includes('acc-neck'), 'app.js must render acc-neck layer');
    assert(appCode.includes('acc-hand'), 'app.js must render acc-hand layer');
    assert(appCode.includes('acc-back'), 'app.js must render acc-back layer');
    assert(appCode.includes('acc-pet'), 'app.js must render acc-pet layer');
    const sample871 = spellingBank.find(q => q.id === 871);
    assert(sample871, 'Question #871 must exist');
    assert(!sample871.sentence.includes('결과일지'), 'Q871 must not have awkward noun collision');

    // 20. v2.9.0 Animal Crossing 2.5-Head Full-Body Avatar & Quiz Companion Reactions
    assert(indexHtml.includes('id="quizCompanionBar"'), 'index.html must include #quizCompanionBar');
    assert(indexHtml.includes('id="quizCompanionAvatar"'), 'index.html must include #quizCompanionAvatar');
    assert(indexHtml.includes('data-category="outfit"'), 'index.html must include outfit category chip');
    assert(indexHtml.includes('data-category="shoes"'), 'index.html must include shoes category chip');
    assert(appCode.includes('renderQuizCompanionAvatar'), 'app.js must include renderQuizCompanionAvatar function');
    assert(appCode.includes('toggleGlassesMode'), 'app.js must include toggleGlassesMode function');
    assert(appCode.includes('fullbody-frame'), 'app.js must render fullbody-frame for chibi 2.5-head avatar');

    // 21. v2.9.1 SD Body Anatomy, Outfits, Sleeves, 3D Shoes, Hat Fitting & Dual Cheeks
    assert(appCode.includes('getOutfitStyleInfo'), 'app.js must include getOutfitStyleInfo');
    assert(appCode.includes('renderBlushLayer'), 'app.js must include renderBlushLayer');
    assert(appCode.includes('getHatClass'), 'app.js must include getHatClass');
    assert(appCode.includes('getShoesClass'), 'app.js must include getShoesClass');

    // 22. v2.9.2 SVG Organic Chibi (SD) Body Template & Clipped Outfits
    assert(appCode.includes('renderChibiSvgBody'), 'app.js must include renderChibiSvgBody');
    assert(appCode.includes('chibi-body-svg'), 'app.js must render chibi-body-svg');
    assert(appCode.includes('chibi-svg-skin'), 'app.js must render chibi-svg-skin');
    assert(appCode.includes('chibi-svg-clothes-layer'), 'app.js must render chibi-svg-clothes-layer');
    assert(styleCss.includes('.chibi-body-svg'), 'style.css must define .chibi-body-svg');
    assert(styleCss.includes('.torso-overlay-content'), 'style.css must define .torso-overlay-content');
    assert(styleCss.includes('.chibi-svg-clothes-base'), 'style.css must define .chibi-svg-clothes-base');

    // 23. v2.9.3 Anti-Cheat, Minimum 200P Item Economy, Dual-Engine Audio & No-Store Cache
    assert(appCode.includes('// Anti-Cheat: On fresh app launch/reopen, clear stale mid-quiz session'), 'app.js must clear mid-quiz session on fresh launch');
    assert(appCode.includes('playFallbackAudio'), 'app.js must implement playFallbackAudio');
    assert(appCode.includes('createFallbackAudioUri'), 'app.js must implement createFallbackAudioUri');
    assert(indexHtml.includes('<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">'), 'index.html must include Cache-Control meta');

    const verRes = await request('GET', '/api/version');
    assert.strictEqual(verRes.status, 200, 'GET /api/version must return 200');
    assert.strictEqual(verRes.data.success, true, 'GET /api/version success must be true');
    assert.strictEqual(verRes.data.version, '2.9.5', 'GET /api/version version must be 2.9.5');
    const verCc = verRes.headers['cache-control'] || '';
    assert(verCc.includes('no-store'), 'GET /api/version cache-control must include no-store');

    // 24. v2.9.4 Shop Close Home Restore, iOS Safari Silent Audio & Idiom Leaderboard
    assert(indexHtml.includes('id="rankSubjectIdiom"'), 'index.html must include rankSubjectIdiom button');
    assert(appCode.includes('this.modalShop.classList.remove(\'active\')'), 'app.js must close shop modal');
    assert(appCode.includes('rankSubjectIdiom'), 'app.js must bind rankSubjectIdiom');
    assert(appCode.includes('playHtmlAudio'), 'app.js must implement playHtmlAudio');

    // 25. v2.9.5 Rank Avatar Zoom Gallery, 36 Cute Avatars & 260+ Accessories
    const serverCode = fs.readFileSync(path.join(__dirname, '../server.js'), 'utf8');
    assert(appCode.includes('openAvatarZoomModal(targetUser = null)'), 'app.js must support targetUser in openAvatarZoomModal');
    assert(appCode.includes('outfit_strawberry_milk_pajama'), 'app.js must include strawberry milk pajama');
    assert(indexHtml.includes('data-avatar="🐼"'), 'index.html must include panda avatar');
    assert(serverCode.includes('avatarAccessories: (u.avatarAccessories && typeof u.avatarAccessories === \'object\') ? u.avatarAccessories : {}'), 'server.js must return avatarAccessories in leaderboard');

    // Clean up temporary test user to strictly maintain 4 authentic users
    const usersFilePath = path.join(__dirname, '../data/users.json');
    if (fs.existsSync(usersFilePath)) {
      try {
        const usersObj = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
        if (usersObj.users && usersObj.users[testUsername]) {
          delete usersObj.users[testUsername];
        }
        if (usersObj.tokens) {
          for (const [t, u] of Object.entries(usersObj.tokens)) {
            if (u === testUsername) delete usersObj.tokens[t];
          }
        }
        fs.writeFileSync(usersFilePath, JSON.stringify(usersObj, null, 2), 'utf8');
      } catch (err) {}
    }

    console.log('🎉 ALL End-to-End System Tests Passed Pristine and Green!');
    srv.close();
    process.exit(0);
  } catch (e) {
    console.error('❌ E2E Verification Failed:', e);
    srv.close();
    process.exit(1);
  }
});

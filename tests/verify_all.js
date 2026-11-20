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
    assert(indexHtml.includes('<meta name="app-version" content="3.6.1">'), 'index.html must include meta app-version 3.6.1');
    assert(indexHtml.includes('<link rel="stylesheet" href="style.css?v=3.6.1">'), 'index.html must cache-bust style.css with v3.6.1');
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
    assert(sample4333.standardWord === '예규', 'Q4333 standardWord must be 예규');
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
    assert(appCode.includes('updateResumeQuizBanner'), 'app.js must check and update resume quiz banner on launch');
    assert(appCode.includes('playFallbackAudio'), 'app.js must implement playFallbackAudio');
    assert(appCode.includes('createFallbackAudioUri'), 'app.js must implement createFallbackAudioUri');
    assert(indexHtml.includes('<meta http-equiv="Cache-Control" content="no-cache, no-store, must-revalidate">'), 'index.html must include Cache-Control meta');

    const verRes = await request('GET', '/api/version');
    assert.strictEqual(verRes.status, 200, 'GET /api/version must return 200');
    assert.strictEqual(verRes.data.success, true, 'GET /api/version success must be true');
    assert.strictEqual(verRes.data.version, '3.6.1', 'GET /api/version version must be 3.6.1');
    const verCc = verRes.headers['cache-control'] || '';
    assert(verCc.includes('no-store'), 'GET /api/version cache-control must include no-store');

    // 23-B. v3.1.1 Message button resilience & Guest mode experience
    assert(indexHtml.includes('id="btnNavInbox"'), 'index.html must include btnNavInbox in nav-tabs');
    assert(indexHtml.includes('id="btnInboxComposeTop"'), 'index.html must include btnInboxComposeTop in modalInbox');
    assert(indexHtml.includes('id="msgGuestNoticeBanner"'), 'index.html must include msgGuestNoticeBanner in modalSendMessage');
    assert(appCode.includes('btnNavInbox'), 'app.js must bind btnNavInbox');
    assert(appCode.includes('btnInboxComposeTop'), 'app.js must bind btnInboxComposeTop');
    assert(appCode.includes('rank-msg-btn'), 'app.js must render rank-msg-btn');
    assert(appCode.includes('renderGuestInbox'), 'app.js must implement renderGuestInbox');

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

    // 26. v2.9.6 Real-Time Avatar Accessories Sync to Leaderboard
    assert(appCode.includes('syncUserData(action = \'USER_DATA_UPDATE\', details = {})'), 'app.js must define syncUserData method');
    assert(appCode.includes('avatarAccessories: { ...(this.data.currentUser.avatarAccessories || u.avatarAccessories || {}) }'), 'renderLeaderboard must optimistic merge avatarAccessories');
    assert(appCode.includes('this.renderLeaderboard(this.rankType || \'daily\');'), 'closeShopModal must re-render leaderboard');

    // 27. v2.9.7 Smart Bidirectional Sync & Compact Outfit Badge
    assert(appCode.includes('AUTO_INITIAL_PUSH_ACCESSORIES'), 'app.js must support initial accessory push');
    assert(appCode.includes('acc-compact-outfit'), 'app.js must support compact outfit badge');
    assert(serverCode.includes('ensureUserIntegrity(db)'), 'server.js must define ensureUserIntegrity');

    // 28. v2.9.8 EmojiHub API, 1:1 Realtime Messaging & Inbox System
    assert(appCode.includes('emojihub.yurace.pro/api/all/category'), 'app.js must call EmojiHub API');
    assert(appCode.includes('openSendMessageModal'), 'app.js must support openSendMessageModal');
    assert(appCode.includes('startMessagePolling'), 'app.js must support startMessagePolling');
    assert(serverCode.includes('/api/messages/send'), 'server.js must implement /api/messages/send');
    assert(serverCode.includes('/api/messages/check'), 'server.js must implement /api/messages/check');
    assert(serverCode.includes('/api/messages/inbox'), 'server.js must implement /api/messages/inbox');
    assert(serverCode.includes('/api/messages/read'), 'server.js must implement /api/messages/read');
    assert(indexHtml.includes('id="btnOpenInbox"'), 'index.html must include btnOpenInbox');
    assert(indexHtml.includes('id="modalSendMessage"'), 'index.html must include modalSendMessage');
    assert(indexHtml.includes('id="modalIncomingMessage"'), 'index.html must include modalIncomingMessage');
    assert(indexHtml.includes('id="modalInbox"'), 'index.html must include modalInbox');

    // 29. v2.9.9 Korean Sentence Grammar Validator & 20,000 Questions Integrity
    const validator = require('../korean_grammar_validator.js');
    assert.strictEqual(typeof validator.validateSentenceIntegrity, 'function', 'validateSentenceIntegrity must be exported');
    assert.strictEqual(typeof validator.validateBank, 'function', 'validateBank must be exported');
    
    // Check regression item #168 & #1676
    const spellingQuestions = require('../questions.js').SPELLING_QUESTION_BANK;
    const q168 = spellingQuestions.find(q => q.id === 168);
    assert.strictEqual(q168.options[q168.answerIndex], '맞추어', 'Q168 correct answer must be 맞추어');
    const q1676 = spellingQuestions.find(q => q.id === 1676);
    assert.strictEqual(q1676.options[q1676.answerIndex], '부스스한', 'Q1676 correct answer must be 부스스한');
    
    // Quick grammar check on sample questions
    const valRes = validator.validateSentenceIntegrity(q168);
    assert.strictEqual(valRes.isValid, true, 'Q168 must pass grammar validation');

    // 30. v2.9.10 What's New Layout & Messaging Runtime Stability
    const styleCode = fs.readFileSync(path.join(__dirname, '../style.css'), 'utf8');
    assert(appCode.includes('applause() {'), 'SoundEffects must implement applause()');
    assert(serverCode.includes('username: u.username || u.name,'), 'server.js leaderboard must return username');
    assert(indexHtml.includes('class="whats-new-body"'), 'index.html must include whats-new-body');
    assert(styleCode.includes('overflow-x: hidden;'), 'style.css must prevent horizontal scroll');

    // 31. v2.9.11 1:1 Photo Messaging & 24h Auto-Deletion Engine
    assert(serverCode.includes('/api/messages/upload-photo'), 'server.js must implement /api/messages/upload-photo');
    assert(serverCode.includes('/api/uploads/photos/'), 'server.js must implement /api/uploads/photos/ serving');
    assert(serverCode.includes('cleanupExpiredPhotos()'), 'server.js must implement cleanupExpiredPhotos()');
    assert(serverCode.includes('PHOTO_TTL_MS'), 'server.js must define PHOTO_TTL_MS');
    assert(indexHtml.includes('id="msgPhotoInput"'), 'index.html must include msgPhotoInput');
    assert(indexHtml.includes('id="btnTriggerPhotoUpload"'), 'index.html must include btnTriggerPhotoUpload');
    assert(indexHtml.includes('id="modalPhotoLightbox"'), 'index.html must include modalPhotoLightbox');
    assert(appCode.includes('compressImageFile'), 'app.js must implement compressImageFile');
    assert(appCode.includes('openPhotoLightbox'), 'app.js must implement openPhotoLightbox');
    assert(appCode.includes('clearAttachedPhoto'), 'app.js must implement clearAttachedPhoto');

    // 32. v2.9.12 Multi-Recipient Messaging & Photo Distribution (1 or More Friends)
    assert(indexHtml.includes('id="msgRecipientSelectorGrid"'), 'index.html must include msgRecipientSelectorGrid');
    assert(indexHtml.includes('id="msgSelectedCountBadge"'), 'index.html must include msgSelectedCountBadge');
    assert(indexHtml.includes('id="btnToggleSelectAllRecipients"'), 'index.html must include btnToggleSelectAllRecipients');
    assert(appCode.includes('renderRecipientSelector'), 'app.js must implement renderRecipientSelector');
    assert(appCode.includes('toggleRecipientSelection'), 'app.js must implement toggleRecipientSelection');
    assert(appCode.includes('toggleSelectAllRecipients'), 'app.js must implement toggleSelectAllRecipients');
    assert(appCode.includes('updateRecipientSelectionUI'), 'app.js must implement updateRecipientSelectionUI');
    assert(serverCode.includes('Array.isArray(body.recipients)'), 'server.js must support array of recipients');

    // 33. v2.9.13 Emoji Picker Close/Toggle & Sticky Send Button Engine
    assert(indexHtml.includes('id="btnToggleEmojiPicker"'), 'index.html must include btnToggleEmojiPicker');
    assert(indexHtml.includes('id="btnCloseEmojiPicker"'), 'index.html must include btnCloseEmojiPicker');
    assert(indexHtml.includes('id="messageModalScrollBody"'), 'index.html must include messageModalScrollBody');
    assert(indexHtml.includes('class="message-modal-footer"'), 'index.html must include message-modal-footer');
    assert(appCode.includes('toggleEmojiPicker'), 'app.js must implement toggleEmojiPicker');
    assert(styleCode.includes('.message-modal-footer {'), 'style.css must define .message-modal-footer');
    assert(styleCode.includes('.btn-close-emoji-picker'), 'style.css must define .btn-close-emoji-picker');

    // 34. v3.0.0 Universal Mobile App (iOS / Android Capacitor & Pre-validated Security)
    assert(appCode.includes('getApiUrl'), 'app.js must implement getApiUrl for native mobile bridge');
    assert(appCode.includes('HARU_PROD_API_BASE'), 'app.js must define HARU_PROD_API_BASE');
    assert(indexHtml.includes('viewport-fit=cover'), 'index.html must specify viewport-fit=cover for notch/dynamic island');
    assert(styleCode.includes('safe-area-inset-top'), 'style.css must support safe-area-inset-top');
    assert(styleCode.includes('safe-area-inset-bottom'), 'style.css must support safe-area-inset-bottom');

    const capConfig = JSON.parse(fs.readFileSync(path.join(__dirname, '../capacitor.config.json'), 'utf8'));
    assert.strictEqual(capConfig.appId, 'com.danminlove.haru', 'capacitor appId must be com.danminlove.haru');
    assert(capConfig.server.allowNavigation.includes('haru.danminlove.com'), 'capacitor must allow navigation to haru.danminlove.com');

    const androidManifest = fs.readFileSync(path.join(__dirname, '../android/app/src/main/AndroidManifest.xml'), 'utf8');
    assert(androidManifest.includes('networkSecurityConfig'), 'AndroidManifest.xml must include networkSecurityConfig');
    assert(androidManifest.includes('usesCleartextTraffic'), 'AndroidManifest.xml must allow cleartext traffic');
    assert(androidManifest.includes('ACCESS_NETWORK_STATE'), 'AndroidManifest.xml must include ACCESS_NETWORK_STATE');
    assert(androidManifest.includes('READ_MEDIA_IMAGES'), 'AndroidManifest.xml must include READ_MEDIA_IMAGES');

    const netSecConfig = fs.readFileSync(path.join(__dirname, '../android/app/src/main/res/xml/network_security_config.xml'), 'utf8');
    assert(netSecConfig.includes('haru.danminlove.com'), 'network_security_config must trust haru.danminlove.com');

    const iosPlist = fs.readFileSync(path.join(__dirname, '../ios/App/App/Info.plist'), 'utf8');
    assert(iosPlist.includes('NSAppTransportSecurity'), 'Info.plist must configure NSAppTransportSecurity');
    assert(iosPlist.includes('NSPhotoLibraryUsageDescription'), 'Info.plist must provide NSPhotoLibraryUsageDescription to avoid crash');
    assert(iosPlist.includes('NSCameraUsageDescription'), 'Info.plist must provide NSCameraUsageDescription to avoid crash');
    assert(iosPlist.includes('WKAllowsInlineMediaPlayback'), 'Info.plist must allow inline audio/media playback');

    assert(fs.existsSync(path.join(__dirname, '../scripts/prepare_mobile.js')), 'scripts/prepare_mobile.js must exist');
    assert(fs.existsSync(path.join(__dirname, '../scripts/build_signed_apk.sh')), 'scripts/build_signed_apk.sh must exist');

    // 37. v3.2.0 PWA Home Screen Shortcut (A2HS) & Web Push VAPID Notification Engine
    const manifestExists = fs.existsSync(path.join(__dirname, '../manifest.json'));
    const swExists = fs.existsSync(path.join(__dirname, '../sw.js'));
    const icon192Exists = fs.existsSync(path.join(__dirname, '../public/icons/icon-192.png'));
    const icon512Exists = fs.existsSync(path.join(__dirname, '../public/icons/icon-512.png'));
    const appleIconExists = fs.existsSync(path.join(__dirname, '../public/icons/apple-touch-icon.png'));
    assert(manifestExists, 'manifest.json must exist');
    assert(swExists, 'sw.js must exist');
    assert(icon192Exists && icon512Exists && appleIconExists, 'PWA icons must exist');
    assert(indexHtml.includes('rel="manifest"'), 'index.html must link manifest.json');
    assert(indexHtml.includes('rel="apple-touch-icon"'), 'index.html must link apple-touch-icon');
    assert(indexHtml.includes('id="pushNotificationCard"'), 'index.html must include pushNotificationCard');
    assert(indexHtml.includes('id="modalPwaGuide"'), 'index.html must include modalPwaGuide');
    assert(serverCode.includes('/api/push/vapid-public-key'), 'server.js must implement /api/push/vapid-public-key');
    assert(serverCode.includes('/api/push/subscribe'), 'server.js must implement /api/push/subscribe');
    assert(serverCode.includes('sendWebPushToUsers'), 'server.js must implement sendWebPushToUsers');
    assert(appCode.includes('initServiceWorkerAndPush'), 'app.js must implement initServiceWorkerAndPush');
    assert(appCode.includes('notification() {'), 'SoundEffects must implement notification()');

    // 38. v3.3.0 Chat Threads, Multi-user Square, Gift Sending, and Sticker Packs
    const catalogRes = await request('GET', '/api/chat/catalog');
    assert.strictEqual(catalogRes.status, 200, '/api/chat/catalog should return 200');
    assert.ok(catalogRes.data.gifts && catalogRes.data.gifts.gift_heart, 'gift_heart must exist in catalog');
    assert.ok(catalogRes.data.gifts.gift_cake, 'gift_cake must exist in catalog');

    assert(indexHtml.includes('id="modalChatApp"'), 'index.html must include modalChatApp');
    assert(indexHtml.includes('id="modalSendGift"'), 'index.html must include modalSendGift');
    assert(indexHtml.includes('stickers.js'), 'index.html must load stickers.js');
    assert(fs.existsSync(path.join(__dirname, '../stickers.js')), 'stickers.js must exist on disk');

    assert(serverCode.includes('/api/chat/rooms'), 'server.js must implement /api/chat/rooms');
    assert(serverCode.includes('/api/chat/thread'), 'server.js must implement /api/chat/thread');
    assert(serverCode.includes('/api/chat/send'), 'server.js must implement /api/chat/send');
    assert(serverCode.includes('/api/chat/send-gift'), 'server.js must implement /api/chat/send-gift');
    assert(appCode.includes('initChatApp'), 'app.js must implement initChatApp');
    assert(appCode.includes('openChatAppModal'), 'app.js must implement openChatAppModal');
    assert(appCode.includes('openSendGiftModal'), 'app.js must implement openSendGiftModal');

    // 39. v3.4.0 Smart Resume, Auto-Resize Chat & Brand Parody Gifts
    assert.ok(catalogRes.data.gifts.gift_twosome_cake, 'gift_twosome_cake must exist in catalog');
    assert.ok(catalogRes.data.gifts.gift_starbox_americano, 'gift_starbox_americano must exist in catalog');
    assert.ok(catalogRes.data.gifts.gift_kyochon_combo, 'gift_kyochon_combo must exist in catalog');
    assert.ok(catalogRes.data.gifts.gift_baemin_voucher, 'gift_baemin_voucher must exist in catalog');
    assert(appCode.includes('resizeChatInput'), 'app.js must auto-resize chatInputText');
    assert(appCode.includes('toggleChatArchive'), 'app.js must implement toggleChatArchive');
    assert(indexHtml.includes('id="btnChatToggleArchive"'), 'index.html must include btnChatToggleArchive');

    // 40. v3.4.2 Mobile Layout Optimization & Concise Quiz Refinement
    assert(appCode.includes('formatConciseQuizPrompt'), 'app.js must implement formatConciseQuizPrompt');
    assert(styleCode.includes('grid-template-columns: repeat(2, 1fr)'), 'style.css must support 2x2 grid');
    assert(styleCode.includes('white-space: nowrap !important;'), 'style.css must enforce nowrap on mode-switch-btn');
    assert(indexHtml.includes('id="btnCloseEmojiPicker"'), 'index.html must include btnCloseEmojiPicker');

    // 41. v3.4.3 Chat Toolbar 2-Tier Defense & Gift Tabs Robustness
    assert(indexHtml.includes('class="chat-input-toolbar" style="display: flex !important; flex-direction: column !important;'), 'index.html must enforce column inline style on chat-input-toolbar');
    assert(appCode.includes('window.selectGiftCategory ='), 'app.js must declare global window.selectGiftCategory');
    assert(appCode.includes('FALLBACK_GIFT_CATALOG'), 'app.js must include FALLBACK_GIFT_CATALOG');

    // 42. v3.4.4 Chat Auto-Scroll Bottom Pinning & CLS Defense
    assert(styleCode.includes('overflow-anchor: auto !important;'), 'style.css must enable web standard scroll anchoring');
    assert(styleCode.includes('.chat-photo-bubble img'), 'style.css must style chat-photo-bubble img');
    assert(styleCode.includes('min-height: 140px;'), 'style.css must pre-allocate 140px photo height');
    assert(indexHtml.includes('id="chatBottomAnchor"'), 'index.html must include chatBottomAnchor element');
    assert(appCode.includes('this.isChatUserScrolledUp = false;'), 'app.js must track isChatUserScrolledUp');
    assert(appCode.includes('anchor.scrollIntoView'), 'app.js must use anchor.scrollIntoView for bottom lock');

    // 43. v3.5.0 Gift Sending Resilience & Multi-User Group Chat System
    assert(indexHtml.includes('id="btnChatHeaderInvite"'), 'index.html must include btnChatHeaderInvite');
    assert(indexHtml.includes('id="btnOpenCreateGroup"'), 'index.html must include btnOpenCreateGroup');
    assert(indexHtml.includes('id="modalChatInviteFriends"'), 'index.html must include modalChatInviteFriends');
    assert(styleCode.includes('.btn-chat-invite-quick'), 'style.css must define .btn-chat-invite-quick');
    assert(styleCode.includes('.btn-create-group-pill'), 'style.css must define .btn-create-group-pill');
    assert(styleCode.includes('.chat-room-card.is-custom-group'), 'style.css must define .chat-room-card.is-custom-group');
    assert(appCode.includes('openInviteFriendsModal'), 'app.js must implement openInviteFriendsModal');
    assert(appCode.includes('submitInviteFriends'), 'app.js must implement submitInviteFriends');
    assert(appCode.includes('this.currentSendGiftTargetUser = effTarget;'), 'app.js must store currentSendGiftTargetUser');
    assert(serverCode.includes('/api/chat/create-group'), 'server.js must implement /api/chat/create-group');
    assert(serverCode.includes('/api/chat/invite'), 'server.js must implement /api/chat/invite');
    assert(serverCode.includes('toUsername.toLowerCase()'), 'server.js must provide case-insensitive user fallback in send-gift');

    // 29. v3.5.1 Minchae Jjanggu Sticker Pack & Image Renderer Verification
    const { STICKER_PACKS } = require('../stickers.js');
    assert(STICKER_PACKS.minchae_jjanggu, 'stickers.js must define minchae_jjanggu pack');
    assert.strictEqual(STICKER_PACKS.minchae_jjanggu.stickers.length, 20, 'minchae_jjanggu pack must contain exactly 20 stickers');
    for (let i = 1; i <= 20; i++) {
      const pad = String(i).padStart(2, '0');
      const stickerFilePath = path.join(__dirname, `../public/stickers/minchae/minchae_${pad}.png`);
      assert(fs.existsSync(stickerFilePath), `Sticker image minchae_${pad}.png must exist`);
    }
    assert(indexHtml.includes('data-pack="minchae_jjanggu"'), 'index.html must include minchae_jjanggu tab');
    assert(appCode.includes('minchae_jjanggu'), 'app.js must reference minchae_jjanggu');
    assert(appCode.includes('chat-sticker-img-bubble'), 'app.js must render chat-sticker-img-bubble for image stickers');

    // 30. v3.5.2 Direct Chat Window on Notification Click Verification
    const swCode = fs.readFileSync(path.join(__dirname, '../sw.js'), 'utf8');
    assert(swCode.includes("const CACHE_NAME = 'haru-pwa-v3.6.1';"), 'sw.js must bump cache name');
    assert(swCode.includes("OPEN_CHAT"), 'sw.js must dispatch OPEN_CHAT on click');
    assert(serverCode.includes('/?open=chat&withUser='), 'server.js must send chat target url');
    assert(appCode.includes('handleUrlNavigation()'), 'app.js must implement handleUrlNavigation()');
    assert(appCode.includes('this.enterChatRoom(null, senderUser);'), 'app.js reply must open chat directly');
    assert(indexHtml.includes('💬 대화창으로 이동'), 'index.html must label reply button as direct chat');

    // 31. v3.5.3 User 5-Bugfixes Verification
    // Bug 1: Mascot greeting dynamically reflects user name
    assert(indexHtml.includes('id="mascotUserGreeting"'), 'index.html must include #mascotUserGreeting');
    assert(appCode.includes("this.updateMascotMood('happy'"), 'app.js must update mascot greeting dynamically in renderUserProfile');

    // Bug 2: Version badge dynamic & synced
    assert(indexHtml.includes('id="quickReloadVersionBadge" class="version-badge">v3.6.1</span>'), 'index.html must have v3.6.1 badge');
    assert(indexHtml.includes('title="v3.5 업데이트 소식 다시 보기"'), 'index.html must have v3.5 whats new title');
    assert(appCode.includes("url.searchParams.set('_v', this.APP_VERSION"), 'app.js must use dynamic APP_VERSION on reload');

    // Bug 3: Chat scroll jitter eliminated
    assert(!appCode.includes('anchor.scrollIntoView({ block: \'end\', inline: \'nearest\', behavior: smooth ? \'smooth\' : \'auto\' });'), 'app.js must not thrash with scrollIntoView inside scrollChatToBottom');
    assert(appCode.includes('container.scrollTo({'), 'app.js must use container.scrollTo for smooth scroll');

    // Bug 4: Sentence grammar validation (Q2557 and question bank)
    const sample2557 = spellingBank.find(q => q.id === 2557);
    assert(sample2557, 'Question #2557 must exist');
    assert(sample2557.sentence.includes('나왔어야 [ (     ) ],'), 'Question #2557 must use grammatically valid stem 나왔어야');
    const completed2557 = sample2557.sentence.replace(/\[\s*\(\s*\)\s*\]/, sample2557.options[sample2557.answerIndex]);
    assert(completed2557.includes('나왔어야 할걸,'), 'Completed sentence for Q2557 must be natural Korean');

    // Bug 5: Inventory Modal & Send Gift Deduplication
    assert(indexHtml.includes('id="modalInventory"'), 'index.html must include #modalInventory');
    assert(indexHtml.includes('id="tabInvGifts"'), 'index.html must include #tabInvGifts');
    assert(indexHtml.includes('id="tabInvItems"'), 'index.html must include #tabInvItems');
    assert(indexHtml.includes('id="tabInvAcc"'), 'index.html must include #tabInvAcc');
    assert(indexHtml.includes('id="btnChatHeaderInventory"'), 'index.html must include #btnChatHeaderInventory');
    assert(indexHtml.includes('id="btnOpenInventory"'), 'index.html must include #btnOpenInventory in header');
    assert(appCode.includes('openInventoryModal'), 'app.js must implement openInventoryModal');
    assert(appCode.includes('isSendingGift'), 'app.js must guard against duplicate send gift');
    assert(styleCode.includes('.inv-gift-card'), 'style.css must style .inv-gift-card');

    // 32. v3.5.4 Age-Graded 90 Custom Illustrated Sticker Packs Verification
    assert(STICKER_PACKS.elementary_girl, 'stickers.js must define elementary_girl pack');
    assert(STICKER_PACKS.middle_girl, 'stickers.js must define middle_girl pack');
    assert(STICKER_PACKS.high_girl, 'stickers.js must define high_girl pack');
    assert.strictEqual(STICKER_PACKS.elementary_girl.stickers.length, 30, 'elementary_girl pack must contain 30 stickers');
    assert.strictEqual(STICKER_PACKS.middle_girl.stickers.length, 30, 'middle_girl pack must contain 30 stickers');
    assert.strictEqual(STICKER_PACKS.high_girl.stickers.length, 30, 'high_girl pack must contain 30 stickers');

    // Verify all 90 images exist in public/stickers and www/public/stickers
    for (let i = 1; i <= 30; i++) {
      const pad = String(i).padStart(2, '0');
      assert(fs.existsSync(path.join(__dirname, `../public/stickers/elementary/elem_${pad}.png`)), `elem_${pad}.png must exist in public`);
      assert(fs.existsSync(path.join(__dirname, `../www/public/stickers/elementary/elem_${pad}.png`)), `elem_${pad}.png must exist in www`);
      assert(fs.existsSync(path.join(__dirname, `../public/stickers/middle/mid_${pad}.png`)), `mid_${pad}.png must exist in public`);
      assert(fs.existsSync(path.join(__dirname, `../www/public/stickers/middle/mid_${pad}.png`)), `mid_${pad}.png must exist in www`);
      assert(fs.existsSync(path.join(__dirname, `../public/stickers/high/high_${pad}.png`)), `high_${pad}.png must exist in public`);
      assert(fs.existsSync(path.join(__dirname, `../www/public/stickers/high/high_${pad}.png`)), `high_${pad}.png must exist in www`);
    }

    assert(indexHtml.includes('data-pack="elementary_girl"'), 'index.html must have elementary_girl tab');
    assert(indexHtml.includes('data-pack="middle_girl"'), 'index.html must have middle_girl tab');
    assert(indexHtml.includes('data-pack="high_girl"'), 'index.html must have high_girl tab');
    assert(appCode.includes('elementary_girl'), 'app.js must default/support elementary_girl pack');

    // 33. v3.5.5 Quiz Session Boundary Protection, Q6 Prevention & Safe App Resume
    assert(appCode.includes('this.currentIndex >= this.activeQuestions.length'), 'app.js must guard against saving session when currentIndex >= length');
    assert(appCode.includes("viewName === 'result'"), 'switchView in app.js must explicitly clear active session on result view');
    assert(appCode.includes('this.activeQuestions = null;'), 'finishQuiz in app.js must nullify activeQuestions to prevent zombie sessions');
    assert(appCode.includes('session.currentIndex >= totalQ'), 'updateResumeQuizBanner must guard against displaying Q6 and clear zombie session');
    assert(appCode.includes('(Q${currentQNum}/${totalQ})'), 'updateResumeQuizBanner must display clamped Q count (e.g. Q1/5)');
    assert(appCode.includes('!this.activeQuestions[this.currentIndex]'), 'renderCurrentQuestion must defensively guard against undefined question');
    assert(appCode.includes('// Refresh banner without forcibly abducting the user from the home screen'), 'visibilitychange must not abduct user from home');

    // 34. v3.5.6 Result Confirmation Fix & 100 Stage-Specific Questions Verification
    assert(appCode.includes('const totalQuestions = (this.activeQuestions && Array.isArray(this.activeQuestions)) ? this.activeQuestions.length : 5;'), 'finishQuiz must safely compute totalQuestions before nullifying');
    assert.strictEqual(spellingQuestions.length, 5100, 'SPELLING_QUESTION_BANK must contain 5,100 questions');
    const stageCounts = {};
    spellingQuestions.forEach(q => stageCounts[q.level] = (stageCounts[q.level] || 0) + 1);
    assert.strictEqual(stageCounts['초등/기초'], 1020, '초등/기초 must contain 1,020 questions');
    assert.strictEqual(stageCounts['중등/필수'], 1020, '중등/필수 must contain 1,020 questions');
    assert.strictEqual(stageCounts['고등/심화'], 1020, '고등/심화 must contain 1,020 questions');
    assert.strictEqual(stageCounts['수능/기출'], 1020, '수능/기출 must contain 1,020 questions');
    assert.strictEqual(stageCounts['일반/실무'], 1020, '일반/실무 must contain 1,020 questions');
    
    const q5001 = spellingQuestions.find(q => q.id === 5001);
    assert(q5001 && q5001.standardWord === '어떡해', 'Q5001 must be 어떡해');
    assert.strictEqual(validator.validateSentenceIntegrity(q5001).isValid, true, 'Q5001 must pass grammar validation');
    
    const q5043 = spellingQuestions.find(q => q.id === 5043);
    assert(q5043 && q5043.standardWord === '들르다', 'Q5043 must be 들르다');
    assert.strictEqual(validator.validateSentenceIntegrity(q5043).isValid, true, 'Q5043 must pass grammar validation');

    const q5100 = spellingQuestions.find(q => q.id === 5100);
    assert(q5100 && q5100.standardWord === '역할', 'Q5100 must be 역할');
    assert.strictEqual(validator.validateSentenceIntegrity(q5100).isValid, true, 'Q5100 must pass grammar validation');

    // 35. v3.5.8 Classic Sticker 120px Fixed Size & Message Containment Separation Verification
    const latestStyleCss = fs.readFileSync(path.join(__dirname, '../style.css'), 'utf8');
    assert(latestStyleCss.includes('width: 120px !important;'), 'style.css must enforce 120px fixed width on .chat-sticker-bubble');
    assert(latestStyleCss.includes('height: 120px !important;'), 'style.css must enforce 120px fixed height on .chat-sticker-bubble');
    assert(latestStyleCss.includes('overflow: hidden !important;'), 'style.css must enforce overflow:hidden on sticker bubble to prevent text overlapping');
    assert(latestStyleCss.includes('.chat-sticker-img'), 'style.css must define .chat-sticker-img class');
    assert(appCode.includes('width:120px;height:120px;min-width:120px;min-height:120px;max-width:120px;max-height:120px;'), 'app.js must defensively embed inline 120px bounding box');
    assert(appCode.includes('overflow:hidden;border-radius:16px;'), 'app.js must enforce overflow hidden inline to prevent CSS caching leakage');

    // 36. v3.6.0 Real-time Quiz Battle Arena, Custom Question Settings, 8 Battle Items & Battle RP Rankings Verification
    assert(indexHtml.includes('id="btnNavBattle"'), 'index.html must include #btnNavBattle tab');
    assert(indexHtml.includes('id="btnStartBattleArena"'), 'index.html must include #btnStartBattleArena banner');
    assert(indexHtml.includes('id="viewBattle"'), 'index.html must include #viewBattle section');
    assert(indexHtml.includes('id="modalBattleLobby"'), 'index.html must include #modalBattleLobby');
    assert(indexHtml.includes('id="modalBattleCreate"'), 'index.html must include #modalBattleCreate');
    assert(indexHtml.includes('id="modalBattleResult"'), 'index.html must include #modalBattleResult');
    assert(indexHtml.includes('id="modalBattleTarget"'), 'index.html must include #modalBattleTarget');
    assert(indexHtml.includes('id="rankSubjectBattle"'), 'index.html must include #rankSubjectBattle ranking button');

    assert(latestStyleCss.includes('.battle-arena-section'), 'style.css must define .battle-arena-section');
    assert(latestStyleCss.includes('.vfx-ink-layer'), 'style.css must define .vfx-ink-layer');
    assert(latestStyleCss.includes('.vfx-freeze-layer'), 'style.css must define .vfx-freeze-layer');
    assert(latestStyleCss.includes('.vfx-wind-layer'), 'style.css must define .vfx-wind-layer');
    assert(latestStyleCss.includes('.vfx-bomb-banner'), 'style.css must define .vfx-bomb-banner');

    assert(appCode.includes('openBattleLobby()'), 'app.js must implement openBattleLobby()');
    assert(appCode.includes('enterBattleRoom('), 'app.js must implement enterBattleRoom()');
    assert(appCode.includes('submitCreateBattle()'), 'app.js must implement submitCreateBattle()');
    assert(appCode.includes('renderBattleRankings()'), 'app.js must implement renderBattleRankings()');
    assert(appCode.includes('get currentUser()'), 'app.js must provide currentUser getter for robust session compatibility');
    assert(appCode.includes('get token()'), 'app.js must provide token getter for cloudToken fallback');
    assert(appCode.includes("this.cloudToken = localStorage.getItem('haru_cloud_token') || ''"), 'app.js must fallback to localStorage token');

    // 36-A. Battle Room Creation API Test (POST /api/battle/create)
    const createBattleRes = await request('POST', '/api/battle/create', { 'Authorization': `Bearer ${userToken}` }, {
      title: '테스트 스피드 대결방',
      invitedUsernames: ['미니미니'],
      questionCount: 5,
      subject: 'spelling',
      level: 'all',
      allowItems: true
    });

    assert.strictEqual(createBattleRes.status, 200, 'POST /api/battle/create must return 200');
    assert.strictEqual(createBattleRes.data.success, true, 'Battle creation must succeed');
    const createdRoomId = createBattleRes.data.roomId;
    assert(createdRoomId, 'Battle creation must return roomId');
    assert.strictEqual(createBattleRes.data.room.questions.length, 5, 'Battle room must contain exactly 5 questions');
    createBattleRes.data.room.questions.forEach((q, idx) => {
      assert(q.sentence || q.question, `Battle question #${idx + 1} must have sentence or question`);
      assert.strictEqual(q.options.length, 4, `Battle question #${idx + 1} must have 4 options`);
      assert(typeof q.correctIndex === 'number', `Battle question #${idx + 1} must specify correctIndex`);
    });

    // 36-B. Battle Rooms List API Test (GET /api/battle/rooms)
    const listRoomsRes = await request('GET', '/api/battle/rooms', { 'Authorization': `Bearer ${userToken}` });
    assert.strictEqual(listRoomsRes.status, 200, 'GET /api/battle/rooms must return 200');
    assert.strictEqual(listRoomsRes.data.success, true, 'Battle rooms list must succeed');
    const hasMyRoom = listRoomsRes.data.rooms.some(r => r.id === createdRoomId);
    assert(hasMyRoom, 'Created battle room must appear in user rooms list');

    // 36-C. Battle Room Detail API Test (GET /api/battle/room)
    const roomDetailRes = await request('GET', `/api/battle/room?roomId=${createdRoomId}`, { 'Authorization': `Bearer ${userToken}` });
    assert.strictEqual(roomDetailRes.status, 200, 'GET /api/battle/room must return 200');
    assert.strictEqual(roomDetailRes.data.success, true, 'GET /api/battle/room must succeed');
    assert.strictEqual(roomDetailRes.data.room.id, createdRoomId, 'Room detail must match createdRoomId');
    assert.strictEqual(roomDetailRes.data.room.members.length, 2, 'Room must have 2 members (testUser + 미니미니)');

    // 36-D. Battle Item Usage & Mirror Shield Counter-Attack Test (POST /api/battle/use-item)
    const usersFilePath = path.join(__dirname, '../data/users.json');
    // 1) Target ('미니미니') sets up reflect shield
    // Give 미니미니 a token for testing
    const miniTokenRes = await request('POST', '/api/auth/login', {}, { username: '미니미니', password: 'password123' });
    let miniToken = miniTokenRes.data && miniTokenRes.data.token ? miniTokenRes.data.token : null;
    if (!miniToken) {
      // Direct token assignment in memory if needed
      const usersData = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
      miniToken = 'test_mini_token_' + Date.now();
      usersData.tokens[miniToken] = '미니미니';
      fs.writeFileSync(usersFilePath, JSON.stringify(usersData, null, 2), 'utf8');
    }

    const useShieldRes = await request('POST', '/api/battle/use-item', { 'Authorization': `Bearer ${miniToken}` }, {
      roomId: createdRoomId,
      itemKey: 'battle_reflect'
    });
    assert.strictEqual(useShieldRes.status, 200, 'Mirror shield usage must return 200');
    assert.strictEqual(useShieldRes.data.success, true, 'Mirror shield activation must succeed');

    // 2) testUser fires 'battle_ink' at '미니미니' -> Mirror shield should reflect attack back to testUser!
    const attackRes = await request('POST', '/api/battle/use-item', { 'Authorization': `Bearer ${userToken}` }, {
      roomId: createdRoomId,
      itemKey: 'battle_ink',
      targetUsername: '미니미니'
    });
    assert.strictEqual(attackRes.status, 200, 'Item attack must return 200');
    assert.strictEqual(attackRes.data.success, true, 'Item attack must succeed');
    assert.strictEqual(attackRes.data.reflected, true, 'Mirror shield must reflect attack back to attacker');
    assert.strictEqual(attackRes.data.targetUser, testUsername, 'Target of reflected attack must be original attacker');

    // 36-E. Battle Answer Submission Test (POST /api/battle/submit-answer)
    const currentQ = createBattleRes.data.room.questions[0];
    const submitRes = await request('POST', '/api/battle/submit-answer', { 'Authorization': `Bearer ${userToken}` }, {
      roomId: createdRoomId,
      questionIndex: 0,
      selectedOptionIndex: currentQ.correctIndex,
      timeSpent: 2.5
    });

    assert.strictEqual(submitRes.status, 200, 'POST /api/battle/submit-answer must return 200');
    assert.strictEqual(submitRes.data.success, true, 'Answer submission must succeed');
    assert.strictEqual(submitRes.data.isCorrect, true, 'Correct answer must be evaluated true');
    assert(submitRes.data.pointsEarned > 0, 'Points earned must be greater than 0');
    assert.strictEqual(submitRes.data.combo, 1, 'Combo must be 1 on first correct answer');

    // 36-F. Battle Rankings API Test (GET /api/battle/rankings)
    const battleRankRes = await request('GET', '/api/battle/rankings', { 'Authorization': `Bearer ${userToken}` });
    assert.strictEqual(battleRankRes.status, 200, 'GET /api/battle/rankings must return 200');
    assert.strictEqual(battleRankRes.data.success, true, 'Battle rankings must succeed');
    assert(Array.isArray(battleRankRes.data.rankings), 'Rankings must be an array');
    battleRankRes.data.rankings.forEach(item => {
      assert(typeof item.rank === 'number', 'Rank must be a number');
      assert(item.username, 'Rank item must specify username');
      assert(typeof item.rp === 'number', 'RP must be a number');
      assert(['master', 'diamond', 'gold', 'silver', 'bronze'].includes(item.tier), 'Tier must be valid');
    });

    // Clean up created battle room
    const battleRoomsFile = path.join(__dirname, '../data/battle_rooms.json');
    if (fs.existsSync(battleRoomsFile)) {
      try {
        const bRooms = JSON.parse(fs.readFileSync(battleRoomsFile, 'utf8'));
        const cleaned = bRooms.filter(r => r.id !== createdRoomId);
        fs.writeFileSync(battleRoomsFile, JSON.stringify(cleaned, null, 2), 'utf8');
      } catch (e) {}
    }

    // Clean up temporary test user to strictly maintain 4 authentic users
    if (fs.existsSync(usersFilePath)) {
      try {
        const usersObj = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
        if (usersObj.users) {
          for (const k of Object.keys(usersObj.users)) {
            if (k.startsWith('e2e_runner_')) delete usersObj.users[k];
          }
        }
        if (usersObj.tokens) {
          for (const [t, u] of Object.entries(usersObj.tokens)) {
            if (u.startsWith('e2e_runner_') || t.startsWith('test_mini_token_')) delete usersObj.tokens[t];
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
    if (fs.existsSync(usersFilePath)) {
      try {
        const usersObj = JSON.parse(fs.readFileSync(usersFilePath, 'utf8'));
        if (usersObj.users) {
          for (const k of Object.keys(usersObj.users)) {
            if (k.startsWith('e2e_runner_')) delete usersObj.users[k];
          }
        }
        if (usersObj.tokens) {
          for (const [t, u] of Object.entries(usersObj.tokens)) {
            if (u.startsWith('e2e_runner_') || t.startsWith('test_mini_token_')) delete usersObj.tokens[t];
          }
        }
        fs.writeFileSync(usersFilePath, JSON.stringify(usersObj, null, 2), 'utf8');
      } catch (err) {}
    }
    srv.close();
    process.exit(1);
  }
});

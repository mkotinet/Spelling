/**
 * 하루맞춤 (Haru Matchum) - Backend Server
 * Node.js Static Server & Simple Auth/Sync API & Git Auto-Sync
 */

const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");
const zlib = require("zlib");
const { execSync } = require("child_process");

const PORT = process.env.PORT || 80;
const PERSISTENT_DIR = "/app/data";
const DATA_DIR = (fs.existsSync(PERSISTENT_DIR) && process.env.NODE_ENV !== "test") ? PERSISTENT_DIR : path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "users.json");
const LOGS_FILE = path.join(DATA_DIR, "access_logs.json");
const MESSAGES_FILE = path.join(DATA_DIR, "messages.json");
const PHOTOS_DIR = path.join(DATA_DIR, "uploads", "photos");
const VAPID_FILE = path.join(DATA_DIR, "vapid_keys.json");
const PUSH_SUBS_FILE = path.join(DATA_DIR, "push_subscriptions.json");
const GROUPS_FILE = path.join(DATA_DIR, "groups.json");
const BATTLE_ROOMS_FILE = path.join(DATA_DIR, "battle_rooms.json");
const PHOTO_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours (1 day) automatic deletion

// Web Push Module & VAPID Setup (v2.9.14)
let webpush = null;
try {
  webpush = require(path.join(__dirname, "vendor", "node_modules", "web-push"));
} catch (e1) {
  try {
    webpush = require("web-push");
  } catch (e2) {
    console.warn("[Web Push] web-push module not available:", e2.message);
  }
}

let vapidKeys = null;
if (fs.existsSync(VAPID_FILE)) {
  try {
    vapidKeys = JSON.parse(fs.readFileSync(VAPID_FILE, "utf8"));
  } catch (e) {}
}
if (!vapidKeys && webpush) {
  try {
    vapidKeys = webpush.generateVAPIDKeys();
    fs.writeFileSync(VAPID_FILE, JSON.stringify(vapidKeys, null, 2), "utf8");
    console.log("[Web Push] Generated fresh VAPID keys saved to", VAPID_FILE);
  } catch (e) {
    console.error("[Web Push] Failed to generate VAPID keys:", e);
  }
}
if (webpush && vapidKeys) {
  try {
    webpush.setVapidDetails(
      "mailto:admin@danminlove.com",
      vapidKeys.publicKey,
      vapidKeys.privateKey
    );
    console.log("[Web Push] VAPID details configured successfully.");
  } catch (e) {
    console.error("[Web Push] Failed to set VAPID details:", e);
  }
}

// Ensure data and photo directories exist
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}
if (!fs.existsSync(PHOTOS_DIR)) {
  fs.mkdirSync(PHOTOS_DIR, { recursive: true });
}

// Initial bootstrap if running in container persistent volume mode
if (DATA_DIR === PERSISTENT_DIR) {
  const fallbackDir = path.join(__dirname, "data");
  if (fs.existsSync(fallbackDir)) {
    const srcUsers = path.join(fallbackDir, "users.json");
    const targetUsers = path.join(DATA_DIR, "users.json");
    if (!fs.existsSync(targetUsers) && fs.existsSync(srcUsers)) {
      try {
        fs.copyFileSync(srcUsers, targetUsers);
        console.log("[Persistence] Bootstrapped users.json into /app/data");
      } catch (e) {
        console.error("Failed to bootstrap users.json:", e);
      }
    }
    const srcLogs = path.join(fallbackDir, "access_logs.json");
    const targetLogs = path.join(DATA_DIR, "access_logs.json");
    if (!fs.existsSync(targetLogs) && fs.existsSync(srcLogs)) {
      try {
        fs.copyFileSync(srcLogs, targetLogs);
        console.log("[Persistence] Bootstrapped access_logs.json into /app/data");
      } catch (e) {
        console.error("Failed to bootstrap access_logs.json:", e);
      }
    }
    const srcMessages = path.join(fallbackDir, "messages.json");
    const targetMessages = path.join(DATA_DIR, "messages.json");
    if (!fs.existsSync(targetMessages) && fs.existsSync(srcMessages)) {
      try {
        fs.copyFileSync(srcMessages, targetMessages);
        console.log("[Persistence] Bootstrapped messages.json into /app/data");
      } catch (e) {}
    }
    const srcVapid = path.join(fallbackDir, "vapid_keys.json");
    const targetVapid = path.join(DATA_DIR, "vapid_keys.json");
    if (!fs.existsSync(targetVapid) && fs.existsSync(srcVapid)) {
      try {
        fs.copyFileSync(srcVapid, targetVapid);
        console.log("[Persistence] Bootstrapped vapid_keys.json into /app/data");
      } catch (e) {}
    }
  }
}

// Self-Healing helper for authentic users (Rule 6)
function ensureUserIntegrity(db) {
  if (!db || !db.users) return false;
  let changed = false;

  // If user 미니미니채 exists and has empty avatarAccessories, restore cute costume set
  const m = db.users["미니미니채"];
  if (m) {
    const acc = m.avatarAccessories || {};
    const hasValidAcc = Object.values(acc).some(v => v !== null && v !== undefined && v !== 'eyes');
    if (!hasValidAcc) {
      m.avatarAccessories = {
        pin: "pin_clover_mini",
        hat: "hat_straw",
        outfit: "outfit_strawberry_milk_pajama",
        shoes: "shoes_rabbit_slippers",
        pet: "pet_bunny"
      };
      const inv = new Set([
        ...(m.inventoryAccessories || []),
        "pin_clover_mini", "hat_straw", "outfit_strawberry_milk_pajama", "shoes_rabbit_slippers", "pet_bunny"
      ]);
      m.inventoryAccessories = Array.from(inv);
      changed = true;
    }
  }

  return changed;
}

// In-memory / JSON Database helper
function loadDB() {
  try {
    if (fs.existsSync(DB_FILE)) {
      const db = JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
      if (ensureUserIntegrity(db)) {
        saveDB(db);
      }
      return db;
    }
  } catch (e) {
    console.error("DB Load Error:", e);
  }
  return { users: {}, tokens: {} };
}

function saveDB(db) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2), "utf8");
  } catch (e) {
    console.error("DB Save Error:", e);
  }
}

// Access Logs helper (Max 1,000 entries rotation)
function loadLogs() {
  try {
    if (fs.existsSync(LOGS_FILE)) {
      return JSON.parse(fs.readFileSync(LOGS_FILE, "utf8"));
    }
  } catch (e) {
    console.error("Logs Load Error:", e);
  }
  return [];
}

function saveLogs(logs) {
  try {
    const trimmed = logs.slice(-1000);
    fs.writeFileSync(LOGS_FILE, JSON.stringify(trimmed, null, 2), "utf8");
  } catch (e) {
    console.error("Logs Save Error:", e);
  }
}

// User-to-User Messages helper (Max 1,000 entries rotation)
function loadMessages() {
  try {
    if (fs.existsSync(MESSAGES_FILE)) {
      return JSON.parse(fs.readFileSync(MESSAGES_FILE, "utf8"));
    }
  } catch (e) {
    console.error("Messages Load Error:", e);
  }
  return [];
}

function saveMessages(messages) {
  try {
    const trimmed = (messages || []).slice(-1000);
    fs.writeFileSync(MESSAGES_FILE, JSON.stringify(trimmed, null, 2), "utf8");
  } catch (e) {
    console.error("Messages Save Error:", e);
  }
}

// Group Chat Rooms Helper (v3.5.0 Multi-User Group Chats)
function loadGroups() {
  try {
    if (fs.existsSync(GROUPS_FILE)) {
      return JSON.parse(fs.readFileSync(GROUPS_FILE, "utf8")) || [];
    }
  } catch (e) {
    console.error("Groups Load Error:", e);
  }
  return [];
}

function saveGroups(groups) {
  try {
    fs.writeFileSync(GROUPS_FILE, JSON.stringify(groups || [], null, 2), "utf8");
  } catch (e) {
    console.error("Groups Save Error:", e);
  }
}

// ⚔️ v3.6.0 퀴즈대결방 (Battle Arena) 데이터 입출력 및 전용 아이템/문제 엔진
function loadBattleRooms() {
  try {
    if (fs.existsSync(BATTLE_ROOMS_FILE)) {
      return JSON.parse(fs.readFileSync(BATTLE_ROOMS_FILE, "utf8")) || [];
    }
  } catch (e) {
    console.error("Battle Rooms Load Error:", e);
  }
  return [];
}

function saveBattleRooms(rooms) {
  try {
    fs.writeFileSync(BATTLE_ROOMS_FILE, JSON.stringify(rooms || [], null, 2), "utf8");
  } catch (e) {
    console.error("Battle Rooms Save Error:", e);
  }
}

// ⚔️ 퀴즈대결방 전용 신규 아이템 (직관적 한글 명칭 개편)
const BATTLE_ITEMS = {
  battle_hint: {
    id: "battle_hint",
    name: "오답 지우개",
    icon: "💡",
    type: "buff",
    desc: "다음 문제에서 오답 보기 1개를 즉시 지워줍니다!"
  },
  battle_double: {
    id: "battle_double",
    name: "점수 2배 보석",
    icon: "💎",
    type: "buff",
    desc: "다음 문제 정답 시 획득 점수가 2배로 증가합니다!"
  },
  battle_freeze: {
    id: "battle_freeze",
    name: "꽁꽁 얼음",
    icon: "❄️",
    type: "attack",
    duration: 3000,
    desc: "상대방의 화면을 3초간 얼려 정답 터치를 지연시킵니다!"
  },
  battle_ink: {
    id: "battle_ink",
    name: "먹물 구름",
    icon: "墨",
    type: "attack",
    duration: 3500, // 3.5초
    desc: "선택한 상대방의 보기를 3.5초간 검은 먹물로 가립니다!"
  },
  battle_wind: {
    id: "battle_wind",
    name: "휘몰이 바람",
    icon: "🌪️",
    type: "attack",
    duration: 4000,
    desc: "상대방의 선택지 순서를 마구 뒤섞어 혼란을 줍니다!"
  },
  battle_reflect: {
    id: "battle_reflect",
    name: "반사 방패",
    icon: "🛡️",
    type: "defense",
    desc: "나에게 들어오는 다음 공격 아이템을 튕겨내 상대방에게 역공합니다!"
  },
  battle_steal: {
    id: "battle_steal",
    name: "점수 뺏기 번개",
    icon: "⚡",
    type: "attack",
    desc: "내가 정답을 맞혔을 때 1위 상대방의 점수 25점을 내 점수로 뺏어옵니다!"
  },
  battle_lightning: {
    id: "battle_lightning",
    name: "점수 뺏기 번개",
    icon: "⚡",
    type: "attack",
    desc: "내가 정답을 맞혔을 때 1위 상대방의 점수 25점을 내 점수로 뺏어옵니다!"
  },
  battle_peek: {
    id: "battle_peek",
    name: "정답 엿보기",
    icon: "👁️",
    type: "support",
    duration: 3000,
    desc: "1위 라이벌이 선택한 보기를 3초간 몰래 훔쳐봅니다!"
  },
  battle_sight: {
    id: "battle_sight",
    name: "정답 엿보기",
    icon: "👁️",
    type: "support",
    duration: 3000,
    desc: "1위 라이벌이 선택한 보기를 3초간 몰래 훔쳐봅니다!"
  },
  battle_bomb: {
    id: "battle_bomb",
    name: "째깍 시한폭탄",
    icon: "💣",
    type: "attack",
    duration: 6000,
    desc: "상대에게 폭탄 투척! 6초 안에 맞히지 못하면 폭발(-30점)!"
  },
  battle_rainbow: {
    id: "battle_rainbow",
    name: "무조건 정답 무지개",
    icon: "🌈",
    type: "buff",
    desc: "오답을 선택해도 1회 무조건 정답으로 인정해줍니다!"
  }
};

let BATTLE_BANKS_CACHE = null;
function getBattleQuestionBanks() {
  if (!BATTLE_BANKS_CACHE) {
    try {
      BATTLE_BANKS_CACHE = {
        spelling: require(path.join(__dirname, "questions.js")).SPELLING_QUESTION_BANK || [],
        idiom: require(path.join(__dirname, "idiom_questions.js")).IDIOM_QUESTION_BANK || [],
        hanja: require(path.join(__dirname, "hanja_questions.js")).HANJA_QUESTION_BANK || [],
        english: require(path.join(__dirname, "english_questions.js")).ENGLISH_QUESTION_BANK || []
      };
    } catch (e) {
      console.error("Failed to load question banks for battle:", e);
      BATTLE_BANKS_CACHE = { spelling: [], idiom: [], hanja: [], english: [] };
    }
  }
  return BATTLE_BANKS_CACHE;
}

// ⚔️ 퀴즈대결 공통 문제 세트 추출기 (과목, 난이도, 문항 수 기반 & Fisher-Yates 셔플 - Rule 8 준수)
function generateBattleQuestions(subject, level, count) {
  const banks = getBattleQuestionBanks();
  let candidatePool = [];

  const safeCount = Math.max(3, Math.min(count || 5, 20));

  if (subject === 'mixed' || !subject) {
    candidatePool = [
      ...banks.spelling.map(q => ({ ...q, subject: 'spelling', subjectName: '우리말 맞춤법' })),
      ...banks.idiom.map(q => ({ ...q, subject: 'idiom', subjectName: '속담·관용구' })),
      ...banks.hanja.map(q => ({ ...q, subject: 'hanja', subjectName: '한자·고사성어' })),
      ...banks.english.map(q => ({ ...q, subject: 'english', subjectName: '영어 스펠링' }))
    ];
  } else if (banks[subject]) {
    const sName = subject === 'spelling' ? '우리말 맞춤법' : (subject === 'idiom' ? '속담·관용구' : (subject === 'hanja' ? '한자·고사성어' : '영어 스펠링'));
    candidatePool = banks[subject].map(q => ({ ...q, subject, subjectName: sName }));
  } else {
    candidatePool = banks.spelling.map(q => ({ ...q, subject: 'spelling', subjectName: '우리말 맞춤법' }));
  }

  // 난이도 필터링
  if (level && level !== 'all') {
    const filtered = candidatePool.filter(q => q.level === level);
    if (filtered.length >= safeCount) {
      candidatePool = filtered;
    }
  }

  // 무작위 셔플 후 safeCount개 추출
  const shuffled = candidatePool.slice().sort(() => Math.random() - 0.5);
  const selected = shuffled.slice(0, safeCount);

  // 각 문제별 선택지 셔플 및 answerIndex 동적 재매핑
  return selected.map((q, idx) => {
    const origOptions = Array.isArray(q.options) ? q.options.slice() : ['보기1', '보기2', '보기3', '보기4'];
    const correctAns = origOptions[q.answerIndex !== undefined ? q.answerIndex : 0];

    for (let i = origOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [origOptions[i], origOptions[j]] = [origOptions[j], origOptions[i]];
    }
    const newAnswerIndex = origOptions.indexOf(correctAns);

    return {
      index: idx,
      id: q.id,
      subject: q.subject || 'spelling',
      subjectName: q.subjectName || '우리말 맞춤법',
      level: q.level || '초등/기초',
      question: q.question || '알맞은 것을 고르세요.',
      sentence: q.sentence || '',
      sentenceTranslation: q.sentenceTranslation || '',
      options: origOptions,
      answerIndex: newAnswerIndex >= 0 ? newAnswerIndex : 0,
      correctIndex: newAnswerIndex >= 0 ? newAnswerIndex : 0,
      explanation: q.explanation || '',
      standardWord: q.standardWord || q.idiomWord || q.hanjaWord || q.englishWord || ''
    };
  });
}

// ⚔️ 퀴즈대결 완료 및 승패/RP/티어 종합 집계 엔진 (1:1, 다자간 개인전, 2:2 팀전 지원)
function finalizeBattleRoom(room, db) {
  if (!room || room.status === 'completed') return;
  room.status = 'completed';
  room.completedAt = new Date().toISOString();

  const matchType = room.matchType || (room.settings && room.settings.matchType) || '1v1';

  if (matchType === '2v2' && room.teams) {
    // 2:2 팀전 승패 판정
    const teamA = room.teams.A || [];
    const teamB = room.teams.B || [];
    const scoreA = teamA.reduce((sum, u) => sum + ((room.progress && room.progress[u] && room.progress[u].score) || 0), 0);
    const scoreB = teamB.reduce((sum, u) => sum + ((room.progress && room.progress[u] && room.progress[u].score) || 0), 0);
    room.teamScores = { A: scoreA, B: scoreB };

    const winTeam = scoreA > scoreB ? 'A' : (scoreB > scoreA ? 'B' : 'draw');
    room.winningTeam = winTeam;
    room.winner = winTeam === 'A' ? teamA[0] : (winTeam === 'B' ? teamB[0] : null);
    room.winnerName = winTeam === 'A' ? '블루팀' : (winTeam === 'B' ? '레드팀' : '무승부');

    if (db && db.users) {
      room.members.forEach(m => {
        const u = db.users[m];
        if (u) {
          u.battleStats = u.battleStats || { rp: 1000, games: 0, wins: 0, losses: 0, winRate: 0, streak: 0, maxStreak: 0, tier: 'silver' };
          u.battleStats.games = (u.battleStats.games || 0) + 1;
          const myTeam = teamA.includes(m) ? 'A' : (teamB.includes(m) ? 'B' : null);
          const isWin = (myTeam && myTeam === winTeam);
          if (isWin) {
            u.battleStats.wins = (u.battleStats.wins || 0) + 1;
            u.battleStats.streak = (u.battleStats.streak || 0) + 1;
            u.battleStats.maxStreak = Math.max(u.battleStats.maxStreak || 0, u.battleStats.streak);
            const streakBonus = Math.min(15, (u.battleStats.streak - 1) * 3);
            u.battleStats.rp = (u.battleStats.rp || 1000) + 30 + streakBonus;
          } else if (winTeam === 'draw') {
            u.battleStats.rp = (u.battleStats.rp || 1000) + 5;
          } else {
            u.battleStats.losses = (u.battleStats.losses || 0) + 1;
            u.battleStats.streak = 0;
            u.battleStats.rp = Math.max(500, (u.battleStats.rp || 1000) - 15);
          }
          const rp = u.battleStats.rp;
          if (rp >= 1800) u.battleStats.tier = 'master';
          else if (rp >= 1500) u.battleStats.tier = 'diamond';
          else if (rp >= 1200) u.battleStats.tier = 'gold';
          else if (rp >= 1000) u.battleStats.tier = 'silver';
          else u.battleStats.tier = 'bronze';
          u.battleStats.winRate = Math.round((u.battleStats.wins / u.battleStats.games) * 100);
        }
      });
      saveDB(db);
    }
  } else {
    // 1:1, 1:1:1, 1:1:1:1 개인전 승패 판정
    const rankList = room.members.map(m => ({
      username: m,
      score: (room.progress && room.progress[m] && room.progress[m].score) || 0,
      totalTime: (room.progress && room.progress[m] && room.progress[m].totalTime) || 999
    })).sort((a, b) => (b.score - a.score) || (a.totalTime - b.totalTime));

    room.winner = rankList[0].username;
    room.winnerName = db && db.users && db.users[rankList[0].username] ? db.users[rankList[0].username].name : rankList[0].username;

    if (db && db.users) {
      rankList.forEach((entry, rIdx) => {
        const u = db.users[entry.username];
        if (u) {
          u.battleStats = u.battleStats || { rp: 1000, games: 0, wins: 0, losses: 0, winRate: 0, streak: 0, maxStreak: 0, tier: 'silver' };
          u.battleStats.games = (u.battleStats.games || 0) + 1;
          if (rIdx === 0) {
            u.battleStats.wins = (u.battleStats.wins || 0) + 1;
            u.battleStats.streak = (u.battleStats.streak || 0) + 1;
            u.battleStats.maxStreak = Math.max(u.battleStats.maxStreak || 0, u.battleStats.streak);
            const streakBonus = Math.min(15, (u.battleStats.streak - 1) * 3);
            u.battleStats.rp = (u.battleStats.rp || 1000) + 30 + streakBonus;
          } else if (rIdx === 1 && rankList.length >= 3) {
            u.battleStats.losses = (u.battleStats.losses || 0) + 1;
            u.battleStats.streak = 0;
            u.battleStats.rp = (u.battleStats.rp || 1000) + 10;
          } else {
            u.battleStats.losses = (u.battleStats.losses || 0) + 1;
            u.battleStats.streak = 0;
            u.battleStats.rp = Math.max(500, (u.battleStats.rp || 1000) - 15);
          }
          const rp = u.battleStats.rp;
          if (rp >= 1800) u.battleStats.tier = 'master';
          else if (rp >= 1500) u.battleStats.tier = 'diamond';
          else if (rp >= 1200) u.battleStats.tier = 'gold';
          else if (rp >= 1000) u.battleStats.tier = 'silver';
          else u.battleStats.tier = 'bronze';
          u.battleStats.winRate = Math.round((u.battleStats.wins / u.battleStats.games) * 100);
        }
      });
      saveDB(db);
    }
  }
}

// ⚔️ v3.7.0 AI 맞춤요정 자율 배틀 시뮬레이터 (동기화 대기실, 카운트다운, 라운드 풀이, 아이템 선택 지원)
function processAiMascotBot(room, db) {
  if (!room || room.status === 'completed') return false;
  if (!room.members || !room.members.includes('맞춤요정')) return false;

  const botProg = room.progress && room.progress['맞춤요정'];
  if (!botProg) return false;

  const totalQuestions = room.questionCount || (room.settings && room.settings.questionCount) || (room.questions && room.questions.length) || 5;
  const now = Date.now();
  let changed = false;

  // 1) 대기실 상태: AI 맞춤요정은 항상 준비 완료 상태 유지
  if (room.status === 'waiting') {
    room.readyStatus = room.readyStatus || {};
    if (!room.readyStatus['맞춤요정']) {
      room.readyStatus['맞춤요정'] = true;
      changed = true;
    }
    // 다른 참가자들도 모두 준비 완료되었는지 검사
    const allReady = room.members.every(m => room.readyStatus[m]);
    if (allReady && room.members.length >= 2) {
      room.status = 'countdown';
      room.countdownStartTime = now;
      room.currentQuestionIndex = 0;
      room.roundPhase = 'answering';
      room.phaseStartTime = now + 3200;
      room.readyStatus = {};
      changed = true;
    }
    return changed;
  }

  // 2) 카운트다운 상태: 3.2초 후 실제 문제 풀이 페이즈로 자동 전환
  if (room.status === 'countdown') {
    if (now - (room.countdownStartTime || now) >= 3200) {
      room.status = 'in_progress';
      room.roundPhase = 'answering';
      room.phaseStartTime = now;
      changed = true;
    }
    return changed;
  }

  // 3) 문제 풀이 페이즈: AI는 2.2초 ~ 3.2초 고민 후 답안 제출
  if (room.status === 'in_progress' && (room.roundPhase === 'answering' || !room.roundPhase)) {
    const curIdx = room.currentQuestionIndex || 0;
    room.roundSubmissions = room.roundSubmissions || {};
    room.roundSubmissions[curIdx] = room.roundSubmissions[curIdx] || {};

    if (!room.roundSubmissions[curIdx]['맞춤요정'] && curIdx < totalQuestions && room.questions && room.questions[curIdx]) {
      const elapsed = Math.max(now - (room.phaseStartTime || now), botProg.lastActionTime ? (now - botProg.lastActionTime) : 0);
      if (elapsed >= 2200) {
        const q = room.questions[curIdx];
        const isCorrect = Math.random() < 0.85;
        let selectedOptionIndex = q.answerIndex;
        if (!isCorrect) {
          const wrongIndices = [0, 1, 2, 3].filter(i => i !== q.answerIndex && i < (q.options ? q.options.length : 4));
          selectedOptionIndex = wrongIndices.length > 0 ? wrongIndices[Math.floor(Math.random() * wrongIndices.length)] : ((q.answerIndex + 1) % 4);
        }

        const thinkSec = Math.min(6, Math.max(1.8, +(elapsed / 1000).toFixed(1)));
        let points = 0;
        if (isCorrect) {
          points = 20;
          botProg.combo = (botProg.combo || 0) + 1;
          if (botProg.combo >= 5) points += 10;
          else if (botProg.combo >= 4) points += 6;
          else if (botProg.combo >= 3) points += 4;
          else if (botProg.combo >= 2) points += 2;
          if (thinkSec <= 3) points += 5; // 속도 보너스
        } else {
          botProg.combo = 0;
        }

        botProg.score = Math.max(0, (botProg.score || 0) + points);
        botProg.currentIndex = curIdx + 1;
        botProg.totalTime = (botProg.totalTime || 0) + thinkSec;
        botProg.answers = botProg.answers || [];
        botProg.answers.push({
          qIndex: curIdx,
          isCorrect,
          selectedOptionIndex,
          points,
          timeSpent: thinkSec
        });

        room.roundSubmissions[curIdx]['맞춤요정'] = {
          selectedIndex: selectedOptionIndex,
          isCorrect,
          timeSpent: thinkSec,
          points,
          submittedAt: now
        };

        // 전원 제출 완료 여부 검사
        const allSubmitted = room.members.every(m => room.roundSubmissions[curIdx] && room.roundSubmissions[curIdx][m]);
        if (allSubmitted) {
          room.roundPhase = 'round_result';
          room.roundResultTime = now;
          room.readyStatus = {};

          // 스피드 킹 보너스 (+5P)
          const roundSubs = room.roundSubmissions[curIdx];
          let fastestUser = null;
          let minTime = 999;
          Object.entries(roundSubs).forEach(([mName, s]) => {
            if (s.isCorrect && s.timeSpent < minTime) {
              minTime = s.timeSpent;
              fastestUser = mName;
            }
          });
          if (fastestUser && Object.keys(roundSubs).length > 1) {
            roundSubs[fastestUser].points += 5;
            roundSubs[fastestUser].speedBonus = true;
            if (room.progress[fastestUser]) {
              room.progress[fastestUser].score += 5;
            }
          }

          room.roundResults = room.roundResults || {};
          room.roundResults[curIdx] = {
            qIndex: curIdx,
            question: q,
            submissions: roundSubs,
            fastestUser,
            completedAt: now
          };

          if (curIdx >= totalQuestions - 1) {
            room.status = 'completed';
            finalizeBattleRoom(room, db);
          }
        }
        changed = true;
      }
    }
    return changed;
  }

  // 4) 1문제 결과 및 아이템 선택 페이즈: 1.5초 후 아이템 전략 예약 및 다음 문제 준비 완료
  if (room.status === 'in_progress' && (room.roundPhase === 'round_result' || room.roundPhase === 'item_select')) {
    const elapsedSinceResult = now - (room.roundResultTime || now);
    if (elapsedSinceResult >= 1500) {
      // 28% 확률로 다음 라운드 아이템 예약
      const allowItems = (room.allowItems !== undefined ? room.allowItems : (room.settings ? room.settings.allowItems : true));
      if (allowItems && botProg.inventory && !botProg.itemUsedThisRound && Math.random() < 0.28) {
        const availableItems = Object.keys(botProg.inventory).filter(k => botProg.inventory[k] > 0);
        if (availableItems.length > 0) {
          const itemToUse = availableItems[Math.floor(Math.random() * availableItems.length)];
          botProg.inventory[itemToUse]--;
          botProg.itemUsedThisRound = true;

          let target = null;
          if (room.matchType === '2v2' && room.teams) {
            const aiTeam = (room.teams.A && room.teams.A.includes('맞춤요정')) ? 'A' : 'B';
            const opposingTeam = aiTeam === 'A' ? 'B' : 'A';
            const opponents = room.teams[opposingTeam] || [];
            target = opponents[Math.floor(Math.random() * opponents.length)] || null;
          } else {
            const rivals = room.members.filter(m => m !== '맞춤요정');
            target = rivals.length > 0 ? rivals[Math.floor(Math.random() * rivals.length)] : null;
          }

          if (target) {
            room.nextRoundEffects = room.nextRoundEffects || {};
            room.nextRoundEffects[target] = room.nextRoundEffects[target] || [];
            room.nextRoundEffects[target].push({
              itemKey: itemToUse,
              name: BATTLE_ITEMS[itemToUse] ? BATTLE_ITEMS[itemToUse].name : itemToUse,
              from: '맞춤요정'
            });
          }
        }
      }

      // AI 준비 완료 토글
      room.readyStatus = room.readyStatus || {};
      room.readyStatus['맞춤요정'] = true;

      // 전원 준비 완료 시 다음 라운드 카운트다운 시작
      const allReady = room.members.every(m => room.readyStatus[m]);
      if (allReady) {
        const curIdx = room.currentQuestionIndex || 0;
        if (curIdx + 1 < totalQuestions) {
          room.currentQuestionIndex = curIdx + 1;
          room.status = 'countdown';
          room.countdownStartTime = now;
          room.roundPhase = 'answering';
          room.phaseStartTime = now + 3200;
          room.readyStatus = {};
          if (botProg) botProg.itemUsedThisRound = false;

          // 예약된 아이템 효과 적용
          if (room.nextRoundEffects) {
            Object.entries(room.nextRoundEffects).forEach(([target, effects]) => {
              if (room.progress[target]) {
                room.progress[target].activeEffects = room.progress[target].activeEffects || [];
                effects.forEach(eff => {
                  const itemDef = BATTLE_ITEMS[eff.itemKey];
                  room.progress[target].activeEffects.push({
                    type: eff.itemKey.replace('battle_', ''),
                    name: eff.name,
                    icon: itemDef ? itemDef.icon : '✨',
                    expireAt: now + 3200 + (itemDef && itemDef.duration ? itemDef.duration : 4000),
                    from: eff.from
                  });
                });
              }
            });
            room.nextRoundEffects = {};
          }
        } else {
          room.status = 'completed';
          finalizeBattleRoom(room, db);
        }
      }
      changed = true;
    }
    return changed;
  }

  return changed;
}

// 🎁 v3.3.0 & v3.4.0 Interactive Gift Catalog (Items & Korean Brand Parody Social Gifts)
const GIFT_CATALOG = {
  // 1. 인게임 필수 퀴즈 아이템 선물 (7종)
  gift_heart: { id: "gift_heart", name: "하트수호", icon: "💖", price: 100, itemKey: "heart", itemQty: 1, type: "item", category: "game", desc: "오답 시 소중한 하트를 지켜주는 수호석" },
  gift_eraser5050: { id: "gift_eraser5050", name: "50:50 요술봉", icon: "🪄", price: 150, itemKey: "eraser5050", itemQty: 1, type: "item", category: "game", desc: "오답 보기 2개를 뿅! 지워주는 요술봉" },
  gift_booster2x: { id: "gift_booster2x", name: "2배 로켓", icon: "🚀", price: 200, itemKey: "booster2x", itemQty: 1, type: "item", category: "game", desc: "이번 라운드 획득 포인트를 2배로 쑥쑥!" },
  gift_shield: { id: "gift_shield", name: "황금 방패", icon: "🛡️", price: 300, itemKey: "shield", itemQty: 1, type: "shield", category: "game", desc: "틀려도 연속 만점 스트릭을 안전하게 보호" },
  gift_clover: { id: "gift_clover", name: "클로버 패스", icon: "🍀", price: 250, itemKey: "clover", itemQty: 1, type: "item", category: "game", desc: "어려운 문제를 즉시 통과시켜 주는 패스권" },
  gift_timemachine: { id: "gift_timemachine", name: "타임머신 시계", icon: "⏳", price: 180, itemKey: "timemachine", itemQty: 1, type: "item", category: "game", desc: "고민할 시간을 넉넉하게 연장해주는 시계" },
  gift_magnet: { id: "gift_magnet", name: "정답 자석", icon: "🧲", price: 120, itemKey: "magnet", itemQty: 1, type: "item", category: "game", desc: "정답 보기를 자석처럼 강력하게 끌어당김" },
  
  // 2. 한국 주요 브랜드 패러디 선물: [☕ 카페 & 디저트]
  gift_twosome_cake: { id: "gift_twosome_cake", name: "투쌈플레이스 스초생", icon: "🍰", price: 90, bonusPoints: 45, type: "social", category: "cafe", desc: "초코볼이 톡톡 터지는 투쌈의 시그니처 케이크" },
  gift_starbox_americano: { id: "gift_starbox_americano", name: "스타밥스 별다방 아이스 아메리카노", icon: "☕", price: 50, bonusPoints: 25, type: "social", category: "cafe", desc: "출근·등교길 필수! 시원한 벤티 사이즈 아아" },
  gift_starbox_latte: { id: "gift_starbox_latte", name: "스타밥스 달콤 돌체라떼", icon: "🥛", price: 65, bonusPoints: 32, type: "social", category: "cafe", desc: "달콤하고 부드러운 전설의 돌체라떼" },
  gift_baskin_half: { id: "gift_baskin_half", name: "배씨네라빈스 하프갤런 6가지맛", icon: "🍨", price: 120, bonusPoints: 60, type: "social", category: "cafe", desc: "민초단도 인정하는 6가지맛 골라담기 대용량 아이스크림" },
  gift_paris_croissant: { id: "gift_paris_croissant", name: "파리바게뜨 촉촉 버터크루아상", icon: "🥐", price: 45, bonusPoints: 22, type: "social", category: "cafe", desc: "프랑스 파리의 풍미가 가득 바삭촉촉 크루아상" },
  gift_mega_coffee: { id: "gift_mega_coffee", name: "메가커퓌 1리터 퐁크러쉬", icon: "🥤", price: 40, bonusPoints: 20, type: "social", category: "cafe", desc: "죠리퐁이 가득 올라간 압도적 가성비 대용량 음료" },
  gift_gongcha_bubble: { id: "gift_gongcha_bubble", name: "공차기 타피오카 펄 밀크티", icon: "🧋", price: 55, bonusPoints: 27, type: "social", category: "cafe", desc: "당도 50% 얼음 보통! 쫀득쫀득 펄 추가 밀크티" },
  gift_sulbing_bingsu: { id: "gift_sulbing_bingsu", name: "설빙수 인절미 콩고물 눈꽃빙수", icon: "🍧", price: 85, bonusPoints: 42, type: "social", category: "cafe", desc: "고소한 콩가루와 쫄깃한 인절미가 듬뿍 올라간 눈꽃빙수" },

  // 3. 한국 주요 브랜드 패러디 선물: [🍗 치킨 & 버거 & 피자]
  gift_kyochon_combo: { id: "gift_kyochon_combo", name: "고촌치킨 단짠 허니콤보", icon: "🍗", price: 150, bonusPoints: 75, type: "social", category: "food", desc: "바삭한 튀김옷에 달콤 짭조름한 꿀간장 치킨" },
  gift_bbq_golden: { id: "gift_bbq_golden", name: "비비큐 황금올리브 닭다리", icon: "🍗", price: 160, bonusPoints: 80, type: "social", category: "food", desc: "황금 올리브유로 바삭하게 튀겨낸 육즙 가득 치킨" },
  gift_bhc_purinkle: { id: "gift_bhc_purinkle", name: "비에이치씨 뿌링클 치즈볼 세트", icon: "🧀", price: 140, bonusPoints: 70, type: "social", category: "food", desc: "마법의 치즈 가루 듬뿍 뿌린 치킨과 쫀득 치즈볼" },
  gift_moms_psy: { id: "gift_moms_psy", name: "맘스손길 싸이버거 단품", icon: "🍔", price: 60, bonusPoints: 30, type: "social", category: "food", desc: "두툼한 통다리살 패티가 꽉 찬 가성비 최강 버거" },
  gift_mc_bigmac: { id: "gift_mc_bigmac", name: "맥날드 빅맥 세트", icon: "🍟", price: 75, bonusPoints: 37, type: "social", category: "food", desc: "참깨빵 위에 순쇠고기 패티 두 장 특별한 소스" },
  gift_domino_pizza: { id: "gift_domino_pizza", name: "도미노피자 포테이토 마요 치즈피자", icon: "🍕", price: 180, bonusPoints: 90, type: "social", category: "food", desc: "담백한 감자와 마요네즈가 어우러진 국민 피자" },

  // 4. 한국 주요 브랜드 패러디 선물: [🎁 편의점 & 뷰티 & 쇼핑]
  gift_baemin_voucher: { id: "gift_baemin_voucher", name: "배달의민지 2만원 상품권", icon: "🛵", price: 200, bonusPoints: 100, type: "social", category: "store", desc: "오늘 밤 야식은 내가 쏜다! 배달의민지 상품권" },
  gift_oliveyoung_card: { id: "gift_oliveyoung_card", name: "올리브형 꿀피부 뷰티 상품권", icon: "💄", price: 150, bonusPoints: 75, type: "social", category: "store", desc: "올영세일 필수템 쟁여두는 꿀피부 전용 상품권" },
  gift_cu_voucher: { id: "gift_cu_voucher", name: "씨유어게인 편의점 1만원권", icon: "🏪", price: 100, bonusPoints: 50, type: "social", category: "store", desc: "삼각김밥부터 컵라면까지 편의점 털기 전용권" },
  gift_gs25_voucher: { id: "gift_gs25_voucher", name: "지에스이십오 혜자도시락 교환권", icon: "🍱", price: 70, bonusPoints: 35, type: "social", category: "store", desc: "혜자로운 구성의 인기 편의점 든든한 도시락 교환권" },
  gift_shinsegae_card: { id: "gift_shinsegae_card", name: "신세계로 백화점 5만원 상품권", icon: "🏬", price: 350, bonusPoints: 175, type: "social", category: "store", desc: "명품 쇼핑의 품격! 신세계로 백화점 플렉스 상품권" },
  gift_gold_bar: { id: "gift_gold_bar", name: "순금 하루 골드바 1돈", icon: "🪙", price: 500, bonusPoints: 250, type: "social", category: "store", desc: "진정한 맞춤법 최고수에게 바치는 99.9% 순금 골드바" },

  // 5. 클래식 감성 선물 (5종)
  gift_cake: { id: "gift_cake", name: "딸기 생크림 케이크", icon: "🍰", price: 80, bonusPoints: 40, type: "social", category: "classic", desc: "달콤하고 부드러운 딸기 축하 케이크" },
  gift_bouquet: { id: "gift_bouquet", name: "향기로운 튤립 꽃다발", icon: "💐", price: 100, bonusPoints: 50, type: "social", category: "classic", desc: "응원과 감사의 마음을 담은 화사한 꽃다발" },
  gift_chocolate: { id: "gift_chocolate", name: "응원 수제 초콜릿 세트", icon: "🍫", price: 40, bonusPoints: 20, type: "social", category: "classic", desc: "두뇌 회전 팡팡! 당충전 특급 수제 초콜릿" },
  gift_diamond: { id: "gift_diamond", name: "영롱한 핑크 다이아몬드", icon: "💎", price: 300, bonusPoints: 150, type: "social", category: "classic", desc: "변치 않는 반짝이는 우정의 상징 보석" },
  gift_clover_lucky: { id: "gift_clover_lucky", name: "행운의 황금 네잎클로버", icon: "✨", price: 150, bonusPoints: 75, type: "social", category: "classic", desc: "오늘 시험과 일상에 대박 행운이 깃들길!" }
};

function getChatRoomId(userA, userB) {
  if (!userA || !userB) return "square";
  if (userA === "square" || userB === "square" || userA === "ALL" || userB === "ALL") return "square";
  return [userA, userB].sort().join("_");
}

// 24-Hour (1-Day) Photo Expiry & Automatic Deletion Engine
function cleanupExpiredPhotos() {
  try {
    const now = Date.now();
    // 1. Scan filesystem for expired photo files (> 24 hours)
    if (fs.existsSync(PHOTOS_DIR)) {
      const files = fs.readdirSync(PHOTOS_DIR);
      for (const file of files) {
        const filePath = path.join(PHOTOS_DIR, file);
        try {
          const stat = fs.statSync(filePath);
          if (now - stat.mtimeMs >= PHOTO_TTL_MS) {
            fs.unlinkSync(filePath);
            console.log(`[Photo Cleanup] 24-hour expired photo removed from disk: ${file}`);
          }
        } catch (fileErr) {
          // File may have been removed concurrently
        }
      }
    }

    // 2. Scan messages.json and mark expired photos
    const messages = loadMessages();
    let updated = false;
    for (const msg of messages) {
      if (msg.photoUrl && !msg.photoExpired) {
        const fileName = path.basename(msg.photoUrl);
        const filePath = path.join(PHOTOS_DIR, fileName);
        const fileExists = fs.existsSync(filePath);

        const expiresAt = msg.photoExpiresAt ? new Date(msg.photoExpiresAt).getTime() : 0;
        const sentAt = msg.timestamp ? new Date(msg.timestamp).getTime() : 0;
        const isTimeExpired = (expiresAt > 0 && now >= expiresAt) || (sentAt > 0 && (now - sentAt >= PHOTO_TTL_MS));

        if (!fileExists || isTimeExpired) {
          if (fileExists && isTimeExpired) {
            try { fs.unlinkSync(filePath); } catch (e) {}
          }
          msg.photoUrl = null;
          msg.photoExpired = true;
          updated = true;
        }
      }
    }
    if (updated) {
      saveMessages(messages);
    }
  } catch (err) {
    console.error("[Photo Cleanup Error]", err);
  }
}

function getKSTTime() {
  const now = new Date();
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const kst = new Date(utc + (9 * 60 * 60000));
  return kst.toISOString().replace(/T/, " ").replace(/\..+/, "");
}

function getKSTDateString(dateObj = new Date()) {
  try {
    const formatter = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Seoul',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
    return formatter.format(dateObj);
  } catch (e) {
    const now = dateObj || new Date();
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const kst = new Date(utc + (9 * 60 * 60000));
    return kst.toISOString().split("T")[0];
  }
}

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }
  return req.socket ? (req.socket.remoteAddress || "").replace(/^.*:/, "") : "-";
}

function recordAccessLog(username, action, ip, userAgent, details = {}) {
  const logs = loadLogs();
  const entry = {
    id: "log_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
    timestamp: new Date().toISOString(),
    kstTime: getKSTTime(),
    username: username || "게스트",
    action: action, // LOGIN_SUCCESS, LOGIN_FAIL, REGISTER, ROUND_CLEAR, DATA_SYNC
    ip: ip || "-",
    userAgent: (userAgent || "-").substring(0, 200),
    details: details
  };
  logs.push(entry);
  saveLogs(logs);
  return entry;
}

function hashPassword(password) {
  return crypto.createHash("sha256").update(password + "haru_salt_2026").digest("hex");
}

function generateToken() {
  return crypto.randomBytes(24).toString("hex");
}

// Push Subscriptions DB Helpers
function getPushSubscriptions() {
  if (!fs.existsSync(PUSH_SUBS_FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(PUSH_SUBS_FILE, "utf8")) || [];
  } catch (e) {
    return [];
  }
}

function savePushSubscriptions(subs) {
  try {
    fs.writeFileSync(PUSH_SUBS_FILE, JSON.stringify(subs, null, 2), "utf8");
  } catch (e) {
    console.error("[Web Push] Failed to save push subscriptions:", e);
  }
}

async function sendWebPushToUsers(usernames, payload) {
  if (!webpush || !vapidKeys) return 0;
  const subs = getPushSubscriptions();
  if (subs.length === 0) return 0;

  const targetSubs = subs.filter(s => usernames.includes(s.username));
  if (targetSubs.length === 0) return 0;

  const payloadStr = typeof payload === "string" ? payload : JSON.stringify(payload);
  const deadEndpoints = new Set();
  let sentCount = 0;

  await Promise.allSettled(targetSubs.map(async (entry) => {
    try {
      await webpush.sendNotification(entry.subscription, payloadStr, {
        TTL: 60 * 60 * 24 // 24 hours
      });
      sentCount++;
    } catch (err) {
      if (err.statusCode === 404 || err.statusCode === 410) {
        deadEndpoints.add(entry.subscription.endpoint);
      } else {
        console.warn(`[Web Push] Send notice for ${entry.username}:`, err.message);
      }
    }
  }));

  if (deadEndpoints.size > 0) {
    const updatedSubs = subs.filter(s => !deadEndpoints.has(s.subscription.endpoint));
    savePushSubscriptions(updatedSubs);
    console.log(`[Web Push] Cleaned up ${deadEndpoints.size} expired push subscriptions.`);
  }

  return sentCount;
}

// MIME types
const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".md": "text/markdown; charset=utf-8"
};

// Request Body Parser Helper
function parseJSONBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (err) {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function sendJSON(res, status, obj) {
  res.writeHead(status, {
    "Content-Type": "application/json; charset=utf-8",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  });
  res.end(JSON.stringify(obj));
}

// Git synchronization helper
function runGit(cmd) {
  try {
    return execSync(cmd, { cwd: __dirname, encoding: "utf8", timeout: 15000 }).trim();
  } catch (e) {
    return `Error: ${e.message}`;
  }
}

// Create HTTP server
const server = http.createServer(async (req, res) => {
  const parsedUrl = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  const pathname = parsedUrl.pathname;
  const clientIp = getClientIp(req);
  const userAgent = req.headers["user-agent"] || "-";

  // CORS Preflight
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization"
    });
    return res.end();
  }

  // ============================================================
  // API Routes
  // ============================================================

  // 1. 회원가입 (Register)
  if (req.method === "POST" && pathname === "/api/auth/register") {
    try {
      const { username, password, grade, avatar } = await parseJSONBody(req);
      if (!username || !password) {
        return sendJSON(res, 400, { success: false, message: "아이디와 비밀번호를 입력해 주세요." });
      }
      const trimmedUser = username.trim();
      const db = loadDB();

      if (db.users[trimmedUser]) {
        return sendJSON(res, 409, { success: false, message: "이미 사용 중인 아이디입니다." });
      }

      const todayStr = getKSTDateString();
      const newUser = {
        id: "user_" + Date.now(),
        username: trimmedUser,
        name: trimmedUser,
        passwordHash: hashPassword(password),
        grade: grade || "중학교 2학년",
        avatar: avatar || "🌸",
        streak: 1,
        totalPoints: 100,
        totalSolved: 5,
        totalCorrect: 5,
        todayScore: 100,
        maxRoundToday: 1,
        maxRoundSpelling: 1,
        maxRoundHanja: 1,
        maxRoundEnglish: 1,
        todayScoreSpelling: 100,
        todayScoreHanja: 0,
        todayScoreEnglish: 0,
        pointsSpelling: 100,
        pointsHanja: 0,
        pointsEnglish: 0,
        lastActiveDate: todayStr,
        completedDates: [todayStr],
        badges: ["starter"],
        wrongQuestions: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };

      const token = generateToken();
      db.users[trimmedUser] = newUser;
      db.tokens[token] = trimmedUser;
      saveDB(db);

      recordAccessLog(trimmedUser, "REGISTER", clientIp, userAgent, { grade: newUser.grade });

      const userSafe = { ...newUser };
      delete userSafe.passwordHash;

      return sendJSON(res, 201, { success: true, token, user: userSafe });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 2. 로그인 (Login)
  if (req.method === "POST" && pathname === "/api/auth/login") {
    try {
      const { username, password } = await parseJSONBody(req);
      if (!username || !password) {
        return sendJSON(res, 400, { success: false, message: "아이디와 비밀번호를 입력해 주세요." });
      }
      const trimmedUser = username.trim();
      const db = loadDB();
      const user = db.users[trimmedUser];

      if (!user || user.passwordHash !== hashPassword(password)) {
        recordAccessLog(trimmedUser, "LOGIN_FAIL", clientIp, userAgent, { reason: "인증 실패" });
        return sendJSON(res, 401, { success: false, message: "아이디 또는 비밀번호가 일치하지 않습니다." });
      }

      const token = generateToken();
      db.tokens[token] = trimmedUser;
      saveDB(db);

      recordAccessLog(trimmedUser, "LOGIN_SUCCESS", clientIp, userAgent, { grade: user.grade });

      const userSafe = { ...user };
      delete userSafe.passwordHash;

      return sendJSON(res, 200, { success: true, token, user: userSafe });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 3. 내 정보 조회 (Profile by Token)
  if (req.method === "GET" && pathname === "/api/user/profile") {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.replace(/^Bearer\s+/, "") || parsedUrl.searchParams.get("token");
    const db = loadDB();
    const username = db.tokens[token];

    if (!username || !db.users[username]) {
      return sendJSON(res, 401, { success: false, message: "유효하지 않은 토큰입니다." });
    }

    const userSafe = { ...db.users[username] };
    delete userSafe.passwordHash;
    return sendJSON(res, 200, { success: true, user: userSafe });
  }

  // 4. 데이터 실시간 동기화 (Sync User Data from PC/Mobile)
  if (req.method === "POST" && pathname === "/api/user/sync") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const target = db.users[username];
      const uData = body.userData || body || {};

      // Merge and update stats (allow point deduction for shop purchases)
      if (typeof uData.streak === "number") target.streak = Math.max(target.streak, uData.streak);
      if (typeof uData.totalPoints === "number") target.totalPoints = uData.totalPoints;
      if (typeof uData.totalSolved === "number") target.totalSolved = Math.max(target.totalSolved, uData.totalSolved);
      if (typeof uData.totalCorrect === "number") target.totalCorrect = Math.max(target.totalCorrect, uData.totalCorrect);
      if (typeof uData.todayScore === "number") target.todayScore = uData.todayScore;
      if (typeof uData.maxRoundToday === "number") target.maxRoundToday = Math.max(target.maxRoundToday || 1, uData.maxRoundToday);
      if (uData.grade) target.grade = uData.grade;
      if (uData.avatar) target.avatar = uData.avatar;
      if (uData.name) target.name = uData.name;

      // Shop Inventory & Layered Avatar Accessories Sync (Anti-Wipe Protected)
      if (uData.items && typeof uData.items === "object") target.items = { ...(target.items || {}), ...uData.items };
      if (typeof uData.shields === "number") target.shields = Math.min(2, Math.max(0, uData.shields));
      if (uData.avatarAccessories && typeof uData.avatarAccessories === "object") {
        const incomingAcc = uData.avatarAccessories;
        const hasIncomingValues = Object.values(incomingAcc).some(v => v !== null && v !== undefined && v !== 'eyes');
        const existingAcc = (target.avatarAccessories && typeof target.avatarAccessories === "object") ? target.avatarAccessories : {};
        const hasExistingValues = Object.values(existingAcc).some(v => v !== null && v !== undefined && v !== 'eyes');

        if (hasIncomingValues) {
          target.avatarAccessories = incomingAcc;
        } else if (!hasIncomingValues && hasExistingValues) {
          // Keep existing accessories if incoming payload is uninitialized
        } else {
          target.avatarAccessories = incomingAcc;
        }
      }
      if (Array.isArray(uData.inventoryAccessories)) {
        const accSet = new Set([...(target.inventoryAccessories || []), ...uData.inventoryAccessories]);
        target.inventoryAccessories = Array.from(accSet);
      }

      // Subject-specific sync (Spelling vs Hanja vs English)
      const mode = body.mode || (body.details && body.details.mode) || uData.mode || "spelling";
      const roundVal = typeof body.round === "number" ? body.round : (body.details && typeof body.details.round === "number" ? body.details.round : (typeof uData.maxRoundToday === "number" ? uData.maxRoundToday : null));
      const scoreVal = typeof body.todayScore === "number" ? body.todayScore : (body.details && typeof body.details.score === "number" ? body.details.score : (typeof uData.todayScore === "number" ? uData.todayScore : null));
      const pointsVal = typeof body.pointsEarned === "number" ? body.pointsEarned : (body.details && typeof body.details.pointsEarned === "number" ? body.details.pointsEarned : 0);

      if (mode === "idiom") {
        if (roundVal !== null) target.maxRoundIdiom = Math.max(target.maxRoundIdiom || 1, roundVal);
        if (scoreVal !== null) target.todayScoreIdiom = Math.max(target.todayScoreIdiom || 0, scoreVal);
        if (pointsVal > 0) target.pointsIdiom = (target.pointsIdiom || 0) + pointsVal;
      } else if (mode === "hanja") {
        if (roundVal !== null) target.maxRoundHanja = Math.max(target.maxRoundHanja || 1, roundVal);
        if (scoreVal !== null) target.todayScoreHanja = Math.max(target.todayScoreHanja || 0, scoreVal);
        if (pointsVal > 0) target.pointsHanja = (target.pointsHanja || 0) + pointsVal;
      } else if (mode === "english") {
        if (roundVal !== null) target.maxRoundEnglish = Math.max(target.maxRoundEnglish || 1, roundVal);
        if (scoreVal !== null) target.todayScoreEnglish = Math.max(target.todayScoreEnglish || 0, scoreVal);
        if (pointsVal > 0) target.pointsEnglish = (target.pointsEnglish || 0) + pointsVal;
      } else {
        if (roundVal !== null) target.maxRoundSpelling = Math.max(target.maxRoundSpelling || 1, roundVal);
        if (scoreVal !== null) target.todayScoreSpelling = Math.max(target.todayScoreSpelling || 0, scoreVal);
        if (pointsVal > 0) target.pointsSpelling = (target.pointsSpelling || 0) + pointsVal;
      }

      // Merge completedDates array uniquely
      if (Array.isArray(uData.completedDates)) {
        const dateSet = new Set([...(target.completedDates || []), ...uData.completedDates]);
        target.completedDates = Array.from(dateSet);
      }

      // Merge badges
      if (Array.isArray(uData.badges)) {
        const badgeSet = new Set([...(target.badges || []), ...uData.badges]);
        target.badges = Array.from(badgeSet);
      }

      // Update wrong questions
      if (Array.isArray(uData.wrongQuestions)) {
        target.wrongQuestions = uData.wrongQuestions;
      }

      // Merge solved question IDs (subject-specific map: spelling, idiom, hanja, english)
      if (uData.solvedQuestionMap && typeof uData.solvedQuestionMap === "object") {
        target.solvedQuestionMap = target.solvedQuestionMap || {};
        for (const sub of ["spelling", "idiom", "hanja", "english"]) {
          const existing = new Set(target.solvedQuestionMap[sub] || []);
          const incoming = uData.solvedQuestionMap[sub] || [];
          if (Array.isArray(incoming)) {
            incoming.forEach(id => existing.add(id));
          }
          target.solvedQuestionMap[sub] = Array.from(existing);
        }
      }

      target.updatedAt = new Date().toISOString();
      saveDB(db);

      // Record special action (e.g. ROUND_CLEAR) or general sync
      if (body.action === "ROUND_CLEAR") {
        recordAccessLog(username, "ROUND_CLEAR", clientIp, userAgent, body.details || {});
      }

      const userSafe = { ...target };
      delete userSafe.passwordHash;

      return sendJSON(res, 200, { success: true, user: userSafe });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 5. 전체 회원 실시간 랭킹 (Leaderboard: Dual Subject & Highest Round)
  if (req.method === "GET" && pathname === "/api/leaderboard") {
    const mode = parsedUrl.searchParams.get("mode") || "all"; // spelling | hanja | all
    const type = parsedUrl.searchParams.get("type") || "daily"; // round | daily | total

    const db = loadDB();
    const list = Object.values(db.users).map(u => ({
      id: u.id,
      username: u.username || u.name,
      name: u.name || u.username,
      avatar: u.avatar || "🌸",
      avatarAccessories: (u.avatarAccessories && typeof u.avatarAccessories === 'object') ? u.avatarAccessories : {},
      grade: u.grade || "중학교 2학년",
      streak: u.streak || 1,
      totalPoints: u.totalPoints || 0,
      todayScore: u.todayScore || 0,
      maxRoundToday: u.maxRoundToday || 1,
      maxRoundSpelling: u.maxRoundSpelling || (u.maxRoundToday || 1),
      maxRoundIdiom: u.maxRoundIdiom || 1,
      maxRoundHanja: u.maxRoundHanja || 1,
      maxRoundEnglish: u.maxRoundEnglish || 1,
      todayScoreSpelling: u.todayScoreSpelling || (u.todayScore || 0),
      todayScoreIdiom: u.todayScoreIdiom || 0,
      todayScoreHanja: u.todayScoreHanja || 0,
      todayScoreEnglish: u.todayScoreEnglish || 0,
      pointsSpelling: u.pointsSpelling !== undefined ? u.pointsSpelling : (u.totalPoints || 0),
      pointsIdiom: u.pointsIdiom !== undefined ? u.pointsIdiom : 0,
      pointsHanja: u.pointsHanja !== undefined ? u.pointsHanja : 0,
      pointsEnglish: u.pointsEnglish !== undefined ? u.pointsEnglish : 0
    }));

    if (type === "round") {
      if (mode === "idiom") {
        list.sort((a, b) => (b.maxRoundIdiom - a.maxRoundIdiom) || (b.pointsIdiom - a.pointsIdiom) || (b.totalPoints - a.totalPoints));
      } else if (mode === "hanja") {
        list.sort((a, b) => (b.maxRoundHanja - a.maxRoundHanja) || (b.pointsHanja - a.pointsHanja) || (b.totalPoints - a.totalPoints));
      } else if (mode === "english") {
        list.sort((a, b) => (b.maxRoundEnglish - a.maxRoundEnglish) || (b.pointsEnglish - a.pointsEnglish) || (b.totalPoints - a.totalPoints));
      } else {
        list.sort((a, b) => (b.maxRoundSpelling - a.maxRoundSpelling) || (b.pointsSpelling - a.pointsSpelling) || (b.totalPoints - a.totalPoints));
      }
    } else if (type === "total") {
      if (mode === "idiom") {
        list.sort((a, b) => (b.pointsIdiom - a.pointsIdiom) || (b.totalPoints - a.totalPoints));
      } else if (mode === "hanja") {
        list.sort((a, b) => (b.pointsHanja - a.pointsHanja) || (b.totalPoints - a.totalPoints));
      } else if (mode === "english") {
        list.sort((a, b) => (b.pointsEnglish - a.pointsEnglish) || (b.totalPoints - a.totalPoints));
      } else if (mode === "spelling") {
        list.sort((a, b) => (b.pointsSpelling - a.pointsSpelling) || (b.totalPoints - a.totalPoints));
      } else {
        list.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
      }
    } else {
      // type === "daily"
      if (mode === "idiom") {
        list.sort((a, b) => (b.todayScoreIdiom - a.todayScoreIdiom) || (b.pointsIdiom - a.pointsIdiom));
      } else if (mode === "hanja") {
        list.sort((a, b) => (b.todayScoreHanja - a.todayScoreHanja) || (b.pointsHanja - a.pointsHanja));
      } else if (mode === "english") {
        list.sort((a, b) => (b.todayScoreEnglish - a.todayScoreEnglish) || (b.pointsEnglish - a.pointsEnglish));
      } else if (mode === "spelling") {
        list.sort((a, b) => (b.todayScoreSpelling - a.todayScoreSpelling) || (b.pointsSpelling - a.pointsSpelling));
      } else {
        list.sort((a, b) => (b.todayScore || 0) - (a.todayScore || 0));
      }
    }

    return sendJSON(res, 200, { success: true, mode, type, leaderboard: list });
  }

  // 6. 사용자 접속/이용 이력 조회 (User Access Logs)
  if (req.method === "GET" && pathname === "/api/user/logs") {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.replace(/^Bearer\s+/, "") || parsedUrl.searchParams.get("token");
    const db = loadDB();
    const username = db.tokens[token];

    if (!username || !db.users[username]) {
      return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
    }

    const logs = loadLogs();
    const userLogs = logs.filter(l => l.username === username).slice(-30).reverse();
    return sendJSON(res, 200, { success: true, logs: userLogs });
  }

  // 7. 관리자 전체 접속 감사 로그 조회 (Admin Audit Logs - Only '단민러브')
  if (req.method === "GET" && pathname === "/api/admin/logs") {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.replace(/^Bearer\s+/, "") || parsedUrl.searchParams.get("token");
    const db = loadDB();
    const username = db.tokens[token];

    if (!username || username !== "단민러브") {
      return sendJSON(res, 403, { success: false, message: "관리자('단민러브') 권한이 필요합니다." });
    }

    const logs = loadLogs();
    return sendJSON(res, 200, { success: true, logs: logs.slice(-1000).reverse() });
  }

  // 8. 깃허브 자동 동기화 (Git Push/Pull Status)
  if (pathname === "/api/git/sync" && req.method === "POST") {
    try {
      const pullRes = runGit("git pull --rebase origin main");
      const addRes = runGit("git add .");
      const commitRes = runGit('git commit -m "auto: synology app update & data sync" || true');
      const pushRes = runGit("git push origin main || true");
      return sendJSON(res, 200, {
        success: true,
        message: "Git 동기화가 성공적으로 완료되었습니다.",
        details: { pullRes, addRes, commitRes, pushRes }
      });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 9. 앱 버전 확인 및 모바일 자동 업데이트 엔드포인트 (Mobile Auto-Update & Version Check)
  if (pathname === "/api/version" && req.method === "GET") {
    let verData = { version: "3.4.4", build: "20261116_2010" };
    try {
      const vFile = path.join(__dirname, "version.json");
      if (fs.existsSync(vFile)) {
        verData = JSON.parse(fs.readFileSync(vFile, "utf8"));
      }
    } catch (e) {}

    // Attach git commit hash if available
    try {
      const commit = execSync("git rev-parse --short HEAD", { cwd: __dirname, timeout: 1000, stdio: ['ignore', 'pipe', 'ignore'] }).toString().trim();
      if (commit) verData.commit = commit;
    } catch (e) {}

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");
    return sendJSON(res, 200, {
      success: true,
      ...verData,
      serverTime: new Date().toISOString()
    });
  }

  // 10-1. 메시지 첨부 사진 업로드 (Upload Photo for Message - 24h Auto-Deletion Policy)
  if (req.method === "POST" && pathname === "/api/messages/upload-photo") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const rawBase64 = body.imageBase64 || "";
      if (!rawBase64) {
        return sendJSON(res, 400, { success: false, message: "업로드할 사진 데이터가 없습니다." });
      }

      let mimeMatch = rawBase64.match(/^data:(image\/(jpeg|png|webp|gif));base64,/i);
      let ext = "jpg";
      let base64Data = rawBase64;
      if (mimeMatch) {
        base64Data = rawBase64.replace(/^data:image\/\w+;base64,/, "");
        const mimeType = mimeMatch[1].toLowerCase();
        if (mimeType === "image/png") ext = "png";
        else if (mimeType === "image/webp") ext = "webp";
        else if (mimeType === "image/gif") ext = "gif";
        else ext = "jpg";
      }

      const buffer = Buffer.from(base64Data, "base64");
      if (buffer.length > 5 * 1024 * 1024) {
        return sendJSON(res, 400, { success: false, message: "사진 용량은 최대 5MB까지 가능합니다." });
      }

      const now = Date.now();
      const safeFileName = `photo_${now}_${crypto.randomBytes(6).toString("hex")}.${ext}`;
      const savedPath = path.join(PHOTOS_DIR, safeFileName);
      fs.writeFileSync(savedPath, buffer);

      const expiresAt = new Date(now + PHOTO_TTL_MS).toISOString();
      const photoUrl = `/api/uploads/photos/${safeFileName}`;

      recordAccessLog(username, "UPLOAD_PHOTO", clientIp, userAgent, { fileName: safeFileName, size: buffer.length });

      return sendJSON(res, 201, {
        success: true,
        photoUrl: photoUrl,
        expiresAt: expiresAt,
        fileName: safeFileName
      });
    } catch (e) {
      console.error("Upload photo error:", e);
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 10-2. 실시간 사진 파일 서빙 및 24시간 만료 자동 삭제 (Serve Uploaded Photos & 24h Expiry Enforcement)
  if (req.method === "GET" && pathname.startsWith("/api/uploads/photos/")) {
    const fileName = path.basename(pathname);
    // Security check: only allow safe photo pattern
    if (!/^photo_\d+_[a-f0-9]+\.(jpg|jpeg|png|webp|gif)$/i.test(fileName)) {
      return sendJSON(res, 400, { success: false, message: "잘못된 파일 요청입니다." });
    }

    const targetPhotoPath = path.join(PHOTOS_DIR, fileName);
    if (!fs.existsSync(targetPhotoPath)) {
      return sendJSON(res, 404, {
        success: false,
        expired: true,
        message: "사진을 찾을 수 없거나 보안 정책(24시간)에 따라 자동 삭제되었습니다."
      });
    }

    try {
      const stat = fs.statSync(targetPhotoPath);
      const now = Date.now();
      if (now - stat.mtimeMs >= PHOTO_TTL_MS) {
        // Expired! Delete from disk immediately
        try { fs.unlinkSync(targetPhotoPath); } catch (e) {}
        return sendJSON(res, 410, {
          success: false,
          expired: true,
          message: "보안 정책에 따라 24시간이 경과하여 자동 삭제된 사진입니다."
        });
      }

      const ext = path.extname(fileName).toLowerCase();
      let cType = "image/jpeg";
      if (ext === ".png") cType = "image/png";
      else if (ext === ".webp") cType = "image/webp";
      else if (ext === ".gif") cType = "image/gif";

      res.writeHead(200, {
        "Content-Type": cType,
        "Content-Length": stat.size,
        "Cache-Control": "public, max-age=3600",
        "Access-Control-Allow-Origin": "*"
      });
      fs.createReadStream(targetPhotoPath).pipe(res);
      return;
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 10. 실시간 메시지 전송 (Send Message to One or Multiple Users with Photo Support)
  if (req.method === "POST" && pathname === "/api/messages/send") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const sender = db.users[username];
      const rawContent = (body.content || "").trim();
      const photoUrl = (body.photoUrl || "").trim();
      const photoExpiresAt = body.photoExpiresAt || (photoUrl ? new Date(Date.now() + PHOTO_TTL_MS).toISOString() : null);

      if (!rawContent && !photoUrl) {
        return sendJSON(res, 400, { success: false, message: "메시지 내용이나 사진을 입력해 주세요." });
      }
      if (rawContent.length > 200) {
        return sendJSON(res, 400, { success: false, message: "메시지는 최대 200자까지 작성할 수 있습니다." });
      }

      // Collect target recipients (support Array `recipients` or single target `toName`/`toUsername`)
      let rawRecipients = [];
      if (Array.isArray(body.recipients) && body.recipients.length > 0) {
        rawRecipients = body.recipients;
      } else {
        const singleTarget = (body.toName || body.toUsername || "").trim();
        if (singleTarget) {
          rawRecipients = [{ toName: singleTarget, toUsername: singleTarget, toId: body.toId || "" }];
        }
      }

      if (rawRecipients.length === 0) {
        return sendJSON(res, 400, { success: false, message: "받는 사람을 1명 이상 지정해 주세요." });
      }

      // Resolve each recipient against DB and deduplicate
      const resolvedRecipients = [];
      const seenUsernames = new Set();

      for (const item of rawRecipients) {
        const toTarget = (typeof item === 'string' ? item : (item.toUsername || item.toName || item.name || item.username || "")).trim();
        const toId = (typeof item === 'object' && item.toId) ? item.toId.trim() : "";
        if (!toTarget) continue;

        let recipient = db.users[toTarget];
        if (!recipient) {
          recipient = Object.values(db.users).find(u => 
            (toId && u.id === toId) ||
            (u.name && u.name.trim() === toTarget) || 
            (u.username && u.username.trim() === toTarget) ||
            (toTarget && (u.name || "").includes(toTarget))
          );
        }

        if (recipient) {
          const uKey = recipient.username || recipient.name;
          if (!seenUsernames.has(uKey)) {
            seenUsernames.add(uKey);
            resolvedRecipients.push(recipient);
          }
        }
      }

      if (resolvedRecipients.length === 0) {
        return sendJSON(res, 404, { success: false, message: "선택한 받는 사람을 찾을 수 없습니다." });
      }

      const safeContent = rawContent
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      const messages = loadMessages();
      const createdEntries = [];
      const nowIso = new Date().toISOString();
      const nowKst = getKSTTime();

      for (const recipient of resolvedRecipients) {
        const toUserKey = recipient.username || recipient.name;
        const msgEntry = {
          id: "msg_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
          roomId: body.roomId || getChatRoomId(username, toUserKey),
          fromUsername: username,
          fromName: sender.name || username,
          fromAvatar: sender.avatar || "🌸",
          fromAccessories: sender.avatarAccessories || {},
          toUsername: toUserKey,
          toName: recipient.name || recipient.username,
          toAvatar: recipient.avatar || "🌸",
          toAccessories: recipient.avatarAccessories || {},
          type: body.type || (body.gift ? "gift" : (body.sticker ? "sticker" : (photoUrl ? "photo" : "text"))),
          content: safeContent,
          emojiTag: body.emojiTag || null,
          photoUrl: photoUrl || null,
          photoExpiresAt: photoExpiresAt || null,
          photoExpired: false,
          sticker: body.sticker || null,
          gift: body.gift || null,
          timestamp: nowIso,
          kstTime: nowKst,
          read: false,
          readBy: [username]
        };
        messages.push(msgEntry);
        createdEntries.push(msgEntry);
      }

      saveMessages(messages);

      recordAccessLog(username, "SEND_MESSAGE", clientIp, userAgent, {
        recipientCount: resolvedRecipients.length,
        recipients: resolvedRecipients.map(r => r.username || r.name),
        hasPhoto: !!photoUrl
      });

      // Web Push Background Notification Trigger (v2.9.14 & v3.5.2)
      try {
        const targetUsernames = resolvedRecipients.map(r => r.username || r.name);
        const pushTitle = `💬 ${sender.name || username}님의 새 메시지 도착!`;
        const pushBody = photoUrl 
          ? (rawContent ? `📷 [사진] ${rawContent}` : "📷 새로운 사진이 도착했습니다! (탭하여 대화창 열기)")
          : (rawContent || "새로운 대화 메시지가 도착했습니다! (탭하여 대화창 열기)");
        
        const targetChatUrl = `/?open=chat&withUser=${encodeURIComponent(username)}`;
        sendWebPushToUsers(targetUsernames, {
          title: pushTitle,
          body: pushBody,
          icon: "/public/icons/icon-192.png",
          badge: "/public/icons/badge-72.png",
          url: targetChatUrl,
          tag: "haru-chat-" + Date.now(),
          data: {
            fromUsername: username,
            fromName: sender.name || username,
            withUser: username,
            roomId: null,
            hasPhoto: !!photoUrl,
            timestamp: nowIso
          }
        }).catch(err => console.warn("[Web Push] Async push dispatch error:", err.message));
      } catch (pushErr) {
        console.warn("[Web Push] Dispatch trigger error:", pushErr.message);
      }

      return sendJSON(res, 201, {
        success: true,
        count: createdEntries.length,
        message: createdEntries[0],
        messages: createdEntries
      });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 11. 미확인 실시간 메시지 확인 (Check Unread Messages Polling with Photo Expiry Check)
  if (req.method === "GET" && pathname === "/api/messages/check") {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.replace(/^Bearer\s+/, "") || parsedUrl.searchParams.get("token");
    const db = loadDB();
    const username = db.tokens[token];

    if (!username || !db.users[username]) {
      return sendJSON(res, 200, { success: true, unreadCount: 0, messages: [] });
    }

    cleanupExpiredPhotos();

    const messages = loadMessages();
    const unread = messages.filter(m => m.toUsername === username && !m.read);
    return sendJSON(res, 200, {
      success: true,
      unreadCount: unread.length,
      messages: unread
    });
  }

  // 12. 전체 메시지 보관함 (Inbox & Sent History with Photo Expiry Check)
  if (req.method === "GET" && pathname === "/api/messages/inbox") {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.replace(/^Bearer\s+/, "") || parsedUrl.searchParams.get("token");
    const db = loadDB();
    const username = db.tokens[token];

    if (!username || !db.users[username]) {
      return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
    }

    cleanupExpiredPhotos();

    const messages = loadMessages();
    const myMessages = messages
      .filter(m => m.toUsername === username || m.fromUsername === username)
      .slice(-50)
      .reverse();

    return sendJSON(res, 200, {
      success: true,
      messages: myMessages
    });
  }

  // 13. 메시지 읽음 처리 (Mark Messages as Read)
  if (req.method === "POST" && pathname === "/api/messages/read") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const messageId = body.messageId;
      const markAll = body.all === true;
      const messages = loadMessages();
      let updatedCount = 0;

      messages.forEach(m => {
        if (m.toUsername === username) {
          if (markAll || m.id === messageId) {
            if (!m.read) {
              m.read = true;
              updatedCount++;
            }
          }
        }
      });

      if (updatedCount > 0) {
        saveMessages(messages);
      }

      return sendJSON(res, 200, { success: true, updatedCount });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 14. [v3.3.0] 대화방 선물 카탈로그 조회 (GET /api/chat/catalog)
  if (req.method === "GET" && pathname === "/api/chat/catalog") {
    return sendJSON(res, 200, {
      success: true,
      gifts: GIFT_CATALOG
    });
  }

  // 15. [v3.3.0] 대화방 목록 조회 (GET /api/chat/rooms)
  if (req.method === "GET" && pathname === "/api/chat/rooms") {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.replace(/^Bearer\s+/, "") || parsedUrl.searchParams.get("token");
    const db = loadDB();
    const username = db.tokens[token];

    if (!username || !db.users[username]) {
      return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
    }

    cleanupExpiredPhotos();
    const messages = loadMessages();

    // 1) 하루 광장 대화방 (전체 다자간 동시 대화방)
    const squareMessages = messages.filter(m => m.roomId === "square" || m.toUsername === "ALL" || m.toUsername === "square");
    const lastSquareMsg = squareMessages.length > 0 ? squareMessages[squareMessages.length - 1] : null;
    const unreadSquare = squareMessages.filter(m => m.fromUsername !== username && (!m.readBy || !m.readBy.includes(username))).length;

    const squareRoom = {
      roomId: "square",
      name: "하루 광장 대화방 (전체)",
      isGroup: true,
      avatar: "💬",
      memberCount: Object.keys(db.users).length,
      lastMessage: lastSquareMsg ? {
        content: lastSquareMsg.content || (lastSquareMsg.sticker ? `[스티커 ${lastSquareMsg.sticker.name || ''}]` : (lastSquareMsg.gift ? `[선물 ${lastSquareMsg.gift.name || ''}]` : (lastSquareMsg.photoUrl ? '[사진]' : ''))),
        fromName: lastSquareMsg.fromName || lastSquareMsg.fromUsername,
        timestamp: lastSquareMsg.timestamp,
        kstTime: lastSquareMsg.kstTime
      } : null,
      unreadCount: unreadSquare
    };

    // 2) 멀티 그룹 대화방 목록 (v3.5.0 Multi-User Group Chats)
    const groups = loadGroups();
    const myGroups = groups.filter(g => g.members && g.members.includes(username));
    const groupRooms = [];

    for (const g of myGroups) {
      const gMsgs = messages.filter(m => m.roomId === g.roomId);
      const lastGMsg = gMsgs.length > 0 ? gMsgs[gMsgs.length - 1] : null;
      const unreadGCount = gMsgs.filter(m => m.fromUsername !== username && (!m.readBy || !m.readBy.includes(username))).length;

      const memberDisplayNames = g.members.map(m => (db.users[m] && db.users[m].name) || m);
      const defaultGroupName = memberDisplayNames.join(', ');

      groupRooms.push({
        roomId: g.roomId,
        name: g.name || defaultGroupName,
        isGroup: true,
        isCustomGroup: true,
        members: g.members,
        memberCount: g.members.length,
        avatar: "👥",
        lastMessage: lastGMsg ? {
          content: lastGMsg.content || (lastGMsg.sticker ? `[스티커 ${lastGMsg.sticker.name || ''}]` : (lastGMsg.gift ? `[선물 ${lastGMsg.gift.name || ''}]` : (lastGMsg.photoUrl ? '[사진]' : ''))),
          fromName: lastGMsg.fromName || lastGMsg.fromUsername,
          timestamp: lastGMsg.timestamp,
          kstTime: lastGMsg.kstTime
        } : null,
        unreadCount: unreadGCount
      });
    }

    groupRooms.sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
      const timeB = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
      return timeB - timeA;
    });

    // 3) 1:1 대화방 목록 (실제 활동 중인 다른 회원들과의 대화방)
    const dmRooms = [];
    for (const [uName, uData] of Object.entries(db.users)) {
      if (uName === username) continue;
      const rId = getChatRoomId(username, uName);
      const userMsgs = messages.filter(m => 
        (m.roomId === rId) || 
        (!m.roomId && ((m.fromUsername === username && m.toUsername === uName) || (m.fromUsername === uName && m.toUsername === username)))
      );
      const lastMsg = userMsgs.length > 0 ? userMsgs[userMsgs.length - 1] : null;
      const unreadCount = userMsgs.filter(m => m.toUsername === username && !m.read).length;

      dmRooms.push({
        roomId: rId,
        name: uData.name || uName,
        username: uName,
        isGroup: false,
        avatar: uData.avatar || "🌸",
        avatarAccessories: uData.avatarAccessories || {},
        grade: uData.grade || "친구",
        totalPoints: uData.totalPoints || 0,
        lastMessage: lastMsg ? {
          content: lastMsg.content || (lastMsg.sticker ? `[스티커 ${lastMsg.sticker.name || ''}]` : (lastMsg.gift ? `[선물 ${lastMsg.gift.name || ''}]` : (lastMsg.photoUrl ? '[사진]' : ''))),
          fromName: lastMsg.fromName || lastMsg.fromUsername,
          timestamp: lastMsg.timestamp,
          kstTime: lastMsg.kstTime
        } : null,
        unreadCount: unreadCount
      });
    }

    // 최근 메시지가 있는 방을 상단에 정렬
    dmRooms.sort((a, b) => {
      const timeA = a.lastMessage ? new Date(a.lastMessage.timestamp).getTime() : 0;
      const timeB = b.lastMessage ? new Date(b.lastMessage.timestamp).getTime() : 0;
      return timeB - timeA;
    });

    return sendJSON(res, 200, {
      success: true,
      currentUser: {
        username: username,
        name: db.users[username].name || username,
        avatar: db.users[username].avatar || "🌸",
        avatarAccessories: db.users[username].avatarAccessories || {},
        totalPoints: db.users[username].totalPoints || 0,
        items: db.users[username].items || {},
        shields: db.users[username].shields || 0
      },
      rooms: [squareRoom, ...groupRooms, ...dmRooms]
    });
  }

  // 16. [v3.3.0] 대화방 메시지 스레드 연속 조회 (GET /api/chat/thread)
  if (req.method === "GET" && pathname === "/api/chat/thread") {
    const authHeader = req.headers["authorization"] || "";
    const token = authHeader.replace(/^Bearer\s+/, "") || parsedUrl.searchParams.get("token");
    const db = loadDB();
    const username = db.tokens[token];

    if (!username || !db.users[username]) {
      return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
    }

    cleanupExpiredPhotos();
    const reqRoomId = parsedUrl.searchParams.get("roomId") || "square";
    const withUser = parsedUrl.searchParams.get("withUser");
    const sinceId = parsedUrl.searchParams.get("sinceId");
    const limit = Math.min(200, Math.max(10, parseInt(parsedUrl.searchParams.get("limit") || "100", 10)));

    const effectiveRoomId = withUser ? getChatRoomId(username, withUser) : reqRoomId;
    const messages = loadMessages();
    let thread = [];

    let groupMeta = null;
    if (effectiveRoomId === "square") {
      thread = messages.filter(m => m.roomId === "square" || m.toUsername === "ALL" || m.toUsername === "square");
    } else if (effectiveRoomId.startsWith("group_")) {
      // 멀티 그룹 대화방 (v3.5.0)
      const groups = loadGroups();
      const grp = groups.find(g => g.roomId === effectiveRoomId);
      if (!grp || !grp.members.includes(username)) {
        return sendJSON(res, 403, { success: false, message: "대화방에 참여한 멤버만 볼 수 있습니다." });
      }
      groupMeta = {
        roomId: grp.roomId,
        name: grp.name || grp.members.map(m => (db.users[m] && db.users[m].name) || m).join(', '),
        members: grp.members,
        memberDetails: grp.members.map(m => ({
          username: m,
          name: (db.users[m] && db.users[m].name) || m,
          avatar: (db.users[m] && db.users[m].avatar) || "🌸",
          avatarAccessories: (db.users[m] && db.users[m].avatarAccessories) || {}
        })),
        memberCount: grp.members.length,
        createdBy: grp.createdBy,
        createdAt: grp.createdAt
      };
      thread = messages.filter(m => m.roomId === effectiveRoomId);
    } else {
      // 1:1 대화방
      thread = messages.filter(m => 
        (m.roomId === effectiveRoomId) || 
        (!m.roomId && withUser && ((m.fromUsername === username && m.toUsername === withUser) || (m.fromUsername === withUser && m.toUsername === username))) ||
        (!m.roomId && !withUser && effectiveRoomId.includes(m.fromUsername) && effectiveRoomId.includes(m.toUsername))
      );
    }

    if (sinceId) {
      const idx = thread.findIndex(m => m.id === sinceId);
      if (idx !== -1) {
        thread = thread.slice(idx + 1);
      }
    } else {
      thread = thread.slice(-limit);
    }

    // 읽음 상태 갱신
    let updated = false;
    for (const msg of thread) {
      if (effectiveRoomId === "square" || effectiveRoomId.startsWith("group_")) {
        msg.readBy = msg.readBy || [];
        if (!msg.readBy.includes(username)) {
          msg.readBy.push(username);
          updated = true;
        }
      } else {
        if (msg.toUsername === username && !msg.read) {
          msg.read = true;
          updated = true;
        }
      }
    }
    if (updated) {
      saveMessages(messages);
    }

    return sendJSON(res, 200, {
      success: true,
      roomId: effectiveRoomId,
      count: thread.length,
      groupMeta: groupMeta,
      messages: thread
    });
  }

  // 17. [v3.3.0] 대화방 실시간 메시지 전송 (POST /api/chat/send)
  if (req.method === "POST" && pathname === "/api/chat/send") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const sender = db.users[username];
      const clientIp = getClientIp(req);
      const userAgent = req.headers["user-agent"] || "unknown";

      const targetRoomId = body.roomId || (body.toUsername ? getChatRoomId(username, body.toUsername) : "square");
      const rawContent = (body.content || "").trim();
      const photoUrl = body.photoUrl || null;
      const photoExpiresAt = body.photoExpiresAt || null;
      const sticker = body.sticker || null;
      const gift = body.gift || null;

      if (!rawContent && !photoUrl && !sticker && !gift) {
        return sendJSON(res, 400, { success: false, message: "메시지 내용, 사진, 스티커 또는 선물을 입력해 주세요." });
      }

      const safeContent = rawContent
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      const msgType = body.type || (gift ? "gift" : (sticker ? "sticker" : (photoUrl ? "photo" : "text")));
      const nowIso = new Date().toISOString();
      const nowKst = getKSTTime();

      let toUsername = targetRoomId === "square" ? "square" : (body.toUsername || "friend");
      let toName = targetRoomId === "square" ? "하루 광장" : (body.toName || toUsername);
      let toAvatar = "🌸";
      let toAccessories = {};

      if (targetRoomId !== "square" && db.users[toUsername]) {
        toName = db.users[toUsername].name || toUsername;
        toAvatar = db.users[toUsername].avatar || "🌸";
        toAccessories = db.users[toUsername].avatarAccessories || {};
      }

      const msgEntry = {
        id: "msg_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        roomId: targetRoomId,
        fromUsername: username,
        fromName: sender.name || username,
        fromAvatar: sender.avatar || "🌸",
        fromAccessories: sender.avatarAccessories || {},
        toUsername: toUsername,
        toName: toName,
        toAvatar: toAvatar,
        toAccessories: toAccessories,
        type: msgType,
        content: safeContent,
        photoUrl: photoUrl,
        photoExpiresAt: photoExpiresAt,
        photoExpired: false,
        sticker: sticker,
        gift: gift,
        timestamp: nowIso,
        kstTime: nowKst,
        read: false,
        readBy: [username]
      };

      const messages = loadMessages();
      messages.push(msgEntry);
      saveMessages(messages);

      recordAccessLog(username, "CHAT_SEND", clientIp, userAgent, {
        roomId: targetRoomId,
        type: msgType,
        hasPhoto: !!photoUrl,
        hasSticker: !!sticker,
        hasGift: !!gift
      });

      // Web Push 발송 트리거
      try {
        let pushTargets = [];
        let pushTitle = `💌 ${sender.name || username}님의 새 메시지`;
        if (targetRoomId === "square") {
          pushTargets = Object.keys(db.users).filter(u => u !== username);
          pushTitle = `💬 [하루 광장] ${sender.name || username}님의 새 메시지`;
        } else if (targetRoomId.startsWith("group_")) {
          const groups = loadGroups();
          const grp = groups.find(g => g.roomId === targetRoomId);
          if (grp && grp.members) {
            pushTargets = grp.members.filter(u => u !== username);
            pushTitle = `👥 [${grp.name || '그룹 대화방'}] ${sender.name || username}님의 새 메시지`;
          }
        } else if (toUsername && toUsername !== "square") {
          pushTargets = [toUsername];
        }

        if (pushTargets.length > 0) {
          let pushBodyText = safeContent;
          if (sticker) pushBodyText = `🎀 [스티커] ${sticker.name || '귀여운 스티커'}`;
          else if (gift) pushBodyText = `🎁 [선물] ${gift.name || '특별한 선물'}`;
          else if (photoUrl) pushBodyText = `📷 [사진] ${safeContent || '새로운 사진 도착'}`;

          sendWebPushToUsers(pushTargets, {
            title: pushTitle,
            body: pushBodyText || "새로운 대화가 도착했습니다!",
            icon: "/public/icons/icon-192.png",
            badge: "/public/icons/badge-72.png",
            url: `/?open=chat&roomId=${encodeURIComponent(targetRoomId)}`,
            tag: "haru-chat-" + Date.now(),
            data: {
              roomId: targetRoomId,
              fromUsername: username,
              fromName: sender.name || username,
              withUser: username,
              type: msgType,
              timestamp: nowIso
            }
          }).catch(err => console.warn("[Web Push] Chat push error:", err.message));
        }
      } catch (pushErr) {
        console.warn("[Web Push] Chat push trigger error:", pushErr.message);
      }

      return sendJSON(res, 201, {
        success: true,
        message: msgEntry
      });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 17-A. [v3.5.0] 신규 멀티 그룹 대화방 생성 (POST /api/chat/create-group)
  if (req.method === "POST" && pathname === "/api/chat/create-group") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const sender = db.users[username];
      const rawMembers = Array.isArray(body.members) ? body.members : [];
      const memberSet = new Set([username]);
      rawMembers.forEach(m => {
        const mName = typeof m === 'object' && m ? (m.username || m.name) : m;
        if (mName && db.users[mName]) memberSet.add(mName);
      });

      const members = Array.from(memberSet);
      if (members.length < 2) {
        return sendJSON(res, 400, { success: false, message: "대화방에는 최소 1명 이상의 친구를 초대해야 합니다." });
      }

      const groups = loadGroups();
      const newRoomId = "group_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
      const memberNames = members.map(m => (db.users[m] && db.users[m].name) || m);
      const customName = (body.name || "").trim() || memberNames.join(', ');

      const newGroup = {
        roomId: newRoomId,
        name: customName,
        members: members,
        createdBy: username,
        createdAt: new Date().toISOString()
      };

      groups.push(newGroup);
      saveGroups(groups);

      // 시스템 환영 메시지 생성
      const nowIso = new Date().toISOString();
      const nowKst = getKSTTime();
      const sysMsg = {
        id: "msg_sys_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        roomId: newRoomId,
        fromUsername: "SYSTEM",
        fromName: "하루맞춤 알림",
        fromAvatar: "📢",
        type: "system",
        content: `🎉 ${sender.name || username}님이 그룹 대화방을 만들었습니다! (참여: ${memberNames.join(', ')})`,
        timestamp: nowIso,
        kstTime: nowKst,
        readBy: [username]
      };

      const messages = loadMessages();
      messages.push(sysMsg);
      saveMessages(messages);

      // 멤버들에게 Web Push 발송
      const pushTargets = members.filter(m => m !== username);
      if (pushTargets.length > 0) {
        sendWebPushToUsers(pushTargets, {
          title: `👥 [새 그룹 대화방 초대] ${sender.name || username}님`,
          body: `[${customName}] 대화방에 초대되었습니다!`,
          icon: "/public/icons/icon-192.png",
          badge: "/public/icons/badge-72.png",
          url: `/?open=chat&roomId=${encodeURIComponent(newRoomId)}`,
          tag: "haru-group-invite-" + Date.now(),
          data: {
            roomId: newRoomId,
            fromUsername: username
          }
        }).catch(err => console.warn("[Web Push] Group invite push error:", err.message));
      }

      return sendJSON(res, 201, {
        success: true,
        roomId: newRoomId,
        group: newGroup,
        message: sysMsg
      });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 17-B. [v3.5.0] 대화방 친구 추가 초대 (POST /api/chat/invite)
  if (req.method === "POST" && pathname === "/api/chat/invite") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const sender = db.users[username];
      const roomId = body.roomId;
      const rawNewMembers = Array.isArray(body.newMembers) ? body.newMembers : (Array.isArray(body.members) ? body.members : []);
      const newMemberUsernames = rawNewMembers.map(m => typeof m === 'object' && m ? (m.username || m.name) : m).filter(m => m && db.users[m]);

      if (newMemberUsernames.length === 0) {
        return sendJSON(res, 400, { success: false, message: "초대할 친구를 선택해 주세요." });
      }

      const groups = loadGroups();
      let targetGroup = null;
      let effectiveRoomId = roomId;

      if (roomId && roomId.startsWith("group_")) {
        // 기존 그룹방 초대
        targetGroup = groups.find(g => g.roomId === roomId);
        if (!targetGroup) {
          return sendJSON(res, 404, { success: false, message: "대화방을 찾을 수 없습니다." });
        }
        if (!targetGroup.members.includes(username)) {
          return sendJSON(res, 403, { success: false, message: "초대 권한이 없습니다." });
        }

        const actuallyAdded = [];
        newMemberUsernames.forEach(m => {
          if (!targetGroup.members.includes(m)) {
            targetGroup.members.push(m);
            actuallyAdded.push(m);
          }
        });

        if (actuallyAdded.length === 0) {
          return sendJSON(res, 400, { success: false, message: "이미 대화방에 참여 중인 친구들입니다." });
        }

        saveGroups(groups);
      } else {
        // 1:1 대화방에서 추가 초대 시 -> 새로운 멀티 그룹방으로 자동 승격 생성
        const baseMembers = [username];
        if (body.otherUser && db.users[body.otherUser]) {
          baseMembers.push(body.otherUser);
        } else if (roomId && roomId.includes('_') && !roomId.startsWith('group_')) {
          roomId.split('_').forEach(part => {
            if (db.users[part]) baseMembers.push(part);
          });
        }

        const allMemberSet = new Set([...baseMembers, ...newMemberUsernames]);
        const finalMembers = Array.from(allMemberSet);

        effectiveRoomId = "group_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
        const memberNames = finalMembers.map(m => (db.users[m] && db.users[m].name) || m);
        const autoName = memberNames.join(', ');

        targetGroup = {
          roomId: effectiveRoomId,
          name: autoName,
          members: finalMembers,
          createdBy: username,
          createdAt: new Date().toISOString()
        };

        groups.push(targetGroup);
        saveGroups(groups);
      }

      const addedNames = newMemberUsernames.map(m => (db.users[m] && db.users[m].name) || m);
      const nowIso = new Date().toISOString();
      const nowKst = getKSTTime();

      const sysMsg = {
        id: "msg_sys_" + Date.now() + "_" + Math.random().toString(36).substring(2, 6),
        roomId: effectiveRoomId,
        fromUsername: "SYSTEM",
        fromName: "하루맞춤 알림",
        fromAvatar: "📢",
        type: "system",
        content: `👋 ${sender.name || username}님이 ${addedNames.join(', ')}님을 대화방에 초대했습니다! 환영합니다 ✨`,
        timestamp: nowIso,
        kstTime: nowKst,
        readBy: [username]
      };

      const messages = loadMessages();
      messages.push(sysMsg);
      saveMessages(messages);

      // 새 멤버들에게 Web Push 발송
      sendWebPushToUsers(newMemberUsernames, {
        title: `👥 [대화방 초대] ${sender.name || username}님`,
        body: `대화방 [${targetGroup.name}]에 초대되었습니다!`,
        icon: "/public/icons/icon-192.png",
        badge: "/public/icons/badge-72.png",
        url: `/?open=chat&roomId=${encodeURIComponent(effectiveRoomId)}`,
        tag: "haru-invite-" + Date.now(),
        data: {
          roomId: effectiveRoomId,
          fromUsername: username
        }
      }).catch(err => console.warn("[Web Push] Invite push error:", err.message));

      return sendJSON(res, 201, {
        success: true,
        roomId: effectiveRoomId,
        group: targetGroup,
        message: sysMsg
      });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 18. [v3.3.0] 아이템 및 소셜 선물 보내기 (POST /api/chat/send-gift)
  if (req.method === "POST" && pathname === "/api/chat/send-gift") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const sender = db.users[username];
      const clientIp = getClientIp(req);
      const userAgent = req.headers["user-agent"] || "unknown";

      const giftId = body.giftId;
      let rawTo = body.toUsername;
      if (typeof rawTo === 'object' && rawTo) {
        rawTo = rawTo.username || rawTo.name;
      }
      let toUsername = (rawTo || "").trim();
      const customMessage = (body.message || "").trim();

      if (!giftId || !GIFT_CATALOG[giftId]) {
        return sendJSON(res, 400, { success: false, message: "올바른 선물을 선택해 주세요." });
      }

      // Case-insensitive user lookup fallback (Rule 6 authentic users defense)
      if (!db.users[toUsername]) {
        const foundKey = Object.keys(db.users).find(k => k.toLowerCase() === toUsername.toLowerCase());
        if (foundKey) toUsername = foundKey;
      }

      if (!toUsername || !db.users[toUsername]) {
        return sendJSON(res, 404, { success: false, message: `선물 받을 친구 [${toUsername || '미지정'}]를 찾을 수 없습니다.` });
      }

      if (toUsername === username) {
        return sendJSON(res, 400, { success: false, message: "나 자신에게는 선물할 수 없어요! 친구에게 선물해 보세요 😊" });
      }

      const gift = GIFT_CATALOG[giftId];
      const senderPoints = sender.totalPoints || 0;

      if (senderPoints < gift.price) {
        return sendJSON(res, 400, { 
          success: false, 
          message: `보유 포인트가 부족합니다. (필요: ${gift.price}P, 보유: ${senderPoints}P)` 
        });
      }

      const recipient = db.users[toUsername];

      // 1) 발신자 포인트 차감
      sender.totalPoints -= gift.price;

      // 2) 수신자 선물/아이템 즉시 지급 트랜잭션
      if (gift.type === "item") {
        recipient.items = recipient.items || {};
        recipient.items[gift.itemKey] = (recipient.items[gift.itemKey] || 0) + (gift.itemQty || 1);
      } else if (gift.type === "shield") {
        recipient.shields = Math.min(2, Math.max(0, (recipient.shields || 0) + (gift.itemQty || 1)));
      } else if (gift.type === "social") {
        recipient.gifts = recipient.gifts || [];
        recipient.gifts.push({
          giftId: gift.id,
          name: gift.name,
          icon: gift.icon,
          fromUsername: username,
          fromName: sender.name || username,
          kstDate: getKSTDateString(),
          bonusPoints: gift.bonusPoints || 0
        });
        if (gift.bonusPoints) {
          recipient.totalPoints = (recipient.totalPoints || 0) + gift.bonusPoints;
        }
      }

      sender.updatedAt = new Date().toISOString();
      recipient.updatedAt = new Date().toISOString();
      saveDB(db);

      // 3) 채팅 메시지 스레드에 선물 카드 생성 (그룹방 전달 지원)
      const roomId = body.roomId || getChatRoomId(username, toUsername);
      const nowIso = new Date().toISOString();
      const nowKst = getKSTTime();

      const safeContent = (customMessage || `${gift.name} 선물이 도착했습니다! ${gift.icon}`)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;");

      const msgEntry = {
        id: "msg_gift_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
        roomId: roomId,
        fromUsername: username,
        fromName: sender.name || username,
        fromAvatar: sender.avatar || "🌸",
        fromAccessories: sender.avatarAccessories || {},
        toUsername: toUsername,
        toName: recipient.name || toUsername,
        toAvatar: recipient.avatar || "🌸",
        toAccessories: recipient.avatarAccessories || {},
        type: "gift",
        content: safeContent,
        photoUrl: null,
        photoExpiresAt: null,
        photoExpired: false,
        sticker: null,
        gift: {
          giftId: gift.id,
          name: gift.name,
          icon: gift.icon,
          price: gift.price,
          type: gift.type,
          desc: gift.desc,
          bonusPoints: gift.bonusPoints || 0,
          claimed: true
        },
        timestamp: nowIso,
        kstTime: nowKst,
        read: false,
        readBy: [username]
      };

      const messages = loadMessages();
      messages.push(msgEntry);
      saveMessages(messages);

      recordAccessLog(username, "SEND_GIFT", clientIp, userAgent, {
        giftId: gift.id,
        giftName: gift.name,
        price: gift.price,
        recipient: toUsername,
        remainingPoints: sender.totalPoints
      });

      // Web Push 실시간 알림
      try {
        sendWebPushToUsers([toUsername], {
          title: `🎁 ${sender.name || username}님의 특별한 선물 도착!`,
          body: `[${gift.name}] ${safeContent}`,
          icon: "/public/icons/icon-192.png",
          badge: "/public/icons/badge-72.png",
          url: `/?open=chat&roomId=${encodeURIComponent(roomId)}`,
          tag: "haru-gift-" + Date.now(),
          data: {
            roomId: roomId,
            fromUsername: username,
            withUser: username,
            giftId: gift.id,
            timestamp: nowIso
          }
        }).catch(err => console.warn("[Web Push] Gift push error:", err.message));
      } catch (pushErr) {
        console.warn("[Web Push] Gift push trigger error:", pushErr.message);
      }

      return sendJSON(res, 201, {
        success: true,
        message: msgEntry,
        gift: gift,
        remainingPoints: sender.totalPoints,
        recipientStats: {
          items: recipient.items,
          shields: recipient.shields,
          totalPoints: recipient.totalPoints
        }
      });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 19. [v3.3.0] 선물 수령 확인 (POST /api/chat/claim-gift)
  if (req.method === "POST" && pathname === "/api/chat/claim-gift") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const messageId = body.messageId;
      const messages = loadMessages();
      const msg = messages.find(m => m.id === messageId);

      if (!msg || !msg.gift) {
        return sendJSON(res, 404, { success: false, message: "해당 선물 메시지를 찾을 수 없습니다." });
      }

      return sendJSON(res, 200, {
        success: true,
        message: "선물이 이미 수령되어 인벤토리에 안전하게 반영되었습니다! 🎁",
        gift: msg.gift
      });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // =========================================================================
  // 20. [v3.6.0] ⚔️ 퀴즈대결방 (Battle Arena) API
  // =========================================================================

  // 20-A. 퀴즈대결방 생성 및 친구 초대 (POST /api/battle/create)
  if (req.method === "POST" && pathname === "/api/battle/create") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const sender = db.users[username];
      const rawMembers = Array.isArray(body.members) ? body.members : (Array.isArray(body.invitedUsernames) ? body.invitedUsernames : []);
      const memberSet = new Set([username]);
      rawMembers.forEach(m => {
        const mName = typeof m === 'object' && m ? (m.username || m.name) : m;
        if (mName && db.users[mName]) memberSet.add(mName);
      });

      const members = Array.from(memberSet);
      if (members.length < 2) {
        return sendJSON(res, 400, { success: false, message: "퀴즈 대결에는 최소 1명 이상의 대결 상대를 초대해야 합니다." });
      }

      const questionCount = [5, 10, 15, 20].includes(Number(body.questionCount)) ? Number(body.questionCount) : 5;
      let normalizedSubject = body.subject || 'spelling';
      if (normalizedSubject === 'all') normalizedSubject = 'mixed';
      if (normalizedSubject === 'proverb') normalizedSubject = 'idiom';
      const subject = ['spelling', 'idiom', 'hanja', 'english', 'mixed'].includes(normalizedSubject) ? normalizedSubject : 'spelling';
      const level = body.level || 'all';
      const allowItems = (body.allowItems !== false); // 기본값 true

      const subjectNameMap = {
        spelling: "우리말 맞춤법",
        idiom: "속담·관용구",
        hanja: "한자·고사성어",
        english: "영어 스펠링",
        mixed: "종합 올스타전"
      };

      const title = (body.title || "").trim() || `${sender.name || username}님의 퀴즈 대결! ⚔️`;
      const questions = generateBattleQuestions(subject, level, questionCount);

      if (!questions || questions.length === 0) {
        return sendJSON(res, 500, { success: false, message: "대결 문제 세트를 생성하지 못했습니다." });
      }

      const defaultInventory = allowItems ? {
        battle_ink: 1,
        battle_wind: 1,
        battle_freeze: 1,
        battle_reflect: 1,
        battle_steal: 1,
        battle_lightning: 1,
        battle_peek: 1,
        battle_sight: 1,
        battle_bomb: 1,
        battle_rainbow: 1,
        battle_double: 1,
        battle_hint: 1
      } : {};

      const progress = {};
      members.forEach(m => {
        progress[m] = {
          joined: true,
          currentIndex: 0,
          score: 0,
          combo: 0,
          answers: [],
          inventory: { ...defaultInventory },
          completed: false,
          completedAt: null,
          totalTime: 0,
          activeEffects: [],
          hasReflect: false,
          hasSteal: false,
          hasRainbow: false
        };
      });

      let matchType = body.matchType || '1v1';
      if (!['1v1', '1v1v1', '1v1v1v1', '2v2'].includes(matchType)) {
        if (members.length === 2) matchType = '1v1';
        else if (members.length === 3) matchType = '1v1v1';
        else if (members.length >= 4) matchType = '1v1v1v1';
      }

      let teams = null;
      if (matchType === '2v2') {
        if (body.teams && Array.isArray(body.teams.A) && Array.isArray(body.teams.B)) {
          teams = body.teams;
        } else if (members.length >= 4) {
          teams = {
            A: [members[0], members[1]],
            B: [members[2], members[3]]
          };
        }
      }

      const roomId = "battle_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7);
      const readyStatus = { [username]: false };
      if (members.includes("맞춤요정")) {
        readyStatus["맞춤요정"] = true;
      }

      const newRoom = {
        id: roomId,
        roomId,
        title,
        creator: username,
        creatorName: sender.name || username,
        members,
        matchType,
        teams,
        status: "waiting",
        roundPhase: "waiting",
        currentQuestionIndex: 0,
        readyStatus,
        roundSubmissions: {},
        roundResults: {},
        nextRoundEffects: {},
        countdownStartTime: null,
        phaseStartTime: Date.now(),
        roundResultTime: null,
        questionCount,
        subject,
        level,
        allowItems,
        settings: {
          questionCount,
          subject,
          subjectName: subjectNameMap[subject] || "맞춤법",
          level,
          allowItems,
          matchType,
          teams
        },
        questions,
        progress,
        itemLog: [],
        winner: null,
        createdAt: new Date().toISOString(),
        completedAt: null
      };

      if (members.includes("맞춤요정") && progress["맞춤요정"]) {
        progress["맞춤요정"].lastActionTime = Date.now();
      }

      const rooms = loadBattleRooms();
      rooms.push(newRoom);
      saveBattleRooms(rooms);

      // 초대된 다른 친구들에게 웹 푸시 알림 발송 (v3.7.1: BATTLE_INVITE 타입 및 roomId 직행 페이로드 보장)
      const otherMembers = members.filter(m => m !== username);
      if (otherMembers.length > 0) {
        sendWebPushToUsers(otherMembers, {
          title: "⚔️ 퀴즈대결 도전장 도착!",
          body: `${sender.name || username}님이 '${title}' (${subjectNameMap[subject]}, ${questionCount}제) 대결에 초대했습니다!`,
          icon: "/public/icons/icon-192.png",
          badge: "/public/icons/badge-72.png",
          url: `/?open=battle&roomId=${encodeURIComponent(roomId)}`,
          type: "BATTLE_INVITE",
          roomId: roomId,
          battleRoomId: roomId
        });

        // 1:1 대화방(채팅창)에도 대결 초대 카드 메시지 자동 주입
        try {
          const msgs = loadMessages();
          otherMembers.forEach(targetUser => {
            const chatRoomId = getChatRoomId(username, targetUser);
            const inviteMsg = {
              id: "msg_battle_" + Date.now() + "_" + Math.random().toString(36).substring(2, 7),
              roomId: chatRoomId,
              fromUsername: username,
              fromName: sender.name || username,
              fromAvatar: sender.avatar || "🐰",
              fromAccessories: sender.accessories || {},
              toUsername: targetUser,
              toName: db.users[targetUser]?.name || targetUser,
              toAvatar: db.users[targetUser]?.avatar || "🌸",
              toAccessories: db.users[targetUser]?.accessories || {},
              type: "battle_invite",
              content: `⚔️ '${title}' 퀴즈대결에 초대했습니다!`,
              battleRoomId: roomId,
              battleSubject: subjectNameMap[subject] || "맞춤법",
              battleQuestionCount: questionCount,
              photoUrl: null,
              photoExpiresAt: null,
              photoExpired: false,
              sticker: null,
              gift: null,
              timestamp: new Date().toISOString(),
              kstTime: getKSTDateString() + " " + new Date().toTimeString().split(" ")[0],
              read: false,
              readBy: [username]
            };
            msgs.push(inviteMsg);
          });
          saveMessages(msgs);
        } catch (msgErr) {
          console.error("Failed to inject battle invite chat message:", msgErr);
        }
      }

      return sendJSON(res, 200, {
        success: true,
        message: "퀴즈대결방이 성공적으로 생성되었습니다!",
        roomId,
        room: newRoom
      });
    } catch (e) {
      console.error("Battle Create Error:", e);
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 20-B. 퀴즈대결 로비 정보 조회 (도전자 목록 + 열려있는 방/내 대결방 목록) (GET /api/battle/rooms)
  if (req.method === "GET" && pathname === "/api/battle/rooms") {
    try {
      const token = parsedUrl.searchParams.get("token") || (req.headers["authorization"] || "").replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const rooms = loadBattleRooms();

      // 1) 48시간 지난 오래된 방 자동 정리
      const now = Date.now();
      const validRooms = rooms.filter(r => {
        const createdTime = new Date(r.createdAt).getTime();
        return (now - createdTime) < (48 * 60 * 60 * 1000);
      });
      if (validRooms.length !== rooms.length) {
        saveBattleRooms(validRooms);
      }

      // 2) 로비 참여 가능 유저 목록 (AUTHENTIC_USERS + db.users)
      const lobbyUsers = [];
      const userList = Object.keys(db.users || {});
      const prioritized = ['단민러브', '미니미니', '민지', '맞춤요정', '미니미니채', '도비사랑녀', 'Ljh'];
      const allUserKeys = Array.from(new Set([...prioritized, ...userList]));

      allUserKeys.forEach(uName => {
        const u = (db.users && db.users[uName]) || {};
        const isAI = (uName === '맞춤요정');
        const isMe = (uName === username);

        // Check if user is currently in an in-progress battle
        const activeInBattle = validRooms.some(r => r.status === 'in_progress' && r.members && r.members.includes(uName));

        let avatar = u.avatar || '🌸';
        if (!u.avatar) {
          if (uName === '단민러브') avatar = '🐰';
          else if (uName === '민지') avatar = '🎀';
          else if (uName === '미니미니') avatar = '🐶';
          else if (uName === '미니미니채') avatar = '🍀';
          else if (uName === '도비사랑녀') avatar = '🐥';
          else if (uName === 'Ljh') avatar = '🍀';
        }

        lobbyUsers.push({
          username: uName,
          name: u.name || uName,
          nickname: u.name || uName,
          avatar,
          grade: u.grade || (isAI ? 'AI 맞춤법 튜터' : '학습자'),
          isAI,
          isMe,
          status: isAI ? 'ready' : (activeInBattle ? 'in_battle' : 'ready'),
          statusLabel: isAI ? '24시간 즉시대결' : (activeInBattle ? '대결 진행중' : '대결 대기중'),
          battleStats: u.battleStats || { rp: 1000, wins: 0, losses: 0, streak: 0, tier: 'silver' }
        });
      });

      // 3) 대결방 목록 (내가 참여한 방 + 아직 다른 회원이 참여할 수 있는 열린 방)
      const visibleRooms = validRooms.filter(r => {
        const isMyRoom = r.members && r.members.includes(username);
        const isOpenRoom = (r.status === 'in_progress' || r.status === 'waiting') && (!r.members || r.members.length < 4);
        return isMyRoom || isOpenRoom;
      });

      visibleRooms.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      const roomSummaries = visibleRooms.slice(0, 30).map(r => {
        const myProg = r.progress && r.progress[username];
        const isMember = r.members && r.members.includes(username);
        const isCreator = (r.creator === username);
        const qCount = r.questionCount || (r.settings && r.settings.questionCount) || (r.questions && r.questions.length) || 5;
        const subj = r.subject || (r.settings && r.settings.subject) || 'spelling';
        const lvl = r.level || (r.settings && r.settings.level) || 'all';
        const itemsAllowed = (r.allowItems !== undefined ? r.allowItems : (r.settings ? r.settings.allowItems : true));
        const matchType = r.matchType || (r.settings && r.settings.matchType) || '1v1';
        const teams = r.teams || (r.settings && r.settings.teams) || null;

        return {
          id: r.roomId || r.id,
          roomId: r.roomId || r.id,
          title: r.title,
          creator: r.creator,
          creatorName: r.creatorName,
          members: r.members,
          memberCount: r.members.length,
          matchType,
          teams,
          status: r.status,
          questionCount: qCount,
          subject: subj,
          level: lvl,
          allowItems: itemsAllowed,
          settings: r.settings,
          isMember,
          isCreator,
          myCompleted: myProg ? myProg.completed : false,
          myScore: myProg ? myProg.score : 0,
          myIndex: myProg ? (myProg.currentIndex || 0) : 0,
          winner: r.winner,
          winnerName: r.winner && db.users[r.winner] ? db.users[r.winner].name : r.winner,
          createdAt: r.createdAt,
          completedAt: r.completedAt
        };
      });

      return sendJSON(res, 200, {
        success: true,
        users: lobbyUsers,
        rooms: roomSummaries
      });
    } catch (e) {
      console.error("Battle Rooms List Error:", e);
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 20-C. 퀴즈대결방 상세 및 실시간 진행 상태 조회 (GET /api/battle/room)
  if (req.method === "GET" && pathname === "/api/battle/room") {
    try {
      const token = parsedUrl.searchParams.get("token") || (req.headers["authorization"] || "").replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const roomId = parsedUrl.searchParams.get("roomId");
      if (!roomId) {
        return sendJSON(res, 400, { success: false, message: "방 ID가 필요합니다." });
      }

      const rooms = loadBattleRooms();
      const room = rooms.find(r => r.roomId === roomId || r.id === roomId);
      if (!room) {
        return sendJSON(res, 404, { success: false, message: "대결방을 찾을 수 없습니다." });
      }

      // 만약 아직 멤버가 아니라면 (대결방 참여 슬롯이 있는 경우 자동 참여 승인)
      let joinedJustNow = false;
      if (!room.members.includes(username)) {
        if (room.status === 'in_progress' || room.status === 'waiting') {
          room.members.push(username);
          if (!room.progress) room.progress = {};
          const defaultInventory = (room.allowItems !== false && (room.settings ? room.settings.allowItems !== false : true)) ? {
            battle_ink: 1, battle_wind: 1, battle_freeze: 1, battle_reflect: 1,
            battle_steal: 1, battle_lightning: 1, battle_peek: 1, battle_sight: 1,
            battle_bomb: 1, battle_rainbow: 1, battle_double: 1, battle_hint: 1
          } : {};
          room.progress[username] = {
            joined: true,
            currentIndex: 0,
            score: 0,
            combo: 0,
            answers: [],
            inventory: { ...defaultInventory },
            completed: false,
            completedAt: null,
            totalTime: 0,
            activeEffects: [],
            hasReflect: false,
            hasSteal: false,
            hasRainbow: false
          };
          joinedJustNow = true;
        }
      }

      // 1) Countdown transition check
      const now = Date.now();
      let stateChanged = false;
      if (room.status === 'countdown') {
        const cdStart = room.countdownStartTime || now;
        if (now - cdStart >= 3200) {
          room.status = 'in_progress';
          room.roundPhase = 'answering';
          room.phaseStartTime = now;
          // Apply nextRoundEffects
          if (room.nextRoundEffects) {
            Object.entries(room.nextRoundEffects).forEach(([target, effects]) => {
              if (room.progress[target]) {
                room.progress[target].activeEffects = room.progress[target].activeEffects || [];
                effects.forEach(eff => {
                  const itemDef = BATTLE_ITEMS[eff.itemKey];
                  room.progress[target].activeEffects.push({
                    type: eff.itemKey.replace("battle_", ""),
                    name: eff.name,
                    icon: itemDef ? itemDef.icon : "✨",
                    expireAt: now + (itemDef && itemDef.duration ? itemDef.duration : 4000),
                    from: eff.from
                  });
                });
              }
            });
            room.nextRoundEffects = {};
          }
          stateChanged = true;
        }
      }

      // 2) Answering phase 16s timeout check
      if (room.status === 'in_progress' && (room.roundPhase === 'answering' || !room.roundPhase)) {
        const pStart = room.phaseStartTime || now;
        if (now - pStart >= 16000) {
          const curIdx = room.currentQuestionIndex || 0;
          const totalQ = room.settings.questionCount || 5;
          room.roundSubmissions = room.roundSubmissions || {};
          room.roundSubmissions[curIdx] = room.roundSubmissions[curIdx] || {};
          room.members.forEach(m => {
            if (!room.roundSubmissions[curIdx][m]) {
              room.roundSubmissions[curIdx][m] = {
                selectedIndex: -1,
                isCorrect: false,
                timeSpent: 15,
                points: 0,
                submittedAt: now,
                timeout: true
              };
              if (room.progress[m]) {
                room.progress[m].combo = 0;
                room.progress[m].currentIndex = curIdx + 1;
                room.progress[m].answers = room.progress[m].answers || [];
                room.progress[m].answers.push({ qIndex: curIdx, isCorrect: false, selectedIndex: -1, points: 0, timeSpent: 15 });
              }
            }
          });

          room.roundPhase = "round_result";
          room.roundResultTime = now;
          room.readyStatus = {};
          if (curIdx >= totalQ - 1) {
            room.status = "completed";
            finalizeBattleRoom(room, db);
          }
          stateChanged = true;
        }
      }

      // AI 맞춤요정이 포함되어 있다면 봇 스텝 시뮬레이션
      const aiChanged = processAiMascotBot(room, db);

      // 만료된 활성 효과(activeEffects) 정리
      let effectsChanged = false;
      if (room.progress) {
        Object.keys(room.progress).forEach(m => {
          const prog = room.progress[m];
          if (prog && Array.isArray(prog.activeEffects)) {
            const beforeLen = prog.activeEffects.length;
            prog.activeEffects = prog.activeEffects.filter(eff => (eff.expireAt > now || eff.expiresAt > now));
            if (prog.activeEffects.length !== beforeLen) effectsChanged = true;
          }
        });
      }

      if (joinedJustNow || aiChanged || effectsChanged || stateChanged) {
        saveBattleRooms(rooms);
      }

      // Ensure top-level compatibility on room
      room.questionCount = room.questionCount || (room.settings && room.settings.questionCount) || (room.questions && room.questions.length) || 5;
      room.subject = room.subject || (room.settings && room.settings.subject) || 'spelling';
      room.level = room.level || (room.settings && room.settings.level) || 'all';
      room.allowItems = (room.allowItems !== undefined ? room.allowItems : (room.settings ? room.settings.allowItems : true));
      room.matchType = room.matchType || (room.settings && room.settings.matchType) || '1v1';
      room.teams = room.teams || (room.settings && room.settings.teams) || null;

      // 멤버별 프로필 정보 부가
      const memberProfiles = {};
      room.members.forEach(m => {
        const u = db.users[m] || {};
        memberProfiles[m] = {
          username: m,
          name: u.name || m,
          avatar: u.avatar || (m === '맞춤요정' ? '🌸' : (m === '단민러브' ? '🐰' : (m === '민지' ? '🎀' : (m === '도비사랑녀' ? '🐥' : (m === 'Ljh' || m === '미니미니채' ? '🍀' : '🐶'))))),
          grade: u.grade || (m === '맞춤요정' ? 'AI 맞춤법 튜터' : '초·중·고 학습자'),
          accessories: u.accessories || {}
        };
      });

      return sendJSON(res, 200, {
        success: true,
        room,
        memberProfiles
      });
    } catch (e) {
      console.error("Battle Room Get Error:", e);
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 20-D. 퀴즈대결 문제 풀이 제출 (POST /api/battle/submit-answer)
  if (req.method === "POST" && pathname === "/api/battle/submit-answer") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const { roomId, questionIndex, selectedIndex, selectedOptionIndex, timeSpent } = body;
      const actualSelectedIndex = (selectedOptionIndex !== undefined ? selectedOptionIndex : selectedIndex);
      const rooms = loadBattleRooms();
      const room = rooms.find(r => r.roomId === roomId || r.id === roomId);
      if (!room) {
        return sendJSON(res, 404, { success: false, message: "대결방을 찾을 수 없습니다." });
      }

      if (!room.members.includes(username)) {
        return sendJSON(res, 403, { success: false, message: "대결 참가자가 아닙니다." });
      }

      const userProg = room.progress[username];
      if (!userProg) {
        return sendJSON(res, 400, { success: false, message: "진행 정보를 찾을 수 없습니다." });
      }

      if (userProg.completed) {
        return sendJSON(res, 400, { success: false, message: "이미 모든 대결 문제를 완료했습니다." });
      }

      const q = room.questions[questionIndex];
      if (!q) {
        return sendJSON(res, 400, { success: false, message: "유효하지 않은 문제 번호입니다." });
      }

      // 1) 정답 판정 (무지개 찬스 버프 체크)
      let isCorrect = (Number(actualSelectedIndex) === q.answerIndex);
      if (!isCorrect && userProg.hasRainbow) {
        isCorrect = true;
        userProg.hasRainbow = false; // 1회 소모
      }

      // 2) 점수 계산
      let points = 0;
      if (isCorrect) {
        points = 20; // 기본 정답 20P
        userProg.combo = (userProg.combo || 0) + 1;
        // 콤보 보너스
        if (userProg.combo >= 5) points += 10;
        else if (userProg.combo >= 4) points += 6;
        else if (userProg.combo >= 3) points += 4;
        else if (userProg.combo >= 2) points += 2;
        // 스피드 보너스 (3초 이내 정답)
        if (Number(timeSpent) <= 3) points += 5;
      } else {
        userProg.combo = 0;
      }

      // 3) 시한폭탄 감점 체크 (폭탄이 걸려있는데 오답이거나 6초 초과)
      const now = Date.now();
      const bombIdx = (userProg.activeEffects || []).findIndex(e => e.type === 'bomb');
      if (bombIdx >= 0) {
        const bomb = userProg.activeEffects[bombIdx];
        if (!isCorrect || Number(timeSpent) > 6 || now > bomb.expireAt) {
          points = Math.max(-userProg.score, -30); // 최대 -30P 폭발 감점
        }
        userProg.activeEffects.splice(bombIdx, 1); // 폭탄 소멸
      }

      // 4) 번개 스틸 (battle_steal) 발동
      let stealNotice = null;
      if (isCorrect && userProg.hasSteal) {
        userProg.hasSteal = false;
        // 나를 제외한 방 내 최고 점수자 찾기
        let highestRival = null;
        let highestScore = -1;
        room.members.forEach(m => {
          if (m !== username && room.progress[m] && room.progress[m].score > highestScore) {
            highestScore = room.progress[m].score;
            highestRival = m;
          }
        });
        if (highestRival && highestScore > 0) {
          const stealAmt = Math.min(25, highestScore);
          room.progress[highestRival].score -= stealAmt;
          points += stealAmt;
          stealNotice = `${highestRival}님으로부터 ⚡ 25P를 스틸했습니다!`;
        }
      }

      userProg.score = Math.max(0, userProg.score + points);
      userProg.currentIndex = questionIndex + 1;
      userProg.totalTime = (userProg.totalTime || 0) + Number(timeSpent || 0);
      userProg.answers.push({
        qIndex: questionIndex,
        isCorrect,
        selectedIndex,
        points,
        timeSpent: Number(timeSpent || 0)
      });

      // 전 문항 완료 여부
      if (userProg.currentIndex >= room.settings.questionCount) {
        userProg.completed = true;
        userProg.completedAt = new Date().toISOString();
      }

      // 라운드 동기화 제출 기록
      room.roundSubmissions = room.roundSubmissions || {};
      room.roundSubmissions[questionIndex] = room.roundSubmissions[questionIndex] || {};
      room.roundSubmissions[questionIndex][username] = {
        selectedIndex: actualSelectedIndex,
        isCorrect,
        timeSpent: Number(timeSpent || 0),
        points,
        submittedAt: Date.now()
      };

      // 해당 문제 전원 제출 확인 및 라운드 결과 비교 생성
      const allSubmittedForThisQ = room.members.every(m => room.roundSubmissions[questionIndex] && room.roundSubmissions[questionIndex][m]);
      if (allSubmittedForThisQ) {
        room.roundPhase = "round_result";
        room.roundResultTime = Date.now();
        room.readyStatus = {}; // 다음 라운드를 위한 준비 상태 초기화

        // 스피드 킹 보너스 (+5P)
        const roundSubs = room.roundSubmissions[questionIndex];
        let fastestUser = null;
        let minTime = 999;
        Object.entries(roundSubs).forEach(([mName, s]) => {
          if (s.isCorrect && s.timeSpent < minTime) {
            minTime = s.timeSpent;
            fastestUser = mName;
          }
        });
        if (fastestUser && Object.keys(roundSubs).length > 1) {
          roundSubs[fastestUser].points += 5;
          roundSubs[fastestUser].speedBonus = true;
          if (room.progress[fastestUser]) {
            room.progress[fastestUser].score += 5;
          }
        }

        room.roundResults = room.roundResults || {};
        room.roundResults[questionIndex] = {
          qIndex: questionIndex,
          question: q,
          submissions: roundSubs,
          fastestUser,
          completedAt: Date.now()
        };

        // 마지막 문제였다면 경기 완료
        if (questionIndex >= room.settings.questionCount - 1) {
          room.status = "completed";
          finalizeBattleRoom(room, db);
        }
      }

      // 5) 전원 완료 시 승패 판정 및 배틀 랭킹(RP / stats) 집계 (1:1, 1:1:1, 1:1:1:1, 2:2 팀전)
      const allFinished = room.members.every(m => room.progress[m] && room.progress[m].completed);
      if (allFinished && room.status !== "completed") {
        finalizeBattleRoom(room, db);
      }

      processAiMascotBot(room, db);
      saveBattleRooms(rooms);

      return sendJSON(res, 200, {
        success: true,
        isCorrect,
        pointsEarned: points,
        combo: userProg.combo,
        myScore: userProg.score,
        stealNotice,
        allFinished,
        allSubmitted: allSubmittedForThisQ,
        roundPhase: room.roundPhase,
        currentQuestionIndex: room.currentQuestionIndex,
        room
      });
    } catch (e) {
      console.error("Battle Submit Error:", e);
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 20-E. 퀴즈대결 아이템 사용 (POST /api/battle/use-item)
  if (req.method === "POST" && pathname === "/api/battle/use-item") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const { roomId, itemKey, targetUsername } = body;
      const itemDef = BATTLE_ITEMS[itemKey];
      if (!itemDef) {
        return sendJSON(res, 400, { success: false, message: "존재하지 않는 배틀 아이템입니다." });
      }

      const rooms = loadBattleRooms();
      const room = rooms.find(r => r.roomId === roomId || r.id === roomId);
      if (!room) {
        return sendJSON(res, 404, { success: false, message: "대결방을 찾을 수 없습니다." });
      }

      if (!room.members.includes(username)) {
        return sendJSON(res, 403, { success: false, message: "대결 참가자가 아닙니다." });
      }

      const myProg = room.progress[username];
      if (!myProg || !myProg.inventory || (myProg.inventory[itemKey] || 0) <= 0) {
        return sendJSON(res, 400, { success: false, message: "해당 아이템 잔여 수량이 부족합니다." });
      }

      // 아이템 차감
      myProg.inventory[itemKey] -= 1;

      // 타겟 지정 유효성 검사 (2:2 팀전 팀킬 방지 포함)
      let actualTarget = targetUsername;
      if (room.matchType === '2v2' && room.teams) {
        const myTeam = (room.teams.A && room.teams.A.includes(username)) ? 'A' : 'B';
        const opposingTeam = myTeam === 'A' ? 'B' : 'A';
        const opponents = room.teams[opposingTeam] || [];
        if (itemDef.type === "attack") {
          if (!actualTarget || !opponents.includes(actualTarget)) {
            actualTarget = opponents[0] || actualTarget;
          }
        }
      } else if (itemDef.type === "attack" && (!actualTarget || !room.members.includes(actualTarget) || actualTarget === username)) {
        // 상대방 중 첫 번째 유저 자동 지정
        actualTarget = room.members.find(m => m !== username);
      }

      let reflected = false;
      const now = Date.now();

      // 반사 방패(reflect) 판정
      if (itemDef.type === "attack" && actualTarget && room.progress[actualTarget] && room.progress[actualTarget].hasReflect) {
        room.progress[actualTarget].hasReflect = false; // 반사 방패 소모
        reflected = true;
        actualTarget = username; // 공격이 발신자 본인에게 역반사!
      }

      // 아이템 효과 적용
      if (itemKey === "battle_ink") {
        const targetProg = room.progress[actualTarget];
        targetProg.activeEffects = targetProg.activeEffects || [];
        targetProg.activeEffects.push({
          type: "ink",
          name: "먹물 벼루",
          icon: "墨",
          expireAt: now + itemDef.duration,
          from: username
        });
      } else if (itemKey === "battle_wind") {
        const targetProg = room.progress[actualTarget];
        targetProg.activeEffects = targetProg.activeEffects || [];
        targetProg.activeEffects.push({
          type: "wind",
          name: "모래바람",
          icon: "🌪️",
          expireAt: now + itemDef.duration,
          from: username
        });
      } else if (itemKey === "battle_freeze") {
        const targetProg = room.progress[actualTarget];
        targetProg.activeEffects = targetProg.activeEffects || [];
        targetProg.activeEffects.push({
          type: "freeze",
          name: "꽁꽁 얼음",
          icon: "❄️",
          expireAt: now + itemDef.duration,
          from: username
        });
      } else if (itemKey === "battle_reflect") {
        myProg.hasReflect = true;
      } else if (itemKey === "battle_steal") {
        myProg.hasSteal = true;
      } else if (itemKey === "battle_peek") {
        myProg.activeEffects = myProg.activeEffects || [];
        myProg.activeEffects.push({
          type: "peek",
          name: "천리안 심안",
          icon: "👁️",
          expireAt: now + itemDef.duration,
          target: actualTarget
        });
      } else if (itemKey === "battle_bomb") {
        const targetProg = room.progress[actualTarget];
        targetProg.activeEffects = targetProg.activeEffects || [];
        targetProg.activeEffects.push({
          type: "bomb",
          name: "째깍 시한폭탄",
          icon: "💣",
          expireAt: now + itemDef.duration,
          from: username
        });
      } else if (itemKey === "battle_rainbow") {
        myProg.hasRainbow = true;
      }

      // 아이템 사용 로그 기록
      room.itemLog = room.itemLog || [];
      room.itemLog.push({
        from: username,
        fromName: (db.users[username] && db.users[username].name) || username,
        target: actualTarget,
        targetName: (db.users[actualTarget] && db.users[actualTarget].name) || actualTarget,
        item: itemDef,
        reflected,
        time: getKSTTime()
      });

      saveBattleRooms(rooms);

      return sendJSON(res, 200, {
        success: true,
        message: reflected ? `⚡ 상대방의 반사 방패로 인해 ${itemDef.name} 효과가 나에게 튕겨 나왔습니다!` : `✨ ${itemDef.name} 사용 성공!`,
        reflected,
        actualTarget,
        targetUser: actualTarget,
        targetUsername: actualTarget,
        item: itemDef,
        room
      });
    } catch (e) {
      console.error("Battle Item Use Error:", e);
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 20-G. 퀴즈대결 준비 완료/시작 토글 (POST /api/battle/ready)
  if (req.method === "POST" && pathname === "/api/battle/ready") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const { roomId } = body;
      const rooms = loadBattleRooms();
      const room = rooms.find(r => r.roomId === roomId || r.id === roomId);
      if (!room) {
        return sendJSON(res, 404, { success: false, message: "대결방을 찾을 수 없습니다." });
      }

      if (!room.members.includes(username)) {
        return sendJSON(res, 403, { success: false, message: "대결 참가자가 아닙니다." });
      }

      room.readyStatus = room.readyStatus || {};
      const currentReady = !!room.readyStatus[username];
      room.readyStatus[username] = !currentReady;

      // AI mascot auto-ready
      if (room.members.includes("맞춤요정")) {
        room.readyStatus["맞춤요정"] = true;
      }

      const now = Date.now();
      const allReady = room.members.every(m => room.readyStatus[m]);

      // 1) 대기실 상태에서 전원 준비 완료 시 -> 3,2,1 카운트다운 시작
      if (room.status === "waiting" && allReady && room.members.length >= 2) {
        room.status = "countdown";
        room.countdownStartTime = now;
        room.currentQuestionIndex = 0;
        room.roundPhase = "answering";
        room.phaseStartTime = now + 3200;
        room.readyStatus = {};
      }
      // 2) 1문제 결과 화면에서 전원 준비 완료 시 -> 다음 문제 카운트다운 시작
      else if (room.status === "in_progress" && (room.roundPhase === "round_result" || room.roundPhase === "item_select") && allReady) {
        const curIdx = room.currentQuestionIndex || 0;
        const totalQ = room.settings.questionCount || 5;
        if (curIdx + 1 < totalQ) {
          room.currentQuestionIndex = curIdx + 1;
          room.status = "countdown";
          room.countdownStartTime = now;
          room.roundPhase = "answering";
          room.phaseStartTime = now + 3200;
          room.readyStatus = {};

          // 예약된 다음 라운드 아이템 효과 적용
          if (room.nextRoundEffects) {
            Object.entries(room.nextRoundEffects).forEach(([target, effects]) => {
              if (room.progress[target]) {
                room.progress[target].activeEffects = room.progress[target].activeEffects || [];
                effects.forEach(eff => {
                  const itemDef = BATTLE_ITEMS[eff.itemKey];
                  room.progress[target].activeEffects.push({
                    type: eff.itemKey.replace("battle_", ""),
                    name: eff.name,
                    icon: itemDef ? itemDef.icon : "✨",
                    expireAt: now + 3200 + (itemDef && itemDef.duration ? itemDef.duration : 4000),
                    from: eff.from
                  });
                });
              }
            });
            room.nextRoundEffects = {};
          }
        } else {
          room.status = "completed";
          finalizeBattleRoom(room, db);
        }
      }

      processAiMascotBot(room, db);
      saveBattleRooms(rooms);

      return sendJSON(res, 200, {
        success: true,
        ready: room.readyStatus[username],
        status: room.status,
        roundPhase: room.roundPhase,
        room
      });
    } catch (e) {
      console.error("Battle Ready Error:", e);
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 20-H. 다음 문제 대비 전략 아이템 선택 예약 (POST /api/battle/select-round-item)
  if (req.method === "POST" && pathname === "/api/battle/select-round-item") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const { roomId, itemKey, targetUsername } = body;
      const itemDef = BATTLE_ITEMS[itemKey];
      if (!itemDef) {
        return sendJSON(res, 400, { success: false, message: "존재하지 않는 배틀 아이템입니다." });
      }

      const rooms = loadBattleRooms();
      const room = rooms.find(r => r.roomId === roomId || r.id === roomId);
      if (!room) {
        return sendJSON(res, 404, { success: false, message: "대결방을 찾을 수 없습니다." });
      }

      const myProg = room.progress[username];
      if (!myProg || !myProg.inventory || (myProg.inventory[itemKey] || 0) <= 0) {
        return sendJSON(res, 400, { success: false, message: "해당 아이템 잔여 수량이 부족합니다." });
      }

      // 아이템 차감
      myProg.inventory[itemKey] -= 1;

      // 타겟 판별 (2:2 팀전 팀킬 방지 포함)
      let actualTarget = targetUsername;
      if (room.matchType === "2v2" && room.teams) {
        const myTeam = (room.teams.A && room.teams.A.includes(username)) ? "A" : "B";
        const oppTeam = myTeam === "A" ? "B" : "A";
        const opponents = room.teams[oppTeam] || [];
        if (itemDef.type === "attack") {
          if (!actualTarget || !opponents.includes(actualTarget)) {
            actualTarget = opponents[0] || opponents[1];
          }
        } else {
          actualTarget = username;
        }
      } else if (itemDef.type === "attack") {
        if (!actualTarget || actualTarget === username || !room.members.includes(actualTarget)) {
          actualTarget = room.members.find(m => m !== username);
        }
      } else {
        actualTarget = username;
      }

      room.nextRoundEffects = room.nextRoundEffects || {};
      room.nextRoundEffects[actualTarget] = room.nextRoundEffects[actualTarget] || [];
      room.nextRoundEffects[actualTarget].push({
        itemKey,
        name: itemDef.name,
        type: itemDef.type,
        from: username
      });

      room.itemLog = room.itemLog || [];
      room.itemLog.push({
        from: username,
        fromName: (db.users[username] && db.users[username].name) || username,
        target: actualTarget,
        item: itemDef,
        time: getKSTTime(),
        note: "다음 문제 발동 예약"
      });

      saveBattleRooms(rooms);

      return sendJSON(res, 200, {
        success: true,
        message: `✨ ${itemDef.name} 선택 완료! 다음 문제에 발동됩니다.`,
        targetUsername: actualTarget,
        room
      });
    } catch (e) {
      console.error("Select Round Item Error:", e);
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 20-F. 퀴즈대결 전용 랭킹 집계 (GET /api/battle/rankings)
  if (req.method === "GET" && pathname === "/api/battle/rankings") {
    try {
      const db = loadDB();
      const users = db.users || {};

      // 4인 실제 계정 데이터 기본 배틀 전적 보장 (Rule 6 데이터 무결성 보존)
      const list = Object.keys(users).map(uname => {
        const u = users[uname];
        const stats = u.battleStats || {
          rp: 1000,
          games: 0,
          wins: 0,
          losses: 0,
          winRate: 0,
          streak: 0,
          maxStreak: 0
        };

        // 티어 판정
        let tierLabel = "브론즈 🥉";
        let tier = "bronze";
        let tierClass = "tier-bronze";
        if (stats.rp >= 1800) { tierLabel = "마스터 👑"; tier = "master"; tierClass = "tier-master"; }
        else if (stats.rp >= 1500) { tierLabel = "다이아몬드 💎"; tier = "diamond"; tierClass = "tier-diamond"; }
        else if (stats.rp >= 1200) { tierLabel = "골드 🥇"; tier = "gold"; tierClass = "tier-gold"; }
        else if (stats.rp >= 1000) { tierLabel = "실버 🥈"; tier = "silver"; tierClass = "tier-silver"; }

        return {
          username: uname,
          name: u.name || uname,
          nickname: u.name || uname,
          avatar: u.avatar || '🌸',
          accessories: u.accessories || {},
          rp: stats.rp,
          games: stats.games,
          wins: stats.wins,
          losses: stats.losses,
          winRate: stats.winRate,
          streak: stats.streak,
          maxStreak: stats.maxStreak,
          tier,
          tierLabel,
          tierClass
        };
      });

      // 랭킹 정렬: RP 내림차순 -> 승수 내림차순 -> 승률 내림차순
      list.sort((a, b) => (b.rp - a.rp) || (b.wins - a.wins) || (b.winRate - a.winRate));
      const rankedList = list.map((item, idx) => ({
        ...item,
        rank: idx + 1
      }));

      return sendJSON(res, 200, {
        success: true,
        rankings: rankedList
      });
    } catch (e) {
      console.error("Battle Rankings Error:", e);
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 20-G. 퀴즈대결방 삭제 또는 나가기 (POST /api/battle/delete-room)
  if (req.method === "POST" && pathname === "/api/battle/delete-room") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const { roomId } = body;
      if (!roomId) {
        return sendJSON(res, 400, { success: false, message: "방 ID가 필요합니다." });
      }

      const rooms = loadBattleRooms();
      const idx = rooms.findIndex(r => r.roomId === roomId || r.id === roomId);
      if (idx === -1) {
        return sendJSON(res, 404, { success: false, message: "대결방을 찾을 수 없습니다." });
      }

      const room = rooms[idx];
      // 방 개설자이거나 참가자인 경우 방 목록에서 정리
      if (room.creator !== username && !room.members.includes(username)) {
        return sendJSON(res, 403, { success: false, message: "방 삭제 권한이 없습니다." });
      }

      rooms.splice(idx, 1);
      saveBattleRooms(rooms);

      return sendJSON(res, 200, {
        success: true,
        message: "대결방이 정상적으로 삭제되었습니다.",
        roomId
      });
    } catch (e) {
      console.error("Battle Delete Room Error:", e);
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 14. Web Push: VAPID 공개키 조회 (GET /api/push/vapid-public-key)
  if (req.method === "GET" && pathname === "/api/push/vapid-public-key") {
    if (!vapidKeys || !vapidKeys.publicKey) {
      return sendJSON(res, 503, { success: false, message: "VAPID 키가 아직 준비되지 않았습니다." });
    }
    return sendJSON(res, 200, {
      success: true,
      publicKey: vapidKeys.publicKey
    });
  }

  // 15. Web Push: 기기 푸시 구독 등록 (POST /api/push/subscribe)
  if (req.method === "POST" && pathname === "/api/push/subscribe") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const subscription = body.subscription;
      if (!subscription || !subscription.endpoint) {
        return sendJSON(res, 400, { success: false, message: "유효한 푸시 구독 정보가 필요합니다." });
      }

      const subs = getPushSubscriptions();
      const existingIdx = subs.findIndex(s => s.subscription && s.subscription.endpoint === subscription.endpoint);
      const subRecord = {
        username,
        subscription,
        userAgent,
        updatedAt: new Date().toISOString()
      };

      if (existingIdx >= 0) {
        subs[existingIdx] = subRecord;
      } else {
        subs.push(subRecord);
      }

      savePushSubscriptions(subs);
      return sendJSON(res, 200, { success: true, message: "푸시 알림 구독이 등록되었습니다." });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 16. Web Push: 기기 푸시 구독 해제 (POST /api/push/unsubscribe)
  if (req.method === "POST" && pathname === "/api/push/unsubscribe") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const endpoint = body.endpoint || (body.subscription && body.subscription.endpoint);
      const subs = getPushSubscriptions();
      const filtered = subs.filter(s => {
        if (s.username !== username) return true;
        if (endpoint && s.subscription && s.subscription.endpoint === endpoint) return false;
        if (!endpoint) return false;
        return true;
      });

      savePushSubscriptions(filtered);
      return sendJSON(res, 200, { success: true, message: "푸시 알림 구독이 해제되었습니다." });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // 17. Web Push: 즉시 테스트 알림 발송 (POST /api/push/test)
  if (req.method === "POST" && pathname === "/api/push/test") {
    try {
      const authHeader = req.headers["authorization"] || "";
      const body = await parseJSONBody(req);
      const token = body.token || authHeader.replace(/^Bearer\s+/, "");
      const db = loadDB();
      const username = db.tokens[token];

      if (!username || !db.users[username]) {
        return sendJSON(res, 401, { success: false, message: "로그인이 필요합니다." });
      }

      const testPayload = {
        title: "🔔 [하루맞춤] 푸시 알림 테스트 성공!",
        body: "웹 푸시 알림과 알림 사운드가 정상 작동합니다! 탭하면 대화창이 열립니다 💬✨",
        icon: "/public/icons/icon-192.png",
        badge: "/public/icons/badge-72.png",
        url: "/?open=chat",
        tag: "haru-test-" + Date.now(),
        data: {
          test: true,
          timestamp: new Date().toISOString()
        }
      };

      const sentCount = await sendWebPushToUsers([username], testPayload);
      return sendJSON(res, 200, {
        success: true,
        sentCount,
        message: sentCount > 0 ? "테스트 알림이 발송되었습니다." : "등록된 기기 푸시 구독 정보를 찾을 수 없습니다. 푸시 권한을 확인해주세요."
      });
    } catch (e) {
      return sendJSON(res, 500, { success: false, message: e.message });
    }
  }

  // ============================================================
  // Static File Serving
  // ============================================================
  let safePath = path.normalize(pathname);
  if (safePath === "/" || safePath === "") {
    safePath = "/index.html";
  }

  const filePath = path.join(__dirname, safePath);

  // Security check: ensure path is within __dirname
  if (!filePath.startsWith(__dirname)) {
    res.writeHead(403);
    return res.end("Forbidden");
  }

  fs.stat(filePath, (err, stats) => {
    if (err || !stats.isFile()) {
      // Fallback to index.html for SPA routing (Strict No-Store Cache Header)
      const indexFile = path.join(__dirname, "index.html");
      fs.readFile(indexFile, (err2, content) => {
        if (err2) {
          res.writeHead(404);
          return res.end("Not Found");
        }
        res.writeHead(200, {
          "Content-Type": "text/html; charset=utf-8",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          "Pragma": "no-cache",
          "Expires": "0",
          "Surrogate-Control": "no-store"
        });
        res.end(content);
      });
      return;
    }

    const ext = path.extname(filePath).toLowerCase();
    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    const acceptEncoding = req.headers["accept-encoding"] || "";
    const shouldGzip = /\bgzip\b/.test(acceptEncoding) && (ext === ".js" || ext === ".css" || ext === ".html" || ext === ".json");
    const isVersioned = (ext === ".js" || ext === ".css") && (req.url && req.url.includes("?v="));
    const isServiceWorker = path.basename(filePath) === "sw.js";
    const isManifest = path.basename(filePath) === "manifest.json" || ext === ".webmanifest";
    const isHtmlOrVersionMeta = ext === ".html" || path.basename(filePath) === "version.json" || isServiceWorker || isManifest;

    const headers = {
      "Content-Type": contentType,
      "Cache-Control": isHtmlOrVersionMeta
        ? "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
        : (isVersioned
          ? "public, max-age=31536000, immutable"
          : ((ext === ".js" || ext === ".css") ? "no-cache, must-revalidate" : "public, max-age=3600")),
      "Pragma": isHtmlOrVersionMeta ? "no-cache" : undefined,
      "Expires": isHtmlOrVersionMeta ? "0" : undefined,
      "Surrogate-Control": isHtmlOrVersionMeta ? "no-store" : undefined
    };

    if (isServiceWorker) {
      headers["Service-Worker-Allowed"] = "/";
    }

    // Remove undefined headers
    Object.keys(headers).forEach(k => headers[k] === undefined && delete headers[k]);

    if (shouldGzip) {
      headers["Content-Encoding"] = "gzip";
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(zlib.createGzip()).pipe(res);
    } else {
      res.writeHead(200, headers);
      fs.createReadStream(filePath).pipe(res);
    }
  });
});

if (require.main === module || !process.env.TEST_ENV) {
  server.listen(PORT, () => {
    console.log(`[Haru Matchum] Server listening on http://0.0.0.0:${PORT}`);

    // Initial 24-hour photo cleanup on startup & recurring every 30 minutes
    cleanupExpiredPhotos();
    setInterval(cleanupExpiredPhotos, 30 * 60 * 1000);

    // Auto-sync with GitHub every 10 minutes
    setInterval(() => {
      try {
        const status = runGit("git status --porcelain");
        if (status) {
          console.log("[Auto-Sync] Detected changes, pushing to GitHub...");
          runGit("git pull --rebase origin main || true");
          runGit("git add .");
          runGit('git commit -m "auto: periodic sync from Synology NAS" || true');
          runGit("git push origin main || true");
          console.log("[Auto-Sync] Pushed to GitHub successfully!");
        }
      } catch (e) {
        console.error("[Auto-Sync Error]", e.message);
      }
    }, 10 * 60 * 1000);
  });
}

module.exports = server;
module.exports.cleanupExpiredPhotos = cleanupExpiredPhotos;
module.exports.PHOTOS_DIR = PHOTOS_DIR;
module.exports.PHOTO_TTL_MS = PHOTO_TTL_MS;
module.exports.sendWebPushToUsers = sendWebPushToUsers;
module.exports.getPushSubscriptions = getPushSubscriptions;
module.exports.savePushSubscriptions = savePushSubscriptions;
module.exports.vapidKeys = vapidKeys;

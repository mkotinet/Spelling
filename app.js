/**
 * 하루맞춤 (Haru Matchum) - Application Logic
 * 국립국어원 표준국어대사전 연동 & 맞춤법 퀴즈/랭킹/출석 시스템
 */

// ============================================================
// 1. Audio Synthesizer (Web Audio API - No External Files)
// ============================================================
class SoundEffects {
  constructor() {
    this.ctx = null;
    this.enabled = true;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type, duration, delay = 0, gainVal = 0.15) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    setTimeout(() => {
      try {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = type;
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        gain.gain.setValueAtTime(gainVal, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start();
        osc.stop(this.ctx.currentTime + duration);
      } catch (e) {
        // Audio error ignore
      }
    }, delay * 1000);
  }

  correct() {
    // Joyful major arpeggio
    this.playTone(523.25, 'triangle', 0.18, 0, 0.2); // C5
    this.playTone(659.25, 'triangle', 0.18, 0.1, 0.2); // E5
    this.playTone(783.99, 'triangle', 0.18, 0.2, 0.2); // G5
    this.playTone(1046.50, 'sine', 0.35, 0.3, 0.25); // C6
  }

  wrong() {
    // Soft low buzzer
    this.playTone(261.63, 'sawtooth', 0.15, 0, 0.15);
    this.playTone(233.08, 'sawtooth', 0.25, 0.15, 0.15);
  }

  combo() {
    // High sparkle chime
    this.playTone(880, 'sine', 0.15, 0, 0.18);
    this.playTone(1174.66, 'sine', 0.15, 0.08, 0.2);
    this.playTone(1396.91, 'sine', 0.25, 0.16, 0.22);
  }

  fanfare() {
    // Victory fanfare
    const notes = [523.25, 659.25, 783.99, 1046.50, 880, 1046.50];
    const delays = [0, 0.12, 0.24, 0.36, 0.52, 0.7];
    notes.forEach((n, i) => this.playTone(n, 'triangle', 0.25, delays[i], 0.2));
  }
}

const sfx = new SoundEffects();

// ============================================================
// 2. Confetti Particle Animation
// ============================================================
class ConfettiManager {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas ? this.canvas.getContext('2d') : null;
    this.particles = [];
    this.animating = false;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  explode() {
    if (!this.canvas || !this.ctx) return;
    this.resize();
    const colors = ['#ff8fb1', '#ffd6e0', '#c8b6ff', '#b8c0ff', '#ffb703', '#ff6b81', '#bbf2f6'];
    this.particles = [];
    const count = 75;

    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() - 0.5) * 80,
        y: this.canvas.height * 0.4 + (Math.random() - 0.5) * 80,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 1.2) * 12,
        size: Math.random() * 8 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotSpeed: (Math.random() - 0.5) * 10,
        opacity: 1
      });
    }

    if (!this.animating) {
      this.animating = true;
      this.loop();
    }
  }

  loop() {
    if (!this.animating) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    let activeCount = 0;
    for (const p of this.particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.rotation += p.rotSpeed;
      p.opacity -= 0.012;

      if (p.opacity > 0 && p.y < this.canvas.height + 50) {
        activeCount++;
        this.ctx.save();
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate((p.rotation * Math.PI) / 180);
        this.ctx.fillStyle = p.color;
        this.ctx.globalAlpha = Math.max(0, p.opacity);
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 1.3);
        this.ctx.restore();
      }
    }

    if (activeCount > 0) {
      requestAnimationFrame(() => this.loop());
    } else {
      this.animating = false;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

// ============================================================
// 3. User & Storage Manager & Date Utilities
// ============================================================
const STORAGE_KEY = 'haru_matchum_data_v1';

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
    return kst.toISOString().split('T')[0];
  }
}

class DataManager {
  static defaultData() {
    const today = getKSTDateString();
    return {
      currentUser: {
        id: 'user_' + Date.now(),
        name: '맞춤요정',
        avatar: '🌸',
        grade: '중학교 2학년',
        streak: 1,
        totalPoints: 120,
        totalSolved: 10,
        totalCorrect: 9,
        lastActiveDate: today,
        completedDates: [today]
      },
      apiKey: 'C0E0448602CD3B859FDDD29BBD84289C',
      soundEnabled: true,
      wrongQuestions: [],
      badges: ['starter'],
      allUsers: [] // Real users loaded from server leaderboard
    };
  }

  static load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const init = this.defaultData();
        init.allUsers = [{ ...init.currentUser, isMe: true }];
        this.save(init);
        return init;
      }
      const parsed = JSON.parse(raw);
      if (!parsed.apiKey) {
        parsed.apiKey = 'C0E0448602CD3B859FDDD29BBD84289C';
      }
      // Purge any legacy dummy peer users (peer_1 ~ peer_7)
      if (Array.isArray(parsed.allUsers)) {
        parsed.allUsers = parsed.allUsers.filter(u => u && u.id && !u.id.startsWith('peer_'));
      }
      if (!parsed.allUsers || parsed.allUsers.length === 0) {
        parsed.allUsers = [{ ...parsed.currentUser, isMe: true }];
      }
      return parsed;
    } catch (e) {
      return this.defaultData();
    }
  }

  static save(data) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.error('Storage save error', e);
    }
  }
}

// ============================================================
// 4. Badges Definition
// ============================================================
const BADGE_DEFINITIONS = [
  { id: 'starter', name: '첫 발걸음', icon: '🌱', desc: '하루맞춤에 첫 방문하여 맞춤법 여행을 시작했어요!' },
  { id: 'streak_3', name: '3일 연속 열공', icon: '🔥', desc: '3일 연속으로 오늘의 맞춤법 퀴즈에 출석했어요.' },
  { id: 'streak_7', name: '일주일 완주왕', icon: '👑', desc: '7일 연속 출석하여 다이어리를 꽉 채웠어요!' },
  { id: 'perfect_100', name: '퍼펙트 만점러', icon: '💯', desc: '데일리 퀴즈에서 5문제 모두 오답 없이 만점 달성!' },
  { id: 'combo_master', name: '콤보 마스터', icon: '⚡', desc: '퀴즈 중 5연속 콤보를 성공했어요.' },
  { id: 'dict_explorer', name: '사전 탐험가', icon: '📖', desc: '표준국어대사전 상세 뜻을 3회 이상 찾아보았어요.' }
];

// ============================================================
// 5. Main Application Controller
// ============================================================
class HaruMatchumApp {
  constructor() {
    this.data = DataManager.load();
    sfx.enabled = this.data.soundEnabled !== false;

    this.confetti = new ConfettiManager('confettiCanvas');
    this.quizSubject = 'spelling'; // 'spelling' | 'hanja' | 'english'
    this.currentMode = 'daily'; // 'daily' | 'level_daily' | 'practice' | 'review'
    this.selectedLevel = null;
    this.luckyBoxDroppedThisRound = false;
    this.currentRound = 1;
    this.roundCorrectCount = 0;
    this.activeQuestions = [];
    this.currentIndex = 0;
    this.currentScore = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.selectedOption = null;

    // Gamification & Item Mechanics State
    this.shields = parseInt(localStorage.getItem('haru_game_shields') || '0', 10);
    this.perfectRoundStreak = 0;
    this.isReviveQuiz = false;
    this.pointMultiplier = 1;
    this.activeItemHeart = false;
    this.activeItemMagnet = false;
    this.items = {
      eraser5050: parseInt(localStorage.getItem('haru_item_5050') || '2', 10),
      heart: parseInt(localStorage.getItem('haru_item_heart') || '1', 10),
      booster2x: parseInt(localStorage.getItem('haru_item_booster') || '1', 10),
      hint: parseInt(localStorage.getItem('haru_item_hint') || '2', 10),
      clover: parseInt(localStorage.getItem('haru_item_clover') || '1', 10),
      timemachine: parseInt(localStorage.getItem('haru_item_timemachine') || '1', 10),
      magnet: parseInt(localStorage.getItem('haru_item_magnet') || '1', 10)
    };

    this.cloudToken = localStorage.getItem('haru_cloud_token') || '';
    this.authMode = 'login'; // 'login' | 'register'
    this.lastLoadedDate = getKSTDateString();
    this.currentViewName = 'home';

    this.initDOM();
    this.bindEvents();
    this.renderUserProfile();
    this.renderCalendarWeek();
    this.renderLeaderboard('daily');
    this.renderBadges();
    this.checkCloudAuth();
  }

  initDOM() {
    // Views
    this.viewHome = document.getElementById('viewHome');
    this.viewQuiz = document.getElementById('viewQuiz');
    this.viewResult = document.getElementById('viewResult');
    this.viewLeaderboard = document.getElementById('viewLeaderboard');
    this.viewBadges = document.getElementById('viewBadges');

    // Modals
    this.modalProfile = document.getElementById('modalProfile');
    this.modalApi = document.getElementById('modalApi');
    this.modalDictSearch = document.getElementById('modalDictSearch');
    this.modalAuth = document.getElementById('modalAuth');
    this.modalAdminLogs = document.getElementById('modalAdminLogs');
    this.modalGameGuide = document.getElementById('modalGameGuide');

    // Mascot
    this.mascotBubble = document.getElementById('mascotSpeech');
    this.mascotAvatar = document.getElementById('mascotAvatar');

    // Leaderboard state
    this.rankSubject = 'spelling';
    this.rankType = 'round';
  }

  bindEvents() {
    // Nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const view = e.currentTarget.dataset.view;
        this.switchView(view);
      });
    });

    // Subject Mode Switch Buttons (Spelling vs Hanja vs English)
    const btnSpelling = document.getElementById('btnModeSpelling');
    const btnHanja = document.getElementById('btnModeHanja');
    const btnEnglish = document.getElementById('btnModeEnglish');
    if (btnSpelling) btnSpelling.addEventListener('click', () => this.setQuizSubject('spelling'));
    if (btnHanja) btnHanja.addEventListener('click', () => this.setQuizSubject('hanja'));
    if (btnEnglish) btnEnglish.addEventListener('click', () => this.setQuizSubject('english'));

    // Start Mode Buttons
    document.getElementById('btnStartDaily').addEventListener('click', () => this.startQuiz('daily'));
    const btnLevelDaily = document.getElementById('btnStartLevelDaily');
    const modalLevel = document.getElementById('modalLevelSelect');
    const btnCloseLevel = document.getElementById('btnCloseLevelModal');
    if (btnLevelDaily && modalLevel) {
      btnLevelDaily.addEventListener('click', () => modalLevel.classList.add('active'));
    }
    if (btnCloseLevel && modalLevel) {
      btnCloseLevel.addEventListener('click', () => modalLevel.classList.remove('active'));
    }
    document.querySelectorAll('.level-opt-card').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const level = e.currentTarget.getAttribute('data-level');
        if (modalLevel) modalLevel.classList.remove('active');
        this.startLevelDailyQuiz(level);
      });
    });

    document.getElementById('btnStartPractice').addEventListener('click', () => this.startQuiz('practice'));
    document.getElementById('btnStartReview').addEventListener('click', () => this.startQuiz('review'));

    // Lucky Box modal buttons
    const btnOpenLucky = document.getElementById('btnOpenLuckyBox');
    const btnCloseLucky = document.getElementById('btnCloseLuckyBox');
    if (btnOpenLucky) btnOpenLucky.addEventListener('click', () => this.executeLuckyBoxOpen());
    if (btnCloseLucky) btnCloseLucky.addEventListener('click', () => this.closeLuckyBoxModal());

    // Quiz action button
    document.getElementById('btnQuizNext').addEventListener('click', () => this.handleNextQuestion());

    // Result buttons
    document.getElementById('btnResultHome').addEventListener('click', () => this.switchView('home'));
    document.getElementById('btnResultRetry').addEventListener('click', () => {
      if (this.currentMode === 'level_daily') {
        this.startLevelDailyQuiz(this.selectedLevel, this.currentRound);
      } else {
        this.startQuiz(this.currentMode, this.currentRound);
      }
    });
    const btnNextRound = document.getElementById('btnNextRound');
    if (btnNextRound) {
      btnNextRound.addEventListener('click', () => this.startNextRound());
    }
    const btnLevelChange = document.getElementById('btnLevelChange');
    if (btnLevelChange) {
      btnLevelChange.addEventListener('click', () => {
        this.switchView('home');
        const modalLevel = document.getElementById('modalLevelSelect');
        if (modalLevel) modalLevel.classList.add('active');
      });
    }

    // Profile click
    document.getElementById('userBar').addEventListener('click', () => this.openProfileModal());
    document.getElementById('btnEditProfile').addEventListener('click', () => this.openProfileModal());
    document.getElementById('btnCloseProfileModal').addEventListener('click', () => this.closeProfileModal());
    document.getElementById('btnSaveProfile').addEventListener('click', () => this.saveProfileForm());

    // Avatar selector
    document.querySelectorAll('.avatar-opt').forEach(opt => {
      opt.addEventListener('click', (e) => {
        document.querySelectorAll('.avatar-opt').forEach(o => o.classList.remove('selected'));
        e.currentTarget.classList.add('selected');
      });
    });

    // Dictionary search modal
    document.getElementById('btnOpenDictSearch').addEventListener('click', () => this.openDictModal());
    document.getElementById('btnCloseDictModal').addEventListener('click', () => this.closeDictModal());
    document.getElementById('btnDoDictSearch').addEventListener('click', () => this.executeDictSearch());
    document.getElementById('inputDictSearch').addEventListener('keydown', (e) => {
      if (e.key === 'Enter') this.executeDictSearch();
    });

    // Cloud Auth modal & Git Sync
    document.getElementById('btnOpenAuthModal').addEventListener('click', () => this.openAuthModal());
    document.getElementById('btnCloseAuthModal').addEventListener('click', () => this.closeAuthModal());
    document.getElementById('tabAuthLogin').addEventListener('click', () => this.setAuthMode('login'));
    document.getElementById('tabAuthRegister').addEventListener('click', () => this.setAuthMode('register'));
    document.getElementById('btnSubmitAuth').addEventListener('click', () => this.submitAuth());
    document.getElementById('btnLogout').addEventListener('click', () => this.logout());
    document.getElementById('btnGitSync').addEventListener('click', () => this.syncGitRepo());

    // Page Reload (Cache-busting reload)
    const btnReloadPage = document.getElementById('btnReloadPage');
    const btnQuickReload = document.getElementById('btnQuickReload');
    if (btnReloadPage) btnReloadPage.addEventListener('click', () => this.forcePageReload());
    if (btnQuickReload) btnQuickReload.addEventListener('click', () => this.forcePageReload());

    // API settings modal
    document.getElementById('btnOpenApiSettings').addEventListener('click', () => this.openApiModal());
    document.getElementById('btnCloseApiModal').addEventListener('click', () => this.closeApiModal());
    document.getElementById('btnSaveApiSettings').addEventListener('click', () => this.saveApiSettings());

    // Admin Logs modal
    const btnOpenAdmin = document.getElementById('btnOpenAdminLogs');
    const btnCloseAdmin = document.getElementById('btnCloseAdminLogsModal');
    const btnRefreshAdmin = document.getElementById('btnRefreshAdminLogs');
    if (btnOpenAdmin) btnOpenAdmin.addEventListener('click', () => this.openAdminLogsModal());
    if (btnCloseAdmin) btnCloseAdmin.addEventListener('click', () => this.closeAdminLogsModal());
    if (btnRefreshAdmin) btnRefreshAdmin.addEventListener('click', () => this.fetchAdminLogs());

    // Game Guide modal
    const btnOpenGuide = document.getElementById('btnOpenGameGuide');
    const btnCloseGuide = document.getElementById('btnCloseGameGuideModal');
    if (btnOpenGuide) btnOpenGuide.addEventListener('click', () => this.openGameGuideModal());
    if (btnCloseGuide) btnCloseGuide.addEventListener('click', () => this.closeGameGuideModal());

    // Game Items (7 Items)
    const btn5050 = document.getElementById('btnItem5050');
    const btnHeart = document.getElementById('btnItemHeart');
    const btnDouble = document.getElementById('btnItemDouble');
    const btnHint = document.getElementById('btnItemHint');
    const btnClover = document.getElementById('btnItemClover');
    const btnTimemachine = document.getElementById('btnItemTimemachine');
    const btnMagnet = document.getElementById('btnItemMagnet');
    const btnCloseHint = document.getElementById('btnCloseHint');

    if (btn5050) btn5050.addEventListener('click', () => this.useItem5050());
    if (btnHeart) btnHeart.addEventListener('click', () => this.useItemHeart());
    if (btnDouble) btnDouble.addEventListener('click', () => this.useItemDouble());
    if (btnHint) btnHint.addEventListener('click', () => this.useItemHint());
    if (btnClover) btnClover.addEventListener('click', () => this.useItemClover());
    if (btnTimemachine) btnTimemachine.addEventListener('click', () => this.useItemTimemachine());
    if (btnMagnet) btnMagnet.addEventListener('click', () => this.useItemMagnet());
    if (btnCloseHint) {
      btnCloseHint.addEventListener('click', () => {
        const hintBox = document.getElementById('quizHintBox');
        if (hintBox) hintBox.style.display = 'none';
      });
    }

    // Fail Actions (Revive & Fallback)
    const btnRevive = document.getElementById('btnReviveQuiz');
    const btnFallback = document.getElementById('btnFallbackRound');
    if (btnRevive) btnRevive.addEventListener('click', () => this.handleReviveQuiz());
    if (btnFallback) btnFallback.addEventListener('click', () => this.fallbackRound());

    // Leaderboard Subject Switcher
    const rankSubjSpelling = document.getElementById('rankSubjectSpelling');
    const rankSubjHanja = document.getElementById('rankSubjectHanja');
    const rankSubjEnglish = document.getElementById('rankSubjectEnglish');
    if (rankSubjSpelling) {
      rankSubjSpelling.addEventListener('click', () => {
        rankSubjSpelling.classList.add('active');
        if (rankSubjHanja) rankSubjHanja.classList.remove('active');
        if (rankSubjEnglish) rankSubjEnglish.classList.remove('active');
        this.rankSubject = 'spelling';
        this.renderLeaderboard(this.rankType);
      });
    }
    if (rankSubjHanja) {
      rankSubjHanja.addEventListener('click', () => {
        rankSubjHanja.classList.add('active');
        if (rankSubjSpelling) rankSubjSpelling.classList.remove('active');
        if (rankSubjEnglish) rankSubjEnglish.classList.remove('active');
        this.rankSubject = 'hanja';
        this.renderLeaderboard(this.rankType);
      });
    }
    if (rankSubjEnglish) {
      rankSubjEnglish.addEventListener('click', () => {
        rankSubjEnglish.classList.add('active');
        if (rankSubjSpelling) rankSubjSpelling.classList.remove('active');
        if (rankSubjHanja) rankSubjHanja.classList.remove('active');
        this.rankSubject = 'english';
        this.renderLeaderboard(this.rankType);
      });
    }

    // Sound toggle
    const soundBtn = document.getElementById('btnToggleSound');
    soundBtn.addEventListener('click', () => {
      sfx.enabled = !sfx.enabled;
      this.data.soundEnabled = sfx.enabled;
      DataManager.save(this.data);
      soundBtn.textContent = sfx.enabled ? '🔔' : '🔕';
      if (sfx.enabled) sfx.combo();
    });

    // Leaderboard filter
    document.querySelectorAll('.rank-filter-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.rank-filter-btn').forEach(b => b.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.rankType = e.currentTarget.dataset.type || 'daily';
        this.renderLeaderboard(this.rankType);
      });
    });

    // Lifecycle & Date Transition Watchers (Mobile background resume & midnight refresh)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'visible') {
        this.checkDateTransition();
      }
    });
    window.addEventListener('pageshow', () => {
      this.checkDateTransition();
    });
    window.addEventListener('focus', () => {
      this.checkDateTransition();
    });
    // Re-verify and sync session automatically when mobile device restores network connection
    window.addEventListener('online', () => {
      console.log('[Haru Matchum] Network restored. Validating session...');
      if (this.cloudToken) {
        this.checkCloudAuth();
      }
    });
    // Check every 60s for midnight date rollover
    setInterval(() => {
      this.checkDateTransition();
    }, 60000);
  }

  checkDateTransition(overrideDateStr) {
    const todayStr = overrideDateStr || getKSTDateString();
    if (todayStr !== this.lastLoadedDate) {
      console.log(`[Haru Matchum] Date transitioned: ${this.lastLoadedDate} -> ${todayStr}`);
      const prevDate = this.lastLoadedDate;
      this.lastLoadedDate = todayStr;

      // 1. If currently in middle of quiz or stale result view from yesterday, return to home
      if (this.currentViewName === 'quiz' || this.currentViewName === 'result') {
        this.switchView('home');
        this.showToastNotice('새로운 하루가 밝았어요! 🌸 오늘의 새로운 퀴즈 5문제가 준비되었습니다.');
      } else {
        this.showToastNotice('오늘의 새로운 퀴즈가 갱신되었습니다! ✨');
      }

      // 2. Reset daily round state & refresh UI
      this.currentRound = 1;
      this.roundCorrectCount = 0;
      this.renderCalendarWeek();
      this.renderUserProfile();
      this.updateMascotMood('happy', `새로운 하루가 시작되었어! 🌸 오늘의 <strong>${this.quizSubject === 'hanja' ? '한자' : '맞춤법'} 5문제</strong> 풀고 출석해볼까? ✨`);

      // 3. Resync leaderboard & cloud auth
      this.fetchLeaderboard('daily');
      if (this.cloudToken) {
        this.checkCloudAuth();
      }
      return true;
    }
    return false;
  }

  showToastNotice(msg) {
    let toast = document.getElementById('dailyRefreshToast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'dailyRefreshToast';
      toast.className = 'daily-toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(this._toastTimer);
    this._toastTimer = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  switchView(viewName) {
    this.currentViewName = viewName;
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

    const tab = document.querySelector(`.nav-tab[data-view="${viewName}"]`);
    if (tab) tab.classList.add('active');

    if (viewName === 'home') {
      this.viewHome.classList.add('active');
      this.updateMascotMood('happy');
    } else if (viewName === 'quiz') {
      this.viewQuiz.classList.add('active');
    } else if (viewName === 'result') {
      this.viewResult.classList.add('active');
    } else if (viewName === 'leaderboard') {
      this.viewLeaderboard.classList.add('active');
      this.renderLeaderboard('daily');
    } else if (viewName === 'badges') {
      this.viewBadges.classList.add('active');
      this.renderBadges();
    }
  }

  updateMascotMood(mood, customMsg) {
    if (customMsg) {
      this.mascotBubble.innerHTML = customMsg;
      return;
    }
    const msgs = {
      happy: `안녕, <strong>${this.data.currentUser.name}</strong>야! 오늘도 반짝이는 맞춤법 퀴즈 도전해볼까? ✨`,
      cheer: `틀려도 괜찮아! 하나씩 알아가는 재미가 진짜 실력이 되는 거야! 💕`,
      perfect: `대단해! 오늘 맞춤법 퀴즈를 완벽하게 정복했어! 짱이야! 🎉`,
      review: `오답노트를 복습하면 헷갈리던 단어도 확실하게 내 것이 돼! 📖`
    };
    this.mascotBubble.innerHTML = msgs[mood] || msgs.happy;
  }

  setQuizSubject(subject) {
    this.quizSubject = subject;
    const btnSpelling = document.getElementById('btnModeSpelling');
    const btnHanja = document.getElementById('btnModeHanja');
    const btnEnglish = document.getElementById('btnModeEnglish');
    const dailyCardTitle = document.querySelector('#btnStartDaily h3');
    const dailyCardDesc = document.querySelector('#btnStartDaily p');
    const dailyBadge = document.querySelector('#btnStartDaily .mode-badge');
    const levelCardTitle = document.querySelector('#btnStartLevelDaily h3');

    document.body.classList.remove('theme-hanja', 'theme-english');
    if (btnSpelling) btnSpelling.classList.remove('active');
    if (btnHanja) btnHanja.classList.remove('active');
    if (btnEnglish) btnEnglish.classList.remove('active');

    if (subject === 'hanja') {
      document.body.classList.add('theme-hanja');
      if (btnHanja) btnHanja.classList.add('active');
      if (dailyCardTitle) dailyCardTitle.textContent = '오늘의 한자·고사성어 5제';
      if (dailyCardDesc) dailyCardDesc.textContent = '매일 갱신되는 한자 5문제 풀고 실생활 어휘력 UP!';
      if (dailyBadge) dailyBadge.textContent = '오늘의 한자 챌린지 📜';
      if (levelCardTitle) levelCardTitle.textContent = '오늘의 레벨별 한자 5제';
      this.updateMascotMood('happy', `안녕, <strong>${this.data.currentUser.name}</strong>야! 오늘은 지혜가 담긴 한자·고사성어 퀴즈에 도전해볼까? 📜✨`);
    } else if (subject === 'english') {
      document.body.classList.add('theme-english');
      if (btnEnglish) btnEnglish.classList.add('active');
      if (dailyCardTitle) dailyCardTitle.textContent = '오늘의 영단어·스펠링 5제';
      if (dailyCardDesc) dailyCardDesc.textContent = '헷갈리기 쉬운 영단어 철자 5문제 완벽 마스터!';
      if (dailyBadge) dailyBadge.textContent = '오늘의 영어 챌린지 🔤';
      if (levelCardTitle) levelCardTitle.textContent = '오늘의 레벨별 영단어 5제';
      this.updateMascotMood('happy', `Hi, <strong>${this.data.currentUser.name}</strong>! 오늘도 반짝이는 영단어 스펠링 퀴즈 도전해볼까? 🔤✨`);
    } else {
      if (btnSpelling) btnSpelling.classList.add('active');
      if (dailyCardTitle) dailyCardTitle.textContent = '오늘의 맞춤법 5제';
      if (dailyCardDesc) dailyCardDesc.textContent = '매일 갱신되는 5문제 풀고 출석 도장 & 랭킹 포인트 적립!';
      if (dailyBadge) dailyBadge.textContent = '오늘의 데일리 챌린지 🌸';
      if (levelCardTitle) levelCardTitle.textContent = '오늘의 레벨별 맞춤법 5제';
      this.updateMascotMood('happy', `안녕, <strong>${this.data.currentUser.name}</strong>야! 오늘도 반짝이는 맞춤법 퀴즈 도전해볼까? ✨`);
    }
  }

  getActiveBank() {
    if (this.quizSubject === 'hanja' && typeof HANJA_QUESTION_BANK !== 'undefined') {
      return HANJA_QUESTION_BANK;
    }
    if (this.quizSubject === 'english' && typeof ENGLISH_QUESTION_BANK !== 'undefined') {
      return ENGLISH_QUESTION_BANK;
    }
    return SPELLING_QUESTION_BANK;
  }

  renderUserProfile() {
    const u = this.data.currentUser;
    document.getElementById('userAvatar').textContent = u.avatar;
    document.getElementById('userName').textContent = u.name;
    document.getElementById('userGrade').textContent = u.grade;
    document.getElementById('userStreak').textContent = u.streak + '일';
    const userShieldsEl = document.getElementById('userShields');
    if (userShieldsEl) userShieldsEl.textContent = (this.shields || 0) + '개';
    document.getElementById('userPoints').textContent = u.totalPoints + 'P';
    document.getElementById('streakBadge').textContent = `🔥 ${u.streak}일 연속`;
  }

  renderCalendarWeek() {
    const calendarContainer = document.getElementById('calendarWeek');
    if (!calendarContainer) return;
    calendarContainer.innerHTML = '';

    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const now = new Date();
    const todayStr = getKSTDateString(now);
    const currentDayOfWeek = now.getDay(); // 0 is Sun

    // Render 7 days of this current week (Sun - Sat)
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(now);
      dayDate.setDate(now.getDate() - currentDayOfWeek + i);
      const dateStr = getKSTDateString(dayDate);
      const isToday = (dateStr === todayStr);
      const isCompleted = this.data.currentUser.completedDates.includes(dateStr);

      const box = document.createElement('div');
      box.className = `day-box ${isCompleted ? 'completed' : ''} ${isToday ? 'today' : ''}`;
      box.innerHTML = `
        <span class="d-name">${days[i]}</span>
        <span class="d-stamp">${isCompleted ? '🌸' : (isToday ? '✏️' : '🤍')}</span>
      `;
      calendarContainer.appendChild(box);
    }
  }

  // ============================================================
  // Quiz Flow & Consecutive Round Progression
  // ============================================================
  startQuiz(mode, round = 1) {
    this.currentMode = mode;
    this.currentRound = round;
    this.roundCorrectCount = 0;
    this.currentIndex = 0;
    this.currentScore = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.selectedOption = null;
    this.luckyBoxDroppedThisRound = false;

    const roundBadge = document.getElementById('quizRoundBadge');
    if (roundBadge) {
      roundBadge.textContent = `라운드 ${this.currentRound}`;
      roundBadge.style.display = mode === 'daily' ? 'inline-block' : 'none';
    }

    if (mode === 'daily') {
      this.activeQuestions = this.getDailyQuestions(this.currentRound);
    } else if (mode === 'practice') {
      this.activeQuestions = this.getRandomQuestions(5);
    } else if (mode === 'review') {
      if (!this.data.wrongQuestions || this.data.wrongQuestions.length === 0) {
        alert('아직 오답노트에 저장된 문제가 없어요! 데일리 퀴즈나 연습 퀴즈를 먼저 풀어보세요.');
        return;
      }
      this.activeQuestions = [...this.data.wrongQuestions].slice(0, 5);
    }

    // Shuffle options dynamically so answer position is randomised across 1, 2, 3, 4
    this.activeQuestions = this.activeQuestions.map(q => this.shuffleQuestionOptions(q));

    this.switchView('quiz');
    this.renderCurrentQuestion();
  }

  startLevelDailyQuiz(level, round = 1) {
    this.selectedLevel = level;
    this.currentMode = 'level_daily';
    this.currentRound = round;
    this.roundCorrectCount = 0;
    this.currentIndex = 0;
    this.currentScore = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.selectedOption = null;
    this.luckyBoxDroppedThisRound = false;

    // Reset round-specific item active states
    this.activeItemHeart = false;
    this.pointMultiplier = 1;
    this.activeItemMagnet = false;

    const roundBadge = document.getElementById('quizRoundBadge');
    if (roundBadge) {
      roundBadge.textContent = `🎯 ${level} · 라운드 ${this.currentRound}`;
      roundBadge.style.display = 'inline-block';
    }

    this.activeQuestions = this.getLevelDailyQuestions(level, this.currentRound);

    // Shuffle options dynamically
    this.activeQuestions = this.activeQuestions.map(q => this.shuffleQuestionOptions(q));

    this.switchView('quiz');
    this.renderCurrentQuestion();
    this.renderShieldStatus();
    this.renderItemBar();
  }

  getLevelDailyQuestions(level, round = 1) {
    const todayStr = getKSTDateString();
    let hash = 0;
    const seedStr = `${todayStr}_${this.quizSubject}_${level}`;
    for (let i = 0; i < seedStr.length; i++) {
      hash = (hash << 5) - hash + seedStr.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);
    const bank = this.getActiveBank();
    const filtered = bank.filter(q => q.level && q.level.includes(level));
    const pool = (filtered.length >= 5) ? filtered : bank;
    const levelSet = [];
    const usedIndices = new Set();

    for (let i = 0; i < 5; i++) {
      let idx = (seed + (round - 1) * 31 + i * 7) % pool.length;
      while (usedIndices.has(idx) && usedIndices.size < pool.length) {
        idx = (idx + 1) % pool.length;
      }
      usedIndices.add(idx);
      levelSet.push(pool[idx]);
    }
    return levelSet;
  }

  getRandomQuestionsFromPool(pool, count) {
    const shuffled = [...pool].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  shuffleQuestionOptions(q) {
    const copy = { ...q, options: [...q.options] };
    const originalAnswerText = copy.options[copy.answerIndex];
    for (let i = copy.options.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy.options[i], copy.options[j]] = [copy.options[j], copy.options[i]];
    }
    copy.answerIndex = copy.options.indexOf(originalAnswerText);
    return copy;
  }

  getDailyQuestions(round = 1) {
    const todayStr = getKSTDateString();
    let hash = 0;
    for (let i = 0; i < todayStr.length; i++) {
      hash = (hash << 5) - hash + todayStr.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);
    const bank = this.getActiveBank();
    const dailySet = [];
    const usedIndices = new Set();

    for (let i = 0; i < 5; i++) {
      let idx = (seed + (round - 1) * 31 + i * 7) % bank.length;
      while (usedIndices.has(idx) && usedIndices.size < bank.length) {
        idx = (idx + 1) % bank.length;
      }
      usedIndices.add(idx);
      dailySet.push(bank[idx]);
    }
    return dailySet;
  }

  getRandomQuestions(count) {
    const bank = this.getActiveBank();
    const shuffled = [...bank].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }

  renderCurrentQuestion() {
    const q = this.activeQuestions[this.currentIndex];
    const total = this.activeQuestions.length;

    // Progress bar
    const progressPercent = ((this.currentIndex + 1) / total) * 100;
    document.getElementById('quizProgressFill').style.width = `${progressPercent}%`;

    // Category and combo
    document.getElementById('quizCategory').textContent = `${q.category} · ${q.level}`;
    const comboEl = document.getElementById('quizCombo');
    if (this.combo > 1) {
      comboEl.style.display = 'inline-block';
      comboEl.textContent = `🔥 ${this.combo} 콤보!`;
    } else {
      comboEl.style.display = 'none';
    }

    // Sentence & Blank highlighting
    document.getElementById('quizPrompt').textContent = `Q${this.currentIndex + 1}. ${q.question}`;
    let sentenceHtml = q.sentence;
    if (sentenceHtml.includes('[ (     ) ]') || sentenceHtml.includes('[ ( ? ) ]')) {
      sentenceHtml = sentenceHtml.replace(
        /\[\s*\(\s*\?*\s*\)\s*\]/g,
        `<span class="highlight quiz-blank" title="빈칸에 들어갈 알맞은 말을 고르세요">( &nbsp;?&nbsp; )</span>`
      );
    } else {
      sentenceHtml = sentenceHtml.replace(
        /\[(.*?)\]/g,
        `<span class="highlight">[ $1 ]</span>`
      );
    }
    document.getElementById('quizSentence').innerHTML = sentenceHtml;

    // Options
    const optionsContainer = document.getElementById('quizOptions');
    optionsContainer.innerHTML = '';
    this.selectedOption = null;

    q.options.forEach((optText, idx) => {
      const btn = document.createElement('button');
      btn.className = 'option-btn';
      btn.innerHTML = `<span>${idx + 1}. ${optText}</span><span class="opt-icon">✨</span>`;
      btn.addEventListener('click', () => this.handleOptionSelect(idx, btn));
      optionsContainer.appendChild(btn);
    });

    // Reset Hint Box, Explanation & Next Button
    const hintBox = document.getElementById('quizHintBox');
    if (hintBox) hintBox.style.display = 'none';
    const expCard = document.getElementById('quizExplanation');
    expCard.classList.remove('active');
    const expHanjaArea = document.getElementById('expHanjaArea');
    if (expHanjaArea) expHanjaArea.style.display = 'none';
    const expEnglishArea = document.getElementById('expEnglishArea');
    if (expEnglishArea) expEnglishArea.style.display = 'none';
    const nextBtn = document.getElementById('btnQuizNext');
    nextBtn.disabled = true;
    nextBtn.textContent = (this.currentIndex === total - 1) ? '결과 확인하기 🎉' : '다음 문제로 ✨';

    this.renderShieldStatus();
    this.renderItemBar();
  }

  handleOptionSelect(selectedIndex, clickedBtn) {
    if (this.selectedOption !== null) return; // already answered

    const q = this.activeQuestions[this.currentIndex];
    const isCorrect = selectedIndex === q.answerIndex;

    // Heart Second Chance Item Check
    if (!isCorrect && this.activeItemHeart) {
      this.activeItemHeart = false;
      this.selectedOption = null;
      clickedBtn.disabled = true;
      clickedBtn.style.opacity = '0.35';
      clickedBtn.querySelector('.opt-icon').textContent = '💔 1회 방어';
      sfx.wrong();
      this.showToastNotice('💖 하트 찬스 발동! 오답 1회를 무효화했습니다. 다른 선택지를 골라보세요!');
      this.renderItemBar();
      return;
    }

    this.selectedOption = selectedIndex;

    const allButtons = document.querySelectorAll('.option-btn');
    allButtons.forEach((b, i) => {
      b.disabled = true;
      if (i === q.answerIndex) {
        b.classList.add('correct');
        b.querySelector('.opt-icon').textContent = '⭕ 정답!';
      } else if (i === selectedIndex && !isCorrect) {
        b.classList.add('wrong');
        b.querySelector('.opt-icon').textContent = '❌ 오답';
      }
    });

    // Audio & Score & Round correct tracking
    if (isCorrect) {
      this.roundCorrectCount++;
      this.combo++;
      if (this.combo > this.maxCombo) this.maxCombo = this.combo;
      let comboBonus = (this.combo - 1) * 5;
      if (this.activeItemMagnet) {
        comboBonus = (this.combo - 1) * 20; // 🧲 Combo Magnet 4x boost
      }
      this.currentScore += (20 + comboBonus);

      if (this.combo > 2) {
        sfx.combo();
      } else {
        sfx.correct();
      }

      // Remove from wrong questions if it was there
      this.data.wrongQuestions = (this.data.wrongQuestions || []).filter(item => item.id !== q.id);

      // Surprise Lucky Box drop check (approx 28% on correct answer, max 1 per round)
      if (!this.luckyBoxDroppedThisRound && Math.random() < 0.28) {
        this.luckyBoxDroppedThisRound = true;
        setTimeout(() => this.openLuckyBoxModal(), 650);
      }
    } else {
      this.combo = 0;
      sfx.wrong();

      // Add to wrong questions notebook
      if (!this.data.wrongQuestions) this.data.wrongQuestions = [];
      if (!this.data.wrongQuestions.some(item => item.id === q.id)) {
        this.data.wrongQuestions.push(q);
      }
    }

    // Show Explanation & Dictionary
    const expCard = document.getElementById('quizExplanation');
    expCard.classList.add('active');
    document.getElementById('expText').textContent = q.explanation;
    document.getElementById('expRule').textContent = `규정/출전: ${q.rule || q.category}`;

    const targetWord = q.standardWord || q.hanjaWord || q.englishWord || q.options[q.answerIndex];

    // If sentence has a blank, fill it with the correct target word
    const blankEl = document.querySelector('.quiz-blank');
    if (blankEl) {
      blankEl.textContent = ` ${targetWord} `;
      blankEl.classList.add('answered');
    }

    document.getElementById('dictWord').textContent = targetWord;
    document.getElementById('dictPos').textContent = q.pos || (q.hanjaWord ? '한자어' : (q.englishWord ? '영단어' : '표준어'));
    document.getElementById('dictDefText').textContent = q.dictDefinition || q.meaning || q.explanation;

    // Dictionary link (Korean Standard vs English Naver)
    const dictLink = document.getElementById('expDictLink');
    if (this.quizSubject === 'english' || q.englishWord) {
      dictLink.href = q.dictLink || `https://en.dict.naver.com/#/search?query=${encodeURIComponent(targetWord)}`;
      dictLink.textContent = '네이버 영어사전 상세 검색 ↗';
    } else {
      dictLink.href = q.dictLink || `https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=${encodeURIComponent(targetWord)}`;
      dictLink.textContent = '국립국어원 표준국어대사전 ↗';
    }
    dictLink.onclick = () => {
      this.trackDictionarySearch();
    };

    // Hanja specific breakdown
    const expHanjaArea = document.getElementById('expHanjaArea');
    if (expHanjaArea) {
      if (q.hanjaChars && q.hanjaChars.length > 0) {
        expHanjaArea.style.display = 'block';
        document.getElementById('hanjaWordTitle').textContent = q.hanjaWord || targetWord;
        const charsList = document.getElementById('hanjaCharsList');
        charsList.innerHTML = '';
        q.hanjaChars.forEach(c => {
          const pill = document.createElement('div');
          pill.className = 'hanja-char-pill';
          pill.innerHTML = `
            <span class="c-char">${c.char}</span>
            <span class="c-sound">${c.meaning} ${c.sound}</span>
          `;
          charsList.appendChild(pill);
        });

        document.getElementById('hanjaUsageText').textContent = q.usage || '-';
        document.getElementById('hanjaExampleText').textContent = q.exampleSentence || '-';
        const naverLink = document.getElementById('hanjaNaverLink');
        if (naverLink) {
          naverLink.href = q.naverLink || `https://hanja.dict.naver.com/search?query=${encodeURIComponent(q.hanjaWord || targetWord)}`;
        }
      } else {
        expHanjaArea.style.display = 'none';
      }
    }

    // English specific breakdown
    const expEnglishArea = document.getElementById('expEnglishArea');
    if (expEnglishArea) {
      if (q.englishWord || this.quizSubject === 'english') {
        expEnglishArea.style.display = 'block';
        document.getElementById('englishWordTitle').textContent = q.englishWord || targetWord;
        const phoneticEl = document.getElementById('englishPhonetic');
        if (phoneticEl) {
          phoneticEl.textContent = q.phonetic || '';
          phoneticEl.style.display = q.phonetic ? 'inline-block' : 'none';
        }
        document.getElementById('englishMeaning').textContent = q.meaning || q.dictDefinition || q.explanation || '-';

        // Full Sentence with target word highlighted
        const fullSentEl = document.getElementById('englishFullSentence');
        if (fullSentEl) {
          let fullSent = q.sentence || '';
          const wordToInsert = `<span class="highlight-word" style="color: #4338ca; background: #e0e7ff; padding: 2px 6px; border-radius: 6px; font-weight: 800;">${q.englishWord || targetWord}</span>`;
          if (fullSent.includes('[ (     ) ]') || fullSent.includes('[ ( ? ) ]')) {
            fullSent = fullSent.replace(/\[\s*\(\s*\?*\s*\)\s*\]/g, wordToInsert);
          } else if (fullSent.includes('[') && fullSent.includes(']')) {
            fullSent = fullSent.replace(/\[(.*?)\]/g, wordToInsert);
          }
          fullSentEl.innerHTML = fullSent;
        }

        // Sentence Translation
        const transEl = document.getElementById('englishSentenceTranslation');
        if (transEl) {
          transEl.textContent = q.sentenceTranslation || '-';
        }

        // Key Idioms
        const idiomsEl = document.getElementById('englishIdiomsText');
        if (idiomsEl) {
          idiomsEl.textContent = q.keyIdioms || '-';
        }

        // Key Grammar
        const grammarEl = document.getElementById('englishGrammarText');
        if (grammarEl) {
          grammarEl.textContent = q.grammar || q.explanation || '-';
        }

        document.getElementById('englishExampleText').textContent = q.exampleSentence || '-';
        const naverEnglishLink = document.getElementById('englishNaverLink');
        if (naverEnglishLink) {
          naverEnglishLink.href = q.dictLink || `https://en.dict.naver.com/#/search?query=${encodeURIComponent(q.englishWord || targetWord)}`;
        }
      } else {
        expEnglishArea.style.display = 'none';
      }
    }

    document.getElementById('btnQuizNext').disabled = false;
    this.renderItemBar();
  }

  handleNextQuestion() {
    this.currentIndex++;
    if (this.currentIndex < this.activeQuestions.length) {
      this.renderCurrentQuestion();
    } else {
      this.finishQuiz();
    }
  }

  finishQuiz() {
    sfx.fanfare();
    this.confetti.explode();

    const u = this.data.currentUser;
    const btnNextRound = document.getElementById('btnNextRound');
    const resultFailActions = document.getElementById('resultFailActions');

    // Case A: Finished Revive Quiz (1 question)
    if (this.isReviveQuiz) {
      this.isReviveQuiz = false;
      const passedRevive = this.roundCorrectCount === 1;
      const reviveMode = this.reviveMode || 'daily';
      const reviveLevel = this.reviveLevel;
      const levelPrefix = reviveMode === 'level_daily' ? `[${reviveLevel}] ` : '';

      document.getElementById('resultScore').textContent = passedRevive ? '성공 ⭕' : '실패 ❌';
      document.getElementById('resultCombo').textContent = passedRevive ? '1회' : '0회';
      document.getElementById('resultPoints').textContent = passedRevive ? '+50P' : '+0P';

      if (passedRevive) {
        u.totalPoints += 50;
        DataManager.save(this.data);
        this.renderUserProfile();

        document.getElementById('resultTitle').textContent = `💫 부활 찬스 성공!`;
        document.getElementById('resultSubtitle').textContent = `보너스 1문제를 통과하여 ${levelPrefix}라운드 ${this.currentRound} 도전 자격을 회복했습니다! 🔥`;
        document.getElementById('resultMascot').textContent = '🥳';

        if (btnNextRound) {
          btnNextRound.style.display = 'block';
          btnNextRound.textContent = `🔥 ${levelPrefix}라운드 ${this.currentRound} 다시 도전하기!`;
          btnNextRound.onclick = () => {
            if (reviveMode === 'level_daily') {
              this.startLevelDailyQuiz(reviveLevel, this.currentRound);
            } else {
              this.startQuiz('daily', this.currentRound);
            }
          };
        }
        if (resultFailActions) resultFailActions.style.display = 'none';
      } else {
        const targetRound = Math.max(1, this.currentRound - 1);
        document.getElementById('resultTitle').textContent = `부활 실패 😢`;
        document.getElementById('resultSubtitle').textContent = `아쉽지만 전단계 ${levelPrefix}라운드 ${targetRound}에서 기초를 다지고 다시 올라오세요! 💪`;
        document.getElementById('resultMascot').textContent = '🌸';

        if (btnNextRound) {
          btnNextRound.style.display = 'block';
          btnNextRound.textContent = `🔙 ${levelPrefix}라운드 ${targetRound}에서 다시 도전하기`;
          btnNextRound.onclick = () => {
            if (reviveMode === 'level_daily') {
              this.startLevelDailyQuiz(reviveLevel, targetRound);
            } else {
              this.startQuiz('daily', targetRound);
            }
          };
        }
        if (resultFailActions) resultFailActions.style.display = 'none';
      }

      this.switchView('result');
      return;
    }

    // Case B: Standard Round Quiz
    const totalQuestions = this.activeQuestions.length;
    const isPerfect = this.roundCorrectCount === 5;
    const mistakes = totalQuestions - this.roundCorrectCount;
    let isRoundCleared = isPerfect;
    let shieldDefended = false;

    if (isPerfect) {
      this.perfectRoundStreak++;

      // 2 consecutive perfect rounds -> +1 shield
      if (this.perfectRoundStreak % 2 === 0) {
        this.shields = Math.min(3, this.shields + 1);
        localStorage.setItem('haru_game_shields', this.shields);
        this.showToastNotice(`🛡️ 2연속 만점 달성! 방패 1개를 획득했습니다! (보유: ${this.shields}개)`);
      }

      // 3 consecutive perfect rounds -> +300P bonus
      if (this.perfectRoundStreak % 3 === 0) {
        this.currentScore += 300;
        this.showToastNotice('👑 3연속 만점 마스터! 보너스 +300P를 획득했습니다! 🥳');
      }
    } else if (mistakes <= 2 && this.shields > 0) {
      // Shield protects up to 2 mistakes!
      this.useShield();
      isRoundCleared = true;
      shieldDefended = true;
      this.showToastNotice(`🛡️ 방패가 오답(${mistakes}개)을 방어하여 다음 라운드 진출 자격을 획득했습니다!`);
    } else {
      this.perfectRoundStreak = 0;
    }

    u.totalSolved += totalQuestions;
    u.totalCorrect += this.roundCorrectCount;

    let pointsEarned = this.currentScore;
    if (this.currentRound > 1 && isRoundCleared) {
      pointsEarned += 50; // Bonus +50P for round clear
    }
    // Apply 2x booster
    if (this.pointMultiplier > 1) {
      pointsEarned *= this.pointMultiplier;
      this.showToastNotice(`⭐ 2배 부스터 적용! 총 +${pointsEarned}P 적립!`);
      this.pointMultiplier = 1;
    }
    this.activeItemMagnet = false;
    this.activeItemHeart = false;
    u.totalPoints += pointsEarned;

    const todayStr = getKSTDateString();
    if (!u.completedDates.includes(todayStr)) {
      u.completedDates.push(todayStr);
      u.streak = (u.streak || 0) + 1;
      u.lastActiveDate = todayStr;
    }

    if (this.currentRound === 1) {
      u.todayScore = Math.max(u.todayScore || 0, this.currentScore);
      if (this.quizSubject === 'hanja') {
        u.todayScoreHanja = Math.max(u.todayScoreHanja || 0, this.currentScore);
      } else if (this.quizSubject === 'english') {
        u.todayScoreEnglish = Math.max(u.todayScoreEnglish || 0, this.currentScore);
      } else {
        u.todayScoreSpelling = Math.max(u.todayScoreSpelling || 0, this.currentScore);
      }
    }
    if (this.quizSubject === 'hanja') {
      u.pointsHanja = (u.pointsHanja || 0) + pointsEarned;
    } else if (this.quizSubject === 'english') {
      u.pointsEnglish = (u.pointsEnglish || 0) + pointsEarned;
    } else {
      u.pointsSpelling = (u.pointsSpelling || 0) + pointsEarned;
    }

    if (isRoundCleared) {
      u.maxRoundToday = Math.max(u.maxRoundToday || 1, this.currentRound);
      if (this.quizSubject === 'hanja') {
        u.maxRoundHanja = Math.max(u.maxRoundHanja || 1, this.currentRound);
      } else if (this.quizSubject === 'english') {
        u.maxRoundEnglish = Math.max(u.maxRoundEnglish || 1, this.currentRound);
      } else {
        u.maxRoundSpelling = Math.max(u.maxRoundSpelling || 1, this.currentRound);
      }
    }

    // Check badges
    if (isRoundCleared && !this.data.badges.includes('perfect_100')) {
      this.data.badges.push('perfect_100');
    }
    if (u.streak >= 3 && !this.data.badges.includes('streak_3')) {
      this.data.badges.push('streak_3');
    }
    if (u.streak >= 7 && !this.data.badges.includes('streak_7')) {
      this.data.badges.push('streak_7');
    }
    if (this.maxCombo >= 5 && !this.data.badges.includes('combo_master')) {
      this.data.badges.push('combo_master');
    }

    // Update peer ranking
    const me = this.data.allUsers.find(p => p.id === u.id);
    if (me) {
      me.totalPoints = u.totalPoints;
      me.streak = u.streak;
      me.todayScore = u.todayScore;
      me.maxRoundToday = u.maxRoundToday;
      if (this.quizSubject === 'hanja') {
        me.maxRoundHanja = u.maxRoundHanja;
        me.todayScoreHanja = u.todayScoreHanja;
        me.pointsHanja = u.pointsHanja;
      } else if (this.quizSubject === 'english') {
        me.maxRoundEnglish = u.maxRoundEnglish;
        me.todayScoreEnglish = u.todayScoreEnglish;
        me.pointsEnglish = u.pointsEnglish;
      } else {
        me.maxRoundSpelling = u.maxRoundSpelling;
        me.todayScoreSpelling = u.todayScoreSpelling;
        me.pointsSpelling = u.pointsSpelling;
      }
    }

    DataManager.save(this.data);

    this.syncToCloud(isRoundCleared ? 'ROUND_CLEAR' : 'QUIZ_FINISH', {
      mode: this.quizSubject,
      round: this.currentRound,
      score: this.currentScore,
      pointsEarned,
      maxRoundToday: u.maxRoundToday,
      todayScore: u.todayScore
    });

    this.renderUserProfile();
    this.renderCalendarWeek();

    // Render Result Screen
    document.getElementById('resultScore').textContent = `${this.currentScore}점`;
    document.getElementById('resultCombo').textContent = `${this.maxCombo}회`;
    document.getElementById('resultPoints').textContent = `+${pointsEarned}P`;

    const btnEliminated = document.getElementById('btnEliminatedRestart');

    const isLevelDaily = this.currentMode === 'level_daily';
    const isRoundMode = this.currentMode === 'daily' || isLevelDaily;
    const btnLevelChange = document.getElementById('btnLevelChange');
    if (btnLevelChange) {
      btnLevelChange.style.display = isLevelDaily ? 'block' : 'none';
    }

    if (isRoundCleared && isRoundMode) {
      const modePrefix = isLevelDaily ? `[${this.selectedLevel}] ` : '';
      document.getElementById('resultTitle').textContent = shieldDefended 
        ? `🛡️ 방패 방어로 ${modePrefix}라운드 ${this.currentRound} 통과!` 
        : `🎉 ${modePrefix}라운드 ${this.currentRound} 만점 통과!`;
      document.getElementById('resultSubtitle').textContent = shieldDefended
        ? `방패가 ${mistakes}회 오답을 막아주었습니다! 다음 라운드에서 실력을 보여주세요! 🔥`
        : `5문제를 모두 맞히셨어요! 다음 라운드에 도전해 실력을 뽐내보세요! 🔥`;
      document.getElementById('resultMascot').textContent = '🥳';

      if (btnNextRound) {
        btnNextRound.style.display = 'block';
        btnNextRound.textContent = `🎉 ${modePrefix}라운드 ${this.currentRound + 1} (새 5문제) 도전하기 🔥`;
        btnNextRound.onclick = () => this.startNextRound();
      }
      if (resultFailActions) resultFailActions.style.display = 'none';
      if (btnEliminated) btnEliminated.style.display = 'none';
    } else if (isRoundMode) {
      const modePrefix = isLevelDaily ? `[${this.selectedLevel}] ` : '';
      // Failed round
      if (mistakes >= 3) {
        // Complete Elimination! Drop to Round 1
        document.getElementById('resultTitle').textContent = `💥 ${modePrefix}탈락! (3문제 이상 오답)`;
        document.getElementById('resultSubtitle').textContent = `3문제 이상 틀려 탈락했습니다! 1라운드부터 다시 풀어야 합니다. 힘내서 다시 도전해보세요! 💪`;
        document.getElementById('resultMascot').textContent = '🥺';

        if (btnNextRound) btnNextRound.style.display = 'none';
        if (resultFailActions) resultFailActions.style.display = 'none';
        if (btnEliminated) {
          btnEliminated.style.display = 'block';
          btnEliminated.textContent = `🔁 3문제 이상 탈락! ${modePrefix}1라운드부터 다시 풀기 🔥`;
          btnEliminated.onclick = () => {
            if (isLevelDaily) {
              this.startLevelDailyQuiz(this.selectedLevel, 1);
            } else {
              this.startQuiz('daily', 1);
            }
          };
        }
      } else {
        // 1 or 2 mistakes: Give chance! (Revive or Checkpoint R-1)
        const fallbackRound = Math.max(1, this.currentRound - 1);
        document.getElementById('resultTitle').textContent = `${modePrefix}라운드 ${this.currentRound} 아쉬운 오답 (${mistakes}개) 💫`;
        document.getElementById('resultSubtitle').textContent = `2문제까지는 재도전 기회가 주어집니다! 부활 찬스 1문제를 맞히고 현재 라운드를 유지하거나, 전단계에서 다시 도전해보세요!`;
        document.getElementById('resultMascot').textContent = '🌸';

        if (btnNextRound) btnNextRound.style.display = 'none';
        if (btnEliminated) btnEliminated.style.display = 'none';
        if (resultFailActions) {
          resultFailActions.style.display = 'flex';
          const btnRevive = document.getElementById('btnReviveQuiz');
          const btnFallback = document.getElementById('btnFallbackRound');
          if (btnRevive) {
            btnRevive.textContent = `💫 부활 찬스: 보너스 1문제 맞추고 라운드 ${this.currentRound} 유지!`;
            btnRevive.onclick = () => this.handleReviveQuiz();
          }
          if (btnFallback) {
            btnFallback.textContent = `🔙 전단계 라운드 ${fallbackRound}에서 다시 도전하기`;
            btnFallback.onclick = () => {
              if (isLevelDaily) {
                this.startLevelDailyQuiz(this.selectedLevel, fallbackRound);
              } else {
                this.startQuiz('daily', fallbackRound);
              }
            };
          }
        }
      }
    } else {
      document.getElementById('resultTitle').textContent = '오늘의 퀴즈 완료! 💕';
      document.getElementById('resultSubtitle').textContent = '꾸준히 풀다 보면 우리말과 한자 실력이 쑥쑥 자라나요!';
      document.getElementById('resultMascot').textContent = '🌸';
      if (btnNextRound) btnNextRound.style.display = 'none';
      if (resultFailActions) resultFailActions.style.display = 'none';
      if (btnEliminated) btnEliminated.style.display = 'none';
    }

    this.switchView('result');
  }

  startNextRound() {
    if (this.currentMode === 'level_daily') {
      this.startLevelDailyQuiz(this.selectedLevel, this.currentRound + 1);
    } else {
      this.startQuiz('daily', this.currentRound + 1);
    }
  }

  fallbackRound() {
    const prev = Math.max(1, this.currentRound - 1);
    if (this.currentMode === 'level_daily') {
      this.startLevelDailyQuiz(this.selectedLevel, prev);
    } else {
      this.startQuiz('daily', prev);
    }
  }

  // ============================================================
  // Surprise Lucky Box Methods
  // ============================================================
  openLuckyBoxModal() {
    const modal = document.getElementById('modalLuckyBox');
    if (!modal) return;
    const rewardArea = document.getElementById('luckyBoxRewardArea');
    const btnOpen = document.getElementById('btnOpenLuckyBox');
    const btnClose = document.getElementById('btnCloseLuckyBox');

    if (rewardArea) rewardArea.style.display = 'none';
    if (btnOpen) {
      btnOpen.style.display = 'block';
      btnOpen.disabled = false;
      btnOpen.textContent = '🎁 상자 열어보기!';
    }
    if (btnClose) btnClose.style.display = 'none';

    modal.classList.add('active');
    sfx.combo();
  }

  executeLuckyBoxOpen() {
    const rewardArea = document.getElementById('luckyBoxRewardArea');
    const rewardEmoji = document.getElementById('luckyRewardEmoji');
    const rewardName = document.getElementById('luckyRewardName');
    const rewardDesc = document.getElementById('luckyRewardDesc');
    const btnOpen = document.getElementById('btnOpenLuckyBox');
    const btnClose = document.getElementById('btnCloseLuckyBox');

    // 8 possible rewards (7 items + shield)
    const pool = [
      { key: 'eraser5050', type: 'item', emoji: '🪄', name: '50:50 요술봉', desc: '오답 2개를 즉시 지워주는 요술봉 획득!' },
      { key: 'heart', type: 'item', emoji: '💖', name: '하트 수호', desc: '틀려도 1회 오답 무효화 찬스 획득!' },
      { key: 'booster2x', type: 'item', emoji: '🚀', name: '2배 로켓 부스터', desc: '라운드 클리어 포인트 2배 적립 부스터 획득!' },
      { key: 'hint', type: 'item', emoji: '🔍', name: '돋보기 힌트', desc: '정답과 어원 해설 힌트 열람권 획득!' },
      { key: 'clover', type: 'item', emoji: '🍀', name: '행운의 클로버', desc: '문제를 즉시 정답으로 통과하는 프리패스 획득!' },
      { key: 'timemachine', type: 'item', emoji: '⌛', name: '타임머신 시계', desc: '방금 고른 오답을 취소하고 시간을 되돌리는 시계 획득!' },
      { key: 'magnet', type: 'item', emoji: '🧲', name: '콤보 자석', desc: '연속 정답 시 콤보 점수를 4배로 흡수하는 자석 획득!' },
      { key: 'shield', type: 'shield', emoji: '🛡️', name: '수호 방패', desc: '라운드 오답 2회까지 든든하게 막아주는 방패 획득!' }
    ];

    const pick = pool[Math.floor(Math.random() * pool.length)];

    if (pick.type === 'shield') {
      this.shields = Math.min(5, (this.shields || 0) + 1);
      localStorage.setItem('haru_game_shields', this.shields);
    } else {
      this.items[pick.key] = (this.items[pick.key] || 0) + 1;
      const storageKey = {
        eraser5050: 'haru_item_5050',
        heart: 'haru_item_heart',
        booster2x: 'haru_item_booster',
        hint: 'haru_item_hint',
        clover: 'haru_item_clover',
        timemachine: 'haru_item_timemachine',
        magnet: 'haru_item_magnet'
      }[pick.key];
      if (storageKey) {
        localStorage.setItem(storageKey, this.items[pick.key]);
      }
    }

    if (rewardEmoji) rewardEmoji.textContent = pick.emoji;
    if (rewardName) rewardName.textContent = `${pick.emoji} ${pick.name} +1`;
    if (rewardDesc) rewardDesc.textContent = pick.desc;
    if (rewardArea) rewardArea.style.display = 'block';

    if (btnOpen) btnOpen.style.display = 'none';
    if (btnClose) btnClose.style.display = 'block';

    sfx.fanfare();
    if (this.confetti) this.confetti.explode();
    this.renderItemBar();
    this.renderShieldStatus();
    this.renderUserProfile();
    this.showToastNotice(`🎁 럭키 박스 당첨! [${pick.name}]을 획득했습니다! ✨`);
  }

  closeLuckyBoxModal() {
    const modal = document.getElementById('modalLuckyBox');
    if (modal) modal.classList.remove('active');
  }

  // ============================================================
  // Gamification & Item Mechanics (Shields, 50:50, Heart, Booster, Revive)
  // ============================================================
  useShield() {
    if (this.shields > 0) {
      this.shields--;
      localStorage.setItem('haru_game_shields', this.shields);
      this.renderShieldStatus();
      this.renderUserProfile();
      return true;
    }
    return false;
  }

  renderShieldStatus() {
    const shieldBadge = document.getElementById('quizShieldBadge');
    if (shieldBadge) {
      shieldBadge.style.display = 'inline-block';
      shieldBadge.textContent = `🛡️ ${this.shields}개`;
      shieldBadge.title = `1회 오답을 방어해 주는 방패입니다 (보유: ${this.shields}개)`;
    }
  }

  renderItemBar() {
    const btn5050 = document.getElementById('btnItem5050');
    const btnHeart = document.getElementById('btnItemHeart');
    const btnDouble = document.getElementById('btnItemDouble');
    const btnHint = document.getElementById('btnItemHint');
    const btnClover = document.getElementById('btnItemClover');
    const btnTimemachine = document.getElementById('btnItemTimemachine');
    const btnMagnet = document.getElementById('btnItemMagnet');

    const badge5050 = document.getElementById('badgeItem5050');
    const badgeHeart = document.getElementById('badgeItemHeart');
    const badgeDouble = document.getElementById('badgeItemDouble');
    const badgeHint = document.getElementById('badgeItemHint');
    const badgeClover = document.getElementById('badgeItemClover');
    const badgeTimemachine = document.getElementById('badgeItemTimemachine');
    const badgeMagnet = document.getElementById('badgeItemMagnet');

    const banner = document.getElementById('activeItemStatusBanner');

    const q = this.activeQuestions && this.activeQuestions[this.currentIndex];
    const isAnswered = this.selectedOption !== null;
    const isAnsweredWrong = isAnswered && q && this.selectedOption !== q.answerIndex;

    if (btn5050) {
      btn5050.disabled = this.items.eraser5050 <= 0 || isAnswered;
      if (badge5050) badge5050.textContent = this.items.eraser5050;
    }
    if (btnHeart) {
      btnHeart.disabled = this.items.heart <= 0 || isAnswered;
      if (badgeHeart) badgeHeart.textContent = this.items.heart;
      if (this.activeItemHeart) btnHeart.classList.add('active');
      else btnHeart.classList.remove('active');
    }
    if (btnDouble) {
      btnDouble.disabled = this.items.booster2x <= 0 || this.pointMultiplier === 2;
      if (badgeDouble) badgeDouble.textContent = this.items.booster2x;
      if (this.pointMultiplier === 2) btnDouble.classList.add('active');
      else btnDouble.classList.remove('active');
    }
    if (btnHint) {
      btnHint.disabled = this.items.hint <= 0 || isAnswered;
      if (badgeHint) badgeHint.textContent = this.items.hint;
    }
    if (btnClover) {
      btnClover.disabled = this.items.clover <= 0 || isAnswered;
      if (badgeClover) badgeClover.textContent = this.items.clover;
    }
    if (btnTimemachine) {
      btnTimemachine.disabled = this.items.timemachine <= 0 || !isAnsweredWrong;
      if (badgeTimemachine) badgeTimemachine.textContent = this.items.timemachine;
    }
    if (btnMagnet) {
      btnMagnet.disabled = this.items.magnet <= 0 || this.activeItemMagnet;
      if (badgeMagnet) badgeMagnet.textContent = this.items.magnet;
      if (this.activeItemMagnet) btnMagnet.classList.add('active');
      else btnMagnet.classList.remove('active');
    }

    // Active Item Intuitive Banner
    if (banner) {
      if (this.activeItemHeart) {
        banner.style.display = 'flex';
        banner.className = 'active-item-banner banner-heart';
        banner.innerHTML = `<span>💖</span> <span><strong>[하트 수호 발동 중]</strong> 틀려도 안심! 1회 무료 재선택 기회가 보호 중이에요!</span>`;
      } else if (this.pointMultiplier === 2) {
        banner.style.display = 'flex';
        banner.className = 'active-item-banner banner-rocket';
        banner.innerHTML = `<span>🚀</span> <span><strong>[2배 로켓 가동 중]</strong> 이번 라운드 획득 포인트가 2배로 적립됩니다!</span>`;
      } else if (this.activeItemMagnet) {
        banner.style.display = 'flex';
        banner.className = 'active-item-banner banner-magnet';
        banner.innerHTML = `<span>🧲</span> <span><strong>[콤보 자석 가동 중]</strong> 연속 정답 시 콤보 점수가 4배로 강력 흡수됩니다!</span>`;
      } else {
        banner.style.display = 'none';
      }
    }
  }

  useItem5050() {
    if (this.items.eraser5050 <= 0 || this.selectedOption !== null) return;
    const q = this.activeQuestions[this.currentIndex];
    const buttons = document.querySelectorAll('.option-btn');
    const wrongIndices = [];
    q.options.forEach((opt, idx) => {
      if (idx !== q.answerIndex) wrongIndices.push(idx);
    });

    wrongIndices.sort(() => 0.5 - Math.random());
    const toHide = wrongIndices.slice(0, 2);
    toHide.forEach(idx => {
      if (buttons[idx]) {
        buttons[idx].classList.add('erased');
        buttons[idx].innerHTML = `
          <span style="text-decoration: line-through; opacity: 0.4;">${idx + 1}. ${q.options[idx]}</span>
          <span class="opt-icon" style="font-size: 0.8rem; color: #94a3b8;">💨 뿅! 지워짐</span>
        `;
      }
    });

    this.items.eraser5050--;
    localStorage.setItem('haru_item_5050', this.items.eraser5050);
    this.renderItemBar();
    sfx.correct();
    this.showToastNotice('🪄 50:50 요술봉 뿅! 오답 2개가 사라졌습니다! ✨');
  }

  useItemHeart() {
    if (this.items.heart <= 0 || this.selectedOption !== null) return;
    this.activeItemHeart = true;
    this.items.heart--;
    localStorage.setItem('haru_item_heart', this.items.heart);
    this.renderItemBar();
    sfx.combo();
    this.showToastNotice('💖 하트 수호 가동! 오답을 선택해도 1회 다시 선택할 수 있습니다.');
  }

  useItemDouble() {
    if (this.items.booster2x <= 0) return;
    this.pointMultiplier = 2;
    this.items.booster2x--;
    localStorage.setItem('haru_item_booster', this.items.booster2x);
    this.renderItemBar();
    sfx.fanfare();
    this.showToastNotice('🚀 2배 로켓 부스터 가동! 이번 라운드 획득 포인트가 2배로 적립됩니다!');
  }

  useItemHint() {
    if (this.items.hint <= 0 || this.selectedOption !== null) return;
    const q = this.activeQuestions[this.currentIndex];
    if (!q) return;

    const hintBox = document.getElementById('quizHintBox');
    const hintText = document.getElementById('quizHintText');
    if (!hintBox || !hintText) return;

    let text = q.dictDefinition || q.meaning || q.explanation || '';
    if (q.standardWord) {
      text = `💡 <strong>[표준어 어원 힌트]</strong> '${q.standardWord}'의 올바른 맞춤법 원리를 생각해보세요!<br>${text}`;
    } else if (q.hanjaWord) {
      text = `💡 <strong>[한자 어휘 힌트]</strong> '${q.hanjaWord}'의 한자 구성과 뜻을 떠올려보세요!<br>${text}`;
    } else if (q.englishWord) {
      text = `💡 <strong>[영어 철자 힌트]</strong> 발음: <code>${q.phonetic || ''}</code> / 뜻: <strong>${q.meaning || ''}</strong><br>${text}`;
    }

    hintText.innerHTML = text;
    hintBox.style.display = 'block';

    this.items.hint--;
    localStorage.setItem('haru_item_hint', this.items.hint);
    this.renderItemBar();
    sfx.correct();
    this.showToastNotice('🔍 돋보기 힌트 오픈! 문제 해결의 실마리를 확인해보세요! ✨');
  }

  useItemClover() {
    if (this.items.clover <= 0 || this.selectedOption !== null) return;
    const q = this.activeQuestions[this.currentIndex];
    if (!q) return;

    this.items.clover--;
    localStorage.setItem('haru_item_clover', this.items.clover);

    const buttons = document.querySelectorAll('.option-btn');
    const targetBtn = buttons[q.answerIndex];

    this.showToastNotice('🍀 행운의 네잎클로버 발동! 문제를 즉시 정답으로 통과합니다! ✨');
    sfx.fanfare();
    if (this.confetti) {
      this.confetti.explode();
    }

    this.handleOptionSelect(q.answerIndex, targetBtn || document.createElement('button'));
    this.renderItemBar();
  }

  useItemTimemachine() {
    if (this.items.timemachine <= 0) return;
    const q = this.activeQuestions[this.currentIndex];
    if (!q || this.selectedOption === null || this.selectedOption === q.answerIndex) return;

    const wrongIdx = this.selectedOption;
    this.selectedOption = null;

    // Remove from wrong notebook
    this.data.wrongQuestions = (this.data.wrongQuestions || []).filter(item => item.id !== q.id);

    // Re-enable options except the wrong one
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach((b, i) => {
      if (i === wrongIdx) {
        b.disabled = true;
        b.classList.remove('wrong');
        b.classList.add('erased');
        b.innerHTML = `
          <span style="text-decoration: line-through; opacity: 0.4;">${i + 1}. ${q.options[i]}</span>
          <span class="opt-icon" style="font-size: 0.8rem; color: #ef4444;">❌ 되돌린 오답</span>
        `;
      } else {
        b.disabled = false;
        b.classList.remove('correct');
        b.querySelector('.opt-icon').textContent = '✨';
      }
    });

    // Hide Explanation Card
    const expCard = document.getElementById('quizExplanation');
    if (expCard) expCard.classList.remove('active');
    const expHanjaArea = document.getElementById('expHanjaArea');
    if (expHanjaArea) expHanjaArea.style.display = 'none';
    const expEnglishArea = document.getElementById('expEnglishArea');
    if (expEnglishArea) expEnglishArea.style.display = 'none';

    // Restore blank if it was filled
    const blankEl = document.querySelector('.quiz-blank');
    if (blankEl) {
      blankEl.innerHTML = `( &nbsp;?&nbsp; )`;
      blankEl.classList.remove('answered');
    }

    // Disable Next Button again
    const nextBtn = document.getElementById('btnQuizNext');
    if (nextBtn) nextBtn.disabled = true;

    this.items.timemachine--;
    localStorage.setItem('haru_item_timemachine', this.items.timemachine);
    this.renderItemBar();
    sfx.combo();
    this.showToastNotice('⌛ 타임머신 가동! 방금 오답을 취소하고 시간을 되돌렸습니다. 다시 풀어보세요!');
  }

  useItemMagnet() {
    if (this.items.magnet <= 0 || this.activeItemMagnet) return;
    this.activeItemMagnet = true;
    this.items.magnet--;
    localStorage.setItem('haru_item_magnet', this.items.magnet);
    this.renderItemBar();
    sfx.combo();
    this.showToastNotice('🧲 콤보 자석 가동! 연속 정답 시 콤보 점수를 강력 흡수합니다!');
  }

  handleReviveQuiz() {
    this.isReviveQuiz = true;
    this.reviveMode = this.currentMode;
    this.reviveLevel = this.selectedLevel;
    this.roundCorrectCount = 0;
    this.currentIndex = 0;
    this.currentScore = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.selectedOption = null;

    // Pick 1 random question matching the subject / level
    const bank = this.getActiveBank();
    let pool = bank;
    if (this.reviveMode === 'level_daily' && this.reviveLevel) {
      const filtered = bank.filter(q => q.level && q.level.includes(this.reviveLevel));
      pool = (filtered.length >= 1) ? filtered : bank;
    }
    this.activeQuestions = this.getRandomQuestionsFromPool(pool, 1).map(q => this.shuffleQuestionOptions(q));

    const roundBadge = document.getElementById('quizRoundBadge');
    if (roundBadge) {
      const levelPrefix = (this.reviveMode === 'level_daily' && this.reviveLevel) ? `${this.reviveLevel} ` : '';
      roundBadge.textContent = `💫 ${levelPrefix}부활 퀴즈 (1문제)`;
      roundBadge.style.display = 'inline-block';
    }

    this.switchView('quiz');
    this.renderCurrentQuestion();
    this.renderShieldStatus();
    this.renderItemBar();
  }

  openGameGuideModal() {
    if (this.modalGameGuide) this.modalGameGuide.classList.add('active');
  }

  closeGameGuideModal() {
    if (this.modalGameGuide) this.modalGameGuide.classList.remove('active');
  }

  // ============================================================
  // Leaderboard / Ranking View (Dual-Subject & Highest-Round)
  // ============================================================
  async renderLeaderboard(type = 'round') {
    const listContainer = document.getElementById('leaderboardList');
    if (!listContainer) return;

    const currentType = type || this.rankType || 'round';
    this.rankType = currentType;
    const currentSubject = this.rankSubject || 'spelling';

    try {
      const res = await fetch(`/api/leaderboard?mode=${currentSubject}&type=${currentType}`);
      if (res.ok) {
        const body = await res.json();
        if (body.success && Array.isArray(body.leaderboard)) {
          const myId = this.data.currentUser.id;
          const myName = this.data.currentUser.name;
          this.data.allUsers = body.leaderboard.map(u => ({
            ...u,
            isMe: u.id === myId || u.name === myName
          }));

          // If current user is not yet in leaderboard, add locally
          if (!this.data.allUsers.some(u => u.isMe)) {
            this.data.allUsers.push({
              id: myId,
              name: myName,
              avatar: this.data.currentUser.avatar || '🌸',
              grade: this.data.currentUser.grade || '중학교 2학년',
              totalPoints: this.data.currentUser.totalPoints || 0,
              streak: this.data.currentUser.streak || 1,
              todayScore: this.data.currentUser.todayScore || 0,
              maxRoundToday: this.data.currentUser.maxRoundToday || 1,
              maxRoundSpelling: this.data.currentUser.maxRoundSpelling || (this.data.currentUser.maxRoundToday || 1),
              maxRoundHanja: this.data.currentUser.maxRoundHanja || 1,
              maxRoundEnglish: this.data.currentUser.maxRoundEnglish || 1,
              todayScoreSpelling: this.data.currentUser.todayScoreSpelling || 0,
              todayScoreHanja: this.data.currentUser.todayScoreHanja || 0,
              todayScoreEnglish: this.data.currentUser.todayScoreEnglish || 0,
              pointsSpelling: this.data.currentUser.pointsSpelling || 0,
              pointsHanja: this.data.currentUser.pointsHanja || 0,
              pointsEnglish: this.data.currentUser.pointsEnglish || 0,
              isMe: true
            });
          }
          DataManager.save(this.data);
        }
      }
    } catch (e) {
      // Offline fallback: use local cached allUsers
    }

    listContainer.innerHTML = '';
    const users = [...(this.data.allUsers || [])];

    // Local sort fallback
    if (currentType === 'round') {
      if (currentSubject === 'hanja') {
        users.sort((a, b) => ((b.maxRoundHanja || 1) - (a.maxRoundHanja || 1)) || ((b.totalPoints || 0) - (a.totalPoints || 0)));
      } else if (currentSubject === 'english') {
        users.sort((a, b) => ((b.maxRoundEnglish || 1) - (a.maxRoundEnglish || 1)) || ((b.totalPoints || 0) - (a.totalPoints || 0)));
      } else {
        users.sort((a, b) => ((b.maxRoundSpelling || b.maxRoundToday || 1) - (a.maxRoundSpelling || a.maxRoundToday || 1)) || ((b.totalPoints || 0) - (a.totalPoints || 0)));
      }
    } else if (currentType === 'total') {
      if (currentSubject === 'hanja') {
        users.sort((a, b) => ((b.pointsHanja || 0) - (a.pointsHanja || 0)) || ((b.totalPoints || 0) - (a.totalPoints || 0)));
      } else if (currentSubject === 'english') {
        users.sort((a, b) => ((b.pointsEnglish || 0) - (a.pointsEnglish || 0)) || ((b.totalPoints || 0) - (a.totalPoints || 0)));
      } else if (currentSubject === 'spelling') {
        users.sort((a, b) => ((b.pointsSpelling || 0) - (a.pointsSpelling || 0)) || ((b.totalPoints || 0) - (a.totalPoints || 0)));
      } else {
        users.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
      }
    } else {
      // daily
      if (currentSubject === 'hanja') {
        users.sort((a, b) => ((b.todayScoreHanja || 0) - (a.todayScoreHanja || 0)) || ((b.todayScore || 0) - (a.todayScore || 0)));
      } else if (currentSubject === 'english') {
        users.sort((a, b) => ((b.todayScoreEnglish || 0) - (a.todayScoreEnglish || 0)) || ((b.todayScore || 0) - (a.todayScore || 0)));
      } else {
        users.sort((a, b) => ((b.todayScoreSpelling || b.todayScore || 0) - (a.todayScoreSpelling || a.todayScore || 0)));
      }
    }

    users.forEach((user, idx) => {
      const rankNum = idx + 1;
      const rankClass = rankNum === 1 ? 'rank-1' : rankNum === 2 ? 'rank-2' : rankNum === 3 ? 'rank-3' : 'rank-other';
      const rankBadgeIcon = rankNum === 1 ? '👑' : rankNum === 2 ? '🥈' : rankNum === 3 ? '🥉' : rankNum;
      
      let relevantRound = 1;
      if (currentSubject === 'hanja') relevantRound = user.maxRoundHanja || 1;
      else if (currentSubject === 'english') relevantRound = user.maxRoundEnglish || 1;
      else relevantRound = user.maxRoundSpelling || user.maxRoundToday || 1;

      const roundTag = relevantRound > 1 
        ? `<span class="rank-tag-round">🔥 ${relevantRound}R</span>`
        : '';

      let scoreDisplay = '';
      if (currentType === 'round') {
        scoreDisplay = `${relevantRound} <span>라운드</span>`;
      } else if (currentType === 'daily') {
        let dScore = 0;
        if (currentSubject === 'hanja') dScore = user.todayScoreHanja || 0;
        else if (currentSubject === 'english') dScore = user.todayScoreEnglish || 0;
        else dScore = user.todayScoreSpelling || user.todayScore || 0;
        scoreDisplay = `${dScore} <span>점</span>`;
      } else {
        let tPoints = 0;
        if (currentSubject === 'hanja') tPoints = user.pointsHanja || user.totalPoints || 0;
        else if (currentSubject === 'english') tPoints = user.pointsEnglish || user.totalPoints || 0;
        else tPoints = user.pointsSpelling || user.totalPoints || 0;
        scoreDisplay = `${tPoints} <span>P</span>`;
      }

      const item = document.createElement('div');
      item.className = `rank-item ${rankClass} ${user.isMe ? 'is-me' : ''}`;
      item.innerHTML = `
        <div class="rank-badge">${rankBadgeIcon}</div>
        <div class="rank-avatar">${user.avatar || '🌸'}</div>
        <div class="rank-info">
          <div class="rank-name-row">
            <span class="rank-name">${user.name}</span>
            ${user.isMe ? '<span class="rank-tag-me">나</span>' : ''}
            ${roundTag}
          </div>
          <div class="rank-sub">${user.grade || '일반'} · 🔥 ${user.streak || 1}일 연속</div>
        </div>
        <div class="rank-score">
          ${scoreDisplay}
        </div>
      `;
      listContainer.appendChild(item);
    });
  }

  // ============================================================
  // Badges View
  // ============================================================
  renderBadges() {
    const grid = document.getElementById('badgesGrid');
    grid.innerHTML = '';

    BADGE_DEFINITIONS.forEach(b => {
      const isUnlocked = this.data.badges.includes(b.id);
      const card = document.createElement('div');
      card.className = `badge-card ${isUnlocked ? 'unlocked' : 'locked'}`;
      card.innerHTML = `
        <div class="badge-icon">${b.icon}</div>
        <div class="badge-name">${b.name}</div>
        <div class="badge-desc">${b.desc}</div>
      `;
      grid.appendChild(card);
    });
  }

  trackDictionarySearch() {
    this.dictSearchCount = (this.dictSearchCount || 0) + 1;
    if (this.dictSearchCount >= 3 && !this.data.badges.includes('dict_explorer')) {
      this.data.badges.push('dict_explorer');
      DataManager.save(this.data);
    }
  }

  // ============================================================
  // Profile & API Modal
  // ============================================================
  openProfileModal() {
    const u = this.data.currentUser;
    document.getElementById('inputNickname').value = u.name;
    document.getElementById('selectGrade').value = u.grade;

    document.querySelectorAll('.avatar-opt').forEach(opt => {
      opt.classList.toggle('selected', opt.dataset.avatar === u.avatar);
    });

    // Check if user is '단민러브'
    const btnAdmin = document.getElementById('btnOpenAdminLogs');
    if (btnAdmin) {
      btnAdmin.style.display = (u.name === '단민러브' || u.username === '단민러브') ? 'block' : 'none';
    }

    this.fetchUserLogs();
    this.modalProfile.classList.add('active');
  }

  async fetchUserLogs() {
    const container = document.getElementById('userLogsContainer');
    if (!container) return;

    if (!this.cloudToken) {
      container.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 10px;">로그인 시 기기 접속 및 퀴즈 활동 이력이 기록됩니다.</div>';
      return;
    }

    container.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 10px;">이력을 불러오는 중...</div>';

    try {
      const res = await fetch('/api/user/logs', {
        headers: { 'Authorization': `Bearer ${this.cloudToken}` }
      });
      if (res.ok) {
        const body = await res.json();
        if (body.success && Array.isArray(body.logs) && body.logs.length > 0) {
          container.innerHTML = body.logs.map(l => {
            const badgeClass = l.action || 'DEFAULT';
            const actionText = l.action === 'LOGIN_SUCCESS' ? '로그인 성공'
              : l.action === 'LOGIN_FAIL' ? '로그인 실패'
              : l.action === 'REGISTER' ? '회원가입'
              : l.action === 'ROUND_CLEAR' ? `라운드 클리어 (${l.details && l.details.round ? l.details.round + 'R' : ''})`
              : '퀴즈 활동';
            return `
              <div class="log-item-row">
                <span class="log-badge ${badgeClass}">${actionText}</span>
                <span class="log-ip">${l.ip || '-'}</span>
                <span class="log-time">${l.kstTime || (l.timestamp ? l.timestamp.substring(5, 16) : '')}</span>
              </div>
            `;
          }).join('');
          return;
        }
      }
      container.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 10px;">기록된 이용 이력이 없습니다.</div>';
    } catch (e) {
      container.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 10px;">이력을 불러올 수 없습니다.</div>';
    }
  }

  openAdminLogsModal() {
    if (this.modalAdminLogs) {
      this.modalAdminLogs.classList.add('active');
      this.fetchAdminLogs();
    }
  }

  closeAdminLogsModal() {
    if (this.modalAdminLogs) {
      this.modalAdminLogs.classList.remove('active');
    }
  }

  async fetchAdminLogs() {
    const container = document.getElementById('adminLogsContainer');
    if (!container) return;

    container.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 20px;">감사 로그를 동기화하는 중...</div>';

    try {
      const res = await fetch('/api/admin/logs', {
        headers: { 'Authorization': `Bearer ${this.cloudToken}` }
      });
      if (res.ok) {
        const body = await res.json();
        if (body.success && Array.isArray(body.logs)) {
          if (body.logs.length === 0) {
            container.innerHTML = '<div style="text-align: center; color: var(--text-muted); padding: 20px;">저장된 감사 로그가 없습니다.</div>';
            return;
          }
          container.innerHTML = body.logs.map(l => {
            const badgeClass = l.action || 'DEFAULT';
            const actionText = l.action === 'LOGIN_SUCCESS' ? '로그인 성공'
              : l.action === 'LOGIN_FAIL' ? '로그인 실패'
              : l.action === 'REGISTER' ? '회원가입'
              : l.action === 'ROUND_CLEAR' ? `라운드 클리어 (${l.details && l.details.round ? l.details.round + 'R' : ''})`
              : '활동 완료';
            return `
              <div class="log-item-row" style="padding: 7px 6px; border-bottom: 1px solid #eee;">
                <div>
                  <strong style="color: var(--text-dark);">${l.username}</strong>
                  <span class="log-badge ${badgeClass}" style="margin-left: 6px;">${actionText}</span>
                  <div style="font-size: 0.68rem; color: #888; margin-top: 2px;">IP: ${l.ip} | ${l.userAgent || '-'}</div>
                </div>
                <div class="log-time" style="white-space: nowrap; text-align: right;">
                  ${l.kstTime || (l.timestamp ? l.timestamp.substring(0, 19).replace('T', ' ') : '')}
                </div>
              </div>
            `;
          }).join('');
          return;
        }
      }
      container.innerHTML = '<div style="text-align: center; color: #ef4444; padding: 20px;">감사 로그 조회 권한이 없거나 오류가 발생했습니다.</div>';
    } catch (e) {
      container.innerHTML = '<div style="text-align: center; color: #ef4444; padding: 20px;">서버와 통신할 수 없습니다.</div>';
    }
  }

  closeProfileModal() {
    this.modalProfile.classList.remove('active');
  }

  saveProfileForm() {
    const newName = document.getElementById('inputNickname').value.trim();
    const newGrade = document.getElementById('selectGrade').value;
    const selectedAvatarEl = document.querySelector('.avatar-opt.selected');
    const newAvatar = selectedAvatarEl ? selectedAvatarEl.dataset.avatar : '🌸';

    if (!newName) {
      alert('닉네임을 입력해 주세요!');
      return;
    }

    this.data.currentUser.name = newName;
    this.data.currentUser.grade = newGrade;
    this.data.currentUser.avatar = newAvatar;

    // Update in allUsers list
    const me = this.data.allUsers.find(u => u.isMe);
    if (me) {
      me.name = newName;
      me.grade = newGrade;
      me.avatar = newAvatar;
    }

    DataManager.save(this.data);
    this.syncToCloud();
    this.renderUserProfile();
    this.renderLeaderboard('daily');
    this.closeProfileModal();
    sfx.combo();
  }

  openApiModal() {
    document.getElementById('inputApiKey').value = this.data.apiKey || '';
    this.modalApi.classList.add('active');
  }

  closeApiModal() {
    this.modalApi.classList.remove('active');
  }

  openDictModal() {
    this.modalDictSearch.classList.add('active');
    document.getElementById('inputDictSearch').focus();
    if (!document.getElementById('dictSearchResults').innerHTML.trim()) {
      this.renderInitialDictExamples();
    }
  }

  closeDictModal() {
    this.modalDictSearch.classList.remove('active');
  }

  renderInitialDictExamples() {
    const container = document.getElementById('dictSearchResults');
    container.innerHTML = `
      <div style="font-size: 0.8rem; color: var(--text-sub); margin-bottom: 8px;">추천 검색어:</div>
      <div style="display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 12px;">
        ${['왠지', '며칠', '금세', '희한하다', '봬요', '어이없다', '등굣길', '설렘'].map(w => 
          `<button class="rank-filter-btn" style="padding: 4px 10px; font-size: 0.78rem; background: #fff; border: 1px solid var(--primary-soft-pink);" onclick="window.app.quickDictSearch('${w}')">${w}</button>`
        ).join('')}
      </div>
    `;
  }

  quickDictSearch(word) {
    document.getElementById('inputDictSearch').value = word;
    this.executeDictSearch();
  }

  executeDictSearch() {
    const rawQuery = document.getElementById('inputDictSearch').value.trim();
    if (!rawQuery) {
      alert('검색할 단어를 입력해 주세요!');
      return;
    }

    const container = document.getElementById('dictSearchResults');
    container.innerHTML = `<div style="text-align: center; padding: 16px; color: var(--text-sub);">국립국어원 표준국어대사전 조회 중... 🌸</div>`;

    this.trackDictionarySearch();

    // Check our enriched question bank first for instant result
    const matched = SPELLING_QUESTION_BANK.find(q => 
      (q.standardWord && q.standardWord.includes(rawQuery)) || 
      (q.sentence && q.sentence.includes(rawQuery)) ||
      q.options.some(opt => opt.includes(rawQuery))
    );

    setTimeout(() => {
      const cleanWord = rawQuery;
      const dictUrl = `https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=${encodeURIComponent(cleanWord)}`;

      if (matched && matched.dictDefinition) {
        container.innerHTML = `
          <div class="dict-def-card" style="margin-top: 4px;">
            <div class="dict-def-header">
              <span class="dict-title-tag">표준국어대사전 공식 표제어</span>
              <strong style="font-size: 1rem; color: var(--accent-coral);">${matched.standardWord || cleanWord}</strong>
              <span class="dict-pos-tag">${matched.pos || '표준어'}</span>
            </div>
            <p class="dict-def-body">${matched.dictDefinition}</p>
            <div style="font-size: 0.78rem; color: var(--text-sub); margin-bottom: 6px;">
              💡 <strong>규정</strong>: ${matched.rule}
            </div>
            <div style="text-align: right;">
              <a class="dict-link-btn" href="${matched.dictLink || dictUrl}" target="_blank" rel="noopener noreferrer">
                국립국어원 공식 사전 상세 보기 ↗
              </a>
            </div>
          </div>
        `;
      } else {
        container.innerHTML = `
          <div class="dict-def-card" style="margin-top: 4px;">
            <div class="dict-def-header">
              <span class="dict-title-tag">국립국어원 검색 결과</span>
              <strong style="font-size: 1rem; color: var(--accent-coral);">${cleanWord}</strong>
            </div>
            <p class="dict-def-body">
              ‘${cleanWord}’에 대한 국립국어원 표준국어대사전 공식 웹 검색 결과입니다.
            </p>
            <div style="text-align: right; margin-top: 8px;">
              <a class="dict-link-btn" href="${dictUrl}" target="_blank" rel="noopener noreferrer" style="font-size: 0.85rem;">
                🏛️ 국립국어원 표준국어대사전 웹에서 '${cleanWord}' 전체 뜻 보기 ↗
              </a>
            </div>
          </div>
        `;
      }
    }, 200);
  }

  saveApiSettings() {
    const key = document.getElementById('inputApiKey').value.trim();
    this.data.apiKey = key;
    DataManager.save(this.data);
    this.closeApiModal();
    alert('국립국어원 표준국어대사전 API 설정이 저장되었습니다! 🌸');
  }

  // ============================================================
  // Cloud Auth & Multi-Device Synchronization
  // ============================================================
  async checkCloudAuth() {
    if (!this.cloudToken) {
      this.updateCloudStatus(false);
      return;
    }

    try {
      const res = await fetch('/api/user/profile', {
        headers: { 'Authorization': `Bearer ${this.cloudToken}` }
      });
      if (res.ok) {
        const body = await res.json();
        if (body.success && body.user) {
          const u = body.user;
          // Apply cloud user to local data
          this.data.currentUser.name = u.name || u.username;
          this.data.currentUser.grade = u.grade || this.data.currentUser.grade;
          this.data.currentUser.avatar = u.avatar || this.data.currentUser.avatar;
          this.data.currentUser.streak = Math.max(this.data.currentUser.streak || 1, u.streak || 1);
          this.data.currentUser.totalPoints = Math.max(this.data.currentUser.totalPoints || 0, u.totalPoints || 0);
          this.data.currentUser.completedDates = Array.from(new Set([...(this.data.currentUser.completedDates || []), ...(u.completedDates || [])]));
          this.data.currentUser.badges = Array.from(new Set([...(this.data.currentUser.badges || []), ...(u.badges || [])]));
          this.data.wrongQuestions = u.wrongQuestions || this.data.wrongQuestions || [];

          DataManager.save(this.data);
          localStorage.setItem('haru_auth_username', u.name || u.username);
          this.renderUserProfile();
          this.renderCalendarWeek();
          this.renderLeaderboard('daily');
          this.updateCloudStatus(true, u.name || u.username);
        }
      } else if (res.status === 401) {
        // STRICT: Only clear token if server explicitly confirms token is invalid/deleted
        console.warn('[Haru Matchum] Token rejected with 401 Unauthorized. Clearing session.');
        this.cloudToken = '';
        localStorage.removeItem('haru_cloud_token');
        localStorage.removeItem('haru_auth_username');
        this.updateCloudStatus(false);
      } else {
        // Temporary server error (500, 502, 503) -> Retain cached session and token!
        console.warn(`[Haru Matchum] Server returned status ${res.status}. Retaining cached login session.`);
        const cachedUser = localStorage.getItem('haru_auth_username') || (this.data.currentUser ? this.data.currentUser.name : null);
        this.updateCloudStatus(true, cachedUser);
      }
    } catch (e) {
      // Network offline or phone wake-up delay -> DO NOT clear token, keep local session
      console.warn('[Haru Matchum] Network offline during wake-up. Retaining cached login session:', e);
      const cachedUser = localStorage.getItem('haru_auth_username') || (this.data.currentUser ? this.data.currentUser.name : null);
      if (this.cloudToken && cachedUser && cachedUser !== '맞춤요정') {
        this.updateCloudStatus(true, cachedUser);
      } else {
        this.updateCloudStatus(false, null, '오프라인');
      }
    }
  }

  updateCloudStatus(isLoggedIn, username, customText) {
    const badge = document.getElementById('cloudSyncBadge');
    if (!badge) return;
    if (isLoggedIn) {
      badge.textContent = `☁️ ${username}`;
      badge.style.color = '#2ec4b6';
      badge.style.background = '#e6f9f5';
    } else {
      badge.textContent = customText || '게스트';
      badge.style.color = '#7d6e83';
      badge.style.background = '#f2edf5';
    }
  }

  async syncToCloud(action = null, details = {}) {
    if (!this.cloudToken) return;
    try {
      await fetch('/api/user/sync', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.cloudToken}`
        },
        body: JSON.stringify({
          token: this.cloudToken,
          userData: this.data.currentUser,
          action: action,
          details: details
        })
      });
    } catch (e) {
      // Ignore background sync errors
    }
  }

  openAuthModal() {
    if (this.cloudToken) {
      document.getElementById('authLoggedInView').style.display = 'block';
      document.getElementById('loggedInUserName').textContent = this.data.currentUser.name;
      document.getElementById('authUsername').parentElement.style.display = 'none';
      document.getElementById('authPassword').parentElement.style.display = 'none';
      document.getElementById('authRegFields').style.display = 'none';
      document.getElementById('btnSubmitAuth').style.display = 'none';
    } else {
      document.getElementById('authLoggedInView').style.display = 'none';
      document.getElementById('authUsername').parentElement.style.display = 'block';
      document.getElementById('authPassword').parentElement.style.display = 'block';
      document.getElementById('btnSubmitAuth').style.display = 'flex';
      this.setAuthMode('login');
    }
    this.modalAuth.classList.add('active');
  }

  closeAuthModal() {
    this.modalAuth.classList.remove('active');
  }

  setAuthMode(mode) {
    this.authMode = mode;
    const tabLogin = document.getElementById('tabAuthLogin');
    const tabReg = document.getElementById('tabAuthRegister');
    const regFields = document.getElementById('authRegFields');
    const submitBtn = document.getElementById('btnSubmitAuth');
    const title = document.getElementById('authModalTitle');

    if (mode === 'login') {
      tabLogin.classList.add('active');
      tabReg.classList.remove('active');
      regFields.style.display = 'none';
      submitBtn.textContent = '로그인하기 💕';
      title.textContent = '🔑 간단 로그인 & 기기 연동';
    } else {
      tabLogin.classList.remove('active');
      tabReg.classList.add('active');
      regFields.style.display = 'block';
      submitBtn.textContent = '1초 가입하고 시작하기 ✨';
      title.textContent = '🌸 1초 간편 회원가입';
    }
  }

  async submitAuth() {
    const username = document.getElementById('authUsername').value.trim();
    const password = document.getElementById('authPassword').value;
    const grade = document.getElementById('authGrade').value;

    if (!username || !password) {
      alert('아이디와 비밀번호를 입력해 주세요!');
      return;
    }

    const endpoint = this.authMode === 'login' ? '/api/auth/login' : '/api/auth/register';
    const payload = {
      username,
      password,
      grade,
      avatar: this.data.currentUser.avatar || '🌸'
    };

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();

      if (!res.ok || !data.success) {
        alert(data.message || '로그인/가입 처리에 실패했습니다.');
        return;
      }

      this.cloudToken = data.token;
      localStorage.setItem('haru_cloud_token', data.token);

      const u = data.user;
      localStorage.setItem('haru_auth_username', u.name || u.username);
      this.data.currentUser.name = u.name || u.username;
      this.data.currentUser.grade = u.grade || this.data.currentUser.grade;
      this.data.currentUser.avatar = u.avatar || this.data.currentUser.avatar;
      this.data.currentUser.streak = u.streak || this.data.currentUser.streak;
      this.data.currentUser.totalPoints = u.totalPoints || this.data.currentUser.totalPoints;
      this.data.currentUser.completedDates = u.completedDates || this.data.currentUser.completedDates;
      this.data.currentUser.badges = u.badges || this.data.currentUser.badges;

      DataManager.save(this.data);
      this.renderUserProfile();
      this.renderCalendarWeek();
      this.renderLeaderboard('daily');
      this.updateCloudStatus(true, u.name || u.username);
      this.closeAuthModal();
      sfx.combo();

      alert(`환영합니다, ${u.name || u.username}님! 🎉\n이제 PC, 스마트폰, 태블릿 어디서든 이 계정으로 접속하시면 내 기록이 유지됩니다.`);
    } catch (e) {
      alert('서버에 연결할 수 없습니다. 시놀로지 서버 상태를 확인해 주세요.');
    }
  }

  logout() {
    this.cloudToken = '';
    localStorage.removeItem('haru_cloud_token');
    localStorage.removeItem('haru_auth_username');
    this.updateCloudStatus(false);
    this.closeAuthModal();
    alert('로그아웃되었습니다. 로컬 게스트 모드로 전환됩니다.');
  }

  async syncGitRepo() {
    const btn = document.getElementById('btnGitSync');
    btn.disabled = true;
    btn.textContent = '⏳';

    try {
      const res = await fetch('/api/git/sync', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        sfx.combo();
        alert('시놀로지와 깃허브 간 자동 양방향 동기화가 성공적으로 완료되었습니다! ☁️✨');
      } else {
        alert('동기화 결과: ' + (data.message || '완료'));
      }
    } catch (e) {
      alert('GitHub 동기화 요청을 전송했습니다. (정적 모드에서는 깃허브 액션/서버 환경이 필요합니다)');
    } finally {
      btn.disabled = false;
      btn.textContent = '☁️';
    }
  }

  async forcePageReload() {
    const btnReload = document.getElementById('btnReloadPage');
    const btnQuick = document.getElementById('btnQuickReload');
    if (btnReload) btnReload.classList.add('spinning');
    if (btnQuick) btnQuick.classList.add('spinning');

    if (window.sfx && typeof window.sfx.combo === 'function') {
      try { window.sfx.combo(); } catch (e) {}
    }

    this.showToastNotice('🔄 최신 버전을 불러오는 중입니다... 잠시만 기다려주세요!');

    // Purge browser CacheStorage if supported
    if ('caches' in window) {
      try {
        const cacheNames = await window.caches.keys();
        await Promise.all(cacheNames.map(name => window.caches.delete(name)));
      } catch (err) {
        console.warn('Cache purge failed:', err);
      }
    }

    setTimeout(() => {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('_t', Date.now());
        window.location.replace(url.toString());
      } catch (e) {
        window.location.reload();
      }
    }, 450);
  }
}

// Start app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new HaruMatchumApp();
});

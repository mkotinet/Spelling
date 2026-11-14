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
// 3. User & Storage Manager
// ============================================================
const STORAGE_KEY = 'haru_matchum_data_v1';

class DataManager {
  static defaultData() {
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
        lastActiveDate: new Date().toISOString().split('T')[0],
        completedDates: [new Date().toISOString().split('T')[0]]
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
    this.quizSubject = 'spelling'; // 'spelling' | 'hanja'
    this.currentMode = 'daily'; // 'daily' | 'practice' | 'review'
    this.currentRound = 1;
    this.roundCorrectCount = 0;
    this.activeQuestions = [];
    this.currentIndex = 0;
    this.currentScore = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.selectedOption = null;

    this.cloudToken = localStorage.getItem('haru_cloud_token') || '';
    this.authMode = 'login'; // 'login' | 'register'

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

    // Mascot
    this.mascotBubble = document.getElementById('mascotSpeech');
    this.mascotAvatar = document.getElementById('mascotAvatar');
  }

  bindEvents() {
    // Nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const view = e.currentTarget.dataset.view;
        this.switchView(view);
      });
    });

    // Subject Mode Switch Buttons (Spelling vs Hanja)
    const btnSpelling = document.getElementById('btnModeSpelling');
    const btnHanja = document.getElementById('btnModeHanja');
    if (btnSpelling) btnSpelling.addEventListener('click', () => this.setQuizSubject('spelling'));
    if (btnHanja) btnHanja.addEventListener('click', () => this.setQuizSubject('hanja'));

    // Start Mode Buttons
    document.getElementById('btnStartDaily').addEventListener('click', () => this.startQuiz('daily'));
    document.getElementById('btnStartPractice').addEventListener('click', () => this.startQuiz('practice'));
    document.getElementById('btnStartReview').addEventListener('click', () => this.startQuiz('review'));

    // Quiz action button
    document.getElementById('btnQuizNext').addEventListener('click', () => this.handleNextQuestion());

    // Result buttons
    document.getElementById('btnResultHome').addEventListener('click', () => this.switchView('home'));
    document.getElementById('btnResultRetry').addEventListener('click', () => this.startQuiz(this.currentMode));
    const btnNextRound = document.getElementById('btnNextRound');
    if (btnNextRound) {
      btnNextRound.addEventListener('click', () => this.startNextRound());
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
        this.renderLeaderboard(e.currentTarget.dataset.type);
      });
    });
  }

  switchView(viewName) {
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
    const dailyCardTitle = document.querySelector('#btnStartDaily h3');
    const dailyCardDesc = document.querySelector('#btnStartDaily p');
    const dailyBadge = document.querySelector('#btnStartDaily .mode-badge');

    if (subject === 'hanja') {
      document.body.classList.add('theme-hanja');
      if (btnHanja) btnHanja.classList.add('active');
      if (btnSpelling) btnSpelling.classList.remove('active');
      if (dailyCardTitle) dailyCardTitle.textContent = '오늘의 한자·고사성어 5제';
      if (dailyCardDesc) dailyCardDesc.textContent = '매일 갱신되는 한자 5문제 풀고 실생활 어휘력 UP!';
      if (dailyBadge) dailyBadge.textContent = '오늘의 한자 챌린지 📜';
      this.updateMascotMood('happy', `안녕, <strong>${this.data.currentUser.name}</strong>야! 오늘은 지혜가 담긴 한자·고사성어 퀴즈에 도전해볼까? 📜✨`);
    } else {
      document.body.classList.remove('theme-hanja');
      if (btnSpelling) btnSpelling.classList.add('active');
      if (btnHanja) btnHanja.classList.remove('active');
      if (dailyCardTitle) dailyCardTitle.textContent = '오늘의 맞춤법 5제';
      if (dailyCardDesc) dailyCardDesc.textContent = '매일 갱신되는 5문제 풀고 출석 도장 & 랭킹 포인트 적립!';
      if (dailyBadge) dailyBadge.textContent = '오늘의 데일리 챌린지 🌸';
      this.updateMascotMood('happy', `안녕, <strong>${this.data.currentUser.name}</strong>야! 오늘도 반짝이는 맞춤법 퀴즈 도전해볼까? ✨`);
    }
  }

  getActiveBank() {
    if (this.quizSubject === 'hanja' && typeof HANJA_QUESTION_BANK !== 'undefined') {
      return HANJA_QUESTION_BANK;
    }
    return SPELLING_QUESTION_BANK;
  }

  renderUserProfile() {
    const u = this.data.currentUser;
    document.getElementById('userAvatar').textContent = u.avatar;
    document.getElementById('userName').textContent = u.name;
    document.getElementById('userGrade').textContent = u.grade;
    document.getElementById('userStreak').textContent = u.streak + '일';
    document.getElementById('userPoints').textContent = u.totalPoints + 'P';
    document.getElementById('streakBadge').textContent = `🔥 ${u.streak}일 연속`;
  }

  renderCalendarWeek() {
    const calendarContainer = document.getElementById('calendarWeek');
    calendarContainer.innerHTML = '';

    const days = ['일', '월', '화', '수', '목', '금', '토'];
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 is Sun

    // Render 7 days of this current week (Sun - Sat)
    for (let i = 0; i < 7; i++) {
      const dayDate = new Date(today);
      dayDate.setDate(today.getDate() - currentDayOfWeek + i);
      const dateStr = dayDate.toISOString().split('T')[0];
      const isToday = i === currentDayOfWeek;
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

    this.switchView('quiz');
    this.renderCurrentQuestion();
  }

  getDailyQuestions(round = 1) {
    const todayStr = new Date().toISOString().split('T')[0];
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

    // Sentence
    document.getElementById('quizPrompt').textContent = `Q${this.currentIndex + 1}. ${q.question}`;
    document.getElementById('quizSentence').innerHTML = q.sentence.replace(
      /\[(.*?)\]/,
      `<span class="highlight">[ $1 ]</span>`
    );

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

    // Reset Explanation & Next Button
    const expCard = document.getElementById('quizExplanation');
    expCard.classList.remove('active');
    const nextBtn = document.getElementById('btnQuizNext');
    nextBtn.disabled = true;
    nextBtn.textContent = (this.currentIndex === total - 1) ? '결과 확인하기 🎉' : '다음 문제로 ✨';
  }

  handleOptionSelect(selectedIndex, clickedBtn) {
    if (this.selectedOption !== null) return; // already answered
    this.selectedOption = selectedIndex;

    const q = this.activeQuestions[this.currentIndex];
    const isCorrect = selectedIndex === q.answerIndex;

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
      const comboBonus = (this.combo - 1) * 5;
      this.currentScore += (20 + comboBonus);

      if (this.combo > 2) {
        sfx.combo();
      } else {
        sfx.correct();
      }

      // Remove from wrong questions if it was there
      this.data.wrongQuestions = (this.data.wrongQuestions || []).filter(item => item.id !== q.id);
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

    const targetWord = q.standardWord || q.hanjaWord || q.options[q.answerIndex];
    document.getElementById('dictWord').textContent = targetWord;
    document.getElementById('dictPos').textContent = q.pos || (q.hanjaWord ? '한자어' : '표준어');
    document.getElementById('dictDefText').textContent = q.dictDefinition || q.explanation;

    // National Institute of Korean Language Dictionary link
    const dictLink = document.getElementById('expDictLink');
    dictLink.href = q.dictLink || `https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=${encodeURIComponent(targetWord)}`;
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

    document.getElementById('btnQuizNext').disabled = false;
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

    const totalQuestions = this.activeQuestions.length;
    const isRoundCleared = this.roundCorrectCount === 5; // 5/5 perfect score
    const u = this.data.currentUser;

    u.totalSolved += totalQuestions;
    u.totalCorrect += this.roundCorrectCount;

    let pointsEarned = this.currentScore;
    if (this.currentRound > 1 && isRoundCleared) {
      pointsEarned += 50; // Bonus +50P for round clear
    }
    u.totalPoints += pointsEarned;

    const todayStr = new Date().toISOString().split('T')[0];
    if (!u.completedDates.includes(todayStr)) {
      u.completedDates.push(todayStr);
      u.streak = (u.streak || 0) + 1;
      u.lastActiveDate = todayStr;
    }

    if (this.currentRound === 1) {
      u.todayScore = Math.max(u.todayScore || 0, this.currentScore);
    }
    if (isRoundCleared) {
      u.maxRoundToday = Math.max(u.maxRoundToday || 1, this.currentRound);
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
    }

    DataManager.save(this.data);

    this.syncToCloud(isRoundCleared ? 'ROUND_CLEAR' : 'QUIZ_FINISH', {
      mode: this.quizSubject,
      round: this.currentRound,
      score: this.currentScore,
      pointsEarned
    });

    this.renderUserProfile();
    this.renderCalendarWeek();

    // Render Result Screen
    document.getElementById('resultScore').textContent = `${this.currentScore}점`;
    document.getElementById('resultCombo').textContent = `${this.maxCombo}회`;
    document.getElementById('resultPoints').textContent = `+${pointsEarned}P`;

    const btnNextRound = document.getElementById('btnNextRound');
    if (isRoundCleared && this.currentMode === 'daily') {
      document.getElementById('resultTitle').textContent = `🎉 라운드 ${this.currentRound} 만점 통과!`;
      document.getElementById('resultSubtitle').textContent = `5문제를 모두 맞히셨어요! 다음 라운드에 도전해 실력을 뽐내보세요! 🔥`;
      document.getElementById('resultMascot').textContent = '🥳';
      if (btnNextRound) {
        btnNextRound.style.display = 'block';
        btnNextRound.textContent = `🎉 100점 만점 통과! 라운드 ${this.currentRound + 1} (새 5문제) 도전하기 🔥`;
      }
    } else {
      document.getElementById('resultTitle').textContent = '오늘의 퀴즈 완료! 💕';
      document.getElementById('resultSubtitle').textContent = '꾸준히 풀다 보면 우리말과 한자 실력이 쑥쑥 자라나요!';
      document.getElementById('resultMascot').textContent = '🌸';
      if (btnNextRound) {
        btnNextRound.style.display = 'none';
      }
    }

    this.switchView('result');
  }

  startNextRound() {
    this.startQuiz('daily', this.currentRound + 1);
  }

  // ============================================================
  // Leaderboard / Ranking View (Real users only, no dummy peers)
  // ============================================================
  async renderLeaderboard(type = 'daily') {
    const listContainer = document.getElementById('leaderboardList');
    if (!listContainer) return;

    try {
      const res = await fetch('/api/leaderboard');
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
    if (type === 'daily') {
      users.sort((a, b) => (b.todayScore || 0) - (a.todayScore || 0));
    } else {
      users.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
    }

    users.forEach((user, idx) => {
      const rankNum = idx + 1;
      const rankClass = rankNum === 1 ? 'rank-1' : rankNum === 2 ? 'rank-2' : rankNum === 3 ? 'rank-3' : 'rank-other';
      const rankBadgeIcon = rankNum === 1 ? '👑' : rankNum === 2 ? '🥈' : rankNum === 3 ? '🥉' : rankNum;
      const roundTag = user.maxRoundToday && user.maxRoundToday > 1 
        ? `<span class="rank-tag-round" style="background:#ffedd5; color:#ea580c; font-size:0.7rem; font-weight:700; padding:1px 6px; border-radius:10px; margin-left:4px;">🔥 ${user.maxRoundToday}R</span>`
        : '';

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
          ${type === 'daily' ? (user.todayScore || 0) : user.totalPoints}
          <span>${type === 'daily' ? '점' : 'P'}</span>
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
          this.renderUserProfile();
          this.renderCalendarWeek();
          this.renderLeaderboard('daily');
          this.updateCloudStatus(true, u.name || u.username);
        }
      } else {
        // Token expired or invalid
        this.cloudToken = '';
        localStorage.removeItem('haru_cloud_token');
        this.updateCloudStatus(false);
      }
    } catch (e) {
      // Backend not reached (e.g. running on GitHub Pages static)
      this.updateCloudStatus(false, null, '로컬');
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
}

// Start app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new HaruMatchumApp();
});

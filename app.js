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
      allUsers: [] // multi-profile & simulated peer ranking
    };
  }

  static load() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const init = this.defaultData();
        init.allUsers = this.generatePeerRankings(init.currentUser);
        this.save(init);
        return init;
      }
      const parsed = JSON.parse(raw);
      if (!parsed.apiKey) {
        parsed.apiKey = 'C0E0448602CD3B859FDDD29BBD84289C';
      }
      if (!parsed.allUsers || parsed.allUsers.length === 0) {
        parsed.allUsers = this.generatePeerRankings(parsed.currentUser);
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

  static generatePeerRankings(myUser) {
    const peers = [
      { id: 'peer_1', name: '체리블라썸', avatar: '🍒', grade: '중학교 3학년', totalPoints: 520, streak: 7, todayScore: 100 },
      { id: 'peer_2', name: '토끼마카롱', avatar: '🐰', grade: '중학교 2학년', totalPoints: 460, streak: 5, todayScore: 100 },
      { id: 'peer_3', name: '달빛고양이', avatar: '🐱', grade: '고등학교 1학년', totalPoints: 410, streak: 4, todayScore: 80 },
      { id: 'peer_4', name: '민트라벤더', avatar: '🌿', grade: '중학교 1학년', totalPoints: 370, streak: 3, todayScore: 80 },
      { id: 'peer_5', name: '딸기구름', avatar: '🍓', grade: '초등학교 6학년', totalPoints: 310, streak: 2, todayScore: 60 },
      { id: 'peer_6', name: '별빛소녀', avatar: '⭐', grade: '초등학교 5학년', totalPoints: 240, streak: 2, todayScore: 60 },
      { id: 'peer_7', name: '포근곰돌이', avatar: '🐻', grade: '중학교 2학년', totalPoints: 190, streak: 1, todayScore: 40 }
    ];

    return [
      {
        id: myUser.id,
        name: myUser.name,
        avatar: myUser.avatar,
        grade: myUser.grade,
        totalPoints: myUser.totalPoints,
        streak: myUser.streak,
        todayScore: 100,
        isMe: true
      },
      ...peers
    ];
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
    this.currentMode = 'daily'; // 'daily' | 'practice' | 'review'
    this.activeQuestions = [];
    this.currentIndex = 0;
    this.currentScore = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.selectedOption = null;

    this.initDOM();
    this.bindEvents();
    this.renderUserProfile();
    this.renderCalendarWeek();
    this.renderLeaderboard('daily');
    this.renderBadges();
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

    // Start Mode Buttons
    document.getElementById('btnStartDaily').addEventListener('click', () => this.startQuiz('daily'));
    document.getElementById('btnStartPractice').addEventListener('click', () => this.startQuiz('practice'));
    document.getElementById('btnStartReview').addEventListener('click', () => this.startQuiz('review'));

    // Quiz action button
    document.getElementById('btnQuizNext').addEventListener('click', () => this.handleNextQuestion());

    // Result buttons
    document.getElementById('btnResultHome').addEventListener('click', () => this.switchView('home'));
    document.getElementById('btnResultRetry').addEventListener('click', () => this.startQuiz(this.currentMode));

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

    // API settings modal
    document.getElementById('btnOpenApiSettings').addEventListener('click', () => this.openApiModal());
    document.getElementById('btnCloseApiModal').addEventListener('click', () => this.closeApiModal());
    document.getElementById('btnSaveApiSettings').addEventListener('click', () => this.saveApiSettings());

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
  // Quiz Flow
  // ============================================================
  startQuiz(mode) {
    this.currentMode = mode;
    this.currentIndex = 0;
    this.currentScore = 0;
    this.combo = 0;
    this.maxCombo = 0;
    this.selectedOption = null;

    if (mode === 'daily') {
      this.activeQuestions = this.getDailyQuestions();
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

  getDailyQuestions() {
    // Generate deterministic 5 questions using date hash
    const todayStr = new Date().toISOString().split('T')[0];
    let hash = 0;
    for (let i = 0; i < todayStr.length; i++) {
      hash = (hash << 5) - hash + todayStr.charCodeAt(i);
      hash |= 0;
    }
    const seed = Math.abs(hash);

    const questionsCopy = [...SPELLING_QUESTION_BANK];
    const dailySet = [];
    for (let i = 0; i < 5; i++) {
      const idx = (seed + i * 7) % questionsCopy.length;
      dailySet.push(questionsCopy[idx]);
    }
    return dailySet;
  }

  getRandomQuestions(count) {
    const shuffled = [...SPELLING_QUESTION_BANK].sort(() => 0.5 - Math.random());
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

    // Audio & Score
    if (isCorrect) {
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

    // Show Explanation & National Institute Dictionary Definition
    const expCard = document.getElementById('quizExplanation');
    expCard.classList.add('active');
    document.getElementById('expText').textContent = q.explanation;
    document.getElementById('expRule').textContent = `규정: ${q.rule}`;

    const targetWord = q.standardWord || q.options[q.answerIndex];
    document.getElementById('dictWord').textContent = targetWord;
    document.getElementById('dictPos').textContent = q.pos || '표준어';
    document.getElementById('dictDefText').textContent = q.dictDefinition || q.explanation;

    // National Institute of Korean Language Dictionary search link
    const dictLink = document.getElementById('expDictLink');
    dictLink.href = q.dictLink || `https://stdict.korean.go.kr/search/searchResult.do?searchKeyword=${encodeURIComponent(targetWord)}`;
    dictLink.onclick = () => {
      this.trackDictionarySearch();
    };

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
    const isPerfect = this.currentScore >= 100;

    // Update user stats
    const u = this.data.currentUser;
    u.totalSolved += totalQuestions;
    u.totalPoints += this.currentScore;
    u.totalCorrect += Math.round(this.currentScore / 20);

    const todayStr = new Date().toISOString().split('T')[0];
    if (!u.completedDates.includes(todayStr)) {
      u.completedDates.push(todayStr);
      u.streak = (u.streak || 0) + 1;
      u.lastActiveDate = todayStr;
    }

    // Check badges
    if (isPerfect && !this.data.badges.includes('perfect_100')) {
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

    // Update peer ranking with new score
    const me = this.data.allUsers.find(p => p.id === u.id);
    if (me) {
      me.totalPoints = u.totalPoints;
      me.streak = u.streak;
      me.todayScore = this.currentScore;
    }

    DataManager.save(this.data);
    this.renderUserProfile();
    this.renderCalendarWeek();

    // Render Result Screen
    document.getElementById('resultScore').textContent = `${this.currentScore}점`;
    document.getElementById('resultCombo').textContent = `${this.maxCombo}회`;
    document.getElementById('resultPoints').textContent = `+${this.currentScore}P`;

    if (isPerfect) {
      document.getElementById('resultTitle').textContent = '완벽한 100점 만점! 🌟';
      document.getElementById('resultSubtitle').textContent = '국어 맞춤법 천재 아니야?! 너무 완벽해요!';
      document.getElementById('resultMascot').textContent = '🥳';
    } else {
      document.getElementById('resultTitle').textContent = '오늘의 퀴즈 완료! 💕';
      document.getElementById('resultSubtitle').textContent = '꾸준히 풀다 보면 맞춤법 실력이 쑥쑥 자라나요!';
      document.getElementById('resultMascot').textContent = '🌸';
    }

    this.switchView('result');
  }

  // ============================================================
  // Leaderboard / Ranking View
  // ============================================================
  renderLeaderboard(type = 'daily') {
    const listContainer = document.getElementById('leaderboardList');
    listContainer.innerHTML = '';

    const users = [...this.data.allUsers];
    if (type === 'daily') {
      users.sort((a, b) => (b.todayScore || 0) - (a.todayScore || 0));
    } else {
      users.sort((a, b) => (b.totalPoints || 0) - (a.totalPoints || 0));
    }

    users.forEach((user, idx) => {
      const rankNum = idx + 1;
      const rankClass = rankNum === 1 ? 'rank-1' : rankNum === 2 ? 'rank-2' : rankNum === 3 ? 'rank-3' : 'rank-other';
      const rankBadgeIcon = rankNum === 1 ? '👑' : rankNum === 2 ? '🥈' : rankNum === 3 ? '🥉' : rankNum;

      const item = document.createElement('div');
      item.className = `rank-item ${rankClass} ${user.isMe ? 'is-me' : ''}`;
      item.innerHTML = `
        <div class="rank-badge">${rankBadgeIcon}</div>
        <div class="rank-avatar">${user.avatar}</div>
        <div class="rank-info">
          <div class="rank-name-row">
            <span class="rank-name">${user.name}</span>
            ${user.isMe ? '<span class="rank-tag-me">나</span>' : ''}
          </div>
          <div class="rank-sub">${user.grade} · 🔥 ${user.streak || 1}일 연속</div>
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

    this.modalProfile.classList.add('active');
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
}

// Start app on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.app = new HaruMatchumApp();
});

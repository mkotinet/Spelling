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
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
  }

  unlockAudio() {
    this.init();
    if (this.ctx) {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      try {
        const buffer = this.ctx.createBuffer(1, 1, 22050);
        const source = this.ctx.createBufferSource();
        source.buffer = buffer;
        source.connect(this.ctx.destination);
        source.start(0);
      } catch (e) {}
    }
  }

  playTone(freq, type, duration, delay = 0, gainVal = 0.35) {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      const now = this.ctx.currentTime;
      const startTime = now + delay;
      const stopTime = startTime + duration;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, startTime);

      gain.gain.setValueAtTime(0.0001, startTime);
      gain.gain.linearRampToValueAtTime(gainVal, startTime + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, stopTime);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(startTime);
      osc.stop(stopTime);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  correct() {
    if (!this.enabled) return;
    // Bright joyful major ascending arpeggio (D5 -> F#5 -> A5 -> D6)
    this.playTone(587.33, 'triangle', 0.12, 0, 0.35);
    this.playTone(739.99, 'triangle', 0.12, 0.08, 0.38);
    this.playTone(880.00, 'triangle', 0.14, 0.16, 0.40);
    this.playTone(1174.66, 'sine', 0.28, 0.24, 0.45);
  }

  wrong() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    try {
      if (this.ctx.state === 'suspended') {
        this.ctx.resume().catch(() => {});
      }
      const now = this.ctx.currentTime;

      // Pulse 1: descending sawtooth pitch bend (320Hz -> 200Hz)
      const osc1 = this.ctx.createOscillator();
      const gain1 = this.ctx.createGain();
      osc1.type = 'sawtooth';
      osc1.frequency.setValueAtTime(320, now);
      osc1.frequency.linearRampToValueAtTime(200, now + 0.16);

      gain1.gain.setValueAtTime(0.0001, now);
      gain1.gain.linearRampToValueAtTime(0.35, now + 0.015);
      gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.16);

      osc1.connect(gain1);
      gain1.connect(this.ctx.destination);
      osc1.start(now);
      osc1.stop(now + 0.16);

      // Pulse 2: lower descending pitch bend (240Hz -> 140Hz)
      const osc2 = this.ctx.createOscillator();
      const gain2 = this.ctx.createGain();
      osc2.type = 'sawtooth';
      osc2.frequency.setValueAtTime(240, now + 0.14);
      osc2.frequency.linearRampToValueAtTime(140, now + 0.35);

      gain2.gain.setValueAtTime(0.0001, now + 0.14);
      gain2.gain.linearRampToValueAtTime(0.35, now + 0.155);
      gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc2.connect(gain2);
      gain2.connect(this.ctx.destination);
      osc2.start(now + 0.14);
      osc2.stop(now + 0.35);
    } catch (e) {
      console.warn('Audio wrong sound error:', e);
    }
  }

  combo() {
    if (!this.enabled) return;
    // High sparkle chime
    this.playTone(880, 'sine', 0.12, 0, 0.35);
    this.playTone(1174.66, 'sine', 0.14, 0.08, 0.40);
    this.playTone(1396.91, 'sine', 0.16, 0.16, 0.42);
    this.playTone(1760.00, 'sine', 0.28, 0.24, 0.45);
  }

  fanfare() {
    if (!this.enabled) return;
    // Victory fanfare
    const notes = [523.25, 659.25, 783.99, 1046.50, 880, 1046.50];
    const delays = [0, 0.10, 0.20, 0.30, 0.42, 0.56];
    notes.forEach((n, i) => this.playTone(n, 'triangle', 0.22, delays[i], 0.38));
  }
}

const sfx = new SoundEffects();
if (typeof window !== 'undefined') {
  window.sfx = sfx;
}

// Global Mobile/Desktop AudioContext & SpeechSynthesis unlocker on user interaction
if (typeof window !== 'undefined') {
  const unlockAudioListener = () => {
    sfx.unlockAudio();
    if (window.englishVoice) {
      window.englishVoice.warmup();
    }
  };
  ['click', 'touchstart', 'touchend', 'pointerdown', 'keydown'].forEach(evt => {
    window.addEventListener(evt, unlockAudioListener, { capture: true, passive: true });
    if (typeof document !== 'undefined') {
      document.addEventListener(evt, unlockAudioListener, { capture: true, passive: true });
    }
  });
}

// ============================================================
// English Speech Synthesis Engine (Native Web Speech API)
// Provides crystal-clear native US/EN pronunciation for English questions & answers
// Optimized for Mobile Safari (iOS), Android Chrome & Desktop
// ============================================================
class EnglishSpeechEngine {
  constructor() {
    this.synth = (typeof window !== 'undefined' && 'speechSynthesis' in window) ? window.speechSynthesis : null;
    this.voice = null;
    this.rate = 0.88; // Optimized clear educational playback speed
    this.pitch = 1.0;
    this.isPlaying = false;
    this.isWarmedUp = false;
    this.activeBtn = null;
    this.initVoices();
    if (this.synth) {
      if (typeof this.synth.addEventListener === 'function') {
        this.synth.addEventListener('voiceschanged', () => this.initVoices());
      } else if (this.synth.onvoiceschanged !== undefined) {
        this.synth.onvoiceschanged = () => this.initVoices();
      }
    }
  }

  warmup() {
    if (!this.synth || this.isWarmedUp) return;
    try {
      if (this.synth.paused) {
        this.synth.resume();
      }
      // Micro silent utterance to unlock iOS Webkit Speech Engine
      const silentUtter = new SpeechSynthesisUtterance(' ');
      silentUtter.volume = 0.01;
      silentUtter.rate = 2.0;
      this.synth.speak(silentUtter);
      this.isWarmedUp = true;
    } catch (e) {}
  }

  initVoices() {
    if (!this.synth) return;
    try {
      const voices = this.synth.getVoices();
      if (!Array.isArray(voices) || voices.length === 0) return;
      // Preferred high quality native English voices
      const preferred = ['Google US English', 'Samantha', 'Daniel', 'Karen', 'Microsoft Zira', 'Natural', 'en-US', 'en_US'];
      for (const pref of preferred) {
        const found = voices.find(v => (v.name && v.name.includes(pref)) || (v.lang && v.lang.replace('_', '-').startsWith(pref)));
        if (found) {
          this.voice = found;
          break;
        }
      }
      if (!this.voice) {
        this.voice = voices.find(v => v.lang && v.lang.startsWith('en')) || null;
      }
    } catch (e) {}
  }

  speak(text, btnElement = null, onComplete = null) {
    if (!this.synth || !text) return;
    try {
      // Ensure iOS Webkit is awake and not in paused deadlock
      if (this.synth.paused) {
        this.synth.resume();
      }

      // If already speaking, cancel gracefully
      if (this.synth.speaking || this.isPlaying) {
        this.synth.cancel();
      }

      // Clean bracket notations: [ (     ) ] or [ ( ? ) ] -> "blank" for audio natural flow
      let clean = String(text)
        .replace(/\[\s*\(\s*\?*\s*\)\s*\]/g, ' blank ')
        .replace(/\[\s*\(.*?\)\s*\]/g, ' blank ')
        .replace(/\[(.*?)\]/g, ' $1 ')
        .replace(/[\/\\#_]/g, ' ')
        .replace(/\s+/g, ' ')
        .trim();

      if (!clean) return;

      const utter = new SpeechSynthesisUtterance(clean);
      utter.lang = 'en-US';
      utter.rate = this.rate;
      utter.pitch = this.pitch;
      utter.volume = 1.0;
      if (this.voice) utter.voice = this.voice;

      this.isPlaying = true;
      if (btnElement) {
        this.activeBtn = btnElement;
        btnElement.classList.add('speaking-animation');
      }

      const finishHandler = () => {
        this.isPlaying = false;
        if (this.activeBtn) {
          this.activeBtn.classList.remove('speaking-animation');
          this.activeBtn = null;
        }
        if (typeof onComplete === 'function') onComplete();
      };

      utter.onend = finishHandler;
      utter.onerror = finishHandler;

      // Slight micro-tick to let cancel event settle on iOS Safari
      setTimeout(() => {
        try {
          if (this.synth.paused) this.synth.resume();
          this.synth.speak(utter);
        } catch (err) {
          finishHandler();
        }
      }, 16);
    } catch (e) {
      this.isPlaying = false;
      if (btnElement) btnElement.classList.remove('speaking-animation');
      console.warn('English Speech error:', e);
    }
  }

  speakAnswer(text, btnElement = null) {
    this.warmup();
    // Prompt playback of correct answer pronunciation on mobile & desktop
    setTimeout(() => {
      this.speak(text, btnElement);
    }, 120);
  }

  stop() {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {}
    }
    this.isPlaying = false;
    if (this.activeBtn) {
      this.activeBtn.classList.remove('speaking-animation');
      this.activeBtn = null;
    }
  }
}

const englishVoice = new EnglishSpeechEngine();
if (typeof window !== 'undefined') {
  window.englishVoice = englishVoice;
}

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
// 3. Game Economy: Item Prices & Avatar Accessories Definitions
// ============================================================
const ITEM_PRICES = {
  hint: { key: 'hint', name: '돋보기 힌트', emoji: '🔍', cost: 30, desc: '정답과 어원 해설 힌트 열람' },
  eraser5050: { key: 'eraser5050', name: '50:50 요술봉', emoji: '🪄', cost: 50, desc: '오답 2개 즉시 지우기' },
  timemachine: { key: 'timemachine', name: '타임머신 시계', emoji: '⌛', cost: 60, desc: '방금 고른 오답 취소 및 시간 되돌리기' },
  magnet: { key: 'magnet', name: '콤보 자석', emoji: '🧲', cost: 70, desc: '연속 정답 시 콤보 점수 4배 흡수' },
  heart: { key: 'heart', name: '하트 수호', emoji: '💖', cost: 80, desc: '틀려도 1회 오답 무효화 찬스' },
  booster2x: { key: 'booster2x', name: '2배 로켓 부스터', emoji: '🚀', cost: 100, desc: '라운드 클리어 점수 2배 적립' },
  clover: { key: 'clover', name: '행운의 클로버', emoji: '🍀', cost: 120, desc: '문제를 즉시 정답으로 통과 (프리패스)' },
  shield: { key: 'shield', name: '수호 방패', emoji: '🛡️', cost: 150, max: 2, desc: '라운드 실패 시 방어하여 통과 (최대 2개)' }
};

const ACCESSORY_DEFINITIONS = {
  pin: [
    // 기존 5종
    { id: 'pin_ribbon', name: '핑크 리본핀', emoji: '🎀', cost: 50, desc: '사랑스러운 핑크색 헤어 리본' },
    { id: 'pin_flower', name: '벚꽃 머리핀', emoji: '🌸', cost: 60, desc: '은은한 봄향기 벚꽃 꽃잎 핀' },
    { id: 'pin_star', name: '반짝이 별핀', emoji: '✨', cost: 70, desc: '밤하늘처럼 빛나는 별빛 헤어핀' },
    { id: 'pin_clover', name: '행운의 클로버핀', emoji: '🍀', cost: 70, desc: '행운을 가져다주는 네잎클로버 핀' },
    { id: 'pin_heart', name: '하트 뿅뿅핀', emoji: '💖', cost: 80, desc: '두근두근 하트 머리핀' },
    // 일반 확장 10종
    { id: 'pin_sun', name: '해바라기 핀', emoji: '🌻', cost: 60, desc: '햇살 가득 화사한 해바라기 핀' },
    { id: 'pin_cherry', name: '달콤 체리 핀', emoji: '🍒', cost: 65, desc: '상큼달콤한 붉은 앵두 머리핀' },
    { id: 'pin_tulip', name: '빨간 튤립 핀', emoji: '🌷', cost: 60, desc: '단아하고 우아한 봄 튤립 핀' },
    { id: 'pin_music', name: '멜로디 음표 핀', emoji: '🎵', cost: 70, desc: '콧노래가 절로 나오는 8분음표' },
    { id: 'pin_moon', name: '초승달 헤어클립', emoji: '🌙', cost: 75, desc: '은은한 달빛의 밤하늘 헤어클립' },
    { id: 'pin_butterfly', name: '푸른 나비 핀', emoji: '🦋', cost: 80, desc: '살포시 내려앉은 푸른빛 나비' },
    { id: 'pin_snowflake', name: '눈꽃 결정 핀', emoji: '❄️', cost: 85, desc: '겨울왕국 얼음 요정의 눈꽃 핀' },
    { id: 'pin_sprout', name: '새싹 헤어핀', emoji: '🌱', cost: 55, desc: '머리 위에 쏙 돋아난 파릇파릇 새싹' },
    { id: 'pin_candy', name: '롤리팝 사탕 핀', emoji: '🍭', cost: 65, desc: '알록달록 달콤한 막대사탕 핀' },
    { id: 'pin_strawberry', name: '딸기 머리핀', emoji: '🍓', cost: 70, desc: '상큼한 과즙이 톡 터질 듯한 딸기' },
    // 마리오 테마 코스튬 5종
    { id: 'pin_mario_star', name: '마리오 무적 슈퍼스타', emoji: '⭐', cost: 160, desc: '오색 찬란한 무적의 슈퍼스타' },
    { id: 'pin_mario_fire', name: '파이어 플라워 핀', emoji: '🌼', cost: 150, desc: '불꽃을 뿜어내는 마리오 불꽃꽃' },
    { id: 'pin_mario_ice', name: '아이스 플라워 핀', emoji: '❄️', cost: 150, desc: '얼음 탄환을 날리는 아이스꽃' },
    { id: 'pin_mario_coin', name: '슈퍼 골드코인 핀', emoji: '🪙', cost: 140, desc: '띠링! 소리가 날 것 같은 황금 코인' },
    { id: 'pin_mario_block', name: '슈퍼 물음표 박스', emoji: '❓', cost: 170, desc: '보너스가 퐁퐁 솟는 물음표 블록' },
    // 동물의 숲 테마 4종
    { id: 'pin_acnl_leaf', name: '동숲 초록 나뭇잎 핀', emoji: '🍃', cost: 160, desc: '동물의 숲 상징 초록 나뭇잎 헤어핀' },
    { id: 'pin_acnl_peach', name: '특산물 복숭아 핀', emoji: '🍑', cost: 140, desc: '섬에서 수확한 달콤한 과일 핀' },
    { id: 'pin_acnl_fossil', name: '신비한 화석 머리핀', emoji: '🐚', cost: 150, desc: '땅속에서 발굴한 미감정 화석 핀' },
    { id: 'pin_acnl_apple', name: '아삭 사과 머리핀', emoji: '🍎', cost: 140, desc: '상큼한 동숲 사과나무 열매 핀' }
  ],
  glasses: [
    // 기존 4종
    { id: 'glasses_sun', name: '힙스터 선글라스', emoji: '🕶️', cost: 90, desc: '자신감 넘치는 멋쟁이 블랙 선글라스' },
    { id: 'glasses_nerd', name: '똑똑이 뿔테안경', emoji: '👓', cost: 70, desc: '맞춤법 만점자의 지적인 뿔테안경' },
    { id: 'glasses_goggle', name: '사이버 고글', emoji: '🥽', cost: 90, desc: '미래지향적 네온 사이버 고글' },
    { id: 'glasses_monocle', name: '탐정 모노클', emoji: '🧐', cost: 100, desc: '오답을 매의 눈으로 찾는 외안경' },
    // 일반 확장 10종
    { id: 'glasses_heart', name: '하트 틴트 선글라스', emoji: '🕶️', cost: 85, desc: '로맨틱한 핑크 하트 프레임' },
    { id: 'glasses_round', name: '동글이 골드안경', emoji: '👓', cost: 75, desc: '빈티지 레트로 감성의 동그란 금테' },
    { id: 'glasses_vr', name: '메타버스 VR 고글', emoji: '🥽', cost: 120, desc: '가상세계를 탐험하는 최첨단 헤드셋' },
    { id: 'glasses_swim', name: '돌고래 물안경', emoji: '🤿', cost: 70, desc: '바닷속을 헤엄치는 시원한 물안경' },
    { id: 'glasses_reading', name: '반무테 독서안경', emoji: '👓', cost: 80, desc: '어휘 분석력이 상승하는 학구파 안경' },
    { id: 'glasses_pixel', name: '8비트 픽셀 셰이즈', emoji: '🕶️', cost: 95, desc: '레트로 게이머 감성의 힙스터 셰이즈' },
    { id: 'glasses_safety', name: '연구원 보안경', emoji: '🥽', cost: 85, desc: '실험실 수석 연구원의 안전 보호경' },
    { id: 'glasses_star', name: '스타 옐로우 선글라스', emoji: '🕶️', cost: 90, desc: '아이돌 락스타 감성의 별 선글라스' },
    { id: 'glasses_steampunk', name: '스팀펑크 황동고글', emoji: '🥽', cost: 110, desc: '톱니바퀴가 달린 클래식 황동 고글' },
    { id: 'glasses_aviator', name: '에비에이터 보잉안경', emoji: '👓', cost: 90, desc: '파일럿의 카리스마 보잉 프레임' },
    // 마리오 테마 코스튬 5종
    { id: 'glasses_mario_stache', name: '마리오 콧수염 안경', emoji: '🥸', cost: 160, desc: '풍성한 마리오 콧수염과 레드 안경테' },
    { id: 'glasses_luigi_stache', name: '루이지 콧수염 안경', emoji: '🥸', cost: 160, desc: '매력적인 루이지 콧수염과 그린 안경테' },
    { id: 'glasses_wario_shades', name: '와리오 뾰족 선글라스', emoji: '🕶️', cost: 170, desc: '욕심쟁이 와리오의 개성만점 보라 셰이즈' },
    { id: 'glasses_kamek_spectacles', name: '카멕 마법 돋보기', emoji: '👓', cost: 180, desc: '마귀 카멕의 동그란 뿔테 마법 렌즈' },
    { id: 'glasses_lakitu_goggles', name: '김수한무 구름고글', emoji: '🥽', cost: 165, desc: '구름을 타고 신호등을 든 비행 고글' },
    // 동물의 숲 테마 3종
    { id: 'glasses_acnl_round', name: '동숲 동글이 뿔테', emoji: '👓', cost: 140, desc: '마을 주민들에게 인기 만점인 클래식 뿔테' },
    { id: 'glasses_acnl_dragonfly', name: '잠자리 선글라스', emoji: '🕶️', cost: 150, desc: '잠자리 눈을 닮은 복고풍 틴트 선글라스' },
    { id: 'glasses_acnl_funny', name: '코주부 장난 안경', emoji: '🥸', cost: 150, desc: '주민들과 파티할 때 쓰는 익살스러운 안경' }
  ],
  hat: [
    // 기존 5종
    { id: 'hat_crown', name: '황금 왕관', emoji: '👑', cost: 150, desc: '랭킹 1위 마스터를 위한 눈부신 왕관' },
    { id: 'hat_grad', name: '학사모', emoji: '🎓', cost: 100, desc: '국어 국문학을 마스터한 지혜의 학사모' },
    { id: 'hat_party', name: '파티 꼬깔모자', emoji: '🎉', cost: 80, desc: '매일매일 즐거운 축제 꼬깔모자' },
    { id: 'hat_witch', name: '마법사 고깔모자', emoji: '🧙', cost: 120, desc: '신비로운 마법의 마녀/마법사 모자' },
    { id: 'hat_helmet', name: '안전 헬멧', emoji: '⛑️', cost: 90, desc: '오답으로부터 뇌를 보호하는 방탄 헬멧' },
    // 일반 확장 10종
    { id: 'hat_chef', name: '마스터 셰프 모자', emoji: '👨‍🍳', cost: 85, desc: '달콤한 디저트를 만드는 최고급 요리사 모자' },
    { id: 'hat_detective', name: '셜록 헌팅캡', emoji: '🕵️', cost: 95, desc: '정답의 단서를 추적하는 명탐정 모자' },
    { id: 'hat_beret', name: '예술가 핑크 베레모', emoji: '🎨', cost: 80, desc: '파리지앵 감성의 감각적인 베레모' },
    { id: 'hat_cowboy', name: '서부 카우보이햇', emoji: '🤠', cost: 90, desc: '광활한 황야를 달리는 멋쟁이 가죽 모자' },
    { id: 'hat_beanie', name: '스트릿 힙스터 비니', emoji: '🧢', cost: 75, desc: '따뜻하고 캐주얼한 스트릿 패션 비니' },
    { id: 'hat_straw', name: '여름 밀짚모자', emoji: '👒', cost: 70, desc: '바람 솔솔 시원한 바캉스 밀짚모자' },
    { id: 'hat_captain', name: '마린 캡틴 모자', emoji: '⚓', cost: 95, desc: '푸른 바다를 항해하는 선장 모자' },
    { id: 'hat_viking', name: '바이킹 뿔투구', emoji: '🪖', cost: 110, desc: '용맹한 북유럽 전사의 뿔 달린 헬멧' },
    { id: 'hat_tiara', name: '반짝이 실버 티아라', emoji: '👑', cost: 130, desc: '우아하고 세련된 크리스탈 미니 왕관' },
    { id: 'hat_tophat', name: '신사 실크햇', emoji: '🎩', cost: 100, desc: '품격 넘치는 클래식 블랙 탑햇' },
    // 마리오 테마 코스튬 5종
    { id: 'hat_mario_cap', name: '슈퍼 마리오 레드캡', emoji: '🧢', cost: 200, desc: '빨간색 M 로고의 전설적인 마리오 모자' },
    { id: 'hat_luigi_cap', name: '슈퍼 루이지 그린캡', emoji: '🧢', cost: 200, desc: '초록색 L 로고의 형제 루이지 모자' },
    { id: 'hat_toad_mushroom', name: '키노피오 버섯 모자', emoji: '🍄', cost: 190, desc: '빨간 도트가 콕콕 박힌 귀여운 버섯 모자' },
    { id: 'hat_peach_crown', name: '피치공주 핑크크라운', emoji: '👑', cost: 220, desc: '버섯 왕국을 다스리는 우아한 보석 왕관' },
    { id: 'hat_bowser_horns', name: '쿠파 대마왕 가시뿔', emoji: '👹', cost: 230, desc: '불을 뿜는 대마왕의 위엄 넘치는 가시 뿔' },
    // 동물의 숲 테마 4종
    { id: 'hat_acnl_nook', name: '너굴 둥근 귀 모자', emoji: '🦝', cost: 180, desc: '너굴 상점 주인의 깜찍한 둥근 너굴 귀' },
    { id: 'hat_acnl_isabelle', name: '여울이 강아지 리본', emoji: '🎀', cost: 190, desc: '여울이 머리 위에 달린 초록 방울 리본' },
    { id: 'hat_acnl_straw_cone', name: '동숲 전통 삿갓', emoji: '👒', cost: 140, desc: '비바람을 막아주는 정겨운 짚 삿갓' },
    { id: 'hat_acnl_explorer', name: '사파리 탐험가 모자', emoji: '🤠', cost: 160, desc: '곤충과 물고기를 찾아 떠나는 탐험 모자' }
  ],
  blush: [
    // 기존 4종
    { id: 'blush_pink', name: '수줍은 볼터치', emoji: '😊', cost: 60, desc: '발그레 붉어진 귀여운 분홍 볼터치' },
    { id: 'blush_band', name: '깜찍이 반창고', emoji: '🩹', cost: 70, desc: '코나 볼에 붙이는 힙한 스티커 반창고' },
    { id: 'blush_bubble', name: '비눗방울 방울방울', emoji: '🫧', cost: 80, desc: '얼굴 주위를 맴도는 영롱한 거품' },
    { id: 'blush_lipstick', name: '뽀뽀 립마크', emoji: '💄', cost: 80, desc: '사랑을 담은 레드 립스틱 마크' },
    // 일반 확장 10종
    { id: 'blush_peach', name: '복숭아빛 코랄 블러셔', emoji: '🍑', cost: 65, desc: '자연스럽고 화사한 코랄빛 생기 볼터치' },
    { id: 'blush_cat_whiskers', name: '아기고양이 수염', emoji: '🐱', cost: 70, desc: '양 볼에 쏙 그려진 깜찍한 야옹이 수염' },
    { id: 'blush_star_freckles', name: '별빛 글리터 주근깨', emoji: '✨', cost: 75, desc: '코와 볼 위에 흩뿌려진 별빛 글리터' },
    { id: 'blush_clover_tattoo', name: '네잎 타투 스티커', emoji: '🍀', cost: 60, desc: '뺨 위에 새겨진 작은 행운 타투' },
    { id: 'blush_heart_stamp', name: '미니 하트 스탬프', emoji: '💖', cost: 70, desc: '눈 밑에 콕 찍힌 사랑의 미니 하트' },
    { id: 'blush_tears', name: '감동의 글썽 눈물', emoji: '💧', cost: 65, desc: '만점에 벅차올라 흘리는 반짝이는 눈물방울' },
    { id: 'blush_sleepy', name: '새근새근 콧방울', emoji: '💤', cost: 60, desc: '잠이 솔솔 올 때 생기는 몽환적인 콧방울' },
    { id: 'blush_sparkle_eyes', name: '초롱초롱 만화 눈빛', emoji: '🥺', cost: 80, desc: '순정만화 주인공처럼 빛나는 반짝임' },
    { id: 'blush_cherry_mark', name: '체리 페이스 페인팅', emoji: '🍒', cost: 70, desc: '오른쪽 볼에 그려진 상큼한 앵두 마크' },
    { id: 'blush_sweat', name: '당황 땀방울', emoji: '😅', cost: 55, desc: '아슬아슬 오답 위기일 때 솟아나는 땀방울' },
    // 마리오 테마 코스튬 5종
    { id: 'blush_yoshi_egg', name: '요시 알 페이스 마크', emoji: '🥚', cost: 150, desc: '녹색 점박이 요시 알 귀여운 페인팅' },
    { id: 'blush_boo_blush', name: '부끄부끄 수줍음 볼', emoji: '👻', cost: 160, desc: '마주치면 얼굴을 가리는 텔레사 수줍음' },
    { id: 'blush_super_mushroom', name: '미니 1UP 버섯 페이스', emoji: '🍄', cost: 170, desc: '목숨을 늘려주는 앙증맞은 초록 버섯' },
    { id: 'blush_fireball_spark', name: '파이어볼 불꽃 스파크', emoji: '💥', cost: 160, desc: '마리오가 던지는 지글지글 파이어 스파크' },
    { id: 'blush_coin_shine', name: '골드 반짝임 이펙트', emoji: '🪙', cost: 150, desc: '코인을 먹었을 때 팡 터지는 금빛 스파클' },
    // 동물의 숲 테마 3종
    { id: 'blush_acnl_cheeks', name: '동숲 시그니처 주황볼', emoji: '🍊', cost: 130, desc: '동숲 캐릭터 특유의 동글동글 주황빛 볼터치' },
    { id: 'blush_acnl_joy', name: '동숲 기쁨 반짝 리액션', emoji: '✨', cost: 150, desc: '정답을 맞혔을 때 번쩍이는 환호 리액션' },
    { id: 'blush_acnl_sweat', name: '동숲 충격 땀방울', emoji: '💧', cost: 130, desc: '틀렸을 때 흠칫 놀라며 솟는 큼직한 땀방울' }
  ],
  neck: [
    // 일반 10종
    { id: 'neck_red_scarf', name: '따뜻한 빨간 목도리', emoji: '🧣', cost: 80, desc: '겨울바람을 막아주는 포근한 털목도리' },
    { id: 'neck_bow_tie', name: '신사 보타이 나비넥타이', emoji: '🎀', cost: 85, desc: '단정하고 기품 있는 클래식 블랙 보타이' },
    { id: 'neck_gold_chain', name: '스웨그 골드 체인', emoji: '🥇', cost: 110, desc: '힙합 비트가 들릴 듯한 묵직한 금목걸이' },
    { id: 'neck_pearl', name: '우아한 진주 목걸이', emoji: '🦪', cost: 120, desc: '은은한 광채를 내뿜는 천연 진주 비드' },
    { id: 'neck_school_tie', name: '단정한 교복 넥타이', emoji: '👔', cost: 75, desc: '스마트한 모범생 분위기의 네이비 타이' },
    { id: 'neck_bandana', name: '웨스턴 페이즐리 반다나', emoji: '🧣', cost: 70, desc: '목에 둘러매는 빈티지 서부 반다나' },
    { id: 'neck_bell_choker', name: '딸랑이 방울 초커', emoji: '🔔', cost: 85, desc: '걸을 때마다 맑은 소리가 나는 금방울 초커' },
    { id: 'neck_hawaiian_lei', name: '알로하 꽃목걸이', emoji: '🌺', cost: 90, desc: '열대 꽃잎으로 엮은 트로피컬 레이' },
    { id: 'neck_medal', name: '맞춤법 챔피언 금메달', emoji: '🏅', cost: 130, desc: '전국 맞춤법 대회 1위의 영예 메달' },
    { id: 'neck_heart_pendant', name: '루비 하트 펜던트', emoji: '💖', cost: 100, desc: '심장처럼 반짝이는 루비 보석 펜던트' },
    // 마리오 테마 코스튬 5종
    { id: 'neck_mario_overalls', name: '마리오 데님 멜빵', emoji: '👖', cost: 180, desc: '노란 단추가 돋보이는 마리오 트레이드마크 멜빵' },
    { id: 'neck_luigi_overalls', name: '루이지 블루 멜빵', emoji: '👖', cost: 180, desc: '초록 셔츠와 찰떡인 루이지 작업용 멜빵' },
    { id: 'neck_bowser_spiked_collar', name: '쿠파 대마왕 징목걸이', emoji: '⛓️', cost: 200, desc: '쿠파의 목을 장식하는 철제 스파이크 쵸커' },
    { id: 'neck_donkey_tie', name: '동키콩 시그니처 레드타이', emoji: '👔', cost: 190, desc: 'DK 노란 글씨가 새겨진 정글 동키콩 넥타이' },
    { id: 'neck_daisy_brooch', name: '데이지 꽃 브로치', emoji: '🌼', cost: 190, desc: '사라사랜드의 상징 해바라기 넥 브로치' }
  ],
  outfit: [
    // 신규 카테고리 1: 전신 의상/원피스/멜빵 16종
    { id: 'outfit_acnl_leaf', name: '동숲 알로하 나뭇잎 셔츠', emoji: '🍃', cost: 180, desc: '동물의 숲 시그니처 초록 나뭇잎 하와이안 셔츠' },
    { id: 'outfit_acnl_nook', name: '너굴 상점 청록 에이프런', emoji: '🦝', cost: 200, desc: '콩돌밤돌이와 너굴 사장이 입는 클래식 앞치마' },
    { id: 'outfit_acnl_isabelle', name: '여울이 니트 가디건', emoji: '🧶', cost: 210, desc: '안내소 수석 비서 여울이의 단정한 그린 체크 조끼' },
    { id: 'outfit_acnl_kk', name: 'K.K. 라이브 티셔츠', emoji: '🎸', cost: 190, desc: '토요일 밤 클럽 LOL 콘서트 투어 기념 티셔츠' },
    { id: 'outfit_mario_overalls', name: '슈퍼 마리오 멜빵 작업복', emoji: '👖', cost: 220, desc: '빨간 티셔츠와 파란 데님 멜빵바지의 전설적 조합' },
    { id: 'outfit_luigi_overalls', name: '루이지 그린 멜빵 작업복', emoji: '👖', cost: 220, desc: '초록 티셔츠와 멜빵바지로 완성하는 형제 코스튬' },
    { id: 'outfit_peach_dress', name: '피치공주 로열 핑크드레스', emoji: '👗', cost: 240, desc: '버섯 왕국 공주님의 우아하고 화려한 핑크 드레스' },
    { id: 'outfit_school_uniform', name: '스마트 단정 교복', emoji: '👔', cost: 120, desc: '국어 만점 모범생의 단정하고 깔끔한 교복' },
    { id: 'outfit_hoodie', name: '파스텔 오버핏 후드티', emoji: '🧥', cost: 110, desc: '포근하고 편안한 감성의 파스텔톤 캐주얼 후드' },
    { id: 'outfit_sailor', name: '마린 세일러 원피스', emoji: '👗', cost: 130, desc: '시원한 바다바람이 느껴지는 네이비 세일러복' },
    { id: 'outfit_tuxedo', name: '신사 클래식 턱시도', emoji: '🤵', cost: 160, desc: '특별한 파티와 시상식을 위한 최고급 블랙 정장' },
    { id: 'outfit_hanbok', name: '색동 고운 전통 한복', emoji: '👘', cost: 170, desc: '고운 색동저고리와 풍성한 전통 명절 한복' },
    { id: 'outfit_cheerleader', name: '치어리더 응원복', emoji: '📣', cost: 130, desc: '정답을 맞힐 때마다 힘찬 에너지를 주는 응원복' },
    { id: 'outfit_detective_coat', name: '명탐정 트렌치코트', emoji: '🕵️', cost: 150, desc: '맞춤법의 오류를 쫓는 지적인 베이지 코트' },
    { id: 'outfit_dinosaur', name: '아기공룡 점프수트', emoji: '🦖', cost: 160, desc: '꼬리가 앙증맞게 달린 귀여운 공룡 파자마' },
    { id: 'outfit_bear_overall', name: '곰돌이 코듀로이 멜빵', emoji: '🧸', cost: 140, desc: '가슴에 곰돌이 자수가 새겨진 골덴 멜빵바지' }
  ],
  shoes: [
    // 신규 카테고리 2: 신발/풋웨어 15종
    { id: 'shoes_red_sneakers', name: '빨간 캔버스 스니커즈', emoji: '👟', cost: 80, desc: '경쾌하게 뛰어다닐 수 있는 올스타 스니커즈' },
    { id: 'shoes_acnl_boots', name: '동숲 탐험가 브라운 워커', emoji: '🥾', cost: 150, desc: '나무 흔들기와 화석 발굴에 딱 맞는 튼튼한 가죽 워커' },
    { id: 'shoes_acnl_rainboots', name: '노란 삐약이 레인부츠', emoji: '👢', cost: 120, desc: '비 오는 날 물웅덩이를 찰방거리는 귀여운 장화' },
    { id: 'shoes_mario_leather', name: '마리오 브라운 가죽구두', emoji: '👞', cost: 190, desc: '벽돌을 쾅쾅 밟아도 끄떡없는 마리오의 둥근 구두' },
    { id: 'shoes_luigi_leather', name: '루이지 클래식 슈즈', emoji: '👞', cost: 190, desc: '높이 점프할 수 있는 루이지의 단단한 갈색 신발' },
    { id: 'shoes_peach_pumps', name: '피치공주 루비 펌프스', emoji: '👠', cost: 200, desc: '걸을 때마다 또각또각 맑은 소리가 나는 핑크 힐' },
    { id: 'shoes_rollerskate', name: '네온 롤러스케이트', emoji: '🛼', cost: 130, desc: '빛나는 바퀴로 씽씽 미끄러지는 레트로 롤러' },
    { id: 'shoes_straw_sandals', name: '자연 볏짚 짚신', emoji: '👡', cost: 70, desc: '가볍고 시원한 옛 선비들의 전통 짚신' },
    { id: 'shoes_bunny_slippers', name: '토끼 털실내화', emoji: '🐰', cost: 90, desc: '귀가 쫑긋 달린 보들보들 포근한 실내화' },
    { id: 'shoes_ballet_flats', name: '로맨틱 발레 플랫슈즈', emoji: '🩰', cost: 110, desc: '발레리나의 사뿐사뿐한 스텝을 닮은 슈즈' },
    { id: 'shoes_soccer_cleats', name: '스트라이커 축구화', emoji: '⚽', cost: 100, desc: '잔디밭을 질주하는 날렵한 스파이크 축구화' },
    { id: 'shoes_hiking_boots', name: '알프스 고성능 등산화', emoji: '🥾', cost: 110, desc: '험준한 산도 거뜬히 오르는 방수 트레킹화' },
    { id: 'shoes_rainbow_shoes', name: '무지개 LED 라이트 슈즈', emoji: '👟', cost: 140, desc: '발을 디딜 때마다 일곱빛깔 불빛이 켜지는 운동화' },
    { id: 'shoes_bear_slippers', name: '곰발바닥 털슬리퍼', emoji: '🐾', cost: 95, desc: '발바닥 젤리가 콕 박힌 따뜻한 겨울 슬리퍼' },
    { id: 'shoes_gold_boots', name: '황금빛 챔피언 부츠', emoji: '🥾', cost: 180, desc: '만점 랭킹 1위의 위엄을 상징하는 골드 윙 부츠' }
  ],
  hand: [
    // 일반 10종
    { id: 'hand_magic_wand', name: '별빛 요술봉', emoji: '🪄', cost: 95, desc: '오답을 뿅 지워줄 듯한 신비로운 요술봉' },
    { id: 'hand_fountain_pen', name: '황금 만년필', emoji: '✒️', cost: 85, desc: '명작을 써내려가는 국어학자의 고급 만년필' },
    { id: 'hand_ice_cream', name: '소프트 바닐라 콘', emoji: '🍦', cost: 60, desc: '달콤하고 시원한 3단 소프트 아이스크림' },
    { id: 'hand_gameboy', name: '레트로 게임기', emoji: '🕹️', cost: 110, desc: '8비트 도트 게임을 즐기는 휴대용 콘솔' },
    { id: 'hand_magnifier', name: '명탐정 돋보기', emoji: '🔍', cost: 80, desc: '미세한 띄어쓰기 오류도 찾아내는 돋보기' },
    { id: 'hand_coffee', name: '아이스 아메리카노', emoji: '☕', cost: 65, desc: '집중력 충전을 위한 시원한 카페인 한 잔' },
    { id: 'hand_shield_mini', name: '수호의 미니 방패', emoji: '🛡️', cost: 120, desc: '한 손에 쏙 들어오는 든든한 가디언 방패' },
    { id: 'hand_bouquet', name: '향기로운 꽃다발', emoji: '💐', cost: 90, desc: '축하와 감사를 전하는 화사한 플라워 부케' },
    { id: 'hand_book', name: '표준국어대사전', emoji: '📖', cost: 95, desc: '모든 맞춤법 해답이 담긴 가죽 양장본 사전' },
    { id: 'hand_lightstick', name: '아이돌 응원봉', emoji: '🪄', cost: 100, desc: '무지갯빛으로 반짝이는 응원봉' },
    // 마리오 테마 코스튬 5종
    { id: 'hand_mario_wrench', name: '배관공 만능 렌치', emoji: '🔧', cost: 170, desc: '하수관 파이프를 척척 고치는 황동 렌치' },
    { id: 'hand_luigi_vacuum', name: '유령청소기 호스', emoji: '🧹', cost: 210, desc: '유령 맨션을 정화하는 폴터가스트 청소기' },
    { id: 'hand_super_hammer', name: '슈퍼 파괴 해머', emoji: '🔨', cost: 190, desc: '오답 블록을 단숨에 부수는 강력한 해머' },
    { id: 'hand_peach_parasol', name: '피치공주 하트 양산', emoji: '⛱️', cost: 200, desc: '공중에서 사뿐히 활강하는 레이스 양산' },
    { id: 'hand_koopa_shell', name: '엉금엉금 등껍질', emoji: '🐢', cost: 180, desc: '앞으로 슝 던질 수 있는 초록 등껍질' },
    // 동물의 숲 테마 5종
    { id: 'hand_acnl_net', name: '동숲 잠자리채', emoji: '🕸️', cost: 170, desc: '희귀 곤충을 휙 낚아채는 동숲 잠자리채' },
    { id: 'hand_acnl_rod', name: '동숲 은 낚싯대', emoji: '🎣', cost: 170, desc: '물고기가 톡톡 건드릴 때 낚아채는 낚싯대' },
    { id: 'hand_acnl_axe', name: '동숲 튼튼한 은도끼', emoji: '🪓', cost: 180, desc: '목재를 모으고 바위를 치는 튼튼한 도끼' },
    { id: 'hand_acnl_can', name: '코끼리 물뿌리개', emoji: '🐘', cost: 160, desc: '꽃밭에 물을 주면 반짝반짝 빛나게 하는 조리개' },
    { id: 'hand_acnl_slingshot', name: '선물 풍선 새총', emoji: '🎯', cost: 160, desc: '하늘에 떠가는 선물 풍선을 팡 터뜨리는 새총' }
  ],
  back: [
    // 일반 10종
    { id: 'back_angel_wings', name: '순백의 천사 날개', emoji: '🪽', cost: 150, desc: '등 뒤에서 은은하게 빛나는 성스러운 날개' },
    { id: 'back_devil_wings', name: '장난꾸러기 악마 날개', emoji: '🦇', cost: 140, desc: '박쥐 모양의 날렵한 흑마법 날개' },
    { id: 'back_hero_cape', name: '진홍빛 영웅 망토', emoji: '🦸', cost: 130, desc: '바람에 펄럭이는 정의의 슈퍼히어로 망토' },
    { id: 'back_backpack', name: '샛노란 피크닉 백팩', emoji: '🎒', cost: 85, desc: '필기도구와 간식이 가득 담긴 소풍 책가방' },
    { id: 'back_fairy_wings', name: '요정 에메랄드 날개', emoji: '🧚', cost: 140, desc: '반짝이는 요정 가루를 날리는 숲의 날개' },
    { id: 'back_guitar', name: '어쿠스틱 통기타', emoji: '🎸', cost: 120, desc: '등에 멘 낭만 가득한 버스킹 통기타' },
    { id: 'back_arrows', name: '로빈후드 화살통', emoji: '🏹', cost: 110, desc: '정답의 과녁을 명중시키는 백발백중 화살통' },
    { id: 'back_jetpack', name: '사이버 제트팩', emoji: '🚀', cost: 160, desc: '등 뒤에서 불꽃을 뿜으며 하늘을 나는 추진기' },
    { id: 'back_balloon_bundle', name: '알록달록 풍선 다발', emoji: '🎈', cost: 95, desc: '하늘 위로 둥실 떠오르게 해주는 헬륨풍선' },
    { id: 'back_wings_gold', name: '황금빛 불사조 날개', emoji: '🪽', cost: 200, desc: '만점자에게만 주어지는 불멸의 골드 윙' },
    // 마리오 테마 코스튬 5종
    { id: 'back_mario_cape', name: '마리오 슈퍼 망토', emoji: '🦸', cost: 210, desc: '달리면 하늘을 활공할 수 있는 노란 슈퍼 망토' },
    { id: 'back_bowser_shell', name: '쿠파 가시 등껍질', emoji: '🐢', cost: 240, desc: '무시무시한 철갑 가시가 돋친 대마왕 등딱지' },
    { id: 'back_tanooki_tail', name: '너구리 마리오 꼬리', emoji: '🦝', cost: 200, desc: '빙글빙글 돌려 낙하속도를 늦추는 너구리 꼬리' },
    { id: 'back_fludd_water', name: '선샤인 펌프 물분사기', emoji: '🔫', cost: 220, desc: '돌픽섬을 청소하던 AI 물대포 F.L.U.D.D.' },
    { id: 'back_propeller_suit', name: '비행 프로펠러 장치', emoji: '🚁', cost: 210, desc: '위로 슝 솟구쳐 오르는 비행 프로펠러 슈트' },
    // 동물의 숲 테마 2종
    { id: 'back_acnl_cage', name: '동숲 곤충채집통 바구니', emoji: '🧺', cost: 170, desc: '잡은 나비와 메뚜기를 안전하게 보관하는 대나무 통' },
    { id: 'back_acnl_backpack', name: '동숲 나뭇잎 슬링백', emoji: '🎒', cost: 180, desc: '초록 나뭇잎 모양의 앙증맞은 가죽 슬링백' }
  ],
  pet: [
    // 일반 10종
    { id: 'pet_chick', name: '삐약이 아기병아리', emoji: '🐥', cost: 90, desc: '발밑에서 종종걸음으로 따라다니는 병아리' },
    { id: 'pet_puppy', name: '꼬리치는 시바견', emoji: '🐕', cost: 110, desc: '주인만 바라보며 반기는 충성스러운 댕댕이' },
    { id: 'pet_kitten', name: '골골송 삼색 아기고양이', emoji: '🐈', cost: 110, desc: '무릎 위를 좋아하는 사랑스러운 냥이' },
    { id: 'pet_bunny', name: '쫑긋 귀 토끼', emoji: '🐇', cost: 95, desc: '당근을 오물거리며 깡충 뛰는 흰토끼' },
    { id: 'pet_hamster', name: '볼빵빵 햄스터', emoji: '🐹', cost: 85, desc: '해바라기씨를 잔뜩 볼에 저장한 미니 햄찌' },
    { id: 'pet_penguin', name: '남극 꼬마 펭귄', emoji: '🐧', cost: 100, desc: '뒤뚱뒤뚱 미끄러지는 시원한 아기 펭귄' },
    { id: 'pet_panda', name: '대나무 아기판다', emoji: '🐼', cost: 120, desc: '데굴데굴 구르며 애교 부리는 귀요미 판다' },
    { id: 'pet_duck', name: '노란 러버덕', emoji: '🦆', cost: 80, desc: '물 위를 둥둥 떠다니는 장난기 많은 오리' },
    { id: 'pet_turtle', name: '느긋한 바다거북', emoji: '🐢', cost: 90, desc: '천천히 침착하게 100점을 돕는 지혜의 거북' },
    { id: 'pet_owl', name: '지혜의 부엉이', emoji: '🦉', cost: 115, desc: '밤샘 공부를 함께해주는 똑똑한 올빼미' },
    // 마리오 테마 코스튬 5종
    { id: 'pet_yoshi_baby', name: '아기 공룡 요시', emoji: '🦖', cost: 230, desc: '사과를 날름 먹는 귀여운 녹색 아기 요시' },
    { id: 'pet_goomba', name: '순둥이 굼바', emoji: '🍄', cost: 180, desc: '언제나 씩씩하게 걸어오는 버섯 왕국의 굼바' },
    { id: 'pet_koopa_troopa', name: '초록 엉금엉금 꼬마', emoji: '🐢', cost: 190, desc: '등껍질에 숨었다 나오는 꼬마 거북 병사' },
    { id: 'pet_chain_chomp', name: '왕멍멍이', emoji: '⛓️', cost: 220, desc: '철사슬에 묶여 컹컹 짖는 무쇠 멍멍이' },
    { id: 'pet_shyguy', name: '가면 쓴 헤이호', emoji: '🎭', cost: 200, desc: '하얀 가면을 쓰고 조용히 돕는 신비한 친구' },
    // 동물의 숲 테마 3종
    { id: 'pet_acnl_timmy', name: '콩돌이&밤돌이 형제', emoji: '🦝', cost: 220, desc: '물건을 사면 꼬리를 살랑거리며 인사하는 너굴 형제' },
    { id: 'pet_acnl_isabelle', name: '미니 마스코트 여울이', emoji: '🐶', cost: 230, desc: '언제나 밝은 미소로 응원해주는 친절한 여울이' },
    { id: 'pet_acnl_kk', name: '기타맨 K.K. 슬라이더', emoji: '🎸', cost: 240, desc: '어쿠스틱 감성 멜로디를 들려주는 방랑 음악가' }
  ],
  aura: [
    // 기존 4종
    { id: 'aura_wings', name: '천사의 날개 오라', emoji: '🪽', cost: 200, desc: '등 뒤에서 활짝 펼쳐지는 순백의 날개' },
    { id: 'aura_cape', name: '영웅의 슈퍼망토', emoji: '🦸', cost: 180, desc: '정의의 사도를 상징하는 펄럭이는 망토' },
    { id: 'aura_fire', name: '불꽃 투지 아우라', emoji: '🔥', cost: 220, desc: '온몸을 감싸는 활활 타오르는 열정 불꽃' },
    { id: 'aura_rainbow', name: '환상의 무지개', emoji: '🌈', cost: 190, desc: '머리 위에 떠오르는 찬란한 일곱빛깔 무지개' },
    // 일반 확장 10종
    { id: 'aura_cherry_blossom', name: '흩날리는 벚꽃비', emoji: '🌸', cost: 140, desc: '화사하게 흩날리는 봄날의 벚꽃잎' },
    { id: 'aura_sparkle_galaxy', name: '우주 은하수 오라', emoji: '🌌', cost: 180, desc: '별과 은하가 소용돌이치는 신비한 우주빛' },
    { id: 'aura_music_notes', name: '신나는 댄싱 음표', emoji: '🎶', cost: 120, desc: '경쾌한 리듬에 맞춰 춤추는 알록달록 음표' },
    { id: 'aura_golden_spark', name: '골드 스파클링 오라', emoji: '✨', cost: 160, desc: '황금빛으로 번쩍이며 피어오르는 기운' },
    { id: 'aura_lightning', name: '짜릿한 번개 볼트', emoji: '⚡', cost: 170, desc: '두뇌를 번쩍 깨우는 푸른 번개 이펙트' },
    { id: 'aura_matrix_code', name: '사이버 매트릭스 비', emoji: '💻', cost: 160, desc: '초록 바이너리 코드가 흐르는 사이버펑크' },
    { id: 'aura_flower_field', name: '만발한 꽃밭 배경', emoji: '💐', cost: 130, desc: '발아래로 활짝 피어나는 향기로운 들꽃밭' },
    { id: 'aura_winter_snow', name: '포근한 함박눈', emoji: '❄️', cost: 140, desc: '하늘에서 사뿐사뿐 내리는 새하얀 눈송이' },
    { id: 'aura_bubbles', name: '영롱한 무지개 방울', emoji: '🫧', cost: 130, desc: '빛을 받아 영롱하게 반짝이는 대형 비눗방울' },
    { id: 'aura_heart_field', name: '두근두근 하트 필드', emoji: '💖', cost: 150, desc: '사랑과 행복이 퐁퐁 솟아나는 핑크빛 장막' },
    // 마리오 테마 코스튬 5종
    { id: 'aura_star_invincible', name: '무적 스타 반짝임', emoji: '⭐', cost: 250, desc: '오색 빛으로 발광하는 무적 상태 BGM 효과' },
    { id: 'aura_coin_shower', name: '골드 코인 샤워', emoji: '🪙', cost: 240, desc: '하늘에서 금화가 쏟아져 내리는 대박 효과' },
    { id: 'aura_castle_firework', name: '스테이지 클리어 폭죽', emoji: '🎆', cost: 230, desc: '깃발을 내릴 때 피어오르는 축하 불꽃놀이' },
    { id: 'aura_warp_pipe', name: '초록 워프 파이프', emoji: '🧪', cost: 220, desc: '지하 세계로 쏙 들어가는 상징적인 토관' },
    { id: 'aura_ghost_house', name: '유령의 집 몽환 안개', emoji: '🌫️', cost: 210, desc: '테레사가 숨어있는 신비롭고 몽환적인 밤안개' },
    // 동물의 숲 테마 3종
    { id: 'aura_acnl_leaves', name: '살랑살랑 나뭇잎 비', emoji: '🍃', cost: 200, desc: '바람을 타고 빙글빙글 흩날리는 동숲 나뭇잎' },
    { id: 'aura_acnl_bells', name: '대박 99000벨 샤워', emoji: '💰', cost: 230, desc: '바위를 쳤을 때 쏟아져 나오는 풍요로운 벨 자루' },
    { id: 'aura_acnl_gyroid', name: '흔들흔들 토용 댄스', emoji: '🗿', cost: 210, desc: '비 온 다음 날 발굴되는 귀여운 토용들의 댄스' }
  ]
};

function findAccessoryById(id) {
  for (const cat of Object.keys(ACCESSORY_DEFINITIONS)) {
    const found = ACCESSORY_DEFINITIONS[cat].find(item => item.id === id);
    if (found) return { ...found, category: cat };
  }
  return null;
}

function getHatClass(hatItem) {
  if (!hatItem) return 'acc-layer acc-hat';
  let cls = 'acc-layer acc-hat';
  const id = hatItem.id;
  if (id.includes('mario') || id.includes('luigi')) {
    cls += ' mario-cap';
  } else if (id.includes('grad')) {
    cls += ' hat-grad';
  } else if (id.includes('crown')) {
    cls += ' hat-crown';
  } else if (id.includes('party')) {
    cls += ' hat-party';
  } else if (id.includes('straw') || id.includes('cone') || id.includes('explorer')) {
    cls += ' hat-straw';
  }
  return cls;
}

function renderBlushLayer(blushItem) {
  if (!blushItem) return '';
  const id = blushItem.id;
  if (id.includes('band')) {
    return `<span class="acc-layer acc-blush-bandaid" title="${blushItem.name}">🩹</span>`;
  }
  if (id.includes('bubble')) {
    return `<span class="acc-layer acc-blush-bubble" title="${blushItem.name}">🫧</span>`;
  }
  if (id.includes('lipstick')) {
    return `<span class="acc-layer acc-blush-lipstick" title="${blushItem.name}">💋</span>`;
  }

  let cheekClass = 'blush-pink';
  let cheekEmoji = '';
  if (id.includes('heart') || blushItem.name.includes('하트')) {
    cheekClass = 'blush-heart';
    cheekEmoji = '💖';
  } else if (id.includes('star') || blushItem.name.includes('별')) {
    cheekClass = 'blush-star';
    cheekEmoji = '✨';
  } else if (id.includes('cheeks') || id.includes('acnl') || id.includes('주황')) {
    cheekClass = 'blush-coral';
  } else if (id.includes('rose') || id.includes('장미')) {
    cheekClass = 'blush-rose';
  } else if (id.includes('peach') || id.includes('복숭아')) {
    cheekClass = 'blush-peach';
  }

  return `
    <div class="acc-layer acc-blush-container ${cheekClass}" title="${blushItem.name}">
      <span class="acc-blush-cheek left">${cheekEmoji}</span>
      <span class="acc-blush-cheek right">${cheekEmoji}</span>
    </div>
  `;
}

function getOutfitStyleInfo(outfitItem) {
  if (!outfitItem) {
    return {
      className: 'outfit-default',
      innerHtml: '<div class="outfit-collar"></div>'
    };
  }
  const id = outfitItem.id;
  if (id.includes('leaf')) {
    return {
      className: 'outfit-acnl-leaf',
      innerHtml: '<div class="outfit-collar"></div><span class="outfit-badge-leaf">🍃</span>'
    };
  }
  if (id.includes('mario')) {
    return {
      className: 'outfit-mario-overalls',
      innerHtml: `
        <div class="outfit-straps">
          <span class="strap left"><i class="gold-button"></i></span>
          <span class="strap right"><i class="gold-button"></i></span>
        </div>
      `
    };
  }
  if (id.includes('luigi')) {
    return {
      className: 'outfit-luigi-overalls',
      innerHtml: `
        <div class="outfit-straps">
          <span class="strap left"><i class="gold-button"></i></span>
          <span class="strap right"><i class="gold-button"></i></span>
        </div>
      `
    };
  }
  if (id.includes('nook')) {
    return {
      className: 'outfit-acnl-nook',
      innerHtml: '<div class="outfit-collar"></div><span class="outfit-badge-leaf">🍃</span>'
    };
  }
  if (id.includes('isabelle')) {
    return {
      className: 'outfit-acnl-isabelle',
      innerHtml: '<div class="outfit-collar"></div>'
    };
  }
  if (id.includes('polo')) {
    return {
      className: 'outfit-polo-blue',
      innerHtml: '<div class="outfit-collar"></div>'
    };
  }
  if (id.includes('hoodie')) {
    return {
      className: 'outfit-hoodie',
      innerHtml: '<div class="outfit-collar"></div>'
    };
  }
  if (id.includes('tuxedo')) {
    return {
      className: 'outfit-tuxedo',
      innerHtml: '<div class="outfit-collar"></div><span class="outfit-bowtie">🎀</span>'
    };
  }
  if (id.includes('hanbok')) {
    return {
      className: 'outfit-hanbok',
      innerHtml: '<div class="outfit-collar"></div>'
    };
  }
  if (id.includes('sailor')) {
    return {
      className: 'outfit-sailor',
      innerHtml: '<div class="outfit-collar"></div><span class="outfit-bowtie">🎀</span>'
    };
  }
  if (id.includes('peach') || id.includes('dress')) {
    return {
      className: 'outfit-peach-dress',
      innerHtml: '<div class="outfit-collar"></div>'
    };
  }
  if (id.includes('cheer')) {
    return {
      className: 'outfit-cheerleader',
      innerHtml: '<div class="outfit-collar"></div>'
    };
  }
  if (id.includes('detective')) {
    return {
      className: 'outfit-detective',
      innerHtml: '<div class="outfit-collar"></div>'
    };
  }
  if (id.includes('school')) {
    return {
      className: 'outfit-school',
      innerHtml: '<div class="outfit-collar"></div>'
    };
  }
  return {
    className: 'outfit-default',
    innerHtml: `<div class="outfit-collar"></div><span class="outfit-badge-leaf">${outfitItem.emoji}</span>`
  };
}

function getShoesClass(shoesItem) {
  if (!shoesItem) return 'shoes-default';
  const id = shoesItem.id;
  if (id.includes('sneaker') || id.includes('red_sneakers')) return 'shoes-sneakers';
  if (id.includes('boot') || id.includes('acnl_boots')) return 'shoes-boots';
  if (id.includes('rainboot')) return 'shoes-rainboots';
  if (id.includes('mario') || id.includes('luigi')) return 'shoes-mario-leather';
  if (id.includes('roller')) return 'shoes-rollerskate';
  if (id.includes('straw') || id.includes('jipsin')) return 'shoes-jipsin';
  if (id.includes('peach') || id.includes('pump')) return 'shoes-pumps';
  return 'shoes-default';
}

function renderChibiSvgBody(outfitInfo, outfitItem, uid = 'av') {
  // SVG Organic 2.5D Chibi Body Template
  // Smooth pear silhouette: rounded soft shoulders -> chubby tummy -> rounded hips
  const bodyPath = "M 34,4 C 24,4 16,14 16,28 C 16,42 20,48 16,66 C 12,82 24,98 50,98 C 76,98 88,82 84,66 C 80,48 84,42 84,28 C 84,14 76,4 66,4 Z";
  const id = outfitItem ? outfitItem.id : '';
  const isMario = id.includes('mario');
  const isLuigi = id.includes('luigi');
  const isSailor = id.includes('sailor');
  const isSchool = id.includes('school');

  return `
    <svg class="chibi-body-svg" viewBox="0 0 100 102" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Chibi Body Skin Gradient -->
        <linearGradient id="chibi-skin-${uid}" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#ffedd5"/>
          <stop offset="70%" stop-color="#fed7aa"/>
          <stop offset="100%" stop-color="#fdba74"/>
        </linearGradient>
        <!-- 3D Chubby Belly Soft Radial Glow -->
        <radialGradient id="chibi-belly-${uid}" cx="50%" cy="62%" r="40%">
          <stop offset="0%" stop-color="rgba(255,255,255,0.42)"/>
          <stop offset="55%" stop-color="rgba(255,255,255,0.08)"/>
          <stop offset="100%" stop-color="rgba(0,0,0,0.08)"/>
        </radialGradient>
        <!-- Organic Chibi Torso ClipPath -->
        <clipPath id="chibi-torso-clip-${uid}">
          <path d="${bodyPath}"/>
        </clipPath>
      </defs>

      <!-- 1. Organic Base Skin Layer -->
      <path class="chibi-svg-skin" d="${bodyPath}" fill="url(#chibi-skin-${uid})"/>

      <!-- 2. Organic Clothing Layer clipped to Chibi Silhouette -->
      <g clip-path="url(#chibi-torso-clip-${uid})" class="chibi-svg-clothes-layer">
        <rect class="chibi-svg-clothes-base" x="0" y="0" width="100" height="102"/>
        ${(isMario || isLuigi) ? `<rect class="chibi-overalls-pants" x="0" y="44" width="100" height="58" fill="#1d4ed8"/>` : ''}
        ${isSailor ? `<rect class="chibi-sailor-skirt" x="0" y="48" width="100" height="54" fill="#1e3a8a"/>` : ''}
        ${isSchool ? `<rect class="chibi-school-pants" x="0" y="46" width="100" height="56" fill="#1e293b"/>` : ''}
        <!-- Soft Chubby Tummy Highlight for true 3D organic feel -->
        <ellipse class="chibi-svg-belly-highlight" cx="50" cy="65" rx="27" ry="19" fill="url(#chibi-belly-${uid})"/>
      </g>

      <!-- 3. Organic Torso Soft Contour -->
      <path class="chibi-svg-outline" d="${bodyPath}" fill="none" stroke="rgba(0,0,0,0.14)" stroke-width="2.5"/>
    </svg>
  `;
}

function renderCompositeAvatar(baseAvatar = '🌸', accessories = {}, size = 48, clickable = false, mode = 'compact') {
  const acc = accessories || {};
  const auraItem = acc.aura ? findAccessoryById(acc.aura) : null;
  const backItem = acc.back ? findAccessoryById(acc.back) : null;
  const neckItem = acc.neck ? findAccessoryById(acc.neck) : null;
  const blushItem = acc.blush ? findAccessoryById(acc.blush) : null;
  const glassesItem = acc.glasses ? findAccessoryById(acc.glasses) : null;
  const pinItem = acc.pin ? findAccessoryById(acc.pin) : null;
  const hatItem = acc.hat ? findAccessoryById(acc.hat) : null;
  const handItem = acc.hand ? findAccessoryById(acc.hand) : null;
  const petItem = acc.pet ? findAccessoryById(acc.pet) : null;
  const outfitItem = acc.outfit ? findAccessoryById(acc.outfit) : null;
  const shoesItem = acc.shoes ? findAccessoryById(acc.shoes) : null;

  const glassesMode = acc.glassesMode || 'eyes';
  const isMarioStache = glassesItem && (glassesItem.id.includes('stache') || glassesItem.id.includes('mario'));
  const hatClass = getHatClass(hatItem);

  let glassesClass = 'acc-layer acc-glasses';
  if (isMarioStache) {
    glassesClass += ' mario-stache';
  } else if (glassesMode === 'head') {
    glassesClass += ' wear-head';
  } else {
    glassesClass += ' wear-eyes';
  }

  if (mode === 'fullbody') {
    const fullHeight = Math.round(size * 1.38);
    const headFontSize = Math.round(size * 0.52);
    const outfitInfo = getOutfitStyleInfo(outfitItem);
    const shoesCls = getShoesClass(shoesItem);
    const avatarUid = 'cb_' + Math.floor(Math.random() * 10000000).toString(36);

    return `
      <div class="composite-avatar fullbody ${clickable ? 'clickable' : ''}" style="width: ${size}px; height: ${fullHeight}px; font-size: ${headFontSize}px;">
        ${auraItem ? `<span class="acc-layer acc-aura">${auraItem.emoji}</span>` : ''}
        ${backItem ? `<span class="acc-layer acc-back">${backItem.emoji}</span>` : ''}
        <div class="avatar-soft-shadow"></div>
        <div class="fullbody-frame">
          <!-- Head Box -->
          <div class="fullbody-head-box">
            <span class="acc-base-face">${baseAvatar || '🌸'}</span>
            ${hatItem ? `<span class="${hatClass}">${hatItem.emoji}</span>` : ''}
            ${glassesItem ? `<span class="${glassesClass}">${glassesItem.emoji}</span>` : ''}
            ${pinItem ? `<span class="acc-layer acc-pin">${pinItem.emoji}</span>` : ''}
            ${renderBlushLayer(blushItem)}
            ${neckItem ? `<span class="acc-layer acc-neck">${neckItem.emoji}</span>` : ''}
          </div>

          <!-- Torso Box (Organic SVG Chibi Body & Clothes Silhouette) -->
          <div class="fullbody-torso-box">
            <div class="torso-inner-chibi ${outfitInfo.className}" title="${outfitItem ? outfitItem.name : '기본 복장'}">
              ${renderChibiSvgBody(outfitInfo, outfitItem, avatarUid)}
              <div class="torso-overlay-content">
                ${outfitInfo.innerHtml}
              </div>
            </div>
            <div class="fullbody-arm left">
              <div class="arm-sleeve"></div>
              <div class="arm-hand"></div>
            </div>
            <div class="fullbody-arm right">
              <div class="arm-sleeve"></div>
              <div class="arm-hand"></div>
            </div>
            ${handItem ? `<span class="acc-layer acc-hand" title="${handItem.name}">${handItem.emoji}</span>` : ''}
          </div>

          <!-- Legs & Shoes Box (3D Chibi Shoes) -->
          <div class="fullbody-legs-box ${shoesCls}">
            <div class="chibi-foot left" title="${shoesItem ? shoesItem.name : '기본 신발'}">
              <div class="chibi-leg-pillar"></div>
              <div class="chibi-shoe-body">
                <div class="shoe-upper"></div>
                <div class="shoe-sole"></div>
              </div>
            </div>
            <div class="chibi-foot right" title="${shoesItem ? shoesItem.name : '기본 신발'}">
              <div class="chibi-leg-pillar"></div>
              <div class="chibi-shoe-body">
                <div class="shoe-upper"></div>
                <div class="shoe-sole"></div>
              </div>
            </div>
          </div>
        </div>
        ${petItem ? `<span class="acc-layer acc-pet">${petItem.emoji}</span>` : ''}
      </div>
    `;
  }

  // Compact Badge Mode
  return `
    <div class="composite-avatar ${clickable ? 'clickable' : ''}" style="width: ${size}px; height: ${size}px; font-size: ${Math.round(size * 0.68)}px;">
      ${auraItem ? `<span class="acc-layer acc-aura">${auraItem.emoji}</span>` : ''}
      ${backItem ? `<span class="acc-layer acc-back">${backItem.emoji}</span>` : ''}
      <span class="acc-base-face">${baseAvatar || '🌸'}</span>
      ${neckItem ? `<span class="acc-layer acc-neck">${neckItem.emoji}</span>` : ''}
      ${renderBlushLayer(blushItem)}
      ${glassesItem ? `<span class="${glassesClass}">${glassesItem.emoji}</span>` : ''}
      ${pinItem ? `<span class="acc-layer acc-pin">${pinItem.emoji}</span>` : ''}
      ${hatItem ? `<span class="${hatClass}">${hatItem.emoji}</span>` : ''}
      ${handItem ? `<span class="acc-layer acc-hand">${handItem.emoji}</span>` : ''}
      ${petItem ? `<span class="acc-layer acc-pet">${petItem.emoji}</span>` : ''}
    </div>
  `;
}

// ============================================================
// 4. User & Storage Manager & Date Utilities
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
        completedDates: [today],
        solvedQuestionMap: { spelling: [], idiom: [], hanja: [], english: [] },
        avatarAccessories: { pin: null, glasses: null, hat: null, blush: null, neck: null, outfit: null, shoes: null, hand: null, back: null, pet: null, aura: null, glassesMode: 'eyes' },
        inventoryAccessories: []
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
      if (parsed.currentUser && (!parsed.currentUser.solvedQuestionMap || typeof parsed.currentUser.solvedQuestionMap !== 'object')) {
        parsed.currentUser.solvedQuestionMap = { spelling: [], idiom: [], hanja: [], english: [] };
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

    // Gamification & Item Mechanics State (Shield Max 2)
    this.shields = Math.min(2, Math.max(0, parseInt(localStorage.getItem('haru_game_shields') || '0', 10)));
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
    this._isStartingNextRound = false;
    this.activeItem5050Indices = [];
    this.isHintOpen = false;

    // App Version & Auto-update State (Mobile auto-refresh on stale version)
    const metaVer = (typeof document !== 'undefined' && document.querySelector)
      ? document.querySelector('meta[name="app-version"]')?.getAttribute('content')
      : null;
    this.APP_VERSION = metaVer || '2.9.2';
    this.isCheckingVersion = false;
    this.lastVersionCheckTime = 0;

    this.initDOM();
    this.bindEvents();
    this.renderUserProfile();
    this.renderCalendarWeek();
    this.renderLeaderboard('daily');
    this.renderBadges();
    this.checkCloudAuth();

    // Check & restore active quiz session (e.g. returning after KakaoTalk app switch or page reload)
    this.restoreActiveQuizSession();

    // Auto-check What's New Popup (v2.7 update announcement)
    if (typeof window !== 'undefined') {
      setTimeout(() => this.checkWhatsNewPopup(), 600);
    }

    // Auto-check version on app launch (with slight delay for network stabilization)
    if (typeof window !== 'undefined') {
      setTimeout(() => this.checkAppVersionUpdate(), 1200);
    }
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
    this.modalShop = document.getElementById('modalShop');
    this.modalAvatarZoom = document.getElementById('modalAvatarZoom');
    this.modalWhatsNew = document.getElementById('modalWhatsNew');
    this.currentAccCategory = 'pin';

    // Mascot
    this.mascotBubble = document.getElementById('mascotSpeech');
    this.mascotAvatar = document.getElementById('mascotAvatar');

    // Leaderboard state
    this.rankSubject = 'spelling';
    this.rankType = 'round';

    const soundBtn = document.getElementById('btnToggleSound');
    if (soundBtn) {
      soundBtn.textContent = sfx.enabled ? '🔔' : '🔕';
    }
  }

  bindEvents() {
    // Nav tabs
    document.querySelectorAll('.nav-tab').forEach(tab => {
      tab.addEventListener('click', (e) => {
        const view = e.currentTarget.dataset.view;
        this.switchView(view);
      });
    });

    // Subject Mode Switch Buttons (Spelling vs Idiom vs Hanja vs English)
    const btnSpelling = document.getElementById('btnModeSpelling');
    const btnIdiom = document.getElementById('btnModeIdiom');
    const btnHanja = document.getElementById('btnModeHanja');
    const btnEnglish = document.getElementById('btnModeEnglish');
    if (btnSpelling) btnSpelling.addEventListener('click', () => this.setQuizSubject('spelling'));
    if (btnIdiom) btnIdiom.addEventListener('click', () => this.setQuizSubject('idiom'));
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
    // Note: btnNextRound, btnReviveQuiz, btnFallbackRound are dynamically wired in showQuizResult() with single handlers
    // to prevent double event firing and round number skipping.
    const btnResumeQuiz = document.getElementById('btnResumeQuiz');
    if (btnResumeQuiz) {
      btnResumeQuiz.addEventListener('click', () => this.restoreActiveQuizSession());
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
    const btnGitSync = document.getElementById('btnGitSync');
    if (btnGitSync) btnGitSync.addEventListener('click', () => this.syncGitRepo());

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

    // Point Shop & Dressing Room modal
    const btnOpenShop = document.getElementById('btnOpenShop');
    const btnQuizShopQuick = document.getElementById('btnQuizShopQuick');
    const btnCloseShop = document.getElementById('btnCloseShop');
    const btnBottomCloseShop = document.getElementById('btnBottomCloseShop');
    const btnResetShopPreview = document.getElementById('btnResetShopPreview');
    const btnToggleGlassesMode = document.getElementById('btnToggleGlassesMode');

    if (btnOpenShop) btnOpenShop.addEventListener('click', () => this.openShopModal());
    if (btnQuizShopQuick) btnQuizShopQuick.addEventListener('click', () => this.openShopModal('items'));
    if (btnCloseShop) btnCloseShop.addEventListener('click', () => this.closeShopModal());
    if (btnBottomCloseShop) btnBottomCloseShop.addEventListener('click', () => this.closeShopModal());
    if (btnResetShopPreview) btnResetShopPreview.addEventListener('click', () => this.resetShopPreview());
    if (btnToggleGlassesMode) btnToggleGlassesMode.addEventListener('click', () => this.toggleGlassesMode());

    if (this.modalShop) {
      this.modalShop.addEventListener('click', (e) => {
        if (e.target === this.modalShop) this.closeShopModal();
      });
    }

    const tabShopItems = document.getElementById('tabShopItems');
    const tabShopAccessories = document.getElementById('tabShopAccessories');
    if (tabShopItems) tabShopItems.addEventListener('click', () => this.switchShopTab('items'));
    if (tabShopAccessories) tabShopAccessories.addEventListener('click', () => this.switchShopTab('accessories'));

    // Avatar Zoom Modal
    const btnCloseAvatarZoom = document.getElementById('btnCloseAvatarZoom');
    const btnZoomToShop = document.getElementById('btnZoomToShop');
    if (btnCloseAvatarZoom) btnCloseAvatarZoom.addEventListener('click', () => this.closeAvatarZoomModal());
    if (btnZoomToShop) btnZoomToShop.addEventListener('click', () => {
      this.closeAvatarZoomModal();
      this.openShopModal('accessories');
    });

    // Dressing room category chips
    document.querySelectorAll('.acc-chip').forEach(chip => {
      chip.addEventListener('click', (e) => {
        document.querySelectorAll('.acc-chip').forEach(c => c.classList.remove('active'));
        e.currentTarget.classList.add('active');
        this.currentAccCategory = e.currentTarget.dataset.category || 'pin';
        this.renderShopAccessories();
      });
    });

    // Main Avatar Click to Zoom
    const userAvatarEl = document.getElementById('userAvatar');
    if (userAvatarEl) {
      userAvatarEl.addEventListener('click', (e) => {
        e.stopPropagation();
        this.openAvatarZoomModal();
      });
    }

    // What's New Modal (v2.7 Update)
    const btnOpenWhatsNew = document.getElementById('btnOpenWhatsNew');
    const btnCloseWhatsNew = document.getElementById('btnCloseWhatsNew');
    const btnDismissWhatsNewForever = document.getElementById('btnDismissWhatsNewForever');
    const btnConfirmWhatsNew = document.getElementById('btnConfirmWhatsNew');

    if (btnOpenWhatsNew) btnOpenWhatsNew.addEventListener('click', () => this.openWhatsNewModal());
    if (btnCloseWhatsNew) btnCloseWhatsNew.addEventListener('click', () => this.closeWhatsNewModal());
    if (btnDismissWhatsNewForever) btnDismissWhatsNewForever.addEventListener('click', () => this.dismissWhatsNewForever());
    if (btnConfirmWhatsNew) btnConfirmWhatsNew.addEventListener('click', () => this.closeWhatsNewModal());

    if (this.modalWhatsNew) {
      this.modalWhatsNew.addEventListener('click', (e) => {
        if (e.target === this.modalWhatsNew) this.closeWhatsNewModal();
      });
    }

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
        this.isHintOpen = false;
        this.saveActiveQuizSession();
      });
    }

    // Fail Actions (Revive & Fallback) are dynamically wired in showQuizResult()

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

    // Lifecycle & Date Transition Watchers (Mobile app switch / background resume & session persistence)
    document.addEventListener('visibilitychange', () => {
      if (document.visibilityState === 'hidden') {
        this.saveActiveQuizSession();
      } else if (document.visibilityState === 'visible') {
        // Automatically check if server version is newer and refresh if needed
        this.checkAppVersionUpdate();
        const transitioned = this.checkDateTransition();
        if (!transitioned && this.currentViewName !== 'quiz') {
          const raw = localStorage.getItem('haru_active_quiz_session');
          if (raw) {
            this.restoreActiveQuizSession();
          }
        }
      }
    });
    window.addEventListener('pageshow', () => {
      this.checkAppVersionUpdate();
      const transitioned = this.checkDateTransition();
      if (!transitioned && this.currentViewName !== 'quiz') {
        const raw = localStorage.getItem('haru_active_quiz_session');
        if (raw) {
          this.restoreActiveQuizSession();
        }
      }
    });
    window.addEventListener('focus', () => {
      this.checkAppVersionUpdate();
      const transitioned = this.checkDateTransition();
      if (!transitioned && this.currentViewName !== 'quiz') {
        const raw = localStorage.getItem('haru_active_quiz_session');
        if (raw) {
          this.restoreActiveQuizSession();
        }
      }
    });
    window.addEventListener('pagehide', () => {
      this.saveActiveQuizSession();
    });
    window.addEventListener('beforeunload', () => {
      this.saveActiveQuizSession();
    });
    // Re-verify and sync session automatically when mobile device restores network connection
    window.addEventListener('online', () => {
      console.log('[Haru Matchum] Network restored. Validating session and checking version...');
      this.checkAppVersionUpdate(true);
      if (this.cloudToken) {
        this.checkCloudAuth();
      }
    });
    // Check every 60s for midnight date rollover
    setInterval(() => {
      this.checkDateTransition();
    }, 60000);
    // Periodically check for app updates every 3 minutes
    setInterval(() => {
      this.checkAppVersionUpdate();
    }, 180000);
  }

  checkDateTransition(overrideDateStr) {
    const todayStr = overrideDateStr || getKSTDateString();
    if (todayStr !== this.lastLoadedDate) {
      console.log(`[Haru Matchum] Date transitioned: ${this.lastLoadedDate} -> ${todayStr}`);
      const prevDate = this.lastLoadedDate;
      this.lastLoadedDate = todayStr;

      // Clear yesterday's active quiz session
      this.clearActiveQuizSession();

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
    if (typeof englishVoice !== 'undefined') {
      englishVoice.stop();
    }
    this.currentViewName = viewName;
    document.querySelectorAll('.view-section').forEach(sec => sec.classList.remove('active'));
    document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));

    const tab = document.querySelector(`.nav-tab[data-view="${viewName}"]`);
    if (tab) tab.classList.add('active');

    if (viewName === 'home') {
      this.viewHome.classList.add('active');
      this.updateMascotMood('happy');
      this.updateResumeQuizBanner();
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

  async setQuizSubject(subject) {
    this.quizSubject = subject;
    const btnSpelling = document.getElementById('btnModeSpelling');
    const btnIdiom = document.getElementById('btnModeIdiom');
    const btnHanja = document.getElementById('btnModeHanja');
    const btnEnglish = document.getElementById('btnModeEnglish');
    const dailyCardTitle = document.querySelector('#btnStartDaily h3');
    const dailyCardDesc = document.querySelector('#btnStartDaily p');
    const dailyBadge = document.querySelector('#btnStartDaily .mode-badge');
    const levelCardTitle = document.querySelector('#btnStartLevelDaily h3');

    document.body.classList.remove('theme-idiom', 'theme-hanja', 'theme-english');
    if (btnSpelling) btnSpelling.classList.remove('active');
    if (btnIdiom) btnIdiom.classList.remove('active');
    if (btnHanja) btnHanja.classList.remove('active');
    if (btnEnglish) btnEnglish.classList.remove('active');

    // On-demand script loading
    await this.loadSubjectBank(subject);

    if (subject === 'idiom') {
      document.body.classList.add('theme-idiom');
      if (btnIdiom) btnIdiom.classList.add('active');
      if (dailyCardTitle) dailyCardTitle.textContent = '오늘의 속담·관용구 5제';
      if (dailyCardDesc) dailyCardDesc.textContent = '매일 갱신되는 속담 5문제 풀고 문해력과 어휘력 UP!';
      if (dailyBadge) dailyBadge.textContent = '오늘의 속담 챌린지 🍯';
      if (levelCardTitle) levelCardTitle.textContent = '오늘의 레벨별 속담 5제';
      this.updateMascotMood('happy', `안녕, <strong>${this.data.currentUser.name}</strong>야! 오늘은 지혜가 샘솟는 속담·관용구 퀴즈 도전해볼까? 🍯✨`);
    } else if (subject === 'hanja') {
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

  async loadSubjectBank(subject) {
    if (subject === 'spelling') return true;
    if (subject === 'idiom') {
      if (typeof IDIOM_QUESTION_BANK !== 'undefined') return true;
      return this._injectScript('idiom_questions.js?v=2.5.0');
    }
    if (subject === 'hanja') {
      if (typeof HANJA_QUESTION_BANK !== 'undefined') return true;
      return this._injectScript('hanja_questions.js?v=2.5.0');
    }
    if (subject === 'english') {
      if (typeof ENGLISH_QUESTION_BANK !== 'undefined') return true;
      return this._injectScript('english_questions.js?v=2.5.0');
    }
    return true;
  }

  _injectScript(src) {
    return new Promise((resolve) => {
      if (typeof document === 'undefined' || !document.head) return resolve(false);
      const existing = document.querySelector(`script[src="${src}"]`);
      if (existing) return resolve(true);
      const s = document.createElement('script');
      s.src = src;
      s.onload = () => resolve(true);
      s.onerror = (e) => {
        console.warn('Failed to load bank script dynamically:', src, e);
        resolve(false);
      };
      document.head.appendChild(s);
    });
  }

  getActiveBank() {
    if (this.quizSubject === 'idiom' && typeof IDIOM_QUESTION_BANK !== 'undefined') {
      return IDIOM_QUESTION_BANK;
    }
    if (this.quizSubject === 'hanja' && typeof HANJA_QUESTION_BANK !== 'undefined') {
      return HANJA_QUESTION_BANK;
    }
    if (this.quizSubject === 'english' && typeof ENGLISH_QUESTION_BANK !== 'undefined') {
      return ENGLISH_QUESTION_BANK;
    }
    return typeof SPELLING_QUESTION_BANK !== 'undefined' ? SPELLING_QUESTION_BANK : [];
  }

  renderUserProfile() {
    const u = this.data.currentUser;
    const userAvatarEl = document.getElementById('userAvatar');
    if (userAvatarEl) {
      userAvatarEl.innerHTML = renderCompositeAvatar(u.avatar || '🌸', u.avatarAccessories || {}, 48, true);
    }
    document.getElementById('userName').textContent = u.name;
    document.getElementById('userGrade').textContent = u.grade;
    document.getElementById('userStreak').textContent = u.streak + '일';
    const userShieldsEl = document.getElementById('userShields');
    if (userShieldsEl) userShieldsEl.textContent = (this.shields || 0) + '/2개';
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
      this.activeQuestions = this.shuffleArray([...this.data.wrongQuestions]).slice(0, 5);
    }

    // Shuffle options dynamically so answer position is randomised across 1, 2, 3, 4
    this.activeQuestions = this.activeQuestions.map(q => this.shuffleQuestionOptions(q));
    this.activeItem5050Indices = [];
    this.isHintOpen = false;

    this.switchView('quiz');
    this.renderCurrentQuestion();
    this.saveActiveQuizSession();
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
    this.activeItem5050Indices = [];
    this.isHintOpen = false;

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
    this.saveActiveQuizSession();
  }

  // ============================================================
  // Randomization & Unsolved-First Question Selection Engine
  // ============================================================
  shuffleArray(arr) {
    if (!Array.isArray(arr) || arr.length <= 1) return arr ? [...arr] : [];
    const copy = [...arr];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  getSolvedQuestionIds(subject = this.quizSubject) {
    const sub = subject || 'spelling';
    const u = this.data.currentUser;
    if (!u.solvedQuestionMap || typeof u.solvedQuestionMap !== 'object') {
      u.solvedQuestionMap = { spelling: [], idiom: [], hanja: [], english: [] };
    }
    if (!Array.isArray(u.solvedQuestionMap[sub])) {
      u.solvedQuestionMap[sub] = [];
    }

    // Merge with localStorage if present
    try {
      const localRaw = localStorage.getItem(`haru_solved_${sub}_ids`);
      if (localRaw) {
        const localArr = JSON.parse(localRaw);
        if (Array.isArray(localArr) && localArr.length > 0) {
          const mergedSet = new Set([...u.solvedQuestionMap[sub], ...localArr]);
          u.solvedQuestionMap[sub] = Array.from(mergedSet);
        }
      }
    } catch (e) {}

    return u.solvedQuestionMap[sub];
  }

  recordQuestionSolved(questionId, subject = this.quizSubject) {
    if (!questionId) return;
    const sub = subject || 'spelling';
    const u = this.data.currentUser;
    if (!u.solvedQuestionMap || typeof u.solvedQuestionMap !== 'object') {
      u.solvedQuestionMap = { spelling: [], idiom: [], hanja: [], english: [] };
    }
    if (!Array.isArray(u.solvedQuestionMap[sub])) {
      u.solvedQuestionMap[sub] = [];
    }

    if (!u.solvedQuestionMap[sub].includes(questionId)) {
      u.solvedQuestionMap[sub].push(questionId);
      try {
        localStorage.setItem(`haru_solved_${sub}_ids`, JSON.stringify(u.solvedQuestionMap[sub]));
      } catch (e) {}
      DataManager.save(this.data);
    }
  }

  recordQuestionsSolvedBatch(questionIds, subject = this.quizSubject) {
    if (!Array.isArray(questionIds) || questionIds.length === 0) return;
    const sub = subject || 'spelling';
    const u = this.data.currentUser;
    if (!u.solvedQuestionMap || typeof u.solvedQuestionMap !== 'object') {
      u.solvedQuestionMap = { spelling: [], idiom: [], hanja: [], english: [] };
    }
    if (!Array.isArray(u.solvedQuestionMap[sub])) {
      u.solvedQuestionMap[sub] = [];
    }

    const set = new Set(u.solvedQuestionMap[sub]);
    let added = false;
    for (const qId of questionIds) {
      if (qId && !set.has(qId)) {
        set.add(qId);
        added = true;
      }
    }
    if (added) {
      u.solvedQuestionMap[sub] = Array.from(set);
      try {
        localStorage.setItem(`haru_solved_${sub}_ids`, JSON.stringify(u.solvedQuestionMap[sub]));
      } catch (e) {}
      DataManager.save(this.data);
    }
  }

  resetSolvedQuestionsForPool(pool, subject = this.quizSubject) {
    if (!pool || pool.length === 0) return;
    const sub = subject || 'spelling';
    const poolIds = new Set(pool.map(q => q.id));
    const currentSolved = this.getSolvedQuestionIds(sub);
    const retained = currentSolved.filter(id => !poolIds.has(id));
    const u = this.data.currentUser;
    if (u && u.solvedQuestionMap) {
      u.solvedQuestionMap[sub] = retained;
    }
    try {
      localStorage.setItem(`haru_solved_${sub}_ids`, JSON.stringify(retained));
    } catch (e) {}
    DataManager.save(this.data);
  }

  selectUnsolvedFirstQuestions(pool, count = 5, subject = this.quizSubject, level = null) {
    if (!pool || pool.length === 0) return [];
    if (pool.length <= count) {
      return this.shuffleArray(pool);
    }

    const solvedIds = new Set(this.getSolvedQuestionIds(subject));
    const unseenPool = pool.filter(q => !solvedIds.has(q.id));
    const seenPool = pool.filter(q => solvedIds.has(q.id));

    let selected = [];

    if (unseenPool.length >= count) {
      // 1. Unseen questions are plenty: shuffle unseen pool and take count
      const shuffledUnseen = this.shuffleArray(unseenPool);
      selected = shuffledUnseen.slice(0, count);
    } else if (unseenPool.length > 0) {
      // 2. Unseen questions are fewer than count: take all unseen, fill remainder from seen pool
      const shuffledUnseen = this.shuffleArray(unseenPool);
      const shuffledSeen = this.shuffleArray(seenPool);
      const neededFromSeen = count - shuffledUnseen.length;
      selected = [...shuffledUnseen, ...shuffledSeen.slice(0, neededFromSeen)];
    } else {
      // 3. All questions in this pool have been solved! Reset tracking for this pool and start fresh cycle
      this.resetSolvedQuestionsForPool(pool, subject);
      const shuffledAll = this.shuffleArray(pool);
      selected = shuffledAll.slice(0, count);
    }

    // Final shuffle to guarantee the questions appear in dynamic random order (Q1~Q5)
    return this.shuffleArray(selected);
  }

  getPermutedBlockQuestions(pool, round = 1, seedKey = '') {
    if (!pool || pool.length === 0) return [];
    const questionsPerRound = 5;
    const totalRoundsPerCycle = Math.max(1, Math.floor(pool.length / questionsPerRound));
    const cycleIndex = Math.floor((round - 1) / totalRoundsPerCycle);
    const roundInCycle = (round - 1) % totalRoundsPerCycle;

    // Stable 32-bit FNV-1a hash for seedKey combined with cycleIndex
    const fullSeedStr = `${seedKey}_cycle_${cycleIndex}`;
    let h = 0x811c9dc5;
    for (let i = 0; i < fullSeedStr.length; i++) {
      h ^= fullSeedStr.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    let seed = h >>> 0;

    // Mulberry32 PRNG for deterministic permutation
    const rng = () => {
      let t = seed += 0x6D2B79F5;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };

    // Seeded Fisher-Yates shuffle
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }

    const startIdx = roundInCycle * questionsPerRound;
    return shuffled.slice(startIdx, startIdx + questionsPerRound);
  }

  getLevelDailyQuestions(level, round = 1) {
    const bank = this.getActiveBank();
    const filtered = bank.filter(q => q.level && q.level.includes(level));
    const pool = (filtered.length >= 5) ? filtered : bank;
    return this.selectUnsolvedFirstQuestions(pool, 5, this.quizSubject, level);
  }

  getRandomQuestionsFromPool(pool, count = 1) {
    return this.selectUnsolvedFirstQuestions(pool, count, this.quizSubject);
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
    const bank = this.getActiveBank();
    return this.selectUnsolvedFirstQuestions(bank, 5, this.quizSubject);
  }

  getRandomQuestions(count = 5) {
    const bank = this.getActiveBank();
    return this.selectUnsolvedFirstQuestions(bank, count, this.quizSubject);
  }

  renderQuizCompanionAvatar(reaction = 'idle') {
    const avatarEl = document.getElementById('quizCompanionAvatar');
    const speechEl = document.getElementById('quizCompanionSpeech');
    if (!avatarEl) return;

    const u = this.data.currentUser || { avatar: '🌸', avatarAccessories: {} };
    avatarEl.innerHTML = renderCompositeAvatar(u.avatar || '🌸', u.avatarAccessories || {}, 52, false, 'fullbody');

    // Remove existing reaction classes
    avatarEl.classList.remove('acnl-idle', 'acnl-cheer', 'acnl-shock');

    if (reaction === 'cheer') {
      avatarEl.classList.add('acnl-cheer');
      if (speechEl) {
        const cheers = [
          '정답이야! 정말 대단해! 🎉✨',
          '완벽해! 이 기세로 만점 가자! 💖',
          '우와! 맞춤법 실력 최고야! 🌟',
          '야호! 정답 보너스 팡팡! 🍃'
        ];
        speechEl.textContent = cheers[Math.floor(Math.random() * cheers.length)];
      }
    } else if (reaction === 'shock') {
      avatarEl.classList.add('acnl-shock');
      if (speechEl) {
        const shocks = [
          '앗, 아쉽지만 괜찮아! 다시 집중! 💦',
          '다음 문제에서 꼭 만회해보자! 🥺🍀',
          '설명을 꼼꼼히 읽고 넘어가자! 📖',
          '실수는 성공의 어머니! 힘내! 💪'
        ];
        speechEl.textContent = shocks[Math.floor(Math.random() * shocks.length)];
      }
    } else {
      avatarEl.classList.add('acnl-idle');
      if (speechEl) {
        const idles = [
          '오늘도 만점을 향해 힘내자! 차근차근 풀면 다 맞힐 수 있어! 🍃✨',
          '문제를 꼼꼼히 읽고 신중하게 골라봐! 🌸',
          '동물의 숲 친구가 곁에서 응원하고 있어! 🐾',
          '맞춤법 마스터를 향해 파이팅! 🍀'
        ];
        speechEl.textContent = idles[Math.floor(Math.random() * idles.length)];
      }
    }
  }

  renderCurrentQuestion() {
    const q = this.activeQuestions[this.currentIndex];
    const total = this.activeQuestions.length;

    // Animal Crossing fullbody quiz companion avatar
    this.renderQuizCompanionAvatar('idle');

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
    let sentenceHtml = q.sentence || '';

    // English Voice Bar visibility & binding
    const isEnglishQuiz = this.quizSubject === 'english' || Boolean(q.englishWord);
    const engVoiceBar = document.getElementById('englishVoiceBar');
    if (engVoiceBar) {
      if (isEnglishQuiz) {
        engVoiceBar.style.display = 'flex';
        const btnVoiceSent = document.getElementById('btnQuizVoiceSentence');
        if (btnVoiceSent) {
          btnVoiceSent.onclick = () => {
            englishVoice.speak(q.sentence || sentenceHtml, btnVoiceSent);
          };
        }
      } else {
        engVoiceBar.style.display = 'none';
      }
    }

    // Runtime guard: 4-choice questions must always use bracket blank format instead of [ A / B ]
    if (q.options && q.options.length >= 4 && /\[\s*[^\]]+\/[^\]]+\]/.test(sentenceHtml)) {
      sentenceHtml = sentenceHtml.replace(/\[\s*[^\]]+\/[^\]]+\]/g, '[ (     ) ]');
    }

    // Runtime guard: Self-heal awkward verb ending collisions if answer word ends in '다' (Prevent double ending collision)
    const ansWord = (q.options && q.options[q.answerIndex !== undefined ? q.answerIndex : 0]) || '';
    if (typeof ansWord === 'string' && ansWord.endsWith('다')) {
      sentenceHtml = sentenceHtml.replace(/\[\s*\(\s*\?*\s*\)\s*\]겠다는/g, "'[ (     ) ]'라는");
      sentenceHtml = sentenceHtml.replace(/\[\s*\(\s*\?*\s*\)\s*\]고\s+/g, "'[ (     ) ]'라며 ");
      sentenceHtml = sentenceHtml.replace(/\[\s*\(\s*\?*\s*\)\s*\]며\s+/g, "'[ (     ) ]'라며 ");
      sentenceHtml = sentenceHtml.replace(/\[\s*\(\s*\?*\s*\)\s*\]은\s+듯/g, "'[ (     ) ]'라는 듯");
      // 명사(체언) 수식 호응 가드: [ ( ? ) ] 결과/일/사람/상황 등 비문 발생 원천 방지
      sentenceHtml = sentenceHtml.replace(/\[\s*\(\s*\?*\s*\)\s*\]\s*(결과|일|사람|경우|상황|판단|선택|생각|모습)/g, "'[ (     ) ]'라는 $1");
    }

    // Runtime guard: Korean postposition (조사) spacing and batchim polish (e.g. "조달청 를 " -> "조달청을 ")
    sentenceHtml = sentenceHtml.replace(/([가-힣])\s+(을|를|이|가|은|는|과|와)([\s,\.!\?])/g, (match, prevChar, josa, nextChar) => {
      const code = prevChar.charCodeAt(0) - 0xAC00;
      if (code < 0 || code > 11171) return match;
      const hasJong = (code % 28) !== 0;
      let correctJosa = josa;
      if (josa === '을' || josa === '를') correctJosa = hasJong ? '을' : '를';
      else if (josa === '이' || josa === '가') correctJosa = hasJong ? '이' : '가';
      else if (josa === '은' || josa === '는') correctJosa = hasJong ? '은' : '는';
      else if (josa === '과' || josa === '와') correctJosa = hasJong ? '과' : '와';
      return prevChar + correctJosa + nextChar;
    });

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
      if (isEnglishQuiz) {
        btn.innerHTML = `
          <div class="opt-left">
            <span>${idx + 1}. ${optText}</span>
            <button type="button" class="opt-speech-mini-btn" title="'${optText}' 발음 듣기" data-word="${optText}">🔊</button>
          </div>
          <span class="opt-icon">✨</span>
        `;
        const miniBtn = btn.querySelector('.opt-speech-mini-btn');
        if (miniBtn) {
          miniBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            englishVoice.speak(optText, miniBtn);
          });
        }
      } else {
        btn.innerHTML = `<span>${idx + 1}. ${optText}</span><span class="opt-icon">✨</span>`;
      }
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
    this.saveActiveQuizSession();
  }

  handleOptionSelect(selectedIndex, clickedBtn) {
    if (this.selectedOption !== null) return; // already answered

    // Synchronously unlock AudioContext & SpeechSynthesis inside user gesture token (Essential for Mobile/iOS)
    sfx.unlockAudio();
    if (typeof englishVoice !== 'undefined') {
      englishVoice.warmup();
    }

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
    this.recordQuestionSolved(q.id, this.quizSubject);

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
      this.renderQuizCompanionAvatar('cheer');
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
      this.renderQuizCompanionAvatar('shock');
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

        // Voice Listeners for English Explanation
        const btnExpVoiceWord = document.getElementById('btnExpVoiceWord');
        if (btnExpVoiceWord) {
          btnExpVoiceWord.onclick = () => englishVoice.speak(q.englishWord || targetWord, btnExpVoiceWord);
        }
        const btnExpVoiceSentence = document.getElementById('btnExpVoiceSentence');
        if (btnExpVoiceSentence) {
          btnExpVoiceSentence.onclick = () => {
            const cleanSent = (document.getElementById('englishFullSentence').textContent || q.sentence || '').trim();
            englishVoice.speak(cleanSent, btnExpVoiceSentence);
          };
        }
        const btnExpVoiceExample = document.getElementById('btnExpVoiceExample');
        if (btnExpVoiceExample) {
          btnExpVoiceExample.onclick = () => {
            const cleanEx = (document.getElementById('englishExampleText').textContent || q.exampleSentence || '').trim();
            englishVoice.speak(cleanEx, btnExpVoiceExample);
          };
        }

        // Auto-play correct answer pronunciation when answered correctly (gentle delay after sfx)
        if (isCorrect) {
          englishVoice.speakAnswer(q.englishWord || targetWord, btnExpVoiceWord);
        }
      } else {
        expEnglishArea.style.display = 'none';
      }
    }

    document.getElementById('btnQuizNext').disabled = false;
    this.renderItemBar();
    this.saveActiveQuizSession();
  }

  handleNextQuestion() {
    if (typeof englishVoice !== 'undefined') {
      englishVoice.stop();
    }
    this.activeItem5050Indices = [];
    this.isHintOpen = false;
    this.currentIndex++;
    if (this.currentIndex < this.activeQuestions.length) {
      this.renderCurrentQuestion();
    } else {
      this.clearActiveQuizSession();
      this.finishQuiz();
    }
  }

  finishQuiz() {
    this.clearActiveQuizSession();
    this.recordQuestionsSolvedBatch((this.activeQuestions || []).map(q => q.id), this.quizSubject);
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

      // 2 consecutive perfect rounds -> +1 shield (Max 2)
      if (this.perfectRoundStreak % 2 === 0) {
        this.shields = Math.min(2, this.shields + 1);
        localStorage.setItem('haru_game_shields', this.shields);
        this.showToastNotice(`🛡️ 2연속 만점 달성! 방패 1개를 획득했습니다! (보유: ${this.shields}/2개)`);
      }

      // 3 consecutive perfect rounds -> +300P bonus
      if (this.perfectRoundStreak % 3 === 0) {
        this.currentScore += 300;
        this.showToastNotice('👑 3연속 만점 마스터! 보너스 +300P를 획득했습니다! 🥳');
      }
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
      if (this.quizSubject === 'idiom') {
        u.todayScoreIdiom = Math.max(u.todayScoreIdiom || 0, this.currentScore);
      } else if (this.quizSubject === 'hanja') {
        u.todayScoreHanja = Math.max(u.todayScoreHanja || 0, this.currentScore);
      } else if (this.quizSubject === 'english') {
        u.todayScoreEnglish = Math.max(u.todayScoreEnglish || 0, this.currentScore);
      } else {
        u.todayScoreSpelling = Math.max(u.todayScoreSpelling || 0, this.currentScore);
      }
    }
    if (this.quizSubject === 'idiom') {
      u.pointsIdiom = (u.pointsIdiom || 0) + pointsEarned;
    } else if (this.quizSubject === 'hanja') {
      u.pointsHanja = (u.pointsHanja || 0) + pointsEarned;
    } else if (this.quizSubject === 'english') {
      u.pointsEnglish = (u.pointsEnglish || 0) + pointsEarned;
    } else {
      u.pointsSpelling = (u.pointsSpelling || 0) + pointsEarned;
    }

    if (isRoundCleared) {
      u.maxRoundToday = Math.max(u.maxRoundToday || 1, this.currentRound);
      if (this.quizSubject === 'idiom') {
        u.maxRoundIdiom = Math.max(u.maxRoundIdiom || 1, this.currentRound);
      } else if (this.quizSubject === 'hanja') {
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
      if (this.quizSubject === 'idiom') {
        me.maxRoundIdiom = u.maxRoundIdiom;
        me.todayScoreIdiom = u.todayScoreIdiom;
        me.pointsIdiom = u.pointsIdiom;
      } else if (this.quizSubject === 'hanja') {
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

    const shieldDecisionBox = document.getElementById('shieldDecisionBox');
    if (shieldDecisionBox) shieldDecisionBox.style.display = 'none';

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
        btnNextRound.disabled = false;
        btnNextRound.textContent = `🎉 ${modePrefix}라운드 ${this.currentRound + 1} (새 5문제) 도전하기 🔥`;
        btnNextRound.onclick = () => {
          btnNextRound.disabled = true;
          this.startNextRound();
        };
      }
      if (resultFailActions) resultFailActions.style.display = 'none';
      if (btnEliminated) btnEliminated.style.display = 'none';
    } else if (isRoundMode) {
      const modePrefix = isLevelDaily ? `[${this.selectedLevel}] ` : '';

      const renderFailureActions = () => {
        if (mistakes >= 3) {
          // Complete Elimination! Drop to Round 1
          document.getElementById('resultTitle').textContent = `💥 ${modePrefix}탈락! (3문제 이상 오답)`;
          document.getElementById('resultSubtitle').textContent = `3문제 이상 틀려 탈락했습니다! 1라운드부터 다시 풀어야 합니다. 힘내서 다시 도전해보세요! 💪`;
          document.getElementById('resultMascot').textContent = '🥺';

          if (btnNextRound) btnNextRound.style.display = 'none';
          if (resultFailActions) resultFailActions.style.display = 'none';
          if (btnEliminated) {
            btnEliminated.style.display = 'block';
            btnEliminated.disabled = false;
            btnEliminated.textContent = `🔁 3문제 이상 탈락! ${modePrefix}1라운드부터 다시 풀기 🔥`;
            btnEliminated.onclick = () => {
              btnEliminated.disabled = true;
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
              btnRevive.disabled = false;
              btnRevive.textContent = `💫 부활 찬스: 보너스 1문제 맞추고 라운드 ${this.currentRound} 유지!`;
              btnRevive.onclick = () => {
                btnRevive.disabled = true;
                this.handleReviveQuiz();
              };
            }
            if (btnFallback) {
              btnFallback.disabled = false;
              btnFallback.textContent = `🔙 전단계 라운드 ${fallbackRound}에서 다시 도전하기`;
              btnFallback.onclick = () => {
                btnFallback.disabled = true;
                if (isLevelDaily) {
                  this.startLevelDailyQuiz(this.selectedLevel, fallbackRound);
                } else {
                  this.startQuiz('daily', fallbackRound);
                }
              };
            }
          }
        }
      };

      // Check if user has shields to defend failure!
      if (this.shields > 0) {
        document.getElementById('resultTitle').textContent = `🛡️ ${modePrefix}라운드 ${this.currentRound} 방패 사용 여부 선택`;
        document.getElementById('resultSubtitle').textContent = `오답(${mistakes}개)이 발생했습니다! 보유 중인 방패를 사용해 다음 라운드로 진출하시겠습니까?`;
        document.getElementById('resultMascot').textContent = '🛡️';

        if (btnNextRound) btnNextRound.style.display = 'none';
        if (resultFailActions) resultFailActions.style.display = 'none';
        if (btnEliminated) btnEliminated.style.display = 'none';

        if (shieldDecisionBox) {
          shieldDecisionBox.style.display = 'block';
          const countEl = document.getElementById('shieldDecisionCount');
          if (countEl) countEl.textContent = this.shields;

          const btnUse = document.getElementById('btnUseShieldDefense');
          const btnDec = document.getElementById('btnDeclineShield');

          if (btnUse) {
            btnUse.disabled = false;
            btnUse.onclick = () => {
              btnUse.disabled = true;
              this.useShield();
              isRoundCleared = true;
              shieldDefended = true;

              // Round clear bonus +50P
              pointsEarned += 50;
              u.totalPoints += 50;
              u.maxRoundToday = Math.max(u.maxRoundToday || 1, this.currentRound);
              if (this.quizSubject === 'idiom') {
                u.maxRoundIdiom = Math.max(u.maxRoundIdiom || 1, this.currentRound);
                u.pointsIdiom = (u.pointsIdiom || 0) + 50;
              } else if (this.quizSubject === 'hanja') {
                u.maxRoundHanja = Math.max(u.maxRoundHanja || 1, this.currentRound);
                u.pointsHanja = (u.pointsHanja || 0) + 50;
              } else if (this.quizSubject === 'english') {
                u.maxRoundEnglish = Math.max(u.maxRoundEnglish || 1, this.currentRound);
                u.pointsEnglish = (u.pointsEnglish || 0) + 50;
              } else {
                u.maxRoundSpelling = Math.max(u.maxRoundSpelling || 1, this.currentRound);
                u.pointsSpelling = (u.pointsSpelling || 0) + 50;
              }

              if (me) {
                me.totalPoints = u.totalPoints;
                me.maxRoundToday = u.maxRoundToday;
                if (this.quizSubject === 'idiom') { me.maxRoundIdiom = u.maxRoundIdiom; me.pointsIdiom = u.pointsIdiom; }
                else if (this.quizSubject === 'hanja') { me.maxRoundHanja = u.maxRoundHanja; me.pointsHanja = u.pointsHanja; }
                else if (this.quizSubject === 'english') { me.maxRoundEnglish = u.maxRoundEnglish; me.pointsEnglish = u.pointsEnglish; }
                else { me.maxRoundSpelling = u.maxRoundSpelling; me.pointsSpelling = u.pointsSpelling; }
              }

              DataManager.save(this.data);
              this.syncToCloud('ROUND_CLEAR', {
                mode: this.quizSubject,
                round: this.currentRound,
                score: this.currentScore,
                pointsEarned,
                maxRoundToday: u.maxRoundToday,
                todayScore: u.todayScore
              });
              this.renderUserProfile();

              shieldDecisionBox.style.display = 'none';
              document.getElementById('resultTitle').textContent = `🛡️ 방패 방어로 ${modePrefix}라운드 ${this.currentRound} 통과!`;
              document.getElementById('resultSubtitle').textContent = `방패를 사용하여 오답을 막고 다음 라운드 진출 자격을 획득했습니다! (남은 방패: ${this.shields}/2개)`;
              document.getElementById('resultMascot').textContent = '🛡️';
              document.getElementById('resultPoints').textContent = `+${pointsEarned}P`;

              if (btnNextRound) {
                btnNextRound.style.display = 'block';
                btnNextRound.disabled = false;
                btnNextRound.textContent = `🎉 ${modePrefix}라운드 ${this.currentRound + 1} (새 5문제) 도전하기 🔥`;
                btnNextRound.onclick = () => {
                  btnNextRound.disabled = true;
                  this.startNextRound();
                };
              }
              this.showToastNotice(`🛡️ 방패를 사용하여 라운드 ${this.currentRound}를 통과했습니다! (남은 방패: ${this.shields}/2개)`);
            };
          }

          if (btnDec) {
            btnDec.disabled = false;
            btnDec.onclick = () => {
              btnDec.disabled = true;
              shieldDecisionBox.style.display = 'none';
              this.showToastNotice(`🏳️ 방패를 아꼈습니다. (보유: ${this.shields}/2개)`);
              renderFailureActions();
            };
          }
        } else {
          renderFailureActions();
        }
      } else {
        renderFailureActions();
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
    if (this._isStartingNextRound) return;
    this._isStartingNextRound = true;
    setTimeout(() => { this._isStartingNextRound = false; }, 600);

    const nextRound = (this.currentRound || 1) + 1;
    if (this.currentMode === 'level_daily') {
      this.startLevelDailyQuiz(this.selectedLevel, nextRound);
    } else {
      this.startQuiz('daily', nextRound);
    }
  }

  fallbackRound() {
    if (this._isStartingNextRound) return;
    this._isStartingNextRound = true;
    setTimeout(() => { this._isStartingNextRound = false; }, 600);

    const prev = Math.max(1, (this.currentRound || 1) - 1);
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
      { key: 'shield', type: 'shield', emoji: '🛡️', name: '수호 방패', desc: '라운드 실패 시 방어하여 통과시켜 주는 방패 획득! (최대 2개)' }
    ];

    const pick = pool[Math.floor(Math.random() * pool.length)];

    if (pick.type === 'shield') {
      this.shields = Math.min(2, (this.shields || 0) + 1);
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
      btn5050.disabled = isAnswered;
      if (badge5050) {
        badge5050.textContent = this.items.eraser5050;
        badge5050.style.background = this.items.eraser5050 <= 0 ? '#ffedd5' : '';
        badge5050.style.color = this.items.eraser5050 <= 0 ? '#c2410c' : '';
      }
    }
    if (btnHeart) {
      btnHeart.disabled = isAnswered;
      if (badgeHeart) {
        badgeHeart.textContent = this.items.heart;
        badgeHeart.style.background = this.items.heart <= 0 ? '#ffedd5' : '';
        badgeHeart.style.color = this.items.heart <= 0 ? '#c2410c' : '';
      }
      if (this.activeItemHeart) btnHeart.classList.add('active');
      else btnHeart.classList.remove('active');
    }
    if (btnDouble) {
      btnDouble.disabled = this.pointMultiplier === 2;
      if (badgeDouble) {
        badgeDouble.textContent = this.items.booster2x;
        badgeDouble.style.background = this.items.booster2x <= 0 ? '#ffedd5' : '';
        badgeDouble.style.color = this.items.booster2x <= 0 ? '#c2410c' : '';
      }
      if (this.pointMultiplier === 2) btnDouble.classList.add('active');
      else btnDouble.classList.remove('active');
    }
    if (btnHint) {
      btnHint.disabled = isAnswered;
      if (badgeHint) {
        badgeHint.textContent = this.items.hint;
        badgeHint.style.background = this.items.hint <= 0 ? '#ffedd5' : '';
        badgeHint.style.color = this.items.hint <= 0 ? '#c2410c' : '';
      }
    }
    if (btnClover) {
      btnClover.disabled = isAnswered;
      if (badgeClover) {
        badgeClover.textContent = this.items.clover;
        badgeClover.style.background = this.items.clover <= 0 ? '#ffedd5' : '';
        badgeClover.style.color = this.items.clover <= 0 ? '#c2410c' : '';
      }
    }
    if (btnTimemachine) {
      btnTimemachine.disabled = !isAnsweredWrong;
      if (badgeTimemachine) {
        badgeTimemachine.textContent = this.items.timemachine;
        badgeTimemachine.style.background = this.items.timemachine <= 0 ? '#ffedd5' : '';
        badgeTimemachine.style.color = this.items.timemachine <= 0 ? '#c2410c' : '';
      }
    }
    if (btnMagnet) {
      btnMagnet.disabled = this.activeItemMagnet;
      if (badgeMagnet) {
        badgeMagnet.textContent = this.items.magnet;
        badgeMagnet.style.background = this.items.magnet <= 0 ? '#ffedd5' : '';
        badgeMagnet.style.color = this.items.magnet <= 0 ? '#c2410c' : '';
      }
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
    if (this.selectedOption !== null) return;
    if (this.items.eraser5050 <= 0) {
      this.promptQuickBuyItem('eraser5050', () => this.useItem5050());
      return;
    }
    const q = this.activeQuestions[this.currentIndex];
    const buttons = document.querySelectorAll('.option-btn');
    const wrongIndices = [];
    q.options.forEach((opt, idx) => {
      if (idx !== q.answerIndex) wrongIndices.push(idx);
    });

    wrongIndices.sort(() => 0.5 - Math.random());
    const toHide = wrongIndices.slice(0, 2);
    this.activeItem5050Indices = toHide;
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
    this.saveActiveQuizSession();
    sfx.correct();
    this.showToastNotice('🪄 50:50 요술봉 뿅! 오답 2개가 사라졌습니다! ✨');
  }

  useItemHeart() {
    if (this.selectedOption !== null) return;
    if (this.items.heart <= 0) {
      this.promptQuickBuyItem('heart', () => this.useItemHeart());
      return;
    }
    this.activeItemHeart = true;
    this.items.heart--;
    localStorage.setItem('haru_item_heart', this.items.heart);
    this.renderItemBar();
    this.saveActiveQuizSession();
    sfx.combo();
    this.showToastNotice('💖 하트 수호 가동! 오답을 선택해도 1회 다시 선택할 수 있습니다.');
  }

  useItemDouble() {
    if (this.pointMultiplier === 2) return;
    if (this.items.booster2x <= 0) {
      this.promptQuickBuyItem('booster2x', () => this.useItemDouble());
      return;
    }
    this.pointMultiplier = 2;
    this.items.booster2x--;
    localStorage.setItem('haru_item_booster', this.items.booster2x);
    this.renderItemBar();
    this.saveActiveQuizSession();
    sfx.fanfare();
    this.showToastNotice('🚀 2배 로켓 부스터 가동! 이번 라운드 획득 포인트가 2배로 적립됩니다!');
  }

  useItemHint() {
    if (this.selectedOption !== null) return;
    if (this.items.hint <= 0) {
      this.promptQuickBuyItem('hint', () => this.useItemHint());
      return;
    }
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
    this.isHintOpen = true;

    this.items.hint--;
    localStorage.setItem('haru_item_hint', this.items.hint);
    this.renderItemBar();
    this.saveActiveQuizSession();
    sfx.correct();
    this.showToastNotice('🔍 돋보기 힌트 오픈! 문제 해결의 실마리를 확인해보세요! ✨');
  }

  useItemClover() {
    if (this.selectedOption !== null) return;
    if (this.items.clover <= 0) {
      this.promptQuickBuyItem('clover', () => this.useItemClover());
      return;
    }
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
    this.saveActiveQuizSession();
  }

  useItemTimemachine() {
    const q = this.activeQuestions[this.currentIndex];
    if (!q || this.selectedOption === null || this.selectedOption === q.answerIndex) return;

    if (this.items.timemachine <= 0) {
      this.promptQuickBuyItem('timemachine', () => this.useItemTimemachine());
      return;
    }

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
    this.saveActiveQuizSession();
    sfx.combo();
    this.showToastNotice('⌛ 타임머신 가동! 방금 오답을 취소하고 시간을 되돌렸습니다. 다시 풀어보세요!');
  }

  useItemMagnet() {
    if (this.activeItemMagnet) return;
    if (this.items.magnet <= 0) {
      this.promptQuickBuyItem('magnet', () => this.useItemMagnet());
      return;
    }
    this.activeItemMagnet = true;
    this.items.magnet--;
    localStorage.setItem('haru_item_magnet', this.items.magnet);
    this.renderItemBar();
    this.saveActiveQuizSession();
    sfx.combo();
    this.showToastNotice('🧲 콤보 자석 가동! 연속 정답 시 콤보 점수를 강력 흡수합니다!');
  }

  // ============================================================
  // Point Shop & Dressing Room Mechanics
  // ============================================================
  promptQuickBuyItem(itemKey, onSuccess = null) {
    const item = ITEM_PRICES[itemKey];
    if (!item) return;

    const userPoints = this.data.currentUser.totalPoints || 0;
    if (userPoints < item.cost) {
      alert(`[${item.emoji} ${item.name}] 아이템을 구매하기 위한 포인트가 부족합니다.\n\n필요 포인트: ${item.cost} P\n현재 보유: ${userPoints} P\n\n문제를 풀어 포인트를 모아보세요! 💪`);
      return;
    }

    const confirmBuy = confirm(`[${item.emoji} ${item.name}] 아이템이 부족합니다!\n보유 포인트 ${item.cost} P로 즉시 구매하여 바로 사용하시겠습니까?\n\n💰 현재 보유: ${userPoints} P ➔ 구매 후: ${userPoints - item.cost} P`);
    if (!confirmBuy) return;

    // Deduct points
    this.data.currentUser.totalPoints -= item.cost;
    this.items[itemKey] = (this.items[itemKey] || 0) + 1;

    const storageKey = {
      eraser5050: 'haru_item_5050',
      heart: 'haru_item_heart',
      booster2x: 'haru_item_booster',
      hint: 'haru_item_hint',
      clover: 'haru_item_clover',
      timemachine: 'haru_item_timemachine',
      magnet: 'haru_item_magnet'
    }[itemKey];
    if (storageKey) {
      localStorage.setItem(storageKey, this.items[itemKey]);
    }
    DataManager.save(this.data);

    this.renderItemBar();
    this.renderUserProfile();
    this.syncUserData();

    sfx.combo();
    this.showToastNotice(`🛍️ [${item.emoji} ${item.name}] 즉시 구매 완료! (${item.cost}P 사용) ✨`);

    if (typeof onSuccess === 'function') {
      setTimeout(() => onSuccess(), 80);
    }
  }

  openShopModal(initialTab = 'items') {
    if (!this.modalShop) return;
    this.previewAccessories = { ...(this.data.currentUser.avatarAccessories || {}) };
    this.switchShopTab(initialTab);
    const ptsEl = document.getElementById('shopUserPoints');
    if (ptsEl) ptsEl.textContent = `${this.data.currentUser.totalPoints || 0} P`;
    this.modalShop.classList.add('active');
    sfx.combo();
  }

  closeShopModal() {
    if (this.modalShop) this.modalShop.classList.remove('active');
    this.previewAccessories = null;
    this.renderUserProfile();
    this.renderItemBar();
  }

  switchShopTab(tab = 'items') {
    const tabItems = document.getElementById('tabShopItems');
    const tabAcc = document.getElementById('tabShopAccessories');
    const areaItems = document.getElementById('shopItemsArea');
    const areaAcc = document.getElementById('shopAccessoriesArea');

    if (tab === 'items') {
      if (tabItems) tabItems.classList.add('active');
      if (tabAcc) tabAcc.classList.remove('active');
      if (areaItems) areaItems.style.display = 'block';
      if (areaAcc) areaAcc.style.display = 'none';
      this.renderShopItems();
    } else {
      if (tabAcc) tabAcc.classList.add('active');
      if (tabItems) tabItems.classList.remove('active');
      if (areaAcc) areaAcc.style.display = 'block';
      if (areaItems) areaItems.style.display = 'none';
      this.renderShopAccessories();
    }
  }

  renderShopItems() {
    const grid = document.getElementById('shopItemsGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const ptsEl = document.getElementById('shopUserPoints');
    if (ptsEl) ptsEl.textContent = `${this.data.currentUser.totalPoints || 0} P`;

    const userPoints = this.data.currentUser.totalPoints || 0;

    Object.values(ITEM_PRICES).forEach(item => {
      const card = document.createElement('div');
      card.className = 'shop-card';

      let ownedText = '';
      let isMax = false;
      if (item.key === 'shield') {
        ownedText = `보유: ${this.shields || 0}/2개`;
        isMax = (this.shields || 0) >= 2;
      } else {
        ownedText = `보유: ${this.items[item.key] || 0}개`;
      }

      card.innerHTML = `
        <div class="shop-card-emoji">${item.emoji}</div>
        <div class="shop-card-name">${item.name}</div>
        <div class="shop-card-desc">${item.desc}</div>
        <div class="shop-card-price">💰 ${item.cost} P</div>
        <div style="font-size: 0.72rem; color: #64748b; margin-bottom: 8px;">${ownedText}</div>
        <button type="button" class="shop-buy-btn ${isMax ? 'disabled' : ''}">${isMax ? '최대 보유' : '구매하기'}</button>
      `;

      const buyBtn = card.querySelector('.shop-buy-btn');
      if (!isMax) {
        buyBtn.addEventListener('click', () => this.buyShopItem(item.key));
      }

      grid.appendChild(card);
    });
  }

  buyShopItem(itemKey) {
    const item = ITEM_PRICES[itemKey];
    if (!item) return;

    if (item.key === 'shield' && (this.shields || 0) >= 2) {
      alert('🛡️ 수호 방패는 최대 2개까지만 보유할 수 있습니다!');
      return;
    }

    const userPoints = this.data.currentUser.totalPoints || 0;
    if (userPoints < item.cost) {
      alert(`포인트가 부족합니다!\n필요 포인트: ${item.cost} P\n현재 보유: ${userPoints} P\n\n문제를 풀어 포인트를 모아보세요! 💪`);
      return;
    }

    this.data.currentUser.totalPoints -= item.cost;
    if (item.key === 'shield') {
      this.shields = Math.min(2, (this.shields || 0) + 1);
      localStorage.setItem('haru_game_shields', this.shields);
    } else {
      this.items[itemKey] = (this.items[itemKey] || 0) + 1;
      const storageKey = {
        eraser5050: 'haru_item_5050',
        heart: 'haru_item_heart',
        booster2x: 'haru_item_booster',
        hint: 'haru_item_hint',
        clover: 'haru_item_clover',
        timemachine: 'haru_item_timemachine',
        magnet: 'haru_item_magnet'
      }[itemKey];
      if (storageKey) localStorage.setItem(storageKey, this.items[itemKey]);
    }

    DataManager.save(this.data);
    this.renderShopItems();
    this.renderUserProfile();
    this.renderItemBar();
    this.renderShieldStatus();
    this.syncUserData();

    sfx.fanfare();
    this.showToastNotice(`🎉 [${item.emoji} ${item.name}] 구매 완료! (${item.cost}P 차감) ✨`);
  }

  renderShopAccessories() {
    const grid = document.getElementById('shopAccGrid');
    if (!grid) return;
    grid.innerHTML = '';

    const ptsEl = document.getElementById('shopUserPoints');
    if (ptsEl) ptsEl.textContent = `${this.data.currentUser.totalPoints || 0} P`;

    // Update Live Virtual Fitting Preview in Shop
    this.renderShopAvatarPreview();

    const cat = this.currentAccCategory || 'pin';
    const list = ACCESSORY_DEFINITIONS[cat] || [];
    const ownedList = this.data.currentUser.inventoryAccessories || [];
    const equipped = this.data.currentUser.avatarAccessories || {};
    const previewId = this.previewAccessories ? this.previewAccessories[cat] : null;

    list.forEach(item => {
      const card = document.createElement('div');
      card.className = 'shop-card';
      card.dataset.itemId = item.id;
      if (item.id === previewId) {
        card.classList.add('is-previewing');
      }

      const isOwned = ownedList.includes(item.id);
      const isEquipped = equipped[cat] === item.id;

      let btnClass = 'shop-buy-btn';
      let btnText = '구매하기';

      if (isEquipped) {
        btnClass += ' unequip';
        btnText = '해제하기';
      } else if (isOwned) {
        btnClass += ' equipped';
        btnText = '착용하기';
      }

      const isMario = item.id.includes('mario') || item.id.includes('luigi') || item.id.includes('toad') || item.id.includes('peach') || item.id.includes('bowser') || item.id.includes('yoshi') || item.id.includes('wario') || item.id.includes('kamek') || item.id.includes('lakitu') || item.id.includes('donkey') || item.id.includes('daisy') || item.id.includes('goomba') || item.id.includes('koopa') || item.id.includes('chain_chomp') || item.id.includes('shyguy') || item.id.includes('boo') || item.id.includes('warp_pipe') || item.id.includes('ghost_house');

      card.innerHTML = `
        ${isMario ? '<div class="mario-badge" style="position: absolute; top: 6px; left: 6px; font-size: 0.68rem; font-weight: 800; background: #fee2e2; color: #dc2626; padding: 2px 6px; border-radius: 9999px; border: 1px solid #fca5a5; z-index: 2;">🍄 마리오</div>' : ''}
        <div class="shop-card-emoji" title="탭하여 실시간 착용 미리보기">${item.emoji}</div>
        <div class="shop-card-name">${item.name}</div>
        <div class="shop-card-desc">${item.desc}</div>
        <div class="shop-card-price">${isOwned ? '✅ 보유 중' : `💰 ${item.cost} P`}</div>
        <div class="shop-card-action-row" style="display: flex; gap: 4px; width: 100%; margin-top: 6px;">
          <button type="button" class="shop-card-preview-btn" style="flex: 1; padding: 6px; font-size: 0.76rem; font-weight: 700; color: #4338ca; background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; cursor: pointer;">
            👁️ 피팅
          </button>
          <button type="button" class="${btnClass}" style="flex: 1.4;">${btnText}</button>
        </div>
      `;

      // Preview button click
      const previewBtn = card.querySelector('.shop-card-preview-btn');
      if (previewBtn) {
        previewBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          this.previewAccessory(cat, item.id);
        });
      }

      // Action button click (buy/equip/unequip)
      const actionBtn = card.querySelector('.shop-buy-btn');
      if (actionBtn) {
        actionBtn.addEventListener('click', (e) => {
          e.stopPropagation();
          if (isEquipped) {
            this.unequipAccessory(cat);
          } else if (isOwned) {
            this.equipAccessory(cat, item.id);
          } else {
            this.buyAccessory(cat, item.id);
          }
        });
      }

      // Clicking card background triggers preview
      card.addEventListener('click', () => {
        this.previewAccessory(cat, item.id);
      });

      grid.appendChild(card);
    });
  }

  renderShopAvatarPreview() {
    const previewEl = document.getElementById('shopAvatarPreview');
    if (!previewEl) return;

    if (!this.previewAccessories) {
      this.previewAccessories = { ...(this.data.currentUser.avatarAccessories || {}) };
    }

    previewEl.innerHTML = renderCompositeAvatar(
      this.data.currentUser.avatar || '🌸',
      this.previewAccessories,
      90,
      false,
      'fullbody'
    );

    const equipped = this.data.currentUser.avatarAccessories || {};
    const preview = this.previewAccessories;
    const isDifferent = Object.keys(ACCESSORY_DEFINITIONS).some(cat => (equipped[cat] || null) !== (preview[cat] || null));

    const statusEl = document.getElementById('shopPreviewStatusText');
    const resetBtn = document.getElementById('btnResetShopPreview');
    const toggleGlassesBtn = document.getElementById('btnToggleGlassesMode');

    if (isDifferent) {
      if (statusEl) {
        statusEl.innerHTML = `<span style="color: #4f46e5; font-weight: 800;">✨ 동물의 숲 2.5등신 가상 피팅 중!</span>`;
      }
      if (resetBtn) resetBtn.style.display = 'inline-flex';
    } else {
      if (statusEl) {
        statusEl.textContent = '동물의 숲 2.5등신 실시간 착용 미리보기';
      }
      if (resetBtn) resetBtn.style.display = 'none';
    }

    if (toggleGlassesBtn) {
      const currentCat = this.currentAccCategory || 'pin';
      const hasGlasses = (this.previewAccessories && this.previewAccessories.glasses) || (currentCat === 'glasses');
      if (hasGlasses) {
        toggleGlassesBtn.style.display = 'inline-flex';
        const currentMode = (this.previewAccessories && this.previewAccessories.glassesMode) || 'eyes';
        toggleGlassesBtn.innerHTML = currentMode === 'eyes'
          ? '🕶️ 머리에 얹기 ⬆️'
          : '👓 눈에 직접 쓰기 ⬇️';
      } else {
        toggleGlassesBtn.style.display = 'none';
      }
    }
  }

  toggleGlassesMode() {
    if (!this.data.currentUser.avatarAccessories) {
      this.data.currentUser.avatarAccessories = {};
    }
    const currentMode = (this.previewAccessories && this.previewAccessories.glassesMode) || this.data.currentUser.avatarAccessories.glassesMode || 'eyes';
    const nextMode = currentMode === 'eyes' ? 'head' : 'eyes';
    this.data.currentUser.avatarAccessories.glassesMode = nextMode;
    if (this.previewAccessories) {
      this.previewAccessories.glassesMode = nextMode;
    }
    DataManager.save(this.data);
    this.renderShopAvatarPreview();
    this.renderUserProfile();
    this.syncUserData();
    sfx.item();
    this.showToastNotice(nextMode === 'head' ? '🕶️ 안경을 머리 위에 얹었습니다!' : '👓 안경을 눈에 직접 착용했습니다!');
  }

  previewAccessory(category, id) {
    if (!this.previewAccessories) {
      this.previewAccessories = { ...(this.data.currentUser.avatarAccessories || {}) };
    }

    if (this.previewAccessories[category] === id) {
      const equipped = this.data.currentUser.avatarAccessories || {};
      this.previewAccessories[category] = equipped[category] || null;
    } else {
      this.previewAccessories[category] = id;
    }

    this.renderShopAvatarPreview();
    this.updateShopCardsPreviewState();
    sfx.correct();
  }

  resetShopPreview() {
    this.previewAccessories = { ...(this.data.currentUser.avatarAccessories || {}) };
    this.renderShopAvatarPreview();
    this.updateShopCardsPreviewState();
    sfx.wrong();
    this.showToastNotice('↩️ 원래 착용한 악세사리로 복원되었습니다.');
  }

  updateShopCardsPreviewState() {
    const cat = this.currentAccCategory || 'pin';
    const previewId = this.previewAccessories ? this.previewAccessories[cat] : null;
    const cards = document.querySelectorAll('#shopAccGrid .shop-card');
    cards.forEach(card => {
      const cardId = card.dataset.itemId;
      if (cardId === previewId) {
        card.classList.add('is-previewing');
      } else {
        card.classList.remove('is-previewing');
      }
    });
  }

  buyAccessory(category, id) {
    const item = findAccessoryById(id);
    if (!item) return;

    const userPoints = this.data.currentUser.totalPoints || 0;
    if (userPoints < item.cost) {
      alert(`포인트가 부족합니다!\n필요 포인트: ${item.cost} P\n현재 보유: ${userPoints} P\n\n문제를 풀어 포인트를 모아보세요! 💪`);
      return;
    }

    const confirmBuy = confirm(`[${item.emoji} ${item.name}] 악세사리를 ${item.cost} P로 구매하시겠습니까?\n\n💰 현재 보유: ${userPoints} P ➔ 구매 후: ${userPoints - item.cost} P`);
    if (!confirmBuy) return;

    this.data.currentUser.totalPoints -= item.cost;
    if (!this.data.currentUser.inventoryAccessories) {
      this.data.currentUser.inventoryAccessories = [];
    }
    this.data.currentUser.inventoryAccessories.push(id);

    // Auto-equip upon purchase
    if (!this.data.currentUser.avatarAccessories) {
      this.data.currentUser.avatarAccessories = {};
    }
    this.data.currentUser.avatarAccessories[category] = id;
    this.previewAccessories = { ...(this.data.currentUser.avatarAccessories) };

    DataManager.save(this.data);
    this.renderShopAccessories();
    this.renderUserProfile();
    this.syncUserData();

    sfx.fanfare();
    if (this.confetti) this.confetti.explode();
    this.showToastNotice(`✨ [${item.emoji} ${item.name}] 구매 및 착용 완료! (${item.cost}P 차감)`);
  }

  equipAccessory(category, id) {
    const item = findAccessoryById(id);
    if (!item) return;

    if (!this.data.currentUser.avatarAccessories) {
      this.data.currentUser.avatarAccessories = {};
    }
    this.data.currentUser.avatarAccessories[category] = id;
    this.previewAccessories = { ...(this.data.currentUser.avatarAccessories) };

    DataManager.save(this.data);
    this.renderShopAccessories();
    this.renderUserProfile();
    this.syncUserData();

    sfx.combo();
    this.showToastNotice(`👗 [${item.emoji} ${item.name}] 착용 완료!`);
  }

  unequipAccessory(category) {
    if (this.data.currentUser.avatarAccessories) {
      this.data.currentUser.avatarAccessories[category] = null;
    }
    this.previewAccessories = { ...(this.data.currentUser.avatarAccessories || {}) };

    DataManager.save(this.data);
    this.renderShopAccessories();
    this.renderUserProfile();
    this.syncUserData();

    sfx.correct();
    this.showToastNotice(`착용을 해제했습니다.`);
  }

  openAvatarZoomModal() {
    if (!this.modalAvatarZoom) return;
    const u = this.data.currentUser;

    const displayEl = document.getElementById('avatarZoomDisplay');
    if (displayEl) {
      displayEl.innerHTML = renderCompositeAvatar(u.avatar || '🌸', u.avatarAccessories || {}, 120, false, 'fullbody');
    }
    const nameEl = document.getElementById('avatarZoomName');
    if (nameEl) nameEl.textContent = u.name;
    const gradeEl = document.getElementById('avatarZoomGrade');
    if (gradeEl) gradeEl.textContent = `${u.grade} · 🔥 ${u.streak || 1}일 연속`;

    const tagListEl = document.getElementById('avatarZoomEquippedList');
    if (tagListEl) {
      tagListEl.innerHTML = '';
      const acc = u.avatarAccessories || {};
      let equippedCount = 0;
      Object.keys(acc).forEach(cat => {
        if (acc[cat]) {
          const item = findAccessoryById(acc[cat]);
          if (item) {
            equippedCount++;
            const span = document.createElement('span');
            span.style.background = '#ede9fe';
            span.style.padding = '3px 8px';
            span.style.borderRadius = '12px';
            span.style.border = '1px solid #ddd6fe';
            span.textContent = `${item.emoji} ${item.name}`;
            tagListEl.appendChild(span);
          }
        }
      });
      if (equippedCount === 0) {
        tagListEl.innerHTML = '<span style="color: var(--text-sub);">착용 중인 악세사리가 없습니다. 상점에서 꾸며보세요! ✨</span>';
      }
    }

    this.modalAvatarZoom.classList.add('active');
    sfx.combo();
  }

  closeAvatarZoomModal() {
    if (this.modalAvatarZoom) this.modalAvatarZoom.classList.remove('active');
  }

  // ============================================================
  // What's New & Update Notice Modal (Version-Aware Dynamic Engine)
  // ============================================================
  async checkWhatsNewPopup() {
    let currentVer = this.APP_VERSION || '2.9.2';
    try {
      if (!this.versionMeta) {
        const res = await fetch('/api/version');
        if (res.ok) {
          this.versionMeta = await res.json();
          if (this.versionMeta && this.versionMeta.version) {
            currentVer = this.versionMeta.version;
          }
        }
      }
    } catch (e) {}

    // Check if user already dismissed THIS specific version
    const dismissedVersion = localStorage.getItem('haru_dismissed_update_version');
    if (dismissedVersion === currentVer) {
      return; // Already dismissed for this exact version
    }

    // Do not pop up if currently in middle of quiz
    if (this.currentViewName && this.currentViewName !== 'home') return;

    this.openWhatsNewModal();
  }

  openWhatsNewModal() {
    if (!this.modalWhatsNew) return;

    const currentVer = (this.versionMeta && this.versionMeta.version) || this.APP_VERSION || '2.9.2';
    const badge = document.getElementById('whatsNewVersionBadge');
    if (badge) badge.textContent = `v${currentVer}`;

    const releaseDesc = document.getElementById('whatsNewReleaseDesc');
    if (releaseDesc && this.versionMeta && this.versionMeta.releaseNotes) {
      releaseDesc.textContent = this.versionMeta.releaseNotes;
    }

    this.modalWhatsNew.classList.add('active');
    if (typeof sfx !== 'undefined' && sfx.combo) sfx.combo();
  }

  closeWhatsNewModal() {
    if (this.modalWhatsNew) {
      this.modalWhatsNew.classList.remove('active');
    }
  }

  dismissWhatsNewForever() {
    const currentVer = (this.versionMeta && this.versionMeta.version) || this.APP_VERSION || '2.9.2';
    try {
      // Store the specific version that the user dismissed!
      localStorage.setItem('haru_dismissed_update_version', currentVer);
    } catch (e) {}
    this.closeWhatsNewModal();
    this.showToastNotice(`📢 v${currentVer} 업데이트 알림을 더 이상 표시하지 않습니다.`);
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
    this.saveActiveQuizSession();
  }

  openGameGuideModal() {
    if (this.modalGameGuide) this.modalGameGuide.classList.add('active');
  }

  closeGameGuideModal() {
    if (this.modalGameGuide) this.modalGameGuide.classList.remove('active');
  }

  // ============================================================
  // Active Quiz Session Auto-Save & Mobile Resume (App Switch / KakaoTalk)
  // ============================================================
  saveActiveQuizSession() {
    if (this.currentViewName !== 'quiz' || !this.activeQuestions || this.activeQuestions.length === 0) {
      return;
    }
    const session = {
      date: getKSTDateString(),
      quizSubject: this.quizSubject || 'spelling',
      currentMode: this.currentMode || 'daily',
      selectedLevel: this.selectedLevel || null,
      currentRound: this.currentRound || 1,
      currentIndex: this.currentIndex || 0,
      roundCorrectCount: this.roundCorrectCount || 0,
      currentScore: this.currentScore || 0,
      combo: this.combo || 0,
      maxCombo: this.maxCombo || 0,
      selectedOption: this.selectedOption !== undefined ? this.selectedOption : null,
      luckyBoxDroppedThisRound: !!this.luckyBoxDroppedThisRound,
      activeItemHeart: !!this.activeItemHeart,
      pointMultiplier: this.pointMultiplier || 1,
      activeItemMagnet: !!this.activeItemMagnet,
      activeItem5050Indices: this.activeItem5050Indices || [],
      isHintOpen: !!this.isHintOpen,
      isReviveQuiz: !!this.isReviveQuiz,
      reviveMode: this.reviveMode || null,
      reviveLevel: this.reviveLevel || null,
      activeQuestions: this.activeQuestions,
      savedAt: Date.now()
    };
    try {
      localStorage.setItem('haru_active_quiz_session', JSON.stringify(session));
    } catch (e) {
      console.warn('[Session] Failed to auto-save active quiz session', e);
    }
  }

  clearActiveQuizSession() {
    try {
      localStorage.removeItem('haru_active_quiz_session');
    } catch (e) {}
    const resumeBanner = document.getElementById('resumeQuizBanner');
    if (resumeBanner) resumeBanner.style.display = 'none';
  }

  restoreActiveQuizSession() {
    try {
      const raw = localStorage.getItem('haru_active_quiz_session');
      if (!raw) return false;
      const session = JSON.parse(raw);
      const today = getKSTDateString();

      // Check date validity (expire on midnight date transition)
      if (session.date !== today) {
        this.clearActiveQuizSession();
        return false;
      }

      if (!session.activeQuestions || !Array.isArray(session.activeQuestions) || session.activeQuestions.length === 0) {
        this.clearActiveQuizSession();
        return false;
      }

      // Restore session properties
      this.quizSubject = session.quizSubject || 'spelling';
      this.currentMode = session.currentMode || 'daily';
      this.selectedLevel = session.selectedLevel || null;
      this.currentRound = session.currentRound || 1;
      this.currentIndex = session.currentIndex || 0;
      this.roundCorrectCount = session.roundCorrectCount || 0;
      this.currentScore = session.currentScore || 0;
      this.combo = session.combo || 0;
      this.maxCombo = session.maxCombo || 0;
      this.selectedOption = session.selectedOption !== undefined ? session.selectedOption : null;
      this.luckyBoxDroppedThisRound = !!session.luckyBoxDroppedThisRound;
      this.activeItemHeart = !!session.activeItemHeart;
      this.pointMultiplier = session.pointMultiplier || 1;
      this.activeItemMagnet = !!session.activeItemMagnet;
      this.activeItem5050Indices = session.activeItem5050Indices || [];
      this.isHintOpen = !!session.isHintOpen;
      this.isReviveQuiz = !!session.isReviveQuiz;
      this.reviveMode = session.reviveMode || null;
      this.reviveLevel = session.reviveLevel || null;
      this.activeQuestions = session.activeQuestions;

      // Apply subject theme & mode
      this.setQuizSubject(this.quizSubject);

      // Switch to quiz view
      this.switchView('quiz');

      // Update round badge text
      const roundBadge = document.getElementById('quizRoundBadge');
      if (roundBadge) {
        if (this.isReviveQuiz) {
          const levelPrefix = (this.reviveMode === 'level_daily' && this.reviveLevel) ? `${this.reviveLevel} ` : '';
          roundBadge.textContent = `💫 ${levelPrefix}부활 퀴즈 (1문제)`;
        } else if (this.currentMode === 'level_daily') {
          roundBadge.textContent = `🎯 ${this.selectedLevel} · 라운드 ${this.currentRound}`;
        } else {
          roundBadge.textContent = `라운드 ${this.currentRound}`;
        }
        roundBadge.style.display = 'inline-block';
      }

      // Render current question
      this.renderCurrentQuestion();

      // If 50:50 wand was used on this question, re-apply erased styles
      if (this.activeItem5050Indices && this.activeItem5050Indices.length > 0) {
        const buttons = document.querySelectorAll('.option-btn');
        this.activeItem5050Indices.forEach(idx => {
          if (buttons[idx]) {
            buttons[idx].classList.add('erased');
            const q = this.activeQuestions[this.currentIndex];
            if (q && q.options && q.options[idx]) {
              buttons[idx].innerHTML = `
                <span style="text-decoration: line-through; opacity: 0.4;">${idx + 1}. ${q.options[idx]}</span>
                <span class="opt-icon" style="font-size: 0.8rem; color: #94a3b8;">💨 뿅! 지워짐</span>
              `;
            }
          }
        });
      }

      // If hint box was opened, re-display hint box
      if (this.isHintOpen) {
        const hintBox = document.getElementById('quizHintBox');
        const hintText = document.getElementById('quizHintText');
        const q = this.activeQuestions[this.currentIndex];
        if (hintBox && hintText && q) {
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
        }
      }

      // If question was already answered before app switch, re-apply answered UI state
      if (this.selectedOption !== null && this.selectedOption !== undefined) {
        this.restoreAnsweredQuestionState(this.selectedOption);
      }

      const modeTitle = this.currentMode === 'level_daily' ? `[${this.selectedLevel}] ` : '';
      this.showToastNotice(`🌸 진행 중이던 ${modeTitle}라운드 ${this.currentRound} (Q${this.currentIndex + 1})를 이어서 진행합니다!`);
      return true;
    } catch (e) {
      console.error('[Session] Error restoring quiz session:', e);
      this.clearActiveQuizSession();
      return false;
    }
  }

  restoreAnsweredQuestionState(selectedIndex) {
    const q = this.activeQuestions[this.currentIndex];
    if (!q) return;
    const isCorrect = selectedIndex === q.answerIndex;
    const allButtons = document.querySelectorAll('.option-btn');
    allButtons.forEach((b, i) => {
      b.disabled = true;
      if (i === q.answerIndex) {
        b.classList.add('correct');
        const icon = b.querySelector('.opt-icon');
        if (icon) icon.textContent = '⭕ 정답!';
      } else if (i === selectedIndex && !isCorrect) {
        b.classList.add('wrong');
        const icon = b.querySelector('.opt-icon');
        if (icon) icon.textContent = '❌ 오답';
      }
    });

    const expCard = document.getElementById('quizExplanation');
    if (expCard) expCard.classList.add('active');
    const expText = document.getElementById('expText');
    if (expText) expText.textContent = q.explanation;
    const expRule = document.getElementById('expRule');
    if (expRule) expRule.textContent = `규정/출전: ${q.rule || q.category}`;

    const targetWord = q.standardWord || q.hanjaWord || q.englishWord || q.options[q.answerIndex];
    const blankEl = document.querySelector('.quiz-blank');
    if (blankEl) {
      blankEl.textContent = ` ${targetWord} `;
      blankEl.classList.add('answered');
    }

    const nextBtn = document.getElementById('btnQuizNext');
    if (nextBtn) {
      nextBtn.disabled = false;
      const total = this.activeQuestions.length;
      nextBtn.textContent = (this.currentIndex === total - 1) ? '결과 확인하기 🎉' : '다음 문제로 ✨';
    }
  }

  updateResumeQuizBanner() {
    const banner = document.getElementById('resumeQuizBanner');
    if (!banner) return;
    try {
      const raw = localStorage.getItem('haru_active_quiz_session');
      if (!raw) {
        banner.style.display = 'none';
        return;
      }
      const session = JSON.parse(raw);
      if (session.date !== getKSTDateString() || !session.activeQuestions || session.activeQuestions.length === 0) {
        banner.style.display = 'none';
        return;
      }
      const titleEl = document.getElementById('resumeBannerTitle');
      const descEl = document.getElementById('resumeBannerDesc');
      const modeLabel = session.currentMode === 'level_daily' ? `[${session.selectedLevel}] ` : '';
      if (titleEl) titleEl.textContent = `진행 중인 ${modeLabel}라운드 ${session.currentRound} 퀴즈 (Q${(session.currentIndex || 0) + 1})`;
      if (descEl) descEl.textContent = '카카오톡 확인 등 다른 앱을 보셨나요? 풀던 문제를 바로 이어서 계속할 수 있어요.';
      banner.style.display = 'flex';
    } catch (e) {
      banner.style.display = 'none';
    }
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
        <div class="rank-avatar">${renderCompositeAvatar(user.avatar || '🌸', user.avatarAccessories || {}, 36)}</div>
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
      if (u.solvedQuestionMap && typeof u.solvedQuestionMap === 'object') {
        this.data.currentUser.solvedQuestionMap = u.solvedQuestionMap;
        for (const sub of ['spelling', 'idiom', 'hanja', 'english']) {
          if (Array.isArray(u.solvedQuestionMap[sub])) {
            try {
              localStorage.setItem(`haru_solved_${sub}_ids`, JSON.stringify(u.solvedQuestionMap[sub]));
            } catch (e) {}
          }
        }
      }

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

  isServerVersionNewer(serverVer, clientVer) {
    if (!serverVer || !clientVer) return false;
    const sClean = String(serverVer).replace(/^v/i, '').trim();
    const cClean = String(clientVer).replace(/^v/i, '').trim();
    if (sClean === cClean) return false;

    const sParts = sClean.split('.').map(n => parseInt(n, 10) || 0);
    const cParts = cClean.split('.').map(n => parseInt(n, 10) || 0);
    const maxLen = Math.max(sParts.length, cParts.length);

    for (let i = 0; i < maxLen; i++) {
      const s = sParts[i] || 0;
      const c = cParts[i] || 0;
      if (s > c) return true;
      if (s < c) return false;
    }
    return false;
  }

  async checkAppVersionUpdate(force = false) {
    if (this.isCheckingVersion) return;
    const now = Date.now();
    if (!force && (now - this.lastVersionCheckTime < 15000)) return;

    this.isCheckingVersion = true;
    this.lastVersionCheckTime = now;

    try {
      const res = await fetch('/api/version?_t=' + now, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      if (!res.ok) return;

      const data = await res.json();
      if (!data || !data.version) return;

      const serverVersion = data.version;
      const clientVersion = this.APP_VERSION || '2.9.2';

      if (this.isServerVersionNewer(serverVersion, clientVersion)) {
        console.log(`[Haru Matchum] New version detected! Server: v${serverVersion}, Client: v${clientVersion}`);

        // Loop guard: prevent infinite reload if browser cache repeatedly serves stale bundle
        const guardKey = 'haru_auto_reload_to_' + serverVersion;
        const lastReloadAttempt = parseInt(sessionStorage.getItem(guardKey) || '0', 10);
        if (now - lastReloadAttempt < 60000) {
          console.warn('[Haru Matchum] Auto-reload already attempted recently for v' + serverVersion + ', skipping loop.');
          return;
        }
        sessionStorage.setItem(guardKey, String(now));

        // Save active quiz session to avoid data loss
        if (this.currentViewName === 'quiz' || (this.activeQuestions && this.activeQuestions.length > 0)) {
          this.saveActiveQuizSession();
        }

        this.showToastNotice(`🚀 새 버전(v${serverVersion})으로 업데이트되었습니다. 최신 화면으로 새로고침합니다...`);

        setTimeout(() => {
          this.forcePageReload();
        }, 800);
      }
    } catch (err) {
      console.warn('[Haru Matchum] Version check failed (offline or network error):', err.message);
    } finally {
      this.isCheckingVersion = false;
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
if (typeof document !== 'undefined' && document.addEventListener) {
  document.addEventListener('DOMContentLoaded', () => {
    window.app = new HaruMatchumApp();
  });
}

if (typeof module !== 'undefined' && module.exports) {
  module.exports = { HaruMatchumApp, EnglishSpeechEngine, englishVoice };
}

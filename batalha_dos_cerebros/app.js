/**
 * ========================================================
 * BATALHA DOS CÉREBROS — HUMANO VS. IA 🧠
 * Motor de Jogo Web Moderno com Canvas Neural, Áudio Harmônico e Efeitos
 * ========================================================
 */

// ========================================================
// 1. ANIMAÇÃO DE FUNDO: REDE NEURAL EM CANVAS
// ========================================================
class NeuralCanvas {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.nodes = [];
    this.nodeCount = 45;
    this.maxDist = 130;
    this.mouse = { x: -1000, y: -1000 };

    this.resize();
    this.initNodes();
    this.bindEvents();
    this.animate();
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  initNodes() {
    this.nodes = [];
    for (let i = 0; i < this.nodeCount; i++) {
      this.nodes.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2 + 1.5,
        color: Math.random() > 0.4 ? 'rgba(0, 245, 160, ' : 'rgba(139, 92, 246, '
      });
    }
  }

  bindEvents() {
    window.addEventListener('resize', () => {
      this.resize();
      this.initNodes();
    });
    window.addEventListener('mousemove', (e) => {
      this.mouse.x = e.clientX;
      this.mouse.y = e.clientY;
    });
  }

  animate() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    // Atualiza e desenha conexões sinápticas
    for (let i = 0; i < this.nodes.length; i++) {
      const a = this.nodes[i];
      a.x += a.vx;
      a.y += a.vy;

      if (a.x < 0 || a.x > this.width) a.vx *= -1;
      if (a.y < 0 || a.y > this.height) a.vy *= -1;

      // Conexão com o cursor do mouse
      const dxM = a.x - this.mouse.x;
      const dyM = a.y - this.mouse.y;
      const distM = Math.sqrt(dxM * dxM + dyM * dyM);
      if (distM < 160) {
        this.ctx.strokeStyle = `rgba(0, 245, 160, ${0.4 * (1 - distM / 160)})`;
        this.ctx.lineWidth = 1;
        this.ctx.beginPath();
        this.ctx.moveTo(a.x, a.y);
        this.ctx.lineTo(this.mouse.x, this.mouse.y);
        this.ctx.stroke();
      }

      // Conexões entre nós
      for (let j = i + 1; j < this.nodes.length; j++) {
        const b = this.nodes[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (dist < this.maxDist) {
          const alpha = (1 - dist / this.maxDist) * 0.22;
          this.ctx.strokeStyle = `rgba(255, 255, 255, ${alpha})`;
          this.ctx.lineWidth = 0.8;
          this.ctx.beginPath();
          this.ctx.moveTo(a.x, a.y);
          this.ctx.lineTo(b.x, b.y);
          this.ctx.stroke();
        }
      }

      // Desenha o nó
      this.ctx.fillStyle = a.color + '0.7)';
      this.ctx.beginPath();
      this.ctx.arc(a.x, a.y, a.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }

    requestAnimationFrame(() => this.animate());
  }
}

// ========================================================
// 2. SISTEMA DE CONFETES EM CANVAS (VITÓRIA HUMANA)
// ========================================================
class ConfettiCannon {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.colors = ['#00f5a0', '#00d9f5', '#8b5cf6', '#ec4899', '#fbbf24'];

    this.resize();
    window.addEventListener('resize', () => this.resize());
    this.loop();
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  fire(count = 90) {
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.canvas.width / 2,
        y: this.canvas.height / 2 + 80,
        vx: (Math.random() - 0.5) * 18,
        vy: -Math.random() * 16 - 6,
        size: Math.random() * 8 + 5,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        gravity: 0.45,
        life: 1.0,
        decay: Math.random() * 0.015 + 0.008
      });
    }
  }

  loop() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.rotation += p.rotationSpeed;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.life;
      this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
      this.ctx.restore();
    }

    requestAnimationFrame(() => this.loop());
  }
}

// ========================================================
// 3. SINTETIZADOR DE ÁUDIO SUAVE E HARMÔNICO (WEB AUDIO API)
// ========================================================
class HarmonicAudio {
  constructor() {
    this.ctx = null;
    this.enabled = true;
    // Escala Pentatônica de Dó (notas relaxantes e sonoras)
    this.pentatonic = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playChime(freq, duration = 0.25, type = 'sine') {
    if (!this.enabled) return;
    this.init();
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      // Envelope ADSR suave (sem estalos metálicos)
      gain.gain.setValueAtTime(0.0001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.2, this.ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {}
  }

  correct() {
    this.playChime(523.25, 0.2, 'sine');
    setTimeout(() => this.playChime(659.25, 0.35, 'triangle'), 90);
  }

  wrong() {
    this.playChime(220, 0.22, 'sawtooth');
    setTimeout(() => this.playChime(196, 0.28, 'sawtooth'), 100);
  }

  padNote(padIndex) {
    const f = this.pentatonic[padIndex % this.pentatonic.length];
    this.playChime(f, 0.3, 'sine');
  }

  tick() {
    this.playChime(780, 0.04, 'sine');
  }

  victory() {
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((f, i) => {
      setTimeout(() => this.playChime(f, 0.35, 'triangle'), i * 130);
    });
  }

  defeat() {
    const notes = [392, 349.23, 311.13, 261.63];
    notes.forEach((f, i) => {
      setTimeout(() => this.playChime(f, 0.28, 'sawtooth'), i * 140);
    });
  }
}

const audio = new HarmonicAudio();

// ========================================================
// 4. SISTEMA DE RANKING (LOCALSTORAGE PERSISTENTE)
// ========================================================
const STORAGE_KEY = 'batalha_cerebros_ranking_premium_v2';

class LeaderboardManager {
  static getList() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
      const demoData = [
        { name: "Prof. Marcos", course: "Coordenação TI", score: 2950, diff: "Rede Deep Learning", outcome: "WIN" },
        { name: "Camila R.", course: "Eng. de Software", score: 2780, diff: "Super I.A. Quântica", outcome: "WIN" },
        { name: "Gabriel S.", course: "Ciência da Comp.", score: 2540, diff: "Rede Deep Learning", outcome: "WIN" },
        { name: "Beatriz L.", course: "Sist. de Informação", score: 2280, diff: "Calouro Neural", outcome: "WIN" },
        { name: "Lucas M.", course: "Engenharia Civil", score: 1980, diff: "Rede Deep Learning", outcome: "LOSS" }
      ];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(demoData));
      return demoData;
    }
    try {
      return JSON.parse(stored);
    } catch (e) {
      return [];
    }
  }

  static saveEntry(entry) {
    const list = this.getList();
    list.push(entry);
    list.sort((a, b) => b.score - a.score);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  static clear() {
    localStorage.removeItem(STORAGE_KEY);
  }
}

// ========================================================
// 5. ESTADO GLOBAL DA PARTIDA
// ========================================================
const GameState = {
  player: {
    name: "Visitante",
    course: "Visitante",
    difficulty: "MEDIUM"
  },
  scores: {
    human: 0,
    ai: 0,
    combo: 0,
    logicSuccess: 0,
    logicTotal: 0,
    memoryLevel: 5,
    reactionTimes: []
  },
  round: 1, // 1: Lógica, 2: Memória, 3: Velocidade
  timer: null,
  timeLeft: 15,
  aiTimeout: null,

  // Sub-estados
  logic: {
    index: 0,
    total: 4,
    answer: null
  },
  memory: {
    sequence: [],
    inputIndex: 0,
    length: 5,
    canClick: false
  },
  speed: {
    index: 0,
    total: 5,
    targetColor: null,
    startedAt: 0
  }
};

const AI_PHRASES = [
  "Avaliando vetores de pesos neurais...",
  "Calculando inferência bayesiana em 12ms...",
  "Convergência de gradiente atingida: 96.4%...",
  "Otimizando sinapses quânticas artificiais...",
  "Mapeando heurísticas de tempo de reação..."
];

// ========================================================
// 6. REFERÊNCIAS À DOM
// ========================================================
const screens = {
  welcome: document.getElementById('screen-welcome'),
  battle: document.getElementById('screen-battle'),
  result: document.getElementById('screen-result'),
  ranking: document.getElementById('screen-ranking')
};

const hud = {
  humanName: document.getElementById('hud-human-name'),
  humanScore: document.getElementById('hud-human-score'),
  aiScore: document.getElementById('hud-ai-score'),
  comboBadge: document.getElementById('hud-combo-badge'),
  roundPill: document.getElementById('hud-round-pill'),
  roundTitle: document.getElementById('hud-round-title'),
  timerDigits: document.getElementById('hud-timer'),
  aiStatusText: document.getElementById('hud-ai-status-text'),
  dominancePct: document.getElementById('hud-dominance-pct'),
  tugHuman: document.getElementById('hud-tug-human'),
  telemetry: document.getElementById('ai-telemetry-text')
};

function goToScreen(screenKey) {
  Object.values(screens).forEach(s => s.classList.remove('active'));
  if (screens[screenKey]) {
    screens[screenKey].classList.add('active');
  }
  audio.tick();
}

function refreshHUD() {
  hud.humanScore.innerHTML = `${GameState.scores.human.toLocaleString()} <small>PTS</small>`;
  hud.aiScore.innerHTML = `${GameState.scores.ai.toLocaleString()} <small>PTS</small>`;

  // Combo Badge
  if (GameState.scores.combo >= 2) {
    hud.comboBadge.textContent = `Combo ${GameState.scores.combo}x! 🔥`;
    hud.comboBadge.style.display = 'block';
  } else {
    hud.comboBadge.style.display = 'none';
  }

  // Barra de Domínio (Tug-of-war)
  const total = GameState.scores.human + GameState.scores.ai;
  let pct = 50;
  if (total > 0) {
    pct = Math.round(Math.min(92, Math.max(8, (GameState.scores.human / total) * 100)));
  }
  hud.tugHuman.style.width = `${pct}%`;
  hud.dominancePct.textContent = `${pct}% Humano vs ${100 - pct}% IA`;

  // Telemetria da IA
  hud.telemetry.textContent = AI_PHRASES[Math.floor(Math.random() * AI_PHRASES.length)];
}

// ========================================================
// 7. RODADA 1: RACIOCÍNIO LÓGICO & MATEMÁTICA AVANÇADA
// ========================================================
function startLogicRound() {
  GameState.round = 1;
  GameState.logic.index = 0;
  GameState.logic.total = 4;
  GameState.scores.combo = 0;

  hud.roundPill.querySelector('.round-num').textContent = "ETAPA 1/3";
  hud.roundTitle.textContent = "RACIOCÍNIO LÓGICO AVANÇADO";

  document.getElementById('game-logic').classList.remove('hidden');
  document.getElementById('game-memory').classList.add('hidden');
  document.getElementById('game-speed').classList.add('hidden');

  loadNextLogicQuestion();
}

function generateMathChallenge() {
  const modes = ['PRECEDENCE', 'NONLINEAR_SEQ', 'PERCENTAGE', 'EXPONENT', 'ALGEBRA'];
  const mode = modes[Math.floor(Math.random() * modes.length)];
  let equation = "";
  let answer = 0;

  if (mode === 'PRECEDENCE') {
    const subType = Math.floor(Math.random() * 3);
    if (subType === 0) {
      // (a * b) - c
      const a = Math.floor(Math.random() * 8) + 12; // 12 a 19
      const b = Math.floor(Math.random() * 5) + 4;  // 4 a 8
      const c = Math.floor(Math.random() * 25) + 15; // 15 a 39
      equation = `(${a} × ${b}) - ${c} = ?`;
      answer = (a * b) - c;
    } else if (subType === 1) {
      // (a + b) * c
      const a = Math.floor(Math.random() * 15) + 8;
      const b = Math.floor(Math.random() * 12) + 6;
      const c = Math.floor(Math.random() * 5) + 4;
      equation = `(${a} + ${b}) × ${c} = ?`;
      answer = (a + b) * c;
    } else {
      // (a / b) + (c * d)
      const b = Math.floor(Math.random() * 4) + 3; // 3 a 6
      const mult = Math.floor(Math.random() * 10) + 12;
      const a = b * mult;
      const c = Math.floor(Math.random() * 6) + 4;
      const d = Math.floor(Math.random() * 5) + 3;
      equation = `(${a} ÷ ${b}) + (${c} × ${d}) = ?`;
      answer = mult + (c * d);
    }
  } else if (mode === 'NONLINEAR_SEQ') {
    const seqType = Math.floor(Math.random() * 4);
    if (seqType === 0) {
      // Diferenças crescentes (+3, +5, +7, +9, +11)
      const start = Math.floor(Math.random() * 5) + 2;
      const seq = [start, start + 3, start + 8, start + 15, start + 24];
      equation = `${seq.join(', ')}, ?`;
      answer = start + 35;
    } else if (seqType === 1) {
      // Sequência Alternada (*2, -3)
      const s = Math.floor(Math.random() * 4) + 3;
      const s1 = s * 2;
      const s2 = s1 - 3;
      const s3 = s2 * 2;
      const s4 = s3 - 3;
      const s5 = s4 * 2;
      equation = `${s}, ${s1}, ${s2}, ${s3}, ${s4}, ${s5}, ?`;
      answer = s5 - 3;
    } else if (seqType === 2) {
      // Quadrados Perfeitos
      const base = Math.floor(Math.random() * 4) + 3; // ex: 3, 4, 5, 6
      const seq = [base * base, (base + 1) * (base + 1), (base + 2) * (base + 2), (base + 3) * (base + 3)];
      equation = `${seq.join(', ')}, ?`;
      answer = (base + 4) * (base + 4);
    } else {
      // Potências de 2 ou 3
      const base = 2;
      const startExp = Math.floor(Math.random() * 3) + 2; // 2^2, 2^3, 2^4, 2^5
      const seq = [Math.pow(base, startExp), Math.pow(base, startExp + 1), Math.pow(base, startExp + 2), Math.pow(base, startExp + 3)];
      equation = `${seq.join(', ')}, ?`;
      answer = Math.pow(base, startExp + 4);
    }
  } else if (mode === 'PERCENTAGE') {
    const pcts = [15, 25, 35, 45, 60, 75];
    const p = pcts[Math.floor(Math.random() * pcts.length)];
    const base = (Math.floor(Math.random() * 8) + 2) * 100; // 200, 300, 400...
    equation = `${p}% de ${base} = ?`;
    answer = Math.round((p / 100) * base);
  } else if (mode === 'EXPONENT') {
    const sub = Math.floor(Math.random() * 3);
    if (sub === 0) {
      const p = Math.floor(Math.random() * 20) + 15;
      equation = `2⁶ - ${p} = ?`;
      answer = 64 - p;
    } else if (sub === 1) {
      const p = Math.floor(Math.random() * 25) + 12;
      equation = `3⁴ + ${p} = ?`;
      answer = 81 + p;
    } else {
      const base = Math.floor(Math.random() * 4) + 11; // 11 a 14
      const p = Math.floor(Math.random() * 30) + 20;
      equation = `${base}² - ${p} = ?`;
      answer = (base * base) - p;
    }
  } else {
    // ALGEBRA
    const a = Math.floor(Math.random() * 4) + 3; // 3 a 6
    const x = Math.floor(Math.random() * 9) + 8; // 8 a 16
    const b = Math.floor(Math.random() * 18) + 10;
    const result = a * x - b;
    equation = `${a}x - ${b} = ${result}  ➔  x = ?`;
    answer = x;
  }

  const choices = new Set([answer]);
  while (choices.size < 4) {
    const offset = (Math.floor(Math.random() * 12) + 2) * (Math.random() > 0.5 ? 1 : -1);
    const fake = answer + offset;
    if (fake > 0 && fake !== answer) choices.add(fake);
  }

  return {
    equation,
    answer,
    choices: Array.from(choices).sort(() => Math.random() - 0.5)
  };
}

function loadNextLogicQuestion() {
  if (GameState.logic.index >= GameState.logic.total) {
    startMemoryRound();
    return;
  }

  GameState.logic.index++;
  const challenge = generateMathChallenge();
  GameState.logic.answer = challenge.answer;

  document.getElementById('logic-equation-display').textContent = challenge.equation;
  const grid = document.getElementById('logic-answers-grid');
  grid.innerHTML = '';

  challenge.choices.forEach(val => {
    const btn = document.createElement('button');
    btn.className = 'btn-choice';
    btn.textContent = val;
    btn.onclick = () => onLogicAnswerSelected(val, btn);
    grid.appendChild(btn);
  });

  // Cronômetro mais tenso: 9 segundos!
  runTimer(9, () => onLogicAnswerSelected(null, null));

  // Simulação da resposta da IA Ultra-Rápida
  triggerAISimulation(challenge.answer, (aiWon, elapsedMs) => {
    if (aiWon) {
      GameState.scores.ai += 280;
      hud.aiStatusText.textContent = `I.A. respondeu em ${elapsedMs}ms (+280 pts)`;
    }
    refreshHUD();
  });
}

function onLogicAnswerSelected(val, btnEl) {
  clearInterval(GameState.timer);
  clearTimeout(GameState.aiTimeout);

  GameState.scores.logicTotal++;

  const isCorrect = val === GameState.logic.answer;
  if (isCorrect) {
    audio.correct();
    GameState.scores.logicSuccess++;
    GameState.scores.combo++;
    if (btnEl) btnEl.classList.add('correct');

    const comboMult = Math.min(2.5, 1 + GameState.scores.combo * 0.25);
    const timeBonus = GameState.timeLeft * 25;
    GameState.scores.human += Math.round((300 + timeBonus) * comboMult);
  } else {
    audio.wrong();
    GameState.scores.combo = 0;
    if (btnEl) btnEl.classList.add('wrong');
  }

  refreshHUD();
  setTimeout(loadNextLogicQuestion, 850);
}

// ========================================================
// 8. RODADA 2: MEMÓRIA RELÂMPAGO AVANÇADA (SEQUÊNCIA NEURAL)
// ========================================================
function startMemoryRound() {
  GameState.round = 2;
  hud.roundPill.querySelector('.round-num').textContent = "ETAPA 2/3";
  hud.roundTitle.textContent = "MEMÓRIA FOTOGRÁFICA";

  document.getElementById('game-logic').classList.add('hidden');
  document.getElementById('game-memory').classList.remove('hidden');
  document.getElementById('game-speed').classList.add('hidden');

  initMemoryPads();
  // Começa com 5 sinapses (maior desafio!)
  playMemorySequence(5);
}

function initMemoryPads() {
  const pads = document.querySelectorAll('.pad-node');
  pads.forEach(pad => {
    pad.onclick = () => {
      if (!GameState.memory.canClick) return;
      const idx = parseInt(pad.getAttribute('data-index'));
      onPlayerPadClick(idx, pad);
    };
  });
}

function playMemorySequence(seqLength) {
  GameState.memory.length = seqLength;
  GameState.memory.sequence = [];
  GameState.memory.inputIndex = 0;
  GameState.memory.canClick = false;

  for (let i = 0; i < seqLength; i++) {
    GameState.memory.sequence.push(Math.floor(Math.random() * 9));
  }

  const instruction = document.getElementById('memory-instruction');
  instruction.innerHTML = `Memorize a sequência rápida de <strong>${seqLength} sinapses</strong>...`;
  instruction.style.color = "var(--accent-gold)";

  renderProgressDots(seqLength, 0);

  // Reprodução mais veloz e dinâmica (380ms)
  let delay = 450;
  GameState.memory.sequence.forEach((nodeIdx) => {
    setTimeout(() => {
      flashPad(nodeIdx);
      audio.padNote(nodeIdx);
    }, delay);
    delay += 380;
  });

  setTimeout(() => {
    GameState.memory.canClick = true;
    instruction.innerHTML = `<strong>SUA VEZ!</strong> Repita as ${seqLength} sinapses:`;
    instruction.style.color = "var(--human-mint)";
    // Cronômetro desafiador: 11 segundos
    runTimer(11, finishMemoryEarly);
  }, delay + 200);
}

function renderProgressDots(total, current) {
  const container = document.getElementById('memory-sequence-dots');
  container.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    dot.className = `dot-step ${i < current ? 'active' : ''}`;
    container.appendChild(dot);
  }
}

function flashPad(index) {
  const pad = document.querySelector(`.pad-node[data-index="${index}"]`);
  if (pad) {
    pad.classList.add('flash-active');
    setTimeout(() => pad.classList.remove('flash-active'), 250);
  }
}

function onPlayerPadClick(index, padEl) {
  audio.padNote(index);
  flashPad(index);

  const expected = GameState.memory.sequence[GameState.memory.inputIndex];

  if (index === expected) {
    GameState.memory.inputIndex++;
    renderProgressDots(GameState.memory.length, GameState.memory.inputIndex);

    if (GameState.memory.inputIndex >= GameState.memory.sequence.length) {
      // Acertou a sequência completa!
      clearInterval(GameState.timer);
      audio.correct();
      GameState.scores.combo++;
      GameState.scores.human += 420 + (GameState.memory.length * 75);
      GameState.scores.memoryLevel = GameState.memory.length;

      GameState.scores.ai += 340;
      refreshHUD();

      const instruction = document.getElementById('memory-instruction');
      instruction.innerHTML = `🎉 <strong>Excelente!</strong> Nível de retenção: ${GameState.memory.length} sinapses!`;
      instruction.style.color = "#34d399";

      if (GameState.memory.length < 6) {
        setTimeout(() => playMemorySequence(GameState.memory.length + 1), 1100);
      } else {
        setTimeout(startSpeedRound, 1400);
      }
    }
  } else {
    // Erro na sequência
    clearInterval(GameState.timer);
    audio.wrong();
    GameState.scores.combo = 0;
    GameState.scores.ai += 300;
    refreshHUD();

    const instruction = document.getElementById('memory-instruction');
    instruction.innerHTML = `⚠️ <strong>Falha na retenção!</strong> Avançando para a etapa de Reflexo...`;
    instruction.style.color = "var(--accent-red)";

    setTimeout(startSpeedRound, 1400);
  }
}

function finishMemoryEarly() {
  clearInterval(GameState.timer);
  audio.wrong();
  setTimeout(startSpeedRound, 800);
}

// ========================================================
// 9. RODADA 3: VELOCIDADE & CONFLITO COGNITIVO EXTREMO (STROOP SWITCHING)
// ========================================================
const PALETTE = [
  { name: "VERMELHO", hex: "#f43f5e" },
  { name: "AZUL", hex: "#00d9f5" },
  { name: "VERDE", hex: "#10b981" },
  { name: "AMARELO", hex: "#fbbf24" }
];

function startSpeedRound() {
  GameState.round = 3;
  GameState.speed.index = 0;
  GameState.speed.total = 5;

  hud.roundPill.querySelector('.round-num').textContent = "ETAPA 3/3";
  hud.roundTitle.textContent = "REFLEXO & INTERFERÊNCIA COGNITIVA";

  document.getElementById('game-logic').classList.add('hidden');
  document.getElementById('game-memory').classList.add('hidden');
  document.getElementById('game-speed').classList.remove('hidden');

  loadNextSpeedQuestion();
}

function loadNextSpeedQuestion() {
  if (GameState.speed.index >= GameState.speed.total) {
    showMatchResults();
    return;
  }

  GameState.speed.index++;

  // Sorteia palavra e cor da tinta conflitantes
  const word = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  let color;
  do {
    color = PALETTE[Math.floor(Math.random() * PALETTE.length)];
  } while (color.name === word.name);

  // ALTERNÂNCIA DINÂMICA DE REGRA (50% Cor da Tinta / 50% Palavra Escrita)
  const isInkRule = Math.random() < 0.55;
  GameState.speed.targetColor = isInkRule ? color.name : word.name;

  // Atualiza banner de regra
  const bannerEl = document.getElementById('stroop-rule-banner');
  const subInstrEl = document.getElementById('stroop-sub-instruction');
  const ruleText = document.getElementById('stroop-rule-text');

  if (isInkRule) {
    bannerEl.className = 'rule-switch-banner rule-ink';
    ruleText.textContent = 'COR DA TINTA';
    subInstrEl.textContent = 'Foque na COR VISUAL! Ignore a palavra que está escrita!';
  } else {
    bannerEl.className = 'rule-switch-banner rule-word';
    ruleText.textContent = 'TEXTO ESCRITO';
    subInstrEl.textContent = 'Foque na PALAVRA ESCRITA! Ignore a cor visual da tinta!';
  }

  const textEl = document.getElementById('stroop-text');
  textEl.textContent = word.name;
  textEl.style.color = color.hex;

  // Botões
  const grid = document.getElementById('speed-answers-grid');
  grid.innerHTML = '';

  PALETTE.forEach(c => {
    const btn = document.createElement('button');
    btn.className = 'btn-color-choice';
    btn.textContent = c.name;
    btn.style.borderColor = c.hex;
    btn.style.color = '#ffffff';
    btn.onclick = () => onSpeedAnswerSelected(c.name, btn);
    grid.appendChild(btn);
  });

  GameState.speed.startedAt = performance.now();
  // Tempo ultra-apertado: 3.5 segundos!
  runTimer(3.5, () => onSpeedAnswerSelected(null, null));

  // IA ultra-rápida no teste de reflexo
  triggerAISimulation(GameState.speed.targetColor, (aiHit, elapsedMs) => {
    if (aiHit) {
      GameState.scores.ai += 320;
      hud.aiStatusText.textContent = `I.A. reagiu em ${elapsedMs}ms (+320 pts)`;
    }
    refreshHUD();
  });
}

function onSpeedAnswerSelected(selected, btnEl) {
  clearInterval(GameState.timer);
  clearTimeout(GameState.aiTimeout);

  const deltaMs = Math.round(performance.now() - GameState.speed.startedAt);
  GameState.scores.reactionTimes.push(deltaMs);

  const isCorrect = selected === GameState.speed.targetColor;

  if (isCorrect) {
    audio.correct();
    GameState.scores.combo++;
    if (btnEl) {
      btnEl.style.background = 'rgba(16, 185, 129, 0.45)';
      btnEl.style.borderColor = '#10b981';
    }
    // Bônus de milissegundos
    const speedScore = Math.max(150, 480 - Math.floor(deltaMs / 7));
    GameState.scores.human += speedScore;
  } else {
    audio.wrong();
    GameState.scores.combo = 0;
    if (btnEl) {
      btnEl.style.background = 'rgba(244, 63, 94, 0.45)';
    }
  }

  refreshHUD();
  setTimeout(loadNextSpeedQuestion, 750);
}

// ========================================================
// 10. CRONÔMETRO E RESPOSTA IMEDIATA DA INTELIGÊNCIA ARTIFICIAL
// ========================================================
function runTimer(seconds, onExpire) {
  clearInterval(GameState.timer);
  GameState.timeLeft = seconds;
  hud.timerDigits.textContent = Math.ceil(seconds);
  hud.timerDigits.classList.remove('urgent');

  const startStamp = performance.now();
  const totalDuration = seconds * 1000;

  GameState.timer = setInterval(() => {
    const elapsed = performance.now() - startStamp;
    const remaining = Math.max(0, (totalDuration - elapsed) / 1000);
    hud.timerDigits.textContent = Math.ceil(remaining);

    if (remaining <= 2.5) {
      audio.tick();
      hud.timerDigits.classList.add('urgent');
    }

    if (remaining <= 0) {
      clearInterval(GameState.timer);
      if (onExpire) onExpire();
    }
  }, 200);
}

function triggerAISimulation(answer, callback) {
  clearTimeout(GameState.aiTimeout);

  // IA COM RESPOSTA IMEDIATA / ULTRA-RÁPIDA
  let latencyMs = 650;
  let accuracy = 0.88;

  if (GameState.player.difficulty === 'EASY') {
    // 950ms a 1400ms (72% acerto)
    latencyMs = Math.floor(Math.random() * 450) + 950;
    accuracy = 0.72;
  } else if (GameState.player.difficulty === 'MEDIUM') {
    // 380ms a 750ms (88% acerto) — bem mais imediata!
    latencyMs = Math.floor(Math.random() * 370) + 380;
    accuracy = 0.88;
  } else if (GameState.player.difficulty === 'HARD') {
    // 160ms a 340ms (98% acerto) — velocidade quântica!
    latencyMs = Math.floor(Math.random() * 180) + 160;
    accuracy = 0.98;
  }

  hud.aiStatusText.textContent = `I.A. processando em ~${latencyMs}ms...`;

  GameState.aiTimeout = setTimeout(() => {
    const hits = Math.random() < accuracy;
    hud.telemetry.textContent = `[AURA-7]: Resposta computada em ${latencyMs}ms com ${Math.round(accuracy * 100)}% de certeza.`;
    if (callback) callback(hits, latencyMs);
  }, latencyMs);
}

// ========================================================
// 11. TELA DE RESULTADO FINAL & PÓDIO
// ========================================================
function showMatchResults() {
  clearInterval(GameState.timer);
  clearTimeout(GameState.aiTimeout);

  const human = GameState.scores.human;
  const ai = GameState.scores.ai;
  const isHumanWinner = human >= ai;

  // Confetes e Som
  if (isHumanWinner) {
    audio.victory();
    confetti.fire(110);
  } else {
    audio.defeat();
  }

  const iconEl = document.getElementById('res-badge-icon');
  const titleEl = document.getElementById('res-title');
  const descEl = document.getElementById('res-desc');

  if (isHumanWinner) {
    iconEl.textContent = "👑";
    titleEl.textContent = "VITÓRIA DO CÉREBRO HUMANO!";
    titleEl.className = "result-headline human-won";
    descEl.textContent = "Parabéns! Sua plasticidade neural e velocidade de reação superaram a máquina.";
  } else {
    iconEl.textContent = "🤖";
    titleEl.textContent = "DOMÍNIO DA INTELIGÊNCIA ARTIFICIAL";
    titleEl.className = "result-headline ai-won";
    descEl.textContent = "O algoritmo AURA-7 foi mais veloz desta vez. Desafie a IA novamente e treine seus reflexos!";
  }

  document.getElementById('res-human-pts').textContent = human.toLocaleString();
  document.getElementById('res-ai-pts').textContent = ai.toLocaleString();

  // Métricas
  const logicPct = GameState.scores.logicTotal > 0
    ? Math.round((GameState.scores.logicSuccess / GameState.scores.logicTotal) * 100)
    : 80;

  const avgReaction = GameState.scores.reactionTimes.length > 0
    ? Math.round(GameState.scores.reactionTimes.reduce((a, b) => a + b, 0) / GameState.scores.reactionTimes.length)
    : 420;

  document.getElementById('res-logic-pct').textContent = `${logicPct}%`;
  document.getElementById('res-memory-level').textContent = `Nível ${GameState.scores.memoryLevel}`;
  document.getElementById('res-speed-ms').textContent = `${avgReaction}ms`;

  // Salva no Ranking dos Visitantes
  LeaderboardManager.saveEntry({
    name: GameState.player.name,
    course: GameState.player.course || "Visitante",
    score: human,
    diff: GameState.player.difficulty === 'EASY' ? 'Calouro' : GameState.player.difficulty === 'HARD' ? 'Super IA' : 'Deep Learning',
    outcome: isHumanWinner ? "WIN" : "LOSS"
  });

  goToScreen('result');
}

// ========================================================
// 12. RENDERIZAÇÃO DO HALL DA FAMA (RANKING)
// ========================================================
function renderLeaderboard() {
  const list = LeaderboardManager.getList();
  const podium = document.getElementById('podium-showcase');
  const tbody = document.getElementById('leaderboard-rows');

  podium.innerHTML = '';
  tbody.innerHTML = '';

  // Render do Pódio (Top 3)
  const p1 = list[0] || { name: "—", score: 0 };
  const p2 = list[1] || { name: "—", score: 0 };
  const p3 = list[2] || { name: "—", score: 0 };

  podium.innerHTML = `
    <div class="podium-slot slot-silver">
      <div class="podium-medal">🥈</div>
      <div class="podium-name">${p2.name}</div>
      <div class="podium-points">${p2.score ? p2.score.toLocaleString() + ' pts' : ''}</div>
      <div class="podium-pedestal">2º</div>
    </div>
    <div class="podium-slot slot-gold">
      <div class="podium-medal">👑</div>
      <div class="podium-name">${p1.name}</div>
      <div class="podium-points">${p1.score ? p1.score.toLocaleString() + ' pts' : ''}</div>
      <div class="podium-pedestal">1º</div>
    </div>
    <div class="podium-slot slot-bronze">
      <div class="podium-medal">🥉</div>
      <div class="podium-name">${p3.name}</div>
      <div class="podium-points">${p3.score ? p3.score.toLocaleString() + ' pts' : ''}</div>
      <div class="podium-pedestal">3º</div>
    </div>
  `;

  // Tabela completa
  list.forEach((item, idx) => {
    const tr = document.createElement('tr');
    const badgeColor = idx === 0 ? 'c-gold' : idx === 1 ? 'c-silver' : idx === 2 ? 'c-bronze' : '';

    tr.innerHTML = `
      <td class="rank-badge ${badgeColor}">${idx + 1}º</td>
      <td><strong>${item.name}</strong></td>
      <td>${item.course}</td>
      <td>${item.diff}</td>
      <td class="rank-pts">${item.score.toLocaleString()}</td>
      <td>
        <span class="outcome-tag ${item.outcome === 'WIN' ? 'win' : 'loss'}">
          ${item.outcome === 'WIN' ? 'VENCEU IA' : 'DERROTA'}
        </span>
      </td>
    `;
    tbody.appendChild(tr);
  });
}

// ========================================================
// 13. BOOTSTRAP E LISTENERS DE EVENTO
// ========================================================
let confetti = null;

document.addEventListener('DOMContentLoaded', () => {
  // Inicia Fundos
  new NeuralCanvas('neural-canvas');
  confetti = new ConfettiCannon('confetti-canvas');

  // Form de Cadastro do Jogador
  const form = document.getElementById('form-player-register');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    audio.init();

    const name = document.getElementById('player-name').value.trim();
    const course = document.getElementById('player-course').value.trim();
    const diff = document.querySelector('input[name="difficulty"]:checked').value;

    GameState.player.name = name || "Visitante";
    GameState.player.course = course || "Visitante";
    GameState.player.difficulty = diff;

    GameState.scores.human = 0;
    GameState.scores.ai = 0;
    GameState.scores.combo = 0;
    GameState.scores.logicSuccess = 0;
    GameState.scores.logicTotal = 0;
    GameState.scores.reactionTimes = [];

    hud.humanName.textContent = GameState.player.name;

    refreshHUD();
    goToScreen('battle');
    startLogicRound();
  });

  // Navegação
  document.getElementById('btn-nav-ranking').onclick = () => {
    renderLeaderboard();
    goToScreen('ranking');
  };

  document.getElementById('btn-ranking-back').onclick = () => {
    goToScreen('welcome');
  };

  document.getElementById('btn-result-view-ranking').onclick = () => {
    renderLeaderboard();
    goToScreen('ranking');
  };

  document.getElementById('btn-result-play-again').onclick = () => {
    goToScreen('welcome');
  };

  document.getElementById('btn-ranking-play').onclick = () => {
    goToScreen('welcome');
  };

  // Botão de Limpar Dados
  document.getElementById('btn-clear-leaderboard').onclick = () => {
    if (confirm("Deseja realmente reiniciar o ranking do estande para uma nova rodada de visitantes?")) {
      LeaderboardManager.clear();
      renderLeaderboard();
    }
  };

  // Alternar Áudio
  const soundBtn = document.getElementById('btn-sound-toggle');
  const soundIcon = document.getElementById('sound-icon');
  soundBtn.onclick = () => {
    audio.enabled = !audio.enabled;
    soundIcon.textContent = audio.enabled ? "🔊" : "🔇";
  };
});

const STORAGE_KEY = "space_stickman_v3";
const gameData = window.gameData;
const MAX_LIFE = 50;
const DAMAGE = 10;

let player = { life: MAX_LIFE, maxLife: MAX_LIFE, xCount: 0, score: 0, level: 1, ownedItems: [] };
let currentPlanetIndex = 0;
let bossLife = MAX_LIFE;
let bossMaxLife = MAX_LIFE;
let currentQuestionObj = null;
let currentQuestionObjIndex = null;
let activeShapeIndexes = [];
let usedQuestionKeys = new Set();
let failedQuestionKeys = new Set();
let wrongAnswers = 0;
let correctStreak = 0;
let battleLocked = false;
let selectedShapes = new Set();

const menuScreen = document.getElementById("menu");
const mapScreen = document.getElementById("map");
const studyScreen = document.getElementById("study");
const studyDetailScreen = document.getElementById("studyDetail");
const gameScreen = document.getElementById("game");

const shapeGrid = document.getElementById("shapeGrid");
const shapeSearch = document.getElementById("shapeSearch");
const shapeSearchClear = document.getElementById("shapeSearchClear");
const studyShapeList = document.getElementById("studyShapeList");
const startBattleBtn = document.getElementById("startBattleBtn");
const questionEl = document.getElementById("question");
const answersEl = document.getElementById("answers");
const planetNameEl = document.getElementById("planetName");
const statusMessageEl = document.getElementById("statusMessage");
const combatCanvas = document.getElementById("combatStage");
const combatCtx = combatCanvas.getContext("2d");
const shapeCanvas = document.getElementById("shapeCanvas");
const shapeCtx = shapeCanvas.getContext("2d");
const studyBtn = document.getElementById("studyBtn");
const backFromStudyBtn = document.getElementById("backFromStudyBtn");
const studyStartBtn = document.getElementById("studyStartBtn");
const studyDetailStartBtn = document.getElementById("studyDetailStartBtn");
const studyInfoBox = document.getElementById("studyInfoBox");
const studyDetailCanvas = document.getElementById("studyDetailCanvas");
const studyDetailCtx = studyDetailCanvas.getContext("2d");
const detailTitle = document.getElementById("detailTitle");
const studyDetailInfo = document.getElementById("studyDetailInfo");
const studyBackBtn = document.getElementById("studyBackBtn");
const bgAudio = document.getElementById("bgAudio");

let bulletX = 0;
let bulletY = 0;
let bulletTarget = "";
let bulletActive = false;
let particles = [];
let animTime = 0;
let heroState = "idle";
let alienState = "idle";
let heroWalkX = 0;
let alienWalkX = 0;
let heroInjured = 0;
let alienInjured = 0;
let audioContext = null;
let backgroundMusicNodes = [];
let backgroundMusicGain = null;
let activeIntervals = [];
// Flags para mostrar elementos opcionales en la vista de detalle
let showAllVertices = false;
let showAllSides = false;
let showAllAngles = false;
let showAllDiagonals = false;
let currentStudyType = null;
let studySelectedShapeIndex = null;

function clearCombatIntervals() {
  activeIntervals.forEach(clearInterval);
  activeIntervals = [];
}

function createParticles(x, y, color) {
  for (let i = 0; i < 8; i += 1) {
    particles.push({
      x,
      y: y + (Math.random() * 10 - 5),
      vx: (Math.random() * 4 - 2) * 0.5,
      vy: (Math.random() * 4 - 2) * 0.5,
      alpha: 1,
      color
    });
  }
}

function updateAndDrawParticles() {
  for (let i = particles.length - 1; i >= 0; i -= 1) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.alpha -= 0.04;

    if (p.alpha <= 0) {
      particles.splice(i, 1);
    } else {
      combatCtx.save();
      combatCtx.globalAlpha = p.alpha;
      combatCtx.fillStyle = p.color;
      combatCtx.shadowColor = p.color;
      combatCtx.shadowBlur = 5;
      combatCtx.beginPath();
      combatCtx.arc(p.x, p.y, Math.random() * 3 + 1, 0, Math.PI * 2);
      combatCtx.fill();
      combatCtx.restore();
    }
  }
}

function drawStickmen() {
  combatCtx.clearRect(0, 0, combatCanvas.width, combatCanvas.height);
  animTime += 0.15;

  combatCtx.strokeStyle = "rgba(34, 211, 238, 0.2)";
  combatCtx.lineWidth = 2;
  combatCtx.beginPath();
  combatCtx.moveTo(0, 130);
  combatCtx.lineTo(combatCanvas.width, 130);
  combatCtx.stroke();

  const idleOffsetHero = heroState === "idle" ? Math.sin(animTime * 1.2) * 2 : Math.sin(animTime * 1.8) * 4;
  const idleOffsetAlien = alienState === "idle" ? Math.cos(animTime * 1.2) * 2 : Math.cos(animTime * 1.8) * 4;
  const legCycle = Math.sin(animTime * 1.8) * 12;
  const hurtShakeHero = heroInjured ? Math.sin(animTime * 6) * 2 : 0;
  const hurtShakeAlien = alienInjured ? Math.cos(animTime * 6) * 2 : 0;

  const hX = 80 + heroWalkX + hurtShakeHero;
  const hY = 100 + idleOffsetHero;

  combatCtx.save();
  combatCtx.strokeStyle = "white";
  combatCtx.lineWidth = 3;

  combatCtx.beginPath();
  combatCtx.arc(hX, hY - 30, 12, 0, Math.PI * 2);
  combatCtx.stroke();
  combatCtx.fillStyle = "cyan";
  combatCtx.shadowColor = "cyan";
  combatCtx.shadowBlur = 4;
  combatCtx.beginPath();
  combatCtx.arc(hX + 4, hY - 30, 6, -Math.PI / 2, Math.PI / 2);
  combatCtx.fill();
  combatCtx.shadowBlur = 0;

  combatCtx.beginPath();
  combatCtx.moveTo(hX, hY - 18);
  combatCtx.lineTo(hX, hY + 10);

  if (heroState === "walking") {
    combatCtx.lineTo(hX + legCycle, hY + 30);
    combatCtx.moveTo(hX, hY + 10);
    combatCtx.lineTo(hX - legCycle, hY + 30);
  } else {
    combatCtx.lineTo(hX - 8, hY + 30);
    combatCtx.moveTo(hX, hY + 10);
    combatCtx.lineTo(hX + 8, hY + 30);
  }

  combatCtx.moveTo(hX, hY - 10);
  if (heroInjured > 0) {
    combatCtx.lineTo(hX + 12, hY - 3);
    combatCtx.stroke();
    combatCtx.beginPath();
    combatCtx.strokeStyle = "#ff4757";
    combatCtx.lineWidth = 3;
    combatCtx.moveTo(hX + 12, hY - 3);
    combatCtx.lineTo(hX + 26, hY + 8);
    combatCtx.stroke();
    combatCtx.strokeStyle = "white";
    combatCtx.lineWidth = 3;
  } else {
    combatCtx.lineTo(hX + 12, hY - 3);
    combatCtx.lineTo(hX + 22, hY - 3);
    combatCtx.stroke();

    combatCtx.fillStyle = "#3a3d40";
    combatCtx.fillRect(hX + 16, hY - 8, 25, 7);
    combatCtx.fillStyle = "cyan";
    combatCtx.fillRect(hX + 22, hY - 12, 10, 3);
    combatCtx.save();
    combatCtx.fillStyle = "#00ffff";
    combatCtx.shadowColor = "#00ffff";
    combatCtx.shadowBlur = 8;
    combatCtx.fillRect(hX + 36, hY - 7, 7, 5);
    combatCtx.restore();
  }
  combatCtx.restore();

  const eX = 420 + alienWalkX;
  const eY = 100 + idleOffsetAlien;

  combatCtx.save();
  combatCtx.strokeStyle = "#ff4757";
  combatCtx.lineWidth = 3;

  combatCtx.beginPath();
  combatCtx.arc(eX, eY - 32, 10, 0, Math.PI * 2);
  combatCtx.stroke();
  const antennaWave = Math.sin(animTime * 0.8) * 3;
  combatCtx.beginPath();
  combatCtx.moveTo(eX - 5, eY - 42);
  combatCtx.lineTo(eX - 10 + antennaWave, eY - 51);
  combatCtx.moveTo(eX + 5, eY - 42);
  combatCtx.lineTo(eX + 10 + antennaWave, eY - 51);
  combatCtx.stroke();

  combatCtx.beginPath();
  combatCtx.moveTo(eX, eY - 22);
  combatCtx.lineTo(eX, eY + 10);

  if (alienState === "walking") {
    combatCtx.lineTo(eX + legCycle, eY + 30);
    combatCtx.moveTo(eX, eY + 10);
    combatCtx.lineTo(eX - legCycle, eY + 30);
  } else {
    combatCtx.lineTo(eX - 10, eY + 30);
    combatCtx.moveTo(eX, eY + 10);
    combatCtx.lineTo(eX + 10, eY + 30);
  }

  combatCtx.moveTo(eX, eY - 12);
  if (alienInjured > 0) {
    combatCtx.lineTo(eX + 9, eY - 1);
    combatCtx.stroke();
    combatCtx.beginPath();
    combatCtx.strokeStyle = "#ff2f41";
    combatCtx.lineWidth = 3;
    combatCtx.moveTo(eX + 9, eY - 1);
    combatCtx.lineTo(eX + 20, eY + 10);
    combatCtx.stroke();
    combatCtx.strokeStyle = "#ff4757";
    combatCtx.lineWidth = 3;
    combatCtx.beginPath();
    combatCtx.arc(eX + 18, eY + 12, 3, 0, Math.PI * 2);
    combatCtx.fillStyle = "#ff2f41";
    combatCtx.fill();
  } else {
    combatCtx.lineTo(eX + 15, eY - 5);
    combatCtx.stroke();
    combatCtx.strokeStyle = "#a81d29";
    combatCtx.beginPath();
    combatCtx.moveTo(eX, eY - 12);
    combatCtx.lineTo(eX - 18, eY - 5);
    combatCtx.stroke();
  }

  combatCtx.fillStyle = "#4a0d14";
  combatCtx.beginPath();
  combatCtx.arc(eX - 20, eY - 5, 6, 0, Math.PI * 2);
  combatCtx.fill();
  combatCtx.save();
  combatCtx.fillStyle = "#ff2f41";
  combatCtx.shadowColor = "#ff2f41";
  combatCtx.shadowBlur = 8;
  combatCtx.beginPath();
  combatCtx.arc(eX - 22, eY - 5, 3, 0, Math.PI * 2);
  combatCtx.fill();
  combatCtx.restore();
  combatCtx.restore();

  updateAndDrawParticles();
  updateInjuries();

  if (bulletActive) {
    combatCtx.save();
    if (bulletTarget === "alien") {
      combatCtx.shadowColor = "#00ffff";
      combatCtx.shadowBlur = 15;
      const gradient = combatCtx.createLinearGradient(bulletX - 25, bulletY, bulletX, bulletY);
      gradient.addColorStop(0, "rgba(0, 255, 255, 0)");
      gradient.addColorStop(1, "rgba(0, 255, 255, 1)");
      combatCtx.strokeStyle = gradient;
      combatCtx.lineWidth = 6;
      combatCtx.beginPath();
      combatCtx.moveTo(bulletX - 25, bulletY);
      combatCtx.lineTo(bulletX, bulletY);
      combatCtx.stroke();
      combatCtx.fillStyle = "#ffffff";
      combatCtx.beginPath();
      combatCtx.arc(bulletX, bulletY, 5, 0, Math.PI * 2);
      combatCtx.fill();
      createParticles(bulletX - 5, bulletY, "#00ffff");
    } else {
      combatCtx.shadowColor = "#ff4757";
      combatCtx.shadowBlur = 15;
      const gradient = combatCtx.createLinearGradient(bulletX + 25, bulletY, bulletX, bulletY);
      gradient.addColorStop(0, "rgba(255, 71, 87, 0)");
      gradient.addColorStop(1, "rgba(255, 71, 87, 1)");
      combatCtx.strokeStyle = gradient;
      combatCtx.lineWidth = 6;
      combatCtx.beginPath();
      combatCtx.moveTo(bulletX + 25, bulletY);
      combatCtx.lineTo(bulletX, bulletY);
      combatCtx.stroke();
      combatCtx.fillStyle = "#ffffff";
      combatCtx.beginPath();
      combatCtx.arc(bulletX, bulletY, 5, 0, Math.PI * 2);
      combatCtx.fill();
      createParticles(bulletX + 5, bulletY, "#ff4757");
    }
    combatCtx.restore();
  }
}

function firePlasmaBall(target, callback) {
  battleLocked = true;
  bulletActive = true;
  bulletTarget = target;
  let bulletTravel = 0;
  playShotSound(target);

  if (target === "alien") {
    heroState = "walking";
    heroWalkX = 0;
    bulletY = 93;
    bulletX = 115 + heroWalkX + 20;

    const animationLoop = setInterval(() => {
      if (heroWalkX < 25) {
        heroWalkX += 2;
      }
      bulletX = 115 + heroWalkX + 20 + bulletTravel;
    }, 40);

    const bulletMoveLoop = setInterval(() => {
      bulletTravel += 14;
      bulletX = 115 + heroWalkX + 20 + bulletTravel;
      if (bulletX >= 400 + alienWalkX) {
        clearInterval(bulletMoveLoop);
        clearInterval(animationLoop);
        for (let p = 0; p < 20; p += 1) createParticles(400 + alienWalkX, 95, "#00ffff");

        setTimeout(() => {
          heroState = "idle";
          heroWalkX = 0;
          bulletActive = false;
          battleLocked = false;
          callback();
        }, 150);
      }
    }, 20);

    activeIntervals.push(animationLoop, bulletMoveLoop);
  } else {
    alienState = "walking";
    alienWalkX = 0;
    bulletY = 95;
    bulletX = 395 + alienWalkX - 20;

    const animationLoop = setInterval(() => {
      if (alienWalkX > -25) {
        alienWalkX -= 2;
      }
      bulletX = 395 + alienWalkX - 20 + bulletTravel;
    }, 40);

    const bulletMoveLoop = setInterval(() => {
      bulletTravel -= 14;
      bulletX = 395 + alienWalkX - 20 + bulletTravel;
      if (bulletX <= 80 + heroWalkX) {
        clearInterval(bulletMoveLoop);
        clearInterval(animationLoop);
        for (let p = 0; p < 20; p += 1) createParticles(80 + heroWalkX, 95, "#ff4757");

        setTimeout(() => {
          alienState = "idle";
          alienWalkX = 0;
          bulletActive = false;
          battleLocked = false;
          callback();
        }, 150);
      }
    }, 20);

    activeIntervals.push(animationLoop, bulletMoveLoop);
  }
}

function setInjury(target) {
  if (target === "hero") {
    heroInjured = 40;
  } else {
    alienInjured = 40;
  }
}

function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

function playShotSound(target) {
  initAudioContext();
  if (!audioContext) return;

  const now = audioContext.currentTime;
  const osc1 = audioContext.createOscillator();
  const osc2 = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  const filter = audioContext.createBiquadFilter();

  osc1.type = target === "alien" ? "square" : "sawtooth";
  osc2.type = target === "alien" ? "triangle" : "sine";
  osc1.frequency.setValueAtTime(target === "alien" ? 520 : 440, now);
  osc2.frequency.setValueAtTime(target === "alien" ? 760 : 660, now);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(target === "alien" ? 1100 : 1400, now);

  gainNode.gain.setValueAtTime(0.25, now);
  gainNode.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(audioContext.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + 0.18);
  osc2.stop(now + 0.18);
}

function playImpactSound() {
  initAudioContext();
  if (!audioContext) return;

  const now = audioContext.currentTime;
  const osc = audioContext.createOscillator();
  const gain = audioContext.createGain();

  osc.type = "triangle";
  osc.frequency.setValueAtTime(160, now);
  osc.frequency.exponentialRampToValueAtTime(80, now + 0.25);
  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

  osc.connect(gain);
  gain.connect(audioContext.destination);
  osc.start(now);
  osc.stop(now + 0.25);
}

function playVictorySound() {
  initAudioContext();
  if (!audioContext) return;

  const now = audioContext.currentTime;
  const first = audioContext.createOscillator();
  const second = audioContext.createOscillator();
  const gain = audioContext.createGain();

  first.type = "triangle";
  second.type = "sine";
  first.frequency.setValueAtTime(440, now);
  second.frequency.setValueAtTime(660, now);
  gain.gain.setValueAtTime(0.15, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + 0.4);

  first.connect(gain);
  second.connect(gain);
  gain.connect(audioContext.destination);
  first.start(now);
  second.start(now);
  first.stop(now + 0.4);
  second.stop(now + 0.4);
}

function startBackgroundMusic() {
  if (bgAudio) {
    if (bgAudio.paused) {
      bgAudio.volume = 0.5;
      bgAudio.play().catch(() => {});
    }
    return;
  }

  initAudioContext();
  if (!audioContext || backgroundMusicNodes.length) return;

  audioContext.resume?.();
  const now = audioContext.currentTime;
  backgroundMusicGain = audioContext.createGain();
  backgroundMusicGain.gain.setValueAtTime(0.08, now);
  backgroundMusicGain.connect(audioContext.destination);

  const bass = audioContext.createOscillator();
  const pad = audioContext.createOscillator();
  const bassGain = audioContext.createGain();
  const padGain = audioContext.createGain();

  bass.type = "sine";
  bass.frequency.setValueAtTime(110, now);
  bassGain.gain.setValueAtTime(0.03, now);

  pad.type = "triangle";
  pad.frequency.setValueAtTime(220, now);
  padGain.gain.setValueAtTime(0.02, now);

  bass.connect(bassGain);
  bassGain.connect(backgroundMusicGain);
  pad.connect(padGain);
  padGain.connect(backgroundMusicGain);

  bass.start(now);
  pad.start(now);
  backgroundMusicNodes.push(bass, pad, bassGain, padGain);

  const sequence = [110, 130.81, 146.83, 164.81];
  sequence.forEach((freq, index) => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(freq, now + index * 1.2);
    gain.gain.setValueAtTime(0.0, now + index * 1.2);
    gain.gain.linearRampToValueAtTime(0.05, now + index * 1.2 + 0.08);
    gain.gain.linearRampToValueAtTime(0.0, now + index * 1.2 + 0.8);
    osc.connect(gain);
    gain.connect(backgroundMusicGain);
    osc.start(now + index * 1.2);
    osc.stop(now + index * 1.2 + 0.8);
    backgroundMusicNodes.push(osc, gain);
  });
}

function stopBackgroundMusic() {
  if (!backgroundMusicNodes.length) return;
  backgroundMusicNodes.forEach((node) => {
    if (node.stop) {
      try { node.stop(); } catch (e) {}
    }
    if (node.disconnect) node.disconnect();
  });
  backgroundMusicNodes = [];
  backgroundMusicGain = null;
}

function updateInjuries() {
  if (heroInjured > 0) heroInjured -= 1;
  if (alienInjured > 0) alienInjured -= 1;
}

function drawRegularPolygon(ctx, cx, cy, r, sides, rotation = -Math.PI / 2) {
  for (let i = 0; i < sides; i += 1) {
    const angle = rotation + (i * 2 * Math.PI) / sides;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  }
  ctx.closePath();
}

function drawShape(type) {
  shapeCtx.clearRect(0, 0, shapeCanvas.width, shapeCanvas.height);
  shapeCtx.strokeStyle = "#fde68a";
  shapeCtx.lineWidth = 4;
  shapeCtx.fillStyle = "rgba(253, 230, 138, 0.16)";
  shapeCtx.beginPath();

  const cx = 60;
  const cy = 60;
  const r = 35;

  if (type === "triangle") {
    shapeCtx.moveTo(cx, cy - r);
    shapeCtx.lineTo(cx + r * Math.cos(Math.PI / 6), cy + r * Math.sin(Math.PI / 6));
    shapeCtx.lineTo(cx - r * Math.cos(Math.PI / 6), cy + r * Math.sin(Math.PI / 6));
    shapeCtx.closePath();
  } else if (type === "square") {
    shapeCtx.rect(cx - 25, cy - 25, 50, 50);
  } else if (type === "rectangle") {
    shapeCtx.rect(cx - 30, cy - 20, 60, 40);
  } else if (["pentagon", "hexagon", "heptagon", "octagon", "nonagon", "decagon", "hendecagon", "dodecagon"].includes(type)) {
    const sidesMap = {
      pentagon: 5,
      hexagon: 6,
      heptagon: 7,
      octagon: 8,
      nonagon: 9,
      decagon: 10,
      hendecagon: 11,
      dodecagon: 12
    };
    drawRegularPolygon(shapeCtx, cx, cy, r, sidesMap[type]);
  } else if (type === "rhombus") {
    shapeCtx.moveTo(cx, cy - r);
    shapeCtx.lineTo(cx + 30, cy);
    shapeCtx.lineTo(cx, cy + r);
    shapeCtx.lineTo(cx - 30, cy);
    shapeCtx.closePath();
  } else if (type === "parallelogram") {
    shapeCtx.moveTo(cx - 30, cy + 20);
    shapeCtx.lineTo(cx + 30, cy + 20);
    shapeCtx.lineTo(cx + 20, cy - 20);
    shapeCtx.lineTo(cx - 20, cy - 20);
    shapeCtx.closePath();
  } else if (type === "trapezoid") {
    shapeCtx.moveTo(cx - 30, cy + 20);
    shapeCtx.lineTo(cx + 30, cy + 20);
    shapeCtx.lineTo(cx + 22, cy - 20);
    shapeCtx.lineTo(cx - 16, cy - 20);
    shapeCtx.closePath();
  } else if (type === "trapezoide") {
    shapeCtx.moveTo(cx - 33, cy + 18);
    shapeCtx.lineTo(cx + 25, cy + 20);
    shapeCtx.lineTo(cx + 15, cy - 20);
    shapeCtx.lineTo(cx - 27, cy - 22);
    shapeCtx.closePath();
  } else if (type === "circle") {
    shapeCtx.arc(cx, cy, r, 0, Math.PI * 2);
  } else if (type === "oval") {
    shapeCtx.ellipse(cx, cy, r, r * 0.65, 0, 0, Math.PI * 2);
  } else if (type === "crescent") {
    shapeCtx.moveTo(cx, cy - r);
    shapeCtx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, false);
    shapeCtx.arc(cx + r * 0.3, cy, r * 0.7, Math.PI / 2, -Math.PI / 2, true);
    shapeCtx.closePath();
  } else if (type === "star") {
    const outer = r;
    const inner = r * 0.45;
    for (let i = 0; i < 10; i += 1) {
      const angle = -Math.PI / 2 + (i * Math.PI) / 5;
      const radius = i % 2 === 0 ? outer : inner;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      if (i === 0) shapeCtx.moveTo(x, y);
      else shapeCtx.lineTo(x, y);
    }
    shapeCtx.closePath();
  } else if (type === "heart") {
    shapeCtx.moveTo(cx, cy + 10);
    shapeCtx.bezierCurveTo(cx - 35, cy - 15, cx - 15, cy - 45, cx, cy - 15);
    shapeCtx.bezierCurveTo(cx + 15, cy - 45, cx + 35, cy - 15, cx, cy + 10);
    shapeCtx.closePath();
  } else if (type === "semicircle") {
    shapeCtx.moveTo(cx - r, cy);
    shapeCtx.arc(cx, cy, r, Math.PI, 0, false);
    shapeCtx.lineTo(cx - r, cy);
    shapeCtx.closePath();
  } else if (type === "rightTriangle") {
    shapeCtx.moveTo(cx - r, cy + r);
    shapeCtx.lineTo(cx + r, cy + r);
    shapeCtx.lineTo(cx - r, cy - r);
    shapeCtx.closePath();
  } else if (type === "isoscelesTriangle") {
    shapeCtx.moveTo(cx, cy - r);
    shapeCtx.lineTo(cx + r, cy + r);
    shapeCtx.lineTo(cx - r, cy + r);
    shapeCtx.closePath();
  } else if (type === "isoscelesTrapezoid") {
    shapeCtx.moveTo(cx - 28, cy + 18);
    shapeCtx.lineTo(cx + 28, cy + 18);
    shapeCtx.lineTo(cx + 18, cy - 18);
    shapeCtx.lineTo(cx - 18, cy - 18);
    shapeCtx.closePath();
  }

  shapeCtx.fill();
  shapeCtx.stroke();
}

function save() {
  const saved = {
    xCount: player.xCount,
    score: player.score,
    level: player.level,
    maxLife: player.maxLife,
    ownedItems: player.ownedItems
  };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
}

function load() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) {
    const saved = JSON.parse(stored);
    player.xCount = saved.xCount || 0;
    player.score = saved.score || 0;
    player.level = saved.level || 1;
    player.maxLife = saved.maxLife || MAX_LIFE;
    player.ownedItems = saved.ownedItems || [];
  }
  player.life = player.maxLife;
  updateHud();
}

function updateHud() {
  document.getElementById("vida").textContent = player.life;
  document.getElementById("level").textContent = player.level;
  document.getElementById("xp").textContent = player.xCount;
  document.getElementById("score").textContent = player.score;

  document.getElementById("heroHpText").textContent = player.life;
  document.getElementById("bossHpText").textContent = `${bossLife}/${bossMaxLife}`;
  document.getElementById("heroLifeBar").style.width = `${(Math.max(0, player.life) / player.maxLife) * 100}%`;
  document.getElementById("boss").style.width = `${(Math.max(0, bossLife) / bossMaxLife) * 100}%`;
}

function drawShopItemPreview(canvas, item) {
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const config = getShopItemPreviewConfig(item);

  drawPreviewBackground(ctx, canvas.width, canvas.height, config);
  drawStickmanBase(ctx, centerX, centerY);

  if (item.type === "arma") {
    drawWeaponStickman(ctx, centerX, centerY, config);
  } else {
    drawSuitStickman(ctx, centerX, centerY, config);
  }
}

function getShopItemPreviewConfig(item) {
  const index = Number(item.id.split("-")[1]) - 1;
  const weaponStyles = [
    { main: "#38bdf8", accent: "#0ea5e9", glow: "#bae6fd" },
    { main: "#f472b6", accent: "#fb7185", glow: "#fda4af" },
    { main: "#34d399", accent: "#22c55e", glow: "#86efac" },
    { main: "#fbbf24", accent: "#f59e0b", glow: "#fde68a" },
    { main: "#a78bfa", accent: "#8b5cf6", glow: "#c4b5fd" },
    { main: "#f97316", accent: "#ea580c", glow: "#fdba74" },
    { main: "#60a5fa", accent: "#3b82f6", glow: "#93c5fd" },
    { main: "#34d399", accent: "#10b981", glow: "#6ee7b7" },
    { main: "#fb7185", accent: "#ef4444", glow: "#fca5a5" },
    { main: "#38bdf8", accent: "#0ea5e9", glow: "#bae6fd" }
  ];
  const suitStyles = [
    { main: "#fcd34d", accent: "#fbbf24", glow: "#fde68a" },
    { main: "#60a5fa", accent: "#3b82f6", glow: "#93c5fd" },
    { main: "#a78bfa", accent: "#8b5cf6", glow: "#ddd6fe" },
    { main: "#34d399", accent: "#16a34a", glow: "#86efac" },
    { main: "#f472b6", accent: "#ec4899", glow: "#f9a8d4" },
    { main: "#fb7185", accent: "#f43f5e", glow: "#fecdd3" },
    { main: "#fbbf24", accent: "#f59e0b", glow: "#fde68a" },
    { main: "#38bdf8", accent: "#0284c7", glow: "#bfdbfe" },
    { main: "#a3e635", accent: "#84cc16", glow: "#d9f99d" },
    { main: "#f97316", accent: "#ea580c", glow: "#fdba74" }
  ];

  return item.type === "arma"
    ? weaponStyles[index % weaponStyles.length]
    : suitStyles[index % suitStyles.length];
}

function drawPreviewBackground(ctx, width, height, config) {
  ctx.fillStyle = "rgba(255,255,255,0.08)";
  ctx.fillRect(0, 0, width, height);
  const gradient = ctx.createRadialGradient(width * 0.65, height * 0.25, 5, width * 0.65, height * 0.25, width * 0.8);
  gradient.addColorStop(0, config.glow);
  gradient.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, width, height);
}

function drawStickmanBase(ctx, x, y) {
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(x, y - 18, 10, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y - 8);
  ctx.lineTo(x, y + 18);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y + 18);
  ctx.lineTo(x - 12, y + 38);
  ctx.moveTo(x, y + 18);
  ctx.lineTo(x + 12, y + 38);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x, y + 2);
  ctx.lineTo(x - 16, y + 10);
  ctx.moveTo(x, y + 2);
  ctx.lineTo(x + 18, y - 8);
  ctx.stroke();
}

function drawWeaponStickman(ctx, x, y, config) {
  ctx.strokeStyle = config.main;
  ctx.fillStyle = `${config.accent}33`;
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.moveTo(x + 10, y - 6);
  ctx.lineTo(x + 44, y - 20);
  ctx.lineTo(x + 40, y - 12);
  ctx.lineTo(x + 12, y + 6);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x + 44, y - 20);
  ctx.lineTo(x + 56, y - 24);
  ctx.lineTo(x + 62, y - 18);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x + 50, y - 24, 4, 0, Math.PI * 2);
  ctx.fillStyle = config.glow;
  ctx.fill();
  ctx.strokeStyle = config.accent;
  ctx.stroke();

  ctx.fillStyle = config.main;
  ctx.fillRect(x - 18, y + 4, 10, 18);
  ctx.strokeRect(x - 18, y + 4, 10, 18);
}

function drawSuitStickman(ctx, x, y, config) {
  ctx.strokeStyle = config.main;
  ctx.fillStyle = `${config.accent}33`;
  ctx.lineWidth = 2.5;

  ctx.beginPath();
  ctx.arc(x, y - 18, 12, Math.PI * 1.1, Math.PI * 1.9, true);
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x - 12, y - 2);
  ctx.lineTo(x + 12, y - 2);
  ctx.lineTo(x + 10, y + 18);
  ctx.lineTo(x - 10, y + 18);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(x - 16, y);
  ctx.lineTo(x - 26, y - 4);
  ctx.moveTo(x + 16, y);
  ctx.lineTo(x + 26, y + 4);
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(x, y + 4, 6, 0, Math.PI);
  ctx.stroke();
}

function showScreen(id) {
  [menuScreen, studyScreen, studyDetailScreen, mapScreen, gameScreen].forEach((screen) => {
    screen.classList.remove("active");
  });
  document.getElementById(id).classList.add("active");
}

function getShapeStudyInfo(shapeKey) {
  const info = {
    triangle: {
      sides: 3,
      vertices: 3,
      diagonals: 0,
      angle: "3 ángulos (suman 180°)",
      detail: "Triángulo con 3 ángulos internos cuya suma es 180°."
    },
    square: {
      sides: 4,
      vertices: 4,
      diagonals: 2,
      angle: "4 ángulos de 90°",
      detail: "Cuadrado regular con 4 lados iguales y 4 ángulos rectos."
    },
    rectangle: {
      sides: 4,
      vertices: 4,
      diagonals: 2,
      angle: "4 ángulos de 90°",
      detail: "Rectángulo con 2 pares de lados iguales y 4 ángulos rectos."
    },
    rhombus: {
      sides: 4,
      vertices: 4,
      diagonals: 2,
      angle: "4 ángulos: 2 agudos y 2 obtusos",
      detail: "Rombo con todos los lados iguales y ángulos opuestos iguales."
    },
    parallelogram: {
      sides: 4,
      vertices: 4,
      diagonals: 2,
      angle: "4 ángulos: 2 agudos y 2 obtusos",
      detail: "Romboide con dos pares de lados paralelos y ángulos opuestos iguales."
    },
    trapezoid: {
      sides: 4,
      vertices: 4,
      diagonals: 2,
      angle: "4 ángulos (varían según el tipo)",
      detail: "Trapecio con un solo par de lados paralelos."
    },
    isoscelesTrapezoid: {
      sides: 4,
      vertices: 4,
      angle: "4 ángulos: iguales dos a dos",
      detail: "Trapecio isósceles con 2 lados inclinados iguales y bases paralelas."
    },
    rightTrapezoid: {
      sides: 4,
      vertices: 4,
      diagonals: 2,
      angle: "4 ángulos: 2 rectos, 1 agudo y 1 obtuso",
      detail: "Trapecio rectángulo con un lado vertical y dos ángulos rectos."
    },
    scaleneTrapezoid: {
      sides: 4,
      vertices: 4,
      diagonals: 2,
      angle: "4 ángulos diferentes",
      detail: "Trapecio escaleno con todos los lados y ángulos distintos."
    },
    trapezoide: {
      sides: 4,
      vertices: 4,
      diagonals: 2,
      angle: "4 ángulos (varían)",
      detail: "Trapecioide sin lados paralelos en su forma básica."
    },
    pentagon: {
      sides: 5,
      vertices: 5,
      diagonals: 5,
      angle: "5 ángulos de 108° (regular)",
      detail: "Pentágono regular con 5 lados y 5 ángulos iguales."
    },
    hexagon: {
      sides: 6,
      vertices: 6,
      diagonals: 9,
      angle: "6 ángulos de 120° (regular)",
      detail: "Hexágono regular con 6 lados y 6 ángulos iguales."
    },
    heptagon: {
      sides: 7,
      vertices: 7,
      diagonals: 14,
      angle: "7 ángulos de ≈128.57° (regular)",
      detail: "Heptágono regular con 7 lados y ángulos iguales."
    },
    octagon: {
      sides: 8,
      vertices: 8,
      diagonals: 20,
      angle: "8 ángulos de 135° (regular)",
      detail: "Octágono regular con 8 lados y 8 ángulos iguales."
    },
    nonagon: {
      sides: 9,
      vertices: 9,
      diagonals: 27,
      angle: "9 ángulos de 140° (regular)",
      detail: "Nonágono regular con 9 lados y 9 ángulos iguales."
    },
    decagon: {
      sides: 10,
      vertices: 10,
      diagonals: 35,
      angle: "10 ángulos de 144° (regular)",
      detail: "Decágono regular con 10 lados y 10 ángulos iguales."
    },
    hendecagon: {
      sides: 11,
      vertices: 11,
      diagonals: 44,
      angle: "11 ángulos de ≈147.27° (regular)",
      detail: "Endecágono regular con 11 lados y 11 ángulos iguales."
    },
    dodecagon: {
      sides: 12,
      vertices: 12,
      diagonals: 54,
      angle: "12 ángulos de 150° (regular)",
      detail: "Dodecágono regular con 12 lados y 12 ángulos iguales."
    },
    circle: {
      sides: 0,
      vertices: 0,
      diagonals: "No aplica",
      angle: "No tiene ángulos",
      detail: "Curva cerrada sin lados ni vértices."
    },
    oval: {
      sides: 0,
      vertices: 0,
      diagonals: "No aplica",
      angle: "No tiene ángulos",
      detail: "Curva cerrada similar a un huevo."
    },
    crescent: {
      sides: 0,
      vertices: 0,
      diagonals: "No aplica",
      angle: "No tiene ángulos",
      detail: "Figura curva formada por dos arcos superpuestos."
    },
    star: {
      sides: 10,
      vertices: 10,
      diagonals: "No aplica",
      angle: "10 ángulos (5 exteriores y 5 interiores)",
      detail: "Estrella de 5 puntas con 10 vértices alternos."
    },
    heart: {
      sides: "No tiene lados rectos",
      vertices: "1 (punta inferior)",
      diagonals: "No aplica",
      angle: "No tiene ángulos geométricos definidos",
      detail: "Figura curva simétrica en forma de corazón. Posee una punta inferior que se considera vértice visual."
    },
    semicircle: {
      sides: 1,
      vertices: 2,
      diagonals: 0,
      angle: "2 ángulos de 90°",
      detail: "Semicírculo con un lado recto y un arco."
    },
    rightTriangle: {
      sides: 3,
      vertices: 3,
      diagonals: 0,
      angle: "3 ángulos: 1 de 90° y 2 agudos",
      detail: "Triángulo rectángulo con un ángulo recto."
    },
    isoscelesTriangle: {
      sides: 3,
      vertices: 3,
      diagonals: 0,
      angle: "3 ángulos, 2 iguales",
      detail: "Triángulo isósceles con dos ángulos iguales en la base."
    },
    isoscelesTrapezoid: {
      sides: 4,
      vertices: 4,
      diagonals: 2,
      angle: "4 ángulos, pares de ángulos iguales",
      detail: "Trapecio isósceles con dos lados no paralelos iguales."
    }
  };
  return info[shapeKey] || { sides: "?", vertices: "?", diagonals: "?", angle: "Ángulos según la figura.", detail: "Información general de la figura." };
}

function renderStudyScreen() {
  studyShapeList.innerHTML = "";
  studyInfoBox.innerHTML = `
    <h3>Selecciona una figura</h3>
    <p>Toca una tarjeta para ver los lados, vértices y datos importantes de esa figura.</p>
  `;
  studySelectedShapeIndex = null;
  if (studyStartBtn) studyStartBtn.disabled = true;

  gameData.forEach((shape, index) => {
    const card = document.createElement("div");
    card.className = "study-card";
    card.innerHTML = `
      <h3>${shape.name}</h3>
      <p>Ver información</p>
    `;

    card.addEventListener("click", () => {
      const cards = studyShapeList.querySelectorAll(".study-card");
      cards.forEach((item) => item.classList.remove("active"));
      card.classList.add("active");
      studySelectedShapeIndex = index;
      if (studyStartBtn) studyStartBtn.disabled = false;
      showStudyDetail(shape);
    });

    studyShapeList.appendChild(card);
  });
}

function showStudyDetail(shape) {
  const { sides, vertices, diagonals, angle, detail } = getShapeStudyInfo(shape.shape);
  detailTitle.textContent = shape.name;
  studyDetailInfo.innerHTML = `
    <h3>${shape.name}</h3>
    <ul>
      <li><strong>Lados:</strong> ${sides}</li>
      <li><strong>Vértices:</strong> ${vertices}</li>
      <li><strong>Diagonales:</strong> ${diagonals}</li>
      <li><strong>Ángulo:</strong> ${angle}</li>
      <li><strong>Detalle:</strong> ${detail}</li>
    </ul>
  `;
  currentStudyType = shape.shape;
  drawStudyDetail(shape.shape);
  showScreen("studyDetail");
}

function drawStudyDetail(type) {
  studyDetailCtx.clearRect(0, 0, studyDetailCanvas.width, studyDetailCanvas.height);
  studyDetailCtx.strokeStyle = "#ffffff";
  studyDetailCtx.fillStyle = "rgba(34, 211, 238, 0.16)";
  studyDetailCtx.lineWidth = 4;
  const cx = studyDetailCanvas.width / 2;
  const cy = studyDetailCanvas.height / 2;
  const r = 110;
  studyDetailCtx.beginPath();

  const vertexPoints = [];
  if (["triangle", "rightTriangle", "isoscelesTriangle"].includes(type)) {
    if (type === "rightTriangle") {
      vertexPoints.push({ x: cx - r, y: cy + r });
      vertexPoints.push({ x: cx + r, y: cy + r });
      vertexPoints.push({ x: cx - r, y: cy - r });
    } else if (type === "isoscelesTriangle") {
      vertexPoints.push({ x: cx, y: cy - r });
      vertexPoints.push({ x: cx + r, y: cy + r });
      vertexPoints.push({ x: cx - r, y: cy + r });
    } else {
      vertexPoints.push({ x: cx, y: cy - r });
      vertexPoints.push({ x: cx + r * Math.cos(Math.PI / 6), y: cy + r * Math.sin(Math.PI / 6) });
      vertexPoints.push({ x: cx - r * Math.cos(Math.PI / 6), y: cy + r * Math.sin(Math.PI / 6) });
    }
    studyDetailCtx.moveTo(vertexPoints[0].x, vertexPoints[0].y);
    vertexPoints.slice(1).forEach((p) => studyDetailCtx.lineTo(p.x, p.y));
    studyDetailCtx.closePath();
  } else if (type === "square") {
    vertexPoints.push({ x: cx - 80, y: cy - 80 });
    vertexPoints.push({ x: cx + 80, y: cy - 80 });
    vertexPoints.push({ x: cx + 80, y: cy + 80 });
    vertexPoints.push({ x: cx - 80, y: cy + 80 });
    studyDetailCtx.rect(cx - 80, cy - 80, 160, 160);
  } else if (type === "rectangle") {
    vertexPoints.push({ x: cx - 100, y: cy - 70 });
    vertexPoints.push({ x: cx + 100, y: cy - 70 });
    vertexPoints.push({ x: cx + 100, y: cy + 70 });
    vertexPoints.push({ x: cx - 100, y: cy + 70 });
    studyDetailCtx.rect(cx - 100, cy - 70, 200, 140);
  } else if (type === "rhombus" || type === "parallelogram" || type === "trapezoid" || type === "trapezoide" || type === "isoscelesTrapezoid" || type === "rightTrapezoid" || type === "scaleneTrapezoid") {
    let points;
    if (type === "rhombus") {
      points = [
        { x: cx, y: cy - 100 },
        { x: cx + 80, y: cy },
        { x: cx, y: cy + 100 },
        { x: cx - 80, y: cy }
      ];
    } else if (type === "parallelogram") {
      points = [
        { x: cx - 100, y: cy + 60 },
        { x: cx + 80, y: cy + 60 },
        { x: cx + 40, y: cy - 60 },
        { x: cx - 120, y: cy - 60 }
      ];
    } else if (type === "trapezoid") {
      points = [
        { x: cx - 100, y: cy + 70 },
        { x: cx + 100, y: cy + 70 },
        { x: cx + 40, y: cy - 70 },
        { x: cx - 10, y: cy - 70 }
      ];
    } else if (type === "isoscelesTrapezoid") {
      points = [
        { x: cx - 90, y: cy + 70 },
        { x: cx + 90, y: cy + 70 },
        { x: cx + 45, y: cy - 70 },
        { x: cx - 45, y: cy - 70 }
      ];
    } else if (type === "rightTrapezoid") {
      points = [
        { x: cx - 100, y: cy + 70 },
        { x: cx + 70, y: cy + 70 },
        { x: cx + 20, y: cy - 70 },
        { x: cx - 100, y: cy - 70 }
      ];
    } else if (type === "scaleneTrapezoid") {
      points = [
        { x: cx - 100, y: cy + 70 },
        { x: cx + 80, y: cy + 70 },
        { x: cx + 20, y: cy - 70 },
        { x: cx - 70, y: cy - 40 }
      ];
    } else if (type === "trapezoide") {
      points = [
        { x: cx - 100, y: cy + 70 },
        { x: cx + 80, y: cy + 70 },
        { x: cx + 10, y: cy - 40 },
        { x: cx - 70, y: cy - 20 }
      ];
    } else {
      points = [
        { x: cx - 110, y: cy + 70 },
        { x: cx + 110, y: cy + 70 },
        { x: cx + 80, y: cy - 70 },
        { x: cx - 80, y: cy - 70 }
      ];
    }
    vertexPoints.push(...points);
    studyDetailCtx.moveTo(points[0].x, points[0].y);
    points.slice(1).forEach((p) => studyDetailCtx.lineTo(p.x, p.y));
    studyDetailCtx.closePath();
  } else if (["pentagon", "hexagon", "heptagon", "octagon", "nonagon", "decagon", "hendecagon", "dodecagon"].includes(type)) {
    const sidesMap = { pentagon: 5, hexagon: 6, heptagon: 7, octagon: 8, nonagon: 9, decagon: 10, hendecagon: 11, dodecagon: 12 };
    const sides = sidesMap[type];
    for (let i = 0; i < sides; i += 1) {
      const angle = -Math.PI / 2 + (i * 2 * Math.PI) / sides;
      const x = cx + r * Math.cos(angle);
      const y = cy + r * Math.sin(angle);
      vertexPoints.push({ x, y });
      if (i === 0) studyDetailCtx.moveTo(x, y);
      else studyDetailCtx.lineTo(x, y);
    }
    studyDetailCtx.closePath();
  } else if (type === "circle") {
    studyDetailCtx.arc(cx, cy, r, 0, Math.PI * 2);
  } else if (type === "oval") {
    studyDetailCtx.ellipse(cx, cy, r, r * 0.7, 0, 0, Math.PI * 2);
  } else if (type === "crescent") {
    studyDetailCtx.moveTo(cx, cy - r);
    studyDetailCtx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, false);
    studyDetailCtx.arc(cx + r * 0.25, cy, r * 0.65, Math.PI / 2, -Math.PI / 2, true);
    studyDetailCtx.closePath();
  } else if (type === "star") {
    const outer = r;
    const inner = r * 0.45;
    for (let i = 0; i < 10; i += 1) {
      const angle = -Math.PI / 2 + (i * Math.PI) / 5;
      const radius = i % 2 === 0 ? outer : inner;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      vertexPoints.push({ x, y });
      if (i === 0) studyDetailCtx.moveTo(x, y);
      else studyDetailCtx.lineTo(x, y);
    }
    studyDetailCtx.closePath();
  } else if (type === "heart") {
    studyDetailCtx.moveTo(cx, cy + 40);
    studyDetailCtx.bezierCurveTo(cx - 80, cy - 15, cx - 40, cy - 130, cx, cy - 40);
    studyDetailCtx.bezierCurveTo(cx + 40, cy - 130, cx + 80, cy - 15, cx, cy + 40);
  } else if (type === "semicircle") {
    studyDetailCtx.moveTo(cx - r, cy);
    studyDetailCtx.arc(cx, cy, r, Math.PI, 0, false);
    studyDetailCtx.lineTo(cx - r, cy);
    studyDetailCtx.closePath();
  }

  studyDetailCtx.fill();
  studyDetailCtx.stroke();

  studyDetailCtx.fillStyle = "#ffffff";
  studyDetailCtx.font = "16px Segoe UI";
  studyDetailCtx.fillText(`Lados: ${getShapeStudyInfo(type).sides}`, 16, 24);
  studyDetailCtx.fillText(`Vértices: ${getShapeStudyInfo(type).vertices}`, 16, 44);

  const existingLabels = [];

  // Mostrar todos los vértices si el usuario activa la opción
  if (showAllVertices && vertexPoints.length) {
    const vertexColors = ["#f59e0b", "#22d3ee", "#7c3aed", "#ec4899", "#10b981", "#f97316"];
    for (let i = 0; i < vertexPoints.length; i += 1) {
      const p = vertexPoints[i];
      studyDetailCtx.beginPath();
      studyDetailCtx.fillStyle = vertexColors[i % vertexColors.length];
      studyDetailCtx.arc(p.x, p.y, 8, 0, Math.PI * 2);
      studyDetailCtx.fill();
      studyDetailCtx.lineWidth = 2;
      studyDetailCtx.strokeStyle = "#ffffff";
      studyDetailCtx.stroke();
      existingLabels.push({ x: p.x, y: p.y, r: 10 });
    }
  }

  // Mostrar todos los lados si el usuario activa la opción
  if (showAllSides && vertexPoints.length >= 2) {
    for (let i = 0; i < vertexPoints.length; i += 1) {
      const a = vertexPoints[i];
      const b = vertexPoints[(i + 1) % vertexPoints.length];
      const midX = (a.x + b.x) / 2;
      const midY = (a.y + b.y) / 2;
      studyDetailCtx.beginPath();
      studyDetailCtx.fillStyle = "#ffffff";
      studyDetailCtx.arc(midX, midY, 7, 0, Math.PI * 2);
      studyDetailCtx.fill();
      studyDetailCtx.lineWidth = 2;
      studyDetailCtx.strokeStyle = "#22d3ee";
      studyDetailCtx.stroke();
      existingLabels.push({ x: midX, y: midY, r: 9 });
    }
  }

  // Mostrar todas las diagonales si el usuario activa la opción
  if (showAllDiagonals && vertexPoints.length >= 4) {
    studyDetailCtx.save();
    studyDetailCtx.strokeStyle = "rgba(248,113,113,0.7)";
    studyDetailCtx.lineWidth = 2;
    studyDetailCtx.setLineDash([8, 6]);
    for (let i = 0; i < vertexPoints.length; i += 1) {
      for (let j = i + 1; j < vertexPoints.length; j += 1) {
        const isAdjacent = j === i + 1 || (i === 0 && j === vertexPoints.length - 1);
        if (isAdjacent) continue;
        studyDetailCtx.beginPath();
        studyDetailCtx.moveTo(vertexPoints[i].x, vertexPoints[i].y);
        studyDetailCtx.lineTo(vertexPoints[j].x, vertexPoints[j].y);
        studyDetailCtx.stroke();
      }
    }
    studyDetailCtx.restore();
  }

  // Mostrar todos los ángulos si el usuario activa la opción
  if (showAllAngles && vertexPoints.length >= 3) {
    for (let i = 0; i < vertexPoints.length; i += 1) {
      const pA = vertexPoints[i];
      const pB = vertexPoints[(i + 1) % vertexPoints.length];
      const pC = vertexPoints[(i - 1 + vertexPoints.length) % vertexPoints.length];
      const v1 = { x: pB.x - pA.x, y: pB.y - pA.y };
      const v2 = { x: pC.x - pA.x, y: pC.y - pA.y };
      const ang1 = Math.atan2(v1.y, v1.x);
      const ang2 = Math.atan2(v2.y, v2.x);
      let a1 = ang1;
      let a2 = ang2;
      if (a2 - a1 > Math.PI) a2 -= 2 * Math.PI;
      if (a2 - a1 < -Math.PI) a2 += 2 * Math.PI;
      studyDetailCtx.beginPath();
      studyDetailCtx.strokeStyle = "rgba(255,255,255,0.7)";
      studyDetailCtx.lineWidth = 1.8;
      studyDetailCtx.arc(pA.x, pA.y, 18, a1, a2, false);
      studyDetailCtx.stroke();
      studyDetailCtx.beginPath();
      studyDetailCtx.fillStyle = "#f59e0b";
      studyDetailCtx.arc(pA.x, pA.y, 5, 0, Math.PI * 2);
      studyDetailCtx.fill();
      studyDetailCtx.lineWidth = 1.5;
      studyDetailCtx.strokeStyle = "#ffffff";
      studyDetailCtx.stroke();
      existingLabels.push({ x: pA.x, y: pA.y, r: 18 });
    }
  }
}

function renderShapeOptions() {
  const filterRaw = (shapeSearch && shapeSearch.value) ? shapeSearch.value.trim() : "";
  const filter = filterRaw.toLowerCase();
  shapeGrid.innerHTML = "";
  gameData.forEach((shape, index) => {
    if (filter && !shape.name.toLowerCase().includes(filter)) return;
    const card = document.createElement("div");
    card.className = "planet";
    // resaltar coincidencia en el nombre si existe filtro
    const nameHtml = filter
      ? shape.name.replace(new RegExp(escapeRegExp(filterRaw), "ig"), (m) => `<span class="highlight">${m}</span>`)
      : shape.name;
    card.innerHTML = `
      <canvas class="shape-preview" width="220" height="100"></canvas>
      <h3>${nameHtml}</h3>
      <p>Figura geométrica</p>
    `;
    const canvas = card.querySelector("canvas");
    drawPreviewShape(canvas, shape.shape);
    card.addEventListener("click", () => selectShape(index, card));
    shapeGrid.appendChild(card);
  });
  if (!shapeGrid.children.length) {
    shapeGrid.innerHTML = `<div class="no-results">No se encontraron figuras</div>`;
  }
}

function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function drawPreviewShape(canvas, type) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "#ffffff";
  ctx.lineWidth = 4;
  ctx.fillStyle = "rgba(255, 255, 255, 0.08)";

  const cx = canvas.width / 2;
  const cy = canvas.height / 2;
  const r = 32;
  ctx.beginPath();

  if (type === "triangle") {
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx + r * Math.cos(Math.PI / 6), cy + r * Math.sin(Math.PI / 6));
    ctx.lineTo(cx - r * Math.cos(Math.PI / 6), cy + r * Math.sin(Math.PI / 6));
    ctx.closePath();
  } else if (type === "square") {
    ctx.rect(cx - 25, cy - 25, 50, 50);
  } else if (type === "rectangle") {
    ctx.rect(cx - 30, cy - 20, 60, 40);
  } else if (["pentagon", "hexagon", "heptagon", "octagon", "nonagon", "decagon", "hendecagon", "dodecagon"].includes(type)) {
    const sidesMap = {
      pentagon: 5,
      hexagon: 6,
      heptagon: 7,
      octagon: 8,
      nonagon: 9,
      decagon: 10,
      hendecagon: 11,
      dodecagon: 12
    };
    drawRegularPolygon(ctx, cx, cy, r, sidesMap[type]);
  } else if (type === "rhombus") {
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx + 30, cy);
    ctx.lineTo(cx, cy + r);
    ctx.lineTo(cx - 30, cy);
    ctx.closePath();
  } else if (type === "parallelogram") {
    ctx.moveTo(cx - 30, cy + 20);
    ctx.lineTo(cx + 30, cy + 20);
    ctx.lineTo(cx + 20, cy - 20);
    ctx.lineTo(cx - 20, cy - 20);
    ctx.closePath();
  } else if (type === "trapezoid") {
    ctx.moveTo(cx - 30, cy + 20);
    ctx.lineTo(cx + 30, cy + 20);
    ctx.lineTo(cx + 18, cy - 20);
    ctx.lineTo(cx - 18, cy - 20);
    ctx.closePath();
  } else if (type === "isoscelesTrapezoid") {
    ctx.moveTo(cx - 28, cy + 20);
    ctx.lineTo(cx + 28, cy + 20);
    ctx.lineTo(cx + 16, cy - 20);
    ctx.lineTo(cx - 16, cy - 20);
    ctx.closePath();
  } else if (type === "rightTrapezoid") {
    ctx.moveTo(cx - 30, cy + 20);
    ctx.lineTo(cx + 20, cy + 20);
    ctx.lineTo(cx + 10, cy - 20);
    ctx.lineTo(cx - 30, cy - 20);
    ctx.closePath();
  } else if (type === "scaleneTrapezoid") {
    ctx.moveTo(cx - 30, cy + 20);
    ctx.lineTo(cx + 25, cy + 20);
    ctx.lineTo(cx + 5, cy - 20);
    ctx.lineTo(cx - 25, cy - 12);
    ctx.closePath();
  } else if (type === "trapezoide") {
    ctx.moveTo(cx - 33, cy + 18);
    ctx.lineTo(cx + 25, cy + 20);
    ctx.lineTo(cx + 15, cy - 20);
    ctx.lineTo(cx - 27, cy - 22);
    ctx.closePath();
  } else if (type === "circle") {
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
  } else if (type === "oval") {
    ctx.ellipse(cx, cy, r, r * 0.65, 0, 0, Math.PI * 2);
  } else if (type === "crescent") {
    ctx.moveTo(cx, cy - r);
    ctx.arc(cx, cy, r, -Math.PI / 2, Math.PI / 2, false);
    ctx.arc(cx + r * 0.3, cy, r * 0.7, Math.PI / 2, -Math.PI / 2, true);
    ctx.closePath();
  } else if (type === "star") {
    const outer = r;
    const inner = r * 0.45;
    for (let i = 0; i < 10; i += 1) {
      const angle = -Math.PI / 2 + (i * Math.PI) / 5;
      const radius = i % 2 === 0 ? outer : inner;
      const x = cx + radius * Math.cos(angle);
      const y = cy + radius * Math.sin(angle);
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.closePath();
  } else if (type === "heart") {
    ctx.moveTo(cx, cy + 10);
    ctx.bezierCurveTo(cx - 35, cy - 15, cx - 15, cy - 45, cx, cy - 15);
    ctx.bezierCurveTo(cx + 15, cy - 45, cx + 35, cy - 15, cx, cy + 10);
    ctx.closePath();
  } else if (type === "semicircle") {
    ctx.moveTo(cx - r, cy);
    ctx.arc(cx, cy, r, Math.PI, 0, false);
    ctx.lineTo(cx - r, cy);
    ctx.closePath();
  } else if (type === "rightTriangle") {
    ctx.moveTo(cx - r, cy + r);
    ctx.lineTo(cx + r, cy + r);
    ctx.lineTo(cx - r, cy - r);
    ctx.closePath();
  } else if (type === "isoscelesTriangle") {
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx + r, cy + r);
    ctx.lineTo(cx - r, cy + r);
    ctx.closePath();
  } else if (type === "isoscelesTrapezoid") {
    ctx.moveTo(cx - 28, cy + 18);
    ctx.lineTo(cx + 28, cy + 18);
    ctx.lineTo(cx + 18, cy - 18);
    ctx.lineTo(cx - 18, cy - 18);
    ctx.closePath();
  }

  ctx.fill();
  ctx.stroke();
}

function selectShape(index, card) {
  if (selectedShapes.has(index)) {
    selectedShapes.delete(index);
    card.classList.remove("selected");
  } else {
    selectedShapes.add(index);
    card.classList.add("selected");
  }
  setStartButtonState();
}

function setStartButtonState() {
  startBattleBtn.disabled = selectedShapes.size === 0;
}

function getCombinedPool() {
  const pool = [];
  activeShapeIndexes.forEach((shapeIndex) => {
    gameData[shapeIndex].pool.forEach((question, questionIndex) => {
      pool.push({ shapeIndex, questionIndex, question });
    });
  });
  return pool;
}

function beginBattle(shapeIndexes) {
  if (!shapeIndexes || shapeIndexes.length === 0) return;
  activeShapeIndexes = Array.from(shapeIndexes);
  const combinedPool = getCombinedPool();
  currentPlanetIndex = activeShapeIndexes[Math.floor(Math.random() * activeShapeIndexes.length)];
  bossMaxLife = Math.max(MAX_LIFE, combinedPool.length * DAMAGE);
  bossLife = bossMaxLife;
  player.life = player.maxLife;
  heroInjured = 0;
  alienInjured = 0;
  usedQuestionKeys = new Set();
  failedQuestionKeys.clear();
  wrongAnswers = 0;
  battleLocked = false;
  clearCombatIntervals();
  planetNameEl.textContent = gameData[currentPlanetIndex].name;
  showScreen("game");
  drawShape(gameData[currentPlanetIndex].shape);
  updateHud();
  loadNextQuestion();
}

function startBattle() {
  if (selectedShapes.size === 0) return;
  beginBattle(Array.from(selectedShapes));
}

function start() {
  load();
  selectedShapes.clear();
  renderShapeOptions();
  startBackgroundMusic();
  // conectar buscador para filtrar figuras
  if (shapeSearch) {
    shapeSearch.addEventListener("input", () => {
      renderShapeOptions();
      // mostrar/ocultar botón limpiar
      if (shapeSearchClear) shapeSearchClear.style.display = shapeSearch.value ? "inline-flex" : "none";
    });
    if (shapeSearchClear) {
      shapeSearchClear.addEventListener("click", () => {
        shapeSearch.value = "";
        shapeSearchClear.style.display = "none";
        renderShapeOptions();
        shapeSearch.focus();
      });
      // init clear button visibility
      shapeSearchClear.style.display = shapeSearch.value ? "inline-flex" : "none";
    }
  }
  setStartButtonState();
  showScreen("map");
}

function loadNextQuestion() {
  const combinedPool = getCombinedPool();
  let poolItems = combinedPool;

  if (wrongAnswers >= 10 && failedQuestionKeys.size > 0) {
    poolItems = combinedPool.filter((item) => failedQuestionKeys.has(`${item.shapeIndex}-${item.questionIndex}`));
    statusMessageEl.textContent = "Modo repite falladas: responde las preguntas que fallaste y vence al enemigo.";
  } else {
    statusMessageEl.textContent = "";
  }

  if (poolItems.length === 0) {
    poolItems = combinedPool;
  }

  if (usedQuestionKeys.size >= poolItems.length) {
    usedQuestionKeys.clear();
  }

  let nextItem = poolItems[Math.floor(Math.random() * poolItems.length)];
  let nextKey = `${nextItem.shapeIndex}-${nextItem.questionIndex}`;
  while (usedQuestionKeys.has(nextKey)) {
    nextItem = poolItems[Math.floor(Math.random() * poolItems.length)];
    nextKey = `${nextItem.shapeIndex}-${nextItem.questionIndex}`;
  }

  usedQuestionKeys.add(nextKey);
  currentPlanetIndex = nextItem.shapeIndex;
  currentQuestionObjIndex = nextItem.questionIndex;
  currentQuestionObj = nextItem.question;
  planetNameEl.textContent = gameData[currentPlanetIndex].name;
  drawShape(gameData[currentPlanetIndex].shape);

  questionEl.textContent = currentQuestionObj.q;

  answersEl.innerHTML = "";
  currentQuestionObj.a.forEach((option, idx) => {
    const btn = document.createElement("button");
    btn.className = "btn secondary";
    btn.textContent = option;
    btn.addEventListener("click", () => checkAnswer(idx));
    answersEl.appendChild(btn);
  });
}

function checkAnswer(chosenIndex) {
  if (battleLocked) return;
  const buttons = answersEl.querySelectorAll("button");
  buttons.forEach((btn) => {
    btn.disabled = true;
    btn.classList.add("disabled");
  });

  if (chosenIndex === currentQuestionObj.c) {
    firePlasmaBall("alien", () => {
      bossLife -= DAMAGE;
      player.score += 10;
      correctStreak += 1;
      setInjury("alien");
      failedQuestionKeys.delete(`${currentPlanetIndex}-${currentQuestionObjIndex}`);
      statusMessageEl.textContent = `¡Correcto! +10 puntos`;
      updateHud();
      save();

      if (bossLife <= 0) {
        updateHud();
        save();
        showVictory();
      } else {
        loadNextQuestion();
      }
    });
  } else {
    firePlasmaBall("hero", () => {
      player.life -= DAMAGE;
      player.xCount += 1;
      setInjury("hero");
      correctStreak = 0;
      wrongAnswers += 1;
      failedQuestionKeys.add(`${currentPlanetIndex}-${currentQuestionObjIndex}`);
      statusMessageEl.textContent = `¡Fallaste! +1 X`;
      updateHud();
      save();

      if (player.life <= 0) {
        player.maxLife = MAX_LIFE;
        player.life = MAX_LIFE;
        player.level = 1;
        save();
        showGameOver();
      } else {
        loadNextQuestion();
      }
    });
  }
}

function backToMap() {
  showScreen("map");
}

function resizeStars() {
  const canvas = document.getElementById("stars");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  stars = Array.from({ length: 220 }, () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    r: Math.random() * 2 + 0.4,
    speed: Math.random() * 0.4 + 0.2
  }));
  drawStars(ctx);
}

function drawStars(ctx) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  const colors = [
    "#ff9f43", // naranja
    "#facc15", // amarillo
    "#34d399", // verde
    "#7dd3fc", // celeste
    "#ffffff", // blanco
    "#f9a8d4", // rosado
    "#c084fc"  // morado
  ];

  stars.forEach((s, index) => {
    const colorIndex = Math.floor((performance.now() / 1000 + index * 0.2) % colors.length);
    ctx.fillStyle = colors[colorIndex];
    ctx.beginPath();
    ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
    ctx.fill();
    s.y += s.speed;
    if (s.y > ctx.canvas.height) {
      s.y = 0;
      s.x = Math.random() * ctx.canvas.width;
    }
  });
  requestAnimationFrame(() => drawStars(ctx));
}

let stars = [];

function showGameOver() {
  document.getElementById("finalScore").textContent = player.score;
  document.getElementById("finalX").textContent = player.xCount;
  document.getElementById("gameOverModal").classList.add("visible");
}

function showVictory() {
  document.getElementById("victoryModal").classList.add("visible");
  document.getElementById("statusMessage").textContent = "¡Victoria! Has derrotado al enemigo.";
  document.getElementById("victoryScore").textContent = player.score;
  document.getElementById("victoryErrors").textContent = wrongAnswers;
  createConfetti();
  playVictorySound();
}

function hideVictory() {
  document.getElementById("victoryModal").classList.remove("visible");
  showScreen("map");
}

function createConfetti() {
  const colors = ["#22d3ee", "#facc15", "#fb7185", "#34d399", "#818cf8"];
  const pieces = 25;

  for (let i = 0; i < pieces; i += 1) {
    const confetti = document.createElement("div");
    confetti.className = "confetti-piece";
    const size = Math.random() * 8 + 6;
    const left = Math.random() * window.innerWidth;
    const delay = Math.random() * 0.3;
    const xOffset = Math.random() * 200 - 100;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size * 0.6}px`;
    confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.left = `${left}px`;
    confetti.style.top = `-20px`;
    confetti.style.setProperty("--confetti-x", `${xOffset}px`);
    confetti.style.animationDelay = `${delay}s`;
    document.body.appendChild(confetti);

    setTimeout(() => {
      confetti.remove();
    }, 2200);
  }
}

function restartGame() {
  document.getElementById("gameOverModal").classList.remove("visible");
  player.life = MAX_LIFE;
  player.maxLife = MAX_LIFE;
  save();
  updateHud();
  selectedShapes.clear();
  renderShapeOptions();
  setStartButtonState();
  showScreen("map");
}

function animate() {
  if (gameScreen.classList.contains("active")) {
    drawStickmen();
  }
  requestAnimationFrame(animate);
}

document.getElementById("startBtn").addEventListener("click", start);
document.getElementById("studyBtn").addEventListener("click", () => {
  renderStudyScreen();
  showScreen("study");
});
document.getElementById("studyStartBtn").addEventListener("click", () => {
  startBackgroundMusic();
  if (studySelectedShapeIndex !== null) {
    beginBattle([studySelectedShapeIndex]);
  } else {
    start();
  }
});
document.getElementById("studyDetailStartBtn").addEventListener("click", () => {
  startBackgroundMusic();
  if (studySelectedShapeIndex !== null) {
    beginBattle([studySelectedShapeIndex]);
  } else {
    start();
  }
});
document.getElementById("startBattleBtn").addEventListener("click", startBattle);
document.getElementById("backToHomeBtn").addEventListener("click", () => showScreen("menu"));
document.getElementById("retreatBtn").addEventListener("click", backToMap);
backFromStudyBtn.addEventListener("click", () => showScreen("menu"));
studyBackBtn.addEventListener("click", () => showScreen("study"));
document.getElementById("retryGameBtn").addEventListener("click", restartGame);
document.getElementById("continueBtn").addEventListener("click", hideVictory);

// Toggle buttons for study detail annotations
const showVerticesBtn = document.getElementById("showVerticesBtn");
const showSidesBtn = document.getElementById("showSidesBtn");
const showAnglesBtn = document.getElementById("showAnglesBtn");
const showDiagonalsBtn = document.getElementById("showDiagonalsBtn");
if (showVerticesBtn) {
  showVerticesBtn.addEventListener("click", () => {
    showAllVertices = !showAllVertices;
    showVerticesBtn.classList.toggle("active", showAllVertices);
    if (currentStudyType) drawStudyDetail(currentStudyType);
  });
}
if (showSidesBtn) {
  showSidesBtn.addEventListener("click", () => {
    showAllSides = !showAllSides;
    showSidesBtn.classList.toggle("active", showAllSides);
    if (currentStudyType) drawStudyDetail(currentStudyType);
  });
}
if (showAnglesBtn) {
  showAnglesBtn.addEventListener("click", () => {
    showAllAngles = !showAllAngles;
    showAnglesBtn.classList.toggle("active", showAllAngles);
    if (currentStudyType) drawStudyDetail(currentStudyType);
  });
}
if (showDiagonalsBtn) {
  showDiagonalsBtn.addEventListener("click", () => {
    showAllDiagonals = !showAllDiagonals;
    showDiagonalsBtn.classList.toggle("active", showAllDiagonals);
    if (currentStudyType) drawStudyDetail(currentStudyType);
  });
}

window.addEventListener("resize", resizeStars);

resizeStars();
animate();
load();

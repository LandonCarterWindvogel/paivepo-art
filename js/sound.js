/**
 * sound.js — Audio feedback and ambient soundscape
 * Enhanced with immersive ambient sounds for a premium experience
 */

let ctx = null;
let enabled = true;
let ambientNodes = [];
let ambientGain = null;
let isAmbientPlaying = false;
let ambientInterval = null;

// ── Audio Context ──
function getCtx() {
  if (!ctx) {
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    // Create master gain for ambient sounds
    ambientGain = ctx.createGain();
    ambientGain.gain.setValueAtTime(0.03, ctx.currentTime);
    ambientGain.connect(ctx.destination);
  }
  return ctx;
}

// ── Play a tone (click, nav, etc.) ──
function playTone(freq, duration, gain = 0.06, type = 'sine', fadeOut = true) {
  if (!enabled) return;
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.connect(g);
    g.connect(ac.destination);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    g.gain.setValueAtTime(gain, ac.currentTime);
    if (fadeOut) g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + duration);
  } catch (_) {}
}

// ── Play a chord (richer sound) ──
function playChord(frequencies, duration, gain = 0.04) {
  if (!enabled) return;
  try {
    const ac = getCtx();
    frequencies.forEach((freq, i) => {
      const osc = ac.createOscillator();
      const g = ac.createGain();
      osc.connect(g);
      g.connect(ac.destination);
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, ac.currentTime + i * 0.05);
      g.gain.setValueAtTime(gain * (1 - i * 0.15), ac.currentTime + i * 0.05);
      g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration + i * 0.05);
      osc.start(ac.currentTime + i * 0.05);
      osc.stop(ac.currentTime + duration + i * 0.05);
    });
  } catch (_) {}
}

// ── SOUND EFFECTS ──
export const sounds = {
  click() {
    playTone(880, 0.08, 0.05, 'sine');
  },
  nav() {
    playTone(660, 0.12, 0.04, 'sine');
    setTimeout(() => playTone(880, 0.1, 0.03, 'sine'), 40);
  },
  addCart() {
    playChord([523, 659, 784], 0.25, 0.05);
  },
  cartOpen() {
    playChord([440, 554, 659], 0.2, 0.04);
  },
  sold() {
    playTone(330, 0.3, 0.04, 'sine');
    setTimeout(() => playTone(440, 0.2, 0.03, 'sine'), 150);
  },
  hover() {
    playTone(1200, 0.04, 0.018, 'sine');
  },
  // New: Subtle "welcome" sound on page load
  welcome() {
    setTimeout(() => {
      playChord([523, 659, 784, 1047], 0.6, 0.03);
    }, 500);
  },
  // New: "success" sound for form submissions
  success() {
    playChord([523, 659, 784, 1047], 0.4, 0.045);
  },
};

// ── AMBIENT SOUNDSCAPE ──
function createAmbientNote(freq, duration, gain = 0.015, type = 'sine') {
  try {
    const ac = getCtx();
    const osc = ac.createOscillator();
    const g = ac.createGain();
    osc.connect(g);
    g.connect(ambientGain);
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ac.currentTime);
    g.gain.setValueAtTime(gain, ac.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + duration);
    osc.start(ac.currentTime);
    osc.stop(ac.currentTime + duration);
    return { osc, g };
  } catch (_) { return null; }
}

function generateAmbientLayer() {
  if (!enabled || !isAmbientPlaying) return;

  const notes = [
    // Random notes in a gentle African-inspired pentatonic scale
    [440, 523, 659], // A, C, E
    [523, 659, 784], // C, E, G
    [587, 740, 880], // D, F#, A
    [659, 784, 1047], // E, G, C
    [370, 523, 740], // F#, A, D
  ];

  const chord = notes[Math.floor(Math.random() * notes.length)];
  const duration = 2 + Math.random() * 3;
  const gain = 0.008 + Math.random() * 0.012;

  chord.forEach((freq, i) => {
    setTimeout(() => {
      createAmbientNote(freq, duration, gain * (1 - i * 0.2), 'sine');
    }, i * 150);
  });

  // Random gentle shimmer
  if (Math.random() > 0.5) {
    setTimeout(() => {
      createAmbientNote(800 + Math.random() * 400, 0.5, 0.005, 'sine');
    }, duration * 1000 * 0.3);
  }
}

export function startAmbientSound() {
  if (isAmbientPlaying) return;
  if (!enabled) return;

  try {
    getCtx();
    isAmbientPlaying = true;

    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }

    sounds.welcome();

    generateAmbientLayer();
    ambientInterval = setInterval(generateAmbientLayer, 4000 + Math.random() * 3000);
  } catch (_) {}
}

export function stopAmbientSound() {
  isAmbientPlaying = false;
  if (ambientInterval) {
    clearInterval(ambientInterval);
    ambientInterval = null;
  }
  if (ambientGain) {
    try {
      ambientGain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
      setTimeout(() => {
        if (ambientGain) ambientGain.gain.setValueAtTime(0.03, ctx.currentTime);
      }, 500);
    } catch (_) {}
  }
}

export function toggleSound() {
  enabled = !enabled;
  if (enabled) {
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
    startAmbientSound();
  } else {
    stopAmbientSound();
  }
  return enabled;
}

export function getSoundState() {
  return enabled;
}

export function initSound() {
  let hasStarted = false;

  function startOnInteraction() {
    if (hasStarted) return;
    hasStarted = true;
    startAmbientSound();
    document.removeEventListener('click', startOnInteraction);
    document.removeEventListener('touchstart', startOnInteraction);
    document.removeEventListener('keydown', startOnInteraction);
  }

  document.addEventListener('click', startOnInteraction);
  document.addEventListener('touchstart', startOnInteraction);
  document.addEventListener('keydown', startOnInteraction);

  if (document.hasFocus()) {
    setTimeout(() => {
      if (!hasStarted && document.hasFocus()) {
        // Don't auto-start, wait for interaction
      }
    }, 1000);
  }

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopAmbientSound();
    } else if (enabled && !document.hidden) {
      startAmbientSound();
    }
  });

  document.addEventListener('click', () => {
    if (ctx && ctx.state === 'suspended') {
      ctx.resume();
    }
  }, true);
}
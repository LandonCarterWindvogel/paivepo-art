let ctx = null;
let enabled = true;

function getCtx() {
  if (!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
  return ctx;
}

function playTone(freq, duration, gain = 0.06, type = 'sine', fadeOut = true) {
  if (!enabled) return;
  try {
    const ac  = getCtx();
    const osc = ac.createOscillator();
    const g   = ac.createGain();
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

export const sounds = {
  click() {
    playTone(880, 0.08, 0.05, 'sine');
  },
  nav() {
    playTone(660, 0.12, 0.04, 'sine');
    setTimeout(() => playTone(880, 0.1, 0.03, 'sine'), 40);
  },
  addCart() {
    playTone(523, 0.1, 0.05, 'sine');
    setTimeout(() => playTone(659, 0.1, 0.05, 'sine'), 80);
    setTimeout(() => playTone(784, 0.18, 0.05, 'sine'), 160);
  },
  cartOpen() {
    playTone(440, 0.15, 0.04, 'sine');
    setTimeout(() => playTone(554, 0.12, 0.03, 'sine'), 60);
  },
  sold() {
    playTone(330, 0.2, 0.04, 'sine');
  },
  hover() {
    playTone(1200, 0.04, 0.018, 'sine');
  },
};

export function toggleSound() {
  enabled = !enabled;
  return enabled;
}

export function isSoundEnabled() {
  return enabled;
}

export function initSound() {
  document.addEventListener('click', () => {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }, { once: true });
}

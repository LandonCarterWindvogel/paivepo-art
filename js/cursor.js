import { sounds } from './sound.js';

const INTERACTIVE = 'a, button, [data-page], [data-prod-id], .gal-card:not(.is-sold), .feat-item, .rel-card:not(.is-sold), .thumb, .abt-photo, .sec-link, .btn';

const BEAD_COLOURS = [
  '#C0BAB0', '#928D84', '#B8A898', '#EDEAE4',
  '#2B2926', '#D4C5B5', '#A89880', '#E8E0D5',
];

let beads       = [];
let mouseX      = 0;
let mouseY      = 0;
let ringX       = 0;
let ringY       = 0;
let lastBeadX   = 0;
let lastBeadY   = 0;
let isHovering  = false;
let lastHoverSound = 0;

class Bead {
  constructor(x, y) {
    this.x    = x;
    this.y    = y;
    this.vx   = (Math.random() - 0.5) * 3;
    this.vy   = (Math.random() - 0.5) * 3 - 1;
    this.r    = Math.random() * 3 + 2;
    this.life = 1;
    this.decay = Math.random() * 0.025 + 0.018;
    this.colour = BEAD_COLOURS[Math.floor(Math.random() * BEAD_COLOURS.length)];
    this.gravity = 0.08;
  }

  update() {
    this.vy   += this.gravity;
    this.x    += this.vx;
    this.y    += this.vy;
    this.vx   *= 0.97;
    this.life -= this.decay;
  }

  draw(ctx) {
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.colour;
    ctx.fill();
    ctx.restore();
  }
}

export function initCursor() {
  const dot    = document.getElementById('cur');
  const ring   = document.getElementById('cur-r');
  const canvas = document.createElement('canvas');

  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:9997;';
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');

  window.addEventListener('resize', () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  });

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    if (dot) { dot.style.left = `${mouseX}px`; dot.style.top = `${mouseY}px`; }

    const dx   = mouseX - lastBeadX;
    const dy   = mouseY - lastBeadY;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist > 18) {
      beads.push(new Bead(mouseX, mouseY));
      if (beads.length > 120) beads.shift();
      lastBeadX = mouseX;
      lastBeadY = mouseY;
    }
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    if (ring) { ring.style.left = `${ringX}px`; ring.style.top = `${ringY}px`; }
  }

  let rafId = null;
  function loop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    beads = beads.filter(b => b.life > 0);
    beads.forEach(b => { b.update(); b.draw(ctx); });
    animateRing();
    rafId = requestAnimationFrame(loop);
  }
  loop();

  // Pause RAF when tab is hidden to save battery/CPU
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (rafId) { cancelAnimationFrame(rafId); rafId = null; }
    } else {
      if (!rafId) loop();
    }
  });

  document.addEventListener('mouseover', e => {
    if (!e.target.closest(INTERACTIVE)) return;
    document.body.classList.add('cur-big');
    if (!isHovering) {
      isHovering = true;
      const now = Date.now();
      if (now - lastHoverSound > 120) {
        sounds.hover();
        lastHoverSound = now;
      }
    }
  });

  document.addEventListener('mouseout', e => {
    if (!e.target.closest(INTERACTIVE)) return;
    document.body.classList.remove('cur-big');
    isHovering = false;
  });
}

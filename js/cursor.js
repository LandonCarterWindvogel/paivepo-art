/**
 * cursor.js — Custom cursor with bead trail
 * Final polished version with improved performance and visual effects
 */

import { sounds } from './sound.js';

// ── CONFIGURATION ──
const CONFIG = {
  // Interactive elements that trigger the "big" cursor
  interactiveSelector:
    'a, button, [data-page], [data-prod-id], .gal-card:not(.is-sold), .feat-item, .rel-card:not(.is-sold), .thumb, .abt-photo, .sec-link, .btn, .coll-btn, .artist-cta, .journal-read, .nav-link, .logo, .cart-btn, .comm-cta, .story-cta, .hero-cta, .nl-btn, .fsub, .co-btn, .wa-btn, .mm-link, .mm-close',

  // Bead colours (African-inspired palette)
  beadColours: [
    '#C0BAB0', '#928D84', '#B8A898', '#EDEAE4',
    '#2B2926', '#D4C5B5', '#A89880', '#E8E0D5',
    '#B89464', '#CEAA7A', '#8B7355', '#D4C4B0',
  ],

  // Max beads based on device capability
  maxBeadsDesktop: 40,
  maxBeadsMobile: 20,
  maxBeadsLowEnd: 12,

  // Bead properties
  beadSizeMin: 1.5,
  beadSizeMax: 3.5,
  beadDecayMin: 0.015,
  beadDecayMax: 0.025,
  beadGravity: 0.06,
  beadSpread: 2.5,
  beadDistanceThreshold: 20,

  // Cursor properties
  cursorSize: 7,
  ringSize: 30,
  ringScaleHover: 1.6,
  transitionDuration: 0.25,
};

// ── STATE ──
let beads = [];
let mouseX = 0;
let mouseY = 0;
let isHovering = false;
let lastHoverSound = 0;
let rafId = null;
let canvas = null;
let ctx = null;

const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
const isLowEnd = navigator.hardwareConcurrency ? navigator.hardwareConcurrency <= 4 : false;

// Determine max beads
const MAX_BEADS = isTouch ? 0 :
                  isLowEnd ? CONFIG.maxBeadsLowEnd :
                  window.innerWidth < 768 ? CONFIG.maxBeadsMobile :
                  CONFIG.maxBeadsDesktop;

// ── BEAD CLASS ──
class Bead {
  constructor(x, y) {
    const size = CONFIG.beadSizeMin + Math.random() * (CONFIG.beadSizeMax - CONFIG.beadSizeMin);
    this.x = x;
    this.y = y;
    this.vx = (Math.random() - 0.5) * CONFIG.beadSpread;
    this.vy = (Math.random() - 0.5) * CONFIG.beadSpread - 0.5;
    this.r = size;
    this.life = 1;
    this.decay = CONFIG.beadDecayMin + Math.random() * (CONFIG.beadDecayMax - CONFIG.beadDecayMin);
    this.colour = CONFIG.beadColours[Math.floor(Math.random() * CONFIG.beadColours.length)];
    this.gravity = CONFIG.beadGravity;
    this.rotation = Math.random() * Math.PI * 2;
    this.rotationSpeed = (Math.random() - 0.5) * 0.02;
  }

  update() {
    this.vy += this.gravity;
    this.x += this.vx;
    this.y += this.vy;
    this.vx *= 0.97;
    this.vy *= 0.97;
    this.life -= this.decay;
    this.rotation += this.rotationSpeed;
  }

  draw(ctx) {
    if (this.life <= 0) return;

    const alpha = Math.max(0, this.life);
    const size = this.r * (0.5 + 0.5 * this.life);

    ctx.save();
    ctx.globalAlpha = alpha * 0.9;

    // Glow effect
    const gradient = ctx.createRadialGradient(
      this.x, this.y, 0,
      this.x, this.y, size * 2
    );
    gradient.addColorStop(0, this.colour);
    gradient.addColorStop(1, this.colour + '00');

    ctx.beginPath();
    ctx.arc(this.x, this.y, size * 2, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Main bead
    ctx.beginPath();
    ctx.arc(this.x, this.y, size, 0, Math.PI * 2);
    ctx.fillStyle = this.colour;
    ctx.fill();

    // Highlight
    ctx.globalAlpha = alpha * 0.3;
    ctx.beginPath();
    ctx.arc(this.x - size * 0.25, this.y - size * 0.25, size * 0.35, 0, Math.PI * 2);
    ctx.fillStyle = '#FFFFFF';
    ctx.fill();

    ctx.restore();
  }
}

// ── INITIALIZATION ──
export function initCursor() {
  const dot = document.getElementById('cur');
  const ring = document.getElementById('cur-r');

  // Skip if no cursor elements or touch device
  if (!dot || !ring || isTouch) {
    if (dot) dot.style.display = 'none';
    if (ring) ring.style.display = 'none';
    return;
  }

  // Set up cursor elements
  dot.style.willChange = 'transform';
  ring.style.willChange = 'transform';

  // Create canvas for beads
  canvas = document.createElement('canvas');
  canvas.style.cssText = `
    position: fixed;
    inset: 0;
    width: 100%;
    height: 100%;
    pointer-events: none;
    z-index: 9997;
  `;
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);
  ctx = canvas.getContext('2d');

  // Resize handler
  window.addEventListener('resize', () => {
    if (canvas) {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
  });

  // ── Mouse tracking ──
  let lastBeadX = 0;
  let lastBeadY = 0;

  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;

    // Update cursor positions using transform (no layout thrashing)
    dot.style.transform = `translate(${mouseX - CONFIG.cursorSize / 2}px, ${mouseY - CONFIG.cursorSize / 2}px)`;
    ring.style.transform = `translate(${mouseX - CONFIG.ringSize / 2}px, ${mouseY - CONFIG.ringSize / 2}px)`;

    // Spawn beads
    if (!prefersReduced && MAX_BEADS > 0) {
      const dx = mouseX - lastBeadX;
      const dy = mouseY - lastBeadY;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist > CONFIG.beadDistanceThreshold) {
        beads.push(new Bead(mouseX, mouseY));
        if (beads.length > MAX_BEADS) beads.shift();
        lastBeadX = mouseX;
        lastBeadY = mouseY;
      }
    }
  });

  // ── Animation loop ──
  function loop() {
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Update and draw beads
    beads = beads.filter((b) => b.life > 0);
    beads.forEach((b) => {
      b.update();
      b.draw(ctx);
    });

    rafId = requestAnimationFrame(loop);
  }

  if (!prefersReduced) {
    loop();
  }

  // ── Pause when hidden ──
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    } else if (!prefersReduced && !rafId) {
      loop();
    }
  });

  // ── Hover states ──
  document.addEventListener('mouseover', (e) => {
    const target = e.target.closest(CONFIG.interactiveSelector);
    if (!target) return;

    document.body.classList.add('cur-big');

    if (!isHovering) {
      isHovering = true;
      const now = Date.now();
      if (now - lastHoverSound > 150) {
        sounds.hover();
        lastHoverSound = now;
      }
    }
  });

  document.addEventListener('mouseout', (e) => {
    const target = e.target.closest(CONFIG.interactiveSelector);
    if (!target) return;

    document.body.classList.remove('cur-big');
    isHovering = false;
  });

  // ── Clean up on page unload ──
  window.addEventListener('beforeunload', () => {
    if (rafId) {
      cancelAnimationFrame(rafId);
      rafId = null;
    }
    if (canvas && canvas.parentNode) {
      canvas.parentNode.removeChild(canvas);
    }
  });
}

export function burstBeads(x, y, count = 8) {
  if (prefersReduced || MAX_BEADS === 0) return;

  for (let i = 0; i < count; i++) {
    const bead = new Bead(x, y);
    bead.vx = (Math.random() - 0.5) * 6;
    bead.vy = (Math.random() - 0.5) * 6 - 2;
    bead.r = bead.r * (0.5 + Math.random() * 0.5);
    bead.life = 0.6 + Math.random() * 0.4;
    bead.decay = 0.01 + Math.random() * 0.01;
    beads.push(bead);
    if (beads.length > MAX_BEADS + 20) beads.splice(0, beads.length - MAX_BEADS - 20);
  }
}

export function setBeadColours(colours) {
  CONFIG.beadColours = colours;
}

export function setCursorVisibility(visible) {
  const dot = document.getElementById('cur');
  const ring = document.getElementById('cur-r');
  if (dot) dot.style.display = visible ? 'block' : 'none';
  if (ring) ring.style.display = visible ? 'block' : 'none';
}
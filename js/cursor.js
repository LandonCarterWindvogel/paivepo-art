const INTERACTIVE = 'a, button, [data-page], [data-prod-id], .gal-card:not(.is-sold), .feat-item, .rel-card:not(.is-sold), .thumb, .abt-photo';

export function initCursor() {
  const dot  = document.getElementById('cur');
  const ring = document.getElementById('cur-r');

  if (!dot || !ring) return;

  let mouseX = 0, mouseY = 0;
  let ringX  = 0, ringY  = 0;

  document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    dot.style.left = `${mouseX}px`;
    dot.style.top  = `${mouseY}px`;
  });

  function animateRing() {
    ringX += (mouseX - ringX) * 0.12;
    ringY += (mouseY - ringY) * 0.12;
    ring.style.left = `${ringX}px`;
    ring.style.top  = `${ringY}px`;
    requestAnimationFrame(animateRing);
  }
  animateRing();

  document.addEventListener('mouseover', e => {
    if (e.target.closest(INTERACTIVE)) document.body.classList.add('cur-big');
  });

  document.addEventListener('mouseout', e => {
    if (e.target.closest(INTERACTIVE)) document.body.classList.remove('cur-big');
  });
}

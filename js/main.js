/* ─── Cursor ─────────────────────────────────────────── */
const cur  = document.getElementById('cur');
const curR = document.getElementById('curR');
document.addEventListener('mousemove', e => {
  cur.style.transform  = `translate(${e.clientX - 5}px, ${e.clientY - 5}px)`;
  curR.style.transform = `translate(${e.clientX - 17}px, ${e.clientY - 17}px)`;
});

/* ─── Lightbox ───────────────────────────────────────── */
let lbImages = [];
let lbIdx    = 0;

function buildLbImages() {
  document.querySelectorAll('.masonry-item, .drive-item').forEach(el => {
    const fn = el.getAttribute('onclick');
    if (fn) {
      const m = fn.match(/openLb\('(.+?)'\)/);
      if (m) lbImages.push(m[1]);
    }
  });
}

function openLb(src) {
  document.getElementById('lbImg').src = src;
  document.getElementById('lb').classList.add('open');
  lbIdx = lbImages.indexOf(src);
  document.body.style.overflow = 'hidden';
}

function closeLb() {
  document.getElementById('lb').classList.remove('open');
  document.body.style.overflow = '';
}

function lbNav(d) {
  lbIdx = (lbIdx + d + lbImages.length) % lbImages.length;
  document.getElementById('lbImg').src = lbImages[lbIdx];
}

document.getElementById('lb').addEventListener('click', function(e) {
  if (e.target === this) closeLb();
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape')      closeLb();
  if (e.key === 'ArrowRight')  lbNav(1);
  if (e.key === 'ArrowLeft')   lbNav(-1);
});

/* ─── Video Toggle ───────────────────────────────────── */
function toggleVideo(el) {
  const vid     = el.querySelector('video');
  const overlay = el.querySelector('.video-overlay');
  if (vid.paused) {
    vid.play();
    overlay.style.opacity = '0';
    overlay.style.pointerEvents = 'none';
  } else {
    vid.pause();
    overlay.style.opacity = '1';
    overlay.style.pointerEvents = '';
  }
}

/* ─── Timeline scroll animation ──────────────────────── */
function initTimeline() {
  const items = document.querySelectorAll('.tl-item');
  const obs = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) setTimeout(() => e.target.classList.add('vis'), i * 70);
    });
  }, { threshold: 0.1 });
  items.forEach(t => obs.observe(t));
}

/* ─── Nav active link on scroll ─────────────────────── */
function initNavScroll() {
  const sections = document.querySelectorAll('section[id]');
  const links    = document.querySelectorAll('.nav-links a');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(s => {
      if (window.scrollY >= s.offsetTop - 120) current = s.id;
    });
    links.forEach(a => {
      a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--gold)' : '';
    });
  });
}

/* ─── Init ───────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  buildLbImages();
  initTimeline();
  initNavScroll();
});

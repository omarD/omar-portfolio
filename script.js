// ===== Omar Dahmouch — Portfolio v2 interactions =====

// 1. Scroll-reveal: fade/slide elements in as they enter the viewport
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15, rootMargin: '0px 0px -60px 0px' });

document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

// 2. Count-up numbers for the stats block
function countUp(el) {
  const target = parseInt(el.dataset.count, 10);
  const suffix = el.dataset.suffix || '';
  const duration = 1800;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    el.textContent = Math.round(target * eased).toLocaleString('en-US') + suffix;
    if (progress < 1) requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
}

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      countUp(entry.target);
      countObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat__num').forEach((el) => countObserver.observe(el));

// 3. Scroll progress bar + nav background on scroll
const progress = document.querySelector('.scroll-progress');
const nav = document.getElementById('nav');

function onScroll() {
  const scrolled = window.scrollY;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  progress.style.transform = `scaleX(${max > 0 ? scrolled / max : 0})`;
  nav.classList.toggle('is-scrolled', scrolled > 40);
}
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// 4. Subtle 3D tilt on work cards (desktop pointers only)
if (window.matchMedia('(pointer: fine)').matches) {
  document.querySelectorAll('[data-tilt]').forEach((card) => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      card.style.transform = `perspective(900px) rotateX(${(-y * 5).toFixed(2)}deg) rotateY(${(x * 5).toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}

// 5. Cursor glow follows the pointer (desktop only)
const glow = document.querySelector('.cursor-glow');
if (glow && window.matchMedia('(pointer: fine)').matches) {
  window.addEventListener('mousemove', (e) => {
    glow.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
  }, { passive: true });
}

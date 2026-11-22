// Advanced motion: word splits, parallax, magnetic buttons
(function () {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Split heading text into words (keeps <em>/<br> markup intact)
  document.querySelectorAll('.section__title, .contact__title').forEach((el) => {
    const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
    const nodes = [];
    while (walker.nextNode()) nodes.push(walker.currentNode);
    let i = 0;
    nodes.forEach((node) => {
      if (!node.nodeValue.trim()) return;
      const frag = document.createDocumentFragment();
      node.nodeValue.split(/(\s+)/).forEach((piece) => {
        if (!piece) return;
        if (/^\s+$/.test(piece)) { frag.appendChild(document.createTextNode(piece)); return; }
        const outer = document.createElement('span');
        outer.className = 'word';
        const inner = document.createElement('span');
        inner.style.setProperty('--wd', (i * 0.07).toFixed(2) + 's');
        inner.textContent = piece;
        outer.appendChild(inner);
        frag.appendChild(outer);
        i++;
      });
      node.parentNode.replaceChild(frag, node);
    });
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          el.querySelectorAll('.word').forEach((w) => w.classList.add('is-in'));
          io.disconnect();
        }
      });
    }, { threshold: 0.4 });
    io.observe(el);
  });

  if (reduce) return;

  // 2. Parallax: hero background and work card images drift on scroll
  const media = Array.from(document.querySelectorAll('.work-card__media img'));
  let ticking = false;
  function parallax() {
    const y = window.scrollY;
    media.forEach((img) => {
      const r = img.getBoundingClientRect();
      const mid = r.top + r.height / 2 - window.innerHeight / 2;
      img.style.transform = `translateY(${(-mid * 0.06).toFixed(1)}px) scale(1.08)`;
    });
    ticking = false;
  }
  window.addEventListener('scroll', () => {
    if (!ticking) { requestAnimationFrame(parallax); ticking = true; }
  }, { passive: true });
  parallax();

  // 3. Magnetic buttons (desktop pointers)
  if (window.matchMedia('(pointer: fine)').matches) {
    document.querySelectorAll('.btn').forEach((btn) => {
      btn.addEventListener('mousemove', (e) => {
        const r = btn.getBoundingClientRect();
        const x = e.clientX - (r.left + r.width / 2);
        const y = e.clientY - (r.top + r.height / 2);
        btn.style.transform = `translate(${(x * 0.2).toFixed(1)}px, ${(y * 0.25).toFixed(1)}px)`;
      });
      btn.addEventListener('mouseleave', () => { btn.style.transform = ''; });
    });
  }
})();

const FORM_EMAIL = 'szakharovartem@gmail.com';
document.documentElement.classList.add('js');
document.getElementById('y').textContent = new Date().getFullYear();
const root = document.documentElement, btn = document.getElementById('theme');
const sync = () => btn.setAttribute('aria-pressed', root.dataset.theme === 'dark');
sync();
btn.addEventListener('click', () => { root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark'; localStorage.setItem('theme', root.dataset.theme); sync(); });
matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => { if (!localStorage.getItem('theme')) { root.dataset.theme = e.matches ? 'dark' : 'light'; sync(); } });
const els = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12, rootMargin: '0px 0px -40px 0px' });
  els.forEach((el, i) => { el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });
} else els.forEach(el => el.classList.add('in'));
const form = document.getElementById('form'), status = document.getElementById('status');
const rules = { name: v => v.trim().length >= 2 || 'Please enter your name.', email: v => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) || 'Please enter a valid email.', message: v => v.trim().length >= 10 || 'Message should be at least 10 characters.' };
function check(f) { const r = rules[f.name](f.value), wrap = f.parentElement, ok = r === true; wrap.classList.toggle('invalid', !ok); f.setAttribute('aria-invalid', !ok); wrap.querySelector('.err').textContent = ok ? '' : r; return ok; }
['name', 'email', 'message'].forEach(n => form[n].addEventListener('blur', () => check(form[n])));
form.addEventListener('submit', async e => {
  e.preventDefault(); status.textContent = '';
  const fs = ['name', 'email', 'message'].map(n => form[n]);
  const bad = fs.filter(f => !check(f)); if (bad.length) { bad[0].focus(); return; }
  if (form._honey.value) return;
  const b = form.querySelector('button'); b.disabled = true; b.textContent = 'Sending…';
  try {
    const res = await fetch('https://formsubmit.co/ajax/' + FORM_EMAIL, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ name: form.name.value, email: form.email.value, message: form.message.value, _subject: 'New message from portfolio', _template: 'table', _captcha: 'false' }) });
    const d = await res.json().catch(() => ({}));
    if (!res.ok || String(d.success) === 'false') throw new Error(d.message || 'Request failed');
    form.hidden = true; const s = document.getElementById('success'); s.hidden = false; s.focus();
  } catch (err) { status.textContent = 'Sorry, something went wrong. Please try again or reach out on LinkedIn.'; b.disabled = false; b.textContent = 'Send message'; }
});
/* ---- v2 motion ---- */
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
// Background blobs (canvas, low-res, 30fps, paused when hidden)
(() => {
  const c = document.getElementById('bg'), x = c.getContext('2d'); let w, h;
  const size = () => { w = c.width = innerWidth / 4; h = c.height = innerHeight / 4; }; size(); addEventListener('resize', size);
  const blobs = [1, 2, 3, 4].map((n, i) => ({ v: '--b' + n, a: Math.random() * 6, s: .00012 + i * .00004, r: .35 + i * .05, ox: [.2, .8, .7, .3][i], oy: [.25, .2, .8, .75][i] }));
  let last = 0;
  const draw = t => {
    if (!reduce) requestAnimationFrame(draw);
    if (t - last < 33 || document.hidden) return; last = t;
    const cs = getComputedStyle(root); x.clearRect(0, 0, w, h);
    blobs.forEach(b => { const px = (b.ox + Math.sin(t * b.s + b.a) * .15) * w, py = (b.oy + Math.cos(t * b.s * 1.3 + b.a) * .15) * h, r = b.r * Math.max(w, h);
      const g = x.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, cs.getPropertyValue(b.v).trim()); g.addColorStop(1, 'transparent'); x.fillStyle = g; x.fillRect(0, 0, w, h); });
  };
  requestAnimationFrame(draw); btn.addEventListener('click', () => requestAnimationFrame(t => { last = 0; draw(t); }));
})();
// Card spotlight
document.querySelectorAll('.card').forEach(el => el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); el.style.setProperty('--mx', e.clientX - r.left + 'px'); el.style.setProperty('--my', e.clientY - r.top + 'px'); }));
addEventListener('load', () => {
  if (reduce || !window.gsap) return;
  root.classList.add('gsap'); gsap.registerPlugin(ScrollTrigger);
  if (window.Lenis) { const l = new Lenis({ lerp: .09 }); l.on('scroll', ScrollTrigger.update); gsap.ticker.add(t => l.raf(t * 1000)); gsap.ticker.lagSmoothing(0);
    document.querySelectorAll('a[href^="#"]').forEach(a => a.addEventListener('click', e => { const t = document.querySelector(a.getAttribute('href')); if (t) { e.preventDefault(); l.scrollTo(t, { offset: -70 }); } })); }
  // Split headline into chars
  const h1 = document.querySelector('.split'); const txt = h1.textContent; h1.setAttribute('aria-label', txt); h1.innerHTML = '';
  txt.split(' ').forEach((word, i) => { const w = document.createElement('span'); w.className = 'w'; w.setAttribute('aria-hidden', 'true');
    [...word].forEach(ch => { const s = document.createElement('span'); s.textContent = ch; s.className = 'ch'; w.appendChild(s); }); h1.appendChild(w); if (i < txt.split(' ').length - 1) h1.append(' '); });
  const tl = gsap.timeline({ defaults: { ease: 'expo.out' } });
  tl.from('.nav', { y: -30, opacity: 0, duration: 1 })
    .from('.split .ch', { yPercent: 110, opacity: 0, duration: 1.2, stagger: .035 }, .15)
    .from('.hero .h-in:not(.portrait)', { y: 24, opacity: 0, duration: 1, stagger: .1 }, .5)
    .from('.portrait', { scale: .85, opacity: 0, duration: 1.6 }, .3);
  // Scroll reveals
  gsap.utils.toArray('section:not(.hero) .reveal').forEach(el => gsap.from(el, { y: 40, opacity: 0, duration: 1.1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%' } }));
  gsap.from('.grid .card', { y: 30, opacity: 0, duration: .9, stagger: .06, ease: 'power3.out', scrollTrigger: { trigger: '.grid', start: 'top 85%' } });
  // Parallax
  gsap.to('.portrait', { yPercent: -18, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  gsap.to('.hero-text', { yPercent: 12, opacity: .3, ease: 'none', scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom top', scrub: true } });
  // Magnetic
  if (matchMedia('(hover:hover)').matches) {
    document.querySelectorAll('.magnetic').forEach(el => {
      const xt = gsap.quickTo(el, 'x', { duration: .5, ease: 'power3' }), yt = gsap.quickTo(el, 'y', { duration: .5, ease: 'power3' });
      el.addEventListener('pointermove', e => { const r = el.getBoundingClientRect(); xt((e.clientX - r.left - r.width / 2) * .3); yt((e.clientY - r.top - r.height / 2) * .3); });
      el.addEventListener('pointerleave', () => { xt(0); yt(0); });
    });
    const g = document.getElementById('glow'), gx = gsap.quickTo(g, 'x', { duration: .9, ease: 'power3' }), gy = gsap.quickTo(g, 'y', { duration: .9, ease: 'power3' });
    addEventListener('pointermove', e => { gx(e.clientX); gy(e.clientY); });
  }
});

// FormSubmit recipient. TODO: set the real address (no verified email was available via the GitHub API).
const FORM_EMAIL = 'YOUR_EMAIL@example.com';
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

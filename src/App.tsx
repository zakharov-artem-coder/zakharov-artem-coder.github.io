import { motion, useScroll, useTransform } from 'motion/react'
import { useEffect, useRef, useState, type FormEvent } from 'react'
import Background from './Background'
import { Reveal, Magnetic, CursorGlow } from './fx'

const FORM_EMAIL = 'szakharovartem@gmail.com'
const NAME = 'Artem Zakharov'
const SKILLS = ['Software Engineering', 'Software Architecture', 'System Design', 'Full-Stack Development', 'Product Engineering', 'API Design', 'Technical Leadership', 'AI Integration']
const ease = [0.16, 1, 0.3, 1] as const

const Icon = { li: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/></svg>,
  gh: <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M9 19c-4 1.5-4-2-6-2.5m12 5v-3.5c0-1 .1-1.4-.5-2 2.8-.3 5.5-1.4 5.5-6a4.6 4.6 0 0 0-1.3-3.2 4.2 4.2 0 0 0-.1-3.2s-1.1-.3-3.5 1.3a12 12 0 0 0-6.2 0C6.5 2.8 5.4 3.1 5.4 3.1a4.2 4.2 0 0 0-.1 3.2A4.6 4.6 0 0 0 4 9.5c0 4.6 2.7 5.7 5.5 6-.6.6-.6 1.2-.5 2V21"/></svg>,
  ig: <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg> }

function useTheme() {
  const [t, setT] = useState(() => document.documentElement.dataset.theme ?? 'light')
  useEffect(() => { document.documentElement.dataset.theme = t }, [t])
  useEffect(() => { const m = matchMedia('(prefers-color-scheme: dark)'); const f = (e: MediaQueryListEvent) => { if (!localStorage.getItem('theme')) setT(e.matches ? 'dark' : 'light') }; m.addEventListener('change', f); return () => m.removeEventListener('change', f) }, [])
  return [t, () => setT(p => { const n = p === 'dark' ? 'light' : 'dark'; localStorage.setItem('theme', n); return n })] as const
}

function Hero() {
  const ref = useRef<HTMLElement>(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] })
  const py = useTransform(scrollYProgress, [0, 1], ['0%', '-25%']), ty = useTransform(scrollYProgress, [0, 1], ['0%', '18%']), to = useTransform(scrollYProgress, [0, 1], [1, .2])
  const item = (d: number) => ({ initial: { opacity: 0, y: 24 }, animate: { opacity: 1, y: 0 }, transition: { duration: 1, delay: d, ease } })
  return <section id="top" className="hero" ref={ref}>
    <motion.div className="hero-text" style={{ y: ty, opacity: to }}>
      <motion.p className="eyebrow" {...item(.1)}>Hello, I'm</motion.p>
      <h1 className="split" aria-label={NAME}>{NAME.split(' ').map((w, wi) => <span className="w" key={wi} aria-hidden="true">{[...w].map((c, ci) =>
        <motion.span className="ch" key={ci} initial={{ y: '110%', opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1.2, ease, delay: .2 + (wi * 7 + ci) * .035 }}>{c}</motion.span>)}{wi === 0 ? '\u00a0' : ''}</span>)}</h1>
      <motion.p className="sub" lang="ru" {...item(.65)}>Артём Захаров</motion.p>
      <motion.p className="tag" {...item(.75)}>Software Engineer <span>|</span> Building AI &amp; Web Products</motion.p>
      <motion.div className="cta" {...item(.85)}><Magnetic className="btn" href="#contact">Get in touch</Magnetic><Magnetic className="btn ghost" href="#projects">See work</Magnetic></motion.div>
    </motion.div>
    <motion.figure className="portrait" style={{ y: py }} initial={{ opacity: 0, scale: .85 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1.6, delay: .3, ease }}>
      <div className="ring" aria-hidden="true" /><img src="/avatar.jpg" alt="Portrait of Artem Zakharov" width={460} height={460} />
    </motion.figure>
  </section>
}

type Errs = Partial<Record<'name' | 'email' | 'message', string>>
function validate(d: Record<string, string>): Errs {
  const e: Errs = {}
  if (d.name.trim().length < 2) e.name = 'Please enter your name.'
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.email.trim())) e.email = 'Please enter a valid email.'
  if (d.message.trim().length < 10) e.message = 'Message should be at least 10 characters.'
  return e
}
function Contact() {
  const [v, setV] = useState({ name: '', email: '', message: '', _honey: '' })
  const [err, setErr] = useState<Errs>({}), [state, setState] = useState<'idle' | 'sending' | 'ok' | 'fail'>('idle')
  const submit = async (e: FormEvent) => {
    e.preventDefault(); const er = validate(v); setErr(er)
    if (Object.keys(er).length) { document.getElementById(Object.keys(er)[0])?.focus(); return }
    if (v._honey) return
    setState('sending')
    try {
      const r = await fetch(`https://formsubmit.co/ajax/${FORM_EMAIL}`, { method: 'POST', headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({ name: v.name, email: v.email, message: v.message, _subject: 'New message from portfolio', _template: 'table', _captcha: 'false' }) })
      const d = await r.json().catch(() => ({}))
      if (!r.ok || String(d.success) === 'false') throw 0
      setState('ok')
    } catch { setState('fail') }
  }
  const f = (k: 'name' | 'email' | 'message', label: string, type = 'text') => <div className={`field ${err[k] ? 'invalid' : ''}`}>
    <label htmlFor={k}>{label}</label>
    {k === 'message' ? <textarea id={k} rows={5} value={v[k]} aria-invalid={!!err[k]} aria-describedby={`${k}-e`} onChange={e => setV({ ...v, [k]: e.target.value })} onBlur={() => setErr({ ...err, [k]: validate(v)[k] })} />
      : <input id={k} type={type} autoComplete={k} value={v[k]} aria-invalid={!!err[k]} aria-describedby={`${k}-e`} onChange={e => setV({ ...v, [k]: e.target.value })} onBlur={() => setErr({ ...err, [k]: validate(v)[k] })} />}
    <small className="err" id={`${k}-e`} aria-live="polite">{err[k]}</small></div>
  return <section id="contact"><Reveal as="h2">Contact</Reveal>
    {state === 'ok' ? <motion.div className="success" role="status" initial={{ opacity: 0, y: 12, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} transition={{ duration: .6, ease }}>
      <h3>Thank you!</h3><p>Your message has been sent. I'll get back to you soon.</p></motion.div>
    : <Reveal><form onSubmit={submit} noValidate>
      {f('name', 'Name')}{f('email', 'Email', 'email')}{f('message', 'Message')}
      <input className="hp" tabIndex={-1} autoComplete="off" aria-hidden="true" value={v._honey} onChange={e => setV({ ...v, _honey: e.target.value })} />
      <motion.button className="btn" type="submit" disabled={state === 'sending'} whileHover={{ y: -2 }} whileTap={{ scale: .97 }}>{state === 'sending' ? 'Sending…' : 'Send message'}</motion.button>
      <p id="status" role="status" aria-live="polite">{state === 'fail' && 'Sorry, something went wrong. Please try again or reach out on LinkedIn.'}</p>
    </form></Reveal>}
  </section>
}

export default function App() {
  const [theme, toggle] = useTheme()
  return <>
    <Background /><CursorGlow />
    <a className="skip" href="#main">Skip to content</a>
    <motion.header className="nav" initial={{ y: -30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 1, ease }}>
      <a href="#top" className="logo" aria-label="Home">AZ</a>
      <nav aria-label="Primary"><a href="#about">About</a><a href="#work">What I do</a><a href="#projects">Projects</a><a href="#contact">Contact</a></nav>
      <motion.button className="toggle" aria-label="Toggle dark theme" aria-pressed={theme === 'dark'} onClick={toggle} whileHover={{ rotate: 20 }} whileTap={{ scale: .9 }}><span aria-hidden="true" /></motion.button>
    </motion.header>
    <main id="main">
      <Hero />
      <section id="about"><Reveal as="h2">About</Reveal><Reveal className="prose">
        <p>I'm a full-stack software engineer building AI-powered and web products.</p>
        <p>I work across the stack, from system design and architecture to backend services, integrations, and user interfaces, with a focus on reliable, maintainable software and full ownership of what I ship.</p>
        <p>Beyond engineering, I'm increasingly focused on the product and business side: validating ideas, understanding customers, and bringing products to market.</p>
        <p>Open to connecting with founders and engineers building ambitious products.</p></Reveal></section>
      <section id="work"><Reveal as="h2">What I do</Reveal><ul className="grid">{SKILLS.map((s, i) =>
        <Reveal as="li" className="card" key={s} delay={(i % 4) * .07}>{s}</Reveal>)}</ul></section>
      <section id="projects"><Reveal as="h2">Projects</Reveal><Reveal className="soon"><span className="badge">Coming soon</span>
        <p>Selected projects will be published here. Meanwhile, see <a href="https://github.com/zakharov-artem-coder">GitHub</a>.</p></Reveal></section>
      <Contact />
    </main>
    <footer><p>© {new Date().getFullYear()} Artem Zakharov</p><p className="social">
      <Magnetic href="https://www.linkedin.com/in/a-zakharov/" target="_blank" rel="noopener" aria-label="LinkedIn">{Icon.li}</Magnetic>
      <Magnetic href="https://github.com/zakharov-artem-coder" target="_blank" rel="noopener" aria-label="GitHub">{Icon.gh}</Magnetic>
      <Magnetic href="https://www.instagram.com/zakharov_artem_/" target="_blank" rel="noopener" aria-label="Instagram">{Icon.ig}</Magnetic></p></footer>
  </>
}

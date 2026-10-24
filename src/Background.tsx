import { useEffect, useRef } from 'react'
export default function Background() {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current!, x = c.getContext('2d')!, root = document.documentElement
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches
    let w = 0, h = 0, raf = 0, last = -1e9
    const size = () => { w = c.width = innerWidth / 4; h = c.height = innerHeight / 4; last = -1e9 }
    size(); addEventListener('resize', size)
    const blobs = [0, 1, 2, 3].map(i => ({ v: `--b${i + 1}`, a: Math.random() * 6, s: .00012 + i * .00004, r: .35 + i * .05, ox: [.2, .8, .7, .3][i], oy: [.25, .2, .8, .75][i] }))
    const draw = (t: number) => {
      raf = requestAnimationFrame(draw)
      if ((reduce && last > 0 && t - last < 500) || t - last < 33 || document.hidden) return
      last = t; const cs = getComputedStyle(root); x.clearRect(0, 0, w, h)
      for (const b of blobs) {
        const k = reduce ? 0 : t, px = (b.ox + Math.sin(k * b.s + b.a) * .15) * w, py = (b.oy + Math.cos(k * b.s * 1.3 + b.a) * .15) * h, r = b.r * Math.max(w, h)
        const g = x.createRadialGradient(px, py, 0, px, py, r); g.addColorStop(0, cs.getPropertyValue(b.v).trim()); g.addColorStop(1, 'transparent'); x.fillStyle = g; x.fillRect(0, 0, w, h)
      }
    }
    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); removeEventListener('resize', size) }
  }, [])
  return <><canvas id="bg" ref={ref} aria-hidden="true" /><div className="grain" aria-hidden="true" /></>
}

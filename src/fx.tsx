import { motion, useMotionValue, useSpring, useReducedMotion } from 'motion/react'
import { useEffect, type ReactNode, type ComponentProps } from 'react'

export function Reveal({ children, delay = 0, className, as = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' | 'h2' | 'p' }) {
  const M = motion[as] as typeof motion.div
  return <M className={className} initial={{ opacity: 0, y: 36, filter: 'blur(6px)' }} whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '0px 0px -60px 0px' }} transition={{ duration: 1, delay, ease: [0.16, 1, 0.3, 1] }}>{children}</M>
}

export function Magnetic({ children, className, ...rest }: ComponentProps<typeof motion.a>) {
  const x = useSpring(0, { stiffness: 200, damping: 15 }), y = useSpring(0, { stiffness: 200, damping: 15 })
  const reduce = useReducedMotion()
  return <motion.a className={`magnetic ${className ?? ''}`} style={{ x, y }} {...rest}
    onPointerMove={e => { if (reduce || e.pointerType !== 'mouse') return; const r = e.currentTarget.getBoundingClientRect(); x.set((e.clientX - r.left - r.width / 2) * .3); y.set((e.clientY - r.top - r.height / 2) * .3) }}
    onPointerLeave={() => { x.set(0); y.set(0) }} whileTap={{ scale: .96 }}>{children}</motion.a>
}

export function CursorGlow() {
  const mx = useMotionValue(-500), my = useMotionValue(-500)
  const x = useSpring(mx, { stiffness: 80, damping: 20 }), y = useSpring(my, { stiffness: 80, damping: 20 })
  const reduce = useReducedMotion()
  useEffect(() => { const f = (e: PointerEvent) => { mx.set(e.clientX); my.set(e.clientY) }; addEventListener('pointermove', f); return () => removeEventListener('pointermove', f) }, [mx, my])
  if (reduce) return null
  return <motion.div id="glow" aria-hidden="true" style={{ x, y, opacity: 1 }} />
}

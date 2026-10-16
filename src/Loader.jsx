import React, { useLayoutEffect, useRef, useState } from 'react';
import { gsap, lenis, reduced, introFinished } from './motion.js';

// Short branded intro, shown once per browser session.
export default function Loader() {
  const [show, setShow] = useState(() => {
    let seen = false;
    try { seen = !!sessionStorage.getItem('intro-seen'); } catch {}
    return !seen && !reduced;
  });
  const root = useRef(null);
  const num = useRef(null);
  const bar = useRef(null);

  useLayoutEffect(() => {
    if (!show) { introFinished(); return; }
    try { sessionStorage.setItem('intro-seen', '1'); } catch {}
    lenis?.stop();
    const count = { v: 0 };
    const ctx = gsap.context(() => {
      gsap.timeline({ onComplete: () => setShow(false) })
        .from('.loader-inner > *', { y: 18, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' })
        .to(count, {
          v: 100, duration: 1.4, ease: 'power2.inOut',
          onUpdate: () => {
            num.current.textContent = String(Math.round(count.v)).padStart(3, '0');
            bar.current.style.transform = `scaleX(${count.v / 100})`;
          }
        }, 0.2)
        .to('.loader-inner', { y: -24, opacity: 0, duration: 0.5, ease: 'power2.in' }, '+=0.15')
        .add(() => { lenis?.start(); introFinished(); }, '-=0.1')
        .to(root.current, { yPercent: -100, duration: 1.05, ease: 'power4.inOut' }, '<');
    }, root);
    return () => ctx.revert();
  }, []);

  if (!show) return null;
  return (
    <div className="loader" ref={root} aria-hidden="true">
      <div className="loader-inner">
        <i className="logo-mark" />
        <p className="loader-name">Aishwarya Singh</p>
        <div className="loader-bar"><i ref={bar} /></div>
        <p className="loader-meta"><span>Software Engineer</span><span ref={num}>000</span></p>
      </div>
    </div>
  );
}

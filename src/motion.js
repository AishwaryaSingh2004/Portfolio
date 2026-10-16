import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

export { gsap, ScrollTrigger };
export const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;

// Smooth, inertial scrolling (skipped when the visitor prefers reduced motion).
export const lenis = reduced ? null : new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4) });
if (lenis) {
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}

export function scrollToId(id, immediate = false) {
  const el = document.getElementById(id);
  if (!el) return;
  if (lenis) {
    lenis.resize(); // the page may have just changed height (route change)
    lenis.scrollTo(el, { immediate, duration: 1.4, force: true });
  }
  else el.scrollIntoView({ behavior: immediate || reduced ? 'auto' : 'smooth' });
}

export function scrollToTop() {
  if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
  else window.scrollTo(0, 0);
}

// The intro loader calls introFinished(); the hero waits on it.
let introDone = false;
const waiting = [];
export function introFinished() {
  introDone = true;
  waiting.splice(0).forEach((fn) => fn());
}
export function whenIntroDone(fn) {
  if (introDone) fn();
  else waiting.push(fn);
}

// Pointer effects, delegated once for the whole page:
// .spot   — a soft accent spotlight that follows the cursor inside a card
// .btn    — buttons lean slightly toward the cursor (magnetic)
if (finePointer && !reduced) {
  let magnet = null;
  const release = () => {
    if (!magnet) return;
    gsap.to(magnet, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.45)' });
    magnet = null;
  };
  document.addEventListener('pointermove', (e) => {
    const t = e.target instanceof Element ? e.target : null;
    const card = t?.closest('.spot');
    if (card) {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    }
    const btn = t?.closest('.btn');
    if (btn !== magnet) release();
    if (btn) {
      magnet = btn;
      const r = btn.getBoundingClientRect();
      gsap.to(btn, {
        x: (e.clientX - (r.left + r.width / 2)) * 0.22,
        y: (e.clientY - (r.top + r.height / 2)) * 0.32,
        duration: 0.4,
        ease: 'power3.out'
      });
    }
  }, { passive: true });
  document.addEventListener('pointerleave', release);
}

if (document.fonts?.ready) document.fonts.ready.then(() => ScrollTrigger.refresh());

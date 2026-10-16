import React, { useEffect, useRef } from 'react';

// Plays /frames/frame_XXXX.jpg as the page scrolls (scroll 0 → first frame,
// bottom of the footer → last frame). Until frames exist, falls back to the
// cut-out portrait with a slow push-in.
export default function ScrollCanvas() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    let frames = [];
    let lastDrawn = -1;
    let raf = 0;
    let alive = true;

    const photo = new Image();
    photo.src = '/aishwarya-cutout.png';
    photo.onload = () => schedule(true);

    const progress = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      return max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
    };

    const cover = (img, scale = 1, anchorX = 0.5) => {
      const cw = canvas.width, ch = canvas.height;
      const r = Math.max(cw / img.naturalWidth, ch / img.naturalHeight) * scale;
      const w = img.naturalWidth * r, h = img.naturalHeight * r;
      ctx.drawImage(img, (cw - w) * anchorX, (ch - h) / 2, w, h);
    };

    // Colours come from the CSS tokens so the canvas follows the theme.
    const token = (name) => getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    const drawPhoto = (p) => {
      const cw = canvas.width, ch = canvas.height;
      const accent = token('--accent-rgb').split(/\s+/).join(',');
      ctx.fillStyle = token('--bg');
      ctx.fillRect(0, 0, cw, ch);
      // Cut-out portrait, bottom-aligned, with a warm glow behind it.
      const wide = cw > ch * 1.1;
      const h = ch * (wide ? 0.9 : 0.72) * (1 + p * 0.06);
      const w = h * (photo.naturalWidth / photo.naturalHeight);
      const cx = cw * (wide ? 0.72 : 0.5);
      const glow = ctx.createRadialGradient(cx, ch - h * 0.6, 0, cx, ch - h * 0.6, h * 0.75);
      glow.addColorStop(0, `rgba(${accent},0.32)`);
      glow.addColorStop(0.55, `rgba(${accent},0.08)`);
      glow.addColorStop(1, `rgba(${accent},0)`);
      ctx.fillStyle = glow;
      ctx.fillRect(0, 0, cw, ch);
      ctx.save();
      ctx.filter = 'contrast(1.06) brightness(1.04)';
      ctx.drawImage(photo, cx - w / 2, ch - h, w, h);
      ctx.restore();
    };

    const draw = (force) => {
      raf = 0;
      const p = progress();
      document.documentElement.style.setProperty('--p', p.toFixed(4));
      if (frames.length) {
        let i = Math.round(p * (frames.length - 1));
        while (i > 0 && !frames[i].complete) i--;
        if (!frames[i].complete || (i === lastDrawn && !force)) return;
        lastDrawn = i;
        cover(frames[i]);
      } else if (photo.complete && photo.naturalWidth) {
        drawPhoto(p);
      }
    };

    const schedule = (force) => {
      if (force) return draw(true);
      if (!raf) raf = requestAnimationFrame(() => draw(false));
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(window.innerWidth * dpr);
      canvas.height = Math.round(window.innerHeight * dpr);
      draw(true);
    };

    fetch('/frames/manifest.json')
      .then(r => (r.ok ? r.json() : null))
      .then(m => {
        if (!alive || !m?.count) return;
        frames = Array.from({ length: m.count }, (_, k) => {
          const img = new Image();
          img.src = '/frames/' + m.pattern.replace('{n}', String(k + 1).padStart(m.pad, '0'));
          img.onload = () => schedule(k === 0);
          return img;
        });
      })
      .catch(() => {});

    const onScroll = () => schedule(false);
    const onTheme = () => draw(true);
    window.addEventListener('themechange', onTheme);
    const ro = new ResizeObserver(() => schedule(true));
    ro.observe(document.body);
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', resize);
    resize();

    return () => {
      alive = false;
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('themechange', onTheme);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <div className="scene" aria-hidden="true">
      <canvas ref={canvasRef} />
      <div className="scene-shade" />
    </div>
  );
}

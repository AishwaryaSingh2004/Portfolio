import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import {
  siPython, siOpenjdk, siDotnet, siNodedotjs, siExpress, siReact, siJavascript, siHtml5,
  siCss3, siMongodb, siMysql, siGit, siGithub, siPostman, siGooglegemini, siJsonwebtokens
} from 'simple-icons';
import { reduced } from './motion.js';

// What each ball is, and where it shows up in my work (shown when a ball is clicked).
const ICONS = [
  { icon: siPython, name: 'Python', group: 'Language', note: 'Resume-parsing pipeline behind the AI Resume Analyzer.' },
  { icon: siNodedotjs, name: 'Node.js', group: 'Backend', note: 'REST APIs for the MERN food delivery platform at C-DAC.' },
  { icon: siReact, name: 'React', group: 'Frontend', note: 'Interfaces for the AI Resume Analyzer and this portfolio.' },
  { icon: siDotnet, name: 'C# / .NET Core', group: 'Backend', note: 'Defense-simulation modules at Zen Technologies.' },
  { icon: siMongodb, name: 'MongoDB', group: 'Database', note: 'Schema design and query optimisation for auth, cart and orders.' },
  { icon: siGooglegemini, name: 'Google Gemini API', group: 'AI & LLMs', note: 'Skill-gap analysis, role matching and interview prep.' },
  { icon: siOpenjdk, name: 'Java', group: 'Language', note: 'Object-oriented programming and problem solving.' },
  { icon: siMysql, name: 'MySQL', group: 'Database', note: 'Relational data modelling and SQL queries.' },
  { icon: siJavascript, name: 'JavaScript', group: 'Language', note: 'Full-stack web development, front to back.' },
  { icon: siExpress, name: 'Express', group: 'Backend', note: 'Routing and middleware for MERN APIs.' },
  { icon: siGit, name: 'Git', group: 'Tools', note: 'Version control on every project.' },
  { icon: siPostman, name: 'Postman', group: 'Tools', note: 'API testing and debugging.' },
  { icon: siHtml5, name: 'HTML5', group: 'Frontend', note: 'Semantic, accessible markup.' },
  { icon: siCss3, name: 'CSS3', group: 'Frontend', note: 'Responsive layouts and styling.' },
  { icon: siGithub, name: 'GitHub', group: 'Tools', note: 'Code hosting, reviews and collaboration.' },
  { icon: siJsonwebtokens, name: 'JWT', group: 'Security', note: 'Token-based auth and secure checkout.' }
];

// A cluster of icon spheres pulled toward the centre. They drop in when the
// section scrolls into view, scatter as the cursor moves through them, and
// clicking one brings it forward with a card naming the technology.
export default function TechStack() {
  const box = useRef(null);
  const card = useRef(null);
  const [selected, setSelected] = useState(-1);

  useEffect(() => {
    const el = box.current;
    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      return; // no WebGL — the skill list below still covers everything
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    el.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
    scene.add(new THREE.HemisphereLight(0xffffff, 0x223044, 1.9));
    const key = new THREE.DirectionalLight(0xffffff, 1.6);
    key.position.set(-6, 9, 10);
    scene.add(key);
    const rim = new THREE.PointLight(0xffffff, 90, 30);
    rim.position.set(7, -5, 5);
    scene.add(rim);

    const small = el.clientWidth < 640;
    const geo = new THREE.SphereGeometry(1, 48, 32);
    const balls = ICONS.slice(0, small ? 12 : ICONS.length).map(({ icon }, i) => {
      const mat = new THREE.MeshStandardMaterial({ roughness: 0.45, metalness: 0.05 });
      const mesh = new THREE.Mesh(geo, mat);
      const r = (small ? 0.95 : 1.05) + ((i * 7) % 5) * 0.09;
      mesh.scale.setScalar(r);
      scene.add(mesh);
      return { mesh, mat, icon, r, accent: i % 4 === 2, p: new THREE.Vector3(), v: new THREE.Vector3() };
    });

    // Ball and icon colours follow the theme tokens.
    const paint = () => {
      const css = (n) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
      const dark = document.documentElement.dataset.theme !== 'light';
      for (const b of balls) {
        const base = b.accent ? css('--accent') : dark ? css('--text') : css('--surface');
        const ink = b.accent ? (dark ? css('--bg') : '#ffffff') : dark ? css('--bg') : css('--text');
        const c = document.createElement('canvas');
        c.width = 512; c.height = 256;
        const g = c.getContext('2d');
        g.fillStyle = base;
        g.fillRect(0, 0, 512, 256);
        // u = 0.25 of a sphere's texture faces +z (the camera), so the icon goes there.
        g.translate(128, 128);
        g.scale(80 / 24, 80 / 24);
        g.translate(-12, -12);
        g.fillStyle = ink;
        g.fill(new Path2D(b.icon.path));
        const tex = new THREE.CanvasTexture(c);
        tex.colorSpace = THREE.SRGBColorSpace;
        tex.anisotropy = 4;
        b.mat.map?.dispose();
        b.mat.map = tex;
        b.mat.needsUpdate = true;
      }
      rim.color.set(css('--accent'));
    };
    paint();

    const spawn = () => balls.forEach((b, i) => {
      if (reduced) b.p.set(Math.cos(i * 2.4) * 2.5, Math.sin(i * 2.4) * 2.5, 0);
      else b.p.set((Math.random() - 0.5) * 9, 7 + i * 0.35 + Math.random() * 2, (Math.random() - 0.5) * 2);
      b.v.set(0, 0, 0);
    });
    spawn();

    const pointer = new THREE.Vector3();
    let pointerOn = false;
    let movedAt = 0;
    let sel = -1;
    const select = (i) => { sel = i; setSelected(i); };
    const ray = new THREE.Raycaster();
    const plane = new THREE.Plane(new THREE.Vector3(0, 0, 1), 0);
    const ndc = new THREE.Vector2();
    const onMove = (e) => {
      const r = el.getBoundingClientRect();
      ndc.set(((e.clientX - r.left) / r.width) * 2 - 1, -((e.clientY - r.top) / r.height) * 2 + 1);
      ray.setFromCamera(ndc, camera);
      pointerOn = !!ray.ray.intersectPlane(plane, pointer);
      movedAt = performance.now();
      el.style.cursor = pick() >= 0 ? 'pointer' : '';
    };
    // The ball under the cursor, or the nearest one within reach of it.
    const pick = () => {
      const hit = ray.intersectObjects(balls.map((b) => b.mesh))[0];
      if (hit) return balls.findIndex((b) => b.mesh === hit.object);
      let best = -1, bestD = Infinity;
      balls.forEach((b, i) => {
        const d = Math.hypot(b.p.x - pointer.x, b.p.y - pointer.y) - b.r;
        if (d < 0.5 && d < bestD) { best = i; bestD = d; }
      });
      return best;
    };
    let down = null;
    const onDown = (e) => { down = { x: e.clientX, y: e.clientY }; };
    const onUp = (e) => {
      if (!down || Math.hypot(e.clientX - down.x, e.clientY - down.y) > 8) { down = null; return; }
      down = null;
      onMove(e);
      const i = pick();
      select(i === sel ? -1 : i);
    };
    const onKey = (e) => { if (e.key === 'Escape') select(-1); };
    const onLeave = () => { pointerOn = false; };
    el.addEventListener('pointermove', onMove);
    el.addEventListener('pointerleave', onLeave);
    el.addEventListener('pointercancel', onLeave);
    el.addEventListener('pointerdown', onDown);
    el.addEventListener('pointerup', onUp);
    window.addEventListener('keydown', onKey);

    const n = new THREE.Vector3();
    const step = (dt) => {
      const damp = Math.pow(0.1, dt);
      const pushing = pointerOn && performance.now() - movedAt < 140;
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        b.v.x -= b.p.x * 2.2 * dt;
        b.v.y -= b.p.y * 2.2 * dt;
        b.v.z -= (b.p.z - (i === sel ? 2.2 : 0)) * 5 * dt;
        b.v.multiplyScalar(damp);
        b.p.addScaledVector(b.v, dt);
      }
      for (let k = 0; k < 3; k++) {
        for (let i = 0; i < balls.length; i++) {
          for (let j = i + 1; j < balls.length; j++) {
            const a = balls[i], b = balls[j];
            n.subVectors(b.p, a.p);
            const d = n.length(), min = a.r + b.r;
            if (d >= min || d < 1e-5) continue;
            n.divideScalar(d);
            const push = (min - d) / 2;
            a.p.addScaledVector(n, -push);
            b.p.addScaledVector(n, push);
            const rel = b.v.dot(n) - a.v.dot(n);
            if (rel < 0) {
              const imp = rel * 0.65;
              a.v.addScaledVector(n, imp);
              b.v.addScaledVector(n, -imp);
            }
          }
        }
        if (pushing) {
          for (const b of balls) {
            n.subVectors(b.p, pointer);
            const d = n.length(), min = b.r + 0.9;
            if (d >= min || d < 1e-5) continue;
            n.divideScalar(d);
            b.p.addScaledVector(n, min - d);
            b.v.addScaledVector(n, (min - d) * 10);
          }
        }
      }
      for (let i = 0; i < balls.length; i++) {
        const b = balls[i];
        const s = b.r * (i === sel ? 1.18 : 1);
        b.mesh.scale.setScalar(b.mesh.scale.x + (s - b.mesh.scale.x) * 0.15);
        b.mesh.position.copy(b.p);
        // Icons stay facing the viewer, with a slight lean in the direction of travel.
        b.mesh.rotation.set(-b.v.y * 0.04, b.v.x * 0.04, 0);
      }
    };

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.position.set(0, 0, 6.4 / (Math.tan(THREE.MathUtils.degToRad(16)) * Math.min(1, camera.aspect)));
      camera.updateProjectionMatrix();
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(el);

    let raf = 0, last = 0, started = false;
    const loop = (t) => {
      const dt = Math.min((t - last) / 1000 || 0, 1 / 30);
      last = t;
      step(dt / 2);
      step(dt / 2);
      renderer.render(scene, camera);
      // Keep the info card pinned just above the selected ball.
      if (sel >= 0 && card.current) {
        const b = balls[sel];
        const top = b.p.clone().add(new THREE.Vector3(0, b.mesh.scale.x, 0)).project(camera);
        const x = ((top.x + 1) / 2) * el.clientWidth, y = ((1 - top.y) / 2) * el.clientHeight;
        card.current.style.transform = `translate(${x}px, ${y - 14}px) translate(-50%, -100%)`;
      }
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      raf = 0;
      if (e.isIntersecting) {
        if (!started && e.intersectionRatio > 0.25) { started = true; spawn(); }
        last = performance.now();
        raf = requestAnimationFrame(loop);
      }
    }, { threshold: [0, 0.25] });
    io.observe(el);

    const onTheme = () => paint();
    window.addEventListener('themechange', onTheme);

    return () => {
      cancelAnimationFrame(raf);
      io.disconnect();
      ro.disconnect();
      window.removeEventListener('themechange', onTheme);
      el.removeEventListener('pointermove', onMove);
      el.removeEventListener('pointerleave', onLeave);
      el.removeEventListener('pointercancel', onLeave);
      el.removeEventListener('pointerdown', onDown);
      el.removeEventListener('pointerup', onUp);
      window.removeEventListener('keydown', onKey);
      balls.forEach((b) => { b.mat.map?.dispose(); b.mat.dispose(); });
      geo.dispose();
      renderer.dispose();
      renderer.domElement.remove();
    };
  }, []);

  const info = ICONS[selected];
  return (
    <div className="stack-canvas" ref={box}>
      <div ref={card} className={'stack-card' + (info ? ' show' : '')} role="status" aria-live="polite">
        {info && (
          <>
            <p className="stack-card-group">{info.group}</p>
            <p className="stack-card-name">{info.name}</p>
            <p className="stack-card-note">{info.note}</p>
          </>
        )}
      </div>
    </div>
  );
}

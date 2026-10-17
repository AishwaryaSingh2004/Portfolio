import React, { Suspense, lazy, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { siGithub } from 'simple-icons';
import ScrollCanvas from './ScrollCanvas.jsx';
import Loader from './Loader.jsx';
import WhatIDo from './WhatIDo.jsx';
import { gsap, ScrollTrigger, lenis, reduced, scrollToId, scrollToTop, whenIntroDone } from './motion.js';
import { profile, stats, projects, experience, skills } from './data.js';
import './styles.css';

// Three.js is heavy, so the 3D stack loads in its own chunk.
const TechStack = lazy(() => import('./TechStack.jsx'));

function useRoute() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const onPop = () => setPath(window.location.pathname);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const go = (to) => {
    const [p, hash] = to.split('#');
    if (p !== window.location.pathname) {
      // New page: it scrolls to the hash itself once it has mounted.
      window.history.pushState({}, '', to);
      setPath(p);
      if (!hash) scrollToTop();
    } else if (hash) {
      scrollToId(hash);
    } else {
      scrollToId('root');
    }
  };
  return [path, go];
}

function useReveal(dep) {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach(e => e.isIntersecting && e.target.classList.add('in')),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
    return () => io.disconnect();
  }, [dep]);
}

function Link({ to, go, className, children }) {
  return (
    <a href={to} className={className} onClick={(e) => { e.preventDefault(); go(to); }}>
      {children}
    </a>
  );
}

function useTheme() {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme || 'dark');
  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = next;
    try { localStorage.setItem('theme', next); } catch {}
    window.dispatchEvent(new Event('themechange'));
    setTheme(next);
  };
  return [theme, toggle];
}

const SunIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="12" cy="12" r="4" /><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" /></svg>;
const MoonIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z" /></svg>;

function Nav({ path, go }) {
  const [open, setOpen] = useState(false);
  const [theme, toggleTheme] = useTheme();
  const [hidden, setHidden] = useState(false);
  const openRef = useRef(open);
  openRef.current = open;
  useEffect(() => {
    let last = window.scrollY;
    const onScroll = () => {
      const y = window.scrollY;
      if (Math.abs(y - last) < 6) return;
      setHidden(y > 160 && y > last && !openRef.current);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  // Freeze page scrolling while the mobile menu covers the screen.
  useEffect(() => {
    if (!open) return;
    lenis?.stop();
    document.documentElement.style.overflow = 'hidden';
    return () => { lenis?.start(); document.documentElement.style.overflow = ''; };
  }, [open]);
  const nav = (to) => {
    // Unlock scrolling before navigating so the smooth scroll isn't cancelled when the menu closes.
    if (open) { lenis?.start(); document.documentElement.style.overflow = ''; }
    setOpen(false);
    go(to);
  };
  const items = [['Work', '/#work'], ['About', '/#about'], ['Experience', '/#experience'], ['Projects', '/projects'], ['Contact', '/#contact']];
  return (
    <header className={hidden ? 'nav nav-hidden' : 'nav'}>
      <Link to="/" go={nav} className="logo"><i className="logo-mark" role="img" aria-label="AS" /><span>Aishwarya Singh</span></Link>
      <div className="nav-right">
        <nav className={open ? 'nav-links open' : 'nav-links'}>
          {items.map(([label, to]) => (
            <Link key={to} to={to} go={nav} className={to === path ? 'active' : ''}>{label}</Link>
          ))}
        </nav>
        <button className="theme-toggle" onClick={toggleTheme} aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}>
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <button className={open ? 'burger open' : 'burger'} onClick={() => setOpen(!open)} aria-label="Toggle menu"><i /><i /></button>
      </div>
    </header>
  );
}

const LinkedInIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d="M20.45 20.45h-3.55v-5.57c0-1.33-.03-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.73v20.54C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.73V1.73C24 .77 23.2 0 22.22 0z" /></svg>;
const MailIcon = () => <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3.5 6.5 8.5 6.5 8.5-6.5" /></svg>;
const GithubIcon = () => <svg viewBox="0 0 24 24" fill="currentColor"><path d={siGithub.path} /></svg>;

// Fixed social links (left) and résumé link (right) on wide screens; hidden over the footer.
function Rails({ path }) {
  const [atFooter, setAtFooter] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => whenIntroDone(() => setTimeout(() => setReady(true), reduced ? 0 : 900)), []);
  useEffect(() => {
    const footer = document.querySelector('.footer');
    if (!footer) return;
    const io = new IntersectionObserver(([e]) => setAtFooter(e.isIntersecting), { rootMargin: '0px 0px -60px 0px' });
    io.observe(footer);
    return () => io.disconnect();
  }, [path]);
  const cls = (ready ? '' : ' rail-pending') + (atFooter ? ' rail-off' : '');
  return (
    <>
      <div className={'rail rail-left' + cls}>
        <a href={profile.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn"><LinkedInIcon /></a>
        {profile.github && <a href={profile.github} target="_blank" rel="noreferrer" aria-label="GitHub"><GithubIcon /></a>}
        <a href={`mailto:${profile.email}`} aria-label="Email"><MailIcon /></a>
        <span className="rail-line" />
      </div>
      <a className={'rail rail-right' + cls} href={profile.resume} target="_blank" rel="noreferrer">Résumé <span>↗</span></a>
    </>
  );
}

// Each word sits in a mask so it can slide up into view.
const W = ({ children, className }) => <span className="w"><span className={className}>{children}</span></span>;

function useHomeMotion() {
  useLayoutEffect(() => {
    if (reduced) return;
    const ctx = gsap.context(() => {
      const intro = gsap.timeline({ paused: true, defaults: { ease: 'power4.out' } })
        .from('.scene', { opacity: 0, scale: 1.05, duration: 1.8, ease: 'power2.out' }, 0)
        .from('.hero-hey', { y: 16, opacity: 0, duration: 0.8 }, 0.15)
        .from('.hero h1 .w > span', { yPercent: 115, duration: 1.15, stagger: 0.07 }, 0.2)
        .from('.hero-sub', { y: 22, opacity: 0, duration: 1 }, 0.65)
        .from('.hero-actions > *', { y: 22, opacity: 0, duration: 0.9, stagger: 0.08 }, 0.75)
        .from('.hero-scroll', { opacity: 0, duration: 1, ease: 'power2.out' }, 1.1);
      whenIntroDone(() => intro.play());

      // Hero copy drifts up and fades as you scroll past it.
      gsap.to('.hero-inner', {
        yPercent: -18, opacity: 0, ease: 'none',
        scrollTrigger: { trigger: '.hero', start: 'top top', end: 'bottom 15%', scrub: true }
      });

      // Section headings wipe up from a mask.
      gsap.utils.toArray('.section-head h2, .statement, .services-title').forEach((el) => {
        gsap.from(el, {
          clipPath: 'inset(0 0 100% 0)', y: 50, duration: 1.3, ease: 'power4.out', clearProps: 'clipPath',
          scrollTrigger: { trigger: el, start: 'top 88%' }
        });
      });

      // Career line: a glowing dot travels down it, lighting each role as it passes.
      const career = document.querySelector('.career');
      if (career) {
        const rows = [...career.querySelectorAll('.career-row')];
        const st = { p: 0 };
        gsap.to(st, {
          p: 1, ease: 'none',
          scrollTrigger: { trigger: career, start: 'top 70%', end: 'bottom 60%', scrub: 0.6 },
          onUpdate: () => {
            career.style.setProperty('--tp', st.p.toFixed(4));
            const y = st.p * career.offsetHeight;
            rows.forEach((r) => r.classList.toggle('on', r.offsetTop + 24 <= y));
          }
        });
      }

      // Stats rise in one after another.
      gsap.from('.stat', {
        y: 30, opacity: 0, duration: 0.9, stagger: 0.1, ease: 'power3.out',
        scrollTrigger: { trigger: '.stats', start: 'top 88%' }
      });
    });
    ScrollTrigger.refresh();
    return () => ctx.revert();
  }, []);
}

function Footer({ go }) {
  return (
    <footer className="footer" id="contact">
      <div className="wrap">
        <p className="eyebrow">Contact</p>
        <h2 className="footer-title">Let’s build something <em>meaningful.</em></h2>
        <a className="footer-mail" href={`mailto:${profile.email}`}>{profile.email} <span>↗</span></a>
        <div className="footer-row">
          <span>© 2026 {profile.name}</span>
          <div className="footer-links">
            <a href={profile.linkedin} target="_blank" rel="noreferrer">LinkedIn</a>
            {profile.github && <a href={profile.github} target="_blank" rel="noreferrer">GitHub</a>}
            <a href={profile.resume} target="_blank" rel="noreferrer">Résumé</a>
            <Link to="/projects" go={go}>Projects</Link>
          </div>
          <span>{profile.location}</span>
        </div>
      </div>
    </footer>
  );
}

function Home({ go }) {
  useReveal('home');
  useHomeMotion();
  useEffect(() => {
    const id = window.location.hash.slice(1);
    // Wait for the intro (if any) so smooth scrolling is running again.
    if (id) whenIntroDone(() => setTimeout(() => { ScrollTrigger.refresh(); scrollToId(id, true); }, 60));
  }, []);

  return (
    <>
      <ScrollCanvas />
      <main className="home">
        <section className="hero wrap">
          <div className="hero-inner">
            <p className="hero-hey">Hey, I’m Aishwarya</p>
            <h1><W>Engineering</W> <W>ideas</W> <W>into</W> <em><W className="nowrap">real-world</W> <W>software.</W></em></h1>
            <p className="hero-sub">I build dependable backends, clean APIs and AI-powered products — from C# simulation modules to Gemini-driven career tools.</p>
            <div className="hero-actions">
              <Link to="/#work" go={go} className="btn btn-solid">Explore my work <span>→</span></Link>
              <Link to="/#contact" go={go} className="btn btn-ghost">Let’s connect</Link>
            </div>
          </div>
          <div className="hero-scroll"><span />Scroll</div>
        </section>

        <section className="about wrap reveal" id="about">
          <p className="eyebrow">About</p>
          <h2 className="statement">An IT graduate who turns <em>ideas</em> into systems that <em>work</em> — with a soft spot for APIs, data and generative AI.</h2>
          <div className="stats">
            {stats.map(s => (
              <div key={s.label} className="stat"><strong>{s.value}</strong><span>{s.label}</span></div>
            ))}
          </div>
        </section>

        <WhatIDo />

        <section className="work wrap" id="work">
          <div className="section-head reveal">
            <p className="eyebrow">Selected work</p>
            <h2>Things I’ve <em>built</em></h2>
          </div>
          <div className="project-list">
            {projects.map(p => (
              <article key={p.id} className="project spot reveal">
                <span className="project-num">{p.id}</span>
                <div className="project-main">
                  <p className="project-context">{p.context} · {p.year}</p>
                  <h3>{p.title}</h3>
                  <p>{p.summary}</p>
                  {p.link && <a className="live-link" href={p.link} target="_blank" rel="noreferrer">View live project <span>↗</span></a>}
                </div>
                <div className="tags">{p.stack.map(t => <span key={t}>{t}</span>)}</div>
              </article>
            ))}
          </div>
          <Link to="/projects" go={go} className="more-link reveal">See all project details <span>→</span></Link>
        </section>

        <section className="experience wrap" id="experience">
          <div className="section-head career-head reveal">
            <p className="eyebrow">Experience</p>
            <h2>My career &amp; <em>experience</em></h2>
          </div>
          <div className="career">
            <div className="career-rail" aria-hidden="true">
              <span className="career-track"><i className="career-fill" /><i className="career-dot" /></span>
            </div>
            {[...experience].reverse().map(x => (
              <div key={x.org} className="career-row">
                <div className="career-role">
                  <h3>{x.role}</h3>
                  <p className="career-org">{x.org}</p>
                  <p className="career-when">{x.when}</p>
                </div>
                <p className="career-year">{x.year}</p>
                <p className="career-desc">{x.summary}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="skills wrap" id="skills">
          <div className="section-head reveal">
            <p className="eyebrow">Toolkit</p>
            <h2>My tech <em>stack</em></h2>
          </div>
          <div className="stack-stage reveal">
            <Suspense fallback={<div className="stack-canvas" />}><TechStack /></Suspense>
            <p className="stack-hint">Click a ball to see where I use it</p>
          </div>
          <div className="skill-grid">
            {skills.map(s => (
              <div key={s.group} className="skill spot reveal">
                <h4>{s.group}</h4>
                <p>{s.items.join(' · ')}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="creds wrap reveal">
          <div className="cred spot">
            <p className="eyebrow">Education</p>
            <h3>B.Tech, Information Technology</h3>
            <p>Banasthali Vidyapith · 2026 · CGPA 7.61</p>
          </div>
          <div className="cred spot">
            <p className="eyebrow">Certification</p>
            <h3>Meta Back-End Developer</h3>
            <p>Professional Certificate · Meta</p>
          </div>
        </section>

        <Footer go={go} />
      </main>
    </>
  );
}

// A muted, looping screen recording that only plays while it is on screen.
function Walkthrough({ demo, title }) {
  const ref = useRef(null);
  useEffect(() => {
    const v = ref.current;
    if (!v || reduced) return;
    const io = new IntersectionObserver(([e]) => (e.isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.35 });
    io.observe(v);
    return () => io.disconnect();
  }, []);
  return (
    <figure className="case-demo">
      <div className="case-demo-bar" aria-hidden="true"><i /><i /><i /></div>
      <video ref={ref} src={demo.video} poster={demo.poster} muted loop playsInline preload="metadata"
        controls={reduced} aria-label={`Walkthrough of ${title}`} />
    </figure>
  );
}

function Projects({ go }) {
  useReveal('projects');
  return (
    <main className="projects-page">
      <div className="glow glow-a" /><div className="glow glow-b" /><div className="glow glow-c" />
      <section className="page-head wrap">
        <p className="eyebrow">Projects</p>
        <h1>Selected <em>projects</em></h1>
        <p className="hero-sub">A closer look at what I’ve built — the problem, my part in it, and the stack behind it.</p>
      </section>
      {projects.map((p, i) => (
        <section key={p.id} className={'case wrap reveal' + (i % 2 ? ' flip' : '')} id={p.slug}>
          <div className={'case-visual' + (p.demo ? ' has-demo' : '')}>
            <span className="case-num">{p.id}</span>
            {p.demo && <Walkthrough demo={p.demo} title={p.title} />}
            <div className="case-stack">{p.stack.map(t => <span key={t}>{t}</span>)}</div>
          </div>
          <div className="case-body">
            <p className="project-context">{p.context} · {p.year}</p>
            <h2>{p.title}</h2>
            <p className="case-sub">{p.subtitle}</p>
            <p className="case-summary">{p.summary}</p>
            <ul>{p.points.map(pt => <li key={pt}>{pt}</li>)}</ul>
            {p.link && <a className="live-link" href={p.link} target="_blank" rel="noreferrer">View live project <span>↗</span></a>}
          </div>
        </section>
      ))}
      <Footer go={go} />
    </main>
  );
}

function App() {
  const [path, go] = useRoute();
  return (
    <>
      <Loader />
      <Nav path={path} go={go} />
      <Rails path={path} />
      {path.startsWith('/projects') ? <Projects go={go} /> : <Home go={go} />}
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);

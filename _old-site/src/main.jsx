import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const projects = [
  { id: '01', title: 'AI Resume\nAnalyzer', type: 'Full-stack · GenAI', color: 'lime', tags: ['React', 'Node.js', 'Python', 'Gemini API'], body: 'A career intelligence platform that reads resumes, maps skill gaps, and creates personalized interview preparation.' },
  { id: '02', title: 'Food Delivery\nPlatform', type: 'MERN · APIs', color: 'coral', tags: ['MongoDB', 'Express', 'React', 'JWT'], body: 'Secure, database-driven food ordering flows—from authentication and cart management to payments and orders.' },
  { id: '03', title: 'Defense\nSimulation', type: '.NET · Engineering', color: 'blue', tags: ['C#', '.NET Core', 'Testing', 'Agile'], body: 'Reliable simulator modules designed, debugged, and delivered within a cross-functional engineering team.' }
];

function App() {
  const [active, setActive] = useState(0);
  const [menu, setMenu] = useState(false);
  useEffect(() => {
    const reveal = new IntersectionObserver((items) => items.forEach(i => i.isIntersecting && i.target.classList.add('in')), { threshold: .15 });
    document.querySelectorAll('.reveal').forEach(el => reveal.observe(el));
    return () => reveal.disconnect();
  }, []);
  const scroll = id => { setMenu(false); document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }); };
  return <main>
    <nav><a className="logo" href="#top">AS<span>®</span></a><div className={menu ? 'navlinks open' : 'navlinks'}><button onClick={() => scroll('work')}>Work</button><button onClick={() => scroll('about')}>About</button><button onClick={() => scroll('contact')}>Contact</button></div><button className="menu" onClick={() => setMenu(!menu)} aria-label="Toggle menu"><i></i><i></i></button></nav>
    <section className="hero" id="top">
      <div className="hero-copy"><p className="eyebrow">Portfolio / 2026</p><h1>BUILDING<br/><em>useful</em> things<br/>for the web.</h1><p className="intro">Hi, I’m Aishwarya—an engineer who loves giving complex systems an elegantly human interface.</p><button className="circle-link" onClick={() => scroll('work')}>See my work <b>↓</b></button></div>
      <div className="portrait-wrap"><div className="sun"></div><div className="stamp">OPEN TO<br/>CREATE<br/><span>✳</span></div><img src="/aishwarya-singh.png" alt="Aishwarya Singh"/><p className="vertical">SOFTWARE ENGINEER · INDIA</p></div>
      <div className="hero-foot"><span>Scroll to explore</span><span className="line"></span><span>01—04</span></div>
    </section>
    <section className="statement reveal" id="about"><p className="eyebrow">A little about me</p><h2>I turn <i>ideas</i> into<br/>systems that <i>work.</i></h2><div className="statement-grid"><p>Information Technology graduate with hands-on experience across backend development, APIs, data-driven applications, and generative AI.</p><p>Currently a Software Engineer Intern at Zen Technologies, building dependable C# and .NET Core features for defence simulation.</p><a href="#contact">More about me <span>↘</span></a></div></section>
    <section className="work" id="work"><div className="work-head"><p className="eyebrow">Selected work</p><p>(2025—26)</p></div><div className="project-list">{projects.map((p, i) => <article key={p.id} className={'project '+p.color+(active===i?' selected':'')} onMouseEnter={() => setActive(i)} onClick={() => setActive(i)}><div className="project-num">{p.id}</div><h3>{p.title.split('\n').map(x => <React.Fragment key={x}>{x}<br/></React.Fragment>)}</h3><div className="project-meta"><span>{p.type}</span><span className="arrow">↗</span></div><div className="project-detail"><p>{p.body}</p><div>{p.tags.map(t=><span key={t}>{t}</span>)}</div></div></article>)}</div></section>
    <section className="experience reveal"><p className="eyebrow">The toolkit</p><div className="marquee"><span>REACT <i>✦</i> NODE <i>✦</i> PYTHON <i>✦</i> .NET <i>✦</i> MONGODB <i>✦</i> GEMINI <i>✦</i></span></div><div className="roles"><div><small>NOW</small><h4>Software Engineer Intern</h4><p>Zen Technologies Ltd. · July 2026—Present</p></div><div><small>THEN</small><h4>Project Intern</h4><p>C-DAC, Delhi · Jan—June 2026</p></div><div><small>EDUCATION</small><h4>B.Tech, Information Technology</h4><p>Banasthali Vidyapith · CGPA 7.61</p></div></div></section>
    <section className="contact" id="contact"><p className="eyebrow">Let’s build something meaningful</p><h2>Have an idea?<br/><a href="mailto:hello@aishwaryasingh.dev">Let’s talk <span>↗</span></a></h2><footer><span>© 2026 Aishwarya Singh</span><span>Designed & built with intent.</span><a href="#top">Back to top ↑</a></footer></section>
  </main>
}
createRoot(document.getElementById('root')).render(<App />);

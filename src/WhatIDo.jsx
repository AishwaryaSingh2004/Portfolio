import React from 'react';
import { services } from './data.js';

// Bracket-cornered cards, always open; the corners spread on hover.
export default function WhatIDo() {
  return (
    <section className="services wrap" id="services">
      <div className="services-head reveal">
        <p className="eyebrow">What I do</p>
        <h2 className="services-title">What I <em>do</em></h2>
        <p className="services-note">Three things I bring to every team — from the first endpoint to the final release.</p>
      </div>
      <div className="services-list">
        {services.map((s, i) => (
          <article key={s.title} className="service spot reveal">
            <i className="corner tl" /><i className="corner tr" /><i className="corner bl" /><i className="corner br" />
            <div className="service-head">
              <span className="service-num">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="service-title">{s.title}</h3>
              <span className="service-kicker">{s.kicker}</span>
            </div>
            <div className="service-body">
              <p className="service-lead">{s.lead}</p>
              <p>{s.body}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

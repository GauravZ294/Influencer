import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import gallery from '../data/gallery.json';

const ShowcaseStage = lazy(() => import('./ShowcaseStage.jsx'));

export default function Hero({ orbitProgress }) {
  const section = useRef(null);
  const video = useRef(null);
  const [muted, setMuted] = useState(true);

  useEffect(() => {
    let cancelled = false;
    let context;
    Promise.all([import('gsap'), import('gsap/ScrollTrigger')]).then(([gsapModule, triggerModule]) => {
      if (cancelled) return;
      const gsap = gsapModule.default;
      gsap.registerPlugin(triggerModule.ScrollTrigger);
      context = gsap.context(() => {
        gsap.to(orbitProgress.current, {
          value: 1,
          ease: 'none',
          scrollTrigger: { trigger: section.current, start: 'top top', end: 'bottom bottom', scrub: 0.8 },
        });
      }, section);
    });
    return () => { cancelled = true; context?.revert(); };
  }, [orbitProgress]);

  const toggleSound = async () => {
    const element = video.current;
    if (!element) return;
    const next = !muted;
    element.muted = next;
    setMuted(next);
    if (element.paused) await element.play().catch(() => {});
  };

  return <section ref={section} id="home" className="hero-scroll-track">
    <div className="hero-sticky">
      <video ref={video} className="hero-video" src="/videos/01-vidhi-film.mp4" poster={gallery[0]?.src} autoPlay muted loop playsInline preload="metadata" aria-label="the creator fashion film" />
      <div className="hero-vignette"/>
      <div className="hero-canvas"><Suspense fallback={null}><ShowcaseStage progressRef={orbitProgress}/></Suspense></div>
      <motion.div className="hero-copy" initial={{ opacity: 0, x: -22 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.9 }}>
        <span className="section-kicker">MODEL · CREATOR · ENTREPRENEUR</span>
        <h1 className="hero-name">Vidhi<br/><em>Patel.</em></h1>
        <p className="hero-business">A portrait of a life between business and the camera. Based in Gujarat, India.</p>
        <div className="hero-actions"><a className="pill-link" href="#portfolio">EXPLORE THE WORK <span>↓</span></a><a className="pill-link" href="#contact">GET IN TOUCH <span>↗</span></a></div>
      </motion.div>
      <button type="button" className="hero-audio" onClick={toggleSound} aria-pressed={!muted}>{muted ? 'SOUND OFF +' : 'SOUND ON −'}</button>
      <div className="hero-caption"><strong>THE SAREE STUDY · 3D FORM</strong>SCROLL TO TURN THE DISPLAY FIGURE</div>
      <div className="hero-scroll-cue">SCROLL TO EXPLORE<i/></div>
    </div>
  </section>;
}

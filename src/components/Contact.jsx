import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';

export default function Contact() {
  const section = useRef(null);
  const { scrollYProgress } = useScroll({ target: section, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '18%']);
  return <section ref={section} id="contact" className="contact-section section-pad">
    <motion.div className="contact-watermark" style={{ y }} aria-hidden="true">CONTACT</motion.div>
    <div className="relative z-10 mx-auto max-w-[1180px]"><span className="section-kicker">FOR SHOOTS, PARTNERSHIPS & GOOD IDEAS</span><h2 className="section-title">Let’s make it <em>memorable.</em></h2><motion.div className="contact-card" initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.65 }}><p>Open to fashion, beauty, lifestyle and editorial shoots, and thoughtful brand collaborations.</p><a className="contact-email" href="mailto:vidhi.model02@gmail.com?subject=Portfolio%20enquiry">vidhi.model02@gmail.com <span className="ml-3">↗</span></a><div className="contact-meta">GUJARAT, INDIA · INSTAGRAM & YOUTUBE LINKS COMING SOON</div></motion.div></div>
  </section>;
}

import { motion } from 'framer-motion';
import gallery from '../data/gallery.json';
import videos from '../data/videos.json';

export default function Films() {
  return <section id="films" className="section-pad section-panel">
    <div className="showcase-head"><div className="showcase-head-copy"><span className="section-kicker">MOTION STUDIES</span><h2 className="section-title">A little more <em>alive.</em></h2><p className="section-subtitle">Short films and moving portraits from the archive.</p></div><p className="showcase-count">{videos.length} FILMS<br/>TAP TO PLAY</p></div>
    <div className="film-grid">{videos.map((video, index) => <motion.article className="film-card" key={video.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.12 }} transition={{ duration: 0.5, delay: (index % 2) * 0.1 }}><video controls playsInline preload="none" poster={gallery[(index * 9) % gallery.length]?.src} src={video.src} aria-label={`the creator fashion film ${index + 1}`}/><div className="film-label"><span>FILM {video.id}</span><span>the creator · GUJARAT</span></div></motion.article>)}</div>
  </section>;
}

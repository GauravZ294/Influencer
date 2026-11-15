import { useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import gallery from '../data/gallery.json';

const PAGE_SIZE = 12;

export default function Gallery() {
  const [page, setPage] = useState(1);
  const pageCount = Math.ceil(gallery.length / PAGE_SIZE);
  const photos = useMemo(() => gallery.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE), [page]);
  const go = (next) => {
    setPage(Math.max(1, Math.min(pageCount, next)));
    document.getElementById('portfolio')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };
  return <section id="portfolio" className="showcase-section">
    <div className="showcase-head"><div className="showcase-head-copy"><span className="section-kicker">THE PHOTO ARCHIVE</span><h2 className="section-title">A frame for <em>every side.</em></h2><p className="section-subtitle">Portraits, fashion and moments from Vidhi’s collection.</p></div><p className="showcase-count">{gallery.length} IMAGES<br/>12 SELECTED PER VIEW</p></div>
    <AnimatePresence mode="wait" initial={false}>
      <motion.div key={page} className="photo-grid" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.26 }}>
        {photos.map((image, index) => <motion.figure key={image.id} className="photo-card" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.36, delay: index * 0.025 }}><div className="photo-frame"><img src={image.src} alt={image.alt} loading="lazy" decoding="async"/></div><figcaption className="photo-caption"><span>{String((page - 1) * PAGE_SIZE + index + 1).padStart(3, '0')}</span><span>VIDHI · PORTRAIT STUDY</span></figcaption></motion.figure>)}
      </motion.div>
    </AnimatePresence>
    <div className="gallery-pager"><button type="button" onClick={() => go(page - 1)} disabled={page === 1}>← PREVIOUS</button><span>{String(page).padStart(2, '0')} <i>/</i> {String(pageCount).padStart(2, '0')}</span><button type="button" onClick={() => go(page + 1)} disabled={page === pageCount}>NEXT →</button></div>
  </section>;
}

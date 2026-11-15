import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

export default function Preloader() {
  const [visible, setVisible] = useState(true);
  useEffect(() => { const timer = window.setTimeout(() => setVisible(false), 850); return () => window.clearTimeout(timer); }, []);
  return <AnimatePresence>{visible && <motion.div className="preloader" initial={{ opacity: 1 }} exit={{ y: '-100%', transition: { duration: 0.75, ease: [0.76, 0, 0.24, 1] } }}><motion.div className="preloader-word" initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }} exit={{ opacity: 0 }}><span>VIDHI</span><em> PATEL.</em></motion.div></motion.div>}</AnimatePresence>;
}

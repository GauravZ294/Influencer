import { motion } from 'framer-motion';
import gallery from '../data/gallery.json';

const profile = gallery.find((image) => image.source === 'IMG_20261111_232850.jpg') ?? gallery[0];

export default function About() {
  return <section id="about" className="section-pad section-panel">
    <div className="profile-layout">
      <motion.figure className="profile-photo" initial={{ opacity: 0, y: 24, rotate: -2 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.7 }}><img src={profile.src} alt="the creator portrait" loading="lazy" decoding="async"/></motion.figure>
      <motion.div className="profile-copy" initial={{ opacity: 0, x: 24 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.65 }}>
        <span className="section-kicker">A LITTLE ABOUT ME</span>
        <h2 className="section-title">Numbers by day.<br/><em>Stories in every frame.</em></h2>
        <p>I’m the creator, a business owner and model from Gujarat, India. I run a Chartered Accountancy office and make space for fashion, portrait and photoshoot work.</p>
        <p>These are two sides of the same life: thoughtful work, personal style and a camera-ready point of view.</p>
        <div className="profile-facts"><span>23 YEARS OLD</span><span>GUJARAT, INDIA</span><span>BUSINESS OWNER</span><span>MODEL & PHOTOSHOOTS</span></div>
        <a href="#portfolio" className="pill-link">VIEW THE PORTRAITS ↗</a>
      </motion.div>
    </div>
  </section>;
}

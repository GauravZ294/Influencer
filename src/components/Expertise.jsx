import { motion } from 'framer-motion';

const roles = [
  { n: '01', title: 'Business & detail', copy: 'Owner of a Chartered Accountancy office. Built around care, trust and a sharp eye for detail.', tag: 'FOUNDER · FINANCE' },
  { n: '02', title: 'Fashion & presence', copy: 'Available for fashion, beauty, lifestyle and editorial shoots, from campaign frames to personal portraits.', tag: 'MODEL · PHOTOSHOOTS' },
];

export default function Expertise() {
  return <section id="expertise" className="section-pad section-panel">
    <div className="showcase-head"><div className="showcase-head-copy"><span className="section-kicker">TWO WORLDS · ONE POINT OF VIEW</span><h2 className="section-title">What I <em>bring.</em></h2><p className="section-subtitle">A considered balance of business ownership and creative work.</p></div></div>
    <div className="service-grid">{roles.map((role, index) => <motion.article className="service-card" key={role.n} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.25 }} transition={{ duration: 0.55, delay: index * 0.12 }} whileHover={{ y: -5 }}><span className="service-number">{role.n} / {role.tag}</span><h3>{role.title}</h3><p>{role.copy}</p></motion.article>)}</div>
  </section>;
}

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const links = [['ABOUT', '#about'], ['WORK', '#portfolio'], ['FILMS', '#films'], ['CONTACT', '#contact']];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 30);
    update(); window.addEventListener('scroll', update, { passive: true });
    return () => window.removeEventListener('scroll', update);
  }, []);
  const closeMenu = () => setOpen(false);
  return <motion.header className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${scrolled || open ? 'bg-[#151219]/90 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'}`}>
    <div className="mx-auto flex h-[68px] max-w-[1500px] items-center justify-between px-5 sm:px-8 lg:px-14">
      <a href="#home" onClick={closeMenu} className="brand-mark">VP<span>.</span></a>
      <nav className="hidden items-center gap-7 md:flex" aria-label="Main navigation">{links.map(([label, href]) => <a key={label} className="nav-link" href={href}>{label}</a>)}</nav>
      <a className="nav-cta hidden md:inline-flex" href="#contact">BOOK A SHOOT <span>↗</span></a>
      <button type="button" className="menu-button md:hidden" aria-label={open ? 'Close menu' : 'Open menu'} aria-expanded={open} onClick={() => setOpen((value) => !value)}><span>{open ? 'CLOSE' : 'MENU'}</span><i className={open ? 'menu-icon is-open' : 'menu-icon'}><b/><b/></i></button>
    </div>
    <AnimatePresence>{open && <motion.nav className="mobile-menu md:hidden" aria-label="Mobile navigation" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.28, ease: 'easeInOut' }}>{links.map(([label, href], index) => <motion.a key={label} href={href} onClick={closeMenu} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: index * 0.04 }}><span>0{index + 1}</span>{label}<i>↗</i></motion.a>)}<a className="mobile-book" href="#contact" onClick={closeMenu}>BOOK A SHOOT ↗</a></motion.nav>}</AnimatePresence>
  </motion.header>;
}

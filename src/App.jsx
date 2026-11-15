import { useRef } from 'react';
import Preloader from './components/Preloader.jsx';
import Navbar from './components/Navbar.jsx';
import Hero from './components/Hero.jsx';
import About from './components/About.jsx';
import Expertise from './components/Expertise.jsx';
import Gallery from './components/Gallery.jsx';
import Films from './components/Films.jsx';
import Contact from './components/Contact.jsx';
import Footer from './components/Footer.jsx';

export default function App() {
  const orbitProgress = useRef({ value: 0 });
  return <>
    <Preloader/>
    <Navbar/>
    <Hero orbitProgress={orbitProgress}/>
    <About/>
    <Expertise/>
    <Gallery/>
    <Films/>
    <Contact/>
    <Footer/>
  </>;
}

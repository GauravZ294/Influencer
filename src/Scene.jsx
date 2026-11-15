import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { MathUtils, SRGBColorSpace, TextureLoader } from 'three';
import gallery from './data/gallery.json';

const featured = [2, 5, 17, 24, 31, 44, 57, 72, 91, 108, 130, 154].map((i) => gallery[i % gallery.length]);
const showcaseImages = [1, 2, 3, 4].map((i) => `/showcase/showcase-${String(i).padStart(2, '0')}.webp`);
const R = 7.5;

function Frame({ texture, angle, index }) {
  const group = useRef(); const a = angle; const x = Math.sin(a) * R; const z = Math.cos(a) * R;
  const imageAspect = texture.image?.width && texture.image?.height ? texture.image.width / texture.image.height : 0.7;
  const imageWidth = Math.min(1.82, 2.82 * imageAspect);
  const imageHeight = Math.min(2.82, 1.82 / imageAspect);
  texture.colorSpace = SRGBColorSpace;
  return <group ref={group} position={[x, 1.55, z]} rotation={[0, a + Math.PI, 0]}>
    <mesh position={[0, 0, -0.12]}><boxGeometry args={[2.05, 3.05, 0.24]}/><meshStandardMaterial color="#302332" metalness={0.52} roughness={0.42}/></mesh>
    <mesh position={[0, 0, 0.012]}><planeGeometry args={[imageWidth, imageHeight]}/><meshBasicMaterial map={texture} toneMapped={false}/></mesh>
    <mesh position={[0, 1.53, 0]}><boxGeometry args={[2.15, 0.06, 0.07]}/><meshStandardMaterial color="#c3a47b" metalness={0.7} roughness={0.25}/></mesh>
    <mesh position={[0, -1.53, 0]}><boxGeometry args={[2.15, 0.06, 0.07]}/><meshStandardMaterial color="#c3a47b" metalness={0.7} roughness={0.25}/></mesh>
    <mesh position={[-1.04, 0, 0]}><boxGeometry args={[0.06, 3.05, 0.07]}/><meshStandardMaterial color="#c3a47b" metalness={0.7} roughness={0.25}/></mesh>
    <mesh position={[1.04, 0, 0]}><boxGeometry args={[0.06, 3.05, 0.07]}/><meshStandardMaterial color="#c3a47b" metalness={0.7} roughness={0.25}/></mesh>
    <pointLight position={[0, 2.3, 1.3]} intensity={5} distance={6} color={index % 2 ? '#f3c9bd' : '#e2c1e8'}/>
  </group>;
}

function LoadedFrame({ image, angle, index }) {
  const texture = useLoader(TextureLoader, image.src);
  return <Frame texture={texture} angle={angle} index={index}/>;
}

function FramePlaceholder({ angle }) {
  return <group position={[Math.sin(angle) * R, 1.55, Math.cos(angle) * R]} rotation={[0, angle + Math.PI, 0]}>
    <mesh><boxGeometry args={[2.05, 3.05, 0.22]}/><meshStandardMaterial color="#382a39" metalness={0.35} roughness={0.5}/></mesh>
    <mesh position={[0, 0, 0.13]}><planeGeometry args={[1.8, 2.8]}/><meshBasicMaterial color="#493448"/></mesh>
  </group>;
}

function ShowcaseStand() {
  return <group>
    <mesh position={[0, -2.88, 0]}><cylinderGeometry args={[2.72, 2.82, 0.32, 96]}/><meshStandardMaterial color="#28242a" metalness={0.82} roughness={0.24}/></mesh>
    <mesh position={[0, -2.67, 0]}><cylinderGeometry args={[2.56, 2.68, 0.11, 96]}/><meshStandardMaterial color="#c9ad8b" metalness={0.88} roughness={0.22}/></mesh>
    <mesh position={[0, -2.57, 0]}><cylinderGeometry args={[2.45, 2.53, 0.1, 96]}/><meshStandardMaterial color="#3b343b" metalness={0.72} roughness={0.25}/></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.5, 0]}><torusGeometry args={[2.4, 0.035, 10, 100]}/><meshStandardMaterial color="#ffe4b8" emissive="#ffc878" emissiveIntensity={1.7}/></mesh>
    <mesh position={[0, -2.42, 0]}><cylinderGeometry args={[1.35, 1.58, 0.18, 64]}/><meshStandardMaterial color="#a78d76" metalness={0.75} roughness={0.3}/></mesh>
    <mesh position={[0, 0.32, -0.78]}><torusGeometry args={[2.18, 0.035, 10, 120]}/><meshStandardMaterial color="#fff0d0" emissive="#f9c982" emissiveIntensity={2.2}/></mesh>
  </group>;
}

function ShowcaseDisplay({ scrollRef }) {
  const materials = useRef([]);
  const carousel = useRef();
  const images = useLoader(TextureLoader, showcaseImages);
  images.forEach((image) => { image.colorSpace = SRGBColorSpace; image.anisotropy = 8; });
  useFrame(({ camera }) => {
    const progress = MathUtils.clamp(scrollRef.current.value, 0, 1);
    const position = progress * images.length;
    const base = Math.floor(position) % images.length;
    const next = (base + 1) % images.length;
    const blend = position - Math.floor(position);
    materials.current.forEach((material, index) => {
      if (!material) return;
      if (material.map !== images[index]) { material.map = images[index]; material.needsUpdate = true; }
      material.opacity = index === base ? 1 - blend : index === next ? blend : 0;
    });
    if (carousel.current) carousel.current.rotation.y = Math.atan2(camera.position.x, camera.position.z);
  });
  return <group ref={carousel}>
      {images.map((_, index) => <mesh key={index} position={[0, -0.48, 0.12]} renderOrder={index + 1}>
        <planeGeometry args={[3.72, 3.72]}/>
        <meshBasicMaterial ref={(material) => { materials.current[index] = material; }} color="white" transparent opacity={0} depthWrite={false} toneMapped={false} side={2}/>
      </mesh>)}
      <mesh position={[0, -0.48, 0.095]}><planeGeometry args={[3.86, 3.86]}/><meshBasicMaterial color="#bda27d" side={2}/></mesh>
  </group>;
}

function Orbit({ scrollRef }) {
  const current = useRef({ angle: 0 });
  useFrame(({ camera, size }, dt) => {
    const fov = size.width / size.height < 0.72 ? 70 : 46;
    if (camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); }
    const target = MathUtils.clamp(scrollRef.current.value, 0, 1) * Math.PI * 2;
    current.current.angle += (target - current.current.angle) * (1 - Math.exp(-dt * 2.5));
    const a = current.current.angle;
    const x = Math.sin(a) * 6.4; const z = Math.cos(a) * 6.4;
    camera.position.x += (x - camera.position.x) * (1 - Math.exp(-dt * 2.7));
    camera.position.z += (z - camera.position.z) * (1 - Math.exp(-dt * 2.7));
    camera.position.y += (1.45 - camera.position.y) * (1 - Math.exp(-dt * 2)); camera.lookAt(0, -0.35, 0);
  });
  return <>
    <color attach="background" args={['#1b171d']}/><fog attach="fog" args={['#1b171d', 15, 29]}/>
    <ambientLight intensity={1.35} color="#f0e5e8"/><hemisphereLight intensity={1.45} color="#fff0e2" groundColor="#302932"/>
    <mesh position={[0, 0.5, 0]}><cylinderGeometry args={[R + 0.08, R + 0.08, 7.1, 96, 1, true]}/><meshStandardMaterial color="#615762" side={2} roughness={0.75}/></mesh>
    <mesh position={[0, 5, 0]}><cylinderGeometry args={[R + 0.1, R + 0.1, 0.18, 96]}/><meshStandardMaterial color="#4a3f4b" metalness={0.3} roughness={0.5}/></mesh>
    <mesh position={[0, 4.88, 0]}><torusGeometry args={[4.9, 0.045, 8, 100]}/><meshStandardMaterial color="#e3c59c" emissive="#ddb484" emissiveIntensity={0.9}/></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -3.08, 0]}><circleGeometry args={[R, 96]}/><meshStandardMaterial color="#302a32" metalness={0.26} roughness={0.55}/></mesh>
    {Array.from({ length: 16 }, (_, i) => { const a = i * Math.PI * 2 / 16; return <group key={i} position={[Math.sin(a) * (R - 0.12), 0.7, Math.cos(a) * (R - 0.12)]}><mesh><boxGeometry args={[0.15, 7.25, 0.15]}/><meshStandardMaterial color="#786b76" metalness={0.6} roughness={0.34}/></mesh><mesh position={[0, 2.1, 0]}><sphereGeometry args={[0.14, 16, 16]}/><meshStandardMaterial color="#e2c59e" metalness={0.8}/></mesh></group>; })}
    {featured.map((image, i) => <Suspense key={image.id} fallback={<FramePlaceholder angle={i * Math.PI * 2 / featured.length}/> }><LoadedFrame image={image} index={i} angle={i * Math.PI * 2 / featured.length}/></Suspense>)}
    <pointLight position={[0, 4.4, 0]} intensity={35} distance={15} color="#ffe9d7"/>
    <spotLight position={[0, 7, 2]} intensity={48} angle={0.55} penumbra={0.75} color="#fff0df"/>
    <ShowcaseStand/>
    <Suspense fallback={null}><ShowcaseDisplay scrollRef={scrollRef}/></Suspense>
  </>;
}

export default function Rotunda({ scrollRef }) {
  return <Canvas dpr={[1, 1.4]} camera={{ position: [0, 1.2, 6.4], fov: 46 }} gl={{ antialias: true, powerPreference: 'high-performance' }}><Orbit scrollRef={scrollRef}/></Canvas>;
}

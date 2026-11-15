import { Suspense, useRef } from 'react';
import { Canvas, useFrame, useLoader } from '@react-three/fiber';
import { MathUtils, SRGBColorSpace, TextureLoader } from 'three';

function PhotographicFigure({ progressRef }) {
  const figure = useRef();
  const texture = useLoader(TextureLoader, '/model/vidhi-saree-cutout.webp');
  texture.colorSpace = SRGBColorSpace;
  texture.anisotropy = 8;

  useFrame(({ camera }) => {
    if (figure.current) figure.current.rotation.y = Math.atan2(camera.position.x, camera.position.z);
    const stageTurn = MathUtils.clamp(progressRef.current.value, 0, 1) * Math.PI * 2;
    if (figure.current) figure.current.rotation.y += Math.sin(stageTurn) * 0.002;
  });

  return <group ref={figure} position={[0, -0.41, 0.02]}>
    <mesh position={[0, 0, 0.03]}>
      <planeGeometry args={[1.23, 3.75]}/>
      <meshBasicMaterial map={texture} transparent alphaTest={0.04} depthWrite={false} toneMapped={false} side={2}/>
    </mesh>
  </group>;
}

function Stage({ progressRef }) {
  const orbit = useRef({ angle: 0 });
  useFrame(({ camera, clock, size }, delta) => {
    const mobile = size.width / size.height < 0.72;
    const fov = mobile ? 60 : 46;
    if (camera.fov !== fov) { camera.fov = fov; camera.updateProjectionMatrix(); }
    const target = MathUtils.clamp(progressRef.current.value, 0, 1) * Math.PI * 2;
    orbit.current.angle = MathUtils.damp(orbit.current.angle, target, 2.5, delta);
    const angle = orbit.current.angle;
    const radius = mobile ? 6.2 : 6.5;
    camera.position.x = MathUtils.damp(camera.position.x, Math.sin(angle) * radius, 2.5, delta);
    camera.position.z = MathUtils.damp(camera.position.z, Math.cos(angle) * radius, 2.5, delta);
    camera.position.y = MathUtils.damp(camera.position.y, 1.12 + Math.sin(clock.elapsedTime * 0.28) * 0.025, 2, delta);
    camera.lookAt(0, -0.16, 0);
  });

  return <>
    <ambientLight intensity={1.2} color="#f5e7e8"/>
    <hemisphereLight intensity={1.25} color="#fff0e2" groundColor="#17131b"/>
    <spotLight position={[0, 6, 3]} intensity={56} angle={0.62} penumbra={0.82} color="#fff0dc"/>
    <spotLight position={[-3.7, 2.5, -2]} intensity={24} angle={0.54} penumbra={0.8} color="#d7c2eb"/>
    <pointLight position={[0, 0.2, 1]} intensity={13} distance={8} color="#f2c9ac"/>

    <mesh position={[0, -2.7, 0]}><cylinderGeometry args={[1.92, 2.02, 0.36, 96]}/><meshStandardMaterial color="#17151a" metalness={0.84} roughness={0.22}/></mesh>
    <mesh position={[0, -2.48, 0]}><cylinderGeometry args={[1.82, 1.94, 0.12, 96]}/><meshStandardMaterial color="#cfb18a" metalness={0.9} roughness={0.18}/></mesh>
    <mesh position={[0, -2.36, 0]}><cylinderGeometry args={[1.72, 1.81, 0.12, 96]}/><meshStandardMaterial color="#29242c" metalness={0.78} roughness={0.22}/></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.28, 0]}><torusGeometry args={[1.68, 0.04, 10, 120]}/><meshStandardMaterial color="#ffe6bd" emissive="#ffca7a" emissiveIntensity={1.9}/></mesh>
    <mesh position={[0, 0.2, -0.82]}><torusGeometry args={[1.78, 0.035, 12, 128]}/><meshStandardMaterial color="#fff0d4" emissive="#f8c982" emissiveIntensity={2.2}/></mesh>
    <mesh position={[0, 0.2, -0.9]}><torusGeometry args={[1.9, 0.012, 8, 128]}/><meshStandardMaterial color="#d7b484" emissive="#d7b484" emissiveIntensity={0.8}/></mesh>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.93, 0]}><circleGeometry args={[8, 96]}/><meshStandardMaterial color="#26212a" roughness={0.65}/></mesh>
    <Suspense fallback={null}><PhotographicFigure progressRef={progressRef}/></Suspense>
  </>;
}

export default function ShowcaseStage({ progressRef }) {
  return <Canvas dpr={[1, 1.4]} camera={{ position: [0, 1.12, 6.5], fov: 46 }} gl={{ alpha: true, antialias: true, powerPreference: 'high-performance' }}><Stage progressRef={progressRef}/></Canvas>;
}

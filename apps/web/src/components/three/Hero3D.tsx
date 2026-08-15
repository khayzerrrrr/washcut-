import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import type { Group, Mesh } from 'three';

function useReducedMotion() {
  const [reduced, setReduced] = useState(() =>
    typeof window !== 'undefined'
      ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
      : false,
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const onChange = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  return reduced;
}

function Ring({ position, radius, tube, color }: { position: [number, number, number]; radius: number; tube: number; color: string }) {
  const ref = useRef<Mesh>(null);
  const reduced = useReducedMotion();

  useFrame((state, dt) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.x += dt * 0.15;
    ref.current.rotation.y += dt * 0.2;
    ref.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.6 + position[0]) * 0.15;
  });

  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[radius, tube, 24, 96]} />
      <meshStandardMaterial color={color} roughness={0.35} metalness={0.7} />
    </mesh>
  );
}

function Core() {
  const ref = useRef<Group>(null);
  const reduced = useReducedMotion();

  useFrame((state, dt) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.y += dt * 0.25;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.15;
  });

  return (
    <group ref={ref}>
      <Float speed={1.6} rotationIntensity={0.4} floatIntensity={0.8}>
        <mesh>
          <icosahedronGeometry args={[1.15, 0]} />
          <meshStandardMaterial color="#dc2626" roughness={0.25} metalness={0.45} flatShading />
        </mesh>
        <Ring position={[0, 0, 0]} radius={1.9} tube={0.09} color="#f87171" />
        <Ring position={[0.9, 0.7, 0.6]} radius={0.9} tube={0.07} color="#0ea5e9" />
        <Ring position={[-1, -0.6, 0.4]} radius={0.7} tube={0.06} color="#94a3b8" />
        <mesh position={[1.6, 0.9, -0.4]}>
          <sphereGeometry args={[0.28, 32, 32]} />
          <meshStandardMaterial color="#f87171" roughness={0.2} metalness={0.6} />
        </mesh>
        <mesh position={[-1.5, 0.9, 0.2]}>
          <sphereGeometry args={[0.2, 24, 24]} />
          <meshStandardMaterial color="#0ea5e9" roughness={0.25} metalness={0.5} />
        </mesh>
        <mesh position={[0.3, -1.4, 0.8]}>
          <sphereGeometry args={[0.18, 24, 24]} />
          <meshStandardMaterial color="#e2e8f0" roughness={0.3} metalness={0.4} />
        </mesh>
      </Float>
    </group>
  );
}

function useWebGL() {
  const [supported, setSupported] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl =
        canvas.getContext('webgl2') ||
        canvas.getContext('webgl') ||
        (canvas.getContext('experimental-webgl') as WebGLRenderingContext | null);
      if (!gl) setSupported(false);
    } catch {
      setSupported(false);
    }
  }, []);

  return supported;
}

export function Hero3D() {
  const supported = useWebGL();

  const dpr = useMemo(() => (typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1), []);

  if (!supported) return null;

  return (
    <div
      role="img"
      aria-label="Animasi 3D abstrak dengan cincin dan bola mengambang bernuansa merah khas WashCut."
      className="pointer-events-none absolute inset-0 hidden lg:block"
    >
      <Canvas
        camera={{ position: [0, 0, 7.2], fov: 50 }}
        dpr={dpr}
        gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.6} />
        <directionalLight position={[5, 10, 7.5]} intensity={1.2} />
        <pointLight position={[-4, -2, 3]} intensity={30} color="#dc2626" />
        <Core />
        <Sparkles count={70} scale={[8, 5, 5]} size={2} speed={0.35} color="#f87171" opacity={0.5} />
        <Sparkles count={40} scale={[8, 5, 5]} size={1.5} speed={0.2} color="#e2e8f0" opacity={0.4} />
      </Canvas>
    </div>
  );
}
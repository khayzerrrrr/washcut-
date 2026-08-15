import { useRef, useMemo, useEffect, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Sparkles, RoundedBox } from '@react-three/drei';
import type { Group, Mesh } from 'three';
import * as THREE from 'three';

type Vertical = 'barbershop' | 'car_wash';

const BRAND = '#126bff';
const CYAN = '#39e7ff';

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

function useBarberStripesTexture() {
  return useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 512;
    const ctx = canvas.getContext('2d')!;
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const stripeW = 26;
    const gap = 38;
    for (let y = -canvas.height; y < canvas.height * 2; y += gap) {
      ctx.fillStyle = '#e11d48';
      ctx.save();
      ctx.translate(0, y);
      ctx.transform(1, -0.5, 0, 1, 0, 0);
      ctx.fillRect(-stripeW, 0, stripeW, canvas.height * 4);
      ctx.restore();
      ctx.fillStyle = '#1d4ed8';
      ctx.save();
      ctx.translate(0, y + stripeW);
      ctx.transform(1, -0.5, 0, 1, 0, 0);
      ctx.fillRect(0, 0, stripeW, canvas.height * 4);
      ctx.restore();
    }
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(1, 2);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);
}

function Spinner({ children }: { children: React.ReactNode }) {
  const ref = useRef<Group>(null);
  const reduced = useReducedMotion();

  useFrame((state, dt) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.y += dt * 0.6;
    ref.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.4) * 0.1;
  });

  return <group ref={ref}>{children}</group>;
}

function BarberPole() {
  const texture = useBarberStripesTexture();
  const reduced = useReducedMotion();
  const group = useRef<Group>(null);

  useFrame((state) => {
    if (!group.current || reduced) return;
    group.current.rotation.y += 0.004;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.06;
  });

  const pole = (
    <group>
      <mesh position={[0, 0, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 3, 24, 1, true]} />
        <meshStandardMaterial map={texture} roughness={0.4} />
      </mesh>
      <mesh position={[0, 1.55, 0]}>
        <sphereGeometry args={[0.34, 20, 16]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.25} metalness={0.85} />
      </mesh>
      <mesh position={[0, 1.6, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.14, 24]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.9} />
      </mesh>
      <mesh position={[0, -1.55, 0]}>
        <sphereGeometry args={[0.34, 20, 16]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.25} metalness={0.85} />
      </mesh>
      <mesh position={[0, -1.6, 0]}>
        <cylinderGeometry args={[0.4, 0.4, 0.14, 24]} />
        <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.9} />
      </mesh>
    </group>
  );

  return <group ref={group}>{pole}</group>;
}

function Scissors() {
  const reduced = useReducedMotion();
  const ref = useRef<Group>(null);

  useFrame((state) => {
    if (!ref.current || reduced) return;
    ref.current.rotation.z = Math.sin(state.clock.elapsedTime * 0.8) * 0.12;
  });

  const blade = (
    <mesh rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.05, 0.05, 2.2, 10]} />
      <meshStandardMaterial color="#e2e8f0" roughness={0.2} metalness={0.9} />
    </mesh>
  );

  return (
    <group ref={ref} position={[2.1, 0.4, 0.5]}>
      <group>
        <group rotation={[0, 0, 0.35]}>
          {blade}
          <mesh position={[0, -0.95, 0]} rotation={[0, 0, -0.15]}>
            <boxGeometry args={[0.28, 0.9, 0.1]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.25} metalness={0.9} />
          </mesh>
          <mesh position={[-0.35, -0.9, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.17, 0.05, 10, 20]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.9} />
          </mesh>
        </group>
        <group rotation={[0, 0, -0.35]}>
          {blade}
          <mesh position={[0, -0.95, 0]} rotation={[0, 0, 0.15]}>
            <boxGeometry args={[0.28, 0.9, 0.1]} />
            <meshStandardMaterial color="#e2e8f0" roughness={0.25} metalness={0.9} />
          </mesh>
          <mesh position={[0.35, -0.9, 0]} rotation={[0, 0, Math.PI / 2]}>
            <torusGeometry args={[0.17, 0.05, 10, 20]} />
            <meshStandardMaterial color="#94a3b8" roughness={0.3} metalness={0.9} />
          </mesh>
        </group>
      </group>
      <mesh position={[0, 0.15, 0]}>
        <sphereGeometry args={[0.1, 14, 12]} />
        <meshStandardMaterial color="#cbd5e1" roughness={0.25} metalness={0.95} />
      </mesh>
    </group>
  );
}

function BarberScene() {
  const reduced = useReducedMotion();
  const meshes = (
    <group position={[0, -0.4, 0]}>
      <BarberPole />
      <Scissors />
    </group>
  );
  return (
    <group>
      {reduced ? meshes : <Float speed={1.4} rotationIntensity={0.25} floatIntensity={0.5}>{meshes}</Float>}
    </group>
  );
}

function Wheel({ position }: { position: [number, number, number] }) {
  return (
    <mesh position={position} rotation={[0, 0, Math.PI / 2]}>
      <cylinderGeometry args={[0.3, 0.3, 0.18, 20]} />
      <meshStandardMaterial color="#1e293b" roughness={0.9} metalness={0.1} />
    </mesh>
  );
}

function Car() {
  const reduced = useReducedMotion();
  const ref = useRef<Group>(null);

  useFrame((state) => {
    if (!ref.current || reduced) return;
    ref.current.position.y = Math.sin(state.clock.elapsedTime * 0.9) * 0.07;
  });

  return (
    <group ref={ref} position={[0, -0.6, 0]}>
      <RoundedBox args={[3, 0.7, 1.4]} radius={0.16} position={[0, 0.1, 0]}>
        <meshStandardMaterial color={BRAND} roughness={0.25} metalness={0.5} />
      </RoundedBox>
      <RoundedBox args={[1.5, 0.7, 1.35]} radius={0.14} position={[-0.15, 0.75, 0]}>
        <meshStandardMaterial color="#0b4fc4" roughness={0.3} metalness={0.4} />
      </RoundedBox>
      <RoundedBox args={[0.05, 0.45, 1.36]} radius={0.02} position={[0.55, 0.72, 0]}>
        <meshStandardMaterial color={CYAN} roughness={0.2} metalness={0.6} />
      </RoundedBox>
      <Wheel position={[-0.95, -0.42, 0.75]} />
      <Wheel position={[-0.95, -0.42, -0.75]} />
      <Wheel position={[0.95, -0.42, 0.75]} />
      <Wheel position={[0.95, -0.42, -0.75]} />
      <mesh position={[0.4, 0.32, 0.74]} rotation={[Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.1} metalness={0.6} />
      </mesh>
      <mesh position={[-1.15, 0.32, 0.74]} rotation={[Math.PI / 2, 0, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color="#fef3c7" roughness={0.1} metalness={0.6} />
      </mesh>
    </group>
  );
}

function WaterDrop({ position, size }: { position: [number, number, number]; size: number }) {
  return (
    <mesh position={position}>
      <sphereGeometry args={[size, 16, 16]} />
      <meshStandardMaterial
        color={CYAN}
        transparent
        opacity={0.55}
        roughness={0.1}
        metalness={0.3}
      />
    </mesh>
  );
}

function CarWashScene() {
  const reduced = useReducedMotion();
  const meshes = (
    <group position={[0, 0.4, 0]}>
      <Car />
      <WaterDrop position={[1.9, 1.1, 0.6]} size={0.22} />
      <WaterDrop position={[-1.8, 1.3, -0.4]} size={0.18} />
      <WaterDrop position={[1.4, -0.15, -0.9]} size={0.16} />
      <WaterDrop position={[-1.5, -0.2, 0.9]} size={0.15} />
      <WaterDrop position={[0, 1.7, 0.5]} size={0.25} />
      <WaterDrop position={[0.9, -1.1, 0.4]} size={0.13} />
      <WaterDrop position={[-1.1, 1.7, -0.3]} size={0.14} />
    </group>
  );
  return (
    <group>
      {reduced ? meshes : <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.6}>{meshes}</Float>}
    </group>
  );
}

function ThemeScene({ vertical }: { vertical: Vertical }) {
  return (
    <Spinner>{vertical === 'barbershop' ? <BarberScene /> : <CarWashScene />}</Spinner>
  );
}

export function Hero3D({ vertical }: { vertical: Vertical }) {
  const supported = useWebGL();
  const reduced = useReducedMotion();

  const dpr = useMemo(() => (typeof window !== 'undefined' ? Math.min(window.devicePixelRatio, 2) : 1), []);

  if (!supported) return null;

  const label =
    vertical === 'barbershop'
      ? 'Animasi 3D barber pole dan gunting.'
      : 'Animasi 3D mobil dan tetesan air.';

  return (
    <div
      role="img"
      aria-label={label}
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
        <pointLight position={[-4, -2, 3]} intensity={30} color={vertical === 'barbershop' ? BRAND : CYAN} />
        <ThemeScene vertical={vertical} />
        {vertical === 'barbershop' ? (
          <>
            <Sparkles count={reduced ? 0 : 70} scale={[8, 5, 5]} size={2} speed={0.35} color="#e2e8f0" opacity={0.5} />
            <Sparkles count={reduced ? 0 : 40} scale={[8, 5, 5]} size={1.5} speed={0.2} color="#ffffff" opacity={0.4} />
          </>
        ) : (
          <>
            <Sparkles count={reduced ? 0 : 70} scale={[8, 5, 5]} size={2} speed={0.35} color={CYAN} opacity={0.5} />
            <Sparkles count={reduced ? 0 : 40} scale={[8, 5, 5]} size={1.5} speed={0.2} color="#e0f2fe" opacity={0.4} />
          </>
        )}
      </Canvas>
    </div>
  );
}

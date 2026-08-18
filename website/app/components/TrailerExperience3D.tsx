"use client";

import { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

const MODEL_URL = "/models/Hi3D_Realistic Glossy Black Coffee Food Trailer 3D Model_allparts_20260817_153424.glb";

type Hotspot = { number: string; title: string; text: string; position: string };
type TrailerExperience3DProps = { trailerType?: string; setTrailerType?: (value: string) => void };

const hotspots: Hotspot[] = [
  { number: "01", title: "CUSTOM SERVICE WINDOW", text: "Serving windows, awnings and exterior details are designed around how your business works.", position: "left-[24%] top-[48%]" },
  { number: "02", title: "BUILT AROUND THE BUSINESS", text: "The layout, equipment and workflow can be designed around the way you actually operate.", position: "left-[50%] top-[38%]" },
  { number: "03", title: "CUSTOM EQUIPMENT", text: "Coffee equipment, refrigeration, sinks, prep space and storage can all be integrated into the build.", position: "left-[67%] top-[52%]" },
  { number: "04", title: "MORE THAN A FOOD TRAILER", text: "This is one example of what custom can look like. We build around the idea—not a template.", position: "left-[79%] top-[35%]" },
];

function TrailerModel({ rotation, onLoaded }: { rotation: React.MutableRefObject<number>; onLoaded: () => void }) {
  const { scene } = useGLTF(MODEL_URL);
  const cloned = useMemo(() => scene.clone(), [scene]);
  const group = useRef<THREE.Group>(null);
  useMemo(() => { onLoaded(); }, [onLoaded]);
  useFrame(() => { if (group.current) group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, rotation.current, 0.08); });
  return <group ref={group} scale={3.15} position={[0, -0.9, 0]}><primitive object={cloned} /></group>;
}

function TurntableSurface({ rotation, setInteracting }: { rotation: React.MutableRefObject<number>; setInteracting: (value: boolean) => void }) {
  const direction = useRef(1); const pauseUntil = useRef(0); const lastX = useRef<number | null>(null);
  useFrame(() => { if (performance.now() < pauseUntil.current) return; const limit = 1.05; rotation.current += direction.current * 0.0024; if (rotation.current >= limit) { rotation.current = limit; direction.current = -1; } if (rotation.current <= -limit) { rotation.current = -limit; direction.current = 1; } });
  const down = (event: any) => { event.stopPropagation(); lastX.current = event.clientX; pauseUntil.current = performance.now() + 3200; setInteracting(true); };
  const move = (event: any) => { if (lastX.current === null) return; event.stopPropagation(); const delta = event.clientX - lastX.current; lastX.current = event.clientX; rotation.current = THREE.MathUtils.clamp(rotation.current + delta * 0.012, -1.18, 1.18); pauseUntil.current = performance.now() + 3200; };
  const up = (event: any) => { event.stopPropagation(); lastX.current = null; pauseUntil.current = performance.now() + 1800; setInteracting(false); };
  return <mesh position={[0, 0, 0]} scale={[11, 7, 1]} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up}><planeGeometry args={[1, 1]} /><meshBasicMaterial transparent opacity={0} depthWrite={false} /></mesh>;
}

useGLTF.preload(MODEL_URL);

export default function TrailerExperience3D(_props?: TrailerExperience3DProps) {
  const [active, setActive] = useState<Hotspot | null>(null); const [interacting, setInteracting] = useState(false); const [loaded, setLoaded] = useState(false); const rotation = useRef(-0.55);
  return <section id="custom-build" className="relative w-full overflow-hidden border-t border-[var(--line)] bg-[#101214] text-white">
    <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] [background-size:56px_56px]" />
    <div className="relative mx-auto max-w-7xl px-4 py-20 sm:px-8 lg:py-28">
      <div className="mx-auto max-w-3xl text-center"><span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">A closer look at custom</span><h2 className="mt-4 font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl">CUSTOM DOESN&apos;T MEAN A TEMPLATE.</h2><p className="mx-auto mt-6 max-w-xl text-base leading-relaxed text-white/55 sm:text-lg">Watch the build turn. Move it left or right and tap the points to see what makes it custom.</p></div>
      <div className="mx-auto mt-12 max-w-6xl"><div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#17191c] shadow-2xl">
        <div className="absolute left-4 top-4 z-30 rounded-full border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-md sm:left-5 sm:top-5"><span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/65">Custom build · 3D</span></div>
        <div className="relative h-[390px] w-full overflow-hidden bg-[#111315] sm:h-[500px] lg:h-[610px] touch-pan-y">
          {!loaded && <div className="absolute inset-0 z-25 flex items-center justify-center bg-[#111315]"><div className="relative z-10 rounded-full border border-white/10 bg-black/65 px-5 py-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/75 backdrop-blur-md">Interactive 3D preview loading…</div></div>}
          <Canvas camera={{ position: [5.5, 2.5, 6.5], fov: 30 }} dpr={[1, 1.5]} gl={{ antialias: true, alpha: true }}><ambientLight intensity={2} /><directionalLight position={[5, 8, 5]} intensity={3} /><Environment preset="city" /><Suspense fallback={null}><TrailerModel rotation={rotation} onLoaded={() => setLoaded(true)} /></Suspense><TurntableSurface rotation={rotation} setInteracting={setInteracting} /></Canvas>
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#101214]/70 via-transparent to-black/10" />
          {hotspots.map((hotspot) => <button key={hotspot.number} type="button" onClick={() => setActive(active?.number === hotspot.number ? null : hotspot)} className={`absolute ${hotspot.position} z-20 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/90 bg-black/70 font-mono text-[9px] font-bold text-white shadow-[0_0_24px_rgba(255,255,255,.18)] backdrop-blur transition hover:scale-110 hover:border-[var(--accent)] hover:bg-[var(--accent)] sm:h-10 sm:w-10`} aria-label={`Explore ${hotspot.title}`}>{hotspot.number}</button>)}
          {active && <div className="absolute bottom-4 left-4 right-4 z-30 mx-auto max-w-md rounded-xl border border-white/10 bg-black/75 p-4 backdrop-blur-xl sm:bottom-6 sm:left-6 sm:right-auto sm:p-5"><div className="flex items-start justify-between gap-4"><div><span className="font-mono text-[9px] text-[var(--accent)]">{active.number}</span><h3 className="mt-1 font-display text-lg font-semibold sm:text-xl">{active.title}</h3><p className="mt-2 text-xs leading-relaxed text-white/55">{active.text}</p></div><button type="button" onClick={() => setActive(null)} className="font-mono text-xs text-white/45 hover:text-white" aria-label="Close detail">×</button></div></div>}
          <div className="absolute bottom-4 left-1/2 z-20 -translate-x-1/2 rounded-full border border-white/10 bg-black/50 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.18em] text-white/55 backdrop-blur-md whitespace-nowrap">{interacting ? "Release to let it turn again" : "Turns automatically · Swipe left / right"}</div>
        </div></div></div>
    </div>
  </section>;
}

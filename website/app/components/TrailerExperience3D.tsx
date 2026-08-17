"use client";

import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, OrbitControls, useGLTF } from "@react-three/drei";

const MODEL_URL = "/models/Hi3D_Realistic Glossy Black Coffee Food Trailer 3D Model_allparts_20260817_153424.glb";

type Idea = {
  title: string;
  text: string;
};

const ideas: Idea[] = [
  { title: "FOOD TRAILER", text: "Built around your menu and workflow." },
  { title: "COFFEE", text: "Designed for beverages and fast service." },
  { title: "CATERING", text: "A professional mobile kitchen for events." },
  { title: "MOBILE KITCHEN", text: "Full production capability on wheels." },
  { title: "CUSTOM", text: "Something different? Tell us what you have in mind." },
];

function TrailerModel() {
  const { scene } = useGLTF(MODEL_URL);
  const model = useMemo(() => scene.clone(true), [scene]);
  return <primitive object={model} scale={1.65} position={[0, -1.35, 0]} />;
}

useGLTF.preload(MODEL_URL);

export default function TrailerExperience3D({
  trailerType,
  setTrailerType,
}: {
  trailerType: string;
  setTrailerType: (value: string) => void;
}) {
  const [activeIdea, setActiveIdea] = useState<string>(trailerType || "FOOD TRAILER");
  const [modelFailed, setModelFailed] = useState(false);

  return (
    <section id="custom-build" className="relative w-full overflow-hidden border-t border-[var(--line)] bg-[#101214] text-white">
      <div className="absolute inset-0 opacity-25 [background-image:linear-gradient(rgba(255,255,255,.055)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.055)_1px,transparent_1px)] [background-size:56px_56px]" />
      <div className="absolute -left-40 top-1/3 h-96 w-96 rounded-full bg-[var(--accent)]/10 blur-[120px]" />
      <div className="absolute -right-40 bottom-0 h-96 w-96 rounded-full bg-[var(--accent-2)]/10 blur-[120px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.28em] text-white/45">Explore · Customize · Build</span>
          <h2 className="mt-4 font-display text-5xl font-semibold leading-[0.95] tracking-tight sm:text-7xl">
            BUILD YOUR BUSINESS<br className="hidden sm:block" /> ON WHEELS.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/55 sm:text-lg">
            Explore a real build, choose the kind of trailer you need, and start your project without leaving the experience.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#17191c] shadow-2xl">
            <div className="absolute left-5 top-5 z-30 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/65">Interactive 3D preview</span>
            </div>

            <div className="relative aspect-[16/8.5] min-h-[440px] overflow-hidden bg-[#111315]">
              {!modelFailed ? (
                <Canvas
                  camera={{ position: [5.5, 3.1, 6.6], fov: 36 }}
                  onCreated={({ gl }) => {
                    gl.setPixelRatio(Math.min(window.devicePixelRatio, 1.7));
                  }}
                >
                  <ambientLight intensity={1.2} />
                  <directionalLight position={[5, 8, 4]} intensity={2.4} />
                  <directionalLight position={[-4, 3, -2]} intensity={1.3} />
                  <Environment preset="studio" />
                  <TrailerModel />
                  <OrbitControls enablePan={false} minDistance={4} maxDistance={11} minPolarAngle={Math.PI / 3.2} maxPolarAngle={Math.PI / 2.05} autoRotate autoRotateSpeed={0.7} />
                </Canvas>
              ) : (
                <div className="absolute inset-0 flex items-center justify-center bg-[url('/photos/carbon-coffee-render.png')] bg-cover bg-center">
                  <div className="absolute inset-0 bg-black/35" />
                  <div className="relative rounded-full border border-white/15 bg-black/55 px-4 py-2 font-mono text-[9px] uppercase tracking-[0.2em] text-white/70 backdrop-blur">
                    3D preview unavailable — showing render
                  </div>
                </div>
              )}

              <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between pointer-events-none">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/45">Featured build</p>
                  <h3 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">Carbon Coffee Trailer</h3>
                  <p className="mt-1 text-xs text-white/45">Drag to rotate. Scroll to zoom. Explore the build in 3D.</p>
                </div>
                <div className="rounded-full border border-white/10 bg-black/50 px-3 py-2 font-mono text-[8px] uppercase tracking-[0.2em] text-white/45 backdrop-blur">
                  {activeIdea}
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">Interactive model · rotate · zoom · explore</p>
        </div>

        <div className="mx-auto mt-20 max-w-6xl">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">Start with an idea</span>
              <h3 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">What are you building?</h3>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-white/45">Choose only the type of trailer you want. Your selection carries straight into the existing quote form.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {ideas.map((idea) => {
              const selected = activeIdea === idea.title;
              return (
                <button
                  key={idea.title}
                  type="button"
                  onClick={() => {
                    setActiveIdea(idea.title);
                    setTrailerType(idea.title);
                  }}
                  className={`group relative min-h-[150px] overflow-hidden rounded-xl border p-5 text-left transition duration-300 ${selected ? "border-[var(--accent)] bg-[var(--accent)]/15 shadow-[0_0_0_1px_var(--accent)]" : "border-white/10 bg-white/[.035] hover:border-white/25 hover:bg-white/[.07]"}`}
                >
                  <span className={`font-mono text-[9px] ${selected ? "text-[var(--accent)]" : "text-white/25"}`}>{selected ? "✓" : String(ideas.indexOf(idea) + 1).padStart(2, "0")}</span>
                  <div className="absolute bottom-5 left-5 right-5">
                    <p className="font-display text-lg font-semibold">{idea.title}</p>
                    <p className="mt-1 text-[11px] leading-relaxed text-white/40 group-hover:text-white/60">{idea.text}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-4xl rounded-2xl border border-white/10 bg-white/[.03] p-7 sm:p-9">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">Selected trailer</span>
              <h3 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{activeIdea}</h3>
              <p className="mt-2 max-w-xl text-sm text-white/45">Your selection will be used as the existing trailer type / interest when you request your quote.</p>
            </div>
            <a href="#contact" className="shrink-0 inline-flex items-center gap-2 rounded bg-[var(--accent)] px-6 py-3.5 font-semibold text-white transition hover:bg-[var(--accent-glow)]">
              START YOUR BUILD <span>→</span>
            </a>
          </div>
        </div>

        <div className="mx-auto mt-24 max-w-5xl border-y border-white/10 py-16 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/35">Custom means custom</span>
          <h3 className="mt-4 font-display text-4xl font-semibold leading-none sm:text-6xl">
            YOUR BUSINESS IS UNIQUE.<br />
            <span className="text-white/45">YOUR TRAILER SHOULD BE TOO.</span>
          </h3>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-relaxed text-white/45 sm:text-base">
            Food. Cargo. Utility. Mobile kitchens. Specialty builds. We start with what you need and build from there.
          </p>
        </div>
      </div>
    </section>
  );
}

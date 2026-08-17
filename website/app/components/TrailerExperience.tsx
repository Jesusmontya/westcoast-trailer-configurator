"use client";

import { useEffect, useRef, useState } from "react";

type Hotspot = {
  id: string;
  label: string;
  title: string;
  text: string;
  position: string;
};

const hotspots: Hotspot[] = [
  {
    id: "service",
    label: "01",
    title: "CUSTOM SERVICE WINDOW",
    text: "Designed around the way your business operates, with the layout, serving height and finish selected for the build.",
    position: "left-[22%] top-[42%]",
  },
  {
    id: "kitchen",
    label: "02",
    title: "COMMERCIAL KITCHEN",
    text: "Commercial cooking equipment, stainless work surfaces, sinks, storage and ventilation can all be configured around your menu.",
    position: "left-[48%] top-[38%]",
  },
  {
    id: "electrical",
    label: "03",
    title: "ELECTRICAL + PLUMBING",
    text: "Power distribution, lighting, water tanks, plumbing and utility systems are integrated into the custom build.",
    position: "left-[68%] top-[57%]",
  },
  {
    id: "custom",
    label: "04",
    title: "BUILT AROUND YOU",
    text: "This trailer is only one example. We can build food, cargo, utility, mobile kitchen and specialty trailers to your requirements.",
    position: "left-[77%] top-[34%]",
  },
];

export default function TrailerExperience() {
  const [active, setActive] = useState<Hotspot | null>(null);
  const [rotation, setRotation] = useState(0);
  const [dragging, setDragging] = useState(false);
  const lastX = useRef(0);
  const autoRotation = useRef(0);

  useEffect(() => {
    if (dragging) return;
    let frame = 0;
    let last = performance.now();
    const tick = (now: number) => {
      const delta = Math.min(now - last, 50);
      last = now;
      autoRotation.current += delta * 0.018;
      setRotation((current) => (current + delta * 0.018) % 360);
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [dragging]);

  function startDrag(clientX: number) {
    setDragging(true);
    lastX.current = clientX;
  }

  function moveDrag(clientX: number) {
    if (!dragging) return;
    const delta = clientX - lastX.current;
    lastX.current = clientX;
    setRotation((current) => (current + delta * 0.45 + 360) % 360);
  }

  function stopDrag() {
    setDragging(false);
  }

  const backSide = rotation > 135 && rotation < 315;

  return (
    <section className="relative w-full overflow-hidden border-t border-[var(--line)] bg-[#111315] text-white" id="custom-build">
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgba(255,255,255,.06)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.06)_1px,transparent_1px)] [background-size:48px_48px]" />

      <div className="relative mx-auto max-w-7xl px-6 py-24 sm:px-10 lg:py-32">
        <div className="mb-12 max-w-2xl">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/50">ONE CUSTOM BUILD</span>
          <h2 className="mt-4 font-display text-4xl font-semibold leading-none tracking-tight sm:text-6xl">
            Explore what we can build.
          </h2>
          <p className="mt-5 max-w-xl text-base leading-relaxed text-white/60 sm:text-lg">
            This is one trailer. The build can be completely different when your business needs something different.
          </p>
        </div>

        <div
          className="relative mx-auto aspect-[16/9] w-full max-w-5xl select-none touch-none"
          onPointerDown={(event) => startDrag(event.clientX)}
          onPointerMove={(event) => moveDrag(event.clientX)}
          onPointerUp={stopDrag}
          onPointerCancel={stopDrag}
          onPointerLeave={stopDrag}
        >
          <div className="absolute left-1/2 top-1/2 h-[72%] w-[82%] -translate-x-1/2 -translate-y-1/2 rounded-full bg-black/60 blur-3xl" />
          <div
            className="absolute inset-0 flex items-center justify-center"
            style={{ perspective: "1200px" }}
          >
            <div
              className={`relative h-full w-full transition-transform duration-75 ${dragging ? "cursor-grabbing" : "cursor-grab"}`}
              style={{ transform: `rotateY(${rotation}deg) scale(${backSide ? 0.97 : 1})` }}
            >
              <img
                src="/photos/hero-trailer.jpg"
                alt="Custom trailer built by All Custom Trailers"
                draggable={false}
                className="absolute left-1/2 top-1/2 max-h-full w-[92%] -translate-x-1/2 -translate-y-1/2 object-contain drop-shadow-[0_30px_45px_rgba(0,0,0,.55)]"
              />
            </div>
          </div>

          <div className="absolute inset-0">
            {hotspots.map((hotspot) => (
              <button
                key={hotspot.id}
                type="button"
                onClick={() => setActive(hotspot)}
                className={`absolute ${hotspot.position} z-20 flex h-9 w-9 items-center justify-center rounded-full border border-white/70 bg-black/70 font-mono text-[10px] font-bold text-white shadow-lg backdrop-blur transition hover:scale-110 hover:bg-[var(--accent)]`}
                aria-label={`Explore ${hotspot.title}`}
              >
                {hotspot.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-2 flex flex-col items-center justify-center text-center">
          <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Drag to explore · click the points</p>
          <p className="mt-5 font-display text-2xl font-semibold sm:text-4xl">
            {backSide ? "NOT JUST FOOD TRAILERS." : "ONE TRAILER. BUILT YOUR WAY."}
          </p>
          <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-white/50 sm:text-base">
            {backSide
              ? "Food. Cargo. Utility. Mobile kitchens. Specialty builds. If you need it on a trailer, talk to us."
              : "Every detail can be designed around the operation, equipment and purpose of your business."}
          </p>
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-2">
          {["FOOD TRAILERS", "CARGO", "UTILITY", "MOBILE KITCHENS", "SPECIALTY BUILDS"].map((item) => (
            <span key={item} className="rounded-full border border-white/10 bg-white/[.04] px-4 py-2 font-mono text-[9px] uppercase tracking-widest text-white/50">
              {item}
            </span>
          ))}
        </div>
      </div>

      {active && (
        <div
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/75 px-5 backdrop-blur-md"
          onClick={() => setActive(null)}
        >
          <div
            className="relative w-full max-w-lg overflow-hidden rounded-2xl border border-white/10 bg-[#191b1d] shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="h-40 bg-cover bg-center opacity-70" style={{ backgroundImage: "url('/photos/hero-trailer.jpg')" }} />
            <div className="p-7 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[var(--accent)]">{active.label}</span>
                <span className="h-px flex-1 bg-white/10" />
                <button type="button" onClick={() => setActive(null)} className="text-white/40 hover:text-white" aria-label="Close">✕</button>
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold">{active.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/55">{active.text}</p>
              <button
                type="button"
                onClick={() => setActive(null)}
                className="mt-7 rounded bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-glow)]"
              >
                Continue exploring
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

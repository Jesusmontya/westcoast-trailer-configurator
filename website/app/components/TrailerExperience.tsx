"use client";

import { useState } from "react";

type Hotspot = {
  id: string;
  number: string;
  title: string;
  text: string;
  position: string;
};

const hotspots: Hotspot[] = [
  {
    id: "window",
    number: "01",
    title: "SERVICE WINDOW",
    text: "The serving window, counter height, awning and exterior layout are designed around how your business serves customers.",
    position: "left-[20%] top-[45%]",
  },
  {
    id: "equipment",
    number: "02",
    title: "CUSTOM EQUIPMENT",
    text: "Cooking equipment, refrigeration, sinks, storage and prep space can be planned around your menu and workflow.",
    position: "left-[48%] top-[39%]",
  },
  {
    id: "utilities",
    number: "03",
    title: "POWER + UTILITIES",
    text: "Electrical, plumbing, water, HVAC and other systems are integrated into the build instead of added as an afterthought.",
    position: "left-[68%] top-[56%]",
  },
  {
    id: "custom",
    number: "04",
    title: "BUILT YOUR WAY",
    text: "This is one example. Your trailer can be a food trailer, cargo trailer, mobile kitchen, utility build or something completely different.",
    position: "left-[78%] top-[33%]",
  },
];

const ideas = [
  { title: "BURGER", text: "High-volume cooking", icon: "01" },
  { title: "TACOS", text: "Efficient mobile kitchen", icon: "02" },
  { title: "COFFEE", text: "Built for beverages", icon: "03" },
  { title: "CATERING", text: "Professional mobile kitchen", icon: "04" },
  { title: "CUSTOM", text: "Something completely different", icon: "05" },
];

export default function TrailerExperience() {
  const [active, setActive] = useState<Hotspot | null>(null);
  const [activeView, setActiveView] = useState("EXTERIOR");

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
            Start with an idea, explore a real build and imagine what your business could look like on a trailer built specifically for you.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-6xl">
          <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#17191c] shadow-2xl">
            <div className="absolute left-5 top-5 z-30 flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-3 py-2 backdrop-blur-md">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)] shadow-[0_0_12px_var(--accent)]" />
              <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-white/65">Interactive 3D preview</span>
            </div>

            <div className="relative aspect-[16/8.5] min-h-[360px] overflow-hidden bg-[#111315]">
              <img
                src="/photos/hero-trailer.jpg"
                alt="Custom trailer build"
                className="absolute inset-0 h-full w-full object-cover object-center opacity-90"
                draggable={false}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#101214] via-transparent to-black/10" />
              <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#101214] to-transparent" />

              {hotspots.map((hotspot) => (
                <button
                  key={hotspot.id}
                  type="button"
                  onClick={() => setActive(hotspot)}
                  className={`absolute ${hotspot.position} z-20 flex h-10 w-10 items-center justify-center rounded-full border border-white/80 bg-black/65 font-mono text-[9px] font-bold text-white shadow-xl backdrop-blur transition hover:scale-110 hover:border-[var(--accent)] hover:bg-[var(--accent)]`}
                  aria-label={`Explore ${hotspot.title}`}
                >
                  {hotspot.number}
                </button>
              ))}

              <div className="absolute bottom-5 left-5 right-5 z-20 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/45">Current build</p>
                  <h3 className="mt-1 font-display text-2xl font-semibold sm:text-3xl">Custom Food Trailer</h3>
                  <p className="mt-1 text-xs text-white/45">Explore the points to see what can be built into your trailer.</p>
                </div>
                <div className="flex rounded-full border border-white/10 bg-black/50 p-1 backdrop-blur-md">
                  {["EXTERIOR", "INTERIOR", "EQUIPMENT", "FLOOR PLAN"].map((view) => (
                    <button
                      key={view}
                      type="button"
                      onClick={() => setActiveView(view)}
                      className={`rounded-full px-3 py-2 font-mono text-[8px] tracking-wider transition sm:px-4 ${activeView === view ? "bg-white text-black" : "text-white/50 hover:text-white"}`}
                    >
                      {view}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <p className="mt-4 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-white/30">
            {activeView} · 3D model coming next · Click a point to explore
          </p>
        </div>

        <div className="mx-auto mt-24 max-w-6xl">
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/35">Start with an idea</span>
              <h3 className="mt-2 font-display text-3xl font-semibold sm:text-4xl">What are you building?</h3>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-white/45">You do not have to know exactly what you need. Choose a starting point and we can shape the build around your business.</p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-5">
            {ideas.map((idea) => (
              <a
                key={idea.title}
                href="#contact"
                className={`group relative min-h-[150px] overflow-hidden rounded-xl border p-5 transition duration-300 ${idea.title === "CUSTOM" ? "border-[var(--accent)]/50 bg-[var(--accent)]/10 hover:bg-[var(--accent)]/20" : "border-white/10 bg-white/[.035] hover:border-white/25 hover:bg-white/[.07]"}`}
              >
                <span className="font-mono text-[9px] text-white/25">{idea.icon}</span>
                <div className="absolute bottom-5 left-5 right-5">
                  <p className="font-display text-lg font-semibold">{idea.title}</p>
                  <p className="mt-1 text-[11px] leading-relaxed text-white/40 group-hover:text-white/60">{idea.text}</p>
                </div>
                <span className="absolute right-4 top-4 text-white/20 transition group-hover:translate-x-1 group-hover:text-white">↗</span>
              </a>
            ))}
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
          <a href="#contact" className="mt-8 inline-flex items-center gap-2 rounded bg-[var(--accent)] px-7 py-3.5 font-semibold text-white transition hover:bg-[var(--accent-glow)]">
            START YOUR BUILD <span>→</span>
          </a>
        </div>
      </div>

      {active && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 px-5 backdrop-blur-md" onClick={() => setActive(null)}>
          <div className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-white/10 bg-[#181a1d] shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="relative h-44 overflow-hidden">
              <img src="/photos/hero-trailer.jpg" alt="Custom trailer detail" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#181a1d] to-transparent" />
            </div>
            <div className="p-7 sm:p-8">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs text-[var(--accent)]">{active.number}</span>
                <span className="h-px flex-1 bg-white/10" />
                <button type="button" onClick={() => setActive(null)} className="text-white/40 hover:text-white" aria-label="Close">✕</button>
              </div>
              <h3 className="mt-5 font-display text-2xl font-semibold">{active.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-white/55">{active.text}</p>
              <a href="#contact" onClick={() => setActive(null)} className="mt-7 inline-flex rounded bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--accent-glow)]">Talk to us about your build →</a>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

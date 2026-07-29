"use client";

import { useState } from "react";
import { useLanguage } from "./context/LanguageContext";

const CONFIGURATOR_URL =
  "https://westcoast-trailer-configurator-tdlm.vercel.app";

function ImagePlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-zinc-100 text-zinc-400 text-xs font-medium ${className}`}
    >
      {label}
    </div>
  );
}

const clientNames = [
  "A La Parrilla",
  "Los Mandilones",
  "Pelons Micheladas",
  "Costa's Tacos",
];

// Trabajos reales — reemplaza "image" por la ruta de tu foto cuando la tengas
// (ej. "/photos/parrilla-1.jpg") y ajusta name/type con el proyecto real
const clientWork = [
  { name: "A La Parrilla", type: "Taco Trailer", image: null },
  { name: "Los Mandilones", type: "Full Kitchen Trailer", image: null },
  { name: "Pelons Micheladas", type: "Beverage Trailer", image: null },
  { name: "Costa's Tacos", type: "Taco Trailer", image: null },
  { name: "Client Project", type: "Custom Build", image: null },
  { name: "Client Project", type: "Custom Build", image: null },
];

function ClientWorkModal({
  work,
  onClose,
}: {
  work: (typeof clientWork)[number];
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-6"
      onClick={onClose}
    >
      <div
        className="bg-white max-w-2xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <ImagePlaceholder
          label={`[ Foto: ${work.name} ]`}
          className="w-full h-80"
        />
        <div className="p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#1c1917]">
              {work.name}
            </h3>
            <p className="text-sm text-zinc-500">{work.type}</p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-[#1c1917] border border-zinc-300 hover:bg-zinc-50 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const { t } = useLanguage();
  const [activeWork, setActiveWork] = useState<
    (typeof clientWork)[number] | null
  >(null);

  return (
    <main className="flex flex-col">
      {/* HERO — imagen de fondo completa, conectado a traducción */}
      <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-zinc-800"
          style={{
            backgroundImage: "url('/photos/hero-trailer.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />

        <div className="absolute inset-0 bg-black/55" />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10">
          <div className="max-w-xl">
            <span className="block text-sm sm:text-base font-bold tracking-[0.2em] text-[#a8503f] mb-4">
              {t.hero.eyebrow}
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[0.98] text-white">
              {t.hero.headline}
            </h1>
            <p className="mt-6 max-w-md text-lg text-zinc-200">
              {t.hero.paragraph}
            </p>
            <a
              href={CONFIGURATOR_URL}
              className="mt-9 inline-block w-fit px-7 py-3.5 bg-[#a8503f] text-white font-semibold hover:bg-[#8f4234] transition-colors"
            >
              {t.hero.cta} →
            </a>
          </div>
        </div>
      </section>

      {/* MARQUEE DE CLIENTES */}
      <section className="w-full py-5 bg-[#a8503f] overflow-hidden">
        <div className="flex gap-14 w-max animate-marquee-left">
          {[...clientNames, ...clientNames, ...clientNames].map((name, i) => (
            <span
              key={i}
              className="text-sm font-bold text-white uppercase tracking-widest whitespace-nowrap"
            >
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="w-full bg-white">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1917] max-w-lg">
            {t.advantages.heading}
          </h2>
          <div className="mt-14 divide-y divide-zinc-200 border-t border-zinc-200">
            {t.advantages.items.map((item, i) => (
              <div
                key={i}
                className="grid grid-cols-1 sm:grid-cols-12 gap-4 py-8 items-baseline"
              >
                <span className="sm:col-span-1 text-sm font-bold text-[#a8503f]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="sm:col-span-4 text-lg font-semibold text-[#1c1917]">
                  {item.title}
                </h3>
                <p className="sm:col-span-7 text-zinc-500 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CLIENT WORK — galería con ventana emergente */}
      <section className="w-full bg-zinc-50 border-t border-zinc-200">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1917] max-w-lg">
            Trailers we&apos;ve built
          </h2>
          <p className="mt-3 text-zinc-500 max-w-md">
            Real clients, real projects. Click any trailer to see more.
          </p>
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-4">
            {clientWork.map((work, i) => (
              <button
                key={i}
                onClick={() => setActiveWork(work)}
                className="group text-left"
              >
                <ImagePlaceholder
                  label={`[ ${work.name} ]`}
                  className="h-48 group-hover:opacity-80 transition-opacity"
                />
                <p className="mt-3 text-sm font-semibold text-[#1c1917]">
                  {work.name}
                </p>
                <p className="text-xs text-zinc-500">{work.type}</p>
              </button>
            ))}
          </div>
        </div>
      </section>

      {activeWork && (
        <ClientWorkModal work={activeWork} onClose={() => setActiveWork(null)} />
      )}

      {/* TRUST */}
      <section className="w-full bg-white">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12">
          <div className="lg:col-span-4 px-6 sm:px-10 py-20 flex flex-col justify-center order-2 lg:order-1">
            <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1917]">
              {t.trust.heading}
            </h2>
            <p className="mt-4 text-zinc-500">{t.trust.paragraph}</p>
          </div>
          <div className="lg:col-span-8 order-1 lg:order-2">
            <ImagePlaceholder
              label="[ Foto: interior con equipo instalado ]"
              className="h-72 lg:h-full"
            />
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="w-full bg-white border-t border-zinc-200">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1917] text-center mb-16">
            {t.process.heading}
          </h2>
          <div className="relative grid grid-cols-1 sm:grid-cols-4 gap-10 sm:gap-6">
            <div className="hidden sm:block absolute top-2 left-0 right-0 h-px bg-zinc-200" />
            {t.process.steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="w-4 h-4 rounded-full bg-[#a8503f] mb-5 relative z-10" />
                <h3 className="text-base font-semibold text-[#1c1917]">
                  {step.title}
                </h3>
                <p className="text-sm text-zinc-500 mt-1 leading-relaxed">
                  {step.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="w-full bg-[#1c1917] text-white">
        <div className="max-w-3xl mx-auto px-6 py-28 text-center">
          <ImagePlaceholder
            label="[ Foto: Annel ]"
            className="w-16 h-16 rounded-full mx-auto mb-8 bg-white/10 text-white/40"
          />
          <blockquote className="text-2xl sm:text-3xl font-medium leading-snug">
            &quot;{t.testimonial.quote}&quot;
          </blockquote>
          <p className="mt-6 text-sm font-semibold text-[#a8503f] uppercase tracking-widest">
            {t.testimonial.author}
          </p>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="w-full bg-white border-t border-zinc-200">
        <div className="max-w-6xl mx-auto px-6 py-20 flex flex-col sm:flex-row items-center justify-between gap-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#1c1917] text-center sm:text-left max-w-md">
            {t.ctaFinal.heading}
          </h2>
          <a
            href="/contact"
            className="px-7 py-3.5 bg-[#a8503f] text-white font-semibold hover:bg-[#8f4234] transition-colors whitespace-nowrap"
          >
            {t.ctaFinal.button}
          </a>
        </div>
      </section>
    </main>
  );
}
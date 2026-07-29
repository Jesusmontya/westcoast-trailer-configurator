"use client";

import { useLanguage } from "../context/LanguageContext";

const CONFIGURATOR_URL =
  "https://westcoast-trailer-configurator-p4jq-smoky.vercel.app";

export default function BuildPage() {
  const { lang } = useLanguage();

  const copy = {
    en: {
      eyebrow: "3D Trailer Builder",
      heading: "Design your trailer in 3D, in minutes.",
      paragraph:
        "Pick a size, add the equipment you need, and see your trailer come together in real time — with a live price as you build.",
      cta: "Launch the 3D Builder",
      stepsHeading: "How it works",
      steps: [
        { title: "Choose a size", text: "3 sizes to fit your business and budget." },
        { title: "Add equipment", text: "Grill, fryer, fridge, A/C, and more." },
        { title: "See it in 3D", text: "Rotate and explore your trailer as you build it." },
        { title: "Get your price", text: "A live running total, no surprises." },
      ],
      trustHeading: "Why use the builder",
      trustItems: [
        {
          title: "No forms, no guesswork",
          text: "See exactly what you're building, not a vague description on a PDF.",
        },
        {
          title: "Real pricing, upfront",
          text: "Your total updates live as you build — know the cost before you talk to anyone.",
        },
        {
          title: "Built around your business",
          text: "Every option reflects real equipment we actually install, not generic add-ons.",
        },
      ],
      altCta: "Prefer to talk it through first?",
      altCtaLink: "Contact us",
    },
    es: {
      eyebrow: "Configurador 3D",
      heading: "Diseña tu trailer en 3D, en minutos.",
      paragraph:
        "Elige un tamaño, agrega el equipo que necesitas, y mira tu trailer tomar forma en tiempo real — con el precio actualizándose mientras armas.",
      cta: "Abrir el configurador 3D",
      stepsHeading: "Cómo funciona",
      steps: [
        { title: "Elige un tamaño", text: "3 tamaños para tu negocio y presupuesto." },
        { title: "Agrega equipo", text: "Grill, freidora, refrigerador, A/C, y más." },
        { title: "Míralo en 3D", text: "Gira y explora tu trailer mientras lo armas." },
        { title: "Obtén tu precio", text: "Un total en vivo, sin sorpresas." },
      ],
      trustHeading: "Por qué usar el configurador",
      trustItems: [
        {
          title: "Sin formularios, sin adivinar",
          text: "Ves exactamente lo que estás construyendo, no una descripción vaga en un PDF.",
        },
        {
          title: "Precio real, desde el inicio",
          text: "Tu total se actualiza en vivo mientras armas — conoce el costo antes de hablar con alguien.",
        },
        {
          title: "Pensado para tu negocio",
          text: "Cada opción refleja equipo real que instalamos, no extras genéricos.",
        },
      ],
      altCta: "¿Prefieres platicarlo primero?",
      altCtaLink: "Contáctanos",
    },
  }[lang];

  return (
    <main className="flex flex-col bg-[#0f0f10] text-white">
      {/* HERO */}
      <section className="flex flex-col items-center justify-center text-center px-6 pt-40 pb-20">
        <span className="text-sm uppercase tracking-widest text-[#f1c40f] mb-4">
          {copy.eyebrow}
        </span>
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight max-w-2xl">
          {copy.heading}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-zinc-400">
          {copy.paragraph}
        </p>
        <a
          href={CONFIGURATOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-10 px-8 py-4 rounded-full bg-[#e63946] text-white font-medium hover:bg-[#d62839] transition-colors text-lg"
        >
          {copy.cta} →
        </a>

        {/* PREVIEW DEL CONFIGURADOR — reemplazar con tu screenshot real */}
        <div className="mt-16 w-full max-w-4xl rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl overflow-hidden shadow-2xl">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 bg-white/5">
            <span className="w-3 h-3 rounded-full bg-red-500/60" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/60" />
            <span className="w-3 h-3 rounded-full bg-green-500/60" />
          </div>
          <div className="aspect-video flex items-center justify-center text-zinc-500 text-sm">
            {/* TODO: reemplazar este div por <img src="/build-preview.png" ... /> */}
            [ Screenshot del configurador va aquí ]
          </div>
        </div>
      </section>

      {/* STEPS */}
      <section className="px-6 py-24 max-w-5xl mx-auto w-full">
        <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-14">
          {copy.stepsHeading}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
          {copy.steps.map((step, i) => (
            <div
              key={i}
              className="p-5 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10 text-left"
            >
              <span className="text-xs text-zinc-500">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="text-sm font-semibold mt-2">{step.title}</h3>
              <p className="text-xs text-zinc-400 mt-1 leading-relaxed">
                {step.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* TRUST / WHY */}
      <section className="px-6 py-24 bg-white/[0.03] w-full">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-14">
            {copy.trustHeading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {copy.trustItems.map((item, i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white/5 backdrop-blur-xl border border-white/10"
              >
                <h3 className="text-base font-semibold mb-2">{item.title}</h3>
                <p className="text-sm text-zinc-400 leading-relaxed">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="px-6 py-24 flex flex-col items-center text-center">
        <a
          href={CONFIGURATOR_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="px-8 py-4 rounded-full bg-[#e63946] text-white font-medium hover:bg-[#d62839] transition-colors text-lg"
        >
          {copy.cta} →
        </a>
        <p className="mt-6 text-sm text-zinc-500">
          {copy.altCta}{" "}
          <a href="/contact" className="text-white underline underline-offset-4">
            {copy.altCtaLink}
          </a>
        </p>
      </section>
    </main>
  );
}
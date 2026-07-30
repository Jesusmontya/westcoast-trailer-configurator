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

const clientWork = [
  { name: "A La Parrilla", type: "Taco Trailer", image: null },
  { name: "Los Mandilones", type: "Full Kitchen Trailer", image: null },
  { name: "Pelons Micheladas", type: "Beverage Trailer", image: null },
  { name: "Costa's Tacos", type: "Taco Trailer", image: null },
  { name: "Client Project", type: "Custom Build", image: null },
];

function LoadingDots() {
  return (
    <span className="inline-flex gap-1 ml-1">
      <span className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1 h-1 rounded-full bg-zinc-400 animate-bounce" />
    </span>
  );
}

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
        <ImagePlaceholder label={`[ Foto: ${work.name} ]`} className="w-full h-80" />
        <div className="p-6 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-[#1c1917]">{work.name}</h3>
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

function ContactForm() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [trailerType, setTrailerType] = useState(t.contact.typeOptions[0]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: conectar a Supabase aquí (insert en tabla leads, origen "contact_form")
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="bg-white p-8 rounded-lg text-center">
        <p className="text-lg font-semibold text-[#1c1917]">
          {t.contact.successMessage}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg flex flex-col gap-5">
      <div>
        <label className="block text-sm font-semibold text-[#1c1917] mb-1.5">
          {t.contact.nameLabel}
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 border border-zinc-300 rounded-md text-sm focus:outline-none focus:border-[#a8503f]"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1c1917] mb-1.5">
          {t.contact.phoneLabel}
        </label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 border border-zinc-300 rounded-md text-sm focus:outline-none focus:border-[#a8503f]"
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-[#1c1917] mb-1.5">
          {t.contact.typeLabel}
        </label>
        <select
          value={trailerType}
          onChange={(e) => setTrailerType(e.target.value)}
          className="w-full px-4 py-3 border border-zinc-300 rounded-md text-sm focus:outline-none focus:border-[#a8503f] bg-white"
        >
          {t.contact.typeOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="mt-2 px-6 py-3.5 bg-[#a8503f] text-white font-semibold rounded-md hover:bg-[#8f4234] transition-colors"
      >
        {t.contact.submitButton}
      </button>
    </form>
  );
}

export default function Home() {
  const { t } = useLanguage();
  const [activeWork, setActiveWork] = useState<
    (typeof clientWork)[number] | null
  >(null);

  return (
    <main className="flex flex-col">
      {/* HERO */}
      <section
        className="relative w-full min-h-[85vh] flex items-center overflow-hidden"
        id="home"
      >
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
            <p className="mt-3 text-sm text-zinc-400 font-medium">
              {t.hero.trustLine}
            </p>
            <a
              href={CONFIGURATOR_URL}
              className="mt-9 inline-block w-fit px-7 py-3.5 bg-[#a8503f] text-white font-semibold hover:bg-[#8f4234] transition-colors"
            >
              {t.hero.cta} →
            </a>
          </div>
        </div>

        {/* CARICATURA — reemplazar por <img> cuando esté lista la imagen */}
        <div className="hidden sm:block absolute bottom-6 right-6 sm:right-10 z-10 w-32 sm:w-40 h-32 sm:h-40 animate-sway">
          <div className="w-full h-full flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-full text-xs text-zinc-300 text-center px-2">
            [ Caricatura aquí ]
          </div>
        </div>

        {/* INDICADOR DE SCROLL */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-zinc-300 uppercase tracking-widest">
            Scroll
          </span>
          <div className="w-px h-8 bg-zinc-300/50" />
        </div>
      </section>

      {/* MARQUEE DE CLIENTES */}
      <section className="w-full py-5 bg-[#a8503f] overflow-hidden">
        <div className="flex gap-14 w-max animate-marquee-left">
          {[
            ...clientNames,
            ...clientNames,
            ...clientNames,
            ...clientNames,
            ...clientNames,
            ...clientNames,
            ...clientNames,
            ...clientNames,
          ].map((name, i) => (
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
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1917] max-w-lg mb-14">
            {t.advantages.heading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-12">
            {t.advantages.items.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#a8503f]/10 flex items-center justify-center text-[#a8503f] font-bold text-sm">
                  {String(i + 1).padStart(2, "0")}
                </div>
                <div>
                  <p className="text-base font-semibold text-[#1c1917] italic">
                    &quot;{item.question}&quot;
                  </p>
                  <p className="mt-2 text-sm font-bold uppercase tracking-wide text-[#a8503f]">
                    {item.title}
                  </p>
                  <p className="mt-1 text-sm text-zinc-500 leading-relaxed">
                    {item.text}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section
        className="w-full bg-zinc-50 border-t border-zinc-200"
        id="gallery"
      >
        <div className="max-w-6xl mx-auto px-6 py-24">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1917] max-w-lg">
            {t.gallery.heading}
          </h2>
          <p className="mt-3 text-zinc-500 max-w-md">{t.gallery.subheading}</p>
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

            <div className="text-left">
              <div className="flex items-center justify-center h-48 border-2 border-dashed border-zinc-300 bg-transparent">
                <span className="text-zinc-400 text-xs font-medium">[ ? ]</span>
              </div>
              <p className="mt-3 text-sm font-semibold text-zinc-400">
                {t.nextProject.title}
              </p>
              <p className="text-xs text-zinc-400 flex items-center">
                {t.nextProject.subtitle}
                <LoadingDots />
              </p>
            </div>
          </div>
        </div>
      </section>

      {activeWork && (
        <ClientWorkModal work={activeWork} onClose={() => setActiveWork(null)} />
      )}

      {/* ABOUT */}
      <section className="w-full bg-white" id="about">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1917]">
                {t.about.heading}
              </h2>
              <p className="mt-6 text-zinc-600 leading-relaxed">
                {t.about.paragraph1}
              </p>
              <p className="mt-4 text-zinc-600 leading-relaxed">
                {t.about.paragraph2}
              </p>
            </div>
            <ImagePlaceholder
              label="[ Foto: taller / equipo de West Coast ]"
              className="h-72 lg:h-full"
            />
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-zinc-200 pt-12">
            {t.about.stats.map((stat, i) => (
              <div key={i}>
                <p className="text-3xl font-bold text-[#a8503f]">{stat.value}</p>
                <p className="mt-1 text-sm text-zinc-500">{stat.label}</p>
              </div>
            ))}
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

      {/* CONTACT */}
      <section className="w-full bg-zinc-50 border-t border-zinc-200" id="contact">
        <div className="max-w-5xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#1c1917]">
              {t.contact.heading}
            </h2>
            <p className="mt-4 text-zinc-500 max-w-sm">{t.contact.subheading}</p>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
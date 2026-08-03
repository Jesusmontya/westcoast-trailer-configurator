"use client";

import { useState } from "react";
import { useLanguage } from "./context/LanguageContext";

const CONFIGURATOR_URL =
  "https://3d.allcustomtrailers.com";

function ImagePlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-[#2b241d] text-[#8f8477] text-xs font-mono ${className}`}
    >
      {label}
    </div>
  );
}

const clientNames = ["A La Parrilla", "Los Mandilones", "Pelons Micheladas", "Costa's Tacos"];

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
      <span className="w-1 h-1 rounded-full bg-[#8f8477] animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1 h-1 rounded-full bg-[#8f8477] animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1 h-1 rounded-full bg-[#8f8477] animate-bounce" />
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm px-6"
      onClick={onClose}
    >
      <div
        className="bg-[#211c17] border border-[#f2ece2]/10 rounded max-w-2xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <ImagePlaceholder label={`[ Foto: ${work.name} ]`} className="w-full h-80" />
        <div className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-[#f2ece2]">{work.name}</h3>
            <p className="font-mono text-xs text-[#8f8477] mt-1">{work.type}</p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-[#f2ece2] border border-[#f2ece2]/15 rounded hover:bg-[#f2ece2]/5 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

function ContactForm() {
  const { t, lang } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [trailerType, setTrailerType] = useState(t.contact.typeOptions[0]);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // TODO: conectar a Supabase (insert en leads, source: "contact_form")
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="stacked-card p-8 text-center">
        <p className="text-lg font-semibold text-[#f2ece2] font-display">
          {t.contact.successMessage}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="stacked-card p-8 flex flex-col gap-5">
      <div>
        <label className="block font-mono text-xs uppercase tracking-wide text-[#8f8477] mb-1.5">
          {t.contact.nameLabel}
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 bg-[#2b241d] border-0 border-b-2 border-[#f2ece2]/12 rounded-t text-sm text-[#f2ece2] focus:outline-none focus:border-[#b8562f] transition-colors"
        />
      </div>

      <div>
        <label className="block font-mono text-xs uppercase tracking-wide text-[#8f8477] mb-1.5">
          {t.contact.phoneLabel}
        </label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 bg-[#2b241d] border-0 border-b-2 border-[#f2ece2]/12 rounded-t text-sm text-[#f2ece2] focus:outline-none focus:border-[#b8562f] transition-colors"
        />
      </div>

      <div>
        <label className="block font-mono text-xs uppercase tracking-wide text-[#8f8477] mb-1.5">
          {t.contact.typeLabel}
        </label>
        <select
          value={trailerType}
          onChange={(e) => setTrailerType(e.target.value)}
          className="w-full px-4 py-3 bg-[#2b241d] border-0 border-b-2 border-[#f2ece2]/12 rounded-t text-sm text-[#f2ece2] focus:outline-none focus:border-[#b8562f]"
        >
          {t.contact.typeOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <button
        type="submit"
        className="mt-2 px-6 py-3.5 bg-[#b8562f] text-white font-semibold rounded hover:bg-[#e8794a] transition-colors"
      >
        {t.contact.submitButton}
      </button>
    </form>
  );
}

export default function Home() {
  const { t } = useLanguage();
  const [activeWork, setActiveWork] = useState<(typeof clientWork)[number] | null>(null);

  return (
    <main className="flex flex-col">
      {/* HERO */}
      <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden" id="home">
        <div
          className="absolute inset-0 bg-[#2b241d]"
          style={{
            backgroundImage: "url('/photos/hero-trailer.jpg')",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <div className="absolute inset-0 bg-[#16130f]/70" />
        <div className="absolute inset-0 blueprint-bg opacity-40" />

        <div className="relative z-10 max-w-7xl mx-auto w-full px-6 sm:px-10">
          <div className="max-w-xl">
            <span className="tag-pill mb-5">{t.hero.eyebrow}</span>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[0.98] text-[#f2ece2]">
              {t.hero.headline}
            </h1>
            <p className="mt-6 max-w-md text-lg text-[#c9c2b6]">{t.hero.paragraph}</p>
            <p className="mt-3 font-mono text-sm text-[#8f8477]">{t.hero.trustLine}</p>
            <a
              href={CONFIGURATOR_URL}
              className="mt-9 inline-block w-fit px-7 py-3.5 bg-[#b8562f] text-white font-semibold rounded hover:bg-[#e8794a] transition-colors"
            >
              {t.hero.cta} →
            </a>
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <section className="w-full py-4 bg-[#b8562f] overflow-hidden border-y border-[#e8794a]/30">
        <div className="flex gap-14 w-max animate-marquee-left">
          {[...clientNames, ...clientNames, ...clientNames, ...clientNames, ...clientNames, ...clientNames, ...clientNames, ...clientNames].map((name, i) => (
            <span key={i} className="font-mono text-xs font-bold text-white uppercase tracking-widest whitespace-nowrap">
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* ADVANTAGES */}
      <section className="w-full blueprint-bg">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <span className="tag-pill mb-4">Why us</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#f2ece2] max-w-lg mb-14">
            {t.advantages.heading}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {t.advantages.items.map((item, i) => (
              <div key={i} className="stacked-card p-6">
                <span className="corner-mark tl" />
                <span className="corner-mark br" />
                <span className="font-mono text-xs text-[#e8794a]">{String(i + 1).padStart(2, "0")}</span>
                <p className="mt-3 text-base font-semibold text-[#f2ece2] italic font-display">
                  "{item.question}"
                </p>
                <p className="mt-3 font-mono text-xs uppercase tracking-wide text-[#e8794a]">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-[#8f8477] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* GALLERY */}
      <section className="w-full bg-[#16130f] border-t border-[#f2ece2]/8" id="gallery">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <span className="tag-pill mb-4">Our work</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#f2ece2] max-w-lg">
            Trailers we've built
          </h2>
          <p className="mt-3 text-[#8f8477] max-w-md">
            Real clients, real projects. Click any trailer to see more.
          </p>
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-5">
            {clientWork.map((work, i) => (
              <button key={i} onClick={() => setActiveWork(work)} className="stacked-card text-left overflow-hidden">
                <span className="corner-mark tl" />
                <span className="corner-mark br" />
                <ImagePlaceholder label={`[ ${work.name} ]`} className="h-40 w-full" />
                <div className="p-4">
                  <p className="text-sm font-semibold text-[#f2ece2]">{work.name}</p>
                  <p className="font-mono text-xs text-[#8f8477] mt-1">{work.type}</p>
                </div>
              </button>
            ))}

            <div className="p-6 border-2 border-dashed border-[#f2ece2]/15 rounded flex flex-col items-center justify-center text-center min-h-[200px]">
              <p className="text-sm font-semibold text-[#8f8477]">{t.nextProject.title}</p>
              <p className="font-mono text-xs text-[#8f8477] mt-2 flex items-center">
                {t.nextProject.subtitle}
                <LoadingDots />
              </p>
            </div>
          </div>
        </div>
      </section>

      {activeWork && <ClientWorkModal work={activeWork} onClose={() => setActiveWork(null)} />}

      {/* ABOUT */}
      <section className="w-full blueprint-bg border-t border-[#f2ece2]/8" id="about">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="tag-pill mb-4">Since day one</span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#f2ece2]">
                {t.about.heading}
              </h2>
              <p className="mt-6 text-[#c9c2b6] leading-relaxed">{t.about.paragraph1}</p>
              <p className="mt-4 text-[#c9c2b6] leading-relaxed">{t.about.paragraph2}</p>
            </div>
            <div className="stacked-card overflow-hidden">
              <span className="corner-mark tl" />
              <span className="corner-mark br" />
              <ImagePlaceholder label="[ Foto: taller / equipo de All Custom Trailers ]" className="h-72 lg:h-full w-full" />
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-[#f2ece2]/10 pt-12">
            {t.about.stats.map((stat, i) => (
              <div key={i}>
                <p className="font-mono text-3xl font-semibold text-[#e8794a]">{stat.value}</p>
                <p className="mt-1 text-sm text-[#8f8477]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS */}
      <section className="w-full bg-[#16130f] border-t border-[#f2ece2]/8">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <span className="tag-pill mb-4 block w-fit mx-auto">Process</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#f2ece2] text-center mb-16">
            {t.process.heading}
          </h2>
          <div className="relative grid grid-cols-1 sm:grid-cols-4 gap-10 sm:gap-6">
            <div className="hidden sm:block absolute top-2 left-0 right-0 h-px bg-[#f2ece2]/10" />
            {t.process.steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="w-3.5 h-3.5 rounded-full bg-[#b8562f] mb-5 relative z-10 ring-4 ring-[#16130f]" />
                <h3 className="font-mono text-xs uppercase tracking-wide text-[#e8794a] mb-1">
                  {String(i + 1).padStart(2, "0")}
                </h3>
                <h3 className="text-base font-semibold text-[#f2ece2] font-display">{step.title}</h3>
                <p className="text-sm text-[#8f8477] mt-1 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL */}
      <section className="w-full bg-[#b8562f] relative overflow-hidden">
        <div className="absolute inset-0 blueprint-bg opacity-10" />
        <div className="relative max-w-3xl mx-auto px-6 py-28 text-center">
          <ImagePlaceholder
            label="[ Foto ]"
            className="w-16 h-16 rounded-full mx-auto mb-8 bg-white/15 text-white/70"
          />
          <blockquote className="font-display italic text-2xl sm:text-3xl font-medium leading-snug text-white">
            "{t.testimonial.quote}"
          </blockquote>
          <p className="mt-6 font-mono text-sm font-semibold text-[#16130f] uppercase tracking-widest">
            {t.testimonial.author}
          </p>
        </div>
      </section>

      {/* CONTACT */}
      <section className="w-full blueprint-bg" id="contact">
        <div className="max-w-5xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="tag-pill mb-4">Get started</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[#f2ece2]">
              {t.contact.heading}
            </h2>
            <p className="mt-4 text-[#8f8477] max-w-sm">{t.contact.subheading}</p>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}
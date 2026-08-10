"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import { submitLead } from "../../lib/leads";

const CONFIGURATOR_URL = "https://3d.allcustomtrailers.com";

function ImagePlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div
      className={`flex items-center justify-center bg-[var(--surface-2)] text-[var(--text-muted)] text-xs font-mono ${className}`}
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
      <span className="w-1 h-1 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:-0.3s]" />
      <span className="w-1 h-1 rounded-full bg-[var(--text-muted)] animate-bounce [animation-delay:-0.15s]" />
      <span className="w-1 h-1 rounded-full bg-[var(--text-muted)] animate-bounce" />
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
      className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2a2118]/70 backdrop-blur-sm px-6"
      onClick={onClose}
    >
      <div
        className="bg-[var(--surface)] border border-[var(--line)] rounded-lg max-w-2xl w-full overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <ImagePlaceholder label={`[ Foto: ${work.name} ]`} className="w-full h-80" />
        <div className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-[var(--text)]">{work.name}</h3>
            <p className="font-mono text-xs text-[var(--text-muted)] mt-1">{work.type}</p>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-semibold text-[var(--text)] border border-[var(--line)] rounded hover:bg-[var(--surface-2)] transition-colors"
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
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [trailerType, setTrailerType] = useState(t.contact.typeOptions[0]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await submitLead({ name, phone, interest: trailerType });
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again or call us directly.");
    } finally {
      setSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <div className="stacked-card ticket-notch p-8 pt-10 text-center">
        <p className="text-lg font-semibold text-[var(--text)] font-display">
          {t.contact.successMessage}
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="stacked-card ticket-notch p-8 pt-10 flex flex-col gap-5">
      <div>
        <label className="block font-mono text-xs uppercase tracking-wide text-[var(--text-muted)] mb-1.5">
          {t.contact.nameLabel}
        </label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-3 bg-[var(--surface-2)] border-0 border-b-2 border-[var(--line)] rounded-t text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>

      <div>
        <label className="block font-mono text-xs uppercase tracking-wide text-[var(--text-muted)] mb-1.5">
          {t.contact.phoneLabel}
        </label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-3 bg-[var(--surface-2)] border-0 border-b-2 border-[var(--line)] rounded-t text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors"
        />
      </div>

      <div>
        <label className="block font-mono text-xs uppercase tracking-wide text-[var(--text-muted)] mb-1.5">
          {t.contact.typeLabel}
        </label>
        <select
          value={trailerType}
          onChange={(e) => setTrailerType(e.target.value)}
          className="w-full px-4 py-3 bg-[var(--surface-2)] border-0 border-b-2 border-[var(--line)] rounded-t text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]"
        >
          {t.contact.typeOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {error && <p className="text-sm text-[var(--accent-2)]">{error}</p>}

      <button
        type="submit"
        disabled={submitting}
        className="mt-2 px-6 py-3.5 bg-[var(--accent-2)] text-white font-semibold rounded hover:bg-[var(--accent)] transition-colors disabled:opacity-60"
      >
        {submitting ? "..." : t.contact.submitButton}
      </button>
    </form>
  );
}

function HomeContent() {
  const { t } = useLanguage();
  const [activeWork, setActiveWork] = useState<(typeof clientWork)[number] | null>(null);
  const searchParams = useSearchParams();

  const configuratorUrl = (() => {
    const utmSource = searchParams.get("utm_source");
    const utmCampaign = searchParams.get("utm_campaign");
    const params = new URLSearchParams();
    if (utmSource) params.set("utm_source", utmSource);
    if (utmCampaign) params.set("utm_campaign", utmCampaign);
    const qs = params.toString();
    return qs ? `${CONFIGURATOR_URL}?${qs}` : CONFIGURATOR_URL;
  })();

  return (
    <main className="flex flex-col">
      {/* HERO — dos columnas: texto + foto inclinada tipo corcho */}
      <section className="relative w-full blueprint-bg overflow-hidden" id="home">
        <div className="max-w-6xl mx-auto w-full px-6 sm:px-10 py-20 lg:py-28 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <span className="tag-pill mb-5">{t.hero.eyebrow}</span>
            <h1 className="font-display text-5xl sm:text-6xl font-semibold tracking-tight leading-[0.98] text-[var(--text)]">
              {t.hero.headline}
            </h1>
            <p className="mt-6 max-w-md text-lg text-[var(--text-muted)]">{t.hero.paragraph}</p>
            <p className="mt-3 font-mono text-sm text-[var(--accent-2)]">{t.hero.trustLine}</p>
            <a
              href={configuratorUrl}
              className="mt-9 inline-block w-fit px-7 py-3.5 bg-[var(--accent-2)] text-white font-semibold rounded hover:bg-[var(--accent)] transition-colors"
            >
              {t.hero.cta} →
            </a>
          </div>

          <div className="relative">
            <div className="relative rotate-2 hover:rotate-0 transition-transform duration-300">
              <ImagePlaceholder
                label="[ Foto: trailer terminado ]"
                className="w-full h-80 sm:h-96 rounded-lg border border-[var(--line)] shadow-2xl"
              />
              <span className="corner-ticket absolute -bottom-5 -left-5">
                {t.hero.trustLine}
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* GALLERY — promovida justo después del hero */}
      <section className="w-full bg-[var(--surface)] border-t border-[var(--line)]" id="gallery">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <span className="tag-pill mb-4">Our work</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text)] max-w-lg">
            Trailers we've built
          </h2>
          <p className="mt-3 text-[var(--text-muted)] max-w-md">
            Real clients, real projects. Click any trailer to see more.
          </p>
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-6">
            {clientWork.map((work, i) => (
              <button
                key={i}
                onClick={() => setActiveWork(work)}
                className="stacked-card text-left overflow-hidden"
              >
                <span className="corner-mark tl" />
                <span className="corner-mark br" />
                <ImagePlaceholder label={`[ ${work.name} ]`} className="h-40 w-full" />
                <div className="p-4">
                  <p className="text-sm font-semibold text-[var(--text)]">{work.name}</p>
                  <p className="font-mono text-xs text-[var(--text-muted)] mt-1">{work.type}</p>
                </div>
              </button>
            ))}

            <div className="p-6 border-2 border-dashed border-[var(--line)] rounded-lg flex flex-col items-center justify-center text-center min-h-[200px]">
              <p className="text-sm font-semibold text-[var(--text-muted)]">{t.nextProject.title}</p>
              <p className="font-mono text-xs text-[var(--text-muted)] mt-2 flex items-center">
                {t.nextProject.subtitle}
                <LoadingDots />
              </p>
            </div>
          </div>
        </div>
      </section>

      {activeWork && <ClientWorkModal work={activeWork} onClose={() => setActiveWork(null)} />}

      {/* ADVANTAGES — tarjetas tipo comanda con jerarquía, no una grilla pareja */}
      <section className="w-full blueprint-bg border-t border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <span className="tag-pill mb-4">Why us</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text)] max-w-lg mb-14">
            {t.advantages.heading}
          </h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            {t.advantages.items.map((item, i) => (
              <div
                key={i}
                className={`stacked-card ticket-notch p-6 pt-9 ${
                  i === 0 ? "lg:col-span-2 lg:row-span-2 flex flex-col justify-center" : ""
                }`}
              >
                <span className="font-mono text-xs text-[var(--accent-2)]">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p
                  className={`mt-3 font-semibold text-[var(--text)] italic font-display ${
                    i === 0 ? "text-2xl" : "text-base"
                  }`}
                >
                  "{item.question}"
                </p>
                <p className="mt-3 font-mono text-xs uppercase tracking-wide text-[var(--accent-2)]">
                  {item.title}
                </p>
                <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE — tira de recibo, ya no franja de color gritando */}
      <section className="w-full py-4 receipt-strip overflow-hidden">
        <div className="flex gap-14 w-max animate-marquee-left">
          {[...clientNames, ...clientNames, ...clientNames, ...clientNames, ...clientNames, ...clientNames, ...clientNames, ...clientNames].map((name, i) => (
            <span
              key={i}
              className="font-mono text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest whitespace-nowrap"
            >
              {name}
            </span>
          ))}
        </div>
      </section>

      {/* ABOUT */}
      <section className="w-full bg-[var(--surface)] border-t border-[var(--line)]" id="about">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="tag-pill mb-4">Since day one</span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text)]">
                {t.about.heading}
              </h2>
              <p className="mt-6 text-[var(--text-muted)] leading-relaxed">{t.about.paragraph1}</p>
              <p className="mt-4 text-[var(--text-muted)] leading-relaxed">{t.about.paragraph2}</p>
            </div>
            <div className="stacked-card overflow-hidden -rotate-1">
              <span className="corner-mark tl" />
              <span className="corner-mark br" />
              <ImagePlaceholder label="[ Foto: taller / equipo de All Custom Trailers ]" className="h-72 lg:h-full w-full" />
            </div>
          </div>

          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-dashed border-[var(--line)] pt-12">
            {t.about.stats.map((stat, i) => (
              <div key={i}>
                <p className="font-mono text-3xl font-semibold text-[var(--accent-2)]">{stat.value}</p>
                <p className="mt-1 text-sm text-[var(--text-muted)]">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PROCESS — secuencia real, se queda numerada, línea perforada */}
      <section className="w-full blueprint-bg border-t border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <span className="tag-pill mb-4 block w-fit mx-auto">Process</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text)] text-center mb-16">
            {t.process.heading}
          </h2>
          <div className="relative grid grid-cols-1 sm:grid-cols-4 gap-10 sm:gap-6">
            <div className="hidden sm:block absolute top-2 left-0 right-0 perforated-line" />
            {t.process.steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="w-3.5 h-3.5 rounded-full bg-[var(--accent-2)] mb-5 relative z-10 ring-4 ring-[var(--bg)]" />
                <h3 className="font-mono text-xs uppercase tracking-wide text-[var(--accent-2)] mb-1">
                  {String(i + 1).padStart(2, "0")}
                </h3>
                <h3 className="text-base font-semibold text-[var(--text)] font-display">{step.title}</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIAL — nota pegada a un corcho, no franja gigante */}
      <section className="w-full bg-[var(--surface)] border-t border-[var(--line)]">
        <div className="max-w-lg mx-auto px-6 py-24 text-center">
          <div className="stacked-card p-10 -rotate-1 relative">
            <span className="pin-dot absolute -top-2 left-1/2 -translate-x-1/2" />
            <ImagePlaceholder
              label="[ Foto ]"
              className="w-14 h-14 rounded-full mx-auto mb-6"
            />
            <blockquote className="font-display italic text-xl font-medium leading-snug text-[var(--text)]">
              "{t.testimonial.quote}"
            </blockquote>
            <p className="mt-5 font-mono text-xs font-semibold text-[var(--accent-2)] uppercase tracking-widest">
              {t.testimonial.author}
            </p>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section className="w-full blueprint-bg border-t border-[var(--line)]" id="contact">
        <div className="max-w-5xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="tag-pill mb-4">Get started</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text)]">
              {t.contact.heading}
            </h2>
            <p className="mt-4 text-[var(--text-muted)] max-w-sm">{t.contact.subheading}</p>
          </div>
          <ContactForm />
        </div>
      </section>
    </main>
  );
}

export default function Home() {
  return (
    <Suspense fallback={null}>
      <HomeContent />
    </Suspense>
  );
}
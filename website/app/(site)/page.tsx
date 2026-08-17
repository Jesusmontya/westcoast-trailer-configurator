"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import TrailerExperience from "../components/TrailerExperience";
import { submitLead } from "../../lib/leads";

const CONFIGURATOR_URL = "https://3d.allcustomtrailers.com";

function ImagePlaceholder({ label, className }: { label: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-[var(--surface-2)] text-[var(--text-muted)] text-xs font-mono ${className}`}>
      {label}
    </div>
  );
}

const clientNames = ["A La Parrilla", "Los Mandilones", "Pelons Micheladas", "Costa's Tacos"];

const clientWork = [
  { name: "A La Parrilla", type: "Taco Trailer" },
  { name: "Los Mandilones", type: "Full Kitchen Trailer" },
  { name: "Pelons Micheladas", type: "Beverage Trailer" },
  { name: "Costa's Tacos", type: "Taco Trailer" },
  { name: "Client Project", type: "Custom Build" },
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

function ClientWorkModal({ work, onClose }: { work: (typeof clientWork)[number]; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#2a2118]/70 backdrop-blur-sm px-6" onClick={onClose}>
      <div className="bg-[var(--surface)] border border-[var(--line)] rounded-lg max-w-2xl w-full overflow-hidden" onClick={(e) => e.stopPropagation()}>
        <ImagePlaceholder label={`[ Foto: ${work.name} ]`} className="w-full h-80" />
        <div className="p-6 flex items-center justify-between">
          <div>
            <h3 className="font-display text-lg font-semibold text-[var(--text)]">{work.name}</h3>
            <p className="font-mono text-xs text-[var(--text-muted)] mt-1">{work.type}</p>
          </div>
          <button onClick={onClose} className="px-4 py-2 text-sm font-semibold text-[var(--text)] border border-[var(--line)] rounded hover:bg-[var(--surface-2)] transition-colors">
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
        <p className="text-lg font-semibold text-[var(--text)] font-display">{t.contact.successMessage}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="stacked-card ticket-notch p-8 pt-10 flex flex-col gap-5">
      <div>
        <label className="block font-mono text-xs uppercase tracking-wide text-[var(--text-muted)] mb-1.5">{t.contact.nameLabel}</label>
        <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-[var(--surface-2)] border-0 border-b-2 border-[var(--line)] rounded-t text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors" />
      </div>
      <div>
        <label className="block font-mono text-xs uppercase tracking-wide text-[var(--text-muted)] mb-1.5">{t.contact.phoneLabel}</label>
        <input type="tel" required value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 bg-[var(--surface-2)] border-0 border-b-2 border-[var(--line)] rounded-t text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)] transition-colors" />
      </div>
      <div>
        <label className="block font-mono text-xs uppercase tracking-wide text-[var(--text-muted)] mb-1.5">{t.contact.typeLabel}</label>
        <select value={trailerType} onChange={(e) => setTrailerType(e.target.value)} className="w-full px-4 py-3 bg-[var(--surface-2)] border-0 border-b-2 border-[var(--line)] rounded-t text-sm text-[var(--text)] focus:outline-none focus:border-[var(--accent)]">
          {t.contact.typeOptions.map((option) => <option key={option} value={option}>{option}</option>)}
        </select>
      </div>
      {error && <p className="text-sm text-[var(--accent-2)]">{error}</p>}
      <button type="submit" disabled={submitting} className="mt-2 px-6 py-3.5 bg-[var(--accent-2)] text-white font-semibold rounded hover:bg-[var(--accent)] transition-colors disabled:opacity-60">
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
    <main className="flex flex-col pb-16 md:pb-0">
      {/* 1. HERO — immediate value + primary conversion */}
      <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden" id="home">
        <div className="absolute inset-0 bg-[#14171a]" />
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/videos/hero-background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/30" />
        <div className="relative z-10 max-w-6xl mx-auto w-full px-6 sm:px-10">
          <div className="max-w-xl">
            <span className="inline-block font-mono text-[10px] uppercase tracking-wide text-white/70 border border-white/25 rounded px-3 py-1 mb-5">{t.hero.eyebrow}</span>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[0.98] text-white">{t.hero.headline}</h1>
            <p className="mt-6 max-w-md text-lg text-white/80">{t.hero.paragraph}</p>
            <p className="mt-3 font-mono text-sm text-white/60">{t.hero.trustLine}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#contact" className="inline-block px-7 py-3.5 bg-[var(--accent)] text-white font-semibold rounded hover:bg-[var(--accent-glow)] transition-colors">GET A QUOTE →</a>
              <a href="#gallery" className="inline-block px-7 py-3.5 border border-white/30 text-white font-semibold rounded hover:bg-white/10 transition-colors">EXPLORE OUR BUILDS</a>
            </div>
          </div>
        </div>
      </section>

      {/* 2. OUR WORK — proof */}
      <section className="w-full bg-[var(--surface)] border-t border-[var(--line)]" id="gallery">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <span className="tag-pill mb-4">Our work</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text)] max-w-lg">REAL BUILDS. REAL BUSINESSES.</h2>
          <p className="mt-3 text-[var(--text-muted)] max-w-md">From food trailers to specialty builds, every project starts with what the business actually needs.</p>
          <div className="mt-12 grid grid-cols-2 lg:grid-cols-3 gap-6">
            {clientWork.map((work, i) => (
              <button key={i} onClick={() => setActiveWork(work)} className="stacked-card text-left overflow-hidden">
                <span className="corner-mark tl" /><span className="corner-mark br" />
                <ImagePlaceholder label={`[ ${work.name} ]`} className="h-40 w-full" />
                <div className="p-4"><p className="text-sm font-semibold text-[var(--text)]">{work.name}</p><p className="font-mono text-xs text-[var(--text-muted)] mt-1">{work.type}</p></div>
              </button>
            ))}
            <div className="p-6 border-2 border-dashed border-[var(--line)] rounded-lg flex flex-col items-center justify-center text-center min-h-[200px]">
              <p className="text-sm font-semibold text-[var(--text-muted)]">{t.nextProject.title}</p>
              <p className="font-mono text-xs text-[var(--text-muted)] mt-2 flex items-center">{t.nextProject.subtitle}<LoadingDots /></p>
            </div>
          </div>
        </div>
      </section>
      {activeWork && <ClientWorkModal work={activeWork} onClose={() => setActiveWork(null)} />}

      {/* 3. SPECIAL TRAILER EXPERIENCE */}
      <TrailerExperience />

      {/* 4. EARLY CTA — capture high-intent visitors before more scrolling */}
      <section className="w-full bg-[var(--text)] text-white border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Your next build</span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold">HAVE AN IDEA? LET'S BUILD IT.</h2>
            <p className="mt-3 text-white/55 max-w-xl">Tell us what you have in mind. We'll help you figure out the right trailer for your business.</p>
          </div>
          <a href="#contact" className="shrink-0 rounded bg-[var(--accent)] px-7 py-3.5 font-semibold text-white hover:bg-[var(--accent-glow)] transition-colors">GET MY QUOTE →</a>
        </div>
      </section>

      {/* 5. WHY US */}
      <section className="w-full blueprint-bg border-t border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <span className="tag-pill mb-4">Why us</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text)] max-w-lg mb-14">{t.advantages.heading}</h2>
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-5">
            {t.advantages.items.map((item, i) => (
              <div key={i} className={`stacked-card ticket-notch p-6 pt-9 ${i === 0 ? "lg:col-span-2 lg:row-span-2 flex flex-col justify-center" : ""}`}>
                <span className="font-mono text-xs text-[var(--accent-2)]">{String(i + 1).padStart(2, "0")}</span>
                <p className={`mt-3 font-semibold text-[var(--text)] italic font-display ${i === 0 ? "text-2xl" : "text-base"}`}>&quot;{item.question}&quot;</p>
                <p className="mt-3 font-mono text-xs uppercase tracking-wide text-[var(--accent-2)]">{item.title}</p>
                <p className="mt-1 text-sm text-[var(--text-muted)] leading-relaxed">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. MARQUEE */}
      <section className="w-full py-4 receipt-strip overflow-hidden">
        <div className="flex gap-14 w-max animate-marquee-left">
          {[...clientNames, ...clientNames, ...clientNames, ...clientNames, ...clientNames, ...clientNames].map((name, i) => (
            <span key={i} className="font-mono text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest whitespace-nowrap">{name}</span>
          ))}
        </div>
      </section>

      {/* 7. PROCESS — make the next step feel easy */}
      <section className="w-full blueprint-bg border-t border-[var(--line)]">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <span className="tag-pill mb-4 block w-fit mx-auto">Process</span>
          <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text)] text-center mb-6">HOW IT WORKS</h2>
          <p className="mx-auto max-w-xl text-center text-[var(--text-muted)] mb-16">Don&apos;t know exactly what you need? That&apos;s okay. We help you figure it out.</p>
          <div className="relative grid grid-cols-1 sm:grid-cols-4 gap-10 sm:gap-6">
            <div className="hidden sm:block absolute top-2 left-0 right-0 perforated-line" />
            {t.process.steps.map((step, i) => (
              <div key={i} className="relative">
                <div className="w-3.5 h-3.5 rounded-full bg-[var(--accent-2)] mb-5 relative z-10 ring-4 ring-[var(--bg)]" />
                <h3 className="font-mono text-xs uppercase tracking-wide text-[var(--accent-2)] mb-1">{String(i + 1).padStart(2, "0")}</h3>
                <h3 className="text-base font-semibold text-[var(--text)] font-display">{step.title}</h3>
                <p className="text-sm text-[var(--text-muted)] mt-1 leading-relaxed">{step.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 8. MAIN CONVERSION FORM */}
      <section className="w-full blueprint-bg border-t border-[var(--line)]" id="contact">
        <div className="max-w-5xl mx-auto px-6 py-24 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <span className="tag-pill mb-4">Start your build</span>
            <h2 className="font-display text-4xl sm:text-5xl font-semibold text-[var(--text)]">LET&apos;S BUILD YOUR TRAILER.</h2>
            <p className="mt-5 text-[var(--text-muted)] max-w-md">{t.contact.subheading}</p>
            <p className="mt-5 font-mono text-xs uppercase tracking-widest text-[var(--accent-2)]">No commitment. We&apos;ll help you figure out the right build.</p>
          </div>
          <ContactForm />
        </div>
      </section>

      {/* 9. ABOUT */}
      <section className="w-full bg-[var(--surface)] border-t border-[var(--line)]" id="about">
        <div className="max-w-6xl mx-auto px-6 py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div>
              <span className="tag-pill mb-4">Since day one</span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text)]">{t.about.heading}</h2>
              <p className="mt-6 text-[var(--text-muted)] leading-relaxed">{t.about.paragraph1}</p>
              <p className="mt-4 text-[var(--text-muted)] leading-relaxed">{t.about.paragraph2}</p>
            </div>
            <div className="stacked-card overflow-hidden -rotate-1">
              <span className="corner-mark tl" /><span className="corner-mark br" />
              <ImagePlaceholder label="[ Foto: taller / equipo de All Custom Trailers ]" className="h-72 lg:h-full w-full" />
            </div>
          </div>
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-8 border-t border-dashed border-[var(--line)] pt-12">
            {t.about.stats.map((stat, i) => <div key={i}><p className="font-mono text-3xl font-semibold text-[var(--accent-2)]">{stat.value}</p><p className="mt-1 text-sm text-[var(--text-muted)]">{stat.label}</p></div>)}
          </div>
        </div>
      </section>

      {/* 10. TESTIMONIAL */}
      <section className="w-full bg-[var(--surface)] border-t border-[var(--line)]">
        <div className="max-w-lg mx-auto px-6 py-24 text-center">
          <div className="stacked-card p-10 -rotate-1 relative">
            <span className="pin-dot absolute -top-2 left-1/2 -translate-x-1/2" />
            <ImagePlaceholder label="[ Foto ]" className="w-14 h-14 rounded-full mx-auto mb-6" />
            <blockquote className="font-display italic text-xl font-medium leading-snug text-[var(--text)]">&quot;{t.testimonial.quote}&quot;</blockquote>
            <p className="mt-5 font-mono text-xs font-semibold text-[var(--accent-2)] uppercase tracking-widest">{t.testimonial.author}</p>
          </div>
        </div>
      </section>

      {/* 11. FINAL CTA */}
      <section className="w-full bg-[var(--text)] text-white border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-24 text-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">All Custom Trailers</span>
          <h2 className="mt-4 font-display text-4xl sm:text-6xl font-semibold">YOUR IDEA. OUR BUILD.</h2>
          <p className="mx-auto mt-5 max-w-xl text-white/55">Ready to build something custom?</p>
          <a href="#contact" className="mt-8 inline-block rounded bg-[var(--accent)] px-8 py-4 font-semibold text-white hover:bg-[var(--accent-glow)] transition-colors">GET STARTED →</a>
        </div>
      </section>

      {/* Persistent mobile conversion action */}
      <a href="#contact" className="fixed bottom-0 left-0 right-0 z-40 md:hidden flex items-center justify-center gap-2 bg-[var(--accent)] py-4 text-sm font-semibold text-white shadow-2xl">READY TO BUILD? GET A QUOTE →</a>
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

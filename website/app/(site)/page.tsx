"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useLanguage } from "../context/LanguageContext";
import TrailerExperience from "../components/TrailerExperience";
import { submitLead } from "../../lib/leads";

const CONFIGURATOR_URL = "https://3d.allcustomtrailers.com";

const clientWork = [
  { name: "Captain Calabash", type: "Custom Food Trailer", image: "/photos/captain calabash.jpg" },
  { name: "Left Coast Pizza", type: "Pizza Trailer", image: "/photos/left coast pizza.jpg" },
  { name: "Pancho's Tacos", type: "Taco Trailer", image: "/photos/panchos tacos.jpg" },
  { name: "Rico's Mexican Food", type: "Food Trailer", image: "/photos/ricos mexican food.jpg" },
  { name: "Tortilleria Rey Tacamba", type: "Custom Food Trailer", image: "/photos/tortilleria rey tacamba.jpg" },
];

const clientNames = clientWork.map((work) => work.name);

function ImageFrame({ src, alt, className = "" }: { src: string; alt: string; className?: string }) {
  return (
    <div className={`relative overflow-hidden bg-[var(--surface-2)] ${className}`}>
      <img src={src} alt={alt} className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" loading="lazy" />
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
      {/* 1. HERO — keep the real build video as the emotional first impression */}
      <section className="relative w-full min-h-[85vh] flex items-center overflow-hidden" id="home">
        <div className="absolute inset-0 bg-[#14171a]" />
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover">
          <source src="/videos/hero-background.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-black/25" />
        <div className="relative z-10 max-w-6xl mx-auto w-full px-6 sm:px-10">
          <div className="max-w-2xl">
            <span className="inline-block font-mono text-[10px] uppercase tracking-wide text-white/70 border border-white/25 rounded px-3 py-1 mb-5">{t.hero.eyebrow}</span>
            <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-semibold tracking-tight leading-[0.96] text-white">{t.hero.headline}</h1>
            <p className="mt-6 max-w-xl text-lg text-white/80">{t.hero.paragraph}</p>
            <p className="mt-3 font-mono text-sm text-white/60">{t.hero.trustLine}</p>
            <div className="mt-9 flex flex-wrap gap-3">
              <a href="#contact" className="inline-block px-7 py-3.5 bg-[var(--accent)] text-white font-semibold rounded hover:bg-[var(--accent-glow)] transition-colors">GET A QUOTE →</a>
              <a href="#gallery" className="inline-block px-7 py-3.5 border border-white/30 text-white font-semibold rounded hover:bg-white/10 transition-colors">EXPLORE OUR BUILDS</a>
            </div>
          </div>
        </div>
        <div className="absolute bottom-6 right-6 z-10 hidden sm:flex items-center gap-3 font-mono text-[9px] uppercase tracking-[0.2em] text-white/40">
          <span className="h-px w-10 bg-white/25" /> Built in-house
        </div>
      </section>

      {/* 2. OUR WORK — proof, not a generic card gallery */}
      <section className="w-full bg-[var(--surface)] border-t border-[var(--line)]" id="gallery">
        <div className="max-w-7xl mx-auto px-6 py-24 sm:px-10">
          <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <span className="tag-pill mb-4">Our work</span>
              <h2 className="font-display text-4xl sm:text-5xl font-semibold text-[var(--text)]">BUILT FOR DIFFERENT BUSINESSES.</h2>
            </div>
            <p className="max-w-md text-sm leading-relaxed text-[var(--text-muted)]">Real trailers. Real businesses. Different needs. Every build starts with the operation—not a fixed template.</p>
          </div>

          <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-12">
            <a href="#custom-build" className="group relative min-h-[430px] overflow-hidden rounded-xl bg-[var(--text)] lg:col-span-7">
              <ImageFrame src={clientWork[0].image} alt={clientWork[0].name} className="absolute inset-0 h-full w-full opacity-90" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/15 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7 sm:p-9">
                <p className="font-mono text-[9px] uppercase tracking-[0.25em] text-white/55">Featured build</p>
                <h3 className="mt-2 font-display text-3xl font-semibold text-white sm:text-4xl">{clientWork[0].name}</h3>
                <p className="mt-1 text-sm text-white/60">{clientWork[0].type}</p>
                <span className="mt-5 inline-flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.18em] text-white/75">Explore the custom experience <span>→</span></span>
              </div>
            </a>

            <div className="grid grid-cols-2 gap-5 lg:col-span-5">
              {clientWork.slice(1).map((work) => (
                <a key={work.name} href="#custom-build" className="group relative min-h-[205px] overflow-hidden rounded-xl bg-[var(--text)]">
                  <ImageFrame src={work.image} alt={work.name} className="absolute inset-0 h-full w-full opacity-85" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="font-display text-lg font-semibold text-white leading-tight">{work.name}</p>
                    <p className="mt-1 font-mono text-[8px] uppercase tracking-wider text-white/50">{work.type}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. THE MAIN EXPERIENCE */}
      <TrailerExperience />

      {/* 4. EARLY CTA */}
      <section className="w-full bg-[var(--text)] text-white border-t border-white/10">
        <div className="max-w-5xl mx-auto px-6 py-16 sm:py-20 flex flex-col sm:flex-row items-center justify-between gap-8">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-white/40">Your next build</span>
            <h2 className="mt-2 font-display text-3xl sm:text-4xl font-semibold">HAVE AN IDEA? LET&apos;S BUILD IT.</h2>
            <p className="mt-3 text-white/55 max-w-xl">Tell us what you have in mind. We&apos;ll help you figure out the right build for your business.</p>
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

      {/* 6. CLIENT NAMES / SOCIAL PROOF STRIP */}
      <section className="w-full py-4 receipt-strip overflow-hidden">
        <div className="flex gap-14 w-max animate-marquee-left">
          {[...clientNames, ...clientNames, ...clientNames, ...clientNames].map((name, i) => (
            <span key={i} className="font-mono text-xs font-bold text-[var(--text-muted)] uppercase tracking-widest whitespace-nowrap">{name}</span>
          ))}
        </div>
      </section>

      {/* 7. PROCESS */}
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
              <img src="/photos/hero-trailer.jpg" alt="All Custom Trailers build" className="h-72 lg:h-full w-full object-cover" />
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
            <div className="w-14 h-14 rounded-full mx-auto mb-6 bg-[var(--surface-2)] flex items-center justify-center font-mono text-xs text-[var(--text-muted)]">ACT</div>
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
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <a href="#contact" className="inline-block rounded bg-[var(--accent)] px-8 py-4 font-semibold text-white hover:bg-[var(--accent-glow)] transition-colors">GET STARTED →</a>
            <a href={configuratorUrl} target="_blank" rel="noreferrer" className="inline-block rounded border border-white/20 px-8 py-4 font-semibold text-white hover:bg-white/10 transition-colors">OPEN 3D CONFIGURATOR ↗</a>
          </div>
        </div>
      </section>

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

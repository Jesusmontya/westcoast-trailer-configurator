"use client";

import { useLanguage } from "./context/LanguageContext";

export default function Home() {
  const { t } = useLanguage();

  return (
    <main className="flex flex-col">
      <section className="flex flex-col items-center justify-center text-center px-6 py-40 bg-[#0f0f10] text-white min-h-screen">
        <h1 className="text-4xl sm:text-6xl font-bold tracking-tight max-w-3xl">
          {t.hero.headline}
        </h1>
        <p className="mt-6 max-w-xl text-lg text-zinc-400">
          {t.hero.paragraph}
        </p>
        <a
          href="https://build.westcoasttrailers.us"
          className="mt-10 px-7 py-3.5 rounded-full bg-[#e63946] text-white font-medium hover:bg-[#d62839] transition-colors"
        >
          {t.hero.cta} →
        </a>
      </section>

      <section className="px-6 py-24 text-center bg-[#f5f5f0]">
        <h2 className="text-2xl sm:text-3xl font-semibold text-zinc-900">
          {t.trust.heading}
        </h2>
        <p className="mt-4 max-w-xl mx-auto text-zinc-600">
          {t.trust.paragraph}
        </p>
      </section>

      <section className="px-6 py-24 bg-white text-center">
        <blockquote className="max-w-2xl mx-auto text-xl italic text-zinc-800">
          &quot;{t.testimonial.quote}&quot;
        </blockquote>
        <p className="mt-4 font-medium text-zinc-600">
          {t.testimonial.author}
        </p>
      </section>

      <section className="px-6 py-24 text-center bg-[#0f0f10] text-white">
        <h2 className="text-2xl sm:text-3xl font-semibold">
          {t.ctaFinal.heading}
        </h2>
        <a
          href="/contact"
          className="mt-6 inline-block px-6 py-3 rounded-full bg-white text-black font-medium hover:bg-zinc-200 transition-colors"
        >
          {t.ctaFinal.button}
        </a>
      </section>
    </main>
  );
}
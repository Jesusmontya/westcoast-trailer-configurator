"use client";

import { useLanguage } from "../context/LanguageContext";

const CONFIGURATOR_URL =
  "https://westcoast-trailer-configurator-tdlm.vercel.app";

export default function Navbar() {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <header className="sticky top-0 z-50 w-full bg-[#1c1917]">
      <nav className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
        <a href="#home" className="font-semibold text-lg tracking-tight text-white">
          West Coast
        </a>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <a href="#home" className="hover:text-white transition-colors">
            {t.nav.home}
          </a>
          <a href="#gallery" className="hover:text-white transition-colors">
            {t.nav.gallery}
          </a>
          <a href="#about" className="hover:text-white transition-colors">
            {t.nav.about}
          </a>
          <a href="#contact" className="hover:text-white transition-colors">
            {t.nav.contact}
          </a>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="flex items-center border border-white/15 rounded-md text-xs font-medium overflow-hidden"
          >
            <span
              className={`px-2.5 py-1.5 transition-colors ${
                lang === "es" ? "bg-white/10 text-white" : "text-zinc-500"
              }`}
            >
              ES
            </span>
            <span
              className={`px-2.5 py-1.5 transition-colors ${
                lang === "en" ? "bg-white/10 text-white" : "text-zinc-500"
              }`}
            >
              EN
            </span>
          </button>

          <a
            href={CONFIGURATOR_URL}
            className="px-5 py-2.5 rounded-md bg-[#a8503f] text-white text-sm font-semibold hover:bg-[#8f4234] transition-colors whitespace-nowrap"
          >
            {t.nav.cta} →
          </a>
        </div>
      </nav>
    </header>
  );
}
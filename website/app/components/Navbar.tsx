"use client";

import Link from "next/link";
import { useLanguage } from "../context/LanguageContext";

export default function Navbar() {
  const { lang, toggleLang, t } = useLanguage();

  return (
    <header className="fixed top-4 left-4 right-4 z-50 flex justify-center">
      <nav className="w-full max-w-5xl flex items-center justify-between px-6 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-white/15 shadow-lg">
        <Link href="/" className="text-white font-semibold tracking-tight">
          West Coast
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-zinc-300">
          <Link href="/" className="hover:text-white transition-colors">
            {t.nav.home}
          </Link>
          <Link href="/about" className="hover:text-white transition-colors">
            {t.nav.about}
          </Link>
          <Link href="/gallery" className="hover:text-white transition-colors">
            {t.nav.gallery}
          </Link>
          <Link href="/contact" className="hover:text-white transition-colors">
            {t.nav.contact}
          </Link>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLang}
            className="flex items-center rounded-full bg-white/10 border border-white/15 text-xs font-medium overflow-hidden"
          >
            <span
              className={`px-2.5 py-1.5 transition-colors ${
                lang === "es" ? "bg-white text-black" : "text-zinc-300"
              }`}
            >
              ES
            </span>
            <span
              className={`px-2.5 py-1.5 transition-colors ${
                lang === "en" ? "bg-white text-black" : "text-zinc-300"
              }`}
            >
              EN
            </span>
          </button>

          
          <a
            href="https://build.westcoasttrailers.us"
            className="px-4 py-2 rounded-full bg-[#e63946] text-white text-sm font-medium hover:bg-[#d62839] transition-colors whitespace-nowrap"
          >
            {t.nav.cta} →
          </a>
        </div>
      </nav>
    </header>
  );
}

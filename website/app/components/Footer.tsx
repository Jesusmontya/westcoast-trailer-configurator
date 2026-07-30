"use client";

import { useLanguage } from "../context/LanguageContext";

const CONFIGURATOR_URL =
  "https://westcoast-trailer-configurator-tdlm.vercel.app";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-[#1c1917] text-white">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <p className="font-semibold text-lg">West Coast</p>
          <p className="mt-2 text-sm text-zinc-400 max-w-xs">{t.footer.tagline}</p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500 mb-3">
            {t.nav.home}
          </p>
          <div className="flex flex-col gap-2 text-sm text-zinc-400">
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
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500 mb-3">
            {t.footer.contactHeading}
          </p>
          <div className="flex flex-col gap-2 text-sm text-zinc-400">
            <span>{t.footer.phone}</span>
            <span>{t.footer.email}</span>
            <span>{t.footer.location}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} {t.footer.copyright}
          </p>
          <a
            href={CONFIGURATOR_URL}
            className="px-4 py-2 rounded-md bg-[#a8503f] text-white text-xs font-semibold hover:bg-[#8f4234] transition-colors"
          >
            {t.nav.cta} →
          </a>
        </div>
      </div>
    </footer>
  );
}
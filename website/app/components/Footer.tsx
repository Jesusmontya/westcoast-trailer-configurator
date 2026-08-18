"use client";

import { useLanguage } from "../context/LanguageContext";

const CONFIGURATOR_URL = "https://3d.allcustomtrailers.com";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="w-full bg-[var(--text)] border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-3 gap-10">
        <div>
          <p className="font-display text-lg font-semibold text-white">All Custom Trailers</p>
          <p className="mt-2 text-sm text-white/60 max-w-xs">{t.footer.tagline}</p>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-white/60 mb-3">
            {t.nav.home}
          </p>
          <div className="flex flex-col gap-2 text-sm text-white/60">
            <a href="#home" className="hover:text-white transition-colors">{t.nav.home}</a>
            <a href="#gallery" className="hover:text-white transition-colors">{t.nav.gallery}</a>
            <a href="#about" className="hover:text-white transition-colors">{t.nav.about}</a>
            <a href="#contact" className="hover:text-white transition-colors">{t.nav.contact}</a>
          </div>
        </div>

        <div>
          <p className="font-mono text-xs uppercase tracking-wide text-white/60 mb-3">
            {t.footer.contactHeading}
          </p>
          <div className="flex flex-col gap-2 text-sm text-white/60 font-mono">
            <a href="tel:+17754096847" className="hover:text-white transition-colors">{t.footer.phone}</a>
            <a href="mailto:luisinfante@allcustomtrailers.com" className="hover:text-white transition-colors">{t.footer.email}</a>
            <span>{t.footer.location}</span>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-mono text-xs text-white/60">
            © {new Date().getFullYear()} {t.footer.copyright}
          </p>
          <a
            href={CONFIGURATOR_URL}
            className="px-4 py-2 rounded-md bg-[var(--accent)] text-white text-xs font-semibold hover:bg-[var(--accent-glow)] transition-colors"
          >
            {t.nav.cta} →
          </a>
        </div>
      </div>
    </footer>
  );
}

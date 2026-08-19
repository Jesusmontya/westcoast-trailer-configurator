"use client";

import dynamic from "next/dynamic";
import { useLanguage } from "../context/LanguageContext";

const TrailerExperience3D = dynamic(() => import("./TrailerExperience3D"), { ssr: false });

export default function TrailerExperience() {
  const { lang } = useLanguage();
  const location = lang === "es"
    ? {
        eyebrow: "NEVADA Y MÁS ALLÁ",
        heading: "CONSTRUIDOS EN SPARKS. ENTREGADOS DONDE LOS NECESITES.",
        text: "All Custom Trailers construye food trailers y cocinas móviles personalizadas en Sparks, Nevada. Atendemos Reno y sus alrededores, y coordinamos envíos a California y cualquier lugar de Estados Unidos. El costo de envío aplica.",
        local: "Sparks · Reno · Carson City · Norte de Nevada",
        delivery: "California y envíos nacionales disponibles",
      }
    : {
        eyebrow: "NEVADA & BEYOND",
        heading: "BUILT IN SPARKS. DELIVERED WHERE YOU NEED IT.",
        text: "All Custom Trailers builds custom food trailers and mobile kitchens in Sparks, Nevada. We serve businesses throughout Reno and Northern Nevada, and can coordinate delivery to California and locations across the U.S. Shipping costs apply.",
        local: "Sparks · Reno · Carson City · Northern Nevada",
        delivery: "California & nationwide delivery available",
      };

  return (
    <>
      <TrailerExperience3D />

      <section className="w-full blueprint-bg border-t border-[var(--line)]" aria-labelledby="service-area-heading">
        <div className="max-w-6xl mx-auto px-6 py-20 sm:py-24">
          <span className="tag-pill mb-4">{location.eyebrow}</span>
          <div className="max-w-3xl">
            <h2 id="service-area-heading" className="font-display text-3xl sm:text-4xl font-semibold text-[var(--text)]">{location.heading}</h2>
            <p className="mt-5 text-[var(--text-muted)] leading-relaxed max-w-2xl">{location.text}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <span className="corner-ticket">{location.local}</span>
              <span className="corner-ticket">{location.delivery}</span>
            </div>
          </div>
        </div>
      </section>

      <a
        href="tel:+17754700219"
        aria-label="Call All Custom Trailers"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[var(--accent)] text-white shadow-xl transition-transform hover:scale-105 active:scale-95"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-6 w-6"
          aria-hidden="true"
        >
          <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.12 4.18 2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.12.9.33 1.78.62 2.63a2 2 0 0 1-.45 2.11L8 9.73a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.85.29 1.73.5 2.63.62A2 2 0 0 1 22 16.92z" />
        </svg>
      </a>
    </>
  );
}

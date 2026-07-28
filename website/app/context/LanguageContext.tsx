"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "es";

const translations = {
  en: {
    nav: {
      home: "Home",
      about: "About",
      gallery: "Gallery",
      contact: "Contact",
      cta: "Build my trailer",
    },
    hero: {
      headline: "We build the trailer. You build the business.",
      paragraph:
        "Custom food trailers, built in Nevada, from the frame up — for people ready to start something of their own.",
      cta: "Build my trailer",
    },
    trust: {
      heading: "Trusted by great amazing businesses",
      paragraph:
        "West Coast LLC is a leading supplier of the best quality trailers in Nevada, trusted by over 100 businesses.",
    },
    testimonial: {
      quote:
        "They are super professional and nice, they helped me get my loan and encouraged me to get going on my dream of making a business.",
      author: "— Annel Zamudio, Co-owner, Pelons Micheladas",
    },
    ctaFinal: {
      heading: "Build your trailer. Start working with West Coast LLC.",
      button: "Get in touch",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      about: "Nosotros",
      gallery: "Galería",
      contact: "Contacto",
      cta: "Arma tu trailer",
    },
    hero: {
      headline: "Nosotros hacemos el trailer. Tú haces el negocio.",
      paragraph:
        "Trailers de comida personalizados, hechos en Nevada, desde la estructura — para quienes están listos para empezar su propio negocio.",
      cta: "Arma tu trailer",
    },
    trust: {
      heading: "Con la confianza de negocios increíbles",
      paragraph:
        "West Coast LLC es un proveedor líder de trailers de la mejor calidad en Nevada, con la confianza de más de 100 negocios.",
    },
    testimonial: {
      quote:
        "Son súper profesionales y amables, me ayudaron a conseguir mi préstamo y me motivaron a seguir con mi sueño de tener mi propio negocio.",
      author: "— Annel Zamudio, Co-owner, Pelons Micheladas",
    },
    ctaFinal: {
      heading: "Arma tu trailer. Empieza a trabajar con West Coast LLC.",
      button: "Contáctanos",
    },
  },
};

type LanguageContextType = {
  lang: Lang;
  toggleLang: () => void;
  t: typeof translations["en"];
};

const LanguageContext = createContext<LanguageContextType | null>(null);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");

  function toggleLang() {
    setLang((prev) => (prev === "en" ? "es" : "en"));
  }

  const value = {
    lang,
    toggleLang,
    t: translations[lang],
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useLanguage debe usarse dentro de LanguageProvider");
  return ctx;
}

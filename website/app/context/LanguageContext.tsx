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
      eyebrow: "TRAILERS FOR ANY IDEA",
      headline: "We build the trailer. You build the business.",
      paragraph:
        "Custom food trailers, built in Nevada, from the frame up — for people ready to start something of their own.",
      cta: "Build my trailer",
    },
    advantages: {
      heading: "Why build with West Coast",
      items: [
        {
          title: "Flexible Financing",
          text: "We work with financing partners to help you get started without paying everything upfront.",
        },
        {
          title: "Fast Turnaround",
          text: "Efficient production timelines so you can open your business sooner, not later.",
        },
        {
          title: "Fully Custom Design",
          text: "Every trailer is built around your menu, equipment, and workflow — not a fixed template.",
        },
        {
          title: "Structural Warranty",
          text: "Every trailer comes backed by a warranty covering the structure and build quality.",
        },
        {
          title: "Commercial-Grade Equipment",
          text: "We install professional equipment built to handle real daily volume, not just show well.",
        },
        {
          title: "Accessible Pricing",
          text: "Quality trailers at prices built for real small business budgets, not inflated estimates.",
        },
      ],
    },
    trust: {
      heading: "Trusted by great amazing businesses",
      paragraph:
        "West Coast LLC is a leading supplier of the best quality trailers in Nevada, trusted by over 100 businesses.",
    },
    process: {
      heading: "How we build your trailer",
      steps: [
        { title: "Free consultation", text: "We talk through your menu, budget, and what you actually need." },
        { title: "Design & quote", text: "You see the layout and price before we build anything." },
        { title: "Build & install", text: "Frame, equipment, electrical — all done in-house, start to finish." },
        { title: "Delivery", text: "Pick it up or we bring it to you. Ready to open." },
      ],
    },
    trustWall: {
      heading: "Businesses we've built for",
      paragraph: "Real clients, real trailers, real businesses running today.",
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
      eyebrow: "TRAILERS PARA CUALQUIER IDEA",
      headline: "Nosotros hacemos el trailer. Tú haces el negocio.",
      paragraph:
        "Trailers de comida personalizados, hechos en Nevada, desde la estructura — para quienes están listos para empezar su propio negocio.",
      cta: "Arma tu trailer",
    },
    advantages: {
      heading: "Por qué construir con West Coast",
      items: [
        {
          title: "Financiamiento flexible",
          text: "Trabajamos con socios de financiamiento para que puedas empezar sin pagar todo por adelantado.",
        },
        {
          title: "Entrega rápida",
          text: "Tiempos de producción eficientes para que abras tu negocio antes, no después.",
        },
        {
          title: "Diseño 100% personalizado",
          text: "Cada trailer se construye alrededor de tu menú, equipo y forma de trabajar — no de una plantilla fija.",
        },
        {
          title: "Garantía estructural",
          text: "Cada trailer viene respaldado por una garantía que cubre la estructura y calidad de construcción.",
        },
        {
          title: "Equipo de calidad comercial",
          text: "Instalamos equipo profesional hecho para aguantar volumen real todos los días, no solo verse bien.",
        },
        {
          title: "Precios accesibles",
          text: "Trailers de calidad a precios pensados para presupuestos reales de negocios pequeños.",
        },
      ],
    },
    trust: {
      heading: "Con la confianza de negocios increíbles",
      paragraph:
        "West Coast LLC es un proveedor líder de trailers de la mejor calidad en Nevada, con la confianza de más de 100 negocios.",
    },
    process: {
      heading: "Cómo construimos tu trailer",
      steps: [
        { title: "Consulta gratis", text: "Platicamos tu menú, presupuesto, y lo que realmente necesitas." },
        { title: "Diseño y cotización", text: "Ves el layout y el precio antes de construir cualquier cosa." },
        { title: "Construcción e instalación", text: "Estructura, equipo, eléctrico — todo hecho en casa, de principio a fin." },
        { title: "Entrega", text: "Lo recoges o te lo llevamos. Listo para abrir." },
      ],
    },
    trustWall: {
      heading: "Negocios para los que hemos construido",
      paragraph: "Clientes reales, trailers reales, negocios reales funcionando hoy.",
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
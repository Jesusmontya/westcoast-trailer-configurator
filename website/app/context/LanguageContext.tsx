"use client";

import { createContext, useContext, useState, ReactNode } from "react";

type Lang = "en" | "es";

const translations = {
  en: {
    nav: {
      home: "Home",
      gallery: "Gallery",
      about: "About",
      contact: "Contact",
      cta: "Step inside, in 3D",
    },
    hero: {
      eyebrow: "TRAILERS FOR ANY IDEA",
      headline: "We build the trailer. You build the business.",
      paragraph:
        "Custom food trailers, built in Nevada, from the frame up — for people ready to start something of their own.",
      trustLine: "100+ trailers delivered · 3+ years in Nevada",
      cta: "Step inside, in 3D",
    },
    advantages: {
      heading: "Why build with All Custom Trailers",
      items: [
        {
          question: "Can I afford this without paying it all upfront?",
          title: "Flexible Financing",
          text: "We work with financing partners to help you get started without paying everything upfront.",
        },
        {
          question: "How long until I can actually open?",
          title: "Fast Turnaround",
          text: "Efficient production timelines so you can open your business sooner, not later.",
        },
        {
          question: "Will it actually fit how I work?",
          title: "Fully Custom Design",
          text: "Every trailer is built around your menu, equipment, and workflow — not a fixed template.",
        },
        {
          question: "Will it hold up over time?",
          title: "Structural Warranty",
          text: "Every trailer comes backed by a warranty covering the structure and build quality.",
        },
        {
          question: "Can it handle real daily volume?",
          title: "Commercial-Grade Equipment",
          text: "We install professional equipment built to handle real daily volume, not just show well.",
        },
        {
          question: "Am I overpaying for this?",
          title: "Accessible Pricing",
          text: "Quality trailers at prices built for real small business budgets, not inflated estimates.",
        },
      ],
    },
    gallery: {
      heading: "Trailers we've built",
      subheading: "Real clients, real projects. Click any trailer to see more.",
    },
    nextProject: {
      title: "Your next project",
      subtitle: "Loading",
    },
    about: {
      heading: "Making dreams possible.",
      paragraph1:
        "All Custom Trailers LLC has been building custom food trailers in Nevada for over three years. What started as a simple commitment — doing things right, at a fair price — has grown into more than 100 trailers delivered to real business owners: taco stands, michelada bars, food trucks, all built from the frame up, right here.",
      paragraph2:
        "We know starting your own business isn't easy. That's why we work with flexible financing partners, so you can get started without paying everything upfront — the same philosophy that helps our clients turn their own business dreams into reality.",
      stats: [
        { value: "100+", label: "Trailers delivered" },
        { value: "3+", label: "Years building in Nevada" },
        { value: "Flexible", label: "Financing available" },
      ],
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
    testimonial: {
      quote:
        "They are super professional and nice, they helped me get my loan and encouraged me to get going on my dream of making a business.",
      author: "— Annel Zamudio, Co-owner, Pelons Micheladas",
    },
    contact: {
      heading: "Let's build your trailer",
      subheading:
        "Leave your info and we'll reach out within 24 hours to talk details.",
      nameLabel: "Full name",
      phoneLabel: "Phone number",
      typeLabel: "What are you looking to build?",
      typeOptions: ["Taco / Food Trailer", "Beverage Trailer", "Full Kitchen Trailer", "Custom / Other"],
      submitButton: "Send",
      successMessage: "Thanks! We'll contact you within 24 hours.",
    },
    footer: {
      tagline: "We build the trailer. You build the business.",
      contactHeading: "Contact",
      phone: "Phone: coming soon",
      email: "Email: coming soon",
      location: "Nevada, USA — we ship anywhere (shipping cost applies)",
      copyright: "All Custom Trailers LLC. All rights reserved.",
    },
  },
  es: {
    nav: {
      home: "Inicio",
      gallery: "Galería",
      about: "Nosotros",
      contact: "Contacto",
      cta: "Entra en 3D",
    },
    hero: {
      eyebrow: "TRAILERS PARA CUALQUIER IDEA",
      headline: "Nosotros hacemos el trailer. Tú haces el negocio.",
      paragraph:
        "Trailers de comida personalizados, hechos en Nevada, desde la estructura — para quienes están listos para empezar su propio negocio.",
      trustLine: "100+ trailers entregados · 3+ años en Nevada",
      cta: "Entra en 3D",
    },
    advantages: {
      heading: "Por qué construir con All Custom Trailers",
      items: [
        {
          question: "¿Puedo pagarlo sin dar todo de una vez?",
          title: "Financiamiento flexible",
          text: "Trabajamos con socios de financiamiento para que puedas empezar sin pagar todo por adelantado.",
        },
        {
          question: "¿Cuánto tardo en abrir de verdad?",
          title: "Entrega rápida",
          text: "Tiempos de producción eficientes para que abras tu negocio antes, no después.",
        },
        {
          question: "¿De verdad se va a acomodar a cómo trabajo?",
          title: "Diseño 100% personalizado",
          text: "Cada trailer se construye alrededor de tu menú, equipo y forma de trabajar — no de una plantilla fija.",
        },
        {
          question: "¿Va a aguantar con el tiempo?",
          title: "Garantía estructural",
          text: "Cada trailer viene respaldado por una garantía que cubre la estructura y calidad de construcción.",
        },
        {
          question: "¿Aguanta el volumen real del día a día?",
          title: "Equipo de calidad comercial",
          text: "Instalamos equipo profesional hecho para aguantar volumen real todos los días, no solo verse bien.",
        },
        {
          question: "¿Estoy pagando de más por esto?",
          title: "Precios accesibles",
          text: "Trailers de calidad a precios pensados para presupuestos reales de negocios pequeños.",
        },
      ],
    },
    gallery: {
      heading: "Trailers que hemos construido",
      subheading: "Clientes reales, proyectos reales. Haz click en cualquiera para ver más.",
    },
    nextProject: {
      title: "Tu próximo proyecto",
      subtitle: "Cargando",
    },
    about: {
      heading: "Haciendo realidad tus sueños.",
      paragraph1:
        "All Custom Trailers LLC lleva más de tres años construyendo trailers de comida personalizados en Nevada. Lo que empezó como un compromiso simple — hacer las cosas bien, a un precio justo — se ha convertido en más de 100 trailers entregados a dueños de negocios reales: taquerías, michelerías, food trucks, todos construidos desde la estructura, aquí mismo.",
      paragraph2:
        "Sabemos que empezar tu propio negocio no es fácil. Por eso trabajamos con socios de financiamiento flexible, para que puedas arrancar sin pagar todo de una vez — la misma filosofía con la que ayudamos a nuestros clientes a hacer realidad el sueño de tener su propio negocio.",
      stats: [
        { value: "100+", label: "Trailers entregados" },
        { value: "3+", label: "Años construyendo en Nevada" },
        { value: "Flexible", label: "Financiamiento disponible" },
      ],
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
    testimonial: {
      quote:
        "Son súper profesionales y amables, me ayudaron a conseguir mi préstamo y me motivaron a seguir con mi sueño de tener mi propio negocio.",
      author: "— Annel Zamudio, Co-owner, Pelons Micheladas",
    },
    contact: {
      heading: "Construyamos tu trailer",
      subheading: "Déjanos tus datos y te contactamos en menos de 24 horas para platicar los detalles.",
      nameLabel: "Nombre completo",
      phoneLabel: "Número de teléfono",
      typeLabel: "¿Qué buscas construir?",
      typeOptions: ["Taco / Food Trailer", "Trailer de bebidas", "Cocina completa", "Personalizado / Otro"],
      submitButton: "Enviar",
      successMessage: "¡Gracias! Te contactaremos en menos de 24 horas.",
    },
    footer: {
      tagline: "Nosotros hacemos el trailer. Tú haces el negocio.",
      contactHeading: "Contacto",
      phone: "Teléfono: próximamente",
      email: "Correo: próximamente",
      location: "Nevada, USA — enviamos a cualquier lugar (costo de envío aplica)",
      copyright: "All Custom Trailers LLC. Todos los derechos reservados.",
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
import type { Metadata } from "next";
import Link from "next/link";

const SERVICES = {
  "custom-food-trailers": {
    title: "Custom Food Trailers",
    metaTitle: "Custom Food Trailers in Nevada | All Custom Trailers",
    metaDescription: "Custom food trailers built in Sparks, Nevada around your menu, equipment and workflow. Delivery available to California and beyond.",
    intro: "Custom food trailers designed around how your business actually operates—not a fixed template.",
    points: [
      "Custom kitchen layouts built around your menu and workflow.",
      "Commercial-grade equipment and practical work areas.",
      "Electrical, plumbing and exterior details planned into the build.",
      "Built in Nevada with delivery available outside the area.",
    ],
  },
  "mobile-kitchen-trailers": {
    title: "Mobile Kitchen Trailers",
    metaTitle: "Mobile Kitchen Trailers in Nevada | All Custom Trailers",
    metaDescription: "Commercial mobile kitchen trailers built in Sparks, Nevada for catering, events and mobile food operations. Custom layouts and equipment.",
    intro: "A professional kitchen on wheels, planned around the volume, equipment and workflow your operation requires.",
    points: [
      "Commercial kitchen layouts for real daily production.",
      "Equipment placement designed around speed and workflow.",
      "Built for catering, events and mobile operations.",
      "Delivery available to California and locations across the U.S.",
    ],
  },
  "beverage-trailers": {
    title: "Custom Beverage Trailers",
    metaTitle: "Custom Beverage Trailers in Nevada | All Custom Trailers",
    metaDescription: "Custom beverage trailers for coffee, smoothies, juices and specialty drinks, built in Sparks, Nevada with delivery across California and beyond.",
    intro: "A beverage trailer should make service fast, equipment accessible and your concept easy to operate. We build the layout around your menu and workflow.",
    points: [
      "Coffee, espresso, smoothie, juice and specialty beverage layouts.",
      "Service windows and customer flow designed for fast ordering.",
      "Planning for refrigeration, ice, water, sinks and electrical needs.",
      "Built in Sparks, Nevada with delivery available beyond the region.",
    ],
  },
  "specialty-trailers": {
    title: "Specialty Trailers",
    metaTitle: "Custom Specialty Trailers in Nevada | All Custom Trailers",
    metaDescription: "Custom specialty and commercial trailers built in Sparks, Nevada for unique business concepts. Designed around your operation and delivered where needed.",
    intro: "When your idea does not fit a standard trailer, we build around the operation you actually need.",
    points: [
      "Custom commercial layouts for unusual or specialized operations.",
      "Purpose-built compartments, service areas and equipment spaces.",
      "Design decisions driven by function rather than a standard template.",
      "Delivery available throughout Nevada, California and beyond.",
    ],
  },
} as const;

type ServiceSlug = keyof typeof SERVICES;

export function generateStaticParams() {
  return Object.keys(SERVICES).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const service = SERVICES[slug as ServiceSlug];
  if (!service) return {};
  return { title: service.metaTitle, description: service.metaDescription };
}

function BeverageGallery() {
  const exterior = [
    ["/photos/exteriors/exterior1.JPG", "Custom beverage trailer exterior"],
    ["/photos/exteriors/exterior2.jpg", "Beverage trailer exterior view"],
    ["/photos/exteriors/exterior3.jpg", "Custom beverage trailer build"],
  ];

  const interior = [
    ["/photos/interiors/interior1.JPG", "Beverage trailer interior"],
    ["/photos/interiors/interior2.JPG", "Custom beverage trailer interior"],
    ["/photos/interiors/interior3.JPG", "Beverage trailer equipment layout"],
    ["/photos/interiors/interior4.JPG", "Commercial beverage trailer interior"],
    ["/photos/interiors/interior5.JPG", "Custom trailer workspace"],
    ["/photos/interiors/interior6.JPG", "Beverage trailer prep area"],
  ];

  return (
    <>
      <section className="mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-7 overflow-hidden rounded-2xl bg-[var(--text)] min-h-[430px]">
            <img src={exterior[0][0]} alt={exterior[0][1]} className="h-full w-full object-cover" />
          </div>
          <div className="lg:col-span-5 grid grid-cols-2 gap-5">
            {exterior.slice(1).map(([src, alt]) => (
              <div key={src} className="overflow-hidden rounded-2xl bg-[var(--text)] min-h-[205px]">
                <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
            <div className="col-span-2 rounded-2xl bg-[var(--text)] text-white p-7 flex flex-col justify-end">
              <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/45">Built around the menu</span>
              <h2 className="mt-3 font-display text-3xl font-semibold">Coffee. Drinks. Smoothies. More.</h2>
              <p className="mt-3 text-white/60 leading-relaxed">We plan the service side, prep areas, utilities and equipment around the way your concept actually works.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-20">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <span className="tag-pill">What we can build</span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl font-semibold text-[var(--text)]">Designed for the way you serve.</h2>
          </div>
          <p className="max-w-xl text-[var(--text-muted)] leading-relaxed">From a compact coffee trailer to a full beverage operation, the layout changes with the concept, equipment and customer flow.</p>
        </div>

        <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {[
            ["01", "Coffee & Espresso", "Plan for espresso machines, grinders, refrigeration, water and fast service."],
            ["02", "Smoothies & Cold Drinks", "Create a practical layout for blenders, ice, refrigeration and prep."],
            ["03", "Juice & Specialty Drinks", "Build around your menu, storage, prep and service window."],
            ["04", "Custom Beverage Concepts", "If the concept is unique, we build the trailer around it."],
          ].map(([number, title, text]) => (
            <div key={number} className="stacked-card ticket-notch p-7 pt-9">
              <span className="font-mono text-xs text-[var(--accent-2)]">{number}</span>
              <h3 className="mt-3 font-display text-xl font-semibold text-[var(--text)]">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-[var(--text-muted)]">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <span className="tag-pill">Inside the build</span>
            <h2 className="mt-4 font-display text-3xl sm:text-4xl font-semibold text-[var(--text)]">The details matter.</h2>
            <p className="mt-5 text-[var(--text-muted)] leading-relaxed">A beverage trailer has to work for the person inside it and the customer outside it. We plan the equipment, utilities, storage and service flow as one system.</p>
            <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              {["Refrigeration & cold storage", "Ice & beverage prep", "Water & plumbing", "Electrical planning", "Service windows", "Storage & work areas"].map((item) => (
                <div key={item} className="rounded-xl border border-[var(--line)] bg-[var(--surface-2)] px-4 py-3 text-sm text-[var(--text)]">{item}</div>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {interior.map(([src, alt]) => (
              <div key={src} className="overflow-hidden rounded-xl bg-[var(--surface-2)] aspect-[4/3]">
                <img src={src} alt={alt} className="h-full w-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

export default async function ServicePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = SERVICES[slug as ServiceSlug];

  if (!service) {
    return (
      <main className="min-h-[70vh] flex items-center justify-center px-6 py-24">
        <div className="text-center">
          <h1 className="font-display text-4xl font-semibold text-[var(--text)]">Service not found</h1>
          <Link href="/" className="inline-block mt-6 rounded bg-[var(--accent)] px-6 py-3 font-semibold text-white">Back to All Custom Trailers</Link>
        </div>
      </main>
    );
  }

  return (
    <main className="blueprint-bg min-h-screen">
      <section className="max-w-6xl mx-auto px-6 py-24 sm:py-32">
        <span className="tag-pill">All Custom Trailers · Sparks, Nevada</span>
        <h1 className="mt-5 max-w-4xl font-display text-5xl sm:text-6xl font-semibold tracking-tight text-[var(--text)]">{service.title}</h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-[var(--text-muted)]">{service.intro}</p>

        {slug === "beverage-trailers" ? (
          <BeverageGallery />
        ) : (
          <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-5">
            {service.points.map((point, index) => (
              <div key={point} className="stacked-card ticket-notch p-7 pt-9">
                <span className="font-mono text-xs text-[var(--accent-2)]">{String(index + 1).padStart(2, "0")}</span>
                <p className="mt-3 text-base leading-relaxed text-[var(--text)]">{point}</p>
              </div>
            ))}
          </div>
        )}

        <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <span className="tag-pill">Built in Nevada</span>
            <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--text)]">Built around your business.</h2>
            <p className="mt-4 text-[var(--text-muted)] leading-relaxed">We build in Sparks, serve Reno and the surrounding Northern Nevada area, and can coordinate delivery to California and other U.S. locations when the customer covers shipping.</p>
          </div>
          <div className="stacked-card p-8 bg-[var(--text)] text-white">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/45">Ready to start?</span>
            <h2 className="mt-3 font-display text-3xl font-semibold">Tell us what you want to build.</h2>
            <p className="mt-4 text-white/60">No commitment. We will help you figure out the right layout, equipment and next step.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/#contact" className="rounded bg-[var(--accent)] px-6 py-3 font-semibold text-white">Get a Quote →</Link>
              <a href="tel:+17754700219" className="rounded border border-white/20 px-6 py-3 font-semibold text-white">Call (775) 470-0219</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

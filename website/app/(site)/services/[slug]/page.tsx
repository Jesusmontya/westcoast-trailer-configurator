import type { Metadata } from "next";
import Link from "next/link";

const SERVICES = {
  "custom-food-trailers": {
    title: "Custom Food Trailers",
    metaTitle: "Custom Food Trailers in Nevada | All Custom Trailers",
    metaDescription: "Custom food trailers built in Reno, Nevada around your menu, equipment and workflow. Delivery available to California and beyond.",
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
    metaDescription: "Commercial mobile kitchen trailers built in Reno, Nevada for catering, events and mobile food operations. Custom layouts and equipment.",
    intro: "A professional kitchen on wheels, planned around the volume, equipment and workflow your operation requires.",
    points: [
      "Commercial kitchen layouts for real daily production.",
      "Equipment placement designed around speed and workflow.",
      "Built for catering, events and mobile operations.",
      "Delivery available to California and locations across the U.S.",
    ],
  },
  "beverage-trailers": {
    title: "Beverage Trailers",
    metaTitle: "Custom Beverage Trailers in Nevada | All Custom Trailers",
    metaDescription: "Custom beverage trailers for coffee, drinks and specialty concepts, built in Reno, Nevada with delivery available across California and beyond.",
    intro: "Purpose-built beverage trailers for coffee, drinks, bars and specialty concepts that need a mobile operation.",
    points: [
      "Layouts tailored to your drink menu and equipment.",
      "Service areas designed for efficient customer flow.",
      "Custom electrical, plumbing and refrigeration planning.",
      "Built in Nevada and available for delivery beyond the region.",
    ],
  },
  "specialty-trailers": {
    title: "Specialty Trailers",
    metaTitle: "Custom Specialty Trailers in Nevada | All Custom Trailers",
    metaDescription: "Custom specialty and commercial trailers built in Reno, Nevada for unique business concepts. Designed around your operation and delivered where needed.",
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
        <span className="tag-pill">All Custom Trailers · Reno, Nevada</span>
        <h1 className="mt-5 max-w-4xl font-display text-5xl sm:text-6xl font-semibold tracking-tight text-[var(--text)]">{service.title}</h1>
        <p className="mt-6 max-w-2xl text-xl leading-relaxed text-[var(--text-muted)]">{service.intro}</p>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-5">
          {service.points.map((point, index) => (
            <div key={point} className="stacked-card ticket-notch p-7 pt-9">
              <span className="font-mono text-xs text-[var(--accent-2)]">{String(index + 1).padStart(2, "0")}</span>
              <p className="mt-3 text-base leading-relaxed text-[var(--text)]">{point}</p>
            </div>
          ))}
        </div>

        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div>
            <span className="tag-pill">Built in Nevada</span>
            <h2 className="mt-4 font-display text-3xl font-semibold text-[var(--text)]">Built around your business.</h2>
            <p className="mt-4 text-[var(--text-muted)] leading-relaxed">We build in Reno, serve the surrounding Northern Nevada area, and can coordinate delivery to California and other U.S. locations when the customer covers shipping.</p>
          </div>
          <div className="stacked-card p-8 bg-[var(--text)] text-white">
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-white/45">Ready to start?</span>
            <h2 className="mt-3 font-display text-3xl font-semibold">Tell us what you want to build.</h2>
            <p className="mt-4 text-white/60">No commitment. We will help you figure out the right layout, equipment and next step.</p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/#contact" className="rounded bg-[var(--accent)] px-6 py-3 font-semibold text-white">Get a Quote →</Link>
              <a href="tel:+17754096847" className="rounded border border-white/20 px-6 py-3 font-semibold text-white">Call (775) 409-6847</a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

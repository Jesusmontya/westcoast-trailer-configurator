import Link from "next/link";
import { notFound } from "next/navigation";

type Project = {
  name: string;
  type: string;
  slug: string;
  image: string;
  description: string;
  features: string[];
};

const projects: Project[] = [
  {
    name: "Captain Calabash",
    type: "Custom Food Trailer",
    slug: "captain-calabash",
    image: "/photos/captain calabash.jpg",
    description: "A custom mobile food operation designed around the client’s business concept, workflow, equipment needs and service flow.",
    features: ["Custom commercial layout", "Service-focused exterior design", "Electrical and plumbing planning", "Equipment placement around workflow"],
  },
  {
    name: "Left Coast Pizza",
    type: "Pizza Trailer",
    slug: "left-coast-pizza",
    image: "/photos/left coast pizza.jpg",
    description: "A pizza-focused mobile kitchen built around efficient service, commercial equipment and a compact production workflow.",
    features: ["Pizza-focused kitchen layout", "Commercial equipment planning", "Efficient prep and service flow", "Custom exterior configuration"],
  },
  {
    name: "Pancho's Tacos",
    type: "Taco Trailer",
    slug: "panchos-tacos",
    image: "/photos/panchos tacos.jpg",
    description: "A custom taco trailer designed around a practical food-service workflow and the equipment needed for daily mobile operation.",
    features: ["Custom taco-service layout", "Commercial kitchen planning", "Service window configuration", "Custom equipment placement"],
  },
  {
    name: "Rico's Mexican Food",
    type: "Food Trailer",
    slug: "ricos-mexican-food",
    image: "/photos/ricos mexican food.jpg",
    description: "A custom food trailer created to support a full mobile food operation with a layout tailored to the business.",
    features: ["Custom kitchen layout", "Food-service workflow", "Commercial equipment planning", "Built around daily operations"],
  },
  {
    name: "Tortilleria Rey Tacamba",
    type: "Custom Food Trailer",
    slug: "tortilleria-rey-tacamba",
    image: "/photos/tortilleria rey tacamba.jpg",
    description: "A specialized custom trailer built around the needs of a tortilla and food-service concept, rather than a fixed standard layout.",
    features: ["Specialized workspace planning", "Custom equipment placement", "Commercial utility planning", "Business-specific layout"],
  },
];

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) return {};

  return {
    title: `${project.name} | Custom Trailer Build | All Custom Trailers`,
    description: `${project.name} custom ${project.type.toLowerCase()} build by All Custom Trailers in Nevada. Explore the project, build approach and features.`,
  };
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = projects.find((item) => item.slug === slug);
  if (!project) notFound();

  return (
    <main className="min-h-screen bg-[var(--surface)] text-[var(--text)]">
      <section className="border-b border-[var(--line)] bg-[var(--text)] text-white">
        <div className="max-w-6xl mx-auto px-6 py-20 sm:px-10">
          <Link href="/#gallery" className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/50 hover:text-white">
            ← Back to our work
          </Link>
          <p className="mt-10 font-mono text-[10px] uppercase tracking-[0.25em] text-white/45">{project.type}</p>
          <h1 className="mt-3 font-display text-4xl sm:text-6xl font-semibold">{project.name}</h1>
          <p className="mt-5 max-w-2xl text-white/65 text-lg leading-relaxed">{project.description}</p>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-6 py-16 sm:px-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          <div className="overflow-hidden rounded-xl bg-[var(--surface-2)] border border-[var(--line)]">
            <img src={project.image} alt={`${project.name} ${project.type}`} className="w-full aspect-[4/3] object-cover" />
          </div>

          <div>
            <span className="tag-pill mb-4">Build details</span>
            <h2 className="font-display text-3xl sm:text-4xl font-semibold">BUILT AROUND THE BUSINESS.</h2>
            <p className="mt-5 text-[var(--text-muted)] leading-relaxed">
              Every custom trailer starts with the operation. Layout, equipment, utilities and service flow are planned together before the build moves into production.
            </p>

            <div className="mt-8 grid gap-3">
              {project.features.map((feature, index) => (
                <div key={feature} className="stacked-card p-4 flex gap-4 items-start">
                  <span className="font-mono text-xs text-[var(--accent-2)]">{String(index + 1).padStart(2, "0")}</span>
                  <p className="text-sm text-[var(--text)]">{feature}</p>
                </div>
              ))}
            </div>

            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/#contact" className="rounded bg-[var(--accent)] px-7 py-3.5 font-semibold text-white hover:bg-[var(--accent-glow)] transition-colors">
                GET A QUOTE →
              </Link>
              <a href="tel:+17754700219" className="rounded border border-[var(--line)] px-7 py-3.5 font-semibold text-[var(--text)] hover:bg-[var(--surface-2)] transition-colors">
                CALL (775) 470-0219
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="border-t border-[var(--line)] blueprint-bg">
        <div className="max-w-6xl mx-auto px-6 py-16 sm:px-10">
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
            <div>
              <span className="tag-pill mb-4">Interior gallery</span>
              <h2 className="font-display text-3xl sm:text-4xl font-semibold">INSIDE THE BUILD.</h2>
            </div>
            <p className="max-w-lg text-sm text-[var(--text-muted)] leading-relaxed">
              Interior photos can be added to the <span className="font-mono">photos/interiors/</span> folder and connected to each project here.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

import type { MetadataRoute } from "next";

const baseUrl = "https://allcustomtrailers.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const services = [
    "custom-food-trailers",
    "mobile-kitchen-trailers",
    "beverage-trailers",
    "specialty-trailers",
  ];

  const projects = [
    "captain-calabash",
    "left-coast-pizza",
    "panchos-tacos",
    "ricos-mexican-food",
    "tortilleria-rey-tacamba",
  ];

  return [
    {
      url: baseUrl,
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${baseUrl}/build`,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    ...services.map((slug) => ({
      url: `${baseUrl}/services/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...projects.map((slug) => ({
      url: `${baseUrl}/projects/${slug}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
  ];
}

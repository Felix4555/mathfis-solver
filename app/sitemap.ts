import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/site";
import { SOLVABLE_CATALOG } from "@/lib/solvableCatalog";
import { TOPICS } from "@/lib/topics";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = APP_URL;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/resolver`, changeFrequency: "weekly", priority: 0.9 },
    { url: `${base}/aprender`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${base}/practicar`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.4 },
    { url: `${base}/privacy`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${base}/terms`, changeFrequency: "yearly", priority: 0.2 },
  ];

  // Páginas de temas (teoría) => enlazan con los problemas resueltos.
  const topicRoutes: MetadataRoute.Sitemap = TOPICS.map((t) => ({
    url: `${base}/aprender/${t.slug}`,
    changeFrequency: "weekly" as const,
    priority: 0.8,
    lastModified: new Date(),
  }));

  // Páginas de problemas resueltos (una por problema del catálogo).
  const problemRoutes: MetadataRoute.Sitemap = SOLVABLE_CATALOG.map((e) => ({
    url: `${base}/resolver/${e.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
    lastModified: new Date(),
  }));

  return [...staticRoutes, ...topicRoutes, ...problemRoutes];
}

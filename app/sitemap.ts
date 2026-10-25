import type { MetadataRoute } from "next";
import { APP_URL } from "@/lib/site";
import { SOLVABLE_CATALOG } from "@/lib/solvableCatalog";
import { TOPICS } from "@/lib/topics";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = APP_URL;

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1.0, lastModified: new Date() },
    { url: `${base}/resolver`, changeFrequency: "daily", priority: 0.9, lastModified: new Date() },
    { url: `${base}/aprender`, changeFrequency: "daily", priority: 0.9, lastModified: new Date() },
    { url: `${base}/practicar`, changeFrequency: "weekly", priority: 0.8, lastModified: new Date() },
    { url: `${base}/about`, changeFrequency: "monthly", priority: 0.5, lastModified: new Date() },
    { url: `${base}/contact`, changeFrequency: "monthly", priority: 0.4, lastModified: new Date() },
    { url: `${base}/privacy`, changeFrequency: "monthly", priority: 0.3, lastModified: new Date() },
    { url: `${base}/terms`, changeFrequency: "monthly", priority: 0.3, lastModified: new Date() },
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

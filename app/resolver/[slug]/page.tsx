import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { solve } from "@/lib/solver";
import type { Solution } from "@/lib/solver/types";
import { APP_URL } from "@/lib/site";
import { SOLVABLE_CATALOG, findSolvableBySlug } from "@/lib/solvableCatalog";
import type { CatalogEntry } from "@/lib/catalog";
import { readResolverSlug } from "@/lib/url";
import { SolutionView } from "@/components/seo/SolutionView";
import { EnrichmentSections } from "@/components/seo/Enrichment";
import { buildEnrichment, mistakesAsText } from "@/lib/seoContent";
import { topicFor } from "@/lib/topics";
import {
  Breadcrumb,
  MathSolverJsonLd,
} from "@/components/seo/StructuredData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LinkButton,
} from "@/components/ui";

/** Pre-renderiza las páginas del catálogo en build; el resto se resuelve en runtime. */
export const dynamicParams = true;
// 30 días (ISR). Next 15 exige un literal: no se admite `60 * 60 * 24 * 30`.
export const revalidate = 2592000;

export function generateStaticParams(): { slug: string }[] {
  // Genera las páginas "candado" (más buscadas) en tiempo de build.
  // Solo entradas que resuelven: así nunca se pre-renderiza un 404.
  return SOLVABLE_CATALOG.map((e) => ({ slug: e.slug }));
}

/* ---------------------------------------------------------------------------
 * Metadata (título, descripción y URL canónica por página)
 * ------------------------------------------------------------------------- */

function pick(slug: string): CatalogEntry | null {
  const fromCatalog = findSolvableBySlug(slug);
  if (fromCatalog) return fromCatalog;

  // Slug arbitrario con el problema codificado (enlaces compartidos).
  const decoded = readResolverSlug(slug);
  if (decoded) {
    return { slug, problem: decoded, topic: "unknown", area: "math" };
  }
  return null;
}

/**
 * Next.js 15+: `params` es una Promise y hay que esperarla.
 * (En Next 14 era un objeto plano.)
 */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = pick(slug);
  if (!entry) return { title: "Problema no encontrado — MathFis Solver" };

  const result = solve(entry.problem);
  const finalText = result.ok ? result.finalText : "";

  const title = `${entry.problem} — Resolución paso a paso`;
  const description = finalText
    ? `Resuelve "${entry.problem}" paso a paso. Solución: ${finalText}. Incluye fórmulas, explicación y gráfico.`
    : `Resuelve "${entry.problem}" paso a paso con fórmulas, explicación detallada y gráfico.`;
  const url = `${APP_URL}/resolver/${entry.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      type: "article",
      siteName: "MathFis Solver",
    },
    twitter: { card: "summary", title, description },
  };
}

/* ---------------------------------------------------------------------------
 * Página
 * ------------------------------------------------------------------------- */

export default async function ResolverPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = pick(slug);
  if (!entry) notFound();

  const result = solve(entry.problem);
  if (!result.ok) notFound();

  const solution = result as Solution;

  // Contenido propio de esta página (errores, teoría, método alternativo).
  const enrichment = buildEnrichment(solution);

  // Guía de teoría del mismo tema (enlace interno bidireccional).
  const theory = topicFor(entry.problem, entry.topic);

  // Problemas relacionados por tema (enlaces internos => SEO).
  const related = SOLVABLE_CATALOG.filter(
    (e) => e.topic === entry.topic && e.slug !== entry.slug
  ).slice(0, 8);

  const url = `${APP_URL}/resolver/${entry.slug}`;
  const tryUrl = `/?q=${encodeURIComponent(entry.problem)}`;
  const areaLabel = entry.area === "physics" ? "Física" : "Matemáticas";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <MathSolverJsonLd
        problem={entry.problem}
        finalText={solution.finalText}
        url={url}
        topic={solution.topicLabel}
        mistakes={mistakesAsText(enrichment)}
      />

      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Problemas resueltos", href: "/resolver" },
          { label: entry.problem, href: url },
        ]}
      />

      <header className="space-y-2">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {entry.problem} — paso a paso
        </h1>
        <p className="text-sm text-muted-foreground">
          {solution.topicLabel} · {areaLabel}
        </p>
      </header>

      <SolutionView solution={solution} />

      <section aria-label="Ayuda para resolver este problema" className="space-y-4">
        <h2 className="text-lg font-semibold tracking-tight">
          Ayuda extra para {entry.problem}
        </h2>
        <EnrichmentSections e={enrichment} />
      </section>

      {theory && (
        <section aria-label="Teoría del tema">
          <Card className="border-primary/40">
            <CardHeader>
              <CardTitle className="text-base">Teoría: {theory.title}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <p className="text-sm leading-relaxed text-muted-foreground">
                {theory.description}
              </p>
              <Link
                href={`/aprender/${theory.slug}`}
                className="inline-block text-sm font-medium text-primary hover:underline"
              >
                Ver la guía del tema: fórmulas, método y errores típicos →
              </Link>
            </CardContent>
          </Card>
        </section>
      )}

      <div className="flex flex-wrap gap-3">
        <LinkButton href={tryUrl}>Resolver otro problema similar</LinkButton>
        <LinkButton href="/resolver" variant="outline">
          Ver más problemas resueltos
        </LinkButton>
      </div>

      {related.length > 0 && (
        <section>
          <Card>
            <CardHeader>
              <CardTitle>Más problemas de {solution.topicLabel}</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 sm:grid-cols-2">
                {related.map((r) => (
                  <li key={r.slug}>
                    <Link
                      href={`/resolver/${r.slug}`}
                      className="block rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-secondary"
                    >
                      {r.problem}
                    </Link>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </section>
      )}
    </div>
  );
}

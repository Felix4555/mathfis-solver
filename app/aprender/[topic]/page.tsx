import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { APP_URL } from "@/lib/site";
import { TOPICS, findTopic, labelFor, type TopicPage } from "@/lib/topics";
import { SOLVABLE_CATALOG } from "@/lib/solvableCatalog";
import { Tex } from "@/components/seo/Tex";
import { Breadcrumb, JsonLd } from "@/components/seo/StructuredData";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  LinkButton,
} from "@/components/ui";

/** Solo existen las guías declaradas en lib/topics.ts (todas estáticas). */
export const dynamicParams = false;

export function generateStaticParams() {
  return TOPICS.map((t) => ({ topic: t.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ topic: string }>;
}): Promise<Metadata> {
  const { topic } = await params;
  const t = findTopic(topic);
  if (!t) return {};

  return {
    title: t.title,
    description: t.description,
    alternates: { canonical: `${APP_URL}/aprender/${t.slug}` },
    openGraph: { title: t.title, description: t.description },
  };
}

/** Problemas del catálogo que encajan con esta guía. */
function relatedProblems(t: TopicPage) {
  return SOLVABLE_CATALOG.filter(
    (e) =>
      e.topic === t.topic &&
      (!t.include || t.include.test(e.problem)) &&
      (!t.exclude || !t.exclude.test(e.problem))
  ).slice(0, 9);
}

export default async function TopicPage({
  params,
}: {
  params: Promise<{ topic: string }>;
}) {
  const { topic } = await params;
  const t = findTopic(topic);
  if (!t) notFound();

  const canonical = `${APP_URL}/aprender/${t.slug}`;
  const problems = relatedProblems(t);
  const others = TOPICS.filter((o) => o.slug !== t.slug);

  const faqLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: t.faq.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <JsonLd>{faqLd}</JsonLd>

      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Aprender", href: "/aprender" },
          { label: t.title, href: canonical },
        ]}
      />

      <header className="space-y-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-primary">
          {t.short} · Guía de tema
        </p>
        <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
        <p className="text-muted-foreground">{t.description}</p>
      </header>

      <section className="space-y-3" aria-label="Introducción">
        {t.intro.map((p, i) => (
          <p key={i} className="leading-relaxed text-muted-foreground">
            {p}
          </p>
        ))}
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Fórmulas clave</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {t.formulas.map((f) => (
            <Card key={f.name}>
              <CardHeader>
                <CardTitle className="text-sm">{f.name}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <p className="overflow-x-auto">
                  <Tex tex={f.tex} display />
                </p>
                <p className="text-xs text-muted-foreground">{f.note}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Método de resolución</h2>
        <ol className="space-y-3">
          {t.method.map((m) => (
            <li key={m.h} className="rounded-lg border bg-card p-4">
              <h3 className="font-medium">{m.h}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{m.p}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Errores frecuentes en examen</h2>
        <ul className="space-y-3">
          {t.mistakes.map((m) => (
            <li
              key={m.error}
              className="rounded-lg border border-destructive/30 bg-card p-4"
            >
              <p className="text-sm font-medium">✗ {m.error}</p>
              <p className="text-sm text-muted-foreground">✓ {m.fix}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-baseline justify-between gap-2">
          <h2 className="text-xl font-semibold">
            Problemas resueltos de {t.short.toLowerCase()}
          </h2>
          <Link href="/resolver" className="text-sm text-primary hover:underline">
            Ver todos →
          </Link>
        </div>
        <p className="text-sm text-muted-foreground">
          Enunciados reales con desarrollo completo, explicación de cada paso y
          comprobación. Pulsa cualquiera para ver la solución detallada.
        </p>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {problems.map((p) => (
            <Link
              key={p.slug}
              href={`/resolver/${p.slug}`}
              className="rounded-lg border bg-card px-3 py-2 text-sm transition-colors hover:border-primary hover:text-primary"
            >
              {p.problem}
            </Link>
          ))}
        </div>
        <p className="text-xs text-muted-foreground">
          ¿No encuentras tu ejercicio? Escríbelo en el{" "}
          <Link href="/" className="text-primary hover:underline">
            resolutor
          </Link>{" "}
          y te lo resolvemos paso a paso.
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Preguntas frecuentes</h2>
        <div className="space-y-4">
          {t.faq.map((f) => (
            <div key={f.q} className="space-y-1">
              <h3 className="font-medium">{f.q}</h3>
              <p className="text-sm leading-relaxed text-muted-foreground">{f.a}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Otros temas</h2>
        <div className="flex flex-wrap gap-2">
          {others.map((o) => (
            <Link
              key={o.slug}
              href={`/aprender/${o.slug}`}
              className="rounded-full border px-3 py-1 text-sm transition-colors hover:border-primary hover:text-primary"
            >
              {labelFor(o.slug)}
            </Link>
          ))}
        </div>
      </section>

      <div className="flex flex-wrap gap-3">
        <LinkButton href="/">Resolver un problema</LinkButton>
        <LinkButton href="/aprender" variant="outline">
          Todas las guías
        </LinkButton>
      </div>
    </div>
  );
}

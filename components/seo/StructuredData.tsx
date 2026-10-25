import Link from "next/link";

/* ---------------------------------------------------------------------------
 * Componentes de SEO y datos estructurados
 * ------------------------------------------------------------------------- */

/**
 * Inyecta datos estructurados JSON-LD dentro de la página.
 * Google los usa para mostrar rich results (MathSolver, FAQ, Breadcrumb…).
 */
export function JsonLd({ children }: { children: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(children).replace(/</g, "\\u003c"),
      }}
    />
  );
}

/**
 * Datos estructurados tipo MathSolver (schema.org), usados por Google para
 * mostrar el resultado directamente en los resultados de búsqueda.
 */
export function MathSolverJsonLd({
  problem,
  finalText,
  url,
  topic,
  mistakes,
}: {
  problem: string;
  finalText: string;
  url: string;
  topic: string;
  /** Errores frecuentes (opcional): genera una segunda pregunta de FAQ. */
  mistakes?: string;
}) {
  const faq = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `¿Cómo se resuelve ${problem}?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: finalText,
        },
      },
      ...(mistakes
        ? [
            {
              "@type": "Question",
              name: `¿Qué errores comunes hay al resolver ${problem}?`,
              acceptedAnswer: { "@type": "Answer", text: mistakes },
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "MathSolver",
            name: `${problem} — Resolución paso a paso`,
            about: {
              "@type": "Thing",
              name: topic,
            },
            hasPart: {
              "@type": "Solution",
              text: finalText,
            },
            url,
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Inicio", item: "/" },
              { "@type": "ListItem", position: 2, name: "Resolver", item: "/resolver" },
              { "@type": "ListItem", position: 3, name: problem, item: url },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faq) }}
      />
    </>
  );
}

/* ---------------------------------------------------------------------------
 * Breadcrumb (miga de pan)
 * ------------------------------------------------------------------------- */

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
    <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
      <ol className="flex flex-wrap items-center gap-2">
        {items.map((item, i) => {
          const last = i === items.length - 1;
          return (
            <li key={item.href} className="flex items-center gap-2">
              {last ? (
                <span className="font-medium text-foreground line-clamp-1">
                  {item.label}
                </span>
              ) : (
                <Link
                  href={item.href}
                  className="hover:text-primary hover:underline"
                >
                  {item.label}
                </Link>
              )}
              {!last && <span aria-hidden="true">›</span>}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}

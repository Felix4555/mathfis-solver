import Link from "next/link";
import { CATALOG } from "@/lib/catalog";

/**
 * Sección de enlaces internos a páginas de problemas resueltos.
 *
 * Aparece debajo del solver en la home. Cumple dos funciones:
 *  1) SEO: Google descubre las páginas de /resolver/<slug> siguiendo estos
 *     enlaces (además del sitemap), y el anchor text es el propio problema.
 *  2) Utilidad: al estudiante le cuesta escribir el problema exacto, así que
 *     puede partir de uno parecido y "ver cómo se resuelve".
 */
export function PopularProblems({ limit = 12 }: { limit?: number }) {
  // Mezcla estable de áreas para que aparezcan mate y física juntas.
  const math = CATALOG.filter((e) => e.area === "math").slice(0, limit);
  const physics = CATALOG.filter((e) => e.area === "physics").slice(0, limit);
  const items = [...math.slice(0, Math.ceil(limit / 2)), ...physics.slice(0, Math.floor(limit / 2))];

  return (
    <section className="no-print mt-8">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold text-muted-foreground">
          Problemas resueltos frecuentes
        </h2>
        <Link
          href="/resolver"
          className="text-xs text-primary underline hover:opacity-90"
        >
          Ver todos →
        </Link>
      </div>
      <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((e) => (
          <li key={e.slug}>
            <Link
              href={`/resolver/${e.slug}`}
              className="block rounded-lg border border-border px-3 py-2 text-sm transition-colors hover:bg-secondary"
            >
              {e.problem}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}

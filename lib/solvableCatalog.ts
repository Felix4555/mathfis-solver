import { CATALOG, type CatalogEntry } from "./catalog";
import { solve } from "./solver";

/**
 * Catálogo "resoluble": solo entradas que el motor resuelve de verdad.
 *
 * Se usa en el servidor (generateStaticParams, hub y sitemap) para que una
 * entrada que el motor no soporte nunca llegue a:
 *   - generar una página que devolvería 404 en build, ni
 *   - aparecer en el sitemap (Google penaliza URLs que responden 404).
 *
 * NO importar desde componentes cliente: ejecuta `solve()` una vez al cargar.
 * En la práctica todas las entradas resuelven (lo comprueba
 * `scripts/check-catalog.ts`), así que ambas listas coinciden.
 */
export const SOLVABLE_CATALOG: CatalogEntry[] = CATALOG.filter(
  (e) => solve(e.problem).ok
);

const BY_SLUG = new Map(SOLVABLE_CATALOG.map((e) => [e.slug, e]));

export function findSolvableBySlug(slug: string): CatalogEntry | undefined {
  return BY_SLUG.get(slug);
}

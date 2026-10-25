/**
 * Auditoría del catálogo: lista las entradas que NO resuelven.
 * (Si aparecen, sus páginas darían 404 o quedarían sin generar.)
 *
 * Uso:  npx tsx scripts/check-catalog.ts
 */
import { solve } from "../lib/solver";
import { CATALOG } from "../lib/catalog";

const failed: Array<{ slug: string; problem: string; error: string }> = [];
const topics = new Map<string, number>();

for (const e of CATALOG) {
  const r = solve(e.problem);
  topics.set(e.topic, (topics.get(e.topic) || 0) + (r.ok ? 1 : 0));
  if (r.ok === false)
    failed.push({ slug: e.slug, problem: e.problem, error: r.error });
}

console.log(`CATALOGO TOTAL = ${CATALOG.length}`);
console.log(`OK             = ${CATALOG.length - failed.length}`);
console.log(`FAIL           = ${failed.length}`);
console.log("\n--- RESUELTOS POR TEMA ---");
for (const [t, n] of Array.from(topics.entries()).sort((a, b) => b[1] - a[1]))
  console.log(`  ${t.padEnd(16)} ${n}`);

if (failed.length) {
  console.log("\n--- ENTRADAS ROTAS ---");
  for (const f of failed) {
    console.log(`  slug   : ${f.slug}`);
    console.log(`  problem: ${f.problem}`);
    console.log(`  error  : ${f.error}`);
    console.log("");
  }
}

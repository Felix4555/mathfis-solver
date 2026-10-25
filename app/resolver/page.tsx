import { Metadata } from "next";
import Link from "next/link";
import { SOLVABLE_CATALOG } from "@/lib/solvableCatalog";
import { theoryLinksFor } from "@/lib/topics";
import type { Topic } from "@/lib/solver/types";
import { APP_URL } from "@/lib/site";
import { Breadcrumb } from "@/components/seo/StructuredData";
import { Badge, Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export const metadata: Metadata = {
  title: "Problemas resueltos de matemáticas y física | MathFis Solver",
  description:
    "Miles de problemas de matemáticas y física resueltos paso a paso: ecuaciones, derivadas, integrales, cinemática, dinámica, energía, electricidad y más.",
  alternates: { canonical: `${APP_URL}/resolver` },
  openGraph: {
    title: "Problemas resueltos de matemáticas y física",
    description:
      "Ecuaciones, derivadas, integrales, cinemática, dinámica y más, resueltos paso a paso.",
    url: `${APP_URL}/resolver`,
    type: "website",
  },
};

interface Group {
  area: string;
  topic: string;
  items: typeof SOLVABLE_CATALOG;
}

function groupCatalog(): Group[] {
  const map = new Map<string, Group>();
  for (const e of SOLVABLE_CATALOG) {
    const key = `${e.area}::${e.topic}`;
    if (!map.has(key)) {
      map.set(key, {
        area: e.area,
        topic: e.topic,
        items: [],
      });
    }
    map.get(key)!.items.push(e);
  }
  return Array.from(map.values()).sort((a, b) =>
    a.topic.localeCompare(b.topic)
  );
}

const TOPIC_TITLES: Record<string, string> = {
  equation: "Ecuaciones",
  derivative: "Derivadas",
  integral: "Integrales",
  geometry: "Geometría",
  trigonometry: "Trigonometría",
  arithmetic: "Aritmética",
  kinematics: "Cinemática",
  dynamics: "Dinámica",
  energy: "Energía",
  momentum: "Cantidad de movimiento",
  electricity: "Electricidad",
  unknown: "General",
};

export default function ResolverIndexPage() {
  const groups = groupCatalog();

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Problemas resueltos", href: "/resolver" },
        ]}
      />

      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">
          Problemas resueltos paso a paso
        </h1>
        <p className="text-muted-foreground">
          Encuentra un problema similar al tuyo y ve la solución completa con
          fórmulas, explicación y gráfico. Si no encuentras el tuyo,{" "}
          <Link href="/" className="text-primary underline hover:opacity-90">
            resuélvelo aquí
          </Link>
          . ¿Prefieres repasar antes la teoría y las fórmulas? Pasa por las{" "}
          <Link href="/aprender" className="text-primary underline hover:opacity-90">
            guías de tema
          </Link>
          .
        </p>
      </header>

      <div className="grid gap-4">
        {groups.map((g) => (
          <Card key={`${g.area}-${g.topic}`}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                {TOPIC_TITLES[g.topic] ?? g.topic}
                <Badge variant={g.area === "physics" ? "primary" : "muted"}>
                  {g.area === "physics" ? "Física" : "Matemáticas"}
                </Badge>
                <span className="text-xs font-normal text-muted-foreground">
                  {g.items.length} problemas
                </span>
                {theoryLinksFor(g.topic as Topic).map((l) => (
                  <Link
                    key={l.slug}
                    href={`/aprender/${l.slug}`}
                    className="text-xs font-medium text-primary hover:underline"
                  >
                    Teoría: {l.label}
                  </Link>
                ))}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {g.items.slice(0, 24).map((e) => (
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
              {g.items.length > 24 && (
                <p className="mt-3 text-xs text-muted-foreground">
                  … y {g.items.length - 24} más en esta categoría.
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

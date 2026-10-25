import type { Metadata } from "next";
import Link from "next/link";
import { APP_URL } from "@/lib/site";
import { TOPICS } from "@/lib/topics";
import { Breadcrumb } from "@/components/seo/StructuredData";
import { Card, CardContent, CardHeader, CardTitle, LinkButton } from "@/components/ui";

export const metadata: Metadata = {
  title: "Aprende matemáticas y física paso a paso | Temas y teoría",
  description:
    "Guías de teoría de matemáticas y física: ecuaciones, derivadas, integrales, geometría, trigonometría, cinemática, dinámica, energía y electricidad, con fórmulas y problemas resueltos.",
  alternates: { canonical: `${APP_URL}/aprender` },
};

export default function AprenderPage() {
  const math = TOPICS.filter((t) => t.area === "math");
  const physics = TOPICS.filter((t) => t.area === "physics");

  const group = (title: string, items: typeof TOPICS, hint: string) => (
    <section className="space-y-3">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="text-sm text-muted-foreground">{hint}</p>
      </div>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((t) => (
          <Link key={t.slug} href={`/aprender/${t.slug}`} className="group block h-full">
            <Card className="h-full transition-colors group-hover:border-primary">
              <CardHeader>
                <CardTitle className="text-base">{t.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground line-clamp-3">
                  {t.description}
                </p>
                <span className="mt-2 inline-block text-xs font-medium text-primary">
                  Ver teoría, fórmulas y errores típicos →
                </span>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </section>
  );

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Aprender", href: "/aprender" },
        ]}
      />

      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          Aprende matemáticas y física: teoría, fórmulas y método
        </h1>
        <p className="text-muted-foreground">
          Cada tema reúne la teoría esencial, las fórmulas que hay que memorizar, el método de
          resolución paso a paso, los errores que más se repiten en examen y una selección de
          problemas resueltos en los que aplicarlo. Es el punto de partida si no sabes por dónde
          empezar: primero la guía, después la práctica.
        </p>
        <p className="text-muted-foreground">
          Las guías enlazan con los ejemplos resueltos del mismo tema y cada ejemplo enlaza de
          vuelta a su guía, para que siempre tengas a mano tanto la explicación como el
          desarrollo completo del ejercicio.
        </p>
      </header>

      {group(
        "Matemáticas",
        math,
        "Álgebra, cálculo, geometría y trigonometría con ejemplos resueltos."
      )}

      {group(
        "Física",
        physics,
        "Movimiento, fuerzas, energía y circuitos: datos, fórmulas y comprobación."
      )}

      <div className="flex flex-wrap gap-3">
        <LinkButton href="/">Resolver un problema</LinkButton>
        <LinkButton href="/resolver" variant="outline">
          Ver problemas resueltos
        </LinkButton>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { PracticePanel } from "@/components/PracticePanel";
import { APP_URL } from "@/lib/site";
import { Breadcrumb } from "@/components/seo/StructuredData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

export const metadata: Metadata = {
  title: "Ejercicios de matemáticas y física para practicar online",
  description:
    "Practica con ejercicios generados al azar de aritmética, ecuaciones, derivadas, geometría y cinemática: tres niveles, pistas, solución explicada y puntuación.",
  alternates: { canonical: `${APP_URL}/practicar` },
  openGraph: {
    title: "Ejercicios de matemáticas y física para practicar",
    description:
      "Genera ejercicios infinitos con pistas, solución paso a paso y puntuación.",
    url: `${APP_URL}/practicar`,
    type: "website",
  },
};

const FEATURES = [
  {
    h: "Ejercicios distintos cada vez",
    p: "El generador crea enunciados nuevos con cada pulsación, así que puedes practicar un mismo tema indefinidamente sin repetir los mismos cinco ejercicios de siempre.",
  },
  {
    h: "Tres niveles de dificultad",
    p: "Básico para afianzar el concepto, intermedio para aplicarlo a problemas con más datos y avanzado para examen. Si te bloqueas, la pista te orienta sin darte la respuesta.",
  },
  {
    h: "Solución explicada",
    p: "Si fallas o te rindes, puedes ver el desarrollo completo con la fórmula empleada y el resultado. El objetivo es entender el porqué, no solo acertar el número.",
  },
  {
    h: "Puntuación y racha",
    p: "Lleva la cuenta de aciertos y de rachas consecutivas para que progresar se note. Se guarda en tu navegador: no hace falta registrarse ni dejar ningún dato.",
  },
];

export default function PracticarPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: "Practicar", href: "/practicar" },
        ]}
      />

      <header className="space-y-3">
        <h1 className="text-3xl font-bold tracking-tight">
          Ejercicios de matemáticas y física para practicar online
        </h1>
        <p className="text-muted-foreground">
          Resolver ejercicios ajenos te enseña a resolver los tuyos. Esta página
          genera problemas de forma automática para que practiques sin depender
          de un libro: eliges área y dificultad, intentas responder y compruebas
          el desarrollo completo cuando quieras.
        </p>
        <p className="text-muted-foreground">
          Es el complemento natural del{" "}
          <Link href="/" className="text-primary underline hover:opacity-90">
            resolutor
          </Link>{" "}
          —ahí pones tus propios enunciados— y de las{" "}
          <Link href="/aprender" className="text-primary underline hover:opacity-90">
            guías de teoría
          </Link>
          , donde repasas la fórmula antes de ponerse a practicar.
        </p>
      </header>

      <PracticePanel />

      <section className="space-y-3">
        <h2 className="text-xl font-semibold">Cómo funciona la práctica</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          {FEATURES.map((f) => (
            <Card key={f.h}>
              <CardHeader>
                <CardTitle className="text-sm">{f.h}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {f.p}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section className="space-y-2">
        <h2 className="text-xl font-semibold">
          ¿Qué temas se pueden practicar?
        </h2>
        <p className="leading-relaxed text-muted-foreground">
          Aritmética con paréntesis y potencias, ecuaciones de primer y segundo
          grado, derivadas de polinomios y funciones elementales, integrales
          indefinidas, áreas y volúmenes de figuras, trigonometría de ángulos
          notables y problemas de cinemática. Todas ellas son áreas con las que
          trabaja también el motor de resolución, así que el ejercicio que
          practicas aquí y el que resuelves allí usan el mismo criterio.
        </p>
        <p className="leading-relaxed text-muted-foreground">
          Si tras practicar te surge un enunciado propio que no sabes resolver,
          pégalo en el resolutor y verás el paso a paso completo; y si quieres
          entender la teoría de fondo, cada tema tiene su guía con fórmulas,
          método y errores típicos de examen.
        </p>
        <ul className="flex flex-wrap gap-2">
          {[
            ["Ecuaciones lineales", "/aprender/ecuaciones-lineales"],
            ["Ecuaciones cuadráticas", "/aprender/ecuaciones-cuadraticas"],
            ["Derivadas", "/aprender/derivadas"],
            ["Integrales", "/aprender/integrales"],
            ["Geometría", "/aprender/geometria"],
            ["Cinemática", "/aprender/cinematica"],
          ].map(([label, href]) => (
            <li key={href}>
              <Link
                href={href}
                className="rounded-full border px-3 py-1 text-sm transition-colors hover:border-primary hover:text-primary"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <div className="flex flex-wrap gap-3">
        <Link href="/" className="text-sm font-medium text-primary hover:underline">
          Resolver un problema concreto →
        </Link>
        <Link
          href="/resolver"
          className="text-sm font-medium text-primary hover:underline"
        >
          Ver problemas resueltos →
        </Link>
      </div>
    </div>
  );
}

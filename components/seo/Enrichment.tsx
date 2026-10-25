import type { Enrichment } from "@/lib/seoContent";
import { Tex } from "./Tex";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

/**
 * Contenido complementario de cada página de problema resuelto.
 *
 * Además de aportar valor real al estudiante, cumple una función de SEO:
 * hace que cada página tenga texto propio y específico (errores, teoría,
 * método alternativo) en lugar de ser una copia del enunciado + solución.
 *
 * Se renderiza en el servidor: todo el texto y las fórmulas (KaTeX server-side)
 * están en el HTML inicial y son indexables.
 */
export function EnrichmentSections({ e }: { e: Enrichment }) {
  return (
    <div className="space-y-4">
      {/* 1. Errores comunes */}
      <Card>
        <CardHeader>
          <CardTitle>Errores comunes al resolver este problema</CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="space-y-3">
            {e.mistakes.map((m, i) => (
              <li key={i} className="flex gap-3 text-sm leading-relaxed">
                <span
                  aria-hidden="true"
                  className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-destructive/10 text-xs font-semibold text-destructive"
                >
                  {i + 1}
                </span>
                <span className="text-muted-foreground">{m}</span>
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>

      {/* 2. Teoría */}
      <Card>
        <CardHeader>
          <CardTitle>{e.theory.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {e.theory.intro}
          </p>
          <dl className="space-y-3">
            {e.theory.formulas.map((f, i) => (
              <div
                key={i}
                className="rounded-lg border border-border bg-muted/40 p-3"
              >
                <div className="overflow-x-auto text-center">
                  <Tex tex={f.tex} display />
                </div>
                <dd className="mt-1.5 text-center text-xs text-muted-foreground">
                  {f.label}
                </dd>
              </div>
            ))}
          </dl>
        </CardContent>
      </Card>

      {/* 3. Método alternativo */}
      <Card>
        <CardHeader>
          <CardTitle>{e.alternative.title}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {e.alternative.intro}
          </p>
          <ol className="space-y-2">
            {e.alternative.lines.map((line, i) => (
              <li key={i} className="flex gap-3 text-sm">
                <span className="shrink-0 font-semibold text-primary">
                  {i + 1}.
                </span>
                <span className="text-muted-foreground">{line}</span>
              </li>
            ))}
          </ol>
        </CardContent>
      </Card>

      {/* 4. Consejo de examen */}
      <Card className="border-primary/30 bg-primary/5">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <span aria-hidden="true">💡</span> Consejo para el examen
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm leading-relaxed text-muted-foreground">
            {e.examTip}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

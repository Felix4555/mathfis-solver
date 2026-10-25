import { Breadcrumb } from "./StructuredData";

export interface DocSection {
  h: string;
  /** Párrafos en texto plano. Usa \n para partir en varias líneas. */
  p: string[];
}

/**
 * Layout compartido de las páginas legales/informativas
 * (/privacy, /terms, /about, /contact).
 *
 * Google AdSense revisa a mano que existan política de privacidad,
 * términos, quién está detrás del sitio y una forma de contacto.
 */
export function DocPage({
  title,
  description,
  canonical,
  updated,
  intro,
  sections,
  children,
}: {
  title: string;
  description: string;
  canonical: string;
  /** Fecha en formato legible, p. ej. "24 de octubre de 2026". */
  updated: string;
  intro: string;
  sections?: DocSection[];
  /** Bloque final opcional (p. ej. formulario de contacto). */
  children?: React.ReactNode;
}) {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Breadcrumb
        items={[
          { label: "Inicio", href: "/" },
          { label: title, href: canonical },
        ]}
      />

      <header className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">{title}</h1>
        <p className="text-sm text-muted-foreground">Última actualización: {updated}</p>
        <p className="text-muted-foreground">{intro}</p>
      </header>

      {sections?.map((s) => (
        <section key={s.h} className="space-y-2">
          <h2 className="text-lg font-semibold">{s.h}</h2>
          {s.p.map((para, i) => (
            <p key={i} className="text-sm leading-relaxed text-muted-foreground">
              {para}
            </p>
          ))}
        </section>
      ))}

      {children}

      <p className="sr-only">{description}</p>
    </div>
  );
}

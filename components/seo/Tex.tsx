import katex from "katex";

/**
 * Renderiza LaTeX **en el servidor** (Server Component).
 *
 * `MathLatex` (components/MathLatex.tsx) lo hace en el cliente con useEffect,
 * por lo que el HTML servido llega vacío y Google no indexa la fórmula.
 * Aquí usamos `katex.renderToString` para que la fórmula esté en el HTML
 * inicial. Si algo falla, se muestra el texto plano (nunca rompe la página).
 */
export function Tex({
  tex,
  display = false,
  className,
}: {
  tex: string;
  display?: boolean;
  className?: string;
}) {
  let html = "";
  try {
    html = katex.renderToString(tex || "", {
      throwOnError: false,
      displayMode: display,
      strict: false,
      output: "html",
    });
  } catch {
    html = "";
  }

  if (!html) {
    return <span className={className}>{tex}</span>;
  }

  return (
    <span
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

"use client";

import { useEffect, useRef } from "react";
import katex from "katex";

/**
 * Renderiza una cadena LaTeX usando KaTeX.
 * Si el LaTeX es inválido, muestra el texto plano (nunca rompe la UI).
 */
export function MathLatex({
  tex,
  display = false,
  className,
}: {
  tex: string;
  display?: boolean;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    try {
      katex.render(tex || "", el, {
        throwOnError: false,
        displayMode: display,
        strict: false,
        output: "html",
      });
    } catch {
      el.textContent = tex || "";
    }
  }, [tex, display]);

  return <span ref={ref} className={className} />;
}

/** Renderiza un texto que puede mezclar texto y LaTeX delimitado por $...$. */
export function MixedMath({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  const parts = (text || "").split(/\$([^$]+)\$/g);
  return (
    <span className={className}>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <MathLatex key={i} tex={part} />
        ) : (
          <span key={i}>{part}</span>
        )
      )}
    </span>
  );
}

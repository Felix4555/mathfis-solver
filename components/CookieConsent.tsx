"use client";

import { useEffect, useState } from "react";
import { readConsent, writeConsent, type ConsentChoice } from "@/lib/consent";

/**
 * Aviso de cookies (banner fijo inferior).
 *
 * - No se muestra si ya hay una elección guardada.
 * - Bloquea/gestiona los scripts de publicidad según la respuesta.
 * - Accesible: botones reales, aria-label y enlace a la política.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Evita el salto de layout: solo decidimos tras montar (sin SSR mismatch).
    if (readConsent() === null) setVisible(true);
  }, []);

  // Oculta el banner si cambia la consent en otra pestaña/componente.
  useEffect(() => {
    if (!mounted) return;
    const onStorage = (e: StorageEvent) => {
      if (e.key === "mathfis.consent") setVisible(false);
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [mounted]);

  if (!mounted || !visible) return null;

  const answer = (choice: ConsentChoice) => {
    writeConsent(choice);
    setVisible(false);
  };

  return (
    <div
      role="region"
      aria-label="Aviso de cookies"
      className="no-print fixed inset-x-0 bottom-0 z-50 border-t border-border bg-card/95 px-4 py-3 backdrop-blur"
    >
      <div className="mx-auto flex max-w-5xl flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs leading-relaxed text-muted-foreground">
          Usamos cookies propias para recordar tu idioma y tema, y, con tu
          permiso, cookies de terceros para mostrarte anuncios y medir el
          tráfico. Puedes cambiar de opinión cuando quieras borrando los datos
          del sitio. Más información en la{" "}
          <a href="/privacy" className="text-primary underline hover:opacity-90">
            política de privacidad
          </a>
          .
        </p>
        <div className="flex shrink-0 gap-2">
          <button
            type="button"
            onClick={() => answer("denied")}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium transition-colors hover:bg-secondary"
          >
            Rechazar
          </button>
          <button
            type="button"
            onClick={() => answer("granted")}
            className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  );
}

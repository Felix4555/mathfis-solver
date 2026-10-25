"use client";

import { useEffect, useState } from "react";
import { ADSENSE_CLIENT } from "@/lib/site";
import { consentGranted, onConsentChange } from "@/lib/consent";

const SCRIPT_ID = "adsense-loader";
const SRC =
  "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=";

/**
 * Carga el script de AdSense SOLO si:
 *  - hay un ID configurado (NEXT_PUBLIC_ADSENSE_CLIENT), y
 *  - el usuario aceptó las cookies (Consent Mode v2).
 *
 * Mientras no exista el ID, esto no hace absolutamente nada.
 * Se coloca en app/layout.tsx dentro del <body>.
 */
export function AdSenseScript() {
  useEffect(() => {
    if (!ADSENSE_CLIENT) return;

    const load = () => {
      if (typeof document === "undefined") return;
      if (document.getElementById(SCRIPT_ID)) return;
      const s = document.createElement("script");
      s.id = SCRIPT_ID;
      s.async = true;
      s.crossOrigin = "anonymous";
      s.src = `${SRC}${ADSENSE_CLIENT}`;
      document.head.appendChild(s);
    };

    const sync = (granted: boolean) => {
      if (granted) load();
    };

    sync(consentGranted());
    return onConsentChange((choice) => sync(choice === "granted"));
  }, []);

  return null;
}

/**
 * Hueco de anuncio.
 *
 * No se pinta nada si AdSense no está configurado, así que puedes dejarlo en
 * las plantillas ahora mismo sin romper el diseño ni penalizar el LCP.
 *
 * Uso: <AdSlot slot="1234567890" minHeight={280} />
 */
export function AdSlot({
  slot,
  className = "",
  minHeight = 0,
  label = "Publicidad",
}: {
  /** ID numérico del hueco creado en AdSense. */
  slot: string;
  className?: string;
  /** Altura mínima para evitar saltos de layout (CLS). */
  minHeight?: number;
  label?: string;
}) {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (!ADSENSE_CLIENT) return;
    setReady(consentGranted());
    return onConsentChange((choice) => setReady(choice === "granted"));
  }, []);

  // Pide el anuncio cuando el hueco aparece con consentimiento dado.
  useEffect(() => {
    if (!ready) return;
    try {
      const w = window as unknown as { adsbygoogle?: unknown[] };
      w.adsbygoogle = w.adsbygoogle || [];
      (w.adsbygoogle as unknown[]).push({});
    } catch {
      /* el script aún no está cargado; se reintenta en el siguiente render */
    }
  }, [ready]);

  if (!ADSENSE_CLIENT || !ready) return null;

  return (
    <aside
      aria-label={label}
      className={`no-print my-4 flex justify-center ${className}`}
      style={minHeight ? { minHeight } : undefined}
    >
      <ins
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={ADSENSE_CLIENT}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </aside>
  );
}

/**
 * Control de consentimiento de cookies (client-side).
 *
 * Cumple dos requisitos:
 *  1. Aviso de cookies con elección explícita del usuario (LGPD/RGPD).
 *  2. Google Consent Mode v2: los tags de publicidad solo se activan tras un
 *     "granted" explícito. El default "denied" se inyecta en app/layout.tsx.
 *
 * La elección se guarda en localStorage bajo `mathfis.consent`.
 */

export type ConsentChoice = "granted" | "denied";

const KEY = "mathfis.consent";
const EVENT = "mathfis:consent";

export function readConsent(): ConsentChoice | null {
  if (typeof window === "undefined") return null;
  try {
    const v = window.localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function writeConsent(choice: ConsentChoice): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, choice);
  } catch {
    /* almacenamiento bloqueado: no crítico */
  }
  applyConsentMode(choice);
  window.dispatchEvent(new CustomEvent(EVENT, { detail: choice }));
}

/**
 * Refleja la elección en Google Consent Mode (si gtag ya está cargado).
 */
export function applyConsentMode(choice: ConsentChoice): void {
  if (typeof window === "undefined") return;
  const gtag = (window as any).gtag;
  if (typeof gtag !== "function") return;
  try {
    gtag("consent", "update", {
      ad_storage: choice,
      ad_user_data: choice,
      ad_personalization: choice,
      analytics_storage: choice,
    });
  } catch {
    /* no crítico */
  }
}

/** Suscripción a cambios de consentimiento. Devuelve la función de baja. */
export function onConsentChange(cb: (c: ConsentChoice) => void): () => void {
  const handler = (e: Event) => {
    const detail = (e as CustomEvent<ConsentChoice>).detail;
    if (detail === "granted" || detail === "denied") cb(detail);
  };
  window.addEventListener(EVENT, handler);
  return () => window.removeEventListener(EVENT, handler);
}

/** true si el usuario aceptó cookies de publicidad/medición. */
export function consentGranted(): boolean {
  return readConsent() === "granted";
}

/**
 * Configuración pública del sitio.
 *
 * La URL base se lee de NEXT_PUBLIC_APP_URL (Vercel la inyecta en producción).
 * Se centraliza aquí porque `app/layout.tsx` no puede exportar constantes
 * arbitrarias (solo exports permitidos por Next.js).
 */
export const APP_URL =
  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export const SITE_NAME = "MathFis Solver";

/**
 * Correo de contacto público (aparece en /contact y en la política de
 * privacidad). Configúralo con NEXT_PUBLIC_CONTACT_EMAIL en producción para
 * que Google AdSense verifique un dato real.
 */
export const CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_CONTACT_EMAIL || "contacto@mathfis-solver.com";

/**
 * ID de Google AdSense (formato `pub-0000000000000000`).
 * Mientras no esté definido, no se carga ningún script de anuncios ni se
 * pinta ningún hueco: el sitio funciona exactamente igual que ahora.
 */
export const ADSENSE_CLIENT = process.env.NEXT_PUBLIC_ADSENSE_CLIENT || "";

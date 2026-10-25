/**
 * Utilidades de seguridad.
 * - sanitizeInput: limpia el texto del usuario (evita payloads raros).
 * - rateLimit: limitador simple en memoria por clave (IP).
 *
 * Nota: el motor NO usa eval ni ejecuta código del usuario, por lo que el
 * riesgo de ejecución arbitraria es nulo. Aquí solo acotamos tamaño/entrada.
 */

export function sanitizeInput(raw: unknown, maxLen = 1000): string {
  if (typeof raw !== "string") return "";
  let s = raw
    // eslint-disable-next-line no-control-regex
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "")
    .replace(/<[^>]*>/g, " ") // quita etiquetas HTML
    .trim();
  if (s.length > maxLen) s = s.slice(0, maxLen);
  return s;
}

interface Bucket {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetInMs: number;
}

/** Límite deslizante simple (reinicia la ventana al expirar). */
export function rateLimit(
  key: string,
  limit = 30,
  windowMs = 60_000
): RateLimitResult {
  const now = Date.now();
  let bucket = buckets.get(key);

  if (!bucket || bucket.resetAt < now) {
    bucket = { count: 0, resetAt: now + windowMs };
    buckets.set(key, bucket);
  }

  bucket.count += 1;
  const remaining = Math.max(0, limit - bucket.count);
  return {
    allowed: bucket.count <= limit,
    remaining,
    resetInMs: bucket.resetAt - now,
  };
}

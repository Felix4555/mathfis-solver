/**
 * Utilidades de URL para las páginas de problemas resueltos (SEO).
 *
 * Objetivo: que cada problema tenga una única URL canónica, legible por
 * Google y por las personas, p. ej.:
 *
 *   /resolver/x2-5x-6-0
 *
 * Para eso transformamos el problema en un "slug" estable y conservamos el
 * texto original en base64url para poder reconstruirlo de forma exacta.
 */

/** Reemplazos para que el slug sea más legible y estable. */
const SLUG_REPLACEMENTS: Array<[RegExp, string]> = [
  [/\s*=\s*/g, "-"], // " = " -> "-"  (antes que espacios)
  [/\+/g, ""], //  x^2 + 5x + 6  ->  x2 5x 6
  [/\s+/g, "-"], // espacios -> guiones
  [/\*/g, "x"], // 3*x -> 3x
  [/·/g, "x"],
  [/×/g, "x"],
  [/÷/g, "div"],
  [/−/g, "-"],
  [/\//g, "div"],
  [/\^/g, ""], // x^2 -> x2
  [/²/g, "2"],
  [/³/g, "3"],
  [/,/g, " "],
];

/** Normaliza el texto para comparar/deduplicar problemas. */
export function normalizeProblem(text: string): string {
  return (text ?? "")
    .normalize("NFC")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

/** Convierte un problema en un slug de URL. */
export function problemToSlug(problem: string): string {
  let s = (problem ?? "").normalize("NFC").toLowerCase();
  for (const [re, rep] of SLUG_REPLACEMENTS) s = s.replace(re, rep);

  s = s
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // quita tildes
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  if (!s) s = "problema";
  return s.slice(0, 80);
}

/** Base64 seguro para URLs (sin + / =). */
function toBase64Url(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(text: string): string | null {
  try {
    let b = text.replace(/-/g, "+").replace(/_/g, "/");
    while (b.length % 4) b += "=";
    const bin = atob(b);
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    return new TextDecoder().decode(bytes);
  } catch {
    return null;
  }
}

/**
 * Slug con el texto original codificado al final, para poder resolver
 * problemas arbitrarios que no están en el catálogo:
 *   /resolver/x2-5x-6-0?o=...
 * El slug legible aporta SEO; el parámetro `o` garantiza exactitud.
 */
export function encodeProblem(problem: string): string {
  return toBase64Url(problem);
}

export function decodeProblem(encoded: string): string | null {
  return fromBase64Url(encoded ?? "");
}

/** Slug híbrido: legible + exacto. */
export function buildResolverSlug(problem: string): string {
  return `${problemToSlug(problem)}--${toBase64Url(problem)}`;
}

export function readResolverSlug(slug: string): string | null {
  const i = (slug ?? "").lastIndexOf("--");
  if (i < 0) return null;
  return fromBase64Url(slug.slice(i + 2));
}

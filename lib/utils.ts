/** Utilidades generales para el cliente. */

export function cn(
  ...classes: (string | false | null | undefined)[]
): string {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(ts: number, lang: "es" | "en" = "es"): string {
  try {
    return new Date(ts).toLocaleString(lang === "es" ? "es-ES" : "en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return new Date(ts).toISOString();
  }
}

export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text);
      return true;
    }
    // Respaldo
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.opacity = "0";
    document.body.appendChild(ta);
    ta.select();
    document.execCommand("copy");
    document.body.removeChild(ta);
    return true;
  } catch {
    return false;
  }
}

/** Abre el diálogo de impresión (el usuario puede elegir "Guardar como PDF"). */
export function exportToPdf(): void {
  try {
    window.print();
  } catch {
    /* noop */
  }
}

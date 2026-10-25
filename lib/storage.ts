import type { Area } from "./solver/types";

/**
 * Persistencia local (localStorage) del historial y favoritos.
 * Se guarda en el navegador del usuario; no requiere base de datos para
 * funcionar (el prompt pide que sea funcional desde el primer momento).
 * La interfaz está aislada para poder sustituirla por Supabase/Postgres.
 */

export interface HistoryItem {
  id: string;
  createdAt: number;
  area: Area;
  topic: string;
  topicLabel: string;
  input: string;
  finalText: string;
  finalResult: string;
  favorite: boolean;
}

const KEY = "mathfis.history.v1";
const MAX_ITEMS = 200;

function hasStorage(): boolean {
  return typeof window !== "undefined" && !!window.localStorage;
}

export function loadHistory(): HistoryItem[] {
  if (!hasStorage()) return [];
  try {
    const raw = window.localStorage.getItem(KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed as HistoryItem[];
  } catch {
    return [];
  }
}

export function saveHistory(items: HistoryItem[]): void {
  if (!hasStorage()) return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(items.slice(0, MAX_ITEMS)));
  } catch {
    /* almacenamiento lleno o no disponible */
  }
}

export function addHistory(item: HistoryItem): HistoryItem[] {
  const items = loadHistory();
  // Evita duplicados exactos consecutivos
  const filtered = items.filter(
    (i) => !(i.input === item.input && i.finalText === item.finalText)
  );
  const next = [item, ...filtered].slice(0, MAX_ITEMS);
  saveHistory(next);
  return next;
}

export function toggleFavorite(id: string): HistoryItem[] {
  const items = loadHistory().map((i) =>
    i.id === id ? { ...i, favorite: !i.favorite } : i
  );
  saveHistory(items);
  return items;
}

export function removeHistoryItem(id: string): HistoryItem[] {
  const items = loadHistory().filter((i) => i.id !== id);
  saveHistory(items);
  return items;
}

export function clearHistory(): HistoryItem[] {
  saveHistory([]);
  return [];
}

export function newId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

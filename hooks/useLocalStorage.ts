"use client";

import { useCallback, useEffect, useState } from "react";

/**
 * Hook genérico de persistencia en localStorage.
 * Sincroniza estado de React con el almacenamiento del navegador y
 * soporta SSR (valor inicial hasta montar en el cliente).
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [value, setValue] = useState<T>(initialValue);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw !== null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignorar */
    }
    setHydrated(true);
  }, [key]);

  const set = useCallback(
    (next: T | ((prev: T) => T)) => {
      setValue((prev) => {
        const resolved =
          typeof next === "function" ? (next as (p: T) => T)(prev) : next;
        try {
          window.localStorage.setItem(key, JSON.stringify(resolved));
        } catch {
          /* ignorar */
        }
        return resolved;
      });
    },
    [key]
  );

  return [value, set, hydrated];
}

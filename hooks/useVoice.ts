"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/**
 * Hook para dictado por voz usando la Web Speech API del navegador.
 * No requiere dependencias externas. Degrada con gracia si no está soportado.
 */
export function useVoice(lang: "es" | "en") {
  const [listening, setListening] = useState(false);
  const [supported, setSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const SR =
      (window as any).SpeechRecognition ||
      (window as any).webkitSpeechRecognition;
    setSupported(!!SR);
  }, []);

  const stop = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      /* noop */
    }
    setListening(false);
  }, []);

  const start = useCallback(
    (onResult: (text: string) => void) => {
      if (typeof window === "undefined") return;
      const SR =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition;
      if (!SR) {
        setError("unsupported");
        return;
      }
      try {
        const rec = new SR();
        rec.lang = lang === "es" ? "es-ES" : "en-US";
        rec.interimResults = false;
        rec.maxAlternatives = 1;
        rec.onresult = (event: any) => {
          const text = event.results?.[0]?.[0]?.transcript ?? "";
          if (text) onResult(text);
        };
        rec.onerror = () => {
          setError("error");
          setListening(false);
        };
        rec.onend = () => setListening(false);
        recognitionRef.current = rec;
        setError(null);
        setListening(true);
        rec.start();
      } catch {
        setError("error");
        setListening(false);
      }
    },
    [lang]
  );

  return { listening, supported, error, start, stop };
}

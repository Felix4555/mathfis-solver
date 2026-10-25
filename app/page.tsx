"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Navbar, type View } from "@/components/Navbar";
import { ProblemInput } from "@/components/ProblemInput";
import { SolutionPanel } from "@/components/SolutionPanel";
import { PracticePanel } from "@/components/PracticePanel";
import { HistoryPanel } from "@/components/HistoryPanel";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { makeT, type Lang } from "@/lib/i18n";
import {
  addHistory,
  clearHistory,
  loadHistory,
  newId,
  removeHistoryItem,
  toggleFavorite,
  type HistoryItem,
} from "@/lib/storage";
import type { SolveResult } from "@/lib/solver/types";
import { PopularProblems } from "@/components/seo/PopularProblems";
import { HomeSeoHeader, HomeSeoSection } from "@/components/seo/HomeSeoSection";

export default function Home() {
  // ------------------- Preferencias persistentes -------------------
  const [theme, setTheme] = useLocalStorage<"light" | "dark">(
    "mathfis.theme",
    "light"
  );
  const [lang, setLang] = useLocalStorage<Lang>("mathfis.lang", "es");
  const t = useMemo(() => makeT(lang), [lang]);

  // ------------------- Navegación -------------------
  const [view, setView] = useState<View>("solver");

  // ------------------- Estado del solver -------------------
  const [problem, setProblem] = useState("");
  const [result, setResult] = useState<SolveResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  // ------------------- Historial -------------------
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Cargar historial y aplicar tema al montar
  useEffect(() => {
    setHistory(loadHistory());
  }, []);

  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.documentElement.lang = lang;
  }, [theme, lang]);

  // ------------------- Resolver -------------------
  const runSolve = useCallback(
    async (input: string) => {
      const clean = input.trim();
      if (!clean) return;
      setLoading(true);
      setSaved(false);
      setResult(null);

      try {
        const res = await fetch("/api/solve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ problem: clean }),
        });

        if (res.status === 429) {
          setResult({
            ok: false,
            error: t("errors.rateLimit"),
            suggestion: "",
          });
          return;
        }

        const data: SolveResult = await res.json();
        setResult(data);

        // Guardamos automáticamente las soluciones correctas en el historial.
        if (data.ok) {
          const item: HistoryItem = {
            id: newId(),
            createdAt: Date.now(),
            area: data.area,
            topic: data.topic,
            topicLabel: data.topicLabel,
            input: data.input,
            finalText: data.finalText,
            finalResult: data.finalResult,
            favorite: false,
          };
          setHistory(addHistory(item));
          setSaved(true);
        }
      } catch {
        setResult({
          ok: false,
          error: t("errors.network"),
          suggestion: "Comprueba tu conexión e inténtalo de nuevo.",
        });
      } finally {
        setLoading(false);
      }
    },
    [t]
  );

  const handleSolve = useCallback(() => runSolve(problem), [runSolve, problem]);

  const handleSelectHistory = useCallback(
    (item: HistoryItem) => {
      setProblem(item.input);
      setView("solver");
      runSolve(item.input);
    },
    [runSolve]
  );

  const favoritesCount = history.filter((h) => h.favorite).length;

  // Si llegamos con un problema en la URL (enlaces de /resolver/<slug>)
  // lo cargamos y resolvemos automáticamente.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const q = new URLSearchParams(window.location.search).get("q");
    if (q) {
      setProblem(q);
      runSolve(q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [runSolve]);

  return (
    <div className="min-h-screen">
      <Navbar
        view={view}
        setView={setView}
        t={t}
        lang={lang}
        onToggleLang={() => setLang(lang === "es" ? "en" : "es")}
        theme={theme}
        onToggleTheme={() => setTheme(theme === "light" ? "dark" : "light")}
        historyCount={history.length}
        favoritesCount={favoritesCount}
      />

      <main className="mx-auto max-w-7xl px-3 py-5 sm:px-6 sm:py-7">
        {view === "solver" && <HomeSeoHeader />}

        {view === "solver" && (
          <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
            <div className="lg:sticky lg:top-20">
              <ProblemInput
                value={problem}
                onChange={setProblem}
                onSolve={handleSolve}
                loading={loading}
                t={t}
                lang={lang}
                detectedTopic={result?.ok ? `${result.topicLabel} · ${result.area === "physics" ? t("common.physics") : t("common.math")}` : null}
              />
            </div>
            <div className="min-h-[400px]">
              <SolutionPanel
                result={result}
                loading={loading}
                t={t}
                onSave={() => setSaved(true)}
                saved={saved}
              />
            </div>
          </div>
        )}

        {view === "solver" && <PopularProblems />}

        {view === "solver" && <HomeSeoSection />}

        {view === "practice" && <PracticePanel t={t} />}

        {(view === "history" || view === "favorites") && (
          <HistoryPanel
            items={history}
            mode={view}
            t={t}
            onToggleFavorite={(id) => setHistory(toggleFavorite(id))}
            onDelete={(id) => setHistory(removeHistoryItem(id))}
            onClear={() => setHistory(clearHistory())}
            onSelect={handleSelectHistory}
          />
        )}
      </main>

      <footer className="no-print border-t border-border py-6 text-center text-xs text-muted-foreground">
        <p>
          {t("app.name")} · {t("app.tagline")}
        </p>
        <p className="mx-auto mt-2 max-w-2xl px-4 text-[11px] leading-relaxed opacity-80">
          Herramienta educativa asistida por inteligencia artificial y cálculo simbólico. Concebida
          para aprender el método deductivo paso a paso. Recuerda verificar siempre tus resultados
          para fines académicos o profesionales.
        </p>
        <p className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1">
          <a href="/resolver" className="text-primary underline hover:opacity-90">
            Problemas resueltos paso a paso
          </a>
          <span aria-hidden="true">·</span>
          <a href="/aprender" className="text-primary underline hover:opacity-90">
            Aprender: teoría, fórmulas y método
          </a>
        </p>
        <p className="mt-2 flex flex-wrap justify-center gap-x-3 gap-y-1">
          <a href="/about" className="hover:text-foreground hover:underline">
            Sobre nosotros
          </a>
          <span aria-hidden="true">·</span>
          <a href="/contact" className="hover:text-foreground hover:underline">
            Contacto
          </a>
          <span aria-hidden="true">·</span>
          <a href="/privacy" className="hover:text-foreground hover:underline">
            Privacidad
          </a>
          <span aria-hidden="true">·</span>
          <a href="/terms" className="hover:text-foreground hover:underline">
            Términos
          </a>
        </p>
        <p className="mt-1 opacity-70">
          Next.js · React · TypeScript · Tailwind · KaTeX
        </p>
      </footer>
    </div>
  );
}

"use client";

import {
  BookOpen,
  Calculator,
  GraduationCap,
  History as HistoryIcon,
  Star,
  Sun,
  Moon,
  Languages,
  User,
} from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

export type View = "solver" | "practice" | "history" | "favorites";

export function Navbar({
  view,
  setView,
  t,
  lang,
  onToggleLang,
  theme,
  onToggleTheme,
  historyCount,
  favoritesCount,
}: {
  view: View;
  setView: (v: View) => void;
  t: (k: string) => string;
  lang: "es" | "en";
  onToggleLang: () => void;
  theme: "light" | "dark";
  onToggleTheme: () => void;
  historyCount: number;
  favoritesCount: number;
}) {
  const items: { key: View; label: string; icon: any; count?: number }[] = [
    { key: "solver", label: t("nav.solver"), icon: Calculator },
    { key: "practice", label: t("nav.practice"), icon: GraduationCap },
    { key: "history", label: t("nav.history"), icon: HistoryIcon, count: historyCount },
    { key: "favorites", label: t("nav.favorites"), icon: Star, count: favoritesCount },
  ];

  return (
    <header className="no-print sticky top-0 z-40 border-b border-border bg-card/80 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-2 px-3 sm:px-6">
        {/* Marca */}
        <button
          onClick={() => setView("solver")}
          className="flex items-center gap-2.5"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <Calculator className="h-5 w-5" />
          </span>
          <span className="hidden flex-col items-start leading-none sm:flex">
            <span className="text-base font-bold">{t("app.name")}</span>
            <span className="text-[11px] text-muted-foreground">
              {t("app.tagline")}
            </span>
          </span>
        </button>

        {/* Navegación */}
        <nav className="flex items-center gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const active = view === item.key;
            return (
              <button
                key={item.key}
                onClick={() => setView(item.key)}
                className={cn(
                  "relative flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium transition-colors sm:px-3",
                  active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
                )}
                title={item.label}
              >
                <Icon className="h-4 w-4" />
                <span className="hidden md:inline">{item.label}</span>
                {typeof item.count === "number" && item.count > 0 && (
                  <span className="ml-0.5 rounded-full bg-primary/20 px-1.5 text-[10px] font-semibold text-primary">
                    {item.count}
                  </span>
                )}
              </button>
            );
          })}

          {/* Enlace a las guías de teoría (páginas indexables). */}
          <Link
            href="/aprender"
            className="flex items-center gap-1.5 rounded-lg px-2.5 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary/70 hover:text-foreground sm:px-3"
            title={lang === "es" ? "Aprender" : "Learn"}
          >
            <BookOpen className="h-4 w-4" />
            <span className="hidden md:inline">
              {lang === "es" ? "Aprender" : "Learn"}
            </span>
          </Link>
        </nav>

        {/* Acciones */}
        <div className="flex items-center gap-1">
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1 rounded-lg px-2 py-2 text-sm text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
            title={t("lang.switch")}
          >
            <Languages className="h-4 w-4" />
            <span className="hidden text-xs font-semibold uppercase sm:inline">
              {lang}
            </span>
          </button>

          <button
            onClick={onToggleTheme}
            className="rounded-lg p-2 text-muted-foreground hover:bg-secondary/70 hover:text-foreground"
            title={theme === "light" ? t("theme.dark") : t("theme.light")}
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </button>

          <span
            className="ml-1 hidden h-8 w-8 items-center justify-center rounded-full bg-secondary text-muted-foreground sm:flex"
            title={t("nav.profile")}
          >
            <User className="h-4 w-4" />
          </span>
        </div>
      </div>
    </header>
  );
}

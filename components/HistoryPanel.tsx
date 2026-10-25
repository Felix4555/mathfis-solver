"use client";

import { useMemo, useState } from "react";
import {
  History as HistoryIcon,
  Star,
  Trash2,
  Search,
  Printer,
  Filter,
  ArrowRight,
  Inbox,
} from "lucide-react";
import { Badge, Button, Card, CardContent, Input, Select } from "./ui";
import { cn, formatDate } from "@/lib/utils";
import type { HistoryItem } from "@/lib/storage";
import { MathLatex } from "./MathLatex";

/** Abre una ventana con el contenido formateado para imprimir/guardar como PDF. */
function printItems(items: HistoryItem[], title: string) {
  const win = window.open("", "_blank", "width=800,height=900");
  if (!win) return;
  const rows = items
    .map(
      (i) => `
      <div style="border:1px solid #ddd;border-radius:10px;padding:12px;margin-bottom:12px;page-break-inside:avoid">
        <div style="font-size:11px;color:#666;margin-bottom:6px">
          ${i.topicLabel} · ${new Date(i.createdAt).toLocaleString()}
        </div>
        <div style="font-family:monospace;font-size:13px;white-space:pre-wrap;margin-bottom:8px">${escapeHtml(
          i.input
        )}</div>
        <div style="font-weight:600;color:#166534">${escapeHtml(i.finalText)}</div>
      </div>`
    )
    .join("");
  win.document.write(`<!doctype html><html><head><meta charset="utf-8">
    <title>${escapeHtml(title)}</title></head>
    <body style="font-family:system-ui,sans-serif;padding:24px;max-width:760px;margin:auto">
      <h1 style="font-size:20px;margin-bottom:4px">MathFis Solver</h1>
      <p style="color:#666;font-size:13px;margin-bottom:20px">${escapeHtml(title)} — ${new Date().toLocaleString()}</p>
      ${rows || "<p>Sin elementos.</p>"}
      <script>window.onload=function(){window.print();}</script>
    </body></html>`);
  win.document.close();
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

export function HistoryPanel({
  items,
  mode,
  t,
  onToggleFavorite,
  onDelete,
  onClear,
  onSelect,
}: {
  items: HistoryItem[];
  mode: "history" | "favorites";
  t: (k: string) => string;
  onToggleFavorite: (id: string) => void;
  onDelete: (id: string) => void;
  onClear: () => void;
  onSelect: (item: HistoryItem) => void;
}) {
  const [query, setQuery] = useState("");
  const [areaFilter, setAreaFilter] = useState<"all" | "math" | "physics">("all");
  const [favoritesOnly, setFavoritesOnly] = useState(mode === "favorites");

  const filtered = useMemo(() => {
    return items.filter((i) => {
      if (mode === "favorites" && !i.favorite) return false;
      if (favoritesOnly && mode === "history" && !i.favorite) return false;
      if (areaFilter !== "all" && i.area !== areaFilter) return false;
      if (query.trim()) {
        const q = query.toLowerCase();
        if (
          !i.input.toLowerCase().includes(q) &&
          !i.topicLabel.toLowerCase().includes(q) &&
          !i.finalText.toLowerCase().includes(q)
        )
          return false;
      }
      return true;
    });
  }, [items, mode, favoritesOnly, areaFilter, query]);

  const isFav = mode === "favorites";

  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <Card className="no-print">
        <CardContent className="space-y-3 pt-5">
          <div className="flex items-center justify-between">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              {isFav ? (
                <Star className="h-5 w-5 text-accent" />
              ) : (
                <HistoryIcon className="h-5 w-5 text-primary" />
              )}
              {isFav ? t("favorites.title") : t("history.title")}
              <span className="text-sm font-normal text-muted-foreground">
                ({filtered.length} {t("history.results")})
              </span>
            </h2>
            <div className="flex gap-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => printItems(filtered, isFav ? t("favorites.title") : t("history.title"))}
                disabled={filtered.length === 0}
              >
                <Printer className="h-3.5 w-3.5" /> {t("common.print")}
              </Button>
              {!isFav && filtered.length > 0 && (
                <Button
                  size="sm"
                  variant="danger"
                  onClick={() => {
                    if (window.confirm(t("history.confirmClear"))) onClear();
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" /> {t("history.clearAll")}
                </Button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("history.search")}
                className="pl-9"
              />
            </div>
            <Select
              value={areaFilter}
              onChange={(e) => setAreaFilter(e.target.value as any)}
              className="sm:w-44"
            >
              <option value="all">{t("common.all")}</option>
              <option value="math">{t("common.math")}</option>
              <option value="physics">{t("common.physics")}</option>
            </Select>
            {!isFav && (
              <Button
                variant={favoritesOnly ? "primary" : "outline"}
                onClick={() => setFavoritesOnly((s) => !s)}
              >
                <Filter className="h-3.5 w-3.5" /> {t("history.favoritesOnly")}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-14 text-center text-muted-foreground">
            <Inbox className="h-10 w-10 opacity-40" />
            <p className="text-sm">{isFav ? t("favorites.empty") : t("history.empty")}</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Card key={item.id} className="group">
              <CardContent className="space-y-3 pt-5">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="primary">
                      {item.area === "physics" ? t("common.physics") : t("common.math")}
                    </Badge>
                    <Badge variant="muted">{item.topicLabel}</Badge>
                    <span className="text-[11px] text-muted-foreground">
                      {formatDate(item.createdAt)}
                    </span>
                  </div>
                  <div className="flex shrink-0 gap-1">
                    <button
                      onClick={() => onToggleFavorite(item.id)}
                      className={cn(
                        "rounded-lg p-2 transition-colors hover:bg-secondary",
                        item.favorite ? "text-accent" : "text-muted-foreground"
                      )}
                      title={item.favorite ? t("nav.favorites") : t("nav.favorites")}
                    >
                      <Star className={cn("h-4 w-4", item.favorite && "fill-current")} />
                    </button>
                    <button
                      onClick={() => onDelete(item.id)}
                      className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-danger/10 hover:text-danger"
                      title={t("common.delete")}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                <p className="whitespace-pre-wrap font-mono text-sm text-muted-foreground">
                  {item.input}
                </p>

                <div className="overflow-x-auto rounded-lg bg-success/5 px-3 py-2">
                  <MathLatex tex={item.finalResult} />
                </div>

                <Button size="sm" variant="ghost" onClick={() => onSelect(item)}>
                  <ArrowRight className="h-3.5 w-3.5" /> {t("nav.solver")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

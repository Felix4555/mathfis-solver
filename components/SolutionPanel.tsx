"use client";

import { useState } from "react";
import {
  BookOpen,
  Sigma,
  Hash,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Copy,
  Check,
  Save,
  LineChart,
  GraduationCap,
  Lightbulb,
  Sigma as SigmaIcon,
} from "lucide-react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Spinner } from "./ui";
import { MathLatex } from "./MathLatex";
import { Graph } from "./Graph";
import { copyToClipboard } from "@/lib/utils";
import type { SolveResult, SolveFailure } from "@/lib/solver/types";

export function SolutionPanel({
  result,
  loading,
  t,
  onSave,
  saved,
}: {
  result: SolveResult | null;
  loading: boolean;
  t: (k: string) => string;
  onSave: () => void;
  saved: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    if (!result || !result.ok) return;
    const ok = await copyToClipboard(result.finalText);
    if (ok) {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    }
  };

  if (loading) {
    return (
      <Card className="flex h-full items-center justify-center p-10">
        <div className="flex flex-col items-center gap-3 text-muted-foreground">
          <Spinner className="h-6 w-6 text-primary" />
          <p className="text-sm">{t("solver.solving")}</p>
        </div>
      </Card>
    );
  }

  if (!result) {
    return (
      <Card className="flex h-full items-center justify-center p-10">
        <div className="flex max-w-xs flex-col items-center gap-3 text-center text-muted-foreground">
          <BookOpen className="h-10 w-10 opacity-40" />
          <p className="text-sm">{t("solver.empty")}</p>
        </div>
      </Card>
    );
  }

  // ----------------------- Error / aclaración -----------------------
  if (!result.ok) {
    const failure = result as SolveFailure;
    return (
      <Card className="animate-in border-danger/40">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-danger">
            {failure.needsClarification ? (
              <HelpCircle className="h-4 w-4" />
            ) : (
              <AlertTriangle className="h-4 w-4" />
            )}
            {failure.needsClarification ? t("solution.askClarify") : t("errors.server")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm">{failure.error}</p>
          {failure.suggestion && (
            <div className="rounded-lg bg-secondary/50 p-3 text-sm">
              <p className="mb-0.5 text-xs font-medium text-muted-foreground">
                {t("solution.suggestion")}
              </p>
              <p>{failure.suggestion}</p>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // ----------------------- Solución -----------------------
  const confidenceMap = {
    high: { variant: "success" as const, label: t("solution.high") },
    medium: { variant: "primary" as const, label: t("solution.medium") },
    low: { variant: "muted" as const, label: t("solution.low") },
  };
  const conf = confidenceMap[result.confidence] ?? confidenceMap.medium;

  return (
    <div className="animate-in space-y-4">
      {/* Cabecera */}
      <Card>
        <CardHeader className="flex flex-row items-start justify-between gap-2 space-y-0">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4 text-success" />
              {t("solution.title")}
            </CardTitle>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <Badge variant="primary">
                {result.area === "physics" ? t("common.physics") : t("common.math")}
              </Badge>
              <Badge variant="muted">{result.topicLabel}</Badge>
              <Badge variant={conf.variant}>
                {t("solution.confidence")}: {conf.label}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Explicación del profesor (resumen) */}
      {result.summary && (
        <Card className="border-primary/30 bg-primary/5">
          <CardContent className="flex items-start gap-3 pt-5">
            <GraduationCap className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
            <div>
              <p className="mb-1 text-sm font-semibold text-primary">
                {t("solution.explanation")}
              </p>
              <p className="text-sm leading-relaxed">{result.summary}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Problema */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-muted-foreground">
            {t("history.item")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="whitespace-pre-wrap font-mono text-sm">{result.input}</p>
        </CardContent>
      </Card>

      {/* Resultado final */}
      <Card className="border-success/40 bg-success/5">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-success">
            <Hash className="h-4 w-4" />
            {t("solution.final")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="overflow-x-auto rounded-lg bg-card p-4 text-center">
            <MathLatex tex={result.finalResult} display />
          </div>
          <div className="flex flex-wrap gap-2">
            <Button size="sm" variant="outline" onClick={handleCopy}>
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? t("common.copied") : t("solution.copyResult")}
            </Button>
            <Button size="sm" variant={saved ? "secondary" : "outline"} onClick={onSave} disabled={saved}>
              <Save className="h-3.5 w-3.5" />
              {saved ? t("solution.saved") : t("solution.save")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Pasos */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2">
            <Sigma className="h-4 w-4 text-primary" />
            {t("solution.steps")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {result.steps.map((step) => (
            <div key={step.step} className="flex gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/15 text-sm font-semibold text-primary">
                {step.step}
              </div>
              <div className="flex-1 space-y-1.5 pb-3">
                <p className="text-sm font-semibold">{step.title}</p>
                <p className="text-sm text-muted-foreground">{step.detail}</p>
                {step.formula && (
                  <div className="overflow-x-auto rounded-lg bg-secondary/50 px-3 py-2">
                    <MathLatex tex={step.formula} display />
                  </div>
                )}
                {step.explanation && (
                  <div className="flex items-start gap-2 rounded-lg bg-accent/10 px-3 py-2">
                    <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
                    <p className="text-xs leading-relaxed text-muted-foreground">
                      {step.explanation}
                    </p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Fórmulas usadas */}
      {result.formulas.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <SigmaIcon className="h-4 w-4 text-accent" />
              {t("solution.formulas")}
            </CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            {result.formulas.map((f, i) => (
              <div
                key={i}
                className="overflow-x-auto rounded-lg border border-border bg-secondary/30 px-3 py-2 text-center"
              >
                <MathLatex tex={f} />
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Gráfico */}
      {result.graph && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2">
              <LineChart className="h-4 w-4 text-primary" />
              {t("solution.graph")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Graph spec={result.graph} />
          </CardContent>
        </Card>
      )}

      {/* Notas */}
      {result.notes && result.notes.length > 0 && (
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              {t("solution.notes")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
              {result.notes.map((n, i) => (
                <li key={i}>{n}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

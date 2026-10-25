"use client";

import { useCallback, useEffect, useState } from "react";
import {
  GraduationCap,
  RefreshCw,
  Check,
  X,
  Eye,
  EyeOff,
  Trophy,
  Flame,
  Target,
  Lightbulb,
} from "lucide-react";
import { Badge, Button, Card, CardContent, CardHeader, CardTitle, Input, Select, Spinner } from "./ui";
import { cn } from "@/lib/utils";
import { checkAnswer, generateProblem, type Difficulty, type PracticeProblem } from "@/lib/solver/practice";
import { makeT } from "@/lib/i18n";
import type { Area } from "@/lib/solver/types";

/**
 * `t` es opcional: la página /practicar es un Server Component y Next no
 * permite pasar funciones a componentes cliente, así que aquí usamos las
 * traducciones en español por defecto.
 */
export function PracticePanel({ t = makeT("es") }: { t?: (k: string) => string }) {
  const [area, setArea] = useState<Area>("math");
  const [difficulty, setDifficulty] = useState<Difficulty>("facil");
  const [problem, setProblem] = useState<PracticeProblem | null>(null);
  const [loading, setLoading] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [feedback, setFeedback] = useState<"idle" | "correct" | "incorrect">("idle");
  const [showSolution, setShowSolution] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0, streak: 0 });
  const [error, setError] = useState<string | null>(null);

  const generate = useCallback(
    (a: Area, d: Difficulty) => {
      setLoading(true);
      setError(null);
      setFeedback("idle");
      setUserAnswer("");
      setShowSolution(false);
      setShowHint(false);

      // Intenta el endpoint del servidor; si falla, genera localmente.
      fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ area: a, difficulty: d }),
      })
        .then((r) => (r.ok ? r.json() : Promise.reject(new Error("bad response"))))
        .then((data) => {
          if (data?.problem) setProblem(data.problem);
          else setProblem(generateProblem(a, d));
        })
        .catch(() => {
          // Modo demo: el generador también funciona en el cliente
          setProblem(generateProblem(a, d));
        })
        .finally(() => setLoading(false));
    },
    []
  );

  useEffect(() => {
    generate(area, difficulty);
  }, [area, difficulty, generate]);

  const handleCheck = () => {
    if (!problem || !userAnswer.trim()) return;
    const ok = checkAnswer(problem, userAnswer);
    setFeedback(ok ? "correct" : "incorrect");
    setScore((s) => ({
      correct: s.correct + (ok ? 1 : 0),
      total: s.total + 1,
      streak: ok ? s.streak + 1 : 0,
    }));
    if (!ok) setShowSolution(true);
  };

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            {t("practice.title")}
          </CardTitle>
          <p className="text-sm text-muted-foreground">{t("practice.subtitle")}</p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Selectores */}
          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                {t("practice.area")}
              </label>
              <Select value={area} onChange={(e) => setArea(e.target.value as Area)}>
                <option value="math">{t("common.math")}</option>
                <option value="physics">{t("common.physics")}</option>
              </Select>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground">
                {t("practice.difficulty")}
              </label>
              <Select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as Difficulty)}
              >
                <option value="facil">{t("common.easy")}</option>
                <option value="medio">{t("common.medium")}</option>
                <option value="dificil">{t("common.hard")}</option>
              </Select>
            </div>
          </div>

          {/* Marcador */}
          <div className="grid grid-cols-3 gap-2">
            <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
              <Trophy className="h-4 w-4 text-success" />
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">{t("practice.score")}</p>
                <p className="text-sm font-semibold">
                  {score.correct}/{score.total}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
              <Flame className="h-4 w-4 text-accent" />
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">{t("practice.streak")}</p>
                <p className="text-sm font-semibold">{score.streak}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg bg-secondary/50 px-3 py-2">
              <Target className="h-4 w-4 text-primary" />
              <div>
                <p className="text-[10px] uppercase text-muted-foreground">{t("practice.total")}</p>
                <p className="text-sm font-semibold">{score.total}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Problema */}
      <Card>
        <CardContent className="space-y-4 pt-5">
          {loading || !problem ? (
            <div className="flex items-center justify-center py-10 text-muted-foreground">
              <Spinner className="h-5 w-5 text-primary" />
            </div>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-2">
                <Badge variant="primary">{problem.topicLabel}</Badge>
                <Badge variant="muted">
                  {problem.difficulty === "facil"
                    ? t("common.easy")
                    : problem.difficulty === "medio"
                    ? t("common.medium")
                    : t("common.hard")}
                </Badge>
              </div>

              <p className="text-lg font-medium leading-relaxed">{problem.question}</p>

              {showHint && (
                <p className="flex items-start gap-2 rounded-lg bg-accent/10 p-3 text-sm text-foreground">
                  <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
                  {problem.hint}
                </p>
              )}

              <div className="flex flex-col gap-2 sm:flex-row">
                <Input
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder={t("practice.yourAnswer")}
                  onKeyDown={(e) => e.key === "Enter" && handleCheck()}
                  className="flex-1"
                />
                <Button onClick={handleCheck} disabled={!userAnswer.trim()}>
                  <Check className="h-4 w-4" /> {t("practice.check")}
                </Button>
              </div>

              {/* Feedback */}
              {feedback !== "idle" && (
                <div
                  className={cn(
                    "flex items-center gap-2 rounded-lg p-3 text-sm font-medium",
                    feedback === "correct"
                      ? "bg-success/15 text-success"
                      : "bg-danger/15 text-danger"
                  )}
                >
                  {feedback === "correct" ? (
                    <><Check className="h-4 w-4" /> {t("practice.correct")}</>
                  ) : (
                    <><X className="h-4 w-4" /> {t("practice.incorrect")}. {t("practice.correctWas")}{" "}
                      <span className="font-mono">{problem.answer}{problem.unit ? ` ${problem.unit}` : ""}</span>
                    </>
                  )}
                </div>
              )}

              {/* Solución */}
              {showSolution && (
                <div className="rounded-lg bg-secondary/50 p-3 text-sm">
                  <p className="mb-1 text-xs font-medium text-muted-foreground">
                    {t("practice.showSolution")}
                  </p>
                  <p className="font-mono">{problem.solution}</p>
                </div>
              )}

              {/* Acciones */}
              <div className="flex flex-wrap gap-2 pt-1">
                <Button variant="outline" size="sm" onClick={() => generate(area, difficulty)}>
                  <RefreshCw className="h-3.5 w-3.5" /> {t("practice.newProblem")}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowHint((s) => !s)}>
                  <Lightbulb className="h-3.5 w-3.5" /> {t("practice.hint")}
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setShowSolution((s) => !s)}>
                  {showSolution ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}
                  {showSolution ? t("practice.hideSolution") : t("practice.showSolution")}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setScore({ correct: 0, total: 0, streak: 0 })}
                >
                  {t("practice.resetScore")}
                </Button>
              </div>
            </>
          )}

          {error && <p className="text-xs text-danger">{error}</p>}
        </CardContent>
      </Card>
    </div>
  );
}

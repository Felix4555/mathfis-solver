"use client";

import { useMemo } from "react";
import { evaluate } from "@/lib/solver/expr";
import type { GraphSpec } from "@/lib/solver/types";

const W = 640;
const H = 380;
const PAD = { left: 48, right: 20, top: 20, bottom: 34 };

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.min(
    sorted.length - 1,
    Math.max(0, Math.round((p / 100) * (sorted.length - 1)))
  );
  return sorted[idx];
}

/** Construye los puntos de una función y=x. */
function sampleFunction(fn: string, x0: number, x1: number) {
  const pts: { x: number; y: number }[] = [];
  const N = 360;
  for (let i = 0; i <= N; i++) {
    const x = x0 + ((x1 - x0) * i) / N;
    let y = NaN;
    try {
      y = evaluate(fn, { x });
    } catch {
      y = NaN;
    }
    pts.push({ x, y });
  }
  return pts;
}

function projectilePoints(v0: number, angleDeg: number, g: number) {
  const rad = (angleDeg * Math.PI) / 180;
  const vx = v0 * Math.cos(rad);
  const vy = v0 * Math.sin(rad);
  const tTotal = (2 * vy) / g;
  const pts: { x: number; y: number }[] = [];
  const N = 240;
  for (let i = 0; i <= N; i++) {
    const t = (tTotal * i) / N;
    pts.push({ x: vx * t, y: vy * t - 0.5 * g * t * t });
  }
  return pts;
}

export function Graph({ spec }: { spec: GraphSpec }) {
  const data = useMemo(() => {
    if (spec.type === "function") {
      const pts = sampleFunction(spec.fn, spec.xRange[0], spec.xRange[1]);
      return { pts, x0: spec.xRange[0], x1: spec.xRange[1] };
    }
    if (spec.type === "trajectory") {
      const pts = projectilePoints(spec.v0, spec.angleDeg, spec.g ?? 9.8);
      const xs = pts.map((p) => p.x);
      const ys = pts.map((p) => p.y);
      return {
        pts,
        x0: 0,
        x1: Math.max(...xs) * 1.05,
        y0: 0,
        y1: Math.max(...ys) * 1.1,
      };
    }
    // points
    return {
      pts: spec.points,
      x0: Math.min(...spec.points.map((p) => p.x)),
      x1: Math.max(...spec.points.map((p) => p.x)),
      y0: Math.min(...spec.points.map((p) => p.y)),
      y1: Math.max(...spec.points.map((p) => p.y)),
    } as any;
  }, [spec]);

  const plotted = useMemo(() => {
    const finite = data.pts.filter(
      (p: any) => Number.isFinite(p.y) && Number.isFinite(p.x)
    );
    if (finite.length === 0) return null;

    const ysSorted = finite.map((p: any) => p.y).sort((a: number, b: number) => a - b);
    let y0 = "y0" in data ? (data as any).y0 : percentile(ysSorted, 2);
    let y1 = "y1" in data ? (data as any).y1 : percentile(ysSorted, 98);
    if (spec.type === "function") {
      // Si el eje 0 está dentro del rango visible, inclúyelo para dar contexto
      const yMin = ysSorted[0];
      const yMax = ysSorted[ysSorted.length - 1];
      y0 = Math.max(yMin, percentile(ysSorted, 2));
      y1 = Math.min(yMax, percentile(ysSorted, 98));
      if (y0 > 0) y0 = Math.min(y0, 0);
      if (y1 < 0) y1 = Math.max(y1, 0);
    }
    if (y1 - y0 < 1e-9) {
      y0 -= 1;
      y1 += 1;
    }
    const pad = (y1 - y0) * 0.08;
    y0 -= pad;
    y1 += pad;

    const x0 = (data as any).x0;
    const x1 = (data as any).x1;
    const plotW = W - PAD.left - PAD.right;
    const plotH = H - PAD.top - PAD.bottom;

    const sx = (x: number) => PAD.left + ((x - x0) / (x1 - x0 || 1)) * plotW;
    const sy = (y: number) => PAD.top + ((y1 - y) / (y1 - y0 || 1)) * plotH;

    // Path con saltos en discontinuidades
    let path = "";
    let penDown = false;
    for (const p of data.pts) {
      if (!Number.isFinite(p.y) || !Number.isFinite(p.x)) {
        penDown = false;
        continue;
      }
      const X = sx(p.x);
      const Y = sy(p.y);
      if (Y < -1000 || Y > H + 1000) {
        penDown = false;
        continue;
      }
      path += `${penDown ? "L" : "M"}${X.toFixed(1)} ${Y.toFixed(1)} `;
      penDown = true;
    }

    return { x0, x1, y0, y1, sx, sy, path };
  }, [data, spec]);

  if (!plotted) {
    return (
      <div className="flex h-[200px] items-center justify-center rounded-lg bg-secondary/40 text-sm text-muted-foreground">
        No se puede graficar (dominio no válido).
      </div>
    );
  }

  const { x0, x1, y0, y1, sx, sy, path } = plotted;
  const showXAxis = y0 <= 0 && y1 >= 0;
  const showYAxis = x0 <= 0 && x1 >= 0;

  // Marcas de cuadrícula
  const xTicks = 5;
  const yTicks = 5;

  const label = spec.type === "function" ? spec.label : undefined;

  return (
    <div className="w-full overflow-hidden rounded-lg border border-border bg-card">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Gráfico"
      >
        {/* Fondo */}
        <rect x="0" y="0" width={W} height={H} fill="hsl(var(--card))" />

        {/* Cuadrícula */}
        {Array.from({ length: xTicks + 1 }).map((_, i) => {
          const x = PAD.left + ((W - PAD.left - PAD.right) * i) / xTicks;
          return (
            <line
              key={`gx${i}`}
              x1={x}
              y1={PAD.top}
              x2={x}
              y2={H - PAD.bottom}
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.6"
            />
          );
        })}
        {Array.from({ length: yTicks + 1 }).map((_, i) => {
          const y = PAD.top + ((H - PAD.top - PAD.bottom) * i) / yTicks;
          return (
            <line
              key={`gy${i}`}
              x1={PAD.left}
              y1={y}
              x2={W - PAD.right}
              y2={y}
              stroke="hsl(var(--border))"
              strokeWidth="1"
              opacity="0.6"
            />
          );
        })}

        {/* Ejes */}
        {showXAxis && (
          <line
            x1={PAD.left}
            y1={sy(0)}
            x2={W - PAD.right}
            y2={sy(0)}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="1.5"
          />
        )}
        {showYAxis && (
          <line
            x1={sx(0)}
            y1={PAD.top}
            x2={sx(0)}
            y2={H - PAD.bottom}
            stroke="hsl(var(--muted-foreground))"
            strokeWidth="1.5"
          />
        )}

        {/* Etiquetas de ejes */}
        <text x={W - PAD.right} y={sy(0) - 6} textAnchor="end" fontSize="11" fill="hsl(var(--muted-foreground))">
          x
        </text>
        {showYAxis && (
          <text x={sx(0) + 6} y={PAD.top + 12} fontSize="11" fill="hsl(var(--muted-foreground))">
            y
          </text>
        )}
        <text x={PAD.left} y={H - 12} fontSize="10" fill="hsl(var(--muted-foreground))">
          {x0.toFixed(2)}
        </text>
        <text x={W - PAD.right} y={H - 12} textAnchor="end" fontSize="10" fill="hsl(var(--muted-foreground))">
          {x1.toFixed(2)}
        </text>

        {/* Curva */}
        {spec.type !== "points" && (
          <path
            d={path}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        )}

        {/* Puntos */}
        {spec.type === "points" &&
          spec.points.map((p, i) => (
            <g key={i}>
              <circle
                cx={sx(p.x)}
                cy={sy(p.y)}
                r="4"
                fill="hsl(var(--primary))"
              />
              {p.label && (
                <text
                  x={sx(p.x) + 6}
                  y={sy(p.y) - 6}
                  fontSize="11"
                  fill="hsl(var(--foreground))"
                >
                  {p.label}
                </text>
              )}
            </g>
          ))}

        {/* Etiqueta de la función */}
        {label && (
          <text x={PAD.left + 4} y={PAD.top + 14} fontSize="12" fill="hsl(var(--primary))">
            {label}
          </text>
        )}
      </svg>
    </div>
  );
}

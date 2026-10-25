"use client";

import { useState } from "react";
import { Sigma, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";

/**
 * Paleta de símbolos matemáticos.
 *
 * Un teclado normal no tiene √, π, ², ∫, etc. Estos botones insertan el símbolo
 * en la posición del cursor del editor. Al insertar, se usa una sintaxis que el
 * motor SÍ entiende (p. ej. "x²" se inserta como "^2", "√" como "sqrt()").
 */

interface SymbolDef {
  /** Texto que se ve en el botón (el símbolo "bonito"). */
  label: string;
  /** Texto que se inserta realmente en el editor. */
  insert: string;
  /** Posición del cursor dentro de lo insertado (por defecto, al final). */
  caret?: number;
  /** Descripción emergente. */
  title?: string;
}

interface SymbolGroup {
  name: string;
  items: SymbolDef[];
}

const GROUPS: SymbolGroup[] = [
  {
    name: "Básicos",
    items: [
      { label: "+", insert: " + ", title: "Suma" },
      { label: "−", insert: " - ", title: "Resta" },
      { label: "×", insert: " * ", title: "Multiplicación" },
      { label: "÷", insert: " / ", title: "División" },
      { label: "=", insert: " = ", title: "Igual" },
      { label: "(", insert: "(" },
      { label: ")", insert: ")" },
      { label: "π", insert: "pi", title: "Número pi" },
    ],
  },
  {
    name: "Potencias y raíces",
    items: [
      { label: "x²", insert: "^2", title: "Elevar al cuadrado" },
      { label: "x³", insert: "^3", title: "Elevar al cubo" },
      { label: "xⁿ", insert: "^", title: "Elevar a n" },
      { label: "√", insert: "sqrt()", caret: 5, title: "Raíz cuadrada" },
      { label: "|x|", insert: "abs()", caret: 4, title: "Valor absoluto" },
      { label: "÷", insert: " / ", title: "Fracción (usar paréntesis)" },
    ],
  },
  {
    name: "Funciones",
    items: [
      { label: "sin", insert: "sin()", caret: 4 },
      { label: "cos", insert: "cos()", caret: 4 },
      { label: "tan", insert: "tan()", caret: 4 },
      { label: "ln", insert: "ln()", caret: 3 },
      { label: "log", insert: "log()", caret: 4 },
      { label: "eˣ", insert: "exp()", caret: 4, title: "Exponencial" },
    ],
  },
  {
    name: "Cálculo",
    items: [
      { label: "∫", insert: "integral de ", title: "Integral" },
      { label: "d/dx", insert: "derivada de ", title: "Derivada" },
      { label: "lim", insert: "lim ", title: "Límite" },
      { label: "∑", insert: "∑", title: "Sumatoria" },
      { label: "∏", insert: "∏", title: "Productoria" },
      { label: "∞", insert: "∞", title: "Infinito" },
      { label: "Δ", insert: "Δ", title: "Delta / incremento" },
      { label: "°", insert: "°", title: "Grados" },
    ],
  },
  {
    name: "Comparación y griegas",
    items: [
      { label: "≤", insert: "≤", title: "Menor o igual" },
      { label: "≥", insert: "≥", title: "Mayor o igual" },
      { label: "≠", insert: "≠", title: "Distinto" },
      { label: "≈", insert: "≈", title: "Aproximadamente" },
      { label: "±", insert: "±", title: "Más/menos" },
      { label: "θ", insert: "θ", title: "Theta (ángulo)" },
      { label: "α", insert: "α", title: "Alfa" },
      { label: "β", insert: "β", title: "Beta" },
      { label: "μ", insert: "μ", title: "Mu" },
      { label: "Ω", insert: "Ω", title: "Ohmio" },
    ],
  },
  {
    name: "Unidades",
    items: [
      { label: "m/s", insert: " m/s" },
      { label: "m/s²", insert: " m/s^2" },
      { label: "kg", insert: " kg" },
      { label: "N", insert: " N" },
      { label: "J", insert: " J" },
      { label: "V", insert: " V" },
      { label: "°C", insert: " °C" },
    ],
  },
];

export function MathSymbols({
  onInsert,
  t,
}: {
  onInsert: (insert: string, caret?: number) => void;
  t: (k: string) => string;
}) {
  const [open, setOpen] = useState(true);

  return (
    <div className="rounded-lg border border-border bg-secondary/30">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <span className="flex items-center gap-1.5">
          <Sigma className="h-3.5 w-3.5 text-primary" />
          {t("solver.symbols")}
        </span>
        {open ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
      </button>

      {open && (
        <div className="space-y-2.5 border-t border-border p-3">
          {GROUPS.map((group) => (
            <div key={group.name} className="space-y-1">
              <p className="text-[10px] uppercase tracking-wide text-muted-foreground">
                {group.name}
              </p>
              <div className="flex flex-wrap gap-1">
                {group.items.map((item, i) => (
                  <button
                    key={`${group.name}-${i}`}
                    type="button"
                    title={item.title ?? item.label}
                    onClick={() => onInsert(item.insert, item.caret)}
                    className={cn(
                      "min-w-[28px] rounded-md border border-border bg-card px-2 py-1",
                      "font-mono text-[13px] leading-none text-foreground",
                      "transition-colors hover:border-primary/60 hover:bg-primary/10 hover:text-primary",
                      "active:scale-95"
                    )}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

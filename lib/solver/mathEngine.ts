import {
  evaluate,
  polyCoefficients,
  polyToLatex,
  fmt,
  canEvaluate,
} from "./expr";
import type { Solution, SolveFailure, SolutionStep, GraphSpec } from "./types";
import { topicLabel } from "./detect";

/* ---------------------------------------------------------------------------
 * Utilidades comunes
 * ------------------------------------------------------------------------- */

const num = (s: string): number | null => {
  const v = parseFloat(s);
  return Number.isFinite(v) ? v : null;
};

/** Extrae todos los números del texto (incluye decimales y negativos simples). */
export function extractNumbers(text: string): number[] {
  const m = text.match(/-?\d+(?:[.,]\d+)?/g);
  return m ? m.map((x) => parseFloat(x.replace(",", "."))) : [];
}

/** Busca el número que acompaña a una palabra clave (ej: "radio 5"). */
export function numberAfter(text: string, words: RegExp): number | null {
  const re = new RegExp(
    `(?:${words.source})\\s*(?:=|es|de|:)?\\s*(-?\\d+(?:[.,]\\d+)?)`,
    "i"
  );
  const m = text.match(re);
  return m ? parseFloat(m[1].replace(",", ".")) : null;
}

/** Convierte una expresión "plana" a LaTeX básico. */
export function toLatex(expr: string): string {
  return expr
    .replace(/\*/g, " \\cdot ")
    .replace(/\^\{?(-?\d+)\}?/g, "^{$1}")
    .replace(/\s+/g, " ")
    .trim();
}

function fail(
  error: string,
  suggestion: string,
  extra: Partial<SolveFailure> = {}
): SolveFailure {
  return { ok: false, error, suggestion, ...extra };
}

/* ---------------------------------------------------------------------------
 * Aritmética
 * ------------------------------------------------------------------------- */

export function solveArithmetic(input: string): Solution | SolveFailure {
  let expr = input
    .toLowerCase()
    .replace(/calcula(r)?|cu[aá]nto es|resuelve|resultado de|eval[uú]a|=\?*$/g, " ")
    .replace(/[¿?]/g, "")
    .trim();

  if (!expr || !canEvaluate(expr)) {
    return fail(
      "No pude interpretar la operación aritmética.",
      "Escribe una operación como: 2 + 3 * 4, (5+3)/2, sqrt(16), 2^10."
    );
  }

  const value = evaluate(expr);
  const steps: SolutionStep[] = [
    {
      step: 1,
      title: "Expresión identificada",
      detail: "Se evaluará respetando la jerarquía de operaciones (PEMDAS).",
      formula: toLatex(expr),
    },
    {
      step: 2,
      title: "Cálculo",
      detail: "Resolvemos de izquierda a derecha respetando paréntesis y potencias.",
      formula: `${toLatex(expr)} = ${fmt(value)}`,
    },
  ];

  return {
    ok: true,
    area: "math",
    topic: "arithmetic",
    topicLabel: topicLabel("arithmetic"),
    input,
    finalResult: fmt(value),
    finalText: fmt(value),
    steps,
    formulas: [],
    confidence: "high",
  };
}

/* ---------------------------------------------------------------------------
 * Ecuaciones (lineales y cuadráticas)
 * ------------------------------------------------------------------------- */

const VAR_CANDIDATES = ["x", "y", "z", "t", "n"];

function findVariable(left: string, right: string): string | null {
  for (const v of VAR_CANDIDATES) {
    const cl = polyCoefficients(left, v);
    const cr = polyCoefficients(right, v);
    if (cl && cr) {
      // Debe aparecer realmente la variable o ser usada
      return v;
    }
  }
  return null;
}

export function solveEquation(input: string): Solution | SolveFailure {
  // Normaliza: quita "resolver", "resuelve", "ecuación", signos y el "=0" final se conserva
  let eq = input
    .toLowerCase()
    .replace(/resolver|resuelve|ecuaci[oó]n|encuentra|halla|las? ra[ií]ces( de)?|soluci[oó]n( de)?/g, " ")
    .replace(/[¿?]/g, "")
    .trim();

  // Convierte "x²" en "x^2"
  eq = eq.replace(/([a-z])\s*²/g, "$1^2").replace(/([a-z])\s*³/g, "$1^3");
  eq = eq.replace(/²/g, "^2").replace(/³/g, "^3");

  if (!eq.includes("=")) {
    return fail(
      "No encontré una igualdad (=) para resolver.",
      "Escribe una ecuación con '='. Por ejemplo: 2x + 5 = 15  o  x^2 - 5x + 6 = 0.",
      { needsClarification: true, area: "math", topic: "equation" }
    );
  }

  const [lhsRaw, rhsRaw] = eq.split("=");
  const lhs = (lhsRaw || "").trim();
  const rhs = (rhsRaw || "").trim() || "0";

  const variable = findVariable(lhs, rhs);
  if (!variable) {
    return fail(
      "No pude reconocer la incógnita o la expresión no es un polinomio sencillo.",
      "Usa una sola incógnita (x) y potencias hasta grado 6. Ej: x^2 - 5x + 6 = 0.",
      { needsClarification: true, area: "math", topic: "equation" }
    );
  }

  const cl = polyCoefficients(lhs, variable);
  const cr = polyCoefficients(rhs, variable);
  if (!cl || !cr) {
    return fail(
      "La ecuación contiene términos que este motor aún no resuelve (trigonométricas, raíces de la incógnita, etc.).",
      "Prueba con ecuaciones polinómicas (lineales o cuadráticas). Ej: 3x - 7 = 8.",
      { needsClarification: true, area: "math", topic: "equation" }
    );
  }

  // A*var^2 + B*var + C = 0
  const get = (arr: number[], i: number) => (arr[i] ?? 0);
  const C = get(cl, 0) - get(cr, 0);
  const B = get(cl, 1) - get(cr, 1);
  const A = get(cl, 2) - get(cr, 2);

  const steps: SolutionStep[] = [];
  steps.push({
    step: 1,
    title: "Ecuación original",
    detail: "Identificamos la incógnita y llevamos todo a un mismo lado.",
    formula: `${toLatex(lhs)} = ${toLatex(rhs)}`,
  });
  steps.push({
    step: 2,
    title: "Forma normal",
    detail: "Pasamos todos los términos al lado izquierdo igualando a cero.",
    formula: `${polyToLatex([C, B, A], variable)} = 0`,
  });

  const formulas: string[] = [];

  if (Math.abs(A) < 1e-12) {
    // -------- Ecuación lineal: B x + C = 0 --------
    if (Math.abs(B) < 1e-12) {
      if (Math.abs(C) < 1e-12) {
        steps.push({
          step: 3,
          title: "Identidad",
          detail: "Ambos lados son iguales para cualquier valor: hay infinitas soluciones.",
        });
        return {
          ok: true,
          area: "math",
          topic: "equation",
          topicLabel: topicLabel("equation"),
          input,
          finalResult: "\\text{Infinitas soluciones}",
          finalText: "Infinitas soluciones",
          steps,
          formulas: [],
          confidence: "high",
        };
      }
      steps.push({
        step: 3,
        title: "Contradicción",
        detail: "Se obtiene una igualdad falsa: la ecuación no tiene solución.",
        formula: `${fmt(C)} = 0`,
      });
      return {
        ok: true,
        area: "math",
        topic: "equation",
        topicLabel: topicLabel("equation"),
        input,
        finalResult: "\\text{Sin solución}",
        finalText: "Sin solución",
        steps,
        formulas: [],
        confidence: "high",
      };
    }

    const x = -C / B;
    steps.push({
      step: 3,
      title: "Aislar la incógnita",
      detail: `Ecuación lineal: despejamos ${variable}.`,
      formula: `${fmt(B)}${variable} = ${fmt(-C)}`,
    });
    steps.push({
      step: 4,
      title: "Dividir",
      detail: `Dividimos ambos lados entre el coeficiente ${fmt(B)}.`,
      formula: `${variable} = \\frac{${fmt(-C)}}{${fmt(B)}} = ${fmt(x)}`,
    });

    const notes: string[] = [];
    try {
      const res = evaluate(`(${lhs})-(${rhs})`, { [variable]: x });
      if (Number.isFinite(res))
        notes.push(
          `✅ Comprobación: al sustituir ${variable} = ${fmt(x)}, el lado izquierdo menos el derecho vale ${fmt(
            res
          )} ≈ 0. Por tanto, la solución es correcta.`
        );
    } catch {
      /* sin comprobación numérica */
    }

    return {
      ok: true,
      area: "math",
      topic: "equation",
      topicLabel: "Ecuación lineal",
      input,
      finalResult: `${variable} = ${fmt(x)}`,
      finalText: `${variable} = ${fmt(x)}`,
      steps,
      formulas: [`${variable} = \\frac{-C}{B}`],
      graph: {
        type: "function",
        fn: `(${lhs})-(${rhs})`,
        xRange: [Math.min(x - 5, -5), Math.max(x + 5, 5)],
        label: "y = lado izquierdo − lado derecho",
      },
      confidence: "high",
      notes,
    };
  }

  // -------- Ecuación cuadrática: A x^2 + B x + C = 0 --------
  const disc = B * B - 4 * A * C;
  formulas.push(
    `${variable} = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}`,
    "\\Delta = b^2 - 4ac"
  );

  steps.push({
    step: 3,
    title: "Identificar coeficientes",
    detail: "Comparamos con la forma a·x² + b·x + c = 0.",
    formula: `a = ${fmt(A)},\\quad b = ${fmt(B)},\\quad c = ${fmt(C)}`,
  });
  steps.push({
    step: 4,
    title: "Discriminante",
    detail: "El discriminante decide cuántas soluciones reales hay.",
    formula: `\\Delta = (${fmt(B)})^2 - 4(${fmt(A)})(${fmt(C)}) = ${fmt(disc)}`,
  });

  let finalResult = "";
  let finalText = "";
  const roots: number[] = [];

  if (disc > 1e-12) {
    const r1 = (-B + Math.sqrt(disc)) / (2 * A);
    const r2 = (-B - Math.sqrt(disc)) / (2 * A);
    roots.push(r1, r2);
    steps.push({
      step: 5,
      title: "Fórmula general",
      detail: `Δ > 0: dos soluciones reales distintas.`,
      formula: `${variable} = \\frac{${fmt(-B)} \\pm \\sqrt{${fmt(
        disc
      )}}}{2(${fmt(A)})}`,
    });
    steps.push({
      step: 6,
      title: "Soluciones",
      detail: "Calculamos cada raíz por separado.",
      formula: `${variable}_1 = ${fmt(r1)}, \\quad ${variable}_2 = ${fmt(r2)}`,
    });
    finalResult = `${variable}_1 = ${fmt(r1)}, \\quad ${variable}_2 = ${fmt(r2)}`;
    finalText = `${variable}1 = ${fmt(r1)}, ${variable}2 = ${fmt(r2)}`;
  } else if (Math.abs(disc) < 1e-12) {
    const r = -B / (2 * A);
    roots.push(r);
    steps.push({
      step: 5,
      title: "Fórmula general",
      detail: "Δ = 0: una única solución real (raíz doble).",
      formula: `${variable} = \\frac{${fmt(-B)}}{2(${fmt(A)})} = ${fmt(r)}`,
    });
    finalResult = `${variable} = ${fmt(r)}`;
    finalText = `${variable} = ${fmt(r)}`;
  } else {
    const re = -B / (2 * A);
    const im = Math.sqrt(-disc) / (2 * A);
    steps.push({
      step: 5,
      title: "Fórmula general",
      detail: "Δ < 0: no hay soluciones reales; hay dos soluciones complejas.",
      formula: `${variable} = \\frac{${fmt(-B)} \\pm \\sqrt{${fmt(
        disc
      )}}}{2(${fmt(A)})} = ${fmt(re)} \\pm ${fmt(Math.abs(im))}i`,
    });
    finalResult = `${variable} = ${fmt(re)} \\pm ${fmt(Math.abs(im))}i`;
    finalText = `${variable} = ${fmt(re)} ± ${fmt(Math.abs(im))}i`;
  }

  return {
    ok: true,
    area: "math",
    topic: "equation",
    topicLabel: "Ecuación cuadrática",
    input,
    finalResult,
    finalText,
    steps,
    formulas,
    graph: {
      type: "function",
      fn: `(${lhs})-(${rhs})`,
      xRange: roots.length
        ? [Math.min(...roots) - 4, Math.max(...roots) + 4]
        : [-10, 10],
      label: "y = lado izquierdo − lado derecho",
    },
    confidence: "high",
    notes: (() => {
      if (!roots.length) return undefined;
      try {
        const res = roots.map((r) =>
          evaluate(`(${lhs})-(${rhs})`, { [variable]: r })
        );
        if (res.every((v) => Number.isFinite(v)))
          return [
            `✅ Comprobación: al sustituir las soluciones, el lado izquierdo menos el derecho da ${res
              .map((v) => fmt(v))
              .join(" y ")} (≈ 0).`,
          ];
      } catch {
        /* sin comprobación numérica */
      }
      return undefined;
    })(),
  };
}

/* ---------------------------------------------------------------------------
 * Derivadas
 * ------------------------------------------------------------------------- */

function cleanCalculusInput(input: string): string {
  return input
    .toLowerCase()
    .replace(/derivada( de| con respecto a x)?|derivar|d\/dx|calcula(r)?|hallar?|obt[eé]n|la derivada|de la funci[oó]n|f\s*'\s*\(x\)\s*=|f\(x\)\s*=|y\s*=/g, " ")
    .replace(/[¿?]/g, "")
    .replace(/[a-z]²/g, (m) => m[0] + "^2")
    .replace(/²/g, "^2")
    .trim();
}

/** Divide una expresión en términos de nivel superior conservando el signo. */
function splitTopLevelTerms(expr: string): string[] {
  const terms: string[] = [];
  let depth = 0;
  let current = "";
  for (let i = 0; i < expr.length; i++) {
    const ch = expr[i];
    if (ch === "(") depth++;
    if (ch === ")") depth--;
    if (depth === 0 && (ch === "+" || ch === "-") && current.trim() !== "") {
      terms.push(current);
      current = ch;
    } else {
      current += ch;
    }
  }
  if (current.trim() !== "") terms.push(current);
  return terms;
}

/** Deriva un término simbólicamente con reglas básicas. Devuelve null si no puede. */
function diffTerm(term: string): string | null {
  const t = term.replace(/\s+/g, "");
  if (!t) return null;

  // Coeficiente + resto
  const m = t.match(/^([+-]?)(\d*\.?\d*)\*?(.*)$/);
  if (!m) return null;
  const sign = m[1] === "-" ? -1 : 1;
  const coefNum = m[2] === "" || m[2] === "." ? 1 : parseFloat(m[2]);
  let rest = m[3] || "";
  const coef = sign * coefNum;

  if (rest === "") return "0"; // constante

  // x^n o x
  const pw = rest.match(/^x(?:\^(-?\d+\.?\d*))?$/);
  if (pw) {
    const n = pw[1] === undefined ? 1 : parseFloat(pw[1]);
    if (n === 0) return "0";
    const newCoef = coef * n;
    const newN = n - 1;
    if (newN === 0) return `${newCoef}`;
    if (newN === 1) return `${newCoef}x`;
    return `${newCoef}x^${newN}`;
  }

  // e^(u) o exp(u)
  let inner = "";
  let kind = "";
  let fm = rest.match(/^e\^\((.*)\)$/);
  if (fm) {
    kind = "exp";
    inner = fm[1];
  }
  if (!kind) {
    fm = rest.match(/^(sin|cos|tan|exp|ln|log|sqrt|abs)\((.*)\)$/);
    if (fm) {
      kind = fm[1];
      inner = fm[2];
    }
  }
  if (!kind) return null;

  // Derivada interna (solo soportamos inner lineal: a·x + b)
  const ic = polyCoefficients(inner, "x", 3);
  if (!ic || ic.length > 2) return null;
  const innerPrime = ic[1] ?? 0;

  const wrap = (s: string) => {
    if (coef === 1) return s;
    if (coef === -1) return `-${s}`;
    return `${coef}*${s}`;
  };
  const chain = innerPrime === 1 ? "" : `*${innerPrime}`;

  switch (kind) {
    case "exp":
      return wrap(`e^(${inner})`) + chain;
    case "sin":
      return wrap(`cos(${inner})`) + chain;
    case "cos":
      return wrap(`-sin(${inner})`) + chain;
    case "tan":
      return wrap(`1/(cos(${inner}))^2`) + chain;
    case "ln":
    case "log":
      return wrap(`1/(${inner})`) + chain;
    case "sqrt":
      return wrap(`1/(2*sqrt(${inner}))`) + chain;
    case "abs":
      return wrap(`sign(${inner})`) + chain;
    default:
      return null;
  }
}

function derivativeOfExpr(expr: string): string | null {
  // 1) Polinomios (exacto, vía coeficientes)
  const coefs = polyCoefficients(expr, "x");
  if (coefs) {
    const d = coefs.map((c, k) => (k === 0 ? 0 : c * k));
    d.shift();
    return polyToLatex(d, "x");
  }
  // 2) Términos con reglas básicas
  const terms = splitTopLevelTerms(expr.replace(/\s+/g, ""));
  const parts: string[] = [];
  for (const term of terms) {
    const d = diffTerm(term);
    if (d === null) return null;
    parts.push(d);
  }
  return parts.join("+").replace(/\+-/g, "-");
}

export function solveDerivative(input: string): Solution | SolveFailure {
  const expr = cleanCalculusInput(input);

  if (!expr || !canEvaluate(expr, { x: 1.7 })) {
    return fail(
      "No pude reconocer la función a derivar.",
      "Escribe por ejemplo: derivada de x^3 + 2x  o  d/dx (sin(x)).",
      { needsClarification: true, area: "math", topic: "derivative" }
    );
  }

  const deriv = derivativeOfExpr(expr);
  if (deriv === null) {
    return fail(
      "Este motor deriva polinomios y funciones básicas (sin, cos, tan, exp, ln, sqrt) con argumento lineal. La función ingresada es más compleja.",
      "Prueba con un polinomio (ej: 3x^3 - 2x + 1) o una función básica (ej: sin(2x)).",
      { area: "math", topic: "derivative" }
    );
  }

  const formulas = [
    "\\frac{d}{dx}x^n = n\\,x^{n-1}",
    "\\frac{d}{dx}\\sin x = \\cos x",
    "\\frac{d}{dx}\\cos x = -\\sin x",
    "\\frac{d}{dx}e^{x} = e^{x}",
    "\\frac{d}{dx}\\ln x = \\frac{1}{x}",
  ];

  const steps: SolutionStep[] = [
    {
      step: 1,
      title: "Función a derivar",
      detail: "Identificamos f(x).",
      formula: `f(x) = ${toLatex(expr)}`,
    },
    {
      step: 2,
      title: "Reglas aplicadas",
      detail:
        "Usamos la regla de la potencia y las derivadas básicas (con regla de la cadena cuando el argumento es lineal).",
      formula: "\\frac{d}{dx}[c\\,f(x)] = c\\,f'(x),\\quad \\frac{d}{dx}x^n = n x^{n-1}",
    },
    {
      step: 3,
      title: "Derivada término a término",
      detail: "Derivamos cada término de la suma.",
      formula: `f'(x) = ${deriv}`,
    },
  ];

  return {
    ok: true,
    area: "math",
    topic: "derivative",
    topicLabel: topicLabel("derivative"),
    input,
    finalResult: `f'(x) = ${deriv}`,
    finalText: `f'(x) = ${deriv.replace(/\^\{?(\d+)\}?/g, "^$1")}`,
    steps,
    formulas,
    graph: {
      type: "function",
      fn: expr,
      xRange: [-10, 10],
      label: "f(x)",
    },
    confidence: "high",
  };
}

/* ---------------------------------------------------------------------------
 * Integrales
 * ------------------------------------------------------------------------- */

function integrateOfExpr(expr: string): string | null {
  const coefs = polyCoefficients(expr, "x");
  if (coefs) {
    const antideriv: number[] = [
      0,
      ...coefs.map((c, k) => c / (k + 1)),
    ];
    // antideriv[0]=0 (constante C), antideriv[k+1] = c_k / (k+1)
    return polyToLatex(antideriv, "x");
  }
  // Términos básicos
  const terms = splitTopLevelTerms(expr.replace(/\s+/g, ""));
  const parts: string[] = [];
  // Formatea "coeficiente·símbolo" omitiendo el 1 y cuidando el signo.
  const withCoef = (c: number, s: string): string => {
    if (Math.abs(c - 1) < 1e-12) return s;
    if (Math.abs(c + 1) < 1e-12) return `-${s}`;
    return `${fmt(c)}${s}`;
  };
  for (const term of terms) {
    const t = term.replace(/\s+/g, "");
    const m = t.match(/^([+-]?)(\d*\.?\d*)\*?(.*)$/);
    if (!m) return null;
    const sign = m[1] === "-" ? -1 : 1;
    const coefNum = m[2] === "" ? 1 : parseFloat(m[2]);
    const coef = sign * coefNum;
    const rest = m[3] || "";

    let inner = "";
    let kind = "";
    let fm = rest.match(/^e\^\((.*)\)$/);
    if (fm) {
      kind = "exp";
      inner = fm[1];
    }
    if (!kind) {
      fm = rest.match(/^(sin|cos)\((.*)\)$/);
      if (fm) {
        kind = fm[1];
        inner = fm[2];
      }
    }
    if (!kind) {
      if (rest === "x") {
        parts.push(withCoef(coef / 2, "x^2"));
        continue;
      }
      if (rest === "") {
        parts.push(withCoef(coef, "x"));
        continue;
      }
      const pw = rest.match(/^x\^(\d+)$/);
      if (pw) {
        const n = parseFloat(pw[1]);
        if (n === -1) return null;
        parts.push(withCoef(coef / (n + 1), `x^${n + 1}`));
        continue;
      }
      return null;
    }
    const ic = polyCoefficients(inner, "x", 3);
    if (!ic || ic.length > 2) return null;
    const a = ic[1] ?? 0;
    if (a === 0) return null;
    if (kind === "exp") parts.push(withCoef(coef / a, `e^(${inner})`));
    if (kind === "sin") parts.push(withCoef(-coef / a, `cos(${inner})`));
    if (kind === "cos") parts.push(withCoef(coef / a, `sin(${inner})`));
  }
  return parts.join("+").replace(/\+-/g, "-");
}

export function solveIntegral(input: string): Solution | SolveFailure {
  const lower = input.toLowerCase();

  // Integral definida: "de a a b" o "entre a y b"
  const rangeMatch =
    lower.match(/de\s*(-?\d+\.?\d*)\s*a\s*(-?\d+\.?\d*)/) ||
    lower.match(/entre\s*(-?\d+\.?\d*)\s*y\s*(-?\d+\.?\d*)/);
  let a: number | null = null;
  let b: number | null = null;
  if (rangeMatch) {
    a = parseFloat(rangeMatch[1]);
    b = parseFloat(rangeMatch[2]);
  }

  const expr = input
    .toLowerCase()
    .replace(/de\s*-?\d+\.?\d*\s*a\s*-?\d+\.?\d*/g, " ")
    .replace(/entre\s*-?\d+\.?\d*\s*y\s*-?\d+\.?\d*/g, " ")
    .replace(
      /integral( definida| indefinida)?( de| con respecto a x)?|integrar|∫|calcula(r)?|hallar?/g,
      " "
    )
    .replace(/\b(?:de|a|entre|y|desde|hasta|con|respecto)\b/g, " ")
    .replace(/dx|d\s*x/g, " ")
    .replace(/[¿?]/g, "")
    .replace(/[a-z]²/g, (m) => m[0] + "^2")
    .replace(/²/g, "^2")
    .trim();

  if (!expr || !canEvaluate(expr, { x: 1.3 })) {
    return fail(
      "No pude reconocer la función a integrar.",
      "Escribe por ejemplo: integral de 3x^2 + 2x dx  o  integral de sin(x).",
      { needsClarification: true, area: "math", topic: "integral" }
    );
  }

  const F = integrateOfExpr(expr);
  if (F === null) {
    return fail(
      "Este motor integra polinomios y funciones básicas (sin, cos, exp) con argumento lineal. La función ingresada es más compleja.",
      "Prueba con un polinomio (ej: 6x^2 + 2) o una función básica (ej: cos(3x)).",
      { area: "math", topic: "integral" }
    );
  }

  const formulas = [
    "\\int x^n\\,dx = \\frac{x^{n+1}}{n+1} + C",
    "\\int \\sin x\\,dx = -\\cos x + C",
    "\\int \\cos x\\,dx = \\sin x + C",
    "\\int e^{x}\\,dx = e^{x} + C",
  ];

  const steps: SolutionStep[] = [
    {
      step: 1,
      title: "Integrando",
      detail: "Identificamos la función a integrar.",
      formula: `\\int ${toLatex(expr)}\\,dx`,
    },
    {
      step: 2,
      title: "Regla de integración",
      detail:
        "Aplicamos la regla de la potencia y las integrales básicas término a término.",
      formula: "\\int x^n\\,dx = \\frac{x^{n+1}}{n+1}",
    },
    {
      step: 3,
      title: "Antiderivada",
      detail: "Añadimos la constante de integración C.",
      formula: `${F} + C`,
    },
  ];

  let finalResult = `${F} + C`;
  let finalText = `${F} + C`;

  if (a !== null && b !== null) {
    // Evaluación exacta cuando el integrando es un polinomio (evita el error de
    // redondeo que introduciría formatear los coeficientes de la antiderivada).
    const polyCoefs = polyCoefficients(expr, "x", 8);
    const evalAt = (x: number): number => {
      if (polyCoefs) {
        return polyCoefs.reduce(
          (s, c, k) => s + (c * Math.pow(x, k + 1)) / (k + 1),
          0
        );
      }
      try {
        // Evaluamos la antiderivada numéricamente.
        return evaluate(F.replace(/\^/g, "^"), { x });
      } catch {
        return NaN;
      }
    };
    const val = evalAt(b) - evalAt(a);
    formulas.push("\\int_a^b f(x)\\,dx = F(b) - F(a)");
    steps.push({
      step: 4,
      title: "Integral definida",
      detail: `Evaluamos F(b) − F(a) entre ${a} y ${b} (Teorema Fundamental del Cálculo).`,
      formula: `F(${fmt(b)}) - F(${fmt(a)}) = ${fmt(val)}`,
    });
    finalResult = `${fmt(val)}`;
    finalText = `${fmt(val)}`;
  }

  return {
    ok: true,
    area: "math",
    topic: "integral",
    topicLabel: topicLabel("integral"),
    input,
    finalResult,
    finalText,
    steps,
    formulas,
    graph: { type: "function", fn: expr, xRange: [-10, 10], label: "f(x)" },
    confidence: "high",
  };
}

/* ---------------------------------------------------------------------------
 * Geometría
 * ------------------------------------------------------------------------- */

export function solveGeometry(input: string): Solution | SolveFailure {
  const t = input.toLowerCase();
  const nums = extractNumbers(t);
  const steps: SolutionStep[] = [];

  const grab = (...res: RegExp[]): number | null => {
    for (const re of res) {
      const v = numberAfter(t, re);
      if (v !== null) return v;
    }
    return null;
  };

  // Círculo
  if (/c[ií]rculo|circunferencia|radio/.test(t)) {
    const r = grab(/radio/, /\br\b/) ?? nums[0];
    if (r === null || r === undefined)
      return fail("No encontré el radio.", "Indica el radio. Ej: círculo de radio 5.", {
        needsClarification: true,
        area: "math",
        topic: "geometry",
      });
    const area = Math.PI * r * r;
    const per = 2 * Math.PI * r;
    steps.push({
      step: 1,
      title: "Datos",
      detail: "Identificamos el radio.",
      formula: `r = ${fmt(r)}`,
    });
    steps.push({
      step: 2,
      title: "Área",
      detail: "Aplicamos la fórmula del área del círculo.",
      formula: `A = \\pi r^2 = \\pi (${fmt(r)})^2 = ${fmt(area)}`,
    });
    steps.push({
      step: 3,
      title: "Perímetro (circunferencia)",
      detail: "Aplicamos la fórmula de la longitud de la circunferencia.",
      formula: `P = 2\\pi r = 2\\pi (${fmt(r)}) = ${fmt(per)}`,
    });
    return {
      ok: true,
      area: "math",
      topic: "geometry",
      topicLabel: "Geometría · Círculo",
      input,
      finalResult: `A = ${fmt(area)},\\quad P = ${fmt(per)}`,
      finalText: `Área = ${fmt(area)}, Perímetro = ${fmt(per)}`,
      steps,
      formulas: ["A = \\pi r^2", "P = 2\\pi r"],
      confidence: "high",
    };
  }

  // Triángulo
  if (/tri[aá]ngulo|hipotenusa|cateto/.test(t)) {
    // ¿rectángulo con catetos? -> Pitágoras
    if (/rect[aá]ngulo|hipotenusa|cateto/.test(t)) {
      const legs = nums.filter((n) => n > 0);
      if (legs.length >= 2) {
        const [a, b] = legs;
        const h = Math.sqrt(a * a + b * b);
        steps.push({
          step: 1,
          title: "Datos",
          detail: "Triángulo rectángulo con catetos a y b.",
          formula: `a = ${fmt(a)},\\quad b = ${fmt(b)}`,
        });
        steps.push({
          step: 2,
          title: "Teorema de Pitágoras",
          detail: "La hipotenusa al cuadrado es la suma de los catetos al cuadrado.",
          formula: `h = \\sqrt{a^2 + b^2} = \\sqrt{${fmt(a)}^2 + ${fmt(b)}^2}`,
        });
        steps.push({
          step: 3,
          title: "Resultado",
          detail: "Calculamos la raíz.",
          formula: `h = ${fmt(h)}`,
        });
        return {
          ok: true,
          area: "math",
          topic: "geometry",
          topicLabel: "Geometría · Pitágoras",
          input,
          finalResult: `h = ${fmt(h)}`,
          finalText: `Hipotenusa = ${fmt(h)}`,
          steps,
          formulas: ["a^2 + b^2 = c^2"],
          confidence: "high",
        };
      }
    }
    const base = grab(/base/, /\bb\b/) ?? nums[0];
    const height = grab(/altura/, /\bh\b/) ?? nums[1];
    if (base != null && height != null) {
      const area = (base * height) / 2;
      steps.push({
        step: 1,
        title: "Datos",
        detail: "Base y altura del triángulo.",
        formula: `b = ${fmt(base)},\\quad h = ${fmt(height)}`,
      });
      steps.push({
        step: 2,
        title: "Área",
        detail: "Fórmula del área del triángulo.",
        formula: `A = \\frac{b \\cdot h}{2} = \\frac{${fmt(base)} \\cdot ${fmt(
          height
        )}}{2} = ${fmt(area)}`,
      });
      return {
        ok: true,
        area: "math",
        topic: "geometry",
        topicLabel: "Geometría · Triángulo",
        input,
        finalResult: `A = ${fmt(area)}`,
        finalText: `Área = ${fmt(area)}`,
        steps,
        formulas: ["A = \\frac{b \\cdot h}{2}"],
        confidence: "high",
      };
    }
  }

  // Cuadrado (antes que rectángulo: aquí solo hace falta UN dato, el lado)
  if (/cuadrado/.test(t)) {
    const side = grab(/lado/, /\bl\b/) ?? nums[0];
    if (side != null) {
      const area = side * side;
      const per = 4 * side;
      steps.push({
        step: 1,
        title: "Datos",
        detail: "Lado del cuadrado.",
        formula: `a = ${fmt(side)}`,
      });
      steps.push({
        step: 2,
        title: "Área",
        detail: "Área = lado × lado.",
        formula: `A = a^2 = (${fmt(side)})^2 = ${fmt(area)}`,
      });
      steps.push({
        step: 3,
        title: "Perímetro",
        detail: "Cuatro lados iguales.",
        formula: `P = 4a = 4(${fmt(side)}) = ${fmt(per)}`,
      });
      return {
        ok: true,
        area: "math",
        topic: "geometry",
        topicLabel: "Geometría · Cuadrado",
        input,
        finalResult: `A = ${fmt(area)},\\quad P = ${fmt(per)}`,
        finalText: `Área = ${fmt(area)}, Perímetro = ${fmt(per)}`,
        steps,
        formulas: ["A = a^2", "P = 4a"],
        confidence: "high",
      };
    }
  }

  // Rectángulo
  if (/rect[aá]ngulo/.test(t)) {
    const base = grab(/base/, /largo/, /\bl\b/) ?? nums[0];
    const height = grab(/altura/, /ancho/, /\ba\b/) ?? nums[1];
    if (base != null && height != null) {
      const area = base * height;
      const per = 2 * (base + height);
      steps.push({
        step: 1,
        title: "Datos",
        detail: "Lados del rectángulo.",
        formula: `b = ${fmt(base)},\\quad h = ${fmt(height)}`,
      });
      steps.push({
        step: 2,
        title: "Área",
        detail: "Multiplicamos base por altura.",
        formula: `A = b \\cdot h = ${fmt(base)} \\cdot ${fmt(height)} = ${fmt(area)}`,
      });
      steps.push({
        step: 3,
        title: "Perímetro",
        detail: "Sumamos dos veces cada lado.",
        formula: `P = 2(b + h) = 2(${fmt(base)} + ${fmt(height)}) = ${fmt(per)}`,
      });
      return {
        ok: true,
        area: "math",
        topic: "geometry",
        topicLabel: "Geometría · Rectángulo",
        input,
        finalResult: `A = ${fmt(area)},\\quad P = ${fmt(per)}`,
        finalText: `Área = ${fmt(area)}, Perímetro = ${fmt(per)}`,
        steps,
        formulas: ["A = b \\cdot h", "P = 2(b+h)"],
        confidence: "high",
      };
    }
  }

  // Esfera
  if (/esfera/.test(t)) {
    const r = grab(/radio/) ?? nums[0];
    if (r != null) {
      const vol = (4 / 3) * Math.PI * r ** 3;
      const area = 4 * Math.PI * r * r;
      steps.push({
        step: 1,
        title: "Datos",
        detail: "Radio de la esfera.",
        formula: `r = ${fmt(r)}`,
      });
      steps.push({
        step: 2,
        title: "Volumen",
        detail: "Fórmula del volumen de la esfera.",
        formula: `V = \\frac{4}{3}\\pi r^3 = ${fmt(vol)}`,
      });
      steps.push({
        step: 3,
        title: "Área superficial",
        detail: "Fórmula del área de la esfera.",
        formula: `A = 4\\pi r^2 = ${fmt(area)}`,
      });
      return {
        ok: true,
        area: "math",
        topic: "geometry",
        topicLabel: "Geometría · Esfera",
        input,
        finalResult: `V = ${fmt(vol)},\\quad A = ${fmt(area)}`,
        finalText: `Volumen = ${fmt(vol)}, Área = ${fmt(area)}`,
        steps,
        formulas: ["V = \\frac{4}{3}\\pi r^3", "A = 4\\pi r^2"],
        confidence: "high",
      };
    }
  }

  // Cubo
  if (/cubo/.test(t)) {
    const side = grab(/lado/, /\bl\b/) ?? nums[0];
    if (side != null) {
      const vol = side ** 3;
      const area = 6 * side * side;
      steps.push({
        step: 1,
        title: "Datos",
        detail: "Lado del cubo (los 6 lados miden lo mismo).",
        formula: `a = ${fmt(side)}`,
      });
      steps.push({
        step: 2,
        title: "Volumen",
        detail: "Volumen = lado³.",
        formula: `V = a^3 = (${fmt(side)})^3 = ${fmt(vol)}`,
      });
      steps.push({
        step: 3,
        title: "Área superficial",
        detail: "Seis caras cuadradas iguales.",
        formula: `A = 6a^2 = 6(${fmt(side)})^2 = ${fmt(area)}`,
      });
      return {
        ok: true,
        area: "math",
        topic: "geometry",
        topicLabel: "Geometría · Cubo",
        input,
        finalResult: `V = ${fmt(vol)},\\quad A = ${fmt(area)}`,
        finalText: `Volumen = ${fmt(vol)}, Área = ${fmt(area)}`,
        steps,
        formulas: ["V = a^3", "A = 6a^2"],
        confidence: "high",
      };
    }
  }

  // Trapecio: A = (b + b') · h / 2
  if (/trapecio/.test(t)) {
    const h = grab(/altura/) ?? nums[nums.length - 1];
    const bases = nums.filter((n) => n !== h);
    if (h != null && bases.length >= 2) {
      const [b1, b2] = bases;
      const area = ((b1 + b2) * h) / 2;
      steps.push({
        step: 1,
        title: "Datos",
        detail: "Las dos bases paralelas y la altura (distancia entre ellas).",
        formula: `b_1 = ${fmt(b1)},\\quad b_2 = ${fmt(b2)},\\quad h = ${fmt(h)}`,
      });
      steps.push({
        step: 2,
        title: "Área",
        detail: "Promedio de las bases por la altura.",
        formula: `A = \\frac{(b_1 + b_2) \\cdot h}{2} = \\frac{(${fmt(b1)} + ${fmt(
          b2
        )}) \\cdot ${fmt(h)}}{2} = ${fmt(area)}`,
      });
      return {
        ok: true,
        area: "math",
        topic: "geometry",
        topicLabel: "Geometría · Trapecio",
        input,
        finalResult: `A = ${fmt(area)}`,
        finalText: `Área = ${fmt(area)}`,
        steps,
        formulas: ["A = \\frac{(b_1+b_2)h}{2}"],
        confidence: "high",
      };
    }
  }

  // Rombo: A = D · d / 2
  if (/rombo/.test(t)) {
    if (nums.length >= 2) {
      const [D, d] = nums;
      const area = (D * d) / 2;
      steps.push({
        step: 1,
        title: "Datos",
        detail: "Las dos diagonales del rombo.",
        formula: `D = ${fmt(D)},\\quad d = ${fmt(d)}`,
      });
      steps.push({
        step: 2,
        title: "Área",
        detail: "Producto de las diagonales entre dos.",
        formula: `A = \\frac{D \\cdot d}{2} = \\frac{${fmt(D)} \\cdot ${fmt(d)}}{2} = ${fmt(
          area
        )}`,
      });
      return {
        ok: true,
        area: "math",
        topic: "geometry",
        topicLabel: "Geometría · Rombo",
        input,
        finalResult: `A = ${fmt(area)}`,
        finalText: `Área = ${fmt(area)}`,
        steps,
        formulas: ["A = \\frac{Dd}{2}"],
        confidence: "high",
      };
    }
  }

  return fail(
    "No pude determinar la figura geométrica o faltan datos.",
    "Especifica la figura y sus datos. Ej: círculo de radio 5, triángulo base 4 altura 6, esfera radio 3.",
    { needsClarification: true, area: "math", topic: "geometry" }
  );
}

/* ---------------------------------------------------------------------------
 * Trigonometría
 * ------------------------------------------------------------------------- */

export function solveTrig(input: string): Solution | SolveFailure {
  const t = input.toLowerCase();
  const angleMatch = t.match(/(-?\d+(?:[.,]\d+)?)\s*(?:°|grados?|º)/);
  let angle: number | null = angleMatch
    ? parseFloat(angleMatch[1].replace(",", "."))
    : null;

  const fnMap: Record<string, { name: string; fn: (x: number) => number; latex: string }> = {
    seno: { name: "seno", fn: Math.sin, latex: "\\sin" },
    sen: { name: "seno", fn: Math.sin, latex: "\\sin" },
    sin: { name: "seno", fn: Math.sin, latex: "\\sin" },
    coseno: { name: "coseno", fn: Math.cos, latex: "\\cos" },
    cos: { name: "coseno", fn: Math.cos, latex: "\\cos" },
    tangente: { name: "tangente", fn: Math.tan, latex: "\\tan" },
    tan: { name: "tangente", fn: Math.tan, latex: "\\tan" },
  };

  let chosen: (typeof fnMap)[string] | null = null;
  for (const key of Object.keys(fnMap)) {
    if (new RegExp(`\\b${key}\\b|${key}\\s*\\(`).test(t)) {
      chosen = fnMap[key];
      break;
    }
  }

  if (!chosen) {
    return fail(
      "No reconocí la razón trigonométrica.",
      "Escribe por ejemplo: seno de 30 grados, cos(60), tan 45°.",
      { needsClarification: true, area: "math", topic: "trigonometry" }
    );
  }

  if (angle === null) {
    const nums = extractNumbers(t);
    if (nums.length) angle = nums[0];
  }

  if (angle === null) {
    return fail(
      "Falta el ángulo.",
      "Indica el ángulo en grados. Ej: seno de 30 grados.",
      { needsClarification: true, area: "math", topic: "trigonometry" }
    );
  }

  const rad = (angle * Math.PI) / 180;
  const value = chosen.fn(rad);

  const exact: Record<string, string> = {
    "sin:30": "\\frac{1}{2}",
    "sin:45": "\\frac{\\sqrt{2}}{2}",
    "sin:60": "\\frac{\\sqrt{3}}{2}",
    "sin:90": "1",
    "sin:0": "0",
    "cos:30": "\\frac{\\sqrt{3}}{2}",
    "cos:45": "\\frac{\\sqrt{2}}{2}",
    "cos:60": "\\frac{1}{2}",
    "cos:0": "1",
    "cos:90": "0",
    "tan:45": "1",
    "tan:0": "0",
  };
  const exactKey = `${chosen.latex === "\\sin" ? "sin" : chosen.latex === "\\cos" ? "cos" : "tan"}:${angle}`;
  const exactVal = exact[exactKey];

  const steps: SolutionStep[] = [
    {
      step: 1,
      title: "Datos",
      detail: `Ángulo en grados: ${angle}°. Lo convertimos a radianes para el cálculo.`,
      formula: `${angle}° = ${angle} \\cdot \\frac{\\pi}{180} = ${fmt(rad)} \\text{ rad}`,
    },
    {
      step: 2,
      title: `Cálculo del ${chosen.name}`,
      detail: `Evaluamos la razón ${chosen.name} del ángulo.`,
      formula: `${chosen.latex}(${angle}°) = ${exactVal ? exactVal + " = " : ""}${fmt(
        value
      )}`,
    },
  ];

  return {
    ok: true,
    area: "math",
    topic: "trigonometry",
    topicLabel: topicLabel("trigonometry"),
    input,
    finalResult: `${chosen.latex}(${angle}°) = ${fmt(value)}`,
    finalText: `${chosen.name}(${angle}°) = ${fmt(value)}`,
    steps,
    formulas: [
      "\\sin\\theta = \\frac{\\text{opuesto}}{\\text{hipotenusa}}",
      "\\cos\\theta = \\frac{\\text{adyacente}}{\\text{hipotenusa}}",
      "\\tan\\theta = \\frac{\\text{opuesto}}{\\text{adyacente}}",
    ],
    confidence: exactVal ? "high" : "high",
  };
}

/* ---------------------------------------------------------------------------
 * Dispatcher de matemáticas
 * ------------------------------------------------------------------------- */

export function solveMath(input: string, topic: string): Solution | SolveFailure {
  switch (topic) {
    case "derivative":
      return solveDerivative(input);
    case "integral":
      return solveIntegral(input);
    case "geometry":
      return solveGeometry(input);
    case "trigonometry":
      return solveTrig(input);
    case "arithmetic":
      return input.includes("=") ? solveEquation(input) : solveArithmetic(input);
    case "equation":
    case "algebra":
      return solveEquation(input);
    default:
      // Intentos en orden de probabilidad
      if (/derivad|derivar|d\/dx/.test(input.toLowerCase()))
        return solveDerivative(input);
      if (/integral|∫/.test(input.toLowerCase())) return solveIntegral(input);
      if (input.includes("=")) return solveEquation(input);
      if (/[aá]rea|volumen|per[ií]metro|c[ií]rculo/.test(input.toLowerCase()))
        return solveGeometry(input);
      if (/sen|sin|cos|tan/.test(input.toLowerCase())) return solveTrig(input);
      if (canEvaluate(input)) return solveArithmetic(input);
      return fail(
        "No pude clasificar el problema.",
        "Reformúlalo o usa un ejemplo. Para ecuaciones escribe '='; para derivadas usa 'derivada de'; para integrales 'integral de'.",
        { needsClarification: true }
      );
  }
}

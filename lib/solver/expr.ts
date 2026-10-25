/**
 * Evaluador de expresiones matemáticas seguro.
 *
 * IMPORTANTE (seguridad): NO usamos `eval` ni `new Function`. Implementamos un
 * tokenizador + algoritmo shunting-yard + evaluación por pila. Así el usuario
 * nunca puede ejecutar código arbitrario (requisito de seguridad del prompt).
 *
 * Soporta: números, + - * / ^, paréntesis, multiplicación implícita (2x, 3(x+1)),
 * funciones (sin, cos, tan, asin, acos, atan, sqrt, abs, exp, ln, log, log10,
 * floor, ceil, round), constantes (pi, e) y variables (por defecto x).
 *
 * Las funciones trigonométricas trabajan en RADIANES dentro de las expresiones.
 */

export type TokenType = "num" | "op" | "lp" | "rp" | "id" | "comma";

export interface Token {
  t: TokenType;
  v: string;
}

export const FUNCTIONS = new Set([
  "sin",
  "cos",
  "tan",
  "asin",
  "acos",
  "atan",
  "sqrt",
  "abs",
  "exp",
  "ln",
  "log",
  "log10",
  "floor",
  "ceil",
  "round",
  "sign",
]);

export const CONSTANTS: Record<string, number> = {
  pi: Math.PI,
  e: Math.E,
};

/** Mapa de superíndices Unicode a dígitos normales. */
const SUPERSCRIPTS: Record<string, string> = {
  "⁰": "0",
  "¹": "1",
  "²": "2",
  "³": "3",
  "⁴": "4",
  "⁵": "5",
  "⁶": "6",
  "⁷": "7",
  "⁸": "8",
  "⁹": "9",
  "⁻": "-",
};

/** Normaliza símbolos escritos por el usuario a sintaxis del evaluador. */
export function normalizeExpression(input: string): string {
  return input
    .toLowerCase()
    .replace(/,/g, ".") // coma decimal
    .replace(/×/g, "*")
    .replace(/÷/g, "/")
    .replace(/−/g, "-") // menos tipográfico
    .replace(/√/g, "sqrt")
    // Superíndices: "x²" -> "x^2", "x⁻¹" -> "x^-1"
    .replace(/[⁰¹²³⁴⁵⁶⁷⁸⁹⁻]+/g, (m) =>
      "^" + m.split("").map((c) => SUPERSCRIPTS[c] ?? "").join("")
    )
    .replace(/π/g, "pi")
    .replace(/[·∗∙•]/g, "*") // puntos de multiplicación
    .replace(/[⁄／]/g, "/") // barras de fracción
    .replace(/\s+/g, "");
}

function isDigit(ch: string) {
  return ch >= "0" && ch <= "9";
}
function isLetter(ch: string) {
  return ch >= "a" && ch <= "z";
}

export function tokenize(input: string): Token[] {
  const s = normalizeExpression(input).replace(/\*\*/g, "^");
  const tokens: Token[] = [];
  let i = 0;

  while (i < s.length) {
    const ch = s[i];

    if (isDigit(ch) || (ch === "." && isDigit(s[i + 1] || ""))) {
      let j = i;
      while (j < s.length && (isDigit(s[j]) || s[j] === ".")) j++;
      tokens.push({ t: "num", v: s.slice(i, j) });
      i = j;
      continue;
    }

    if (isLetter(ch)) {
      let j = i;
      while (j < s.length && (isLetter(s[j]) || isDigit(s[j]))) j++;
      tokens.push({ t: "id", v: s.slice(i, j) });
      i = j;
      continue;
    }

    if (ch === "(" || ch === "[") {
      tokens.push({ t: "lp", v: "(" });
      i++;
      continue;
    }
    if (ch === ")" || ch === "]") {
      tokens.push({ t: "rp", v: ")" });
      i++;
      continue;
    }
    if (ch === ",") {
      tokens.push({ t: "comma", v: "," });
      i++;
      continue;
    }
    if ("+-*/^".includes(ch)) {
      tokens.push({ t: "op", v: ch });
      i++;
      continue;
    }
    // Carácter desconocido: lo ignoramos (entrada ya saneada)
    i++;
  }

  return insertImplicitMultiplication(tokens);
}

/** Inserta `*` donde el usuario lo omite: 2x -> 2*x, 3(x+1) -> 3*(x+1). */
function insertImplicitMultiplication(tokens: Token[]): Token[] {
  const out: Token[] = [];
  for (let k = 0; k < tokens.length; k++) {
    const cur = tokens[k];
    const prev = out[out.length - 1];

    if (prev) {
      const prevEndsValue =
        prev.t === "num" ||
        prev.t === "rp" ||
        (prev.t === "id" && !FUNCTIONS.has(prev.v));
      const curStartsValue =
        cur.t === "num" || cur.t === "lp" || cur.t === "id";

      if (prevEndsValue && curStartsValue) {
        out.push({ t: "op", v: "*" });
      }
    }
    out.push(cur);
  }
  return out;
}

function precedence(op: string): number {
  if (op === "^") return 3;
  if (op === "*" || op === "/") return 2;
  return 1;
}
function isRightAssoc(op: string): boolean {
  return op === "^";
}

/** Convierte tokens a notación polaca inversa (RPN). */
export function toRPN(tokens: Token[]): Token[] {
  const out: Token[] = [];
  const stack: Token[] = [];
  let expectOperand = true;

  for (const tk of tokens) {
    if (tk.t === "num") {
      out.push(tk);
      expectOperand = false;
      continue;
    }

    if (tk.t === "id") {
      if (FUNCTIONS.has(tk.v)) {
        stack.push(tk);
        expectOperand = true;
      } else {
        out.push(tk);
        expectOperand = false;
      }
      continue;
    }

    if (tk.t === "comma") {
      while (stack.length && stack[stack.length - 1].t !== "lp") {
        out.push(stack.pop() as Token);
      }
      continue;
    }

    if (tk.t === "op") {
      // Manejo de signo unario: -x => 0 - x
      if (expectOperand && (tk.v === "-" || tk.v === "+")) {
        out.push({ t: "num", v: "0" });
      }
      while (stack.length) {
        const top = stack[stack.length - 1];
        if (top.t !== "op") break;
        const shouldPop =
          precedence(top.v) > precedence(tk.v) ||
          (precedence(top.v) === precedence(tk.v) && !isRightAssoc(tk.v));
        if (shouldPop) out.push(stack.pop() as Token);
        else break;
      }
      stack.push(tk);
      expectOperand = true;
      continue;
    }

    if (tk.t === "lp") {
      stack.push(tk);
      expectOperand = true;
      continue;
    }

    if (tk.t === "rp") {
      while (stack.length && stack[stack.length - 1].t !== "lp") {
        out.push(stack.pop() as Token);
      }
      if (stack.length && stack[stack.length - 1].t === "lp") stack.pop();
      if (
        stack.length &&
        stack[stack.length - 1].t === "id" &&
        FUNCTIONS.has(stack[stack.length - 1].v)
      ) {
        out.push(stack.pop() as Token);
      }
      expectOperand = false;
      continue;
    }
  }

  while (stack.length) out.push(stack.pop() as Token);
  return out;
}

function applyFunction(name: string, a: number): number {
  switch (name) {
    case "sin":
      return Math.sin(a);
    case "cos":
      return Math.cos(a);
    case "tan":
      return Math.tan(a);
    case "asin":
      return Math.asin(a);
    case "acos":
      return Math.acos(a);
    case "atan":
      return Math.atan(a);
    case "sqrt":
      return Math.sqrt(a);
    case "abs":
      return Math.abs(a);
    case "exp":
      return Math.exp(a);
    case "ln":
      return Math.log(a);
    case "log":
    case "log10":
      return Math.log10(a);
    case "floor":
      return Math.floor(a);
    case "ceil":
      return Math.ceil(a);
    case "round":
      return Math.round(a);
    case "sign":
      return Math.sign(a);
    default:
      throw new Error("Función no soportada: " + name);
  }
}

function applyOp(op: string, a: number, b: number): number {
  switch (op) {
    case "+":
      return a + b;
    case "-":
      return a - b;
    case "*":
      return a * b;
    case "/":
      return a / b;
    case "^":
      return Math.pow(a, b);
    default:
      throw new Error("Operador no soportado: " + op);
  }
}

export function evalRPN(rpn: Token[], vars: Record<string, number> = {}): number {
  const st: number[] = [];
  for (const tk of rpn) {
    if (tk.t === "num") {
      const n = parseFloat(tk.v);
      if (Number.isNaN(n)) throw new Error("Número inválido: " + tk.v);
      st.push(n);
    } else if (tk.t === "id") {
      if (Object.prototype.hasOwnProperty.call(vars, tk.v)) {
        st.push(vars[tk.v]);
      } else if (Object.prototype.hasOwnProperty.call(CONSTANTS, tk.v)) {
        st.push(CONSTANTS[tk.v]);
      } else if (FUNCTIONS.has(tk.v)) {
        const a = st.pop();
        if (a === undefined) throw new Error("Falta argumento para " + tk.v);
        st.push(applyFunction(tk.v, a));
      } else {
        throw new Error("Variable desconocida: " + tk.v);
      }
    } else if (tk.t === "op") {
      const b = st.pop();
      const a = st.pop();
      if (a === undefined || b === undefined)
        throw new Error("Expresión incompleta");
      st.push(applyOp(tk.v, a, b));
    }
  }
  if (st.length !== 1) throw new Error("Expresión inválida");
  return st[0];
}

/** Evalúa una expresión. Lanza Error si es inválida. */
export function evaluate(
  expr: string,
  vars: Record<string, number> = {}
): number {
  return evalRPN(toRPN(tokenize(expr)), vars);
}

/** ¿La expresión es evaluable con las variables dadas? */
export function canEvaluate(
  expr: string,
  vars: Record<string, number> = {}
): boolean {
  try {
    const v = evaluate(expr, vars);
    return Number.isFinite(v);
  } catch {
    return false;
  }
}

// ---------------------------------------------------------------------------
// Utilidades de polinomios
// ---------------------------------------------------------------------------

/** Resuelve un sistema lineal pequeño por eliminación de Gauss-Jordan. */
export function solveLinearSystem(
  A: number[][],
  b: number[]
): number[] | null {
  const n = b.length;
  const M = A.map((row, i) => [...row, b[i]]);

  for (let col = 0; col < n; col++) {
    let piv = col;
    for (let r = col + 1; r < n; r++) {
      if (Math.abs(M[r][col]) > Math.abs(M[piv][col])) piv = r;
    }
    if (Math.abs(M[piv][col]) < 1e-12) return null;
    [M[col], M[piv]] = [M[piv], M[col]];
    const pv = M[col][col];
    for (let c = col; c <= n; c++) M[col][c] /= pv;
    for (let r = 0; r < n; r++) {
      if (r === col) continue;
      const factor = M[r][col];
      if (factor === 0) continue;
      for (let c = col; c <= n; c++) M[r][c] -= factor * M[col][c];
    }
  }
  return M.map((row) => row[n]);
}

/**
 * Intenta expresar `expr` como un polinomio en `variable`.
 * Devuelve los coeficientes [c0, c1, c2, ...] (grado <= maxDeg) o null.
 *
 * Estrategia: evaluar la expresión en varios puntos y resolver el sistema de
 * Vandermonde para el grado más bajo que ajuste, verificando en puntos extra.
 * Esto funciona aunque el usuario escriba paréntesis o factores no expandidos.
 */
export function polyCoefficients(
  expr: string,
  variable = "x",
  maxDeg = 6
): number[] | null {
  const f = (x: number) => evaluate(expr, { [variable]: x });
  const xs: number[] = [];
  const ys: number[] = [];
  // Tomamos más puntos que el grado máximo para poder VERIFICAR el ajuste en
  // puntos no usados. Sin esto, una función como sin(2x) se "ajustaría" a un
  // polinomio de grado máximo y daría un resultado falso.
  const N = maxDeg + 3;
  try {
    for (let i = 0; i < N; i++) {
      xs.push(i);
      ys.push(f(i));
      if (!Number.isFinite(ys[i])) return null;
    }
  } catch {
    return null;
  }

  for (let deg = 0; deg <= maxDeg; deg++) {
    const A: number[][] = [];
    const b: number[] = [];
    for (let i = 0; i <= deg; i++) {
      const row: number[] = [];
      for (let p = 0; p <= deg; p++) row.push(Math.pow(xs[i], p));
      A.push(row);
      b.push(ys[i]);
    }
    const coefs = solveLinearSystem(A, b);
    if (!coefs) continue;

    let ok = true;
    for (let i = deg + 1; i < N; i++) {
      let val = 0;
      for (let p = 0; p < coefs.length; p++) val += coefs[p] * Math.pow(xs[i], p);
      if (Math.abs(val - ys[i]) > 1e-6) {
        ok = false;
        break;
      }
    }
    if (ok) return coefs.map((c) => (Math.abs(c) < 1e-10 ? 0 : c));
  }
  return null;
}

// ---------------------------------------------------------------------------
// Formato de números y LaTeX
// ---------------------------------------------------------------------------

/** Redondea a `digits` decimales y quita ceros sobrantes. */
export function fmt(n: number, digits = 4): string {
  if (!Number.isFinite(n)) return String(n);
  if (Math.abs(n) < 1e-12) return "0";
  const r = Number(n.toFixed(digits));
  return String(r);
}

/** Fracción bonita si el número es casi racional simple (para raíces cuadradas). */
export function fmtNice(n: number, digits = 4): string {
  if (!Number.isFinite(n)) return String(n);
  if (Math.abs(n - Math.PI) < 1e-9) return "\\pi";
  return fmt(n, digits);
}

/** Convierte un polinomio [c0, c1, ...] a LaTeX. */
export function polyToLatex(coefs: number[], variable = "x"): string {
  const terms: string[] = [];
  for (let k = coefs.length - 1; k >= 0; k--) {
    const c = coefs[k];
    if (Math.abs(c) < 1e-12) continue;
    const sign = c < 0 ? "-" : terms.length > 0 ? "+" : "";
    const abs = Math.abs(c);
    let base = "";
    if (k === 0) base = "";
    else if (k === 1) base = variable;
    else base = `${variable}^{${k}}`;

    let coefStr = "";
    if (k === 0) coefStr = fmt(abs);
    else if (Math.abs(abs - 1) < 1e-12) coefStr = "";
    else coefStr = fmt(abs);

    const term = `${coefStr}${base}`;
    terms.push(`${sign}${term}`);
  }
  if (terms.length === 0) return "0";
  return terms.join(" ");
}

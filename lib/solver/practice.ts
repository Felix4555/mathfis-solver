import { fmt } from "./expr";
import type { Area, Topic } from "./types";

/**
 * Generador de problemas para el "Modo práctica".
 * Se ejecuta tanto en el servidor (API Route) como en el cliente.
 */

export type Difficulty = "facil" | "medio" | "dificil";

export interface PracticeProblem {
  id: string;
  area: Area;
  topic: Topic;
  topicLabel: string;
  difficulty: Difficulty;
  question: string;
  /** Respuesta esperada (numérica). */
  answer: number;
  /** Tolerancia para comparar la respuesta del usuario. */
  tolerance: number;
  unit?: string;
  hint: string;
  solution: string;
}

function rnd(min: number, max: number): number {
  return Math.random() * (max - min) + min;
}
function rndInt(min: number, max: number): number {
  return Math.floor(rnd(min, max + 1));
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function difficultyRange(d: Difficulty, easy: [number, number], med: [number, number], hard: [number, number]): [number, number] {
  if (d === "facil") return easy;
  if (d === "medio") return med;
  return hard;
}

// ------------------------- MATE -------------------------

function genArithmetic(d: Difficulty): PracticeProblem {
  const [lo, hi] = difficultyRange(d, [1, 12], [2, 30], [10, 99]);
  const a = rndInt(lo, hi);
  const b = rndInt(lo, hi);
  const ops = d === "facil" ? ["+", "-", "*"] : ["+", "-", "*", "/"];
  const op = pick(ops);
  let answer = 0;
  let question = "";
  if (op === "+") {
    answer = a + b;
    question = `${a} + ${b}`;
  } else if (op === "-") {
    answer = a - b;
    question = `${a} − ${b}`;
  } else if (op === "*") {
    answer = a * b;
    question = `${a} × ${b}`;
  } else {
    const prod = a * b;
    answer = a;
    question = `${prod} ÷ ${b}`;
  }
  return {
    id: `arith-${Date.now()}-${rndInt(0, 9999)}`,
    area: "math",
    topic: "arithmetic",
    topicLabel: "Aritmética",
    difficulty: d,
    question: `Calcula: ${question}`,
    answer,
    tolerance: 0.001,
    hint: "Recuerda el orden de operaciones.",
    solution: `${question} = ${fmt(answer)}`,
  };
}

function genLinearEquation(d: Difficulty): PracticeProblem {
  const [lo, hi] = difficultyRange(d, [1, 9], [1, 15], [2, 20]);
  const a = rndInt(lo, hi) || 2;
  const x = rndInt(1, hi);
  const b = rndInt(-20, 20);
  const c = a * x + b;
  return {
    id: `lin-${Date.now()}-${rndInt(0, 9999)}`,
    area: "math",
    topic: "equation",
    topicLabel: "Ecuación lineal",
    difficulty: d,
    question: `Resuelve para x:  ${a}x ${b >= 0 ? "+" : "−"} ${Math.abs(b)} = ${c}`,
    answer: x,
    tolerance: 0.001,
    hint: "Pasa la constante al otro lado y divide entre el coeficiente de x.",
    solution: `x = ${fmt(x)}`,
  };
}

function genQuadratic(d: Difficulty): PracticeProblem {
  // Raíces enteras r1, r2 -> (x - r1)(x - r2) = x^2 - (r1+r2)x + r1 r2
  const [lo, hi] = difficultyRange(d, [1, 5], [1, 9], [-10, 10]);
  const r1 = rndInt(lo, hi);
  const r2 = rndInt(lo, hi);
  const B = -(r1 + r2);
  const C = r1 * r2;
  return {
    id: `quad-${Date.now()}-${rndInt(0, 9999)}`,
    area: "math",
    topic: "equation",
    topicLabel: "Ecuación cuadrática",
    difficulty: d,
    question: `Resuelve (raíz menor): x² ${B >= 0 ? "+" : "−"} ${Math.abs(B)}x ${
      C >= 0 ? "+" : "−"
    } ${Math.abs(C)} = 0`,
    answer: Math.min(r1, r2),
    tolerance: 0.01,
    hint: "Puedes factorizar buscando dos números que sumen −b y multipliquen c.",
    solution: `x = ${Math.min(r1, r2)} o x = ${Math.max(r1, r2)}`,
  };
}

function genGeometryCircle(d: Difficulty): PracticeProblem {
  const [lo, hi] = difficultyRange(d, [1, 5], [1, 12], [2, 30]);
  const r = rndInt(lo, hi);
  const area = Math.PI * r * r;
  return {
    id: `circ-${Date.now()}-${rndInt(0, 9999)}`,
    area: "math",
    topic: "geometry",
    topicLabel: "Geometría · Círculo",
    difficulty: d,
    question: `¿Cuál es el área de un círculo de radio ${r}? (usa π ≈ 3.1416)`,
    answer: area,
    tolerance: 0.05,
    unit: "u²",
    hint: "Área = π · r².",
    solution: `A = π·${r}² = ${fmt(area)}`,
  };
}

// ------------------------- FÍSICA -------------------------

function genKinematics(d: Difficulty): PracticeProblem {
  const [lo, hi] = difficultyRange(d, [1, 20], [1, 50], [5, 120]);
  const v0 = rndInt(0, hi);
  const a = rndInt(1, d === "facil" ? 5 : 15);
  const t = rndInt(1, 10);
  const v = v0 + a * t;
  return {
    id: `kin-${Date.now()}-${rndInt(0, 9999)}`,
    area: "physics",
    topic: "kinematics",
    topicLabel: "Cinemática",
    difficulty: d,
    question: `Un móvil parte con v₀ = ${v0} m/s y acelera a ${a} m/s² durante ${t} s. ¿Velocidad final (m/s)?`,
    answer: v,
    tolerance: 0.01,
    unit: "m/s",
    hint: "v = v₀ + a·t.",
    solution: `v = ${v0} + ${a}·${t} = ${fmt(v)} m/s`,
  };
}

function genDynamics(d: Difficulty): PracticeProblem {
  const m = rndInt(1, d === "facil" ? 10 : 60);
  const a = rndInt(1, d === "facil" ? 10 : 25);
  const F = m * a;
  return {
    id: `dyn-${Date.now()}-${rndInt(0, 9999)}`,
    area: "physics",
    topic: "dynamics",
    topicLabel: "Dinámica",
    difficulty: d,
    question: `¿Qué fuerza (N) se necesita para acelerar una masa de ${m} kg a ${a} m/s²?`,
    answer: F,
    tolerance: 0.01,
    unit: "N",
    hint: "F = m·a.",
    solution: `F = ${m}·${a} = ${fmt(F)} N`,
  };
}

function genEnergy(d: Difficulty): PracticeProblem {
  const m = rndInt(1, d === "facil" ? 10 : 50);
  const v = rndInt(1, d === "facil" ? 10 : 30);
  const ke = 0.5 * m * v * v;
  return {
    id: `ene-${Date.now()}-${rndInt(0, 9999)}`,
    area: "physics",
    topic: "energy",
    topicLabel: "Energía",
    difficulty: d,
    question: `¿Cuál es la energía cinética (J) de un cuerpo de ${m} kg a ${v} m/s?`,
    answer: ke,
    tolerance: 0.5,
    unit: "J",
    hint: "E_c = ½·m·v².",
    solution: `E_c = ½·${m}·${v}² = ${fmt(ke)} J`,
  };
}

const MATH_GENERATORS = [genArithmetic, genLinearEquation, genQuadratic, genGeometryCircle];
const PHYSICS_GENERATORS = [genKinematics, genDynamics, genEnergy];

export function generateProblem(
  area: Area,
  difficulty: Difficulty
): PracticeProblem {
  const gens = area === "physics" ? PHYSICS_GENERATORS : MATH_GENERATORS;
  const gen = pick(gens);
  return gen(difficulty);
}

export function checkAnswer(problem: PracticeProblem, userAnswer: string): boolean {
  const cleaned = userAnswer.replace(",", ".").replace(/[^\d.\-]/g, "");
  const value = parseFloat(cleaned);
  if (!Number.isFinite(value)) return false;
  return Math.abs(value - problem.answer) <= problem.tolerance;
}

/**
 * Tipos compartidos por el motor de resolución.
 * El motor es TypeScript puro (sin APIs de Node ni del navegador), por lo que
 * puede ejecutarse tanto en la API Route (servidor) como en el cliente.
 */

export type Area = "math" | "physics";

export type Topic =
  // Matemáticas
  | "arithmetic"
  | "algebra"
  | "equation"
  | "function"
  | "limit"
  | "derivative"
  | "integral"
  | "matrix"
  | "vector"
  | "geometry"
  | "trigonometry"
  // Física
  | "kinematics"
  | "dynamics"
  | "energy"
  | "momentum"
  | "gravitation"
  | "electricity"
  | "magnetism"
  | "waves"
  | "thermodynamics"
  | "unknown";

export interface SolutionStep {
  /** Número de paso (1-based). */
  step: number;
  /** Título corto del paso (ej: "Aislar x"). */
  title: string;
  /** Explicación de qué se hace y por qué. */
  detail: string;
  /**
   * Explicación ampliada, pensada para el estudiante ("¿por qué hacemos esto?").
   * Se muestra en un recuadro aparte para no recargar el paso.
   */
  explanation?: string;
  /** Fórmula/expresión LaTeX asociada al paso (opcional). */
  formula?: string;
}

export interface GraphFunctionSpec {
  type: "function";
  /** Expresión en función de x (lenguaje del evaluador, no LaTeX). */
  fn: string;
  xRange: [number, number];
  label?: string;
}

export interface GraphTrajectorySpec {
  type: "trajectory";
  v0: number;
  angleDeg: number;
  g?: number;
}

export interface GraphPointsSpec {
  type: "points";
  points: { x: number; y: number; label?: string }[];
  connect?: boolean;
  xLabel?: string;
  yLabel?: string;
}

export type GraphSpec =
  | GraphFunctionSpec
  | GraphTrajectorySpec
  | GraphPointsSpec;

export interface Solution {
  ok: true;
  area: Area;
  topic: Topic;
  topicLabel: string;
  /** Problema tal como lo escribió el usuario (saneado). */
  input: string;
  /** Resultado final en LaTeX (o texto simple). */
  finalResult: string;
  /** Resultado final como texto plano (accesible / copiable). */
  finalText: string;
  steps: SolutionStep[];
  /** Fórmulas usadas, en LaTeX. */
  formulas: string[];
  /**
   * Resumen introductorio en lenguaje natural ("qué vamos a hacer y por qué").
   * Ayuda al estudiante a situarse antes de ver los pasos.
   */
  summary?: string;
  graph?: GraphSpec;
  /** Confianza del motor en la respuesta. */
  confidence: "high" | "medium" | "low";
  /** Advertencias o supuestos asumidos. */
  notes?: string[];
}

export interface SolveFailure {
  ok: false;
  /** Mensaje claro para el usuario. */
  error: string;
  /** Sugerencia para reformular. */
  suggestion: string;
  /** true si el problema es ambiguo y conviene pedir aclaración. */
  needsClarification?: boolean;
  area?: Area;
  topic?: Topic;
}

export type SolveResult = Solution | SolveFailure;

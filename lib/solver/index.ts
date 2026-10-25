import { detectTopic } from "./detect";
import { solveMath } from "./mathEngine";
import { solvePhysics } from "./physicsEngine";
import { enrichSolution } from "./tutor";
import type { Solution, SolveResult } from "./types";

/**
 * Punto de entrada del motor. Detecta el área/tema y delega en el motor
 * de matemáticas o de física. Nunca lanza excepciones: siempre devuelve
 * un objeto Solution o SolveFailure para que la UI pueda mostrar un mensaje.
 */
export function solve(rawInput: string): SolveResult {
  const input = (rawInput ?? "").trim();
  if (!input) {
    return {
      ok: false,
      error: "El problema está vacío.",
      suggestion: "Escribe, dicta o sube una foto de tu problema.",
      needsClarification: true,
    };
  }

  try {
    const detection = detectTopic(input);
    if (detection.score === 0 && /[=]/.test(input) && !/[a-z]/.test(input)) {
      // p.ej. "2+2=" sin incógnita => aritmética
    }
    const result =
      detection.area === "physics"
        ? solvePhysics(input, detection.topic)
        : solveMath(input, detection.topic);

    if (!result.ok && !result.topic) {
      result.topic = detection.topic;
      result.area = detection.area;
    }
    // Capa "tutor": añade resumen, explicaciones por paso y consejos de estudio.
    return result.ok ? enrichSolution(result as Solution) : result;
  } catch (e: any) {
    return {
      ok: false,
      error: "Ocurrió un error inesperado al procesar el problema.",
      suggestion:
        "Revisa la sintaxis del problema o reformúlalo. Si persiste, prueba con un ejemplo.",
    };
  }
}

export * from "./types";
export { detectTopic, topicLabel } from "./detect";
export { evaluate, polyCoefficients } from "./expr";

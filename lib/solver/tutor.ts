import type { Solution, SolutionStep, Topic } from "./types";

/**
 * "Tutor": enriquece una solución ya calculada con material didáctico.
 *
 * La idea es que el motor siga siendo puro y determinista (solo calcula), y que
 * esta capa añada el "modo profesor": un resumen de qué se va a hacer, una
 * explicación de por qué en cada paso y consejos/recordatorios para el alumno.
 *
 * No modifica los resultados numéricos; solo añade texto de apoyo.
 */

const SUMMARIES: Record<Topic, string> = {
  arithmetic:
    "Vamos a resolver esta operación respetando la jerarquía: primero paréntesis, luego potencias, después multiplicaciones y divisiones, y al final sumas y restas.",
  algebra:
    "Vamos a simplificar y reorganizar la expresión para dejarla en su forma más sencilla.",
  equation:
    "El objetivo es encontrar el valor de la incógnita que hace cierta la igualdad. Aplicaremos las mismas operaciones a ambos lados para dejar la incógnita sola.",
  function:
    "Vamos a analizar la función para entender su comportamiento, sus puntos notables y su forma.",
  limit:
    "Vamos a estudiar hacia qué valor se acerca la función cuando la variable se aproxima al punto indicado.",
  derivative:
    "La derivada mide cómo cambia la función: nos dice su pendiente y su rapidez de variación. Aplicaremos las reglas de derivación paso a paso.",
  integral:
    "Integrar es el proceso inverso a derivar: buscamos una función cuya derivada sea la que nos dan. Aplicaremos las reglas de integración término a término.",
  matrix:
    "Organizamos los datos en filas y columnas y aplicamos las operaciones propias de matrices.",
  vector:
    "Un vector tiene módulo, dirección y sentido. Vamos a operar con sus componentes y a interpretar el resultado.",
  geometry:
    "Identificamos la figura, reconocemos sus datos y aplicamos las fórmulas de área, perímetro o volumen correspondientes.",
  trigonometry:
    "Relacionamos los ángulos con los lados del triángulo (o el círculo) mediante las razones trigonométricas. Recuerda revisar si trabajamos en grados o radianes.",
  kinematics:
    "Estudiamos el movimiento: posición, velocidad y aceleración en función del tiempo. Elegiremos la ecuación de cinemática que mejor encaje con los datos.",
  dynamics:
    "Analizamos las fuerzas que actúan sobre el cuerpo y aplicamos la segunda ley de Newton, F = m·a.",
  energy:
    "El trabajo y la energía permiten resolver problemas sin necesidad de conocer los detalles del movimiento. Usaremos los principios de conservación.",
  momentum:
    "La cantidad de movimiento (p = m·v) se conserva en los choques y explosiones. La usaremos para relacionar velocidades antes y después.",
  gravitation:
    "Aplicamos la ley de gravitación universal y las leyes de Kepler para describir la atracción entre masas.",
  electricity:
    "Analizamos el circuito con la ley de Ohm y la potencia eléctrica para relacionar voltaje, corriente y resistencia.",
  magnetism:
    "Relacionamos corrientes, campos magnéticos y fuerzas mediante las leyes del magnetismo.",
  waves:
    "Describimos la onda con sus parámetros: amplitud, longitud de onda, frecuencia y velocidad de propagación.",
  thermodynamics:
    "Aplicamos los principios de la termodinámica para relacionar calor, trabajo y variación de energía interna.",
  unknown:
    "Vamos a resolver el problema paso a paso, identificando los datos y aplicando la relación adecuada.",
};

const TIPS: Record<Topic, string[]> = {
  arithmetic: [
    "Recuerda el orden de las operaciones (PEMDAS): Paréntesis, Exponentes, Multiplicación/División, Adición/Sustracción.",
    "Si hay dudas con los signos, resuelve primero lo que está dentro de los paréntesis.",
  ],
  algebra: [
    "Solo puedes sumar términos semejantes (misma variable y mismo exponente).",
    "Al pasar un término de un lado a otro del igual, cambia de signo.",
  ],
  equation: [
    "Comprobación: sustituye tu solución en la ecuación original; ambos lados deben coincidir.",
    "En ecuaciones cuadráticas, una raíz puede repetirse o ser compleja (cuando el discriminante es negativo).",
  ],
  function: [
    "Los ceros de una función son los puntos donde corta el eje X (f(x) = 0).",
    "La pendiente indica si la función crece (positiva) o decrece (negativa).",
  ],
  limit: [
    "Antes de sustituir, comprueba si aparece una indeterminación (0/0, ∞/∞).",
    "Factorizar o racionalizar suele eliminar la indeterminación.",
  ],
  derivative: [
    "Regla de la potencia: d(xⁿ)/dx = n·xⁿ⁻¹.",
    "La regla de la cadena se usa cuando dentro hay una función compuesta, como sin(2x).",
  ],
  integral: [
    "No olvides la constante de integración + C en las integrales indefinidas.",
    "Deriva tu resultado para comprobar que recuperas la función original.",
  ],
  matrix: [
    "Para multiplicar matrices, el número de columnas de la primera debe coincidir con el de filas de la segunda.",
    "El determinante te dice si la matriz tiene inversa (≠ 0) o no.",
  ],
  vector: [
    "El módulo de un vector (x, y) es √(x² + y²).",
    "El producto punto da un escalar; el producto cruz, un vector perpendicular.",
  ],
  geometry: [
    "Anota siempre las unidades: áreas en unidades², volúmenes en unidades³.",
    "Dibuja la figura y marca los datos; ayuda a no confundir base con altura.",
  ],
  trigonometry: [
    "Comprueba el modo de la calculadora: grados (DEG) o radianes (RAD).",
    "SOH-CAH-TOA: sen = opuesto/hipotenusa, cos = adyacente/hipotenusa, tan = opuesto/adyacente.",
  ],
  kinematics: [
    "Elige la ecuación que incluya las tres magnitudes que conoces y la que buscas.",
    "En caída libre, la velocidad inicial es 0 y la aceleración es g ≈ 9.8 m/s².",
  ],
  dynamics: [
    "Dibuja el diagrama de cuerpo libre: todas las fuerzas sobre el objeto.",
    "Si hay varios cuerpos o poleas, plantea una ecuación por cada uno.",
  ],
  energy: [
    "Energía cinética: Ec = ½mv². Energía potencial: Ep = mgh.",
    "Si no hay rozamiento, la energía mecánica se conserva (Em = Ec + Ep constante).",
  ],
  momentum: [
    "p = m·v es un vector: cuida los signos de las velocidades.",
    "En choques sin fuerzas externas, la cantidad de movimiento total se conserva.",
  ],
  gravitation: [
    "La fuerza gravitatoria es siempre atractiva y va dirigida hacia el centro de masas.",
    "La constante G = 6.67×10⁻¹¹ N·m²/kg².",
  ],
  electricity: [
    "Ley de Ohm: V = I·R. Potencia: P = V·I.",
    "En serie la corriente es la misma; en paralelo, el voltaje.",
  ],
  magnetism: [
    "Usa la regla de la mano derecha para determinar la dirección de la fuerza magnética.",
    "F = q·v·B cuando la carga se mueve perpendicular al campo.",
  ],
  waves: [
    "La relación fundamental es v = λ·f (velocidad = longitud de onda × frecuencia).",
    "El periodo es el inverso de la frecuencia: T = 1/f.",
  ],
  thermodynamics: [
    "El calor fluye espontáneamente del cuerpo caliente al frío.",
    "En un gas ideal, PV = nRT relaciona presión, volumen y temperatura.",
  ],
  unknown: [
    "Revisa que la expresión esté bien escrita y que las unidades sean coherentes.",
    "Si el problema tiene varias incógnitas, deja claro cuál te piden.",
  ],
};

/** Explicación general según el título del paso (heurística). */
function explainStep(step: SolutionStep): string {
  const s = step.title.toLowerCase();
  if (/dato|identific|nos piden|entend|interpret|qué sabemos/.test(s))
    return "Primero ordenamos la información: qué conocemos y qué nos piden. Identificar bien los datos evita usar la fórmula equivocada.";
  if (/fórmula|regla|ley|teorema|modelo|ecuación a usar|plante/.test(s))
    return "Elegimos la relación matemática que conecta los datos con lo que buscamos. Reconocer el patrón (ecuación, ley física…) es la clave del ejercicio.";
  if (/sustitu|reemplaz|aplic/.test(s))
    return "Reemplazamos cada símbolo por su valor numérico, cuidando las unidades. Así pasamos del lenguaje algebraico a números concretos.";
  if (/despej|aisl/.test(s))
    return "Dejamos sola la incógnita aplicando la operación inversa en ambos miembros de la igualdad (lo que haces a un lado, lo haces al otro).";
  if (/calcul|resuelv|oper|simplific|desarroll/.test(s))
    return "Realizamos las operaciones con cuidado, un paso a la vez, para no arrastrar errores.";
  if (/comprob|verific/.test(s))
    return "Comprobar la solución es un hábito muy útil: si al sustituir se cumple la igualdad, la respuesta es correcta.";
  if (/antideriv|integral/.test(s))
    return "Buscamos una función cuya derivada sea la original; es el proceso inverso a derivar.";
  if (/pendiente|razón|derivad/.test(s))
    return "La derivada en un punto es la pendiente de la recta tangente, es decir, cuánto cambia la función por cada unidad de la variable.";
  if (/resultado|final|respuesta|conclusi/.test(s))
    return "Reunimos lo obtenido y expresamos la respuesta final con sus unidades y el sentido físico si corresponde.";
  return "Cada paso transforma la expresión en otra equivalente, sin cambiar su valor, hasta aislar el resultado buscado.";
}

/**
 * Enriquece una solución con resumen, explicaciones por paso y consejos.
 * Si el campo ya existe en el motor, se respeta.
 */
export function enrichSolution(sol: Solution): Solution {
  const steps = sol.steps.map((st) => ({
    ...st,
    explanation: st.explanation ?? explainStep(st),
  }));

  const notes = [...(sol.notes ?? [])];
  const existing = new Set(notes.map((n) => n.trim()));
  for (const tip of TIPS[sol.topic] ?? TIPS.unknown) {
    const text = `💡 ${tip}`;
    if (!existing.has(text)) notes.push(text);
  }

  return {
    ...sol,
    summary: sol.summary ?? SUMMARIES[sol.topic] ?? SUMMARIES.unknown,
    steps,
    notes,
  };
}

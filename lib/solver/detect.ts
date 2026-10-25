import type { Area, Topic } from "./types";

/**
 * Detección automática del tema a partir del texto del problema.
 *
 * Es heurística (palabras clave con pesos). Cada regla que coincide aporta su
 * peso al tema correspondiente; al final gana el tema con mayor puntuación.
 * Varias reglas pueden apuntar al mismo tema para que los pesos se acumulen
 * (p. ej. "fuerza" + "masa" + "kg" => Dinámica con mucha confianza).
 */

interface KeywordRule {
  topic: Topic;
  area: Area;
  keywords: RegExp;
  weight: number;
}

const RULES: KeywordRule[] = [
  // ------------------------------- FÍSICA -------------------------------
  // Cinemática
  {
    topic: "kinematics",
    area: "physics",
    weight: 4,
    keywords:
      /proyectil|tiro parab|ca[ií]da libre|parab[oó]lico|lanzamiento|se deja caer|\bcae\b|ca[ií]da/,
  },
  {
    topic: "kinematics",
    area: "physics",
    weight: 3,
    keywords: /cinem[aá]tica|trayectoria|lanza|dispara|recorre|desplaz/,
  },
  {
    topic: "kinematics",
    area: "physics",
    weight: 2,
    keywords: /velocidad|rapidez|aceleraci[oó]n|acelera/,
  },
  {
    topic: "kinematics",
    area: "physics",
    weight: 1,
    keywords: /m\/s/,
  },

  // Dinámica
  {
    topic: "dynamics",
    area: "physics",
    weight: 4,
    keywords: /fuerza|newton/,
  },
  {
    topic: "dynamics",
    area: "physics",
    weight: 3,
    keywords: /din[aá]mica|fricci[oó]n|roce|tensi[oó]n|plano inclinado|peso/,
  },
  {
    topic: "dynamics",
    area: "physics",
    weight: 2,
    keywords: /masa/,
  },
  {
    topic: "dynamics",
    area: "physics",
    weight: 1,
    keywords: /\bkg\b|\bkilogramos?\b/,
  },

  // Trabajo y energía
  {
    topic: "energy",
    area: "physics",
    weight: 4,
    keywords: /energ[ií]a (cin[eé]tica|potencial)/,
  },
  {
    topic: "energy",
    area: "physics",
    weight: 3,
    keywords: /energ[ií]a|trabajo|joule|potencia|watt/,
  },

  // Cantidad de movimiento
  {
    topic: "momentum",
    area: "physics",
    weight: 4,
    keywords: /cantidad de movimiento|momento lineal|impulso|colisi[oó]n/,
  },
  {
    topic: "momentum",
    area: "physics",
    weight: 2,
    keywords: /\bmomentum\b|\bmomento\b/,
  },

  // Gravitación
  {
    topic: "gravitation",
    area: "physics",
    weight: 3,
    keywords: /gravitaci[oó]n|gravitatoria|[oó]rbita|kepler|campo gravitatorio/,
  },

  // Electricidad
  {
    topic: "electricity",
    area: "physics",
    weight: 3,
    keywords:
      /circuito|corriente|resisten|voltaje|ohmio|\bohm\b|amperio|ley de ohm|condensador|capacit/,
  },
  {
    topic: "electricity",
    area: "physics",
    weight: 2,
    keywords: /el[eé]ctric/,
  },

  // Magnetismo
  {
    topic: "magnetism",
    area: "physics",
    weight: 3,
    keywords: /magnet|im[aá]n|campo magn[eé]tico|inducci[oó]n|bobina|flujo magn[eé]tico/,
  },

  // Ondas
  {
    topic: "waves",
    area: "physics",
    weight: 3,
    keywords: /onda|sonido|frecuencia|longitud de onda|hertz|refracci[oó]n|difracci[oó]n/,
  },

  // Termodinámica
  {
    topic: "thermodynamics",
    area: "physics",
    weight: 3,
    keywords: /termodin[aá]mic|calor|temperatura|entrop[ií]a|kelvin|gas ideal/,
  },

  // ----------------------------- MATEMÁTICAS -----------------------------
  {
    topic: "derivative",
    area: "math",
    weight: 4,
    keywords: /derivad|derivar|d\/dx|tangente a la curva/,
  },
  {
    topic: "integral",
    area: "math",
    weight: 4,
    keywords: /integral|integrar|antiderivada|primitiva|∫/,
  },
  {
    topic: "limit",
    area: "math",
    weight: 4,
    keywords: /l[ií]mite|tiende a|\blim\b/,
  },
  {
    topic: "matrix",
    area: "math",
    weight: 3,
    keywords: /matriz|matrices|determinante|inversa de una matriz/,
  },
  {
    topic: "vector",
    area: "math",
    weight: 3,
    keywords: /vector|producto punto|producto cruz|magnitud de un vector/,
  },
  {
    topic: "trigonometry",
    area: "math",
    weight: 3,
    keywords: /trigonometr|seno|coseno|tangente/,
  },
  {
    topic: "trigonometry",
    area: "math",
    weight: 2,
    keywords: /\bsen\b|\bsin\b|\bcos\b|\btan\b/,
  },
  {
    topic: "geometry",
    area: "math",
    weight: 3,
    keywords: /hipotenusa|cateto|pit[aá]goras/,
  },
  {
    topic: "geometry",
    area: "math",
    weight: 2,
    keywords:
      /[aá]rea|per[ií]metro|volumen|circunferencia|c[ií]rculo|rect[aá]ngulo|esfera|cilindro|cono|trapecio|rombo|cuadrado/,
  },
  {
    topic: "geometry",
    area: "math",
    weight: 1,
    keywords: /tri[aá]ngulo/,
  },
  {
    topic: "equation",
    area: "math",
    weight: 2,
    keywords: /resolver|ecuaci[oó]n|despej|ra[ií]ces|cuadr[aá]tica|\bx\^?2\b/,
  },
  {
    topic: "equation",
    area: "math",
    weight: 1,
    keywords: /=/,
  },
  {
    topic: "arithmetic",
    area: "math",
    weight: 1,
    keywords: /calcula|cu[aá]nto es|suma|resta|multiplica|divide|porcentaje/,
  },
];

export interface Detection {
  area: Area;
  topic: Topic;
  topicLabel: string;
  score: number;
}

const TOPIC_LABELS: Record<Topic, string> = {
  arithmetic: "Aritmética",
  algebra: "Álgebra",
  equation: "Ecuaciones",
  function: "Funciones",
  limit: "Límites",
  derivative: "Derivadas",
  integral: "Integrales",
  matrix: "Matrices",
  vector: "Vectores",
  geometry: "Geometría",
  trigonometry: "Trigonometría",
  kinematics: "Cinemática",
  dynamics: "Dinámica",
  energy: "Trabajo y Energía",
  momentum: "Cantidad de movimiento",
  gravitation: "Gravitación",
  electricity: "Electricidad",
  magnetism: "Magnetismo",
  waves: "Ondas",
  thermodynamics: "Termodinámica",
  unknown: "General",
};

export function topicLabel(topic: Topic): string {
  return TOPIC_LABELS[topic] ?? "General";
}

/** Devuelve el tema más probable y el área (math/physics). */
export function detectTopic(problem: string): Detection {
  const text = problem.toLowerCase();
  const scores = new Map<Topic, { score: number; area: Area }>();

  for (const rule of RULES) {
    if (rule.keywords.test(text)) {
      const prev = scores.get(rule.topic);
      const score = (prev?.score ?? 0) + rule.weight;
      scores.set(rule.topic, { score, area: rule.area });
    }
  }

  let bestTopic: Topic = "unknown";
  let best: { score: number; area: Area } = { score: 0, area: "math" };

  for (const [topic, info] of scores) {
    if (info.score > best.score) {
      best = info;
      bestTopic = topic;
    }
  }

  // Inferencia de área de respaldo cuando no hay ninguna pista clara
  const area: Area =
    best.score > 0
      ? best.area
      : /fuerza|velocidad|masa|newton|joule|watt|circuito|onda|calor/.test(text)
      ? "physics"
      : "math";

  return {
    area,
    topic: bestTopic,
    topicLabel: topicLabel(bestTopic),
    score: best.score,
  };
}

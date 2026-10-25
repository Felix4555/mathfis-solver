import type { Area, Topic } from "./solver/types";
import { normalizeProblem, problemToSlug } from "./url";

/**
 * Catálogo de problemas para las páginas estáticas de SEO.
 *
 * Dos fuentes:
 *  1) Un conjunto escrito a mano con los problemas más pedidos en el aula.
 *  2) Generadores sistemáticos (ecuaciones cuadráticas, lineales, derivadas…)
 *     que multiplican el volumen de URLs útiles sin duplicar contenido.
 *
 * Se usa en `app/resolver/[slug]/page.tsx` (generateStaticParams) y en
 * `app/sitemap.ts`.
 */

export interface CatalogEntry {
  slug: string;
  problem: string;
  topic: Topic;
  area: Area;
}

/* ---------------------------------------------------------------------------
 * Generadores
 * ------------------------------------------------------------------------- */

function fmtNum(n: number): string {
  if (Number.isInteger(n)) return String(n);
  return String(n);
}

/** Término con signo legible: 5 -> "+ 5", -5 -> "- 5". */
function signed(n: number, unit = ""): string {
  return `${n < 0 ? "-" : "+"} ${Math.abs(n)}${unit}`;
}

/** Ecuaciones cuadráticas x^2 + bx + c = 0 con raíces enteras. */
function* quadratics(): Generator<CatalogEntry> {
  const roots = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 15, -1, -2, -3, -4, -5];
  for (const r1 of roots) {
    for (const r2 of roots) {
      const b = -(r1 + r2);
      const c = r1 * r2;
      if (b === 0) continue;
      const problem = `x^2 ${signed(b, "x")} ${signed(c)} = 0`;
      yield {
        slug: `ecuacion-cuadratica-${r1}-${r2}`,
        problem,
        topic: "equation",
        area: "math",
      };
    }
  }
}

/** Ecuaciones lineales ax + b = c. */
function* lineals(): Generator<CatalogEntry> {
  const A = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12];
  const X = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, -1, -2, -3, -4, -5];
  for (const a of A) {
    for (const x of X) {
      const b = (a * x) % 7 === 0 ? 3 : a * x - 10;
      const c = a * x + b;
      const left = `${a === 1 ? "" : a}x ${signed(b)}`;
      const problem = `${left} = ${fmtNum(c)}`;
      yield {
        slug: `ecuacion-lineal-${a}-${x}`,
        problem,
        topic: "equation",
        area: "math",
      };
    }
  }
}

/** Polinomios para derivar (grado 2 y 3). */
function* derivatives(): Generator<CatalogEntry> {
  const forms = [
    "x^3 + 2x",
    "x^4 - 3x^2 + 1",
    "2x^3 - 5x + 4",
    "x^2 + 7x - 3",
    "x^5",
    "3x^4 - 12x",
    "x^3 - 6x^2 + 11x",
    "x^6 + x^2",
    "4x^3 - 8x^2",
    "x^2 - 4",
    "5x^3 + 1",
    "x^4 - 16",
    "2x^4 + x^3 - 6x",
    "x^3 + x^2 + x + 1",
    "x^3 - 4x^2 + 7x - 2",
    "5x^4 - 2x^3 + x - 9",
    "2x^5 + 3x^3 - x",
    "x^7",
    "3x^2 + 6x + 1",
    "(x + 1)^2",
    "7x^2 - 5x + 3",
    "5x^3 - 2x + 7",
    "x^8 - 4x^4",
    "3x^5 + 2x^2 - 9",
    "6x^2 + 9x",
    "x^4 + 4x^3 + 6x^2",
    "2x^6 - x^4",
    "x^9 + 3x^3",
    "4x^2 - 12x + 8",
    "x^3 - 27",
    "9x^2 - 16x + 5",
    "10x - 3",
    "2x^2 + 8x + 6",
    "x^5 - 10x^3 + 24x",
    "4x^4 - 16x^2",
    "3x^3 - 18x^2 + 33x",
    "x^6 - 3x^4 + 3x^2",
    "6x^4 + 4x^3 - 2x",
    "8x^3 - 27",
    "2x^3 + 12x^2 + 24x",
    "x^2 / 2 + 3x",
    "12x^2 - 5x + 1",
    "3x^4 - 4x^3 + 6x^2",
    "x^10 - x",
    "5x^5 - 5",
    "7x^3 - 21x^2 + 14x",
    "2x^8 + 16x",
    "x^4 + 2x^3 - x^2",
    "9x^3 - 6x",
    "4x^6 - 12x^2 + 8",
    "x^5 + 5x^4 + 10x^3",
    "3x^2 - 12x + 12",
    "sin(3x)",
    "cos(4x)",
    "sin(5x)",
    "tan(2x)",
    "ln(4x)",
    "exp(3x)",
  ];
  for (const f of forms) {
    yield {
      slug: `derivada-${f.replace(/[^a-z0-9]+/gi, "-")}`,
      problem: `derivada de ${f}`,
      topic: "derivative",
      area: "math",
    };
  }
}

/** Integrales (indefinidas). */
function* integrals(): Generator<CatalogEntry> {
  const forms = [
    "3x^2 + 2x",
    "x^3 + 1",
    "2x + 5",
    "x^2 - 4",
    "4x^3 - 8x",
    "x^4 + x",
    "6x^5 - 3x",
    "3x^2 - 6x + 9",
    "x^2 + 2x + 1",
    "5x^4 + 2",
    "5x^4 + 3x^2",
    "2x^3 - 6x",
    "4x^3 + 2x^2 - 8x",
    "x^2 + 3x + 5",
    "3x^2 - 4x + 1",
    "6x + 4",
    "2x^2",
    "5x + 1",
    "3x^3 - 4x",
    "8x^3 + 1",
    "9x^2 - 6x + 2",
    "x^5 + 2x",
    "10x^4 - 5x^2",
    "4x + 3",
    "x^3 - x",
    "7x^2 + 2x",
    "x^6 - 3x^4",
    "2x + 9",
    "5x^3 - 10x",
    "12x^2 + 4x",
    "x^4 - 5x^2 + 6",
    "3x - 7",
    "6x^2 + 5x",
    "2x^4 + 4x^2",
    "x^3 + 4x",
    "9x^3 - 3x",
    "7x - 14",
    "4x^2 - 9x",
    "x^5 + x^3",
    "8x^2 - 2x",
  ];
  for (const f of forms) {
    yield {
      slug: `integral-${f.replace(/[^a-z0-9]+/gi, "-")}`,
      problem: `integral de ${f}`,
      topic: "integral",
      area: "math",
    };
  }
}

/** Entrada de matemáticas con slug legible. */
function math(problem: string, topic: Topic): CatalogEntry {
  return { slug: `mate-${problemToSlug(problem)}`, problem, topic, area: "math" };
}

/** Entrada de física con slug legible. */
function phys(problem: string, topic: Topic): CatalogEntry {
  return { slug: `fisica-${problemToSlug(problem)}`, problem, topic, area: "physics" };
}

/**
 * Geometría: figuras con datos variados.
 * Cada figura se genera solo con las redacciones que el motor reconoce, para
 * que ninguna página quede sin resolver.
 */
function* geometryShapes(): Generator<CatalogEntry> {
  const radii = [2, 3, 4, 6, 7, 8, 9, 10, 11, 12];
  for (const r of radii) {
    yield math(`área de un círculo de radio ${r}`, "geometry");
    yield math(`volumen de una esfera de radio ${r}`, "geometry");
  }

  const rect: Array<[number, number]> = [
    [3, 5],
    [4, 7],
    [5, 8],
    [6, 9],
    [7, 11],
    [8, 12],
    [9, 6],
    [10, 4],
    [12, 15],
    [14, 5],
  ];
  for (const [b, h] of rect) {
    yield math(`área de un rectángulo con base ${b} y altura ${h}`, "geometry");
  }

  const tri: Array<[number, number]> = [
    [6, 4],
    [8, 5],
    [12, 7],
    [14, 6],
    [16, 9],
    [18, 8],
    [22, 10],
    [26, 12],
    [30, 9],
    [35, 12],
  ];
  for (const [b, h] of tri) {
    yield math(`área de un triángulo con base ${b} y altura ${h}`, "geometry");
  }

  const triples: Array<[number, number]> = [
    [3, 4],
    [5, 12],
    [6, 8],
    [8, 15],
    [7, 24],
    [9, 12],
    [20, 21],
    [28, 45],
  ];
  for (const [a, b] of triples) {
    yield math(`hipotenusa de un triángulo rectángulo con catetos ${a} y ${b}`, "geometry");
  }

  const cyl: Array<[number, number]> = [
    [2, 5],
    [3, 8],
    [4, 6],
    [5, 10],
    [6, 7],
    [7, 12],
    [8, 9],
    [10, 15],
    [9, 4],
    [11, 6],
  ];
  for (const [r, h] of cyl) {
    yield math(`volumen de un cilindro con radio ${r} y altura ${h}`, "geometry");
  }

  const cones: Array<[number, number]> = [
    [3, 9],
    [4, 12],
    [5, 15],
    [6, 10],
    [7, 21],
    [2, 6],
    [8, 24],
    [9, 12],
    [10, 30],
    [12, 18],
  ];
  for (const [r, h] of cones) {
    yield math(`volumen de un cono con radio ${r} y altura ${h}`, "geometry");
  }

  for (const side of [2, 3, 4, 5, 6, 8, 9, 10, 11, 12]) {
    yield math(`área y perímetro de un cuadrado de lado ${side}`, "geometry");
    yield math(`volumen de un cubo de lado ${side}`, "geometry");
  }

  const traps: Array<[number, number, number]> = [
    [6, 10, 4],
    [5, 9, 3],
    [8, 12, 5],
    [4, 10, 6],
    [7, 11, 4],
    [3, 7, 5],
    [9, 15, 6],
    [6, 14, 8],
  ];
  for (const [b1, b2, h] of traps) {
    yield math(`área de un trapecio con bases ${b1} y ${b2} y altura ${h}`, "geometry");
  }

  const rhomb: Array<[number, number]> = [
    [8, 6],
    [10, 12],
    [6, 4],
    [12, 9],
    [14, 10],
    [16, 12],
    [5, 8],
    [7, 11],
  ];
  for (const [D, d] of rhomb) {
    yield math(`área de un rombo con diagonales ${D} y ${d}`, "geometry");
  }
}

/** Trigonometría: seno, coseno y tangente de ángulos frecuentes. */
function* trigonometryAngles(): Generator<CatalogEntry> {
  const angles = [0, 30, 45, 60, 90, 120, 135, 150, 180];
  for (const fn of ["seno", "coseno"]) {
    for (const a of angles) {
      yield math(`${fn} de ${a} grados`, "trigonometry");
    }
  }
  for (const a of [0, 30, 45, 60, 120, 135, 150]) {
    yield math(`tangente de ${a} grados`, "trigonometry");
  }
}

/** Aritmética: expresiones con paréntesis, potencias y raíces. */
function* arithmeticDrills(): Generator<CatalogEntry> {
  const exprs = [
    "(7 - 2) * 6 / 3",
    "3^4 - 2^5",
    "sqrt(81) - 4^2",
    "(9 + 6) / 3 * 4",
    "5^3 / 5 - 12",
    "sqrt(64) + 5 * 3",
    "(15 - 7) * (3 + 2)",
    "2^6 - 6^2",
    "100 / (5 * 2) + 7",
    "(4 + 8) * (6 - 2)",
    "9 * 9 - 7 * 7",
    "sqrt(169) - 5^2",
    "2^8 / 4 + 10",
    "(2 + 3) * (4 + 5) - 10",
    "45 / 5 + 6 * 7",
    "sqrt(225) + 3^3",
    "(18 / 3) * 2 + 5",
    "6^2 - 4 * 6",
    "11^2 - 10^2",
    "(25 - 9) / 4 + 6",
  ];
  for (const e of exprs) yield math(e, "arithmetic");
}

/** Cinemática: plantillas con distintos enunciados y datos. */
function* kinematicsProblems(): Generator<CatalogEntry> {
  const vels = [5, 10, 15, 20, 25, 30, 40];
  const accs = [1, 2, 3, 4, 5, 6, 8];
  const times = [4, 5, 6, 8, 10, 12, 15];

  // Velocidad y aceleración durante un tiempo.
  const combos: Array<[number, number, number]> = [
    [10, 2, 5],
    [15, 3, 8],
    [20, 4, 6],
    [25, 5, 10],
    [30, 3, 4],
    [40, 5, 8],
    [12, 4, 6],
    [18, 6, 10],
  ];
  for (const [v, a, t] of combos) {
    yield phys(`un móvil a ${v} m/s acelera a ${a} m/s² durante ${t} s`, "kinematics");
  }
  const coche: Array<[number, number]> = [
    [2, 8],
    [3, 10],
    [4, 6],
    [5, 12],
    [6, 15],
    [7, 5],
    [8, 20],
    [10, 12],
  ];
  for (const [a, t] of coche) {
    yield phys(`un coche parte del reposo y acelera a ${a} m/s² durante ${t} s`, "kinematics");
  }
  const movil: Array<[number, number]> = [
    [1, 10],
    [2, 4],
    [3, 6],
    [5, 8],
    [6, 12],
    [9, 7],
  ];
  for (const [a, t] of movil) {
    yield phys(`un móvil parte del reposo y acelera a ${a} m/s² durante ${t} s`, "kinematics");
  }

  // Frenado hasta detenerse.
  for (const [v, a] of [
    [20, 5],
    [30, 6],
    [15, 3],
    [24, 4],
    [36, 6],
    [40, 8],
    [18, 4],
    [45, 9],
  ] as Array<[number, number]>) {
    yield phys(`un móvil a ${v} m/s frena con aceleración de ${a} m/s²`, "kinematics");
  }

  // Movimiento uniforme (solo distancia y tiempo).
  for (const [s, t] of [
    [100, 20],
    [150, 10],
    [300, 15],
    [240, 12],
    [450, 18],
    [600, 25],
    [120, 8],
    [540, 30],
  ] as Array<[number, number]>) {
    yield phys(`un móvil recorre ${s} m en ${t} s`, "kinematics");
    yield phys(`un tren se desplaza ${s} m en ${t} s`, "kinematics");
  }

  // Velocidad inicial + distancia + tiempo -> aceleración.
  for (const [v, s, t] of [
    [15, 200, 10],
    [10, 150, 6],
    [20, 260, 8],
    [25, 350, 14],
    [12, 96, 8],
  ] as Array<[number, number, number]>) {
    yield phys(`un móvil a ${v} m/s recorre ${s} m en ${t} s`, "kinematics");
  }

  // Caída libre.
  for (const h of [5, 10, 15, 20, 25, 30, 45, 50, 60, 80]) {
    yield phys(`caída libre desde ${h} m`, "kinematics");
    yield phys(`se deja caer desde una altura de ${h} m`, "kinematics");
  }

  // Tiro parabólico.
  for (const [v, ang] of [
    [30, 30],
    [40, 60],
    [50, 45],
    [25, 60],
    [60, 45],
    [35, 30],
    [45, 60],
    [20, 45],
  ] as Array<[number, number]>) {
    yield phys(`proyectil a ${v} m/s con ángulo de ${ang} grados`, "kinematics");
  }

  // Tren con velocidad inicial.
  for (const [v, a, t] of [
    [25, 3, 8],
    [35, 2, 12],
    [45, 4, 6],
    [55, 5, 10],
    [65, 3, 9],
  ] as Array<[number, number, number]>) {
    yield phys(`un tren viaja a ${v} m/s y acelera a ${a} m/s² durante ${t} s`, "kinematics");
  }
}

/** Dinámica: fuerza, masa y peso. */
function* dynamicsProblems(): Generator<CatalogEntry> {
  for (const [m, a] of [
    [3, 4],
    [5, 6],
    [8, 2],
    [10, 3],
    [12, 5],
    [15, 2],
    [20, 4],
    [25, 3],
  ] as Array<[number, number]>) {
    yield phys(
      `una masa de ${m} kg acelera a ${a} m/s², ¿cuál es la fuerza?`,
      "dynamics"
    );
  }
  for (const [F, m] of [
    [30, 6],
    [45, 9],
    [50, 10],
    [60, 12],
    [75, 15],
    [90, 18],
    [100, 20],
    [120, 24],
  ] as Array<[number, number]>) {
    yield phys(`una fuerza de ${F} N actúa sobre una masa de ${m} kg`, "dynamics");
    yield phys(`fuerza de ${F} N sobre ${m} kg`, "dynamics");
  }
  for (const m of [5, 8, 12, 15, 20, 35, 45, 60, 70, 90]) {
    yield phys(`peso de un cuerpo de ${m} kg`, "dynamics");
  }
}

/** Energía: cinética, potencial y trabajo. */
function* energyProblems(): Generator<CatalogEntry> {
  for (const [m, v] of [
    [1, 4],
    [3, 6],
    [4, 8],
    [6, 5],
    [7, 3],
    [9, 10],
    [11, 4],
    [14, 6],
  ] as Array<[number, number]>) {
    yield phys(`energía cinética de ${m} kg a ${v} m/s`, "energy");
    yield phys(`cantidad de movimiento de ${m} kg a ${v} m/s`, "momentum");
  }
  for (const [m, h] of [
    [1, 10],
    [3, 8],
    [6, 5],
    [7, 4],
    [9, 3],
    [11, 6],
    [13, 12],
    [16, 15],
  ] as Array<[number, number]>) {
    yield phys(`energía potencial de ${m} kg a ${h} m de altura`, "energy");
  }
}

/** Electricidad: ley de Ohm y potencia. */
function* electricityProblems(): Generator<CatalogEntry> {
  for (const [V, I] of [
    [6, 2],
    [9, 3],
    [12, 4],
    [15, 5],
    [24, 6],
    [36, 9],
    [48, 8],
    [60, 10],
    [110, 5],
    [220, 10],
  ] as Array<[number, number]>) {
    yield phys(`voltaje de ${V} V con corriente de ${I} A`, "electricity");
    yield phys(`un aparato con ${V} V y ${I} A de corriente`, "electricity");
  }
  for (const [V, R] of [
    [12, 4],
    [24, 6],
    [9, 3],
    [48, 8],
    [10, 5],
    [30, 10],
    [18, 6],
    [36, 12],
    [15, 5],
    [45, 9],
  ] as Array<[number, number]>) {
    yield phys(`circuito con ${V} V y ${R} ohmios, ¿cuál es la corriente?`, "electricity");
  }
}

/* ---------------------------------------------------------------------------
 * Catálogo base (escrito a mano)
 * ------------------------------------------------------------------------- */

const BASE: Array<{ problem: string; topic: Topic; area: Area }> = [
  // Aritmética
  { problem: "(5 + 3) * 4 / 2", topic: "arithmetic", area: "math" },
  { problem: "12 * (8 - 3) + 10", topic: "arithmetic", area: "math" },
  { problem: "2^3 + 3^2 - 1", topic: "arithmetic", area: "math" },
  { problem: "150 / 3 - 4 * 2", topic: "arithmetic", area: "math" },
  { problem: "sqrt(49) + 3^2", topic: "arithmetic", area: "math" },
  { problem: "2 * 3 + 4 ÷ 2", topic: "arithmetic", area: "math" },

  // Ecuaciones
  { problem: "2x + 5 = 15", topic: "equation", area: "math" },
  { problem: "x^2 - 5x + 6 = 0", topic: "equation", area: "math" },
  { problem: "3x - 7 = 8", topic: "equation", area: "math" },
  { problem: "x^2 + 2x + 5 = 0", topic: "equation", area: "math" },
  { problem: "x^2 - 9 = 0", topic: "equation", area: "math" },
  { problem: "4x + 2 = 10", topic: "equation", area: "math" },
  { problem: "x^2 - 4x = 0", topic: "equation", area: "math" },
  { problem: "2x^2 - 8 = 0", topic: "equation", area: "math" },

  // Derivadas
  { problem: "derivada de x^3 + 2x", topic: "derivative", area: "math" },
  { problem: "derivada de sin(2x)", topic: "derivative", area: "math" },
  { problem: "derivada de cos(x)", topic: "derivative", area: "math" },
  { problem: "derivada de x^2", topic: "derivative", area: "math" },
  { problem: "derivada de x^5 - 3x^3 + x", topic: "derivative", area: "math" },
  { problem: "derivada de ln(x)", topic: "derivative", area: "math" },

  // Integrales
  { problem: "integral de 3x^2 + 2x", topic: "integral", area: "math" },
  { problem: "integral de sin(x)", topic: "integral", area: "math" },
  { problem: "integral de x^2 dx", topic: "integral", area: "math" },
  { problem: "integral de 2x + 7", topic: "integral", area: "math" },
  { problem: "integral de cos(3x)", topic: "integral", area: "math" },

  // Geometría
  { problem: "área de un círculo de radio 5", topic: "geometry", area: "math" },
  { problem: "área de un rectángulo de base 4 y altura 6", topic: "geometry", area: "math" },
  { problem: "triángulo rectángulo con catetos 3 y 4", topic: "geometry", area: "math" },
  { problem: "volumen de una esfera de radio 3", topic: "geometry", area: "math" },
  { problem: "área de un triángulo con base 10 y altura 5", topic: "geometry", area: "math" },
  { problem: "perímetro de un cuadrado de lado 7", topic: "geometry", area: "math" },

  // Trigonometría
  { problem: "seno de 30 grados", topic: "trigonometry", area: "math" },
  { problem: "coseno de 60 grados", topic: "trigonometry", area: "math" },
  { problem: "tangente de 45 grados", topic: "trigonometry", area: "math" },
  { problem: "seno de 45 grados", topic: "trigonometry", area: "math" },

  // Cinemática
  {
    problem: "un móvil a 20 m/s acelera a 5 m/s² durante 4 s",
    topic: "kinematics",
    area: "physics",
  },
  {
    problem: "proyectil a 50 m/s con ángulo de 45 grados",
    topic: "kinematics",
    area: "physics",
  },
  {
    problem: "se deja caer desde una altura de 20 m",
    topic: "kinematics",
    area: "physics",
  },
  {
    problem: "un coche parte del reposo y acelera a 3 m/s² durante 10 s",
    topic: "kinematics",
    area: "physics",
  },
  {
    problem: "un móvil se desplaza 100 m en 20 s",
    topic: "kinematics",
    area: "physics",
  },

  // Dinámica
  {
    problem: "una masa de 2 kg acelera a 5 m/s², ¿cuál es la fuerza?",
    topic: "dynamics",
    area: "physics",
  },
  { problem: "peso de un cuerpo de 10 kg", topic: "dynamics", area: "physics" },
  {
    problem: "una fuerza de 20 N actúa sobre una masa de 4 kg",
    topic: "dynamics",
    area: "physics",
  },

  // Energía
  {
    problem: "energía cinética de 2 kg a 3 m/s",
    topic: "energy",
    area: "physics",
  },
  {
    problem: "energía cinética de 5 kg a 10 m/s",
    topic: "energy",
    area: "physics",
  },
  {
    problem: "energía potencial de 5 kg a 2 m de altura",
    topic: "energy",
    area: "physics",
  },

  // Cantidad de movimiento
  {
    problem: "cantidad de movimiento de 2 kg a 5 m/s",
    topic: "momentum",
    area: "physics",
  },

  // Electricidad
  {
    problem: "circuito con 12 V y 4 ohmios, ¿cuál es la corriente?",
    topic: "electricity",
    area: "physics",
  },
  {
    problem: "voltaje de 10 V con corriente de 2 A",
    topic: "electricity",
    area: "physics",
  },
  {
    problem: "resistencia de 24 V con corriente de 3 A",
    topic: "electricity",
    area: "physics",
  },
];

/* ---------------------------------------------------------------------------
 * Catálogo completo
 * ------------------------------------------------------------------------- */

function buildCatalog(): CatalogEntry[] {
  const entries: CatalogEntry[] = [];
  const seenProblems = new Set<string>();
  const seenSlugs = new Set<string>();

  const add = (e: CatalogEntry) => {
    const key = normalizeProblem(e.problem);
    if (seenProblems.has(key)) return;
    seenProblems.add(key);

    // Garantiza unicidad del slug en todo el catálogo.
    let slug = e.slug || problemToSlug(e.problem);
    let n = 1;
    while (seenSlugs.has(slug)) {
      n += 1;
      slug = `${e.slug || problemToSlug(e.problem)}-${n}`;
    }
    seenSlugs.add(slug);

    entries.push({ ...e, slug });
  };

  for (const b of BASE) {
    const prefix = b.area === "physics" ? "fisica" : "mate";
    add({
      slug: `${prefix}-${problemToSlug(b.problem)}`,
      problem: b.problem,
      topic: b.topic,
      area: b.area,
    });
  }

  for (const e of quadratics()) add(e);
  for (const e of lineals()) add(e);
  for (const e of derivatives()) add(e);
  for (const e of integrals()) add(e);
  for (const e of geometryShapes()) add(e);
  for (const e of trigonometryAngles()) add(e);
  for (const e of arithmeticDrills()) add(e);
  for (const e of kinematicsProblems()) add(e);
  for (const e of dynamicsProblems()) add(e);
  for (const e of energyProblems()) add(e);
  for (const e of electricityProblems()) add(e);

  return entries;
}

export const CATALOG: CatalogEntry[] = buildCatalog();

/** Búsqueda por slug (rápida, evita recorrer todo). */
const BY_SLUG = new Map(CATALOG.map((e) => [e.slug, e]));

export function findBySlug(slug: string): CatalogEntry | undefined {
  return BY_SLUG.get(slug);
}

/** Entradas más recientes o destacadas para el sitemap (orden estable). */
export function topEntries(limit = 60): CatalogEntry[] {
  return CATALOG.slice(0, limit);
}

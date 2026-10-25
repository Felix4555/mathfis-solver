import { fmt } from "./expr";
import { topicLabel } from "./detect";
import { extractNumbers } from "./mathEngine";
import type { Solution, SolveFailure, SolutionStep } from "./types";

/**
 * Motor de física.
 *
 * Estrategia honesta: extraemos del texto las magnitudes conocidas (con sus
 * unidades cuando estén) y aplicamos la ecuación correspondiente. Si faltan
 * datos, NO inventamos pasos: pedimos aclaración indicando qué falta.
 */

const G = 9.8;

function fail(
  error: string,
  suggestion: string,
  topic: any = "kinematics"
): SolveFailure {
  return {
    ok: false,
    error,
    suggestion,
    needsClarification: true,
    area: "physics",
    topic,
  };
}

/** Extrae el valor de una magnitud buscando por palabras clave y por unidad. */
function magnitude(text: string, patterns: string[]): number | null {
  for (const p of patterns) {
    // Forma "clave = 20" / "clave 20"
    const re1 = new RegExp(
      `(?:${p})\\s*(?:=|es|de|:)?\\s*(-?\\d+(?:[.,]\\d+)?)`,
      "i"
    );
    const m1 = text.match(re1);
    if (m1) return parseFloat(m1[1].replace(",", "."));

    // Forma "20 m/s de clave" / "20 de clave"
    const re2 = new RegExp(
      `(-?\\d+(?:[.,]\\d+)?)\\s*(?:m\\/s²|m\\/s|kg|ohm|Ω|n|j|w|m|s)?\\s*(?:de\\s+|,\\s*)?(?:${p})`,
      "i"
    );
    const m2 = text.match(re2);
    if (m2) return parseFloat(m2[1].replace(",", "."));
  }
  return null;
}

const P = {
  v0: ["velocidad inicial", "rapidez inicial", "v0", "v_0", "vi", "inicial"],
  vf: ["velocidad final", "rapidez final", "vf", "v_f", "final"],
  a: ["aceleraci[oó]n", "acelera(?:\\s+a)?"],
  t: ["tiempo", "durante", "tarda", "t\\s*="],
  s: ["distancia", "desplazamiento", "recorre", "desplaza", "altura recorrida", "desde"],
  h: ["altura", "altura m[aá]xima", "desde una altura", "cae desde", "elevaci[oó]n"],
  m: ["masa", "m\\s*=", "kilogramos", "kg"],
  F: ["fuerza", "f\\s*=", "newtons"],
  g: ["gravedad", "g\\s*="],
  v: ["velocidad", "rapidez", "v\\s*="],
  angle: ["[aá]ngulo", "inclinaci[oó]n", "con la horizontal", "grados", "°"],
  V: ["voltaje", "tensi[oó]n", "voltios", "v\\s*="],
  I: ["corriente", "intensidad", "amperios", "a\\s*="],
  R: ["resistencia", "ohmios", "ohm", "Ω", "r\\s*="],
};

function gravityOf(text: string): number {
  const g = magnitude(text, P.g);
  return g !== null ? g : G;
}

/**
 * Extrae un número por su unidad (por si el enunciado no nombra la magnitud).
 * Ej: "20 m/s" -> velocidad; "5 m/s²" -> aceleración; "12 V" -> voltaje.
 */
function byUnit(text: string, unitPattern: string): number | null {
  const re = new RegExp(`(-?\\d+(?:[.,]\\d+)?)\\s*(?:${unitPattern})`, "i");
  const m = text.match(re);
  return m ? parseFloat(m[1].replace(",", ".")) : null;
}

const U = {
  accel: "m\\s*/\\s*s\\s*(?:\\u00b2|\\^?2)",
  velocity: "m\\s*/\\s*s(?![\\s]*(?:\\u00b2|\\^?2))",
  time: "s(?:eg(?:undos?)?)?\\b",
  volt: "volts?|v\\b",
  ohm: "ohmios?|ohm|\\u03a9",
  amp: "ampere?s?|amperios?|a\\b",
  kg: "kg|kilogramos?",
  newton: "newtons?|n\\b",
  joule: "joules?|j\\b",
};

/* ---------------------------------------------------------------------------
 * Cinemática
 * ------------------------------------------------------------------------- */

function solveProjectile(input: string): Solution | SolveFailure {
  const t = input.toLowerCase();
  const v0 = magnitude(t, P.v0) ?? magnitude(t, P.v) ?? byUnit(t, U.velocity);
  const angle = magnitude(t, P.angle);

  if (v0 === null) {
    return fail(
      "Para un tiro/proyectil necesito la velocidad inicial.",
      "Ej: se lanza un proyectil a 50 m/s con un ángulo de 45 grados.",
      "kinematics"
    );
  }
  if (angle === null) {
    return fail(
      "Para un tiro/proyectil necesito el ángulo de lanzamiento.",
      "Añade el ángulo. Ej: ... con un ángulo de 30°.",
      "kinematics"
    );
  }

  const g = gravityOf(t);
  const rad = (angle * Math.PI) / 180;
  const vx = v0 * Math.cos(rad);
  const vy = v0 * Math.sin(rad);
  const tUp = vy / g;
  const tTotal = 2 * tUp;
  const hMax = (vy * vy) / (2 * g);
  const range = vx * tTotal;

  const formulas = [
    "v_{0x} = v_0 \\cos\\theta,\\quad v_{0y} = v_0 \\sin\\theta",
    "t_{vuelo} = \\frac{2 v_0 \\sin\\theta}{g}",
    "h_{max} = \\frac{v_0^2 \\sin^2\\theta}{2g}",
    "R = \\frac{v_0^2 \\sin 2\\theta}{g}",
  ];

  const steps: SolutionStep[] = [
    {
      step: 1,
      title: "Datos",
      detail: "Velocidad inicial y ángulo de lanzamiento.",
      formula: `v_0 = ${fmt(v0)}\\ \\text{m/s},\\quad \\theta = ${fmt(angle)}°,\\quad g = ${fmt(g)}`,
    },
    {
      step: 2,
      title: "Componentes de la velocidad",
      detail: "Descomponemos la velocidad en horizontal y vertical.",
      formula: `v_{0x} = ${fmt(v0)}\\cos(${fmt(angle)}°) = ${fmt(
        vx
      )},\\quad v_{0y} = ${fmt(v0)}\\sin(${fmt(angle)}°) = ${fmt(vy)}`,
    },
    {
      step: 3,
      title: "Tiempo de vuelo",
      detail: "El tiempo de subida es t = v₀y/g; el de vuelo es el doble.",
      formula: `t_{vuelo} = \\frac{2(${fmt(vy)})}{${fmt(g)}} = ${fmt(tTotal)}\\ \\text{s}`,
    },
    {
      step: 4,
      title: "Altura máxima",
      detail: "En el punto más alto la velocidad vertical es cero.",
      formula: `h_{max} = \\frac{(${fmt(vy)})^2}{2(${fmt(g)})} = ${fmt(hMax)}\\ \\text{m}`,
    },
    {
      step: 5,
      title: "Alcance horizontal",
      detail: "El alcance es la velocidad horizontal por el tiempo de vuelo.",
      formula: `R = ${fmt(vx)} \\cdot ${fmt(tTotal)} = ${fmt(range)}\\ \\text{m}`,
    },
  ];

  return {
    ok: true,
    area: "physics",
    topic: "kinematics",
    topicLabel: "Cinemática · Tiro parabólico",
    input,
    finalResult: `R = ${fmt(range)}\\ \\text{m},\\quad h_{max} = ${fmt(
      hMax
    )}\\ \\text{m},\\quad t = ${fmt(tTotal)}\\ \\text{s}`,
    finalText: `Alcance R = ${fmt(range)} m, Altura máxima = ${fmt(
      hMax
    )} m, Tiempo = ${fmt(tTotal)} s`,
    steps,
    formulas,
    graph: { type: "trajectory", v0, angleDeg: angle, g },
    confidence: "high",
  };
}

function solveKinematics(input: string): Solution | SolveFailure {
  const t = input.toLowerCase();

  if (/proyectil|tiro|parab[oó]lico|dispara|lanzamiento|lanzar/i.test(t)) {
    return solveProjectile(input);
  }

  const g = gravityOf(t);
  const isFall = /ca[ií]da libre|cae|se deja caer|desde una altura/i.test(t);

  const unitAccel = byUnit(t, U.accel);
  const unitVelocity = byUnit(t, U.velocity);
  const labeledV0 = magnitude(t, P.v0);
  const labeledVf = magnitude(t, P.vf);
  const labeledA = magnitude(t, P.a);
  const labeledTime = magnitude(t, P.t);
  const labeledS = magnitude(t, P.s) ?? magnitude(t, P.h);

  let a = isFall ? g : labeledA ?? unitAccel;
  // Tiempo: por palabra clave ("durante 5 s") o directamente por unidad ("en 10 s").
  const time = labeledTime ?? byUnit(t, U.time);
  const s = labeledS;

  // Velocidades: preferimos las etiquetadas; si no, usamos la que trae unidad
  // (m/s) como velocidad inicial (caso típico: "un móvil a 20 m/s...").
  let u = isFall ? 0 : labeledV0;
  let v = labeledVf;
  if (!isFall && u === null && v === null && unitVelocity !== null) {
    u = unitVelocity;
  }

  // "parte del reposo" => v₀ = 0 es un dato válido aunque no lleve unidad.
  if (
    !isFall &&
    u === null &&
    /(parte|partiendo|arranca|inicia|empieza|sale)[^.]{0,20}reposo|en reposo|desde el reposo/i.test(
      t
    )
  ) {
    u = 0;
  }

  // "frena hasta detenerse" => velocidad final 0 y aceleración en sentido
  // contrario al movimiento (frena).
  const braking =
    v === null && /(frena|frenar|desaceler|hasta detenerse|se detiene|se para\b)/i.test(t);
  if (braking) v = 0;
  if (braking && a !== null && a > 0) a = -a;

  const steps: SolutionStep[] = [];
  const formulas = [
    "v = v_0 + a t",
    "s = v_0 t + \\tfrac{1}{2} a t^2",
    "v^2 = v_0^2 + 2 a s",
  ];

  // Caída libre con altura
  if (isFall && s !== null && time === null) {
    const tt = Math.sqrt((2 * s) / g);
    const vf = g * tt;
    steps.push({
      step: 1,
      title: "Datos",
      detail: "Caída libre: v₀ = 0, a = g.",
      formula: `h = ${fmt(s)}\\ \\text{m},\\quad g = ${fmt(g)}\\ \\text{m/s}^2`,
    });
    steps.push({
      step: 2,
      title: "Tiempo de caída",
      detail: "De h = ½ g t² despejamos t.",
      formula: `t = \\sqrt{\\frac{2h}{g}} = \\sqrt{\\frac{2(${fmt(s)})}{${fmt(g)}}} = ${fmt(tt)}\\ \\text{s}`,
    });
    steps.push({
      step: 3,
      title: "Velocidad de impacto",
      detail: "v = g·t.",
      formula: `v = ${fmt(g)} \\cdot ${fmt(tt)} = ${fmt(vf)}\\ \\text{m/s}`,
    });
    return {
      ok: true,
      area: "physics",
      topic: "kinematics",
      topicLabel: "Cinemática · Caída libre",
      input,
      finalResult: `t = ${fmt(tt)}\\ \\text{s},\\quad v = ${fmt(vf)}\\ \\text{m/s}`,
      finalText: `Tiempo = ${fmt(tt)} s, Velocidad = ${fmt(vf)} m/s`,
      steps,
      formulas,
      confidence: "high",
    };
  }

  // Caída libre con tiempo
  if (isFall && time !== null && s === null) {
    const h = 0.5 * g * time * time;
    const vf = g * time;
    steps.push({
      step: 1,
      title: "Datos",
      detail: "Caída libre: v₀ = 0, a = g.",
      formula: `t = ${fmt(time)}\\ \\text{s},\\quad g = ${fmt(g)}`,
    });
    steps.push({
      step: 2,
      title: "Altura caída",
      detail: "h = ½ g t².",
      formula: `h = \\tfrac{1}{2}(${fmt(g)})(${fmt(time)})^2 = ${fmt(h)}\\ \\text{m}`,
    });
    steps.push({
      step: 3,
      title: "Velocidad",
      detail: "v = g·t.",
      formula: `v = ${fmt(g)} \\cdot ${fmt(time)} = ${fmt(vf)}\\ \\text{m/s}`,
    });
    return {
      ok: true,
      area: "physics",
      topic: "kinematics",
      topicLabel: "Cinemática · Caída libre",
      input,
      finalResult: `h = ${fmt(h)}\\ \\text{m},\\quad v = ${fmt(vf)}\\ \\text{m/s}`,
      finalText: `Altura = ${fmt(h)} m, Velocidad = ${fmt(vf)} m/s`,
      steps,
      formulas,
      confidence: "high",
    };
  }

  // Casos generales con MRUA
  if (u !== null && a !== null && time !== null) {
    const vf = u + a * time;
    const dist = u * time + 0.5 * a * time * time;
    steps.push({
      step: 1,
      title: "Datos",
      detail: "Movimiento rectilíneo uniformemente acelerado (MRUA).",
      formula: `v_0 = ${fmt(u)},\\quad a = ${fmt(a)},\\quad t = ${fmt(time)}`,
    });
    steps.push({
      step: 2,
      title: "Velocidad final",
      detail: "Aplicamos v = v₀ + a·t.",
      formula: `v = ${fmt(u)} + ${fmt(a)}(${fmt(time)}) = ${fmt(vf)}`,
    });
    steps.push({
      step: 3,
      title: "Distancia recorrida",
      detail: "Aplicamos s = v₀t + ½at².",
      formula: `s = ${fmt(u)}(${fmt(time)}) + \\tfrac{1}{2}(${fmt(a)})(${fmt(
        time
      )})^2 = ${fmt(dist)}`,
    });
    return {
      ok: true,
      area: "physics",
      topic: "kinematics",
      topicLabel: "Cinemática · MRUA",
      input,
      finalResult: `v = ${fmt(vf)},\\quad s = ${fmt(dist)}`,
      finalText: `Velocidad final = ${fmt(vf)}, Distancia = ${fmt(dist)}`,
      steps,
      formulas,
      confidence: "high",
    };
  }

  if (u !== null && v !== null && time !== null && time !== 0) {
    const acc = (v - u) / time;
    const dist = ((u + v) / 2) * time;
    steps.push({
      step: 1,
      title: "Datos",
      detail: "Conocemos velocidades inicial y final, y el tiempo.",
      formula: `v_0 = ${fmt(u)},\\quad v = ${fmt(v)},\\quad t = ${fmt(time)}`,
    });
    steps.push({
      step: 2,
      title: "Aceleración",
      detail: "De v = v₀ + a·t despejamos a.",
      formula: `a = \\frac{v - v_0}{t} = \\frac{${fmt(v)} - ${fmt(u)}}{${fmt(
        time
      )}} = ${fmt(acc)}`,
    });
    steps.push({
      step: 3,
      title: "Distancia",
      detail: "Usamos la velocidad media: s = (v₀+v)·t/2.",
      formula: `s = \\frac{(${fmt(u)}+${fmt(v)})}{2}(${fmt(time)}) = ${fmt(dist)}`,
    });
    return {
      ok: true,
      area: "physics",
      topic: "kinematics",
      topicLabel: "Cinemática · MRUA",
      input,
      finalResult: `a = ${fmt(acc)},\\quad s = ${fmt(dist)}`,
      finalText: `Aceleración = ${fmt(acc)}, Distancia = ${fmt(dist)}`,
      steps,
      formulas,
      confidence: "high",
    };
  }

  if (u !== null && v !== null && s !== null) {
    const acc = (v * v - u * u) / (2 * s);
    steps.push({
      step: 1,
      title: "Datos",
      detail: "Conocemos velocidades y distancia.",
      formula: `v_0 = ${fmt(u)},\\quad v = ${fmt(v)},\\quad s = ${fmt(s)}`,
    });
    steps.push({
      step: 2,
      title: "Aceleración",
      detail: "De v² = v₀² + 2as despejamos a.",
      formula: `a = \\frac{v^2 - v_0^2}{2s} = \\frac{${fmt(v)}^2 - ${fmt(
        u
      )}^2}{2(${fmt(s)})} = ${fmt(acc)}`,
    });
    return {
      ok: true,
      area: "physics",
      topic: "kinematics",
      topicLabel: "Cinemática",
      input,
      finalResult: `a = ${fmt(acc)}`,
      finalText: `Aceleración = ${fmt(acc)}`,
      steps,
      formulas,
      confidence: "high",
    };
  }

  // u, a, s
  if (u !== null && a !== null && s !== null) {
    const vfSq = u * u + 2 * a * s;
    const vf = vfSq >= 0 ? Math.sqrt(vfSq) : NaN;
    steps.push({
      step: 1,
      title: "Datos",
      detail: "Conocemos velocidad inicial, aceleración y distancia.",
      formula: `v_0 = ${fmt(u)},\\quad a = ${fmt(a)},\\quad s = ${fmt(s)}`,
    });
    steps.push({
      step: 2,
      title: "Velocidad final",
      detail: "De v² = v₀² + 2as.",
      formula: `v = \\sqrt{${fmt(u)}^2 + 2(${fmt(a)})(${fmt(s)})} = ${fmt(vf)}`,
    });
    return {
      ok: true,
      area: "physics",
      topic: "kinematics",
      topicLabel: "Cinemática",
      input,
      finalResult: `v = ${fmt(vf)}`,
      finalText: `Velocidad final = ${fmt(vf)}`,
      steps,
      formulas,
      confidence: "high",
    };
  }

  // v0, v, a  ->  distancia  (típico: "frena hasta detenerse")
  if (u !== null && v !== null && a !== null && a !== 0) {
    const dist = (v * v - u * u) / (2 * a);
    steps.push({
      step: 1,
      title: "Datos",
      detail: "Conocemos velocidades y aceleración.",
      formula: `v_0 = ${fmt(u)},\\quad v = ${fmt(v)},\\quad a = ${fmt(a)}`,
    });
    steps.push({
      step: 2,
      title: "Distancia",
      detail: "De v² = v₀² + 2as despejamos s.",
      formula: `s = \\frac{v^2 - v_0^2}{2a} = \\frac{${fmt(v)}^2 - ${fmt(
        u
      )}^2}{2(${fmt(a)})} = ${fmt(dist)}`,
    });
    return {
      ok: true,
      area: "physics",
      topic: "kinematics",
      topicLabel: a < 0 ? "Cinemática · Frenado" : "Cinemática",
      input,
      finalResult: `s = ${fmt(dist)}`,
      finalText: `Distancia = ${fmt(dist)}`,
      steps,
      formulas,
      confidence: "high",
    };
  }

  // Solo distancia y tiempo => movimiento rectilíneo uniforme (v constante).
  if (
    u === null &&
    v === null &&
    a === null &&
    s !== null &&
    time !== null &&
    time !== 0
  ) {
    const vm = s / time;
    steps.push({
      step: 1,
      title: "Datos",
      detail: "Movimiento rectilíneo uniforme: la velocidad es constante.",
      formula: `s = ${fmt(s)}\\ \\text{m},\\quad t = ${fmt(time)}\\ \\text{s}`,
    });
    steps.push({
      step: 2,
      title: "Velocidad media",
      detail: "Velocidad constante = distancia entre tiempo.",
      formula: `v = \\frac{s}{t} = \\frac{${fmt(s)}}{${fmt(time)}} = ${fmt(
        vm
      )}\\ \\text{m/s}`,
    });
    return {
      ok: true,
      area: "physics",
      topic: "kinematics",
      topicLabel: "Cinemática · Movimiento uniforme",
      input,
      finalResult: `v = ${fmt(vm)}\\ \\text{m/s}`,
      finalText: `Velocidad = ${fmt(vm)} m/s`,
      steps,
      formulas,
      confidence: "high",
    };
  }

  // v0, s y t => aceleración (típico: "frena hasta parar en X m").
  if (u !== null && v === null && a === null && s !== null && time !== null && time !== 0) {
    const acc = (2 * (s - u * time)) / (time * time);
    steps.push({
      step: 1,
      title: "Datos",
      detail: "Conocemos velocidad inicial, distancia y tiempo.",
      formula: `v_0 = ${fmt(u)},\\quad s = ${fmt(s)},\\quad t = ${fmt(time)}`,
    });
    steps.push({
      step: 2,
      title: "Aceleración",
      detail: "De s = v₀t + ½at² despejamos a.",
      formula: `a = \\frac{2(s - v_0 t)}{t^2} = \\frac{2(${fmt(s)} - ${fmt(u)}(${fmt(
        time
      )}))}{${fmt(time)}^2} = ${fmt(acc)}`,
    });
    return {
      ok: true,
      area: "physics",
      topic: "kinematics",
      topicLabel: "Cinemática",
      input,
      finalResult: `a = ${fmt(acc)}`,
      finalText: `Aceleración = ${fmt(acc)} m/s²`,
      steps,
      formulas,
      confidence: "high",
    };
  }

  const found = extractNumbers(t);
  return fail(
    `Need más datos para resolver el problema de cinemática.${
      found.length ? " Números detectados: " + found.join(", ") : ""
    }`,
    "Indica al menos tres magnitudes con sus nombres. Ej: velocidad inicial 0 m/s, aceleración 10 m/s², tiempo 5 s.",
    "kinematics"
  );
}

/* ---------------------------------------------------------------------------
 * Dinámica
 * ------------------------------------------------------------------------- */

function solveDynamics(input: string): Solution | SolveFailure {
  const t = input.toLowerCase();
  const m = magnitude(t, P.m) ?? byUnit(t, U.kg);
  const a = magnitude(t, P.a) ?? byUnit(t, U.accel);
  const F = magnitude(t, P.F) ?? byUnit(t, U.newton);
  const weight = /peso/i.test(t);
  const formulas = ["F = m\\,a", "W = m\\,g"];

  if (weight || (m !== null && a === null && F === null && /peso|newton/i.test(t))) {
    if (m !== null) {
      const g = gravityOf(t);
      const w = m * g;
      const steps: SolutionStep[] = [
        {
          step: 1,
          title: "Datos",
          detail: "Masa y gravedad.",
          formula: `m = ${fmt(m)}\\ \\text{kg},\\quad g = ${fmt(g)}\\ \\text{m/s}^2`,
        },
        {
          step: 2,
          title: "Peso",
          detail: "El peso es la fuerza gravitatoria: W = m·g.",
          formula: `W = ${fmt(m)} \\cdot ${fmt(g)} = ${fmt(w)}\\ \\text{N}`,
        },
      ];
      return {
        ok: true,
        area: "physics",
        topic: "dynamics",
        topicLabel: "Dinámica · Peso",
        input,
        finalResult: `W = ${fmt(w)}\\ \\text{N}`,
        finalText: `Peso = ${fmt(w)} N`,
        steps,
        formulas,
        confidence: "high",
      };
    }
  }

  if (m !== null && a !== null) {
    const force = m * a;
    const steps: SolutionStep[] = [
      {
        step: 1,
        title: "Datos",
        detail: "Segunda ley de Newton.",
        formula: `m = ${fmt(m)}\\ \\text{kg},\\quad a = ${fmt(a)}\\ \\text{m/s}^2`,
      },
      {
        step: 2,
        title: "Fuerza resultante",
        detail: "F = m·a.",
        formula: `F = ${fmt(m)} \\cdot ${fmt(a)} = ${fmt(force)}\\ \\text{N}`,
      },
    ];
    return {
      ok: true,
      area: "physics",
      topic: "dynamics",
      topicLabel: "Dinámica · Fuerza",
      input,
      finalResult: `F = ${fmt(force)}\\ \\text{N}`,
      finalText: `Fuerza = ${fmt(force)} N`,
      steps,
      formulas,
      confidence: "high",
    };
  }

  if (F !== null && m !== null && m !== 0) {
    const acc = F / m;
    const steps: SolutionStep[] = [
      {
        step: 1,
        title: "Datos",
        detail: "Fuerza y masa.",
        formula: `F = ${fmt(F)}\\ \\text{N},\\quad m = ${fmt(m)}\\ \\text{kg}`,
      },
      {
        step: 2,
        title: "Aceleración",
        detail: "De F = m·a despejamos a = F/m.",
        formula: `a = \\frac{${fmt(F)}}{${fmt(m)}} = ${fmt(acc)}\\ \\text{m/s}^2`,
      },
    ];
    return {
      ok: true,
      area: "physics",
      topic: "dynamics",
      topicLabel: "Dinámica · Aceleración",
      input,
      finalResult: `a = ${fmt(acc)}\\ \\text{m/s}^2`,
      finalText: `Aceleración = ${fmt(acc)} m/s²`,
      steps,
      formulas,
      confidence: "high",
    };
  }

  if (F !== null && a !== null && a !== 0) {
    const mass = F / a;
    return {
      ok: true,
      area: "physics",
      topic: "dynamics",
      topicLabel: "Dinámica · Masa",
      input,
      finalResult: `m = ${fmt(mass)}\\ \\text{kg}`,
      finalText: `Masa = ${fmt(mass)} kg`,
      steps: [
        {
          step: 1,
          title: "Datos",
          detail: "Fuerza y aceleración.",
          formula: `F = ${fmt(F)},\\quad a = ${fmt(a)}`,
        },
        {
          step: 2,
          title: "Masa",
          detail: "De F = m·a despejamos m = F/a.",
          formula: `m = \\frac{${fmt(F)}}{${fmt(a)}} = ${fmt(mass)}\\ \\text{kg}`,
        },
      ],
      formulas,
      confidence: "high",
    };
  }

  return fail(
    "Necesito al menos dos de estas magnitudes para dinámica: masa, aceleración o fuerza.",
    "Ej: una masa de 2 kg acelera a 5 m/s², ¿cuál es la fuerza?",
    "dynamics"
  );
}

/* ---------------------------------------------------------------------------
 * Energía y trabajo
 * ------------------------------------------------------------------------- */

function solveEnergy(input: string): Solution | SolveFailure {
  const t = input.toLowerCase();
  const m = magnitude(t, P.m) ?? byUnit(t, U.kg);
  const v = magnitude(t, P.v) ?? byUnit(t, U.velocity);
  const h = magnitude(t, P.h);
  const F = magnitude(t, P.F) ?? byUnit(t, U.newton);
  const d = magnitude(t, P.s);
  const formulas = [
    "E_c = \\tfrac{1}{2} m v^2",
    "E_p = m g h",
    "W = F \\cdot d",
  ];

  if (/cin[eé]tica/i.test(t) || (m !== null && v !== null)) {
    if (m !== null && v !== null) {
      const ke = 0.5 * m * v * v;
      return {
        ok: true,
        area: "physics",
        topic: "energy",
        topicLabel: "Energía · Cinética",
        input,
        finalResult: `E_c = ${fmt(ke)}\\ \\text{J}`,
        finalText: `Energía cinética = ${fmt(ke)} J`,
        steps: [
          {
            step: 1,
            title: "Datos",
            detail: "Masa y velocidad.",
            formula: `m = ${fmt(m)}\\ \\text{kg},\\quad v = ${fmt(v)}\\ \\text{m/s}`,
          },
          {
            step: 2,
            title: "Energía cinética",
            detail: "Aplicamos E_c = ½ m v².",
            formula: `E_c = \\tfrac{1}{2}(${fmt(m)})(${fmt(v)})^2 = ${fmt(ke)}\\ \\text{J}`,
          },
        ],
        formulas,
        confidence: "high",
      };
    }
  }

  if (/potencial/i.test(t) || (m !== null && h !== null)) {
    if (m !== null && h !== null) {
      const g = gravityOf(t);
      const pe = m * g * h;
      return {
        ok: true,
        area: "physics",
        topic: "energy",
        topicLabel: "Energía · Potencial",
        input,
        finalResult: `E_p = ${fmt(pe)}\\ \\text{J}`,
        finalText: `Energía potencial = ${fmt(pe)} J`,
        steps: [
          {
            step: 1,
            title: "Datos",
            detail: "Masa, gravedad y altura.",
            formula: `m = ${fmt(m)},\\quad g = ${fmt(g)},\\quad h = ${fmt(h)}`,
          },
          {
            step: 2,
            title: "Energía potencial",
            detail: "Aplicamos E_p = m·g·h.",
            formula: `E_p = (${fmt(m)})(${fmt(g)})(${fmt(h)}) = ${fmt(pe)}\\ \\text{J}`,
          },
        ],
        formulas,
        confidence: "high",
      };
    }
  }

  if (/trabajo/i.test(t) || (F !== null && d !== null)) {
    if (F !== null && d !== null) {
      const w = F * d;
      return {
        ok: true,
        area: "physics",
        topic: "energy",
        topicLabel: "Trabajo",
        input,
        finalResult: `W = ${fmt(w)}\\ \\text{J}`,
        finalText: `Trabajo = ${fmt(w)} J`,
        steps: [
          {
            step: 1,
            title: "Datos",
            detail: "Fuerza y distancia.",
            formula: `F = ${fmt(F)}\\ \\text{N},\\quad d = ${fmt(d)}\\ \\text{m}`,
          },
          {
            step: 2,
            title: "Trabajo",
            detail: "Aplicamos W = F·d (fuerza en la dirección del movimiento).",
            formula: `W = (${fmt(F)})(${fmt(d)}) = ${fmt(w)}\\ \\text{J}`,
          },
        ],
        formulas,
        confidence: "high",
      };
    }
  }

  return fail(
    "Necesito datos para energía/trabajo: masa+velocidad, masa+altura, o fuerza+distancia.",
    "Ej: ¿energía cinética de 2 kg a 3 m/s?  o  trabajo de 10 N en 4 m.",
    "energy"
  );
}

/* ---------------------------------------------------------------------------
 * Cantidad de movimiento
 * ------------------------------------------------------------------------- */

function solveMomentum(input: string): Solution | SolveFailure {
  const t = input.toLowerCase();
  const m = magnitude(t, P.m) ?? byUnit(t, U.kg);
  const v = magnitude(t, P.v) ?? byUnit(t, U.velocity);
  if (m !== null && v !== null) {
    const p = m * v;
    return {
      ok: true,
      area: "physics",
      topic: "momentum",
      topicLabel: "Cantidad de movimiento",
      input,
      finalResult: `p = ${fmt(p)}\\ \\text{kg·m/s}`,
      finalText: `p = ${fmt(p)} kg·m/s`,
      steps: [
        {
          step: 1,
          title: "Datos",
          detail: "Masa y velocidad.",
          formula: `m = ${fmt(m)}\\ \\text{kg},\\quad v = ${fmt(v)}\\ \\text{m/s}`,
        },
        {
          step: 2,
          title: "Cantidad de movimiento",
          detail: "p = m·v.",
          formula: `p = (${fmt(m)})(${fmt(v)}) = ${fmt(p)}\\ \\text{kg·m/s}`,
        },
      ],
      formulas: ["p = m\\,v", "J = \\Delta p = F \\, t"],
      confidence: "high",
    };
  }
  return fail(
    "Necesito masa y velocidad para la cantidad de movimiento.",
    "Ej: cantidad de movimiento de 2 kg a 5 m/s.",
    "momentum"
  );
}

/* ---------------------------------------------------------------------------
 * Electricidad (Ley de Ohm)
 * ------------------------------------------------------------------------- */

function solveElectricity(input: string): Solution | SolveFailure {
  const t = input.toLowerCase();
  const V = magnitude(t, P.V) ?? byUnit(t, U.volt);
  const I = magnitude(t, P.I) ?? byUnit(t, U.amp);
  const R = magnitude(t, P.R) ?? byUnit(t, U.ohm);
  const formulas = ["V = I\\,R", "P = V\\,I"];

  if (V !== null && I !== null) {
    const r = I !== 0 ? V / I : NaN;
    const p = V * I;
    return {
      ok: true,
      area: "physics",
      topic: "electricity",
      topicLabel: "Electricidad · Ley de Ohm",
      input,
      finalResult: `R = ${fmt(r)}\\ \\Omega,\\quad P = ${fmt(p)}\\ \\text{W}`,
      finalText: `R = ${fmt(r)} Ω, P = ${fmt(p)} W`,
      steps: [
        {
          step: 1,
          title: "Datos",
          detail: "Voltaje y corriente.",
          formula: `V = ${fmt(V)}\\ \\text{V},\\quad I = ${fmt(I)}\\ \\text{A}`,
        },
        {
          step: 2,
          title: "Resistencia",
          detail: "De V = I·R despejamos R = V/I.",
          formula: `R = \\frac{${fmt(V)}}{${fmt(I)}} = ${fmt(r)}\\ \\Omega`,
        },
        {
          step: 3,
          title: "Potencia",
          detail: "P = V·I.",
          formula: `P = (${fmt(V)})(${fmt(I)}) = ${fmt(p)}\\ \\text{W}`,
        },
      ],
      formulas,
      confidence: "high",
    };
  }

  if (I !== null && R !== null) {
    const v = I * R;
    return {
      ok: true,
      area: "physics",
      topic: "electricity",
      topicLabel: "Electricidad · Ley de Ohm",
      input,
      finalResult: `V = ${fmt(v)}\\ \\text{V}`,
      finalText: `V = ${fmt(v)} V`,
      steps: [
        {
          step: 1,
          title: "Datos",
          detail: "Corriente y resistencia.",
          formula: `I = ${fmt(I)}\\ \\text{A},\\quad R = ${fmt(R)}\\ \\Omega`,
        },
        {
          step: 2,
          title: "Voltaje",
          detail: "V = I·R.",
          formula: `V = (${fmt(I)})(${fmt(R)}) = ${fmt(v)}\\ \\text{V}`,
        },
      ],
      formulas,
      confidence: "high",
    };
  }

  if (V !== null && R !== null) {
    const i = R !== 0 ? V / R : NaN;
    return {
      ok: true,
      area: "physics",
      topic: "electricity",
      topicLabel: "Electricidad · Ley de Ohm",
      input,
      finalResult: `I = ${fmt(i)}\\ \\text{A}`,
      finalText: `I = ${fmt(i)} A`,
      steps: [
        {
          step: 1,
          title: "Datos",
          detail: "Voltaje y resistencia.",
          formula: `V = ${fmt(V)}\\ \\text{V},\\quad R = ${fmt(R)}\\ \\Omega`,
        },
        {
          step: 2,
          title: "Corriente",
          detail: "De V = I·R despejamos I = V/R.",
          formula: `I = \\frac{${fmt(V)}}{${fmt(R)}} = ${fmt(i)}\\ \\text{A}`,
        },
      ],
      formulas,
      confidence: "high",
    };
  }

  return fail(
    "Necesito al menos dos de estas magnitudes: voltaje (V), corriente (I) o resistencia (R).",
    "Ej: un circuito con 12 V y 4 Ω, ¿cuál es la corriente?",
    "electricity"
  );
}

/* ---------------------------------------------------------------------------
 * Dispatcher de física
 * ------------------------------------------------------------------------- */

export function solvePhysics(input: string, topic: string): Solution | SolveFailure {
  switch (topic) {
    case "kinematics":
      return solveKinematics(input);
    case "dynamics":
      return solveDynamics(input);
    case "energy":
      return solveEnergy(input);
    case "momentum":
      return solveMomentum(input);
    case "electricity":
      return solveElectricity(input);
    case "waves":
    case "thermodynamics":
    case "gravitation":
    case "magnetism":
      return fail(
        `El tema "${topicLabel(topic as any)}" aún no está implementado en el motor de cálculo.`,
        "Prueba con cinemática, dinámica, energía, cantidad de movimiento o electricidad.",
        topic as any
      );
    default:
      // Auto-selección
      const t = input.toLowerCase();
      if (/proyectil|tiro|ca[ií]da libre|cae|aceleraci|velocidad|m\/s/.test(t))
        return solveKinematics(input);
      if (/fuerza|masa|peso|newton|din[aá]mica/.test(t)) return solveDynamics(input);
      if (/energ|trabajo|joule|potencia/.test(t)) return solveEnergy(input);
      if (/momento|cantidad de movimiento|impulso/.test(t))
        return solveMomentum(input);
      if (/circuito|voltaje|corriente|resistencia|ohm/.test(t))
        return solveElectricity(input);
      return solveKinematics(input);
  }
}

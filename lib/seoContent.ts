import type { Solution, Topic } from "./solver/types";

/**
 * Contenido complementario por problema.
 *
 * Motivo: generar cientos de páginas de "problema + solución" casi idénticas
 * activa el filtro de contenido útil de Google (*thin content*) y puede
 * desindexar el sitio entero. Para que cada página aporte valor real añadimos:
 *
 *   1. Errores comunes      → lo que el estudiante suele fallar en ESTE problema
 *   2. Teoría / fórmulas    → el marco conceptual que hay detrás
 *   3. Método alternativo   → una segunda forma de resolverlo/comprobarlo
 *   4. Consejo de examen    → recomendación práctica
 *
 * Todo se texturiza con el enunciado (`input`) y la respuesta (`finalText`),
 * de modo que dos páginas distintas nunca quedan idénticas.
 *
 * Regla de diseño: **nunca afirmar nada matemáticamente falso**. Si un detalle
 * depende de los coeficientes concretos y no los conocemos con seguridad, se
 * enuncia de forma genérica y correcta.
 */

export interface TheoryFormula {
  /** LaTeX de la fórmula. */
  tex: string;
  /** Qué significa, en palabras. */
  label: string;
}

export interface Enrichment {
  mistakes: string[];
  theory: { title: string; intro: string; formulas: TheoryFormula[] };
  alternative: { title: string; intro: string; lines: string[] };
  examTip: string;
}

interface Ctx {
  input: string;
  finalText: string;
  /** true si el enunciado parece una cuadrática (x^2, ^2, x²…). */
  quadratic: boolean;
}

function makeCtx(sol: Solution): Ctx {
  const input = (sol.input || "").trim();
  const finalText = (sol.finalText || "").trim();
  const quadratic = /x\s*[\^²]|²\s*x|\^\s*2/.test(input) && sol.topic === "equation";
  return { input, finalText, quadratic };
}

/* ---------------------------------------------------------------------------
 * Fallback: si el tema no tiene contenido específico
 * ------------------------------------------------------------------------- */

function generic(sol: Solution, ctx: Ctx): Enrichment {
  const physics = sol.area === "physics";
  return {
    mistakes: [
      `Saltarse la interpretación del enunciado de «${ctx.input}». Antes de operar, subraya qué datos te dan y qué te piden.`,
      physics
        ? "Mezclar unidades (por ejemplo m/s con km/h, o kg con N) sin convertirlas antes. El resultado solo es válido si todas las magnitudes están en el mismo sistema."
        : "Operar sin comprobar el orden de las operaciones. Revisa que cada transformación sea equivalente a la anterior.",
      ctx.finalText
        ? `No verificar la respuesta. Sustituye ${ctx.finalText} en el planteamiento original y comprueba que se cumple.`
        : "No verificar el resultado: siempre conviene comprobarlo sustituyéndolo en el enunciado original.",
    ],
    theory: {
      title: "Marco teórico",
      intro: physics
        ? "Toda física se resuelve igual: identificar magnitudes, elegir la relación que las conecta, sustituir con unidades coherentes y comprobar."
        : "Todo problema se resuelve en cuatro fases: interpretar, planificar, ejecutar y verificar. La fase que más errores evita es la última.",
      formulas: physics
        ? [
            { tex: "\\text{datos} \\rightarrow \\text{fórmula} \\rightarrow \\text{resultado}", label: "Método general de resolución" },
            { tex: "[\\text{resultado}] = [\\text{dato}_1]\\cdot[\\text{dato}_2]", label: "Comprobación dimensional: las unidades deben cuadrar" },
          ]
        : [
            { tex: "\\text{problema} \\rightarrow \\text{modelo} \\rightarrow \\text{cálculo} \\rightarrow \\text{comprobación}", label: "Las cuatro fases de resolución" },
          ],
    },
    alternative: {
      title: physics ? "Método alternativo: comprobación dimensional" : "Método alternativo: comprobación inversa",
      intro: physics
        ? "Antes incluso de calcular puedes detectar muchos errores mirando solo las unidades."
        : "Una forma rápida de saber si el resultado es razonable sin repetir todo el desarrollo.",
      lines: physics
        ? [
            "Escribe las unidades de cada dato tal como aparecen en el enunciado.",
            "Comprueba qué operaciones (suma, producto, raíz…) exige la fórmula y si las unidades son compatibles.",
            "La unidad del resultado debe coincidir con la que espera el enunciado.",
          ]
        : [
            "Haz una estimación grosera del resultado (redondeando los números).",
            `Compara esa estimación con la respuesta ${ctx.finalText || "obtenida"}: si coinciden en orden de magnitud, es una buena señal.`,
            "Aplica la operación inversa al resultado para ver si recuperas el dato de partida.",
          ],
    },
    examTip: physics
      ? "En el examen, dedica 20 segundos a listar los datos con sus unidades antes de tocar la calculadora: te ahorra la mitad de los errores."
      : "En el examen, escribe cada paso en una línea aparte. Si te equivocas, el profesor da parte por el método y puedes corregir sin empezar de cero.",
  };
}

/* ---------------------------------------------------------------------------
 * Aritmética
 * ------------------------------------------------------------------------- */

function arithmetic(sol: Solution, ctx: Ctx): Enrichment {
  return {
    mistakes: [
      `Empezar por sumas y restas en «${ctx.input}». La jerarquía es fija: paréntesis, potencias, multiplicaciones y divisiones, y solo al final sumas y restas.`,
      "Resolver de izquierda a derecha ignorando la jerarquía. El orden de las operaciones no es opcional: 5 + 3 · 4 vale 17, no 32.",
      ctx.finalText
        ? `No comprobar. Haz la operación al revés o agrupa de otra forma y verifica que sale ${ctx.finalText}.`
        : "No comprobar la operación repitiéndola agrupando de otra manera.",
    ],
    theory: {
      title: "Jerarquía de operaciones",
      intro:
        "La jerarquía de operaciones (PEMDAS/BODMAS) establece un orden único e imposible de modificar: primero lo que está entre paréntesis, luego potencias y raíces, después multiplicaciones y divisiones de izquierda a derecha, y por último sumas y restas.",
      formulas: [
        { tex: "5 + 3 \\cdot 4 = 5 + 12 = 17", label: "La multiplicación va antes que la suma" },
        { tex: "(5 + 3) \\cdot 4 = 8 \\cdot 4 = 32", label: "Los paréntesis cambian por completo el resultado" },
        { tex: "a \\div b \\div c = (a \\div b) \\div c", label: "Multiplicar y dividir se resuelven de izquierda a derecha" },
      ],
    },
    alternative: {
      title: "Método alternativo: resolver por bloques",
      intro: "Descompón la operación en partes pequeñas y ve comprobando cada bloque.",
      lines: [
        "Agrupa y resuelve primero todo lo que está entre paréntesis.",
        "Sustituye ese valor y elimina potencias y raíces.",
        "Reduce multiplicaciones y divisiones de izquierda a derecha.",
        `Y deja sumas y restas para el final: el resultado debe ser ${ctx.finalText || "el mismo"}.`,
      ],
    },
    examTip:
      "Tacha cada operación a medida que la resuelves. Es el truco más eficaz contra los errores de concentración en operaciones largas.",
  };
}

/* ---------------------------------------------------------------------------
 * Ecuaciones
 * ------------------------------------------------------------------------- */

function equation(sol: Solution, ctx: Ctx): Enrichment {
  if (ctx.quadratic) {
    return {
      mistakes: [
        `Mover un término de lado sin cambiarle el signo. En «${ctx.input}» todo se lleva a un mismo lado igualando a cero antes de aplicar cualquier método.`,
        "Olvidar el ± de la fórmula general. Toda ecuación cuadrática tiene dos soluciones (aunque a veces sean repetidas o complejas).",
        ctx.finalText
          ? `No comprobar las soluciones. Al sustituir ${ctx.finalText} en la ecuación original, el primer miembro debe dar exactamente cero.`
          : "No comprobar las soluciones sustituyéndolas en la ecuación original.",
      ],
      theory: {
        title: "Ecuación de segundo grado",
        intro:
          "Toda ecuación cuadrática se escribe en forma canónica ax² + bx + c = 0. El discriminante Δ determina el número y el tipo de soluciones: si es positivo hay dos reales distintas, si es cero una doble y si es negativo dos complejas conjugadas.",
        formulas: [
          { tex: "ax^2 + bx + c = 0", label: "Forma canónica" },
          { tex: "x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}", label: "Fórmula general (regla de Bhaskara)" },
          { tex: "\\Delta = b^2 - 4ac", label: "Discriminante: decide cuántas soluciones hay" },
          { tex: "x_1 + x_2 = -\\frac{b}{a}, \\quad x_1 \\cdot x_2 = \\frac{c}{a}", label: "Relaciones de Vieta (para comprobar sin resolver)" },
        ],
      },
      alternative: {
        title: "Método alternativo: factorización",
        intro:
          "Si las raíces son números «bonitos» (enteros o racionales) se resuelve de forma mucho más rápida que con la fórmula general.",
        lines: [
          "Reescribe la ecuación igualada a cero: ax² + bx + c = 0.",
          "Si a = 1, busca dos números que sumen b y multipliquen c.",
          "Descompón en factores: (x − x₁)(x − x₂) = 0.",
          "Igualando cada factor a cero obtienes las dos soluciones. Compara con la respuesta obtenida.",
        ],
      },
      examTip:
        "Calcula primero el discriminante Δ. En tres líneas sabes cuántas soluciones hay y si el resultado debe ser entero, fraccionario o complejo: te evita un desarrollo entero equivocado.",
    };
  }

  return {
    mistakes: [
      `Aplicar operaciones diferentes a cada miembro de «${ctx.input}». La igualdad solo se conserva si haces exactamente lo mismo a izquierda y a derecha.`,
      "Invertir mal el signo al pasar un término al otro lado. Pasar restando es cambiar el signo; pasar dividiendo es invertir la operación.",
      ctx.finalText
        ? `No verificar la solución. Sustituye x = ${ctx.finalText} en la ecuación y comprueba que ambos miembros coinciden.`
        : "No verificar la solución sustituyéndola en la ecuación original.",
    ],
    theory: {
      title: "Ecuación de primer grado",
      intro:
        "Una ecuación de primer grado tiene una única solución: el valor de la incógnita que hace verdadera la igualdad. Se resuelve despejando, aplicando las propiedades de la igualdad (suma, producto y potencia mantienen la igualdad en ambos miembros).",
      formulas: [
        { tex: "ax + b = c \\;\\Rightarrow\\; x = \\frac{c - b}{a}", label: "Despeje general" },
        { tex: "a = b \\;\\Leftrightarrow\\; a + k = b + k", label: "Propiedad de la suma (vale para restas también)" },
        { tex: "a = b \\;\\Leftrightarrow\\; a \\cdot k = b \\cdot k \\quad (k \\neq 0)", label: "Propiedad del producto (y de la división)" },
      ],
    },
    alternative: {
      title: "Método alternativo: comprobación sustituyendo",
      intro: "No hace falta repetir el despeje: basta sustituir la solución para demostrar que es correcta.",
      lines: [
        `Toma la solución obtenida${ctx.finalText ? ` (${ctx.finalText})` : ""}.`,
        "Sustituye la incógnita por ese valor en la ecuación original.",
        "Desarrolla cada miembro por separado.",
        "Si los dos miembros dan el mismo número, la solución es correcta.",
      ],
    },
    examTip:
      "Aprovecha las propiedades de la igualdad: puedes restar el término que te estorja en un solo paso en lugar de llevarlo a través de toda la igualdad. Menos pasos, menos errores de signo.",
  };
}

/* ---------------------------------------------------------------------------
 * Derivadas
 * ------------------------------------------------------------------------- */

function derivative(sol: Solution, ctx: Ctx): Enrichment {
  return {
    mistakes: [
      "Confundir la potencia con el coeficiente. En 3x⁴ el coeficiente es 3 y la potencia 4: se multiplica 3 · 4 = 12 y luego se baja la potencia a 3.",
      "Olvidar que la derivada de una constante es cero, o que el coeficiente se mantiene pero no se deriva.",
      "Derivar un cociente como si fuera un producto. Si hay división de expresiones con incógnita, aplica la regla del cociente; si hay composición, la regla de la cadena.",
    ],
    theory: {
      title: "Reglas de derivación",
      intro:
        "La derivada mide la tasa de cambio instantánea de una función (la pendiente de la recta tangente). Todas las reglas se derivan de la definición por límites, pero en la práctica se aplica una tabla de reglas.",
      formulas: [
        { tex: "\\frac{d}{dx}[x^n] = n\\,x^{n-1}", label: "Regla de la potencia (la más usada)" },
        { tex: "\\frac{d}{dx}[c] = 0", label: "La derivada de una constante es cero" },
        { tex: "\\frac{d}{dx}[f+g] = f' + g'", label: "La derivada de una suma es la suma de derivadas" },
        { tex: "\\frac{d}{dx}[\\sin x] = \\cos x, \\quad \\frac{d}{dx}[\\cos x] = -\\sin x", label: "Derivadas trigonométricas (¡en radianes!)" },
        { tex: "\\frac{d}{dx}[f(g(x))] = f'(g(x))\\cdot g'(x)", label: "Regla de la cadena, para funciones compuestas" },
      ],
    },
    alternative: {
      title: "Método alternativo: comprobación por el signo",
      intro: "La derivada también se puede interpretar gráficamente para validar el resultado.",
      lines: [
        "Dibuja (o imagina) la gráfica de la función original.",
        "Donde la función sube, tu derivada debe dar positivo; donde baja, negativo.",
        "En los máximos y mínimos, la derivada debe valer cero.",
        `Comprueba que tu resultado ${ctx.finalText ? `${ctx.finalText} ` : ""}cumple esas condiciones.`,
      ],
    },
    examTip:
      "Deriva término a término sin agrupar y simplifica al final. Y si tienes prisa: deriva, y vuelve a derivar el resultado; si sale la segunda derivada coherente, la primera es muy probablemente correcta.",
  };
}

/* ---------------------------------------------------------------------------
 * Integrales
 * ------------------------------------------------------------------------- */

function integral(sol: Solution, ctx: Ctx): Enrichment {
  return {
    mistakes: [
      "Olvidar la constante +C en la integral indefinida: sin ella solo has encontrado una de las infinitas primitivas.",
      "Equivocarse en el exponente: al integrar xⁿ se sube la potencia y se divide por (n+1), no al revés. Eso es lo que se hace al derivar.",
      "En la integral definida, restar mal los límites: siempre es F(superior) − F(inferior), y hay que sustituir TODOS los términos.",
    ],
    theory: {
      title: "Integral indefinida y definida",
      intro:
        "La integral es la operación inversa de la derivada: buscar la función cuya derivada es la dada (la primitiva). La integral definida calcula el área neta bajo la curva entre dos valores.",
      formulas: [
        { tex: "\\int x^n \\,dx = \\frac{x^{n+1}}{n+1} + C \\quad (n \\neq -1)", label: "Regla de la potencia para integrales" },
        { tex: "\\int_a^b f(x)\\,dx = F(b) - F(a)", label: "Teorema fundamental del cálculo (Newton–Leibniz)" },
        { tex: "\\int (f + g)\\,dx = \\int f\\,dx + \\int g\\,dx", label: "Linealidad: se integra término a término" },
        { tex: "\\int \\sin x\\,dx = -\\cos x + C", label: "Integral trigonométrica frecuente" },
      ],
    },
    alternative: {
      title: "Método alternativo: comprobar derivando",
      intro:
        "Es la mejor verificación posible y tarda diez segundos: si la derivada de tu resultado es el integrando, aciertas seguro.",
      lines: [
        `Toma tu resultado${ctx.finalText ? ` (${ctx.finalText})` : ""}.`,
        "Deriva esa expresión término a término.",
        "Compara con la función que tenías dentro de la integral.",
        "Si coinciden, la integral es correcta. Si no, revisa el exponente o el signo.",
      ],
    },
    examTip:
      "Escribe siempre el +C aunque en la fórmula no se te pida: en los exámenes descontado. Y en las definidas, sustituye los límites entre paréntesis antes de restar: evita el error clásico de signo.",
  };
}

/* ---------------------------------------------------------------------------
 * Geometría
 * ------------------------------------------------------------------------- */

function geometry(sol: Solution, ctx: Ctx): Enrichment {
  return {
    mistakes: [
      "Usar el diámetro donde pide el radio (o viceversa). Si el enunciado da el diámetro, divídelo entre dos antes de sustituir.",
      "Olvidar las unidades en la potencia: el área se mide en unidades al cuadrado (cm²) y el volumen al cubo (cm³).",
      ctx.finalText
        ? `No comprobar el orden de magnitud. Dibuja o estima el valor: si sale ${ctx.finalText}, ¿es razonable para las medidas dadas?`
        : "No comprobar el orden de magnitud del resultado respecto a las medidas dadas.",
    ],
    theory: {
      title: "Fórmulas geométricas básicas",
      intro:
        "La geometría se reduce a reconocer la figura y elegir la fórmula correcta. Dibuja siempre la figura y anota los datos encima: la mitad de los errores se evitan así.",
      formulas: [
        { tex: "A_{\\text{círculo}} = \\pi r^2", label: "Área del círculo (r = radio)" },
        { tex: "V_{\\text{esfera}} = \\frac{4}{3}\\pi r^3", label: "Volumen de la esfera" },
        { tex: "A_{\\text{triángulo}} = \\frac{b \\cdot h}{2}", label: "Área del triángulo" },
        { tex: "c^2 = a^2 + b^2", label: "Teorema de Pitágoras (triángulo rectángulo)" },
        { tex: "A_{\\text{rectángulo}} = b \\cdot h, \\quad P = 2(b+h)", label: "Área y perímetro del rectángulo" },
      ],
    },
    alternative: {
      title: "Método alternativo: comprobación por unidades",
      intro: "Las unidades te dicen si has usado la fórmula correcta, incluso sin haber calculado nada.",
      lines: [
        "Escribe las unidades de cada dato del enunciado (cm, m, cm²…).",
        "Si el problema pide un área, el resultado debe terminar en unidades al cuadrado; si pide volumen, al cubo.",
        "Si te sale una unidad lineal pedían un área, has usado la fórmula equivocada.",
        `Verifica que ${ctx.finalText || "el resultado"} cumple esa regla.`,
      ],
    },
    examTip:
      "Dibuja la figura a escala aproximada y marca los datos. Si el resultado te queda desproporcionado respecto al dibujo, es una alerta inmediata de error.",
  };
}

/* ---------------------------------------------------------------------------
 * Trigonometría
 * ------------------------------------------------------------------------- */

function trigonometry(sol: Solution, ctx: Ctx): Enrichment {
  return {
    mistakes: [
      "Mezclar grados y radianes. Si el enunciado da ángulos en grados, todo el cálculo va en grados.",
      "Intercambiar seno y coseno: el seno es el cateto opuesto entre la hipotenusa y el coseno el cateto adyacente entre la hipotenusa.",
      "Usar la calculadora sin comprobar el modo: en RAD hace que casi todos los valores de 30°, 45° o 60° salgan «raros».",
    ],
    theory: {
      title: "Funciones trigonométricas",
      intro:
        "El seno, el coseno y la tangente relacionan los ángulos de un triángulo rectángulo con la razón entre sus lados. En el círculo unitario toman valores exactos muy frecuentes en los exámenes.",
      formulas: [
        { tex: "\\sin^2 x + \\cos^2 x = 1", label: "Identidad pitagórica (la más importante)" },
        { tex: "\\tan x = \\frac{\\sin x}{\\cos x}", label: "Relación entre tangente, seno y coseno" },
        { tex: "\\sin 30^\\circ = \\tfrac{1}{2}, \\; \\cos 60^\\circ = \\tfrac{1}{2}", label: "Valores exactos frecuentes" },
        { tex: "\\sin 45^\\circ = \\cos 45^\\circ = \\tfrac{\\sqrt{2}}{2}", label: "Valor exacto de 45°" },
      ],
    },
    alternative: {
      title: "Método alternativo: triángulo rectángulo",
      intro: "Si no recuerdas la fórmula, dibuja el triángulo y aplica SOH-CAH-TOA.",
      lines: [
        "Dibuja el triángulo rectángulo y marca el ángulo conocido.",
        "Identifica qué lado es opuesto, cuál adyacente y cuál hipotenusa.",
        "Aplica: seno = opuesto/hipotenusa, coseno = adyacente/hipotenusa, tangente = opuesto/adyacente.",
        `Comprueba con la calculadora que ${ctx.finalText || "el valor obtenido"} coincide.`,
      ],
    },
    examTip:
      "Memoriza las tablas de 30°, 45° y 60°: en los exámenes se espera el valor exacto con raíces, no un decimal de calculadora.",
  };
}

/* ---------------------------------------------------------------------------
 * Física: cinemática
 * ------------------------------------------------------------------------- */

function kinematics(sol: Solution, ctx: Ctx): Enrichment {
  return {
    mistakes: [
      "Mezclar signos de dirección. Elige un sentido positivo al principio y respétalo: si la aceleración frena, va en signo contrario a la velocidad.",
      "Usar una fórmula que mezcle magnitudes de las que no dispones. Elige la ecuación que NO contenga el dato que te falta.",
      ctx.finalText
        ? `No comprobar las unidades. ${ctx.finalText} debe salir con la unidad correcta (m, m/s o m/s²); si no coincide, has sustituido mal.`
        : "No comprobar las unidades del resultado: cada magnitud tiene la suya y es la mejor pista de error.",
    ],
    theory: {
      title: "Ecuaciones del movimiento uniformemente acelerado",
      intro:
        "En MRUA la aceleración es constante. Con tres de las cuatro magnitudes (posición, velocidad, aceleración y tiempo) siempre puedes obtener la cuarta usando la ecuación que conecte justamente esas.",
      formulas: [
        { tex: "v = v_0 + a\\,t", label: "Velocidad en función del tiempo" },
        { tex: "x = x_0 + v_0 t + \\tfrac{1}{2}a t^2", label: "Posición en función del tiempo" },
        { tex: "v^2 = v_0^2 + 2a\\,\\Delta x", label: "Sin tiempo: la ecuación que salva exámenes" },
        { tex: "\\Delta x = \\tfrac{v_0 + v}{2}\\,t", label: "Usando la velocidad media" },
      ],
    },
    alternative: {
      title: "Método alternativo: gráficos v–t y x–t",
      intro: "Los gráficos resuelven muchos problemas sin ni siquiera recordar las fórmulas.",
      lines: [
        "Dibuja el gráfico velocidad–tiempo: la pendiente es la aceleración.",
        "El área bajo la recta v–t es el desplazamiento.",
        "Para el tiro parabólico, separa el movimiento en horizontal (v constante) y vertical (caída libre).",
        "Comprueba que tu respuesta es compatible con lo que dicen los gráficos.",
      ],
    },
    examTip:
      "Antes de sustituir, escribe una lista de datos con su unidad. Solo así detectas a tiempo si alguien te dio km/h en vez de m/s.",
  };
}

function dynamics(sol: Solution, ctx: Ctx): Enrichment {
  return {
    mistakes: [
      "Usar gramos en vez de kilogramos. En el SI la masa va en kg: 500 g = 0,5 kg, no 500.",
      "Confundir masa y peso. La masa se mide en kilogramos y el peso en newtons; P = m · g no es lo mismo que m.",
      "Sumar mal las fuerzas: si dos fuerzas se oponen, una entra con signo positivo y la otra con negativo según el eje elegido.",
    ],
    theory: {
      title: "Principios de la dinámica",
      intro:
        "La segunda ley de Newton relaciona la fuerza neta sobre un cuerpo con su aceleración. La masa es la medida de la inercia: a misma fuerza, más masa implica menos aceleración.",
      formulas: [
        { tex: "F_{\\text{neto}} = m \\cdot a", label: "Segunda ley de Newton" },
        { tex: "P = m \\cdot g", label: "Peso (g ≈ 9,8 m/s² en la Tierra)" },
        { tex: "a = \\frac{F_{\\text{neto}}}{m}", label: "Aceleración a partir de la fuerza neta" },
        { tex: "\\sum F_x = 0 \\;\\text{(equilibrio)}", label: "Si no hay movimiento, la fuerza neta es cero" },
      ],
    },
    alternative: {
      title: "Método alternativo: comprobación dimensional",
      intro: "El error más frecuente en dinámica es de unidades, y se detecta sin calculadora.",
      lines: [
        "Escribe la unidad de cada dato: masa en kg, aceleración en m/s², fuerza en newtons.",
        "Comprueba que kg · m/s² efectivamente da newtons (N).",
        "Si te piden fuerza y te sale en kg o m/s², has usado una fórmula equivocada.",
        `Verifica que ${ctx.finalText || "el resultado"} está en newtons.`,
      ],
    },
    examTip:
      "Dibuja el diagrama de cuerpo libre antes de escribir una sola fórmula: representa todas las fuerzas con flechas. En los exámenes de física suele puntuarse ese dibujo.",
  };
}

function energy(sol: Solution, ctx: Ctx): Enrichment {
  return {
    mistakes: [
      "Mezclar julios con kilojulios. 1 kJ = 1000 J: en los exámenes es el error más castigado.",
      "Usar la altura medida desde un punto que no es el de referencia. La energía potencial depende del desnivel, no de la posición absoluta.",
      "Olvidar que la masa va en kilogramos, no en gramos, y que g ≈ 9,8 m/s².",
    ],
    theory: {
      title: "Energía y conservación",
      intro:
        "La energía no se crea ni se destruye: se transforma. Por eso la mayoría de los problemas se resuelven igualando la energía inicial y la final, sin necesidad de saber cómo se reparte en cada instante.",
      formulas: [
        { tex: "E_c = \\tfrac{1}{2} m v^2", label: "Energía cinética (movimiento)" },
        { tex: "E_p = m \\, g \\, h", label: "Energía potencial (altura)" },
        { tex: "W = F \\cdot d \\cdot \\cos\\theta", label: "Trabajo de una fuerza" },
        { tex: "E_{\\text{inicial}} = E_{\\text{final}}", label: "Conservación de la energía mecánica" },
      ],
    },
    alternative: {
      title: "Método alternativo: teorema de la energía",
      intro: "En vez de calcular cada tramo, compara solo los dos extremos del problema.",
      lines: [
        "Identifica el punto inicial y el punto final del problema.",
        "Escribe la energía total en cada punto (cinética + potencial).",
        "Iguala ambas expresiones: lo que gana de velocidad pierde de altura.",
        `Comprueba que el resultado ${ctx.finalText ? `${ctx.finalText} ` : ""}tiene unidades de julios.`,
      ],
    },
    examTip:
      "Si el problema menciona «sin rozamiento», puedes aplicar directamente la conservación de la energía: es el método más corto y el que menos errores produce.",
  };
}

function momentum(sol: Solution, ctx: Ctx): Enrichment {
  return {
    mistakes: [
      "Olvidar que la cantidad de movimiento es un vector: la dirección importa tanto como el valor.",
      "Usar gramos en lugar de kilogramos para la masa.",
      "No cambiar de signo la velocidad cuando el objeto invierte el sentido del movimiento.",
    ],
    theory: {
      title: "Cantidad de movimiento",
      intro:
        "El momento lineal mide «cuánto movimiento» lleva un cuerpo. En ausencia de fuerzas externas se conserva, lo que permite resolver colisiones sin conocer las fuerzas internas.",
      formulas: [
        { tex: "p = m \\cdot v", label: "Cantidad de movimiento (momento lineal)" },
        { tex: "\\Delta p = F \\cdot \\Delta t", label: "Impulso: el cambio de momento" },
        { tex: "\\sum p_{\\text{antes}} = \\sum p_{\\text{después}}", label: "Conservación en colisiones" },
      ],
    },
    alternative: {
      title: "Método alternativo: conservación del momento",
      intro: "En colisiones no hace falta calcular fuerzas: basta comparar antes y después.",
      lines: [
        "Escribe el momento total antes del suceso.",
        "Escribe el momento total después del suceso.",
        "Igúnalos (con los signos correctos según el sentido de cada cuerpo).",
        "Despeja la incógnita y comprueba las unidades: kg·m/s.",
      ],
    },
    examTip:
      "Define siempre el sentido positivo al inicio del ejercicio y dibuja las velocidades como vectores. Evita la mitad de los errores de signo.",
  };
}

function electricity(sol: Solution, ctx: Ctx): Enrichment {
  return {
    mistakes: [
      "Mezclar unidades: voltios (V) para tensión, amperios (A) para corriente, ohmios (Ω) para resistencia y vatios (W) para potencia.",
      "Sumar resistencias en paralelo como si fueran en serie (o al revés). En serie se suman; en paralelo se invierten.",
      "Usar la potencia en vatios sin convertir a kilovatios cuando el enunciado lo pide en kWh.",
    ],
    theory: {
      title: "Leyes de los circuitos",
      intro:
        "La ley de Ohm relaciona tensión, corriente y resistencia. Con ella y las reglas de asociación se resuelve casi cualquier circuito serie o paralelo sencillo.",
      formulas: [
        { tex: "V = I \\cdot R", label: "Ley de Ohm" },
        { tex: "P = V \\cdot I = I^2 R = \\frac{V^2}{R}", label: "Potencia eléctrica" },
        { tex: "R_{\\text{serie}} = R_1 + R_2 + \\dots", label: "Resistencias en serie" },
        { tex: "\\frac{1}{R_{\\text{par}}} = \\frac{1}{R_1} + \\frac{1}{R_2} + \\dots", label: "Resistencias en paralelo" },
      ],
    },
    alternative: {
      title: "Método alternativo: triángulo de Ohm",
      intro: "Un truco visual para no confundir nunca las tres magnitudes.",
      lines: [
        "Dibuja un triángulo con V arriba e I y R abajo, separados.",
        "Para obtener V, multiplica los dos de abajo: V = I · R.",
        "Para obtener I, divide V entre R; para R, divide V entre I.",
        `Comprueba las unidades: si piden corriente, ${ctx.finalText ? `${ctx.finalText} ` : ""}debe salir en amperios.`,
      ],
    },
    examTip:
      "Dibuja el circuito y marca con los valores conocidos antes de sustituir. Si es serie, la corriente es la misma en todo; si es paralelo, la tensión es la misma en todas las ramas.",
  };
}

/* ---------------------------------------------------------------------------
 * Selección
 * ------------------------------------------------------------------------- */

/**
 * Construye el contenido complementario para una solución concreta.
 * Nunca lanza excepciones: si algo falla, devuelve contenido genérico válido.
 */
export function buildEnrichment(sol: Solution): Enrichment {
  const ctx = makeCtx(sol);
  try {
    switch (sol.topic as Topic) {
      case "arithmetic":
      case "algebra":
        return arithmetic(sol, ctx);
      case "equation":
      case "function":
      case "limit":
        return equation(sol, ctx);
      case "derivative":
        return derivative(sol, ctx);
      case "integral":
        return integral(sol, ctx);
      case "geometry":
        return geometry(sol, ctx);
      case "trigonometry":
        return trigonometry(sol, ctx);
      case "kinematics":
      case "gravitation":
        return kinematics(sol, ctx);
      case "dynamics":
        return dynamics(sol, ctx);
      case "energy":
      case "thermodynamics":
      case "waves":
        return energy(sol, ctx);
      case "momentum":
        return momentum(sol, ctx);
      case "electricity":
      case "magnetism":
        return electricity(sol, ctx);
      default:
        return generic(sol, ctx);
    }
  } catch {
    return generic(sol, ctx);
  }
}

/** Texto plano de los errores (para datos estructurados FAQ). */
export function mistakesAsText(e: Enrichment): string {
  return e.mistakes.join(" ");
}

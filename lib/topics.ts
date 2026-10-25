import type { Area, Topic } from "./solver/types";

/**
 * Páginas de teoría ("clusters") en `/aprender/[topic]`.
 *
 * Son las páginas "madre" del sitio: explican un tema completo, dan las
 * fórmulas, el método de resolución y los errores típicos, y enlazan a una
 * selección de problemas resueltos del mismo tema.
 *
 * Relación con SEO:
 *  - Cada tema agrupa y da contexto a decenas de URLs de `/resolver/...`
 *    (enlaces internos bidireccionales: teoría -> problemas y problemas ->
 *    teoría), que es lo que reparte autoridad dentro del sitio.
 *  - El contenido es único por tema (no se genera con plantillas), para no
 *    caer en contenido delgado.
 */

export interface TopicPage {
  slug: string;
  /** Tema del motor usado para elegir los problemas relacionados. */
  topic: Topic;
  area: Area;
  title: string;
  /** Antetítulo corto, p. ej. "Matemáticas". */
  short: string;
  description: string;
  /** Párrafos de introducción (texto propio, único por página). */
  intro: string[];
  /** Fórmulas clave en LaTeX (se renderizan en el servidor, indexables). */
  formulas: Array<{ tex: string; name: string; note: string }>;
  /** Método de resolución, punto por punto. */
  method: Array<{ h: string; p: string }>;
  /** Errores frecuentes en examen y cómo evitarlos. */
  mistakes: Array<{ error: string; fix: string }>;
  /** Preguntas frecuentes (se reutilizan en el JSON-LD de FAQ). */
  faq: Array<{ q: string; a: string }>;
  /** Si se indica, solo incluye problemas cuyo enunciado cumple el patrón. */
  include?: RegExp;
  /** Excluye problemas cuyo enunciado cumple el patrón. */
  exclude?: RegExp;
}

/* ---------------------------------------------------------------------------
 * Matemáticas
 * ------------------------------------------------------------------------- */

const lineales: TopicPage = {
  slug: "ecuaciones-lineales",
  topic: "equation",
  area: "math",
  short: "Matemáticas",
  title: "Ecuaciones lineales de primer grado: método paso a paso",
  description:
    "Cómo resolver ecuaciones lineales de primer grado: despeje, paréntesis, fracciones y comprobación, con ejemplos resueltos y errores típicos de examen.",
  exclude: /\^2|²/,
  intro: [
    "Una ecuación lineal (o de primer grado) es una igualdad en la que la incógnita no está elevada a ningún exponente mayor que 1, por ejemplo 3x + 7 = 22 o 2(x − 4) = x + 3. Resolverla consiste en encontrar el único valor de x que hace verdadera la igualdad. El método es siempre el mismo: dejar la incógnita en un miembro y los números en el otro, invirtiendo operación a operación.",
    "La base es el principio de equivalentes: puedes sumar, restar, multiplicar o dividir ambos miembros por la misma cantidad sin alterar las soluciones. Cuando «pasamos» un término al otro miembro, lo que realmente hacemos es sumarlo o restarlo en los dos lados: por eso cambia de signo. Entender esto evita el error más común, que es mover un término y olvidarse de la resta.",
    "Antes de despejar conviene simplificar el enunciado: repartir paréntesis, reducir fracciones con un denominador común y agrupar los términos con x en un solo miembro. Cada paso que elimines es un sitio menos donde equivocarte de signo, y los signos son la causa número uno de fallos en examen.",
  ],
  formulas: [
    {
      tex: "ax + b = c \\;\\Rightarrow\\; x = \\dfrac{c-b}{a}",
      name: "Forma general",
      note: "Válida siempre que a ≠ 0: restamos b y dividimos entre a.",
    },
    {
      tex: "a(x+b) = c",
      name: "Con paréntesis",
      note: "Primero se reparte a por todo el paréntesis y después se despeja.",
    },
    {
      tex: "\\dfrac{x}{a}+\\dfrac{x}{b} = c",
      name: "Con denominadores",
      note: "Se multiplica toda la igualdad por el mínimo común múltiplo de a y b.",
    },
    {
      tex: "ax+b = cx+d",
      name: "Incógnita en los dos miembros",
      note: "Se agrupan las x de un lado y los números del otro antes de dividir.",
    },
  ],
  method: [
    {
      h: "1. Quita los paréntesis",
      p: "Reparte el factor que los acompaña en todos los términos de dentro. Si hay signo delante, respétalo: −(2x − 5) es −2x + 5.",
    },
    {
      h: "2. Elimina las fracciones",
      p: "Multiplica toda la igualdad por el mínimo común múltiplo de los denominadores. Así trabajas con números enteros y reduces errores de cálculo.",
    },
    {
      h: "3. Agrupa términos semejantes",
      p: "Todo lo que lleva x a un miembro y los números libres al otro, cambiando de signo cuando cruzan la igualdad.",
    },
    {
      h: "4. Despeja dividiendo",
      p: "Factoriza la x si hay varias y divide entre el coeficiente que le acompaña. Ese valor es la solución.",
    },
    {
      h: "5. Comprueba sustituyendo",
      p: "Sustituye el resultado en la ecuación original: si los dos miembros dan el mismo número, es correcto. Es el paso que casi nadie hace y que evita suspender por una errata.",
    },
  ],
  mistakes: [
    {
      error: "Cambiar de signo solo a un término al cruzar la igualdad.",
      fix: "Aplica la misma operación en los dos miembros: si restas 7, resta 7 en ambos lados.",
    },
    {
      error: "Olvidar repartir el signo menos delante de un paréntesis.",
      fix: "Escribe el paréntesis con su signo delante y reparte también ese signo: −(3x − 2) = −3x + 2.",
    },
    {
      error: "Multiplicar por el denominador solo un miembro de la ecuación.",
      fix: "Si multiplicas por 6, multiplica TODOS los términos, de los dos lados, por 6.",
    },
    {
      error: "Dar por buena la respuesta sin comprobar.",
      fix: "Sustituye el valor en la ecuación original. Tarda diez segundos y detecta cualquier errata.",
    },
  ],
  faq: [
    {
      q: "¿Qué diferencia hay entre una ecuación lineal y una cuadrática?",
      a: "La lineal (primer grado) tiene la incógnita sin exponente y admite una única solución; la cuadrática tiene la incógnita al cuadrado y admite hasta dos soluciones, resolviéndose con la fórmula general, factorización o completar el cuadrado.",
    },
    {
      q: "¿Por qué al pasar un término cambia de signo?",
      a: "Porque en realidad lo estás restando (o sumando) en los dos miembros de la igualdad para cancelarlo en uno de ellos. Es una aplicación del principio de equivalentes, no una regla arbitraria.",
    },
    {
      q: "¿Toda ecuación lineal tiene solución?",
      a: "Casi siempre sí, una única. Solo quedan sin solución las igualdades contradictorias como 3x + 5 = 3x + 9, donde al simplificar queda 5 = 9, o infinitas soluciones si queda una identidad como 0 = 0.",
    },
  ],
};

const cuadraticas: TopicPage = {
  slug: "ecuaciones-cuadraticas",
  topic: "equation",
  area: "math",
  short: "Matemáticas",
  title: "Ecuaciones de segundo grado (cuadráticas): fórmula general y factorización",
  description:
    "Cómo resolver ecuaciones cuadráticas ax² + bx + c = 0: discriminante, fórmula general, factorización y completar el cuadrado, con ejemplos resueltos.",
  include: /\^2|²/,
  intro: [
    "Una ecuación de segundo grado o cuadrática tiene la forma ax² + bx + c = 0, con a ≠ 0. A diferencia de las lineales, puede tener dos soluciones reales, una sola (raíz doble) o ninguna solución real. Eso lo decide el discriminante, Δ = b² − 4ac, antes incluso de calcular nada más.",
    "Existen tres caminos y conviene elegir bien: la factorización es la más rápida cuando las raíces son enteras y «se ven»; la fórmula general funciona siempre; completar el cuadrado es la que mejor explica de dónde sale la fórmula y la que se usa en temas avanzados. En un examen con tiempo, primero mira si factoriza y, si no, aplica la fórmula.",
    "Un detalle que se olvida en el examen: b se toma con su signo. En x² − 5x + 6 = 0 el coeficiente b es −5, no 5. Y en la fórmula general el denominador es 2a, también con el signo de a. La mayoría de los errores en cuadráticas son de signo, no de cálculo.",
  ],
  formulas: [
    {
      tex: "ax^2+bx+c=0 \\;\\Rightarrow\\; x=\\dfrac{-b\\pm\\sqrt{b^2-4ac}}{2a}",
      name: "Fórmula general",
      note: "Siempre funciona. b y a se sustituyen con su signo.",
    },
    {
      tex: "\\Delta = b^2-4ac",
      name: "Discriminante",
      note: "Δ > 0: dos soluciones · Δ = 0: una (doble) · Δ < 0: ninguna real.",
    },
    {
      tex: "x^2+Sx+P=0 \\;\\Rightarrow\\; \\text{raíces con suma } -S \\text{ y producto } P",
      name: "Suma y producto",
      note: "Atajo para factorizar: busca dos números que sumen −b y multipliquen c.",
    },
    {
      tex: "x^2+bx = \\left(x+\\dfrac{b}{2}\\right)^2 - \\dfrac{b^2}{4}",
      name: "Completar el cuadrado",
      note: "Reescribe la expresión como un cuadrado perfecto más un término constante.",
    },
  ],
  method: [
    {
      h: "1. Ordena la ecuación",
      p: "Todo a un miembro y ordenado de mayor a menor exponente: ax² + bx + c = 0. Si había denominadores, elimínalos antes.",
    },
    {
      h: "2. Identifica a, b y c",
      p: "Lee el signo de cada coeficiente: en x² − 5x + 6 = 0 tenemos a = 1, b = −5, c = 6.",
    },
    {
      h: "3. Calcula el discriminante",
      p: "Δ = b² − 4ac. Te dice de antemano cuántas soluciones habrá y evita perder tiempo si no hay solución real.",
    },
    {
      h: "4. Aplica la fórmula general",
      p: "Sustituye en x = (−b ± √Δ) / 2a. Escribe las dos ramas, con + y con −, aunque el resultado final sea el mismo.",
    },
    {
      h: "5. Simplifica y comprueba",
      p: "Racionaliza si hace falta y sustituye cada raíz en la ecuación original. También puedes verificar por suma y producto: las raíces deben sumar −b/a y multiplicar c/a.",
    },
  ],
  mistakes: [
    {
      error: "Usar b con signo positivo cuando la ecuación tiene signo menos.",
      fix: "En x² − 5x + 6 = 0, b = −5. Escribe los tres coeficientes antes de sustituir.",
    },
    {
      error: "Olvidar el 2a del denominador de la fórmula general.",
      fix: "El 2a va ENTERO en el denominador; no es 2 · a solo en el numerador.",
    },
    {
      error: "Parar tras encontrar la primera rama de la solución.",
      fix: "Si Δ > 0 hay dos raíces: una con + y otra con −. En la comprobación verás que las dos valen.",
    },
    {
      error: "Dar por hecho que si Δ es negativo «no se puede resolver».",
      fix: "No hay soluciones reales, pero sí complejas. En secundaria basta con declararlo explícitamente.",
    },
  ],
  faq: [
    {
      q: "¿Cómo sé si una ecuación cuadrática se puede resolver por factorización?",
      a: "Mira si existen dos números enteros que sumen −b y multipliquen c. Si los hay (por ejemplo x² − 5x + 6 = 0 con −2 y −3), factoriza; si no, usa la fórmula general.",
    },
    {
      q: "¿Qué significa que el discriminante sea cero?",
      a: "Que hay una única solución real (raíz doble): la parábola toca el eje x en un solo punto. Ocurre cuando b² = 4ac.",
    },
    {
      q: "¿Qué pasa si el discriminante es negativo?",
      a: "La ecuación no tiene soluciones reales: la parábola no corta el eje x. En temas posteriores aparecen las soluciones complejas.",
    },
    {
      q: "¿La fórmula general sirve para cualquier ecuación de segundo grado?",
      a: "Sí, siempre que a ≠ 0. Es el método universal cuando la factorización no es evidente.",
    },
  ],
};

const derivadas: TopicPage = {
  slug: "derivadas",
  topic: "derivative",
  area: "math",
  short: "Matemáticas",
  title: "Derivadas: reglas, propiedades y ejemplos resueltos",
  description:
    "Aprende a derivar: regla de la potencia, productos, cocientes, regla de la cadena y derivadas de funciones elementales, con ejemplos paso a paso.",
  intro: [
    "La derivada de una función mide su rapidez de cambio instantánea: geométricamente es la pendiente de la recta tangente a la curva en un punto. Si s(t) es la posición de un móvil, s′(t) es su velocidad; derivar es, en el fondo, pasar de una magnitud a su velocidad de variación.",
    "Casi todo el cálculo diferencial de curso medio se resuelve con dos reglas: la de la potencia, para polinomios, y las derivadas de las funciones elementales (seno, coseno, logaritmo, exponencial) combinadas con la regla de la cadena. Practicar las dos hasta que salgan sin pensar es la diferencia entre un ejercicio resuelto y uno a medias.",
    "Convención de notación: a xⁿ se le llama «coeficiente» y n «exponente». Al derivar el exponente baja multiplicando y después se le resta uno: d/dx(axⁿ) = n·a·xⁿ⁻¹. Los términos independientes (los números sueltos) se derivan a cero, porque no cambian.",
  ],
  formulas: [
    {
      tex: "\\dfrac{d}{dx}(ax^n) = n\\,a\\,x^{n-1}",
      name: "Regla de la potencia",
      note: "La más usada: el exponente baja multiplicando y se le resta 1.",
    },
    {
      tex: "\\dfrac{d}{dx}[f(x)\\pm g(x)] = f'(x)\\pm g'(x)",
      name: "Suma y resta",
      note: "Se deriva término a término; la constante multiplicativa sale fuera.",
    },
    {
      tex: "(f\\circ g)'(x) = f'(g(x))\\cdot g'(x)",
      name: "Regla de la cadena",
      note: "Se deriva de fuera hacia dentro y se multiplica por la derivada de dentro.",
    },
    {
      tex: "\\left(\\dfrac{f}{g}\\right)' = \\dfrac{f'g - fg'}{g^2}",
      name: "Regla del cociente",
      note: "Solo hace falta si hay división de funciones; el denominador va al cuadrado.",
    },
    {
      tex: "(\\sin x)' = \\cos x,\\quad (\\cos x)' = -\\sin x,\\quad (\\ln x)' = \\dfrac{1}{x}",
      name: "Funciones elementales",
      note: "Conviene memorizarlas: son la base de casi todos los ejercicios.",
    },
  ],
  method: [
    {
      h: "1. Simplifica la función antes de derivar",
      p: "Si puedes, reescribe potencias negativas o fracciones como xⁿ. Derivar 3x² es más rápido que aplicar el cociente a 3/x² con x² en el denominador.",
    },
    {
      h: "2. Identifica la estructura",
      p: "¿Es un polinomio, una suma de funciones, un producto, un cociente o una función anidada? Eso decide qué regla usas.",
    },
    {
      h: "3. Aplica la regla correspondiente",
      p: "En polinomios, término a término con la regla de la potencia. En productos y cocientes, sus reglas; en composiciones, de fuera hacia dentro.",
    },
    {
      h: "4. Reduce el resultado",
      p: "Factoriza y simplifica. Una derivada sin factorizar es válida, pero casi nunca coincide con la del libro de texto y la corrección puede marcarla como incorrecta.",
    },
    {
      h: "5. Comprueba el orden",
      p: "El grado de la derivada de un polinomio de grado n es n − 1. Si te sale un grado mayor, hay un fallo en la regla de la potencia.",
    },
  ],
  mistakes: [
    {
      error: "Restar 1 al coeficiente en vez de al exponente.",
      fix: "En 5x³ el 3 baja multiplicando y el exponente pasa a 2: 15x². El 5 no se toca.",
    },
    {
      error: "Derivar un producto como si fuera un producto de derivadas.",
      fix: "(f·g)′ = f′g + fg′, no f′g′. La regla del producto es la que se olvida.",
    },
    {
      error: "Olvidar multiplicar por la derivada de dentro (regla de la cadena).",
      fix: "En sin(3x) la derivada es cos(3x)·3. El 3 de dentro se queda fuera.",
    },
    {
      error: "Dejar el resultado sin simplificar.",
      fix: "Factoriza: 3x² + 6x se escribe 3x(x + 2) y así se ven los puntos críticos.",
    },
  ],
  faq: [
    {
      q: "¿Qué representa gráficamente la derivada?",
      a: "La pendiente de la recta tangente a la curva en cada punto. Si la derivada es positiva la función crece, si es negativa decrece y si es cero la tangente es horizontal (posibles máximos o mínimos).",
    },
    {
      q: "¿Cómo se deriva una función con raíz cuadrada?",
      a: "Se reescribe como potencia: √x = x^(1/2), y se aplica la regla de la potencia, resultando 1/(2√x).",
    },
    {
      q: "¿Qué diferencia hay entre derivada y diferencial?",
      a: "La derivada es el cociente de los incrementos en el límite (la pendiente); la diferencial es su aproximación lineal para incrementos finitos, dy = f′(x)·dx.",
    },
  ],
};

const integrales: TopicPage = {
  slug: "integrales",
  topic: "integral",
  area: "math",
  short: "Matemáticas",
  title: "Integrales indefinidas y definidas: reglas y ejemplos resueltos",
  description:
    "Cómo calcular integrales indefinidas y definidas: regla de la potencia, constantes, límites de integración y aplicaciones, paso a paso.",
  intro: [
    "La integral es la operación inversa de la derivada: mientras que derivar te dice a qué velocidad cambia una cosa, integrar te dice cuánto se ha acumulado. Por eso la integral indefinida de una función es su antiderivada más una constante, y la definida es el área bajo la curva entre dos valores.",
    "La regla de potencia para integrales es casi simétrica a la de derivadas, pero «al revés»: el exponente sube y se le suma 1, y después se divide entre el nuevo exponente. Ese paso final de división es el que más se olvida, y es justo lo que hace que aparezcan fracciones donde no las esperabas.",
    "En las integrales definidas, con límites de integración, la constante desaparece al restar: F(b) − F(a). Así que en ese tipo de ejercicio puedes ahorrarte la +C, aunque en las indefinidas es obligatoria: sin ella estás dando una sola familia de antiderivadas por infinitas.",
  ],
  formulas: [
    {
      tex: "\\int x^n\\,dx = \\dfrac{x^{n+1}}{n+1}+C \\quad (n\\neq -1)",
      name: "Regla de la potencia",
      note: "El exponente sube 1 y se divide entre el resultado. El caso n = −1 da ln|x|.",
    },
    {
      tex: "\\int k\\,f(x)\\,dx = k\\int f(x)\\,dx",
      name: "Constante multiplicativa",
      note: "Las constantes salen fuera de la integral.",
    },
    {
      tex: "\\int_a^b f(x)\\,dx = F(b)-F(a)",
      name: "Integral definida",
      note: "Se evalúa la antiderivada en los límites y se restan (regla de Barrow).",
    },
    {
      tex: "\\int \\sin x\\,dx = -\\cos x + C,\\qquad \\int \\cos x\\,dx = \\sin x + C",
      name: "Funciones trigonométricas",
      note: "Ojo con el signo menos en el seno: es el único que lo lleva.",
    },
  ],
  method: [
    {
      h: "1. Identifica el tipo",
      p: "¿Es un polinomio, una potencia, una función elemental o un cociente? Eso determina la regla que vas a usar.",
    },
    {
      h: "2. Reescribe si hace falta",
      p: "Convierte √x en x^(1/2), 1/x² en x^(−2) y separa los términos. Integrar se hace mucho más fácil con todo expresado como potencias.",
    },
    {
      h: "3. Aplica la regla término a término",
      p: "Cada término se integra por separado: el exponente sube 1 y divides entre el nuevo exponente.",
    },
    {
      h: "4. Añade la constante",
      p: "En las integrales indefinidas, +C es obligatoria: sin ella falta una familia entera de soluciones.",
    },
    {
      h: "5. En definidas, evalúa y resta",
      p: "Sustituye el límite superior, después el inferior (con su signo) y simplifica. La constante se cancela sola.",
    },
  ],
  mistakes: [
    {
      error: "Olvidar dividir entre el nuevo exponente.",
      fix: "∫x² dx = x³/3, no x³. Comprueba derivando: la derivada de x³ es 3x², no x².",
    },
    {
      error: "Escribir la constante +C en una integral definida.",
      fix: "En ∫ₐᵇ se resta y la constante se cancela; añadirla solo añade ruido al resultado.",
    },
    {
      error: "Dejar el signo menos en ∫ sin x dx igual que en coseno.",
      fix: "(−cos x)′ = sin x, así que ∫sin x dx = −cos x + C.",
    },
    {
      error: "Cambiar el orden de la resta de los límites.",
      fix: "Es F(límite superior) − F(límite inferior). Si lo invertas, el área sale negativa.",
    },
  ],
  faq: [
    {
      q: "¿Qué significa la constante C en una integral indefinida?",
      a: "Que existen infinitas antiderivadas que solo se diferencian en un valor constante: al derivar, cualquier constante desaparece. Se representa con +C para no perder esa familia.",
    },
    {
      q: "¿Cuándo se usa ln|x| en lugar de la regla de la potencia?",
      a: "Cuando el exponente es −1 (integrandos como 1/x), porque x⁰/0 no está definido. En ese caso la integral es ln|x| + C.",
    },
    {
      q: "¿Qué representa la integral definida?",
      a: "El área neta comprendida entre la curva y el eje x entre dos valores: positiva cuando la curva está sobre el eje y negativa cuando está debajo.",
    },
  ],
};

const geometria: TopicPage = {
  slug: "geometria",
  topic: "geometry",
  area: "math",
  short: "Matemáticas",
  title: "Geometría: fórmulas de área, perímetro y volumen",
  description:
    "Todas las fórmulas de geometría que necesitas: cuadrado, triángulo, círculo, trapecio, rombo, prismas, cilindro, cono y esfera, con ejemplos.",
  intro: [
    "Geometría es la parte de las matemáticas que más se repite en examen porque es la más visual: casi siempre se trata de reconocer la figura, identificar qué datos te dan y aplicar la fórmula correcta. El 90 % de los fallos no son de cálculo, sino de aplicar un área donde pedían un volumen o confundir la altura con el lado.",
    "Un truco que funciona siempre: dibuja la figura y marca los datos encima. En un trapecio, la altura es la distancia entre las dos bases, no el lado inclinado; en un cono, la altura es la del eje, no la generatriz. Dibujarlo evita justo esa confusión.",
    "También ayuda memorizar en familia: el triángulo es media base por altura, el rectángulo es base por altura y el trapecio es el promedio de las bases por la altura. Si ves que las tres usan «base × altura» con algún ajuste, las recuerdas todas a la vez.",
  ],
  formulas: [
    {
      tex: "A = a^2,\\qquad P = 4a",
      name: "Cuadrado",
      note: "Un solo dato, el lado a: de él salen área y perímetro.",
    },
    {
      tex: "A = b\\cdot h,\\qquad A = \\dfrac{(b_1+b_2)\\,h}{2}",
      name: "Rectángulo y trapecio",
      note: "El trapecio es el promedio de las bases por la altura.",
    },
    {
      tex: "A = \\dfrac{b\\cdot h}{2}",
      name: "Triángulo",
      note: "Es medio rectángulo: si olvidas el /2 el resultado sale doble.",
    },
    {
      tex: "A = \\pi r^2,\\qquad P = 2\\pi r",
      name: "Círculo",
      note: "El área usa el radio al cuadrado; el perímetro (circunferencia) es 2πr.",
    },
    {
      tex: "V = \\pi r^2 h,\\qquad V = \\dfrac{1}{3}\\pi r^2 h",
      name: "Cilindro y cono",
      note: "El cono es un tercio del cilindro de igual base y altura.",
    },
    {
      tex: "V = \\dfrac{4}{3}\\pi r^3,\\qquad V = a^3",
      name: "Esfera y cubo",
      note: "Volumen: la esfera por su radio, el cubo por su lado al cubo.",
    },
  ],
  method: [
    {
      h: "1. Identifica la figura",
      p: "Mira cómo es y qué te dan: ¿lados, bases y altura, radio, diagonales? De ahí sale la fórmula.",
    },
    {
      h: "2. Dibuja y marca los datos",
      p: "Separa la altura del lado inclinado y el radio del diámetro. Si te dan el diámetro, el radio es la mitad.",
    },
    {
      h: "3. Elige medida y unidad",
      p: "Área en unidades al cuadrado (cm²) y volumen al cubo (cm³). Cambiar la unidad a mitad del ejercicio es un fallo clásico.",
    },
    {
      h: "4. Sustituye y opera con calma",
      p: "Escribe la fórmula, luego los números y después calcula. Si usas π en la calculadora, no lo redondees hasta el final.",
    },
    {
      h: "5. Comprueba por sentido común",
      p: "El área de un rectángulo de 4×6 no puede ser 40, ni el volumen de un cubo de lado 5 puede ser 25. Un vistazo rápido detecta errores de operación.",
    },
  ],
  mistakes: [
    {
      error: "Usar el lado inclinado como altura en trapecios y triángulos.",
      fix: "La altura es la distancia perpendicular entre bases o entre base y vértice; en el dibujo se marca con un ángulo recto.",
    },
    {
      error: "Olvidar dividir entre 2 en el triángulo.",
      fix: "Un triángulo es medio rectángulo: A = (b·h)/2.",
    },
    {
      error: "Usar el diámetro donde va el radio.",
      fix: "Si te dan el diámetro, divide entre dos antes de sustituir: r = d/2.",
    },
    {
      error: "Mezclar unidades de longitud, área y volumen.",
      fix: "Longitud → unidad; área → unidad²; volumen → unidad³. Escríbelo siempre al lado del resultado.",
    },
  ],
  faq: [
    {
      q: "¿Cuál es la diferencia entre perímetro y área?",
      a: "El perímetro es la longitud del contorno (se mide en metros) y el área es la superficie que ocupa la figura (se mide en metros cuadrados).",
    },
    {
      q: "¿Cómo se calcula el área de un trapecio?",
      a: "Sumando las dos bases paralelas, dividiendo entre dos y multiplicando por la altura: A = (b₁ + b₂)·h/2.",
    },
    {
      q: "¿Qué relación tienen cono, cilindro y esfera?",
      a: "Con la misma base y altura, el cilindro triplica al cono (V_cono = 1/3·πr²h). La esfera es un caso aparte: V = 4/3·πr³.",
    },
  ],
};

const trigonometria: TopicPage = {
  slug: "trigonometria",
  topic: "trigonometry",
  area: "math",
  short: "Matemáticas",
  title: "Trigonometría: seno, coseno y tangente de ángulos",
  description:
    "Tabla de valores de seno, coseno y tangente, cuadrantes, ángulos notables y aplicaciones de la trigonometría en triángulos rectángulos.",
  intro: [
    "La trigonometría relaciona los ángulos de un triángulo con las longitudes de sus lados. En un triángulo rectángulo, seno es cateto opuesto sobre hipotenusa, coseno es cateto adyacente sobre hipotenusa y tangente es opuesto sobre adyacente: con esas tres reglas (SOH-CAH-TOA) se resuelve casi todo.",
    "Los ángulos notables —0°, 30°, 45°, 60°, 90°— tienen valores exactos con raíces que conviene memorizar: sen 30° = 1/2, sen 45° = √2/2, sen 60° = √3/2, y el coseno va al revés (cos 30° = √3/2, cos 60° = 1/2). Saber esa mini-tabla ahorra la calculadora en medio examen.",
    "Fuera del primer cuadrante hay que tener cuidado con los signos: en el segundo cuadrante (90°–180°) el seno sigue positivo pero el coseno pasa a negativo, y la tangente negativa. La circunferencia trigonométrica te dice el signo; el valor absoluto se calcula con el ángulo agudo correspondiente.",
  ],
  formulas: [
    {
      tex: "\\sin\\theta = \\dfrac{\\text{cateto opuesto}}{\\text{hipotenusa}}",
      name: "Seno",
      note: "Cateto opuesto al ángulo partido por la hipotenusa.",
    },
    {
      tex: "\\cos\\theta = \\dfrac{\\text{cateto adyacente}}{\\text{hipotenusa}}",
      name: "Coseno",
      note: "Cateto que toca al ángulo partido por la hipotenusa.",
    },
    {
      tex: "\\tan\\theta = \\dfrac{\\sin\\theta}{\\cos\\theta} = \\dfrac{\\text{opuesto}}{\\text{adyacente}}",
      name: "Tangente",
      note: "Cociente de seno y coseno; en 90° no está definida.",
    },
    {
      tex: "\\sin^2\\theta+\\cos^2\\theta = 1",
      name: "Identidad pitagórica",
      note: "La identidad más usada: vale para cualquier ángulo.",
    },
  ],
  method: [
    {
      h: "1. Dibuja el triángulo o la circunferencia",
      p: "Marca el ángulo, el cateto opuesto y el adyacente. Sin el dibujo es muy fácil intercambiarlos.",
    },
    {
      h: "2. Elige la función según los datos",
      p: "Si tienes hipotenusa y un cateto, usa seno o coseno; si tienes los dos catetos, tangente.",
    },
    {
      h: "3. Comprueba los signos por cuadrante",
      p: "Entre 0° y 90° todo positivo; entre 90° y 180° el seno es positivo y el coseno y la tangente negativos.",
    },
    {
      h: "4. Usa los ángulos notables",
      p: "Si el ángulo es 30°, 45° o 60°, aplica el valor exacto de memoria y solo luego pasa a decimal si te lo piden.",
    },
    {
      h: "5. Verifica con la identidad pitagórica",
      p: "Sustituye tus valores en sen²θ + cos²θ = 1. Si no da 1, uno de los dos está mal.",
    },
  ],
  mistakes: [
    {
      error: "Intercambiar cateto opuesto y adyacente.",
      fix: "El opuesto no toca al ángulo; el adyacente sí. Dibuja y marca cuál toca el ángulo.",
    },
    {
      error: "Usar radianes donde piden grados (o viceversa).",
      fix: "Si el enunciado da grados, pon la calculadora en DEG. Una función inversa en el modo equivocado da un resultado absurdo.",
    },
    {
      error: "Olvidar el signo negativo fuera del primer cuadrante.",
      fix: "Entre 90° y 180°, coseno y tangente son negativos; el seno se mantiene positivo.",
    },
    {
      error: "Creer que la tangente de 90° es infinito o cero.",
      fix: "No está definida: cos 90° = 0 y la tangente es seno/coseno, es decir división por cero.",
    },
  ],
  faq: [
    {
      q: "¿Cuáles son los valores de seno, coseno y tangente de 45 grados?",
      a: "sen 45° = √2/2 ≈ 0,7071, cos 45° = √2/2 ≈ 0,7071 y tan 45° = 1.",
    },
    {
      q: "¿Cómo paso de grados a radianes?",
      a: "Multiplicando por π/180. Así 180° = π radianes, 90° = π/2 y 45° = π/4.",
    },
    {
      q: "¿Qué es la circunferencia trigonométrica?",
      a: "Un círculo de radio 1 centrado en el origen donde la coordenada x de un punto es el coseno del ángulo y la y es el seno. Sirve para determinar valores y signos en cualquier cuadrante.",
    },
  ],
};

const aritmetica: TopicPage = {
  slug: "aritmetica",
  topic: "arithmetic",
  area: "math",
  short: "Matemáticas",
  title: "Aritmética: orden de operaciones, potencias y raíces",
  description:
    "Repasa el orden de las operaciones, paréntesis, potencias, raíces cuadradas y reglas de signos con ejemplos resueltos paso a paso.",
  intro: [
    "La aritmetica es la base de todo lo demás: prioridad de operaciones, signos, potencias y raíces. El orden convencional es paréntesis, potencias y raíces, multiplicación y división (de izquierda a derecha) y por último suma y resta. A ese orden se le llama jerarquía de operaciones y es la causa de la mitad de los errores en los primeros ejercicios de curso.",
    "Multiplicación y división tienen la misma prioridad, así que se resuelven en el orden en que aparecen: en 150 ÷ 3 − 4 × 2, primero 150 ÷ 3 = 50 y 4 × 2 = 8, y solo después se restan: 50 − 8 = 42. La tentación de hacer la división primero y la multiplicación después… o al revés, por «prioridad», es un error típico.",
    "Con potencias hay que distinguir bien la base del exponente y respetar los signos: (−2)⁴ = 16 porque la base es −2, mientras que −2⁴ = −16 porque el signo queda fuera. Y en las raíces, si el radicando es negativo, en el conjunto real no hay solución.",
  ],
  formulas: [
    {
      tex: "a^n = \\underbrace{a\\cdot a\\cdots a}_{n \\text{ veces}}",
      name: "Potencia",
      note: "La base se repite como factor tantas veces como diga el exponente.",
    },
    {
      tex: "\\sqrt[n]{a^n} = a \\quad (n \\text{ impar})",
      name: "Raíz y potencia son inversas",
      note: "Se anulan, pero ojo con los signos en raíces pares.",
    },
    {
      tex: "(-a)^n = a^n \\text{ si } n \\text{ par}",
      name: "Signo en potencias pares",
      note: "Si n es impar, el signo se conserva: (−a)ⁿ = −aⁿ.",
    },
    {
      tex: "a^{m+n} = a^m\\cdot a^n,\\qquad (a^m)^n = a^{mn}",
      name: "Reglas de exponentes",
      note: "Al multiplicar potencias de la misma base se suman exponentes.",
    },
  ],
  method: [
    {
      h: "1. Escribe bien la expresión",
      p: "Anota paréntesis y exponentes tal cual están. Si la copias mal, da igual cuánto calcules después.",
    },
    {
      h: "2. Resuelve primero lo que hay entre paréntesis",
      p: "De dentro hacia fuera. Si hay fracciones, simplifícalas antes de seguir.",
    },
    {
      h: "3. Potencias y raíces",
      p: "De izquierda a derecha, respetando los signos y la prioridad del exponente sobre la multiplicación.",
    },
    {
      h: "4. Multiplica y divide de izquierda a derecha",
      p: "Misma prioridad: se hace en orden de aparición, no una antes que otra por regla.",
    },
    {
      h: "5. Suma y resta, y comprueba",
      p: "Último paso. Después, haz una estimación a ojo: si tu resultado está muy lejos de lo esperado, revisa los signos.",
    },
  ],
  mistakes: [
    {
      error: "Hacer todas las multiplicaciones antes que las divisiones por «prioridad».",
      fix: "Multiplicación y división tienen el mismo nivel: se resuelven de izquierda a derecha según aparecen.",
    },
    {
      error: "Confundir −2⁴ con (−2)⁴.",
      fix: "−2⁴ = −16 (el signo está fuera) y (−2)⁴ = 16 (la base completa es −2).",
    },
    {
      error: "Aplicar el exponente a la base y no al factor entero.",
      fix: "En (2·3)², el 2 afecta a los dos factores: (6)² = 36, no 2²·3 = 12.",
    },
    {
      error: "Restar sin cambiar el signo del término que «baja».",
      fix: "Al agrupar, todo término que cruza la igualdad o cambia de miembro cambia de signo.",
    },
  ],
  faq: [
    {
      q: "¿En qué orden se resuelven las operaciones?",
      a: "Paréntesis, potencias y raíces, multiplicaciones y divisiones (de izquierda a derecha), y por último sumas y restas.",
    },
    {
      q: "¿Cuál es la diferencia entre (−3)² y −3²?",
      a: "(−3)² = 9 porque la base es −3 y el cuadrado hace positivo el resultado; −3² = −9 porque el signo menos está fuera de la potencia.",
    },
    {
      q: "¿Cómo se simplifica una raíz cuadrada?",
      a: "Descomponiendo el radicando en factores primos y sacando los pares: √72 = √(36·2) = 6√2.",
    },
  ],
};

/* ---------------------------------------------------------------------------
 * Física
 * ------------------------------------------------------------------------- */

const cinematica: TopicPage = {
  slug: "cinematica",
  topic: "kinematics",
  area: "physics",
  short: "Física",
  title: "Cinemática: ecuaciones del movimiento rectilíneo uniforme y uniformemente acelerado",
  description:
    "Ecuaciones de cinemática, MRU y MRUA, caída libre y tiro parabólico: datos, fórmulas y método para resolver problemas de movimiento paso a paso.",
  intro: [
    "La cinemática describe el movimiento de los cuerpos sin preguntarse por qué se mueven: estudia posición, velocidad y aceleración en función del tiempo. Es la primera parte de la física que se estudia y también la que más problemas de enunciado tiene, porque casi todos se resuelven con las mismas cuatro ecuaciones.",
    "Hay dos casos básicos. El movimiento rectilíneo uniforme (MRU), con aceleración nula, en el que la velocidad es constante y basta con v = s/t. Y el movimiento uniformemente acelerado (MRUA), en el que la velocidad varía de forma lineal y hay que elegir la ecuación según qué datos te dan: siempre son cuatro magnitudes (v₀, v, a, t, s) y con tres conocidas se despejan las demás.",
    "El primer paso de cualquier problema, y el que decide si lo resuelves o no, es la lista de datos. Escribe v₀, v, a, t y s con sus unidades, deja en ? la que te piden y tacha las desconocidas. Con esa tabla se ve de un vistazo qué fórmula toca, y se evita el error más frecuente: sustituir en la que «sale más fácil».",
  ],
  formulas: [
    {
      tex: "v = v_0 + a\\,t",
      name: "Velocidad final",
      note: "Con v₀, a y t. Si parte del reposo, v₀ = 0.",
    },
    {
      tex: "s = v_0 t + \\tfrac{1}{2}a t^2",
      name: "Espacio recorrido",
      note: "Necesita aceleración: es la ecuación que más se usa en caída libre.",
    },
    {
      tex: "v^2 = v_0^2 + 2\\,a\\,s",
      name: "Sin tiempo",
      note: "La elegís cuando el enunciado no menciona el tiempo (frenados, subidas).",
    },
    {
      tex: "h = \\tfrac{1}{2}g t^2,\\qquad g = 9{,}8\\ \\mathrm{m/s^2}",
      name: "Caída libre",
      note: "Caso especial de MRUA con v₀ = 0 y a = g (hacia abajo).",
    },
    {
      tex: "v_x = v_0\\cos\\theta,\\qquad v_y = v_0\\sin\\theta",
      name: "Tiro parabólico",
      note: "Se descompone la velocidad inicial en horizontal (constante) y vertical (MRUA).",
    },
  ],
  method: [
    {
      h: "1. Haz la lista de datos",
      p: "v₀, v, a, t y s con sus unidades. Marca con ? lo que te piden y tacha lo que no conoces. Si falta un dato implícito («parte del reposo» = v₀ = 0, «hasta detenerse» = v = 0), escríbelo.",
    },
    {
      h: "2. Elige MRU o MRUA",
      p: "Si no hay aceleración, v = s/t basta. Si la hay (o se mencionan fuerzas, frenados o caídas), usa las ecuaciones de MRUA.",
    },
    {
      h: "3. Selecciona la ecuación según lo que falta",
      p: "Sin tiempo → v² = v₀² + 2as. Sin espacio → v = v₀ + at. Con v₀, a y t → s = v₀t + ½at². Con tres magnitudes, siempre hay una que resuelve.",
    },
    {
      h: "4. Sustituye con signos",
      p: "La aceleración y la velocidad son vectores: si el movimiento va en sentido contrario al que elegiste positivo, el dato va con signo menos (frenar es a < 0).",
    },
    {
      h: "5. Comprueba el resultado",
      p: "Un móvil que frena a 3 m/s² desde 30 m/s tarda 10 s en pararse y recorre 150 m. Hazte esa pregunta de coherencia: si sale un tiempo negativo o una distancia absurda, hay un signo mal.",
    },
  ],
  mistakes: [
    {
      error: "Olvidar escribir v₀ = 0 cuando «parte del reposo».",
      fix: "Es un dato. Sin él la ecuación v = v₀ + at tiene dos incógnitas y parece que faltan datos.",
    },
    {
      error: "Usar la ecuación que no corresponde a los datos disponibles.",
      fix: "Elige la que NO contiene la magnitud que desconoces y no te piden. La tabla de datos lo decide.",
    },
    {
      error: "Poner aceleración positiva en un frenado.",
      fix: "Si la velocidad disminuye, a y v₀ tienen signos opuestos: a = −5 m/s² si vas en sentido positivo.",
    },
    {
      error: "Mezclar unidades (km/h con m/s).",
      fix: "Convierte antes: divide km/h entre 3,6 para obtener m/s. Todas las ecuaciones van en SI.",
    },
    {
      error: "Usar g = 10 m/s² sin que lo indiquen.",
      fix: "Por defecto g = 9,8 m/s². Solo usa 10 si el enunciado o el profesor lo especifican.",
    },
  ],
  faq: [
    {
      q: "¿Cómo sé qué ecuación de cinemática usar?",
      a: "Mira qué magnitud no aparece ni te la piden. Sin tiempo usas v² = v₀² + 2as; sin espacio, v = v₀ + at; sin velocidad final, s = v₀t + ½at².",
    },
    {
      q: "¿Cuánto tarda un cuerpo en caer desde cierta altura?",
      a: "De h = ½gt² se despeja t = √(2h/g). Con g = 9,8 m/s², una caída de 20 m dura unos 2,02 s.",
    },
    {
      q: "¿Qué diferencia hay entre MRU y MRUA?",
      a: "En el MRU la velocidad es constante (a = 0) y la gráfica posición-tiempo es una recta. En el MRUA hay aceleración constante y la trayectoria es una parábola.",
    },
    {
      q: "¿La aceleración siempre aumenta la velocidad?",
      a: "No. Si el signo de a es contrario al de la velocidad, el cuerpo frena: es una deceleración. Por eso el signo importa tanto en cinemática.",
    },
  ],
};

const dinamica: TopicPage = {
  slug: "dinamica",
  topic: "dynamics",
  area: "physics",
  short: "Física",
  title: "Dinámica: segunda ley de Newton, fuerzas y peso",
  description:
    "Cómo aplicar la segunda ley de Newton F = m·a, calcular fuerzas, masas y aceleraciones, y distinguir peso y masa con ejemplos resueltos.",
  intro: [
    "La dinámica estudia las causas del movimiento: qué fuerzas actúan sobre un cuerpo y cómo cambian su velocidad. Su núcleo es la segunda ley de Newton, F = m·a, una de las ecuaciones más elegantes de la física: la fuerza total que recibe un cuerpo es igual a su masa por su aceleración.",
    "Lo importante es que F es la fuerza RESULTANTE, la suma de todas las que actúan. Si tiras de una caja con 50 N y la fricción responde con 20 N, la fuerza neta es 30 N y con esa se aplica la segunda ley. Aplicar F = m·a con una fuerza cualquiera sin restar las opuestas es el error conceptual más común de este tema.",
    "Otra distinción que hay que tener clara desde el principio: la masa es una propiedad del cuerpo (se mide en kilogramos y no cambia de sitio), mientras que el peso es la fuerza con la que el planeta la atrae (se mide en newtons y depende de g). Un astronauta con 70 kg de masa pesa distinto en la Luna, pero su masa sigue siendo 70 kg.",
  ],
  formulas: [
    {
      tex: "F_{net} = m\\,a",
      name: "Segunda ley de Newton",
      note: "F en newtons (N), m en kilogramos (kg), a en m/s².",
    },
    {
      tex: "\\sum F = F_1 - F_2",
      name: "Fuerza resultante",
      note: "Se restan las que se oponen al movimiento; el signo depende del sentido elegido.",
    },
    {
      tex: "P = m\\,g",
      name: "Peso",
      note: "Con g = 9,8 m/s². P en newtons, no en kilogramos.",
    },
    {
      tex: "a = \\dfrac{F_{net}}{m}",
      name: "Aceleración",
      note: "Misma ley despejada: una masa pequeña acelera más con la misma fuerza.",
    },
  ],
  method: [
    {
      h: "1. Representa las fuerzas (diagrama de cuerpo libre)",
      p: "Dibuja el cuerpo y todas las flechas: peso hacia abajo, normal hacia arriba, empuje o tensión en el sentido del movimiento y fricción en contra.",
    },
    {
      h: "2. Elige un sentido positivo",
      p: "Normalmente el del movimiento. Todo lo que vaya en ese sentido se toma positivo y lo contrario negativo.",
    },
    {
      h: "3. Calcula la fuerza resultante",
      p: "Suma con signo todas las fuerzas. Ese es el valor que entra en F = m·a, no una sola fuerza cualquiera.",
    },
    {
      h: "4. Aplica F = m·a",
      p: "Despeja la magnitud que te pidan: fuerza, masa o aceleración. Escribe las unidades siempre: N = kg·m/s².",
    },
    {
      h: "5. Comprueba la coherencia",
      p: "Con la misma fuerza, a mayor masa menor aceleración. Si te sale que un cuerpo pesado acelera más, hay un fallo en el despeje.",
    },
  ],
  mistakes: [
    {
      error: "Usar una fuerza cualquiera en lugar de la resultante.",
      fix: "Primero suma (con signo) todas las fuerzas; F = m·a se aplica con la fuerza neta.",
    },
    {
      error: "Confundir masa y peso.",
      fix: "La masa se mide en kg y es constante; el peso es P = m·g en newtons y cambia con el planeta.",
    },
    {
      error: "Usar gramos en lugar de kilogramos.",
      fix: "La SI exige kg: si te dan 250 g, escribe 0,25 kg antes de sustituir.",
    },
    {
      error: "Olvidar que el peso y la normal se cancelan en superficies horizontales.",
      fix: "Sin otros elementos verticales, N = P. Si no las cancelas, aparecen fuerzas fantasma en la resultante.",
    },
  ],
  faq: [
    {
      q: "¿Qué dice la segunda ley de Newton?",
      a: "Que la aceleración de un cuerpo es directamente proporcional a la fuerza neta que recibe e inversamente proporcional a su masa: a = F/m, o dicho al revés, F = m·a.",
    },
    {
      q: "¿Masa y peso son lo mismo?",
      a: "No. La masa (kg) mide la cantidad de materia; el peso (N) es la fuerza gravitatoria sobre esa masa: P = m·g. En la Tierra, 1 kg «pesa» 9,8 N.",
    },
    {
      q: "¿Qué pasa si la fuerza resultante es cero?",
      a: "No hay aceleración: el cuerpo sigue con velocidad constante (o en reposo). Es el principio de inercia o primera ley de Newton.",
    },
  ],
};

const energia: TopicPage = {
  slug: "energia-y-trabajo",
  topic: "energy",
  area: "physics",
  short: "Física",
  title: "Energía y trabajo: energía cinética, potencial y conservación",
  description:
    "Fórmulas de energía cinética, energía potencial, trabajo de una fuerza y conservación de la energía, con problemas resueltos paso a paso.",
  intro: [
    "El trabajo es la transferencia de energía que produce una fuerza al desplazar un cuerpo: W = F·d·cosθ. Si empujas una caja 300 N a lo largo de 2 m, has realizado 600 J de trabajo, y esa energía es exactamente la que se acumula en el sistema.",
    "La energía cinética es la que tiene un cuerpo por estar en movimiento (Ec = ½mv²) y la potencial es la que tiene por su posición, sobre todo la altura (Ep = mgh). Lo bonito del tema es la conservación: si despreciamos la fricción, la suma de las dos se mantiene constante, de modo que un objeto que cae cambia altura por velocidad exactamente a la misma «velocidad» de intercambio.",
    "Los cuadrados en las fórmulas cambian mucho los resultados: duplicar la velocidad multiplica la energía cinética por cuatro, no por dos. Es la razón por la que frenar un coche a doble de velocidad exige mucho más que el doble de espacio y de frenada, y también un clásico de examen.",
  ],
  formulas: [
    {
      tex: "E_k = \\tfrac{1}{2}m v^2",
      name: "Energía cinética",
      note: "Masa en kg y velocidad en m/s. El resultado sale en julios (J).",
    },
    {
      tex: "E_p = m\\,g\\,h",
      name: "Energía potencial",
      note: "Depende de la altura respecto al nivel de referencia que elijas.",
    },
    {
      tex: "W = F\\,d\\,\\cos\\theta",
      name: "Trabajo de una fuerza",
      note: "Si la fuerza y el desplazamiento van en el mismo sentido, cosθ = 1 y W = F·d.",
    },
    {
      tex: "E_{k1}+E_{p1} = E_{k2}+E_{p2}",
      name: "Conservación de la energía",
      note: "Sin fricción, la energía total del sistema no cambia.",
    },
    {
      tex: "P = \\dfrac{W}{t}",
      name: "Potencia",
      note: "Ritmo al que se entrega energía, medido en vatios (W).",
    },
  ],
  method: [
    {
      h: "1. Identifica qué energías están implicadas",
      p: "¿Hay altura? Entonces hay Ep. ¿Hay velocidad? Entonces hay Ec. ¿Hay una fuerza desplazándose? Hay trabajo.",
    },
    {
      h: "2. Unifica las unidades",
      p: "Masas en kg, alturas en m, velocidades en m/s y resultados en julios. 1 J = 1 N·m.",
    },
    {
      h: "3. Elige nivel de referencia",
      p: "Para la potencial, define dónde vale cero la altura (normalmente el suelo). El valor de Ep depende de esa elección, la variación no.",
    },
    {
      h: "4. Aplica la fórmula o la conservación",
      p: "Si solo hay una forma de energía, usa su fórmula. Si hay dos estados (arriba/abajo, antes/después), iguala las energías totales.",
    },
    {
      h: "5. Comprueba el orden de magnitud",
      p: "Un cuerpo de 2 kg a 10 m/s tiene 100 J: está bien. Si te sale 10⁶ J para lo mismo, has metido un factor 1000.",
    },
  ],
  mistakes: [
    {
      error: "Olvidar elevar la velocidad al cuadrado.",
      fix: "Ec = ½mv², no ½mv. El cuadrado está en la fórmula, no en la unidad.",
    },
    {
      error: "Usar gramos o centímetros sin convertir.",
      fix: "kg y m: 500 g = 0,5 kg y 30 cm = 0,3 m. La energía sale en julios solo si el SI está respetado.",
    },
    {
      error: "Aplicar W = F·d con una fuerza perpendicular al movimiento.",
      fix: "Si θ = 90°, cosθ = 0 y esa fuerza no realiza trabajo (es el caso de la normal y del peso en plano horizontal).",
    },
    {
      error: "Suponer que se conserva la energía mecánica con fricción.",
      fix: "Con rozamiento parte se disipa en calor: la energía total sí se conserva, pero la mecánica no.",
    },
  ],
  faq: [
    {
      q: "¿Cuál es la diferencia entre trabajo y energía?",
      a: "El trabajo es el proceso (la transferencia que hace una fuerza al desplazar algo) y la energía es la magnitud almacenada. Se miden ambos en julios.",
    },
    {
      q: "¿Qué ocurre con la energía cinética si duplico la velocidad?",
      a: "Se multiplica por cuatro, porque Ec es proporcional al cuadrado de la velocidad.",
    },
    {
      q: "¿La energía potencial depende de dónde ponga el cero?",
      a: "Su valor sí (elige el nivel de referencia), pero los cambios de energía, que son los que importan en los problemas, no dependen de esa elección.",
    },
    {
      q: "¿Qué es la potencia?",
      a: "La rapidez con la que se realiza un trabajo: P = W/t, medida en vatios (W). 1 W = 1 J/s.",
    },
  ],
};

const momentum: TopicPage = {
  slug: "cantidad-de-movimiento",
  topic: "momentum",
  area: "physics",
  short: "Física",
  title: "Cantidad de movimiento y choques: conservación del momento lineal",
  description:
    "Qué es la cantidad de movimiento (momentum), cómo se calcula p = m·v y cómo se aplican las conservaciones en choques y rebotes.",
  intro: [
    "La cantidad de movimiento o momento lineal es la «inercia del movimiento»: mide cuánto cuesta parar un cuerpo en movimiento. Se define como p = m·v y se mide en kg·m/s. Un camión lento y un balón rápido pueden tener el mismo momentum, pero el camión es infinitamente más difícil de detener.",
    "Su importancia viene de la conservación: en un sistema aislado, el momentum total antes de una colisión es igual al después. Eso permite resolver choques sin saber las fuerzas enormes que aparecen entre las piezas, que en la práctica son imposibles de medir. Es la gran herramienta de la mecánica de colisiones.",
    "Los choques se clasifican según se conserve o no la energía cinética: elásticos (se conserva todo), inelásticos (se conserva el momentum pero no la energía cinética, y los cuerpos quedan pegados) e inelasticamente parciales, los del mundo real. En todos vale la conservación del momentum; la diferencia está en qué pasa con la energía.",
  ],
  formulas: [
    {
      tex: "p = m\\,v",
      name: "Cantidad de movimiento",
      note: "Masa en kg, velocidad en m/s, resultado en kg·m/s.",
    },
    {
      tex: "\\sum p_{antes} = \\sum p_{después}",
      name: "Conservación",
      note: "Vectorial: se suman con signo según el sentido de cada cuerpo.",
    },
    {
      tex: "m_1v_1 + m_2v_2 = (m_1+m_2)v'",
      name: "Choque inelástico",
      note: "Los cuerpos quedan juntos y siguen con una velocidad común.",
    },
    {
      tex: "F\\,\\Delta t = \\Delta p",
      name: "Impulso",
      note: "El momento que cambia es fuerza por tiempo de contacto: base de los airbags.",
    },
  ],
  method: [
    {
      h: "1. Define el sentido positivo",
      p: "El momentum es vectorial. Elige un sentido (por ejemplo, el del cuerpo 1) y pon signo menos a las velocidades que vayan al contrario.",
    },
    {
      h: "2. Escribe el momentum de cada cuerpo",
      p: "p = m·v para cada uno, con el signo ya aplicado. No olvides convertir gramos a kilogramos.",
    },
    {
      h: "3. Suma antes y después",
      p: "Iguala el total antes de la colisión con el total después. Esa igualdad es la única ecuación que necesitas.",
    },
    {
      h: "4. Despeja la incógnita",
      p: "En choques pegados aparece (m₁ + m₂)·v′; en rebotes, la velocidad final del otro cuerpo.",
    },
    {
      h: "5. Comprueba con la energía",
      p: "En un choque inelástico la energía cinética disminuye (se disipa en calor y deformación). Si calculas que aumentó, hay un fallo.",
    },
  ],
  mistakes: [
    {
      error: "Olvidar el signo de la velocidad de un cuerpo que va al revés.",
      fix: "Es vectorial: si los cuerpos se acercan, sus velocidades tienen signos opuestos en la suma.",
    },
    {
      error: "Usar gramos en vez de kilogramos.",
      fix: "El momentum se calcula con masa en SI: 300 g es 0,3 kg.",
    },
    {
      error: "Suponer que en todo choque se conserva la energía cinética.",
      fix: "Solo en los elásticos. En los inelásticos se conserva el momentum, pero la energía cinética se pierde en forma de calor y deformación.",
    },
    {
      error: "Mezclar cantidad de movimiento con fuerza.",
      fix: "p = mv es una cantidad de movimiento; F = ma es fuerza. Se relacionan por el impulso: F·Δt = Δp.",
    },
  ],
  faq: [
    {
      q: "¿En qué unidades se mide la cantidad de movimiento?",
      a: "En kilogramos por metro por segundo (kg·m/s), que equivale a newton por segundo (N·s).",
    },
    {
      q: "¿Qué se conserva en una colisión?",
      a: "El momento lineal total del sistema siempre (si no hay fuerzas externas). La energía cinética solo se conserva en los choques elásticos.",
    },
    {
      q: "¿Por qué los airbags reducen el daño?",
      a: "Porque alargar el tiempo de contacto Δt reduce la fuerza que recibe el cuerpo para el mismo cambio de momentum: F = Δp/Δt.",
    },
  ],
};

const electricidad: TopicPage = {
  slug: "electricidad",
  topic: "electricity",
  area: "physics",
  short: "Física",
  title: "Electricidad: ley de Ohm, potencia y circuitos",
  description:
    "Ley de Ohm, intensidad, tensión y resistencia, potencia eléctrica y asociación de resistencias, con fórmulas y problemas resueltos.",
  intro: [
    "La ley de Ohm relaciona las tres magnitudes de un circuito: la tensión V (voltios) impulsa la corriente I (amperios) a través de una resistencia R (ohmios), y las tres quedan ligadas por V = R·I. Conocidas dos, la tercera se despeja en un paso.",
    "Tensión, corriente y resistencia son fáciles de confundir. Puedes imaginarlo con una tubería: la tensión es la presión con la que entra el agua, la corriente es el caudal que circula y la resistencia es lo estrecho del tubo. Más presión (V) da más caudal (I), y un tubo más estrecho (R) lo reduce.",
    "De la ley de Ohm sale además la potencia eléctrica, P = V·I, la que pagan la factura de la luz y la que disipa la resistencia en forma de calor. Es la base de todos los cálculos domésticos: un aparato de 220 V que consume 5 A tiene una potencia de 1100 W, es decir, 1,1 kW.",
  ],
  formulas: [
    {
      tex: "V = R\\,I",
      name: "Ley de Ohm",
      note: "V en voltios, R en ohmios, I en amperios. Despejable en cualquiera de las tres.",
    },
    {
      tex: "I = \\dfrac{V}{R},\\qquad R = \\dfrac{V}{I}",
      name: "Despejes",
      note: "La corriente es inversamente proporcional a la resistencia para una tensión fija.",
    },
    {
      tex: "P = V\\,I = I^2 R = \\dfrac{V^2}{R}",
      name: "Potencia eléctrica",
      note: "Se mide en vatios (W). Las tres formas salen de combinar P = VI con la ley de Ohm.",
    },
    {
      tex: "W = P\\,t",
      name: "Energía consumida",
      note: "Potencia por tiempo: en kWh si P va en kilovatios y t en horas (lo que factura la luz).",
    },
    {
      tex: "R_{eq} = R_1 + R_2 + \\cdots",
      name: "Resistencias en serie",
      note: "En paralelo se suman los inversos: 1/Req = 1/R₁ + 1/R₂.",
    },
  ],
  method: [
    {
      h: "1. Identifica qué te dan y qué te piden",
      p: "Anota V, I y R con sus unidades (V, A y Ω). Si te dan milivoltios o miliamperios, pasa a la unidad SI dividiendo entre 1000.",
    },
    {
      h: "2. Comprueba que la ley de Ohm es aplicable",
      p: "V = R·I vale para conductores ohmicos en régimen estacionario; es el 99 % de los problemas de curso medio.",
    },
    {
      h: "3. Despeja la incógnita",
      p: "Si piden corriente, I = V/R; si piden resistencia, R = V/I; si piden tensión, V = R·I.",
    },
    {
      h: "4. Para potencia, combina con la ley de Ohm",
      p: "Con V e I directo: P = V·I. Si falta alguno, sustituye con la ley de Ohm para llegar a P = I²R o P = V²/R.",
    },
    {
      h: "5. Comprueba las unidades",
      p: "Voltio por amperio es vatio y vatio por segundo es julio. Si te sale una unidad que no reconoces, revisa la conversión.",
    },
  ],
  mistakes: [
    {
      error: "Dividir la tensión entre la corriente cuando toca multiplicar.",
      fix: "R = V/I, pero V = R·I. Escribe la fórmula base antes de sustituir.",
    },
    {
      error: "Mezclar V (voltaje) con vatios (potencia).",
      fix: "La V mayúscula de la ley de Ohm es voltio de tensión; el vatio (W) es potencia. No son la misma letra ni la misma magnitud.",
    },
    {
      error: "Usar miliamperios sin convertir.",
      fix: "15 mA = 0,015 A. Trabaja siempre en amperios y voltios.",
    },
    {
      error: "Confundir resistencia en serie y en paralelo.",
      fix: "En serie se suman (R₁ + R₂); en paralelo se suman los inversos y el total siempre es menor que la menor de ellas.",
    },
  ],
  faq: [
    {
      q: "¿Qué dice la ley de Ohm?",
      a: "Que la tensión entre los extremos de un conductor es proporcional a la corriente que lo atraviesa: V = R·I. La constante de proporcionalidad es la resistencia.",
    },
    {
      q: "¿Cómo se calcula la potencia eléctrica?",
      a: "P = V·I, o bien P = I²R o P = V²/R combinándola con la ley de Ohm. Se mide en vatios.",
    },
    {
      q: "¿Qué diferencia hay entre tensión y corriente?",
      a: "La tensión (V) es la «presión» que empuja las cargas; la corriente (A) es la cantidad de carga que circula por unidad de tiempo.",
    },
    {
      q: "¿Qué consumo tiene un aparato de 1000 W usado 3 horas?",
      a: "1 kWh × 3 = 3 kWh, es decir 0,003 MWh. Ese kWh es la unidad con la que se factura la electricidad.",
    },
  ],
};

export const TOPICS: TopicPage[] = [
  lineales,
  cuadraticas,
  derivadas,
  integrales,
  geometria,
  trigonometria,
  aritmetica,
  cinematica,
  dinamica,
  energia,
  momentum,
  electricidad,
];

export function findTopic(slug: string): TopicPage | undefined {
  return TOPICS.find((t) => t.slug === slug);
}

/** Etiqueta corta de cada guía (para enlaces y listados). */
const LABELS: Record<string, string> = {
  "ecuaciones-lineales": "Ecuaciones lineales",
  "ecuaciones-cuadraticas": "Ecuaciones cuadráticas",
  derivadas: "Derivadas",
  integrales: "Integrales",
  geometria: "Geometría",
  trigonometria: "Trigonometría",
  aritmetica: "Aritmética",
  cinematica: "Cinemática",
  dinamica: "Dinámica",
  "energia-y-trabajo": "Energía y trabajo",
  "cantidad-de-movimiento": "Cantidad de movimiento",
  electricidad: "Electricidad",
};

export function labelFor(slug: string): string {
  return LABELS[slug] ?? slug;
}

/** Tema del motor -> guía de teoría (las ecuaciones tienen dos guías). */
const BY_TOPIC: Partial<Record<Topic, string | string[]>> = {
  equation: ["ecuaciones-lineales", "ecuaciones-cuadraticas"],
  derivative: "derivadas",
  integral: "integrales",
  geometry: "geometria",
  trigonometry: "trigonometria",
  arithmetic: "aritmetica",
  kinematics: "cinematica",
  dynamics: "dinamica",
  energy: "energia-y-trabajo",
  momentum: "cantidad-de-movimiento",
  electricity: "electricidad",
};

function slugsFor(topic: Topic): string[] {
  const v = BY_TOPIC[topic];
  if (!v) return [];
  return Array.isArray(v) ? v : [v];
}

/** Guías de teoría de un tema del motor (para enlazar desde listados). */
export function theoryLinksFor(topic: Topic): Array<{ slug: string; label: string }> {
  return slugsFor(topic)
    .map((slug) => ({ slug, label: labelFor(slug) }))
    .filter((l) => Boolean(findTopic(l.slug)));
}

/**
 * Página de teoría recomendada para un problema del catálogo.
 * (Las ecuaciones se dividen en lineales y cuadráticas.)
 */
export function topicFor(problem: string, topic: Topic): TopicPage | undefined {
  const slugs = slugsFor(topic);
  if (!slugs.length) return undefined;
  const slug =
    topic === "equation"
      ? /\^2|²/.test(problem)
        ? slugs[1]
        : slugs[0]
      : slugs[0];
  return findTopic(slug);
}

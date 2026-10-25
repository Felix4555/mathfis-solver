import Link from "next/link";
import { BookOpen, CheckCircle2, ChevronRight, HelpCircle, Lightbulb, ShieldAlert, Sparkles } from "lucide-react";
import { JsonLd } from "./StructuredData";

const FAQ_ITEMS = [
  {
    q: "¿Cómo aprender matemáticas y física paso a paso con MathFis Solver?",
    a: "MathFis Solver desglosa cada ejercicio en etapas estructuradas: primero identifica el tema y los datos dados, formula la ecuación o ley física aplicable, ejecuta los despejes algebraicos de forma detallada y finalmente comprueba el resultado. Esto te permite entender la metodología deductiva y no simplemente copiar una cifra final.",
  },
  {
    q: "¿Cómo resolver problemas de física paso a paso?",
    a: "Para resolver problemas de cinemática, dinámica, energía o circuitos, escribe o dicta las magnitudes conocidas (por ejemplo: masa, velocidad, aceleración, voltaje). El sistema clasifica el fenómeno físico, selecciona las fórmulas correctas (como las leyes de Newton, ecuaciones de MRU/MRUA o la ley de Ohm) y realiza la sustitución paso a paso con sus unidades correspondientes.",
  },
  {
    q: "¿Puedo subir una foto de mi problema de matemáticas o física?",
    a: "Sí. MathFis Solver cuenta con tecnología OCR integrada que procesa fotos de enunciados impresos o manuscritos directamente en tu navegador, sin enviar tus imágenes a bases de datos permanentes.",
  },
  {
    q: "¿Qué temas de matemáticas y física están disponibles?",
    a: "En matemáticas cubre ecuaciones lineales y cuadráticas, derivadas, integrales, aritmética, geometría y trigonometría. En física abarca cinemática (MRU, MRUA, tiro parabólico), dinámica y leyes de Newton, trabajo y energía, cantidad de movimiento y circuitos eléctricos con ley de Ohm.",
  },
  {
    q: "¿Cómo apoya la inteligencia artificial en el aprendizaje?",
    a: "La inteligencia artificial y los algoritmos simbólicos interpretan enunciados formulados en lenguaje natural, identifican el concepto de fondo y generan explicaciones adaptadas con consejos prácticos para evitar los errores más comunes en exámenes.",
  },
  {
    q: "¿Es gratuito y requiere registro?",
    a: "MathFis Solver es 100% gratuito y no requiere registrarse ni proporcionar datos personales. Tu historial de ejercicios se guarda de forma segura únicamente en tu propio dispositivo.",
  },
];

export function HomeSeoHeader() {
  return (
    <header className="mb-6 space-y-2 text-center lg:text-left">
      <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
        <Sparkles className="h-3.5 w-3.5" /> Solucionador y Tutor Inteligente con IA
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
        Aprender Matemáticas y Resolver Problemas de Matemáticas y Física
      </h1>
      <p className="max-w-3xl text-sm leading-relaxed text-muted-foreground sm:text-base">
        Escribe, dicta o sube una foto de tu ejercicio. Obtén la solución completa explicada paso a
        paso, con fórmulas matemáticas justificadas, gráficas interactivas y comprobaciones.
      </p>
    </header>
  );
}

export function HomeSeoSection() {
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_ITEMS.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.a,
      },
    })),
  };

  return (
    <div className="no-print mt-12 space-y-12 border-t border-border pt-10">
      <JsonLd>{faqSchema}</JsonLd>

      {/* 1. Metodología Didáctica */}
      <section className="space-y-6">
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            ¿Por qué aprender matemáticas y resolver problemas con MathFis Solver?
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Diseñado para que domines el razonamiento lógico-matemático y no solo el resultado final.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-primary/50">
            <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
              <CheckCircle2 className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-foreground">Explicación Paso a Paso</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Comprende cada transformación algebraica y cada ley de la física. Mostramos las
              fórmulas originales, el despeje intermedio y la comprobación del resultado.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-primary/50">
            <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-foreground">Entrada Inteligente Multimodal</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Introduce problemas mediante teclado matemático con símbolos, dictado por voz o sube
              una fotografía de tu libreta mediante reconocimiento óptico de caracteres (OCR).
            </p>
          </div>

          <div className="rounded-xl border border-border bg-card p-5 shadow-xs transition-colors hover:border-primary/50">
            <div className="mb-3 inline-flex rounded-lg bg-primary/10 p-2 text-primary">
              <Lightbulb className="h-5 w-5" />
            </div>
            <h3 className="font-semibold text-foreground">Prevención de Errores Comunes</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
              Aprende a evitar los fallos más habituales en exámenes: signos negativos en paréntesis,
              confusión de unidades y aplicación incorrecta de fórmulas.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Temas destacados con enlaces internos */}
      <section className="space-y-6">
        <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
          <div>
            <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              Temas clave de Matemáticas y Física para aprender
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Guías completas con teoría fundamental, fórmulas clave y problemas resueltos paso a paso.
            </p>
          </div>
          <Link
            href="/aprender"
            className="inline-flex items-center text-sm font-medium text-primary hover:underline"
          >
            Ver todas las guías <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Link
            href="/aprender/ecuaciones-lineales"
            className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-xs"
          >
            <span className="text-xs font-semibold text-primary">Matemáticas</span>
            <h3 className="mt-1 text-sm font-semibold text-foreground group-hover:text-primary">
              Ecuaciones Lineales
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              Despejes de 1er grado, manejo de paréntesis y fracciones con comprobación.
            </p>
          </Link>

          <Link
            href="/aprender/ecuaciones-cuadraticas"
            className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-xs"
          >
            <span className="text-xs font-semibold text-primary">Matemáticas</span>
            <h3 className="mt-1 text-sm font-semibold text-foreground group-hover:text-primary">
              Ecuaciones Cuadráticas
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              Fórmula general, discriminante, factorización y raíces reales o complejas.
            </p>
          </Link>

          <Link
            href="/aprender/derivadas"
            className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-xs"
          >
            <span className="text-xs font-semibold text-primary">Matemáticas</span>
            <h3 className="mt-1 text-sm font-semibold text-foreground group-hover:text-primary">
              Derivadas y Cálculo
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              Regla de la potencia, regla de la cadena, producto, cociente y máximos/mínimos.
            </p>
          </Link>

          <Link
            href="/aprender/integrales"
            className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-xs"
          >
            <span className="text-xs font-semibold text-primary">Matemáticas</span>
            <h3 className="mt-1 text-sm font-semibold text-foreground group-hover:text-primary">
              Cálculo Integral
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              Integrales inmediatas, constantes de integración y áreas bajo la curva.
            </p>
          </Link>

          <Link
            href="/aprender/cinematica-mru-mrua"
            className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-xs"
          >
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Física
            </span>
            <h3 className="mt-1 text-sm font-semibold text-foreground group-hover:text-primary">
              Cinemática: MRU y MRUA
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              Velocidad, aceleración constante, posición temporal y tiro parabólico.
            </p>
          </Link>

          <Link
            href="/aprender/dinamica-leyes-newton"
            className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-xs"
          >
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Física
            </span>
            <h3 className="mt-1 text-sm font-semibold text-foreground group-hover:text-primary">
              Dinámica y Leyes de Newton
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              Fuerza neta (F = m·a), planos inclinados, rozamiento y equilibrio.
            </p>
          </Link>

          <Link
            href="/aprender/trabajo-energia"
            className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-xs"
          >
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Física
            </span>
            <h3 className="mt-1 text-sm font-semibold text-foreground group-hover:text-primary">
              Trabajo y Energía
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              Energía cinética, potencial gravitatoria y principio de conservación.
            </p>
          </Link>

          <Link
            href="/aprender/electricidad-ley-ohm"
            className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary hover:shadow-xs"
          >
            <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Física
            </span>
            <h3 className="mt-1 text-sm font-semibold text-foreground group-hover:text-primary">
              Electricidad y Ley de Ohm
            </h3>
            <p className="mt-1 text-xs text-muted-foreground line-clamp-2">
              Relación entre voltaje, corriente, resistencia (V = I·R) y potencia eléctrica.
            </p>
          </Link>
        </div>
      </section>

      {/* 3. Preguntas Frecuentes (FAQ) */}
      <section className="space-y-6">
        <div>
          <h2 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
            Preguntas Frecuentes sobre el Aprendizaje de Matemáticas y Física
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Respuestas a las dudas más comunes sobre la metodología y el uso del tutor virtual.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          {FAQ_ITEMS.map((item, idx) => (
            <div key={idx} className="rounded-lg border border-border bg-card p-4">
              <h3 className="flex items-start gap-2 text-sm font-semibold text-foreground">
                <HelpCircle className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span>{item.q}</span>
              </h3>
              <p className="mt-2 pl-6 text-xs leading-relaxed text-muted-foreground">
                {item.a}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. Banner Legal y Transparencia en IA */}
      <section className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 sm:p-5">
        <div className="flex items-start gap-3">
          <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div className="space-y-1 text-xs leading-relaxed text-muted-foreground">
            <h3 className="font-semibold text-foreground">
              Aviso de Transparencia en Inteligencia Artificial y Compromiso Ético
            </h3>
            <p>
              MathFis Solver es un tutor interactivo impulsado por algoritmos simbólicos e
              inteligencia artificial, concebido como soporte de estudio y aprendizaje guiado. Las
              soluciones generadas deben ser revisadas por el estudiante y no sustituyen las
              enseñanzas de un profesor ni las normativas académicas de exámenes de tu centro educativo.
              Para más información, consulta nuestros{" "}
              <Link href="/terms" className="text-primary underline hover:opacity-90">
                Términos de Uso
              </Link>{" "}
              y la{" "}
              <Link href="/privacy" className="text-primary underline hover:opacity-90">
                Política de Privacidad
              </Link>
              .
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

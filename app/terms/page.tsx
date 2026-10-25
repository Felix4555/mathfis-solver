import type { Metadata } from "next";
import { DocPage } from "@/components/seo/DocPage";
import { APP_URL } from "@/lib/site";

const UPDATED = "24 de octubre de 2026";

export const metadata: Metadata = {
  title: "Términos y condiciones de uso | MathFis Solver",
  description:
    "Condiciones de uso de MathFis Solver: finalidad educativa, responsabilidad sobre los resultados y uso aceptable del servicio.",
  alternates: { canonical: `${APP_URL}/terms` },
};

export default function TermsPage() {
  return (
    <DocPage
      title="Términos y condiciones"
      description="Términos y condiciones de uso de MathFis Solver."
      canonical="/terms"
      updated={UPDATED}
      intro="Al utilizar MathFis Solver aceptas estas condiciones. Están redactadas en lenguaje llano porque el sitio está dirigido principalmente a estudiantes."
      sections={[
        {
          h: "1. Objeto del servicio",
          p: [
            "MathFis Solver es una herramienta educativa gratuita orientada al aprendizaje de matemáticas y física mediante la exposición del desarrollo paso a paso, las fórmulas empleadas y representaciones gráficas interactivas.",
            "El servicio tiene una finalidad estrictamente formativa, didáctica y de apoyo al estudio.",
          ],
        },
        {
          h: "2. Uso de Inteligencia Artificial y Transparencia Algorítmica",
          p: [
            "De conformidad con las normativas internacionales de transparencia en sistemas automatizados (incluido el Reglamento de Inteligencia Artificial de la Unión Europea - EU AI Act), se informa expresamente al usuario de que MathFis Solver emplea algoritmos de procesamiento simbólico, heurísticas computacionales e inteligencia artificial para la transcripción OCR de imágenes, el reconocimiento de lenguaje natural y la generación estructurada de explicaciones.",
            "Al interactuar con el servicio, el usuario comprende y acepta que está recibiendo respuestas y desarrollos asistidos por sistemas automatizados.",
          ],
        },
        {
          h: "3. Naturaleza de los resultados y descargo sobre IA",
          p: [
            "Los sistemas automatizados y basados en IA pueden generar resultados imprecisos, omisiones, aproximaciones numéricas o interpretaciones no deseadas (fenómenos conocidos como imprecisiones algorítmicas o alucinaciones), especialmente ante enunciados redactados de forma ambigua, datos contradictorios o problemas fuera del temario estándar.",
            "Las soluciones y desarrollos no constituyen certificación oficial, peritaje técnico, asesoría de ingeniería ni corrección académica reglada. Es responsabilidad exclusiva del usuario contrastar y verificar todo procedimiento y resultado antes de utilizarlo.",
            "Queda expresamente prohibido el uso de los cálculos generados por MathFis Solver para el diseño, cálculo o toma de decisiones en proyectos de ingeniería crítica, edificación, salud, seguridad o infraestructuras donde un error matemático pudiera ocasionar perjuicios materiales o personales.",
          ],
        },
        {
          h: "4. Integridad académica y código de honor",
          p: [
            "MathFis Solver está concebido para fomentar la comprensión profunda del método deductivo y ayudar a los estudiantes a superar bloqueos en su estudio personal.",
            "El usuario se compromete a actuar con integridad y a no utilizar este servicio para cometer fraude académico, plagio o saltarse las normas de conducta de sus respectivos centros educativos o universidades, prohibiéndose su empleo durante exámenes, evaluaciones formales o pruebas de acceso supervisadas.",
          ],
        },
        {
          h: "5. Uso aceptable y límites de servicio",
          p: [
            "Se autoriza el uso individual, educativo y docente en aulas escolares. Queda prohibida la extracción masiva de datos (scraping), la ingeniería inversa, la saturación deliberada de las API (ataques de denegación de servicio) o cualquier intento de vulnerar las restricciones técnicas del sistema.",
            "Para garantizar la disponibilidad gratuita para toda la comunidad de estudiantes, se aplican límites de tasa de peticiones (rate limiting) por usuario.",
          ],
        },
        {
          h: "6. Propiedad intelectual",
          p: [
            "Los enunciados, textos y preguntas que introduzcas en el sistema siguen siendo de tu autoría; MathFis Solver no reclama derechos de propiedad sobre ellos.",
            "Las leyes físicas universales, teoremas y fórmulas matemáticas pertenecen al dominio público común.",
            "La plataforma, su código fuente, arquitectura de software, diseño gráfico, selección tipográfica, elementos interactivos y guías didácticas originales son propiedad exclusiva de MathFis Solver y están protegidos por las leyes de propiedad intelectual.",
          ],
        },
        {
          h: "7. Limitación de responsabilidad",
          p: [
            "El servicio se presta «tal cual» (as-is) y «según disponibilidad». En la medida máxima permitida por la legislación aplicable, MathFis Solver no responderá por daños directos, indirectos, incidentales o consecuentes derivados del uso, la exactitud de los resultados o la indisponibilidad temporal del sitio.",
          ],
        },
        {
          h: "8. Modificaciones",
          p: [
            "Nos reservamos el derecho de actualizar o modificar estas condiciones para adaptarlas a novedades técnicas, legislativas o funcionales. La fecha de la última revisión se encuentra indicada al inicio.",
          ],
        },
      ]}
    />
  );
}

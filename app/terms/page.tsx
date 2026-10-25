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
            "MathFis Solver es una herramienta educativa gratuita que resuelve problemas de matemáticas y física mostrando el desarrollo paso a paso, las fórmulas empleadas y, cuando procede, una representación gráfica.",
            "El servicio tiene finalidad exclusivamente académica y de aprendizaje.",
          ],
        },
        {
          h: "2. Naturaleza de los resultados",
          p: [
            "Las soluciones se generan de forma automática. Aunque el motor está pensado para ser riguroso, no garantizamos que estén libres de errores, especialmente ante enunciados ambiguos, erróneos o fuera de los temas soportados.",
            "El resultado debe revisarse y comprenderse antes de usarlo. No sustituye a un libro de texto, a un profesor ni a la corrección oficial de un examen.",
            "Es responsabilidad del usuario (o de su centro educativo o familia) verificar los datos antes de tomar cualquier decisión basada en ellos.",
          ],
        },
        {
          h: "3. Uso aceptable",
          p: [
            "Se permite el uso personal y en el aula. Queda prohibido: extraer o reutilizar masivamente el contenido para crear un servicio competidor, interferir con el funcionamiento del sitio, intentar eludir los límites de uso del servicio o utilizar el sistema para fines ilícitos.",
            "El envío de problemas está sujeto a límites razonables de uso para mantener el servicio disponible para todos.",
          ],
        },
        {
          h: "4. Propiedad intelectual",
          p: [
            "La interfaz, el diseño, el código y los textos explicativos del sitio son propiedad de MathFis Solver. Los problemas que tú escribes son tuyos y no reclamamos derecho alguno sobre ellos.",
            "Las fórmulas y los resultados matemáticos no están sujetos a derechos de autor; el resto del contenido sí.",
          ],
        },
        {
          h: "5. Enlaces y servicios de terceros",
          p: [
            "El sitio incluye recursos de terceros (tipografías y librerías servidas desde CDN, y, si se muestran, anuncios de redes publicitarias). Sus políticas de privacidad y condiciones son responsabilidad de cada proveedor.",
          ],
        },
        {
          h: "6. Limitación de responsabilidad",
          p: [
            "El servicio se presta «tal cual». En la máxima medida permitida por la ley, no respondemos por daños directos o indirectos derivados del uso o la imposibilidad de uso del sitio, incluidos errores de cálculo, interrupciones o decisiones tomadas a partir de las soluciones mostradas.",
          ],
        },
        {
          h: "7. Modificaciones",
          p: [
            "Podemos modificar, suspender o retirar funcionalidades en cualquier momento sin preaviso. El uso continuado tras un cambio implica la aceptación de la versión vigente.",
          ],
        },
      ]}
    />
  );
}

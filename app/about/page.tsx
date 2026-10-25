import type { Metadata } from "next";
import { DocPage } from "@/components/seo/DocPage";
import { LinkButton } from "@/components/ui";
import { APP_URL } from "@/lib/site";

const UPDATED = "24 de octubre de 2026";

export const metadata: Metadata = {
  title: "Sobre MathFis Solver | Quiénes somos y cómo resolvemos",
  description:
    "MathFis Solver es una herramienta educativa gratuita: qué la mueve, cómo resuelve los problemas y quién está detrás.",
  alternates: { canonical: `${APP_URL}/about` },
};

export default function AboutPage() {
  return (
    <DocPage
      title="Sobre nosotros"
      description="Quiénes somos y cómo funciona MathFis Solver."
      canonical="/about"
      updated={UPDATED}
      intro="MathFis Solver nació de una idea simple: un estudiante que se atasca a las once de la noche con un ejercicio necesita entenderlo, no solo ver el número final."
      sections={[
        {
          h: "Qué hacemos",
          p: [
            "Resolvemos problemas de matemáticas y física mostrando el desarrollo completo: qué datos tenemos, qué fórmula corresponde, por qué se aplica en ese orden y cómo se comprueba el resultado.",
            "Además del número final entregamos la explicación de cada paso, la teoría que hay detrás, los errores habituales y un método alternativo de comprobación. Es la diferencia entre copiar una respuesta y aprender a resolver el ejercicio.",
          ],
        },
        {
          h: "Cómo resolvemos",
          p: [
            "Utilizamos un motor de cálculo propio escrito en TypeScript: analiza el enunciado, detecta el tema (ecuación, derivada, cinemática, dinámica…), identifica las magnitudes y aplica el procedimiento correspondiente paso a paso.",
            "Si el enunciado es ambiguo o incompleto, en lugar de inventar datos el sistema lo indica y pide aclaración. Si no puede resolverlo, lo dice con claridad y sugiere cómo reformular el problema.",
            "Todo el cálculo se ejecuta en nuestro servidor. El texto que escribes no se envía a servicios externos de inteligencia artificial ni se usa para entrenar modelos.",
          ],
        },
        {
          h: "Para quién es",
          p: [
            "Estudiantes de secundaria, bachillerato y primeros cursos de universidad, profesores que buscan un ejemplo resuelto para el aula, y familias que quieren ayudar con los deberes aunque hace años que no tocan una ecuación.",
            "El servicio es gratuito y no exige registro: escribe, dicta o sube una foto del problema y obtén la resolución.",
          ],
        },
        {
          h: "Nuestro compromiso",
          p: [
            "Rigor por encima de prisa. No prometemos la respuesta en dos segundos a cualquier pregunta; prometemos que, cuando resolvemos, entendamos qué estamos resolviendo y lo expliquemos bien.",
            "Privacidad por defecto: sin cuentas, sin historial en la nube y sin vender datos. Tu historial vive en tu navegador.",
          ],
        },
      ]}
    >
      <div className="flex flex-wrap gap-3 pt-2">
        <LinkButton href="/">Probar el resolutivo</LinkButton>
        <LinkButton href="/resolver" variant="outline">
          Ver problemas resueltos
        </LinkButton>
      </div>
    </DocPage>
  );
}

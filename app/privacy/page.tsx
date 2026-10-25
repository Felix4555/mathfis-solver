import type { Metadata } from "next";
import { DocPage } from "@/components/seo/DocPage";
import { APP_URL } from "@/lib/site";

const UPDATED = "24 de octubre de 2026";

export const metadata: Metadata = {
  title: "Política de privacidad | MathFis Solver",
  description:
    "Cómo MathFis Solver trata tus datos, cookies, analítica y los anuncios de terceros que se muestran en el sitio.",
  alternates: { canonical: `${APP_URL}/privacy` },
};

export default function PrivacyPage() {
  return (
    <DocPage
      title="Política de privacidad"
      description="Política de privacidad de MathFis Solver."
      canonical="/privacy"
      updated={UPDATED}
      intro="Tu privacidad es importante. Esta página explica de forma clara qué información recoge MathFis Solver, con qué finalidad y qué control tienes sobre ella. El sitio no requiere registro y no pide datos personales para funcionar."
      sections={[
        {
          h: "1. Responsable del sitio",
          p: [
            "MathFis Solver es una herramienta educativa gratuita orientada a estudiantes y docentes de matemáticas y física. Para cualquier consulta referente al tratamiento de datos o privacidad, puedes escribir a la dirección de contacto indicada en nuestra página de contacto.",
          ],
        },
        {
          h: "2. Datos que tratamos y procesamiento de IA",
          p: [
            "Texto del problema y dictado por voz: El texto que escribes o dictas se procesa en tiempo real con el único propósito de interpretar la consulta matemática o física y calcular la solución paso a paso. No se vincula a tu identidad personal.",
            "Imágenes y fotos subidas (OCR): Al subir una fotografía de un ejercicio para su reconocimiento óptico, la imagen es procesada directamente en el navegador del usuario (mediante Tesseract.js / WebAssembly) o de forma estrictamente efímera en memoria. MathFis Solver NO almacena las imágenes en ningún servidor permanente, ni recopila metadatos de ubicación EXIF, ni extrae datos biométricos o faciales.",
            "No entrenamiento de modelos públicos: Tus problemas y consultas no se emplean para entrenar modelos externos de inteligencia artificial comercial ni se venden a terceros.",
            "Almacenamiento local (localStorage): Tu historial de consultas, ejercicios favoritos, idioma y preferencia de modo oscuro se almacenan localmente en tu propio dispositivo a través de la tecnología localStorage del navegador. Puedes borrarlos en cualquier momento desde la interfaz o vaciando los datos de tu navegador.",
          ],
        },
        {
          h: "3. Protección especial de menores de edad (COPPA / RGPD de Menores)",
          p: [
            "MathFis Solver es un recurso educativo de acceso público frecuentado por estudiantes de educación primaria, secundaria y bachillerato, muchos de los cuales son menores de edad.",
            "Diseño de privacidad estricto para menores: No requerimos la creación de cuentas de usuario, ni solicitamos nombres, correos electrónicos, números de teléfono, edad ni centros escolares para acceder a las soluciones.",
            "Recomendamos que los menores de 14 años cuenten con la orientación y consentimiento de sus padres, madres o tutores legales al navegar por internet y utilizar herramientas educativas digitales.",
          ],
        },
        {
          h: "4. Cookies y tecnologías de terceros",
          p: [
            "Cumplimos con el estándar Google Consent Mode v2: por defecto, cualquier cookie de analítica o publicidad personalizada permanece estrictamente bloqueada hasta que el usuario decida aceptarla voluntariamente en el aviso de consentimiento.",
            "El sitio puede mostrar anuncios servidos a través de la red de Google AdSense. Google y sus asociados pueden emplear identificadores seudónimos para mostrar anuncios relevantes según tu navegación previa. Puedes consultar la política de Google en https://policies.google.com/privacy.",
          ],
        },
        {
          h: "5. Derechos del usuario",
          p: [
            "Garantizamos el pleno ejercicio de tus derechos de acceso, rectificación, supresión, limitación y oposición reconocidos por el Reglamento General de Protección de Datos (RGPD) de la Unión Europea, la Ley Federal de Protección de Datos Personales en Posesión de los Particulares (LFPDPPP) de México, la Ley 25.326 de Argentina, la Ley 1581 de Colombia y normativas equivalentes. Dado que no almacenamos datos vinculados a tu identidad, cualquier historial local puede eliminarse instantáneamente pulsando el botón de papelera en el panel de historial.",
          ],
        },
        {
          h: "6. Modificaciones",
          p: [
            "Esta política de privacidad podrá actualizarse periódicamente para reflejar mejoras en la plataforma o cambios legislativos. Te invitamos a revisarla regularmente.",
          ],
        },
      ]}
    />
  );
}

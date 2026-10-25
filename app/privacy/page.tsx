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
            "MathFis Solver es una herramienta educativa gratuita de código propietario, orientada a estudiantes de matemáticas y física. Para cualquier consulta sobre privacidad puedes escribir a la dirección de contacto indicada en la página de contacto.",
          ],
        },
        {
          h: "2. Datos que recogemos",
          p: [
            "Datos introducidos por ti: el texto del problema que escribes, dictas o subes como imagen se envía a nuestro servidor exclusivamente para resolverlo. No se asocia a ninguna identidad y no se guarda en servidores de forma permanente.",
            "Almacenamiento local (localStorage): el historial de problemas, los favoritos, el idioma y el tema (claro/oscuro) se guardan en TU navegador, en tu propio equipo. Puedes borrarlos en cualquier momento limpiando los datos del sitio desde la configuración del navegador.",
            "Datos técnicos: como cualquier sitio web, podremos recibir información anónima del navegador (tipo de navegador, dispositivo, páginas visitadas) con finalidad estadística.",
          ],
        },
        {
          h: "3. Cookies y tecnologías similares",
          p: [
            "Usamos cookies o almacenamiento local para: recordar tu preferencia de idioma y tema, mantener la elección de consentimiento de cookies y, si lo aceptas, medir el tráfico de forma agregada.",
            "Puedes eliminar o bloquear las cookies desde la configuración de tu navegador sin que deje de funcionar el resolutivo. Solo la preferencia de consentimiento y las preferencias de interfaz se perderán.",
          ],
        },
        {
          h: "4. Servicios de terceros y publicidad",
          p: [
            "Este sitio puede mostrar anuncios de terceros, servidos a través de Google AdSense. Google y sus socios pueden utilizar cookies para mostrar anuncios en función de tus visitas anteriores a este u otros sitios web.",
            "Google usa la cookie DART para publicar anuncios según tu visita a este sitio y a otros de Internet. Puedes salir de la utilización de la cookie DART visitando la política de privacidad de la red de contenido de Google.",
            "Los anunciantes pueden recopilar información como tu dirección IP, el navegador o el dispositivo que usas. Google trata esos datos según su propia política de privacidad, que puedes consultar en https://policies.google.com/privacy.",
            "Solo se cargan los scripts de medición o publicidad cuando tú lo autorizas mediante el aviso de cookies. Si lo rechazas, no se establecerán cookies de publicidad o personalización.",
          ],
        },
        {
          h: "5. Datos que NO recogemos",
          p: [
            "No exigimos cuentas de usuario, ni nombre, correo, teléfono ni documento de identidad. No vendemos ni cedemos información a terceros con fines comerciales.",
            "No usamos los problemas que escribes para entrenar modelos ni los compartimos con servicios de inteligencia artificial externos: el cálculo se realiza con el motor propio de MathFis Solver.",
          ],
        },
        {
          h: "6. Derechos del usuario",
          p: [
            "Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición y limitación escribiéndonos. Si resides en el Espacio Económico Europeo, se aplican además las garantías del RGPD; si estás en México, la LFPDPPP; y en Argentina, la Ley 25.326 de Protección de Datos Personales.",
          ],
        },
        {
          h: "7. Cambios en esta política",
          p: [
            "Podemos actualizar esta política para reflejar cambios normativos o funcionales. La fecha de la última actualización aparece al inicio de la página.",
          ],
        },
      ]}
    />
  );
}

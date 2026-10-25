import type { Metadata } from "next";
import { DocPage } from "@/components/seo/DocPage";
import { APP_URL, CONTACT_EMAIL } from "@/lib/site";

const UPDATED = "24 de octubre de 2026";

export const metadata: Metadata = {
  title: "Contacto | MathFis Solver",
  description:
    "Escríbenos: dudas, errores detectados en una resolución, sugerencias de temas o propuestas de colaboración.",
  alternates: { canonical: `${APP_URL}/contact` },
};

export default function ContactPage() {
  return (
    <DocPage
      title="Contacto"
      description="Formas de contacto de MathFis Solver."
      canonical="/contact"
      updated={UPDATED}
      intro="Leemos todos los mensajes. Si detectas un error en una resolución, indícanos el problema tal como lo escribiste: nos ayuda mucho para reproducirlo."
      sections={[
        {
          h: "Correo electrónico",
          p: [
            `Escríbenos a ${CONTACT_EMAIL}. Suele responder en menos de 48 horas laborables.`,
          ],
        },
        {
          h: "Qué contarnos",
          p: [
            "Errores en una solución: copia el enunciado exacto y el resultado que esperabas. Si puedes, la URL de la página de la que partiste.",
            "Problemas que no se resuelven: pega el enunciado completo y dinos en qué tema esperas que encaje.",
            "Sugerencias de nuevos temas, colaboraciones o prensa: mencionalo en el asunto para no perderlo.",
          ],
        },
        {
          h: "Qué NO hacemos",
          p: [
            "No realizamos los deberes por encargo ni ofrecemos servicio de tutoría individual. Somos una herramienta de apoyo al estudio, y ese es el límite que nos imponemos.",
          ],
        },
      ]}
    >
      <div className="rounded-xl border border-border bg-card p-5">
        <p className="text-sm font-medium">Escribir un correo</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Se abrirá tu aplicación de correo con la dirección ya escrita.
        </p>
        <a
          href={`mailto:${CONTACT_EMAIL}?subject=MathFis%20Solver`}
          className="mt-3 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          {CONTACT_EMAIL}
        </a>
      </div>
    </DocPage>
  );
}

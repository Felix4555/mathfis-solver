import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { APP_URL } from "@/lib/site";
import { CookieConsent } from "@/components/CookieConsent";
import { AdSenseScript } from "@/components/AdSense";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: "MathFis Solver | Resuelve matemáticas y física paso a paso",
  description:
    "Escribe, dicta o sube una foto de un problema de matemáticas o física y obtén la solución paso a paso, fórmulas y gráficos.",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "MathFis Solver",
    type: "website",
    locale: "es_ES",
  },
  twitter: { card: "summary_large_image" },
};

/** Google Consent Mode v2: todo denegado por defecto, hasta que el usuario acepte. */
const CONSENT_DEFAULT = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
`;

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        {/* Consent Mode v2: debe ejecutarse antes que cualquier tag de Google */}
        <script dangerouslySetInnerHTML={{ __html: CONSENT_DEFAULT }} />
        {/* KaTeX desde CDN: evita problemas de resolución de CSS en el bundler */}
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css"
        />
        {/* Tesseract.js (OCR) desde CDN: se usa solo cuando el usuario sube imagen */}
        <script
          src="https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js"
          defer
        />
      </head>
      <body>
        {children}
        <CookieConsent />
        <AdSenseScript />
        {/* Analítica sin cookies (Vercel): no requiere consentimiento */}
        <Analytics />
      </body>
    </html>
  );
}

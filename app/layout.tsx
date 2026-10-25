import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Analytics } from "@vercel/analytics/react";
import "./globals.css";
import { APP_URL } from "@/lib/site";
import { CookieConsent } from "@/components/CookieConsent";
import { AdSenseScript } from "@/components/AdSense";

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: "Aprender Matemáticas y Resolver Problemas de Matemáticas y Física | MathFis Solver",
    template: "%s | MathFis Solver",
  },
  description:
    "Aprende matemáticas y física gratis y resuelve problemas paso a paso con explicaciones didácticas, fórmulas, gráficas interactivas y OCR por imagen o dictado por voz.",
  keywords: [
    "aprender matematicas",
    "aprender matematicas paso a paso",
    "resolver problemas de matematicas y fisica",
    "solucionador de matematicas",
    "problemas de fisica resueltos",
    "calculadora de matematicas paso a paso",
    "como resolver problemas de fisica",
    "ecuaciones lineales y cuadraticas",
    "derivadas e integrales resueltas",
    "cinematica mru mrua",
    "leyes de newton ejercicios resueltos",
    "circuitos electricos ley de ohm",
    "tutor de matematicas gratis online",
    "resolutor de matematicas con ia",
  ],
  authors: [{ name: "MathFis Solver" }],
  creator: "MathFis Solver",
  publisher: "MathFis Solver",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: { canonical: "/" },
  openGraph: {
    title: "Aprender Matemáticas y Resolver Problemas de Matemáticas y Física | MathFis Solver",
    description:
      "Aprende matemáticas y física gratis y resuelve problemas paso a paso con explicaciones didácticas, fórmulas, gráficas interactivas y OCR.",
    url: APP_URL,
    siteName: "MathFis Solver",
    locale: "es_ES",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MathFis Solver — Aprender Matemáticas y Física Paso a Paso",
    description:
      "Resuelve problemas de matemáticas y física paso a paso. Fórmulas, teoría, gráficas interactivas y asistencia didáctica.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

const SITE_STRUCTURED_DATA = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${APP_URL}/#website`,
      "url": APP_URL,
      "name": "MathFis Solver",
      "description": "Plataforma educativa para aprender matemáticas y resolver problemas de matemáticas y física paso a paso.",
      "inLanguage": "es-ES",
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": `${APP_URL}/?q={search_term_string}`
        },
        "query-input": "required name=search_term_string"
      }
    },
    {
      "@type": "WebApplication",
      "@id": `${APP_URL}/#app`,
      "name": "MathFis Solver",
      "url": APP_URL,
      "applicationCategory": "EducationalApplication",
      "operatingSystem": "All",
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      },
      "description": "Solucionador inteligente y tutor interactivo de matemáticas y física con desarrollo paso a paso, fórmulas, gráficas y OCR."
    }
  ]
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
        {/* Datos estructurados Schema.org para Google (WebSite y WebApplication) */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(SITE_STRUCTURED_DATA).replace(/</g, "\\u003c"),
          }}
        />
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

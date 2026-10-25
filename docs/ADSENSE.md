# 💰 Guía para monetizar con publicidad (Fase 0 → Fase 1)

Esta fase es **100% tráfico + anuncios**: sin cuentas, sin Stripe, sin base de
datos. Este documento recoge lo que ya está hecho y **lo único que tienes que
hacer tú** (crear la cuenta de AdSense).

---

## ✅ Hecho en el código

| Elemento | Dónde | Estado |
|---|---|---|
| Política de privacidad (menciona cookies y anuncios) | `/privacy` | ✅ |
| Términos y condiciones | `/terms` | ✅ |
| Quiénes somos (AdSense exige identificarse) | `/about` | ✅ |
| Página de contacto con email visible | `/contact` | ✅ |
| Enlaces legales en el footer (en todas las páginas) | `app/page.tsx` | ✅ |
| `ads.txt` (inventario) | `public/ads.txt` | ⚠️ *placeholder* |
| Banner de cookies con Aceptar/Rechazar | `components/CookieConsent.tsx` | ✅ |
| Google **Consent Mode v2** (todo `denied` por defecto) | `app/layout.tsx` | ✅ |
| Carga de AdSense solo tras consentimiento | `components/AdSense.tsx` | ✅ (inactivo) |
| Hueco de anuncio `<AdSlot>` | `components/AdSense.tsx` | ✅ (inactivo) |
| Analítica sin cookies (Vercel Analytics) | `app/layout.tsx` | ✅ |
| Sitemap (387 URLs) + robots.txt | `app/sitemap.ts`, `app/robots.ts` | ✅ |
| 395 páginas de problemas indexables + JSON-LD | `app/resolver/[slug]` | ✅ |
| Contenido único por página (errores/teoría/método) | `lib/seoContent.ts` | ✅ |

**Mientras `NEXT_PUBLIC_ADSENSE_CLIENT` no esté definido, no se carga ni pinta
nada de publicidad.** El sitio se comporta exactamente igual que antes.

---

## 🙋 Lo que tienes que hacer tú (30 minutos)

### 1. Crea la cuenta de AdSense
1. Entra en <https://adsense.google.com> y solicita acceso con tu cuenta Google.
2. Añade tu sitio (`https://tu-dominio.com`) en **Sitios > Añadir sitio**.
3. Google te dará un código de verificación. **No hace falta pegarlo en el
   `<head>`**: con verificar la propiedad desde Search Console basta.
   Si te pide el código, añade una etiqueta `meta` en `app/layout.tsx`.
4. Espera la revisión (suelen ser 2–4 semanas; la primera solicitud se
   rechaza a menudo por falta de tráfico o de contenido — se reaplica).

### 2. Consigue tu ID `pub-XXXXXXXXXXXXXXXX` y actívalo
En AdSense: **Cuenta > Información de la cuenta** (aparece como `pub-…`).

```bash
# .env.local  (o las variables de entorno en Vercel)
NEXT_PUBLIC_ADSENSE_CLIENT="pub-1234567890123456"
NEXT_PUBLIC_APP_URL="https://tu-dominio.com"
NEXT_PUBLIC_CONTACT_EMAIL="hola@tudominio.com"
```

### 3. Edita `public/ads.txt`
Sustituye el `pub-0000000000000000` por tu ID real. **Sin esto no aprueban.**

### 4. Verifica el dominio en Google Search Console
1. <https://search.google.com/search-console> > **Añadir propiedad** (propiedad por dominio).
2. Copia el registro TXT que te da y añádelo en la DNS de tu dominio.
3. **Sitemaps > Añadir sitemap** → `https://tu-dominio.com/sitemap.xml`.

### 5. Coloca los huecos de anuncio (cuando aprueben)
Ya existe el componente; solo hay que colocarlo. Recomendado **1–2 huecos**:

```tsx
import { AdSlot } from "@/components/AdSense";

<AdSlot slot="1234567890" minHeight={280} />
```

- **Buen sitio:** debajo del "Resultado final" en `components/SolutionPanel.tsx`
  (justo donde el estudiante ha terminado de leer).
- **Buen sitio:** entre la solución y el bloque "Ayuda extra" en
  `app/resolver/[slug]/page.tsx`.
- **Evita:** encima del H1 (sube el LCP) y pop-ups/intersticiales (penaliza Google).

Cada hueco crea un `slot` numérico en AdSense (**Anuncios > Unidades de anuncio**).

---

## 📊 Expectativas realistas de ingresos

| Páginas vistas/mes | RPM estimado | Ingreso/mes |
|---|---|---|
| 1.000 | $2–4 | ~$3 |
| 10.000 | $3–5 | ~$40 |
| 50.000 | $4–7 | ~$250 |
| 100.000 | $5–9 | **~$600** |

- Tráfico **LatAm → RPM bajo ($1–3)**; **EE.UU./España → $8–15**.
  El inglés multiplica el ingreso con el mismo esfuerzo.
- Para pasar de AdSense a redes mejores (**Ezoic** ~10k visitas,
  **Mediavine** 50k sesiones, **Raptive** 100k PV) hace falta ese volumen.

---

## ⚠️ Riesgo principal: contenido fino (thin content)

El sitio pasa de 395 a más páginas generadas. Si dos páginas son >80% iguales,
Google puede considerarlo *contenido de baja calidad* y penalizar **todo el
sitio**. Mitigación ya implementada:

- Cada página incluye **errores comunes + teoría + método alternativo +
  consejo de examen** (`lib/seoContent.ts`), texturizado con el enunciado.
- Antes de añadir generadores nuevos, revisa que el resultado no sea una copia
  del existente con otros números.

---

## 🗓️ Orden de trabajo recomendado

1. **Fase 0 (hoy):** código — ✅ *hecho*.
2. **Domingo siguiente:** crear cuenta AdSense + Search Console + `ads.txt`.
3. **Semanas 2–6:** esperar aprobación; mientras, seguir ampliando el catálogo
   y las páginas de teoría (clusters).
4. **Al aprobarse:** colocar 1–2 `<AdSlot>`, medir RPM 30 días.
5. **Mes 3+:** optimizar tráfico hispanohablante + añadir versión en inglés.

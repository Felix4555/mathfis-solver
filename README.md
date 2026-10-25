# 🧮 MathFis Solver

Aplicación web que resuelve problemas de **matemáticas y física paso a paso**.
Escribe el problema (texto o LaTeX), **dictalo por voz** o **sube una foto** (OCR),
y obtén la solución numerada con reglas, fórmulas en LaTeX, gráficos y el
**resultado final destacado**.

> Funciona **desde el primer momento, sin claves API ni base de datos** (modo demo).

---

## ✨ Funcionalidades

| Área | Detalles |
|------|----------|
| **Entrada** | Editor de texto/LaTeX, subida de imagen con OCR (Tesseract.js), dictado por voz (Web Speech API), botones de ejemplos |
| **Detección de tema** | Clasificación automática del área (Matemáticas / Física) y del tema |
| **Solución** | Pasos numerados, regla/fórmula usada en cada paso, unidades y conversiones, confianza de la respuesta |
| **Ambigüedad** | Si faltan datos, el motor **pide aclaración** y sugiere cómo reformular |
| **Gráficos** | Funciones, trayectorias de proyectiles y puntos (SVG, sin dependencias pesadas) |
| **Historial y favoritos** | Guardado local, búsqueda por texto/tema, filtro por área y **exportación a PDF** (imprimir) |
| **Modo práctica** | Problemas aleatorios por **tema y dificultad**, verificación de respuesta, puntuación y racha |
| **Interfaz** | Diseño minimalista y responsive, **panel izquierdo (entrada) / derecho (solución)**, barra superior con logo, historial, favoritos y perfil |
| **Idioma y tema** | Español por defecto con opción a inglés; **modo claro/oscuro** |
| **Seguridad** | Entrada saneada, **sin `eval` ni ejecución de código arbitrario**, *rate limiting* por IP |

### Temas soportados por el motor

- **Matemáticas:** aritmética, ecuaciones lineales y cuadráticas, derivadas, integrales (indefinidas y definidas), geometría (círculo, triángulo, rectángulo, esfera) y trigonometría.
- **Física:** cinemática (MRUA, caída libre, **tiro parabólico**), dinámica (`F = m·a`, peso), trabajo y energía, cantidad de movimiento y electricidad (Ley de Ohm).

---

## 🧰 Stack técnico

- **Next.js 15.5.28** (App Router) · **React 18** · **TypeScript**
- **Tailwind CSS** (tema con variables CSS, modo oscuro por clase)
- **KaTeX** para renderizar LaTeX
- **API Routes** de Next.js como backend
- **Tesseract.js** (OCR, vía CDN) y **Web Speech API** (voz)
- Motor de cálculo propio en TypeScript (tokenizador + shunting-yard, sin `eval`)

---

## 🚀 Instalación y uso (Windows)

> ⚠️ **Usa CMD, no PowerShell**, si tienes la política de ejecución bloqueada
> (`npm.ps1 cannot be loaded...`).

### Opción A — con los scripts incluidos (recomendado)

1. Doble clic en **`setup.cmd`** → instala dependencias.
2. Doble clic en **`start.cmd`** → arranca el servidor.

### Opción B — manualmente en CMD

```cmd
cd /d "C:\Users\Felix\Documents\Default Project\mathfis-solver"
npm install
npm run dev
```

Abre **http://localhost:3000** en el navegador.

### Si PowerShell está bloqueado (alternativa)

```powershell
powershell -ExecutionPolicy Bypass -Command "npm install"
```

### Requisitos

- **Node.js 18 o superior** — https://nodejs.org
- npm (viene incluido con Node.js)

---

## 🔧 Variables de entorno

El proyecto **funciona sin configuración**. Copia `.env.example` a `.env.local`
solo si quieres activar integraciones opcionales:

```cmd
copy .env.example .env.local
```

| Variable | Necesaria | Descripción |
|----------|:---------:|-------------|
| `NEXT_PUBLIC_APP_URL` | No | URL pública de la app |
| `DATABASE_URL` | No | PostgreSQL (si migras el historial a Prisma) |
| `NEXT_PUBLIC_SUPABASE_URL` / `ANON_KEY` | No | Supabase (alternativa a Prisma) |
| `SYMPY_API_URL` | No | Backend Python + FastAPI + SymPy |
| `RATE_LIMIT_PER_MINUTE` | No | Límite de peticiones por IP (por defecto 30) |

---

## 📁 Estructura del proyecto

```
mathfis-solver/
├── app/
│   ├── layout.tsx              # Layout raíz (KaTeX y Tesseract desde CDN)
│   ├── page.tsx                # Página principal (orquesta todas las vistas)
│   ├── globals.css             # Sistema de diseño (tema claro/oscuro)
│   └── api/
│       ├── solve/route.ts      # POST /api/solve   → resuelve un problema
│       ├── practice/route.ts   # POST /api/practice → genera problemas
│       └── health/route.ts     # GET  /api/health  → estado del servicio
├── components/
│   ├── ui.tsx                  # Componentes reutilizables (Button, Card, Tabs…)
│   ├── Navbar.tsx              # Barra superior
│   ├── ProblemInput.tsx        # Panel izquierdo: texto / imagen / voz / ejemplos
│   ├── SolutionPanel.tsx       # Panel derecho: pasos, fórmulas, gráfico, resultado
│   ├── PracticePanel.tsx       # Modo práctica
│   ├── HistoryPanel.tsx        # Historial y favoritos (+ exportar PDF)
│   ├── Graph.tsx               # Gráficos en SVG
│   └── MathLatex.tsx           # Renderizado de LaTeX con KaTeX
├── lib/
│   ├── solver/                 # 🧠 Motor de cálculo
│   │   ├── expr.ts             # Evaluador seguro (tokenizer + shunting-yard)
│   │   ├── detect.ts           # Detección de tema
│   │   ├── mathEngine.ts       # Álgebra, cálculo, geometría, trigonometría
│   │   ├── physicsEngine.ts    # Cinemática, dinámica, energía, electricidad
│   │   ├── practice.ts         # Generador de problemas de práctica
│   │   ├── types.ts            # Tipos compartidos
│   │   └── index.ts            # Punto de entrada del motor
│   ├── security.ts             # Saneado de entrada + rate limiting
│   ├── storage.ts              # Historial/favoritos (localStorage)
│   ├── i18n.ts                 # Traducciones español/inglés
│   └── utils.ts                # Utilidades varias
├── hooks/
│   ├── useLocalStorage.ts      # Persistencia en el navegador
│   └── useVoice.ts             # Dictado por voz
├── setup.cmd / start.cmd       # Scripts de instalación y arranque (Windows)
├── .env.example
└── README.md
```

---

## 🔌 API

### `POST /api/solve`

```json
{ "problem": "x^2 - 5x + 6 = 0" }
```

Respuesta (éxito):

```json
{
  "ok": true,
  "area": "math",
  "topic": "equation",
  "topicLabel": "Ecuación cuadrática",
  "input": "x^2 - 5x + 6 = 0",
  "finalResult": "x_1 = 3, \\quad x_2 = 2",
  "finalText": "x1 = 3, x2 = 2",
  "steps": [ { "step": 1, "title": "…", "detail": "…", "formula": "…" } ],
  "formulas": ["x = \\frac{-b \\pm \\sqrt{b^2-4ac}}{2a}"],
  "graph": { "type": "function", "fn": "(x^2-5x+6)-(0)", "xRange": [-2, 7] },
  "confidence": "high"
}
```

Respuesta (necesita aclaración):

```json
{ "ok": false, "error": "…", "suggestion": "…", "needsClarification": true }
```

### `POST /api/practice`

```json
{ "area": "physics", "difficulty": "medio" }
```

---

## 📜 Scripts disponibles

| Comando | Descripción |
|---------|-------------|
| `npm run dev` | Servidor de desarrollo en http://localhost:3000 |
| `npm run build` | Compila para producción |
| `npm run start` | Sirve la compilación de producción |
| `npm run lint` | Ejecuta ESLint |

---

## ☁️ Despliegue

**Frontend + API (todo en uno) en Vercel:**

1. Sube el proyecto a GitHub.
2. Importa el repositorio en [Vercel](https://vercel.com).
3. Framework detectado: **Next.js**. No requiere variables obligatorias.
4. Deploy.

También funciona en **Railway** o **Render** con:

```
Build:  npm install && npm run build
Start:  npm run start
```

---

## 🔒 Seguridad

- El usuario **no puede ejecutar código**: las expresiones se interpretan con un
  tokenizador propio; nunca se usa `eval`.
- La entrada se **sanea** (se eliminan etiquetas HTML y caracteres de control)
  y se **limita su longitud**.
- **Rate limiting** en `/api/solve` (30 req/min) y `/api/practice` (60 req/min).
- Historial y favoritos se guardan **solo en el navegador** del usuario.

---

## 🧪 Ejemplos para probar

```
2x + 5 = 15
x^2 - 5x + 6 = 0
(5 + 3) * 4 / 2
derivada de x^3 + 2x
integral de 3x^2 + 2x
área de un círculo de radio 5
seno de 30 grados
un móvil a 20 m/s acelera a 5 m/s² durante 4 s
proyectil a 50 m/s con ángulo de 45 grados
energía cinética de 2 kg a 3 m/s
circuito con 12 V y 4 ohmios, ¿cuál es la corriente?
```

---

## 🔍 SEO (páginas de problemas resueltos)

Para que el proyecto pueda generar tráfico (y eventually ingresos), cada
problema del catálogo tiene su **propia página indexable**:

| Ruta | Qué es |
|------|--------|
| `/resolver` | Índice con todos los problemas, agrupados por tema |
| `/resolver/<slug>` | Problema resuelto: H1, solución completa, JSON-LD |
| `/sitemap.xml` | 387+ URLs (395 páginas generadas en build) |
| `/robots.txt` | Permite `/`, bloquea `/api/` |

**Cómo funciona:**

- `lib/catalog.ts` → ~40 problemas escritos a mano + generadores
  sistemáticos (cuadráticas, lineales, derivadas, integrales). Duplicados
  eliminados por contenido normalizado.
- `lib/url.ts` → slugs legibles (`mate-x2-5x-6-0`) y, para problemas
  arbitrarios, `slug--base64` que permite compartir cualquier enlace.
- `generateStaticParams()` pre-renderiza el catálogo en build; el resto se
  resuelve en runtime con `revalidate` de 30 días (ISR).
- **La solución se renderiza en el servidor** (no solo en cliente), así que
  Google indexa los pasos, la explicación y el resultado final.
- `components/seo/StructuredData.tsx` inyecta **JSON-LD** con
  `MathSolver`, `BreadcrumbList` y `FAQPage` (rich results).
- **Enlaces internos:** la home muestra problemas frecuentes con enlace a
  cada página, y el footer enlaza a `/resolver`.

> Nota: `components/seo/SolutionView.tsx` existe porque Next.js no permite
> pasar funciones (`t`, `onSave`) de un Server Component a un Client
> Component. La solución viaja serializable y las funciones se crean allí.

---

## 🗺️ Roadmap

- [ ] **Monetización:** cuentas de usuario + Stripe/MercadoPago + plan Pro
      (créditos ilimitados, exportación PDF, explicaciones avanzadas).
- [ ] Backend opcional Python + FastAPI + SymPy para cálculo simbólico avanzado.
- [ ] Persistencia en la nube con Prisma/PostgreSQL o Supabase (autenticación opcional).
- [ ] Más temas de física (ondas, termodinámica, gravitación, magnetismo).
- [ ] Diagramas de cuerpo libre y vectores interactivos.
- [ ] Tutor explicaciones traducido a inglés (`lib/solver/tutor.ts` es ES-only).

---

Hecho con ❤️ para estudiantes. **MathFis Solver**.

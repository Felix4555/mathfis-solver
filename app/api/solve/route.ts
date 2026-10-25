import { NextRequest, NextResponse } from "next/server";
import { solve } from "@/lib/solver";
import { rateLimit, sanitizeInput } from "@/lib/security";

export const runtime = "nodejs";

/**
 * POST /api/solve
 * Body: { problem: string }
 * Respuesta: Solution | SolveFailure (ver lib/solver/types.ts)
 *
 * Seguridad:
 *  - Saneamos la entrada y limitamos su longitud.
 *  - Aplicamos rate limiting por IP (30 req/min).
 *  - El motor NO usa eval: no hay ejecución de código arbitrario.
 */
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local";

  const rl = rateLimit(`solve:${ip}`, 30, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      {
        ok: false,
        error: "Demasiadas solicitudes.",
        suggestion: "Espera un momento antes de volver a intentarlo.",
        needsClarification: false,
      },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil(rl.resetInMs / 1000)) },
      }
    );
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const input = sanitizeInput(body?.problem, 1000);

  if (!input) {
    return NextResponse.json(
      {
        ok: false,
        error: "El problema está vacío.",
        suggestion: "Escribe, dicta o sube una foto de tu problema.",
        needsClarification: true,
      },
      { status: 400 }
    );
  }

  try {
    const result = solve(input);
    return NextResponse.json(result, {
      status: 200,
      headers: { "X-RateLimit-Remaining": String(rl.remaining) },
    });
  } catch (e) {
    return NextResponse.json(
      {
        ok: false,
        error: "Error interno al resolver el problema.",
        suggestion: "Revisa la sintaxis o prueba con uno de los ejemplos.",
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    endpoint: "/api/solve",
    method: "POST",
    body: { problem: "string" },
  });
}

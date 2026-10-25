import { NextResponse } from "next/server";

/**
 * GET /api/health
 * Comprobación simple de que la aplicación está viva.
 * Útil para despliegues (Vercel/Railway/Render).
 */
export async function GET() {
  return NextResponse.json({
    ok: true,
    service: "mathfis-solver",
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: "1.0.0",
  });
}

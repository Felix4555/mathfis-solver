import { NextRequest, NextResponse } from "next/server";
import { generateProblem, type Difficulty } from "@/lib/solver/practice";
import { rateLimit } from "@/lib/security";
import type { Area } from "@/lib/solver/types";

export const runtime = "nodejs";

const DIFFICULTIES: Difficulty[] = ["facil", "medio", "dificil"];

/**
 * POST /api/practice
 * Body: { area: "math" | "physics", difficulty: "facil" | "medio" | "dificil" }
 * Respuesta: { problem: PracticeProblem }
 */
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "local";

  const rl = rateLimit(`practice:${ip}`, 60, 60_000);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes." },
      { status: 429 }
    );
  }

  let body: any = {};
  try {
    body = await req.json();
  } catch {
    body = {};
  }

  const area: Area = body?.area === "physics" ? "physics" : "math";
  const difficulty: Difficulty = DIFFICULTIES.includes(body?.difficulty)
    ? body.difficulty
    : "facil";

  const problem = generateProblem(area, difficulty);
  return NextResponse.json({ problem });
}

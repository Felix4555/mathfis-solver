"use client";

import { SolutionPanel } from "@/components/SolutionPanel";
import { makeT } from "@/lib/i18n";
import type { Solution } from "@/lib/solver/types";

/**
 * Envoltura cliente para mostrar una solución ya calculada en el servidor.
 *
 * Next.js no permite pasar funciones (`t`, `onSave`) desde un Server Component
 * a un Client Component, así que aquí las creamos. `Solution` sí es
 * serializable, así que viaja desde el servidor sin problemas.
 */
const t = makeT("es");

export function SolutionView({ solution }: { solution: Solution }) {
  return (
    <SolutionPanel
      result={solution}
      loading={false}
      t={t}
      onSave={() => {}}
      saved={false}
    />
  );
}

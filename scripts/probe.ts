/**
 * Verificación de las mejoras del motor + control de regresiones.
 *
 * Uso:  npx tsx scripts/probe.ts
 */
import { solve } from "../lib/solver";

interface Case {
  problem: string;
  expect: "ok" | "fail";
}

const cases: Case[] = [
  // --- Antes rotas, ahora deberían resolver ---
  { problem: "perímetro de un cuadrado de lado 7", expect: "ok" },
  { problem: "un coche parte del reposo y acelera a 3 m/s² durante 10 s", expect: "ok" },
  { problem: "un móvil se desplaza 100 m en 20 s", expect: "ok" },
  { problem: "un móvil recorre 150 m en 10 s", expect: "ok" },
  { problem: "caída libre desde 20 m", expect: "ok" },
  { problem: "caída libre desde 45 m", expect: "ok" },

  // --- Figuras nuevas ---
  { problem: "volumen de un cubo de lado 5", expect: "ok" },
  { problem: "área de un trapecio con bases 6 y 10 y altura 4", expect: "ok" },
  { problem: "área de un rombo con diagonales 8 y 6", expect: "ok" },

  // --- Cinemática nueva ---
  { problem: "un móvil parte del reposo y acelera a 4 m/s² durante 6 s", expect: "ok" },
  { problem: "un móvil a 20 m/s frena con aceleración de 5 m/s²", expect: "ok" },
  { problem: "un móvil a 15 m/s recorre 200 m en 10 s", expect: "ok" },

  // ====== REGRESIONES (deben seguir resolviendo) ======
  { problem: "2x + 5 = 15", expect: "ok" },
  { problem: "x^2 - 5x + 6 = 0", expect: "ok" },
  { problem: "x^2 + 2x + 5 = 0", expect: "ok" },
  { problem: "derivada de x^3 + 2x", expect: "ok" },
  { problem: "derivada de sin(2x)", expect: "ok" },
  { problem: "derivada de ln(x)", expect: "ok" },
  { problem: "derivada de exp(x)", expect: "ok" },
  { problem: "integral de 3x^2 + 2x", expect: "ok" },
  { problem: "integral de sin(x)", expect: "ok" },
  { problem: "integral de 5x^4 + 3x^2", expect: "ok" },
  { problem: "integral de x^2 + 3x + 5", expect: "ok" },
  { problem: "área de un círculo de radio 5", expect: "ok" },
  { problem: "área de un rectángulo de base 4 y altura 6", expect: "ok" },
  { problem: "triángulo rectángulo con catetos 3 y 4", expect: "ok" },
  { problem: "volumen de una esfera de radio 3", expect: "ok" },
  { problem: "área de un triángulo con base 10 y altura 5", expect: "ok" },
  { problem: "volumen de un cilindro con radio 3 y altura 10", expect: "ok" },
  { problem: "volumen de un cono con radio 4 y altura 9", expect: "ok" },
  { problem: "área de un rectángulo con base 7 y altura 3", expect: "ok" },
  { problem: "hipotenusa de un triángulo rectángulo con catetos 6 y 8", expect: "ok" },
  { problem: "seno de 30 grados", expect: "ok" },
  { problem: "coseno de 60 grados", expect: "ok" },
  { problem: "tangente de 45 grados", expect: "ok" },
  { problem: "seno de 60 grados", expect: "ok" },
  { problem: "coseno de 30 grados", expect: "ok" },
  { problem: "tangente de 60 grados", expect: "ok" },
  { problem: "un móvil a 20 m/s acelera a 5 m/s² durante 4 s", expect: "ok" },
  { problem: "un móvil a 10 m/s acelera a 2 m/s² durante 5 s", expect: "ok" },
  { problem: "un tren viaja a 25 m/s y acelera a 3 m/s² durante 8 s", expect: "ok" },
  { problem: "proyectil a 50 m/s con ángulo de 45 grados", expect: "ok" },
  { problem: "proyectil a 30 m/s con ángulo de 30 grados", expect: "ok" },
  { problem: "proyectil a 40 m/s con ángulo de 60 grados", expect: "ok" },
  { problem: "se deja caer desde una altura de 20 m", expect: "ok" },
  { problem: "se deja caer desde una altura de 45 m", expect: "ok" },
  { problem: "una masa de 2 kg acelera a 5 m/s², ¿cuál es la fuerza?", expect: "ok" },
  { problem: "una masa de 15 kg acelera a 2 m/s², ¿cuál es la fuerza?", expect: "ok" },
  { problem: "peso de un cuerpo de 10 kg", expect: "ok" },
  { problem: "una fuerza de 20 N actúa sobre una masa de 4 kg", expect: "ok" },
  { problem: "una fuerza de 25 N actúa sobre una masa de 5 kg", expect: "ok" },
  { problem: "energía cinética de 2 kg a 3 m/s", expect: "ok" },
  { problem: "energía cinética de 4 kg a 6 m/s", expect: "ok" },
  { problem: "energía potencial de 5 kg a 2 m de altura", expect: "ok" },
  { problem: "energía potencial de 8 kg a 5 m de altura", expect: "ok" },
  { problem: "cantidad de movimiento de 2 kg a 5 m/s", expect: "ok" },
  { problem: "cantidad de movimiento de 3 kg a 8 m/s", expect: "ok" },
  { problem: "momentum de 10 kg a 4 m/s", expect: "ok" },
  { problem: "circuito con 12 V y 4 ohmios, ¿cuál es la corriente?", expect: "ok" },
  { problem: "voltaje de 10 V con corriente de 2 A", expect: "ok" },
  { problem: "voltaje de 18 V con corriente de 6 A", expect: "ok" },
  { problem: "resistencia de 24 V con corriente de 3 A", expect: "ok" },
  { problem: "resistencia de 18 V con corriente de 6 A", expect: "ok" },
  { problem: "un aparato con 220 V y 5 A de corriente", expect: "ok" },
  { problem: "fuerza de 60 N sobre 12 kg", expect: "ok" },
  { problem: "(5 + 3) * 4 / 2", expect: "ok" },
  { problem: "12 * (8 - 3) + 10", expect: "ok" },
  { problem: "(10 - 4) * 3 + 7", expect: "ok" },
  { problem: "2^5 - 3^3", expect: "ok" },
  { problem: "144 / (4 + 8)", expect: "ok" },
  { problem: "sqrt(144) * 3", expect: "ok" },
  { problem: "7^2 + 24^2", expect: "ok" },
  { problem: "x²-5x+6=0", expect: "ok" },
  { problem: "√(9)+1", expect: "ok" },
  { problem: "2 × 3 + 4 ÷ 2", expect: "ok" },
  { problem: "π", expect: "ok" },
  { problem: "5x - 3 = 2x + 9", expect: "ok" },
  { problem: "x/2 + x/3 = 10", expect: "ok" },
  { problem: "2(x + 3) = 4x - 6", expect: "ok" },
  { problem: "x^2 - 16 = 0", expect: "ok" },
  { problem: "3x^2 - 12 = 0", expect: "ok" },
  { problem: "-x^2 + 4x - 3 = 0", expect: "ok" },
  { problem: "derivada de 5x^4 - 2x^3 + x - 9", expect: "ok" },
  { problem: "derivada de (x + 1)^2", expect: "ok" },
  { problem: "derivada de cos(3x)", expect: "ok" },
  { problem: "derivada de tan(x)", expect: "ok" },

  // --- Siguen sin resolver a propósito (fuera de alcance) ---
  { problem: "¿cuál es el sentido de la vida?", expect: "fail" },
  { problem: "derivada de 1/x", expect: "fail" },
  { problem: "integral de 1/x^2", expect: "fail" },
];

const brokenOk: string[] = [];
const brokenFail: string[] = [];

for (const c of cases) {
  const r = solve(c.problem);
  if (c.expect === "ok" && r.ok === false)
    brokenOk.push(`${c.problem}  -> ${r.error}`);
  if (c.expect === "fail" && r.ok) brokenFail.push(c.problem);
}

console.log(`CASOS = ${cases.length}`);
console.log(`DEBERÍAN RESOLVER Y FALLAN: ${brokenOk.length}`);
for (const b of brokenOk) console.log("  ✗ " + b);
console.log(`DEBERÍAN FALLAR Y RESUELVEN: ${brokenFail.length}`);
for (const b of brokenFail) console.log("  ✗ " + b);

if (!brokenOk.length && !brokenFail.length) console.log("\nTODO CORRECTO ✓");

"use client";

import { useRef, useState } from "react";
import {
  Sparkles,
  Send,
  Eraser,
  Type,
  ImageIcon,
  Mic,
  MicOff,
  Loader2,
  Lightbulb,
} from "lucide-react";
import { Button, Card, CardContent, CardHeader, CardTitle, Tabs, Textarea } from "./ui";
import { MathSymbols } from "./MathSymbols";
import { useVoice } from "@/hooks/useVoice";
import { cn } from "@/lib/utils";

/** Ejemplos rápidos separados por área. */
const EXAMPLES: { area: "math" | "physics"; label: string; value: string }[] = [
  { area: "math", label: "Ecuación cuadrática", value: "x^2 - 5x + 6 = 0" },
  { area: "math", label: "Ecuación lineal", value: "2x + 5 = 15" },
  { area: "math", label: "Derivada", value: "derivada de x^3 + 2x" },
  { area: "math", label: "Integral", value: "integral de 3x^2 + 2x" },
  { area: "math", label: "Aritmética", value: "(5 + 3) * 4 / 2" },
  { area: "math", label: "Círculo", value: "área de un círculo de radio 5" },
  { area: "math", label: "Trigonometría", value: "seno de 30 grados" },
  { area: "physics", label: "Cinemática", value: "un móvil a 20 m/s acelera a 5 m/s² durante 4 s" },
  { area: "physics", label: "Tiro parabólico", value: "proyectil a 50 m/s con ángulo de 45 grados" },
  { area: "physics", label: "Dinámica", value: "una masa de 2 kg acelera a 5 m/s², ¿cuál es la fuerza?" },
  { area: "physics", label: "Energía", value: "energía cinética de 2 kg a 3 m/s" },
  { area: "physics", label: "Ley de Ohm", value: "circuito con 12 V y 4 ohmios, ¿cuál es la corriente?" },
];

export function ProblemInput({
  value,
  onChange,
  onSolve,
  loading,
  t,
  lang,
  detectedTopic,
}: {
  value: string;
  onChange: (v: string) => void;
  onSolve: () => void;
  loading: boolean;
  t: (k: string) => string;
  lang: "es" | "en";
  detectedTopic?: string | null;
}) {
  const [tab, setTab] = useState("text");
  const [ocrStatus, setOcrStatus] = useState<"idle" | "working" | "error">("idle");
  const fileRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const voice = useVoice(lang);

  const canSolve = value.trim().length > 0 && !loading;

  /** Inserta un símbolo en la posición del cursor del editor de texto. */
  const insertAtCursor = (insert: string, caret?: number) => {
    const el = textareaRef.current;
    if (!el) {
      onChange(value + insert);
      return;
    }
    const start = el.selectionStart ?? value.length;
    const end = el.selectionEnd ?? value.length;
    const next = value.slice(0, start) + insert + value.slice(end);
    onChange(next);
    const pos = start + (caret ?? insert.length);
    // Reiniciamos el cursor después de que React actualice el valor.
    requestAnimationFrame(() => {
      el.focus();
      el.setSelectionRange(pos, pos);
    });
  };

  const handleFile = async (file: File) => {
    setOcrStatus("working");
    try {
      const Tesseract = (window as any).Tesseract;
      if (!Tesseract) {
        setOcrStatus("error");
        return;
      }
      const result = await Tesseract.recognize(file, "spa+eng");
      const text: string = result?.data?.text ?? "";
      onChange(text.trim());
      setTab("text");
      setOcrStatus("idle");
    } catch {
      setOcrStatus("error");
    }
  };

  const startVoice = () => {
    if (voice.listening) {
      voice.stop();
      return;
    }
    voice.start((spoken) => {
      onChange(value ? `${value} ${spoken}` : spoken);
      setTab("text");
    });
  };

  return (
    <Card className="flex h-full flex-col">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-4 w-4 text-primary" />
          {t("solver.title")}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4">
        <Tabs
          value={tab}
          onValueChange={setTab}
          items={[
            { value: "text", label: <><Type className="h-3.5 w-3.5" /> {t("solver.tabText")}</> },
            { value: "image", label: <><ImageIcon className="h-3.5 w-3.5" /> {t("solver.tabImage")}</> },
            { value: "voice", label: <><Mic className="h-3.5 w-3.5" /> {t("solver.tabVoice")}</> },
          ]}
        />

        {/* --- Texto / resultado de OCR / voz --- */}
        {tab === "text" && (
          <div className="flex flex-1 flex-col gap-2">
            <label className="text-xs font-medium text-muted-foreground" htmlFor="problem">
              {t("solver.inputLabel")}
            </label>
            <Textarea
              id="problem"
              ref={textareaRef}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={t("solver.placeholder")}
              className="min-h-[160px] flex-1 font-mono text-[13px] leading-relaxed"
              spellCheck={false}
              onKeyDown={(e) => {
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  if (canSolve) onSolve();
                }
              }}
            />
            <MathSymbols onInsert={insertAtCursor} t={t} />
          </div>
        )}

        {tab === "image" && (
          <div className="flex flex-1 flex-col gap-3">
            <div
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault();
                const file = e.dataTransfer.files?.[0];
                if (file) handleFile(file);
              }}
              onClick={() => fileRef.current?.click()}
              className="flex flex-1 cursor-pointer flex-col items-center justify-center gap-3 rounded-lg border-2 border-dashed border-border p-8 text-center transition-colors hover:border-primary/60 hover:bg-primary/5"
            >
              {ocrStatus === "working" ? (
                <>
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <p className="text-sm font-medium">{t("solver.ocrWorking")}</p>
                </>
              ) : (
                <>
                  <ImageIcon className="h-8 w-8 text-muted-foreground" />
                  <p className="text-sm font-medium">{t("solver.uploadCta")}</p>
                  <p className="max-w-xs text-xs text-muted-foreground">{t("solver.uploadHint")}</p>
                </>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
              }}
            />
            {ocrStatus === "error" && (
              <p className="text-xs text-danger">
                No se pudo usar el OCR (revisa tu conexión a internet).
              </p>
            )}
          </div>
        )}

        {tab === "voice" && (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 rounded-lg border border-border p-8 text-center">
            {!voice.supported ? (
              <p className="text-sm text-muted-foreground">{t("solver.voiceUnsupported")}</p>
            ) : (
              <>
                <button
                  onClick={startVoice}
                  className={cn(
                    "flex h-20 w-20 items-center justify-center rounded-full transition-all",
                    voice.listening
                      ? "animate-pulse bg-danger text-danger-foreground"
                      : "bg-primary text-primary-foreground hover:opacity-90"
                  )}
                >
                  {voice.listening ? <MicOff className="h-8 w-8" /> : <Mic className="h-8 w-8" />}
                </button>
                <p className="text-sm font-medium">
                  {voice.listening ? t("solver.voiceListening") : t("solver.voiceCta")}
                </p>
                <p className="max-w-xs text-xs text-muted-foreground">{t("solver.voiceHint")}</p>
                {value && (
                  <p className="mt-2 rounded-lg bg-secondary/60 px-3 py-2 text-left text-sm">
                    {value}
                  </p>
                )}
              </>
            )}
          </div>
        )}

        {/* --- Ejemplos --- */}
        <div>
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
            <Lightbulb className="h-3.5 w-3.5" /> {t("solver.examples")}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {EXAMPLES.map((ex) => (
              <button
                key={ex.label}
                onClick={() => {
                  onChange(ex.value);
                  setTab("text");
                }}
                className="rounded-full border border-border px-2.5 py-1 text-[11px] text-muted-foreground transition-colors hover:border-primary/60 hover:bg-primary/5 hover:text-foreground"
              >
                {ex.label}
              </button>
            ))}
          </div>
        </div>

        {/* --- Acciones --- */}
        <div className="flex items-center gap-2 pt-1">
          <Button onClick={onSolve} disabled={!canSolve} className="flex-1">
            {loading ? (
              <><Loader2 className="h-4 w-4 animate-spin" /> {t("solver.solving")}</>
            ) : (
              <><Send className="h-4 w-4" /> {t("solver.solve")}</>
            )}
          </Button>
          <Button
            variant="outline"
            onClick={() => onChange("")}
            disabled={!value}
            title={t("solver.clear")}
          >
            <Eraser className="h-4 w-4" />
          </Button>
        </div>

        {detectedTopic && (
          <p className="text-xs text-muted-foreground">
            {t("solver.detected")}: <span className="font-medium text-foreground">{detectedTopic}</span>
          </p>
        )}

        <div className="rounded-lg bg-secondary/40 p-3 text-[11px] text-muted-foreground">
          <p className="mb-1 font-medium text-foreground">{t("solver.tips")}</p>
          <ul className="list-inside list-disc space-y-0.5">
            <li>{t("solver.tip1")}</li>
            <li>{t("solver.tip2")}</li>
            <li>{t("solver.tip3")}</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}

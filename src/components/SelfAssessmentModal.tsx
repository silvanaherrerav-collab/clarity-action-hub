import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";
import { toast } from "sonner";

interface SelfAssessmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const dimensions = [
  { key: "psych_safety", label: "SEGURIDAD PSICOLÓGICA", question: "Mi equipo se siente cómodo hablando conmigo abiertamente", low: "Poco cómodo", high: "Muy cómodo", color: "bg-purple-500" },
  { key: "clarity", label: "CLARIDAD", question: "He comunicado claramente qué se espera del equipo", low: "Nada claro", high: "Totalmente claro", color: "bg-blue-500" },
  { key: "dependability", label: "DEPENDENCIA", question: "El equipo puede avanzar sin bloqueos entre áreas", low: "Siempre bloqueado", high: "Flujo sin bloqueos", color: "bg-yellow-500" },
  { key: "followup", label: "SEGUIMIENTO", question: "Hago seguimiento constante al avance del equipo", low: "Sin seguimiento", high: "Seguimiento constante", color: "bg-orange-500" },
  { key: "meaning", label: "SIGNIFICADO", question: "El equipo encuentra valor en su trabajo", low: "Sin sentido", high: "Muy significativo", color: "bg-red-500" },
  { key: "impact", label: "IMPACTO", question: "El equipo entiende su impacto en el negocio", low: "Sin claridad", high: "Total claridad", color: "bg-[hsl(var(--signal-positive))]" },
  { key: "alignment", label: "ALINEACIÓN ESTRATEGIA–CULTURA", question: "La estrategia se refleja en la ejecución diaria", low: "No alineado", high: "Totalmente alineado", color: "bg-teal-500" },
];

const multipleChoiceOptions = [
  "No está claro qué debe hacer cada persona o cuáles son las prioridades",
  "Hay retrasos porque dependemos de otras áreas o personas",
  "No hay suficiente seguimiento al trabajo ni claridad sobre el avance",
  "El equipo no está motivado o comprometido",
  "El equipo no conecta su trabajo con los objetivos del negocio",
];

const SelfAssessmentModal = ({ open, onOpenChange }: SelfAssessmentModalProps) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [openText, setOpenText] = useState("");
  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [otherText, setOtherText] = useState("");

  const handleSelect = (key: string, value: number) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const answeredCount = Object.keys(answers).length;

  const handleSave = () => {
    const data = {
      answers,
      openText,
      multipleChoice: selectedChoice === "other" ? otherText : selectedChoice,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem("tp_self_assessment", JSON.stringify(data));
    onOpenChange(false);
    toast.success("Autoevaluación guardada", {
      description: "Tu perspectiva ya hace parte del diagnóstico.",
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[640px] max-h-[90vh] overflow-y-auto rounded-2xl p-0 border-0 [&>button]:hidden">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-start justify-between">
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] text-[hsl(var(--signal-positive))] uppercase mb-1">
              Self-Assessment · Liderazgo
            </p>
            <h2 className="text-xl font-bold text-foreground">Evalúate como líder</h2>
            <p className="text-sm text-muted-foreground mt-1">Respuestas en escala de 1 a 5</p>
          </div>
          <button onClick={() => onOpenChange(false)} className="w-8 h-8 rounded-full border border-border/60 flex items-center justify-center hover:bg-muted/30 transition-colors">
            <X className="w-4 h-4 text-muted-foreground" />
          </button>
        </div>

        <div className="px-6 pb-6 space-y-5">
          {/* Intro */}
          <div className="rounded-xl border border-border/60 p-4">
            <p className="text-sm text-muted-foreground leading-relaxed text-center">
              Evalúa cómo está funcionando tu equipo hoy.<br />
              Esto nos permitirá identificar qué está afectando su rendimiento.
            </p>
          </div>

          {/* Dimensions */}
          {dimensions.map((dim) => (
            <div key={dim.key} className="space-y-3">
              <div className="flex items-center gap-3">
                <span className={`inline-flex items-center text-[10px] font-bold tracking-[0.1em] text-white uppercase px-2.5 py-0.5 rounded whitespace-nowrap shrink-0 ${dim.color}`}>
                  {dim.label}
                </span>
                <p className="text-sm text-foreground">{dim.question}</p>
              </div>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => handleSelect(dim.key, val)}
                    className={`h-10 rounded-lg border text-sm font-semibold transition-all ${
                      answers[dim.key] === val
                        ? "bg-foreground text-white border-foreground"
                        : "border-border/60 text-foreground hover:bg-muted/30"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
              <div className="flex items-center justify-between text-[10px] text-muted-foreground/60">
                <span>{dim.low}</span>
                <span>{dim.high}</span>
              </div>
            </div>
          ))}

          {/* Open question */}
          <div className="space-y-3 rounded-xl border border-border/60 p-4">
            <div>
              <span className="inline-flex items-center text-[10px] font-bold tracking-[0.1em] text-white uppercase px-2 py-0.5 rounded bg-[hsl(var(--signal-positive))]">
                Pregunta abierta
              </span>
              <p className="text-sm font-semibold text-foreground mt-2">
                ¿Qué situaciones están afectando hoy la ejecución del equipo o el cumplimiento del proceso?
              </p>
            </div>
            <textarea
              value={openText}
              onChange={(e) => setOpenText(e.target.value)}
              placeholder="Escribe libremente…"
              className="w-full h-20 rounded-xl border border-border/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--signal-positive)/0.3)]"
            />
          </div>

          {/* Multiple choice */}
          <div className="space-y-3 rounded-xl border border-border/60 p-4">
            <div>
              <span className="inline-flex items-center text-[10px] font-bold tracking-[0.1em] text-white uppercase px-2 py-0.5 rounded bg-amber-500">
                Selección única
              </span>
              <p className="text-sm font-semibold text-foreground mt-2">
                ¿Cuál crees que es el principal problema que está afectando el rendimiento del equipo hoy?
              </p>
            </div>
            <div className="space-y-2">
              {multipleChoiceOptions.map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedChoice(option)}
                  className={`w-full text-left rounded-lg border px-4 py-3 text-sm transition-all ${
                    selectedChoice === option
                      ? "bg-foreground text-white border-foreground"
                      : "border-border/60 text-foreground hover:bg-muted/30"
                  }`}
                >
                  {option}
                </button>
              ))}
              <button
                onClick={() => setSelectedChoice("other")}
                className={`w-full text-left rounded-lg border px-4 py-3 text-sm transition-all ${
                  selectedChoice === "other"
                    ? "bg-foreground text-white border-foreground"
                    : "border-border/60 text-foreground hover:bg-muted/30"
                }`}
              >
                Otro
              </button>
              {selectedChoice === "other" && (
                <input
                  type="text"
                  value={otherText}
                  onChange={(e) => setOtherText(e.target.value)}
                  placeholder="Escribe tu respuesta..."
                  className="w-full rounded-lg border border-border/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--signal-positive)/0.3)] mt-1"
                />
              )}
            </div>
          </div>

          <p className="text-xs text-muted-foreground text-right">{answeredCount} de {dimensions.length} preguntas respondidas</p>

          {/* Buttons */}
          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={() => onOpenChange(false)}
              className="flex-1 h-11 rounded-xl border border-border/60 text-sm font-semibold text-foreground hover:bg-muted/30 transition-colors"
            >
              Responder después
            </button>
            <button
              onClick={handleSave}
              className="flex-1 h-11 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.01]"
              style={{ background: "linear-gradient(135deg, hsl(152,76%,40%), hsl(200,80%,55%))" }}
            >
              Guardar autoevaluación
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SelfAssessmentModal;

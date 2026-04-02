import { useState } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { X } from "lucide-react";

interface SelfAssessmentModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const dimensions = [
  { key: "psych_safety", label: "SEGURIDAD PSICOLÓGICA", question: "Mi equipo se siente cómodo hablando conmigo abiertamente.", low: "Poco cómodo", high: "Muy cómodo", color: "bg-[hsl(var(--signal-positive))]" },
  { key: "clarity", label: "CLARIDAD", question: "Le he comunicado a mi equipo qué se espera de nuestro trabajo para obtener los mejores resultados en este momento.", low: "Sin claridad", high: "Totalmente claro", color: "bg-[hsl(var(--signal-positive))]" },
  { key: "dependability", label: "DEPENDENCIA", question: "El equipo cumple consistentemente con lo acordado.", low: "Casi nunca", high: "Siempre", color: "bg-[hsl(var(--signal-warning))]" },
  { key: "meaning", label: "SIGNIFICADO", question: "Mi equipo está motivado con su trabajo.", low: "Sin motivación", high: "Muy motivado", color: "bg-[hsl(var(--signal-critical))]" },
  { key: "impact", label: "IMPACTO", question: "El equipo entiende cómo su trabajo impacta en los resultados del negocio.", low: "Sin consciencia", high: "Plena consciencia", color: "bg-[hsl(var(--signal-critical))]" },
];

const SelfAssessmentModal = ({ open, onOpenChange }: SelfAssessmentModalProps) => {
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [openText, setOpenText] = useState("");

  const handleSelect = (key: string, value: number) => {
    setAnswers(prev => ({ ...prev, [key]: value }));
  };

  const answeredCount = Object.keys(answers).length;

  const handleSave = () => {
    const data = {
      answers,
      openText,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem("tp_self_assessment", JSON.stringify(data));
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl p-0 border-0 [&>button]:hidden">
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
            <p className="text-sm text-muted-foreground leading-relaxed">
              Queremos entender cómo estás viendo el funcionamiento de tu equipo hoy. Responde con sinceridad — solo tú ves estos datos.
            </p>
          </div>

          {/* Dimensions */}
          {dimensions.map((dim) => (
            <div key={dim.key} className="space-y-3">
              <div className="flex items-start gap-2">
                <span className={`inline-flex items-center text-[10px] font-bold tracking-[0.1em] text-white uppercase px-2 py-0.5 rounded ${dim.color}`}>
                  {dim.label}
                </span>
                <p className="text-sm text-foreground flex-1">{dim.question}</p>
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
                ¿Qué crees que hoy está limitando el rendimiento de tu equipo?
              </p>
            </div>
            <textarea
              value={openText}
              onChange={(e) => setOpenText(e.target.value)}
              placeholder="Escribe libremente — esto alimenta los insights de la próxima semana..."
              className="w-full h-20 rounded-xl border border-border/60 px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none focus:outline-none focus:ring-2 focus:ring-[hsl(var(--signal-positive)/0.3)]"
            />
          </div>

          <p className="text-xs text-muted-foreground text-right">{answeredCount} de 5 preguntas respondidas</p>

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

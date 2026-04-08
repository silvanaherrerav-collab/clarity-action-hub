import { useState, useMemo } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { getProcessName } from "@/lib/processName";
import { toast } from "sonner";

/* ── Scale questions (Section 1 of Screen 1) ── */
const scaleQuestions = [
  { id: "seguridad", label: "SEGURIDAD", color: "text-blue-600 bg-blue-50 border-blue-200", text: "Me siento cómodo expresando ideas o desacuerdos en mi equipo." },
  { id: "claridad", label: "CLARIDAD", color: "text-green-600 bg-green-50 border-green-200", text: "Tengo claro qué se espera de mí y cuáles son mis prioridades en este momento." },
  { id: "dependencia", label: "DEPENDENCIA", color: "text-orange-600 bg-orange-50 border-orange-200", text: "Puedo avanzar en mi trabajo sin bloqueos de otras áreas." },
  { id: "seguimiento", label: "SEGUIMIENTO", color: "text-green-600 bg-green-50 border-green-200", text: "Hay seguimiento y retroalimentación constante sobre mi trabajo." },
  { id: "significado", label: "SIGNIFICADO", color: "text-green-600 bg-green-50 border-green-200", text: "Siento que mi trabajo tiene valor y contribuye a algo importante." },
  { id: "impacto", label: "IMPACTO", color: "text-purple-600 bg-purple-50 border-purple-200", text: "Entiendo cómo mi trabajo impacta en los resultados del negocio." },
  { id: "alineacion", label: "ALINEACIÓN", color: "text-green-600 bg-green-50 border-green-200", text: "Entiendo cómo lo que hago en mi día a día aporta a los resultados del negocio." },
];

/* ── Single-choice options (Screen 2, Section 1) ── */
const factorChoices = [
  "No tengo claro qué debo hacer o cuáles son mis prioridades",
  "Dependo de otras personas o áreas para avanzar y eso me bloquea",
  "No hay seguimiento claro sobre mi trabajo ni retroalimentación",
  "No me siento motivado con lo que estoy haciendo en este momento",
  "No entiendo cómo mi trabajo impacta en los resultados del negocio",
  "Otro",
];

/* ── Process execution options (Screen 2, Section 2) ── */
const executionChoices = [
  "Sí, se ejecuta como está definido",
  "A veces se desvía, pero no significativamente",
  "No, en la práctica es diferente a lo que está definido",
];

function loadUserName(): string {
  try {
    const raw = localStorage.getItem("tp_user_account");
    if (raw) {
      const data = JSON.parse(raw);
      const first = data.firstName || data.nombre || "";
      const last = data.lastName || data.apellidos || "";
      return `${first} ${last}`.trim() || "Colaborador";
    }
  } catch {}
  return "Colaborador";
}

function getUserInitials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

const CollaboratorSurvey = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get("team") || "";

  const processName = useMemo(() => getProcessName(), []);
  const userName = useMemo(() => loadUserName(), []);
  const initials = useMemo(() => getUserInitials(userName), [userName]);

  const [screen, setScreen] = useState<1 | 2>(1);
  const [scaleAnswers, setScaleAnswers] = useState<Record<string, number>>({});
  const [openText, setOpenText] = useState("");
  const [selectedFactor, setSelectedFactor] = useState<string | null>(null);
  const [processIssues, setProcessIssues] = useState("");
  const [executionAnswer, setExecutionAnswer] = useState<string | null>(null);

  const answeredCount = Object.keys(scaleAnswers).length;
  const totalScale = scaleQuestions.length;
  const progress = screen === 1 ? (answeredCount / totalScale) * 50 : 50 + 50;

  const handleSubmit = () => {
    const results = {
      teamId,
      scaleAnswers,
      openText,
      selectedFactor,
      processIssues,
      executionAnswer,
      completedAt: new Date().toISOString(),
    };
    localStorage.setItem("tp_diagnostic_results_collaborator", JSON.stringify(results));
    toast.success("Respuestas enviadas", { description: "Gracias por tu aporte al diagnóstico." });
    navigate("/collaborator/task-review");
  };

  return (
    <div className="min-h-screen bg-muted/30">
      {/* ── Header ── */}
      <div className="max-w-3xl mx-auto px-6 pt-10 pb-6">
        <div className="flex items-start justify-between">
          <div className="space-y-2">
            <p className="text-xs font-semibold tracking-widest text-[hsl(var(--signal-positive))] uppercase">
              Diagnóstico del equipo
            </p>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground leading-tight">
              ¿Cómo se vive realmente el proceso de {processName}?
            </h1>
            <p className="text-muted-foreground text-sm leading-relaxed max-w-xl">
              Tus respuestas nos ayudan a detectar bloqueos, mejorar la ejecución y entender mejor lo que pasa en la práctica.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0 ml-6">
            <div className="w-9 h-9 rounded-full bg-muted flex items-center justify-center text-xs font-semibold text-muted-foreground border border-border">
              {initials}
            </div>
            <span className="text-sm font-medium text-foreground hidden sm:block">{userName}</span>
          </div>
        </div>

        {/* Progress */}
        <div className="mt-6">
          <Progress value={progress} className="h-1.5" />
          <p className="text-xs text-muted-foreground mt-1.5 text-right">
            {answeredCount} de {totalScale} respondidas
          </p>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-3xl mx-auto px-6 pb-10">
        <div className="animate-fade-in" key={screen}>
          {screen === 1 ? (
            <div className="space-y-8">
              {/* Section 1: Scale questions */}
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6">
                <div>
                  <p className="text-xs font-semibold tracking-widest text-[hsl(var(--signal-positive))] uppercase mb-1">
                    Sección 1 de 2
                  </p>
                  <h2 className="text-lg font-semibold text-foreground">
                    ¿Cómo se siente hoy tu experiencia de trabajo en este proceso?
                  </h2>
                </div>

                {/* Privacy notice */}
                <div className="rounded-xl border border-border bg-muted/40 p-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    Tus respuestas se integran de forma agregada al diagnóstico del equipo. No se analizan de manera individual.
                  </p>
                </div>

                {/* Questions */}
                <div className="space-y-8">
                  {scaleQuestions.map((q) => (
                    <div key={q.id} className="space-y-3">
                      <div className="flex items-center gap-3">
                        <span className={cn("text-[10px] font-bold tracking-wider px-2 py-0.5 rounded border whitespace-nowrap", q.color)}>
                          {q.label}
                        </span>
                        <p className="text-sm font-medium text-foreground">{q.text}</p>
                      </div>
                      <div className="flex gap-2">
                        {[1, 2, 3, 4, 5].map((val) => (
                          <button
                            key={val}
                            onClick={() => setScaleAnswers({ ...scaleAnswers, [q.id]: val })}
                            className={cn(
                              "flex-1 py-3 rounded-lg border text-base font-semibold transition-all duration-150",
                              scaleAnswers[q.id] === val
                                ? "border-foreground bg-foreground text-background"
                                : "border-border bg-background text-foreground hover:border-foreground/40"
                            )}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                      <div className="flex justify-between text-[11px] text-muted-foreground px-1">
                        <span>Muy en desacuerdo</span>
                        <span>Muy de acuerdo</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Section 2: Open question */}
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-5">
                <div>
                  <p className="text-xs font-semibold tracking-widest text-[hsl(var(--signal-positive))] uppercase mb-1">
                    Sección 2 de 2
                  </p>
                  <h2 className="text-lg font-semibold text-foreground">Bloqueos y fricciones</h2>
                  <p className="text-sm text-muted-foreground mt-1">Cuéntanos qué está pasando en la práctica.</p>
                </div>
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    ¿Qué situaciones concretas están afectando hoy la ejecución de tu trabajo diario o el cumplimiento del proceso?
                  </p>
                  <Textarea
                    value={openText}
                    onChange={(e) => setOpenText(e.target.value)}
                    placeholder="Ej: aprobaciones lentas, falta de claridad sobre prioridades, dependencia de otras áreas, cambios de última hora, falta de seguimiento..."
                    className="min-h-[120px] resize-none"
                  />
                </div>
              </div>

              {/* Footer Screen 1 */}
              <div className="flex items-center justify-end pt-4">
                <Button
                  onClick={() => setScreen(2)}
                  className="bg-foreground text-background hover:bg-foreground/90"
                >
                  Continuar
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              {/* Section 1: Single choice */}
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-5">
                <div>
                  <p className="text-xs font-semibold tracking-widest text-[hsl(var(--signal-positive))] uppercase mb-1">
                    Sección 1 de 2
                  </p>
                  <h2 className="text-lg font-semibold text-foreground">
                    ¿Cuál de estos factores está afectando más tu trabajo hoy?
                  </h2>
                  <p className="text-sm text-muted-foreground mt-1">Selecciona solo uno.</p>
                </div>
                <div className="space-y-3">
                  {factorChoices.map((choice) => (
                    <button
                      key={choice}
                      onClick={() => setSelectedFactor(choice)}
                      className={cn(
                        "w-full flex items-center gap-3 text-left rounded-xl border p-4 transition-all duration-150",
                        selectedFactor === choice
                          ? "border-foreground bg-foreground/5"
                          : "border-border bg-background hover:border-foreground/30"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center",
                        selectedFactor === choice ? "border-foreground" : "border-muted-foreground/40"
                      )}>
                        {selectedFactor === choice && <div className="w-2.5 h-2.5 rounded-full bg-foreground" />}
                      </div>
                      <span className="text-sm text-foreground">{choice}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Section 2: Process in practice */}
              <div className="bg-card border border-border rounded-2xl p-6 md:p-8 space-y-6">
                <div>
                  <p className="text-xs font-semibold tracking-widest text-[hsl(var(--signal-positive))] uppercase mb-1">
                    Sección 2 de 2
                  </p>
                  <h2 className="text-lg font-semibold text-foreground">El proceso en la práctica</h2>
                  <p className="text-sm text-muted-foreground mt-1">
                    Queremos entender cómo ocurre el proceso realmente, más allá de cómo está definido.
                  </p>
                </div>

                <div className="space-y-2">
                  <p className="text-sm font-semibold text-foreground">
                    ¿En qué parte del proceso se presentan más dificultades o retrasos?
                  </p>
                  <Textarea
                    value={processIssues}
                    onChange={(e) => setProcessIssues(e.target.value)}
                    placeholder="Ej: la etapa de aprobación, el traspaso entre áreas, el seguimiento post-reunión..."
                    className="min-h-[100px] resize-none"
                  />
                </div>

                <div className="space-y-3">
                  <p className="text-sm font-semibold text-foreground">
                    ¿Este proceso se ejecuta realmente como debería?
                  </p>
                  {executionChoices.map((choice) => (
                    <button
                      key={choice}
                      onClick={() => setExecutionAnswer(choice)}
                      className={cn(
                        "w-full flex items-center gap-3 text-left rounded-xl border p-4 transition-all duration-150",
                        executionAnswer === choice
                          ? "border-foreground bg-foreground/5"
                          : "border-border bg-background hover:border-foreground/30"
                      )}
                    >
                      <div className={cn(
                        "w-5 h-5 rounded-full border-2 shrink-0 flex items-center justify-center",
                        executionAnswer === choice ? "border-foreground" : "border-muted-foreground/40"
                      )}>
                        {executionAnswer === choice && <div className="w-2.5 h-2.5 rounded-full bg-foreground" />}
                      </div>
                      <span className="text-sm text-foreground">{choice}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Footer Screen 2 */}
              <div className="flex items-center justify-between pt-4">
                <Button variant="ghost" onClick={() => setScreen(1)}>
                  ← Atrás
                </Button>
                <Button onClick={handleSubmit} className="bg-foreground text-background hover:bg-foreground/90">
                  Enviar respuestas
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaboratorSurvey;

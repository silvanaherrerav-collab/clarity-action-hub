import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  contextQuestions,
  factors,
  calculateResults,
} from "@/lib/diagnosticData";

type Phase = "intro" | "survey" | "complete";

const TOTAL_STEPS = 1 + factors.length; // context + 6 factors

const likertLabels = [
  "Totalmente en desacuerdo",
  "En desacuerdo",
  "Neutral",
  "De acuerdo",
  "Totalmente de acuerdo",
];

const DiagnosticSurvey = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isLeader = location.pathname.startsWith("/leader");
  const [phase, setPhase] = useState<Phase>("intro");
  const [step, setStep] = useState(0);
  const [contextAnswers, setContextAnswers] = useState<Record<string, string>>({});
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const progress = ((step + 1) / TOTAL_STEPS) * 100;

  const isContextComplete = contextQuestions.every(
    (q) => contextAnswers[q.id]?.trim()
  );

  const currentFactor = step > 0 ? factors[step - 1] : null;

  const isFactorComplete = currentFactor
    ? currentFactor.questions.every((q) => answers[q.id])
    : false;

  const canProceed = step === 0 ? isContextComplete : isFactorComplete;

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      // Survey complete
      const results = calculateResults(contextAnswers, answers);
      localStorage.setItem("tp_diagnostic_results", JSON.stringify(results));
      localStorage.setItem("tp_diagnostic_role", isLeader ? "leader" : "collaborator");
      setPhase("complete");
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      setPhase("intro");
    }
  };

  // Intro Screen
  if (phase === "intro") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-6 animate-fade-in">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Diagnóstico inicial del equipo
          </h1>
          <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
            Responde con honestidad. Este diagnóstico nos permitirá detectar señales clave y ayudarte a intervenir donde más impacto puedes generar.
          </p>
          <p className="mt-4 text-sm text-muted-foreground">
            Tiempo estimado: 6–8 minutos
          </p>
          <button
            onClick={() => setPhase("survey")}
            className="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-lg text-white font-semibold text-lg
              bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)]
              transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Comenzar
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Completion Screen
  if (phase === "complete") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-6 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[hsl(var(--signal-positive)/0.1)] flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-8 h-8 text-[hsl(var(--signal-positive))]" />
          </div>
          {isLeader ? (
            <>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                Diagnóstico enviado
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Estamos analizando las señales de tu equipo. Los resultados estarán disponibles cuando al menos el 80% del equipo complete el diagnóstico.
              </p>
            </>
          ) : (
            <>
              <h1 className="text-3xl font-bold text-foreground tracking-tight">
                ¡Gracias por tu aporte!
              </h1>
              <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-xl mx-auto">
                Tu respuesta es clave para mejorar la forma en que trabajamos.
              </p>
            </>
          )}
          <button
            onClick={() => navigate(isLeader ? "/leader" : "/collaborator")}
            className="mt-10 inline-flex items-center gap-2 px-8 py-4 rounded-lg font-semibold text-lg
              bg-primary text-primary-foreground hover:bg-primary/90
              transition-all duration-200 shadow-lg hover:shadow-xl hover:-translate-y-0.5"
          >
            Ir al panel
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    );
  }

  // Survey Phase
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">
              Diagnóstico de equipo
            </span>
            <span className="text-sm text-muted-foreground">
              Paso {step + 1} de {TOTAL_STEPS}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">Tiempo estimado: 6–8 minutos</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="animate-fade-in" key={step}>
          {step === 0 ? (
            /* Context Questions */
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  Comencemos con algo de contexto
                </h2>
                <p className="text-muted-foreground mt-2">
                  Esto nos ayuda a personalizar el diagnóstico a la realidad de tu equipo.
                </p>
              </div>

              <div className="space-y-6">
                {contextQuestions.map((q) => (
                  <div key={q.id} className="space-y-2">
                    <Label htmlFor={q.id} className="text-sm font-medium">
                      {q.label}
                    </Label>
                    <Input
                      id={q.id}
                      type={q.type}
                      placeholder={q.placeholder}
                      value={contextAnswers[q.id] || ""}
                      onChange={(e) =>
                        setContextAnswers({
                          ...contextAnswers,
                          [q.id]: e.target.value,
                        })
                      }
                      className="h-11"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : currentFactor ? (
            /* Factor Questions */
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
                  Factor {step} de {factors.length}
                </div>
                <h2 className="text-2xl font-semibold text-foreground">
                  {currentFactor.name}
                </h2>
                <p className="text-muted-foreground mt-2">
                  {currentFactor.description}
                </p>
              </div>

              <div className="space-y-6">
                {currentFactor.questions.map((q, qIndex) => (
                  <div
                    key={q.id}
                    className="bg-card border border-border rounded-xl p-6 card-shadow space-y-4"
                  >
                    <p className="text-sm font-medium text-foreground">
                      {qIndex + 1}. {q.text}
                    </p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          onClick={() =>
                            setAnswers({ ...answers, [q.id]: val })
                          }
                          className={cn(
                            "flex-1 py-3 px-2 rounded-lg border-2 text-sm font-medium transition-all duration-150",
                            answers[q.id] === val
                              ? "border-primary bg-primary/10 text-primary"
                              : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <span className="block text-lg font-semibold">{val}</span>
                          <span className="block text-xs mt-0.5 hidden sm:block">
                            {likertLabels[val - 1]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Atrás
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className={cn(
              step === TOTAL_STEPS - 1 &&
                "bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)]"
            )}
          >
            {step === TOTAL_STEPS - 1 ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Completar diagnóstico
              </>
            ) : (
              <>
                Continuar
                <ArrowRight className="w-4 h-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticSurvey;

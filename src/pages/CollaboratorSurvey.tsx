import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { factors, calculateResults } from "@/lib/diagnosticData";

const likertLabels = ["Nunca", "Rara vez", "A veces", "Casi siempre", "Siempre"];

const collaboratorContextQuestions = [
  { id: "role", label: "¿Cuál es tu cargo?", placeholder: "Ej. Analista, Coordinador", type: "text" as const },
  { id: "team", label: "¿A qué equipo perteneces?", placeholder: "Ej. Logística Norte", type: "text" as const },
];

const TOTAL_STEPS = 1 + factors.length;

const CollaboratorSurvey = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const teamId = searchParams.get("team") || "";

  const [step, setStep] = useState(0);
  const [contextAnswers, setContextAnswers] = useState<Record<string, string>>({
    team: teamId,
  });
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  const isContextComplete = collaboratorContextQuestions.every((q) => contextAnswers[q.id]?.trim());
  const currentFactor = step > 0 ? factors[step - 1] : null;
  const isFactorComplete = currentFactor ? currentFactor.questions.every((q) => answers[q.id]) : false;
  const canProceed = step === 0 ? isContextComplete : isFactorComplete;

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      const results = calculateResults(contextAnswers, answers);
      localStorage.setItem("tp_diagnostic_results_collaborator", JSON.stringify(results));
      navigate("/collaborator/thanks");
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">Diagnóstico de equipo</span>
            <span className="text-sm text-muted-foreground">Paso {step + 1} de {TOTAL_STEPS}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">Tiempo estimado: 6–8 minutos</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="animate-fade-in" key={step}>
          {step === 0 ? (
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">Comencemos con algo de contexto</h2>
                <p className="text-muted-foreground mt-2">Esto nos ayuda a personalizar el diagnóstico.</p>
              </div>
              <div className="space-y-6">
                {collaboratorContextQuestions.map((q) => (
                  <div key={q.id} className="space-y-2">
                    <Label htmlFor={q.id} className="text-sm font-medium">{q.label}</Label>
                    <Input
                      id={q.id}
                      type={q.type}
                      placeholder={q.placeholder}
                      value={contextAnswers[q.id] || ""}
                      onChange={(e) => setContextAnswers({ ...contextAnswers, [q.id]: e.target.value })}
                      className="h-11"
                    />
                  </div>
                ))}
              </div>
            </div>
          ) : currentFactor ? (
            <div className="space-y-8">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[hsl(var(--signal-positive)/0.1)] text-[hsl(var(--signal-positive))] text-sm font-medium mb-4">
                  Factor {step} de {factors.length}
                </div>
                <h2 className="text-2xl font-semibold text-foreground">{currentFactor.name}</h2>
                <p className="text-muted-foreground mt-2">{currentFactor.description}</p>
              </div>
              <div className="space-y-6">
                {currentFactor.questions.map((q, qIndex) => (
                  <div key={q.id} className="bg-card border border-border rounded-xl p-6 card-shadow space-y-4">
                    <p className="text-sm font-medium text-foreground">{qIndex + 1}. {q.text}</p>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map((val) => (
                        <button
                          key={val}
                          onClick={() => setAnswers({ ...answers, [q.id]: val })}
                          className={cn(
                            "flex-1 py-3 px-2 rounded-lg border-2 text-sm font-medium transition-all duration-150",
                            answers[q.id] === val
                              ? "border-[hsl(var(--signal-positive))] bg-[hsl(var(--signal-positive)/0.1)] text-[hsl(var(--signal-positive))]"
                              : "border-border hover:border-[hsl(var(--signal-positive)/0.4)] text-muted-foreground hover:text-foreground"
                          )}
                        >
                          <span className="block text-lg font-semibold">{val}</span>
                          <span className="block text-xs mt-0.5 hidden sm:block">{likertLabels[val - 1]}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}
        </div>

        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
          <Button variant="ghost" onClick={handleBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Atrás
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className="bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white"
          >
            {step === TOTAL_STEPS - 1 ? (
              <>
                <CheckCircle2 className="w-4 h-4 mr-2" />
                Enviar
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

export default CollaboratorSurvey;

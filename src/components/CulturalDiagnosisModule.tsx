import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, Shield, Layers, Handshake, Zap, Heart, Crown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { factors, calculateResults } from "@/lib/diagnosticData";

const likertLabels = ["Nunca", "Rara vez", "A veces", "Casi siempre", "Siempre"];

const factorIcons: Record<string, React.ElementType> = {
  psychological_safety: Shield,
  structure_clarity: Layers,
  dependability: Handshake,
  work_impact: Zap,
  meaning: Heart,
  leadership: Crown,
};

interface CulturalDiagnosisModuleProps {
  onComplete: (results: ReturnType<typeof calculateResults>) => void;
  onCancel?: () => void;
}

const CulturalDiagnosisModule = ({ onComplete, onCancel }: CulturalDiagnosisModuleProps) => {
  const [phase, setPhase] = useState<"intro" | "survey" | "complete">("intro");
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  const TOTAL_STEPS = factors.length;
  const progress = ((step + 1) / TOTAL_STEPS) * 100;
  const currentFactor = factors[step];
  const isFactorComplete = currentFactor
    ? currentFactor.questions.every((q) => answers[q.id])
    : false;

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      const results = calculateResults({}, answers);
      localStorage.setItem("tp_cultural_results", JSON.stringify(results));
      localStorage.setItem("tp_cultural_completed_at", new Date().toISOString());
      setPhase("complete");
      onComplete(results);
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      setPhase("intro");
    }
  };

  if (phase === "intro") {
    return (
      <div className="space-y-8 animate-fade-in">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
            <Shield className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-2xl font-bold text-foreground">Diagnóstico cultural del equipo</h2>
          <p className="text-muted-foreground max-w-lg mx-auto">
            Evalúa 6 factores clave que determinan la salud y rendimiento de tu equipo. 
            El diagnóstico toma aproximadamente 6–8 minutos.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-w-2xl mx-auto">
          {factors.map((factor) => {
            const Icon = factorIcons[factor.id] || Shield;
            return (
              <div key={factor.id} className="bg-card border border-border rounded-xl p-4 text-center space-y-2">
                <Icon className="w-5 h-5 text-primary mx-auto" />
                <p className="text-sm font-medium text-foreground">{factor.name}</p>
              </div>
            );
          })}
        </div>

        <div className="flex items-center justify-center gap-3">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          <Button
            onClick={() => setPhase("survey")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground"
          >
            Iniciar diagnóstico
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    );
  }

  if (phase === "complete") {
    const results = JSON.parse(localStorage.getItem("tp_cultural_results") || "{}");
    return (
      <div className="space-y-8 animate-fade-in text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h2 className="text-2xl font-bold text-foreground">Diagnóstico completado</h2>
        <p className="text-muted-foreground">
          Puntuación general: <span className="text-foreground font-semibold">{results.overallScore}/100</span>
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-xl mx-auto text-left">
          {factors.map((factor) => {
            const score = results.scores?.[factor.id] ?? 0;
            const Icon = factorIcons[factor.id] || Shield;
            return (
              <div key={factor.id} className="bg-card border border-border rounded-xl p-4 space-y-2">
                <div className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <span className="text-sm font-medium text-foreground">{factor.name}</span>
                  <span className="ml-auto text-sm font-semibold text-foreground">{score}%</span>
                </div>
                <Progress value={score} className="h-2" />
              </div>
            );
          })}
        </div>
        {onCancel && (
          <Button onClick={onCancel} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            Volver al dashboard
          </Button>
        )}
      </div>
    );
  }

  // Survey phase
  const FactorIcon = factorIcons[currentFactor?.id] || Shield;

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Progress header */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-muted-foreground">Diagnóstico cultural</span>
          <span className="text-sm text-muted-foreground">Factor {step + 1} de {TOTAL_STEPS}</span>
        </div>
        <Progress value={progress} className="h-2" />

        {/* Factor tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {factors.map((f, i) => {
            const allAnswered = f.questions.every((q) => answers[q.id]);
            return (
              <button
                key={f.id}
                onClick={() => setStep(i)}
                className={cn(
                  "flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-colors",
                  i === step
                    ? "bg-primary text-primary-foreground"
                    : allAnswered
                      ? "bg-primary/10 text-primary"
                      : "bg-muted text-muted-foreground"
                )}
              >
                {f.name.split(" ")[0]}
              </button>
            );
          })}
        </div>
      </div>

      {/* Factor header */}
      <div className="flex items-start gap-4" key={step}>
        <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center flex-shrink-0">
          <FactorIcon className="w-6 h-6 text-primary" />
        </div>
        <div>
          <h3 className="text-xl font-semibold text-foreground">{currentFactor.name}</h3>
          <p className="text-muted-foreground text-sm mt-1">{currentFactor.description}</p>
        </div>
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {currentFactor.questions.map((q, qIndex) => (
          <div key={q.id} className="bg-card border border-border rounded-xl p-5 space-y-4">
            <p className="text-sm font-medium text-foreground">
              {qIndex + 1}. {q.text}
            </p>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((val) => (
                <button
                  key={val}
                  onClick={() => setAnswers({ ...answers, [q.id]: val })}
                  className={cn(
                    "flex-1 py-3 px-2 rounded-lg border-2 text-sm font-medium transition-all duration-150",
                    answers[q.id] === val
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border hover:border-primary/40 text-muted-foreground hover:text-foreground"
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

      {/* Navigation */}
      <div className="flex items-center justify-between pt-4 border-t border-border">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Atrás
        </Button>
        <Button
          onClick={handleNext}
          disabled={!isFactorComplete}
          className="bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {step === TOTAL_STEPS - 1 ? (
            <>
              <CheckCircle2 className="w-4 h-4 mr-2" />
              Enviar diagnóstico
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
  );
};

export default CulturalDiagnosisModule;

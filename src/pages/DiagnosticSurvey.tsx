import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  type DiagnosticResults,
} from "@/lib/diagnosticData";

const TOTAL_STEPS = 1 + factors.length; // context + 6 factors

const likertLabels = [
  "Strongly Disagree",
  "Disagree",
  "Neutral",
  "Agree",
  "Strongly Agree",
];

const DiagnosticSurvey = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0); // 0 = context, 1-6 = factors
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
      // Survey complete — calculate and store results, then navigate
      const results = calculateResults(contextAnswers, answers);
      localStorage.setItem("tp_diagnostic_results", JSON.stringify(results));
      navigate("/leader");
    }
  };

  const handleBack = () => {
    if (step > 0) {
      setStep(step - 1);
    } else {
      navigate("/leader/welcome");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">
              Team Diagnostic
            </span>
            <span className="text-sm text-muted-foreground">
              Step {step + 1} of {TOTAL_STEPS}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        <div className="animate-fade-in" key={step}>
          {step === 0 ? (
            /* Context Questions */
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-foreground">
                  Let's start with some context
                </h2>
                <p className="text-muted-foreground mt-2">
                  This helps us tailor the diagnostic to your team's reality.
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
                  Factor {step} of {factors.length}
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
            Back
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
                Complete Diagnostic
              </>
            ) : (
              <>
                Continue
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

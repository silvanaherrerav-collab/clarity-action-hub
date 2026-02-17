import { useNavigate } from "react-router-dom";
import { ArrowRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { factors } from "@/lib/diagnosticData";

const DiagnosticResult = () => {
  const navigate = useNavigate();

  // MVP placeholder scores
  const scores: Record<string, number> = {
    psychological_safety: 72,
    structure_clarity: 85,
    dependability: 68,
    work_impact: 78,
    meaning: 81,
    leadership: 74,
  };

  const overall = Math.round(
    Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length
  );

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-[hsl(var(--signal-positive))]";
    if (score >= 60) return "text-[hsl(var(--signal-warning))]";
    return "text-[hsl(var(--signal-critical))]";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-3xl mx-auto px-6 py-12 animate-fade-in">
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-full bg-[hsl(var(--signal-positive)/0.1)] flex items-center justify-center mx-auto mb-4">
            <BarChart3 className="w-8 h-8 text-[hsl(var(--signal-positive))]" />
          </div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Diagnóstico inicial del equipo
          </h1>
          <p className="mt-3 text-muted-foreground">
            Puntuación general: <span className={`font-bold text-xl ${getScoreColor(overall)}`}>{overall}/100</span>
          </p>
        </div>

        <div className="space-y-4">
          {factors.map((factor) => {
            const score = scores[factor.id] || 0;
            return (
              <div key={factor.id} className="bg-card border border-border rounded-xl p-5 card-shadow">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-foreground">{factor.name}</h3>
                  <span className={`font-bold ${getScoreColor(score)}`}>{score}%</span>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{factor.description}</p>
                <Progress value={score} className="h-2" />
              </div>
            );
          })}
        </div>

        <div className="text-center mt-10">
          <Button
            onClick={() => navigate("/leader")}
            className="bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white"
          >
            Ir al panel del líder
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticResult;

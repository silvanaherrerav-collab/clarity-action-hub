import { useNavigate } from "react-router-dom";
import { ArrowRight, ArrowLeft, TrendingUp, AlertTriangle, Sparkles, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { factors } from "@/lib/diagnosticData";

const DiagnosticResult = () => {
  const navigate = useNavigate();

  // Load real scores or use placeholders
  const culturalResults = (() => {
    try {
      const raw = localStorage.getItem("tp_cultural_results");
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  })();

  const scores: Record<string, number> = culturalResults?.scores || {
    psychological_safety: 72,
    structure_clarity: 58,
    dependability: 68,
    work_impact: 78,
    meaning: 81,
    leadership: 65,
  };

  const overall = culturalResults?.overallScore
    ? Math.round(culturalResults.overallScore)
    : Math.round(Object.values(scores).reduce((a, b) => a + b, 0) / Object.values(scores).length);

  // Determine strengths and opportunities
  const sortedFactors = factors
    .map((f) => ({ ...f, score: scores[f.id] || 0 }))
    .sort((a, b) => b.score - a.score);

  const strengths = sortedFactors.slice(0, 2);
  const opportunities = [...sortedFactors].sort((a, b) => a.score - b.score).slice(0, 2);

  const getScoreColor = (score: number) => {
    if (score >= 75) return "text-[hsl(var(--signal-positive))]";
    if (score >= 55) return "text-[hsl(var(--signal-warning))]";
    return "text-[hsl(var(--signal-critical))]";
  };

  const getBarColor = (score: number) => {
    if (score >= 75) return "[&>div]:bg-[hsl(var(--signal-positive))]";
    if (score >= 55) return "[&>div]:bg-[hsl(var(--signal-warning))]";
    return "[&>div]:bg-[hsl(var(--signal-critical))]";
  };

  // Generate dynamic insight
  const generateInsight = () => {
    if (overall >= 75) {
      return "Tu equipo tiene una base sólida. Hay oportunidades claras para escalar el rendimiento enfocándote en los factores más bajos.";
    }
    if (overall >= 55) {
      return "Tu equipo tiene una base sólida, pero hay oportunidades claras en claridad y priorización.";
    }
    return "Hay señales importantes que atender. Priorizar claridad y confianza tendrá un impacto inmediato en el rendimiento.";
  };

  // Generate suggested action
  const generateAction = () => {
    const lowestFactor = opportunities[0];
    if (lowestFactor.id === "structure_clarity") {
      return "Te recomendamos empezar alineando objetivos del equipo en una sesión 1:1 esta semana.";
    }
    if (lowestFactor.id === "leadership") {
      return "Te recomendamos agendar una retroalimentación 1:1 con cada miembro para recalibrar expectativas.";
    }
    if (lowestFactor.id === "dependability") {
      return "Considera establecer acuerdos claros de entrega y seguimiento semanal.";
    }
    return "Te recomendamos empezar alineando prioridades del equipo en una sesión esta semana.";
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12 animate-fade-in space-y-10">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase text-center">
          Talent Performance Lab
        </p>

        {/* Hero Score */}
        <div className="text-center space-y-3">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            Diagnóstico completado
          </h1>
          <div className="inline-flex items-baseline gap-1">
            <span className={`text-7xl font-bold tracking-tight ${getScoreColor(overall)}`}>{overall}</span>
            <span className="text-2xl text-muted-foreground font-medium">/100</span>
          </div>
        </div>

        {/* Main Insight */}
        <div className="bg-card border border-border rounded-2xl p-6 card-shadow">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-[hsl(var(--signal-warning)/0.1)] flex items-center justify-center shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5 text-[hsl(var(--signal-warning))]" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground mb-1">Insight principal</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{generateInsight()}</p>
            </div>
          </div>
        </div>

        {/* Strengths + Opportunities */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Strengths */}
          <div className="bg-card border border-border rounded-2xl p-5 card-shadow space-y-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-[hsl(var(--signal-positive))]" />
              <h3 className="text-sm font-semibold text-foreground">Top fortalezas</h3>
            </div>
            {strengths.map((f) => (
              <div key={f.id} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{f.name}</span>
                <span className={`text-sm font-bold ${getScoreColor(f.score)}`}>{Math.round(f.score)}%</span>
              </div>
            ))}
          </div>

          {/* Opportunities */}
          <div className="bg-card border border-border rounded-2xl p-5 card-shadow space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[hsl(var(--signal-warning))]" />
              <h3 className="text-sm font-semibold text-foreground">Top oportunidades</h3>
            </div>
            {opportunities.map((f) => (
              <div key={f.id} className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">{f.name}</span>
                <span className={`text-sm font-bold ${getScoreColor(f.score)}`}>{Math.round(f.score)}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* All Factors */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-foreground">Detalle por factor</h3>
          {factors.map((factor) => {
            const score = scores[factor.id] || 0;
            return (
              <div key={factor.id} className="flex items-center gap-4">
                <span className="text-sm text-muted-foreground w-40 shrink-0 truncate">{factor.name}</span>
                <div className="flex-1">
                  <Progress value={score} className={`h-2 ${getBarColor(score)}`} />
                </div>
                <span className={`text-sm font-bold w-12 text-right ${getScoreColor(score)}`}>{Math.round(score)}%</span>
              </div>
            );
          })}
        </div>

        {/* Suggested Action */}
        <div className="bg-[hsl(var(--signal-positive)/0.04)] border border-[hsl(var(--signal-positive)/0.2)] rounded-2xl p-6 space-y-3">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-[hsl(var(--signal-positive))]" />
            <h3 className="text-sm font-semibold text-foreground">Acción sugerida</h3>
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">{generateAction()}</p>
        </div>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={() => navigate("/leader/plan-review")}
            className="flex-1 bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white h-12 text-base font-semibold"
          >
            Ver plan de trabajo
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
          <Button
            variant="outline"
            onClick={() => navigate("/leader")}
            className="h-12"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Volver al dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticResult;

import { useNavigate } from "react-router-dom";
import { Send, ArrowRight, BarChart3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const DiagnosticProcessing = () => {
  const navigate = useNavigate();

  // MVP placeholder — will be dynamic with backend
  const totalMembers = 8;
  const responses = 1;
  const percentage = Math.round((responses / totalMembers) * 100);
  const threshold = 80;
  const completionRate = responses / totalMembers;
  const canSeeCultureDashboard = completionRate >= 0.8;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto px-6 py-12 animate-fade-in space-y-8">

        {/* Branding */}
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase text-center">
          Talent Performance Lab
        </p>

        {/* Header */}
        <div className="text-center space-y-3">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Analizando patrones culturales…
          </h1>
          <p className="text-muted-foreground text-base leading-relaxed">
            Estamos consolidando respuestas y detectando señales clave del equipo.
          </p>
        </div>

        {/* Anonymous progress card */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-4">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground font-medium">Respuestas recibidas</span>
            <span className="font-bold text-foreground">{responses} / {totalMembers}</span>
          </div>
          <Progress value={percentage} className="h-3" />
          <p className="text-xs text-muted-foreground">
            {percentage}% completado — Mínimo {threshold}% para ver resultados del diagnóstico cultural.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate("/leader/clarity-first")}
            className="w-full bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white h-12 text-base font-semibold"
          >
            Construir plan de trabajo
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>

          <Button
            variant="outline"
            onClick={() => navigate("/leader/invite")}
            className="w-full h-11"
          >
            <Send className="w-4 h-4 mr-2" />
            Invitar a mi equipo
          </Button>

          {/* Future-ready: only shown when threshold is met */}
          {canSeeCultureDashboard && (
            <Button
              variant="ghost"
              onClick={() => navigate("/leader/diagnostic-result")}
              className="w-full h-11"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              Ver diagnóstico cultural
            </Button>
          )}
        </div>

        {/* Link */}
        <p className="text-center">
          <button
            onClick={() => navigate("/leader/invite")}
            className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Ver progreso del diagnóstico
          </button>
        </p>
      </div>
    </div>
  );
};

export default DiagnosticProcessing;

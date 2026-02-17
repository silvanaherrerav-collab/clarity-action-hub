import { useNavigate } from "react-router-dom";
import { Users, RefreshCw, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const DiagnosticGate = () => {
  const navigate = useNavigate();

  // MVP placeholder values — will be dynamic with backend
  const totalMembers = 8;
  const responses = 1; // leader only so far
  const percentage = Math.round((responses / totalMembers) * 100);
  const threshold = 80;

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-lg w-full mx-auto px-6 animate-fade-in">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-[hsl(var(--signal-positive)/0.1)] flex items-center justify-center mx-auto">
            <Users className="w-8 h-8 text-[hsl(var(--signal-positive))]" />
          </div>

          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Estamos construyendo el diagnóstico del equipo
          </h1>

          <p className="text-muted-foreground">
            Los resultados estarán disponibles cuando al menos el {threshold}% del equipo complete el diagnóstico.
          </p>

          <div className="bg-card border border-border rounded-xl p-6 card-shadow space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Respuestas recibidas</span>
              <span className="font-semibold text-foreground">{responses} / {totalMembers}</span>
            </div>
            <Progress value={percentage} className="h-3" />
            <p className="text-xs text-muted-foreground">
              Mínimo {threshold}% para ver resultados ({Math.ceil(totalMembers * threshold / 100)} respuestas necesarias)
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              onClick={() => navigate("/leader/invite")}
              className="flex-1 bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white"
            >
              <Send className="w-4 h-4 mr-2" />
              Invitar a mi equipo
            </Button>
            <Button
              variant="outline"
              onClick={() => window.location.reload()}
              className="flex-1"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Ver estado del diagnóstico
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DiagnosticGate;

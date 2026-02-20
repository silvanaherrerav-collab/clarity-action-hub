import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Check, ShieldOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

const TEAM_ID = "demo-team-001";

const LeaderInvite = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const shareLink = `${window.location.origin}/collaborator/welcome?team=${TEAM_ID}`;

  // MVP placeholder values
  const totalMembers = 8;
  const responses = 1;
  const percentage = Math.round((responses / totalMembers) * 100);
  const threshold = 80;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12 animate-fade-in">
        <Button variant="ghost" onClick={() => navigate("/leader/diagnostic-processing")} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver
        </Button>

        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Invitar a mi equipo
        </h1>
        <p className="mt-3 text-muted-foreground">
          Comparte este enlace con tu equipo para completar el diagnóstico:
        </p>

        <div className="mt-6 bg-card border border-border rounded-xl p-4 flex items-center gap-3">
          <code className="flex-1 text-sm text-foreground bg-muted/50 px-3 py-2 rounded-lg truncate">
            {shareLink}
          </code>
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopy}
            className={cn(copied && "text-[hsl(var(--signal-positive))] border-[hsl(var(--signal-positive))]")}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          </Button>
        </div>

        <div className="mt-10">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-foreground">Progreso del equipo (anónimo)</h2>
          </div>

          <div className="bg-card border border-border rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Respuestas recibidas</span>
              <span className="font-semibold text-foreground">{responses} / {totalMembers}</span>
            </div>
            <Progress value={percentage} className="h-3" />
            <p className="text-xs text-muted-foreground">
              {percentage}% completado — Mínimo {threshold}% para ver resultados ({Math.ceil(totalMembers * threshold / 100)} respuestas necesarias)
            </p>
            <p className="text-sm text-muted-foreground">
              Los resultados estarán disponibles cuando al menos el {threshold}% del equipo complete el diagnóstico.
            </p>
          </div>

          {/* Privacy notice */}
          <div className="mt-4 flex items-start gap-2 px-4 py-3 rounded-lg bg-muted/50 border border-border">
            <ShieldOff className="w-4 h-4 text-muted-foreground mt-0.5 shrink-0" />
            <p className="text-xs text-muted-foreground">
              Por privacidad, el estado individual no se muestra. Solo verás el avance total.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderInvite;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Check, ShieldOff, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Sidebar } from "@/components/layout/Sidebar";

const TEAM_ID = "demo-team-001";

const LeaderInvite = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const shareLink = `${window.location.origin}/collaborator/welcome?team=${TEAM_ID}`;

  const totalMembers = (() => {
    try {
      const raw = localStorage.getItem("tp_team_setup");
      if (raw) return JSON.parse(raw).length || 8;
    } catch {}
    return 8;
  })();

  const responses = 1;
  const percentage = Math.round((responses / totalMembers) * 100);

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = () => navigate("/");

  return (
    <div className="flex min-h-screen">
      <Sidebar userRole="leader" userName="Alex Thompson" onLogout={handleLogout} />
      <div className="flex-1 ml-64 min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12 animate-fade-in">
        <Button variant="ghost" onClick={() => navigate("/leader")} className="mb-8">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Volver al dashboard
        </Button>

        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Invitar a mi equipo
        </h1>

        {/* Invitation message preview */}
        <div className="mt-6 bg-card border border-border rounded-2xl p-6 space-y-4 card-shadow">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-semibold text-foreground">Mensaje de invitación</h2>
          </div>
          <div className="bg-[hsl(var(--surface-sunken))] rounded-xl p-4 text-sm text-muted-foreground leading-relaxed">
            "Has sido invitado a participar en la mejora de un proceso. Tu feedback es clave para construir un mejor equipo."
          </div>
        </div>

        {/* Share link */}
        <div className="mt-4 bg-card border border-border rounded-2xl p-4 flex items-center gap-3 card-shadow">
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

        {/* Progress */}
        <div className="mt-8">
          <h2 className="text-lg font-semibold text-foreground mb-4">Progreso del equipo</h2>
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4 card-shadow">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Respuestas recibidas</span>
              <span className="font-semibold text-foreground">{responses} / {totalMembers}</span>
            </div>
            <Progress value={percentage} className="h-3" />
            <p className="text-xs text-muted-foreground">{percentage}% completado</p>
          </div>

          <div className="mt-4 flex items-start gap-2 px-4 py-3 rounded-xl bg-muted/50 border border-border">
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

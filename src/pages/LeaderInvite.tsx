import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Copy, Check, Clock, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const TEAM_ID = "demo-team-001";

const mockMembers = [
  { name: "Carlos Méndez", status: "Completado" },
  { name: "Ana Rodríguez", status: "Pendiente" },
  { name: "Luis García", status: "Pendiente" },
  { name: "María Torres", status: "Pendiente" },
  { name: "Pedro Sánchez", status: "Pendiente" },
];

const LeaderInvite = () => {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const shareLink = `${window.location.origin}/collaborator/welcome?team=${TEAM_ID}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12 animate-fade-in">
        <Button variant="ghost" onClick={() => navigate("/leader/diagnostic-gate")} className="mb-8">
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
          <h2 className="text-lg font-semibold text-foreground mb-4">Estado del equipo</h2>
          <div className="bg-card border border-border rounded-xl divide-y divide-border">
            {mockMembers.map((member) => (
              <div key={member.name} className="flex items-center justify-between px-5 py-4">
                <span className="text-sm font-medium text-foreground">{member.name}</span>
                <span className={cn(
                  "inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full",
                  member.status === "Completado"
                    ? "bg-[hsl(var(--signal-positive)/0.1)] text-[hsl(var(--signal-positive))]"
                    : "bg-muted text-muted-foreground"
                )}>
                  {member.status === "Completado" ? (
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  ) : (
                    <Clock className="w-3.5 h-3.5" />
                  )}
                  {member.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LeaderInvite;

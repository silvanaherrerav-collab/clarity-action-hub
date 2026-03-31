import { useMemo } from "react";
import { Clock, Users, Calendar, ChevronRight, Send } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { useNavigateWithTransition } from "@/hooks/useNavigateWithTransition";

const PlanWaiting = () => {
  const navigate = useNavigateWithTransition();

  const responsible = useMemo(() => {
    try {
      const r = localStorage.getItem("tp_process_responsible");
      if (r) {
        const parsed = JSON.parse(r);
        return {
          name: parsed.responsible?.name || "María González",
          cargo: parsed.responsible?.cargo || "Gerente de Ventas",
        };
      }
    } catch {}
    return { name: "María González", cargo: "Gerente de Ventas" };
  }, []);

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      {/* Header */}
      <div className="bg-[#f5f5f0] border-b border-border/40">
        <div className="max-w-3xl mx-auto px-8 py-4 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-[0.2em] text-foreground/60 uppercase">
            Talent Performance Lab
          </span>
          <span className="text-sm text-muted-foreground">
            Plan de trabajo
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-xl mx-auto px-6 py-12 space-y-8">
        {/* Hourglass icon */}
        <div className="flex justify-center">
          <div className="w-20 h-20 flex items-center justify-center">
            <svg className="w-16 h-16" viewBox="0 0 64 64" fill="none">
              <rect x="16" y="8" width="32" height="48" rx="4" stroke="hsl(215,16%,72%)" strokeWidth="2" fill="none" />
              <rect x="20" y="12" width="24" height="18" rx="2" fill="hsl(200,80%,88%)" />
              <rect x="20" y="34" width="24" height="18" rx="2" fill="hsl(215,16%,92%)" />
              <path d="M20 30 L32 38 L44 30" stroke="hsl(200,80%,55%)" strokeWidth="2" fill="none" />
              <rect x="28" y="4" width="8" height="4" rx="1" fill="hsl(215,16%,72%)" />
              <rect x="28" y="56" width="8" height="4" rx="1" fill="hsl(215,16%,72%)" />
            </svg>
          </div>
        </div>

        {/* Status text */}
        <div className="text-center space-y-2">
          <p className="text-xs font-bold tracking-[0.15em] text-[hsl(var(--signal-positive))] uppercase">
            Esperando confirmación
          </p>
          <h1 className="text-2xl font-bold text-foreground">
            Esperando a
          </h1>
          <p className="text-2xl font-bold text-[hsl(var(--signal-positive))]">
            {responsible.name}
          </p>
          <p className="text-sm text-muted-foreground">
            El plan está siendo revisado por quien ejecuta el proceso
          </p>
          {/* Dots */}
          <div className="flex items-center justify-center gap-1.5 pt-2">
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--signal-positive))] animate-pulse" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--signal-positive))] animate-pulse" style={{ animationDelay: "300ms" }} />
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--signal-positive))] animate-pulse" style={{ animationDelay: "600ms" }} />
          </div>
        </div>

        {/* Plan status card */}
        <div className="rounded-2xl border border-border/60 bg-white overflow-hidden">
          <div className="px-6 py-4 flex items-center justify-between border-b border-border/40">
            <span className="text-xs font-bold tracking-[0.15em] text-foreground uppercase">
              Plan de trabajo
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[hsl(var(--signal-positive))] border border-[hsl(var(--signal-positive)/0.3)] rounded-full px-3 py-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[hsl(var(--signal-positive))]" />
              Pendiente de validación
            </span>
          </div>

          <div className="divide-y divide-border/40">
            <div className="px-6 py-4 flex items-center gap-4">
              <Clock className="w-5 h-5 text-muted-foreground/50" />
              <div>
                <p className="text-xs text-muted-foreground">Estado</p>
                <p className="text-sm font-semibold text-foreground">Pendiente de validación del equipo</p>
              </div>
            </div>
            <div className="px-6 py-4 flex items-center gap-4">
              <Users className="w-5 h-5 text-[hsl(var(--signal-positive)/0.5)]" />
              <div>
                <p className="text-xs text-muted-foreground">Revisando</p>
                <p className="text-sm font-semibold text-foreground">{responsible.name} · {responsible.cargo}</p>
              </div>
            </div>
            <div className="px-6 py-4 flex items-center gap-4">
              <Calendar className="w-5 h-5 text-muted-foreground/50" />
              <div>
                <p className="text-xs text-muted-foreground">Enviado</p>
                <p className="text-sm font-semibold text-foreground">Hoy · hace 8 minutos</p>
              </div>
            </div>
          </div>
        </div>

        {/* Edit option */}
        <button
          onClick={() => navigate("/leader/plan-review")}
          className="w-full rounded-2xl border border-border/60 bg-white px-6 py-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-muted/50 flex items-center justify-center">
              <svg className="w-4 h-4 text-muted-foreground" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
            </div>
            <div className="text-left">
              <p className="text-sm font-semibold text-foreground">¿Quieres cambiar algo antes de que lo revise?</p>
              <p className="text-xs text-muted-foreground">Todavía puedes editar el plan mientras esperas la confirmación.</p>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        {/* Resend banner */}
        <button
          className="w-full rounded-2xl p-5 flex items-center gap-4 text-left transition-transform hover:scale-[1.01]"
          style={{ background: "linear-gradient(135deg, hsl(152,76%,40%), hsl(200,80%,55%), hsl(217,91%,60%))" }}
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Send className="w-5 h-5 text-white" />
          </div>
          <div>
            <p className="text-sm font-bold text-white">¿No ha respondido aún?</p>
            <p className="text-xs text-white/80">Puedes reenviar la invitación.</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default PlanWaiting;

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { ActionPlanTaskList } from "@/components/ActionPlanTaskList";
import { getProcessName } from "@/lib/processName";
import { getCollaboratorIdentity } from "@/lib/collaboratorIdentity";
import { Users } from "lucide-react";

const CollaboratorActionPlan = () => {
  const navigate = useNavigate();
  const { fullName: collaboratorName } = getCollaboratorIdentity();
  const processName = getProcessName();

  const leaderName = useMemo(() => {
    try {
      const raw = localStorage.getItem("tp_register_data");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.name?.trim()) return data.name.trim();
      }
    } catch {}
    try {
      const raw = localStorage.getItem("tp_user_account");
      if (raw) {
        const data = JSON.parse(raw);
        const n = [data.firstName, data.lastName].filter(Boolean).join(" ");
        if (n.trim()) return n.trim();
      }
    } catch {}
    return "Tu líder";
  }, []);

  const [completedCount, setCompletedCount] = useState(0);
  const [taskTotal, setTaskTotal] = useState(0);

  const handleTaskProgress = (completed: number, total: number) => {
    setCompletedCount(completed);
    setTaskTotal(total);
  };

  const taskProgress = taskTotal > 0 ? Math.round((completedCount / taskTotal) * 100) : 0;

  const [ownershipFilter, setOwnershipFilter] = useState<"all" | "mine" | "leader">("all");

  const handleLogout = () => navigate("/");

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <Sidebar userRole="collaborator" userName={collaboratorName} onLogout={handleLogout} />

      <main className="ml-64 h-screen overflow-y-auto overflow-x-hidden bg-[#f5f5f0]">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#f5f5f0] border-b border-border/40">
          <div className="px-8 py-5 flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold tracking-[0.15em] text-[hsl(var(--signal-positive))] uppercase">
                PLAN DE ACCIÓN · {processName}
              </p>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Plan de trabajo del proceso
              </h1>
              <p className="text-sm text-muted-foreground">
                Definido por {leaderName} · Seguimiento activo
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 pt-1">
              <span className="text-sm text-muted-foreground">Progreso general</span>
              <div className="w-28 h-2.5 rounded-full bg-muted/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[hsl(var(--signal-positive))] transition-all"
                  style={{ width: `${taskProgress}%` }}
                />
              </div>
              <span className="text-sm font-bold text-foreground">
                {taskProgress}%
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-10 space-y-10 pb-28">
          {/* Ownership filter */}
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground mr-1">Ownership:</span>
            <button
              onClick={() => setOwnershipFilter("mine")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
                ownershipFilter === "mine"
                  ? "border-[hsl(var(--signal-positive))] bg-[hsl(var(--signal-positive)/0.08)] text-[hsl(var(--signal-positive))] font-semibold"
                  : "border-border text-muted-foreground hover:border-foreground/30"
              }`}
            >
              <span className="w-5 h-5 rounded bg-[hsl(var(--signal-positive))] text-white text-[10px] font-bold flex items-center justify-center">Tú</span>
              Tareas que te corresponden
            </button>
            <button
              onClick={() => setOwnershipFilter("leader")}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg border transition-colors ${
                ownershipFilter === "leader"
                  ? "border-foreground/40 bg-muted/30 text-foreground font-semibold"
                  : "border-border text-muted-foreground hover:border-foreground/30"
              }`}
            >
              Líder
            </button>
            <span className="text-muted-foreground">Solo lectura</span>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-2 border-l-4 border-l-[hsl(var(--signal-warning))]">
              <p className="text-xs font-bold tracking-[0.12em] text-[hsl(var(--signal-warning))] uppercase">Problema</p>
              <p className="text-sm font-semibold text-foreground leading-snug">
                Los reprocesos están generando retrasos y pérdida de tiempo del equipo
              </p>
              <p className="text-xs text-muted-foreground">Identificado en diagnóstico · Semana 1</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-2 border-l-4 border-l-[hsl(var(--signal-positive))]">
              <p className="text-xs font-bold tracking-[0.12em] text-[hsl(var(--signal-positive))] uppercase">Objetivo</p>
              <p className="text-sm font-semibold text-foreground leading-snug">
                Reducir la tasa de reprocesos en un 30% en 30 días
              </p>
              <p className="text-xs text-muted-foreground">Meta: &lt; 10% tasa de error</p>
            </div>
            <div className="rounded-2xl border border-border/60 bg-card p-5 space-y-2 border-l-4 border-l-[hsl(217,91%,60%)]">
              <p className="text-xs font-bold tracking-[0.12em] text-[hsl(217,91%,60%)] uppercase">KPI</p>
              <p className="text-sm font-semibold text-foreground leading-snug">
                Tasa de reproceso 7.2% → Meta <span className="text-[hsl(var(--signal-positive))] font-bold">&lt;10%</span>
              </p>
              <p className="text-xs text-muted-foreground">↓ Bajando · Actualizado hoy</p>
            </div>
          </div>

          {/* Collaborative context banner */}
          <div className="flex items-start gap-3 p-4 rounded-xl bg-[hsl(var(--signal-positive)/0.06)] border border-[hsl(var(--signal-positive)/0.15)]">
            <Users className="w-5 h-5 text-[hsl(var(--signal-positive))] mt-0.5 shrink-0" />
            <p className="text-sm text-muted-foreground">
              Este plan de trabajo es compartido entre el equipo. Tu avance y comentarios alimentan el seguimiento del proceso.
            </p>
          </div>

          {/* Action Plan Task List — full interaction enabled */}
          <ActionPlanTaskList onProgressChange={handleTaskProgress} />
        </div>
      </main>
    </div>
  );
};

export default CollaboratorActionPlan;

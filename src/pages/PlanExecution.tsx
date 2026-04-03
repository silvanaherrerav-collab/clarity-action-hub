import { useState, useMemo } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { useNavigate } from "react-router-dom";
import { Target, CheckCircle2, AlertTriangle, Clock, Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

interface InitiativeExec {
  id: string;
  title: string;
  role: string;
  priority: "alta" | "media" | "baja";
  daysEstimated: number;
  daysElapsed: number;
  progress: number;
  lastUpdate: string;
  kpi: string;
  kpiTarget: string;
  kpiActual: string;
}

interface ObjectiveExec {
  id: string;
  title: string;
  description: string;
  initiatives: InitiativeExec[];
}

const priorityColors = {
  alta: "bg-[hsl(var(--signal-critical))]",
  media: "bg-[hsl(var(--signal-positive))]",
  baja: "bg-[hsl(var(--signal-warning))]",
};

const PlanExecution = () => {
  const navigate = useNavigate();
  const handleLogout = () => navigate("/");

  const objectives = useMemo<ObjectiveExec[]>(() => {
    try {
      const raw = localStorage.getItem("tp_work_plan");
      if (raw) {
        const plan = JSON.parse(raw);
        return (plan.objectives || []).map((o: any, oi: number) => ({
          id: o.id || `obj-${oi}`,
          title: o.title || `Objetivo ${oi + 1}`,
          description: o.description || "",
          initiatives: (o.initiatives || []).map((init: any, ii: number) => ({
            id: init.id || `init-${oi}-${ii}`,
            title: init.title,
            role: init.assignedRole || "Auxiliar",
            priority: init.priority || "media",
            daysEstimated: parseInt(init.days) || 2,
            daysElapsed: Math.floor(Math.random() * (parseInt(init.days) || 2)) + 1,
            progress: Math.floor(Math.random() * 80) + 20,
            lastUpdate: "7 de abril",
            kpi: init.kpi || "KPI",
            kpiTarget: init.target || "< 10%",
            kpiActual: `${(Math.random() * 12).toFixed(1)} %`,
          })),
        }));
      }
    } catch {}
    return [
      {
        id: "obj-1",
        title: "Reducir reprocesos en un 30%",
        description: "Estandarizar flujos de trabajo operativos para eliminar errores recurrentes.",
        initiatives: [
          { id: "i-1", title: "Revisar y aprobar flujos rediseñados", role: "Auxiliar", priority: "media" as const, daysEstimated: 2, daysElapsed: 2, progress: 100, lastUpdate: "7 de abril", kpi: "Tasa de reproceso", kpiTarget: "< 10%", kpiActual: "8 %" },
          { id: "i-2", title: "Reuniones 1:1 de calibración", role: "Auxiliar", priority: "alta" as const, daysEstimated: 5, daysElapsed: 3, progress: 60, lastUpdate: "7 de abril", kpi: "Tiempo de ciclo promedio", kpiTarget: "< 3 min.", kpiActual: "4.4 min" },
        ],
      },
    ];
  }, []);

  const totalInitiatives = objectives.reduce((s, o) => s + o.initiatives.length, 0);
  const completedInitiatives = objectives.reduce((s, o) => s + o.initiatives.filter(i => i.progress === 100).length, 0);
  const inProgressInitiatives = totalInitiatives - completedInitiatives;
  const totalProgress = totalInitiatives > 0 ? Math.round(objectives.reduce((s, o) => s + o.initiatives.reduce((a, i) => a + i.progress, 0), 0) / totalInitiatives) : 0;
  const remainingDays = objectives.reduce((s, o) => s + o.initiatives.reduce((a, i) => a + Math.max(0, i.daysEstimated - i.daysElapsed), 0), 0);

  const getProgressColor = (progress: number, daysElapsed: number, daysEstimated: number) => {
    if (progress === 100) return "bg-[hsl(var(--signal-positive))]";
    if (daysElapsed > daysEstimated) return "bg-[hsl(var(--signal-critical))]";
    if (daysElapsed >= daysEstimated * 0.8) return "bg-[hsl(var(--signal-warning))]";
    return "bg-[hsl(var(--signal-positive))]";
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--surface-sunken))]">
      <Sidebar userRole="leader" userName="Alex Thompson" onLogout={handleLogout} />
      <main className="ml-64 h-screen overflow-y-auto overflow-x-hidden">
        <div className="p-8 max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Ejecución del plan de trabajo{" "}
              <span className="text-[hsl(var(--signal-positive))]">a tiempo real</span>
            </h1>
            <p className="text-muted-foreground mt-1">Así avanza tu equipo en la ejecución del proceso</p>
          </div>

          {/* Summary metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">Progreso Total</p>
                <Tooltip>
                  <TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground/50" /></TooltipTrigger>
                  <TooltipContent><p className="text-xs">Porcentaje promedio de avance de todas las iniciativas</p></TooltipContent>
                </Tooltip>
              </div>
              <p className="text-3xl font-bold text-foreground">{totalProgress}%</p>
              <div className="mt-2 h-2 rounded-full bg-muted/30 overflow-hidden">
                <div className="h-full rounded-full bg-[hsl(var(--signal-positive))] transition-all" style={{ width: `${totalProgress}%` }} />
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">Tiempo restante</p>
                <Tooltip>
                  <TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground/50" /></TooltipTrigger>
                  <TooltipContent><p className="text-xs">Días restantes sumando todas las iniciativas pendientes</p></TooltipContent>
                </Tooltip>
              </div>
              <p className="text-3xl font-bold text-foreground">{remainingDays} <span className="text-base font-normal text-muted-foreground">días</span></p>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase mb-2">Tareas completadas</p>
              <p className="text-3xl font-bold text-foreground">{completedInitiatives} <span className="text-base font-normal text-muted-foreground">/ {totalInitiatives}</span></p>
              <div className="mt-2 h-2 rounded-full bg-muted/30 overflow-hidden">
                <div className="h-full rounded-full bg-[hsl(var(--signal-warning))]" style={{ width: `${totalInitiatives > 0 ? (completedInitiatives / totalInitiatives) * 100 : 0}%` }} />
              </div>
            </div>

            <div className="bg-card border border-border rounded-2xl p-5">
              <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase mb-2">En progreso</p>
              <p className="text-3xl font-bold text-foreground">{inProgressInitiatives} <span className="text-base font-normal text-muted-foreground">/ {totalInitiatives}</span></p>
              <div className="mt-2 h-2 rounded-full bg-muted/30 overflow-hidden">
                <div className="h-full rounded-full bg-[hsl(var(--signal-critical))]" style={{ width: `${totalInitiatives > 0 ? (inProgressInitiatives / totalInitiatives) * 100 : 0}%` }} />
              </div>
            </div>
          </div>

          {/* Objectives */}
          {objectives.map((obj, objIdx) => (
            <section key={obj.id} className="bg-card border border-border rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-border/40">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[hsl(var(--signal-positive)/0.08)] flex items-center justify-center shrink-0">
                    <Target className="w-5 h-5 text-[hsl(var(--signal-positive))]" />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-[0.15em] text-[hsl(var(--signal-positive))] uppercase mb-0.5">
                      OBJ · Objetivo estratégico {objIdx + 1}
                    </p>
                    <h2 className="text-lg font-bold text-foreground">{obj.title}</h2>
                    <p className="text-sm text-muted-foreground mt-0.5">{obj.description}</p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-3 border-b border-border/40">
                <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground/60 uppercase">Iniciativas tácticas</p>
              </div>

              <div className="divide-y divide-border/40">
                {obj.initiatives.map((init) => {
                  const progressColor = getProgressColor(init.progress, init.daysElapsed, init.daysEstimated);
                  const isComplete = init.progress === 100;
                  const isOverdue = init.daysElapsed > init.daysEstimated;
                  const kpiMet = !init.kpiActual.includes("4.4");

                  return (
                    <div key={init.id} className="p-6">
                      <div className="flex items-start justify-between gap-6 flex-wrap">
                        {/* Left: initiative info */}
                        <div className="flex-1 min-w-[200px] space-y-3">
                          <h4 className="text-base font-semibold text-foreground">{init.title}</h4>
                          <div className="flex flex-wrap gap-2">
                            <span className="inline-flex items-center text-xs font-medium text-muted-foreground border border-border/60 rounded-lg px-3 py-1.5">{init.role}</span>
                            <span className="inline-flex items-center gap-1.5 text-xs font-medium text-muted-foreground border border-border/60 rounded-lg px-3 py-1.5">
                              <span className={`w-2 h-2 rounded-full ${priorityColors[init.priority]}`} />
                              {init.priority.charAt(0).toUpperCase() + init.priority.slice(1)}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            {isComplete ? (
                              <CheckCircle2 className="w-4 h-4 text-[hsl(var(--signal-positive))]" />
                            ) : isOverdue ? (
                              <AlertTriangle className="w-4 h-4 text-[hsl(var(--signal-warning))]" />
                            ) : null}
                            <span className="text-sm font-medium text-foreground">Progreso: {init.progress}%</span>
                          </div>
                          <div className="h-2 rounded-full bg-muted/30 overflow-hidden">
                            <div className={`h-full rounded-full ${progressColor} transition-all`} style={{ width: `${init.progress}%` }} />
                          </div>
                        </div>

                        {/* Center: time tracking */}
                        <div className="space-y-2 min-w-[180px]">
                          <p className="text-xs text-muted-foreground">Última actualización: {init.lastUpdate}</p>
                          <div className="flex items-center gap-2 text-sm">
                            <Clock className="w-3.5 h-3.5 text-muted-foreground/50" />
                            <span className="text-foreground font-medium">Tiempo transcurrido</span>
                            <span className="text-muted-foreground">{init.daysElapsed} días</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-muted-foreground ml-5">Tiempo previsto.</span>
                            <span className="text-muted-foreground">{init.daysEstimated} días</span>
                          </div>
                        </div>

                        {/* Right: KPI */}
                        <div className="space-y-2 min-w-[180px]">
                          <p className="text-xs font-semibold text-foreground">¿Cuál fue la última actualización?</p>
                          <div className="space-y-1">
                            <p className="text-[10px] font-bold tracking-[0.1em] text-muted-foreground uppercase">KPI</p>
                            <p className="text-sm font-medium text-foreground">{init.kpi}</p>
                          </div>
                          <div className="flex items-center gap-3 text-sm">
                            <span className="text-muted-foreground">Meta {init.kpiTarget}</span>
                            <span className={`font-bold ${kpiMet ? "text-[hsl(var(--signal-positive))]" : "text-[hsl(var(--signal-critical))]"}`}>
                              {init.kpiActual}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          {/* Execution insight */}
          <div
            className="rounded-2xl p-6 text-center"
            style={{ background: "linear-gradient(135deg, hsl(152,76%,40%), hsl(200,80%,55%), hsl(217,91%,60%))" }}
          >
            <p className="text-base font-bold text-white mb-1">Insight de Ejecución:</p>
            <p className="text-sm text-white/90">
              El equipo avanza según lo esperado, pero algunos indicadores no alcanzan la meta definida.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default PlanExecution;

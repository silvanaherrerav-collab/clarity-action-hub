import { useState, useMemo } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { useNavigate } from "react-router-dom";
import {
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  ChevronRight,
  Sparkles,
  Info,
  Users,
} from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import SelfAssessmentModal from "@/components/SelfAssessmentModal";

const LeaderDashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => navigate("/");
  const [showAssessment, setShowAssessment] = useState(false);

  const culturalResults = useMemo(() => {
    try {
      const raw = localStorage.getItem("tp_cultural_results");
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  }, []);

  const initialScore = culturalResults?.overallScore ?? null;
  const currentScore = initialScore ? Math.min(initialScore + 4, 100) : null;

  const taskStats = useMemo(() => {
    try {
      const raw = localStorage.getItem("tp_work_plan");
      if (raw) {
        const plan = JSON.parse(raw);
        const total = plan.objectives?.reduce((s: number, o: any) => s + (o.initiatives?.length || 0), 0) || 0;
        return { total, completed: 0, pending: total };
      }
    } catch {}
    return { total: 0, completed: 0, pending: 0 };
  }, []);

  const lastInsight = useMemo(() => {
    try {
      const checkins = JSON.parse(localStorage.getItem("tp_checkins") || "[]");
      if (checkins.length > 0) {
        const last = checkins[checkins.length - 1];
        if (last.clarityResponse === "No" || last.blockageResponse?.includes("crítico")) {
          return "Algunos miembros del equipo reportan falta de claridad o bloqueos críticos. Considera agendar una reunión de alineación.";
        }
        return "El equipo reporta buena claridad en sus prioridades. Mantén el ritmo actual.";
      }
    } catch {}
    return null;
  }, []);

  const processName = getProcessName();

  return (
    <div className="min-h-screen bg-[hsl(var(--surface-sunken))]">
      <Sidebar userRole="leader" userName="Alex Thompson" onLogout={handleLogout} />

      <main className="ml-64 h-screen overflow-y-auto overflow-x-hidden">
        <div className="p-8 max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.15em] text-[hsl(var(--signal-positive))] uppercase mb-1">Centro de ejecución</p>
            <h1 className="text-2xl font-bold text-foreground">Proceso de {processName}</h1>
            <p className="text-muted-foreground mt-1">Seguimiento activo · Iniciado hoy</p>
          </div>

          {/* Metrics row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">Progreso General</p>
                <Tooltip>
                  <TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground/40" /></TooltipTrigger>
                  <TooltipContent><p className="text-xs max-w-[200px]">Porcentaje promedio de avance de todas las iniciativas del plan de trabajo activo.</p></TooltipContent>
                </Tooltip>
              </div>
              <p className="text-3xl font-bold text-[hsl(var(--signal-positive))]">40%</p>
              <p className="text-xs text-muted-foreground mt-1">2/5 actividades</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">Score Cultural</p>
                <Tooltip>
                  <TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground/40" /></TooltipTrigger>
                  <TooltipContent><p className="text-xs max-w-[200px]">Puntuación agregada del diagnóstico cultural del equipo, basada en seguridad psicológica, claridad, confiabilidad, significado e impacto.</p></TooltipContent>
                </Tooltip>
              </div>
              <p className="text-3xl font-bold text-[hsl(var(--signal-positive))]">{initialScore ? `${Math.round(initialScore)}%` : "82%"}</p>
              <p className="text-xs text-muted-foreground mt-1">↑ +7 esta semana</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">KPI Operativo</p>
                <Tooltip>
                  <TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground/40" /></TooltipTrigger>
                  <TooltipContent><p className="text-xs max-w-[200px]">Indicador clave de rendimiento operativo del proceso. Meta definida en el plan de trabajo.</p></TooltipContent>
                </Tooltip>
              </div>
              <p className="text-3xl font-bold text-foreground">78%</p>
              <p className="text-xs text-muted-foreground mt-1">Meta: 90%</p>
            </div>
            <div className="bg-card border border-border rounded-2xl p-5">
              <div className="flex items-center justify-between mb-1">
                <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">Días Activos</p>
                <Tooltip>
                  <TooltipTrigger><Info className="w-3.5 h-3.5 text-muted-foreground/40" /></TooltipTrigger>
                  <TooltipContent><p className="text-xs max-w-[200px]">Días transcurridos desde que se inició el plan de trabajo.</p></TooltipContent>
                </Tooltip>
              </div>
              <p className="text-3xl font-bold text-[hsl(var(--signal-positive))]">1</p>
              <p className="text-xs text-muted-foreground mt-1">de 27 previstos</p>
            </div>
          </div>

          {/* Charts row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* KPI vs Culture chart placeholder */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">KPI vs Cultura Organizacional</h3>
                <p className="text-xs text-muted-foreground">Correlación semanal</p>
              </div>
              <div className="flex items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[hsl(var(--signal-positive))]" /> KPI Operativo</span>
                <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-[hsl(200,80%,55%)] border-dashed" style={{ borderBottom: "2px dashed hsl(200,80%,55%)" }} /> Score Cultural</span>
              </div>
              <div className="h-40 flex items-end justify-between gap-1 px-2">
                {["Lun", "Mar", "Mié", "Jue", "Vie", "Hoy"].map((day, i) => {
                  const kpiH = [55, 60, 58, 65, 70, 75][i];
                  const culH = [65, 68, 55, 60, 72, 78][i];
                  return (
                    <div key={day} className="flex-1 flex flex-col items-center gap-1">
                      <div className="w-full flex items-end justify-center gap-1 h-32">
                        <div className="w-3 rounded-t bg-[hsl(var(--signal-positive))]" style={{ height: `${kpiH}%` }} />
                        <div className="w-3 rounded-t bg-[hsl(200,80%,55%)] opacity-60" style={{ height: `${culH}%` }} />
                      </div>
                      <span className="text-[10px] text-muted-foreground">{day}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Time tracking */}
            <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div>
                <h3 className="text-base font-semibold text-foreground">Tiempo avanzado vs. previsto</h3>
                <p className="text-xs text-muted-foreground">Widget de estado de tareas</p>
              </div>
              <div className="space-y-3">
                {[
                  { label: "Revisar flujos", actual: "3.5h", total: "4h", pct: 87, color: "bg-[hsl(var(--signal-positive))]" },
                  { label: "Reuniones 1:1", actual: "2h", total: "4h", pct: 50, color: "bg-[hsl(200,80%,55%)]" },
                  { label: "Documentar", actual: "0h", total: "6h", pct: 0, color: "bg-muted" },
                  { label: "Mejoras flujo", actual: "0h", total: "8h", pct: 0, color: "bg-muted" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <span className="text-sm text-foreground w-28 truncate">{item.label}</span>
                    <div className="flex-1 h-2 rounded-full bg-muted/30 overflow-hidden">
                      <div className={`h-full rounded-full ${item.color} transition-all`} style={{ width: `${item.pct}%` }} />
                    </div>
                    <span className="text-xs text-muted-foreground w-16 text-right">{item.actual} / {item.total}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Self-assessment CTA */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-xl bg-[hsl(var(--signal-positive)/0.08)] flex items-center justify-center">
                <Users className="w-7 h-7 text-[hsl(var(--signal-positive))]" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-foreground">Diagnóstico del equipo — Evalúate como líder</h3>
                <p className="text-sm text-muted-foreground mt-1">
                  Queremos entender cómo estás viendo el funcionamiento de tu equipo hoy.<br />
                  Tu perspectiva nos ayudará a identificar qué está funcionando y qué se puede ajustar para mejorar los resultados.
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowAssessment(true)}
              className="w-full h-12 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.01]"
              style={{ background: "linear-gradient(135deg, hsl(152,76%,40%), hsl(200,80%,55%))" }}
            >
              Iniciar autoevaluación
            </button>
          </div>

          {/* Last Insight */}
          {lastInsight && (
            <div className="bg-card border border-border rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[hsl(var(--signal-warning))]" />
                <h2 className="text-base font-semibold text-foreground">Último insight</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{lastInsight}</p>
            </div>
          )}
        </div>
      </main>

      <SelfAssessmentModal open={showAssessment} onOpenChange={setShowAssessment} />
    </div>
  );
};

export default LeaderDashboard;

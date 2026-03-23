import { Sidebar } from "@/components/layout/Sidebar";
import { useNavigate } from "react-router-dom";
import {
  Target,
  TrendingUp,
  CheckCircle2,
  Clock,
  Shield,
  BarChart3,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

const LeaderDashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => navigate("/");

  // Load scores from localStorage
  const culturalResults = (() => {
    try {
      const raw = localStorage.getItem("tp_cultural_results");
      if (raw) return JSON.parse(raw);
    } catch {}
    return null;
  })();

  const initialScore = culturalResults?.overallScore ?? null;
  const currentScore = initialScore ? Math.min(initialScore + 4, 100) : null; // simulated evolution

  // Load task stats from work plan
  const taskStats = (() => {
    try {
      const raw = localStorage.getItem("tp_work_plan");
      if (raw) {
        const plan = JSON.parse(raw);
        const total = plan.objectives?.reduce((s: number, o: any) => s + (o.initiatives?.length || 0), 0) || 0;
        return { total, completed: 0, pending: total };
      }
    } catch {}
    return { total: 0, completed: 0, pending: 0 };
  })();

  // Load last insight
  const lastInsight = (() => {
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
  })();

  return (
    <div className="min-h-screen bg-[hsl(var(--surface-sunken))]">
      <Sidebar userRole="leader" userName="Alex Thompson" onLogout={handleLogout} />

      <main className="pl-64">
        <div className="p-8 max-w-5xl mx-auto space-y-8">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Dashboard</h1>
            <p className="text-muted-foreground mt-1">Resumen de tu proceso y equipo</p>
          </div>

          {/* Score Evolution + Task Status */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Score Card */}
            <div className="bg-card border border-border rounded-2xl p-6 card-shadow space-y-4">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-[hsl(var(--signal-positive))]" />
                <h2 className="text-base font-semibold text-foreground">Evolución del score</h2>
              </div>
              {initialScore !== null ? (
                <div className="space-y-4">
                  <div className="flex items-end gap-4">
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Baseline</p>
                      <p className="text-3xl font-bold text-muted-foreground">{Math.round(initialScore)}</p>
                    </div>
                    <ChevronRight className="w-5 h-5 text-muted-foreground mb-2" />
                    <div className="text-center">
                      <p className="text-xs text-muted-foreground mb-1">Actual</p>
                      <p className="text-3xl font-bold text-[hsl(var(--signal-positive))]">{Math.round(currentScore!)}</p>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Cultura del proceso: {Math.round(initialScore)} → {Math.round(currentScore!)}
                  </p>
                  <Progress value={currentScore!} className="h-2" />
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Aún no tienes un diagnóstico cultural. Inicia uno para ver tu evolución.
                  </p>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate("/leader/cultural-diagnosis")}
                  >
                    <Shield className="w-4 h-4 mr-2" />
                    Iniciar diagnóstico
                  </Button>
                </div>
              )}
            </div>

            {/* Task Status Card */}
            <div className="bg-card border border-border rounded-2xl p-6 card-shadow space-y-4">
              <div className="flex items-center gap-2">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="text-base font-semibold text-foreground">Estado de tareas</h2>
              </div>
              {taskStats.total > 0 ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[hsl(var(--signal-positive)/0.06)] rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-[hsl(var(--signal-positive))]">{taskStats.completed}</p>
                      <p className="text-xs text-muted-foreground mt-1">Completadas</p>
                    </div>
                    <div className="bg-[hsl(var(--signal-warning)/0.06)] rounded-xl p-4 text-center">
                      <p className="text-2xl font-bold text-[hsl(var(--signal-warning))]">{taskStats.pending}</p>
                      <p className="text-xs text-muted-foreground mt-1">Pendientes</p>
                    </div>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => navigate("/leader/plan-review")} className="w-full">
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Ver plan de trabajo
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Aún no tienes un plan de trabajo generado.
                  </p>
                  <Button size="sm" variant="outline" onClick={() => navigate("/leader/context")}>
                    Crear proceso
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Last Insight */}
          {lastInsight && (
            <div className="bg-card border border-border rounded-2xl p-6 card-shadow">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-[hsl(var(--signal-warning))]" />
                <h2 className="text-base font-semibold text-foreground">Último insight</h2>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">{lastInsight}</p>
            </div>
          )}

          {/* Acciones del equipo */}
          <div className="bg-card border border-border rounded-2xl p-6 card-shadow">
            <h2 className="text-base font-semibold text-foreground mb-4">Acciones del equipo</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Cultural Diagnosis */}
              <div className="border border-border rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center">
                    <Shield className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">Diagnóstico cultural del equipo</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Evalúa seguridad psicológica, claridad, confiabilidad, impacto, significado y liderazgo.
                </p>
                <div className="flex items-center gap-3">
                  <Button size="sm" onClick={() => navigate("/leader/cultural-diagnosis")}>
                    <Shield className="w-4 h-4 mr-2" />
                    Iniciar diagnóstico
                  </Button>
                  {localStorage.getItem("tp_cultural_completed_at") && (
                    <Button variant="ghost" size="sm" onClick={() => navigate("/leader/cultural-diagnosis")}>
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Ver resultados
                    </Button>
                  )}
                </div>
              </div>

              {/* Invite Team */}
              <div className="border border-border rounded-xl p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-[hsl(var(--signal-positive)/0.1)] rounded-xl flex items-center justify-center">
                    <Clock className="w-5 h-5 text-[hsl(var(--signal-positive))]" />
                  </div>
                  <h3 className="font-semibold text-foreground text-sm">Invitar al equipo</h3>
                </div>
                <p className="text-sm text-muted-foreground">
                  Comparte el enlace para que tu equipo revise sus tareas y participe en el check-in.
                </p>
                <Button size="sm" variant="outline" onClick={() => navigate("/leader/invite")}>
                  Invitar colaboradores
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeaderDashboard;

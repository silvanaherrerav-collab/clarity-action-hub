import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle2, Target, Clock, TrendingUp, Users, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { acceptAction, snoozeAction } from "@/lib/actionsStore";
import { trackEvent } from "@/lib/trackEvent";

/* ─── Types ─── */
interface Initiative {
  id: string;
  title: string;
  priority: "alta" | "media" | "baja";
  days: string;
  kpi: string;
  formula: string;
  target: string;
  assignedRole: string;
}

interface StrategicObjective {
  id: string;
  title: string;
  description: string;
  initiatives: Initiative[];
}

interface WorkPlanData {
  objectives: StrategicObjective[];
}

/* ─── Priority config ─── */
const priorityConfig = {
  alta: { label: "Alta", bg: "bg-[hsl(var(--signal-critical)/0.08)]", text: "text-[hsl(var(--signal-critical))]", dot: "bg-[hsl(var(--signal-critical))]" },
  media: { label: "Media", bg: "bg-[hsl(var(--signal-warning)/0.08)]", text: "text-[hsl(var(--signal-warning))]", dot: "bg-[hsl(var(--signal-warning))]" },
  baja: { label: "Baja", bg: "bg-[hsl(var(--signal-positive)/0.08)]", text: "text-[hsl(var(--signal-positive))]", dot: "bg-[hsl(var(--signal-positive))]" },
};

/* ─── Seed data builder ─── */
function buildDefaultPlan(): WorkPlanData {
  const saved = localStorage.getItem("tp_plan_data");
  if (saved) {
    try {
      const raw = JSON.parse(saved);
      // Adapt old format → new
      if (raw.objectives && Array.isArray(raw.objectives)) {
        const objectives: StrategicObjective[] = raw.objectives.map((o: any, oi: number) => ({
          id: `obj-${oi}`,
          title: o.title || `Objetivo ${oi + 1}`,
          description: o.description || "",
          initiatives: (raw.tasks || [])
            .filter((_: any, ti: number) => ti % raw.objectives.length === oi)
            .flatMap((t: any) =>
              (t.tasks || []).map((task: string, j: number) => ({
                id: `init-${oi}-${j}`,
                title: task,
                priority: "media" as const,
                days: "5",
                kpi: raw.kpis?.[j % (raw.kpis?.length || 1)]?.name || "",
                formula: "",
                target: raw.kpis?.[j % (raw.kpis?.length || 1)]?.target || "",
                assignedRole: t.role || "",
              }))
            ),
        }));
        if (objectives.length > 0) return { objectives };
      }
    } catch {}
  }

  // Demo fallback
  return {
    objectives: [
      {
        id: "obj-1",
        title: "Reducir el tiempo de ciclo del proceso en un 30%",
        description: "Optimizar las etapas críticas para acelerar la entrega y reducir cuellos de botella operativos.",
        initiatives: [
          { id: "i-1", title: "Mapear y eliminar pasos redundantes del flujo actual", priority: "alta", days: "10", kpi: "Tiempo de ciclo", formula: "Fecha fin - Fecha inicio", target: "≤ 5 días", assignedRole: "" },
          { id: "i-2", title: "Implementar checklist digital por etapa", priority: "media", days: "7", kpi: "Tasa de error por etapa", formula: "Errores / Total entregas × 100", target: "< 3%", assignedRole: "" },
          { id: "i-3", title: "Definir SLA internos entre roles", priority: "alta", days: "5", kpi: "Cumplimiento de SLA", formula: "Entregas a tiempo / Total × 100", target: "≥ 90%", assignedRole: "" },
        ],
      },
      {
        id: "obj-2",
        title: "Mejorar la claridad de responsabilidades del equipo",
        description: "Asegurar que cada miembro del equipo conozca su rol, entregables y criterios de éxito.",
        initiatives: [
          { id: "i-4", title: "Crear matriz RACI del proceso", priority: "alta", days: "3", kpi: "Roles documentados", formula: "Roles con RACI / Total roles", target: "100%", assignedRole: "" },
          { id: "i-5", title: "Sesión de alineación semanal con el equipo", priority: "baja", days: "1", kpi: "Asistencia a sesiones", formula: "Asistentes / Convocados × 100", target: "≥ 85%", assignedRole: "" },
        ],
      },
    ],
  };
}

const ACTION_ID = "one_on_one_calibration";

/* ─── Component ─── */
const PlanReview = () => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<WorkPlanData>(() => buildDefaultPlan());
  const [isReportMode, setIsReportMode] = useState(false);
  const [showPublishModal, setShowPublishModal] = useState(false);

  // Load roles from team setup
  const teamRoles = useMemo(() => {
    try {
      const saved = localStorage.getItem("tp_team_setup");
      if (saved) {
        const members = JSON.parse(saved);
        const roles = [...new Set(members.map((m: any) => m.role).filter(Boolean))] as string[];
        return roles;
      }
    } catch {}
    return ["Líder", "Analista", "Coordinador", "Auxiliar"];
  }, []);

  // Persist on change
  useEffect(() => {
    localStorage.setItem("tp_work_plan", JSON.stringify(plan));
  }, [plan]);

  const updateObjectiveTitle = (objId: string, title: string) => {
    setPlan(prev => ({
      objectives: prev.objectives.map(o => o.id === objId ? { ...o, title } : o),
    }));
  };

  const updateInitiative = (objId: string, initId: string, field: keyof Initiative, value: string) => {
    setPlan(prev => ({
      objectives: prev.objectives.map(o =>
        o.id === objId
          ? {
              ...o,
              initiatives: o.initiatives.map(i =>
                i.id === initId ? { ...i, [field]: value } : i
              ),
            }
          : o
      ),
    }));
  };

  const handleConfirm = () => {
    if (!isReportMode) {
      setIsReportMode(true);
    } else {
      setShowPublishModal(true);
    }
  };

  const handleAccept = () => {
    trackEvent("alert_accept", { actionId: ACTION_ID });
    acceptAction(ACTION_ID);
    setShowPublishModal(false);
    navigate("/leader/actions");
  };

  const handleSnooze = () => {
    trackEvent("alert_remind_later", { actionId: ACTION_ID });
    snoozeAction(ACTION_ID);
    setShowPublishModal(false);
  };

  const totalInitiatives = plan.objectives.reduce((s, o) => s + o.initiatives.length, 0);
  const highPriority = plan.objectives.reduce((s, o) => s + o.initiatives.filter(i => i.priority === "alta").length, 0);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="text-muted-foreground">
              <ArrowLeft className="w-4 h-4 mr-1" /> Volver
            </Button>
            <div className="h-5 w-px bg-border" />
            <div>
              <h1 className="text-lg font-semibold text-foreground">Plan de Trabajo</h1>
              <p className="text-xs text-muted-foreground">
                {plan.objectives.length} objetivos · {totalInitiatives} iniciativas
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {isReportMode && (
              <Button variant="outline" size="sm" onClick={() => setIsReportMode(false)}>
                Volver a editar
              </Button>
            )}
            <Button
              onClick={handleConfirm}
              size="sm"
              className="bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white shadow-md"
            >
              <CheckCircle2 className="w-4 h-4 mr-1" />
              {isReportMode ? "Publicar plan al equipo" : "Confirmar y finalizar plan"}
            </Button>
          </div>
        </div>
      </div>

      {/* Summary strip */}
      <div className="border-b border-border bg-[hsl(var(--surface-sunken))]">
        <div className="max-w-7xl mx-auto px-6 py-3 flex items-center gap-6">
          <div className="flex items-center gap-2 text-sm">
            <Target className="w-4 h-4 text-primary" />
            <span className="text-muted-foreground">Objetivos:</span>
            <span className="font-semibold text-foreground">{plan.objectives.length}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Sparkles className="w-4 h-4 text-[hsl(var(--signal-warning))]" />
            <span className="text-muted-foreground">Iniciativas:</span>
            <span className="font-semibold text-foreground">{totalInitiatives}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <TrendingUp className="w-4 h-4 text-[hsl(var(--signal-critical))]" />
            <span className="text-muted-foreground">Prioridad alta:</span>
            <span className="font-semibold text-foreground">{highPriority}</span>
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-10">
        {plan.objectives.map((obj, objIdx) => (
          <section key={obj.id} className="rounded-2xl border border-border bg-card shadow-md overflow-hidden">
            {/* Objective header */}
            <div className="p-6 pb-4 border-b border-border bg-[hsl(var(--surface-sunken))]">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Objetivo estratégico {objIdx + 1}
                  </p>
                  {isReportMode ? (
                    <h2 className="text-xl font-bold text-foreground leading-snug">{obj.title}</h2>
                  ) : (
                    <Textarea
                      value={obj.title}
                      onChange={(e) => updateObjectiveTitle(obj.id, e.target.value)}
                      className="text-xl font-bold text-foreground leading-snug resize-none border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[2rem]"
                      rows={1}
                    />
                  )}
                  {obj.description && (
                    <p className="text-sm text-muted-foreground mt-1">{obj.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Initiatives grid */}
            <div className="p-6">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4">
                Iniciativas tácticas
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {obj.initiatives.map((init) => (
                  <InitiativeCard
                    key={init.id}
                    initiative={init}
                    roles={teamRoles}
                    isReportMode={isReportMode}
                    onChange={(field, value) => updateInitiative(obj.id, init.id, field, value)}
                  />
                ))}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Publish modal */}
      <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold text-foreground">Acción recomendada</DialogTitle>
            <DialogDescription className="text-sm text-muted-foreground">
              Reunión 1:1 — Revisión del plan de trabajo
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <p className="text-sm text-muted-foreground leading-relaxed">
              Te sugerimos agendar una reunión 1:1 con cada miembro del equipo para calibrar el plan generado.
            </p>
            <ul className="space-y-2">
              {["Revisar plan por rol", "Ajustar fechas y dependencias", "Confirmar KPIs", "Alinear definición de \"hecho\""].map((item) => (
                <li key={item} className="flex items-start gap-2 text-sm text-foreground">
                  <span className="text-[hsl(var(--signal-positive))] mt-0.5 shrink-0">✓</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col gap-2 pt-2">
            <Button onClick={handleAccept} className="w-full bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white">
              Aceptar acción
            </Button>
            <Button variant="outline" onClick={handleSnooze} className="w-full">Recordarme después</Button>
            <Button variant="ghost" onClick={() => setShowPublishModal(false)} className="w-full text-muted-foreground">Cerrar</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ─── Initiative Card ─── */
interface InitiativeCardProps {
  initiative: Initiative;
  roles: string[];
  isReportMode: boolean;
  onChange: (field: keyof Initiative, value: string) => void;
}

const InitiativeCard = ({ initiative, roles, isReportMode, onChange }: InitiativeCardProps) => {
  const prio = priorityConfig[initiative.priority];

  if (isReportMode) {
    return (
      <div className="rounded-2xl border border-border bg-card p-5 space-y-3 shadow-sm">
        <div className="flex items-start justify-between gap-2">
          <h4 className="text-sm font-semibold text-foreground leading-snug flex-1">{initiative.title}</h4>
          <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${prio.bg} ${prio.text}`}>
            {prio.label}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
          <ReportField label="Días" value={`${initiative.days} días`} icon={<Clock className="w-3 h-3" />} />
          <ReportField label="Responsable" value={initiative.assignedRole || "Sin asignar"} icon={<Users className="w-3 h-3" />} />
          <ReportField label="KPI" value={initiative.kpi} />
          <ReportField label="Meta" value={initiative.target} />
          {initiative.formula && (
            <div className="col-span-2">
              <ReportField label="Fórmula" value={initiative.formula} />
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-[hsl(var(--surface-sunken))] p-5 space-y-4 hover:shadow-md transition-shadow">
      {/* Initiative title */}
      <Textarea
        value={initiative.title}
        onChange={(e) => onChange("title", e.target.value)}
        className="text-sm font-semibold text-foreground resize-none border-none bg-transparent p-0 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-[2.5rem]"
        rows={2}
      />

      <div className="grid grid-cols-2 gap-3">
        {/* Priority */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Prioridad</label>
          <Select value={initiative.priority} onValueChange={(v) => onChange("priority", v)}>
            <SelectTrigger className="h-9 text-xs bg-card border-border rounded-xl">
              <div className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${prio.dot}`} />
                <SelectValue />
              </div>
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(priorityConfig) as Array<keyof typeof priorityConfig>).map((key) => (
                <SelectItem key={key} value={key}>
                  <div className="flex items-center gap-1.5">
                    <span className={`w-2 h-2 rounded-full ${priorityConfig[key].dot}`} />
                    {priorityConfig[key].label}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Days */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Días</label>
          <Input
            value={initiative.days}
            onChange={(e) => onChange("days", e.target.value)}
            className="h-9 text-xs bg-card border-border rounded-xl"
            type="number"
            min="1"
          />
        </div>

        {/* KPI */}
        <div className="space-y-1 col-span-2">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Indicador clave (KPI)</label>
          <Input
            value={initiative.kpi}
            onChange={(e) => onChange("kpi", e.target.value)}
            className="h-9 text-xs bg-card border-border rounded-xl"
            placeholder="Ej. Tiempo de ciclo"
          />
        </div>

        {/* Formula */}
        <div className="space-y-1 col-span-2">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Fórmula</label>
          <Input
            value={initiative.formula}
            onChange={(e) => onChange("formula", e.target.value)}
            className="h-9 text-xs bg-card border-border rounded-xl"
            placeholder="Ej. Entregas a tiempo / Total × 100"
          />
        </div>

        {/* Target */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Meta</label>
          <Input
            value={initiative.target}
            onChange={(e) => onChange("target", e.target.value)}
            className="h-9 text-xs bg-card border-border rounded-xl"
            placeholder="≥ 90%"
          />
        </div>

        {/* Role selector */}
        <div className="space-y-1">
          <label className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">Responsable / Rol</label>
          <Select value={initiative.assignedRole} onValueChange={(v) => onChange("assignedRole", v)}>
            <SelectTrigger className="h-9 text-xs bg-card border-border rounded-xl">
              <SelectValue placeholder="Seleccionar rol" />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role} value={role}>
                  {role}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

/* ─── Report field helper ─── */
const ReportField = ({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) => (
  <div>
    <p className="text-muted-foreground font-medium mb-0.5 flex items-center gap-1">
      {icon} {label}
    </p>
    <p className="text-foreground font-semibold">{value || "—"}</p>
  </div>
);

export default PlanReview;

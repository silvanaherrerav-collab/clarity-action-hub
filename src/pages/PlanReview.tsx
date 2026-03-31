import { useState, useEffect, useMemo } from "react";
import { ArrowLeft, Sparkles, Users, Clock } from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { useNavigateWithTransition } from "@/hooks/useNavigateWithTransition";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
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

const priorityConfig = {
  alta: { label: "Alta", dot: "bg-[hsl(var(--signal-critical))]" },
  media: { label: "Media", dot: "bg-[hsl(var(--signal-positive))]" },
  baja: { label: "Baja", dot: "bg-[hsl(var(--signal-warning))]" },
};

function buildDefaultPlan(): WorkPlanData {
  const saved = localStorage.getItem("tp_plan_data");
  if (saved) {
    try {
      const raw = JSON.parse(saved);
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
                days: "2",
                kpi: raw.kpis?.[j % (raw.kpis?.length || 1)]?.name || "Tasa de reproceso",
                formula: "",
                target: raw.kpis?.[j % (raw.kpis?.length || 1)]?.target || "< 10 %",
                assignedRole: "",
              }))
            ),
        }));
        if (objectives.length > 0) return { objectives };
      }
    } catch {}
  }

  return {
    objectives: [
      {
        id: "obj-1",
        title: "Reducir reprocesos en un 30%",
        description: "Estandarizar flujos de trabajo operativos para eliminar errores recurrentes.",
        initiatives: [
          { id: "i-1", title: "Revisar y aprobar flujos rediseñados", priority: "media", days: "2", kpi: "Tasa de reproceso", formula: "Ej: Entregas a tiempo/ Total *100", target: "< 10 %", assignedRole: "Analista" },
          { id: "i-2", title: "Revisar y aprobar flujos rediseñados", priority: "media", days: "2", kpi: "Tasa de reproceso", formula: "Ej: Entregas a tiempo/ Total *100", target: "< 10 %", assignedRole: "Analista" },
        ],
      },
      {
        id: "obj-2",
        title: "Mejorar tiempos de entrega",
        description: "Optimizar dependencias entre roles para reducir cuellos de botella operativos.",
        initiatives: [
          { id: "i-3", title: "Revisar y aprobar flujos rediseñados", priority: "media", days: "2", kpi: "Tasa de reproceso", formula: "Ej: Entregas a tiempo/ Total *100", target: "< 10 %", assignedRole: "Analista" },
          { id: "i-4", title: "Revisar y aprobar flujos rediseñados", priority: "media", days: "2", kpi: "Tasa de reproceso", formula: "Ej: Entregas a tiempo/ Total *100", target: "< 10 %", assignedRole: "Analista" },
        ],
      },
    ],
  };
}

const ACTION_ID = "one_on_one_calibration";

const PlanReview = () => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<WorkPlanData>(() => buildDefaultPlan());
  const [showInsight, setShowInsight] = useState(false);
  const [sendingValidation, setSendingValidation] = useState(false);

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

  const processName = useMemo(() => {
    try {
      const saved = localStorage.getItem("tp_process_intake");
      if (saved) return JSON.parse(saved).processName || "Ventas";
    } catch {}
    return "Ventas";
  }, []);

  useEffect(() => {
    localStorage.setItem("tp_work_plan", JSON.stringify(plan));
  }, [plan]);

  const updateInitiative = (objId: string, initId: string, field: keyof Initiative, value: string) => {
    setPlan(prev => ({
      objectives: prev.objectives.map(o =>
        o.id === objId
          ? { ...o, initiatives: o.initiatives.map(i => i.id === initId ? { ...i, [field]: value } : i) }
          : o
      ),
    }));
  };

  const totalInitiatives = plan.objectives.reduce((s, o) => s + o.initiatives.length, 0);
  const totalDays = plan.objectives.reduce((s, o) => s + o.initiatives.reduce((d, i) => d + (parseInt(i.days) || 0), 0), 0);

  const handleSendValidation = () => {
    setSendingValidation(true);
    setTimeout(() => {
      setSendingValidation(false);
      setShowInsight(true);
    }, 400);
  };

  const handleAcceptAction = () => {
    trackEvent("alert_accept", { actionId: ACTION_ID });
    acceptAction(ACTION_ID);
    setShowInsight(false);
    navigate("/leader/plan-waiting");
  };

  const handleRemindLater = () => {
    trackEvent("alert_remind_later", { actionId: ACTION_ID });
    snoozeAction(ACTION_ID);
    setShowInsight(false);
  };

  const inputClass =
    "flex h-11 w-full rounded-xl border border-border/60 bg-white px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--signal-positive)/0.3)] focus:border-[hsl(var(--signal-positive))] transition-all";

  return (
    <div className="min-h-screen bg-[#f5f5f0] animate-fade-in">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#f5f5f0] border-b border-border/40">
        <div className="max-w-4xl mx-auto px-8 py-4 flex items-center justify-between">
          <span className="text-xs font-semibold tracking-[0.2em] text-foreground/60 uppercase">
            Talent Performance Lab
          </span>
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border/60 text-sm font-medium text-foreground hover:bg-foreground/5 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-8 py-10 space-y-10 pb-28">
        {/* AI badge + title */}
        <div className="space-y-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.1em] text-[hsl(var(--signal-positive))] uppercase bg-[hsl(var(--signal-positive)/0.08)] px-3 py-1.5 rounded-lg">
            <Sparkles className="w-3.5 h-3.5" />
            Generado con IA
          </span>

          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight">
            Tu plan de trabajo
          </h1>
          <p className="text-base text-muted-foreground">
            Revisa y ajusta lo que necesites antes de enviarlo a tu equipo.
          </p>

          {/* Chips */}
          <div className="flex flex-wrap gap-3">
            {[
              `${plan.objectives.length} objetivos`,
              `${totalInitiatives} Iniciativas`,
              `${totalDays} días estimados`,
              `Proceso: ${processName}`,
            ].map((chip) => (
              <span
                key={chip}
                className="inline-flex items-center gap-2 text-sm font-semibold text-foreground border border-border/60 rounded-full px-4 py-2"
              >
                <span className="w-2 h-2 rounded-full bg-[hsl(var(--signal-positive))]" />
                {chip}
              </span>
            ))}
          </div>
        </div>

        {/* Objectives */}
        {plan.objectives.map((obj, objIdx) => (
          <section key={obj.id} className="rounded-2xl border border-border/60 bg-white overflow-hidden">
            {/* Objective header */}
            <div className="p-6 pb-4">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[hsl(var(--signal-positive)/0.08)] flex items-center justify-center shrink-0 text-sm font-bold text-[hsl(var(--signal-positive))]">
                  {objIdx + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-bold tracking-[0.15em] text-[hsl(var(--signal-positive))] uppercase mb-1">
                    Objetivo estratégico {objIdx + 1}
                  </p>
                  <h2 className="text-xl font-bold text-foreground leading-snug">{obj.title}</h2>
                  {obj.description && (
                    <p className="text-sm text-muted-foreground mt-1">{obj.description}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Initiatives */}
            <div className="border-t border-border/40">
              <div className="px-6 py-3">
                <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground/60 uppercase">
                  Iniciativas tácticas
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 divide-x divide-border/40">
                {obj.initiatives.map((init) => (
                  <div key={init.id} className="p-6 space-y-4 border-t border-border/40">
                    <h4 className="text-base font-semibold text-foreground">{init.title}</h4>

                    {/* Priority + Days */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">Prioridad</label>
                        <Select value={init.priority} onValueChange={(v) => updateInitiative(obj.id, init.id, "priority", v)}>
                          <SelectTrigger className="h-11 text-sm bg-white border-border/60 rounded-xl">
                            <div className="flex items-center gap-2">
                              <span className={`w-2 h-2 rounded-full ${priorityConfig[init.priority].dot}`} />
                              <SelectValue />
                            </div>
                          </SelectTrigger>
                          <SelectContent>
                            {(Object.keys(priorityConfig) as Array<keyof typeof priorityConfig>).map((key) => (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  <span className={`w-2 h-2 rounded-full ${priorityConfig[key].dot}`} />
                                  {priorityConfig[key].label}
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">Días</label>
                        <Input
                          value={init.days}
                          onChange={(e) => updateInitiative(obj.id, init.id, "days", e.target.value)}
                          className="h-11 text-sm bg-white border-border/60 rounded-xl"
                          type="number"
                          min="1"
                        />
                      </div>
                    </div>

                    {/* KPI */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">Indicador clave (KPI)</label>
                      <Input
                        value={init.kpi}
                        onChange={(e) => updateInitiative(obj.id, init.id, "kpi", e.target.value)}
                        className="h-11 text-sm bg-white border-border/60 rounded-xl"
                        placeholder="Tasa de reproceso"
                      />
                    </div>

                    {/* Formula */}
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">Fórmula</label>
                      <Input
                        value={init.formula}
                        onChange={(e) => updateInitiative(obj.id, init.id, "formula", e.target.value)}
                        className="h-11 text-sm bg-white border-border/60 rounded-xl"
                        placeholder="Ej: Entregas a tiempo/ Total *100"
                      />
                    </div>

                    {/* Meta + Rol */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">Meta</label>
                        <Input
                          value={init.target}
                          onChange={(e) => updateInitiative(obj.id, init.id, "target", e.target.value)}
                          className="h-11 text-sm bg-white border-border/60 rounded-xl"
                          placeholder="< 10 %"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">Rol</label>
                        <Select value={init.assignedRole} onValueChange={(v) => updateInitiative(obj.id, init.id, "assignedRole", v)}>
                          <SelectTrigger className="h-11 text-sm bg-white border-border/60 rounded-xl">
                            <SelectValue placeholder="Seleccionar" />
                          </SelectTrigger>
                          <SelectContent>
                            {teamRoles.map((role) => (
                              <SelectItem key={role} value={role}>{role}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        ))}

        {/* Send for validation CTA */}
        <button
          onClick={handleSendValidation}
          disabled={sendingValidation}
          className="w-full rounded-2xl p-6 flex items-center gap-4 text-left transition-transform hover:scale-[1.01]"
          style={{ background: "linear-gradient(135deg, hsl(152,76%,40%), hsl(200,80%,55%))" }}
        >
          <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 2L11 13" />
              <path d="M22 2L15 22L11 13L2 9L22 2Z" />
            </svg>
          </div>
          <div>
            <p className="text-lg font-bold text-white">Enviar para validación</p>
            <p className="text-sm text-white/80">
              Este plan será revisado por{" "}
              <span className="font-semibold text-white">
                {(() => {
                  try {
                    const r = localStorage.getItem("tp_process_responsible");
                    if (r) return JSON.parse(r).responsible?.name || "María González";
                  } catch {}
                  return "María González";
                })()}
              </span>
              , la persona que ejecuta el proceso.
            </p>
          </div>
        </button>
      </div>

      {/* Insight modal */}
      <Dialog open={showInsight} onOpenChange={setShowInsight}>
        <DialogContent className="sm:max-w-md rounded-2xl p-0 overflow-hidden border-0">
          {/* Blue header banner */}
          <div className="bg-gradient-to-r from-[hsl(200,80%,55%)] to-[hsl(217,91%,60%)] px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-white" />
              <div>
                <p className="text-sm font-bold text-white">Acción de alto impacto detectada</p>
                <p className="text-xs text-white/80">Completar este insight mejora la efectividad del plan en un 40%</p>
              </div>
            </div>
            <button onClick={() => setShowInsight(false)} className="text-white/80 hover:text-white transition-colors text-lg font-bold w-8 h-8 flex items-center justify-center rounded-full bg-white/10">
              ×
            </button>
          </div>

          {/* Body */}
          <div className="px-6 py-6 space-y-5">
            <div className="text-center">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold tracking-[0.1em] text-foreground/60 uppercase border border-border/60 rounded-full px-3 py-1">
                <Sparkles className="w-3 h-3" />
                Insight de alto impacto
              </span>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-xl bg-[hsl(var(--signal-positive)/0.08)] flex items-center justify-center shrink-0">
                <Users className="w-5 h-5 text-[hsl(var(--signal-positive))]" />
              </div>
              <div>
                <p className="text-lg font-bold text-foreground">Reunión 1:1</p>
                <p className="text-base font-bold text-foreground">Validación del plan</p>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Te sugerimos revisar este plan con tu equipo para asegurar claridad y alineación en la ejecución.
            </p>

            {/* Checklist */}
            <div className="rounded-xl border border-border/60 divide-y divide-border/40">
              {["Revisar plan", "Ajustar fechas", "Confirmar KPIs"].map((item) => (
                <label key={item} className="flex items-center gap-3 px-4 py-3.5 cursor-pointer hover:bg-muted/30 transition-colors">
                  <div className="w-5 h-5 rounded-md border-2 border-border/60 shrink-0" />
                  <span className="text-sm text-foreground">{item}</span>
                </label>
              ))}
            </div>

            {/* Buttons */}
            <div className="space-y-2.5 pt-1">
              <button
                onClick={handleAcceptAction}
                className="w-full h-12 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.01]"
                style={{ background: "linear-gradient(135deg, hsl(152,76%,40%), hsl(152,76%,50%))" }}
              >
                Aceptar acción
              </button>
              <button
                onClick={handleRemindLater}
                className="w-full h-12 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.01]"
                style={{ background: "linear-gradient(135deg, hsl(152,76%,45%), hsl(200,80%,55%))" }}
              >
                Recordarme más tarde
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlanReview;

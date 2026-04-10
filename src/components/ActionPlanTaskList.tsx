import { useState, useEffect } from "react";
import { CheckCircle2, Circle, Settings2, Users, BarChart3, ChevronDown, ChevronUp } from "lucide-react";

type TaskStatus = "completada" | "en_progreso" | "pendiente";
type TaskCategory = "operativa" | "gestion" | "seguimiento";

interface ActionTask {
  id: string;
  title: string;
  category: TaskCategory;
  status: TaskStatus;
  assignedTo: string;
  progress?: number;
  deadline?: string;
  kpiLabel?: string;
  kpiValue?: number;
  kpiTarget?: number;
  kpiUnit?: string;
  note?: string;
  insight?: string;
  purpose?: string;
  factor?: string;
}

const categoryConfig: Record<TaskCategory, { label: string; color: string; bgColor: string; icon: React.ReactNode }> = {
  operativa: {
    label: "OPERATIVA",
    color: "text-[hsl(var(--signal-positive))]",
    bgColor: "bg-[hsl(var(--signal-positive)/0.08)]",
    icon: <Settings2 className="w-5 h-5 text-muted-foreground/60" />,
  },
  gestion: {
    label: "GESTIÓN",
    color: "text-[hsl(var(--signal-positive))]",
    bgColor: "bg-[hsl(var(--signal-positive)/0.08)]",
    icon: <Users className="w-5 h-5 text-muted-foreground/60" />,
  },
  seguimiento: {
    label: "SEGUIMIENTO",
    color: "text-[hsl(var(--signal-positive))]",
    bgColor: "bg-[hsl(var(--signal-positive)/0.08)]",
    icon: <BarChart3 className="w-5 h-5 text-muted-foreground/60" />,
  },
};

const statusConfig: Record<TaskStatus, { label: string; className: string }> = {
  completada: { label: "✓Completada", className: "text-[hsl(var(--signal-positive))]" },
  en_progreso: { label: "En progreso", className: "text-[hsl(217,91%,60%)] border border-[hsl(217,91%,60%/0.3)] rounded-md px-2" },
  pendiente: { label: "Pendiente", className: "text-muted-foreground" },
};

const mockTasks: ActionTask[] = [
  { id: "t1", title: "Revisar y aprobar flujos rediseñados", category: "operativa", status: "completada", assignedTo: "Tú", progress: 100, insight: "Se detectaron pasos redundantes en el flujo de ventas actual", purpose: "Eliminar reprocesos y reducir el tiempo de ciclo operativo", factor: "Claridad" },
  { id: "t2", title: "Documentar pasos del proceso actual", category: "operativa", status: "en_progreso", assignedTo: "Isabella Chacón Brito", progress: 55, insight: "No existe documentación formal del proceso — genera ambigüedad", purpose: "Crear una referencia clara para todo el equipo", factor: "Estructura" },
  { id: "t3", title: "Reunión 1:1 de calibración con María G.", category: "gestion", status: "pendiente", assignedTo: "Tú", deadline: "3 días restantes", insight: "Se identificó desalineación en expectativas de rol", purpose: "Alinear prioridades y resolver fricciones de ejecución", factor: "Alineación" },
  { id: "t4", title: "Conversación de feedback con David R.", category: "gestion", status: "pendiente", assignedTo: "David Ramírez", deadline: "3 días restantes", insight: "El equipo reportó baja seguridad psicológica en el diagnóstico", purpose: "Fortalecer la confianza y abrir espacio para retroalimentación", factor: "Seguridad Psicológica" },
  { id: "t5", title: "Validar KPI con equipo comercial", category: "seguimiento", status: "pendiente", assignedTo: "Tú", kpiLabel: "Tasa de reproceso", kpiValue: 7.2, kpiTarget: 10, kpiUnit: "%", deadline: "Vence en 7 días", insight: "La tasa de reproceso superó el umbral esperado la semana pasada", purpose: "Monitorear el impacto de los cambios operativos en resultados", factor: "Ejecución" },
];

const TASKS_STORAGE_KEY = "tp_action_plan_tasks";

function loadTasks(): ActionTask[] {
  try {
    const raw = localStorage.getItem(TASKS_STORAGE_KEY);
    if (raw) {
      const saved = JSON.parse(raw) as ActionTask[];
      // Merge saved state onto mock defaults (preserves new tasks added to mockTasks)
      return mockTasks.map((mock) => {
        const saved_task = saved.find((s) => s.id === mock.id);
        return saved_task ? { ...mock, status: saved_task.status, progress: saved_task.progress, note: saved_task.note, kpiValue: saved_task.kpiValue ?? mock.kpiValue, insight: saved_task.insight ?? mock.insight, purpose: saved_task.purpose ?? mock.purpose, factor: saved_task.factor ?? mock.factor } : mock;
      });
    }
  } catch {}
  return mockTasks;
}

function saveTasks(tasks: ActionTask[]) {
  localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
}

const sections: { key: TaskCategory; label: string }[] = [
  { key: "operativa", label: "OPERATIVAS" },
  { key: "gestion", label: "GESTIÓN" },
  { key: "seguimiento", label: "SEGUIMIENTO" },
];

interface ActionPlanTaskListProps {
  onProgressChange?: (completed: number, total: number) => void;
}

export const ActionPlanTaskList = ({ onProgressChange }: ActionPlanTaskListProps) => {
  const [tasks, setTasks] = useState<ActionTask[]>(() => loadTasks());

  useEffect(() => {
    const completed = tasks.filter(t => t.status === "completada").length;
    onProgressChange?.(completed, tasks.length);
  }, [tasks, onProgressChange]);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [statusDraft, setStatusDraft] = useState<TaskStatus | null>(null);
  const [noteDraft, setNoteDraft] = useState("");
  const [kpiDraft, setKpiDraft] = useState<number>(0);
  const [kpiNoteDraft, setKpiNoteDraft] = useState("");

  const toggleExpand = (taskId: string) => {
    if (expandedTask === taskId) {
      setExpandedTask(null);
      setStatusDraft(null);
      setNoteDraft("");
      setKpiDraft(0);
      setKpiNoteDraft("");
    } else {
      const task = tasks.find((t) => t.id === taskId);
      setExpandedTask(taskId);
      setStatusDraft(task?.status || "pendiente");
      setNoteDraft(task?.note || "");
      setKpiDraft(0);
      setKpiNoteDraft("");
    }
  };

  const handleSave = (taskId: string) => {
    if (statusDraft) {
      const updated = tasks.map((t) =>
        t.id === taskId
          ? { ...t, status: statusDraft, progress: statusDraft === "completada" ? 100 : statusDraft === "en_progreso" ? 50 : 0, note: noteDraft || t.note }
          : t
      );
      setTasks(updated);
      saveTasks(updated);
    }
    setExpandedTask(null);
    setStatusDraft(null);
    setNoteDraft("");
  };

  const handleSaveKpi = (taskId: string) => {
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, kpiValue: kpiDraft || t.kpiValue } : t
    );
    setTasks(updated);
    saveTasks(updated);
    setExpandedTask(null);
    setKpiDraft(0);
    setKpiNoteDraft("");
  };

  const getActionLabel = (task: ActionTask) => {
    if (task.status === "completada") return null;
    if (task.status === "en_progreso") return "¿Cómo va?";
    return "¿Lo hiciste?";
  };

  const getProgressBarColor = (task: ActionTask) => {
    if (task.status === "completada") return "bg-[hsl(var(--signal-positive))]";
    return "bg-[hsl(217,91%,60%)]";
  };

  return (
    <div className="space-y-8">
      {sections.map((section) => {
        const sectionTasks = tasks.filter((t) => t.category === section.key);
        if (sectionTasks.length === 0) return null;

        return (
          <div key={section.key}>
            {/* Section label with line */}
            <div className="flex items-center gap-3 mb-4">
              {section.key === "seguimiento" && <BarChart3 className="w-4 h-4 text-muted-foreground/60" />}
              <p className="text-xs font-bold tracking-[0.15em] text-muted-foreground uppercase whitespace-nowrap">
                {section.label}
              </p>
              <div className="flex-1 h-px bg-border/60" />
            </div>

            {/* Task cards */}
            <div className="space-y-3">
              {sectionTasks.map((task) => {
                const cat = categoryConfig[task.category];
                const status = statusConfig[task.status];
                const isExpanded = expandedTask === task.id;
                const actionLabel = getActionLabel(task);
                const isSeguimiento = task.category === "seguimiento";

                return (
                  <div
                    key={task.id}
                    className="rounded-2xl border border-border/60 bg-card overflow-hidden transition-all"
                  >
                    {/* Main row */}
                    <div className="flex items-center gap-4 px-5 py-4">
                      {task.status === "completada" ? (
                        <CheckCircle2 className="w-7 h-7 text-[hsl(var(--signal-positive))] shrink-0" />
                      ) : (
                        <Circle className="w-7 h-7 text-border shrink-0" />
                      )}

                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{task.title}</p>

                        {/* Contextual insight block */}
                        {(task.insight || task.purpose || task.factor) && (
                          <div className="mt-1.5 space-y-0.5">
                            {task.insight && (
                              <p className="text-[11px] text-muted-foreground leading-snug">{task.insight}</p>
                            )}
                            {task.purpose && (
                              <p className="text-[11px] text-muted-foreground/70 leading-snug italic">{task.purpose}</p>
                            )}
                            {task.factor && (
                              <span className="inline-block mt-1 text-[10px] font-semibold tracking-wide text-muted-foreground bg-muted/40 rounded px-2 py-0.5">
                                Factor: {task.factor}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                          <span className={`text-[10px] font-bold tracking-[0.1em] ${cat.color} ${cat.bgColor} px-2 py-0.5 rounded`}>
                            {cat.label}
                          </span>
                          <span className={`text-xs font-medium ${status.className}`}>
                            {status.label}
                          </span>
                          <span className="text-xs text-muted-foreground">{task.assignedTo}</span>
                          {task.deadline && (
                            <span className="text-xs text-muted-foreground">· {task.deadline}</span>
                          )}
                        </div>
                      </div>

                      {/* Progress bar for operativa */}
                      {!isSeguimiento && task.progress !== undefined && task.progress > 0 && (
                        <div className="flex items-center gap-2 shrink-0">
                          <div className="w-20 h-2 rounded-full bg-muted/30 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${getProgressBarColor(task)} transition-all`}
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* KPI badge for seguimiento */}
                      {isSeguimiento && task.kpiValue !== undefined && (
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="text-xs font-medium text-muted-foreground">{task.kpiValue}{task.kpiUnit} actual</span>
                          <div className="w-20 h-2 rounded-full bg-muted/30 overflow-hidden">
                            <div
                              className="h-full rounded-full bg-[hsl(217,91%,60%)] transition-all"
                              style={{ width: `${task.kpiTarget ? Math.min((task.kpiValue / task.kpiTarget) * 100, 100) : 0}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Action button */}
                      {!isSeguimiento && actionLabel && (
                        <button
                          onClick={() => toggleExpand(task.id)}
                          className="flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--signal-positive))] border border-[hsl(var(--signal-positive)/0.3)] rounded-xl px-4 py-2 hover:bg-[hsl(var(--signal-positive)/0.05)] transition-colors shrink-0"
                        >
                          {actionLabel}
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      )}

                      {isSeguimiento && task.status !== "completada" && (
                        <button
                          onClick={() => toggleExpand(task.id)}
                          className="flex items-center gap-1.5 text-sm font-medium text-foreground border border-border/60 rounded-xl px-4 py-2 hover:bg-muted/30 transition-colors shrink-0"
                        >
                          Reportar
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      )}
                    </div>

                    {/* Expanded: Default (operativa/gestion) */}
                    {isExpanded && !isSeguimiento && (
                      <div className="px-5 pb-5 pt-1 border-t border-border/40 space-y-5">
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-foreground">
                            {task.category === "gestion"
                              ? `¿Pudiste tener la ${task.title.toLowerCase().includes("reunión") ? "reunión 1:1 con María González" : "conversación"}?`
                              : "¿Cuál es el estado de esta acción?"}
                          </p>
                          <div className="flex gap-2">
                            {(["completada", "en_progreso", "pendiente"] as TaskStatus[]).map((s) => (
                              <button
                                key={s}
                                onClick={() => setStatusDraft(s)}
                                className={`px-4 py-2 rounded-xl text-sm font-medium border transition-colors ${
                                  statusDraft === s
                                    ? "border-foreground bg-foreground/5 text-foreground"
                                    : "border-border/60 text-muted-foreground hover:border-foreground/30"
                                }`}
                              >
                                {s === "en_progreso" ? "~ En progreso" : s === "completada" ? "Completada" : "Pendiente"}
                              </button>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-foreground">¿Cómo va esta acción?</p>
                          <textarea
                            value={noteDraft}
                            onChange={(e) => setNoteDraft(e.target.value)}
                            placeholder="Ej: El equipo tiene más claridad sobre las prioridades de esta semana..."
                            className="w-full rounded-xl border border-border/60 bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none h-20 focus:outline-none focus:ring-1 focus:ring-[hsl(var(--signal-positive))]"
                          />
                          <p className="text-xs text-muted-foreground">Tu respuesta alimenta los insights del equipo</p>
                        </div>

                        <div className="flex justify-end">
                          <button
                            onClick={() => handleSave(task.id)}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.01]"
                            style={{ background: "linear-gradient(135deg, hsl(152,76%,40%), hsl(152,76%,50%))" }}
                          >
                            Guardar y marcar hecho
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Expanded: Seguimiento (KPI tracking) */}
                    {isExpanded && isSeguimiento && (
                      <div className="px-5 pb-5 pt-1 border-t border-border/40 space-y-5">
                        {/* KPI input */}
                        <div className="space-y-3">
                          <p className="text-sm font-semibold text-foreground">
                            ¿Cuál es la tasa de reproceso actual esta semana?
                          </p>
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1.5">
                              <input
                                type="number"
                                value={kpiDraft}
                                onChange={(e) => setKpiDraft(parseFloat(e.target.value) || 0)}
                                className="w-20 h-12 rounded-xl border border-border/60 bg-card text-center text-lg font-semibold text-foreground focus:outline-none focus:ring-1 focus:ring-[hsl(var(--signal-positive))]"
                                min="0"
                                max="100"
                                step="0.1"
                              />
                              <span className="text-base font-medium text-muted-foreground">%</span>
                            </div>
                            <div className="flex-1 relative">
                              <input
                                type="range"
                                min="0"
                                max={task.kpiTarget ? task.kpiTarget * 2 : 20}
                                step="0.1"
                                value={kpiDraft}
                                onChange={(e) => setKpiDraft(parseFloat(e.target.value))}
                                className="w-full h-2 rounded-full appearance-none cursor-pointer accent-[hsl(217,91%,60%)]"
                                style={{
                                  background: `linear-gradient(to right, hsl(217,91%,60%) ${(kpiDraft / (task.kpiTarget ? task.kpiTarget * 2 : 20)) * 100}%, hsl(var(--muted)/0.3) ${(kpiDraft / (task.kpiTarget ? task.kpiTarget * 2 : 20)) * 100}%)`
                                }}
                              />
                            </div>
                            <span className="text-sm font-medium text-foreground whitespace-nowrap">
                              {task.kpiValue}{task.kpiUnit} hoy
                            </span>
                          </div>
                        </div>

                        {/* Explanation */}
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-foreground">¿Qué está impactando este número esta semana?</p>
                          <textarea
                            value={kpiNoteDraft}
                            onChange={(e) => setKpiNoteDraft(e.target.value)}
                            placeholder="Ej: Reducimos 2 pasos del proceso de validación — eso bajó los errores..."
                            className="w-full rounded-xl border border-border/60 bg-card p-4 text-sm text-foreground placeholder:text-muted-foreground/50 resize-none h-20 focus:outline-none focus:ring-1 focus:ring-[hsl(var(--signal-positive))]"
                          />
                          <p className="text-xs text-muted-foreground">El KPI se actualiza en el dashboard del líder</p>
                        </div>

                        {/* Save CTA */}
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleSaveKpi(task.id)}
                            className="px-6 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:scale-[1.01]"
                            style={{ background: "linear-gradient(135deg, hsl(152,76%,40%), hsl(152,76%,50%))" }}
                          >
                            Registrar medición
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};

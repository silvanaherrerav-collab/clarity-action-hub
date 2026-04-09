import { useState } from "react";
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
  { id: "t1", title: "Revisar y aprobar flujos rediseñados", category: "operativa", status: "completada", assignedTo: "Tú", progress: 100 },
  { id: "t2", title: "Documentar pasos del proceso actual", category: "operativa", status: "en_progreso", assignedTo: "Isabella Chacón Brito", progress: 55 },
  { id: "t3", title: "Reunión 1:1 de calibración con María G.", category: "gestion", status: "pendiente", assignedTo: "Tú" },
  { id: "t4", title: "Conversación de feedback con David R.", category: "gestion", status: "pendiente", assignedTo: "David Ramírez" },
  { id: "t5", title: "Validar KPI con equipo comercial", category: "seguimiento", status: "pendiente", assignedTo: "Tú", progress: 72 },
];

const sections: { key: TaskCategory; label: string }[] = [
  { key: "operativa", label: "OPERATIVAS" },
  { key: "gestion", label: "GESTIÓN" },
  { key: "seguimiento", label: "SEGUIMIENTO" },
];

export const ActionPlanTaskList = () => {
  const [tasks, setTasks] = useState<ActionTask[]>(mockTasks);
  const [expandedTask, setExpandedTask] = useState<string | null>(null);
  const [statusDraft, setStatusDraft] = useState<TaskStatus | null>(null);
  const [noteDraft, setNoteDraft] = useState("");

  const toggleExpand = (taskId: string) => {
    if (expandedTask === taskId) {
      setExpandedTask(null);
      setStatusDraft(null);
      setNoteDraft("");
    } else {
      const task = tasks.find((t) => t.id === taskId);
      setExpandedTask(taskId);
      setStatusDraft(task?.status || "pendiente");
      setNoteDraft("");
    }
  };

  const handleSave = (taskId: string) => {
    if (statusDraft) {
      setTasks((prev) =>
        prev.map((t) =>
          t.id === taskId
            ? { ...t, status: statusDraft, progress: statusDraft === "completada" ? 100 : statusDraft === "en_progreso" ? 50 : 0 }
            : t
        )
      );
    }
    setExpandedTask(null);
    setStatusDraft(null);
    setNoteDraft("");
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

                return (
                  <div
                    key={task.id}
                    className="rounded-2xl border border-border/60 bg-card overflow-hidden transition-all"
                  >
                    {/* Main row */}
                    <div className="flex items-center gap-4 px-5 py-4">
                      {/* Checkbox circle */}
                      {task.status === "completada" ? (
                        <CheckCircle2 className="w-7 h-7 text-[hsl(var(--signal-positive))] shrink-0" />
                      ) : (
                        <Circle className="w-7 h-7 text-border shrink-0" />
                      )}

                      {/* Icon */}
                      <div className={`w-9 h-9 rounded-lg ${cat.bgColor} flex items-center justify-center shrink-0`}>
                        {cat.icon}
                      </div>

                      {/* Content */}
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-foreground">{task.title}</p>
                        <div className="flex items-center gap-2 mt-1 flex-wrap">
                          <span className={`text-[10px] font-bold tracking-[0.1em] ${cat.color} ${cat.bgColor} px-2 py-0.5 rounded`}>
                            {cat.label}
                          </span>
                          <span className={`text-xs font-medium ${status.className}`}>
                            {status.label}
                          </span>
                          <span className="text-xs text-muted-foreground">{task.assignedTo}</span>
                        </div>
                      </div>

                      {/* Progress bar (if applicable) */}
                      {task.progress !== undefined && task.progress > 0 && (
                        <div className="flex items-center gap-2 shrink-0">
                          {task.category === "seguimiento" && (
                            <span className="text-xs text-muted-foreground">{task.progress}% actual</span>
                          )}
                          <div className="w-20 h-2 rounded-full bg-muted/30 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${getProgressBarColor(task)} transition-all`}
                              style={{ width: `${task.progress}%` }}
                            />
                          </div>
                        </div>
                      )}

                      {/* Action button */}
                      {actionLabel && (
                        <button
                          onClick={() => toggleExpand(task.id)}
                          className="flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--signal-positive))] border border-[hsl(var(--signal-positive)/0.3)] rounded-xl px-4 py-2 hover:bg-[hsl(var(--signal-positive)/0.05)] transition-colors shrink-0"
                        >
                          {actionLabel}
                          {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                        </button>
                      )}

                      {task.category === "seguimiento" && task.status !== "completada" && (
                        <button
                          onClick={() => toggleExpand(task.id)}
                          className="text-sm font-medium text-foreground border border-border/60 rounded-xl px-4 py-2 hover:bg-muted/30 transition-colors shrink-0"
                        >
                          Reportar
                        </button>
                      )}
                    </div>

                    {/* Expanded section */}
                    {isExpanded && (
                      <div className="px-5 pb-5 pt-1 border-t border-border/40 space-y-5">
                        {/* Status question */}
                        <div className="space-y-2">
                          <p className="text-sm font-semibold text-foreground">
                            {task.category === "gestion"
                              ? `¿Pudiste tener la ${task.title.toLowerCase().includes("reunión") ? "reunión" : "conversación"}?`
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

                        {/* Note field */}
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

                        {/* Save CTA */}
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

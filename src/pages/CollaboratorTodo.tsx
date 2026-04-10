import { useState, useMemo, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";
import { getCollaboratorIdentity } from "@/lib/collaboratorIdentity";
import { loadTasks } from "@/components/ActionPlanTaskList";

type CheckInDimension = "claridad" | "dependencia" | "significado" | "impacto" | "seguridad";

interface CheckInQuestion {
  id: CheckInDimension;
  label: string;
  question: string;
  options: { label: string; value: string; needsInput?: boolean }[];
}

type TodoCategory = "operativa" | "gestion" | "seguimiento";
type TodoType = "task" | "question";

interface CollabTodoItem {
  id: string;
  title: string;
  description: string;
  category: TodoCategory;
  type: TodoType;
  completed: boolean;
}

const STORAGE_KEY = "tp_collab_todo_items";
const CHECKIN_KEY = "tp_collab_checkin";
const CUSTOM_TASKS_KEY = "tp_collab_custom_tasks";

const categoryConfig: Record<TodoCategory, { label: string; className: string }> = {
  operativa: { label: "Operativa", className: "text-foreground border border-border/60 bg-card" },
  gestion: { label: "Gestión", className: "text-[hsl(217,91%,60%)] border border-[hsl(217,91%,60%/0.3)] bg-[hsl(217,91%,60%/0.05)]" },
  seguimiento: { label: "Seguimiento", className: "text-[hsl(280,60%,55%)] border border-[hsl(280,60%,55%/0.3)] bg-[hsl(280,60%,55%/0.05)]" },
};

const checkInQuestions: CheckInQuestion[] = [
  {
    id: "claridad",
    label: "Claridad",
    question: "¿Tienes claridad sobre tus prioridades de hoy?",
    options: [
      { label: "Sí, totalmente", value: "clear" },
      { label: "Más o menos", value: "partial" },
      { label: "No tengo claro", value: "unclear", needsInput: true },
    ],
  },
  {
    id: "dependencia",
    label: "Dependencia",
    question: "¿Dependes de alguien para avanzar hoy?",
    options: [
      { label: "No, puedo avanzar solo/a", value: "independent" },
      { label: "Sí, pero está resuelto", value: "resolved" },
      { label: "Sí, estoy bloqueado/a", value: "blocked", needsInput: true },
    ],
  },
  {
    id: "significado",
    label: "Significado",
    question: "¿Sientes que tu trabajo de hoy aporta al objetivo del equipo?",
    options: [
      { label: "Sí, claramente", value: "meaningful" },
      { label: "No estoy seguro/a", value: "unsure" },
      { label: "No lo veo", value: "disconnected", needsInput: true },
    ],
  },
  {
    id: "impacto",
    label: "Impacto",
    question: "¿Cómo calificarías tu energía para ejecutar hoy?",
    options: [
      { label: "Alta", value: "high" },
      { label: "Normal", value: "normal" },
      { label: "Baja", value: "low", needsInput: true },
    ],
  },
  {
    id: "seguridad",
    label: "Seguridad psicológica",
    question: "¿Hay algo que te preocupa decir o que necesitas comunicar?",
    options: [
      { label: "Todo bien", value: "safe" },
      { label: "Hay algo, pero puedo manejarlo", value: "minor" },
      { label: "Sí, necesito hablarlo", value: "needs_attention", needsInput: true },
    ],
  },
];

function loadCollabTodos(): CollabTodoItem[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CollabTodoItem[];
  } catch {}
  // Derive from action plan tasks assigned to collaborator (owner === "mine")
  const planTasks = loadTasks();
  const collabTasks = planTasks
    .filter((t) => t.owner === "mine")
    .map((t) => ({
      id: t.id,
      title: t.title,
      description: t.subtitle || "",
      category: t.category as TodoCategory,
      type: "task" as TodoType,
      completed: t.status === "completada",
    }));
  return collabTasks;
}

function saveCollabTodos(items: CollabTodoItem[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

interface CheckInAnswer {
  dimensionId: string;
  value: string;
  note?: string;
  timestamp: string;
}

function loadCheckIn(): CheckInAnswer[] {
  try {
    const raw = localStorage.getItem(CHECKIN_KEY);
    if (raw) return JSON.parse(raw) as CheckInAnswer[];
  } catch {}
  return [];
}

function saveCheckIn(answers: CheckInAnswer[]) {
  localStorage.setItem(CHECKIN_KEY, JSON.stringify(answers));
}

function generateInsight(
  completedCount: number,
  totalCount: number,
  checkInAnswers: CheckInAnswer[]
): string {
  const completion = totalCount > 0 ? completedCount / totalCount : 0;
  const answerMap = new Map(checkInAnswers.map((a) => [a.dimensionId, a.value]));

  const hasBlocker = answerMap.get("dependencia") === "blocked";
  const lowClarity = answerMap.get("claridad") === "unclear";
  const lowEnergy = answerMap.get("impacto") === "low";
  const disconnected = answerMap.get("significado") === "disconnected";
  const needsAttention = answerMap.get("seguridad") === "needs_attention";

  if (hasBlocker) {
    return "Hay bloqueos reportados que pueden frenar el avance si no se resuelven pronto. Comunica esto a tu líder para desbloquear el progreso.";
  }
  if (lowClarity) {
    return "Se detecta falta de claridad en prioridades. Esto puede afectar la ejecución del día. Considera alinear con tu líder antes de avanzar.";
  }
  if (needsAttention) {
    return "Hay una señal importante de comunicación pendiente. Resolver esto puede mejorar tu bienestar y desempeño.";
  }
  if (lowEnergy && completion < 0.5) {
    return `Energía baja y avance limitado (${completedCount} de ${totalCount} tareas). Prioriza lo esencial y comunica si necesitas apoyo.`;
  }
  if (disconnected) {
    return "Hay una desconexión percibida entre tu trabajo y el objetivo del equipo. Revisar el propósito de las tareas puede ayudar.";
  }
  if (completion >= 0.8 && !hasBlocker && !lowClarity) {
    return `Buen avance. Se completaron ${completedCount} de ${totalCount} tareas y hay claridad en las prioridades. El equipo avanza con dirección.`;
  }
  if (completion >= 0.5) {
    return `Vas avanzando — ${completedCount} de ${totalCount} tareas completadas. Mantén el ritmo para cerrar el día con buen progreso.`;
  }
  if (checkInAnswers.length === 0 && completedCount === 0) {
    return "Completa tus tareas y el check-in del día para generar una señal que alimente el sistema de mejora continua.";
  }
  return `Se completaron ${completedCount} de ${totalCount} tareas. Completa el check-in para enriquecer la señal del equipo.`;
}

const CollaboratorTodo = () => {
  const navigate = useNavigate();
  const { fullName: collaboratorName } = getCollaboratorIdentity();
  const handleLogout = () => navigate("/");

  const [todos, setTodos] = useState<CollabTodoItem[]>(loadCollabTodos);
  const [checkInAnswers, setCheckInAnswers] = useState<CheckInAnswer[]>(loadCheckIn);
  const [expandedCheckIn, setExpandedCheckIn] = useState<string | null>(null);
  const [checkInNote, setCheckInNote] = useState("");

  // Custom task
  const [showAddInput, setShowAddInput] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskCategory, setNewTaskCategory] = useState<TodoCategory>("operativa");

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;

  useEffect(() => {
    saveCollabTodos(todos);
  }, [todos]);

  useEffect(() => {
    saveCheckIn(checkInAnswers);
  }, [checkInAnswers]);

  const toggleComplete = (id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleCheckInAnswer = (dimensionId: string, value: string, needsInput?: boolean) => {
    if (needsInput) {
      setExpandedCheckIn(dimensionId);
      setCheckInNote("");
      // Still save the value
      const updated = checkInAnswers.filter((a) => a.dimensionId !== dimensionId);
      updated.push({ dimensionId, value, timestamp: new Date().toISOString() });
      setCheckInAnswers(updated);
      return;
    }
    const updated = checkInAnswers.filter((a) => a.dimensionId !== dimensionId);
    updated.push({ dimensionId, value, timestamp: new Date().toISOString() });
    setCheckInAnswers(updated);
    setExpandedCheckIn(null);
  };

  const handleSaveCheckInNote = (dimensionId: string) => {
    const updated = checkInAnswers.map((a) =>
      a.dimensionId === dimensionId ? { ...a, note: checkInNote.trim() } : a
    );
    setCheckInAnswers(updated);
    setExpandedCheckIn(null);
    setCheckInNote("");
  };

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    setTodos((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        title: newTaskText.trim(),
        description: "",
        category: newTaskCategory,
        type: "task",
        completed: false,
      },
    ]);
    setNewTaskText("");
    setNewTaskCategory("operativa");
    setShowAddInput(false);
  };

  const dateLabel = useMemo(() => {
    const days = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
    const months = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
    const now = new Date();
    return `${days[now.getDay()]}, ${now.getDate()} DE ${months[now.getMonth()]}`;
  }, []);

  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const ringR = 20;
  const ringC = 2 * Math.PI * ringR;
  const ringOffset = ringC - (progressPct / 100) * ringC;

  const insight = generateInsight(completedCount, totalCount, checkInAnswers);

  return (
    <div className="min-h-screen bg-[hsl(var(--surface-sunken))]">
      <Sidebar userRole="collaborator" userName={collaboratorName} onLogout={handleLogout} />

      <main className="ml-64 h-screen overflow-y-auto overflow-x-hidden">
        <div className="p-8 max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-[hsl(var(--signal-positive))] uppercase mb-1">
              {dateLabel}
            </p>
            <h1 className="text-2xl font-bold text-foreground">Tu to-do de hoy</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Tareas del plan y check-in del día
            </p>
          </div>

          {/* Progress summary */}
          <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4">
            <div className="shrink-0">
              <svg width="56" height="56" viewBox="0 0 56 56">
                <circle cx="28" cy="28" r={ringR} fill="none" stroke="hsl(var(--muted)/0.3)" strokeWidth="4" />
                <circle
                  cx="28" cy="28" r={ringR}
                  fill="none"
                  stroke="hsl(152,76%,40%)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray={ringC}
                  strokeDashoffset={ringOffset}
                  transform="rotate(-90 28 28)"
                />
                <text x="28" y="32" textAnchor="middle" className="fill-foreground" fontSize="13" fontWeight="700">
                  {completedCount}/{totalCount}
                </text>
              </svg>
            </div>
            <div>
              <p className="text-base font-bold text-foreground">
                {completedCount === 0
                  ? "Empecemos"
                  : completedCount < totalCount / 2
                  ? "Vas avanzando"
                  : completedCount < totalCount
                  ? "Vas bien"
                  : "Todo al día"}{" "}
                — {completedCount} de {totalCount} completadas
              </p>
              <p className="text-sm text-muted-foreground">
                Completa tus tareas y el check-in para alimentar el sistema de mejora.
              </p>
            </div>
          </div>

          {/* Task list */}
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
              TAREAS DEL PLAN
            </p>
            <p className="text-xs text-muted-foreground">
              Hoy ·{" "}
              {(() => {
                const now = new Date();
                const months = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"];
                return `${now.getDate()} ${months[now.getMonth()]}`;
              })()}
            </p>
          </div>

          <div className="space-y-3">
            {todos.map((item) => {
              const cat = categoryConfig[item.category];
              return (
                <div
                  key={item.id}
                  className={`bg-card border border-border/60 rounded-2xl transition-all ${
                    item.completed ? "opacity-50" : ""
                  }`}
                >
                  <div className="px-5 py-4 flex items-start gap-4">
                    <button onClick={() => toggleComplete(item.id)} className="mt-0.5 shrink-0">
                      {item.completed ? (
                        <CheckCircle2 className="w-6 h-6 text-[hsl(var(--signal-positive))]" />
                      ) : (
                        <Circle className="w-6 h-6 text-border" />
                      )}
                    </button>
                    <div className="flex-1 min-w-0">
                      <p className={`text-sm font-semibold ${item.completed ? "line-through text-muted-foreground" : "text-foreground"}`}>
                        {item.title}
                      </p>
                      {item.description && (
                        <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                      )}
                    </div>
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-lg shrink-0 ${cat.className}`}>
                      {cat.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Custom task input */}
          {showAddInput && (
            <div className="bg-card border border-border/60 rounded-2xl px-5 py-4 space-y-3">
              <div className="flex items-start gap-4">
                <Circle className="w-6 h-6 text-border mt-0.5 shrink-0" />
                <input
                  type="text"
                  value={newTaskText}
                  onChange={(e) => setNewTaskText(e.target.value)}
                  placeholder="Escribe tu tarea…"
                  className="flex-1 text-sm font-semibold text-foreground bg-transparent outline-none placeholder:text-muted-foreground/50"
                  autoFocus
                />
              </div>
              <div className="ml-10 flex items-center gap-2 flex-wrap">
                {(Object.keys(categoryConfig) as TodoCategory[]).map((cat) => {
                  const cfg = categoryConfig[cat];
                  const isSelected = newTaskCategory === cat;
                  return (
                    <button
                      key={cat}
                      onClick={() => setNewTaskCategory(cat)}
                      className={`text-[11px] font-medium px-2.5 py-1 rounded-lg transition-all ${cfg.className} ${isSelected ? "ring-2 ring-offset-1 ring-foreground/20" : "opacity-60 hover:opacity-100"}`}
                    >
                      {cfg.label}
                    </button>
                  );
                })}
              </div>
              <div className="flex items-center gap-2 ml-10">
                <button
                  onClick={handleAddTask}
                  className="px-4 py-1.5 rounded-lg text-xs font-bold text-white"
                  style={{ background: "hsl(152,76%,40%)" }}
                >
                  Agregar
                </button>
                <button
                  onClick={() => { setShowAddInput(false); setNewTaskText(""); }}
                  className="px-4 py-1.5 rounded-lg text-xs font-medium text-muted-foreground border border-border/60 hover:bg-muted/30"
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}

          <button
            onClick={() => setShowAddInput(true)}
            className="w-full rounded-2xl border-2 border-dashed border-[hsl(var(--signal-positive)/0.3)] py-3.5 text-sm font-medium text-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.03)] transition-colors"
          >
            + Agregar tarea propia
          </button>

          {/* Daily check-in */}
          <div className="flex items-center justify-between mt-4">
            <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
              CHECK-IN DEL DÍA
            </p>
          </div>

          <div className="space-y-3">
            {checkInQuestions.map((q) => {
              const currentAnswer = checkInAnswers.find((a) => a.dimensionId === q.id);
              const isAnswered = !!currentAnswer;

              return (
                <div
                  key={q.id}
                  className={`bg-card border border-border/60 rounded-2xl transition-all ${isAnswered ? "opacity-70" : ""}`}
                >
                  <div className="px-5 py-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-semibold text-foreground">{q.question}</p>
                      <span className="text-[11px] font-medium px-2.5 py-1 rounded-lg text-[hsl(var(--signal-positive))] border border-[hsl(var(--signal-positive)/0.3)] bg-[hsl(var(--signal-positive)/0.05)]">
                        {q.label}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {q.options.map((opt) => {
                        const isSelected = currentAnswer?.value === opt.value;
                        return (
                          <button
                            key={opt.value}
                            onClick={() => handleCheckInAnswer(q.id, opt.value, opt.needsInput)}
                            className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-all ${
                              isSelected
                                ? "border-[hsl(var(--signal-positive))] bg-[hsl(var(--signal-positive)/0.1)] text-[hsl(var(--signal-positive))]"
                                : "border-border/60 text-muted-foreground hover:border-foreground/30 hover:text-foreground"
                            }`}
                          >
                            {opt.label}
                          </button>
                        );
                      })}
                    </div>
                    {/* Note input for options that need detail */}
                    {expandedCheckIn === q.id && (
                      <div className="space-y-2 pt-1">
                        <textarea
                          value={checkInNote}
                          onChange={(e) => setCheckInNote(e.target.value)}
                          placeholder="Cuéntanos más…"
                          rows={2}
                          className="w-full text-xs text-foreground bg-transparent border border-border/60 rounded-lg px-3 py-2 outline-none placeholder:text-muted-foreground/50 resize-none focus:border-[hsl(var(--signal-positive)/0.5)]"
                          autoFocus
                        />
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleSaveCheckInNote(q.id)}
                            className="px-4 py-1.5 rounded-lg text-xs font-bold text-white"
                            style={{ background: "hsl(152,76%,40%)" }}
                          >
                            Guardar
                          </button>
                          <button
                            onClick={() => { setExpandedCheckIn(null); setCheckInNote(""); }}
                            className="px-4 py-1.5 rounded-lg text-xs font-medium text-muted-foreground border border-border/60 hover:bg-muted/30"
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                    {/* Show saved note */}
                    {isAnswered && currentAnswer.note && expandedCheckIn !== q.id && (
                      <p className="text-xs text-muted-foreground italic">"{currentAnswer.note}"</p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Final insight */}
          <div className="bg-[hsl(220,20%,14%)] rounded-2xl p-6 space-y-2">
            <p className="text-[10px] font-bold tracking-[0.2em] text-[hsl(var(--signal-positive))] uppercase">
              Señal del equipo · Hoy
            </p>
            <p className="text-sm text-[hsl(220,20%,85%)] leading-relaxed">
              {insight}
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollaboratorTodo;

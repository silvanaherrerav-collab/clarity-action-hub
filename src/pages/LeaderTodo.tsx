import { useState, useMemo, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Circle, ArrowRight } from "lucide-react";

type TodoCategory = "proceso" | "equipo" | "estrategia" | "cultura";
type TodoType = "task" | "question";

interface TodoItem {
  id: string;
  title: string;
  description: string;
  category: TodoCategory;
  type: TodoType;
  completed: boolean;
}

const categoryConfig: Record<TodoCategory, { label: string; className: string }> = {
  proceso: { label: "Proceso", className: "text-foreground border border-border/60 bg-card" },
  equipo: { label: "Equipo", className: "text-[hsl(var(--signal-positive))] border border-[hsl(var(--signal-positive)/0.3)] bg-[hsl(var(--signal-positive)/0.05)]" },
  estrategia: { label: "Estrategia", className: "text-[hsl(217,91%,60%)] border border-[hsl(217,91%,60%/0.3)] bg-[hsl(217,91%,60%/0.05)]" },
  cultura: { label: "Cultura", className: "text-[hsl(280,60%,55%)] border border-[hsl(280,60%,55%/0.3)] bg-[hsl(280,60%,55%/0.05)]" },
};

const initialTodos: TodoItem[] = [
  { id: "t1", title: "Revisar los flujos de ventas rediseñados", description: "Valida que los pasos del proceso se ajusten a la realidad del equipo.", category: "proceso", type: "task", completed: true },
  { id: "t2", title: "¿Qué frenó o retrasó al equipo hoy?", description: "Registra cualquier obstáculo — se usará para ajustar el plan.", category: "equipo", type: "question", completed: false },
  { id: "t3", title: "Confirmar KPIs con María González", description: "Asegúrate de que los indicadores del plan estén alineados con su perspectiva.", category: "proceso", type: "task", completed: false },
  { id: "t4", title: "¿El equipo tiene claridad sobre la prioridad de esta semana?", description: "Reflexión rápida sobre alineación estratégica.", category: "estrategia", type: "question", completed: false },
  { id: "t5", title: "¿Hay algo que el equipo necesita de ti esta semana?", description: "Liderazgo activo — registra compromisos o pendientes hacia tu equipo.", category: "cultura", type: "question", completed: false },
];

const LeaderTodo = () => {
  const navigate = useNavigate();
  const handleLogout = () => navigate("/");

  const [todos, setTodos] = useState<TodoItem[]>(initialTodos);
  const [showAddInput, setShowAddInput] = useState(false);
  const [newTaskText, setNewTaskText] = useState("");

  const completedCount = todos.filter((t) => t.completed).length;
  const totalCount = todos.length;
  const pendingCount = totalCount - completedCount;

  // Persist pending count for sidebar badge
  useEffect(() => {
    localStorage.setItem("tp_todo_pending", String(pendingCount));
  }, [pendingCount]);

  const toggleComplete = (id: string) => {
    setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, completed: !t.completed } : t)));
  };

  const handleAddTask = () => {
    if (!newTaskText.trim()) return;
    setTodos((prev) => [
      ...prev,
      {
        id: `custom-${Date.now()}`,
        title: newTaskText.trim(),
        description: "",
        category: "proceso",
        type: "task",
        completed: false,
      },
    ]);
    setNewTaskText("");
    setShowAddInput(false);
  };

  // Dynamic date
  const dateLabel = useMemo(() => {
    const days = ["DOMINGO", "LUNES", "MARTES", "MIÉRCOLES", "JUEVES", "VIERNES", "SÁBADO"];
    const months = ["ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO", "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"];
    const now = new Date();
    return `${days[now.getDay()]}, ${now.getDate()} DE ${months[now.getMonth()]}`;
  }, []);

  // Progress ring
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;
  const ringR = 20;
  const ringC = 2 * Math.PI * ringR;
  const ringOffset = ringC - (progressPct / 100) * ringC;

  return (
    <div className="min-h-screen bg-[hsl(var(--surface-sunken))]">
      <Sidebar userRole="leader" userName="Alex Thompson" onLogout={handleLogout} />

      <main className="ml-64 h-screen overflow-y-auto overflow-x-hidden">
        <div className="p-8 max-w-4xl mx-auto space-y-6">
          {/* Header */}
          <div>
            <p className="text-[10px] font-bold tracking-[0.2em] text-[hsl(var(--signal-positive))] uppercase mb-1">
              {dateLabel}
            </p>
            <h1 className="text-2xl font-bold text-foreground">To-do del día</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Preguntas y tareas para mantener el proceso en movimiento
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
                {completedCount === 0 ? "Empecemos" : completedCount < totalCount / 2 ? "Vas avanzando" : completedCount < totalCount ? "Vas bien" : "Todo al día"} — {completedCount} de {totalCount} completadas
              </p>
              <p className="text-sm text-muted-foreground">
                Completa las preguntas del día para mantener el diagnóstico actualizado.
              </p>
            </div>
          </div>

          {/* Section label */}
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
              PREGUNTAS DEL PROCESO
            </p>
            <p className="text-xs text-muted-foreground">Hoy · {(() => { const now = new Date(); const months = ["ene","feb","mar","abr","may","jun","jul","ago","sep","oct","nov","dic"]; return `${now.getDate()} ${months[now.getMonth()]}`; })()}</p>
          </div>

          {/* Todo items */}
          <div className="space-y-3">
            {todos.map((item) => {
              const cat = categoryConfig[item.category];
              const isCompleted = item.completed;

              return (
                <div
                  key={item.id}
                  className={`bg-card border border-border/60 rounded-2xl px-5 py-4 flex items-start gap-4 transition-all ${
                    isCompleted ? "opacity-50" : ""
                  }`}
                >
                  {/* Checkbox */}
                  <button
                    onClick={() => toggleComplete(item.id)}
                    className="mt-0.5 shrink-0"
                  >
                    {isCompleted ? (
                      <CheckCircle2 className="w-6 h-6 text-[hsl(var(--signal-positive))]" />
                    ) : (
                      <Circle className="w-6 h-6 text-border" />
                    )}
                  </button>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-semibold ${isCompleted ? "line-through text-muted-foreground" : "text-foreground"}`}>
                      {item.title}
                    </p>
                    {item.description && (
                      <p className="text-xs text-muted-foreground mt-0.5">{item.description}</p>
                    )}
                  </div>

                  {/* Right side: tag + action */}
                  <div className="flex flex-col items-end gap-1.5 shrink-0">
                    <span className={`text-[11px] font-medium px-2.5 py-1 rounded-lg ${cat.className}`}>
                      {cat.label}
                    </span>
                    {item.type === "question" && !isCompleted && (
                      <button className="flex items-center gap-1 text-xs font-medium text-[hsl(var(--signal-positive))] hover:underline">
                        Responder <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
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
                  onKeyDown={(e) => e.key === "Enter" && handleAddTask()}
                  placeholder="Escribe tu tarea..."
                  className="flex-1 text-sm text-foreground bg-transparent outline-none placeholder:text-muted-foreground/50"
                  autoFocus
                />
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

          {/* Add task CTA */}
          <button
            onClick={() => setShowAddInput(true)}
            className="w-full rounded-2xl border-2 border-dashed border-[hsl(var(--signal-positive)/0.3)] py-3.5 text-sm font-medium text-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.03)] transition-colors"
          >
            + Agregar tarea propia
          </button>
        </div>
      </main>
    </div>
  );
};

export default LeaderTodo;

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Target,
  AlertTriangle,
  Clock,
  TrendingUp,
  Send,
  MessageSquareWarning,
  CheckCircle2,
  Sparkles,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

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

interface ChangeProposal {
  initiativeId: string;
  field: "priority" | "days" | "target";
  currentValue: string;
  proposedValue: string;
  reason: string;
}

/* ─── Priority config ─── */
const priorityConfig = {
  alta: {
    label: "Alta",
    bg: "bg-[hsl(var(--signal-critical)/0.08)]",
    text: "text-[hsl(var(--signal-critical))]",
    dot: "bg-[hsl(var(--signal-critical))]",
  },
  media: {
    label: "Media",
    bg: "bg-[hsl(var(--signal-warning)/0.08)]",
    text: "text-[hsl(var(--signal-warning))]",
    dot: "bg-[hsl(var(--signal-warning))]",
  },
  baja: {
    label: "Baja",
    bg: "bg-[hsl(var(--signal-positive)/0.08)]",
    text: "text-[hsl(var(--signal-positive))]",
    dot: "bg-[hsl(var(--signal-positive))]",
  },
};

/* ─── Load work plan ─── */
function loadWorkPlan(): WorkPlanData {
  const saved = localStorage.getItem("tp_work_plan");
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {}
  }
  // Demo fallback
  return {
    objectives: [
      {
        id: "obj-1",
        title: "Reducir el tiempo de ciclo del proceso en un 30%",
        description: "Optimizar las etapas críticas para acelerar la entrega.",
        initiatives: [
          { id: "i-1", title: "Mapear y eliminar pasos redundantes del flujo actual", priority: "alta", days: "10", kpi: "Tiempo de ciclo", formula: "Fecha fin - Fecha inicio", target: "≤ 5 días", assignedRole: "Analista de Procesos" },
          { id: "i-2", title: "Implementar checklist digital por etapa", priority: "media", days: "7", kpi: "Tasa de error por etapa", formula: "Errores / Total entregas × 100", target: "< 3%", assignedRole: "Coordinador de Calidad" },
          { id: "i-3", title: "Definir SLA internos entre roles", priority: "alta", days: "5", kpi: "Cumplimiento de SLA", formula: "Entregas a tiempo / Total × 100", target: "≥ 90%", assignedRole: "Analista de Procesos" },
        ],
      },
      {
        id: "obj-2",
        title: "Mejorar la claridad de responsabilidades del equipo",
        description: "Asegurar que cada miembro conozca su rol y entregables.",
        initiatives: [
          { id: "i-4", title: "Crear matriz RACI del proceso", priority: "alta", days: "3", kpi: "Roles documentados", formula: "Roles con RACI / Total roles", target: "100%", assignedRole: "Líder de Proyecto" },
          { id: "i-5", title: "Sesión de alineación semanal con el equipo", priority: "baja", days: "1", kpi: "Asistencia a sesiones", formula: "Asistentes / Convocados × 100", target: "≥ 85%", assignedRole: "Coordinador de Calidad" },
        ],
      },
    ],
  };
}

/* ─── Load team roles ─── */
function loadTeamRoles(): string[] {
  try {
    const raw = localStorage.getItem("tp_team_setup");
    if (raw) {
      const members = JSON.parse(raw);
      const roles = [...new Set(members.map((m: any) => m.role).filter(Boolean))] as string[];
      if (roles.length > 0) return roles;
    }
  } catch {}
  return ["Analista de Procesos", "Coordinador de Calidad", "Líder de Proyecto"];
}

/* ─── Extract unique areas (mock) ─── */
function loadAreas(): string[] {
  try {
    const raw = localStorage.getItem("tp_leader_context");
    if (raw) {
      const ctx = JSON.parse(raw);
      if (ctx.area) return [ctx.area];
    }
  } catch {}
  return ["Operaciones", "Calidad", "Logística"];
}

/* ─── Component ─── */
const CollaboratorTaskReview = () => {
  const navigate = useNavigate();
  const plan = useMemo(loadWorkPlan, []);
  const roles = useMemo(loadTeamRoles, []);
  const areas = useMemo(loadAreas, []);

  const [selectedArea, setSelectedArea] = useState("");
  const [selectedRole, setSelectedRole] = useState("");
  const [proposals, setProposals] = useState<ChangeProposal[]>([]);
  const [activeNegotiation, setActiveNegotiation] = useState<string | null>(null);
  const [draftProposal, setDraftProposal] = useState<Partial<ChangeProposal>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  const handleLogout = () => navigate("/");

  // Filter initiatives by selected role
  const filteredObjectives = useMemo(() => {
    if (!selectedRole) return [];
    return plan.objectives
      .map((obj) => ({
        ...obj,
        initiatives: obj.initiatives.filter(
          (init) => init.assignedRole.toLowerCase() === selectedRole.toLowerCase()
        ),
      }))
      .filter((obj) => obj.initiatives.length > 0);
  }, [plan, selectedRole]);

  const totalTasks = filteredObjectives.reduce((sum, o) => sum + o.initiatives.length, 0);

  // Find dependencies (simplified: if an initiative in the same objective has higher priority)
  const getDependency = (objId: string, init: Initiative): string | null => {
    const obj = plan.objectives.find((o) => o.id === objId);
    if (!obj) return null;
    const higherPriority = obj.initiatives.find(
      (i) =>
        i.id !== init.id &&
        i.priority === "alta" &&
        init.priority !== "alta" &&
        i.assignedRole !== init.assignedRole
    );
    return higherPriority ? `${higherPriority.assignedRole} — ${higherPriority.title}` : null;
  };

  const addProposal = (initId: string) => {
    if (!draftProposal.field || !draftProposal.proposedValue) return;
    const init = plan.objectives
      .flatMap((o) => o.initiatives)
      .find((i) => i.id === initId);
    if (!init) return;

    const currentVal =
      draftProposal.field === "priority"
        ? priorityConfig[init.priority].label
        : draftProposal.field === "days"
        ? init.days
        : init.target;

    setProposals((prev) => [
      ...prev.filter((p) => !(p.initiativeId === initId && p.field === draftProposal.field)),
      {
        initiativeId: initId,
        field: draftProposal.field!,
        currentValue: currentVal,
        proposedValue: draftProposal.proposedValue!,
        reason: draftProposal.reason || "",
      },
    ]);
    setActiveNegotiation(null);
    setDraftProposal({});
  };

  const getProposalsForInit = (initId: string) =>
    proposals.filter((p) => p.initiativeId === initId);

  const handleSubmit = () => {
    // Save proposals to localStorage for leader review
    const existing = JSON.parse(localStorage.getItem("tp_change_proposals") || "[]");
    const payload = {
      role: selectedRole,
      area: selectedArea,
      date: new Date().toISOString(),
      proposals,
    };
    localStorage.setItem("tp_change_proposals", JSON.stringify([...existing, payload]));
    setSubmitted(true);
    setShowConfirmDialog(false);
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar userRole="collaborator" userName="Colaborador" onLogout={handleLogout} />
        <main className="pl-64">
          <div className="flex items-center justify-center min-h-screen">
            <div className="text-center max-w-md space-y-6">
              <div className="w-20 h-20 rounded-full bg-[hsl(var(--signal-positive)/0.1)] flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-10 h-10 text-[hsl(var(--signal-positive))]" />
              </div>
              <h1 className="text-2xl font-semibold text-foreground">
                Revisión enviada con éxito
              </h1>
              <p className="text-muted-foreground">
                Tu líder recibirá tus comentarios y propuestas de ajuste. Te notificaremos cuando haya una respuesta.
              </p>
              <Button onClick={() => navigate("/collaborator")} className="mt-4">
                Volver al Dashboard
              </Button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole="collaborator" userName="Colaborador" onLogout={handleLogout} />

      <main className="pl-64">
        <div className="max-w-5xl mx-auto px-8 py-10 space-y-8">
          {/* ─── Header ─── */}
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                <ClipboardIcon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-semibold text-foreground">
                  Revisión de Tareas Asignadas
                </h1>
                <p className="text-sm text-muted-foreground">
                  Revisa las tareas que tu líder te asignó y propón ajustes si es necesario
                </p>
              </div>
            </div>
          </div>

          {/* ─── Context Selectors ─── */}
          <div className="bg-card border border-border rounded-2xl p-6 card-shadow space-y-5">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-4 h-4 text-primary" />
              <p className="text-sm font-medium text-foreground">Selecciona tu contexto</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Área</label>
                <Select value={selectedArea} onValueChange={setSelectedArea}>
                  <SelectTrigger className="rounded-xl bg-muted/40 border-border">
                    <SelectValue placeholder="Selecciona tu área" />
                  </SelectTrigger>
                  <SelectContent>
                    {areas.map((a) => (
                      <SelectItem key={a} value={a}>{a}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground">Rol</label>
                <Select
                  value={selectedRole}
                  onValueChange={setSelectedRole}
                  disabled={!selectedArea}
                >
                  <SelectTrigger className={cn("rounded-xl border-border", !selectedArea ? "opacity-50" : "bg-muted/40")}>
                    <SelectValue placeholder={!selectedArea ? "Primero selecciona un área" : "Selecciona tu rol"} />
                  </SelectTrigger>
                  <SelectContent>
                    {roles.map((r) => (
                      <SelectItem key={r} value={r}>{r}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedRole && (
              <div className="flex items-center gap-6 pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{filteredObjectives.length}</span> objetivo{filteredObjectives.length !== 1 ? "s" : ""}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-primary" />
                  <span className="text-sm text-muted-foreground">
                    <span className="font-semibold text-foreground">{totalTasks}</span> tarea{totalTasks !== 1 ? "s" : ""} asignada{totalTasks !== 1 ? "s" : ""}
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* ─── Empty State ─── */}
          {selectedRole && filteredObjectives.length === 0 && (
            <div className="text-center py-16 space-y-3">
              <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto">
                <Target className="w-7 h-7 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground">No se encontraron tareas asignadas a este rol.</p>
            </div>
          )}

          {/* ─── Task Cards by Objective ─── */}
          {filteredObjectives.map((obj) => (
            <section key={obj.id} className="space-y-4">
              {/* Objective header */}
              <div className="flex items-start gap-3">
                <div className="mt-1 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Target className="w-4 h-4 text-primary" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-foreground">{obj.title}</h2>
                  <p className="text-sm text-muted-foreground mt-0.5">{obj.description}</p>
                </div>
              </div>

              {/* Initiative cards grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-11">
                {obj.initiatives.map((init) => {
                  const dep = getDependency(obj.id, init);
                  const pc = priorityConfig[init.priority];
                  const initProposals = getProposalsForInit(init.id);

                  return (
                    <div
                      key={init.id}
                      className="bg-card border border-border rounded-2xl p-5 card-shadow hover:shadow-md transition-shadow space-y-4"
                    >
                      {/* Title */}
                      <div>
                        <h3 className="font-semibold text-foreground text-sm leading-snug">
                          {init.title}
                        </h3>
                      </div>

                      {/* Dependency warning */}
                      {dep && (
                        <div className="flex items-start gap-2 p-3 rounded-xl bg-[hsl(var(--signal-warning)/0.06)] border border-[hsl(var(--signal-warning)/0.2)]">
                          <AlertTriangle className="w-4 h-4 text-[hsl(var(--signal-warning))] mt-0.5 flex-shrink-0" />
                          <p className="text-xs text-[hsl(var(--signal-warning))]">
                            Esta tarea depende de: <span className="font-medium">{dep}</span>
                          </p>
                        </div>
                      )}

                      {/* Details grid */}
                      <div className="grid grid-cols-2 gap-3">
                        <DetailField label="Prioridad">
                          <span className={cn("inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full", pc.bg, pc.text)}>
                            <span className={cn("w-1.5 h-1.5 rounded-full", pc.dot)} />
                            {pc.label}
                          </span>
                        </DetailField>
                        <DetailField label="Días asignados">
                          <span className="text-sm font-medium text-foreground">{init.days} días</span>
                        </DetailField>
                        <DetailField label="Indicador (KPI)">
                          <span className="text-sm text-foreground">{init.kpi}</span>
                        </DetailField>
                        <DetailField label="Meta">
                          <span className="text-sm font-medium text-foreground">{init.target}</span>
                        </DetailField>
                        <div className="col-span-2">
                          <DetailField label="Fórmula">
                            <span className="text-sm text-foreground">{init.formula}</span>
                          </DetailField>
                        </div>
                      </div>

                      {/* Existing proposals */}
                      {initProposals.length > 0 && (
                        <div className="space-y-2 pt-2 border-t border-border">
                          <p className="text-xs font-medium text-primary">Propuestas de ajuste:</p>
                          {initProposals.map((p, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs bg-primary/5 border border-primary/20 rounded-lg px-3 py-2">
                              <span className="text-muted-foreground capitalize">{p.field}:</span>
                              <span className="line-through text-muted-foreground">{p.currentValue}</span>
                              <span className="text-primary">→</span>
                              <span className="font-medium text-primary">{p.proposedValue}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Negotiation trigger */}
                      {activeNegotiation === init.id ? (
                        <div className="space-y-3 pt-3 border-t border-border">
                          <p className="text-xs font-medium text-foreground flex items-center gap-1.5">
                            <MessageSquareWarning className="w-3.5 h-3.5 text-primary" />
                            Proponer un cambio
                          </p>
                          <Select
                            value={draftProposal.field || ""}
                            onValueChange={(v) =>
                              setDraftProposal((d) => ({ ...d, field: v as any }))
                            }
                          >
                            <SelectTrigger className="rounded-xl bg-primary/5 border-primary/20 text-sm">
                              <SelectValue placeholder="¿Qué quieres ajustar?" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="priority">Prioridad</SelectItem>
                              <SelectItem value="days">Días</SelectItem>
                              <SelectItem value="target">Meta</SelectItem>
                            </SelectContent>
                          </Select>
                          <Input
                            placeholder="Nuevo valor propuesto"
                            value={draftProposal.proposedValue || ""}
                            onChange={(e) =>
                              setDraftProposal((d) => ({
                                ...d,
                                proposedValue: e.target.value,
                              }))
                            }
                            className="rounded-xl bg-primary/5 border-primary/20"
                          />
                          <Textarea
                            placeholder="Razón del cambio (opcional)"
                            value={draftProposal.reason || ""}
                            onChange={(e) =>
                              setDraftProposal((d) => ({ ...d, reason: e.target.value }))
                            }
                            className="rounded-xl bg-primary/5 border-primary/20 min-h-[60px]"
                            rows={2}
                          />
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              onClick={() => addProposal(init.id)}
                              disabled={!draftProposal.field || !draftProposal.proposedValue}
                              className="rounded-xl"
                            >
                              Guardar propuesta
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                setActiveNegotiation(null);
                                setDraftProposal({});
                              }}
                              className="rounded-xl"
                            >
                              Cancelar
                            </Button>
                          </div>
                          <p className="text-[11px] text-muted-foreground italic">
                            Los cambios no son definitivos — se enviarán como propuesta al líder para su aprobación.
                          </p>
                        </div>
                      ) : (
                        <button
                          onClick={() => setActiveNegotiation(init.id)}
                          className="w-full text-left pt-3 border-t border-border group"
                        >
                          <span className="text-xs text-muted-foreground group-hover:text-primary transition-colors flex items-center gap-1.5">
                            <MessageSquareWarning className="w-3.5 h-3.5" />
                            ¿No estás de acuerdo con algo? Proponer cambios
                          </span>
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>
          ))}

          {/* ─── Submit Button ─── */}
          {selectedRole && filteredObjectives.length > 0 && (
            <div className="flex items-center justify-between pt-4 border-t border-border">
              <p className="text-sm text-muted-foreground">
                {proposals.length > 0 ? (
                  <>
                    <span className="font-medium text-primary">{proposals.length}</span> propuesta{proposals.length !== 1 ? "s" : ""} de ajuste pendiente{proposals.length !== 1 ? "s" : ""}
                  </>
                ) : (
                  "Sin propuestas de ajuste — todo conforme"
                )}
              </p>
              <Button
                onClick={() => setShowConfirmDialog(true)}
                className="rounded-xl gap-2"
                size="lg"
              >
                <Send className="w-4 h-4" />
                Enviar Revisión al Líder
              </Button>
            </div>
          )}
        </div>
      </main>

      {/* ─── Confirm Dialog ─── */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader>
            <DialogTitle>Confirmar envío</DialogTitle>
            <DialogDescription>
              {proposals.length > 0
                ? `Enviarás ${proposals.length} propuesta${proposals.length !== 1 ? "s" : ""} de ajuste a tu líder. Los cambios no se aplicarán hasta su aprobación.`
                : "Confirmarás que estás de acuerdo con todas las tareas asignadas."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} className="rounded-xl">
              Cancelar
            </Button>
            <Button onClick={handleSubmit} className="rounded-xl gap-2">
              <Send className="w-4 h-4" />
              Confirmar y Enviar
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

/* ─── Helpers ─── */
const DetailField = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="space-y-1">
    <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">{label}</p>
    {children}
  </div>
);

const ClipboardIcon = ({ className }: { className?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect width="8" height="4" x="8" y="2" rx="1" ry="1" />
    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
    <path d="M9 14h6" />
    <path d="M9 18h6" />
  </svg>
);

export default CollaboratorTaskReview;

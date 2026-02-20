import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  getActions,
  activateAction,
  updateActionChecklist,
  completeAction,
  getPulseAggregates,
  type RecommendedAction,
  type ChecklistItem,
} from "@/lib/actionsStore";
import { ChevronRight, ChevronDown, Users } from "lucide-react";

const LeaderActions = () => {
  const navigate = useNavigate();
  const [actions, setActions] = useState<RecommendedAction[]>([]);
  const [openChecklist, setOpenChecklist] = useState<string | null>(null);

  const reload = () => {
    const all = getActions().filter(
      (a) => a.status === "accepted" || a.status === "snoozed"
    );
    setActions(all);
  };

  useEffect(() => {
    reload();
  }, []);

  const handleActivate = (actionId: string) => {
    activateAction(actionId);
    reload();
  };

  const handleToggleChecklist = (actionId: string) => {
    setOpenChecklist(openChecklist === actionId ? null : actionId);
  };

  const handleChecklistChange = (
    action: RecommendedAction,
    itemId: string,
    done: boolean
  ) => {
    const updated = action.checklist.map((c) =>
      c.id === itemId ? { ...c, done } : c
    );
    updateActionChecklist(
      action.actionId,
      updated,
      action.evidenceNote,
      action.updatedPlanLink
    );
    reload();
  };

  const handleEvidenceChange = (
    action: RecommendedAction,
    field: "evidenceNote" | "updatedPlanLink",
    value: string
  ) => {
    const checklist = action.checklist;
    updateActionChecklist(
      action.actionId,
      checklist,
      field === "evidenceNote" ? value : action.evidenceNote,
      field === "updatedPlanLink" ? value : action.updatedPlanLink
    );
    reload();
  };

  const handleComplete = (actionId: string) => {
    completeAction(actionId);
    reload();
    setOpenChecklist(null);
  };

  const handleLogout = () => navigate("/");

  return (
    <div className="min-h-screen bg-background">
      <Sidebar userRole="leader" userName="Alex Thompson" onLogout={handleLogout} />

      <main className="pl-64">
        <div className="max-w-3xl mx-auto px-8 py-10 space-y-8">
          <div>
            <h1 className="text-2xl font-semibold text-foreground">Acciones recomendadas</h1>
            <p className="text-sm text-muted-foreground mt-1">
              Gestiona las acciones sugeridas por TP Lab para tu equipo.
            </p>
          </div>

          {actions.length === 0 && (
            <div className="bg-card border border-border rounded-xl p-8 text-center">
              <p className="text-muted-foreground text-sm">
                No hay acciones activas. Genera un plan de trabajo para ver acciones recomendadas.
              </p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigate("/leader/process-intake")}
              >
                Ir al proceso de claridad
              </Button>
            </div>
          )}

          {actions.map((action) => {
            const doneCount = action.checklist.filter((c) => c.done).length;
            const canComplete = doneCount >= 3;
            const isOpen = openChecklist === action.actionId;
            const pulses = getPulseAggregates(action.actionId);
            const hasPulses = pulses.yes + pulses.no + pulses.na > 0;

            return (
              <div
                key={action.actionId}
                className="bg-card border border-border rounded-xl overflow-hidden card-shadow"
              >
                {/* Card Header */}
                <div className="p-6 flex items-start justify-between gap-4">
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h2 className="text-base font-semibold text-foreground">
                        {action.title}
                      </h2>
                      {action.status === "accepted" && (
                        <Badge className="bg-primary/10 text-primary border-0 text-xs font-medium">
                          Aceptada
                        </Badge>
                      )}
                      {action.status === "snoozed" && (
                        <Badge variant="secondary" className="text-xs font-medium">
                          Pospuesta
                        </Badge>
                      )}
                    </div>
                    {action.status === "snoozed" && action.snoozeUntil && (
                      <p className="text-xs text-muted-foreground">
                        Recordatorio:{" "}
                        {new Date(action.snoozeUntil).toLocaleDateString("es-ES", {
                          day: "numeric",
                          month: "long",
                        })}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    {action.status === "snoozed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleActivate(action.actionId)}
                      >
                        Activar ahora
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleToggleChecklist(action.actionId)}
                      className="flex items-center gap-1"
                    >
                      Abrir checklist
                      {isOpen ? (
                        <ChevronDown className="w-4 h-4" />
                      ) : (
                        <ChevronRight className="w-4 h-4" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Checklist Panel */}
                {isOpen && (
                  <div className="border-t border-border px-6 py-5 space-y-5 bg-muted/30">
                    {/* Checklist items */}
                    <div className="space-y-3">
                      {action.checklist.map((item: ChecklistItem) => (
                        <label
                          key={item.id}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <Checkbox
                            checked={item.done}
                            onCheckedChange={(v) =>
                              handleChecklistChange(action, item.id, !!v)
                            }
                          />
                          <span
                            className={`text-sm ${
                              item.done
                                ? "line-through text-muted-foreground"
                                : "text-foreground"
                            }`}
                          >
                            {item.label}
                          </span>
                        </label>
                      ))}
                    </div>

                    <p className="text-xs text-muted-foreground">
                      {doneCount} de 4 completados
                      {!canComplete && " — Completa al menos 3 para marcar como realizada"}
                    </p>

                    {/* Evidence fields */}
                    <div className="space-y-3 pt-2 border-t border-border">
                      <p className="text-sm font-medium text-foreground">
                        Evidencia <span className="text-muted-foreground font-normal">(opcional)</span>
                      </p>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">
                          ¿Qué cambió en el plan después de las 1:1?
                        </label>
                        <Textarea
                          rows={2}
                          value={action.evidenceNote}
                          onChange={(e) =>
                            handleEvidenceChange(action, "evidenceNote", e.target.value)
                          }
                          placeholder="Describe los cambios realizados..."
                          className="text-sm"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-xs text-muted-foreground">
                          Link al plan actualizado
                        </label>
                        <Input
                          value={action.updatedPlanLink}
                          onChange={(e) =>
                            handleEvidenceChange(action, "updatedPlanLink", e.target.value)
                          }
                          placeholder="https://..."
                          className="text-sm"
                        />
                      </div>
                    </div>

                    <Button
                      onClick={() => handleComplete(action.actionId)}
                      disabled={!canComplete}
                      className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-40"
                    >
                      Marcar como completada
                    </Button>
                  </div>
                )}

                {/* Pulse aggregates */}
                <div className="border-t border-border px-6 py-4">
                  <div className="flex items-center gap-2 mb-3">
                    <Users className="w-4 h-4 text-muted-foreground" />
                    <span className="text-sm font-medium text-foreground">
                      Confirmación anónima del equipo
                    </span>
                  </div>
                  {hasPulses ? (
                    <div className="flex gap-6 text-sm">
                      <span className="text-foreground">
                        Sí:{" "}
                        <span className="font-semibold text-primary">{pulses.yes}</span>
                      </span>
                      <span className="text-foreground">
                        No:{" "}
                        <span className="font-semibold">{pulses.no}</span>
                      </span>
                      <span className="text-foreground">
                        Aún no:{" "}
                        <span className="font-semibold text-muted-foreground">
                          {pulses.na}
                        </span>
                      </span>
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">
                      Aún sin confirmaciones del equipo
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </main>
    </div>
  );
};

export default LeaderActions;

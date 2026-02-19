import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Edit2, Check, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

interface PlanData {
  objectives: { title: string; description: string }[];
  roadmap: { phase: string; action: string }[];
  tasks: { role: string; tasks: string[] }[];
  kpis: { name: string; target: string; current: string }[];
}

const defaultPlan: PlanData = {
  objectives: [],
  roadmap: [],
  tasks: [],
  kpis: [],
};

const PlanReview = () => {
  const navigate = useNavigate();
  const [plan, setPlan] = useState<PlanData>(defaultPlan);
  const [editing, setEditing] = useState<string | null>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [checklist, setChecklist] = useState([false, false, false, false]);

  useEffect(() => {
    const saved = localStorage.getItem("tp_plan_data");
    if (saved) {
      setPlan({ ...defaultPlan, ...JSON.parse(saved) });
    }
  }, []);

  const toggleCheck = (i: number) => {
    const c = [...checklist];
    c[i] = !c[i];
    setChecklist(c);
  };

  const handlePublish = () => {
    setShowPublishModal(true);
  };

  const handleMarkDone = () => {
    localStorage.setItem("tp_calibration_done", "true");
    setShowPublishModal(false);
    navigate("/leader");
  };

  const checklistItems = [
    "Revisar tareas por rol",
    "Ajustar fechas y dependencias",
    "Confirmar KPIs",
    "Alinear expectativas de 'hecho'",
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Plan de trabajo sugerido</h1>
          <div className="w-20" />
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-10 space-y-8">
        {/* Objectives */}
        <EditableSection title="Objetivos" editing={editing === "obj"} onToggleEdit={() => setEditing(editing === "obj" ? null : "obj")}>
          {plan.objectives.map((o, i) => (
            <div key={i} className="space-y-1">
              {editing === "obj" ? (
                <>
                  <Input value={o.title} onChange={(e) => {
                    const objs = [...plan.objectives];
                    objs[i] = { ...objs[i], title: e.target.value };
                    setPlan({ ...plan, objectives: objs });
                  }} className="h-10 font-medium" />
                  <Textarea value={o.description} onChange={(e) => {
                    const objs = [...plan.objectives];
                    objs[i] = { ...objs[i], description: e.target.value };
                    setPlan({ ...plan, objectives: objs });
                  }} rows={2} />
                </>
              ) : (
                <>
                  <p className="font-medium text-foreground">{o.title}</p>
                  <p className="text-sm text-muted-foreground">{o.description}</p>
                </>
              )}
            </div>
          ))}
        </EditableSection>

        {/* Roadmap */}
        <EditableSection title="Roadmap" editing={editing === "road"} onToggleEdit={() => setEditing(editing === "road" ? null : "road")}>
          {plan.roadmap.map((r, i) => (
            <div key={i} className="flex gap-4 items-start">
              {editing === "road" ? (
                <>
                  <Input value={r.phase} onChange={(e) => {
                    const rm = [...plan.roadmap];
                    rm[i] = { ...rm[i], phase: e.target.value };
                    setPlan({ ...plan, roadmap: rm });
                  }} className="h-10 w-32 shrink-0" />
                  <Input value={r.action} onChange={(e) => {
                    const rm = [...plan.roadmap];
                    rm[i] = { ...rm[i], action: e.target.value };
                    setPlan({ ...plan, roadmap: rm });
                  }} className="h-10 flex-1" />
                </>
              ) : (
                <>
                  <span className="text-sm font-medium text-[hsl(var(--signal-positive))] w-32 shrink-0">{r.phase}</span>
                  <p className="text-sm text-foreground">{r.action}</p>
                </>
              )}
            </div>
          ))}
        </EditableSection>

        {/* Tasks by Role */}
        <EditableSection title="Tareas por rol" editing={editing === "tasks"} onToggleEdit={() => setEditing(editing === "tasks" ? null : "tasks")}>
          {plan.tasks.map((t, i) => (
            <div key={i} className="space-y-2">
              {editing === "tasks" ? (
                <Input value={t.role} onChange={(e) => {
                  const ts = [...plan.tasks];
                  ts[i] = { ...ts[i], role: e.target.value };
                  setPlan({ ...plan, tasks: ts });
                }} className="h-10 font-medium" />
              ) : (
                <p className="font-medium text-foreground">{t.role}</p>
              )}
              <ul className="space-y-1 pl-4">
                {t.tasks.map((task, j) => (
                  <li key={j} className="text-sm text-muted-foreground flex items-start gap-2">
                    {editing === "tasks" ? (
                      <Input value={task} onChange={(e) => {
                        const ts = [...plan.tasks];
                        const newTasks = [...ts[i].tasks];
                        newTasks[j] = e.target.value;
                        ts[i] = { ...ts[i], tasks: newTasks };
                        setPlan({ ...plan, tasks: ts });
                      }} className="h-8 text-sm" />
                    ) : (
                      <>
                        <span className="text-[hsl(var(--signal-positive))] mt-0.5">•</span>
                        {task}
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </EditableSection>

        {/* KPIs */}
        <EditableSection title="KPIs" editing={editing === "kpis"} onToggleEdit={() => setEditing(editing === "kpis" ? null : "kpis")}>
          <div className="grid gap-3">
            {plan.kpis.map((k, i) => (
              <div key={i} className="flex items-center gap-4">
                {editing === "kpis" ? (
                  <>
                    <Input value={k.name} onChange={(e) => {
                      const kpis = [...plan.kpis];
                      kpis[i] = { ...kpis[i], name: e.target.value };
                      setPlan({ ...plan, kpis });
                    }} className="h-9 flex-1" />
                    <Input value={k.target} onChange={(e) => {
                      const kpis = [...plan.kpis];
                      kpis[i] = { ...kpis[i], target: e.target.value };
                      setPlan({ ...plan, kpis });
                    }} className="h-9 w-28" placeholder="Meta" />
                    <Input value={k.current} onChange={(e) => {
                      const kpis = [...plan.kpis];
                      kpis[i] = { ...kpis[i], current: e.target.value };
                      setPlan({ ...plan, kpis });
                    }} className="h-9 w-28" placeholder="Actual" />
                  </>
                ) : (
                  <>
                    <span className="text-sm font-medium text-foreground flex-1">{k.name}</span>
                    <span className="text-sm text-[hsl(var(--signal-positive))]">Meta: {k.target}</span>
                    <span className="text-sm text-muted-foreground">Actual: {k.current}</span>
                  </>
                )}
              </div>
            ))}
          </div>
        </EditableSection>

        {/* CTA */}
        <div className="pt-6 border-t border-border flex justify-end">
          <Button onClick={handlePublish} className="bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white text-base px-8 py-3 h-auto">
            Publicar plan al equipo
          </Button>
        </div>
      </div>

      {/* Publish Modal */}
      <Dialog open={showPublishModal} onOpenChange={setShowPublishModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Primera acción recomendada</DialogTitle>
            <DialogDescription>Reunión 1:1 de calibración</DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-4">
            {checklistItems.map((item, i) => (
              <button key={i} onClick={() => toggleCheck(i)} className="flex items-center gap-3 w-full text-left p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors">
                <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${checklist[i] ? "bg-[hsl(var(--signal-positive))] border-[hsl(var(--signal-positive))]" : "border-border"}`}>
                  {checklist[i] && <Check className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-foreground">{item}</span>
              </button>
            ))}
          </div>
          <Button onClick={handleMarkDone} className="w-full bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white">
            Marcar como realizado
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const EditableSection = ({ title, editing, onToggleEdit, children }: {
  title: string; editing: boolean; onToggleEdit: () => void; children: React.ReactNode;
}) => (
  <div className="bg-card border border-border rounded-xl p-6 card-shadow space-y-4">
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      <Button variant="ghost" size="sm" onClick={onToggleEdit}>
        {editing ? <><X className="w-4 h-4 mr-1" /> Cerrar</> : <><Edit2 className="w-4 h-4 mr-1" /> Editar</>}
      </Button>
    </div>
    <div className="space-y-3">{children}</div>
  </div>
);

export default PlanReview;

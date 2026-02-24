import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Plus, Trash2, Edit2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STORAGE_KEY = "tp_process_intake";
const N8N_WEBHOOK_URL = "https://example.com/webhook/tp-lab";
const TOTAL_STEPS = 5;

interface RoleBlock {
  role: string;
  responsibilities: string;
  dependencies: string;
}

interface FormData {
  // Step 1
  companyActivity: string;
  locations: string;
  employeeCount: string;
  complexityFactors: string;
  // Step 2
  mainObjective: string;
  secondaryObjectives: string;
  successMetrics: string;
  // Step 3
  performanceIssue: string;
  problemList: string[];
  noResolutionConsequence: string;
  reworkProcesses: string;
  // Step 4
  areaType: string;
  roles: RoleBlock[];
  roleFlow: string;
  // Step 5
  bottleneck: string;
  leaderDependentDecisions: string;
  externalDependencies: string;
  externalDependencyList: string;
}

const defaultFormData: FormData = {
  companyActivity: "",
  locations: "",
  employeeCount: "",
  complexityFactors: "",
  mainObjective: "",
  secondaryObjectives: "",
  successMetrics: "",
  performanceIssue: "",
  problemList: [""],
  noResolutionConsequence: "",
  reworkProcesses: "",
  areaType: "",
  roles: [{ role: "", responsibilities: "", dependencies: "" }],
  roleFlow: "",
  bottleneck: "",
  leaderDependentDecisions: "",
  externalDependencies: "",
  externalDependencyList: "",
};

const ProcessIntake = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [showReview, setShowReview] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultFormData, ...JSON.parse(saved) } : defaultFormData;
  });

  // Load area/process selection
  const selectionRaw = localStorage.getItem("tp_process_selection");
  const selection = selectionRaw ? JSON.parse(selectionRaw) as { area: string; process: string } : null;

  // Autosave
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const progress = showReview ? 100 : ((step + 1) / TOTAL_STEPS) * 100;

  const handleNext = () => {
    if (step < TOTAL_STEPS - 1) {
      setStep(step + 1);
    } else {
      setShowReview(true);
    }
  };

  const handleBack = () => {
    if (showReview) {
      setShowReview(false);
    } else if (step > 0) {
      setStep(step - 1);
    }
  };

  const handleEditSection = (s: number) => {
    setShowReview(false);
    setStep(s);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    const payload = {
      area: selection?.area || "",
      process: selection?.process || "",
      intake: {
        company_context: {
          activity: formData.companyActivity,
          locations: formData.locations,
          employee_count: formData.employeeCount,
          complexity: formData.complexityFactors,
        },
        team_objectives: {
          main_objective: formData.mainObjective,
          secondary_objectives: formData.secondaryObjectives,
          success_metrics: formData.successMetrics,
        },
        problems: {
          main_issue: formData.performanceIssue,
          problem_list: formData.problemList.filter((p) => p.trim()),
          no_resolution: formData.noResolutionConsequence,
          rework_processes: formData.reworkProcesses,
        },
        roles: {
          area_type: formData.areaType,
          role_details: formData.roles,
          role_flow: formData.roleFlow,
        },
        frictions: {
          bottleneck: formData.bottleneck,
          leader_dependent_decisions: formData.leaderDependentDecisions,
          external_dependencies: formData.externalDependencies,
          external_dependency_list: formData.externalDependencyList,
        },
      },
      meta: {
        leader_user_id: "leader_placeholder",
        team_id: "team_placeholder",
        timestamp: new Date().toISOString(),
      },
    };

    try {
      // Mock response for now
      const mockResponse = {
        objectives: [
          { title: "Reducir reprocesos en un 30%", description: "Estandarizar flujos de trabajo operativos para reducir errores y retrabajo." },
          { title: "Mejorar tiempos de entrega", description: "Optimizar dependencias entre roles para reducir tiempos de ciclo." },
        ],
        roadmap: [
          { phase: "Semana 1–2", action: "Mapeo de procesos actuales y puntos de fricción" },
          { phase: "Semana 3–4", action: "Rediseño de flujos y asignación de responsables" },
          { phase: "Semana 5–6", action: "Implementación piloto y ajustes" },
        ],
        tasks: [
          { role: "Líder", tasks: ["Revisar y aprobar flujos rediseñados", "Realizar reuniones 1:1 de calibración"] },
          { role: "Coordinador", tasks: ["Documentar procesos actuales", "Proponer mejoras de flujo"] },
        ],
        kpis: [
          { name: "Tasa de reproceso", target: "< 10%", current: "~25%" },
          { name: "Tiempo de ciclo promedio", target: "3 días", current: "5 días" },
          { name: "Cumplimiento de entregas", target: "> 90%", current: "~70%" },
        ],
      };

      // Try real webhook, fall back to mock
      try {
        const res = await fetch(N8N_WEBHOOK_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (res.ok) {
          const data = await res.json();
          localStorage.setItem("tp_plan_data", JSON.stringify(data));
        } else {
          localStorage.setItem("tp_plan_data", JSON.stringify(mockResponse));
        }
      } catch {
        localStorage.setItem("tp_plan_data", JSON.stringify(mockResponse));
      }

      localStorage.removeItem(STORAGE_KEY);
      navigate("/leader/plan-review");
    } catch {
      setSubmitting(false);
    }
  };

  // Problem list helpers
  const addProblem = () => {
    if (formData.problemList.length < 5) {
      update("problemList", [...formData.problemList, ""]);
    }
  };
  const updateProblem = (i: number, val: string) => {
    const list = [...formData.problemList];
    list[i] = val;
    update("problemList", list);
  };
  const removeProblem = (i: number) => {
    update("problemList", formData.problemList.filter((_, idx) => idx !== i));
  };

  // Roles helpers
  const addRole = () => {
    update("roles", [...formData.roles, { role: "", responsibilities: "", dependencies: "" }]);
  };
  const updateRole = (i: number, field: keyof RoleBlock, val: string) => {
    const roles = [...formData.roles];
    roles[i] = { ...roles[i], [field]: val };
    update("roles", roles);
  };
  const removeRole = (i: number) => {
    if (formData.roles.length > 1) {
      update("roles", formData.roles.filter((_, idx) => idx !== i));
    }
  };

  if (submitting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <Loader2 className="w-12 h-12 text-[hsl(var(--signal-positive))] animate-spin mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Generando tu plan de trabajo…</h2>
          <p className="text-muted-foreground">Esto puede tomar unos segundos.</p>
        </div>
      </div>
    );
  }

  const stepLabels = [
    "Contexto de la empresa",
    "Objetivos estratégicos",
    "Problemas identificados",
    "Roles y conexión",
    "Fricciones y dependencias",
  ];

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Contexto de la empresa</h2>
              <p className="text-muted-foreground mt-1">Cuéntanos sobre la operación actual.</p>
            </div>
            <Field label="¿A qué se dedica la empresa?" value={formData.companyActivity} onChange={(v) => update("companyActivity", v)} textarea />
            <Field label="¿Cuántas sedes o ubicaciones operativas tiene?" value={formData.locations} onChange={(v) => update("locations", v)} />
            <Field label="¿Aproximadamente cuántos empleados tiene?" value={formData.employeeCount} onChange={(v) => update("employeeCount", v)} type="number" />
            <Field label="¿Qué hace que la operación sea compleja hoy?" value={formData.complexityFactors} onChange={(v) => update("complexityFactors", v)} textarea placeholder="Demanda, variabilidad, dependencia de otras áreas, etc." />
          </div>
        );
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Objetivos estratégicos del área</h2>
              <p className="text-muted-foreground mt-1">Define qué quieres lograr este trimestre.</p>
            </div>
            <Field label="Objetivo principal del trimestre" value={formData.mainObjective} onChange={(v) => update("mainObjective", v)} textarea />
            <Field label="Objetivos secundarios (opcional)" value={formData.secondaryObjectives} onChange={(v) => update("secondaryObjectives", v)} textarea />
            <Field label="¿Cómo se mide el éxito hoy? (indicadores actuales si existen)" value={formData.successMetrics} onChange={(v) => update("successMetrics", v)} textarea />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Problemas identificados</h2>
              <p className="text-muted-foreground mt-1">Los dolores reales que afectan hoy a este proceso.</p>
            </div>
            <Field label="¿Qué está afectando más el rendimiento de este proceso hoy?" value={formData.performanceIssue} onChange={(v) => update("performanceIssue", v)} textarea />
            <div className="space-y-2">
              <Label className="text-sm font-medium">Lista de problemas (máximo 5)</Label>
              {formData.problemList.map((p, i) => (
                <div key={i} className="flex gap-2">
                  <Input value={p} onChange={(e) => updateProblem(i, e.target.value)} placeholder={`Problema ${i + 1}`} className="h-11" />
                  {formData.problemList.length > 1 && (
                    <Button variant="ghost" size="icon" onClick={() => removeProblem(i)} className="shrink-0">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>
              ))}
              {formData.problemList.length < 5 && (
                <Button variant="outline" size="sm" onClick={addProblem}>
                  <Plus className="w-4 h-4 mr-1" /> Agregar problema
                </Button>
              )}
            </div>
            <Field label="¿Qué sucede si esto no se resuelve?" value={formData.noResolutionConsequence} onChange={(v) => update("noResolutionConsequence", v)} textarea />
            <Field label="¿Qué procesos están generando más reprocesos o retrasos?" value={formData.reworkProcesses} onChange={(v) => update("reworkProcesses", v)} textarea />
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Roles y conexión del trabajo</h2>
              <p className="text-muted-foreground mt-1">Describe cómo se organiza este proceso.</p>
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Área</Label>
              <Select value={formData.areaType} onValueChange={(v) => update("areaType", v)}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Selecciona tipo de área" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="administrativa">Administrativa</SelectItem>
                  <SelectItem value="operativa">Operativa</SelectItem>
                  <SelectItem value="mixta">Mixta</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-4">
              <Label className="text-sm font-medium">Roles clave dentro de este proceso</Label>
              {formData.roles.map((r, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-muted-foreground">Rol {i + 1}</span>
                    {formData.roles.length > 1 && (
                      <Button variant="ghost" size="icon" onClick={() => removeRole(i)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                  <Input value={r.role} onChange={(e) => updateRole(i, "role", e.target.value)} placeholder="Nombre del rol" className="h-11" />
                  <Textarea value={r.responsibilities} onChange={(e) => updateRole(i, "responsibilities", e.target.value)} placeholder="Responsabilidades principales" rows={2} />
                  <Textarea value={r.dependencies} onChange={(e) => updateRole(i, "dependencies", e.target.value)} placeholder="¿De quién depende / quién depende de este rol?" rows={2} />
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addRole}>
                <Plus className="w-4 h-4 mr-1" /> Agregar rol
              </Button>
            </div>
            <Field label="Describe cómo se conectan los roles entre sí (flujo general)" value={formData.roleFlow} onChange={(v) => update("roleFlow", v)} textarea />
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-semibold text-foreground">Fricciones y dependencias críticas</h2>
              <p className="text-muted-foreground mt-1">Identifica dónde se atasca el trabajo.</p>
            </div>
            <Field label="¿En qué punto se atasca este proceso con más frecuencia?" value={formData.bottleneck} onChange={(v) => update("bottleneck", v)} textarea />
            <Field label="¿Qué decisiones dependen del líder o de terceros?" value={formData.leaderDependentDecisions} onChange={(v) => update("leaderDependentDecisions", v)} textarea />
            <Field label="¿Cuántas áreas externas dependen directamente de este proceso?" value={formData.externalDependencies} onChange={(v) => update("externalDependencies", v)} type="number" />
            <Field label="Lista de áreas externas (opcional)" value={formData.externalDependencyList} onChange={(v) => update("externalDependencyList", v)} textarea placeholder="Ej. Finanzas, Calidad, Logística…" />
          </div>
        );
      default:
        return null;
    }
  };

  if (showReview) {
    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
          <div className="max-w-3xl mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm font-medium text-muted-foreground">Revisión final</span>
              <span className="text-sm text-muted-foreground">Paso 6 de 6</span>
            </div>
            <Progress value={100} className="h-2" />
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-6 py-10 space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">Revisión final</h2>
          <p className="text-muted-foreground">Verifica tus respuestas antes de generar el plan de trabajo.</p>

          {selection && (
            <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap gap-x-6 gap-y-1">
              <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Área:</span> {selection.area}</p>
              <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Proceso:</span> {selection.process}</p>
            </div>
          )}

          <ReviewSection title="Contexto de la empresa" onEdit={() => handleEditSection(0)}>
            <ReviewItem label="Actividad" value={formData.companyActivity} />
            <ReviewItem label="Sedes" value={formData.locations} />
            <ReviewItem label="Empleados" value={formData.employeeCount} />
            <ReviewItem label="Complejidad" value={formData.complexityFactors} />
          </ReviewSection>

          <ReviewSection title="Objetivos estratégicos" onEdit={() => handleEditSection(1)}>
            <ReviewItem label="Objetivo principal" value={formData.mainObjective} />
            <ReviewItem label="Secundarios" value={formData.secondaryObjectives} />
            <ReviewItem label="Métricas" value={formData.successMetrics} />
          </ReviewSection>

          <ReviewSection title="Problemas identificados" onEdit={() => handleEditSection(2)}>
            <ReviewItem label="Problema principal" value={formData.performanceIssue} />
            <ReviewItem label="Lista" value={formData.problemList.filter((p) => p.trim()).join(", ")} />
            <ReviewItem label="Consecuencia" value={formData.noResolutionConsequence} />
            <ReviewItem label="Reprocesos" value={formData.reworkProcesses} />
          </ReviewSection>

          <ReviewSection title="Roles y conexión" onEdit={() => handleEditSection(3)}>
            <ReviewItem label="Tipo de área" value={formData.areaType} />
            {formData.roles.map((r, i) => (
              <div key={i} className="pl-3 border-l-2 border-border space-y-1 mt-2">
                <ReviewItem label={`Rol ${i + 1}`} value={r.role} />
                <ReviewItem label="Responsabilidades" value={r.responsibilities} />
                <ReviewItem label="Dependencias" value={r.dependencies} />
              </div>
            ))}
            <ReviewItem label="Flujo general" value={formData.roleFlow} />
          </ReviewSection>

          <ReviewSection title="Fricciones y dependencias" onEdit={() => handleEditSection(4)}>
            <ReviewItem label="Cuello de botella" value={formData.bottleneck} />
            <ReviewItem label="Decisiones dependientes" value={formData.leaderDependentDecisions} />
            <ReviewItem label="Áreas externas" value={formData.externalDependencies} />
            <ReviewItem label="Lista" value={formData.externalDependencyList} />
          </ReviewSection>

          <div className="flex items-center justify-between pt-6 border-t border-border">
            <Button variant="ghost" onClick={handleBack}>
              <ArrowLeft className="w-4 h-4 mr-2" /> Volver
            </Button>
            <Button onClick={handleSubmit} className="bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white">
              <CheckCircle2 className="w-4 h-4 mr-2" /> Generar plan de trabajo
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-3xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-muted-foreground">{stepLabels[step]}</span>
            <span className="text-sm text-muted-foreground">Paso {step + 1} de {TOTAL_STEPS}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground mt-2">Tiempo estimado: 8–12 minutos</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-6 py-10">
        {/* Area/Process context banner */}
        {selection && (
          <div className="mb-6 bg-card border border-border rounded-xl p-4 flex flex-wrap gap-x-6 gap-y-1">
            <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Área seleccionada:</span> {selection.area}</p>
            <p className="text-sm text-muted-foreground"><span className="font-semibold text-foreground">Proceso seleccionado:</span> {selection.process}</p>
          </div>
        )}
        {step === 0 && !showReview && (
          <div className="mb-8">
            <h1 className="text-xl font-semibold text-foreground">Antes de analizar y mejorar la cultura, construyamos claridad del trabajo.</h1>
            <p className="text-muted-foreground mt-1 text-sm">Responde estas preguntas para que TP Lab genere un plan de trabajo claro (objetivos, tareas y KPIs).</p>
          </div>
        )}
        <div className="animate-fade-in" key={step}>
          {renderStep()}
        </div>
        <div className="flex items-center justify-between mt-10 pt-6 border-t border-border">
          <Button variant="ghost" onClick={handleBack} disabled={step === 0}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Atrás
          </Button>
          <Button onClick={handleNext} className="bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white">
            {step === TOTAL_STEPS - 1 ? (
              <>Revisar respuestas <ArrowRight className="w-4 h-4 ml-2" /></>
            ) : (
              <>Continuar <ArrowRight className="w-4 h-4 ml-2" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

// Reusable field component
const Field = ({ label, value, onChange, textarea, type, placeholder }: {
  label: string; value: string; onChange: (v: string) => void;
  textarea?: boolean; type?: string; placeholder?: string;
}) => (
  <div className="space-y-2">
    <Label className="text-sm font-medium">{label}</Label>
    {textarea ? (
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} rows={3} />
    ) : (
      <Input type={type || "text"} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="h-11" />
    )}
  </div>
);

// Review helpers
const ReviewSection = ({ title, onEdit, children }: { title: string; onEdit: () => void; children: React.ReactNode }) => (
  <div className="bg-card border border-border rounded-xl p-6 card-shadow space-y-3">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold text-foreground">{title}</h3>
      <Button variant="ghost" size="sm" onClick={onEdit}>
        <Edit2 className="w-4 h-4 mr-1" /> Editar
      </Button>
    </div>
    <div className="space-y-2">{children}</div>
  </div>
);

const ReviewItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <span className="text-xs text-muted-foreground">{label}</span>
    <p className="text-sm text-foreground">{value || "—"}</p>
  </div>
);

export default ProcessIntake;

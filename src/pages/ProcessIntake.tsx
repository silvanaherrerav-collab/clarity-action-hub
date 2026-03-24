import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle2, Plus, Trash2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { trackEvent } from "@/lib/trackEvent";

const STORAGE_KEY = "tp_process_intake";
const N8N_WEBHOOK_URL = "https://example.com/webhook/tp-lab";

interface FormData {
  processName: string;
  processObjective: string;
  howItStarts: string;
  keySteps: string;
  howItEnds: string;
  whoParticipates: string;
  toolsUsed: string;
  problems: string[];
  whatSlowsIt: string;
  successMeasure: string;
  whatChangesIfImproved: string;
}

const defaultFormData: FormData = {
  processName: "",
  processObjective: "",
  howItStarts: "",
  keySteps: "",
  howItEnds: "",
  whoParticipates: "",
  toolsUsed: "",
  problems: [""],
  whatSlowsIt: "",
  successMeasure: "",
  whatChangesIfImproved: "",
};

const ProcessIntake = () => {
  const navigate = useNavigate();
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultFormData, ...JSON.parse(saved) } : defaultFormData;
  });
  const [showSecondProcess, setShowSecondProcess] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const addProblem = () => {
    if (formData.problems.length < 3) {
      trackEvent("click_add_problem");
      update("problems", [...formData.problems, ""]);
    }
  };
  const updateProblem = (i: number, val: string) => {
    const list = [...formData.problems];
    list[i] = val;
    update("problems", list);
  };
  const removeProblem = (i: number) => {
    if (formData.problems.length > 1) update("problems", formData.problems.filter((_, idx) => idx !== i));
  };

  const handleAddProcess = () => {
    trackEvent("click_add_process");
    setShowSecondProcess(true);
  };

  const canContinue =
    formData.processName.trim() &&
    formData.processObjective.trim() &&
    formData.howItStarts.trim() &&
    formData.problems.some((p) => p.trim());

  const handleSubmit = async () => {
    setSubmitting(true);
    const leaderContext = (() => {
      try { return JSON.parse(localStorage.getItem("tp_leader_context") || "{}"); } catch { return {}; }
    })();

    const payload = {
      company: (() => { try { return JSON.parse(localStorage.getItem("tp_company_profile") || "{}"); } catch { return {}; } })(),
      area: leaderContext.area || "",
      process: formData.processName,
      intake: { ...formData, problems: formData.problems.filter((p) => p.trim()) },
      meta: { leader_user_id: "leader_placeholder", team_id: "team_placeholder", timestamp: new Date().toISOString() },
    };

    const mockResponse = {
      objectives: [
        { title: "Reducir reprocesos en un 30%", description: "Estandarizar flujos de trabajo operativos." },
        { title: "Mejorar tiempos de entrega", description: "Optimizar dependencias entre roles." },
      ],
      roadmap: [
        { phase: "Semana 1–2", action: "Mapeo de procesos actuales y puntos de fricción" },
        { phase: "Semana 3–4", action: "Rediseño de flujos y asignación de responsables" },
        { phase: "Semana 5–6", action: "Implementación piloto y ajustes" },
      ],
      tasks: [
        { role: "Líder", tasks: ["Revisar y aprobar flujos rediseñados", "Reuniones 1:1 de calibración"] },
        { role: "Coordinador", tasks: ["Documentar procesos actuales", "Proponer mejoras de flujo"] },
      ],
      kpis: [
        { name: "Tasa de reproceso", target: "< 10%", current: "~25%" },
        { name: "Tiempo de ciclo promedio", target: "3 días", current: "5 días" },
      ],
    };

    try {
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

      localStorage.setItem("tp_process_intake_simple", JSON.stringify({
        processName: formData.processName,
        objective: formData.processObjective,
        metric: formData.successMeasure,
        problems: formData.problems.filter((p) => p.trim()),
        area: (() => { try { return JSON.parse(localStorage.getItem("tp_leader_context") || "{}").area || ""; } catch { return ""; } })(),
      }));
      localStorage.setItem("tp_process_selection", JSON.stringify({ area: "", process: formData.processName }));
      localStorage.removeItem(STORAGE_KEY);
      navigate("/leader/process-responsible");
    } catch {
      setSubmitting(false);
    }
  };

  if (submitting) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-6 animate-fade-in">
          <Loader2 className="w-12 h-12 text-[hsl(var(--signal-positive))] animate-spin mx-auto" />
          <h2 className="text-2xl font-bold text-foreground">Procesando información…</h2>
          <p className="text-muted-foreground">Esto puede tomar unos segundos.</p>
        </div>
      </div>
    );
  }

  const progress = canContinue ? 85 : 40;

  return (
    <div className="min-h-screen bg-background">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b border-border">
        <div className="max-w-2xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold tracking-[0.15em] text-muted-foreground uppercase">
              Talent Performance Lab
            </span>
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-10 space-y-10">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Cuéntanos sobre este proceso
          </h1>
          <p className="text-sm text-muted-foreground mt-2">
            No tiene que ser perfecto. Solo cuéntanos cómo funciona hoy.
          </p>
        </div>

        {/* Proceso 1 */}
        <section className="space-y-6 bg-card border border-border rounded-2xl p-6 card-shadow">
          <h2 className="text-lg font-semibold text-foreground">Proceso 1</h2>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Nombre del proceso</Label>
            <Input
              value={formData.processName}
              onChange={(e) => update("processName", e.target.value)}
              placeholder="Ej. Selección de personal"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Objetivo del proceso</Label>
            <Textarea
              value={formData.processObjective}
              onChange={(e) => update("processObjective", e.target.value)}
              placeholder="Ej. Reducir el tiempo de contratación a menos de 15 días"
              rows={2}
              className="resize-none"
            />
          </div>
        </section>

        {/* Bloque clave */}
        <section className="space-y-6 bg-card border border-border rounded-2xl p-6 card-shadow">
          <div>
            <h2 className="text-lg font-semibold text-foreground">¿Cómo funciona este proceso hoy?</h2>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">¿Cómo inicia?</Label>
            <Textarea value={formData.howItStarts} onChange={(e) => update("howItStarts", e.target.value)} placeholder="Describe el punto de partida…" rows={2} className="resize-none" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">¿Qué pasos clave siguen?</Label>
            <Textarea value={formData.keySteps} onChange={(e) => update("keySteps", e.target.value)} placeholder="Describe los pasos principales…" rows={2} className="resize-none" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">¿Cómo termina?</Label>
            <Textarea value={formData.howItEnds} onChange={(e) => update("howItEnds", e.target.value)} placeholder="Describe el resultado final…" rows={2} className="resize-none" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">¿Quiénes participan?</Label>
            <Input value={formData.whoParticipates} onChange={(e) => update("whoParticipates", e.target.value)} placeholder="Ej. Coordinador, analista, gerente" className="h-11" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">¿Qué herramientas utilizan?</Label>
            <Input value={formData.toolsUsed} onChange={(e) => update("toolsUsed", e.target.value)} placeholder="Ej. Excel, SAP, correo electrónico" className="h-11" />
          </div>
        </section>

        {/* Problemas */}
        <section className="space-y-5 bg-card border border-border rounded-2xl p-6 card-shadow">
          <div>
            <h2 className="text-lg font-semibold text-foreground">¿Qué está dificultando este proceso?</h2>
            <p className="text-xs text-muted-foreground mt-1">Máximo 3 problemas</p>
          </div>

          <div className="space-y-3">
            {formData.problems.map((p, i) => (
              <div key={i} className="flex gap-2">
                <span className="text-sm text-muted-foreground font-medium w-5 shrink-0 mt-2.5">{i + 1}.</span>
                <Input value={p} onChange={(e) => updateProblem(i, e.target.value)} placeholder={`Problema ${i + 1}`} className="h-11" />
                {formData.problems.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removeProblem(i)} className="shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            {formData.problems.length < 3 && (
              <Button variant="outline" size="sm" onClick={addProblem}>
                <Plus className="w-4 h-4 mr-1" /> Agregar problema
              </Button>
            )}
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">¿Qué lo frena o retrasa?</Label>
            <Textarea value={formData.whatSlowsIt} onChange={(e) => update("whatSlowsIt", e.target.value)} placeholder="Describe las fricciones principales…" rows={2} className="resize-none" />
          </div>
        </section>

        {/* Medición + impacto */}
        <section className="space-y-5 bg-card border border-border rounded-2xl p-6 card-shadow">
          <div className="space-y-2">
            <Label className="text-sm font-medium">¿Cómo miden el éxito? <span className="text-muted-foreground font-normal">(opcional)</span></Label>
            <Input value={formData.successMeasure} onChange={(e) => update("successMeasure", e.target.value)} placeholder="Ej. Tiempo de ciclo, tasa de errores" className="h-11" />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Si mejora, ¿qué cambiaría?</Label>
            <Textarea value={formData.whatChangesIfImproved} onChange={(e) => update("whatChangesIfImproved", e.target.value)} placeholder="Describe el impacto esperado…" rows={2} className="resize-none" />
          </div>
        </section>

        {/* Add another process */}
        {!showSecondProcess && (
          <div className="text-center">
            <Button variant="ghost" size="sm" className="text-muted-foreground text-xs" onClick={handleAddProcess}>
              <Plus className="w-3.5 h-3.5 mr-1" />
              Agregar otro proceso (máx 2)
            </Button>
          </div>
        )}
        {showSecondProcess && (
          <div className="bg-muted/50 border border-border rounded-2xl p-6 text-center space-y-2">
            <p className="text-sm text-muted-foreground">Segundo proceso disponible próximamente.</p>
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate(-1)}>
            <ArrowLeft className="w-4 h-4 mr-2" /> Volver
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!canContinue}
            className="flex-1 bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white h-12 text-base font-semibold"
          >
            Continuar
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ProcessIntake;

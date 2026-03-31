import { useState, useEffect } from "react";
import { ArrowRight, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/trackEvent";
import PageTransition from "@/components/PageTransition";
import { useNavigateWithTransition } from "@/hooks/useNavigateWithTransition";

const STORAGE_KEY = "tp_process_intake";
const N8N_WEBHOOK_URL = "https://example.com/webhook/tp-lab";

const TOOL_OPTIONS = ["CRM", "Excel", "SAP", "Correo", "Slack", "WhatsApp", "Google Sheets", "Notion", "Jira"];

interface FormData {
  processName: string;
  processObjective: string;
  processSteps: string;
  toolsSelected: string[];
  customTool: string;
  problems: string[];
  whatSlowsIt: string;
  successMeasure: string;
  whatChangesIfImproved: string;
}

const defaultFormData: FormData = {
  processName: "",
  processObjective: "",
  processSteps: "",
  toolsSelected: [],
  customTool: "",
  problems: ["", ""],
  whatSlowsIt: "",
  successMeasure: "",
  whatChangesIfImproved: "",
};

const ProcessIntake = () => {
  const navigate = useNavigateWithTransition();
  const [submitting, setSubmitting] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const [formData, setFormData] = useState<FormData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return { ...defaultFormData, ...JSON.parse(saved) }; } catch {}
    }
    return defaultFormData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
  }, [formData]);

  const update = <K extends keyof FormData>(key: K, value: FormData[K]) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  const toggleTool = (tool: string) => {
    const current = formData.toolsSelected;
    if (current.includes(tool)) {
      update("toolsSelected", current.filter((t) => t !== tool));
    } else {
      update("toolsSelected", [...current, tool]);
    }
  };

  const addCustomTool = () => {
    if (formData.customTool.trim() && !formData.toolsSelected.includes(formData.customTool.trim())) {
      update("toolsSelected", [...formData.toolsSelected, formData.customTool.trim()]);
      update("customTool", "");
    }
  };

  const addProblem = () => {
    if (formData.problems.length < 5) {
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
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 4000);
  };

  const canContinue =
    formData.processName.trim() &&
    formData.processObjective.trim() &&
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
      <div className="min-h-screen bg-[#f5f5f0] flex items-center justify-center">
        <div className="text-center space-y-4 animate-fade-in">
          <div className="flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--signal-positive))] animate-pulse" style={{ animationDelay: "0ms" }} />
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--signal-positive))] animate-pulse" style={{ animationDelay: "300ms" }} />
            <span className="w-2 h-2 rounded-full bg-[hsl(var(--signal-positive))] animate-pulse" style={{ animationDelay: "600ms" }} />
          </div>
          <p className="text-sm text-muted-foreground/70">Organizando tu información...</p>
        </div>
      </div>
    );
  }

  const inputClass =
    "flex h-12 w-full rounded-xl border border-border/60 bg-white px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--signal-positive)/0.3)] focus:border-[hsl(var(--signal-positive))] transition-all";

  const textareaClass =
    "flex w-full rounded-xl border border-border/60 bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--signal-positive)/0.3)] focus:border-[hsl(var(--signal-positive))] transition-all resize-none";

  // Step indicator dots
  const StepIndicator = () => (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-[hsl(var(--signal-positive))]" />
      <div className="w-2 h-2 rounded-full bg-[hsl(var(--signal-positive))]" />
      <div className="w-8 h-2 rounded-full bg-[hsl(var(--signal-positive))]" />
      <div className="w-2 h-2 rounded-full bg-border" />
    </div>
  );

  return (
    <PageTransition>
    <div id="page-transition-root" className="min-h-screen bg-[#f5f5f0]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#f5f5f0]">
        <div className="max-w-3xl mx-auto px-8 pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-[0.2em] text-foreground/60 uppercase">
              Talent Performance Lab
            </span>
            <StepIndicator />
          </div>
          <div className="h-[3px] bg-gradient-to-r from-[hsl(var(--signal-positive))] via-[hsl(var(--signal-positive))] to-transparent rounded-full" style={{ width: "65%" }} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-8 space-y-10 animate-fade-in">
        {/* Process badge + Title */}
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[hsl(var(--signal-positive)/0.1)] mb-6">
            <span className="w-6 h-6 rounded-full bg-[hsl(var(--signal-positive))] text-white text-xs font-bold flex items-center justify-center">1</span>
            <span className="text-sm font-medium text-foreground">Proceso</span>
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-[1.15]">
            Cuéntanos sobre el
            <br />
            proceso que quieres mejorar
          </h1>
          <p className="text-base text-muted-foreground mt-3">
            Cuéntanos cómo funciona hoy para que podamos identificar dónde intervenir.
          </p>
        </div>

        {/* IDENTIFICACIÓN */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-[0.2em] text-[hsl(var(--signal-positive))] uppercase">Identificación</span>
            <div className="flex-1 h-[1px] bg-border/60" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">¿Qué proceso quieres analizar?</label>
            <p className="text-xs text-muted-foreground">Ej: Ventas, selección, onboarding, atención al cliente...</p>
            <input
              type="text"
              value={formData.processName}
              onChange={(e) => update("processName", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">¿Cuál es el objetivo principal de este proceso?</label>
            <p className="text-xs text-muted-foreground">Ej: cerrar más ventas, reducir tiempos de contratación...</p>
            <input
              type="text"
              value={formData.processObjective}
              onChange={(e) => update("processObjective", e.target.value)}
              className={inputClass}
            />
          </div>
        </section>

        {/* CÓMO FUNCIONA HOY */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-[0.2em] text-[hsl(var(--signal-positive))] uppercase">Cómo funciona hoy</span>
            <div className="flex-1 h-[1px] bg-border/60" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">¿Cómo funciona este proceso en la práctica?</label>
            <p className="text-xs text-muted-foreground">Describe los pasos más importantes desde el inicio hasta el resultado</p>
            <textarea
              value={formData.processSteps}
              onChange={(e) => update("processSteps", e.target.value)}
              placeholder={"Paso 1.\nPaso 2...\nResultado..."}
              rows={5}
              className={textareaClass}
            />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">¿Qué herramientas utiliza tu equipo en este proceso?</label>
            <p className="text-xs text-muted-foreground">Selecciona las que aplican o agrega las tuyas.</p>
            <div className="flex flex-wrap gap-2">
              {TOOL_OPTIONS.map((tool) => (
                <button
                  key={tool}
                  type="button"
                  onClick={() => toggleTool(tool)}
                  className={cn(
                    "px-4 py-2 rounded-xl border text-sm font-medium transition-all duration-200",
                    formData.toolsSelected.includes(tool)
                      ? "border-[hsl(var(--signal-positive))] bg-[hsl(var(--signal-positive)/0.08)] text-foreground"
                      : "border-border/60 text-muted-foreground hover:border-border"
                  )}
                >
                  {tool}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={formData.customTool}
                onChange={(e) => update("customTool", e.target.value)}
                placeholder="Otra herramienta..."
                className={cn(inputClass, "flex-1")}
                onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addCustomTool())}
              />
              <button
                type="button"
                onClick={addCustomTool}
                className="px-4 h-12 rounded-xl border border-border/60 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors flex items-center gap-1 shrink-0"
              >
                <Plus className="w-4 h-4" />
                Agregar
              </button>
            </div>
          </div>
        </section>

        {/* FRICCIONES ACTUALES */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-[0.2em] text-[hsl(var(--signal-positive))] uppercase">Fricciones actuales</span>
            <div className="flex-1 h-[1px] bg-border/60" />
          </div>

          <div className="space-y-3">
            <label className="text-sm font-semibold text-foreground">¿Qué está dificultando este proceso actualmente?</label>
            <p className="text-xs text-muted-foreground">Puedes agregar hasta 5</p>
            {formData.problems.map((p, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[hsl(var(--signal-positive)/0.1)] text-[hsl(var(--signal-positive))] text-xs font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <input
                  type="text"
                  value={p}
                  onChange={(e) => updateProblem(i, e.target.value)}
                  className={cn(inputClass, "flex-1")}
                />
                <button
                  type="button"
                  onClick={() => removeProblem(i)}
                  className="w-12 h-12 rounded-xl border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {formData.problems.length < 5 && (
              <button
                type="button"
                onClick={addProblem}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border/60 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                <Plus className="w-4 h-4 text-[hsl(var(--signal-positive))]" />
                Agregar dificultad
              </button>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">¿Qué suele frenar o retrasar este proceso?</label>
            <textarea
              value={formData.whatSlowsIt}
              onChange={(e) => update("whatSlowsIt", e.target.value)}
              rows={4}
              className={textareaClass}
            />
          </div>
        </section>

        {/* RESULTADOS E IMPACTO */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-[0.2em] text-[hsl(var(--signal-positive))] uppercase">Resultados e impacto</span>
            <div className="flex-1 h-[1px] bg-border/60" />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">¿Cómo evalúan hoy si este proceso está funcionando bien?</label>
            <p className="text-xs text-muted-foreground">Ej: tiempo, resultados, cumplimiento, KPIs...</p>
            <input
              type="text"
              value={formData.successMeasure}
              onChange={(e) => update("successMeasure", e.target.value)}
              className={inputClass}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-semibold text-foreground">Si este proceso mejora, ¿qué cambiaría en tu equipo o en los resultados?</label>
            <p className="text-xs text-muted-foreground">Ej: más eficiencia, mejores resultados, menos errores...</p>
            <textarea
              value={formData.whatChangesIfImproved}
              onChange={(e) => update("whatChangesIfImproved", e.target.value)}
              rows={4}
              className={textareaClass}
            />
          </div>
        </section>

        {/* Fake add process button */}
        <div className="relative">
          <button
            type="button"
            onClick={handleAddProcess}
            className="w-full py-4 rounded-xl border border-border/60 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors"
          >
            + Agregar otro proceso
          </button>

          {showTooltip && (
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-20">
              <div className="bg-[#1a1a2e] text-white rounded-2xl px-6 py-4 text-center shadow-xl max-w-xs">
                <p className="text-[hsl(var(--signal-positive))] font-semibold text-sm mb-1">Muy pronto</p>
                <p className="text-xs text-white/70 leading-relaxed">
                  Por ahora estamos enfocados en ayudarte a mejorar un proceso a la vez.
                </p>
              </div>
              <div className="w-4 h-4 bg-[#1a1a2e] rotate-45 mx-auto -mt-2" />
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-[#f5f5f0] border-t border-border/40">
        <div className="max-w-3xl mx-auto px-8 py-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Paso 2 de 3 · Diagnóstico del proceso
          </span>
          <button
            onClick={handleSubmit}
            disabled={!canContinue}
            className={cn(
              "inline-flex items-center gap-2 px-6 py-3 rounded-full text-sm font-medium transition-all duration-200",
              canContinue
                ? "border border-foreground/20 text-foreground hover:bg-foreground/5"
                : "border border-border/60 text-muted-foreground cursor-not-allowed"
            )}
          >
            Continuar
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default ProcessIntake;

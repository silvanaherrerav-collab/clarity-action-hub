import { useState, useEffect } from "react";
import { ArrowRight, Plus } from "lucide-react";
import { cn } from "@/lib/utils";
import { trackEvent } from "@/lib/trackEvent";
import PageTransition from "@/components/PageTransition";
import { useNavigateWithTransition } from "@/hooks/useNavigateWithTransition";

const STORAGE_KEY = "tp_process_intake";
const N8N_WEBHOOK_URL = "https://example.com/webhook/tp-lab";

const TOOL_OPTIONS = ["CRM", "Excel", "SAP", "Correo", "Slack", "WhatsApp", "Google Sheets", "Notion", "Jira"];

const FRICTION_OPTIONS = [
  "Tiempos lentos",
  "Falta de claridad en responsabilidades",
  "Falta de seguimiento",
  "Dependencia de otras áreas",
  "No hay indicadores claros",
  "Reprocesos frecuentes",
];

interface FormData {
  processName: string;
  processObjective: string;
  processSteps: string;
  frictionPoint: string;
  toolsSelected: string[];
  customTools: string[];
  customTool: string;
  frictionFactors: string[];
  customFriction: string;
  successMeasure: string;
  whatChangesIfImproved: string;
}

const defaultFormData: FormData = {
  processName: "",
  processObjective: "",
  processSteps: "",
  frictionPoint: "",
  toolsSelected: [],
  customTools: [],
  customTool: "",
  frictionFactors: [],
  customFriction: "",
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
      try { return { ...defaultFormData, ...JSON.parse(saved) }; } catch { /* ignore */ }
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
    update("toolsSelected", current.includes(tool) ? current.filter((t) => t !== tool) : [...current, tool]);
  };

  const addCustomTool = () => {
    const trimmed = formData.customTool.trim();
    const alreadyExists = [...TOOL_OPTIONS, ...formData.customTools].some(
      (tool) => tool.toLowerCase() === trimmed.toLowerCase()
    );

    if (!trimmed || alreadyExists) return;

    setFormData((prev) => ({
      ...prev,
      customTools: [...prev.customTools, trimmed],
      toolsSelected: prev.toolsSelected.includes(trimmed)
        ? prev.toolsSelected
        : [...prev.toolsSelected, trimmed],
      customTool: "",
    }));
  };

  const toggleFriction = (factor: string) => {
    const current = formData.frictionFactors;
    update("frictionFactors", current.includes(factor) ? current.filter((f) => f !== factor) : [...current, factor]);
  };

  const handleAddProcess = () => {
    trackEvent("click_add_process");
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 4000);
  };

  const canContinue = formData.processName.trim() && formData.processObjective.trim();
  const availableTools = [...TOOL_OPTIONS, ...formData.customTools];

  const handleSubmit = async () => {
    setSubmitting(true);
    const leaderContext = (() => {
      try { return JSON.parse(localStorage.getItem("tp_leader_context") || "{}"); } catch { return {}; }
    })();

    const payload = {
      company: (() => { try { return JSON.parse(localStorage.getItem("tp_company_profile") || "{}"); } catch { return {}; } })(),
      area: leaderContext.area || "",
      process: formData.processName,
      intake: { ...formData },
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
        frictionFactors: formData.frictionFactors,
        area: leaderContext.area || "",
      }));
      localStorage.setItem("tp_process_selection", JSON.stringify({ area: "", process: formData.processName }));
      localStorage.removeItem(STORAGE_KEY);
      navigate("/leader/process-intro");
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
        </div>
      </div>
    );
  }

  const inputClass =
    "flex h-12 w-full rounded-xl border border-border/60 bg-white px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--signal-positive)/0.3)] focus:border-[hsl(var(--signal-positive))] transition-all";

  const textareaClass =
    "flex w-full rounded-xl border border-border/60 bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--signal-positive)/0.3)] focus:border-[hsl(var(--signal-positive))] transition-all resize-none";

  const StepIndicator = () => (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-[hsl(var(--signal-positive))]" />
      <div className="w-2 h-2 rounded-full bg-[hsl(var(--signal-positive))]" />
      <div className="w-8 h-2 rounded-full bg-[hsl(var(--signal-positive))]" />
      <div className="w-2 h-2 rounded-full bg-border" />
    </div>
  );

  const SectionDivider = ({ label }: { label: string }) => (
    <div className="flex items-center gap-3">
      <span className="text-xs font-bold tracking-[0.2em] text-[hsl(var(--signal-positive))] uppercase">{label}</span>
      <div className="flex-1 h-[1px] bg-border/60" />
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
          {/* Title */}
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
            <SectionDivider label="Identificación" />
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">¿Qué proceso quieres analizar?</label>
              <p className="text-xs text-muted-foreground">Ej: Ventas, selección, onboarding, atención al cliente...</p>
              <input type="text" value={formData.processName} onChange={(e) => update("processName", e.target.value)} className={inputClass} />
            </div>
          </section>

          {/* RESULTADO DEL PROCESO */}
          <section className="space-y-6">
            <SectionDivider label="Resultado del proceso" />
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">¿Qué resultado debería lograr este proceso?</label>
              <textarea
                value={formData.processObjective}
                onChange={(e) => update("processObjective", e.target.value)}
                rows={2}
                className={textareaClass}
              />
            </div>
          </section>

          {/* CÓMO FUNCIONA HOY */}
          <section className="space-y-6">
            <SectionDivider label="Cómo funciona hoy" />
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Describe los pasos más importantes desde el inicio hasta el resultado</label>
              <textarea
                value={formData.processSteps}
                onChange={(e) => update("processSteps", e.target.value)}
                placeholder={"Paso 1:\nPaso 2:\nPaso 3:\nResultado final:"}
                rows={4}
                className={textareaClass}
              />
            </div>
          </section>

          {/* FRICCIÓN DEL PROCESO */}
          <section className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">¿En qué parte del proceso suelen ocurrir errores o retrasos?</label>
              <textarea
                value={formData.frictionPoint}
                onChange={(e) => update("frictionPoint", e.target.value)}
                rows={2}
                className={textareaClass}
              />
            </div>
          </section>

          {/* HERRAMIENTAS */}
          <section className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">¿Dónde se gestiona este proceso actualmente?</label>
              <p className="text-xs text-muted-foreground">Selecciona las que aplican o agrega las tuyas.</p>
              <div className="flex flex-wrap gap-2">
                {availableTools.map((tool) => (
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

          {/* FACTORES QUE AFECTAN EL RENDIMIENTO */}
          <section className="space-y-6">
            <div className="space-y-3">
              <label className="text-sm font-semibold text-foreground">¿Qué está afectando hoy el rendimiento de este proceso?</label>
              <div className="space-y-2">
                {FRICTION_OPTIONS.map((option) => (
                  <label key={option} className="flex items-center gap-3 cursor-pointer group">
                    <span
                      className={cn(
                        "w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all shrink-0",
                        formData.frictionFactors.includes(option)
                          ? "border-[hsl(var(--signal-positive))] bg-[hsl(var(--signal-positive))]"
                          : "border-border/60 group-hover:border-border"
                      )}
                    >
                      {formData.frictionFactors.includes(option) && (
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </span>
                    <button type="button" onClick={() => toggleFriction(option)} className="text-sm text-foreground text-left">
                      {option}
                    </button>
                  </label>
                ))}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Otro:</span>
                <input
                  type="text"
                  value={formData.customFriction}
                  onChange={(e) => update("customFriction", e.target.value)}
                  className={cn(inputClass, "flex-1 max-w-xs")}
                />
              </div>
            </div>
          </section>

          {/* RESULTADOS E IMPACTO */}
          <section className="space-y-6">
            <SectionDivider label="Resultados e impacto" />
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">¿Cómo evalúan hoy si este proceso está funcionando bien?</label>
              <p className="text-xs text-muted-foreground">Ej: tiempo, resultados, cumplimiento, KPIs...</p>
              <input type="text" value={formData.successMeasure} onChange={(e) => update("successMeasure", e.target.value)} className={inputClass} />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Si este proceso mejora, ¿qué cambiaría en tu equipo o en los resultados?</label>
              <p className="text-xs text-muted-foreground">Ej: más eficiencia, mejores resultados, menos errores...</p>
              <textarea
                value={formData.whatChangesIfImproved}
                onChange={(e) => update("whatChangesIfImproved", e.target.value)}
                rows={2}
                className={textareaClass}
              />
            </div>
          </section>

          {/* Add process (disabled) */}
          <div className="relative mt-2">
            <button
              type="button"
              onClick={handleAddProcess}
              onMouseEnter={() => setShowTooltip(true)}
              onMouseLeave={() => setShowTooltip(false)}
              className="w-full py-3.5 rounded-2xl text-sm font-semibold text-[hsl(var(--signal-positive))] bg-gradient-to-r from-[hsl(var(--signal-positive)/0.08)] to-[hsl(var(--signal-positive)/0.15)] border border-[hsl(var(--signal-positive)/0.2)] shadow-sm transition-all duration-200 cursor-pointer hover:brightness-105 hover:scale-[1.01] active:scale-[0.98]"
            >
              + Agregar otro proceso
            </button>

            {showTooltip && (
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 z-20 pointer-events-none">
                <div className="bg-[#1a1a2e] rounded-2xl px-6 py-4 shadow-2xl min-w-[300px] text-center">
                  <p className="text-sm font-bold text-[hsl(var(--signal-positive))] mb-1.5">Muy pronto</p>
                  <p className="text-xs leading-relaxed text-white/75">
                    Por ahora estamos enfocados en ayudarte
                    <br />
                    a mejorar un proceso a la vez.
                  </p>
                </div>
                <div className="w-3 h-3 bg-[#1a1a2e] rotate-45 mx-auto -mt-1.5" />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-[#f5f5f0] border-t border-border/40">
          <div className="max-w-3xl mx-auto px-8 py-4 flex items-center justify-between">
            <span className="text-sm text-muted-foreground">
              Diagnóstico del proceso
            </span>
            <button
              onClick={handleSubmit}
              disabled={!canContinue}
              className={cn(
                "inline-flex items-center gap-2 px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-200",
                canContinue
                  ? "bg-[hsl(var(--signal-positive))] text-white shadow-md hover:shadow-lg hover:brightness-110 hover:-translate-y-0.5"
                  : "bg-muted text-muted-foreground cursor-not-allowed"
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

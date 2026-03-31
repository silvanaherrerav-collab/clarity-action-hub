import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, X, Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "tp_leader_context";

const SECTORS = [
  "Manufactura", "Servicios financieros", "Tecnología", "Retail / Comercio",
  "Logística y transporte", "Salud", "Educación", "Construcción",
  "Energía", "Consultoría", "Gobierno / Sector público", "Otro",
];

interface ContextData {
  companyActivity: string;
  sector: string;
  companySize: string;
  area: string;
  cargo: string;
  objectives: string[];
  teamSize: string;
}

const defaultData: ContextData = {
  companyActivity: "",
  sector: "",
  companySize: "",
  area: "",
  cargo: "",
  objectives: ["", ""],
  teamSize: "",
};

const LeaderContext = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<ContextData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.companyActivity !== undefined) return { ...defaultData, ...parsed };
      } catch {}
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const update = <K extends keyof ContextData>(key: K, value: ContextData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const updateObjective = (i: number, val: string) => {
    const list = [...data.objectives];
    list[i] = val;
    update("objectives", list);
  };

  const addObjective = () => {
    if (data.objectives.length < 5) {
      update("objectives", [...data.objectives, ""]);
    }
  };

  const removeObjective = (i: number) => {
    if (data.objectives.length > 1) {
      update("objectives", data.objectives.filter((_, idx) => idx !== i));
    }
  };

  const canContinue =
    data.companyActivity.trim() &&
    data.sector.trim() &&
    data.companySize.trim() &&
    data.area.trim() &&
    data.cargo.trim() &&
    data.teamSize.trim();

  const handleContinue = () => {
    localStorage.setItem("tp_leader_profile", JSON.stringify({ area: data.area, cargo: data.cargo }));
    localStorage.setItem("tp_company_profile", JSON.stringify({
      actividad: data.companyActivity,
      sector: data.sector,
      empleados: data.companySize,
    }));
    navigate("/leader/process-intro");
  };

  const inputClass =
    "flex h-12 w-full rounded-xl border border-border/60 bg-white px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--signal-positive)/0.3)] focus:border-[hsl(var(--signal-positive))] transition-all";

  const textareaClass =
    "flex w-full rounded-xl border border-border/60 bg-white px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--signal-positive)/0.3)] focus:border-[hsl(var(--signal-positive))] transition-all resize-none";

  // Step indicator dots
  const StepIndicator = () => (
    <div className="flex items-center gap-2">
      <div className="w-2 h-2 rounded-full bg-[hsl(var(--signal-positive))]" />
      <div className="w-8 h-2 rounded-full bg-[hsl(var(--signal-positive))]" />
      <div className="w-2 h-2 rounded-full bg-border" />
      <div className="w-2 h-2 rounded-full bg-border" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-[#f5f5f0]">
        <div className="max-w-3xl mx-auto px-8 pt-6 pb-4">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-semibold tracking-[0.2em] text-foreground/60 uppercase">
              Talent Performance Lab
            </span>
            <StepIndicator />
          </div>
          <div className="h-[3px] bg-gradient-to-r from-[hsl(var(--signal-positive))] via-[hsl(var(--signal-positive))] to-transparent rounded-full" style={{ width: "35%" }} />
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-8 py-8 space-y-10 animate-fade-in">
        {/* Title */}
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-foreground tracking-tight leading-[1.15]">
            Cuéntanos sobre
            <br />
            tu empresa y equipo
          </h1>
          <p className="text-base text-muted-foreground mt-3">
            Esta información nos permite personalizar los insights para tu contexto real.
          </p>
        </div>

        {/* EMPRESA */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-[0.2em] text-[hsl(var(--signal-positive))] uppercase">Empresa</span>
            <div className="flex-1 h-[1px] bg-border/60" />
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Describe brevemente a qué se dedica tu empresa</label>
            <textarea
              value={data.companyActivity}
              onChange={(e) => update("companyActivity", e.target.value as string)}
              placeholder=""
              rows={4}
              className={textareaClass}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">¿En qué sector opera?</label>
              <div className="relative">
                <select
                  value={data.sector}
                  onChange={(e) => update("sector", e.target.value)}
                  className={cn(inputClass, "appearance-none pr-10")}
                >
                  <option value="" disabled></option>
                  {SECTORS.map((s) => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-muted-foreground">
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">¿Cuantas personas trabajan en la empresa?</label>
              <input
                type="text"
                value={data.companySize}
                onChange={(e) => update("companySize", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>
        </section>

        {/* TU ROL */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-[0.2em] text-[hsl(var(--signal-positive))] uppercase">Tu Rol</span>
            <div className="flex-1 h-[1px] bg-border/60" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">¿Cuál es tu cargo?</label>
              <input
                type="text"
                value={data.cargo}
                onChange={(e) => update("cargo", e.target.value)}
                className={inputClass}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">¿Qué área lideras?</label>
              <input
                type="text"
                value={data.area}
                onChange={(e) => update("area", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm text-muted-foreground">¿Cuáles son los objetivos estratégicos de tu área?</label>
            {data.objectives.map((obj, i) => (
              <div key={i} className="flex gap-2">
                <input
                  type="text"
                  value={obj}
                  onChange={(e) => updateObjective(i, e.target.value)}
                  className={cn(inputClass, "flex-1")}
                />
                <button
                  type="button"
                  onClick={() => removeObjective(i)}
                  className="w-12 h-12 rounded-xl border border-border/60 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-colors shrink-0"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
            {data.objectives.length < 5 && (
              <button
                type="button"
                onClick={addObjective}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border/60 text-sm text-muted-foreground hover:text-foreground hover:border-border transition-colors"
              >
                <Plus className="w-4 h-4 text-[hsl(var(--signal-positive))]" />
                Agregar Objetivo
              </button>
            )}
          </div>
        </section>

        {/* EQUIPO */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-[0.2em] text-[hsl(var(--signal-positive))] uppercase">Equipo</span>
            <div className="flex-1 h-[1px] bg-border/60" />
          </div>

          <div className="space-y-2 max-w-xs">
            <label className="text-sm text-muted-foreground">¿Cuántas personas hacen parte de tu equipo?</label>
            <input
              type="text"
              value={data.teamSize}
              onChange={(e) => update("teamSize", e.target.value)}
              className={inputClass}
            />
          </div>
        </section>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-[#f5f5f0] border-t border-border/40">
        <div className="max-w-3xl mx-auto px-8 py-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Paso 1 de 3 · Contexto del equipo
          </span>
          <button
            onClick={handleContinue}
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
  );
};

export default LeaderContext;

import { useState, useEffect } from "react";
import { ArrowRight, ArrowLeft, Plus, X, Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import PageTransition from "@/components/PageTransition";
import { useNavigateWithTransition } from "@/hooks/useNavigateWithTransition";

const STORAGE_KEY = "tp_process_responsible";

interface Person {
  name: string;
  cargo: string;
  email: string;
}

const ProcessResponsible = () => {
  const navigate = useNavigateWithTransition();
  const [responsible, setResponsible] = useState<Person>({ name: "", cargo: "", email: "" });
  const [others, setOthers] = useState<Person[]>([]);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.responsible) setResponsible(parsed.responsible);
        if (parsed.others) setOthers(parsed.others);
      }
    } catch {}
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ responsible, others }));
  }, [responsible, others]);

  const updateResponsible = (field: keyof Person, value: string) => {
    setResponsible(prev => ({ ...prev, [field]: value }));
  };

  const addOther = () => {
    setOthers(prev => [...prev, { name: "", cargo: "", email: "" }]);
  };

  const updateOther = (index: number, field: keyof Person, value: string) => {
    setOthers(prev => prev.map((p, i) => i === index ? { ...p, [field]: value } : p));
  };

  const removeOther = (index: number) => {
    setOthers(prev => prev.filter((_, i) => i !== index));
  };

  const canContinue = responsible.name.trim();

  const handleContinue = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ responsible, others }));
    navigate("/leader/diagnostic-processing");
  };

  const inputClass =
    "flex h-12 w-full rounded-xl border border-border/60 bg-white px-4 text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-[hsl(var(--signal-positive)/0.3)] focus:border-[hsl(var(--signal-positive))] transition-all";

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
          <div className="h-[3px] bg-gradient-to-r from-[hsl(var(--signal-positive))] via-[hsl(var(--signal-positive))] to-transparent rounded-full" style={{ width: "75%" }} />
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-8 py-8 space-y-10 pb-28">
        {/* Title */}
        <div className="space-y-3">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground tracking-tight leading-tight">
            Cuéntanos sobre{"\n"}
            <br />tu empresa y equipo
          </h1>
          <p className="text-base text-muted-foreground leading-relaxed">
            Entenderemos cómo se ejecuta el trabajo desde quienes lo viven, <span className="font-semibold text-foreground">no solo desde la estrategia.</span>
          </p>
        </div>

        {/* Responsable principal */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-[0.15em] text-[hsl(var(--signal-positive))] uppercase">
              Responsable principal
            </span>
            <div className="flex-1 h-px bg-border/60" />
          </div>

          <div className="rounded-2xl border border-border/60 bg-white p-6 space-y-5">
            {/* Badge header */}
            <div className="flex items-center gap-3 bg-[hsl(var(--signal-positive)/0.06)] rounded-xl px-4 py-2.5">
              <span className="text-xs font-bold tracking-[0.1em] text-[hsl(var(--signal-positive))] uppercase bg-[hsl(var(--signal-positive)/0.15)] px-3 py-1 rounded-lg">
                Responsable
              </span>
              <span className="text-sm text-muted-foreground">
                La persona que más conoce cómo funciona este proceso
              </span>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground">Nombre</label>
              <input
                type="text"
                value={responsible.name}
                onChange={(e) => updateResponsible("name", e.target.value)}
                className={inputClass}
                placeholder=""
              />
            </div>

            {/* Cargo + Email */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Cargo</label>
                <input
                  type="text"
                  value={responsible.cargo}
                  onChange={(e) => updateResponsible("cargo", e.target.value)}
                  className={inputClass}
                  placeholder="Ej: Gerente de ventas"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Correo electrónico</label>
                <input
                  type="email"
                  value={responsible.email}
                  onChange={(e) => updateResponsible("email", e.target.value)}
                  className={inputClass}
                  placeholder="Ej: Isabellachacon0@gmail.com"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Otras personas involucradas */}
        <div className="space-y-5">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold tracking-[0.15em] text-[hsl(var(--signal-positive))] uppercase">
              Otras personas involucradas
            </span>
            <span className="text-xs text-muted-foreground">(opcional)</span>
            <div className="flex-1 h-px bg-border/60" />
          </div>

          {/* Other people cards */}
          {others.map((person, index) => (
            <div key={index} className="rounded-2xl border border-border/60 bg-white p-6 space-y-4 relative">
              <button
                onClick={() => removeOther(index)}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-foreground">Nombre</label>
                <input
                  type="text"
                  value={person.name}
                  onChange={(e) => updateOther(index, "name", e.target.value)}
                  className={inputClass}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Cargo</label>
                  <input
                    type="text"
                    value={person.cargo}
                    onChange={(e) => updateOther(index, "cargo", e.target.value)}
                    className={inputClass}
                    placeholder="Ej: Gerente de ventas"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">Correo electrónico</label>
                  <input
                    type="email"
                    value={person.email}
                    onChange={(e) => updateOther(index, "email", e.target.value)}
                    className={inputClass}
                    placeholder="Ej: correo@empresa.com"
                  />
                </div>
              </div>
            </div>
          ))}

          {/* Add button */}
          <button
            onClick={addOther}
            className="w-full py-4 rounded-xl border border-border/60 text-sm font-medium text-muted-foreground hover:text-foreground hover:border-border transition-colors"
          >
            + Agregar otra persona
          </button>
        </div>

        {/* Info banner */}
        <div className="flex items-start gap-4 bg-[hsl(var(--signal-positive)/0.06)] rounded-2xl p-5 border border-[hsl(var(--signal-positive)/0.15)]">
          <div className="w-10 h-10 rounded-xl bg-[hsl(var(--signal-positive)/0.15)] flex items-center justify-center shrink-0">
            <Mail className="w-5 h-5 text-[hsl(var(--signal-positive))]" />
          </div>
          <p className="text-sm text-muted-foreground leading-relaxed">
            <span className="font-semibold text-foreground">Les enviaremos acceso por correo.</span>{" "}
            Cada persona recibirá un link personalizado para participar en el diagnóstico de este proceso desde su perspectiva.
          </p>
        </div>
      </div>

      {/* Footer */}
      <div className="sticky bottom-0 bg-[#f5f5f0] border-t border-border/40">
        <div className="max-w-3xl mx-auto px-8 py-4 flex items-center justify-between">
          <span className="text-sm text-muted-foreground">
            Paso 3 de 3 · Equipo ejecutor
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
            Finalizar
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
    </PageTransition>
  );
};

export default ProcessResponsible;

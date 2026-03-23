import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Plus, Trash2, Target, User, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { trackEvent } from "@/lib/trackEvent";

const STORAGE_KEY = "tp_leader_context";

const AREAS = [
  "Recursos Humanos",
  "Operaciones",
  "Logística",
  "Finanzas",
  "Comercial / Ventas",
  "Producción",
  "Tecnología",
  "Calidad",
  "Administración",
  "Otro",
];

interface LeaderFormData {
  processName: string;
  processObjective: string;
  successMetric: string;
  responsibleName: string;
  responsibleEmail: string;
  area: string;
  problems: string[];
  performanceIssue: string;
}

const defaultData: LeaderFormData = {
  processName: "",
  processObjective: "",
  successMetric: "",
  responsibleName: "",
  responsibleEmail: "",
  area: "",
  problems: [""],
  performanceIssue: "",
};

const LeaderContext = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<LeaderFormData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Migrate from old format
        if (parsed.actividad !== undefined) return defaultData;
        return { ...defaultData, ...parsed };
      } catch {}
    }
    return defaultData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const update = <K extends keyof LeaderFormData>(key: K, value: LeaderFormData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const addProblem = () => {
    if (data.problems.length < 3) {
      trackEvent("click_add_problem");
      update("problems", [...data.problems, ""]);
    }
  };

  const updateProblem = (i: number, val: string) => {
    const list = [...data.problems];
    list[i] = val;
    update("problems", list);
  };

  const removeProblem = (i: number) => {
    if (data.problems.length > 1) {
      update("problems", data.problems.filter((_, idx) => idx !== i));
    }
  };

  const handleAddProcess = () => {
    trackEvent("click_add_process");
    // Non-functional in MVP — only tracking
  };

  const canContinue =
    data.processName.trim() &&
    data.processObjective.trim() &&
    data.successMetric.trim() &&
    data.responsibleName.trim() &&
    data.responsibleEmail.trim() &&
    data.area.trim() &&
    data.problems.some((p) => p.trim());

  const handleContinue = () => {
    // Save for backward compatibility
    localStorage.setItem(
      "tp_company_profile",
      JSON.stringify({ actividad: data.processName, sedes: "1", empleados: "0" })
    );
    localStorage.setItem(
      "tp_leader_profile",
      JSON.stringify({ area: data.area, cargo: data.responsibleName })
    );
    localStorage.setItem(
      "tp_team_processes",
      JSON.stringify([data.processName])
    );
    localStorage.setItem(
      "tp_process_selection",
      JSON.stringify({ area: data.area, process: data.processName })
    );
    // Save process intake data for plan generation
    localStorage.setItem(
      "tp_process_intake_simple",
      JSON.stringify({
        processName: data.processName,
        objective: data.processObjective,
        metric: data.successMetric,
        responsible: { name: data.responsibleName, email: data.responsibleEmail },
        area: data.area,
        problems: data.problems.filter((p) => p.trim()),
        performanceIssue: data.performanceIssue,
      })
    );
    navigate("/leader/team-setup");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12 animate-fade-in space-y-10">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase text-center">
          Talent Performance Lab
        </p>

        <div>
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Configura tu proceso
          </h1>
          <p className="text-muted-foreground mt-2">
            Responde estas preguntas clave para generar tu plan de trabajo.
          </p>
        </div>

        {/* 1. Process Name */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[hsl(var(--signal-positive))]" />
            <h2 className="text-lg font-semibold text-foreground">Proceso</h2>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Nombre del proceso</Label>
            <Input
              value={data.processName}
              onChange={(e) => update("processName", e.target.value)}
              placeholder="Ej. Selección de personal, Despacho de mercancía…"
              className="h-11"
            />
          </div>

          {/* 2. Objective */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Objetivo principal del proceso</Label>
            <Textarea
              value={data.processObjective}
              onChange={(e) => update("processObjective", e.target.value)}
              placeholder="Ej. Reducir el tiempo de contratación a menos de 15 días"
              rows={2}
            />
          </div>

          {/* 3. Success Metric */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">¿Cómo se mide el éxito actualmente? (1 métrica)</Label>
            <Input
              value={data.successMetric}
              onChange={(e) => update("successMetric", e.target.value)}
              placeholder="Ej. Tiempo promedio de contratación: 22 días"
              className="h-11"
            />
          </div>
        </section>

        {/* 4. Responsible */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[hsl(var(--signal-positive))]" />
            <h2 className="text-lg font-semibold text-foreground">Responsable</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Nombre</Label>
              <Input
                value={data.responsibleName}
                onChange={(e) => update("responsibleName", e.target.value)}
                placeholder="Nombre completo"
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Correo</Label>
              <Input
                type="email"
                value={data.responsibleEmail}
                onChange={(e) => update("responsibleEmail", e.target.value)}
                placeholder="correo@empresa.com"
                className="h-11"
              />
            </div>
          </div>
        </section>

        {/* 5. Area */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <Target className="w-5 h-5 text-[hsl(var(--signal-positive))]" />
            <h2 className="text-lg font-semibold text-foreground">Área</h2>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">Selecciona el área</Label>
            <Select value={data.area} onValueChange={(v) => update("area", v)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecciona un área" />
              </SelectTrigger>
              <SelectContent>
                {AREAS.map((a) => (
                  <SelectItem key={a} value={a}>{a}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </section>

        {/* 6. Top 3 Problems */}
        <section className="space-y-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Top 3 problemas actuales</h2>
            <p className="text-sm text-muted-foreground mt-1">¿Cuáles son los principales dolores de este proceso?</p>
          </div>

          <div className="space-y-3">
            {data.problems.map((p, i) => (
              <div key={i} className="flex gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm text-muted-foreground font-medium w-6 shrink-0">{i + 1}.</span>
                  <Input
                    value={p}
                    onChange={(e) => updateProblem(i, e.target.value)}
                    placeholder={["Ej. Demoras en aprobaciones", "Ej. Falta de seguimiento", "Ej. Roles poco claros"][i] || ""}
                    className="h-11"
                  />
                </div>
                {data.problems.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removeProblem(i)} className="shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            {data.problems.length < 3 && (
              <Button variant="outline" size="sm" onClick={addProblem}>
                <Plus className="w-4 h-4 mr-1" /> Agregar problema
              </Button>
            )}
          </div>
        </section>

        {/* 7. Optional: Performance Issue */}
        <section className="space-y-3">
          <div className="space-y-2">
            <Label className="text-sm font-medium">
              ¿Qué está afectando el rendimiento hoy? <span className="text-muted-foreground font-normal">(opcional)</span>
            </Label>
            <Textarea
              value={data.performanceIssue}
              onChange={(e) => update("performanceIssue", e.target.value)}
              placeholder="Describe brevemente lo que más impacta la operación…"
              rows={2}
            />
          </div>
        </section>

        {/* Continue */}
        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white h-12 text-base font-semibold"
        >
          Continuar
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>

        {/* Non-functional MVP button */}
        <div className="text-center pt-2">
          <Button
            variant="ghost"
            className="text-muted-foreground text-sm"
            onClick={handleAddProcess}
          >
            <Plus className="w-4 h-4 mr-1" />
            Agregar otro proceso
          </Button>
          <p className="text-xs text-muted-foreground mt-1">Disponible próximamente</p>
        </div>
      </div>
    </div>
  );
};

export default LeaderContext;

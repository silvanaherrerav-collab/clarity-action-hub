import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Plus, Trash2, Building2, User, Users, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const STORAGE_KEY = "tp_leader_context";

interface LeaderContextData {
  // Company
  actividad: string;
  sedes: string;
  empleados: string;
  // Leader
  area: string;
  cargo: string;
  // Team
  teamSize: string;
  // Processes
  processes: string[];
}

const defaultData: LeaderContextData = {
  actividad: "",
  sedes: "",
  empleados: "",
  area: "",
  cargo: "",
  teamSize: "",
  processes: [""],
};

const LeaderContext = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<LeaderContextData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultData, ...JSON.parse(saved) } : defaultData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  }, [data]);

  const update = <K extends keyof LeaderContextData>(key: K, value: LeaderContextData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
  };

  const addProcess = () => {
    update("processes", [...data.processes, ""]);
  };

  const updateProcess = (i: number, val: string) => {
    const list = [...data.processes];
    list[i] = val;
    update("processes", list);
  };

  const removeProcess = (i: number) => {
    if (data.processes.length > 1) {
      update("processes", data.processes.filter((_, idx) => idx !== i));
    }
  };

  const canContinue =
    data.actividad.trim() &&
    data.sedes.trim() &&
    data.empleados.trim() &&
    data.area.trim() &&
    data.cargo.trim() &&
    data.teamSize.trim() &&
    data.processes.some((p) => p.trim());

  const handleContinue = () => {
    // Also save to separate keys for backward compatibility
    localStorage.setItem(
      "tp_company_profile",
      JSON.stringify({
        actividad: data.actividad,
        sedes: data.sedes,
        empleados: data.empleados,
      })
    );
    localStorage.setItem(
      "tp_leader_profile",
      JSON.stringify({
        area: data.area,
        cargo: data.cargo,
      })
    );
    localStorage.setItem(
      "tp_team_processes",
      JSON.stringify(data.processes.filter((p) => p.trim()))
    );
    navigate("/leader/team-setup");
  };

  const placeholders = [
    "Ej. Selección",
    "Ej. Nómina",
    "Ej. SST",
    "Ej. Onboarding",
    "Ej. Logística de despacho",
    "Ej. Gestión de cartera",
  ];

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12 animate-fade-in space-y-10">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase text-center">
          Talent Performance Lab
        </p>

        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Comencemos con algo de contexto
        </h1>

        {/* Section 1: Empresa */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[hsl(var(--signal-positive))]" />
            <h2 className="text-lg font-semibold text-foreground">Empresa</h2>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">¿A qué se dedica la empresa?</Label>
            <Textarea
              value={data.actividad}
              onChange={(e) => update("actividad", e.target.value)}
              placeholder="Ej. Manufactura de alimentos, servicios financieros, logística…"
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">¿Cuántas sedes u operaciones tiene?</Label>
            <Input
              value={data.sedes}
              onChange={(e) => update("sedes", e.target.value)}
              placeholder="Ej. 3 sedes"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">¿Aproximadamente cuántos empleados tiene?</Label>
            <Input
              type="number"
              value={data.empleados}
              onChange={(e) => update("empleados", e.target.value)}
              placeholder="Ej. 150"
              className="h-11"
            />
          </div>
        </section>

        {/* Section 2: Líder */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[hsl(var(--signal-positive))]" />
            <h2 className="text-lg font-semibold text-foreground">Líder</h2>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">¿Qué área lideras?</Label>
            <Input
              value={data.area}
              onChange={(e) => update("area", e.target.value)}
              placeholder="Ej. Recursos Humanos, Logística, Operaciones…"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">¿Cuál es tu cargo?</Label>
            <Input
              value={data.cargo}
              onChange={(e) => update("cargo", e.target.value)}
              placeholder="Ej. Director de RRHH, Gerente de Operaciones…"
              className="h-11"
            />
          </div>
        </section>

        {/* Section 3: Equipo */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[hsl(var(--signal-positive))]" />
            <h2 className="text-lg font-semibold text-foreground">Equipo</h2>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">¿Cuántas personas tiene tu equipo?</Label>
            <Input
              type="number"
              value={data.teamSize}
              onChange={(e) => update("teamSize", e.target.value)}
              placeholder="Ej. 8"
              className="h-11"
              min="1"
            />
          </div>
        </section>

        {/* Section 4: Procesos */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <Layers className="w-5 h-5 text-[hsl(var(--signal-positive))]" />
            <h2 className="text-lg font-semibold text-foreground">Procesos del equipo</h2>
          </div>

          <p className="text-sm text-muted-foreground">
            ¿Qué procesos principales gestiona tu equipo?
          </p>

          <div className="space-y-3">
            {data.processes.map((proc, i) => (
              <div key={i} className="flex gap-2">
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm text-muted-foreground font-medium w-20 shrink-0">
                    Proceso {i + 1}
                  </span>
                  <Input
                    value={proc}
                    onChange={(e) => updateProcess(i, e.target.value)}
                    placeholder={placeholders[i % placeholders.length]}
                    className="h-11"
                  />
                </div>
                {data.processes.length > 1 && (
                  <Button variant="ghost" size="icon" onClick={() => removeProcess(i)} className="shrink-0">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
            <Button variant="outline" size="sm" onClick={addProcess}>
              <Plus className="w-4 h-4 mr-1" /> Agregar proceso
            </Button>
          </div>
        </section>

        <Button
          onClick={handleContinue}
          disabled={!canContinue}
          className="w-full bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white h-12 text-base font-semibold"
        >
          Continuar
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default LeaderContext;

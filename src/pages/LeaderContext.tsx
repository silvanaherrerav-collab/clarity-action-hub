import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2, User, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const STORAGE_KEY = "tp_leader_context";

const SECTORS = [
  "Manufactura", "Servicios financieros", "Tecnología", "Retail / Comercio",
  "Logística y transporte", "Salud", "Educación", "Construcción",
  "Energía", "Consultoría", "Gobierno / Sector público", "Otro",
];

const AREAS = [
  "Recursos Humanos", "Operaciones", "Logística", "Finanzas",
  "Comercial / Ventas", "Producción", "Tecnología", "Calidad",
  "Administración", "Otro",
];

interface ContextData {
  companyActivity: string;
  sector: string;
  companySize: string;
  area: string;
  cargo: string;
  teamSize: string;
}

const defaultData: ContextData = {
  companyActivity: "",
  sector: "",
  companySize: "",
  area: "",
  cargo: "",
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

  const update = <K extends keyof ContextData>(key: K, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
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

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12 animate-fade-in space-y-10">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase text-center">
          Talent Performance Lab
        </p>

        <div className="text-center">
          <h1 className="text-3xl font-bold text-foreground tracking-tight">
            Cuéntanos sobre tu empresa y tu equipo
          </h1>
        </div>

        {/* Empresa */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-[hsl(var(--signal-positive))]" />
            <h2 className="text-base font-semibold text-foreground">Empresa</h2>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">¿A qué se dedica tu empresa?</Label>
            <Textarea
              value={data.companyActivity}
              onChange={(e) => update("companyActivity", e.target.value)}
              placeholder="Ej. Manufactura de alimentos, servicios financieros…"
              rows={2}
              className="resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">¿En qué sector opera?</Label>
            <Select value={data.sector} onValueChange={(v) => update("sector", v)}>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Selecciona un sector" />
              </SelectTrigger>
              <SelectContent>
                {SECTORS.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">¿Cuántas personas trabajan en la empresa?</Label>
            <Input
              type="number"
              value={data.companySize}
              onChange={(e) => update("companySize", e.target.value)}
              placeholder="Ej. 150"
              className="h-11"
            />
          </div>
        </section>

        {/* Rol */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-[hsl(var(--signal-positive))]" />
            <h2 className="text-base font-semibold text-foreground">Rol</h2>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">¿Qué área lideras?</Label>
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

          <div className="space-y-2">
            <Label className="text-sm font-medium">¿Cuál es tu cargo?</Label>
            <Input
              value={data.cargo}
              onChange={(e) => update("cargo", e.target.value)}
              placeholder="Ej. Director de Operaciones"
              className="h-11"
            />
          </div>
        </section>

        {/* Equipo */}
        <section className="space-y-5">
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-[hsl(var(--signal-positive))]" />
            <h2 className="text-base font-semibold text-foreground">Equipo</h2>
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">¿Cuántas personas hacen parte de tu equipo?</Label>
            <Input
              type="number"
              value={data.teamSize}
              onChange={(e) => update("teamSize", e.target.value)}
              placeholder="Ej. 12"
              className="h-11"
            />
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

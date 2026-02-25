import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const STORAGE_KEY = "tp_company_profile";

interface CompanyProfile {
  actividad: string;
  sedes: string;
  empleados: string;
  complejidadOperativa: string;
}

const defaultProfile: CompanyProfile = {
  actividad: "",
  sedes: "",
  empleados: "",
  complejidadOperativa: "",
};

const CompanySetup = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<CompanyProfile>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? { ...defaultProfile, ...JSON.parse(saved) } : defaultProfile;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  const update = (key: keyof CompanyProfile, value: string) => {
    setProfile((prev) => ({ ...prev, [key]: value }));
  };

  const canContinue =
    profile.actividad.trim() &&
    profile.sedes.trim() &&
    profile.empleados.trim() &&
    profile.complejidadOperativa.trim();

  const handleContinue = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
    navigate("/leader/process-selection");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12 animate-fade-in space-y-10">
        {/* Branding */}
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase text-center">
          Talent Performance Lab
        </p>

        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[hsl(var(--signal-positive)/0.1)] flex items-center justify-center">
            <Building2 className="w-5 h-5 text-[hsl(var(--signal-positive))]" />
          </div>
          <div>
            <h1 className="text-3xl font-bold text-foreground tracking-tight">
              Configura la información general de tu empresa
            </h1>
          </div>
        </div>

        <p className="text-muted-foreground">
          Esta información se registra una sola vez y aplica a todos los procesos que configures.
        </p>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label className="text-sm font-medium">¿A qué se dedica la empresa?</Label>
            <Textarea
              value={profile.actividad}
              onChange={(e) => update("actividad", e.target.value)}
              placeholder="Ej. Manufactura de alimentos, servicios financieros, logística…"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">¿Cuántas sedes o ubicaciones operativas tiene?</Label>
            <Input
              value={profile.sedes}
              onChange={(e) => update("sedes", e.target.value)}
              placeholder="Ej. 3 sedes"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">¿Aproximadamente cuántos empleados tiene?</Label>
            <Input
              type="number"
              value={profile.empleados}
              onChange={(e) => update("empleados", e.target.value)}
              placeholder="Ej. 150"
              className="h-11"
            />
          </div>

          <div className="space-y-2">
            <Label className="text-sm font-medium">¿Qué hace que la operación sea compleja hoy?</Label>
            <Textarea
              value={profile.complejidadOperativa}
              onChange={(e) => update("complejidadOperativa", e.target.value)}
              placeholder="Demanda, variabilidad, dependencia de otras áreas, etc."
              rows={3}
            />
          </div>
        </div>

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

export default CompanySetup;

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const STORAGE_KEY = "tp_process_selection";

// Area is already stored in leader profile — read it
const getLeaderArea = (): string => {
  try {
    const raw = localStorage.getItem("tp_leader_profile");
    if (raw) {
      const profile = JSON.parse(raw);
      return profile.area || "";
    }
    // Fallback: check process selection for legacy data
    const selRaw = localStorage.getItem(STORAGE_KEY);
    if (selRaw) {
      const sel = JSON.parse(selRaw);
      return sel.area || "";
    }
  } catch {}
  return "";
};

const RRHH_PROCESSES = [
  "Selección",
  "Nómina",
  "Onboarding",
  "Bienestar",
  "SST",
  "Evaluación de desempeño",
];

const GENERIC_PROCESSES = ["Proceso principal del área"];

const ProcessSelection = () => {
  const navigate = useNavigate();
  const leaderArea = getLeaderArea();

  const [selectedProcess, setSelectedProcess] = useState("");
  const [customProcess, setCustomProcess] = useState("");

  const effectiveProcess = selectedProcess === "Otro" ? customProcess.trim() : selectedProcess;

  const processes = leaderArea === "Recursos Humanos" ? RRHH_PROCESSES : GENERIC_PROCESSES;

  const canContinue = !!effectiveProcess;

  const handleContinue = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ area: leaderArea, process: effectiveProcess })
    );
    navigate("/leader/team-setup");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12 animate-fade-in space-y-10">
        {/* Branding */}
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase text-center">
          Talent Performance Lab
        </p>

        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Define el alcance del plan de trabajo
        </h1>

        {leaderArea && (
          <div className="bg-card border border-border rounded-xl p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-semibold text-foreground">Área:</span> {leaderArea}
            </p>
          </div>
        )}

        {/* Process selection */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">¿Qué proceso deseas estructurar y mejorar en este momento?</Label>
          <RadioGroup value={selectedProcess} onValueChange={setSelectedProcess}>
            {processes.map((proc) => (
              <div key={proc} className="flex items-center space-x-3">
                <RadioGroupItem value={proc} id={`proc-${proc}`} />
                <Label htmlFor={`proc-${proc}`} className="text-sm cursor-pointer">{proc}</Label>
              </div>
            ))}
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="Otro" id="proc-otro" />
              <Label htmlFor="proc-otro" className="text-sm cursor-pointer">Otro</Label>
            </div>
          </RadioGroup>
          {selectedProcess === "Otro" && (
            <Input
              value={customProcess}
              onChange={(e) => setCustomProcess(e.target.value)}
              placeholder="Escribe el nombre del proceso"
              className="h-11 mt-2"
            />
          )}
        </div>

        {/* CTA */}
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

export default ProcessSelection;

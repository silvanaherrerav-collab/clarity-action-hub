import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const STORAGE_KEY = "tp_process_selection";

const AREAS = [
  "Recursos Humanos",
  "Tesorería",
  "Contabilidad",
  "Logística",
  "Comercial",
  "Operaciones",
];

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

  const [selectedArea, setSelectedArea] = useState("");
  const [customArea, setCustomArea] = useState("");
  const [selectedProcess, setSelectedProcess] = useState("");
  const [customProcess, setCustomProcess] = useState("");

  const effectiveArea = selectedArea === "Otra" ? customArea.trim() : selectedArea;
  const effectiveProcess = selectedProcess === "Otro" ? customProcess.trim() : selectedProcess;

  const processes = selectedArea === "Recursos Humanos" ? RRHH_PROCESSES : GENERIC_PROCESSES;

  const canContinue = effectiveArea && effectiveProcess;

  const handleContinue = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ area: effectiveArea, process: effectiveProcess })
    );
    navigate("/leader/process-intake");
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

        {/* Question 1 — Area */}
        <div className="space-y-4">
          <Label className="text-base font-semibold">¿A qué área pertenece este equipo?</Label>
          <RadioGroup value={selectedArea} onValueChange={(v) => { setSelectedArea(v); setSelectedProcess(""); setCustomProcess(""); }}>
            {AREAS.map((area) => (
              <div key={area} className="flex items-center space-x-3">
                <RadioGroupItem value={area} id={`area-${area}`} />
                <Label htmlFor={`area-${area}`} className="text-sm cursor-pointer">{area}</Label>
              </div>
            ))}
            <div className="flex items-center space-x-3">
              <RadioGroupItem value="Otra" id="area-otra" />
              <Label htmlFor="area-otra" className="text-sm cursor-pointer">Otra</Label>
            </div>
          </RadioGroup>
          {selectedArea === "Otra" && (
            <Input
              value={customArea}
              onChange={(e) => setCustomArea(e.target.value)}
              placeholder="Escribe el nombre del área"
              className="h-11 mt-2"
            />
          )}
        </div>

        {/* Question 2 — Process (only after area selected) */}
        {selectedArea && (
          <div className="space-y-4 animate-fade-in">
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
        )}

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

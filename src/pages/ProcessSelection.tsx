import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

const STORAGE_KEY = "tp_process_selection";

const ProcessSelection = () => {
  const navigate = useNavigate();
  const [selectedProcess, setSelectedProcess] = useState("");

  // Read processes from leader context
  const processesRaw = localStorage.getItem("tp_team_processes");
  const processes: string[] = processesRaw ? JSON.parse(processesRaw) : [];

  const handleContinue = () => {
    const area = (() => {
      try {
        const raw = localStorage.getItem("tp_leader_profile");
        return raw ? JSON.parse(raw).area || "" : "";
      } catch { return ""; }
    })();

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ area, process: selectedProcess })
    );
    navigate("/leader/process-intake");
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-6 py-12 animate-fade-in space-y-10">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase text-center">
          Talent Performance Lab
        </p>

        <h1 className="text-3xl font-bold text-foreground tracking-tight">
          Selecciona el proceso que deseas estructurar
        </h1>

        {processes.length > 0 ? (
          <div className="space-y-4">
            <Label className="text-base font-semibold">Procesos de tu equipo</Label>
            <RadioGroup value={selectedProcess} onValueChange={setSelectedProcess}>
              {processes.map((proc) => (
                <div key={proc} className="flex items-center space-x-3">
                  <RadioGroupItem value={proc} id={`proc-${proc}`} />
                  <Label htmlFor={`proc-${proc}`} className="text-sm cursor-pointer">{proc}</Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        ) : (
          <p className="text-muted-foreground">No se encontraron procesos. Vuelve al paso anterior para definirlos.</p>
        )}

        <Button
          onClick={handleContinue}
          disabled={!selectedProcess}
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

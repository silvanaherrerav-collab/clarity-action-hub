import { useNavigate } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const LeaderTransition = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6 py-12 animate-fade-in space-y-8">
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase text-center">
          Talent Performance Lab
        </p>

        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold text-foreground tracking-tight leading-tight">
            Antes de intervenir la cultura, construyamos claridad.
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Primero entendamos cómo funciona el trabajo en tu equipo.
          </p>
        </div>

        <Button
          onClick={() => navigate("/leader/process-selection")}
          className="w-full bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white h-12 text-base font-semibold"
        >
          Definir proceso
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default LeaderTransition;

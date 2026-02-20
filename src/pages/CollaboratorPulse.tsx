import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck } from "lucide-react";
import { addPulse } from "@/lib/actionsStore";

const ACTION_ID = "one_on_one_calibration";

const CollaboratorPulse = () => {
  const navigate = useNavigate();
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState<"yes" | "no" | "na" | null>(null);

  const handleAnswer = (answer: "yes" | "no" | "na") => {
    setSelected(answer);
  };

  const handleSubmit = () => {
    if (!selected) return;
    addPulse({
      actionId: ACTION_ID,
      answer: selected,
      submittedAt: new Date().toISOString(),
    });
    setSubmitted(true);
  };

  const handleClose = () => {
    navigate("/collaborator/thanks");
  };

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center px-4">
        <div className="max-w-sm w-full text-center space-y-6">
          <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6 text-primary" />
          </div>
          <div className="space-y-2">
            <h1 className="text-xl font-semibold text-foreground">Respuesta registrada</h1>
            <p className="text-sm text-muted-foreground">
              Tu confirmación es completamente anónima. Gracias.
            </p>
          </div>
          <Button
            onClick={handleClose}
            className="bg-primary hover:bg-primary/90 text-primary-foreground w-full"
          >
            Cerrar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <div className="max-w-sm w-full space-y-8">
        {/* Branding */}
        <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase">
          Talent Performance Lab
        </p>

        {/* Anonymity badge */}
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-primary" />
          <span className="text-xs font-medium text-primary">
            Tu respuesta es completamente anónima
          </span>
        </div>

        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-foreground leading-tight">
            Confirmación rápida
          </h1>
          <p className="text-sm text-muted-foreground">
            Tu líder solo verá resultados agregados del equipo, nunca respuestas individuales.
          </p>
        </div>

        <div className="space-y-4">
          <p className="text-base font-medium text-foreground">
            ¿Tuviste una reunión 1:1 esta semana para revisar el plan de trabajo?
          </p>

          <div className="space-y-2">
            {(
              [
                { value: "yes", label: "Sí" },
                { value: "no", label: "No" },
                { value: "na", label: "Aún no / No aplica" },
              ] as const
            ).map(({ value, label }) => (
              <button
                key={value}
                onClick={() => handleAnswer(value)}
                className={`w-full text-left px-4 py-3 rounded-lg border text-sm font-medium transition-colors ${
                  selected === value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-foreground hover:border-primary/50 hover:bg-muted/50"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!selected}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground disabled:opacity-40"
        >
          Confirmar respuesta
        </Button>
      </div>
    </div>
  );
};

export default CollaboratorPulse;

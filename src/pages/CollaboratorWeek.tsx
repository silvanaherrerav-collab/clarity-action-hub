import { useState } from "react";
import { CheckCircle2, ShieldCheck, AlertTriangle } from "lucide-react";
import { trackEvent } from "@/lib/trackEvent";

const CollaboratorWeek = () => {
  const [clarityResponse, setClarityResponse] = useState<string | null>(null);
  const [blockageResponse, setBlockageResponse] = useState<string | null>(null);
  const [feelingResponse, setFeelingResponse] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!clarityResponse || !blockageResponse) return;
    const entry = {
      weekId: new Date().toISOString().slice(0, 10),
      clarityResponse,
      blockageResponse,
      feelingResponse,
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("tp_checkins") || "[]");
    existing.push(entry);
    localStorage.setItem("tp_checkins", JSON.stringify(existing));
    trackEvent("checkin_submitted", { clarity: clarityResponse, blockage: blockageResponse });
    setSubmitted(true);
  };

  const optionBtnClass = (selected: boolean) =>
    `px-4 py-2.5 rounded-xl text-sm font-medium border-2 transition-all ${
      selected
        ? "border-[hsl(var(--signal-positive))] bg-[hsl(var(--signal-positive)/0.08)] text-[hsl(var(--signal-positive))]"
        : "border-border bg-card text-foreground hover:border-muted-foreground"
    }`;

  const feelingEmojis = [
    { value: 1, emoji: "😞", label: "Mal" },
    { value: 2, emoji: "😐", label: "Regular" },
    { value: 3, emoji: "🙂", label: "Bien" },
    { value: 4, emoji: "😊", label: "Muy bien" },
    { value: 5, emoji: "🚀", label: "Excelente" },
  ];

  if (submitted) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center max-w-sm space-y-4 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-[hsl(var(--signal-positive)/0.1)] flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8 text-[hsl(var(--signal-positive))]" />
          </div>
          <h2 className="text-xl font-semibold text-foreground">Check-in registrado</h2>
          <p className="text-sm text-muted-foreground">Gracias por tu participación. Tu respuesta ayuda a mejorar el proceso.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-xl mx-auto px-6 py-12 space-y-8 animate-fade-in">
        <div>
          <p className="text-xs font-semibold tracking-widest text-muted-foreground uppercase text-center mb-6">
            Talent Performance Lab
          </p>
          <h1 className="text-2xl font-bold text-foreground tracking-tight text-center">
            Check-in de cultura
          </h1>
          <p className="text-muted-foreground text-center mt-2">
            Responde rápidamente — toma menos de 1 minuto.
          </p>
        </div>

        {/* Confidentiality Notice */}
        <div className="flex items-start gap-3 p-4 rounded-xl bg-[hsl(var(--signal-positive)/0.06)] border border-[hsl(var(--signal-positive)/0.15)]">
          <ShieldCheck className="w-5 h-5 text-[hsl(var(--signal-positive))] mt-0.5 shrink-0" />
          <p className="text-sm text-muted-foreground">
            Tus respuestas se usan para mejorar el proceso, <span className="font-medium text-foreground">no para evaluación individual.</span>
          </p>
        </div>

        {/* Q1: Clarity */}
        <div className="bg-card border border-border rounded-2xl p-6 card-shadow space-y-4">
          <p className="text-sm font-semibold text-foreground">1. ¿Tus prioridades están claras?</p>
          <div className="flex flex-wrap gap-2">
            {["Sí", "Más o menos", "No"].map((opt) => (
              <button key={opt} className={optionBtnClass(clarityResponse === opt)} onClick={() => setClarityResponse(opt)}>
                {opt}
              </button>
            ))}
          </div>
        </div>

        {/* Q2: Blockages */}
        <div className="bg-card border border-border rounded-2xl p-6 card-shadow space-y-4">
          <p className="text-sm font-semibold text-foreground">2. ¿Tienes bloqueos?</p>
          <div className="flex flex-wrap gap-2">
            {[
              { label: "No", icon: null },
              { label: "Sí (leve)", icon: null },
              { label: "Sí (crítico)", icon: <AlertTriangle className="w-3.5 h-3.5 mr-1" /> },
            ].map((opt) => (
              <button key={opt.label} className={optionBtnClass(blockageResponse === opt.label)} onClick={() => setBlockageResponse(opt.label)}>
                <span className="flex items-center">
                  {opt.icon}
                  {opt.label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Q3: Optional Feeling */}
        <div className="bg-card border border-border rounded-2xl p-6 card-shadow space-y-4">
          <p className="text-sm font-semibold text-foreground">
            3. ¿Cómo te sientes trabajando en este proceso? <span className="text-muted-foreground font-normal">(opcional)</span>
          </p>
          <div className="flex justify-between gap-2">
            {feelingEmojis.map((f) => (
              <button
                key={f.value}
                onClick={() => setFeelingResponse(f.value)}
                className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border-2 transition-all ${
                  feelingResponse === f.value
                    ? "border-[hsl(var(--signal-positive))] bg-[hsl(var(--signal-positive)/0.08)]"
                    : "border-border hover:border-muted-foreground"
                }`}
              >
                <span className="text-2xl">{f.emoji}</span>
                <span className="text-[10px] text-muted-foreground">{f.label}</span>
              </button>
            ))}
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={!clarityResponse || !blockageResponse}
          className="w-full py-3 rounded-xl font-semibold text-base bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Enviar check-in
        </button>
      </div>
    </div>
  );
};

export default CollaboratorWeek;

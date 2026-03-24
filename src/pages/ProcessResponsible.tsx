import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Loader2, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const ProcessResponsible = () => {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const processName = (() => {
    try {
      const raw = localStorage.getItem("tp_process_intake_simple");
      if (raw) return JSON.parse(raw).processName || "el proceso";
    } catch {}
    return "el proceso";
  })();

  const canSend = name.trim() && email.trim() && email.includes("@");

  const handleSend = () => {
    setSending(true);
    // Store responsible info
    localStorage.setItem("tp_process_responsible", JSON.stringify({ name, email }));

    // Simulate sending
    setTimeout(() => {
      setSending(false);
      setSent(true);
      // After short delay, navigate to plan generation
      setTimeout(() => navigate("/leader/diagnostic-processing"), 1500);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="max-w-md w-full mx-auto px-6 animate-fade-in space-y-8">
        <p className="text-xs font-semibold tracking-[0.2em] text-muted-foreground uppercase text-center">
          Talent Performance Lab
        </p>

        <div className="text-center space-y-2">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">
            ¿Quién es responsable de este proceso?
          </h1>
        </div>

        <div className="bg-card border border-border rounded-2xl p-6 card-shadow space-y-5">
          <div className="space-y-2">
            <Label className="text-sm font-medium">Nombre</Label>
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nombre completo"
              className="h-11"
              disabled={sent}
            />
          </div>
          <div className="space-y-2">
            <Label className="text-sm font-medium">Correo</Label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="correo@empresa.com"
              className="h-11"
              disabled={sent}
            />
          </div>
          <p className="text-xs text-muted-foreground">
            Le enviaremos un acceso para participar.
          </p>
        </div>

        {sent ? (
          <div className="flex items-center justify-center gap-2 text-[hsl(var(--signal-positive))] font-medium">
            <Mail className="w-5 h-5" />
            Invitación enviada. Redirigiendo…
          </div>
        ) : (
          <Button
            onClick={handleSend}
            disabled={!canSend || sending}
            className="w-full bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white h-12 text-base font-semibold"
          >
            {sending ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              <>
                Enviar invitación y continuar
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
};

export default ProcessResponsible;

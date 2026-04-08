import { useState, useEffect } from "react";
import { Sidebar } from "@/components/layout/Sidebar";
import { useNavigate } from "react-router-dom";
import { CheckCircle2, Mail, ArrowRight } from "lucide-react";
import TeamInviteModal from "@/components/TeamInviteModal";
import SelfAssessmentModal from "@/components/SelfAssessmentModal";

const DiagnosticHub = () => {
  const navigate = useNavigate();
  const handleLogout = () => navigate("/");

  // Read process name from localStorage
  const [processName, setProcessName] = useState("Ventas B2B");
  const [processStep, setProcessStep] = useState("Cierre y seguimiento");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("tp_process_intake");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.processName) setProcessName(data.processName);
        if (data.processObjective) setProcessStep(data.processObjective);
      }
    } catch {}
  }, []);

  const [inviteOpen, setInviteOpen] = useState(false);
  const [selfAssessOpen, setSelfAssessOpen] = useState(false);

  // Track completed stages
  const [stages] = useState({
    proceso: true,
    equipo: false,
    autoevaluacion: false,
  });

  const completedCount = [stages.proceso, stages.equipo, stages.autoevaluacion].filter(Boolean).length;

  return (
    <div className="min-h-screen bg-[hsl(var(--surface-sunken))]">
      <Sidebar userRole="leader" userName="Alex Thompson" onLogout={handleLogout} />

      <main className="ml-64 h-screen overflow-y-auto">
        {/* Header */}
        <div className="bg-card border-b border-border px-8 pt-8 pb-6">
          <p className="text-[11px] font-bold tracking-[0.15em] text-[hsl(var(--signal-positive))] uppercase mb-2">
            Diagnóstico preliminar · Proceso de {processName}
          </p>
          <h1 className="text-2xl font-bold text-foreground">
            {processName}
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Completa las tres etapas para obtener el diagnóstico integrado.
          </p>

          {/* Step progress */}
          <div className="flex items-center gap-0 mt-6">
            {/* Step 1 - Completed */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-[hsl(var(--signal-positive))] flex items-center justify-center">
                <CheckCircle2 className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Proceso</p>
                <p className="text-xs text-[hsl(var(--signal-positive))] font-medium">Completado</p>
              </div>
            </div>

            <div className="flex-1 h-px bg-border mx-6" />

            {/* Step 2 - Pending */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-foreground flex items-center justify-center">
                <span className="text-xs font-bold text-background">2</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-foreground">Equipo</p>
                <p className="text-xs text-muted-foreground">Pendiente</p>
              </div>
            </div>

            <div className="flex-1 h-px bg-border mx-6" />

            {/* Step 3 - Blocked */}
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                <span className="text-xs font-bold text-muted-foreground">3</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-muted-foreground/60">Autoevaluación</p>
                <p className="text-xs text-muted-foreground/40">Bloqueado</p>
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">
          {/* HALLAZGO PRELIMINAR */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground/50 uppercase">
                Hallazgo preliminar
              </p>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="bg-card rounded-2xl border border-border p-6 relative">
              {/* Left accent line */}
              <div className="absolute left-0 top-6 bottom-6 w-[3px] bg-foreground/15 rounded-full" />

              <div className="pl-5 space-y-4">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold tracking-[0.12em] text-foreground/70 uppercase">
                    Problema detectado
                  </span>
                  <span className="text-[10px] font-bold tracking-[0.12em] text-[hsl(var(--signal-positive))] uppercase border border-[hsl(var(--signal-positive)/0.3)] rounded-full px-3 py-0.5">
                    Solo proceso
                  </span>
                </div>

                <h3 className="text-base font-bold text-foreground leading-snug">
                  El proceso presenta puntos de fricción que pueden estar afectando los tiempos de ejecución.
                </h3>

                <p className="text-sm text-muted-foreground leading-relaxed">
                  Se identificaron pasos redundantes, falta de documentación compartida y un seguimiento sin
                  cadencia definida. Estos factores generan variabilidad en los resultados.
                </p>

                <p className="text-sm text-[hsl(var(--signal-positive))] italic leading-relaxed font-medium">
                  Esto es solo una parte del problema. Lo más importante es entender cómo tu equipo está viviendo
                  este proceso en el día a día. El diagnóstico completo requiere la perspectiva del equipo y tu
                  autoevaluación.
                </p>
              </div>
            </div>
          </div>

          {/* DIAGNÓSTICO DEL EQUIPO */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground/50 uppercase">
                Diagnóstico del equipo
              </p>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-7 rounded-full bg-[hsl(var(--signal-positive)/0.12)] flex items-center justify-center">
                  <span className="text-xs font-bold text-[hsl(var(--signal-positive))]">2</span>
                </div>
                <h3 className="text-base font-bold text-foreground">Completar diagnóstico con mi equipo</h3>
              </div>

              {/* Invite CTA - gradient card/button */}
              <button
                onClick={() => setInviteOpen(true)}
                className="w-full rounded-xl p-5 flex items-center gap-4 text-left transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  background: "linear-gradient(135deg, hsl(152,60%,85%) 0%, hsl(180,50%,85%) 50%, hsl(200,60%,88%) 100%)",
                }}
              >
                <div className="w-10 h-10 rounded-lg bg-white/60 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5 text-muted-foreground" />
                </div>
                <p className="text-sm text-foreground/80 leading-relaxed">
                  Invita a las personas que ejecutan este proceso para capturar su perspectiva. —recibirán acceso por correo.
                </p>
              </button>
            </div>
          </div>

          {/* AUTOEVALUACIÓN DEL LÍDER */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground/50 uppercase">
                Autoevaluación del líder
              </p>
              <div className="flex-1 h-px bg-border" />
            </div>

            <div className="bg-card rounded-2xl border border-border p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
                  <span className="text-xs font-bold text-muted-foreground">3</span>
                </div>
                <h3 className="text-base font-bold text-foreground">Tu perspectiva como líder</h3>
              </div>

              {/* Self-evaluation CTA */}
              <button
                onClick={() => setSelfAssessOpen(true)}
                className="w-full rounded-xl py-4 px-6 text-white font-semibold text-base transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
                style={{
                  background: "linear-gradient(135deg, hsl(152,76%,40%) 0%, hsl(180,60%,45%) 50%, hsl(200,80%,55%) 100%)",
                }}
              >
                Evaluarme como líder
              </button>
            </div>
          </div>
        </div>

        {/* Bottom status bar */}
        <div className="sticky bottom-0 bg-card border-t border-border px-8 py-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">{completedCount} de 3 etapas completadas</span>
            {" "}— Completa las tres para generar el diagnóstico integrado
          </p>

          <button
            disabled={completedCount < 3}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium transition-colors disabled:opacity-40 disabled:cursor-not-allowed bg-muted text-muted-foreground hover:bg-muted/80"
          >
            Generar diagnóstico completo
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </main>

      <TeamInviteModal open={inviteOpen} onClose={() => setInviteOpen(false)} />
      <SelfAssessmentModal open={selfAssessOpen} onOpenChange={setSelfAssessOpen} />
    </div>
  );
};

export default DiagnosticHub;

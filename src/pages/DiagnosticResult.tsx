import { useNavigate } from "react-router-dom";
import { CheckCircle2, ArrowRight } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { getProcessName } from "@/lib/processName";
import { cn } from "@/lib/utils";

// Mock data structured as if from backend/LLM
const mockDiagnosis = {
  hallazgoCentral: {
    titulo: "Falta de claridad en la ejecución del proceso",
    descripcion:
      "Las actividades del proceso no tienen una secuencia clara ni responsabilidades definidas, lo que genera inconsistencias en los resultados y tiempos de ciclo más largos de lo esperado.",
    severidad: "Severidad alta · Afecta todo el flujo",
  },
  problemasSecundarios: [
    {
      titulo: "Seguimiento sin cadencia definida",
      descripcion:
        "No existe un ritmo acordado de seguimiento post-contacto, lo que genera variabilidad en los tiempos de respuesta.",
      severidad: "Alta",
    },
    {
      titulo: "Herramientas desconectadas del flujo",
      descripcion:
        "El CRM y el correo operan de forma independiente, generando duplicación de información en el proceso.",
      severidad: "Media",
    },
  ],
  factores: [
    { nombre: "Claridad", score: 42, estado: "En riesgo" },
    { nombre: "Dependencia", score: 35, estado: "Crítico" },
    { nombre: "Seguridad", score: 60, estado: "En riesgo" },
    { nombre: "Significado", score: 65, estado: "Estable" },
    { nombre: "Impacto", score: 76, estado: "Bien" },
  ],
  fricciones: [
    {
      texto: "El proceso de aprobación de propuestas tiene pasos redundantes que ralentizan el cierre.",
      fuente: "Proceso",
    },
    {
      texto: "No existe documentación compartida del proceso — cada persona lo ejecuta de forma diferente.",
      fuente: "Proceso · Equipo",
    },
    {
      texto: "Los tiempos de seguimiento no están definidos y varían según la persona que gestiona la oportunidad.",
      fuente: "Proceso",
    },
  ],
  interpretacion:
    "El proceso tiene <strong>potencial claro</strong>, pero opera sin una estructura que soporte la ejecución consistente. La principal oportunidad está en <strong>definir las prioridades del ciclo de cierre</strong> y acordar los criterios de seguimiento. Con ajustes puntuales, el equipo puede reducir los tiempos de ciclo y mejorar la predictibilidad de los resultados.",
  resumen: {
    hallazgos: 3,
    factores: 5,
    fricciones: 3,
  },
};

const getScoreColor = (score: number) => {
  if (score >= 70) return "text-[hsl(var(--signal-positive))]";
  if (score >= 55) return "text-[hsl(var(--signal-warning))]";
  return "text-[hsl(var(--signal-critical))]";
};

const getBarColor = (score: number) => {
  if (score >= 70) return "bg-[hsl(var(--signal-positive))]";
  if (score >= 55) return "bg-[hsl(var(--signal-warning))]";
  return "bg-[hsl(var(--signal-critical))]";
};

const getEstadoBadge = (estado: string) => {
  const colors: Record<string, string> = {
    Bien: "text-[hsl(var(--signal-positive))] border-[hsl(var(--signal-positive)/0.3)]",
    Estable: "text-[hsl(var(--signal-warning))] border-[hsl(var(--signal-warning)/0.3)]",
    "En riesgo": "text-[hsl(var(--signal-warning))] border-[hsl(var(--signal-warning)/0.3)]",
    Crítico: "text-[hsl(var(--signal-critical))] border-[hsl(var(--signal-critical)/0.3)]",
    Alta: "text-[hsl(var(--signal-critical))] border-[hsl(var(--signal-critical)/0.3)]",
    Media: "text-[hsl(var(--signal-warning))] border-[hsl(var(--signal-warning)/0.3)]",
  };
  return colors[estado] || "text-muted-foreground border-border";
};

const DiagnosticResult = () => {
  const navigate = useNavigate();
  const processName = getProcessName();
  const handleLogout = () => navigate("/");
  const d = mockDiagnosis;

  return (
    <div className="min-h-screen bg-[hsl(var(--surface-sunken))]">
      <Sidebar userRole="leader" userName="Alex Thompson" onLogout={handleLogout} />

      <main className="ml-64 h-screen overflow-y-auto">
        {/* Header */}
        <div className="bg-card border-b border-border px-8 pt-8 pb-6">
          <p className="text-[11px] font-bold tracking-[0.15em] text-[hsl(var(--signal-positive))] uppercase mb-2">
            Diagnóstico completo
          </p>
          <h1 className="text-2xl font-bold text-foreground">{processName}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Diagnóstico integrado basado en el proceso, la autoevaluación y la perspectiva del equipo.
          </p>

          {/* All 3 steps completed */}
          <div className="flex items-center gap-0 mt-6">
            {["Proceso", "Autoevaluación", "Equipo"].map((label, i) => (
              <div key={label} className="flex items-center gap-0">
                {i > 0 && <div className="flex-1 w-16 h-px bg-border mx-6" />}
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-full bg-[hsl(var(--signal-positive))] flex items-center justify-center">
                    <CheckCircle2 className="w-4 h-4 text-white" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">{label}</p>
                    <p className="text-xs text-[hsl(var(--signal-positive))] font-medium">Completado</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 pb-28">
          {/* PROBLEMA PRINCIPAL */}
          <div>
            <SectionLabel text="Problema principal" />
            <div className="bg-card rounded-2xl border border-border p-6 relative">
              <div className="absolute left-0 top-6 bottom-6 w-[3px] bg-foreground/15 rounded-full" />
              <div className="pl-5 space-y-3">
                <p className="text-[10px] font-bold tracking-[0.12em] text-foreground/70 uppercase">
                  Hallazgo central
                </p>
                <h3 className="text-base font-bold text-foreground leading-snug">
                  {d.hallazgoCentral.titulo}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {d.hallazgoCentral.descripcion}
                </p>
                <span className="inline-block text-xs text-muted-foreground border border-border rounded-full px-3 py-1">
                  {d.hallazgoCentral.severidad}
                </span>
              </div>
            </div>
          </div>

          {/* PROBLEMAS SECUNDARIOS */}
          <div>
            <SectionLabel text="Problemas secundarios" />
            <div className="space-y-3">
              {d.problemasSecundarios.map((p, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border p-5 flex items-start gap-4">
                  <div className="w-[3px] self-stretch bg-foreground/10 rounded-full shrink-0" />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-foreground">{p.titulo}</h4>
                    <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{p.descripcion}</p>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-medium border rounded-full px-3 py-1 shrink-0",
                      getEstadoBadge(p.severidad)
                    )}
                  >
                    {p.severidad}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* ESTADO DE FACTORES CLAVE */}
          <div>
            <SectionLabel text="Estado de factores clave" />
            <div className="bg-card rounded-2xl border border-border p-6 space-y-5">
              {d.factores.map((f) => (
                <div key={f.nombre} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-foreground w-28 shrink-0">{f.nombre}</span>
                  <div className="flex-1 h-2.5 bg-muted rounded-full overflow-hidden">
                    <div
                      className={cn("h-full rounded-full transition-all", getBarColor(f.score))}
                      style={{ width: `${f.score}%` }}
                    />
                  </div>
                  <span className={cn("text-sm font-bold w-10 text-right", getScoreColor(f.score))}>
                    {f.score}%
                  </span>
                  <span
                    className={cn(
                      "text-xs font-medium border rounded-full px-3 py-1 w-20 text-center shrink-0",
                      getEstadoBadge(f.estado)
                    )}
                  >
                    {f.estado}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* FRICCIÓN EN EL PROCESO */}
          <div>
            <SectionLabel text="Fricción en el proceso" />
            <div className="space-y-3">
              {d.fricciones.map((f, i) => (
                <div key={i} className="bg-card rounded-2xl border border-border p-5 flex items-center gap-4">
                  <span className="w-7 h-7 rounded-full bg-muted flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-muted-foreground">{i + 1}</span>
                  </span>
                  <p className="text-sm text-foreground flex-1">{f.texto}</p>
                  <span className="text-xs text-muted-foreground shrink-0">{f.fuente}</span>
                </div>
              ))}
            </div>
          </div>

          {/* INTERPRETACIÓN */}
          <div>
            <SectionLabel text="Interpretación" />
            <div className="bg-foreground rounded-2xl p-8">
              <p className="text-[10px] font-bold tracking-[0.15em] text-background/40 uppercase mb-4">
                Síntesis del diagnóstico
              </p>
              <p
                className="text-[15px] text-background/90 leading-[1.8]"
                dangerouslySetInnerHTML={{ __html: d.interpretacion }}
              />
            </div>
          </div>
        </div>

        {/* Bottom CTA bar */}
        <div className="sticky bottom-0 bg-card border-t border-border px-8 py-4 flex items-center justify-end ml-0">
          <button
            onClick={() => navigate("/leader/diagnostic-processing")}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-base font-semibold text-white transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            style={{
              background: "linear-gradient(135deg, hsl(152,76%,40%) 0%, hsl(180,60%,45%) 50%, hsl(200,80%,55%) 100%)",
            }}
          >
            Generar plan de acción
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </main>
    </div>
  );
};

const SectionLabel = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3 mb-4">
    <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground/50 uppercase">{text}</p>
    <div className="flex-1 h-px bg-border" />
  </div>
);

export default DiagnosticResult;

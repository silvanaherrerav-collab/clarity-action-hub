import { useNavigate } from "react-router-dom";
import { Info } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { getProcessName } from "@/lib/processName";
import { getCollaboratorIdentity } from "@/lib/collaboratorIdentity";
import { cn } from "@/lib/utils";

// Mock diagnosis data (same structure as leader, shown from collaborator perspective)
const mockDiagnosis = {
  hallazgoPrincipal: {
    titulo: "El proceso tiene puntos de fricción que afectan la ejecución diaria — especialmente en claridad y seguimiento.",
    descripcion:
      "Tu percepción refuerza los datos del proceso. Las áreas de mayor riesgo están en la definición de prioridades y el seguimiento de acuerdos internos.",
  },
  problemaPrincipal: {
    titulo: "Falta de claridad en la ejecución del proceso de cierre",
    descripcion:
      "Las actividades no tienen una secuencia clara ni responsabilidades bien definidas, lo que genera variabilidad en los resultados y ciclos más largos de lo esperado.",
  },
  factores: [
    { nombre: "Claridad", score: 42, estado: "En riesgo" },
    { nombre: "Dependencia", score: 35, estado: "Crítico" },
    { nombre: "Significado", score: 65, estado: "Estable" },
    { nombre: "Impacto", score: 76, estado: "Bien" },
    { nombre: "Seguridad", score: 55, estado: "En riesgo" },
  ],
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
  };
  return colors[estado] || "text-muted-foreground border-border";
};

const SectionLabel = ({ text }: { text: string }) => (
  <div className="flex items-center gap-3 mb-4">
    <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground/50 uppercase">{text}</p>
    <div className="flex-1 h-px bg-border" />
  </div>
);

const CollaboratorDiagnosticResult = () => {
  const navigate = useNavigate();
  const processName = getProcessName();
  const { fullName: collaboratorName } = getCollaboratorIdentity();
  const handleLogout = () => navigate("/");
  const d = mockDiagnosis;

  const diagDone = !!localStorage.getItem("tp_diagnostic_results_collaborator");

  // If survey not done, redirect to survey
  if (!diagDone) {
    return (
      <div className="min-h-screen bg-background">
        <Sidebar userRole="collaborator" userName={collaboratorName} onLogout={handleLogout} />
        <main className="ml-64 h-screen overflow-y-auto flex items-center justify-center">
          <div className="text-center max-w-md space-y-4">
            <h2 className="text-xl font-semibold text-foreground">Diagnóstico pendiente</h2>
            <p className="text-sm text-muted-foreground">
              Completa tu encuesta de diagnóstico para ver los resultados integrados.
            </p>
            <button
              onClick={() => navigate("/collaborator/survey")}
              className="px-6 py-3 rounded-xl font-semibold text-sm bg-foreground text-background hover:bg-foreground/90 transition-colors"
            >
              Iniciar encuesta
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[hsl(var(--surface-sunken))]">
      <Sidebar userRole="collaborator" userName={collaboratorName} onLogout={handleLogout} />

      <main className="ml-64 h-screen overflow-y-auto">
        {/* Header */}
        <div className="bg-card border-b border-border px-8 pt-8 pb-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold tracking-[0.15em] text-[hsl(var(--signal-positive))] uppercase mb-2">
                Diagnóstico · Tu perspectiva
              </p>
              <h1 className="text-2xl font-bold text-foreground">
                {processName}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                Resultado integrado basado en tu encuesta y los inputs del proceso
              </p>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full border border-[hsl(var(--signal-positive)/0.3)] bg-[hsl(var(--signal-positive)/0.05)]">
              <div className="w-2 h-2 rounded-full bg-[hsl(var(--signal-positive))]" />
              <span className="text-sm font-medium text-[hsl(var(--signal-positive))]">Diagnóstico completo</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8 pb-12">
          {/* Collaborator notice */}
          <div className="bg-[hsl(var(--signal-positive)/0.06)] border border-[hsl(var(--signal-positive)/0.15)] rounded-xl px-5 py-3">
            <p className="text-sm text-[hsl(var(--signal-positive))]">
              Este diagnóstico integra la perspectiva del equipo para entender mejor lo que está pasando en la ejecución del proceso.
            </p>
          </div>

          {/* HALLAZGO PRINCIPAL */}
          <div>
            <SectionLabel text="Hallazgo principal" />
            <p className="text-base font-bold text-foreground leading-snug mb-2">
              "{d.hallazgoPrincipal.titulo}"
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {d.hallazgoPrincipal.descripcion}
            </p>
          </div>

          {/* PROBLEMA PRINCIPAL */}
          <div>
            <SectionLabel text="Problema principal" />
            <div className="bg-card rounded-2xl border border-border p-6 relative">
              <div className="absolute left-0 top-6 bottom-6 w-[3px] bg-foreground/15 rounded-full" />
              <div className="pl-5 space-y-2">
                <p className="text-[10px] font-bold tracking-[0.12em] text-foreground/70 uppercase">
                  Problema principal
                </p>
                <h3 className="text-base font-bold text-foreground leading-snug">
                  {d.problemaPrincipal.titulo}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {d.problemaPrincipal.descripcion}
                </p>
              </div>
            </div>
          </div>

          {/* FACTORES DEL EQUIPO */}
          <div>
            <SectionLabel text="Factores del equipo · Proyecto Aristotle" />
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

          {/* Plan de acción note */}
          <div className="bg-card rounded-2xl border border-border p-5 flex items-start gap-3">
            <Info className="w-5 h-5 text-muted-foreground shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              Este diagnóstico será usado para definir acciones que mejoren la forma en que el equipo trabaja y logra resultados.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollaboratorDiagnosticResult;

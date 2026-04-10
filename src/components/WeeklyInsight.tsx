import { useMemo } from "react";
import { loadTasks } from "@/components/ActionPlanTaskList";

interface CheckInEntry {
  clarityResponse?: string;
  blockageResponse?: string;
  feelingResponse?: number;
}

interface WeeklyInsightProps {
  role: "leader" | "collaborator";
}

function getWeeklyCheckIns(): CheckInEntry[] {
  try {
    const raw = localStorage.getItem("tp_checkins");
    if (raw) return JSON.parse(raw) as CheckInEntry[];
  } catch {}
  return [];
}

function getCollabCheckIn(): { dimensionId: string; value: string; note?: string }[] {
  try {
    const raw = localStorage.getItem("tp_collab_checkin");
    if (raw) return JSON.parse(raw);
  } catch {}
  return [];
}

interface InsightData {
  sharedInsight: string;
  leaderRecommendations: string[];
}

function generateWeeklyInsight(): InsightData {
  const tasks = loadTasks();
  const completed = tasks.filter((t) => t.status === "completada").length;
  const total = tasks.length;
  const completion = total > 0 ? completed / total : 0;

  const checkIns = getWeeklyCheckIns();
  const collabCheckIn = getCollabCheckIn();

  // Analyze check-in signals
  const hasLowClarity =
    checkIns.some((c) => c.clarityResponse === "No") ||
    collabCheckIn.some((c) => c.dimensionId === "claridad" && c.value === "unclear");

  const hasBlockers =
    checkIns.some((c) => c.blockageResponse?.includes("crítico")) ||
    collabCheckIn.some((c) => c.dimensionId === "dependencia" && c.value === "blocked");

  const hasMinorBlockers =
    checkIns.some((c) => c.blockageResponse?.includes("leve")) ||
    collabCheckIn.some((c) => c.dimensionId === "dependencia" && c.value === "resolved");

  const lowEnergy = collabCheckIn.some(
    (c) => c.dimensionId === "impacto" && c.value === "low"
  );

  const disconnected = collabCheckIn.some(
    (c) => c.dimensionId === "significado" && c.value === "disconnected"
  );

  const needsAttention = collabCheckIn.some(
    (c) => c.dimensionId === "seguridad" && c.value === "needs_attention"
  );

  const avgFeeling =
    checkIns.filter((c) => c.feelingResponse).reduce((sum, c) => sum + (c.feelingResponse || 0), 0) /
    (checkIns.filter((c) => c.feelingResponse).length || 1);

  // Generate shared insight
  let sharedInsight: string;
  const recommendations: string[] = [];

  if (hasBlockers) {
    sharedInsight = `Se detectaron bloqueos críticos que están frenando la ejecución. El avance general es del ${Math.round(completion * 100)}% (${completed} de ${total} tareas completadas). Es necesario resolver dependencias para retomar el ritmo.`;
    recommendations.push("Identifica y resuelve las dependencias críticas antes de iniciar la semana.");
    recommendations.push("Programa una sesión breve con el equipo para desbloquear los puntos de fricción.");
  } else if (hasLowClarity) {
    sharedInsight = `El equipo reporta falta de claridad en prioridades. Con ${completed} de ${total} tareas completadas (${Math.round(completion * 100)}%), la ejecución podría acelerarse con una mejor definición de foco semanal.`;
    recommendations.push("Define prioridades claras para el equipo esta semana.");
    recommendations.push("Comunica el objetivo principal de la semana en los primeros 30 minutos del día.");
  } else if (needsAttention) {
    sharedInsight = `Hay señales de comunicación pendiente en el equipo que pueden afectar el clima de trabajo. La ejecución está en ${Math.round(completion * 100)}% — resolver estas señales puede liberar energía productiva.`;
    recommendations.push("Abre un espacio seguro de conversación 1:1 con quienes reportaron necesidad de hablar.");
    recommendations.push("Refuerza que el equipo puede comunicar fricciones sin consecuencias.");
  } else if (disconnected) {
    sharedInsight = `Parte del equipo no percibe conexión entre su trabajo diario y el objetivo general. Esto puede reducir motivación y calidad de ejecución. Avance actual: ${Math.round(completion * 100)}%.`;
    recommendations.push("Conecta cada tarea asignada con el impacto que genera en el objetivo del equipo.");
    recommendations.push("Dedica 5 minutos al inicio del día para recordar el propósito del proceso.");
  } else if (lowEnergy && completion < 0.5) {
    sharedInsight = `Energía baja y avance limitado esta semana (${completed} de ${total} tareas). El equipo podría beneficiarse de un ajuste en la carga o un impulso motivacional.`;
    recommendations.push("Reduce dependencias entre áreas para destrabar ejecución.");
    recommendations.push("Prioriza las 2-3 tareas de mayor impacto y posterga las demás.");
  } else if (completion >= 0.8) {
    sharedInsight = `Excelente semana. Se completaron ${completed} de ${total} tareas (${Math.round(completion * 100)}%). Las señales del equipo son positivas y hay claridad en la dirección.`;
    recommendations.push("Reconoce el avance del equipo — el momentum es un activo valioso.");
    if (hasMinorBlockers) {
      recommendations.push("Hay bloqueos leves reportados — resuélvelos antes de que escalen.");
    } else {
      recommendations.push("Aumenta el seguimiento sobre tareas críticas para mantener el ritmo.");
    }
  } else if (completion >= 0.5) {
    sharedInsight = `Avance moderado: ${completed} de ${total} tareas completadas (${Math.round(completion * 100)}%). El equipo mantiene dirección pero hay espacio para acelerar la ejecución.`;
    recommendations.push("Identifica qué tareas pendientes tienen mayor impacto y priorízalas.");
    if (avgFeeling > 0 && avgFeeling < 3) {
      recommendations.push("El ánimo del equipo está por debajo del promedio — considera una conversación de check-in.");
    } else {
      recommendations.push("Aumenta el seguimiento sobre tareas críticas para cerrar la semana con mejor resultado.");
    }
  } else {
    sharedInsight = `Semana con avance limitado: ${completed} de ${total} tareas completadas (${Math.round(completion * 100)}%). Se necesita foco y acción para recuperar el ritmo.`;
    recommendations.push("Redefine las prioridades del equipo — enfócate en lo esencial.");
    recommendations.push("Programa un punto de alineación breve para reconectar al equipo con el objetivo.");
  }

  return {
    sharedInsight,
    leaderRecommendations: recommendations,
  };
}

export const WeeklyInsight = ({ role }: WeeklyInsightProps) => {
  const { sharedInsight, leaderRecommendations } = useMemo(generateWeeklyInsight, []);

  return (
    <div className="space-y-4">
      {/* Shared Insight — visible to all */}
      <div className="bg-[hsl(220,20%,14%)] rounded-2xl p-6 space-y-2">
        <p className="text-[10px] font-bold tracking-[0.2em] text-[hsl(var(--signal-positive))] uppercase">
          Señal del equipo · Esta semana
        </p>
        <p className="text-sm text-[hsl(220,20%,85%)] leading-relaxed">
          {sharedInsight}
        </p>
      </div>

      {/* Leader-only recommendation */}
      {role === "leader" && leaderRecommendations.length > 0 && (
        <div className="bg-card border border-border/60 rounded-2xl p-6 space-y-3">
          <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase">
            Recomendación para el líder
          </p>
          <div className="space-y-2">
            {leaderRecommendations.map((rec, i) => (
              <div key={i} className="flex items-start gap-3">
                <span className="mt-0.5 w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <span className="text-[10px] font-bold text-primary">{i + 1}</span>
                </span>
                <p className="text-sm text-foreground leading-relaxed">{rec}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

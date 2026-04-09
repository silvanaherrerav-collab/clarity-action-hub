import { useMemo } from "react";
import { getProcessName } from "@/lib/processName";
import { Sidebar } from "@/components/layout/Sidebar";
import { useNavigate } from "react-router-dom";
import { Download } from "lucide-react";

const LeaderDashboard = () => {
  const navigate = useNavigate();
  const handleLogout = () => navigate("/");
  const processName = getProcessName();

  /* ── Mock data ── */
  const metrics = [
    { label: "PROGRESO GENERAL", value: "40%", sub: "2/5 actividades", color: "text-[hsl(var(--signal-positive))]" },
    { label: "SCORE CULTURAL", value: "82%", sub: "↑ +7 esta semana", color: "text-[hsl(217,91%,60%)]" },
    { label: "KPI OPERATIVO", value: "78%", sub: "Meta: 90%", color: "text-foreground" },
    { label: "CERTEZA DE MEJORA", value: "78", sub: "12 pts semana", color: "text-[hsl(var(--signal-positive))]" },
  ];

  const kpiData = [55, 58, 62, 68, 72, 75];
  const cultureData = [65, 60, 68, 64, 70, 78];
  const days = ["Lun", "Mar", "Mié", "Jue", "Vie", "Hoy"];

  const donutData = [
    { label: "Completadas", pct: 57.6, color: "hsl(152,76%,40%)" },
    { label: "Pendientes", pct: 29.1, color: "hsl(var(--signal-positive)/0.2)" },
    { label: "En proceso", pct: 13.3, color: "hsl(217,91%,60%)" },
  ];

  /* ── SVG line helpers ── */
  const chartW = 560;
  const chartH = 160;
  const padX = 40;
  const padY = 10;
  const yMin = 40;
  const yMax = 100;

  const toX = (i: number) => padX + (i / (days.length - 1)) * (chartW - padX * 2);
  const toY = (v: number) => padY + ((yMax - v) / (yMax - yMin)) * (chartH - padY * 2);

  const makePath = (data: number[]) =>
    data.map((v, i) => `${i === 0 ? "M" : "L"} ${toX(i)} ${toY(v)}`).join(" ");

  /* ── Donut SVG ── */
  const donutSize = 180;
  const donutR = 70;
  const donutStroke = 28;

  const donutArcs = useMemo(() => {
    let cumulative = 0;
    return donutData.map((d) => {
      const start = cumulative;
      cumulative += d.pct;
      return { ...d, start, end: cumulative };
    });
  }, []);

  const arcPath = (startPct: number, endPct: number, r: number) => {
    const cx = donutSize / 2;
    const cy = donutSize / 2;
    const startAngle = (startPct / 100) * 360 - 90;
    const endAngle = (endPct / 100) * 360 - 90;
    const largeArc = endPct - startPct > 50 ? 1 : 0;
    const toRad = (d: number) => (d * Math.PI) / 180;
    const x1 = cx + r * Math.cos(toRad(startAngle));
    const y1 = cy + r * Math.sin(toRad(startAngle));
    const x2 = cx + r * Math.cos(toRad(endAngle));
    const y2 = cy + r * Math.sin(toRad(endAngle));
    return `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  return (
    <div className="min-h-screen bg-[hsl(var(--surface-sunken))]">
      <Sidebar userRole="leader" userName="Alex Thompson" onLogout={handleLogout} />

      <main className="ml-64 h-screen overflow-y-auto overflow-x-hidden">
        <div className="p-8 max-w-6xl mx-auto space-y-8">
          {/* ── Header ── */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-[hsl(var(--signal-positive))] uppercase mb-1">
                SEGUIMIENTO DEL PROCESO
              </p>
              <h1 className="text-2xl font-bold text-foreground">{processName} — Cierre y seguimiento</h1>
              <p className="text-sm text-muted-foreground mt-1">Iniciado hoy, 2 de abril</p>
            </div>
            <button
              className="px-5 py-2.5 rounded-xl text-sm font-bold text-white shrink-0 transition-all hover:scale-[1.01]"
              style={{ background: "linear-gradient(135deg, hsl(152,76%,40%), hsl(152,76%,50%))" }}
            >
              <span className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                Descargar informe de Diagnóstico inicial
              </span>
            </button>
          </div>

          {/* ── Top Metrics ── */}
          <div className="grid grid-cols-4 gap-4">
            {metrics.map((m) => (
              <div key={m.label} className="bg-card border border-border rounded-2xl p-5">
                <p className="text-[10px] font-bold tracking-[0.15em] text-muted-foreground uppercase mb-3">
                  {m.label}
                </p>
                <p className={`text-4xl font-bold ${m.color}`}>{m.value}</p>
                <p className="text-xs text-muted-foreground mt-1">{m.sub}</p>
              </div>
            ))}
          </div>

          {/* ── Charts Row ── */}
          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            {/* Line Chart */}
            <div className="md:col-span-3 bg-card border border-border rounded-2xl p-6 space-y-3">
              <div>
                <h3 className="text-base font-semibold text-foreground">KPI vs Seguridad Psicológica</h3>
                <p className="text-xs text-muted-foreground">Correlación semanal · Proyecto Aristotle</p>
              </div>
              <div className="flex items-center gap-5 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 bg-[hsl(var(--signal-positive))] rounded" /> KPI Operativo
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-4 h-0.5 rounded" style={{ background: "hsl(217,91%,60%)", borderBottom: "2px dashed hsl(217,91%,60%)" }} /> Score Psicológico
                </span>
              </div>
              <svg viewBox={`0 0 ${chartW} ${chartH + 20}`} className="w-full" preserveAspectRatio="xMidYMid meet">
                {/* Y axis labels */}
                {[40, 55, 70, 85, 100].map((v) => (
                  <g key={v}>
                    <line x1={padX} y1={toY(v)} x2={chartW - padX} y2={toY(v)} stroke="hsl(var(--border)/0.3)" strokeWidth="0.5" />
                    <text x={padX - 8} y={toY(v) + 4} textAnchor="end" className="fill-muted-foreground" fontSize="10">{v}</text>
                  </g>
                ))}
                {/* X axis labels */}
                {days.map((d, i) => (
                  <text key={d} x={toX(i)} y={chartH + 16} textAnchor="middle" className="fill-muted-foreground" fontSize="10">{d}</text>
                ))}
                {/* KPI line */}
                <path d={makePath(kpiData)} fill="none" stroke="hsl(152,76%,40%)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                {kpiData.map((v, i) => (
                  <circle key={`k${i}`} cx={toX(i)} cy={toY(v)} r="4" fill="hsl(152,76%,40%)" />
                ))}
                {/* Culture line */}
                <path d={makePath(cultureData)} fill="none" stroke="hsl(217,91%,60%)" strokeWidth="2" strokeDasharray="6 3" strokeLinecap="round" />
                {cultureData.map((v, i) => (
                  <circle key={`c${i}`} cx={toX(i)} cy={toY(v)} r="3.5" fill="hsl(217,91%,60%)" />
                ))}
              </svg>
            </div>

            {/* Donut Chart */}
            <div className="md:col-span-2 bg-card border border-border rounded-2xl p-6 space-y-3">
              <h3 className="text-base font-semibold text-foreground">% Estado de las tareas</h3>
              <div className="flex items-center gap-4 text-xs text-muted-foreground flex-wrap">
                {donutData.map((d) => (
                  <span key={d.label} className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                    {d.label}
                  </span>
                ))}
              </div>
              <div className="flex justify-center">
                <svg width={donutSize} height={donutSize} viewBox={`0 0 ${donutSize} ${donutSize}`}>
                  {donutArcs.map((arc) => (
                    <path
                      key={arc.label}
                      d={arcPath(arc.start, arc.end, donutR)}
                      fill="none"
                      stroke={arc.color}
                      strokeWidth={donutStroke}
                      strokeLinecap="round"
                    />
                  ))}
                  {/* Labels on the donut */}
                  {donutArcs.map((arc) => {
                    const midPct = (arc.start + arc.end) / 2;
                    const midAngle = ((midPct / 100) * 360 - 90) * (Math.PI / 180);
                    const labelR = donutR + donutStroke / 2 + 18;
                    const lx = donutSize / 2 + labelR * Math.cos(midAngle);
                    const ly = donutSize / 2 + labelR * Math.sin(midAngle);
                    return (
                      <g key={`l-${arc.label}`}>
                        <text x={lx} y={ly - 4} textAnchor="middle" className="fill-muted-foreground" fontSize="9" fontWeight="600">
                          {arc.label}
                        </text>
                        <text x={lx} y={ly + 8} textAnchor="middle" className="fill-muted-foreground" fontSize="9">
                          {arc.pct}%
                        </text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
          </div>

          {/* ── Insight Block ── */}
          <div className="rounded-2xl bg-foreground p-8 space-y-3">
            <p className="text-xs font-bold tracking-[0.15em] text-[hsl(var(--signal-positive))] uppercase text-center">
              Insight de Ejecución
            </p>
            <p className="text-sm text-background/85 leading-[1.8]">
              El equipo muestra avance sólido en las primeras 2 actividades del plan.{" "}
              <strong className="text-background">La convergencia entre KPIs operativos (78%) y Seguridad Psicológica</strong> (82%) indica un ambiente de alto rendimiento sostenible. Riesgo identificado: La actividad "Feedback 360°" lleva retraso de 3 días. Recomiendo anticipar la conversación esta semana para evitar cascada en plazos posteriores. Oportunidad destacada: El aumento en el Score Aristotle (Sem 4→6) sugiere que el equipo está respondiendo positivamente a la gestión actual. Continuar con reuniones 1:1 regulares podría consolidar este momentum.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeaderDashboard;

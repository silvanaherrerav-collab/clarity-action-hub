import { useState } from "react";
import { Calendar, CheckCircle2, AlertTriangle, MessageSquare } from "lucide-react";

const CollaboratorWeek = () => {
  // --- Check-in state ---
  const [clarityResponse, setClarityResponse] = useState<string | null>(null);
  const [blockageResponse, setBlockageResponse] = useState<string | null>(null);
  const [checkInSubmitted, setCheckInSubmitted] = useState(false);

  // --- 1:1 confirmation state (mock) ---
  const [pendingOneOnOneConfirmation] = useState(true);
  const [oneOnOneAnswer, setOneOnOneAnswer] = useState<string | null>(null);
  const [oneOnOneSubmitted, setOneOnOneSubmitted] = useState(false);

  // --- Blockage report state ---
  const [blockageText, setBlockageText] = useState("");
  const [blockageReportSubmitted, setBlockageReportSubmitted] = useState(false);

  const handleCheckInSubmit = () => {
    if (!clarityResponse || !blockageResponse) return;
    const entry = {
      weekId: new Date().toISOString().slice(0, 10),
      clarityResponse,
      blockageResponse,
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("tp_checkins") || "[]");
    existing.push(entry);
    localStorage.setItem("tp_checkins", JSON.stringify(existing));
    setCheckInSubmitted(true);
  };

  const handleOneOnOneResponse = (answer: string) => {
    setOneOnOneAnswer(answer);
    const entry = {
      requestId: "one_on_one_calibration",
      answer,
      respondedAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("tp_pulse_responses") || "[]");
    existing.push(entry);
    localStorage.setItem("tp_pulse_responses", JSON.stringify(existing));
    setOneOnOneSubmitted(true);
  };

  const handleBlockageReport = () => {
    if (!blockageText.trim()) return;
    const entry = {
      weekId: new Date().toISOString().slice(0, 10),
      text: blockageText,
      createdAt: new Date().toISOString(),
    };
    const existing = JSON.parse(localStorage.getItem("tp_blockage_reports") || "[]");
    existing.push(entry);
    localStorage.setItem("tp_blockage_reports", JSON.stringify(existing));
    setBlockageReportSubmitted(true);
    setBlockageText("");
  };

  const optionBtnClass = (selected: boolean) =>
    `px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
      selected
        ? "bg-[hsl(var(--signal-positive))] text-white border-[hsl(var(--signal-positive))]"
        : "bg-background text-foreground border-border hover:bg-muted"
    }`;

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <h1 className="text-2xl font-bold text-foreground tracking-tight">Tu semana en TP Lab</h1>
        </div>

        {/* CARD 1 — Estado del plan del equipo */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4 card-shadow">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[hsl(var(--signal-positive))]" />
            <h2 className="text-lg font-semibold text-foreground">Estado del plan del equipo</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tareas del equipo a tiempo</span>
              <span className="font-semibold text-foreground">82%</span>
            </div>
            <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
              <div className="h-full bg-[hsl(var(--signal-positive))] rounded-full" style={{ width: "82%" }} />
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tareas vencidas</span>
              <span className="font-semibold text-foreground">3</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Prioridades activas esta semana</span>
              <span className="font-semibold text-foreground">5</span>
            </div>
          </div>
          <p className="text-xs text-muted-foreground">Datos agregados del equipo (sin nombres).</p>
        </div>

        {/* CARD 2 — Check-in rápido */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-5 card-shadow">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-[hsl(var(--signal-positive))]" />
            <h2 className="text-lg font-semibold text-foreground">Check-in rápido</h2>
          </div>

          {checkInSubmitted ? (
            <p className="text-sm text-[hsl(var(--signal-positive))] font-medium">Check-in registrado.</p>
          ) : (
            <>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">¿Tus prioridades están claras esta semana?</p>
                <div className="flex flex-wrap gap-2">
                  {["Sí", "Más o menos", "No"].map((opt) => (
                    <button key={opt} className={optionBtnClass(clarityResponse === opt)} onClick={() => setClarityResponse(opt)}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground">¿Tienes algún bloqueo que afecte tu trabajo?</p>
                <div className="flex flex-wrap gap-2">
                  {["No", "Sí (leve)", "Sí (crítico)"].map((opt) => (
                    <button key={opt} className={optionBtnClass(blockageResponse === opt)} onClick={() => setBlockageResponse(opt)}>
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={handleCheckInSubmit}
                disabled={!clarityResponse || !blockageResponse}
                className="px-6 py-2.5 rounded-lg font-semibold text-sm bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Enviar check-in
              </button>
            </>
          )}
        </div>

        {/* CARD 3 — Confirmación de reunión 1:1 */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4 card-shadow">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[hsl(var(--signal-warning))]" />
            <h2 className="text-lg font-semibold text-foreground">Confirmación de reunión 1:1</h2>
          </div>

          {!pendingOneOnOneConfirmation ? (
            <p className="text-sm text-muted-foreground">No hay confirmaciones pendientes esta semana.</p>
          ) : oneOnOneSubmitted ? (
            <p className="text-sm text-[hsl(var(--signal-positive))] font-medium">Confirmación registrada (anónima).</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                Tu líder indicó que realizaron la reunión. Confirma si ocurrió.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  { label: "Sí, se realizó", value: "yes" },
                  { label: "No, no se realizó", value: "no" },
                  { label: "Aún no / No aplica", value: "na" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => handleOneOnOneResponse(opt.value)}
                    className="px-4 py-2 rounded-lg text-sm font-medium border border-border bg-background text-foreground hover:bg-muted transition-colors"
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* CARD 4 — Reportar bloqueo */}
        <div className="bg-card rounded-xl border border-border p-6 space-y-4 card-shadow">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-muted-foreground" />
            <h2 className="text-lg font-semibold text-foreground">Reportar un bloqueo (opcional)</h2>
          </div>
          <p className="text-sm text-muted-foreground">
            Si algo está impidiendo que avances, escríbelo aquí. Se analiza de forma agregada.
          </p>

          {blockageReportSubmitted ? (
            <p className="text-sm text-[hsl(var(--signal-positive))] font-medium">Reporte enviado.</p>
          ) : (
            <>
              <textarea
                value={blockageText}
                onChange={(e) => setBlockageText(e.target.value)}
                rows={3}
                className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--signal-positive))] resize-none"
                placeholder="Describe el bloqueo…"
              />
              <button
                onClick={handleBlockageReport}
                disabled={!blockageText.trim()}
                className="px-6 py-2.5 rounded-lg font-semibold text-sm bg-[hsl(var(--signal-positive))] hover:bg-[hsl(var(--signal-positive)/0.9)] text-white transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Enviar
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default CollaboratorWeek;

import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "@/components/layout/Sidebar";
import { ActionPlanTaskList } from "@/components/ActionPlanTaskList";
import { getProcessName } from "@/lib/processName";
import { getCollaboratorIdentity } from "@/lib/collaboratorIdentity";

const CollaboratorActionPlan = () => {
  const navigate = useNavigate();
  const { fullName: collaboratorName } = getCollaboratorIdentity();
  const processName = getProcessName();

  const leaderName = useMemo(() => {
    try {
      const raw = localStorage.getItem("tp_register_data");
      if (raw) {
        const data = JSON.parse(raw);
        if (data.name?.trim()) return data.name.trim();
      }
    } catch {}
    try {
      const raw = localStorage.getItem("tp_user_account");
      if (raw) {
        const data = JSON.parse(raw);
        const n = [data.firstName, data.lastName].filter(Boolean).join(" ");
        if (n.trim()) return n.trim();
      }
    } catch {}
    return "Tu líder";
  }, []);

  const [completedCount, setCompletedCount] = useState(0);
  const [taskTotal, setTaskTotal] = useState(0);

  const handleTaskProgress = (completed: number, total: number) => {
    setCompletedCount(completed);
    setTaskTotal(total);
  };

  const taskProgress = taskTotal > 0 ? Math.round((completedCount / taskTotal) * 100) : 0;

  

  const handleLogout = () => navigate("/");

  return (
    <div className="min-h-screen bg-[#f5f5f0]">
      <Sidebar userRole="collaborator" userName={collaboratorName} onLogout={handleLogout} />

      <main className="ml-64 h-screen overflow-y-auto overflow-x-hidden bg-[#f5f5f0]">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-[#f5f5f0] border-b border-border/40">
          <div className="px-8 py-5 flex items-start justify-between">
            <div className="space-y-1">
              <p className="text-xs font-bold tracking-[0.15em] text-[hsl(var(--signal-positive))] uppercase">
                PLAN DE ACCIÓN · {processName}
              </p>
              <h1 className="text-2xl font-bold text-foreground tracking-tight">
                Plan de trabajo del proceso
              </h1>
              <p className="text-sm text-muted-foreground">
                Definido por {leaderName} · Seguimiento activo
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0 pt-1">
              <span className="text-sm text-muted-foreground">Progreso general</span>
              <div className="w-28 h-2.5 rounded-full bg-muted/30 overflow-hidden">
                <div
                  className="h-full rounded-full bg-[hsl(var(--signal-positive))] transition-all"
                  style={{ width: `${taskProgress}%` }}
                />
              </div>
              <span className="text-sm font-bold text-foreground">
                {taskProgress}%
              </span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="px-8 py-10 space-y-10 pb-28">


          {/* Action Plan Task List — full interaction enabled */}
          <ActionPlanTaskList onProgressChange={handleTaskProgress} />
        </div>
      </main>
    </div>
  );
};

export default CollaboratorActionPlan;

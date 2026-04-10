import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Users,
  Activity,
  LogOut,
  TrendingUp,
  ClipboardList,
  CheckSquare,
  Settings,
  Check,
  Triangle,
} from "lucide-react";
import { getActions } from "@/lib/actionsStore";
import { getProcessName } from "@/lib/processName";

interface SidebarProps {
  userRole: "leader" | "collaborator";
  userName: string;
  onLogout: () => void;
}

interface NavItem {
  icon: any;
  label: string;
  path: string;
  section?: string;
  badgeKey?: string;
}

const leaderNavItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/leader", section: "PRINCIPAL" },
  { icon: CheckSquare, label: "To-do del día", path: "/leader/todo", section: "PRINCIPAL", badgeKey: "todo" },
  { icon: ClipboardList, label: "Plan de Acción", path: "/leader/plan-review", section: "PRINCIPAL" },
  { icon: Settings, label: "Diagnóstico", path: "/leader/diagnostic-hub", section: "PRINCIPAL" },
];

const collaboratorNavItems: NavItem[] = [
  { icon: CheckSquare, label: "To-do del día", path: "/collaborator/task-review", section: "MI ESPACIO", badgeKey: "todo" },
  { icon: Triangle, label: "Plan de acción", path: "/collaborator/action-plan", section: "MI ESPACIO", badgeKey: "plan" },
  { icon: Settings, label: "Diagnóstico", path: "/collaborator/diagnostic-result", section: "MI ESPACIO", badgeKey: "diagnostic" },
];

function computeBadges(): Record<string, number> {
  const badges: Record<string, number> = {};

  try {
    const planStatus = localStorage.getItem("tp_plan_status");
    if (planStatus && !["editing", "finalized"].includes(planStatus)) {
      badges.plan = 1;
    }
  } catch {}

  try {
    const actions = getActions();
    const pending = actions.filter(a => a.status === "pending" || a.status === "snoozed").length;
    if (pending > 0) badges.actions = pending;
  } catch {}

  try {
    const pending = parseInt(localStorage.getItem("tp_todo_pending") || "0", 10);
    if (pending > 0) badges.todo = pending;
  } catch {}

  // Diagnostic badge for collaborator
  try {
    const done = localStorage.getItem("tp_diagnostic_results_collaborator");
    if (done) badges.diagnostic = -1; // -1 signals "Listo"
  } catch {}

  return badges;
}

export const Sidebar = ({ userRole, userName, onLogout }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = userRole === "leader" ? leaderNavItems : collaboratorNavItems;

  // Dynamic user profile from registration data
  const dynamicUser = (() => {
    try {
      const data = localStorage.getItem("tp_register_data");
      if (data) {
        const parsed = JSON.parse(data);
        const first = parsed.firstName || "";
        const last = parsed.lastName || "";
        const fullName = `${first} ${last}`.trim();
        const initials = `${first.charAt(0)}${last.charAt(0)}`.toUpperCase();
        return { fullName: fullName || userName, initials: initials || userName.split(" ").map((n: string) => n[0]).join("") };
      }
    } catch {}
    return { fullName: userName, initials: userName.split(" ").map((n: string) => n[0]).join("") };
  })();

  const [badges, setBadges] = useState<Record<string, number>>(() => computeBadges());

  useEffect(() => {
    setBadges(computeBadges());
  }, [location.pathname]);

  const handleNav = (item: NavItem) => {
    navigate(item.path);
  };

  // Group by section
  const sections: { label: string | null; items: NavItem[] }[] = [];
  let currentSection: string | null = null;
  for (const item of navItems) {
    const sec = item.section || null;
    if (sec !== currentSection || sections.length === 0) {
      sections.push({ label: sec, items: [item] });
      currentSection = sec;
    } else {
      sections[sections.length - 1].items.push(item);
    }
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[hsl(222,20%,14%)] flex flex-col z-[1000]">
      {/* Logo */}
      <div className="p-6 border-b border-white/10">
        <div>
          <h1 className="font-semibold text-white text-sm">Talent Performance</h1>
          <p className="text-xs text-white/50">LAB</p>
        </div>
      </div>

      {/* Role label for collaborator */}
      {userRole === "collaborator" && (
        <div className="px-4 pt-4 pb-1">
          <div className="bg-white/5 rounded-lg px-3 py-2">
            <p className="text-[10px] font-bold tracking-[0.15em] text-white/40 uppercase">Vista activa</p>
            <p className="text-sm font-semibold text-[hsl(200,80%,65%)]">Colaborador</p>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="p-4 space-y-5">
        {sections.map((section, si) => (
          <div key={si}>
            {section.label && (
              <p className="text-[10px] font-bold tracking-[0.15em] text-white/40 uppercase mb-2 px-3">
                {section.label}
              </p>
            )}
            <div className="space-y-0.5">
              {section.items.map((item) => {
                const isActive = location.pathname === item.path;
                const badge = item.badgeKey ? badges[item.badgeKey] : undefined;
                return (
                  <button
                    key={item.path}
                    onClick={() => handleNav(item)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors relative",
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <item.icon className="w-5 h-5" />
                    <span className="flex-1 text-left">{item.label}</span>
                    {badge !== undefined && badge === -1 && (
                      <span className="inline-flex items-center justify-center px-2 h-5 rounded-full bg-[hsl(var(--signal-positive)/0.15)] text-[10px] font-bold text-[hsl(var(--signal-positive))]">
                        Listo
                      </span>
                    )}
                    {badge !== undefined && badge > 0 && (
                      <span className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[hsl(var(--signal-positive))] text-[10px] font-bold text-white">
                        {badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* Spacer */}
      <div className="flex-1" />

      {/* Bottom cards */}
      <div className="px-4 pb-3 space-y-3">
        {/* Proceso activo - leader (diagnostic phase) */}
        {userRole === "leader" && !localStorage.getItem("tp_diagnosis_generated") && (() => {
          const processName = getProcessName();
          const selfDone = !!localStorage.getItem("tp_self_assessment");
          const teamDone = !!localStorage.getItem("tp_diagnostic_results_collaborator");
          const completed = 1 + (selfDone ? 1 : 0) + (teamDone ? 1 : 0);
          const pct = Math.round((completed / 3) * 100);
          return (
            <div className="bg-white/5 rounded-xl p-4 space-y-2">
              <p className="text-[10px] font-bold tracking-[0.15em] text-white/40 uppercase">Proceso activo</p>
              <p className="text-sm font-semibold text-white">{processName}</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Diagnóstico</span>
                  <span className="text-[hsl(var(--signal-positive))] font-semibold">{completed}/3</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-[hsl(var(--signal-positive))]" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          );
        })()}

        {/* Proceso activo - collaborator */}
        {userRole === "collaborator" && (() => {
          const processName = getProcessName();
          const diagDone = !!localStorage.getItem("tp_diagnostic_results_collaborator");
          const pct = diagDone ? 100 : 35;
          return (
            <div className="bg-white/5 rounded-xl p-4 space-y-2">
              <p className="text-[10px] font-bold tracking-[0.15em] text-white/40 uppercase">Proceso activo</p>
              <p className="text-sm font-semibold text-white">{processName}</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Mi progreso</span>
                  <span className="text-[hsl(var(--signal-positive))] font-semibold">{pct}%</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-[hsl(var(--signal-positive))]" style={{ width: `${pct}%` }} />
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Logout */}
      <div className="px-4 pb-2">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-white/50 hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Cerrar sesión
        </button>
      </div>

      {/* User profile */}
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-[hsl(var(--signal-positive)/0.2)] rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-[hsl(var(--signal-positive))]">
              {dynamicUser.initials}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{dynamicUser.fullName}</p>
            <p className="text-xs text-white/40">{userRole === "leader" ? "Líder" : "Colaborador"}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

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
} from "lucide-react";
import { getActions } from "@/lib/actionsStore";

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
  { icon: LayoutDashboard, label: "Mis Tareas", path: "/collaborator/task-review" },
  { icon: Activity, label: "Check-in", path: "/collaborator/week" },
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
    const raw = localStorage.getItem("tp_work_plan");
    if (raw) {
      const plan = JSON.parse(raw);
      const total = plan.objectives?.reduce((s: number, o: any) =>
        s + (o.initiatives?.length || 0), 0) || 0;
      if (total > 0) badges.todo = total;
    }
  } catch {}

  return badges;
}

export const Sidebar = ({ userRole, userName, onLogout }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = userRole === "leader" ? leaderNavItems : collaboratorNavItems;

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
    if (sec !== currentSection) {
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
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[hsl(var(--signal-positive))] rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-semibold text-white text-sm">Talent Performance</h1>
            <p className="text-xs text-white/50">LAB</p>
          </div>
        </div>
      </div>

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
        {/* Proceso activo */}
        {userRole === "leader" && (() => {
          const processName = getProcessName();
          return (
            <div className="bg-white/5 rounded-xl p-4 space-y-2">
              <p className="text-[10px] font-bold tracking-[0.15em] text-white/40 uppercase">Proceso activo</p>
              <p className="text-sm font-semibold text-white">{processName}</p>
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-white/50">Diagnóstico</span>
                  <span className="text-[hsl(var(--signal-positive))] font-semibold">1/3</span>
                </div>
                <div className="h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <div className="h-full rounded-full bg-[hsl(var(--signal-positive))]" style={{ width: "33%" }} />
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
              {userName.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">{userName}</p>
            <p className="text-xs text-white/40 capitalize">Líder · Ventas</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

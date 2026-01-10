import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Target,
  Users,
  Activity,
  Settings,
  LogOut,
  TrendingUp,
} from "lucide-react";

interface SidebarProps {
  userRole: "leader" | "collaborator";
  userName: string;
  onLogout: () => void;
}

const leaderNavItems = [
  { icon: LayoutDashboard, label: "Dashboard", path: "/leader" },
  { icon: Target, label: "Objectives", path: "/leader/objectives" },
  { icon: Users, label: "Team", path: "/leader/team" },
  { icon: Activity, label: "Signals", path: "/leader/signals" },
  { icon: TrendingUp, label: "Insights", path: "/leader/insights" },
];

const collaboratorNavItems = [
  { icon: LayoutDashboard, label: "My Work", path: "/collaborator" },
  { icon: Target, label: "My Objectives", path: "/collaborator/objectives" },
  { icon: Activity, label: "Feedback", path: "/collaborator/feedback" },
];

export const Sidebar = ({ userRole, userName, onLogout }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const navItems = userRole === "leader" ? leaderNavItems : collaboratorNavItems;

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex flex-col z-50">
      {/* Logo */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-semibold text-foreground text-sm">Talent Performance</h1>
            <p className="text-xs text-muted-foreground">Lab</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              <item.icon className="w-5 h-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border space-y-2">
        <button
          onClick={() => navigate("/settings")}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
        >
          <Settings className="w-5 h-5" />
          Settings
        </button>
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:text-signal-critical hover:bg-signal-critical/10 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign out
        </button>
      </div>

      {/* User */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-primary/10 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium text-primary">
              {userName.split(" ").map(n => n[0]).join("")}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">{userName}</p>
            <p className="text-xs text-muted-foreground capitalize">{userRole}</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

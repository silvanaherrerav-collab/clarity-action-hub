import { Sidebar } from "@/components/layout/Sidebar";
import { MetricCard } from "@/components/ui/MetricCard";
import { ObjectiveCard } from "@/components/ui/ObjectiveCard";
import { InsightCard } from "@/components/ui/InsightCard";
import { TeamMemberRow } from "@/components/ui/TeamMemberRow";
import { SignalBadge } from "@/components/ui/SignalBadge";
import { useNavigate } from "react-router-dom";
import { 
  Target, 
  Users, 
  Activity, 
  TrendingUp,
  Calendar,
  ChevronRight
} from "lucide-react";
import { Button } from "@/components/ui/button";

const LeaderDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const objectives = [
    {
      title: "Reduce order processing time by 20%",
      description: "Optimize warehouse workflows and automate key handoff points",
      progress: 72,
      status: "on-track" as const,
      dueDate: "Mar 31, 2026",
    },
    {
      title: "Achieve 98% on-time delivery rate",
      description: "Improve route optimization and carrier coordination",
      progress: 45,
      status: "at-risk" as const,
      dueDate: "Q1 2026",
    },
    {
      title: "Reduce team overtime by 30%",
      description: "Better workload distribution and hiring plan",
      progress: 28,
      status: "off-track" as const,
      dueDate: "Feb 28, 2026",
    },
  ];

  const teamMembers = [
    {
      name: "Sarah Chen",
      role: "Warehouse Lead",
      initials: "SC",
      signals: {
        execution: "positive" as const,
        clarity: "positive" as const,
        alignment: "positive" as const,
      },
    },
    {
      name: "Marcus Johnson",
      role: "Shift Supervisor",
      initials: "MJ",
      signals: {
        execution: "positive" as const,
        clarity: "warning" as const,
        alignment: "positive" as const,
      },
    },
    {
      name: "Elena Rodriguez",
      role: "Operations Analyst",
      initials: "ER",
      signals: {
        execution: "warning" as const,
        clarity: "critical" as const,
        alignment: "warning" as const,
      },
    },
    {
      name: "David Kim",
      role: "Logistics Coordinator",
      initials: "DK",
      signals: {
        execution: "positive" as const,
        clarity: "positive" as const,
        alignment: "warning" as const,
      },
    },
  ];

  const insights = [
    {
      title: "Elena needs clarity on priorities",
      description: "Her clarity signal dropped 40% this week. Schedule a 1:1 to realign on Q1 objectives.",
      priority: "high" as const,
      actionLabel: "Schedule 1:1",
    },
    {
      title: "Overtime trending up in night shift",
      description: "3 team members averaging 12+ hours. Consider temporary staffing support.",
      priority: "medium" as const,
      actionLabel: "Review schedule",
    },
    {
      title: "Strong execution in warehouse team",
      description: "Processing time improved 15% this month. Consider sharing best practices.",
      priority: "low" as const,
      actionLabel: "Share insights",
    },
  ];

  return (
    <div className="min-h-screen bg-surface-sunken">
      <Sidebar 
        userRole="leader" 
        userName="Alex Thompson" 
        onLogout={handleLogout}
      />
      
      <main className="pl-64">
        <div className="p-8 max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Good morning, Alex</h1>
              <p className="text-muted-foreground mt-1">Here's what's happening with your team today</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Calendar className="w-4 h-4 mr-2" />
                This week
              </Button>
              <Button size="sm">
                <Target className="w-4 h-4 mr-2" />
                New objective
              </Button>
            </div>
          </div>

          {/* Metrics Overview */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Team Size"
              value="12"
              subtitle="Active members"
              icon={Users}
            />
            <MetricCard
              title="Objectives"
              value="8"
              subtitle="3 on track, 3 at risk, 2 off track"
              icon={Target}
            />
            <MetricCard
              title="Team Health"
              value="76%"
              trend={{ value: 4, direction: "up" }}
              subtitle="vs last month"
              icon={Activity}
            />
            <MetricCard
              title="Performance"
              value="82%"
              trend={{ value: 2, direction: "down" }}
              subtitle="vs target"
              icon={TrendingUp}
            />
          </div>

          {/* Signals Summary */}
          <div className="bg-card border border-border rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold text-foreground">Team Signals</h2>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                View details
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Execution</span>
                  <SignalBadge signal="positive" label="Strong" />
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-signal-positive rounded-full" style={{ width: "78%" }} />
                </div>
                <p className="text-xs text-muted-foreground">9 of 12 members executing well</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Clarity</span>
                  <SignalBadge signal="warning" label="Needs attention" />
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-signal-warning rounded-full" style={{ width: "58%" }} />
                </div>
                <p className="text-xs text-muted-foreground">5 members need priority clarity</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-muted-foreground">Alignment</span>
                  <SignalBadge signal="positive" label="Good" />
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-signal-positive rounded-full" style={{ width: "72%" }} />
                </div>
                <p className="text-xs text-muted-foreground">Team aligned with objectives</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Objectives */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-foreground">Area Objectives</h2>
                <Button variant="ghost" size="sm" className="text-muted-foreground">
                  View all
                  <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
              <div className="space-y-3">
                {objectives.map((objective, index) => (
                  <ObjectiveCard
                    key={index}
                    {...objective}
                    className="animate-fade-in"
                    onClick={() => {}}
                  />
                ))}
              </div>
            </div>

            {/* Insights */}
            <div className="space-y-4">
              <h2 className="text-lg font-semibold text-foreground">Actionable Insights</h2>
              <div className="space-y-3">
                {insights.map((insight, index) => (
                  <InsightCard
                    key={index}
                    {...insight}
                    className="animate-fade-in"
                    onAction={() => {}}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Team Overview */}
          <div className="bg-card border border-border rounded-xl p-6 card-shadow">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Team Overview</h2>
              <Button variant="ghost" size="sm" className="text-muted-foreground">
                View all members
                <ChevronRight className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="divide-y divide-border">
              {teamMembers.map((member, index) => (
                <TeamMemberRow
                  key={index}
                  {...member}
                  className="animate-fade-in"
                  onClick={() => {}}
                />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default LeaderDashboard;

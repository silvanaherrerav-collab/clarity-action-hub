import { Sidebar } from "@/components/layout/Sidebar";
import { MetricCard } from "@/components/ui/MetricCard";
import { ObjectiveCard } from "@/components/ui/ObjectiveCard";
import { useNavigate } from "react-router-dom";
import { 
  Target, 
  CheckCircle, 
  Clock, 
  MessageCircle,
  ChevronRight,
  Plus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const CollaboratorDashboard = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate("/");
  };

  const myObjectives = [
    {
      title: "Complete inventory reconciliation",
      description: "Align physical counts with system records across all zones",
      progress: 85,
      status: "on-track" as const,
      dueDate: "Jan 20, 2026",
    },
    {
      title: "Train 3 new team members",
      description: "Onboard and mentor new warehouse associates",
      progress: 66,
      status: "on-track" as const,
      dueDate: "Feb 15, 2026",
    },
    {
      title: "Reduce picking errors to <1%",
      description: "Implement double-check process for high-value items",
      progress: 40,
      status: "at-risk" as const,
      dueDate: "Jan 31, 2026",
    },
  ];

  const dailyTasks = [
    { id: 1, title: "Morning zone inspection", completed: true, linkedObjective: "Inventory reconciliation" },
    { id: 2, title: "New hire shadowing session", completed: true, linkedObjective: "Train new team members" },
    { id: 3, title: "Quality check review meeting", completed: false, linkedObjective: "Reduce picking errors" },
    { id: 4, title: "Update picking SOP document", completed: false, linkedObjective: "Reduce picking errors" },
    { id: 5, title: "End-of-day count verification", completed: false, linkedObjective: "Inventory reconciliation" },
  ];

  const teamGoals = [
    {
      title: "Reduce order processing time by 20%",
      progress: 72,
      yourContribution: "Zone efficiency improvements",
    },
    {
      title: "Achieve 98% on-time delivery rate",
      progress: 45,
      yourContribution: "Accurate picking & packing",
    },
  ];

  const feedbackQuestions = [
    "How clear are your priorities this week?",
    "Do you have what you need to do your best work?",
    "How would you rate your energy level today?",
  ];

  return (
    <div className="min-h-screen bg-surface-sunken">
      <Sidebar 
        userRole="collaborator" 
        userName="Sarah Chen" 
        onLogout={handleLogout}
      />
      
      <main className="pl-64">
        <div className="p-8 max-w-6xl mx-auto space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Good morning, Sarah</h1>
              <p className="text-muted-foreground mt-1">Let's make today count</p>
            </div>
            <Button size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Log work
            </Button>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <MetricCard
              title="My Objectives"
              value="3"
              subtitle="2 on track, 1 at risk"
              icon={Target}
            />
            <MetricCard
              title="Tasks Today"
              value="5"
              subtitle="2 completed"
              icon={CheckCircle}
            />
            <MetricCard
              title="Focus Time"
              value="4.5h"
              subtitle="Logged this week"
              icon={Clock}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - Tasks & Objectives */}
            <div className="lg:col-span-2 space-y-6">
              {/* Today's Tasks */}
              <div className="bg-card border border-border rounded-xl p-6 card-shadow">
                <div className="flex items-center justify-between mb-5">
                  <h2 className="text-lg font-semibold text-foreground">Today's Tasks</h2>
                  <Button variant="ghost" size="sm" className="text-primary">
                    <Plus className="w-4 h-4 mr-1" />
                    Add task
                  </Button>
                </div>
                <div className="space-y-3">
                  {dailyTasks.map((task) => (
                    <div
                      key={task.id}
                      className={cn(
                        "flex items-start gap-3 p-3 rounded-lg transition-colors",
                        task.completed ? "bg-muted/30" : "hover:bg-muted/50"
                      )}
                    >
                      <button
                        className={cn(
                          "mt-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-colors",
                          task.completed
                            ? "bg-signal-positive border-signal-positive"
                            : "border-muted-foreground hover:border-primary"
                        )}
                      >
                        {task.completed && (
                          <CheckCircle className="w-3 h-3 text-primary-foreground" />
                        )}
                      </button>
                      <div className="flex-1 min-w-0">
                        <p
                          className={cn(
                            "font-medium",
                            task.completed ? "text-muted-foreground line-through" : "text-foreground"
                          )}
                        >
                          {task.title}
                        </p>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          Linked to: {task.linkedObjective}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* My Objectives */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-foreground">My Objectives</h2>
                  <Button variant="ghost" size="sm" className="text-muted-foreground">
                    View all
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
                <div className="space-y-3">
                  {myObjectives.map((objective, index) => (
                    <ObjectiveCard
                      key={index}
                      {...objective}
                      className="animate-fade-in"
                      onClick={() => {}}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column - Team Goals & Feedback */}
            <div className="space-y-6">
              {/* How My Work Connects */}
              <div className="bg-card border border-border rounded-xl p-6 card-shadow">
                <h2 className="text-lg font-semibold text-foreground mb-4">
                  How My Work Connects
                </h2>
                <div className="space-y-4">
                  {teamGoals.map((goal, index) => (
                    <div key={index} className="space-y-2">
                      <p className="text-sm font-medium text-foreground">{goal.title}</p>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${goal.progress}%` }}
                        />
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Your contribution: {goal.yourContribution}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Feedback */}
              <div className="bg-card border border-border rounded-xl p-6 card-shadow">
                <div className="flex items-center gap-2 mb-4">
                  <MessageCircle className="w-5 h-5 text-primary" />
                  <h2 className="text-lg font-semibold text-foreground">Quick Check-in</h2>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Share a quick update with your leader
                </p>
                <div className="space-y-3">
                  {feedbackQuestions.map((question, index) => (
                    <button
                      key={index}
                      className="w-full text-left p-3 rounded-lg border border-border hover:border-primary/50 hover:bg-muted/50 transition-colors group"
                    >
                      <p className="text-sm font-medium text-foreground group-hover:text-primary">
                        {question}
                      </p>
                    </button>
                  ))}
                </div>
                <Button variant="outline" className="w-full mt-4">
                  Complete check-in
                </Button>
              </div>

              {/* Recognition */}
              <div className="bg-primary/5 border border-primary/20 rounded-xl p-5">
                <p className="text-sm font-medium text-foreground">🎉 Nice work!</p>
                <p className="text-sm text-muted-foreground mt-1">
                  You've completed 12 tasks this week, 20% more than your average.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CollaboratorDashboard;

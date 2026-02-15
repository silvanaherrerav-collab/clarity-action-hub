import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TrendingUp, Users, UserCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

type Role = "leader" | "collaborator";

const Login = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<Role | null>(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedRole === "leader") {
      navigate("/leader/welcome");
    } else {
      navigate("/collaborator");
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-primary/5 p-12 flex-col justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <div>
              <h1 className="font-semibold text-foreground">Talent Performance Lab</h1>
            </div>
          </div>
        </div>
        
        <div className="space-y-6">
          <h2 className="text-4xl font-semibold text-foreground leading-tight">
            See what's happening.<br />
            Decide better.<br />
            Lead smarter.
          </h2>
          <p className="text-lg text-muted-foreground max-w-md">
            Connect business objectives with day-to-day work and real behavioral signals. 
            Know where to intervene first to improve performance without burning out your people.
          </p>
        </div>

        <div className="flex items-center gap-8">
          <div className="text-center">
            <p className="text-3xl font-semibold text-foreground">40%</p>
            <p className="text-sm text-muted-foreground">Faster decisions</p>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <p className="text-3xl font-semibold text-foreground">3x</p>
            <p className="text-sm text-muted-foreground">Better alignment</p>
          </div>
          <div className="w-px h-12 bg-border" />
          <div className="text-center">
            <p className="text-3xl font-semibold text-foreground">-25%</p>
            <p className="text-sm text-muted-foreground">Team burnout</p>
          </div>
        </div>
      </div>

      {/* Right Panel - Login Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8 animate-fade-in">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center">
            <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-primary-foreground" />
            </div>
            <h1 className="font-semibold text-foreground">Talent Performance Lab</h1>
          </div>

          <div className="text-center">
            <h2 className="text-2xl font-semibold text-foreground">Welcome back</h2>
            <p className="text-muted-foreground mt-2">Sign in to your account to continue</p>
          </div>

          {/* Role Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-foreground">I am a...</Label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole("leader")}
                className={cn(
                  "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200",
                  selectedRole === "leader"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  selectedRole === "leader" ? "bg-primary/10" : "bg-muted"
                )}>
                  <Users className={cn(
                    "w-6 h-6",
                    selectedRole === "leader" ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <div className="text-center">
                  <p className={cn(
                    "font-medium",
                    selectedRole === "leader" ? "text-primary" : "text-foreground"
                  )}>Leader</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Manage teams & objectives</p>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedRole("collaborator")}
                className={cn(
                  "flex flex-col items-center gap-3 p-6 rounded-xl border-2 transition-all duration-200",
                  selectedRole === "collaborator"
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-muted/50"
                )}
              >
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center transition-colors",
                  selectedRole === "collaborator" ? "bg-primary/10" : "bg-muted"
                )}>
                  <UserCircle className={cn(
                    "w-6 h-6",
                    selectedRole === "collaborator" ? "text-primary" : "text-muted-foreground"
                  )} />
                </div>
                <div className="text-center">
                  <p className={cn(
                    "font-medium",
                    selectedRole === "collaborator" ? "text-primary" : "text-foreground"
                  )}>Collaborator</p>
                  <p className="text-xs text-muted-foreground mt-0.5">Track work & give feedback</p>
                </div>
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="h-11"
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <button type="button" className="text-sm text-primary hover:underline">
                  Forgot password?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="h-11"
              />
            </div>
            <Button 
              type="submit" 
              className="w-full h-11" 
              disabled={!selectedRole}
            >
              Sign in
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          </form>

          <p className="text-center text-sm text-muted-foreground">
            Don't have an account?{" "}
            <button className="text-primary hover:underline font-medium">
              Request access
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;

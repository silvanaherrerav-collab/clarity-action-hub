import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { SignalBadge } from "./SignalBadge";

interface TeamMemberRowProps {
  name: string;
  role: string;
  initials: string;
  signals: {
    execution: "positive" | "warning" | "critical" | "neutral";
    clarity: "positive" | "warning" | "critical" | "neutral";
    alignment: "positive" | "warning" | "critical" | "neutral";
  };
  onClick?: () => void;
  className?: string;
}

export const TeamMemberRow = ({
  name,
  role,
  initials,
  signals,
  onClick,
  className,
}: TeamMemberRowProps) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center justify-between p-4 rounded-lg hover:bg-muted/50 transition-colors cursor-pointer group",
        className
      )}
    >
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10">
          <AvatarFallback className="bg-primary/10 text-primary font-medium text-sm">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium text-foreground">{name}</p>
          <p className="text-sm text-muted-foreground">{role}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <SignalBadge signal={signals.execution} label="Execution" />
        <SignalBadge signal={signals.clarity} label="Clarity" />
        <SignalBadge signal={signals.alignment} label="Alignment" />
      </div>
    </div>
  );
};

import { cn } from "@/lib/utils";
import { Target, ChevronRight } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ObjectiveCardProps {
  title: string;
  description?: string;
  progress: number;
  status: "on-track" | "at-risk" | "off-track";
  dueDate?: string;
  onClick?: () => void;
  className?: string;
}

const statusConfig = {
  "on-track": {
    label: "On Track",
    color: "text-signal-positive",
    progressColor: "bg-signal-positive",
  },
  "at-risk": {
    label: "At Risk",
    color: "text-signal-warning",
    progressColor: "bg-signal-warning",
  },
  "off-track": {
    label: "Off Track",
    color: "text-signal-critical",
    progressColor: "bg-signal-critical",
  },
};

export const ObjectiveCard = ({
  title,
  description,
  progress,
  status,
  dueDate,
  onClick,
  className,
}: ObjectiveCardProps) => {
  const config = statusConfig[status];

  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-card border border-border rounded-xl p-5 card-shadow hover:card-shadow-lg transition-all duration-200 cursor-pointer group",
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className="p-2.5 bg-primary/5 rounded-lg">
          <Target className="w-5 h-5 text-primary" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <h4 className="font-medium text-foreground truncate">{title}</h4>
            <ChevronRight className="w-4 h-4 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
          </div>
          {description && (
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {description}
            </p>
          )}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className={cn("font-medium", config.color)}>
                {config.label}
              </span>
              <span className="text-muted-foreground">{progress}%</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div
                className={cn("h-full rounded-full transition-all duration-500", config.progressColor)}
                style={{ width: `${progress}%` }}
              />
            </div>
            {dueDate && (
              <p className="text-xs text-muted-foreground">Due: {dueDate}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

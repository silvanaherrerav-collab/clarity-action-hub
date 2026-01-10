import { cn } from "@/lib/utils";
import { Lightbulb, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

interface InsightCardProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  priority?: "high" | "medium" | "low";
  className?: string;
}

const priorityConfig = {
  high: {
    border: "border-l-signal-critical",
    icon: "text-signal-critical",
    bg: "bg-signal-critical/5",
  },
  medium: {
    border: "border-l-signal-warning",
    icon: "text-signal-warning",
    bg: "bg-signal-warning/5",
  },
  low: {
    border: "border-l-primary",
    icon: "text-primary",
    bg: "bg-primary/5",
  },
};

export const InsightCard = ({
  title,
  description,
  actionLabel = "Take Action",
  onAction,
  priority = "medium",
  className,
}: InsightCardProps) => {
  const config = priorityConfig[priority];

  return (
    <div
      className={cn(
        "bg-card border border-border border-l-4 rounded-xl p-5 card-shadow",
        config.border,
        className
      )}
    >
      <div className="flex items-start gap-4">
        <div className={cn("p-2 rounded-lg", config.bg)}>
          <Lightbulb className={cn("w-5 h-5", config.icon)} />
        </div>
        <div className="flex-1 space-y-3">
          <div>
            <h4 className="font-medium text-foreground">{title}</h4>
            <p className="text-sm text-muted-foreground mt-1">{description}</p>
          </div>
          {onAction && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onAction}
              className="text-primary hover:text-primary/80 hover:bg-primary/5 -ml-3"
            >
              {actionLabel}
              <ArrowRight className="w-4 h-4 ml-1" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

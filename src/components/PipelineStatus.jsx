import { Check, Loader2, AlertCircle, Globe, Brain, FileText } from "lucide-react";

const stages = [
  { key: "pending", label: "Queued", icon: FileText },
  { key: "scraping", label: "Scraping Sources", icon: Globe },
  { key: "analyzing", label: "AI Analysis", icon: Brain },
  { key: "completed", label: "Brief Ready", icon: Check },
];

export function PipelineStatus({ status }) {
  const currentIdx = stages.findIndex(s => s.key === status);
  const isFailed = status === "failed";

  return (
    <div className="flex items-center gap-3 p-4 rounded-lg bg-card border border-border animate-fade-in">
      {stages.map((stage, i) => {
        const Icon = stage.icon;
        const isActive = stage.key === status;
        const isDone = i < currentIdx || status === "completed";

        return (
          <div key={stage.key} className="flex items-center gap-2">
            {i > 0 && (
              <div className={`w-8 h-px ${isDone ? "bg-primary" : "bg-border"} transition-colors`} />
            )}
            <div className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${isDone
                    ? "bg-primary text-primary-foreground"
                    : isActive
                      ? "bg-primary/20 text-primary border border-primary/40 animate-pulse-slow"
                      : isFailed && isActive
                        ? "bg-destructive/20 text-destructive border border-destructive/40"
                        : "bg-secondary text-muted-foreground"
                  }`}
              >
                {isDone ? (
                  <Check className="w-4 h-4" />
                ) : isActive && !isFailed ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : isFailed && isActive ? (
                  <AlertCircle className="w-4 h-4" />
                ) : (
                  <Icon className="w-4 h-4" />
                )}
              </div>
              <span
                className={`text-sm font-medium ${isDone ? "text-foreground" : isActive ? "text-primary" : "text-muted-foreground"
                  }`}
              >
                {stage.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

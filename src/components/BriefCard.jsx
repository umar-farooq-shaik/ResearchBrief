import { Link } from "react-router-dom";
import { FileText, Clock, ExternalLink, AlertCircle, CheckCircle, Loader2 } from "lucide-react";

const statusConfig = {
  pending: { icon: Clock, label: "Queued", className: "text-muted-foreground" },
  scraping: { icon: Loader2, label: "Scraping", className: "text-info animate-spin" },
  analyzing: { icon: Loader2, label: "Analyzing", className: "text-primary animate-spin" },
  completed: { icon: CheckCircle, label: "Completed", className: "text-success" },
  failed: { icon: AlertCircle, label: "Failed", className: "text-destructive" },
};

export function BriefCard({ brief }) {
  const { icon: StatusIcon, label, className } = statusConfig[brief.status];
  const time = new Date(brief.created_at).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <Link
      to={`/brief/${brief.id}`}
      className="group block p-4 rounded-lg bg-card border border-border hover:border-primary/30 hover:border-glow transition-all animate-fade-in"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="w-4 h-4 text-primary" />
          <h3 className="font-display text-sm text-foreground group-hover:text-primary transition-colors truncate max-w-[240px]">
            {brief.title || "Untitled Brief"}
          </h3>
        </div>
        <ExternalLink className="w-3.5 h-3.5 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <div className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <StatusIcon className={`w-3.5 h-3.5 ${className}`} />
          {label}
        </span>
        <span>•</span>
        <span>{brief.urls.length} sources</span>
        <span>•</span>
        <span>{time}</span>
      </div>

      {brief.topic_tags.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {brief.topic_tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-2 py-0.5 text-[10px] font-medium uppercase tracking-wider rounded-full bg-primary/10 text-primary">
              {tag}
            </span>
          ))}
        </div>
      )}
    </Link>
  );
}

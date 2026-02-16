import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, AlertTriangle, ShieldCheck, Quote, ExternalLink, Tag, TrendingUp } from "lucide-react";

const confidenceColors = {
  high: "bg-success/15 text-success border-success/20",
  medium: "bg-primary/15 text-primary border-primary/20",
  low: "bg-destructive/15 text-destructive border-destructive/20",
};

export function BriefView({ brief }) {
  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="font-display text-3xl text-foreground mb-3">{brief.title || "Research Brief"}</h1>
        {brief.topic_tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {brief.topic_tags.map(tag => (
              <span key={tag} className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-full bg-primary/10 text-primary border border-primary/20">
                <Tag className="w-3 h-3" />
                {tag}
              </span>
            ))}
          </div>
        )}
        <p className="text-muted-foreground leading-relaxed">{brief.summary}</p>
      </div>

      <Separator className="bg-border" />

      {/* Key Findings */}
      {brief.key_findings.length > 0 && (
        <section>
          <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Key Findings
          </h2>
          <div className="space-y-3">
            {brief.key_findings.map((f, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-secondary/50 border border-border animate-fade-in" style={{ animationDelay: `${i * 80}ms` }}>
                <div className={`shrink-0 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded border ${confidenceColors[f.confidence]}`}>
                  {f.confidence}
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {f.finding}
                  {f.source_indices && f.source_indices.length > 0 && (
                    <span className="ml-2 inline-flex gap-1 align-super text-[10px]">
                      {f.source_indices.map((idx) => {
                        const source = brief.sources?.[idx];
                        if (!source) return null;
                        return (
                          <a
                            key={idx}
                            href={source.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary hover:underline font-medium"
                            title={source.title || source.domain}
                          >
                            [{idx + 1}]
                          </a>
                        );
                      })}
                    </span>
                  )}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Conflicts */}
      {brief.conflicts.length > 0 && (
        <section>
          <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-destructive" />
            Detected Conflicts
          </h2>
          <div className="space-y-3">
            {brief.conflicts.map((c, i) => (
              <div key={i} className="p-3 rounded-lg border border-destructive/20 bg-destructive/5">
                <div className="flex items-center gap-2 mb-1">
                  <Badge variant="outline" className="text-[10px] uppercase border-destructive/30 text-destructive">{c.severity}</Badge>
                </div>
                <p className="text-sm text-foreground">{c.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Verification Checklist */}
      {brief.verification_checklist.length > 0 && (
        <section>
          <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-success" />
            Verification Checklist
          </h2>
          <div className="space-y-2">
            {brief.verification_checklist.map((item, i) => (
              <div key={i} className="flex items-start gap-3 p-2">
                <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${item.verified ? "text-success" : "text-muted-foreground"}`} />
                <span className={`text-sm ${item.verified ? "text-foreground" : "text-muted-foreground"}`}>{item.claim}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <Separator className="bg-border" />

      {/* Citations */}
      {brief.citations.length > 0 && (
        <section>
          <h2 className="font-display text-xl text-foreground mb-4 flex items-center gap-2">
            <Quote className="w-5 h-5 text-primary" />
            Citations
          </h2>
          <div className="space-y-3">
            {brief.citations.map((c, i) => {
              const source = brief.sources?.[c.source_index];
              return (
                <div key={i} className="p-3 rounded-lg bg-card border border-border">
                  <p className="text-sm text-foreground mb-2">"{c.text}"</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {source ? (
                      <a
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono hover:underline transition-colors"
                        title={source.title}
                      >
                        Source {c.source_index + 1}
                      </a>
                    ) : (
                      <span className="px-1.5 py-0.5 rounded bg-primary/10 text-primary font-mono">Source {c.source_index + 1}</span>
                    )}
                    <span className="italic">{c.relevance}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Sources */}
      {brief.sources.length > 0 && (
        <section>
          <h2 className="font-display text-xl text-foreground mb-4">Source Breakdown</h2>
          <div className="space-y-3">
            {brief.sources.map((s, i) => (
              <div key={i} className="p-4 rounded-lg bg-card border border-border">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 flex items-center justify-center rounded bg-primary/10 text-primary text-xs font-mono font-bold">{i + 1}</span>
                    <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-foreground truncate max-w-sm hover:text-primary hover:underline transition-colors">
                      {s.title || s.domain}
                    </a>
                  </div>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-xs flex items-center gap-1">
                    {s.domain}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
                {s.snippet && <p className="text-xs text-muted-foreground line-clamp-2">{s.snippet}</p>}
                {s.status === "failed" && (
                  <p className="text-xs text-destructive mt-1">Failed to scrape: {s.error}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

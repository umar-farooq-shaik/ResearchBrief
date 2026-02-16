import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import { UrlInput } from "@/components/UrlInput";
import { BriefCard } from "@/components/BriefCard";
import { createBrief, getRecentBriefs, runResearchPipeline } from "@/lib/api";
import { FileText, Sparkles, Globe, ShieldCheck } from "lucide-react";

const features = [
  { icon: Globe, title: "Multi-Source Ingestion", desc: "Paste up to 10 URLs and we scrape, clean, and structure the content." },
  { icon: Sparkles, title: "AI-Powered Analysis", desc: "Structured research briefs with findings, conflicts, and citations." },
  { icon: ShieldCheck, title: "Verification Built-In", desc: "Automated fact-checking checklists and confidence scoring." },
];

export default function Index() {
  const [isLoading, setIsLoading] = useState(false);
  const [recentBriefs, setRecentBriefs] = useState([]);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    getRecentBriefs(5).then(setRecentBriefs).catch(() => { });
  }, []);

  const handleSubmit = async (urls) => {
    setIsLoading(true);
    try {
      const brief = await createBrief(urls);
      navigate(`/brief/${brief.id}`);
      runResearchPipeline(brief.id).catch(err => {
        console.error("Pipeline error:", err);
      });
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container max-w-3xl py-12 space-y-12">
      {/* Hero */}
      <div className="text-center space-y-4 animate-fade-in">
        <h1 className="font-display text-4xl md:text-5xl text-foreground leading-tight">
          Research Briefs,{" "}
          <span className="text-gradient-primary">Automated</span>
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
          Paste your sources. Get a structured brief with key findings, conflicts, and verified citations in seconds.
        </p>
      </div>

      {/* URL Input */}
      <div className="p-6 rounded-xl bg-card border border-border border-glow animate-fade-in" style={{ animationDelay: "100ms" }}>
        <div className="flex items-center gap-2 mb-4">
          <FileText className="w-4 h-4 text-primary" />
          <h2 className="font-display text-lg text-foreground">New Research Brief</h2>
        </div>
        <UrlInput onSubmit={handleSubmit} isLoading={isLoading} />
      </div>

      {/* Features */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
        {features.map(f => (
          <div key={f.title} className="p-4 rounded-lg bg-card border border-border group hover:border-primary/20 transition-all">
            <f.icon className="w-5 h-5 text-primary mb-3" />
            <h3 className="font-display text-sm text-foreground mb-1">{f.title}</h3>
            <p className="text-xs text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* Recent Briefs */}
      {recentBriefs.length > 0 && (
        <div className="space-y-4 animate-fade-in" style={{ animationDelay: "300ms" }}>
          <h2 className="font-display text-xl text-foreground">Recent Briefs</h2>
          <div className="grid gap-3">
            {recentBriefs.map(b => (
              <BriefCard key={b.id} brief={b} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

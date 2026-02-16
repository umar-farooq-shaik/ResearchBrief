import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getBrief } from "@/lib/api";
import { BriefView } from "@/components/BriefView";
import { PipelineStatus } from "@/components/PipelineStatus";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function BriefPage() {
  const { id } = useParams();
  const [brief, setBrief] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;

    const load = () => getBrief(id).then(setBrief).catch(e => setError(e.message));
    load();

    const interval = setInterval(async () => {
      try {
        const b = await getBrief(id);
        setBrief(b);
        if (b.status === "completed" || b.status === "failed") {
          clearInterval(interval);
        }
      } catch { }
    }, 3000);

    return () => clearInterval(interval);
  }, [id]);

  if (error) {
    return (
      <div className="container max-w-3xl py-12 text-center">
        <p className="text-destructive mb-4">{error}</p>
        <Link to="/" className="text-primary hover:underline text-sm">← Back home</Link>
      </div>
    );
  }

  if (!brief) {
    return (
      <div className="container max-w-3xl py-24 flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-primary animate-spin" />
      </div>
    );
  }

  return (
    <div className="container max-w-3xl py-8 space-y-6">
      <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to home
      </Link>

      {brief.status !== "completed" && <PipelineStatus status={brief.status} />}

      {brief.status === "failed" && (
        <div className="p-4 rounded-lg border border-destructive/30 bg-destructive/5 text-sm text-destructive">
          {brief.error_message || "An error occurred during processing."}
        </div>
      )}

      {brief.status === "completed" && <BriefView brief={brief} />}
    </div>
  );
}

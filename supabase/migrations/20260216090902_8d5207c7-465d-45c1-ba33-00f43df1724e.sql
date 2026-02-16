
-- Research briefs table (public, no auth required for V1)
CREATE TABLE public.research_briefs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'scraping', 'analyzing', 'completed', 'failed')),
  urls TEXT[] NOT NULL,
  title TEXT,
  summary TEXT,
  key_findings JSONB DEFAULT '[]'::jsonb,
  conflicts JSONB DEFAULT '[]'::jsonb,
  verification_checklist JSONB DEFAULT '[]'::jsonb,
  citations JSONB DEFAULT '[]'::jsonb,
  sources JSONB DEFAULT '[]'::jsonb,
  topic_tags TEXT[] DEFAULT '{}',
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS but allow public access for V1 (no auth)
ALTER TABLE public.research_briefs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON public.research_briefs FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON public.research_briefs FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON public.research_briefs FOR UPDATE USING (true);

-- Timestamp trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_research_briefs_updated_at
  BEFORE UPDATE ON public.research_briefs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Index for recent briefs
CREATE INDEX idx_research_briefs_created_at ON public.research_briefs(created_at DESC);

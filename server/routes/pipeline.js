import express from 'express';
import { createClient } from '@supabase/supabase-js';
import fetch from 'node-fetch';
import { GoogleGenerativeAI } from '@google/generative-ai';

const router = express.Router();

const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_PUBLISHABLE_KEY;
const firecrawlKey = process.env.FIRECRAWL_API_KEY;
const geminiApiKey = process.env.GEMINI_API_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey) {
    supabase = createClient(supabaseUrl, supabaseKey);
} else {
    console.warn("WARNING: Supabase URL or Anon Key missing. Pipeline will not work.");
}

const genAI = geminiApiKey ? new GoogleGenerativeAI(geminiApiKey) : null;
if (!genAI) {
    console.warn("WARNING: GEMINI_API_KEY missing. AI features will not work.");
}

router.post('/', async (req, res) => {
    const { briefId } = req.body;
    if (!briefId) {
        return res.status(400).json({ error: 'briefId required' });
    }

    if (!supabase) {
        return res.status(500).json({ error: 'Supabase client not initialized. Check your environment variables (SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY).' });
    }

    try {
        const { data: brief, error: fetchErr } = await supabase
            .from("research_briefs")
            .select("*")
            .eq("id", briefId)
            .single();

        if (fetchErr || !brief) throw new Error("Brief not found");

        await supabase.from("research_briefs").update({ status: "scraping" }).eq("id", briefId);

        const sources = [];
        for (const url of brief.urls) {
            try {
                let formattedUrl = url.trim();
                if (!formattedUrl.startsWith("http")) formattedUrl = `https://${formattedUrl}`;

                const scrapeResp = await fetch("https://api.firecrawl.dev/v1/scrape", {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${firecrawlKey}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        url: formattedUrl,
                        formats: ["markdown"],
                        onlyMainContent: true,
                    }),
                });

                const scrapeData = await scrapeResp.json();
                const markdown = scrapeData?.data?.markdown || scrapeData?.markdown || "";
                const title = scrapeData?.data?.metadata?.title || scrapeData?.metadata?.title || "";
                const domain = new URL(formattedUrl).hostname;

                sources.push({
                    url: formattedUrl,
                    title,
                    domain,
                    snippet: markdown.slice(0, 300),
                    scraped_content: markdown.slice(0, 8000),
                    status: "success",
                });
            } catch (e) {
                const domain = (() => { try { return new URL(url).hostname; } catch { return url; } })();
                sources.push({
                    url,
                    title: "",
                    domain,
                    snippet: "",
                    scraped_content: "",
                    status: "failed",
                    error: e instanceof Error ? e.message : "Unknown error",
                });
            }
        }

        await supabase.from("research_briefs").update({ sources, status: "analyzing" }).eq("id", briefId);

        const successSources = sources.filter((s) => s.status === "success");
        if (successSources.length === 0) {
            await supabase.from("research_briefs").update({
                status: "failed",
                error_message: "No sources could be scraped successfully.",
            }).eq("id", briefId);
            return res.json({ success: false });
        }

        const sourceContext = sources.map((s, i) => {
            if (s.status !== 'success') return null;
            return `[Source Index: ${i}] URL: ${s.url}\nTitle: ${s.title}\nContent:\n${s.scraped_content}`;
        }).filter(Boolean).join("\n\n---\n\n");

        const systemPrompt = `You are a research analyst AI. Analyze the provided web sources and generate a structured research brief.

You MUST respond with valid JSON matching this exact schema:
{
  "title": "Brief descriptive title for the research topic",
  "summary": "2-3 paragraph comprehensive summary",
  "key_findings": [
    {"finding": "description", "confidence": "high|medium|low", "source_indices": [0, 1]}
  ],
  "conflicts": [
    {"description": "what conflicts", "sources_a": [0], "sources_b": [1], "severity": "major|minor"}
  ],
  "verification_checklist": [
    {"claim": "claim to verify", "verified": true, "source_index": 0}
  ],
  "citations": [
    {"text": "quoted text", "source_index": 0, "snippet": "context around quote", "relevance": "why relevant"}
  ],
  "topic_tags": ["tag1", "tag2"]
}

Rules:
  "topic_tags": ["tag1", "tag2"]
}

Rules:
- source_indices MUST use the "Source Index" integer provided in the context blocks (0-based)
- Include 3-8 key findings with confidence levels
- Identify any conflicts between sources
- Create 3-5 verification checklist items
- Include 3-6 citations with direct quotes
- Generate 2-5 topic tags
- Be precise and analytical`;

        if (!genAI) {
            throw new Error("GEMINI_API_KEY is not configured.");
        }

        const model = genAI.getGenerativeModel({
            model: "gemini-2.5-flash-lite",
            systemInstruction: systemPrompt,
            generationConfig: {
                responseMimeType: "application/json",
            }
        });

        const prompt = `Analyze these sources and generate a research brief:\n\n${sourceContext}`;
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const rawContent = response.text();

        let parsed;
        try {
            parsed = JSON.parse(rawContent.trim());
        } catch {
            console.error("Failed to parse AI response:", rawContent.slice(0, 500));
            throw new Error("AI returned invalid JSON");
        }

        await supabase.from("research_briefs").update({
            status: "completed",
            title: parsed.title || "Research Brief",
            summary: parsed.summary || "",
            key_findings: parsed.key_findings || [],
            conflicts: parsed.conflicts || [],
            verification_checklist: parsed.verification_checklist || [],
            citations: parsed.citations || [],
            topic_tags: parsed.topic_tags || [],
        }).eq("id", briefId);

        res.json({ success: true });
    } catch (e) {
        console.error("Pipeline error:", e);
        await supabase.from("research_briefs").update({
            status: "failed",
            error_message: e instanceof Error ? e.message : "Unknown error",
        }).eq("id", briefId).catch(() => { });

        res.status(500).json({ error: e instanceof Error ? e.message : "Unknown error" });
    }
});

export { router as researchRouter };

import { supabase } from "@/integrations/supabase/client";

export async function createBrief(urls) {
  const { data, error } = await supabase
    .from('research_briefs')
    .insert({ urls, status: 'pending' })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getBrief(id) {
  const { data, error } = await supabase
    .from('research_briefs')
    .select('*')
    .eq('id', id)
    .single();

  if (error) throw new Error(error.message);
  return data;
}

export async function getRecentBriefs(limit = 5) {
  const { data, error } = await supabase
    .from('research_briefs')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error) throw new Error(error.message);
  return data || [];
}

export async function runResearchPipeline(briefId) {
  const response = await fetch("http://localhost:3000/api/research", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ briefId }),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || "Failed to run research pipeline");
  }
}

import { createClient } from "npm:@supabase/supabase-js@2";
import { buildFeed, type Episode, type Podcast } from "./rss.ts";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!,
);

Deno.serve(async (req) => {
  const [{ data: show, error: showError }, { data: episodes, error: epError }] =
    await Promise.all([
      supabase.from("podcast").select("*").eq("id", 1).single(),
      supabase.from("episodes").select("*").order("published_at", { ascending: false }),
    ]);

  if (showError || epError || !show) {
    return new Response("Feed unavailable", { status: 500 });
  }

  const xml = buildFeed(show as Podcast, (episodes ?? []) as Episode[], req.url);
  return new Response(xml, {
    headers: {
      "content-type": "application/rss+xml; charset=utf-8",
      "cache-control": "public, max-age=300",
    },
  });
});

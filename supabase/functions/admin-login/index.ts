import { createClient } from "npm:@supabase/supabase-js@2";

const ALLOWED_ORIGINS = ["https://cyanoide.github.io", "http://localhost:8000"];

const admin = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  { auth: { persistSession: false } },
);
const anon = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_ANON_KEY")!,
  { auth: { persistSession: false } },
);

const corsFor = (req: Request) => {
  const origin = req.headers.get("origin") ?? "";
  return {
    "access-control-allow-origin": ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0],
    "access-control-allow-headers": "content-type",
    "access-control-allow-methods": "POST, OPTIONS",
    "vary": "origin",
  };
};

// Même réponse pour pseudo inconnu, mauvais mot de passe ou compte non admin : pas d'énumération.
async function refuse(cors: Record<string, string>) {
  await new Promise((r) => setTimeout(r, 600));
  return new Response(JSON.stringify({ error: "Identifiants invalides" }), {
    status: 401,
    headers: { ...cors, "content-type": "application/json" },
  });
}

Deno.serve(async (req) => {
  const cors = corsFor(req);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers: cors });
  if (req.method !== "POST") return new Response("Method not allowed", { status: 405, headers: cors });

  let body: { pseudo?: unknown; password?: unknown };
  try { body = await req.json(); } catch { return refuse(cors); }
  const pseudo = typeof body.pseudo === "string" ? body.pseudo.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";
  if (!/^[a-z0-9._-]{3,24}$/.test(pseudo) || !password) return refuse(cors);

  const { data: profile } = await admin
    .from("profiles").select("id, role").eq("pseudo", pseudo).maybeSingle();
  if (!profile || profile.role !== "admin") return refuse(cors);

  const { data: user } = await admin.auth.admin.getUserById(profile.id);
  const email = user?.user?.email;
  if (!email) return refuse(cors);

  const { data, error } = await anon.auth.signInWithPassword({ email, password });
  if (error || !data.session) return refuse(cors);

  return new Response(
    JSON.stringify({
      access_token: data.session.access_token,
      refresh_token: data.session.refresh_token,
    }),
    { headers: { ...cors, "content-type": "application/json" } },
  );
});

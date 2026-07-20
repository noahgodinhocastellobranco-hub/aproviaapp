import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3.23.8";

const OWNER_EMAIL = "noahgodinhocastellobranco@gmail.com";
const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const BodySchema = z.object({ userId: z.string().uuid(), email: z.string().email().optional().nullable() });
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) return json({ error: "Configuração incompleta" }, 500);
    const admin = createClient(supabaseUrl, serviceKey);
    const authHeader = req.headers.get("Authorization") || "";
    const { data: requesterData, error: requesterError } = await admin.auth.getUser(authHeader.replace("Bearer ", ""));
    if (requesterError || !requesterData.user) return json({ error: "Não autenticado" }, 401);
    const { data: isAdmin } = await admin.rpc("has_role", { _user_id: requesterData.user.id, _role: "admin" });
    if (!isAdmin) return json({ error: "Acesso negado" }, 403);
    const { data: profile } = await admin.from("profiles").select("email").eq("id", parsed.data.userId).maybeSingle();
    const targetEmail = (profile?.email || parsed.data.email || "").toLowerCase();
    if (targetEmail === OWNER_EMAIL) return json({ error: "Conta protegida" }, 403);
    await admin.from("profiles").delete().eq("id", parsed.data.userId);
    await admin.auth.admin.deleteUser(parsed.data.userId, true);
    return json({ ok: true });
  } catch (error) { return json({ error: error instanceof Error ? error.message : "Erro inesperado" }, 500); }
});
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

export const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

export interface AuthResult {
  ok: boolean;
  userId?: string;
  response?: Response;
}

/**
 * Validates the Supabase JWT from the Authorization header and confirms the
 * caller has `profiles.is_premium = true` (or the admin role). Returns a
 * ready-to-send Response on failure.
 */
export async function requirePremiumUser(req: Request): Promise<AuthResult> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return {
      ok: false,
      response: new Response(
        JSON.stringify({ error: "Autenticação obrigatória." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      ),
    };
  }

  const token = authHeader.replace("Bearer ", "");
  const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
  const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
  const admin = createClient(SUPABASE_URL, SERVICE_ROLE);

  const { data: userData, error: userErr } = await admin.auth.getUser(token);
  if (userErr || !userData?.user) {
    return {
      ok: false,
      response: new Response(
        JSON.stringify({ error: "Sessão inválida." }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      ),
    };
  }

  const userId = userData.user.id;

  // Admin bypass
  const { data: roleRow } = await admin
    .from("user_roles")
    .select("role")
    .eq("user_id", userId)
    .eq("role", "admin")
    .maybeSingle();

  if (roleRow) return { ok: true, userId };

  const { data: profile } = await admin
    .from("profiles")
    .select("is_premium")
    .eq("id", userId)
    .maybeSingle();

  if (!profile?.is_premium) {
    return {
      ok: false,
      response: new Response(
        JSON.stringify({ error: "Recurso disponível apenas para usuários Premium." }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      ),
    };
  }

  return { ok: true, userId };
}

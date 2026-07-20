import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3.23.8";

const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const BodySchema = z.object({ action: z.enum(["send", "verify"]).optional().default("send"), email: z.string().email(), code: z.string().regex(/^\d{4}$/).optional(), newPassword: z.string().min(6).max(72).optional() });
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
const code4 = () => String(Math.floor(1000 + Math.random() * 9000));

const html = (code: string) => `<!doctype html><html><body style="margin:0;background:#ffffff;font-family:Arial,sans-serif;color:#172033"><div style="max-width:560px;margin:0 auto;padding:32px 18px"><div style="background:#0B61FF;border-radius:20px 20px 0 0;padding:28px;text-align:center;color:#fff"><div style="font-size:34px;font-weight:900">🧠 AprovI.A</div><p style="margin:8px 0 0;opacity:.9">Redefinição segura de senha</p></div><div style="border:1px solid #e5e7eb;border-top:0;border-radius:0 0 20px 20px;padding:30px"><h1 style="margin:0 0 12px;font-size:26px;color:#0B61FF">Troque sua senha no site</h1><p style="font-size:16px;line-height:1.6;color:#475569">Digite este código na página de login e escolha sua nova senha. O código expira em 10 minutos.</p><div style="letter-spacing:12px;text-align:center;font-size:42px;font-weight:900;color:#0B61FF;background:#EFF6FF;border:1px solid #BFDBFE;border-radius:16px;padding:22px;margin:28px 0">${code}</div><p style="font-size:14px;color:#64748b">Se não foi você, ignore este email.</p></div></div></body></html>`;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!supabaseUrl || !serviceKey) return json({ error: "Configuração incompleta" }, 500);
    const admin = createClient(supabaseUrl, serviceKey);
    const email = parsed.data.email.trim().toLowerCase();
    const { data: profile } = await admin.from("profiles").select("id,email").eq("email", email).maybeSingle();
    if (!profile) return json({ ok: true });
    if (parsed.data.action === "verify") {
      if (!parsed.data.newPassword) return json({ error: "Nova senha obrigatória" }, 400);
      const { data: saved } = await admin.from("verification_codes").select("*").eq("user_id", profile.id).eq("type", "password_reset").eq("code", parsed.data.code).is("used_at", null).gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (!saved) return json({ error: "Código inválido" }, 400);
      await admin.auth.admin.updateUserById(profile.id, { password: parsed.data.newPassword });
      await admin.from("verification_codes").update({ used_at: new Date().toISOString() }).eq("id", saved.id);
      return json({ ok: true });
    }
    const generated = code4();
    await admin.from("verification_codes").insert({ user_id: profile.id, code: generated, type: "password_reset", expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() });
    let fallbackCode: string | undefined;
    if (resendKey) {
      const response = await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: "AprovI.A <noreply@aprovia.online>", to: [email], subject: `Código para trocar sua senha: ${generated}`, html: html(generated) }) });
      if (!response.ok) fallbackCode = generated;
    } else fallbackCode = generated;
    return json({ ok: true, fallbackCode });
  } catch (error) { return json({ error: error instanceof Error ? error.message : "Erro inesperado" }, 500); }
});
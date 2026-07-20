import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { z } from "npm:zod@3.23.8";

const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const BodySchema = z.object({ email: z.string().email(), nome: z.string().max(120).optional().nullable() });
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const parsed = BodySchema.safeParse(await req.json());
    if (!parsed.success) return json({ error: parsed.error.flatten().fieldErrors }, 400);
    const resendKey = Deno.env.get("RESEND_API_KEY");
    if (!resendKey) return json({ ok: true });
    const name = parsed.data.nome?.split(" ")[0] || "estudante";
    const html = `<!doctype html><html><body style="margin:0;background:#ffffff;font-family:Arial,sans-serif;color:#172033"><div style="max-width:600px;margin:0 auto;padding:32px 18px"><div style="background:#0B61FF;border-radius:22px;padding:32px;text-align:center;color:#fff"><div style="font-size:36px;font-weight:900">🧠 AprovI.A</div><h1 style="margin:20px 0 8px;font-size:30px">Bem-vindo, ${name}!</h1><p style="font-size:16px;line-height:1.6;opacity:.92">Sua conta foi verificada. Agora você pode continuar para o checkout e liberar seu painel PRO do ENEM.</p><a href="https://aprovia.online/precos?checkout=1" style="display:inline-block;margin-top:18px;background:#fff;color:#0B61FF;text-decoration:none;font-weight:800;border-radius:12px;padding:14px 22px">Começar meus estudos</a></div></div></body></html>`;
    await fetch("https://api.resend.com/emails", { method: "POST", headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" }, body: JSON.stringify({ from: "AprovI.A <noreply@aprovia.online>", to: [parsed.data.email], subject: "Bem-vindo ao AprovI.A", html }) });
    return json({ ok: true });
  } catch (error) { return json({ error: error instanceof Error ? error.message : "Erro inesperado" }, 500); }
});
import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";
import { z } from "npm:zod@3.23.8";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BodySchema = z.object({
  action: z.enum(["send", "verify"]).optional().default("send"),
  type: z.enum(["signup_verify", "password", "email"]),
  email: z.string().email().optional(),
  code: z.string().regex(/^\d{4}$/).optional(),
  newValue: z.string().min(1).max(255).optional(),
});

const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
const code4 = () => String(Math.floor(1000 + Math.random() * 9000));
const normalize = (email?: string | null) => email?.trim().toLowerCase() || null;

function emailHtml(code: string, type: string) {
  const title = type === "signup_verify" ? "Confirme sua conta" : type === "email" ? "Alteração de email" : "Alteração de senha";
  return `<!doctype html><html><body style="margin:0;background:#ffffff;font-family:Arial,sans-serif;color:#172033"><div style="max-width:560px;margin:0 auto;padding:32px 18px"><div style="background:#0B61FF;border-radius:20px 20px 0 0;padding:28px;text-align:center;color:#fff"><div style="font-size:34px;font-weight:900">AprovI.A</div><p style="margin:8px 0 0;opacity:.9">Sua IA para passar no ENEM</p></div><div style="border:1px solid #e5e7eb;border-top:0;border-radius:0 0 20px 20px;padding:30px"><h1 style="margin:0 0 12px;font-size:26px;color:#0B61FF">${title}</h1><p style="font-size:16px;line-height:1.6;color:#475569">Use o código abaixo no site para continuar com segurança. Ele expira em 10 minutos.</p><div style="letter-spacing:12px;text-align:center;font-size:42px;font-weight:900;color:#0B61FF;background:#EFF6FF;border:1px solid #BFDBFE;border-radius:16px;padding:22px;margin:28px 0">${code}</div><p style="font-size:14px;line-height:1.6;color:#64748b">Se você não pediu este código, pode ignorar este email.</p><p style="font-size:12px;color:#94a3b8;margin-top:20px">AprovI.A • suporteaprovia@gmail.com</p></div></div></body></html>`;
}

function emailText(code: string, type: string) {
  const title = type === "signup_verify" ? "Confirme sua conta" : type === "email" ? "Alteração de email" : "Alteração de senha";
  return `AprovI.A - ${title}\n\nSeu código de verificação: ${code}\n\nEle expira em 10 minutos.\n\nSe você não pediu este código, pode ignorar este email.\n\nSuporte: suporteaprovia@gmail.com`;
}

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
    const authHeader = req.headers.get("Authorization") || "";
    const token = authHeader.replace("Bearer ", "");
    const { data: authData } = token ? await admin.auth.getUser(token) : { data: { user: null } } as any;
    const currentUser = authData.user;
    const { action, type, code, newValue } = parsed.data;
    const requestEmail = normalize(parsed.data.email);

    let userId = currentUser?.id as string | undefined;
    let recipient = normalize(currentUser?.email) || requestEmail;

    if (type === "signup_verify" && requestEmail) {
      const { data: profile } = await admin.from("profiles").select("id,email").eq("email", requestEmail).maybeSingle();
      userId = profile?.id || userId;
      recipient = requestEmail;
    }
    if (!userId || !recipient) return json({ error: "Usuário não encontrado" }, 404);

    if (action === "verify") {
      const { data: saved } = await admin.from("verification_codes").select("*").eq("user_id", userId).eq("type", type).eq("code", code).is("used_at", null).gt("expires_at", new Date().toISOString()).order("created_at", { ascending: false }).limit(1).maybeSingle();
      if (!saved) return json({ error: "Código inválido" }, 400);
      await admin.from("verification_codes").update({ used_at: new Date().toISOString() }).eq("id", saved.id);
      if (type === "signup_verify") await admin.from("profiles").upsert({ id: userId, email: recipient, email_verified: true }, { onConflict: "id" });
      if (type === "password") await admin.auth.admin.updateUserById(userId, { password: newValue });
      if (type === "email") {
        const newEmail = normalize(newValue);
        if (!newEmail) return json({ error: "Email inválido" }, 400);
        await admin.auth.admin.updateUserById(userId, { email: newEmail, email_confirm: true });
        await admin.from("profiles").update({ email: newEmail, email_verified: true }).eq("id", userId);
      }
      return json({ ok: true });
    }

    const generated = code4();
    await admin.from("verification_codes").insert({ user_id: userId, code: generated, type, new_value: newValue || null, expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString() });

    let sent = false;
    let sendError: string | undefined;
    let messageId: string | undefined;

    if (resendKey) {
      try {
        const response = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
          body: JSON.stringify({
            from: "AprovI.A <noreply@aprovia.online>",
            to: [recipient],
            reply_to: "suporteaprovia@gmail.com",
            subject: "Confirmação de acesso - AprovI.A",
            html: emailHtml(generated, type),
            text: emailText(generated, type),
            headers: { "X-Entity-Ref-ID": `otp-${userId}-${Date.now()}` },
          }),
        });
        const respText = await response.text();
        if (response.ok) {
          sent = true;
          try { messageId = JSON.parse(respText)?.id; } catch { /* ignore */ }
          console.log("OTP email sent", { userId, type, to: recipient, messageId });
        } else {
          sendError = `Resend ${response.status}: ${respText}`;
          console.error("OTP email failed", sendError);
        }
      } catch (e) {
        sendError = e instanceof Error ? e.message : String(e);
        console.error("OTP email exception", sendError);
      }
    } else {
      sendError = "RESEND_API_KEY não configurada";
      console.error(sendError);
    }

    // Se falhou o envio, expor o código no retorno como fallback para o usuário não travar.
    return json({ ok: true, sent, messageId, fallbackCode: sent ? undefined : generated, sendError });
  } catch (error) {
    console.error("OTP handler crash", error);
    return json({ error: error instanceof Error ? error.message : "Erro inesperado" }, 500);
  }
});

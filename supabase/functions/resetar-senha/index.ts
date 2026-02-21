import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function buildResetEmailHtml(code: string, nomeUsuario: string): { subject: string; html: string } {
  const primeiroNome = nomeUsuario?.split(" ")[0] ?? "Estudante";
  const ano = new Date().getFullYear();
  const digits = code.split("");

  const digitBoxes = digits
    .map(
      (d) =>
        `<td style="padding:0 6px;">
          <div style="width:56px;height:64px;background:#EEF4FF;border:2px solid #0B61FF;border-radius:12px;
                      text-align:center;line-height:64px;font-size:32px;font-weight:900;
                      color:#0B61FF;letter-spacing:0;display:inline-block;">
            ${d}
          </div>
        </td>`
    )
    .join("");

  const html = `
<!DOCTYPE html>
<html lang="pt-BR">
<head><meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1.0"/><title>AprovI.A</title></head>
<body style="margin:0;padding:0;background-color:#F1F5F9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;box-shadow:0 4px 24px rgba(11,97,255,0.08);">
          <tr>
            <td style="background:linear-gradient(135deg,#0B61FF 0%,#0048cc 100%);padding:36px 40px;border-radius:16px 16px 0 0;text-align:center;">
              <table width="100%" cellpadding="0" cellspacing="0"><tr><td style="text-align:center;">
                <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:50%;padding:12px;margin-bottom:12px;">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9.5 2C8.12 2 7 3.12 7 4.5c0 .17.02.34.05.5H7C5.34 5 4 6.34 4 8c0 1.1.56 2.08 1.41 2.66C5.16 11.07 5 11.52 5 12c0 1.1.56 2.08 1.41 2.66C6.16 15.07 6 15.52 6 16c0 1.66 1.34 3 3 3 .34 0 .67-.07.97-.18C10.3 19.74 11.13 20 12 20s1.7-.26 2.03-.18c.3.11.63.18.97.18 1.66 0 3-1.34 3-3 0-.48-.16-.93-.41-1.34C18.44 14.08 19 13.1 19 12c0-.48-.16-.93-.41-1.34C19.44 10.08 20 9.1 20 8c0-1.66-1.34-3-3-3h-.05c.03-.16.05-.33.05-.5C17 3.12 15.88 2 14.5 2c-.87 0-1.63.44-2.09 1.1C11.96 2.67 11.5 2.34 11 2.18" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </div><br/>
                <span style="font-family:'Segoe UI',Arial,sans-serif;font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">AprovI.A</span><br/>
                <span style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.75);letter-spacing:2px;text-transform:uppercase;">Sua IA para o ENEM</span>
              </td></tr></table>
            </td>
          </tr>
          <tr>
            <td style="background:#ffffff;padding:40px;border-radius:0 0 16px 16px;">
              <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:22px;font-weight:700;color:#0f172a;margin:0 0 8px 0;">
                Olá, ${primeiroNome}! 🔐
              </p>
              <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:15px;color:#475569;margin:0 0 28px 0;line-height:1.6;">
                Recebemos uma solicitação para <strong>recuperar a senha</strong> da sua conta no AprovI.A.
                Use o código abaixo para redefinir sua senha:
              </p>
              <div style="background:#F0F6FF;border:1px solid #BFDBFE;border-radius:16px;padding:28px;text-align:center;margin-bottom:28px;">
                <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:12px;font-weight:700;color:#0B61FF;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px 0;">Código de recuperação</p>
                <table cellpadding="0" cellspacing="0" style="margin:0 auto 16px auto;"><tr>${digitBoxes}</tr></table>
                <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#64748b;margin:0;">⏱️ Expira em <strong>10 minutos</strong></p>
              </div>
              <div style="background:#FFF8F0;border-left:4px solid #F59E0B;border-radius:8px;padding:16px;margin-bottom:28px;">
                <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;font-weight:700;color:#92400E;margin:0 0 6px 0;">⚠️ Aviso de segurança</p>
                <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#78350F;margin:0;line-height:1.5;">
                  Nunca compartilhe este código com ninguém. O AprovI.A <strong>jamais</strong> pedirá seu código por telefone, WhatsApp ou outro canal.
                </p>
              </div>
              <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#94a3b8;text-align:center;margin:0;">
                Não solicitou esta recuperação? <strong>Ignore este email</strong> — sua senha permanecerá a mesma.
              </p>
            </td>
          </tr>
        </table>
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;margin-top:24px;">
          <tr><td style="text-align:center;padding:0 16px;">
            <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#94a3b8;margin:0 0 6px 0;">
              <strong style="color:#0B61FF;">AprovI.A</strong> · Sua IA para o ENEM
            </p>
            <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:11px;color:#cbd5e1;margin:0;">
              © ${ano} AprovI.A · Este é um email automático, não responda.
            </p>
            <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:11px;margin:8px 0 0 0;">
              <a href="https://aprovia.online" style="color:#0B61FF;text-decoration:none;">aprovia.online</a>
            </p>
          </td></tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject: "🔑 Código para recuperar sua senha — AprovI.A", html };
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY não configurado");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    const body = await req.json();
    const { action, email } = body;

    if (!email || typeof email !== "string") {
      return new Response(JSON.stringify({ error: "Email é obrigatório" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const emailLower = email.trim().toLowerCase();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(emailLower)) {
      return new Response(JSON.stringify({ error: "Formato de email inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Look up user by email in profiles
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("id, nome, email")
      .eq("email", emailLower)
      .single();

    if (!profile) {
      // Don't reveal if email exists or not — pretend success
      return new Response(JSON.stringify({ success: true, emailEnviado: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (action === "send_code") {
      const code = String(Math.floor(1000 + Math.random() * 9000));

      // Invalidate previous codes
      await supabaseAdmin
        .from("verification_codes")
        .update({ used_at: new Date().toISOString() })
        .eq("user_id", profile.id)
        .eq("type", "password_reset")
        .is("used_at", null);

      // Insert new code
      const { error: insertError } = await supabaseAdmin
        .from("verification_codes")
        .insert({
          user_id: profile.id,
          code,
          type: "password_reset",
          expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        });

      if (insertError) throw new Error("Erro ao salvar código: " + insertError.message);

      const nomeUsuario = profile.nome ?? "Estudante";
      const { subject, html } = buildResetEmailHtml(code, nomeUsuario);

      let emailEnviado = false;
      try {
        const emailRes = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${RESEND_API_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from: "AprovI.A <noreply@aprovia.online>",
            to: [emailLower],
            subject,
            html,
          }),
        });
        if (emailRes.ok) emailEnviado = true;
        else console.error("Resend error:", await emailRes.text());
      } catch (e) {
        console.error("Email send error:", e);
      }

      return new Response(JSON.stringify({
        success: true,
        emailEnviado,
        codigoFallback: emailEnviado ? null : code,
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else if (action === "verify_and_reset") {
      const { code, new_password } = body;

      if (!code || typeof code !== "string" || code.length !== 4) {
        return new Response(JSON.stringify({ error: "Código inválido" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (!new_password || typeof new_password !== "string" || new_password.length < 6) {
        return new Response(JSON.stringify({ error: "Senha deve ter pelo menos 6 caracteres" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Verify the code
      const { data: codeRecord, error: codeError } = await supabaseAdmin
        .from("verification_codes")
        .select("*")
        .eq("user_id", profile.id)
        .eq("type", "password_reset")
        .eq("code", code)
        .is("used_at", null)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (codeError || !codeRecord) {
        return new Response(JSON.stringify({ error: "Código inválido ou expirado" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Mark code as used
      await supabaseAdmin
        .from("verification_codes")
        .update({ used_at: new Date().toISOString() })
        .eq("id", codeRecord.id);

      // Update password via admin API
      const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
        profile.id,
        { password: new_password }
      );

      if (updateError) {
        console.error("Password update error:", updateError);
        return new Response(JSON.stringify({ error: "Erro ao atualizar senha" }), {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });

    } else {
      return new Response(JSON.stringify({ error: "Ação inválida. Use 'send_code' ou 'verify_and_reset'" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("resetar-senha error:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

// ─── Templates de email ───────────────────────────────────────────────────────

function buildEmailHtml(opts: {
  type: "signup_verify" | "password" | "email";
  code: string;
  nomeUsuario: string;
  destinatarioEmail: string;
  novoEmail?: string;
}): { subject: string; html: string } {
  const { type, code, nomeUsuario, destinatarioEmail, novoEmail } = opts;
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

  const header = `
    <!-- HEADER -->
    <tr>
      <td style="background:linear-gradient(135deg,#0B61FF 0%,#0048cc 100%);padding:36px 40px;border-radius:16px 16px 0 0;text-align:center;">
        <table width="100%" cellpadding="0" cellspacing="0">
          <tr>
            <td style="text-align:center;">
              <!-- Brain SVG inline -->
              <div style="display:inline-block;background:rgba(255,255,255,0.15);border-radius:50%;padding:12px;margin-bottom:12px;">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.5 2C8.12 2 7 3.12 7 4.5c0 .17.02.34.05.5H7C5.34 5 4 6.34 4 8c0 1.1.56 2.08 1.41 2.66C5.16 11.07 5 11.52 5 12c0 1.1.56 2.08 1.41 2.66C6.16 15.07 6 15.52 6 16c0 1.66 1.34 3 3 3 .34 0 .67-.07.97-.18C10.3 19.74 11.13 20 12 20s1.7-.26 2.03-.18c.3.11.63.18.97.18 1.66 0 3-1.34 3-3 0-.48-.16-.93-.41-1.34C18.44 14.08 19 13.1 19 12c0-.48-.16-.93-.41-1.34C19.44 10.08 20 9.1 20 8c0-1.66-1.34-3-3-3h-.05c.03-.16.05-.33.05-.5C17 3.12 15.88 2 14.5 2c-.87 0-1.63.44-2.09 1.1C11.96 2.67 11.5 2.34 11 2.18" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <br/>
              <span style="font-family:'Segoe UI',Arial,sans-serif;font-size:28px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">AprovI.A</span>
              <br/>
              <span style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.75);letter-spacing:2px;text-transform:uppercase;">Sua IA para o ENEM</span>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  `;

  if (type === "signup_verify") {
    return {
      subject: "🔐 Seu código de verificação — AprovI.A",
      html: buildWrapper(`
        ${header}
        <!-- BODY -->
        <tr>
          <td style="background:#ffffff;padding:40px;border-radius:0 0 16px 16px;">

            <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:22px;font-weight:700;color:#0f172a;margin:0 0 8px 0;">
              Olá, ${primeiroNome}! 👋
            </p>
            <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:15px;color:#475569;margin:0 0 28px 0;line-height:1.6;">
              Que bom ter você aqui! Estamos quase prontos — só precisamos confirmar que este é o seu email.
              Use o código abaixo para ativar sua conta:
            </p>

            <!-- Código OTP -->
            <div style="background:#F0F6FF;border:1px solid #BFDBFE;border-radius:16px;padding:28px;text-align:center;margin-bottom:28px;">
              <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:12px;font-weight:700;color:#0B61FF;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px 0;">Código de verificação</p>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 16px auto;">
                <tr>${digitBoxes}</tr>
              </table>
              <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#64748b;margin:0;">
                ⏱️ Expira em <strong>10 minutos</strong>
              </p>
            </div>

            <!-- Como usar -->
            <table width="100%" cellpadding="0" cellspacing="0" style="background:#F8FAFC;border-radius:12px;padding:20px;margin-bottom:28px;">
              <tr><td style="padding:12px 16px;">
                <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;font-weight:700;color:#0f172a;margin:0 0 12px 0;letter-spacing:0.5px;">📋 COMO USAR SEU CÓDIGO</p>
                <table cellpadding="0" cellspacing="0" width="100%">
                  <tr>
                    <td style="width:28px;vertical-align:top;padding-bottom:10px;">
                      <div style="width:22px;height:22px;background:#0B61FF;border-radius:50%;text-align:center;line-height:22px;font-size:11px;font-weight:700;color:white;">1</div>
                    </td>
                    <td style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#475569;padding-bottom:10px;padding-left:8px;">
                      Volte para a página do <strong style="color:#0B61FF;">AprovI.A</strong> no seu navegador
                    </td>
                  </tr>
                  <tr>
                    <td style="width:28px;vertical-align:top;padding-bottom:10px;">
                      <div style="width:22px;height:22px;background:#0B61FF;border-radius:50%;text-align:center;line-height:22px;font-size:11px;font-weight:700;color:white;">2</div>
                    </td>
                    <td style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#475569;padding-bottom:10px;padding-left:8px;">
                      Digite o código de <strong>4 dígitos</strong> nos campos indicados
                    </td>
                  </tr>
                  <tr>
                    <td style="width:28px;vertical-align:top;">
                      <div style="width:22px;height:22px;background:#0B61FF;border-radius:50%;text-align:center;line-height:22px;font-size:11px;font-weight:700;color:white;">3</div>
                    </td>
                    <td style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#475569;padding-left:8px;">
                      Pronto! Sua conta será ativada e você começará a estudar 🚀
                    </td>
                  </tr>
                </table>
              </td></tr>
            </table>

            <!-- O que você vai ganhar -->
            <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:28px;">
              <tr><td>
                <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;font-weight:700;color:#0f172a;margin:0 0 12px 0;letter-spacing:0.5px;">✨ O QUE TE ESPERA NO APROVI.A</p>
              </td></tr>
              <tr>
                <td width="50%" style="padding:0 6px 10px 0;vertical-align:top;">
                  <div style="background:#F0F9FF;border-radius:10px;padding:14px;">
                    <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:20px;margin:0 0 4px 0;">🤖</p>
                    <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:12px;font-weight:700;color:#0f172a;margin:0 0 2px 0;">Professora Virtual IA</p>
                    <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:11px;color:#64748b;margin:0;">Tire dúvidas 24h com IA humanizada</p>
                  </div>
                </td>
                <td width="50%" style="padding:0 0 10px 6px;vertical-align:top;">
                  <div style="background:#F0FDF4;border-radius:10px;padding:14px;">
                    <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:20px;margin:0 0 4px 0;">📝</p>
                    <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:12px;font-weight:700;color:#0f172a;margin:0 0 2px 0;">Simulados ENEM</p>
                    <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:11px;color:#64748b;margin:0;">Questões oficiais com gabarito IA</p>
                  </div>
                </td>
              </tr>
              <tr>
                <td width="50%" style="padding:0 6px 0 0;vertical-align:top;">
                  <div style="background:#FFF7ED;border-radius:10px;padding:14px;">
                    <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:20px;margin:0 0 4px 0;">✍️</p>
                    <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:12px;font-weight:700;color:#0f172a;margin:0 0 2px 0;">Correção de Redação</p>
                    <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:11px;color:#64748b;margin:0;">Nota detalhada em segundos</p>
                  </div>
                </td>
                <td width="50%" style="padding:0 0 0 6px;vertical-align:top;">
                  <div style="background:#FDF4FF;border-radius:10px;padding:14px;">
                    <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:20px;margin:0 0 4px 0;">📅</p>
                    <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:12px;font-weight:700;color:#0f172a;margin:0 0 2px 0;">Rotina de Estudos</p>
                    <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:11px;color:#64748b;margin:0;">Plano personalizado para você</p>
                  </div>
                </td>
              </tr>
            </table>

            <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#94a3b8;text-align:center;margin:0;">
              Se você não criou uma conta no AprovI.A, pode ignorar este email com segurança.
            </p>
          </td>
        </tr>
      `, ano),
    };
  }

  if (type === "password") {
    return {
      subject: "🔑 Código para alterar sua senha — AprovI.A",
      html: buildWrapper(`
        ${header}
        <tr>
          <td style="background:#ffffff;padding:40px;border-radius:0 0 16px 16px;">
            <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:22px;font-weight:700;color:#0f172a;margin:0 0 8px 0;">
              Olá, ${primeiroNome}! 🔐
            </p>
            <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:15px;color:#475569;margin:0 0 28px 0;line-height:1.6;">
              Recebemos uma solicitação para <strong>alterar a senha</strong> da sua conta no AprovI.A.
              Use o código abaixo para confirmar a operação:
            </p>

            <!-- Código OTP -->
            <div style="background:#F0F6FF;border:1px solid #BFDBFE;border-radius:16px;padding:28px;text-align:center;margin-bottom:28px;">
              <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:12px;font-weight:700;color:#0B61FF;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px 0;">Código de confirmação</p>
              <table cellpadding="0" cellspacing="0" style="margin:0 auto 16px auto;">
                <tr>${digitBoxes}</tr>
              </table>
              <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#64748b;margin:0;">
                ⏱️ Expira em <strong>10 minutos</strong>
              </p>
            </div>

            <!-- Alerta de segurança -->
            <div style="background:#FFF8F0;border-left:4px solid #F59E0B;border-radius:8px;padding:16px;margin-bottom:28px;">
              <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;font-weight:700;color:#92400E;margin:0 0 6px 0;">⚠️ Aviso de segurança</p>
              <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#78350F;margin:0;line-height:1.5;">
                Nunca compartilhe este código com ninguém. O AprovI.A <strong>jamais</strong> pedirá seu código por telefone, WhatsApp ou outro canal.
              </p>
            </div>

            <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#94a3b8;text-align:center;margin:0;">
              Não solicitou esta alteração? <strong>Ignore este email</strong> — sua senha permanecerá a mesma.
            </p>
          </td>
        </tr>
      `, ano),
    };
  }

  // type === "email"
  return {
    subject: "📧 Código para alterar seu email — AprovI.A",
    html: buildWrapper(`
      ${header}
      <tr>
        <td style="background:#ffffff;padding:40px;border-radius:0 0 16px 16px;">
          <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:22px;font-weight:700;color:#0f172a;margin:0 0 8px 0;">
            Olá, ${primeiroNome}! ✉️
          </p>
          <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:15px;color:#475569;margin:0 0 8px 0;line-height:1.6;">
            Recebemos uma solicitação para alterar o email da sua conta.
          </p>
          <div style="background:#EFF6FF;border-radius:10px;padding:12px 16px;margin-bottom:24px;">
            <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#1e40af;margin:0;">
              📨 Novo email: <strong>${novoEmail ?? destinatarioEmail}</strong>
            </p>
          </div>

          <!-- Código OTP -->
          <div style="background:#F0F6FF;border:1px solid #BFDBFE;border-radius:16px;padding:28px;text-align:center;margin-bottom:28px;">
            <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:12px;font-weight:700;color:#0B61FF;letter-spacing:3px;text-transform:uppercase;margin:0 0 16px 0;">Código de confirmação</p>
            <table cellpadding="0" cellspacing="0" style="margin:0 auto 16px auto;">
              <tr>${digitBoxes}</tr>
            </table>
            <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#64748b;margin:0;">
              ⏱️ Expira em <strong>10 minutos</strong>
            </p>
          </div>

          <!-- Alerta de segurança -->
          <div style="background:#FFF8F0;border-left:4px solid #F59E0B;border-radius:8px;padding:16px;margin-bottom:28px;">
            <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;font-weight:700;color:#92400E;margin:0 0 6px 0;">⚠️ Aviso de segurança</p>
            <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#78350F;margin:0;line-height:1.5;">
              Nunca compartilhe este código. Após a confirmação, seu login passará a usar o novo email.
            </p>
          </div>

          <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#94a3b8;text-align:center;margin:0;">
            Não solicitou esta alteração? Ignore este email — seu email atual permanecerá ativo.
          </p>
        </td>
      </tr>
    `, ano),
  };
}

function buildWrapper(content: string, ano: number): string {
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>AprovI.A</title>
</head>
<body style="margin:0;padding:0;background-color:#F1F5F9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;box-shadow:0 4px 24px rgba(11,97,255,0.08);">
          ${content}
        </table>

        <!-- Footer -->
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;margin-top:24px;">
          <tr>
            <td style="text-align:center;padding:0 16px;">
              <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#94a3b8;margin:0 0 6px 0;">
                <strong style="color:#0B61FF;">AprovI.A</strong> · Sua IA para o ENEM
              </p>
              <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:11px;color:#cbd5e1;margin:0;">
                © ${ano} AprovI.A · Este é um email automático, não responda.
              </p>
              <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:11px;margin:8px 0 0 0;">
                <a href="https://aprovia.online" style="color:#0B61FF;text-decoration:none;">aprovia.online</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// ─── Handler principal ────────────────────────────────────────────────────────

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY não configurado");

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);
    const supabaseUser = createClient(SUPABASE_URL, Deno.env.get("SUPABASE_ANON_KEY")!, {
      global: { headers: { Authorization: authHeader } },
    });

    const { data: { user }, error: authError } = await supabaseUser.auth.getUser();
    if (authError || !user) {
      return new Response(JSON.stringify({ error: "Sessão inválida" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json();
    const { type, new_email } = body;

    if (!type || !["password", "email", "signup_verify"].includes(type)) {
      return new Response(JSON.stringify({ error: "Tipo inválido" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "email" && !new_email) {
      return new Response(JSON.stringify({ error: "Novo email é obrigatório" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (type === "email") {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(new_email)) {
        return new Response(JSON.stringify({ error: "Formato de email inválido" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
    }

    // Gerar código de 4 dígitos
    const code = String(Math.floor(1000 + Math.random() * 9000));

    // Buscar nome do usuário no perfil
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("nome")
      .eq("id", user.id)
      .single();

    const nomeUsuario = profile?.nome ?? user.email ?? "Estudante";

    // Invalidar códigos anteriores
    await supabaseAdmin
      .from("verification_codes")
      .update({ used_at: new Date().toISOString() })
      .eq("user_id", user.id)
      .eq("type", type)
      .is("used_at", null);

    // Inserir novo código
    const { error: insertError } = await supabaseAdmin
      .from("verification_codes")
      .insert({
        user_id: user.id,
        code,
        type,
        new_value: type === "email" ? new_email : null,
        expires_at: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      });

    if (insertError) throw new Error("Erro ao salvar código: " + insertError.message);

    const destinatario = type === "email" ? new_email : user.email!;

    // Gerar email profissional
    const { subject, html } = buildEmailHtml({
      type: type as "signup_verify" | "password" | "email",
      code,
      nomeUsuario,
      destinatarioEmail: destinatario,
      novoEmail: new_email,
    });

    // Enviar via Resend
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
          to: [destinatario],
          subject,
          html,
        }),
      });

      if (emailRes.ok) {
        emailEnviado = true;
      } else {
        const errBody = await emailRes.text();
        console.error("Resend error (non-fatal):", errBody);
      }
    } catch (emailErr) {
      console.error("Falha ao enviar email (non-fatal):", emailErr);
    }

    return new Response(JSON.stringify({
      success: true,
      emailEnviado,
      codigoFallback: emailEnviado ? null : code,
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

function buildBoasVindasEmail(nomeUsuario: string, email: string): string {
  const primeiroNome = nomeUsuario?.split(" ")[0] ?? "Estudante";
  const ano = new Date().getFullYear();

  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <title>Bem-vindo ao AprovI.A!</title>
</head>
<body style="margin:0;padding:0;background-color:#F1F5F9;font-family:'Segoe UI',Arial,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#F1F5F9;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(11,97,255,0.10);">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#0B61FF 0%,#0048cc 100%);padding:44px 40px 36px;text-align:center;">
              <div style="display:inline-block;background:rgba(255,255,255,0.18);border-radius:50%;padding:14px;margin-bottom:14px;">
                <svg width="44" height="44" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9.5 2C8.12 2 7 3.12 7 4.5c0 .17.02.34.05.5H7C5.34 5 4 6.34 4 8c0 1.1.56 2.08 1.41 2.66C5.16 11.07 5 11.52 5 12c0 1.1.56 2.08 1.41 2.66C6.16 15.07 6 15.52 6 16c0 1.66 1.34 3 3 3 .34 0 .67-.07.97-.18C10.3 19.74 11.13 20 12 20s1.7-.26 2.03-.18c.3.11.63.18.97.18 1.66 0 3-1.34 3-3 0-.48-.16-.93-.41-1.34C18.44 14.08 19 13.1 19 12c0-.48-.16-.93-.41-1.34C19.44 10.08 20 9.1 20 8c0-1.66-1.34-3-3-3h-.05c.03-.16.05-.33.05-.5C17 3.12 15.88 2 14.5 2c-.87 0-1.63.44-2.09 1.1C11.96 2.67 11.5 2.34 11 2.18" stroke="white" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
              </div>
              <br/>
              <span style="font-family:'Segoe UI',Arial,sans-serif;font-size:30px;font-weight:900;color:#ffffff;letter-spacing:-0.5px;">AprovI.A</span>
              <br/>
              <span style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:rgba(255,255,255,0.80);letter-spacing:2px;text-transform:uppercase;">Sua IA para o ENEM</span>

              <!-- Badge de confirmado -->
              <div style="margin-top:24px;">
                <span style="display:inline-block;background:rgba(255,255,255,0.20);border:1.5px solid rgba(255,255,255,0.40);border-radius:100px;padding:6px 18px;font-family:'Segoe UI',Arial,sans-serif;font-size:13px;font-weight:700;color:#ffffff;letter-spacing:0.5px;">
                  ✅ Conta verificada com sucesso!
                </span>
              </div>
            </td>
          </tr>

          <!-- CORPO PRINCIPAL -->
          <tr>
            <td style="background:#ffffff;padding:44px 40px 36px;">

              <!-- Saudação -->
              <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:26px;font-weight:800;color:#0f172a;margin:0 0 8px 0;line-height:1.3;">
                Seja bem-vindo(a),<br/>${primeiroNome}! 🎉
              </p>
              <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:15px;color:#475569;margin:0 0 32px 0;line-height:1.7;">
                Sua conta foi criada e verificada com sucesso. Agora você tem acesso a uma das
                plataformas de estudos com <strong style="color:#0B61FF;">inteligência artificial</strong>
                mais avançadas para o <strong>ENEM 2025</strong>.
                Preparado(a) para arrasar na prova?
              </p>

              <!-- Divisor com emoji -->
              <div style="text-align:center;margin:0 0 28px 0;">
                <span style="font-size:28px;">🚀</span>
                <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:14px;font-weight:700;color:#0B61FF;margin:8px 0 0 0;letter-spacing:1px;text-transform:uppercase;">Por onde começar?</p>
              </div>

              <!-- Features -->
              <table width="100%" cellpadding="0" cellspacing="0" style="margin-bottom:32px;">

                <!-- Feature 1 -->
                <tr>
                  <td style="padding-bottom:16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0F6FF;border-radius:14px;border-left:4px solid #0B61FF;overflow:hidden;">
                      <tr>
                        <td style="padding:18px 20px;width:52px;vertical-align:top;">
                          <div style="font-size:28px;">🤖</div>
                        </td>
                        <td style="padding:18px 20px 18px 0;vertical-align:top;">
                          <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:14px;font-weight:700;color:#0f172a;margin:0 0 4px 0;">Professora Virtual IA</p>
                          <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#64748b;margin:0;line-height:1.5;">
                            Tire todas as suas dúvidas a qualquer hora com uma professora humanizada e ultra-inteligente.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Feature 2 -->
                <tr>
                  <td style="padding-bottom:16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#F0FDF4;border-radius:14px;border-left:4px solid #22c55e;overflow:hidden;">
                      <tr>
                        <td style="padding:18px 20px;width:52px;vertical-align:top;">
                          <div style="font-size:28px;">📝</div>
                        </td>
                        <td style="padding:18px 20px 18px 0;vertical-align:top;">
                          <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:14px;font-weight:700;color:#0f172a;margin:0 0 4px 0;">Simulados Completos do ENEM</p>
                          <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#64748b;margin:0;line-height:1.5;">
                            Pratique com questões oficiais das edições anteriores com gabarito e explicações detalhadas.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Feature 3 -->
                <tr>
                  <td style="padding-bottom:16px;">
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FFF7ED;border-radius:14px;border-left:4px solid #f97316;overflow:hidden;">
                      <tr>
                        <td style="padding:18px 20px;width:52px;vertical-align:top;">
                          <div style="font-size:28px;">✍️</div>
                        </td>
                        <td style="padding:18px 20px 18px 0;vertical-align:top;">
                          <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:14px;font-weight:700;color:#0f172a;margin:0 0 4px 0;">Correção de Redação com IA</p>
                          <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#64748b;margin:0;line-height:1.5;">
                            Receba nota detalhada nas 5 competências do ENEM em segundos, com dicas para evoluir.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

                <!-- Feature 4 -->
                <tr>
                  <td>
                    <table width="100%" cellpadding="0" cellspacing="0" style="background:#FDF4FF;border-radius:14px;border-left:4px solid #a855f7;overflow:hidden;">
                      <tr>
                        <td style="padding:18px 20px;width:52px;vertical-align:top;">
                          <div style="font-size:28px;">📅</div>
                        </td>
                        <td style="padding:18px 20px 18px 0;vertical-align:top;">
                          <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:14px;font-weight:700;color:#0f172a;margin:0 0 4px 0;">Rotina de Estudos Personalizada</p>
                          <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#64748b;margin:0;line-height:1.5;">
                            A IA monta um plano de estudos sob medida para você com base no seu nível e objetivos.
                          </p>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>

              </table>

              <!-- CTA Button -->
              <div style="text-align:center;margin-bottom:32px;">
                <a href="https://aproviaapp.lovable.app"
                   style="display:inline-block;background:linear-gradient(135deg,#0B61FF 0%,#0048cc 100%);
                          color:#ffffff;font-family:'Segoe UI',Arial,sans-serif;font-size:16px;
                          font-weight:700;text-decoration:none;padding:16px 40px;
                          border-radius:12px;letter-spacing:0.3px;
                          box-shadow:0 4px 14px rgba(11,97,255,0.35);">
                  Começar a estudar agora 🚀
                </a>
              </div>

              <!-- Separador -->
              <div style="border-top:1px solid #E2E8F0;margin-bottom:24px;"></div>

              <!-- Mensagem de encorajamento -->
              <div style="background:linear-gradient(135deg,#EFF6FF,#F0F9FF);border-radius:12px;padding:20px 24px;">
                <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:14px;color:#1e40af;font-style:italic;margin:0;line-height:1.7;text-align:center;">
                  "O segredo do sucesso no ENEM não é estudar mais, mas estudar melhor —
                  com as ferramentas certas. Você já deu o primeiro passo." 💡
                </p>
              </div>

            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background:#F8FAFC;padding:24px 40px;border-top:1px solid #E2E8F0;text-align:center;">
              <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:13px;color:#64748b;margin:0 0 6px 0;">
                Você está recebendo este email porque criou uma conta com <strong>${email}</strong>.
              </p>
              <p style="font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#94a3b8;margin:0 0 10px 0;">
                © ${ano} <strong style="color:#0B61FF;">AprovI.A</strong> · Todos os direitos reservados
              </p>
              <a href="https://aprovia.online" style="font-family:'Segoe UI',Arial,sans-serif;font-size:12px;color:#0B61FF;text-decoration:none;font-weight:600;">
                aprovia.online
              </a>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

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

    // Buscar nome do usuário
    const { data: profile } = await supabaseAdmin
      .from("profiles")
      .select("nome")
      .eq("id", user.id)
      .single();

    const nomeUsuario = profile?.nome ?? user.email ?? "Estudante";
    const destinatario = user.email!;

    const html = buildBoasVindasEmail(nomeUsuario, destinatario);

    const emailRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "AprovI.A <noreply@aprovia.online>",
        to: [destinatario],
        subject: `🎉 Bem-vindo(a) ao AprovI.A, ${nomeUsuario.split(" ")[0]}!`,
        html,
      }),
    });

    if (!emailRes.ok) {
      const errBody = await emailRes.text();
      console.error("Resend error:", errBody);
      return new Response(JSON.stringify({ success: false, error: errBody }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    await emailRes.text(); // consume body

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : "Erro desconhecido";
    console.error("Erro enviar-boas-vindas:", msg);
    return new Response(JSON.stringify({ error: msg }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});

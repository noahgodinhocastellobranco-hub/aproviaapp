import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) {
      throw new Error("RESEND_API_KEY não configurado");
    }

    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Pegar token do header Authorization
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Não autorizado" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Cliente com service role para operações admin
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Cliente com token do usuário para validar a sessão
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
    const { type, new_email } = body; // type: 'password' | 'email'

    if (!type || !["password", "email"].includes(type)) {
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

    // Validar formato do email se for mudança de email
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

    // Invalidar códigos anteriores do mesmo usuário e tipo
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

    if (insertError) {
      throw new Error("Erro ao salvar código: " + insertError.message);
    }

    // Definir destinatário e conteúdo do email
    const destinatario = type === "email" ? new_email : user.email!;
    const assunto = type === "password" ? "Código para alterar sua senha" : "Código para alterar seu email";
    const acao = type === "password" ? "alterar sua senha" : "alterar seu email";

    // Tentar enviar email via Resend (pode falhar em contas sem domínio verificado)
    let emailEnviado = false;
    try {
      const emailRes = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "Aprovia <onboarding@resend.dev>",
          to: [destinatario],
          subject: assunto,
          html: `
            <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; padding: 32px;">
              <h2 style="color: #7c3aed; margin-bottom: 8px;">Aprovia</h2>
              <p style="color: #374151; font-size: 16px;">
                Use o código abaixo para ${acao}:
              </p>
              <div style="background: #f3f4f6; border-radius: 12px; padding: 24px; text-align: center; margin: 24px 0;">
                <span style="font-size: 48px; font-weight: bold; letter-spacing: 12px; color: #7c3aed;">${code}</span>
              </div>
              <p style="color: #6b7280; font-size: 14px;">
                Este código expira em <strong>10 minutos</strong>. Não compartilhe com ninguém.
              </p>
              <p style="color: #9ca3af; font-size: 12px; margin-top: 24px;">
                Se você não solicitou essa alteração, ignore este email.
              </p>
            </div>
          `,
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

    // Se email não foi enviado, retorna o código na resposta (fallback visual)
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

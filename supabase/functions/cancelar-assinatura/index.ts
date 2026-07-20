import { corsHeaders } from 'npm:@supabase/supabase-js@2/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SERVICE_ROLE = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const CAKTO_API_KEY = Deno.env.get('CAKTO_API_KEY') || '';
const CAKTO_API_URL = Deno.env.get('CAKTO_API_URL') || 'https://api.cakto.com.br/v1';

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders });

  try {
    const authHeader = req.headers.get('Authorization') || '';
    const token = authHeader.replace('Bearer ', '');
    if (!token) {
      return new Response(JSON.stringify({ error: 'unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(SUPABASE_URL, SERVICE_ROLE);
    const { data: userData, error: userErr } = await admin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return new Response(JSON.stringify({ error: 'invalid_token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    const user = userData.user;

    // Find latest Cakto event for this user's email to extract subscription id
    const { data: vendas } = await admin
      .from('vendas')
      .select('id, transacao_id, payload, created_at')
      .eq('email_cliente', user.email)
      .order('created_at', { ascending: false })
      .limit(5);

    let caktoResult: { attempted: boolean; ok: boolean; details?: unknown } = { attempted: false, ok: false };

    if (CAKTO_API_KEY && vendas && vendas.length > 0) {
      const venda = vendas[0];
      const payload = (venda.payload || {}) as Record<string, unknown>;
      const subscriptionId =
        (payload.subscription_id as string) ||
        (payload.subscriptionId as string) ||
        ((payload.subscription as Record<string, unknown> | undefined)?.id as string) ||
        (payload.assinatura_id as string) ||
        venda.transacao_id ||
        '';

      if (subscriptionId) {
        try {
          const resp = await fetch(`${CAKTO_API_URL}/subscriptions/${subscriptionId}/cancel`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${CAKTO_API_KEY}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ reason: 'user_request' }),
          });
          const bodyText = await resp.text();
          caktoResult = { attempted: true, ok: resp.ok, details: bodyText };
          console.log('[cancelar-assinatura] Cakto resp', resp.status, bodyText);
        } catch (e) {
          console.error('[cancelar-assinatura] Cakto call failed', e);
          caktoResult = { attempted: true, ok: false, details: String(e) };
        }
      }
    }

    // Always reflect cancellation locally so the user loses PRO access immediately
    const { error: updErr } = await admin
      .from('profiles')
      .update({ is_premium: false })
      .eq('id', user.id);

    if (updErr) {
      return new Response(JSON.stringify({ error: 'update_failed', details: updErr.message }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    return new Response(JSON.stringify({ ok: true, cakto: caktoResult }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (e) {
    console.error('[cancelar-assinatura] error', e);
    return new Response(JSON.stringify({ error: 'internal_error', details: String(e) }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

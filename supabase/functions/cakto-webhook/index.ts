import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Eventos que concedem acesso premium
const APPROVED_EVENTS = ['purchase', 'paid', 'approved', 'completed', 'order_paid'];
const APPROVED_STATUSES = ['paid', 'approved', 'completed', 'active'];

// Eventos que revogam acesso premium
const REVOKE_EVENTS = ['refund', 'chargeback', 'dispute', 'cancellation', 'subscription_cancelled', 'subscription_canceled'];
const REVOKE_STATUSES = ['refunded', 'cancelled', 'canceled', 'chargedback', 'disputed'];

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }

  try {
    const payload = await req.json();
    console.log('Cakto webhook received:', JSON.stringify(payload));

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
    );

    const evento = payload.event ?? payload.type ?? payload.status ?? 'unknown';
    const status = payload.status ?? payload.data?.status ?? payload.payment_status ?? null;
    const emailCliente = payload.customer?.email ?? payload.data?.customer?.email ?? payload.buyer_email ?? null;

    // Cakto payload mapping
    const venda = {
      evento,
      status,
      nome_cliente: payload.customer?.name ?? payload.data?.customer?.name ?? payload.buyer_name ?? null,
      email_cliente: emailCliente,
      valor: payload.amount ?? payload.data?.amount ?? payload.value ?? null,
      moeda: payload.currency ?? 'BRL',
      produto: payload.product?.name ?? payload.data?.product?.name ?? payload.plan ?? null,
      transacao_id: payload.id ?? payload.transaction_id ?? payload.data?.id ?? null,
      payload: payload,
    };

    // 1. Registra a venda
    const { error: vendaError } = await supabase.from('vendas').insert([venda]);
    if (vendaError) {
      console.error('Error inserting venda:', vendaError);
    }

    // 2. Age automaticamente no perfil do usuário se tiver email
    if (emailCliente) {
      const eventoLower = evento.toLowerCase();
      const statusLower = (status ?? '').toLowerCase();

      const shouldGrant = APPROVED_EVENTS.some(e => eventoLower.includes(e)) ||
                          APPROVED_STATUSES.some(s => statusLower === s);

      const shouldRevoke = REVOKE_EVENTS.some(e => eventoLower.includes(e)) ||
                           REVOKE_STATUSES.some(s => statusLower === s);

      if (shouldGrant) {
        // Libera acesso premium pelo email
        const { error: premiumError } = await supabase
          .from('profiles')
          .update({ is_premium: true })
          .eq('email', emailCliente);

        if (premiumError) {
          console.error('Error granting premium:', premiumError);
        } else {
          console.log(`✅ Premium GRANTED for: ${emailCliente} (evento: ${evento}, status: ${status})`);
        }
      } else if (shouldRevoke) {
        // Revoga acesso premium
        const { error: revokeError } = await supabase
          .from('profiles')
          .update({ is_premium: false })
          .eq('email', emailCliente);

        if (revokeError) {
          console.error('Error revoking premium:', revokeError);
        } else {
          console.log(`❌ Premium REVOKED for: ${emailCliente} (evento: ${evento}, status: ${status})`);
        }
      } else {
        console.log(`ℹ️ No access change for evento: ${evento}, status: ${status}`);
      }
    } else {
      console.log('⚠️ No email found in payload, skipping profile update');
    }

    return new Response(JSON.stringify({ received: true }), {
      status: 200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (err) {
    console.error('Webhook error:', err);
    return new Response(JSON.stringify({ error: 'Invalid payload' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

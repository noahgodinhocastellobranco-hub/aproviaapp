import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Cakto payload mapping (flexible for different event structures)
    const venda = {
      evento: payload.event ?? payload.type ?? payload.status ?? 'unknown',
      status: payload.status ?? payload.data?.status ?? payload.payment_status ?? null,
      nome_cliente: payload.customer?.name ?? payload.data?.customer?.name ?? payload.buyer_name ?? null,
      email_cliente: payload.customer?.email ?? payload.data?.customer?.email ?? payload.buyer_email ?? null,
      valor: payload.amount ?? payload.data?.amount ?? payload.value ?? null,
      moeda: payload.currency ?? 'BRL',
      produto: payload.product?.name ?? payload.data?.product?.name ?? payload.plan ?? null,
      transacao_id: payload.id ?? payload.transaction_id ?? payload.data?.id ?? null,
      payload: payload,
    };

    const { error } = await supabase.from('vendas').insert([venda]);

    if (error) {
      console.error('Error inserting venda:', error);
      return new Response(JSON.stringify({ error: error.message }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    console.log('Venda registrada com sucesso');
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

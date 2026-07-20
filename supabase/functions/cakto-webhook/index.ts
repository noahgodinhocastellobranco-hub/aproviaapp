import { serve } from "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = { "Access-Control-Allow-Origin": "*", "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type" };
const json = (body: unknown, status = 200) => new Response(JSON.stringify(body), { status, headers: { ...corsHeaders, "Content-Type": "application/json" } });
const pick = (obj: any, keys: string[]) => keys.map((key) => key.split(".").reduce((acc, part) => acc?.[part], obj)).find((v) => v !== undefined && v !== null && v !== "");
const cents = (value: unknown) => Math.round(Number(value || 0) * (Number(value || 0) > 1000 ? 1 : 100));

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });
  try {
    const payload = await req.json();
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");
    if (!supabaseUrl || !serviceKey) return json({ error: "Configuração incompleta" }, 500);
    const admin = createClient(supabaseUrl, serviceKey);
    const eventText = String(pick(payload, ["event", "evento", "type", "event_type", "status"]) || "webhook");
    const status = String(pick(payload, ["status", "data.status", "order.status", "payment.status"]) || eventText);
    const email = String(pick(payload, ["customer.email", "data.customer.email", "client.email", "email", "buyer.email"]) || "").trim().toLowerCase();
    const nome = String(pick(payload, ["customer.name", "data.customer.name", "client.name", "name", "buyer.name"]) || "");
    const valor = cents(pick(payload, ["amount", "value", "price", "total", "data.amount", "order.amount", "payment.amount"]));
    const transacao = String(pick(payload, ["transaction_id", "id", "data.id", "order.id", "payment.id"]) || crypto.randomUUID());
    await admin.from("vendas").insert({ evento: eventText, status, nome_cliente: nome, email_cliente: email || null, valor, moeda: "BRL", produto: String(pick(payload, ["product.name", "data.product.name", "product"]) || "AprovI.A PRO"), transacao_id: transacao, payload });
    const approved = `${eventText} ${status}`.toLowerCase().match(/paid|approved|aprov|purchase|completed|complete|success/);
    const revoked = `${eventText} ${status}`.toLowerCase().match(/refund|refunded|cancel|canceled|cancelled|chargeback|reembolso|estorno/);
    if (email && (approved || revoked)) await admin.from("profiles").update({ is_premium: !!approved && !revoked }).eq("email", email);
    return json({ ok: true });
  } catch (error) { return json({ error: error instanceof Error ? error.message : "Erro inesperado" }, 500); }
});
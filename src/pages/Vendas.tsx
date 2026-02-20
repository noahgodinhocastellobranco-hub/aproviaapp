import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft, TrendingUp, ShoppingBag, DollarSign, Users, Wifi, Clock,
} from "lucide-react";

type Venda = {
  id: string;
  evento: string | null;
  status: string | null;
  nome_cliente: string | null;
  email_cliente: string | null;
  valor: number | null;
  produto: string | null;
  transacao_id: string | null;
  created_at: string;
};

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  approved: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  completed: "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400",
  pending: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400",
  waiting_payment: "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-400",
  refunded: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
  cancelled: "bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-400",
};

const statusLabel = (s: string | null) => {
  if (!s) return "—";
  const map: Record<string, string> = {
    paid: "Pago", approved: "Aprovado", completed: "Concluído",
    pending: "Pendente", waiting_payment: "Aguardando", refunded: "Reembolsado",
    cancelled: "Cancelado",
  };
  return map[s] ?? s;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

const formatCurrency = (v: number | null) =>
  v == null ? "—" : `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

export default function Vendas() {
  const navigate = useNavigate();
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loading, setLoading] = useState(true);
  const [live, setLive] = useState(true);

  const WEBHOOK_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/cakto-webhook`;

  const loadVendas = async () => {
    const { data } = await supabase
      .from("vendas")
      .select("id, evento, status, nome_cliente, email_cliente, valor, produto, transacao_id, created_at")
      .order("created_at", { ascending: false })
      .limit(100);
    if (data) setVendas(data as Venda[]);
    setLoading(false);
  };

  useEffect(() => {
    // Check auth
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) { navigate("/auth"); return; }
    });

    loadVendas();

    // Realtime subscription
    const channel = supabase
      .channel("vendas-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "vendas" }, (payload) => {
        setVendas((prev) => [payload.new as Venda, ...prev]);
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [navigate]);

  // Stats
  const vendaAprovadas = vendas.filter(v => ["paid", "approved", "completed"].includes(v.status ?? ""));
  const totalReceita = vendaAprovadas.reduce((acc, v) => acc + (v.valor ?? 0), 0);
  const totalClientes = new Set(vendas.map(v => v.email_cliente).filter(Boolean)).size;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 max-w-5xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-1.5 text-xs font-semibold ${live ? "text-emerald-600" : "text-muted-foreground"}`}>
            <span className={`h-2 w-2 rounded-full ${live ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"}`} />
            {live ? "Ao Vivo" : "Desconectado"}
          </div>
          <div className="flex items-center gap-2 text-foreground font-semibold">
            <TrendingUp className="h-5 w-5 text-primary" />
            Vendas
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 pb-16 space-y-5">

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <ShoppingBag className="h-5 w-5 text-primary" />, label: "Total de Pedidos", value: String(vendas.length), bg: "bg-primary/10" },
            { icon: <DollarSign className="h-5 w-5 text-emerald-600" />, label: "Receita Aprovada", value: formatCurrency(totalReceita), bg: "bg-emerald-100 dark:bg-emerald-950/40" },
            { icon: <Users className="h-5 w-5 text-blue-600" />, label: "Clientes Únicos", value: String(totalClientes), bg: "bg-blue-100 dark:bg-blue-950/40" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
              <div className={`inline-flex p-2 rounded-xl ${s.bg} mb-3`}>{s.icon}</div>
              <p className="text-xs text-muted-foreground mb-0.5">{s.label}</p>
              <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Webhook info */}
        <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
          <div className="flex items-start gap-3">
            <Wifi className="h-5 w-5 text-primary shrink-0 mt-0.5" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-foreground mb-1">Configure o Webhook na Cakto</p>
              <p className="text-xs text-muted-foreground mb-2">Cole este URL no painel da Cakto em Configurações → Webhooks:</p>
              <div className="flex items-center gap-2">
                <code className="text-xs bg-background border border-border rounded-lg px-3 py-2 font-mono break-all flex-1">
                  {WEBHOOK_URL}
                </code>
                <Button
                  size="sm"
                  variant="outline"
                  className="shrink-0 text-xs"
                  onClick={() => { navigator.clipboard.writeText(WEBHOOK_URL); }}
                >
                  Copiar
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Tabela de vendas */}
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="px-6 py-4 border-b border-border flex items-center justify-between">
            <h2 className="font-bold text-foreground">Histórico de Vendas</h2>
            <Button variant="ghost" size="sm" onClick={loadVendas} className="text-xs gap-1.5">
              <Clock className="h-3.5 w-3.5" />
              Atualizar
            </Button>
          </div>

          {loading ? (
            <div className="p-12 text-center text-muted-foreground text-sm">Carregando...</div>
          ) : vendas.length === 0 ? (
            <div className="p-12 text-center">
              <ShoppingBag className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
              <p className="text-sm text-muted-foreground">Nenhuma venda registrada ainda.</p>
              <p className="text-xs text-muted-foreground mt-1">Configure o webhook acima para começar a receber notificações.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/30">
                     <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Data</th>
                     <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Nome Completo</th>
                     <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Email Completo</th>
                     <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Valor</th>
                     <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                     <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">ID Transação</th>
                  </tr>
                </thead>
                <tbody>
                  {vendas.map((v, i) => (
                    <tr key={v.id} className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${i === 0 ? "bg-emerald-50/50 dark:bg-emerald-950/10" : ""}`}>
                      <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(v.created_at)}</td>
                      <td className="px-4 py-3 font-medium text-foreground">{v.nome_cliente ?? "—"}</td>
                      <td className="px-4 py-3 text-foreground text-xs font-mono break-all">{v.email_cliente ?? "—"}</td>
                      <td className="px-4 py-3 font-bold text-foreground">{formatCurrency(v.valor)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-semibold px-2 py-1 rounded-full ${STATUS_STYLES[v.status ?? ""] ?? "bg-muted text-muted-foreground"}`}>
                          {statusLabel(v.status)}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-xs text-muted-foreground font-mono break-all">{v.transacao_id ?? "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

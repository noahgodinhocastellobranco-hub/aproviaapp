import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowLeft, Copy, DollarSign, RefreshCcw, RotateCcw, ShoppingCart, Users } from "lucide-react";
import { toast } from "sonner";
import type { Tables } from "@/integrations/supabase/types";

type Venda = Tables<"vendas">;
const WEBHOOK_URL = "https://yecfogakgyszdkipzelm.supabase.co/functions/v1/cakto-webhook";

const formatCurrency = (value: number | null) => new Intl.NumberFormat("pt-BR", { style: "currency", currency: "BRL" }).format((value || 0) / 100);

export default function Vendas() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [vendas, setVendas] = useState<Venda[]>([]);

  const load = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      navigate("/dashboard", { replace: true });
      return;
    }

    const { data: isAdmin } = await supabase.rpc("has_role", { _user_id: user.id, _role: "admin" });
    if (!isAdmin) {
      toast.error("Acesso restrito aos administradores.");
      navigate("/dashboard", { replace: true });
      return;
    }

    const { data, error } = await supabase.from("vendas").select("*").order("created_at", { ascending: false }).limit(200);
    if (error) toast.error("Não foi possível carregar as vendas.");
    setVendas(data || []);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("vendas-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "vendas" }, (payload) => {
        setVendas((current) => [payload.new as Venda, ...current]);
        toast.success("Nova atualização da Cakto recebida.");
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const stats = useMemo(() => {
    const approved = vendas.filter((v) => [v.status, v.evento].join(" ").toLowerCase().match(/paid|approved|aprov|purchase|completed/));
    const refunded = vendas.filter((v) => [v.status, v.evento].join(" ").toLowerCase().match(/refund|cancel|chargeback|reembolso/));
    return {
      total: vendas.length,
      receita: approved.reduce((sum, v) => sum + (v.valor || 0), 0),
      clientes: new Set(vendas.map((v) => v.email_cliente).filter(Boolean)).size,
      reembolsos: refunded.length,
    };
  }, [vendas]);

  if (loading) return <div className="min-h-screen grid place-items-center bg-background text-primary font-semibold">Carregando painel de vendas...</div>;

  return (
    <main className="min-h-screen bg-background p-4 sm:p-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <Button variant="ghost" onClick={() => navigate("/admin")} className="mb-2"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar</Button>
            <h1 className="text-4xl font-black text-foreground">Vendas Cakto</h1>
            <p className="text-muted-foreground">Vendas, reembolsos, cancelamentos e eventos em tempo real.</p>
          </div>
          <Button variant="outline" onClick={load}><RefreshCcw className="mr-2 h-4 w-4" /> Atualizar</Button>
        </div>

        <div className="mb-6 grid gap-4 md:grid-cols-4">
          <Card><CardContent className="p-5"><ShoppingCart className="mb-2 h-5 w-5 text-primary" /><p className="text-sm text-muted-foreground">Pedidos/Eventos</p><p className="text-3xl font-black">{stats.total}</p></CardContent></Card>
          <Card><CardContent className="p-5"><DollarSign className="mb-2 h-5 w-5 text-success" /><p className="text-sm text-muted-foreground">Receita aprovada</p><p className="text-3xl font-black">{formatCurrency(stats.receita)}</p></CardContent></Card>
          <Card><CardContent className="p-5"><Users className="mb-2 h-5 w-5 text-primary" /><p className="text-sm text-muted-foreground">Clientes únicos</p><p className="text-3xl font-black">{stats.clientes}</p></CardContent></Card>
          <Card><CardContent className="p-5"><RotateCcw className="mb-2 h-5 w-5 text-destructive" /><p className="text-sm text-muted-foreground">Reembolsos/cancel.</p><p className="text-3xl font-black">{stats.reembolsos}</p></CardContent></Card>
        </div>

        <Card className="mb-6">
          <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="font-bold text-foreground">URL do Webhook Cakto</p>
              <p className="break-all text-sm text-muted-foreground">{WEBHOOK_URL}</p>
            </div>
            <Button variant="outline" onClick={() => navigator.clipboard.writeText(WEBHOOK_URL)}><Copy className="mr-2 h-4 w-4" /> Copiar</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader><CardTitle>Últimos eventos</CardTitle></CardHeader>
          <CardContent className="overflow-x-auto">
            <Table>
              <TableHeader><TableRow><TableHead>Data</TableHead><TableHead>Cliente</TableHead><TableHead>Email</TableHead><TableHead>Status</TableHead><TableHead>Valor</TableHead><TableHead>Transação</TableHead></TableRow></TableHeader>
              <TableBody>
                {vendas.map((venda) => (
                  <TableRow key={venda.id}>
                    <TableCell>{new Date(venda.created_at).toLocaleString("pt-BR")}</TableCell>
                    <TableCell>{venda.nome_cliente || "—"}</TableCell>
                    <TableCell>{venda.email_cliente || "—"}</TableCell>
                    <TableCell><Badge variant="outline">{venda.status || venda.evento || "evento"}</Badge></TableCell>
                    <TableCell className="font-semibold">{formatCurrency(venda.valor)}</TableCell>
                    <TableCell className="max-w-[180px] truncate">{venda.transacao_id || "—"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
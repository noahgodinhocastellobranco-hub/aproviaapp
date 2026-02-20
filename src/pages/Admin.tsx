import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Shield, ArrowLeft, Users, TrendingUp, Crown, UserX,
  Search, RefreshCw, CheckCircle2, XCircle, Mail, Loader2,
  ShieldCheck, User, Trash2, DollarSign, ShoppingBag,
  RotateCcw, Clock, Wifi, Filter, ChevronDown,
} from "lucide-react";

type Profile = {
  id: string;
  email: string | null;
  nome: string | null;
  is_premium: boolean;
  created_at: string | null;
};

type Venda = {
  id: string;
  evento: string | null;
  status: string | null;
  nome_cliente: string | null;
  email_cliente: string | null;
  valor: number | null;
  produto: string | null;
  transacao_id: string | null;
  moeda: string | null;
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
    pending: "Pendente", waiting_payment: "Aguardando",
    refunded: "Reembolsado", cancelled: "Cancelado",
  };
  return map[s] ?? s;
};

const formatDate = (iso: string) =>
  new Date(iso).toLocaleString("pt-BR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });

const formatCurrency = (v: number | null) =>
  v == null ? "—" : `R$ ${v.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}`;

const APPROVED = ["paid", "approved", "completed"];
const REFUNDED = ["refunded", "cancelled"];
const PENDING  = ["pending", "waiting_payment"];

type Tab = "usuarios" | "vendas" | "premium" | "criar";
type StatusFilter = "all" | "approved" | "pending" | "refunded";

export default function Admin() {
  const navigate = useNavigate();
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("usuarios");

  // ── Users ──
  const [users, setUsers] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);

  // ── Vendas ──
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loadingVendas, setLoadingVendas] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [vendaSearch, setVendaSearch] = useState("");

  // ── Grant / Revoke premium ──
  const [grantEmail, setGrantEmail] = useState("");
  const [grantLoading, setGrantLoading] = useState(false);
  const [revokeEmail, setRevokeEmail] = useState("");
  const [revokeLoading, setRevokeLoading] = useState(false);

  // ── Create account ──
  const [newEmail, setNewEmail] = useState("");
  const [newSenha, setNewSenha] = useState("");
  const [newPremium, setNewPremium] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }
      const { data } = await supabase
        .from("user_roles" as any)
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();
      if (!data) { navigate("/dashboard"); return; }
      setIsAdmin(true);
      setCurrentEmail(user.email ?? null);
      setLoading(false);
      loadUsers();
      loadVendas();
    };
    checkAdmin();
  }, [navigate]);

  // Realtime for vendas
  useEffect(() => {
    const channel = supabase
      .channel("admin-vendas-realtime")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "vendas" }, (payload) => {
        setVendas((prev) => [payload.new as Venda, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  const loadUsers = async () => {
    setLoadingUsers(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, email, nome, is_premium, created_at")
      .order("created_at", { ascending: false });
    if (data) setUsers(data as Profile[]);
    setLoadingUsers(false);
  };

  const loadVendas = async () => {
    setLoadingVendas(true);
    const { data } = await supabase
      .from("vendas")
      .select("id, evento, status, nome_cliente, email_cliente, valor, produto, transacao_id, moeda, created_at")
      .order("created_at", { ascending: false })
      .limit(200);
    if (data) setVendas(data as Venda[]);
    setLoadingVendas(false);
  };

  const handleGrantPremium = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantEmail.trim()) return;
    setGrantLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ is_premium: true })
      .eq("email", grantEmail.trim().toLowerCase());
    if (error) {
      toast.error("Erro ao conceder premium: " + error.message);
    } else {
      toast.success(`✅ Premium concedido para ${grantEmail}`);
      setGrantEmail("");
      loadUsers();
    }
    setGrantLoading(false);
  };

  const handleRevokePremium = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revokeEmail.trim()) return;
    setRevokeLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ is_premium: false })
      .eq("email", revokeEmail.trim().toLowerCase());
    if (error) {
      toast.error("Erro ao revogar premium: " + error.message);
    } else {
      toast.success(`❌ Premium revogado de ${revokeEmail}`);
      setRevokeEmail("");
      loadUsers();
    }
    setRevokeLoading(false);
  };

  const handleTogglePremium = async (profile: Profile) => {
    const { error } = await supabase
      .from("profiles")
      .update({ is_premium: !profile.is_premium })
      .eq("id", profile.id);
    if (error) {
      toast.error("Erro ao alterar premium");
    } else {
      toast.success(
        profile.is_premium
          ? `Premium removido de ${profile.email}`
          : `Premium concedido a ${profile.email}`
      );
      setUsers((prev) =>
        prev.map((u) => u.id === profile.id ? { ...u, is_premium: !u.is_premium } : u)
      );
    }
  };

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim() || !newSenha.trim()) return;
    setCreateLoading(true);
    try {
      const res = await supabase.functions.invoke("admin-create-user", {
        body: { email: newEmail.trim(), password: newSenha.trim(), is_premium: newPremium },
      });
      if (res.error) throw new Error(res.error.message);
      toast.success(`✅ Conta criada: ${newEmail}${newPremium ? " (PRO)" : ""}`);
      setNewEmail("");
      setNewSenha("");
      loadUsers();
    } catch (err: any) {
      toast.error("Erro: " + (err.message ?? "Falha ao criar conta"));
    }
    setCreateLoading(false);
  };

  // ── computed ──
  const filteredUsers = users.filter((u) =>
    (u.email ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.nome ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPremium = users.filter((u) => u.is_premium).length;

  const filteredVendas = vendas.filter((v) => {
    const matchStatus =
      statusFilter === "all" ? true :
      statusFilter === "approved" ? APPROVED.includes(v.status ?? "") :
      statusFilter === "pending"  ? PENDING.includes(v.status ?? "") :
      REFUNDED.includes(v.status ?? "");
    const term = vendaSearch.toLowerCase();
    const matchSearch = !term ||
      (v.nome_cliente ?? "").toLowerCase().includes(term) ||
      (v.email_cliente ?? "").toLowerCase().includes(term) ||
      (v.transacao_id ?? "").toLowerCase().includes(term);
    return matchStatus && matchSearch;
  });

  const vendasAprovadas  = vendas.filter(v => APPROVED.includes(v.status ?? ""));
  const vendasReembolso  = vendas.filter(v => REFUNDED.includes(v.status ?? ""));
  const vendasPendentes  = vendas.filter(v => PENDING.includes(v.status ?? ""));
  const totalReceita     = vendasAprovadas.reduce((a, v) => a + (v.valor ?? 0), 0);
  const totalReembolso   = vendasReembolso.reduce((a, v) => a + (v.valor ?? 0), 0);
  const totalClientes    = new Set(vendas.map(v => v.email_cliente).filter(Boolean)).size;

  const WEBHOOK_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/cakto-webhook`;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </button>
          <div className="flex items-center gap-2 font-bold text-foreground">
            <ShieldCheck className="h-5 w-5 text-primary" />
            Painel de Administração
          </div>
          <div className="text-xs text-muted-foreground hidden sm:block">{currentEmail}</div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-6">

        {/* Stats top */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: <Users className="h-5 w-5 text-primary" />, label: "Usuários", value: users.length, bg: "bg-primary/10" },
            { icon: <Crown className="h-5 w-5 text-amber-600" />, label: "PRO", value: totalPremium, bg: "bg-amber-100 dark:bg-amber-950/30" },
            { icon: <ShoppingBag className="h-5 w-5 text-emerald-600" />, label: "Pedidos", value: vendas.length, bg: "bg-emerald-100 dark:bg-emerald-950/30" },
            { icon: <DollarSign className="h-5 w-5 text-blue-600" />, label: "Receita", value: formatCurrency(totalReceita), bg: "bg-blue-100 dark:bg-blue-950/30" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
              <div className={`inline-flex p-2 rounded-xl ${s.bg} mb-2`}>{s.icon}</div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-xl font-extrabold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border overflow-x-auto">
          {([
            { id: "usuarios" as Tab, label: "Usuários",         icon: <Users className="h-4 w-4" /> },
            { id: "vendas"   as Tab, label: "Vendas & Cakto",   icon: <TrendingUp className="h-4 w-4" /> },
            { id: "premium"  as Tab, label: "Gerenciar PRO",    icon: <Crown className="h-4 w-4" /> },
            { id: "criar"    as Tab, label: "Criar Conta",      icon: <User className="h-4 w-4" /> },
          ]).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                tab === t.id
                  ? "border-primary text-primary"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* ── TAB USUÁRIOS ── */}
        {tab === "usuarios" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por email ou nome..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-9"
                />
              </div>
              <Button variant="outline" size="sm" onClick={loadUsers} className="gap-2 shrink-0">
                <RefreshCw className={`h-4 w-4 ${loadingUsers ? "animate-spin" : ""}`} />
                Atualizar
              </Button>
            </div>
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/30">
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Nome</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Cadastro</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Ação</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr><td colSpan={5} className="px-4 py-10 text-center text-muted-foreground text-sm">
                        {loadingUsers ? "Carregando..." : "Nenhum usuário encontrado."}
                      </td></tr>
                    ) : filteredUsers.map((u) => (
                      <tr key={u.id} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs text-foreground">{u.email ?? "—"}</td>
                        <td className="px-4 py-3 text-foreground">{u.nome ?? <span className="text-muted-foreground italic text-xs">sem nome</span>}</td>
                        <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">
                          {u.created_at ? new Date(u.created_at).toLocaleDateString("pt-BR") : "—"}
                        </td>
                        <td className="px-4 py-3">
                          {u.is_premium ? (
                            <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-100 dark:bg-amber-950/40 px-2 py-1 rounded-full w-fit">
                              <Crown className="h-3 w-3" /> PRO
                            </span>
                          ) : (
                            <span className="text-xs text-muted-foreground bg-muted px-2 py-1 rounded-full">Free</span>
                          )}
                        </td>
                        <td className="px-4 py-3">
                          <Button
                            size="sm"
                            variant={u.is_premium ? "outline" : "default"}
                            className="text-xs h-7 px-3"
                            onClick={() => handleTogglePremium(u)}
                          >
                            {u.is_premium ? (
                              <><UserX className="h-3 w-3 mr-1" />Remover PRO</>
                            ) : (
                              <><Crown className="h-3 w-3 mr-1" />Dar PRO</>
                            )}
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB VENDAS ── */}
        {tab === "vendas" && (
          <div className="space-y-5">

            {/* Vendas stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: <ShoppingBag className="h-5 w-5 text-primary" />, label: "Total Pedidos", value: String(vendas.length), bg: "bg-primary/10" },
                { icon: <DollarSign className="h-5 w-5 text-emerald-600" />, label: "Receita Aprovada", value: formatCurrency(totalReceita), bg: "bg-emerald-100 dark:bg-emerald-950/40" },
                { icon: <RotateCcw className="h-5 w-5 text-red-500" />, label: "Reembolsos", value: `${vendasReembolso.length} (${formatCurrency(totalReembolso)})`, bg: "bg-red-100 dark:bg-red-950/40" },
                { icon: <Clock className="h-5 w-5 text-yellow-600" />, label: "Pendentes", value: String(vendasPendentes.length), bg: "bg-yellow-100 dark:bg-yellow-950/40" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
                  <div className={`inline-flex p-2 rounded-xl ${s.bg} mb-2`}>{s.icon}</div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-sm font-extrabold text-foreground leading-tight">{s.value}</p>
                </div>
              ))}
            </div>

            {/* Webhook info */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <Wifi className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground mb-1">Webhook Cakto</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-background border border-border rounded-lg px-3 py-1.5 font-mono break-all flex-1">
                      {WEBHOOK_URL}
                    </code>
                    <Button size="sm" variant="outline" className="shrink-0 text-xs"
                      onClick={() => { navigator.clipboard.writeText(WEBHOOK_URL); toast.success("URL copiado!"); }}>
                      Copiar
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, email ou ID..."
                  value={vendaSearch}
                  onChange={(e) => setVendaSearch(e.target.value)}
                  className="pl-9"
                />
              </div>
              <div className="flex gap-2 flex-wrap">
                {([
                  { id: "all" as StatusFilter,      label: "Todos" },
                  { id: "approved" as StatusFilter, label: "✅ Aprovados" },
                  { id: "pending"  as StatusFilter, label: "⏳ Pendentes" },
                  { id: "refunded" as StatusFilter, label: "🔴 Reembolsos" },
                ]).map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setStatusFilter(f.id)}
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-colors ${
                      statusFilter === f.id
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background border-border text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={loadVendas} className="gap-2 shrink-0 ml-auto">
                <RefreshCw className={`h-4 w-4 ${loadingVendas ? "animate-spin" : ""}`} />
                Atualizar
              </Button>
            </div>

            {/* Tabela vendas */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {loadingVendas ? (
                <div className="p-12 text-center text-muted-foreground text-sm flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" /> Carregando vendas...
                </div>
              ) : filteredVendas.length === 0 ? (
                <div className="p-12 text-center">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Nenhuma venda encontrada.</p>
                  {vendas.length === 0 && (
                    <p className="text-xs text-muted-foreground mt-1">Configure o webhook acima para receber notificações da Cakto.</p>
                  )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Data</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Cliente</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Email</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Produto</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Valor</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Status</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Evento</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">ID Transação</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredVendas.map((v, i) => (
                        <tr
                          key={v.id}
                          className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${
                            REFUNDED.includes(v.status ?? "") ? "bg-red-50/30 dark:bg-red-950/5" :
                            i === 0 && APPROVED.includes(v.status ?? "") ? "bg-emerald-50/40 dark:bg-emerald-950/10" : ""
                          }`}
                        >
                          <td className="px-4 py-3 text-xs text-muted-foreground whitespace-nowrap">{formatDate(v.created_at)}</td>
                          <td className="px-4 py-3 font-medium text-foreground whitespace-nowrap">{v.nome_cliente ?? "—"}</td>
                          <td className="px-4 py-3 text-xs font-mono text-foreground">{v.email_cliente ?? "—"}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{v.produto ?? "—"}</td>
                          <td className="px-4 py-3 font-bold text-foreground whitespace-nowrap">{formatCurrency(v.valor)}</td>
                          <td className="px-4 py-3">
                            <span className={`text-xs font-semibold px-2 py-1 rounded-full whitespace-nowrap ${STATUS_STYLES[v.status ?? ""] ?? "bg-muted text-muted-foreground"}`}>
                              {statusLabel(v.status)}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">{v.evento ?? "—"}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground font-mono">{v.transacao_id ?? "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {filteredVendas.length > 0 && (
                <div className="px-4 py-3 border-t border-border bg-muted/10 text-xs text-muted-foreground flex items-center justify-between">
                  <span>Mostrando {filteredVendas.length} de {vendas.length} transações</span>
                  <span className="flex items-center gap-1.5 font-semibold text-emerald-600">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Tempo real
                  </span>
                </div>
              )}
            </div>

            {/* Resumo financeiro */}
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/10 p-5">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">💰 Receita Líquida Aprovada</p>
                <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">{formatCurrency(totalReceita)}</p>
                <p className="text-xs text-muted-foreground mt-1">{vendasAprovadas.length} transações aprovadas</p>
              </div>
              <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/10 p-5">
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">🔴 Total Reembolsado</p>
                <p className="text-2xl font-extrabold text-red-600 dark:text-red-400">{formatCurrency(totalReembolso)}</p>
                <p className="text-xs text-muted-foreground mt-1">{vendasReembolso.length} reembolsos / cancelamentos</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-semibold text-muted-foreground mb-1">👥 Clientes Únicos</p>
                <p className="text-2xl font-extrabold text-foreground">{totalClientes}</p>
                <p className="text-xs text-muted-foreground mt-1">Emails distintos no histórico</p>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB PREMIUM ── */}
        {tab === "premium" && (
          <div className="grid sm:grid-cols-2 gap-5">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex p-2 rounded-xl bg-amber-100 dark:bg-amber-950/30">
                  <Crown className="h-5 w-5 text-amber-600" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Conceder PRO</h3>
                  <p className="text-xs text-muted-foreground">Libera acesso premium gratuito</p>
                </div>
              </div>
              <form onSubmit={handleGrantPremium} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="email@exemplo.com"
                    type="email"
                    value={grantEmail}
                    onChange={(e) => setGrantEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={grantLoading}>
                  {grantLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
                  Conceder Acesso PRO
                </Button>
              </form>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex p-2 rounded-xl bg-destructive/10">
                  <XCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Revogar PRO</h3>
                  <p className="text-xs text-muted-foreground">Remove acesso premium de um usuário</p>
                </div>
              </div>
              <form onSubmit={handleRevokePremium} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="email@exemplo.com"
                    type="email"
                    value={revokeEmail}
                    onChange={(e) => setRevokeEmail(e.target.value)}
                    className="pl-9"
                    required
                  />
                </div>
                <Button type="submit" variant="destructive" className="w-full gap-2" disabled={revokeLoading}>
                  {revokeLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  Revogar Acesso PRO
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* ── TAB CRIAR CONTA ── */}
        {tab === "criar" && (
          <div className="max-w-md">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-5">
              <div className="flex items-center gap-3">
                <div className="inline-flex p-2 rounded-xl bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Criar Nova Conta</h3>
                  <p className="text-xs text-muted-foreground">Cria login com ou sem acesso PRO gratuito</p>
                </div>
              </div>
              <form onSubmit={handleCreateAccount} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Email</label>
                  <Input
                    type="email"
                    placeholder="email@exemplo.com"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Senha</label>
                  <Input
                    type="password"
                    placeholder="Senha de acesso"
                    value={newSenha}
                    onChange={(e) => setNewSenha(e.target.value)}
                    required
                    minLength={6}
                  />
                </div>
                <div className="flex items-center gap-3 py-2">
                  <button
                    type="button"
                    onClick={() => setNewPremium((v) => !v)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${newPremium ? "bg-amber-500" : "bg-muted-foreground/30"}`}
                  >
                    <span className={`inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${newPremium ? "translate-x-6" : "translate-x-1"}`} />
                  </button>
                  <span className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                    <Crown className={`h-4 w-4 ${newPremium ? "text-amber-500" : "text-muted-foreground"}`} />
                    {newPremium ? "Com acesso PRO gratuito" : "Conta Free"}
                  </span>
                </div>
                <Button type="submit" className="w-full gap-2" disabled={createLoading}>
                  {createLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Shield className="h-4 w-4" />}
                  Criar Conta
                </Button>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  Shield, ArrowLeft, Users, TrendingUp, Crown, UserX,
  Search, RefreshCw, CheckCircle2, XCircle, Mail, Loader2,
  ShieldCheck, User, Trash2, DollarSign, ShoppingBag,
  RotateCcw, Clock, Wifi, Bell, BarChart3, AlertTriangle,
  Activity, BookOpen, PenTool, MessageSquare, Megaphone,
} from "lucide-react";

// ── Types ──────────────────────────────────────────────────────────────────
type Profile = {
  id: string;
  email: string | null;
  nome: string | null;
  is_premium: boolean;
  created_at: string | null;
  deleted_at?: string | null;
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

type Notificacao = {
  id: string;
  titulo: string;
  mensagem: string;
  tipo: string;
  ativo: boolean;
  created_at: string;
  created_by: string | null;
};

type Activity = {
  user_id: string;
  date: string;
  actions_count: number;
};

// ── Helpers ─────────────────────────────────────────────────────────────────
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

type Tab = "dashboard" | "usuarios" | "vendas" | "premium" | "criar" | "notificacoes" | "estatisticas";
type StatusFilter = "all" | "approved" | "pending" | "refunded";

const PROTECTED_EMAILS = ["noahgodinhocastellobranco@gmail.com"];

// ── Component ────────────────────────────────────────────────────────────────
export default function Admin() {
  const navigate = useNavigate();
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<Tab>("dashboard");

  // Users
  const [users, setUsers] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null);

  // Vendas
  const [vendas, setVendas] = useState<Venda[]>([]);
  const [loadingVendas, setLoadingVendas] = useState(false);
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [vendaSearch, setVendaSearch] = useState("");

  // Premium
  const [grantEmail, setGrantEmail] = useState("");
  const [grantLoading, setGrantLoading] = useState(false);
  const [revokeEmail, setRevokeEmail] = useState("");
  const [revokeLoading, setRevokeLoading] = useState(false);

  // Create account
  const [newEmail, setNewEmail] = useState("");
  const [newSenha, setNewSenha] = useState("");
  const [newPremium, setNewPremium] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);

  // Notificações
  const [notificacoes, setNotificacoes] = useState<Notificacao[]>([]);
  const [loadingNotif, setLoadingNotif] = useState(false);
  const [notifTitulo, setNotifTitulo] = useState("");
  const [notifMensagem, setNotifMensagem] = useState("");
  const [notifTipo, setNotifTipo] = useState<"info" | "warning" | "success">("info");
  const [sendingNotif, setSendingNotif] = useState(false);

  // Estatísticas
  const [activityData, setActivityData] = useState<Activity[]>([]);
  const [loadingStats, setLoadingStats] = useState(false);
  const [resultadosRedacoes, setResultadosRedacoes] = useState<number>(0);
  const [resultadosProvas, setResultadosProvas] = useState<number>(0);
  const [tempoEstudoTotal, setTempoEstudoTotal] = useState<number>(0);

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
      loadNotificacoes();
      loadEstatisticas();
    };
    checkAdmin();
  }, [navigate]);

  // Realtime vendas
  useEffect(() => {
    const channel = supabase
      .channel("admin-vendas-rt")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "vendas" }, (payload) => {
        setVendas((prev) => [payload.new as Venda, ...prev]);
      })
      .subscribe();
    return () => { supabase.removeChannel(channel); };
  }, []);

  // ── Loaders ──────────────────────────────────────────────────────────────
  const loadUsers = async () => {
    setLoadingUsers(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, email, nome, is_premium, created_at, deleted_at")
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

  const loadNotificacoes = async () => {
    setLoadingNotif(true);
    const { data } = await (supabase as any)
      .from("admin_notifications")
      .select("*")
      .order("created_at", { ascending: false });
    if (data) setNotificacoes(data as Notificacao[]);
    setLoadingNotif(false);
  };

  const loadEstatisticas = async () => {
    setLoadingStats(true);
    const [actRes, redRes, provaRes, tempoRes] = await Promise.all([
      supabase.from("user_activity").select("user_id, date, actions_count").order("date", { ascending: false }).limit(100),
      supabase.from("resultados_redacoes").select("id", { count: "exact" }),
      supabase.from("resultados_provas").select("id", { count: "exact" }),
      supabase.from("tempo_estudo").select("minutos"),
    ]);
    if (actRes.data) setActivityData(actRes.data as Activity[]);
    if (redRes.count != null) setResultadosRedacoes(redRes.count);
    if (provaRes.count != null) setResultadosProvas(provaRes.count);
    if (tempoRes.data) {
      const total = tempoRes.data.reduce((acc: number, r: any) => acc + (r.minutos ?? 0), 0);
      setTempoEstudoTotal(total);
    }
    setLoadingStats(false);
  };

  // ── Actions ──────────────────────────────────────────────────────────────
  const handleGrantPremium = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!grantEmail.trim()) return;
    setGrantLoading(true);
    const { error } = await supabase.from("profiles").update({ is_premium: true }).eq("email", grantEmail.trim().toLowerCase());
    if (error) toast.error("Erro: " + error.message);
    else { toast.success(`✅ Premium concedido para ${grantEmail}`); setGrantEmail(""); loadUsers(); }
    setGrantLoading(false);
  };

  const handleRevokePremium = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!revokeEmail.trim()) return;
    if (PROTECTED_EMAILS.includes(revokeEmail.trim().toLowerCase())) {
      toast.error("Esta conta é protegida e não pode perder o PRO.");
      return;
    }
    setRevokeLoading(true);
    const { error } = await supabase.from("profiles").update({ is_premium: false }).eq("email", revokeEmail.trim().toLowerCase());
    if (error) toast.error("Erro: " + error.message);
    else { toast.success(`❌ Premium revogado de ${revokeEmail}`); setRevokeEmail(""); loadUsers(); }
    setRevokeLoading(false);
  };

  const handleTogglePremium = async (profile: Profile) => {
    if (PROTECTED_EMAILS.includes((profile.email ?? "").toLowerCase()) && profile.is_premium) {
      toast.error("Esta conta é protegida e não pode perder o PRO.");
      return;
    }
    const { error } = await supabase.from("profiles").update({ is_premium: !profile.is_premium }).eq("id", profile.id);
    if (error) toast.error("Erro ao alterar premium");
    else {
      toast.success(profile.is_premium ? `Premium removido de ${profile.email}` : `Premium concedido a ${profile.email}`);
      setUsers((prev) => prev.map((u) => u.id === profile.id ? { ...u, is_premium: !u.is_premium } : u));
    }
  };

  const handleDeleteUser = async (profile: Profile) => {
    if (PROTECTED_EMAILS.includes((profile.email ?? "").toLowerCase())) {
      toast.error("Esta conta é protegida e não pode ser excluída.");
      return;
    }
    if (!confirm(`Tem certeza que deseja EXCLUIR PERMANENTEMENTE a conta de ${profile.email}?\nTodos os dados serão removidos e o email ficará disponível para novo cadastro.`)) return;
    setDeletingUserId(profile.id);
    try {
      const res = await supabase.functions.invoke("admin-delete-user", {
        body: { user_id: profile.id },
      });
      if (res.error) throw new Error(res.error.message);
      const data = res.data as any;
      if (data?.error) throw new Error(data.error);
      toast.success(`🗑️ Conta de ${profile.email} excluída permanentemente`);
      loadUsers();
    } catch (err: any) {
      toast.error("Erro ao excluir: " + (err.message ?? "Falha"));
    }
    setDeletingUserId(null);
  };

  const handleRestoreUser = async (profile: Profile) => {
    const { error } = await supabase.from("profiles").update({ deleted_at: null } as any).eq("id", profile.id);
    if (error) toast.error("Erro ao restaurar: " + error.message);
    else { toast.success(`✅ Conta de ${profile.email} restaurada`); loadUsers(); }
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
      setNewEmail(""); setNewSenha(""); loadUsers();
    } catch (err: any) {
      toast.error("Erro: " + (err.message ?? "Falha ao criar conta"));
    }
    setCreateLoading(false);
  };

  const handleSendNotificacao = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!notifTitulo.trim() || !notifMensagem.trim()) return;
    setSendingNotif(true);
    const { error } = await (supabase as any)
      .from("admin_notifications")
      .insert({ titulo: notifTitulo.trim(), mensagem: notifMensagem.trim(), tipo: notifTipo, created_by: currentEmail });
    if (error) toast.error("Erro ao enviar: " + error.message);
    else {
      toast.success("📢 Aviso enviado para todos os usuários!");
      setNotifTitulo(""); setNotifMensagem(""); loadNotificacoes();
    }
    setSendingNotif(false);
  };

  const handleDeleteNotificacao = async (id: string) => {
    await (supabase as any).from("admin_notifications").delete().eq("id", id);
    toast.success("Aviso removido");
    loadNotificacoes();
  };

  const handleToggleNotificacao = async (notif: Notificacao) => {
    await (supabase as any).from("admin_notifications").update({ ativo: !notif.ativo }).eq("id", notif.id);
    loadNotificacoes();
  };

  // ── Computed ──────────────────────────────────────────────────────────────
  const activeUsers = users.filter((u) => !u.deleted_at);
  const deletedUsers = users.filter((u) => u.deleted_at);
  const filteredUsers = activeUsers.filter((u) =>
    (u.email ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.nome ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPremium = activeUsers.filter((u) => u.is_premium).length;

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

  const vendasAprovadas = vendas.filter(v => APPROVED.includes(v.status ?? ""));
  const vendasReembolso = vendas.filter(v => REFUNDED.includes(v.status ?? ""));
  const vendasPendentes = vendas.filter(v => PENDING.includes(v.status ?? ""));
  const totalReceita    = vendasAprovadas.reduce((a, v) => a + (v.valor ?? 0), 0);
  const totalReembolso  = vendasReembolso.reduce((a, v) => a + (v.valor ?? 0), 0);
  const totalClientes   = new Set(vendas.map(v => v.email_cliente).filter(Boolean)).size;
  const totalAcoes      = activityData.reduce((a, r) => a + r.actions_count, 0);

  const WEBHOOK_URL = `https://${import.meta.env.VITE_SUPABASE_PROJECT_ID}.supabase.co/functions/v1/cakto-webhook`;

  const TABS = [
    { id: "dashboard"     as Tab, label: "Dashboard",    icon: <BarChart3 className="h-4 w-4" /> },
    { id: "usuarios"      as Tab, label: "Usuários",     icon: <Users className="h-4 w-4" /> },
    { id: "vendas"        as Tab, label: "Vendas",       icon: <TrendingUp className="h-4 w-4" /> },
    { id: "notificacoes"  as Tab, label: "Avisos",       icon: <Megaphone className="h-4 w-4" /> },
    { id: "estatisticas"  as Tab, label: "Estatísticas", icon: <Activity className="h-4 w-4" /> },
    { id: "premium"       as Tab, label: "Gerenciar PRO", icon: <Crown className="h-4 w-4" /> },
    { id: "criar"         as Tab, label: "Criar Conta",  icon: <User className="h-4 w-4" /> },
  ];

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
  if (!isAdmin) return null;

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background border-b border-border">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <button onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="h-4 w-4" /> Dashboard
          </button>
          <div className="flex items-center gap-2 font-bold text-foreground">
            <ShieldCheck className="h-5 w-5 text-primary" />
            <span className="hidden sm:inline">Painel de Administração</span>
            <span className="sm:hidden">Admin</span>
          </div>
          <div className="text-xs text-muted-foreground hidden sm:block">{currentEmail}</div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 space-y-6">

        {/* Global stats bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: <Users className="h-4 w-4 text-primary" />, label: "Usuários ativos", value: activeUsers.length, bg: "bg-primary/10" },
            { icon: <Crown className="h-4 w-4 text-amber-600" />, label: "PRO", value: totalPremium, bg: "bg-amber-100 dark:bg-amber-950/30" },
            { icon: <ShoppingBag className="h-4 w-4 text-emerald-600" />, label: "Pedidos", value: vendas.length, bg: "bg-emerald-100 dark:bg-emerald-950/30" },
            { icon: <DollarSign className="h-4 w-4 text-blue-600" />, label: "Receita", value: formatCurrency(totalReceita), bg: "bg-blue-100 dark:bg-blue-950/30" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
              <div className={`inline-flex p-1.5 rounded-lg ${s.bg} mb-2`}>{s.icon}</div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-lg font-extrabold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 border-b border-border overflow-x-auto pb-px">
          {TABS.map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2.5 text-xs sm:text-sm font-semibold border-b-2 whitespace-nowrap transition-colors ${
                tab === t.id ? "border-primary text-primary" : "border-transparent text-muted-foreground hover:text-foreground"
              }`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>

        {/* ── DASHBOARD ── */}
        {tab === "dashboard" && (
          <div className="space-y-5">
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Quick actions */}
              {[
                { label: "Ver Usuários", desc: "Gerenciar contas", icon: <Users className="h-6 w-6 text-primary" />, onClick: () => setTab("usuarios") },
                { label: "Ver Vendas", desc: "Transações Cakto", icon: <TrendingUp className="h-6 w-6 text-emerald-600" />, onClick: () => setTab("vendas") },
                { label: "Enviar Aviso", desc: "Notificar todos", icon: <Megaphone className="h-6 w-6 text-orange-500" />, onClick: () => setTab("notificacoes") },
                { label: "Estatísticas", desc: "Uso da plataforma", icon: <Activity className="h-6 w-6 text-blue-600" />, onClick: () => setTab("estatisticas") },
                { label: "Gerenciar PRO", desc: "Conceder / revogar", icon: <Crown className="h-6 w-6 text-amber-500" />, onClick: () => setTab("premium") },
                { label: "Criar Conta", desc: "Novo usuário", icon: <Shield className="h-6 w-6 text-violet-600" />, onClick: () => setTab("criar") },
              ].map((a) => (
                <button key={a.label} onClick={a.onClick}
                  className="flex items-center gap-4 p-5 rounded-2xl border border-border bg-card hover:bg-muted/30 transition-all text-left group">
                  <div className="shrink-0">{a.icon}</div>
                  <div>
                    <p className="font-bold text-foreground group-hover:text-primary transition-colors">{a.label}</p>
                    <p className="text-xs text-muted-foreground">{a.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            {/* Avisos ativos */}
            {notificacoes.filter(n => n.ativo).length > 0 && (
              <div className="rounded-2xl border border-orange-200 dark:border-orange-900 bg-orange-50/50 dark:bg-orange-950/10 p-5">
                <p className="text-sm font-bold text-orange-700 dark:text-orange-400 mb-3 flex items-center gap-2">
                  <Megaphone className="h-4 w-4" /> Avisos ativos no site ({notificacoes.filter(n => n.ativo).length})
                </p>
                {notificacoes.filter(n => n.ativo).slice(0, 3).map(n => (
                  <div key={n.id} className="text-xs text-orange-700 dark:text-orange-300 mb-1">• <strong>{n.titulo}</strong> — {n.mensagem.substring(0, 60)}...</div>
                ))}
              </div>
            )}

            {/* Contas desativadas */}
            {deletedUsers.length > 0 && (
              <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/10 p-5">
                <p className="text-sm font-bold text-red-600 dark:text-red-400 mb-1 flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4" /> {deletedUsers.length} conta(s) desativada(s)
                </p>
                <p className="text-xs text-muted-foreground">Vá para "Usuários" para ver e restaurar contas desativadas.</p>
              </div>
            )}
          </div>
        )}

        {/* ── USUÁRIOS ── */}
        {tab === "usuarios" && (
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar email ou nome..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="pl-9" />
              </div>
              <Button variant="outline" size="sm" onClick={loadUsers} className="gap-2 shrink-0">
                <RefreshCw className={`h-4 w-4 ${loadingUsers ? "animate-spin" : ""}`} /> Atualizar
              </Button>
              <span className="text-xs text-muted-foreground">{activeUsers.length} ativos · {deletedUsers.length} desativados</span>
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
                      <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Ações</th>
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
                          <div className="flex items-center gap-2">
                            <Button size="sm" variant={u.is_premium ? "outline" : "default"} className="text-xs h-7 px-2"
                              onClick={() => handleTogglePremium(u)}>
                              {u.is_premium ? <><UserX className="h-3 w-3 mr-1" />Remover PRO</> : <><Crown className="h-3 w-3 mr-1" />Dar PRO</>}
                            </Button>
                            <Button size="sm" variant="destructive" className="text-xs h-7 px-2"
                              disabled={deletingUserId === u.id}
                              onClick={() => handleDeleteUser(u)}>
                              {deletingUserId === u.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Contas desativadas */}
            {deletedUsers.length > 0 && (
              <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-card overflow-hidden">
                <div className="px-5 py-3 border-b border-border bg-red-50/50 dark:bg-red-950/10">
                  <p className="text-sm font-bold text-red-600 flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4" /> Contas Desativadas ({deletedUsers.length})
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      {deletedUsers.map((u) => (
                        <tr key={u.id} className="border-b border-border last:border-0 bg-red-50/20 dark:bg-red-950/5">
                          <td className="px-4 py-3 font-mono text-xs text-muted-foreground line-through">{u.email ?? "—"}</td>
                          <td className="px-4 py-3 text-xs text-muted-foreground">
                            Desativado em {u.deleted_at ? new Date(u.deleted_at).toLocaleDateString("pt-BR") : "—"}
                          </td>
                          <td className="px-4 py-3">
                            <Button size="sm" variant="outline" className="text-xs h-7 gap-1" onClick={() => handleRestoreUser(u)}>
                              <RotateCcw className="h-3 w-3" /> Restaurar
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ── VENDAS ── */}
        {tab === "vendas" && (
          <div className="space-y-5">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: <ShoppingBag className="h-5 w-5 text-primary" />, label: "Total Pedidos", value: String(vendas.length), bg: "bg-primary/10" },
                { icon: <DollarSign className="h-5 w-5 text-emerald-600" />, label: "Receita Aprovada", value: formatCurrency(totalReceita), bg: "bg-emerald-100 dark:bg-emerald-950/40" },
                { icon: <RotateCcw className="h-5 w-5 text-red-500" />, label: "Reembolsos", value: `${vendasReembolso.length} · ${formatCurrency(totalReembolso)}`, bg: "bg-red-100 dark:bg-red-950/40" },
                { icon: <Clock className="h-5 w-5 text-yellow-600" />, label: "Pendentes", value: String(vendasPendentes.length), bg: "bg-yellow-100 dark:bg-yellow-950/40" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
                  <div className={`inline-flex p-2 rounded-xl ${s.bg} mb-2`}>{s.icon}</div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-sm font-extrabold text-foreground leading-tight">{s.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
              <div className="flex items-start gap-3">
                <Wifi className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground mb-1">Webhook Cakto</p>
                  <div className="flex items-center gap-2">
                    <code className="text-xs bg-background border border-border rounded-lg px-3 py-1.5 font-mono break-all flex-1">{WEBHOOK_URL}</code>
                    <Button size="sm" variant="outline" className="shrink-0 text-xs"
                      onClick={() => { navigator.clipboard.writeText(WEBHOOK_URL); toast.success("URL copiado!"); }}>Copiar</Button>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <div className="relative flex-1 min-w-[200px] max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Buscar nome, email ou ID..." value={vendaSearch} onChange={(e) => setVendaSearch(e.target.value)} className="pl-9" />
              </div>
              <div className="flex gap-2 flex-wrap">
                {([
                  { id: "all" as StatusFilter, label: "Todos" },
                  { id: "approved" as StatusFilter, label: "✅ Aprovados" },
                  { id: "pending"  as StatusFilter, label: "⏳ Pendentes" },
                  { id: "refunded" as StatusFilter, label: "🔴 Reembolsos" },
                ]).map((f) => (
                  <button key={f.id} onClick={() => setStatusFilter(f.id)}
                    className={`text-xs px-3 py-1.5 rounded-full font-semibold border transition-colors ${
                      statusFilter === f.id ? "bg-primary text-primary-foreground border-primary" : "bg-background border-border text-muted-foreground hover:text-foreground"
                    }`}>{f.label}</button>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={loadVendas} className="gap-2 shrink-0 ml-auto">
                <RefreshCw className={`h-4 w-4 ${loadingVendas ? "animate-spin" : ""}`} /> Atualizar
              </Button>
            </div>

            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              {loadingVendas ? (
                <div className="p-12 text-center flex items-center justify-center gap-2 text-muted-foreground text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" /> Carregando...
                </div>
              ) : filteredVendas.length === 0 ? (
                <div className="p-12 text-center">
                  <ShoppingBag className="h-10 w-10 text-muted-foreground/30 mx-auto mb-3" />
                  <p className="text-sm text-muted-foreground">Nenhuma venda encontrada.</p>
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
                        <tr key={v.id} className={`border-b border-border last:border-0 hover:bg-muted/20 transition-colors ${
                          REFUNDED.includes(v.status ?? "") ? "bg-red-50/30 dark:bg-red-950/5" :
                          i === 0 && APPROVED.includes(v.status ?? "") ? "bg-emerald-50/40 dark:bg-emerald-950/10" : ""
                        }`}>
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
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" /> Tempo real
                  </span>
                </div>
              )}
            </div>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-emerald-50/50 dark:bg-emerald-950/10 p-5">
                <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-400 mb-1">💰 Receita Aprovada</p>
                <p className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-300">{formatCurrency(totalReceita)}</p>
                <p className="text-xs text-muted-foreground mt-1">{vendasAprovadas.length} transações</p>
              </div>
              <div className="rounded-2xl border border-red-200 dark:border-red-900 bg-red-50/50 dark:bg-red-950/10 p-5">
                <p className="text-xs font-semibold text-red-600 dark:text-red-400 mb-1">🔴 Total Reembolsado</p>
                <p className="text-2xl font-extrabold text-red-600 dark:text-red-400">{formatCurrency(totalReembolso)}</p>
                <p className="text-xs text-muted-foreground mt-1">{vendasReembolso.length} reembolsos</p>
              </div>
              <div className="rounded-2xl border border-border bg-card p-5">
                <p className="text-xs font-semibold text-muted-foreground mb-1">👥 Clientes Únicos</p>
                <p className="text-2xl font-extrabold text-foreground">{totalClientes}</p>
                <p className="text-xs text-muted-foreground mt-1">Emails distintos</p>
              </div>
            </div>
          </div>
        )}

        {/* ── AVISOS/NOTIFICAÇÕES ── */}
        {tab === "notificacoes" && (
          <div className="space-y-5">
            <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="inline-flex p-2 rounded-xl bg-orange-100 dark:bg-orange-950/30">
                  <Megaphone className="h-5 w-5 text-orange-500" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Enviar Aviso para Todos</h3>
                  <p className="text-xs text-muted-foreground">O aviso aparecerá no Dashboard de todos os usuários</p>
                </div>
              </div>
              <form onSubmit={handleSendNotificacao} className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Tipo de aviso</label>
                  <div className="flex gap-2 mt-1.5">
                    {([
                      { id: "info" as const, label: "ℹ️ Info", color: "border-blue-400 bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-300" },
                      { id: "warning" as const, label: "⚠️ Alerta", color: "border-yellow-400 bg-yellow-50 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-300" },
                      { id: "success" as const, label: "✅ Sucesso", color: "border-emerald-400 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300" },
                    ]).map((t) => (
                      <button type="button" key={t.id} onClick={() => setNotifTipo(t.id)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-semibold border-2 transition-all ${
                          notifTipo === t.id ? t.color : "border-border bg-background text-muted-foreground"
                        }`}>{t.label}</button>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Título</label>
                  <Input className="mt-1" placeholder="Ex: Manutenção programada" value={notifTitulo} onChange={(e) => setNotifTitulo(e.target.value)} required />
                </div>
                <div>
                  <label className="text-xs font-semibold text-muted-foreground">Mensagem</label>
                  <Textarea className="mt-1" placeholder="Escreva a mensagem que todos os usuários verão..." value={notifMensagem} onChange={(e) => setNotifMensagem(e.target.value)} rows={3} required />
                </div>
                <Button type="submit" className="w-full gap-2" disabled={sendingNotif}>
                  {sendingNotif ? <Loader2 className="h-4 w-4 animate-spin" /> : <Megaphone className="h-4 w-4" />}
                  Enviar Aviso para Todos
                </Button>
              </form>
            </div>

            {/* Lista de avisos */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border flex items-center justify-between">
                <h3 className="font-bold text-foreground">Avisos Publicados</h3>
                <Button variant="ghost" size="sm" onClick={loadNotificacoes} className="gap-1.5 text-xs">
                  <RefreshCw className={`h-3.5 w-3.5 ${loadingNotif ? "animate-spin" : ""}`} /> Atualizar
                </Button>
              </div>
              {notificacoes.length === 0 ? (
                <div className="p-10 text-center text-sm text-muted-foreground">Nenhum aviso enviado ainda.</div>
              ) : (
                <div className="divide-y divide-border">
                  {notificacoes.map((n) => (
                    <div key={n.id} className={`p-5 flex items-start gap-4 ${!n.ativo ? "opacity-50" : ""}`}>
                      <div className={`shrink-0 text-lg`}>
                        {n.tipo === "warning" ? "⚠️" : n.tipo === "success" ? "✅" : "ℹ️"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-bold text-sm text-foreground">{n.titulo}</p>
                          <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${n.ativo ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400" : "bg-muted text-muted-foreground"}`}>
                            {n.ativo ? "Ativo" : "Inativo"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{n.mensagem}</p>
                        <p className="text-xs text-muted-foreground">{formatDate(n.created_at)}</p>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <button onClick={() => handleToggleNotificacao(n)}
                          className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors ${n.ativo ? "bg-emerald-500" : "bg-muted-foreground/30"}`}>
                          <span className={`inline-block h-3 w-3 rounded-full bg-white shadow transition-transform ${n.ativo ? "translate-x-5" : "translate-x-1"}`} />
                        </button>
                        <button onClick={() => handleDeleteNotificacao(n.id)} className="text-destructive hover:text-destructive/80 transition-colors">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── ESTATÍSTICAS ── */}
        {tab === "estatisticas" && (
          <div className="space-y-5">
            <div className="flex items-center justify-between">
              <h2 className="font-bold text-foreground">Estatísticas de Uso</h2>
              <Button variant="outline" size="sm" onClick={loadEstatisticas} className="gap-2">
                <RefreshCw className={`h-4 w-4 ${loadingStats ? "animate-spin" : ""}`} /> Atualizar
              </Button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[
                { icon: <Users className="h-5 w-5 text-primary" />, label: "Usuários ativos", value: activeUsers.length, sub: `${totalPremium} PRO`, bg: "bg-primary/10" },
                { icon: <Activity className="h-5 w-5 text-blue-600" />, label: "Ações registradas", value: totalAcoes.toLocaleString("pt-BR"), sub: "Últimos dados", bg: "bg-blue-100 dark:bg-blue-950/30" },
                { icon: <PenTool className="h-5 w-5 text-violet-600" />, label: "Redações corrigidas", value: resultadosRedacoes, sub: "Total histórico", bg: "bg-violet-100 dark:bg-violet-950/30" },
                { icon: <BookOpen className="h-5 w-5 text-emerald-600" />, label: "Provas realizadas", value: resultadosProvas, sub: "Total histórico", bg: "bg-emerald-100 dark:bg-emerald-950/30" },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-border bg-card p-5">
                  <div className={`inline-flex p-2 rounded-xl ${s.bg} mb-3`}>{s.icon}</div>
                  <p className="text-xs text-muted-foreground">{s.label}</p>
                  <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
                  <p className="text-xs text-muted-foreground mt-1">{s.sub}</p>
                </div>
              ))}
            </div>

            {/* Tempo de estudo */}
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex p-2 rounded-xl bg-amber-100 dark:bg-amber-950/30">
                    <Clock className="h-5 w-5 text-amber-600" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Tempo Total de Estudo</p>
                    <p className="text-xs text-muted-foreground">Soma de todos os usuários</p>
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-foreground">{Math.floor(tempoEstudoTotal / 60)}h</p>
                <p className="text-xs text-muted-foreground mt-1">{tempoEstudoTotal} minutos no total</p>
              </div>

              <div className="rounded-2xl border border-border bg-card p-5">
                <div className="flex items-center gap-3 mb-4">
                  <div className="inline-flex p-2 rounded-xl bg-emerald-100 dark:bg-emerald-950/30">
                    <TrendingUp className="h-5 w-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Taxa de Conversão</p>
                    <p className="text-xs text-muted-foreground">Free → PRO</p>
                  </div>
                </div>
                <p className="text-3xl font-extrabold text-foreground">
                  {activeUsers.length > 0 ? Math.round((totalPremium / activeUsers.length) * 100) : 0}%
                </p>
                <p className="text-xs text-muted-foreground mt-1">{totalPremium} de {activeUsers.length} usuários são PRO</p>
              </div>
            </div>

            {/* Atividade recente */}
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="px-5 py-3 border-b border-border">
                <h3 className="font-bold text-foreground">Atividade Recente por Usuário</h3>
              </div>
              {activityData.length === 0 ? (
                <div className="p-10 text-center text-sm text-muted-foreground">Sem dados de atividade ainda.</div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/30">
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">User ID</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Data</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Ações</th>
                        <th className="px-4 py-3 text-left text-xs font-semibold text-muted-foreground">Engajamento</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activityData.slice(0, 20).map((a, i) => (
                        <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors">
                          <td className="px-4 py-2 text-xs font-mono text-muted-foreground">{a.user_id.substring(0, 16)}...</td>
                          <td className="px-4 py-2 text-xs text-muted-foreground whitespace-nowrap">
                            {new Date(a.date).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="px-4 py-2 font-bold text-foreground">{a.actions_count}</td>
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-2">
                              <div className="h-1.5 bg-muted rounded-full flex-1 max-w-24 overflow-hidden">
                                <div className="h-full bg-primary rounded-full transition-all"
                                  style={{ width: `${Math.min((a.actions_count / 50) * 100, 100)}%` }} />
                              </div>
                              <span className="text-xs text-muted-foreground">{a.actions_count >= 50 ? "Alto" : a.actions_count >= 20 ? "Médio" : "Baixo"}</span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PREMIUM ── */}
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
                  <Input placeholder="email@exemplo.com" type="email" value={grantEmail} onChange={(e) => setGrantEmail(e.target.value)} className="pl-9" required />
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
                  <Input placeholder="email@exemplo.com" type="email" value={revokeEmail} onChange={(e) => setRevokeEmail(e.target.value)} className="pl-9" required />
                </div>
                <Button type="submit" variant="destructive" className="w-full gap-2" disabled={revokeLoading}>
                  {revokeLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  Revogar Acesso PRO
                </Button>
              </form>
            </div>
          </div>
        )}

        {/* ── CRIAR CONTA ── */}
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
                  <Input type="email" placeholder="email@exemplo.com" value={newEmail} onChange={(e) => setNewEmail(e.target.value)} required />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-semibold text-muted-foreground">Senha</label>
                  <Input type="password" placeholder="Senha de acesso" value={newSenha} onChange={(e) => setNewSenha(e.target.value)} required minLength={6} />
                </div>
                <div className="flex items-center gap-3 py-2">
                  <button type="button" onClick={() => setNewPremium((v) => !v)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${newPremium ? "bg-amber-500" : "bg-muted-foreground/30"}`}>
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

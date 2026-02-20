import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Shield, ArrowLeft, Users, TrendingUp, Crown, UserX,
  Search, RefreshCw, CheckCircle2, XCircle, Mail, Loader2,
  BarChart3, ShieldCheck, User, Trash2,
} from "lucide-react";

type Profile = {
  id: string;
  email: string | null;
  nome: string | null;
  is_premium: boolean;
  created_at: string | null;
};

const ADMIN_EMAILS = [
  "jmatiassanmiguel1@gmail.com",
  "noahgodinhocastellobranco@gmail.com",
];

export default function Admin() {
  const navigate = useNavigate();
  const [currentEmail, setCurrentEmail] = useState<string | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  // Users tab
  const [users, setUsers] = useState<Profile[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loadingUsers, setLoadingUsers] = useState(false);

  // Grant premium
  const [grantEmail, setGrantEmail] = useState("");
  const [grantLoading, setGrantLoading] = useState(false);

  // Revoke premium
  const [revokeEmail, setRevokeEmail] = useState("");
  const [revokeLoading, setRevokeLoading] = useState(false);

  // Create account
  const [newEmail, setNewEmail] = useState("");
  const [newSenha, setNewSenha] = useState("");
  const [newPremium, setNewPremium] = useState(true);
  const [createLoading, setCreateLoading] = useState(false);

  // Tab
  const [tab, setTab] = useState<"usuarios" | "premium" | "criar">("usuarios");

  useEffect(() => {
    const checkAdmin = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { navigate("/auth"); return; }

      // Check admin via DB role
      const { data } = await supabase
        .from("user_roles" as any)
        .select("role")
        .eq("user_id", user.id)
        .eq("role", "admin")
        .maybeSingle();

      if (!data) {
        navigate("/dashboard");
        return;
      }

      setIsAdmin(true);
      setCurrentEmail(user.email ?? null);
      setLoading(false);
      loadUsers();
    };
    checkAdmin();
  }, [navigate]);

  const loadUsers = async () => {
    setLoadingUsers(true);
    const { data } = await supabase
      .from("profiles")
      .select("id, email, nome, is_premium, created_at")
      .order("created_at", { ascending: false });
    if (data) setUsers(data as Profile[]);
    setLoadingUsers(false);
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

  const filtered = users.filter((u) =>
    (u.email ?? "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (u.nome ?? "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPremium = users.filter((u) => u.is_premium).length;

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

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { icon: <Users className="h-5 w-5 text-primary" />, label: "Total de Usuários", value: users.length, bg: "bg-primary/10" },
            { icon: <Crown className="h-5 w-5 text-amber-600" />, label: "Usuários PRO", value: totalPremium, bg: "bg-amber-100 dark:bg-amber-950/30" },
            { icon: <User className="h-5 w-5 text-muted-foreground" />, label: "Usuários Free", value: users.length - totalPremium, bg: "bg-muted" },
            { icon: <TrendingUp className="h-5 w-5 text-emerald-600" />, label: "Taxa Conversão", value: users.length > 0 ? `${Math.round((totalPremium / users.length) * 100)}%` : "0%", bg: "bg-emerald-100 dark:bg-emerald-950/30" },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl border border-border bg-card p-4">
              <div className={`inline-flex p-2 rounded-xl ${s.bg} mb-2`}>{s.icon}</div>
              <p className="text-xs text-muted-foreground">{s.label}</p>
              <p className="text-2xl font-extrabold text-foreground">{s.value}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-border">
          {([
            { id: "usuarios", label: "Usuários", icon: <Users className="h-4 w-4" /> },
            { id: "premium", label: "Gerenciar Premium", icon: <Crown className="h-4 w-4" /> },
            { id: "criar", label: "Criar Conta", icon: <User className="h-4 w-4" /> },
          ] as const).map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-semibold border-b-2 transition-colors ${
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
                    {filtered.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-10 text-center text-muted-foreground text-sm">
                          {loadingUsers ? "Carregando..." : "Nenhum usuário encontrado."}
                        </td>
                      </tr>
                    ) : (
                      filtered.map((u) => (
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
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ── TAB PREMIUM ── */}
        {tab === "premium" && (
          <div className="grid sm:grid-cols-2 gap-5">
            {/* Grant */}
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

            {/* Revoke */}
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

            {/* Link to Vendas */}
            <div className="rounded-2xl border border-primary/20 bg-primary/5 p-6 space-y-4 sm:col-span-2">
              <div className="flex items-center gap-3">
                <div className="inline-flex p-2 rounded-xl bg-primary/10">
                  <BarChart3 className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-foreground">Painel de Vendas</h3>
                  <p className="text-xs text-muted-foreground">Veja todas as transações em tempo real da Cakto</p>
                </div>
              </div>
              <Button className="gap-2" onClick={() => navigate("/vendas")}>
                <TrendingUp className="h-4 w-4" />
                Ver Vendas em Tempo Real
              </Button>
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

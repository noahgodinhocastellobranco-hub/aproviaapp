import { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ArrowLeft, Settings, User, Camera, Mail, Key, Bell,
  Shield, LogOut, Sparkles, Loader2, Pencil, Check, X, CreditCard, Rocket, TrendingUp,
} from "lucide-react";

const ADMIN_EMAILS = [
  "jmatiassanmiguel1@gmail.com",
  "noahgodinhocastellobranco@gmail.com",
];

type Profile = {
  id: string;
  nome: string | null;
  email: string | null;
  created_at: string | null;
};

export default function Configuracoes() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingNome, setEditingNome] = useState(false);
  const [nomeValue, setNomeValue] = useState("");
  const [savingNome, setSavingNome] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [changingEmail, setChangingEmail] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [sendingReset, setSendingReset] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/auth"); return; }

    const { data } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", user.id)
      .single();

    if (data) {
      setProfile(data);
      setNomeValue(data.nome ?? "");

      // Load avatar
      const { data: files } = await supabase.storage
        .from("avatars")
        .list(`${user.id}`);
      if (files && files.length > 0) {
        const { data: urlData } = supabase.storage
          .from("avatars")
          .getPublicUrl(`${user.id}/${files[0].name}`);
        setAvatarUrl(urlData.publicUrl);
      }
    }
    setLoading(false);
  };

  const handleAvatarClick = () => fileInputRef.current?.click();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile) return;
    if (file.size > 2 * 1024 * 1024) { toast.error("Imagem muito grande. Máximo 2MB."); return; }

    setUploadingAvatar(true);
    const ext = file.name.split(".").pop();
    const path = `${profile.id}/avatar.${ext}`;

    const { error } = await supabase.storage
      .from("avatars")
      .upload(path, file, { upsert: true });

    if (error) {
      toast.error("Erro ao fazer upload da foto");
    } else {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(data.publicUrl + `?t=${Date.now()}`);
      toast.success("Foto atualizada!");
    }
    setUploadingAvatar(false);
  };

  const handleSaveNome = async () => {
    if (!profile || !nomeValue.trim()) return;
    setSavingNome(true);
    const { error } = await supabase
      .from("profiles")
      .update({ nome: nomeValue.trim() })
      .eq("id", profile.id);

    if (error) {
      toast.error("Erro ao salvar nome");
    } else {
      setProfile((p) => p ? { ...p, nome: nomeValue.trim() } : p);
      toast.success("Nome atualizado!");
      setEditingNome(false);
    }
    setSavingNome(false);
  };

  const handleChangeEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail.trim()) return;
    const { error } = await supabase.auth.updateUser({ email: newEmail.trim() });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Confirme o novo email no link enviado para " + newEmail);
      setChangingEmail(false);
      setNewEmail("");
    }
  };

  const handleResetPassword = async () => {
    if (!profile?.email) return;
    setSendingReset(true);
    const { error } = await supabase.auth.resetPasswordForEmail(profile.email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Email de redefinição de senha enviado!");
    }
    setSendingReset(false);
  };

  const handleSignOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    navigate("/");
  };

  const formatDate = (iso: string | null) => {
    if (!iso) return "—";
    return new Date(iso).toLocaleDateString("pt-BR");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <div className="flex items-center justify-between px-6 pt-6 pb-4 max-w-3xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </button>
        <div className="flex items-center gap-2 text-foreground font-semibold">
          <Settings className="h-5 w-5 text-primary" />
          Configurações
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 pb-16 space-y-4">

        {/* ─── PERFIL ─── */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="inline-flex p-2 rounded-xl bg-primary/10">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Perfil</h2>
              <p className="text-xs text-muted-foreground">Informações da sua conta</p>
            </div>
          </div>

          {/* Avatar */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative cursor-pointer group" onClick={handleAvatarClick}>
              <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-border">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <User className="h-10 w-10 text-primary/50" />
                )}
              </div>
              <div className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-1.5 shadow-md group-hover:scale-110 transition-transform">
                {uploadingAvatar ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Camera className="h-3.5 w-3.5" />
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Adicione uma foto de perfil</p>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleAvatarChange}
            />
          </div>

          {/* Info rows */}
          <div className="divide-y divide-border">
            {/* Email */}
            <div className="py-4">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Email</p>
              <p className="text-sm text-foreground">{profile?.email ?? "—"}</p>
            </div>

            {/* Nome */}
            <div className="py-4">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Nome de exibição</p>
              {editingNome ? (
                <div className="flex items-center gap-2 mt-1">
                  <Input
                    value={nomeValue}
                    onChange={(e) => setNomeValue(e.target.value)}
                    className="h-8 text-sm max-w-xs"
                    autoFocus
                    maxLength={100}
                  />
                  <button onClick={handleSaveNome} disabled={savingNome} className="text-primary hover:text-primary/80 transition-colors">
                    {savingNome ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
                  </button>
                  <button onClick={() => { setEditingNome(false); setNomeValue(profile?.nome ?? ""); }} className="text-muted-foreground hover:text-foreground transition-colors">
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  <p className="text-sm text-foreground">{profile?.nome || "Não definido"}</p>
                  <button
                    onClick={() => setEditingNome(true)}
                    className="text-xs text-primary font-semibold hover:underline flex items-center gap-1"
                  >
                    <Pencil className="h-3 w-3" /> Editar
                  </button>
                </div>
              )}
            </div>

            {/* Conta criada em */}
            <div className="py-4">
              <p className="text-xs font-semibold text-muted-foreground mb-1">Conta criada em</p>
              <p className="text-sm text-foreground">{formatDate(profile?.created_at ?? null)}</p>
            </div>
          </div>

          {/* Alterar Email */}
          {changingEmail ? (
            <form onSubmit={handleChangeEmail} className="mt-4 space-y-2">
              <Input
                type="email"
                placeholder="Novo email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                required
                className="h-10"
              />
              <div className="flex gap-2">
                <Button type="submit" size="sm" className="flex-1">Confirmar</Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setChangingEmail(false)}>Cancelar</Button>
              </div>
            </form>
          ) : (
            <Button
              variant="outline"
              className="w-full mt-4 gap-2 h-11 rounded-xl"
              onClick={() => setChangingEmail(true)}
            >
              <Mail className="h-4 w-4" />
              Alterar Email
            </Button>
          )}
        </div>

        {/* ─── ACESSAR APLICATIVO ─── */}
        <div className="rounded-2xl border-2 border-primary bg-primary/5 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex p-2 rounded-xl bg-primary/10">
              <Rocket className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Acessar Aplicativo</h2>
              <p className="text-xs text-muted-foreground">Entre no app e comece a estudar</p>
            </div>
          </div>
          <Button className="w-full h-11 rounded-xl font-bold gap-2" onClick={() => navigate("/chat")}>
            <Sparkles className="h-4 w-4" />
            Comece a Estudar
          </Button>
        </div>

        {/* ─── ASSINATURA ─── */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="inline-flex p-2 rounded-xl bg-primary/10">
              <CreditCard className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Assinatura</h2>
              <p className="text-xs text-muted-foreground">Gerencie seu plano</p>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold text-muted-foreground mb-1">Status</p>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-muted-foreground inline-block" />
                <span className="text-sm text-foreground">Inativo</span>
              </div>
            </div>
            <Button size="sm" className="rounded-lg px-5 font-bold" onClick={() => navigate("/precos")}>
              Assinar Agora
            </Button>
          </div>
        </div>

        {/* ─── VENDAS (apenas admins) ─── */}
        {ADMIN_EMAILS.includes(profile?.email ?? "") && (
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="inline-flex p-2 rounded-xl bg-primary/10">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h2 className="font-bold text-foreground">Vendas em Tempo Real</h2>
                <p className="text-xs text-muted-foreground">Acompanhe os pagamentos da Cakto</p>
              </div>
            </div>
            <Button
              variant="outline"
              className="w-full h-11 rounded-xl gap-2"
              onClick={() => navigate("/vendas")}
            >
              <TrendingUp className="h-4 w-4" />
              Ver Painel de Vendas
            </Button>
          </div>
        )}

        {/* ─── ALTERAR SENHA ─── */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="inline-flex p-2 rounded-xl bg-primary/10">
              <Key className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Alterar Senha</h2>
              <p className="text-xs text-muted-foreground">Atualize sua senha de acesso</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full h-11 rounded-xl gap-2"
            onClick={handleResetPassword}
            disabled={sendingReset}
          >
            {sendingReset ? <Loader2 className="h-4 w-4 animate-spin" /> : <Key className="h-4 w-4" />}
            Alterar Senha
          </Button>
        </div>

        {/* ─── NOTIFICAÇÕES ─── */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex p-2 rounded-xl bg-primary/10">
              <Bell className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Notificações</h2>
              <p className="text-xs text-muted-foreground">Preferências de comunicação</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground">
            As notificações serão enviadas para o email cadastrado.
          </p>
        </div>

        {/* ─── SEGURANÇA ─── */}
        <div className="rounded-2xl border border-border bg-card p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="inline-flex p-2 rounded-xl bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="font-bold text-foreground">Segurança</h2>
              <p className="text-xs text-muted-foreground">Configurações de segurança da conta</p>
            </div>
          </div>
          <Button
            variant="outline"
            className="w-full h-11 rounded-xl gap-2 text-destructive border-destructive/30 hover:bg-destructive/5 hover:border-destructive"
            onClick={handleSignOut}
            disabled={signingOut}
          >
            {signingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            Sair da Conta
          </Button>
        </div>

      </div>
    </div>
  );
}

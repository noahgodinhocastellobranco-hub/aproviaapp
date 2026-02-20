import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  ArrowLeft, Settings, User, Camera, Mail, Key, Bell,
  Shield, LogOut, Sparkles, Loader2, Pencil, Check, X, CreditCard, Rocket, TrendingUp,
  Send, Lock,
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

// ── Fluxo de verificação por código ──────────────────────────────────────────
type VerifStep = "idle" | "input" | "code" | "newvalue";

function useVerification(type: "password" | "email") {
  const [step, setStep] = useState<VerifStep>("idle");
  const [inputValue, setInputValue] = useState(""); // novo email ou vazio
  const [code, setCode] = useState("");
  const [newPass, setNewPass] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => {
    setStep("idle");
    setInputValue("");
    setCode("");
    setNewPass("");
    setConfirmPass("");
    setLoading(false);
  };

  // Passo 1: solicitar envio do código
  const sendCode = async (newEmail?: string) => {
    setLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) { toast.error("Sessão expirada. Faça login novamente."); return; }

      const body: Record<string, string> = { type };
      if (type === "email" && newEmail) body.new_email = newEmail;

      const res = await fetch(
        `https://yecfogakgyszdkipzelm.supabase.co/functions/v1/enviar-codigo-verificacao`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify(body),
        }
      );
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Erro ao enviar código");

      toast.success("Código enviado para o seu email!");
      setStep("code");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao enviar código");
    } finally {
      setLoading(false);
    }
  };

  // Passo 2: verificar código no banco
  const verifyCode = async (): Promise<boolean> => {
    if (code.length !== 4) { toast.error("Digite o código de 4 dígitos"); return false; }
    setLoading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return false;

      const { data, error } = await supabase
        .from("verification_codes")
        .select("*")
        .eq("user_id", user.id)
        .eq("type", type)
        .eq("code", code)
        .is("used_at", null)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1)
        .single();

      if (error || !data) {
        toast.error("Código inválido ou expirado");
        return false;
      }

      // Marcar como usado
      await supabase
        .from("verification_codes")
        .update({ used_at: new Date().toISOString() })
        .eq("id", data.id);

      return true;
    } catch {
      toast.error("Erro ao verificar código");
      return false;
    } finally {
      setLoading(false);
    }
  };

  // Passo 3: aplicar mudança
  const applyChange = async (newEmail?: string): Promise<boolean> => {
    setLoading(true);
    try {
      if (type === "password") {
        if (!newPass || newPass.length < 6) { toast.error("Senha deve ter pelo menos 6 caracteres"); return false; }
        if (newPass !== confirmPass) { toast.error("As senhas não coincidem"); return false; }
        const { error } = await supabase.auth.updateUser({ password: newPass });
        if (error) throw error;
        toast.success("Senha alterada com sucesso!");
      } else {
        if (!newEmail) return false;
        const { error } = await supabase.auth.updateUser({ email: newEmail });
        if (error) throw error;
        toast.success("Email alterado! Verifique seu novo email para confirmar.");
      }
      return true;
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Erro ao aplicar alteração");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    step, setStep,
    inputValue, setInputValue,
    code, setCode,
    newPass, setNewPass,
    confirmPass, setConfirmPass,
    loading,
    reset, sendCode, verifyCode, applyChange,
  };
}

// ── Componente de campo de código 4 dígitos ──────────────────────────────────
function CodeInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const digits = value.padEnd(4, " ").split("").slice(0, 4);
  const refs = [useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null), useRef<HTMLInputElement>(null)];

  const handleKey = (i: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace") {
      const arr = value.split("");
      if (arr[i]) {
        arr[i] = "";
      } else if (i > 0) {
        arr[i - 1] = "";
        refs[i - 1].current?.focus();
      }
      onChange(arr.join("").replace(/\s/g, ""));
    }
  };

  const handleChange = (i: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value.replace(/\D/g, "").slice(-1);
    const arr = value.padEnd(4, "").split("").slice(0, 4);
    arr[i] = val;
    const joined = arr.join("").replace(/ /g, "");
    onChange(joined);
    if (val && i < 3) refs[i + 1].current?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    onChange(pasted);
    e.preventDefault();
  };

  return (
    <div className="flex gap-3 justify-center" onPaste={handlePaste}>
      {[0, 1, 2, 3].map((i) => (
        <input
          key={i}
          ref={refs[i]}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digits[i]?.trim() || ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          className="w-14 h-14 text-center text-2xl font-bold rounded-xl border-2 border-border bg-background text-foreground focus:border-primary focus:outline-none transition-colors"
        />
      ))}
    </div>
  );
}

// ── Bloco de Alteração de Senha ───────────────────────────────────────────────
function AlterarSenhaBlock() {
  const v = useVerification("password");

  const handleSendCode = async () => {
    await v.sendCode();
  };

  const handleVerifyAndNext = async () => {
    const ok = await v.verifyCode();
    if (ok) v.setStep("newvalue");
  };

  const handleApply = async () => {
    const ok = await v.applyChange();
    if (ok) v.reset();
  };

  return (
    <div className="rounded-2xl border border-border bg-card p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="inline-flex p-2 rounded-xl bg-primary/10">
          <Key className="h-5 w-5 text-primary" />
        </div>
        <div>
          <h2 className="font-bold text-foreground">Alterar Senha</h2>
          <p className="text-xs text-muted-foreground">Verificação por código enviado ao seu email</p>
        </div>
      </div>

      {v.step === "idle" && (
        <Button
          variant="outline"
          className="w-full h-11 rounded-xl gap-2"
          onClick={handleSendCode}
          disabled={v.loading}
        >
          {v.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          Enviar código de verificação
        </Button>
      )}

      {v.step === "code" && (
        <div className="space-y-5">
          <p className="text-sm text-muted-foreground text-center">
            Digite o código de 4 dígitos enviado ao seu email:
          </p>
          <CodeInput value={v.code} onChange={v.setCode} />
          <div className="flex gap-2">
            <Button className="flex-1 h-11 rounded-xl" onClick={handleVerifyAndNext} disabled={v.loading || v.code.length < 4}>
              {v.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Confirmar Código
            </Button>
            <Button variant="outline" className="h-11 rounded-xl px-4" onClick={v.reset}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <button
            className="text-xs text-primary hover:underline w-full text-center"
            onClick={() => v.sendCode()}
            disabled={v.loading}
          >
            Reenviar código
          </button>
        </div>
      )}

      {v.step === "newvalue" && (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Código verificado! Defina sua nova senha:</p>
          <Input
            type="password"
            placeholder="Nova senha (mínimo 6 caracteres)"
            value={v.newPass}
            onChange={(e) => v.setNewPass(e.target.value)}
            className="h-11"
            autoFocus
          />
          <Input
            type="password"
            placeholder="Confirmar nova senha"
            value={v.confirmPass}
            onChange={(e) => v.setConfirmPass(e.target.value)}
            className="h-11"
          />
          <div className="flex gap-2">
            <Button className="flex-1 h-11 rounded-xl" onClick={handleApply} disabled={v.loading}>
              {v.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Lock className="h-4 w-4" />}
              Salvar Senha
            </Button>
            <Button variant="outline" className="h-11 rounded-xl px-4" onClick={v.reset}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Bloco de Alteração de Email ───────────────────────────────────────────────
function AlterarEmailBlock({ currentEmail }: { currentEmail: string | null }) {
  const v = useVerification("email");

  const handleSendCode = async () => {
    if (!v.inputValue.trim()) { toast.error("Digite o novo email"); return; }
    await v.sendCode(v.inputValue.trim());
  };

  const handleVerifyAndApply = async () => {
    const ok = await v.verifyCode();
    if (ok) {
      const applied = await v.applyChange(v.inputValue.trim());
      if (applied) v.reset();
    }
  };

  return (
    <div>
      {v.step === "idle" && (
        <Button
          variant="outline"
          className="w-full mt-4 gap-2 h-11 rounded-xl"
          onClick={() => v.setStep("input")}
        >
          <Mail className="h-4 w-4" />
          Alterar Email
        </Button>
      )}

      {v.step === "input" && (
        <div className="mt-4 space-y-2">
          <p className="text-xs text-muted-foreground">Email atual: <span className="text-foreground">{currentEmail}</span></p>
          <Input
            type="email"
            placeholder="Novo email"
            value={v.inputValue}
            onChange={(e) => v.setInputValue(e.target.value)}
            className="h-11"
            autoFocus
          />
          <div className="flex gap-2">
            <Button className="flex-1 h-10 rounded-xl" onClick={handleSendCode} disabled={v.loading}>
              {v.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              Enviar código
            </Button>
            <Button variant="outline" className="h-10 rounded-xl px-4" onClick={v.reset}>
              Cancelar
            </Button>
          </div>
        </div>
      )}

      {v.step === "code" && (
        <div className="mt-4 space-y-5">
          <p className="text-sm text-muted-foreground text-center">
            Digite o código enviado para <strong>{v.inputValue}</strong>:
          </p>
          <CodeInput value={v.code} onChange={v.setCode} />
          <div className="flex gap-2">
            <Button className="flex-1 h-11 rounded-xl" onClick={handleVerifyAndApply} disabled={v.loading || v.code.length < 4}>
              {v.loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}
              Confirmar e Alterar Email
            </Button>
            <Button variant="outline" className="h-11 rounded-xl px-4" onClick={v.reset}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <button
            className="text-xs text-primary hover:underline w-full text-center"
            onClick={() => v.sendCode(v.inputValue.trim())}
            disabled={v.loading}
          >
            Reenviar código
          </button>
        </div>
      )}
    </div>
  );
}

// ── Página principal ──────────────────────────────────────────────────────────
export default function Configuracoes() {
  const navigate = useNavigate();

  const [profile, setProfile] = useState<Profile | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [editingNome, setEditingNome] = useState(false);
  const [nomeValue, setNomeValue] = useState("");
  const [savingNome, setSavingNome] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [signingOut, setSigningOut] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { loadProfile(); }, []);

  const loadProfile = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) { navigate("/auth"); return; }

    const { data } = await supabase.from("profiles").select("*").eq("id", user.id).single();
    if (data) {
      setProfile(data);
      setNomeValue(data.nome ?? "");

      const { data: files } = await supabase.storage.from("avatars").list(`${user.id}`);
      if (files && files.length > 0) {
        const { data: urlData } = supabase.storage.from("avatars").getPublicUrl(`${user.id}/${files[0].name}`);
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
    const { error } = await supabase.storage.from("avatars").upload(path, file, { upsert: true });
    if (error) { toast.error("Erro ao fazer upload da foto"); } else {
      const { data } = supabase.storage.from("avatars").getPublicUrl(path);
      setAvatarUrl(data.publicUrl + `?t=${Date.now()}`);
      toast.success("Foto atualizada!");
    }
    setUploadingAvatar(false);
  };

  const handleSaveNome = async () => {
    if (!profile || !nomeValue.trim()) return;
    setSavingNome(true);
    const { error } = await supabase.from("profiles").update({ nome: nomeValue.trim() }).eq("id", profile.id);
    if (error) { toast.error("Erro ao salvar nome"); } else {
      setProfile((p) => p ? { ...p, nome: nomeValue.trim() } : p);
      toast.success("Nome atualizado!");
      setEditingNome(false);
    }
    setSavingNome(false);
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
                {uploadingAvatar ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2">Adicione uma foto de perfil</p>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
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
                  <Input value={nomeValue} onChange={(e) => setNomeValue(e.target.value)} className="h-8 text-sm max-w-xs" autoFocus maxLength={100} />
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
                  <button onClick={() => setEditingNome(true)} className="text-xs text-primary font-semibold hover:underline flex items-center gap-1">
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
          <AlterarEmailBlock currentEmail={profile?.email ?? null} />
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
            <Button variant="outline" className="w-full h-11 rounded-xl gap-2" onClick={() => navigate("/vendas")}>
              <TrendingUp className="h-4 w-4" />
              Ver Painel de Vendas
            </Button>
          </div>
        )}

        {/* ─── ALTERAR SENHA ─── */}
        <AlterarSenhaBlock />

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

import { useEffect, useMemo, useState } from "react";
import { Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "sonner";
import { ArrowLeft, Brain, Eye, EyeOff, KeyRound, Loader2, Lock, Mail, Sparkles, User } from "lucide-react";

type Mode = "login" | "signup" | "forgot" | "verify";

export default function Auth() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const [mode, setMode] = useState<Mode>((location.state as { requireOtp?: boolean })?.requireOtp ? "verify" : "login");
  const [verifyPurpose, setVerifyPurpose] = useState<"signup" | "reset">("signup");
  const [email, setEmail] = useState((location.state as { email?: string })?.email || "");
  const [nome, setNome] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const next = searchParams.get("next") || "/";

  const subtitle = useMemo(() => {
    if (mode === "signup") return "Crie sua conta e confirme o código enviado ao email.";
    if (mode === "forgot") return "Troque sua senha por código, direto no site.";
    if (mode === "verify") return "Digite o código de 4 dígitos enviado para seu email.";
    return "Entre para continuar seus estudos no AprovI.A.";
  }, [mode]);

  const redirectAfterLogin = async (userId: string) => {
    const { data: profile } = await supabase.from("profiles").select("is_premium,email_verified").eq("id", userId).maybeSingle();
    if (!profile?.email_verified) {
      setVerifyPurpose("signup");
      setMode("verify");
      await sendSignupCode(false);
      return;
    }
    if (next !== "/") navigate(next, { replace: true });
    else navigate(profile?.is_premium ? "/dashboard" : "/precos", { replace: true });
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && mode !== "verify") redirectAfterLogin(session.user.id);
    });
  }, []);

  const sendSignupCode = async (showToast = true) => {
    const { data, error } = await supabase.functions.invoke("enviar-codigo-otp", {
      body: { type: "signup_verify", email },
    });
    if (error) {
      if (showToast) toast.error("Não foi possível enviar o código.");
      return false;
    }
    if (showToast) toast.success("Código enviado para seu email.");
    if (data?.fallbackCode) toast.info(`Código de teste: ${data.fallbackCode}`);
    return true;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    setLoading(false);
    if (error) {
      toast.error(error.message.includes("Invalid") ? "Email ou senha incorretos." : error.message);
      return;
    }
    if (data.user) redirectAfterLogin(data.user.id);
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("As senhas não conferem.");
      return;
    }
    setLoading(true);
    const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { nome }, emailRedirectTo: window.location.origin } });
    setLoading(false);
    if (error) {
      toast.error(error.message.includes("already") ? "Este email já está cadastrado." : error.message);
      return;
    }
    if (data.user) {
      await supabase.from("profiles").upsert({ id: data.user.id, email, nome, email_verified: false }, { onConflict: "id" });
      await sendSignupCode();
      setVerifyPurpose("signup");
      setMode("verify");
    }
  };

  const verifySignupCode = async () => {
    setLoading(true);
    const { error } = await supabase.functions.invoke("enviar-codigo-otp", { body: { action: "verify", type: "signup_verify", code, email } });
    setLoading(false);
    if (error) {
      toast.error("Código inválido ou expirado.");
      return;
    }
    toast.success("Email verificado com sucesso!");
    await supabase.functions.invoke("enviar-boas-vindas", { body: { email, nome } }).catch(() => null);
    navigate("/precos?checkout=1", { replace: true });
  };

  const sendResetCode = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const { data, error } = await supabase.functions.invoke("resetar-senha", { body: { email } });
    setLoading(false);
    if (error) toast.error("Não foi possível enviar o código.");
    else {
      toast.success("Código enviado para seu email.");
      if (data?.fallbackCode) toast.info(`Código de teste: ${data.fallbackCode}`);
      setVerifyPurpose("reset");
      setMode("verify");
    }
  };

  const verifyResetPassword = async () => {
    if (password !== confirmPassword) {
      toast.error("As senhas não conferem.");
      return;
    }
    setLoading(true);
    const { error } = await supabase.functions.invoke("resetar-senha", { body: { action: "verify", email, code, newPassword: password } });
    setLoading(false);
    if (error) toast.error("Código inválido ou expirado.");
    else {
      toast.success("Senha alterada. Entre com a nova senha.");
      setMode("login");
      setPassword("");
      setConfirmPassword("");
      setCode("");
    }
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google", options: { redirectTo: window.location.origin } });
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-success/10 px-4 py-6">
      <Button asChild variant="ghost" className="mb-4"><Link to="/"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar ao início</Link></Button>
      <section className="mx-auto flex min-h-[calc(100vh-90px)] max-w-md items-center">
        <Card className="w-full border-primary/20 shadow-2xl">
          <CardContent className="p-6 sm:p-8">
            <div className="mb-7 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg" style={{ animation: "logo-float 3s ease-in-out infinite, logo-glow 3s ease-in-out infinite" }}>
                <Brain className="h-9 w-9" />
              </div>
              <h1 className="text-3xl font-black text-primary">AprovI.A</h1>
              <p className="mt-2 text-sm text-muted-foreground">{subtitle}</p>
            </div>

            {mode === "login" && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2"><Label>Email</Label><div className="relative"><Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="seu@email.com" required /></div></div>
                <div className="space-y-2"><Label>Senha</Label><div className="relative"><Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="px-9" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required /><button type="button" className="absolute right-3 top-3 text-muted-foreground" onClick={() => setShowPassword(!showPassword)}>{showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button></div></div>
                <button type="button" onClick={() => setMode("forgot")} className="text-sm font-medium text-primary hover:underline">Esqueci minha senha</button>
                <Button className="w-full font-bold" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Sparkles className="mr-2 h-4 w-4" /> Entrar na conta</>}</Button>
              </form>
            )}

            {mode === "signup" && (
              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-2"><Label>Nome</Label><div className="relative"><User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" /><Input className="pl-9" value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Seu nome" required /></div></div>
                <div className="space-y-2"><Label>Email</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                <div className="space-y-2"><Label>Senha</Label><Input type="password" minLength={6} value={password} onChange={(e) => setPassword(e.target.value)} required /></div>
                <div className="space-y-2"><Label>Confirmar senha</Label><Input type="password" minLength={6} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required /></div>
                <Button className="w-full font-bold" disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Criar conta e receber código"}</Button>
              </form>
            )}

            {mode === "forgot" && (
              <form onSubmit={sendResetCode} className="space-y-4">
                <div className="space-y-2"><Label>Email cadastrado</Label><Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required /></div>
                <Button className="w-full font-bold" disabled={loading}><KeyRound className="mr-2 h-4 w-4" /> Enviar código</Button>
              </form>
            )}

            {mode === "verify" && (
              <div className="space-y-5">
                <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 text-center">
                  <p className="text-sm text-muted-foreground">Código enviado para</p>
                  <p className="font-bold text-foreground">{email}</p>
                </div>
                <div className="flex justify-center">
                  <InputOTP maxLength={4} value={code} onChange={setCode}>
                    <InputOTPGroup>
                      {[0, 1, 2, 3].map((i) => <InputOTPSlot key={i} index={i} className="h-14 w-14 text-xl font-black" />)}
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {verifyPurpose === "reset" && (
                  <div className="space-y-3">
                    <Input type="password" placeholder="Nova senha" value={password} onChange={(e) => setPassword(e.target.value)} />
                    <Input type="password" placeholder="Confirmar nova senha" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                  </div>
                )}
                <Button className="w-full font-bold" disabled={loading || code.length !== 4} onClick={verifyPurpose === "reset" ? verifyResetPassword : verifySignupCode}>
                  {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Confirmar código"}
                </Button>
                <Button variant="ghost" className="w-full" onClick={() => verifyPurpose === "reset" ? supabase.functions.invoke("resetar-senha", { body: { email } }).then(() => toast.success("Código reenviado.")) : sendSignupCode()}>Reenviar código</Button>
              </div>
            )}

            <div className="my-5 flex items-center gap-3"><div className="h-px flex-1 bg-border" /><span className="text-xs font-bold text-muted-foreground">OU CONTINUE COM</span><div className="h-px flex-1 bg-border" /></div>
            <Button type="button" variant="outline" className="w-full" onClick={handleGoogle}>Continuar com Google</Button>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              {mode === "signup" ? "Já tem conta?" : "Ainda não tem conta?"}{" "}
              <button className="font-bold text-primary hover:underline" onClick={() => { setVerifyPurpose("signup"); setMode(mode === "signup" ? "login" : "signup"); setPassword(""); setConfirmPassword(""); setCode(""); }}>
                {mode === "signup" ? "Entrar" : "Criar conta gratuitamente"}
              </button>
            </p>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}
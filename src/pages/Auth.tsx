import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Loader2, Brain, User, Lock, Eye, EyeOff, Sparkles,
  ArrowLeft, Mail, ShieldCheck, RefreshCw, CheckCircle2
} from "lucide-react";

type Mode = "login" | "signup" | "forgot" | "verify";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");

  // OTP state
  const [otp, setOtp] = useState(["", "", "", ""]);
  const [otpError, setOtpError] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [codigoFallback, setCodigoFallback] = useState<string | null>(null);
  const [signedUpUserId, setSignedUpUserId] = useState<string | null>(null);

  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (resendCooldown > 0) {
      timer = setInterval(() => setResendCooldown(prev => prev - 1), 1000);
    }
    return () => clearInterval(timer);
  }, [resendCooldown]);

  useEffect(() => {
    const redirectUser = async (userId: string) => {
      const { data } = await supabase.from("profiles").select("is_premium").eq("id", userId).single();
      if (data?.is_premium) {
        navigate("/dashboard");
      } else {
        navigate("/precos");
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user && mode !== "verify") redirectUser(session.user.id);
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user && mode !== "verify") redirectUser(session.user.id);
    });
    return () => subscription.unsubscribe();
  }, [navigate, mode]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        if (error.message.includes("Invalid login credentials")) {
          toast.error("Email ou senha incorretos");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Login realizado com sucesso!");
      }
    } catch {
      toast.error("Erro ao fazer login");
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationCode = async (userId: string, userEmail: string) => {
    const session = await supabase.auth.getSession();
    const token = session.data.session?.access_token;
    if (!token) return null;

    const res = await fetch(
      `https://yecfogakgyszdkipzelm.supabase.co/functions/v1/enviar-codigo-verificacao`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ type: "signup_verify", userEmail }),
      }
    );
    if (!res.ok) return null;
    const data = await res.json();
    return data.codigoFallback ?? null;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { nome },
        },
      });
      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Este email já está cadastrado");
        } else {
          toast.error(error.message);
        }
        return;
      }

      setSignedUpUserId(data.user?.id ?? null);
      // Enviar código via edge function
      await sendCodeAndShowVerify();
    } catch {
      toast.error("Erro ao criar conta");
    } finally {
      setIsLoading(false);
    }
  };

  const sendCodeAndShowVerify = async () => {
    // Usar edge function de verificação de email customizada
    // Vamos inserir o código diretamente usando a sessão do usuário recém-criado
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token;

      if (!token) {
        // Usuário criado mas ainda sem sessão — mostrar tela mesmo assim
        setMode("verify");
        setOtp(["", "", "", ""]);
        setResendCooldown(60);
        return;
      }

      const res = await fetch(
        `https://yecfogakgyszdkipzelm.supabase.co/functions/v1/enviar-codigo-verificacao`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ type: "signup_verify" }),
        }
      );

      const data = res.ok ? await res.json() : null;
      setCodigoFallback(data?.codigoFallback ?? null);
    } catch {
      // continua para mostrar a tela
    }

    setMode("verify");
    setOtp(["", "", "", ""]);
    setResendCooldown(60);
    setTimeout(() => otpRefs.current[0]?.focus(), 300);
  };

  // Manipular digitação nos campos OTP
  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);
    setOtpError("");

    if (value && index < 3) {
      otpRefs.current[index + 1]?.focus();
    }
    // Auto-submit quando todos os 4 dígitos estiverem preenchidos
    if (newOtp.every(d => d !== "") && newOtp.join("").length === 4) {
      handleVerifyOtp(newOtp.join(""));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 4);
    if (pasted.length === 4) {
      const newOtp = pasted.split("");
      setOtp(newOtp);
      otpRefs.current[3]?.focus();
      handleVerifyOtp(pasted);
    }
  };

  const handleVerifyOtp = async (code: string) => {
    if (code.length !== 4) return;
    setVerifying(true);
    setOtpError("");

    try {
      // Buscar código na tabela verification_codes
      const session = await supabase.auth.getSession();
      const userId = session.data.session?.user?.id;

      if (!userId) {
        setOtpError("Sessão expirada. Por favor, recrie sua conta.");
        setVerifying(false);
        return;
      }

      const { data: codes, error } = await supabase
        .from("verification_codes")
        .select("*")
        .eq("user_id", userId)
        .eq("type", "signup_verify")
        .is("used_at", null)
        .gt("expires_at", new Date().toISOString())
        .order("created_at", { ascending: false })
        .limit(1);

      if (error || !codes || codes.length === 0) {
        setOtpError("Código inválido ou expirado. Tente reenviar.");
        setVerifying(false);
        return;
      }

      const record = codes[0];
      if (record.code !== code) {
        setOtpError("Código incorreto. Verifique e tente novamente.");
        setVerifying(false);
        // Shake animation
        return;
      }

      // Marcar como usado
      await supabase
        .from("verification_codes")
        .update({ used_at: new Date().toISOString() })
        .eq("id", record.id);

      // Sucesso! Redirecionar
      toast.success("Email verificado com sucesso! Bem-vindo(a)!");
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", userId)
        .single();

      setTimeout(() => {
        if (profile?.is_premium) navigate("/dashboard");
        else navigate("/precos");
      }, 1000);
    } catch {
      setOtpError("Erro ao verificar código. Tente novamente.");
    } finally {
      setVerifying(false);
    }
  };

  const handleResendCode = async () => {
    if (resendCooldown > 0) return;
    setResending(true);
    try {
      await sendCodeAndShowVerify();
      toast.success("Novo código enviado para seu email!");
    } catch {
      toast.error("Erro ao reenviar código");
    } finally {
      setResending(false);
    }
  };

  const handleForgot = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success("Email de recuperação enviado! Verifique sua caixa de entrada.");
        setMode("login");
      }
    } catch {
      toast.error("Erro ao enviar email");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogle = async () => {
    setGoogleLoading(true);
    try {
      const { error } = await lovable.auth.signInWithOAuth("google", {
        redirect_uri: window.location.origin,
      });
      if (error) toast.error("Erro ao entrar com Google");
    } catch {
      toast.error("Erro ao entrar com Google");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-background to-blue-50 dark:from-primary/5 dark:via-background dark:to-primary/10 flex flex-col">
      {/* Back link */}
      <div className="px-6 pt-6">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao início
        </Link>
      </div>

      {/* Brand */}
      <div className="flex flex-col items-center pt-8 pb-6">
        <div className="flex items-center gap-3 mb-3">
          <Brain className="h-10 w-10 text-primary" />
          <span className="text-3xl font-extrabold text-primary tracking-tight">AprovI.A</span>
        </div>
        {mode !== "verify" && (
          <p className="text-muted-foreground text-sm">
            {mode === "login" && "Bem-vindo de volta! Entre para continuar."}
            {mode === "signup" && "Crie sua conta e comece a estudar agora!"}
            {mode === "forgot" && "Vamos recuperar o acesso à sua conta."}
          </p>
        )}
      </div>

      {/* Card */}
      <div className="flex-1 flex items-start justify-center px-4 pb-10">
        <div className={`w-full bg-card border border-border rounded-2xl shadow-lg p-8 ${mode === "verify" ? "max-w-lg" : "max-w-md"}`}>

          {/* ─── LOGIN ─── */}
          {mode === "login" && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-foreground">Entrar</h1>
                <p className="text-sm text-muted-foreground mt-1">Use suas credenciais para acessar</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    Senha
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="h-11 rounded-lg pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold gap-2" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                    <>Entrar na conta <Sparkles className="h-4 w-4" /></>
                  )}
                </Button>
              </form>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-semibold tracking-widest">OU CONTINUE COM</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <Button
                variant="outline"
                className="w-full h-12 rounded-xl text-base font-medium gap-3"
                onClick={handleGoogle}
                disabled={googleLoading}
              >
                {googleLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <>
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continuar com Google
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Não tem uma conta?{" "}
                <button onClick={() => setMode("signup")} className="text-primary font-semibold hover:underline">
                  Criar conta gratuitamente
                </button>
              </p>
            </>
          )}

          {/* ─── SIGNUP ─── */}
          {mode === "signup" && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-foreground">Criar Conta</h1>
                <p className="text-sm text-muted-foreground mt-1">Preencha os dados para começar</p>
              </div>

              <form onSubmit={handleSignup} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Nome Completo
                  </label>
                  <Input
                    type="text"
                    placeholder="Seu nome completo"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    required
                    className="h-11 rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 rounded-lg"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Lock className="h-4 w-4 text-muted-foreground" />
                    Senha
                  </label>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Mínimo 6 caracteres"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      minLength={6}
                      required
                      className="h-11 rounded-lg pr-10"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold gap-2" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                    <>Criar minha conta <Sparkles className="h-4 w-4" /></>
                  )}
                </Button>
              </form>

              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-semibold tracking-widest">OU CONTINUE COM</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              <Button
                variant="outline"
                className="w-full h-12 rounded-xl text-base font-medium gap-3"
                onClick={handleGoogle}
                disabled={googleLoading}
              >
                {googleLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                  <>
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
                      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
                    </svg>
                    Continuar com Google
                  </>
                )}
              </Button>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Já tem uma conta?{" "}
                <button onClick={() => setMode("login")} className="text-primary font-semibold hover:underline">
                  Entrar
                </button>
              </p>
            </>
          )}

          {/* ─── FORGOT PASSWORD ─── */}
          {mode === "forgot" && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-foreground">Recuperar Senha</h1>
                <p className="text-sm text-muted-foreground mt-1">Digite seu email e enviaremos um link de recuperação</p>
              </div>

              <form onSubmit={handleForgot} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    Email
                  </label>
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 rounded-lg"
                  />
                </div>

                <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold gap-2" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : "Enviar link de recuperação"}
                </Button>
              </form>

              <p className="text-center text-sm text-muted-foreground mt-6">
                Lembrou a senha?{" "}
                <button onClick={() => setMode("login")} className="text-primary font-semibold hover:underline">
                  Voltar ao login
                </button>
              </p>
            </>
          )}

          {/* ─── VERIFY OTP ─── */}
          {mode === "verify" && (
            <div className="flex flex-col items-center">
              {/* Header com ícone animado */}
              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center">
                    <ShieldCheck className="h-8 w-8 text-primary" />
                  </div>
                </div>
                {/* Anel pulsante */}
                <div className="absolute inset-0 rounded-full border-2 border-primary/30 animate-ping" />
              </div>

              <h1 className="text-2xl font-extrabold text-foreground text-center mb-2">
                Verifique seu email
              </h1>
              <p className="text-muted-foreground text-sm text-center leading-relaxed mb-1">
                Enviamos um código de 4 dígitos para:
              </p>
              <div className="flex items-center gap-2 bg-primary/10 border border-primary/20 px-4 py-2 rounded-full mb-6">
                <Mail className="h-4 w-4 text-primary" />
                <span className="font-semibold text-primary text-sm">{email}</span>
              </div>

              {/* Passos */}
              <div className="w-full bg-muted/50 rounded-xl p-4 mb-6 space-y-3">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">Como funciona</p>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">1</div>
                  <p className="text-sm text-foreground">Abra o email que enviamos para <strong>{email}</strong></p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">2</div>
                  <p className="text-sm text-foreground">Copie o código de <strong>4 dígitos</strong> do email</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">3</div>
                  <p className="text-sm text-foreground">Digite o código abaixo para ativar sua conta</p>
                </div>
              </div>

              {/* Campos OTP */}
              <div className="w-full mb-2">
                <p className="text-sm font-semibold text-foreground text-center mb-4">Digite o código recebido</p>
                <div className="flex justify-center gap-3" onPaste={handleOtpPaste}>
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { otpRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(i, e.target.value)}
                      onKeyDown={e => handleOtpKeyDown(i, e)}
                      disabled={verifying}
                      className={[
                        "w-16 h-16 text-center text-2xl font-extrabold rounded-xl border-2 outline-none transition-all duration-200",
                        "bg-background text-foreground",
                        digit && !otpError ? "border-primary bg-primary/5 scale-105" : "",
                        otpError ? "border-destructive bg-destructive/5" : "",
                        !digit && !otpError ? "border-border" : "",
                        "focus:border-primary focus:ring-2 focus:ring-primary/20 focus:scale-105",
                        "disabled:opacity-50 disabled:cursor-not-allowed",
                      ].join(" ")}
                    />
                  ))}
                </div>

                {/* Estado de verificação */}
                {verifying && (
                  <div className="flex items-center justify-center gap-2 mt-4 text-primary">
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span className="text-sm font-medium">Verificando código...</span>
                  </div>
                )}

                {/* Erro */}
                {otpError && (
                  <div className="mt-3 bg-destructive/10 border border-destructive/20 rounded-lg p-3 text-center">
                    <p className="text-sm text-destructive font-medium">{otpError}</p>
                  </div>
                )}

                {/* Sucesso */}
                {!otpError && otp.every(d => d !== "") && !verifying && (
                  <div className="flex items-center justify-center gap-2 mt-4 text-green-600 dark:text-green-400">
                    <CheckCircle2 className="h-4 w-4" />
                    <span className="text-sm font-medium">Código completo!</span>
                  </div>
                )}
              </div>

              {/* Código fallback (quando email não foi enviado) */}
              {codigoFallback && (
                <div className="w-full bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 rounded-xl p-4 mb-4">
                  <p className="text-xs font-semibold text-amber-700 dark:text-amber-400 mb-1">⚠️ Email não pôde ser enviado — código para teste:</p>
                  <p className="text-2xl font-extrabold text-amber-800 dark:text-amber-300 tracking-widest text-center">{codigoFallback}</p>
                </div>
              )}

              {/* Expiração */}
              <p className="text-xs text-muted-foreground text-center mb-5">
                O código expira em <strong>10 minutos</strong> · Não compartilhe com ninguém
              </p>

              {/* Reenviar */}
              <button
                onClick={handleResendCode}
                disabled={resendCooldown > 0 || resending}
                className="flex items-center gap-2 text-sm font-medium text-primary hover:underline disabled:opacity-50 disabled:cursor-not-allowed disabled:no-underline transition-opacity"
              >
                {resending ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="h-4 w-4" />
                )}
                {resendCooldown > 0
                  ? `Reenviar código em ${resendCooldown}s`
                  : "Reenviar código"}
              </button>

              <div className="flex items-center gap-3 my-5 w-full">
                <div className="flex-1 h-px bg-border" />
              </div>

              <button
                onClick={() => setMode("login")}
                className="text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                ← Voltar ao login
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <p className="text-center text-xs text-muted-foreground pb-6 px-4">
        Ao continuar, você concorda com nossos{" "}
        <span className="underline cursor-pointer hover:text-foreground transition-colors">termos de uso</span>
        {" "}e{" "}
        <span className="underline cursor-pointer hover:text-foreground transition-colors">política de privacidade</span>.
      </p>
    </div>
  );
}

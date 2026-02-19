import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { lovable } from "@/integrations/lovable/index";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Loader2, Brain, User, Lock, Eye, EyeOff, Sparkles, ArrowLeft, Mail } from "lucide-react";

type Mode = "login" | "signup" | "forgot";

export default function Auth() {
  const navigate = useNavigate();
  const [mode, setMode] = useState<Mode>("login");
  const [isLoading, setIsLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");

  useEffect(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) navigate("/");
    });
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) navigate("/");
    });
    return () => subscription.unsubscribe();
  }, [navigate]);

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

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: `${window.location.origin}/chat`,
          data: { nome },
        },
      });
      if (error) {
        if (error.message.includes("already registered")) {
          toast.error("Este email já está cadastrado");
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success("Conta criada! Verifique seu email para confirmar o cadastro.");
      }
    } catch {
      toast.error("Erro ao criar conta");
    } finally {
      setIsLoading(false);
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
        <p className="text-muted-foreground text-sm">
          {mode === "login" && "Bem-vindo de volta! Entre para continuar."}
          {mode === "signup" && "Crie sua conta e comece a estudar agora!"}
          {mode === "forgot" && "Vamos recuperar o acesso à sua conta."}
        </p>
      </div>

      {/* Card */}
      <div className="flex-1 flex items-start justify-center px-4 pb-10">
        <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-lg p-8">

          {/* ─── LOGIN ─── */}
          {mode === "login" && (
            <>
              <div className="text-center mb-6">
                <h1 className="text-2xl font-bold text-foreground">Entrar</h1>
                <p className="text-sm text-muted-foreground mt-1">Use suas credenciais para acessar</p>
              </div>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div className="space-y-1.5">
                  <label className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <User className="h-4 w-4 text-muted-foreground" />
                    Email ou Nome Completo
                  </label>
                  <Input
                    type="email"
                    placeholder="seu@email.com ou seu nome completo"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="h-11 rounded-lg"
                  />
                </div>

                {/* Senha */}
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

                {/* Esqueci */}
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setMode("forgot")}
                    className="text-sm text-primary font-medium hover:underline"
                  >
                    Esqueci minha senha
                  </button>
                </div>

                {/* Submit */}
                <Button type="submit" className="w-full h-12 rounded-xl text-base font-bold gap-2" disabled={isLoading}>
                  {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : (
                    <>Entrar na conta <Sparkles className="h-4 w-4" /></>
                  )}
                </Button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-3 my-5">
                <div className="flex-1 h-px bg-border" />
                <span className="text-xs text-muted-foreground font-semibold tracking-widest">OU CONTINUE COM</span>
                <div className="flex-1 h-px bg-border" />
              </div>

              {/* Google */}
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

              {/* Switch to signup */}
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

              {/* Divider */}
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

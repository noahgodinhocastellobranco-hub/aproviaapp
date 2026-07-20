import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ThemeToggle } from "@/components/ThemeToggle";
import { InstallAppDialog } from "@/components/InstallAppDialog";
import { BookOpen, Bot, Brain, Camera, CheckCircle2, Clock, Crown, Download, FileText, GraduationCap, Headphones, HelpCircle, LayoutDashboard, LogOut, Menu, MessageSquare, PenTool, Settings, Sparkles, Target, Timer, Trophy, User, X, Zap } from "lucide-react";

const tools = [
  { title: "Redação", desc: "Correção no padrão ENEM com nota por competência.", href: "/redacao", icon: PenTool, badge: "MAIS USADO" },
  { title: "Chat AprovI.A", desc: "Tire dúvidas de qualquer matéria em segundos.", href: "/chat", icon: MessageSquare },
  { title: "Simulados", desc: "Treinos completos e provas para evoluir.", href: "/simulados", icon: Trophy },
  { title: "Professora Virtual", desc: "Explicações em texto e voz, do seu jeito.", href: "/professora-virtual", icon: Bot },
  { title: "Resolver Questão", desc: "Envie foto da questão e receba a solução.", href: "/resolver-questao", icon: Camera },
  { title: "Prova ENEM", desc: "Experiência exclusiva com questões geradas por IA.", href: "/prova-enem", icon: FileText },
  { title: "Rotina", desc: "Plano semanal personalizado para sua realidade.", href: "/rotina", icon: Clock },
  { title: "Pomodoro", desc: "Cronômetro de foco para manter constância.", href: "/pomodoro", icon: Timer },
  { title: "Materiais", desc: "Conteúdo organizado por área do ENEM.", href: "/materiais-estudo", icon: BookOpen },
];

const faqs = [
  { q: "Preciso pagar antes de criar conta?", a: "Não. Você cria sua conta, confirma o código no email e só depois escolhe o plano." },
  { q: "O checkout abre fora do site?", a: "Não. A compra abre em uma janela dentro da própria página e o sistema libera o PRO automaticamente após aprovação." },
  { q: "As ferramentas são para o ENEM 2026?", a: "Sim. O painel, simulados, redação e rotina foram pensados para preparação do ENEM 2026." },
  { q: "Tenho suporte se precisar de ajuda?", a: "Sim. O suporte funciona por WhatsApp e email pela página de suporte." },
];

type Profile = { email: string | null; nome: string | null; is_premium: boolean };

export default function Index() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const [{ data: profileData }, { data: adminRole }] = await Promise.all([
        supabase.from("profiles").select("email,nome,is_premium").eq("id", user.id).maybeSingle(),
        supabase.rpc("has_role", { _user_id: user.id, _role: "admin" }),
      ]);
      setProfile(profileData || { email: user.email || null, nome: null, is_premium: false });
      setIsAdmin(!!adminRole);
    };
    load();
  }, []);

  const firstName = useMemo(() => profile?.nome?.split(" ")[0] || profile?.email?.split("@")[0] || "Aluno", [profile]);

  const signOut = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setIsAdmin(false);
    setMenuOpen(false);
  };

  const AuthButtons = () => profile ? (
    <>
      <span className="hidden max-w-[220px] truncate text-sm font-semibold text-foreground lg:inline">{profile.email}</span>
      <Button variant="outline" onClick={() => navigate("/configuracoes")}><Settings className="mr-2 h-4 w-4" />Configurações</Button>
      <Button variant="outline" onClick={() => navigate("/suporte")}><Headphones className="mr-2 h-4 w-4" />Suporte</Button>
      <InstallAppDialog trigger={<Button variant="outline"><Download className="mr-2 h-4 w-4" />Baixar App</Button>} />
      <Button onClick={() => navigate(profile.is_premium ? "/dashboard" : "/precos")}><Crown className="mr-2 h-4 w-4" />{profile.is_premium ? "Meu PRO" : "Assinar PRO"}</Button>
      <Button variant="ghost" onClick={signOut}><LogOut className="mr-2 h-4 w-4" />Minha Conta</Button>
    </>
  ) : (
    <>
      <Button asChild variant="outline"><Link to="/auth">Login / Criar Conta</Link></Button>
      <Button asChild><Link to="/precos">Começar Agora</Link></Button>
    </>
  );

  return (
    <main className="min-h-screen bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <button onClick={() => navigate("/")} className="flex items-center gap-3" aria-label="AprovI.A início">
            <Brain className="h-9 w-9 text-primary" style={{ animation: "logo-float 3s ease-in-out infinite, logo-glow 3s ease-in-out infinite" }} />
            <span className="text-2xl font-black text-primary">AprovI.A</span>
          </button>
          <nav className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <AuthButtons />
          </nav>
          <Button variant="outline" size="icon" className="md:hidden" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menu">
            {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
        {menuOpen && (
          <div className="border-t border-border bg-card p-4 md:hidden">
            <div className="flex flex-col gap-2"><ThemeToggle /><AuthButtons /></div>
          </div>
        )}
      </header>

      <section className="px-4 pb-12 pt-7 sm:px-6 lg:pb-16">
        <div className="mx-auto max-w-7xl text-center">
          <div className="mb-6 flex justify-center">
            <Badge variant="outline" className="border-destructive/30 bg-destructive/10 px-5 py-2 text-destructive">⚡ ENEM 2026 está chegando — comece hoje</Badge>
          </div>
          <div className="mb-6 flex justify-center">
            <Brain className="h-24 w-24 text-primary sm:h-32 sm:w-32" style={{ animation: "logo-float 3s ease-in-out infinite, logo-glow 3s ease-in-out infinite" }} />
          </div>
          <h1 className="mx-auto max-w-5xl text-4xl font-black leading-tight text-foreground sm:text-6xl lg:text-7xl">
            Sua <span className="text-primary">Inteligência Artificial</span> para passar no <span className="text-success">ENEM</span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg font-medium text-muted-foreground sm:text-xl">
            Correção de redação, chat de dúvidas, simulados, professora virtual e plano de estudos personalizado em uma única plataforma.
          </p>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button size="lg" className="text-base font-black" onClick={() => navigate(profile?.is_premium ? "/dashboard" : "/precos")}>
              <Sparkles className="mr-2 h-5 w-5" /> Começar Agora
            </Button>
            <Button size="lg" variant="outline" onClick={() => navigate(profile ? "/dashboard" : "/auth")}>
              <User className="mr-2 h-5 w-5" /> {profile ? `Entrar como ${firstName}` : "Já tenho conta"}
            </Button>
          </div>
          {isAdmin && (
            <Button className="mt-4 font-black" variant="destructive" onClick={() => navigate("/admin")}>
              <LayoutDashboard className="mr-2 h-5 w-5" /> Modo Administração
            </Button>
          )}
        </div>
      </section>

      <section className="border-y border-border bg-muted/40 px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-destructive/20 bg-card p-6 shadow-sm">
            <h2 className="mb-4 text-2xl font-black text-foreground">Estudo tradicional</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>Material solto, correção demorada, dúvidas acumuladas e rotina sem direção.</p>
              <p>Você perde tempo tentando descobrir o que estudar antes de realmente estudar.</p>
            </div>
          </div>
          <div className="rounded-2xl border border-primary/30 bg-card p-6 shadow-lg">
            <h2 className="mb-4 text-2xl font-black text-primary">Com AprovI.A</h2>
            <div className="space-y-3 text-muted-foreground">
              <p>IA guiando redação, dúvidas, simulados, rotina e revisão em tempo real.</p>
              <p>Você entra, escolhe a ferramenta e começa a evoluir com foco no ENEM.</p>
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-black text-foreground sm:text-5xl">Tudo que você precisa para estudar</h2>
            <p className="mt-3 text-muted-foreground">Ferramentas conectadas para transformar esforço em evolução real.</p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {tools.map((tool) => {
              const Icon = tool.icon;
              return (
                <Card key={tool.title} className="group border-border transition hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                  <CardContent className="p-5">
                    <div className="mb-4 flex items-start justify-between gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary"><Icon className="h-6 w-6" /></div>
                      {tool.badge && <Badge className="bg-success text-success-foreground">{tool.badge}</Badge>}
                    </div>
                    <h3 className="text-xl font-black text-foreground">{tool.title}</h3>
                    <p className="mt-2 min-h-[48px] text-sm text-muted-foreground">{tool.desc}</p>
                    <Button asChild variant="ghost" className="mt-4 w-full justify-between text-primary">
                      <Link to={tool.href}>Abrir ferramenta <Zap className="h-4 w-4" /></Link>
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="bg-primary px-4 py-14 text-primary-foreground sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1fr_0.8fr] lg:items-center">
          <div>
            <h2 className="text-3xl font-black sm:text-5xl">Entre hoje e comece pelo próximo passo certo.</h2>
            <p className="mt-4 max-w-2xl text-primary-foreground/85">Crie sua conta, confirme o código no email e escolha o plano para liberar todas as ferramentas PRO.</p>
          </div>
          <div className="grid gap-3">
            {[
              "Código de verificação no cadastro",
              "Checkout dentro do site",
              "Liberação automática após aprovação",
            ].map((item) => <div key={item} className="flex items-center gap-3 rounded-xl bg-primary-foreground/10 p-3"><CheckCircle2 className="h-5 w-5" /><span className="font-semibold">{item}</span></div>)}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6">
        <div className="mx-auto max-w-4xl">
          <div className="mb-8 text-center">
            <HelpCircle className="mx-auto mb-3 h-10 w-10 text-primary" />
            <h2 className="text-3xl font-black text-foreground sm:text-4xl">Perguntas frequentes</h2>
          </div>
          <Accordion type="single" collapsible className="rounded-2xl border border-border bg-card px-4">
            {faqs.map((faq, index) => (
              <AccordionItem key={faq.q} value={`faq-${index}`}>
                <AccordionTrigger className="text-left font-bold">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      <footer className="border-t border-border px-4 py-8 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2 font-black text-primary"><GraduationCap className="h-5 w-5" /> AprovI.A</div>
          <div className="flex flex-wrap gap-3 text-sm text-muted-foreground"><Link to="/suporte">Suporte</Link><Link to="/precos">Planos</Link><Link to="/auth">Entrar</Link></div>
        </div>
      </footer>
    </main>
  );
}
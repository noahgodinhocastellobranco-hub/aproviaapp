import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { toast } from "sonner";
import {
  Award,
  BookOpen,
  Brain,
  CalendarDays,
  Clock,
  Flame,
  Headphones,
  MessageCircle,
  PenTool,
  Settings,
  Sparkles,
  Target,
  Timer,
  Trophy,
} from "lucide-react";

const SUBJECTS = [
  "Redação: repertório sociocultural",
  "Matemática: funções e porcentagem",
  "Linguagens: interpretação textual",
  "Natureza: ecologia e energia",
  "Humanas: Brasil República",
  "Matemática: estatística no ENEM",
  "Redação: proposta de intervenção",
];

const QUOTES = [
  "A aprovação é construída em pequenos blocos todos os dias.",
  "Estude com direção: qualidade vence quantidade sem foco.",
  "Cada questão corrigida hoje vira ponto no dia da prova.",
  "Disciplina é continuar mesmo quando a motivação oscila.",
  "Seu futuro no ENEM começa na próxima tarefa concluída.",
];

const tools = [
  { title: "Correção de Redação", desc: "Nota ENEM + feedback por competência", href: "/redacao", icon: PenTool },
  { title: "Chat AprovI.A", desc: "Dúvidas respondidas 24h por IA", href: "/chat", icon: MessageCircle },
  { title: "Simulados", desc: "Provas reais e treinos completos", href: "/simulados", icon: Trophy },
  { title: "Professora Virtual", desc: "Explicações em texto e voz", href: "/professora-virtual", icon: Brain },
  { title: "Pomodoro", desc: "Sessões focadas de estudo", href: "/pomodoro", icon: Timer },
  { title: "Rotina de Estudos", desc: "Plano personalizado semanal", href: "/rotina", icon: CalendarDays },
];

type Profile = {
  nome: string | null;
  email: string | null;
  is_premium: boolean;
  email_verified: boolean;
};

export default function Dashboard() {
  const navigate = useNavigate();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activity, setActivity] = useState<number[]>([20, 42, 55, 38, 70, 82, 64]);

  const dayIndex = new Date().getDay();
  const subject = SUBJECTS[dayIndex];
  const quote = QUOTES[new Date().getDate() % QUOTES.length];

  const countdown = useMemo(() => {
    const target = new Date("2026-11-08T13:30:00-03:00").getTime();
    const diff = Math.max(0, target - Date.now());
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    return { days, hours };
  }, []);

  useEffect(() => {
    const load = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        navigate("/auth", { replace: true });
        return;
      }

      const { data } = await supabase
        .from("profiles")
        .select("nome,email,is_premium,email_verified")
        .eq("id", user.id)
        .maybeSingle();

      if (!data?.email_verified) {
        navigate("/auth", { replace: true, state: { email: user.email, requireOtp: true } });
        return;
      }

      if (!data?.is_premium) {
        navigate("/precos", { replace: true });
        return;
      }

      setProfile(data);
      setLoading(false);

      await supabase.rpc("increment_user_activity", { p_user_id: user.id }).catch(() => null);
      const { data: recent } = await supabase
        .from("user_activity")
        .select("actions_count")
        .eq("user_id", user.id)
        .order("date", { ascending: false })
        .limit(7);
      if (recent?.length) setActivity(recent.map((r) => Math.min(100, Number(r.actions_count) * 18)).reverse());
    };

    load();
  }, [navigate]);

  const firstName = profile?.nome?.split(" ")[0] || "Estudante";
  const greeting = new Date().getHours() < 12 ? "Bom dia" : new Date().getHours() < 18 ? "Boa tarde" : "Boa noite";

  if (loading) {
    return <div className="min-h-screen grid place-items-center bg-background text-primary font-semibold">Carregando seu plano PRO...</div>;
  }

  return (
    <main className="min-h-screen bg-background">
      <header className="border-b border-border bg-card/80 sticky top-0 z-40 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-md">
              <Brain className="h-6 w-6" />
            </div>
            <div>
              <p className="text-base font-black text-primary">AprovI.A</p>
              <p className="text-xs text-muted-foreground">Central PRO</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Badge className="hidden sm:inline-flex bg-success text-success-foreground">PRO Ativo</Badge>
            <div className="hidden items-center gap-1 rounded-full border border-border px-3 py-1.5 text-sm font-semibold text-foreground sm:flex">
              <Flame className="h-4 w-4 text-warning" /> 7 dias
            </div>
            <ThemeToggle />
            <Button variant="outline" size="icon" onClick={() => navigate("/configuracoes")} aria-label="Configurações">
              <Settings className="h-4 w-4" />
            </Button>
            <Avatar>
              <AvatarFallback className="bg-primary text-primary-foreground">{firstName.slice(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6">
        <div className="mb-8 grid gap-4 lg:grid-cols-[1.5fr_1fr]">
          <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/10 via-background to-success/10 p-6 sm:p-8">
            <Badge className="mb-4 bg-primary text-primary-foreground">Plano PRO liberado</Badge>
            <h1 className="text-3xl font-black tracking-normal text-foreground sm:text-5xl">
              {greeting}, {firstName}. Bora estudar com poder total.
            </h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              Seu painel premium reúne redação, simulados, professora virtual, chat, rotina e ferramentas para acelerar sua preparação para o ENEM 2026.
            </p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button size="lg" onClick={() => navigate("/redacao")} className="font-bold">
                <Sparkles className="mr-2 h-5 w-5" /> Comece a Estudar
              </Button>
              <Button size="lg" variant="outline" onClick={() => navigate("/suporte")}>Falar com Suporte</Button>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Clock className="h-5 w-5 text-primary" /> ENEM 2026</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-xl bg-primary/10 p-4 text-center">
                  <p className="text-4xl font-black text-primary">{countdown.days}</p>
                  <p className="text-xs font-medium text-muted-foreground">dias</p>
                </div>
                <div className="rounded-xl bg-success/10 p-4 text-center">
                  <p className="text-4xl font-black text-success">{countdown.hours}</p>
                  <p className="text-xs font-medium text-muted-foreground">horas</p>
                </div>
              </div>
              <div>
                <div className="mb-2 flex justify-between text-sm"><span>Meta semanal</span><strong>82%</strong></div>
                <Progress value={82} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="p-5">
              <BookOpen className="mb-3 h-6 w-6 text-primary" />
              <p className="text-sm text-muted-foreground">Matéria do dia</p>
              <h2 className="mt-1 text-xl font-bold text-foreground">{subject}</h2>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <Award className="mb-3 h-6 w-6 text-success" />
              <p className="text-sm text-muted-foreground">Foco de hoje</p>
              <h2 className="mt-1 text-xl font-bold text-foreground">1 redação + 20 questões</h2>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <Target className="mb-3 h-6 w-6 text-warning" />
              <p className="text-sm text-muted-foreground">Motivação</p>
              <h2 className="mt-1 text-base font-semibold text-foreground">{quote}</h2>
            </CardContent>
          </Card>
        </div>

        <div className="mb-8 grid gap-4 lg:grid-cols-[1fr_1.25fr]">
          <Card>
            <CardHeader><CardTitle>Seu desempenho</CardTitle></CardHeader>
            <CardContent>
              <div className="flex h-44 items-end gap-3">
                {activity.map((value, index) => (
                  <div key={index} className="flex flex-1 flex-col items-center gap-2">
                    <div className="w-full rounded-t-lg bg-primary transition-all" style={{ height: `${Math.max(14, value)}%` }} />
                    <span className="text-xs text-muted-foreground">D{index + 1}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader><CardTitle>Ferramentas PRO</CardTitle></CardHeader>
            <CardContent className="grid gap-3 sm:grid-cols-2">
              {tools.map((tool) => (
                <Link key={tool.title} to={tool.href} className="group rounded-xl border border-border p-4 no-underline transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-lg">
                  <tool.icon className="mb-3 h-6 w-6 text-primary transition-transform group-hover:scale-110" />
                  <h3 className="font-bold text-foreground group-hover:text-primary">{tool.title}</h3>
                  <p className="mt-1 text-sm text-muted-foreground">{tool.desc}</p>
                </Link>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <Headphones className="h-6 w-6 text-primary" />
            <div>
              <p className="font-bold text-foreground">Precisa de ajuda?</p>
              <p className="text-sm text-muted-foreground">WhatsApp e email de suporte disponíveis.</p>
            </div>
          </div>
          <Button variant="outline" onClick={() => navigate("/suporte")}>Abrir suporte</Button>
        </div>
      </section>
    </main>
  );
}
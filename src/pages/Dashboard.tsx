import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useTheme } from "next-themes";
import {
  PenTool, Brain, FileText, GraduationCap, Timer, Star,
  Rocket, Settings, MessageCircle, Flame, Moon, Sun,
  CheckCircle2, Sparkles, LogOut, BarChart2, Target
} from "lucide-react";
import { Button } from "@/components/ui/button";

// ─── Contagem regressiva ENEM 2026 (01 Nov 2026) ───
function useCountdown(target: Date) {
  const calc = () => {
    const diff = Math.max(0, target.getTime() - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff % 86400000) / 3600000),
      minutes: Math.floor((diff % 3600000) / 60000),
      seconds: Math.floor((diff % 60000) / 1000),
    };
  };
  const [time, setTime] = useState(calc);
  useEffect(() => {
    const id = setInterval(() => setTime(calc()), 1000);
    return () => clearInterval(id);
  }, []);
  return time;
}

// ─── Matéria do dia (determinística por dia) ───
const MATERIAS = [
  { emoji: "🎨", label: "Sociologia: Cultura e Identidade", dica: "Estude diversidade cultural, etnocentrismo e relativismo cultural.", href: "/materias" },
  { emoji: "📐", label: "Matemática: Funções do 2º Grau", dica: "Revise fórmula de Bhaskara e gráficos de parábola.", href: "/materias" },
  { emoji: "🌍", label: "Geografia: Geopolítica Mundial", dica: "Foque em conflitos recentes e blocos econômicos.", href: "/materias" },
  { emoji: "📖", label: "Português: Interpretação de Texto", dica: "Treine com textos argumentativos e literários do ENEM.", href: "/materias" },
  { emoji: "⚗️", label: "Química: Reações Orgânicas", dica: "Revise hidrocarbonetos e funções orgânicas.", href: "/materias" },
  { emoji: "🧬", label: "Biologia: Genética e Hereditariedade", dica: "Estude leis de Mendel e herança genética.", href: "/materias" },
  { emoji: "⚡", label: "Física: Eletromagnetismo", dica: "Revise Lei de Ohm e circuitos elétricos.", href: "/materias" },
  { emoji: "🏛️", label: "História: Brasil República", dica: "Foque em ditadura militar e redemocratização.", href: "/materias" },
  { emoji: "🌐", label: "Inglês: Interpretação de Textos", dica: "Pratique leitura de textos em inglês do cotidiano.", href: "/materias" },
  { emoji: "📊", label: "Filosofia: Ética e Moral", dica: "Estude Kant, Aristóteles e dilemas éticos contemporâneos.", href: "/materias" },
  { emoji: "🌿", label: "Ciências da Natureza: Ecologia", dica: "Revise cadeias alimentares e impactos ambientais.", href: "/materias" },
  { emoji: "🔢", label: "Matemática: Probabilidade e Estatística", dica: "Treine com gráficos, médias e problemas de probabilidade.", href: "/materias" },
  { emoji: "📝", label: "Redação: Texto Dissertativo-Argumentativo", dica: "Escreva uma redação e use nossa IA para corrigir!", href: "/redacao" },
  { emoji: "🗺️", label: "Geografia: Meio Ambiente e Sustentabilidade", dica: "Estude questões ambientais globais e Conferências da ONU.", href: "/materias" },
];
function getMateriaHoje() {
  const day = Math.floor(Date.now() / 86400000);
  return MATERIAS[day % MATERIAS.length];
}

// ─── Frases motivacionais ───
const FRASES = [
  { texto: '"A dor do estudo é temporária. A dor da ignorância é permanente."', autor: "Anônimo" },
  { texto: '"O sucesso é a soma de pequenos esforços repetidos dia após dia."', autor: "Robert Collier" },
  { texto: '"Educação não é a preparação para a vida; educação é a própria vida."', autor: "John Dewey" },
  { texto: '"Aquele que sabe o suficiente é rico."', autor: "Lao Tzu" },
  { texto: '"Invista em você mesmo. Seu aprendizado é tão importante quanto a prova."', autor: "Warren Buffett" },
  { texto: '"Você não fracassa quando cai, você fracassa quando não se levanta."', autor: "Anônimo" },
  { texto: '"A persistência é o caminho do êxito."', autor: "Charles Chaplin" },
];
function getFraseHoje() {
  const day = Math.floor(Date.now() / 86400000);
  return FRASES[day % FRASES.length];
}

// ─── Saudação por horário ───
function getSaudacao() {
  const h = new Date().getHours();
  if (h >= 6 && h < 12) return { texto: "Bom dia", emoji: "☀️" };
  if (h >= 12 && h < 18) return { texto: "Boa tarde", emoji: "🌤️" };
  if (h >= 18 && h < 24) return { texto: "Boa noite", emoji: "🌙" };
  return { texto: "Boa madrugada", emoji: "🌙" };
}

// ─── Ferramentas PRO ───
const PRO_TOOLS = [
  { icon: <PenTool className="h-8 w-8 text-primary" />, title: "Correção de Redação", desc: "Feedback detalhado com IA", href: "/redacao" },
  { icon: <Brain className="h-8 w-8 text-primary" />, title: "Chat AprovI.A", desc: "Tire dúvidas 24/7", href: "/chat" },
  { icon: <FileText className="h-8 w-8 text-primary" />, title: "Simulados ENEM", desc: "Provas de 2009 a 2025", href: "/simulados" },
  { icon: <GraduationCap className="h-8 w-8 text-primary" />, title: "Professor Virtual", desc: "Explicações personalizadas", href: "/professora-virtual" },
  { icon: <Timer className="h-8 w-8 text-primary" />, title: "Pomodoro", desc: "Gestão de tempo inteligente", href: "/pomodoro" },
  { icon: <Star className="h-8 w-8 text-primary" />, title: "Plano de Estudos", desc: "Baseado nas suas dificuldades", href: "/rotina" },
];

// ─── Gráfico de acesso simples (últimos 7 dias) ───
function AccessChart({ acessos }: { acessos: number[] }) {
  const max = Math.max(...acessos, 1);
  const dias = ["Sex", "Sáb", "Dom", "Seg", "Ter", "Qua", "Qui"];
  const total = acessos.reduce((a, b) => a + b, 0);
  return (
    <div className="rounded-2xl border border-border bg-card p-5 h-full">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-wider text-primary mb-0.5">↗ Seu Desempenho</p>
          <p className="font-bold text-foreground">Últimos 7 dias</p>
        </div>
        <p className="text-2xl font-extrabold text-primary">{total}</p>
      </div>
      <div className="flex items-end gap-1.5 h-20 mb-2">
        {acessos.map((v, i) => (
          <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
            <div
              className="w-full rounded-t bg-primary/20 relative"
              style={{ height: `${(v / max) * 100}%`, minHeight: v > 0 ? "4px" : "0" }}
            >
              {i === acessos.length - 1 && v > 0 && (
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-primary" />
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="flex gap-1.5">
        {dias.map((d) => (
          <div key={d} className="flex-1 text-center text-[10px] text-muted-foreground">{d}</div>
        ))}
      </div>
      <div className="mt-3 text-xs text-muted-foreground">
        🔥 Continue estudando todos os dias!
      </div>
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();
  const [nome, setNome] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [streak, setStreak] = useState(1);
  const enem2026 = new Date("2026-11-01T08:00:00");
  const countdown = useCountdown(enem2026);
  const materia = getMateriaHoje();
  const frase = getFraseHoje();
  const saudacao = getSaudacao();

  // Simulated weekly access (would come from DB in production)
  const acessos = [0, 1, 0, 2, 3, 5, 8];

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session?.user) { navigate("/auth"); return; }
      setEmail(session.user.email ?? null);
      // Fetch profile name
      supabase.from("profiles").select("nome").eq("id", session.user.id).single()
        .then(({ data }) => {
          if (data?.nome) setNome(data.nome);
        });
    });
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/");
  };

  const primeiroNome = nome?.split(" ")[0] ?? email?.split("@")[0] ?? "Aluno";

  return (
    <div className="min-h-screen bg-background text-foreground">

      {/* ─── HEADER ─── */}
      <header className="sticky top-0 z-50 bg-background border-b border-border">
        <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Avatar + nome + badge PRO */}
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm border border-primary/30">
              {primeiroNome[0]?.toUpperCase()}
            </div>
            <div className="leading-none">
              <p className="text-sm font-semibold text-foreground">{primeiroNome}</p>
              <div className="flex items-center gap-1 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold">PRO Ativo</p>
              </div>
            </div>
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-2">
            {/* Streak */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-100 dark:bg-orange-950/40 border border-orange-200 dark:border-orange-800">
              <Flame className="h-4 w-4 text-orange-500" />
              <span className="text-sm font-bold text-orange-600 dark:text-orange-400">{streak}</span>
            </div>

            {/* Suporte */}
            <Button variant="ghost" size="sm" className="gap-1.5 hidden sm:flex" onClick={() => navigate("/suporte")}>
              <MessageCircle className="h-4 w-4" />
              Suporte
            </Button>

            {/* Theme */}
            <Button variant="ghost" size="icon" className="h-9 w-9"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
              <Sun className="h-4 w-4 rotate-0 scale-100 dark:-rotate-90 dark:scale-0 transition-all" />
              <Moon className="absolute h-4 w-4 rotate-90 scale-0 dark:rotate-0 dark:scale-100 transition-all" />
            </Button>

            {/* Logout */}
            <Button variant="ghost" size="icon" className="h-9 w-9 text-muted-foreground" onClick={handleLogout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-10 space-y-10">

        {/* ─── HERO ─── */}
        <section className="text-center space-y-5">
          {/* Plano PRO badge */}
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full border border-emerald-300 dark:border-emerald-700 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-400 text-sm font-semibold">
            <CheckCircle2 className="h-4 w-4" />
            Plano PRO Ativo
          </div>

          {/* Brand */}
          <div className="flex items-center justify-center gap-3">
            <Brain className="h-12 w-12 text-primary" />
            <span className="text-5xl font-extrabold text-primary">AprovI.A</span>
          </div>

          {/* Greeting */}
          <h1 className="text-3xl md:text-4xl font-extrabold">
            {saudacao.texto}, <span className="text-primary">{primeiroNome}!</span> {saudacao.emoji}
          </h1>
          <p className="text-muted-foreground text-base max-w-md mx-auto">
            Sua plataforma de estudos com IA está pronta. Continue de onde parou!
          </p>

          {/* CTA principal */}
          <Button
            size="lg"
            className="text-base px-10 py-6 rounded-xl font-bold uppercase tracking-wide gap-2"
            onClick={() => navigate("/redacao")}
          >
            <Rocket className="h-5 w-5" />
            COMECE A ESTUDAR
            <span className="text-primary-foreground/70">›</span>
          </Button>

          {/* Trust pills */}
          <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
            {["Acesso ilimitado", "IA disponível 24/7", "Suporte humanizado"].map((t) => (
              <div key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                {t}
              </div>
            ))}
          </div>
        </section>

        {/* ─── COUNTDOWN ENEM 2026 ─── */}
        <div className="rounded-2xl border border-rose-200 dark:border-rose-900 bg-rose-50/50 dark:bg-rose-950/20 p-5 flex flex-col sm:flex-row items-center gap-6">
          <div className="flex items-center gap-4 shrink-0">
            <div className="w-12 h-12 rounded-xl bg-rose-100 dark:bg-rose-950/50 flex items-center justify-center text-2xl">🎯</div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-rose-500 dark:text-rose-400">Contagem Regressiva</p>
              <p className="font-bold text-foreground text-lg">ENEM 2026</p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-1 justify-center sm:justify-start">
            {[
              { val: countdown.days, label: "dias" },
              { val: countdown.hours, label: "horas" },
              { val: countdown.minutes, label: "min" },
              { val: countdown.seconds, label: "seg" },
            ].map(({ val, label }) => (
              <div key={label} className="text-center">
                <div className="bg-background border border-border rounded-xl px-4 py-2 min-w-[56px]">
                  <p className="text-2xl font-extrabold text-foreground tabular-nums">{String(val).padStart(2, "0")}</p>
                </div>
                <p className="text-[11px] text-muted-foreground mt-1">{label}</p>
              </div>
            ))}
          </div>
          <p className="text-sm text-muted-foreground text-center sm:text-right shrink-0">
            Cada segundo conta.<br />Continue estudando! 🚀
          </p>
        </div>

        {/* ─── MATÉRIA DO DIA + GRÁFICO ─── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {/* Matéria do dia */}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
                {materia.emoji}
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-primary">✦ Matéria do Dia</p>
                <h3 className="font-bold text-foreground text-lg leading-tight">{materia.label}</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              💡 <strong className="text-foreground">Dica:</strong> {materia.dica}
            </p>
            <Button
              size="sm"
              className="gap-2 rounded-lg"
              onClick={() => navigate(materia.href)}
            >
              📖 Estudar este tema agora
            </Button>
          </div>

          {/* Gráfico de desempenho */}
          <AccessChart acessos={acessos} />
        </div>

        {/* ─── FERRAMENTAS PRO ─── */}
        <section>
          <h2 className="text-center text-xl font-bold text-foreground mb-5">Suas ferramentas PRO</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {PRO_TOOLS.map((tool) => (
              <button
                key={tool.title}
                onClick={() => navigate(tool.href)}
                className="rounded-2xl border border-border bg-card p-6 text-left hover:border-primary/40 hover:bg-primary/5 hover:shadow-md transition-all duration-200 hover:-translate-y-0.5 group"
              >
                <div className="mb-3 group-hover:scale-110 transition-transform duration-200 inline-block">
                  {tool.icon}
                </div>
                <p className="font-bold text-foreground mb-1">{tool.title}</p>
                <p className="text-sm text-muted-foreground">{tool.desc}</p>
              </button>
            ))}
          </div>
        </section>

        {/* ─── BOTÕES DE AÇÃO ─── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Button
            size="lg"
            className="py-6 rounded-xl font-bold gap-2 text-base"
            onClick={() => navigate("/redacao")}
          >
            <Rocket className="h-5 w-5" />
            Comece a Estudar
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="py-6 rounded-xl font-semibold gap-2 text-base"
            onClick={() => navigate("/configuracoes")}
          >
            <Settings className="h-5 w-5" />
            Configurações
          </Button>
          <Button
            size="lg"
            variant="outline"
            className="py-6 rounded-xl font-semibold gap-2 text-base text-primary border-primary/30 hover:bg-primary/5"
            onClick={() => navigate("/suporte")}
          >
            <MessageCircle className="h-5 w-5" />
            Falar com Suporte
          </Button>
        </div>

        {/* ─── FRASE MOTIVACIONAL ─── */}
        <div className="rounded-2xl border border-border bg-card p-8 text-center space-y-3">
          <Sparkles className="h-6 w-6 text-primary mx-auto" />
          <p className="text-lg font-semibold italic text-foreground">{frase.texto}</p>
          <p className="text-sm text-muted-foreground">— {frase.autor}</p>
          <p className="text-xs text-muted-foreground">✨ Frase motivacional do dia — volte amanhã para uma nova!</p>
        </div>

      </main>
    </div>
  );
}

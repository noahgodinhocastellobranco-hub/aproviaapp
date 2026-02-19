import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Zap, Brain, Star, CheckCircle2, FileText, MessageSquare,
  Target, BookOpen, PenTool, TrendingUp, Timer, Search,
  Clipboard, GraduationCap, Lightbulb, Shield, AlertTriangle,
  Clock, HelpCircle, MessageCircle, ChevronDown, ChevronUp,
  ArrowRight, Sparkles, X, CheckCheck, BarChart2,
} from "lucide-react";


const faqs = [
  {
    q: "A AprovI.A funciona para qualquer área do ENEM?",
    a: "Sim! A AprovI.A cobre todas as 4 áreas do ENEM: Linguagens, Matemática, Ciências da Natureza e Ciências Humanas. Além disso, corrige redações usando os 5 critérios oficiais do INEP.",
  },
  {
    q: "Como funciona a correção de redação?",
    a: "Você digita ou cola sua redação, nossa IA analisa em segundos usando os mesmos 5 critérios do ENEM (competências 1 a 5) e devolve uma nota estimada com feedback detalhado sobre cada ponto.",
  },
  {
    q: "E se eu não gostar? Posso cancelar?",
    a: "Sim! Você tem 7 dias de garantia total. Se não ficar satisfeito por qualquer motivo, devolvemos seu dinheiro sem burocracia.",
  },
  {
    q: "A AprovI.A é diferente do ChatGPT?",
    a: "Sim. A AprovI.A foi treinada e otimizada especificamente para o ENEM. Ela conhece o estilo das questões, os critérios de correção de redação e o conteúdo de cada área de forma muito mais aprofundada que um chat genérico.",
  },
  {
    q: "Funciona no celular?",
    a: "Perfeitamente! A AprovI.A é um Progressive Web App (PWA), o que significa que você pode instalar no celular como um app normal e usar em qualquer lugar, inclusive offline.",
  },
  {
    q: "Preciso ter conhecimento de tecnologia?",
    a: "Não! A interface foi criada para ser simples e intuitiva. Se você sabe usar o WhatsApp, consegue usar a AprovI.A sem problema nenhum.",
  },
  {
    q: "Posso tirar dúvidas a qualquer hora?",
    a: "Sim! O chat com IA está disponível 24 horas por dia, 7 dias por semana. Você pode tirar dúvidas às 2h da manhã antes da prova se precisar.",
  },
];

const tools = [
  {
    icon: <PenTool className="h-7 w-7" />,
    title: "Redação",
    desc: "Envie sua redação e receba nota + feedback detalhado nos 5 critérios do ENEM em segundos.",
    tag1: "+73.000 redações corrigidas",
    tag2: "Melhore sua nota em até 280 pontos",
    highlight: true,
    badge: "MAIS USADO",
    href: "/redacao",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: <MessageSquare className="h-7 w-7" />,
    title: "Chat AprovI.A",
    desc: "Tire dúvidas instantaneamente com nossa IA especializada no ENEM. Perguntou, respondeu.",
    tag1: "Respostas em 5 segundos",
    tag2: "Nunca mais fique travado em uma questão",
    href: "/chat",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    icon: <Clipboard className="h-7 w-7" />,
    title: "Simulados",
    desc: "Faça provas anteriores do ENEM e simulados completos. Veja onde você erra e como melhorar.",
    tag1: "Todas as provas 2009-2025",
    tag2: "Conheça o estilo da prova na ponta da língua",
    href: "/simulados",
    color: "text-blue-600",
    bg: "bg-blue-50 dark:bg-blue-950/30",
  },
  {
    icon: <BookOpen className="h-7 w-7" />,
    title: "Matérias",
    desc: "Conteúdo organizado por matéria para você estudar de forma direcionada e eficiente.",
    tag1: "Todas as disciplinas do ENEM",
    tag2: "Estude de forma organizada",
    href: "/materias",
    color: "text-indigo-600",
    bg: "bg-indigo-50 dark:bg-indigo-950/30",
  },
  {
    icon: <FileText className="h-7 w-7" />,
    title: "Materiais de Estudo",
    desc: "Acesse resumos, mapas mentais e materiais exclusivos criados para o ENEM 2026.",
    tag1: "Conteúdo atualizado",
    tag2: "Tudo que você precisa em um só lugar",
    href: "/materiais-estudo",
    color: "text-violet-600",
    bg: "bg-violet-50 dark:bg-violet-950/30",
  },
  {
    icon: <GraduationCap className="h-7 w-7" />,
    title: "Professora Virtual",
    desc: "Uma professora com IA que te guia nos estudos, explica conceitos e tira suas dúvidas como um tutor.",
    tag1: "Disponível 24/7",
    tag2: "Como ter um professor particular",
    href: "/professora-virtual",
    color: "text-pink-600",
    bg: "bg-pink-50 dark:bg-pink-950/30",
  },
  {
    icon: <Lightbulb className="h-7 w-7" />,
    title: "Dicas",
    desc: "Dicas estratégicas para o ENEM: como gerenciar tempo, técnicas de prova e macetes das questões.",
    tag1: "Estratégias comprovadas",
    tag2: "Ganhe pontos com inteligência",
    href: "/dicas",
    color: "text-yellow-600",
    bg: "bg-yellow-50 dark:bg-yellow-950/30",
  },
  {
    icon: <Search className="h-7 w-7" />,
    title: "Como Resolver Questão",
    desc: "Aprenda passo a passo como resolver qualquer tipo de questão do ENEM com a ajuda da IA.",
    tag1: "Método passo a passo",
    tag2: "Domine qualquer tipo de questão",
    href: "/como-resolver-questao",
    color: "text-cyan-600",
    bg: "bg-cyan-50 dark:bg-cyan-950/30",
  },
  {
    icon: <BarChart2 className="h-7 w-7" />,
    title: "Fazendo um Simulado",
    desc: "Simulados guiados com cronômetro e análise completa do seu desempenho ao final.",
    tag1: "Experiência real de prova",
    tag2: "Prepare-se para o dia do ENEM",
    href: "/fazendo-simulado",
    color: "text-orange-600",
    bg: "bg-orange-50 dark:bg-orange-950/30",
  },
  {
    icon: <Target className="h-7 w-7" />,
    title: "Prova ENEM Exclusiva",
    desc: "Provas exclusivas criadas por IA no estilo ENEM para você treinar com questões inéditas.",
    tag1: "Questões inéditas toda semana",
    tag2: "Treine com questões novas sempre",
    href: "/prova-enem",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
  {
    icon: <Brain className="h-7 w-7" />,
    title: "Consultar Curso",
    desc: "Descubra quais cursos e faculdades você pode conquistar com sua nota do ENEM.",
    tag1: "Milhares de cursos disponíveis",
    tag2: "Encontre o curso dos seus sonhos",
    href: "/consultar-curso",
    color: "text-teal-600",
    bg: "bg-teal-50 dark:bg-teal-950/30",
  },
  {
    icon: <Timer className="h-7 w-7" />,
    title: "Pomodoro",
    desc: "Técnica Pomodoro integrada para você estudar com foco e pausas estratégicas.",
    tag1: "Aumente sua produtividade",
    tag2: "Estude mais em menos tempo",
    href: "/pomodoro",
    color: "text-red-600",
    bg: "bg-red-50 dark:bg-red-950/30",
  },
  {
    icon: <Target className="h-7 w-7" />,
    title: "Plano de Estudos Personalizado",
    desc: "A IA analisa seus pontos fracos e cria um cronograma feito especialmente para você.",
    tag1: "100% adaptado ao SEU nível",
    tag2: "Economize 3h de estudo por dia",
    href: "/rotina",
    color: "text-primary",
    bg: "bg-primary/10",
  },
  {
    icon: <TrendingUp className="h-7 w-7" />,
    title: "Acompanhe Sua Evolução",
    desc: "Veja seus pontos subindo semana a semana com gráficos e métricas que mostram seu progresso real.",
    tag1: "+200 pontos em média",
    tag2: "Saiba exatamente onde você está",
    href: "/",
    color: "text-emerald-600",
    bg: "bg-emerald-50 dark:bg-emerald-950/30",
  },
];

export default function Index() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* ─── NAV ─── */}
      <nav className="sticky top-0 z-50 bg-background/80 backdrop-blur border-b border-border">
        <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-end gap-3">
          <ThemeToggle />
          <Button asChild variant="outline" size="sm" className="rounded-full px-5">
            <Link to="/auth">Login / Criar Conta</Link>
          </Button>
        </div>
      </nav>

      {/* ─── HERO ─── */}
      <section className="max-w-3xl mx-auto px-4 pt-10 pb-16 text-center">
        {/* Alert banner */}
        <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-destructive/30 bg-destructive/5 mb-8">
          <AlertTriangle className="h-4 w-4 text-destructive" />
          <Zap className="h-4 w-4 text-yellow-500" />
          <span className="text-sm font-semibold text-destructive">
            ENEM 2026 está chegando — Comece a estudar agora
          </span>
        </div>

        {/* Brand typography */}
        <div className="flex items-center justify-center gap-3 mb-6">
          <span className="text-5xl md:text-6xl">🧠</span>
          <span className="text-5xl md:text-7xl font-extrabold text-primary tracking-tight">
            AprovI.A
          </span>
        </div>

        {/* Headline */}
        <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.08] tracking-tight mb-6">
          <span className="text-foreground">Sua </span>
          <span className="text-primary">Inteligência Artificial</span>
          <br />
          <span className="text-foreground">para </span>
          <span className="text-emerald-500">passar no ENEM</span>
        </h1>

        {/* Subtitle */}
        <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
          <strong className="text-foreground">Correção de redação em segundos</strong>, chat para tirar
          dúvidas 24/7 e plano de estudos personalizado — tudo com inteligência artificial.
        </p>

        {/* Feature pills */}
        <div className="flex flex-wrap justify-center gap-2 mb-8">
          {[
            { icon: <Zap className="h-3.5 w-3.5" />, text: "Correção instantânea de redação" },
            { icon: <Brain className="h-3.5 w-3.5" />, text: "Chat com IA especializada" },
            { icon: <Shield className="h-3.5 w-3.5" />, text: "7 dias de garantia" },
          ].map((p) => (
            <div
              key={p.text}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-border bg-card text-sm font-medium shadow-sm"
            >
              <span className="text-primary">{p.icon}</span>
              {p.text}
            </div>
          ))}
        </div>

        {/* CTA buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-6">
          <Button
            size="lg"
            className="text-base px-8 py-6 rounded-xl font-bold uppercase tracking-wide gap-2"
            onClick={() => navigate("/auth")}
          >
            <Sparkles className="h-5 w-5" />
            COMEÇAR AGORA
            <ArrowRight className="h-5 w-5" />
          </Button>
          <Button
            asChild
            size="lg"
            variant="outline"
            className="text-base px-8 py-6 rounded-xl font-medium"
          >
            <Link to="/auth">Já tenho conta</Link>
          </Button>
        </div>

        {/* Trust row */}
        <div className="flex flex-wrap justify-center gap-5">
          {["Garantia de 7 dias", "Cancele quando quiser", "Suporte humanizado"].map((t) => (
            <div key={t} className="flex items-center gap-1.5 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              {t}
            </div>
          ))}
        </div>
      </section>

      {/* ─── 3 MINI CARDS ─── */}
      <section className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { icon: <Zap className="h-8 w-8 text-primary" />, title: "Redação Corrigida", sub: "Em segundos com feedback" },
            { icon: <Brain className="h-8 w-8 text-emerald-500" />, title: "Tire Dúvidas 24/7", sub: "IA treinada para o ENEM" },
            { icon: <Star className="h-8 w-8 text-primary" />, title: "Plano Personalizado", sub: "Baseado nas suas dificuldades" },
          ].map((c) => (
            <div
              key={c.title}
              className="flex flex-col items-center text-center gap-2 p-6 rounded-2xl border border-border bg-card shadow-sm"
            >
              {c.icon}
              <p className="font-semibold text-foreground">{c.title}</p>
              <p className="text-sm text-muted-foreground">{c.sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── DIVIDER ─── */}
      <div className="border-t border-border" />

      {/* ─── O QUE VOCÊ VAI TER ─── */}
      <section className="max-w-5xl mx-auto px-4 py-20 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 text-sm font-semibold mb-6">
          <Brain className="h-4 w-4 text-primary" />
          O QUE VOCÊ VAI TER
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-4">
          Tudo que você <span className="text-primary">precisa</span> em um só lugar
        </h2>
        <p className="text-muted-foreground max-w-xl mx-auto mb-12">
          Ferramentas de inteligência artificial desenvolvidas especificamente para quem quer passar no ENEM
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
          {[
            {
              icon: <FileText className="h-6 w-6 text-primary" />,
              bg: "bg-primary/10",
              title: "Correção de Redação",
              desc: "Envie sua redação e receba feedback detalhado em segundos, com nota estimada e sugestões de melhoria para cada competência do ENEM.",
            },
            {
              icon: <Brain className="h-6 w-6 text-emerald-600" />,
              bg: "bg-emerald-100 dark:bg-emerald-950/40",
              title: "Chat Inteligente",
              desc: "Tire suas dúvidas de qualquer matéria, 24 horas por dia. Nossa IA foi treinada especificamente para questões do ENEM.",
            },
            {
              icon: <Target className="h-6 w-6 text-primary" />,
              bg: "bg-primary/10",
              title: "Plano de Estudos",
              desc: "Receba um cronograma personalizado baseado nas suas dificuldades e no tempo disponível até a prova.",
            },
            {
              icon: <MessageCircle className="h-6 w-6 text-primary" />,
              bg: "bg-primary/10",
              title: "Explicações Detalhadas",
              desc: "Não entendeu algo? Peça para a IA explicar de outra forma, com exemplos e analogias até você compreender.",
            },
            {
              icon: <Zap className="h-6 w-6 text-emerald-600" />,
              bg: "bg-emerald-100 dark:bg-emerald-950/40",
              title: "Respostas Instantâneas",
              desc: "Sem esperar pelo professor ou pelo próximo dia de aula. Tire suas dúvidas no momento em que elas surgem.",
            },
            {
              icon: <BookOpen className="h-6 w-6 text-primary" />,
              bg: "bg-primary/10",
              title: "Foco no que Importa",
              desc: "Estude de forma inteligente, focando nos conteúdos que mais caem no ENEM e nas suas maiores dificuldades.",
            },
          ].map((f) => (
            <div key={f.title} className="p-6 rounded-2xl border border-border bg-card shadow-sm hover:shadow-md transition-shadow">
              <div className={`inline-flex p-3 rounded-xl ${f.bg} mb-4`}>
                {f.icon}
              </div>
              <h3 className="font-bold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── DIVIDER ─── */}
      <div className="border-t border-border" />

      {/* ─── 14 FERRAMENTAS ─── */}
      <section className="max-w-6xl mx-auto px-4 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 text-sm font-semibold mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            TUDO QUE VOCÊ PRECISA
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            14 ferramentas poderosas para{" "}
            <span className="text-primary block md:inline">GARANTIR sua aprovação no ENEM 2026</span>
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Enquanto outros estudam no escuro, você terá a{" "}
            <strong className="text-foreground">melhor tecnologia do Brasil</strong> ao seu lado.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {tools.map((t) => (
            <Link
              key={t.title}
              to={t.href}
              className={`relative p-5 rounded-2xl border bg-card hover:shadow-lg transition-all group ${
                t.highlight ? "border-emerald-400 border-2" : "border-border"
              }`}
            >
              {t.badge && (
                <span className="absolute top-3 right-3 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                  {t.badge}
                </span>
              )}
              <div className={`inline-flex p-3 rounded-xl ${t.bg} mb-3`}>
                <span className={t.color}>{t.icon}</span>
              </div>
              <h3 className="font-bold text-foreground mb-1 text-sm leading-snug">{t.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed mb-3">{t.desc}</p>
              <div className="space-y-1">
                <div className="flex items-center gap-1.5 text-xs text-primary font-medium">
                  <Zap className="h-3 w-3 shrink-0" /> {t.tag1}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-primary/70">
                  <CheckCircle2 className="h-3 w-3 shrink-0" /> {t.tag2}
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Price CTA */}
        <div className="text-center mt-12">
          <p className="text-muted-foreground mb-4">
            Tudo isso por menos de <s>R$5</s>{" "}
            <strong className="text-foreground text-lg">R$2,50 por dia</strong>
          </p>
          <Button
            size="lg"
            className="text-base px-10 py-6 rounded-xl font-bold gap-2"
            onClick={() => navigate("/auth")}
          >
            <Sparkles className="h-5 w-5" />
            Quero Todas Essas Ferramentas
            <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* ─── COMPARE ─── */}
      <section className="bg-gradient-to-br from-background via-primary/5 to-background py-20">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border bg-muted/50 text-sm font-semibold mb-6">
              <TrendingUp className="h-4 w-4 text-primary" />
              COMPARE
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
              Por que <span className="text-primary">AprovI.A</span>?
            </h2>
            <p className="text-muted-foreground">
              Veja a diferença entre estudar do jeito tradicional e usar tecnologia a seu favor
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tradicional */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <div className="inline-block bg-foreground text-background text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                Método Tradicional
              </div>
              <div className="flex items-center gap-3 mb-5">
                <X className="h-5 w-5 text-destructive" />
                <span className="font-bold text-lg">Estudando Sozinho</span>
              </div>
              <div className="space-y-3">
                {[
                  { icon: <TrendingUp className="h-4 w-4 rotate-180" />, text: "Estudar sem direção, sem saber por onde começar" },
                  { icon: <Clock className="h-4 w-4" />, text: "Esperar dias pela correção de redação do professor" },
                  { icon: <AlertTriangle className="h-4 w-4" />, text: "Dúvidas que ficam sem resposta até a próxima aula" },
                  { icon: <TrendingUp className="h-4 w-4 rotate-180" />, text: "Não ter feedback sobre sua evolução real" },
                  { icon: <AlertTriangle className="h-4 w-4" />, text: "Perder tempo com conteúdo que não cai na prova" },
                ].map((item) => (
                  <div key={item.text} className="flex items-start gap-3 p-3 rounded-xl bg-muted/50 text-sm text-muted-foreground">
                    <span className="text-muted-foreground/60 mt-0.5 shrink-0">{item.icon}</span>
                    {item.text}
                  </div>
                ))}
              </div>
            </div>

            {/* Com AprovI.A */}
            <div className="rounded-2xl border-2 border-emerald-400 bg-emerald-50 dark:bg-emerald-950/20 p-6">
              <div className="inline-block bg-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-4 uppercase tracking-wide">
                ✨ Com Tecnologia
              </div>
              <div className="flex items-center gap-3 mb-5">
                <CheckCheck className="h-5 w-5 text-emerald-600" />
                <span className="font-bold text-lg text-emerald-700 dark:text-emerald-400">Com AprovI.A</span>
              </div>
              <div className="space-y-3">
                {[
                  "Plano de estudos personalizado para suas dificuldades",
                  "Correção de redação instantânea com feedback detalhado",
                  "Tire dúvidas 24/7 com resposta em segundos",
                  "IA treinada especificamente para o ENEM",
                  "Estude de qualquer lugar, no seu ritmo",
                ].map((item) => (
                  <div key={item} className="flex items-center gap-3 p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-sm font-medium text-emerald-800 dark:text-emerald-300">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-background to-primary/5 p-10">
          <h2 className="text-2xl md:text-3xl font-extrabold mb-3">
            Pronto para estudar de forma{" "}
            <span className="text-primary">mais inteligente</span>?
          </h2>
          <p className="text-muted-foreground mb-6">
            Comece agora e veja como a IA pode transformar sua preparação para o ENEM
          </p>
          <Button
            size="lg"
            className="text-base px-10 py-6 rounded-xl font-bold gap-2 mb-4"
            onClick={() => navigate("/auth")}
          >
            Começar Agora <ArrowRight className="h-5 w-5" />
          </Button>
          <div className="flex flex-wrap justify-center gap-5 mt-4">
            {["7 dias de garantia", "Cancele quando quiser"].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                {t}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── FAQ ─── */}
      <section className="max-w-3xl mx-auto px-4 pb-20 text-center">
        <div className="flex justify-center mb-4">
          <div className="inline-flex p-4 rounded-full bg-primary/10">
            <HelpCircle className="h-8 w-8 text-primary" />
          </div>
        </div>
        <h2 className="text-3xl md:text-4xl font-extrabold mb-3">
          Ainda tem <span className="text-primary">dúvidas</span>?
        </h2>
        <p className="text-muted-foreground mb-10">
          Respondemos as perguntas mais comuns. Se a sua não estiver aqui, é só chamar!
        </p>

        <div className="space-y-3 text-left">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-card overflow-hidden"
            >
              <button
                className="w-full flex items-center justify-between gap-4 p-5 text-left font-semibold text-foreground hover:bg-muted/50 transition-colors"
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary/10 text-primary text-sm font-bold shrink-0">
                    {i + 1}
                  </span>
                  {faq.q}
                </div>
                {openFaq === i ? (
                  <ChevronUp className="h-5 w-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-sm text-muted-foreground leading-relaxed border-t border-border pt-4">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Support box */}
        <div className="mt-10 rounded-2xl border border-border bg-muted/30 p-8">
          <div className="flex justify-center mb-3">
            <MessageCircle className="h-8 w-8 text-primary" />
          </div>
          <h3 className="font-bold text-foreground mb-1">Ainda tem alguma dúvida?</h3>
          <p className="text-sm text-muted-foreground mb-4">Nossa equipe está pronta para te ajudar</p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a href="mailto:suporteaprovia@gmail.com" className="text-primary font-semibold text-sm hover:underline">
              suporteaprovia@gmail.com
            </a>
            <span className="text-muted-foreground hidden sm:block">ou</span>
            <Button asChild variant="outline" size="sm" className="rounded-full gap-1">
              <Link to="/auth">
                Ver Planos e Preços <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        </div>

        {/* Guarantee badge */}
        <div className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-full border border-emerald-300 bg-emerald-50 dark:bg-emerald-950/20 text-sm font-medium text-emerald-700 dark:text-emerald-400">
          <Shield className="h-4 w-4" />
          Você tem <strong className="text-emerald-600">7 dias de garantia</strong> — se não gostar, devolvemos seu dinheiro
        </div>
      </section>

      {/* ─── BLUE FOOTER ─── */}
      <footer className="bg-primary text-primary-foreground">
        <div className="max-w-3xl mx-auto px-4 py-16 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 text-sm font-semibold mb-6">
            <AlertTriangle className="h-4 w-4" />
            ⏰ ENEM 2026 está chegando — Comece sua preparação!
          </div>
          <h2 className="text-3xl md:text-5xl font-extrabold mb-4">
            Sua <span className="underline decoration-emerald-400">aprovação</span> começa aqui
          </h2>
          <p className="text-primary-foreground/80 mb-8 max-w-lg mx-auto">
            Correção de redação instantânea, chat com IA para tirar dúvidas e plano de estudos
            personalizado. Tudo o que você precisa para se preparar de verdade.
          </p>
          <div className="flex flex-wrap justify-center gap-4 mb-8">
            {["Correção em segundos", "IA especializada no ENEM", "Disponível 24/7"].map((t) => (
              <div key={t} className="flex items-center gap-1.5 text-sm font-medium bg-white/20 rounded-full px-4 py-2">
                <Zap className="h-3.5 w-3.5" /> {t}
              </div>
            ))}
          </div>
          <Button
            size="lg"
            variant="secondary"
            className="text-base px-10 py-6 rounded-xl font-bold gap-2 bg-white text-primary hover:bg-white/90"
            onClick={() => navigate("/auth")}
          >
            Começar Agora <ArrowRight className="h-5 w-5" />
          </Button>
        </div>
      </footer>
    </div>
  );
}

import { useEffect, useMemo, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Flame,
  Clock,
  PenTool,
  FileText,
  TrendingUp,
  Calendar,
  Sparkles,
  Trophy,
  Target,
  ArrowUpRight,
  BookOpen,
} from "lucide-react";
import { Link } from "react-router-dom";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Area,
  AreaChart,
  BarChart,
  Bar,
  CartesianGrid,
} from "recharts";
import {
  getRedacoes,
  getSimulados,
  getRotina,
  getUso,
  getAtividades,
  getStreak,
  formatDuracao,
  diaAtualKey,
} from "@/lib/progresso";

const diasOrder = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];
const diasLabel: Record<string, string> = {
  segunda: "Seg",
  terca: "Ter",
  quarta: "Qua",
  quinta: "Qui",
  sexta: "Sex",
  sabado: "Sáb",
  domingo: "Dom",
};

export default function DashboardProgresso() {
  const [tick, setTick] = useState(0);
  // Re-renderiza a cada 30s para refletir novo tempo de uso
  useEffect(() => {
    const id = setInterval(() => setTick((t) => t + 1), 30000);
    return () => clearInterval(id);
  }, []);

  const dados = useMemo(() => {
    const redacoes = getRedacoes();
    const simulados = getSimulados();
    const rotina = getRotina();
    const uso = getUso();
    const atividades = getAtividades();
    const streak = getStreak();
    return { redacoes, simulados, rotina, uso, atividades, streak };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tick]);

  const { redacoes, simulados, rotina, uso, atividades, streak } = dados;

  const totalUso = uso.total;
  const hoje = new Date().toISOString().slice(0, 10);
  const usoHoje = uso.dias?.[hoje] || 0;

  const usoUltimos7 = useMemo(() => {
    const arr: { dia: string; min: number }[] = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0, 10);
      arr.push({
        dia: diasLabel[diasOrder[(d.getDay() + 6) % 7]],
        min: Math.round(((uso.dias?.[key] || 0) / 60) * 10) / 10,
      });
    }
    return arr;
  }, [uso]);

  const notasRedacao = useMemo(
    () =>
      redacoes.slice(-8).map((r, i) => ({
        idx: `R${i + 1}`,
        nota: r.nota,
      })),
    [redacoes]
  );
  const ultimaNota = redacoes.length ? redacoes[redacoes.length - 1].nota : 0;
  const mediaRedacao = redacoes.length
    ? Math.round(redacoes.reduce((a, b) => a + b.nota, 0) / redacoes.length)
    : 0;
  const melhorRedacao = redacoes.length ? Math.max(...redacoes.map((r) => r.nota)) : 0;

  const simuladosConcluidos = simulados.filter((s) => s.concluido).length;

  const diaHoje = diaAtualKey();
  const atividadesHoje = rotina?.rotina?.[diaHoje] || [];
  const progressoRotina = rotina ? Math.min(100, (streak / 7) * 100) : 0;

  const temDados =
    redacoes.length > 0 || simulados.length > 0 || rotina || totalUso > 0;

  return (
    <section className="container mx-auto px-4 py-12 max-w-6xl">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 mb-3">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Meu Progresso
            </span>
          </div>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            Sua jornada rumo à{" "}
            <span className="text-primary">aprovação</span>
          </h2>
          <p className="text-muted-foreground mt-2 max-w-xl">
            Acompanhe rotina, sessões, desempenho em simulados e tempo de estudo em um só lugar.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-br from-orange-500/10 to-red-500/10 border border-orange-500/20">
            <Flame className="h-5 w-5 text-orange-500" />
            <div className="leading-tight">
              <div className="text-xl font-extrabold text-foreground">{streak}</div>
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
                dias seguidos
              </div>
            </div>
          </div>
        </div>
      </div>

      {!temDados && (
        <Card className="mb-8 border-dashed border-2 border-primary/30 bg-gradient-to-br from-primary/5 to-transparent">
          <CardContent className="p-8 text-center">
            <BookOpen className="h-10 w-10 text-primary mx-auto mb-3" />
            <h3 className="text-lg font-bold mb-2">
              Comece agora e veja seu progresso crescer
            </h3>
            <p className="text-sm text-muted-foreground mb-4">
              Gere sua rotina, corrija uma redação ou faça um simulado — os dados aparecerão aqui automaticamente.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <Link to="/rotina" className="text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90">
                Criar rotina
              </Link>
              <Link to="/redacao" className="text-sm px-4 py-2 rounded-lg border border-border font-semibold hover:bg-muted">
                Corrigir redação
              </Link>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats principais */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <StatCard
          icon={<Clock className="h-5 w-5" />}
          label="Tempo total"
          value={formatDuracao(totalUso)}
          hint={`Hoje: ${formatDuracao(usoHoje)}`}
          gradient="from-blue-500/20 to-indigo-500/10"
          iconClass="bg-blue-500/15 text-blue-600 dark:text-blue-400"
        />
        <StatCard
          icon={<PenTool className="h-5 w-5" />}
          label="Redações"
          value={String(redacoes.length)}
          hint={melhorRedacao ? `Melhor: ${melhorRedacao}` : "Nenhuma ainda"}
          gradient="from-emerald-500/20 to-green-500/10"
          iconClass="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400"
        />
        <StatCard
          icon={<FileText className="h-5 w-5" />}
          label="Simulados"
          value={String(simuladosConcluidos)}
          hint={simulados.length ? `${simulados.length} iniciados` : "Nenhum ainda"}
          gradient="from-purple-500/20 to-fuchsia-500/10"
          iconClass="bg-purple-500/15 text-purple-600 dark:text-purple-400"
        />
        <StatCard
          icon={<TrendingUp className="h-5 w-5" />}
          label="Média redação"
          value={mediaRedacao ? String(mediaRedacao) : "—"}
          hint={ultimaNota ? `Última: ${ultimaNota}` : "Sem dados"}
          gradient="from-orange-500/20 to-amber-500/10"
          iconClass="bg-orange-500/15 text-orange-600 dark:text-orange-400"
        />
      </div>

      {/* Rotina + Tempo */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        {/* Rotina de hoje */}
        <Card className="lg:col-span-2 overflow-hidden border-border/60">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="h-4 w-4 text-primary" />
                  <span className="text-xs font-bold uppercase tracking-wider text-primary">
                    Rotina da semana
                  </span>
                </div>
                <h3 className="text-xl font-bold">
                  {rotina ? `Sua agenda de ${capitalize(diaHoje)}` : "Crie sua rotina personalizada"}
                </h3>
              </div>
              <Link
                to="/rotina"
                className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-semibold"
              >
                {rotina ? "Editar" : "Criar"} <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>

            {/* Dias da semana */}
            <div className="grid grid-cols-7 gap-1.5 mb-5">
              {diasOrder.map((d) => {
                const isHoje = d === diaHoje;
                const temAgenda = !!rotina?.rotina?.[d]?.length;
                return (
                  <div
                    key={d}
                    className={`text-center p-2 rounded-lg text-xs font-semibold transition-all ${
                      isHoje
                        ? "bg-primary text-primary-foreground shadow-md scale-105"
                        : temAgenda
                        ? "bg-primary/10 text-primary"
                        : "bg-muted/40 text-muted-foreground"
                    }`}
                  >
                    {diasLabel[d]}
                  </div>
                );
              })}
            </div>

            {rotina ? (
              <>
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {atividadesHoje.length ? (
                    atividadesHoje.slice(0, 6).map((a, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-3 p-2.5 rounded-lg bg-muted/40 hover:bg-muted/60 transition-colors"
                      >
                        <div className="text-xs font-mono font-bold text-primary bg-primary/10 px-2 py-1 rounded">
                          {a.horario}
                        </div>
                        <div className="flex-1 text-sm text-foreground">{a.atividade}</div>
                        <Badge variant="outline" className="text-[10px] uppercase">
                          {a.tipo}
                        </Badge>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-muted-foreground text-center py-4">
                      Descanso hoje. Aproveite!
                    </p>
                  )}
                </div>
                <div className="mt-4 pt-4 border-t border-border/50">
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-muted-foreground">Constância da semana</span>
                    <span className="font-bold text-foreground">{Math.round(progressoRotina)}%</span>
                  </div>
                  <Progress value={progressoRotina} className="h-1.5" />
                </div>
              </>
            ) : (
              <div className="text-center py-6 border-2 border-dashed rounded-xl">
                <p className="text-sm text-muted-foreground mb-3">
                  Gere um plano de estudos personalizado com IA
                </p>
                <Link
                  to="/rotina"
                  className="inline-flex items-center gap-2 text-sm px-4 py-2 rounded-lg bg-primary text-primary-foreground font-semibold hover:opacity-90"
                >
                  <Sparkles className="h-3.5 w-3.5" /> Criar rotina
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Tempo de uso - gráfico */}
        <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-blue-500/5 via-transparent to-indigo-500/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-1">
              <Clock className="h-4 w-4 text-blue-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-blue-500">
                Tempo de estudo
              </span>
            </div>
            <h3 className="text-xl font-bold mb-1">Últimos 7 dias</h3>
            <p className="text-xs text-muted-foreground mb-4">
              Minutos ativos por dia no app
            </p>
            <div className="h-40">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={usoUltimos7} margin={{ top: 5, right: 0, left: -25, bottom: 0 }}>
                  <defs>
                    <linearGradient id="usoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.55} />
                      <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="dia" tick={{ fontSize: 10 }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10 }} axisLine={false} tickLine={false} width={30} />
                  <Tooltip
                    contentStyle={{
                      background: "hsl(var(--background))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                    formatter={(v: number) => [`${v} min`, "Estudo"]}
                  />
                  <Area
                    type="monotone"
                    dataKey="min"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2.5}
                    fill="url(#usoGrad)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Hoje</span>
              <span className="font-bold text-foreground">{formatDuracao(usoHoje)}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Redação evolução + Simulados */}
      <div className="grid lg:grid-cols-3 gap-4 mb-6">
        <Card className="lg:col-span-2 overflow-hidden border-border/60">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <PenTool className="h-4 w-4 text-emerald-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-emerald-500">
                    Evolução — Redação
                  </span>
                </div>
                <h3 className="text-xl font-bold">
                  {redacoes.length ? "Sua curva de aprendizado" : "Comece a corrigir redações"}
                </h3>
              </div>
              <Link
                to="/redacao"
                className="text-xs text-primary hover:underline inline-flex items-center gap-1 font-semibold"
              >
                Nova redação <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
            {redacoes.length ? (
              <div className="h-56">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={notasRedacao} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" opacity={0.4} />
                    <XAxis dataKey="idx" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                    <YAxis
                      domain={[0, 1000]}
                      tick={{ fontSize: 11 }}
                      axisLine={false}
                      tickLine={false}
                      width={40}
                    />
                    <Tooltip
                      contentStyle={{
                        background: "hsl(var(--background))",
                        border: "1px solid hsl(var(--border))",
                        borderRadius: 8,
                        fontSize: 12,
                      }}
                      formatter={(v: number) => [`${v}/1000`, "Nota"]}
                    />
                    <Line
                      type="monotone"
                      dataKey="nota"
                      stroke="hsl(142 76% 36%)"
                      strokeWidth={3}
                      dot={{ r: 5, fill: "hsl(142 76% 36%)" }}
                      activeDot={{ r: 7 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="h-56 flex flex-col items-center justify-center border-2 border-dashed rounded-xl">
                <Trophy className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground">
                  Suas notas aparecerão aqui em um gráfico de evolução
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Simulados */}
        <Card className="overflow-hidden border-border/60 bg-gradient-to-br from-purple-500/5 via-transparent to-fuchsia-500/5">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-1">
              <Target className="h-4 w-4 text-purple-500" />
              <span className="text-xs font-bold uppercase tracking-wider text-purple-500">
                Simulados
              </span>
            </div>
            <h3 className="text-xl font-bold mb-4">Desempenho</h3>

            <div className="space-y-4">
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <span className="text-xs text-muted-foreground">Concluídos</span>
                  <span className="text-3xl font-extrabold text-purple-500">
                    {simuladosConcluidos}
                  </span>
                </div>
                <Progress
                  value={
                    simulados.length
                      ? (simuladosConcluidos / simulados.length) * 100
                      : 0
                  }
                  className="h-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="p-3 rounded-lg bg-muted/40">
                  <div className="text-[10px] uppercase text-muted-foreground font-semibold">
                    Iniciados
                  </div>
                  <div className="text-lg font-bold">{simulados.length}</div>
                </div>
                <div className="p-3 rounded-lg bg-muted/40">
                  <div className="text-[10px] uppercase text-muted-foreground font-semibold">
                    Tempo médio
                  </div>
                  <div className="text-lg font-bold">
                    {simulados.length
                      ? formatDuracao(
                          Math.round(
                            simulados.reduce((a, b) => a + b.duracaoSegundos, 0) /
                              simulados.length
                          )
                        )
                      : "—"}
                  </div>
                </div>
              </div>

              <Link
                to="/simulados"
                className="w-full inline-flex items-center justify-center gap-2 text-sm px-4 py-2.5 rounded-lg bg-purple-500/10 text-purple-600 dark:text-purple-400 font-semibold hover:bg-purple-500/20 transition-colors"
              >
                Fazer simulado <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Atividades recentes */}
      {atividades.length > 0 && (
        <Card className="border-border/60">
          <CardContent className="p-6">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-primary" />
              <h3 className="text-lg font-bold">Atividades recentes</h3>
            </div>
            <ul className="space-y-3">
              {atividades.slice(0, 6).map((a, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${dotColor(a.tipo)}`} />
                  <div className="flex-1 text-sm text-foreground">{a.descricao}</div>
                  <div className="text-xs text-muted-foreground">
                    {formatRelativo(a.data)}
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}
    </section>
  );
}

function StatCard({
  icon,
  label,
  value,
  hint,
  gradient,
  iconClass,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  hint: string;
  gradient: string;
  iconClass: string;
}) {
  return (
    <Card className={`overflow-hidden border-border/60 bg-gradient-to-br ${gradient}`}>
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <div className={`p-2 rounded-lg ${iconClass}`}>{icon}</div>
        </div>
        <div className="text-2xl md:text-3xl font-extrabold text-foreground leading-tight">
          {value}
        </div>
        <div className="text-xs font-semibold text-foreground/80 mt-1">{label}</div>
        <div className="text-[10px] text-muted-foreground mt-0.5">{hint}</div>
      </CardContent>
    </Card>
  );
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
function dotColor(t: string) {
  switch (t) {
    case "redacao":
      return "bg-emerald-500";
    case "simulado":
      return "bg-purple-500";
    case "rotina":
      return "bg-primary";
    default:
      return "bg-orange-500";
  }
}
function formatRelativo(iso: string): string {
  const d = new Date(iso);
  const diff = Date.now() - d.getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `${min}min atrás`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h atrás`;
  const dias = Math.floor(h / 24);
  return `${dias}d atrás`;
}

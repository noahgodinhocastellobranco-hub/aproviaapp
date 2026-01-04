import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Layout } from "@/components/Layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, Legend
} from "recharts";
import {
  TrendingUp, TrendingDown, Target, Clock, BookOpen, FileText,
  Award, Calendar, Loader2, AlertCircle
} from "lucide-react";
import { format, subMonths, startOfMonth, endOfMonth } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ResultadoProva {
  id: string;
  area: string;
  nota: number;
  acertos: number;
  total_questoes: number;
  tempo_gasto: number | null;
  created_at: string;
}

interface ResultadoRedacao {
  id: string;
  tema: string;
  nota_total: number;
  competencia_1: number | null;
  competencia_2: number | null;
  competencia_3: number | null;
  competencia_4: number | null;
  competencia_5: number | null;
  created_at: string;
}

interface TempoEstudo {
  materia: string;
  minutos: number;
  data: string;
}

const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

const areasNomes: Record<string, string> = {
  linguagens: "Linguagens",
  matematica: "Matemática",
  natureza: "Ciências da Natureza",
  humanas: "Ciências Humanas"
};

export default function Desempenho() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [mesSelecionado, setMesSelecionado] = useState(() => format(new Date(), "yyyy-MM"));
  const [provas, setProvas] = useState<ResultadoProva[]>([]);
  const [redacoes, setRedacoes] = useState<ResultadoRedacao[]>([]);
  const [tempoEstudo, setTempoEstudo] = useState<TempoEstudo[]>([]);
  const [provasAnterior, setProvasAnterior] = useState<ResultadoProva[]>([]);
  const [redacoesAnterior, setRedacoesAnterior] = useState<ResultadoRedacao[]>([]);

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate("/auth");
        return;
      }
      fetchData(session.user.id);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      if (!session) {
        navigate("/auth");
      }
    });

    checkAuth();
    return () => subscription.unsubscribe();
  }, [navigate, mesSelecionado]);

  const fetchData = async (userId: string) => {
    setLoading(true);
    const [ano, mes] = mesSelecionado.split("-").map(Number);
    const inicioMes = startOfMonth(new Date(ano, mes - 1));
    const fimMes = endOfMonth(new Date(ano, mes - 1));
    const mesAnterior = subMonths(inicioMes, 1);
    const fimMesAnterior = endOfMonth(mesAnterior);

    const [provasRes, redacoesRes, tempoRes, provasAntRes, redacoesAntRes] = await Promise.all([
      supabase
        .from("resultados_provas")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", inicioMes.toISOString())
        .lte("created_at", fimMes.toISOString())
        .order("created_at", { ascending: true }),
      supabase
        .from("resultados_redacoes")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", inicioMes.toISOString())
        .lte("created_at", fimMes.toISOString())
        .order("created_at", { ascending: true }),
      supabase
        .from("tempo_estudo")
        .select("*")
        .eq("user_id", userId)
        .gte("data", format(inicioMes, "yyyy-MM-dd"))
        .lte("data", format(fimMes, "yyyy-MM-dd")),
      supabase
        .from("resultados_provas")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", mesAnterior.toISOString())
        .lte("created_at", fimMesAnterior.toISOString()),
      supabase
        .from("resultados_redacoes")
        .select("*")
        .eq("user_id", userId)
        .gte("created_at", mesAnterior.toISOString())
        .lte("created_at", fimMesAnterior.toISOString())
    ]);

    setProvas(provasRes.data || []);
    setRedacoes(redacoesRes.data || []);
    setTempoEstudo(tempoRes.data || []);
    setProvasAnterior(provasAntRes.data || []);
    setRedacoesAnterior(redacoesAntRes.data || []);
    setLoading(false);
  };

  const calcularMediaProvas = (lista: ResultadoProva[]) => {
    if (lista.length === 0) return 0;
    return lista.reduce((acc, p) => acc + Number(p.nota), 0) / lista.length;
  };

  const calcularMediaRedacoes = (lista: ResultadoRedacao[]) => {
    if (lista.length === 0) return 0;
    return lista.reduce((acc, r) => acc + Number(r.nota_total), 0) / lista.length;
  };

  const calcularTotalHoras = () => {
    return Math.round(tempoEstudo.reduce((acc, t) => acc + t.minutos, 0) / 60);
  };

  const mediaProvasAtual = calcularMediaProvas(provas);
  const mediaProvasAnterior = calcularMediaProvas(provasAnterior);
  const mediaRedacoesAtual = calcularMediaRedacoes(redacoes);
  const mediaRedacoesAnterior = calcularMediaRedacoes(redacoesAnterior);

  const evolucaoProvas = mediaProvasAnterior > 0 
    ? ((mediaProvasAtual - mediaProvasAnterior) / mediaProvasAnterior * 100).toFixed(1)
    : null;

  const evolucaoRedacoes = mediaRedacoesAnterior > 0
    ? ((mediaRedacoesAtual - mediaRedacoesAnterior) / mediaRedacoesAnterior * 100).toFixed(1)
    : null;

  const dadosPorArea = Object.keys(areasNomes).map(area => {
    const provasArea = provas.filter(p => p.area === area);
    const media = provasArea.length > 0
      ? provasArea.reduce((acc, p) => acc + Number(p.nota), 0) / provasArea.length
      : 0;
    return {
      area: areasNomes[area],
      media: Math.round(media),
      quantidade: provasArea.length
    };
  });

  const dadosRedacaoCompetencias = redacoes.length > 0 ? [
    { name: "C1 - Norma culta", value: Math.round(redacoes.reduce((acc, r) => acc + (Number(r.competencia_1) || 0), 0) / redacoes.length) },
    { name: "C2 - Compreensão", value: Math.round(redacoes.reduce((acc, r) => acc + (Number(r.competencia_2) || 0), 0) / redacoes.length) },
    { name: "C3 - Argumentação", value: Math.round(redacoes.reduce((acc, r) => acc + (Number(r.competencia_3) || 0), 0) / redacoes.length) },
    { name: "C4 - Coesão", value: Math.round(redacoes.reduce((acc, r) => acc + (Number(r.competencia_4) || 0), 0) / redacoes.length) },
    { name: "C5 - Proposta", value: Math.round(redacoes.reduce((acc, r) => acc + (Number(r.competencia_5) || 0), 0) / redacoes.length) },
  ] : [];

  const dadosTempoEstudo = Object.entries(
    tempoEstudo.reduce((acc, t) => {
      acc[t.materia] = (acc[t.materia] || 0) + t.minutos;
      return acc;
    }, {} as Record<string, number>)
  ).map(([materia, minutos]) => ({
    materia,
    horas: Math.round(minutos / 60 * 10) / 10
  }));

  const evolucaoNotas = provas.map(p => ({
    data: format(new Date(p.created_at), "dd/MM"),
    nota: Number(p.nota),
    area: areasNomes[p.area] || p.area
  }));

  const meses = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(new Date(), i);
    return { value: format(d, "yyyy-MM"), label: format(d, "MMMM yyyy", { locale: ptBR }) };
  });

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Layout>
    );
  }

  const temDados = provas.length > 0 || redacoes.length > 0 || tempoEstudo.length > 0;

  return (
    <Layout>
      <div className="container mx-auto p-4 md:p-6 space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
              <Target className="h-7 w-7 text-primary" />
              Relatório de Desempenho
            </h1>
            <p className="text-muted-foreground">
              Acompanhe sua evolução mensal nos estudos
            </p>
          </div>
          <Select value={mesSelecionado} onValueChange={setMesSelecionado}>
            <SelectTrigger className="w-48">
              <Calendar className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {meses.map(m => (
                <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {!temDados ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-16">
              <AlertCircle className="h-16 w-16 text-muted-foreground mb-4" />
              <h2 className="text-xl font-semibold mb-2">Nenhum dado encontrado</h2>
              <p className="text-muted-foreground text-center max-w-md">
                Faça provas simuladas, escreva redações e registre seu tempo de estudo para ver seu desempenho aqui.
              </p>
            </CardContent>
          </Card>
        ) : (
          <>
            {/* Cards de resumo */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Média Provas
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold">{mediaProvasAtual.toFixed(0)}</span>
                    {evolucaoProvas && (
                      <Badge variant={Number(evolucaoProvas) >= 0 ? "default" : "destructive"} className="flex items-center gap-1">
                        {Number(evolucaoProvas) >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {evolucaoProvas}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{provas.length} prova(s) realizadas</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Média Redações
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-end justify-between">
                    <span className="text-3xl font-bold">{mediaRedacoesAtual.toFixed(0)}</span>
                    {evolucaoRedacoes && (
                      <Badge variant={Number(evolucaoRedacoes) >= 0 ? "default" : "destructive"} className="flex items-center gap-1">
                        {Number(evolucaoRedacoes) >= 0 ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
                        {evolucaoRedacoes}%
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{redacoes.length} redação(ões)</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Horas de Estudo
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <span className="text-3xl font-bold">{calcularTotalHoras()}h</span>
                  <p className="text-xs text-muted-foreground mt-1">
                    Média de {(calcularTotalHoras() / 30).toFixed(1)}h/dia
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Melhor Área
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {dadosPorArea.filter(d => d.quantidade > 0).length > 0 ? (
                    <>
                      <span className="text-xl font-bold">
                        {dadosPorArea.filter(d => d.quantidade > 0).sort((a, b) => b.media - a.media)[0]?.area}
                      </span>
                      <p className="text-xs text-muted-foreground mt-1">
                        Média: {dadosPorArea.filter(d => d.quantidade > 0).sort((a, b) => b.media - a.media)[0]?.media} pontos
                      </p>
                    </>
                  ) : (
                    <span className="text-muted-foreground">Sem dados</span>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Gráficos */}
            <Tabs defaultValue="provas" className="space-y-4">
              <TabsList>
                <TabsTrigger value="provas">Provas</TabsTrigger>
                <TabsTrigger value="redacoes">Redações</TabsTrigger>
                <TabsTrigger value="tempo">Tempo de Estudo</TabsTrigger>
              </TabsList>

              <TabsContent value="provas" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Desempenho por Área</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={dadosPorArea}>
                          <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                          <XAxis dataKey="area" tick={{ fontSize: 12 }} />
                          <YAxis domain={[0, 1000]} />
                          <Tooltip />
                          <Bar dataKey="media" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Evolução das Notas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {evolucaoNotas.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <LineChart data={evolucaoNotas}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="data" />
                            <YAxis domain={[0, 1000]} />
                            <Tooltip />
                            <Line type="monotone" dataKey="nota" stroke="hsl(var(--primary))" strokeWidth={2} dot={{ fill: "hsl(var(--primary))" }} />
                          </LineChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                          Nenhuma prova realizada ainda
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="redacoes" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Média por Competência</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dadosRedacaoCompetencias.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={dadosRedacaoCompetencias} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis type="number" domain={[0, 200]} />
                            <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                            <Tooltip />
                            <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                          Nenhuma redação corrigida ainda
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Progresso nas Competências</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {dadosRedacaoCompetencias.length > 0 ? (
                        dadosRedacaoCompetencias.map((comp, i) => (
                          <div key={comp.name} className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span>{comp.name}</span>
                              <span className="font-medium">{comp.value}/200</span>
                            </div>
                            <Progress value={(comp.value / 200) * 100} className="h-2" />
                          </div>
                        ))
                      ) : (
                        <div className="h-[240px] flex items-center justify-center text-muted-foreground">
                          Nenhuma redação corrigida ainda
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="tempo" className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Horas por Matéria</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dadosTempoEstudo.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <PieChart>
                            <Pie
                              data={dadosTempoEstudo}
                              cx="50%"
                              cy="50%"
                              labelLine={false}
                              outerRadius={100}
                              dataKey="horas"
                              nameKey="materia"
                              label={({ materia, horas }) => `${materia}: ${horas}h`}
                            >
                              {dadosTempoEstudo.map((_, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                              ))}
                            </Pie>
                            <Tooltip />
                            <Legend />
                          </PieChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                          Nenhum tempo de estudo registrado
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Distribuição de Estudo</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {dadosTempoEstudo.length > 0 ? (
                        <ResponsiveContainer width="100%" height={300}>
                          <BarChart data={dadosTempoEstudo}>
                            <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
                            <XAxis dataKey="materia" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="horas" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                          Nenhum tempo de estudo registrado
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </>
        )}
      </div>
    </Layout>
  );
}

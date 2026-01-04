import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  ArrowRight, 
  Clock, 
  FileText, 
  CheckCircle2, 
  XCircle,
  BookOpen,
  Target,
  TrendingUp,
  AlertCircle,
  Loader2,
  Play,
  RotateCcw,
  Send
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Questao {
  numero: number;
  competencia: string;
  textoBase: string;
  fonte: string;
  enunciado: string;
  alternativas: {
    A: string;
    B: string;
    C: string;
    D: string;
    E: string;
  };
  gabarito: string;
  explicacao: string;
}

interface CorrecaoQuestao {
  numero: number;
  competencia: string;
  respostaUsuario: string;
  gabarito: string;
  acertou: boolean;
  explicacao: string;
}

interface CompetenciaRedacao {
  numero: number;
  nota: number;
  justificativa: string;
  pontosMelhorar: string[];
}

interface CorrecaoRedacao {
  competencias: CompetenciaRedacao[];
  notaTotal: number;
  feedbackGeral: string;
  pontosFortes: string[];
  pontosMelhorar: string[];
}

interface FeedbackPersonalizado {
  feedbackGeral: string;
  areasEstudar: string[];
  dicasEstudo: string[];
  metaProximaProva: string;
}

interface ResultadoProva {
  questoes: {
    total: number;
    acertos: number;
    erros: number;
    percentual: number;
    notaEstimada: number;
    correcao: CorrecaoQuestao[];
    competenciasErradas: string[];
  };
  redacao: CorrecaoRedacao | null;
  feedback: FeedbackPersonalizado | null;
}

type AreaProva = "linguagens" | "matematica" | "natureza" | "humanas";
type EtapaProva = "selecao" | "questoes" | "redacao" | "corrigindo" | "resultado";

const QUESTOES_POR_AREA = 10;
const TEMPO_PROVA = 5400; // 90 minutos em segundos

const temasRedacao = [
  "Os desafios da saúde mental entre os jovens brasileiros na era digital",
  "A importância da educação financeira para a formação cidadã",
  "Os impactos da inteligência artificial no mercado de trabalho brasileiro",
  "Caminhos para combater a desinformação nas redes sociais",
  "A valorização do patrimônio cultural imaterial brasileiro",
  "Desafios para o acesso à água potável no Brasil",
  "A persistência da violência contra a mulher na sociedade brasileira",
  "Os desafios da mobilidade urbana nas grandes cidades",
  "A importância da preservação da memória histórica nacional",
  "Caminhos para a inclusão de pessoas com deficiência no mercado de trabalho"
];

const areasInfo: Record<AreaProva, { nome: string; cor: string; icon: string }> = {
  linguagens: { nome: "Linguagens e Códigos", cor: "bg-blue-500", icon: "📚" },
  matematica: { nome: "Matemática", cor: "bg-green-500", icon: "📐" },
  natureza: { nome: "Ciências da Natureza", cor: "bg-purple-500", icon: "🔬" },
  humanas: { nome: "Ciências Humanas", cor: "bg-orange-500", icon: "🌍" }
};

export default function ProvaENEM() {
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState<EtapaProva>("selecao");
  const [areasSelecionadas, setAreasSelecionadas] = useState<AreaProva[]>([]);
  const [incluirRedacao, setIncluirRedacao] = useState(true);
  const [questoes, setQuestoes] = useState<Questao[]>([]);
  const [questaoAtual, setQuestaoAtual] = useState(0);
  const [respostas, setRespostas] = useState<Record<number, string>>({});
  const [redacao, setRedacao] = useState("");
  const [temaRedacao, setTemaRedacao] = useState("");
  const [tempoRestante, setTempoRestante] = useState(TEMPO_PROVA);
  const [provaIniciada, setProvaIniciada] = useState(false);
  const [carregandoQuestoes, setCarregandoQuestoes] = useState(false);
  const [resultado, setResultado] = useState<ResultadoProva | null>(null);
  const [provaId] = useState(() => `prova_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`);

  // Timer da prova
  useEffect(() => {
    if (!provaIniciada || etapa === "resultado" || etapa === "corrigindo") return;

    const timer = setInterval(() => {
      setTempoRestante((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          toast({
            title: "⏰ Tempo esgotado!",
            description: "Sua prova será enviada automaticamente.",
            variant: "destructive"
          });
          finalizarProva();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [provaIniciada, etapa]);

  const formatarTempo = (segundos: number) => {
    const h = Math.floor(segundos / 3600);
    const m = Math.floor((segundos % 3600) / 60);
    const s = segundos % 60;
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  const toggleArea = (area: AreaProva) => {
    setAreasSelecionadas((prev) =>
      prev.includes(area) ? prev.filter((a) => a !== area) : [...prev, area]
    );
  };

  const iniciarProva = async () => {
    if (areasSelecionadas.length === 0) {
      toast({
        title: "Selecione pelo menos uma área",
        description: "Escolha as áreas de conhecimento para sua prova.",
        variant: "destructive"
      });
      return;
    }

    setCarregandoQuestoes(true);
    setTemaRedacao(temasRedacao[Math.floor(Math.random() * temasRedacao.length)]);

    try {
      const todasQuestoes: Questao[] = [];
      let numeroBase = 1;

      for (const area of areasSelecionadas) {
        const { data, error } = await supabase.functions.invoke("gerar-prova-enem", {
          body: { area, quantidade: QUESTOES_POR_AREA, provaId }
        });

        if (error) throw error;

        const questoesArea = data.questoes.map((q: Questao, idx: number) => ({
          ...q,
          numero: numeroBase + idx
        }));
        todasQuestoes.push(...questoesArea);
        numeroBase += QUESTOES_POR_AREA;
      }

      setQuestoes(todasQuestoes);
      setProvaIniciada(true);
      setEtapa("questoes");
      setTempoRestante(TEMPO_PROVA + (incluirRedacao ? 1800 : 0)); // +30min se tiver redação
    } catch (error) {
      console.error("Erro ao gerar questões:", error);
      toast({
        title: "Erro ao gerar prova",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setCarregandoQuestoes(false);
    }
  };

  const responderQuestao = (alternativa: string) => {
    setRespostas((prev) => ({
      ...prev,
      [questoes[questaoAtual].numero]: alternativa
    }));
  };

  const proximaQuestao = () => {
    if (questaoAtual < questoes.length - 1) {
      setQuestaoAtual((prev) => prev + 1);
    } else if (incluirRedacao) {
      setEtapa("redacao");
    } else {
      finalizarProva();
    }
  };

  const questaoAnterior = () => {
    if (questaoAtual > 0) {
      setQuestaoAtual((prev) => prev - 1);
    }
  };

  const irParaQuestao = (numero: number) => {
    const idx = questoes.findIndex((q) => q.numero === numero);
    if (idx >= 0) {
      setQuestaoAtual(idx);
      setEtapa("questoes");
    }
  };

  const finalizarProva = async () => {
    setEtapa("corrigindo");

    try {
      const { data, error } = await supabase.functions.invoke("corrigir-prova-enem", {
        body: {
          respostas,
          questoes,
          redacao: incluirRedacao ? redacao : null,
          temaRedacao
        }
      });

      if (error) throw error;

      setResultado(data);
      setEtapa("resultado");
    } catch (error) {
      console.error("Erro ao corrigir prova:", error);
      toast({
        title: "Erro ao corrigir prova",
        description: "Tente novamente.",
        variant: "destructive"
      });
      setEtapa("questoes");
    }
  };

  const reiniciarProva = () => {
    setEtapa("selecao");
    setAreasSelecionadas([]);
    setQuestoes([]);
    setQuestaoAtual(0);
    setRespostas({});
    setRedacao("");
    setProvaIniciada(false);
    setResultado(null);
    setTempoRestante(TEMPO_PROVA);
  };

  // Renderização da seleção de áreas
  if (etapa === "selecao") {
    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar
          </Button>

          <div className="text-center space-y-2">
            <h1 className="text-3xl font-bold">Simulado ENEM - AprovI.A</h1>
            <p className="text-muted-foreground">
              Prova exclusiva gerada por IA com questões no nível do ENEM
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BookOpen className="h-5 w-5" />
                Selecione as Áreas de Conhecimento
              </CardTitle>
              <CardDescription>
                Escolha quais áreas você quer incluir na sua prova. Cada área terá {QUESTOES_POR_AREA} questões.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(Object.keys(areasInfo) as AreaProva[]).map((area) => (
                  <Card
                    key={area}
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      areasSelecionadas.includes(area)
                        ? "ring-2 ring-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    }`}
                    onClick={() => toggleArea(area)}
                  >
                    <CardContent className="p-4 flex items-center gap-4">
                      <div className={`text-3xl`}>{areasInfo[area].icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold">{areasInfo[area].nome}</h3>
                        <p className="text-sm text-muted-foreground">
                          {QUESTOES_POR_AREA} questões
                        </p>
                      </div>
                      {areasSelecionadas.includes(area) && (
                        <CheckCircle2 className="h-6 w-6 text-primary" />
                      )}
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  incluirRedacao ? "ring-2 ring-primary bg-primary/5" : "hover:bg-muted/50"
                }`}
                onClick={() => setIncluirRedacao(!incluirRedacao)}
              >
                <CardContent className="p-4 flex items-center gap-4">
                  <div className="text-3xl">✍️</div>
                  <div className="flex-1">
                    <h3 className="font-semibold">Redação</h3>
                    <p className="text-sm text-muted-foreground">
                      Dissertativo-argumentativa no modelo ENEM (+30 minutos)
                    </p>
                  </div>
                  {incluirRedacao && <CheckCircle2 className="h-6 w-6 text-primary" />}
                </CardContent>
              </Card>

              <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                <h4 className="font-medium flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  Resumo da Prova
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {areasSelecionadas.length * QUESTOES_POR_AREA} questões objetivas</li>
                  <li>• {incluirRedacao ? "1 redação dissertativa" : "Sem redação"}</li>
                  <li>
                    • Tempo estimado:{" "}
                    {Math.round((areasSelecionadas.length * QUESTOES_POR_AREA * 3 + (incluirRedacao ? 60 : 0)))} minutos
                  </li>
                </ul>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={iniciarProva}
                disabled={carregandoQuestoes || areasSelecionadas.length === 0}
              >
                {carregandoQuestoes ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Gerando questões exclusivas...
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4" />
                    Iniciar Prova
                  </>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Renderização das questões
  if (etapa === "questoes" && questoes.length > 0) {
    const questaoAtualData = questoes[questaoAtual];
    const progresso = ((questaoAtual + 1) / questoes.length) * 100;
    const questoesRespondidas = Object.keys(respostas).length;

    return (
      <div className="min-h-screen bg-background">
        {/* Header fixo */}
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b p-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Badge variant="outline" className="text-lg px-3 py-1">
                {questaoAtual + 1}/{questoes.length}
              </Badge>
              <div className="hidden md:block">
                <Progress value={progresso} className="w-32" />
              </div>
            </div>

            <div className={`flex items-center gap-2 font-mono text-lg ${
              tempoRestante < 600 ? "text-destructive" : ""
            }`}>
              <Clock className="h-5 w-5" />
              {formatarTempo(tempoRestante)}
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {questoesRespondidas} respondidas
              </Badge>
              {incluirRedacao && (
                <Button variant="outline" size="sm" onClick={() => setEtapa("redacao")}>
                  <FileText className="h-4 w-4 mr-1" />
                  Redação
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-4 md:p-8 grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Questão principal */}
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <Badge className={areasInfo[areasSelecionadas[Math.floor(questaoAtual / QUESTOES_POR_AREA)] || "linguagens"].cor}>
                    {questaoAtualData.competencia}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Questão {questaoAtualData.numero}
                  </span>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-muted/50 rounded-lg p-4 space-y-2">
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {questaoAtualData.textoBase}
                  </p>
                  <p className="text-xs text-muted-foreground italic">
                    {questaoAtualData.fonte}
                  </p>
                </div>

                <p className="font-medium">{questaoAtualData.enunciado}</p>

                <div className="space-y-3">
                  {(["A", "B", "C", "D", "E"] as const).map((letra) => (
                    <button
                      key={letra}
                      onClick={() => responderQuestao(letra)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        respostas[questaoAtualData.numero] === letra
                          ? "border-primary bg-primary/10 ring-2 ring-primary"
                          : "border-border hover:border-primary/50 hover:bg-muted/50"
                      }`}
                    >
                      <div className="flex gap-3">
                        <span className={`font-bold ${
                          respostas[questaoAtualData.numero] === letra
                            ? "text-primary"
                            : "text-muted-foreground"
                        }`}>
                          {letra})
                        </span>
                        <span>{questaoAtualData.alternativas[letra]}</span>
                      </div>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={questaoAnterior}
                disabled={questaoAtual === 0}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Anterior
              </Button>

              <Button onClick={proximaQuestao}>
                {questaoAtual === questoes.length - 1 ? (
                  incluirRedacao ? (
                    <>
                      Ir para Redação
                      <FileText className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Finalizar Prova
                      <Send className="ml-2 h-4 w-4" />
                    </>
                  )
                ) : (
                  <>
                    Próxima
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Navegação lateral */}
          <div className="hidden lg:block">
            <Card className="sticky top-24">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm">Navegação</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-5 gap-2">
                  {questoes.map((q, idx) => (
                    <button
                      key={q.numero}
                      onClick={() => setQuestaoAtual(idx)}
                      className={`aspect-square rounded-md text-sm font-medium transition-colors ${
                        idx === questaoAtual
                          ? "bg-primary text-primary-foreground"
                          : respostas[q.numero]
                          ? "bg-green-500/20 text-green-700 dark:text-green-400"
                          : "bg-muted hover:bg-muted/80"
                      }`}
                    >
                      {q.numero}
                    </button>
                  ))}
                </div>
                <Button
                  className="w-full mt-4"
                  variant="destructive"
                  onClick={finalizarProva}
                >
                  Finalizar Prova
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // Renderização da redação
  if (etapa === "redacao") {
    const palavras = redacao.trim().split(/\s+/).filter(Boolean).length;
    const linhas = redacao.split("\n").length;

    return (
      <div className="min-h-screen bg-background">
        <div className="sticky top-0 z-10 bg-background/95 backdrop-blur border-b p-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <Button variant="ghost" onClick={() => setEtapa("questoes")}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Voltar às questões
            </Button>

            <div className={`flex items-center gap-2 font-mono text-lg ${
              tempoRestante < 600 ? "text-destructive" : ""
            }`}>
              <Clock className="h-5 w-5" />
              {formatarTempo(tempoRestante)}
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Redação
              </CardTitle>
              <CardDescription>
                Escreva uma redação dissertativo-argumentativa sobre o tema proposto.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
                <h3 className="font-semibold text-primary mb-2">TEMA:</h3>
                <p className="text-lg font-medium">{temaRedacao}</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4 text-sm space-y-2">
                <h4 className="font-medium">Instruções:</h4>
                <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                  <li>Escreva uma redação de no mínimo 7 e no máximo 30 linhas</li>
                  <li>Use a norma culta da língua portuguesa</li>
                  <li>Apresente tese, argumentos e proposta de intervenção</li>
                  <li>Respeite os direitos humanos</li>
                </ul>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Palavras: {palavras}</span>
                  <span>Linhas estimadas: {Math.ceil(palavras / 10)}</span>
                </div>
                <Textarea
                  value={redacao}
                  onChange={(e) => setRedacao(e.target.value)}
                  placeholder="Escreva sua redação aqui..."
                  className="min-h-[400px] font-serif text-base leading-relaxed"
                />
              </div>

              <Button className="w-full" size="lg" onClick={finalizarProva}>
                <Send className="mr-2 h-4 w-4" />
                Finalizar Prova
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Corrigindo prova
  if (etapa === "corrigindo") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center">
          <CardContent className="pt-8 pb-8 space-y-4">
            <Loader2 className="h-16 w-16 animate-spin mx-auto text-primary" />
            <h2 className="text-xl font-semibold">Corrigindo sua prova...</h2>
            <p className="text-muted-foreground">
              Estamos analisando suas respostas e gerando um feedback personalizado.
              Isso pode levar alguns segundos.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Resultado da prova
  if (etapa === "resultado" && resultado) {
    // Nota objetiva máxima real do ENEM é ~900 (histórico)
    // Redação máxima é 1000
    const notaObjetiva = resultado.questoes.notaEstimada;
    const notaRedacao = resultado.redacao?.notaTotal || 0;
    const notaTotal = notaObjetiva + notaRedacao;
    const notaMaxima = 900 + (incluirRedacao ? 1000 : 0);

    return (
      <div className="min-h-screen bg-background p-4 md:p-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Resultado da Prova</h1>
            <Button onClick={reiniciarProva}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Nova Prova
            </Button>
          </div>

          {/* Resumo geral */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-primary">
                  {notaTotal.toFixed(0)}
                </div>
                <p className="text-sm text-muted-foreground">
                  de {notaMaxima} pontos
                </p>
                <p className="mt-2 font-medium">Nota Total Estimada</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold text-green-600">
                  {resultado.questoes.acertos}
                </div>
                <p className="text-sm text-muted-foreground">
                  de {resultado.questoes.total} questões
                </p>
                <p className="mt-2 font-medium">Acertos</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6 text-center">
                <div className="text-4xl font-bold">
                  {resultado.questoes.percentual}%
                </div>
                <p className="text-sm text-muted-foreground">taxa de acerto</p>
                <Progress value={resultado.questoes.percentual} className="mt-2" />
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="feedback" className="space-y-4">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="feedback">Feedback</TabsTrigger>
              <TabsTrigger value="questoes">Questões</TabsTrigger>
              {resultado.redacao && <TabsTrigger value="redacao">Redação</TabsTrigger>}
            </TabsList>

            <TabsContent value="feedback" className="space-y-4">
              {resultado.feedback && (
                <>
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        Análise do Desempenho
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground whitespace-pre-wrap">
                        {resultado.feedback.feedbackGeral}
                      </p>
                    </CardContent>
                  </Card>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-orange-500" />
                          Áreas para Estudar
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {resultado.feedback.areasEstudar.map((area, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-orange-500">•</span>
                              {area}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="text-lg flex items-center gap-2">
                          <TrendingUp className="h-5 w-5 text-green-500" />
                          Dicas de Estudo
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {resultado.feedback.dicasEstudo.map((dica, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-green-500">•</span>
                              {dica}
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>

                  <Card className="bg-primary/5 border-primary/20">
                    <CardContent className="pt-6">
                      <h3 className="font-semibold mb-2">🎯 Meta para a Próxima Prova</h3>
                      <p className="text-muted-foreground">{resultado.feedback.metaProximaProva}</p>
                    </CardContent>
                  </Card>
                </>
              )}

              {resultado.questoes.competenciasErradas.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Competências com Erros</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {resultado.questoes.competenciasErradas.map((comp, idx) => (
                        <Badge key={idx} variant="destructive">
                          {comp}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="questoes">
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {resultado.questoes.correcao.map((correcao) => {
                    const questao = questoes.find((q) => q.numero === correcao.numero);
                    return (
                      <Card key={correcao.numero} className={correcao.acertou ? "border-green-500/30" : "border-destructive/30"}>
                        <CardHeader className="pb-2">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              {correcao.acertou ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : (
                                <XCircle className="h-5 w-5 text-destructive" />
                              )}
                              <span className="font-medium">Questão {correcao.numero}</span>
                            </div>
                            <Badge variant="outline">{correcao.competencia}</Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {questao && (
                            <p className="text-sm text-muted-foreground">
                              {questao.enunciado}
                            </p>
                          )}
                          <div className="grid grid-cols-2 gap-2 text-sm">
                            <div className={`p-2 rounded ${
                              correcao.respostaUsuario === correcao.gabarito
                                ? "bg-green-500/20"
                                : "bg-destructive/20"
                            }`}>
                              <span className="font-medium">Sua resposta: </span>
                              {correcao.respostaUsuario || "Não respondida"}
                            </div>
                            <div className="p-2 rounded bg-green-500/20">
                              <span className="font-medium">Gabarito: </span>
                              {correcao.gabarito}
                            </div>
                          </div>
                          <div className="bg-muted/50 rounded-lg p-3 text-sm">
                            <p className="font-medium mb-1">Explicação:</p>
                            <p className="text-muted-foreground">{correcao.explicacao}</p>
                          </div>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              </ScrollArea>
            </TabsContent>

            {resultado.redacao && (
              <TabsContent value="redacao" className="space-y-4">
                <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
                  <CardContent className="pt-6 text-center">
                    <div className="text-5xl font-bold text-primary">
                      {resultado.redacao.notaTotal}
                    </div>
                    <p className="text-muted-foreground">de 1000 pontos</p>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {resultado.redacao.competencias.map((comp) => (
                    <Card key={comp.numero}>
                      <CardContent className="pt-4 text-center">
                        <div className="text-2xl font-bold">{comp.nota}</div>
                        <p className="text-xs text-muted-foreground">
                          Competência {comp.numero}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle>Feedback Detalhado</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">{resultado.redacao.feedbackGeral}</p>

                    {resultado.redacao.competencias.map((comp) => (
                      <div key={comp.numero} className="border-t pt-4">
                        <h4 className="font-medium mb-2">
                          Competência {comp.numero} - {comp.nota}/200
                        </h4>
                        <p className="text-sm text-muted-foreground mb-2">
                          {comp.justificativa}
                        </p>
                        {comp.pontosMelhorar.length > 0 && (
                          <ul className="text-sm space-y-1">
                            {comp.pontosMelhorar.map((ponto, idx) => (
                              <li key={idx} className="text-orange-600 dark:text-orange-400">
                                • {ponto}
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>
            )}
          </Tabs>
        </div>
      </div>
    );
  }

  return null;
}

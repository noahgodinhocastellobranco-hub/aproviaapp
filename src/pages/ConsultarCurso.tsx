import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ArrowLeft, 
  Search, 
  GraduationCap, 
  Target, 
  BookOpen, 
  TrendingUp,
  Briefcase,
  Lightbulb,
  Star,
  Loader2,
  Building2,
  DollarSign,
  Clock,
  CheckCircle2,
  Calculator,
  XCircle,
  AlertTriangle
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface AreaENEM {
  area: string;
  peso: string;
  importancia: string;
  topicos: string[];
}

interface Competencia {
  competencia: string;
  descricao: string;
  comoDesenvolver: string;
}

interface NotasCorte {
  amplaConcorrencia: {
    minima: number;
    media: number;
    maxima: number;
    observacao: string;
  };
  cotasSociais: {
    minima: number;
    media: number;
    maxima: number;
  };
}

interface SobreOCurso {
  duracao: string;
  areas: string[];
  mercado: string;
  salarioMedio: string;
  desafios: string;
}

interface ResultadoConsulta {
  curso: string;
  universidadesReferencia: string[];
  notasCorte: NotasCorte;
  areasENEM: AreaENEM[];
  competenciasDominar: Competencia[];
  sobreOCurso: SobreOCurso;
  dicasEstudo: string[];
  curiosidades: string[];
}

const cursosPopulares = [
  "Medicina", "Direito", "Engenharia Civil", "Psicologia", 
  "Enfermagem", "Administração", "Ciência da Computação", "Arquitetura",
  "Veterinária", "Farmácia", "Odontologia", "Nutrição"
];

export default function ConsultarCurso() {
  const navigate = useNavigate();
  const [curso, setCurso] = useState("");
  const [universidade, setUniversidade] = useState("");
  const [carregando, setCarregando] = useState(false);
  const [resultado, setResultado] = useState<ResultadoConsulta | null>(null);
  
  // Estados para simulação de nota
  const [mostrarSimulador, setMostrarSimulador] = useState(false);
  const [minhaNota, setMinhaNota] = useState("");
  const [modalidade, setModalidade] = useState<"ampla" | "cotas">("ampla");

  const consultarCurso = async (cursoSelecionado?: string) => {
    const cursoConsulta = cursoSelecionado || curso;
    
    if (!cursoConsulta.trim()) {
      toast({
        title: "Digite o nome do curso",
        description: "Informe o curso que deseja consultar.",
        variant: "destructive"
      });
      return;
    }

    setCarregando(true);
    setResultado(null);

    try {
      const { data, error } = await supabase.functions.invoke("consultar-curso", {
        body: { curso: cursoConsulta, universidade: universidade || null }
      });

      if (error) throw error;

      setResultado(data);
      setCurso(cursoConsulta);
    } catch (error) {
      console.error("Erro ao consultar curso:", error);
      toast({
        title: "Erro ao consultar",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setCarregando(false);
    }
  };

  const getPesoColor = (peso: string) => {
    switch (peso.toLowerCase()) {
      case "alto": return "bg-red-500";
      case "médio": return "bg-yellow-500";
      case "baixo": return "bg-green-500";
      default: return "bg-gray-500";
    }
  };

  const getNotaProgress = (nota: number) => {
    return ((nota - 300) / 700) * 100;
  };

  const calcularChances = () => {
    if (!resultado || !minhaNota) return null;
    
    const nota = parseFloat(minhaNota);
    if (isNaN(nota) || nota < 0 || nota > 1000) return null;

    const notasRef = modalidade === "ampla" 
      ? resultado.notasCorte.amplaConcorrencia 
      : resultado.notasCorte.cotasSociais;

    const diferenca = nota - notasRef.media;
    const percentualRelativo = ((nota - notasRef.minima) / (notasRef.maxima - notasRef.minima)) * 100;

    let status: "aprovado" | "chances" | "dificil";
    let mensagem: string;
    let cor: string;

    if (nota >= notasRef.media) {
      status = "aprovado";
      mensagem = "Excelente! Sua nota está acima da média. Boas chances de aprovação!";
      cor = "text-green-600";
    } else if (nota >= notasRef.minima) {
      status = "chances";
      mensagem = `Você está ${Math.abs(diferenca).toFixed(0)} pontos abaixo da média, mas acima da mínima. Continue estudando!`;
      cor = "text-yellow-600";
    } else {
      status = "dificil";
      mensagem = `Você precisa de mais ${(notasRef.minima - nota).toFixed(0)} pontos para atingir a nota mínima.`;
      cor = "text-red-600";
    }

    return { status, mensagem, cor, diferenca, percentualRelativo, notasRef };
  };

  const chancesResult = calcularChances();

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-4">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar
        </Button>

        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold flex items-center justify-center gap-2">
            <GraduationCap className="h-8 w-8 text-primary" />
            Consultar Curso
          </h1>
          <p className="text-muted-foreground">
            Descubra a nota de corte, o que estudar e tudo sobre o curso dos seus sonhos
          </p>
        </div>

        {/* Formulário de busca */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Buscar Curso
            </CardTitle>
            <CardDescription>
              Digite o nome do curso ou escolha um dos populares
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="curso">Curso desejado</Label>
                <Input
                  id="curso"
                  placeholder="Ex: Medicina, Direito, Engenharia..."
                  value={curso}
                  onChange={(e) => setCurso(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && consultarCurso()}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="universidade">Universidade (opcional)</Label>
                <Input
                  id="universidade"
                  placeholder="Ex: USP, UFRJ, UFMG..."
                  value={universidade}
                  onChange={(e) => setUniversidade(e.target.value)}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span className="text-sm text-muted-foreground">Populares:</span>
              {cursosPopulares.map((c) => (
                <Badge
                  key={c}
                  variant="outline"
                  className="cursor-pointer hover:bg-primary hover:text-primary-foreground transition-colors"
                  onClick={() => {
                    setCurso(c);
                    consultarCurso(c);
                  }}
                >
                  {c}
                </Badge>
              ))}
            </div>

            <Button
              className="w-full"
              size="lg"
              onClick={() => consultarCurso()}
              disabled={carregando}
            >
              {carregando ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Consultando informações...
                </>
              ) : (
                <>
                  <Search className="mr-2 h-4 w-4" />
                  Consultar Curso
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Resultado */}
        {resultado && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Header do curso */}
            <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-bold">{resultado.curso}</h2>
                    <p className="text-muted-foreground">
                      Duração: {resultado.sobreOCurso.duracao}
                    </p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {resultado.universidadesReferencia.slice(0, 3).map((uni) => (
                      <Badge key={uni} variant="secondary">
                        <Building2 className="h-3 w-3 mr-1" />
                        {uni}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Notas de corte */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-primary" />
                  Notas de Corte SISU
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h4 className="font-semibold">Ampla Concorrência</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Mínima</span>
                          <span className="font-medium">{resultado.notasCorte.amplaConcorrencia.minima}</span>
                        </div>
                        <Progress value={getNotaProgress(resultado.notasCorte.amplaConcorrencia.minima)} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Média</span>
                          <span className="font-medium text-primary">{resultado.notasCorte.amplaConcorrencia.media}</span>
                        </div>
                        <Progress value={getNotaProgress(resultado.notasCorte.amplaConcorrencia.media)} className="h-3 bg-primary/20" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Máxima</span>
                          <span className="font-medium">{resultado.notasCorte.amplaConcorrencia.maxima}</span>
                        </div>
                        <Progress value={getNotaProgress(resultado.notasCorte.amplaConcorrencia.maxima)} className="h-2" />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground italic">
                      {resultado.notasCorte.amplaConcorrencia.observacao}
                    </p>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-semibold">Cotas Sociais (L1-L4)</h4>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Mínima</span>
                          <span className="font-medium">{resultado.notasCorte.cotasSociais.minima}</span>
                        </div>
                        <Progress value={getNotaProgress(resultado.notasCorte.cotasSociais.minima)} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Média</span>
                          <span className="font-medium text-primary">{resultado.notasCorte.cotasSociais.media}</span>
                        </div>
                        <Progress value={getNotaProgress(resultado.notasCorte.cotasSociais.media)} className="h-3 bg-primary/20" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-1">
                          <span>Máxima</span>
                          <span className="font-medium">{resultado.notasCorte.cotasSociais.maxima}</span>
                        </div>
                        <Progress value={getNotaProgress(resultado.notasCorte.cotasSociais.maxima)} className="h-2" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Simulador de Nota */}
            <Card className="border-2 border-dashed border-primary/30">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Simular Minha Nota
                </CardTitle>
                <CardDescription>
                  Digite sua nota (ou nota esperada) para ver suas chances de aprovação
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="minhaNota">Sua nota do ENEM</Label>
                    <Input
                      id="minhaNota"
                      type="number"
                      placeholder="Ex: 720"
                      min="0"
                      max="1000"
                      value={minhaNota}
                      onChange={(e) => setMinhaNota(e.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Modalidade</Label>
                    <div className="flex gap-2">
                      <Button
                        variant={modalidade === "ampla" ? "default" : "outline"}
                        size="sm"
                        className="flex-1"
                        onClick={() => setModalidade("ampla")}
                      >
                        Ampla
                      </Button>
                      <Button
                        variant={modalidade === "cotas" ? "default" : "outline"}
                        size="sm"
                        className="flex-1"
                        onClick={() => setModalidade("cotas")}
                      >
                        Cotas
                      </Button>
                    </div>
                  </div>
                </div>

                {chancesResult && (
                  <div className={`p-4 rounded-lg ${
                    chancesResult.status === "aprovado" ? "bg-green-500/10 border border-green-500/30" :
                    chancesResult.status === "chances" ? "bg-yellow-500/10 border border-yellow-500/30" :
                    "bg-red-500/10 border border-red-500/30"
                  }`}>
                    <div className="flex items-start gap-3">
                      {chancesResult.status === "aprovado" ? (
                        <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : chancesResult.status === "chances" ? (
                        <AlertTriangle className="h-6 w-6 text-yellow-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <XCircle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
                      )}
                      <div className="flex-1">
                        <p className={`font-semibold ${chancesResult.cor}`}>
                          {chancesResult.status === "aprovado" ? "Alta chance de aprovação!" :
                           chancesResult.status === "chances" ? "Chances moderadas" :
                           "Precisa melhorar"}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {chancesResult.mensagem}
                        </p>
                        
                        <div className="mt-3 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Sua nota:</span>
                            <span className="font-bold">{minhaNota}</span>
                          </div>
                          <div className="relative">
                            <Progress 
                              value={getNotaProgress(parseFloat(minhaNota))} 
                              className="h-4" 
                            />
                            <div 
                              className="absolute top-0 h-4 w-0.5 bg-primary"
                              style={{ left: `${getNotaProgress(chancesResult.notasRef.minima)}%` }}
                              title="Nota mínima"
                            />
                            <div 
                              className="absolute top-0 h-4 w-0.5 bg-green-600"
                              style={{ left: `${getNotaProgress(chancesResult.notasRef.media)}%` }}
                              title="Nota média"
                            />
                          </div>
                          <div className="flex justify-between text-xs text-muted-foreground">
                            <span>Mín: {chancesResult.notasRef.minima}</span>
                            <span className="text-green-600 font-medium">Média: {chancesResult.notasRef.media}</span>
                            <span>Máx: {chancesResult.notasRef.maxima}</span>
                          </div>
                        </div>

                        {chancesResult.diferenca < 0 && (
                          <p className="text-sm mt-3 p-2 bg-background rounded">
                            💡 <strong>Dica:</strong> Foque nas áreas de maior peso para ganhar os {Math.abs(chancesResult.diferenca).toFixed(0)} pontos necessários!
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {!minhaNota && (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Digite sua nota acima para ver o resultado da simulação
                  </p>
                )}
              </CardContent>
            </Card>

            <Tabs defaultValue="areas" className="space-y-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="areas">Áreas ENEM</TabsTrigger>
                <TabsTrigger value="competencias">O Que Dominar</TabsTrigger>
                <TabsTrigger value="curso">Sobre o Curso</TabsTrigger>
                <TabsTrigger value="dicas">Dicas</TabsTrigger>
              </TabsList>

              <TabsContent value="areas" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {resultado.areasENEM.map((area, idx) => (
                    <Card key={idx}>
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{area.area}</CardTitle>
                          <Badge className={getPesoColor(area.peso)}>
                            Peso {area.peso}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">
                          {area.importancia}
                        </p>
                        <div>
                          <p className="text-sm font-medium mb-2">Tópicos principais:</p>
                          <div className="flex flex-wrap gap-1">
                            {area.topicos.map((topico, i) => (
                              <Badge key={i} variant="outline" className="text-xs">
                                {topico}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="competencias" className="space-y-4">
                {resultado.competenciasDominar.map((comp, idx) => (
                  <Card key={idx}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                        {comp.competencia}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <p className="text-muted-foreground">{comp.descricao}</p>
                      <div className="bg-primary/10 rounded-lg p-3">
                        <p className="text-sm">
                          <span className="font-medium">💡 Como desenvolver: </span>
                          {comp.comoDesenvolver}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </TabsContent>

              <TabsContent value="curso" className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Duração
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold">{resultado.sobreOCurso.duracao}</p>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <DollarSign className="h-5 w-5" />
                        Salário Inicial
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-2xl font-bold text-green-600">
                        {resultado.sobreOCurso.salarioMedio}
                      </p>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Briefcase className="h-5 w-5" />
                      Áreas de Atuação
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {resultado.sobreOCurso.areas.map((area, idx) => (
                        <Badge key={idx} variant="secondary">
                          {area}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <TrendingUp className="h-5 w-5" />
                      Mercado de Trabalho
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{resultado.sobreOCurso.mercado}</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Desafios da Profissão</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{resultado.sobreOCurso.desafios}</p>
                  </CardContent>
                </Card>

                <Card className="bg-muted/50">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      Curiosidades
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2">
                      {resultado.curiosidades.map((cur, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span className="text-yellow-500">★</span>
                          {cur}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="dicas" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Lightbulb className="h-5 w-5 text-yellow-500" />
                      Dicas de Estudo para {resultado.curso}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {resultado.dicasEstudo.map((dica, idx) => (
                        <li key={idx} className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
                          <span className="flex-shrink-0 w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-bold">
                            {idx + 1}
                          </span>
                          <p>{dica}</p>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        )}
      </div>
    </div>
  );
}

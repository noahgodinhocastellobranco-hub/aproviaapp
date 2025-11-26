import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PenTool, Sparkles, CheckCircle2, AlertCircle, TrendingUp, Award, Target, Camera, Image as ImageIcon, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const competenciasInfo = [
  { nome: "Domínio da norma culta", descricao: "Modalidade escrita formal da língua portuguesa" },
  { nome: "Compreensão da proposta", descricao: "Aplicar conceitos de várias áreas" },
  { nome: "Argumentação", descricao: "Selecionar e organizar informações" },
  { nome: "Coesão textual", descricao: "Mecanismos linguísticos" },
  { nome: "Proposta de intervenção", descricao: "Solução respeitando direitos humanos" },
];

interface Competencia {
  nota: number;
  justificativa: string;
  exemplos: string;
}

interface Resultado {
  nota: number;
  competencias: {
    competencia1: Competencia;
    competencia2: Competencia;
    competencia3: Competencia;
    competencia4: Competencia;
    competencia5: Competencia;
  };
  pontos_fortes: string;
  pontos_melhoria: string;
}

export default function Redacao() {
  const [tema, setTema] = useState("");
  const [redacao, setRedacao] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "Por favor, selecione uma imagem menor que 10MB.",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setRedacao(""); // Limpa o texto se houver imagem
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCamera = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";
    input.onchange = (e: any) => handleImageSelect(e);
    input.click();
  };

  const clearImage = () => {
    setSelectedImage(null);
  };

  const handleSubmit = async () => {
    if (!tema) {
      toast({
        title: "Tema obrigatório",
        description: "Por favor, digite o tema da redação.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedImage && !redacao.trim()) {
      toast({
        title: "Redação obrigatória",
        description: "Por favor, escreva sua redação ou tire uma foto.",
        variant: "destructive",
      });
      return;
    }

    if (!selectedImage && redacao.trim().length < 100) {
      toast({
        title: "Redação muito curta",
        description: "Uma redação ENEM deve ter pelo menos 7 linhas (aproximadamente 100 caracteres).",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResultado(null);

    try {
      const body = selectedImage 
        ? { tema, imagem: selectedImage }
        : { tema, redacao };

      const { data, error } = await supabase.functions.invoke("avaliar-redacao", {
        body,
      });

      if (error) throw error;

      setResultado(data);
      toast({
        title: "Redação avaliada!",
        description: "Confira sua nota e feedback abaixo.",
      });
    } catch (error: any) {
      console.error("Erro ao avaliar redação:", error);
      toast({
        title: "Erro ao avaliar",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getNotaColor = (nota: number) => {
    if (nota >= 900) return "text-green-600 dark:text-green-400";
    if (nota >= 700) return "text-blue-600 dark:text-blue-400";
    if (nota >= 500) return "text-yellow-600 dark:text-yellow-400";
    return "text-orange-600 dark:text-orange-400";
  };

  const getNotaBadgeColor = (nota: number) => {
    if (nota >= 160) return "bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20";
    if (nota >= 120) return "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20";
    if (nota >= 80) return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border-yellow-500/20";
    return "bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20";
  };

  const notaPercentual = resultado ? (resultado.nota / 1000) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 rounded-full bg-primary/10">
              <PenTool className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Pratique sua Redação ENEM</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Escreva uma redação e receba nota e feedback baseados nos critérios oficiais do ENEM 2023
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Form */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl">Escreva sua Redação</CardTitle>
                <CardDescription>
                  Digite um tema e desenvolva uma redação dissertativa-argumentativa
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Label htmlFor="tema" className="text-base font-semibold mb-2 block">
                    Tema da Redação
                  </Label>
                  <Input
                    id="tema"
                    type="text"
                    placeholder="Ex: Desafios da educação no Brasil, Sustentabilidade..."
                    value={tema}
                    onChange={(e) => setTema(e.target.value)}
                    className="h-12 text-base"
                  />
                </div>

                <Tabs defaultValue="texto" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="texto">Digitar Redação</TabsTrigger>
                    <TabsTrigger value="foto">Tirar Foto</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="texto" className="space-y-4">
                    <div>
                      <Label htmlFor="redacao" className="text-base font-semibold mb-2 block">
                        Sua Redação (mínimo 7 linhas)
                      </Label>
                      <Textarea
                        id="redacao"
                        placeholder="Digite sua redação completa aqui. Lembre-se de seguir a estrutura dissertativa-argumentativa: introdução, desenvolvimento e conclusão com proposta de intervenção..."
                        value={redacao}
                        onChange={(e) => setRedacao(e.target.value)}
                        className="min-h-[400px] text-base leading-relaxed"
                        disabled={!!selectedImage}
                      />
                      <div className="flex justify-between items-center mt-2">
                        <p className="text-sm text-muted-foreground">
                          {redacao.length} caracteres • {Math.floor(redacao.length / 14)} linhas aprox.
                        </p>
                        {redacao.length >= 100 && (
                          <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" />
                            Tamanho adequado
                          </p>
                        )}
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="foto" className="space-y-4">
                    {!selectedImage ? (
                      <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                          Tire uma foto da sua redação escrita à mão ou selecione uma imagem da galeria
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                          <Button
                            type="button"
                            variant="outline"
                            className="h-32 flex flex-col gap-2"
                            onClick={handleCamera}
                          >
                            <Camera className="h-8 w-8" />
                            Tirar Foto
                          </Button>
                          <Button
                            type="button"
                            variant="outline"
                            className="h-32 flex flex-col gap-2"
                            onClick={() => document.getElementById("image-upload")?.click()}
                          >
                            <ImageIcon className="h-8 w-8" />
                            Selecionar da Galeria
                          </Button>
                        </div>
                        <input
                          id="image-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <div className="relative">
                          <img
                            src={selectedImage}
                            alt="Redação"
                            className="w-full rounded-lg border-2 border-primary/20"
                          />
                          <Button
                            type="button"
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2"
                            onClick={clearImage}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <p className="text-sm text-green-600 dark:text-green-400 flex items-center gap-1">
                          <CheckCircle2 className="h-4 w-4" />
                          Imagem carregada com sucesso
                        </p>
                      </div>
                    )}
                  </TabsContent>
                </Tabs>

                <Button 
                  onClick={handleSubmit} 
                  disabled={loading} 
                  className="w-full h-14 text-lg font-semibold" 
                  size="lg"
                >
                  {loading ? (
                    <>
                      <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                      Avaliando sua redação...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      Avaliar Redação com IA
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>

            {/* Results */}
            {resultado && (
              <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Award className="h-6 w-6 text-primary" />
                    Resultado da Avaliação
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Nota Final */}
                  <div className="bg-card rounded-xl p-8 text-center border border-primary/20">
                    <p className="text-sm text-muted-foreground mb-3 uppercase tracking-wider">
                      Nota Final
                    </p>
                    <p className={`text-7xl md:text-8xl font-bold mb-2 ${getNotaColor(resultado.nota)}`}>
                      {resultado.nota}
                    </p>
                    <p className="text-base text-muted-foreground mb-4">de 1000 pontos</p>
                    <Progress value={notaPercentual} className="h-3 mb-2" />
                    <p className="text-sm text-muted-foreground">
                      {notaPercentual.toFixed(1)}% do total
                    </p>
                  </div>

                  {/* Competências Individuais */}
                  <div className="bg-card rounded-xl p-6 border border-primary/20">
                    <h3 className="font-semibold text-lg mb-4 flex items-center gap-2">
                      <Target className="h-5 w-5 text-primary" />
                      Notas por Competência
                    </h3>
                    <div className="space-y-4">
                      {Object.entries(resultado.competencias).map(([key, comp], index) => (
                        <div key={key} className="bg-muted/50 rounded-lg p-4 space-y-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                                {index + 1}
                              </div>
                              <div>
                                <h4 className="font-semibold text-sm">{competenciasInfo[index].nome}</h4>
                                <p className="text-xs text-muted-foreground">{competenciasInfo[index].descricao}</p>
                              </div>
                            </div>
                            <Badge className={`text-lg font-bold px-4 py-2 ${getNotaBadgeColor(comp.nota)}`}>
                              {comp.nota}/200
                            </Badge>
                          </div>
                          <div className="space-y-2">
                            <div>
                              <p className="text-xs font-semibold text-muted-foreground mb-1">Justificativa:</p>
                              <p className="text-sm leading-relaxed">{comp.justificativa}</p>
                            </div>
                            {comp.exemplos && (
                              <div>
                                <p className="text-xs font-semibold text-muted-foreground mb-1">Exemplos do texto:</p>
                                <p className="text-sm leading-relaxed text-muted-foreground italic">{comp.exemplos}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Pontos Fortes e Melhoria */}
                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="bg-green-500/10 rounded-xl p-6 border border-green-500/20">
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-green-600 dark:text-green-400">
                        <CheckCircle2 className="h-5 w-5" />
                        Pontos Fortes
                      </h3>
                      <p className="text-sm leading-relaxed">{resultado.pontos_fortes}</p>
                    </div>
                    <div className="bg-orange-500/10 rounded-xl p-6 border border-orange-500/20">
                      <h3 className="font-semibold text-lg mb-3 flex items-center gap-2 text-orange-600 dark:text-orange-400">
                        <TrendingUp className="h-5 w-5" />
                        Pontos de Melhoria
                      </h3>
                      <p className="text-sm leading-relaxed">{resultado.pontos_melhoria}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  As 5 Competências do ENEM
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {competenciasInfo.map((comp, index) => (
                  <div key={index} className="bg-card rounded-lg p-4 border border-primary/10">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <h4 className="font-semibold text-sm mb-1">{comp.nome}</h4>
                        <p className="text-xs text-muted-foreground">{comp.descricao}</p>
                        <p className="text-xs text-primary font-semibold mt-2">0-200 pontos</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Dicas Rápidas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <p>Use conectivos para dar coesão ao texto</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <p>Apresente argumentos sólidos e bem fundamentados</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <p>Proponha solução viável e detalhada</p>
                </div>
                <div className="flex items-start gap-2">
                  <CheckCircle2 className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                  <p>Revise ortografia e gramática</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

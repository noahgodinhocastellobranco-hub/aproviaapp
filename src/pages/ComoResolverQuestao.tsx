import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Camera, Upload, Sparkles, HelpCircle, Lightbulb, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export default function ComoResolverQuestao() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [resolucao, setResolucao] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleImageCapture = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
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
        setResolucao(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAnalyzeQuestion = async () => {
    if (!selectedImage) {
      toast({
        title: "Nenhuma imagem selecionada",
        description: "Por favor, tire uma foto ou selecione uma imagem da questão.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    setResolucao(null);

    try {
      const { data, error } = await supabase.functions.invoke("resolver-questao", {
        body: { image: selectedImage },
      });

      if (error) throw error;

      setResolucao(data.solution);
      toast({
        title: "Questão analisada!",
        description: "Confira a explicação detalhada abaixo.",
      });
    } catch (error: any) {
      console.error("Erro ao analisar questão:", error);
      toast({
        title: "Erro ao analisar questão",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Camera className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-3">Como Resolver Questão</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tire uma foto da questão e receba uma explicação detalhada de como resolvê-la passo a passo
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Left Column - Upload and Result */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Camera className="h-6 w-6 text-primary" />
                  Envie a Questão
                </CardTitle>
                <CardDescription>
                  Tire uma foto clara da questão ou selecione uma imagem do seu dispositivo
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Image Upload Area */}
                <div className="border-2 border-dashed border-primary/20 rounded-xl p-8 text-center bg-muted/30">
                  {selectedImage ? (
                    <div className="space-y-4">
                      <img
                        src={selectedImage}
                        alt="Questão capturada"
                        className="max-w-full max-h-96 mx-auto rounded-lg border border-border"
                      />
                      <div className="flex gap-3 justify-center">
                        <label htmlFor="camera-input">
                          <Button variant="outline" className="cursor-pointer" asChild>
                            <span>
                              <Camera className="mr-2 h-4 w-4" />
                              Tirar outra foto
                            </span>
                          </Button>
                        </label>
                        <label htmlFor="file-input">
                          <Button variant="outline" className="cursor-pointer" asChild>
                            <span>
                              <Upload className="mr-2 h-4 w-4" />
                              Escolher outra imagem
                            </span>
                          </Button>
                        </label>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="flex justify-center">
                        <div className="p-6 rounded-full bg-primary/10">
                          <Camera className="h-16 w-16 text-primary" />
                        </div>
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold mb-2">Adicione uma foto da questão</h3>
                        <p className="text-sm text-muted-foreground mb-6">
                          Tire uma foto ou selecione uma imagem do seu dispositivo
                        </p>
                        <div className="flex flex-col sm:flex-row gap-3 justify-center">
                          <label htmlFor="camera-input">
                            <Button className="cursor-pointer w-full sm:w-auto" asChild>
                              <span>
                                <Camera className="mr-2 h-5 w-5" />
                                Tirar Foto
                              </span>
                            </Button>
                          </label>
                          <label htmlFor="file-input">
                            <Button variant="outline" className="cursor-pointer w-full sm:w-auto" asChild>
                              <span>
                                <Upload className="mr-2 h-5 w-5" />
                                Escolher Arquivo
                              </span>
                            </Button>
                          </label>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <input
                  id="camera-input"
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handleImageCapture}
                  className="hidden"
                />
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageCapture}
                  className="hidden"
                />

                {selectedImage && (
                  <Button
                    onClick={handleAnalyzeQuestion}
                    disabled={loading}
                    className="w-full h-14 text-lg font-semibold"
                    size="lg"
                  >
                    {loading ? (
                      <>
                        <div className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-background border-t-transparent" />
                        Analisando questão...
                      </>
                    ) : (
                      <>
                        <Sparkles className="mr-2 h-5 w-5" />
                        Explicar como resolver
                      </>
                    )}
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Resolution Result */}
            {resolucao && (
              <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
                <CardHeader>
                  <CardTitle className="text-2xl flex items-center gap-2">
                    <Lightbulb className="h-6 w-6 text-primary" />
                    Explicação Detalhada
                  </CardTitle>
                  <CardDescription>
                    Passo a passo para resolver esta questão
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="bg-card rounded-xl p-6 border border-primary/20">
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      <div
                        className="whitespace-pre-wrap leading-relaxed"
                        dangerouslySetInnerHTML={{
                          __html: resolucao.replace(/\n/g, "<br/>"),
                        }}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Instructions */}
          <div className="space-y-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Como funciona?
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      1
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Capture a questão</h4>
                      <p className="text-xs text-muted-foreground">
                        Tire uma foto clara da questão que você quer resolver
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      2
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Envie para análise</h4>
                      <p className="text-xs text-muted-foreground">
                        Nossa IA irá analisar a questão e identificar o que está sendo pedido
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                      3
                    </div>
                    <div>
                      <h4 className="font-semibold text-sm mb-1">Receba a explicação</h4>
                      <p className="text-xs text-muted-foreground">
                        Você receberá uma explicação detalhada passo a passo de como resolver
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-primary" />
                  Dicas para melhores resultados
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm text-muted-foreground">
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <p>Certifique-se de que a questão está bem iluminada e legível</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <p>Evite reflexos ou sombras que dificultem a leitura</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <p>Capture toda a questão, incluindo enunciado e alternativas</p>
                </div>
                <div className="flex items-start gap-2">
                  <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                  <p>A IA funciona melhor com questões de múltipla escolha do ENEM</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

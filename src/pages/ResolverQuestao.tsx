import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Camera, Upload, Loader2, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import FormattedText from '@/components/FormattedText';

const ResolverQuestao = () => {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "Arquivo muito grande",
          description: "Por favor, selecione uma imagem menor que 10MB",
          variant: "destructive",
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
        setSolution(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCameraCapture = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const analyzeQuestion = async () => {
    if (!selectedImage) return;

    setIsAnalyzing(true);
    setSolution(null);

    try {
      const { data, error } = await supabase.functions.invoke('resolver-questao', {
        body: { image: selectedImage }
      });

      if (error) throw error;

      if (data?.solution) {
        setSolution(data.solution);
        toast({
          title: "Questão resolvida!",
          description: "A IA analisou sua questão com sucesso",
        });
      }
    } catch (error: any) {
      console.error('Error analyzing question:', error);
      toast({
        title: "Erro ao resolver questão",
        description: error.message || "Tente novamente mais tarde",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const resetImage = () => {
    setSelectedImage(null);
    setSolution(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4 sm:p-6 md:p-8">
      <div className="container mx-auto max-w-4xl space-y-6">
        <div className="text-center space-y-2">
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Resolver Questão com IA
          </h1>
          <p className="text-muted-foreground">
            Tire uma foto ou envie uma imagem da questão e nossa IA resolverá para você
          </p>
        </div>

        <Card className="border-primary/20">
          <CardHeader>
            <CardTitle>Enviar Questão</CardTitle>
            <CardDescription>
              Escolha uma foto da sua galeria ou tire uma foto da questão
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              onChange={handleFileSelect}
              className="hidden"
            />

            {!selectedImage ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Button
                  onClick={handleCameraCapture}
                  size="lg"
                  className="w-full h-32 flex flex-col gap-2"
                >
                  <Camera className="h-8 w-8" />
                  <span>Tirar Foto</span>
                </Button>
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  size="lg"
                  variant="outline"
                  className="w-full h-32 flex flex-col gap-2"
                >
                  <Upload className="h-8 w-8" />
                  <span>Escolher da Galeria</span>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="relative rounded-lg overflow-hidden border-2 border-primary/20">
                  <img
                    src={selectedImage}
                    alt="Questão selecionada"
                    className="w-full h-auto max-h-96 object-contain bg-muted"
                  />
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={analyzeQuestion}
                    disabled={isAnalyzing}
                    className="flex-1"
                    size="lg"
                  >
                    {isAnalyzing ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Analisando...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-5 w-5" />
                        Resolver Questão
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={resetImage}
                    variant="outline"
                    size="lg"
                    disabled={isAnalyzing}
                  >
                    Nova Foto
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {solution && (
          <Card className="border-primary/20 animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-primary" />
                Solução
              </CardTitle>
              <CardDescription>
                Resolução detalhada da questão
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="whitespace-pre-wrap text-foreground">
                <FormattedText text={solution} />
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResolverQuestao;

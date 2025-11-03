import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { PenTool, Sparkles } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const temas = [
  "Desafios da educação no Brasil",
  "Sustentabilidade e consumo consciente",
  "Desigualdade social e políticas públicas",
  "Impactos das redes sociais na juventude",
  "Inteligência Artificial e o futuro do trabalho",
];

export default function Redacao() {
  const [tema, setTema] = useState("");
  const [redacao, setRedacao] = useState("");
  const [resultado, setResultado] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (!tema || !redacao.trim()) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, selecione um tema e escreva sua redação.",
        variant: "destructive",
      });
      return;
    }

    if (redacao.trim().length < 100) {
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
      const { data, error } = await supabase.functions.invoke("avaliar-redacao", {
        body: { tema, redacao },
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

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <PenTool className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Pratique sua Redação ENEM</h1>
        </div>
        <p className="text-muted-foreground">
          Escreva uma redação e receba nota e feedback baseados nos critérios do ENEM
        </p>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Escreva sua Redação</CardTitle>
          <CardDescription>
            Escolha um tema e desenvolva uma redação dissertativa-argumentativa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="tema">Tema da Redação</Label>
            <Select value={tema} onValueChange={setTema}>
              <SelectTrigger id="tema">
                <SelectValue placeholder="Selecione um tema" />
              </SelectTrigger>
              <SelectContent>
                {temas.map((t) => (
                  <SelectItem key={t} value={t}>
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="redacao">Sua Redação (mínimo 7 linhas)</Label>
            <Textarea
              id="redacao"
              placeholder="Digite sua redação completa aqui..."
              value={redacao}
              onChange={(e) => setRedacao(e.target.value)}
              className="min-h-[300px] font-mono"
            />
            <p className="text-xs text-muted-foreground mt-1">
              {redacao.length} caracteres • {Math.floor(redacao.length / 14)} linhas aproximadas
            </p>
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full" size="lg">
            {loading ? (
              <>Avaliando...</>
            ) : (
              <>
                <Sparkles className="mr-2 h-5 w-5" />
                Avaliar Redação
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {resultado && (
        <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
          <CardHeader>
            <CardTitle className="text-2xl">Resultado da Avaliação</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center p-6 bg-card rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Nota Final</p>
              <p className="text-5xl font-bold text-primary">{resultado.nota}</p>
              <p className="text-sm text-muted-foreground mt-1">de 1000 pontos</p>
            </div>

            <div className="prose prose-sm max-w-none dark:prose-invert">
              <div
                dangerouslySetInnerHTML={{
                  __html: resultado.feedback.replace(/\n/g, "<br/>"),
                }}
              />
            </div>
          </CardContent>
        </Card>
      )}

      <Card className="mt-6 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <PenTool className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Lembre-se das 5 Competências</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>1. Domínio da norma culta da língua</li>
                <li>2. Compreender a proposta e aplicar conceitos</li>
                <li>3. Selecionar e organizar argumentos</li>
                <li>4. Demonstrar conhecimento dos mecanismos linguísticos</li>
                <li>5. Elaborar proposta de intervenção respeitando direitos humanos</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

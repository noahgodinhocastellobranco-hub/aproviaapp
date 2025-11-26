import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Download, FileText } from "lucide-react";

export default function MateriaisEstudo() {
  const handleDownload = () => {
    const link = document.createElement("a");
    link.href = "/Caderno_de_exercicios_Revisao_para_o_ENEM.pdf";
    link.download = "Caderno_de_exercicios_Revisao_para_o_ENEM.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 flex items-center justify-center px-4 py-12">
      <div className="container max-w-2xl">
        <div className="text-center mb-8">
          <p className="text-primary font-semibold mb-2 text-sm uppercase tracking-wider">
            Materiais gratuitos para você se preparar para o ENEM
          </p>
        </div>

        <Card className="border-primary/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
          <CardHeader className="text-center space-y-3 pb-4">
            <div className="flex justify-center mb-2">
              <div className="p-4 rounded-full bg-primary/10">
                <FileText className="h-12 w-12 text-primary" />
              </div>
            </div>
            <CardTitle className="text-3xl md:text-4xl font-bold">
              Caderno de Exercícios – Revisão para o ENEM
            </CardTitle>
            <CardDescription className="text-base md:text-lg leading-relaxed">
              PDF completo com exercícios de Matemática, Português, Redação, História, Geografia, 
              Biologia, Química e Física para estudo intensivo do ENEM.
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6 pb-8">
            <Button 
              onClick={handleDownload}
              size="lg"
              className="w-full h-14 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
            >
              <Download className="mr-2 h-6 w-6" />
              Baixar PDF
            </Button>

            <div className="mt-6 p-4 rounded-lg bg-muted/50 border border-primary/10">
              <p className="text-sm text-muted-foreground text-center">
                📚 Material gratuito • 📄 Formato PDF • ✨ Organize sua revisão
              </p>
            </div>
          </CardContent>
        </Card>

        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            Dica: Imprima e resolva os exercícios para uma melhor fixação do conteúdo!
          </p>
        </div>
      </div>
    </div>
  );
}

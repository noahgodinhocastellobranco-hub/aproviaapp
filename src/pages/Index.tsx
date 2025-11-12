import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Brain, FileText, MessageSquare, PenTool, Target } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16 md:py-24">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-6">
            <Brain className="h-12 w-12 md:h-16 md:w-16 text-primary animate-pulse" />
            <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              AprovI.A
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8">
            Seu assistente inteligente para mandar bem no ENEM
          </p>
          <p className="text-base md:text-lg text-muted-foreground/80 mb-10">
            Estude com inteligência artificial, pratique redações com correção automática e tire suas dúvidas em tempo real
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg">
              <Link to="/chat">
                <MessageSquare className="mr-2 h-5 w-5" />
                Começar a Estudar
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-lg">
              <Link to="/redacao">
                <PenTool className="mr-2 h-5 w-5" />
                Praticar Redação
              </Link>
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <PenTool className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Correção de Redação</CardTitle>
              </div>
              <CardDescription>
                Receba nota e feedback detalhado baseado nos 5 critérios do ENEM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full">
                <Link to="/redacao">Praticar Agora →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MessageSquare className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Chat Inteligente</CardTitle>
              </div>
              <CardDescription>
                Tire dúvidas sobre qualquer matéria com nossa IA especializada em ENEM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full">
                <Link to="/chat">Conversar Agora →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Simulados Oficiais</CardTitle>
              </div>
              <CardDescription>
                Acesse provas anteriores do ENEM e simulados de cursos renomados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full">
                <Link to="/simulados">Ver Simulados →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Matérias do ENEM</CardTitle>
              </div>
              <CardDescription>
                Estude os conteúdos que mais caem organizados por área de conhecimento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full">
                <Link to="/materias">Explorar Matérias →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Target className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Dicas Estratégicas</CardTitle>
              </div>
              <CardDescription>
                Aprenda técnicas e estratégias para maximizar sua nota no ENEM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="ghost" className="w-full">
                <Link to="/dicas">Ver Dicas →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-primary/20 hover:border-primary/40 transition-colors bg-gradient-to-br from-primary/5 to-primary/10">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Brain className="h-6 w-6 text-primary" />
                </div>
                <CardTitle>Powered by IA</CardTitle>
              </div>
              <CardDescription>
                Tecnologia de ponta para acelerar seus estudos e melhorar resultados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Correção automática, respostas instantâneas e feedback personalizado
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="border-primary/30 bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">
              Pronto para começar sua jornada rumo à aprovação?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Junte-se a milhares de estudantes que estão usando IA para estudar de forma mais inteligente
            </p>
            <Button asChild size="lg" className="text-lg">
              <Link to="/chat">
                <Brain className="mr-2 h-5 w-5" />
                Começar Agora Gratuitamente
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

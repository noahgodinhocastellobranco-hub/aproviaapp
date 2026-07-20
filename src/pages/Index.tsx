import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { BookOpen, Brain, CheckCircle2, FileText, MessageSquare, PenTool, Sparkles, Star, Target, Zap } from "lucide-react";
import { Link } from "react-router-dom";

export default function Index() {
  return (
    <div className="min-h-screen bg-background">
      {/* Alert Banner */}
      <div className="flex justify-center pt-8 pb-4 px-4">
        <div className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-destructive/10 border border-destructive/20">
          <span className="text-destructive text-sm font-medium">
            ⚡ ENEM 2026 está chegando — Comece a estudar agora
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="container mx-auto px-4 pt-8 pb-16">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo + Title */}
          <div className="flex items-center justify-center gap-3 mb-6">
            <Brain className="h-14 w-14 md:h-16 md:w-16 text-primary" />
            <h1 className="text-4xl md:text-6xl font-bold text-primary/40">
              Aprovação A
            </h1>
          </div>

          {/* Main Headline */}
          <div className="mb-8">
            <h2 className="text-3xl md:text-5xl font-extrabold leading-tight">
              <span className="text-foreground">Sua </span>
              <span className="text-primary">Inteligência Artificial</span>
              <br />
              <span className="text-foreground">para </span>
              <span className="text-success">passar no ENEM</span>
            </h2>
          </div>

          {/* Subtitle */}
          <p className="text-base md:text-lg text-muted-foreground mb-10 max-w-2xl mx-auto">
            <span className="font-semibold text-foreground">Correção de redação em segundos</span>
            , chat para tirar dúvidas 24/7 e plano de estudos personalizado — tudo com inteligência artificial.
          </p>

          {/* Feature Pills */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card shadow-sm">
              <Zap className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Correção instantânea de redação</span>
            </div>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card shadow-sm">
              <Sparkles className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">Bate-papo com IA especializada</span>
            </div>
            <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-border bg-card shadow-sm">
              <Star className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium text-foreground">100% gratuito</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-8">
            <Button asChild size="lg" className="text-base md:text-lg px-10 py-6 rounded-xl font-bold uppercase tracking-wide">
              <Link to="/chat">
                <Sparkles className="mr-2 h-5 w-5" />
                Começar Agora
                <span className="ml-2">→</span>
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base md:text-lg px-10 py-6 rounded-xl font-medium">
              <Link to="/auth">
                Já tenho conta
              </Link>
            </Button>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-6 mb-16">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Totalmente gratuito</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CheckCircle2 className="h-4 w-4 text-success" />
              <span>IA humanizada</span>
            </div>
          </div>
        </div>

        {/* Feature Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          <Card className="text-center border border-border bg-card hover:shadow-lg transition-shadow rounded-2xl">
            <CardContent className="pt-8 pb-6 px-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Zap className="h-7 w-7 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-foreground mb-1">Redação Corrigida</h3>
              <p className="text-sm text-muted-foreground">Em segundos com feedback</p>
              <Button asChild variant="ghost" className="mt-4 w-full text-primary">
                <Link to="/redacao">Praticar →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center border border-border bg-card hover:shadow-lg transition-shadow rounded-2xl">
            <CardContent className="pt-8 pb-6 px-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <MessageSquare className="h-7 w-7 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-foreground mb-1">Tire Dúvidas 24/7</h3>
              <p className="text-sm text-muted-foreground">IA especializada para o ENEM</p>
              <Button asChild variant="ghost" className="mt-4 w-full text-primary">
                <Link to="/chat">Conversar →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="text-center border border-border bg-card hover:shadow-lg transition-shadow rounded-2xl">
            <CardContent className="pt-8 pb-6 px-6">
              <div className="flex justify-center mb-4">
                <div className="p-3 rounded-xl bg-primary/10">
                  <Target className="h-7 w-7 text-primary" />
                </div>
              </div>
              <h3 className="font-bold text-foreground mb-1">Plano Personalizado</h3>
              <p className="text-sm text-muted-foreground">Baseado nas suas dificuldades</p>
              <Button asChild variant="ghost" className="mt-4 w-full text-primary">
                <Link to="/materias">Explorar →</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Secondary Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto mb-16">
          <Card className="border border-border bg-card hover:shadow-lg transition-shadow rounded-2xl">
            <CardContent className="pt-6 pb-6 px-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">Simulados Oficiais</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Acesse provas anteriores do ENEM e simulados de cursos renomados</p>
              <Button asChild variant="ghost" className="w-full text-primary">
                <Link to="/simulados">Ver Simulados →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card hover:shadow-lg transition-shadow rounded-2xl">
            <CardContent className="pt-6 pb-6 px-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">Matérias do ENEM</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Estude os conteúdos que mais caem organizados por área de conhecimento</p>
              <Button asChild variant="ghost" className="w-full text-primary">
                <Link to="/materias">Explorar Matérias →</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border border-border bg-card hover:shadow-lg transition-shadow rounded-2xl">
            <CardContent className="pt-6 pb-6 px-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <PenTool className="h-5 w-5 text-primary" />
                </div>
                <h3 className="font-bold text-foreground">Dicas Estratégicas</h3>
              </div>
              <p className="text-sm text-muted-foreground mb-3">Aprenda técnicas e estratégias para maximizar sua nota no ENEM</p>
              <Button asChild variant="ghost" className="w-full text-primary">
                <Link to="/dicas">Ver Dicas →</Link>
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <Card className="border border-primary/20 bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 rounded-2xl max-w-3xl mx-auto">
          <CardContent className="p-8 md:p-12 text-center">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Pronto para começar sua jornada rumo à aprovação?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Junte-se a milhares de estudantes que estão usando IA para estudar de forma mais inteligente
            </p>
            <Button asChild size="lg" className="text-base md:text-lg px-10 py-6 rounded-xl font-bold uppercase tracking-wide">
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

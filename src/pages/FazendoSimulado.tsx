import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Play, Pause, RotateCcw, AlertCircle, CheckCircle2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

export default function FazendoSimulado() {
  const totalSeconds = 5 * 60 * 60 + 30 * 60; // 5 horas e 30 minutos
  const [timeLeft, setTimeLeft] = useState(totalSeconds);
  const [isRunning, setIsRunning] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const intervalRef = useRef<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false);
            setIsFinished(true);
            toast({
              title: "Tempo esgotado!",
              description: "O tempo do simulado terminou.",
              variant: "destructive",
            });
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft, toast]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    setIsRunning(true);
    setIsFinished(false);
    toast({
      title: "Simulado iniciado!",
      description: "Boa sorte! Gerencie bem seu tempo.",
    });
  };

  const handlePause = () => {
    setIsRunning(false);
    toast({
      title: "Simulado pausado",
      description: "Clique em continuar quando estiver pronto.",
    });
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(totalSeconds);
    setIsFinished(false);
    toast({
      title: "Cronômetro reiniciado",
      description: "Pronto para começar um novo simulado.",
    });
  };

  const progressPercentage = ((totalSeconds - timeLeft) / totalSeconds) * 100;
  const getTimeColor = () => {
    const percentage = (timeLeft / totalSeconds) * 100;
    if (percentage > 50) return "text-green-600 dark:text-green-400";
    if (percentage > 25) return "text-yellow-600 dark:text-yellow-400";
    return "text-red-600 dark:text-red-400";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-3 sm:px-4 py-6 sm:py-8 max-w-5xl">
        {/* Header */}
        <div className="mb-8 text-center px-2">
          <div className="flex items-center justify-center gap-3 mb-3">
            <div className="p-3 rounded-full bg-primary/10">
              <Clock className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold mb-3">Fazendo um Simulado</h1>
          <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">
            Simule as condições reais do ENEM com cronômetro de 5 horas e 30 minutos
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Left Column - Timer */}
          <div className="lg:col-span-2 space-y-6">
            {/* Timer Card */}
            <Card className="border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Clock className="h-6 w-6 text-primary" />
                  Cronômetro do Simulado
                </CardTitle>
                <CardDescription>
                  Tempo oficial do ENEM: 5 horas e 30 minutos
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Timer Display */}
                <div className="bg-card rounded-xl p-6 sm:p-12 text-center border border-primary/20">
                  <p className="text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-4 uppercase tracking-wider">
                    {isFinished ? "Tempo Esgotado" : isRunning ? "Tempo Restante" : "Tempo Total"}
                  </p>
                  <p className={`text-5xl sm:text-7xl md:text-9xl font-bold mb-4 sm:mb-6 font-mono ${getTimeColor()}`}>
                    {formatTime(timeLeft)}
                  </p>
                  <Progress value={progressPercentage} className="h-2 sm:h-3 mb-3 sm:mb-4" />
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {progressPercentage.toFixed(1)}% do tempo utilizado
                  </p>
                </div>

                {/* Control Buttons */}
                <div className="flex flex-col gap-3">
                  {!isRunning && timeLeft === totalSeconds && (
                    <Button
                      onClick={handleStart}
                      className="flex-1 h-14 text-lg font-semibold"
                      size="lg"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Iniciar Simulado
                    </Button>
                  )}
                  
                  {!isRunning && timeLeft < totalSeconds && !isFinished && (
                    <Button
                      onClick={handleStart}
                      className="flex-1 h-14 text-lg font-semibold"
                      size="lg"
                    >
                      <Play className="mr-2 h-5 w-5" />
                      Continuar
                    </Button>
                  )}

                  {isRunning && (
                    <Button
                      onClick={handlePause}
                      variant="secondary"
                      className="flex-1 h-14 text-lg font-semibold"
                      size="lg"
                    >
                      <Pause className="mr-2 h-5 w-5" />
                      Pausar
                    </Button>
                  )}

                  {timeLeft < totalSeconds && (
                    <Button
                      onClick={handleReset}
                      variant="outline"
                      className="flex-1 h-14 text-lg font-semibold"
                      size="lg"
                    >
                      <RotateCcw className="mr-2 h-5 w-5" />
                      Reiniciar
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Instructions Card */}
            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-xl">Instruções do Simulado</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Preparação</h4>
                      <p className="text-sm text-muted-foreground">
                        Separe um local tranquilo, silencioso e bem iluminado para realizar o simulado. 
                        Tenha em mãos caneta, lápis, borracha e rascunho.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Condições Reais</h4>
                      <p className="text-sm text-muted-foreground">
                        Evite interrupções durante as 5h30min. Desligue notificações do celular e 
                        avise as pessoas ao seu redor que você estará ocupado.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Gestão do Tempo</h4>
                      <p className="text-sm text-muted-foreground">
                        Distribua o tempo entre as questões. Reserve pelo menos 60 minutos para a redação. 
                        Não fique preso em uma questão muito tempo.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Material de Apoio</h4>
                      <p className="text-sm text-muted-foreground">
                        Use apenas o material permitido no ENEM: caneta esferográfica preta, 
                        lápis, borracha e régua transparente. Não consulte anotações externas.
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 rounded-lg bg-muted/50">
                    <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="font-semibold mb-1">Após o Simulado</h4>
                      <p className="text-sm text-muted-foreground">
                        Corrija suas respostas, identifique erros e revise os conteúdos que teve 
                        mais dificuldade. Analise o tempo gasto em cada questão.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Info */}
          <div className="space-y-6">
            <Card className="border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10 sticky top-4">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-primary" />
                  Dicas Importantes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <p>Leia com atenção todos os enunciados antes de responder</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <p>Marque as questões que tem dúvida para revisar depois</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <p>Faça a redação com calma, planeje antes de escrever</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <p>Use o rascunho para cálculos e organizar ideias</p>
                  </div>
                  <div className="flex items-start gap-2">
                    <div className="flex-shrink-0 w-1.5 h-1.5 rounded-full bg-primary mt-2" />
                    <p>Reserve os últimos 30 minutos para revisar as respostas</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-primary/20">
              <CardHeader>
                <CardTitle className="text-lg">Estrutura do ENEM</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50">
                  <span className="font-semibold">1º Dia</span>
                  <span className="text-muted-foreground">5h30min</span>
                </div>
                <ul className="space-y-2 ml-4 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>45 questões de Linguagens</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>45 questões de Ciências Humanas</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>1 Redação</span>
                  </li>
                </ul>

                <div className="flex justify-between items-center p-3 rounded-lg bg-muted/50 mt-4">
                  <span className="font-semibold">2º Dia</span>
                  <span className="text-muted-foreground">5h</span>
                </div>
                <ul className="space-y-2 ml-4 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>45 questões de Ciências da Natureza</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary">•</span>
                    <span>45 questões de Matemática</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

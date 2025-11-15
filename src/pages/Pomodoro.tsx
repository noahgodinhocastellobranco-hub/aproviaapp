import { useState, useEffect, useRef } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Play, Pause, RotateCcw, Timer, Coffee, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Progress } from "@/components/ui/progress";

type PomodoroMode = "work" | "shortBreak" | "longBreak";

const WORK_TIME = 25 * 60; // 25 minutos
const SHORT_BREAK = 5 * 60; // 5 minutos
const LONG_BREAK = 15 * 60; // 15 minutos
const CYCLES_FOR_LONG_BREAK = 4;

export default function Pomodoro() {
  const [mode, setMode] = useState<PomodoroMode>("work");
  const [timeLeft, setTimeLeft] = useState(WORK_TIME);
  const [isRunning, setIsRunning] = useState(false);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [currentCycle, setCurrentCycle] = useState(1);
  const { toast } = useToast();
  const intervalRef = useRef<number>();

  const getModeTime = (currentMode: PomodoroMode) => {
    switch (currentMode) {
      case "work":
        return WORK_TIME;
      case "shortBreak":
        return SHORT_BREAK;
      case "longBreak":
        return LONG_BREAK;
    }
  };

  const getModeName = (currentMode: PomodoroMode) => {
    switch (currentMode) {
      case "work":
        return "Foco";
      case "shortBreak":
        return "Pausa Curta";
      case "longBreak":
        return "Pausa Longa";
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleComplete = () => {
    // Play sound notification
    const audio = new Audio("/notification.mp3");
    audio.play().catch(() => console.log("Audio notification not available"));

    if (mode === "work") {
      const newCycleCount = currentCycle + 1;
      setCompletedCycles(completedCycles + 1);

      if (newCycleCount > CYCLES_FOR_LONG_BREAK) {
        setMode("longBreak");
        setCurrentCycle(1);
        toast({
          title: "🎉 Ciclo completo!",
          description: "Hora de uma pausa longa. Você merece!",
        });
      } else {
        setMode("shortBreak");
        setCurrentCycle(newCycleCount);
        toast({
          title: "✅ Pomodoro concluído!",
          description: "Hora de uma pausa curta.",
        });
      }
    } else {
      setMode("work");
      toast({
        title: "⏰ Pausa finalizada!",
        description: "Hora de voltar ao foco!",
      });
    }
    setIsRunning(false);
  };

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = window.setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            handleComplete();
            return getModeTime(mode);
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isRunning, timeLeft]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(getModeTime(mode));
  };

  const switchMode = (newMode: PomodoroMode) => {
    setMode(newMode);
    setIsRunning(false);
    setTimeLeft(getModeTime(newMode));
  };

  const progress = ((getModeTime(mode) - timeLeft) / getModeTime(mode)) * 100;

  return (
    <Layout>
      <div className="container mx-auto p-6 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Técnica Pomodoro
          </h1>
          <p className="text-muted-foreground">
            Gerencie seu tempo com a técnica Pomodoro: 25 minutos de foco, 5 minutos de pausa
          </p>
        </div>

        <div className="grid gap-6">
          {/* Timer Principal */}
          <Card className="border-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Timer className="h-6 w-6" />
                {getModeName(mode)}
              </CardTitle>
              <CardDescription>
                Ciclo {currentCycle} de {CYCLES_FOR_LONG_BREAK}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Display do Tempo */}
              <div className="flex flex-col items-center gap-4">
                <div className="text-8xl font-bold tabular-nums text-primary">
                  {formatTime(timeLeft)}
                </div>
                <Progress value={progress} className="h-3 w-full" />
              </div>

              {/* Controles */}
              <div className="flex justify-center gap-3">
                {!isRunning ? (
                  <Button onClick={handleStart} size="lg" className="gap-2">
                    <Play className="h-5 w-5" />
                    Iniciar
                  </Button>
                ) : (
                  <Button onClick={handlePause} size="lg" variant="secondary" className="gap-2">
                    <Pause className="h-5 w-5" />
                    Pausar
                  </Button>
                )}
                <Button onClick={handleReset} size="lg" variant="outline" className="gap-2">
                  <RotateCcw className="h-5 w-5" />
                  Resetar
                </Button>
              </div>

              {/* Seleção de Modo */}
              <div className="flex gap-2 justify-center">
                <Button
                  variant={mode === "work" ? "default" : "outline"}
                  onClick={() => switchMode("work")}
                  className="gap-2"
                >
                  <Timer className="h-4 w-4" />
                  Foco
                </Button>
                <Button
                  variant={mode === "shortBreak" ? "default" : "outline"}
                  onClick={() => switchMode("shortBreak")}
                  className="gap-2"
                >
                  <Coffee className="h-4 w-4" />
                  Pausa Curta
                </Button>
                <Button
                  variant={mode === "longBreak" ? "default" : "outline"}
                  onClick={() => switchMode("longBreak")}
                  className="gap-2"
                >
                  <Award className="h-4 w-4" />
                  Pausa Longa
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Estatísticas */}
          <Card>
            <CardHeader>
              <CardTitle>Estatísticas da Sessão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Pomodoros Completos</p>
                  <p className="text-3xl font-bold text-primary">{completedCycles}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Tempo Total de Foco</p>
                  <p className="text-3xl font-bold text-primary">
                    {Math.floor((completedCycles * 25) / 60)}h {(completedCycles * 25) % 60}m
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Como Funciona */}
          <Card>
            <CardHeader>
              <CardTitle>Como Funciona a Técnica Pomodoro</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-start gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                    1
                  </div>
                  <div>
                    <h4 className="font-semibold">Trabalhe com foco por 25 minutos</h4>
                    <p className="text-sm text-muted-foreground">
                      Concentre-se totalmente na tarefa, sem distrações
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                    2
                  </div>
                  <div>
                    <h4 className="font-semibold">Faça uma pausa de 5 minutos</h4>
                    <p className="text-sm text-muted-foreground">
                      Relaxe, estique-se, tome água ou café
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                    3
                  </div>
                  <div>
                    <h4 className="font-semibold">Repita o ciclo 4 vezes</h4>
                    <p className="text-sm text-muted-foreground">
                      Complete 4 pomodoros de 25 minutos cada
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="bg-primary text-primary-foreground rounded-full w-8 h-8 flex items-center justify-center flex-shrink-0 font-bold">
                    4
                  </div>
                  <div>
                    <h4 className="font-semibold">Pausa longa de 15 minutos</h4>
                    <p className="text-sm text-muted-foreground">
                      Após 4 ciclos, descanse mais para recarregar as energias
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
}

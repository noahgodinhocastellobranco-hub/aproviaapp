import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, BookOpen, Loader2, Sparkles, Coffee, School, Pencil, RefreshCw, Brain } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

const diasSemana = [
  { id: "segunda", label: "Segunda" },
  { id: "terca", label: "Terça" },
  { id: "quarta", label: "Quarta" },
  { id: "quinta", label: "Quinta" },
  { id: "sexta", label: "Sexta" },
  { id: "sabado", label: "Sábado" },
  { id: "domingo", label: "Domingo" },
];

const diasSemanaMap: Record<string, string> = {
  segunda: "Segunda",
  terca: "Terça",
  quarta: "Quarta",
  quinta: "Quinta",
  sexta: "Sexta",
  sabado: "Sábado",
  domingo: "Domingo",
};

interface ScheduleItem {
  horario: string;
  atividade: string;
  tipo: string;
}

interface RoutineData {
  rotina: Record<string, ScheduleItem[]>;
  dicas: string[];
  horasEstudoSemana: number;
}

const tipoConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  pessoal: { color: "bg-muted text-muted-foreground", icon: <Coffee className="h-3 w-3" /> },
  escola: { color: "bg-warning/20 text-warning", icon: <School className="h-3 w-3" /> },
  estudo: { color: "bg-primary/20 text-primary", icon: <BookOpen className="h-3 w-3" /> },
  pausa: { color: "bg-muted text-muted-foreground", icon: <Coffee className="h-3 w-3" /> },
  exercicio: { color: "bg-success/20 text-success", icon: <Brain className="h-3 w-3" /> },
  redacao: { color: "bg-destructive/20 text-destructive", icon: <Pencil className="h-3 w-3" /> },
  revisao: { color: "bg-accent text-accent-foreground", icon: <RefreshCw className="h-3 w-3" /> },
};

export default function Rotina() {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [routine, setRoutine] = useState<RoutineData | null>(null);
  const [formData, setFormData] = useState({
    acordar: "06:00",
    dormir: "23:00",
    escolaInicio: "07:00",
    escolaFim: "12:30",
    diasEscola: ["segunda", "terca", "quarta", "quinta", "sexta"],
    atividadesExtras: "",
    dificuldades: "",
    horasEstudo: "",
    observacoes: "",
  });

  const handleDiaToggle = (dia: string) => {
    setFormData((prev) => ({
      ...prev,
      diasEscola: prev.diasEscola.includes(dia)
        ? prev.diasEscola.filter((d) => d !== dia)
        : [...prev.diasEscola, dia],
    }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("gerar-rotina", {
        body: { scheduleData: formData },
      });

      if (error) throw error;

      if (data?.rotina) {
        setRoutine(data);
        toast({
          title: "Rotina gerada! 🎉",
          description: "Sua rotina personalizada de estudos está pronta.",
        });
      } else if (data?.rawContent) {
        toast({
          title: "Rotina gerada parcialmente",
          description: "A IA retornou um formato diferente. Tente novamente.",
          variant: "destructive",
        });
      } else {
        throw new Error("Formato de resposta inválido");
      }
    } catch (err) {
      console.error("Erro ao gerar rotina:", err);
      toast({
        title: "Erro ao gerar rotina",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderScheduleItem = (item: ScheduleItem) => {
    const config = tipoConfig[item.tipo] || tipoConfig.pessoal;
    return (
      <div className="flex items-start gap-3 py-2.5 px-3 rounded-xl hover:bg-muted/50 transition-colors">
        <Badge variant="outline" className={`${config.color} text-xs font-mono shrink-0 gap-1 border-0`}>
          {config.icon}
          {item.horario}
        </Badge>
        <span className="text-sm text-foreground">{item.atividade}</span>
      </div>
    );
  };

  if (routine) {
    const daysOrder = ["segunda", "terca", "quarta", "quinta", "sexta", "sabado", "domingo"];
    const availableDays = daysOrder.filter((d) => routine.rotina[d]);

    return (
      <div className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="text-center mb-8 pt-8">
          <div className="flex items-center justify-center gap-2 mb-2">
            <Calendar className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Sua Rotina de Estudos</h1>
          </div>
          <p className="text-muted-foreground">
            Aproximadamente <span className="font-bold text-primary">{routine.horasEstudoSemana}h</span> de estudo por semana
          </p>
        </div>

        {/* Dicas */}
        {routine.dicas && routine.dicas.length > 0 && (
          <Card className="mb-6 border-primary/20">
            <CardContent className="p-5">
              <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                Dicas personalizadas
              </h3>
              <ul className="space-y-2">
                {routine.dicas.map((dica, i) => (
                  <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                    <span className="text-primary font-bold mt-0.5">•</span>
                    {dica}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Rotina por dia */}
        <Tabs defaultValue={availableDays[0]} className="w-full">
          <TabsList className="w-full flex overflow-x-auto mb-4 h-auto flex-wrap gap-1 bg-muted/50 p-1 rounded-xl">
            {availableDays.map((dia) => (
              <TabsTrigger key={dia} value={dia} className="text-xs sm:text-sm rounded-lg flex-1 min-w-[80px]">
                {diasSemanaMap[dia]}
              </TabsTrigger>
            ))}
          </TabsList>

          {availableDays.map((dia) => (
            <TabsContent key={dia} value={dia}>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Clock className="h-5 w-5 text-primary" />
                    {diasSemanaMap[dia]}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-1">
                  {routine.rotina[dia]?.map((item, i) => (
                    <div key={i}>{renderScheduleItem(item)}</div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-6 text-center">
          <Button variant="outline" onClick={() => setRoutine(null)} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Gerar nova rotina
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="text-center mb-8 pt-8">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calendar className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold text-foreground">Rotina de Estudos</h1>
        </div>
        <p className="text-muted-foreground">
          Conte-nos sobre sua rotina e criaremos um plano de estudos personalizado para o ENEM
        </p>
      </div>

      <Card>
        <CardContent className="p-6 space-y-6">
          {/* Horários básicos */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              Horários básicos
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="acordar">Horário que acorda</Label>
                <Input
                  id="acordar"
                  type="time"
                  value={formData.acordar}
                  onChange={(e) => setFormData({ ...formData, acordar: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="dormir">Horário que dorme</Label>
                <Input
                  id="dormir"
                  type="time"
                  value={formData.dormir}
                  onChange={(e) => setFormData({ ...formData, dormir: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* Escola */}
          <div>
            <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
              <School className="h-4 w-4 text-primary" />
              Escola / Cursinho
            </h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <Label htmlFor="escolaInicio">Início das aulas</Label>
                <Input
                  id="escolaInicio"
                  type="time"
                  value={formData.escolaInicio}
                  onChange={(e) => setFormData({ ...formData, escolaInicio: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="escolaFim">Fim das aulas</Label>
                <Input
                  id="escolaFim"
                  type="time"
                  value={formData.escolaFim}
                  onChange={(e) => setFormData({ ...formData, escolaFim: e.target.value })}
                />
              </div>
            </div>

            <Label className="mb-2 block">Dias de aula</Label>
            <div className="flex flex-wrap gap-2">
              {diasSemana.map((dia) => (
                <label
                  key={dia.id}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border cursor-pointer transition-colors ${
                    formData.diasEscola.includes(dia.id)
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-card border-border hover:bg-muted"
                  }`}
                >
                  <Checkbox
                    checked={formData.diasEscola.includes(dia.id)}
                    onCheckedChange={() => handleDiaToggle(dia.id)}
                    className="hidden"
                  />
                  <span className="text-sm font-medium">{dia.label}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Atividades extras */}
          <div>
            <Label htmlFor="atividades">Atividades extras (esportes, cursos, etc.)</Label>
            <Textarea
              id="atividades"
              placeholder="Ex: Futebol terça e quinta das 16h às 18h, inglês sábado de manhã..."
              value={formData.atividadesExtras}
              onChange={(e) => setFormData({ ...formData, atividadesExtras: e.target.value })}
            />
          </div>

          {/* Dificuldades */}
          <div>
            <Label htmlFor="dificuldades">Matérias com mais dificuldade</Label>
            <Textarea
              id="dificuldades"
              placeholder="Ex: Matemática, Física, Redação..."
              value={formData.dificuldades}
              onChange={(e) => setFormData({ ...formData, dificuldades: e.target.value })}
            />
          </div>

          {/* Horas de estudo */}
          <div>
            <Label htmlFor="horas">Quantas horas por dia quer estudar? (opcional)</Label>
            <Input
              id="horas"
              placeholder="Ex: 3 horas"
              value={formData.horasEstudo}
              onChange={(e) => setFormData({ ...formData, horasEstudo: e.target.value })}
            />
          </div>

          {/* Observações */}
          <div>
            <Label htmlFor="obs">Observações adicionais (opcional)</Label>
            <Textarea
              id="obs"
              placeholder="Ex: Prefiro estudar à noite, tenho mais energia de manhã..."
              value={formData.observacoes}
              onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
            />
          </div>

          <Button onClick={handleSubmit} disabled={loading} className="w-full gap-2 py-6 text-base font-bold rounded-xl">
            {loading ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Gerando sua rotina...
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                Gerar Rotina Personalizada
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

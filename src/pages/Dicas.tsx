import { Card, CardContent } from "@/components/ui/card";
import { Lightbulb } from "lucide-react";

const tips = [
  "Crie um plano de estudos diário e mantenha consistência.",
  "Resolva provas antigas do ENEM com tempo cronometrado.",
  "Pratique redações semanalmente e peça correção com critérios do ENEM.",
  "Priorize interpretação de texto — o ENEM cobra muito leitura e contexto.",
  "Treine questões de matemática com foco em resolução por passos.",
  "Estude atualidades — temas de redação se baseiam em notícias recentes.",
  "Faça revisões espaçadas (1 dia, 1 semana e 1 mês depois).",
  "Durma bem antes de provas e simulados.",
  "Use mapas mentais para matérias com muitos conceitos.",
  "Administre bem o tempo: 3 minutos por questão em média.",
];

export default function Dicas() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Lightbulb className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Dicas para mandar bem no ENEM</h1>
        </div>
        <p className="text-muted-foreground">
          Estratégias comprovadas para melhorar seu desempenho na prova
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {tips.map((tip, index) => (
          <Card
            key={index}
            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border-l-4 border-l-primary"
          >
            <CardContent className="p-6">
              <div className="flex gap-4">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {index + 1}
                </div>
                <p className="text-foreground leading-relaxed">{tip}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Lightbulb className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Dica Extra</h3>
              <p className="text-muted-foreground">
                A consistência é mais importante que intensidade. É melhor estudar 2 horas todo dia
                do que 14 horas só no fim de semana. Crie uma rotina sustentável!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calculator, BookOpen, Landmark, Globe, Leaf, FlaskConical, Zap, PenTool,
  ArrowLeft, ChevronRight
} from "lucide-react";
import { materias, type Materia, type Topico } from "@/data/materiaisEstudo";
import QuizQuestion from "@/components/QuizQuestion";

const iconMap: Record<string, React.ElementType> = {
  Calculator, BookOpen, Landmark, Globe, Leaf, FlaskConical, Zap, PenTool,
};

export default function MateriaisEstudo() {
  const [selectedMateria, setSelectedMateria] = useState<Materia | null>(null);
  const [selectedTopico, setSelectedTopico] = useState<Topico | null>(null);

  // Tela do tópico com explicação e questões
  if (selectedMateria && selectedTopico) {
    return (
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => setSelectedTopico(null)}
          className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar para {selectedMateria.titulo}
        </Button>

        <div className="mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">{selectedTopico.titulo}</h1>
          <p className="text-sm text-muted-foreground mt-1">{selectedMateria.titulo}</p>
        </div>

        <Card className="mb-6 border-primary/20 bg-primary/5">
          <CardContent className="p-5">
            <p className="text-foreground font-semibold leading-relaxed text-sm md:text-base">
              {selectedTopico.explicacao}
            </p>
          </CardContent>
        </Card>

        <h2 className="text-lg font-bold text-foreground mb-4">
          Questões para praticar
        </h2>

        <div className="space-y-4 pb-8">
          {selectedTopico.questoes.map((q, i) => (
            <QuizQuestion key={i} questao={q} numero={i + 1} />
          ))}
        </div>
      </div>
    );
  }

  // Tela dos tópicos da matéria
  if (selectedMateria) {
    const Icon = iconMap[selectedMateria.icon] || BookOpen;
    return (
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <Button
          variant="ghost"
          onClick={() => setSelectedMateria(null)}
          className="mb-4 gap-2 text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Voltar ao catálogo
        </Button>

        <div className="flex items-center gap-3 mb-6">
          <div className={`p-3 rounded-xl ${selectedMateria.cor} text-white`}>
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{selectedMateria.titulo}</h1>
            <p className="text-sm text-muted-foreground">
              {selectedMateria.topicos.length} conteúdos disponíveis
            </p>
          </div>
        </div>

        <div className="space-y-3">
          {selectedMateria.topicos.map((topico, i) => (
            <Card
              key={i}
              className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all duration-200 active:scale-[0.98]"
              onClick={() => setSelectedTopico(topico)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground">{topico.titulo}</p>
                  <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                    {topico.explicacao.substring(0, 100)}...
                  </p>
                  <p className="text-xs text-primary mt-1.5 font-medium">
                    {topico.questoes.length} questões
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0 ml-3" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Catálogo de matérias
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <div className="text-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
          📚 Materiais de Estudo
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Escolha uma matéria e estude com explicações e questões do ENEM
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {materias.map((materia) => {
          const Icon = iconMap[materia.icon] || BookOpen;
          const totalQuestoes = materia.topicos.reduce((acc, t) => acc + t.questoes.length, 0);

          return (
            <Card
              key={materia.id}
              className="cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 active:scale-95 border-2 border-transparent hover:border-primary/20"
              onClick={() => setSelectedMateria(materia)}
            >
              <CardContent className="p-4 md:p-6 flex flex-col items-center text-center gap-3">
                <div className={`p-3 md:p-4 rounded-2xl ${materia.cor} text-white shadow-lg`}>
                  <Icon className="h-6 w-6 md:h-8 md:w-8" />
                </div>
                <div>
                  <p className="font-bold text-foreground text-sm md:text-base">{materia.titulo}</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {materia.topicos.length} tópicos • {totalQuestoes} questões
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}

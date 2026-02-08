import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calculator, BookOpen, Landmark, Globe, Leaf, FlaskConical, Zap, PenTool,
  ArrowLeft, ChevronRight, GraduationCap, Sparkles, BookMarked
} from "lucide-react";
import { materias, type Materia, type Topico } from "@/data/materiaisEstudo";
import QuizQuestion from "@/components/QuizQuestion";

const iconMap: Record<string, React.ElementType> = {
  Calculator, BookOpen, Landmark, Globe, Leaf, FlaskConical, Zap, PenTool,
};

export default function MateriaisEstudo() {
  const [selectedMateria, setSelectedMateria] = useState<Materia | null>(null);
  const [selectedTopico, setSelectedTopico] = useState<Topico | null>(null);

  const totalTopicos = materias.reduce((acc, m) => acc + m.topicos.length, 0);
  const totalQuestoesGeral = materias.reduce((acc, m) => acc + m.topicos.reduce((a, t) => a + t.questoes.length, 0), 0);

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
    const totalQuestoes = selectedMateria.topicos.reduce((acc, t) => acc + t.questoes.length, 0);
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

        <div className="flex items-center gap-4 mb-2">
          <div className={`p-3.5 rounded-2xl ${selectedMateria.cor} text-white shadow-lg`}>
            <Icon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">{selectedMateria.titulo}</h1>
            <p className="text-sm text-muted-foreground">
              {selectedMateria.topicos.length} conteúdos • {totalQuestoes} questões
            </p>
          </div>
        </div>

        <p className="text-muted-foreground text-sm mb-6">Escolha um tópico para estudar com explicação e questões:</p>

        <div className="space-y-3">
          {selectedMateria.topicos.map((topico, i) => (
            <Card
              key={i}
              className="cursor-pointer hover:shadow-md hover:border-primary/30 transition-all duration-200 active:scale-[0.98]"
              onClick={() => setSelectedTopico(topico)}
            >
              <CardContent className="p-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={`flex-shrink-0 w-9 h-9 rounded-xl ${selectedMateria.cor}/10 flex items-center justify-center text-sm font-bold text-primary`}>
                    {i + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground">{topico.titulo}</p>
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {topico.explicacao.substring(0, 80)}...
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="text-xs text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                    {topico.questoes.length} questões
                  </span>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Catálogo de matérias — HERO + GRID
  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      {/* Hero Section */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-primary/70 text-primary-foreground p-6 md:p-10 mb-8 shadow-xl">
        <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 blur-2xl" />
        <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/5 blur-xl" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-3">
            <GraduationCap className="h-6 w-6" />
            <span className="text-sm font-semibold uppercase tracking-wider opacity-90">Materiais de Estudo</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold mb-3 leading-tight">
            Estude para o ENEM<br />com explicações e questões
          </h1>
          <p className="text-sm md:text-base opacity-85 max-w-lg leading-relaxed">
            Conteúdo organizado por matéria com explicações objetivas e questões de múltipla escolha com correção e explicação instantânea.
          </p>

          <div className="flex flex-wrap gap-3 mt-5">
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium">
              <BookMarked className="h-3.5 w-3.5" />
              {materias.length} matérias
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              {totalTopicos} tópicos
            </div>
            <div className="flex items-center gap-1.5 bg-white/15 backdrop-blur-sm rounded-full px-3 py-1.5 text-xs font-medium">
              <BookOpen className="h-3.5 w-3.5" />
              {totalQuestoesGeral} questões
            </div>
          </div>
        </div>
      </div>

      {/* Grid de Matérias */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {materias.map((materia) => {
          const Icon = iconMap[materia.icon] || BookOpen;
          const totalQuestoes = materia.topicos.reduce((acc, t) => acc + t.questoes.length, 0);

          return (
            <Card
              key={materia.id}
              className="cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all duration-300 active:scale-95 border-2 border-transparent hover:border-primary/20"
              onClick={() => setSelectedMateria(materia)}
            >
              <CardContent className="p-4 md:p-6 flex flex-col items-center text-center gap-3">
                <div className={`p-3 md:p-4 rounded-2xl ${materia.cor} text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
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

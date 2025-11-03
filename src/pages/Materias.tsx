import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Atom, Calculator, Globe } from "lucide-react";

const materias = [
  {
    title: "Linguagens e Redação",
    icon: BookOpen,
    color: "text-blue-600",
    bgColor: "bg-blue-50 dark:bg-blue-950/30",
    items: [
      "Interpretação de texto",
      "Ortografia e gramática em contexto",
      "Análise de imagens e figuras",
      "Repertório sociocultural para redação",
      "Funções da linguagem",
      "Variedades linguísticas",
    ],
  },
  {
    title: "Matemática",
    icon: Calculator,
    color: "text-green-600",
    bgColor: "bg-green-50 dark:bg-green-950/30",
    items: [
      "Funções e gráficos",
      "Razão, proporção e porcentagem",
      "Geometria plana e espacial",
      "Probabilidade e estatística",
      "Matemática financeira",
      "Análise combinatória",
    ],
  },
  {
    title: "Ciências da Natureza",
    icon: Atom,
    color: "text-purple-600",
    bgColor: "bg-purple-50 dark:bg-purple-950/30",
    items: [
      "Física: mecânica e eletricidade",
      "Química: estequiometria e reações químicas",
      "Biologia: ecologia, genética e fisiologia humana",
      "Física: ondulatória e óptica",
      "Química: termoquímica",
      "Biologia: evolução e microbiologia",
    ],
  },
  {
    title: "Ciências Humanas",
    icon: Globe,
    color: "text-orange-600",
    bgColor: "bg-orange-50 dark:bg-orange-950/30",
    items: [
      "História: Brasil, ditadura e movimentos sociais",
      "Geografia: meio ambiente e globalização",
      "Filosofia e Sociologia: cidadania e ética",
      "Geopolítica e conflitos mundiais",
      "Urbanização e questões ambientais",
      "Direitos humanos",
    ],
  },
];

export default function Materias() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <BookOpen className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Matérias que mais caem no ENEM</h1>
        </div>
        <p className="text-muted-foreground">
          Foque seu estudo nos tópicos mais cobrados em cada área de conhecimento
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {materias.map((materia, index) => {
          const Icon = materia.icon;
          return (
            <Card
              key={index}
              className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              <CardHeader className={`${materia.bgColor} rounded-t-lg`}>
                <CardTitle className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg bg-white dark:bg-slate-800 ${materia.color}`}>
                    <Icon className="h-6 w-6" />
                  </div>
                  {materia.title}
                </CardTitle>
                <CardDescription>Principais tópicos desta área</CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <ul className="space-y-3">
                  {materia.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold mt-0.5">
                        {itemIndex + 1}
                      </div>
                      <span className="text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mt-8 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <BookOpen className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Como estudar?</h3>
              <p className="text-muted-foreground">
                Use a técnica de estudo ativo: resolva questões de provas anteriores sobre cada
                tópico e anote suas dúvidas. Depois, revise a teoria focando nos pontos fracos
                identificados. Essa abordagem é muito mais eficiente que apenas ler!
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

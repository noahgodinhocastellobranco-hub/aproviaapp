import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink, FileText } from "lucide-react";
import { usePremiumGuard } from "@/hooks/usePremiumGuard";

const simulados = [
  {
    label: "ENEM 2024 - 1º Dia (INEP)",
    url: "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D1_CD1.pdf",
    description: "Linguagens e Ciências Humanas",
  },
  {
    label: "ENEM 2024 - 2º Dia (INEP)",
    url: "https://download.inep.gov.br/enem/provas_e_gabaritos/2024_PV_impresso_D2_CD7.pdf",
    description: "Matemática e Ciências da Natureza",
  },
  {
    label: "ENEM 2023 - 1º Dia (INEP)",
    url: "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D1_CD4.pdf",
    description: "Linguagens e Ciências Humanas",
  },
  {
    label: "ENEM 2023 - 2º Dia (INEP)",
    url: "https://download.inep.gov.br/enem/provas_e_gabaritos/2023_PV_impresso_D2_CD5.pdf",
    description: "Matemática e Ciências da Natureza",
  },
  {
    label: "Simulado Curso Objetivo 2025",
    url: "https://www.curso-objetivo.br/vestibular/assets/download/simulados/prova-simulado-enem-1dia-17082025-Azul.pdf",
    description: "1º Dia - Preparatório completo",
  },
  {
    label: "Simulado Curso Objetivo 2024",
    url: "https://www.curso-objetivo.br/vestibular/assets/download/simulados/180824-simulado-enem-1dia-prova.pdf",
    description: "1º Dia - Preparatório completo",
  },
  {
    label: "Ebook Intensivo ENEM - Curso Positivo",
    url: "https://cursopositivo.com.br/wp-content/uploads/2023/10/INTENSIVO-10-DIAS-ENEM-ebook.pdf",
    description: "Material de estudo intensivo",
  },
];

export default function Simulados() {
  const { ready } = usePremiumGuard();
  if (!ready) return null;
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <FileText className="h-8 w-8 text-primary" />
          <h1 className="text-4xl font-bold">Simulados Reais em PDF</h1>
        </div>
        <p className="text-muted-foreground">
          Pratique com provas oficiais do ENEM e simulados de cursinhos preparatórios
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {simulados.map((simulado, index) => (
          <Card
            key={index}
            className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
          >
            <CardHeader>
              <CardTitle className="flex items-start gap-3">
                <FileText className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                <span className="flex-1">{simulado.label}</span>
              </CardTitle>
              <CardDescription>{simulado.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild className="w-full group-hover:bg-primary/90">
                <a href={simulado.url} target="_blank" rel="noopener noreferrer">
                  Abrir PDF
                  <ExternalLink className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="mt-8 border-primary/20 bg-gradient-to-br from-primary/5 to-primary/10">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <FileText className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
            <div>
              <h3 className="font-semibold text-lg mb-2">Dica de Uso</h3>
              <p className="text-muted-foreground">
                Faça os simulados com tempo cronometrado! O ENEM tem 5h30 no 1º dia e 5h no 2º
                dia. Pratique gerenciar seu tempo para não ser pego de surpresa na prova real.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

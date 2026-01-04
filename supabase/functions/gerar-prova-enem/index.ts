import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { area, quantidade, provaId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    const areasConfig: Record<string, { nome: string; competencias: string[] }> = {
      linguagens: {
        nome: "Linguagens, Códigos e suas Tecnologias",
        competencias: [
          "Interpretação de texto",
          "Funções da linguagem",
          "Figuras de linguagem",
          "Variação linguística",
          "Gêneros textuais",
          "Literatura brasileira",
          "Movimentos literários",
          "Artes visuais",
          "Música e cultura",
          "Língua estrangeira (Inglês/Espanhol)"
        ]
      },
      matematica: {
        nome: "Matemática e suas Tecnologias",
        competencias: [
          "Aritmética e operações",
          "Porcentagem e razão",
          "Equações e funções",
          "Geometria plana",
          "Geometria espacial",
          "Estatística e probabilidade",
          "Análise combinatória",
          "Progressões aritméticas e geométricas",
          "Trigonometria",
          "Matemática financeira"
        ]
      },
      natureza: {
        nome: "Ciências da Natureza e suas Tecnologias",
        competencias: [
          "Mecânica e cinemática",
          "Termodinâmica",
          "Eletricidade e magnetismo",
          "Óptica e ondas",
          "Química orgânica",
          "Química inorgânica",
          "Estequiometria",
          "Ecologia e meio ambiente",
          "Genética e evolução",
          "Citologia e fisiologia"
        ]
      },
      humanas: {
        nome: "Ciências Humanas e suas Tecnologias",
        competencias: [
          "História do Brasil colonial",
          "História do Brasil republicano",
          "História mundial",
          "Geografia física",
          "Geografia humana",
          "Geopolítica",
          "Filosofia antiga e moderna",
          "Filosofia contemporânea",
          "Sociologia clássica",
          "Sociologia brasileira"
        ]
      }
    };

    const areaInfo = areasConfig[area];
    if (!areaInfo) {
      throw new Error("Área inválida");
    }

    const systemPrompt = `Você é um especialista em elaboração de questões do ENEM. Você deve criar questões ORIGINAIS que sigam EXATAMENTE o padrão do ENEM:

CARACTERÍSTICAS DAS QUESTÕES DO ENEM:
1. Sempre começam com um TEXTO BASE (pode ser um trecho literário, notícia, gráfico descrito, charge descrita, dados estatísticos, etc.)
2. O texto base deve ser RELEVANTE e ATUAL quando possível
3. A questão deve exigir INTERPRETAÇÃO e ANÁLISE CRÍTICA
4. As 5 alternativas devem ser plausíveis, com apenas UMA correta
5. Use linguagem formal e clara
6. Evite pegadinhas óbvias - o desafio deve ser intelectual

IMPORTANTE:
- Cada questão deve abordar uma competência diferente
- As questões devem ter nível de dificuldade MÉDIO a DIFÍCIL (compatível com ENEM)
- Use a semente "${provaId}" para garantir questões únicas
- Varie os tipos de texto base (literário, jornalístico, científico, gráfico, charge, etc.)

Retorne EXATAMENTE um JSON válido com a estrutura especificada.`;

    const userPrompt = `Crie ${quantidade} questões ORIGINAIS para a área "${areaInfo.nome}" do ENEM.

Competências a abordar: ${areaInfo.competencias.slice(0, quantidade).join(", ")}

Retorne um JSON com esta estrutura EXATA:
{
  "questoes": [
    {
      "numero": 1,
      "competencia": "Nome da competência",
      "textoBase": "Texto base completo da questão (mínimo 100 palavras)",
      "fonte": "Fonte fictícia mas realista do texto",
      "enunciado": "Pergunta da questão",
      "alternativas": {
        "A": "Alternativa A",
        "B": "Alternativa B",
        "C": "Alternativa C",
        "D": "Alternativa D",
        "E": "Alternativa E"
      },
      "gabarito": "A",
      "explicacao": "Explicação detalhada da resposta correta e por que as outras estão erradas"
    }
  ]
}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.8,
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("Erro ao gerar questões");
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Resposta inválida da IA");
    }
    
    const questoes = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(questoes), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro na função gerar-prova-enem:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

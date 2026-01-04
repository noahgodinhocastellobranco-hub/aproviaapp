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

    const systemPrompt = `Gere questões ENEM em JSON. Texto base curto (2-3 frases), 5 alternativas, 1 correta. Semente: ${provaId}`;

    const userPrompt = `${quantidade} questões "${areaInfo.nome}". Competências: ${areaInfo.competencias.slice(0, quantidade).join(", ")}

JSON:{"questoes":[{"numero":1,"competencia":"","textoBase":"","fonte":"","enunciado":"","alternativas":{"A":"","B":"","C":"","D":"","E":""},"gabarito":"A","explicacao":""}]}`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3,
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

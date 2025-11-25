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
    const { tema, redacao } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    const systemPrompt = `Você é um avaliador OFICIAL de redações do ENEM. Avalie a redação seguindo EXATAMENTE os critérios oficiais do ENEM 2023.

GRADE ESPECÍFICA DE CORREÇÃO:

COMPETÊNCIA 1 - Demonstrar domínio da modalidade escrita formal da Língua Portuguesa:
• 200: Excelente domínio da norma culta, sem reincidências de erros
• 160: Bom domínio, poucos desvios gramaticais
• 120: Domínio mediano, alguns desvios gramaticais
• 80: Domínio insuficiente, muitos desvios
• 40: Domínio precário, erros sistemáticos
• 0: Desconhecimento da norma culta

COMPETÊNCIA 2 - Compreender a proposta e aplicar conhecimentos:
• 200: Argumentação consistente com repertório sociocultural produtivo
• 160: Argumentação consistente, bom domínio dissertativo
• 120: Argumentação previsível, domínio mediano
• 80: Cópia dos textos motivadores ou domínio insuficiente
• 40: Tangencia o tema, domínio precário
• 0: Fuga ao tema

COMPETÊNCIA 3 - Selecionar e organizar informações:
• 200: Informações consistentes e organizadas, com autoria
• 160: Informações organizadas com indícios de autoria
• 120: Informações limitadas aos textos motivadores
• 80: Informações desorganizadas ou contraditórias
• 40: Informações pouco relacionadas ao tema
• 0: Informações não relacionadas ao tema

COMPETÊNCIA 4 - Conhecimento dos mecanismos linguísticos:
• 200: Articula bem com repertório diversificado de conectivos
• 160: Articula bem com poucas inadequações
• 120: Articula de forma mediana com inadequações
• 80: Articulação insuficiente, muitas inadequações
• 40: Articulação precária
• 0: Não articula as informações

COMPETÊNCIA 5 - Elaborar proposta de intervenção:
• 200: Proposta detalhada, relacionada ao tema e articulada
• 160: Proposta bem elaborada e articulada
• 120: Proposta mediana, articulada ao tema
• 80: Proposta insuficiente ou não articulada
• 40: Proposta vaga ou precária
• 0: Sem proposta ou não relacionada ao tema`;

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
          {
            role: "user",
            content: `Tema: ${tema}\n\nRedação:\n${redacao}\n\nAvalie esta redação conforme os critérios OFICIAIS do ENEM e atribua as notas EXATAS (0, 40, 80, 120, 160 ou 200) para cada competência. Seja detalhado e específico nos exemplos.`,
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "avaliar_redacao_enem",
              description: "Retorna a avaliação estruturada da redação do ENEM com notas de cada competência",
              parameters: {
                type: "object",
                properties: {
                  competencia1: {
                    type: "object",
                    properties: {
                      nota: { type: "number", description: "Nota de 0, 40, 80, 120, 160 ou 200" },
                      justificativa: { type: "string", description: "Explicação detalhada da nota" },
                      exemplos: { type: "string", description: "Exemplos específicos do texto" }
                    }
                  },
                  competencia2: {
                    type: "object",
                    properties: {
                      nota: { type: "number", description: "Nota de 0, 40, 80, 120, 160 ou 200" },
                      justificativa: { type: "string", description: "Explicação detalhada da nota" },
                      exemplos: { type: "string", description: "Exemplos específicos do texto" }
                    }
                  },
                  competencia3: {
                    type: "object",
                    properties: {
                      nota: { type: "number", description: "Nota de 0, 40, 80, 120, 160 ou 200" },
                      justificativa: { type: "string", description: "Explicação detalhada da nota" },
                      exemplos: { type: "string", description: "Exemplos específicos do texto" }
                    }
                  },
                  competencia4: {
                    type: "object",
                    properties: {
                      nota: { type: "number", description: "Nota de 0, 40, 80, 120, 160 ou 200" },
                      justificativa: { type: "string", description: "Explicação detalhada da nota" },
                      exemplos: { type: "string", description: "Exemplos específicos do texto" }
                    }
                  },
                  competencia5: {
                    type: "object",
                    properties: {
                      nota: { type: "number", description: "Nota de 0, 40, 80, 120, 160 ou 200" },
                      justificativa: { type: "string", description: "Explicação detalhada da nota" },
                      exemplos: { type: "string", description: "Exemplos específicos do texto" }
                    }
                  },
                  pontos_fortes: { type: "string", description: "Principais pontos fortes da redação" },
                  pontos_melhoria: { type: "string", description: "Principais pontos que podem melhorar" }
                },
                required: ["competencia1", "competencia2", "competencia3", "competencia4", "competencia5", "pontos_fortes", "pontos_melhoria"]
              }
            }
          }
        ],
        tool_choice: { type: "function", function: { name: "avaliar_redacao_enem" } }
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
          JSON.stringify({ error: "Créditos insuficientes. Adicione créditos ao seu workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("Erro do AI Gateway:", response.status, errorText);
      throw new Error("Erro ao avaliar redação");
    }

    const data = await response.json();
    console.log("Resposta da IA:", JSON.stringify(data, null, 2));

    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall || !toolCall.function?.arguments) {
      throw new Error("Formato de resposta inválido");
    }

    const avaliacao = JSON.parse(toolCall.function.arguments);
    
    const notaTotal = 
      avaliacao.competencia1.nota +
      avaliacao.competencia2.nota +
      avaliacao.competencia3.nota +
      avaliacao.competencia4.nota +
      avaliacao.competencia5.nota;

    return new Response(
      JSON.stringify({
        nota: notaTotal,
        competencias: {
          competencia1: avaliacao.competencia1,
          competencia2: avaliacao.competencia2,
          competencia3: avaliacao.competencia3,
          competencia4: avaliacao.competencia4,
          competencia5: avaliacao.competencia5,
        },
        pontos_fortes: avaliacao.pontos_fortes,
        pontos_melhoria: avaliacao.pontos_melhoria,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Erro na função avaliar-redacao:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

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
• 200: Demonstra excelente domínio da modalidade escrita formal da Língua Portuguesa e de escolha de registro. Desvios gramaticais ou de convenções da escrita serão aceitos somente como excepcionalidade e quando não caracterizam reincidências
• 160: Demonstra bom domínio da modalidade escrita formal da Língua Portuguesa e de escolha de registro, com poucos desvios gramaticais e de convenções da escrita
• 120: Demonstra domínio mediano da modalidade escrita formal da Língua Portuguesa e de escolha de registro, com alguns desvios gramaticais e de convenções da escrita
• 80: Demonstra domínio insuficiente da modalidade escrita formal da Língua Portuguesa, com muitos desvios gramaticais, de escolha de registro e de convenções da escrita
• 40: Demonstra domínio precário da modalidade escrita formal da Língua Portuguesa, de forma sistemática, com diversificados e frequentes desvios gramaticais, de escolha de registro e de convenções da escrita
• 0: Demonstra desconhecimento da modalidade escrita formal da Língua Portuguesa

COMPETÊNCIA 2 - Compreender a proposta de redação e aplicar conceitos das várias áreas de conhecimento para desenvolver o tema, dentro dos limites estruturais do texto dissertativo-argumentativo em prosa:
• 200: Desenvolve o tema por meio de argumentação consistente, a partir de um repertório sociocultural produtivo e apresenta excelente domínio do texto dissertativo-argumentativo
• 160: Desenvolve o tema por meio de argumentação consistente e apresenta bom domínio do texto dissertativo-argumentativo, com proposição, argumentação e conclusão
• 120: Desenvolve o tema por meio de argumentação previsível e apresenta domínio mediano do texto dissertativo-argumentativo, com proposição, argumentação e conclusão
• 80: Desenvolve o tema recorrendo à cópia de trechos dos textos motivadores ou apresenta domínio insuficiente do texto dissertativo-argumentativo, não atendendo a estrutura com proposição, argumentação e conclusão
• 40: Apresenta o assunto, tangenciando o tema, ou demonstra domínio precário do texto dissertativo-argumentativo, com traços constantes de outros tipos textuais
• 0: Fuga ao tema/não atende à estrutura dissertativo-argumentativa. Nestes casos a redação recebe nota 0 (zero) e é anulada

COMPETÊNCIA 3 - Selecionar, relacionar, organizar e interpretar informações, fatos, opiniões e argumentos em defesa de um ponto de vista:
• 200: Apresenta informações, fatos e opiniões relacionados ao tema proposto, de forma consistente e organizada, configurando autoria, em defesa de um ponto de vista
• 160: Apresenta informações, fatos e opiniões relacionados ao tema, de forma organizada, com indícios de autoria, em defesa de um ponto de vista
• 120: Apresenta informações, fatos e opiniões relacionados ao tema, limitados aos argumentos dos textos motivadores e pouco organizados, em defesa de um ponto de vista
• 80: Apresenta informações, fatos e opiniões relacionados ao tema, mas desorganizados ou contraditórios e limitados aos argumentos dos textos motivadores, em defesa de um ponto de vista
• 40: Apresenta informações, fatos e opiniões pouco relacionados ao tema ou incoerentes e sem defesa de um ponto de vista
• 0: Apresenta informações, fatos e opiniões não relacionados ao tema e sem defesa de um ponto de vista

COMPETÊNCIA 4 - Demonstrar conhecimento dos mecanismos linguísticos necessários para a construção da argumentação:
• 200: Articula bem as partes do texto e apresenta repertório diversificado de recursos coesivos
• 160: Articula as partes do texto com poucas inadequações e apresenta repertório diversificado de recursos coesivos
• 120: Articula as partes do texto, de forma mediana, com inadequações, e apresenta repertório pouco diversificado de recursos coesivos
• 80: Articula as partes do texto, de forma insuficiente, com muitas inadequações e apresenta repertório limitado de recursos coesivos
• 40: Articula as partes do texto de forma precária
• 0: Não articula as informações

COMPETÊNCIA 5 - Elaborar proposta de intervenção para o problema abordado, respeitando os direitos humanos:
• 200: Elabora muito bem proposta de intervenção, de forma detalhada, relacionada ao tema e articulada à discussão desenvolvida no texto
• 160: Elabora bem proposta de intervenção relacionada ao tema e articulada à discussão desenvolvida no texto
• 120: Elabora, de forma mediana, proposta de intervenção relacionada ao tema e articulada à discussão desenvolvida no texto
• 80: Elabora, de forma insuficiente, proposta de intervenção relacionada ao tema, ou proposta não articulada com a discussão desenvolvida no texto
• 40: Apresenta proposta de intervenção vaga, precisa ou relacionada apenas ao assunto
• 0: Não apresenta proposta de intervenção ou apresenta proposta não relacionada ao tema ou ao assunto

Para cada competência, você deve:
1. Identificar a pontuação exata (0, 40, 80, 120, 160 ou 200)
2. Explicar por que essa pontuação foi atribuída
3. Dar exemplos específicos do texto do aluno`;

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
            content: `Tema: ${tema}\n\nRedação:\n${redacao}\n\nAvalie esta redação conforme os critérios OFICIAIS do ENEM e atribua as notas EXATAS (0, 40, 80, 120, 160 ou 200) para cada competência.`,
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
                      nota: { type: "number", enum: [0, 40, 80, 120, 160, 200] },
                      justificativa: { type: "string" },
                      exemplos: { type: "string" }
                    },
                    required: ["nota", "justificativa", "exemplos"]
                  },
                  competencia2: {
                    type: "object",
                    properties: {
                      nota: { type: "number", enum: [0, 40, 80, 120, 160, 200] },
                      justificativa: { type: "string" },
                      exemplos: { type: "string" }
                    },
                    required: ["nota", "justificativa", "exemplos"]
                  },
                  competencia3: {
                    type: "object",
                    properties: {
                      nota: { type: "number", enum: [0, 40, 80, 120, 160, 200] },
                      justificativa: { type: "string" },
                      exemplos: { type: "string" }
                    },
                    required: ["nota", "justificativa", "exemplos"]
                  },
                  competencia4: {
                    type: "object",
                    properties: {
                      nota: { type: "number", enum: [0, 40, 80, 120, 160, 200] },
                      justificativa: { type: "string" },
                      exemplos: { type: "string" }
                    },
                    required: ["nota", "justificativa", "exemplos"]
                  },
                  competencia5: {
                    type: "object",
                    properties: {
                      nota: { type: "number", enum: [0, 40, 80, 120, 160, 200] },
                      justificativa: { type: "string" },
                      exemplos: { type: "string" }
                    },
                    required: ["nota", "justificativa", "exemplos"]
                  },
                  pontos_fortes: { type: "string" },
                  pontos_melhoria: { type: "string" }
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

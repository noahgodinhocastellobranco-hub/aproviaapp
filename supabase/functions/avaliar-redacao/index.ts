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

    const systemPrompt = `Você é um avaliador especialista em redações do ENEM. Avalie a redação fornecida conforme os 5 critérios do ENEM:

Competência 1 (0-200): Domínio da modalidade escrita formal da língua portuguesa
Competência 2 (0-200): Compreender a proposta e aplicar conceitos das várias áreas de conhecimento
Competência 3 (0-200): Selecionar, relacionar, organizar e interpretar informações
Competência 4 (0-200): Demonstrar conhecimento dos mecanismos linguísticos
Competência 5 (0-200): Elaborar proposta de intervenção para o problema

Retorne:
1. Uma nota final de 0 a 1000 (soma das 5 competências)
2. Um feedback detalhado explicando a nota de cada competência
3. Pontos fortes e áreas de melhoria

Seja criterioso mas construtivo no feedback.`;

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
            content: `Tema: ${tema}\n\nRedação:\n${redacao}\n\nPor favor, avalie esta redação conforme os critérios do ENEM.`,
          },
        ],
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
    const feedbackText = data.choices?.[0]?.message?.content || "Não foi possível gerar feedback";

    // Extrair nota do feedback (assumindo que o modelo retorna algo como "Nota: 800")
    const notaMatch = feedbackText.match(/nota\s*final?[:\s]*(\d{1,4})/i);
    const nota = notaMatch ? parseInt(notaMatch[1]) : 0;

    return new Response(
      JSON.stringify({
        nota: Math.min(nota, 1000),
        feedback: feedbackText,
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

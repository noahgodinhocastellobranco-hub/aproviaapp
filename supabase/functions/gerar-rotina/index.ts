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
    const { scheduleData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    console.log("Recebendo dados de rotina:", JSON.stringify(scheduleData));

    const systemPrompt = `Você é a AprovI.A, uma especialista em planejamento de estudos para o ENEM. 
Sua tarefa é criar uma rotina de estudos personalizada e detalhada de segunda a domingo.

REGRAS IMPORTANTES:
- Respeite TODOS os horários ocupados que o aluno informou (escola, atividades, etc.)
- Distribua as matérias do ENEM de forma equilibrada: Linguagens, Matemática, Ciências da Natureza, Ciências Humanas e Redação
- Inclua pausas de 10-15 minutos entre blocos de estudo
- Nunca coloque estudo muito tarde da noite (respeite o horário de dormir)
- Inclua pelo menos 1 prática de redação por semana
- Sugira técnicas como Pomodoro para blocos de estudo
- Seja realista com o tempo disponível

FORMATO DA RESPOSTA:
Retorne a rotina no seguinte formato JSON (e SOMENTE o JSON, sem texto antes ou depois):

{
  "rotina": {
    "segunda": [
      {"horario": "06:00 - 06:30", "atividade": "Acordar e se preparar", "tipo": "pessoal"},
      {"horario": "07:00 - 12:00", "atividade": "Escola", "tipo": "escola"},
      {"horario": "14:00 - 15:30", "atividade": "Matemática - Funções e Gráficos", "tipo": "estudo"},
      {"horario": "15:30 - 15:45", "atividade": "Pausa", "tipo": "pausa"}
    ],
    "terca": [...],
    "quarta": [...],
    "quinta": [...],
    "sexta": [...],
    "sabado": [...],
    "domingo": [...]
  },
  "dicas": ["dica 1", "dica 2", "dica 3"],
  "horasEstudoSemana": 20
}

Os tipos possíveis são: "pessoal", "escola", "estudo", "pausa", "exercicio", "redacao", "revisao"`;

    const userMessage = `Aqui estão as informações do aluno para criar a rotina de estudos:

- Horário que acorda: ${scheduleData.acordar}
- Horário que dorme: ${scheduleData.dormir}
- Horário da escola: ${scheduleData.escolaInicio} até ${scheduleData.escolaFim}
- Dias da escola: ${scheduleData.diasEscola.join(", ")}
- Atividades extras: ${scheduleData.atividadesExtras || "Nenhuma"}
- Matérias com mais dificuldade: ${scheduleData.dificuldades || "Nenhuma específica"}
- Horas disponíveis para estudo por dia: ${scheduleData.horasEstudo || "O máximo possível"}
- Observações adicionais: ${scheduleData.observacoes || "Nenhuma"}

Crie uma rotina completa de segunda a domingo otimizada para o ENEM.`;

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
          { role: "user", content: userMessage },
        ],
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Erro do AI Gateway:", response.status, errorText);
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Limite de requisições excedido. Tente novamente em alguns minutos." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      throw new Error("Erro ao gerar rotina");
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;

    console.log("Resposta da IA:", content);

    // Extract JSON from the response
    let routineData;
    try {
      // Try to find JSON in the response
      const jsonMatch = content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        routineData = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("JSON não encontrado na resposta");
      }
    } catch (parseError) {
      console.error("Erro ao parsear JSON:", parseError);
      // Return the raw content if JSON parsing fails
      return new Response(
        JSON.stringify({ rawContent: content }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(JSON.stringify(routineData), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro na função gerar-rotina:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});

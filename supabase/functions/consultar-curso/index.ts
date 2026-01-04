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
    const { curso, universidade, modalidade } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    const systemPrompt = `Você é um especialista em vestibulares e ENEM no Brasil. Você tem conhecimento atualizado sobre notas de corte, cursos universitários e carreiras.

Sua função é fornecer informações PRECISAS e ÚTEIS sobre cursos universitários, incluindo:
1. Nota de corte estimada no SISU (baseada em dados reais das últimas edições)
2. Competências e conhecimentos que o candidato precisa dominar
3. Informações sobre o curso e a carreira

IMPORTANTE:
- Use dados reais e atualizados de notas de corte do SISU
- Considere a ampla concorrência e cotas quando relevante
- Seja específico sobre as matérias e competências do ENEM mais importantes para o curso
- Forneça dicas práticas de estudo

Retorne SEMPRE um JSON válido com a estrutura especificada.`;

    const userPrompt = `Forneça informações detalhadas sobre o curso:

Curso: ${curso}
${universidade ? `Universidade: ${universidade}` : "Universidade: Principais federais do Brasil"}
${modalidade ? `Modalidade: ${modalidade}` : "Modalidade: Ampla concorrência"}

Retorne um JSON com esta estrutura EXATA:
{
  "curso": "Nome do curso",
  "universidadesReferencia": ["Lista de 3-5 universidades federais de referência para este curso"],
  "notasCorte": {
    "amplaConcorrencia": {
      "minima": 650,
      "media": 720,
      "maxima": 800,
      "observacao": "Observação sobre variação entre universidades"
    },
    "cotasSociais": {
      "minima": 580,
      "media": 650,
      "maxima": 720
    }
  },
  "areasENEM": [
    {
      "area": "Nome da área do ENEM",
      "peso": "Alto/Médio/Baixo",
      "importancia": "Explicação de por que é importante",
      "topicos": ["Lista de 3-5 tópicos principais para estudar"]
    }
  ],
  "competenciasDominar": [
    {
      "competencia": "Nome da competência",
      "descricao": "Por que é essencial",
      "comoDesenvolver": "Dica prática"
    }
  ],
  "sobreOCurso": {
    "duracao": "X anos",
    "areas": ["Áreas de atuação"],
    "mercado": "Panorama do mercado de trabalho",
    "salarioMedio": "Faixa salarial inicial",
    "desafios": "Principais desafios da profissão"
  },
  "dicasEstudo": [
    "Lista de 4-6 dicas específicas para quem quer esse curso"
  ],
  "curiosidades": [
    "2-3 curiosidades interessantes sobre o curso ou profissão"
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
        temperature: 0.7,
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
      throw new Error("Erro ao consultar informações");
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content;
    
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Resposta inválida da IA");
    }
    
    const resultado = JSON.parse(jsonMatch[0]);

    return new Response(JSON.stringify(resultado), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro na função consultar-curso:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

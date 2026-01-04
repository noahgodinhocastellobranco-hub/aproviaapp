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
    const { respostas, questoes, redacao, temaRedacao } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    // Corrigir questões objetivas
    let acertos = 0;
    let erros = 0;
    const correcaoQuestoes: any[] = [];
    const competenciasErradas: string[] = [];

    for (const questao of questoes) {
      const respostaUsuario = respostas[questao.numero];
      const acertou = respostaUsuario === questao.gabarito;
      
      if (acertou) {
        acertos++;
      } else {
        erros++;
        competenciasErradas.push(questao.competencia);
      }

      correcaoQuestoes.push({
        numero: questao.numero,
        competencia: questao.competencia,
        respostaUsuario,
        gabarito: questao.gabarito,
        acertou,
        explicacao: questao.explicacao
      });
    }

    // Calcular nota TRI simulada (simplificada)
    const totalQuestoes = questoes.length;
    const percentualAcerto = acertos / totalQuestoes;
    
    // Simulação simplificada do TRI
    let notaObjetiva = 0;
    if (percentualAcerto <= 0.2) {
      notaObjetiva = 300 + (percentualAcerto * 500);
    } else if (percentualAcerto <= 0.5) {
      notaObjetiva = 400 + ((percentualAcerto - 0.2) * 600);
    } else if (percentualAcerto <= 0.8) {
      notaObjetiva = 580 + ((percentualAcerto - 0.5) * 500);
    } else {
      notaObjetiva = 730 + ((percentualAcerto - 0.8) * 350);
    }

    notaObjetiva = Math.min(Math.max(notaObjetiva, 300), 1000);

    // Corrigir redação se houver
    let correcaoRedacao = null;
    if (redacao && redacao.trim().length > 100) {
      const redacaoPrompt = `Você é um corretor especializado em redações do ENEM. Avalie a redação abaixo seguindo RIGOROSAMENTE os critérios do ENEM.

TEMA: ${temaRedacao}

REDAÇÃO DO CANDIDATO:
${redacao}

Avalie cada competência de 0 a 200 pontos (em múltiplos de 40: 0, 40, 80, 120, 160, 200):

Competência 1: Domínio da norma culta
Competência 2: Compreensão da proposta e gênero dissertativo-argumentativo
Competência 3: Seleção e organização de argumentos
Competência 4: Coesão textual
Competência 5: Proposta de intervenção

Retorne um JSON com esta estrutura EXATA:
{
  "competencias": [
    {"numero": 1, "nota": 160, "justificativa": "...", "pontosMelhorar": ["..."]},
    {"numero": 2, "nota": 120, "justificativa": "...", "pontosMelhorar": ["..."]},
    {"numero": 3, "nota": 140, "justificativa": "...", "pontosMelhorar": ["..."]},
    {"numero": 4, "nota": 160, "justificativa": "...", "pontosMelhorar": ["..."]},
    {"numero": 5, "nota": 120, "justificativa": "...", "pontosMelhorar": ["..."]}
  ],
  "notaTotal": 700,
  "feedbackGeral": "Feedback geral sobre a redação",
  "pontosFortes": ["..."],
  "pontosMelhorar": ["..."]
}`;

      const redacaoResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash",
          messages: [
            { role: "user", content: redacaoPrompt }
          ],
        }),
      });

      if (redacaoResponse.ok) {
        const redacaoData = await redacaoResponse.json();
        const redacaoContent = redacaoData.choices[0]?.message?.content;
        const jsonMatch = redacaoContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          correcaoRedacao = JSON.parse(jsonMatch[0]);
        }
      }
    }

    // Gerar feedback personalizado
    const feedbackPrompt = `Com base nos seguintes resultados de uma prova simulada do ENEM, gere um feedback personalizado e motivacional:

Acertos: ${acertos}/${totalQuestoes}
Nota estimada (objetiva): ${Math.round(notaObjetiva)}
Competências com mais erros: ${[...new Set(competenciasErradas)].join(", ") || "Nenhuma"}
${correcaoRedacao ? `Nota da redação: ${correcaoRedacao.notaTotal}/1000` : "Redação não realizada"}

Retorne um JSON com:
{
  "feedbackGeral": "Texto motivacional e analítico (2-3 parágrafos)",
  "areasEstudar": ["Lista de 3-5 áreas que o aluno precisa estudar mais"],
  "dicasEstudo": ["Lista de 3-5 dicas práticas de estudo"],
  "metaProximaProva": "Uma meta realista para a próxima prova"
}`;

    const feedbackResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "user", content: feedbackPrompt }
        ],
      }),
    });

    let feedbackPersonalizado = null;
    if (feedbackResponse.ok) {
      const feedbackData = await feedbackResponse.json();
      const feedbackContent = feedbackData.choices[0]?.message?.content;
      const jsonMatch = feedbackContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        feedbackPersonalizado = JSON.parse(jsonMatch[0]);
      }
    }

    const resultado = {
      questoes: {
        total: totalQuestoes,
        acertos,
        erros,
        percentual: Math.round((acertos / totalQuestoes) * 100),
        notaEstimada: Math.round(notaObjetiva),
        correcao: correcaoQuestoes,
        competenciasErradas: [...new Set(competenciasErradas)]
      },
      redacao: correcaoRedacao,
      feedback: feedbackPersonalizado
    };

    return new Response(JSON.stringify(resultado), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro na função corrigir-prova-enem:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

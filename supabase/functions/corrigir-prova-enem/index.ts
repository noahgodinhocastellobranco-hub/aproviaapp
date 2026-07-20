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
    let naoRespondidas = 0;
    const correcaoQuestoes: any[] = [];
    const competenciasErradas: string[] = [];

    for (const questao of questoes) {
      const respostaUsuario = respostas[questao.numero] || null;
      const acertou = respostaUsuario === questao.gabarito;
      
      if (!respostaUsuario) {
        naoRespondidas++;
        erros++;
        competenciasErradas.push(questao.competencia);
      } else if (acertou) {
        acertos++;
      } else {
        erros++;
        competenciasErradas.push(questao.competencia);
      }

      correcaoQuestoes.push({
        numero: questao.numero,
        competencia: questao.competencia,
        respostaUsuario: respostaUsuario || "Não respondida",
        gabarito: questao.gabarito,
        acertou,
        explicacao: questao.explicacao
      });
    }

    // Calcular nota TRI realista
    // O ENEM usa TRI onde a nota mínima é ~300 e máxima ~900 para cada área
    // Questões não respondidas = ERRADAS
    const totalQuestoes = questoes.length;
    const percentualAcerto = acertos / totalQuestoes;
    
    // Fórmula TRI mais realista baseada em dados históricos do ENEM
    // Nota mínima real: ~300 (chutou tudo errado)
    // Nota média: ~500-550 (acertou ~50%)
    // Nota máxima: ~800-900 (acertou ~90%+)
    // Nota 1000 é praticamente impossível (acertar 100% com padrão coerente)
    
    let notaObjetiva = 0;
    
    if (acertos === 0) {
      // Zero acertos = nota mínima
      notaObjetiva = 300;
    } else if (percentualAcerto <= 0.1) {
      // Até 10% de acerto - provavelmente chute
      notaObjetiva = 300 + (percentualAcerto * 400); // 300-340
    } else if (percentualAcerto <= 0.3) {
      // 10-30% - desempenho fraco
      notaObjetiva = 340 + ((percentualAcerto - 0.1) * 600); // 340-460
    } else if (percentualAcerto <= 0.5) {
      // 30-50% - desempenho abaixo da média
      notaObjetiva = 460 + ((percentualAcerto - 0.3) * 700); // 460-600
    } else if (percentualAcerto <= 0.7) {
      // 50-70% - desempenho médio/bom
      notaObjetiva = 600 + ((percentualAcerto - 0.5) * 650); // 600-730
    } else if (percentualAcerto <= 0.85) {
      // 70-85% - desempenho muito bom
      notaObjetiva = 730 + ((percentualAcerto - 0.7) * 600); // 730-820
    } else if (percentualAcerto <= 0.95) {
      // 85-95% - desempenho excelente
      notaObjetiva = 820 + ((percentualAcerto - 0.85) * 700); // 820-890
    } else {
      // 95-100% - desempenho excepcional
      notaObjetiva = 890 + ((percentualAcerto - 0.95) * 600); // 890-920
    }
    
    // Penalização por padrão de resposta (detectar chute)
    // Se há muitas não respondidas, penalizar
    if (naoRespondidas > totalQuestoes * 0.3) {
      notaObjetiva = notaObjetiva * 0.9;
    }

    // Limitar entre 300 e 900 (notas históricas reais do ENEM)
    notaObjetiva = Math.min(Math.max(notaObjetiva, 300), 900);

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

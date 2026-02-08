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

    const areasConfig: Record<string, { nome: string; competencias: string[]; visualInstructions: string }> = {
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
        ],
        visualInstructions: `IMPORTANTE: Para 3 a 4 questões, adicione um campo "visual" com uma tirinha ou charge. Formato:
{
  "tipo": "tirinha",
  "titulo": "Título da tirinha ou do autor (ex: Armandinho, Mafalda, Calvin e Haroldo)",
  "quadros": [
    { "personagem": "Nome", "fala": "Diálogo do personagem" },
    { "personagem": "Nome", "fala": "Resposta ou continuação" },
    { "personagem": "Nome", "fala": "Desfecho ou punchline" }
  ],
  "fonte": "Autor da tirinha (inventado mas realista)"
}
As tirinhas devem abordar temas como: variação linguística, figuras de linguagem, crítica social, humor com linguagem, intertextualidade. Crie tirinhas originais mas no estilo de quadrinistas brasileiros famosos (Armandinho, Mafalda, Hagar, Laerte). Use 3-4 quadros por tirinha. O texto base da questão deve fazer referência à tirinha e pedir análise linguística ou interpretação.`
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
        ],
        visualInstructions: `IMPORTANTE: Para 4 a 5 questões, adicione um campo "visual" com dados de gráfico ou tabela. Formatos possíveis:

Gráfico de barras/linha/pizza:
{
  "tipo": "grafico",
  "tipoGrafico": "barras" | "linha" | "pizza",
  "titulo": "Título descritivo do gráfico",
  "eixoX": "Rótulo do eixo X (para barras/linha)",
  "eixoY": "Rótulo do eixo Y (para barras/linha)",
  "dados": [
    { "nome": "Categoria A", "valor": 150 },
    { "nome": "Categoria B", "valor": 230 }
  ]
}

Tabela:
{
  "tipo": "tabela",
  "titulo": "Título da tabela",
  "colunas": ["Coluna 1", "Coluna 2", "Coluna 3"],
  "linhas": [
    ["Dado 1", "Dado 2", "Dado 3"],
    ["Dado 4", "Dado 5", "Dado 6"]
  ]
}

Use contextos realistas: pesquisas IBGE, dados econômicos, vendas, populações, temperaturas. Os gráficos devem ter 4-7 pontos de dados. Questões devem exigir leitura, comparação ou cálculo a partir dos dados visuais.`
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
        ],
        visualInstructions: `IMPORTANTE: Para 3 a 4 questões, adicione um campo "visual" com gráficos ou tabelas. Formatos:

Gráfico (para física - velocidade×tempo, temperatura×tempo, etc):
{
  "tipo": "grafico",
  "tipoGrafico": "linha",
  "titulo": "Velocidade em função do tempo",
  "eixoX": "Tempo (s)",
  "eixoY": "Velocidade (m/s)",
  "dados": [
    { "nome": "0", "valor": 0 },
    { "nome": "2", "valor": 10 },
    { "nome": "4", "valor": 20 }
  ]
}

Tabela (para química - tabela periódica parcial, dados experimentais):
{
  "tipo": "tabela",
  "titulo": "Dados experimentais",
  "colunas": ["Substância", "Massa (g)", "Volume (mL)"],
  "linhas": [["Água", "100", "100"], ["Óleo", "80", "100"]]
}

Gráfico de barras (para biologia - populações, ecologia):
{
  "tipo": "grafico",
  "tipoGrafico": "barras",
  "titulo": "População de espécies no bioma",
  "eixoX": "Espécie",
  "eixoY": "Indivíduos",
  "dados": [{"nome": "A", "valor": 500}, {"nome": "B", "valor": 300}]
}

Use contextos científicos realistas. Os dados devem ser coerentes e as questões devem exigir análise ou cálculo a partir deles.`
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
        ],
        visualInstructions: `IMPORTANTE: Para 2 a 3 questões, adicione um campo "visual" com gráficos ou tabelas com dados sociais/históricos/geográficos. Formatos:

Gráfico de barras (para geografia - PIB, população, IDH):
{
  "tipo": "grafico",
  "tipoGrafico": "barras",
  "titulo": "IDH por região do Brasil (2023)",
  "eixoX": "Região",
  "eixoY": "IDH",
  "dados": [{"nome": "Sul", "valor": 0.81}, {"nome": "Nordeste", "valor": 0.66}]
}

Tabela (para dados históricos, demográficos):
{
  "tipo": "tabela",
  "titulo": "Evolução da população urbana no Brasil",
  "colunas": ["Década", "% Urbana", "% Rural"],
  "linhas": [["1950", "36%", "64%"], ["2020", "87%", "13%"]]
}

Use dados realistas de censos, organismos internacionais e contextos históricos.`
      }
    };

    const areaInfo = areasConfig[area];
    if (!areaInfo) {
      throw new Error("Área inválida");
    }

    console.log(`Gerando ${quantidade} questões para ${areaInfo.nome} com visuais`);

    const systemPrompt = `Você é um especialista em elaboração de questões ENEM. Gere questões de alta qualidade com texto base curto (2-3 frases), 5 alternativas (A-E), 1 correta, e explicação. Use a semente "${provaId}" para variar as questões. Retorne APENAS JSON válido, sem markdown.`;

    const userPrompt = `Gere ${quantidade} questões para "${areaInfo.nome}".
Competências a cobrir: ${areaInfo.competencias.slice(0, quantidade).join(", ")}

${areaInfo.visualInstructions}

Para questões SEM visual, NÃO inclua o campo "visual".

Retorne JSON no formato:
{"questoes":[{"numero":1,"competencia":"Nome da competência","textoBase":"Texto contextual da questão","fonte":"Fonte fictícia realista","enunciado":"Pergunta clara e objetiva","alternativas":{"A":"","B":"","C":"","D":"","E":""},"gabarito":"A","explicacao":"Explicação detalhada da resposta correta","visual":null}]}

O campo "visual" deve ser null para questões sem elemento visual, ou um objeto conforme as instruções acima.`;

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
        temperature: 0.4,
      }),
    });

    if (!response.ok) {
      console.error(`API error: ${response.status}`);
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
    
    console.log("Resposta recebida, extraindo JSON...");
    
    // Extract JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("Resposta sem JSON válido:", content?.substring(0, 200));
      throw new Error("Resposta inválida da IA");
    }
    
    const questoes = JSON.parse(jsonMatch[0]);
    
    // Log visual stats
    const visualCount = questoes.questoes?.filter((q: any) => q.visual)?.length || 0;
    console.log(`Questões geradas: ${questoes.questoes?.length}, com visual: ${visualCount}`);

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

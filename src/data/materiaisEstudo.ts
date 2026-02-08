export interface Questao {
  enunciado: string;
  opcoes: string[];
  correta: number;
  explicacao: string;
}

export interface Topico {
  titulo: string;
  explicacao: string;
  questoes: Questao[];
}

export interface Materia {
  id: string;
  titulo: string;
  icon: string;
  cor: string;
  topicos: Topico[];
}

export const materias: Materia[] = [
  // ═══════════════════════════════════════════
  // MATEMÁTICA
  // ═══════════════════════════════════════════
  {
    id: "matematica",
    titulo: "Matemática",
    icon: "Calculator",
    cor: "bg-blue-500",
    topicos: [
      {
        titulo: "Porcentagem",
        explicacao: "Porcentagem é uma razão centesimal (fração com denominador 100). Para calcular x% de um valor, multiplique por x/100. Muito usada em descontos, juros, aumentos e estatísticas no ENEM.",
        questoes: [
          { enunciado: "Qual é 25% de 200?", opcoes: ["25", "50", "75", "100"], correta: 1, explicacao: "25% de 200 = 0,25 × 200 = 50." },
          { enunciado: "Um produto de R$ 80 teve aumento de 15%. Novo preço?", opcoes: ["R$ 90", "R$ 92", "R$ 95", "R$ 88"], correta: 1, explicacao: "80 × 0,15 = 12. Preço: 80 + 12 = R$ 92." },
          { enunciado: "18 acertos em 30 questões = qual porcentagem?", opcoes: ["50%", "55%", "60%", "65%"], correta: 2, explicacao: "18/30 = 0,6 = 60%." }
        ]
      },
      {
        titulo: "Regra de Três",
        explicacao: "Método para resolver problemas com grandezas proporcionais (direta ou inversamente). Monte a proporção e resolva com multiplicação cruzada. É um dos temas mais recorrentes no ENEM.",
        questoes: [
          { enunciado: "5 cadernos custam R$ 30. Quanto custam 8?", opcoes: ["R$ 40", "R$ 45", "R$ 48", "R$ 50"], correta: 2, explicacao: "(8 × 30)/5 = R$ 48." },
          { enunciado: "240 km com 20L. Quantos litros para 360 km?", opcoes: ["25L", "28L", "30L", "32L"], correta: 2, explicacao: "(360 × 20)/240 = 30 litros." },
          { enunciado: "3 pedreiros fazem um muro em 12 dias. E 6 pedreiros?", opcoes: ["4 dias", "6 dias", "8 dias", "10 dias"], correta: 1, explicacao: "Inversamente proporcional: 3×12 = 6×x → x = 6 dias." }
        ]
      },
      {
        titulo: "Funções (1º e 2º grau)",
        explicacao: "Função é uma relação onde cada valor de x tem um único valor de y. A do 1º grau (f(x)=ax+b) gera reta; a do 2º grau (f(x)=ax²+bx+c) gera parábola. Saber encontrar raízes, vértice e interpretar gráficos é essencial.",
        questoes: [
          { enunciado: "f(x) = 2x + 1. Qual f(3)?", opcoes: ["5", "6", "7", "8"], correta: 2, explicacao: "f(3) = 2(3)+1 = 7." },
          { enunciado: "Zero de f(x) = 3x - 9:", opcoes: ["x=2", "x=3", "x=-3", "x=9"], correta: 1, explicacao: "3x-9=0 → x=3." },
          { enunciado: "Vértice de f(x)=x²-4x+3, coordenada x:", opcoes: ["1", "2", "3", "4"], correta: 1, explicacao: "xv = -b/(2a) = 4/2 = 2." }
        ]
      },
      {
        titulo: "Geometria Plana",
        explicacao: "Estuda figuras 2D: triângulos, quadriláteros, círculos. Essencial saber áreas, perímetros e o Teorema de Pitágoras (a²=b²+c²). No ENEM, problemas contextualizados com plantas, terrenos e construções são frequentes.",
        questoes: [
          { enunciado: "Área de retângulo 8cm × 5cm:", opcoes: ["13 cm²", "26 cm²", "40 cm²", "80 cm²"], correta: 2, explicacao: "A = 8×5 = 40 cm²." },
          { enunciado: "Hipotenusa de triângulo com catetos 3 e 4:", opcoes: ["5", "6", "7", "8"], correta: 0, explicacao: "h² = 9+16 = 25 → h = 5." },
          { enunciado: "Área de círculo raio 3 (π≈3):", opcoes: ["9 cm²", "18 cm²", "27 cm²", "36 cm²"], correta: 2, explicacao: "A = π×r² = 3×9 = 27 cm²." }
        ]
      },
      {
        titulo: "Geometria Espacial",
        explicacao: "Estuda sólidos tridimensionais: prismas, cilindros, cones, esferas e pirâmides. É fundamental saber calcular volumes e áreas de superfície. No ENEM, aparecem problemas com caixas d'água, embalagens e construções.",
        questoes: [
          { enunciado: "Volume de um cubo de aresta 3 cm:", opcoes: ["9 cm³", "18 cm³", "27 cm³", "36 cm³"], correta: 2, explicacao: "V = a³ = 3³ = 27 cm³." },
          { enunciado: "Volume de um cilindro com raio 2 e altura 5 (π≈3):", opcoes: ["30 cm³", "45 cm³", "60 cm³", "120 cm³"], correta: 2, explicacao: "V = π×r²×h = 3×4×5 = 60 cm³." },
          { enunciado: "Um paralelepípedo tem dimensões 2×3×4. Seu volume é:", opcoes: ["9", "14", "24", "48"], correta: 2, explicacao: "V = 2×3×4 = 24." }
        ]
      },
      {
        titulo: "Probabilidade e Estatística",
        explicacao: "Probabilidade mede a chance de um evento (favoráveis/possíveis). Estatística organiza dados usando média, mediana e moda. No ENEM, gráficos, tabelas e interpretação de dados são cobrados em praticamente todas as provas.",
        questoes: [
          { enunciado: "Dado honesto: probabilidade de número par:", opcoes: ["1/6", "1/3", "1/2", "2/3"], correta: 2, explicacao: "{2,4,6} = 3 de 6 = 1/2." },
          { enunciado: "Média de 4, 6, 8, 10:", opcoes: ["6", "7", "8", "9"], correta: 1, explicacao: "(4+6+8+10)/4 = 7." },
          { enunciado: "Mediana de {3,7,1,9,5}:", opcoes: ["3", "5", "7", "9"], correta: 1, explicacao: "Ordenado: {1,3,5,7,9}. Central = 5." }
        ]
      },
      {
        titulo: "Análise Combinatória",
        explicacao: "Estuda técnicas de contagem: arranjo (ordem importa), combinação (ordem não importa) e permutação (todos os elementos). Princípio Fundamental da Contagem: multiplica-se as possibilidades de cada etapa.",
        questoes: [
          { enunciado: "De quantas formas 3 pessoas podem sentar em 3 cadeiras?", opcoes: ["3", "6", "9", "12"], correta: 1, explicacao: "Permutação: 3! = 3×2×1 = 6." },
          { enunciado: "Placa com 3 letras (26) e 4 números (10). Total de placas:", opcoes: ["26³×10⁴", "26×10", "26+10", "26⁴×10³"], correta: 0, explicacao: "PFC: 26×26×26×10×10×10×10 = 26³×10⁴." },
          { enunciado: "De 10 alunos, de quantas formas escolher 3 para uma comissão?", opcoes: ["30", "60", "120", "720"], correta: 2, explicacao: "C(10,3) = 10!/(3!×7!) = 720/6 = 120." }
        ]
      },
      {
        titulo: "Progressões (PA e PG)",
        explicacao: "PA (Progressão Aritmética): cada termo é obtido somando uma razão constante. PG (Progressão Geométrica): cada termo é obtido multiplicando por uma razão constante. Fórmulas do termo geral e soma são essenciais.",
        questoes: [
          { enunciado: "PA: 2, 5, 8, 11... Qual o 10º termo?", opcoes: ["26", "29", "32", "35"], correta: 1, explicacao: "an = a1 + (n-1)×r = 2 + 9×3 = 29." },
          { enunciado: "PG: 3, 6, 12, 24... Qual a razão?", opcoes: ["2", "3", "4", "6"], correta: 0, explicacao: "q = 6/3 = 2." },
          { enunciado: "Soma dos 5 primeiros termos da PA: 1, 3, 5, 7, 9:", opcoes: ["20", "25", "30", "35"], correta: 1, explicacao: "S = n×(a1+an)/2 = 5×(1+9)/2 = 25." }
        ]
      },
      {
        titulo: "Matemática Financeira",
        explicacao: "Trata de juros simples (J=C×i×t) e compostos (M=C×(1+i)ⁿ), descontos e lucros. No ENEM, problemas contextualizados com compras, empréstimos, financiamentos e investimentos são muito comuns.",
        questoes: [
          { enunciado: "Juro simples de R$ 1.000 a 5%/mês por 3 meses:", opcoes: ["R$ 50", "R$ 100", "R$ 150", "R$ 200"], correta: 2, explicacao: "J = 1000×0,05×3 = R$ 150." },
          { enunciado: "Produto de R$ 200 com 30% de lucro. Preço de venda:", opcoes: ["R$ 230", "R$ 250", "R$ 260", "R$ 280"], correta: 2, explicacao: "200×0,30 = 60. Venda: 260." },
          { enunciado: "Item de R$ 500 com 10% de desconto à vista:", opcoes: ["R$ 400", "R$ 450", "R$ 490", "R$ 480"], correta: 1, explicacao: "500 - 50 = R$ 450." }
        ]
      },
      {
        titulo: "Trigonometria",
        explicacao: "Estuda relações entre ângulos e lados de triângulos. No triângulo retângulo: sen=CO/HIP, cos=CA/HIP, tg=CO/CA. Valores notáveis (30°, 45°, 60°) são cobrados. Também aparece em problemas de distância e altura.",
        questoes: [
          { enunciado: "Sen 30° é igual a:", opcoes: ["1/2", "√2/2", "√3/2", "1"], correta: 0, explicacao: "Sen 30° = 1/2 (valor notável a ser memorizado)." },
          { enunciado: "Cos 60° é igual a:", opcoes: ["1/2", "√2/2", "√3/2", "0"], correta: 0, explicacao: "Cos 60° = 1/2." },
          { enunciado: "Tg 45° é igual a:", opcoes: ["0", "1/2", "1", "√3"], correta: 2, explicacao: "Tg 45° = sen45°/cos45° = 1." }
        ]
      },
      {
        titulo: "Leitura de Gráficos e Tabelas",
        explicacao: "A habilidade de interpretar gráficos (barras, linhas, pizza, histograma) e tabelas é uma das mais cobradas no ENEM. É preciso extrair informações, comparar dados, calcular variações e identificar tendências.",
        questoes: [
          { enunciado: "Em um gráfico de barras, a barra mais alta representa:", opcoes: ["O menor valor", "O maior valor", "A média", "A mediana"], correta: 1, explicacao: "Em gráficos de barras, a altura da barra é proporcional ao valor representado." },
          { enunciado: "Um gráfico de pizza com setor de 90° representa qual fração?", opcoes: ["1/2", "1/3", "1/4", "1/5"], correta: 2, explicacao: "90°/360° = 1/4 do total." },
          { enunciado: "Se uma tabela mostra vendas de 100 em janeiro e 150 em fevereiro, o aumento percentual foi:", opcoes: ["25%", "33%", "50%", "55%"], correta: 2, explicacao: "Aumento = (150-100)/100 = 50/100 = 50%." }
        ]
      },
      {
        titulo: "Razão e Proporção",
        explicacao: "Razão é a divisão entre duas grandezas. Proporção é a igualdade entre duas razões. Conceitos ligados a escala de mapas, receitas, misturas e divisão proporcional. Base para regra de três e porcentagem.",
        questoes: [
          { enunciado: "Em um mapa de escala 1:50.000, 2cm representam:", opcoes: ["100 m", "500 m", "1 km", "5 km"], correta: 2, explicacao: "2cm × 50.000 = 100.000cm = 1.000m = 1 km." },
          { enunciado: "Dividir R$ 900 entre A e B na razão 2:1. A recebe:", opcoes: ["R$ 300", "R$ 450", "R$ 600", "R$ 700"], correta: 2, explicacao: "Total de partes: 3. A = 2/3 × 900 = R$ 600." },
          { enunciado: "A razão entre 15 e 25 simplificada é:", opcoes: ["3/5", "5/3", "1/2", "2/3"], correta: 0, explicacao: "15/25 = 3/5 (dividindo ambos por 5)." }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════
  // PORTUGUÊS
  // ═══════════════════════════════════════════
  {
    id: "portugues",
    titulo: "Português",
    icon: "BookOpen",
    cor: "bg-emerald-500",
    topicos: [
      {
        titulo: "Interpretação de Texto",
        explicacao: "Interpretar é compreender o sentido global, identificar a ideia central, argumentos do autor e informações implícitas. No ENEM, distinguir fatos de opiniões e reconhecer o contexto de produção é fundamental.",
        questoes: [
          { enunciado: "Quando o autor usa ironia, ele pretende:", opcoes: ["Dizer exatamente o que pensa", "Expressar o contrário do literal", "Fazer descrição objetiva", "Narrar um fato"], correta: 1, explicacao: "A ironia diz o contrário do que se quer expressar." },
          { enunciado: "A ideia principal de um texto geralmente está:", opcoes: ["Na primeira frase", "No título apenas", "Distribuída ao longo do texto", "Na última frase"], correta: 2, explicacao: "A ideia central permeia o texto e pode ser sintetizada." },
          { enunciado: "Inferência é:", opcoes: ["Copiar o texto", "Deduzir algo não dito explicitamente a partir de pistas", "Resumir o texto", "Criticar o autor"], correta: 1, explicacao: "Inferir é chegar a uma conclusão a partir de informações implícitas no texto." }
        ]
      },
      {
        titulo: "Figuras de Linguagem",
        explicacao: "Recursos estilísticos que tornam a comunicação mais expressiva. Mais cobradas: metáfora (comparação implícita), metonímia (substituição por relação), hipérbole (exagero), ironia, antítese (oposição), personificação e eufemismo.",
        questoes: [
          { enunciado: "\"Aquele homem é um touro.\" Figura:", opcoes: ["Hipérbole", "Metáfora", "Metonímia", "Eufemismo"], correta: 1, explicacao: "Metáfora: comparação implícita (sem 'como')." },
          { enunciado: "\"Li Machado de Assis.\" Figura:", opcoes: ["Metáfora", "Antítese", "Metonímia", "Pleonasmo"], correta: 2, explicacao: "Metonímia: autor no lugar da obra." },
          { enunciado: "\"Chorei rios de lágrimas.\" Figura:", opcoes: ["Eufemismo", "Ironia", "Hipérbole", "Metáfora"], correta: 2, explicacao: "Hipérbole: exagero intencional." }
        ]
      },
      {
        titulo: "Variação Linguística",
        explicacao: "Diferentes formas de usar a língua conforme fatores geográficos (diatópica), sociais (diastrática), históricos (diacrônica) e situacionais (diafásica). Nenhuma variante é superior; a adequação depende do contexto.",
        questoes: [
          { enunciado: "Variação regional é chamada de:", opcoes: ["Social", "Diatópica", "Histórica", "Estilística"], correta: 1, explicacao: "Diatópica = relacionada à região geográfica." },
          { enunciado: "Falar diferente com amigos e na entrevista é variação:", opcoes: ["Diatópica", "Diacrônica", "Diafásica", "Diastrática"], correta: 2, explicacao: "Diafásica = adaptação conforme a situação." },
          { enunciado: "Considerar uma variante 'errada' é:", opcoes: ["Análise gramatical", "Preconceito linguístico", "Norma culta", "Variação histórica"], correta: 1, explicacao: "Preconceito linguístico julga negativamente falas que fogem da norma padrão." }
        ]
      },
      {
        titulo: "Gêneros Textuais",
        explicacao: "Formas de organização do texto conforme função social: notícia informa, editorial opina, carta argumenta, crônica narra o cotidiano, artigo de opinião defende uma tese. Reconhecer o gênero ajuda a compreender a intenção comunicativa.",
        questoes: [
          { enunciado: "Uma notícia tem como função:", opcoes: ["Entreter", "Informar sobre fatos recentes", "Convencer de uma opinião", "Narrar ficção"], correta: 1, explicacao: "A notícia informa sobre fatos reais e recentes." },
          { enunciado: "O editorial é caracterizado por:", opcoes: ["Narrar uma história", "Apresentar a opinião do veículo", "Descrever um lugar", "Ensinar uma receita"], correta: 1, explicacao: "O editorial expressa a opinião do jornal sobre um tema." },
          { enunciado: "A crônica retrata:", opcoes: ["Apenas temas científicos", "O cotidiano de forma leve e reflexiva", "É sempre humorística", "Linguagem exclusivamente formal"], correta: 1, explicacao: "Aborda o cotidiano com leveza, podendo ser reflexiva ou humorística." }
        ]
      },
      {
        titulo: "Concordância Verbal e Nominal",
        explicacao: "Concordância verbal: verbo concorda com o sujeito. Concordância nominal: adjetivos e artigos concordam com o substantivo. Casos especiais como sujeito coletivo, verbos impessoais e expressões partitivas são muito cobrados.",
        questoes: [
          { enunciado: "\"Faz dois anos que não viajo.\" O verbo está:", opcoes: ["Errado, deveria ser 'fazem'", "Correto, 'fazer' indicando tempo é impessoal", "Errado, deveria ser 'fez'", "Correto, concordando com 'anos'"], correta: 1, explicacao: "'Fazer' indicando tempo é impessoal: fica no singular." },
          { enunciado: "\"É necessário paciência\" está:", opcoes: ["Errada", "Correta, substantivo sem determinante", "Errada, deveria ser 'são necessárias'", "Nenhuma alternativa"], correta: 1, explicacao: "Sem artigo antes do substantivo, 'é necessário' fica invariável." },
          { enunciado: "\"A maioria dos alunos chegou/chegaram.\" Ambas:", opcoes: ["Erradas", "Corretas", "Só 'chegou' correta", "Só 'chegaram' correta"], correta: 1, explicacao: "Sujeito coletivo + complemento plural admite as duas concordâncias." }
        ]
      },
      {
        titulo: "Funções da Linguagem",
        explicacao: "São 6 funções segundo Jakobson: referencial (informar), emotiva (emissor), conativa/apelativa (receptor), fática (canal), metalinguística (código) e poética (mensagem). O ENEM cobra identificação da função predominante.",
        questoes: [
          { enunciado: "Um texto publicitário que diz 'Compre já!' usa função:", opcoes: ["Referencial", "Emotiva", "Conativa (apelativa)", "Poética"], correta: 2, explicacao: "Função conativa/apelativa: foco no receptor, busca convencer ou persuadir." },
          { enunciado: "Um dicionário usa predominantemente função:", opcoes: ["Poética", "Emotiva", "Metalinguística", "Fática"], correta: 2, explicacao: "Metalinguística: linguagem falando sobre a própria linguagem." },
          { enunciado: "\"Alô? Você está me ouvindo?\" é função:", opcoes: ["Referencial", "Fática", "Conativa", "Emotiva"], correta: 1, explicacao: "Função fática: foco no canal de comunicação, testar se funciona." }
        ]
      },
      {
        titulo: "Intertextualidade",
        explicacao: "Relação entre textos. Pode ser paródia (imitação cômica), paráfrase (reescrita com mesmo sentido), citação (referência direta) ou alusão (referência indireta). No ENEM, é preciso identificar diálogos entre textos de épocas e gêneros diferentes.",
        questoes: [
          { enunciado: "Quando um texto imita outro de forma cômica ou crítica, temos:", opcoes: ["Paráfrase", "Paródia", "Citação", "Plágio"], correta: 1, explicacao: "Paródia é a imitação de um texto com intenção humorística ou crítica." },
          { enunciado: "Reescrever um texto mantendo o mesmo sentido é:", opcoes: ["Paródia", "Paráfrase", "Alusão", "Pastiche"], correta: 1, explicacao: "Paráfrase mantém o sentido original com outras palavras." },
          { enunciado: "Fazer referência indireta a outro texto/obra é:", opcoes: ["Citação", "Plágio", "Alusão", "Tradução"], correta: 2, explicacao: "Alusão é uma referência indireta que o leitor deve reconhecer pelo contexto." }
        ]
      },
      {
        titulo: "Semântica e Conotação/Denotação",
        explicacao: "Denotação é o sentido literal/dicionário da palavra. Conotação é o sentido figurado/subjetivo. A semântica estuda os significados: sinônimos, antônimos, polissemia (várias acepções), ambiguidade e campos semânticos.",
        questoes: [
          { enunciado: "\"Ela tem um coração de pedra\" usa sentido:", opcoes: ["Denotativo", "Conotativo", "Literal", "Técnico"], correta: 1, explicacao: "Conotativo (figurado): coração de pedra = pessoa fria, insensível." },
          { enunciado: "Polissemia significa que uma palavra:", opcoes: ["Não tem significado", "Tem vários significados", "É estrangeira", "É inventada"], correta: 1, explicacao: "Polissemia: mesma palavra com diferentes significados conforme o contexto (ex: 'manga' de camisa/fruta)." },
          { enunciado: "Ambiguidade é quando uma frase:", opcoes: ["Não faz sentido", "Permite mais de uma interpretação", "É muito longa", "Está incorreta gramaticalmente"], correta: 1, explicacao: "Ambiguidade: frase que admite dupla interpretação, geralmente por problema de construção." }
        ]
      },
      {
        titulo: "Movimentos Literários",
        explicacao: "O ENEM cobra reconhecimento de características de movimentos como Romantismo (idealização, subjetividade), Realismo (crítica social, objetividade), Modernismo (ruptura, linguagem coloquial, identidade brasileira) e suas principais obras e autores.",
        questoes: [
          { enunciado: "O Romantismo brasileiro é marcado por:", opcoes: ["Objetividade científica", "Idealização, subjetividade e nacionalismo", "Ruptura com a gramática", "Poesia concreta"], correta: 1, explicacao: "O Romantismo valoriza a emoção, o amor idealizado e a exaltação da nação." },
          { enunciado: "Machado de Assis é representante do:", opcoes: ["Romantismo", "Realismo", "Modernismo", "Barroco"], correta: 1, explicacao: "Machado de Assis é o maior expoente do Realismo brasileiro, com crítica social e psicológica." },
          { enunciado: "A Semana de Arte Moderna de 1922 marcou o início do:", opcoes: ["Romantismo", "Realismo", "Modernismo", "Parnasianismo"], correta: 2, explicacao: "A Semana de 22 inaugurou o Modernismo no Brasil, rompendo com padrões estéticos tradicionais." }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════
  // HISTÓRIA
  // ═══════════════════════════════════════════
  {
    id: "historia",
    titulo: "História",
    icon: "Landmark",
    cor: "bg-amber-500",
    topicos: [
      {
        titulo: "Brasil Colônia",
        explicacao: "Período de 1500-1822 marcado por exploração de recursos, mão de obra escravizada, capitanias hereditárias, governo-geral, ciclos econômicos (pau-brasil, açúcar, ouro) e movimentos de resistência como quilombos.",
        questoes: [
          { enunciado: "Capitanias hereditárias foram criadas por:", opcoes: ["D. Pedro I", "D. João VI", "D. João III", "Cabral"], correta: 2, explicacao: "D. João III criou as capitanias em 1534 para colonizar o território." },
          { enunciado: "Principal mão de obra nos engenhos:", opcoes: ["Europeia assalariada", "Indígena livre", "Escravizada africana", "Imigrante asiática"], correta: 2, explicacao: "A escravidão africana foi a base da economia açucareira." },
          { enunciado: "A Inconfidência Mineira (1789) buscava:", opcoes: ["Abolição", "Independência", "Volta do pau-brasil", "Criar universidades"], correta: 1, explicacao: "Movimento separatista contra a cobrança abusiva de impostos (derrama)." }
        ]
      },
      {
        titulo: "Escravidão e Abolição",
        explicacao: "A escravidão no Brasil durou mais de 300 anos (1550-1888). O processo abolicionista foi gradual: Lei Eusébio de Queiroz (1850, fim do tráfico), Lei do Ventre Livre (1871), Lei dos Sexagenários (1885) e Lei Áurea (1888). A luta negra e os quilombos foram formas de resistência.",
        questoes: [
          { enunciado: "A Lei Áurea foi assinada em:", opcoes: ["1822", "1850", "1871", "1888"], correta: 3, explicacao: "A Lei Áurea (13/05/1888) aboliu oficialmente a escravidão no Brasil." },
          { enunciado: "Os quilombos foram:", opcoes: ["Fazendas de café", "Comunidades de resistência de escravizados fugidos", "Igrejas coloniais", "Portos comerciais"], correta: 1, explicacao: "Quilombos foram comunidades formadas por pessoas escravizadas que fugiam, sendo o de Palmares o mais famoso." },
          { enunciado: "A Lei do Ventre Livre determinava que:", opcoes: ["Todos os escravizados seriam libertados", "Filhos de escravizadas nasceriam livres", "O tráfico seria proibido", "Escravizados com mais de 60 anos seriam livres"], correta: 1, explicacao: "A Lei do Ventre Livre (1871) declarava livres os filhos de mulheres escravizadas nascidos após a lei." }
        ]
      },
      {
        titulo: "República Velha (1889-1930)",
        explicacao: "Período pós-monarquia marcado pela política do café com leite (alternância SP e MG), coronelismo, voto de cabresto, fraudes eleitorais e a economia cafeeira. Terminou com a Revolução de 1930 que levou Vargas ao poder.",
        questoes: [
          { enunciado: "A 'política do café com leite' era a alternância entre:", opcoes: ["Norte e Sul", "São Paulo e Minas Gerais", "Rio e Bahia", "Militares e civis"], correta: 1, explicacao: "SP (café) e MG (leite) se alternavam na presidência, controlando as eleições." },
          { enunciado: "O coronelismo era:", opcoes: ["Um cargo militar", "O poder político de grandes proprietários rurais", "Uma religião", "Um partido político"], correta: 1, explicacao: "Coronéis eram grandes fazendeiros que controlavam votos e poder local através de favores e ameaças." },
          { enunciado: "O 'voto de cabresto' significava:", opcoes: ["Voto secreto", "Voto controlado pelos coronéis", "Voto feminino", "Voto eletrônico"], correta: 1, explicacao: "Os coronéis obrigavam eleitores a votar em seus candidatos, controlando o resultado das eleições." }
        ]
      },
      {
        titulo: "Era Vargas",
        explicacao: "Getúlio Vargas governou em dois períodos (1930-1945 e 1951-1954). Criou a CLT, investiu na industrialização, implantou o Estado Novo (ditadura), controlou sindicatos e promoveu o nacionalismo econômico com a Petrobras e o BNDE.",
        questoes: [
          { enunciado: "A CLT foi criada em:", opcoes: ["1930", "1937", "1943", "1954"], correta: 2, explicacao: "CLT promulgada em 1º de maio de 1943." },
          { enunciado: "O Estado Novo (1937-1945) foi:", opcoes: ["Democracia plena", "Ditadura com censura", "Parlamentarismo", "Abertura total"], correta: 1, explicacao: "Regime ditatorial com censura (DIP), perseguição e centralização." },
          { enunciado: "A Petrobras foi criada em qual governo?", opcoes: ["Dutra", "Vargas (2º governo)", "JK", "Jânio Quadros"], correta: 1, explicacao: "A Petrobras foi criada em 1953 no segundo governo de Vargas, com a campanha 'O Petróleo é Nosso'." }
        ]
      },
      {
        titulo: "Ditadura Militar (1964-1985)",
        explicacao: "Golpe que depôs João Goulart. Marcado por censura, AI-5, tortura, perseguição política, mas também pelo 'milagre econômico'. A abertura foi lenta e gradual, culminando no Diretas Já e na eleição indireta de Tancredo Neves.",
        questoes: [
          { enunciado: "O AI-5 foi decretado em:", opcoes: ["1964", "1966", "1968", "1972"], correta: 2, explicacao: "Dezembro de 1968, intensificando a repressão." },
          { enunciado: "O 'Diretas Já' reivindicava:", opcoes: ["Volta da monarquia", "Eleições diretas para presidente", "Fim do voto feminino", "Novos estados"], correta: 1, explicacao: "Movimento popular pela eleição direta do presidente." },
          { enunciado: "O 'milagre econômico' ocorreu no governo:", opcoes: ["Costa e Silva", "Médici", "Geisel", "Figueiredo"], correta: 1, explicacao: "1969-1973, governo Médici: alto crescimento mas mais desigualdade." }
        ]
      },
      {
        titulo: "Iluminismo",
        explicacao: "Movimento intelectual do séc. XVIII que valorizava a razão, a liberdade individual, a igualdade perante a lei e a separação dos poderes. Pensadores como Voltaire, Rousseau, Montesquieu e Locke influenciaram revoluções e constituições modernas.",
        questoes: [
          { enunciado: "A separação dos poderes (Executivo, Legislativo, Judiciário) foi proposta por:", opcoes: ["Rousseau", "Voltaire", "Montesquieu", "Locke"], correta: 2, explicacao: "Montesquieu propôs a divisão tripartite dos poderes em 'O Espírito das Leis'." },
          { enunciado: "O Iluminismo defendia que a base do conhecimento deveria ser:", opcoes: ["A fé religiosa", "A tradição", "A razão e a ciência", "A autoridade do rei"], correta: 2, explicacao: "O Iluminismo propunha a razão como base do conhecimento, combatendo dogmas e superstições." },
          { enunciado: "Rousseau é conhecido por defender:", opcoes: ["A monarquia absoluta", "O contrato social e a soberania popular", "O mercantilismo", "A escravidão"], correta: 1, explicacao: "Rousseau defendia que o poder emana do povo (soberania popular) através de um contrato social." }
        ]
      },
      {
        titulo: "Revolução Francesa",
        explicacao: "A Revolução Francesa (1789) derrubou o Antigo Regime (monarquia absolutista). Inspirada pelo Iluminismo, teve como lema 'Liberdade, Igualdade, Fraternidade'. Passou por fases: Assembleia Nacional, Convenção, Terror e Diretório.",
        questoes: [
          { enunciado: "A queda da Bastilha ocorreu em:", opcoes: ["1776", "1789", "1799", "1815"], correta: 1, explicacao: "14 de julho de 1789, marco inicial da Revolução Francesa." },
          { enunciado: "O lema da Revolução Francesa era:", opcoes: ["Ordem e Progresso", "Liberdade, Igualdade, Fraternidade", "Deus, Pátria e Família", "Pão, Terra e Liberdade"], correta: 1, explicacao: "O lema sintetizava os ideais iluministas que motivaram a revolução." },
          { enunciado: "O período do Terror foi liderado por:", opcoes: ["Napoleão", "Luís XVI", "Robespierre", "Voltaire"], correta: 2, explicacao: "Robespierre liderou o período do Terror (1793-1794), com execuções em massa na guilhotina." }
        ]
      },
      {
        titulo: "Revolução Industrial",
        explicacao: "Transformou a produção artesanal em fabril a partir do séc. XVIII na Inglaterra. Trouxe máquina a vapor, urbanização acelerada, classe operária, novas relações de trabalho e profundas mudanças sociais e ambientais.",
        questoes: [
          { enunciado: "A Revolução Industrial começou na:", opcoes: ["França", "Alemanha", "Inglaterra", "EUA"], correta: 2, explicacao: "Inglaterra foi pioneira pelo capital acumulado e matérias-primas disponíveis." },
          { enunciado: "A máquina a vapor foi aperfeiçoada por:", opcoes: ["Edison", "James Watt", "Ford", "Marx"], correta: 1, explicacao: "James Watt aperfeiçoou a máquina a vapor na década de 1760." },
          { enunciado: "Consequência social da Revolução Industrial:", opcoes: ["Menos urbanização", "Surgimento da classe operária", "Fim do comércio", "Volta à agricultura"], correta: 1, explicacao: "Surgimento do proletariado trabalhando em fábricas com condições precárias." }
        ]
      },
      {
        titulo: "Guerras Mundiais",
        explicacao: "A 1ª Guerra (1914-1918) envolveu imperialismo e nacionalismo. A 2ª Guerra (1939-1945) opôs Aliados (EUA, URSS, UK) ao Eixo (Alemanha, Itália, Japão), resultou no Holocausto e criação da ONU. Ambas redesenharam o mapa geopolítico.",
        questoes: [
          { enunciado: "O estopim da 2ª Guerra foi:", opcoes: ["Ataque a Pearl Harbor", "Invasão da Polônia pela Alemanha", "Queda da Bolsa de NY", "Revolução Russa"], correta: 1, explicacao: "A invasão da Polônia em setembro de 1939 iniciou a guerra." },
          { enunciado: "O Holocausto foi:", opcoes: ["Crise econômica", "Genocídio de milhões pelo nazismo", "Revolução popular", "Tratado de paz"], correta: 1, explicacao: "Extermínio sistemático de 6 milhões de judeus e outros grupos." },
          { enunciado: "A ONU foi criada para:", opcoes: ["Dominar o comércio", "Promover paz e cooperação internacional", "Punir o Eixo", "Criar moeda única"], correta: 1, explicacao: "Fundada em 1945 para promover paz e cooperação entre nações." }
        ]
      },
      {
        titulo: "Guerra Fria",
        explicacao: "Disputa geopolítica entre EUA (capitalismo) e URSS (socialismo) de 1947 a 1991, sem confronto militar direto entre ambos. Envolveu corrida armamentista, espacial, guerras por procuração (Coreia, Vietnã), Muro de Berlim e influência sobre o Terceiro Mundo.",
        questoes: [
          { enunciado: "A Guerra Fria foi entre:", opcoes: ["EUA e China", "EUA e URSS", "Inglaterra e França", "Japão e Alemanha"], correta: 1, explicacao: "Disputa entre capitalismo (EUA) e socialismo (URSS)." },
          { enunciado: "O Muro de Berlim caiu em:", opcoes: ["1945", "1961", "1989", "1991"], correta: 2, explicacao: "A queda do Muro de Berlim em 1989 simbolizou o fim da Guerra Fria." },
          { enunciado: "A corrida espacial foi vencida pelos EUA com:", opcoes: ["O satélite Sputnik", "A chegada do homem à Lua em 1969", "A estação Mir", "O telescópio Hubble"], correta: 1, explicacao: "Em 1969, a Apollo 11 levou Neil Armstrong à Lua, marco da vitória americana na corrida espacial." }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════
  // GEOGRAFIA
  // ═══════════════════════════════════════════
  {
    id: "geografia",
    titulo: "Geografia",
    icon: "Globe",
    cor: "bg-cyan-500",
    topicos: [
      {
        titulo: "Meio Ambiente e Sustentabilidade",
        explicacao: "Temas ambientais frequentes no ENEM: desmatamento, aquecimento global, efeito estufa, camada de ozônio, matriz energética, gestão de resíduos, poluição das águas e desenvolvimento sustentável.",
        questoes: [
          { enunciado: "O efeito estufa é:", opcoes: ["Exclusivamente prejudicial", "Natural, mas intensificado pela ação humana", "Causado só pela indústria", "Sem relação com CO₂"], correta: 1, explicacao: "Natural e essencial, mas intensificado pela emissão de CO₂ humana." },
          { enunciado: "Principal causa do desmatamento amazônico:", opcoes: ["Queimadas naturais", "Expansão agropecuária", "Mineração", "Urbanização"], correta: 1, explicacao: "Pecuária e soja são os maiores vetores de desmatamento." },
          { enunciado: "Desenvolvimento sustentável é:", opcoes: ["Não usar recursos", "Atender necessidades atuais sem comprometer futuras", "Priorizar economia", "Voltar à vida sem tecnologia"], correta: 1, explicacao: "Conceito ONU (1987): equilíbrio entre progresso e preservação." }
        ]
      },
      {
        titulo: "Urbanização",
        explicacao: "Urbanização brasileira: rápida e desordenada a partir dos anos 1950. Gerou favelização, falta de infraestrutura, mobilidade precária, segregação socioespacial, gentrificação e problemas ambientais urbanos.",
        questoes: [
          { enunciado: "O êxodo rural se intensificou a partir de:", opcoes: ["Década de 1920", "Década de 1950", "Década de 1980", "Década de 2000"], correta: 1, explicacao: "Anos 1950: industrialização atraiu milhões do campo." },
          { enunciado: "Segregação socioespacial é:", opcoes: ["Igualdade de acesso", "Separação de ricos e pobres em áreas distintas", "Distribuição uniforme", "Ausência de favelas"], correta: 1, explicacao: "Concentra riqueza e pobreza em regiões diferentes da cidade." },
          { enunciado: "Conurbação é:", opcoes: ["Crescimento vertical", "Junção de áreas urbanas de cidades vizinhas", "Construção de parques", "Migração sazonal"], correta: 1, explicacao: "Conurbação ocorre quando cidades vizinhas crescem e se fundem numa mancha urbana contínua." }
        ]
      },
      {
        titulo: "Globalização",
        explicacao: "Integração econômica, cultural e política entre países, intensificada pela revolução tecnológica nos anos 1990. Gera interdependência, mas também desigualdades, perda de identidades culturais e precarização do trabalho.",
        questoes: [
          { enunciado: "A globalização se intensificou a partir dos:", opcoes: ["Século XVIII", "Início do séc. XX", "Anos 1990", "Séc. XXI apenas"], correta: 2, explicacao: "Internet, queda do Muro de Berlim e liberalização comercial aceleraram o processo nos anos 1990." },
          { enunciado: "Consequência negativa da globalização:", opcoes: ["Mais acesso à informação", "Aumento da desigualdade entre países", "Facilidade de comunicação", "Diversidade cultural"], correta: 1, explicacao: "Países ricos concentram mais benefícios tecnológicos e econômicos." },
          { enunciado: "Multinacionais são empresas que:", opcoes: ["Atuam só em seu país", "Operam em vários países", "São estatais", "São pequenos negócios"], correta: 1, explicacao: "Operam globalmente buscando mercados e mão de obra barata." }
        ]
      },
      {
        titulo: "Geopolítica e Conflitos",
        explicacao: "Estuda relações de poder entre Estados. Temas cobrados: Guerra Fria, conflitos no Oriente Médio, terrorismo, disputas territoriais, BRICS, G7, organizações internacionais (ONU, OTAN), refugiados e migrações forçadas.",
        questoes: [
          { enunciado: "O conflito israelense-palestino envolve:", opcoes: ["Disputas comerciais", "Questões territoriais, religiosas e históricas", "Recursos minerais apenas", "Disputas esportivas"], correta: 1, explicacao: "Disputa pela região da Palestina com dimensões territoriais, religiosas e históricas." },
          { enunciado: "Os BRICS são:", opcoes: ["Países europeus", "Economias emergentes (Brasil, Rússia, Índia, China, África do Sul...)", "Organizações militares", "Empresas de tecnologia"], correta: 1, explicacao: "Grupo de economias emergentes buscando maior representatividade global." },
          { enunciado: "A crise dos refugiados está ligada principalmente a:", opcoes: ["Turismo", "Guerras, perseguições e desastres", "Estudos no exterior", "Intercâmbio cultural"], correta: 1, explicacao: "Refugiados fogem de conflitos armados, perseguições políticas/religiosas e desastres humanitários." }
        ]
      },
      {
        titulo: "Clima e Vegetação do Brasil",
        explicacao: "O Brasil possui 6 biomas: Amazônia (maior floresta tropical), Cerrado, Mata Atlântica, Caatinga, Pampa e Pantanal. Os climas vão do equatorial ao subtropical. Cada bioma tem vegetação adaptada às condições climáticas locais.",
        questoes: [
          { enunciado: "O maior bioma brasileiro é:", opcoes: ["Cerrado", "Mata Atlântica", "Amazônia", "Pantanal"], correta: 2, explicacao: "A Amazônia é o maior bioma, ocupando cerca de 49% do território brasileiro." },
          { enunciado: "A Caatinga é encontrada no:", opcoes: ["Sul do Brasil", "Semiárido nordestino", "Centro-Oeste", "Litoral sudeste"], correta: 1, explicacao: "A Caatinga é exclusivamente brasileira e ocupa o semiárido nordestino, com vegetação adaptada à seca." },
          { enunciado: "O bioma mais devastado do Brasil é:", opcoes: ["Amazônia", "Cerrado", "Mata Atlântica", "Pantanal"], correta: 2, explicacao: "A Mata Atlântica já perdeu mais de 90% de sua cobertura original devido à urbanização e agricultura." }
        ]
      },
      {
        titulo: "Recursos Hídricos e Energia",
        explicacao: "O Brasil possui 12% da água doce do planeta, mas com distribuição desigual. A matriz energética é majoritariamente renovável (hidrelétricas). Temas como crise hídrica, transposição do Rio São Francisco e energias alternativas são cobrados.",
        questoes: [
          { enunciado: "A principal fonte de energia elétrica no Brasil é:", opcoes: ["Termoelétrica", "Eólica", "Hidrelétrica", "Nuclear"], correta: 2, explicacao: "Mais de 60% da energia elétrica brasileira vem de hidrelétricas." },
          { enunciado: "A transposição do Rio São Francisco visa:", opcoes: ["Gerar energia", "Levar água ao semiárido nordestino", "Criar um canal navegável", "Irrigar o Sul do país"], correta: 1, explicacao: "O projeto leva água do Rio São Francisco para regiões secas do Nordeste, combatendo a escassez hídrica." },
          { enunciado: "A energia eólica utiliza:", opcoes: ["O calor do sol", "A força dos ventos", "A força das marés", "A queima de combustível"], correta: 1, explicacao: "Energia eólica transforma a energia cinética dos ventos em eletricidade por meio de aerogeradores." }
        ]
      },
      {
        titulo: "Agricultura e Questão Agrária",
        explicacao: "O agronegócio é fundamental para a economia brasileira (soja, café, carne, cana). A questão agrária envolve concentração de terras, reforma agrária, MST, agricultura familiar vs. agronegócio, transgênicos e impactos ambientais da monocultura.",
        questoes: [
          { enunciado: "O Brasil é um dos maiores produtores mundiais de:", opcoes: ["Trigo", "Arroz", "Soja", "Batata"], correta: 2, explicacao: "O Brasil é o maior produtor mundial de soja, fundamental para a balança comercial." },
          { enunciado: "A concentração fundiária no Brasil significa:", opcoes: ["Muitas fazendas pequenas", "Poucas propriedades controlam a maior parte das terras", "Distribuição igualitária", "Ausência de latifúndios"], correta: 1, explicacao: "Historicamente, poucos proprietários detêm a maioria das terras produtivas no Brasil." },
          { enunciado: "A agricultura familiar é responsável por:", opcoes: ["Apenas exportação", "Grande parte dos alimentos consumidos no Brasil", "Apenas pecuária", "Nada significativo"], correta: 1, explicacao: "A agricultura familiar produz cerca de 70% dos alimentos consumidos no país." }
        ]
      },
      {
        titulo: "Migração e Demografia",
        explicacao: "O Brasil passou por transição demográfica: queda da natalidade e mortalidade, envelhecimento da população e mudança na pirâmide etária. Migrações internas (Nordeste→Sudeste) e questões como êxodo rural e migração pendular são cobradas.",
        questoes: [
          { enunciado: "A transição demográfica no Brasil é marcada por:", opcoes: ["Aumento da natalidade", "Queda da natalidade e mortalidade", "Aumento da mortalidade", "Estabilidade total"], correta: 1, explicacao: "O Brasil vive uma transição com queda nas taxas de natalidade e mortalidade, gerando envelhecimento populacional." },
          { enunciado: "Migração pendular é:", opcoes: ["Mudar de país", "Deslocamento diário casa-trabalho entre cidades", "Mudar de estado definitivamente", "Migração sazonal"], correta: 1, explicacao: "É o deslocamento diário entre cidades, comum em regiões metropolitanas (morar em uma, trabalhar em outra)." },
          { enunciado: "O principal fluxo migratório interno no Brasil no séc. XX foi:", opcoes: ["Sul → Norte", "Nordeste → Sudeste", "Centro-Oeste → Norte", "Sudeste → Sul"], correta: 1, explicacao: "Milhões de nordestinos migraram para o Sudeste em busca de emprego nas indústrias e cidades." }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════
  // BIOLOGIA
  // ═══════════════════════════════════════════
  {
    id: "biologia",
    titulo: "Biologia",
    icon: "Leaf",
    cor: "bg-green-600",
    topicos: [
      {
        titulo: "Ecologia",
        explicacao: "Estudo das relações entre seres vivos e ambiente. Conceitos: cadeia e teia alimentar, níveis tróficos, ciclos biogeoquímicos (carbono, nitrogênio, água), biomas, relações ecológicas (mutualismo, parasitismo, predação) e impactos ambientais.",
        questoes: [
          { enunciado: "Decompositores fazem:", opcoes: ["Fotossíntese", "Caçam animais", "Reciclam nutrientes decompondo matéria orgânica", "Consomem produtores"], correta: 2, explicacao: "Fungos e bactérias degradam matéria orgânica, devolvendo nutrientes ao ambiente." },
          { enunciado: "Biomagnificação é:", opcoes: ["Mais biodiversidade", "Acúmulo de tóxicos na cadeia alimentar", "Crescimento de organismos", "Fotossíntese em larga escala"], correta: 1, explicacao: "Substâncias tóxicas se acumulam em concentrações crescentes nos níveis tróficos superiores." },
          { enunciado: "O Cerrado é caracterizado por:", opcoes: ["Vegetação densa e úmida", "Árvores retorcidas e duas estações definidas", "Baixas temperaturas", "Solo extremamente fértil"], correta: 1, explicacao: "Árvores de troncos retorcidos, raízes profundas, estação seca e chuvosa." }
        ]
      },
      {
        titulo: "Genética",
        explicacao: "Estuda hereditariedade e variação. Genes, alelos, genótipo, fenótipo, dominância e recessividade. Leis de Mendel, heredogramas, herança ligada ao sexo, grupos sanguíneos (ABO e Rh) e biotecnologia são os temas mais cobrados.",
        questoes: [
          { enunciado: "Pais Aa × Aa: probabilidade de filho aa:", opcoes: ["0%", "25%", "50%", "75%"], correta: 1, explicacao: "AA(25%), Aa(50%), aa(25%) → 25%." },
          { enunciado: "DNA é formado por:", opcoes: ["Aminoácidos", "Nucleotídeos", "Lipídeos", "Carboidratos"], correta: 1, explicacao: "Polímero de nucleotídeos (base + desoxirribose + fosfato)." },
          { enunciado: "Sangue tipo O pode doar para:", opcoes: ["Apenas tipo O", "Apenas tipo A", "Todos os tipos (doador universal)", "Apenas tipo AB"], correta: 2, explicacao: "Tipo O é doador universal pois não possui antígenos A nem B nas hemácias." }
        ]
      },
      {
        titulo: "Fisiologia Humana",
        explicacao: "Estudo dos sistemas do corpo: circulatório (coração, sangue), respiratório (pulmões), digestório (enzimas), nervoso (neurônios, sinapses), endócrino (hormônios), excretor (rins) e imunológico (anticorpos, vacinas).",
        questoes: [
          { enunciado: "Hemácias transportam:", opcoes: ["Nutrientes", "Oxigênio", "Hormônios", "Anticorpos"], correta: 1, explicacao: "Glóbulos vermelhos transportam O₂ através da hemoglobina." },
          { enunciado: "A insulina é produzida pelo:", opcoes: ["Fígado", "Pâncreas", "Estômago", "Rim"], correta: 1, explicacao: "Células beta do pâncreas produzem insulina, que regula a glicose no sangue." },
          { enunciado: "Vacinas funcionam por:", opcoes: ["Matando vírus diretamente", "Estimulando o sistema imunológico a produzir anticorpos", "Fornecendo antibióticos", "Impedindo a alimentação do vírus"], correta: 1, explicacao: "Vacinas introduzem antígenos atenuados/inativos para que o corpo produza anticorpos e células de memória." }
        ]
      },
      {
        titulo: "Evolução",
        explicacao: "Darwin propôs a seleção natural: organismos mais adaptados sobrevivem e se reproduzem mais. Evidências: fósseis, anatomia comparada, embriologia. Lamarck propôs uso/desuso (refutado). Especiação ocorre por isolamento geográfico ou reprodutivo.",
        questoes: [
          { enunciado: "Seleção natural foi proposta por:", opcoes: ["Lamarck", "Mendel", "Darwin", "Pasteur"], correta: 2, explicacao: "Charles Darwin, em 'A Origem das Espécies' (1859)." },
          { enunciado: "Para Lamarck, girafas têm pescoços longos porque:", opcoes: ["Mutação", "Uso contínuo esticou e foi herdado", "Seleção natural", "Alimentação de arbustos baixos"], correta: 1, explicacao: "Lei do uso/desuso e herança de caracteres adquiridos (refutadas pela genética)." },
          { enunciado: "Especiação é:", opcoes: ["Extinção de espécie", "Formação de novas espécies", "Clonagem", "Migração"], correta: 1, explicacao: "Processo evolutivo de surgimento de novas espécies por isolamento." }
        ]
      },
      {
        titulo: "Citologia (Célula)",
        explicacao: "A célula é a unidade fundamental da vida. Tipos: procariontes (sem núcleo definido, bactérias) e eucariontes (com núcleo, animais/vegetais). Organelas importantes: mitocôndria (respiração celular), ribossomos (síntese de proteínas), cloroplasto (fotossíntese).",
        questoes: [
          { enunciado: "A mitocôndria é responsável por:", opcoes: ["Fotossíntese", "Respiração celular (produção de ATP)", "Síntese de proteínas", "Digestão celular"], correta: 1, explicacao: "A mitocôndria realiza a respiração celular aeróbia, produzindo ATP (energia)." },
          { enunciado: "Células vegetais se diferenciam das animais por terem:", opcoes: ["Núcleo", "Parede celular, cloroplasto e vacúolo central", "Mitocôndrias", "Ribossomos"], correta: 1, explicacao: "Células vegetais possuem parede celular de celulose, cloroplastos e um grande vacúolo central." },
          { enunciado: "Bactérias são organismos:", opcoes: ["Eucariontes", "Procariontes", "Sem células", "Pluricelulares"], correta: 1, explicacao: "Bactérias são procariontes: não possuem núcleo organizado por membrana." }
        ]
      },
      {
        titulo: "Biotecnologia e Saúde",
        explicacao: "Aplicações da biologia na tecnologia: transgênicos (organismos com DNA modificado), clonagem, terapia gênica, células-tronco, projeto genoma. Questões éticas sobre manipulação genética e seus impactos na saúde e no meio ambiente.",
        questoes: [
          { enunciado: "Organismos transgênicos são:", opcoes: ["Clones", "Organismos com DNA de outra espécie inserido", "Animais domesticados", "Plantas orgânicas"], correta: 1, explicacao: "Transgênicos recebem genes de outras espécies para adquirir características desejadas (ex: soja resistente a herbicida)." },
          { enunciado: "Células-tronco são importantes porque:", opcoes: ["Produzem anticorpos", "Podem se diferenciar em diversos tipos celulares", "São imunes a doenças", "Produzem energia"], correta: 1, explicacao: "Células-tronco têm capacidade de se transformar em diferentes tipos de células, com potencial para regenerar tecidos." },
          { enunciado: "Antibióticos combatem:", opcoes: ["Vírus", "Bactérias", "Fungos apenas", "Parasitas apenas"], correta: 1, explicacao: "Antibióticos são eficazes contra bactérias. Contra vírus, usamos antivirais ou vacinas." }
        ]
      },
      {
        titulo: "Microbiologia e Doenças",
        explicacao: "Estudo de microrganismos: bactérias, vírus, fungos e protozoários. No ENEM, são cobradas doenças infecciosas, formas de transmissão, prevenção (vacinas, saneamento) e saúde pública (epidemias, pandemias, SUS).",
        questoes: [
          { enunciado: "Dengue, Zika e Chikungunya são transmitidas pelo:", opcoes: ["Ar", "Água contaminada", "Mosquito Aedes aegypti", "Contato físico"], correta: 2, explicacao: "O Aedes aegypti é o vetor dessas três arboviroses, que são combatidas eliminando criadouros de água parada." },
          { enunciado: "A diferença entre epidemia e pandemia é:", opcoes: ["Não há diferença", "Pandemia atinge vários países/continentes", "Epidemia é mais grave", "Pandemia é mais rara"], correta: 1, explicacao: "Epidemia é surto regional; pandemia é disseminação global (ex: COVID-19)." },
          { enunciado: "O SUS (Sistema Único de Saúde) garante:", opcoes: ["Saúde apenas para quem paga", "Atendimento universal e gratuito", "Saúde apenas para idosos", "Atendimento apenas em emergências"], correta: 1, explicacao: "O SUS garante acesso universal, integral e gratuito à saúde para toda a população brasileira." }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════
  // QUÍMICA
  // ═══════════════════════════════════════════
  {
    id: "quimica",
    titulo: "Química",
    icon: "FlaskConical",
    cor: "bg-purple-500",
    topicos: [
      {
        titulo: "Estequiometria",
        explicacao: "Cálculo de quantidades em reações químicas usando balanceamento e relações molares. Essencial: massa molar, mol (6,02×10²³), proporções estequiométricas, reagente limitante e rendimento de reação.",
        questoes: [
          { enunciado: "2H₂ + O₂ → 2H₂O. 4 mols de H₂ produzem:", opcoes: ["2 mols H₂O", "4 mols H₂O", "6 mols H₂O", "8 mols H₂O"], correta: 1, explicacao: "Proporção 2:2 → 4 mols H₂ = 4 mols H₂O." },
          { enunciado: "Massa molar da H₂O:", opcoes: ["16 g/mol", "18 g/mol", "20 g/mol", "32 g/mol"], correta: 1, explicacao: "2×1 + 16 = 18 g/mol." },
          { enunciado: "Um mol contém:", opcoes: ["6,02×10²⁰", "6,02×10²³", "3,01×10²³", "1×10²⁴"], correta: 1, explicacao: "Número de Avogadro = 6,02×10²³ entidades." }
        ]
      },
      {
        titulo: "Reações Químicas",
        explicacao: "Transformações que alteram composição das substâncias. Tipos: síntese, decomposição, simples troca, dupla troca. Sinais: mudança de cor, gás, precipitado, variação de temperatura. Balanceamento segue a Lei de Lavoisier.",
        questoes: [
          { enunciado: "A + B → AB é reação de:", opcoes: ["Decomposição", "Síntese", "Simples troca", "Dupla troca"], correta: 1, explicacao: "Duas substâncias formam uma: síntese/adição." },
          { enunciado: "Balancear equação garante:", opcoes: ["Mais velocidade", "Conservação da massa (Lavoisier)", "Mudar produtos", "Alterar estados"], correta: 1, explicacao: "Átomos iguais dos dois lados (nada se cria, nada se perde)." },
          { enunciado: "Reação exotérmica:", opcoes: ["Absorve calor", "Libera calor", "Sem troca de calor", "Só em frio"], correta: 1, explicacao: "Libera energia como calor (ex: combustão)." }
        ]
      },
      {
        titulo: "Tabela Periódica",
        explicacao: "Organiza elementos por número atômico crescente. Mesmo grupo = mesmas propriedades. Propriedades periódicas: eletronegatividade (F é o mais eletronegativo), raio atômico, energia de ionização, afinidade eletrônica.",
        questoes: [
          { enunciado: "Elementos do mesmo grupo têm:", opcoes: ["Mesmo nº de prótons", "Mesmo nº de elétrons na valência", "Mesma massa", "Mesmo raio"], correta: 1, explicacao: "Mesmo grupo = mesma quantidade de elétrons na camada de valência." },
          { enunciado: "Gases nobres são:", opcoes: ["Muito reativos", "Estáveis (camada completa)", "Todos metais", "Têm 1 elétron"], correta: 1, explicacao: "Camada de valência completa (8 elétrons, He com 2) = alta estabilidade." },
          { enunciado: "Eletronegatividade aumenta:", opcoes: ["↓ e →", "← e ↓", "↑ e →", "↓ e ←"], correta: 2, explicacao: "De baixo para cima e da esquerda para direita (exceto gases nobres)." }
        ]
      },
      {
        titulo: "Ligações Químicas",
        explicacao: "Unem átomos: iônica (metal+não metal, transferência de e⁻), covalente (não metal+não metal, compartilhamento de e⁻), metálica (entre metais, e⁻ livres). Determinam propriedades das substâncias.",
        questoes: [
          { enunciado: "NaCl tem ligação:", opcoes: ["Covalente", "Iônica", "Metálica", "Van der Waals"], correta: 1, explicacao: "Na (metal) transfere e⁻ para Cl (não metal): ligação iônica." },
          { enunciado: "H₂O tem ligações:", opcoes: ["Iônicas", "Covalentes", "Metálicas", "Nenhuma"], correta: 1, explicacao: "H e O são não metais → compartilham elétrons (covalente)." },
          { enunciado: "Metais conduzem eletricidade por causa da ligação:", opcoes: ["Iônica", "Covalente", "Metálica (elétrons livres)", "Van der Waals"], correta: 2, explicacao: "Na ligação metálica, elétrons livres ('mar de elétrons') permitem condução." }
        ]
      },
      {
        titulo: "Termoquímica",
        explicacao: "Estuda o calor envolvido em reações químicas. Reações exotérmicas liberam calor (ΔH < 0), endotérmicas absorvem (ΔH > 0). Lei de Hess: a variação de entalpia depende apenas dos estados inicial e final, não do caminho.",
        questoes: [
          { enunciado: "Se ΔH é negativo, a reação é:", opcoes: ["Endotérmica", "Exotérmica", "Neutra", "Impossível"], correta: 1, explicacao: "ΔH < 0 significa que o sistema liberou energia: reação exotérmica." },
          { enunciado: "A Lei de Hess afirma que:", opcoes: ["Toda reação é reversível", "A entalpia depende apenas dos estados inicial e final", "Reações são sempre exotérmicas", "O calor é constante"], correta: 1, explicacao: "A variação de entalpia independe do caminho, dependendo apenas de reagentes e produtos." },
          { enunciado: "A combustão é uma reação:", opcoes: ["Endotérmica", "Exotérmica", "Sem troca de calor", "De decomposição"], correta: 1, explicacao: "Combustão libera grande quantidade de calor (exotérmica), como queima de gasolina." }
        ]
      },
      {
        titulo: "Soluções e Concentração",
        explicacao: "Soluções são misturas homogêneas de soluto (dissolve) em solvente (dissolve). A concentração pode ser expressa em g/L, mol/L (molaridade), % massa ou ppm. Diluição e mistura de soluções são temas frequentes.",
        questoes: [
          { enunciado: "Uma solução com 20g de sal em 500mL de água tem concentração de:", opcoes: ["20 g/L", "40 g/L", "10 g/L", "4 g/L"], correta: 1, explicacao: "C = m/V = 20g / 0,5L = 40 g/L." },
          { enunciado: "Ao diluir uma solução, o que permanece constante?", opcoes: ["A concentração", "O volume", "A quantidade de soluto", "A temperatura"], correta: 2, explicacao: "Ao diluir (adicionar solvente), a massa de soluto não muda, apenas a concentração diminui." },
          { enunciado: "Solução saturada é aquela que:", opcoes: ["Não tem soluto", "Atingiu o máximo de soluto dissolvido", "Está fervendo", "É pura"], correta: 1, explicacao: "Solução saturada contém a quantidade máxima de soluto que pode ser dissolvida naquela temperatura." }
        ]
      },
      {
        titulo: "Ácidos, Bases e pH",
        explicacao: "Ácidos liberam H⁺ em água (pH < 7), bases liberam OH⁻ (pH > 7). O pH mede a acidez/basicidade de 0 a 14. Indicadores como fenolftaleína mudam de cor conforme o pH. Reação ácido+base = neutralização (sal+água).",
        questoes: [
          { enunciado: "O pH do suco de limão (ácido) é:", opcoes: ["pH 2-3", "pH 7", "pH 10", "pH 14"], correta: 0, explicacao: "Suco de limão é ácido: pH entre 2 e 3." },
          { enunciado: "Ácido + Base produz:", opcoes: ["Mais ácido", "Sal + Água (neutralização)", "Gás apenas", "Nada"], correta: 1, explicacao: "Reação de neutralização: HCl + NaOH → NaCl + H₂O." },
          { enunciado: "pH 7 indica solução:", opcoes: ["Ácida", "Básica", "Neutra", "Saturada"], correta: 2, explicacao: "pH = 7 é neutro (ex: água pura a 25°C)." }
        ]
      },
      {
        titulo: "Química Orgânica",
        explicacao: "Estuda compostos de carbono. Funções orgânicas: hidrocarbonetos (alcanos, alcenos), álcoois, ácidos carboxílicos, ésteres, aminas, amidas, aldeídos e cetonas. No ENEM, reconhecer grupos funcionais e nomear compostos simples é cobrado.",
        questoes: [
          { enunciado: "O etanol (álcool) tem o grupo funcional:", opcoes: ["Carboxila (-COOH)", "Hidroxila (-OH)", "Amina (-NH₂)", "Carbonila (C=O)"], correta: 1, explicacao: "Álcoois possuem o grupo hidroxila (-OH) ligado a carbono." },
          { enunciado: "Hidrocarbonetos são compostos formados por:", opcoes: ["C e O", "C e H apenas", "C, H e O", "C, H e N"], correta: 1, explicacao: "Hidrocarbonetos contêm apenas carbono e hidrogênio (ex: metano, etano, etileno)." },
          { enunciado: "O petróleo é uma mistura de:", opcoes: ["Sais minerais", "Hidrocarbonetos", "Ácidos orgânicos", "Gases nobres"], correta: 1, explicacao: "O petróleo é formado por uma mistura complexa de hidrocarbonetos de diferentes tamanhos." }
        ]
      },
      {
        titulo: "Eletroquímica",
        explicacao: "Estuda relações entre reações químicas e corrente elétrica. Pilhas/baterias convertem energia química em elétrica (espontâneas). Eletrólise usa energia elétrica para forçar reações (não espontâneas). Corrosão de metais é um tema prático.",
        questoes: [
          { enunciado: "Em uma pilha, o ânodo é o eletrodo que:", opcoes: ["Recebe elétrons", "Perde elétrons (oxidação)", "Não participa", "É sempre de cobre"], correta: 1, explicacao: "No ânodo ocorre oxidação (perda de elétrons), liberando elétrons para o circuito." },
          { enunciado: "Eletrólise é o processo de:", opcoes: ["Gerar energia a partir de reações", "Usar corrente elétrica para forçar uma reação", "Queimar combustível", "Diluir soluções"], correta: 1, explicacao: "Eletrólise usa energia elétrica para promover reações que não ocorreriam espontaneamente." },
          { enunciado: "A ferrugem (corrosão do ferro) é um processo de:", opcoes: ["Redução", "Oxidação", "Neutralização", "Sublimação"], correta: 1, explicacao: "O ferro sofre oxidação em contato com oxigênio e umidade, formando óxido de ferro (ferrugem)." }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════
  // FÍSICA
  // ═══════════════════════════════════════════
  {
    id: "fisica",
    titulo: "Física",
    icon: "Zap",
    cor: "bg-red-500",
    topicos: [
      {
        titulo: "Cinemática",
        explicacao: "Estudo do movimento sem considerar causas. MRU: velocidade constante (S=S₀+vt). MRUV: aceleração constante (v=v₀+at, S=S₀+v₀t+at²/2). Interpretar gráficos de posição, velocidade e aceleração é essencial.",
        questoes: [
          { enunciado: "No MRU, a velocidade é:", opcoes: ["Variável", "Constante", "Sempre zero", "Crescente"], correta: 1, explicacao: "MRU: velocidade constante, aceleração zero." },
          { enunciado: "100 km em 2h = velocidade:", opcoes: ["200 km/h", "50 km/h", "100 km/h", "25 km/h"], correta: 1, explicacao: "v = d/t = 100/2 = 50 km/h." },
          { enunciado: "No MRUV permanece constante:", opcoes: ["Velocidade", "Posição", "Aceleração", "Deslocamento"], correta: 2, explicacao: "No MRUV a aceleração é constante." }
        ]
      },
      {
        titulo: "Leis de Newton",
        explicacao: "1ª Lei (Inércia): corpo em repouso ou MRU permanece assim sem força resultante. 2ª Lei: F=ma. 3ª Lei (Ação-Reação): toda força tem uma reação igual e oposta. Base de toda a mecânica clássica.",
        questoes: [
          { enunciado: "Corpo em repouso permanece em repouso se:", opcoes: ["Sempre se move", "Resultante das forças for zero", "Tiver massa", "Estiver no vácuo"], correta: 1, explicacao: "1ª Lei de Newton (Inércia)." },
          { enunciado: "10N em massa de 2kg = aceleração:", opcoes: ["2 m/s²", "5 m/s²", "10 m/s²", "20 m/s²"], correta: 1, explicacao: "a = F/m = 10/2 = 5 m/s²." },
          { enunciado: "Ao empurrar a parede, ela:", opcoes: ["Não faz nada", "Empurra você com mesma força oposta", "Move-se", "Absorve a força"], correta: 1, explicacao: "3ª Lei: ação e reação são iguais e opostas." }
        ]
      },
      {
        titulo: "Energia e Trabalho",
        explicacao: "Trabalho (W=F×d×cosθ) é a energia transferida por uma força. Energia cinética (Ec=mv²/2) e potencial gravitacional (Ep=mgh). O Princípio da Conservação de Energia diz que energia não se cria nem se destrói, apenas se transforma.",
        questoes: [
          { enunciado: "A energia cinética depende de:", opcoes: ["Massa apenas", "Velocidade apenas", "Massa e velocidade", "Altura"], correta: 2, explicacao: "Ec = mv²/2: depende da massa e do quadrado da velocidade." },
          { enunciado: "Um objeto de 2kg a 10m de altura (g=10). Sua Ep é:", opcoes: ["20 J", "100 J", "200 J", "400 J"], correta: 2, explicacao: "Ep = mgh = 2×10×10 = 200 J." },
          { enunciado: "Na queda livre, a energia potencial se converte em:", opcoes: ["Energia nuclear", "Energia cinética", "Energia química", "Nada"], correta: 1, explicacao: "Ep se transforma em Ec conforme o objeto cai, mantendo a energia total constante." }
        ]
      },
      {
        titulo: "Eletricidade",
        explicacao: "Corrente elétrica, resistência, Lei de Ohm (V=Ri), potência (P=Vi), circuitos série e paralelo. Cálculo de consumo de energia (kWh) para aparelhos domésticos é muito cobrado no ENEM.",
        questoes: [
          { enunciado: "12V e 4Ω: corrente =", opcoes: ["2A", "3A", "4A", "48A"], correta: 1, explicacao: "i = V/R = 12/4 = 3A." },
          { enunciado: "Em série, a corrente:", opcoes: ["Diferente em cada ponto", "Mesma em todos os pontos", "Zero", "Dobra"], correta: 1, explicacao: "Em série há caminho único: corrente é a mesma." },
          { enunciado: "Potência de um chuveiro 220V e 20A:", opcoes: ["240W", "2200W", "4400W", "11W"], correta: 2, explicacao: "P = V×i = 220×20 = 4400W." }
        ]
      },
      {
        titulo: "Termodinâmica e Calorimetria",
        explicacao: "Calor flui do quente para o frio. Q=mcΔT (calor sensível). Calor latente: mudança de estado sem mudança de temperatura. 1ª Lei: ΔU=Q-W. 2ª Lei: calor não flui espontaneamente do frio ao quente. Máquinas térmicas transformam calor em trabalho.",
        questoes: [
          { enunciado: "Calor flui espontaneamente:", opcoes: ["Do frio ao quente", "Do quente ao frio", "Em qualquer direção", "Só em sólidos"], correta: 1, explicacao: "Naturalmente vai do corpo mais quente ao mais frio." },
          { enunciado: "500g de água de 20°C a 80°C (c=1cal/g°C):", opcoes: ["3000 cal", "30000 cal", "300 cal", "60000 cal"], correta: 1, explicacao: "Q = 500×1×60 = 30000 cal." },
          { enunciado: "Durante a mudança de estado (fusão), a temperatura:", opcoes: ["Aumenta", "Diminui", "Permanece constante", "Oscila"], correta: 2, explicacao: "Na mudança de estado, a temperatura permanece constante (calor latente)." }
        ]
      },
      {
        titulo: "Ondas e Acústica",
        explicacao: "Ondas transportam energia sem transportar matéria. Mecânicas (som, precisa de meio) e eletromagnéticas (luz, não precisa). Propriedades: frequência, comprimento de onda, amplitude, velocidade. v=λ×f. Efeito Doppler altera frequência percebida.",
        questoes: [
          { enunciado: "O som é onda:", opcoes: ["Eletromagnética", "Mecânica", "Transversal", "Sem meio"], correta: 1, explicacao: "Som é onda mecânica longitudinal que precisa de meio." },
          { enunciado: "Se v=340m/s e f=170Hz, o comprimento de onda é:", opcoes: ["0,5m", "1m", "2m", "4m"], correta: 2, explicacao: "λ = v/f = 340/170 = 2m." },
          { enunciado: "O efeito Doppler explica por que:", opcoes: ["O som ecoa", "A sirene de ambulância muda de tom ao passar", "O som viaja no vácuo", "A luz é branca"], correta: 1, explicacao: "O efeito Doppler: a frequência percebida muda quando fonte e observador se movem relativamente." }
        ]
      },
      {
        titulo: "Óptica",
        explicacao: "Estuda a luz: reflexão (espelhos), refração (lentes, mudança de meio), difração. Lei de Snell (n₁senθ₁=n₂senθ₂). Espelhos planos, côncavos e convexos. Lentes convergentes e divergentes. Instrumentos ópticos: lupa, microscópio, telescópio.",
        questoes: [
          { enunciado: "A refração ocorre quando a luz:", opcoes: ["É absorvida", "Muda de meio e altera velocidade", "É refletida", "Desaparece"], correta: 1, explicacao: "Na refração, a luz muda de meio, alterando velocidade e direção." },
          { enunciado: "Velocidade da luz no vácuo é ≈:", opcoes: ["300 km/s", "3.000 km/s", "300.000 km/s", "3.000.000 km/s"], correta: 2, explicacao: "≈ 300.000 km/s (3×10⁸ m/s)." },
          { enunciado: "Espelho côncavo pode:", opcoes: ["Apenas diminuir imagens", "Aumentar ou diminuir dependendo da posição do objeto", "Apenas refletir", "Apenas absorver luz"], correta: 1, explicacao: "Espelhos côncavos formam imagens maiores ou menores dependendo da posição do objeto em relação ao foco." }
        ]
      },
      {
        titulo: "Hidrostática",
        explicacao: "Estuda fluidos em repouso. Pressão = F/A. Pressão hidrostática: P=ρgh. Princípio de Pascal: pressão se transmite integralmente em fluidos. Princípio de Arquimedes: empuxo = peso do fluido deslocado. Explica por que objetos flutuam.",
        questoes: [
          { enunciado: "A pressão hidrostática depende de:", opcoes: ["Volume do recipiente", "Densidade do líquido e profundidade", "Cor do líquido", "Forma do recipiente"], correta: 1, explicacao: "P = ρ×g×h: depende da densidade (ρ), gravidade (g) e profundidade (h)." },
          { enunciado: "Um objeto flutua quando:", opcoes: ["É muito pesado", "Sua densidade é menor que a do fluido", "É grande", "Está no vácuo"], correta: 1, explicacao: "Pelo princípio de Arquimedes, se a densidade do objeto é menor que a do fluido, o empuxo supera o peso." },
          { enunciado: "O princípio de Pascal é aplicado em:", opcoes: ["Termômetros", "Prensas hidráulicas e freios de carro", "Lentes", "Pilhas"], correta: 1, explicacao: "Pascal: pressão aplicada em um ponto se transmite igualmente em todo o fluido (usado em freios e elevadores hidráulicos)." }
        ]
      },
      {
        titulo: "Eletromagnetismo",
        explicacao: "Relação entre eletricidade e magnetismo. Cargas em movimento geram campo magnético. Variação de campo magnético gera corrente elétrica (indução eletromagnética - Faraday). Base de motores elétricos, geradores e transformadores.",
        questoes: [
          { enunciado: "Uma corrente elétrica gera ao seu redor:", opcoes: ["Calor apenas", "Um campo magnético", "Luz visível", "Ondas sonoras"], correta: 1, explicacao: "Cargas em movimento (corrente elétrica) produzem campo magnético ao redor do condutor." },
          { enunciado: "A indução eletromagnética (Faraday) é o princípio de funcionamento de:", opcoes: ["Pilhas", "Geradores e transformadores", "Lâmpadas", "Termômetros"], correta: 1, explicacao: "A variação de fluxo magnético induz corrente elétrica, princípio usado em geradores e transformadores." },
          { enunciado: "Um motor elétrico converte:", opcoes: ["Energia química em calor", "Energia elétrica em mecânica", "Energia nuclear em elétrica", "Energia solar em química"], correta: 1, explicacao: "Motores elétricos usam campos magnéticos para converter energia elétrica em movimento (energia mecânica)." }
        ]
      }
    ]
  },

  // ═══════════════════════════════════════════
  // REDAÇÃO
  // ═══════════════════════════════════════════
  {
    id: "redacao",
    titulo: "Redação",
    icon: "PenTool",
    cor: "bg-rose-500",
    topicos: [
      {
        titulo: "Estrutura da Redação",
        explicacao: "Modelo dissertativo-argumentativo com 5 parágrafos: introdução (tema + tese), desenvolvimento 1 (argumento + repertório), desenvolvimento 2 (argumento + repertório) e conclusão (proposta de intervenção com agente, ação, meio, finalidade e detalhamento).",
        questoes: [
          { enunciado: "A proposta de intervenção deve conter:", opcoes: ["Sugestão genérica", "Agente, ação, modo, finalidade e detalhamento", "Só opinião do autor", "Uma pergunta"], correta: 1, explicacao: "Quem faz, o que faz, como faz, para quê, + detalhamento." },
          { enunciado: "Parágrafos na estrutura ideal:", opcoes: ["3", "4", "5", "6"], correta: 2, explicacao: "1 introdução + 2 desenvolvimento + 1 conclusão = padrão." },
          { enunciado: "A tese deve aparecer na:", opcoes: ["Conclusão", "Introdução", "Apenas no desenvolvimento", "Não precisa de tese"], correta: 1, explicacao: "A tese (posicionamento do autor) deve ser apresentada na introdução." }
        ]
      },
      {
        titulo: "As 5 Competências",
        explicacao: "C1: norma culta. C2: compreensão do tema + tipo textual. C3: seleção e organização de argumentos. C4: coesão textual (conectivos). C5: proposta de intervenção. Cada uma vale 0-200 pontos, total máximo 1000.",
        questoes: [
          { enunciado: "Competência que avalia gramática:", opcoes: ["C2", "C1", "C4", "C5"], correta: 1, explicacao: "C1 avalia domínio da modalidade escrita formal." },
          { enunciado: "Nota máxima da redação:", opcoes: ["800", "900", "1000", "1200"], correta: 2, explicacao: "5 competências × 200 = 1000 pontos." },
          { enunciado: "Fugir do tema resulta em:", opcoes: ["Perda de 100 pontos", "Nota 200", "Nota zero", "Desconto apenas em C2"], correta: 2, explicacao: "Fuga total ao tema zera a redação inteira." }
        ]
      },
      {
        titulo: "Conectivos e Coesão",
        explicacao: "Conectivos ligam ideias e parágrafos, garantindo fluidez (C4). Tipos: adição (além disso), oposição (no entanto), conclusão (portanto), causa (pois, porque), consequência (de modo que), exemplificação (por exemplo), tempo (em seguida).",
        questoes: [
          { enunciado: "\"No entanto\" é conectivo de:", opcoes: ["Adição", "Oposição", "Conclusão", "Causa"], correta: 1, explicacao: "Introduz ideia contrária à anterior (adversativo)." },
          { enunciado: "\"Portanto\" é usado para:", opcoes: ["Adicionar", "Opor", "Concluir", "Exemplificar"], correta: 2, explicacao: "Conectivo conclusivo que fecha um raciocínio." },
          { enunciado: "Coesão é avaliada em qual competência?", opcoes: ["C1", "C2", "C3", "C4"], correta: 3, explicacao: "C4 avalia mecanismos de coesão (conectivos, pronomes, sinônimos)." }
        ]
      },
      {
        titulo: "Repertório Sociocultural",
        explicacao: "Referências externas para fundamentar argumentos: citações de filósofos, dados estatísticos, fatos históricos, conceitos científicos, obras literárias, filmes e leis. Deve ser legitimado (fonte confiável) e produtivo (ligado ao argumento).",
        questoes: [
          { enunciado: "Repertório sociocultural legitimado é:", opcoes: ["Opinião pessoal", "Referências de fontes confiáveis (dados, autores, leis)", "Senso comum", "Frases de redes sociais"], correta: 1, explicacao: "Deve vir de fontes confiáveis: filósofos, cientistas, dados do IBGE, leis, etc." },
          { enunciado: "Repertório produtivo é aquele que:", opcoes: ["É apenas citado sem conexão", "Está diretamente ligado à argumentação", "É copiado da coletânea", "É inventado"], correta: 1, explicacao: "O repertório deve ser usado para sustentar o argumento, não apenas como decoração." },
          { enunciado: "Citar Zygmunt Bauman ou Kant em uma redação é exemplo de:", opcoes: ["Fuga ao tema", "Repertório sociocultural", "Cópia", "Erro gramatical"], correta: 1, explicacao: "Citar pensadores reconhecidos demonstra conhecimento de mundo e fundamenta a argumentação." }
        ]
      },
      {
        titulo: "Temas Recorrentes",
        explicacao: "O ENEM aborda questões sociais: saúde mental, violência (contra mulher, racismo), tecnologia e privacidade, meio ambiente, educação, direitos de minorias, desigualdade social, mobilidade urbana, alimentação e saúde pública.",
        questoes: [
          { enunciado: "O tema da redação é geralmente sobre:", opcoes: ["Ficção", "Questões sociais relevantes do Brasil", "Temas pessoais", "Problemas matemáticos"], correta: 1, explicacao: "ENEM escolhe temas de relevância social no contexto brasileiro." },
          { enunciado: "A proposta de intervenção deve:", opcoes: ["Ser vaga", "Ser detalhada e viável", "Culpar indivíduos", "Copiar outros textos"], correta: 1, explicacao: "Deve ser detalhada, viável e respeitar os direitos humanos." },
          { enunciado: "Ferir os direitos humanos na redação resulta em:", opcoes: ["Nada", "Nota zero", "Bonus de pontos", "Desconto pequeno"], correta: 1, explicacao: "Propostas que desrespeitem direitos humanos podem zerar a redação." }
        ]
      },
      {
        titulo: "Proposta de Intervenção",
        explicacao: "Elemento exclusivo da redação do ENEM (C5). Deve conter 5 elementos: agente (quem), ação (o quê), meio/modo (como), finalidade (para quê) e detalhamento de um desses. Deve respeitar direitos humanos e ser viável.",
        questoes: [
          { enunciado: "O agente na proposta pode ser:", opcoes: ["Apenas o governo", "Governo, ONGs, escolas, mídia, sociedade, empresas", "Apenas o cidadão", "Apenas a escola"], correta: 1, explicacao: "O agente pode ser qualquer ator social: governo, organizações, escolas, mídia, empresas, etc." },
          { enunciado: "\"O MEC deve criar campanhas educativas em escolas\" tem:", opcoes: ["Só agente", "Agente (MEC), ação (criar campanhas) e meio (em escolas)", "Só ação", "Nenhum elemento"], correta: 1, explicacao: "Identifica-se: agente = MEC, ação = criar campanhas, meio = em escolas." },
          { enunciado: "Para nota máxima em C5, a proposta precisa de:", opcoes: ["1 elemento", "3 elementos", "5 elementos completos", "Apenas opinião"], correta: 2, explicacao: "São necessários 5 elementos: agente, ação, meio, finalidade e detalhamento." }
        ]
      }
    ]
  }
];

export interface Questao {
  enunciado: string;
  opcoes: string[];
  correta: number; // index da opção correta
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
  {
    id: "matematica",
    titulo: "Matemática",
    icon: "Calculator",
    cor: "bg-blue-500",
    topicos: [
      {
        titulo: "Porcentagem",
        explicacao: "Porcentagem é uma razão centesimal, ou seja, uma fração cujo denominador é 100. Para calcular x% de um valor, basta multiplicar o valor por x/100. É amplamente usada em descontos, juros e estatísticas.",
        questoes: [
          {
            enunciado: "Qual é 25% de 200?",
            opcoes: ["25", "50", "75", "100"],
            correta: 1,
            explicacao: "25% de 200 = (25/100) × 200 = 0,25 × 200 = 50."
          },
          {
            enunciado: "Um produto custava R$ 80 e teve um aumento de 15%. Qual o novo preço?",
            opcoes: ["R$ 90,00", "R$ 92,00", "R$ 95,00", "R$ 88,00"],
            correta: 1,
            explicacao: "Aumento de 15% sobre R$ 80: 80 × 0,15 = 12. Novo preço: 80 + 12 = R$ 92,00."
          },
          {
            enunciado: "Se um aluno acertou 18 de 30 questões, qual a porcentagem de acertos?",
            opcoes: ["50%", "55%", "60%", "65%"],
            correta: 2,
            explicacao: "18/30 = 0,6 = 60%. Basta dividir o número de acertos pelo total e multiplicar por 100."
          }
        ]
      },
      {
        titulo: "Regra de Três",
        explicacao: "A regra de três é um método para resolver problemas que envolvem grandezas proporcionais. Na regra de três simples, temos duas grandezas diretamente ou inversamente proporcionais. Montamos a proporção e resolvemos com a multiplicação cruzada.",
        questoes: [
          {
            enunciado: "Se 5 cadernos custam R$ 30, quanto custam 8 cadernos?",
            opcoes: ["R$ 40", "R$ 45", "R$ 48", "R$ 50"],
            correta: 2,
            explicacao: "5 cadernos → R$ 30, logo 8 cadernos → (8 × 30)/5 = 240/5 = R$ 48."
          },
          {
            enunciado: "Um carro percorre 240 km com 20 litros de gasolina. Quantos litros precisa para percorrer 360 km?",
            opcoes: ["25 litros", "28 litros", "30 litros", "32 litros"],
            correta: 2,
            explicacao: "240 km → 20 L, então 360 km → (360 × 20)/240 = 7200/240 = 30 litros."
          },
          {
            enunciado: "Se 3 pedreiros constroem um muro em 12 dias, em quantos dias 6 pedreiros fariam o mesmo muro?",
            opcoes: ["4 dias", "6 dias", "8 dias", "10 dias"],
            correta: 1,
            explicacao: "Grandezas inversamente proporcionais: 3 × 12 = 6 × x → x = 36/6 = 6 dias."
          }
        ]
      },
      {
        titulo: "Funções",
        explicacao: "Uma função é uma relação entre dois conjuntos onde cada elemento do domínio está associado a exatamente um elemento do contradomínio. A função do 1º grau tem a forma f(x) = ax + b, e a do 2º grau f(x) = ax² + bx + c.",
        questoes: [
          {
            enunciado: "Qual o valor de f(3) para f(x) = 2x + 1?",
            opcoes: ["5", "6", "7", "8"],
            correta: 2,
            explicacao: "f(3) = 2(3) + 1 = 6 + 1 = 7."
          },
          {
            enunciado: "O zero da função f(x) = 3x - 9 é:",
            opcoes: ["x = 2", "x = 3", "x = -3", "x = 9"],
            correta: 1,
            explicacao: "3x - 9 = 0 → 3x = 9 → x = 3."
          },
          {
            enunciado: "O vértice da parábola f(x) = x² - 4x + 3 tem coordenada x igual a:",
            opcoes: ["1", "2", "3", "4"],
            correta: 1,
            explicacao: "x do vértice = -b/(2a) = -(-4)/(2×1) = 4/2 = 2."
          }
        ]
      }
    ]
  },
  {
    id: "portugues",
    titulo: "Português",
    icon: "BookOpen",
    cor: "bg-emerald-500",
    topicos: [
      {
        titulo: "Interpretação de Texto",
        explicacao: "Interpretar um texto é compreender seu sentido global, identificar a ideia central, os argumentos do autor e as informações implícitas. No ENEM, é fundamental distinguir fatos de opiniões e reconhecer o contexto de produção do texto.",
        questoes: [
          {
            enunciado: "Quando o autor de um texto usa ironia, ele pretende:",
            opcoes: ["Dizer exatamente o que pensa", "Expressar o contrário do que suas palavras significam literalmente", "Fazer uma descrição objetiva", "Narrar um fato verídico"],
            correta: 1,
            explicacao: "A ironia consiste em dizer o contrário do que se quer expressar, usando o contexto e o tom para transmitir o real significado."
          },
          {
            enunciado: "A ideia principal de um texto geralmente está:",
            opcoes: ["Sempre na primeira frase", "No título apenas", "Distribuída ao longo do texto, podendo ser sintetizada", "Na última frase apenas"],
            correta: 2,
            explicacao: "A ideia central permeia o texto todo. Pode ser sintetizada, mas não se limita a uma única frase ou ao título."
          },
          {
            enunciado: "Qual a diferença entre tema e título de um texto?",
            opcoes: ["São a mesma coisa", "O tema é o assunto tratado e o título é o nome dado ao texto", "O título é mais importante que o tema", "O tema aparece só no final"],
            correta: 1,
            explicacao: "O tema é o assunto central abordado, enquanto o título é a expressão que nomeia o texto, podendo ou não revelar o tema diretamente."
          }
        ]
      },
      {
        titulo: "Figuras de Linguagem",
        explicacao: "Figuras de linguagem são recursos estilísticos que tornam a comunicação mais expressiva. As mais cobradas no ENEM são: metáfora (comparação implícita), metonímia (substituição por relação), hipérbole (exagero), ironia e antítese (oposição de ideias).",
        questoes: [
          {
            enunciado: "\"Aquele homem é um touro.\" A figura de linguagem presente é:",
            opcoes: ["Hipérbole", "Metáfora", "Metonímia", "Eufemismo"],
            correta: 1,
            explicacao: "Metáfora: comparação implícita (sem 'como') entre o homem e um touro, atribuindo-lhe força."
          },
          {
            enunciado: "\"Li Machado de Assis nas férias.\" A figura de linguagem é:",
            opcoes: ["Metáfora", "Antítese", "Metonímia", "Pleonasmo"],
            correta: 2,
            explicacao: "Metonímia: o autor (Machado de Assis) é usado no lugar da obra (os livros dele)."
          },
          {
            enunciado: "\"Chorei rios de lágrimas.\" Essa frase contém:",
            opcoes: ["Eufemismo", "Ironia", "Hipérbole", "Metáfora"],
            correta: 2,
            explicacao: "Hipérbole: exagero proposital para enfatizar a intensidade do choro."
          }
        ]
      },
      {
        titulo: "Variação Linguística",
        explicacao: "A variação linguística refere-se às diferentes formas de usar a língua, influenciadas por fatores geográficos, sociais, históricos e situacionais. No ENEM, é importante reconhecer que nenhuma variante é superior a outra e que a adequação depende do contexto.",
        questoes: [
          {
            enunciado: "A variação linguística regional é chamada de:",
            opcoes: ["Variação social", "Variação diatópica", "Variação histórica", "Variação estilística"],
            correta: 1,
            explicacao: "Variação diatópica é aquela relacionada à região geográfica do falante, como sotaques e expressões regionais."
          },
          {
            enunciado: "Quando falamos de forma diferente com amigos e em uma entrevista de emprego, isso é exemplo de variação:",
            opcoes: ["Diatópica", "Diacrônica", "Diafásica (situacional)", "Diastrática"],
            correta: 2,
            explicacao: "Variação diafásica é a adaptação da linguagem de acordo com a situação de comunicação (formal/informal)."
          },
          {
            enunciado: "Considerar uma variante linguística como 'errada' é um exemplo de:",
            opcoes: ["Análise gramatical", "Preconceito linguístico", "Norma culta", "Variação histórica"],
            correta: 1,
            explicacao: "O preconceito linguístico ocorre quando se julga negativamente a fala de alguém por não seguir a norma padrão, ignorando que todas as variantes são válidas."
          }
        ]
      }
    ]
  },
  {
    id: "historia",
    titulo: "História",
    icon: "Landmark",
    cor: "bg-amber-500",
    topicos: [
      {
        titulo: "Brasil Colônia",
        explicacao: "O período colonial brasileiro (1500-1822) foi marcado pela exploração de recursos naturais, uso de mão de obra escravizada, sistema de capitanias hereditárias e governo-geral. A economia girava em torno do pau-brasil, cana-de-açúcar e mineração.",
        questoes: [
          {
            enunciado: "O sistema de capitanias hereditárias foi criado por:",
            opcoes: ["D. Pedro I", "D. João VI", "D. João III", "Pedro Álvares Cabral"],
            correta: 2,
            explicacao: "D. João III criou o sistema de capitanias hereditárias em 1534 para colonizar e defender o território brasileiro."
          },
          {
            enunciado: "A principal mão de obra utilizada nos engenhos de açúcar no Brasil colonial era:",
            opcoes: ["Assalariada europeia", "Indígena livre", "Escravizada africana", "Imigrante asiática"],
            correta: 2,
            explicacao: "A mão de obra escravizada africana foi a base da economia açucareira colonial, trazida pelo tráfico negreiro."
          },
          {
            enunciado: "A Inconfidência Mineira (1789) foi um movimento que buscava:",
            opcoes: ["A abolição da escravatura", "A independência de Minas Gerais e do Brasil", "A volta do pau-brasil", "A criação de universidades"],
            correta: 1,
            explicacao: "A Inconfidência Mineira foi um movimento separatista que buscava a independência, motivado pela cobrança abusiva de impostos (derrama) por Portugal."
          }
        ]
      },
      {
        titulo: "Era Vargas",
        explicacao: "Getúlio Vargas governou o Brasil em dois períodos (1930-1945 e 1951-1954). Seu governo foi marcado pela criação das leis trabalhistas (CLT), nacionalismo econômico, censura no Estado Novo e modernização industrial do país.",
        questoes: [
          {
            enunciado: "A CLT (Consolidação das Leis do Trabalho) foi criada em qual ano?",
            opcoes: ["1930", "1937", "1943", "1954"],
            correta: 2,
            explicacao: "A CLT foi promulgada em 1º de maio de 1943, consolidando diversas leis trabalhistas do período Vargas."
          },
          {
            enunciado: "O Estado Novo (1937-1945) foi caracterizado por:",
            opcoes: ["Democracia plena", "Ditadura com censura e centralização do poder", "Governo parlamentarista", "Abertura política total"],
            correta: 1,
            explicacao: "O Estado Novo foi um regime ditatorial com forte censura (DIP), perseguição política e centralização do poder em Vargas."
          },
          {
            enunciado: "Vargas ficou conhecido como 'pai dos pobres' principalmente por:",
            opcoes: ["Distribuir terras", "Criar leis trabalhistas e direitos sociais", "Acabar com a inflação", "Promover eleições livres"],
            correta: 1,
            explicacao: "O título veio da criação de direitos trabalhistas como salário mínimo, férias, jornada de trabalho regulamentada e a CLT."
          }
        ]
      },
      {
        titulo: "Ditadura Militar",
        explicacao: "O regime militar brasileiro (1964-1985) foi instaurado por um golpe que depôs João Goulart. Caracterizou-se por censura, perseguição política, Atos Institucionais (especialmente o AI-5), tortura, mas também pelo 'milagre econômico'. A redemocratização veio com o movimento Diretas Já.",
        questoes: [
          {
            enunciado: "O AI-5, considerado o mais repressivo dos Atos Institucionais, foi decretado em:",
            opcoes: ["1964", "1966", "1968", "1972"],
            correta: 2,
            explicacao: "O AI-5 foi decretado em dezembro de 1968, dando poderes absolutos ao presidente, suspendendo habeas corpus e intensificando a repressão."
          },
          {
            enunciado: "O movimento 'Diretas Já' (1983-1984) reivindicava:",
            opcoes: ["A volta da monarquia", "Eleições diretas para presidente", "O fim do voto feminino", "A criação de novos estados"],
            correta: 1,
            explicacao: "O Diretas Já foi um movimento popular que pedia eleições diretas para presidente, marcando o processo de redemocratização."
          },
          {
            enunciado: "O chamado 'milagre econômico' brasileiro ocorreu durante o governo de:",
            opcoes: ["Costa e Silva", "Médici", "Geisel", "Figueiredo"],
            correta: 1,
            explicacao: "O 'milagre econômico' (1969-1973) ocorreu no governo Médici, com alto crescimento do PIB, mas também aumento da desigualdade e da dívida externa."
          }
        ]
      }
    ]
  },
  {
    id: "geografia",
    titulo: "Geografia",
    icon: "Globe",
    cor: "bg-cyan-500",
    topicos: [
      {
        titulo: "Meio Ambiente e Sustentabilidade",
        explicacao: "A questão ambiental no ENEM aborda temas como desmatamento, aquecimento global, matriz energética, gestão de resíduos e desenvolvimento sustentável. É fundamental compreender a relação entre atividade humana e impactos ambientais.",
        questoes: [
          {
            enunciado: "O efeito estufa é um fenômeno:",
            opcoes: ["Exclusivamente prejudicial ao planeta", "Natural, mas intensificado pela ação humana", "Causado apenas pela indústria", "Que não tem relação com o CO₂"],
            correta: 1,
            explicacao: "O efeito estufa é natural e essencial para a vida na Terra, mas a emissão excessiva de gases como CO₂ pela ação humana o intensifica, causando aquecimento global."
          },
          {
            enunciado: "A principal causa do desmatamento na Amazônia é:",
            opcoes: ["Queimadas naturais", "Expansão da agropecuária", "Mineração apenas", "Urbanização das cidades amazônicas"],
            correta: 1,
            explicacao: "A expansão da agropecuária (pecuária e soja) é o principal vetor de desmatamento na Amazônia, segundo dados do INPE."
          },
          {
            enunciado: "Desenvolvimento sustentável significa:",
            opcoes: ["Não usar recursos naturais", "Atender necessidades atuais sem comprometer gerações futuras", "Priorizar o crescimento econômico", "Voltar a viver sem tecnologia"],
            correta: 1,
            explicacao: "O conceito de desenvolvimento sustentável, definido pela ONU em 1987, propõe atender as necessidades do presente sem comprometer a capacidade das futuras gerações."
          }
        ]
      },
      {
        titulo: "Urbanização",
        explicacao: "A urbanização brasileira foi rápida e desordenada, intensificando-se a partir da década de 1950. Gerou problemas como favelização, falta de infraestrutura, mobilidade urbana precária e segregação socioespacial. O êxodo rural foi o principal motor desse processo.",
        questoes: [
          {
            enunciado: "O êxodo rural no Brasil se intensificou a partir de:",
            opcoes: ["Década de 1920", "Década de 1950", "Década de 1980", "Década de 2000"],
            correta: 1,
            explicacao: "A partir da década de 1950, com a industrialização e modernização agrícola, milhões de pessoas migraram do campo para as cidades."
          },
          {
            enunciado: "A segregação socioespacial nas cidades brasileiras se manifesta por:",
            opcoes: ["Igualdade no acesso a serviços", "Concentração de riqueza e pobreza em áreas distintas", "Distribuição uniforme da população", "Ausência de favelas"],
            correta: 1,
            explicacao: "A segregação socioespacial divide a cidade em áreas nobres (com infraestrutura) e periféricas (sem serviços adequados), refletindo a desigualdade social."
          },
          {
            enunciado: "Megalópole é:",
            opcoes: ["Uma cidade com mais de 1 milhão de habitantes", "A junção de duas ou mais metrópoles", "Uma cidade planejada", "O mesmo que metrópole"],
            correta: 1,
            explicacao: "Megalópole é a conurbação de duas ou mais metrópoles, formando uma extensa área urbana contínua, como o eixo São Paulo-Rio de Janeiro."
          }
        ]
      }
    ]
  },
  {
    id: "biologia",
    titulo: "Biologia",
    icon: "Leaf",
    cor: "bg-green-600",
    topicos: [
      {
        titulo: "Ecologia",
        explicacao: "Ecologia é o estudo das relações entre os seres vivos e o ambiente. Conceitos fundamentais incluem cadeia alimentar, teia alimentar, ciclos biogeoquímicos, biomas e relações ecológicas. No ENEM, questões sobre impacto ambiental e sustentabilidade são muito frequentes.",
        questoes: [
          {
            enunciado: "Em uma cadeia alimentar, os decompositores são responsáveis por:",
            opcoes: ["Produzir energia pela fotossíntese", "Caçar outros animais", "Decompor matéria orgânica e reciclar nutrientes", "Consumir produtores"],
            correta: 2,
            explicacao: "Os decompositores (fungos e bactérias) degradam a matéria orgânica morta, devolvendo nutrientes ao ambiente para serem reutilizados."
          },
          {
            enunciado: "A biomagnificação é o processo de:",
            opcoes: ["Aumento da biodiversidade", "Acúmulo de substâncias tóxicas ao longo da cadeia alimentar", "Crescimento de organismos", "Fotossíntese em grande escala"],
            correta: 1,
            explicacao: "A biomagnificação ocorre quando substâncias tóxicas se acumulam em concentrações crescentes nos níveis tróficos superiores da cadeia alimentar."
          },
          {
            enunciado: "O bioma Cerrado é caracterizado por:",
            opcoes: ["Vegetação densa e úmida", "Árvores retorcidas e clima com duas estações definidas", "Baixas temperaturas o ano todo", "Solo extremamente fértil naturalmente"],
            correta: 1,
            explicacao: "O Cerrado possui vegetação com árvores de troncos retorcidos, raízes profundas e clima com estação seca e chuvosa bem definidas."
          }
        ]
      },
      {
        titulo: "Genética",
        explicacao: "A genética estuda a hereditariedade e a variação dos organismos. Conceitos como genes, alelos, genótipo, fenótipo e as Leis de Mendel são fundamentais. No ENEM, questões envolvem cruzamentos, heredogramas e aplicações como transgênicos e terapia gênica.",
        questoes: [
          {
            enunciado: "Se ambos os pais são heterozigotos (Aa), a probabilidade de ter um filho homozigoto recessivo (aa) é:",
            opcoes: ["0%", "25%", "50%", "75%"],
            correta: 1,
            explicacao: "Cruzando Aa × Aa: AA (25%), Aa (50%), aa (25%). A probabilidade de aa é 25% (1/4)."
          },
          {
            enunciado: "O DNA é formado por uma dupla hélice composta por:",
            opcoes: ["Aminoácidos", "Nucleotídeos", "Lipídeos", "Carboidratos"],
            correta: 1,
            explicacao: "O DNA é um polímero de nucleotídeos, cada um composto por uma base nitrogenada, uma desoxirribose e um grupo fosfato."
          },
          {
            enunciado: "A 1ª Lei de Mendel (Lei da Segregação) afirma que:",
            opcoes: ["Os genes se fundem na reprodução", "Cada característica é determinada por dois fatores que se separam na formação dos gametas", "Todos os genes são dominantes", "A herança é sempre ligada ao sexo"],
            correta: 1,
            explicacao: "A 1ª Lei de Mendel diz que cada caráter é determinado por um par de fatores (alelos) que se segregam na formação dos gametas, indo um para cada célula reprodutiva."
          }
        ]
      }
    ]
  },
  {
    id: "quimica",
    titulo: "Química",
    icon: "FlaskConical",
    cor: "bg-purple-500",
    topicos: [
      {
        titulo: "Estequiometria",
        explicacao: "Estequiometria é o cálculo das quantidades de reagentes e produtos em uma reação química. Baseia-se no balanceamento de equações e nas relações molares. É essencial conhecer a massa molar dos elementos e o conceito de mol (6,02 × 10²³).",
        questoes: [
          {
            enunciado: "Na reação 2H₂ + O₂ → 2H₂O, quantos mols de água são produzidos a partir de 4 mols de H₂?",
            opcoes: ["2 mols", "4 mols", "6 mols", "8 mols"],
            correta: 1,
            explicacao: "Pela proporção: 2 mols H₂ → 2 mols H₂O, então 4 mols H₂ → 4 mols H₂O."
          },
          {
            enunciado: "A massa molar da água (H₂O) é aproximadamente:",
            opcoes: ["16 g/mol", "18 g/mol", "20 g/mol", "32 g/mol"],
            correta: 1,
            explicacao: "H₂O: 2 × H(1) + O(16) = 2 + 16 = 18 g/mol."
          },
          {
            enunciado: "Um mol de qualquer substância contém quantas entidades?",
            opcoes: ["6,02 × 10²⁰", "6,02 × 10²³", "3,01 × 10²³", "1,00 × 10²⁴"],
            correta: 1,
            explicacao: "O número de Avogadro é 6,02 × 10²³, que representa a quantidade de entidades (átomos, moléculas etc.) em um mol."
          }
        ]
      },
      {
        titulo: "Reações Químicas",
        explicacao: "Reações químicas são transformações que alteram a composição das substâncias. Os principais tipos são: síntese, decomposição, simples troca e dupla troca. Sinais de reação incluem mudança de cor, liberação de gás, formação de precipitado e variação de temperatura.",
        questoes: [
          {
            enunciado: "A reação A + B → AB é classificada como:",
            opcoes: ["Decomposição", "Síntese (adição)", "Simples troca", "Dupla troca"],
            correta: 1,
            explicacao: "Quando duas substâncias se combinam para formar uma única, temos uma reação de síntese ou adição."
          },
          {
            enunciado: "O balanceamento de uma equação química serve para:",
            opcoes: ["Aumentar a velocidade da reação", "Garantir a conservação da massa (Lei de Lavoisier)", "Mudar os produtos da reação", "Alterar o estado físico dos reagentes"],
            correta: 1,
            explicacao: "O balanceamento garante que a quantidade de átomos de cada elemento seja igual nos reagentes e produtos, respeitando a Lei de Lavoisier."
          },
          {
            enunciado: "Uma reação exotérmica é aquela que:",
            opcoes: ["Absorve calor do ambiente", "Libera calor para o ambiente", "Não envolve troca de calor", "Ocorre apenas em baixas temperaturas"],
            correta: 1,
            explicacao: "Reações exotérmicas liberam energia na forma de calor para o ambiente, como a combustão."
          }
        ]
      }
    ]
  },
  {
    id: "fisica",
    titulo: "Física",
    icon: "Zap",
    cor: "bg-red-500",
    topicos: [
      {
        titulo: "Cinemática",
        explicacao: "Cinemática é o estudo do movimento sem considerar suas causas. Os conceitos principais são: posição, velocidade, aceleração e os tipos de movimento (uniforme e uniformemente variado). As fórmulas do MRU e MRUV são essenciais.",
        questoes: [
          {
            enunciado: "No MRU (Movimento Retilíneo Uniforme), a velocidade é:",
            opcoes: ["Variável", "Constante", "Sempre zero", "Sempre crescente"],
            correta: 1,
            explicacao: "No MRU a velocidade é constante (não muda com o tempo), e a aceleração é zero."
          },
          {
            enunciado: "Um carro percorre 100 km em 2 horas com velocidade constante. Sua velocidade é:",
            opcoes: ["200 km/h", "50 km/h", "100 km/h", "25 km/h"],
            correta: 1,
            explicacao: "v = d/t = 100/2 = 50 km/h."
          },
          {
            enunciado: "No MRUV, a grandeza que permanece constante é:",
            opcoes: ["A velocidade", "A posição", "A aceleração", "O deslocamento"],
            correta: 2,
            explicacao: "No MRUV (Movimento Retilíneo Uniformemente Variado) a aceleração é constante, enquanto a velocidade varia uniformemente."
          }
        ]
      },
      {
        titulo: "Eletricidade",
        explicacao: "Eletricidade estuda os fenômenos relacionados a cargas elétricas. No ENEM, os temas mais cobrados são: corrente elétrica, resistência, Lei de Ohm (V = R × i), potência elétrica (P = V × i) e circuitos elétricos (série e paralelo).",
        questoes: [
          {
            enunciado: "Pela Lei de Ohm, se a tensão é 12V e a resistência é 4Ω, a corrente é:",
            opcoes: ["2A", "3A", "4A", "48A"],
            correta: 1,
            explicacao: "V = R × i → i = V/R = 12/4 = 3A."
          },
          {
            enunciado: "Em um circuito em série, a corrente elétrica:",
            opcoes: ["É diferente em cada resistor", "É a mesma em todos os pontos", "É zero", "Dobra a cada resistor"],
            correta: 1,
            explicacao: "Em circuitos em série, a corrente é a mesma em todos os componentes, pois há um único caminho para a passagem de corrente."
          },
          {
            enunciado: "A unidade de potência elétrica no SI é:",
            opcoes: ["Ampère", "Volt", "Watt", "Ohm"],
            correta: 2,
            explicacao: "A potência elétrica é medida em Watt (W), onde P = V × i."
          }
        ]
      }
    ]
  },
  {
    id: "redacao",
    titulo: "Redação",
    icon: "PenTool",
    cor: "bg-rose-500",
    topicos: [
      {
        titulo: "Estrutura da Redação do ENEM",
        explicacao: "A redação do ENEM segue o modelo dissertativo-argumentativo com: introdução (apresentação do tema e tese), desenvolvimento (2 parágrafos com argumentos e repertório sociocultural) e conclusão (proposta de intervenção detalhada com agente, ação, meio, finalidade e detalhamento).",
        questoes: [
          {
            enunciado: "A proposta de intervenção na redação do ENEM deve conter:",
            opcoes: ["Apenas uma sugestão genérica", "Agente, ação, modo, finalidade e detalhamento", "Somente a opinião do autor", "Uma pergunta retórica"],
            correta: 1,
            explicacao: "A proposta de intervenção deve ser detalhada, contendo: quem vai fazer (agente), o que vai fazer (ação), como vai fazer (meio/modo), para que (finalidade) e um detalhamento adicional."
          },
          {
            enunciado: "Quantos parágrafos tem a estrutura ideal de uma redação do ENEM?",
            opcoes: ["3 parágrafos", "4 parágrafos", "5 parágrafos", "6 parágrafos"],
            correta: 2,
            explicacao: "A estrutura ideal tem 5 parágrafos: 1 de introdução, 2 de desenvolvimento e 1 de conclusão (podendo chegar a 4 de desenvolvimento em casos excepcionais, mas 5 no total é o padrão)."
          },
          {
            enunciado: "Repertório sociocultural na redação do ENEM se refere a:",
            opcoes: ["Copiar trechos da coletânea", "Usar conhecimentos de outras áreas (filosofia, história, dados) para fundamentar argumentos", "Contar histórias pessoais", "Usar gírias e linguagem informal"],
            correta: 1,
            explicacao: "Repertório sociocultural são referências externas (citações, dados, fatos históricos, conceitos filosóficos) usados para fundamentar a argumentação, mostrando conhecimento de mundo."
          }
        ]
      },
      {
        titulo: "Competências da Redação",
        explicacao: "A redação do ENEM é avaliada em 5 competências: (1) domínio da norma culta, (2) compreensão do tema e uso do tipo dissertativo-argumentativo, (3) seleção e organização de argumentos, (4) coesão textual e (5) proposta de intervenção. Cada uma vale até 200 pontos.",
        questoes: [
          {
            enunciado: "Qual competência avalia o uso correto da gramática e ortografia?",
            opcoes: ["Competência 2", "Competência 1", "Competência 4", "Competência 5"],
            correta: 1,
            explicacao: "A Competência 1 avalia o domínio da modalidade escrita formal da língua portuguesa (gramática, ortografia, acentuação, concordância etc.)."
          },
          {
            enunciado: "A nota máxima da redação do ENEM é:",
            opcoes: ["800 pontos", "900 pontos", "1000 pontos", "1200 pontos"],
            correta: 2,
            explicacao: "A nota máxima é 1000 pontos, sendo 200 pontos para cada uma das 5 competências avaliadas."
          },
          {
            enunciado: "Fugir completamente do tema proposto resulta em:",
            opcoes: ["Perda de 100 pontos", "Nota 200", "Nota zero na redação", "Apenas desconto na Competência 2"],
            correta: 2,
            explicacao: "A fuga total ao tema é uma das situações que zeram a redação do ENEM, anulando todas as competências."
          }
        ]
      }
    ]
  }
];

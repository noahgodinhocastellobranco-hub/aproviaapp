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
          { enunciado: "Qual é 25% de 200?", opcoes: ["25", "50", "75", "100"], correta: 1, explicacao: "25% de 200 = (25/100) × 200 = 0,25 × 200 = 50." },
          { enunciado: "Um produto custava R$ 80 e teve um aumento de 15%. Qual o novo preço?", opcoes: ["R$ 90,00", "R$ 92,00", "R$ 95,00", "R$ 88,00"], correta: 1, explicacao: "Aumento de 15% sobre R$ 80: 80 × 0,15 = 12. Novo preço: 80 + 12 = R$ 92,00." },
          { enunciado: "Se um aluno acertou 18 de 30 questões, qual a porcentagem de acertos?", opcoes: ["50%", "55%", "60%", "65%"], correta: 2, explicacao: "18/30 = 0,6 = 60%." }
        ]
      },
      {
        titulo: "Regra de Três",
        explicacao: "A regra de três é um método para resolver problemas que envolvem grandezas proporcionais. Na regra de três simples, temos duas grandezas diretamente ou inversamente proporcionais. Montamos a proporção e resolvemos com a multiplicação cruzada.",
        questoes: [
          { enunciado: "Se 5 cadernos custam R$ 30, quanto custam 8 cadernos?", opcoes: ["R$ 40", "R$ 45", "R$ 48", "R$ 50"], correta: 2, explicacao: "5 cadernos → R$ 30, logo 8 cadernos → (8 × 30)/5 = R$ 48." },
          { enunciado: "Um carro percorre 240 km com 20 litros. Quantos litros precisa para 360 km?", opcoes: ["25 litros", "28 litros", "30 litros", "32 litros"], correta: 2, explicacao: "240 km → 20 L, então 360 km → (360 × 20)/240 = 30 litros." },
          { enunciado: "Se 3 pedreiros constroem um muro em 12 dias, em quantos dias 6 pedreiros fariam?", opcoes: ["4 dias", "6 dias", "8 dias", "10 dias"], correta: 1, explicacao: "Grandezas inversamente proporcionais: 3 × 12 = 6 × x → x = 6 dias." }
        ]
      },
      {
        titulo: "Funções",
        explicacao: "Uma função é uma relação entre dois conjuntos onde cada elemento do domínio está associado a exatamente um elemento do contradomínio. A função do 1º grau tem forma f(x) = ax + b, e a do 2º grau f(x) = ax² + bx + c.",
        questoes: [
          { enunciado: "Qual o valor de f(3) para f(x) = 2x + 1?", opcoes: ["5", "6", "7", "8"], correta: 2, explicacao: "f(3) = 2(3) + 1 = 7." },
          { enunciado: "O zero da função f(x) = 3x - 9 é:", opcoes: ["x = 2", "x = 3", "x = -3", "x = 9"], correta: 1, explicacao: "3x - 9 = 0 → x = 3." },
          { enunciado: "O vértice da parábola f(x) = x² - 4x + 3 tem coordenada x igual a:", opcoes: ["1", "2", "3", "4"], correta: 1, explicacao: "x do vértice = -b/(2a) = 4/2 = 2." }
        ]
      },
      {
        titulo: "Geometria Plana",
        explicacao: "Geometria plana estuda figuras bidimensionais como triângulos, quadriláteros e círculos. No ENEM, é essencial saber calcular áreas, perímetros e aplicar o Teorema de Pitágoras (a² = b² + c²) em triângulos retângulos.",
        questoes: [
          { enunciado: "A área de um retângulo com base 8 cm e altura 5 cm é:", opcoes: ["13 cm²", "26 cm²", "40 cm²", "80 cm²"], correta: 2, explicacao: "Área = base × altura = 8 × 5 = 40 cm²." },
          { enunciado: "Pelo Teorema de Pitágoras, a hipotenusa de um triângulo com catetos 3 e 4 é:", opcoes: ["5", "6", "7", "8"], correta: 0, explicacao: "h² = 3² + 4² = 9 + 16 = 25, logo h = 5." },
          { enunciado: "A área de um círculo com raio 3 cm (use π ≈ 3) é aproximadamente:", opcoes: ["9 cm²", "18 cm²", "27 cm²", "36 cm²"], correta: 2, explicacao: "Área = π × r² = 3 × 9 = 27 cm²." }
        ]
      },
      {
        titulo: "Probabilidade e Estatística",
        explicacao: "Probabilidade mede a chance de um evento ocorrer (favoráveis/possíveis). Estatística organiza e interpreta dados usando média, mediana e moda. No ENEM, gráficos e tabelas são muito cobrados.",
        questoes: [
          { enunciado: "Ao lançar um dado honesto, a probabilidade de sair número par é:", opcoes: ["1/6", "1/3", "1/2", "2/3"], correta: 2, explicacao: "Números pares: {2, 4, 6} = 3 casos favoráveis de 6 possíveis = 3/6 = 1/2." },
          { enunciado: "A média aritmética de 4, 6, 8 e 10 é:", opcoes: ["6", "7", "8", "9"], correta: 1, explicacao: "Média = (4+6+8+10)/4 = 28/4 = 7." },
          { enunciado: "A mediana do conjunto {3, 7, 1, 9, 5} é:", opcoes: ["3", "5", "7", "9"], correta: 1, explicacao: "Ordenando: {1, 3, 5, 7, 9}. A mediana é o valor central = 5." }
        ]
      },
      {
        titulo: "Matemática Financeira",
        explicacao: "Matemática financeira trata de juros simples (J = C × i × t) e compostos (M = C × (1+i)ⁿ), descontos, lucro e investimentos. No ENEM, problemas contextualizados com compras, empréstimos e aplicações financeiras são muito comuns.",
        questoes: [
          { enunciado: "Qual o juro simples de R$ 1.000 a 5% ao mês por 3 meses?", opcoes: ["R$ 50", "R$ 100", "R$ 150", "R$ 200"], correta: 2, explicacao: "J = C × i × t = 1000 × 0,05 × 3 = R$ 150." },
          { enunciado: "Um produto de R$ 200 é vendido com 30% de lucro. O preço de venda é:", opcoes: ["R$ 230", "R$ 250", "R$ 260", "R$ 280"], correta: 2, explicacao: "Lucro = 200 × 0,30 = 60. Preço de venda = 200 + 60 = R$ 260." },
          { enunciado: "Na compra à vista com 10% de desconto, um item de R$ 500 sai por:", opcoes: ["R$ 400", "R$ 450", "R$ 490", "R$ 480"], correta: 1, explicacao: "Desconto = 500 × 0,10 = 50. Preço final = 500 - 50 = R$ 450." }
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
        explicacao: "Interpretar um texto é compreender seu sentido global, identificar a ideia central, os argumentos do autor e as informações implícitas. No ENEM, é fundamental distinguir fatos de opiniões e reconhecer o contexto de produção.",
        questoes: [
          { enunciado: "Quando o autor usa ironia, ele pretende:", opcoes: ["Dizer exatamente o que pensa", "Expressar o contrário do que suas palavras significam literalmente", "Fazer uma descrição objetiva", "Narrar um fato verídico"], correta: 1, explicacao: "A ironia consiste em dizer o contrário do que se quer expressar." },
          { enunciado: "A ideia principal de um texto geralmente está:", opcoes: ["Sempre na primeira frase", "No título apenas", "Distribuída ao longo do texto, podendo ser sintetizada", "Na última frase apenas"], correta: 2, explicacao: "A ideia central permeia o texto todo e pode ser sintetizada." },
          { enunciado: "Qual a diferença entre tema e título de um texto?", opcoes: ["São a mesma coisa", "O tema é o assunto tratado e o título é o nome dado ao texto", "O título é mais importante que o tema", "O tema aparece só no final"], correta: 1, explicacao: "O tema é o assunto central abordado, o título é a expressão que nomeia o texto." }
        ]
      },
      {
        titulo: "Figuras de Linguagem",
        explicacao: "Figuras de linguagem são recursos estilísticos que tornam a comunicação mais expressiva. As mais cobradas no ENEM são: metáfora (comparação implícita), metonímia (substituição por relação), hipérbole (exagero), ironia e antítese.",
        questoes: [
          { enunciado: "\"Aquele homem é um touro.\" A figura de linguagem é:", opcoes: ["Hipérbole", "Metáfora", "Metonímia", "Eufemismo"], correta: 1, explicacao: "Metáfora: comparação implícita entre o homem e um touro." },
          { enunciado: "\"Li Machado de Assis nas férias.\" A figura é:", opcoes: ["Metáfora", "Antítese", "Metonímia", "Pleonasmo"], correta: 2, explicacao: "Metonímia: o autor é usado no lugar da obra." },
          { enunciado: "\"Chorei rios de lágrimas.\" Essa frase contém:", opcoes: ["Eufemismo", "Ironia", "Hipérbole", "Metáfora"], correta: 2, explicacao: "Hipérbole: exagero proposital para enfatizar a intensidade do choro." }
        ]
      },
      {
        titulo: "Variação Linguística",
        explicacao: "A variação linguística refere-se às diferentes formas de usar a língua, influenciadas por fatores geográficos, sociais, históricos e situacionais. Nenhuma variante é superior a outra; a adequação depende do contexto.",
        questoes: [
          { enunciado: "A variação linguística regional é chamada de:", opcoes: ["Variação social", "Variação diatópica", "Variação histórica", "Variação estilística"], correta: 1, explicacao: "Variação diatópica é relacionada à região geográfica do falante." },
          { enunciado: "Falar diferente com amigos e em entrevista de emprego é variação:", opcoes: ["Diatópica", "Diacrônica", "Diafásica (situacional)", "Diastrática"], correta: 2, explicacao: "Variação diafásica é a adaptação da linguagem conforme a situação." },
          { enunciado: "Considerar uma variante linguística 'errada' é exemplo de:", opcoes: ["Análise gramatical", "Preconceito linguístico", "Norma culta", "Variação histórica"], correta: 1, explicacao: "O preconceito linguístico julga negativamente a fala que não segue a norma padrão." }
        ]
      },
      {
        titulo: "Gêneros Textuais",
        explicacao: "Gêneros textuais são formas de organização do texto de acordo com sua função social: notícia informa, editorial opina, carta argumenta, crônica narra o cotidiano. No ENEM, reconhecer o gênero ajuda a compreender a intenção comunicativa.",
        questoes: [
          { enunciado: "Uma notícia tem como principal função:", opcoes: ["Entreter o leitor", "Informar sobre fatos recentes", "Convencer o leitor de uma opinião", "Narrar uma história fictícia"], correta: 1, explicacao: "A notícia é um gênero jornalístico cuja principal função é informar sobre fatos reais e recentes." },
          { enunciado: "O editorial de um jornal é caracterizado por:", opcoes: ["Narrar uma história", "Apresentar a opinião do veículo sobre um tema", "Descrever um lugar", "Ensinar uma receita"], correta: 1, explicacao: "O editorial expressa a opinião do jornal sobre um tema relevante, sendo um texto argumentativo." },
          { enunciado: "A crônica é um gênero que:", opcoes: ["Aborda apenas temas científicos", "Retrata o cotidiano de forma leve e reflexiva", "É sempre humorística", "Tem linguagem exclusivamente formal"], correta: 1, explicacao: "A crônica aborda temas do cotidiano com leveza, podendo ser reflexiva, humorística ou lírica." }
        ]
      },
      {
        titulo: "Concordância Verbal e Nominal",
        explicacao: "Concordância verbal é a relação entre sujeito e verbo (o verbo concorda em número e pessoa com o sujeito). Concordância nominal é a relação entre substantivo e seus determinantes (artigos, adjetivos concordam em gênero e número).",
        questoes: [
          { enunciado: "\"Faz dois anos que não viajo.\" O verbo 'faz' está:", opcoes: ["Errado, deveria ser 'fazem'", "Correto, pois 'fazer' indicando tempo é impessoal", "Errado, deveria ser 'fez'", "Correto, concordando com 'anos'"], correta: 1, explicacao: "O verbo 'fazer' indicando tempo decorrido é impessoal e fica na 3ª pessoa do singular." },
          { enunciado: "\"É necessário paciência.\" Essa frase está:", opcoes: ["Errada", "Correta, pois 'paciência' não tem determinante", "Correta, concordando com o sujeito", "Errada, deveria ser 'são necessárias'"], correta: 1, explicacao: "Quando o substantivo não vem determinado por artigo, a expressão 'é necessário' fica invariável." },
          { enunciado: "\"A maioria dos alunos chegou/chegaram.\" Ambas as formas estão:", opcoes: ["Erradas", "Corretas, pois sujeito coletivo admite as duas concordâncias", "Só 'chegou' está correta", "Só 'chegaram' está correta"], correta: 1, explicacao: "Sujeito coletivo seguido de complemento plural admite concordância no singular ou plural." }
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
        explicacao: "O período colonial (1500-1822) foi marcado pela exploração de recursos, mão de obra escravizada, capitanias hereditárias e governo-geral. A economia girava em torno do pau-brasil, cana-de-açúcar e mineração.",
        questoes: [
          { enunciado: "O sistema de capitanias hereditárias foi criado por:", opcoes: ["D. Pedro I", "D. João VI", "D. João III", "Pedro Álvares Cabral"], correta: 2, explicacao: "D. João III criou as capitanias hereditárias em 1534 para colonizar o território." },
          { enunciado: "A principal mão de obra nos engenhos de açúcar era:", opcoes: ["Assalariada europeia", "Indígena livre", "Escravizada africana", "Imigrante asiática"], correta: 2, explicacao: "A mão de obra escravizada africana foi a base da economia açucareira colonial." },
          { enunciado: "A Inconfidência Mineira (1789) buscava:", opcoes: ["A abolição da escravatura", "A independência do Brasil", "A volta do pau-brasil", "A criação de universidades"], correta: 1, explicacao: "Foi um movimento separatista motivado pela cobrança abusiva de impostos por Portugal." }
        ]
      },
      {
        titulo: "Era Vargas",
        explicacao: "Getúlio Vargas governou em dois períodos (1930-1945 e 1951-1954). Marcado pela criação da CLT, nacionalismo econômico, censura no Estado Novo e modernização industrial.",
        questoes: [
          { enunciado: "A CLT foi criada em qual ano?", opcoes: ["1930", "1937", "1943", "1954"], correta: 2, explicacao: "A CLT foi promulgada em 1º de maio de 1943." },
          { enunciado: "O Estado Novo (1937-1945) foi caracterizado por:", opcoes: ["Democracia plena", "Ditadura com censura e centralização", "Governo parlamentarista", "Abertura política total"], correta: 1, explicacao: "O Estado Novo foi um regime ditatorial com forte censura e centralização." },
          { enunciado: "Vargas ficou conhecido como 'pai dos pobres' por:", opcoes: ["Distribuir terras", "Criar leis trabalhistas e direitos sociais", "Acabar com a inflação", "Promover eleições livres"], correta: 1, explicacao: "O título veio da criação de direitos como salário mínimo, férias e CLT." }
        ]
      },
      {
        titulo: "Ditadura Militar",
        explicacao: "O regime militar (1964-1985) foi instaurado por golpe, caracterizado por censura, perseguição política, AI-5, tortura, mas também pelo 'milagre econômico'. A redemocratização veio com o Diretas Já.",
        questoes: [
          { enunciado: "O AI-5 foi decretado em:", opcoes: ["1964", "1966", "1968", "1972"], correta: 2, explicacao: "O AI-5 foi decretado em dezembro de 1968, intensificando a repressão." },
          { enunciado: "O movimento 'Diretas Já' reivindicava:", opcoes: ["A volta da monarquia", "Eleições diretas para presidente", "O fim do voto feminino", "A criação de novos estados"], correta: 1, explicacao: "O Diretas Já pedia eleições diretas, marcando a redemocratização." },
          { enunciado: "O 'milagre econômico' ocorreu no governo de:", opcoes: ["Costa e Silva", "Médici", "Geisel", "Figueiredo"], correta: 1, explicacao: "O 'milagre' (1969-1973) ocorreu no governo Médici, com alto PIB mas mais desigualdade." }
        ]
      },
      {
        titulo: "Revolução Industrial",
        explicacao: "A Revolução Industrial (séc. XVIII-XIX) transformou a produção artesanal em fabril, iniciando na Inglaterra. Trouxe urbanização acelerada, surgimento da classe operária, novas tecnologias (máquina a vapor) e profundas mudanças sociais.",
        questoes: [
          { enunciado: "A Revolução Industrial começou em qual país?", opcoes: ["França", "Alemanha", "Inglaterra", "Estados Unidos"], correta: 2, explicacao: "A Inglaterra foi pioneira devido ao acúmulo de capital, matérias-primas e mão de obra disponível." },
          { enunciado: "A máquina a vapor, símbolo da Revolução Industrial, foi aperfeiçoada por:", opcoes: ["Thomas Edison", "James Watt", "Henry Ford", "Karl Marx"], correta: 1, explicacao: "James Watt aperfeiçoou a máquina a vapor na década de 1760, impulsionando a industrialização." },
          { enunciado: "Uma consequência social da Revolução Industrial foi:", opcoes: ["Redução da população urbana", "Surgimento da classe operária e trabalho fabril", "Fim do comércio internacional", "Volta à economia agrária"], correta: 1, explicacao: "O surgimento do proletariado (classe operária) trabalhando em fábricas com condições precárias foi uma das principais consequências." }
        ]
      },
      {
        titulo: "Segunda Guerra Mundial",
        explicacao: "A Segunda Guerra Mundial (1939-1945) foi o maior conflito da história, envolvendo Aliados (EUA, URSS, Reino Unido) contra o Eixo (Alemanha, Itália, Japão). Resultou no Holocausto, na criação da ONU e na bipolarização do mundo (Guerra Fria).",
        questoes: [
          { enunciado: "O estopim da Segunda Guerra foi:", opcoes: ["O ataque a Pearl Harbor", "A invasão da Polônia pela Alemanha", "A queda da Bolsa de NY", "A Revolução Russa"], correta: 1, explicacao: "A invasão da Polônia pela Alemanha nazista em setembro de 1939 desencadeou a guerra." },
          { enunciado: "O Holocausto foi:", opcoes: ["Uma crise econômica", "O genocídio de milhões de judeus e outros grupos pelo nazismo", "Uma revolução popular", "Um tratado de paz"], correta: 1, explicacao: "O Holocausto foi o extermínio sistemático de 6 milhões de judeus e outros grupos pelos nazistas." },
          { enunciado: "A ONU foi criada após a guerra com o objetivo de:", opcoes: ["Dominar o comércio mundial", "Promover a paz e a cooperação internacional", "Punir os países do Eixo", "Criar uma moeda única"], correta: 1, explicacao: "A ONU foi fundada em 1945 para promover a paz, segurança internacional e cooperação entre os países." }
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
        explicacao: "A questão ambiental no ENEM aborda desmatamento, aquecimento global, matriz energética, gestão de resíduos e desenvolvimento sustentável. É fundamental compreender a relação entre atividade humana e impactos ambientais.",
        questoes: [
          { enunciado: "O efeito estufa é um fenômeno:", opcoes: ["Exclusivamente prejudicial", "Natural, mas intensificado pela ação humana", "Causado apenas pela indústria", "Sem relação com o CO₂"], correta: 1, explicacao: "O efeito estufa é natural, mas a emissão excessiva de CO₂ o intensifica." },
          { enunciado: "A principal causa do desmatamento na Amazônia é:", opcoes: ["Queimadas naturais", "Expansão da agropecuária", "Mineração apenas", "Urbanização"], correta: 1, explicacao: "A agropecuária (pecuária e soja) é o principal vetor de desmatamento." },
          { enunciado: "Desenvolvimento sustentável significa:", opcoes: ["Não usar recursos naturais", "Atender necessidades atuais sem comprometer gerações futuras", "Priorizar crescimento econômico", "Voltar a viver sem tecnologia"], correta: 1, explicacao: "Conceito da ONU (1987): atender o presente sem comprometer o futuro." }
        ]
      },
      {
        titulo: "Urbanização",
        explicacao: "A urbanização brasileira foi rápida e desordenada a partir da década de 1950. Gerou favelização, falta de infraestrutura, mobilidade urbana precária e segregação socioespacial. O êxodo rural foi o principal motor.",
        questoes: [
          { enunciado: "O êxodo rural se intensificou a partir de:", opcoes: ["Década de 1920", "Década de 1950", "Década de 1980", "Década de 2000"], correta: 1, explicacao: "A partir dos anos 1950, com industrialização, milhões migraram para as cidades." },
          { enunciado: "A segregação socioespacial se manifesta por:", opcoes: ["Igualdade no acesso a serviços", "Concentração de riqueza e pobreza em áreas distintas", "Distribuição uniforme da população", "Ausência de favelas"], correta: 1, explicacao: "Divide a cidade em áreas nobres e periféricas, refletindo desigualdade social." },
          { enunciado: "Megalópole é:", opcoes: ["Cidade com mais de 1 milhão de habitantes", "A junção de duas ou mais metrópoles", "Uma cidade planejada", "O mesmo que metrópole"], correta: 1, explicacao: "Megalópole é a conurbação de metrópoles, como o eixo SP-RJ." }
        ]
      },
      {
        titulo: "Globalização",
        explicacao: "Globalização é o processo de integração econômica, cultural e política entre os países, intensificado pela revolução tecnológica e pela queda de barreiras comerciais. Gera interdependência, mas também desigualdades entre nações desenvolvidas e subdesenvolvidas.",
        questoes: [
          { enunciado: "A globalização se intensificou principalmente a partir de:", opcoes: ["Século XVIII", "Início do século XX", "Final do século XX (anos 1990)", "Século XXI apenas"], correta: 2, explicacao: "A globalização se intensificou nos anos 1990 com a internet, queda do Muro de Berlim e liberalização comercial." },
          { enunciado: "Uma consequência negativa da globalização é:", opcoes: ["Maior acesso à informação", "Aumento da desigualdade entre países", "Facilidade de comunicação", "Diversidade cultural"], correta: 1, explicacao: "A globalização aprofunda desigualdades, pois países ricos concentram mais benefícios tecnológicos e econômicos." },
          { enunciado: "Empresas multinacionais/transnacionais são:", opcoes: ["Empresas que atuam apenas em seu país", "Empresas que operam em vários países", "Empresas estatais", "Pequenos negócios locais"], correta: 1, explicacao: "Multinacionais operam em diversos países, buscando mercados, mão de obra barata e matéria-prima." }
        ]
      },
      {
        titulo: "Geopolítica e Conflitos",
        explicacao: "A geopolítica estuda as relações de poder entre Estados no cenário internacional. No ENEM, temas como Guerra Fria, conflitos no Oriente Médio, terrorismo, disputas territoriais e organizações internacionais são recorrentes.",
        questoes: [
          { enunciado: "A Guerra Fria foi um conflito entre:", opcoes: ["EUA e China", "EUA e URSS", "Inglaterra e França", "Japão e Alemanha"], correta: 1, explicacao: "A Guerra Fria (1947-1991) foi a disputa ideológica e geopolítica entre EUA (capitalismo) e URSS (socialismo)." },
          { enunciado: "O conflito israelense-palestino está relacionado principalmente a:", opcoes: ["Disputas comerciais", "Questões territoriais, religiosas e históricas", "Recursos minerais apenas", "Disputas esportivas"], correta: 1, explicacao: "O conflito envolve disputa territorial pela região da Palestina, agravada por questões religiosas e históricas." },
          { enunciado: "Os BRICS são:", opcoes: ["Países da Europa", "Grupo de economias emergentes (Brasil, Rússia, Índia, China, África do Sul e outros)", "Organizações militares", "Empresas de tecnologia"], correta: 1, explicacao: "Os BRICS reúnem grandes economias emergentes que buscam maior representatividade no cenário global." }
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
        explicacao: "Ecologia estuda as relações entre seres vivos e o ambiente. Conceitos como cadeia alimentar, ciclos biogeoquímicos, biomas e relações ecológicas são fundamentais. Questões sobre impacto ambiental são muito frequentes no ENEM.",
        questoes: [
          { enunciado: "Os decompositores são responsáveis por:", opcoes: ["Produzir energia pela fotossíntese", "Caçar outros animais", "Decompor matéria orgânica e reciclar nutrientes", "Consumir produtores"], correta: 2, explicacao: "Decompositores (fungos e bactérias) degradam matéria orgânica, devolvendo nutrientes." },
          { enunciado: "A biomagnificação é:", opcoes: ["Aumento da biodiversidade", "Acúmulo de substâncias tóxicas ao longo da cadeia alimentar", "Crescimento de organismos", "Fotossíntese em grande escala"], correta: 1, explicacao: "Substâncias tóxicas se acumulam em concentrações crescentes nos níveis tróficos superiores." },
          { enunciado: "O Cerrado é caracterizado por:", opcoes: ["Vegetação densa e úmida", "Árvores retorcidas e clima com duas estações definidas", "Baixas temperaturas", "Solo extremamente fértil"], correta: 1, explicacao: "O Cerrado possui árvores de troncos retorcidos, raízes profundas e duas estações bem definidas." }
        ]
      },
      {
        titulo: "Genética",
        explicacao: "A genética estuda a hereditariedade e variação dos organismos. Genes, alelos, genótipo, fenótipo e as Leis de Mendel são fundamentais. No ENEM, questões envolvem cruzamentos, heredogramas e biotecnologia.",
        questoes: [
          { enunciado: "Pais heterozigotos (Aa): probabilidade de filho aa?", opcoes: ["0%", "25%", "50%", "75%"], correta: 1, explicacao: "Aa × Aa: AA(25%), Aa(50%), aa(25%). Probabilidade de aa = 25%." },
          { enunciado: "O DNA é formado por:", opcoes: ["Aminoácidos", "Nucleotídeos", "Lipídeos", "Carboidratos"], correta: 1, explicacao: "O DNA é um polímero de nucleotídeos (base nitrogenada + desoxirribose + fosfato)." },
          { enunciado: "A 1ª Lei de Mendel afirma que:", opcoes: ["Os genes se fundem", "Cada caráter é determinado por dois fatores que se separam nos gametas", "Todos os genes são dominantes", "A herança é sempre ligada ao sexo"], correta: 1, explicacao: "Cada caráter é determinado por um par de alelos que se segregam na formação dos gametas." }
        ]
      },
      {
        titulo: "Fisiologia Humana",
        explicacao: "A fisiologia humana estuda o funcionamento dos sistemas do corpo. No ENEM, os sistemas circulatório, respiratório, digestório, nervoso e endócrino são os mais cobrados, além de questões sobre saúde pública e doenças.",
        questoes: [
          { enunciado: "A principal função dos glóbulos vermelhos (hemácias) é:", opcoes: ["Combater infecções", "Transportar oxigênio", "Produzir hormônios", "Digerir alimentos"], correta: 1, explicacao: "As hemácias transportam oxigênio dos pulmões para os tecidos através da hemoglobina." },
          { enunciado: "A insulina é produzida pelo:", opcoes: ["Fígado", "Pâncreas", "Estômago", "Rim"], correta: 1, explicacao: "A insulina é produzida pelas células beta do pâncreas e regula os níveis de glicose no sangue." },
          { enunciado: "A sinapse é:", opcoes: ["Uma célula muscular", "A junção entre dois neurônios para transmissão de impulso nervoso", "Um tipo de hormônio", "Uma glândula"], correta: 1, explicacao: "A sinapse é a região de comunicação entre neurônios, onde neurotransmissores transmitem o impulso nervoso." }
        ]
      },
      {
        titulo: "Evolução",
        explicacao: "A teoria da evolução, proposta por Darwin, explica a diversidade dos seres vivos pela seleção natural. Organismos mais adaptados ao ambiente têm maior chance de sobreviver e se reproduzir, transmitindo suas características à prole.",
        questoes: [
          { enunciado: "A seleção natural foi proposta por:", opcoes: ["Lamarck", "Mendel", "Darwin", "Pasteur"], correta: 2, explicacao: "Charles Darwin propôs a seleção natural como mecanismo principal da evolução em 'A Origem das Espécies' (1859)." },
          { enunciado: "Segundo Lamarck, as girafas têm pescoços longos porque:", opcoes: ["Nasceram assim por mutação", "O uso contínuo esticou o pescoço e essa característica foi herdada", "Foram selecionadas naturalmente", "Se alimentaram de arbustos baixos"], correta: 1, explicacao: "Lamarck propôs a 'lei do uso e desuso' e a 'herança dos caracteres adquiridos', ambas refutadas pela genética moderna." },
          { enunciado: "Especiação é:", opcoes: ["Extinção de uma espécie", "Processo de formação de novas espécies", "Clonagem de organismos", "Migração de animais"], correta: 1, explicacao: "Especiação é o processo evolutivo pelo qual novas espécies surgem, geralmente por isolamento geográfico ou reprodutivo." }
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
        explicacao: "Estequiometria calcula quantidades de reagentes e produtos em reações. Baseia-se no balanceamento e relações molares. Essencial conhecer massa molar e o conceito de mol (6,02 × 10²³).",
        questoes: [
          { enunciado: "Na reação 2H₂ + O₂ → 2H₂O, quantos mols de água a partir de 4 mols de H₂?", opcoes: ["2 mols", "4 mols", "6 mols", "8 mols"], correta: 1, explicacao: "2 mols H₂ → 2 mols H₂O, então 4 mols H₂ → 4 mols H₂O." },
          { enunciado: "A massa molar da água (H₂O) é:", opcoes: ["16 g/mol", "18 g/mol", "20 g/mol", "32 g/mol"], correta: 1, explicacao: "H₂O: 2×1 + 16 = 18 g/mol." },
          { enunciado: "Um mol contém quantas entidades?", opcoes: ["6,02 × 10²⁰", "6,02 × 10²³", "3,01 × 10²³", "1,00 × 10²⁴"], correta: 1, explicacao: "Número de Avogadro = 6,02 × 10²³." }
        ]
      },
      {
        titulo: "Reações Químicas",
        explicacao: "Reações químicas alteram a composição das substâncias. Tipos: síntese, decomposição, simples troca e dupla troca. Sinais incluem mudança de cor, liberação de gás, precipitado e variação de temperatura.",
        questoes: [
          { enunciado: "A reação A + B → AB é:", opcoes: ["Decomposição", "Síntese (adição)", "Simples troca", "Dupla troca"], correta: 1, explicacao: "Duas substâncias se combinam em uma: reação de síntese." },
          { enunciado: "Balancear uma equação serve para:", opcoes: ["Aumentar a velocidade", "Garantir a conservação da massa (Lavoisier)", "Mudar os produtos", "Alterar estados físicos"], correta: 1, explicacao: "Garante que a quantidade de átomos seja igual nos dois lados (Lei de Lavoisier)." },
          { enunciado: "Uma reação exotérmica:", opcoes: ["Absorve calor", "Libera calor para o ambiente", "Não envolve calor", "Ocorre só em baixas temperaturas"], correta: 1, explicacao: "Reações exotérmicas liberam energia como calor, ex: combustão." }
        ]
      },
      {
        titulo: "Tabela Periódica",
        explicacao: "A tabela periódica organiza os elementos químicos por número atômico crescente. Elementos do mesmo grupo têm propriedades semelhantes. Propriedades periódicas importantes: eletronegatividade, raio atômico e energia de ionização.",
        questoes: [
          { enunciado: "Elementos do mesmo grupo da tabela periódica possuem:", opcoes: ["Mesmo número de prótons", "Mesmo número de elétrons na camada de valência", "Mesma massa atômica", "Mesmo raio atômico"], correta: 1, explicacao: "Elementos do mesmo grupo (coluna) possuem o mesmo número de elétrons na camada de valência, conferindo propriedades químicas semelhantes." },
          { enunciado: "Os gases nobres são caracterizados por:", opcoes: ["Alta reatividade", "Camada de valência completa e baixa reatividade", "Serem todos metais", "Terem apenas 1 elétron"], correta: 1, explicacao: "Os gases nobres têm a camada de valência completa (8 elétrons, exceto He com 2), o que os torna muito estáveis." },
          { enunciado: "A eletronegatividade aumenta na tabela periódica:", opcoes: ["De cima para baixo e da esquerda para a direita", "De baixo para cima e da direita para a esquerda", "De baixo para cima e da esquerda para a direita", "De cima para baixo e da direita para a esquerda"], correta: 2, explicacao: "A eletronegatividade aumenta de baixo para cima e da esquerda para a direita (excluindo gases nobres)." }
        ]
      },
      {
        titulo: "Ligações Químicas",
        explicacao: "Ligações químicas unem átomos para formar substâncias. Existem três tipos principais: iônica (metal + não metal, transferência de elétrons), covalente (não metal + não metal, compartilhamento de elétrons) e metálica (entre metais, elétrons livres).",
        questoes: [
          { enunciado: "A ligação entre Na e Cl no NaCl é do tipo:", opcoes: ["Covalente", "Iônica", "Metálica", "Van der Waals"], correta: 1, explicacao: "NaCl é formado por ligação iônica: o Na (metal) transfere 1 elétron para o Cl (não metal)." },
          { enunciado: "Na molécula de H₂O, as ligações são:", opcoes: ["Iônicas", "Covalentes", "Metálicas", "Nenhuma das anteriores"], correta: 1, explicacao: "H e O são não metais, então compartilham elétrons formando ligações covalentes." },
          { enunciado: "A ligação metálica explica por que metais:", opcoes: ["São gases em temperatura ambiente", "Conduzem eletricidade e calor", "São frágeis", "Não brilham"], correta: 1, explicacao: "Na ligação metálica, elétrons livres permitem a condução de eletricidade e calor, além do brilho metálico." }
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
        explicacao: "Cinemática estuda o movimento sem considerar suas causas. Conceitos: posição, velocidade, aceleração. Tipos: MRU (velocidade constante) e MRUV (aceleração constante).",
        questoes: [
          { enunciado: "No MRU, a velocidade é:", opcoes: ["Variável", "Constante", "Sempre zero", "Sempre crescente"], correta: 1, explicacao: "No MRU a velocidade é constante e a aceleração é zero." },
          { enunciado: "100 km em 2 horas = velocidade de:", opcoes: ["200 km/h", "50 km/h", "100 km/h", "25 km/h"], correta: 1, explicacao: "v = d/t = 100/2 = 50 km/h." },
          { enunciado: "No MRUV, permanece constante:", opcoes: ["A velocidade", "A posição", "A aceleração", "O deslocamento"], correta: 2, explicacao: "No MRUV a aceleração é constante, a velocidade varia uniformemente." }
        ]
      },
      {
        titulo: "Eletricidade",
        explicacao: "Eletricidade estuda fenômenos de cargas elétricas. Temas mais cobrados: corrente elétrica, resistência, Lei de Ohm (V = R × i), potência (P = V × i) e circuitos em série e paralelo.",
        questoes: [
          { enunciado: "Tensão 12V e resistência 4Ω: a corrente é:", opcoes: ["2A", "3A", "4A", "48A"], correta: 1, explicacao: "i = V/R = 12/4 = 3A." },
          { enunciado: "Em um circuito em série, a corrente:", opcoes: ["É diferente em cada resistor", "É a mesma em todos os pontos", "É zero", "Dobra a cada resistor"], correta: 1, explicacao: "Em série há um único caminho: a corrente é a mesma em todos os componentes." },
          { enunciado: "A unidade de potência elétrica no SI é:", opcoes: ["Ampère", "Volt", "Watt", "Ohm"], correta: 2, explicacao: "Potência = Watt (W), onde P = V × i." }
        ]
      },
      {
        titulo: "Leis de Newton",
        explicacao: "As três leis de Newton descrevem o movimento dos corpos. 1ª Lei (Inércia): corpo em repouso ou MRU permanece assim sem força resultante. 2ª Lei: F = m × a. 3ª Lei (Ação e Reação): toda ação tem reação de igual intensidade e sentido oposto.",
        questoes: [
          { enunciado: "A 1ª Lei de Newton afirma que um corpo em repouso:", opcoes: ["Sempre se move", "Permanece em repouso se a resultante das forças for zero", "Precisa de força para parar", "Tem aceleração constante"], correta: 1, explicacao: "Um corpo em repouso ou MRU permanece nesse estado a menos que uma força resultante aja sobre ele (Inércia)." },
          { enunciado: "Pela 2ª Lei de Newton, uma força de 10N aplicada a uma massa de 2kg produz aceleração de:", opcoes: ["2 m/s²", "5 m/s²", "10 m/s²", "20 m/s²"], correta: 1, explicacao: "F = m × a → a = F/m = 10/2 = 5 m/s²." },
          { enunciado: "Quando você empurra a parede, ela:", opcoes: ["Não faz nada", "Empurra você com a mesma força, em sentido oposto (3ª Lei)", "Se move para frente", "Absorve a força"], correta: 1, explicacao: "3ª Lei de Newton: toda ação gera uma reação de mesma intensidade, mesma direção e sentido oposto." }
        ]
      },
      {
        titulo: "Termodinâmica",
        explicacao: "Termodinâmica estuda as relações entre calor, trabalho e energia. O calor flui de corpos mais quentes para mais frios até o equilíbrio térmico. A 1ª Lei relaciona energia interna, calor e trabalho. A 2ª Lei diz que o calor não flui espontaneamente do frio para o quente.",
        questoes: [
          { enunciado: "O calor flui espontaneamente:", opcoes: ["Do frio para o quente", "Do quente para o frio", "Em qualquer direção igualmente", "Apenas em sólidos"], correta: 1, explicacao: "O calor flui naturalmente do corpo de maior temperatura para o de menor até atingir equilíbrio térmico." },
          { enunciado: "A 1ª Lei da Termodinâmica é uma aplicação de:", opcoes: ["Lei de Ohm", "Conservação da energia", "Lei de Hooke", "Lei de Coulomb"], correta: 1, explicacao: "A 1ª Lei da Termodinâmica (ΔU = Q - W) é a conservação de energia aplicada a sistemas térmicos." },
          { enunciado: "Quanto calor é necessário para aquecer 500g de água de 20°C a 80°C? (c = 1 cal/g°C)", opcoes: ["3000 cal", "30000 cal", "300 cal", "60000 cal"], correta: 1, explicacao: "Q = m × c × ΔT = 500 × 1 × (80-20) = 500 × 60 = 30000 cal." }
        ]
      },
      {
        titulo: "Ondas e Óptica",
        explicacao: "Ondas são perturbações que transportam energia sem transportar matéria. Podem ser mecânicas (som) ou eletromagnéticas (luz). A óptica estuda fenômenos como reflexão, refração e difração da luz.",
        questoes: [
          { enunciado: "O som é uma onda:", opcoes: ["Eletromagnética", "Mecânica", "Transversal", "Que não precisa de meio"], correta: 1, explicacao: "O som é uma onda mecânica longitudinal que precisa de um meio material para se propagar." },
          { enunciado: "A refração da luz ocorre quando:", opcoes: ["A luz é absorvida", "A luz muda de meio e altera sua velocidade", "A luz é refletida", "A luz desaparece"], correta: 1, explicacao: "Na refração, a luz muda de meio (ex: ar para água), alterando sua velocidade e direção." },
          { enunciado: "A velocidade da luz no vácuo é aproximadamente:", opcoes: ["300 km/s", "3.000 km/s", "300.000 km/s", "3.000.000 km/s"], correta: 2, explicacao: "A velocidade da luz no vácuo é de aproximadamente 300.000 km/s (3 × 10⁸ m/s)." }
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
        titulo: "Estrutura da Redação",
        explicacao: "A redação do ENEM segue o modelo dissertativo-argumentativo: introdução (tema e tese), desenvolvimento (2 parágrafos com argumentos e repertório sociocultural) e conclusão (proposta de intervenção com agente, ação, meio, finalidade e detalhamento).",
        questoes: [
          { enunciado: "A proposta de intervenção deve conter:", opcoes: ["Apenas uma sugestão genérica", "Agente, ação, modo, finalidade e detalhamento", "Somente a opinião do autor", "Uma pergunta retórica"], correta: 1, explicacao: "Deve ser detalhada: quem vai fazer, o que, como, para quê e detalhamento adicional." },
          { enunciado: "Quantos parágrafos tem a estrutura ideal?", opcoes: ["3", "4", "5", "6"], correta: 2, explicacao: "5 parágrafos: 1 introdução, 2 desenvolvimento, 1 conclusão (padrão)." },
          { enunciado: "Repertório sociocultural se refere a:", opcoes: ["Copiar a coletânea", "Usar conhecimentos de outras áreas para fundamentar", "Contar histórias pessoais", "Usar gírias"], correta: 1, explicacao: "São referências externas (citações, dados, história, filosofia) para fundamentar argumentos." }
        ]
      },
      {
        titulo: "Competências da Redação",
        explicacao: "Avaliada em 5 competências: (1) norma culta, (2) compreensão do tema, (3) argumentação, (4) coesão textual e (5) proposta de intervenção. Cada uma vale até 200 pontos, totalizando 1000.",
        questoes: [
          { enunciado: "Qual competência avalia gramática e ortografia?", opcoes: ["Competência 2", "Competência 1", "Competência 4", "Competência 5"], correta: 1, explicacao: "Competência 1 avalia o domínio da modalidade escrita formal." },
          { enunciado: "A nota máxima da redação é:", opcoes: ["800", "900", "1000", "1200"], correta: 2, explicacao: "1000 pontos: 200 para cada uma das 5 competências." },
          { enunciado: "Fugir do tema resulta em:", opcoes: ["Perda de 100 pontos", "Nota 200", "Nota zero", "Desconto na Competência 2 apenas"], correta: 2, explicacao: "Fuga total ao tema é uma das situações que zeram a redação." }
        ]
      },
      {
        titulo: "Conectivos e Coesão",
        explicacao: "Conectivos são palavras ou expressões que ligam ideias e parágrafos, garantindo a fluidez do texto. São essenciais para a Competência 4. Exemplos: 'além disso', 'portanto', 'no entanto', 'em virtude de', 'diante disso'.",
        questoes: [
          { enunciado: "\"No entanto\" é um conectivo de:", opcoes: ["Adição", "Oposição/adversidade", "Conclusão", "Causa"], correta: 1, explicacao: "\"No entanto\" expressa oposição, introduzindo uma ideia contrária à anterior (conectivo adversativo)." },
          { enunciado: "\"Portanto\" é usado para:", opcoes: ["Adicionar uma ideia", "Expressar oposição", "Introduzir uma conclusão", "Dar um exemplo"], correta: 2, explicacao: "\"Portanto\" é um conectivo conclusivo, usado para fechar um raciocínio lógico." },
          { enunciado: "A coesão textual é avaliada em qual competência?", opcoes: ["Competência 1", "Competência 2", "Competência 3", "Competência 4"], correta: 3, explicacao: "A Competência 4 avalia o uso de mecanismos linguísticos de coesão (conectivos, pronomes, sinônimos)." }
        ]
      },
      {
        titulo: "Temas Recorrentes",
        explicacao: "O ENEM costuma abordar temas sociais relevantes: saúde mental, violência, tecnologia, meio ambiente, educação, direitos de minorias e desigualdade. Ter repertório sobre esses assuntos é fundamental para uma boa nota.",
        questoes: [
          { enunciado: "O tema da redação do ENEM é geralmente sobre:", opcoes: ["Assuntos de ficção", "Questões sociais relevantes do Brasil", "Temas pessoais do candidato", "Problemas matemáticos"], correta: 1, explicacao: "O ENEM escolhe temas de relevância social no contexto brasileiro, exigindo posicionamento crítico." },
          { enunciado: "Ao elaborar a proposta de intervenção, é importante:", opcoes: ["Ser vago e genérico", "Propor ações detalhadas e viáveis", "Culpar indivíduos específicos", "Copiar propostas de outros textos"], correta: 1, explicacao: "A proposta deve ser detalhada, viável e respeitar os direitos humanos, com agente, ação, meio e finalidade claros." },
          { enunciado: "Citar filósofos ou dados em sua argumentação é exemplo de:", opcoes: ["Fuga ao tema", "Repertório sociocultural legitimado", "Cópia", "Senso comum"], correta: 1, explicacao: "Referências a filósofos, sociólogos, dados estatísticos e fatos históricos constituem repertório sociocultural legitimado." }
        ]
      }
    ]
  }
];

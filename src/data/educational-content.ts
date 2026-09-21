export interface EducationalSection {
  id: string
  title: string
  content: string[]
  source?: string
}

export interface EducationalPage {
  slug: string
  title: string
  description: string
  sections: EducationalSection[]
}

export const educationalPages: EducationalPage[] = [
  {
    slug: 'antes-de-adotar',
    title: 'Antes de adotar',
    description: 'O que considerar antes de trazer um animal para casa.',
    sections: [
      {
        id: 'compromisso',
        title: 'Um compromisso de longo prazo',
        content: [
          'Cães e gatos podem viver entre 10 e 15 anos. Adotar é assumir a responsabilidade por um ser vivo durante todo esse período.',
          'Antes de adotar, avalie se você tem espaço adequado, orçamento para alimentação e cuidados veterinários, e se todos os membros da família concordam com a adoção.',
        ],
      },
      {
        id: 'custos',
        title: 'Custos mensais estimados',
        content: [
          'Alimentação: ração de qualidade para a fase do animal (filhote, adulto ou idoso).',
          'Vacinação anual: polivalente e antirrábica.',
          'Vermifugação: a cada 4 a 6 meses.',
          'Prevenção de pulgas e carrapatos: coleiras, comprimidos ou pipetas.',
          'Consulta veterinária: pelo menos uma vez por ano.',
          'Castração: se o animal ainda não for castrado.',
        ],
        source: 'CRMV-SP — Guarda Responsável',
      },
      {
        id: 'espaco',
        title: 'Espaço e adaptação',
        content: [
          'Cães de pequeno porte se adaptam melhor a apartamentos. Gatos se adaptam a qualquer ambiente, mas precisam de telas em janelas e sacadas.',
          'Nunca mantenha o animal preso permanentemente em correntes ou em locais pequenos.',
          'Ofereça um local abrigado do sol, chuva e frio, distante do local onde o animal faz suas necessidades.',
        ],
        source: 'Prefeitura de Belo Horizonte — Programa Saúde do Animal',
      },
    ],
  },
  {
    slug: 'cuidados-basicos',
    title: 'Cuidados básicos',
    description: 'Alimentação, higiene, vacinação e castração.',
    sections: [
      {
        id: 'alimentacao',
        title: 'Alimentação',
        content: [
          'Água fresca e limpa deve estar sempre disponível.',
          'Há rações específicas para cada fase da vida: filhotes, adultos e idosos.',
          'Filhotes até 9 meses devem receber ração específica para filhotes.',
          'Adultos devem ser alimentados duas vezes ao dia.',
          'NUNCA dê ao animal: chocolate (tóxico para cães e gatos), uvas (causam insuficiência renal em cães), cebola (causa anemia), ossos de galinha (podem perfurar órgãos), alimentos gordurosos, pães ou doces.',
        ],
        source: 'CRMV-SP — Guarda Responsável',
      },
      {
        id: 'vacinas',
        title: 'Vacinação',
        content: [
          'Cães: protocolo de vacinação polivalente (V4, V8, V10, V12) deve iniciar a partir de 6 semanas de idade, com reforços até 16 semanas. Revacinação anual.',
          'Gatos: vacina tríplice, quádrupla ou quíntupla felina. Protocolo inicia a partir de 6 semanas, com duas doses com intervalo de 3 a 4 semanas. Revacinação anual.',
          'Antirrábica: a partir dos 3 meses de idade, para cães e gatos. Reforço anual.',
          'A vacinação previne doenças graves e potencialmente fatais, além de zoonoses (doenças transmitidas para humanos).',
        ],
        source: 'CRMV-SP — Guarda Responsável',
      },
      {
        id: 'castracao',
        title: 'Castração',
        content: [
          'A castração é o método mais eficiente para controle populacional de cães e gatos.',
          'Pode ser realizada a partir de 4 meses de idade.',
          'Benefícios: reduz o comportamento de marcação de território, elimina cio e sangramento em fêmeas, reduz fuga em busca de parceiros, diminui brigas com outros animais.',
          'Prevenção de doenças: câncer de testículo e próstata (machos), câncer de mama e ovário, infecções uterinas e gravidez psicológica (fêmeas).',
          'Aumenta a longevidade e melhora a qualidade de vida do animal.',
        ],
        source: 'Save Brasil — Guarda Responsável',
      },
      {
        id: 'higiene',
        title: 'Higiene',
        content: [
          'Cães: banho a cada 15 dias com produtos veterinários aprovados.',
          'Gatos: não precisam tomar banho, exceto quando houver recomendação veterinária. São animais limpos por natureza.',
          'Escovação frequente é o mais indicado para manter a pelagem saudável.',
          'Mantenha o ambiente limpo: recolha as fezes, lave comedouros e bebedouros diariamente.',
          'Cães e gatos também precisam de cuidados dentários com produtos veterinários específicos.',
        ],
        source: 'Polícia Civil de Porto Alegre — Portal Pet',
      },
    ],
  },
  {
    slug: 'leis-e-direitos',
    title: 'Leis e direitos',
    description: 'Legislação brasileira de proteção animal.',
    sections: [
      {
        id: 'constituicao',
        title: 'Constituição Federal',
        content: [
          'Art. 225, §1º, VII: é dever do Poder Público e da coletividade proteger a fauna, vedando práticas que submetam os animais à crueldade.',
        ],
      },
      {
        id: 'lei-crimes-ambientais',
        title: 'Lei de Crimes Ambientais (Lei nº 9.605/1998)',
        content: [
          'Art. 32: praticar ato de abuso, maus-tratos, ferir ou mutilar animais silvestres, domésticos ou domesticados, nativos ou exóticos.',
          'Pena: detenção de 3 meses a 1 ano, e multa.',
          'Para cães e gatos: a Lei nº 14.064/2020 (Lei Sansão) elevou a pena para reclusão de 2 a 5 anos, multa e proibição da guarda.',
          'Se houver morte do animal, a pena é aumentada de um sexto a um terço.',
        ],
      },
      {
        id: 'estatuto',
        title: 'Estatuto dos Cães e Gatos (PL 6.191/2025)',
        content: [
          'Define cães e gatos como seres vivos sencientes e passíveis de proteção jurídica própria.',
          'Adoção responsável: adotante deve ter mais de 18 anos, não ter antecedentes por maus-tratos e ter condições financeiras.',
          'Proíbe abandono, agressões, mutilações estéticas, uso em rinhas e confinamento inadequado.',
          'Pena de 6 meses a 10 anos de reclusão para quem matar ou torturar cães ou gatos.',
          'Indenizações por dano existencial animal: entre R$ 3.500,00 e R$ 14.000,00.',
          'Infrator reincidente fica proibido de manter ou adquirir animais por 10 anos.',
        ],
        source: 'Senado Federal — PL 6.191/2025',
      },
    ],
  },
  {
    slug: 'adocao-responsavel',
    title: 'Adoção responsável',
    description: 'Como funciona o processo de adoção.',
    sections: [
      {
        id: 'processo',
        title: 'O processo de adoção',
        content: [
          'Pesquise ONGs parceiras e conheça os animais disponíveis.',
          'Visite a ONG para conhecer o animal pessoalmente.',
          'Preencha o formulário de interesse da ONG.',
          'Aguarde o contato da ONG para prosseguir com a adoção.',
          'Após a aprovação, assine o termo de adoção responsável.',
        ],
      },
      {
        id: 'requisitos',
        title: 'Requisitos para adotar',
        content: [
          'Ser maior de 18 anos.',
          'Ter condições financeiras para assumir os gastos com manutenção do animal.',
          'Não ter antecedentes criminais envolvendo maus-tratos contra animais ou violência doméstica.',
          'Ter domicílio certo.',
          'O animal adotado deve ser castrado, vacinado e vermifugado antes da entrega (conforme exigido pelas ONGs parceiras).',
        ],
      },
      {
        id: 'pos-adocao',
        title: 'Após a adoção',
        content: [
          'Prepare o ambiente: local de descanso, comedouros, bebedouros, caixa de transporte.',
          'Mantenha o animal dentro de casa ou quintal protegido. Nunca solto na rua.',
          'Leve ao veterinário regularmente para manter vacinas e vermifugação em dia.',
          'Faça passeios diários com coleira e guia (cães).',
          'Proporcione interação social: familiarize o animal com membros da família e outros animais.',
        ],
      },
    ],
  },
  {
    slug: 'como-denunciar',
    title: 'Como denunciar',
    description: 'Canais de denúncia para casos de maus-tratos.',
    sections: [
      {
        id: 'canais',
        title: 'Canais de denúncia',
        content: [
          'Polícia Militar do Meio Ambiente.',
          'Delegacia de Polícia Civil.',
          'Ministério Público.',
          'Disque Denúncia Animal (SP e Grande SP): 0800 600 6428.',
          'IBAMA — Animais Silvestres: 0800 618 080.',
          'Em caso de maus-tratos, denuncie. É crime previsto em lei.',
        ],
      },
      {
        id: 'o-que-denunciar',
        title: 'O que denunciar',
        content: [
          'Abandono de animais.',
          'Maus-tratos: agressões, tortura, envenenamento.',
          'Animais em condições inadequadas: sem alimento, água, abrigo ou assistência veterinária.',
          'Mutilações estéticas (corte de orelha, cauda, etc.).',
          'Rinhas de cães.',
          'Comercialização clandestina.',
        ],
      },
    ],
  },
]

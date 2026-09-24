import type { Organization } from '@/types'

export const DEMO_CAMPINAS_ORG_ID = 'demo-portal-animal-campinas'

export const demoOrganizations: Organization[] = [
  {
    id: DEMO_CAMPINAS_ORG_ID,
    organizationId: DEMO_CAMPINAS_ORG_ID,
    userId: 'demo-user',
    name: 'Departamento de Proteção e Bem-Estar Animal (DPBEA)',
    description:
      'Departamento de Proteção e Bem-Estar Animal da Prefeitura Municipal de Campinas. Órgão público responsável pela guarda, cuidados veterinários e adoção responsável de cães e gatos resgatados na cidade.\n\nPara adotar, acesse o Portal Animal, escolha o animal desejado, clique em "Quero Adotar" e aguarde o contato da equipe do DPBEA.',
    city: 'Campinas',
    state: 'SP',
    phone: '',
    email: 'bemestar.animal@campinas.sp.gov.br',
    website: 'https://portalanimal.campinas.sp.gov.br/adocao',
    logoUrl:
      'https://thumb.wikimedia.org/wikipedia/commons/thumb/a/a8/Bras%C3%A3o_de_Campinas_-_SP.svg/500px-Bras%C3%A3o_de_Campinas_-_SP.svg.png',
  },
]
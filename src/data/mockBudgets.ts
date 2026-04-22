import { Budget } from '../types/budget';

export const mockBudgets: Budget[] = [
  {
    id: 'orc-1',
    title: 'Desenvolvimento de aplicativo de loja online',
    client: 'Solucoes Tecnologicas Beta',
    status: 'aprovado',
    discountPercent: 5,
    createdAt: '2026-04-22T09:00:00.000Z',
    updatedAt: '2026-04-22T11:30:00.000Z',
    services: [
      {
        id: 's-1',
        name: 'Design de interfaces',
        description: 'Criacao de wireframes e prototipos de alta fidelidade',
        unitPrice: 3847.5,
        quantity: 1,
      },
      {
        id: 's-2',
        name: 'Desenvolvimento front-end',
        description: 'Criacao de interfaces interativas',
        unitPrice: 3847.5,
        quantity: 1,
      },
    ],
  },
  {
    id: 'orc-2',
    title: 'Consultoria em marketing digital',
    client: 'Marketing Wizards',
    status: 'rascunho',
    discountPercent: 0,
    createdAt: '2026-04-20T14:00:00.000Z',
    updatedAt: '2026-04-20T14:00:00.000Z',
    services: [
      {
        id: 's-3',
        name: 'Plano de campanhas',
        unitPrice: 4000,
        quantity: 1,
      },
    ],
  },
  {
    id: 'orc-3',
    title: 'Servicos de SEO',
    client: 'SEO Masters',
    status: 'enviado',
    discountPercent: 0,
    createdAt: '2026-04-21T08:15:00.000Z',
    updatedAt: '2026-04-21T10:15:00.000Z',
    services: [
      {
        id: 's-4',
        name: 'Analise tecnica',
        unitPrice: 1500,
        quantity: 1,
      },
      {
        id: 's-5',
        name: 'Plano de conteudo',
        unitPrice: 2000,
        quantity: 1,
      },
    ],
  },
  {
    id: 'orc-4',
    title: 'Gestao de redes sociais',
    client: 'Social Experts',
    status: 'recusado',
    discountPercent: 10,
    createdAt: '2026-04-19T11:45:00.000Z',
    updatedAt: '2026-04-19T17:45:00.000Z',
    services: [
      {
        id: 's-6',
        name: 'Calendario editorial',
        unitPrice: 1800,
        quantity: 1,
      },
    ],
  },
];

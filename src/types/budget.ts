export type BudgetStatus = 'rascunho' | 'enviado' | 'aprovado' | 'recusado';

export type BudgetSort = 'mais-recente' | 'mais-antigo' | 'maior-valor' | 'menor-valor';

export interface ServiceItem {
  id: string;
  name: string;
  description?: string;
  unitPrice: number;
  quantity: number;
}

export interface Budget {
  id: string;
  title: string;
  client: string;
  status: BudgetStatus;
  services: ServiceItem[];
  discountPercent?: number;
  createdAt: string;
  updatedAt: string;
}

import { Budget, BudgetSort, BudgetStatus, ServiceItem } from '../types/budget';

const statusOrder: Record<BudgetStatus, number> = {
  rascunho: 0,
  enviado: 1,
  aprovado: 2,
  recusado: 3,
};

export const getServiceTotal = (service: ServiceItem): number => {
  return service.unitPrice * service.quantity;
};

export const getBudgetSubtotal = (budget: Budget): number => {
  return budget.services.reduce((total, service) => total + getServiceTotal(service), 0);
};

export const getDiscountValue = (budget: Budget): number => {
  const subtotal = getBudgetSubtotal(budget);
  const discountPercent = budget.discountPercent ?? 0;
  return subtotal * (discountPercent / 100);
};

export const getBudgetTotal = (budget: Budget): number => {
  return getBudgetSubtotal(budget) - getDiscountValue(budget);
};

export const filterAndSortBudgets = (
  budgets: Budget[],
  search: string,
  selectedStatuses: BudgetStatus[],
  sortBy: BudgetSort
): Budget[] => {
  const searchValue = search.trim().toLowerCase();

  const filtered = budgets.filter((budget) => {
    const matchesSearch =
      budget.title.toLowerCase().includes(searchValue) ||
      budget.client.toLowerCase().includes(searchValue);

    const matchesStatus =
      selectedStatuses.length === 0 || selectedStatuses.includes(budget.status);

    return matchesSearch && matchesStatus;
  });

  return filtered.sort((a, b) => {
    if (sortBy === 'mais-recente') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }

    if (sortBy === 'mais-antigo') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    }

    if (sortBy === 'maior-valor') {
      return getBudgetTotal(b) - getBudgetTotal(a);
    }

    if (sortBy === 'menor-valor') {
      return getBudgetTotal(a) - getBudgetTotal(b);
    }

    return statusOrder[a.status] - statusOrder[b.status];
  });
};

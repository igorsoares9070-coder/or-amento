import { StatusBar } from 'expo-status-bar';
import { useMemo, useState } from 'react';
import { BudgetFormScreen } from './src/screens/BudgetFormScreen';
import { BudgetListScreen } from './src/screens/BudgetListScreen';
import { mockBudgets } from './src/data/mockBudgets';
import { Budget } from './src/types/budget';

type AppRoute =
  | { name: 'list' }
  | { name: 'form'; mode: 'create' | 'edit'; budgetId: string };

const createEmptyBudget = (): Budget => {
  const now = new Date().toISOString();

  return {
    id: `orc-${Date.now()}`,
    title: '',
    client: '',
    status: 'rascunho',
    services: [],
    discountPercent: 0,
    createdAt: now,
    updatedAt: now,
  };
};

export default function App() {
  const [budgets, setBudgets] = useState<Budget[]>(mockBudgets);
  const [draftBudget, setDraftBudget] = useState<Budget | null>(null);
  const [route, setRoute] = useState<AppRoute>({ name: 'list' });

  const selectedBudget = useMemo(() => {
    if (route.name !== 'form') {
      return null;
    }

    if (route.mode === 'create') {
      return draftBudget;
    }

    return budgets.find((item) => item.id === route.budgetId) ?? null;
  }, [route, budgets, draftBudget]);

  if (route.name === 'form' && selectedBudget) {
    return (
      <>
        <StatusBar style="dark" />
        <BudgetFormScreen
          budget={selectedBudget}
          isEditing={route.mode === 'edit'}
          onBack={() => {
            setRoute({ name: 'list' });
            setDraftBudget(null);
          }}
          onSave={(nextBudget) => {
            setBudgets((current) => {
              const exists = current.some((item) => item.id === nextBudget.id);

              if (exists) {
                return current.map((item) =>
                  item.id === nextBudget.id ? nextBudget : item
                );
              }

              return [nextBudget, ...current];
            });

            setRoute({ name: 'list' });
            setDraftBudget(null);
          }}
        />
      </>
    );
  }

  return (
    <>
      <StatusBar style="dark" />
      <BudgetListScreen
        budgets={budgets}
        onCreate={() => {
          const emptyBudget = createEmptyBudget();
          setDraftBudget(emptyBudget);
          setRoute({ name: 'form', mode: 'create', budgetId: emptyBudget.id });
        }}
        onEdit={(budgetId) => {
          setRoute({ name: 'form', mode: 'edit', budgetId });
        }}
        onDuplicate={(budgetId) => {
          setBudgets((current) => {
            const source = current.find((item) => item.id === budgetId);
            if (!source) {
              return current;
            }

            const duplicated: Budget = {
              ...source,
              id: `orc-${Date.now()}`,
              title: `${source.title} (copia)`,
              status: 'rascunho',
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              services: source.services.map((service) => ({
                ...service,
                id: `srv-${Date.now()}-${service.id}`,
              })),
            };

            return [duplicated, ...current];
          });
        }}
        onDelete={(budgetId) => {
          setBudgets((current) => current.filter((item) => item.id !== budgetId));
        }}
      />
    </>
  );
}

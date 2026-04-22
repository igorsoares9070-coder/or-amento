import { BudgetStatus } from '../types/budget';
import { colors } from '../theme/colors';

export const statusLabelMap: Record<BudgetStatus, string> = {
  rascunho: 'Rascunho',
  enviado: 'Enviado',
  aprovado: 'Aprovado',
  recusado: 'Recusado',
};

export const statusColorMap: Record<
  BudgetStatus,
  { background: string; text: string }
> = {
  rascunho: { background: colors.draftSoft, text: colors.draft },
  enviado: { background: colors.warningSoft, text: colors.warning },
  aprovado: { background: colors.successSoft, text: colors.success },
  recusado: { background: colors.dangerSoft, text: colors.danger },
};

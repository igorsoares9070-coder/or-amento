import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { Budget } from '../types/budget';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';
import { formatCurrency } from '../utils/money';
import { getBudgetTotal } from '../utils/budget';
import { StatusBadge } from './StatusBadge';

interface BudgetCardProps {
  budget: Budget;
  onEdit: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function BudgetCard({ budget, onEdit, onDuplicate, onDelete }: BudgetCardProps) {
  return (
    <Pressable style={styles.card} onPress={onEdit}>
      <View style={styles.topRow}>
        <Text style={styles.title}>{budget.title}</Text>
        <StatusBadge status={budget.status} />
      </View>

      <Text style={styles.client}>{budget.client}</Text>

      <View style={styles.bottomRow}>
        <Text style={styles.total}>{formatCurrency(getBudgetTotal(budget))}</Text>

        <View style={styles.actions}>
          <Pressable onPress={onDuplicate} style={styles.actionButton}>
            <Feather name="copy" size={14} color={colors.purple} />
          </Pressable>
          <Pressable onPress={onDelete} style={styles.actionButton}>
            <Feather name="trash-2" size={14} color={colors.danger} />
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.xs,
  },
  topRow: {
    flexDirection: 'row',
    gap: spacing.sm,
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  title: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  client: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: spacing.xs,
  },
  total: {
    color: colors.textPrimary,
    fontSize: 16,
    fontWeight: '700',
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.xs,
  },
  actionButton: {
    width: 30,
    height: 30,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.panel,
  },
});

import { StyleSheet, Text, View } from 'react-native';
import { statusColorMap, statusLabelMap } from '../constants/status';
import { BudgetStatus } from '../types/budget';
import { radius, spacing } from '../theme/spacing';

interface StatusBadgeProps {
  status: BudgetStatus;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const colors = statusColorMap[status];

  return (
    <View style={[styles.badge, { backgroundColor: colors.background }]}> 
      <View style={[styles.dot, { backgroundColor: colors.text }]} />
      <Text style={[styles.text, { color: colors.text }]}>{statusLabelMap[status]}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: radius.pill,
    height: 24,
    paddingHorizontal: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: radius.pill,
  },
  text: {
    fontSize: 12,
    fontWeight: '700',
  },
});

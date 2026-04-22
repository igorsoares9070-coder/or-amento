import { Feather } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';
import { ServiceItem } from '../types/budget';
import { formatCurrency } from '../utils/money';
import { getServiceTotal } from '../utils/budget';

interface ServiceItemRowProps {
  item: ServiceItem;
  onEdit: () => void;
  onRemove: () => void;
}

export function ServiceItemRow({ item, onEdit, onRemove }: ServiceItemRowProps) {
  return (
    <View style={styles.row}>
      <View style={styles.infoBlock}>
        <Text style={styles.name}>{item.name}</Text>
        {item.description ? <Text style={styles.description}>{item.description}</Text> : null}
      </View>

      <View style={styles.amountBlock}>
        <Text style={styles.price}>{formatCurrency(getServiceTotal(item))}</Text>
        <Text style={styles.qty}>Qt: {item.quantity}</Text>
      </View>

      <View style={styles.actions}>
        <Pressable onPress={onEdit} style={styles.actionButton}>
          <Feather name="edit-2" size={14} color={colors.purple} />
        </Pressable>
        <Pressable onPress={onRemove} style={styles.actionButton}>
          <Feather name="trash-2" size={14} color={colors.danger} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.sm,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  infoBlock: {
    flex: 1,
    gap: spacing.xxs,
  },
  name: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  description: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  amountBlock: {
    alignItems: 'flex-end',
    minWidth: 88,
  },
  price: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  qty: {
    color: colors.textSecondary,
    fontSize: 12,
  },
  actions: {
    gap: spacing.xs,
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: radius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.purpleSoft,
  },
});

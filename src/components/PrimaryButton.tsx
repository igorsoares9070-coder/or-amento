import { ReactNode } from 'react';
import { Pressable, StyleSheet, Text, TextStyle, ViewStyle } from 'react-native';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';

type Variant = 'primary' | 'secondary' | 'danger';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  icon?: ReactNode;
  variant?: Variant;
  disabled?: boolean;
  style?: ViewStyle;
}

export function PrimaryButton({
  label,
  onPress,
  icon,
  variant = 'primary',
  disabled,
  style,
}: PrimaryButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        variantStyles[variant],
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
        style,
      ]}
    >
      {icon}
      <Text style={[styles.label, textVariantStyles[variant]]}>{label}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    height: 42,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.xs,
    paddingHorizontal: spacing.md,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    transform: [{ scale: 0.99 }],
  },
});

const variantStyles: Record<Variant, ViewStyle> = {
  primary: {
    backgroundColor: colors.purple,
  },
  secondary: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  danger: {
    backgroundColor: colors.dangerSoft,
    borderWidth: 1,
    borderColor: colors.danger,
  },
};

const textVariantStyles: Record<Variant, TextStyle> = {
  primary: {
    color: '#FFFFFF',
  },
  secondary: {
    color: colors.purple,
  },
  danger: {
    color: colors.danger,
  },
};

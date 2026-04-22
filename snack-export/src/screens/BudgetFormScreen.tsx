import { Feather } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { AppInput } from '../components/AppInput';
import { ConfirmModal } from '../components/ConfirmModal';
import { PrimaryButton } from '../components/PrimaryButton';
import { ServiceItemRow } from '../components/ServiceItemRow';
import { statusLabelMap } from '../constants/status';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';
import { Budget, BudgetStatus, ServiceItem } from '../types/budget';
import { getBudgetSubtotal, getBudgetTotal } from '../utils/budget';
import { formatCurrency } from '../utils/money';

interface BudgetFormScreenProps {
  budget: Budget;
  isEditing: boolean;
  onBack: () => void;
  onSave: (budget: Budget) => void;
}

const statusOptions: BudgetStatus[] = ['rascunho', 'enviado', 'aprovado', 'recusado'];

interface ServiceDraft {
  id?: string;
  name: string;
  description: string;
  unitPrice: string;
  quantity: string;
}

export function BudgetFormScreen({
  budget,
  isEditing,
  onBack,
  onSave,
}: BudgetFormScreenProps) {
  const [form, setForm] = useState<Budget>(budget);
  const [serviceDraft, setServiceDraft] = useState<ServiceDraft | null>(null);
  const [statusToConfirm, setStatusToConfirm] = useState<BudgetStatus | null>(null);

  const subtotal = useMemo(() => getBudgetSubtotal(form), [form]);
  const total = useMemo(() => getBudgetTotal(form), [form]);
  const discountValue = subtotal - total;

  const openServiceModal = (service?: ServiceItem) => {
    if (service) {
      setServiceDraft({
        id: service.id,
        name: service.name,
        description: service.description ?? '',
        unitPrice: String(service.unitPrice),
        quantity: String(service.quantity),
      });
      return;
    }

    setServiceDraft({
      name: '',
      description: '',
      unitPrice: '',
      quantity: '1',
    });
  };

  const saveService = () => {
    if (!serviceDraft) {
      return;
    }

    const normalized: ServiceItem = {
      id: serviceDraft.id ?? `srv-${Date.now()}`,
      name: serviceDraft.name.trim() || 'Servico sem titulo',
      description: serviceDraft.description.trim(),
      unitPrice: Number(serviceDraft.unitPrice || 0),
      quantity: Number(serviceDraft.quantity || 1),
    };

    setForm((current) => {
      const exists = current.services.some((item) => item.id === normalized.id);

      if (exists) {
        return {
          ...current,
          updatedAt: new Date().toISOString(),
          services: current.services.map((item) =>
            item.id === normalized.id ? normalized : item
          ),
        };
      }

      return {
        ...current,
        updatedAt: new Date().toISOString(),
        services: [...current.services, normalized],
      };
    });

    setServiceDraft(null);
  };

  const removeService = (serviceId: string) => {
    setForm((current) => ({
      ...current,
      updatedAt: new Date().toISOString(),
      services: current.services.filter((item) => item.id !== serviceId),
    }));
  };

  const onSelectStatus = (status: BudgetStatus) => {
    if (status === form.status) {
      return;
    }
    setStatusToConfirm(status);
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.topBar}>
          <Pressable onPress={onBack} style={styles.backButton}>
            <Feather name="chevron-left" size={18} color={colors.textPrimary} />
          </Pressable>
          <Text style={styles.screenTitle}>{isEditing ? 'Editar orcamento' : 'Novo orcamento'}</Text>
          <View style={styles.topPlaceholder} />
        </View>

        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Informacoes gerais</Text>
            <AppInput
              placeholder="Titulo"
              value={form.title}
              onChangeText={(value) => setForm((current) => ({ ...current, title: value }))}
            />
            <AppInput
              placeholder="Cliente"
              value={form.client}
              onChangeText={(value) => setForm((current) => ({ ...current, client: value }))}
            />
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Status</Text>
            <View style={styles.statusGrid}>
              {statusOptions.map((status) => {
                const selected = form.status === status;
                return (
                  <Pressable
                    key={status}
                    style={[styles.statusOption, selected && styles.statusOptionSelected]}
                    onPress={() => onSelectStatus(status)}
                  >
                    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                      {selected ? <View style={styles.radioInner} /> : null}
                    </View>
                    <Text style={styles.statusLabel}>{statusLabelMap[status]}</Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Servicos incluidos</Text>
            <View style={styles.serviceList}>
              {form.services.map((service) => (
                <ServiceItemRow
                  key={service.id}
                  item={service}
                  onEdit={() => openServiceModal(service)}
                  onRemove={() => removeService(service.id)}
                />
              ))}
            </View>

            <PrimaryButton
              label="Adicionar servico"
              onPress={() => openServiceModal()}
              variant="secondary"
              icon={<Feather name="plus" size={14} color={colors.purple} />}
              style={styles.addServiceButton}
            />
          </View>

          <View style={styles.panel}>
            <Text style={styles.panelTitle}>Investimento</Text>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>{formatCurrency(subtotal)}</Text>
            </View>

            <View style={styles.discountRow}>
              <Text style={styles.summaryLabel}>Desconto (%)</Text>
              <AppInput
                value={String(form.discountPercent ?? 0)}
                keyboardType="numeric"
                onChangeText={(value) => {
                  const next = Number(value || 0);
                  setForm((current) => ({ ...current, discountPercent: Number.isNaN(next) ? 0 : next }));
                }}
                style={styles.discountInput}
              />
            </View>

            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Desconto</Text>
              <Text style={styles.discountValue}>- {formatCurrency(discountValue)}</Text>
            </View>

            <View style={[styles.summaryRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Valor total</Text>
              <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <PrimaryButton
            label="Cancelar"
            onPress={onBack}
            variant="secondary"
            style={styles.footerButton}
          />
          <PrimaryButton
            label="Salvar"
            onPress={() => onSave({ ...form, updatedAt: new Date().toISOString() })}
            style={styles.footerButton}
          />
        </View>
      </View>

      <Modal visible={!!serviceDraft} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.serviceModal}>
            <View style={styles.serviceHeader}>
              <Text style={styles.modalTitle}>Servico</Text>
              <Pressable onPress={() => setServiceDraft(null)}>
                <Feather name="x" size={18} color={colors.textSecondary} />
              </Pressable>
            </View>

            <AppInput
              placeholder="Nome do servico"
              value={serviceDraft?.name}
              onChangeText={(value) =>
                setServiceDraft((current) => (current ? { ...current, name: value } : current))
              }
            />
            <AppInput
              placeholder="Descricao"
              value={serviceDraft?.description}
              onChangeText={(value) =>
                setServiceDraft((current) => (current ? { ...current, description: value } : current))
              }
            />
            <AppInput
              placeholder="Preco unitario"
              keyboardType="numeric"
              value={serviceDraft?.unitPrice}
              onChangeText={(value) =>
                setServiceDraft((current) => (current ? { ...current, unitPrice: value } : current))
              }
            />
            <AppInput
              placeholder="Quantidade"
              keyboardType="numeric"
              value={serviceDraft?.quantity}
              onChangeText={(value) =>
                setServiceDraft((current) => (current ? { ...current, quantity: value } : current))
              }
            />

            <View style={styles.serviceActions}>
              <PrimaryButton
                label="Cancelar"
                variant="secondary"
                onPress={() => setServiceDraft(null)}
                style={styles.footerButton}
              />
              <PrimaryButton label="Salvar" onPress={saveService} style={styles.footerButton} />
            </View>
          </View>
        </View>
      </Modal>

      <ConfirmModal
        visible={!!statusToConfirm}
        title="Confirmar mudanca de status"
        message="Deseja realmente alterar o status deste orcamento?"
        confirmLabel="Confirmar"
        onCancel={() => setStatusToConfirm(null)}
        onConfirm={() => {
          if (statusToConfirm) {
            setForm((current) => ({ ...current, status: statusToConfirm }));
          }
          setStatusToConfirm(null);
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    paddingHorizontal: spacing.md,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  backButton: {
    width: 34,
    height: 34,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.panel,
  },
  screenTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '700',
  },
  topPlaceholder: {
    width: 34,
  },
  scrollContent: {
    gap: spacing.sm,
    paddingBottom: spacing.xl,
  },
  panel: {
    backgroundColor: colors.panel,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  panelTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  statusGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  statusOption: {
    width: '48%',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    paddingHorizontal: spacing.sm,
    height: 42,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  statusOptionSelected: {
    borderColor: colors.purple,
    backgroundColor: colors.purpleSoft,
  },
  radioOuter: {
    width: 16,
    height: 16,
    borderRadius: radius.pill,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterSelected: {
    borderColor: colors.purple,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: radius.pill,
    backgroundColor: colors.purple,
  },
  statusLabel: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '600',
  },
  serviceList: {
    gap: spacing.xs,
  },
  addServiceButton: {
    marginTop: spacing.xs,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    color: colors.textSecondary,
    fontSize: 14,
  },
  summaryValue: {
    color: colors.textPrimary,
    fontSize: 14,
    fontWeight: '600',
  },
  discountRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  discountInput: {
    width: 90,
    textAlign: 'center',
    paddingHorizontal: spacing.xs,
  },
  discountValue: {
    color: colors.danger,
    fontSize: 14,
    fontWeight: '700',
  },
  totalRow: {
    marginTop: spacing.xs,
    paddingTop: spacing.sm,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  totalLabel: {
    color: colors.textPrimary,
    fontSize: 15,
    fontWeight: '700',
  },
  totalValue: {
    color: colors.textPrimary,
    fontSize: 21,
    fontWeight: '800',
  },
  footer: {
    flexDirection: 'row',
    gap: spacing.sm,
    paddingVertical: spacing.sm,
  },
  footerButton: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  serviceModal: {
    backgroundColor: colors.panel,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.sm,
  },
  serviceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  modalTitle: {
    color: colors.textPrimary,
    fontSize: 17,
    fontWeight: '700',
  },
  serviceActions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.sm,
  },
});

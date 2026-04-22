import { Feather } from '@expo/vector-icons';
import { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BudgetCard } from '../components/BudgetCard';
import { ConfirmModal } from '../components/ConfirmModal';
import { PrimaryButton } from '../components/PrimaryButton';
import { StatusBadge } from '../components/StatusBadge';
import { statusLabelMap } from '../constants/status';
import { colors } from '../theme/colors';
import { radius, spacing } from '../theme/spacing';
import { Budget, BudgetSort, BudgetStatus } from '../types/budget';
import { filterAndSortBudgets } from '../utils/budget';

interface BudgetListScreenProps {
  budgets: Budget[];
  onCreate: () => void;
  onEdit: (budgetId: string) => void;
  onDuplicate: (budgetId: string) => void;
  onDelete: (budgetId: string) => void;
}

const statusOptions: BudgetStatus[] = ['rascunho', 'enviado', 'aprovado', 'recusado'];
const sortOptions: { value: BudgetSort; label: string }[] = [
  { value: 'mais-recente', label: 'Mais recente' },
  { value: 'mais-antigo', label: 'Mais antigo' },
  { value: 'maior-valor', label: 'Maior valor' },
  { value: 'menor-valor', label: 'Menor valor' },
];

export function BudgetListScreen({
  budgets,
  onCreate,
  onEdit,
  onDuplicate,
  onDelete,
}: BudgetListScreenProps) {
  const [search, setSearch] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState<BudgetStatus[]>([]);
  const [sortBy, setSortBy] = useState<BudgetSort>('mais-recente');
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false);
  const [budgetToDelete, setBudgetToDelete] = useState<Budget | null>(null);

  const filteredBudgets = useMemo(() => {
    return filterAndSortBudgets(budgets, search, selectedStatuses, sortBy);
  }, [budgets, search, selectedStatuses, sortBy]);

  const toggleStatus = (status: BudgetStatus) => {
    setSelectedStatuses((current) => {
      if (current.includes(status)) {
        return current.filter((item) => item !== status);
      }
      return [...current, status];
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>Orcamentos</Text>
            <Text style={styles.subtitle}>
              Voce tem {filteredBudgets.length} item(ns) na lista
            </Text>
          </View>

          <PrimaryButton
            label="Novo"
            onPress={onCreate}
            icon={<Feather name="plus" size={16} color="#FFFFFF" />}
            style={styles.newButton}
          />
        </View>

        <View style={styles.searchRow}>
          <View style={styles.searchInput}>
            <Feather name="search" size={16} color={colors.textSecondary} />
            <TextInput
              style={styles.searchField}
              placeholder="Titulo ou cliente"
              placeholderTextColor={colors.textSecondary}
              value={search}
              onChangeText={setSearch}
            />
          </View>

          <Pressable
            onPress={() => setIsFilterModalVisible(true)}
            style={styles.filterButton}
          >
            <Feather name="sliders" size={16} color={colors.purple} />
          </Pressable>
        </View>

        <View style={styles.chipsRow}>
          {selectedStatuses.map((status) => (
            <StatusBadge key={status} status={status} />
          ))}
        </View>

        <FlatList
          data={filteredBudgets}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          renderItem={({ item }) => (
            <BudgetCard
              budget={item}
              onEdit={() => onEdit(item.id)}
              onDuplicate={() => onDuplicate(item.id)}
              onDelete={() => setBudgetToDelete(item)}
            />
          )}
        />
      </View>

      <Modal transparent visible={isFilterModalVisible} animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.filterSheet}>
            <View style={styles.filterHeader}>
              <Text style={styles.filterTitle}>Filtrar e ordenar</Text>
              <Pressable onPress={() => setIsFilterModalVisible(false)}>
                <Feather name="x" size={18} color={colors.textSecondary} />
              </Pressable>
            </View>

            <Text style={styles.sectionTitle}>Status</Text>
            <View style={styles.filterStatusList}>
              {statusOptions.map((status) => {
                const isChecked = selectedStatuses.includes(status);

                return (
                  <Pressable
                    key={status}
                    onPress={() => toggleStatus(status)}
                    style={styles.checkRow}
                  >
                    <View
                      style={[
                        styles.checkbox,
                        isChecked && { borderColor: colors.purple, backgroundColor: colors.purpleSoft },
                      ]}
                    >
                      {isChecked ? <Feather name="check" size={12} color={colors.purple} /> : null}
                    </View>
                    <Text style={styles.checkLabel}>{statusLabelMap[status]}</Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.sectionTitle}>Ordenacao</Text>
            <View style={styles.sortList}>
              {sortOptions.map((option) => {
                const selected = sortBy === option.value;

                return (
                  <Pressable
                    key={option.value}
                    onPress={() => setSortBy(option.value)}
                    style={styles.radioRow}
                  >
                    <View style={[styles.radioOuter, selected && styles.radioOuterSelected]}>
                      {selected ? <View style={styles.radioInner} /> : null}
                    </View>
                    <Text style={styles.checkLabel}>{option.label}</Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.filterActions}>
              <PrimaryButton
                label="Resetar filtros"
                onPress={() => {
                  setSelectedStatuses([]);
                  setSortBy('mais-recente');
                }}
                variant="secondary"
                style={styles.filterActionButton}
              />
              <PrimaryButton
                label="Aplicar"
                onPress={() => setIsFilterModalVisible(false)}
                style={styles.filterActionButton}
              />
            </View>
          </View>
        </View>
      </Modal>

      <ConfirmModal
        visible={!!budgetToDelete}
        title="Excluir orcamento"
        message="Essa acao nao pode ser desfeita. Deseja continuar?"
        confirmLabel="Excluir"
        danger
        onCancel={() => setBudgetToDelete(null)}
        onConfirm={() => {
          if (budgetToDelete) {
            onDelete(budgetToDelete.id);
          }
          setBudgetToDelete(null);
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
    paddingTop: spacing.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    color: colors.purple,
    fontSize: 22,
    fontWeight: '800',
  },
  subtitle: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: spacing.xxs,
  },
  newButton: {
    minWidth: 102,
  },
  searchRow: {
    marginTop: spacing.lg,
    flexDirection: 'row',
    gap: spacing.xs,
  },
  searchInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    backgroundColor: colors.panel,
    height: 42,
    paddingHorizontal: spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  searchField: {
    flex: 1,
    color: colors.textSecondary,
    fontSize: 14,
  },
  filterButton: {
    width: 42,
    height: 42,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.pill,
    backgroundColor: colors.panel,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipsRow: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.xs,
    minHeight: 24,
  },
  listContent: {
    gap: spacing.sm,
    paddingTop: spacing.sm,
    paddingBottom: spacing.xl,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: colors.overlay,
  },
  filterSheet: {
    backgroundColor: colors.panel,
    borderTopLeftRadius: radius.xl,
    borderTopRightRadius: radius.xl,
    padding: spacing.lg,
    gap: spacing.md,
  },
  filterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  filterTitle: {
    color: colors.textPrimary,
    fontSize: 18,
    fontWeight: '800',
  },
  sectionTitle: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
    marginTop: spacing.xs,
  },
  filterStatusList: {
    gap: spacing.sm,
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: radius.sm,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkLabel: {
    color: colors.textPrimary,
    fontSize: 14,
  },
  sortList: {
    gap: spacing.sm,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  radioOuter: {
    width: 18,
    height: 18,
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
    width: 10,
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.purple,
  },
  filterActions: {
    marginTop: spacing.sm,
    flexDirection: 'row',
    gap: spacing.sm,
  },
  filterActionButton: {
    flex: 1,
  },
});

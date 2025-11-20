import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  FlatList,
} from "react-native";
import { useState, useEffect } from "react";
import SummaryCard from "../../src/components/SummaryCard";
import MonthSelector from "../../src/components/MonthSelector";
import BudgetProgress from "../../src/components/BudgetProgress";
import AddTransactionModal, {
  TransactionData,
} from "../../src/components/AddTransactionModal";
import TransactionItem from "../../src/components/TransactionItem";
import EmptyTransactionsList from "../../src/components/EmptyTransactionsList";
import { useSummaryData } from "../../src/hooks/useSummaryData";
import {
  createExpense,
  createIncome,
  updateExpense,
  updateIncome,
  deleteExpense,
  deleteIncome,
  fetchSettings,
} from "../../src/services/api";
import { Expense, Income, Settings } from "../../src/types";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import { colors, spacing, typography, theme } from "../../src/styles";

export default function HomeScreen() {
  const [modalVisible, setModalVisible] = useState(false);
  const [modalType, setModalType] = useState<"income" | "expense">("income");
  const [displayCount, setDisplayCount] = useState(10);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [editMode, setEditMode] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<
    Expense | Income | null
  >(null);
  const [budgetSettings, setBudgetSettings] = useState<Settings | null>(null);
  const { expenses, incomes, loading, error, loadData } =
    useSummaryData(selectedDate);

  // Load budget settings
  const loadBudgetSettings = async () => {
    try {
      const settings = await fetchSettings();
      setBudgetSettings(settings);
    } catch (error) {
      console.error("Error loading budget settings:", error);
    }
  };

  // Load data and budget when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
      loadBudgetSettings();
    }, [selectedDate])
  );

  const handleOpenModal = (
    type: "income" | "expense",
    transaction?: Expense | Income
  ) => {
    setModalType(type);
    if (transaction) {
      setEditMode(true);
      setSelectedTransaction(transaction);
    } else {
      setEditMode(false);
      setSelectedTransaction(null);
    }
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setEditMode(false);
    setSelectedTransaction(null);
  };

  const handleSubmit = async (data: TransactionData) => {
    try {
      if (editMode && data.id) {
        // Update existing transaction
        if (modalType === "income") {
          await updateIncome(data.id, {
            name: data.name,
            amount: parseFloat(data.amount),
            categoryId: parseInt(data.categoryId),
            date: data.date,
          });
          Alert.alert("Onnistui!", "Tulo päivitetty");
        } else {
          await updateExpense(data.id, {
            name: data.name,
            amount: parseFloat(data.amount),
            categoryId: parseInt(data.categoryId),
            date: data.date,
          });
          Alert.alert("Onnistui!", "Meno päivitetty");
        }
      } else {
        // Create new transaction
        if (modalType === "income") {
          await createIncome({
            name: data.name,
            amount: parseFloat(data.amount),
            categoryId: parseInt(data.categoryId),
            date: data.date,
          });
          Alert.alert("Onnistui!", "Tulo lisätty");
        } else {
          await createExpense({
            name: data.name,
            amount: parseFloat(data.amount),
            categoryId: parseInt(data.categoryId),
            date: data.date,
          });

          // Check if budget is exceeded after adding expense
          if (
            budgetSettings?.budgetEnabled &&
            budgetSettings.budgetAmount > 0
          ) {
            const currentTotalExpenses = expenses.reduce(
              (sum, exp) => sum + Number(exp.amount),
              0
            );
            const newTotalExpenses =
              currentTotalExpenses + parseFloat(data.amount);
            const wasUnderBudget =
              currentTotalExpenses <= budgetSettings.budgetAmount;
            const isNowOverBudget =
              newTotalExpenses > budgetSettings.budgetAmount;

            if (wasUnderBudget && isNowOverBudget) {
              Alert.alert(
                "Onneksi olkoon! 🎉",
                `Rahasi ovat nyt loppu tältä kuukaudelta.\n\nBudjetin ylitys: ${(
                  newTotalExpenses - budgetSettings.budgetAmount
                ).toFixed(2)}€ :(`,
                [{ text: "OK" }]
              );
            } else {
              Alert.alert("Onnistui!", "Meno lisätty");
            }
          } else {
            Alert.alert("Onnistui!", "Meno lisätty");
          }
        }
      }

      loadData();
      handleCloseModal();
    } catch (error) {
      Alert.alert("Virhe", "Tallennus epäonnistui");
      console.error("Submit error:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      if (modalType === "income") {
        await deleteIncome(id);
        Alert.alert("Onnistui!", "Tulo poistettu");
      } else {
        await deleteExpense(id);
        Alert.alert("Onnistui!", "Meno poistettu");
      }

      loadData();
      handleCloseModal();
    } catch (error) {
      Alert.alert("Virhe", "Poisto epäonnistui");
      console.error("Delete error:", error);
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color={colors.success} />
        <Text style={styles.loadingText}>Ladataan...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity onPress={loadData} style={styles.retryButton}>
          <Text style={styles.retryButtonText}>Yritä uudelleen</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const monthlyTotalExpenses = expenses.reduce(
    (sum, exp) => sum + Number(exp.amount),
    0
  );
  const monthlyTotalIncomes = incomes.reduce(
    (sum, inc) => sum + Number(inc.amount),
    0
  );

  const latestTransactions = [...expenses, ...incomes]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, displayCount);

  const allTransactions = [...expenses, ...incomes].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const loadMoreTransactions = () => {
    if (displayCount < allTransactions.length) {
      setDisplayCount((prev) => prev + 10);
    }
  };

  // Change month handler
  const changeMonth = (direction: 1 | -1) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
    setDisplayCount(10);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Yhteenveto</Text>
        <MonthSelector
          selectedDate={selectedDate}
          onMonthChange={changeMonth}
        />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <SummaryCard
          totalIncomes={monthlyTotalIncomes}
          totalExpenses={monthlyTotalExpenses}
        />

        {/* Budget Progress */}
        {budgetSettings?.budgetEnabled && budgetSettings.budgetAmount > 0 && (
          <BudgetProgress
            totalExpenses={monthlyTotalExpenses}
            budgetAmount={budgetSettings.budgetAmount}
          />
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            onPress={() => handleOpenModal("income")}
            style={styles.addIncomeButton}
          >
            <Text style={styles.buttonText}>+ Lisää Tulo</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleOpenModal("expense")}
            style={styles.addExpenseButton}
          >
            <Text style={styles.buttonText}>- Lisää Meno</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.eventsSection}>
          <Text style={styles.sectionTitle}>Viimeisimmät tapahtumat</Text>
        </View>
        <View style={styles.flatlistContainer}>
          <FlatList
            data={latestTransactions}
            keyExtractor={(item, index) => `${item.id}-${item.date}-${index}`}
            renderItem={({ item }) => (
              <TransactionItem
                item={item}
                onPress={() => {
                  const type =
                    item.category?.type === "income" ? "income" : "expense";
                  handleOpenModal(type, item);
                }}
              />
            )}
            scrollEnabled={false}
            onEndReached={loadMoreTransactions}
            onEndReachedThreshold={0.5}
            ListEmptyComponent={<EmptyTransactionsList />}
          />
        </View>
      </ScrollView>

      <AddTransactionModal
        visible={modalVisible}
        type={modalType}
        onClose={handleCloseModal}
        onSubmit={handleSubmit}
        onDelete={handleDelete}
        editMode={editMode}
        initialData={selectedTransaction || undefined}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: "center",
  },
  header: {
    width: "100%",
    backgroundColor: "rgba(9, 56, 7, 0.95)",
    paddingTop: spacing.xxl * 2,
    paddingBottom: spacing.lg,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    ...theme.shadows.medium,
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold as any,
    marginBottom: spacing.md,
  },
  scrollContainer: {
    width: "100%",
  },
  scrollContent: {
    alignItems: "center",
    paddingTop: spacing.md,
    paddingBottom: spacing.xxl,
  },
  eventsSection: {
    width: "90%",
    marginTop: spacing.xl,
    marginBottom: spacing.md,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold as any,
  },
  buttonContainer: {
    flexDirection: "row",
    gap: spacing.md,
    marginTop: spacing.lg,
    marginBottom: spacing.md,
    width: "90%",
  },
  addIncomeButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: colors.success,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.medium,
  },
  addExpenseButton: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: colors.danger,
    alignItems: "center",
    justifyContent: "center",
    ...theme.shadows.medium,
  },
  buttonText: {
    color: colors.text.primary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.semibold as any,
    textAlign: "center",
  },
  flatlistContainer: {
    width: "90%",
    paddingBottom: spacing.xxl * 2,
  },
  loadingText: {
    color: colors.text.primary,
    marginTop: spacing.sm,
  },
  errorText: {
    color: colors.danger,
    fontSize: typography.sizes.md,
    textAlign: "center",
    marginHorizontal: spacing.lg,
  },
  retryButton: {
    marginTop: spacing.lg,
    padding: spacing.md,
    borderRadius: theme.borderRadius.md,
    backgroundColor: colors.success,
  },
  retryButtonText: {
    color: colors.text.primary,
    fontWeight: typography.weights.bold as any,
  },
});

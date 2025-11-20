import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  FlatList,
} from "react-native";
import { useSummaryData } from "../../src/hooks/useSummaryData";
import { useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback } from "react";
import MonthSelector from "../../src/components/MonthSelector";
import DonutChart from "../../src/components/DonutChart";
import TransactionItem from "../../src/components/TransactionItem";
import EmptyTransactionsList from "../../src/components/EmptyTransactionsList";
import { colors, spacing, typography, theme } from "../../src/styles";

export default function ReportsScreen() {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<"expense" | "income">("expense");
  const { expenses, incomes, loading, error, loadData } =
    useSummaryData(selectedDate);

  // Reload data when screen comes into focus
  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [selectedDate])
  );

  // Change month handler
  const changeMonth = (direction: 1 | -1) => {
    const newDate = new Date(selectedDate);
    newDate.setMonth(newDate.getMonth() + direction);
    setSelectedDate(newDate);
  };

  // Get transactions based on active tab
  const currentTransactions = activeTab === "expense" ? expenses : incomes;

  // Sort transactions by date (newest first)
  const sortedTransactions = [...currentTransactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Kuukauden erittely</Text>
        <MonthSelector
          selectedDate={selectedDate}
          onMonthChange={changeMonth}
        />
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, activeTab === "expense" && styles.activeTab]}
          onPress={() => setActiveTab("expense")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "expense" && styles.activeTabText,
            ]}
          >
            Menot
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === "income" && styles.activeTab]}
          onPress={() => setActiveTab("income")}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === "income" && styles.activeTabText,
            ]}
          >
            Tulot
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scrollContainer}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {activeTab === "expense" ? (
          <DonutChart data={expenses} title="Menot yhteensä" type="expense" />
        ) : (
          <DonutChart data={incomes} title="Tulot yhteensä" type="income" />
        )}

        <View style={styles.transactionsSection}>
          <Text style={styles.sectionTitle}>
            {activeTab === "expense"
              ? "Kaikki menot kuukaudelta"
              : "Kaikki tulot kuukaudelta"}
          </Text>
          <View style={styles.transactionsList}>
            <FlatList
              data={sortedTransactions}
              keyExtractor={(item, index) => `${item.id}-${item.date}-${index}`}
              renderItem={({ item }) => <TransactionItem item={item} />}
              scrollEnabled={false}
              ListEmptyComponent={<EmptyTransactionsList />}
            />
          </View>
        </View>
      </ScrollView>
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
    paddingTop: 60,
    paddingBottom: spacing.xxl,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: colors.border.light,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  headerTitle: {
    color: colors.text.primary,
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.md,
  },
  scrollContainer: {
    width: "100%",
  },
  scrollContent: {
    alignItems: "center",
    paddingTop: spacing.lg,
    paddingBottom: spacing.xxxl,
  },
  tabContainer: {
    flexDirection: "row",
    width: "90%",
    backgroundColor: colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: spacing.sm,
    marginTop: spacing.xxl,
    ...theme.shadows.small,
  },
  tab: {
    flex: 1,
    paddingVertical: spacing.md,
    alignItems: "center",
    borderRadius: theme.borderRadius.md,
  },
  activeTab: {
    backgroundColor: colors.success,
    ...theme.shadows.medium,
  },
  tabText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
  },
  activeTabText: {
    color: colors.text.primary,
  },
  transactionsSection: {
    width: "90%",
    marginTop: spacing.xxxl,
    marginBottom: spacing.xxxxl,
  },
  sectionTitle: {
    color: colors.text.primary,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.lg,
  },
  transactionsList: {
    width: "100%",
  },
});

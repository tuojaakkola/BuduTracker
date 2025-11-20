import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { formatCurrency } from "../utils/formatUtils";
import { colors, spacing, typography, theme } from "../styles";

interface SummaryCardProps {
  totalIncomes: number;
  totalExpenses: number;
}

export default function SummaryCard({
  totalIncomes,
  totalExpenses,
}: SummaryCardProps) {
  const total = totalIncomes - totalExpenses;

  const incomePercentage =
    totalIncomes + totalExpenses > 0
      ? (totalIncomes / (totalIncomes + totalExpenses)) * 100
      : 50;

  return (
    <View style={styles.summaryCard}>
      <Text style={styles.summaryLabel}>Yhteensä</Text>
      <Text
        style={[
          styles.totalAmount,
          { color: total >= 0 ? colors.success : colors.danger },
        ]}
      >
        {total >= 0 ? "+" : ""}
        {formatCurrency(Number(total))} €
      </Text>

      <View style={styles.barBackground}>
        <View style={[styles.barIncome, { width: `${incomePercentage}%` }]} />
        <View
          style={[styles.barExpense, { width: `${100 - incomePercentage}%` }]}
        />
      </View>

      <View style={styles.row}>
        <View>
          <Text style={styles.label}>Tulot</Text>
          <Text style={styles.incomeText}>
            {formatCurrency(Number(totalIncomes))} €
          </Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.label}>Menot</Text>
          <Text style={styles.expenseText}>
            {formatCurrency(Number(totalExpenses))} €
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    width: "90%",
    backgroundColor: colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: spacing.md,
    marginVertical: spacing.sm,
  },
  summaryLabel: {
    color: colors.text.primary,
    fontSize: typography.sizes.xl,
    marginBottom: spacing.xs,
    fontWeight: typography.weights.semibold,
  },
  totalAmount: {
    fontSize: typography.sizes.xxxl,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.md,
  },
  barBackground: {
    width: "100%",
    height: 6,
    backgroundColor: colors.background.tertiary,
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: spacing.md,
    flexDirection: "row",
  },
  barIncome: {
    height: "100%",
    backgroundColor: colors.success,
  },
  barExpense: {
    height: "100%",
    backgroundColor: colors.danger,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  label: {
    color: colors.text.secondary,
    fontSize: typography.sizes.xs,
    marginBottom: spacing.xs,
  },
  incomeText: {
    color: colors.text.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
  expenseText: {
    color: colors.text.primary,
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.semibold,
  },
});

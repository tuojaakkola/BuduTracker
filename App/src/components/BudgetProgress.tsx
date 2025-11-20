import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, typography, theme } from "../styles";

interface BudgetProgressProps {
  totalExpenses: number;
  budgetAmount: number;
}

export default function BudgetProgress({
  totalExpenses,
  budgetAmount,
}: BudgetProgressProps) {
  const isOverBudget = totalExpenses > budgetAmount;
  const percentage = Math.min((totalExpenses / budgetAmount) * 100, 100);

  return (
    <View style={styles.budgetSection}>
      <View style={styles.budgetHeader}>
        <Text style={styles.budgetTitle}>Kuukausibudjetti</Text>
      </View>
      <View style={styles.budgetAmounts}>
        <Text style={styles.budgetText}>
          {totalExpenses.toFixed(2)}€ / {budgetAmount.toFixed(2)}€
        </Text>
        {isOverBudget && (
          <Text style={styles.budgetOverText}>
            Ylitys: {(totalExpenses - budgetAmount).toFixed(2)}€
          </Text>
        )}
      </View>
      <View style={styles.progressBarContainer}>
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${percentage}%`,
              backgroundColor: isOverBudget ? colors.danger : colors.success,
            },
          ]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  budgetSection: {
    width: "90%",
    backgroundColor: colors.background.secondary,
    padding: spacing.md,
    borderRadius: theme.borderRadius.lg,
    marginTop: spacing.lg,
    marginBottom: spacing.sm,
    ...theme.shadows.medium,
  },
  budgetHeader: {
    marginBottom: spacing.sm,
  },
  budgetTitle: {
    color: colors.text.primary,
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.semibold as any,
  },
  budgetAmounts: {
    marginBottom: spacing.md,
  },
  budgetText: {
    color: colors.success,
    fontSize: typography.sizes.sm,
  },
  budgetOverText: {
    color: colors.danger,
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semibold as any,
    marginTop: spacing.xs,
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: colors.background.tertiary,
    borderRadius: theme.borderRadius.sm,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    borderRadius: theme.borderRadius.sm,
  },
});

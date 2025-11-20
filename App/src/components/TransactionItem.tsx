import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Expense, Income } from "../types";
import { formatCurrency } from "../utils/formatUtils";
import { colors, spacing, typography, theme } from "../styles";

interface TransactionItemProps {
  item: Expense | Income;
  onPress?: () => void;
}

export default function TransactionItem({
  item,
  onPress,
}: TransactionItemProps) {
  const isIncome = item.category?.type === "income";
  const sign = isIncome ? "+" : "-";
  const color = isIncome ? colors.success : colors.danger;

  // Format Date
  const date = new Date(item.date);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const formattedDate = `${day}.${month}`;

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: item.category?.color || colors.background.tertiary,
          },
        ]}
      >
        <MaterialCommunityIcons
          name={(item.category?.icon as any) || "help-circle"}
          size={24}
          color={colors.text.primary}
        />
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.categoryName}>{item.category?.name}</Text>
        <Text style={styles.transactionName}>{item.name}</Text>
        <Text style={styles.date}>Päivämäärä {formattedDate}</Text>
      </View>

      <Text style={[styles.amount, { color }]}>
        {sign}
        {formatCurrency(Number(item.amount))} €
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: spacing.md,
    marginBottom: spacing.sm,
    gap: spacing.md,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: theme.borderRadius.md,
    alignItems: "center",
    justifyContent: "center",
  },
  contentContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: typography.sizes.sm,
    color: colors.text.secondary,
    marginBottom: spacing.xs,
  },
  transactionName: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.semibold,
    color: colors.text.primary,
    marginBottom: spacing.xs,
  },
  date: {
    fontSize: typography.sizes.xs,
    color: colors.text.secondary,
  },
  amount: {
    fontSize: typography.sizes.base,
    fontWeight: typography.weights.bold,
  },
});

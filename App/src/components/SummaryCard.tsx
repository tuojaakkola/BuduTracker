import React from "react";
import { View, Text, StyleSheet } from "react-native";

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
          { color: total >= 0 ? "#4ade80" : "#ef4444" },
        ]}
      >
        {total >= 0 ? "+" : ""}
        {total.toFixed(2)} €
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
          <Text style={styles.incomeText}>{totalIncomes.toFixed(2)} €</Text>
        </View>
        <View style={{ alignItems: "flex-end" }}>
          <Text style={styles.label}>Menot</Text>
          <Text style={styles.expenseText}>{totalExpenses.toFixed(2)} €</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  summaryCard: {
    width: "90%",
    backgroundColor: "#1a1f1aff",
    borderRadius: 12,
    padding: 12,
    marginVertical: 8,
  },
  summaryLabel: {
    color: "#7a8a7aff",
    fontSize: 12,
    marginBottom: 3,
  },
  totalAmount: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 8,
  },
  barBackground: {
    width: "100%",
    height: 6,
    backgroundColor: "#2d3d2dff",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 8,
    flexDirection: "row",
  },
  barIncome: {
    height: "100%",
    backgroundColor: "#4ade80",
  },
  barExpense: {
    height: "100%",
    backgroundColor: "#ef4444",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  label: {
    color: "#7a8a7aff",
    fontSize: 10,
    marginBottom: 2,
  },
  incomeText: {
    color: "#ecececff",
    fontSize: 13,
    fontWeight: "600",
  },
  expenseText: {
    color: "#ecececff",
    fontSize: 13,
    fontWeight: "600",
  },
});

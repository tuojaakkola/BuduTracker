import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Expense, Income } from "../types";

interface TransactionItemProps {
  item: Expense | Income;
}

export default function TransactionItem({ item }: TransactionItemProps) {
  const isIncome = item.category?.type === "income";
  const sign = isIncome ? "+" : "-";
  const color = isIncome ? "#4CAF50" : "#F44336";

  // Format Date
  const date = new Date(item.date);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const formattedDate = `${day}.${month}`;

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Text style={styles.icon}>{item.category?.icon}</Text>
      </View>

      <View style={styles.contentContainer}>
        <Text style={styles.categoryName}>{item.category?.name}</Text>
        <Text style={styles.transactionName}>{item.name}</Text>
        <Text style={styles.date}>Päivämäärä {formattedDate}</Text>
      </View>

      <Text style={[styles.amount, { color }]}>
        {sign}
        {item.amount.toFixed(2)} €
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#1a1f1aff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    gap: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: "#222525ff",
    alignItems: "center",
    justifyContent: "center",
  },
  icon: {
    fontSize: 20,
  },
  contentContainer: {
    flex: 1,
  },
  categoryName: {
    fontSize: 12,
    color: "#7a8a7aff",
    marginBottom: 2,
  },
  transactionName: {
    fontSize: 14,
    fontWeight: "600",
    color: "#ecececff",
    marginBottom: 2,
  },
  date: {
    fontSize: 11,
    color: "#7a8a7aff",
  },
  amount: {
    fontSize: 14,
    fontWeight: "bold",
  },
});

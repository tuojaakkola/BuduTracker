import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { formatMonth } from "../utils/dateUtils";
import { colors, spacing, typography, theme } from "../styles";

interface MonthSelectorProps {
  selectedDate: Date;
  onMonthChange: (direction: 1 | -1) => void;
}

export default function MonthSelector({
  selectedDate,
  onMonthChange,
}: MonthSelectorProps) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => onMonthChange(-1)}
        style={styles.arrowButton}
      >
        <Text style={styles.arrowText}>‹</Text>
      </TouchableOpacity>
      <Text style={styles.monthText}>{formatMonth(selectedDate)}</Text>
      <TouchableOpacity
        onPress={() => onMonthChange(1)}
        style={styles.arrowButton}
      >
        <Text style={styles.arrowText}>›</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: spacing.xxl,
    paddingVertical: spacing.sm,
  },
  monthText: {
    color: colors.text.primary,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
    minWidth: 180,
    textAlign: "center",
  },
  arrowButton: {
    width: 30,
    height: 30,
    borderRadius: theme.borderRadius.full,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  arrowText: {
    color: colors.text.primary,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.regular,
  },
});

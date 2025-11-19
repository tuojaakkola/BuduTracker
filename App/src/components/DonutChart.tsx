import { View, Text, StyleSheet } from "react-native";
import { Expense, Income } from "../types";
import PieChart from "react-native-pie-chart";
import { formatCurrency } from "../utils/formatUtils";
import { colors, spacing, typography, theme } from "../styles";

interface DonutChartProps {
  data: (Expense | Income)[];
  title: string;
  type: "expense" | "income";
}

export default function DonutChart({ data, title, type }: DonutChartProps) {
  const totals: Record<string, { sum: number; color: string; name: string }> =
    {};

  data.forEach((item) => {
    const name = item.category?.name || "Muu";
    const color = item.category?.color || "#cccccc";
    if (!totals[name]) totals[name] = { sum: 0, color, name };
    totals[name].sum += Number(item.amount);
  });

  const categories = Object.values(totals).sort((a, b) => b.sum - a.sum);
  const total = categories.reduce((sum, cat) => sum + cat.sum, 0);

  if (!total) {
    return (
      <View style={styles.container}>
        <View style={styles.card}>
          <Text style={styles.title}>{title}</Text>
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>Ei dataa</Text>
          </View>
        </View>
      </View>
    );
  }

  const series = categories.map((c) => ({
    value: c.sum,
    color: c.color,
  }));

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.chartWrapper}>
          <PieChart widthAndHeight={250} series={series} cover={0.65} />
          <View style={styles.centerText}>
            <Text style={styles.centerLabel}>{title}</Text>
            <Text style={styles.centerAmount}>
              {formatCurrency(Number(total))}€
            </Text>
          </View>
        </View>

        <View style={styles.legend}>
          {categories.map((cat, i) => {
            const percentage = ((cat.sum / total) * 100)
              .toFixed(1)
              .replace(".", ",");
            return (
              <View key={i} style={styles.legendItem}>
                <View
                  style={[styles.legendColor, { backgroundColor: cat.color }]}
                />
                <Text style={styles.legendLabel}>{cat.name}</Text>
                <Text style={styles.legendPercentage}>{percentage}%</Text>
                <Text style={styles.legendValue}>
                  {formatCurrency(Number(cat.sum))}€
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    marginVertical: spacing.xl,
  },
  card: {
    backgroundColor: colors.background.secondary,
    borderRadius: theme.borderRadius.lg,
    padding: spacing.lg,
  },
  header: {
    alignItems: "center",
    marginBottom: spacing.xxl,
  },
  title: {
    color: colors.text.primary,
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
    marginBottom: spacing.md,
  },
  totalAmount: {
    color: colors.text.primary,
    fontSize: typography.sizes.xxxxl,
    fontWeight: typography.weights.bold,
  },
  chartWrapper: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: spacing.xxl,
    position: "relative",
  },
  centerText: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
  },
  centerLabel: {
    color: colors.text.secondary,
    fontSize: typography.sizes.sm,
    marginBottom: spacing.sm,
  },
  centerAmount: {
    color: colors.text.primary,
    fontSize: typography.sizes.xxl,
    fontWeight: typography.weights.bold,
  },
  legend: {
    marginTop: spacing.lg,
  },
  legendItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: spacing.md,
  },
  legendColor: {
    width: 16,
    height: 16,
    borderRadius: theme.borderRadius.sm,
    marginRight: spacing.sm,
  },
  legendLabel: {
    flex: 1,
    color: colors.text.primary,
    fontSize: typography.sizes.base,
  },
  legendPercentage: {
    color: colors.text.secondary,
    fontSize: typography.sizes.base,
    marginRight: spacing.lg,
  },
  legendValue: {
    color: colors.text.secondary,
    fontSize: typography.sizes.base,
  },
  emptyContainer: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyText: {
    color: colors.text.secondary,
    fontSize: typography.sizes.lg,
  },
});

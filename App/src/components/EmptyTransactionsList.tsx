import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { colors, spacing, typography } from "../styles";

export default function EmptyTransactionsList() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ei tapahtumia tälle kuukaudelle</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: spacing.xxl,
    alignItems: "center",
  },
  text: {
    color: colors.text.secondary,
    fontSize: typography.sizes.md,
    textAlign: "center",
  },
});

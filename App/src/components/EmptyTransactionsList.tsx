import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function EmptyTransactionsList() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Ei tapahtumia tälle kuukaudelle</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 40,
    alignItems: "center",
  },
  text: {
    color: "#7a8a7aff",
    fontSize: 16,
    textAlign: "center",
  },
});

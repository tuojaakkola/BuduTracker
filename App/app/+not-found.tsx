import { StyleSheet, Text, View } from "react-native";
import { colors, typography, spacing } from "../src/styles";

export default function NotFound() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>404 - Not Found</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    color: colors.text.primary,
    fontSize: typography.sizes.lg,
  },
});
